const { checkTokenAccess } = require('./checkTokenAccess');
const sinesp = require('sinesp-nodejs')
// const sinesp = require('sinesp-api')

function consultarPlaca(req, res) {
    return new Promise(function (resolve, reject) {
        sinesp.consultaPlaca(req.query.placa).then(dados => {
            resolve(dados);
        }).catch(err => {
            reject(err);

        })

    })
}

module.exports = { consultarPlaca }