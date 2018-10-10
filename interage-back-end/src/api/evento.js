const { checkTokenAccess } = require('./checkTokenAccess');

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
          and ( (tipodestino = 'O' and id_pessoa_organograma = ${req.query.id_organograma} )
            or  (tipodestino = 'P' and id_usuario = ${req.query.id_usuario} )
            or  (id_pessoa_visualizou = ${req.query.id_pessoa} and id_status_evento in(5,6)  ))
          and dt_para_exibir <= now()
          order by dt_para_exibir, id_prioridade desc`

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

              }).catch(e => {
                reject(e)
              })
          }
          else reject('Não há eventos!')
        })
        .catch(err => console.log(err))
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

      let sqlMotivosResposta = `SELECT motivos_respostas.id, motivos_respostas.exige_predicao, motivos_respostas.nome, motivos_respostas.ordem_listagem, motivos_respostas.exige_observacao, motivos_eventos_automaticos.reagendar FROM motivos_respostas
                      LEFT JOIN motivos_eventos_automaticos ON motivos_respostas.id = motivos_eventos_automaticos.id_motivo_resposta
                      WHERE motivos_respostas.id_motivo=${req.query.id_motivo} AND status=true`
      client.query(sqlMotivosResposta).then(res => {
        let motivos_respostas = res.rows;

        client.end();
        resolve(motivos_respostas)
      }).catch(e => reject(e))
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

        client.query('BEGIN').then((res1) => {
          let update;
          if (req.query.id_predicao) {
            update = `UPDATE eventos SET id_status_evento=3,
              dt_resolvido=now(),
                  id_pessoa_resolveu=${req.query.id_pessoa}, 
                  observacao_retorno='${req.query.observacao}',
                  id_resp_motivo=${req.query.id_motivos_respostas},
                  id_telefone=${req.query.id_telefoneDiscado},
                  id_predicao=${req.query.id_predicao}
                  WHERE eventos.id=${req.query.id_evento};
                  `;
          }
          else {
            update = `UPDATE eventos SET id_status_evento=3,
                  dt_resolvido=now(),
                  id_pessoa_resolveu=${req.query.id_pessoa}, 
                  observacao_retorno='${req.query.observacao}',
                  id_resp_motivo=${req.query.id_motivos_respostas},
                  id_telefone=${req.query.id_telefoneDiscado}
                  WHERE eventos.id=${req.query.id_evento};
                  `;
          }
          console.log(update)
          client.query(update).then((res) => {
            console.log('motivoResposta_automatico.length', motivoResposta_automatico)
            if (motivoResposta_automatico.length > 0) {
              motivoResposta_automatico.map((m, index, array) => {
                eventoCriar = createEvent(m)
                console.log('eventoCriar', eventoCriar)
                client.query(eventoCriar).then(res => {
                  console.log('index == array.length - 1', index == array.length - 1)
                  if (index == array.length - 1)
                    client.query('COMMIT').then((resposta) => {
                      client.end();
                      resolve(resposta)
                    })
                }).catch(e => reject(e))
              })
            }
            else {
              client.query('COMMIT').then((resposta) => {
                client.end();
                resolve(true)
              })
            }
          }).catch(e => reject(e))
        })
      }).catch(e => reject(e))
      function createEvent(motivoResposta) {
        let tipoDestino;
        let id_pessoa_organograma;

        if (motivoResposta.gera_para == 1) {
          tipoDestino = motivoResposta.tipodestino;
          id_pessoa_organograma = motivoResposta.id_pessoa_organograma;
        }
        else if (motivoResposta.gera_para == 2) {
          tipoDestino = 'P';
          id_pessoa_organograma = req.query.id_pessoa
        }
        else {
          tipoDestino = req.query.tipoDestino;
          id_pessoa_organograma = req.query.id_pessoa_organograma_destino;
        }

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
            ${motivoResposta.id_motivo},
            ${req.query.id_evento_pai},
            ${req.query.id_evento},
            1,
            ${req.query.id_pessoa},
            now(),
            '${req.query.data}',
            '${req.query.data}',
            '${tipoDestino}', 
            ${id_pessoa_organograma},
            ${req.query.id_pessoa_receptor},
            ${motivoResposta.id_prioridade},
            '${motivoResposta.observacao_origem}',
            ${motivoResposta.id_canal})`
      }
    });
  });

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
                order by dt_criou `

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
        )
        .catch(err => console.log(err)) //reject( err.hint ) )
    }).catch(e => {
      reject(e)
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
        }
        )
        .catch(err => console.log(err)) //reject( err.hint ) )
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
  getEventosLinhaDoTempo
}