import { Proposta } from './../proposta';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Usuario } from '../../login/usuario';
import { img } from '../imagem';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { ToastService, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import { Router } from '@angular/router';
import * as moment from 'moment';



@Component({
  selector: 'app-propostas-enviadas',
  templateUrl: './propostas-enviadas.component.html',
  styleUrls: ['./propostas-enviadas.component.scss']
})
export class PropostasEnviadasComponent implements OnInit  {
  propostas: any;
  usuarioLogado: any;
  idProposta: number;
  
  dataInicial: string = moment().subtract(30, 'days').format('DD/MM/YYYY')
  dataFinal: string = moment().format('DD/MM/YYYY')
  hoje: string = moment().format('DD/MM/YYYY')



  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    dayLabelsFull: { su: "Domingo", mo: "Segunda", tu: "Terça", we: "Quarta", th: "Quinta", fr: "Sexta", sa: "Sábado" },
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    monthLabelsFull: { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" },

    // Buttons
    todayBtnTxt: "Hoje",
    clearBtnTxt: "Limpar",
    closeBtnTxt: "Fechar",
    closeAfterSelect: true,

    // Format
    dateFormat: 'dd/mm/yyyy',
    selectionTxtFontSize: '15px',

  }

  options = {
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    useBom: true,
    headers: ['Post ID', 'Post title', 'Post body']
  };

  usuarioLogadoSupervisor: boolean = false;
  usuarioSelect: Array<any>;
  usuarioSelectValue: number;
  statusPropostaSelect: Array<any>;
  statusPropostaSelectValue:number;

  @ViewChild('modalDetalheProposta') modalDetalheProposta: ModalDirective;

  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private router: Router, 
    private toastrService: ToastService ) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.usuarioLogadoSupervisor = this.usuarioLogado.responsavel_membro == "R"; 
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  async ngOnInit() {
    let propostaFiltros = await this.connectHTTP.callService({
      service: 'getPropostaFiltros',
      paramsService: {
        token: this.usuarioLogado.token,
        id_usuario: this.usuarioLogado.id,
        id_organograma: this.usuarioLogado.id_organograma
      }
    }) as any;

    // combo usuário
    this.usuarioSelect = propostaFiltros.resposta.Usuarios;
    this.usuarioSelect = this.usuarioSelect.map(usuario => {
      return { value: usuario.id, label: usuario.nome }
    });

    this.usuarioSelectValue = this.usuarioLogado.id;

    // combo status das propostas
    this.statusPropostaSelect = propostaFiltros.resposta.StatusProposta;
    this.statusPropostaSelect = this.statusPropostaSelect.map(statusProposta => {
      return { value: statusProposta.id, label: statusProposta.nome }
    });

    this.statusPropostaSelectValue = 3 // aguardando resposta do cliente 

    this.lerPropostas()
  }

  openPDF(docDefinition) {
    pdfMake.createPdf(docDefinition).open()
  }

  abreDetalheProposta(idProposta: number){
    this.idProposta = idProposta;
    this.router.navigate([`/proposta/${idProposta}`]);
  }

  fechaModal() {
    this.modalDetalheProposta.hide();
  }

  async lerPropostas(){
    let propostas = await this.connectHTTP.callService({
      service: 'getPropostasDoUsuario',
      paramsService: {
        idUsuarioLogado: this.usuarioLogado.id,
        idUsuarioSelect: this.usuarioSelectValue,
        id_statusProposta: this.statusPropostaSelectValue,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    }) as any;
    if (propostas.resposta.length > 0) {
      this.propostas = propostas.resposta.map(p => {
        debugger
        let propostaPDF = p.proposta_json  ? JSON.parse(p.proposta_json.replace(/\%23/gim, '#')) : {};
        propostaPDF.images = { logotipo: img }
        //console.log('propostaPDF.content[5] ', propostaPDF.content[5] )
        propostaPDF.content[5].table.body[0][0].text = `A ALTIS atua legalmente perante a lei, respeitando a constituição e o código civil. Não possui nenhum impedimento legal e se responsabiliza solidariamente com os princípios embasado nas leis* Lei no 9.790, de 23 de março de 1999.  / CAPÍTULO I / DA QUALIFICAÇÃO COMO ORGANIZAÇÃO DA SOCIEDADE CIVIL* Constituição da Republica Federativa do Brasil 1988 / TÍTULO II / Dos Direitos / Garantias Fundamentais / CAPÍTULO I / DOS DIREITOS E DEVERES INDIVIDUAIS E COLETIVOS / Art. 5º /Incisos: XVII a XXI.* Código Civil - Lei 10406/02 | Lei no 10.406, de 10 de janeiro de 2002 / TÍTULO II / Da Sociedade / CAPÍTULO II / DAS ASSOCIAÇÕES. 
        
        Validade: 15 dias a partir de ${this.hoje}. `

        return {
          ...p,
          propostaPDF
        }
      });
    } else {
      this.toastrService.error('Não existe proposta para o filtro');
      this.propostas = null;
    }

  }


}
