import { img } from '../imagens/logo_cliente';
import * as moment from 'moment';

export class ReportPDF {


    gerarPDF(titulo: any, headerDetail: any, lineDetail: any  ){

        var hoje: string =   moment().format('DD/MM/YYYY HH:mm:ss');


        var docDefinition = {
            pageSize: 'A4',
            header: {
                margin: 10,
                columns: [
                    {
                        image: 'logotipo',
                        width: 50,
                    },
                    {
                        margin: [10, 10, 5, 0],
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

                    
                   
            content: [{ margin: [0, 40, 5, 10],
                       text:  [  'teste \n', 
                                 'teste 2',

                            ]
                    },
                    {
                        margin: [0, 70, 5, 10],
                        text:  [  'teste 3', 
                                  'teste 4',
 
                             ]
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

