export class ConnectHTTP {

  callService(): object {
    return new Promise((resolve, reject) => {
      const host = "http://localhost:3000/"
      const service = "login/"
      const paramsService = "user3"
      const url = `${host}${service}${paramsService}`
      const xhttp = new XMLHttpRequest()

      xhttp.onload = function () {
        const selfXhttp = this

        if (selfXhttp.status === 200) {
          resolve(JSON.parse(selfXhttp.responseText))
        } else if (selfXhttp.status === 500) {
          reject(JSON.parse(selfXhttp.responseText))
        }
      }

      xhttp.onerror = (e) => {
        reject(e)
      }

      xhttp.open("GET", url, true)
      xhttp.send()
    })
  }
}