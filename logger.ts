import fs from 'fs'
// config
const minLevel = process.env.NODE_ENV === 'production' ? 2 : 1
//{ debug: 1, info: 2, warn: 3, error: 4 }
const form = '%s %s %s'
const colorForm = `%s \x1b[{color}m%s\x1b[0m %s`
const getColoredForm = (code: number) => colorForm.replace('{color}', code.toString())

const Level = {
    debug: {
        level: 1,
        label: 'DEBUG',
        color: 2    // gray
    },
    info: {
        level: 2,
        label: 'INFO',
        color: 36   // cyan
    },
    warn: {
        level: 3,
        label: 'WARN',
        color: 93   // light yellow
    },
    error: {
        level: 4,
        label: 'ERROR',
        color: 31   // red
    }
}

if (!fs.existsSync(`${process.env.PWD}/log`)) {
    console.log(getColoredForm(93), getTime(), 'INFO', 'logger', 'Made log folder.')
    fs.mkdirSync(`${process.env.PWD}/log`)
}

interface PrintProps {
    level: number,
    label: string,
    color: number
}
class Logger {
    private today = getDate()
    private label = ''
    sublabel = ''
    private file: Console
    constructor(l: string) {
        if (l) this.label = l
        this.file = new console.Console(
            fs.createWriteStream(`${process.env.PWD}/log/${this.today}.log`,
                { flags: 'a' }))
    }
    private checkDate() {
        let date = getDate()
        if (this.today === date) return
        else {
            this.today = date
            this.file = new console.Console(
                fs.createWriteStream(`${process.env.PWD}/log/${date}.log`,
                    { flags: 'a' }))
        }
    }
    private print({ level, label, color }: PrintProps, ...arg: any[]) {
        if (level < minLevel) return
        this.checkDate()
        console.log(getColoredForm(color), getTime(), label, this.label + this.sublabel, ...arg)
        this.file.log(form, getTime(), label, this.label + this.sublabel, ...arg)
    }

    debug(...arg: any[]) {
        this.print({ ...Level.debug }, ...arg)
    }
    info(...arg: any[]) {
        this.print({ ...Level.info }, ...arg)
    }
    // info(...arg) {
    //     if (minLevel > 2) return
    //     this.#checkDate()
    //     console.info(cyan, getTime(), 'INFO ', this.#label, ...arg)
    //     this.#file.info(form, getTime(), 'INFO', this.#label, ...arg)
    // }
    warn(...arg: any[]) {
        this.print({ ...Level.warn }, ...arg)
    }
    // warn(...arg) {
    //     if (minLevel > 3) return
    //     this.#checkDate()
    //     console.warn(lightYellow, getTime(), 'WARN ', this.#label, ...arg)
    //     this.#file.warn(form, getTime(), 'WARN ', this.#label, ...arg)
    // }
    err(...arg: any[]) {
        this.print({ ...Level.error }, ...arg)
    }
    // err(...arg) {
    //     this.#checkDate()
    //     console.error(red, getTime(), 'ERROR', this.#label, ...arg)
    //     this.#file.error(form, getTime(), 'ERROR', this.#label, ...arg)
    // }
}
function getDate() {
    let _date = new Date()
    let year = String(_date.getFullYear() % 100)
    let month = String(_date.getMonth())
    let date = String(_date.getDate())
    return [year, month, date].map(e => e.padStart(2, '0')).join('_')
}
function getTime() {
    let date = new Date()
    let hour = String(date.getHours())
    let minute = String(date.getMinutes())
    let second = String(date.getSeconds())
    return [hour, minute, second].map(e => e.padStart(2, '0')).join(':')
}

export default Logger