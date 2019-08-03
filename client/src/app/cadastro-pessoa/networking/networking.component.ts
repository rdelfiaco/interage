import { element } from 'protractor';
import { performance } from './../../../lib/ng-uikit-pro-standard/free/utils/facade/browser';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.scss']
})
export class NetworkingComponent implements OnInit {
  
  @Output() refresh = new EventEmitter();
  @Input() pessoa: Observable<string[]>;
  _pessoaObject: any;
  relacionamentoSelecionado: boolean = false;
  usuarioLogado: any;
  private relacionamentoForm: FormGroup;
  relacionamentoFormAud: any;
  tipoTratamento: any;
  tipoTratamentoCombo: Array<object> = [];
  tipoTratamentoSelecionada: number = 1;
  crud: string;
  bntEnviar: string;
  bntEnviarColor: string;
  btnCancelarColor: string;

  tipoTratamentoVoltaCombo: Array<object> = [];
  tipoTratamentoVoltaSelecionada: number = 3;
  pessoaId: any;

  constructor(private connectHTTP: ConnectHTTP, private formBuilder: FormBuilder,
    private localStorage: LocalStorage,
    private toastrService: ToastService) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
     
    
    this.relacionamentoForm = this.formBuilder.group({
      relacionamentoId:  [''],
      pessoaReferenciaNome: [{value: '',disabled: true}],
      pessoaReferenciaId: [''],
      tipoRelacionamentos:  [this.tipoTratamentoSelecionada, [Validators.required]],
      pessoaReferenciadaNome: [{value: '',disabled: true}],
      pessoaReferenciadaId: [''],
      tipoRelacionamentosVolta: [this.tipoTratamentoVoltaSelecionada, [Validators.required]],
    });
  }

  async ngOnInit() {
    let tipoRelacionamentos = await this.connectHTTP.callService({
      service: 'getTipoRelacionamentos',
      paramsService: {}
    });
    this.tipoTratamento = tipoRelacionamentos.resposta
    this.tipoTratamento.forEach(element => {
      this.tipoTratamentoCombo.push({
        value: element.id,
        label: element.relacionamento
      });
      this.tipoTratamentoVoltaCombo.push({
        value: element.id_tipo_relacionamento_volta,
        label: element.relacionamento_volta
      })           
    });
    if (this._pessoaObject.principal.id){
      this.relacionamentoForm.controls['pessoaReferenciaNome'].setValue(this._pessoaObject.principal.nome);
      this.relacionamentoForm.controls['pessoaReferenciaId'].setValue(this._pessoaObject.principal.id);
    }
  };
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa
      });
    };
  };

  

  adicionarNovoRelacionamento(){
    this.relacionamentoSelecionado = true;
    this.crud = 'C'; // create  
    this.bntEnviar = 'Adicionar relacionamento';
    this.bntEnviarColor = 'primary';
    this.btnCancelarColor = 'danger';
    this.relacionamentoForm.controls['pessoaReferenciadaId'].setValue('');
    this.relacionamentoForm.controls['pessoaReferenciadaNome'].setValue('');
    this.relacionamentoFormAud= [];
  };

  excluirRelacionamentos(id){
    this.relacionamentoSelecionado = true;
    this.crud = 'D' // delete  
    this.bntEnviar = 'Excluir relacionamento';
    this.bntEnviarColor = 'danger';
    this.btnCancelarColor = 'primary';
    this.povoaCampos(id);
  };

  editarRelacionamentos(id){
    this.relacionamentoSelecionado = true;
    this.crud = 'U' // update  
    this.bntEnviar = 'Alterar relacionamento'
    this.bntEnviarColor = 'primary';
    this.btnCancelarColor = 'danger';
    this.povoaCampos(id)
  };


  povoaCampos(id){
    this.pessoaId = this._pessoaObject.relacionamentos.find(element => {
      if (element.id == id) return element;
    })
    this.relacionamentoForm.controls['pessoaReferenciadaId'].setValue(this.pessoaId.id_pessoa_referenciada);
    this.relacionamentoForm.controls['pessoaReferenciadaNome'].setValue(this.pessoaId.nome_pessoa_referenciada);
    this.relacionamentoForm.controls['tipoRelacionamentos'].setValue(this.pessoaId.id_relacionamento);
    this.relacionamentoForm.controls['tipoRelacionamentosVolta'].setValue(this.pessoaId.id_relacionamento_volta);
    this.relacionamentoForm.controls['relacionamentoId'].setValue(this.pessoaId.id);
    this.pessoaId = Number(this.pessoaId.id_pessoa_referenciada);
    this.relacionamentoFormAud = this.relacionamentoForm.value;
  };

  getSelectedValueRelacionamento(tipoRelacionamento){
    this.tipoTratamentoSelecionada = tipoRelacionamento.value;
    // coloca no combo somente os tipo de relacionamento referenciado na tabela tipo_relacionamento_volta
    this.tipoTratamentoVoltaCombo = [];
    this.tipoTratamento.forEach(element => {
        if (element.id == tipoRelacionamento.value) {
          this.tipoTratamentoVoltaSelecionada = element.id_tipo_relacionamento_volta;
          this.tipoTratamentoVoltaCombo.push({
            value: element.id_tipo_relacionamento_volta,
            label: element.relacionamento_volta
          });
        };
    });
    this.relacionamentoForm.controls['tipoRelacionamentosVolta'].setValue(this.tipoTratamentoVoltaSelecionada);
  }

  getSelectedValueRelacionamentoVolta(tipoRelacionamento){
    this.tipoTratamentoVoltaSelecionada = tipoRelacionamento.value
  }

  cancelarAdd() {
    this.relacionamentoSelecionado = false;
  }

  onSelectCliente(valor) {
    this.relacionamentoForm.controls['pessoaReferenciadaId'].setValue(valor.value);
    this.relacionamentoForm.controls['pessoaReferenciadaNome'].setValue(valor.label);
  }

  async salvar() {
    try {
      let resp = await this.connectHTTP.callService({
        service: 'crudRelacionamento',
        paramsService: ({
          dadosAtuais: JSON.stringify(this.relacionamentoForm.value),
          dadosAnteriores: JSON.stringify(this.relacionamentoFormAud),
          crud: this.crud
        }) 
      });
      if (resp.error) {
          this.toastrService.error('Erro ao salvar relacionamento', resp.error );
      }else
      {
        this.toastrService.success('Salvo com sucesso');
      }
    }
    catch (e) {
      console.log(e)
      this.toastrService.error('Erro ao salvar relacionamento');
    }
    this.ngOnInit();
    this.refresh.emit();
    this.relacionamentoSelecionado = false;
  }


}
