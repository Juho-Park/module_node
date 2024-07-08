import { cookies } from 'next/headers'
import jwt from './jwt'

export function getToken(): Types.Token | undefined {
    const _cookies = cookies()
    let token: any = _cookies.get('token')?.value
    if (token) token = jwt.decode<Types.Token>(token)
    return token
}