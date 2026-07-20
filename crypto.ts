// https://nodejs.org/api/crypto.html
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import crypto from 'crypto'

export function hash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`; // 솔트와 해시를 함께 저장
}
export function verify(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const matchBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, matchBuffer); // 타이밍 공격 방지 비교
}
export function generateRandomString(length: number = 6): string {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex") // 16진수 문자열로 변환
    .slice(0, length);
}

const algorithm = 'sha256'
const secretKey = process.env.KEY_LEWEIGHT
// Hash-based Message Authentication Code
/** @deprecated Use 'argon2' instead */
export function _hmac(data: string | number, key?: string) {
    const _key = key ?? secretKey
    if (!_key) throw new Error('Empty secret key')
    const _data = String(data)
    return crypto.createHmac(algorithm, _key).update(_data).digest('hex')
}
/** @deprecated Use 'argon2' instead */
export function _hash(data: string | number) {
    const hex = crypto.createHash('SHA-1').update(String(data)).digest('hex')
    return parseInt(hex, 16) % 1000000
}