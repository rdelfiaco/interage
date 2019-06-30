const express = require('express');
const router = express.Router();
const app = express();
const nodeStart = require('./src/config/nodeStart');
const bodyParser = require('body-parser');

const usuario = require('./src/api/usuario');
const campanha = require('./src/api/campanha');
const evento = require('./src/api/evento');
const telemarketing = require('./src/api/telemarketing');
const pessoa = require('./src/api/pessoa');
const atividade = require('./src/api/atividade');
const produtividade = require('./src/api/produtividade');
const tabelaPrecos = require('./src/api/tabelasPrecos');
const importar = require('./src/api/importaLead');
const proposta = require('./src/api/proposta');
const config = require('./src/api/config');
const exportaSQL = require('./src/api/exportaSQL');
const tarefa = require('./src/api/tarefa');
const ranks =  require('./src/api/ranks');
const departamentos = require('./src/api/departamento');
const consultaPlaca = require('./src/api/consultaPlaca');
const canais = require('./src/api/canais');
const motivos = require('./src/api/motivos');
const questionarios = require('./src/api/questionarios');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

declaraServico('getEventoPorId', evento.getEventoPorId);
declaraServico('visualizarEvento', evento.visualizarEvento);
declaraServico('informacoesParaCriarEvento', evento.informacoesParaCriarEvento);
declaraServico('salvarProposta', proposta.salvarProposta);
declaraServico('encaminhaEvento', evento.encaminhaEvento);
declaraServico('criarEvento', evento.criarEvento);
declaraServico('consultarPlaca', consultaPlaca.consultarPlaca);
declaraServico('getPropostasDoUsuario', proposta.getPropostasDoUsuario);
declaraServico('getPropostaPorId', proposta.getPropostaPorId);
declaraServico('getPropostaFiltros', proposta.getPropostaFiltros);
declaraServico('salvarPlacaDaProposta', proposta.salvarPlacaDaProposta);
declaraServico('getEventoFiltros', evento.getEventoFiltros);
declaraServico('getEventosFiltrados', evento.getEventosFiltrados);
declaraServico('getAgentesVendas', usuario.getAgentesVendas);
declaraServico('getPessoa', pessoa.getPessoa);
declaraServico('getCountEventosPendentes', evento.getCountEventosPendentes);
declaraServico('getConfiguracao', config.getConfiguracao);
declaraServico('getSQLs', exportaSQL.getSQLs);
declaraServico('getResultadoSQLs', exportaSQL.getResultadoSQLs);
declaraServico('getSQL', exportaSQL.getSQL);
declaraServico('getPropostasPorPeriodoSintetico', proposta.getPropostasPorPeriodoSintetico);
declaraServico('getEventosPorPeriodoSintetico', evento.getEventosPorPeriodoSintetico);
declaraServico('getTarefaPorId', tarefa.getTarefaPorId);
declaraServico('getTarefaPerformance',tarefa.getTarefaPerformance);
declaraServico('getCampanhasTelemarketingAtivas',campanha.getCampanhasTelemarketingAtivas);
declaraServico('getCampanhaTelemarketingAnalisar',campanha.getCampanhaTelemarketingAnalisar);
declaraServico('getLigacaoTelemarketing', telemarketing.getLigacaoTelemarketing);
declaraServico('getCampanhaFollowDoUsuario', campanha.getCampanhaFollowDoUsuario);
declaraServico('getRanks', ranks.getRanks);
declaraServicoPost('importaLead', importar.importaLead );
declaraServico('getDetalheCampanha', campanha.getDetalheCampanha );
declaraServico('getDepartamentos', departamentos.getDepartamentos );
declaraServico('getDepartamentosUsuarios', departamentos.getDepartamentosUsuarios );
declaraServico('getPermissoesDepartamentoSeleconado', departamentos.getPermissoesDepartamentoSeleconado );
declaraServico('salvarPermissoesDoDepartamento', departamentos.salvarPermissoesDoDepartamento );
declaraServico('salvarUsuariosDoDepartamento', departamentos.salvarUsuariosDoDepartamento );
declaraServico('login', usuario.login );
declaraServico('getLogin', usuario.getLogin);
declaraServico('getUsuarios', usuario.getUsuarios );
declaraServico('salvarUsuario', usuario.salvarUsuario );
declaraServico('excluirUsuario', usuario.excluirUsuario );
declaraServico('getAtividades', atividade.getAtividades );
declaraServico('getTabelaPrecos', tabelaPrecos.getTabelaPrecos );
declaraServico('logout', usuario.logout );
declaraServico('getCampanhasDoUsuario',campanha.getCampanhasDoUsuario  );
declaraServico('getCampanhasUsuarioSeleconado',campanha.getCampanhasUsuarioSeleconado  );
declaraServico('getUsuariosCampanhaSelecionada',campanha.getUsuariosCampanhaSelecionada);
declaraServico('salvarUsuariosDaCampanha', campanha.salvarUsuariosDaCampanha);
declaraServico('getCampanhas', campanha.getCampanhas );
declaraServico('salvarEvento', evento.salvarEvento );
declaraServico('salvarPessoa', pessoa.salvarPessoa  );
declaraServico('getTipoTelefone', pessoa.getTipoTelefone );
declaraServico('getTratamentoPessoaFisica', pessoa.getTratamentoPessoaFisica );
declaraServico('salvarTelefonePessoa', pessoa.salvarTelefonePessoa );
declaraServico('excluirTelefonePessoa', pessoa.excluirTelefonePessoa );
declaraServico('salvarEnderecoPessoa',  pessoa.salvarEnderecoPessoa);
declaraServico('excluirEnderecoPessoa', pessoa.excluirEnderecoPessoa);
declaraServico('pesquisaPessoas', pessoa.pesquisaPessoas  );
declaraServico('editaTelefonePrincipal', pessoa.editaTelefonePrincipal);
declaraServico('editaEnderecoDeCorrespondencia', pessoa.editaEnderecoDeCorrespondencia  );
declaraServico('adicionarPessoa',  pessoa.adicionarPessoa );
declaraServico('getEventosPendentes', evento.getEventosPendentes );
declaraServico('getEventosLinhaDoTempo', evento.getEventosLinhaDoTempo );
declaraServico('getEventosRelatorioUsuario', evento.getEventosRelatorioUsuario );
declaraServico('getCampanhaAnalisar', campanha.getCampanhaAnalisar );
declaraServico('salvarCampanhasDoUsuario', campanha.salvarCampanhasDoUsuario );
declaraServico('getEventosRelatorioCampanha', campanha.getEventosRelatorioCampanha );
declaraServico('getProdutividadeCallCenter', produtividade.getProdutividadeCallCenter );
declaraServico('trocarSenhaUsuarioLogado',  usuario.trocarSenhaUsuarioLogado);
declaraServico('getPessoaPorCPFCNPJ',  pessoa.getPessoaPorCPFCNPJ);
declaraServico('adicionarUsuario',  usuario.adicionarUsuario);
declaraServico('getPermissoesUsuarioSeleconado',  usuario.getPermissoesUsuarioSeleconado);
declaraServico('salvarPermissoesDoUsuario',  usuario.salvarPermissoesDoUsuario);
declaraServico('getCanais',  canais.getCanais);
declaraServico('getMotivos',  motivos.getMotivos);
declaraServico('getQuestionarios',  questionarios.getQuestionarios);



app.listen(nodeStart.port, "0.0.0.0");
console.log(`Servidor iniciado na em http://localhost:${nodeStart.port}`)


function declaraServico(nomeServico, funcao) {
  app.get(`/${nomeServico}`, (req, res) => {
    funcao(req)
      .then(linhas => {
        headerResponse(res)
        //console.log(`Serviço: ${nomeServico}; Resultado: ` , linhas)
        res.status(200).send(linhas)
      })
      .catch(error => {
        headerResponse(res)
        console.log(`Serviço: ${nomeServico}; Resultado: ` , error)
        res.status(401).send(error)
      });
  });
  console.log(`Serviço GET ${nomeServico}, declarado com sucesso!`)
}

function declaraServicoPost(nomeServico, funcao) {
  app.post(`/${nomeServico}`, (req, res) => {
    console.log(req.query)
    funcao(req)
      .then(linhas => {
        headerResponse(res)
        //console.log(`Serviço: ${nomeServico}; Resultado: ` , linhas)
        res.status(200).send(linhas)
      })
      .catch(error => {
        headerResponse(res)
        console.log(`Serviço: ${nomeServico}; Resultado: ` , error)
        res.status(401).send(error)
      })
  });
  console.log(`Serviço POST ${nomeServico}, declarado com sucesso!`)
}

function headerResponse(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, cache-control");
}