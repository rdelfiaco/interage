const { executaSQL } = require('./executaSQL');
const { executaSQLComTransacao } = require('./executaSQL');
const { auditoria } = require('./auditoria');


function getTipoRelacionamentosCon(req, res) {
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
  
      let sql = `select *, case when nivelrelacionamento = 'P' then 'Profissional' else 'Familiar' end as nivelrelac from tipo_Relacionamentos  `
      executaSQL(credenciais, sql)
        .then(res => {
          if (res.length > 0) {
            let resposta = res;
            resolve(resposta)
          }
          else reject('tipo_Relacionamentos não encontrada!')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function crudTipoRelacionamentos(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
  
// divide o objeto em atuais e anteriores 
    let dadosAtuais = JSON.parse(req.query.dadosAtuais);
    const dadosAnteriores =  JSON.parse(req.query.dadosAnteriores);
    const crud = req.query.crud;
    req.query = dadosAtuais;
    //req.query.id_usuario = credenciais.idUsuario;
    let tabela = 'tipo_Relacionamentos';
    let idTabela = req.query.id;
    let sql = ''
    if (crud == 'C') sql = sqlCreate(); 
    if (crud == 'D') sql = sqlDelete();
    if (crud == 'U') sql = sqlUpdate();
    executaSQL(credenciais, sql).then(res => {
      // auditoria 
      // if (crud == 'C') idTabela = res[0].id;
      // auditoria(credenciais, tabela, crud , idTabela, dadosAnteriores, dadosAtuais );
      resolve(res)

    })
    .catch(err => {
      reject(err)
    });

    function sqlCreate(){
      let sql = `INSERT INTO tipo_relacionamentos(
                 status,  descricao, nivelrelacionamento)
                VALUES ( ${req.query.status},  '${req.query.descricao}' , '${req.query.nivelrelacionamento}') RETURNING id;`;
      return sql;
    };
    function sqlDelete(){
      let sql = `DELETE FROM tipo_relacionamentos
                  WHERE id= ${req.query.id};`;
      return sql;
    };
    function sqlUpdate(){
      let sql = `UPDATE tipo_relacionamentos
                 SET  status=${req.query.status}, 
                      descricao='${req.query.descricao}'
                      nivelrelacionamento= '${req.query.nivelrelacionamento}'
                WHERE id= ${req.query.id};`;
      return sql;
    };


  });
};

function getRelacionamentosVolta(req, res) {
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };

      let sql = `select * from tipo_Relacionamentos where status  `
      executaSQL(credenciais, sql)
        .then(res => {
            let relacionamentos  = res;
            sql = `select tr.id, tr.descricao 
            from tipo_relacionamentos_volta trv 
            inner join tipo_relacionamentos tr on trv.id_tipo_relacionamento_volta = tr.id 
            where trv.id_tipo_relacionamento = ${req.query.idTipoDeRelacSelecionado} `
            executaSQL(credenciais, sql)
            .then(res => {
                let relacionamentosVolta  = res;

                console.log('relacionamentosVolta', relacionamentosVolta )

                resolve({relacionamentos : relacionamentos, relacionamentosVolta : relacionamentosVolta})
                })
                .catch(err => {
                reject(err)
                })
        })
        .catch(err => {
          reject(err)
        })

    })
};

async function salvarRelacionamentoVolta(req, res){
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
  
    let idTipoDeRelacSelecionado = JSON.parse (req.query.idTipoDeRelacSelecionado);
    let relacionamentosVoltaNovos = JSON.parse(req.query.relacionamentosVoltaNovos);
  

  
    return new Promise(function (resolve, reject) {
  
      let sqlDelet = `delete 
      from tipo_relacionamentos_volta 
      where id_tipo_relacionamento = ${req.query.idTipoDeRelacSelecionado}` 
      let sqlInsert = ` INSERT INTO public.tipo_relacionamentos_volta(
        id_tipo_relacionamento, id_tipo_relacionamento_volta)
        VALUES `
      let tamanhoSqlInsert = sqlInsert.length -1 ;
  
      for (i = 0; i <= relacionamentosVoltaNovos.length -1 ;  i++ ){
        
          sqlInsert =  sqlInsert  + `(${idTipoDeRelacSelecionado}, ${relacionamentosVoltaNovos[i]._id}),`
      }

      sqlInsert = sqlInsert.substr(0,  sqlInsert.length -1 ) 
      if (!relacionamentosVoltaNovos.length || tamanhoSqlInsert == sqlInsert.length)  sqlInsert = "Select now()" ;
  

      console.log('sqlInsert ', sqlInsert);
      console.log('sqlDelet ', sqlDelet )

      const dbconnection = require('../config/dbConnection');
      const { Client } = require('pg');
      const client = new Client(dbconnection);
      client.connect(); 
  
      client.query('BEGIN').then((res1) => {
          executaSQLComTransacao(credenciais, client, sqlDelet ).then(resDel => {
            executaSQLComTransacao(credenciais, client, sqlInsert). then( resInsert => {
              client.query('COMMIT')
              .then((resp) => { resolve('Relacionamentos de volta atualizados ') })
              .catch(err => {  reject(err) });
            })
            .catch(err => {  reject(err) });
            })              
            .catch(err => {  reject(err) });

          })
          .catch(err => {  reject(err) });

      })
  }


module.exports = {getTipoRelacionamentosCon, 
    crudTipoRelacionamentos, 
    getRelacionamentosVolta, 
    salvarRelacionamentoVolta }