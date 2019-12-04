const { checkTokenAccess } = require('./checkTokenAccess');
// const sinesp = require('sinesp-nodejs')
const sinesp = new require('sinesp-api')


async function consultarPlaca(req, res) {

    await sinesp.configure(
        timeout= 0,
        host= 'cidadao.sinesp.gov.br',
        endpoint= '/sinesp-cidadao/mobile/consultar-placa/',
        serviceVersion= 'v5',
        androidVersion= '6.0',
        secret= '0KnlVSWHxOih3zKXBWlo',
        maximumRetry= 3,
        proxy= {
            host: '187.63.111.37' ,
            port: '3128'
            }
        )  
    let dados = await sinesp.search(req.query.placa) 

    return dados; 

}

module.exports = { consultarPlaca }