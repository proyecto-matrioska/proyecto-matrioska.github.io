const markdownIt = require('markdown-it')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const toLower = require('./toLower')

module.exports = function (eleventyConfig) {
  const md = markdownIt({
    html: true,
    linkify: true,
  })
    .use(require('markdown-it-attrs'))
    .use(require('markdown-it-link-attributes'), {
      attrs: {
        target: '_blank',
        rel: 'noopener',
        class: 'external',
      },
    })
    .use(require('./markdown-it-obsidian')({ vaultPrefix: '/vault' }))

  eleventyConfig.addFilter('markdownify', string => {
    return md.render(string)
  })
  eleventyConfig.setLibrary('md', md)
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('vault/media')
  eleventyConfig.addPassthroughCopy('vault/Excalidraw')
  eleventyConfig.setUseGitIgnore(false)
  eleventyConfig.addGlobalData('layout', 'default')
  eleventyConfig.addCollection('blog', function (collectionApi) {
    return collectionApi.getFilteredByGlob('vault/bitacora/*.md')
  })
  eleventyConfig.addCollection('notes', function (collectionApi) {
    const col = collectionApi.getFilteredByGlob('vault/**/*.md')
    return col.sort((a, b) =>
      toLower(a.fileSlug) < toLower(b.fileSlug)
        ? -1
        : toLower(a.fileSlug) > toLower(b.fileSlug)
        ? 1
        : 0
    )
  })
  eleventyConfig.addPlugin(pluginRss)

  return {
    dir: {
      input: './vault',
      output: './docs',
      layouts: '../layouts',
      includes: '../includes',
      data: '../_data',
    },
    passthroughFileCopy: true,
  }
}
