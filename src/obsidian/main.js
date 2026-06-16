var Xe = Object.create;
var We = Object.defineProperty;
var Qe = Object.getOwnPropertyDescriptor;
var Ye = Object.getOwnPropertyNames;
var et = Object.getPrototypeOf,
  tt = Object.prototype.hasOwnProperty;
var nt = (d, l, g, S) => {
  if ((l && typeof l == "object") || typeof l == "function")
    for (let A of Ye(l))
      !tt.call(d, A) &&
        A !== g &&
        We(d, A, {
          get: () => l[A],
          enumerable: !(S = Qe(l, A)) || S.enumerable,
        });
  return d;
};
var ge = (d, l, g) => (
  (g = d != null ? Xe(et(d)) : {}),
  nt(
    l || !d || !d.__esModule
      ? We(g, "default", { value: d, enumerable: !0 })
      : g,
    d,
  )
);
var G = class {
  constructor() {
    ((this.rawRules = []), (this.rules = []));
  }
  addList(l) {
    for (let g of l.split(`
`))
      this.add(g);
  }
  add(l) {
    if (
      (this.rawRules.push(l),
      (l = l.trim()),
      (l = l.replace(/[\r\n]/g, "")),
      l.length <= 3 || l[0] === "!")
    )
      return;
    let g = {
      hasStart: !1,
      hasEnd: !1,
      rule: l,
      text: l,
      domain: !1,
      items: [],
    };
    if (l.indexOf("##") >= 0) return;
    if (l.indexOf("@@") === 0) return;
    if (l[0] === "|" && l[1] === "|") {
      g.domain = !0;
      let E = l.slice(2);
      g.text = Ne(E);
    } else
      l[0] === "|"
        ? ((g.hasStart = !0), (g.text = l.slice(1)))
        : l[l.length - 1] === "|" &&
          ((g.hasEnd = !0), (g.text = l.slice(0, -1)));
    let S = g.text.lastIndexOf("$");
    if (S >= 0) {
      g.text = g.text.slice(0, S);
      return;
    }
    if (
      (g.text[0] === "/" && g.text[g.text.length - 1] === "/") ||
      g.text.length <= 3
    )
      return;
    let A = g.text.split(/\*+/).filter(function (E) {
      return E;
    });
    for (let E = 0; E < A.length; E++) {
      let C = A[E],
        v = C.split("^");
      if (v.length > 0)
        for (let I = 0; I < v.length; I++) {
          let M = v[I];
          if (M === "") continue;
          let j = v[I - 1],
            V = v[I + 1];
          g.items.push({ text: M, before: j !== void 0, after: V !== void 0 });
        }
      else g.items.push({ text: C, before: !1, after: !1 });
    }
    this.rules.push(g);
  }
  clearRules() {
    ((this.rules = []), (this.rawRules = []));
  }
  matches(l) {
    let g = {};
    for (let S = 0; S < this.rules.length; S++) {
      let A = this.rules[S];
      if (it(A, l, g)) return !0;
    }
    return !1;
  }
};
function it(d, l, g) {
  let S = d.items;
  d.domain &&
    (g.domainUrl ? (l = g.domainUrl) : ((l = Ne(l)), (g.domainUrl = l)));
  let A = -1;
  for (let E = 0; E < S.length; E++) {
    let C = S[E],
      v = l.indexOf(C.text, A + 1);
    if (v <= A || ((A = v), d.hasStart && E === 0 && v !== 0)) return !1;
    if (d.hasEnd && E === S.length - 1) {
      let I = l.length - C.text.length;
      if (v !== I) return !1;
    }
    if (C.before && !Ue(l[A - 1])) return !1;
    if (C.after) {
      let I = A + C.text.length;
      if (l[I] !== void 0 && !Ue(l[I])) return !1;
    }
  }
  return !0;
}
function Ue(d) {
  return d === "/" || d === ":" || d === "?" || d === "=" || d === "&";
}
function Ne(d) {
  return (
    d.indexOf("https://") === 0 && (d = d.slice(8)),
    d.indexOf("http://") === 0 && (d = d.slice(7)),
    d.indexOf("www.") === 0 && (d = d.slice(4)),
    d
  );
}
var i = require("electron"),
  m = ge(require("fs")),
  He = ge(require("original-fs")),
  w = ge(require("path"));
function je(d, l) {
  return d.length <= l ? d : d.slice(0, l - 1).trim() + "\u2026";
}
var Je = require("url"),
  R = process.platform === "darwin",
  H = process.platform === "win32",
  rt = process.versions.electron,
  ot = parseInt(rt.split(".")[0]);
function _(d, l) {
  return d ? l() : [];
}
function qe(d) {
  let l = [];
  for (let g = 0; g < d; g++) l.push(((Math.random() * 16) | 0).toString(16));
  return l.join("");
}
function _e(d) {
  return typeof d == "string" && /^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/.test(d);
}
function ze(d, l, g) {
  let { editFlags: S, misspelledWord: A, dictionarySuggestions: E } = g,
    C = g.selectionText.trim(),
    v = C.length > 0,
    I = !!g.linkURL,
    M = (P) => S[`can${P}`] && v,
    j = g.isEditable || v,
    V = [
      ..._(R, () => [
        {
          label: `Look up \u201C${C.length <= 40 ? C : C.slice(0, 39).trim() + "\u2026"}\u201D`,
          visible: v && !I,
          click() {
            l.showDefinitionForSelection();
          },
        },
        { type: "separator" },
      ]),
      {
        accelerator: "CmdOrCtrl+X",
        label: "Cut",
        role: M("Cut") ? "cut" : void 0,
        enabled: M("Cut"),
        visible: g.isEditable,
      },
      {
        accelerator: "CmdOrCtrl+C",
        label: "Copy",
        role: M("Copy") ? "copy" : void 0,
        enabled: M("Copy"),
        visible: g.isEditable || v,
      },
      {
        accelerator: "CmdOrCtrl+V",
        label: "Paste",
        role: S.canPaste ? "paste" : void 0,
        enabled: S.canPaste,
        visible: g.isEditable,
      },
      {
        accelerator: "CmdOrCtrl+Shift+V",
        label: "Paste as text",
        role: S.canPaste ? "pasteAndMatchStyle" : void 0,
        enabled: S.canPaste,
        visible: g.isEditable,
      },
    ];
  if (A && A.length >= 1) {
    let P = [];
    (E && E.length > 0
      ? E.slice(0, 5).forEach((J) => {
          P.push({
            label: J,
            click: () => {
              l.replaceMisspelling(J);
            },
          });
        })
      : P.push({ label: "No suggestion", enabled: !1 }),
      P.push({
        label: "Add to Dictionary",
        click: () => {
          (l.session.addWordToSpellCheckerDictionary(A),
            l.replaceMisspelling(A));
        },
      }),
      P.push({ type: "separator" }),
      (V = P.concat(V)),
      (j = !0));
  }
  j && i.Menu.buildFromTemplate(V).popup({ window: d });
}
function N(d, l) {
  try {
    return d();
  } catch (g) {
    return (console.log("Ignored:", g.toString()), l);
  }
}
module.exports = function (d, l, g) {
  if (ot < 18) {
    (i.dialog.showErrorBox(
      "Manual update required",
      "This version of Obsidian is no longer supported. Please download and install the latest version from https://obsidian.md",
    ),
      i.shell.openExternal("https://obsidian.md/download"),
      i.app.quit());
    return;
  }
  if (!(process.mas || i.app.requestSingleInstanceLock())) {
    i.app.quit();
    return;
  }
  let S = ["SharedArrayBuffer"];
  for (let n of process.argv)
    n.startsWith("--enable-features=") &&
      (S = S.concat(
        n
          .substring(18)
          .split(",")
          .map((o) => o.trim()),
      ));
  (i.app.commandLine.appendSwitch("enable-features", S.join(",")),
    process.removeAllListeners("uncaughtException"),
    process.on("uncaughtException", function (n) {
      if (
        (console.error("Uncaught Exception", n),
        n.message.includes(
          "Render frame was disposed before WebFrameMain could be accessed",
        ) || n.message.indexOf("net::ERR") !== -1)
      )
        return;
      let a =
        `Uncaught Exception:
` + (n.stack ? n.stack : `${n.name}: ${n.message}`);
      i.dialog.showErrorBox(
        "A JavaScript error occurred in the main process",
        a,
      );
    }));
  let A = "",
    E = !1;
  (l.on("update-manual-required", () => (A = "update-manual-required")),
    l.on("update-downloaded", () => (A = "update-downloaded")),
    l.on("check-start", () => (E = !0)),
    l.on("check-end", () => (E = !1)));
  let C = i.app.getPath("userData"),
    v = (() => {
      try {
        return i.app.getPath("documents");
      } catch (n) {}
      try {
        let n = w.join(i.app.getPath("home"), "Documents");
        if (n && m.existsSync(n)) return n;
      } catch (n) {}
      return C;
    })(),
    I = (() => {
      try {
        return i.app.getPath("desktop");
      } catch (n) {}
      try {
        let n = w.join(i.app.getPath("home"), "Desktop");
        if (n && m.existsSync(n)) return n;
      } catch (n) {}
      return C;
    })(),
    M = {},
    j = new G(),
    V = (n) => w.join(C, n + ".json");
  function P(n, o) {
    N(() => m.writeFileSync(V(n), JSON.stringify(o)));
  }
  function J(n) {
    return N(() => JSON.parse(m.readFileSync(V(n), "utf8")) || {}, {});
  }
  function be(n) {
    N(() => m.unlinkSync(V(n)));
  }
  let ie = null;
  async function X() {
    let n = w.join(C, "adblock");
    m.existsSync(n) || m.mkdirSync(n);
    let o = b.hasOwnProperty("adblockFrequency") ? b.adblockFrequency : Oe,
      a = new G(),
      c = b.adblock || Ee;
    for (let u of c) {
      let p = w.basename(u),
        e = w.join(n, p),
        t = !0;
      try {
        let r = await m.promises.stat(e),
          s = (new Date().getTime() - r.mtime.getTime()) / 864e5;
        t = o === 0 ? !1 : s >= o;
      } catch (r) {}
      if (!t) {
        let r = w.join(n, w.basename(u)),
          s = await m.promises.readFile(r, "utf8");
        a.addList(s);
        continue;
      }
      console.log(`Retrieving newer version of ${u}`);
      try {
        let s = await (await i.net.fetch(u)).text();
        (await m.promises.writeFile(e, s), a.addList(s));
      } catch (r) {
        console.log("Failed to retrieve adblock list: " + r);
      }
    }
    ((j = a),
      ie !== null && clearTimeout(ie),
      o !== 0 && ((o = Math.min(o, 24)), (ie = setTimeout(X, o * 864e5))));
  }
  function Ke(n) {
    try {
      return (m.accessSync(n, m.constants.R_OK | m.constants.W_OK), !0);
    } catch (o) {
      return !1;
    }
  }
  let re = (() => {
    let n = w.join(d, "package.json");
    try {
      if (m.existsSync(n)) return JSON.parse(m.readFileSync(n, "utf8")).version;
    } catch (o) {}
    return i.app.getVersion();
  })();
  async function Q(n, o, a, c) {
    let u = o.match(/^([a-z][a-z0-9+\-.]*):/i),
      p = u ? u[1].toLowerCase() : "";
    if (!p || p === Ae || p === "about") return;
    if (
      p !== "http" &&
      p !== "https" &&
      p !== "obsidian" &&
      !(b.openSchemes && b.openSchemes[p])
    ) {
      let r = await i.dialog.showMessageBox(n, {
        message:
          `Are you sure you want to open this link?

Link: ` + je(o, 200),
        type: "question",
        buttons: ["Open this link", "Cancel"],
        defaultId: 1,
        cancelId: 1,
        title: "Open link",
        checkboxLabel: "Always open " + p + ": links in the future",
      });
      if (r.response !== 0) return;
      p &&
        r.checkboxChecked &&
        ((b.openSchemes = b.openSchemes || {}), (b.openSchemes[p] = !0), B());
    }
    if (c !== "_external" && (p === "http" || p === "https")) {
      let r = "tab",
        s = !1;
      a === "new-window"
        ? ((r = "window"), (s = !0))
        : c === "split"
          ? ((r = "split"), (s = !0))
          : a === "background-tab"
            ? ((r = "tab"), (s = !1))
            : a === "foreground-tab" && ((r = "tab"), (s = !0));
      let y = `(() => {let e = new CustomEvent('open-url', ${JSON.stringify({ cancelable: !0, detail: { url: o, leaf: r, active: s } })}); window.dispatchEvent(e); return e.defaultPrevented;})()`;
      if (await n.webContents.executeJavaScript(y)) return;
    }
    if (p !== "file")
      return (console.log("Opening URL: " + o), i.shell.openExternal(o));
    ((o = o.substring(u[0].length)),
      o.startsWith("//") && (o = o.substring(2)),
      H && o.startsWith("/") && (o = o.substring(1)));
    let e = o.lastIndexOf("#"),
      t = "";
    (e !== -1 && ((t = o.substr(e)), (o = o.substr(0, e))),
      (o = decodeURIComponent(o)),
      (o = w.normalize(o) + t),
      !(
        (_e(o) || (H && !/^[a-z]:/i.test(o))) &&
        (
          await i.dialog.showMessageBox(n, {
            message:
              `This file is located on a remote server, and may be dangerous.
Are you sure you want to open it?

Location: ` + o,
            type: "warning",
            buttons: ["Open this file", "Cancel"],
            defaultId: 1,
            cancelId: 1,
            title: "Remote file warning",
          })
        ).response !== 0
      ) && (console.log("Opening file: " + o), ye(o)));
  }
  function ye(n) {
    !H && !R
      ? i.shell.openExternal((0, Je.pathToFileURL)(n).href)
      : i.shell.openPath(n);
  }
  function De(n) {
    if (i.remote)
      try {
        i.remote.enable(n);
      } catch (o) {
        console.error(o);
      }
  }
  function we(n, o) {
    let a = n.webContents;
    (Fe(a),
      De(a),
      a.on("will-navigate", (p, e) => {
        e.indexOf(Se) !== 0 &&
          (p.preventDefault(), e.indexOf(W) !== 0 && Q(n, e));
      }),
      n.on("app-command", (p, e) => {
        e === "browser-backward"
          ? a.executeJavaScript("history.back()")
          : e === "browser-forward" && a.executeJavaScript("history.forward()");
      }),
      n.on("swipe", (p, e) => {
        e === "left"
          ? a.executeJavaScript("history.back()")
          : e === "right" && a.executeJavaScript("history.forward()");
      }),
      n.on("focus", () => {
        ((n.focusTime = Date.now()),
          ne(),
          pe(K(n), "window-always-on-top", {
            checked: n.isAlwaysOnTop(),
            enabled: !o,
          }));
      }),
      n.on("always-on-top-changed", () => {
        n === i.BrowserWindow.getFocusedWindow() &&
          pe(K(n), "window-always-on-top", { checked: n.isAlwaysOnTop() });
      }),
      n.on("maximize", () => {
        n.isAlwaysOnTop() && n.setAlwaysOnTop(!1);
      }),
      n.on("enter-full-screen", () => {
        n.isAlwaysOnTop() && n.setAlwaysOnTop(!1);
      }));
    let c = () =>
      n.webContents.executeJavaScript(
        "window.dispatchEvent(new Event('focuschange'));",
      );
    (n.on("focus", c), n.on("blur", c));
    let u = () =>
      a.executeJavaScript(
        "window.dispatchEvent(new Event('fullscreenchange'));",
      );
    (n.on("enter-full-screen", u), n.on("leave-full-screen", u));
  }
  function Fe(n) {
    if (n.isSecured) return;
    ((n.isSecured = !0),
      n.setWindowOpenHandler((a) => {
        if (
          a.url === "about:blank" &&
          a.features &&
          a.features.startsWith("popup")
        ) {
          let c = a.features.split(","),
            u = {},
            p = "";
          for (let e of c) {
            let [t, r] = e.split("=");
            ((t === "x" || t === "y" || t === "width" || t === "height") &&
              (u[t] = parseInt(r)),
              t === "background" && (p = r));
          }
          return {
            action: "allow",
            overrideBrowserWindowOptions: {
              trafficLightPosition: { x: 19, y: 12 },
              autoHideMenuBar: !0,
              frame: Y,
              titleBarStyle: ae,
              ...Ce(u),
              webPreferences: {
                contextIsolation: !1,
                nodeIntegration: !0,
                nodeIntegrationInWorker: !0,
                spellcheck: !0,
                webviewTag: !0,
                affinity: "main-window",
              },
              show: !1,
              backgroundColor: p,
            },
          };
        }
        try {
          let { url: c, disposition: u, frameName: p } = a;
          Q(i.BrowserWindow.fromWebContents(n), c, u, p);
        } catch (c) {
          console.error(c);
        }
        return { action: "deny" };
      }),
      n.on("will-attach-webview", (a, c) => {
        (delete c.preload,
          delete c.preloadURL,
          (c.sandbox = !0),
          (c.nodeIntegration = !1),
          (c.nodeIntegrationInWorker = !1),
          (c.nodeIntegrationInSubFrames = !1),
          (c.webSecurity = !0),
          (c.plugins = !1),
          (c.experimentalFeatures = !1),
          (c.webviewTag = !1));
      }));
    let o = !0;
    n.on("did-attach-webview", (a, c) => {
      (c.setWindowOpenHandler((u) => {
        let { url: p, disposition: e, frameName: t } = u;
        if (e === "foreground-tab") {
          if (!o) return { action: "deny" };
          o = !1;
        }
        if (/^https?:\/\//.test(p))
          try {
            Q(i.BrowserWindow.fromWebContents(c), p, e, t);
          } catch (r) {
            console.error(r);
          }
        return { action: "deny" };
      }),
        c.on("will-navigate", (u, p) => {
          /^https?:\/\//.test(p) || u.preventDefault();
        }),
        c.on("will-frame-navigate", (u) => {
          /^https?:\/\//.test(u.url) || u.preventDefault();
        }),
        c.on("will-attach-webview", (u) => {
          u.preventDefault();
        }),
        c.on("did-navigate", () => {
          o = !0;
        }));
    });
  }
  function Ce(n) {
    let o = { width: 800, height: 600 };
    N(() => {
      let c = i.screen.getPrimaryDisplay().workArea;
      ((o.width = Math.min(1024, c.width)),
        (o.height = Math.min(800, c.height - 1)));
    });
    let a = !1;
    if (
      n.x !== void 0 &&
      n.y !== void 0 &&
      n.width !== void 0 &&
      n.height !== void 0
    )
      try {
        for (let c of i.screen.getAllDisplays()) {
          let u = c.workArea;
          if (
            n.x < u.x + u.width - 2 &&
            n.x + n.width > u.x + 2 &&
            n.y < u.y + u.height - 2 &&
            n.y + n.height > u.y + 2
          ) {
            a = !0;
            break;
          }
        }
      } catch (c) {
        console.error(c);
      }
    else
      n.x === void 0 &&
        n.y === void 0 &&
        n.width !== void 0 &&
        n.height !== void 0 &&
        (a = !0);
    return (
      a &&
        ((o.x = n.x), (o.y = n.y), (o.width = n.width), (o.height = n.height)),
      o.width < 300 && (o.width = 300),
      o.height < 200 && (o.height = 200),
      o
    );
  }
  let $e = w.join(v, "Obsidian Vault"),
    xe = w.join(C, "Obsidian Sandbox"),
    Ze = w.join(C, "Obsidian Help"),
    Ae = "app",
    oe = Ae + "://",
    W = oe + "obsidian.md/",
    se = oe + qe(36) + "/",
    Se = W + "index.html",
    Ee = [
      "https://easylist.to/easylist/easylist.txt",
      "https://easylist.to/easylist/easyprivacy.txt",
    ],
    Oe = 4,
    ve = ["clipboard-read", "clipboard-sanitized-write"],
    b = J("obsidian");
  (!b || typeof b != "object") && (b = {});
  let F = b.vaults || {};
  Ge();
  for (let n in F) {
    let o = F[n];
    ((o.path = w.resolve(o.path)),
      (!o.path || o.path === Ze || !m.existsSync(o.path)) &&
        (delete F[n], be(n)));
  }
  ((b.vaults = F), b.insider && l.emit("insider", !0));
  let Y = b.frame === "native",
    ae = Y ? "default" : "hidden";
  if (
    (b.updateDisabled &&
      (l.emit("disable", !0), console.log("Updates disabled.")),
    b.disableGpu && !i.app.isReady())
  )
    try {
      (i.app.disableHardwareAcceleration(),
        console.log("GPU Acceleration disabled."));
    } catch (n) {
      console.error(n);
    }
  let L;
  (b.icon && m.existsSync(w.join(C, b.icon)) && (L = w.join(C, b.icon)),
    !L && g && (L = w.join(d, "icon-dev.png")));
  function B() {
    P("obsidian", b);
  }
  function ke(n, o) {
    let a = F[n];
    a && (o ? (a.open = !0) : delete a.open, B());
  }
  async function Ge() {
    let n = w.join(C, "Partitions");
    try {
      let o = await m.promises.readdir(n);
      if (!o) return;
      for (let a of o) {
        let c = a.replace(/^vault-/, "");
        F[c] || (await Re(c));
      }
    } catch (o) {
      o.code !== "ENOENT" && console.error("ERROR: " + o);
    }
  }
  async function Re(n) {
    console.log("Removing partition for vault " + n);
    let o = w.join(C, "Partitions", `vault-${n}`);
    return m.promises.rm(o, { recursive: !0, force: !0 });
  }
  let T = {},
    le = new WeakMap(),
    ue = !1,
    ee = null,
    te = Be([], !0);
  function K(n) {
    if (!n) return te;
    for (; !n.appMenu && le.has(n); ) n = le.get(n);
    return n.appMenu || te;
  }
  function ne() {
    let n = i.BrowserWindow.getFocusedWindow();
    if (!n || !R) return;
    let o = K(n);
    i.Menu.setApplicationMenu(o);
  }
  function Te(n) {
    return (
      !n.triggeredByAccelerator ||
      (!n.shiftKey && !n.ctrlKey && !n.metaKey && !n.altKey)
    );
  }
  function Be(n, o = !1) {
    let a = [];
    for (let e = n.length - 1; e >= 0; e--) {
      let t = n[e];
      (t.label === "&Window" || t.label === "&Help") &&
        (a.push(t), n.splice(e, 1));
    }
    function c(e) {
      e.forEach((t) => {
        if (t.appCommand) {
          let r = t.appCommand;
          ((t.id = r),
            (t.click = (s, f, y) => {
              if (f instanceof i.BrowserWindow) {
                if (!f) {
                  let D = fe();
                  if (D)
                    if (((f = T[D]), f && f.isMinimized())) f.restore();
                    else return;
                }
                f &&
                  Te(y) &&
                  f.webContents.executeJavaScript(
                    `app.commands.executeCommandById(${JSON.stringify(r)})`,
                  );
              }
            }),
            delete t.appCommand);
        }
        "submenu" in t && c(t.submenu);
      });
    }
    function u(e) {
      let t = [];
      for (let r of e) {
        let s = t.find((f) => (f.id && f.id === r.id) || f.label === r.label);
        if (s)
          for (let f of r.submenu) {
            let y =
              f.before && s.submenu.findIndex((D) => D.id === f.before[0]);
            y != null ? s.submenu.splice(y, 0, f) : s.submenu.push(f);
          }
        else t.push(r);
      }
      return t;
    }
    let p = u([
      ..._(R, () => [
        {
          label: "Obsidian",
          submenu: [
            {
              label: "About Obsidian",
              async click(e, t) {
                let r = `Version ${re} (Installer ${i.app.getVersion()})`;
                (
                  await i.dialog.showMessageBox(t, {
                    message: "Obsidian",
                    icon: w.join(d, "icon.png"),
                    detail: `${r}

Copyright \xA9 Dynalist Inc.`,
                    type: "info",
                    buttons: ["OK", "Copy"],
                    defaultId: 0,
                    cancelId: 0,
                  })
                ).response === 1 &&
                  i.clipboard.writeText(`About Obsidian
${r}`);
              },
            },
            { type: "separator" },
            { id: "preferences-section", visible: !1, label: "" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            {
              label: "Hide Obsidian",
              click: () => i.app.hide(),
              accelerator: "Cmd+H",
            },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            {
              label: "Quit Obsidian",
              click: () => i.app.quit(),
              accelerator: "Cmd+Q",
            },
          ],
        },
      ]),
      {
        label: "&File",
        submenu: [
          { id: "open-section", type: "separator" },
          { id: "open-vault", click: Z, label: "Open Vault..." },
          ..._(R || H, () => [
            {
              role: "recentDocuments",
              submenu: [
                { label: "Clear Recent", role: "clearRecentDocuments" },
              ],
            },
          ]),
          { type: "separator" },
          ..._(o, () => [{ id: "close-window", role: "close" }]),
          ..._(!R, () => [{ type: "separator" }, { id: "quit", role: "quit" }]),
        ],
      },
      {
        label: "&Edit",
        submenu: [
          { type: "separator", id: "undo-section" },
          { role: "undo" },
          {
            label: "Redo",
            accelerator: "CmdOrCtrl+Shift+Z",
            click: function (e, t, r) {
              if (t instanceof i.BrowserWindow)
                if (Te(r)) {
                  let s = R ? "metaKey" : "ctrlKey";
                  t.webContents.executeJavaScript(`
									activeDocument.activeElement.dispatchEvent(new KeyboardEvent('keydown', {
										keyCode: 90,
										which: 90,
										code: 'KeyZ',
										key: 'z',
										${s}: true,
										shiftKey: true,
										bubbles: true,
										cancelable: true,
									}));
								`);
                } else t.webContents.redo();
            },
          },
          { type: "separator", id: "copy-section" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          {
            role: "pasteAndMatchStyle",
            accelerator: R ? "Cmd+Shift+V" : "Shift+CommandOrControl+V",
          },
          {
            label: "Paste and Match Style",
            accelerator: R
              ? "Cmd+Option+Shift+V"
              : "Shift+CommandOrControl+Alt+V",
            click: (e, t) => {
              t instanceof i.BrowserWindow &&
                t.webContents.pasteAndMatchStyle();
            },
            visible: !1,
          },
          { role: "delete" },
          { role: "selectAll" },
          ..._(R, () => [
            { type: "separator", id: "speech-section" },
            {
              label: "Substitutions",
              submenu: [
                { role: "showSubstitutions" },
                { type: "separator" },
                { role: "toggleSmartQuotes" },
                { role: "toggleSmartDashes" },
                { role: "toggleTextReplacement" },
              ],
            },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]),
        ],
      },
      ...n,
      {
        label: "&View",
        submenu: [
          ..._(g, () => [{ role: "reload" }]),
          {
            id: "actual-size",
            label: "Actual Size",
            accelerator: "CommandOrControl+0",
            click(e, t) {
              t &&
                t instanceof i.BrowserWindow &&
                (t.webContents.zoomLevel = 0);
            },
          },
          {
            label: "Zoom In",
            accelerator: "CommandOrControl+=",
            click(e, t) {
              t &&
                t instanceof i.BrowserWindow &&
                t.webContents.executeJavaScript(`
									(() => {
										let wf = require('electron').webFrame;
										let zoom = wf.getZoomLevel();
										if (zoom < 3) {
											wf.setZoomLevel(zoom + 0.5);
										}
									})()
								`);
            },
          },
          {
            label: "Zoom Out",
            accelerator: "CommandOrControl+-",
            click(e, t) {
              t &&
                t instanceof i.BrowserWindow &&
                t.webContents.executeJavaScript(`
									(() => {
										let wf = require('electron').webFrame;
										let zoom = wf.getZoomLevel();
										if (zoom > -2.5) {
											wf.setZoomLevel(zoom - 0.5);
										}
									})()
								`);
            },
          },
          { id: "developer-section", type: "separator" },
          { role: "forceReload", accelerator: "" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "&Window",
        role: "window",
        submenu: [
          { role: "minimize", accelerator: R ? "CommandOrControl+M" : "" },
          { role: "front" },
          { type: "separator" },
          {
            id: "window-always-on-top",
            checked: !1,
            enabled: !1,
            type: "checkbox",
            label: "Always on Top",
            click(e, t) {
              if (t) {
                let r = t.isAlwaysOnTop();
                t.setAlwaysOnTop(!r);
              }
            },
          },
        ],
      },
      {
        label: "&Help",
        role: "help",
        submenu: [
          { label: "Open Help", click: () => Me() },
          { type: "separator", id: "help-links" },
          {
            label: "Homepage",
            click: () => i.shell.openExternal("https://obsidian.md"),
          },
          {
            label: "Community",
            click: () => i.shell.openExternal("https://obsidian.md/community"),
          },
          {
            label: "Help Center",
            click: () => i.shell.openExternal("https://help.obsidian.md/"),
          },
          { type: "separator" },
        ],
      },
      ...a,
    ]);
    return (c(p), i.Menu.buildFromTemplate(p));
  }
  function fe() {
    let n = null,
      o = null;
    for (let a in T) {
      let c = T[a];
      c.isDestroyed() ||
        ((!n || c.focusTime > n.focusTime) && ((n = c), (o = a)));
    }
    return o;
  }
  function $(n, o = !0) {
    if (T[n]) {
      let h = T[n];
      return (o && (h.isMinimized() && h.restore(), h.focus()), h);
    }
    let a = J(n),
      c = {
        width: 800,
        height: 600,
        minWidth: 200,
        minHeight: 150,
        backgroundColor: "#00000000",
        trafficLightPosition: { x: 19, y: 12 },
        show: !1,
        frame: Y,
        titleBarStyle: ae,
        webPreferences: {
          contextIsolation: !1,
          nodeIntegration: !0,
          nodeIntegrationInWorker: !0,
          spellcheck: !0,
          webviewTag: !0,
        },
        ...Ce(a),
      },
      u = new i.BrowserWindow(c);
    T[n] = u;
    let p = u.webContents,
      e = !1,
      t = () => {
        if (e) return;
        ((e = !0),
          a.isMaximized && u.maximize(),
          /* a.devTools && */ p.openDevTools(),
          u.show());
        let h = a.zoom;
        h &&
          typeof h == "number" &&
          p.executeJavaScript(
            `require('electron').webFrame.setZoomLevel(${a.zoom})`,
          );
      };
    ((u.menuBarVisible = !1), L && !R && N(() => u.setIcon(L)));
    function r() {
      return !u.isMaximized() && !u.isMinimized() && !u.isFullScreen();
    }
    function s() {
      try {
        let h = u.getBounds();
        (r() &&
          ((a.x = h.x),
          (a.y = h.y),
          (a.width = h.width),
          (a.height = h.height)),
          (a.isMaximized = u.isMaximized()),
          (a.devTools = p.isDevToolsOpened()),
          (a.zoom = p.zoomLevel));
      } catch (h) {}
    }
    (p.on("did-finish-load", () => {
      u.loaded = !0;
    }),
      we(u, !0));
    let f = (h) => {
      h.on("context-menu", (x, O) => {
        if (ee && ee === p.id) {
          ee = null;
          try {
            let {
              editFlags: k,
              misspelledWord: U,
              dictionarySuggestions: me,
            } = O;
            p.send("context-menu", {
              editFlags: k,
              misspelledWord: U,
              dictionarySuggestions: me,
              webContentsId: h.id,
            });
            return;
          } catch (k) {
            console.error(k);
          }
        }
        ze(u, h, O);
      });
    };
    (f(p),
      u.on("close", (h) => {
        (s(),
          P(n, a),
          setTimeout(() => {
            !h.defaultPrevented && !u.isDestroyed() && u.destroy();
          }, 3e3));
      }),
      u.on("closed", () => {
        (delete T[n], !ue && (q || Object.keys(T).length > 0) && ke(n, !1));
      }));
    let y;
    function D() {
      (clearTimeout(y), (y = setTimeout(s, 100)));
    }
    return (
      u.on("resize", D),
      u.on("move", D),
      u.on("ready-to-show", t),
      p.on("did-create-window", (h) => {
        let x = h.webContents;
        (le.set(h, u), L && !R && N(() => h.setIcon(L)), we(h, !1), f(x));
      }),
      u.loadURL(Se).then(t, t),
      ke(n, !0),
      u
    );
  }
  function Ie(n) {
    let o = new i.BrowserWindow({
      width: 800,
      height: 600,
      resizable: !1,
      maximizable: !1,
      fullscreenable: !1,
      show: !1,
      frame: Y,
      titleBarStyle: ae,
      backgroundColor: "#1e1e1e",
      webPreferences: { contextIsolation: !1, nodeIntegration: !0 },
      ...n,
    });
    return (
      L && !R && N(() => o.setIcon(L)),
      De(o.webContents),
      (o.menuBarVisible = !1),
      o.on("focus", () => {
        ne();
      }),
      o
    );
  }
  let q;
  function Z() {
    if (q) {
      (q.isMinimized() && q.restore(), q.focus());
      return;
    }
    let n = (q = Ie({ width: 800, height: 650 }));
    n.on("closed", () => {
      q = null;
    });
    let o = () => n.show();
    n.loadURL(W + "starter.html").then(o, o);
  }
  let z;
  function Me() {
    if (z) {
      (z.isMinimized() && z.restore(), z.focus());
      return;
    }
    let n = (z = Ie({ width: 600, height: 600 }));
    n.on("closed", () => {
      z = null;
    });
    let o = () => n.show();
    n.loadURL(W + "help.html").then(o, o);
  }
  let ce = null;
  i.app.on("will-finish-launching", () => {
    i.app.once("open-url", (n, o) => {
      (n.preventDefault(), (ce = o));
    });
  });
  let de = () => {
    for (let n in F) F[n].open && $(n);
    Object.keys(T).length === 0 && Z();
  };
  function pe(n, o, a) {
    let c = n.getMenuItemById(o);
    if (c) for (let u in a) c[u] = a[u];
  }
  (i.app.whenReady().then(() => {
    i.app.on("second-instance", (e, t) => {
      Ve(t) || Z();
    });
    let n = (e) => {
      let t = !1;
      return (
        e.indexOf("?") > 0 && (e = e.substring(0, e.indexOf("?"))),
        e.indexOf("#") > 0 && (e = e.substring(0, e.indexOf("#"))),
        e.indexOf(W) === 0
          ? ((e = decodeURIComponent(e.substring(W.length))),
            (e = w.resolve(w.join(d, e))),
            e.indexOf(w.resolve(d)) !== 0 && (e = ""),
            (t = !0))
          : e.indexOf(se) === 0
            ? ((e = decodeURIComponent(e.substring(se.length))),
              H || (e = "/" + e),
              (e = w.resolve(e)),
              _e(e) && (t = !0))
            : (e = ""),
        { url: e, noframe: t }
      );
    };
    (i.protocol.registerFileProtocol
      ? i.protocol.registerFileProtocol("app", (e, t) => {
          let { url: r, noframe: s } = n(e.url),
            f = {};
          (s && (f["X-Frame-Options"] = "DENY"), t({ path: r, headers: f }));
        })
      : i.protocol.handle("app", async (e) => {
          let { url: t, noframe: r } = n(e.url);
          if (!t) return new Response("Not Found", { status: 400 });
          try {
            let s = await m.promises.stat(t),
              f = 200,
              y,
              D = new Headers(),
              h = e.headers.get("Range");
            if (h) {
              let x = h.match(/^bytes=(\d*)-(\d*)/);
              if (!x)
                return new Response("Range Not Satisfiable", { status: 416 });
              let O = Number(x[1] || 0),
                k = Number(x[2] || s.size - 1);
              if (isNaN(O) || isNaN(k) || O < 0 || k > s.size - 1 || k < O)
                return new Response("Range Not Satisfiable", { status: 416 });
              (D.set("Accept-Ranges", "bytes"),
                D.set("Content-Length", `${k - O + 1}`),
                D.set("Content-Range", `bytes ${O}-${k}/${s.size}`),
                (f = 206),
                (y = m.createReadStream(t, { start: O, end: k })));
            } else
              (D.set("Content-Length", `${s.size}`),
                (y = m.createReadStream(t)));
            return (
              D.set("Access-Control-Allow-Origin", "*"),
              D.set("Last-Modified", s.mtime.toUTCString()),
              r && D.set("X-Frame-Options", "DENY"),
              new Response(y, { status: f, headers: D })
            );
          } catch (s) {
            return (
              console.error(s),
              new Response("Not Found", { status: 400 })
            );
          }
        }),
      i.ipcMain.on("is-dev", (e) => {
        e.returnValue = g;
      }),
      i.ipcMain.on("desktop-dir", (e) => {
        e.returnValue = I;
      }),
      i.ipcMain.on("documents-dir", (e) => {
        e.returnValue = v;
      }),
      i.ipcMain.on("resources", (e) => {
        e.returnValue = d;
      }),
      i.ipcMain.on("version", (e) => {
        e.returnValue = re;
      }),
      i.ipcMain.on("file-url", (e) => {
        e.returnValue = se;
      }),
      i.ipcMain.on("relaunch", (e) => {
        ((e.returnValue = ""),
          console.log("Relaunching!"),
          (ue = !0),
          i.app.relaunch(),
          i.app.quit());
      }),
      i.ipcMain.on("update", (e) => {
        e.returnValue = A;
      }),
      i.ipcMain.on("check-update", (e, t) => {
        (t &&
          (b.updateDisabled && l.emit("disable", !1),
          l.emit("check"),
          b.updateDisabled && setTimeout(() => l.emit("disable", !0), 50)),
          (e.returnValue = E));
      }),
      i.ipcMain.on("disable-update", (e, t) => {
        (t === !0
          ? ((b.updateDisabled = !0),
            l.emit("disable", !0),
            B(),
            console.log("Updates disabled."))
          : t === !1 &&
            (delete b.updateDisabled,
            l.emit("disable", !1),
            B(),
            console.log("Updates enabled.")),
          (e.returnValue = b.updateDisabled));
      }),
      i.ipcMain.on("copy-asar", (e, t) => {
        try {
          let r = w.basename(t),
            s = /^obsidian-(\d+\.\d+\.\d+)/.exec(r),
            f = w.join(C, `${s[0]}.asar`);
          (He.copyFileSync(t, f), (e.returnValue = !0));
        } catch (r) {
          (console.error("Failed to copy asar", r), (e.returnValue = !1));
        }
      }),
      i.ipcMain.on("disable-gpu", (e, t) => {
        (t === !0
          ? ((b.disableGpu = !0), B())
          : t === !1 && (delete b.disableGpu, B()),
          (e.returnValue = b.disableGpu));
      }),
      i.ipcMain.on("insider-build", (e, t) => {
        (t === !0
          ? ((b.insider = !0), l.emit("insider", !0), B())
          : t === !1 && (delete b.insider, l.emit("insider", !1), B()),
          (e.returnValue = b.insider));
      }),
      i.ipcMain.on("frame", (e, t) => {
        (typeof t == "string" && ((b.frame = t), t || delete b.frame, B()),
          (e.returnValue = b.frame));
      }),
      i.ipcMain.on("adblock-lists", (e, t) => {
        (Array.isArray(t) && ((b.adblock = t), B(), X()),
          (e.returnValue = b.adblock || Ee));
      }),
      i.ipcMain.on("adblock-frequency", (e, t) => {
        (typeof t == "number" && ((b.adblockFrequency = t), B(), X()),
          (e.returnValue = b.adblockFrequency || Oe));
      }),
      i.ipcMain.on("print-to-pdf", async (e, t) => {
        console.log("Saving PDF...");
        let r = e.sender;
        try {
          let { filepath: s } = t,
            f = await r.printToPDF(t);
          (await m.promises.writeFile(s, f), t.open && ye(s));
        } finally {
          (console.log("Done."), r.send("print-to-pdf", {}));
        }
      }),
      i.ipcMain.on("vault", (e) => {
        for (let t in T)
          if (T[t].webContents === e.sender) {
            e.returnValue = { id: t, path: w.resolve(F[t].path) };
            return;
          }
        e.returnValue = {};
      }),
      i.ipcMain.on("vault-list", (e) => {
        e.returnValue = F;
      }),
      i.ipcMain.on("vault-remove", (e, t) => {
        if (t && typeof t == "string") {
          for (let r in F)
            if (F[r].path === t) {
              if (T[r]) {
                e.returnValue = !1;
                return;
              }
              ((e.returnValue = !0), delete F[r], B(), be(r), Re(r));
              return;
            }
        }
        e.returnValue = !1;
      }),
      i.ipcMain.on("vault-move", (e, t, r) => {
        if (t && typeof t == "string")
          for (let s in F) {
            let f = F[s];
            if (f.path === t) {
              if (T[s]) {
                e.returnValue = "EVAULTOPEN";
                return;
              }
              try {
                m.renameSync(t, r);
              } catch (y) {
                e.returnValue = y.toString();
                return;
              }
              ((e.returnValue = ""), (f.path = r), B());
              return;
            }
          }
        e.returnValue = !1;
      }),
      i.ipcMain.on("vault-open", (e, t, r) => {
        if (r) {
          if (m.existsSync(t)) {
            e.returnValue = "Vault already exists";
            return;
          }
          try {
            m.mkdirSync(t, { recursive: !0 });
          } catch (s) {
            e.returnValue = s.toString();
            return;
          }
        }
        e.returnValue = c(t);
      }),
      i.ipcMain.on("vault-message", (e, t, r) => {
        t = w.resolve(t);
        for (let s in F)
          if (F[s].path === t) {
            Le(s, r);
            break;
          }
        e.returnValue = "";
      }),
      i.ipcMain.on("starter", (e) => {
        ((e.returnValue = null), Z());
      }),
      i.ipcMain.on("help", (e) => {
        ((e.returnValue = null), Me());
      }),
      i.ipcMain.on("sandbox", (e) => {
        ((e.returnValue = null), u());
      }),
      i.ipcMain.on("context-menu", (e) => {
        ee = e.sender.id;
      }),
      i.ipcMain.on("request-url", async (e, t, r) => {
        try {
          let { url: s, method: f, contentType: y, body: D, headers: h } = r,
            x = i.net.request({ url: s, method: f, redirect: "follow" });
          if ((y && x.setHeader("Content-Type", y), h))
            for (let O in h)
              try {
                x.setHeader(O, h[O]);
              } catch (k) {
                console.error(k);
              }
          (x.on("login", (O, k) => k()),
            x.on("error", (O) => {
              e.reply(t, { error: O });
            }),
            x.on("response", (O) => {
              let k = [];
              (O.on("data", (U) => k.push(U)),
                O.on("end", () => {
                  let U = Buffer.concat(k),
                    me = U.buffer.slice(
                      U.byteOffset,
                      U.byteOffset + U.byteLength,
                    );
                  e.reply(t, {
                    status: O.statusCode,
                    headers: O.headers,
                    body: me,
                  });
                }));
            }),
            typeof D == "string"
              ? x.write(D)
              : D instanceof ArrayBuffer &&
                x.write(Buffer.from(new Uint8Array(D))),
            x.end());
        } catch (s) {
          e.reply(t, { error: s });
        }
      }),
      i.ipcMain.on("open-url", (e, t) => {
        let r = i.BrowserWindow.fromWebContents(e.sender);
        r && typeof t == "string" && Q(r, t);
      }),
      i.ipcMain.on("trash", async (e, t) => {
        try {
          (await i.shell.trashItem(t), (e.returnValue = !0));
        } catch (r) {
          (console.log(r), (e.returnValue = !1));
        }
      }),
      i.ipcMain.on("get-documents-path", (e) => {
        e.returnValue = v;
      }),
      i.ipcMain.on("get-sandbox-vault-path", (e) => {
        e.returnValue = xe;
      }),
      i.ipcMain.on("get-default-vault-path", (e) => {
        e.returnValue = $e;
      }),
      i.ipcMain.on("set-menu", (e, { template: t }) => {
        let r = i.BrowserWindow.fromWebContents(e.sender);
        if (!r) return;
        let s = Be(t);
        ((r.appMenu = s), R ? ne() : r.setMenu(s));
      }),
      i.ipcMain.on("update-menu-items", (e, t, r) => {
        let s = i.BrowserWindow.fromWebContents(e.sender),
          f = K(s);
        if (f !== te) {
          for (let { itemId: y, eState: D } of t) pe(f, y, D);
          r && ne();
        }
      }),
      i.ipcMain.on("render-menu", (e) => {
        let t = i.BrowserWindow.fromWebContents(e.sender);
        K(t).popup({ window: t });
      }),
      i.ipcMain.on("set-icon", (e, t, r) => {
        (b.icon && m.rmSync(w.join(C, b.icon), { force: !0 }),
          t && r ? m.writeFileSync(w.join(C, t), r) : (t = null),
          (b.icon || "") !== (t || "") &&
            (t ? (b.icon = t) : delete b.icon, B()),
          (e.returnValue = null));
      }),
      i.ipcMain.on("get-icon", (e) => {
        e.returnValue = b.icon;
      }),
      i.ipcMain.on("create-browser-session", async (e, t, r) => {
        let s = M[t];
        (s ||
          (r === !0 && X(),
          (s = { session: i.session.fromPartition(t), adblock: !!r }),
          (M[t] = s),
          s.session.setUserAgent(
            s.session
              .getUserAgent()
              .split(" ")
              .filter((f) => !/^(obsidian|electron)/i.test(f))
              .join(" "),
          ),
          s.session.webRequest.onBeforeRequest(
            { urls: ["https://*/*", "http://*/*"] },
            (f, y) => {
              let D = s.adblock && j.matches(f.url);
              y({ cancel: D });
            },
          ),
          s.session.webRequest.onBeforeSendHeaders(
            { urls: ["https://*/*", "http://*/*"] },
            (f, y) => {
              let { requestHeaders: D } = f;
              for (let h in D)
                h.toLowerCase() === "sec-fetch-dest" ||
                h.toLowerCase() === "sec-ch-ua"
                  ? delete D[h]
                  : h.toLowerCase() === "user-agent" &&
                    f.url.startsWith("https://accounts.google.com/") &&
                    (D[h] = "Chrome");
              y({ requestHeaders: D });
            },
          ),
          s.session.setPermissionCheckHandler((f, y, D) => ve.includes(y)),
          s.session.setPermissionRequestHandler((f, y, D, h) => {
            D(ve.includes(y));
          }),
          s.session.setDevicePermissionHandler((f) => !1)),
          (r === !0 || r === !1) && (s.adblock = r));
      }));
    let o = i.session.defaultSession.webRequest;
    (o.onBeforeRequest({ urls: [oe + "*/*"] }, (e, t) => {
      let { frame: r, url: s } = e,
        f = r.origin,
        y = !0;
      (f + "/" === W && (y = !1),
        f === "null" && r === r.top && s.startsWith(W) && (y = !1),
        t({ cancel: y }));
    }),
      o.onBeforeSendHeaders({ urls: ["https://*/*", "http://*/*"] }, (e, t) => {
        let { requestHeaders: r } = e;
        for (let s in r)
          (s.toLowerCase() === "sec-fetch-dest" ||
            s.toLowerCase() === "sec-ch-ua") &&
            delete r[s];
        t({ requestHeaders: r });
      }),
      o.onHeadersReceived({ urls: ["https://*/*", "http://*/*"] }, (e, t) => {
        let {
            responseHeaders: r,
            resourceType: s,
            frame: f,
            webContents: y,
          } = e,
          D = s === "subFrame";
        try {
          if (!D) {
            let h = y.mainFrame;
            D = h.framesInSubtree
              .filter((x) => x !== h)
              .some(
                (x) =>
                  x.routingId === f.routingId && x.processId === f.processId,
              );
          }
        } catch (h) {}
        for (let h in r)
          (h.toLowerCase() === "x-frame-options" && delete r[h],
            h.toLowerCase() === "cross-origin-opener-policy" && delete r[h],
            h.toLowerCase() === "content-security-policy" &&
              (r[h] = r[h].map((x) =>
                x.replace(/\s*frame-ancestors [^;]*(;|$)/g, ""),
              )),
            h.toLowerCase() === "set-cookie" &&
              D &&
              (r[h] = r[h].map((x) =>
                /Secure;/i.test(x)
                  ? x.replace(/SameSite=Lax/i, "SameSite=None")
                  : x,
              )));
        t({ responseHeaders: r });
      }));
    let a = () => !1;
    ((o.onBeforeRequest = a),
      (o.onBeforeSendHeaders = a),
      (o.onHeadersReceived = a));
    for (let e of [i.protocol, i.session.defaultSession.protocol])
      ((e.interceptBufferProtocol = a),
        (e.interceptStreamProtocol = a),
        (e.interceptStringProtocol = a),
        (e.interceptFileProtocol = a),
        (e.interceptHttpProtocol = a),
        (e.handle = a));
    i.session.defaultSession.setPermissionRequestHandler((e, t, r, s) => {
      let f = e.getURL().startsWith(W);
      (s.isMainFrame &&
        s.requestingUrl === "about:blank" &&
        t.startsWith("clipboard-") &&
        (f = !0),
        t === "openExternal" ? (f = !1) : t === "fullscreen" && (f = !0),
        f || console.log("Blocked permission request", e.getURL(), t, s),
        r(f));
    });
    function c(e) {
      if (e && typeof e == "string") {
        if (((e = w.resolve(e)), !m.existsSync(e))) return "folder not found";
        if (!Ke(e)) return "no permission to access folder";
        for (let r in F) {
          let s = F[r];
          if (s.path === e)
            return ((s.ts = Date.now()), $(r), i.app.addRecentDocument(e), !0);
        }
        let t = qe(16);
        return (
          (F[t] = { path: e, ts: Date.now() }),
          $(t),
          i.app.addRecentDocument(e),
          !0
        );
      }
      return "folder not found";
    }
    function u() {
      let e = w.join(d, "sandbox"),
        t = xe;
      for (let r in T) {
        let s = F[r];
        if (s.path === t) {
          ((s.ts = Date.now()), $(r));
          return;
        }
      }
      try {
        m.rmSync
          ? m.rmSync(t, { recursive: !0 })
          : m.rmdirSync(t, { recursive: !0 });
      } catch (r) {
        r.code !== "ENOENT" && console.error(r);
      }
      (p(e, t), c(t));
    }
    function p(e, t) {
      m.mkdirSync(t, { recursive: !0 });
      let r = m.readdirSync(e);
      for (let s of r) {
        let f = w.join(e, s),
          y = m.statSync(f),
          D = t + "/" + s;
        (y.isFile() && m.writeFileSync(D, m.readFileSync(f)),
          y.isDirectory() && p(f, D));
      }
    }
    if (
      (i.app.setAboutPanelOptions({
        applicationName: "Obsidian",
        applicationVersion: re + " (installer " + i.app.getVersion() + ")",
        version: "",
        copyright: "Copyright \xA9 Dynalist Inc.",
        website: "https://obsidian.md",
      }),
      R && N(() => i.app.dock.setIcon(L)),
      i.Menu.setApplicationMenu(te),
      i.app.on("web-contents-created", (e, t) => {
        (Fe(t),
          (t.noContextMenu = !1),
          t.hostWebContents &&
            t.on("context-menu", (r, s) => {
              t.noContextMenu || ze(i.BrowserWindow.fromWebContents(t), t, s);
            }));
      }),
      i.app.on("open-file", function (e, t) {
        e.preventDefault();
        let r = w.resolve(t),
          s = "";
        for (let f in F) {
          let y = F[f].path;
          r.startsWith(y) && s.length < y.length && (s = y);
        }
        s && c(s);
      }),
      i.app.on("window-all-closed", () => {
        R || i.app.quit();
      }),
      i.app.on("before-quit", () => {
        ue = !0;
      }),
      i.app.on("activate", () => {
        i.BrowserWindow.getAllWindows().length === 0 && de();
      }),
      Ve(process.argv),
      ce && he(ce),
      i.app.on("open-url", function (e, t) {
        (e.preventDefault(), he(t));
      }),
      Object.keys(T).length === 0)
    )
      de();
    else {
      for (let e in F) T[e] || delete F[e].open;
      B();
    }
  }),
    !g &&
      !i.app.isDefaultProtocolClient("obsidian") &&
      i.app.setAsDefaultProtocolClient("obsidian"));
  let Pe = "obsidian://";
  function he(n) {
    if (!n.startsWith(Pe)) return;
    let o = n;
    (console.log("Received callback URL", n), (n = n.substr(Pe.length)));
    let a = {};
    if (n.startsWith("/")) {
      let e = n;
      (H && (e = n.substr(1)), (a.action = "open"), (a.path = decodeURI(e)));
    } else if (n.startsWith("sync-setup")) {
      Z();
      return;
    } else if (n.startsWith("vault/")) {
      n = n.substr(6);
      let e = n.split("/").map((t) => decodeURIComponent(t));
      ((a.action = "open"), (a.vault = e[0]), (a.file = e.slice(1).join("/")));
    } else {
      let e = "",
        t = "",
        r = n.indexOf("?"),
        s = n.indexOf("#", Math.max(0, r));
      (s >= 0 && ((t = n.substr(s + 1)), (n = n.substr(0, s)), (a.hash = t)),
        r >= 0 && ((e = n.substr(r + 1)), (n = n.substr(0, r))));
      for (let f of e.split("&")) {
        let y = f.split("="),
          D = "true";
        (y.length > 1 && (D = decodeURIComponent(y[1])),
          (a[decodeURIComponent(y[0])] = D));
      }
      a.action = n.replace(/\/+$/g, "");
    }
    let c = null,
      u = a.path,
      p = a.vault;
    if (u && typeof u == "string") {
      let e = w.resolve(u),
        t = "";
      for (let r in F) {
        let s = F[r].path;
        e.startsWith(s) && t.length < s.length && ((t = s), (c = r));
      }
      c && (a.file = e.substr(t.length));
    } else if (p && typeof p == "string")
      for (let e in F) {
        let t = F[e].path;
        if (e === p || w.basename(t).toUpperCase() === p.toUpperCase()) {
          c = e;
          break;
        }
      }
    else ((c = fe()), c || de(), (c = fe()));
    c
      ? Le(c, a)
      : i.dialog.showErrorBox(
          "Vault not found.",
          "Unable to find a vault for the URL " + o,
        );
  }
  function Le(n, o) {
    let a = $(n, !1),
      u = `(function(){var w=window,o=${JSON.stringify(o)};if(typeof w.OBS_ACT === "function"){w.OBS_ACT(o)}else{w.OBS_ACT=o}})()`,
      p = a.webContents;
    a.loaded
      ? p.executeJavaScript(u)
      : p.once("did-finish-load", () => p.executeJavaScript(u));
  }
  function Ve(n) {
    for (let o of n) if (o.startsWith("obsidian://")) return (he(o), !0);
    return !1;
  }
};
