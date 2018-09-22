const express = require('express');
const app = express();
const nodeStart = require('./src/config/nodeStart');

const usuario = require('./src/api/usuario');




app.get('/login/:login', (req, res ) => { 
    
    usuario.login(req)
        .then (linhas => {res.send( linhas )}) 
        .catch ( linhas => {res.send( linhas )})
});




app.listen(nodeStart.port);