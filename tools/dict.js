const fs = require('fs').promises
const path = require('path')
const serialize = require('serialize-javascript')

const baseLang = 'en'
const inputDir = path.join(__dirname, '../dict')
const outputDir = path.join(__dirname, '../docs/.vuepress/public/')
const outputFile = path.join(outputDir, 'dict')

main()

async function main() {
    const dictRaw = {}

    const langDirs = await fs.readdir(inputDir)

    for (const lang of langDirs) {
        dictRaw[lang] = await loadLang(lang)
    }

    await fs.writeFile(outputFile, serialize(dictRaw))
}

async function loadLang(lang) {
    return await loadDir(path.join(inputDir, lang))
}

async function loadDir(dir) {
    let dirContents = [], fileContents = []
    const items = await fs.readdir(dir)
    for (const item of items) {
        const lstat = await fs.lstat(path.join(dir, item))
        if (lstat.isDirectory()) {
            dirContents = dirContents.concat(await loadDir(path.join(dir, item)))
        } else {
            fileContents = fileContents.concat(await loadFile(path.join(dir, item)))
        }
    }
    return fileContents.concat(dirContents)
}

async function loadFile(file) {
    const content = await fs.readFile(file, 'utf-8')
    return content.split('\n').map(line => line.trim()).filter(line => line != '')
}
