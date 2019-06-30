const {
  executaSQL
} = require('./executaSQL');


function getAlternativas(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `SELECT * from quest_alternativas `

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function addAlternativas(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.alternativas = JSON.parse(req.query.alternativas);

    let sql = `INSERT INSTO quest_alternativas(nome, sequencia_alternativa, status, id_pergunta) VALUES(${req.query.nome}, ${req.query.sequencia}, ${req.query.status}, ${req.query.idPergunta}) RETURNING id;`

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};


module.exports = {
  getAlternativas,
  addAlternativas,
};