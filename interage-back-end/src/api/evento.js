const { checkTokenAccess } = require('./checkTokenAccess');

function getUmEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT * FROM eventos
                  WHERE dt_para_exibir=(SELECT MIN  (dt_para_exibir) FROM eventos) AND id_campanha=${req.query.id_campanha} AND id_status_evento=1
                  LIMIT 1`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let evento = res.rows[0];

            const updateDataVisualizou = `UPDATE eventos SET dt_visualizou=now(), id_pessoa_visualizou=${req.query.id_usuario}
            WHERE id=${evento.id}`

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

function motivosRespostas(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sqlMotivosResposta = `SELECT motivos_respostas.id, motivos_respostas.exige_predicao, motivos_respostas.nome, motivos_respostas.ordem_listagem, motivos_eventos_automaticos.reagendar FROM motivos_respostas
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

        if (motivoResposta_automatico.length > 0) {
          client.query('BEGIN').then((res1) => {

            const update = `UPDATE eventos SET id_status_evento=3,
            dt_resolvido=now(),
            id_pessoa_resolveu=${req.query.id_pessoa}, 
            observacao_retorno='${req.query.observacao}',
            id_resp_motivo=${req.query.id_motivos_respostas},
            id_telefone=${req.query.id_telefoneDiscado}
            WHERE eventos.id=${req.query.id_evento};
            `;

            client.query(update).then((res) => {
              motivoResposta_automatico.map((m, index, array) => {
                eventoCriar = createEvent(m)
                client.query(eventoCriar).then(res => {
                  if (index == array.length - 1)
                    client.query('COMMIT').then((resposta) => {
                      client.end();
                      resolve(resposta)
                    })
                }).catch(e => reject(e))
              })
            }).catch(e => reject(e))
          })
        }
      }).catch(e => reject(e))
      function createEvent(motivoResposta) {
        dataString = req.query.data.split('/');
        console.dir(req.query.data)
        horaString = req.query.hora.split(':');

        let data = new Date(dataString[2], dataString[1], dataString[0], horaString[0], horaString[1])
        console.log(dataString[2], dataString[1], dataString[0], horaString[0], horaString[1])
        console.log(data)
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
            '${data.toISOString()}',
            '${data.toISOString()}',
            '${motivoResposta.tipodestino}', 
            ${motivoResposta.id_pessoa_organograma},
            ${req.query.id_pessoa_receptor},
            ${motivoResposta.id_prioridade},
            '${motivoResposta.observacao_origem}',
            ${motivoResposta.id_canal})`
      }
    });
  });

}

module.exports = { getUmEvento, motivosRespostas, salvarEvento }