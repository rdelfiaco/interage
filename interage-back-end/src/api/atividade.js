const { checkTokenAccess } = require('./checkTokenAccess');

function getAtividades(req, res) {
    return new Promise(function (resolve, reject) {

        checkTokenAccess(req).then(historico => {
            const dbconnection = require('../config/dbConnection')
            const { Client } = require('pg')

            const client = new Client(dbconnection)

            client.connect()

            let sql = `SELECT * FROM atividades`

            client.query(sql)
                .then(res => {
                    if (res.rowCount > 0) {
                        let atividades = res.rows;

                        client.end();
                        resolve(atividades)
                    }
                    reject('Usuário não encontrado')
                }
                )
                .catch(err => console.log(err)) //reject( err.hint ) )
        }).catch(e => {
            reject(e)
        })
    })
}

module.exports = { getAtividades }