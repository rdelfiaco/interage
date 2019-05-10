import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { humanizeBytes } from 'ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';
import { ToastService } from '../../lib/ng-uikit-pro-standard';



@Component({
  selector: 'app-importa-lead',
  templateUrl: './importa-lead.component.html',
  styleUrls: ['./importa-lead.component.scss']
})

export class ImportaLeadComponent implements OnInit {

  public csvRecords: Array<any>;

  @ViewChild('fileImportInput') fileImportInput: any;

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  totalLinhas: number;
  csvRecordsArray: Array<any>;
  nomeChk: boolean = false;
  cpfChk: boolean = false;
  importar: boolean = false;
  usuarioLogado: any;
  headersRow: Array<any>;
  informacao: string;
  excluiDuplicadosChk: boolean = true;
  resultado: any;

  importando: boolean = false;


  colunaObrigatoriaAusente: string 

// layout padrão
  tituloHeadersRow= [
    "tipo_pessoa",  //obrigatorio   // 0   J or F
    "nome",         //obrigatorio   // 1   string 
    "ddd1",       //obrigatorio     // 2   number
    "fone1",      //obrigatorio     // 3  number
    "nome_lead",   // obrigatorio   // 4   string
    "id_origem_lead", // obrigatorio // 5    number
    "cpf_cnpj",       // 6           number
    "sexo",           // 7           M or F
    "dt_nascimento",  // 8         string
    "logradouro",    // 9      string 
    "numero",       // 10       string 
    "complemento",    // 11     string 
    "bairro",       // 12       string 
    "cidade",       // 13       string 
    "uf",           // 14       string 
    "cep",          // 15       number
    "email",        // 16       string 
    "ddd2",         // 17       number
    "fone2",        // 18       number
    "ddd3",         // 19       number
    "fone3",        // 20       number
    "ddd4",         // 21       number
    "fone4",        // 22       number
    "ddd5",         // 23       number
    "fone5",        // 24       number
    "observacoes",  // 25       string 
    "origem_lead",  //  26       string 
    "id_campanha"   // 27        number
     ];
     indexCorrepondente = new Array(28);
     colunasNumber = [2,3,5,6,15,16,17,18,19,20,21,22,23,24,27];
     colunasString = [0,1,4,7,8,9,10,11,12,13,14,16,25,26]; 

  constructor(private connectHTTP: ConnectHTTP, 
              private localStorage: LocalStorage,
              private toastrService: ToastService) 
              {
              this.files = [];
              this.uploadInput = new EventEmitter<UploadInput>();
              this.humanizeBytes = humanizeBytes;
              this.usuarioLogado = this.localStorage.getLocalStorage('usuarioLogado') as Usuario;  
              }

  async ngOnInit() {
 

  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i++) {
      files += this.files[i].name;
      if (!(this.files.length - 1 === i)) {
        files += ',';
      }
    }
    return files;
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'your-path-to-backend-endpoint',
      method: 'POST',
      data: { foo: 'bar' },
    };
    this.files = [];
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

    
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();
  }


  fileChangeListener($event: any): void {

        
    var text = [];
    var files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      var input = $event.target;

      var reader = new FileReader();

      reader.readAsText(input.files[0], 'ISO-8859-1');
      //new Blob([this.csv], {"type": "text/csv;charset=utf8;"});

      reader.onload = (data) => {

        let csvData = reader.result;

        let csvRecordsArray = csvData.split(/\r\n|\n/);
       

        
        this.headersRow = this.getHeaderArray(csvRecordsArray);

        if (this.validaHeader()) {

          
          this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, this.headersRow.length);
    
        } else {
           this.toastrService.error("Colunas obrigatórias ausentes: " + this.colunaObrigatoriaAusente)
            
        }
      }


      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

// verifica se o csv lido possui alguma coluna do layout padrão  
  validaHeader(){
    
    let tem: Boolean;
    this.colunaObrigatoriaAusente = '';
    for (let j = 0; j < this.tituloHeadersRow.length; j++){
      tem = false;
      for (let i = 0; i < this.headersRow.length; i++ ){
        if ((this.headersRow[i] == this.tituloHeadersRow[j])   ){
          this.indexCorrepondente[j] = i
          tem = true;
        }
      }
      if ((!tem) && ( j <= 5) ) {
      this.colunaObrigatoriaAusente = this.colunaObrigatoriaAusente + (this.tituloHeadersRow[j]) + '; '
      }
    }

    if (this.colunaObrigatoriaAusente == '' ){
      return true
    }else {
      this.colunaObrigatoriaAusente = this.colunaObrigatoriaAusente.substr(0, this.colunaObrigatoriaAusente.length - 2) 
      this.colunaObrigatoriaAusente = this.colunaObrigatoriaAusente + '.'
      return false
    }
  }




  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = [];

    let data: string = '{ ';
    
    //var csvRecord: CSVRecord = new CSVRecord();
    let csvRecord: any;

    for (let j = 1; j < csvRecordsArray.length; j++){
        if (csvRecordsArray[j].includes(';')) csvRecord = csvRecordsArray[j].split(';');
        if (csvRecordsArray[j].includes(',')) csvRecord = csvRecordsArray[j].split(',');


      // define os campos do registro
      for (let i = 0; i < this.headersRow.length; i++) {

        
        // valida as colunas 
        let index = this.indexCorrepondente.findIndex(file => file === i)

        if (index == -1) {
          this.toastrService.error(`A coluna ${this.headersRow[i]} não é compatível ` )
          return [];

        }
         if (this.colunasNumber.includes( index )  && (csvRecord[i] != '' || csvRecord[i] == null || csvRecord[i] == undefined) ) { 
         if ( !this.isNumber( csvRecord[i])){
          this.toastrService.error(`A coluna ${this.headersRow[i]} da linha ${j + 1} só pode ter caracteres numéricos` )
          return [];
         }

        }
        // 

        csvRecord[i].replace('`', ' ');

        data = data + `"${this.headersRow[i]}": "${csvRecord[i]}",  `;
      }
      data = data.substr(0, data.length - 3) 
      data = data + '}'

      var data_ = JSON.parse(data);

      dataArr.push(data_);
      data = '{';
     
    }

    // se não for para excluir só será emitido um alerta 
    if (!this.excluiDuplicadosChk){
    // verifica se tem idLeadOrigem duplicado 
      let idLeadOrigem = dataArr.map( function( elem ) {
            return elem.id_origem_lead
      });
      var duplicado = false
      var idLeadOrigemDuplicado = 0
      idLeadOrigem.forEach( function( elem, i, array ) {
        if (array.indexOf( elem ) != i) {
          idLeadOrigemDuplicado = elem
          duplicado = true;
          }
      } );

      if (duplicado) {
        this.toastrService.error(`O id_lead_Origem ${idLeadOrigemDuplicado} está duplicado` )
        return [];
      }

        // verifica se tem cpf_cnpj duplicado 
         let cpf_cnpjLeadOrigem = dataArr.map( function( elem ) {
          return elem.cpf_cnpj
      });
      duplicado = false
      let cpf_cnpjLeadOrigemDuplicado = 0
      cpf_cnpjLeadOrigem.forEach( function( elem, i, array ) {
      if (array.indexOf( elem ) != i) {
        cpf_cnpjLeadOrigemDuplicado = elem
        duplicado = true;
        }
      } );

      if (duplicado) {
      this.toastrService.error(`O CPF_CNPJ ${cpf_cnpjLeadOrigemDuplicado} está duplicado` )
      return [];
      }

  }else{
    
    var dataArr_= [] ;
    // retira os id_lead_origem duplicados 
    dataArr.forEach((item) => {
        var duplicated  = dataArr_.findIndex (redItem => {
            return item.id_origem_lead == redItem.id_origem_lead;
        }) > -1;

        if(!duplicated) {
            dataArr_.push(item);
        }
    });
    dataArr = dataArr_;
    dataArr_ = [];
        // retira os cpf_cnpj duplicados 
        dataArr.forEach((item) => {
          var duplicated  = dataArr_.findIndex(redItem => {
              return item.cpf_cnpj == redItem.cpf_cnpj;
          }) > -1;
  
          if(!duplicated) {
              dataArr_.push(item);
          }
      });
      dataArr = dataArr_;

  }

    this.totalLinhas = dataArr.length;

    this.importar = true;
  

    return dataArr;

  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {

    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    
    let headerArray = [];
    let headers: any;

    if (csvRecordsArr[0].includes(';')){
       headers = csvRecordsArr[0].split(';');
    } else if (csvRecordsArr[0].includes(',')){
         headers = csvRecordsArr[0].split(',');
    } else {
      return headerArray;
    }

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }


  importarCSV(){
    
    this.importarCSVSQL()

    //const options = { closeButton: true, actionButton: 'Action', tapToDismiss: false,  titleClass: 'blue' };
    this.toastrService.success(`Importação com sucesso!`);
    this.importar = false
  }

  
  async importarCSVSQL() {
  
    

     //this.importando = true;

    let resultado = await this.connectHTTP.sendFile({
      service: 'importaLead',
      paramsService: {
        arquivo: JSON.stringify({
                  csvHeader: this.headersRow,
                  csvLinhas: this.csvRecords
                  })
      }
    });

    

    this.resultado = resultado.resposta as Array<object>;

    console.log(this.resultado)

    // this.sleepFor(5000).then(() => {
    //   this.importando = false;
    // })

   
   

    // const options = { closeButton: true, actionButton: 'Action', tapToDismiss: false,  titleClass: 'blue' };
    // this.toastrService.success(` ${resultado.resposta}`, 'Resultado da importação!', options);
    
   // window.location.reload();

  }

  // teste de uma variavel é numerica 
  isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

  async sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}


onChangeExcluiDuplicadosChk(excluiDuplicadosChk_: any) {
  if (excluiDuplicadosChk_) {
    this.excluiDuplicadosChk = false
  } else {
    this.excluiDuplicadosChk = true
  }



}


