const { checkTokenAccess } = require('./checkTokenAccess');

function importaLead(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      var bodyStr = '';

      req.on("data", function (chunk) {
        bodyStr += chunk.toString();
      });
      req.on("end", function () {
        const file = JSON.parse(bodyStr);

        console.log(file)

        const dbconnection = require('../config/dbConnection')
        const { Client } = require('pg')

        const client = new Client(dbconnection)

        client.connect()

        file.forEach(element, index, array => {
          ///TRABALHAR AQUI
          client.query('BEGIN').then((res1) => {


            let sqlPredicao = `INSERT * from predicao where status=true`
            client.query(sqlPredicao).then(res => {
              let predicao = res.rows;

              if (index == array.length - 1) {
                client.query('COMMIT').then((resposta) => {
                  getMetaPessoa(req).then(metaPessoa => {
                    client.end();
                    resolve('Arquivo Importado');
                  }).catch(err => {
                    client.end();
                    reject(err)
                  })
                })

              }

              if (err) {
                client.query('ROLLBACK').then((resposta) => {
                  client.end();
                  reject('Erro ao processar arquivo importado')
                }).catch(err => {
                  client.end();
                  reject(err)
                })
              }

            });


          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(err => {
          client.end();
          reject(err)
        })
      });

    })
  }).catch(e => {
    console.log('error', e)
  })
}

module.exports = { importaLead }