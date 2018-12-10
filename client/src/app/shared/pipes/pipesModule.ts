import { NgModule } from "@angular/core";
import { MascaraTelefonePipe } from "./mascaraTelefone/mascara-telefone.pipe";
import { PlacaPipe } from "./placa/placa.pipe";

@NgModule({
  declarations: [
    MascaraTelefonePipe,
    PlacaPipe
  ],
  exports: [
    MascaraTelefonePipe,
    PlacaPipe
  ]
})
export class PipesModule { }