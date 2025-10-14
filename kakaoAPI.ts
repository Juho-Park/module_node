'use server'
import dayjs from "dayjs"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

declare namespace Kakao {
    interface User {
        id: bigint
        kakao_account: {
            name: string
            birthyear: string
            phone_number?: string
        }
        connected_at: string
        msg?: string
        code?: -401 | number
    }

    interface Error {
        error?: string
        error_description?: string
        error_code?: 'KOE303' | 'KOE322' | string
    }
    interface TokenByRefresh extends Error {
        access_token: string
        expires_in: number // 6 hours
        refresh_token?: string
        refresh_token_expires_in?: number
    }
    interface TokenCode extends Error {
        access_token: string
        expires_in: number // 6 hours
        refresh_token: string
        refresh_token_expires_in: number
    }
}
async function getEnv(): Promise<{ clientID: string, redirectUri: string }> {
    const headersList = await headers()
    const host = headersList.get('host')

    const { KAKAO_CLIENT_ID: clientID } = process.env
    if (!host) throw new Error('Not found host')
    else if (!clientID)
        throw new Error('Not found Kakao api configuration')

    const protocol = ['robustnuts.com', 'dev.robustnuts.com'].includes(host)
        ? 'https' : 'http'
    const _redirect = `${protocol}://${host}/auth/kakao`
    return { clientID, redirectUri: _redirect }
}

export async function authorize(type: 'guardian' | 'tutor' | 'link') {
    const { clientID, redirectUri } = await getEnv()

    if (!clientID || !redirectUri)
        throw new Error('Empty configuration for Naver login')
    const url = new URL('https://kauth.kakao.com/oauth/authorize')
    const params = {
        response_type: 'code',
        client_id: clientID,
        redirect_uri: redirectUri,
        state: type
    }
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    })
    redirect(url.toString())
}

export async function getTokens(code: string)
    : Promise<Kakao.TokenCode> {
    const { clientID, redirectUri } = await getEnv()
    const URL = 'https://kauth.kakao.com/oauth/token'

    const body = new URLSearchParams()
    body.append('grant_type', 'authorization_code')
    body.append('client_id', clientID)
    body.append('redirect_uri', redirectUri)
    body.append('code', code)

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    return response.json()
}
export async function getTokenRefreshToken(refreshToken: string,
    expireAt?: number
): Promise<Kakao.TokenByRefresh> {
    if (expireAt && dayjs().isAfter(dayjs.unix(expireAt)))
        throw Error('Expired kakao refresh token')
    const { clientID } = await getEnv()
    const URL = 'https://kauth.kakao.com/oauth/token'

    const body = new URLSearchParams()
    body.append('grant_type', 'refresh_token')
    body.append('client_id', clientID)
    body.append('refresh_token', refreshToken)

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    return response.json()
}

// async function getKakaoRefreshToken(kakaoToken: {
//     expireAt: number, refreshToken: string
// }) {
//     const { expireAt, refreshToken } = kakaoToken
//     const _kakaoToken = await kakaoApi.getTokenRefreshToken(refreshToken)
//     if (_kakaoToken.error_code === 'KOE322')
//         throw new Error('Invalid kakao refresh toekn.')
//     return refreshToken
// }

export async function getUser(accessToken: string)
    : Promise<Kakao.User | undefined> {
    const { redirectUri } = await getEnv()
    const isHttps = new URL(redirectUri).protocol === 'https:'

    const _URL = 'https://kapi.kakao.com/v2/user/me'
    const body = new URLSearchParams()
    body.append('secure_resource', `${isHttps}`) // WIP; true if https

    const resToken = await fetch(_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    let kakaoUser: Kakao.User = await resToken.json()
    if (kakaoUser.kakao_account)
        kakaoUser.kakao_account.phone_number = kakaoUser.kakao_account.phone_number?.replace('+82 ', '0')
    if (kakaoUser.code === -401) {
        console.warn(-401, kakaoUser.msg)
    } else if (kakaoUser.code) {
        console.error('Unexpected Error: ', kakaoUser.code, kakaoUser.msg)
    }
    return kakaoUser
}

interface UnlinkResponse {
    msg: string
    code: -410 | number
}
export async function unlink(accessToken: string, userId: bigint | null) {
    if (!userId) return
    const URL = 'https://kapi.kakao.com/v1/user/unlink'

    const body = new URLSearchParams()
    body.append('target_id_type', 'user_id')
    body.append('target_id', String(userId))

    const resToken = await fetch(URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    const data = await resToken.json()
    if (data.code === -401) throw new Error(data.msg)
    else console.debug(data)
    return data
}
