const moment = require ('moment');
const { getBoletosAtrasados , getAssociado, getBoletosBixados } = require('./apiSGA');
const { buscaValorDoAtributo, alteraValorDoAtributo } = require( './shared');
const { getPessoaPorCPFCNPJ } = require('./pessoa');
const { criarEvento } =  require( './evento')
const { awaitSQL, geraEventoDeErro } = require('./shared')


function criaEventosDeRegras(){
    console.log( 'criaEventosDeRegras', 123)
}

// encerra os eventos de cobrança liquidados 
async function encerraEventosDeCobrancaSGA(req){

    let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };

    
    var eventosCobranca = await buscaValorDoAtributo(credenciais, '*','eventos_boletos', ' 1 = 1' );
    var res = ''
    for ( const element of eventosCobranca ) {
        var liquidados = true;
        var dataBaixa = '';
        //86923    86831 86928 86929 
        //if (element.id_evento == 86835){

        for (const boletos of element.codigo_boleto) {
            req.codigo_boleto = boletos
            
            await getBoletosBixados(req, res)
            .then( res => { 
                //console.log(res)
                if (!res.error){
                     dataBaixa = res[0].data_pagamento;
                }else {
                    liquidados = false;
                }

            })
            .catch( error => {
                liquidados = false;
            })

        }

        if (liquidados && dataBaixa != ''){
            //encerra evento de cobrança 
            var sql = `update eventos set id_status_evento= 3,  dt_visualizou= now(), 
            id_pessoa_visualizou=1, dt_resolvido=now(), id_pessoa_resolveu=1, 
            observacao_retorno='Evento concluido automaticamento por constatar que o boleto foi pago em ${ moment(dataBaixa).format('DD/MM/YYYY')}'
            where id = ${element.id_evento}`
            awaitSQL(credenciais, sql);

            var sql = `delete from eventos_boletos where id_evento = ${element.id_evento}`
            awaitSQL(credenciais, sql);

        }
         
        //}

    }; 

    return ; 
}


async function criaEventosDeCobrancaSGA(req){

    let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };

    var periodicidade = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'periodicidadeGerarEventosCobra' `)
    periodicidade = Object.values( periodicidade[0])[0];
    var ultimaGeracaoEventoCobranca = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'ultimaGeracaoEventoCobranca' `)
    ultimaGeracaoEventoCobranca = Object.values( ultimaGeracaoEventoCobranca[0])[0];
    var destinatarioEventosCobranca = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'destinatarioEventosCobranca' `)
    destinatarioEventosCobranca = Object.values( destinatarioEventosCobranca[0])[0];
    
    if ( moment() >= moment(ultimaGeracaoEventoCobranca).add( periodicidade, 'hours') ){

        var dataFinal = moment().subtract(3, 'days').format('DD/MM/YYYY');

        var dataInical  = moment().subtract(30, 'days').format('DD/MM/YYYY');

        req.dataInical = dataInical;
        req.dataFinal = dataFinal;
        
        ultimaGeracaoEventoCobranca = moment().format('YYYY-MM-DD HH:mm:ss');


    
        var res = '';
        var boletosAtrasados = [];
        await getBoletosAtrasados(req, res)
        .then( resBoletos => {
            boletosAtrasados = resBoletos;
        })
        .catch(error => {});

        // retira os duplicados 
        uniqueArray = [];
        boletosAtrasadosUnique = [];
        codigosBoletosAtrasados = [];
        for (i = 0; i < boletosAtrasados.length; i++ ){
            if ( uniqueArray.indexOf(boletosAtrasados[i].codigo_associado) == -1 ) {
                uniqueArray.push(boletosAtrasados[i].codigo_associado);
                boletosAtrasados[i].observacao_origem = `Boleto com o vencimento ${moment(boletosAtrasados[i].data_vencimento_original).format('DD/MM/YYYY')} e o valor: ${boletosAtrasados[i].valor_boleto} `;
                boletosAtrasadosUnique.push(boletosAtrasados[i])
            }else {
                boletosAtrasadosUnique[uniqueArray.indexOf(boletosAtrasados[i].codigo_associado)].observacao_origem = 
                boletosAtrasadosUnique[uniqueArray.indexOf(boletosAtrasados[i].codigo_associado)].observacao_origem + ' -- ' +
                `Boleto com o vencimento ${moment(boletosAtrasados[i].data_vencimento_original).format('DD/MM/YYYY')} e o valor: ${boletosAtrasados[i].valor_boleto} `;
            }
        }
        boletosAtrasadosUnique
        var totalBoletos = 0;
        var eventosCobrancaJaExistente = 0; 
        i=0;
       boletosNaoGerados = []; 
       for ( const element of boletosAtrasadosUnique ) {
           i++;
            req.query.cpf_cnpj = element.codigo_associado;
            await getAssociado( req , res)
            .then(  async resGetAssociado => { 
                req.query.cpf_cnpj = resGetAssociado.cpf
                 await getPessoaPorCPFCNPJ(req, res)
                    .then( async resGetPessoaPorCPFCNPJ => {
                        if (Array.isArray(resGetPessoaPorCPFCNPJ)) {
                            idPessoa = resGetPessoaPorCPFCNPJ[0].id;
                        }else {
                            idPessoa = resGetPessoaPorCPFCNPJ.idPessoa;
                        }  
                        // acrescenta paramentos para criar evento
                        req.query.id_campanha = 19;
                        req.query.id_motivo = 13;
                        req.query.tipoDestino = 'P';
                        req.query.id_pessoa_organograma = destinatarioEventosCobranca;
                        req.query.id_pessoa_receptor = idPessoa ;
                        req.query.observacao_origem = element.observacao_origem; 
                        req.query.id_canal = 3;
                        req.query.dt_para_exibir = moment().format('YYYY-MM-DD HH:mm:ss');

                        // verifica se não tem evento de combrança em aberto 
                        var idEventoCobraca = await buscaValorDoAtributo(credenciais, 'id','eventos',` id_motivo = 13 and id_status_evento in (1,4,5,6) and id_pessoa_receptor = ${idPessoa} `)
                            idEventoCobraca = Object.values( idEventoCobraca[0])[0];
                        if (!idEventoCobraca) {
                            await criarEvento(req, res) 
                            .then( async resEvento => {
                            //salva os boletos do evento 
                            var boletosDoEvento = boletosAtrasados.filter(  (boletos)  => {
                                return boletos.codigo_associado == element.codigo_associado
                            }).map( mapBoletos =>{  
                                return  mapBoletos.codigo_boleto
                            });
                                var sql =  `INSERT INTO public.eventos_boletos(
                                    id_evento, codigo_boleto)
                                    VALUES (${resEvento.rows[0].id}, ARRAY[${boletosDoEvento}]);`
                                await awaitSQL(credenciais, sql)
                                .then( totalBoletos++) 
                                .catch( error => { boletosNaoGerados.push({codigoAssociado: element.codigo_associado,
                                                                cpf: element.cpf });
                                                geraEventoDeErro(credenciais, 'Erro inserir em eventos_boletos : ' +  JSON.stringify(element ));
                                                            })
                                }) 
                            .catch(error => { 
                                boletosNaoGerados.push({codigoAssociado: element.codigo_associado,
                                    cpf: element.cpf });
                                geraEventoDeErro(credenciais, 'Erro criarEvento : ' +  JSON.stringify(element ));

                            });
                        }else {
                            eventosCobrancaJaExistente++;
                        }

                    })
                    .catch(error => {
                        boletosNaoGerados.push({codigoAssociado: element.codigo_associado,
                            cpf: element.cpf });
                        geraEventoDeErro(credenciais, 'Erro getPessoaPorCPFCNPJ : ' +  JSON.stringify(element ));
                    });

            })
            .catch(error => { boletosNaoGerados.push({codigoAssociado: element.codigo_associado,
                cpf: element.cpf });
                geraEventoDeErro(credenciais, 'Erro getAssociado : ' +  JSON.stringify(element ));
                                 });           
        };
        console.log('Total de boletos: ', boletosAtrasadosUnique.length );
        console.log('total de Boletos gerados: ', totalBoletos);
        console.log('Total de boletos não gerados: ', boletosNaoGerados.length);
        console.log('Total de eventos já existentes: ', eventosCobrancaJaExistente );
    }; 

    var result = await alteraValorDoAtributo(credenciais, 
        `valor = '${ultimaGeracaoEventoCobranca}'`,
        'interage_parametros',
        `nome_parametro = 'ultimaGeracaoEventoCobranca' `);

    return    
}






module.exports = { criaEventosDeRegras ,
                    criaEventosDeCobrancaSGA,
                    encerraEventosDeCobrancaSGA,
                 }