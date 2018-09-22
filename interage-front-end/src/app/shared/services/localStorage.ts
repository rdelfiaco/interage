export class LocalStorage{

    postLocalStorage( path: string, valor: object) {
        localStorage.setItem( path, JSON.stringify(valor))
    }

    getLocalStorage(path: string): object{
       let ret = localStorage.getItem(path)
       return JSON.parse(ret)
    }

    delLocalStorage(path: string) {
        localStorage.removeItem(path)
    }

}