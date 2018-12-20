const { executaSQL } = require('./executaSQL')

function salvarProposta(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    req.query.proposta = JSON.parse(req.query.proposta);

    req.query.proposta.placa = req.query.proposta.placa ? req.query.proposta.placa : ''
   
    let sql = `INSERT INTO propostas(
                    id_tipo_veiculo, codigofipe, marca, modelo, ano_modelo, data_consulta 
                    , preco_medio, adesao, mensalidade , participacao, cota, id_fundo_terceiros
                    , id_carro_reserva, id_app, id_rastreador, id_protecao_vidros, proposta_json
                    , id_usuario, id_pessoa_cliente, placa 
                    , id_status_proposta,  dtsalvou)
                VALUES (  ${req.query.proposta.idTipoVeiculo},
                          '${req.query.proposta.codigoFipe}',
                          '${req.query.proposta.marca}',
                          '${req.query.proposta.modelo}',
                          '${req.query.proposta.anoModelo}',
                          '${req.query.proposta.dataConsulta}',
                          '${req.query.proposta.precoMedio}',
                          '${req.query.proposta.adesão}',
                          '${req.query.proposta.mensalidade}',
                          '${req.query.proposta.participacao}',
                          ${req.query.proposta.cota},
                          ${req.query.proposta.idFundoTerceiros},
                          ${req.query.proposta.idCarroReserva},
                          ${req.query.proposta.idApp},
                          ${req.query.proposta.idRastreador},
                          ${req.query.proposta.idProtecaoVidros},
                          '${req.query.propostaJSON}',    
                          ${req.query.proposta.idUsuario},
                          ${req.query.proposta.idPessoaCliente},
                          '${req.query.proposta.placa}',
                          5,now()) RETURNING id`

                         

    executaSQL(credenciais, sql).then(registros => {
      
      //criar evento para acompanhar poposta 
      let id_proposta = registros[0].id
     
      sql = `INSERT INTO public.eventos(
              id_motivo,  
              id_status_evento, 
              id_pessoa_criou, 
              dt_criou, 
              dt_prevista_resolucao, 
              dt_para_exibir, 
              tipodestino, 
              id_pessoa_organograma, 
              id_pessoa_receptor, 
              id_prioridade,
              observacao_origem,  
              id_canal,
              id_proposta)
              VALUES (2,
                      1, 
                      ${req.query.proposta.idPessoaUsuario},
                      now(),
                      func_dt_expira(2),
                      now(),
                      'P',
                      ${req.query.proposta.idPessoaUsuario},
                      ${req.query.proposta.idPessoaCliente},
                      2,
                      'Registar se o cliente aceitou ou não proposta',
                      7,
                      ${id_proposta})`
        console.log(sql)
        executaSQL(credenciais, sql).then(registros => {
          resolve(id_proposta)
        }).catch(e => {
          reject(e);});
    }).catch(e => {
      reject(e);});
  })
};

function getPropostasDoUsuario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select * from view_proposta where id_usuario=${req.query.id_usuario} order by id desc `
    
    executaSQL(credenciais, sql)
      .then(res => {
        if (res.length > 0) {
          let propostas = res;
          resolve(propostas)
        }
        else reject('Não há propostas!')
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { salvarProposta, getPropostasDoUsuario }
