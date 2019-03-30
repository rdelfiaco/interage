const { executaSQL } = require('./executaSQL')
const { getUsuarios } = require('./usuario')

function getWhatsapTeste(req, res){
    return new Promise(function (resolve, reject) {

      console.log('getWhatsapTeste', req.query)

      resolve('0')

      
    })
  }
   
  module.exports = {   getWhatsapTeste}


