// yarn add jsonwebtoken @types/jsonwebtoken

import jwt from 'jsonwebtoken'
// import * as Types from 'types'

let defaultKey: string = process.env.ledance ?? (process.env.NODE_ENV ?? 'testkey')
// if (!key && !process.env.NODE_ENV) key = 'testkey'
export function encode(json: object, key?: string) {
    return jwt.sign(json, key ?? defaultKey)
}

// WIP
export function decode(token: string, key?: string) { //: Types.Object.Token {//Promise<DecodeReturn> {
    if (!token) return {}// as Types.Object.Token
    // return new Promise((resolve, reject) => {
    //     jwt.verify(token, key, (err, value) => {
    //         if (err) reject(err)
    //         resolve(value as DecodeReturn)
    //     })
    // })
    let decoded = jwt.verify(token, key ?? defaultKey)
    return decoded// as Types.Object.Token
}

export default { encode, decode }

// module.exports = { encode, decode }

// if (require.main === module) test()
// function test() {
//     multipleToken()
// }
// async function multipleToken() {
//     let token1 = encode({ abc: 'abc' }), token2

//     setTimeout(() => {
//         token2 = encode({ _abc: '_abc' })
//     }, 1000)
//     let _token1 = decode(token1)
//     log.info(_token1)

//     setTimeout(() => {
//         let _token2 = decode(token2)
//         log.info(_token2)
//     }, 1500)

// }
// function diffKey() {
//     let token = jwt.sign({ test: 'abc' }, 'key1')
//     console.log({ token })
//     let decoded = jwt.verify(token, 'key1', (err, res) => {
//         if (err) return {}
//         return res
//     })
//     console.log({ decoded, now: Date.now() })

//     decoded = jwt.verify(token, 'key1', (err, res) => {
//         if (err) return {}
//         return res
//     })
//     console.log({ decoded, now: Date.now() })
// }