export function parseFormData<T>(e: React.FormEvent<HTMLFormElement>): T {
    const formData = new FormData(e.currentTarget)
    return Object.fromEntries(formData) as T
}


export default { parseFormData }