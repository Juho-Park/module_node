/*
yarn add nodemailer
M_ID=
M_PW=
 */

const nodemailer = require('nodemailer')
// import nodemailer from 'nodemailer'

if (!process.env.M_NAVER_ID || !process.env.M_NAVER_PW) {
    console.error('nodemailer 이메일 발송 기능을 사용하려면 환경 변수들을 .env 파일에 설정해야 합니다.')
    process.exit(0)
}

const transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.M_NAVER_ID,
        pass: process.env.M_NAVER_PW
    },
    logger: true,
    debugger: true,
    // tls: {
    //     ciphers: 'SSLv3'
    // }
})

function send(dest: string, subject: string, contents: string) {
    if (transporter === undefined) {
        console.error('mailer', 'transporter is undefined')
    } else transporter.sendMail({
        from: '"견고한 열매" <no_reply@robustnuts.com>',
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