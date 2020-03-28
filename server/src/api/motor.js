const moment = require ('moment');
const { getBoletos , getAssociado,
        getBoletosBixados, getVoluntariosAtivos, 
        getSituacaoAdesaoVoluntario, getSituacaoFinaceiroVeiculo, 
        getContratos } = require('./apiSGA');
const { buscaValorDoAtributo, alteraValorDoAtributo } = require( './shared');
const { getPessoaPorCPFCNPJ } = require('./pessoa');
const { criarEvento } =  require( './evento')
const { awaitSQL, geraEventoDeErro } = require('./shared')


function criaEventosDeRegras(){
    console.log( 'criaEventosDeRegras', 123)
}

// encerra os eventos de cobrança liquidados 
async function encerraEventosDeCobrancaSGA(req){

    console.log('Encerrando eventos de cobrança ...')
    let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };

    var destinatarioEventosCobranca = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'destinatarioEventosCobranca' `)
    destinatarioEventosCobranca = Object.values( destinatarioEventosCobranca[0])[0];
    

    var eventosCobranca = await buscaValorDoAtributo(credenciais, '*','eventos_boletos', ' 1 = 1' );
    var res = ''
    for ( const element of eventosCobranca ) {
        var liquidados = true;
        var dataBaixa = '';
        var boleto;

        for (const boletos of element.codigo_boleto) {
            boleto = {};
            req.codigo_boleto = boletos
            await getBoletosBixados(req, res)
            .then( res => { 
                boleto = res[0];
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
            var sql = ` update eventos set id_status_evento =  3, boleto_pago = true,
             dt_visualizou = case when dt_visualizou is null then  now() else dt_visualizou end, 
            id_pessoa_visualizou = case when id_pessoa_visualizou is null then  1 else id_pessoa_visualizou end, 
			dt_resolvido = case when dt_resolvido is null then now() else dt_resolvido end, 
			id_pessoa_resolveu = case when id_pessoa_resolveu is null then 1 else id_pessoa_resolveu end, 
			id_resp_motivo = case  when id_resp_motivo is null then 59 else  id_resp_motivo  end ,
            observacao_retorno =  observacao_retorno || 'Evento concluido automaticamente por constatar que o boleto foi pago em ${ moment(dataBaixa).format('DD/MM/YYYY')}'
            where   id = ${element.id_evento}`
            awaitSQL(credenciais, sql);

            var sql = `delete from eventos_boletos where id_evento = ${element.id_evento}`
            awaitSQL(credenciais, sql);

            // busca o id_pessoa_receptor;
            var idPessoa = await buscaValorDoAtributo(credenciais, 'id_pessoa_receptor','eventos',`id = ${element.id_evento} `)
            idPessoa = Object.values( idPessoa[0])[0];

            var dt_pagamento = moment(boleto.data_pagamento).format('YYYY-MM-DD');
            var dt_vencimento = moment(boleto.data_vencimento_original).format('YYYY-MM-DD');
             
            var dias = moment(dt_pagamento).diff(dt_vencimento, 'days')
            if (dias >= 8 ){
                req.query.id_evento_pai = element.id_evento;
                req.query.id_motivo = 29;
                req.query.tipoDestino = 'P';
                req.query.id_pessoa_organograma = destinatarioEventosCobranca;
                req.query.id_pessoa_receptor = idPessoa ;
                req.query.observacao_origem = 'Agendar uma re-vistoria ou soliciar para o cliente realizar a re-vistoria'; 
                req.query.id_canal = 3;
                req.query.dt_para_exibir = moment().format('YYYY-MM-DD HH:mm:ss');

                // verifica se não tem evento de combrança em aberto 
                var idEventoReVistoria = await buscaValorDoAtributo(credenciais, 'id','eventos',` id_motivo = 29 and id_status_evento in (1,4,5,6) and id_pessoa_receptor = ${idPessoa} `)
                    idEventoReVistoria = Object.values( idEventoReVistoria[0])[0];
                if (!idEventoReVistoria) {
                    await criarEvento(req, res) 
                    .then( async resEvento => { 
                    })
                    .catch( e => {})
                }
            } 
        }
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

        console.log('Criando eventos de cobrança ...')

        var dataFinal = moment().subtract(3, 'days').format('DD/MM/YYYY');

        var dataInicial  = moment().subtract(30, 'days').format('DD/MM/YYYY');

        req.dataInicial = dataInicial;
        req.dataFinal = dataFinal;
        req.codigo_situacao = "2" // abertos;
        
        ultimaGeracaoEventoCobranca = moment().format('YYYY-MM-DD HH:mm:ss');


    
        var res = '';
        var boletosAtrasados = [];
        await getBoletos(req, res)
        .then( resBoletos => {
            boletosAtrasados = resBoletos;
        })
        .catch(error => {});

        // retira os duplicados 
        uniqueArray = [];
        boletosAtrasadosUnique = [];
        codigosBoletosAtrasados = [];
        for (var i = 0; i < boletosAtrasados.length; i++ ){
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
       boletosNaoGerados = []; 
       for ( const element of boletosAtrasadosUnique ) {
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
                        req.query.id_evento_pai = null
                        req.query.id_campanha = 19;
                        req.query.id_motivo = 13;
                        req.query.tipoDestino = 'P';
                        req.query.id_pessoa_organograma = destinatarioEventosCobranca;
                        req.query.id_pessoa_receptor = idPessoa ;
                        req.query.observacao_origem = element.observacao_origem; 
                        req.query.id_canal = 3;
                        req.query.dt_para_exibir = moment().format('YYYY-MM-DD HH:mm:ss');
                        req.query.codigo_veiculo = null;
                        req.query.placa = null;
                        // verifica se não tem evento de combrança em aberto 
                        // var idEventoCobraca = await buscaValorDoAtributo(credenciais, 'id','eventos',` id_motivo = 13 and id_status_evento in (1,4,5,6) and id_pessoa_receptor = ${idPessoa} `)
                        //     idEventoCobraca = Object.values( idEventoCobraca[0])[0];
                        // verifica se não tem já foi gerado evento de combrança para os boletos do associado
                        var boletosDoEvento = boletosAtrasados.filter(  (boletos)  => {
                            return boletos.codigo_associado == element.codigo_associado
                        }).map( mapBoletos =>{  
                            return  mapBoletos.codigo_boleto
                        });
                        var idEventoCobraca = await buscaValorDoAtributo(credenciais, 'id_evento','eventos_boletos',`  ${boletosDoEvento[0]}  = any(  codigo_boleto ) `)
                            idEventoCobraca = Object.values( idEventoCobraca[0])[0];
                        if (!idEventoCobraca) {
                            //console.log('antes de criar evento de cobrança ', req.query)
                            await criarEvento(req, res) 
                            .then( async resEvento => {
                            //salva os boletos do evento 
                            
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
        // console.log('Total de boletos: ', boletosAtrasadosUnique.length );
        // console.log('total de Boletos gerados: ', totalBoletos);
        // console.log('Total de boletos não gerados: ', boletosNaoGerados.length);
        // console.log('Total de eventos já existentes: ', eventosCobrancaJaExistente );

        var result = await alteraValorDoAtributo(credenciais, 
            `valor = '${ultimaGeracaoEventoCobranca}'`,
            'interage_parametros',
            `nome_parametro = 'ultimaGeracaoEventoCobranca' `);

            
    }; 



    return    
}


async function criaEventosDePosVendaSGA(req){

    console.log('Criando eventos de Pós venda ...')

    let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
   
    var periodicidade = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'ultimaGeracaoEventosPosVenda' `)
    periodicidade = Object.values( periodicidade[0])[0];
    var ultimaGeracaoEventosPosVenda = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'ultimaGeracaoEventosPosVenda' `)
    ultimaGeracaoEventosPosVenda = Object.values( ultimaGeracaoEventosPosVenda[0])[0];
    var destinatarioEventosPosVenda = await buscaValorDoAtributo(credenciais, 'valor','interage_parametros',`nome_parametro = 'destinatarioEventosPosVenda' `)
    destinatarioEventosPosVenda = Object.values( destinatarioEventosPosVenda[0])[0];
    
    if ( moment() >= moment(ultimaGeracaoEventosPosVenda).add( periodicidade, 'hours') ){

        var dataFinal = moment().subtract(3, 'days').format('DD/MM/YYYY');

        var dataInical  = moment().subtract(30, 'days').format('DD/MM/YYYY');

        req.dataInical = dataInical;
        req.dataFinal = dataFinal;
        
        ultimaGeracaoEventosPosVenda = moment().format('YYYY-MM-DD HH:mm:ss');

        var res 
        await getContratos(req, res)
        .then( async resContratos => {
           // console.log('resContratos.quantidade_veiculos ', resContratos.quantidade_veiculos )
            for (var i = 0; i < resContratos.quantidade_veiculos; i++ ) {
                //console.log('i ', i )
                if ( resContratos[i].data_contrato_associado > moment().subtract(7, 'days').format('YYYY-MM-DD') ){
                    //console.log('resContratos[i] dentro do if ', resContratos[i] )
                    req.query.cpf_cnpj = resContratos[i].cpf;
                    await getPessoaPorCPFCNPJ(req, res)
                    .then( async resGetPessoaPorCPFCNPJ => {
                        if (Array.isArray(resGetPessoaPorCPFCNPJ)) {
                            idPessoa = resGetPessoaPorCPFCNPJ[0].id;
                        }else {
                            idPessoa = resGetPessoaPorCPFCNPJ.idPessoa;
                        }   
                    //acrescenta paramentos para criar evento
                    req.query.id_evento_pai =  null;
                    req.query.id_campanha = 20;
                    req.query.id_motivo = 28;
                    req.query.tipoDestino = 'P';
                    req.query.id_pessoa_organograma = destinatarioEventosPosVenda;
                    req.query.id_pessoa_receptor = idPessoa ;
                    req.query.observacao_origem = `Confirmar dados do cliente e se ele recebeu o boleto de adesão `;  
                    req.query.id_canal = 3;
                    req.query.dt_para_exibir = moment().format('YYYY-MM-DD HH:mm:ss');
                    req.query.codigo_veiculo = resContratos[i].codigo_veiculo;
                    req.query.placa = resContratos[i].placa;
                    // verifica se não tem evento de pós venda em aberto 
                    //console.log(req.query)
                    var idEventoPosVenda = await buscaValorDoAtributo(credenciais, 'id','eventos'
                     ,` id_motivo = 28 and id_status_evento in (1,4,5,6) and id_pessoa_receptor = ${idPessoa} and codigo_veiculo = '${resContratos[i].codigo_veiculo}' `)
                    idEventoPosVenda = Object.values( idEventoPosVenda[0])[0];
                    if (!idEventoPosVenda) {
                        await criarEvento(req, res) 
                        .then( async resEvento => {
                        }) 
                        .catch(error => {  });
                    };
                    }) 
                    .catch(error => {  });
                }
            }
        })
        .catch(error => {  });

        var result = await alteraValorDoAtributo(credenciais, 
            `valor = '${ultimaGeracaoEventosPosVenda}'`,
            'interage_parametros',
            `nome_parametro = 'ultimaGeracaoEventosPosVenda' `);

            
    }; 

    return    
}




module.exports = { criaEventosDeRegras ,
                    criaEventosDeCobrancaSGA,
                    encerraEventosDeCobrancaSGA,
                    criaEventosDePosVendaSGA,
                 }