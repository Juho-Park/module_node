export function parseFormData<T>(e: React.FormEvent<HTMLFormElement>): T {
    const formData = new FormData(e.currentTarget)
    let data = Object.fromEntries(formData) as T
    return data
}

