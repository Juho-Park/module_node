/*
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
*/

const jwt = require('jsonwebtoken')

const KEY: string = process.env.NODE_ENV === 'production' && process.env.JWT ? process.env.JWT : 'jwt key'
export function encode(json: object, key?: string): string {
    return jwt.sign(json, key ?? KEY)
}

export function decode<T>(token: string | undefined, key?: string): T | undefined {
    if (!token) return
    const decoded = jwt.verify(token, key ?? KEY)
    return decoded as T
}

export default { encode, decode }
