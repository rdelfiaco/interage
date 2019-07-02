const {
  executaSQL
} = require('./executaSQL');


function getQuestionarios(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `SELECT q.id, q.nome, q.status, count(perg.*) as qtde_perguntas FROM questionarios q
               inner join quest_perguntas perg on q.id = perg.id_questionario
               group by q.id, q.nome, q.status`

    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
};


function getQuestionarioById(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `SELECT * FROM questionarios where questionarios.id=${req.query.id}`
    // let resultado = null;
    executaSQL(credenciais, sql)
      .then(res => {
        // resultado = res;
        // console.log(' result questionarios' + res);
        // sql = `select * from quest_perguntas where quest_perguntas.id_questionario=${req.query.id}`;
        // executaSQL(credenciais, sql)
        //   .then(_res => {
        //     console.log(' result perguntas' + _res);
        //     console.dir(resultado)
        //     resultado.perguntas = _res
        //     console.dir(resultado)
        //     resolve(resultado);
        //   })
        //   .catch(_err => {
          //     reject(_err)
          //   })
        resolve(res);
      })
      .catch(err => {
        reject(err)
      })
  });
};

function getPerguntasByIdUqestionario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select * from quest_perguntas where quest_perguntas.id_questionario=${req.query.id}`;
    // let resultado = null;
    executaSQL(credenciais, sql)
      .then(res => {
        resolve(res);
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

    req.query.q = JSON.parse(req.query.data);

    let sql = `INSERT INSTO questionarios(nome, status) VALUES(${req.query.q.nome}, ${req.query.q.status}) RETURNING id;`

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
    req.query.q = JSON.parse(req.query.data);

    let sql = `UPDATE questionarios SET status=${req.query.q.status} WHERE questionarios.id=${req.query.q.id}`;

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

    req.query.q = JSON.parse(req.query.data);

    let sql = `UPDATE questionarios SET nome=${req.query.q.nome} WHERE questionarios.id=${req.query.q.id}`;

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
  updateStatusQuestionario,
  getQuestionarioById,
  getPerguntasByIdUqestionario
};