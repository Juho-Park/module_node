import argon2 from 'argon2'

export async function hash(password: string) {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 5,
        parallelism: 1
    })
}
export async function verify(hash: string, password: string) {
    return argon2.verify(hash, password)
}
