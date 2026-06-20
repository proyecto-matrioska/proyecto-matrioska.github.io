# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server with hot reload (runs build-graph first)
npm run build      # Production build (runs build-graph first)
npm run deploy     # Build then push to GitHub Pages
npm run setup-styles  # Regenerate CSS variables from _data/site.json colors
npm run build-graph   # Regenerate assets/graph-data.json and assets/all-docs.json
```

There are no tests or linting scripts.

## Architecture

This is an **Eleventy (11ty) v2** static site that publishes an **Obsidian vault** as a personal knowledge base + blog. Content lives in `vault/`, output goes to `docs/` (served by GitHub Pages).

### Content pipeline

1. Notes are written in Obsidian using its wiki-link syntax (`[[note name]]`, `![[image.png]]`, `![[diagram.excalidraw.md]]`).
2. `build-graph-data.js` pre-scans all vault markdown files, resolves wiki-links, and emits `assets/graph-data.json` (node/edge list) and `assets/all-docs.json`.
3. Eleventy processes the vault through `markdown-it` with a custom plugin (`markdown-it-obsidian.js`) that converts Obsidian wiki-link syntax to standard HTML.
4. The browser renders a force-directed knowledge graph (`assets/note-graph.js` + `force-graph.1.43.2.min.js`) on every page.

### Key files

| File | Purpose |
|---|---|
| `.eleventy.js` | Eleventy config: input=`vault/`, output=`docs/`, collections, filters, passthrough copy |
| `_data/site.json` | Site metadata + theme color palette (source of truth for colors) |
| `setup-styles.js` | Reads `_data/site.json` and writes `assets/css/definitions.css` with CSS variables |
| `build-graph-data.js` | Builds the graph JSON by parsing `[[wiki-links]]` from all vault notes |
| `markdown-it-obsidian.js` | Custom markdown-it plugin for Obsidian syntax (wiki-links, transclusion, image sizing, excalidraw embedding) |
| `toLower.js` | Diacritic-insensitive lowercasing for Spanish-language alphabetical sorting |

### Layouts (in `layouts/`)

- `html-wrapper.html` — base shell with nav, GA, global scripts; all other layouts extend it
- `home.html` — full-screen graph visualization
- `default.html` — note/page with sidebar graph
- `blog-archive.html` / `archive.html` — listing pages
- `feed.njk` — RSS feed

### Content structure (`vault/`)

- `vault/bitacora/` — blog posts (date-ordered, shown in reverse chronological order)
- `vault/notas/` — knowledge base notes (~47 files, sorted alphabetically with Spanish diacritic handling)
- `vault/Excalidraw/` — diagram source files; excluded from note graph, passed through to output
- `vault/media/` — images and assets referenced by notes
- `vault/templates/` — Obsidian templates, excluded from Eleventy build
- `vault/_data/` / `vault/feed.njk` — site-level data and RSS

### Obsidian wiki-link conventions handled by `markdown-it-obsidian.js`

- `[[note name]]` → link to note (italic if file not found)
- `[[note name|Label]]` → link with custom label
- `[[note name#heading]]` → link to heading anchor
- `![[image.png|width=300]]` → image with width attribute
- `![[diagram.excalidraw.md]]` → embedded Excalidraw diagram (rendered client-side)

### Theme colors

All color values come from `_data/site.json` under the `styles` key. After editing that file, run `npm run setup-styles` to regenerate `assets/css/definitions.css`. Do not edit `definitions.css` directly.
