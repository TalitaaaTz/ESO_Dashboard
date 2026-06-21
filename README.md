# Dashboard da Sonda Multiparamétrica

Dashboard React + Vite para mostrar dados ambientais enviados por uma sonda baseada em ESP32 e salvos no Supabase.

## O que o projeto já faz

- Busca leituras no Supabase.
- Mostra a última leitura em cartões.
- Exibe gráficos próprios em SVG, sem biblioteca extra.
- Atualiza por Realtime quando disponível e também consulta o banco a cada 30 segundos.
- Mostra uma interpretação preliminar por faixas configuráveis.
- Exporta os registros carregados como CSV.
- Tem layout responsivo, adequado para navegador e Capacitor/Android.

## Antes de rodar

1. Instale as dependências:

```bash
npm install
```

2. Faça uma cópia do arquivo `.env.example` com o nome `.env`.

3. Preencha as variáveis:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
# ou VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

4. Ajuste apenas `src/config/sonda.js` para usar o nome real da tabela e das colunas de vocês.

5. Rode:

```bash
npm run dev
```

## Estrutura esperada no banco

O código vem configurado para a tabela `leituras_sonda` com estes campos:

```text
id
created_at
sonda_id
temperatura_c
ph
condutividade_us_cm
turbidez_ntu
luminosidade_lux
```

Se o banco de vocês usa outros nomes, não precisa alterar o resto do projeto: troque os nomes em `src/config/sonda.js`.

## Para gerar o APK com Capacitor

Depois de validar o site no navegador:

```bash
npm run build
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init
npm i @capacitor/android
npx cap add android
npx cap sync
npx cap open android
```

No questionário do `npx cap init`, confirme que a pasta de saída é `dist`.

## Segurança

A chave usada no frontend deve ser a chave pública/publishable do Supabase.
Nunca coloque a chave `service_role` no arquivo `.env` do aplicativo.
Configure as políticas RLS da tabela para permitir somente o acesso necessário.
