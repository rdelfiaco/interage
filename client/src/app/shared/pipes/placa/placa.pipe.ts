import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascaraPlaca'
})
export class PlacaPipe implements PipeTransform {

  transform(placa: string, args?: any): string {
    debugger;
    placa = placa.replace(/\W/, '');
    let placaCompleta = /(^[A-Z]{3})([0-9]{4})$/gmi.exec(placa);

    if (placaCompleta) {
      return `${placaCompleta[1].toUpperCase()}-${placaCompleta[2]}`;
    }
    else return placa;
  }

}
