import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Param = 'login'
export const useSearchParamsControl = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const toHref = (params: URLSearchParams) => {
        const query = params.toString()
        return query ? `${pathname}?${query}` : pathname
    }
    const size = () => {
        const params = new URLSearchParams(searchParams)
        return params.size
    }
    const get = (name: Param) => {
        const params = new URLSearchParams(searchParams)
        return params.get(name) ?? ''
    }
    const set = (name: Param, value: string, history: boolean = false) => {
        const params = new URLSearchParams(searchParams)
        params.set(name, value)
        if (history) router.push(toHref(params), { scroll: false })
        else router.replace(toHref(params), { scroll: false })
    }
    const setList = (params: { name: string, value: string }[]) => {
        const _params = new URLSearchParams(searchParams)
        params.forEach(p => _params.set(p.name, p.value))
        router.replace(toHref(_params))
    }
    const toggleArray = (name: Param, value: string) => {
        const params = new URLSearchParams(searchParams)
        const encodedValues = params.get(name)
        const _values = encodedValues ? atob(encodedValues).split(',') : []
        if (_values?.includes(value)) { // if selected
            const newValues = _values.filter(v => v !== value)
            params.set(name, arrayToBase64(newValues))
        } else { // if new value
            params.set(name, arrayToBase64([..._values, value]))
        }
        router.replace(toHref(params))
    }
    const _delete = (name: Param) => {
        const params = new URLSearchParams(searchParams)
        params.delete(name)
        router.replace(toHref(params), { scroll: false })
    }

    const arrayToBase64 = (values: string[]) => btoa(values.join(','))
    const base64ToArray = (value: string) => atob(value).split(',')
    return { size, get, set, setList, toggleArray, delete: _delete }
}
