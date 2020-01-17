const moment = require ('moment');
const { getBoletosAtrasados , getAssociado } = require('./apiSGA');
const { buscaValorDoAtributo, alteraValorDoAtributo } = require( './shared');
const { getPessoaPorCPFCNPJ } = require('./pessoa');


function criaEventosDeRegras(){

    console.log( 'criaEventosDeRegras', 123)



}

async function criaEventosDeCobrancaSGA(req){

    let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };



    var periodicidade = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'periodicidadeGerarEventosCobra' `)
    periodicidade = Object.values( periodicidade[0])[0];
    var ultimaGeracaoEventoCobrancao = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'ultimaGeracaoEventoCobrancao' `)
    ultimaGeracaoEventoCobrancao = Object.values( ultimaGeracaoEventoCobrancao[0])[0];
    
    if ( moment() >= moment(ultimaGeracaoEventoCobrancao).add( periodicidade, 'hours') ){

        var dataFinal = moment().subtract(3, 'days').format('DD/MM/YYYY');

        var dataInical  = moment().subtract(30, 'days').format('DD/MM/YYYY');

        
        req.dataInical = dataInical;
        req.dataFinal = dataFinal;
        
        ultimaGeracaoEventoCobrancao = moment().format('YYYY-MM-DD HH:mm:ss');

        var result = await alteraValorDoAtributo(credenciais, 
                    `valor = '${ultimaGeracaoEventoCobrancao}'`,
                    'interage_parametros',
                    `nome_parametro = 'ultimaGeracaoEventoCobrancao' `);
  
    
        var res = '' 
 
        getBoletosAtrasados(req, res)
        .then(resBoletos => {
            resBoletos.forEach(element => {
                req.query.cpf_cnpj = element.codigo_associado;
                getAssociado( req , res)
                .then( resGetAssociado => { 
                    req.query.cpf_cnpj = resGetAssociado.cpf
                    getPessoaPorCPFCNPJ(req, res)
                    .then( resGetPessoaPorCPFCNPJ => {
                        var idPessoa = 0 ; 
                        if (Array.isArray(resGetPessoaPorCPFCNPJ)) {
                            idPessoa = resGetPessoaPorCPFCNPJ[0].id;
                        }else {
                            idPessoa = resGetPessoaPorCPFCNPJ.idPessoa;
                        }  
                        console.log('id_pessoa', idPessoa);
                    })
                    .catch(error => {});
                })
                .catch(error => {});

                var time = function ()  {
                    setTimeout(time, 100000);
                } 
                time();
            }); 
        })
        .catch(error => {} );
    }  
    return
}






module.exports = { criaEventosDeRegras ,
                    criaEventosDeCobrancaSGA }