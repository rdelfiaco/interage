export class Usuario {
    private _login: string;
    private _id_organograma: number;
    private _id: number;
    private _senha: string;
    private _dashboard: string;
    private _ultimoLogin: Date;
    private _permissao: string;
    private _token: string;
    private _id_pessoa: number;
    private _responsavel_membro: number;

    
    public get responsavel_membro(): number {
        return this._responsavel_membro;
    }
    public set responsavel_membro(value: number) {
        this._responsavel_membro = value;
    }
    
    public get id_pessoa(): number {
        return this._id_pessoa;
    }
    public set id_pessoa(value: number) {
        this._id_pessoa = value;
    }
    
    public get token(): string {
        return this._token;
    }
    public set token(value: string) {
        this._token = value;
    }

    public get permissao(): string {
        return this._permissao;
    }
    public set permissao(value: string) {
        this._permissao = value;
    }

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

    public get id_organograma(): number {
        return this._id_organograma;
    };
    public set id_organograma(value: number) {
        this._id_organograma = value;
    };

}
