const { checkTokenAccess } = require('./checkTokenAccess');

function busca(req, res) {
    return new Promise(function (resolve, reject) {

        // checkTokenAccess(req).then(historico => {
        sinesp = require('sinesp-nodejs')

        /* Realizar uma consulta contra a placa AAA-0001 */
        sinesp.consultaPlaca('NFU9272').then(dados => {
            console.log(dados);
            resolve(dados);
        }).catch(err => {
            reject(dados);
            console.log(err);
        })
        // }).catch(e => {
        //     reject(e)
        // })
    })
}

module.exports = { busca }