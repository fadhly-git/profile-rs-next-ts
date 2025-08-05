// server.ts
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse, UrlWithParsedQuery } from 'url'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '8080', 10)

// Type untuk Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const parsedUrl: UrlWithParsedQuery = parse(req.url!, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err?: Error) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})