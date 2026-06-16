var CcommandManager = (function () {
  function e(app) {
    this.commands = {};
    this.editorCommands = {};
    this.app = app;
  }
  e.prototype.addCommand = function (e) {
    var t = this;
    if (!(e.mobileOnly && !Platform.isMobile)) {
      (e.editorCallback || e.editorCheckCallback) &&
        ((e.checkCallback = function (n) {
          var i = t.app.workspace.activeEditor;
          if (!i) return null;
          if (e.allowPreview || i.getMode() !== "preview") {
            var r = i.editor,
              o = i;
            if (i instanceof MarkdownView) {
              if (i.inlineTitleEl.isActiveElement()) return;
              if (i.titleEl.isActiveElement()) return;
              if (!e.allowProperties && activeDocument.activeElement.closest(".metadata-container")) return;
            }
            return e.editorCheckCallback
              ? e.editorCheckCallback(n, r, o)
              : e.editorCallback
                ? (n || e.editorCallback(r, o), !0)
                : undefined;
          }
        }),
        (this.editorCommands[e.id] = e));
      e.showOnMobileToolbar && (this.editorCommands[e.id] = e);
      this.commands[e.id] = e;
      e.hotkeys && this.app.hotkeyManager.addDefaultHotkeys(e.id, e.hotkeys);
    }
  };
  e.prototype.removeCommand = function (e) {
    this.commands.hasOwnProperty(e) && this.app.hotkeyManager.removeDefaultHotkeys(e);
    delete this.commands[e];
    delete this.editorCommands[e];
  };
  e.prototype.findCommand = function (e) {
    return this.commands[e];
  };
  e.prototype.listCommands = function () {
    return Object.values(this.commands).filter(function (e) {
      if (!e.checkCallback) return !0;
      try {
        return e.checkCallback(!0);
      } catch (t) {
        console.log("Command failed to execute: ", e.id);
        console.error(t);
        return !1;
      }
    });
  };
  e.prototype.executeCommandById = function (e, t) {
    var n = this.findCommand(e);
    return !!n && this.executeCommand(n, t);
  };
  e.prototype.executeCommand = function (e, t) {
    this.app.lastEvent = t || null;
    try {
      lQ(e);
    } catch (t) {
      console.log("Command failed to execute: ", e.id);
      console.error(t);
      return !1;
    }
    return !0;
  };
  return e;
})();
const algorithmName = "AES-GCM";
function pQ(e) {
  return window.crypto.subtle.importKey("raw", e, algorithmName, !1, ["encrypt", "decrypt"]);
}
function dQ(e, t, n) {
  return __awaiter(this, undefined, Promise, function () {
    var i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          n || (n = crypto.getRandomValues(new Uint8Array(12)));
          return [
            4,
            window.crypto.subtle.encrypt(
              {
                name: algorithmName,
                iv: n,
              },
              t,
              e,
            ),
          ];
        case 1:
          i = a.sent();
          r = new ArrayBuffer(n.byteLength + i.byteLength);
          (o = new Uint8Array(r)).set(new Uint8Array(n), 0);
          o.set(new Uint8Array(i), n.byteLength);
          return [2, r];
      }
    });
  });
}
function fQ(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n, i;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (e.byteLength < 12) throw new Error("Encrypted data is bad");
          return e.byteLength === 12
            ? [2, new ArrayBuffer(0)]
            : ((n = new Uint8Array(e, 0, 12)),
              (i = new Uint8Array(e, 12)),
              [
                4,
                window.crypto.subtle.decrypt(
                  {
                    name: algorithmName,
                    iv: n,
                  },
                  t,
                  i,
                ),
              ]);
        case 1:
          return [2, r.sent()];
      }
    });
  });
}
var mQ = (function (e) {
  function t(n) {
    var i = e.call(this, n) || this;
    Object.setPrototypeOf(i, t.prototype);
    return i;
  }
  __extends(t, e);
  return t;
})(Error);
function gQ(e) {
  for (var t = 0; t < e.length; t++) e[t] = 0;
  return e;
}
function vQ(e, t) {
  for (var n = 0; n < t.length; n++) e[n] ^= t[n];
}
var yQ = (function () {
  function e() {
    this.data = new Uint8Array(e.SIZE);
  }
  e.prototype.clear = function () {
    gQ(this.data);
  };
  e.prototype.clone = function () {
    var t = new e();
    t.copy(this);
    return t;
  };
  e.prototype.copy = function (e) {
    this.data.set(e.data);
  };
  e.prototype.dbl = function () {
    for (var t, n, i = 0, r = e.SIZE - 1; r >= 0; r--) {
      var o = (this.data[r] >>> 7) & 255;
      this.data[r] = (this.data[r] << 1) | i;
      i = o;
    }
    this.data[e.SIZE - 1] ^= ((t = i), (n = e.R), (~(t - 1) & n) | ((t - 1) & 0));
    i = 0;
  };
  e.SIZE = 16;
  e.R = 135;
  return e;
})();
const bQ = yQ;
var wQ = window.crypto.subtle,
  kQ = (function () {
    function e(key) {
      this.key = key;
    }
    e.importKey = function (t, salt) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                wQ.deriveKey(
                  {
                    name: "HKDF",
                    salt: salt,
                    info: new TextEncoder().encode("ObsidianAesSivEnc"),
                    hash: "SHA-256",
                  },
                  t,
                  {
                    name: "AES-CTR",
                    length: 256,
                  },
                  !1,
                  ["encrypt"],
                ),
              ];
            case 1:
              return [2, new e(i.sent())];
          }
        });
      });
    };
    e.prototype.encryptCtr = function (counter, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                wQ.encrypt(
                  {
                    name: "AES-CTR",
                    counter: counter,
                    length: 16,
                  },
                  this.key,
                  t,
                ),
              ];
            case 1:
              n = i.sent();
              return [2, new Uint8Array(n)];
          }
        });
      });
    };
    return e;
  })();
const CQ = kQ;
var EQ = (function () {
  function e(_key) {
    this._key = _key;
    this._iv = new bQ();
    this._emptyPromise = Promise.resolve(this);
  }
  e.importKey = function (t, salt) {
    return __awaiter(this, undefined, Promise, function () {
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            return [
              4,
              wQ.deriveKey(
                {
                  name: "HKDF",
                  salt: salt,
                  info: new TextEncoder().encode("ObsidianAesSivMac"),
                  hash: "SHA-256",
                },
                t,
                {
                  name: "AES-CBC",
                  length: 256,
                },
                !1,
                ["encrypt"],
              ),
            ];
          case 1:
            return [2, new e(i.sent())];
        }
      });
    });
  };
  e.prototype.clear = function () {
    return this;
  };
  e.prototype.encryptBlock = function (e) {
    return __awaiter(this, undefined, Promise, function () {
      var t, n;
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            t = {
              name: "AES-CBC",
              iv: this._iv.data,
            };
            return [4, wQ.encrypt(t, this._key, e.data)];
          case 1:
            n = i.sent();
            e.data.set(new Uint8Array(n, 0, bQ.SIZE));
            return [2, this._emptyPromise];
        }
      });
    });
  };
  return e;
})();
const SQ = EQ;
var MQ = (function () {
    function e(_cipher, _subkey1, _subkey2) {
      this._cipher = _cipher;
      this._subkey1 = _subkey1;
      this._subkey2 = _subkey2;
      this._bufferPos = 0;
      this._finished = false;
      this._buffer = new bQ();
    }
    e.importKey = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return [4, SQ.importKey(t, n)];
            case 1:
              i = a.sent();
              r = new bQ();
              return [4, i.encryptBlock(r)];
            case 2:
              a.sent();
              r.dbl();
              (o = r.clone()).dbl();
              return [
                2,
                function () {
                  return new e(i, r, o);
                },
              ];
          }
        });
      });
    };
    e.prototype.update = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              if (this._finished) throw new Error("Cannot update finished CMAC");
              if (((t = bQ.SIZE - this._bufferPos), (n = 0), !((i = e.length) > t))) return [3, 2];
              for (r = 0; r < t; r++) this._buffer.data[this._bufferPos + r] ^= e[r];
              i -= t;
              n += t;
              return [4, this._cipher.encryptBlock(this._buffer)];
            case 1:
              o.sent();
              this._bufferPos = 0;
              o.label = 2;
            case 2:
              if (!(i > bQ.SIZE)) return [3, 4];
              for (r = 0; r < bQ.SIZE; r++) this._buffer.data[r] ^= e[n + r];
              i -= bQ.SIZE;
              n += bQ.SIZE;
              return [4, this._cipher.encryptBlock(this._buffer)];
            case 3:
              o.sent();
              return [3, 2];
            case 4:
              for (r = 0; r < i; r++) this._buffer.data[this._bufferPos++] ^= e[n + r];
              return [2, this];
          }
        });
      });
    };
    e.prototype.finish = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this._finished
                ? [3, 2]
                : ((e = this._bufferPos < bQ.SIZE ? this._subkey2 : this._subkey1),
                  vQ(this._buffer.data, e.data),
                  this._bufferPos < bQ.SIZE && (this._buffer.data[this._bufferPos] ^= 128),
                  [4, this._cipher.encryptBlock(this._buffer)]);
            case 1:
              t.sent();
              this._finished = true;
              t.label = 2;
            case 2:
              return [2, this._buffer.data];
          }
        });
      });
    };
    return e;
  })(),
  xQ = (function () {
    function e(cmacFactory, _ctr) {
      this.cmacFactory = cmacFactory;
      this._ctr = _ctr;
    }
    e.importKey = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return [4, MQ.importKey(t, n)];
            case 1:
              i = o.sent();
              return [4, CQ.importKey(t, n)];
            case 2:
              r = o.sent();
              return [2, new e(i, r)];
          }
        });
      });
    };
    e.prototype.seal = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              t = bQ.SIZE + e.length;
              n = new Uint8Array(t);
              return [4, this._s2v(e)];
            case 1:
              i = a.sent();
              n.set(i);
              TQ(i);
              o = (r = n).set;
              return [4, this._ctr.encryptCtr(i, e)];
            case 2:
              o.apply(r, [a.sent(), i.length]);
              return [2, n];
          }
        });
      });
    };
    e.prototype.open = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              if (e.length < bQ.SIZE) throw new mQ("AES-SIV: ciphertext is truncated");
              t = e.subarray(0, bQ.SIZE);
              (n = new Uint8Array(bQ.SIZE)).set(t);
              TQ(n);
              return [4, this._ctr.encryptCtr(n, e.subarray(bQ.SIZE))];
            case 1:
              i = o.sent();
              return [4, this._s2v(i)];
            case 2:
              if (
                ((r = o.sent()),
                (s = t),
                (a = r).length === 0 ||
                  s.length === 0 ||
                  (function (e, t) {
                    if (e.length !== t.length) return 0;
                    for (var n = 0, i = 0; i < e.length; i++) n |= e[i] ^ t[i];
                    return 1 & ((n - 1) >>> 8);
                  })(a, s) === 0)
              )
                throw (gQ(i), new mQ("AES-SIV: ciphertext verification failure!"));
              return [2, i];
          }
          var a, s;
        });
      });
    };
    e.prototype._s2v = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t = this.cmacFactory();
              n = new bQ();
              i = new bQ();
              return [4, t.update(n.data)];
            case 1:
              s.sent();
              o = (r = i.data).set;
              return [4, t.finish()];
            case 2:
              o.apply(r, [s.sent()]);
              t = this.cmacFactory();
              n.clear();
              return e.length >= bQ.SIZE
                ? ((a = e.length - bQ.SIZE), n.data.set(e.subarray(a)), [4, t.update(e.subarray(0, a))])
                : [3, 4];
            case 3:
              s.sent();
              return [3, 5];
            case 4:
              n.data.set(e);
              n.data[e.length] = 128;
              i.dbl();
              s.label = 5;
            case 5:
              vQ(n.data, i.data);
              return [4, t.update(n.data)];
            case 6:
              s.sent();
              return [2, t.finish()];
          }
        });
      });
    };
    return e;
  })();
function TQ(e) {
  e[e.length - 8] &= 127;
  e[e.length - 4] &= 127;
}
var DQ = 32768,
  AQ = {
    N: DQ,
    r: 8,
    p: 1,
    maxmem: 67108864,
  };
function PQ(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          e = e.normalize("NFKC");
          t = t.normalize("NFKC");
          return (n = window.require && window.require("crypto"))
            ? [
                4,
                new Promise(function (i, r) {
                  n.scrypt(Buffer.from(e, "utf8"), Buffer.from(t, "utf8"), 32, AQ, function (e, t) {
                    e ? r(e) : i(t);
                  });
                }),
              ]
            : [3, 2];
        case 1:
          return [2, lu(i.sent())];
        case 2:
          return [4, window.scrypt.scrypt(new Uint8Array(df(e)), new Uint8Array(df(t)), DQ, 8, 1, 32)];
        case 3:
          return [2, pf(i.sent())];
      }
    });
  });
}
function LQ(e, t, n) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (i) {
      switch (e) {
        case 0:
          return [2, OQ.init(t)];
        case 2:
        case 3:
          return [2, FQ.init(t, n, e)];
        default:
          throw new Error("Encryption version not supported");
      }
      return [2];
    });
  });
}
function IQ(e, t, n) {
  return __awaiter(this, undefined, Promise, function () {
    var i, r, o, a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          switch (n) {
            case 0:
              return [3, 1];
            case 2:
            case 3:
              return [3, 3];
          }
          return [3, 7];
        case 1:
          i = arrayBufferToHex;
          return [4, sha256Digest(e)];
        case 2:
          return [2, i.apply(undefined, [s.sent()])];
        case 3:
          return [4, window.crypto.subtle.importKey("raw", e, "HKDF", !1, ["deriveKey"])];
        case 4:
          r = s.sent();
          return [
            4,
            window.crypto.subtle.deriveKey(
              {
                name: "HKDF",
                salt: df(t),
                info: df("ObsidianKeyHash"),
                hash: "SHA-256",
              },
              r,
              {
                name: "AES-CBC",
                length: 256,
              },
              !0,
              ["encrypt"],
            ),
          ];
        case 5:
          o = s.sent();
          a = arrayBufferToHex;
          return [4, window.crypto.subtle.exportKey("raw", o)];
        case 6:
          return [2, a.apply(undefined, [s.sent()])];
        case 7:
          throw new Error("Encryption version not supported");
      }
    });
  });
}
var OQ = (function () {
    function e(keyHash, cryptoKey) {
      this.encryptionVersion = 0;
      this.keyHash = keyHash;
      this.cryptoKey = cryptoKey;
    }
    e.init = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              if (t.byteLength !== 32) throw new Error("Invalid encryption key");
              i = arrayBufferToHex;
              return [4, sha256Digest(t)];
            case 1:
              n = i.apply(undefined, [o.sent()]);
              return [4, pQ(t)];
            case 2:
              r = o.sent();
              return [2, new e(n, r)];
          }
        });
      });
    };
    e.prototype.deterministicEncodeStr = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return [4, sha256Digest((t = df(e)))];
            case 1:
              n = o.sent();
              i = new Uint8Array(n, 0, 12);
              r = arrayBufferToHex;
              return [4, dQ(t, this.cryptoKey, i)];
            case 2:
              return [2, r.apply(undefined, [o.sent()])];
          }
        });
      });
    };
    e.prototype.deterministicDecodeStr = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = hexToArrayBuffer(e);
              n = ff;
              return [4, fQ(t, this.cryptoKey)];
            case 1:
              return [2, n.apply(undefined, [i.sent()])];
          }
        });
      });
    };
    e.prototype.encrypt = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [2, dQ(e, this.cryptoKey)];
        });
      });
    };
    e.prototype.decrypt = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [2, fQ(e, this.cryptoKey)];
        });
      });
    };
    return e;
  })(),
  FQ = (function () {
    function e(keyHash, cryptoKey, siv, encryptionVersion) {
      if (
        ((this.keyHash = keyHash),
        (this.cryptoKey = cryptoKey),
        (this.siv = siv),
        encryptionVersion !== 2 && encryptionVersion !== 3)
      )
        throw new Error("Invalid encryption version");
      this.encryptionVersion = encryptionVersion;
    }
    e.init = function (t, n, i) {
      return __awaiter(this, undefined, Promise, function () {
        var r, salt, a, s, l, c, u;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              if (t.byteLength !== 32) throw new Error("Invalid encryption key");
              return [4, window.crypto.subtle.importKey("raw", t, "HKDF", !1, ["deriveKey"])];
            case 1:
              r = h.sent();
              salt = df(n);
              return [
                4,
                window.crypto.subtle.deriveKey(
                  {
                    name: "HKDF",
                    salt: salt,
                    info: df("ObsidianKeyHash"),
                    hash: "SHA-256",
                  },
                  r,
                  {
                    name: "AES-CBC",
                    length: 256,
                  },
                  !0,
                  ["encrypt"],
                ),
              ];
            case 2:
              a = h.sent();
              l = arrayBufferToHex;
              return [4, window.crypto.subtle.exportKey("raw", a)];
            case 3:
              s = l.apply(undefined, [h.sent()]);
              return [4, xQ.importKey(r, salt)];
            case 4:
              c = h.sent();
              return [
                4,
                window.crypto.subtle.deriveKey(
                  {
                    name: "HKDF",
                    salt: new Uint8Array(),
                    info: df("ObsidianAesGcm"),
                    hash: "SHA-256",
                  },
                  r,
                  {
                    name: "AES-GCM",
                    length: 256,
                  },
                  !1,
                  ["encrypt", "decrypt"],
                ),
              ];
            case 5:
              u = h.sent();
              return [2, new e(s, u, c, i)];
          }
        });
      });
    };
    e.prototype.deterministicEncodeStr = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              t = df(e);
              return [4, this.siv.seal(new Uint8Array(t))];
            case 1:
              return [2, arrayBufferToHex(pf(n.sent()))];
          }
        });
      });
    };
    e.prototype.deterministicDecodeStr = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              t = hexToArrayBuffer(e);
              return [4, this.siv.open(new Uint8Array(t))];
            case 1:
              return [2, ff(pf(n.sent()))];
          }
        });
      });
    };
    e.prototype.encrypt = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [2, dQ(e, this.cryptoKey)];
        });
      });
    };
    e.prototype.decrypt = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [2, fQ(e, this.cryptoKey)];
        });
      });
    };
    return e;
  })(),
  NQ = "https://" + [String.fromCharCode(97, 112, 105), "obsidian", "md"].join(".");
if (isDev) {
  NQ = "http://127.0.0.1:3000";
}
var RQ = "obsidian-account",
  BQ = window.fetch,
  VQ = (function (e) {
    function t(response) {
      var i = e.call(this, response.error) || this;
      i.response = response;
      i.error = response.error;
      Object.setPrototypeOf(i, t.prototype);
      return i;
    }
    __extends(t, e);
    return t;
  })(Error);
function HQ(e, t) {
  return __awaiter(this, undefined, undefined, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return [
            4,
            BQ(NQ + e, {
              method: "POST",
              body: JSON.stringify(t),
              headers: {
                "Content-Type": "application/json",
              },
            }),
          ];
        case 1:
          return [4, i.sent().json()];
        case 2:
          if ("error" in (n = i.sent())) throw new VQ(n);
          return [2, n];
      }
    });
  });
}
function zQ(email, password, namen0, next) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (r) {
      return [
        2,
        HQ("/user/signup", {
          email: email,
          password: password,
          name: namen0,
          next: next,
        }),
      ];
    });
  });
}
function qQ(email) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (t) {
      return [
        2,
        HQ("/user/forgetpass", {
          email: email,
          captcha: "captcha",
        }),
      ];
    });
  });
}
function WQ(email, next) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (n) {
      return [
        2,
        HQ("/user/resendconfirmation", {
          email: email,
          next: next,
        }),
      ];
    });
  });
}
function UQ(e, token) {
  return __awaiter(this, undefined, Promise, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return [
            4,
            HQ("/user/authtoken", {
              token: token,
            }),
          ];
        case 1:
          (n = i.sent()).token &&
            ((e.token = n.token), (e.email = n.email), (e.name = n.name), (e.license = n.license), e.save());
          return [2, n];
      }
    });
  });
}
function _Q(token) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (t) {
      return [
        2,
        HQ("/subscription/sync/signup-mobile", {
          token: token,
        }),
      ];
    });
  });
}
function jQ(e, email, password, i) {
  return __awaiter(this, undefined, Promise, function () {
    var r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return [
            4,
            HQ("/user/signin", {
              email: email,
              password: password,
              mfa: i,
            }),
          ];
        case 1:
          (r = o.sent()).token &&
            ((e.token = r.token), (e.email = r.email), (e.name = r.name), (e.license = r.license), e.save());
          return [2, r];
      }
    });
  });
}
function GQ(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          n.trys.push([0, 2, , 3]);
          return [
            4,
            HQ("/user/signout", {
              token: e.token,
            }),
          ];
        case 1:
          n.sent();
          return [3, 3];
        case 2:
          if ((t = n.sent()).message !== "Not logged in") throw t;
          return [3, 3];
        case 3:
          e.token = "";
          e.email = "";
          e.name = "";
          e.license = "";
          e.save();
          return [2];
      }
    });
  });
}
function KQ(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          if (!e.token) return [2, null];
          i.label = 1;
        case 1:
          i.trys.push([1, 3, , 4]);
          return [
            4,
            HQ("/user/info", {
              token: e.token,
            }),
          ];
        case 2:
          t = i.sent();
          e.email = t.email;
          e.name = t.name;
          e.license = t.license;
          e.save();
          return [2, t];
        case 3:
          throw (
            (n = i.sent()).message === "Not logged in" &&
              ((e.email = null), (e.name = null), (e.token = null), (e.license = null), e.save()),
            n
          );
        case 4:
          return [2];
      }
    });
  });
}
function YQ(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          if (!e.key) return [2];
          i.label = 1;
        case 1:
          i.trys.push([1, 3, , 4]);
          return [
            4,
            HQ("/subscription/business", {
              key: e.key,
            }),
          ];
        case 2:
          t = i.sent();
          e.keyValidation = "valid";
          e.company = t.company;
          e.expiry = t.expiry;
          e.seats = t.seats;
          e.save();
          return [3, 4];
        case 3:
          (n = i.sent()) instanceof VQ && ((e.key = null), (e.keyValidation = n.error), e.save());
          return [3, 4];
        case 4:
          return [2];
      }
    });
  });
}
function ZQ(token, host) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [
            4,
            HQ("/vault/regions", {
              token: token,
              host: host,
            }),
          ];
        case 1:
          return [2, n.sent().regions];
      }
    });
  });
}
function XQ(e) {
  if (undefined === e.encryption_version) {
    e.encryption_version = 0;
  }
}
function QQ(token) {
  return __awaiter(this, undefined, Promise, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return [
            4,
            HQ("/vault/list", {
              token: token,
              supported_encryption_version: 3,
            }),
          ];
        case 1:
          (t = n.sent()).vaults.forEach(XQ);
          t.shared.forEach(XQ);
          return [2, t];
      }
    });
  });
}
function $Q(token, namet0, keyhash, salt, region, encryption_version) {
  return __awaiter(this, undefined, Promise, function () {
    var a;
    return __generator(this, function (s) {
      switch (s.label) {
        case 0:
          return [
            4,
            HQ("/vault/create", {
              token: token,
              name: namet0,
              keyhash: keyhash,
              salt: salt,
              region: region,
              encryption_version: encryption_version,
            }),
          ];
        case 1:
          XQ((a = s.sent()));
          return [2, a];
      }
    });
  });
}
function JQ(token, vault_uid, keyhash, salt, region, encryption_version) {
  return HQ("/vault/migrate", {
    token: token,
    vault_uid: vault_uid,
    keyhash: keyhash,
    salt: salt,
    region: region,
    encryption_version: encryption_version,
  });
}
function e$(token, vault_uid, namen0) {
  return HQ("/vault/rename", {
    token: token,
    vault_uid: vault_uid,
    name: namen0,
  });
}
function t$(token, vault_uid, share_uid) {
  return HQ("/vault/share/remove", {
    token: token,
    vault_uid: vault_uid,
    share_uid: share_uid,
  });
}
function n$(token, vault_uid, keyhash, host, encryption_version) {
  return HQ("/vault/access", {
    token: token,
    vault_uid: vault_uid,
    keyhash: keyhash,
    host: host,
    encryption_version: encryption_version,
  });
}
function i$(token, site_uid) {
  return HQ("/publish/delete", {
    token: token,
    site_uid: site_uid,
  });
}
function r$(token, site_uid, email) {
  return HQ("/publish/share/invite", {
    token: token,
    site_uid: site_uid,
    email: email,
  });
}
function o$(token, site_uid, share_uid) {
  return HQ("/publish/share/remove", {
    token: token,
    site_uid: site_uid,
    share_uid: share_uid,
  });
}
function a$(token) {
  return HQ("/subscription/list", {
    token: token,
  });
}
var s$,
  l$,
  c$ = new ((function () {
    function e() {
      this.keyValidation = "";
      this.company = "";
      this.expiry = 0;
      this.seats = 0;
      try {
        var e = JSON.parse(localStorage.getItem(RQ));
        this.email = e.email;
        this.name = e.name;
        this.token = e.token;
        this.license = e.license;
        this.key = e.key;
      } catch (e) {}
    }
    e.prototype.save = function () {
      var e = {
        email: this.email,
        name: this.name,
        token: this.token,
        license: this.license,
        key: this.key,
      };
      localStorage.setItem(RQ, JSON.stringify(e));
    };
    e.prototype.setKey = function (key) {
      this.key = key;
      this.save();
    };
    return e;
  })())();
!(function (e) {
  e.Heavy = "HEAVY";
  e.Medium = "MEDIUM";
  e.Light = "LIGHT";
})(s$ || (s$ = {}));
(function (e) {
  e.Success = "SUCCESS";
  e.Warning = "WARNING";
  e.Error = "ERROR";
})(l$ || (l$ = {}));
var u$ = ["image", "audio", "pdf", "video"],
  h$ = ["app", "appearance", "appearance-data", "hotkey", "core-plugin", "core-plugin-data"],
  p$ = "";
function d$() {
  var Sf = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?()";
  return (function (e) {
    for (var t = [], n = 0; n < e; n++) t.push(Sf.charAt(Math.floor(73 * Math.random())));
    return t.join("");
  })(20);
}
function f$(e, t, n) {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return [4, PQ(e, t)];
        case 1:
          return [4, IQ(i.sent(), t, n)];
        case 2:
          return [2, i.sent()];
      }
    });
  });
}
function m$(e, t, n, i, r) {
  return __awaiter(this, undefined, undefined, function () {
    var o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          return [4, f$(t, n, r)];
        case 1:
          o = a.sent();
          return [4, n$(c$.token, e, o, i, r)];
        case 2:
          a.sent();
          return [2];
      }
    });
  });
}
if (isNotWeb) {
  __awaiter(undefined, undefined, undefined, function () {
    var e;
    return __generator(this, function (t) {
      switch (t.label) {
        case 0:
          return [4, capacitorDevicePlugin.getInfo()];
        case 1:
          e = t.sent();
          p$ = e.name;
          return [2];
      }
    });
  });
}
var g$ = "obsidian://";
function v$(e) {
  if (!e.startsWith(g$)) return null;
  console.log("Received callback URL", e);
  var t = {};
  if ((e = e.substr(11)).startsWith("vault/")) {
    var n = (e = e.substr(6)).split("/").map(function (e) {
      return decodeURIComponent(e);
    });
    t.action = "open";
    t.vault = n[0];
    t.file = n.slice(1).join("/");
  } else {
    var i = "",
      hash = "",
      o = e.indexOf("?"),
      a = e.indexOf("#", Math.max(0, o));
    a >= 0 && ((hash = e.substr(a + 1)), (e = e.substr(0, a)), (t.hash = hash));
    o >= 0 && ((i = e.substr(o + 1)), (e = e.substr(0, o)));
    for (var s = 0, l = i.split("&"); s < l.length; s++) {
      var c = "true";
      (n = l[s].split("=")).length > 1 && (c = decodeURIComponent(n[1]));
      t[decodeURIComponent(n[0])] = c;
    }
    t.action = e.replace(/\/+$/g, "");
  }
  return t;
}
function y$(e) {
  var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttrs({
    viewBox: "0 0 512 512",
    width: String(e),
    height: String(e),
    fill: "none",
  });
  t.innerHTML =
    '<path d="M355.662 428.646C353.2 446.929 335.311 461.212 317.533 456.281C292.203 449.301 262.874 438.415 236.484 436.387C233.004 436.119 196.037 433.316 196.037 433.316C189.498 432.85 183.36 429.993 178.793 425.29L109.1 353.516C101.484 345.673 99.4221 333.977 103.898 324.002C103.898 324.002 146.992 229.286 148.593 224.361C150.193 219.435 156.067 176.476 159.548 153.397C160.47 147.281 163.49 141.675 168.088 137.538L250.533 63.3697C262.003 53.0514 279.807 54.5804 289.349 66.7034L358.607 154.688C362.526 159.668 364.534 165.856 364.563 172.192C364.642 188.861 366.018 223.085 375.233 245.128C384.199 266.569 400.652 289.725 409.251 301.119C412.551 305.492 413.056 311.406 410.269 316.122C404.2 326.398 392.209 346.128 375.233 371.443C363.53 388.897 358.107 410.473 355.662 428.646Z" fill="currentColor"/><path d="M186.206 430.921C251.142 299.269 182.648 242.339 144.398 218.766" stroke="#000" stroke-width="12"/><path d="M374.343 386.444C332.98 289.929 272.491 288.595 210.224 303.717" stroke="#000" stroke-width="12"/><path d="M274.27 297.045C212.447 142.266 322.305 143.6 283.61 52.8673" stroke="#000" stroke-width="12"/>';
  return t;
}
var b$ = i18nProxy.interface.startScreen.mobile;
function w$(e, t) {
  for (var n = /(\*\*(.*?)\*\*)/g, i = 0, r = t.split("\n"); i < r.length; i++) {
    for (var o = r[i], a = 0, s = null, l = e.createEl("p"); (s = n.exec(o)) !== null; ) {
      a < s.index && l.appendText(o.slice(a, s.index));
      l.createEl("strong", {
        text: s[2],
      });
      a = n.lastIndex;
    }
    if (a < o.length) {
      l.appendText(o.slice(a));
    }
  }
}
var k$ = (function () {
    function e() {
      var e = this;
      this.requiresAuth = false;
      this.title = "";
      var t = (this.contentEl = createDiv("mobile-onboarding-screen"));
      this.titleEl = t.createEl("h1", {
        text: this.getTitle(),
      });
      this.formEl = t.createEl("form", {
        attr: {
          id: "form",
        },
      });
      this.footerEl = this.contentEl.createEl("footer", "", function (e) {
        e.createDiv({
          cls: "mod-version",
          text: apiVersion,
        });
      });
      this.formEl.addEventListener("submit", function (t) {
        t.preventDefault();
        var n = e.contentEl.find("button.mod-cta");
        if (n) {
          n.click();
        }
      });
    }
    e.prototype.onClose = function () {};
    return e;
  })(),
  C$ = (function () {
    function e(e) {
      this.helpEl = null;
      this.containerEl = e.createEl("p", "form-field");
      this.labelEl = this.containerEl.createEl("label");
    }
    e.prototype.setName = function (e) {
      this.labelEl.setText(e);
      return this;
    };
    e.prototype.setHelp = function (texte0) {
      this.helpEl
        ? this.helpEl.setText(texte0)
        : (this.helpEl = this.containerEl.createDiv({
            cls: "form-field-help",
            text: texte0,
          }));
      return this;
    };
    e.prototype.addText = function (e) {
      e(new TextComponent(this.containerEl));
      return this;
    };
    e.prototype.addDropdown = function (e) {
      e(new DropdownComponent(this.containerEl));
      return this;
    };
    e.prototype.addToggle = function (e) {
      e(new ToggleComponent(this.containerEl));
      return this;
    };
    e.prototype.addButton = function (e) {
      e(new ButtonComponent(this.containerEl));
      return this;
    };
    return e;
  })(),
  E$ = (function () {
    function e(e) {
      this.options = {};
      this.containerEl = e.createDiv("mobile-onboarding-radio-group");
    }
    e.prototype.addOption = function (e, t) {
      var n = this,
        i = new S$(this.containerEl);
      t(i.contentEl);
      this.options[e] = i;
      i.containerEl.addEventListener("click", function (t) {
        t.preventDefault();
        n.setValue(e);
      });
      return this;
    };
    e.prototype.onChange = function (onChangeCb) {
      this.onChangeCb = onChangeCb;
      return this;
    };
    e.prototype.getValue = function () {
      return this.value;
    };
    e.prototype.setValue = function (value) {
      var t, n, i;
      (t = this.options[this.value]) === null || undefined === t || t.setSelected(!1);
      (n = this.options[value]) === null || undefined === n || n.setSelected(!0);
      this.value = value;
      (i = this.onChangeCb) === null || undefined === i || i.call(this, value);
      return this;
    };
    return e;
  })(),
  S$ = (function () {
    function e(e) {
      var t = (this.containerEl = e.createDiv({
        cls: "mobile-onboarding-radio-option",
        attr: {
          tabIndex: 0,
        },
      }));
      t.createDiv({
        cls: "mobile-onboarding-radio-button",
      });
      this.contentEl = t.createDiv({
        cls: "mobile-onboarding-radio-content",
      });
    }
    e.prototype.setSelected = function (e) {
      this.containerEl.toggleClass("is-selected", e);
    };
    return e;
  })(),
  M$ = (function (e) {
    function t() {
      var t = e.call(this) || this,
        n = y$(64);
      n.addClass("logo");
      t.contentEl.prepend(n);
      w$(t.formEl, b$.labelStartScreenDesc());
      t.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optionCreate())
          .onClick(function () {
            return t.controller.goTo(new x$());
          });
        new ButtonComponent(e).setButtonText(b$.optionUseExisting()).onClick(function () {
          return t.controller.goTo(new B$());
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelStartScreen();
    };
    return t;
  })(k$),
  x$ = (function (e) {
    function t() {
      var t = e.call(this) || this,
        n = y$(64);
      n.addClass("logo");
      t.contentEl.prepend(n);
      w$(t.formEl, b$.labelSyncIntroDesc());
      t.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optionSkip())
          .onClick(function () {
            return t.controller.goTo(new T$("none"));
          });
        new ButtonComponent(e).setButtonText(b$.optionSetupSync()).onClick(function () {
          return t.controller.goTo(new R$());
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncIntro();
    };
    return t;
  })(k$),
  T$ = (function (e) {
    function t(t, n) {
      var i = e.call(this) || this,
        r = n ? n.name : "",
        o = new C$(i.formEl).setName(b$.labelVaultName());
      new TextComponent(o.containerEl)
        .setPlaceholder(b$.placeholderVaultName())
        .setValue(r)
        .onChange(function (e) {
          return (r = e);
        });
      var a = "external";
      if (isAndroidPlatform) {
        var s = new C$(i.formEl).setName(b$.labelVaultLocation());
        new E$(s.containerEl)
          .addOption("external", function (e) {
            e.createDiv(
              {
                cls: "mobile-onboarding-radio-option-title",
                text: "Device storage",
              },
              function (e) {
                e.createSpan({
                  cls: "flair",
                  text: b$.labelRecommended(),
                });
              },
            );
            e.createEl(
              "ul",
              {
                cls: "mobile-onboarding-radio-option-desc",
              },
              function (e) {
                e.createEl("li", {
                  text: "Allows Obsidian data to be accessed by other apps.",
                });
                hJ ||
                  e.createEl("li", {
                    text: "Requires additional permissions.",
                  });
              },
            );
          })
          .addOption("app", function (e) {
            e.createDiv({
              cls: "mobile-onboarding-radio-option-title",
              text: "App storage",
            });
            e.createEl(
              "ul",
              {
                cls: "mobile-onboarding-radio-option-desc",
              },
              function (e) {
                e.createEl("li", {
                  text: "Your data will not be accessible to other apps.",
                });
                e.createEl("li", {
                  text: "Android will delete your data if you uninstall Obsidian.",
                });
              },
            );
          })
          .setValue(a)
          .onChange(function (e) {
            a = e;
          });
      }
      i.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optionCreate())
          .onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e,
                i,
                o,
                s,
                l = this;
              return __generator(this, function (c) {
                switch (c.label) {
                  case 0:
                    if (r.trim() === "") {
                      new Notice(b$.msgNameRequired());
                      return [2];
                    }
                    if (((e = ""), !isAndroidPlatform || a === "app")) return [3, 9];
                    c.label = 1;
                  case 1:
                    c.trys.push([1, 8, , 9]);
                    return hJ
                      ? [3, 3]
                      : [
                          4,
                          new Promise(function (e) {
                            return l.controller.goTo(new U$(e));
                          }),
                        ];
                  case 2:
                    c.sent();
                    c.label = 3;
                  case 3:
                    return hJ ? [4, filesystemPlugin.choose()] : [2];
                  case 4:
                    return (i = c.sent()) && i.path ? ((o = i.path), [4, this.controller.isDirectory(o)]) : [3, 6];
                  case 5:
                    return c.sent() ? ((e = o), [3, 7]) : (new Notice(b$.msgInvalidVault()), [2]);
                  case 6:
                    return [2];
                  case 7:
                    return [3, 9];
                  case 8:
                    ((s = c.sent()) && s.message && s.message.contains("canceled")) || new Notice(s.toString());
                    return [2];
                  case 9:
                    t === "obsidian-sync"
                      ? n
                        ? this.controller.goTo(new P$(r, e, n))
                        : this.controller.goTo(new D$(r, e))
                      : this.controller.createVault(r, e, t === "icloud");
                    return [2];
                }
              });
            });
          });
      });
      return i;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelVaultCreate();
    };
    return t;
  })(k$),
  D$ = (function (e) {
    function t(t, n) {
      var i,
        r = e.call(this) || this;
      r.requiresAuth = true;
      w$(r.formEl, b$.labelSyncSetupDesc());
      var o = "";
      new C$(r.formEl).setName(b$.labelVaultName()).addText(function (e) {
        return e
          .setPlaceholder(b$.placeholderVaultName())
          .setValue(t)
          .onChange(function (e) {
            return (t = e);
          });
      });
      new C$(r.formEl)
        .setName(b$.labelRegionSelection())
        .addDropdown(function (e) {
          return (i = e
            .addOption("", b$.optRegionSelectionAutomatic())
            .setValue("")
            .onChange(function (e) {
              return (o = e);
            }));
        })
        .setHelp(b$.labelRegionSelectionHelp());
      r.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(i18nProxy.dialogue.buttonContinue())
          .onClick(function (e) {
            t !== ""
              ? r.controller.goTo(new A$(t, n, o))
              : new Notice(i18nProxy.plugins.sync.msgVaultNameCannotBeEmpty());
          });
      });
      r.populateRegions(i);
      return r;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncSetup();
    };
    t.prototype.populateRegions = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              o.trys.push([0, 2, , 3]);
              return [4, ZQ(c$.token)];
            case 1:
              for (t = o.sent(), n = 0, i = t; n < i.length; n++) {
                r = i[n];
                e.addOption(r.value, r.name);
              }
              return [3, 3];
            case 2:
              o.sent();
              return [3, 3];
            case 3:
              return [2];
          }
        });
      });
    };
    return t;
  })(k$),
  A$ = (function (e) {
    function t(t, n, i) {
      var r,
        o = e.call(this) || this,
        a = o.formEl,
        s = true,
        password = "";
      new E$(a)
        .addOption("custom", function (e) {
          e.createDiv(
            {
              cls: "mobile-onboarding-radio-option-title",
              text: b$.optionEncryptionCustom(),
            },
            function (e) {
              e.createSpan({
                cls: "flair",
                text: b$.labelRecommended(),
              });
            },
          );
          e.createEl("ul", {
            cls: "mobile-onboarding-radio-option-desc",
            text: b$.optionEncryptionCustomDesc(),
          });
        })
        .addOption("managed", function (e) {
          e.createDiv({
            cls: "mobile-onboarding-radio-option-title",
            text: b$.optionEncryptionManaged(),
          });
          e.createEl("ul", {
            cls: "mobile-onboarding-radio-option-desc",
            text: b$.optionEncryptionManagedDesc(),
          });
        })
        .setValue("custom")
        .onChange(function (e) {
          s = e === "custom";
          r.containerEl.toggle(s);
        });
      r = new C$(a)
        .setName(b$.labelEncryptionKey())
        .addText(function (e) {
          return e
            .setValue(password)
            .onChange(function (e) {
              return (password = e);
            })
            .then(function (e) {
              e.inputEl.type = "password";
              e.inputEl.autocomplete = "new-password";
            });
        })
        .setHelp(b$.labelEncryptionKeyHelp());
      o.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.buttonCreate())
          .onClick(function (e) {
            return __awaiter(o, undefined, undefined, function () {
              var r, o, a, c, u;
              return __generator(this, function (h) {
                switch (h.label) {
                  case 0:
                    return s && password === ""
                      ? (new Notice(i18nProxy.plugins.sync.msgPleaseEnterPassword()), [2])
                      : t === ""
                        ? (new Notice(i18nProxy.plugins.sync.msgVaultNameCannotBeEmpty()), [2])
                        : ((r = e.target).addClass("mod-loading"),
                          (a = null),
                          s ? ((o = d$()), [4, f$(password, o, 3)]) : [3, 2]);
                  case 1:
                    a = h.sent();
                    h.label = 2;
                  case 2:
                    h.trys.push([2, 4, , 5]);
                    return [4, $Q(c$.token, t, a, o, i, 3)];
                  case 3:
                    c = h.sent();
                    s && (c.password = password);
                    this.controller.goTo(new P$(t, n, c));
                    return [3, 5];
                  case 4:
                    u = h.sent();
                    r.removeClass("mod-loading");
                    new Notice(u.message);
                    return [3, 5];
                  case 5:
                    return [2];
                }
              });
            });
          });
      });
      return o;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelRemoteVaultCreate();
    };
    t.prototype.populateRegions = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              o.trys.push([0, 2, , 3]);
              return [4, ZQ(c$.token)];
            case 1:
              for (t = o.sent(), n = 0, i = t; n < i.length; n++) {
                r = i[n];
                e.addOption(r.value, r.name);
              }
              return [3, 3];
            case 2:
              o.sent();
              return [3, 3];
            case 3:
              return [2];
          }
        });
      });
    };
    return t;
  })(k$),
  P$ = (function (e) {
    function t(t, n, i) {
      var r = e.call(this) || this;
      r.requiresAuth = true;
      w$(r.formEl, b$.labelSyncSettingsDesc());
      var o = [
        {
          name: "Main settings",
          type: "app",
        },
        {
          name: "Appearance settings",
          type: "appearance",
        },
        {
          name: "Themes and snippets",
          type: "appearance-data",
        },
        {
          name: "Hotkeys",
          type: "hotkey",
        },
        {
          name: "Active core plugins",
          type: "core-plugin",
        },
        {
          name: "Core plugin settings",
          type: "core-plugin-data",
        },
        {
          name: "Active community plugins",
          type: "community-plugin",
        },
        {
          name: "Installed community plugins",
          type: "community-plugin-data",
        },
      ];
      r.contentEl.createDiv("mobile-onboarding-feature-table", function (e) {
        for (
          var t = function (t) {
              e.createDiv("feature-row", function (e) {
                e.createDiv("feature-cell", function (e) {
                  return e.setText(t.name);
                });
                var n = e.createDiv("feature-cell mod-value");
                h$.contains(t.type)
                  ? (n.addClass("is-enabled"),
                    n.createSpan({
                      text: b$.labelSynced(),
                    }),
                    setIcon(n.createSpan(), "lucide-check"))
                  : n.setText(b$.labelNotSynced());
              });
            },
            n = 0,
            i = o;
          n < i.length;
          n++
        ) {
          t(i[n]);
        }
      });
      var a = [
        {
          name: "Images",
          type: "image",
        },
        {
          name: "Audio",
          type: "audio",
        },
        {
          name: "Videos",
          type: "video",
        },
        {
          name: "PDFs",
          type: "pdf",
        },
        {
          name: "All other file types",
          type: "unsupported",
        },
      ];
      r.formEl.createDiv("mobile-onboarding-feature-table", function (e) {
        e.createDiv("feature-row", function (e) {
          e.createDiv({
            cls: "feature-cell",
            text: i18nProxy.plugins.sync.optionExcludedFolders(),
          });
          e.createDiv({
            cls: "feature-cell mod-value",
            text: b$.labelNone(),
          });
        });
        for (
          var t = function (t) {
              e.createDiv("feature-row", function (e) {
                e.createDiv("feature-cell", function (e) {
                  return e.setText(t.name);
                });
                var n = e.createDiv("feature-cell mod-value");
                u$.contains(t.type)
                  ? (n.addClass("is-enabled"),
                    n.createSpan({
                      text: b$.labelSynced(),
                    }),
                    setIcon(n.createSpan(), "lucide-check"))
                  : n.setText(b$.labelNotSynced());
              });
            },
            n = 0,
            i = a;
          n < i.length;
          n++
        ) {
          t(i[n]);
        }
      });
      r.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.buttonStart())
          .onClick(function () {
            return r.controller.createVault(t, n, !1, i);
          });
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncSettings();
    };
    return t;
  })(k$),
  L$ = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optionSignUp())
          .onClick(function (e) {
            return t.controller.goTo(new H$());
          });
        new ButtonComponent(e).setButtonText(b$.optionSignIn()).onClick(function () {
          return t.controller.goTo(new F$());
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSignInOrSignUp();
    };
    return t;
  })(k$),
  I$ = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.requiresAuth = true;
      w$(n.formEl, b$.labelRemoteVaultOptionsDesc());
      n.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optionRemoteCreate())
          .onClick(function (e) {
            return n.controller.goTo(new T$("obsidian-sync"));
          });
        new ButtonComponent(e).setButtonText(b$.optionRemoteChoose()).onClick(function () {
          return n.controller.goTo(new O$(t));
        });
      });
      n.footerEl.createDiv("button-container", function (e) {
        var t = new ButtonComponent(e).setButtonText(b$.buttonLogout()).onClick(function () {
          return __awaiter(n, undefined, undefined, function () {
            return __generator(this, function (e) {
              switch (e.label) {
                case 0:
                  t.buttonEl.addClass("mod-loading");
                  e.label = 1;
                case 1:
                  e.trys.push([1, 3, 4, 5]);
                  return [4, GQ(c$)];
                case 2:
                  e.sent();
                  this.controller.backToLogin();
                  return [3, 5];
                case 3:
                  e.sent();
                  return [3, 5];
                case 4:
                  t.buttonEl.removeClass("mod-loading");
                  return [7];
                case 5:
                  return [2];
              }
            });
          });
        });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelRemoteVaultOptions();
    };
    return t;
  })(k$),
  O$ = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.requiresAuth = true;
      var i = n.formEl;
      w$(
        n.formEl,
        b$.labelRemoteVaultSelectionDesc({
          email: c$.email,
        }),
      );
      var r = function (e, t) {
        e.createDiv("list-item mod-selectable tappable", function (e) {
          e.createDiv("list-item-part mod-extended", function (e) {
            e.createDiv({
              cls: "list-item-title",
              text: t.name,
            });
            e.createDiv("list-item-desc", function (e) {
              t.hasOwnProperty("region") &&
                t.region !== "" &&
                e.createDiv({
                  cls: "list-item-part",
                  text: t.region,
                });
              e.createDiv({
                cls: "list-item-part",
                text: Ef(t.size),
              });
              e.createDiv({
                cls: "list-item-part mod-extended",
                text: i18nProxy.plugins.sync.labelVaultCreatedTime({
                  time: window.moment(t.created).fromNow(),
                }),
              });
            });
          });
          e.addEventListener("click", function (e) {
            n.controller.goTo(new T$("obsidian-sync", t));
          });
        });
      };
      i.createDiv("list-container has-row-lines", function (e) {
        for (var n = t.vaults, i = 0; i < n.length; i++) {
          r(e, n[i]);
          i < n.length - 1 && e.createDiv("list-item-separator");
        }
      });
      t.shared.length > 0 &&
        (i.createDiv({
          cls: "list-heading",
          text: i18nProxy.plugins.sync.labelVaultsSharedWithYou(),
        }),
        i.createDiv("list-container has-row-lines", function (e) {
          for (var n = t.shared, i = 0; i < n.length; i++) {
            r(e, n[i]);
            i < n.length - 1 && e.createDiv("list-item-separator");
          }
        }));
      new ButtonComponent(n.footerEl).setButtonText(b$.optionRemoteCreate()).onClick(function () {
        return n.controller.goTo(new T$("obsidian-sync"));
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelRemoteVaultSelection();
    };
    return t;
  })(k$),
  F$ = (function (e) {
    function t(t) {
      if (undefined === t) {
        t = "";
      }
      var n,
        i,
        r = e.call(this) || this,
        o = r.formEl,
        a = "",
        s = "",
        l = new C$(o).setName(i18nProxy.setting.account.labelEmail()).addText(function (e) {
          return e
            .setValue(t)
            .setPlaceholder(i18nProxy.setting.account.placeholderEmail())
            .onChange(function (e) {
              return (t = e);
            })
            .then(function (e) {
              return (e.inputEl.type = "email");
            });
        }),
        c = new C$(o).setName(i18nProxy.interface.startScreen.optionUserPassword()).addText(function (e) {
          return (n = e
            .onChange(function (e) {
              return (a = e);
            })
            .then(function (e) {
              e.inputEl.type = "password";
            }));
        }),
        u = new C$(o).setName(i18nProxy.setting.account.labelMfaCode()).addText(function (e) {
          return (i = e
            .onChange(function (e) {
              return (s = e);
            })
            .then(function (e) {
              var t = e.inputEl;
              t.inputMode = "numeric";
              t.pattern = "[0-9]*";
              t.setAttribute("maxlength", "6");
              t.setAttr("autocomplete", "one-time-code");
            }));
        });
      u.containerEl.hide();
      var h = r.contentEl.createDiv("button-container"),
        p = new ButtonComponent(h)
          .setCta()
          .setButtonText(b$.optionSignIn())
          .onClick(function (e) {
            return __awaiter(r, undefined, undefined, function () {
              var r, o, h, d;
              return __generator(this, function (f) {
                switch (f.label) {
                  case 0:
                    if ((e.preventDefault(), t === "")) {
                      this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
                      return [2];
                    }
                    if (-1 === t.indexOf("@")) {
                      this.controller.showError(i18nProxy.setting.account.messageInvalidEmail());
                      return [2];
                    }
                    if (a === "") {
                      this.controller.showError(i18nProxy.setting.account.messageEmptyPassword());
                      return [2];
                    }
                    if (s !== "" && !/^\d{6}$/.test(s)) {
                      this.controller.showError(i18nProxy.setting.account.mfaWrongFormat());
                      return [2];
                    }
                    (r = p.buttonEl).addClass("mod-loading");
                    f.label = 1;
                  case 1:
                    f.trys.push([1, 7, 8, 9]);
                    return [4, jQ(c$, t, a, s)];
                  case 2:
                    return [4, QQ(f.sent().token)];
                  case 3:
                    return (o = f.sent()).limit !== 0 ? [3, 5] : [4, _Q(c$.token)];
                  case 4:
                    f.sent();
                    this.controller.goTo(new q$(t));
                    return [3, 6];
                  case 5:
                    o.vaults.length > 0 || o.shared.length > 0
                      ? this.controller.goTo(new I$(o))
                      : this.controller.goTo(new T$("obsidian-sync"));
                    f.label = 6;
                  case 6:
                    i.setValue("");
                    n.setValue("");
                    return [3, 9];
                  case 7:
                    (h = f.sent()) instanceof VQ
                      ? (d = h.error).contains("2FA code is incorrect")
                        ? this.controller.showError(i18nProxy.setting.account.mfaVerificationFailed())
                        : d.contains("2FA code")
                          ? (l.containerEl.hide(), c.containerEl.hide(), u.containerEl.show())
                          : this.controller.showError(d)
                      : this.controller.showError(i18nProxy.setting.account.messageLoginFailed());
                    return [3, 9];
                  case 8:
                    r.removeClass("mod-loading");
                    return [7];
                  case 9:
                    return [2];
                }
              });
            });
          });
      new ButtonComponent(r.footerEl).setButtonText(b$.buttonForgotPassword()).onClick(function () {
        return r.controller.goTo(new N$(t));
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSignIn();
    };
    return t;
  })(k$),
  N$ = (function (e) {
    function t(email) {
      if (undefined === email) {
        email = "";
      }
      var n = e.call(this) || this,
        i = n.formEl;
      new C$(i).setName(i18nProxy.setting.account.labelEmail()).addText(function (e) {
        return e
          .setValue(email)
          .setPlaceholder(i18nProxy.setting.account.placeholderEmail())
          .onChange(function (e) {
            return (email = e);
          })
          .then(function (e) {
            return (e.inputEl.type = "email");
          });
      });
      var r = n.contentEl.createDiv("button-container"),
        o = new ButtonComponent(r)
          .setCta()
          .setButtonText(b$.buttonResetPassword())
          .onClick(function (e) {
            return __awaiter(n, undefined, undefined, function () {
              var n, i;
              return __generator(this, function (r) {
                switch (r.label) {
                  case 0:
                    if ((e.preventDefault(), email === "")) {
                      this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
                      return [2];
                    }
                    if (-1 === email.indexOf("@")) {
                      this.controller.showError(i18nProxy.setting.account.messageInvalidEmail());
                      return [2];
                    }
                    (n = o.buttonEl).addClass("mod-loading");
                    r.label = 1;
                  case 1:
                    r.trys.push([1, 3, 4, 5]);
                    return [4, qQ(email)];
                  case 2:
                    r.sent();
                    new Notice(
                      b$.msgPasswordReset({
                        email: email,
                      }),
                    );
                    this.controller.backToLogin();
                    return [3, 5];
                  case 3:
                    (i = r.sent()) instanceof VQ
                      ? this.controller.showError(i.error)
                      : this.controller.showError(i18nProxy.setting.account.messageLoginFailed());
                    return [3, 5];
                  case 4:
                    n.removeClass("mod-loading");
                    return [7];
                  case 5:
                    return [2];
                }
              });
            });
          });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelForgotPassword();
    };
    return t;
  })(k$),
  R$ = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.requiresAuth = false;
      var n,
        i = {
          "obsidian-sync": b$.optUseObsidianSync(),
          icloud: b$.optUseIcloud(),
          other: b$.optUseOther(),
        };
      w$(t.formEl, b$.labelSyncMethodSelectionDesc());
      var r = new E$(t.contentEl)
        .addOption("obsidian-sync", function (e) {
          e.createDiv(
            {
              cls: "mobile-onboarding-radio-option-title",
              text: b$.labelObsidianSync(),
            },
            function (e) {
              e.createSpan({
                cls: "flair",
                text: b$.labelRecommended(),
              });
            },
          );
          e.createEl(
            "ul",
            {
              cls: "mobile-onboarding-radio-option-desc",
            },
            function (e) {
              e.createEl("li", {
                text: b$.labelSyncPro1(),
              });
              e.createEl("li", {
                text: b$.labelSyncPro2(),
              });
              e.createEl("li", {
                text: b$.labelSyncPro3(),
              });
            },
          );
        })
        .setValue("obsidian-sync")
        .onChange(function (e) {
          return n.setButtonText(i[e]);
        });
      Platform.isIosApp
        ? r.addOption("icloud", function (e) {
            e.createDiv({
              cls: "mobile-onboarding-radio-option-title",
              text: b$.labelIcloud(),
            });
            e.createEl(
              "ul",
              {
                cls: "mobile-onboarding-radio-option-desc",
              },
              function (e) {
                e.createEl("li", {
                  text: b$.labelIcloudCon1(),
                });
                e.createEl("li", {
                  text: b$.labelIcloudCon2(),
                });
              },
            );
          })
        : r.addOption("other", function (e) {
            e.createDiv({
              cls: "mobile-onboarding-radio-option-title",
              text: b$.labelOtherSync(),
            });
            e.createEl(
              "ul",
              {
                cls: "mobile-onboarding-radio-option-desc",
              },
              function (e) {
                e.createEl("li", {
                  text: b$.labelThirdPartyDesc1(),
                });
                e.createEl("li", {
                  text: b$.labelThirdPartyDesc2(),
                });
              },
            );
          });
      t.contentEl.createDiv("button-container", function (e) {
        n = new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.optUseObsidianSync())
          .onClick(function () {
            return __awaiter(t, undefined, undefined, function () {
              var e, t;
              return __generator(this, function (i) {
                switch (i.label) {
                  case 0:
                    if ((e = r.getValue()) !== "obsidian-sync") return [3, 10];
                    if (!c$.token) return [3, 8];
                    t = undefined;
                    i.label = 1;
                  case 1:
                    i.trys.push([1, 3, , 4]);
                    return [
                      4,
                      withModLoadingClass(n.buttonEl, function () {
                        return QQ(c$.token);
                      }),
                    ];
                  case 2:
                    t = i.sent();
                    return [3, 4];
                  case 3:
                    i.sent();
                    new Notice(i18nProxy.plugins.sync.msgErrorFailedToFetch());
                    return [2];
                  case 4:
                    return t.limit !== 0 ? [3, 6] : [4, _Q(c$.token)];
                  case 5:
                    i.sent();
                    this.controller.goTo(new q$(c$.email));
                    return [3, 7];
                  case 6:
                    t.vaults.length > 0 || t.shared.length > 0
                      ? this.controller.goTo(new I$(t))
                      : this.controller.goTo(new T$("obsidian-sync"));
                    i.label = 7;
                  case 7:
                    return [3, 9];
                  case 8:
                    this.controller.goTo(new L$());
                    i.label = 9;
                  case 9:
                    return [3, 11];
                  case 10:
                    e === "icloud" ? this.controller.goTo(new T$("icloud")) : this.controller.goTo(new V$());
                    i.label = 11;
                  case 11:
                    return [2];
                }
              });
            });
          });
        Platform.isIosApp &&
          new ButtonComponent(e).setButtonText(b$.optLearnOtherSync()).onClick(function () {
            return t.controller.goTo(new V$());
          });
        new ButtonComponent(e).setButtonText(b$.optionSkipShort()).onClick(function () {
          return t.controller.goTo(new T$("none"));
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncMethodSelection();
    };
    return t;
  })(k$),
  B$ = (function (e) {
    function t() {
      var t,
        n = e.call(this) || this,
        i = n.formEl,
        r = {
          local: b$.optionConnectLocalFolder(),
          "obsidian-sync": b$.optionConnectSync(),
          icloud: b$.optionConnectIcloud(),
          other: b$.optionConnectOther(),
        },
        o = new E$(i);
      o.addOption("obsidian-sync", function (e) {
        e.createDiv({
          cls: "mobile-onboarding-radio-option-title",
          text: b$.labelObsidianSync(),
        });
      });
      isAndroidPlatform &&
        o.addOption("local", function (e) {
          e.createDiv({
            cls: "mobile-onboarding-radio-option-title",
            text: b$.labelLocalFolder(),
          });
        });
      o.addOption("icloud", function (e) {
        e.createDiv({
          cls: "mobile-onboarding-radio-option-title",
          text: b$.labelIcloud(),
        });
      })
        .addOption("other", function (e) {
          e.createDiv({
            cls: "mobile-onboarding-radio-option-title",
            text: b$.labelOther(),
          });
        })
        .setValue("obsidian-sync")
        .onChange(function (e) {
          return t.setButtonText(r[e]);
        });
      n.contentEl.createDiv("button-container", function (e) {
        t = new ButtonComponent(e)
          .setCta()
          .setButtonText(r[o.getValue()])
          .onClick(function () {
            return __awaiter(n, undefined, undefined, function () {
              var e,
                n,
                i,
                r,
                a = this;
              return __generator(this, function (s) {
                switch (s.label) {
                  case 0:
                    return (e = o.getValue()) !== "local"
                      ? [3, 6]
                      : hJ
                        ? [3, 2]
                        : [
                            4,
                            new Promise(function (e) {
                              return a.controller.goTo(new U$(e));
                            }),
                          ];
                  case 1:
                    s.sent();
                    s.label = 2;
                  case 2:
                    return hJ ? [4, filesystemPlugin.choose()] : [2];
                  case 3:
                    return (n = s.sent()) && n.path
                      ? n.isRoot
                        ? (new Notice("Please choose a different folder than the root folder of your device."), [2])
                        : ((i = n.path), [4, this.controller.isDirectory(i)])
                      : [3, 5];
                  case 4:
                    s.sent() ? this.controller.openVault(i, !0) : new Notice("Failed to load external vault.");
                    s.label = 5;
                  case 5:
                    return [3, 11];
                  case 6:
                    return e !== "obsidian-sync"
                      ? [3, 10]
                      : c$.token
                        ? [
                            4,
                            withModLoadingClass(t.buttonEl, function () {
                              return QQ(c$.token);
                            }),
                          ]
                        : [3, 8];
                  case 7:
                    (r = s.sent()).vaults.length > 0 || r.shared.length > 0
                      ? this.controller.goTo(new I$(r))
                      : this.controller.goTo(new T$("obsidian-sync"));
                    return [3, 9];
                  case 8:
                    this.controller.goTo(new F$());
                    s.label = 9;
                  case 9:
                    return [3, 11];
                  case 10:
                    e === "icloud"
                      ? Platform.isIosApp
                        ? this.controller.goTo(new W$())
                        : this.controller.goTo(new _$())
                      : this.controller.goTo(new V$());
                    s.label = 11;
                  case 11:
                    return [2];
                }
              });
            });
          });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncRestore();
    };
    return t;
  })(k$),
  V$ = (function (e) {
    function t() {
      var t = e.call(this) || this;
      w$(t.formEl, b$.labelSyncOtherDesc());
      t.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(b$.buttonCreate())
          .onClick(function (e) {
            e.preventDefault();
            t.controller.goTo(new T$("none"));
          });
        new ButtonComponent(e).setButtonText(i18nProxy.interface.buttonLearnMore()).onClick(function () {
          window.open("https://help.obsidian.md/sync-notes", "_blank");
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSyncOther();
    };
    return t;
  })(k$),
  H$ = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.notice = null;
      var n = t.formEl;
      w$(t.formEl, b$.labelEmailEntryDesc());
      var i = "";
      new C$(n).setName(i18nProxy.setting.account.labelEmail()).addText(function (e) {
        return e
          .setValue(i)
          .setPlaceholder(i18nProxy.setting.account.placeholderEmail())
          .onChange(function (e) {
            return (i = e);
          })
          .then(function (e) {
            return (e.inputEl.type = "email");
          });
      });
      t.contentEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setCta()
          .setButtonText(i18nProxy.setting.account.labelSignUp())
          .onClick(function () {
            i !== ""
              ? t.controller.goTo(new z$(i))
              : t.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
          });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelEmailEntry();
    };
    return t;
  })(k$),
  z$ = (function (e) {
    function t(t) {
      var n = e.call(this) || this,
        i = n.formEl,
        r = "",
        o = "";
      new C$(i).setName(i18nProxy.setting.account.labelEmail()).addText(function (e) {
        return e
          .setValue(t)
          .setPlaceholder(i18nProxy.setting.account.placeholderEmail())
          .onChange(function (e) {
            return (t = e);
          })
          .then(function (e) {
            return (e.inputEl.type = "email");
          });
      });
      new C$(i).setName(i18nProxy.setting.account.labelName()).addText(function (e) {
        return e.setValue(r).onChange(function (e) {
          return (r = e);
        });
      });
      new C$(i).setName(i18nProxy.interface.startScreen.optionUserPassword()).addText(function (e) {
        return e
          .setValue(r)
          .onChange(function (e) {
            return (o = e);
          })
          .then(function (e) {
            e.inputEl.type = "password";
          });
      });
      n.contentEl.createDiv("button-container", function (e) {
        var i = new ButtonComponent(e)
          .setCta()
          .setButtonText(i18nProxy.setting.account.labelSignUp())
          .onClick(function () {
            return __awaiter(n, undefined, undefined, function () {
              var e, n;
              return __generator(this, function (a) {
                switch (a.label) {
                  case 0:
                    if (t === "") {
                      this.controller.showError(i18nProxy.setting.account.messageEmptyEmail());
                      return [2];
                    }
                    (e = i.buttonEl).addClass("mod-loading");
                    a.label = 1;
                  case 1:
                    a.trys.push([1, 3, 4, 5]);
                    return [4, zQ(t, o, r, "buy_sync")];
                  case 2:
                    a.sent();
                    this.controller.goTo(new q$(t));
                    return [3, 5];
                  case 3:
                    n = a.sent();
                    console.error(n);
                    n instanceof VQ
                      ? this.controller.showError(n.error)
                      : this.controller.showError(i18nProxy.setting.account.messageSignupFailed());
                    return [3, 5];
                  case 4:
                    e.removeClass("mod-loading");
                    return [7];
                  case 5:
                    return [2];
                }
              });
            });
          });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.labelSignup();
    };
    return t;
  })(k$),
  q$ = (function (e) {
    function t(email) {
      var n = e.call(this) || this;
      w$(
        n.formEl,
        b$.emailVerificationDesc({
          email: email,
        }),
      );
      n.footerEl.createDiv("button-container", function (e) {
        var i = new ButtonComponent(e).setButtonText(b$.buttonResendEmail()).onClick(function () {
            return __awaiter(n, undefined, undefined, function () {
              var e;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    i.setLoading(!0);
                    n.label = 1;
                  case 1:
                    n.trys.push([1, 3, 4, 5]);
                    return [4, WQ(email, "buy_sync")];
                  case 2:
                    n.sent();
                    new Notice(b$.msgNewEmailSuccess());
                    return [3, 5];
                  case 3:
                    e = n.sent();
                    console.error(e);
                    new Notice(b$.msgNewEmailFailure());
                    return [3, 5];
                  case 4:
                    i.setLoading(!1);
                    return [7];
                  case 5:
                    return [2];
                }
              });
            });
          }),
          r = new ButtonComponent(e).setButtonText(b$.buttonLogout()).onClick(function () {
            return __awaiter(n, undefined, undefined, function () {
              return __generator(this, function (e) {
                switch (e.label) {
                  case 0:
                    r.buttonEl.addClass("mod-loading");
                    e.label = 1;
                  case 1:
                    e.trys.push([1, 3, 4, 5]);
                    return [4, GQ(c$)];
                  case 2:
                    e.sent();
                    this.controller.backToLogin();
                    return [3, 5];
                  case 3:
                    e.sent();
                    return [3, 5];
                  case 4:
                    r.buttonEl.removeClass("mod-loading");
                    return [7];
                  case 5:
                    return [2];
                }
              });
            });
          });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.emailVerification();
    };
    return t;
  })(k$),
  W$ = (function (e) {
    function t() {
      var t = e.call(this) || this,
        n = t.formEl;
      n.createEl("p", {
        text: b$.icloudMissingDesc(),
      });
      n.createEl("ol", {}, function (e) {
        e.createEl("li", {
          text: b$.icloudMissingReason1(),
        });
        e.createEl("li", {
          text: b$.icloudMissingReason2(),
        });
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.icloudMissing();
    };
    return t;
  })(k$),
  U$ = (function (e) {
    function t(callback) {
      var n = e.call(this) || this;
      n.callback = callback;
      var i = n.formEl;
      i.createEl("p", {
        text: "Obsidian needs permission to access your device storage.",
      });
      i.createEl("p", {
        text: "This allows your Obsidian data to be used with other apps and third-party tools.",
      });
      i.createEl("p", {
        text: "All your data remains private and stored locally. No one can access your data, not even us.",
      });
      n.footerEl.createDiv("button-container", function (e) {
        new ButtonComponent(e)
          .setButtonText(b$.allowFileAccess())
          .setCta()
          .onClick(function () {
            return __awaiter(n, undefined, undefined, function () {
              return __generator(this, function (e) {
                switch (e.label) {
                  case 0:
                    e.trys.push([0, 3, , 4]);
                    return [4, filesystemPlugin.requestPerms()];
                  case 1:
                    e.sent();
                    return [4, pJ()];
                  case 2:
                    e.sent();
                    this.controller.back();
                    return [3, 4];
                  case 3:
                    e.sent();
                    return [3, 4];
                  case 4:
                    return [2];
                }
              });
            });
          });
        new ButtonComponent(e).setButtonText(i18nProxy.dialogue.buttonCancel()).onClick(function () {
          n.controller.back();
        });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.allowFileAccess();
    };
    t.prototype.onClose = function () {
      this.callback();
    };
    return t;
  })(k$),
  _$ = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.formEl.createEl("p", {
        text: b$.iCloudUnsupportedDesc(),
      });
      new ButtonComponent(t.footerEl).setButtonText(i18nProxy.interface.buttonLearnMore()).onClick(function () {
        window.open("https://help.obsidian.md/sync/switch", "_blank");
      });
      return t;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return b$.iCloudUnsupported();
    };
    return t;
  })(k$),
  j$ =
    ((function () {
      function e(_createVault, _openVault, _fs) {
        var i = this;
        this.previousScreens = [];
        this.errorNotice = null;
        this._createVault = _createVault;
        this._openVault = _openVault;
        this._fs = _fs;
        var r = (this.containerEl = document.body.createDiv("mobile-onboarding")),
          o = r.createDiv("mobile-onboarding-navbar");
        this.backButtonEl = o.createDiv(
          {
            cls: "back-button u-pop tappable",
            text: i18nProxy.interface.startScreen.buttonBack(),
          },
          function (e) {
            e.toggleVisibility(!1);
            e.addEventListener("click", function () {
              return i.back();
            });
          },
        );
        var a = (this.currentScreen = new M$());
        a.controller = this;
        r.append(a.contentEl);
        capacitorAppPlugin &&
          __awaiter(i, undefined, undefined, function () {
            var e,
              t,
              n = this;
            return __generator(this, function (i) {
              switch (i.label) {
                case 0:
                  e = this;
                  return [
                    4,
                    capacitorAppPlugin.addListener("appUrlOpen", function (e) {
                      return __awaiter(n, undefined, undefined, function () {
                        var t, n, i;
                        return __generator(this, function (r) {
                          switch (r.label) {
                            case 0:
                              if (!(t = v$(e.url)) || !t.hasOwnProperty("sync-setup")) return [3, 4];
                              if (!(n = t.token)) return [2];
                              (i = new Notice(b$.msgLoginPending())).containerEl.addClass("is-loading");
                              r.label = 1;
                            case 1:
                              r.trys.push([1, 3, , 4]);
                              return [4, UQ(c$, n)];
                            case 2:
                              r.sent();
                              this.goTo(new T$("obsidian-sync"));
                              return [3, 4];
                            case 3:
                              r.sent();
                              i.containerEl.removeClass("is-loading");
                              i.setMessage("Failed went wrong.");
                              i.containerEl.addClass("mod-error");
                              return [3, 4];
                            case 4:
                              return [2];
                          }
                        });
                      });
                    }),
                  ];
                case 1:
                  e.appUrlOpenListener = i.sent();
                  t = this;
                  return [
                    4,
                    capacitorAppPlugin.addListener("backButton", function (e) {
                      n.back();
                    }),
                  ];
                case 2:
                  t.androidBackButtonListener = i.sent();
                  return [2];
              }
            });
          });
      }
      e.prototype.showError = function (e) {
        this.errorNotice && this.errorNotice.hide();
        this.errorNotice = new Notice(e, 3e3);
      };
      e.prototype.back = function () {
        var e = this.currentScreen,
          currentScreen = this.previousScreens.pop();
        if (c$.token && currentScreen instanceof F$) {
          currentScreen.onClose();
          return void this.back();
        }
        currentScreen &&
          (e.onClose(),
          e.contentEl.detach(),
          (this.currentScreen = currentScreen),
          this.containerEl.appendChild(currentScreen.contentEl));
        this.backButtonEl.toggleVisibility(this.previousScreens.length > 0);
      };
      e.prototype.unload = function () {
        var e, t;
        (e = this.appUrlOpenListener) === null || undefined === e || e.remove();
        (t = this.androidBackButtonListener) === null || undefined === t || t.remove();
        this.containerEl.detach();
      };
      e.prototype.createVault = function (e, t, n, i) {
        return __awaiter(this, undefined, undefined, function () {
          return __generator(this, function (r) {
            switch (r.label) {
              case 0:
                return [4, this._createVault(e, t, n, i)];
              case 1:
                !1 !== r.sent() && this.unload();
                return [2];
            }
          });
        });
      };
      e.prototype.openVault = function (e, t) {
        return __awaiter(this, undefined, undefined, function () {
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, this._openVault(e, t)];
              case 1:
                !1 !== n.sent() && this.unload();
                return [2];
            }
          });
        });
      };
      e.prototype.isDirectory = function (e) {
        return __awaiter(this, undefined, Promise, function () {
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                return this._fs ? [4, this._fs.stat(e)] : [2, !1];
              case 1:
                return [2, t.sent().type === "directory"];
            }
          });
        });
      };
      e.prototype.backToLogin = function () {
        for (; this.currentScreen.requiresAuth; ) this.back();
        if (!(this.currentScreen instanceof F$)) {
          this.goTo(new F$());
        }
      };
      e.prototype.goTo = function (currentScreen) {
        if (!currentScreen.requiresAuth || c$.token) {
          currentScreen.controller = this;
          var t = this.currentScreen;
          this.previousScreens.push(t);
          this.currentScreen = currentScreen;
          this.backButtonEl.toggleVisibility(this.previousScreens.length > 0);
          t.contentEl.detach();
          this.containerEl.appendChild(currentScreen.contentEl);
        } else this.backToLogin();
      };
    })(),
    (function (e) {
      function t(t) {
        var n = e.call(this, t) || this;
        n.setTitle("iCloud files");
        n.modalEl.addClass("mod-lg", "mod-scrollable-content", "mod-plugin-debug");
        n.contentEl.createEl("p", {
          text: "iCloud automatically optimizes the storage space on your device. iCloud may remove the local version of your files and they will need to be re-downloaded.",
        });
        n.contentEl.createEl("p", {
          text: "Obsidian is checking if any configuration files are missing from your device and will request them from iCloud.",
        });
        n.contentEl.createEl("p", {
          text: createFragment(function (e) {
            e.appendText("To avoid this happening to your Obsidian files, you will need to open the ");
            e.createEl("strong", {
              text: "Files",
            });
            e.appendText("app. Press and hold on the Obsidian folder and choose ");
            e.createEl("strong", {
              text: "Keep Downloaded",
            });
            e.appendText(".");
          }),
        });
        n.addButton("mod-cancel", i18nProxy.dialogue.buttonDone(), function () {});
        return n;
      }
      __extends(t, e);
    })(GM),
    (function (e) {
      function t(t, viewType, icon, r) {
        var o = e.call(this, t) || this;
        o.navigation = false;
        o.viewType = viewType;
        o.icon = icon;
        o.title = r || "";
        o.containerEl.onNodeInserted(function () {
          return o.rerender();
        });
        o.containerEl.addEventListener("click", function () {
          return o.rerender();
        });
        return o;
      }
      __extends(t, e);
      t.prototype.getDisplayText = function () {
        return this.title;
      };
      t.prototype.getViewType = function () {
        return this.viewType;
      };
      t.prototype.getState = function () {
        return this.state;
      };
      t.prototype.setState = function (state, t) {
        return __awaiter(this, undefined, Promise, function () {
          return __generator(this, function (t) {
            this.state = state;
            return [2];
          });
        });
      };
      t.prototype.setEphemeralState = function (estate) {
        this.estate = estate;
      };
      t.prototype.rerender = function () {
        return __awaiter(this, undefined, undefined, function () {
          var e, t, n;
          return __generator(this, function (i) {
            switch (i.label) {
              case 0:
                t = (e = this).app.workspace;
                return (n = e.leaf).view !== this || n.working
                  ? [2]
                  : [
                      4,
                      n.setViewState(
                        {
                          type: this.viewType,
                          state: this.state,
                        },
                        this.estate,
                      ),
                    ];
              case 1:
                i.sent();
                n.view !== this && t.requestLayoutChangeEvents();
                return [2];
            }
          });
        });
      };
      return t;
    })(View)),
  G$ = (function (e) {
    function t(t, viewType) {
      var i = e.call(this, t) || this;
      i.canDropAnywhere = true;
      i.viewType = viewType;
      var r = i.emptyTitleEl;
      r.setText(i18nProxy.interface.emptyState.unknownPaneTitle());
      var o = createDiv({
        text: i18nProxy.interface.emptyState.unknownPaneDesc({
          type: viewType,
        }),
      });
      setTooltip(o, "This pane doesn't look like anything to me.");
      i.clickableAreaEl.insertAfter(o, r);
      return i;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return this.viewType;
    };
    t.prototype.getViewType = function () {
      return this.viewType;
    };
    t.prototype.getIcon = function () {
      return "lucide-ghost";
    };
    t.prototype.getState = function () {
      return this.state;
    };
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      var t = this.app.workspace;
      this.registerEvent(t.on("layout-change", this.onLayoutChange.bind(this)));
    };
    t.prototype.setState = function (state, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          this.state = state;
          return [2];
        });
      });
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          t = (e = this).actionListEl;
          n = e.viewType;
          t.createDiv({
            cls: "empty-state-action tappable mod-close",
            text: i18nProxy.interface.emptyState.close(),
          }).addEventListener("click", function () {
            return r.leaf.detach();
          });
          i = this.app.workspace.getLeavesOfType(n);
          this.closeAllButtonEl = t.createDiv({
            cls: "empty-state-action tappable mod-close",
            text: i18nProxy.interface.emptyState.closeAll({
              id: n,
              count: i.length,
            }),
          });
          this.closeAllButtonEl.hide();
          this.closeAllButtonEl.addEventListener("click", function () {
            for (var e = 0, t = r.app.workspace.getLeavesOfType(r.viewType); e < t.length; e++) {
              t[e].detach();
            }
          });
          return [2];
        });
      });
    };
    t.prototype.onLayoutChange = function () {
      var e = this.app,
        t = this.viewType,
        count = e.workspace.getLeavesOfType(t).length;
      this.closeAllButtonEl.setText(
        i18nProxy.interface.emptyState.closeAll({
          id: t,
          count: count,
        }),
      );
      this.closeAllButtonEl.toggle(count > 1);
    };
    return t;
  })(Pj),
  runDebugMode = false;
function Y$() {
  return __awaiter(this, undefined, Promise, function () {
    var e, t, n, i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          e = "SYSTEM INFO:\n";
          Platform.isDesktopApp &&
            (callbackWithElectron(function (t) {
              var n = t.ipcRenderer.sendSync("version"),
                i = t.remote.app.getVersion();
              e += "\tObsidian version: v".concat(n, "\n");
              e += "\tInstaller version: v".concat(i, "\n");
            }),
            (t = loadModule("os")) && (e += "\tOperating system: ".concat(t.version(), " ").concat(t.release, "\n")));
          return Platform.isMobileApp ? [4, capacitorDevicePlugin.getInfo()] : [3, 3];
        case 1:
          n = l.sent();
          return [4, capacitorAppPlugin.getInfo()];
        case 2:
          i = l.sent();
          e += "\tOperating system: "
            .concat(n.platform, " ")
            .concat(n.osVersion, " (")
            .concat(n.manufacturer, " ")
            .concat(n.model, ")\n");
          Platform.isAndroidApp &&
            (e += "\tWebview version: ".concat(
              ((c = navigator.userAgent), (u = c.match(/Chrome\/([\d.]+)/i)) ? u[1] : "N/A"),
              "\n",
            ));
          e += "\tObsidian version: ".concat(i.version, " (").concat(i.build, ")\n");
          e += "\tAPI version: v".concat(apiVersion, "\n");
          l.label = 3;
        case 3:
          r = c$.token ? "logged in" : "not logged in";
          e += "\tLogin status: ".concat(r, "\n");
          o = getLanguage();
          e += "\tLanguage: ".concat(o, "\n");
          c$.token && ((a = c$.license || "none"), (e += "\tCatalyst license: ".concat(a, "\n")));
          Platform.isDesktopApp &&
            ((s = ""),
            callbackWithElectron(function (t) {
              s = t.ipcRenderer.sendSync("insider-build", null) ? "on" : "off";
              e += "\tInsider build toggle: ".concat(s, "\n");
            }));
          return [2, e];
      }
      var c, u;
    });
  });
}
var timestamps = [],
  X$ = {
    views: 0,
    deferredViews: 0,
  },
  Q$ = {
    key: "",
    children: {},
    duration: 0,
  };
function timeSampling(key) {
  timestamps.push({
    key: key,
    ts: performance.now(),
  });
}
function J$(e) {
  var t = Q$;
  if (e)
    for (var n = 0, i = e.split("."); n < i.length; n++) {
      var r = i[n];
      if (!t.children.hasOwnProperty(r)) return null;
      t = t.children[r];
    }
  return t;
}
function eJ(e) {
  var t, n;
  return (n = (t = J$(e)) === null || undefined === t ? undefined : t.duration) !== null && undefined !== n ? n : 0;
}
function tJ(e) {
  return __awaiter(this, undefined, undefined, function () {
    var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          t = lm({
            maximumFractionDigits: 0,
          });
          n = function (e) {
            return t.format(e) + "ms";
          };
          (i = ["Obsidian start-up time breakdown"]).push("");
          Platform.isDesktopApp &&
            (callbackWithElectron(function (e) {
              var t = e.ipcRenderer.sendSync("version"),
                n = e.remote.app.getVersion();
              i.push("Obsidian version: v".concat(t));
              i.push("Installer version: v".concat(n));
            }),
            (r = loadModule("os")) && i.push("Operating system: ".concat(r.version(), " ").concat(r.release)));
          return Platform.isMobileApp ? [4, capacitorDevicePlugin.getInfo()] : [3, 3];
        case 1:
          o = b.sent();
          return [4, capacitorAppPlugin.getInfo()];
        case 2:
          a = b.sent();
          i.push(
            "Operating system: "
              .concat(o.platform, " ")
              .concat(o.osVersion, " (")
              .concat(o.manufacturer, " ")
              .concat(o.model, ")"),
          );
          i.push("Obsidian version: ".concat(a.version, " (").concat(a.build, ")"));
          i.push("API version: v".concat(apiVersion));
          b.label = 3;
        case 3:
          if (
            (i.push(""),
            (s = e.vault.getRoot().getFileCount()),
            (l = Object.keys(e.plugins.plugins).length),
            i.push("- Total startup time: ".concat(n(eJ()))),
            i.push("- Initialization: ".concat(n(eJ("initialization")))),
            eJ("icloud") && i.push("- iCloud: ".concat(n(eJ("icloud")))),
            i.push("- Vault (".concat(t.format(s), " files): ").concat(n(eJ("vault")))),
            i.push(
              "- Workspace ("
                .concat(X$.views, " tabs, ")
                .concat(X$.deferredViews, " deferred): ")
                .concat(n(eJ("workspace"))),
            ),
            i.push("- Core plugins: ".concat(n(eJ("corePlugins")))),
            (c = J$("communityPlugins")))
          ) {
            for (
              i.push("- Community plugins (".concat(t.format(l), " active): ").concat(n(eJ("communityPlugins")))),
                u = [],
                h = 0,
                p = Object.values(c.children);
              h < p.length;
              h++
            ) {
              d = p[h];
              u.push({
                id: d.key,
                time: d.duration,
              });
            }
            for (
              u.sort(function (e, t) {
                return t.time - e.time;
              }),
                f = 0,
                m = u;
              f < m.length;
              f++
            ) {
              g = m[f];
              v = g.id;
              y = g.time;
              w = e.plugins.manifests[v];
              i.push("  - ".concat(w.name, " (v").concat(w.version, "): ").concat(n(y)));
            }
          }
          return [2, i.join("\n")];
      }
    });
  });
}