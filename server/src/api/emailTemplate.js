const { executaSQL } = require('./executaSQL');
const { getUsuarios } = require('./usuario');
const { getPermissoes } = require('./permissao');
const { executaSQLComTransacao }  = require('./executaSQL');



 
function getEmailTemplate(req, res) {
    return new Promise(function (resolve, reject) {
  
      
      let credenciais = {
        token: req.query.token,
        idUsuario: req.query.id_usuario
      };
      let sql = 'select * from email_templates'
      executaSQL(credenciais, sql).then(resp  => {
        let emailTemplates = resp 
        resolve(  emailTemplates )
      }).catch(e => {
      reject({error: e });
    });
    });
};

function postEmailTemplate(req, res) {
  return new Promise(function (resolve, reject) {

    
    let credenciais = {
      token: req.query.token,
      idUsuario: req.query.id_usuario
    };

    let arquivo = req.body;
 
    let sql = `INSERT INTO public.email_templates(
       assunto, 
       corpo, 
       descricao, 
       nome_template) 
      VALUES ( '${arquivo.assunto}', 
        '${arquivo.corpo}', 
        '${arquivo.descricao}', 
        '${arquivo.nome_template}');`

    executaSQL(credenciais, sql).then(resp  => {
      let emailTemplates = resp 
      resolve(  emailTemplates )
    }).catch(e => {
    reject({error: e });
  });
  });
};





module.exports = { getEmailTemplate, postEmailTemplate

}
