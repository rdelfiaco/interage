const { checkTokenAccess } = require('./checkTokenAccess');

function getPessoa(req, res) {
	return new Promise(function (resolve, reject) {

		checkTokenAccess(req).then(historico => {
			const dbconnection = require('../config/dbConnection')
			const { Client } = require('pg')

			const client = new Client(dbconnection)

			console.log('req.query.id_pessoa', req.query.id_pessoa)
			client.connect()
			let sql = `SELECT * FROM pessoas
                  WHERE id=${req.query.id_pessoa}`

			client.query(sql)
				.then(res => {
					if (res.rowCount > 0) {
						let pessoa = res.rows;
						getEnderecos().then(enderecos => {
							getTelefones().then(telefones => {
								client.end();
								resolve({ principal: pessoa[0], enderecos, telefones })
							}).catch(e => {
								reject(e);
							})
						}).catch(e => {
							reject(e);
						})

					}
					else reject('Não há eventos!')
				}).catch(err => console.log(err)) //reject( err.hint ) )


			function getEnderecos() {
				return new Promise((resolve, reject) => {
					let sqlEnderecos = `SELECT * FROM pessoas_enderecos
															WHERE id_pessoa=${req.query.id_pessoa}`

					client.query(sqlEnderecos).then(res => {
						resolve(res.rows);
					})
				})
			}

			function getTelefones() {
				return new Promise((resolve, reject) => {
					let sqlTelefones = `SELECT * FROM pessoas_telefones
															WHERE id_pessoa=${req.query.id_pessoa}`

					client.query(sqlTelefones).then(res => {
						resolve(res.rows);
					})
				})
			}
		}).catch(e => {
			reject(e)
		})
	})
}

module.exports = { getPessoa }