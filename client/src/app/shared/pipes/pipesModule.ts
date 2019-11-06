import { NgModule } from "@angular/core";
import { MascaraTelefonePipe } from "./mascaraTelefone/mascara-telefone.pipe";
import { PlacaPipe } from "./placa/placa.pipe";
import { FormataDinheiroPipe } from "./mascaraDinheiro/formata-dinheiro.pipe";
import { CnpjPipe } from "./validaCnpj/cnpj.pipe";
import { CpfPipe } from "./validaCpf/cpf.pipe";

@NgModule({
  declarations: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe,
    CnpjPipe,
    CpfPipe
  ],
  exports: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe,
    CnpjPipe,
    CpfPipe
  ]
})
export class PipesModule { }