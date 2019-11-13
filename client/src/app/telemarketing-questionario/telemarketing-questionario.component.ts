import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, SimpleChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IMyOptions, MDBDatePickerComponent, ModalDirective } from '../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { Usuario } from '../login/usuario';
import { LocalStorage } from '../shared/services/localStorage';
import * as moment from 'moment';
import { MascaraTelefonePipe } from '../shared/pipes/mascaraTelefone/mascara-telefone.pipe';
import { Observable } from 'rxjs';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { img } from '../proposta/imagem';


interface selectValues {
  value: string
  label: string
}
@Component({
  selector: 'app-telemarketing-questionario',
  templateUrl: './telemarketing-questionario.component.html',
  styleUrls: ['./telemarketing-questionario.component.scss'],
  providers: [MascaraTelefonePipe]
})

export class TelemarketingQuestionarioComponent implements OnInit {
  public _pessoaObject: any;
  private _eventoObject: any;
  private _motivos_respostas: Array<object>;
  private _predicoes: Array<object>;
  predicoesFormatado: Array<object>
  private _objecoes: Array<object>;
  objecoesFormatado: Array<object>
  questionarioForm: FormGroup;
  motivosRespostasFormatado: Array<object>
  motivoRespostaSelecionado: object;
  returnProp: boolean = true;

   tzoffset = (new Date()).getTimezoneOffset() * 60000; 

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
  }
  reagendar: boolean = false;
  exige_observacao: boolean = false;
  exige_predicao: boolean = false;
  exige_objecao: boolean = false;
  exige_proposta: boolean = false;
  discando: boolean = false;
  podeGravar: boolean = false;
  quantEventosDaPessoa: number;
  corDoBotaoDiscar: string = 'danger';
  motivoAcao: Array<object>;
  proposta: object;
  abaSelecionada: Observable<number> = new Observable((observer) => {
    observer.next(1);
  });
  questId = null;
  eventoId = null;
  pessoaId = null;

  @ViewChild("dataReagendamento") datePicker: MDBDatePickerComponent;
  @ViewChild('elaborarProposta') elaborarProposta: ModalDirective;
  @ViewChild('respquestionarioModal') respquestionarioModal: ModalDirective;

  @Input() modal: any
  @Input() campanhaSelecionada: any
  @Output() clear = new EventEmitter();
  @Input() pessoa: any;
  @Input() evento: any;
  @Output() atualizaMeta = new EventEmitter();

  @Input()
  set motivos_respostas(motivos_respostas: any) {
    this._motivos_respostas = motivos_respostas;
    this.motivoAcao = motivos_respostas;
    this.motivosRespostasFormatado = motivos_respostas.sort((a, b) => {
      if (a.ordem_listagem > b.ordem_listagem) return 1;
      else if (a.ordem_listagem < b.ordem_listagem) return -1;
      else return 0;
    }).map(m => {
      return { label: m.nome, value: m.id }
    })
  }
  get motivos_respostas(): any {
    return this._motivos_respostas
  }

  @Input()
  set predicoes(predicoes: any) {
    this._predicoes = predicoes;
    this.predicoesFormatado = predicoes.map(p => {
      return { label: p.nome, value: p.id, cor: p.cor }
    })
  }

  get predicoes(): any {
    return this._predicoes
  }

  @Input()
  set objecoes(objecoes: any) {
    this._objecoes = objecoes;
    this.objecoesFormatado = objecoes.map(p => {
      return { label: p.nome, value: p.id, cor: p.cor }
    })
  }

  get objecoes(): any {
    return this._objecoes
  }

  ValidateObservacao(control: AbstractControl) {
    if (this.exige_observacao && !control.value) return { exige_observacao: true };
    else return null;
  }

  ValidateExigePredicao(control: AbstractControl) {
    if (this.exige_predicao && !control.value) return { exige_predicao: true };
    else return null;
  }

  ValidateExigeObjecao(control: AbstractControl) {
    if (this.exige_objecao && !control.value) return { exige_objecao: true };
    else return null;
  }

  ValidateReagendar(control: AbstractControl) {
    if (this.reagendar && !control.value) return { reagendar: true };
    else return null;
  }

  ValidateProposta(control: AbstractControl) {
    if (this.proposta && !Object.keys(control.value).length) return { proposta: true };
    else return null;
  }

  constructor(private formBuilder: FormBuilder,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage,
    private mascaraTelefone: MascaraTelefonePipe) {
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: ['']
    })
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["pessoa"] && this.pessoa) {
      this.pessoa.subscribe(pessoa => {
        this._pessoaObject = pessoa;
        this.pessoaId = pessoa.principal.id;
        this._pessoaObject.telefones = this._pessoaObject.telefones.map((telefone) => {
          return {
            ...telefone,
            telefoneCompleto: telefone.ddi + telefone.ddd + telefone.telefone
          }
        });
        if (this._eventoObject) this._setQuestionarioForm();
        this._buscaEventosDaPessoa();
      });
    }
    if (changes["evento"] && this.evento) {
      this.evento.subscribe(evento => {
        this._eventoObject = evento;
        this.eventoId = evento.id;
        if (this._pessoaObject) this._setQuestionarioForm();
      });
    }
  }

  async _buscaEventosDaPessoa() {
    const usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;

    let eventosPessoa = await this.connectHTTP.callService({
      service: 'getEventosLinhaDoTempo',
      paramsService: {
        id_pessoa_receptor: this._pessoaObject.principal.id
      }
    }) as any;
    this.quantEventosDaPessoa = eventosPessoa.resposta.length
  }

  _setQuestionarioForm() {
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [this._pessoaObject.principal.nome],
      telefonePrincipal: this.mascaraTelefone.transform(this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => `${telefonePrincipal.ddi}${telefonePrincipal.ddd}${telefonePrincipal.telefone}`)[0]),
      idTelefoneSelecionado: this._pessoaObject.telefones.filter(t => {
        if (t.principal)
          return true
      }).map(telefonePrincipal => telefonePrincipal.id),
      motivoRespostaSelecionado: ['', [
        Validators.required
      ]],
      observacao: ['', [this.ValidateObservacao.bind(this)]],
      data: ['', [this.ValidateReagendar.bind(this)]],
      hora: ['', [this.ValidateReagendar.bind(this)]],
      id_predicao: ['', [this.ValidateExigePredicao.bind(this)]],
      id_objecao: ['', [this.ValidateExigeObjecao.bind(this)]],
      proposta: [null, [this.ValidateProposta.bind(this)]],
      propostaJSON: ['', [this.ValidateProposta.bind(this)]]
    })

    let data = new Date();
    let date = moment().format('DD/MM/YYYY');

    this.questionarioForm.controls['data'].setValue(date);

    let hours = getHora(data);
    this.questionarioForm.controls['hora'].setValue(hours);

    function getHora(data: Date) {
      let h = data.getHours();
      if (h == 23) h = -1;
      let hora = trataTempo(h + 4 )
      let minutos = trataTempo(data.getMinutes())
      return `${hora}:${minutos}`
    }
    function trataTempo(tempo: number) {
      if (tempo.toString().length == 1) return `0${tempo}`
      return tempo;
    }
  }

  camposPreenchidos() {
    if (this.reagendar && (!this.questionarioForm.value.data || !this.questionarioForm.value.hora))
      return false;
    if (this.exige_observacao && (!this.questionarioForm.value.observacao))
      return false;
    return true;
  }

  trocaTelefonePrincipal(telefoneId: string) {
    const numTelefone = this._pessoaObject.telefones.filter((t: any) => t.id == telefoneId) as any;

    this.questionarioForm.controls['telefonePrincipal'].setValue(this.mascaraTelefone.transform(`${numTelefone[0].ddi}${numTelefone[0].ddd} ${numTelefone[0].telefone}`));
    this.questionarioForm.controls['idTelefoneSelecionado'].setValue(telefoneId);
    this.discando = false;
  }

  selecionaMotivoResposta(motivoResposta: selectValues) {
    
    const self = this;
    this.motivos_respostas.some((motivo) => {
      if (motivo.id == motivoResposta.value) {

        this.questionarioForm.controls['motivoRespostaSelecionado'].setValue(motivoResposta.value)

        if (motivo.id_questionario){
          this.questId = motivo.id_questionario;
          return this.respquestionarioModal.show();
        }

        this.reagendar = motivo.reagendar;
        this.exige_observacao = motivo.exige_observacao;
        this.exige_predicao = motivo.exige_predicao;
        this.exige_objecao = motivo.exige_objecao;
        this.exige_proposta = motivo.exige_proposta;
        self.questionarioForm.controls['observacao'].updateValueAndValidity();
        self.questionarioForm.controls['id_predicao'].updateValueAndValidity();
        self.questionarioForm.controls['id_objecao'].updateValueAndValidity();
        self.questionarioForm.controls['data'].updateValueAndValidity();
        self.questionarioForm.controls['hora'].updateValueAndValidity();
        self.questionarioForm.controls['proposta'].updateValueAndValidity();
        if (this.exige_proposta) this.elaborarProposta.show();

      }
    })
  }

  encerrouQuest(concluido) {
    this.respquestionarioModal.hide();
    if (concluido) {
      this.gravarLigacao(true);
    }
  }

  discar() {
    this.discando = true;
  }
  async gravarLigacao(respondeuQuestionario: boolean = false) {

    const usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
    let parametros = {
      id_pessoa: usuarioLogado.id_pessoa,
      id_pessoa_criou: this._eventoObject.id_pessoa_criou,
      id_evento: this._eventoObject.id,
      id_evento_pai: this._eventoObject.id_evento_pai ? this._eventoObject.id_evento_pai : this._eventoObject.id,
      id_pessoa_receptor: this._eventoObject.id_pessoa_receptor,
      id_motivo: this._eventoObject.id_motivo,
      id_motivos_respostas: this.questionarioForm.value.motivoRespostaSelecionado,
      id_telefoneDiscado: this.questionarioForm.value.idTelefoneSelecionado,
      id_predicao: this.questionarioForm.value.id_predicao,
      id_objecao: this.questionarioForm.value.id_objecao,
      id_campanha: this.campanhaSelecionada,
      observacao: this.questionarioForm.value.observacao,
      data: moment(this.questionarioForm.value.data + ' - ' + this.questionarioForm.value.hora, 'DD/MM/YYYY - hh:mm').toISOString(true),
      proposta: this.questionarioForm.value.proposta,
      respondeuQuestionario: respondeuQuestionario,
      propostaJSON: this.questionarioForm.value.propostaJSON
    }
    let metaPessoa = await this.connectHTTP.callService({
      service: 'salvarEvento',
      paramsService: parametros
    });

    this.atualizaMeta.emit(metaPessoa.resposta[0]);

    this.modal.hide()

    if (this.exige_proposta && this.questionarioForm.value.propostaJSON) {
      let docDefinition_ = JSON.parse(this.questionarioForm.value.propostaJSON.replace(/\%23/gim, '#'));
      docDefinition_.images = { logotipo: img };
      pdfMake.createPdf(docDefinition_).open()
    }
    this._limpar();
  }

  recebeProposta(proposta: any) {
    this.questionarioForm.controls['proposta'].setValue(proposta.proposta);
    this.questionarioForm.controls['propostaJSON'].setValue(proposta.propostaJSON);
    this.gravarLigacao();
  }

  _limpar() {
    this.questionarioForm = null;
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: [''],
      telefones: [''],
      telefonePrincipal: ['']
    });
    this.reagendar = false;
    this.exige_observacao = null
    this.exige_predicao = null
    this.exige_objecao = null
    this.discando = false;
    this.podeGravar = false;
    this.motivoRespostaSelecionado = null;
    this.evento = null;
    this.pessoa = null;
    this._motivos_respostas = null
    this.motivosRespostasFormatado = null;
    this.motivoRespostaSelecionado = null;
    this.clear.emit();
  }

}