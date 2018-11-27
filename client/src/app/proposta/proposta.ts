
export class Proposta {

    private _mesReferencia: string;
    private _codigoFipe: string;
    private _marca: string;
    private _modelo: string;
    private _anoModelo: string;
    private _autenticacao: string;
    private _dataConsulta: string;
    private _precoMedio: string;

    public get mesReferencia(): string {
        return this._mesReferencia;
    }
    public set mesReferencia(value: string) {
        this._mesReferencia = value;
    }

    public get codigoFipe(): string {
        return this._codigoFipe;
    }
    public set codigoFipe(value: string) {
        this._codigoFipe = value;
    }

    public get marca(): string {
        return this._marca;
    }
    public set marca(value: string) {
        this._marca = value;
    }

    public get modelo(): string {
        return this._modelo;
    }
    public set modelo(value: string) {
        this._modelo = value;
    }

    public get anoModelo(): string {
        return this._anoModelo;
    }
    public set anoModelo(value: string) {
        this._anoModelo = value;
    }

    public get autenticacao(): string {
        return this._autenticacao;
    }
    public set autenticacao(value: string) {
        this._autenticacao = value;
    }

    public get dataConsulta(): string {
        return this._dataConsulta;
    }
    public set dataConsulta(value: string) {
        this._dataConsulta = value;
    }

    public get precoMedio(): string {
        return this._precoMedio;
    }
    public set precoMedio(value: string) {
        this._precoMedio = value;
        
    }
}