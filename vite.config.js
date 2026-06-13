import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-portfolio-data-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/save-portfolio') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const data = JSON.parse(body)
                const filePath = path.join(__dirname, 'src/data/portfolio.json')
                
                // Ensure the directory exists
                const dirPath = path.dirname(filePath)
                if (!fs.existsSync(dirPath)) {
                  fs.mkdirSync(dirPath, { recursive: true })
                }
                
                // Write the JSON string to the file
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
                
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (err) {
                console.error('Failed to write portfolio data to disk:', err)
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, error: err.message }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
})
