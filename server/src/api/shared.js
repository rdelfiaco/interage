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
      //console.log('sql ', sql )
      return await executaSQL(credenciais, sql)
}



async function geraEventoDeErro(credenciais, observacaoOrigem){
  var sql = `
  INSERT INTO public.eventos(
     id_motivo,  id_canal,  id_status_evento, id_pessoa_criou, dt_criou, dt_prevista_resolucao, dt_para_exibir, 
    tipodestino, id_pessoa_organograma, id_pessoa_receptor, id_prioridade,  observacao_origem )
    VALUES (0, 1, 1, 1, now(), date(now()) + 1, now(), 'P', 1,1,2, '${observacaoOrigem}' );`;
  await awaitSQL(credenciais, sql);
}

  module.exports = {zeroEsquerda, isNumber, buscaValorDoAtributo, awaitSQL, alteraValorDoAtributo, geraEventoDeErro}