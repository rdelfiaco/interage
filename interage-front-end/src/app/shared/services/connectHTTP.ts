export class ConnectHTTP {

    callService( ) {
        const host = "http://localhost:3000/"
        const service = "login/"
        const paramsService = "user3"
        const url = `${host}${service}${paramsService}`
        const xhttp = new XMLHttpRequest()

        debugger

        xhttp.onload = function () {
            const selfXhttp = this

            debugger
            
            if (selfXhttp.status === 200) {

            console.log('ssss',  selfXhttp.responseText )

            } //else (selfXhttp.status === 500) {
            //selfXhttp.responseText
            //} 
        }

        xhttp.onerror = (e) => {
            
            
        }
        xhttp.open("GET", url, true)
        xhttp.send()

    }

}