/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable simple-import-sort/imports */
/* https://github.com/vercel/next.js/discussions/10935#discussioncomment-6888422 */
const http = require('http');
const https = require('https');
const { parse } = require('url');
const fs = require('fs');

const next = require('next');

const dev = process.env.NEXT_PUBLIC_ENV !== 'production';
const PORT = 3000;

const app = next({ dev });

const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

app.prepare().then(() => {
  /* http 서버 실행 */
  http
    .createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT + 1, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT + 1}`);
    });

  /* https 서버 실행 */
  https
    .createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT, err => {
      if (err) throw err;
      console.log(`> HTTPS: Ready on https://localhost:${PORT}`);
    });
});
