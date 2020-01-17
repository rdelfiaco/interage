const { executaSQL } = require('./executaSQL');


function zeroEsquerda(str, length) {
    const resto = length - String(str).length;
    return '0'.repeat(resto > 0 ? resto : '0') + str;
  }


function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 



async function buscaValorDoAtributo(credenciais, atributo, tabela, condicao ){
  //console.log('buscaValorDoAtributo', `select ${atributo} from ${tabela} where ${condicao}`)
  return executaSQL(credenciais, `select ${atributo} from ${tabela} where ${condicao}`)
}


async function alteraValorDoAtributo(credenciais, atributos, tabela, condicao ){
  //console.log('buscaValorDoAtributo', `select ${atributo} from ${tabela} where ${condicao}`)
  return executaSQL(credenciais, `UPDATE  ${tabela} set ${atributos} where ${condicao}`)
}


async function awaitSQL(credenciais, sql) {
      return executaSQL(credenciais, sql)
}



  module.exports = {zeroEsquerda, isNumber, buscaValorDoAtributo, awaitSQL, alteraValorDoAtributo}