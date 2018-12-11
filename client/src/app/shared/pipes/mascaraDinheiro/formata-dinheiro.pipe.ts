import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formataDinheiro'
})
export class FormataDinheiroPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return 'R$ ' + value.replace('.', ',');
  }

}
