/*
yarn add nodemailer
SMTP_SERVICE=
SMTP_HOST=
SMTP_PORT=
EMAIL_ID=
EMAIL_PW=
EMAIL_FROM_NAME=
EMAIL_FROM_EMAIL=
 */

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PW
    },
    secure: true,
    logger: true,
    debugger: true,
    // tls: {
    //     ciphers: 'SSLv3'
    // }
})

function send(dest: string, subject: string, contents: string) {
    if (transporter === undefined) {
        throw Error('Failed to create transporter. Check environment variables.')
    } else transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
        to: dest,
        subject,
        text: contents,
        html: `<pre>${contents}</pre>`,
    }, (err: any, info: any) => {
        if (err) throw err
        else {
            transporter.close()
        }

    });
}

export { send }