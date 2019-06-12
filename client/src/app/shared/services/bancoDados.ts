
import { LocalStorage } from "./localStorage";
import { Usuario } from "../../login/usuario";
import { ConnectHTTP } from "./connectHTTP";
import { ToastService } from "../../../lib/ng-uikit-pro-standard";

export class BancoDados
{
  localStorage: LocalStorage = new LocalStorage();
  usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;
  connectHTTP: ConnectHTTP = new ConnectHTTP;
  toastrService: ToastService;

  public async lerDados(_service: string, _paramsService: object  ){
      try {
          let resposta = await this.connectHTTP.callService({
            service: _service,
            paramsService: _paramsService
          });
          return resposta;
        }
        catch (e) {
          return {error: e };
        }
  }

  public async salvaDados(_service: string, _paramsService: object){
      try {
          let resposta = await this.connectHTTP.callService({
            service: _service,
            paramsService: _paramsService
          });
          return resposta;
      }
        catch (e) {
          return {error: e};
          }
  }
}
