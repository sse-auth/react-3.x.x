"use strict";

import * as base32 from "base32.js";
import _debug from "debug";
import { Buffer } from "@ssets/crypto/dist/buffer";
import { UrlObject } from "./types";

export const debug = _debug("sse-authenticator");

export function checkWindow(window): number {
  if (Math.floor(window) !== window) {
    throw new Error("Invalid window `" + window + "`");
  }
  return window;
}

export function checkDigits(digits): number {
  if (Math.floor(digits) !== digits) {
    throw new Error("Invalid digits `" + digits + "`");
  } else if (digits !== 6) {
    debug("Compatibility could be improved by using the default digits of 6.");
  }
  return digits;
}

export function checkAlgorithm(algorithm): string {
  algorithm = algorithm.toLowerCase();
  if (algorithm !== "sha1") {
    debug(
      "Compatibility could be improved by using the default algorithm" +
        " of sha1."
    );
  }
  return algorithm;
}

export function checkCounter(counter): number {
  if (counter == null) {
    throw new Error("Missing counter value");
  }
  if (Math.floor(counter) !== counter) {
    throw new Error("Invalid counter `" + counter + "`");
  }
  return counter;
}

export function checkTime(
  time: Date | number | (() => Date | number)
): number | (() => number) {
  if (typeof time === "function") {
    const fn: () => any = time;
    time = fn();
    if (time instanceof Date) {
      return () => Math.floor(fn() / 1000);
    } else if (typeof time === "number") {
      return () => Math.floor(fn());
    }
  } else if (time instanceof Date) {
    return +time / 1000;
  } else if (typeof time === "number") {
    return Math.floor(<number>time);
  }
  throw new Error("invalid time " + time);
}

export function checkEpoch(epoch): number {
  if (Math.floor(epoch) !== epoch) {
    throw new Error("Invalid epoch `" + epoch + "`");
  }
  return epoch;
}

export function checkPeriod(period): number {
  if (Math.floor(period) !== period || period <= 0) {
    throw new Error("Invalid period `" + period + "`");
  } else if (period !== 30) {
    debug(
      "Compatibility could be improved by using the default period" +
        " of 30 seconds."
    );
  }
  return period;
}

export function byteSizeForAlgo(algorithm: string): number {
  switch (algorithm) {
    case "sha1":
      return 20;
    case "sha256":
      return 32;
    case "sha512":
      return 64;
    default:
      throw new Error("Unrecognized hash algorithm `" + algorithm + "`");
  }
}

export function padSecret(secret: Buffer, algorithm: string): Buffer {
  // The secret for sha1, sha256 and sha512 needs to be a fixed number of
  // bytes for the one-time-password to be calculated correctly. Pad the
  // buffer to the correct size be repeating the secret to the desired
  // length.
  const byteSize = byteSizeForAlgo(algorithm);

  if (byteSize && secret.length < byteSize) {
    debug(
      "HMAC key repeated to %d bytes. Compatibility could be" +
        " improved by using a secret with a byte size of %d.",
      byteSize,
      byteSize
    );

    let bufSize = 0;
    const buffers = [];
    while (bufSize < byteSize) {
      buffers.push(secret);
      bufSize += secret.length;
    }

    const repeat = bufSize % byteSize;
    if (repeat !== 0) {
      buffers.push(secret.slice(0, repeat));
    }
    secret = Buffer.concat(buffers, bufSize);
  }

  return secret;
}

export function secretAsBuffer(secret, encoding): Buffer {
  if (Buffer.isBuffer(secret)) {
    return secret;
  } else if (encoding === "base32") {
    return new Buffer(base32.decode(secret));
  } else {
    return new Buffer(secret, encoding || "ascii");
  }
}

// function createHmacBuffer(algo: Algorithm, key: string | Buffer): Hmac {
//   const alg = algo
//   // if (alg === 'md5') {
//   //   return new Legacy(md5, key)
//   // }
//   // return new Hmac(alg, key)
// }

export function urlFormat(urlObject: UrlObject | string): string {
  if (typeof urlObject === "string") {
    return urlObject;
  }

  let url = "";

  if (urlObject.protocol) {
    url += urlObject.protocol.replace(/:$/, "") + "://"; // Remove trailing colon
  }

  // Add slashes if specified
  if (urlObject.slashes) {
    url += "//";
  }

  // Add auth if present
  if (urlObject.auth) {
    url += encodeURIComponent(urlObject.auth) + "@";
  }

  // Add host or hostname
  if (urlObject.host) {
    url += urlObject.host;
  } else if (urlObject.hostname) {
    url += urlObject.hostname;
    if (urlObject.port) {
      url += ":" + urlObject.port;
    }
  }

  // Add pathname
  if (urlObject.pathname) {
    url += urlObject.pathname;
  }

  // Add search
  if (urlObject.search) {
    url += urlObject.search;
  }

  // Add hash
  if (urlObject.hash) {
    url += urlObject.hash;
  }

  return url;
}
