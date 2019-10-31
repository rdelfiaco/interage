import { element } from 'protractor';
import { Usuario } from "../../login/usuario";
import { LocalStorage } from "./localStorage";
import { e } from "@angular/core/src/render3";



export class CheckPermissaoRecurso{

    private localStorage: LocalStorage = new LocalStorage();
    private usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;


    usuarioLocadoAcessaRecurso(recurso){
        debugger
        let permissoesUsuarioLocado = [];
        (this.usuarioLogado.permissoes || []).forEach(elem =>{
            permissoesUsuarioLocado.push(elem.id_recursos)
        });

        if (permissoesUsuarioLocado.indexOf(recurso) != -1) return true;
    }
}
 
