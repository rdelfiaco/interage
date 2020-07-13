import { EmailTemplate } from './../email-template.model';
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailTemplateService } from '../email-template.service';

@Component({
  selector: 'app-email-template-create',
  templateUrl: './email-template-create.component.html',
  styleUrls: ['./email-template-create.component.scss']
})
export class EmailTemplateCreateComponent implements OnInit {

  emailTemplatesForm: FormGroup

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
    private emailTemplateService: EmailTemplateService ) 
    { 
      this.emailTemplatesForm = this.formBuilder.group({
        htmlContent : [''],
        assunto: [''],
        descricao: [''],
        nomeTemplate: ['']
       })
    }
 
  ngOnInit() {
  } 

  gravar() {
    this.emailTemplates.corpo =  this.emailTemplatesForm.value.htmlContent;
    this.emailTemplates.assunto = this.emailTemplatesForm.value.assunto;
    this.emailTemplates.nome_template = this.emailTemplatesForm.value.nomeTemplate;
    this.emailTemplates.descricao = this.emailTemplatesForm.value.descricao;
   
    this.emailTemplateService.gravar(this.emailTemplates)

    this.cancelar()

  }

  cancelar() {
    this.router.navigate(['/emailTampleteRead']);
  }

}
