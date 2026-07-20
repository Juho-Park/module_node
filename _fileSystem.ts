import path from 'path'
import fs from 'fs'

async function saveFile(_path: string[], fileName: string, file: File) {
    const baseDir = path.join(..._path)
    fs.mkdirSync(baseDir, { recursive: true });
    const filePath = path.join(baseDir, fileName)
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()))
    return path.join(baseDir, fileName).split('public')[1]
}


export default { saveFile }