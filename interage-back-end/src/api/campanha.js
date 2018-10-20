const { checkTokenAccess } = require('./checkTokenAccess');
const { getPredicoesCampanha } = require('./predicao');

function getCampanhasDoUsuario(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT * FROM campanhas_usuarios
									INNER JOIN campanhas ON campanhas_usuarios.id_campanha=campanhas.id
									WHERE campanhas_usuarios.id_usuario='${historico.id_usuario}'`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let campanhas = res.rows;

            client.end();
            resolve(campanhas)
          }
          reject('Campanha não encontrada')
        }
        )
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getCampanhas(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `SELECT id, nome, to_char(dt_inicio, 'dd/mm/yyyy') as dt_inicio 
	        , to_char(dt_fim , 'dd/mm/yyyy') as dt_fim FROM public.campanhas`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let campanhas = res.rows;

            client.end();
            resolve(campanhas)
          }
          reject('Campanha não encontrada')
        }
        )
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getCampanhaAnalisar(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      getCampanhaProspects(req).then(campanhaProspects => {
        getCampanhaTentando(req).then(campanhaTentando => {
          getPredicoesCampanha(req).then(campanhaPredicoes => {
            getCampanhaResultado(req).then(campanhaResultado => {
              getTotalLigacoesCampanha(req).then(totalLigacoesCampanha => {

                if (!campanhaProspects || !campanhaTentando || !campanhaPredicoes || !campanhaResultado || !totalLigacoesCampanha) reject('Campanha sem retorno');

                resolve({ campanhaProspects, campanhaTentando, campanhaPredicoes, campanhaResultado, totalLigacoesCampanha });

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


function getCampanhaProspects(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select count(*) as prospects from eventos 
						where id_campanha = ${req.query.id_campanha} 
						and date(dt_criou) between '${req.query.dtInicial}' and '${req.query.dtFinal}'
						and id_evento_pai is null`


      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let registros = res.rows;

            client.end();
            resolve(registros)
          }
          reject('prospects não encontrados')
        }
        )
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getCampanhaTentando(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select tentativas, CASE  WHEN tentativas = 0 THEN count(*) else count(tentativas) end  as qtde
      from ( select id_pessoa_receptor, count(*) as tentativas
              from eventos  
              where id_status_evento in (3,7)
             and CASE  WHEN id_evento_pai is null then id else id_evento_pai end 
                          in ( select id from eventos where id_campanha = ${req.query.id_campanha}
                                                              and id_evento_pai is null  
                              and date(dt_criou) 
                              between '${req.query.dtInicial}' and '${req.query.dtFinal}' )
             group by id_pessoa_receptor
             union
             select id_pessoa_receptor,  0 as tentativas
                     from eventos  
                     where id_evento_pai is null and id_status_evento in (1,4)
                                  and  id_campanha = 5 and id_evento_pai is null 
                and date(dt_criou) between '${req.query.dtInicial}' and '${req.query.dtFinal}' 
             group by id_pessoa_receptor) a
       group by tentativas
       order by tentativas`



      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let registros = res.rows;

            client.end();
            resolve(registros)
          }
          reject('Campanha tentando não encontrados')
        }
        )
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getCampanhaResultado(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select '1' as id  ,'Comprou' as descricao, count(*) as qdte
                    from eventos 
                  where id_campanha = ${req.query.id_campanha}
                    and date(dt_criou) between '${req.query.dtInicial}' and '${req.query.dtFinal}'
                  and id_resp_motivo = 8
                union 
                select  '2' as id ,'Não comprou' as descricao, count(*) as qdte
                    from eventos 
                  where id_campanha = ${req.query.id_campanha}
                    and date(dt_criou) between '${req.query.dtInicial}' and '${req.query.dtFinal}'
                  and id_resp_motivo = 9
                union	
                select  '3' as id , 'Ligações excedidas' as descricao, count(*) as qdte 
                    from eventos 
                  where id_campanha = ${req.query.id_campanha}
                    and date(dt_criou) between '${req.query.dtInicial}' and '${req.query.dtFinal}'
                  and excedeu_tentativas 	
                
                order by id`



      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let registros = res.rows;
            resolve(registros)
          }
          else
            reject('Campanha resultado não encontrados')
          client.end();
        })
        .catch(err => {
          client.end();
          console.log(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getEventosRelatorioCampanha(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select *
      from view_eventos 
      where id_status_evento in (3,7)
      and id_campanha = ${req.query.id_campanha}`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há eventos!')
            client.end();
          }
        }
        )
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

function getTotalLigacoesCampanha(req, res) {
  return new Promise(function (resolve, reject) {

    checkTokenAccess(req).then(historico => {
      const dbconnection = require('../config/dbConnection')
      const { Client } = require('pg')

      const client = new Client(dbconnection)

      client.connect()

      let sql = `select count(*) as total_ligacoes
                  from eventos e
                  inner join usuarios u on e.id_pessoa_resolveu = u.id_pessoa
                  where id_status_evento in (3,7)
                  and id_canal = 3
                  and u.id_organograma = 4
                  and date(dt_resolvido) between date('${req.query.dtInicial}') and date('${req.query.dtFinal}')
                  and e.id_campanha = ${req.query.id_campanha}`

      client.query(sql)
        .then(res => {
          if (res.rowCount > 0) {
            let eventos = res.rows;
            client.end();
            resolve(eventos)
          }
          else {
            reject('Não há eventos!')
            client.end();
          }
        })
        .catch(err => {
          client.end();
          reject(err)
        })
    }).catch(e => {
      reject(e)
    })
  })
}

module.exports = { getCampanhasDoUsuario, getCampanhas, getCampanhaAnalisar, getCampanhaResultado, getEventosRelatorioCampanha }