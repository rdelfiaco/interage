import { Pipe, PipeTransform } from '@angular/core';
import cnpj from "../../validaCnpj"

@Pipe({
  name: 'cnpj'
})
export class CnpjPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.format(value);
  }

  format(number: string): string {
    return cnpj.format(number);
  }

  generate(formatted?: boolean): string {
    return cnpj.generate(formatted);
  }

  isValid(number: string, strict?: boolean): boolean {
    return cnpj.isValid(number, strict);
  }

  strip(number: string, strict?: boolean): string {
    return cnpj.strip(number, strict);
  }

  verifierDigit(digits: string): number {
    return cnpj.verifierDigit(digits);
  }
}
