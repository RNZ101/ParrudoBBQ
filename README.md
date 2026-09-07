# PARRUDOBBQ BURGER — proposta visual

Site demonstrativo em HTML, CSS e JavaScript puro, sem backend ou etapa de build. Não é o site oficial. Produtos, valores e fotos são ilustrativos; não há depoimentos inventados. Nota, quantidade de avaliações, endereço e abertura às 18h foram fornecidos no briefing e não são atualizados automaticamente.

## Abrir

Abra `index.html` no navegador. Todos os recursos visuais são locais e funcionam sem internet; WhatsApp e Google Maps precisam de conexão. Também é possível executar `python -m http.server 8000` nesta pasta e acessar `http://localhost:8000`.

## Editar

- Logo: `assets/logo-parrudo.png`. A imagem enviada foi convertida de JPG para PNG, sem redesenho, recorte ou alteração. Se faltar, o nome da marca aparece no lugar.
- Fotos: `assets/images/`. Substitua pelos arquivos oficiais mantendo os nomes ou altere as referências em `index.html` e `js/script.js`.
- Produtos, descrições, categorias e preços: lista `products` em `js/script.js`. Ajuste também o contador do botão Todos em `index.html` ao mudar a quantidade.
- WhatsApp: constante `PHONE` em `js/script.js`. Atualize também os links de fallback e os números visíveis em `index.html`.
- Cores, espaçamentos e responsividade: `css/style.css`.
- Endereço, textos, horários e metadados: `index.html`.

## Publicar

GitHub Pages: envie os arquivos para um repositório preservando as pastas. Em **Settings → Pages**, escolha publicação a partir da branch `main`, pasta `/ (root)`, e salve. Os caminhos relativos permitem publicar em um subdiretório. Não envie a pasta de verificações se não precisar dela.

Vercel: importe o repositório como site estático, sem comando de build e usando a raiz como diretório de saída.

Após definir o domínio, substitua `og:image` por uma URL absoluta da foto e adicione `og:url` com a URL pública para melhorar as prévias em redes sociais. Nenhuma chave de API é utilizada.

## Imagens demonstrativas

Fotos genéricas do Unsplash, não pertencentes ao estabelecimento, baixadas para uso local sob a [licença Unsplash](https://unsplash.com/license). Referências dos arquivos originais:

- Burger principal: https://images.unsplash.com/photo-1568901346375-23c9450c58cd
- Burger secundário: https://images.unsplash.com/photo-1550547660-d9450f859349
- Batatas: https://images.unsplash.com/photo-1573080496219-bb080dd4f877
- Bebidas: https://images.unsplash.com/photo-1551024709-8f23befc6f87

As imagens dos cards representam categorias ilustrativas, não a composição exata dos produtos sugeridos. Ícones SVG incorporados no HTML; nenhuma biblioteca visual, fonte remota, rastreador ou formulário simulado.

## Verificação

`verify_site.py` é uma ferramenta opcional de desenvolvimento, não uma dependência do site. Com Python, Playwright e Microsoft Edge instalados, execute `python verify_site.py`. Verifica as cinco larguras solicitadas, overflow, filtros, menu mobile, destinos internos, URLs e mensagens do WhatsApp, imagens e erros de console. Capturas e resultados ficam em `verification/`. Os testes não enviam mensagens nem pedidos ao estabelecimento.
