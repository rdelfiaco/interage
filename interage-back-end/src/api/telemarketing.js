const { checkTokenAccess } = require('./checkTokenAccess');
const { getUmEvento, motivosRespostas } = require('./evento');
const { getPessoa } = require('./pessoa');

function getLigacaoTelemarketing(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getUmEvento(req).then(evento => {
        req.query.id_pessoa = evento.id_pessoa_receptor;
        req.query.id_motivo = evento.id_motivo;
        getPessoa(req).then(pessoa => {
          motivosRespostas(req).then(motivos_respostas => {
            if (!evento || !pessoa || !motivos_respostas) reject('Ligação com erro!');

            resolve({ pessoa, evento, motivos_respostas });
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