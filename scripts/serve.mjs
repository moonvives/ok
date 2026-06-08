import { networkInterfaces } from 'node:os';
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const host = '0.0.0.0';
const port = Number(process.env.PORT || 5173);
const root = process.cwd();
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

const server = createServer((request, response) => {
  const filePath = safePath(request.url || '/');
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
  const addresses = lanAddresses();
  if (addresses.length) {
    console.log('Links para iPad/celular na mesma rede Wi-Fi:');
    addresses.forEach((address) => console.log(`  http://${address}:${port}`));
  } else {
    console.log('Nenhum IP de rede local encontrado. Use o link local neste computador.');
  }
  console.log('No iPad, use o link com o IP da rede, não localhost.');
});
