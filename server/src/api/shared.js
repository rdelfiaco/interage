const { executaSQL } = require('./executaSQL');


function zeroEsquerda(str, length) {
    const resto = length - String(str).length;
    return '0'.repeat(resto > 0 ? resto : '0') + str;
  }


function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 


async function buscaValorDoAtributo(credenciais, atributo, tabela, condicao ){
  return new Promise(resolve => {
  let sql = `select ${atributo} from ${tabela} where ${condicao} `
  
  resultado =  executaSQL(credenciais, sql)

  resolve( resultado )
  });

}



  module.exports = {zeroEsquerda, isNumber, buscaValorDoAtributo}