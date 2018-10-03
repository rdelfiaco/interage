const { checkTokenAccess } = require('./checkTokenAccess');

function getPessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      console.log('req.query.id_pessoa', req.query.id_pessoa)
      client.connect()
      let sql = `SELECT * FROM pessoas
                  WHERE id=${req.query.id_pessoa}`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let pessoa = res.rows;
            getEnderecos().then(enderecos => {
              getTelefones().then(telefones => {
                client.end();
                resolve({ principal: pessoa[0], enderecos, telefones })
              }).catch(e => {
                reject(e);
              })
            }).catch(e => {
              reject(e);
            })

          }
          else reject('Não há eventos!')
        }).catch(e => {
          reject(e);
        })


      function getEnderecos() {
        return new Promise((resolve, reject) => {
          let sqlEnderecos = `SELECT * FROM pessoas_enderecos
															WHERE id_pessoa=${req.query.id_pessoa}`

          client.query(sqlEnderecos).then(res => {
            resolve(res.rows);
          })
        })
      }

      function getTelefones() {
        return new Promise((resolve, reject) => {
          let sqlTelefones = `SELECT * FROM pessoas_telefones
															WHERE id_pessoa=${req.query.id_pessoa}`

          client.query(sqlTelefones).then(res => {
            resolve(res.rows);
          })
        })
      }
    }).catch(e => {
      reject(e)
    })
  })
}

function salvarPessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let update;
      client.query('BEGIN').then((res1) => {
        if (req.query.tipo == 'F')
          update = `UPDATE pessoas SET
            nome='${req.query.nome}',
            tipo='${req.query.tipo}',
            id_pronome_tratamento=${req.query.id_pronome_tratamento},
            sexo='${req.query.sexo}',
            rg_ie='${req.query.rg_ie}',
            orgaoemissor='${req.query.orgaoemissor}',
            cpf_cnpj='${req.query.cpf_cnpj}',
            email='${req.query.email}',
            website='${req.query.website}',
            observacoes='${req.query.observacoes}',
            dtalteracao=now()

            apelido_fantasia=null

            WHERE pessoas.id=${req.query.id};
            `;

        else if (req.query.tipo == 'J')
          update = `UPDATE pessoas SET
            nome='${req.query.nome}',
            tipo='${req.query.tipo}',
            apelido_fantasia='${req.query.apelido_fantasia}',
            id_pronome_tratamento=${req.query.id_pronome_tratamento},
            sexo='${req.query.sexo}',
            rg_ie='${req.query.rg_ie}',
            orgaoemissor='${req.query.orgaoemissor}',
            cpf_cnpj='${req.query.cpf_cnpj}',
            email='${req.query.email}',
            website='${req.query.website}',
            observacoes='${req.query.observacoes}',
            dtalteracao=now()

            WHERE pessoas.id=${req.query.id};
            `;

        client.query(update).then((res) => {
          client.query('COMMIT').then((resposta) => {
            client.end();
            resolve(resposta)
          }).catch(e => {
            reject(e);
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(e => {
            reject(e)
          })
        })
      }).catch(e => {
        reject(e);
      })
    }).catch(e => {
      reject(e);
    });
  });

}

function getTipoTelefone(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()
      let sql = `SELECT * FROM tipo_telefone`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let tipo_telefone = res.rows;

            client.end();
            resolve(tipo_telefone)
          }
          reject('Erro ao buscar tipos de telefones')
        }
        )
        .catch(err => console.log(err)) //reject( err.hint ) )
    }).catch(e => {
      reject(e)
    })
  })
}

function salvarTelefonePessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let update;
      client.query('BEGIN').then((res1) => {
        if (req.query.id)
          update = `UPDATE pessoas_telefones SET
                      ddd='${req.query.ddd}',
                      telefone='${req.query.telefone}',
                      ramal=${req.query.ramal || 'null'},
                      principal=false,
                      id_tipo_telefone=${req.query.id_tipo_telefone},
                      contato='${req.query.contato}',
                      ddi=55
                      WHERE pessoas_telefones.id=${req.query.id}`;
        else
          update = `INSERT INTO pessoas_telefones(
            id_pessoa, ddd, telefone, ramal, principal, id_tipo_telefone, contato, ddi)
            VALUES('${req.query.id_pessoa}',
                  '${req.query.ddd}',
                  '${req.query.telefone}',
                  ${req.query.ramal || 'null'},
                  false,
                  ${req.query.id_tipo_telefone},
                  '${req.query.contato}',
                  '55')`;

        client.query(update).then((res) => {
          client.query('COMMIT').then((resposta) => {
            client.end();
            resolve(resposta)
          }).catch(e => {
            reject(e);
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(e => {
            reject(e)
          })
        })
      }).catch(e => {
        reject(e);
      })
    }).catch(e => {
      reject(e);
    });
  })
}

function excluirTelefonePessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let del;
      client.query('BEGIN').then((res1) => {
        if (!req.query.id_telefone) return reject('Não tem telefone selecionado')
        del = `DELETE FROM pessoas_telefones
                      WHERE pessoas_telefones.id=${req.query.id_telefone}`;

        client.query(del).then((res) => {
          client.query('COMMIT').then((resposta) => {
            client.end();
            resolve(resposta)
          }).catch(e => {
            reject(e);
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(e => {
            reject(e)
          })
        })
      }).catch(e => {
        reject(e);
      })
    }).catch(e => {
      reject(e);
    });
  })
}

module.exports = { getPessoa, salvarPessoa, getTipoTelefone, salvarTelefonePessoa, excluirTelefonePessoa }