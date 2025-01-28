/*
 * Copyright SSE World.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";

import punycode from "./punycode";
import * as querystring from "./qs";
import { ParsedUrlQuery, ParsedUrlQueryInput, UrlObject } from "../types";
import { UrlWithStringQuery } from "url";

export class Url {
  public protocol: string | null = null;
  public slashes: boolean | null = null;
  public auth: string | null = null;
  public host: string | null = null;
  public port: string | null = null;
  public hostname: string | null = null;
  public hash: string | null = null;
  public search: string | null = null;
  public query: string | null | ParsedUrlQuery = null;
  public pathname: string | null = null;
  public path: string | null = null;
  public href: string = "";

  // Define patterns and constants here...
  private static protocolPattern = /^([a-z0-9.+-]+:)/i;
  private static portPattern = /:[0-9]*$/;
  private static simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
  private static delims = ["<", ">", '"', "`", " ", "\r", "\n", "\t"];
  private static unwise = ["{", "}", "|", "\\", "^", "`"].concat(Url.delims);
  private static autoEscape = ["'"].concat(Url.unwise);
  private static nonHostChars = ["%", "/", "?", ";", "#"].concat(
    Url.autoEscape
  );
  private static hostEndingChars = ["/", "?", "#"];
  private static hostnameMaxLen = 255;
  private static hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
  private static hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
  private static unsafeProtocol = {
    javascript: true,
    "javascript:": true,
  };
  private static hostlessProtocol = {
    javascript: true,
    "javascript:": true,
  };
  private static slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    "http:": true,
    "https:": true,
    "ftp:": true,
    "gopher:": true,
    "file:": true,
  };

  public parse(
    url: string,
    parseQueryString: boolean = false,
    slashesDenoteHost: boolean = false
  ): this {
    if (typeof url !== "string") {
      throw new TypeError(
        "Parameter 'url' must be a string, not " + typeof url
      );
    }

    // Handle backslashes
    url = url.replace(/\\/g, "/");

    // Trim whitespace
    url = url.trim();

    // Fast path for simple path URLs
    if (!slashesDenoteHost && url.split("#").length === 1) {
      const simplePath = Url.simplePathPattern.exec(url);
      if (simplePath) {
        this.path = url;
        this.href = url;
        this.pathname = simplePath[1];
        if (simplePath[2]) {
          this.search = simplePath[2];
          this.query = parseQueryString
            ? querystring.parse(this.search.substr(1))
            : this.search.substr(1);
        } else if (parseQueryString) {
          this.search = "";
          this.query = {};
        }
        return this;
      }
    }

    // Parse protocol
    const proto = Url.protocolPattern.exec(url);
    if (proto) {
      this.protocol = proto[0].toLowerCase();
      url = url.substr(proto[0].length);
    }

    // Handle slashes
    if (slashesDenoteHost || proto || url.match(/^\/\/[^@/]+@[^@/]+/)) {
      const slashes = url.substr(0, 2) === "//";
      if (slashes && !(proto && Url.hostlessProtocol[proto[0]])) {
        url = url.substr(2);
        this.slashes = true;
      }
    }

    // Parse host
    if (
      !Url.hostlessProtocol[proto[0]] &&
      (this.slashes || (proto && !Url.slashedProtocol[proto[0]]))
    ) {
      let hostEnd = -1;
      for (const char of Url.hostEndingChars) {
        const hec = url.indexOf(char);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
          hostEnd = hec;
        }
      }

      let auth;
      const atSign =
        hostEnd === -1 ? url.lastIndexOf("@") : url.lastIndexOf("@", hostEnd);
      if (atSign !== -1) {
        auth = url.slice(0, atSign);
        url = url.slice(atSign + 1);
        this.auth = decodeURIComponent(auth);
      }

      hostEnd = -1;
      for (const char of Url.nonHostChars) {
        const hec = url.indexOf(char);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
          hostEnd = hec;
        }
      }
      if (hostEnd === -1) {
        hostEnd = url.length;
      }

      this.host = url.slice(0, hostEnd);
      url = url.slice(hostEnd);
      this.parseHost();
      this.hostname = this.hostname || "";

      // Validate hostname
      if (this.hostname.length > Url.hostnameMaxLen) {
        this.hostname = "";
      } else {
        this.hostname = this.hostname.toLowerCase();
      }

      // IDNA Support
      this.hostname = punycode.toASCII(this.hostname);
      this.host = this.hostname + (this.port ? ":" + this.port : "");
      this.href += this.host;
    }

    // Handle the rest of the URL
    if (!Url.unsafeProtocol[this.protocol]) {
      for (const ae of Url.autoEscape) {
        if (url.indexOf(ae) === -1) continue;
        const esc = encodeURIComponent(ae);
        url = url.split(ae).join(esc);
      }
    }

    // Parse hash and query
    const hashIndex = url.indexOf("#");
    if (hashIndex !== -1) {
      this.hash = url.substr(hashIndex);
      url = url.slice(0, hashIndex);
    }
    const qmIndex = url.indexOf("?");
    if (qmIndex !== -1) {
      this.search = url.substr(qmIndex);
      this.query = url.substr(qmIndex + 1);
      if (parseQueryString) {
        this.query = querystring.parse(this.query);
      }
      url = url.slice(0, qmIndex);
    } else if (parseQueryString) {
      this.search = "";
      this.query = {};
    }
    if (url) {
      this.pathname = url;
    }
    if (Url.slashedProtocol[this.protocol] && this.hostname && !this.pathname) {
      this.pathname = "/";
    }

    // Reconstruct the href
    this.href = this.format();
    return this;
  }

  public format(): string {
    let auth = this.auth || "";
    if (auth) {
      auth = encodeURIComponent(auth).replace(/%3A/i, ":") + "@";
    }

    let protocol = this.protocol || "";
    let host = this.host
      ? auth + this.host
      : auth +
        (this.hostname
          ? this.hostname.indexOf(":") === -1
            ? this.hostname
            : "[" + this.hostname + "]"
          : "");
    if (this.port) {
      host += ":" + this.port;
    }

    let pathname = this.pathname || "";
    let hash = this.hash || "";
    let search =
      this.search ||
      (this.query && Object.keys(this.query).length
        ? "?" + querystring.stringify(this.query)
        : "");

    if (protocol && protocol.substr(-1) !== ":") {
      protocol += ":";
    }

    if (
      this.slashes ||
      ((!protocol || Url.slashedProtocol[protocol]) && host !== "")
    ) {
      host = "//" + (host || "");
      if (pathname && pathname.charAt(0) !== "/") {
        pathname = "/" + pathname;
      }
    } else if (!host) {
      host = "";
    }

    if (hash && hash.charAt(0) !== "#") {
      hash = "#" + hash;
    }
    if (search && search.charAt(0) !== "?") {
      search = "?" + search;
    }

    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace("#", "%23");

    return protocol + host + pathname + search + hash;
  }

  public static parse(
    url: string,
    parseQueryString: boolean = false,
    slashesDenoteHost: boolean = false
  ): Url {
    const u = new Url();
    return u.parse(url, parseQueryString, slashesDenoteHost);
  }

  public static resolve(source: string, relative: string): string {
    return Url.parse(source, false, true).resolve(relative);
  }

  public resolve(relative: string): string {
    return this.resolveObject(Url.parse(relative, false, true)).format();
  }

  public resolveObject(relative: Url | string): Url {
    if (typeof relative === "string") {
      relative = Url.parse(relative, false, true);
    }

    const result = new Url();
    Object.assign(result, this);
    result.hash = relative.hash;

    if (relative.href === "") {
      result.href = result.format();
      return result;
    }

    if (relative.slashes && !relative.protocol) {
      const rkeys = Object.keys(relative);
      for (const rkey of rkeys) {
        if (rkey !== "protocol") {
          result[rkey] = relative[rkey];
        }
      }
      if (
        Url.slashedProtocol[result.protocol] &&
        result.hostname &&
        !result.pathname
      ) {
        result.pathname = "/";
        result.path = result.pathname;
      }
      result.href = result.format();
      return result;
    }

    if (relative.protocol && relative.protocol !== result.protocol) {
      if (!Url.slashedProtocol[relative.protocol]) {
        Object.assign(result, relative);
        result.href = result.format();
        return result;
      }

      result.protocol = relative.protocol;
      if (!relative.host && !Url.hostlessProtocol[relative.protocol]) {
        const relPath = (relative.pathname || "").split("/");
        while (relPath.length && !(relative.host = relPath.shift())) {}
        if (!relative.host) {
          relative.host = "";
        }
        if (!relative.hostname) {
          relative.hostname = "";
        }
        if (relPath[0] !== "") {
          relPath.unshift("");
        }
        if (relPath.length < 2) {
          relPath.unshift("");
        }
        result.pathname = relPath.join("/");
      } else {
        result.pathname = relative.pathname;
      }
      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || "";
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port;
      if (result.pathname || result.search) {
        const p = result.pathname || "";
        const s = result.search || "";
        result.path = p + s;
      }
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }

    const isSourceAbs = result.pathname && result.pathname.charAt(0) === "/",
      isRelAbs =
        relative.host ||
        (relative.pathname && relative.pathname.charAt(0) === "/");
    let mustEndAbs =
      isRelAbs || isSourceAbs || (result.host && relative.pathname);
    const removeAllDots = mustEndAbs,
      relPath = (relative.pathname && relative.pathname.split("/")) || [],
      psychotic = result.protocol && !Url.slashedProtocol[result.protocol];
    let srcPath = (result.pathname && result.pathname.split("/")) || [];

    if (psychotic) {
      result.hostname = "";
      result.port = null;
      if (result.host) {
        if (srcPath[0] === "") {
          srcPath[0] = result.host;
        } else {
          srcPath.unshift(result.host);
        }
      }
      result.host = "";
      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;
        if (relative.host) {
          if (relPath[0] === "") {
            relPath[0] = relative.host;
          } else {
            relPath.unshift(relative.host);
          }
        }
        relative.host = null;
      }
      mustEndAbs =
        mustEndAbs && (relPath[0] === "" || srcPath[0] === "")
          ? true
          : mustEndAbs;
    }

    if (isRelAbs) {
      result.host =
        relative.host || relative.host === "" ? relative.host : result.host;
      result.hostname =
        relative.hostname || relative.hostname === ""
          ? relative.hostname
          : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath;
    } else if (relPath.length) {
      if (!srcPath) {
        srcPath = [];
      }
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (relative.search != null) {
      if (psychotic) {
        result.host = srcPath.shift();
        result.hostname = result.host;
        const authInHost =
          result.host && result.host.indexOf("@") > 0
            ? result.host.split("@")
            : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.hostname = authInHost.shift();
          result.host = result.hostname;
        }
      }
      result.search = relative.search;
      result.query = relative.query;
      if (result.pathname !== null || result.search !== null) {
        result.path =
          (result.pathname ? result.pathname : "") +
          (result.search ? result.search : "");
      }
      result.href = result.format();
      return result;
    }

    if (!srcPath.length) {
      result.pathname = null;
      if (result.search) {
        result.path = "/" + result.search;
      } else {
        result.path = null;
      }
      result.href = result.format();
      return result;
    }

    const last = srcPath.slice(-1)[0];
    const hasTrailingSlash =
      ((result.host || relative.host || srcPath.length > 1) &&
        (last === "." || last === "..")) ||
      last === "";

    let up = 0;
    for (let i = srcPath.length; i >= 0; i--) {
      const last = srcPath[i];
      if (last === ".") {
        srcPath.splice(i, 1);
      } else if (last === "..") {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }

    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift("..");
      }
    }

    if (
      mustEndAbs &&
      srcPath[0] !== "" &&
      (!srcPath[0] || srcPath[0].charAt(0) !== "/")
    ) {
      srcPath.unshift("");
    }

    if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
      srcPath.push("");
    }

    const isAbsolute =
      srcPath[0] === "" || (srcPath[0] && srcPath[0].charAt(0) === "/");

    if (psychotic) {
      result.hostname = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
      result.host = result.hostname;
      const authInHost =
        result.host && result.host.indexOf("@") > 0
          ? result.host.split("@")
          : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.hostname = authInHost.shift();
        result.host = result.hostname;
      }
    }

    mustEndAbs = mustEndAbs || String(result.host && srcPath.length);

    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift("");
    }

    if (srcPath.length > 0) {
      result.pathname = srcPath.join("/");
    } else {
      result.pathname = null;
      result.path = null;
    }

    if (result.pathname !== null || result.search !== null) {
      result.path =
        (result.pathname ? result.pathname : "") +
        (result.search ? result.search : "");
    }
    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  private parseHost(): void {
    const host = this.host;
    const port = Url.portPattern.exec(host);
    if (port) {
      this.port = port[0].substr(1);
      this.hostname = host.substr(0, host.length - port[0].length);
    } else {
      this.hostname = host;
    }
  }
}
