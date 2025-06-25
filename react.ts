export function parseFormData(e: React.FormEvent<HTMLFormElement>): any {
    const formData = new FormData(e.currentTarget)
    const res: any = {}
    const keys = formData.keys()
    while (true) {
        const result = keys.next()
        if (result.done) break
        const values = formData.getAll(result.value)

        let value
        if (values.length === 1) {
            value = values[0] === 'on' ? true : values[0]
        } else value = values
        res[result.value] = value
    }
    return res
}



export default { parseFormData }