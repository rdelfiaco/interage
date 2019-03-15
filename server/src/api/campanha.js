const { checkTokenAccess } = require('./checkTokenAccess');
const { getPredicoesCampanha } = require('./predicao');
const { getMetaPessoa } = require('./metaLigacoes');
const { executaSQL } = require('./executaSQL')

function sqlEventosPaiDaCampanha(req){
  
  let sqlEventosPaiDaCampanha = `select id from eventos 
  where id_campanha = ${req.query.idCampanha} 
  and date(dt_criou) = date('${req.query.dtCriou}')
  and id_evento_pai is null`

  return sqlEventosPaiDaCampanha

}

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
          getMetaPessoa(req).then(metaPessoa => {
            if (res.rowCount > 0 && metaPessoa) {
              let campanhas = res.rows;

              client.end();
              resolve({ campanhas, metaPessoa })
            }
            else {
              client.end();
              reject('Campanha não encontrada')
            }
          }).catch(err => {
            client.end();
            reject(err)
          })
        }).catch(err => {
          client.end();
          reject(err)
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
                  if (!campanhaProspects || !campanhaTentando || !campanhaPredicoes 
                      || !campanhaResultado || !totalLigacoesCampanha  ) reject('Campanha sem retorno');

                  resolve({ campanhaProspects, campanhaTentando, campanhaPredicoes, 
                          campanhaResultado, totalLigacoesCampanha });
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
            client.end();
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

function getCampanhaTelemarketing(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.idUsuarioLogado
    };
                                            
    // let sql = `select e.id_campanha,  ROW_NUMBER() OVER (ORDER BY nome) AS sequencia,
    //           ca.nome || ' - inseridos ' || count(e.*) || ' clientes em: ' || to_char(date(e.dt_criou), 'DD/MM/YYYY')  as nome_completo, 
    //           ca.nome, date(e.dt_criou) as dt_criou, count(e.*) as tot_inseridos 
    //           from eventos e
    //           inner join campanhas ca on e.id_campanha = ca.id
    //           where e.id_evento_pai is null 
    //           and e.id_campanha is not null 
    //           and ca.id_canal = 3
    //           group by e.id_campanha, ca.nome, date(e.dt_criou)
    //           order by ca.nome, date(e.dt_criou)`

    let sql = `
                select camp.id, camp.nome, inseridos
                , COALESCE(pendentes, 0) as pendentes 
                , COALESCE(concluidos, 0) as concluidos
                , COALESCE(ligacoes_realizadas, 0) as ligacoes_realizadas 
                , ligacoes_realizadas / concluidos   as media_ligacoes_por_cliente_concluidos
                , dt_primeira_ligacao
                , dt_ultima_ligacao
                from campanhas camp
                inner join	(select id_campanha, count(*) as inseridos 
                        from eventos 
                        where id_evento_pai is null
                        and id_campanha is not null
                        group by id_campanha) inser on camp.id = inser.id_campanha				
                left join ( select id_campanha, count(*) as pendentes
                        from eventos e
                        where id_status_evento in (1, 4, 5, 6)
                        and id_campanha is not null
                        group by id_campanha) pend on camp.id = pend.id_campanha
                left join ( select e.id_campanha, count(*) as concluidos 
                            from eventos e
                        inner join (select id_campanha, id_pessoa_receptor, max(id) as id_evento
                                from eventos 
                                where id_campanha is not null
                                  group by id_campanha, id_pessoa_receptor
                              ) ult_ev on e.id = ult_ev.id_evento
                          where e.id_status_evento in (3, 7)
                          group by e.id_campanha) conc on camp.id = conc.id_campanha 
                left join ( select id_campanha, count(*) as ligacoes_realizadas
                            , min(date(dt_resolvido)) as dt_primeira_ligacao
                            , max(date(dt_resolvido)) as dt_ultima_ligacao
                        from eventos e
                        where id_status_evento in (3,7)
                        and id_campanha is not null
                        group by id_campanha) lig on camp.id = lig.id_campanha			  
                order by camp.nome		
                `

    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
          resolve(res);
        }
        else resolve({total_registros: 0});
      })
      .catch(err => {
        reject(err)
      })
  })

}

function getCampanhaTelemarketingAnalisar(req, res){
  return new Promise(function (resolve, reject) {
    checkTokenAccess(req).then(historico => {
      getClientesPendentes(req).then(clientesPendentes => {
        getLigacoesRealizadas(req).then(ligacoesRealizadas => {
          getClientesConcluidos(req).then(clientesConcluidos => {
            if (!clientesPendentes || !ligacoesRealizadas || !clientesConcluidos 
                ) reject('Campanha de telemarketing sem retorno');

            resolve({ clientesPendentes, ligacoesRealizadas, clientesConcluidos });
          }).catch(e => {
            reject(e);
          })
        }).catch(e => {
          reject(e);
        })
      }).catch(e => {
        reject(e);
      })
    }).catch(e => {
      reject(e)
    })
  })
}

function getClientesConcluidos(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.idUsuarioLogado
    };
                                            
    let sql = `select distinct id_pessoa_receptor, cliente from view_eventos 
          where id_campanha = ${req.query.idCampanha}                                      
          and  id_evento_pai is null 
          and date(dt_criou) = date('${req.query.dtCriou}') 
          and id_pessoa_receptor not in(
            select distinct  id_pessoa_receptor from view_eventos 
            where id_campanha = ${req.query.idCampanha} 
            and id_status_evento in (1, 4)                                      
            and ( (id_evento_pai is null and date(dt_criou) = date('${req.query.dtCriou}') )
                or id_evento_pai in (${sqlEventosPaiDaCampanha(req)})
                ) 
            ) order by cliente`

    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
          let clientesConcluidos = res ;
          resolve(clientesConcluidos);
        }
        else resolve({total_registros: 0});
      })
      .catch(err => {
        reject(err)
      })
  })
}


function getLigacoesRealizadas(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.idUsuarioLogado
    };
                                            
    let sql = `select * from view_eventos 
    where id_campanha = ${req.query.idCampanha} 
    and id_status_evento in (3, 7)                                      
    and ( (id_evento_pai is null and date(dt_criou) = date('${req.query.dtCriou}') )
         or id_evento_pai in (${sqlEventosPaiDaCampanha(req)})
         )
    order by cliente, dt_resolvido    `

    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
          let ligacoesRealizadas = res;
          resolve(ligacoesRealizadas);
        }
        else resolve({total_registros: 0});
      })
      .catch(err => {
        reject(err)
      })
  })
}

function getClientesPendentes(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.idUsuarioLogado
    };
                                            
    let sql = `select * from view_eventos 
    where id_campanha = ${req.query.idCampanha} 
    and id_status_evento in (1, 4)                                      
    and ( (id_evento_pai is null and date(dt_criou) = date('${req.query.dtCriou}') )
         or id_evento_pai in (${sqlEventosPaiDaCampanha(req)})
         )
    order by cliente, dt_resolvido`
    executaSQL(credenciais, sql)
      .then(res => {
        
        if (res) {
          let clientesPendentes = res;
          resolve(clientesPendentes);
        }
        else resolve({total_registros: 0});
      })
      .catch(err => {
        reject(err)
      })
  })

}


module.exports = { getCampanhasDoUsuario, getCampanhas, getCampanhaAnalisar, getCampanhaResultado, 
  getEventosRelatorioCampanha, getClientesPendentes, getCampanhaTelemarketingAnalisar, getCampanhaTelemarketing }