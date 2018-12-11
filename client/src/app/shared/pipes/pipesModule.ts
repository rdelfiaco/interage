import { NgModule } from "@angular/core";
import { MascaraTelefonePipe } from "./mascaraTelefone/mascara-telefone.pipe";
import { PlacaPipe } from "./placa/placa.pipe";
import { FormataDinheiroPipe } from "./mascaraDinheiro/formata-dinheiro.pipe";

@NgModule({
  declarations: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe
  ],
  exports: [
    MascaraTelefonePipe,
    PlacaPipe,
    FormataDinheiroPipe
  ]
})
export class PipesModule { }