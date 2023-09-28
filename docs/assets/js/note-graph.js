'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const userHasDarkMode = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  let graph = null
  let data = null
  const nodes = {}
  const domContainer = document.querySelector('.note-graph')

  const min = (a, b) => (a < b ? a : b)

  if (!domContainer) return

  fetch('/assets/graph-data.json')
    .then(response => response.json())
    .then(jsonData => {
      //console.log('graph data', jsonData)
      data = jsonData
      data.nodes.forEach(node => (nodes[node.id] = node))
      graph = ForceGraph()
      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null
      data.links.forEach(link => {
        const a = nodes[link.source]
        const b = nodes[link.target]

        !a.graphLinks && (a.graphLinks = [])
        !b.graphLinks && (b.graphLinks = [])
        a.graphLinks.push(link)
        b.graphLinks.push(link)
      })
      const normalColor = () =>
        userHasDarkMode()
          ? data.styles.darkTextColor
          : data.styles.lightTextColor
      const highlightColor = () =>
        userHasDarkMode()
          ? data.styles.darkAccentColor
          : data.styles.lightAccentColor
      graph(domContainer)
        .width(
          PAGE_URL === ''
            ? window.innerWidth
            : domContainer.getBoundingClientRect().width
        )
        .height(
          PAGE_URL === ''
            ? window.innerHeight
            : domContainer.getBoundingClientRect().height
        )
        .graphData(data)
        .autoPauseRedraw(false)
        .onLinkHover(link => {
          highlightNodes.clear()
          highlightLinks.clear()

          if (link) {
            highlightLinks.add(link)
            highlightNodes.add(link.source.id)
            highlightNodes.add(link.target.id)
          }
        })
        .linkWidth(link => (highlightLinks.has(link) ? 2 : 1))
        .linkColor(link =>
          highlightLinks.has(link) ? highlightColor() : normalColor()
        )
        .nodeRelSize(4)
        .nodeColor(node =>
          highlightNodes.has(node.id) ||
          node.url === PAGE_URL ||
          (node.url === '/' && PAGE_URL === '')
            ? highlightColor()
            : normalColor()
        )
        .nodeCanvasObjectMode(() => 'after')
        .nodeCanvasObject((node, ctx, globalScale) => {
          const label = node.name
          const fontSize = (hoverNode === node.id ? 16 : 13) / globalScale
          const fontFamily = data.styles.graphFont
          const nodeRadius = Math.sqrt((64 * node.val) / Math.PI)
          ctx.font = `${fontSize}px "${fontFamily}"`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle =
            hoverNode === node.id ? highlightColor() : normalColor()
          ctx.globalAlpha =
            hoverNode === node.id ? 1.0 : min(1.0, (0.5 * globalScale) ** 4)
          ctx.fillText(label, node.x, node.y + nodeRadius + 6 / globalScale)
          ctx.globalAlpha = 1.0
        })
        .onNodeHover(node => {
          highlightNodes.clear()
          highlightLinks.clear()
          hoverNode = null
          if (node) {
            highlightNodes.add(node.id)
            hoverNode = node.id
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
            ;(node.graphLinks || []).forEach(link => {
              highlightLinks.add(link)
            })
          }
        })
        .onNodeDrag((node, translate) => {
          highlightNodes.clear()
          highlightLinks.clear()
          highlightNodes.add(node.id)
          hoverNode = node.id
          node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
          node.graphLinks.forEach(link => {
            highlightLinks.add(link)
          })
        })
        .onNodeDragEnd((node, translate) => {
          highlightNodes.clear()
          highlightLinks.clear()
          hoverNode = null
        })
        .onNodeClick((node, event) => window.open(node.url, '_self'))
    })
    .then(() => {
      if (graph) {
        window.addEventListener('resize', () => {
          graph.width(
            document.querySelector('.note-graph').getBoundingClientRect().width
          )
          graph.height(
            document.querySelector('.note-graph').getBoundingClientRect().height
          )
        })
        setTimeout(() => {
          if (PAGE_URL !== '') {
            for (let i = 0; i < data.nodes.length; i++) {
              const node = data.nodes[i]
              if (node.url === PAGE_URL) {
                graph.centerAt(node.x, node.y, 500)
                graph.zoom(4, 500)
              }
            }
          } else {
            graph.zoomToFit(500)
          }
        }, 1000)
      }
    })
})
