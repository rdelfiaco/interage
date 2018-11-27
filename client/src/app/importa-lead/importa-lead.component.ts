import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { humanizeBytes } from 'ng-uikit-pro-standard';



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

  constructor() {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  showFiles() {
      let files = '';
      for (let i = 0; i < this.files.length; i ++) {
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
 
    console.log($event)
    debugger
    var files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      var input = $event.target;
      
      var reader = new FileReader();

      

      reader.readAsText(input.files[0], 'ISO-8859-1' );
      //new Blob([this.csv], {"type": "text/csv;charset=utf8;"});

      reader.onload = (data) => {
        
        let csvData = reader.result;
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        
        this.totalLinhas = csvRecordsArray.length;

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      }

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(';');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

        var csvRecord: CSVRecord = new CSVRecord();

        csvRecord.tipo = data[0];
        csvRecord.nome = data[1];
        csvRecord.observacoes = data[2];
        csvRecord.dtinclusao = data[3];
        csvRecord.dtalteracao = data[4];
        csvRecord.lead = data[5];
        csvRecord.origem_lead = data[6];
        csvRecord.id_origem_lead = data[7];
        csvRecord.DDD1 = data[8];
        csvRecord.FONE1 = data[9];
        csvRecord.DDD2 = data[10];
        csvRecord.FONE2 = data[11];
        csvRecord.DDD3 = data[12];
        csvRecord.FONE3 = data[13];

        dataArr.push(csvRecord);
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

}



export class CSVRecord{


  public tipo: any;
  public nome: any;
  public observacoes: any;
  public dtinclusao: any;
  public dtalteracao: any;
  public lead: any;
  public origem_lead: any;
  public id_origem_lead: any;
  public DDD1: any;
  public FONE1: any;
  public DDD2: any;
  public FONE2: any;
  public DDD3: any;
  public FONE3: any;

  constructor()
  {

  }

  
}
