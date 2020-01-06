import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../../../lib/ng-uikit-pro-standard';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';

@Component({
  selector: 'app-linha-do-tempo-evento',
  templateUrl: './linha-do-tempo-evento.component.html',
  styleUrls: ['./linha-do-tempo-evento.component.scss']
})
export class LinhaDoTempoEventoComponent implements OnInit {
  private usuarioLogado: any;
  eventosDaPessoa: any;
  eventoSelecionado: any;
  @Input() pessoa: any;
  @Input() evento: any;


  constructor(private toastrService: ToastService,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  ngOnInit() {
  }

  setEventoSelecionado(eventoSelecionado: any) {
    if (this.eventoSelecionado && this.eventoSelecionado.id === eventoSelecionado.id) this.eventoSelecionado = null;
    else this.eventoSelecionado = eventoSelecionado;


  }

  async ngOnChanges() {
    console.log('LinhaDoTempoEventoComponent', this.pessoa )
    console.log('this.idEvento', this.evento.id)
    if (!this.pessoa) return;
    try {
      let eventosEncontrados = await this.connectHTTP.callService({
        service: 'getEventosLinhaDoTempo',
        paramsService: {
          id_pessoa_receptor: this.pessoa.principal.id,
          id_evento: this.evento.id
        }
      }) as any;


      const ordenaEventos = (eventos: Array<any>): Array<any> => {
        if (eventos && eventos.length)
          return eventos.sort((a, b) => {
            if (new Date(a.dt_criou).getTime() > new Date(b.dt_criou).getTime()) return 1;
            else if (new Date(a.dt_criou).getTime() < new Date(b.dt_criou).getTime()) return -1;
            else return 0;
          })
        return eventos;
      }

      const juntaEventosPaiEFilhos = (eventos: Array<any>, idEventoPai: string) => {
        let eventosRetorno = [];
        eventos.forEach(evento => {
          if (!evento.id_evento_pai && !idEventoPai) {
            eventosRetorno.push({
              ...evento,
              dt_prevista_resolucao: new Date(evento.dt_prevista_resolucao),
              dt_resolvido: evento.dt_resolvido ? new Date(evento.dt_resolvido) : evento.dt_resolvido,
              dataFilhoMaisNovo: calcularDataFilhoMaisNovo(eventos, evento.id),
              eventosFilho: ordenaEventos(juntaEventosPaiEFilhos(eventos, evento.id))
            })
          }
          else if (idEventoPai === evento.id_evento_pai) {
            eventosRetorno.push({
              ...evento,
              dt_prevista_resolucao: new Date(evento.dt_prevista_resolucao),
              dt_resolvido: evento.dt_resolvido ? new Date(evento.dt_resolvido) : evento.dt_resolvido,
              eventosFilho: ordenaEventos(juntaEventosPaiEFilhos(eventos, evento.id))
            })
          }
          else return;
        });
        return eventosRetorno.length && eventosRetorno || null;

        function calcularDataFilhoMaisNovo(eventos: Array<any>, idEventoPai: string): Date {
          let maiorData: Date;

          eventos.forEach(evento => {
            if (idEventoPai === evento.id_evento_pai) {
              let dt_resolvido = evento.dt_resolvido ? new Date(evento.dt_resolvido) : evento.dt_resolvido;
              let dt_prevista_resolucao = new Date(evento.dt_prevista_resolucao);

              if (!maiorData)
                maiorData = dt_resolvido || dt_prevista_resolucao;
              else if (dt_resolvido && maiorData.getTime() < dt_resolvido.getTime())
                maiorData = dt_resolvido;
              else if (dt_prevista_resolucao && maiorData.getTime() < dt_prevista_resolucao.getTime())
                maiorData = dt_prevista_resolucao;
            }
          });
          return maiorData;
        }
      }
      console.log(eventosEncontrados.resposta);
      this.eventosDaPessoa = ordenaEventos(juntaEventosPaiEFilhos(eventosEncontrados.resposta, null));
    }
    catch (e) {
      this.toastrService.error(e.error);
    }
  }

}
