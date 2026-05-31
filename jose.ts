import { jwtVerify, SignJWT, JWTPayload } from 'jose'

const KEY = process.env.KEY
function sign(json: JWTPayload, opt: { key?: string, exp?: string | number, alg?: 'HS256' | 'RS256' }) {
    if (!opt.key) opt.key = KEY
    if (!opt.key) throw new Error('KEY is not defined')
    if (!opt.exp) opt.exp = '7d'
    if (!opt.alg) opt.alg = 'HS256'
    return new SignJWT(json)
        .setProtectedHeader({ alg: opt.alg })
        .setIssuedAt()
        .setExpirationTime(opt.exp)
        .sign(new TextEncoder().encode(opt.key))
}
async function verify<T>(token: string | undefined, opt: { key?: string } = {})
    : Promise<T | undefined> {
    if (!token) return undefined
    if (!opt.key) opt.key = KEY
    const { payload } = await jwtVerify(token, new TextEncoder().encode(opt.key))
    return payload as T
}

export default { sign, verify }
