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
  - [Validators](#validators)

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

- **convertECDSAASN1Signature**
  - Description: Converts an ECDSA signature in ASN.1/DER format to a concatenated r|s format.
  - Returns: The signature in concatenated r|s format.
  - Params:
    - `asn1Signature` : ECDSA ASN.1 signature to be converted.

- **getAuthenticationAuthData**
  - Description: Extracts data from a WebAuthn authentication assertion object.
  - Returns: An object containing extracted data from the authentication assertion.
    - `id`: ID of the WebAuthn assertion.
    - `rawId`: Raw ID of the WebAuthn assertion.
    - `type`: Type of the WebAuthn assertion.
    - `authData`: Authenticator data included in the assertion.
    - `response`: Response object containing additional data related to the assertion.
    
  - Params:
    - `assertion` : The WebAuthn authentication assertion object.

- **getRegistrationAuthData**
  - Description: Retrieves registration authentication data from a WebAuthn credential.
  - Params:
    - `credential` {PublicKeyCredential} : The WebAuthn credential object.
  - Returns: An object containing registration authentication data extracted from the credential.
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

- **getWebAuthnAuthenticationAssertion**
  - Description: Initiates the WebAuthn authentication process and returns an assertion.
  - Returns: A Promise that resolves to the obtained PublicKeyCredential or a message indicating that WebAuthn is not supported.
  - Params:
    - `props` {Object} : The PublicKeyCredentialRequestOptions object containing the options for requesting an authentication assertion.
    - `callback` {Function} (optional) : Optional callback function to be called with the obtained assertion.

- **getWebAuthnRegistrationCredential**
  - Description: Initiates the WebAuthn registration process and returns a credential.
  - Returns: A Promise that resolves to the created PublicKeyCredential or a message indicating that WebAuthn is not supported.
  - Params:
    - `props` {Object} : The PublicKeyCredentialCreationOptions object containing the options for creating a new credential.
    - `callback` {Function} (optional) : Optional callback function to be called with the created credential.
  

- **validateAuthentication**
  - Description: Asynchronously validates a WebAuthn authentication assertion against the expected properties and the provided credential.
  - Returns: `Promise<boolean>`: Returns true if the validation is successful.
  - Params
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


- **validateRPID**
  - Description: Asynchronously validates relying party identifier (RPID) for WebAuthn.
  - Returns: `Promise<boolean>`: Returns a promise that resolves to true if the RPID is valid.
  - Params:
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

- Description: Returns the between conditions in an object format based on the provided date parameters.
- Returns: The modified `object` with between conditions set in an object format.
- Params:
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

- Description: Returns the between conditions in an object format based on the provided parameters.
- Params:
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

- Description: Returns the string like condition format based on the provided parameters.
- Params:
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
  - Description: Completes a waiting operation by resolving or rejecting a promise based on the success status.
  - Params:
    - `name` (string): The identifier for the waiting operation.
    - `isSuccessful` (boolean): Optional. Indicates whether the operation was successful (default: true).
    - `returnParam` (any): Optional. The parameter to be returned or rejected with the promise.
  - Returns: Returns `true` if the operation completes successfully; otherwise, returns `false` or throws an error.

- **`startWait(name)`**
  - Description: Initiates a waiting operation by creating a new promise in the wait list.
  - Params:
    - `name` (string): The identifier for the waiting operation.
  - Returns: Returns a promise associated with the waiting operation.

- **`finishAll(isSuccessful, returnParam)`**
  - Description: Completes all waiting operations in the wait list, resolving or rejecting promises based on the success status.
  - Params:
    - `isSuccessful` (boolean): Indicates whether the operations were successful.
    - `returnParam` (any): The parameter to be returned or rejected with each promise.
  - Returns: undefined

#### Usage

```javascript
const WP = require('./path/to/WaitPlugin');

// Example: Starting a wait operation
async function exampleWaitOperation() {
  try {
    await WP.startWait('operationName');
    // Perform async operation
    await WP.finishWait('operationName', true, 'Operation successful');
  } catch (error) {
    // Handle error
    await WP.finishWait('operationName', false, 'Operation failed');
  }
}

// Example: Finishing all wait operations
WP.finishAll(true, 'All operations finished successfully');
```

<hr />

## Helpers

### dateCompareAsc

- Description: Returns whether a given dateA is earlier than dateB, considering optional customization options like ignoring errors, considering hours, minutes, and seconds, and whether to consider equality as earlier.
- Returns: true if dateA is earlier than dateB according to the specified options; otherwise, returns false.
- Params:
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

- Description: Returns whether a given dateA is in a later time than dateB, considering optional customization options like ignoring errors, considering hours, minutes, and seconds, and whether to consider equality as later.
- Returns: true if dateA is in a later time than dateB according to the specified options; otherwise, returns false.
- Params:
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

- Description: Returns a default value instead of empty or null.
- Returns: The provided value (`checkValue`) if it is not null or undefined; otherwise, returns the specified default value.
- Params:
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

- Description: Checks if a given object is an instance of a specified type.
- Returns: true if the object provided is an instance of the specified instance type; otherwise, returns false.
- Params:
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

- Description: Checks if a given value is a numeric value.
- Returns: true if the value provided is numeric; otherwise, returns false.
- Params:
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

- Description: Checks if a given object is an object.
- Returns: true if the object provided is an object; otherwise, returns false.
- Params:
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

- Description: Returns a new object with the merge of two objects, `target` and `source`.
- Returns: A new object resulting from merging `target` and `source`.
- Params:
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

<hr />

## Validators


<hr />

