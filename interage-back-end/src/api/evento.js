const { checkTokenAccess } = require('./checkTokenAccess');
const { getMetaPessoa } = require('./metaLigacoes');

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

      console.log(sql)
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

      let sqlMotivosResposta = `SELECT motivos_respostas.id, motivos_respostas.exige_predicao, motivos_respostas.exige_objecao,  motivos_respostas.nome, motivos_respostas.ordem_listagem, motivos_respostas.exige_observacao, motivos_eventos_automaticos.reagendar FROM motivos_respostas
                      LEFT JOIN motivos_eventos_automaticos ON motivos_respostas.id = motivos_eventos_automaticos.id_motivo_resposta
                      WHERE motivos_respostas.id_motivo=${req.query.id_motivo} AND status=true`
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

          client.query('BEGIN').then((res1) => {
            let update;
            update = `UPDATE eventos SET id_status_evento=3,
              dt_resolvido=now(),
                  id_pessoa_resolveu=${req.query.id_pessoa}, 
                  observacao_retorno='${req.query.observacao}',
                  id_resp_motivo=${req.query.id_motivos_respostas},
                  id_telefone=${req.query.id_telefoneDiscado},
                  id_predicao=${req.query.id_predicao || 'NULL'},
                  id_objecao=${req.query.id_objecao || 'NULL'}
                  WHERE eventos.id=${req.query.id_evento}
                  RETURNING tipoDestino, id_pessoa_organograma;
                  `;
            console.log(update)
            client.query(update).then((updateEventoEncerrado) => {

              const selectQuantidadeTentativas = `SELECT COUNT(id_resp_motivo) from eventos

                                             WHERE ((id_resp_motivo=${req.query.id_motivos_respostas} AND 
                                             id_evento_pai = ${req.query.id_evento_pai}) OR
                                             
                                             (id_resp_motivo=${req.query.id_motivos_respostas} AND
                                              id = ${req.query.id_evento_pai}))`

              console.log('selectQuantidadeTentativas', selectQuantidadeTentativas)
              client.query(selectQuantidadeTentativas).then((qtdTentativas) => {
                qtdTentativas = parseInt(qtdTentativas.rows[0].count);
                console.log('motivoResposta_automatico.length', motivoResposta_automatico)

                console.log('qtdTentativas', qtdTentativas)
                console.log('motivoResposta.tentativas', motivoResposta.tentativas)
                console.log('motivoResposta.tentativas > qtdTentativas', motivoResposta.tentativas > qtdTentativas)
                if (motivoResposta.tentativas > qtdTentativas) {

                  if (motivoResposta_automatico.length > 0) {
                    motivoResposta_automatico.map((m, index, array) => {
                      eventoCriar = createEvent(m, motivoResposta, updateEventoEncerrado)
                      console.log('eventoCriar', eventoCriar)

                      client.query(eventoCriar).then(res => {
                        console.log('index == array.length - 1', index == array.length - 1)

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


              }).catch(err => {
                client.end();
                reject(err)
              })
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
            'select func_dt_expira(${motivoRespostaAutomatico.id_motivo})',
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
    reject(err)
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

      console.log(sql)
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

      let sql = `select * from organograma order by nome`

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


function getUsuarios(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select p.id, p.nome, u.id_organograma
                  from usuarios u
                  inner join pessoas p on u.id_pessoa = p.id and u.status = true 
                  order by p.nome`

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

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select * from view_eventos where `
      sql = sql + `id_status_evento in (${req.query.status}) `  // status 
      if (req.query.eventosUsuarioChk == 'true') {
        sql = sql + ` and (tipodestino = 'P' and id_pessoa_organograma in ( ${req.query.usuarios}) )` // usuário
      } else {
        sql = sql + ` and ( tipodestino = 'O' and id_pessoa_organograma in (${req.query.departamentos}) )` // departamentos 
      }
      sql = sql + ` and (id_motivo in ( ${req.query.motivos})  )` // motivos 
      if (req.query.dtCricaoRadio == 'true') {
        sql = sql + ` and date(dt_criou) between date('${req.query.dt_inicial}') and date('${req.query.dt_final}')` // data de criação 
      } else {
        sql = sql + ` and dt_para_exibir <= now()` // data de compromisso 
      }

      sql = sql + ` order by dt_criou limit 100` //

      console.log(sql)
      console.log(req.query.dtCricaoRadio)

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
        .then(res => {
          if (res.rowCount > 0) {
            let evento = res.rows;
            client.end();
            resolve(evento)
          }
          else {
            reject('Não há evento!')
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
      console.log(sql);
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
  visualizarEvento
}