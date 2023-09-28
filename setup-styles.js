'strict mode'

const fs = require('fs')
const conf = require('./_data/site.json')
const cssDefinitions = `:root {
  --light-text: ${conf.styles.lightTextColor};
  --light-accent: ${conf.styles.lightAccentColor};
  --light-background: ${conf.styles.lightBackgroundColor};
  --dark-text: ${conf.styles.darkTextColor};
  --dark-accent: ${conf.styles.darkAccentColor};
  --dark-background: ${conf.styles.darkBackgroundColor};
  --font-family: ${conf.styles.normalFont};
  --font-family-headings: ${conf.styles.headingsFont};
  --font-family-mono: ${conf.styles.monoFont};
  --font-family-ui: ${conf.styles.uiFont};
}`

fs.writeFileSync('assets/css/definitions.css', cssDefinitions)
