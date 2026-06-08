# Link de acesso no iPad Pro / Safari

Este app agora tem dois jeitos de abrir no iPad:

1. link por rede Wi-Fi, quando o iPad consegue acessar o computador;
2. arquivo offline `dist/sara-fit-54-standalone.html`, quando nenhum link abre por firewall, VPN, rede corporativa ou isolamento do roteador.

## Opção 1: abrir por link na mesma rede Wi-Fi

1. No computador onde está este repositório, rode:

   ```bash
   npm run start
   ```

2. O terminal vai mostrar algo parecido com:

   ```text
   Sara Fit 54 está no ar.
   Link local:   http://localhost:5173
   Página de links: http://localhost:5173/links
   Links para iPad/celular na mesma rede Wi-Fi:
     http://192.168.0.23:5173
   ```

3. No Safari do iPad Pro 12.9, abra o link com IP da rede, por exemplo:

   ```text
   http://192.168.0.23:5173
   ```

4. Não use `localhost` no iPad. No Safari do iPad, `localhost` significa o próprio iPad, não o computador.

## Opção 2: se nenhum link abrir, usar arquivo offline

1. No computador, gere o arquivo standalone:

   ```bash
   npm run offline
   ```

2. Pegue este arquivo:

   ```text
   dist/sara-fit-54-standalone.html
   ```

3. Envie para o iPad por AirDrop, iCloud Drive, WhatsApp, e-mail ou app Arquivos.

4. Abra `sara-fit-54-standalone.html` no Safari. Esse arquivo já contém HTML, CSS e JavaScript embutidos, então não depende de `localhost`, rede Wi-Fi ou módulos externos.

## Diagnóstico rápido

- Se `http://localhost:5173` abre no computador, mas o IP não abre no iPad: o problema é rede/firewall/VPN, não o app.
- Se o iPad e o computador estão em redes diferentes, o IP não abrirá.
- Se o Wi-Fi tem “isolamento de cliente/dispositivo”, o iPad não consegue ver o computador.
- Se estiver usando VPN, desligue temporariamente e teste de novo.
- Se precisar de um link público permanente, publique o conteúdo de `dist/` em GitHub Pages, Netlify, Vercel ou outro host estático.
