function login(req, res ) {
    return new Promise(function (resolve, reject) {
        
                const dbconnection = require('../config/dbConnection')
                const { Client } = require('pg')

                const client = new Client( dbconnection )

                client.connect()

                
                let sql = `SELECT * from usuarios where login = '${req.params.login}'`

                client.query(sql)
                    .then( res => {
                        //console.log(res.rowCount)
                        if (res.rowCount > 0 ) {
                            
                            client.query(`insert into historico_login(id_usuario, ip, datahora)
                            VALUES ( ${res.rows[0].id} , '${req.ip}', now() ) ` );

                            resolve( res.rows[0] )
                        }
                        resolve( {id: 0 , login: 'Usuário não encontrato'} )
                    }
                        ) 
                    .catch( err => console.log(err )) //reject( err.hint ) )   
                    
                    
            })

}

module.exports = {login }