const { checkTokenAccess } = require('./checkTokenAccess');
const { getUmEvento } = require('./evento');
const { getPessoa } = require('./pessoa');

function getLigacaoTelemarketing(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getUmEvento(req).then(evento => {
        req.query.id_pessoa = evento[0].id_pessoa_receptor;
        getPessoa(req).then(pessoa => {
          if (!evento || !pessoa) reject('Ligação com erro!');

          resolve({ pessoa, evento: evento[0] });
        }).catch(e => {
          reject(e);
        });
      }).catch(e => {
        reject(e);
      });
    }).catch(e => {
      reject(e)
    })
  })
}

module.exports = { getLigacaoTelemarketing }