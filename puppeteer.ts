import pp from 'puppeteer'


export default { }


// class Controller {
//     constructor() {
//         this.browser
//         this.page
//     }
//     async init(url = undefined, visible = false) {
//         this.browser = await puppeteer.launch({
//             headless: !visible,
//         })
//         this.page = await this.browser.newPage()
//         if (url) {
//             await this.page.goto(url)
//             await this.page.waitForTimeout(2 * 1000)
//         }
//     }
//     async goto(url) {
//         await this.page.goto(url)
//         await this.page.waitForTimeout(1 * 1000)
//     }
//     async querySelectorAll(func, ...args) {
//         return await this.page.evaluate(func, ...args)
//     }
//     async wait(second) {
//         await this.page.waitForTimeout(second * 1000)
//     }
//     async waitSelector(query) {
//         await this.page.waitForSelector(query)
//     }
//     async focus(query) {
//         await this.page.focus(query)
//     }
//     async click(query) {
//         await this.page.click(query)
//     }
//     async clickXpath(xpath) {
//         let [element] = await this.page.$x(xpath)
//         if (element) await element.click()
//         else console.log('not found', xpath)
//     }
//     async input(query, text) {
//         await this.page.focus(query)
//         await this.page.keyboard.type(text)
//     }
//     async enter() {
//         await this.page.keyboard.press('Enter')
//     }
//     async scrollDown(point = 425) {
//         await this.page.evaluate((point) => {
//             window.scrollTo(0, window.scrollY + point)
//         }, point)
//     }
//     async scrollEnd() {
//         await this.page.evaluate(async () => {
//             let height = 0
//             let heightCurrent = document.documentElement.scrollHeight
//             while (height !== heightCurrent) {
//                 window.scrollTo(0, heightCurrent)
//                 await new Promise(resolve => {
//                     setTimeout(resolve, 1000)
//                 })
//                 height = heightCurrent
//                 heightCurrent = document.documentElement.scrollHeight
//             }
//         })
//     }
//     async scrollHome() {
//         await this.page.evaluate(() => {
//             window.scrollTo(0, 0)
//         })
//     }
//     async close() {
//         if (this.browser)
//             await this.browser.close()
//     }
// }

// module.exports = Controller

// async function test() {
//     let pt = new Controller()
//     await pt.init('https://www.naver.com/', true)
//     let result = await pt.page.evaluate(() => {
//         return Array.from(document.querySelectorAll('ul.list_nav.type_fix > li')).map(li => li.textContent)
//     })
//     console.log(result)
//     pt.close()
// }
// if (require.main === module) {
//     test()
// }