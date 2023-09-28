'use strict'

const memoryCache = new Map()

const fetchDrawing = async url => {
  const cached = memoryCache.get(url)
  if (cached) return cached
  const response = await fetch(url)
  const text = await response.text()
  memoryCache.set(url, text)
  return text
}

// credits: https://github.com/zsviczian/obsidian-excalidraw-plugin
const getElementsInTheSameGroupWithElement = (element, elements) => {
  if (!element || !elements) return []
  const container =
    element.type === 'text' && element.containerId
      ? elements.filter(el => el.id === element.containerId)
      : []
  if (element.groupIds.length === 0) {
    if (container.length === 1) return [element, container[0]]
    return [element]
  }

  if (container.length === 1) {
    return elements.filter(
      el =>
        el.groupIds.some(id => element.groupIds.includes(id)) ||
        el === container[0]
    )
  }

  return elements.filter(el =>
    el.groupIds.some(id => element.groupIds.includes(id))
  )
}

document.addEventListener('DOMContentLoaded', async () => {
  const { exportToSvg } = ExcalidrawUtils
  const diagramImgs = document.querySelectorAll('img[excalidraw]')
  for await (const img of diagramImgs) {
    const url = img.getAttribute('drawingMd')
    const width = img.getAttribute('width')
    const groupId = img.getAttribute('groupId')
    const parent = img.parentNode
    const lightModeOpts = {
      theme: 'light',
      exportWithDarkMode: false,
      exportBackground: false,
    }
    const darkModeOpts = {
      theme: 'dark',
      exportWithDarkMode: true,
      exportBackground: false,
    }

    const md = await fetchDrawing(url)
    const drawStartMark = '```json'
    const drawEndMark = '```'
    const json = md.slice(
      md.indexOf(drawStartMark) + 7,
      md.lastIndexOf(drawEndMark)
    )
    const excalidrawDrawing = JSON.parse(json)
    const elements = groupId
      ? getElementsInTheSameGroupWithElement(
          excalidrawDrawing.elements.find(e => e.id === groupId),
          excalidrawDrawing.elements
        )
      : excalidrawDrawing.elements
    const svgLight = await exportToSvg({
      ...excalidrawDrawing,
      elements,
      appState: {
        ...excalidrawDrawing.appState,
        ...lightModeOpts,
      },
    })
    const svgDark = await exportToSvg({
      ...excalidrawDrawing,
      elements,
      appState: {
        ...excalidrawDrawing.appState,
        ...darkModeOpts,
      },
    })
    svgLight.classList.add('light-theme')
    svgDark.classList.add('dark-theme')
    const div = document.createElement('div')
    div.style.width = `100%`
    div.style.maxWidth = `700px`
    div.appendChild(svgLight)
    div.appendChild(svgDark)
    if (width) {
      div.style.width = `100%`
      svgLight.style.width = `${width}px`
      svgDark.style.width = `${width}px`
    }
    svgLight.style.height = `auto`
    svgDark.style.height = `auto`
    svgLight.style.maxWidth = `calc(min(700px, 100%))`
    svgDark.style.maxWidth = `calc(min(700px, 100%))`
    parent.replaceChild(div, img)
  }
})
