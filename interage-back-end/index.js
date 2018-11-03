const express = require('express');
const app = express();
const nodeStart = require('./src/config/nodeStart');

const usuario = require('./src/api/usuario');
const campanha = require('./src/api/campanha');
const evento = require('./src/api/evento');
const telemarketing = require('./src/api/telemarketing');
const pessoa = require('./src/api/pessoa');
const atividade = require('./src/api/atividade');
const produtividade = require('./src/api/produtividade');
const consultaPlaca = require('./src/api/consultaPlaca');

declaraServico('getEventoPorId', evento.getEventoPorId);

app.get('/getAtividades', (req, res) => {
  atividade.getAtividades(req)
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
app.get('/logout', (req, res) => {
  usuario.logout(req)
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

app.get('/getCampanhas', (req, res) => {
  campanha.getCampanhas(req)
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

app.get('/getEventoFiltros', (req, res) => {
  evento.getEventoFiltros(req)
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

app.get('/getEventosFiltrados', (req, res) => {
  evento.getEventosFiltrados(req)
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

app.get('/getTipoTelefone', (req, res) => {
  pessoa.getTipoTelefone(req)
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


app.get('/getPessoa', (req, res) => {
  pessoa.getPessoa(req)
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
app.get('/getTratamentoPessoaFisica', (req, res) => {
  pessoa.getTratamentoPessoaFisica(req)
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

app.get('/salvarTelefonePessoa', (req, res) => {
  pessoa.salvarTelefonePessoa(req)
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

app.get('/excluirTelefonePessoa', (req, res) => {
  pessoa.excluirTelefonePessoa(req)
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

app.get('/salvarEnderecoPessoa', (req, res) => {
  pessoa.salvarEnderecoPessoa(req)
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

app.get('/excluirEnderecoPessoa', (req, res) => {
  pessoa.excluirEnderecoPessoa(req)
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

app.get('/pesquisaPessoas', (req, res) => {
  pessoa.pesquisaPessoas(req)
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
app.get('/editaTelefonePrincipal', (req, res) => {
  pessoa.editaTelefonePrincipal(req)
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

app.get('/editaEnderecoDeCorrespondencia', (req, res) => {
  pessoa.editaEnderecoDeCorrespondencia(req)
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

app.get('/adicionarPessoa', (req, res) => {
  pessoa.adicionarPessoa(req)
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

app.get('/getEventosPendentes', (req, res) => {
  evento.getEventosPendentes(req)
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

app.get('/getAgentesVendas', (req, res) => {
  usuario.getAgentesVendas(req)
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

app.get('/getEventosLinhaDoTempo', (req, res) => {
  evento.getEventosLinhaDoTempo(req)
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

app.get('/getEventosRelatorioUsuario', (req, res) => {
  evento.getEventosRelatorioUsuario(req)
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

app.get('/getCampanhaAnalisar', (req, res) => {
  campanha.getCampanhaAnalisar(req)
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

app.get('/getEventosRelatorioCampanha', (req, res) => {
  campanha.getEventosRelatorioCampanha(req)
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

app.get('/getProdutividadeCallCenter', (req, res) => {
  produtividade.getProdutividadeCallCenter(req)
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

app.get('/trocarSenhaUsuarioLogado', (req, res) => {
  usuario.trocarSenhaUsuarioLogado(req)
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

app.get('/busca', (req, res) => {
  consultaPlaca.busca(req)
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

app.listen(nodeStart.port, "0.0.0.0");
console.log(`Servidor iniciado na em http://localhost:${nodeStart.port}`)


function declaraServico(nomeServico, funcao) {
  app.get(`/${nomeServico}`, (req, res) => {
    funcao(req)
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
  console.log(`Serviço ${nomeServico}, declarado com sucesso!`)
}

function headerResponse(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, cache-control");
}