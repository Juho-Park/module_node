import axios from 'axios'

/**
 * Ref.
 * readme: https://github.com/axios/axios#table-of-contents
 * docs: https://axios-http.com/docs/intro
 * config; https://github.com/axios/axios#request-config
 * response schema; https://axios-http.com/docs/res_schema
 */
// "Access-Control-Allow-Origin": `http://localhost:3000`,
//         'Access-Control-Allow-Credentials':"true",

// const isDev = process.env.NODE_ENV == 'development'
// if (isDev) {
//     axios.defaults.withCredentials = true
//     axios.defaults.baseURL = 'http://localhost:8001'
// }

interface ResponseType { status: number, statusText: string, data: any }

function parseResponse(response: any): ResponseType {
    const { status, statusText, data, headers, config, request } = response
    return { status, statusText, data }
}
function get(url: string, config?: { params?: object }): Promise<ResponseType> {
    return axios.get(url, config).then(parseResponse)
}
function post(url: string, body?: object, config?: object): Promise<ResponseType> {
    return axios.post(url, body, config).then(parseResponse)
}
function patch(url: string, body: object, config?: object): Promise<ResponseType> {
    return axios.patch(url, body, config).then(parseResponse)
}
function formdata(url: string, body: any, config: any = {}): Promise<ResponseType> {
    let form = new FormData()
    for (const key in body) form.append(key, body[key])
    config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' }
    return post(url, form, config).then(parseResponse)
}

export default { get, post, patch, formdata }