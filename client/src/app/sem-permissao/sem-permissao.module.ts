import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemPermissaoComponent } from './sem-permissao.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SemPermissaoComponent],
  exports: [SemPermissaoComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SemPermissaoModule { }
