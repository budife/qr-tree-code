import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Start the heavy scene/QR chunks alongside the shell instead of after React mounts. */
function preloadHeavyChunks(): Plugin {
  const files: string[] = []
  return {
    name: 'preload-heavy-chunks',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && (chunk.name === 'scene' || chunk.name === 'qr')) {
          files.push(chunk.fileName)
        }
      }
    },
    transformIndexHtml(html) {
      if (!files.length) return html
      const tags = files
        .map((file) => `    <link rel="modulepreload" crossorigin href="/qr/${file}">`)
        .join('\n')
      return html.replace('</head>', `${tags}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Disajikan sebagai path di domain utama (budd.my.id/qr), bukan subdomain.
  // base wajib supaya asset di-request ke /qr/assets/... bukan /assets/...
  base: '/qr/',
  plugins: [react(), preloadHeavyChunks()],
})
