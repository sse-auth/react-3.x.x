"use strict";

import getSideChannel from "side-channel";
import * as utils from "./utils";
import formats from "./formats";

const has = Object.prototype.hasOwnProperty;
type ArrayPrefixGenerator = (prefix: string, key?: string) => string;

const arrayPrefixGenerators: Record<string, ArrayPrefixGenerator | string> = {
  brackets: (prefix: string) => `${prefix}[]`,
  comma: "comma",
  indices: (prefix: string, key: string) => `${prefix}[${key}]`,
  repeat: (prefix: string) => prefix,
};

const isArray = Array.isArray;
const push = Array.prototype.push;

const pushToArray = (arr: any[], valueOrArray: any) => {
  push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

const toISO = Date.prototype.toISOString;
const defaultFormat = formats["default"];
const defaults = {
  addQueryPrefix: false,
  allowDots: false,
  allowEmptyArrays: false,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: false,
  commaRoundTrip: false,
  delimiter: "&",
  encode: true,
  encodeDotInKeys: false,
  encoder: utils.encode,
  encodeValuesOnly: false,
  filter: undefined,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  indices: false, // deprecated
  serializeDate: (date: Date) => toISO.call(date),
  skipNulls: false,
  strictNullHandling: false,
  sort: null,
};

const isNonNullishPrimitive = (v: any): boolean => {
  return (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean" ||
    typeof v === "symbol" ||
    typeof v === "bigint"
  );
};

const sentinel = {};

const stringify = (
  object: any,
  prefix: string,
  generateArrayPrefix: string | ArrayPrefixGenerator,
  commaRoundTrip: boolean,
  allowEmptyArrays: boolean,
  strictNullHandling: boolean,
  skipNulls: boolean,
  encodeDotInKeys: boolean,
  encoder: Function | null,
  filter: Function | string[] | undefined,
  sort: Function | null,
  allowDots: boolean,
  serializeDate: Function,
  format: string,
  formatter: Function,
  encodeValuesOnly: boolean,
  charset: string,
  sideChannel: any
): string[] => {
  let obj = object;

  let tmpSc = sideChannel;
  let step = 0;
  let findFlag = false;

  let pos;
  while ((tmpSc = tmpSc.get(sentinel)) !== undefined && !findFlag) {
    pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        findFlag = true; // Break while
      }
    }
    if (typeof tmpSc.get(sentinel) === "undefined") {
      step = 0;
    }
  }

  if (typeof pos !== "undefined") {
    if (pos === step) {
      throw new RangeError("Cyclic object value");
    } else {
      findFlag = true; // Break while
    }
  }
  if (typeof tmpSc.get(sentinel) === "undefined") {
    step = 0;
  }

  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (generateArrayPrefix === "comma" && isArray(obj)) {
    obj = utils.maybeMap(obj, (value) =>
      value instanceof Date ? serializeDate(value) : value
    );
  }

  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly
        ? encoder(prefix, defaults.encoder, charset, "key", format)
        : [prefix];
    }
    obj = "";
  }

  if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
    if (encoder) {
      const keyValue = encodeValuesOnly
        ? prefix
        : encoder(prefix, defaults.encoder, charset, "key", format);
      return [
        `${formatter(keyValue)}=${formatter(
          encoder(obj, defaults.encoder, charset, "value", format)
        )}`,
      ];
    }
    return [`${formatter(prefix)}=${formatter(String(obj))}`];
  }
};

const normalizeStringifyOptions = (opts?: any) => {
  if (!opts) {
    return defaults;
  }

  if (
    typeof opts.allowEmptyArrays !== "undefined" &&
    typeof opts.allowEmptyArrays !== "boolean"
  ) {
    throw new TypeError(
      "`allowEmptyArrays` option can only be `true` or `false`, when provided"
    );
  }

  if (
    typeof opts.encodeDotInKeys !== "undefined" &&
    typeof opts.encodeDotInKeys !== "boolean"
  ) {
    throw new TypeError(
      "`encodeDotInKeys` option can only be `true` or `false`, when provided"
    );
  }

  if (
    opts.encoder !== null &&
    typeof opts.encoder !== "undefined" &&
    typeof opts.encoder !== "function"
  ) {
    throw new TypeError("Encoder has to be a function.");
  }

  const charset = opts.charset || defaults.charset;
  if (
    typeof opts.charset !== "undefined" &&
    opts.charset !== "utf-8" &&
    opts.charset !== "iso-8859-1"
  ) {
    throw new TypeError(
      "The charset option must be either utf-8, iso-8859-1, or undefined"
    );
  }

  let format = formats["default"];
  if (typeof opts.format !== "undefined") {
    if (!has.call(formats.formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  const formatter = formats.formatters[format];

  let filter = defaults.filter;
  if (typeof opts.filter === "function" || isArray(opts.filter)) {
    filter = opts.filter;
  }

  let arrayFormat;
  if (opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if ("indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = defaults.arrayFormat;
  }

  if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }

  const allowDots =
    typeof opts.allowDots === "undefined"
      ? opts.encodeDotInKeys === true
        ? true
        : defaults.allowDots
      : !!opts.allowDots;

  return {
    addQueryPrefix:
      typeof opts.addQueryPrefix === "boolean"
        ? opts.addQueryPrefix
        : defaults.addQueryPrefix,
    allowDots: allowDots,
    allowEmptyArrays:
      typeof opts.allowEmptyArrays === "boolean"
        ? !!opts.allowEmptyArrays
        : defaults.allowEmptyArrays,
    arrayFormat: arrayFormat,
    charset: charset,
    charsetSentinel:
      typeof opts.charsetSentinel === "boolean"
        ? opts.charsetSentinel
        : defaults.charsetSentinel,
    commaRoundTrip: !!opts.commaRoundTrip,
    delimiter:
      typeof opts.delimiter === "undefined"
        ? defaults.delimiter
        : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
    encodeDotInKeys:
      typeof opts.encodeDotInKeys === "boolean"
        ? opts.encodeDotInKeys
        : defaults.encodeDotInKeys,
    encoder:
      typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
    encodeValuesOnly:
      typeof opts.encodeValuesOnly === "boolean"
        ? opts.encodeValuesOnly
        : defaults.encodeValuesOnly,
    filter: filter,
    format: format,
    formatter: formatter,
    serializeDate:
      typeof opts.serializeDate === "function"
        ? opts.serializeDate
        : defaults.serializeDate,
    skipNulls:
      typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling:
      typeof opts.strictNullHandling === "boolean"
        ? opts.strictNullHandling
        : defaults.strictNullHandling,
  };
};

const queryStringify = (object: any, opts?: any): string => {
  let obj = object;
  const options = normalizeStringifyOptions(opts);

  let objKeys: string[] | undefined;
  let filter: Function | string[] | undefined;

  if (typeof options.filter === "function") {
    filter = options.filter;
    if (typeof filter === "function") {
      obj = filter("", obj);
    }
  } else if (isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }

  const keys: string[] = [];

  if (typeof obj !== "object" || obj === null) {
    return "";
  }

  const generateArrayPrefix = arrayPrefixGenerators[
    options.arrayFormat
  ] as ArrayPrefixGenerator;
  const commaRoundTrip =
    typeof generateArrayPrefix === "string" &&
    generateArrayPrefix === "comma" &&
    options.commaRoundTrip;

  if (!objKeys) {
    objKeys = Object.keys(obj);
  }

  if (options.sort) {
    objKeys.sort(options.sort);
  }

  const sideChannel = getSideChannel();
  for (let i = 0; i < objKeys.length; ++i) {
    const key = objKeys[i];
    const value = obj[key];

    if (options.skipNulls && value === null) {
      continue;
    }
    pushToArray(
      keys,
      stringify(
        value,
        key,
        generateArrayPrefix,
        commaRoundTrip,
        options.allowEmptyArrays,
        options.strictNullHandling,
        options.skipNulls,
        options.encodeDotInKeys,
        options.encode ? options.encoder : null,
        options.filter,
        options.sort,
        options.allowDots,
        options.serializeDate,
        options.format,
        options.formatter,
        options.encodeValuesOnly,
        options.charset,
        sideChannel
      )
    );
  }

  const joined = keys.join(options.delimiter);
  let prefix = options.addQueryPrefix === true ? "?" : "";

  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }

  return joined.length > 0 ? prefix + joined : "";
};

export default queryStringify;
