import crypto from 'crypto'

// const algorithm = 'aes-256-ctr'
const algorithm = 'sha256'
const secretKey = process.env.NEXT_PUBLIC_LEWEIGHT

export function hmac(text: string, key: string) {
    return crypto.createHmac(algorithm, key).update(text).digest('base64')
}



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