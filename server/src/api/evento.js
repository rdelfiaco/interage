const { checkTokenAccess } = require('./checkTokenAccess');
const { getMetaPessoa } = require('./metaLigacoes');
const { getPredicao } = require('./predicao');
const { getObjecoes } = require('./objecoes');
const { getPessoa } = require('./pessoa');
const { salvarProposta } = require('./proposta');
const { getUsuarios } = require('./usuario');
const { executaSQL } = require('./executaSQL');

function getUmEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select *
            from view_eventos
            where id_status_evento in (1,4,5,6)
            and ( (tipodestino = 'O' and id_pessoa_visualizou is null and id_pessoa_organograma = ${req.query.id_organograma} )
            or (tipodestino = 'P' and id_usuario = ${req.query.id_usuario} )
            or (id_pessoa_visualizou = ${req.query.id_pessoa} and id_status_evento in(5,6) ))
            and dt_para_exibir <= now()
            and id_campanha = ${req.query.id_campanha}
            order by id_status_evento desc, id_prioridade, dt_para_exibir LIMIT 1`

      //console.log(sql)
      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let evento = res.rows[0];

            const updateDataVisualizou = `UPDATE eventos SET  id_status_evento=5, dt_visualizou=now(), id_pessoa_visualizou=${req.query.id_pessoa}
            WHERE id=${evento.id}`

            client.query(updateDataVisualizou)
              .then(res => {

                client.end();
                resolve(evento)

              }).catch(err => {
                client.end();
                console.log(err)
              })
          }
          else {
            client.end();
            reject('Não há eventos!')
          }
        })
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function motivosRespostas(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sqlMotivosResposta = `SELECT motivos_respostas.id, motivos_respostas.exige_predicao, motivos_respostas.exige_objecao, 
                       motivos_respostas.nome, motivos_respostas.ordem_listagem, motivos_respostas.exige_proposta,
                       motivos_respostas.exige_observacao, motivos_eventos_automaticos.reagendar, motivos_respostas.acao_js
                       FROM motivos_respostas
                      LEFT JOIN motivos_eventos_automaticos ON motivos_respostas.id = motivos_eventos_automaticos.id_motivo_resposta
                      WHERE motivos_respostas.id_motivo=${req.query.id_motivo} AND status=true`

      //console.log(sqlMotivosResposta);
      client.query(sqlMotivosResposta).then(res => {
        let motivos_respostas = res.rows;

        client.end();
        resolve(motivos_respostas)
      }).catch(err => {
        client.end();
        console.log(err)
      })
    });
  });
}

function encerrarEvento(client, id_pessoa, id_evento, id_status_evento) {
  return new Promise(function (resolve, reject) {
    let update = `UPDATE eventos SET id_status_evento=${id_status_evento},
          dt_resolvido=now(),
          id_pessoa_resolveu=${id_pessoa} 
          WHERE eventos.id=${id_evento} AND eventos.id_status_evento in(5,6)
          RETURNING tipoDestino, id_pessoa_organograma;`;
    //console.log(update)
    client.query(update).then((updateEventoEncerrado) => {
      resolve(updateEventoEncerrado)
    }).catch(err => {
      reject(err);
    })
  });
}

function _criarEvento(client, id_campanha, id_motivo, id_evento_pai, id_evento_anterior,
  id_pessoa_criou, dt_para_exibir, tipoDestino, id_pessoa_organograma, id_pessoa_receptor,
  observacao_origem, id_canal) {
  return new Promise(function (resolve, reject) {
    let update = `INSERT INTO eventos(
      id_campanha,
      id_motivo,
      id_evento_pai,
      id_evento_anterior,
      id_status_evento,
      id_pessoa_criou,
      dt_criou,
      dt_prevista_resolucao,
      dt_para_exibir,
      tipodestino,
      id_pessoa_organograma,
      id_pessoa_receptor,
      id_prioridade,
      observacao_origem,
      id_canal)
      VALUES (${id_campanha || 'NULL'},
      ${id_motivo},
      ${id_evento_pai || 'NULL'},
      ${id_evento_anterior || 'NULL'},
      1,
      ${id_pessoa_criou},
      now(),
      func_dt_expira(${id_motivo}),
      '${dt_para_exibir}',
      '${tipoDestino}', 
      ${id_pessoa_organograma},
      ${id_pessoa_receptor},
      '2',
      '${observacao_origem}',
      ${id_canal})
      RETURNING id`;

    //console.log(update)
    client.query(update).then((updateEventoCriado) => {
      resolve(updateEventoCriado)
    }).catch(err => {
      reject(err);
    })
  });
}



function encaminhaEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect();
      client.query('BEGIN').then((res1) => {
        //console.log('req.query', req.query)
        let statusEvento;
        if (req.query.id_status_evento === '5') statusEvento = 2;
        if (req.query.id_status_evento === '6') statusEvento = 8;

        //console.log('req.query', req.query)
        encerrarEvento(client, req.query.id_pessoa_resolveu, req.query.id_evento, statusEvento).then(eventoEncerrado => {
          _criarEvento(client, req.query.id_campanha, req.query.id_motivo, req.query.id_evento_pai, req.query.id_evento,
            req.query.id_pessoa_resolveu, req.query.dt_para_exibir, req.query.tipoDestino, req.query.id_pessoa_organograma, req.query.id_pessoa_receptor,
            req.query.observacao_origem, req.query.id_canal).then(eventoCriado => {
              client.query('COMMIT').then((resposta) => {
                resolve(eventoCriado)
                client.end();
              }).catch(err => {
                client.end();
                reject(err)
              })
            }).catch(err => {
              client.end();
              reject(err)
            })
        }).catch(err => {
          client.end();
          reject(err)
        })

      }).catch(err => {
        client.query('ROLLBACK').then((resposta) => {
          client.end();
          reject('Erro ao processar arquivo importado')
        }).catch(err => {
          client.end();
          reject(err)
        })
      })
    })
  })
}

function criarEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)
      
      client.connect();
      client.query('BEGIN').then((res1) => {
        _criarEvento(client, req.query.id_campanha, req.query.id_motivo, 'NULL', 'NULL',
          req.query.id_pessoa_resolveu, req.query.dt_para_exibir, req.query.tipoDestino, req.query.id_pessoa_organograma, req.query.id_pessoa_receptor,
          req.query.observacao_origem, req.query.id_canal).then(eventoCriado => {
            client.query('COMMIT').then((resposta) => {
              resolve(eventoCriado)
              client.end();
            }).catch(err => {
              client.end();
              reject(err)
            })
          }).catch(err => {
            client.end();
            reject(err)
          })
      }).catch(err => {
        client.query('ROLLBACK').then((resposta) => {
          client.end();
          reject('Erro ao processar arquivo importado')
        }).catch(err => {
          client.end();
          reject(err)
        })
      })
    })
  })
}

function salvarEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()
      let sqlMotivoRespostaAutomaticos = `SELECT * from motivos_eventos_automaticos
                              WHERE motivos_eventos_automaticos.id_motivo_resposta=${req.query.id_motivos_respostas}`;

      client.query(sqlMotivoRespostaAutomaticos).then(res => {
        const motivoResposta_automatico = res.rows;

        let sqlMotivoResposta = `SELECT * from motivos_respostas
                              WHERE motivos_respostas.id=${req.query.id_motivos_respostas}`;

        client.query(sqlMotivoResposta).then(res => {
          const motivoResposta = res.rows[0];
          
          let sqlMotivos = `SELECT * from motivos WHERE id=${motivoResposta.id_motivo}`;
                                 
          client.query(sqlMotivos).then(res => {
          const motivoAcaoSQL = res.rows[0].acao_sql;
          

          client.query('BEGIN').then((res1) => {
            //console.log('req.query.proposta', req.query.proposta)
            if (req.query.proposta && req.query.proposta !== "null" && req.query.proposta !== "undefined") {
              salvarProposta(req, res).then((idproposta) => {
                //console.log('salvo proposta ' + idproposta[0].id);
                finalizaEvento(idproposta[0].id, true);
              })
            }
            else {
              finalizaEvento();
            }


            function finalizaEvento(idproposta, temProposta) {
              let update;
              update = `UPDATE eventos SET id_status_evento=3,
              dt_resolvido=now(),
                  id_pessoa_resolveu=${req.query.id_pessoa}, 
                  observacao_retorno='${req.query.observacao}',
                  id_resp_motivo=${req.query.id_motivos_respostas},
                  id_telefone=${req.query.id_telefoneDiscado || 'NULL'},
                  id_predicao=${req.query.id_predicao || 'NULL'},
                  id_objecao=${req.query.id_objecao || 'NULL'}`
              if(temProposta) {
                  update = update + 
                  ` ,id_proposta=${idproposta || 'NULL'}` }
              update = update + 
                  ` WHERE eventos.id=${req.query.id_evento} AND eventos.id_status_evento in(5,6)
                  RETURNING tipoDestino, id_pessoa_organograma;
                  `;
                  
              client.query(update).then((updateEventoEncerrado) => {
                if (updateEventoEncerrado.rowCount != 1) {
                  client.query('COMMIT').then((resposta) => {
                    getMetaPessoa(req).then(metaPessoa => {
                      client.end();
                      resolve(metaPessoa)
                    }).catch(err => {
                      client.end();
                      reject(err)
                    })
                  })
                  return;
                }
                const selectQuantidadeTentativas = `SELECT COUNT(id_resp_motivo) from eventos

                                             WHERE ((id_resp_motivo=${req.query.id_motivos_respostas} AND 
                                             id_evento_pai = ${req.query.id_evento_pai}) OR
                                             
                                             (id_resp_motivo=${req.query.id_motivos_respostas} AND
                                              id = ${req.query.id_evento_pai}))`

                //console.log('selectQuantidadeTentativas', selectQuantidadeTentativas)
                client.query(selectQuantidadeTentativas).then((qtdTentativas) => {
                  qtdTentativas = parseInt(qtdTentativas.rows[0].count);
                  //console.log('motivoResposta_automatico.length', motivoResposta_automatico)

                  //console.log('qtdTentativas', qtdTentativas)
                  //console.log('motivoResposta.tentativas', motivoResposta.tentativas)
                  //console.log('motivoResposta.tentativas > qtdTentativas', motivoResposta.tentativas > qtdTentativas)
                  if (motivoResposta.tentativas > qtdTentativas) {

                    if (motivoResposta_automatico.length > 0) {
                      motivoResposta_automatico.map((m, index, array) => {
                        eventoCriar = createEvent(m, motivoResposta, updateEventoEncerrado)
                        //console.log('eventoCriar', eventoCriar)

                        client.query(eventoCriar).then(res => {
                          //console.log('index == array.length - 1', index == array.length - 1)

                          if (index == array.length - 1)
                            client.query('COMMIT').then((resposta) => {
                              getMetaPessoa(req).then(metaPessoa => {
                                client.end();
                                resolve(metaPessoa)
                              }).catch(err => {
                                client.end();
                                reject(err)
                              })
                            })
                        }).catch(err => {
                          client.end();
                          reject(err)
                        })

                      })
                    } else {
                      client.query('COMMIT').then(() => {
                        getMetaPessoa(req).then(metaPessoa => {
                          client.end();
                          resolve(metaPessoa)
                        }).catch(err => {
                          client.end();
                          reject(err)
                        })
                      }).catch(err => {
                        client.end();
                        reject(err)
                      })
                    }


                  }
                  else {
                    updateQuantidadeMaxTentativas = `UPDATE eventos SET 
                      excedeu_tentativas=true
                      WHERE eventos.id=${req.query.id_evento};
                      `;

                    client.query(updateQuantidadeMaxTentativas).then(() => {
                      client.query('COMMIT').then(() => {
                        getMetaPessoa(req).then(metaPessoa => {
                          client.end();
                          resolve(metaPessoa)
                        }).catch(err => {
                          client.end();
                          reject(err)
                        })
                      }).catch(err => {
                        client.end();
                        reject(err)
                      })
                    }).catch(err => {
                      client.end();
                      reject(err)
                    })
                  }
                
                  // executa ação do motivo 
                  if (motivoAcaoSQL){
                  let sql = motivoAcaoSQL.replace('${req.query.id_evento}', `${req.query.id_evento}`)
                  let credenciais = {
                    token: req.query.token,
                    idUsuario: req.query.id_usuario
                  };
                  console.log(credenciais, sql )
                  executaSQL(credenciais, sql).then(() =>{
                    resolve('Status de proposta alterado')
                  }).catch(err => {
                      client.end();
                      reject(err)
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
            }
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(err => {
          client.end();
          reject(err)
        })
        }).catch(err => {
          client.end();
          reject(err)
        })
      }).catch(err => {
        client.end();
        reject(err)
      })


      function createEvent(motivoRespostaAutomatico, motivoResposta, updateEventoEncerrado) {
        let tipoDestino;
        let id_pessoa_organograma;

        if (motivoRespostaAutomatico.gera_para == 1) {
          tipoDestino = motivoRespostaAutomatico.tipodestino;
          id_pessoa_organograma = motivoRespostaAutomatico.id_pessoa_organograma;
        }
        else if (motivoRespostaAutomatico.gera_para == 2) {
          tipoDestino = 'P';
          id_pessoa_organograma = req.query.id_pessoa
        }
        else if (motivoRespostaAutomatico.gera_para == 4) {
          tipoDestino = updateEventoEncerrado.rows[0].tipodestino;
          id_pessoa_organograma = updateEventoEncerrado.rows[0].id_pessoa_organograma
        }
        else {
          tipoDestino = req.query.tipoDestino;
          id_pessoa_organograma = req.query.id_pessoa_organograma_destino;
        }

        let id_prioridade = getPrioridadeDoEvento();
        //console.log(req.query.data)
        return `INSERT INTO eventos(
            id_campanha,
            id_motivo,
            id_evento_pai,
            id_evento_anterior,
            id_status_evento,
            id_pessoa_criou,
            dt_criou,
            dt_prevista_resolucao,
            dt_para_exibir,
            tipodestino,
            id_pessoa_organograma,
            id_pessoa_receptor,
            id_prioridade,
            observacao_origem,
            id_canal)
        VALUES (${req.query.id_campanha},
            ${motivoRespostaAutomatico.id_motivo},
            ${req.query.id_evento_pai},
            ${req.query.id_evento},
            1,
            ${req.query.id_pessoa},
            now(),
            func_dt_expira(${motivoRespostaAutomatico.id_motivo}),
            '${req.query.data}',
            '${tipoDestino}', 
            ${id_pessoa_organograma},
            ${req.query.id_pessoa_receptor},
            ${id_prioridade},
            '${motivoRespostaAutomatico.observacao_origem}',
            ${motivoRespostaAutomatico.id_canal})`

        function getPrioridadeDoEvento() {
          return motivoResposta.id_prioridade || motivoRespostaAutomatico.id_prioridade;
        }
      }
    });
  }).catch(err => {
    console.log(err)
  })
}

function getEventosPendentes(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select *
                from view_eventos
                where id_status_evento in (1,4,5,6)
                and ( (tipodestino = 'O' and id_pessoa_organograma = ${req.query.id_organograma} ) or  (tipodestino = 'P' and id_usuario = ${req.query.id_usuario} ))
                and dt_para_exibir <= now()
                order by dt_criou limit 100`

      //console.log(sql)
      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let evento = res.rows;
            client.end();
            resolve(evento)
          }
          else reject('Não há eventos!')
        }
        ).catch(err => {
          client.end();
          reject(err)
        })
    }).catch(err => {
      reject(err)
    })
  })
}


function getEventosLinhaDoTempo(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select * from view_eventos where id_pessoa_receptor=${req.query.id_pessoa_receptor}`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else reject('Não há eventos!')
        })
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(err => {
      reject(err)
    })
  })
}


function getEventosRelatorioUsuario(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select * from view_eventos where (id_pessoa_resolveu=${req.query.id_pessoa_organograma} and date(dt_resolvido)
                  between '${req.query.dtInicial}'  and '${req.query.dtFinal}') OR
                  (tipodestino='P' and id_pessoa_organograma=${req.query.id_pessoa_organograma})`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há eventos!')
            client.end();
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

function getEventoFiltros(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getOrganograma(req).then(Organograma => {
        getUsuarios(req).then(Usuarios => {
          getMotivos(req).then(Motivos => {
            getStatusEvento(req).then(StatusEvento => {
              if (!Organograma || !Usuarios
                || !Motivos || !StatusEvento)
                reject('não encontrado');

              resolve({
                Organograma, Usuarios,
                Motivos, StatusEvento
              });
            });
          }).catch(e => {
            reject(e);
          });
        }).catch(e => {
          reject(e);
        });
      }).catch(e => {
        reject(e);
      });
    }).catch(e => {
      reject(e);
    });
  })
}


function getOrganograma(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select * from organograma where status order by nome`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há organograma!')
            client.end();
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


function getMotivos(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select id, nome
                  from motivos
                  where status = true 
                  order by nome `

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há usuário!')
            client.end();
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
function getCanais(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select id, nome
                  from canais
                  where status = true 
                  order by nome `

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let canais = res.rows;
            client.end();
            resolve(canais)
          }
          else {
            reject('Não há canais!')
            client.end();
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


function getStatusEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select id, nome 
                  from status_evento
                  where status = true 
                  order by nome`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há usuário!')
            client.end();
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


function getEventosFiltrados(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    console.log(req.query)
    let sql = `select * from view_eventos where  id_campanha is null`
    sql = sql + ` and (id_status_evento in (${req.query.status})  or -1 in (${req.query.status})) `  // status 
    if (req.query.dtCricaoRadio == 'true') {
      sql = sql + ` and date(dt_criou) between date('${req.query.dt_inicial}') and date('${req.query.dt_final}')` // data de criação 
      sql = sql + ` and ( id_pessoa_criou in ( ${req.query.usuarioIdPessoa}) )` // usuário 
    } else {
      sql = sql + ` and ( dt_prevista_resolucao <= date('${req.query.dt_final}') or dt_para_exibir <= now() )` // data de compromisso 
      if (req.query.eventosUsuarioChk == 'true' ) {
        sql = sql + ` and (tipodestino = 'P' and id_usuario in ( ${req.query.idusuarioSelecionado}) )` // usuário
      } else {
        sql = sql + ` and ( (tipodestino = 'O' and id_pessoa_organograma in (${req.query.departamentos})) ` 
        sql = sql +      ` or (tipodestino = 'P' and id_usuario in (${req.query.idusuarioSelecionado})) )` // departamentos or usuários
      }
    }
    sql = sql + ` and (id_motivo in ( ${req.query.motivos} )  or -1 in ( ${req.query.motivos} )  )` // motivos 
    sql = sql + ` order by dt_criou limit 100` //
    console.log(sql)
    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
          let eventos = res;
          resolve(eventos)
        }
        else {
          reject('Eventos não encontrado!')
        }
      })
      .catch(err => {
        reject(`Erro no getEventosFiltrados : ${err}`)
      })
  })
}

function getCountEventosPendentes(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select count(*) from view_eventos where
                   id_campanha is null and
                   dt_para_exibir <= now() and
                   id_status_evento in (1, 4, 5, 6) and
                   tipodestino = 'P' and id_usuario in ( ${req.query.idUsuarioLogado})`

    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
          let eventos = res;
          resolve(eventos)
        }
        else {
          reject('Eventos não encontrado!')
        }
      })
      .catch(err => {
        reject(`Erro no getEventosFiltrados : ${err}`)
      })
  })
}


function getEventoPorId(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select *
                  from view_eventos
                  where id=${req.query.id_evento}`

      client.query(sql)
        .then(evento => {
          evento = evento.rows[0];
          req.query.id_pessoa = evento.id_pessoa_receptor;
          req.query.id_motivo = evento.id_motivo;
          getPessoa(req).then(pessoa => {
            motivosRespostas(req).then(motivos_respostas => {
              getPredicao(req).then(predicoes => {
                getObjecoes(req).then(objecoes => {
                  if (!evento || !pessoa || !motivos_respostas || !predicoes) reject('Evento com erro!');
                  resolve({ pessoa, evento: evento, motivos_respostas, predicoes, objecoes });
                  client.end();
                }).catch(e => {
                  reject(e);
                });
              }).catch(e => {
                reject(e);
              });
            }).catch(e => {
              reject(e);
            });
          }).catch(e => {
            reject(e);
          });
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

function visualizarEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `UPDATE eventos SET
                  id_pessoa_visualizou = ${req.query.id_pessoa_visualizou},
                  dt_visualizou = now(),
                  id_status_evento=5
                  where id=${req.query.id_evento}`
      //console.log(sql);
      client.query(sql)
        .then(res => {
          client.end();
          resolve(res)
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

function informacoesParaCriarEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      getCanais(req).then(canais => {
        getOrganograma(req).then(organograma => {
          getUsuarios(req).then(usuarios => {
            getMotivosCanais(client).then(motivosCanais => {
              resolve({ canais, organograma, usuarios, motivosCanais })
            })
          })
        })
      })
    }).catch(e => {
      reject(e)
    })
  })
}


function getMotivosCanais(client) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from motivos
                LEFT JOIN motivos_canais ON motivos_canais.id_motivo = motivos.id
                WHERE status=true`

    client.query(sql)
      .then(res => {
        if (res.rowCount > 0) {
          let motivosCanais = res.rows;
          client.end();
          resolve(motivosCanais)
        }
        else {
          reject('Não há motivos para canais!')
          client.end();
        }
      }
      )
      .catch(err => {
        client.end();
        reject(err)
      })
  })
}



module.exports = {
  getUmEvento,
  motivosRespostas,
  salvarEvento,
  getEventosPendentes,
  getEventosLinhaDoTempo,
  getEventosRelatorioUsuario,
  getEventoFiltros,
  getEventosFiltrados,
  getEventoPorId,
  visualizarEvento,
  informacoesParaCriarEvento,
  encaminhaEvento,
  criarEvento,
  getCountEventosPendentes
}