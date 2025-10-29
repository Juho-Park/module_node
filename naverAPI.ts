'use server'

import { headers } from "next/headers"
import { redirect } from "next/navigation"

export namespace Naver {
    interface Error {
        error?: string
        error_description?: string
        // error_code?: 'KOE303' | 'KOE322' | string
    }
    export interface TokenCode extends Error {
        access_token: string // '접근 토큰, 발급 후 expires_in 파라미터에 설정된 시간(초)이 지나면 만료됨'
        refresh_token: string //'갱신 토큰, 접근 토큰이 만료될 경우 접근 토큰을 다시 발급받을 때 사용'
        token_type: 'bearer' | string // '접근 토큰의 타입으로 Bearer와 MAC의 두 가지를 지원'
        expires_in: number // '접근 토큰의 유효 기간(초 단위)'
    }
    export interface User extends Error {
        resultcode: string // API 호출 결과 코드
        message: string //호출 결과 메시지
        response: {
            id: string //'동일인 식별 정보 동일인 식별 정보는 네이버 아이디마다 고유하게 발급되는 값입니다.
            name: string //'사용자 이름'
            birthyear: string //'출생연도'
            mobile: string //'휴대전화번호'
            // nickname: string //'사용자 별명'
            // email: string //'사용자 메일 주소'
            // gender: string //'성별' - F: 여성 - M: 남성 - U: 확인불가
            // age: string //'사용자 연령대'
            // birthday: string //'사용자 생일(MM-DD 형식)'
            // profile_image: string //'사용자 프로필 사진 URL'
        }
    }
}

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

    const _clientSecret = clientSecret || ''
    return { clientID, clientSecret: _clientSecret, redirectUri: _redirect }
}

export async function authorize(type: 'signin' | 'link') {
    const { clientID, redirectUri } = await getEnv()
    const url = new URL('https://nid.naver.com/oauth2.0/authorize')
    const params = {
        response_type: 'code',
        client_id: clientID,
        redirect_uri: `${redirectUri}?type=${type}`,
        state: 'statue',
    }
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    })
    redirect(url.toString())
}

export async function getTokens(code: string): Promise<Naver.TokenCode> {
    const { clientID, clientSecret } = await getEnv()
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

// search local
export interface NaverPlace {
    title: string, // include <b></b>
    link: string,
    category: string,
    address: string,
    roadAddress: string,
    mapx: string,
    mapy: string
}
export async function searchLocal(query: string) {
    const { clientID, clientSecret } = await getEnv()
    const url = new URL('https://openapi.naver.com/v1/search/local')
    const params = { query, display: '5' }
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
    })

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "X-Naver-Client-Id": clientID,
            "X-Naver-Client-Secret": clientSecret,
        }
    })
    const body: {
        lastBuildDate: string, items: NaverPlace[]
    } = await response.json()
    // const ds = await getTypeormDs()
    // const placeRepo = ds.getRepository(Place)
    return body.items
    // .map(item => ({
    //     ...item,
    //     title: item.title.replace('<b>', '').replace('</b>', '')
    // }))
}