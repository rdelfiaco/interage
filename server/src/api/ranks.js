const { executaSQL } = require('./executaSQL')


function getRanks(req, res){
    return new Promise(function (resolve, reject) {
      getProspeccao(req).then(prospeccao => {
        getPropostasEmitidas(req).then(propostasEmitidas => {
          if (!prospeccao || !propostasEmitidas)
            reject('Filtro não pode ser elaborado ');
  
          resolve({ prospeccao, propostasEmitidas });
          
        }).catch(e => {
          reject(e);
        });
      }).catch(e => {
        reject(e);
      });
    });
  }


  function getProspeccao(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `select  usu.login as consultor, color_r,color_g, color_b, count(*) as total 
                from view_eventos ve
                JOIN usuarios usu ON ve.id_usuario = usu.id and usu.status and usu.responsavel_membro = 'M'
                where id_status_evento in (3,7)
                and id_motivo in (1)
                and date(dt_resolvido) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
                group by  usu.login, color_r,color_g, color_b
                order by  usu.login`
      executaSQL(credenciais, sql)
        .then(res => {
          if (res.length > 0) {
            resolve( res )
          }
          else resolve( 0 )
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function getProspeccaoComResposta(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `select  resposta_motivo, usu.login as consultor, color_r,color_g, color_b, count(*) as total 
                from view_eventos ve
                JOIN usuarios usu ON ve.id_usuario = usu.id and usu.status and usu.responsavel_membro = 'M'
                where id_status_evento in (3,7)
                and id_motivo in (1)
                and date(dt_resolvido) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
                group by resposta_motivo, usu.login, color_r,color_g, color_b
                order by resposta_motivo, usu.login`
      executaSQL(credenciais, sql)
        .then(res => {
          if (res.length > 0) {
            resolve( res )
          }
          else resolve( 0 )
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function getPropostasEmitidas(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `select  usu.login as consultor, color_r,color_g, color_b, count(vp.*) as total 
                from view_proposta vp
                JOIN usuarios usu ON vp.id_usuario = usu.id and usu.status and usu.responsavel_membro = 'M'
                where date(dtsalvou) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
                group by  usu.login , color_r,color_g, color_b
                order by  usu.login `
      executaSQL(credenciais, sql)
        .then(res => {
          if (res.length > 0) {
            resolve( res )
          }
          else resolve( 0 )
        })
        .catch(err => {
          reject(err)
        })
    })
  }

module.exports = {  getRanks };
