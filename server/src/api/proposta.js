const { executaSQL } = require('./executaSQL')
const { getUsuarios } = require('./usuario')

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
                    , id_usuario, id_pessoa_cliente, placa, cota_alterada
                    , id_status_proposta
                    , veiculo_comercial
                    , leilao_sinistrado
                    , dtsalvou)
                VALUES (  ${req.query.proposta.idTipoVeiculo},
                          '${req.query.proposta.codigoFipe}',
                          '${req.query.proposta.marca}',
                          '${req.query.proposta.modelo}',
                          '${req.query.proposta.anoModelo}',
                          '${req.query.proposta.dataConsulta}',
                          '${req.query.proposta.precoMedio}',
                          '${req.query.proposta.adesao}',
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
                          ${req.query.proposta.cotaAlterada},
                          ${req.query.proposta.idStatusProposta},
                          ${req.query.proposta.veiculoComercial},
                          ${req.query.proposta.leilaoSinistrado},
                          now()) RETURNING id`

                          console.log('evento', sql)


    executaSQL(credenciais, sql).then(registros => {

      //criar evento para acompanhar poposta ou pedir autorização para uso de conta alterada
      let id_proposta = registros[0].id;
      let idProposta = registros;



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
              VALUES (${req.query.proposta.idMotivo},
                      1, 
                      ${req.query.proposta.idPessoaUsuario},
                      now(),
                      func_dt_expira(2),
                      now(),
                      'P',
                      ${req.query.proposta.idPessoaDestinatario},
                      ${req.query.proposta.idPessoaCliente},
                      2,
                      '${req.query.proposta.observacao}',
                      7,
                      ${id_proposta})`
      console.log('evento', sql)
      executaSQL(credenciais, sql).then(registros => {
        resolve(idProposta)
      }).catch(e => {
        reject('Salvar evento de proposta: ', e);
      });
    }).catch(e => {
      reject('Salvar proposta: ',e);
    });
  })
};

function getPropostasDoUsuario(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.idUsuarioLogado
    };
    
    let sql = `select * from view_proposta where id_usuario = ${req.query.idUsuarioSelect} 
               and id_status_proposta = ${req.query.id_statusProposta}
               and date(dtsalvou) between date('${req.query.dataInicial}') and date('${req.query.dataFinal}') 
              order by id desc `

    //console.log('getPropostasDoUsuario',sql )
    executaSQL(credenciais, sql)
      .then(res => {
        if (res) {
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

function getPropostaPorId(req, res) {
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let sql = `select * from view_proposta where id=${req.query.id} `
    executaSQL(credenciais, sql)
      .then(res => {
        if (res.length > 0) {
          let propostas = res;
          resolve(propostas)
        }
        else reject('Proposta não encontrada!')
      })
      .catch(err => {
        reject(err)
      })
  })
}

function getPropostaFiltros(req, res){
  return new Promise(function (resolve, reject) {
    getUsuarios(req).then(Usuarios => {
      getStatusProposta(req).then(StatusProposta => {
        if (!Usuarios || !StatusProposta)
          reject('Filtro não pode ser elaborado ');

        resolve({ Usuarios, StatusProposta });
        
      }).catch(e => {
        reject(e);
      });
    }).catch(e => {
      reject(e);
    });
  });
}

function getStatusProposta(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
    let sql = `select * from status_proposta where status order by nome`
    executaSQL(credenciais, sql)
      .then(res => {
        if (res.length > 0) {
          let status = res;
          resolve(status )
        }
        else reject('Status não encontrado!')
      })
      .catch(err => {
        reject(err)
      })
  })
}

function salvarPlacaDaProposta(req, res) {
  return new Promise(function (resolve, reject) {

    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    
   
    
    let sql = `UPDATE propostas set placa = '${req.query.placa}' where id = ${req.query.id}`

    console.log(sql)

    executaSQL(credenciais, sql).then(registros => {

     resolve('Placa salva com sucesso')
      
    }).catch(e => {
      reject('Salvar placa da proposta: ',e);
    });
  })
};



module.exports = { salvarProposta, getPropostasDoUsuario, getPropostaPorId, getPropostaFiltros, salvarPlacaDaProposta }
