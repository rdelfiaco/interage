import { Component, OnInit } from '@angular/core';
import { ConnectHTTP } from '../../shared/services/connectHTTP';
import { LocalStorage } from '../../shared/services/localStorage';
import { Usuario } from '../../login/usuario';
import { img } from '../imagem';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-propostas-enviadas',
  templateUrl: './propostas-enviadas.component.html',
  styleUrls: ['./propostas-enviadas.component.scss']
})
export class PropostasEnviadasComponent implements OnInit {
  propostas: any;
  usuarioLogado: any;

  constructor(private connectHTTP: ConnectHTTP,
    private localStorage: LocalStorage) {
    this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  async ngOnInit() {
    let propostas = await this.connectHTTP.callService({
      service: 'getPropostasDoUsuario',
      paramsService: {
        id_usuario: this.usuarioLogado.id
      }
    }) as any;
    this.propostas = propostas.resposta.map(p => {
      let propostaPDF = JSON.parse(p.proposta_json.replace(/\%23/gim, '#'));
      propostaPDF.images = { logotipo: img }
      return {
        ...p,
        propostaPDF
      }
    });
  }

  openPDF(docDefinition) {
    pdfMake.createPdf(docDefinition).open()
  }
}
