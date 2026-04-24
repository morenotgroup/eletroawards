# EletroAwards 2026 — Plataforma de votação

Plataforma responsiva em Next.js para votação da premiação EletroAwards 2026, com login por CPF, saudação personalizada, bloqueio de voto duplicado, apuração protegida e visual baseado nos assets oficiais da Convenção EletroMidia.

## O que está pronto

- Login por CPF com validação no servidor.
- Base de colaboradores extraída do arquivo `Formato de Rooming _ ELETROMIDIA _ 27 a 30.04.26.xlsx`.
- Categorias e indicados extraídos do arquivo `INDICADOS ELETROAWARDS`.
- Categoria `GOAT DA TEMPORADA 2025` preparada sem indicados, conforme solicitado.
- Sessão segura em cookie `httpOnly` assinado por `SESSION_SECRET`.
- CPFs não são enviados para o front-end.
- Votos salvos por hash SHA-256 do CPF, não pelo CPF puro.
- Bloqueio de novo voto para CPF já registrado.
- Tela de confirmação de voto computado.
- Tela de aviso para colaborador que já votou.
- Painel `/admin` protegido por `ADMIN_TOKEN` para ver apuração e exportar JSON.
- Design responsivo para desktop e celular.

## Estrutura principal

```txt
src/app/page.tsx                 interface principal
src/app/api/login/route.ts       login por CPF
src/app/api/session/route.ts     checagem de sessão
src/app/api/vote/route.ts        gravação dos votos
src/app/api/admin/results/route.ts apuração protegida
src/lib/data.ts                  base server-side de colaboradores + categorias
src/lib/awards.ts                categorias/assets seguros para o front-end
src/lib/security.ts              assinatura de sessão e hash de CPF
src/lib/store.ts                 persistência Redis/Upstash ou fallback dev
public/assets/eletro             assets oficiais extraídos do ZIP
```

## Configuração local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente obrigatórias para produção

Crie no Vercel em **Project Settings → Environment Variables**:

```env
SESSION_SECRET=uma-frase-secreta-forte-com-40-caracteres-ou-mais
ADMIN_TOKEN=um-token-forte-para-acessar-a-apuracao
KV_REST_API_URL=url-do-redis-rest
KV_REST_API_TOKEN=token-do-redis-rest
```

A aplicação também aceita estes nomes, caso o provider injete as variáveis no padrão Upstash:

```env
UPSTASH_REDIS_REST_URL=url-do-redis-rest
UPSTASH_REDIS_REST_TOKEN=token-do-redis-rest
```

Sem Redis/Upstash, a plataforma roda em modo `memory-dev`, útil apenas para teste local. Em produção, configure Redis/Upstash/Vercel Marketplace para os votos persistirem entre acessos e deployments.

## Deploy via GitHub + Vercel

1. Crie um repositório no GitHub, por exemplo `eletroawards-2026`.
2. Suba todos os arquivos deste projeto para o repositório.
3. No Vercel, clique em **Add New → Project**.
4. Importe o repositório.
5. Framework Preset: **Next.js**.
6. Build Command: `npm run build`.
7. Install Command: `npm install`.
8. Output Directory: deixe vazio/padrão.
9. Adicione as variáveis de ambiente acima.
10. Faça o deploy.

## Banco de votos recomendado

Use Redis via Vercel Marketplace/Upstash. O projeto já está preparado para ler as variáveis `KV_REST_API_URL` + `KV_REST_API_TOKEN` ou `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.

## Apuração

Acesse:

```txt
/admin
```

Digite o `ADMIN_TOKEN` configurado no Vercel e clique em **Carregar**. Também é possível consumir a API:

```txt
/api/admin/results?token=SEU_ADMIN_TOKEN
```

## Sobre as fontes

Os arquivos `.otf` enviados não foram redistribuídos dentro deste pacote. Para usar as fontes locais, coloque manualmente os arquivos licenciados em:

```txt
public/fonts/AcuminVariableConcept.otf
public/fonts/Heaters.otf
```

O CSS já tem fallback seguro, então o projeto funciona mesmo sem esses arquivos.

## Como atualizar indicados depois

Edite `src/lib/data.ts` e `src/lib/awards.ts`, preenchendo a categoria GOAT em `nominees`:

```ts
{
  id: "cat-7",
  number: 7,
  area: "DESTAQUE DO ANO",
  title: "GOAT DA TEMPORADA 2025",
  nominees: ["Nome 1", "Nome 2", "Nome 3"]
}
```

Faça commit e redeploy.
