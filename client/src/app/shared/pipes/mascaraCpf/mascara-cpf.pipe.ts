import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascaraCpf'
})
export class MascaraCpfPipe implements PipeTransform {

  transform(v: any ): any {
    debugger

    if (v.length > 11) { v = v.substring(v.length - 11, v.length); }

      v=v.replace(/\D/g,'') //Remove tudo o que não é dígito
      //v=v.replace('/[^0-9]/', '')
      v=v.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/,"$1$2$3.$4$5$6.$7$8$9-") 

      return v
      }



}
