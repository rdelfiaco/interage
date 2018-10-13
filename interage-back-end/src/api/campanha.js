const { checkTokenAccess } = require('./checkTokenAccess');

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
				.catch(err => console.log(err)) //reject( err.hint ) )
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

			let sql = `SELECT * FROM campanhas order by nome`

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
				.catch(err => console.log(err)) //reject( err.hint ) )
		}).catch(e => {
			reject(e)
		})
	})
}

function getCampanhaAnalisar(req, res) {
	return new Promise(function (resolve, reject) {
  
	  checkTokenAccess(req).then(historico => {
		  console.log('oll')
		getCampanhaProspects(req).then(campanhaProspects => {
			getCampanhaTentando(req).then(campanhaTentando => {
			
				if (!campanhaProspects || !campanhaTentando ) reject('Campanha sem retorno');
  
				resolve({ campanhaProspects, campanhaTentando });

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
			console.log(sql)

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
				.catch(err => console.log(err)) //reject( err.hint ) )
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
			
			let sql = `select tentativas, sum(tentativas) as qtde
						from (
						select id_pessoa_receptor, count(*) as tentativas 
						from eventos  where  id_status_evento not in (1,4)
							and id in ( select id from eventos where id_campanha = ${req.query.id_campanha}  
								and id_evento_pai is null and dt_criou between ${req.query.dtInicial}' and '${req.query.dtFinal}' )
						group by id_pessoa_receptor
						union
						select id_pessoa_receptor, 0 as tentativas 
						from eventos  where id_evento_pai is null and id_status_evento in (1,4)
							and id in ( select id from eventos where id_campanha = ${req.query.id_campanha} 
								 and id_evento_pai is null and dt_criou between ${req.query.dtInicial}' and '${req.query.dtFinal}' )
						group by id_pessoa_receptor	
						) a
						group by tentativas 
						
						order by tentativas`

		    console.log(sql)

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
				.catch(err => console.log(err)) //reject( err.hint ) )
		}).catch(e => {
			reject(e)
		})
	})
}

module.exports = { getCampanhasDoUsuario, getCampanhas, getCampanhaAnalisar }