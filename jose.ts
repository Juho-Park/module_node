import { jwtVerify, SignJWT, JWTPayload } from 'jose'

const KEY = process.env.KEY
function sign(json: JWTPayload, key?: string) {
    return new SignJWT(json)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(key ?? KEY))
}
async function verify<T>(token: string, key?: string)
    : Promise<T | undefined> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(key ?? KEY))
    return payload as T
}

export default { sign, verify }