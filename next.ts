// import { cookies } from 'next/headers'
// import { ReadonlyURLSearchParams } from 'next/navigation'
// import jwt from './jwt'

// export function getToken(): Types.Token | undefined {
//     const _cookies = cookies()
//     let token: any = _cookies.get('token')?.value
//     if (token) token = jwt.decode<Types.Token>(token)
//     return token
// }

// export function getRemovedQueryString(searchParams: ReadonlyURLSearchParams, key: string) {
//     const currentParams = new URLSearchParams(Array.from(searchParams.entries()))
//     currentParams.delete(key)
//     return currentParams.toString()
// }
// export function getQueryString(searchParams: ReadonlyURLSearchParams, key: string, value: string) {
//     const currentParams = new URLSearchParams(Array.from(searchParams.entries()))
//     currentParams.set(key, value)
//     return currentParams.toString()
// }