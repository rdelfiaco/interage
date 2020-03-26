
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
    private _adesao: number;
    private _descontoAdesao: number;
    private _adesaoNome: string;
    private _mensalidade: number;
    private _participacao: number;
    private _cota: number;
    private _terceiros: string;
    private _idFundoTerceiros: number;
    private _idCarroReserva: number;
    private _carroReserva: String;
    private _idApp: number;
    private _app: string;
    private _idCombustivelDesconto: number;
    private _combustivelDesconto: string; 
    private _appDescricao: string;
    private _idRastreador: number;
    private _rastreador: string;
    private _idProtecaoVidros: number;
    private _protecaoVidros: string;
    private _propostaJSON: any;
    private _idUsuario: number;
    private _idPessoaUsuario: number;
    private _idPessoaCliente: number;
    private _placa: string;
    private _renavam: string;
    private _chassi: string;
    private _n_do_motor: string;
    private _cor_veiculo: string;
    private _observacao: string;
    private _reboque: string;
    private _cotaAlterada: boolean;
    private _idStatusProposta: number;
    private _idMotivo: number;
    private _idPessoaDestinatario: number;
    private _veiculoComercial: boolean;
    private _leilaoSinistrado: boolean;
    private _portabilidade: boolean;
    private _parcelas: number;
    private _parcelasRastreador: number;
    private _rastreadorInstalacao: number;
    private _entrada: number;
    private _mensalidadeAlterada: boolean;

    public get renavam(): string {
        return this._renavam;
    }
    public set renavam(value: string) {
        this._renavam = value;
    }
    public get chassi(): string {
        return this._chassi;
    }
    public set chassi(value: string) {
        this._chassi = value;
    }
    public get n_do_motor(): string {
        return this._n_do_motor;
    }
    public set n_do_motor(value: string) {
        this._n_do_motor = value;
    }
    public get cor_veiculo(): string {
        return this._cor_veiculo;
    }
    public set cor_veiculo(value: string) {
        this._cor_veiculo = value;
    }

    public get mensalidadeAlterada(): boolean {
        return this._mensalidadeAlterada;
    }
    public set mensalidadeAlterada(value: boolean) {
        this._mensalidadeAlterada = value;
    }

    public get entrada(): number {
        return this._entrada;
    }
    public set entrada(value: number) {
        this._entrada = value;
    }

    public get rastreadorInstalacao(): number {
        return this._rastreadorInstalacao;
    }
    public set rastreadorInstalacao(value: number) {
        this._rastreadorInstalacao = value;
    }

    public get parcelasRastreador(): number {
        return this._parcelasRastreador;
    }
    public set parcelasRastreador(value: number) {
        this._parcelasRastreador = value;
    }

    public get parcelas(): number {
        return this._parcelas;
    }
    public set parcelas(value: number) {
        this._parcelas = value;
    }

    public get portabilidade(): boolean {
        return this._portabilidade;
    }
    public set portabilidade(value: boolean) {
        this._portabilidade = value;
    }

    public get veiculoComercial(): boolean {
        return this._veiculoComercial;
    }
    public set veiculoComercial(value: boolean) {
        this._veiculoComercial = value;
    }

    public get leilaoSinistrado(): boolean {
        return this._leilaoSinistrado;
    }
    public set leilaoSinistrado(value: boolean) {
        this._leilaoSinistrado = value;
    }

    public get idPessoaDestinatario(): number {
        return this._idPessoaDestinatario;
    }
    public set idPessoaDestinatario(value: number) {
        this._idPessoaDestinatario = value;
    }

    public get idMotivo(): number {
        return this._idMotivo;
    }
    public set idMotivo(value: number) {
        this._idMotivo = value;
    }

    public get idStatusProposta(): number {
        return this._idStatusProposta;
    }
    public set idStatusProposta(value: number) {
        this._idStatusProposta = value;
    }

    public get cotaAlterada(): boolean {
        return this._cotaAlterada;
    }
    public set cotaAlterada(value: boolean) {
        this._cotaAlterada = value;
    }

    public get reboque(): string {
        return this._reboque;
    }
    public set reboque(value: string) {
        this._reboque = value;
    }

    public get descontoAdesao(): number {
        return this._descontoAdesao;
    }
    public set descontoAdesao(value: number) {
        this._descontoAdesao = value;
    }
    public get protecaoVidros(): string {
        return this._protecaoVidros;
    }
    public set protecaoVidros(value: string) {
        this._protecaoVidros = value;
    }
    public get rastreador(): string {
        return this._rastreador;
    }
    public set rastreador(value: string) {
        this._rastreador = value;
    }
    public get app(): string {
        return this._app;
    }
    public set app(value: string) {
        this._app = value;
    }
    public get appDescricao(): string {
        return this._appDescricao;
    }
    public set appDescricao(value: string) {
        this._appDescricao = value;
    }
    public get carroReserva(): String {
        return this._carroReserva;
    }
    public set carroReserva(value: String) {
        this._carroReserva = value;
    }
    public get adesaoNome(): string {
        return this._adesaoNome;
    }
    public set adesaoNome(value: string) {
        this._adesaoNome = value;
    }
    public get observacao(): string {
        return this._observacao;
    }
    public set observacao(value: string) {
        this._observacao = value;
    }

    public get idPessoaUsuario(): number {
        return this._idPessoaUsuario;
    }
    public set idPessoaUsuario(value: number) {
        this._idPessoaUsuario = value;
    }
    public get placa(): string {
        return this._placa;
    }
    public set placa(value: string) {
        this._placa = value;
    }

    public get idPessoaCliente(): number {
        return this._idPessoaCliente;
    }
    public set idPessoaCliente(value: number) {
        this._idPessoaCliente = value;
    }

    public get idUsuario(): number {
        return this._idUsuario;
    }

    public set idUsuario(value: number) {
        this._idUsuario = value;
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

    public get adesao(): number {
        return this._adesao;
    }
    public set adesao(value: number) {
        this._adesao = value;
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
    public get idCombustivelDesconto(): number {
        return this._idCombustivelDesconto;
    }
    public set idCombustivelDesconto(value: number) {
        this._idCombustivelDesconto = value;
    }
    public get combustivelDesconto(): string {
        return this._combustivelDesconto;
    }
    public set combustivelDesconto(value: string) {
        this._combustivelDesconto = value;
    }

    public propostaObj(): any {
        return {
            idTipoVeiculo: this._idTipoVeiculo,
            mesReferencia: this._mesReferencia,
            codigoFipe: this._codigoFipe,
            marca: this._marca,
            modelo: this._modelo,
            anoModelo: this._anoModelo,
            autenticacao: this._autenticacao,
            dataConsulta: this._dataConsulta,
            precoMedio: this._precoMedio,
            adesao: this._adesao,
            descontoAdesao: this._descontoAdesao,
            adesaoNome: this.adesaoNome,
            mensalidade: this._mensalidade,
            participacao: this._participacao,
            cota: this._cota,
            terceiros: this._terceiros,
            idFundoTerceiros: this._idFundoTerceiros,
            idCarroReserva: this._idCarroReserva,
            carroReserva: this._carroReserva,
            idApp: this._idApp,
            app: this._app,
            appDescricao: this._appDescricao,
            idRastreador: this._idRastreador,
            rastreador: this._rastreador,
            idProtecaoVidros: this._idProtecaoVidros,
            protecaoVidros: this._protecaoVidros,
            idUsuario: this._idUsuario,
            idPessoaUsuario: this._idPessoaUsuario,
            idPessoaCliente: this._idPessoaCliente,
            placa: this._placa,
            renavam: this._renavam,
            chassi: this._chassi,
            n_do_motor: this._n_do_motor,
            cor_veiculo: this._cor_veiculo,
            observacao: this._observacao,
            reboque: this._reboque,
            cotaAlterada: this._cotaAlterada,
            idStatusProposta: this. _idStatusProposta,
            idMotivo: this._idMotivo,
            idPessoaDestinatario: this._idPessoaDestinatario,
            veiculoComercial: this._veiculoComercial,
            leilaoSinistrado: this._leilaoSinistrado,
            portabilidade: this._portabilidade,
            parcelas: this._parcelas,
            parcelasRastreador: this._parcelasRastreador,
            rastreadorInstalacao: this._rastreadorInstalacao,
            entrada: this._entrada,
            mensalidadeAlterada: this._mensalidadeAlterada, 
            idCombustivelDesconto:  this._idCombustivelDesconto,
            combustivelDesconto:  this._combustivelDesconto
        };
    }
}