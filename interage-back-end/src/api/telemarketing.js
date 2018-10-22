const { checkTokenAccess } = require('./checkTokenAccess');
const { getUmEvento, motivosRespostas } = require('./evento');
const { getPredicao } = require('./predicao');
const { getObjecoes } = require('./objecoes');
const { getPessoa } = require('./pessoa');
const { getMetaPessoa } = require('./metaLigacoes');

function getLigacaoTelemarketing(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getUmEvento(req).then(evento => {
        req.query.id_pessoa = evento.id_pessoa_receptor;
        req.query.id_motivo = evento.id_motivo;
        getPessoa(req).then(pessoa => {
          motivosRespostas(req).then(motivos_respostas => {
            getPredicao(req).then(predicoes => {
              getObjecoes(req).then(objecoes => {
                getMetaPessoa(req).then(metaPessoa => {
                  if (!evento || !pessoa || !motivos_respostas || !predicoes || !metaPessoa) reject('Ligação com erro!');

                  resolve({ pessoa, evento, motivos_respostas, predicoes, objecoes, metaPessoa });
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