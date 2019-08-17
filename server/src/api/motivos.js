const { executaSQL } = require('./executaSQL');


function getMotivos(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
                                              
      let sql = `SELECT * from motivos ` 

      executaSQL(credenciais, sql)
        .then(res => {
            resolve(res)
        })
        .catch(err => {
          reject(err)
        })
  });
};

function crudMotivos(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

// divide o objeto em atuais e anteriores 
  let dadosAtuais = JSON.parse(req.query.dadosAtuais);
  const dadosAnteriores =  JSON.parse(req.query.dadosAnteriores);
  const crud = req.query.crud;
  req.query = dadosAtuais;
  //req.query.id_usuario = credenciais.idUsuario;
  let tabela = 'motivos';
  let idTabela = req.query.id;
  let sql = ''
  if (crud == 'C') sql = sqlCreate(); 
  if (crud == 'D') sql = sqlDelete();
  if (crud == 'U') sql = sqlUpdate();
  executaSQL(credenciais, sql).then(res => {
    // auditoria 
    // if (crud == 'C') idTabela = res[0].id;
    // auditoria(credenciais, tabela, crud , idTabela, dadosAnteriores, dadosAtuais );
    resolve(res)

  })
  .catch(err => {
    reject(err)
  });

  function sqlCreate(){
    let sql = `INSERT INTO motivos(
               status,  nome)
              VALUES ( ${req.query.status},  '${req.query.nome}') RETURNING id;`;
    return sql;
  };
  function sqlDelete(){
    let sql = `DELETE FROM motivos
                WHERE id= ${req.query.id};`;
    return sql;
  };
  function sqlUpdate(){
    let sql = `UPDATE motivos
               SET  status=${req.query.status}, 
                    nome='${req.query.nome}'
              WHERE id= ${req.query.id};`;
    return sql;
  };


});
};

module.exports = { getMotivos, crudMotivos }