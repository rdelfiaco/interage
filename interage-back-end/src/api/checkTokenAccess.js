exports.checkTokenAccess = function checkTokenAccess(req) {
  return new Promise(function (resolve, reject) {
    const dbconnection = require('../config/dbConnection')
    const { Client } = require('pg')

    const client = new Client(dbconnection)

    client.connect()

    let sql = `SELECT id_usuario, token_access from historico_login
                where token_access='${req.query.token}' AND ativo=true`

    client.query(sql)
      .then(res => {
        if (res.rowCount > 0) {
          let historico = res.rows[0];
          resolve(historico)
        }
        reject('Token não é válido')
      }
      )
      .catch(err => console.log(err)) //reject( err.hint ) )
  })
}