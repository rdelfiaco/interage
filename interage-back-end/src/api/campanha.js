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
					reject('Usuário não encontrado')
				}
				)
				.catch(err => console.log(err)) //reject( err.hint ) )
		}).catch(e => {
			reject(e)
		})
	})
}

module.exports = { getCampanhasDoUsuario }