const { checkTokenAccess } = require('./checkTokenAccess');
// const sinesp = require('sinesp-nodejs')
const sinesp = require('sinesp-api')

function consultarPlaca(req, res) {
    console.log("consultarPlaca")
    return new Promise(function (resolve, reject) {
        
        sinesp.configure({
            // proxy: {
            //     host: "177.54.144.208",
            //     port: "80",
            // }
        }).search(req.query.placa).then(dados => {
            resolve(dados);
        }).catch(err => {
            reject(err);

        })

    })
}

module.exports = { consultarPlaca }