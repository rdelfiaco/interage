import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../../lib/ng-uikit-pro-standard';
import { Usuario } from '../../login/usuario';
import * as moment from 'moment';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';


@Component({
  selector: 'app-detalhe-de-campanha',
  templateUrl: './detalhe-de-campanha.component.html',
  styleUrls: ['./detalhe-de-campanha.component.scss']
})
export class DetalheDeCampanhaComponent implements OnInit {

  idCampanha: number;
  nome: string;
  dataInicial: string;
  dataFinal: string;
  usuarioLogado: Usuario;
  detalheCampanhaStatus: Array<any> = [];
  detalheCampanhaStatusConsultor: Array<any> = [];
  detalheCampanhaStatusConsultorTodos: Array<any> = [];
  detalheCampanhaConsultor: Array<any> = [];
  detalheCampanhaConsultorStatus: Array<any> = [];
  detalheCampanhaConsultorStatusTodos: Array<any> = [];
  statusSelecionado: string;
  usuarioSelecionado: string;

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

  constructor(    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private toastrService: ToastService) { 
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    this.route.params.subscribe(res => {
      let parametros = res.parametros;
      parametros = JSON.parse(parametros);
      this.idCampanha = parametros.idCampanha;
      this.nome = parametros.nome;
      this.dataInicial =  `${parametros.dataInicial.substring(8, 10)}/${parametros.dataInicial.substring(5, 7)}/${parametros.dataInicial.substring(0,4)}`
      this.dataFinal =  `${parametros.dataFinal.substring(8, 10)}/${parametros.dataFinal.substring(5, 7)}/${parametros.dataFinal.substring(0,4)}`
     });
  };

  ngOnInit() {
    this.getDetalheCampanha()
    this.items_ = this.getBooks();
  }


  async getDetalheCampanha(){
  
      let retorno = await this.connectHTTP.callService({
        service: 'getDetalheCampanha',
        paramsService: {
          idCampanha: this.idCampanha,
          dtInicial: this.dataInicial,
          dtFinal: this.dataFinal
        }
      }) as any;

      this.detalheCampanhaStatus = retorno.resposta.detalheCampanhaStatus;
      this.detalheCampanhaStatusConsultorTodos = retorno.resposta.detalheCampanhaStatusConsultor;
      this.detalheCampanhaConsultor = retorno.resposta.detalheCampanhaConsultor;
      this.detalheCampanhaConsultorStatusTodos = retorno.resposta.detalheCampanhaConsultorStatus;

  }

    detalheStatus(id_resp_motivo, status_ligacao){
      this.statusSelecionado = status_ligacao
      this.detalheCampanhaStatusConsultor = this.detalheCampanhaStatusConsultorTodos.filter(t => t.id_resp_motivo == id_resp_motivo)

    }
    detalheUsuario(id_pessoa_resolveu, pessoa_resolveu ){
      this.usuarioSelecionado = pessoa_resolveu
      this.detalheCampanhaConsultorStatus = this.detalheCampanhaConsultorStatusTodos.filter(t => t.id_pessoa_resolveu == id_pessoa_resolveu )

    }

    voltar() {
      history.back();
    }



    config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasFilter: false,
      hasCollapseExpand: false,
      decoupleChildFromParent: false, 
      maxHeight: 500
  });

    
//   itCategory = new TreeviewItem({
//     text: 'IT', value: 9, children: [
//         {
//             text: 'Programming', value: 91, children: [{
//                 text: 'Frontend', value: 911, children: [
//                     { text: 'Angular 1', value: 9111 },
//                     { text: 'Angular 2', value: 9112 },
//                     { text: 'ReactJS', value: 9113 }
//                 ]
//             }, {
//                 text: 'Backend', value: 912, children: [
//                     { text: 'C#', value: 9121 },
//                     { text: 'Java', value: 9122 },
//                     { text: 'Python', value: 9123, checked: false }
//                 ]
//             }]
//         },
//         {
//             text: 'Networking', value: 92, children: [
//                 { text: 'Internet', value: 921 },
//                 { text: 'Security', value: 922 }
//             ]
//         }
//     ]
//  });

items_: TreeviewItem[];



getRooms(): TreeviewItem[] {
  const items: TreeviewItem[] = [];
  for (let i = 0; i < 1000; i++) {
      const value: any = i === 0 ? { name: `${i}` } : i;
      const checked = i % 100 === 0;
      const item = new TreeviewItem({ text: `Room ${i}`, value: value, checked: checked });
      items.push(item);
  }

  return items;
}



 onSelectedChange(a: any){

 }

 onFilterChange(a: any){

 }
   

 getBooks(): TreeviewItem[] {
  const childrenCategory = new TreeviewItem({
      text: 'Children', value: 1,  collapsed: false, children: [
          { text: 'Baby 3-5', value: 11 },
          { text: 'Baby 6-8', value: 12 },
          { text: 'Baby 9-12', value: 13 }
      ]
  });
  const itCategory = new TreeviewItem({
      text: 'IT', value: 9, children: [
          {
              text: 'Programming', value: 91, children: [{
                  text: 'Frontend', value: 911, children: [
                      { text: 'Angular 1', value: 9111 },
                      { text: 'Angular 2', value: 9112 },
                      { text: 'ReactJS', value: 9113, disabled: true }
                  ]
              }, {
                  text: 'Backend', value: 912, children: [
                      { text: 'C#', value: 9121 },
                      { text: 'Java', value: 9122 },
                      { text: 'Python', value: 9123, checked: false, disabled: true }
                  ]
              }]
          },
          {
              text: 'Networking', value: 92, children: [
                  { text: 'Internet', value: 921 },
                  { text: 'Security', value: 922 }
              ]
          }
      ]
  });
  const teenCategory = new TreeviewItem({
      text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
          { text: 'Adventure', value: 21 },
          { text: 'Science', value: 22 }
      ]
  });
  const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
  return [childrenCategory, itCategory, teenCategory, othersCategory];
}




}
