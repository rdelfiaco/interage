const fetch = require('node-fetch');
const {  executaSQLSemToken } = require( './executaSQL');

 
    function getAssociado(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;
            var url = 'https://api.hinova.com.br/api/sga/v2/associado/buscar/' + req.query.cpf_cnpj;
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            //console.log('headers ', headers)

            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                //console.log('getAssociado ', res )
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }
    
    async function buscaPlaca(dadosPlaca) {
    
    var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
    authorization = `Bearer ${authorization[0].valor}`;
    var url = 'https://api.hinova.com.br/api/sga/v2/veiculo/buscar/' + dadosPlaca;
    var headers = {
    "Content-Type": "application/json",
    "Authorization": authorization
    };
    
    var parametros = { method: 'GET',
    headers: headers, 
    cache: 'default' 
    };
    
    fetch(url, parametros)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(error => console.log(error));
    }
    
    function getBoletos(req, res) {
    return new Promise(async function (resolve, reject) {

        var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
        authorization = `Bearer ${authorization[0].valor}`;


        if (req.query.dataInicial){ req.dataInicial =req.query.dataInicial };
        if (req.query.dataFinal){ req.dataFinal =req.query.dataFinal };
        if (req.query.codigo_situacao){ req.codigo_situacao =req.query.codigo_situacao };


        var dataInicial = req.dataInicial;
        var dataFinal = req.dataFinal;
        var codigo_situacao = req.codigo_situacao;

        var url = 'https://api.hinova.com.br/api/sga/v2/listar/boleto';
        var headers = {
        "Content-Type": "application/json",
        "Authorization": authorization
        };

        // var data = {
        // "codigo_situacao": "2",
        // "data_vencimento_inicial": "01/01/2018",
        // "data_vencimento_final": "31/12/2019"
        // };

        var data = {
                "codigo_situacao": codigo_situacao,
                "data_vencimento_inicial": dataInicial,
                "data_vencimento_final": dataFinal
        }
        
        var parametros = { method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
        };
        //console.log('Boletos parametros ', parametros )
        fetch(url, parametros)
        .then(res => 
            resolve (res.json()))
        .catch(error => reject( error) );
    })
    };

    function getBoletosBixados(req, res) {

        return new Promise( async function (resolve, reject) {
    
            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;

            var codigo_boleto = req.codigo_boleto;
    
            var url = 'https://api.hinova.com.br/api/sga/v2/listar/boleto';
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };

            var data = {
                "codigo_situacao": "1",
                "codigo_boleto": codigo_boleto, 
            //    "data_emissao_inicial": "01/12/2019",
            //    "data_emissao_final": "31/12/2019"
            }
            
            
            var parametros = { method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
            };
            fetch(url, parametros)
            .then(res => 
                resolve (res.json()))
            .catch(error => reject( error) );
        })
        };

    async function getIdPessoaAssociado(boletoAtrasado ){
        return new Promise( async function (resolve, reject) {
            var req = { query: {cpf_cnpj: boletoAtrasado.codigo_associado}};
            var res = '';

            getAssociado( req , res)
            .then( resGetAssociado => {
                console.log('resAssociado ', resGetAssociado);
                console.log('boletoAtrasado ', boletoAtrasado )
                req.query.resGetAssociado = resGetAssociado;
                

                resolve (resGetAssociado);

            })
            .catch(error => reject( error) );
        });
    } 
 

    function getVoluntariosAtivos(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;
            var url = 'https://api.hinova.com.br/api/sga/v2/listar/voluntario/ativo';
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }

    function getSituacaoAdesaoVoluntario(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;

            var url = `https://api.hinova.com.br/api/sga/v2/listar/situacao-adesao-voluntario/${req.query.codigo_voluntario}`;
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }

    function getSituacaoFinaceiroVeiculo(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;

            var url = `https://api.hinova.com.br/api/sga/v2/buscar/situacao-financeira-veiculo/${req.query.codigo_veiculo}`;
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }


    function getContratos(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;

            var url = 'https://api.hinova.com.br/api/sga/v2/sincronismo-produto-fornecedor/listar/';
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }   

    function getVeiculo(req, res) {
        return new Promise( async function (resolve, reject) {

            var authorization = await executaSQLSemToken(`select valor from interage_parametros where nome_parametro = 'tokenSGA' `);
            authorization = `Bearer ${authorization[0].valor}`;

            var url = `https://api.hinova.com.br/api/sga/v2/veiculo/buscar/${req.query.placa}`;
            var headers = {
            "Content-Type": "application/json",
            "Authorization": authorization
            };
            
            var parametros = { method: 'GET',
            headers: headers, 
            cache: 'default' 
            };
            fetch(url, parametros)
            .then(res => {
                resolve (res.json())})
            .catch(error => reject( error) );
        })

    }

    module.exports = { 
        getAssociado,
        getBoletos,
        getIdPessoaAssociado,
        getBoletosBixados,
        getVoluntariosAtivos,
        getSituacaoAdesaoVoluntario,
        getSituacaoFinaceiroVeiculo,
        getContratos,
        getVeiculo,

    }