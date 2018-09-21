function login(req, res ) {
    return new Promise(function (resolve, reject) {
        
                const dbconnection = require('../config/dbConnection')
                const { Client } = require('pg')

                const client = new Client( dbconnection )

                client.connect()

                let sql = `SELECT * from usuaris where login = '${req}'`

                client.query(sql)
                    .then( res => resolve( res.rows[0] ) ) 
                    .catch( err => console.log(err )) //reject( err.hint ) )   
                    
                    
            })

}

module.exports = {login }