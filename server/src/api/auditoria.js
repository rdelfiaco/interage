const { executaSQL } = require('./executaSQL');

function  auditoria(credenciais, tabela, operacao, idTabela, dadosAnteriores, dadosAtuais )
{
    sql = `INSERT INTO public.auditoria(
         id_usuario, data_hora, operacao, tabela_nome, tabela_id)
        VALUES (${credenciais.idUsuario}
            , now()
            , '${operacao}' 
            , '${tabela}'
            , ${idTabela}) RETURNING id;`
    executaSQL(credenciais, sql).then(res => {
        let id_auditoria = res[0].id;
        for (var [key, value] of Object.entries(dadosAtuais)) {
            if (dadosAnteriores[key] != value){
                sql = `INSERT INTO public.auditoria_detalhe(
                    id_auditoria, campo, conteudo_anterior, conteudo_novo)
                    VALUES ( ${id_auditoria}
                        , '${key}'
                        , '${dadosAnteriores[key]}'
                        , '${ operacao == 'I' & key == 'id' ? idTabela: value}');`
                executaSQL(credenciais, sql).then(res1 => {
                }).catch(e => {client.end(); reject(e)})
            }
        }
    }).catch(e => { client.end(); reject(e)})
};

module.exports = { auditoria};