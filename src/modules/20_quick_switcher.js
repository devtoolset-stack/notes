var q2 = (function (e) {
  function t(t) {
    var n,
      i = e.call(this, t.app) || this;
    i.modalEl.addClass("mod-canvas-help");
    i.setTitle(H2.labelCanvasHelp());
    var r = i.contentEl.createDiv("canvas-help"),
      o = function (texte0, t) {
        r.createDiv(
          {
            cls: "canvas-instruction",
          },
          function (n) {
            n.createDiv({
              cls: "canvas-instruction-label",
              text: texte0,
            });
            n.createDiv(
              {
                cls: "canvas-instruction-desc",
              },
              function (e) {
                for (var n = 0, i = t; n < i.length; n++) {
                  var r = i[n];
                  e.createSpan({
                    cls: "setting-hotkey",
                    text: z2(r),
                  });
                }
              },
            );
          },
        );
      },
      a = [["Scroll"]],
      s = [["Shift", "Scroll"]],
      l = [
        ["Mod", "Scroll"],
        ["Space", "Scroll"],
      ];
    t.view.plugin.options.defaultWheelBehavior === "zoom" &&
      ((a = (n = [l, a])[0]),
      (l = n[1]),
      (s = [
        ["Mod", "Shift", "Scroll"],
        ["Shift", "Space", "Scroll"],
      ]));
    o(H2.labelPan(), __spreadArray([["Space", "Drag"]], a, !0));
    o(H2.labelPanHorizontal(), s);
    o(H2.labelZoom(), l);
    o(H2.actionZoomToFit(), [["Shift", "1"]]);
    o(H2.actionZoomToSelection(), [["Shift", "2"]]);
    o(H2.labelSelectAll(), [["Mod", "A"]]);
    o(H2.labelAddRemoveSelection(), [
      ["Shift", "Click"],
      ["Shift", "Drag to select"],
    ]);
    o(H2.actionCreateWithSize(), [["Mod", "Drag to select"]]);
    o(H2.labelCloneCard(), [[Platform.isMacOS ? "Alt" : "Ctrl", "Drag"]]);
    o(H2.labelConstrainMovementAxis(), [["Shift", "Drag"]]);
    o(H2.labelDisableDragSnapping(), [[Platform.isMacOS ? "Ctrl" : "Alt"]]);
    o(H2.labelRemoveCard(), [["Backspace"], ["Delete"]]);
    o(i18nProxy.setting.mobileToolbar.optionUndo(), [["Mod", "Z"]]);
    o(i18nProxy.setting.mobileToolbar.optionRedo(), [
      ["Mod", "Y"],
      ["Mod", "Shift", "Z"],
    ]);
    return i;
  }
  __extends(t, e);
  return t;
})(Modal);
function W2(e) {
  var t = e.getBoundingClientRect(),
    left = t.left + e.clientLeft,
    i = t.top + e.clientTop,
    width = e.clientWidth,
    height = e.clientHeight;
  return {
    left: left,
    top: i,
    width: width,
    height: height,
    cx: left + width / 2,
    cy: i + height / 2,
    minX: -width / 2,
    minY: -height / 2,
    maxX: width / 2,
    maxY: height / 2,
  };
}
function U2(minX, minY, maxX, maxY) {
  return {
    minX: minX,
    minY: minY,
    maxX: maxX,
    maxY: maxY,
  };
}
function _2(e, t) {
  return U2(Math.min(e.x, t.x), Math.min(e.y, t.y), Math.max(e.x, t.x), Math.max(e.y, t.y));
}
function j2(e) {
  var t = e.x,
    n = e.y;
  return U2(t, n, t + e.width, n + e.height);
}
function G2(e) {
  var t = e.minX,
    n = e.minY;
  return Il(t, n, e.maxX - t, e.maxY - n);
}
function K2(e) {
  for (var t = U2(1 / 0, 1 / 0, -1 / 0, -1 / 0), n = 0, i = e; n < i.length; n++) {
    var r = i[n];
    t.minX = Math.min(t.minX, r.minX);
    t.minY = Math.min(t.minY, r.minY);
    t.maxX = Math.max(t.maxX, r.maxX);
    t.maxY = Math.max(t.maxY, r.maxY);
  }
  return t;
}
function Y2(e, t) {
  return U2(e.minX - t, e.minY - t, e.maxX + t, e.maxY + t);
}
function Z2(e, t) {
  return e.minX <= t.minX && e.minY <= t.minY && e.maxX >= t.maxX && e.maxY >= t.maxY;
}
function X2(e) {
  var t = e.minX,
    n = e.minY;
  return Pl((t + e.maxX) / 2, (n + e.maxY) / 2);
}
function Q2(e, t) {
  return Pl(e.x - t.width / 2, e.y - t.height / 2);
}
function $2(e, t, n) {
  n &&
    (e =
      n === "center"
        ? Q2(e, t)
        : (function (e, t) {
            var n = e.x,
              i = e.y,
              r = e.width,
              o = e.height;
            switch (t) {
              case "left":
                return Pl(n, i - o / 2);
              case "top":
                return Pl(n - r / 2, i);
              case "right":
                return Pl(n - r, i - o / 2);
              case "bottom":
                return Pl(n - r / 2, i - o);
            }
          })(Ol(e, t), n));
  return Ol(e, t);
}
function J2(e, t, n) {
  var sourcei0,
    resizeX,
    resizeY,
    a = n.x,
    s = n.y,
    l = n.width,
    c = n.height;
  switch (e) {
    case "top":
    case "bottom":
      sourcei0 = Il(a, t.y, l, 0);
      resizeX = false;
      resizeY = true;
      break;
    case "left":
    case "right":
      sourcei0 = Il(t.x, s, 0, c);
      resizeX = true;
      resizeY = false;
      break;
    case "topleft":
    case "topright":
    case "bottomleft":
    case "bottomright":
      sourcei0 = Il(t.x, t.y, 0, 0);
      resizeX = true;
      resizeY = true;
  }
  return {
    source: sourcei0,
    resizeX: resizeX,
    resizeY: resizeY,
  };
}
var e6 = i18nProxy.plugins.quickSwitcher,
  t6 = i18nProxy.plugins.canvas,
  n6 = (function (e) {
    function t(canvas, handleChoose, handleClose) {
      var r = e.call(this, canvas.app) || this;
      r.emptyStateText = e6.labelNoNoteCreateNew();
      r.allowCreateNewFile = true;
      r.context = "embed";
      r.canvas = canvas;
      r.handleClose = handleClose;
      r.handleChoose = handleChoose;
      r.shouldShowUnresolved = false;
      r.shouldShowMarkdown = true;
      r.shouldShowImages = true;
      r.shouldShowNonImageAttachments = true;
      r.shouldShowAllTypes = canvas.app.vault.getConfig("showUnsupportedFiles");
      r.setPlaceholder(t6.promptStartSearch());
      r.setInstructions([
        {
          command: "↑↓",
          purpose: e6.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: e6.instructionOpen(),
        },
        {
          command: "shift ↵",
          purpose: e6.instructionCreate(),
        },
        {
          command: "esc",
          purpose: e6.instructionDismiss(),
        },
      ]);
      r.scope.register(["Shift"], "Enter", function (e) {
        r.selectSuggestion(null, e);
        return !1;
      });
      return r;
    }
    __extends(t, e);
    t.prototype.showMarkdownAndCanvas = function (shouldShowMarkdown) {
      this.shouldShowMarkdown = shouldShowMarkdown;
      this.shouldShowNonAttachments = shouldShowMarkdown;
      return this;
    };
    t.prototype.showAttachments = function (shouldShowNonImageAttachments) {
      this.shouldShowNonImageAttachments = shouldShowNonImageAttachments;
      this.shouldShowImages = shouldShowNonImageAttachments;
      return this;
    };
    t.prototype.onChooseSuggestion = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return e
                ? [3, 2]
                : ((t = this.canvas.view.file.path),
                  [4, this.app.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, t)]);
            case 1:
              n = i.sent();
              this.handleChoose(n);
              return [2];
            case 2:
              (e.type !== "file" && e.type !== "alias") || this.handleChoose(e.file);
              return [2];
          }
        });
      });
    };
    t.prototype.onClose = function () {
      if (this.handleClose) {
        this.handleClose();
      }
    };
    return t;
  })(E2),
  i6 = (function (e) {
    function t(canvas, handleChoose, handleClose) {
      var r = e.call(this, canvas.app) || this;
      r.emptyStateText = i18nProxy.plugins.canvas.labelNoMedia();
      r.allowCreateNewFile = false;
      r.context = "embed";
      r.canvas = canvas;
      r.handleClose = handleClose;
      r.handleChoose = handleChoose;
      r.shouldShowUnresolved = false;
      r.shouldShowMarkdown = false;
      r.shouldShowNonAttachments = true;
      r.shouldShowImages = true;
      r.shouldShowNonImageAttachments = true;
      r.shouldShowAllTypes = canvas.app.vault.getConfig("showUnsupportedFiles");
      r.setPlaceholder(t6.promptStartSearch());
      r.setInstructions([
        {
          command: "↑↓",
          purpose: e6.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: e6.instructionOpen(),
        },
        {
          command: "esc",
          purpose: e6.instructionDismiss(),
        },
      ]);
      return r;
    }
    __extends(t, e);
    t.prototype.onChooseSuggestion = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          return e ? ((e.type !== "file" && e.type !== "alias") || this.handleChoose(e.file), [2]) : [2];
        });
      });
    };
    t.prototype.onClose = function () {
      if (this.handleClose) {
        this.handleClose();
      }
    };
    return t;
  })(E2),
  r6 = (function (e) {
    function t(t, handleChoose, handleClose) {
      var r = e.call(this, t) || this;
      r.emptyStateText = t6.labelNoImages();
      r.context = "embed";
      r.handleClose = handleClose;
      r.handleChoose = handleChoose;
      r.shouldShowUnresolved = false;
      r.shouldShowMarkdown = false;
      r.shouldShowNonAttachments = false;
      r.shouldShowAllTypes = false;
      r.shouldShowImages = true;
      r.shouldShowNonImageAttachments = false;
      r.setPlaceholder(t6.promptStartSearch());
      r.setInstructions([
        {
          command: "↑↓",
          purpose: e6.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: e6.instructionSelect(),
        },
        {
          command: "esc",
          purpose: e6.instructionDismiss(),
        },
      ]);
      return r;
    }
    __extends(t, e);
    t.prototype.onChooseSuggestion = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          return e ? (e.type === "file" && this.handleChoose(e.file), [2]) : [2];
        });
      });
    };
    t.prototype.onClose = function () {
      if (this.handleClose) {
        this.handleClose();
      }
    };
    return t;
  })(E2);
function o6(e, t, n) {
  for (var i = [1 / 0, null], r = 0, o = t; r < o.length; r++)
    for (
      var node = o[r],
        s = node.getBBox(),
        l = 0,
        c = [
          ["top", m4(s, "top")],
          ["right", m4(s, "right")],
          ["bottom", m4(s, "bottom")],
          ["left", m4(s, "left")],
        ];
      l < c.length;
      l++
    ) {
      var u = c[l],
        side = u[0],
        p = Fl(e, u[1]);
      if (p <= n)
        return {
          side: side,
          node: node,
        };
      if (p < i[0]) {
        i = [
          p,
          {
            side: side,
            node: node,
          },
        ];
      }
    }
  return i[1];
}
function a6(e) {
  var t = e.minX,
    n = e.minY,
    i = e.maxX,
    r = e.maxY;
  return [Pl(t, n), Pl(t, r), Pl(i, n), Pl(i, r), Pl((t + i) / 2, (n + r) / 2)];
}
function s6(e) {
  var t = Array.combine(e.map(a6));
  t.sort(function (e, t) {
    return e.x !== t.x ? e.x - t.x : e.y - t.y;
  });
  for (var n = [], i = null, r = 0, o = t; r < o.length; r++) {
    var a = o[r];
    if (!(i && i.x === a.x && i.y === a.y)) {
      i = a;
      n.push(a);
    }
  }
  return n;
}
function l6(e, t) {
  e.sort(function (e, n) {
    return t(e) - t(n);
  });
}
function c6(e, t, n, i) {
  if (e.length === 0 || t.length === 0) return null;
  var r = i === "x" ? u6 : h6;
  l6(e, r);
  l6(t, r);
  for (var delta = n, matches = [], s = [], dest = [], c = 1 / 0, u = 0, h = e; u < h.length; u++) {
    var p = h[u],
      d = r(p);
    if (d !== c) {
      c = d;
      (s.length > 0 || dest.length > 0) &&
        (matches.push({
          src: s,
          dest: dest,
        }),
        (s = []),
        (dest = []));
      for (var f = 0, m = t.length - 1; f <= m; ) {
        var g = (f + m) >> 1,
          v = d - r(t[g]);
        if (v > 0) f = g + 1;
        else {
          if (!(v < 0)) {
            f = m = g;
            break;
          }
          m = g - 1;
        }
      }
      if (f !== m)
        if (m < 0) m = 0;
        else if (f >= t.length - 1) f = t.length - 1;
        else {
          var y = r(t[f]) - d,
            b = d - r(t[m]);
          y === b ? (y === delta ? (m = f) : (f = m)) : (f = m = y < b ? f : m);
        }
      var w = r(t[f]),
        k = w - d;
      if (k === delta || Math.abs(k) < Math.abs(delta)) {
        for (k !== delta && ((matches = []), (s = []), (dest = []), (delta = k)); f > 0 && r(t[f - 1]) === w; ) f--;
        for (; m < t.length - 1 && r(t[m + 1]) === w; ) m++;
        s.push(p);
        for (var C = f; C <= m; C++) dest.push(t[C]);
      }
    } else if (s.length > 0 && r(s.last()) === d) {
      s.push(p);
    }
  }
  (s.length > 0 || dest.length > 0) &&
    matches.push({
      src: s,
      dest: dest,
    });
  return matches.length === 0
    ? null
    : {
        matches: matches,
        delta: delta,
      };
}
function u6(e) {
  return e.x;
}
function h6(e) {
  return e.y;
}
var p6 = /^(\d+)$/;
function d6(e, t) {
  t = (t || "").trim();
  for (var n = 0, i = Array.from(e.classList); n < i.length; n++) {
    var r = i[n];
    if (r.startsWith("mod-canvas-color")) {
      e.removeClass(r);
    }
  }
  if ((e.style.removeProperty("--canvas-color"), e.toggleClass("is-themed", !!t), t))
    if (p6.test(t)) e.addClass("mod-canvas-color-" + t);
    else {
      var o = IT(t);
      if (o) {
        e.addClass("mod-canvas-color-custom");
        e.style.setProperty("--canvas-color", "".concat(o.r, ",").concat(o.g, ",").concat(o.b));
      }
    }
}
var f6 = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/i;
function m6(e) {
  var t = e.match(f6);
  return t
    ? DT({
        r: parseInt(t[1]),
        g: parseInt(t[2]),
        b: parseInt(t[3]),
      })
    : e;
}
var g6 = (function () {
    function e(canvas, t) {
      var n = this;
      this.bbox = U2(0, 0, 0, 0);
      this.resizerEls = [];
      this.canvas = canvas;
      this.selectionEl = createDiv("canvas-selection" + (t ? " ".concat(t) : ""));
      for (
        var i = function (dataResize) {
            var t = createDiv({
              cls: "canvas-node-resizer",
              attr: {
                "data-resize": dataResize,
              },
            });
            t.addEventListener("pointerdown", function (i) {
              if (i.targetNode === t && i.pointerType === "mouse") {
                n.onResizePointerdown(i, dataResize);
              }
            });
            (dataResize !== "bottom" && dataResize !== "right") ||
              t.addEventListener("dblclick", function (t) {
                Array.from(n.canvas.selection).forEach(function (n) {
                  return n instanceof t4 && n.onResizeDblclick(t, dataResize);
                });
              });
            r.resizerEls.push(t);
          },
          r = this,
          o = 0,
          a = ["top", "right", "bottom", "left"];
        o < a.length;
        o++
      ) {
        i(a[o]);
      }
      for (
        var s = function (dataResize) {
            var t = createDiv({
              cls: "canvas-node-resizer",
              attr: {
                "data-resize": dataResize,
              },
            });
            t.addEventListener("pointerdown", function (t) {
              n.onResizePointerdown(t, dataResize);
            });
            l.resizerEls.push(t);
          },
          l = this,
          c = 0,
          u = ["topright", "bottomright", "bottomleft", "topleft"];
        c < u.length;
        c++
      ) {
        s(u[c]);
      }
    }
    e.prototype.update = function (bbox) {
      this.bbox = bbox;
      var t = this.selectionEl,
        n = this.resizerEls;
      if (!t.parentNode) {
        this.canvas.canvasEl.appendChild(t);
      }
      for (var i = 0, r = n; i < r.length; i++) {
        var o = r[i];
        t.appendChild(o);
      }
      var a = Y2(bbox, 10);
      t.setCssStyles({
        transform: "translate(".concat(a.minX, "px, ").concat(a.minY, "px)"),
        width: "".concat(a.maxX - a.minX, "px"),
        height: "".concat(a.maxY - a.minY, "px"),
      });
    };
    e.prototype.onResizePointerdown = function (e, t) {
      var n = this;
      if (e.isPrimary && e.button === 0 && e.pointerType === "mouse") {
        e.preventDefault();
        setupPointerDragHandler(e, function () {
          for (
            var i = n,
              r = i.bbox,
              o = i.canvas,
              a = G2(r),
              s = a.x,
              l = a.y,
              width = a.width,
              height = a.height,
              h = o.options,
              p = h.snapToGrid,
              d = h.snapToObjects,
              f = Array.from(o.selection),
              m = [],
              g = [],
              v = [],
              y = 0,
              b = f;
            y < b.length;
            y++
          ) {
            var w = b[y];
            w.nodeEl.addClass("is-dragging");
            g.push(w.rect);
            var k = w.getBBox();
            v.push({
              width: (k.maxX - k.minX) / width,
              height: (k.maxY - k.minY) / height,
            });
            m.push({
              minX: (k.minX - r.minX) / width,
              minY: (k.minY - r.minY) / height,
              maxX: (k.maxX - r.maxX) / width,
              maxY: (k.maxY - r.maxY) / height,
            });
          }
          return n.canvas.handleDragWithPan(e, {
            move: function (e) {
              var i,
                o,
                a = n.canvas,
                h = a.config.minContainerDimension,
                g =
                  h /
                  Math.min.apply(
                    Math,
                    v.map(function (e) {
                      return e.width;
                    }),
                  ),
                y =
                  h /
                  Math.min.apply(
                    Math,
                    v.map(function (e) {
                      return e.height;
                    }),
                  ),
                b = a.posFromEvt(e);
              a.clearSnapPoints();
              var w = 0,
                k = 0,
                C = J2(t, b, {
                  x: s,
                  y: l,
                  width: width,
                  height: height,
                }),
                E = C.source,
                S = C.resizeX,
                M = C.resizeY;
              if (a.canSnap(e)) {
                if (d) {
                  var x = s6([j2(E)]),
                    T = s6(a.getViewportNodes(!0).map(j2)),
                    D = a.snapDistance;
                  S && (i = c6(x, T, D, "x")) && (w = i.delta);
                  M && (o = c6(x, T, D, "y")) && (k = o.delta);
                }
                if (p) {
                  var A = a.gridSpacing;
                  S && !i && (w = Math.round(b.x / A) * A - b.x);
                  M && !o && (k = Math.round(b.y / A) * A - b.y);
                }
              }
              var P = b.x + w,
                L = b.y + k;
              t.contains("top") &&
                ((r.minY = Math.min(r.maxY - y, L)), r.minY !== L && ((o = null), (k = r.minY - b.y)));
              t.contains("left") &&
                ((r.minX = Math.min(r.maxX - g, P)), r.minX !== P && ((i = null), (w = r.minX - b.x)));
              t.contains("bottom") &&
                ((r.maxY = Math.max(r.minY + y, L)), r.maxY !== L && ((o = null), (k = r.maxY - b.y)));
              t.contains("right") &&
                ((r.maxX = Math.max(r.minX + g, P)), r.maxX !== P && ((i = null), (w = r.maxX - b.x)));
              var I = {
                  x: r.minX,
                  y: r.minY,
                  width: r.maxX - r.minX,
                  height: r.maxY - r.minY,
                },
                O = f.some(function (e) {
                  return e.aspectRatio;
                });
              e.shiftKey && (O = !O);
              var F = 0;
              if ((O && height !== 0 && (F = width / height), F !== 0)) {
                var widthN0 = I.width,
                  heightR0 = I.height;
                if (S && M) {
                  var B = Math.max(widthN0, heightR0 * F);
                  heightR0 = Math.max(heightR0, widthN0 / F);
                  (widthN0 = B) !== I.width ? (i = null) : heightR0 !== I.height && (o = null);
                } else S ? (heightR0 = widthN0 / F) : M && (widthN0 = heightR0 * F);
                if (t.includes("left")) {
                  var V = s + width - widthN0;
                  w += V - I.x;
                  I.x = V;
                }
                if (t.includes("top")) {
                  var H = l + height - heightR0;
                  k += H - I.y;
                  I.y = H;
                }
                t.includes("right") && (w += widthN0 - I.width);
                t.includes("bottom") && (k += heightR0 - I.height);
                I.width = widthN0;
                I.height = heightR0;
              }
              (i || o) && a.renderSnapPoints(i, o, w, k);
              for (var z = j2(I), q = 0; q < f.length; q++) {
                var W = f[q],
                  U = m[q],
                  _ = {
                    minX: z.minX + U.minX * I.width,
                    minY: z.minY + U.minY * I.height,
                    maxX: z.maxX + U.maxX * I.width,
                    maxY: z.maxY + U.maxY * I.height,
                  };
                W.moveAndResize(G2(_));
              }
            },
            end: function () {
              o.requestSave();
            },
            cancel: function () {
              for (var e = 0; e < f.length; e++) {
                f[e].moveAndResize(g[e]);
              }
              o.requestSave();
            },
            cleanup: function () {
              for (var e = 0, t = f; e < t.length; e++) {
                t[e].nodeEl.removeClass("is-dragging");
              }
            },
          });
        });
      }
    };
    e.prototype.hide = function () {
      this.selectionEl.remove();
    };
    return e;
  })(),
  v6 = i18nProxy.interface,
  y6 = i18nProxy.plugins.canvas,
  b6 = (function () {
    function e(canvas) {
      var t = this;
      this.canvas = canvas;
      var n = (this.containerEl = createDiv("canvas-menu-container"));
      this.menuEl = n.createDiv("canvas-menu");
      this.selection = new g6(canvas, "mod-group-selection");
      var i = this.selection.selectionEl;
      i.addEventListener("contextmenu", function (e) {
        t.canvas.onSelectionContextMenu(e);
        e.preventDefault();
      });
      i.addEventListener("pointerdown", function (e) {
        if (e.isPrimary && e.button === 0 && !e.defaultPrevented) {
          setupPointerDragHandler(e, function () {
            return t.canvas.handleSelectionDrag(e, i);
          });
        }
      });
    }
    e.prototype.render = function (e) {
      var t,
        n = this,
        i = this,
        r = i.canvas,
        o = i.selection,
        a = i.containerEl,
        s = i.menuEl,
        l = r.app,
        c = Array.from(r.selection);
      if (c.length === 0) {
        a.detach();
        s.empty();
        return void o.hide();
      }
      c.sort(Z6);
      var u = c.length === 1,
        h = c.last(),
        p = K2(
          c.map(function (e) {
            return e.getBBox();
          }),
        ),
        d = p.minX,
        f = p.maxX,
        m = p.minY;
      if ((u ? o.hide() : o.update(p), r.isDragging)) {
        a.detach();
        return void s.empty();
      }
      if ((r.wrapperEl.append(a), e)) {
        var g, v, y;
        s.empty();
        var b = function (e, t, n, i, o) {
          if (!r.readonly || o) {
            var a = e.createEl("button", "clickable-icon");
            setTooltip(a, t, {
              placement: "top",
            });
            setIcon(a, n);
            a.addEventListener("click", i);
          }
        };
        b(s, y6.actionRemove(), "lucide-trash-2", function () {
          r.deleteSelection();
        });
        var w = h.color;
        b(s, y6.actionSetColor(), "lucide-palette", function (e) {
          var t = e.currentTarget;
          if (!v || (g.removeClass("is-active"), v.remove(), (v = null), y !== "color")) {
            g = t;
            t.addClass("is-active");
            v = s.createDiv("canvas-submenu");
            y = "color";
            var n = function (e, t) {
                if (undefined === t) {
                  t = true;
                }
                for (var n = 0, i = c; n < i.length; n++) {
                  i[n].setColor(e, !t);
                }
                w = e;
                t && (v.remove(), (v = null), r.requestSave());
              },
              i = false,
              o = function (e) {
                var t = v.createDiv("canvas-color-picker-item");
                w === e && (t.addClass("is-active"), (i = true));
                e && t.addClass("mod-canvas-color-" + e);
                t.addEventListener("click", function () {
                  return n(e);
                });
              };
            o("");
            for (var a = 1; a <= 6; a++) o(String(a));
            var l = v.createDiv("canvas-color-picker-item canvas-color-picker-custom"),
              u = l.createEl("input", {
                type: "color",
              });
            if ((l.style.setProperty("--canvas-color", "0,0,0"), !i)) {
              var h = IT(w);
              if (h) {
                u.value = DT(h);
                l.style.setProperty("--canvas-color", "".concat(h.r, ",").concat(h.g, ",").concat(h.b));
                l.addClass("is-active");
              }
            }
            u.addEventListener("change", function () {
              return n(u.value);
            });
            u.addEventListener("input", function () {
              return n(u.value, !1);
            });
          }
        });
        var k = HO(BO(["Shift"], "2"));
        if (
          (b(
            s,
            y6.actionZoomToSelection() + "\n(".concat(k, ")"),
            "zoom-to-selection",
            function () {
              r.zoomToSelection();
            },
            !0,
          ),
          !u &&
            h instanceof t4 &&
            b(s, y6.actionCreateGroup(), "create-group", function () {
              var size = G2(
                Y2(
                  K2(
                    Array.from(r.selection.values()).map(function (e) {
                      return e.getBBox();
                    }),
                  ),
                  20,
                ),
              );
              r.createGroupNode({
                pos: size,
                size: size,
              });
            }),
          (!u && h instanceof t4) || (u && h instanceof p4))
        ) {
          var C = function () {
            if (u && h instanceof p4) {
              var e = h.getBBox();
              return [
                n.canvas.getContainingNodes(e).filter(function (e) {
                  return e !== h;
                }),
                Y2(e, -20),
              ];
            }
            var t = c.filter(function (e) {
              return e instanceof t4;
            });
            return [
              t,
              K2(
                t.map(function (e) {
                  return e.getBBox();
                }),
              ),
            ];
          };
          b(s, y6.actionAlign(), "lucide-align-start-vertical", function (e) {
            var t = e.currentTarget;
            if (!t.hasClass("has-active-menu")) {
              var n = function (e) {
                  for (var t = C(), n = t[0], i = t[1], o = 0, a = n; o < a.length; o++) {
                    var s = a[o];
                    e === "left"
                      ? s.moveTo(Pl(i.minX, s.y))
                      : e === "right"
                        ? s.moveTo(Pl(i.maxX - s.width, s.y))
                        : e === "top"
                          ? s.moveTo(Pl(s.x, i.minY))
                          : e === "bottom"
                            ? s.moveTo(Pl(s.x, i.maxY - s.height))
                            : e === "center"
                              ? s.moveTo(Pl((i.minX + i.maxX - s.width) / 2, s.y))
                              : e === "middle" && s.moveTo(Pl(s.x, (i.minY + i.maxY - s.height) / 2));
                  }
                  r.requestSave();
                },
                i = function (e) {
                  var t = C(),
                    n = t[0],
                    i = t[1];
                  if (!(n.length <= 1)) {
                    if (e === "horizontal") {
                      for (var o = 0, a = 0, s = n; a < s.length; a++) {
                        o += s[a].width;
                      }
                      n.sort(function (e, t) {
                        return e.x !== t.x ? e.x - t.x : e.y - t.y;
                      });
                      for (var l = (i.maxX - i.minX - o) / (n.length - 1), c = 1; c < n.length - 1; c++) {
                        var u = n[c - 1];
                        (f = n[c]).moveTo(Pl(u.x + u.width + l, f.y));
                      }
                    } else if (e === "vertical") {
                      for (var h = 0, p = 0, d = n; p < d.length; p++) {
                        h += d[p].height;
                      }
                      n.sort(function (e, t) {
                        return e.y !== t.y ? e.y - t.y : e.x - t.x;
                      });
                      for (l = (i.maxY - i.minY - h) / (n.length - 1), c = 1; c < n.length - 1; c++) {
                        var f;
                        u = n[c - 1];
                        (f = n[c]).moveTo(Pl(f.x, u.y + u.height + l));
                      }
                    }
                    r.requestSave();
                  }
                },
                o = function (e) {
                  var t = C(),
                    n = t[0],
                    i = t[1];
                  if (!(n.length <= 1)) {
                    if (e === "horizontal")
                      for (var o = 0, a = n; o < a.length; o++) {
                        (c = a[o]).moveAndResize(Il(i.minX, c.y, i.maxX - i.minX, c.height));
                      }
                    else if (e === "vertical")
                      for (var s = 0, l = n; s < l.length; s++) {
                        var c;
                        (c = l[s]).moveAndResize(Il(c.x, i.minY, c.width, i.maxY - i.minY));
                      }
                    r.requestSave();
                  }
                },
                a = function (e) {
                  var t = C(),
                    n = t[0],
                    i = t[1];
                  if (!(n.length <= 1)) {
                    n.sort(function (e, t) {
                      return e.y - t.y;
                    });
                    for (var o = [], a = -1 / 0, s = 0, l = n; s < l.length; s++) {
                      if ((g = l[s]).y < a) {
                        o.last().push(g);
                        var c = g.y + g.height;
                        if (c < a) {
                          a = c;
                        }
                      } else {
                        o.push([g]);
                        a = g.y + g.height;
                      }
                    }
                    for (var u = 0, h = o; u < h.length; u++) {
                      (w = h[u]).sort(function (e, t) {
                        return e.x - t.x;
                      });
                    }
                    var p = [].concat.apply([], o),
                      d = p[0],
                      f = r.gridSpacing;
                    if (e === "horizontal")
                      for (var m = 1; m < p.length; m++) {
                        (g = p[m]).moveTo(Pl(d.x + d.width + f, d.y));
                        d = g;
                      }
                    else if (e === "vertical")
                      for (m = 1; m < p.length; m++) {
                        var g;
                        (g = p[m]).moveTo(Pl(d.x, d.y + d.height + f));
                        d = g;
                      }
                    else if (e === "grid")
                      for (var v = i.minY, y = 0, b = o; y < b.length; y++) {
                        var w;
                        (w = b[y])[0].moveTo(Pl(i.minX, v));
                        var k = w[0].height;
                        for (m = 1; m < w.length; m++) {
                          var E = w[m - 1],
                            S = w[m];
                          S.moveTo(Pl(E.x + E.width + f, v));
                          k = Math.max(k, S.height);
                        }
                        v += k + f;
                      }
                    r.requestSave();
                  }
                },
                s = t.getBoundingClientRect();
              new Menu()
                .setUseNativeMenu(!1)
                .addItem(function (e) {
                  return e
                    .setSection("align-h")
                    .setTitle(y6.actionAlignLeft())
                    .setIcon("lucide-align-start-vertical")
                    .onClick(function () {
                      return n("left");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("align-h")
                    .setTitle(y6.actionAlignCenter())
                    .setIcon("lucide-align-center-vertical")
                    .onClick(function () {
                      return n("center");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("align-h")
                    .setTitle(y6.actionAlignRight())
                    .setIcon("lucide-align-end-vertical")
                    .onClick(function () {
                      return n("right");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("align-v")
                    .setTitle(y6.actionAlignTop())
                    .setIcon("lucide-align-start-horizontal")
                    .onClick(function () {
                      return n("top");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("align-v")
                    .setTitle(y6.actionAlignMiddle())
                    .setIcon("lucide-align-center-horizontal")
                    .onClick(function () {
                      return n("middle");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("align-v")
                    .setTitle(y6.actionAlignBottom())
                    .setIcon("lucide-align-end-horizontal")
                    .onClick(function () {
                      return n("bottom");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("arrange")
                    .setTitle(y6.actionArrangeHorizontally())
                    .setIcon("stack-horizontal")
                    .onClick(function () {
                      return a("horizontal");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("arrange")
                    .setTitle(y6.actionArrangeVertically())
                    .setIcon("stack-vertical")
                    .onClick(function () {
                      return a("vertical");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("arrange")
                    .setTitle(y6.actionArrangeGrid())
                    .setIcon("lucide-layout-grid")
                    .onClick(function () {
                      return a("grid");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("distribute")
                    .setTitle(y6.actionDistributeHorizontalSpacing())
                    .setIcon("distribute-space-horizontal")
                    .onClick(function () {
                      return i("horizontal");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("distribute")
                    .setTitle(y6.actionDistributeVerticalSpacing())
                    .setIcon("distribute-space-vertical")
                    .onClick(function () {
                      return i("vertical");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("justify")
                    .setTitle(y6.actionJustifyHorizontally())
                    .setIcon("stretch-horizontal")
                    .onClick(function () {
                      return o("horizontal");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setSection("justify")
                    .setTitle(y6.actionJustifyVertically())
                    .setIcon("stretch-vertical")
                    .onClick(function () {
                      return o("vertical");
                    });
                })
                .setParentElement(t)
                .showAtPosition({
                  x: s.x,
                  y: s.bottom,
                  width: s.width,
                  overlap: true,
                });
            }
          });
        }
        if (
          h instanceof C4 &&
          c.every(function (e) {
            return e instanceof C4;
          })
        ) {
          var E = c,
            S = "lucide-arrow-right";
          h.from.end === "arrow" ? (S = "lucide-move-horizontal") : h.to.end === "none" && (S = "line-horizontal");
          b(s, y6.labelLineDirection(), S, function (e) {
            var t = e.currentTarget;
            if (!t.hasClass("has-active-menu")) {
              var n = function (end, endt0) {
                  for (var n = 0, i = E; n < i.length; n++) {
                    var o = i[n];
                    o.from.end = end;
                    o.to.end = endt0;
                    r.markDirty(o);
                  }
                  r.requestSave();
                },
                i = t.getBoundingClientRect();
              new Menu()
                .setUseNativeMenu(!1)
                .addItem(function (e) {
                  return e
                    .setTitle(y6.labelNondirectional())
                    .setIcon("line-horizontal")
                    .setChecked(S === "line-horizontal")
                    .onClick(function () {
                      return n("none", "none");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setTitle(y6.labelUnidirectional())
                    .setIcon("lucide-arrow-right")
                    .setChecked(S === "lucide-arrow-right")
                    .onClick(function () {
                      return n("none", "arrow");
                    });
                })
                .addItem(function (e) {
                  return e
                    .setTitle(y6.labelBidirectional())
                    .setIcon("lucide-move-horizontal")
                    .setChecked(S === "lucide-move-horizontal")
                    .onClick(function () {
                      return n("arrow", "arrow");
                    });
                })
                .setParentElement(t)
                .showAtPosition({
                  x: i.x,
                  y: i.bottom,
                  width: i.width,
                  overlap: true,
                });
            }
          });
        }
        if (u && h instanceof C4 && h.labelElement) {
          var M = h;
          b(s, y6.actionRemoveLabel(), "lucide-x-square", function () {
            M.setLabel("");
            M.labelElement.destroy();
            r.requestSave();
            n.render(!0);
          });
        }
        if (u)
          if (h instanceof C4) {
            var x = h;
            b(s, y6.actionEditLabel(), "lucide-edit", function () {
              x.editLabel();
            });
          } else if (h instanceof t4 && h.isEditable()) {
            var T = h,
              D = T instanceof p4,
              A = D ? y6.actionEditLabel() : v6.menu.edit();
            if (
              (b(s, A, "lucide-edit", function () {
                T.startEditing();
              }),
              D)
            ) {
              var P = T,
                L = P.bgFile ? y6.actionEditBackground() : y6.actionSetBackground();
              b(s, L, "lucide-image", function (e) {
                var t = e.currentTarget;
                if (!t.hasClass("has-active-menu")) {
                  var i = function () {
                    new r6(l, function (e) {
                      P.setBackgroundFile(e);
                      r.requestSave();
                      n.render(!0);
                    }).open();
                  };
                  if (P.bgPath) {
                    var o = function (e) {
                        P.setBackgroundStyle(e);
                        r.requestSave();
                      },
                      a = t.getBoundingClientRect();
                    new Menu()
                      .setUseNativeMenu(!1)
                      .addItem(function (e) {
                        return e
                          .setSection("image")
                          .setTitle(y6.actionReplaceBackground())
                          .setIcon("lucide-repeat")
                          .onClick(i);
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("image")
                          .setTitle(y6.actionRemoveBackground())
                          .setIcon("lucide-image-off")
                          .onClick(function () {
                            P.setBackgroundFile(null);
                            r.requestSave();
                            n.render(!0);
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("style")
                          .setTitle(y6.optionBackgroundCover())
                          .setIcon("lucide-scaling")
                          .setChecked(!P.bgStyle || P.bgStyle === "cover")
                          .onClick(function () {
                            return o("cover");
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("style")
                          .setTitle(y6.optionBackgroundRatio())
                          .setIcon("aspect-ratio")
                          .setChecked(P.bgStyle === "ratio")
                          .onClick(function () {
                            return o("ratio");
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("style")
                          .setTitle(y6.optionBackgroundRepeat())
                          .setIcon("lucide-layout-grid")
                          .setChecked(P.bgStyle === "repeat")
                          .onClick(function () {
                            return o("repeat");
                          });
                      })
                      .setParentElement(t)
                      .showAtPosition({
                        x: a.x,
                        y: a.bottom,
                        width: a.width,
                        overlap: true,
                      });
                  } else i();
                }
              });
            }
          }
      }
      var I = r.scale,
        O = r.canvasRect,
        F = (d + f) / 2,
        N = m - 10 / I,
        R = c.some(function (e) {
          return e instanceof p4;
        });
      if ((R ? (N = m - 35 / Math.sqrt(I)) : h instanceof a4 && (N = m - 30 / Math.sqrt(I)), h instanceof C4 && u)) {
        var B = h.getCenter(),
          V = ((t = h.labelElement) === null || undefined === t ? undefined : t.wrapperEl.clientHeight) || 20;
        N = Math.min(N, B.y - 20 / I - V / 2);
      }
      var H = s.getBoundingClientRect(),
        z = H.width,
        q = H.height;
      F = (F - r.x) * I - z / 2 + O.width / 2;
      N = (N - r.y) * I - q + O.height / 2;
      F = Math.clamp(F, 10, O.width - z - 10);
      N = Math.clamp(N, 10, O.height - q - 10);
      a.setCssStyles({
        left: "".concat(F, "px"),
        top: "".concat(N, "px"),
      });
    };
    e.prototype.updateZIndex = function (e) {
      this.containerEl.style.zIndex = String(e);
    };
    return e;
  })();
function w6(e, t, n, i, r) {
  k6(e, t, n || 0, i || e.length - 1, r || E6);
}
function k6(e, t, n, i, r) {
  for (; i > n; ) {
    if (i - n > 600) {
      var o = i - n + 1,
        a = t - n + 1,
        s = Math.log(o),
        l = 0.5 * Math.exp((2 * s) / 3),
        c = 0.5 * Math.sqrt((s * l * (o - l)) / o) * (a - o / 2 < 0 ? -1 : 1);
      k6(e, t, Math.max(n, Math.floor(t - (a * l) / o + c)), Math.min(i, Math.floor(t + ((o - a) * l) / o + c)), r);
    }
    var u = e[t],
      h = n,
      p = i;
    for (C6(e, n, t), r(e[i], u) > 0 && C6(e, n, i); h < p; ) {
      for (C6(e, h, p), h++, p--; r(e[h], u) < 0; ) h++;
      for (; r(e[p], u) > 0; ) p--;
    }
    r(e[n], u) === 0 ? C6(e, n, p) : C6(e, ++p, i);
    p <= t && (n = p + 1);
    t <= p && (i = p - 1);
  }
}
function C6(e, t, n) {
  var i = e[t];
  e[t] = e[n];
  e[n] = i;
}
function E6(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}