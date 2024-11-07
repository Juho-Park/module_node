/*
yarn add nodemailer
M_ID=
M_PW=
 */

const nodemailer = require('nodemailer')
// import nodemailer from 'nodemailer'

if (!process.env.M_ID || !process.env.M_PW) {
    console.error()
    process.exit(0)
}

const transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.M_ID,
        pass: process.env.M_PW
    },
    tls: {
        ciphers: 'SSLv3'
    }
})

function send(dest: string, subject: string, contents: string) {
    if (transporter === undefined) {
        console.error('mailer', 'transporter is undefined')
    } else transporter.sendMail({
        from: '"공감각" <no_reply@ggg.com>',
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

export default { send }