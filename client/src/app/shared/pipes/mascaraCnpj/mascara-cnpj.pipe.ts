import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascaraCnpj'
})
export class MascaraCnpjPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
