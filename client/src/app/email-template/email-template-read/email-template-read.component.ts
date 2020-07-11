import { EmailTemplate } from './../email-template.model';
import { EmailTemplateService } from './../email-template.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-template-read',
  templateUrl: './email-template-read.component.html',
  styleUrls: ['./email-template-read.component.scss']
})
export class EmailTemplateReadComponent implements OnInit {

  emailTemplates: EmailTemplate[];

  

  constructor(
    private emailTemplateService: EmailTemplateService,
    private router: Router ,
    private route: ActivatedRoute) 
    { 
      this.route.params.subscribe(res => {
        this.id_evento = res.id
      });
    }

  async ngOnInit() {
     let resp = await this.emailTemplateService.read() as any 
     if (resp.resposta ) {
      this.emailTemplates = resp.resposta;
      console.log(' this.emailTemplates ',  this.emailTemplates )
     };
   };
 
   pesquisar(){

   };

 


   sortBy() {

  };

  openPage(page: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(_ => {
      this.router.navigate([page]);
    }, 100);
  }


}
