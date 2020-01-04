import * as moment from 'moment';

export class Valida {

    dataIncialFinal(dtInicial:string , dtFinal: string) {
        var resultados= {
            resultado: true,
            mensagem: ""
        };
        var dtInicial_ = moment(dtInicial, "DD/MM/YYYY"); 
        var dtFinal_ = moment(dtFinal, "DD/MM/YYYY"); 
        if (dtFinal_ < dtInicial_) { 
            resultados.resultado = false; 
            resultados.mensagem = "Data final não pode ser menor que data inicial" }
            
        return resultados;
        
    }

     

}
