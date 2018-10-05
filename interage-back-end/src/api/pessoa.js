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
        if (req.query.tipo == 'F') {
          let pessoaFisica = montaCamposUpdatePessoaFisica()
          console.log(pessoaFisica)
          update = `UPDATE pessoas SET
            ${pessoaFisica},
            dtalteracao=now(),

            apelido_fantasia = NULL

            WHERE pessoas.id=${req.query.id};
            `;
        }
        else if (req.query.tipo == 'J') {
          let pessoaJuridica = montaCamposUpdatePessoaJuridica()
          update = `UPDATE pessoas SET
          ${pessoaJuridica},
          dtalteracao=now()
          
          WHERE pessoas.id=${req.query.id};
          `;
        }
        console.log(update)
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

        function montaCamposUpdatePessoaFisica() {
          let ret = [];
          ret.push("nome='" + req.query.nome + "'")
          ret.push("tipo='" + req.query.tipo + "'")
          ret.push('id_pronome_tratamento=' + (req.query.id_pronome_tratamento != 'null' ? "'" + req.query.id_pronome_tratamento + "'" : 'NULL'))
          ret.push('sexo=' + (req.query.sexo != 'null' ? "'" + req.query.sexo + "'" : 'NULL'))
          ret.push('rg_ie=' + (req.query.rg_ie != 'null' ? "'" + req.query.rg_ie + "'" : 'NULL'))
          ret.push('orgaoemissor=' + (req.query.orgaoemissor != 'null' ? "'" + req.query.orgaoemissor + "'" : 'NULL'))
          ret.push('cpf_cnpj=' + (req.query.cpf_cnpj != 'null' ? "'" + req.query.cpf_cnpj + "'" : 'NULL'))
          ret.push('email=' + (req.query.email != 'null' ? "'" + req.query.email + "'" : 'NULL'))
          ret.push('website=' + (req.query.website != 'null' ? "'" + req.query.website + "'" : 'NULL'))
          ret.push('observacoes=' + (req.query.observacoes != 'null' ? "'" + req.query.observacoes + "'" : 'NULL'))
          return ret.join(', ');
        }

        function montaCamposUpdatePessoaJuridica() {
          let ret = [];
          ret.push("nome='" + req.query.nome + "'")
          ret.push("'tipo='" + req.query.tipo + "'")
          ret.push('id_pronome_tratamento=' + (req.query.id_pronome_tratamento != 'null' ? "'" + req.query.id_pronome_tratamento + "'" : 'NULL'))
          ret.push('apelido_fantasia=' + (req.query.apelido_fantasia != 'null' ? "'" + req.query.apelido_fantasia + "'" : 'NULL'))
          ret.push('sexo=' + (req.query.sexo != 'null' ? "'" + req.query.sexo + "'" : 'NULL'))
          ret.push('rg_ie=' + (req.query.rg_ie != 'null' ? "'" + req.query.rg_ie + "'" : 'NULL'))
          ret.push('orgaoemissor=' + (req.query.orgaoemissor != 'null' ? "'" + req.query.orgaoemissor + "'" : 'NULL'))
          ret.push('cpf_cnpj=' + (req.query.cpf_cnpj != 'null' ? "'" + req.query.cpf_cnpj + "'" : 'NULL'))
          ret.push('email=' + (req.query.email != 'null' ? "'" + req.query.email + "'" : 'NULL'))
          ret.push('website=' + (req.query.website != 'null' ? "'" + req.query.website + "'" : 'NULL'))
          ret.push('observacoes=' + (req.query.observacoes != 'null' ? "'" + req.query.observacoes + "'" : 'NULL'))
          return ret.join(', ');
        }
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
                      ramal=${req.query.ramal || null},
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
                  ${req.query.ramal || null},
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


function salvarEnderecoPessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let update;
      client.query('BEGIN').then((res1) => {
        if (req.query.id)
          update = `UPDATE pessoas_enderecos SET
                      id_cidade=${req.query.id_cidade},
                      cep=${req.query.cep},
                      logradouro='${req.query.logradouro}',
                      bairro='${req.query.bairro}',
                      complemento='${req.query.complemento}',
                      recebe_correspondencia='${req.query.recebe_correspondencia}'
                      WHERE pessoas_enderecos.id=${req.query.id}`;
        else
          update = `INSERT INTO pessoas_enderecos(
            id_pessoa, id_cidade, cep, logradouro, bairro, complemento, recebe_correspondencia)
            VALUES(${req.query.id_pessoa},
                  ${req.query.id_cidade},
                  ${req.query.cep},
                  '${req.query.logradouro}',
                  '${req.query.bairro}',
                  '${req.query.complemento}',
                  '${req.query.recebe_correspondencia}'
                  )`;



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

function excluirEnderecoPessoa(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let del;
      client.query('BEGIN').then((res1) => {
        if (!req.query.id_endereco) return reject('Não tem endereço selecionado')
        del = `DELETE FROM pessoas_enderecos
                      WHERE pessoas_enderecos.id=${req.query.id_endereco}`;

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

function pesquisaPessoas(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      const pesquisaTexto = req.query.searchText.toLowerCase()
      let pesquisa;
      console.log(isNaN(parseInt(req.query.searchText)))
      if (isNaN(parseInt(req.query.searchText))) {
        pesquisa = `SELECT * FROM pessoas
            WHERE lower(nome) LIKE '%${pesquisaTexto}%' OR lower(apelido_fantasia) LIKE '%${pesquisaTexto}%' OR lower(cpf_cnpj) LIKE '%${pesquisaTexto}%'`
      }
      else {
        pesquisa = `SELECT * FROM pessoas
            WHERE id=${pesquisaTexto}`
      }

      console.log(pesquisa)
      client.query(pesquisa).then((res) => {
        if (res.rowCount > 0) {
          resolve(res.rows);
        }
        else reject(`Não há pessoas com o texto: ${req.query.searchText}`)

      }).catch(e => {
        reject(e);
      })
    }).catch(e => {
      reject(e);
    });
  })
}

module.exports = {
  getPessoa,
  salvarPessoa,
  getTipoTelefone,
  salvarTelefonePessoa,
  excluirTelefonePessoa,
  excluirEnderecoPessoa,
  salvarEnderecoPessoa,
  pesquisaPessoas
}