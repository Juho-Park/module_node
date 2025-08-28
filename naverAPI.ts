'use server'

import { headers } from "next/headers"
import { redirect } from "next/navigation"

async function getEnv(): Promise<{
    clientID: string,
    clientSecret: string,
    redirectUri: string
}> {
    const { NAVER_CLIENT_ID: clientID,
        NAVER_CLIENT_SECRET: clientSecret } = process.env
    if (!clientID)
        throw new Error('Empty configuration for Naver login')

    const headersList = await headers()
    const host = headersList.get('host')
    if (!host) throw Error('Not found host. authorize')
    const protocol = ['robustnuts.com', 'dev.robustnuts.com'].includes(host)
        ? 'https' : 'http'
    const _redirect = `${protocol}://${host}/auth/naver`

    return { clientID, clientSecret, redirectUri: _redirect }
}

export async function authorize() {
    const { clientID, redirectUri } = await getEnv()
    const url = new URL('https://nid.naver.com/oauth2.0/authorize')
    const params = {
        response_type: 'code',
        client_id: clientID,
        redirect_uri: redirectUri,
        state: 'statue',
    }
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    })
    redirect(url.toString())
}

export async function getTokens(code: string): Promise<Naver.TokenCode> {
    const { NAVER_CLIENT_ID: clientID,
        NAVER_CLIENT_SECRET: clientSecret } = process.env
    const URL = 'https://nid.naver.com/oauth2.0/token'

    const body = new URLSearchParams()
    body.append('grant_type', 'authorization_code')
    body.append('client_id', clientID)
    body.append('client_secret', clientSecret)
    body.append('code', code)
    body.append('state', 'eD3qNZ1P7U2oNbiLuM7opopI8H33G5cn6VduPBXjOgg=')

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    return response.json()
}
// WIP; error handler
export async function getUser(accessToken: string): Promise<Naver.User> {
    const URL = 'https://openapi.naver.com/v1/nid/me'
    const body = new URLSearchParams()

    const resToken = await fetch(URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
        },
        body
    })
    let naverUser: Naver.User = await resToken.json()
    // naverUser.kakao_account.phone_number = naverUser.kakao_account.phone_number?.replace('+82 ', '0')
    return naverUser
}