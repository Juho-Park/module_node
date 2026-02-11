'use server'
import { Client } from "@upstash/qstash"
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs"

declare global {
    var __qstashClient: Client | undefined
}

function createClient() {
    const token = process.env.QSTASH_TOKEN
    if (!token) {
        throw new Error("QSTASH_TOKEN is not defined")
    }
    const client = new Client({ token })
    global.__qstashClient = client
    return client
}

const client: Client = global.__qstashClient ?? createClient()

const baseUrl = process.env.BASEURL
type publishParams<T> = {
    url: string,
    body: T,
    deduplicationId?: string
}
export async function publish<T>({ url, body, deduplicationId }: publishParams<T>) {
    if (!baseUrl) throw new Error('BASEURL is not defined')
    else if (baseUrl === 'http://localhost:3000') {
        console.warn('QStash publish skipped in localhost')
        return
    }
    const _url = baseUrl + url
    return client.publishJSON({
        url: _url,
        body,
        delay: 5,
        deduplicationId,
    })
}

export function verifyQstash(handler: any) {
    if (process.env.NODE_ENV === 'development') return handler
    return verifySignatureAppRouter(handler)
}
