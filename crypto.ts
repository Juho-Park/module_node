// https://nodejs.org/api/crypto.html

import crypto from 'crypto'

const algorithm = 'sha256'
const secretKey = process.env.KEY_LEWEIGHT

function hmac(data: string | number, key?: string) {
    const _key = key ?? secretKey
    if (!_key) throw new Error('Empty secret key')
    const _data = String(data)
    return crypto.createHmac(algorithm, _key).update(_data).digest('hex')
    // digest 'base64'
}
function hash(data: string | number) {
    const hex = crypto.createHash('SHA-1').update(String(data)).digest('hex')
    console.log(hex)
    return parseInt(hex, 16) % 1000000
    
}

export default { hmac, hash }



// const iv = crypto.randomBytes(16);

// function scryptSync() {
//     const key = crypto.scryptSync(secretKey, 'salt', 32)
//     log(key, key.toString('hex'))
// }

// function encrypt(text) {
//     const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
//     const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
//     return {
//         iv: iv.toString('hex'),
//         content: encrypted.toString('hex')
//     }
// }