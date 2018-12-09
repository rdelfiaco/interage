
const { executaSQL } = require('./executaSQL')

function salvarProposta(req, res) {
    return new Promise(function (resolve, reject) {

      let credenciais= {
        token: req.query.token,
        idUsuario : req.query.id_usuario
      };

      let sql = ``

      executaSQL(credenciais, sql).then(registros => {
        resolve(registros);
      }).catch(e => {
        reject(e);
      });
    });
}

module.exports = { salvarProposta }
