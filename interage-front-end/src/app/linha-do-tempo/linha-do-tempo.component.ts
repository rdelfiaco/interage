import { Component, OnInit, Input } from '@angular/core';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { ToastService } from '../../lib/ng-uikit-pro-standard';
import { LocalStorage } from '../shared/services/localStorage';

@Component({
  selector: 'app-linha-do-tempo',
  templateUrl: './linha-do-tempo.component.html',
  styleUrls: ['./linha-do-tempo.component.scss']
})
export class LinhaDoTempoComponent implements OnInit {

  private usuarioLogado: any;
  private eventosDaPessoa: any;

  @Input() pessoa: any;
  constructor(private toastrService: ToastService,
    private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as any;
  }

  async ngOnChanges() {
    if (!this.pessoa) return;
    try {
      let eventosEncontrados = await this.connectHTTP.callService({
        service: 'getEventosLinhaDoTempo',
        paramsService: {
          id_usuario: this.usuarioLogado.id,
          token: this.usuarioLogado.token,
          id_pessoa_receptor: this.pessoa.principal.id
        }
      }) as any;



      this.eventosDaPessoa = juntaEventosPaiEFilhos(eventosEncontrados.resposta, null).sort((a, b) => {
        if (new Date(a.dt_criou).getTime() > new Date(b.dt_criou).getTime()) return 1;
        else if (new Date(a.dt_criou).getTime() < new Date(b.dt_criou).getTime()) return -1;
        else return 0;
      })
      debugger;
      function juntaEventosPaiEFilhos(eventos: Array<any>, idEventoPai: string) {
        let eventosRetorno = [];
        eventos.forEach(evento => {
          if (!evento.id_evento_pai && !idEventoPai) {
            debugger;
            eventosRetorno.push({
              ...evento,
              dt_prevista_resolucao: new Date(evento.dt_prevista_resolucao),
              dt_resolvido: evento.dt_resolvido ? new Date(evento.dt_resolvido) : evento.dt_resolvido,
              dataFilhoMaisNovo: calcularDataFilhoMaisNovo(eventos, evento.id),
              eventosFilho: juntaEventosPaiEFilhos(eventos, evento.id)
            })
          }
          else if (idEventoPai === evento.id_evento_pai) {
            debugger;
            eventosRetorno.push({
              ...evento,
              dt_prevista_resolucao: new Date(evento.dt_prevista_resolucao),
              dt_resolvido: evento.dt_resolvido ? new Date(evento.dt_resolvido) : evento.dt_resolvido,
              eventosFilho: juntaEventosPaiEFilhos(eventos, evento.id)
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

    }
    catch (e) {
      debugger
      this.toastrService.error(e.error);
    }
  }

}
