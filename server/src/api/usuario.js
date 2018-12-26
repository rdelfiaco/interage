const { checkTokenAccess } = require('./checkTokenAccess');

function login(req, res) {
  console.log('Chama Login')
  return new Promise(function (resolve, reject) {
    const dbconnection = require('../config/dbConnection')
    const { Client } = require('pg')
    const { SHA1 } = require('./SHA1.js')

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
          client.query(`insert into historico_login(id_usuario, ip, datahora, token_access, ativo)
            VALUES ( ${res.rows[0].id} , '${req.ip}', now(), '${token_access}', true ) `);

          let usuario = res.rows[0];
          delete usuario.senha;
          delete usuario.login;
          usuario.token = token_access;
          resolve(usuario)
          client.end();
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
                    WHERE token_access='${req.query.token}' OR id_usuario=${req.query.id_usuario}`

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
                  WHERE id_organograma = 4 and responsavel_membro = 'M' order by pessoas.nome`

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
      const { SHA1 } = require('./SHA1.js')

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
              console.log(atualizaSenha)
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

module.exports = { login, logout, getAgentesVendas, trocarSenhaUsuarioLogado }  