import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascaraCpf'
})
export class implements PipeTransform {

  transform(v: any ): any {
    debugger

      v=v.replace(/\D/g,'') //Remove tudo o que não é dígito
      v=v.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/,"$1$2$3.$4$5$6.$7$8$9-") 

      return v
      }



}
