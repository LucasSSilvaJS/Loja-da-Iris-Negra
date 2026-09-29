# Loja da Íris Negra

Loja da banda pernambucana Íris Negra, em parceria com a Eva. A cara do site é a de uma página do começo dos anos 2000 — magenta, tarja, shoutbox e playlist — vestida com a identidade publicada no [Instagram da banda](https://www.instagram.com/irisnegra_/): rock, psicodelia e safadeza. O disco de referência é o EP *Incognocivo*.

O repositório tem dois projetos, cada um com o próprio `package.json`.

| Pasta | Projeto | Sobe em |
| --- | --- | --- |
| [`web`](web) | Loja em Vite + React | http://localhost:5173 |
| [`api`](api) | Microsserviço NestJS | http://localhost:3000/api |

A documentação de cada um está no README da pasta. O Swagger da API fica em http://localhost:3000/docs.

## O que o site faz

O desenho de referência organiza a página em quatro zonas. O site segue esse mapa:

- **Tipos de produto**, na lista da esquerda (no celular, uma faixa horizontal): camisas, adesivos, bonés e a prateleira da Eva.
- **Catálogo**, no centro. A capa é o cartaz do EP. Clicar num tipo abre as peças daquela prateleira.
- **Chat**, à direita no desktop e em `/chat` no celular. É um shoutbox, no espírito dos guestbooks antigos.
- **Playlist**, na barra de baixo. Nu metal e rock dos anos 2000, em clipes oficiais do YouTube. O primeiro clique na página começa a tocar.

A sacola guarda tamanho e quantidade neste navegador. Fechar o pedido grava tudo no MongoDB e, se o WhatsApp da loja estiver configurado, abre a conversa com o resumo. Quem entrega é o pessoal da loja.

## Pré-requisitos

- Node.js 22
- npm 10
- MongoDB 7 ou 8 escutando em `127.0.0.1:27017`

O MongoDB pode ser o serviço local do Windows ou o container do `docker-compose.yml`. O Docker Desktop precisa estar aberto para o Compose funcionar.

## Como rodar

Na raiz:

```bash
docker compose up -d
```

Se o MongoDB já estiver rodando como serviço, pule esse passo.

API:

```bash
cd api
copy .env.example .env
npm install
npm run start:dev
```

Antes de vender, preencha `WHATSAPP_NUMBER` no `api/.env` com DDI e DDD, só dígitos. Exemplo: `5581999990000`. Sem esse valor o pedido é gravado, mas o botão do WhatsApp não aparece.

Loja:

```bash
cd web
npm install
npm run dev
```

O Vite encaminha `/api` para `http://127.0.0.1:3000`, então o navegador fala com um único endereço em desenvolvimento.

## Catálogo inicial

Camisetas, adesivos, bonés e três peças da Eva entram sozinhos na primeira subida, se o banco ainda não tiver categorias. Preço e estoque são a primeira leva combinada no projeto, não uma tabela fechada com fornecedor. Para recarregar essa leva, apague o banco `iris-negra` e suba a API de novo. Pedidos e mensagens do chat também somem nesse apagão.

Peças da banda baixam estoque no pedido. Peças da Eva são sob encomenda e não baixam estoque. O prazo combina no WhatsApp.

## Playlist

Não hospedamos áudio. A barra toca a prévia oficial de cada faixa pela iTunes Search API (Linkin Park, System of a Down, Evanescence, Papa Roach, Slipknot, Deftones, Queens of the Stone Age, The White Stripes, Yeah Yeah Yeahs e Paramore). O navegador só deixa o som começar depois de um gesto, então a barra espera o primeiro clique.

## Decisões

**WhatsApp, e não cartão.** O pedido precisava existir de verdade e a entrega é feita pela própria loja. O documento fica no MongoDB, com código legível (`IRN-0001`) e um identificador opaco na URL, para a lista de pedidos não ficar enumerável. Um gateway de pagamento encaixa depois, no módulo de pedidos, sem mexer no catálogo.

**Só o MongoDB.** Peça, pedido, mensagem e faixa são documentos. Não há sessão, fila nem relatório relacional que pedisse um segundo banco. A interface dos módulos não vaza Mongoose para o controller, então um outro armazenamento pode substituir um serviço sem reescrever a rota.

**Sem painel administrativo.** O catálogo muda no seed ou direto no Mongo. Escrever produto por uma rota pública, sem autenticação, abriria a loja.

## Identidade usada

- [Instagram @irisnegra_](https://www.instagram.com/irisnegra_/) — bio “rock, psicodelia e safadeza”, projeto musical de @imperatriz.bass
- [Linktree](https://linktr.ee/irisnegra) — “Música, surtos e umas putaria...”, videoclipe e EP
- [Incognocivo](https://ditto.fm/incognocivo) — E.V.A., Dream of Falling Teeth, Raven, A Bruxa, A Lua
- [Raven no YouTube](https://www.youtube.com/watch?v=6PmC4s-UtYY)
- [SoundCloud](https://soundcloud.com/irisnegra)

As artes da vitrine são desenhos originais (íris, lua, corvo) no magenta da interface. As fotos de divulgação do Instagram não foram copiadas para o repositório.

## Licença

Projeto privado da loja. Não há licença de código aberto.
