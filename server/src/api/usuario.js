const { checkTokenAccess } = require('./checkTokenAccess');
const { executaSQL } = require('./executaSQL');
const { adicionarPessoa } = require( './pessoa')
function login(req, res) {

  return new Promise(function (resolve, reject) {
    const dbconnection = require('../config/dbConnection')
    const { Client } = require('pg')

    const client = new Client(dbconnection)

    client.connect()

    const senhaCriptografada = req.query.senha
    let sql = `SELECT u.*, pe.apelido_fantasia as apelido, ddd, telefone 
                from usuarios u
                inner join pessoas pe on u.id_pessoa = pe.id
                left join pessoas_telefones tel on pe.id = tel.id_pessoa and principal 
                where login = '${req.query.login}' AND senha='${senhaCriptografada}'`
    client.query(sql)
      .then(res => {
        if (res.rowCount > 0) {
          let token_access = generateTokenUserAcess()
          let usuario = res.rows[0];

          client.query(`insert into historico_login(id_usuario, ip, datahora, token_access, ativo)
            VALUES ( ${res.rows[0].id} , '${req.ip}', now(), '${token_access}', true ) `)
            .then(res => {


              delete usuario.senha;
              delete usuario.login;
              usuario.token = token_access;

              resolve(usuario)
              client.end();
            })
            .catch(err => {
              client.end();
              reject('Historio de login não criado : ', err)
            })

        }
        else {
          client.end();
          reject('Usuário não encontrato')
        }
      })
      .catch(err => {
        client.end();
        reject(err)
      })
  })
}

function logout(req, res) {
  return new Promise(function (resolve, reject) {
    const dbconnection = require('../config/dbConnection')
    const { Client } = require('pg')

    const client = new Client(dbconnection)

    client.connect()

    let sql = `UPDATE historico_login SET ativo=false
                    WHERE token_access = '${req.query.token}' OR id_usuario = ${req.query.id_usuario}`


    client.query(sql)
      .then(res => {
        client.end();
        resolve(true)
      })
      .catch(err => {
        client.end();
        console.log(err)
        reject('Token não encontrado')
      })
  })
}

function generateTokenUserAcess() {
  return rand() + rand();

  function rand() {
    return Math.random().toString(36).substr(2);
  };
};


function getAgentesVendas(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT pessoas.nome, usuarios.id_pessoa FROM usuarios
                  INNER JOIN pessoas ON pessoas.id = usuarios.id_pessoa 
                  WHERE id_organograma = 4 and responsavel_membro = 'M' and usuarios.status
                  order by pessoas.nome`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let agentesVendas = res.rows;

            client.end();
            resolve(agentesVendas)
          }
          else {
            client.end();
            reject('Usuário não encontrado')
          }
        }
        )
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function trocarSenhaUsuarioLogado(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      const senhaCriptografadaAntiga = req.query.senhaAntiga;
      const senhaCriptografadaNova = req.query.senhaNova;
      const senhaCriptografadaNovaRepete = req.query.senhaNovaRepete;

      let buscaUsuario = `SELECT * from usuarios WHERE senha='${senhaCriptografadaAntiga}' AND id=${req.query.id_usuario}`

      client.query(buscaUsuario)
        .then(res => {
          if (res.rowCount > 0) {
            let usuario = res.rows;
            if (senhaCriptografadaNova == senhaCriptografadaNovaRepete) {
              let atualizaSenha = `UPDATE usuarios SET senha='${senhaCriptografadaNova}' WHERE id=${req.query.id_usuario} RETURNING id`
              client.query(atualizaSenha)
                .then(res => {
                  if (res.rowCount > 0) {
                    client.end();
                    resolve(res.rows[0])
                  }
                  else {
                    client.end();
                    reject('Não foi possivel trocar a senha!')
                  }
                })
            }
            else {
              client.end();
              reject('Senhas novas não são iguais!')
            }
          }
          else {
            client.end();
            reject('Usuário não encontrado')
          }
        }
        )
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getUsuarios(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select u.*, p.nome, p.cpf_cnpj, o.nome as departamento,  u.id as id_usuario, 
                iif( p.apelido_fantasia is null, p.nome , p.apelido_fantasia) as apelido   
                from usuarios u
                inner join pessoas p on u.id_pessoa = p.id
                inner join organograma o on u.id_organograma = o.id
                order by p.nome`

    executaSQL(credenciais, sql)
      .then(res => {
          let usuarios = res;
          resolve(usuarios)
      })
      .catch(err => {
        reject(`Erro no getUsuarios :  ${err}`)
      })
  })
}

function salvarUsuario(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = ` UPDATE public.usuarios  SET  
                  login='${req.query.login}',  
                  id_organograma=${req.query.id_organograma} , 
                  status=${req.query.status} ,  
                  responsavel_membro= '${req.query.responsavel_membro}' ,  
                  hora_entrada='${req.query.hora_entrada}' , 
                  hora_saida='${req.query.hora_saida}' , 
                  hora_entrada_lanche='${req.query.hora_entrada_lanche}' , 
                  hora_saida_lanche='${req.query.hora_saida_lanche}' , 
                  possui_carteira_cli=${req.query.possui_carteira_cli} 
                WHERE  id = ${req.query.id} `
    executaSQL(credenciais, sql)
      .then(res => {
          let usuarios = res;
          resolve(usuarios)
      })
      .catch(err => {
        reject(`Erro no salvarUsuario :  ${err}`)
      })
  })
}

function excluirUsuario(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = ` delete from public.usuarios  
                WHERE  id = ${req.query.id} `
    executaSQL(credenciais, sql)
      .then(res => {
          let usuarios = res;
          resolve(usuarios)
      })
      .catch(err => {
        reject(`Erro no excluirUsuario :  ${err}`)
      })
  })
}

function adicionarUsuario(req, res){
  return new Promise(function (resolve, reject) {
    let id_pessoa = req.query.id_pessoa; 
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    if (id_pessoa == ''){

      let ret = [];
      ret.push("(")
      ret.push("nome,")
      ret.push("tipo,")
      ret.push('cpf_cnpj,')
      ret.push('apelido_fantasia,')
      ret.push('dtinclusao,')
      ret.push('dtalteracao,')
      ret.push('id_usuario_incluiu')
      ret.push(')')

      ret.push('VALUES(')

      ret.push("'" + req.query.nome + "',")
      ret.push("'F',")
      ret.push((req.query.cpf_cnpj != '' ? "'" + req.query.cpf_cnpj + "'" : 'NULL') + ",")
      ret.push("'" + req.query.nome + "',")
      ret.push('now(),')
      ret.push('now(),')
      ret.push(req.query.id_usuario)
      ret.push(')')
      ret = ret.join(' ');

      let sql = `INSERT INTO pessoas ${ret} RETURNING id`;
      console.log(sql)
      executaSQL(credenciais, sql)
      .then(res => {
          id_pessoa = res.id;
          req.query.id_pessoa = id_pessoa;
          inserirUsuario(req, id_pessoa);
          resolve( res )
      })
      .catch(err => {
      reject(`Erro no adicionar usuário :  ${err}`)
      })  
    } else {
      inserirUsuario(req, id_pessoa)
      resolve( )

    }

    function inserirUsuario(req, id_pessoa ){

      let ret = [];
      ret.push("(")
      ret.push("login,")
      ret.push("senha,")
      ret.push('data_senha,')
      ret.push('id_organograma,')
      ret.push('status,')
      ret.push('dashboard,')
      ret.push('responsavel_membro,')
      ret.push('id_pessoa,')
      ret.push('hora_entrada,')
      ret.push('hora_saida,')
      ret.push('hora_entrada_lanche,')
      ret.push('hora_saida_lanche,')
      ret.push('color_r,')
      ret.push('color_g,')
      ret.push('color_b,')
      ret.push('possui_carteira_cli')
      ret.push(')')

      ret.push('VALUES(')

      ret.push("'" + req.query.login + "',")
      ret.push("'40bd001563085fc35165329ea1ff5c5ecbdbbeef',")
      ret.push(" now() ,")
      ret.push(req.query.id_organograma + ",")
      ret.push(req.query.status + ",")
      ret.push("'" + req.query.dashboard + "',")
      ret.push("'" + req.query.responsavel_membro + "',")
      ret.push(id_pessoa + ",")
      ret.push("'" + req.query.hora_entrada + "',")
      ret.push("'" + req.query.hora_saida + "',")
      ret.push("'" + req.query.hora_entrada_lanche + "',")
      ret.push("'" + req.query.hora_saida_lanche + "',")
      ret.push(req.query.color_r + ",")
      ret.push(req.query.color_g + ",")
      ret.push(req.query.color_b + ",")
      ret.push(req.query.possui_carteira_cli)
      ret.push(')')
      ret = ret.join(' ');

      let sql = `INSERT INTO usuarios ${ret} RETURNING id`;
      executaSQL(credenciais, sql)
      .then(res => {
          resolve( res )
      })
      .catch(err => {
      reject(`Erro no adicionar usuário :  ${err}`)
      }) 

      return

    }


  });
}


module.exports = { login, 
                  logout, 
                  getAgentesVendas, 
                  trocarSenhaUsuarioLogado, 
                  getUsuarios, 
                  salvarUsuario,
                  excluirUsuario,
                  adicionarUsuario }  