const { checkTokenAccess } = require('./checkTokenAccess');

function getPredicao(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sqlPredicao = `SELECT * from predicao`
      client.query(sqlPredicao).then(res => {
        let predicao = res.rows;

        client.end();
        resolve(predicao)
      }).catch(e => reject(e))
    });
  });
}

module.exports = { getPredicao }