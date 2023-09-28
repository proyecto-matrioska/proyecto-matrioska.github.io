'use strict'

const fs = require('fs')
const Plugin = require('markdown-it-regexp')

const defaultOptions = {
  baseUrl: '/',
  vaultPrefix: '',
  ignore: ['.git', '_site', 'node_modules', '.obsidian', 'templates'],
}

const obsidianLinkRE = /!?\[\[(([^\]#\|]*)(#[^\|\]]+)*(\|[^\]]*)*)\]\]/

const getLabel = match =>
  match[4] ? match[4].slice(1) : match[3] ? match[3].slice(1) : match[1]

const getObsidianLink = match => match[2]

const getGroupId = match => (match[3] ? match[3].split('#^group=')[1] : null)

const getImageWidth = match => (match[4] ? `width="${match[4].slice(1)}"` : '')

const listAllFiles = (ignore, dirname) => {
  const files = fs.readdirSync(dirname)
  const children = []
  files.forEach(file => {
    const filename = file.toString()
    const fullpath = `${dirname}/${filename}`
    const isDir = fs.statSync(fullpath).isDirectory()
    if (ignore.includes(filename)) return
    children.push(fullpath)
    if (isDir) {
      children.push(...listAllFiles(ignore, fullpath))
    }
  })
  return children
}

const matcher = options => (match, utils) => {
  const isTransclusion = match[0].startsWith('!')
  const label = getLabel(match)
  const obsidianLink = getObsidianLink(match)
  const imageWidth = getImageWidth(match)
  const groupId = getGroupId(match)
  const href = `${options.baseUrl}${obsidianLink}`
  const isExcalidraw = href.endsWith('.excalidraw.md')
//  console.log(`
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//  => ${match.input} =>
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//    isTransclusion: ${isTransclusion}
//    label:          ${label}
//    obsidianLink:   ${obsidianLink}
//    imageWidth:     ${imageWidth}
//    groupId:        ${groupId}
//    href:           ${href}
//    isExcalidraw:   ${isExcalidraw}
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//`)

  if (!label) return match.input

  const vaultFiles = listAllFiles(
    options.ignore,
    `${process.cwd()}${options.vaultPrefix}`
  )
  const mdFile = vaultFiles.find(
    filename =>
      filename === `${process.cwd()}${options.vaultPrefix}/${obsidianLink}.md`
  )

  if (!isTransclusion && !mdFile) return `<em>${label}</em>`

  if (isTransclusion) {
    const imgAttributes = isExcalidraw
      ? `excalidraw="true" drawingMd="${utils.escape(href)}" ${
          groupId ? ` groupId="${utils.escape(groupId)}"` : ''
        } ${imageWidth}`
      : imageWidth
    return `<img src="${
      isExcalidraw ? '#' : utils.escape(href)
    }" ${imgAttributes}></img>`
  }

  return `<a href="${utils.escape(href)}">${label}</a>`
}

module.exports = userOptions =>
  Plugin(obsidianLinkRE, matcher({ ...defaultOptions, ...userOptions }))
