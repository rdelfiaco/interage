import { NgModule } from "@angular/core";
import { MascaraTelefonePipe } from "./mascaraTelefone/mascara-telefone.pipe";

@NgModule({
  declarations: [
    MascaraTelefonePipe
  ],
  exports: [
    MascaraTelefonePipe
  ]
})
export class PipesModule { }