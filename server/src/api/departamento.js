const { executaSQL } = require('./executaSQL');
const { getUsuarios } = require('./usuario');


function getDepartamentos(req, res) {
    return new Promise(function (resolve, reject) {
  
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `
            select o.*, s.nome as superior
            from organograma o
            left join organograma s on o.id_pai = s.id
            order by s.nome, o.nome 
      `
      executaSQL(credenciais, sql).then(departamentos => {
          resolve(departamentos )
        }).catch(e => {
        reject('getDepartamentos',e);
      });

    });
  };


function getDepartamentosUsuarios(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    getDepartamentos(req, res).then(departamentos => {
      getUsuarios(req, res).then(usuarios => {
        resolve({departamentos, usuarios} )
      }).catch(e => {
      reject('getDepartamentosUsuarios',e);
    });
    }).catch(e => {
      reject('getDepartamentosUsuarios',e);
    });
  })
};



  
  
  
  module.exports = { getDepartamentos, getDepartamentosUsuarios }