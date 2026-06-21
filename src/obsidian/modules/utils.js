"use strict";

// Utility functions and constants module

const Yl = /&(amp|lt|gt|quot);/g;
const $l = /[.?*+^$[\]\\(){}|-]/g;

/**
 * Decode HTML entities
 */
function Xl(e) {
  return e.replace(Yl, function (e) {
    switch (e) {
      case "&amp;":
        return "&";
      case "&lt;":
        return "<";
      case "&gt;":
        return ">";
      case "&quot;":
        return '"';
      default:
        return e;
    }
  });
}

/**
 * Encode HTML entities
 */
function Ql(e) {
  return e.replace(/[&<>"']/g, function (e) {
    switch (e) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return e;
    }
  });
}

/**
 * Escape regex special characters
 */
function Jl(e) {
  return e.replace($l, "\\$&");
}

/**
 * Get filename from path
 */
function getFilename(e) {
  if (!e) return "";
  const t = e.lastIndexOf("/");
  return t === -1 ? e : e.slice(t + 1);
}

/**
 * Get file extension
 */
function getExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Normalize path
 */
function normalizePath(e) {
  if (!e) return "";
  return e.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^(?:\.\/)+/, "");
}

/**
 * Check if path is absolute
 */
function iu(e) {
  return e.startsWith("/") || /^[a-zA-Z]:/.test(e);
}

/**
 * Get parent path
 */
function ru(e) {
  const t = e.lastIndexOf("/");
  return t === -1 ? "" : e.slice(0, t);
}

/**
 * Join paths
 */
function ou(e, ...t) {
  let n = e;
  for (const i of t) {
    if (i) {
      n = n ? n.replace(/\/$/, "") + "/" + i.replace(/^\//, "") : i;
    }
  }
  return n;
}

/**
 * Get relative path
 */
function su(e, t) {
  const n = e.split("/");
  const i = t.split("/");
  let r = 0;
  while (r < n.length && r < i.length && n[r] === i[r]) {
    r++;
  }
  const o = [];
  for (let s = r; s < i.length; s++) {
    o.push("..");
  }
  for (let s = r; s < n.length; s++) {
    o.push(n[s]);
  }
  return o.join("/");
}

/**
 * Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(e) {
  const t = atob(e);
  const n = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++) {
    n[i] = t.charCodeAt(i);
  }
  return n.buffer;
}

/**
 * ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer, ...args) {
  let e = buffer;
  if (buffer instanceof ArrayBuffer) {
    e = new Uint8Array(buffer);
  }
  let t = "";
  for (let n = 0; n < e.length; n++) {
    t += String.fromCharCode(e[n]);
  }
  return btoa(t);
}

/**
 * Hex to ArrayBuffer
 */
function hexToArrayBuffer(e) {
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < e.length; n += 2) {
    t[n / 2] = parseInt(e.substring(n, n + 2), 16);
  }
  return t.buffer;
}

/**
 * ArrayBuffer to Hex
 */
function arrayBufferToHex(e) {
  const t = new Uint8Array(e);
  let n = "";
  for (let i = 0; i < t.length; i++) {
    let r = t[i].toString(16);
    if (r.length === 1) {
      r = "0" + r;
    }
    n += r;
  }
  return n;
}

/**
 * Load module dynamically
 */
function loadModule(module) {
  return new Promise((resolve, reject) => {
    if (typeof require !== "undefined") {
      try {
        resolve(require(module));
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error("Require not available"));
    }
  });
}

module.exports = {
  Xl,
  Ql,
  Jl,
  getFilename,
  getExtension,
  normalizePath,
  iu,
  ru,
  ou,
  su,
  base64ToArrayBuffer,
  arrayBufferToBase64,
  hexToArrayBuffer,
  arrayBufferToHex,
  loadModule,
};
