const express = require('express');
const app = express();
const nodeStart = require('./src/config/nodeStart');

const usuario = require('./src/api/usuario');
const campanha = require('./src/api/campanha');
const evento = require('./src/api/evento');
const telemarketing = require('./src/api/telemarketing');
const pessoa = require('./src/api/pessoa');

app.get('/login', (req, res) => {
  usuario.login(req)
    .then(linhas => {
      headerResponse(res)
      res.status(200).send(linhas)
    })
    .catch(error => {
      headerResponse(res)
      console.log(error)
      res.status(401).send(error)
    })
});

app.get('/getCampanhasDoUsuario', (req, res) => {
  campanha.getCampanhasDoUsuario(req)
    .then(linhas => {
      headerResponse(res)
      res.status(200).send(linhas)
    })
    .catch(error => {
      headerResponse(res)
      console.log(error)
      res.status(401).send(error)
    })
});

app.get('/getLigacaoTelemarketing', (req, res) => {
  telemarketing.getLigacaoTelemarketing(req)
    .then(linhas => {
      headerResponse(res)
      res.status(200).send(linhas)
    })
    .catch(error => {
      headerResponse(res)
      console.log(error)
      res.status(401).send(error)
    })
});

app.get('/salvarEvento', (req, res) => {
  evento.salvarEvento(req)
    .then(linhas => {
      headerResponse(res)
      res.status(200).send(linhas)
    })
    .catch(error => {
      headerResponse(res)
      console.log(error)
      res.status(401).send(error)
    })
});

app.get('/salvarPessoa', (req, res) => {
  pessoa.salvarPessoa(req)
    .then(linhas => {
      headerResponse(res)
      res.status(200).send(linhas)
    })
    .catch(error => {
      headerResponse(res)
      console.log(error)
      res.status(401).send(error)
    })
});

app.listen(nodeStart.port);
console.log(`Servidor iniciado na em http://localhost:${nodeStart.port}`)


function headerResponse(res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, cache-control");
}