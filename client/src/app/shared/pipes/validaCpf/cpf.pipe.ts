import { Pipe, PipeTransform } from '@angular/core';
import cpf from '../../validaCpf';

@Pipe({
  name: 'cpf'
})
export class CpfPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.format(value);
  }

  format(number: string): string {
    return cpf.format(number);
  }

  generate(formatted?: boolean): string {
    return cpf.generate(formatted);
  }

  isValid(number: string, strict?: boolean): boolean {
    return cpf.isValid(number, strict);
  }

  strip(number: string, strict?: boolean): string {
    return cpf.strip(number, strict);
  }

  verifierDigit(digits: string): number {
    return cpf.verifierDigit(digits);
  }
}
