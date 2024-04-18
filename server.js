/* eslint-disable simple-import-sort/imports */
/* https://github.com/vercel/next.js/discussions/10935#discussioncomment-6888422 */
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { parse } from 'url';

import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const caPath = process.env.NEXT_PUBLIC_SSL_CA;
const privateKeyPath = process.env.NEXT_PUBLIC_SSL_KEY;
const certificatePath = process.env.NEXT_PUBLIC_SSL_CERT;

const port = 3000;

const httpsOptions = {
  ca: readFileSync(caPath),
  key: readFileSync(privateKeyPath),
  cert: readFileSync(certificatePath),
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
