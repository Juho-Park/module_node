const nodemailer = require("nodemailer");

if (!process.env.M_ID || !process.env.M_PW) {
    console.error(`Set Config in .env
M_ID=
M_PW=`)
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

function sendCode(dest: string, code: string) {
    if (transporter == undefined) throw Error()

    const contents = `안녕하세요.

Mixed nuts Musics 에서 인증 번호를 요청하셨습니다. 인증 번호는 [${code}]입니다.

이 인증 번호를 Mixed nuts Musics 에 입력하여 로그인하십시오.

감사합니다.`
    return transporter.sendMail({
        from: '"Mixed nuts" <gy_almond@naver.com>',
        to: dest,
        subject: `${code} : 토큰 발급 코드입니다.`,
        text: contents,
        html: `<pre>${contents}</pre>`,
    }, (err: any, info: any) => {
        if (err) throw err
        else {
            transporter.close()
        }

    });
}

export default { sendCode }