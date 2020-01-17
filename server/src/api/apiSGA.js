const fetch = require('node-fetch');

function getAssociado(req, res) {
    return new Promise(function (resolve, reject) {

        var url = 'https://api.hinova.com.br/api/sga/v2/associado/buscar/' + req.query.cpf_cnpj;
        var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer b24fe65e91c0b6869510a566c7b125d6945645121fab4e43f3256a921b1e7566d41cb4d3903dce2e4060634d48ea96441c35acb6849fe19018eb364d298ce5cebfdb4d2b146ff404138079785544e080a11a88780f0430c501b7ce21ae85ecd8e200d76fd4714d742ff51a82b9b7ee62"
        };
        
        var parametros = { method: 'GET',
        headers: headers, 
        cache: 'default' 
        };
        
        fetch(url, parametros)
        .then(res => 
            resolve (res.json()))
        .catch(error => reject( error) );
    })

}
    
    function buscaPlaca(dadosPlaca) {
    
    var url = 'https://api.hinova.com.br/api/sga/v2/veiculo/buscar/' + dadosPlaca;
    var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer b24fe65e91c0b6869510a566c7b125d6945645121fab4e43f3256a921b1e7566d41cb4d3903dce2e4060634d48ea96441c35acb6849fe19018eb364d298ce5cebfdb4d2b146ff404138079785544e080a11a88780f0430c501b7ce21ae85ecd8e200d76fd4714d742ff51a82b9b7ee62"
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
    
    function getBoletosAtrasados(req, res) {
    return new Promise(function (resolve, reject) {

        var dataInical = req.dataInical;
        var dataFinal = req.dataFinal;

        var url = 'https://api.hinova.com.br/api/sga/v2/listar/boleto';
        var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer b24fe65e91c0b6869510a566c7b125d6945645121fab4e43f3256a921b1e7566d41cb4d3903dce2e4060634d48ea96441c35acb6849fe19018eb364d298ce5cebfdb4d2b146ff404138079785544e080a11a88780f0430c501b7ce21ae85ecd8e200d76fd4714d742ff51a82b9b7ee62"
        };

        // var data = {
        // "codigo_situacao": "2",
        // "data_vencimento_inicial": "01/01/2018",
        // "data_vencimento_final": "31/12/2019"
        // };

        var data = {
                "codigo_situacao": "2",
                "data_vencimento_inicial": dataInical,
                "data_vencimento_final": dataFinal
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
        return new Promise(function (resolve, reject) {
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
 
    module.exports = { 
        getAssociado,
        getBoletosAtrasados,
        getIdPessoaAssociado

    }