import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { humanizeBytes } from 'ng-uikit-pro-standard';
import { ConnectHTTP } from '../shared/services/connectHTTP';
import { LocalStorage } from '../shared/services/localStorage';
import { Usuario } from '../login/usuario';



@Component({
  selector: 'app-importa-lead',
  templateUrl: './importa-lead.component.html',
  styleUrls: ['./importa-lead.component.scss']
})

export class ImportaLeadComponent implements OnInit {

  public csvRecords: any[] = [];

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

  tituloHeadersRow= [
    "tipo_pessoa",
     "cpf",
     "nome",
     "email",
     "observacoes",
     "rua",
     "complemento",
     "bairro",
     "cidade",
     "uf",
     "cep",
     "ddd1",
     "fone1",
     "ddd2",
     "fone2",
     "ddd3",
     "fone3",
     "origem_lead",
     "id_origem_lead",
     ];

  constructor(private connectHTTP: ConnectHTTP, 
    private localStorage: LocalStorage) {
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

        if (this.temHeader()) {
          this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, this.headersRow.length);
          
          this.importar = this.testaIncosistencias(csvRecordsArray)
    
        } else {
            this.informacao = "O arquivo não possui header compatível"
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

  temHeader(){
    let qtdeHeaderIquais: number = 0
    for (let i = 0; i < this.headersRow.length; i++ ){
      for (let j = 0; j < this.tituloHeadersRow.length; j++){
        if (this.headersRow[i] == this.tituloHeadersRow[j]){
          qtdeHeaderIquais++;
        }
      }
    }
    if (qtdeHeaderIquais > 0){
      return true
    }else {
      return false
    }
  }

  testaIncosistencias(csvRecordsArray: any){


    return true;
  }


  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(';');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

         var csvRecord: CSVRecord = new CSVRecord();
        csvRecord.id_pessoa= 0;
        csvRecord.tipo_pessoa= data[0];
        csvRecord.cpf= data[1];
        csvRecord.nome= data[2];
        csvRecord.email= data[3];
        csvRecord.observacoes= data[4];
        csvRecord.rua= data[5];
        csvRecord.complemento= data[6];
        csvRecord.bairro= data[7];
        csvRecord.cidade= data[8];
        csvRecord.uf= data[9];
        csvRecord.cep= data[10];
        csvRecord.ddd1= data[11];
        csvRecord.fone1= data[12];
        csvRecord.ddd2= data[13];
        csvRecord.fone2= data[14];
        csvRecord.ddd3= data[15];
        csvRecord.fone3= data[16];
        csvRecord.origem_lead= data[17];
        csvRecord.id_origem_lead= data[18];
        
        // var csvRecord: string;
        // let csvRecord_: string;
        // for (let j = 0; j < this.tituloHeadersRow.length ; j++){
        //   if (this.headersRow.indexOf(this.tituloHeadersRow[j]) > 0 ){
        //     csvRecord_ =  `csvRecord.${this.tituloHeadersRow[j]}`
        //     csvRecord_ =  csvRecord_ + ":" + data[this.headersRow.indexOf(this.tituloHeadersRow[j]) ] 
        //   }
        // }


        dataArr.push(csvRecord);
        this.totalLinhas = i
      }
      
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {

    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(';');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

  async importarCSV() {
  
    var arquivo = this.files[0] as any;
    let resultado = await this.connectHTTP.sendFile({
      service: 'api/uploadFile',
      paramsService: {
        arquivo: this.csvRecords
      }
    });

    console.log('resulatado da importação', resultado.resposta)
    // colar alerta 


  }

}



export class CSVRecord {

 public id_pessoa: any;
 public tipo_pessoa: any; 
 public cpf: any;
 public nome: any;
 public email: any;
 public observacoes: any;
 public rua: any;
 public complemento: any;
 public bairro: any;
 public cidade: any;
 public uf: any;
 public cep: any;
 public ddd1: any;
 public fone1: any;
 public ddd2: any;
 public fone2: any;
 public ddd3: any;
 public fone3: any;
 public origem_lead: any;
 public id_origem_lead: any;
 
  constructor() {

  }


}

