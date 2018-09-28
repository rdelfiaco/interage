const { checkTokenAccess } = require('./checkTokenAccess');

function getUmEvento(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      console.log('historico.id_usuario', historico.id_usuario)
      let sql = `SELECT * FROM eventos
                  WHERE dt_para_exibir=(SELECT MAX(dt_para_exibir) FROM eventos) AND id_campanha=${req.query.id_evento}
                  LIMIT 1`

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

module.exports = { getUmEvento }