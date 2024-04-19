/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable simple-import-sort/imports */
/* https://github.com/vercel/next.js/discussions/10935#discussioncomment-6888422 */
require('dotenv').config();

const { createServer } = require('https');
const { parse } = require('url');
const fs = require('fs');

const next = require('next');

const dev = process.env.NEXT_PUBLIC_ENV !== 'production';
const port = 3000;

const app = next({ dev });

const handle = app.getRequestHandler();


const httpsOptions = process.env.NEXT_PUBLIC_ENV === "production" ? null : {
  ca: fs.readFileSync(`${process.env.NEXT_PUBLIC_SSL_CA}`),
  key: fs.readFileSync(`${process.env.NEXT_PUBLIC_SSL_KEY}`),
  cert: fs.readFileSync(`${process.env.NEXT_PUBLIC_SSL_CERT}`),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Server started on https://localhost:${port}`);
  });
});
