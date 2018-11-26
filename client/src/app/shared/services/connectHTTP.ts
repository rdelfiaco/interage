import { LocalStorage } from "./localStorage";
import { Usuario } from "../../login/usuario";

interface optionsCallService {
  service: string
  paramsService?: object,
  host?: string,
  naoExigeToken?: boolean
}

interface retObjectCallService {
  error?: string
  resposta: object
}


export class ConnectHTTP {
  localStorage: LocalStorage = new LocalStorage();
  callService(options: optionsCallService): Promise<retObjectCallService> | retObjectCallService {
    const mensagem = this._checkOptionsCallService(options);
    if (mensagem && !mensagem.error) return mensagem;
    return new Promise((resolve, reject) => {
      //TROCA DADOS SERVIDOR
      // const host = options.host || "http://159.69.205.116:3010/" //treinamento
      // const host = options.host || "http://159.69.205.116:3000/" //Producao
      const host = options.host || "http://localhost:3010/" //Local
      const service = options.service

      let url = `${host}${service}`

      if (!options.naoExigeToken && (!options.paramsService.token || !options.paramsService.id_usuario)) {
        let usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
        options.paramsService.id_usuario = usuarioLogado.id.toString();
        options.paramsService.token = usuarioLogado.token;
      }

      if (options.paramsService) {
        const paramsService = this._trataParamsService(options.paramsService)
        url = `${url}${paramsService}`
      }
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this
        if (selfXhttp.status === 200) {
          resolve({ resposta: JSON.parse(selfXhttp.responseText) })
        } else if (selfXhttp.status === 401) {
          reject({ resposta: {}, error: selfXhttp.responseText })
        }
      }

      xhttp.onerror = (e) => {
        reject(e)
      }

      xhttp.open("GET", url, true)
      xhttp.send()
    })
  }

  _checkOptionsCallService(options): retObjectCallService {
    if (/^\//gi.exec(options.service))
      return { error: 'Retirar barra do inicio do service', resposta: {} };
  }

  _trataParamsService(paramsService: object): string {
    return "?" + Object.keys(paramsService).map((o) => {
      return `${o}=${paramsService[o]}`
    }).join('&')
  }
}