
export class Proposta {

    private _idTipoVeiculo: number;
    private _mesReferencia: string;
    private _codigoFipe: string;
    private _marca: string;
    private _modelo: string;
    private _anoModelo: string;
    private _autenticacao: string;
    private _dataConsulta: string;
    private _precoMedio: string;
    private _adesão: number;
    private _mensalidade: number;
    private _participacao: number;
    private _cota: number;
    private _terceiros: string;
    private _idFundoTerceiros: number;
    private _idCarroReserva: number;
    private _idApp: number;
    private _idRastreador: number;
    private _idProtecaoVidros: number;
    private _propostaJSON: any;
    private _idPessoaUsuario: number;
    private _idPessoaCliente: number;
    
    public get idPessoaCliente(): number {
        return this._idPessoaCliente;
    }
    public set idPessoaCliente(value: number) {
        this._idPessoaCliente = value;
    }

    public get idPessoaUsuario(): number {
        return this._idPessoaUsuario;
    }
    
    public set idPessoaUsuario(value: number) {
        this._idPessoaUsuario = value;
    }

    public get propostaJSON(): any {
        return this._propostaJSON;
    }
    public set propostaJSON(value: any) {
        this._propostaJSON = value;
    }

    public get idProtecaoVidros(): number {
        return this._idProtecaoVidros;
    }
    public set idProtecaoVidros(value: number) {
        this._idProtecaoVidros = value;
    }

    public get cota(): number {
        return this._cota;
    }
    public set cota(value: number) {
        this._cota = value;
    }
    
    public get idRastreador(): number {
        return this._idRastreador;
    }
    public set idRastreador(value: number) {
        this._idRastreador = value;
    }

    public get idApp(): number {
        return this._idApp;
    }

    public set idApp(value: number) {
        this._idApp = value;
    }

    public get idCarroReserva(): number {
        return this._idCarroReserva;
    }

    public set idCarroReserva(value: number) {
        this._idCarroReserva = value;
    }

    public get idFundoTerceiros(): number {
        return this._idFundoTerceiros;
    }
    public set idFundoTerceiros(value: number) {
        this._idFundoTerceiros = value;
    }

    public get idTipoVeiculo(): number {
        return this._idTipoVeiculo;
    }
    public set idTipoVeiculo(value: number) {
        this._idTipoVeiculo = value;
    }
    
    public get terceiros(): string {
        return this._terceiros;
    }
    public set terceiros(value: string) {
        this._terceiros = value;
    }

    public get participacao(): number {
        return this._participacao;
    }
    public set participacao(value: number) {
        this._participacao = value;
    }

    public get mensalidade(): number {
        return this._mensalidade;
    }
    public set mensalidade(value: number) {
        this._mensalidade = value;
    }
   
    public get adesão(): number {
        return this._adesão;
    }
    public set adesão(value: number) {
        this._adesão = value;
    }

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