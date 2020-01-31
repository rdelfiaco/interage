const { executaSQL } = require('./executaSQL');
const { auditoria } = require('./auditoria');



function getParametrosInterage(req, res){
    return new Promise(function (resolve, reject) {

        let credenciais = {
          token: req.query.token,
          idUsuario: req.query.id_usuario
        };
    
        let sql = `select * from interage_parametros order by id `
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


  function setParametrosInterages(req, res){
    return new Promise(function (resolve, reject) {

      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };

      let sql = `update interage_parametros set valor = '${req.query.valor}' where id = ${req.query.id_parametro} `
      executaSQL(credenciais, sql)
      .then(res => {
          resolve( {sucesso: true})
      })
      .catch(err => {
        reject({error: err})
      })

    });
  }


module.exports = { getParametrosInterage, setParametrosInterages };