
const { executaSQL } = require('./executaSQL')

function salvarProposta(req, res) {
    return new Promise(function (resolve, reject) {

      let credenciais= {
        token: req.query.token,
        idUsuario : req.query.id_usuario
      };

      let sql = `INSERT INTO public.propostas(
                    id_tipo_veiculo, codigofipe, marca, modelo, anoModelo, data_consulta 
                    , preco_medio, adesao, mensalidade , participacao, cota, id_fundo_terceiros
                    , id_carro_reserva, id_app, id_rastreador, id_protecao_vidros, proposta_json
                    , id_usuario, id_pessoa_cliente, placa 
                    , id_status_proposta,  dtsalvou
                VALUES (  ${req.query.proposta._idTipoVeiculo},
                          ${req.query.proposta._codigoFipe},
                          ${req.query.proposta._marca},
                          ${req.query.proposta._modelo},
                          ${req.query.proposta._anoModelo},
                          ${req.query.proposta._dataConsulta},
                          ${req.query.proposta._precoMedio},
                          ${req.query.proposta._adesão},
                          ${req.query.proposta._mensalidade},
                          ${req.query.proposta._participacao},
                          ${req.query.proposta._cota},
                          ${req.query.proposta._idFundoTerceiros},
                          ${req.query.proposta._idCarroReserva},
                          ${req.query.proposta._idApp},
                          ${req.query.proposta._idRastreador},
                          ${req.query.proposta._idProtecaoVidros},
                          ${req.query.proposta._propostaJSON},    
                          ${req.query.proposta._idPessoaUsuario},
                          ${req.query.proposta._idPessoaCliente},
                          ${req.query.proposta._placa},
                          5,now())`
 


      executaSQL(credenciais, sql).then(registros => {
        resolve(registros);
      }).catch(e => {
        reject(e);
      });
    });
}

module.exports = { salvarProposta }
