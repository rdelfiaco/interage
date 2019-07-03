import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConnectHTTP } from '../../../../shared/services/connectHTTP';
import { LocalStorage } from '../../../../shared/services/localStorage';
import { ToastService } from '../../../../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-resposta-add',
  templateUrl: './resposta-add.component.html',
  styleUrls: ['./resposta-add.component.scss']
})
export class RespostaAddComponent implements OnInit {
  pergId = null;
  tableData = {
    nome: '',
    status: true,
    sequencia: 0,
    proximaPerguntaId: 0
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
      debugger
      this.route.params.subscribe(res => {
        debugger
        this.pergId = res.id;
      });
    }

  ngOnInit() {
  }

  async salvarAlternativa() {
    try {
      // let nome = document.querySelector('#nome')['value'];
      // let status = document.querySelector('#status input')['checked'];
      // let sequencia = document.querySelector('#sequencia')['value'];
      let nome = this.tableData.nome;
      let status = this.tableData.status;
      let sequencia = this.tableData.sequencia;
      let proximaPerguntaId = this.tableData.proximaPerguntaId;
      let perguntaId = this.pergId;
      debugger
      let resp = await this.connectHTTP.callService({
        service: 'addAlternativa',
        paramsService: { data: JSON.stringify({
          nome,
          status,
          sequencia, 
          perguntaId,
          proximaPerguntaId,
        })}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Salvo com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
    }
  }
}
