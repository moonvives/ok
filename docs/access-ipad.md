# Link de acesso no iPad Pro / Safari

Este app é estático e roda localmente. O iPad não consegue abrir `localhost` do computador, porque `localhost` no Safari do iPad significa o próprio iPad.

## Como abrir no Safari do iPad

1. No computador onde está este repositório, rode:

   ```bash
   npm run start
   ```

2. O terminal vai mostrar algo parecido com:

   ```text
   Link local:   http://localhost:5173
   Links para iPad/celular na mesma rede Wi-Fi:
     http://192.168.0.23:5173
   ```

3. No Safari do iPad Pro 12.9, abra o link com IP da rede, por exemplo:

   ```text
   http://192.168.0.23:5173
   ```

4. O computador e o iPad precisam estar na mesma rede Wi-Fi. Se não abrir, verifique firewall/VPN e tente novamente.

## Importante

- Não use `http://localhost:5173` no iPad, a menos que o servidor esteja rodando no próprio iPad.
- Não abra o arquivo `index.html` diretamente pelo app Arquivos; o Safari pode bloquear módulos JavaScript locais.
- Para um link público permanente, publique a pasta do app em GitHub Pages, Netlify, Vercel ou outro host estático.
