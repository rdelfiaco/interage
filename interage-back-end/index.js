const express = require('express');
const app = express();

const usuario = require('./src/api/usuario');




app.get('/login/:login', (req, res ) => { 
    
    usuario.login(`${req.params.login}`)
        .then (linhas => {res.send( linhas )}) 
        .catch ( console.log (linhas ) )// linhas => {res.send( linhas )})
});

/*
console.log( usuario.login( log ).then(linhas => {
    console.log(linhas)
}) );

app.get('/login', (req, res, nex) =>{

    //console.log( `${req.params.id}` )

    res.send( `Cliente ${req.params.id} selecionado!` ) 

});
*/



app.listen(3000);