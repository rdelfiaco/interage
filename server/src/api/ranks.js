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


  // function getProspeccao(req, res){
  //   return new Promise(function (resolve, reject) {
  //     let credenciais = {
  //       token: req.query.token,
  //       idUsuario: req.query.id_usuario
  //     };
  //     let sql = `select  usu.login as consultor, color_r,color_g, color_b, count(*) as total 
  //               from view_eventos ve
  //               JOIN usuarios usu ON ve.id_usuario = usu.id and usu.status and usu.responsavel_membro = 'M'
  //               where id_status_evento in (3,7)
  //               and id_motivo in (1)
  //               and date(dt_resolvido) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
  //               group by  usu.login, color_r,color_g, color_b
  //               order by  usu.login`
  //     executaSQL(credenciais, sql)
  //       .then(res => {
  //         if (res.length > 0) {
  //           resolve( res )
  //         }
  //         else resolve( 0 )
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // }

  function getProspeccao(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `select mr.nome as resposta_motivo, u.login as consultor , u.color_r, u.color_g, u.color_b, count(e.*) as total
                 from motivos_respostas mr
                 inner join usuarios u on u.status and id_organograma = 4 and responsavel_membro = 'M'
                 left join eventos e on u.id_pessoa = e.id_pessoa_resolveu 
                      and mr.id = e.id_resp_motivo 
                      and e.id_status_evento in (3,7)
                      and date(dt_resolvido) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
                  where mr.id_motivo = 1 and mr.status 
                  group by mr.nome, u.login, u.color_r, u.color_g, u.color_b
                  order by mr.nome, u.login`
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

  // function getPropostasEmitidas(req, res){
  //   return new Promise(function (resolve, reject) {
  //     let credenciais = {
  //       token: req.query.token,
  //       idUsuario: req.query.id_usuario
  //     };
  //     let sql = `select  usu.login as consultor, color_r,color_g, color_b, count(vp.*) as total 
  //               from view_proposta vp
  //               JOIN usuarios usu ON vp.id_usuario = usu.id and usu.status and usu.responsavel_membro = 'M'
  //               where date(dtsalvou) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
  //               group by  usu.login , color_r,color_g, color_b
  //               order by  usu.login `
  //     executaSQL(credenciais, sql)
  //       .then(res => {
  //         if (res.length > 0) {
  //           resolve( res )
  //         }
  //         else resolve( 0 )
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  // }

  function getPropostasEmitidas(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = `select sp.legenda_grafico as status_proposta, u.login as consultor , u.color_r, u.color_g, u.color_b, count(pr.*) as total
                from status_proposta sp
                inner join usuarios u on u.status and id_organograma = 4 and responsavel_membro = 'M'
                left join propostas pr on u.id = pr.id_usuario 
                          and date(dtsalvou) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}')
                where sp.status 
                group by sp.legenda_grafico, u.login, u.color_r, u.color_g, u.color_b
                order by sp.legenda_grafico, u.login `
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
