'use strict'

const fs = require('fs')
const conf = require('./_data/site.json')

const vaultPath = process.cwd() + '/vault'
const ignore = [
  '.git',
  'docs',
  'node_modules',
  '.obsidian',
  '_drafts',
  'templates',
  'README.md',
  'Excalidraw',
]
const linkGRE = /!?\[\[(([^\]#\|]*)(#[^\|\]]+)*(\|[^\]]*)*)\]\]/g
const linkRE = /!?\[\[(([^\]#\|]*)(#[^\|\]]+)*(\|[^\]]*)*)\]\]/
const frontMatterRE = /^---(.|\r|\n|\s!(\r?\n---))+\r?\n---/
const frontMatterTitleRE = /\r?\ntitle:.+\r?\n/
let nextId = 1

const min = (a, b) => (a < b ? a : b)

const listAllFiles = dirname => {
  const files = fs.readdirSync(dirname)
  let children = []
  files.forEach(file => {
    const filename = file.toString()
    const fullpath = `${dirname}/${filename}`
    const url = fullpath.split(vaultPath)[1].split('.md')[0]
    const isDir = fs.statSync(fullpath).isDirectory()
    const isMd = !isDir && filename.toLowerCase().endsWith('.md')
    if (ignore.includes(filename)) return
    children = children.concat([
      { id: nextId++, fullpath, dirname, filename, url, isDir, isMd },
    ])
    if (isDir) {
      children = children.concat(listAllFiles(fullpath))
    }
  })
  return children
}

const linkMdFileIds = (allFiles, link) => {
  const ids = []
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i]
    if (file.fullpath.endsWith(link + '.md')) ids.push(file.id)
  }
  return ids
}

const allVaultFiles = listAllFiles(vaultPath)
const allMdFiles = allVaultFiles
  .filter(file => file.isMd)
  .filter(file => file.fullpath !== `${process.cwd()}/vault/index.md`)

// find links
allMdFiles.forEach(file => {
  const contents = fs.readFileSync(file.fullpath, 'utf-8')
  const lines = contents.split(/\r?\n/)
  const links = []
  lines.forEach(line => {
    const matches = line.match(linkGRE) || []
    matches.forEach(mathchStr => {
      const link = mathchStr.match(linkRE)[2]
      const linkToIds = linkMdFileIds(allMdFiles, link)
      if (linkToIds.length) links.push({ link, linkToIds })
    })
  })
  file.links = links
})

const getIndexUrl = url => {
  const res = url.slice(0, url.lastIndexOf('/'))
  return res === '' ? '/' : res
}

const extractFMTitle = filename => {
  const content = fs.readFileSync(filename, { encoding: 'utf-8', flag: 'r' })
  const contentMatch = content.match(frontMatterRE)
  if (!contentMatch) return null
  const fm = contentMatch[0] || ''
  const titleMatch = fm.match(frontMatterTitleRE)
  if (titleMatch && titleMatch[0]) return titleMatch[0].split(/:\s*/)[1].trim()
  return null
}

// find backlinks
allMdFiles.forEach(file => {
  const backlinks = []
  allMdFiles.forEach(possibleSource => {
    possibleSource.links.forEach(link => {
      if (link.linkToIds.includes(file.id)) backlinks.push(possibleSource.id)
    })
  })
  file.backlinks = backlinks
})

const nodeTag = id => `node-${id}`

// make graph json
const graphData = {
  nodes: allMdFiles.map(file => ({
    id: nodeTag(file.id),
    name: extractFMTitle(file.fullpath) || file.filename.split('.md')[0],
    val: min(1 + 1.1 * file.backlinks.length, 1),
    url: file.filename === 'index.md' ? getIndexUrl(file.url) : file.url,
    links: file.links.map(link => link.linkToIds).map(nodeTag),
    backlinks: file.backlinks.map(nodeTag),
  })),
  links: allMdFiles
    .map(file =>
      file.backlinks.map(bl => ({
        source: nodeTag(bl),
        target: nodeTag(file.id),
      }))
    )
    .flat(),
  styles: conf.styles,
}
graphData.nodes.forEach(node => {
  const neighbors = node.links.concat(node.backlinks)
  node.neighbors = neighbors
})

fs.writeFileSync('assets/all-docs.json', JSON.stringify(allVaultFiles))
fs.writeFileSync('assets/graph-data.json', JSON.stringify(graphData))
