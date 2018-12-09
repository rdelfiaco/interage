const { checkTokenAccess } = require('./checkTokenAccess');

function importaLead(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      var bodyStr = '';

      req.on("data", function (chunk) {
        bodyStr += chunk.toString();
      });
      req.on("end", function () {
        const file = JSON.parse(bodyStr);

        const dbconnection = require('../config/dbConnection')
        const { Client } = require('pg')
        const client = new Client(dbconnection)

        client.connect()

        file.forEach(pessoa => {
          ///TRABALHAR AQUI

          client.query('BEGIN').then((res1) => {

            // monta sql inserte pessoa 
            let sqlInsertPessoa = fsqlInsertPessoa(pessoa);
            executaSQL(client, sqlInsertPessoa).then( res => {
              pessoa.id_pessoa = res[0].id;

              let regEndereco = fregEndereco(pessoa)

              salvarEnderecoPessoa(client, regEndereco).then( res => {

                if (pessoa.fone1 != '' && pessoa.fone1 != null) {
                let reqFone = {
                  id_pessoa: pessoa.id_pessoa,
                  ddd: pessoa.ddd1,
                  telefone: pessoa.fone1,
                  principal: true,
                  ramal: null,
                  id_tipo_telefone: 2,
                  contato: null,
                  ddi: 55
                }
                salvarTelefonePessoa(client, reqFone).then( res => {

                }).catch(err => { 
                  reject(err); 
                });
              }

              if (pessoa.fone2 != '' && pessoa.fone2 != null) {
                let reqFone = {
                  id_pessoa: pessoa.id_pessoa,
                  ddd: pessoa.ddd2,
                  telefone: pessoa.fone2,
                  principal: false,
                  ramal: null,
                  id_tipo_telefone: 2,
                  contato: null,
                  ddi: 55
                }
                salvarTelefonePessoa(client, reqFone).then( res => {

                }).catch(err => { 
                  reject(err); 
                });
              }
              if (pessoa.fone3 != '' && pessoa.fone3 != null) {
                let reqFone = {
                  id_pessoa: pessoa.id_pessoa,
                  ddd: pessoa.ddd3,
                  telefone: pessoa.fone3,
                  principal: false,
                  ramal: null,
                  id_tipo_telefone: 2,
                  contato: null,
                  ddi: 55
                }
                salvarTelefonePessoa(client, reqFone).then( res => {

                }).catch(err => {
                  reject(err); 
                });
              }

              if (index == array.length - 1) {
                client.query('COMMIT').then((resposta) => {
                    console.log('Arquivo Importado')
                    client.end();
                    resolve('Arquivo Importado');
                })
              }
              if (err) {
                client.query('ROLLBACK').then((resposta) => {
                  client.end();
                  console.log('Erro ao processar arquivo importado')
                  reject('Erro ao processar arquivo importado')
                }).catch(err => {
                  client.end();
                  reject(err)
                })
              }

            }).catch(err => { 
              reject(err);});

            }).catch(err => { 
              reject(err); 
            });
           
            });
        });
      });
    }).catch(err => {reject(err);});
  });
}
  




async function executaSQL(client, req,  res) {
  try {
    return new Promise(function (resolve, reject) {
      client.query(req)
        .then(res => {
          let registros = res.rows;
          resolve(registros);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  catch (e) {
    reject(e);
  }
}


function fsqlInsertPessoa(pessoa){
  let sql = `INSERT INTO public.pessoas(`
  let value = ` VALUES (`
  if (pessoa.tipo_pessoa != '' && pessoa.tipo_pessoa != undefined){
    sql = sql + 'tipo,'
    value = value + ` '${pessoa.tipo_pessoa}', `}
  if (pessoa.email != '' && pessoa.email != undefined ) {
    sql = sql + 'email,'
    value = value + ` '${pessoa.email}', `}
  if (pessoa.cpf_cnpj != '' && pessoa.cpf_cnpj != undefined ){
    sql = sql + 'cpf_cnpj,'
    value = value + ` '${pessoa.cpf}', `}
  if (pessoa.observacoes != '' && pessoa.observacoes != undefined ){
    sql = sql + 'observacoes,'
    value = value + ` '${pessoa.observacoes}', `}
  if (pessoa.origem_lead != '' && pessoa.origem_lead != undefined ){
    sql = sql + 'origem_lead,'
    value = value + ` '${pessoa.origem_lead}', `}
  if (pessoa.id_origem_lead != '' && pessoa.id_origem_lead != undefined ){
    sql = sql + 'id_origem_lead,'
    value = value + ` '${pessoa.id_origem_lead}', `}

  sql = sql + `
      nome, 
      dtinclusao, 
      dtalteracao, 
      lead`

  value = value + `
      '${pessoa.nome}',
      now(),
      now(),
      true `
   
  sql = sql + `)`
  value = value + `) RETURNING id ;`
  sql = sql + value

  return (sql)
}

function fregEndereco(pessoa){
  let reg = {
    id_pessoa: pessoa.id_pessoa,
    cidade : pessoa.cidade,
    cep : pessoa.cep,
    logradouro : pessoa.rua,
    bairro : pessoa.bairro,
    complemento : pessoa.complemento,
    uf_cidade : pessoa.uf
  }
  return (reg)
}



async function salvarEnderecoPessoa(client, req, res) {
  return new Promise(function (resolve, reject) {

    if (req.cidade != '' && req.cidade != null) { 

      let update;
        const queryCidade = `SELECT * from cidades 
                             WHERE cidades.nome='${req.cidade}' AND cidades.uf_cidade='${req.uf_cidade.toUpperCase().trim()}'`
        client.query(queryCidade).then((cidade) => {
          if (cidade.rowCount) {
            req.id_cidade = cidade.rows[0].id;
            salvaEndereco();
          }
          else {
            insereCidade()
          }
          function insereCidade() {
            insert = `INSERT INTO cidades(
              nome, uf_cidade, status)
              VALUES('${req.cidade}',
                    '${req.uf_cidade.toUpperCase().trim()}',
                    TRUE
                    ) RETURNING id`;
            client.query(insert).then((res) => {
              req.id_cidade = res.rows[0].id
              salvaEndereco()
            }).catch(e => {
              reject(e);
            })
          }
          function salvaEndereco() {
            let selectEnderecos = `SELECT * FROM pessoas_enderecos 
                                   WHERE pessoas_enderecos.id_pessoa=${req.id_pessoa}`
            client.query(selectEnderecos).then((enderecosPessoas) => {
              let recebe_correspondencia = false;
              if (!enderecosPessoas.rowCount) recebe_correspondencia = true;

              if (req.id)
                update = `UPDATE pessoas_enderecos SET
                      id_cidade=${req.id_cidade},
                      cep=${req.cep},
                      logradouro='${req.logradouro.trim()}',
                      bairro='${req.bairro.trim()}',
                      complemento='${req.complemento.trim()}',
                      recebe_correspondencia=${recebe_correspondencia}
                      WHERE pessoas_enderecos.id=${req.id}`;
              else
                update = `INSERT INTO pessoas_enderecos(
                      id_pessoa, id_cidade, cep, logradouro, bairro, complemento, recebe_correspondencia)
                      VALUES(${req.id_pessoa},
                            ${req.id_cidade},
                            ${req.cep},
                            '${req.logradouro.trim()}',
                            '${req.bairro.trim()}',
                            '${req.complemento.trim()}',
                            '${recebe_correspondencia}'
                            )`;
                    Console.log(update)
              client.query(update).then((res) => {
                  resolve('Endereço inserido com sucesso')
              }).catch(err => {
                  reject(err)
              })
            }).catch(err => {
              reject(err)
            })
          }
        }).catch(err => {
          reject(err)
        })
    } else resolve('Faltou o nome da cidade');
  });
}


async function salvarTelefonePessoa(client, req, res) {
  return new Promise(function (resolve, reject) {

        const buscaTelefone = `SELECT * FROM pessoas_telefones WHERE pessoas_telefones.id_pessoa = ${req.id_pessoa}`

        client.query(buscaTelefone).then((telefonesPessoa) => {
          let principal = false;
          if (!telefonesPessoa.rowCount) principal = true
          if (req.id)
            update = `UPDATE pessoas_telefones SET
                      ddd='${req.ddd}',
                      telefone='${req.telefone}',
                      ramal=${req.ramal || null},
                      principal=${principal},
                      id_tipo_telefone=${req.id_tipo_telefone},
                      contato='${req.contato}',
                      ddi=${req.ddi}
                      WHERE pessoas_telefones.id=${req.id}`;
          else
            update = `INSERT INTO pessoas_telefones(
            id_pessoa, ddd, telefone, ramal, principal, id_tipo_telefone, contato, ddi)
            VALUES('${req.id_pessoa}',
                  '${req.ddd}',
                  '${req.telefone}',
                  ${req.ramal || null},
                  ${req.principal},
                  ${req.id_tipo_telefone},
                  '${req.contato}',
                  '${req.ddi}')`;

          client.query(update).then((res) => {
            resolve('telefone inserido/alterado')
          }).catch(err => {reject('Telefone não inserido', err)})
    }).catch(e => {reject(e)});
  })
}


module.exports = { importaLead }