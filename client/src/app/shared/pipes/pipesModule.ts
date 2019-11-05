import { MascaraCpfPipe } from './mascaraCpf/mascara-cpf.pipe';
import { MascaraCnpjPipe } from './mascaraCnpj/mascara-cnpj.pipe';
import { NgModule } from "@angular/core";
import { MascaraTelefonePipe } from "./mascaraTelefone/mascara-telefone.pipe";
import { PlacaPipe } from "./placa/placa.pipe";
import { FormataDinheiroPipe } from "./mascaraDinheiro/formata-dinheiro.pipe";
import { CnpjPipe } from './validaCnpj/cnpj.pipe';
import { CpfPipe } from './validaCpf/cpf.pipe';

@NgModule({
  declarations: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe,
    MascaraCnpjPipe,
    MascaraCpfPipe,
    CnpjPipe,
    CpfPipe
  ],
  exports: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe,
    MascaraCnpjPipe,
    MascaraCpfPipe,
    CnpjPipe,
    CpfPipe,
  ]
})
export class PipesModule { }