import { img } from '../imagens/logo_cliente';
import * as moment from 'moment';

export class ReportPDF {


    gerarPDF(titulo: any, lineDetail: any  ){
        debugger;
        var hoje: string =   moment().format('DD/MM/YYYY HH:mm:ss');

        var body = [];
        body = lineDetail;

        var docDefinition = {
            pageSize: 'A4',
            header: {
                margin: 10,
                columns: [
                    {
                        image: 'logotipo',
                        width: 50
                    },
                    {
                        margin: [10, 20, 5, 0],
                        text: titulo,
                        alignment: 'center',
                        fontSize: 12,
                        bold: true
                    }
                ]
            },
            footer:  function(currentPage, pageCount) { 
                    let texto =  `Página: ${currentPage.toString()} de  ${pageCount}            Emitido em: ${hoje} por INTERAGE CRM ` 
                    return  {text: texto ,
                             margin: 10,
                             fontSize: 8}
                    },
            content: [ 
                {   margin: [70, 70, 5, 0],
                    table: {
                            headerRows: 1,
                            withs:[ '*', 'auto', 100, '*'],
                            body: body
                        }
                    }], 
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
                ParagrafoBold: {
                    fontSize: 12,
                    bold: true
                },
                quote: {
                    italics: true
                },
                font14: {
                    fontSize: 14
                },
                small: {
                    fontSize: 8
                },
            },
            images: { logotipo: img }
        };

   

      return docDefinition;

    } ;

    
}

