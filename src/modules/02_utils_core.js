const {
  __extends,
  __assign,
  __rest,
  __awaiter,
  __generator,
  __values,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncValues,
} = require("tslib");
const KeyboardStyle = {
  Dark: "DARK",
  Light: "LIGHT",
  Default: "DEFAULT",
};
const CapacitorCore = require("@capacitor/core");
CapacitorCore.registerPlugin("Keyboard");

const VerticalStyles = {
  height: "",
  paddingTop: "",
  paddingBottom: "",
  marginTop: "",
  marginBottom: "",
};
const ll = new WeakMap(),
  cl = (function () {
    function e(e) {
      this.from = {};
      this.to = {};
      this.end = {};
      var t = e || {},
        n = t.duration,
        duration = undefined === n ? 100 : n,
        r = t.fn,
        o = undefined === r ? "ease-in-out" : r;
      this.duration = duration;
      this.fn = o;
    }
    e.prototype.addProp = function (key, from, to, end = null) {
      from !== null && (this.from[key] = from);
      to !== null && (this.to[key] = to);
      end !== null && (this.end[key] = end);
      return this;
    };
    return e;
  })();
function ul(e, t) {
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      e.style[n] = t[n];
    }
}
function getElementVerticalStyle(element) {
  const computedStyle = window.getComputedStyle(element);
  const computed = {};
  for (const key in VerticalStyles)
    if (VerticalStyles.hasOwnProperty(key)) {
      const value = computedStyle[key];
      if (value?.endsWith("px")) {
        var digitalValue = parseFloat(value.substr(0, value.length - 2));
        if (digitalValue !== 0) {
          computed[key] = digitalValue;
        }
      }
    }
  return computed;
}
function pl(e, t) {
  var n,
    i = ll.get(e);
  ll.delete(e);
  i &&
    ((e.style.transition = ""),
    (e.style.transitionProperty = ""),
    ul(e, i.props.end),
    i.win.clearTimeout(i.timer),
    e.removeEventListener("transitionend", i.fn),
    t || (n = i.complete) === null || undefined === n || n.call(i));
}
var dl = null;
function fl(e, props, complete) {
  pl(e);
  ul(e, props.from);
  var i = {
    props,
    fn: function () {
      return pl(e);
    },
    timer: 0,
    complete: complete,
    win: e.win,
  };
  ll.set(e, i);
  dl === null &&
    ((dl = []),
    setTimeout(function () {
      document.body.offsetHeight;
      var e = dl;
      dl = null;
      for (var t = 0, n = e; t < n.length; t++) {
        (0, n[t])();
      }
    }, 0));
  dl.push(function () {
    e.style.transition = "all " + props.duration + "ms " + props.fn;
    e.style.transitionProperty = Object.keys(props.from).join(", ");
    ul(e, props.to);
    e.addEventListener("transitionend", function (t) {
      if (t.target === e) {
        i.fn();
      }
    });
    i.timer = i.win.setTimeout(i.fn, props.duration + 50);
  });
}
function ml(e) {
  return new Promise(function (t) {
    return (function (e, t) {
      pl(e);
      var n = getElementVerticalStyle(e),
        i = new cl({
          duration: 100,
          fn: "cubic-bezier(.02, .01, .47, 1)",
        });
      for (var r in (i.addProp("overflowY", "clip", "clip", ""), n))
        if (n.hasOwnProperty(r)) {
          i.addProp(r, "0px", n[r] + "px", "");
        }
      fl(e, i, t);
    })(e, t);
  });
}
function gl(e) {
  return new Promise(function (t) {
    return (function (e, t) {
      pl(e);
      var n = getElementVerticalStyle(e),
        i = new cl({
          duration: 100,
          fn: "cubic-bezier(.02, .01, .47, 1)",
        });
      for (var r in (i.addProp("overflowY", "clip", "clip", ""), n))
        if (n.hasOwnProperty(r)) {
          i.addProp(r, n[r] + "px", "0px", "");
        }
      fl(e, i, t);
    })(e, t);
  });
}
async function toggleElementVisibility(e, t, n) {
  pl(e);
  if (t) {
    if (n) await gl(e);
    e.hide();
  } else {
    e.show();
    if (n) await ml(e);
  }
}
async function toggleElementMount(e, t, n, i) {
  if (n) {
    if (i) await gl(e);
    e.detach();
  } else {
    e.show();
    t.appendChild(e);
    if (i) await ml(e);
  }
}
async function animateSlideSwap(e, t, n) {
  const i = e.parentElement;
  const r = e.getBoundingClientRect();
  const o = n === "right" ? e : t;
  const a = n === "right" ? t : e;

  return new Promise((resolve) => {
    const cleanup = () => {
      e.detach();
      a.style.removeProperty("position");
      a.style.removeProperty("left");
      a.style.removeProperty("top");
      a.style.removeProperty("width");
      a.style.removeProperty("height");
      resolve(null);
    };

    if (!t.isShown()) {
      n === "right" ? i.insertAfter(t, e) : i.insertBefore(t, e);
    }

    if (e.isShown()) {
      a.style.position = "absolute";
      a.style.left = `${e.offsetLeft}px`;
      a.style.top = `${e.offsetTop}px`;
      a.style.width = `${r.width}px`;
      a.style.height = `${r.height}px`;

      if (n === "left") {
        fl(o, new cl({ duration, fn: "ease-out" }).addProp("transform", "translateX(-20%)", "translateX(0)", ""));
        fl(
          a,
          new cl({ duration, fn: easeOutSmooth }).addProp("transform", "translateX(0)", "translateX(100%)", ""),
          cleanup,
        );
      } else {
        fl(o, new cl({ duration, fn: "ease-out" }).addProp("transform", "translateX(0)", "translateX(-20%)", ""));
        fl(
          a,
          new cl({ duration, fn: easeOutSmooth }).addProp("transform", "translateX(100%)", "translateX(0)", ""),
          cleanup,
        );
      }
    } else {
      cleanup();
    }
  });
}
const duration = 180;
const easeOutSmooth = "cubic-bezier(0.33, 1, 0.68, 1)";
const easeInFast = "cubic-bezier(0.5, 0, 0.75, 0)";
const easeOutSine = "cubic-bezier(0.36, 0.66, 0.04, 1)";
function Ml(e, t, n, i = () => {}) {
  for (var r = 0, o = Array.prototype.slice.call(e.childNodes); r < o.length; r++) {
    pl(o[r]);
  }
  var a = e.firstChild;
  return a
    ? a !== t || a.nextSibling
      ? e.isShown()
        ? void (n === "left"
            ? (e.setChildrenInPlace([t, a]),
              fl(
                t,
                new cl({
                  duration: duration,
                  fn: "ease-out",
                }).addProp("transform", "translateX(-20%)", "translateX(0)", ""),
              ),
              fl(
                a,
                new cl({
                  duration: duration,
                  fn: easeOutSmooth,
                }).addProp("transform", "translateX(0)", "translateX(100%)", ""),
                function () {
                  a.detach();
                  i == null || i();
                },
              ))
            : (e.setChildrenInPlace([a, t]),
              fl(
                a,
                new cl({
                  duration: duration,
                  fn: "ease-out",
                }).addProp("transform", "translateX(0)", "translateX(-20%)", ""),
              ),
              fl(
                t,
                new cl({
                  duration: duration,
                  fn: easeOutSmooth,
                }).addProp("transform", "translateX(100%)", "translateX(0)", ""),
                function () {
                  a.detach();
                  i == null || i();
                },
              )))
        : (e.setChildrenInPlace([t]), void (i == null || i()))
      : void i()
    : (e.appendChild(t), void i());
}
function xl(callback) {
  let timer = null;
  const enterTime = Date.now();
  const resizeCallback = (event) => {
    if (!(event && Date.now() - enterTime < 100)) {
      window.clearTimeout(timer);
      window.removeEventListener("resize", resizeCallback);
      setTimeout(callback, 10);
    }
  };
  window.addEventListener("resize", resizeCallback);
  timer = window.setTimeout(resizeCallback, 500);
}
function Tl(e, t, n = "0.85") {
  var i = e.offsetHeight - 1,
    durationr0 = Math.clamp(0.35 * i, 100, 250);
  return new Promise(function (o) {
    fl(
      e,
      new cl({
        duration: durationr0,
        fn: "var(--anim-motion-swing)",
      }).addProp("transform", "translateY(".concat(i, "px)"), ""),
      function () {
        return o(null);
      },
    );
    t &&
      fl(
        t,
        new cl({
          duration: durationr0,
          fn: easeInFast,
        }).addProp("opacity", "0", n),
      );
  });
}
function Dl(e, t) {
  return new Promise(function (n) {
    var i = e.offsetHeight - 1,
      durationr0 = Math.clamp(0.35 * i, 100, 250);
    fl(
      e,
      new cl({
        duration: durationr0,
        fn: easeOutSine,
      }).addProp("transform", "", "translateY(".concat(i, "px)"), ""),
      function () {
        return n(null);
      },
    );
    fl(
      t,
      new cl({
        duration: durationr0,
        fn: easeOutSmooth,
      }).addProp("opacity", null, "0", ""),
    );
  });
}
function Al(e, t, n) {
  var i = e.document.body.createDiv();
  i.setCssStyles({
    position: "absolute",
    transform: "translate(-50%,-50%)",
    left: "".concat(t, "px"),
    top: "".concat(n, "px"),
    boxShadow: "0 0 6px 20px var(--color-accent)",
    borderRadius: "200px",
    zIndex: "999",
  });
  fl(
    i,
    new cl({
      duration: 200,
      fn: "ease-out",
    })
      .addProp("width", "0", "200px")
      .addProp("height", "0", "200px")
      .addProp("opacity", "1", "0"),
    function () {
      return i.detach();
    },
  );
}
function Pl(e, t) {
  return {
    x: e,
    y: t,
  };
}
function Ll(e) {
  return Pl(e.clientX, e.clientY);
}
function Il(e, t, width, height) {
  return {
    x: e,
    y: t,
    width: width,
    height: height,
  };
}
function Ol(e, t) {
  return Il(e.x, e.y, t.width, t.height);
}
function Fl(e, t) {
  return Math.hypot(e.x - t.x, e.y - t.y);
}
function Nl(e, t) {
  var n = parseFloat(e);
  return isNaN(n) ? t : n;
}
var Rl,
  Bl =
    -1 !== (Rl = navigator.appVersion).indexOf("Win")
      ? "Windows"
      : -1 !== Rl.indexOf("Mac")
        ? "macOS"
        : -1 !== Rl.indexOf("X11") || -1 !== Rl.indexOf("Linux")
          ? "Linux"
          : "Unknown OS",
  Vl = navigator.userAgent.toLowerCase(),
  isMacOS = Bl === "macOS",
  isWin = Bl === "Windows",
  isLinux = Bl === "Linux",
  Wl = Vl.indexOf("firefox") > -1,
  isSafari = /^((?!chrome|android).)*safari/i.test(Vl),
  _l = /android/i.test(Vl);
function jl(e) {
  return isMacOS && e.button === 0 && e.ctrlKey;
}
var Platform = {
  isDesktop: false,
  isMobile: false,
  isDesktopApp: false,
  isMobileApp: false,
  isIosApp: false,
  isAndroidApp: false,
  isPhone: false,
  isTablet: false,
  isMacOS: isMacOS,
  isWin: isWin,
  isLinux: isLinux,
  isSafari: isSafari,
  resourcePathPrefix: "file:///",
  get canExportPdf() {
    return Platform.isDesktopApp;
  },
  get canPopoutWindow() {
    return Platform.isDesktopApp && Platform.isDesktop;
  },
  get canStackTabs() {
    return !Platform.isPhone;
  },
  get canSplit() {
    return !Platform.isPhone;
  },
  get canDisplayRibbon() {
    return !Platform.isPhone;
  },
  get canPinSidebar() {
    return Platform.isMobile && !Platform.isPhone;
  },
  supportsIndexedDb: !!window.indexedDB,
  mobileSoftKeyboardVisible: false,
  hasPhysicalKeyboard: false,
};
function Kl(e, t) {
  var n = e[t];
  Object.defineProperty(e, t, {
    get: function () {
      return n;
    },
    set: function () {},
  });
}
var Yl = /&(amp|lt|gt|quot);/g,
  Zl = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
  };
function Xl(e) {
  return Zl[e];
}
function Ql(e) {
  return e.replace(Yl, Xl);
}
var $l = /[.?*+^$[\]\\(){}|-]/g;
function Jl(e) {
  return e.replace($l, "\\$&");
}
function ec(e) {
  return Array.from(new Set(e));
}
var tc = (function () {
  function e() {
    this.data = new Map();
  }
  e.prototype.add = function (e, t) {
    var n = this.data,
      i = n.get(e);
    i || ((i = []), n.set(e, i));
    i.contains(t) || i.push(t);
  };
  e.prototype.remove = function (e, t) {
    var n = this.data;
    if (n.has(e)) {
      var i = n.get(e);
      i.remove(t);
      i.length === 0 && n.delete(e);
    }
  };
  e.prototype.get = function (e) {
    return this.data.get(e) || null;
  };
  e.prototype.keys = function () {
    return Array.from(this.data.keys());
  };
  e.prototype.clear = function (e) {
    this.data.delete(e);
  };
  e.prototype.clearAll = function () {
    this.data.clear();
  };
  e.prototype.contains = function (e, t) {
    var n = this.data.get(e);
    return !!n && n.contains(t);
  };
  e.prototype.count = function () {
    for (var e = this.data, t = 0, n = 0, i = this.keys(); n < i.length; n++) {
      var r = i[n],
        o = e.get(r);
      if (o) {
        t += o.length;
      }
    }
    return t;
  };
  return e;
})();
function nc(e, t, n) {
  var i = e[t];
  e.splice(t, 1);
  e.splice(n, 0, i);
  return e;
}
function ic(e) {
  for (var t = [], n = 0; n < e; n++) t.push(((16 * Math.random()) | 0).toString(16));
  return t.join("");
}
function rc(e, t) {
  for (var n = 0, i = 0; i < t && -1 !== (i = e.indexOf("\n", i)) && !(i >= t); ) {
    i++;
    n++;
  }
  return n;
}
var oc = (function () {
  function e() {
    this.data = new Map();
  }
  e.prototype.add = function (e, t) {
    var n = this.data;
    n.has(e) ? n.get(e).add(t) : n.set(e, new Set([t]));
  };
  e.prototype.delete = function (e, t) {
    var n = this.data;
    if (n.has(e)) {
      var i = n.get(e);
      i.delete(t);
      i.size === 0 && n.delete(e);
    }
  };
  e.prototype.get = function (e) {
    return this.data.get(e);
  };
  e.prototype.getArray = function (e) {
    var t = this.data;
    return t.has(e) ? Array.from(t.get(e)) : [];
  };
  return e;
})();
function ac(e) {
  return typeof e != "object";
}
function sc(e, t) {
  if ((undefined === t && (t = "\t"), undefined !== e)) return lc(e, t).join("\n");
}
function lc(e, t) {
  if (undefined === e) return ["null"];
  if (ac(e) || !e || Object.prototype.toString.call(e) === "[object Date]") return [JSON.stringify(e)];
  if (Array.isArray(e)) {
    if (e.every(ac)) return [JSON.stringify(e)];
    for (var n = ["["], i = e.length - 1, r = 0; r <= i; r++)
      for (var o = (h = lc(e[r], t)).length - 1, a = 0; a <= o; a++) {
        var s = "\t" + h[a];
        a === o && r !== i && (s += ",");
        n.push(s);
      }
    n.push("]");
    return n;
  }
  if (typeof e == "object") {
    var l = true;
    for (var c in e)
      if (e.hasOwnProperty(c) && !ac(e[c])) {
        l = false;
        break;
      }
    if (l) return [JSON.stringify(e)];
    n = ["{"];
    var u = Object.keys(e).filter(function (t) {
      return undefined !== e[t];
    });
    for (i = u.length - 1, r = 0; r <= i; r++) {
      var h;
      c = u[r];
      (h = lc(e[c], t))[0] = JSON.stringify(c) + ":" + h[0];
      for (o = h.length - 1, a = 0; a <= o; a++) {
        s = "\t" + h[a];
        a === o && r !== i && (s += ",");
        n.push(s);
      }
    }
    n.push("}");
    return n;
  }
  return [""];
}
function cc(e, t) {
  for (var n = 0, i = e.length - 1; n <= i; ) {
    var r = Math.floor((n + i) / 2),
      o = e[r],
      a = t(o);
    if (a === 0) return o;
    a < 0 ? (i = r - 1) : (n = r + 1);
  }
  return null;
}
function uc(e, t) {
  if ((undefined === t && (t = false), Array.isArray(e))) {
    var n = e;
    t &&
      (n = n.filter(function (e) {
        return e != null;
      }));
    return n.every(function (e) {
      return typeof e == "string";
    });
  }
  return !1;
}
function hc(e, t) {
  return e.length <= t ? e : e.slice(0, t - 1).trim() + "…";
}
var pc = function (e) {
  return JSON.parse(JSON.stringify(e));
};
function dc(e, t, n) {
  for (var i = 0, r = Object.keys(e); i < r.length; i++) {
    var o = r[i],
      a = e[o];
    delete e[o];
    o === t && (o = n);
    e[o] = a;
  }
}
function debounce(e, t, n) {
  undefined === t && (t = 0);
  undefined === n && (n = false);
  var i = null,
    r = null,
    o = null,
    a = 0,
    s = 0,
    l = activeWindow,
    c = function () {
      var t = r,
        n = o;
      r = null;
      o = null;
      return e.apply(t, n);
    },
    u = function () {
      if (a) {
        var e = Date.now();
        if (e < a) {
          l = activeWindow;
          i = l.setTimeout(u, a - e);
          return void (a = 0);
        }
      }
      s = 0;
      i = null;
      c();
    },
    h = function () {
      for (var e = [], c = 0; c < arguments.length; c++) e[c] = arguments[c];
      r = this;
      o = e;
      var p = Date.now();
      i
        ? n
          ? (a = s = p + t)
          : l !== activeWindow && s <= p && (l.clearTimeout(i), (l = activeWindow), (i = l.setTimeout(u, 0)))
        : ((l = activeWindow), (s = p + t), (i = l.setTimeout(u, t)));
      return h;
    };
  h.cancel = function () {
    i && (l.clearTimeout(i), (i = null));
    return h;
  };
  h.run = function () {
    if (i) {
      l.clearTimeout(i);
      i = null;
      return c();
    }
  };
  return h;
}
var mc = window.queueMicrotask || window.setTimeout;
function gc(e) {
  var t = null,
    n = null,
    i = false,
    r = function () {
      i = false;
      var r = t,
        o = n;
      t = null;
      n = null;
      e.apply(r, o);
    };
  return function () {
    for (var e = [], o = 0; o < arguments.length; o++) e[o] = arguments[o];
    t = this;
    n = e;
    i || ((i = true), mc(r));
  };
}
function vc(value) {
  if (navigator.clipboard && navigator.permissions) navigator.clipboard.writeText(value);
  else {
    var t = activeDocument.createElement("textarea");
    t.value = value;
    t.style.top = "0";
    t.style.left = "0";
    t.style.position = "fixed";
    activeDocument.body.appendChild(t);
    try {
      t.focus({
        preventScroll: !0,
      });
      t.select();
      activeDocument.execCommand("copy");
    } catch (e) {}
    activeDocument.body.removeChild(t);
  }
}
async function copyToClipboard(data) {
  const item = {};
  item[data.type] = data;
  return navigator.clipboard.write([new ClipboardItem(item)]);
}

async function getBlobArrayBuffer(data) {
  if (data.arrayBuffer) {
    return data.arrayBuffer();
  }
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      resolve(evt.target.result);
    };
    reader.onabort = reader.onerror = function (evt) {
      reject(evt);
    };
    reader.readAsArrayBuffer(data);
  });
}
async function preloadImage(element, src) {
  const alt = element.getAttr("alt") || null;
  const img = element.createEl("img", { attr: { alt } });
  const width = element.getAttr("width");
  const height = element.getAttr("height");
  if (width) img.setAttr("width", width);
  if (height) img.setAttr("height", height);

  return new Promise((resolve) => {
    const onDone = () => resolve();
    img.addEventListener("load", onDone);
    img.addEventListener("error", onDone);
    activeWindow.setTimeout(onDone, 5e3);
    img.src = src;
  });
}
async function getImageNaturalSize(src) {
  return new Promise((resolve) => {
    const img = new Image();
    const onDone = () => {
      if (img) {
        img.naturalWidth && img.naturalHeight
          ? resolve({ width: img.naturalWidth, height: img.naturalHeight })
          : resolve(null);
      }
    };
    img.addEventListener("load", onDone);
    img.addEventListener("error", onDone);
    activeWindow.setTimeout(onDone, 5000);
    img.src = src;
  });
}
async function preloadAudio(element, src) {
  const audio = element.createEl("audio", { attr: { controls: "", controlsList: "nodownload" } });
  return new Promise((resolve) => {
    const onDone = () => resolve();
    audio.addEventListener("loadedmetadata", onDone);
    audio.addEventListener("error", onDone);
    activeWindow.setTimeout(onDone, 5000);
    audio.src = src;
  });
}
async function preloadVideo(element, src) {
  const win = element.win;
  const video = element.createEl("video", { attr: { controls: "", preload: "metadata" } });

  return new Promise((resolve) => {
    let timer;
    const onDone = () => {
      timer && win.clearTimeout(timer);
      timer = null;
      video.style.height = "";
      resolve();
    };

    video.addEventListener("loadedmetadata", () => {
      if (video.videoWidth === 0 && video.videoHeight === 0) {
        video.src = "";
        element.removeChild(video);
        preloadAudio(element, src).then(onDone, onDone);
      } else {
        onDone();
      }
    });
    video.addEventListener("error", onDone);
    video.style.height = "0";
    timer = win.setTimeout(onDone, 5000);
    video.src = src + "#t=0.001";
  });
}
function Sc(e, timeout) {
  var n = activeWindow;
  if (timeout > 0 && n.requestIdleCallback) {
    var i = false,
      r = n.requestIdleCallback(
        function () {
          i = true;
          n.clearTimeout(o);
          e();
        },
        {
          timeout: timeout,
        },
      ),
      o = n.setTimeout(function () {
        i = true;
        n.cancelIdleCallback(r);
        e();
      }, timeout);
    return {
      high: false,
      cancel: function () {
        if (!i) {
          i = true;
          n.cancelIdleCallback(r);
          n.clearTimeout(o);
        }
      },
    };
  }
  var a = n.requestAnimationFrame(e);
  return {
    high: true,
    cancel: function () {
      return n.cancelAnimationFrame(a);
    },
  };
}
function Mc(e, t) {
  var n = e.relatedTarget;
  return !n || !t.contains(n);
}
function xc(e) {
  e.addEventListener("mousedown", function (e) {
    if (e.button === 1) {
      e.preventDefault();
    }
  });
}
var Tc,
  Dc = /bot|crawl|spider/i.test(navigator.userAgent);
function Ac() {
  if (Tc) {
    Tc();
  }
}
var Pc = "mobile-tap",
  Lc = "a, button, .tappable, .is-clickable, .clickable-icon, .text-icon-button, .suggestion-item",
  Ic = null;
var touchEventPosition = {
  sx: 0,
  sy: 0,
  ex: 0,
  ey: 0,
  t: 0,
};
function Fc(e, t) {
  var n = 0,
    i = 0,
    r = 0,
    o = 0,
    a = function (e) {
      if (e.touches.length === 1) {
        var t = e.touches[0];
        n = t.identifier;
        i = t.clientX;
        r = t.clientY;
        o = Date.now();
        window.addEventListener("touchend", s);
        window.addEventListener("touchcancel", s);
      }
    },
    s = function (e) {
      var a = Rc(e, n);
      if (
        (e.touches.length === 0 || a) &&
        (window.removeEventListener("touchend", s),
        window.removeEventListener("touchcancel", s),
        e.type === "touchend" &&
          a &&
          Date.now() - o < 600 &&
          Math.abs(i - a.clientX) < 5 &&
          Math.abs(r - a.clientY) < 5)
      ) {
        var l = new MouseEvent("click", {
          clientX: a.clientX,
          clientY: a.clientY,
          button: 0,
          buttons: 0,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(l, "target", {
          writable: false,
          value: e.target,
        });
        t(l, e.target);
        l.defaultPrevented && e.preventDefault();
      }
    };
  e.addEventListener("touchstart", a);
  return function () {
    return e.removeEventListener("touchstart", a);
  };
}
function Nc(e) {
  return (
    touchEventPosition &&
    Date.now() - touchEventPosition.t < 1000 &&
    ((Math.abs(e.clientX - touchEventPosition.sx) < 5 && Math.abs(e.clientY - touchEventPosition.sy) < 5) ||
      (Math.abs(e.clientX - touchEventPosition.ex) < 5 && Math.abs(e.clientY - touchEventPosition.ey) < 5))
  );
}
function Rc(e, t) {
  for (var n = e.changedTouches, i = 0; i < n.length; i++) {
    var r = n[i];
    if (r.identifier === t) return r;
  }
  return null;
}
function Bc(e) {
  if (!e.parentElement) return e;
  var t = e.parentElement;
  return t.scrollHeight > t.clientHeight ? t : Bc(t);
}
function Vc(e, t, n, i, r, o) {
  var a,
    s,
    l = Platform.isMobile;
  i *= i;
  s = function (e, a) {
    if (n.firstChild !== n.lastChild) {
      e.preventDefault();
      var s,
        c = e.win,
        u = e.win.document,
        clientX = a.clientX,
        clientY = a.clientY,
        d = false,
        f = !l,
        m = t.getBoundingClientRect(),
        g = clientX - m.x,
        v = clientY - m.y,
        y = 0,
        b = null;
      c.setTimeout(function () {
        if (!d) {
          f = true;
          e instanceof TouchEvent && (Al(c, clientX, clientY), navigator.vibrate(200));
        }
      }, 250);
      var w = 0,
        scrollTop = 0,
        C = 0,
        E = Bc(n),
        S = E.getBoundingClientRect(),
        M = function (e) {
          var i,
            r = Array.from(n.childNodes);
          for (i = 0; i < r.length - 1; i++) {
            var o = r[i].getBoundingClientRect();
            if (e - v + y / 2 < o.bottom) break;
          }
          if (r[i] !== t) {
            var scrollTop = E.scrollTop;
            t.detach();
            var s = n.childNodes[i];
            n.insertBefore(t, s);
            E.scrollTop = scrollTop;
            Platform.isMobile && navigator.vibrate(0);
          }
          return i;
        },
        x = function () {
          var e;
          if (w !== 0) {
            undefined === e && (e = 0.9);
            scrollTop = scrollTop * e + w * (1 - e);
            E.scrollTop += scrollTop;
            M(C);
          }
        };
      return {
        move: function (e, n) {
          var o = n.clientX,
            a = (C = n.clientY);
          if (b === null) {
            var l = o - clientX,
              m = a - clientY;
            if (!(d = l * l + m * m >= i) || !f) return !0;
            var E = t.offsetWidth,
              T = t.offsetHeight;
            b = createDiv("drag-reorder-ghost");
            var D = t.cloneNode(!0);
            D.setAttribute("aria-label", null);
            b.appendChild(D);
            D.style.width = E + "px";
            D.style.height = T + "px";
            u.body.appendChild(b);
            u.body.addClass("is-grabbing");
            t.addClass("drag-ghost-hidden");
            r();
            var A = b.getBoundingClientRect(),
              P = D.getBoundingClientRect();
            g += P.x - A.x;
            v += P.y - A.y;
            y = A.height;
            s = c.setInterval(x, 1e3 / 60);
          }
          e.preventDefault();
          var L = Math.min(50, S.height / 3),
            I = S.top + L,
            O = S.bottom - L,
            F = a - v,
            N = F + y;
          F < I ? (w = (F - I) / L) : N > O ? (w = (N - O) / L) : ((w = 0), (scrollTop = 0));
          w = 10 * Math.clamp(w, -1, 1);
          M(C);
          b.style.left = o - g + "px";
          b.style.top = a - v + "px";
          return !0;
        },
        end: function (e, i) {
          if (b) {
            e.preventDefault();
            var r = M(C);
            u.body.removeClass("is-grabbing");
            t.removeClass("drag-ghost-hidden");
            t.detach();
            b.detach();
            var a = n.childNodes[r];
            n.insertBefore(t, a);
            c.clearInterval(s);
            o(r);
          } else if (e.instanceOf(TouchEvent)) {
            e.target.dispatchEvent(
              new MouseEvent("click", {
                button: 0,
                buttons: 0,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
                screenX: i.screenX,
                screenY: i.screenY,
                bubbles: true,
                cancelable: true,
                clientX: clientX,
                clientY: clientY,
              }),
            );
          }
        },
      };
    }
  };
  (a = e).addEventListener("mousedown", function (e) {
    if (e.button === 0 && !Nc(e)) {
      var t = s(e, e);
      if (t) {
        var n = function (e) {
            if (!t.move(e, e)) {
              o();
            }
          },
          i = function (e) {
            o();
            t.end(e, e);
          },
          r = e.win,
          o = function () {
            r.removeEventListener("mousemove", n);
            r.removeEventListener("mouseup", i);
          };
        r.addEventListener("mousemove", n);
        r.addEventListener("mouseup", i);
      }
    }
  });
  a.addEventListener(
    "touchstart",
    function (e) {
      if (!(e.touches.length > 1)) {
        var t = e.touches[0],
          n = s(e, t);
        if (n) {
          var i = t.identifier,
            r = function (e) {
              var t = Rc(e, i);
              if (t) {
                c();
                n.end(e, t);
              }
            },
            o = function (e) {
              var t = Rc(e, i);
              if (t) {
                c();
                n.end(e, t);
              }
            },
            a = function (e) {
              var t = Rc(e, i);
              if (t) {
                n.move(e, t) || c();
              }
            },
            l = e.win,
            c = function () {
              l.removeEventListener("touchcancel", o);
              l.removeEventListener("touchend", r);
              l.removeEventListener("touchmove", a);
            };
          l.addEventListener("touchcancel", o);
          l.addEventListener("touchend", r);
          l.addEventListener("touchmove", a, {
            passive: !1,
          });
        }
      }
    },
    {
      passive: !1,
    },
  );
}
function Hc(e) {
  for (var t = 0, n = e.findAll("audio, video"); t < n.length; t++) {
    var i = n[t];
    i.src = "";
    i.srcObject = null;
  }
}
function zc(e) {
  if (!e) return !1;
  try {
    new URL(e);
  } catch (e) {
    return !1;
  }
  return !0;
}
function qc(e) {
  return !e.contains(" ") && zc(e);
}
function Wc(e) {
  var t;
  try {
    t = new URL(e);
  } catch (e) {
    return !1;
  }
  return t.protocol === "http:" || t.protocol === "https:";
}
function _c(e) {
  return /^(([^<>()[\]\\.,;:\s@\"`]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/.test(
    e,
  );
}
async function canvasToBlob(data, t, n) {
  return new Promise((resolve) => {
    data.toBlob(resolve, t, n);
  });
}
function Kc(data) {
  return data.replace(/\u00A0|\u202F/g, " ");
}
function getFilename(e) {
  var t = e.lastIndexOf("/");
  return -1 === t ? e : e.slice(t + 1);
}
function Zc(e) {
  var t = e.lastIndexOf("/");
  return -1 === t ? "" : e.slice(0, t);
}
function Xc(e) {
  for (; e; ) {
    if (getFilename(e).startsWith(".")) return true;
    e = Zc(e);
  }
  return false;
}
function Qc(e) {
  var t = getFilename(e),
    n = t.lastIndexOf(".");
  return -1 === n || n === t.length - 1 || n === 0 ? t : t.substr(0, n);
}
function $c(e) {
  var t = e.lastIndexOf(".");
  return -1 === t || t === e.length - 1 || t === 0 ? e : e.substr(0, t);
}
function getExtension(filename) {
  const index = filename.lastIndexOf(".");
  return index < 1 || index === filename.length - 1 ? "" : filename.substr(index + 1).toLowerCase();
}
function eu(e, t) {
  return t ? e + "." + t : e;
}
function tu(e, t) {
  return getExtension(e) === t;
}
function normalizePath(e) {
  return Kc(iu(e)).normalize("NFC");
}
function iu(e) {
  (e = e.replace(/([\\/])+/g, "/").replace(/(^\/+|\/+$)/g, "")) === "" && (e = "/");
  return e;
}
function ru(e) {
  var t = getFilename(e);
  return getExtension(t) === "md" ? Qc(t) : t;
}
function ou(e) {
  return getExtension(getFilename(e)) === "md" ? $c(e) : e;
}
function su(e) {
  const au = {
    "image/bmp": "bmp",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/avif": "avif",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/m4a": "m4a",
    "audio/3gp": "3gp",
    "audio/flac": "flac",
    "audio/ogg": "opus",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "application/ogg": "ogg",
    "video/quicktime": "mov",
    "video/x-matroska": "mkv",
    "application/pdf": "pdf",
  };
  return au.hasOwnProperty(e) ? au[e] : "";
}
function lu(e) {
  return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
function cu(e) {
  return Buffer.from(e);
}
function uu(file) {
  return {
    ctime: Math.round(file.birthtimeMs),
    mtime: Math.round(file.mtimeMs),
    size: file.size,
  };
}