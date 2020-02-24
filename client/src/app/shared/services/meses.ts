import * as moment from 'moment';
import { isAbsolute } from 'path';



export class Meses{

    public mesesAbreviados() {
        return ['jan', 'fev', 'mar', 'abr', 'maio', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    }

    public mesesNumeros(){
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    }
    

    public UltimosMeses( qutdeMeses: number = 12, mesInical = Number( moment().format('MM') ) ){
        var ultimosMesesAbreviados: Array<any>;
        var ultimosMesesNumeros: Array<any>;
        ultimosMesesNumeros = []; 
        ultimosMesesAbreviados = [];
        var i = 0;
        while (i != qutdeMeses ){
            ultimosMesesAbreviados.push(this.mesesAbreviados()[ Math.abs( mesInical - 1 ) ]);
            ultimosMesesNumeros.push( this.mesesNumeros()[Math.abs( mesInical - 1 )])
            mesInical = mesInical - 1;
            i++; 
            if (mesInical == 0 ) mesInical = 12;
        }
        return {ultimosMesesAbreviados: ultimosMesesAbreviados , ultimosMesesNumeros: ultimosMesesNumeros }  
    }
}