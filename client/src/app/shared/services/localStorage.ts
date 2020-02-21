export class LocalStorage {

  postLocalStorage(path: string, valor: object | Date | string) {
    if (valor instanceof Date)
      localStorage.setItem(`${path}_date`, valor.toString())
    else if (typeof valor === 'object')
      localStorage.setItem(`${path}_object`, JSON.stringify(valor))
    else
      localStorage.setItem(`${path}_string`, valor)
  }

  getLocalStorage(path: string): object | Date | string {
    let retDate = localStorage.getItem(`${path}_date`)
    if (retDate)
      return new Date(retDate);

    let retObject = localStorage.getItem(`${path}_object`)
    if (retObject)
      return JSON.parse(retObject)
    return localStorage.getItem(`${path}_string`)
  }

 

  delLocalStorage(path: string, valor: string) {
    if (valor == 'date')
      localStorage.removeItem(`${path}_date`)
    else if (valor == 'object')
      localStorage.removeItem(`${path}_object`)
    else
      localStorage.removeItem(`${path}_string`)
  }

}