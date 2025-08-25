var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/helpers/index.js
var helpers_exports = {};
__export(helpers_exports, {
  dateCompareAsc: () => dateCompareAsc_default,
  dateCompareDesc: () => dateCompareDesc_default,
  default: () => helpers_default,
  defaultNumeric: () => defaultNumeric_default,
  defaultValue: () => defaultValue_default,
  isInstanceOf: () => isInstanceOf_default,
  isNumber: () => isNumber_default,
  isObject: () => isObject_default
});

// src/helpers/dateCompareAsc.js
function dateCompareAsc(dateA, dateB, options = {}) {
  const finalOptions = {
    considerHMS: false,
    ignoreErrors: false,
    considerEquals: false,
    ...options
  };
  if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    const paramName = !(dateA instanceof Date) ? "dateA" : "dateB";
    throw new TypeError(
      `dateCompareAsc Function: ${paramName} provided is not a Date Object`
    );
  }
  try {
    let timeA;
    let timeB;
    if (!finalOptions.considerHMS) {
      timeA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      ).getTime();
      timeB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      ).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }
    return timeA < timeB || timeA === timeB && finalOptions.considerEquals;
  } catch (error) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw error;
  }
}
var dateCompareAsc_default = dateCompareAsc;

// src/helpers/dateCompareDesc.js
function dateCompareDesc(dateA, dateB, options = {}) {
  const finalOptions = {
    considerHMS: false,
    ignoreErrors: false,
    considerEquals: false,
    ...options
  };
  if (!(dateA instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateA provided is not a Date Object"
    );
  }
  if (!(dateB instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateB provided is not a Date Object"
    );
  }
  try {
    let timeA;
    let timeB;
    if (!finalOptions.considerHMS) {
      timeA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      ).getTime();
      timeB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      ).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }
    return timeA > timeB || timeA === timeB && finalOptions.considerEquals;
  } catch (error) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw error;
  }
}
var dateCompareDesc_default = dateCompareDesc;

// src/helpers/defaultNumeric.js
function defaultNumeric(checkValue, defaultValue2) {
  const num = Number(checkValue);
  return Number.isFinite(num) && !isNaN(num) ? num : defaultValue2;
}
var defaultNumeric_default = defaultNumeric;

// src/helpers/defaultValue.js
function defaultValue(checkValue, defaultValue2) {
  return checkValue ?? defaultValue2;
}
var defaultValue_default = defaultValue;

// src/helpers/isInstanceOf.js
function isInstanceOf(object, instanceType) {
  return object instanceof instanceType;
}
var isInstanceOf_default = isInstanceOf;

// src/helpers/isNumber.js
function isNumber(value) {
  return Number.isFinite(value);
}
var isNumber_default = isNumber;

// src/helpers/isObject.js
function isObject(object) {
  return object !== null && typeof object === "object";
}
var isObject_default = isObject;

// src/helpers/index.js
var helpers_default = {
  dateCompareAsc: dateCompareAsc_default,
  dateCompareDesc: dateCompareDesc_default,
  defaultNumeric: defaultNumeric_default,
  defaultValue: defaultValue_default,
  isInstanceOf: isInstanceOf_default,
  isNumber: isNumber_default,
  isObject: isObject_default
};

// src/utils/index.js
var utils_exports = {};
__export(utils_exports, {
  JSONFrom: () => JSONFrom_default,
  JSONTo: () => JSONTo_default,
  assign: () => assign_default,
  base64From: () => base64From_default,
  base64FromBase64URLSafe: () => base64FromBase64URLSafe_default,
  base64FromBuffer: () => base64FromBuffer_default,
  base64To: () => base64To_default,
  base64ToBuffer: () => base64ToBuffer_default,
  base64URLEncode: () => base64URLEncode_default,
  bufferCompare: () => bufferCompare_default,
  bufferConcatenate: () => bufferConcatenate_default,
  bufferFromString: () => bufferFromString_default,
  bufferToString: () => bufferToString_default,
  calculateSecondsInTime: () => calculateSecondsInTime_default,
  cleanObject: () => cleanObject_default,
  currencyBRToFloat: () => currencyBRToFloat_default,
  dateFirstHourOfDay: () => dateFirstHourOfDay_default,
  dateLastHourOfDay: () => dateLastHourOfDay_default,
  dateToFormat: () => dateToFormat_default,
  debouncer: () => debouncer_default,
  default: () => utils_default,
  deleteKeys: () => deleteKeys_default,
  generateRandomString: () => generateRandomString_default,
  generateSimpleId: () => generateSimpleId_default,
  getExecutionTime: () => getExecutionTime_default,
  messageDecryptFromChunks: () => messageDecryptFromChunks_default,
  messageEncryptToChunks: () => messageEncryptToChunks_default,
  normalize: () => normalize_default,
  pickKeys: () => pickKeys_default,
  pushLogMessage: () => pushLogMessage_default,
  regexDigitsOnly: () => regexDigitsOnly_default,
  regexLettersOnly: () => regexLettersOnly_default,
  regexReplaceTrim: () => regexReplaceTrim_default,
  removeDuplicatedStrings: () => removeDuplicatedStrings_default,
  sleep: () => sleep_default,
  split: () => split_default,
  stringCompress: () => stringCompress_default,
  stringDecompress: () => stringDecompress_default,
  stringToDate: () => stringToDate_default,
  stringToDateToFormat: () => stringToDateToFormat_default,
  stringToFormat: () => stringToFormat_default,
  stringZLibCompress: () => stringZLibCompress_default,
  stringZLibDecompress: () => stringZLibDecompress_default,
  throttle: () => throttle_default,
  timestamp: () => timestamp_default,
  toString: () => toString_default,
  uint8ArrayFromString: () => uint8ArrayFromString_default,
  uint8ArrayToString: () => uint8ArrayToString_default
});

// src/utils/assign.js
function deepClone(source, map = /* @__PURE__ */ new WeakMap()) {
  if (source === null || typeof source !== "object") {
    return source;
  }
  if (map.has(source)) {
    return map.get(source);
  }
  if (Array.isArray(source)) {
    const clone2 = [];
    map.set(source, clone2);
    for (let i = 0; i < source.length; i++) {
      clone2[i] = deepClone(source[i], map);
    }
    return clone2;
  }
  const clone = {};
  map.set(source, clone);
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      clone[key] = deepClone(source[key], map);
    }
  }
  return clone;
}
function assign(target = {}, source = {}, throwsError = true) {
  if (target === null || typeof target !== "object") {
    if (throwsError) {
      throw new TypeError("Assign Function: The target provided is not an object");
    }
    return null;
  }
  if (source === null || typeof source !== "object") {
    if (throwsError) {
      throw new TypeError("Assign Function: The source provided is not an object");
    }
    return null;
  }
  try {
    const clonedTarget = deepClone(target);
    const clonedSource = deepClone(source);
    return Object.assign(clonedTarget, clonedSource);
  } catch (error) {
    if (throwsError) {
      throw error;
    }
    return null;
  }
}
var assign_default = assign;

// src/utils/base64From.js
function base64From(text = "") {
  if (typeof text != "string" || !text) {
    return "";
  }
  if (typeof window === "undefined") {
    return Buffer.from(text, "base64").toString("utf-8");
  }
  return atob(text);
}
var base64From_default = base64From;

// src/utils/base64FromBase64URLSafe.js
function base64FromBase64URLSafe(urlSafeBase64 = "") {
  if (typeof urlSafeBase64 !== "string" || urlSafeBase64.length === 0) {
    return "";
  }
  const base64 = urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");
  const requiredPadding = (4 - base64.length % 4) % 4;
  return base64.padEnd(base64.length + requiredPadding, "=");
}
var base64FromBase64URLSafe_default = base64FromBase64URLSafe;

// src/utils/toString.js
function toString(textObj = "", objectToJSON = true) {
  if (textObj == null) {
    return "";
  }
  const initialString = String(textObj);
  if (objectToJSON && initialString === "[object Object]" && typeof textObj === "object") {
    try {
      return JSON.stringify(textObj);
    } catch (error) {
      return initialString;
    }
  }
  return initialString;
}
var toString_default = toString;

// src/utils/base64To.js
function base64To(text = "", fromFormat) {
  let b64;
  if (typeof window === "undefined") {
    if (isNumber_default(text)) {
      text = toString_default(text);
    }
    b64 = Buffer.from(text, fromFormat).toString("base64");
  } else {
    b64 = btoa(text);
  }
  return b64.replaceAll("=", "");
}
var base64To_default = base64To;

// src/utils/base64FromBuffer.js
function base64FromBuffer(buffer) {
  if (!(buffer instanceof ArrayBuffer)) {
    return "";
  }
  if (typeof window === "undefined") {
    return base64To_default(Buffer.from(buffer));
  }
  const bytes = new Uint8Array(buffer);
  const CHUNK_SIZE = 8192;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    chunks.push(String.fromCharCode.apply(null, chunk));
  }
  return base64To_default(chunks.join(""));
}
var base64FromBuffer_default = base64FromBuffer;

// src/utils/base64ToBuffer.js
function base64ToBuffer(base64String = "") {
  if (typeof base64String !== "string" || base64String.length === 0) {
    return new ArrayBuffer(0);
  }
  try {
    if (typeof window === "undefined") {
      const nodeBuffer = Buffer.from(base64String, "base64");
      return nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength
      );
    }
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    return new ArrayBuffer(0);
  }
}
var base64ToBuffer_default = base64ToBuffer;

// src/utils/base64URLEncode.js
function base64URLEncode(text = "", fromFormat = "utf8") {
  const standardBase64 = base64To_default(toString_default(text), fromFormat);
  return standardBase64.replace(/\+/g, "-").replace(/\//g, "_");
}
var base64URLEncode_default = base64URLEncode;

// src/utils/bufferCompare.js
function bufferCompare(buffer1, buffer2) {
  if (!buffer1 || !buffer2 || buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }
  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}
var bufferCompare_default = bufferCompare;

// src/utils/bufferConcatenate.js
function bufferConcatenate(buffer1, buffer2) {
  if (buffer1 == null || buffer2 == null) {
    return buffer1 || buffer2 || null;
  }
  try {
    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);
    const resultView = new Uint8Array(view1.length + view2.length);
    resultView.set(view1, 0);
    resultView.set(view2, view1.length);
    return resultView.buffer;
  } catch (error) {
    return null;
  }
}
var bufferConcatenate_default = bufferConcatenate;

// src/utils/bufferFromString.js
function bufferFromString(txtString, encoding = "utf-8") {
  if (typeof txtString !== "string") {
    return null;
  }
  if (typeof window === "undefined") {
    return Buffer.from(txtString, encoding);
  }
  return new TextEncoder(encoding).encode(txtString);
}
var bufferFromString_default = bufferFromString;

// src/utils/bufferToString.js
function bufferToString(buffer, encoding = "utf-8") {
  if (buffer == null) {
    return "";
  }
  if (typeof window === "undefined") {
    const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    return nodeBuffer.toString(encoding);
  }
  try {
    return new TextDecoder().decode(buffer);
  } catch (error) {
    return "";
  }
}
var bufferToString_default = bufferToString;

// src/utils/calculateSecondsInTime.js
function calculateSecondsInTime(seconds, add = true) {
  if (typeof seconds !== "number" || !isFinite(seconds)) {
    return null;
  }
  const offsetInMilliseconds = seconds * 1e3;
  if (add) {
    return Date.now() + offsetInMilliseconds;
  }
  return Date.now() - offsetInMilliseconds;
}
var calculateSecondsInTime_default = calculateSecondsInTime;

// src/utils/cleanObject.js
function cleanObject(sourceObject, options = {}) {
  const cache = /* @__PURE__ */ new WeakMap();
  function _clean(currentObject) {
    if (currentObject === null || typeof currentObject !== "object" || currentObject.constructor !== Object) {
      return currentObject;
    }
    if (cache.has(currentObject)) {
      return void 0;
    }
    const {
      recursive = true,
      considerNullValue = false,
      considerFalseValue = true
    } = options || {};
    const newObj = {};
    cache.set(currentObject, newObj);
    for (const key of Reflect.ownKeys(currentObject)) {
      let value = currentObject[key];
      if (recursive) {
        value = _clean(value);
      }
      const isUndefined = value === void 0;
      const isNullAndIgnored = value === null && !considerNullValue;
      const isFalseAndIgnored = value === false && !considerFalseValue;
      const isEmptyString = value === "";
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObjectAfterCleaning = value !== null && typeof value === "object" && value.constructor === Object && Reflect.ownKeys(value).length === 0;
      if (!isUndefined && !isNullAndIgnored && !isFalseAndIgnored && !isEmptyString && !isEmptyArray && !isEmptyObjectAfterCleaning) {
        newObj[key] = value;
      }
    }
    return Reflect.ownKeys(newObj).length > 0 ? newObj : void 0;
  }
  const result = _clean(sourceObject);
  if (result === void 0 && sourceObject?.constructor === Object) {
    return {};
  }
  return result;
}
var cleanObject_default = cleanObject;

// src/utils/currencyBRToFloat.js
function currencyBRToFloat(moneyValue) {
  if (moneyValue == null) {
    return false;
  }
  if (isNumber_default(moneyValue)) {
    return moneyValue;
  }
  const cleanedString = toString_default(moneyValue).replace(/R\$|\s|\./g, "").replace(",", ".");
  if (/[^0-9.]/.test(cleanedString)) {
    return false;
  }
  if (cleanedString === "" || cleanedString === ".") {
    return false;
  }
  const result = parseFloat(cleanedString);
  if (isNumber_default(result)) {
    return result;
  }
  return false;
}
var currencyBRToFloat_default = currencyBRToFloat;

// src/constants.js
var constants_exports = {};
__export(constants_exports, {
  BRAZILIAN_STATES: () => BRAZILIAN_STATES,
  BRAZILIAN_STATES_ABBR: () => BRAZILIAN_STATES_ABBR,
  DATE_BR_FORMAT_D: () => DATE_BR_FORMAT_D,
  DATE_BR_FORMAT_FS: () => DATE_BR_FORMAT_FS,
  DATE_BR_HOUR_FORMAT_D: () => DATE_BR_HOUR_FORMAT_D,
  DATE_BR_HOUR_FORMAT_FS: () => DATE_BR_HOUR_FORMAT_FS,
  DATE_BR_MONTH_FORMAT_D: () => DATE_BR_MONTH_FORMAT_D,
  DATE_BR_MONTH_FORMAT_FS: () => DATE_BR_MONTH_FORMAT_FS,
  DATE_EUA_FORMAT_D: () => DATE_EUA_FORMAT_D,
  DATE_EUA_FORMAT_FS: () => DATE_EUA_FORMAT_FS,
  DATE_EUA_HOUR_FORMAT_D: () => DATE_EUA_HOUR_FORMAT_D,
  DATE_EUA_HOUR_FORMAT_FS: () => DATE_EUA_HOUR_FORMAT_FS,
  DATE_EUA_MONTH_FORMAT_D: () => DATE_EUA_MONTH_FORMAT_D,
  DATE_EUA_MONTH_FORMAT_FS: () => DATE_EUA_MONTH_FORMAT_FS,
  DATE_ISO_FORMAT: () => DATE_ISO_FORMAT,
  DATE_ISO_FORMAT_TZ: () => DATE_ISO_FORMAT_TZ,
  REGEX_CNPJ_ALPHANUMERIC: () => REGEX_CNPJ_ALPHANUMERIC,
  REGEX_EMAIL: () => REGEX_EMAIL,
  REGEX_PHONE_BR: () => REGEX_PHONE_BR,
  REGEX_UUID_V4: () => REGEX_UUID_V4,
  STRING_FORMAT_CADICMSPR: () => STRING_FORMAT_CADICMSPR,
  STRING_FORMAT_CEP: () => STRING_FORMAT_CEP,
  STRING_FORMAT_CNPJ: () => STRING_FORMAT_CNPJ,
  STRING_FORMAT_CNPJ_RAIZ: () => STRING_FORMAT_CNPJ_RAIZ,
  STRING_FORMAT_CPF: () => STRING_FORMAT_CPF,
  STRING_FORMAT_PHONE: () => STRING_FORMAT_PHONE,
  STRING_FORMAT_PROTOCOLPR: () => STRING_FORMAT_PROTOCOLPR,
  default: () => constants_default
});
var DATE_ISO_FORMAT_TZ = `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`;
var DATE_ISO_FORMAT = `yyyy-MM-dd'T'HH:mm:ss.SSS`;
var DATE_BR_FORMAT_D = `dd-MM-yyyy`;
var DATE_BR_FORMAT_FS = `dd/MM/yyyy`;
var DATE_BR_HOUR_FORMAT_D = `dd-MM-yyyy HH:mm:ss`;
var DATE_BR_HOUR_FORMAT_FS = `dd/MM/yyyy HH:mm:ss`;
var DATE_BR_MONTH_FORMAT_D = `MM-yyyy`;
var DATE_BR_MONTH_FORMAT_FS = `MM/yyyy`;
var DATE_EUA_FORMAT_D = `yyyy-MM-dd`;
var DATE_EUA_FORMAT_FS = `yyyy/MM/dd`;
var DATE_EUA_HOUR_FORMAT_D = `yyyy-MM-dd HH:mm:ss`;
var DATE_EUA_HOUR_FORMAT_FS = `yyyy/MM/dd HH:mm:ss`;
var DATE_EUA_MONTH_FORMAT_D = `yyyy-MM`;
var DATE_EUA_MONTH_FORMAT_FS = `yyyy/MM`;
var STRING_FORMAT_CADICMSPR = "########-##";
var STRING_FORMAT_CNPJ = "##.###.###/####-##";
var STRING_FORMAT_CNPJ_RAIZ = "##.###.###";
var STRING_FORMAT_CPF = "###.###.###-##";
var STRING_FORMAT_PROTOCOLPR = "###.###.###.#";
var STRING_FORMAT_CEP = "#####-###";
var STRING_FORMAT_PHONE = "(##) # ####-####";
var REGEX_CNPJ_ALPHANUMERIC = /^([A-Z\d]){12}(\d){2}$/i;
var REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var REGEX_UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var REGEX_PHONE_BR = /^(?:\+55)?\d{10,11}$/;
var BRAZILIAN_STATES = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amap\xE1",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Cear\xE1",
  DF: "Distrito Federal",
  ES: "Esp\xEDrito Santo",
  GO: "Goi\xE1s",
  MA: "Maranh\xE3o",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Par\xE1",
  PB: "Para\xEDba",
  PR: "Paran\xE1",
  PE: "Pernambuco",
  PI: "Piau\xED",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rond\xF4nia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "S\xE3o Paulo",
  SE: "Sergipe",
  TO: "Tocantins"
};
var BRAZILIAN_STATES_ABBR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO"
];
var constants_default = {
  // Formatos de Data ISO 8601
  DATE_ISO_FORMAT_TZ,
  DATE_ISO_FORMAT,
  // Formatos de Data Brasileiros
  DATE_BR_FORMAT_D,
  DATE_BR_FORMAT_FS,
  DATE_BR_HOUR_FORMAT_D,
  DATE_BR_HOUR_FORMAT_FS,
  DATE_BR_MONTH_FORMAT_D,
  DATE_BR_MONTH_FORMAT_FS,
  // Formatos de Data Americanos
  DATE_EUA_FORMAT_D,
  DATE_EUA_FORMAT_FS,
  DATE_EUA_HOUR_FORMAT_D,
  DATE_EUA_HOUR_FORMAT_FS,
  DATE_EUA_MONTH_FORMAT_D,
  DATE_EUA_MONTH_FORMAT_FS,
  // Máscaras de Formatação
  STRING_FORMAT_CADICMSPR,
  STRING_FORMAT_CNPJ,
  STRING_FORMAT_CNPJ_RAIZ,
  STRING_FORMAT_CPF,
  STRING_FORMAT_PROTOCOLPR,
  STRING_FORMAT_CEP,
  STRING_FORMAT_PHONE,
  // Expressões Regulares
  REGEX_CNPJ_ALPHANUMERIC,
  REGEX_EMAIL,
  REGEX_UUID_V4,
  REGEX_PHONE_BR,
  // Dados Geográficos
  BRAZILIAN_STATES,
  BRAZILIAN_STATES_ABBR
};

// src/utils/dateToFormat.js
import { format } from "date-fns/format";
function dateToFormat(date, stringFormat = DATE_BR_FORMAT_D) {
  if (!isInstanceOf_default(date, Date) || isNaN(date.getTime())) {
    return false;
  }
  return format(date, stringFormat);
}
var dateToFormat_default = dateToFormat;

// src/utils/dateFirstHourOfDay.js
function dateFirstHourOfDay(date) {
  if (!isInstanceOf_default(date, Date) || isNaN(date.getTime())) {
    return false;
  }
  const newDate = new Date(date.getTime());
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
var dateFirstHourOfDay_default = dateFirstHourOfDay;

// src/utils/dateLastHourOfDay.js
function dateLastHourOfDay(date) {
  if (!isInstanceOf_default(date, Date) || isNaN(date.getTime())) {
    return false;
  }
  const newDate = new Date(date.getTime());
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}
var dateLastHourOfDay_default = dateLastHourOfDay;

// src/utils/debouncer.js
function debouncer(callback, timeout = 1e3) {
  if (typeof callback !== "function") {
    throw new TypeError("O callback fornecido para o debouncer deve ser uma fun\xE7\xE3o.");
  }
  if (typeof timeout !== "number") {
    throw new TypeError("O timeout do debouncer deve ser um n\xFAmero.");
  }
  let timer;
  return function(...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(context, args);
    }, timeout);
  };
}
var debouncer_default = debouncer;

// src/utils/deleteKeys.js
function deleteKeys(object = {}, keys = []) {
  if (!isObject_default(object)) {
    return object;
  }
  if (!Array.isArray(keys)) {
    return { ...object };
  }
  const newObject = { ...object };
  for (const key of keys) {
    delete newObject[key];
  }
  return newObject;
}
var deleteKeys_default = deleteKeys;

// src/utils/generateSimpleId.js
function generateSimpleId(id, separator = "_") {
  const randomBytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const parts = [];
  const idString = toString_default(id);
  if (idString) {
    parts.push(idString);
  }
  parts.push(Date.now());
  parts.push(randomHex);
  return parts.join(separator);
}
var generateSimpleId_default = generateSimpleId;

// src/utils/generateRandomString.js
var CHAR_SETS = {
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ACCENTED: "\xE0\xE1\xE2\xE3\xE7\xE8\xE9\xEA\xEC\xED\xEE\xF0\xF1\xF2\xF3\xF4\xF5\xF9\xFA\xFB\xFD",
  DIGITS: "0123456789",
  SYMBOLS: "!@#$%^&*-_+=;:,.<>?"
};
function generateRandomString(size = 32, options = {}) {
  const defaultOptions = {
    excludeLowerCaseChars: false,
    excludeUpperCaseChars: false,
    excludeAccentedChars: false,
    excludeDigits: false,
    excludeSymbols: false,
    includeSymbols: ""
  };
  const finalOptions = { ...defaultOptions, ...options };
  let validChars = finalOptions.includeSymbols;
  if (!finalOptions.excludeLowerCaseChars) validChars += CHAR_SETS.LOWERCASE;
  if (!finalOptions.excludeUpperCaseChars) validChars += CHAR_SETS.UPPERCASE;
  if (!finalOptions.excludeAccentedChars) validChars += CHAR_SETS.ACCENTED;
  if (!finalOptions.excludeDigits) validChars += CHAR_SETS.DIGITS;
  if (!finalOptions.excludeSymbols) validChars += CHAR_SETS.SYMBOLS;
  if (validChars.length === 0 || size <= 0) {
    return "";
  }
  const randomValues = new Uint32Array(size);
  globalThis.crypto.getRandomValues(randomValues);
  let result = [];
  for (let i = 0; i < size; i++) {
    const randomIndex = randomValues[i] % validChars.length;
    result.push(validChars[randomIndex]);
  }
  return result.join("");
}
var generateRandomString_default = generateRandomString;

// src/utils/getExecutionTime.js
function getExecutionTime(time) {
  if (typeof process !== "undefined" && typeof process.hrtime === "function") {
    if (time === void 0) {
      return process.hrtime.bigint();
    }
    if (typeof time !== "bigint") {
      return "0.000";
    }
    const diffNanos = process.hrtime.bigint() - time;
    const diffMillis = Number(diffNanos) / 1e6;
    return diffMillis.toFixed(3);
  }
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    if (time === void 0) {
      return performance.now();
    }
    if (typeof time !== "number" || !isFinite(time)) {
      return "0.000";
    }
    const diffMillis = performance.now() - time;
    return diffMillis.toFixed(3);
  }
  return Date.now().toFixed(3);
}
var getExecutionTime_default = getExecutionTime;

// src/utils/JSONFrom.js
function JSONFrom(text, throwsError = true) {
  if (typeof text !== "string") {
    if (throwsError) {
      throw new TypeError("A entrada para JSONFrom deve ser uma string.");
    }
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    if (throwsError) {
      throw error;
    }
    return null;
  }
}
var JSONFrom_default = JSONFrom;

// src/utils/JSONTo.js
function JSONTo(object = {}, throwsError = true) {
  try {
    return JSON.stringify(object);
  } catch (error) {
    if (throwsError) {
      throw error;
    }
    return null;
  }
}
var JSONTo_default = JSONTo;

// src/crypto/getCrypto.js
function getCrypto() {
  if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    return window.crypto;
  }
  try {
    if (typeof __require !== "undefined") {
      return __require("crypto");
    }
    if (typeof module !== "undefined" && module.createRequire) {
      const require2 = module.createRequire(import.meta.url);
      return require2("crypto");
    }
    throw new Error("No method available to load crypto module in current environment");
  } catch (error) {
    throw new Error(`Failed to load crypto module: ${error.message}`);
  }
}
var getCrypto_default = getCrypto;

// src/crypto/importCryptoKey.js
async function importCryptoKey(format2, keyData, algorithm, extractable, keyUsages) {
  const crypto3 = getCrypto_default();
  return await crypto3.subtle.importKey(
    format2,
    keyData,
    algorithm,
    extractable,
    keyUsages
  );
}
var importCryptoKey_default = importCryptoKey;

// src/crypto/encryptBuffer.js
async function encryptBuffer(publicKey, messageBuffer, props = {}) {
  if (!messageBuffer || messageBuffer.length === 0) return "";
  const crypto3 = getCrypto_default();
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer_default(cleanedPublicKey);
  const {
    format: format2 = "spki",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["encrypt"],
    padding = "RSA-OAEP"
  } = props || {};
  const importedKey = await importCryptoKey_default(
    format2 || "spki",
    binaryPublicKey,
    algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }
    },
    extractable !== void 0 ? extractable : true,
    keyUsages || ["encrypt"]
  );
  const encryptedBuffer = await crypto3.subtle.encrypt(
    { name: padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );
  return base64FromBuffer_default(encryptedBuffer);
}
var encryptBuffer_default = encryptBuffer;

// src/utils/messageEncryptToChunks.js
async function messageEncryptToChunks(publicKey, payload, props = {}) {
  if (payload === void 0 || payload === null) {
    return [];
  }
  let { chunkSize } = props || {};
  if (!isFinite(chunkSize) || chunkSize <= 0) {
    chunkSize = 190;
  }
  const jsonPayload = JSON.stringify({ data: payload });
  const bufferPayload = bufferFromString_default(jsonPayload);
  const chunks = [];
  for (let i = 0; i < bufferPayload.length; i += chunkSize) {
    chunks.push(bufferPayload.slice(i, i + chunkSize));
  }
  const encryptionPromises = chunks.map((chunk) => {
    return encryptBuffer_default(publicKey, chunk, props);
  });
  return await Promise.all(encryptionPromises);
}
var messageEncryptToChunks_default = messageEncryptToChunks;

// src/crypto/decryptBuffer.js
async function decryptBuffer(privateKey, encryptedMessage, props = {}) {
  if (!encryptedMessage) {
    return getCrypto_default().subtle ? new Uint8Array(0) : Buffer.alloc(0);
  }
  const {
    format: format2 = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props || {};
  const crypto3 = getCrypto_default();
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer_default(cleanedPrivateKey);
  const importedKey = await importCryptoKey_default(
    format2,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );
  const encryptedData = base64ToBuffer_default(encryptedMessage);
  const decryptedBuffer = await crypto3.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );
  return decryptedBuffer;
}
var decryptBuffer_default = decryptBuffer;

// src/utils/messageDecryptFromChunks.js
async function messageDecryptFromChunks(privateKey, messageChunks, props = {}) {
  if (!messageChunks || messageChunks.length === 0) {
    return "";
  }
  const decryptionPromises = messageChunks.map(
    (chunk) => decryptBuffer_default(privateKey, chunk, props)
  );
  const decryptedBuffers = await Promise.all(decryptionPromises);
  let totalLength = 0;
  for (const buffer of decryptedBuffers) {
    totalLength += buffer.byteLength;
  }
  const finalBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of decryptedBuffers) {
    finalBuffer.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }
  const jsonString = bufferToString_default(finalBuffer);
  const payload = JSON.parse(jsonString);
  return payload.data;
}
var messageDecryptFromChunks_default = messageDecryptFromChunks;

// src/utils/normalize.js
function normalize(text = "") {
  if (isNumber_default(text) || typeof text === "string") {
    return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return text;
}
var normalize_default = normalize;

// src/utils/pickKeys.js
function pickKeys(sourceObject, keysToPick) {
  if (sourceObject === null || typeof sourceObject !== "object" || Array.isArray(sourceObject)) {
    return {};
  }
  if (!Array.isArray(keysToPick)) {
    return {};
  }
  return keysToPick.reduce((newObj, key) => {
    if (Object.prototype.hasOwnProperty.call(sourceObject, key)) {
      newObj[key] = sourceObject[key];
    }
    return newObj;
  }, {});
}
var pickKeys_default = pickKeys;

// src/utils/pushLogMessage.js
function pushLogMessage(logObj, message, more_info) {
  if (!Array.isArray(logObj)) {
    logObj = [];
  }
  const newEntry = {
    time: (/* @__PURE__ */ new Date()).toISOString(),
    message
  };
  if (more_info !== void 0) {
    newEntry.more_info = more_info;
  }
  logObj.push(newEntry);
  return logObj;
}
var pushLogMessage_default = pushLogMessage;

// src/utils/regexDigitsOnly.js
function regexDigitsOnly(text = "") {
  const stringValue = toString_default(text);
  return stringValue.replace(/[^0-9]/g, "");
}
var regexDigitsOnly_default = regexDigitsOnly;

// src/utils/regexReplaceTrim.js
function regexReplaceTrim(text = "", regex = "A-Za-z\xC0-\xFA0-9 ", replacement = "", trim = true) {
  const stringValue = toString_default(text);
  const allowedChars = toString_default(regex);
  const replacementValue = toString_default(replacement);
  const filterRegex = new RegExp(`[^${allowedChars}]`, "g");
  let result = stringValue.replace(filterRegex, replacementValue);
  if (trim) {
    result = result.trim();
  }
  return result;
}
var regexReplaceTrim_default = regexReplaceTrim;

// src/utils/regexLettersOnly.js
function regexLettersOnly(text = "") {
  const stringValue = toString_default(text);
  return stringValue.replace(/[^A-Za-zÀ-ú]/g, "");
}
var regexLettersOnly_default = regexLettersOnly;

// src/utils/removeDuplicatedStrings.js
function removeDuplicatedStrings(text, splitString = " ", caseInsensitive = false) {
  if (isObject_default(text)) {
    return "";
  }
  const separator = toString_default(splitString);
  const array = toString_default(text).trim().split(separator).filter((v) => v);
  if (!caseInsensitive) {
    return [...new Set(array)].join(separator);
  } else {
    const seenIndexes = {};
    array.forEach((item, index) => {
      seenIndexes[item.toLowerCase()] = index;
    });
    const indexesToKeep = new Set(Object.values(seenIndexes));
    return array.filter((_item, index) => indexesToKeep.has(index)).join(separator);
  }
}
var removeDuplicatedStrings_default = removeDuplicatedStrings;

// src/utils/sleep.js
function sleep(milliseconds, returnValue = true, throwError = false) {
  if (typeof milliseconds !== "number" || milliseconds < 0) {
    const error = new TypeError("O tempo de espera (milliseconds) deve ser um n\xFAmero n\xE3o negativo.");
    return Promise.reject(error);
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (throwError) {
        if (returnValue === true) {
          return reject(new Error("Sleep Error"));
        }
        return reject(returnValue);
      }
      return resolve(returnValue);
    }, milliseconds);
  });
}
var sleep_default = sleep;

// src/utils/split.js
function split(text, char = " ") {
  if (!text || typeof text !== "string") {
    return [];
  }
  return text.split(char);
}
var split_default = split;

// src/utils/stringCompress.js
import { compressSync, strToU8 } from "fflate";
function stringCompress(text, options = {}) {
  const finalOptions = {
    outputType: "base64",
    level: 6,
    mem: 8,
    ...options
  };
  if (typeof text !== "string" || text.length === 0) {
    return finalOptions.outputType === "buffer" ? new Uint8Array() : "";
  }
  const inputBuffer = strToU8(text);
  const compressedBuffer = compressSync(inputBuffer, {
    level: finalOptions.level,
    mem: finalOptions.mem
  });
  if (finalOptions.outputType === "buffer") {
    return compressedBuffer;
  }
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    return Buffer.from(compressedBuffer).toString("base64");
  } else {
    let binary = "";
    const len = compressedBuffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressedBuffer[i]);
    }
    return btoa(binary);
  }
}
var stringCompress_default = stringCompress;

// src/utils/stringDecompress.js
import { decompressSync, strFromU8 } from "fflate";
function stringDecompress(compressedData, options = {}) {
  const finalOptions = {
    inputType: "base64",
    ...options
  };
  if (!compressedData) {
    return "";
  }
  try {
    let inputBuffer;
    if (finalOptions.inputType === "base64") {
      if (typeof compressedData !== "string") {
        return "";
      }
      if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
        inputBuffer = Buffer.from(compressedData, "base64");
      } else {
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      inputBuffer = compressedData;
    }
    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }
    const decompressedBuffer = decompressSync(inputBuffer);
    return strFromU8(decompressedBuffer);
  } catch (error) {
    return "";
  }
}
var stringDecompress_default = stringDecompress;

// src/utils/stringToDate.js
import { parse } from "date-fns/parse";
function stringToDate(stringDate, stringFormat = DATE_ISO_FORMAT, defaultDate = /* @__PURE__ */ new Date()) {
  let dateToProcess;
  if (typeof stringDate === "string") {
    const parsedDate = parse(stringDate, stringFormat, /* @__PURE__ */ new Date());
    if (isInstanceOf_default(parsedDate, Date) && !isNaN(parsedDate.getTime())) {
      dateToProcess = parsedDate;
    } else {
      dateToProcess = defaultDate;
    }
  } else {
    dateToProcess = defaultDate;
  }
  if (dateToProcess == null) {
    return false;
  }
  if (!isInstanceOf_default(dateToProcess, Date) || isNaN(dateToProcess.getTime())) {
    return false;
  }
  const timezoneOffsetMillis = dateToProcess.getTimezoneOffset() * 60 * 1e3;
  return new Date(dateToProcess.getTime() - timezoneOffsetMillis);
}
var stringToDate_default = stringToDate;

// src/utils/stringToDateToFormat.js
function stringToDateToFormat(stringDate, fromFormat = DATE_ISO_FORMAT, toFormat = DATE_BR_HOUR_FORMAT_D) {
  try {
    const dateObject = stringToDate_default(stringDate, fromFormat, false);
    if (dateObject) {
      const timezoneOffsetMillis = dateObject.getTimezoneOffset() * 60 * 1e3;
      const localDate = new Date(dateObject.getTime() + timezoneOffsetMillis);
      return dateToFormat_default(localDate, toFormat);
    }
  } catch (_) {
  }
  return false;
}
var stringToDateToFormat_default = stringToDateToFormat;

// src/utils/stringToFormat.js
function stringToFormat(text, pattern = STRING_FORMAT_CNPJ, options = {}) {
  const finalOptions = {
    digitsOnly: false,
    paddingChar: "0",
    ...options
  };
  let processedText = toString_default(text);
  if (finalOptions.digitsOnly) {
    processedText = regexDigitsOnly_default(processedText);
  }
  const requiredSize = (pattern.match(/#/g) || []).length;
  if (requiredSize === 0) {
    return pattern;
  }
  processedText = processedText.slice(0, requiredSize).padStart(requiredSize, finalOptions.paddingChar);
  let charIndex = 0;
  return pattern.replace(/#/g, () => processedText[charIndex++]);
}
var stringToFormat_default = stringToFormat;

// src/utils/stringZLibCompress.js
import { zlibSync, strToU8 as strToU82 } from "fflate";
function stringZLibCompress(text, options = {}) {
  const finalOptions = {
    outputType: "base64",
    level: 6,
    mem: 8,
    ...options
  };
  if (typeof text !== "string" || text.length === 0) {
    return finalOptions.outputType === "buffer" ? new Uint8Array() : "";
  }
  const inputBuffer = strToU82(text);
  const compressedBuffer = zlibSync(inputBuffer, {
    level: finalOptions.level,
    mem: finalOptions.mem
  });
  if (finalOptions.outputType === "buffer") {
    return compressedBuffer;
  }
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    return Buffer.from(compressedBuffer).toString("base64");
  } else {
    let binary = "";
    const len = compressedBuffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressedBuffer[i]);
    }
    return btoa(binary);
  }
}
var stringZLibCompress_default = stringZLibCompress;

// src/utils/stringZLibDecompress.js
import { unzlibSync, strFromU8 as strFromU82 } from "fflate";
function stringZLibDecompress(compressedData, options = {}) {
  const finalOptions = {
    inputType: "base64",
    ...options
  };
  if (!compressedData) {
    return "";
  }
  try {
    let inputBuffer;
    if (finalOptions.inputType === "base64") {
      if (typeof compressedData !== "string") {
        return "";
      }
      if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
        inputBuffer = Buffer.from(compressedData, "base64");
      } else {
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      inputBuffer = compressedData;
    }
    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }
    const decompressedBuffer = unzlibSync(inputBuffer);
    return strFromU82(decompressedBuffer);
  } catch (error) {
    return "";
  }
}
var stringZLibDecompress_default = stringZLibDecompress;

// src/utils/throttle.js
function throttle(callback, wait) {
  if (typeof callback !== "function") {
    throw new TypeError("O callback fornecido para o throttle deve ser uma fun\xE7\xE3o.");
  }
  if (typeof wait !== "number" || wait < 0) {
    throw new TypeError("O tempo de espera (wait) do throttle deve ser um n\xFAmero n\xE3o negativo.");
  }
  let inCooldown = false;
  return function(...args) {
    if (inCooldown) {
      return;
    }
    callback.apply(this, args);
    inCooldown = true;
    setTimeout(() => {
      inCooldown = false;
    }, wait);
  };
}
var throttle_default = throttle;

// src/utils/timestamp.js
function timestamp(format2 = "D-MT-Y_H:MN:S:MS") {
  const now = /* @__PURE__ */ new Date();
  const tokens = {
    // Ano com 4 dígitos
    Y: () => now.getFullYear(),
    // Mês com 2 dígitos (getMonth() é 0-indexado)
    MT: () => String(now.getMonth() + 1).padStart(2, "0"),
    // Dia com 2 dígitos
    D: () => String(now.getDate()).padStart(2, "0"),
    // Hora com 2 dígitos (formato 24h)
    H: () => String(now.getHours()).padStart(2, "0"),
    // Minuto com 2 dígitos
    MN: () => String(now.getMinutes()).padStart(2, "0"),
    // Segundo com 2 dígitos
    S: () => String(now.getSeconds()).padStart(2, "0"),
    // Milissegundo com 3 dígitos
    MS: () => String(now.getMilliseconds()).padStart(3, "0")
  };
  return format2.replace(/Y|MT|D|H|MN|S|MS/g, (token) => tokens[token]());
}
var timestamp_default = timestamp;

// src/utils/uint8ArrayFromString.js
function uint8ArrayFromString(text = "", joinChar) {
  if (typeof text !== "string") {
    return joinChar !== void 0 ? "" : new Uint8Array();
  }
  let uint8Array;
  if (typeof window === "undefined") {
    uint8Array = Buffer.from(text, "utf-8");
  } else {
    uint8Array = new TextEncoder().encode(text);
  }
  if (joinChar !== void 0) {
    return Array.from(uint8Array).join(joinChar);
  }
  return uint8Array;
}
var uint8ArrayFromString_default = uint8ArrayFromString;

// src/utils/uint8ArrayToString.js
function uint8ArrayToString(uint8Array, splitChar) {
  if (uint8Array == null) {
    return "";
  }
  let bufferSource = uint8Array;
  if (splitChar !== void 0 && typeof uint8Array === "string") {
    const bytes = uint8Array.split(splitChar).map((s) => parseInt(s.trim(), 10));
    bufferSource = new Uint8Array(bytes);
  }
  try {
    if (typeof window === "undefined") {
      const nodeBuffer = Buffer.isBuffer(bufferSource) ? bufferSource : Buffer.from(bufferSource);
      return nodeBuffer.toString("utf-8");
    }
    return new TextDecoder().decode(bufferSource);
  } catch (error) {
    return "";
  }
}
var uint8ArrayToString_default = uint8ArrayToString;

// src/utils/index.js
var utils_default = {
  assign: assign_default,
  base64From: base64From_default,
  base64FromBase64URLSafe: base64FromBase64URLSafe_default,
  base64FromBuffer: base64FromBuffer_default,
  base64To: base64To_default,
  base64ToBuffer: base64ToBuffer_default,
  base64URLEncode: base64URLEncode_default,
  bufferCompare: bufferCompare_default,
  bufferConcatenate: bufferConcatenate_default,
  bufferFromString: bufferFromString_default,
  bufferToString: bufferToString_default,
  calculateSecondsInTime: calculateSecondsInTime_default,
  cleanObject: cleanObject_default,
  currencyBRToFloat: currencyBRToFloat_default,
  dateToFormat: dateToFormat_default,
  dateFirstHourOfDay: dateFirstHourOfDay_default,
  dateLastHourOfDay: dateLastHourOfDay_default,
  debouncer: debouncer_default,
  deleteKeys: deleteKeys_default,
  generateSimpleId: generateSimpleId_default,
  generateRandomString: generateRandomString_default,
  getExecutionTime: getExecutionTime_default,
  JSONFrom: JSONFrom_default,
  JSONTo: JSONTo_default,
  messageEncryptToChunks: messageEncryptToChunks_default,
  messageDecryptFromChunks: messageDecryptFromChunks_default,
  normalize: normalize_default,
  pickKeys: pickKeys_default,
  pushLogMessage: pushLogMessage_default,
  regexDigitsOnly: regexDigitsOnly_default,
  regexReplaceTrim: regexReplaceTrim_default,
  regexLettersOnly: regexLettersOnly_default,
  removeDuplicatedStrings: removeDuplicatedStrings_default,
  sleep: sleep_default,
  split: split_default,
  stringCompress: stringCompress_default,
  stringDecompress: stringDecompress_default,
  stringToDate: stringToDate_default,
  stringToDateToFormat: stringToDateToFormat_default,
  stringToFormat: stringToFormat_default,
  stringZLibCompress: stringZLibCompress_default,
  stringZLibDecompress: stringZLibDecompress_default,
  throttle: throttle_default,
  timestamp: timestamp_default,
  toString: toString_default,
  uint8ArrayFromString: uint8ArrayFromString_default,
  uint8ArrayToString: uint8ArrayToString_default
};

// src/validators/index.js
var validators_exports = {};
__export(validators_exports, {
  default: () => validators_default,
  validateCADICMSPR: () => validateCADICMSPR_default,
  validateCEP: () => validateCEP_default,
  validateCNH: () => validateCNH_default,
  validateCNPJ: () => validateCNPJ_default,
  validateCPF: () => validateCPF_default,
  validateChavePix: () => validateChavePix_default,
  validateEmail: () => validateEmail_default,
  validatePISPASEPNIT: () => validatePISPASEPNIT_default,
  validateRG: () => validateRG_default,
  validateRenavam: () => validateRenavam_default,
  validateTituloEleitor: () => validateTituloEleitor_default
});

// src/validators/validateCADICMSPR.js
function _calculateVerifierDigit(digits, weights) {
  const sum = digits.split("").reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder <= 1 ? 0 : 11 - remainder;
}
function validateCADICMSPR(cadicms) {
  const digitsOnly = String(cadicms).replace(/[^\d]/g, "");
  const CADICMS_LENGTH = 10;
  if (digitsOnly === "" || digitsOnly.length > CADICMS_LENGTH) {
    return false;
  }
  const paddedCadicms = digitsOnly.padStart(CADICMS_LENGTH, "0");
  const WEIGHTS_DV1 = [3, 2, 7, 6, 5, 4, 3, 2];
  const firstEightDigits = paddedCadicms.substring(0, 8);
  const expectedFirstVerifier = _calculateVerifierDigit(firstEightDigits, WEIGHTS_DV1);
  const firstVerifier = Number(paddedCadicms[8]);
  if (expectedFirstVerifier !== firstVerifier) {
    return false;
  }
  const WEIGHTS_DV2 = [4, 3, 2, 7, 6, 5, 4, 3, 2];
  const firstNineDigits = paddedCadicms.substring(0, 9);
  const expectedSecondVerifier = _calculateVerifierDigit(firstNineDigits, WEIGHTS_DV2);
  const secondVerifier = Number(paddedCadicms[9]);
  return expectedSecondVerifier === secondVerifier;
}
var validateCADICMSPR_default = validateCADICMSPR;

// src/validators/validateCEP.js
function validateCEP(cep = "") {
  const digitsOnly = String(cep).replace(/[^\d]/g, "");
  return digitsOnly.length === 8;
}
var validateCEP_default = validateCEP;

// src/validators/validateCNPJ.js
var DEFAULT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
function _getCharValue(char) {
  return char.charCodeAt(0) - "0".charCodeAt(0);
}
function _calculateVerifierDigits(baseCnpj, weights) {
  const getDigit = (sum) => {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < baseCnpj.length; i++) {
    const value = _getCharValue(baseCnpj[i]);
    sum1 += value * weights[i + 1];
    sum2 += value * weights[i];
  }
  const dv1 = getDigit(sum1);
  sum2 += dv1 * weights[baseCnpj.length];
  const dv2 = getDigit(sum2);
  return `${dv1}${dv2}`;
}
function validateCNPJ(cnpj = "", options = {}) {
  let processedCnpj = String(cnpj).replace(/[./-]/g, "");
  const finalOptions = {
    addPaddingChar: "0",
    weights: DEFAULT_WEIGHTS,
    ignorePadding: false,
    ignoreToUpperCase: true,
    ...options
  };
  if (finalOptions.ignoreToUpperCase === false) {
    processedCnpj = processedCnpj.toUpperCase();
  }
  if (!finalOptions.ignorePadding) {
    processedCnpj = processedCnpj.padStart(14, finalOptions.addPaddingChar);
  }
  const regexCNPJ = /^([A-Z\d]){12}(\d){2}$/;
  if (!regexCNPJ.test(processedCnpj)) {
    return false;
  }
  if (/^\d+$/.test(processedCnpj) && /^(\d)\1{13}$/.test(processedCnpj)) {
    return false;
  }
  const baseDigits = processedCnpj.substring(0, 12);
  const verifierDigits = processedCnpj.substring(12);
  const calculatedVerifierDigits = _calculateVerifierDigits(baseDigits, finalOptions.weights);
  return verifierDigits === calculatedVerifierDigits;
}
var validateCNPJ_default = validateCNPJ;

// src/validators/validateCPF.js
function _calculateVerifierDigit2(baseDigits) {
  const initialWeight = baseDigits.length + 1;
  const sum = baseDigits.split("").reduce((acc, digit, index) => acc + Number(digit) * (initialWeight - index), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}
function validateCPF(cpf = "") {
  const digitsOnly = String(cpf).replace(/[^\d]/g, "");
  const CPF_LENGTH = 11;
  if (digitsOnly === "" || digitsOnly.length > CPF_LENGTH) {
    return false;
  }
  const paddedCpf = digitsOnly.padStart(CPF_LENGTH, "0");
  if (/^(\d)\1{10}$/.test(paddedCpf)) {
    return false;
  }
  const baseDv1 = paddedCpf.substring(0, 9);
  const expectedDv1 = _calculateVerifierDigit2(baseDv1);
  if (expectedDv1 !== Number(paddedCpf[9])) {
    return false;
  }
  const baseDv2 = paddedCpf.substring(0, 10);
  const expectedDv2 = _calculateVerifierDigit2(baseDv2);
  return expectedDv2 === Number(paddedCpf[10]);
}
var validateCPF_default = validateCPF;

// src/validators/validateEmail.js
var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function validateEmail(email = "") {
  const emailAsString = String(email);
  return EMAIL_REGEX.test(emailAsString);
}
var validateEmail_default = validateEmail;

// src/validators/validateChavePix.js
var UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var PIX_PHONE_REGEX = /^\+55\d{10,11}$/;
function validateChavePix(chave = "") {
  const keyAsString = String(chave || "").trim();
  if (keyAsString === "") {
    return false;
  }
  if (UUID_V4_REGEX.test(keyAsString)) return true;
  if (PIX_PHONE_REGEX.test(keyAsString)) return true;
  if (keyAsString.includes("@")) return validateEmail_default(keyAsString);
  if (validateCPF_default(keyAsString)) {
    return true;
  }
  if (validateCNPJ_default(keyAsString)) {
    return true;
  }
  return false;
}
var validateChavePix_default = validateChavePix;

// src/validators/validateCNH.js
var CNH_WEIGHTS_DV1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
var CNH_WEIGHTS_DV2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function validateCNH(cnh = "") {
  const digitsOnly = String(cnh).replace(/[^\d]/g, "");
  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }
  const base = digitsOnly.substring(0, 9);
  const verifierDigits = digitsOnly.substring(9);
  const sum1 = base.split("").reduce(
    (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV1[index],
    0
  );
  const remainder1 = sum1 % 11;
  const calculatedDv1 = remainder1 >= 10 ? 0 : remainder1;
  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }
  const sum2 = base.split("").reduce(
    (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV2[index],
    0
  );
  const remainder2 = sum2 % 11;
  const calculatedDv2 = remainder2 >= 10 ? 0 : remainder2;
  return calculatedDv2 === Number(verifierDigits[1]);
}
var validateCNH_default = validateCNH;

// src/validators/validatePISPASEPNIT.js
var PIS_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
function validatePISPASEPNIT(pis = "") {
  const digitsOnly = String(pis).replace(/[^\d]/g, "");
  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }
  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);
  const sum = base.split("").reduce((acc, digit, index) => acc + Number(digit) * PIS_WEIGHTS[index], 0);
  const remainder = sum % 11;
  const calculatedDigit = remainder < 2 ? 0 : 11 - remainder;
  return verifierDigit === calculatedDigit;
}
var validatePISPASEPNIT_default = validatePISPASEPNIT;

// src/validators/validateRenavam.js
var RENAVAM_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3];
function validateRENAVAM(renavam = "") {
  const digitsOnly = String(renavam).replace(/[^\d]/g, "").padStart(11, "0");
  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }
  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);
  const reversedBase = base.split("").reverse();
  const sum = reversedBase.reduce(
    (acc, digit, index) => acc + Number(digit) * RENAVAM_WEIGHTS[index],
    0
  );
  const remainder = sum % 11;
  const calculatedDigit = remainder <= 1 ? 0 : 11 - remainder;
  return verifierDigit === calculatedDigit;
}
var validateRenavam_default = validateRENAVAM;

// src/validators/validateTituloEleitor.js
var TITULO_WEIGHTS_DV1 = [2, 3, 4, 5, 6, 7, 8, 9];
function validateTituloEleitor(titulo = "") {
  if (titulo == null) {
    return false;
  }
  const digitsOnly = String(titulo).replace(/[^\d]/g, "").padStart(12, "0");
  if (digitsOnly.length !== 12) {
    return false;
  }
  const base = digitsOnly.substring(0, 8);
  const stateCode = Number(digitsOnly.substring(8, 10));
  const verifierDigits = digitsOnly.substring(10);
  if (stateCode < 1 || stateCode > 28) {
    return false;
  }
  const sum1 = base.split("").reduce(
    (acc, digit, index) => acc + Number(digit) * TITULO_WEIGHTS_DV1[index],
    0
  );
  let remainder1 = sum1 % 11;
  let calculatedDv1;
  if (remainder1 === 0) {
    calculatedDv1 = stateCode === 1 || stateCode === 2 ? 1 : 0;
  } else if (remainder1 > 9) {
    calculatedDv1 = 0;
  } else {
    calculatedDv1 = remainder1;
  }
  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }
  const digit1 = Number(digitsOnly.substring(8, 9));
  const digit2 = Number(digitsOnly.substring(9, 10));
  const sum2 = digit1 * 7 + digit2 * 8 + calculatedDv1 * 9;
  let remainder2 = sum2 % 11;
  let calculatedDv2;
  if (remainder2 === 0) {
    calculatedDv2 = stateCode === 1 || stateCode === 2 ? 1 : 0;
  } else if (remainder2 > 9) {
    calculatedDv2 = 0;
  } else {
    calculatedDv2 = remainder2;
  }
  return calculatedDv2 === Number(verifierDigits[1]);
}
var validateTituloEleitor_default = validateTituloEleitor;

// src/validators/validateRG.js
var RG_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];
function validateRG(rg = "") {
  if (rg == null) {
    return false;
  }
  const cleanRG = String(rg).toUpperCase().replace(/[^\dX]/g, "");
  if (cleanRG.length !== 9) {
    return false;
  }
  const base = cleanRG.substring(0, 8);
  const verifierDigit = cleanRG.substring(8);
  if (!/^\d{8}$/.test(base)) {
    return false;
  }
  if (!/^[\dX]$/.test(verifierDigit)) {
    return false;
  }
  if (/^(\d)\1{7}$/.test(base)) {
    return false;
  }
  const sum = base.split("").reduce((acc, digit, index) => {
    return acc + Number(digit) * RG_WEIGHTS[index];
  }, 0);
  const remainder = sum % 11;
  const complement = 11 - remainder;
  let calculatedDigit;
  if (complement === 10) {
    calculatedDigit = "X";
  } else if (complement === 11) {
    calculatedDigit = "0";
  } else {
    calculatedDigit = String(complement);
  }
  return calculatedDigit === verifierDigit;
}
var validateRG_default = validateRG;

// src/validators/index.js
var validators_default = {
  validateCADICMSPR: validateCADICMSPR_default,
  validateCEP: validateCEP_default,
  validateChavePix: validateChavePix_default,
  validateCNH: validateCNH_default,
  validateCNPJ: validateCNPJ_default,
  validateCPF: validateCPF_default,
  validateEmail: validateEmail_default,
  validatePISPASEPNIT: validatePISPASEPNIT_default,
  validateRenavam: validateRenavam_default,
  validateTituloEleitor: validateTituloEleitor_default,
  validateRG: validateRG_default
};

// src/crypto/index.js
var crypto_exports = {};
__export(crypto_exports, {
  decrypt: () => decrypt_default,
  decryptBuffer: () => decryptBuffer_default,
  default: () => crypto_default,
  digest: () => digest_default,
  encrypt: () => encrypt_default,
  encryptBuffer: () => encryptBuffer_default,
  getCrypto: () => getCrypto_default,
  importCryptoKey: () => importCryptoKey_default,
  verifySignature: () => verifySignature_default
});

// src/crypto/decrypt.js
async function decrypt(privateKey, encryptedMessage, props = {}) {
  if (!encryptedMessage) {
    return "";
  }
  const {
    format: format2 = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props || {};
  const crypto3 = getCrypto_default();
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer_default(cleanedPrivateKey);
  const importedKey = await importCryptoKey_default(
    format2,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );
  const encryptedData = base64ToBuffer_default(encryptedMessage);
  const decryptedBuffer = await crypto3.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );
  return bufferToString_default(decryptedBuffer);
}
var decrypt_default = decrypt;

// src/crypto/encrypt.js
async function encrypt(publicKey, message, props = {}) {
  if (!message) return "";
  const crypto3 = getCrypto_default();
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer_default(cleanedPublicKey);
  const {
    format: format2 = "spki",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["encrypt"],
    padding = "RSA-OAEP"
  } = props || {};
  const importedKey = await importCryptoKey_default(
    format2 || "spki",
    binaryPublicKey,
    algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }
    },
    extractable !== void 0 ? extractable : true,
    keyUsages || ["encrypt"]
  );
  const messageBuffer = bufferFromString_default(message);
  const encryptedBuffer = await crypto3.subtle.encrypt(
    { name: padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );
  return base64FromBuffer_default(encryptedBuffer);
}
var encrypt_default = encrypt;

// src/crypto/digest.js
async function digest(algorithm, data) {
  const binaryData = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const crypto3 = getCrypto_default();
  if (typeof window !== "undefined") {
    const hashBuffer = await crypto3.subtle.digest(algorithm, binaryData);
    return new Uint8Array(hashBuffer);
  }
  const nodeAlgorithm = algorithm.toLowerCase().replace("-", "");
  const hash = crypto3.createHash(nodeAlgorithm).update(binaryData).digest();
  return new Uint8Array(hash);
}
var digest_default = digest;

// src/crypto/verifySignature.js
async function verifySignature(algorithm, key, signature, data) {
  const crypto3 = getCrypto_default();
  return await crypto3.subtle.verify(algorithm, key, signature, data);
}
var verifySignature_default = verifySignature;

// src/crypto/index.js
var crypto_default = {
  getCrypto: getCrypto_default,
  decrypt: decrypt_default,
  encrypt: encrypt_default,
  decryptBuffer: decryptBuffer_default,
  encryptBuffer: encryptBuffer_default,
  digest: digest_default,
  importCryptoKey: importCryptoKey_default,
  verifySignature: verifySignature_default
};

// src/auth/webauthn/index.js
var webauthn_exports = {};
__export(webauthn_exports, {
  convertECDSAASN1Signature: () => convertECDSAASN1Signature_default,
  default: () => webauthn_default,
  getAuthenticationAuthData: () => getAuthenticationAuthData_default,
  getRegistrationAuthData: () => getRegistrationAuthData_default,
  getWebAuthnAuthenticationAssertion: () => getWebAuthnAuthenticationAssertion_default,
  getWebAuthnRegistrationCredential: () => getWebAuthnRegistrationCredential_default,
  validateAuthentication: () => validateAuthentication_default,
  validateRPID: () => validateRPID_default,
  validateRegistration: () => validateRegistration_default
});

// src/auth/webauthn/convertECDSAASN1Signature.js
function convertECDSAASN1Signature(asn1Signature) {
  const elements = readASN1IntegerSequence(asn1Signature);
  if (elements.length !== 2) {
    throw new Error("Expected 2 ASN.1 sequence elements");
  }
  let [r, s] = elements;
  r = normalizeECDSAComponent(r);
  s = normalizeECDSAComponent(s);
  return bufferConcatenate_default(r, s);
}
function normalizeECDSAComponent(component) {
  const length = component.byteLength;
  let normalized = component;
  if (component[0] === 0 && length % 16 === 1) {
    normalized = component.slice(1);
  } else if (length % 16 === 15) {
    const padding = new Uint8Array([0]);
    normalized = new Uint8Array(bufferConcatenate_default(padding, component));
  }
  if (normalized.byteLength % 16 !== 0) {
    throw new Error("unknown ECDSA sig r length error");
  }
  return normalized;
}
function readASN1IntegerSequence(input) {
  if (input[0] !== 48) {
    throw new Error("Input is not an ASN.1 sequence");
  }
  const sequenceLength = input[1];
  const elements = [];
  let position = 2;
  const sequenceEnd = position + sequenceLength;
  while (position < sequenceEnd) {
    const tag = input[position];
    if (tag !== 2) {
      throw new Error("Expected ASN.1 sequence element to be an INTEGER");
    }
    const elementLength = input[position + 1];
    const elementValue = input.slice(position + 2, position + 2 + elementLength);
    elements.push(elementValue);
    position += 2 + elementLength;
  }
  return elements;
}
var convertECDSAASN1Signature_default = convertECDSAASN1Signature;

// src/auth/webauthn/getAuthenticationAuthData.js
function getAuthenticationAuthData(assertion) {
  const id = assertion.id;
  const rawId = base64FromBuffer_default(assertion.rawId);
  const type = assertion.type;
  const response = {
    clientDataJSONDecoded: new TextDecoder().decode(assertion.response.clientDataJSON),
    clientDataJSON: base64FromBuffer_default(assertion.response.clientDataJSON),
    authenticatorData: base64FromBuffer_default(assertion.response.authenticatorData),
    signature: base64FromBuffer_default(assertion.response.signature),
    userHandle: assertion.response.userHandle ? base64FromBuffer_default(assertion.response.userHandle) : false
  };
  const authData = getAuthDataFromAuthentication(assertion.response.authenticatorData);
  return {
    id,
    rawId,
    type,
    authData,
    response
  };
}
function getAuthDataFromAuthentication(authData) {
  if (!authData || authData.byteLength < 37) {
    throw new Error(
      `Authenticator data was ${authData?.byteLength || "invalid"} bytes, expected at least 37 bytes`
    );
  }
  const dataView = new DataView(authData, authData.byteOffset, authData.length);
  let pointer = 0;
  const rpIdHash = authData.slice(pointer, pointer + 32);
  pointer += 32;
  const flagsBuf = authData.slice(pointer, pointer + 1);
  const flagsInt = new Uint8Array(flagsBuf)[0];
  pointer += 1;
  const flags = {
    up: !!(flagsInt & 1),
    // User Present (bit 0)
    uv: !!(flagsInt & 4),
    // User Verified (bit 2)
    be: !!(flagsInt & 8),
    // Backup Eligible (bit 3)
    bs: !!(flagsInt & 16),
    // Backup State (bit 4)
    at: !!(flagsInt & 64),
    // Attested Credential Data Present (bit 6)
    ed: !!(flagsInt & 128),
    // Extension Data Present (bit 7)
    flagsInt
  };
  const counterBuf = authData.slice(pointer, pointer + 4);
  const counter = dataView.getUint32(pointer, false);
  pointer += 4;
  const attestationResult = parseAttestedCredentialData(flags, authData, pointer);
  pointer = attestationResult.newPointer;
  const extensionsData = parseExtensionData(flags, authData, pointer);
  return {
    rpIdHash: base64FromBuffer_default(rpIdHash),
    flagsBuf: base64FromBuffer_default(flagsBuf),
    flags,
    counter,
    counterBuf: base64FromBuffer_default(counterBuf),
    aaguid: attestationResult.aaguid,
    credentialId: base64FromBuffer_default(attestationResult.credentialId),
    credentialPublicKey: base64FromBuffer_default(attestationResult.credentialPublicKey),
    extensionsData
  };
}
function parseAttestedCredentialData(flags, authData, pointer) {
  if (!flags.at) {
    return {
      aaguid: void 0,
      credentialId: void 0,
      credentialPublicKey: void 0,
      newPointer: pointer
    };
  }
  const dataView = new DataView(authData, authData.byteOffset, authData.length);
  const aaguid = authData.slice(pointer, pointer + 16);
  pointer += 16;
  const credentialIdLength = dataView.getUint16(pointer, false);
  pointer += 2;
  const credentialId = authData.slice(pointer, pointer + credentialIdLength);
  pointer += credentialIdLength;
  const credentialPublicKey = authData.slice(pointer, pointer + 77);
  pointer += 77;
  return {
    aaguid,
    credentialId,
    credentialPublicKey,
    newPointer: pointer
  };
}
function parseExtensionData(flags, authData, pointer) {
  if (!flags.ed) {
    return void 0;
  }
  return authData.slice(pointer);
}
var getAuthenticationAuthData_default = getAuthenticationAuthData;

// src/auth/webauthn/getRegistrationAuthData.js
import { decode } from "cbor-x";
function parseAuthenticatorData(attestationObjectBuffer) {
  const attestationObject = decode(new Uint8Array(attestationObjectBuffer));
  const { authData } = attestationObject;
  const RP_ID_HASH_OFFSET = 0;
  const RP_ID_HASH_LENGTH = 32;
  const FLAGS_OFFSET = RP_ID_HASH_OFFSET + RP_ID_HASH_LENGTH;
  const FLAGS_LENGTH = 1;
  const SIGN_COUNT_OFFSET = FLAGS_OFFSET + FLAGS_LENGTH;
  const SIGN_COUNT_LENGTH = 4;
  const ATTESTED_CREDENTIAL_DATA_OFFSET = SIGN_COUNT_OFFSET + SIGN_COUNT_LENGTH;
  const AAGUID_LENGTH = 16;
  const CREDENTIAL_ID_LENGTH_BYTES = 2;
  const CREDENTIAL_ID_LENGTH_OFFSET = ATTESTED_CREDENTIAL_DATA_OFFSET + AAGUID_LENGTH;
  const CREDENTIAL_ID_OFFSET = CREDENTIAL_ID_LENGTH_OFFSET + CREDENTIAL_ID_LENGTH_BYTES;
  const idLenBytes = authData.slice(
    CREDENTIAL_ID_LENGTH_OFFSET,
    CREDENTIAL_ID_OFFSET
  );
  const dataView = new DataView(idLenBytes.buffer);
  const credentialIdLength = dataView.getUint16(0);
  const credentialId = authData.slice(
    CREDENTIAL_ID_OFFSET,
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );
  const publicKeyBytes = authData.slice(
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );
  return {
    credentialId: base64FromBuffer_default(credentialId.buffer),
    publicKeyObject: base64FromBuffer_default(publicKeyBytes.buffer)
  };
}
function getRegistrationAuthData(credential) {
  const response = credential.response;
  const parsedAuthData = parseAuthenticatorData(response.attestationObject);
  const clientDataJSONDecoded = new TextDecoder().decode(
    response.clientDataJSON
  );
  return {
    // Dados de nível superior da credencial
    rawId: base64FromBuffer_default(credential.rawId),
    id: credential.id,
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
    // Dados extraídos e analisados do `authData`
    authData: parsedAuthData,
    // Dados da resposta do autenticador, convertidos para formatos apropriados
    response: {
      attestationObject: base64FromBuffer_default(response.attestationObject),
      authenticatorData: base64FromBuffer_default(response.getAuthenticatorData()),
      clientDataJSON: base64FromBuffer_default(response.clientDataJSON),
      clientDataJSONDecoded,
      transports: response.getTransports() || [],
      publicKey: base64FromBuffer_default(response.getPublicKey()),
      publicKeyAlgorithm: response.getPublicKeyAlgorithm()
    }
  };
}
var getRegistrationAuthData_default = getRegistrationAuthData;

// src/auth/webauthn/getWebAuthnAuthenticationAssertion.js
function validateAuthenticationOptions(props) {
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }
  if (!props.allowCredentials || !Array.isArray(props.allowCredentials) || props.allowCredentials.length === 0) {
    throw new Error("No allowCredentials provided");
  }
  for (const cred of props.allowCredentials) {
    if (!cred.id) {
      throw new Error(
        "No allowCredentials (id) provided - The credential ID registered on the registration phase"
      );
    }
    if (!cred.type) {
      throw new Error("No allowCredentials (type) provided");
    }
  }
}
async function getWebAuthnAuthenticationAssertion(props, callback) {
  if (typeof navigator?.credentials?.get !== "function") {
    return "WebAuthn not supported";
  }
  validateAuthenticationOptions(props);
  const assertion = await navigator.credentials.get({
    publicKey: props
  });
  if (typeof callback === "function") {
    return callback(assertion);
  }
  return assertion;
}
var getWebAuthnAuthenticationAssertion_default = getWebAuthnAuthenticationAssertion;

// src/auth/webauthn/getWebAuthnRegistrationCredential.js
function validateCreationOptions(props) {
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }
  if (!props.rp) {
    throw new Error("No RP (Relying Party) provided");
  }
  if (!props.rp.name) {
    throw new Error("No RP (Relying Party) name provided");
  }
  if (!props.user) {
    throw new Error("No user provided");
  }
  if (!props.user.id) {
    throw new Error("No user id provided");
  }
  if (!props.user.displayName) {
    throw new Error("No user display name provided");
  }
  if (!props.user.name) {
    throw new Error("No user name provided");
  }
  if (!props.pubKeyCredParams || !Array.isArray(props.pubKeyCredParams) || props.pubKeyCredParams.length === 0) {
    throw new Error("No pubKeyCredParams provided");
  }
  for (const param of props.pubKeyCredParams) {
    if (!param.hasOwnProperty("alg")) {
      throw new Error("No pubKeyCredParams.alg provided");
    }
    if (!param.hasOwnProperty("type")) {
      throw new Error("No pubKeyCredParams.type provided");
    }
  }
}
async function getWebAuthnRegistrationCredential(props = {}, callback) {
  if (typeof navigator?.credentials?.create !== "function") {
    return "WebAuthn not supported";
  }
  validateCreationOptions(props);
  const credential = await navigator.credentials.create({
    publicKey: props
  });
  if (typeof callback === "function") {
    return callback(credential);
  }
  return credential;
}
var getWebAuthnRegistrationCredential_default = getWebAuthnRegistrationCredential;

// src/auth/webauthn/validateRPID.js
async function validateRPID(originalRPID, verifyRPID, algorithm = "SHA-256") {
  if (!originalRPID || typeof originalRPID !== "string") {
    throw new Error("originalRPID is required");
  }
  originalRPID = originalRPID.trim();
  if (!originalRPID) {
    throw new Error("originalRPID is required");
  }
  if (!verifyRPID || typeof verifyRPID !== "string") {
    throw new Error("verifyRPID is required");
  }
  verifyRPID = verifyRPID.trim();
  if (!verifyRPID) {
    throw new Error("verifyRPID is required");
  }
  const crypto3 = getCrypto_default();
  const originalRPIDBuffer = bufferFromString_default(originalRPID);
  const digestOfOriginalRPID = await crypto3.subtle.digest(
    algorithm,
    originalRPIDBuffer
  );
  const verifyRPIDBuffer = base64ToBuffer_default(verifyRPID);
  const digestToVerify = verifyRPIDBuffer.slice(0, 32);
  const areDigestsEqual = bufferCompare_default(digestOfOriginalRPID, digestToVerify);
  if (!areDigestsEqual) {
    throw new Error(
      `Registration RPID does not match the authentication RPID.`
    );
  }
  return true;
}
var validateRPID_default = validateRPID;

// src/auth/webauthn/validateAuthentication.js
function getImportPublicKeyAlgorithm(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7:
      return { name: "ECDSA", namedCurve: "P-256" };
    case -257:
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8:
      throw new Error("Ed25519 is not supported by crypto.subtle directly");
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}
function getAlgorithmVerifySignatureParam(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7:
      return { name: "ECDSA", hash: { name: "SHA-256" } };
    case -257:
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8:
      throw new Error(
        "Ed25519 is not supported by crypto.subtle. Use an external library."
      );
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}
async function generateDataToVerify(assertion) {
  const authenticatorDataBuffer = base64ToBuffer_default(
    assertion.response.authenticatorData
  );
  const clientDataJSONBuffer = base64ToBuffer_default(assertion.response.clientDataJSON);
  const clientDataJSONHash = await crypto.subtle.digest(
    "SHA-256",
    clientDataJSONBuffer
  );
  return bufferConcatenate_default(authenticatorDataBuffer, clientDataJSONHash);
}
async function validateAuthentication(credential, assertion, expectedProps = {}, incomingProps = {}, publicKeyProps = {}, convertECDSignature = true) {
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (credential.type !== "public-key") {
    throw new Error("Credential type must be 'public-key'");
  }
  if (!assertion) {
    throw new Error("Missing assertion");
  }
  if (!assertion.id) {
    throw new Error("Missing assertion ID");
  }
  if (!assertion.rawId) {
    throw new Error("Missing assertion rawId");
  }
  if (assertion.type !== "public-key") {
    throw new Error("Assertion type must be 'public-key'");
  }
  if (credential.id !== assertion.id) {
    throw new Error("Credential ID does not match assertion ID");
  }
  if (credential.rawId !== assertion.rawId) {
    throw new Error("Credential rawId does not match assertion rawId");
  }
  const { counterCredential } = expectedProps;
  const { counterAssertion } = incomingProps;
  if (!isNumber_default(counterCredential) || counterCredential < 0) {
    throw new Error("counterCredential must be a number >= 0");
  }
  if (!isNumber_default(counterAssertion) || counterAssertion < 0) {
    throw new Error("counterAssertion must be a number >= 0");
  }
  if (counterAssertion !== 0) {
    if (counterAssertion <= counterCredential) {
      throw new Error(
        `Invalid signature counter. The assertion counter (${counterAssertion}) must be strictly greater than the stored credential counter (${counterCredential}).`
      );
    }
  }
  const clientDataJSON = JSON.parse(assertion.response.clientDataJSONDecoded);
  const assertionChallenge = base64From_default(clientDataJSON?.challenge || "");
  if (expectedProps.challenge !== assertionChallenge) {
    throw new Error("Challenge provided does not match assertion challenge.");
  }
  if (expectedProps.origin !== clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${clientDataJSON?.origin ?? "none"}`
    );
  }
  if (expectedProps.type !== clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${clientDataJSON?.type ?? "none"}`
    );
  }
  if (!assertion.authData.flags.up) {
    throw new Error("User Present flag (up) is required for authentication.");
  }
  if (!assertion.authData.flags.uv) {
    throw new Error("User Verified flag (uv) is required for authentication.");
  }
  await validateRPID_default(expectedProps.rpID, assertion.authData.rpIdHash);
  const importAlgo = getImportPublicKeyAlgorithm(
    credential.response.publicKeyAlgorithm
  );
  const verifyAlgo = getAlgorithmVerifySignatureParam(
    credential.response.publicKeyAlgorithm
  );
  const publicKey = await importCryptoKey_default(
    publicKeyProps?.importKey?.format || "spki",
    base64ToBuffer_default(credential.response.publicKey),
    importAlgo,
    publicKeyProps?.importKey?.extractable || false,
    ["verify"]
  );
  let signature = new Uint8Array(base64ToBuffer_default(assertion.response.signature));
  if (convertECDSignature && credential.response.publicKeyAlgorithm === -7) {
    signature = convertECDSAASN1Signature_default(signature);
  }
  const dataToVerify = await generateDataToVerify(assertion);
  return verifySignature_default(verifyAlgo, publicKey, signature, dataToVerify);
}
var validateAuthentication_default = validateAuthentication;

// src/auth/webauthn/validateRegistration.js
import { decode as decode2 } from "cbor-x";
function validateRegistration(credential, expectedProps = {}) {
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (!credential.type || credential.type !== "public-key") {
    throw new Error(
      "Missing credential type or credential type is not public-key"
    );
  }
  const clientDataJSON = JSON.parse(credential.response.clientDataJSONDecoded);
  if (expectedProps.challenge !== clientDataJSON?.challenge) {
    throw new Error(
      `Challenge does not match. Provided challenge: ${clientDataJSON?.challenge ?? "none"}.`
    );
  }
  if (expectedProps.origin !== clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${clientDataJSON?.origin ?? "none"}`
    );
  }
  if (expectedProps.type !== clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${clientDataJSON?.type ?? "none"}`
    );
  }
  const attestationObjectBuffer = base64ToBuffer_default(
    credential.response.attestationObject
  );
  const attestationObject = decode2(new Uint8Array(attestationObjectBuffer));
  if (!attestationObject.fmt) {
    throw new Error("Missing attestation object format");
  }
  if (attestationObject.fmt === "none") {
    if (attestationObject.attStmt && attestationObject.attStmt.size > 0) {
      throw new Error("None attestation had unexpected attestation statement");
    }
  } else {
    throw new Error(`Unsupported Attestation Format: ${attestationObject.fmt}`);
  }
  return true;
}
var validateRegistration_default = validateRegistration;

// src/auth/webauthn/index.js
var webauthn_default = {
  convertECDSAASN1Signature: convertECDSAASN1Signature_default,
  getAuthenticationAuthData: getAuthenticationAuthData_default,
  getRegistrationAuthData: getRegistrationAuthData_default,
  getWebAuthnAuthenticationAssertion: getWebAuthnAuthenticationAssertion_default,
  getWebAuthnRegistrationCredential: getWebAuthnRegistrationCredential_default,
  validateRPID: validateRPID_default,
  validateAuthentication: validateAuthentication_default,
  validateRegistration: validateRegistration_default
};

// src/custom/db/sequelize/index.js
var sequelize_exports = {};
__export(sequelize_exports, {
  default: () => sequelize_default,
  setConditionBetweenDates: () => setConditionsBetweenDates_default,
  setConditionBetweenValues: () => setConditionsBetweenValues_default,
  setConditionStringLike: () => setConditionStringLike_default
});

// src/custom/db/sequelize/setConditionsBetweenDates.js
function setConditionBetweenDates(object, fromFormat = DATE_BR_FORMAT_D, key = "created_at", beforeKey = "created_at_until", afterKey = "created_at_from", resetHMS = true) {
  if (!object || !object[afterKey] && !object[beforeKey]) {
    return null;
  }
  const conditions = [];
  if (object[afterKey]) {
    const fromDate = stringToDate_default(object[afterKey], fromFormat);
    const finalDate = resetHMS ? dateFirstHourOfDay_default(fromDate) : fromDate;
    conditions.push({ $gte: finalDate });
    delete object[afterKey];
  }
  if (object[beforeKey]) {
    const untilDate = stringToDate_default(object[beforeKey], fromFormat);
    const finalDate = resetHMS ? dateLastHourOfDay_default(untilDate) : untilDate;
    conditions.push({ $lte: finalDate });
    delete object[beforeKey];
  }
  object[key] = {
    $and: conditions
  };
  return object;
}
var setConditionsBetweenDates_default = setConditionBetweenDates;

// src/custom/db/sequelize/setConditionsBetweenValues.js
function setConditionBetweenValues(object, key = "value", beforeKey = "value_until", afterKey = "value_from") {
  if (!object || !object[afterKey] && !object[beforeKey]) {
    return;
  }
  const conditions = [];
  if (object[afterKey]) {
    conditions.push({ $gte: object[afterKey] });
  }
  if (object[beforeKey]) {
    conditions.push({ $lte: object[beforeKey] });
  }
  object[key] = {
    $and: conditions
  };
  return object;
}
var setConditionsBetweenValues_default = setConditionBetweenValues;

// src/custom/db/sequelize/setConditionStringLike.js
function setConditionStringLike(object, key, insensitive = true) {
  if (!object || !key || !object[key]) {
    return;
  }
  const operator = insensitive ? "$iLike" : "$like";
  const value = object[key];
  object[key] = {
    [operator]: `%${value}%`
  };
}
var setConditionStringLike_default = setConditionStringLike;

// src/custom/db/sequelize/index.js
var sequelize_default = {
  setConditionBetweenDates: setConditionsBetweenDates_default,
  setConditionBetweenValues: setConditionsBetweenValues_default,
  setConditionStringLike: setConditionStringLike_default
};

// src/custom/bulkProcessor.js
var BulkProcessor = class {
  /** @private @type {any[]} */
  #buffer = [];
  /** @private @type {number} */
  #limit;
  /** @private @type {number} */
  #maxBufferSize;
  /** @private @type {number} */
  #maxConcurrentFlushes;
  /** @private @type {number} */
  #activeFlushes = 0;
  /** @private @type {boolean} */
  #isEnding = false;
  /** @private @type {Logger} */
  #logger;
  /** @private @type {any} */
  #payload;
  /** @private @type {any} */
  #serviceContext;
  /** @private @type {number} */
  #retries;
  /** @private @type {number} */
  #retryDelayMs;
  /** @private @type {number} */
  #flushTimeoutMs;
  /** @private @type {{onAdd?: Function, onFlush?: Function, onEnd?: Function, onBackpressure?: Function, onFlushFailure?: Function}} */
  #callbacks;
  /**
   * Constrói e configura uma nova instância do BulkProcessor.
   * Este método é projetado para ser flexível, suportando tanto uma assinatura
   * moderna baseada em um único objeto de opções quanto uma assinatura legada
   * para garantir a retrocompatibilidade.
   *
   * @param {BulkProcessorOptions | object} [arg1={}] - O objeto de opções ou o `payload` (legado).
   * @param {object} [arg2={}] - O objeto `callbackFunctions` (legado).
   * @param {object} [arg3={}] - O objeto `options` (legado).
   */
  constructor(arg1 = {}, arg2 = {}, arg3 = {}) {
    let options;
    if (Object.keys(arg2).length > 0 || Object.keys(arg3).length > 0) {
      const payload2 = arg1;
      const callbackFunctions = arg2;
      const otherOptions = arg3;
      options = {
        ...otherOptions,
        payload: otherOptions.payload || payload2,
        onAdd: otherOptions.onAdd || callbackFunctions.onAddCallback,
        onFlush: otherOptions.onFlush || callbackFunctions.onFlushCallback,
        onEnd: otherOptions.onEnd || callbackFunctions.onEndCallback
      };
    } else {
      options = arg1;
    }
    const {
      limit: userLimit = 1e3,
      maxBufferSize,
      maxConcurrentFlushes = 3,
      flushTimeoutMs = 3e4,
      retries = 0,
      retryDelayMs = 1e3,
      logger = {
        info: () => {
        },
        error: () => {
        },
        warn: () => {
        },
        debug: () => {
        }
      },
      payload = {},
      serviceContext = null,
      onFlush,
      onAdd,
      onEnd,
      onBackpressure,
      onFlushFailure
    } = options;
    this.#limit = Math.max(defaultNumeric_default(userLimit, 1), 1);
    this.#maxBufferSize = Math.max(
      this.#limit * 2,
      defaultNumeric_default(maxBufferSize, 0)
    );
    this.#maxConcurrentFlushes = Math.max(
      1,
      defaultNumeric_default(maxConcurrentFlushes, 3)
    );
    this.#retries = Math.max(0, defaultNumeric_default(retries, 0));
    this.#retryDelayMs = Math.max(100, defaultNumeric_default(retryDelayMs, 1e3));
    this.#flushTimeoutMs = Math.max(500, defaultNumeric_default(flushTimeoutMs, 3e4));
    this.#logger = logger;
    this.#payload = payload;
    this.#serviceContext = serviceContext;
    this.#callbacks = { onFlush, onAdd, onEnd, onBackpressure, onFlushFailure };
    this.#logger.info(`BulkProcessor inicializado.`, {
      limit: this.#limit,
      maxBufferSize: this.#maxBufferSize,
      maxConcurrentFlushes: this.#maxConcurrentFlushes,
      retries: this.#retries,
      retryDelayMs: this.#retryDelayMs,
      flushTimeoutMs: this.#flushTimeoutMs
    });
  }
  /**
   * Adiciona um item à fila de processamento de forma assíncrona.
   *
   * Este é o principal método para popular o processador. Ele gerencia a lógica de backpressure:
   * se o buffer interno atingir sua capacidade máxima (`maxBufferSize`), a execução
   * deste método será pausada até que haja espaço disponível. Isso previne o consumo
   * excessivo de memória sob alta carga.
   *
   * A chamada ao callback `onAdd` é realizada de forma "fire-and-forget" e não bloqueia a adição do item.
   *
   * @param {*} item - O item a ser adicionado ao lote.
   * @returns {Promise<void>} Uma promessa que resolve quando o item foi adicionado com sucesso ao buffer.
   */
  async add(item) {
    if (this.#isEnding) {
      this.#logger.info(
        "Processador em estado de finaliza\xE7\xE3o. Novos itens est\xE3o sendo ignorados.",
        { item }
      );
      return;
    }
    if (this.#buffer.length >= this.#maxBufferSize) {
      if (this.#callbacks.onBackpressure) {
        Promise.resolve(
          this.#callbacks.onBackpressure({
            bufferSize: this.#buffer.length,
            maxBufferSize: this.#maxBufferSize,
            item
            // Informa qual item está aguardando para ser adicionado.
          })
        ).catch((error) => {
          this.#logger.error("Erro no callback onBackpressure.", {
            errorMessage: error.message
          });
        });
      }
      while (this.#buffer.length >= this.#maxBufferSize) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    this.#buffer.push(item);
    if (this.#callbacks.onAdd) {
      try {
        Promise.resolve(
          this.#callbacks.onAdd({
            buffer: this.#buffer,
            payload: this.#payload,
            item,
            serviceContext: this.#serviceContext,
            logger: this.#logger
          })
        ).catch((error) => {
          this.#logger.error(`Erro n\xE3o tratado no callback onAdd.`, {
            errorMessage: error.message
          });
        });
      } catch (syncError) {
        this.#logger.error(`Erro s\xEDncrono no callback onAdd.`, {
          errorMessage: syncError.message
        });
      }
    }
    if (this.#buffer.length >= this.#limit) {
      this.flush();
    }
  }
  /**
   * Dispara o processamento de lotes de forma síncrona e não-bloqueante.
   *
   * Atua como um "despachante": ele verifica o estado atual do buffer e os slots
   * de concorrência disponíveis e inicia quantas operações de processamento (`#executeFlush`)
   * forem possíveis, até o limite de `maxConcurrentFlushes`.
   *
   * Este método é chamado automaticamente pelo `add()` e `end()`, mas também pode ser
   * invocado manualmente para forçar o processamento de um lote parcial.
   */
  flush() {
    while (this.#buffer.length > 0 && this.#activeFlushes < this.#maxConcurrentFlushes) {
      const batch = this.#buffer.splice(0, this.#limit);
      this.#executeFlush(batch);
    }
  }
  /**
   * O motor de processamento assíncrono para um único lote.
   *
   * Este método privado encapsula toda a lógica complexa de uma operação de flush,
   * incluindo:
   * 1. Gerenciamento do timeout da operação (`flushTimeoutMs`).
   * 2. Implementação da política de retries (`retries` e `retryDelayMs`).
   * 3. Invocação do callback `onFlushFailure` para lotes que falham permanentemente.
   * 4. Gerenciamento do contador de flushes ativos.
   * 5. Disparo reativo do próximo ciclo de `flush` para manter o pipeline de processamento ativo.
   *
   * @private
   * @param {any[]} batch - O lote de itens que esta execução irá processar.
   * @returns {Promise<void>}
   */
  async #executeFlush(batch) {
    this.#activeFlushes++;
    this.#logger.info(
      `Iniciando processamento de lote com ${batch.length} itens. Ativos: ${this.#activeFlushes}`
    );
    let lastError = null;
    for (let attempt = 0; attempt <= this.#retries; attempt++) {
      try {
        if (!this.#callbacks.onFlush) {
          this.#logger.info(
            `Nenhum callback onFlush definido. Lote de ${batch.length} itens descartado.`
          );
          lastError = null;
          break;
        }
        if (attempt > 0) {
          this.#logger.info(
            `Tentativa ${attempt}/${this.#retries} para o lote.`
          );
        }
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () => reject(
              new Error(`Flush timed out after ${this.#flushTimeoutMs}ms`)
            ),
            this.#flushTimeoutMs
          );
        });
        try {
          await Promise.race([
            this.#callbacks.onFlush({
              batch,
              payload: this.#payload,
              serviceContext: this.#serviceContext,
              logger: this.#logger
            }),
            timeoutPromise
          ]);
        } finally {
          clearTimeout(timeoutId);
        }
        this.#logger.info(
          `Lote de ${batch.length} itens processado com sucesso.`
        );
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt >= this.#retries) {
          this.#logger.error(
            `Falha definitiva ao processar o lote ap\xF3s ${attempt} tentativa(s).`,
            {
              errorMessage: error.message,
              batchSize: batch.length
            }
          );
        } else {
          this.#logger.warn(
            `Falha na tentativa ${attempt} de processar o lote. Tentando novamente em ${this.#retryDelayMs}ms...`,
            {
              errorMessage: error.message
            }
          );
          await new Promise(
            (resolve) => setTimeout(resolve, this.#retryDelayMs)
          );
        }
      }
    }
    if (lastError && this.#callbacks.onFlushFailure) {
      try {
        await this.#callbacks.onFlushFailure({
          batch,
          error: lastError,
          payload: this.#payload,
          serviceContext: this.#serviceContext,
          logger: this.#logger
        });
        this.#logger.info(
          `Callback onFlushFailure executado para o lote com falha.`
        );
      } catch (failureCallbackError) {
        this.#logger.error(`Erro CR\xCDTICO no pr\xF3prio callback onFlushFailure.`, {
          errorMessage: failureCallbackError.message
        });
      }
    }
    this.#activeFlushes--;
    this.#logger.info(
      `Processamento de lote finalizado. Ativos: ${this.#activeFlushes}`
    );
    this.flush();
  }
  /**
   * Finaliza o processador, garantindo que todos os itens pendentes sejam processados.
   * Este método é idempotente (seguro para ser chamado múltiplas vezes) e DEVE ser
   * invocado ao final do ciclo de vida da aplicação para evitar perda de dados.
   *
   * @param {number} [forceTimeoutMs=30000] - Tempo máximo em milissegundos para aguardar a
   * finalização dos lotes em processamento. Se o tempo for excedido, o processo é
   * encerrado e um aviso é logado com os itens restantes.
   * @returns {Promise<void>} Uma promessa que resolve quando todos os itens forem
   * processados ou quando o timeout for atingido.
   */
  async end(forceTimeoutMs = 3e4) {
    if (this.#isEnding) {
      return;
    }
    this.#isEnding = true;
    const endStartTime = Date.now();
    this.#logger.info("Finalizando o processador...", {
      itemsNoBuffer: this.#buffer.length,
      activeFlushes: this.#activeFlushes
    });
    if (this.#callbacks.onEnd) {
      try {
        await this.#callbacks.onEnd({
          /* ... */
        });
      } catch (error) {
        this.#logger.error(`Erro no callback onEnd.`, {
          errorMessage: error.message
        });
      }
    }
    this.flush();
    while ((this.#buffer.length > 0 || this.#activeFlushes > 0) && Date.now() - endStartTime < forceTimeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (this.#buffer.length > 0 || this.#activeFlushes > 0) {
      this.#logger.warn(
        "Finaliza\xE7\xE3o for\xE7ada por timeout. Itens n\xE3o processados foram descartados.",
        {
          remainingItems: this.#buffer.length,
          activeFlushes: this.#activeFlushes
        }
      );
    }
    this.#logger.info("Processador finalizado.");
  }
};
var bulkProcessor_default = BulkProcessor;

// src/custom/waitPlugin.js
var WaitPlugin = class {
  /**
   * Inicializa o plugin.
   * @constructor
   */
  constructor() {
    this._waitList = /* @__PURE__ */ new Map();
  }
  /**
   * Getter público para a lista de esperas.
   * @description Converte o Map interno em um Objeto simples para fins de compatibilidade
   * com testes ou para facilitar a depuração.
   * @returns {Object<string, {promise: Promise<any>, resolve: Function, reject: Function}>}
   */
  get waitList() {
    return Object.fromEntries(this._waitList);
  }
  // ----------------------------------------------------------------------------------------------
  /**
   * Finaliza uma espera, resolvendo ou rejeitando a Promise correspondente.
   *
   * @param {string} name - O nome único da espera a ser finalizada.
   * @param {boolean} [isSuccessful=true] - Se `true`, a Promise será resolvida. Se `false`, será rejeitada.
   * @param {*} [returnParam] - O valor a ser passado para o `resolve` ou `reject` da Promise.
   * @returns {any} Retorna `false` se a espera não existir. Em caso de erro interno, retorna o
   * próprio objeto de erro. Em sucesso, o retorno é indefinido.
   */
  finishWait(name, isSuccessful = true, returnParam) {
    try {
      const waitItem = this._waitList.get(name);
      if (!waitItem) {
        return false;
      }
      if (isSuccessful) {
        waitItem.resolve(returnParam);
      } else {
        waitItem.reject(returnParam);
      }
    } catch (error) {
      return error;
    } finally {
      this._waitList.delete(name);
    }
  }
  // ----------------------------------------------------------------------------------------------
  /**
   * Inicia uma nova espera e retorna uma Promise associada a ela.
   *
   * @param {string} name - O nome único para a nova espera.
   * @returns {Promise<any>|undefined} Retorna a Promise que aguardará a finalização.
   * Retorna `undefined` se uma espera com o mesmo nome já existir.
   */
  startWait(name) {
    if (this._waitList.has(name)) {
      return;
    }
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this._waitList.set(name, { promise, resolve, reject });
    return promise;
  }
  // ----------------------------------------------------------------------------------------------
  /**
   * Finaliza todas as esperas ativas de uma só vez.
   *
   * @param {boolean} isSuccessful - Se `true`, todas as Promises serão resolvidas. Se `false`, serão rejeitadas.
   * @param {*} [returnParam] - O valor a ser passado para cada `resolve` ou `reject`.
   */
  finishAll(isSuccessful, returnParam) {
    const allWaitKeys = Array.from(this._waitList.keys());
    for (const key of allWaitKeys) {
      this.finishWait(key, isSuccessful, returnParam);
    }
  }
  // ----------------------------------------------------------------------------------------------
};
var WP = new WaitPlugin();
var waitPlugin_default = WP;

// src/custom/index.js
var custom_exports = {};
__export(custom_exports, {
  bulkProcessor: () => bulkProcessor_default,
  db: () => sequelize_exports,
  default: () => custom_default,
  waitPlugin: () => waitPlugin_default
});
var custom_default = {
  db: sequelize_exports,
  waitPlugin: waitPlugin_default,
  bulkProcessor: bulkProcessor_default
};

// src/index.js
var auth = { webAuthn: webauthn_exports };
var constants = constants_exports;
var crypto2 = crypto_exports;
var custom = {
  db: {
    sequelize: {
      ...sequelize_exports
    }
  },
  waitPlugin: waitPlugin_default,
  bulkProcessor: bulkProcessor_default
};
var helpers = helpers_exports;
var utils = utils_exports;
var validators = validators_exports;
var miscHelpers = {
  auth: webauthn_exports,
  constants: constants_exports,
  crypto: crypto_exports,
  custom: custom_exports,
  helpers: helpers_exports,
  utils: utils_exports,
  validators: validators_exports
};
var index_default = miscHelpers;
export {
  JSONFrom_default as JSONFrom,
  JSONTo_default as JSONTo,
  assign_default as assign,
  auth,
  base64From_default as base64From,
  base64FromBase64URLSafe_default as base64FromBase64URLSafe,
  base64FromBuffer_default as base64FromBuffer,
  base64To_default as base64To,
  base64ToBuffer_default as base64ToBuffer,
  base64URLEncode_default as base64URLEncode,
  bufferCompare_default as bufferCompare,
  bufferConcatenate_default as bufferConcatenate,
  bufferFromString_default as bufferFromString,
  bufferToString_default as bufferToString,
  bulkProcessor_default as bulkProcessor,
  calculateSecondsInTime_default as calculateSecondsInTime,
  cleanObject_default as cleanObject,
  constants,
  convertECDSAASN1Signature_default as convertECDSAASN1Signature,
  crypto2 as crypto,
  currencyBRToFloat_default as currencyBRToFloat,
  custom,
  dateCompareAsc_default as dateCompareAsc,
  dateCompareDesc_default as dateCompareDesc,
  dateFirstHourOfDay_default as dateFirstHourOfDay,
  dateLastHourOfDay_default as dateLastHourOfDay,
  dateToFormat_default as dateToFormat,
  debouncer_default as debouncer,
  decrypt_default as decrypt,
  decryptBuffer_default as decryptBuffer,
  index_default as default,
  defaultNumeric_default as defaultNumeric,
  defaultValue_default as defaultValue,
  deleteKeys_default as deleteKeys,
  digest_default as digest,
  encrypt_default as encrypt,
  encryptBuffer_default as encryptBuffer,
  generateRandomString_default as generateRandomString,
  generateSimpleId_default as generateSimpleId,
  getAuthenticationAuthData_default as getAuthenticationAuthData,
  getCrypto_default as getCrypto,
  getExecutionTime_default as getExecutionTime,
  getRegistrationAuthData_default as getRegistrationAuthData,
  getWebAuthnAuthenticationAssertion_default as getWebAuthnAuthenticationAssertion,
  getWebAuthnRegistrationCredential_default as getWebAuthnRegistrationCredential,
  helpers,
  importCryptoKey_default as importCryptoKey,
  isInstanceOf_default as isInstanceOf,
  isNumber_default as isNumber,
  isObject_default as isObject,
  messageDecryptFromChunks_default as messageDecryptFromChunks,
  messageEncryptToChunks_default as messageEncryptToChunks,
  normalize_default as normalize,
  pickKeys_default as pickKeys,
  pushLogMessage_default as pushLogMessage,
  regexDigitsOnly_default as regexDigitsOnly,
  regexLettersOnly_default as regexLettersOnly,
  regexReplaceTrim_default as regexReplaceTrim,
  removeDuplicatedStrings_default as removeDuplicatedStrings,
  setConditionsBetweenDates_default as setConditionBetweenDates,
  setConditionsBetweenValues_default as setConditionBetweenValues,
  setConditionStringLike_default as setConditionStringLike,
  sleep_default as sleep,
  split_default as split,
  stringCompress_default as stringCompress,
  stringDecompress_default as stringDecompress,
  stringToDate_default as stringToDate,
  stringToDateToFormat_default as stringToDateToFormat,
  stringToFormat_default as stringToFormat,
  stringZLibCompress_default as stringZLibCompress,
  stringZLibDecompress_default as stringZLibDecompress,
  throttle_default as throttle,
  timestamp_default as timestamp,
  toString_default as toString,
  uint8ArrayFromString_default as uint8ArrayFromString,
  uint8ArrayToString_default as uint8ArrayToString,
  utils,
  validateAuthentication_default as validateAuthentication,
  validateCADICMSPR_default as validateCADICMSPR,
  validateCEP_default as validateCEP,
  validateCNH_default as validateCNH,
  validateCNPJ_default as validateCNPJ,
  validateCPF_default as validateCPF,
  validateChavePix_default as validateChavePix,
  validateEmail_default as validateEmail,
  validatePISPASEPNIT_default as validatePISPASEPNIT,
  validateRG_default as validateRG,
  validateRPID_default as validateRPID,
  validateRegistration_default as validateRegistration,
  validateRenavam_default as validateRenavam,
  validateTituloEleitor_default as validateTituloEleitor,
  validators,
  verifySignature_default as verifySignature,
  waitPlugin_default as waitPlugin
};
//# sourceMappingURL=index.js.map