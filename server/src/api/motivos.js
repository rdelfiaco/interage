const { executaSQL } = require('./executaSQL');
const { executaSQLComTransacao } = require('./executaSQL');
const { getCanais } = require('./canais'); 
const { awaitSQL } = require('./shared');

function getMotivos(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
                                              
      let sql = `SELECT * from motivos ` 

      executaSQL(credenciais, sql)
        .then(res => {
          
            resolve(res)
        })
        .catch(err => {
          reject(err)
        })
  });
};

function crudMotivos(req, res){
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
  let tabela = 'motivos';
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
    let sql = `INSERT INTO motivos(
               status,  nome)
              VALUES ( ${req.query.status},  '${req.query.nome}') RETURNING id;`;
    return sql;
  };
  function sqlDelete(){
    let sql = `DELETE FROM motivos
                WHERE id= ${req.query.id};`;
    return sql;
  };
  function sqlUpdate(){
    let sql = `UPDATE motivos
               SET  status=${req.query.status}, 
                    nome='${req.query.nome}'
              WHERE id= ${req.query.id};`;
    return sql;
  };


});
};

function getCanaisMotivoSeleconado(req, res){
  return new Promise(function (resolve, reject) {
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };
      
    let sql = `SELECT c.id::integer, c.nome
                  from motivos_canais mc
                  inner join canais c on mc.id_canal = c.id 
     
                where id_motivo = ${req.query.motivoSelecionado} ` 
    executaSQL(credenciais, sql)
      .then(canaisMotivo => {
        getCanais(req, res) .then(canais => {
          resolve({canaisMotivo: canaisMotivo, canais: canais});

        })
        .catch(err => {
          reject(err)
        });    
      })
      .catch(err => {
        reject(err)
      })
});
};

async function salvarCanaisDoMotivo(req, res){
  let credenciais = {
    token: req.query.token,
    idUsuario: req.query.id_usuario
  };

  let motivoSelecionado = JSON.parse (req.query.motivoSelecionado);
  let canaisDoMotivo = JSON.parse(req.query.canaisDoMotivo);

      // não excluir e nem inserir os motivos e canais que estiferem em campanhas e/ou em eventos. 
    // ou seja onde estiver foreign key não pode excluir e nem inserir. 

    let sqlForeignKey = `
    select distinct mc.id_canal
    from  motivos_canais mc 
    left join campanhas c on mc.id_motivo = c.id_motivo and mc.id_canal = c.id_canal
    left join eventos e on mc.id_motivo = e.id_motivo and mc.id_canal = e.id_canal 
    WHERE (c.id is not null or e.id is not  null  ) and mc.id_motivo = ${motivoSelecionado} 
    `;

    var foreignKey = await awaitSQL(credenciais, sqlForeignKey);
    var vtforeignKey = [];
    (foreignKey || []).forEach(elem =>{
      if (elem.id_canal != null) vtforeignKey.push(elem.id_canal)
    });

  return new Promise(function (resolve, reject) {

    let sqlDelet = `
    delete from motivos_canais
    where motivos_canais in (select mc
                              from motivos_canais as mc 
                              left join campanhas c on mc.id_motivo = c.id_motivo and mc.id_canal = c.id_canal
                              left join eventos e on mc.id_motivo = e.id_motivo and mc.id_canal = e.id_canal 
                              WHERE (c.id is null and e.id is null ) and mc.id_motivo = ${motivoSelecionado} 
                            )` 
    let sqlInsert = ` INSERT INTO public.motivos_canais(
                    id_motivo, id_canal)
            VALUES  `
    let tamanhoSqlInsert = sqlInsert.length -1 ;

    for (i = 0; i <= canaisDoMotivo.length -1 ;  i++ ){
      // verificar se o canal e motivo estão em campanha ou eventos 
      if ((vtforeignKey || []).find(element =>  element == canaisDoMotivo[i]._id ) == undefined )
      {
        sqlInsert =  sqlInsert  + `(${motivoSelecionado}, ${canaisDoMotivo[i]._id}),`
      }
    }
    sqlInsert = sqlInsert.substr(0,  sqlInsert.length -1 ) 
    if (!canaisDoMotivo.length || tamanhoSqlInsert == sqlInsert.length)  sqlInsert = "Select now()" ;

    const dbconnection = require('../config/dbConnection');
    const { Client } = require('pg');
    const client = new Client(dbconnection);
    client.connect();

    client.query('BEGIN').then((res1) => {
        executaSQLComTransacao(credenciais, client, sqlDelet ).then(resDel => {
          executaSQLComTransacao(credenciais, client, sqlInsert). then( resInsert => {
            client.query('COMMIT')
            .then((resp) => { resolve('Canais dos motivo atualizados ') })
            .catch(err => {  reject(err) });
          });
          });
        });
    })
  }

  function getRespostasMotivoSeleconado(req, res){
    return new Promise(function (resolve, reject) {
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
        
      let sql = `select *
                from motivos_respostas
                where id_motivo = ${req.query.idMotivoSelecionado} ` 
      executaSQL(credenciais, sql)
        .then(res => {
            resolve(res);
        })
        .catch(err => {
          reject(err)
        })
  });
  };

  function crudRespostasMotivo(req, res){
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
    let tabela = 'motivos';
    let idTabela = req.query.id;
    let sql = ''
    if (crud == 'C') sql = sqlCreate(); 
    if (crud == 'D') sql = sqlDelete();
    if (crud == 'U') sql = sqlUpdate();
    executaSQL(credenciais, sql).then(res => {
      resolve(res)
  
    })
    .catch(err => {
      reject(err)
    });
  
    function sqlCreate(){
      let sql = `INSERT INTO motivos_respostas(
        id_motivo, status,  nome)
                VALUES ( ${req.query.id_motivo}, ${req.query.status},  '${req.query.nome}') RETURNING id;`;
      return sql;
    };
    function sqlDelete(){
      let sql = `DELETE FROM motivos_respostas
                  WHERE id= ${req.query.id} ;`;
      return sql;
    };
    function sqlUpdate(){
      let sql = `UPDATE motivos_respostas
                 SET  status=${req.query.status}, 
                      nome='${req.query.nome}'
                WHERE id= ${req.query.id} ;`;
      return sql;
    };
  
  
  });
  };

  module.exports = { 
                      getMotivos, 
                      crudMotivos, 
                      getCanaisMotivoSeleconado, 
                      salvarCanaisDoMotivo, 
                      getRespostasMotivoSeleconado,
                      crudRespostasMotivo }