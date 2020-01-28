const { executaSQL } = require('./executaSQL');
const { auditoria } = require('./auditoria');



function getParametrosInterage(req, res){
    return new Promise(function (resolve, reject) {

        let credenciais = {
          token: req.query.token,
          idUsuario: req.query.id_usuario
        };
    
        let sql = `select * from interage_parametros  `
        executaSQL(credenciais, sql)
          .then(res => {
            if (res.length > 0) {
              let propostas = res;
              resolve(propostas)
            }
            else reject('Interage parâmetros não encontrada!')
          })
          .catch(err => {
            reject(err)
          })
      });
  };


module.exports = { getParametrosInterage };