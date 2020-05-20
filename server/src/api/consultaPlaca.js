const { checkTokenAccess } = require('./checkTokenAccess');
// const sinesp = require('sinesp-nodejs')
//const sinesp = new require('sinesp-api')
//var request = require('request');

async function consultarPlaca(req, res) {

    // await sinesp.configure(
    //     timeout= 0,
    //     host= 'cidadao.sinesp.gov.br',
    //     endpoint= '/sinesp-cidadao/mobile/consultar-placa/',
    //     serviceVersion= 'v5',
    //     androidVersion= '6.0',
    //     secret= '0KnlVSWHxOih3zKXBWlo',
    //     maximumRetry= 3,
    //     proxy= {
    //         host: '187.63.111.37' ,
    //         port: '3128'
    //         }
    //     )  
    // let dadosPlaca = await sinesp.search(req.query.placa) 

    let dadosPlaca = ''

     buscaTabelaFipe(dadosPlaca)


    return dadosPlaca; 

}

function buscaTabelaFipe(dadosPlaca){
// Documentação fica em:  http://fipeapi.appspot.com/
//http://fipeapi.appspot.com/api/1/[tipo]/[acao]/[parametros].json


let marca = dadosPlaca.marca
marca = marca.substring(0, marca.indexOf('/'))
let modelo =  dadosPlaca.modelo
modelo = modelo.substring(modelo.indexOf('/')+1 )
modelo = modelo.substring(0, modelo.indexOf(' '))


//  request('http://fipeapi.appspot.com/api/1/carros/marcas.json', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     //console.log(body) // Aqui podes ver o HTML da página pedida. 
//     let marcas = body 
//     marcas = JSON.parse(marcas)
//     let idMarca = -1
//     let id = 0;
//     marcas.forEach((element, index) => {
//       if ( element.name == marca ) {
//           idMarca = element.id;
//           id = index; 
//       }
//     });
//     console.log('marcas ', marcas[id].name, marca, ' idMarca ', idMarca)

//     request(`http://fipeapi.appspot.com/api/1/carros/veiculos/${idMarca}.json`, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         //console.log(body) // Aqui podes ver o HTML da página pedida. 
//         let modelos = body 
//         modelos = JSON.parse(modelos)
//         let idMarca = -1
//         let id = 0;
//         let modelos_ = modelos.filter((element ) =>{
//           if (element.name.localeCompare( modelo) == 1  ){
//               return true;
//           }
//         } )    

//         console.log('modelo ', modelo, 'modelos ', modelos_)
    
    
//       }
//     });




//  }
//});











}

module.exports = { consultarPlaca }