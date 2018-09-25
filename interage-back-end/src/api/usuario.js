function login(req, res) {
  return new Promise(function (resolve, reject) {
    const dbconnection = require('../config/dbConnection')
    const { Client } = require('pg')
    const { SHA1 } = require('./SHA1.js')

    const client = new Client(dbconnection)

    client.connect()

    const senhaCriptografada = SHA1(req.query.senha)
    let sql = `SELECT * from usuarios where login = '${req.query.login}' AND senha='${senhaCriptografada}'`

    client.query(sql)
      .then(res => {
        if (res.rowCount > 0) {
          let token_access = generateTokenUserAcess()
          client.query(`insert into historico_login(id_usuario, ip, datahora, token_access, ativo)
            VALUES ( ${res.rows[0].id} , '${req.ip}', now(), '${token_access}', true ) `);

          let usuario = res.rows[0];
          delete usuario.senha;
          delete usuario.login;
          usuario.token = token_access;
          resolve(usuario)
        }
        reject('Usuário não encontrato')
      }
      )
      .catch(err => console.log(err)) //reject( err.hint ) )
  })
}

function generateTokenUserAcess() {
  return rand() + rand();

  function rand() {
    return Math.random().toString(36).substr(2);
  };
};

module.exports = { login }