import { useRouter, useSearchParams } from 'next/navigation'

export const useSearchParamsControl = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const size = () => {
        const params = new URLSearchParams(searchParams)
        return params.size
    }
    const get = (name: string) => {
        const params = new URLSearchParams(searchParams)
        return params.get(name) ?? ''
    }
    // const has = (name: string, value: string) => {
    //     const params = new URLSearchParams(searchParams)
    //     const values = params.getAll(name)
    //     console.log(values, values.includes(value))
    //     return false
    // }
    const set = (name: string, value: string, history: boolean = false) => {
        const params = new URLSearchParams(searchParams)
        params.set(name, value)
        if (history) router.push(`?${params.toString()}`, { scroll: false })
        else router.replace(`?${params.toString()}`, { scroll: false })
    }
    const setList = (params: { name: string, value: string }[]) => {
        const _params = new URLSearchParams(searchParams)
        params.forEach(p => _params.set(p.name, p.value))
        router.replace(`?${_params.toString()}`)
    }
    const toggleArray = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        const encodedValues = params.get(name)
        const _values = encodedValues ? atob(encodedValues).split(',') : []
        if (_values?.includes(value)) { // if selected
            const newValues = _values.filter(v => v !== value)
            params.set(name, arrayToBase64(newValues))
        } else { // if new value
            params.set(name, arrayToBase64([..._values, value]))
        }
        router.replace(`?${params.toString()}`)
    }
    const _delete = (name: string) => {
        const params = new URLSearchParams(searchParams)
        params.delete(name)
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    const arrayToBase64 = (values: string[]) => btoa(values.join(','))
    const base64ToArray = (value: string) => atob(value).split(',')
    return { size, get, set, setList, toggleArray, delete: _delete }
}


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