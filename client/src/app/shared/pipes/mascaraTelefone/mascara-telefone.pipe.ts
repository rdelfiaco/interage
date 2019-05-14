import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'mascaraTelefone'
})
export class MascaraTelefonePipe implements PipeTransform {

  transform(telefone: any, ddd?: any): any {
    if (!telefone) return null
    telefone = telefone.replace(/\W/, '');
    let testTelefoneCelularCompleto = /^([0-9]{2})([0-9]{2})([0-9]{1})([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);
    let testTelefoneCelularIncompletoSemDDI = /^([0-9]{2})([0-9]{1})([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);
    let testTelefoneCelularIncompletoSemDDDeDDI = /^([0-9]{1})([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);

    let testTelefoneFixoCompleto = /^([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);
    let testTelefoneFixoCompletoSemDDI = /^([0-9]{2})([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);
    let testTelefoneFixoCompletoSemDDIeDDD = /^([0-9]{4})([0-9]{4}$)/gmi.exec(telefone);

    if (testTelefoneCelularCompleto) {
      let t = testTelefoneCelularCompleto;
      return `+${t[1]} (${t[2]}) ${t[3]} ${t[4]}-${t[5]}`
    }
    if (testTelefoneCelularIncompletoSemDDI) {
      let t = testTelefoneCelularIncompletoSemDDI;
      return `+55 (${t[1]}) ${t[2]} ${t[3]}-${t[4]}`
    }
    if (testTelefoneCelularIncompletoSemDDDeDDI) {
      let t = testTelefoneCelularIncompletoSemDDDeDDI;
      return `+55 (${ddd || '62'}) ${t[1]} ${t[2]}-${t[3]}`
    }
    if (testTelefoneFixoCompleto) {
      let t = testTelefoneFixoCompleto;
      return `+${t[1]} (${t[2]}) ${t[3]}-${t[4]}`
    }
    if (testTelefoneFixoCompletoSemDDI) {
      let t = testTelefoneFixoCompletoSemDDI;
      return `+55 (${t[1]}) ${t[2]}-${t[3]}`
    }
    if (testTelefoneFixoCompletoSemDDIeDDD) {
      let t = testTelefoneFixoCompletoSemDDIeDDD;
      return `+55 (${ddd  || '62'}) ${t[1]}-${t[2]}`
    }
    else return telefone;
  }

}
