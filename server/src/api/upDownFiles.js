var fs = require('fs');
const standardPath = require('../config/pathStandard');
const { checkToken} = require('./checkToken');
var formidable = require('formidable');


function getFiles(req, res) {
    return new Promise(function (resolve, reject) {
        let credenciais = {
            token: req.query.token,
            idUsuario: req.query.id_usuario
          };
        checkToken(credenciais.token, credenciais.idUsuario).then(historico => {
            var rootDir =  standardPath.standardPath + req.query.path;
            fs.readdir(rootDir, function(err, files) { 
                var _files = []
                for (var i = 0; i < files.length; i++  ) {
                    let _file = {nome: ''}
                    _file.nome = files[i];
                    _files.push( _file)
                }
                //console.log('err ', err )
                if (err == 'null' ){
                    reject(err)
                }else {
                    resolve({path: rootDir,  files: _files})
                };
            });
        }).catch(e => {
            reject(e);
        });
    })
}


function postFiles(req, res) {
    return new Promise(function (resolve, reject) {
        let credenciais = {
            token: req.headers.token,
            idUsuario: req.headers.id_usuario
            };
        checkToken(credenciais.token, credenciais.idUsuario).then(historico => {
            var rootDir =  standardPath.standardPath + req.headers.pathfile;
            var form = new formidable.IncomingForm();

             form.parse(req);
         
             form.on('fileBegin', function (name, file){
                 file.path = rootDir + file.name;
             });
         
             form.on('file', function (name, file){
             });
         
             resolve('Upload realizado ')
            }).catch(e => {
                reject(e);
        });
    });
}

module.exports = { 
getFiles,
postFiles
}