const { checkTokenAccess } = require('./checkTokenAccess');
const { executaSQL } = require('./executaSQL');
const { buscaValorDoAtributo } = require( './shared');



function getPessoaPorCPFCNPJ(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    req.query.cpf_cnpj = req.query.cpf_cnpj.replace(/\W/gi, '');
    let sql = `SELECT * FROM pessoas WHERE cpf_cnpj = '${req.query.cpf_cnpj}'`
    executaSQL(credenciais, sql).then(res => {
        resolve(res)
    })
    .catch(err => {
      reject(err)
    });
  });
};


function getPessoa(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

      let sql = `SELECT * FROM pessoas WHERE id=${req.query.id_pessoa}`
      executaSQL(credenciais, sql).then(res => {
        var enderecos = {};
        var telefones = {};
        if (res.length > 0) {
          var pessoa = res[0];
          getTelefones(req).then(resTelefones => {
            getEnderecos(req).then(resEndereco => {
              if (!resTelefones) { telefones = {} ;
              }else telefones = resTelefones;
              if (!resEndereco) {enderecos = {}
              }else enderecos = resEndereco;
              resolve({ principal: pessoa, enderecos, telefones })
            })
            .catch(err => {
              reject(err)
            });
          })
          .catch(err => {
            reject(err)
          })
         // resolve({ principal: pessoa[0], enderecos, telefones })
        }
        else resolve({});
      })
      .catch(err => {
        reject(err)
      })
                
              
  });
}
function getEnderecos(req) {
  return new Promise((resolve, reject) => {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    let sqlEnderecos = `SELECT 
                        pessoas_enderecos.id,
                        pessoas_enderecos.id_pessoa,
                        pessoas_enderecos.id_cidade,
                        pessoas_enderecos.cep,
                        pessoas_enderecos.logradouro, 
                        pessoas_enderecos.bairro,
                        pessoas_enderecos.complemento,
                        pessoas_enderecos.recebe_correspondencia,
                        pessoas_enderecos.status,
                        cidades.nome,
                        cidades.uf_cidade
                        FROM pessoas_enderecos
                        LEFT JOIN cidades ON pessoas_enderecos.id_cidade=cidades.id
                        WHERE id_pessoa=${req.query.id_pessoa}
                        ORDER BY recebe_correspondencia DESC`
  executaSQL(credenciais, sqlEnderecos).then(res => {
              resolve(res);
            }).catch(err => {
              reject(err)
            })
  })
}

function getTelefones(req) {
  return new Promise((resolve, reject) => {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    let sqlTelefones = `SELECT * FROM pessoas_telefones
                        WHERE id_pessoa=${req.query.id_pessoa}
                        ORDER BY principal DESC`
executaSQL(credenciais, sqlTelefones).then(res => {
  resolve(res);
}).catch(err => {
  reject(err)
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

      // trata as variaveis que tem combro que vem com null
      req.query.id_atividade = req.query.id_atividade == 'null' ?  'null':  req.query.id_atividade; 
      req.query.id_pronome_tratamento = req.query.id_pronome_tratamento == 'null' ?  'null':  req.query.id_pronome_tratamento; 


      let update = String;
      client.query('BEGIN').then((res1) => {



          update = `UPDATE pessoas SET
            ${montaCamposUpdatePessoa()},
            dtalteracao=now()
            WHERE pessoas.id=${req.query.id};
            `;

        
        update = update.replace(/'null'/g, null)
        update = update.replace(/'`'/g, ' ')

       client.query(update).then((res) => {
          client.query('COMMIT').then((resposta) => {
            client.end();
            resolve(resposta)
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(err => {
            client.end();
            reject(err)
          })
        })

        function montaCamposUpdatePessoa() {
          let ret = [];
          ret.push("nome='" + req.query.nome + "'")
          ret.push("tipo='" + req.query.tipo + "'")
          ret.push('id_pronome_tratamento=' + (req.query.id_pronome_tratamento != 'null' || req.query.id_pronome_tratamento != '' ? "'" + req.query.id_pronome_tratamento + "'" : null))
          ret.push('apelido_fantasia=' + (req.query.apelido_fantasia != 'null' || req.query.apelido_fantasia != '' ? "'" + req.query.apelido_fantasia + "'" : null))
          ret.push('sexo=' + (req.query.sexo != 'null' || req.query.sexo != ''  ? "'" + req.query.sexo + "'" : null))
          ret.push('rg_ie=' + (req.query.rg_ie != 'null' || req.query.rg_ie != '' ? "'" + req.query.rg_ie + "'" : null))
          ret.push('orgaoemissor=' + (req.query.orgaoemissor != 'null' || req.query.orgaoemissor != '' ? "'" + req.query.orgaoemissor + "'" : null))
          ret.push('cpf_cnpj=' + (req.query.cpf_cnpj != 'null' || req.query.cpf_cnpj != ''  ? "'" + req.query.cpf_cnpj + "'" : null))
          ret.push('email=' + (req.query.email != 'null' || req.query.email != '' ? "'" + req.query.email + "'" : null))
          ret.push('website=' + (req.query.website != 'null' || req.query.website != '' ? "'" + req.query.website + "'" : null))
          ret.push('id_atividade=' + (req.query.id_atividade != 'null' || req.query.id_atividade != '' ? "'" + req.query.id_atividade + "'" : null))
          ret.push('observacoes=' + (req.query.observacoes != 'null' || req.query.observacoes != '' ? "'" + req.query.observacoes + "'" : null))
          return ret.join(', ');
        }


      }).catch(err => {
        client.end();
        reject(err)
      })
    }).catch(e => {
      reject(e);
    });
  });

}

async function  adicionarPessoa(req, res) {

  let credenciais = {
    token: req.query.token,
    idUsuario: req.query.id_usuario
  };
  var possui_carteira_cli = await buscaValorDoAtributo(credenciais, 'possui_carteira_cli', 'usuarios', `id = ${req.query.id_usuario}` )
  possui_carteira_cli = Object.values( possui_carteira_cli[0])[0];

  return new Promise(function (resolve, reject) {    
    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()
      // trata as variaveis que tem combro que vem com null
      req.query.id_atividade = req.query.id_atividade == 'null' ?  '':  req.query.id_atividade; 
      req.query.id_pronome_tratamento = req.query.id_pronome_tratamento == 'null' ?  '':  req.query.id_pronome_tratamento; 

      let update;
      if (req.query.tipo == 'F') {
        let pessoaFisica = montaCamposUpdatePessoaFisica()
        update = `INSERT INTO pessoas ${pessoaFisica} RETURNING id`;
      }
      else if (req.query.tipo == 'J') {
        let pessoaJuridica = montaCamposUpdatePessoaJuridica()
        update = `INSERT INTO pessoas ${pessoaJuridica} RETURNING id`
      }
     
      update = update.replace(/'null'/g, null)
      update = update.replace(/'`'/g, ' ')

      client.query(update).then((res) => {
        client.end();
        resolve(res.rows[0])
      }).catch(e => {
        client.end();
        reject(e)
      })

      function montaCamposUpdatePessoaFisica() {
        let ret = [];
        ret.push("(")
        ret.push("nome,")
        ret.push("tipo,")
        ret.push('id_pronome_tratamento,')
        ret.push('sexo,')
        ret.push('rg_ie,')
        ret.push('orgaoemissor,')
        ret.push('cpf_cnpj,')
        ret.push('email,')
        ret.push('website,')
        ret.push('observacoes,')
        ret.push('apelido_fantasia,')
        ret.push('dtinclusao,')
        ret.push('dtalteracao,')
        ret.push('id_usuario_incluiu,')
        ret.push('id_usuario_carteira')
        ret.push(')')

        ret.push('VALUES(')

        ret.push("'" + req.query.nome + "',")
        ret.push("'" + req.query.tipo + "',")
        ret.push((req.query.id_pronome_tratamento != '' ? "'" + req.query.id_pronome_tratamento + "'" : 'NULL') + ",")
        ret.push((req.query.sexo != '' ? "'" + req.query.sexo + "'" : 'NULL') + ",")
        ret.push((req.query.rg_ie != '' ? "'" + req.query.rg_ie + "'" : 'NULL') + ",")
        ret.push((req.query.orgaoemissor != '' ? "'" + req.query.orgaoemissor + "'" : 'NULL') + ",")
        ret.push((req.query.cpf_cnpj != '' ? "'" + req.query.cpf_cnpj + "'" : 'NULL') + ",")
        ret.push((req.query.email != '' ? "'" + req.query.email + "'" : 'NULL') + ",")
        ret.push((req.query.website != '' ? "'" + req.query.website + "'" : 'NULL') + ",")
        ret.push((req.query.observacoes != '' ? "'" + req.query.observacoes + "'" : 'NULL') + ",")
        ret.push((req.query.apelido_fantasia != null ? "'" + req.query.apelido_fantasia + "'" : 'NULL') + ",")
        ret.push('now(),')
        ret.push('now(),')
        ret.push(req.query.id_usuario + ",")
        ret.push(possui_carteira_cli ? req.query.id_usuario: 'NULL')
        ret.push(')')
        return ret.join(' ');
      }

      function montaCamposUpdatePessoaJuridica() {
        let ret = [];
        ret.push("(")
        ret.push("nome,")
        ret.push("tipo,")
        ret.push('id_pronome_tratamento,')
        ret.push('sexo,')
        ret.push('rg_ie,')
        ret.push('orgaoemissor,')
        ret.push('cpf_cnpj,')
        ret.push('email,')
        ret.push('website,')
        ret.push('observacoes,')
        ret.push('apelido_fantasia,')
        ret.push('dtinclusao,')
        ret.push('dtalteracao,')
        ret.push('id_usuario_incluiu,')
        ret.push('id_usuario_carteira')
        ret.push(')')

        ret.push('VALUES(')

        ret.push("'" + req.query.nome + "',")
        ret.push("'" + req.query.tipo + "',")
        ret.push((req.query.id_pronome_tratamento != '' ? "'" + req.query.id_pronome_tratamento + "'" : 'NULL' ) + ",")
        ret.push((req.query.sexo != '' ? "'" + req.query.sexo + "'" : 'NULL') + ",")
        ret.push((req.query.rg_ie != '' ? "'" + req.query.rg_ie + "'" : 'NULL') + ",")
        ret.push((req.query.orgaoemissor != '' ? "'" + req.query.orgaoemissor + "'" : 'NULL') + ",")
        ret.push((req.query.cpf_cnpj != '' ? "'" + req.query.cpf_cnpj + "'" : 'NULL') + ",")
        ret.push((req.query.email != '' ? "'" + req.query.email + "'" : 'NULL') + ",")
        ret.push((req.query.website != '' ? "'" + req.query.website + "'" : 'NULL') + ",")
        ret.push((req.query.observacoes != '' ? "'" + req.query.observacoes + "'" : 'NULL') + ",")
        ret.push((req.query.apelido_fantasia != '' ? "'" + req.query.apelido_fantasia + "'" : 'NULL') + ",")
        ret.push('now(),')
        ret.push('now(),')
        ret.push(req.query.id_usuario + ",")
        ret.push(possui_carteira_cli ? req.query.id_usuario: 'NULL')
        ret.push(')')
        return ret.join(' ');
      }
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
        .catch(err => {
          client.end();
          reject(err)
        })
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
      client.query('BEGIN').then(() => {
        const buscaTelefone = `SELECT * FROM pessoas_telefones WHERE pessoas_telefones.id_pessoa = ${req.query.id_pessoa}`

        client.query(buscaTelefone).then((telefonesPessoa) => {
          let principal = false;
          if (!telefonesPessoa.rowCount) principal = true
          if (req.query.id)
            update = `UPDATE pessoas_telefones SET
                      ddd='${req.query.ddd}',
                      telefone='${req.query.telefone}',
                      ramal=${req.query.ramal || null},
                      principal=${req.query.telefone},
                      id_tipo_telefone=${req.query.id_tipo_telefone},
                      contato='${req.query.contato}',
                      ddi=55,
                      dtalteracao=now()
                      WHERE pessoas_telefones.id=${req.query.id}`;
          else
            update = `INSERT INTO pessoas_telefones(
            id_pessoa, ddd, telefone, ramal, principal, id_tipo_telefone, contato, ddi,dtalteracao)
            VALUES('${req.query.id_pessoa}',
                  '${req.query.ddd}',
                  '${req.query.telefone}',
                  ${req.query.ramal || null},
                  ${principal},
                  ${req.query.id_tipo_telefone},
                  '${req.query.contato}',
                  '55', now())`;
          client.query(update).then((res) => {
            client.query('COMMIT').then((resposta) => {
              client.end();
              resolve(resposta)
            }).catch(err => {
              client.end();
              reject(err)
            })
          }).catch(e => {
            client.query('ROLLBACK').then((resposta) => {
              client.end();
              reject(e)
            }).catch(err => {
              client.end();
              reject(err)
            })
          })

        }).catch(err => {
          client.end();
          reject(err)
        })
      }).catch(err => {
        client.end();
        reject(err)
      })

    }).catch(e => {
      reject(e);
    });
  })
}

function editaTelefonePrincipal(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let update;
      client.query('BEGIN').then(() => {
        todosOsOutrosTelefonesFalse = `UPDATE pessoas_telefones SET
                      principal=false
                      WHERE pessoas_telefones.id_pessoa=${req.query.id_pessoa}`;

        client.query(todosOsOutrosTelefonesFalse).then(() => {
          setaNovoTelefonePrincipal = `UPDATE pessoas_telefones SET
                      principal=true
                      WHERE pessoas_telefones.id=${req.query.id_telefone} 
                      AND pessoas_telefones.id_pessoa=${req.query.id_pessoa}`;


          client.query(setaNovoTelefonePrincipal).then(() => {
            client.query('COMMIT').then((resposta) => {
              client.end();
              resolve(resposta)
            }).catch(err => {
              client.end();
              reject(err)
            })
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(err => {
            client.end();
            reject(err)
          })
        })
      }).catch(err => {
        client.end();
        reject(err)
      })
    }).catch(e => {
      reject(e);
    });
  })
}

function editaEnderecoDeCorrespondencia(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let update;
      client.query('BEGIN').then(() => {
        todosOsOutrosEnderecosFalse = `UPDATE pessoas_enderecos SET
                      recebe_correspondencia=false
                      WHERE pessoas_enderecos.id_pessoa=${req.query.id_pessoa}`;

        client.query(todosOsOutrosEnderecosFalse).then(() => {
          setaNovoEnderecoCorrespondencia = `UPDATE pessoas_enderecos SET
                      recebe_correspondencia=true
                      WHERE pessoas_enderecos.id=${req.query.id_endereco} 
                      AND pessoas_enderecos.id_pessoa=${req.query.id_pessoa}`;


          client.query(setaNovoEnderecoCorrespondencia).then(() => {
            client.query('COMMIT').then((resposta) => {
              client.end();
              resolve(resposta)
            }).catch(err => {
              client.end();
              reject(err)
            })
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(err => {
            client.end();
            reject(err)
          })
        })
      }).catch(err => {
        client.end();
        reject(err)
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
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(err => {
            client.end();
            reject(err)
          })
        })
      }).catch(err => {
        client.end();
        reject(err)
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
        const queryCidade = `SELECT * from cidades 
                             WHERE cidades.nome='${req.query.cidade}' AND cidades.uf_cidade='${req.query.uf_cidade.toUpperCase()}'`
        client.query(queryCidade).then((cidade) => {
          if (cidade.rowCount) {
            req.query.id_cidade = cidade.rows[0].id;
            salvaEndereco();
          }
          else {
            insereCidade()
          }
          function insereCidade() {
            insert = `INSERT INTO cidades(
              nome, uf_cidade, status)
              VALUES('${req.query.cidade}',
                    '${req.query.uf_cidade.toUpperCase()}',
                    TRUE
                    ) RETURNING id`;

            client.query(insert).then((res) => {
              req.query.id_cidade = res.rows[0].id
              salvaEndereco()
            }).catch(e => {
              reject(e);
            })
          }
          function salvaEndereco() {
            let selectEnderecos = `SELECT * FROM pessoas_enderecos 
                                   WHERE pessoas_enderecos.id_pessoa=${req.query.id_pessoa}`
            client.query(selectEnderecos).then((enderecosPessoas) => {
              let recebe_correspondencia = false;
              if (!enderecosPessoas.rowCount) recebe_correspondencia = true;

              if (req.query.id)
                update = `UPDATE pessoas_enderecos SET
                      id_cidade=${req.query.id_cidade},
                      cep=${req.query.cep},
                      logradouro='${req.query.logradouro}',
                      bairro='${req.query.bairro}',
                      complemento='${req.query.complemento}',
                      recebe_correspondencia=${req.query.recebe_correspondencia},
                      dtalteracao=now()
                      WHERE pessoas_enderecos.id=${req.query.id}`;
              else
                update = `INSERT INTO pessoas_enderecos(
                      id_pessoa, id_cidade, cep, logradouro, bairro, complemento, recebe_correspondencia,dtalteracao)
                      VALUES(${req.query.id_pessoa},
                            ${req.query.id_cidade},
                            ${req.query.cep},
                            '${req.query.logradouro}',
                            '${req.query.bairro}',
                            '${req.query.complemento}',
                            '${recebe_correspondencia}',
                            now()
                            )`;

              client.query(update).then((res) => {
                client.query('COMMIT').then((resposta) => {
                  client.end();
                  resolve(resposta)
                }).catch(err => {
                  client.end();
                  reject(err)
                })
              }).catch(e => {
                client.query('ROLLBACK').then((resposta) => {
                  client.end();
                  reject(e)
                }).catch(err => {
                  client.end();
                  reject(err)
                })
              })
            })
          }


        }).catch(err => {
          client.end();
          reject(err)
        })
      }).catch(err => {
        client.end();
        reject(err)
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
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(e => {
          client.query('ROLLBACK').then((resposta) => {
            client.end();
            reject(e)
          }).catch(err => {
            client.end();
            reject(err)
          })
        })
      }).catch(err => {
        client.end();
        reject(err)
      })
    }).catch(e => {
      reject(e);
    });
  })
}

async function pesquisaPessoas(req, res) {
  let credenciais = {
    token: req.query.token,
    idUsuario: req.query.id_usuario
  };
  var possui_carteira_cli = await buscaValorDoAtributo(credenciais, 'possui_carteira_cli', 'usuarios', `id = ${req.query.id_usuario}` )
  possui_carteira_cli = Object.values( possui_carteira_cli[0])[0];

  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {

      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      const pesquisaTexto = req.query.searchText.toLowerCase();
      const pesquisaId = pesquisaTexto.substring(3);
      let pesquisa = '';

      if (pesquisaTexto.substring(0,3) == 'id=' ) {
          pesquisa = 'id';
      }

      if (pesquisa != 'id') {
        pesquisa = `SELECT p.*, up.apelido_fantasia as carteira FROM pessoas p
            left join usuarios u on p.id_usuario_carteira = u.id
            left join pessoas up on u.id_pessoa = up.id 
            WHERE (lower(p.nome) LIKE '%${pesquisaTexto}%' OR
            lower(p.apelido_fantasia)
            LIKE '%${pesquisaTexto}%' OR
            lower(p.cpf_cnpj) LIKE '%${pesquisaTexto}%'  )`
      }
      else {
        pesquisa = `SELECT p.*, up.apelido_fantasia as carteira FROM pessoas p
            left join usuarios u on p.id_usuario_carteira = u.id
            left join pessoas up on u.id_pessoa = up.id 
            WHERE p.id=${pesquisaId}
            `
      }
      // carteira do usuario 
      // if (possui_carteira_cli) {
      //     pesquisa = pesquisa +  ` and p.id_usuario_carteira = ${req.query.id_usuario} `
      // }

      pesquisa = pesquisa + ` limit 100`
      
      client.query(pesquisa).then((res) => {
        client.end()
        if (res.rowCount > 0) {
          resolve(res.rows);
        }
        else reject(`Não há pessoas com o texto: ${req.query.searchText}`)
      }).catch(err => {
        client.end();
        reject(`Não há pessoas com o texto: ${req.query.searchText}`)
      })
    }).catch(e => {
      reject(e);
    });
  })
}

function getTratamentoPessoaFisica(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT * FROM pronome_tratamento WHERE pronome_tratamento.status=true`

      client.query(sql)
        .then(res => {
          let pronome_tratamento = res.rows;

          client.end();
          resolve(pronome_tratamento)
        })
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(e => {
      reject(e)
    })
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
  pesquisaPessoas,
  adicionarPessoa,
  editaTelefonePrincipal,
  editaEnderecoDeCorrespondencia,
  getTratamentoPessoaFisica,
  getPessoaPorCPFCNPJ,
}