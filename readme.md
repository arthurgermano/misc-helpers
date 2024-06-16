# Miscellaneous Helpers

A collection of utility functions and validators for common tasks.

## Table of Contents

- [Miscellaneous Helpers](#miscellaneous-helpers)
  - [Table of Contents](#table-of-contents)
  - [Constants](#constants)
    - [Date Formats](#date-formats)
    - [Brazilian Formats](#brazilian-formats)
    - [EUA Formats](#eua-formats)
    - [CNPJ and CPF](#cnpj-and-cpf)
  - [Auth](#auth)
    - [WebAuthn](#webauthn)
      - [convertECDSAASN1Signature](#convertecdsaasn1signature)
      - [getAuthenticationAuthData](#getauthenticationauthdata)
      - [getRegistrationAuthData](#getregistrationauthdata)
      - [getWebAuthnAuthenticationAssertion](#getwebauthnauthenticationassertion)
      - [getWebAuthnRegistrationCredential](#getwebauthnregistrationcredential)
      - [validateAuthentication](#validateauthentication)
      - [getWebAuthnRegistrationCredential](#getwebauthnregistrationcredential-1)
      - [validateRPID](#validaterpid)
  - [Crypto](#crypto)
    - [decrypt](#decrypt)
    - [digest](#digest)
    - [encrypt](#encrypt)
    - [getCrypto](#getcrypto)
    - [importPublicKey](#importpublickey)
    - [verifySignature](#verifysignature)
  - [Custom](#custom)
    - [DB Sequelize](#db-sequelize)
      - [setConditionBetweenDates](#setconditionbetweendates)
        - [Example](#example)
      - [setConditionBetweenValues](#setconditionbetweenvalues)
        - [Example](#example-1)
      - [setConditionStringLike](#setconditionstringlike)
        - [Example](#example-2)
    - [WaitPlugin](#waitplugin)
      - [Constructor](#constructor)
      - [Methods](#methods)
      - [Usage](#usage)
  - [Helpers](#helpers)
    - [dateCompareAsc](#datecompareasc)
      - [Example](#example-3)
    - [dateCompareDesc](#datecomparedesc)
      - [Example](#example-4)
    - [defaultValue](#defaultvalue)
      - [Example](#example-5)
    - [isInstanceOf](#isinstanceof)
      - [Example](#example-6)
    - [isNumber](#isnumber)
      - [Example](#example-7)
    - [isObject](#isobject)
      - [Example](#example-8)
  - [Utils](#utils)
    - [assign](#assign)
      - [Example](#example-9)
    - [base64From](#base64from)
      - [Example](#example-10)
    - [base64FromBuffer](#base64frombuffer)
      - [Example](#example-11)
    - [base64To](#base64to)
      - [Example](#example-12)
    - [base64ToBuffer](#base64tobuffer)
      - [Example](#example-13)
    - [bufferCompare](#buffercompare)
      - [Example](#example-14)
    - [bufferConcatenate](#bufferconcatenate)
      - [Example](#example-15)
    - [bufferFromString](#bufferfromstring)
      - [Example](#example-16)
    - [bufferToString](#buffertostring)
      - [Example](#example-17)
    - [calculateSecondsInTime](#calculatesecondsintime)
      - [Example](#example-18)
    - [currencyBRToFloat](#currencybrtofloat)
      - [Example](#example-19)
    - [dateFirstHourOfDay](#datefirsthourofday)
      - [Example](#example-20)
    - [dateLastHourOfDay](#datelasthourofday)
      - [Example](#example-21)
    - [dateToFormat](#datetoformat)
      - [Example](#example-22)
    - [debouncer](#debouncer)
      - [Example](#example-23)
    - [deleteKeys](#deletekeys)
      - [Example](#example-24)
    - [generateRandomString](#generaterandomstring)
      - [Example](#example-25)
    - [generateSimpleId](#generatesimpleid)
      - [Example](#example-26)
    - [getExecutionTime](#getexecutiontime)
      - [Example](#example-27)
    - [JSONFrom](#jsonfrom)
      - [Example](#example-28)
    - [JSONTo](#jsonto)
      - [Example](#example-29)
    - [messageDecryptFromChunks](#messagedecryptfromchunks)
      - [Example](#example-30)
    - [messageEncryptToChunks](#messageencrypttochunks)
      - [Example](#example-31)
    - [normalize](#normalize)
      - [Example](#example-32)
    - [pushLogMessage](#pushlogmessage)
      - [Example](#example-33)
    - [regexDigitsOnly](#regexdigitsonly)
      - [Example](#example-34)
    - [regexLettersOnly](#regexlettersonly)
      - [Example](#example-35)
    - [regexReplaceTrim](#regexreplacetrim)
      - [Example](#example-36)
    - [removeDuplicatedStrings](#removeduplicatedstrings)
      - [Example](#example-37)
    - [sleep](#sleep)
      - [Example](#example-38)
    - [split](#split)
      - [Example](#example-39)
    - [stringCompress](#stringcompress)
      - [Example](#example-40)
    - [stringDecompress](#stringdecompress)
      - [Example](#example-41)
    - [stringToDate](#stringtodate)
      - [Example](#example-42)
    - [stringToDateToFormat](#stringtodatetoformat)
      - [Example](#example-43)
    - [stringToFormat](#stringtoformat)
      - [Example](#example-44)
    - [stringZLibCompress](#stringzlibcompress)
      - [Example](#example-45)
    - [stringZLibDecompress](#stringzlibdecompress)
      - [Example](#example-46)
    - [toString](#tostring)
      - [Example](#example-47)
    - [uint8ArrayFromString](#uint8arrayfromstring)
      - [Example](#example-48)
    - [uint8ArrayToString](#uint8arraytostring)
      - [Example](#example-49)
  - [Validators](#validators)
    - [validateCADICMSPR](#validatecadicmspr)
      - [Example](#example-50)
    - [validateCNPJ](#validatecnpj)
      - [Example](#example-51)
    - [validateCPF](#validatecpf)
      - [Example](#example-52)
    - [validateEmail](#validateemail)
      - [Example](#example-53)

<hr />


## Constants
### Date Formats

- **DATE_ISO_FORMAT_TZ**: `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`
  - ISO date format with timezone.

- **DATE_ISO_FORMAT**: `yyyy-MM-dd'T'HH:mm:ss.SSS`
  - ISO date format without timezone.

### Brazilian Formats

- **DATE_BR_FORMAT_D**: `dd-MM-yyyy`
  - Brazilian date format (day/month/year).

- **DATE_BR_FORMAT_FS**: `dd/MM/yyyy`
  - Brazilian date format with slashes (day/month/year).

- **DATE_BR_HOUR_FORMAT_D**: `dd-MM-yyyy HH:mm:ss`
  - Brazilian date and time format (day/month/year hour:minute:second).

- **DATE_BR_HOUR_FORMAT_FS**: `dd/MM/yyyy HH:mm:ss`
  - Brazilian date and time format with slashes (day/month/year hour:minute:second).

- **DATE_BR_MONTH_FORMAT_D**: `MM-yyyy`
  - Brazilian month and year format (month/year).

- **DATE_BR_MONTH_FORMAT_FS**: `MM/yyyy`
  - Brazilian month and year format with slashes (month/year).

### EUA Formats

- **DATE_EUA_FORMAT_D**: `yyyy-MM-dd`
  - USA date format (year-month-day).

- **DATE_EUA_FORMAT_FS**: `yyyy/MM/dd`
  - USA date format with slashes (year/month/day).

- **DATE_EUA_HOUR_FORMAT_D**: `yyyy-MM-dd HH:mm:ss`
  - USA date and time format (year-month-day hour:minute:second).

- **DATE_EUA_HOUR_FORMAT_FS**: `yyyy-MM-dd HH:mm:ss`
  - USA date and time format with slashes (year-month-day hour:minute:second).

### CNPJ and CPF

- **STRING_FORMAT_CADICMSPR**: `########-##`
  - Format for CADICMSPR string (8 digits, dash, 2 digits).

- **STRING_FORMAT_CNPJ**: `##.###.###/####-##`
  - Format for CNPJ string (2 digits, dot, 3 digits, dot, 3 digits, slash, 4 digits, dash, 2 digits).

- **STRING_FORMAT_CPF**: `###.###.###-##`
  - Format for CPF string (3 digits, dot, 3 digits, dot, 3 digits, dash, 2 digits).

- **STRING_FORMAT_PROTOCOLPR**: `###.###.###.#`
  - Format for ProtocolPR string (9 digits, dot, 1 digit).

<hr />


## Auth

### WebAuthn

#### convertECDSAASN1Signature
- **Description:** Converts an ECDSA signature in ASN.1/DER format to a concatenated r|s format.
- **Returns:** The signature in concatenated r|s format.
- **Params:**
  - `asn1Signature` : ECDSA ASN.1 signature to be converted.

#### getAuthenticationAuthData
- **Description:** Extracts data from a WebAuthn authentication assertion object.
- **Returns:** An object containing extracted data from the authentication assertion.
  - `id`: ID of the WebAuthn assertion.
  - `rawId`: Raw ID of the WebAuthn assertion.
  - `type`: Type of the WebAuthn assertion.
  - `authData`: Authenticator data included in the assertion.
  - `response`: Response object containing additional data related to the assertion.
- **Params:**
  - `assertion` : The WebAuthn authentication assertion object.

#### getRegistrationAuthData
- **Description:** Retrieves registration authentication data from a WebAuthn credential.
- **Params:**
  - `credential` {PublicKeyCredential} : The WebAuthn credential object.
- **Returns:** An object containing registration authentication data extracted from the credential.
  - `rawId`: Raw ID of the credential.
  - `id`: ID of the credential.
  - `type`: Type of the credential.
  - `authenticatorAttachment`: Authenticator attachment information.
  - `clientExtensionResults`: Client extension results from the credential.
  - `authData`: Authenticator data from the credential.
  - `response`: Object containing various response data:
    - `attestationObject`: Attestation object from the credential response.
    - `authenticatorData`: Authenticator data from the credential response.
    - `clientDataJSONDecoded`: Decoded client data JSON from the credential response.
    - `clientDataJSON`: Raw client data JSON from the credential response.
    - `transports`: Transports used by the credential (if available).
    - `publicKey`: Public key associated with the credential response.
    - `publicKeyAlgorithm`: Public key algorithm used in the response.

#### getWebAuthnAuthenticationAssertion
- **Description:** Initiates the WebAuthn authentication process and returns an assertion.
- **Returns:** A Promise that resolves to the obtained PublicKeyCredential or a message indicating that WebAuthn is not supported.
- **Params:**
  - `props` {Object} : The PublicKeyCredentialRequestOptions object containing the options for requesting an authentication assertion.
  - `callback` {Function} (optional) : Optional callback function to be called with the obtained assertion.

#### getWebAuthnRegistrationCredential
- **Description:** Initiates the WebAuthn registration process and returns a credential.
- **Returns:** A Promise that resolves to the created PublicKeyCredential or a message indicating that WebAuthn is not supported.
- **Params:**
  - `props` {Object} : The PublicKeyCredentialCreationOptions object containing the options for creating a new credential.
  - `callback` {Function} (optional) : Optional callback function to be called with the created credential.

#### validateAuthentication
- **Description:** Asynchronously validates a WebAuthn authentication assertion against the expected properties and the provided credential.
- **Returns:** `Promise<boolean>`: Returns true if the validation is successful.
- **Params:**
  - `credential` (Object):
    - `id` (string): The credential ID.
    - `rawId` (string): The raw credential ID.
    - `type` (string): The credential type, expected to be "public-key".
    - `publicKeyAlgorithm` (number): The algorithm used for the public key.
    - `publicKey` (string): The public key in base64 format.

  - `assertion` (Object):
    - `id` (string): The assertion ID.
    - `rawId` (string): The raw assertion ID.
    - `type` (string): The assertion type, expected to be "public-key".
    - `response` (Object): The response from the authenticator.
      - `clientDataJSONDecoded` (string): The decoded client data JSON.
      - `authenticatorDataDecoded` (string): The decoded authenticator data.
      - `signature` (ArrayBuffer): The signature generated by the authenticator.

  - `expectedProps` (Object, optional): The expected properties for validation.
    - `challenge` (string, optional): The expected challenge.
    - `origin` (string, optional): The expected origin.
    - `type` (string, optional): The expected type.
    - `rpID` (string, optional): The expected relying party ID.
    - `counterCredential` (number, optional): The expected credential counter.

  - `incomingProps` (Object, optional): The incoming properties for validation.
    - `counterAssertion` (number, optional): The incoming assertion counter.

  - `publicKeyProps` (Object, optional): The properties for importing the public key.
    - `importKey` (Object, optional): The import key properties.
      - `format` (string, optional): The format of the key, default is "spki".
      - `extractable` (boolean, optional): Whether the key is extractable, default is false.


#### getWebAuthnRegistrationCredential
- **Description:** Validates a WebAuthn registration credential. This function performs a series of validations on the given credential:
  1. Validates the basic properties of the credential.
  2. Validates the credential against expected request parameters.
  3. Extracts and validates the attestation object.
- **Returns:** A Boolean `true` if the credential is valid, otherwise throws an error.
- **Params:**
  - `credential` {Object} : The WebAuthn credential to validate.
  - `expectedProps` {Object} (optional) : An object containing expected properties for validation.
    - `challenge` {string} (optional) : The expected challenge.
    - `origin` {string} (optional) : The expected origin.
    - `type` {string} (optional) : The expected type.


#### validateRPID
- **Description:** Asynchronously validates relying party identifier (RPID) for WebAuthn.
- **Returns:** `Promise<boolean>`: Returns a promise that resolves to true if the RPID is valid.
- **Params:**
  - `rpID` : (string): Relying Party Identifier (RPID) to be validated.

<hr />

## Crypto

### decrypt

- **Description:** Decrypts an encrypted message using RSA-OAEP decryption.
- **Returns:** A Promise that resolves to the decrypted message as a string.
- **Params:**
  - `privateKey` (string): The RSA private key in PEM format.
  - `encryptedMessage` (string): The encrypted message to decrypt in Base64 encoding.
  - `props` (Object): Additional decryption properties.
    - `padding` (number, optional): The padding scheme to use (default: RSA_PKCS1_OAEP_PADDING).
    - `oaepHash` (string, optional): The hash algorithm to use with OAEP padding (default: "sha256").

### digest

- **Description:** Computes a cryptographic hash (digest) of the given data using the specified algorithm.
- **Returns:** A Promise that resolves to the computed hash as a Uint8Array.
- **Params:**
  - `algorithm` (string): The hash algorithm to use (e.g., 'SHA-256', 'SHA-1').
  - `data` (string|Uint8Array): The data to hash, either as a string or a Uint8Array.

### encrypt

- **Description:** Encrypts a message using RSA-OAEP encryption.
- **Returns:** A Promise that resolves to the encrypted message in Base64 encoding.
- **Params:**
  - `publicKey` (string): The RSA public key in PEM format.
  - `message` (string): The message to encrypt.
  - `props` (Object, optional): Additional encryption properties.
    - `padding` (number, optional): The padding scheme to use (default: RSA_PKCS1_OAEP_PADDING).
    - `oaepHash` (string, optional): The hash algorithm to use with OAEP padding (default: "sha256").

### getCrypto

- **Description:** Retrieves the `crypto` object for cryptographic operations.
- **Returns:** The `crypto` object for cryptographic operations, compatible with Web Crypto API.

### importPublicKey

- **Description:** Imports a public key asynchronously using Web Crypto API in browser environment or Node.js crypto module.
- **Returns:** A Promise that resolves with the imported CryptoKey object.
- **Params:**
  - `format` (string): The format of the key data ('spki', 'pkcs8', etc.).
  - `keyData` (BufferSource | CryptoKey | ArrayBuffer): The key data to import.
  - `algorithm` (Object): The algorithm object specifying the algorithm used by the key.
  - `extractable` (boolean): Indicates if the key can be extracted from the CryptoKey object.
  - `keyUsages` (string[]): Array of key usage identifiers ('encrypt', 'decrypt', 'verify', etc.).

### verifySignature

- **Description:** Verifies a digital signature asynchronously using Web Crypto API in browser environment or Node.js crypto module.
- **Params:**
  - `algorithm` (Object): The algorithm object specifying the algorithm used for verification.
  - `key` (CryptoKey): The public key or key pair used to verify the signature.
  - `signature` (BufferSource): The digital signature to be verified.
  - `data` (BufferSource): The data that was signed and needs to be verified against the signature.
- 

<hr />


## Custom

### DB Sequelize

#### setConditionBetweenDates

- **Description:** Returns the between conditions in an object format based on the provided date parameters.
- **Returns:** The modified `object` with between conditions set in an object format.
- **Params:**
  - `object` (Object): The object containing the date values.
  - `fromFormat` (String): Optional. The string format expected for the date (default: "dd-MM-yyyy").
  - `key` (String): Optional. The key name in the object that holds the main date value (default: "created_at").
  - `beforeKey` (String): Optional. The key name in the object that holds the upper limit date value (default: "created_at_until").
  - `afterKey` (String): Optional. The key name in the object that holds the lower limit date value (default: "created_at_from").
  - `resetHMS` (Boolean): Optional. Whether to reset hours, minutes, and seconds to zero for the date comparison (default: true).

##### Example

```javascript
/**
 * Example usage:
 * Assume 'data' is an object with properties:
 * { created_at_from: '01-01-2023', created_at_until: '31-12-2023' }
 */

setConditionBetweenDates(data); // Modifies 'data' to { created_at: { $and: [ { $gte: Date('2023-01-01T00:00:00.000Z') }, { $lte: Date('2023-12-31T23:59:59.999Z') } ] } }
```

#### setConditionBetweenValues

- **Description:** Returns the between conditions in an object format based on the provided parameters.
- **Params:**
  - `object` (Object): The object containing the values.
  - `key` (String): Optional. The key name in the object that holds the main value (default: "value").
  - `beforeKey` (String): Optional. The key name in the object that holds the upper limit value (default: "value_until").
  - `afterKey` (String): Optional. The key name in the object that holds the lower limit value (default: "value_from").
- Returns the modified `object` with between conditions set in an object format.

##### Example

```javascript
/**
 * Example usage:
 * Assume 'data' is an object with properties:
 * { value_from: 10, value_until: 20 }
 */

setConditionBetweenValues(data); // Modifies 'data' to { value: { $and: [ { $gte: 10 }, { $lte: 20 } ] } }
```

#### setConditionStringLike

- **Description:** Returns the string like condition format based on the provided parameters.
- **Params:**
  - `object` (Object): The object containing the values.
  - `key` (String): The key name in the object that holds the value to format.
  - `insensitive` (Boolean): Optional. Indicates whether the condition should be case-insensitive (default: true).
- Returns nothing. Modifies the `object` parameter directly to set the string like condition.

##### Example

```javascript
/**
 * Example usage:
 * Assume 'data' is an object with properties:
 * { name: 'John', city: 'New York' }
 */

setConditionStringLike(data, 'name'); // Modifies 'data' to { name: { $iLike: '%John%' }, city: 'New York' }
setConditionStringLike(data, 'city', false); // Modifies 'data' to { name: { $iLike: '%John%' }, city: { $like: '%New York%' } }
```


### WaitPlugin

A utility class for managing asynchronous waiting operations with promises.

#### Constructor

- **WaitList:** An object that stores promises for asynchronous operations.

#### Methods

- **`finishWait(name, isSuccessful = true, returnParam)`**
  - **Description:** Completes a waiting operation by resolving or rejecting a promise based on the success status.
  - **Params:**
    - `name` (string): The identifier for the waiting operation.
    - `isSuccessful` (boolean): Optional. Indicates whether the operation was successful (default: true).
    - `returnParam` (any): Optional. The parameter to be returned or rejected with the promise.
  - **Returns:** Returns `true` if the operation completes successfully; otherwise, returns `false` or throws an error.

- **`startWait(name)`**
  - **Description:** Initiates a waiting operation by creating a new promise in the wait list.
  - **Params:**
    - `name` (string): The identifier for the waiting operation.
  - **Returns:** Returns a promise associated with the waiting operation.

- **`finishAll(isSuccessful, returnParam)`**
  - **Description:** Completes all waiting operations in the wait list, resolving or rejecting promises based on the success status.
  - **Params:**
    - `isSuccessful` (boolean): Indicates whether the operations were successful.
    - `returnParam` (any): The parameter to be returned or rejected with each promise.
  - **Returns:** undefined

#### Usage

```javascript
const { waitPlugin } = require('misc-helpers');

// Example: Starting a wait operation
async function exampleWaitOperation() {
  try {
    await waitPlugin.startWait('operationName');
    // Perform async operation
    await waitPlugin.finishWait('operationName', true, 'Operation successful');
  } catch (error) {
    // Handle error
    await waitPlugin.finishWait('operationName', false, 'Operation failed');
  }
}

// Example: Finishing all wait operations
WP.finishAll(true, 'All operations finished successfully');
```

<hr />

## Helpers

### dateCompareAsc

- **Description:** Returns whether a given dateA is earlier than dateB, considering optional customization options like ignoring errors, considering hours, minutes, and seconds, and whether to consider equality as earlier.
- **Returns:** true if dateA is earlier than dateB according to the specified options; otherwise, returns false.
- **Params:**
  - `dateA` (Date): The earlier date to be checked.
  - `dateB` (Date): The later date to be checked.
  - `options` (Object): Optional. The options to customize behavior.
  - `options.ignoreErrors` (Boolean): Whether this function should throw or ignore errors (default: false).
  - `options.considerHMS` (Boolean): Whether to consider hours, minutes, and seconds in the comparison (default: false).
  - `options.considerEquals` (Boolean): If true, considers dateA to be earlier even if it equals dateB (default: false).

#### Example

```javascript
/**
 * Example usage:
 */

const earlierDate = new Date('2023-01-01T12:00:00Z');
const laterDate = new Date('2023-01-02T12:00:00Z');

const result = dateCompareAsc(earlierDate, laterDate);
console.log(result); // Output: true
```


### dateCompareDesc

- **Description:** Returns whether a given dateA is in a later time than dateB, considering optional customization options like ignoring errors, considering hours, minutes, and seconds, and whether to consider equality as later.
- **Returns:** true if dateA is in a later time than dateB according to the specified options; otherwise, returns false.
- **Params:**
  - `dateA` (Date): The later date to be checked.
  - `dateB` (Date): The earlier date to be checked.
  - `options` (Object): Optional. The options to customize behavior.
  - `options.ignoreErrors` (Boolean): Whether this function should throw or ignore errors (default: false).
  - `options.considerHMS` (Boolean): Whether to consider hours, minutes, and seconds in the comparison (default: false).
  - `options.considerEquals` (Boolean): If true, considers dateA to be later even if it equals dateB (default: false).

#### Example

```javascript
/**
 * Example usage:
 */

const laterDate = new Date('2023-01-02T12:00:00Z');
const earlierDate = new Date('2023-01-01T12:00:00Z');

const result = dateCompareDesc(laterDate, earlierDate);
console.log(result); // Output: true
```

### defaultValue

- **Description:** Returns a default value instead of empty or null.
- **Returns:** The provided value (`checkValue`) if it is not null or undefined; otherwise, returns the specified default value.
- **Params:**
  - `checkValue` (Any): The value to be checked.
  - `defaultValue` (Any): The default value to be returned if `checkValue` is empty or null.

#### Example

```javascript
/**
 * Example usage:
 */

const value = null;
const defaultVal = defaultValue(value, 'Default');

console.log(defaultVal); // Output: 'Default'
```

### isInstanceOf

- **Description:** Checks if a given object is an instance of a specified type.
- **Returns:** true if the object provided is an instance of the specified instance type; otherwise, returns false.
- **Params:**
  - `object` (Any): The object to be checked.
  - `instanceType` (Any): The type to check against.

#### Example

```javascript
/**
 * Example usage:
 */

class Person {
  constructor(name) {
    this.name = name;
  }
}

const person = new Person('Alice');
const result = isInstanceOf(person, Person);

console.log(result); // Output: true
```

### isNumber

- **Description:** Checks if a given value is a numeric value.
- **Returns:** true if the value provided is numeric; otherwise, returns false.
- **Params:**
  - `value` (Any): The value to be checked.

#### Example

```javascript
/**
 * Example usage:
 */

const result1 = isNumber(42);
console.log(result1); // Output: true

const result2 = isNumber('42');
console.log(result2); // Output: false
```

### isObject

- **Description:** Checks if a given object is an object.
- **Returns:** true if the object provided is an object; otherwise, returns false.
- **Params:**
  - `object` (Any): The object to be checked.

#### Example

```javascript
/**
 * Example usage:
 */

const result1 = isObject({ name: 'John', age: 30 });
console.log(result1); // Output: true

const result2 = isObject('Hello');
console.log(result2); // Output: false
```

<hr />

## Utils

### assign

- **Description:** Returns a new object with the merge of two objects, `target` and `source`.
- **Returns:** A new object resulting from merging `target` and `source`.
- **Params:**
  - `target` (Object): The target object to merge into.
  - `source` (Object): The source object to merge from.
  - `throwsError` (Boolean): Optional. Whether this function should throw errors if `target` or `source` is not an object (default: true).

#### Example

```javascript
/**
 * Example usage:
 */

const targetObject = { a: 1, b: 2 };
const sourceObject = { b: 3, c: 4 };

const mergedObject = assign(targetObject, sourceObject);
console.log(mergedObject); // Output: { a: 1, b: 3, c: 4 }
```

### base64From

- **Description:** Converts a Base64 encoded string to plain text (UTF-8) or a Buffer, depending on the environment and options.
- **Returns:** Decoded plain text (UTF-8) string or Buffer.
- **Params:**
  - `text` (string): The Base64 encoded string to decode (default: "").
  - `toString` (boolean): If true and in Node.js environment, decode to UTF-8 string. Default is true.

#### Example

```javascript
/**
 * Example usage:
 */

const base64String = "SGVsbG8gV29ybGQh"; // Example Base64 encoded string
const decodedText = base64From(base64String);
console.log(decodedText); // Output: "Hello World!"
```

### base64FromBuffer

- **Description:** Converts an ArrayBuffer to a Base64 string.
- **Returns:** The Base64-encoded string representation of the ArrayBuffer.
- **Params:**
  - `buffer` (ArrayBuffer): The ArrayBuffer to convert to Base64.

#### Example

```javascript
/**
 * Example usage:
 */

const { base64To } = require('misc-helpers');

const arrayBuffer = new ArrayBuffer(16);
const view = new Uint8Array(arrayBuffer);
for (let i = 0; i < view.length; i++) {
    view[i] = i;
}

const base64String = base64FromBuffer(arrayBuffer);
console.log('Base64 Encoded:', base64String);
```

### base64To

- **Description:** Returns a text in a base64 format.
- **Params:**
  - `text` (String): The text to be transformed.
  - `fromFormat` (String): From what format to expect (default: utf8).
- **Returns:** The text transformed into Base64 format.

#### Example

```javascript
/**
 * Example usage:
 */

const { toString } = require('misc-helpers');

const base64String = base64To("Hello, world!", "utf8");
console.log('Base64 Encoded:', base64String);
```

### base64ToBuffer

- **Description:** Converts a Base64 encoded string to a binary Buffer or ArrayBuffer.
- **Params:**
  - `base64String` (string): The Base64 encoded string to decode.
  - `toString` (boolean): If true and in Node.js environment, decode to UTF-8 string. Default is true.
- **Returns:** Decoded binary Buffer or ArrayBuffer.

#### Example

```javascript
/**
 * Example usage:
 */

const { base64From, base64ToBuffer } = require('misc-helpers');

const base64String = "SGVsbG8sIHdvcmxkIQ=="; // Example Base64 string
const buffer = base64ToBuffer(base64String);
console.log('Decoded Buffer:', buffer);

```

### bufferCompare

- **Description:** Compares two ArrayBuffer objects for equality.
- **Params:**
  - `buffer1` (ArrayBuffer): The first ArrayBuffer.
  - `buffer2` (ArrayBuffer): The second ArrayBuffer.
- **Returns:** boolean - True if the buffers are equal, false otherwise.

#### Example

```javascript
/**
 * Example usage:
 */

const { bufferCompare } = require('misc-helpers');

const buffer1 = new ArrayBuffer(8);
const view1 = new Uint8Array(buffer1);
for (let i = 0; i < view1.length; i++) {
    view1[i] = i;
}

const buffer2 = new ArrayBuffer(8);
const view2 = new Uint8Array(buffer2);
for (let i = 0; i < view2.length; i++) {
    view2[i] = i;
}

const isEqual = bufferCompare(buffer1, buffer2);
console.log('Buffers are equal:', isEqual);
```

### bufferConcatenate

- **Description:** Concatenates two ArrayBuffer objects.
- **Params:**
  - `buffer1` (ArrayBuffer): The first ArrayBuffer.
  - `buffer2` (ArrayBuffer): The second ArrayBuffer.
- **Returns:** ArrayBuffer - The concatenated ArrayBuffer.

#### Example

```javascript
/**
 * Example usage:
 */

const { bufferConcatenate } = require('misc-helpers');

const buffer1 = new ArrayBuffer(4);
const view1 = new Uint8Array(buffer1);
view1.set([1, 2, 3, 4]);

const buffer2 = new ArrayBuffer(3);
const view2 = new Uint8Array(buffer2);
view2.set([5, 6, 7]);

const concatenatedBuffer = bufferConcatenate(buffer1, buffer2);
const concatenatedView = new Uint8Array(concatenatedBuffer);

console.log('Concatenated Buffer:', concatenatedView);
```

### bufferFromString

- **Description:** Generates a buffer from a given string in both Node.js and browser environments.
- **Params:**
  - `txtString` (string): The string to convert to a buffer.
  - `encoding` (string, optional): The encoding to use (only applicable in Node.js). Default is "utf-8".
- **Returns:** Buffer|Uint8Array - The buffer representation of the string.

#### Example

```javascript
/**
 * Example usage:
 */

const { bufferFromString } = require('misc-helpers');

// Node.js usage
const bufferNode = bufferFromString('Hello, World!', 'utf-8');
console.log(bufferNode);

// Browser usage
const bufferBrowser = bufferFromString('Hello, World!');
console.log(bufferBrowser);
```

### bufferToString

- **Description:** Generates a string from a buffer in both Node.js and browser environments.
- **Params:**
  - `buffer` (Buffer|Uint8Array): The buffer to convert to a string.
  - `encoding` (string, optional): The encoding to use (only applicable in Node.js). Default is "utf-8".
- **Returns:** string - The string representation of the buffer.

#### Example

```javascript
/**
 * Example usage:
 */

const { bufferToString } = require('misc-helpers');

// Node.js usage
const bufferNode = Buffer.from('Hello, World!');
const strNode = bufferToString(bufferNode);
console.log(strNode); // Output: Hello, World!

// Browser usage
const bufferBrowser = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]);
const strBrowser = bufferToString(bufferBrowser);
console.log(strBrowser); // Output: Hello, World!
```

### calculateSecondsInTime

- **Description:** Returns the time value given the seconds, either adding or subtracting the seconds from the current time.
- **Params:**
  - `seconds` (Number): Value to be added or subtracted in seconds.
  - `add` (Boolean, optional): Whether to add (`true`) or subtract (`false`) the seconds from the current time. Default is `true`.
- **Returns:** Number - The time value in milliseconds.

#### Example

```javascript
/**
 * Example usage:
 */

const { calculateSecondsInTime } = require('misc-helpers');

// Adding seconds
const addedTime = calculateSecondsInTime(60); // Adds 60 seconds to the current time
console.log(addedTime); // Output: Current time + 60 seconds

// Subtracting seconds
const subtractedTime = calculateSecondsInTime(60, false); // Subtracts 60 seconds from the current time
console.log(subtractedTime); // Output: Current time - 60 seconds
```

### currencyBRToFloat

- **Description:** Returns a float value from a given money string formatted in Brazilian Real (BRL) currency.
- **Params:**
  - `moneyString` (String): The money string to be transformed into a float.
- **Returns:** Float - The float representation of the money string, or `false` if conversion fails.

#### Example

```javascript
/**
 * Example usage:
 */

const { currencyBRToFloat } = require('misc-helpers');

// Valid money string
const money1 = "R$ 1.234,56";
const result1 = currencyBRToFloat(money1);
console.log(result1); // Output: 1234.56 (float)

// Another valid money string
const money2 = "R$ 999,99";
const result2 = currencyBRToFloat(money2);
console.log(result2); // Output: 999.99 (float)

// Invalid money string
const invalidMoney = "R$ ABC";
const result3 = currencyBRToFloat(invalidMoney);
console.log(result3); // Output: false (conversion failed)
```

### dateFirstHourOfDay

- **Description:** Returns a new Date object with the hour, minute, second, and millisecond set to 00:00:00.
- **Params:**
  - `date` (Date): The date object for which the time should be set to the first hour of the day.
- **Returns:** Date - A new Date object with hour, minute, second, and millisecond set to 00:00:00.

#### Example

```javascript
/**
 * Example usage:
 */

const { dateFirstHourOfDay } = require('misc-helpers');

// Create a new Date object
const date = new Date();

// Set the date to the first hour of the day
const result = dateFirstHourOfDay(date);
console.log(result); // Output: Date object with time set to 00:00:00
```

### dateLastHourOfDay

- **Description:** Returns a new Date object with the hour, minute, second, and millisecond set to 23:59:59.
- **Params:**
  - `date` (Date): The date object for which the time should be set to the last hour of the day.
- **Returns:** Date - A new Date object with hour, minute, second, and millisecond set to 23:59:59.

#### Example

```javascript
/**
 * Example usage:
 */

const { dateLastHourOfDay } = require('misc-helpers');

// Create a new Date object
const date = new Date();

// Set the date to the last hour of the day
const result = dateLastHourOfDay(date);
console.log(result); // Output: Date object with time set to 23:59:59
```

### dateToFormat

- **Description:** Returns a formatted string representation of a Date object according to the specified format.
- **Params:**
  - `date` (Date): The Date object to format.
  - `stringFormat` (String): Optional. The format string in which the Date object should be formatted. Default is `dd-MM-yyyy`.
- **Returns:** String - A string formatted according to the specified format.

#### Example

```javascript
/**
 * Example usage:
 */

const { constants, dateToFormat } = require('misc-helpers');

// Create a new Date object
const date = new Date();

// Format the date according to the Brazilian date format
const formattedDate = dateToFormat(date, constants.DATE_BR_FORMAT_D);
console.log(formattedDate); // Output: Formatted date string according to the format dd-MM-yyyy
```

### debouncer

- **Description:** Debounces a function until the timeout period has elapsed, ensuring it is executed only once within that period.
- **Params:**
  - `callback` (Function): The function to be executed after the timeout period.
  - `timeout` (Integer): Optional. The timeout period in milliseconds. Default is 1000 milliseconds.
- **Returns:** Function - A debounced function that delays execution of `callback` until after the timeout period has elapsed.

#### Example

```javascript
/**
 * Example usage:
 */

const { debouncer } = require('misc-helpers');

// Define a function to be debounced
function fetchData(query) {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetching data for query: ${query}`);
      resolve();
    }, 500);
  });
}

// Create a debounced version of fetchData with a timeout of 1000 milliseconds
const debouncedFetchData = debouncer(fetchData, 1000);

// Invoke the debounced function multiple times in rapid succession
debouncedFetchData("search query 1");
debouncedFetchData("search query 2");
debouncedFetchData("search query 3");

// Only one execution of fetchData will occur after the timeout period (1000 milliseconds)
```

### deleteKeys

- **Description:** Removes specified keys from an object.
- **Params:**
  - `object` (Object): The object from which keys should be deleted.
  - `keys` (Array): The array of keys to be deleted from the object.
- **Returns:** Object - The object with the specified keys removed.

#### Example

```javascript
/**
 * Example usage:
 */

const { deleteKeys } = require('misc-helpers');

// Example object
let user = {
  id: 1,
  username: "john_doe",
  email: "john.doe@example.com",
  password: "password123",
};

// Keys to delete
const keysToDelete = ["password", "email"];

// Remove keys from the user object
const modifiedUser = deleteKeys(user, keysToDelete);

console.log(modifiedUser);
// Output: { id: 1, username: 'john_doe' }
```

### generateRandomString

- **Description:** Generates a new random string based on specified size and options.
- **Params:**
  - `size` (Integer): The size of the string to generate (default: 32).
  - `options` (Object): Optional. The options to customize behavior.
    - `options.excludeLowerCaseChars` (Boolean): Whether to exclude lowercase characters (default: false).
    - `options.excludeUpperCaseChars` (Boolean): Whether to exclude uppercase characters (default: false).
    - `options.excludeAccentedChars` (Boolean): Whether to exclude accented characters (default: false).
    - `options.excludeDigits` (Boolean): Whether to exclude digits (default: false).
    - `options.excludeSymbols` (Boolean): Whether to exclude symbols (default: false).
    - `options.includeSymbols` (String): A string with customized symbols to include.
- **Returns:** String - A new random string based on the specified criteria.

#### Example

```javascript
/**
 * Example usage:
 */

const { generateRandomString } = require('misc-helpers');

// Generate a random string of size 16 with default options
const randomString1 = generateRandomString(16);
console.log(randomString1);

// Generate a random string of size 8 excluding digits and symbols
const randomString2 = generateRandomString(8, {
  excludeDigits: true,
  excludeSymbols: true
});
console.log(randomString2);
```

### generateSimpleId

- **Description:** Returns a new simple string identifier based on a given text and optional separator.
- **Params:**
  - `id` (String): The string text identifier to incorporate into the new id.
  - `separator` (String): Optional. The separator between id parts (default: "_").
- **Returns:** String - A new string identifier combining the given text, current timestamp, and random number.

#### Example

```javascript
/**
 * Example usage:
 */

const { generateSimpleId } = require('misc-helpers');

// Generate a simple id with default separator
const id1 = generateSimpleId("example");
console.log(id1);

// Generate a simple id with custom separator
const id2 = generateSimpleId("example", "-");
console.log(id2);
```

### getExecutionTime

- **Description:** Returns the elapsed time in milliseconds from a given reference time using Node.js `process.hrtime`.
- **Params:**
  - `time` (BigInteger): Optional. The reference time in milliseconds to compare against (default: 0).
- **Returns:** BigInteger - The elapsed time in milliseconds from the given time.

#### Example

```javascript
/**
 * Example usage:
 */

const { getExecutionTime } = require('misc-helpers');

// Measure execution time of a function
const start = process.hrtime();
// Perform some operation or function here
const end = getExecutionTime(start);
console.log(`Execution time: ${end} ms`);
```

### JSONFrom

- **Description:** Returns an object parsed from a JSON string.
- **Params:**
  - `text` (String): The JSON string to parse into an object.
  - `throwsError` (Boolean): Optional. Whether this function should throw an error on parsing failure (default: true).
- **Returns:** Object - The parsed object from the JSON string, or null if parsing fails and `throwsError` is false.

#### Example

```javascript
/**
 * Example usage:
 */

const { JSONFrom } = require('misc-helpers');

const jsonString = '{"key": "value"}';
const parsedObject = JSONFrom(jsonString);
console.log(parsedObject); // Output: { key: 'value' }
```

### JSONTo

- **Description:** Returns a JSON string representation of an object.
- **Params:**
  - `object` (Object): Optional. The object to be transformed into a JSON string (default: {}).
  - `throwsError` (Boolean): Optional. Whether this function should throw an error on stringification failure (default: true).
- **Returns:** String - The JSON string representation of the object, or null if stringification fails and `throwsError` is false.

#### Example

```javascript
/**
 * Example usage:
 */

const { JSONTo } = require('misc-helpers');

const obj = { key: 'value' };
const jsonString = JSONTo(obj);
console.log(jsonString); // Output: '{"key":"value"}'
```

### messageDecryptFromChunks

- **Description:** Decrypts a message from encrypted chunks using RSA-OAEP decryption.
- **Params:**
  - `privateKey` (string): The RSA private key in PEM format.
  - `messageChunks` (string[]): An array of encrypted message chunks.
  - `props` (Object): Optional. Additional decryption properties (default: {}).
  - `props.algorithm` (string): Optional. Encryption algorithm to use (default: 'RSA-OAEP').
  - `props.inputEncoding` (string): Optional. Input encoding of the encrypted chunks (default: 'base64').
  - `props.outputEncoding` (string): Optional. Output encoding of the decrypted message (default: 'utf8').
- **Returns:** Promise<string> - A Promise that resolves to the decrypted message as a string.
- Throws: Error - If decryption fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { messageDecryptFromChunks } = require('misc-helpers');
const { readFileSync } = require('fs');

async function decryptMessage() {
  const privateKey = readFileSync("private_key.pem", "utf8");
  const messageChunks = [
    "encrypted_chunk_1",
    "encrypted_chunk_2",
    "encrypted_chunk_3"
  ];

  try {
    const decryptedMessage = await messageDecryptFromChunks(privateKey, messageChunks);
    console.log("Decrypted Message:", decryptedMessage);
  } catch (error) {
    console.error("Decryption Error:", error);
  }
}

decryptMessage();
```

### messageEncryptToChunks

- **Description:** Encrypts a message into chunks using RSA-OAEP encryption.
- **Params:**
  - `publicKey` (string): The RSA public key in PEM format.
  - `message` (string): The message to encrypt.
  - `props` (Object): Optional. Additional encryption properties (default: {}).
  - `props.algorithm` (string): Optional. Encryption algorithm to use (default: 'RSA-OAEP').
  - `props.inputEncoding` (string): Optional. Input encoding of the message (default: 'utf8').
  - `props.outputEncoding` (string): Optional. Output encoding of the encrypted chunks (default: 'base64').
  - `props.chunkSize` (number): Optional. The size of each chunk in bytes (default: 190).
- **Returns:** Promise<string[]> - A Promise that resolves to an array of encrypted message chunks.
- Throws: Error - If encryption fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { messageEncryptToChunks } = require('misc-helpers');
const { readFileSync } = require('fs');

async function encryptMessage() {
  const publicKey = readFileSync("public_key.pem", "utf8");
  const message = "This is a secret message to encrypt.";

  try {
    const encryptedChunks = await messageEncryptToChunks(publicKey, message);
    console.log("Encrypted Chunks:", encryptedChunks);
  } catch (error) {
    console.error("Encryption Error:", error);
  }
}

encryptMessage();
```

### normalize

- **Description:** Returns a text normalized.
- **Params:**
  - `text` (String): The text to be normalized.
- **Returns:** String - The text normalized.

#### Example

```javascript
/**
 * Example usage:
 */

const { normalize } = require('misc-helpers');

const text = "héllõ wórld";
const normalizedText = normalize(text);
console.log(normalizedText); // Output: "hello world"
```

### pushLogMessage

- **Description:** Pushes a message into a log object with the current time.
- **Params:**
  - `logObj` (Array): The log object array to which the message should be pushed.
  - `message` (Boolean): The message to be pushed.
  - `more_info` (Any): Optional. Additional information to be added to the log message.
- **Returns:** Array - The log object array with the new message pushed into it.

#### Example

```javascript
/**
 * Example usage:
 */

const { pushLogMessage } = require('misc-helpers');

let log = [];
log = pushLogMessage(log, "Error occurred", { errorCode: 500 });
console.log(log);
```

### regexDigitsOnly

- **Description:** Returns a string containing only digits from the input text.
- **Params:**
  - `text` (String): The text from which digits should be extracted.
- **Returns:** String - The text containing only digits.

#### Example

```javascript
/**
 * Example usage:
 */

const { regexDigitsOnly } = require('misc-helpers');

const text = "abc123xyz456";
const digitsOnly = regexDigitsOnly(text);
console.log(digitsOnly); // Output: "123456"
```

### regexLettersOnly

- **Description:** Returns a string containing only letters from the input text.
- **Params:**
  - `text` (String): The text from which letters should be extracted.
- **Returns:** String - The text containing only letters.

#### Example

```javascript
/**
 * Example usage:
 */

const { regexLettersOnly } = require('misc-helpers');

const text = "123abc456XYZ!@#";
const lettersOnly = regexLettersOnly(text);
console.log(lettersOnly); // Output: "abcXYZ"
```

### regexReplaceTrim

- **Description:** Returns a string with specified regex replaced by the provided replacement string.
- **Params:**
  - `text` (String): String containing values to be replaced.
  - `regex` (String): Optional. The regex pattern to keep (default: "A-Za-zÀ-ú0-9 ").
  - `replacement` (String): Optional. The string to replace matching patterns in the text.
- **Returns:** String - The modified string with replacements.

#### Example

```javascript
/**
 * Example usage:
 */

const { regexReplaceTrim } = require('misc-helpers');

const text = "abc123XYZ456!@#";
const replacedText = regexReplaceTrim(text, "A-Za-z", "-");
console.log(replacedText); // Output: "---123---456---#"
```

### removeDuplicatedStrings

- **Description:** Returns a string with duplicated substrings removed.
- **Params:**
  - `text` (String): The string to be checked for duplicates.
  - `splitString` (String): Optional. The character or substring used to split the text into array elements (default: " ").
  - `caseInsensitive` (Boolean): Optional. Whether to remove duplicates case-insensitively (default: false).
- **Returns:** String - The modified string with duplicated substrings removed.

#### Example

```javascript
/**
 * Example usage:
 */

const { removeDuplicatedStrings } = require('misc-helpers');

const text = "apple banana apple orange banana";
const uniqueText = removeDuplicatedStrings(text, " ");
console.log(uniqueText); // Output: "apple banana orange"
```

### sleep

- Description: Creates a delay for a specified number of milliseconds and optionally returns a value or throws an error.
- Params:
  - `milliseconds` (Number): The number of milliseconds to sleep.
  - `returnValue` (Any): The value to be returned or used in the rejection after the sleep. Default is true.
  - `throwError` (Boolean): Whether to throw an error after the sleep. Default is false.
- Returns: Promise\<Any> - A promise that resolves to returnValue after the delay or rejects with returnValue if throwError is true.

#### Example

```javascript
/**
 * Example usage:
 */

const sleep = require("./sleep");

// Using sleep to delay for 2 seconds and then log a message
sleep(2000, "Wake up!").then((message) => {
  console.log(message); // Output: "Wake up!"
});

// Using sleep to throw an error after 2 seconds
sleep(2000, "Error occurred", true).catch((error) => {
  console.error(error); // Output: "Error occurred"
});
```

### split

- **Description:** Returns an array by splitting a string using a specified character.
- **Params:**
  - `text` (String): The string to be split.
  - `char` (String): Optional. The character used to split the string (default: " ").
- **Returns:** Array - An array of substrings.

#### Example

```javascript
/**
 * Example usage:
 */

const { split } = require('misc-helpers');

const text = "apple,banana,orange";
const array = split(text, ",");
console.log(array); // Output: ["apple", "banana", "orange"]
```

### stringCompress

- **Description:** Returns a text compressed using gzip compression.
- **Params:**
  - `text` (String): The text to be compressed.
  - `raw` (Boolean): Optional. If true, returns the compressed data as raw gzip encoding (default: false).
  - `options` (Object): Optional. Additional options for compression.
  - `options.level` (Integer): Optional. Compression level (0-9, where 0 is no compression and 9 is maximum compression) (default: 3).
  - `options.mem` (Integer): Optional. Memory usage parameter (default: 16).
- **Returns:** Promise<String | Uint8Array> - A Promise that resolves to the compressed text or raw gzip encoding.
- Throws: Error - If compression fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { stringCompress } = require('misc-helpers');

async function compressText() {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  
  try {
    const compressedText = await stringCompress(text);
    console.log("Compressed Text:", compressedText);
  } catch (error) {
    console.error("Compression Error:", error);
  }
}

compressText();
```

### stringDecompress

- **Description:** Returns a text decompressed from gzip compression.
- **Params:**
  - `gzipped` (String | Uint8Array): The text or Uint8Array to be decompressed, possibly base64 encoded if `raw` is false.
  - `raw` (Boolean): Optional. If true, expects `gzipped` to be raw Uint8Array data; if false, expects `gzipped` to be base64 encoded (default: false).
- **Returns:** Promise<String> - A Promise that resolves to the decompressed text.
- Throws: Error - If decompression fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { stringDecompress } = require('misc-helpers');

async function decompressText() {
  const gzippedText = "H4sIAAAAAAAA/8vJLS5R4EvyKklRjQQAAP//WgkIbAAAA";
  
  try {
    const decompressedText = await stringDecompress(gzippedText, true);
    console.log("Decompressed Text:", decompressedText);
  } catch (error) {
    console.error("Decompression Error:", error);
  }
}

decompressText();
```

### stringToDate

- **Description:** Returns a new Date object parsed from a string date representation.
- **Params:**
  - `stringDate` (String): The string date to be parsed.
  - `stringFormat` (String): Optional. The format in which the string date text is provided (default: 'yyyy-MM-dd'T'HH:mm:ss.SSS'Z').
  - `defaultDate` (Date): Optional. The default date to use if parsing fails (default: current date).
- **Returns:** Date - A new Date object parsed from the string date, adjusted for timezone.
- Throws: None.

#### Example

```javascript
/**
 * Example usage:
 */

const { constants, stringToDate } = require('misc-helpers');

const dateString = "2023-06-14T12:00:00.000Z";
const parsedDate = stringToDate(dateString, constants.DATE_ISO_FORMAT);
console.log("Parsed Date:", parsedDate);
```

### stringToDateToFormat

- **Description:** Returns a formatted string date parsed from a string date representation.
- **Params:**
  - `stringDate` (String): The string date to be parsed.
  - `fromFormat` (String): Optional. The format in which the string date text is provided (default: 'yyyy-MM-dd'T'HH:mm:ss.SSS').
  - `toFormat` (String): Optional. The format to which the parsed date should be formatted (default: 'dd-MM-yyyy HH:mm:ss').
- **Returns:** String - A formatted string date representation.
- Throws: None.

#### Example

```javascript
/**
 * Example usage:
 */

const { constants, stringToDateToFormat} = require('misc-helpers');

const dateString = "2023-06-14T12:00:00.000Z";
const formattedDate = stringToDateToFormat(dateString, constants.DATE_ISO_FORMAT, constants.DATE_BR_HOUR_FORMAT_D);
console.log("Formatted Date:", formattedDate);
```

### stringToFormat

- **Description:** Returns a string formatted according to a given pattern.
- **Params:**
  - `text` (Any): The text to be formatted.
  - `pattern` (String): Optional. The pattern specifying how the text should be formatted (default: "##.###.###/####-##").
  - `options` (Object): Optional. The options to customize behavior.
    - `options.digitsOnly` (Boolean): Whether to apply digits-only transformation (default: false).
    - `options.paddingChar` (String): The padding character to use (default: '0').
- **Returns:** String - A string formatted according to the specified pattern.
- Throws: None.

#### Example

```javascript
/**
 * Example usage:
 */

const { constants, stringToFormat } = require('misc-helpers');

const cnpj = "12345678000195";
const formattedCnpj = stringToFormat(cnpj, constants.STRING_FORMAT_CNPJ);
console.log("Formatted CNPJ:", formattedCnpj); // Output: "12.345.678/0001-95"
```

### stringZLibCompress

- **Description:** Returns a text compressed using zlib compression.
- **Params:**
  - `text` (String): The text to be compressed.
  - `raw` (Boolean): Optional. If true, returns the raw zlib compressed data (default: false).
  - `options` (Object): Optional. The options to customize compression.
    - `options.level` (Integer): Compression level (default: undefined).
    - `options.mem` (Integer): Memory usage (default: undefined).
- **Returns:** String - The compressed text as a base64 encoded string if `raw` is false, otherwise as a Uint8Array.
- Throws: Error - If compression fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { stringZLibCompress } = require('misc-helpers');

async function compressText() {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  try {
    const compressedText = await stringZLibCompress(text);
    console.log("Compressed Text:", compressedText);
  } catch (error) {
    console.error("Compression Error:", error);
  }
}

compressText();
```

### stringZLibDecompress

- **Description:** Returns a text decompressed using zlib decompression.
- **Params:**
  - `zlibbed` (String): The zlib compressed text to be decompressed.
  - `raw` (Boolean): Optional. If true, indicates that the input `zlibbed` text is base64 encoded (default: false).
- **Returns:** String - The decompressed text.
- Throws: Error - If decompression fails or any other error occurs.

#### Example

```javascript
/**
 * Example usage:
 */

const { stringZLibDecompress } = require('misc-helpers');

async function decompressText() {
  const zlibbedText = "eJzT0yMAAGTvBe8=";
  try {
    const decompressedText = await stringZLibDecompress(zlibbedText, true);
    console.log("Decompressed Text:", decompressedText);
  } catch (error) {
    console.error("Decompression Error:", error);
  }
}

decompressText();
```

### toString

- **Description:** Returns a string representation of a given value.
- **Params:**
  - `textObj` (Any): Value to be converted to a string.
  - `objectToJSON` (Boolean): Optional. Whether to transform objects to JSON stringified form (default: true).
- **Returns:** String - The string representation of the provided value.

#### Example

```javascript
/**
 * Example usage:
 */

const { toString } = require('misc-helpers');

const obj = { key: 'value' };
const str = toString(obj);
console.log(str); // Output: '{"key":"value"}'

const num = 123;
const numStr = toString(num);
console.log(numStr); // Output: '123'
```

### uint8ArrayFromString

- **Description:** Returns a Uint8Array representation of a string.
- **Params:**
  - `text` (String): Value to be converted to a Uint8Array.
  - `joinChar` (String): Optional. Character to join Uint8Array elements into a string.
- **Returns:** Uint8Array or String - If `joinChar` is provided, returns the joined string representation of Uint8Array; otherwise, returns Uint8Array itself.

#### Example

```javascript
/**
 * Example usage:
 */

const { uint8ArrayFromString } = require('misc-helpers');

const text = "Hello, world!";
const uint8Array = uint8ArrayFromString(text);
console.log(uint8Array); // Output: Uint8Array [ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]

const joinedString = uint8ArrayFromString(text, '-');
console.log(joinedString); // Output: '72-101-108-108-111-44-32-119-111-114-108-100-33'
```

### uint8ArrayToString

- **Description:** Converts a Uint8Array or an array of bytes into a string.
- **Params:**
  - `uint8Array` (Uint8Array or Array): The Uint8Array or array of bytes to convert to a string.
  - `splitChar` (String): Optional. Character to split Uint8Array elements before conversion.
- **Returns:** String - The converted string representation of the Uint8Array or array of bytes.

#### Example

```javascript
/**
 * Example usage:
 */

const { uint8ArrayToString } = require('misc-helpers');

const uint8Array = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
const text = uint8ArrayToString(uint8Array);
console.log(text); // Output: 'Hello, world!'

const joinedString = '72-101-108-108-111-44-32-119-111-114-108-100-33';
const convertedText = uint8ArrayToString(joinedString, '-');
console.log(convertedText); // Output: 'Hello, world!'
```

<hr />

## Validators

### validateCADICMSPR

- **Description:** Validates a given CADICMS from the Brazilian Paraná State.
- **Params:**
  - `cadicms` (String): The CADICMS value to be validated.
- **Returns:** Boolean - Returns true if the CADICMS is valid, otherwise false.

#### Example

```javascript
/**
 * Example usage:
 */

const { validateCADICMSPR } = require('misc-helpers');

const validCADICMS = "1234567890";
const invalidCADICMS = "9876543210";

console.log(validateCADICMSPR(validCADICMS)); // Output: true
console.log(validateCADICMSPR(invalidCADICMS)); // Output: false
```

### validateCNPJ

- **Description:** Validates a given CNPJ (Cadastro Nacional da Pessoa Jurídica, Brazilian corporate taxpayer registry number).
- **Params:**
  - `cnpj` (String): The CNPJ value to be validated.
- **Returns:** Boolean - Returns true if the CNPJ is valid, otherwise false.

#### Example

```javascript
/**
 * Example usage:
 */

const { validateCNPJ } = require('misc-helpers');

const validCNPJ = "12.345.678/0001-99";
const invalidCNPJ = "11.111.111/1111-11";

console.log(validateCNPJ(validCNPJ)); // Output: true
console.log(validateCNPJ(invalidCNPJ)); // Output: false
```

### validateCPF

- **Description:** Validates a given CPF (Cadastro de Pessoas Físicas, Brazilian individual taxpayer registry number).
- **Params:**
  - `cpf` (String): The CPF value to be validated.
- **Returns:** Boolean - Returns true if the CPF is valid, otherwise false.

#### Example

```javascript
/**
 * Example usage:
 */

const { validateCPF } = require('misc-helpers');

const validCPF = "123.456.789-09";
const invalidCPF = "111.111.111-11";

console.log(validateCPF(validCPF)); // Output: true
console.log(validateCPF(invalidCPF)); // Output: false
```

### validateEmail

- **Description:** Validates a given email address using a regular expression.
- **Params:**
  - `email` (String): The email address to be validated.
- **Returns:** Boolean - Returns true if the email address is valid according to the regular expression, otherwise false.

#### Example

```javascript
/**
 * Example usage:
 */

const { validateEmail } = require('misc-helpers');

const validEmail = "example@email.com";
const invalidEmail = "example.email.com";

console.log(validateEmail(validEmail)); // Output: true
console.log(validateEmail(invalidEmail)); // Output: false
```

<hr />

