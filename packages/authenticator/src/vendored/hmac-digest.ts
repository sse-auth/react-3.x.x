/**
 * @source https://github.com/sseworld
 * @author sseworld
 * @license MIT
 */

import * as crypto from "node:crypto";
import { hmac } from "@noble/hashes/hmac";
import { sha1 } from "@noble/hashes/sha1";
import { sha224, sha256, sha384, sha512 } from "@noble/hashes/sha2";
import { sha3_224, sha3_256, sha3_384, sha3_512 } from "@noble/hashes/sha3";

/**
 * @noble/hashes hash functions.
 * @type {Object.<string, sha1|sha224|sha256|sha384|sha512|sha3_224|sha3_256|sha3_384|sha3_512>}
 */
const nobleHashes = {
  SHA1: sha1,
  SHA224: sha224,
  SHA256: sha256,
  SHA384: sha384,
  SHA512: sha512,
  "SHA3-224": sha3_224,
  "SHA3-256": sha3_256,
  "SHA3-384": sha3_384,
  "SHA3-512": sha3_512,
};

export type Algorithm =
  | "SHA1"
  | "SHA224"
  | "SHA256"
  | "SHA384"
  | "SHA512"
  | "SHA3-224"
  | "SHA3-256"
  | "SHA3-384"
  | "SHA3-512";

/**
 * "globalThis" ponyfill.
 * @see [A horrifying globalThis polyfill in universal JavaScript](https://mathiasbynens.be/notes/globalthis)
 * @type {Object.<string, *>}
 */
interface GlobalScopeInt {
  [key: string]: any;
}

const globalScope: GlobalScopeInt = (() => {
  if (typeof globalThis === "object") return globalThis;
  else {
    Object.defineProperty(Object.prototype, "__GLOBALTHIS__", {
      get() {
        return this;
      },
      configurable: this,
    });
    try {
      // @ts-expect-error
      // eslint-disable-next-line no-undef
      if (typeof __GLOBALTHIS__ !== "undefined") return __GLOBALTHIS__;
    } finally {
      // @ts-expect-error
      delete Object.prototype.__GLOBALTHIS__;
    }
  }

  // Still unable to determine "globalThis", fall back to a naive method.
  if (typeof self !== "undefined") return self;
  else if (typeof window !== "undefined") return window;
  else if (typeof global !== "undefined") return global;

  return undefined;
})();

/**
 * Canonicalizes a hash algorithm name.
 * @param {string} algorithm Hash algorithm name.
 * @returns {"SHA1"|"SHA224"|"SHA256"|"SHA384"|"SHA512"|"SHA3-224"|"SHA3-256"|"SHA3-384"|"SHA3-512"} Canonicalized hash algorithm name.
 */
export function canonicalizeAlgorithm(algorithm: string): Algorithm {
  switch (true) {
    case /^(?:SHA-?1|SSL3-SHA1)$/i.test(algorithm):
      return "SHA1";
    case /^SHA(?:2?-)?224$/i.test(algorithm):
      return "SHA224";
    case /^SHA(?:2?-)?256$/i.test(algorithm):
      return "SHA256";
    case /^SHA(?:2?-)?384$/i.test(algorithm):
      return "SHA384";
    case /^SHA(?:2?-)?512$/i.test(algorithm):
      return "SHA512";
    case /^SHA3-224$/i.test(algorithm):
      return "SHA3-224";
    case /^SHA3-256$/i.test(algorithm):
      return "SHA3-256";
    case /^SHA3-384$/i.test(algorithm):
      return "SHA3-384";
    case /^SHA3-512$/i.test(algorithm):
      return "SHA3-512";
    default:
      throw new TypeError(`Unknown hash algorithm: ${algorithm}`);
  }
}

/**
 * Calculates an HMAC digest.
 * @param {string} algorithm Algorithm.
 * @param {Uint8Array} key Key.
 * @param {Uint8Array} message Message.
 * @returns {Uint8Array} Digest.
 */
export function hmacDigest(
  algorithm: Algorithm,
  key: Uint8Array,
  message: Uint8Array
): Uint8Array {
  if (crypto?.createHmac) {
    const hmac = crypto.createHmac(algorithm, globalScope.Buffer.from(key));
    hmac.update(globalScope.Buffer.from(message));
    return hmac.digest();
  } else if (hmac) {
    const hash =
      nobleHashes[algorithm] ?? nobleHashes[canonicalizeAlgorithm(algorithm)];
    return hmac(hash, key, message);
  } else {
    throw new Error("Missing HMAC function");
  }
}
