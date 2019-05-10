const { checkToken} = require('./checkToken');

 async function executaSQL(credenciais, sql) {
    return new Promise(function (resolve, reject) {
        checkToken(credenciais.token, credenciais.idUsuario).then(historico => {
            const dbconnection = require('../config/dbConnection')
            const { Client } = require('pg')
            const client = new Client(dbconnection)
            client.connect()
            client.query(sql).then(res => {
                    let registros 
                    if (res.rowCount > 0) {
                        registros = res.rows;
                    } else {
                        registros = null;
                    };
                    client.end();
                    resolve(registros);
                }).catch(err => {
                    client.end();
                    reject(err);
                });
        }).catch(e => {
            reject(e);
          });
    });
}

async function executaSQLComTransacao(credenciais, client,  sql) {
    return new Promise(function (resolve, reject) {
        checkToken(credenciais.token, credenciais.idUsuario).then(historico => {
            client.query(sql).then(res => {
                    let registros 
                    if (res.rowCount > 0) {
                        registros = res.rows;
                    } else {
                        registros = null;
                    };
                    resolve(registros);
                }).catch(err => {
                    reject(err);
                });
        }).catch(e => {
            reject(e);
          });
    });
}


module.exports = { executaSQL, executaSQLComTransacao  }