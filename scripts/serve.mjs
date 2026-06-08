import { networkInterfaces } from 'node:os';
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 5173);
const root = join(process.cwd(), process.env.ROOT || '.');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requested = normalize(decoded === '/' ? '/index.html' : decoded);
  return join(root, requested.replace(/^[/\\]+/, ''));
}

function lanAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === 'IPv4' && !address.internal)
    .map((address) => address.address);
}

function linksHtml() {
  const links = [`http://localhost:${port}`, ...lanAddresses().map((address) => `http://${address}:${port}`)];
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Links Sara Fit 54</title><body style="font-family:system-ui;padding:24px;line-height:1.5"><h1>Links Sara Fit 54</h1><p>No iPad, use o link com IP da rede Wi-Fi, não localhost.</p><ul>${links.map((link) => `<li><a href="${link}">${link}</a></li>`).join('')}</ul><p>Se o iPad não abrir, use o arquivo offline <code>dist/sara-fit-54-standalone.html</code> depois de rodar <code>npm run build</code>.</p></body></html>`;
}

const server = createServer((request, response) => {
  const url = request.url || '/';
  if (url.startsWith('/health')) {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ ok: true, app: 'Sara Fit 54' }));
    return;
  }
  if (url.startsWith('/links')) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(linksHtml());
    return;
  }

  const filePath = safePath(url);
  const pathToServe = existsSync(filePath) && statSync(filePath).isDirectory()
    ? join(filePath, 'index.html')
    : filePath;

  if (!existsSync(pathToServe)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(pathToServe)] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  createReadStream(pathToServe).pipe(response);
});

server.listen(port, host, () => {
  console.log('Sara Fit 54 está no ar.');
  console.log(`Link local:   http://localhost:${port}`);
  console.log(`Página de links: http://localhost:${port}/links`);
  const addresses = lanAddresses();
  if (addresses.length) {
    console.log('Links para iPad/celular na mesma rede Wi-Fi:');
    addresses.forEach((address) => console.log(`  http://${address}:${port}`));
  } else {
    console.log('Nenhum IP de rede local encontrado. Use o link local neste computador.');
  }
  console.log('Plano B offline: rode npm run build e abra dist/sara-fit-54-standalone.html no Safari/Arquivos.');
});
