export class Usuario {
    private _login: string;
    private _idOrgonograma: number;
    private _id: number;
    private _senha: string;
    private _dashboard: string;
    private _ultimoLogin: Date;

    public get ultimoLogin(): Date {
        return this._ultimoLogin;
    }
    public set ultimoLogin(value: Date) {
        this._ultimoLogin = value;
    }
    
    public get dashboard(): string {
        return this._dashboard;
    }
    public set dashboard(value: string) {
        this._dashboard = value;
    }

    public get login(): string {
        return this._login;
    };
    public set login(value: string) {
        this._login = value;
    };

    public get senha(): string {
        return this._senha;
    };
    public set senha(value: string) {
        this._senha = value;
    };

    public get id(): number {
        return this._id;
    };
    public set id(value: number) {
        this._id = value;
    };

    public get idOrgonograma(): number {
        return this._idOrgonograma;
    };
    public set idOrgonograma(value: number) {
        this._idOrgonograma = value;
    };

}
