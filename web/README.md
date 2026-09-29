# iris-negra-web

Loja da Íris Negra. Vite, React 19, React Router e React Icons. O estado da sacola fica no Zustand, persistido no navegador. O visual é mobile-first: no celular a lista de tipos vira uma faixa, o chat vai para `/chat` e a playlist gruda embaixo. A partir de 1040px a página abre nas três colunas do desenho de referência.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

Em desenvolvimento e no preview, `/api` é encaminhado para `http://127.0.0.1:3000`. Fora desse proxy, defina `VITE_API_URL` (veja `.env.example`).

## Rotas

| Caminho | Tela |
| --- | --- |
| `/` | Cartaz do EP e destaques |
| `/categoria/:slug` | Catálogo da prateleira |
| `/produto/:slug` | Peça, tamanho e pedido |
| `/pedido` | Peças escolhidas, quantidade e registro |
| `/pedido/:publicId` | Pedido registrado e link do WhatsApp |
| `/chat` | Shoutbox, em tela cheia no celular |
| `/sobre` | Banda, Eva e como a entrega funciona |

## Pastas

```
src/
  app/            composição da aplicação e rotas
  components/
    art/          desenhos da vitrine
    catalog/      card e grade
    checkout/     sacola, quantidade, resumo e etapas
    layout/       moldura, lista, chat e playlist
  content/        links públicos da banda
  hooks/
  lib/
  pages/          uma tela por arquivo, sem regra de estoque
  services/       cliente HTTP, um arquivo por recurso da API
  stores/         sacola
  styles/
  types/
```

A página pede dados e desenha. Estoque, preço e mensagem de WhatsApp são decididos na API. A sacola só guarda o que a pessoa escolheu até o pedido existir.

Os botões da sacola e do chat ficam juntos no canto inferior direito. Os dois painéis podem ficar abertos ao mesmo tempo, lado a lado. O atalho do topo também abre a sacola. O painel é o pedido: quantidade, total e o registro ficam ali. A página `/pedido` repete esses controles. O pedido registra só as peças. Nome, telefone e endereço não são pedidos no site.

## Acessibilidade

Alvos de toque com pelo menos 44px, rótulos nos controles da playlist, contraste do magenta sobre preto e um link de pular conteúdo. `prefers-reduced-motion` desliga rolagem suave.

## Playlist

O player é o `react-modern-audio-player`. Ele toca a prévia oficial da iTunes Search API. A lista abre pelo botão da playlist, com repetir, aleatório, volume e barra de progresso.
