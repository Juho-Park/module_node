// https://nodejs.org/api/crypto.html
import crypto from 'crypto'

const algorithm = 'sha256'
const secretKey = process.env.KEY_LEWEIGHT

// Hash-based Message Authentication Code
/** @deprecated Use 'argon2' instead */
export function hmac(data: string | number, key?: string) {
    const _key = key ?? secretKey
    if (!_key) throw new Error('Empty secret key')
    const _data = String(data)
    return crypto.createHmac(algorithm, _key).update(_data).digest('hex')
}
/** @deprecated Use 'argon2' instead */
export function hash(data: string | number) {
    const hex = crypto.createHash('SHA-1').update(String(data)).digest('hex')
    return parseInt(hex, 16) % 1000000
}
