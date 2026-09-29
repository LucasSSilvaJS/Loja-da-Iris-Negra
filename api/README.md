# iris-negra-api

Microsserviço da loja da Íris Negra. NestJS 11, MongoDB via Mongoose, validação com class-validator e documentação Swagger em `/docs`.

## Scripts

```bash
copy .env.example .env
npm install
npm run start:dev    # http://localhost:3000
npm test
npm run build
npm run start:prod
```

`npm test` cobre a montagem da mensagem que vai para o WhatsApp e não precisa do MongoDB. O e2e (`npm run test:e2e`) sobe a aplicação inteira e exige o banco no ar.

## Ambiente

| Variável | Função |
| --- | --- |
| `PORT` | Porta HTTP. Padrão 3000 |
| `MONGODB_URI` | Conexão. Padrão `mongodb://127.0.0.1:27017/iris-negra` |
| `CORS_ORIGIN` | Origens permitidas, separadas por vírgula |
| `WHATSAPP_NUMBER` | Número da loja com DDI, só dígitos. Sem isso o pedido grava e `whatsappUrl` volta `null` |

## HTTP

O prefixo global é `/api`. O Swagger fica fora dele, em `/docs`.

| Método | Caminho | O que faz |
| --- | --- | --- |
| GET | `/api/health` | API e MongoDB |
| GET | `/api/categories` | Tipos de produto |
| GET | `/api/categories/:slug` | Um tipo |
| GET | `/api/products` | Catálogo. Filtros `category` e `featured=true` |
| GET | `/api/products/:slug` | Uma peça |
| POST | `/api/orders` | Reserva estoque e grava o pedido |
| GET | `/api/orders/:publicId` | Consulta pelo id da URL |
| GET | `/api/chat/messages` | Últimas 40 mensagens |
| POST | `/api/chat/messages` | Publica no shoutbox. Limite de 8 por minuto |
| GET | `/api/playlist` | Nu metal e rock dos anos 2000 |

Há um limite geral de 80 requisições por minuto por IP.

## Pastas

```
src/
  configure-app.ts          prefixo, CORS e validação
  health/
  database/                 seed da primeira leva
  modules/
    categories/
    products/
    orders/                 reserva de estoque e mensagem de WhatsApp
    chat/
    playlist/
```

Cada módulo tem controller, service, DTO e schema. O controller recebe e documenta. O service aplica a regra. O schema é o documento. A mensagem do WhatsApp é uma função pura em `orders/order-message.ts`, com teste ao lado, para o texto do pedido não depender do Mongo.

## Pedido

1. Junta linhas repetidas da mesma peça e tamanho.
2. Confere se a peça e o tamanho existem.
3. Baixa o estoque das peças prontas com uma condição (`stock >= quantidade`). Se uma linha falha, devolve o que já tinha baixado.
4. Peça da Eva (`madeToOrder`) não mexe no estoque.
5. Gera `IRN-0001` num contador e um `publicId` aleatório para a URL.

Não existe listagem pública de pedidos. Quem tem o link consulta o seu.

## Seed

Na subida, se não houver categorias, a API grava a leva inicial: camisas, adesivos, bonés e peças da Eva. A playlist é regravada quando o seed das faixas muda, sem apagar pedidos nem o chat. Apagar o banco `iris-negra` recarrega o catálogo inteiro.
