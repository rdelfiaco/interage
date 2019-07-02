import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectHTTP } from '../../../../shared/services/connectHTTP';
import { LocalStorage } from '../../../../shared/services/localStorage';
import { ToastService } from '../../../../../lib/ng-uikit-pro-standard';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-pergunta-add',
  templateUrl: './pergunta-add.component.html',
  styleUrls: ['./pergunta-add.component.scss']
})
export class PerguntaAddComponent implements OnInit {
  questId:string = ""; 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
      debugger
      this.route.params.subscribe(res => {
        debugger
        this.questId = res.id;
      });
    }

  ngOnInit() {
  }

  async salvarPergunta() {
    try {
      let nome = document.querySelector('#nome')['value'];
      let status = document.querySelector('#status input')['checked'];
      let sequencia = document.querySelector('#sequencia')['value'];
      let multi_escolha = document.querySelector('#multi_escolha input')['value'];
      let descricao = document.querySelector('#descricao')['checked'];
      let questionarioId = this.questId; 
      debugger
      let resp = await this.connectHTTP.callService({
        service: 'addPergunta',
        paramsService: { data: JSON.stringify({nome, status, sequencia, multi_escolha, descricao, questionarioId})}
      }) as any;
      if (resp.error) {
        this.toastrService.error(resp.error);
      } else {
        this.toastrService.success('Quationário salvo com sucesso');
      }
    }
    catch (e) {
      this.toastrService.error('Erro ao ler as permissoes do departamento', e);
    }
  }

  back() {

  } 
}
