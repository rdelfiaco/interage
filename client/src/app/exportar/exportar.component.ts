import { Component, OnInit } from '@angular/core';
import { Usuario } from '../login/usuario';
import { Http } from '@angular/http';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { ToastService, IMyOptions } from '../../lib/ng-uikit-pro-standard';
import * as moment from 'moment';
import { registerLocaleData } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';


@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.scss']
})
export class ExportarComponent implements OnInit {



  usuarioLogado: Usuario;
  sqlSelect: Array<any>;
  sqlSelectValue: string;
  dataInicial: string = moment().subtract(1, 'days').format('DD/MM/YYYY')
  dataFinal: string = moment().add(1, 'days').format('DD/MM/YYYY')
  tableData = [];


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
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    useBom: true,
    headers: ['Post ID', 'Post title', 'Post body']
  };

  constructor(private http: Http, 
    private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  }

  async ngOnInit() {
    let sql = await this.connectHTTP.callService({
      service: 'getSQLs',
      paramsService: {
        token: this.usuarioLogado.token,
        idUsuarioLogado: this.usuarioLogado.id
      }
    });
    this.sqlSelect = sql.resposta as Array<object>;
    this.sqlSelect = this.sqlSelect.map(sql => {
      return { value: sql.id, label: sql.nome, sql:sql.sql }
    })
    this.sqlSelectValue = this.sqlSelect[0].value;

    
  };

  async executarSQL(){

    try {
      

      let sql_ = this.sqlSelect.filter(registro => {
        if (registro.value == this.sqlSelectValue) {
          return registro.sql
        }
      })
      sql_ = sql_[0].sql
      let getResultadoSQLs = await this.connectHTTP.callService({
        service: 'getResultadoSQLs',
        paramsService: {
          token: this.usuarioLogado.token,
          idUsuarioLogado: this.usuarioLogado.id,
          dataInicial: this.dataInicial,
          dataFinal: this.dataFinal,
          sql: sql_
        }
      });

      new Angular5Csv(getResultadoSQLs.resposta, 'data-table', {
        fieldSeparator: ';',
        headers: Object.keys(getResultadoSQLs.resposta[0])
      });

    }
    catch (e) {
      this.toastrService.error('Erro ao executar a SQL : ', e.error);
      this.tableData = [];
    }


  }

  

}
