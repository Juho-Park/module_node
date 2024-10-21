export function parseFormData(data: FormData): any {
    let res: any = {}
    const keys = data.keys()
    while (true) {
        const result = keys.next()
        const values = data.getAll(result.value)
        if (result.done) break

        let value
        if (values.length === 1) {
            value = values[0] === 'on' ? true : values[0]
        } else value = values
        res[result.value] = value
    }
    return res
}


