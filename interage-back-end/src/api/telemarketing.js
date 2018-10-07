const { checkTokenAccess } = require('./checkTokenAccess');
const { getUmEvento, motivosRespostas } = require('./evento');
const { getPredicao } = require('./predicao');
const { getPessoa } = require('./pessoa');

function getLigacaoTelemarketing(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getUmEvento(req).then(evento => {
        req.query.id_pessoa = evento.id_pessoa_receptor;
        req.query.id_motivo = evento.id_motivo;
        getPessoa(req).then(pessoa => {
          motivosRespostas(req).then(motivos_respostas => {
            getPredicao(req).then(predicoes => {
              if (!evento || !pessoa || !motivos_respostas || !predicoes) reject('Ligação com erro!');

              resolve({ pessoa, evento, motivos_respostas, predicoes });
            }).catch(e => {
              reject(e);
            });
          }).catch(e => {
            reject(e);
          });
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