// export function parseFormData<T>(e: React.FormEvent<HTMLFormElement>): T {
//     const formData = new FormData(e.currentTarget)
//     return Object.fromEntries(formData) as T
// }
export function parseFormData(e: React.FormEvent<HTMLFormElement>): any {
    const formData = new FormData(e.currentTarget)
    return Object.fromEntries(formData)
    // WIP; checkbox undefined | 'on' value as boolean
}

export default { parseFormData }