import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.component.html',
  styleUrls: ['./questionario.component.scss']
})
export class QuestionarioComponent implements OnInit {

  tableData: object[] = [
    { id: 1,nome: "Quest. Avaliação de Pós Venda", qtde_perguntas: 5, status: 1},
    { id: 2,nome: "Questionário De Teste 5", qtde_perguntas: 3, status: 0},
    { id: 3,nome: "Questionário De Teste Pergunta abertas", qtde_perguntas: 5, status: 1},
    { id: 4,nome: "questionário teste1", qtde_perguntas: 4, status: 0},
  ];
  private sorted = false;

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  sortBy(by: string | any): void {
    this.tableData.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
  }
  openQuestionario(id: string) {
    this.router.navigate(['questionario/'+id]);
  }
}
