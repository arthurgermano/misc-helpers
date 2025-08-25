# Miscellaneous Helpers

Uma coleção robusta de classes, funções utilitárias e validadores de alta performance para tarefas comuns no ecossistema JavaScript/Node.js.

[![NPM Version](https://img.shields.io/npm/v/misc-helpers.svg)](https://www.npmjs.com/package/misc-helpers)
[![License](https://img.shields.io/npm/l/misc-helpers.svg)](https://github.com/arthurgermano/misc-helpers/blob/main/LICENSE)

## Instalação

```bash
npm install misc-helpers
```

## Uso Básico

A biblioteca exporta módulos aninhados e também nivela a maioria das funções no nível raiz para facilitar o acesso.

```javascript
// Acesso aninhado (recomendado para clareza)
const { custom, helpers, validators } = require('misc-helpers');

const processor = new custom.bulkProcessor({ limit: 100, onFlush: myFlushLogic });
const numericValue = helpers.defaultNumeric("abc", 1);
const isValid = validators.validateCPF("123.456.789-00");

// Acesso direto (disponível para helpers, utils e validators)
const { defaultNumeric, validateCPF } = require('misc-helpers');
```

## Table of Contents

- [Miscellaneous Helpers](#miscellaneous-helpers)
  - [Instalação](#instalação)
  - [Uso Básico](#uso-básico)
  - [Table of Contents](#table-of-contents)
  - [Constants](#constants)
    - [Formatos de Data](#formatos-de-data)
    - [Máscaras de Formatação](#máscaras-de-formatação)
    - [Expressões Regulares (Regex)](#expressões-regulares-regex)
    - [Dados Geográficos](#dados-geográficos)
  - [Auth](#auth)
    - [WebAuthn](#webauthn)
      - [`getWebAuthnRegistrationCredential`](#getwebauthnregistrationcredential)
      - [`getWebAuthnAuthenticationAssertion`](#getwebauthnauthenticationassertion)
      - [`validateRegistration`](#validateregistration)
      - [`validateAuthentication`](#validateauthentication)
      - [`validateRPID`](#validaterpid)
      - [`convertECDSAASN1Signature`](#convertecdsaasn1signature)
      - [`getRegistrationAuthData`](#getregistrationauthdata)
      - [`getAuthenticationAuthData`](#getauthenticationauthdata)
  - [Crypto](#crypto)
    - [`decrypt`](#decrypt)
  - [`decryptBuffer`](#decryptbuffer)
    - [`digest`](#digest)
    - [`encrypt`](#encrypt)
  - [`encryptBuffer`](#encryptbuffer)
    - [`getCrypto`](#getcrypto)
    - [`importCryptoKey`](#importcryptokey)
    - [`verifySignature`](#verifysignature)
  - [Custom](#custom)
    - [`BulkProcessor` - Processador de Lotes Assíncrono](#bulkprocessor---processador-de-lotes-assíncrono)
    - [DB Sequelize](#db-sequelize)
      - [`setConditionBetweenDates`](#setconditionbetweendates)
      - [`setConditionBetweenValues`](#setconditionbetweenvalues)
      - [`setConditionStringLike`](#setconditionstringlike)
    - [WaitPlugin](#waitplugin)
  - [Helpers](#helpers)
    - [`dateCompareAsc`](#datecompareasc)
    - [`dateCompareDesc`](#datecomparedesc)
    - [`defaultNumeric`](#defaultnumeric)
    - [`defaultValue`](#defaultvalue)
    - [`isInstanceOf`](#isinstanceof)
    - [`isNumber`](#isnumber)
    - [`isObject`](#isobject)
  - [Utils](#utils)
    - [`assign`](#assign)
    - [`base64From`](#base64from)
    - [`base64FromBase64URLSafe`](#base64frombase64urlsafe)
    - [`base64FromBuffer`](#base64frombuffer)
    - [`base64To`](#base64to)
    - [`base64URLEncode`](#base64urlencode)
    - [`base64ToBuffer`](#base64tobuffer)
    - [`bufferCompare`](#buffercompare)
    - [`bufferConcatenate`](#bufferconcatenate)
    - [`bufferFromString`](#bufferfromstring)
    - [`bufferToString`](#buffertostring)
    - [`calculateSecondsInTime`](#calculatesecondsintime)
  - [`cleanObject`](#cleanobject)
    - [`currencyBRToFloat`](#currencybrtofloat)
    - [`dateFirstHourOfDay`](#datefirsthourofday)
    - [`dateLastHourOfDay`](#datelasthourofday)
    - [`dateToFormat`](#datetoformat)
    - [`debouncer`](#debouncer)
    - [`deleteKeys`](#deletekeys)
    - [`generateRandomString`](#generaterandomstring)
    - [`generateSimpleId`](#generatesimpleid)
    - [`getExecutionTime`](#getexecutiontime)
    - [`JSONFrom`](#jsonfrom)
    - [`JSONTo`](#jsonto)
    - [`messageDecryptFromChunks`](#messagedecryptfromchunks)
    - [`messageEncryptToChunks`](#messageencrypttochunks)
    - [`normalize`](#normalize)
    - [`pickKeys`](#pickkeys)
    - [`pushLogMessage`](#pushlogmessage)
    - [`regexDigitsOnly`](#regexdigitsonly)
    - [`regexLettersOnly`](#regexlettersonly)
    - [`regexReplaceTrim`](#regexreplacetrim)
    - [`removeDuplicatedStrings`](#removeduplicatedstrings)
    - [`sleep`](#sleep)
    - [`split`](#split)
    - [`stringCompress`](#stringcompress)
    - [`stringDecompress`](#stringdecompress)
    - [`stringToDate`](#stringtodate)
    - [`stringToDateToFormat`](#stringtodatetoformat)
    - [`stringToFormat`](#stringtoformat)
    - [`stringZLibCompress`](#stringzlibcompress)
    - [`stringZLibDecompress`](#stringzlibdecompress)
    - [`throttle`](#throttle)
    - [`timestamp`](#timestamp)
    - [`toString`](#tostring)
    - [`uint8ArrayFromString`](#uint8arrayfromstring)
    - [`uint8ArrayToString`](#uint8arraytostring)
  - [Validators](#validators)
    - [`validateCADICMSPR`](#validatecadicmspr)
    - [`validateCEP`](#validatecep)
    - [`validateChavePix`](#validatechavepix)
    - [`validateCNH`](#validatecnh)
    - [`validateCNPJ`](#validatecnpj)
    - [`validateCPF`](#validatecpf)
    - [`validateEmail`](#validateemail)
    - [`validatePISPASEPNIT`](#validatepispasepnit)
    - [`validateRenavam`](#validaterenavam)
    - [`validateRG`](#validaterg)
    - [`validateTituloEleitor`](#validatetituloeleitor)

---


## Constants

A biblioteca exporta um conjunto de constantes úteis para formatação e validação, como padrões de data para bibliotecas (ex: `date-fns`), máscaras para componentes de UI e expressões regulares comuns.

**Exemplo de Uso:**
[código javascript]
const { constants, dateToFormat } = require('misc-helpers');

const today = new Date();
// Formata a data usando uma constante
const formatted = dateToFormat(today, constants.DATE_BR_FORMAT_FS); // "23/08/2025"
[fim do bloco javascript]

---

### Formatos de Data

- `DATE_ISO_FORMAT_TZ`: Formato ISO 8601 completo com timezone (UTC/Zulu). Ex: `"2025-08-18T20:49:08.123Z"`
- `DATE_ISO_FORMAT`: Formato ISO 8601 sem timezone. Ex: `"2025-08-18T20:49:08.123"`
- `DATE_BR_FORMAT_D`: Formato de data brasileiro (dia-mês-ano). Ex: `"18-08-2025"`
- `DATE_BR_FORMAT_FS`: Formato de data brasileiro com barras. Ex: `"18/08/2025"`
- `DATE_BR_HOUR_FORMAT_D`: Formato de data e hora brasileiro. Ex: `"18-08-2025 20:49:08"`
- `DATE_BR_HOUR_FORMAT_FS`: Formato de data e hora brasileiro com barras. Ex: `"18/08/2025 20:49:08"`
- `DATE_BR_MONTH_FORMAT_D`: Formato de mês e ano brasileiro. Ex: `"08-2025"`
- `DATE_BR_MONTH_FORMAT_FS`: Formato de mês e ano brasileiro com barras. Ex: `"08/2025"`
- `DATE_EUA_FORMAT_D`: Formato de data americano (ano-mês-dia). Ex: `"2025-08-18"`
- `DATE_EUA_FORMAT_FS`: Formato de data americano com barras. Ex: `"2025/08/18"`
- `DATE_EUA_HOUR_FORMAT_D`: Formato de data e hora americano. Ex: `"2025-08-18 20:49:08"`
- `DATE_EUA_HOUR_FORMAT_FS`: Formato de data e hora americano com barras. Ex: `"2025/08/18 20:49:08"`
- `DATE_EUA_MONTH_FORMAT_D`: Formato de ano e mês americano. Ex: `"2025-08"`
- `DATE_EUA_MONTH_FORMAT_FS`: Formato de ano e mês americano com barras. Ex: `"2025/08"`

### Máscaras de Formatação

- `STRING_FORMAT_CADICMSPR`: Máscara para CAD/ICMS do Paraná. Ex: `"90312851-11"`
- `STRING_FORMAT_CEP`: Máscara para CEP. Ex: `"80000-000"`
- `STRING_FORMAT_CNPJ`: Máscara para CNPJ completo. Ex: `"12.345.678/0001-99"`
- `STRING_FORMAT_CNPJ_RAIZ`: Máscara para a raiz do CNPJ (8 primeiros caracteres). Ex: `"12.345.678"`
- `STRING_FORMAT_CPF`: Máscara para CPF. Ex: `"123.456.789-00"`
- `STRING_FORMAT_PHONE`: Máscara para Telefone Celular (9 dígitos + DDD). Ex: `"(41) 98888-8888"`
- `STRING_FORMAT_PROTOCOLPR`: Máscara para Protocolo do Paraná. Ex: `"123.456.789.1"`

### Expressões Regulares (Regex)

- `REGEX_CNPJ_ALPHANUMERIC`: Valida a estrutura de um CNPJ alfanumérico (12 caracteres alfanuméricos + 2 dígitos).
- `REGEX_EMAIL`: Valida um e-mail em formato padrão.
- `REGEX_PHONE_BR`: Valida um número de telefone brasileiro (10 ou 11 dígitos), com ou sem o DDI `+55`.
- `REGEX_UUID_V4`: Valida um UUID v4 (usado em Chave Aleatória PIX).

### Dados Geográficos

- `BRAZILIAN_STATES`: Objeto com as siglas e nomes dos estados brasileiros. Ex: `{ "PR": "Paraná" }`
- `BRAZILIAN_STATES_ABBR`: Array com as siglas dos estados brasileiros. Ex: `["PR", "SP", ...]`

---

## Auth

### WebAuthn

Utilitários para implementar a autenticação **WebAuthn (FIDO2)**, cobrindo tanto o fluxo de registro (client-side) quanto a validação das credenciais (server-side).

#### `getWebAuthnRegistrationCredential`
Inicia o processo de registro WebAuthn no navegador para criar uma nova credencial.

**Assinatura:** `getWebAuthnRegistrationCredential(props, callback?)`

**Exemplo:**
```javascript
const { getWebAuthnRegistrationCredential } = require('misc-helpers');

// Opções recebidas do servidor
const creationOptions = {
  challenge: new Uint8Array([...]),
  rp: { name: "My App", id: "localhost" },
  user: { id: new Uint8Array([...]), name: "user@email.com", displayName: "User" },
  pubKeyCredParams: [{ type: "public-key", alg: -7 }]
};

getWebAuthnRegistrationCredential(creationOptions)
  .then(credential => {
    // Enviar 'credential' para o servidor para validação
    console.log('Credencial criada:', credential);
  });
```

#### `getWebAuthnAuthenticationAssertion`
Inicia o processo de autenticação WebAuthn no navegador para obter uma asserção de login.

**Assinatura:** `getWebAuthnAuthenticationAssertion(props, callback?)`

**Exemplo:**
```javascript
const { getWebAuthnAuthenticationAssertion } = require('misc-helpers');

// Opções recebidas do servidor
const requestOptions = {
  challenge: new Uint8Array([...]),
  rpId: "localhost",
  allowCredentials: [{
    type: "public-key",
    id: new Uint8Array([...])
  }]
};

getWebAuthnAuthenticationAssertion(requestOptions)
  .then(assertion => {
    // Enviar 'assertion' para o servidor para validação
    console.log('Asserção de login obtida:', assertion);
  });
```

#### `validateRegistration`
Valida uma credencial de registro WebAuthn recém-criada (server-side). Verifica a estrutura, o challenge, a origem e a assinatura.

**Assinatura:** `validateRegistration(credential, expectedProps?)`

**Exemplo:**
```javascript
const { validateRegistration } = require('misc-helpers');

// 'credential' recebido do client-side
const credentialFromClient = { /* ... objeto da credencial ... */ };

// Propriedades esperadas que foram salvas na sessão do servidor
const expectedProps = {
  challenge: 'base64_encoded_challenge',
  origin: 'https://minha-app.com',
  rpID: 'minha-app.com'
};

try {
  const isValid = await validateRegistration(credentialFromClient, expectedProps);
  console.log('Registro Válido:', isValid); // true
} catch (e) {
  console.error('Falha na validação do registro:', e);
}
```

#### `validateAuthentication`
Valida uma asserção de autenticação WebAuthn (server-side). Verifica a assinatura, o challenge, a origem e o contador de segurança.

**Assinatura:** `validateAuthentication(credential, assertion, expectedProps?)`

**Exemplo:**
```javascript
const { validateAuthentication } = require('misc-helpers');

// 'credential' salvo no banco de dados
const userCredential = { /* ... objeto da credencial do usuário ... */ };
// 'assertion' recebido do client-side
const assertionFromClient = { /* ... objeto da asserção de login ... */ };

const expectedProps = {
  challenge: 'base64_encoded_challenge_de_login',
  origin: 'https://minha-app.com',
  rpID: 'minha-app.com',
  counterCredential: 123 // Último contador conhecido
};

try {
  const isValid = await validateAuthentication(userCredential, assertionFromClient, expectedProps);
  console.log('Autenticação Válida:', isValid); // true
} catch (e) {
  console.error('Falha na validação da autenticação:', e);
}
```

#### `validateRPID`
Valida o Relying Party ID (RPID) para garantir que corresponde ao domínio esperado.

**Assinatura:** `validateRPID(rpID)`

#### `convertECDSAASN1Signature`
Converte uma assinatura ECDSA do formato ASN.1/DER para o formato concatenado r|s, necessário para validações criptográficas.

**Assinatura:** `convertECDSAASN1Signature(asn1Signature)`

#### `getRegistrationAuthData`
Função auxiliar para extrair e decodificar dados de uma credencial de registro WebAuthn.

**Assinatura:** `getRegistrationAuthData(credential)`

#### `getAuthenticationAuthData`
Função auxiliar para extrair e decodificar dados de uma asserção de autenticação WebAuthn.

**Assinatura:** `getAuthenticationAuthData(assertion)`

---

## Crypto

Oferece um conjunto de funções de alto nível para operações criptográficas comuns, como encriptação, hashing e verificação de assinaturas, utilizando a Web Crypto API de forma compatível com Node.js e navegadores.

### `decrypt`
Descriptografa uma mensagem em Base64 usando uma chave privada RSA-OAEP.

**Assinatura:** `decrypt(privateKey, encryptedMessage, props?)`

**Exemplo:**
```javascript
const { decrypt } = require('misc-helpers');

const privateKeyPEM = `-----BEGIN PRIVATE KEY-----...`;
const encryptedMessageBase64 = '...';

decrypt(privateKeyPEM, encryptedMessageBase64)
  .then(decryptedMessage => {
    console.log('Mensagem Descriptografada:', decryptedMessage); // "Hello, World!"
  })
  .catch(console.error);
```

---

## `decryptBuffer`
Descriptografa uma mensagem em Base64 para um `Buffer` ou `Uint8Array`. Ideal para quando o resultado final precisa ser binário.

**Assinatura:** `decryptBuffer(privateKey, encryptedMessage, props?)`

**Exemplo:**
```javascript
const { decryptBuffer, bufferToString } = require('misc-helpers');

const privateKeyPEM = `-----BEGIN PRIVATE KEY-----...`;
const encryptedMessageBase64 = '...'; // Mensagem criptografada pela encryptBuffer

decryptBuffer(privateKeyPEM, encryptedMessageBase64)
  .then(decryptedBuffer => {
    // O resultado é um buffer. Use um utilitário para visualizá-lo como string.
    console.log('Buffer Descriptografado:', decryptedBuffer);
    console.log('Mensagem Original:', bufferToString(decryptedBuffer)); // "Dados secretos em um buffer"
  })
  .catch(console.error);
```

---

### `digest`
Calcula o hash criptográfico (digest) de uma string ou `Uint8Array`.

**Assinatura:** `digest(algorithm, data)`

**Exemplo:**
```javascript
const { digest, bufferToString } = require('misc-helpers');

async function hashData() {
  const data = "Esta é uma mensagem secreta";
  const hashArray = await digest('SHA-256', data);
  
  // O resultado é um Uint8Array. Podemos convertê-lo para ver.
  const hashHex = bufferToString(hashArray, 'hex');
  console.log('Hash SHA-256 (hex):', hashHex);
}

hashData();
```

---

### `encrypt`
Encriptografa uma mensagem usando uma chave pública RSA-OAEP e retorna o resultado em Base64.

**Assinatura:** `encrypt(publicKey, message, props?)`

**Exemplo:**
```javascript
const { encrypt } = require('misc-helpers');

const publicKeyPEM = `-----BEGIN PUBLIC KEY-----...`;
const message = 'Hello, World!';

encrypt(publicKeyPEM, message)
  .then(encryptedMessage => {
    console.log('Mensagem Criptografada (Base64):', encryptedMessage);
  })
  .catch(console.error);
```

---

## `encryptBuffer`
Criptografa um `Buffer` ou `Uint8Array` usando uma chave pública RSA-OAEP e retorna o resultado em Base64.

**Assinatura:** `encryptBuffer(publicKey, messageBuffer, props?)`

**Exemplo:**
```javascript
const { encryptBuffer, bufferFromString } = require('misc-helpers');

const publicKeyPEM = `-----BEGIN PUBLIC KEY-----...`;
const message = 'Dados secretos em um buffer';

// Primeiro, converta a mensagem para um buffer
const messageBuffer = bufferFromString(message);

encryptBuffer(publicKeyPEM, messageBuffer)
  .then(encryptedMessage => {
    console.log('Mensagem Criptografada (Base64):', encryptedMessage);
  })
  .catch(console.error);
```

---

### `getCrypto`
Obtém o objeto `crypto` nativo para operações da Web Crypto API, garantindo compatibilidade entre Node.js e navegadores.

**Assinatura:** `getCrypto()`

**Exemplo:**
```javascript
const { getCrypto } = require('misc-helpers');

// Acesso direto à API de criptografia do ambiente
const crypto = getCrypto();
console.log(crypto.subtle); // Acessa as funções criptográficas
```

---

### `importCryptoKey`
Importa uma chave em formato PEM (string) ou `BufferSource` para um objeto `CryptoKey` utilizável pela Web Crypto API.

**Assinatura:** `importCryptoKey(format, keyData, algorithm, extractable, keyUsages)`

**Exemplo:**
```javascript
const { importCryptoKey } = require('misc-helpers');

const publicKeyPEM = `-----BEGIN PUBLIC KEY-----...`;

// Converte a chave PEM para um formato que pode ser usado em 'verifySignature'
importCryptoKey(
  'spki',
  publicKeyPEM,
  { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
  true,
  ['verify']
).then(cryptoKey => {
  console.log('Chave importada com sucesso!', cryptoKey);
});
```

---

### `verifySignature`
Verifica se uma assinatura digital corresponde aos dados e à chave pública fornecidos.

**Assinatura:** `verifySignature(algorithm, key, signature, data)`
**Retorna:** `Promise<boolean>` - Resolve para `true` se a assinatura for válida, caso contrário `false`.

**Exemplo:**
```javascript
const { verifySignature, importCryptoKey, bufferFromString, base64ToBuffer } = require('misc-helpers');

async function checkSignature() {
  const publicKeyPEM = `-----BEGIN PUBLIC KEY-----...`; // Chave de quem assinou
  const message = "dados que foram assinados";
  const signatureBase64 = '...'; // Assinatura recebida em base64

  // 1. Importa a chave pública para um objeto CryptoKey
  const cryptoKey = await importCryptoKey(
    'spki',
    publicKeyPEM,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    true,
    ['verify']
  );
  
  // 2. Converte os dados para o formato de buffer
  const dataBuffer = bufferFromString(message);
  const signatureBuffer = base64ToBuffer(signatureBase64);

  // 3. Verifica a assinatura
  const isValid = await verifySignature(
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    cryptoKey,
    signatureBuffer,
    dataBuffer
  );

  console.log('A assinatura é válida?', isValid);
}

checkSignature();
```

--- 

## Custom

Funcionalidades mais complexas e classes que resolvem problemas específicos de aplicação.

### `BulkProcessor` - Processador de Lotes Assíncrono

Uma classe de alta performance para processamento de dados em lote (`bulk`). Ela abstrai a complexidade de acumular itens, enviá-los em batches, e gerenciar concorrência, retries e finalização segura. É ideal para otimizar operações de I/O, como inserções em banco de dados ou chamadas para APIs.

**Exemplo de Uso:**
```javascript
const { custom } = require('misc-helpers');

const processor = new custom.bulkProcessor({
  limit: 100, // Envia o lote quando atingir 100 itens
  maxConcurrentFlushes: 5, // Processa até 5 lotes em paralelo
  retries: 2, // Tenta reprocessar um lote falho até 2 vezes
  onFlush: async ({ batch }) => {
    console.log(`Processando ${batch.length} itens...`);
    // await database.insertMany(batch);
  },
  onFlushFailure: async ({ batch, error }) => {
    console.error(`Falha definitiva ao processar lote de ${batch.length} itens.`, error);
    // Salvar em uma "dead-letter queue"
  }
});

async function main() {
  for (let i = 0; i < 1000; i++) {
    await processor.add({ id: i, data: `item-${i}` });
  }
  await processor.end(); // Essencial para garantir que todos os itens sejam processados
}

main();
```

**Opções do Construtor:**

| Opção                  | Descrição                                                                         | Padrão            |
| :--------------------- | :-------------------------------------------------------------------------------- | :---------------- |
| `limit`                | Nº de itens para acionar um `flush`.                                              | `1000`            |
| `maxBufferSize`        | Tamanho máx. do buffer antes de ativar backpressure.                              | `limit * 2`       |
| `maxConcurrentFlushes` | Nº de `onFlush` que podem rodar em paralelo.                                      | `3`               |
| `retries`              | Nº de novas tentativas para um `onFlush` falho.                                   | `0`               |
| `retryDelayMs`         | Atraso em ms entre as tentativas.                                                 | `1000`            |
| `flushTimeoutMs`       | Timeout em ms para uma única operação `onFlush`.                                  | `30000`           |
| `onFlush`              | `(async ({ batch }) => {})` - Callback para processar o lote.                     | `undefined`       |
| `onFlushFailure`       | `(async ({ batch, error }) => {})` - Callback para falha definitiva.              | `undefined`       |
| `onBackpressure`       | `(async ({ bufferSize }) => {})` - Callback para quando o backpressure é ativado. | `undefined`       |
| `logger`               | Objeto de logger (ex: `console`).                                                 | Logger silencioso |
| `payload`              | Objeto estático passado para todos os callbacks.                                  | `{}`              |
| `serviceContext`       | Contexto dinâmico passado para todos os callbacks.                                | `null`            |

---

### DB Sequelize

Um conjunto de helpers para construir cláusulas `where` dinâmicas em queries do Sequelize.

#### `setConditionBetweenDates`
Cria uma condição `$and` com `$gte` (maior ou igual) e `$lte` (menor ou igual) para um campo de data, facilitando a criação de filtros por período.

**Assinatura:** `setConditionBetweenDates(object, fromFormat?, key?, beforeKey?, afterKey?, resetHMS?)`

**Exemplo:**
```javascript
const { setConditionBetweenDates } = require('misc-helpers');

const whereClause = {
  created_at_from: '01-01-2025',
  created_at_until: '31-01-2025',
  status: 'active'
};

setConditionBetweenDates(whereClause);
// console.log(whereClause) resulta em:
// {
//   created_at: {
//     '$and': [ { '$gte': Date('2025-01-01T03:00:00.000Z') }, { '$lte': Date('2025-01-31T02:59:59.999Z') } ]
//   },
//   status: 'active'
// }
```

#### `setConditionBetweenValues`
Similar ao `setConditionBetweenDates`, mas para valores genéricos (como números), criando uma condição de intervalo.

**Assinatura:** `setConditionBetweenValues(object, key?, beforeKey?, afterKey?)`

**Exemplo:**
```javascript
const { setConditionBetweenValues } = require('misc-helpers');

const whereClause = {
  price_from: 100,
  price_until: 500
};

setConditionBetweenValues(whereClause, 'price');
// console.log(whereClause) resulta em:
// { price: { '$and': [ { '$gte': 100 }, { '$lte': 500 } ] } }
```

#### `setConditionStringLike`
Formata um valor de string em um objeto de condição `$iLike` (case-insensitive) ou `$like` (case-sensitive) para o Sequelize.

**Assinatura:** `setConditionStringLike(object, key, insensitive?)`

**Exemplo:**
```javascript
const { setConditionStringLike } = require('misc-helpers');

const whereClause = { name: 'John', status: 'active' };

// Case-insensitive (padrão)
setConditionStringLike(whereClause, 'name');
// console.log(whereClause) resulta em:
// { name: { '$iLike': '%John%' }, status: 'active' }

// Case-sensitive
setConditionStringLike(whereClause, 'status', false);
// console.log(whereClause) agora resulta em:
// { name: { '$iLike': '%John%' }, status: { '$like': '%active%' } }
```

---

### WaitPlugin

Uma classe simples para gerenciar e aguardar a finalização de múltiplas operações assíncronas nomeadas. Útil para coordenar tarefas em background.

**Exemplo de Uso:**
```javascript
const { waitPlugin } = require('misc-helpers');

async function processOrder(orderId) {
  const waitPromise = waitPlugin.startWait(`order_${orderId}`);
  console.log(`Processando pedido ${orderId}...`);
  
  // Simula uma tarefa que pode falhar ou ter sucesso
  setTimeout(() => {
    if (Math.random() > 0.5) {
      waitPlugin.finishWait(`order_${orderId}`, true, { orderId, status: 'Completed' });
    } else {
      waitPlugin.finishWait(`order_${orderId}`, false, new Error('Payment failed'));
    }
  }, 1000);

  return waitPromise;
}

// Inicia duas operações e aguarda seus resultados individuais
Promise.allSettled([
  processOrder('A123'),
  processOrder('B456')
]).then(results => {
  console.log(results);
});
```

**API do `waitPlugin`:**

- **`startWait(name)`**: Inicia uma operação de espera com um `name` (string) único. Retorna uma `Promise` que será resolvida ou rejeitada quando `finishWait` for chamado.
- **`finishWait(name, isSuccessful?, returnParam?)`**: Finaliza uma operação de espera. Se `isSuccessful` for `true` (padrão), a `Promise` correspondente é resolvida com `returnParam`. Se for `false`, a `Promise` é rejeitada com `returnParam`.
- **`finishAll(isSuccessful, returnParam?)`**: Finaliza **todas** as operações de espera pendentes de uma só vez.

---

## Helpers

Funções auxiliares de propósito geral para tarefas comuns de verificação e manipulação de dados.

### `dateCompareAsc`
Compara duas datas para verificar se a primeira (`dateA`) é cronologicamente anterior à segunda (`dateB`).

**Assinatura:** `dateCompareAsc(dateA, dateB, options?)`

**Exemplo:**
```javascript
const { dateCompareAsc } = require('misc-helpers');

const earlierDate = new Date('2025-01-01T12:00:00Z');
const laterDate = new Date('2025-01-02T12:00:00Z');

// Retorna true porque a primeira data é anterior à segunda
console.log(dateCompareAsc(earlierDate, laterDate)); // true
```

---

### `dateCompareDesc`
Compara duas datas para verificar se a primeira (`dateA`) é cronologicamente posterior à segunda (`dateB`).

**Assinatura:** `dateCompareDesc(dateA, dateB, options?)`

**Exemplo:**
```javascript
const { dateCompareDesc } = require('misc-helpers');

const laterDate = new Date('2025-01-02T12:00:00Z');
const earlierDate = new Date('2025-01-01T12:00:00Z');

// Retorna true porque a primeira data é posterior à segunda
console.log(dateCompareDesc(laterDate, earlierDate)); // true
```

---

### `defaultNumeric`
Retorna um valor numérico válido ou o valor padrão (`defaultValue`) caso o valor verificado (`checkValue`) não seja um número finito (ex: `NaN`, `Infinity`).

**Assinatura:** `defaultNumeric(checkValue, defaultValue)`

**Exemplo:**
```javascript
const { defaultNumeric } = require('misc-helpers');

// Casos de substituição
defaultNumeric("abc", 10);     // Retorna 10
defaultNumeric(NaN, 5);        // Retorna 5
defaultNumeric(Infinity, 2);   // Retorna 2

// Casos válidos
defaultNumeric(7, 1);          // Retorna 7
defaultNumeric("-12", 1);      // Retorna -12
defaultNumeric(1.9, 1);        // Retorna 1.9
```

---

### `defaultValue`
Retorna um valor padrão caso o valor fornecido seja `null` ou `undefined`.

**Assinatura:** `defaultValue(checkValue, defaultValue)`

**Exemplo:**
```javascript
const { defaultValue } = require('misc-helpers');

let userConfig = null;
const finalConfig = defaultValue(userConfig, { theme: 'dark' });

console.log(finalConfig); // { theme: 'dark' }
```

---

### `isInstanceOf`
Verifica se um objeto é uma instância de um determinado tipo (classe).

**Assinatura:** `isInstanceOf(object, instanceType)`

**Exemplo:**
```javascript
const { isInstanceOf } = require('misc-helpers');

class User {}
const user = new User();
const notAUser = { name: 'guest' };

console.log(isInstanceOf(user, User)); // true
console.log(isInstanceOf(notAUser, User)); // false
```

---

### `isNumber`
Verifica se o valor fornecido é estritamente do tipo `number`, excluindo strings numéricas.

**Assinatura:** `isNumber(value)`

**Exemplo:**
```javascript
const { isNumber } = require('misc-helpers');

console.log(isNumber(42));    // true
console.log(isNumber(3.14));  // true
console.log(isNumber('42'));  // false
```

---

### `isObject`
Verifica se o valor fornecido é um objeto (e não `null` ou um array).

**Assinatura:** `isObject(object)`

**Exemplo:**
```javascript
const { isObject } = require('misc-helpers');

console.log(isObject({ a: 1 })); // true
console.log(isObject('Hello'));    // false
console.log(isObject(null));       // false
console.log(isObject([1, 2]));     // false
```

---

## Utils

Uma coleção ampla de funções utilitárias para manipulação de strings, buffers, datas, objetos e controle de fluxo assíncrono.

### `assign`
Cria um novo objeto mesclando as propriedades de um objeto de origem (`source`) em um objeto de destino (`target`). As propriedades do `source` sobrescrevem as do `target`.

**Assinatura:** `assign(target, source, throwsError?)`

**Exemplo:**
```javascript
const { assign } = require('misc-helpers');

const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

const result = assign(target, source);
console.log(result); // { a: 1, b: 3, c: 4 }
```

---

### `base64From`
Decodifica uma string em Base64 para texto puro (UTF-8).

**Assinatura:** `base64From(text, toString?)`

**Exemplo:**
```javascript
const { base64From } = require('misc-helpers');

const base64String = "SGVsbG8gV29ybGQ="; // "Hello World" em Base64
const decodedText = base64From(base64String);

console.log(decodedText); // "Hello World"
```

---

### `base64FromBase64URLSafe`
Converte uma string Base64 no formato URL-safe (usando `-` e `_`) para o formato padrão Base64 (usando `+` e `/`) e adiciona padding (`=`) se necessário.

**Assinatura:** `base64FromBase64URLSafe(urlSafeBase64)`

**Exemplo:**
```javascript
const { base64FromBase64URLSafe } = require('misc-helpers');

const urlSafeString = 'rqXRQrq_mSFhX4c2wSZJrA';
const standardBase64 = base64FromBase64URLSafe(urlSafeString);

console.log(standardBase64); // "rqXRQrq/mSFhX4c2wSZJrA=="
```

---

### `base64FromBuffer`
Converte um `ArrayBuffer` para uma string em formato Base64.

**Assinatura:** `base64FromBuffer(buffer)`

**Exemplo:**
```javascript
const { base64FromBuffer, bufferFromString } = require('misc-helpers');

const buffer = bufferFromString("Olá Mundo");
const base64 = base64FromBuffer(buffer.buffer); // .buffer para obter o ArrayBuffer

console.log(base64); // "T2zDoCBNdW5kbw=="
```

---

### `base64To`
Codifica uma string de texto para o formato Base64.

**Assinatura:** `base64To(text, fromFormat?)`

**Exemplo:**
```javascript
const { base64To } = require('misc-helpers');

const base64String = base64To("Hello, world!");
console.log(base64String); // "SGVsbG8sIHdvcmxkIQ=="
```

### `base64URLEncode`
Converte uma string no formato padrão Base64 para o formato URL-safe, substituindo os caracteres `+` e `/` e removendo o padding `=`.

**Assinatura:** `base64URLEncode(base64String)`
**Retorna:** `String` - A string no formato Base64 URL-safe.

**Exemplo:**
```javascript
const { base64URLEncode } = require('misc-helpers');

// Uma string Base64 padrão que contém caracteres não seguros para URL
const standardBase64 = "rqXRQrq/mSFhX4c2wSZJrA==";
const urlSafe = base64URLEncode(standardBase64);

console.log(urlSafe); // "rqXRQrq_mSFhX4c2wSZJrA"
```

---

### `base64ToBuffer`
Converte uma string em Base64 para um `Buffer` (Node.js) ou `Uint8Array` (Navegador).

**Assinatura:** `base64ToBuffer(base64String)`

**Exemplo:**
```javascript
const { base64ToBuffer, bufferToString } = require('misc-helpers');

const base64String = "SGVsbG8sIHdvcmxkIQ==";
const buffer = base64ToBuffer(base64String);

console.log(buffer); // <Buffer 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21>
console.log(bufferToString(buffer)); // "Hello, world!"
```

---

### `bufferCompare`
Compara dois `ArrayBuffer`s para verificar se seus conteúdos são idênticos.

**Assinatura:** `bufferCompare(buffer1, buffer2)`

**Exemplo:**
```javascript
const { bufferCompare, bufferFromString } = require('misc-helpers');

const bufferA = bufferFromString("abc").buffer;
const bufferB = bufferFromString("abc").buffer;
const bufferC = bufferFromString("def").buffer;

console.log(bufferCompare(bufferA, bufferB)); // true
console.log(bufferCompare(bufferA, bufferC)); // false
```

---

### `bufferConcatenate`
Concatena dois `ArrayBuffer`s em um novo `ArrayBuffer`.

**Assinatura:** `bufferConcatenate(buffer1, buffer2)`

**Exemplo:**
```javascript
const { bufferConcatenate, bufferFromString, bufferToString } = require('misc-helpers');

const bufferA = bufferFromString("Hello ").buffer;
const bufferB = bufferFromString("World").buffer;

const combined = bufferConcatenate(bufferA, bufferB);
console.log(bufferToString(new Uint8Array(combined))); // "Hello World"
```

---

### `bufferFromString`
Converte uma string para um `Buffer` (no ambiente Node.js) ou `Uint8Array` (no navegador).

**Assinatura:** `bufferFromString(txtString, encoding?)`

**Exemplo:**
```javascript
const { bufferFromString } = require('misc-helpers');

const buffer = bufferFromString('Olá Mundo!', 'utf-8');
console.log(buffer);
```

---

### `bufferToString`
Converte um `Buffer` (no ambiente Node.js) ou `Uint8Array` (no navegador) para uma string.

**Assinatura:** `bufferToString(buffer, encoding?)`

**Exemplo:**
```javascript
const { bufferToString } = require('misc-helpers');

// Em Node.js
const bufferNode = Buffer.from('Hello, World!');
console.log(bufferToString(bufferNode)); // "Hello, World!"

// Em Navegador
const bufferBrowser = new Uint8Array([72, 101, 108, 108, 111]);
console.log(bufferToString(bufferBrowser)); // "Hello"
```

---

### `calculateSecondsInTime`
Calcula um timestamp futuro ou passado, adicionando ou subtraindo um número de segundos da hora atual.

**Assinatura:** `calculateSecondsInTime(seconds, add?)`
**Retorna:** `Number` - O timestamp em milissegundos.

**Exemplo:**
```javascript
const { calculateSecondsInTime } = require('misc-helpers');

// Adiciona 60 segundos à hora atual
const timeInOneMinute = calculateSecondsInTime(60);
console.log(new Date(timeInOneMinute));

// Subtrai 60 segundos da hora atual
const timeOneMinuteAgo = calculateSecondsInTime(60, false);
console.log(new Date(timeOneMinuteAgo));
```

---

## `cleanObject`
Cria uma cópia 'limpa' de um objeto, removendo recursivamente chaves com valores vazios, nulos ou indesejados, com segurança contra referências circulares.

**Assinatura:** `cleanObject(sourceObject, options?)`

**Parâmetros:**
* `sourceObject` (`any`): O objeto ou valor a ser limpo. Se a entrada não for um objeto simples (plain object), ela será retornada sem modificações.
* `options` (`object`, opcional): Um objeto para customizar o comportamento da limpeza.
    * `options.recursive` (`boolean`, padrão: `true`): Se `true`, a função é aplicada recursivamente a objetos aninhados.
    * `options.considerNullValue` (`boolean`, padrão: `false`): Se `false`, chaves com valor `null` são removidas. Se `true`, são mantidas.
    * `options.considerFalseValue` (`boolean`, padrão: `true`): Se `true`, chaves com valor `false` são mantidas. Se `false`, são removidas.

**Retorna:** (`object | any`) - Um novo objeto 'limpo', `{}` se o objeto original se tornar vazio, ou o valor original se a entrada não for um objeto simples.

**Exemplo 1: Uso Básico**
```javascript
const { cleanObject } = require('misc-helpers');

const dirtyObject = {
  name: 'Produto A',
  price: 100,
  description: '',
  stock: 0,
  metadata: {},
  category: null,
  available: false,
  notes: undefined,
  attributes: []
};

const cleaned = cleanObject(dirtyObject);
// Retorna: { name: 'Produto A', price: 100, stock: 0, available: false }
console.log(cleaned);
```

**Exemplo 2: Recursividade e Tipos Especiais**
```javascript
const sym = Symbol('id');

const nestedDirty = {
  [sym]: 'xyz-123',
  user: {
    name: 'Jane Doe',
    email: null,
    registeredAt: new Date(),
  },
  validator: /^[a-z]+$/,
  order: null
};

const cleanedNested = cleanObject(nestedDirty);
/*
Retorna:
{
  [sym]: 'xyz-123',
  user: {
    name: 'Jane Doe',
    registeredAt: [Date Object]
  },
  validator: /^[a-z]+$/
}
*/
console.log(cleanedNested);
```

**Exemplo 3: Usando Opções**
```javascript
const data = {
  isActive: false,
  user: null,
  id: 123
};

const cleanedWithOptions = cleanObject(data, {
  considerNullValue: true,  // Manter o `null`
  considerFalseValue: false // Remover o `false`
});

// Retorna: { user: null, id: 123 }
console.log(cleanedWithOptions);
```

**Exemplo 4: Segurança contra Referência Circular**
```javascript
const objA = { name: 'A' };
const objB = { name: 'B', parent: objA };
objA.child = objB; // Cria o ciclo: A -> B -> A

const cleanedCycle = cleanObject(objA);

// A função não trava e quebra o ciclo.
// Retorna: { name: 'A', child: { name: 'B' } }
// A propriedade 'parent' que criaria o ciclo é removida.
console.log(JSON.stringify(cleanedCycle, null, 2));
```
---

### `currencyBRToFloat`
Converte uma string de moeda no formato Real (BRL), como 'R$ 1.234,56', para um número de ponto flutuante (float).

**Assinatura:** `currencyBRToFloat(moneyString)`
**Retorna:** `Number | Boolean` - O valor em float, ou `false` se a conversão falhar.

**Exemplo:**
```javascript
const { currencyBRToFloat } = require('misc-helpers');

console.log(currencyBRToFloat("R$ 1.234,56")); // 1234.56
console.log(currencyBRToFloat("R$ 999,99"));   // 999.99
console.log(currencyBRToFloat("R$ ABC"));      // false
```

---

### `dateFirstHourOfDay`
Retorna um novo objeto `Date` ajustado para o primeiro momento do dia (00:00:00.000).

**Assinatura:** `dateFirstHourOfDay(date)`

**Exemplo:**
```javascript
const { dateFirstHourOfDay } = require('misc-helpers');

const today = new Date(); // ex: 2025-08-23T19:30:15.123Z
const startOfDay = dateFirstHourOfDay(today);

console.log(startOfDay); // 2025-08-23T03:00:00.000Z (considerando fuso -3)
```

---

### `dateLastHourOfDay`
Retorna um novo objeto `Date` ajustado para o último momento do dia (23:59:59.999).

**Assinatura:** `dateLastHourOfDay(date)`

**Exemplo:**
```javascript
const { dateLastHourOfDay } = require('misc-helpers');

const today = new Date(); // ex: 2025-08-23T19:30:15.123Z
const endOfDay = dateLastHourOfDay(today);

console.log(endOfDay); // 2025-08-24T02:59:59.999Z (considerando fuso -3)
```

---

### `dateToFormat`
Formata um objeto `Date` em uma string, de acordo com um padrão especificado (ex: 'dd/MM/yyyy').

**Assinatura:** `dateToFormat(date, stringFormat?)`

**Exemplo:**
```javascript
const { constants, dateToFormat } = require('misc-helpers');

const today = new Date();
const formattedDate = dateToFormat(today, constants.DATE_BR_FORMAT_FS);

console.log(formattedDate); // "23/08/2025"
```

---

### `debouncer`
Cria uma versão "debounced" de uma função, que só é executada após um período de inatividade, evitando múltiplas execuções rápidas.

**Assinatura:** `debouncer(callback, timeout?)`

**Exemplo:**
```javascript
const { debouncer } = require('misc-helpers');

// Função que simula uma busca em API
function searchAPI(query) {
  console.log(`Buscando por: ${query}...`);
}

// Cria a versão "debounced" com 500ms de espera
const debouncedSearch = debouncer(searchAPI, 500);

// Simula um usuário digitando rapidamente
debouncedSearch("a");
debouncedSearch("ap");
debouncedSearch("appl");
debouncedSearch("apple"); // Apenas esta chamada será executada, 500ms após ser digitada.
```

---

### `deleteKeys`
Remove uma ou mais chaves de um objeto, retornando um novo objeto sem as chaves especificadas.

**Assinatura:** `deleteKeys(object, keys)`

**Exemplo:**
```javascript
const { deleteKeys } = require('misc-helpers');

const user = {
  id: 1,
  username: "john_doe",
  email: "john.doe@example.com",
  password: "password123",
};

const publicUser = deleteKeys(user, ["password", "email"]);

console.log(publicUser); // { id: 1, username: 'john_doe' }
```

---

### `generateRandomString`
Gera uma string aleatória de tamanho customizável, com opções para incluir ou excluir tipos de caracteres.

**Assinatura:** `generateRandomString(size?, options?)`

**Exemplo:**
```javascript
const { generateRandomString } = require('misc-helpers');

// String aleatória padrão de 32 caracteres
console.log(generateRandomString());

// String de 8 caracteres contendo apenas letras maiúsculas e minúsculas
const token = generateRandomString(8, {
  excludeDigits: true,
  excludeSymbols: true
});
console.log(token);
```

---

### `generateSimpleId`
Gera um identificador único e simples, combinando um texto base com o timestamp atual e um número aleatório.

**Assinatura:** `generateSimpleId(id, separator?)`
**Retorna:** `String` - O novo identificador.

**Exemplo:**
```javascript
const { generateSimpleId } = require('misc-helpers');

// Gera um ID com separador padrão "_"
const id1 = generateSimpleId("user");
console.log(id1); // "user_1724455823789_a4f8" (exemplo)

// Gera um ID com separador customizado "-"
const id2 = generateSimpleId("session", "-");
console.log(id2); // "session-1724455823789-b9c1" (exemplo)
```

---

### `getExecutionTime`
Calcula o tempo de execução decorrido em milissegundos a partir de um tempo de referência de alta resolução (`process.hrtime`).

**Assinatura:** `getExecutionTime(time)`
**Retorna:** `BigInt` - O tempo decorrido em milissegundos.

**Exemplo:**
```javascript
const { getExecutionTime, sleep } = require('misc-helpers');

async function measure() {
  const start = process.hrtime();
  await sleep(100); // Simula uma operação de 100ms
  const end = getExecutionTime(start);
  
  console.log(`Tempo de execução: ${end} ms`); // Próximo de 100
}

measure();
```

---

### `JSONFrom`
Converte uma string JSON para um objeto JavaScript, com controle sobre o lançamento de erros em caso de falha no parsing.

**Assinatura:** `JSONFrom(text, throwsError?)`

**Exemplo:**
```javascript
const { JSONFrom } = require('misc-helpers');

const validJson = '{"name": "John", "age": 30}';
const invalidJson = '{"name": "John",}';

console.log(JSONFrom(validJson)); // { name: 'John', age: 30 }

// Com throwsError: false, retorna null em vez de lançar erro
console.log(JSONFrom(invalidJson, false)); // null
```

---

### `JSONTo`
Converte um objeto JavaScript para uma string JSON, com controle sobre o lançamento de erros.

**Assinatura:** `JSONTo(object, throwsError?)`

**Exemplo:**
```javascript
const { JSONTo } = require('misc-helpers');

const user = { name: 'Jane', id: 123 };
console.log(JSONTo(user)); // '{"name":"Jane","id":123}'

// Tenta converter um objeto com referência circular
const circular = {};
circular.self = circular;
console.log(JSONTo(circular, false)); // null
```

---

### `messageDecryptFromChunks`
Descriptografa uma mensagem que foi dividida em múltiplos pedaços (chunks) criptografados com uma chave privada RSA.

**Assinatura:** `messageDecryptFromChunks(privateKey, messageChunks, props?)`

**Exemplo:**
```javascript
const { messageDecryptFromChunks } = require('misc-helpers');

// Chave privada (geralmente lida de um arquivo ou variável de ambiente)
const privateKeyPEM = `-----BEGIN PRIVATE KEY-----...`;

// Chunks criptografados recebidos
const encryptedChunks = [ 'chunk1_base64', 'chunk2_base64' ];

messageDecryptFromChunks(privateKeyPEM, encryptedChunks)
  .then(decrypted => console.log('Mensagem original:', decrypted));
```

---

### `messageEncryptToChunks`
Criptografa uma mensagem longa dividindo-a em múltiplos pedaços (chunks) para contornar os limites de tamanho da encriptação RSA.

**Assinatura:** `messageEncryptToChunks(publicKey, message, props?)`

**Exemplo:**
```javascript
const { messageEncryptToChunks } = require('misc-helpers');

const publicKeyPEM = `-----BEGIN PUBLIC KEY-----...`;
const longMessage = "Esta é uma mensagem muito longa que excede o limite de um único bloco RSA...";

messageEncryptToChunks(publicKeyPEM, longMessage)
  .then(chunks => console.log('Chunks criptografados:', chunks));
```

---

### `normalize`
Normaliza uma string, removendo acentos, caracteres especiais e convertendo para letras minúsculas. Ideal para buscas e comparações.

**Assinatura:** `normalize(text)`

**Exemplo:**
```javascript
const { normalize } = require('misc-helpers');

const text = "Atenção: João e Maria saíram às 15h.";
const normalized = normalize(text);

console.log(normalized); // "atencao joao e maria sairam as 15h"
```

### `pickKeys`
Cria um novo objeto contendo apenas as chaves especificadas de um objeto de origem. Chaves que não existem no objeto original são simplesmente ignoradas.

**Assinatura:** `pickKeys(sourceObject, keysToPick)`
**Retorna:** `Object` - Um novo objeto contendo apenas as propriedades selecionadas.

**Exemplo:**
```javascript
const { pickKeys } = require('misc-helpers');

const user = {
  id: 123,
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  password: 'super_secret_password',
  isAdmin: false
};

// Seleciona apenas os campos que são seguros para expor publicamente
const keysToExpose = ['id', 'name', 'email'];
const publicUser = pickKeys(user, keysToExpose);

console.log(publicUser);
// { id: 123, name: 'Jane Doe', email: 'jane.doe@example.com' }
```

---

### `pushLogMessage`
Adiciona uma nova entrada a um array de log, incluindo timestamp, mensagem e informações adicionais.

**Assinatura:** `pushLogMessage(logObj, message, more_info?)`

**Exemplo:**
```javascript
const { pushLogMessage } = require('misc-helpers');

let log = [];
log = pushLogMessage(log, "Usuário acessou a página inicial.");
log = pushLogMessage(log, "Falha ao carregar dados.", { error: "API_TIMEOUT" });

console.log(log);
// [
//   { time: '...', message: 'Usuário acessou a página inicial.' },
//   { time: '...', message: 'Falha ao carregar dados.', info: { error: 'API_TIMEOUT' } }
// ]
```

---

### `regexDigitsOnly`
Extrai e retorna apenas os dígitos (`0-9`) de uma string.

**Assinatura:** `regexDigitsOnly(text)`
**Retorna:** `String` - Uma string contendo apenas os dígitos do texto original.

**Exemplo:**
```javascript
const { regexDigitsOnly } = require('misc-helpers');

const text = "Pedido #A45-B67, valor R$ 99,90";
const digits = regexDigitsOnly(text);

console.log(digits); // "45679990"
```

---

### `regexLettersOnly`
Extrai e retorna apenas as letras (a-z, A-Z) de uma string, removendo números, símbolos e espaços.

**Assinatura:** `regexLettersOnly(text)`
**Retorna:** `String` - Uma string contendo apenas as letras do texto original.

**Exemplo:**
```javascript
const { regexLettersOnly } = require('misc-helpers');

const text = "Olá, Mundo 123!";
const letters = regexLettersOnly(text);

console.log(letters); // "OláMundo"
```

---

### `regexReplaceTrim`
Remove caracteres indesejados de uma string, mantendo apenas os que correspondem a uma regex e aplicando trim no resultado.

**Assinatura:** `regexReplaceTrim(text, regex?, replacement?)`

**Exemplo:**
```javascript
const { regexReplaceTrim } = require('misc-helpers');

// Mantém apenas números e o caractere 'x'
const text = " (41) 98888-8888 ramal x123 ";
const cleanText = regexReplaceTrim(text, "0-9x");

console.log(cleanText); // "41988888888x123"
```

---

### `removeDuplicatedStrings`
Remove substrings duplicadas de uma string, com base em um caractere separador.

**Assinatura:** `removeDuplicatedStrings(text, splitString?, caseInsensitive?)`

**Exemplo:**
```javascript
const { removeDuplicatedStrings } = require('misc-helpers');

const tags = "node js Node javascript react node";
const uniqueTags = removeDuplicatedStrings(tags, " ", true); // case-insensitive

console.log(uniqueTags); // "node js javascript react"
```

---

### `sleep`
Cria uma pausa (delay) assíncrona, útil para simular latência ou aguardar por um período específico.

**Assinatura:** `sleep(milliseconds, returnValue?, throwError?)`

**Exemplo:**
```javascript
const { sleep } = require('misc-helpers');

async function run() {
  console.log("Iniciando...");
  await sleep(1000); // Pausa por 1 segundo
  console.log("...finalizado após 1 segundo.");

  try {
    await sleep(500, "Erro simulado", true);
  } catch (error) {
    console.error(error); // "Erro simulado"
  }
}

run();
```

---

### `split`
Divide uma string em um array de substrings com base em um caractere separador.

**Assinatura:** `split(text, char?)`

**Exemplo:**
```javascript
const { split } = require('misc-helpers');

const fruits = "maçã,banana,laranja";
const fruitArray = split(fruits, ",");

console.log(fruitArray); // ["maçã", "banana", "laranja"]
```

---

### `stringCompress`
Comprime uma string usando o algoritmo Gzip e a retorna em formato Base64.

**Assinatura:** `stringCompress(text, raw?, options?)`
**Retorna:** `Promise<String | Uint8Array>` - A string comprimida em Base64.

**Exemplo:**
```javascript
const { stringCompress, stringDecompress } = require('misc-helpers');

async function compress() {
  const original = "Esta é uma string longa que será comprimida e depois descomprimida.";
  const compressed = await stringCompress(original);
  
  console.log('Comprimido (Base64):', compressed);
  
  const decompressed = await stringDecompress(compressed);
  console.log('Descomprimido:', decompressed);
}

compress();
```

---

### `stringDecompress`
Descomprime uma string no formato Gzip (codificada em Base64 por padrão) para o seu texto original.

**Assinatura:** `stringDecompress(gzipped, raw?)`
**Retorna:** `Promise<String>` - O texto descomprimido.

**Exemplo:**
```javascript
const { stringDecompress } = require('misc-helpers');

async function decompress() {
  // String "Hello World" comprimida com Gzip e codificada em Base64
  const compressedBase64 = "H4sIAAAAAAAAA/NIzcnJVwjPL8pJAQBWs9f6CAAAAA==";
  const originalText = await stringDecompress(compressedBase64);
  
  console.log(originalText); // "Hello World"
}

decompress();
```

---

### `stringToDate`
Converte uma string para um objeto `Date`, com base em um formato de entrada especificado.

**Assinatura:** `stringToDate(stringDate, stringFormat?, defaultDate?)`

**Exemplo:**
```javascript
const { stringToDate } = require('misc-helpers');

const dateString = "23/08/2025";
const parsedDate = stringToDate(dateString, 'dd/MM/yyyy');

console.log(parsedDate); // Objeto Date correspondente a 23 de Agosto de 2025
```

---

### `stringToDateToFormat`
Converte uma string de data de um formato para outro, sem a necessidade de criar um objeto `Date` intermediário.

**Assinatura:** `stringToDateToFormat(stringDate, fromFormat?, toFormat?)`

**Exemplo:**
```javascript
const { constants, stringToDateToFormat} = require('misc-helpers');

const apiDate = "2025-08-23T12:00:00.000Z";
const userFriendlyDate = stringToDateToFormat(
  apiDate, 
  constants.DATE_ISO_FORMAT_TZ, 
  constants.DATE_BR_HOUR_FORMAT_FS
);

console.log(userFriendlyDate); // "23/08/2025 09:00:00" (considerando fuso -3)
```

---

### `stringToFormat`
Aplica uma máscara de formatação a uma string. Útil para formatar documentos como CNPJ, CPF, CEP, etc.

**Assinatura:** `stringToFormat(text, pattern?, options?)`

**Exemplo:**
```javascript
const { constants, stringToFormat } = require('misc-helpers');

const cep = "80000123";
const formattedCep = stringToFormat(cep, constants.STRING_FORMAT_CEP);

console.log(formattedCep); // "80000-123"
```

---

### `stringZLibCompress`
Comprime uma string usando o algoritmo Zlib e a retorna em formato Base64.

**Assinatura:** `stringZLibCompress(text, raw?, options?)`
**Retorna:** `Promise<String | Uint8Array>` - A string comprimida em Base64.

**Exemplo:**
```javascript
const { stringZLibCompress } = require('misc-helpers');

async function compress() {
  const text = "Texto a ser comprimido com Zlib";
  const compressed = await stringZLibCompress(text);

  console.log("Comprimido (Base64):", compressed);
}

compress();
```

---

### `stringZLibDecompress`
Descomprime uma string no formato Zlib (codificada em Base64 por padrão) para o seu texto original.

**Assinatura:** `stringZLibDecompress(zlibbed, raw?)`
**Retorna:** `Promise<String>` - O texto descomprimido.

**Exemplo:**
```javascript
const { stringZLibDecompress } = require('misc-helpers');

async function decompress() {
  const compressedBase64 = "eJzLSM3JyVcozy/KSQEAGgsEXQ=="; // "Hello Zlib"
  const original = await stringZLibDecompress(compressedBase64);
  
  console.log(original); // "Hello Zlib"
}

decompress();
```

---

### `throttle`
Cria uma versão de uma função que limita sua frequência de execução, garantindo que seja executada no máximo uma vez a cada `wait` milissegundos. Ideal para eventos de scroll, resize, etc.

**Assinatura:** `throttle(callback, wait)`

**Exemplo:**
```javascript
const { throttle } = require('misc-helpers');

const heavyFunction = () => console.log('Executou!');
const throttledFunction = throttle(heavyFunction, 500);

// Em um evento de scroll, por exemplo:
// window.addEventListener('scroll', throttledFunction);
```

---

### `timestamp`
Gera uma string de timestamp customizável e formatada com base em um padrão.

**Assinatura:** `timestamp(format = 'D-MT-Y_H:MN:S:MS')`

**Exemplo:**
```javascript
const { timestamp } = require('misc-helpers');

// Formato padrão
console.log(timestamp()); // "23-08-2025_19:25:20:123"

// Formato ISO para data
console.log(timestamp('Y-MT-D')); // "2025-08-23"

// Formato simples para hora
console.log(timestamp('H:MN:S')); // "19:25:20"
```

---

### `toString`
Converte qualquer valor para uma representação em string. Por padrão, objetos são serializados para JSON.

**Assinatura:** `toString(textObj, objectToJSON?)`
**Retorna:** `String` - A representação em string do valor.

**Exemplo:**
```javascript
const { toString } = require('misc-helpers');

// Converte um objeto para JSON
const obj = { key: 'value' };
console.log(toString(obj)); // '{"key":"value"}'

// Converte um objeto para a string padrão "[object Object]"
console.log(toString(obj, false)); // "[object Object]"

// Converte um número
console.log(toString(123)); // '123'
```

---

### `uint8ArrayFromString`
Converte uma string para sua representação em `Uint8Array` (um array de bytes).

**Assinatura:** `uint8ArrayFromString(text, joinChar?)`
**Retorna:** `Uint8Array | String` - O `Uint8Array` ou uma string dos bytes unidos por `joinChar`.

**Exemplo:**
```javascript
const { uint8ArrayFromString } = require('misc-helpers');

const text = "Hi!"; // Equivalente a [72, 105, 33] em UTF-8

// Retorna o array de bytes
const byteArray = uint8ArrayFromString(text);
console.log(byteArray); // Uint8Array [ 72, 105, 33 ]

// Retorna uma string com os bytes separados por '-'
const byteString = uint8ArrayFromString(text, '-');
console.log(byteString); // "72-105-33"
```

---

### `uint8ArrayToString`
Converte um `Uint8Array` (ou um array de bytes) de volta para uma string.

**Assinatura:** `uint8ArrayToString(uint8Array, splitChar?)`
**Retorna:** `String` - O texto original.

**Exemplo:**
```javascript
const { uint8ArrayToString } = require('misc-helpers');

// Converte a partir de um Uint8Array
const byteArray = new Uint8Array([72, 105, 33]);
console.log(uint8ArrayToString(byteArray)); // "Hi!"

// Converte a partir de uma string de bytes
const byteString = '72-105-33';
console.log(uint8ArrayToString(byteString, '-')); // "Hi!"
```

---

## Validators

A biblioteca oferece um conjunto completo de validadores para documentos e formatos brasileiros comuns. Todos eles removem automaticamente máscaras e pontuações para facilitar o uso.

### `validateCADICMSPR`
Valida um número de CAD/ICMS do estado do Paraná.

**Assinatura:** `validateCADICMSPR(cadicms)`

**Exemplo:**
```javascript
const { validateCADICMSPR } = require('misc-helpers');

console.log(validateCADICMSPR("1234567850")); // true
console.log(validateCADICMSPR("9876543210")); // false
```

---

### `validateCEP`
Valida se um CEP (Código de Endereçamento Postal) possui 8 dígitos.

**Assinatura:** `validateCEP(cep)`

**Exemplo:**
```javascript
const { validateCEP } = require('misc-helpers');

console.log(validateCEP("80000-123")); // true
console.log(validateCEP("1234567"));   // false
```

---

### `validateChavePix`
Valida uma Chave PIX de qualquer tipo (CPF, CNPJ, E-mail, Telefone ou Chave Aleatória).

**Assinatura:** `validateChavePix(chave)`

**Exemplo:**
```javascript
const { validateChavePix } = require('misc-helpers');

console.log(validateChavePix("meu.email@valido.com")); // true
console.log(validateChavePix("11122233344"));         // true (se for um CPF válido)
console.log(validateChavePix("+5511987654321"));      // true (celular)
console.log(validateChavePix("a2f7b764-2b73-4b9c-852c-15a052e43c43")); // true (chave aleatória)
```

---

### `validateCNH`
Valida um número de CNH (Carteira Nacional de Habilitação) através do seu algoritmo de dígitos verificadores.

**Assinatura:** `validateCNH(cnh)`

**Exemplo:**
```javascript
const { validateCNH } = require('misc-helpers');

console.log(validateCNH("43369372175")); // true
console.log(validateCNH("11111111111")); // false
```

---

### `validateCNPJ`
Valida um CNPJ (Cadastro Nacional da Pessoa Jurídica), com suporte a CNPJs alfanuméricos e opções customizadas.

**Assinatura:** `validateCNPJ(cnpj, options)`

**Exemplo:**
```javascript
const { validateCNPJ } = require('misc-helpers');

console.log(validateCNPJ("12.345.678/0001-99")); // true
console.log(validateCNPJ("11.111.111/1111-11")); // false
```

---

### `validateCPF`
Valida um CPF (Cadastro de Pessoas Físicas) através do seu algoritmo de dígitos verificadores.

**Assinatura:** `validateCPF(cpf)`

**Exemplo:**
```javascript
const { validateCPF } = require('misc-helpers');

console.log(validateCPF("123.456.789-09")); // true (se os DVs estiverem corretos)
console.log(validateCPF("111.111.111-11")); // false
```

---

### `validateEmail`
Valida se uma string corresponde a um formato de e-mail padrão.

**Assinatura:** `validateEmail(email)`

**Exemplo:**
```javascript
const { validateEmail } = require('misc-helpers');

console.log(validateEmail("example@email.com")); // true
console.log(validateEmail("example.email.com")); // false
```

---

### `validatePISPASEPNIT`
Valida um número de PIS/PASEP/NIT através do seu algoritmo de dígito verificador.

**Assinatura:** `validatePISPASEPNIT(pis)`

**Exemplo:**
```javascript
const { validatePISPASEPNIT } = require('misc-helpers');

console.log(validatePISPASEPNIT("120.12345.67-8")); // true
console.log(validatePISPASEPNIT("11111111111"));    // false
```

---

### `validateRenavam`
Valida um código RENAVAM (Registro Nacional de Veículos Automotores).

**Assinatura:** `validateRENAVAM(renavam)`

**Exemplo:**
```javascript
const { validateRENAVAM } = require('misc-helpers');

console.log(validateRENAVAM("00639884962")); // true
console.log(validateRENAVAM("12345678901")); // false
```

---

### `validateRG`
Valida um número de RG (Registro Geral) brasileiro usando o algoritmo de módulo 11, aceitando o dígito 'X'.

**Assinatura:** `validateRG(rg)`

**Exemplo:**
```javascript
const { validateRG } = require('misc-helpers');

console.log(validateRG('24.678.131-4')); // true
console.log(validateRG('37.606.335-X')); // true
console.log(validateRG('24678131X'));   // false (dígito verificador incorreto)
```

---

### `validateTituloEleitor`
Valida um número de Título de Eleitor, considerando as regras especiais de cálculo baseadas no estado de emissão.

**Assinatura:** `validateTituloEleitor(titulo)`

**Exemplo:**
```javascript
const { validateTituloEleitor } = require('misc-helpers');

// Exemplo para o estado de São Paulo (código 01)
console.log(validateTituloEleitor("367499990151")); // true
// Exemplo para o estado do Paraná (código 08)
console.log(validateTituloEleitor("095708360694")); // true
```

---