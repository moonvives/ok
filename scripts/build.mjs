import { mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'src'), { recursive: true });

for (const file of ['index.html']) copyFileSync(join(root, file), join(dist, file));
for (const file of ['main.js', 'plan.js', 'personalization.js', 'integrations.js', 'styles.css']) {
  copyFileSync(join(root, 'src', file), join(dist, 'src', file));
}

const css = readFileSync(join(root, 'src/styles.css'), 'utf8');
const scripts = ['plan.js', 'integrations.js', 'personalization.js', 'main.js']
  .map((file) => readFileSync(join(root, 'src', file), 'utf8'))
  .map((source) => source
    .replace(/^import\s+['"].*?['"];\s*$/gm, '')
    .replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"].*?['"];\s*$/gm, '')
    .replace(/^export\s+/gm, ''))
  .join('\n\n');

const standalone = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Plano disciplinado de emagrecimento saudável até 54 kg, com dados corporais individualizados." />
    <title>Sara Fit 54 — standalone</title>
    <style>${css}</style>
  </head>
  <body>
    <div id="app"></div>
    <script>${scripts}</script>
  </body>
</html>`;

writeFileSync(join(dist, 'sara-fit-54-standalone.html'), standalone);
console.log('Build pronto em dist/.');
console.log('Arquivo offline para Safari/iPad: dist/sara-fit-54-standalone.html');
