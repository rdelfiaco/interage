const { checkTokenAccess } = require('./checkTokenAccess');

function getUmEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT * FROM eventos
                  WHERE dt_para_exibir=(SELECT MAX(dt_para_exibir) FROM eventos) AND id_campanha=${req.query.id_evento}
                  LIMIT 1`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let evento = res.rows[0];
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

      console.log('req.query.id_motivo', req.query.id_motivo)
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

module.exports = { getUmEvento, motivosRespostas }