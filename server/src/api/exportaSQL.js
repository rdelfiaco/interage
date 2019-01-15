const { executaSQL } = require('./executaSQL')


function getSQLs(req, res) {
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.idUsuarioLogado
      };
      
      let sql = `select id,nome, sql from sql_exportar where status`
      
      executaSQL(credenciais, sql)
        .then(res => {
          if (res) {
            let sqls = res;
            resolve(sqls)
          }
          else reject('Não há SQL!')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function getResultadoSQLs(req, res) {
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.idUsuarioLogado
      };
      
      let sql = req.query.sql

      sql = sql.replace('${dataInicial}', `${req.query.dataInicial}`)
      sql = sql.replace('${dataFinal}', `${req.query.dataFinal}`)
      
      executaSQL(credenciais, sql)
        .then(res => {
          if (res) {
            let sqls = res;
            resolve(sqls)
          }
          else reject(' há SQL!')
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  module.exports = {getSQLs, getResultadoSQLs}