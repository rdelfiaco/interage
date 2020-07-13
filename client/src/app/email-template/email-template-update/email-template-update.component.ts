import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from '../email-template.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EmailTemplate } from '../email-template.model';

@Component({
  selector: 'app-email-template-update',
  templateUrl: './email-template-update.component.html',
  styleUrls: ['./email-template-update.component.scss']
})
export class EmailTemplateUpdateComponent implements OnInit {

  emailTemplatesForm: FormGroup

  idTemplateEmail: number;

  emailTemplates: EmailTemplate = {
    id: null,
    assunto: '' ,
    corpo: '',
    descricao: '',
    nome_template: ''
  };


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Digite o texto aqui',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(     
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private emailTemplateService: EmailTemplateService ) 
    { 
      this.emailTemplatesForm = this.formBuilder.group({
        htmlContent : [''],
        assunto: [''],
        descricao: [''],
        nomeTemplate: ['']
       })

       this.route.params.subscribe(res => {
        console.log('update ', res )
        this.idTemplateEmail = res.id
      });

    }
 
  async ngOnInit() {
    let resp = await this.emailTemplateService.readById(this.idTemplateEmail ) as any 
    if (resp.resposta ) {
     this.emailTemplates = resp.resposta;
     console.log(' this.emailTemplates ',  this.emailTemplates )
     this.emailTemplatesForm.controls['htmlContent'].setValue(this.emailTemplates.corpo );
     this.emailTemplatesForm.controls['assunto'].setValue(this.emailTemplates.assunto );
     this.emailTemplatesForm.controls['nomeTemplate'].setValue(this.emailTemplates.nome_template );
     this.emailTemplatesForm.controls['descricao'].setValue(this.emailTemplates.descricao );
    };
    
  } 

  gravar() {
    this.emailTemplates.corpo =  this.emailTemplatesForm.value.htmlContent;
    this.emailTemplates.assunto = this.emailTemplatesForm.value.assunto;
    this.emailTemplates.nome_template = this.emailTemplatesForm.value.nomeTemplate;
    this.emailTemplates.descricao = this.emailTemplatesForm.value.descricao;
   
    this.emailTemplateService.gravarById(this.emailTemplates)

    this.cancelar()

  }

  cancelar() {
    this.router.navigate(['/emailTampleteRead']);
  }

}
