//const mailer = require("nodemailer");

function sendEmail(req, res){
    return new Promise( async function (resolve, reject) {

        console.log('req ', req )

        // let transport = mailer.createTransport({
        //     host: "SMTP.office365.com",
        //     port: '587',
        //     secure: false,
        //     auth: {
        //         user: "suporteinterage@outlook.com",
        //         pass: "atitude05"
        //     },
        //     from: "ronaldo <suporteinterage@outlook.com>" 
        // })

        // transport.sendMail({
        //     from: "ronaldo <suporteinterage@outlook.com>" ,
        //     to: "ronaldo.delfiaco@ueg.br",
        //     subject: "teste",
        //     text: "Teste",
        //     html: "teste 2 "
        // }).then(message => {
        //     resolve( message )
        // }).catch(err =>{
        //     console.log("email err ", err)
        //     reject( err )
        // })


    });
};

module.exports = {  sendEmail }
