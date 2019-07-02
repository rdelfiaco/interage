const {
  executaSQL
} = require('./executaSQL');

function getAlternativas(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select * from quest_alternativas`

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function addAlternativa(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.a = JSON.parse(req.query.data);

    let sql = `INSERT INSTO quest_alternativas(
      nome,
      status,
      id_pergunta,
      sequencia_alternativa,
      id_proxima_pergunta
      ) VALUES(
        ${req.query.a.nome},
        ${req.query.a.status},
        ${req.query.a.perguntaId},
        ${req.query.a.sequencia},
        ${req.query.a.proximaPerguntaId},
        ) RETURNING id;`

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function updateStatusAlternativa(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    req.query.a = JSON.parse(req.query.data);

    let sql = `UPDATE quest_alternativas SET status=${req.query.a.status} WHERE quest_alternativa.id=${req.query.a.id}`;

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function updateAlternativa(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.a = JSON.parse(req.query.data);

    let sql = `UPDATE quest_alternativas SET 
      nome=${req.query.a.nome},
      status=${req.query.a.status},
      id_pergunta=${req.query.a.perguntaId},
      id_proxima_pergunta=${req.query.a.perguntaProximaId},
      sequencia_alternativa=${req.query.a.sequencia},
      WHERE quest_alternativas.id=${req.query.a.id}`;

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function deleteAlternativa(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    let sql = `DELETE FROM quest_alternativas
      WHERE quest_alternativas.id=${JSON.parse(req.query.id)}`;

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
  addAlternativa,
  updateStatusAlternativa,
  updateAlternativa,
  deleteAlternativa
};