const {
  executaSQL
} = require('./executaSQL');


function getQuestionarios(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `SELECT * from questionarios `

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function addQuestionario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.questinario = JSON.parse(req.query.questinario);

    let sql = `INSERT INSTO questionarios(nome, status) VALUES(${req.query.nome}, ${req.query.status}) RETURNING id;`

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function updateStatusQuestionario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    console.log('------------------------QUESTIONARIOA');
    console.log(req.query.questinario);
    console.dir(JSON.parse(req.query.questinario));
    req.query.questinario = JSON.parse(req.query.questinario);

    let sql = `UPDATE questionarios SET status=${req.query.status},WHERE questionarios.id=${req.query.id}`;

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function updateQuestionario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.questinario = JSON.parse(req.query.questinario);

    let sql = `UPDATE questionarios SET nome=${req.query.nome},status=${req.query.status},WHERE questionarios.id=${req.query.id}`;

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};

function delteQuestionario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.questinario = JSON.parse(req.query.questinario);

    let sql = `DELETE FROM questionarios
      WHERE questionarios.id=${req.query.id}`;

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
  getQuestionarios,
  addQuestionario,
  updateQuestionario,
  delteQuestionario,
  updateStatusQuestionario
};