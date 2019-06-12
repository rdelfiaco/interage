const { executaSQL } = require('./executaSQL');


function getCanais(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
                                              
      let sql = `SELECT * from canais ` 

      executaSQL(credenciais, sql)
        .then(res => {
            resolve(res)
        })
        .catch(err => {
          reject(err)
        })
  });
};


module.exports = { getCanais }