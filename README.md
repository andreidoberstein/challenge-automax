# Como executar o backend: PostgreSQL (Docker) ou SQLite (Local)

## Você pode configurá-lo de duas formas: usando Docker com PostgreSQL para um ambiente mais robusto e escalável, ou usando SQLite para uma configuração simples e local sem dependências externas.

## Faça o clone do repositório na sua máquina e acesse os arquivos:

```bash
git clone https://github.com/andreidoberstein/challenge-automax.git
cd challenge-automax/backend
```

---

## Opção 1: Usando Docker e PostgreSQL

- Essa configuração usa Docker para rodar um container PostgreSQL, facilitando a portabilidade e isolamento.

---

Subir o ambiente Docker com o comando:

```bash
docker compose up -d
```

Crie um arquivo **.env** baseado no **.env.example:**

```bash
cp .env.example .env
```

Garanta que o **DATABASE_URL** aponte para o Postgres:

```
DATABASE_URL="postgresql://user:password@localhost:5432/automax_db"
```

Instalar dependências:

```bash
npm install
```

Aplicar migrations e gerar Prisma Client

```bash
npx prisma generate
npx prisma migrate dev
```

Rodar a API:

```
npm run dev
```

---

## Opção 2: Executando o projeto com SQLite (sem Docker)

- SQLite roda localmente e salva os dados em um arquivo .db

---

Instalar dependências:

```bash
npm install
```

Verifique se existe ou crie o arquivo **.env.dbsqlite** na raiz e cole o conteúdo:

```
DATABASE_URL="file:./prisma/sqlite/dev.db"
```

> O banco será criado automaticamente em <b>backend/prisma/sqlite/dev.db</b>

Certifique-se que os scripts estão configurados no package.json:

```
"prisma:sqlite:generate": "dotenv -e .env.dbsqlite -o -- prisma generate --schema=prisma/sqlite/schema.prisma",
"prisma:sqlite:push": "dotenv -e .env.dbsqlite -o -- prisma db push --schema=prisma/sqlite/schema.prisma",
"dev:sqlite": "dotenv -e .env.dbsqlite -o -- npm run dev"
```

Gerar Prisma Client, criar as tabelas e rodar a API:

```
npm run prisma:sqlite:generate
npm run prisma:sqlite:push
npm run dev:sqlite
```

---

# 📌 Rotas (endpoints)

| Método    | Endpoint     | Descrição                       | Status |
| --------- | ------------ | ------------------------------- | ------ |
| 🟢 GET    | `/health`    | Verifica se a API está ativa    | 200    |
| 🟢 GET    | `/carts`     | Lista carrinhos armazenados     | 200    |
| 🟢 GET    | `/carts/:id` | Retorna detalhes de um carrinho | 200    |
| 🔵 POST   | `/sync`      | Sincroniza API                  | 201    |
| 🟡 PATCH  | `/users/:id` | Atualiza carrinho               | 200    |
| 🔴 DELETE | `/users/:id` | Deleta carrinho                 | 204    |

---

<br>

# 📖 Documentação (Swagger UI)

Com a API rodando acesse:

```
http://localhost:3000/docs
```

![Preview da documentação](./frontend/src/assets/swagger.png)

<br>
<br>

---

# 🖥️ Como executar o frontend

![Preview da aplicação](./frontend/src/assets/front.png)

## Faça o clone do repositório na sua máquina e acesse os arquivos:

```bash
git clone https://github.com/andreidoberstein/challenge-automax.git
cd challenge-automax/frontend
```

Rodar o comando:

```bash
npm run dev
```

> Acessar a aplicação na URL indicada (http:localhost:8080)

---

# Lógica de importação dos produtos nos carrinhos

Para cada produto dentro de **fakeCart.products**, ele garante que exista um registro em cartItem para o par (cartId, productId):

- Se já existir → ele atualiza a quantity

- Se não existir → ele cria o item com cartId, productId e quantity

> Assim garante que exista no máximo um registro por produto no carrinho.

```bash
for (const p of fakeCart.products) {
  await tx.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: fakeCart.id,
        productId: p.productId
      }
    },
    create: {
      cartId: fakeCart.id,
      productId: p.productId,
      quantity: p.quantity
    },
    update: {
      quantity: p.quantity
    }
  });
}
```

<br>

# 📊 Observabilidade

Este projeto implementa práticas de observabilidade utilizando **Prometheus** para coleta de métricas e **Grafana** para visualização.

A aplicação expõe métricas HTTP no endpoint:

```bash
GET /metrics
```

Essas métricas incluem:

* 📈 Total de requisições por rota
* ⏱️ Tempo de resposta da API (histograma)
* ❌ Taxa de erros HTTP
* 🧠 Uso de memória do Node.js

---

### 🚀 Como subir o ambiente de observabilidade

Execute:

```bash
docker compose up -d
```

Isso iniciará:

* API Node.js
* Prometheus (porta 9090)
* Grafana (porta 3001)

---

### 🔎 Acessos

| Serviço    | URL                           |
| ---------- | ----------------------------- |
| API        | http://localhost:3000         |
| Métricas   | http://localhost:3000/metrics |
| Prometheus | http://localhost:9090         |
| Grafana    | http://localhost:3001         |

Login padrão do Grafana:

```
user: admin
password: admin
```

---

### 📊 Dashboard

![Grafana Observability Dashboard](frontend/src/assets/observability.png)

O dashboard principal exibe:

* Requests por segundo (RPS)
* Latência p95 das requisições
* Taxa de erro da API
* Uso de memória do processo Node

Esses dados permitem identificar:

* Gargalos de performance
* Rotas com maior carga
* Problemas de estabilidade
* Consumo de recursos da aplicação



---

### 📁 Estrutura

```
observability/
 ├── prometheus.yml
 └── dashboard-automax.json
```

---

