var S6 = (function () {
  function e(e) {
    undefined === e && (e = 9);
    this._maxEntries = Math.max(4, e);
    this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries));
    this.clear();
  }
  e.prototype.all = function () {
    return this._all(this.data, []);
  };
  e.prototype.search = function (e) {
    var t = this.data,
      n = [];
    if (!N6(e, t)) return n;
    for (var i = this.toBBox, r = []; t; ) {
      for (var o = 0; o < t.children.length; o++) {
        var a = t.children[o],
          s = t.leaf ? i(a) : a;
        if (N6(e, s)) {
          t.leaf ? n.push(a) : F6(e, s) ? this._all(a, n) : r.push(a);
        }
      }
      t = r.pop();
    }
    return n;
  };
  e.prototype.collides = function (e) {
    var t = this.data;
    if (!N6(e, t)) return !1;
    for (var n = []; t; ) {
      for (var i = 0; i < t.children.length; i++) {
        var r = t.children[i],
          o = t.leaf ? this.toBBox(r) : r;
        if (N6(e, o)) {
          if (t.leaf || F6(e, o)) return !0;
          n.push(r);
        }
      }
      t = n.pop();
    }
    return !1;
  };
  e.prototype.load = function (e) {
    if (!e || !e.length) return this;
    if (e.length < this._minEntries) {
      for (var t = 0; t < e.length; t++) this.insert(e[t]);
      return this;
    }
    var data = this._build(e.slice(), 0, e.length - 1, 0);
    if (this.data.children.length) {
      if (this.data.height === data.height) this._splitRoot(this.data, data);
      else {
        if (this.data.height < data.height) {
          var i = this.data;
          this.data = data;
          data = i;
        }
        this._insert(data, this.data.height - data.height - 1, !0);
      }
    } else this.data = data;
    return this;
  };
  e.prototype.insert = function (e) {
    e && this._insert(e, this.data.height - 1);
    return this;
  };
  e.prototype.clear = function () {
    this.data = R6([]);
    return this;
  };
  e.prototype.remove = function (e, t) {
    if (!e) return this;
    for (var n, i, r, o = this.data, a = this.toBBox(e), s = [], l = []; o || s.length; ) {
      if ((o || ((o = s.pop()), (i = s[s.length - 1]), (n = l.pop()), (r = true)), o.leaf)) {
        var c = x6(e, o.children, t);
        if (-1 !== c) {
          o.children.splice(c, 1);
          s.push(o);
          this._condense(s);
          return this;
        }
      }
      r || o.leaf || !F6(o, a)
        ? i
          ? (n++, (o = i.children[n]), (r = false))
          : (o = null)
        : (s.push(o), l.push(n), (n = 0), (i = o), (o = o.children[0]));
    }
    return this;
  };
  e.prototype.toBBox = function (e) {
    return e;
  };
  e.prototype.compareMinX = function (e, t) {
    return e.minX - t.minX;
  };
  e.prototype.compareMinY = function (e, t) {
    return e.minY - t.minY;
  };
  e.prototype.toJSON = function () {
    return this.data;
  };
  e.prototype.fromJSON = function (data) {
    this.data = data;
    return this;
  };
  e.prototype._all = function (e, t) {
    for (var n = []; e; ) {
      e.leaf ? t.push.apply(t, e.children) : n.push.apply(n, e.children);
      e = n.pop();
    }
    return t;
  };
  e.prototype._build = function (e, t, n, height) {
    var r,
      o = n - t + 1,
      a = this._maxEntries;
    if (o <= a) {
      T6((r = R6(e.slice(t, n + 1))), this.toBBox);
      return r;
    }
    height || ((height = Math.ceil(Math.log(o) / Math.log(a))), (a = Math.ceil(o / Math.pow(a, height - 1))));
    (r = R6([])).leaf = false;
    r.height = height;
    var s = Math.ceil(o / a),
      l = s * Math.ceil(Math.sqrt(a));
    B6(e, t, n, l, this.compareMinX);
    for (var c = t; c <= n; c += l) {
      var u = Math.min(c + l - 1, n);
      B6(e, c, u, s, this.compareMinY);
      for (var h = c; h <= u; h += s) {
        var p = Math.min(h + s - 1, u);
        r.children.push(this._build(e, h, p, height - 1));
      }
    }
    T6(r, this.toBBox);
    return r;
  };
  e.prototype._chooseSubtree = function (e, t, n, i) {
    for (; i.push(t), !t.leaf && i.length - 1 !== n; ) {
      for (var r = 1 / 0, o = 1 / 0, a = undefined, s = 0; s < t.children.length; s++) {
        var l = t.children[s],
          c = I6(l),
          u =
            ((h = e),
            (p = l),
            (Math.max(p.maxX, h.maxX) - Math.min(p.minX, h.minX)) *
              (Math.max(p.maxY, h.maxY) - Math.min(p.minY, h.minY)) -
              c);
        u < o ? ((o = u), (r = c < r ? c : r), (a = l)) : u === o && c < r && ((r = c), (a = l));
      }
      t = a || t.children[0];
    }
    var h, p;
    return t;
  };
  e.prototype._insert = function (e, t, n) {
    var i = n ? e : this.toBBox(e),
      r = [],
      o = this._chooseSubtree(i, this.data, t, r);
    for (o.children.push(e), A6(o, i); t >= 0 && r[t].children.length > this._maxEntries; ) {
      this._split(r, t);
      t--;
    }
    this._adjustParentBBoxes(i, r, t);
  };
  e.prototype._split = function (e, t) {
    var n = e[t],
      i = n.children.length,
      r = this._minEntries;
    this._chooseSplitAxis(n, r, i);
    var o = this._chooseSplitIndex(n, r, i),
      a = R6(n.children.splice(o, n.children.length - o));
    a.height = n.height;
    a.leaf = n.leaf;
    T6(n, this.toBBox);
    T6(a, this.toBBox);
    t ? e[t - 1].children.push(a) : this._splitRoot(n, a);
  };
  e.prototype._splitRoot = function (e, t) {
    this.data = R6([e, t]);
    this.data.height = e.height + 1;
    this.data.leaf = false;
    T6(this.data, this.toBBox);
  };
  e.prototype._chooseSplitIndex = function (e, t, n) {
    for (var i, r, o, a, s, l, c, u = 1 / 0, h = 1 / 0, p = t; p <= n - t; p++) {
      var d = D6(e, 0, p, this.toBBox),
        f = D6(e, p, n, this.toBBox),
        m =
          ((r = d),
          (o = f),
          (a = undefined),
          (s = undefined),
          (l = undefined),
          (c = undefined),
          (a = Math.max(r.minX, o.minX)),
          (s = Math.max(r.minY, o.minY)),
          (l = Math.min(r.maxX, o.maxX)),
          (c = Math.min(r.maxY, o.maxY)),
          Math.max(0, l - a) * Math.max(0, c - s)),
        g = I6(d) + I6(f);
      m < u ? ((u = m), (i = p), (h = g < h ? g : h)) : m === u && g < h && ((h = g), (i = p));
    }
    return i || n - t;
  };
  e.prototype._chooseSplitAxis = function (e, t, n) {
    var i = e.leaf ? this.compareMinX : P6,
      r = e.leaf ? this.compareMinY : L6;
    if (this._allDistMargin(e, t, n, i) < this._allDistMargin(e, t, n, r)) {
      e.children.sort(i);
    }
  };
  e.prototype._allDistMargin = function (e, t, n, i) {
    e.children.sort(i);
    for (var r = this.toBBox, o = D6(e, 0, t, r), a = D6(e, n - t, n, r), s = O6(o) + O6(a), l = t; l < n - t; l++) {
      var c = e.children[l];
      A6(o, e.leaf ? r(c) : c);
      s += O6(o);
    }
    for (l = n - t - 1; l >= t; l--) {
      c = e.children[l];
      A6(a, e.leaf ? r(c) : c);
      s += O6(a);
    }
    return s;
  };
  e.prototype._adjustParentBBoxes = function (e, t, n) {
    for (var i = n; i >= 0; i--) A6(t[i], e);
  };
  e.prototype._condense = function (e) {
    for (var t = e.length - 1, n = undefined; t >= 0; t--)
      e[t].children.length === 0
        ? t > 0
          ? (n = e[t - 1].children).splice(n.indexOf(e[t]), 1)
          : this.clear()
        : T6(e[t], this.toBBox);
  };
  return e;
})();
const M6 = S6;
function x6(e, t, n) {
  if (!n) return t.indexOf(e);
  for (var i = 0; i < t.length; i++) if (n(e, t[i])) return i;
  return -1;
}
function T6(e, t) {
  D6(e, 0, e.children.length, t, e);
}
function D6(e, t, n, i, r) {
  r || (r = R6(null));
  r.minX = 1 / 0;
  r.minY = 1 / 0;
  r.maxX = -1 / 0;
  r.maxY = -1 / 0;
  for (var o = t; o < n; o++) {
    var a = e.children[o];
    A6(r, e.leaf ? i(a) : a);
  }
  return r;
}
function A6(e, t) {
  e.minX = Math.min(e.minX, t.minX);
  e.minY = Math.min(e.minY, t.minY);
  e.maxX = Math.max(e.maxX, t.maxX);
  e.maxY = Math.max(e.maxY, t.maxY);
  return e;
}
function P6(e, t) {
  return e.minX - t.minX;
}
function L6(e, t) {
  return e.minY - t.minY;
}
function I6(e) {
  return (e.maxX - e.minX) * (e.maxY - e.minY);
}
function O6(e) {
  return e.maxX - e.minX + (e.maxY - e.minY);
}
function F6(e, t) {
  return e.minX <= t.minX && e.minY <= t.minY && t.maxX <= e.maxX && t.maxY <= e.maxY;
}
function N6(e, t) {
  return t.minX <= e.maxX && t.minY <= e.maxY && t.maxX >= e.minX && t.maxY >= e.minY;
}
function R6(children) {
  return {
    children: children,
    height: 1,
    leaf: true,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0,
  };
}
function B6(e, t, n, i, r) {
  for (var o = [t, n]; o.length; )
    if (!((n = o.pop()) - (t = o.pop()) <= i)) {
      var a = t + Math.ceil((n - t) / i / 2) * i;
      w6(e, a, t, n, r);
      o.push(t, a, a, n);
    }
}
var V6 = (function () {
    function e(max) {
      this.data = [];
      this.current = 0;
      this.max = max;
    }
    e.prototype.canUndo = function () {
      return this.current > 0;
    };
    e.prototype.undo = function () {
      return this.canUndo() ? (this.current--, this.data[this.current]) : null;
    };
    e.prototype.canRedo = function () {
      return this.current < this.data.length - 1;
    };
    e.prototype.redo = function () {
      return this.canRedo() ? (this.current++, this.data[this.current]) : null;
    };
    e.prototype.push = function (e) {
      var t = this.data;
      t.length - 1 > this.current && (t.length = this.current + 1);
      t.push(e);
      t.length >= this.max && t.shift();
      this.current = t.length - 1;
    };
    e.prototype.replace = function (e) {
      var t = this.data;
      t.length === 0 ? (t.push(e), (this.current = 0)) : (t[this.current] = e);
    };
    e.prototype.clear = function () {
      this.data.length = 0;
      this.current = 0;
    };
    return e;
  })(),
  H6 = i18nProxy.plugins.canvas,
  z6 = i18nProxy.interface,
  q6 = "0.7",
  W6 = 0.01,
  U6 = 0.93,
  _6 = -1.7,
  j6 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.insert = function (t) {
      t.bbox = t.getBBox();
      e.prototype.insert.call(this, t);
      return this;
    };
    t.prototype.remove = function (t) {
      return t.bbox ? (e.prototype.remove.call(this, t), (t.bbox = null), this) : this;
    };
    t.prototype.toBBox = function (e) {
      return e.bbox;
    };
    return t;
  })(M6),
  G6 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.compareMinX = function (e, t) {
      return e.x - t.x;
    };
    t.prototype.compareMinY = function (e, t) {
      return e.y - t.y;
    };
    return t;
  })(j6),
  K6 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.compareMinX = function (e, t) {
      var n = e.getBBox(),
        i = t.getBBox();
      return n.minX - i.minX;
    };
    t.prototype.compareMinY = function (e, t) {
      var n = e.getBBox(),
        i = t.getBBox();
      return n.minY - i.minY;
    };
    return t;
  })(j6),
  Y6 = (function () {
    function e(view) {
      var t = this;
      this.config = {
        zoomMultiplier: 0.5,
        objectSnapDistance: 15,
        minContainerDimension: 50,
        defaultTextNodeDimensions: {
          width: 250,
          height: 60,
        },
        defaultFileNodeDimensions: {
          width: 400,
          height: 400,
        },
      };
      this.requestUpdateFileOpen = debounce(this.updateFileOpen.bind(this), 200);
      this.zIndexCounter = 1;
      this.isHoldingSpace = false;
      this.readonly = false;
      this.history = new V6(100);
      this.data = {};
      this.requestPushHistory = debounce(this.pushHistory.bind(this), 250, !0);
      this.x = 0;
      this.y = 0;
      this.zoom = 0;
      this.scale = 1;
      this.tx = 0;
      this.ty = 0;
      this.tZoom = 0;
      this.finishViewportAnimation = false;
      this.zoomToFitQueued = false;
      this.screenshotting = false;
      this.nodes = new Map();
      this.nodeIndex = new G6();
      this.edges = new Map();
      this.edgeIndex = new K6();
      this.edgeFrom = new oc();
      this.edgeTo = new oc();
      this.staleSelection = null;
      this.selection = new Set();
      this.selectionChanged = false;
      this.keys = {};
      this.isDragging = false;
      this.viewportChanged = true;
      this.moved = new Set();
      this.dirty = new Set();
      this.frame = 0;
      this.wasAnimating = false;
      this.pauseAnimation = 0;
      this.lastNodesInViewport = new Set();
      this.lastEdgesInViewport = new Set();
      this.onGlobalKeydown = function (e) {
        if (e.key === " " && !t.isHoldingSpace) {
          if (t.selection.size === 1) {
            var n = Array.from(t.selection)[0];
            if (n instanceof t4 && n.isEditing) return;
          }
          t.wrapperEl.appendChild(t.moverEl);
          t.moverEl.style.zIndex = String(t.zIndexCounter + 4);
          t.isHoldingSpace = true;
        }
      };
      this.onGlobalKeyup = function (e) {
        if (e.key === " ") {
          t.moverEl.detach();
          t.isHoldingSpace = false;
        }
      };
      this.pointer = {
        x: 0,
        y: 0,
      };
      this.pointerFrame = 0;
      this.app = view.app;
      this.view = view;
      this.menu = new b6(this);
      var n = (this.wrapperEl = view.contentEl.createDiv({
        cls: "canvas-wrapper",
        attr: {
          tabIndex: -1,
          "data-ignore-swipe": "true",
        },
      }));
      n.onNodeInserted(function () {
        return t.onResize();
      });
      n.addEventListener("keydown", this.onKeydown.bind(this));
      n.addEventListener("pointerdown", this.onPriorityPointerdown.bind(this), {
        capture: !0,
      });
      n.addEventListener("pointerdown", this.onPointerdown.bind(this));
      n.addEventListener("dblclick", this.onDoubleClick.bind(this));
      n.addEventListener("contextmenu", this.onContextMenu.bind(this));
      n.addEventListener("wheel", this.onWheel.bind(this));
      Platform.isMobile || n.addEventListener("pointermove", this.onPointermove.bind(this));
      var i = n.createSvg("svg", "canvas-background"),
        r = ic(16);
      this.backgroundPatternEl = i.createSvg(
        "pattern",
        {
          attr: {
            id: r,
            patternUnits: "userSpaceOnUse",
          },
        },
        function (e) {
          e.createSvg("circle", {
            attr: {
              cx: q6,
              cy: q6,
              r: q6,
            },
          });
        },
      );
      i.createSvg("rect", {
        attr: {
          x: "0",
          y: "0",
          width: "100%",
          height: "100%",
          fill: "url(#".concat(r, ")"),
        },
      });
      (this.moverEl = createDiv("canvas-mover")).addEventListener(
        "pointerdown",
        this.handleMoverPointerdown.bind(this),
      );
      this.cardMenuEl = n.createDiv("canvas-card-menu", function (e) {
        e.createDiv(
          {
            cls: "canvas-card-menu-button mod-draggable",
          },
          function (e) {
            setTooltip(e, H6.actionDragToAddCard(), {
              placement: "top",
            });
            setIcon(e, "lucide-sticky-note");
            e.addEventListener("click", function () {
              t.createTextNode({
                pos: t.posCenter(),
                position: "center",
              });
            });
            e.addEventListener("pointerdown", function (e) {
              var size = t.config.defaultTextNodeDimensions;
              t.dragTempNode(e, size, function (e) {
                t.deselectAll();
                t.createTextNode({
                  pos: e,
                  size: size,
                });
              });
            });
          },
        );
        e.createDiv(
          {
            cls: "canvas-card-menu-button mod-draggable",
          },
          function (e) {
            setTooltip(e, H6.actionDragToAddNote(), {
              placement: "top",
            });
            setIcon(e, "lucide-file-text");
            e.addEventListener("click", function () {
              new n6(t, function (filee0) {
                t.createFileNode({
                  pos: t.posCenter(),
                  file: filee0,
                });
              })
                .showAttachments(!1)
                .open();
            });
            e.addEventListener("pointerdown", function (e) {
              var size = t.config.defaultFileNodeDimensions;
              t.dragTempNode(e, size, function (e) {
                new n6(t, function (filei0) {
                  t.createFileNode({
                    pos: e,
                    size: size,
                    file: filei0,
                  });
                })
                  .showAttachments(!1)
                  .open();
              });
            });
          },
        );
        e.createDiv(
          {
            cls: "canvas-card-menu-button mod-draggable",
          },
          function (e) {
            setTooltip(e, H6.actionDragToAddMedia(), {
              placement: "top",
            });
            setIcon(e, "lucide-file-image");
            e.addEventListener("click", function () {
              new i6(t, function (filee0) {
                t.createFileNode({
                  pos: t.posCenter(),
                  position: "center",
                  file: filee0,
                });
              }).open();
            });
            e.addEventListener("pointerdown", function (e) {
              var size = t.config.defaultFileNodeDimensions;
              t.dragTempNode(e, size, function (e) {
                new n6(t, function (filei0) {
                  t.createFileNode({
                    pos: e,
                    size: size,
                    file: filei0,
                  });
                })
                  .showMarkdownAndCanvas(!1)
                  .open();
              });
            });
          },
        );
      });
      this.canvasControlsEl = n.createDiv("canvas-controls", function (e) {
        e.createDiv("canvas-control-group", function (e) {
          e.createDiv("canvas-control-item", function (quickSettingsButton) {
            t.quickSettingsButton = quickSettingsButton;
            t.setReadonly(t.readonly);
            quickSettingsButton.addEventListener("click", function (n) {
              if (t.readonly) {
                t.setReadonly(!t.readonly);
                t.view.saveLocalData();
              } else {
                if (quickSettingsButton.hasClass("has-active-menu")) return;
                var i = new Menu();
                t.showQuickSettingsMenu(i);
                i.setParentElement(quickSettingsButton).showAtMouseEvent(n);
              }
            });
          });
        });
        e.createDiv("canvas-control-group", function (e) {
          e.createDiv("canvas-control-item", function (e) {
            setIcon(e, "lucide-plus");
            setTooltip(e, i18nProxy.commands.zoomIn(), {
              placement: "left",
            });
            e.addEventListener("click", function () {
              t.zoomBy(t.config.zoomMultiplier);
            });
          });
          e.createDiv("canvas-control-item", function (e) {
            setIcon(e, "lucide-rotate-cw");
            setTooltip(e, i18nProxy.commands.resetZoom(), {
              placement: "left",
            });
            e.addEventListener("click", function () {
              t.zoomBy(-t.zoom);
            });
          });
          e.createDiv("canvas-control-item", function (e) {
            setIcon(e, "lucide-maximize");
            var n = HO(BO(["Shift"], "1"));
            setTooltip(e, H6.actionZoomToFit() + "\n(".concat(n, ")"), {
              placement: "left",
            });
            e.addEventListener("click", function () {
              t.zoomToFit();
            });
          });
          e.createDiv("canvas-control-item", function (e) {
            setIcon(e, "lucide-minus");
            setTooltip(e, i18nProxy.commands.zoomOut(), {
              placement: "left",
            });
            e.addEventListener("click", function () {
              t.zoomBy(-t.config.zoomMultiplier);
            });
          });
        });
        e.createDiv("canvas-control-group", function (e) {
          e.createDiv("canvas-control-item", function (undoBtnEl) {
            t.undoBtnEl = undoBtnEl;
            setIcon(undoBtnEl, "lucide-undo-2");
            setTooltip(undoBtnEl, i18nProxy.setting.mobileToolbar.optionUndo(), {
              placement: "left",
            });
            undoBtnEl.addEventListener("click", function () {
              t.undo();
            });
          });
          e.createDiv("canvas-control-item", function (redoBtnEl) {
            t.redoBtnEl = redoBtnEl;
            setIcon(redoBtnEl, "lucide-redo-2");
            setTooltip(redoBtnEl, i18nProxy.setting.mobileToolbar.optionRedo(), {
              placement: "left",
            });
            redoBtnEl.addEventListener("click", function () {
              t.redo();
            });
          });
        });
        Platform.isDesktop &&
          e.createDiv("canvas-control-group", function (e) {
            e.createDiv("canvas-control-item", function (e) {
              setIcon(e, "lucide-help-circle");
              setTooltip(e, H6.labelCanvasHelp(), {
                placement: "left",
              });
              e.addEventListener("click", function () {
                new q2(t).open();
              });
            });
          });
      });
      var o = (this.canvasEl = n.createDiv("canvas"));
      this.edgeContainerEl = o.createSvg("svg", "canvas-edges");
      this.edgeEndContainerEl = o.createSvg("svg", "canvas-edges");
      this.app.dragManager.handleDrop(
        n,
        function (e, n, i) {
          if (!e.defaultPrevented) {
            if (n) {
              if (!i)
                switch (n.type) {
                  case "file":
                  case "link":
                    (fileu0 = n.file) instanceof TFile &&
                      t.createFileNode({
                        pos: t.posFromEvt(e),
                        file: fileu0,
                      });
                    t.wrapperEl.focus();
                    break;
                  case "files":
                    var r = n.files;
                    if (r.length) {
                      for (var o = new Set(), a = 0, s = r; a < s.length; a++) {
                        (fileu0 = s[a]) instanceof TFolder
                          ? Vault.recurseChildren(fileu0, function (e) {
                              if (e instanceof TFile) {
                                o.add(e);
                              }
                            })
                          : fileu0 instanceof TFile && o.add(fileu0);
                      }
                      var l = Array.from(o);
                      l.sort(function (e, t) {
                        return e.basename.localeCompare(t.basename);
                      });
                      var c = t.createFileNodes(l, t.posFromEvt(e));
                      t.deselectAll();
                      c.forEach(function (e) {
                        return t.select(e);
                      });
                      t.requestSave();
                    }
                    t.wrapperEl.focus();
                    break;
                  case "folder":
                    var fileu0;
                    if ((fileu0 = n.file) instanceof TFolder) {
                      var h = [];
                      Vault.recurseChildren(fileu0, function (e) {
                        if (e instanceof TFile) {
                          h.push(e);
                        }
                      });
                      h.sort(function (e, t) {
                        return e.basename.localeCompare(t.basename);
                      });
                      t.createFileNodes(h, t.posFromEvt(e));
                      t.requestSave();
                      t.wrapperEl.focus();
                      break;
                    }
                }
              return {
                dropEffect: "copy",
              };
            }
            e.preventDefault();
            var p = e.dataTransfer;
            if (hasFilesInDragData(e.dataTransfer)) {
              i ||
                t.app.importAttachments(extractFilesFromDataTransfer(p, "drop", !0), null).then(function (n) {
                  t.createFileNodes(n, t.posFromEvt(e));
                  t.requestSave();
                });
              return {
                dropEffect: "copy",
              };
            }
            var textd0 = e.dataTransfer.getData("text/plain");
            if (Wc(textd0)) {
              i ||
                t.createLinkNode({
                  pos: t.posFromEvt(e),
                  position: "center",
                  url: textd0,
                });
              return {
                dropEffect: "link",
              };
            }
            if (textd0) {
              if (!i) {
                var f = t.posFromEvt(e);
                t.createTextNode({
                  pos: f,
                  position: "center",
                  text: textd0,
                });
              }
              return {
                dropEffect: "copy",
              };
            }
          }
        },
        !0,
      );
      this.canvasRect = W2(this.wrapperEl);
      this.nodeInteractionLayer = new e4(this);
    }
    Object.defineProperty(e.prototype, "options", {
      get: function () {
        return this.view.plugin.options;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.createPlaceholder = function () {
      var texte0;
      if (!this.canvasPlaceholderEl) {
        texte0 = Platform.isMobile
          ? createFragment(function (e) {
              e.appendText(H6.labelDragPan());
              e.createEl("br");
              e.appendText(H6.labelPinchZoom());
              e.createEl("br");
              e.appendText(H6.labelLongpress());
            })
          : createFragment(function (e) {
              e.appendText(H6.labelDragFromBelow());
              e.createEl("br");
              e.appendText(H6.labelSpaceDragPan());
              e.createEl("br");
              e.appendText("".concat(modifierDisplayMap.Mod, " + ").concat(H6.labelScrollToZoom()));
            });
        this.canvasPlaceholderEl = this.canvasEl.createDiv({
          cls: "canvas-placeholder-message",
          text: texte0,
        });
      }
    };
    e.prototype.getData = function () {
      var nodes = [],
        edges = [],
        n = Array.from(this.nodes.values());
      n.sort(Z6);
      for (var i = 0, r = n; i < r.length; i++) {
        var o = r[i];
        nodes.push(o.getData());
      }
      for (var a = 0, s = Array.from(this.edges.values()); a < s.length; a++) {
        var l = s[a];
        edges.push(l.getData());
      }
      return __assign(__assign({}, this.data), {
        nodes: nodes,
        edges: edges,
      });
    };
    e.prototype.getSelectionData = function (e) {
      if (undefined === e) {
        e = this.selection;
      }
      var nodes = [],
        edges = [],
        i = Array.from(e);
      i.sort(Z6);
      for (var r = new Set(), o = 0, a = i; o < a.length; o++) {
        var s = a[o];
        if (s instanceof t4) {
          nodes.push(s.getData());
          for (var l = 0, c = this.getEdgesForNode(s); l < c.length; l++) {
            var u = c[l];
            r.add(u);
          }
        }
      }
      for (var h = 0, p = Array.from(r); h < p.length; h++) {
        u = p[h];
        if (e.has(u.from.node) && e.has(u.to.node)) {
          edges.push(u.getData());
        }
      }
      return {
        nodes: nodes,
        edges: edges,
        center: X2(
          K2(
            i.map(function (e) {
              return e.getBBox();
            }),
          ),
        ),
      };
    };
    e.prototype.updateFileOpen = function (e) {
      var t = this.app,
        n = this.view,
        i = n.leaf;
      if (i === t.workspace.activeLeaf && i.view === n) {
        e === null && (e = this.view.file);
        this.app.workspace.trigger("file-open", e);
      }
    };
    e.prototype.setData = function (data) {
      if (data) {
        Object.keys(data).length !== 0
          ? (this.importData(data, !0), (this.data = data), this.pushHistory(data))
          : this.createPlaceholder();
      }
    };
    e.prototype.importData = function (e, t) {
      var n = this,
        i = e.nodes,
        r = e.edges;
      if (i && Array.isArray(i)) {
        for (var o = this.nodes, a = new Set(), s = 0, l = 0, c = i; l < c.length; l++) {
          var u = c[l],
            h = u.id,
            p = undefined;
          if (o.has(h)) p = o.get(h);
          else {
            if (u.type === "file") p = new a4(this, h);
            else if (u.type === "text") p = new l4(this, h);
            else if (u.type === "link") p = new u4(this, h);
            else {
              if (u.type !== "group") continue;
              p = new p4(this, h);
            }
            this.addNode(p);
            this.markMoved(p);
          }
          p.setData(u);
          a.add(p);
          p.zIndex < s && p.updateZIndex();
          s = p.zIndex;
        }
        if (
          (t &&
            o.forEach(function (e) {
              if (!a.has(e)) {
                n.removeNode(e);
              }
            }),
          r && Array.isArray(r))
        ) {
          for (var d = this.edges, f = new Set(), m = 0, g = r; m < g.length; m++) {
            var v = g[m],
              y = ((h = v.id), v.fromNode),
              side = v.fromSide,
              w = v.fromEnd,
              k = v.toNode,
              sideC0 = v.toSide,
              E = v.toEnd;
            if (o.has(y) && o.has(k)) {
              var S = undefined;
              if (d.has(h)) S = d.get(h);
              else {
                var node = o.get(y),
                  nodex0 = o.get(k);
                side || (v.fromSide = side = f4(node, nodex0));
                sideC0 || (v.toSide = sideC0 = f4(nodex0, node));
                S = new C4(
                  this,
                  h,
                  {
                    node: node,
                    side: side,
                    end: w || w4,
                  },
                  {
                    node: nodex0,
                    side: sideC0,
                    end: E || k4,
                  },
                );
                this.addEdge(S);
                this.markMoved(S);
              }
              f.add(S);
              S.setData(v);
            } else if (d.has(h)) {
              this.removeEdge(d.get(h));
            }
          }
          t &&
            d.forEach(function (e) {
              if (!f.has(e)) {
                n.removeEdge(e);
              }
            });
          return a;
        }
      }
    };
    e.prototype.load = function () {
      window.addEventListener("keydown", this.onGlobalKeydown);
      window.addEventListener("keyup", this.onGlobalKeyup);
    };
    e.prototype.unload = function () {
      window.removeEventListener("keydown", this.onGlobalKeydown);
      window.removeEventListener("keyup", this.onGlobalKeyup);
      this.clear();
      this.cancelFrame();
    };
    e.prototype.clear = function () {
      var e = this;
      this.staleSelection = [];
      this.selection.clear();
      this.nodes.forEach(function (t) {
        return e.removeNode(t);
      });
      this.edges.forEach(function (t) {
        return e.removeEdge(t);
      });
      this.nodeIndex.clear();
      this.history.clear();
      this.data = {};
      this.requestPushHistory.cancel();
      this.requestUpdateFileOpen.cancel();
      this.setViewport(0, 0, 0);
      this.setReadonly(!1);
    };
    e.prototype.requestSave = function (e) {
      undefined === e && (e = true);
      this.data = this.getData();
      e && this.requestPushHistory(this.data);
      this.view.requestSave();
    };
    e.prototype.overrideHistory = function () {
      this.requestPushHistory.run();
      this.data = this.getData();
      this.history.replace(this.data);
      this.updateHistoryUI();
      this.view.requestSave();
    };
    e.prototype.undo = function () {
      var e = this.history;
      if (e.canUndo()) {
        this.applyHistory(e.undo());
      }
    };
    e.prototype.redo = function () {
      var e = this.history;
      if (e.canRedo()) {
        this.applyHistory(e.redo());
      }
    };
    e.prototype.applyHistory = function (data) {
      this.importData(data, !0);
      this.data = data;
      this.view.requestSave();
      this.updateHistoryUI();
    };
    e.prototype.pushHistory = function (e) {
      this.history.push(e);
      this.updateHistoryUI();
    };
    e.prototype.updateHistoryUI = function () {
      var e = this.history;
      this.undoBtnEl.toggleClass("is-disabled", !e.canUndo());
      this.redoBtnEl.toggleClass("is-disabled", !e.canRedo());
    };
    Object.defineProperty(e.prototype, "zoomBreakpoint", {
      get: function () {
        return _6 - (this.options.zoomBreakpoint || 0);
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.setViewport = function (e, t, tZoom) {
      if (!(e === this.x && t === this.y && tZoom === this.zoom)) {
        this.x = this.tx = e;
        this.y = this.ty = t;
        this.zoom = this.tZoom = tZoom;
        this.markViewportChanged();
      }
    };
    e.prototype.zoomBy = function (e, zoomCenter) {
      var tZoom = this.tZoom;
      tZoom += e;
      this.tZoom = tZoom;
      zoomCenter || (zoomCenter = Pl(0, 0));
      this.zoomCenter = zoomCenter;
      this.markViewportChanged();
    };
    e.prototype.panTo = function (e, t) {
      this.x = e;
      this.y = t;
      this.tx = e;
      this.ty = t;
      this.markViewportChanged();
    };
    e.prototype.panBy = function (e, t) {
      this.x += e;
      this.y += t;
      this.tx = this.x;
      this.ty = this.y;
      this.markViewportChanged();
    };
    e.prototype.zoomToSelection = function () {
      var e = this.selection;
      if (e.size !== 0) {
        var t = K2(
          Array.from(e.values()).map(function (e) {
            return e.getBBox();
          }),
        );
        this.zoomToBbox(t);
      }
    };
    e.prototype.nudgeSelection = function (e, t) {
      var n = Array.from(this.selection).filter(function (e) {
        return e instanceof t4;
      });
      if (n.length !== 0) {
        var i = e.shiftKey ? 5 * this.gridSpacing : this.gridSpacing,
          r = {
            x: 0,
            y: 0,
          };
        switch (t) {
          case "down":
            r.y = i;
            break;
          case "up":
            r.y = -i;
            break;
          case "left":
            r.x = -i;
            break;
          case "right":
            r.x = i;
        }
        if (this.options.snapToGrid) {
          var o = this.gridSpacing,
            a = K2(
              Array.from(this.selection).map(function (e) {
                return e.getBBox();
              }),
            ),
            s = {
              x: Math.round(a.minX % o),
              y: Math.round(a.minY % o),
            };
          (t === "left" || t === "right") && s.x > 0
            ? ((r.x = -s.x), t === "right" && (r.x += o))
            : (t === "up" || t === "down") && s.y > 0 && ((r.y = -s.y), t === "down" && (r.x += o));
        }
        for (var l = 0, c = n; l < c.length; l++) {
          var u = c[l];
          u.moveTo({
            x: u.x + r.x,
            y: u.y + r.y,
          });
        }
        this.requestSave();
      }
    };
    e.prototype.zoomToFit = function () {
      var e = this.nodes;
      if (e.size !== 0) {
        var t = K2(
          Array.from(e.values()).map(function (e) {
            return e.getBBox();
          }),
        );
        this.zoomToBbox(t);
      }
    };
    e.prototype.zoomToBbox = function (e) {
      var t = this.canvasRect,
        n = t.width,
        i = t.height;
      if (n !== 0 && i !== 0) {
        var r = n / (1.1 * (e.maxX - e.minX)),
          o = i / (1.1 * (e.maxY - e.minY)),
          a = Math.clamp(Math.min(r, o), -4, 1),
          s = X2(e);
        this.tx = s.x;
        this.ty = s.y;
        this.zoomCenter = null;
        this.tZoom = Math.log2(a);
        this.markViewportChanged();
      }
    };
    e.prototype.panIntoView = function (e, t) {
      undefined === t && (t = this.gridSpacing);
      e = Y2(e, t);
      var n = this.getViewportBBox();
      e.maxX - e.minX > n.maxX - n.minX || e.maxY - e.minY > n.maxY - n.minY
        ? this.zoomToBbox(e)
        : (e.minX < n.minX && (this.tx = this.x + e.minX - n.minX),
          e.minY < n.minY && (this.ty = this.y + e.minY - n.minY),
          e.maxX > n.maxX && (this.tx = this.x + e.maxX - n.maxX),
          e.maxY > n.maxY && (this.ty = this.y + e.maxY - n.maxY),
          this.markViewportChanged());
    };
    Object.defineProperty(e.prototype, "gridSpacing", {
      get: function () {
        var e = this.zoom;
        return e < -3.3 ? 160 : e < -2.16 ? 80 : e < -0.91 ? 40 : 20;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(e.prototype, "snapDistance", {
      get: function () {
        return Math.ceil(this.config.objectSnapDistance / this.scale);
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.posFromEvt = function (e) {
      return this.posFromDom(this.domPosFromEvt(e));
    };
    e.prototype.domPosFromEvt = function (e) {
      var t = this.canvasRect,
        n = t.cx,
        i = t.cy;
      return Pl(e.clientX - n, e.clientY - i);
    };
    e.prototype.domPosFromClient = function (e) {
      var t = this.canvasRect,
        n = t.cx,
        i = t.cy;
      return Pl(e.x - n, e.y - i);
    };
    e.prototype.posFromClient = function (e) {
      return this.posFromDom(this.domPosFromClient(e));
    };
    e.prototype.posFromDom = function (e) {
      var t = this,
        n = t.x,
        i = t.y,
        r = t.scale;
      return Pl(n + e.x / r, i + e.y / r);
    };
    e.prototype.domFromPos = function (e) {
      var t = this,
        n = t.x,
        i = t.y,
        r = t.scale;
      return Pl((e.x - n) * r, (e.y - i) * r);
    };
    e.prototype.posCenter = function () {
      return this.posFromDom(Pl(0, 0));
    };
    e.prototype.posInViewport = function (e) {
      var t = this.canvasRect,
        n = t.minX,
        i = t.minY,
        r = t.maxX,
        o = t.maxY;
      return e.x >= n || e.x <= r || e.y >= i || e.y <= o;
    };
    e.prototype.getViewportNodes = function (e) {
      var t = this.getIntersectingNodes(this.getViewportBBox());
      if (e) {
        var n = this.selection;
        t = t.filter(function (e) {
          return !n.has(e);
        });
      }
      return t;
    };
    e.prototype.hitTestNode = function (e, t) {
      if (undefined === t) {
        t = 0;
      }
      var n = this.nodeIndex.search(Y2(U2(e.x, e.y, e.x, e.y), t));
      return n.length === 0
        ? null
        : (n.sort(function (e, t) {
            return t.zIndex - e.zIndex;
          }),
          n[0]);
    };
    e.prototype.addNode = function (e) {
      this.nodes.set(e.id, e);
      this.requestFrame();
      this.canvasPlaceholderEl && (this.canvasPlaceholderEl.detach(), (this.canvasPlaceholderEl = null));
    };
    e.prototype.removeNode = function (e) {
      for (var t = 0, n = this.getEdgesForNode(e); t < n.length; t++) {
        var i = n[t];
        this.removeEdge(i);
      }
      this.deselect(e);
      this.nodes.delete(e.id);
      this.nodeIndex.remove(e);
      this.moved.delete(e);
      this.dirty.delete(e);
      this.lastNodesInViewport.delete(e);
      e.destroy();
      this.requestFrame();
    };
    e.prototype.getIntersectingNodes = function (e) {
      return this.nodeIndex.search(e);
    };
    e.prototype.getContainingNodes = function (e) {
      return this.nodeIndex.search(e).filter(function (t) {
        return Z2(e, t.getBBox());
      });
    };
    e.prototype.addEdge = function (e) {
      var t = this,
        n = t.edges,
        i = t.edgeFrom,
        r = t.edgeTo;
      n.set(e.id, e);
      i.add(e.from.node, e);
      r.add(e.to.node, e);
      this.requestFrame();
    };
    e.prototype.removeEdge = function (e) {
      var t = this,
        n = t.edges,
        i = t.edgeIndex,
        r = t.edgeFrom,
        o = t.edgeTo;
      if (n.has(e.id)) {
        this.deselect(e);
        n.delete(e.id);
        r.delete(e.from.node, e);
        o.delete(e.to.node, e);
        i.remove(e);
        this.moved.delete(e);
        this.dirty.delete(e);
        this.lastEdgesInViewport.delete(e);
        e.destroy();
        this.requestFrame();
      }
    };
    e.prototype.getEdgesForNode = function (e) {
      return this.edgeFrom.getArray(e).concat(this.edgeTo.getArray(e));
    };
    e.prototype.getIntersectingEdges = function (e) {
      return this.edgeIndex.search(e);
    };
    e.prototype.updateSelection = function (e) {
      this.staleSelection || (this.staleSelection = Array.from(this.selection));
      e();
      this.requestFrame();
    };
    e.prototype.select = function (e) {
      var t = this.selection;
      if (!t.has(e)) {
        this.updateSelection(function () {
          t.add(e);
        });
      }
    };
    e.prototype.deselect = function (e) {
      var t = this.selection;
      if (t.has(e)) {
        this.updateSelection(function () {
          t.delete(e);
        });
      }
    };
    e.prototype.toggleSelect = function (e) {
      var t = this.selection;
      this.updateSelection(function () {
        t.has(e) ? t.delete(e) : t.add(e);
      });
    };
    e.prototype.selectOnly = function (e) {
      var t = this.selection;
      if (!(t.size === 1 && Array.from(t)[0] === e)) {
        this.updateSelection(function () {
          t.clear();
          t.add(e);
        });
      }
    };
    e.prototype.selectAll = function (e) {
      var t = this,
        n = this.selection;
      this.updateSelection(function () {
        e
          ? (n.clear(),
            e.forEach(function (e) {
              return n.add(e);
            }))
          : t.nodes.forEach(function (e) {
              return n.add(e);
            });
      });
    };
    e.prototype.deselectAll = function () {
      var e = this.selection;
      if (e.size !== 0) {
        this.updateSelection(function () {
          e.clear();
        });
      }
    };
    e.prototype.deleteSelection = function () {
      if (!this.readonly) {
        for (var e = this.selection, t = 0, n = Array.from(e); t < n.length; t++) {
          var i = n[t];
          i instanceof t4 && this.removeNode(i);
          i instanceof C4 && this.removeEdge(i);
        }
        this.deselectAll();
        this.requestSave();
      }
    };
    e.prototype.setDragging = function (isDragging) {
      if (this.isDragging !== isDragging) {
        this.isDragging = isDragging;
        this.wrapperEl.toggleClass("is-dragging", isDragging);
        this.selectionChanged = true;
        this.requestFrame();
      }
    };
    e.prototype.onResize = function () {
      var e = this.canvasRect,
        t = (this.canvasRect = W2(this.wrapperEl));
      if (
        (Platform.isMobile &&
          e.height > 0 &&
          t.height > 0 &&
          e.height !== t.height &&
          (this.y = this.ty += (t.height - e.height) / 2 / this.scale),
        Platform.isMobile && this.selection.size === 1)
      ) {
        var n = Array.from(this.selection)[0];
        if (n instanceof t4 && n.isEditing) {
          this.panIntoView(n.getBBox());
        }
      }
      this.viewportChanged = true;
      this.requestFrame();
      this.canvasRect.width > 0 &&
        this.zoomToFitQueued &&
        ((this.zoomToFitQueued = false), (this.finishViewportAnimation = true), this.zoomToFit());
    };
    e.prototype.getZIndex = function () {
      var e = this,
        t = e.menu,
        n = e.cardMenuEl,
        i = e.canvasControlsEl,
        r = (this.zIndexCounter += 1),
        zIndex = (r + 1).toString();
      n.style.zIndex = zIndex;
      i.style.zIndex = zIndex;
      t.updateZIndex(r + 3);
      return r;
    };
    e.prototype.createTextNode = function (e) {
      var t = e.pos,
        n = e.size,
        i = e.position,
        r = e.text,
        o = e.save,
        a = e.focus,
        s = new l4(this);
      n || (n = this.config.defaultTextNodeDimensions);
      s.moveAndResize($2(t, n, i));
      r && s.setText(r);
      this.addNode(s);
      !1 !== o && this.requestSave();
      !1 !== a && (s.attach(), s.render(), this.selectOnly(s), s.startEditing());
      return s;
    };
    e.prototype.createFileNode = function (e) {
      var t = e.pos,
        n = e.size,
        i = e.position,
        r = e.file,
        o = e.subpath,
        a = e.save,
        s = e.focus,
        l = new a4(this);
      n || (n = this.config.defaultFileNodeDimensions);
      l.moveAndResize($2(t, n, i));
      l.setFile(r, o);
      this.addNode(l);
      !1 !== a && this.requestSave();
      !1 !== s && this.selectOnly(l);
      return l;
    };
    e.prototype.createFileNodes = function (e, t) {
      for (
        var n = t.x,
          i = t.y,
          size = this.config.defaultFileNodeDimensions,
          o = size.width,
          a = size.height,
          s = 0,
          l = [],
          c = 0,
          u = e;
        c < u.length;
        c++
      ) {
        var fileh0 = u[c];
        l.push(
          this.createFileNode({
            pos: {
              x: n + (o + 45) * (s % 10),
              y: i + (a + 45) * Math.trunc(s / 10),
            },
            size: size,
            file: fileh0,
            save: false,
            focus: false,
          }),
        );
        s++;
      }
      return l;
    };
    e.prototype.createLinkNode = function (e) {
      var t = e.pos,
        n = e.size,
        i = e.position,
        r = e.url,
        o = e.save,
        a = e.focus,
        s = new u4(this);
      n || (n = this.config.defaultFileNodeDimensions);
      IN.test(r) &&
        (n = {
          width: 640,
          height: 360,
        });
      s.moveAndResize($2(t, n, i));
      s.setUrl(r);
      this.addNode(s);
      !1 !== o && this.requestSave();
      !1 !== a && this.selectOnly(s);
      return s;
    };
    e.prototype.createGroupNode = function (e) {
      var t = e.pos,
        n = e.size,
        i = e.position,
        r = e.label,
        o = e.save,
        a = e.focus,
        s = new p4(this);
      n || (n = this.config.defaultFileNodeDimensions);
      s.moveAndResize($2(t, n, i));
      r || (r = H6.labelUntitledGroup());
      s.setLabel(r);
      this.addNode(s);
      !1 !== o && this.requestSave();
      !1 !== a && (this.selectOnly(s), s.attach(), s.render(), s.focusLabel());
      return s;
    };
    e.prototype.markViewportChanged = function () {
      this.viewportChanged = true;
      this.requestFrame();
    };
    e.prototype.markMoved = function (e) {
      this.moved.add(e);
      this.requestFrame();
    };
    e.prototype.markDirty = function (e) {
      this.dirty.add(e);
      this.selection.has(e) && (this.selectionChanged = true);
      this.requestFrame();
    };
    e.prototype.requestFrame = function (e) {
      var t = this;
      if (!this.frame) {
        e || (e = performance.now());
        this.frameWin = this.canvasEl.win;
        this.frame = this.frameWin.requestAnimationFrame(function () {
          t.frame = 0;
          t.frameWin = null;
          var n = performance.now(),
            i = n - e,
            r = t.viewportChanged;
          if (r) {
            var o = Math.pow(0.984, i);
            t.finishViewportAnimation && ((o = 0), (t.finishViewportAnimation = false));
            var a = 1 - o,
              s = t,
              l = s.x,
              c = s.y,
              zoom = s.zoom,
              h = s.tx,
              p = s.ty,
              d = s.tZoom,
              f = s.zoomCenter,
              scale = s.scale;
            t.screenshotting || (d = t.tZoom = Math.clamp(d, -4, 1));
            var g = d - zoom;
            if ((Math.abs(g) < W6 && (a = 1), Math.abs(g) === 1 / 0)) {
              zoom = d = 0;
              scale = Math.pow(2, zoom);
            } else if (g === 0) {
              zoom = d;
              scale = Math.pow(2, zoom);
            } else if (f) {
              var v = f.x,
                y = f.y,
                b = scale;
              zoom += g * a;
              l -= v / (scale = Math.pow(2, zoom)) - v / b;
              c -= y / scale - y / b;
              h = t.tx = l;
              p = t.ty = c;
            } else {
              zoom += g * a;
              scale = Math.pow(2, zoom);
            }
            var w = h - l;
            l += w * a;
            w !== 0 && Math.abs(w) < W6 && (l = h);
            var k = p - c;
            c += k * a;
            k !== 0 && Math.abs(k) < W6 && (c = p);
            t.x = l;
            t.y = c;
            t.zoom = zoom;
            t.scale = scale;
            var C = t,
              E = C.canvasEl,
              S = C.wrapperEl,
              M = t.canvasRect,
              x = M.width,
              T = M.height;
            S.toggleClass("mod-zoomed-out", zoom <= _6);
            E.style.transform = "translate("
              .concat(x / 2, "px, ")
              .concat(T / 2, "px) scale(")
              .concat(scale, ") translate(")
              .concat(-l, "px, ")
              .concat(-c, "px)");
            var D = t.gridSpacing;
            t.backgroundPatternEl.setAttrs({
              x: String(x / 2 - (l % D) * scale),
              y: String(T / 2 - (c % D) * scale),
              width: String(D * scale),
              height: String(D * scale),
            });
            t.x !== h || t.y !== p || t.zoom !== d || Date.now() < t.pauseAnimation
              ? (t.requestFrame(n), (t.wasAnimating = true))
              : (t.screenshotting && (scale = Math.min(1, scale)),
                S.setCssProps({
                  "--zoom-multiplier": String(Math.sqrt(1 / scale)),
                }),
                S.toggleClass("mod-animating", !Platform.isIosApp && t.wasAnimating),
                (t.wasAnimating = false),
                (t.viewportChanged = false),
                t.app.workspace.requestSaveLayout());
          }
          var A = t,
            P = A.moved,
            L = A.dirty,
            I = A.nodes,
            O = A.edges,
            F = A.edgeIndex,
            N = A.nodeIndex;
          if (P.size > 0) {
            for (var R = 0, B = Array.from(P); R < B.length; R++) {
              if ((re = B[R]) instanceof t4)
                for (var V = 0, H = t.getEdgesForNode(re); V < H.length; V++) {
                  var z = H[V];
                  P.add(z);
                }
            }
            for (var q = [], W = [], U = 0, _ = Array.from(P); U < _.length; U++) {
              (re = _[U]) instanceof t4
                ? (N.remove(re), I.has(re.id) && q.push(re))
                : re instanceof C4 && (F.remove(re), O.has(re.id) && W.push(re));
              L.add(re);
            }
            for (var j = 0, G = q; j < G.length; j++) {
              var K = G[j];
              N.insert(K);
            }
            for (var Y = 0, Z = W; Y < Z.length; Y++) {
              z = Z[Y];
              F.insert(z);
            }
          }
          t.virtualize();
          for (var X = 0, Q = Array.from(L); X < Q.length; X++) {
            (re = Q[X]).isAttached && (re.render(), L.delete(re));
          }
          var $ = t,
            J = $.staleSelection,
            ee = $.selection,
            te = $.selectionChanged;
          if (J) {
            for (var ne = 0, ie = J; ne < ie.length; ne++) {
              var re = ie[ne];
              ee.has(re) || (J.length === 1 ? re.blur() : re.deselect(), (te = true));
            }
            for (var oe = new Set(J), ae = 0, se = Array.from(ee); ae < se.length; ae++) {
              re = se[ae];
              oe.has(re)
                ? J.length === 1 && ee.size > 1
                  ? (re.blur(), re.select(), (te = true))
                  : J.length > 1 && ee.size === 1 && (re.deselect(), re.focus(), (te = true))
                : (ee.size === 1 ? re.focus() : re.select(), (te = true));
            }
            if (Platform.isMobile) {
              var le = null,
                ce = Array.from(ee);
              ce.length === 1 && ce[0] instanceof t4 && (le = ce[0]);
              t.nodeInteractionLayer.setTarget(le);
            }
          }
          t.staleSelection = null;
          t.selectionChanged = false;
          (te ||
            r ||
            Array.from(t.selection).some(function (e) {
              return P.has(e);
            })) &&
            t.menu.render(te);
          P.clear();
          t.nodeInteractionLayer.render();
        });
      }
    };
    e.prototype.cancelFrame = function () {
      var e = this,
        t = e.frameWin,
        n = e.frame,
        i = e.pointerFrame,
        r = e.pointerFrameWin;
      n && t && (t.cancelAnimationFrame(n), (this.frame = 0), (this.frameWin = null));
      i && r && (r.cancelAnimationFrame(i), (this.pointerFrame = 0), (this.pointerFrameWin = null));
    };
    e.prototype.getViewportBBox = function () {
      var e = this.canvasRect,
        t = this.posFromDom(Pl(e.minX, e.minY)),
        n = this.posFromDom(Pl(e.maxX, e.maxY));
      return {
        minX: t.x,
        minY: t.y,
        maxX: n.x,
        maxY: n.y,
      };
    };
    e.prototype.virtualize = function () {
      var e = this,
        t = e.screenshotting,
        n = e.lastNodesInViewport,
        i = e.lastEdgesInViewport,
        r = this.getViewportBBox(),
        o = this.getIntersectingNodes(r),
        a = this.getIntersectingEdges(r);
      if (t) {
        o = Array.from(this.nodes.values());
        a = Array.from(this.edges.values());
      }
      var lastNodesInViewport = new Set(o),
        lastEdgesInViewport = new Set(a),
        c = this.selection;
      if (c.size === 1) {
        c.forEach(function (e) {
          e instanceof t4 && lastNodesInViewport.add(e);
        });
      }
      for (var u = 0, h = 0, p = o; h < p.length; h++) {
        var d = p[h];
        n.has(d) ? d.attach() : u < 10 || t ? (d.attach(), u++) : lastNodesInViewport.delete(d);
      }
      for (var f = 0, m = a; f < m.length; f++) {
        m[f].attach();
      }
      var g = [];
      n.forEach(function (e) {
        if (!lastNodesInViewport.has(e)) {
          g.push(e);
        }
      });
      for (var v = 0, y = g; v < y.length; v++) {
        (d = y[v]).preDetach();
      }
      for (var b = 0, w = g; b < w.length; b++) {
        (d = w[b]).detach();
      }
      i.forEach(function (e) {
        if (!lastEdgesInViewport.has(e)) {
          e.detach();
        }
      });
      this.lastNodesInViewport = lastNodesInViewport;
      this.lastEdgesInViewport = lastEdgesInViewport;
      u > 0 && this.requestFrame();
    };
    e.prototype.rerenderViewport = function () {
      var e = this;
      this.lastNodesInViewport.forEach(function (t) {
        return e.markDirty(t);
      });
    };
    e.prototype.setState = function (e) {
      var t = e.x,
        n = e.y,
        i = e.zoom;
      if (Number.isNumber(t) && Number.isNumber(n) && Number.isNumber(i)) {
        this.setViewport(t, n, i);
        this.zoomToFitQueued = false;
      }
    };
    e.prototype.getState = function () {
      var e = this;
      return {
        x: e.tx,
        y: e.ty,
        zoom: e.tZoom,
      };
    };
    e.prototype.handleCut = function (e) {
      if (!this.readonly && this.canvasEl.doc.activeElement === this.wrapperEl) {
        this.handleCopy(e);
        for (var t = this.selection, n = 0, i = Array.from(t); n < i.length; n++) {
          var r = i[n];
          r instanceof t4 && this.removeNode(r);
          r instanceof C4 && this.removeEdge(r);
        }
        this.requestSave();
      }
    };
    e.prototype.cloneData = function (e, t) {
      for (var n = e.nodes, i = e.edges, r = {}, o = 0, a = n; o < a.length; o++) {
        var s = a[o],
          l = s.id,
          c = ic(16);
        s.id = c;
        r[l] = c;
        t && ((s.x += t.x), (s.y += t.y));
      }
      for (var u = 0, h = i; u < h.length; u++) {
        var p = h[u];
        p.fromNode = r[p.fromNode] || "";
        p.toNode = r[p.toNode] || "";
        p.id = ic(16);
      }
      return e;
    };
    e.prototype.handleCopy = function (e) {
      if (this.canvasEl.doc.activeElement === this.wrapperEl && (e.preventDefault(), this.selection.size !== 0)) {
        var t = this.getSelectionData();
        e.clipboardData.setData("obsidian/canvas", JSON.stringify(t));
      }
    };
    e.prototype.handlePaste = function (e) {
      var t = this;
      if (!e.defaultPrevented && !this.readonly && this.canvasEl.doc.activeElement === this.wrapperEl) {
        e.preventDefault();
        var n = this.posCenter(),
          i = extractFilesFromDataTransfer(e.clipboardData, "clipboard", !0);
        if (i.length > 0)
          this.app.importAttachments(i, null).then(function (e) {
            t.createFileNodes(e, n);
            t.requestSave();
          });
        else {
          var r = e.clipboardData.getData("obsidian/canvas");
          if (r) {
            var o = undefined;
            try {
              o = JSON.parse(r);
            } catch (e) {
              return void console.error(e);
            }
            var a = o.nodes,
              s = o.edges,
              l = o.center;
            if (!a || !Array.isArray(a)) return;
            if (!s || !Array.isArray(s)) return;
            var c = null;
            if (l) {
              c = {
                x: n.x - l.x,
                y: n.y - l.y,
              };
            }
            var u = this.cloneData(o, c),
              h = this.importData(u, !1);
            this.deselectAll();
            this.requestSave();
            return void h.forEach(function (e) {
              return t.select(e);
            });
          }
          var textp0 = e.clipboardData.getData("text/plain");
          if (Wc(textp0)) {
            this.createLinkNode({
              pos: n,
              position: "center",
              url: textp0,
            });
            return void this.requestSave();
          }
          if (textp0) {
            this.createTextNode({
              pos: n,
              position: "center",
              text: textp0,
            });
          }
        }
      }
    };
    e.prototype.toggleGridSnapping = function (snapToGrid) {
      this.options.snapToGrid = snapToGrid;
      this.view.plugin.saveOptions();
    };
    e.prototype.toggleObjectSnapping = function (snapToObjects) {
      this.options.snapToObjects = snapToObjects;
      this.view.plugin.saveOptions();
    };
    e.prototype.getSnapping = function (e, t, n, i) {
      var r,
        o,
        a = this.options,
        s = a.snapToGrid,
        l = a.snapToObjects,
        c = 0,
        u = 0;
      if (e.length === 0)
        return {
          x: 0,
          y: 0,
        };
      if (l) {
        var h = s6(e),
          p = s6(t),
          d = this.snapDistance;
        (r = c6(h, p, n ? d : 0, "x")) && (c += r.delta);
        (o = c6(h, p, i ? d : 0, "y")) && (u += o.delta);
      }
      if (s && (!r || !o)) {
        var f = K2(e),
          m = this.gridSpacing;
        !r && n && (c += Math.round(f.minX / m) * m - f.minX);
        !o && i && (u += Math.round(f.minY / m) * m - f.minY);
      }
      (r || o) && this.renderSnapPoints(r, o, c, u);
      return Pl(c, u);
    };
    e.prototype.endSnapPointRendering = function () {
      if (this.snapContainerEl) {
        this.snapContainerEl.detach();
        this.snapContainerEl = null;
      }
    };
    e.prototype.clearSnapPoints = function () {
      if (this.snapContainerEl) {
        this.snapContainerEl.empty();
      }
    };
    e.prototype.renderSnapPoints = function (e, t, n, i) {
      var r = this.snapContainerEl;
      r || (r = this.snapContainerEl = this.canvasEl.createSvg("svg", "canvas-snaps"));
      r.style.zIndex = String(this.zIndexCounter + 2);
      var o = function (e) {
          return Pl(e.x + n, e.y + i);
        },
        a = [];
      e && (a = a.concat(e.matches));
      t && (a = a.concat(t.matches));
      for (var s = 0, l = a; s < l.length; s++) {
        for (
          var c = l[s],
            u = c.src,
            h = c.dest,
            p = 1 / 0,
            d = 1 / 0,
            f = -1 / 0,
            m = -1 / 0,
            g = 0,
            v = u.map(o).concat(h);
          g < v.length;
          g++
        ) {
          var y = v[g];
          r.createSvg("circle", {
            attr: {
              cx: y.x,
              cy: y.y,
              r: 4,
            },
          });
          p = Math.min(p, y.x);
          d = Math.min(d, y.y);
          f = Math.max(f, y.x);
          m = Math.max(m, y.y);
        }
        r.createSvg("line", {
          attr: {
            x1: p,
            y1: d,
            x2: f,
            y2: m,
          },
        });
      }
    };
    e.prototype.onKeydown = function (e) {
      if (!e.repeat && !e.defaultPrevented && !fG(e.targetNode))
        switch (e.key) {
          case "Escape":
            this.deselectAll();
            break;
          case "Backspace":
          case "Delete":
            var t = this.wrapperEl;
            if (this.isDragging || t.doc.activeElement !== t) break;
            this.deleteSelection();
        }
    };
    e.prototype.onPriorityPointerdown = function (e) {
      var t = this;
      if (e.pointerType === "mouse") {
        if (e.button === 1) {
          e.preventDefault();
          var n = this.posFromEvt(e);
          this.setDragging(!0);
          setupPointerDragHandler(
            e,
            function () {
              return {
                move: function (e) {
                  var i = t.posFromEvt(e);
                  t.panBy(n.x - i.x, n.y - i.y);
                },
                end: function (e) {
                  e.preventDefault();
                },
                cleanup: function () {
                  t.setDragging(!1);
                },
              };
            },
            0,
          );
        }
        if (e.button === 2 || (Platform.isMacOS && e.button === 1 && e.ctrlKey)) {
          e.preventDefault();
          var i = this.posFromEvt(e);
          setupPointerDragHandler(e, function () {
            t.setDragging(!0);
            return {
              move: function (e) {
                var n = t.posFromEvt(e);
                t.panBy(i.x - n.x, i.y - n.y);
              },
              cleanup: function () {
                temporarilyPreventEvent(t.wrapperEl, "contextmenu");
                t.setDragging(!1);
              },
            };
          });
        }
      }
    };
    e.prototype.onPointerdown = function (e) {
      var t = this;
      if (e.pointerType !== "touch") {
        if (e.targetNode === this.wrapperEl && e.pointerType === "mouse" && e.button === 0) {
          var n = e.shiftKey,
            i = new Set(this.selection);
          n || this.deselectAll();
          setupPointerDragHandler(e, function () {
            return t.handleDragToSelect(e, n, i);
          });
        }
      } else this.onTouchdown(e);
    };
    e.prototype.interactionHitTest = function (e) {
      var t = this;
      if (((this.pointer = this.posFromEvt(e)), !this.pointerFrame)) {
        var n = (this.pointerFrameWin = this.canvasEl.win);
        this.pointerFrame = n.requestAnimationFrame(function () {
          if (((t.pointerFrame = 0), (t.pointerFrameWin = null), !t.isDragging)) {
            var e = t,
              n = e.pointer,
              i = e.nodeInteractionLayer,
              r = t.hitTestNode(n, 8 / t.scale);
            t.selection.size > 1 && t.selection.has(r) ? i.setTarget(null) : i.target !== r && i.setTarget(r);
          }
        });
      }
    };
    e.prototype.onPointermove = function (e) {
      if (e.pointerType !== "touch") {
        this.interactionHitTest(e);
      }
    };
    e.prototype.onTouchdown = function (e) {
      var t = this;
      if (e.isPrimary && !e.defaultPrevented && !hasScrollableAncestor(e, this.wrapperEl, !0)) {
        e.preventDefault();
        var n = e.targetNode,
          i = n === this.wrapperEl,
          r = n === this.menu.selection.selectionEl,
          o = e.win,
          a = e,
          s = function (e) {
            return {
              id: e.pointerId,
              x: e.clientX,
              y: e.clientY,
              pos: t.posFromEvt(e),
            };
          },
          l = [s(e)],
          c = false,
          u = {},
          h = null,
          p = null;
        if (!i && !r)
          for (var d = 0, f = Array.from(this.nodes.values()); d < f.length; d++) {
            var m = f[d];
            if (m.nodeEl.contains(n)) {
              p = m;
            }
          }
        var g = false,
          v = o.setTimeout(function () {
            v = 0;
            g = true;
            navigator.vibrate(100);
            Al(o, e.clientX, e.clientY);
          }, 600),
          y = function (e) {
            if (!(e.pointerType !== "touch" || e.isPrimary)) {
              l.push(s(e));
            }
          },
          b = function (e) {
            if (e.pointerType === "touch") {
              var s = l.find(function (t) {
                return t.id === e.pointerId;
              });
              if (s) {
                if (((s.x = e.clientX), (s.y = e.clientY), !c && e.pointerId === a.pointerId && Fl(Ll(a), Ll(e)) > 5)) {
                  if ((v && o.clearTimeout(v), g)) {
                    if (i) {
                      var h = e.shiftKey,
                        d = new Set(t.selection);
                      h || t.deselectAll();
                      u = t.handleDragToSelect(e, h, d);
                    } else r ? (u = t.handleSelectionDrag(e, n)) : p && (u = t.handleSelectionDrag(e, n, p));
                    if (!u) {
                      u = {};
                      return void C();
                    }
                  } else t.setDragging(!0);
                  c = true;
                }
                if ((e.pointerId === a.pointerId && u.move && u.move(e), !g))
                  if (l.length === 1) {
                    var f = l[0],
                      m = t.posFromClient(f);
                    t.panBy(f.pos.x - m.x, f.pos.y - m.y);
                  } else {
                    var y = l[0],
                      b = l[1],
                      w = t.posFromClient(y),
                      k = t.posFromClient(b),
                      E = Pl((y.pos.x + b.pos.x) / 2, (y.pos.y + b.pos.y) / 2),
                      S = Fl(y.pos, b.pos),
                      M = Fl(w, k);
                    if (S > 0 && M > 0) {
                      var x = (t.scale * M) / S,
                        tZoom = Math.log2(x);
                      tZoom = Math.clamp(tZoom, -4, 1);
                      t.zoom = t.tZoom = tZoom;
                      t.scale = Math.pow(2, tZoom);
                      t.markViewportChanged();
                      t.pauseAnimation = Date.now() + 200;
                    }
                    w = t.posFromClient(y);
                    k = t.posFromClient(b);
                    var D = Pl((w.x + k.x) / 2, (w.y + k.y) / 2);
                    t.panBy(E.x - D.x, E.y - D.y);
                    y.pos = t.posFromClient(y);
                    b.pos = t.posFromClient(b);
                  }
              }
            }
          },
          w = function (e) {
            if (e.pointerType === "touch") {
              if (e.pointerId === a.pointerId && !c) {
                i && t.deselectAll();
                return void C();
              }
              var n = l.find(function (t) {
                return t.id === e.pointerId;
              });
              if (n) {
                n.x = e.clientX;
                n.y = e.clientY;
                e.pointerId === a.pointerId && u.end && u.end(e);
                l.remove(n);
                l.length === 0 && C();
              }
            }
          },
          k = function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            h = e;
          },
          C = function () {
            if (
              (o.removeEventListener("pointerdown", y),
              o.removeEventListener("pointermove", b),
              o.removeEventListener("pointerup", w),
              o.removeEventListener("pointercancel", w),
              o.removeEventListener("contextmenu", k, {
                capture: !0,
              }),
              v && o.clearTimeout(v),
              u.cleanup && u.cleanup(),
              t.setDragging(!1),
              !c && (!g && r && t.deselectAll(), g))
            ) {
              var e = h || a;
              e.targetNode.dispatchEvent(new MouseEvent("contextmenu", e));
            }
          };
        o.addEventListener("pointerdown", y);
        o.addEventListener("pointermove", b);
        o.addEventListener("pointerup", w);
        o.addEventListener("pointercancel", w);
        o.addEventListener("contextmenu", k, {
          capture: !0,
        });
      }
    };
    e.prototype.handleDragToSelect = function (e, t, n) {
      var i = this,
        r = this.posFromEvt(e),
        o = new g6(this);
      return this.handleDragWithPan(e, {
        move: function (e) {
          var a = i.posFromEvt(e);
          o.update(_2(r, a));
          var s = {
              minX: Math.min(r.x, a.x),
              minY: Math.min(r.y, a.y),
              maxX: Math.max(r.x, a.x),
              maxY: Math.max(r.y, a.y),
            },
            l = i.getIntersectingNodes(s);
          l = l.filter(function (e) {
            return !(e instanceof p4) || Z2(s, e.getBBox());
          });
          var c = new Set(l);
          if (t) {
            var u = new Set(n);
            c.forEach(function (e) {
              u.has(e) ? u.delete(e) : u.add(e);
            });
            c = u;
          }
          i.selectAll(c);
        },
        end: function (e) {
          if (Keymap.isModifier(e, "Mod")) {
            var t = i.view.plugin.options.defaultModDragBehavior,
              size = G2(o.bbox);
            switch (t) {
              case "card":
                i.createTextNode({
                  pos: size,
                  size: size,
                });
                o.hide();
                break;
              case "note":
                new n6(i, function (filee0) {
                  i.createFileNode({
                    pos: size,
                    size: size,
                    file: filee0,
                  });
                  o.hide();
                })
                  .showAttachments(!1)
                  .open();
                break;
              case "media":
                new n6(i, function (filee0) {
                  i.createFileNode({
                    pos: size,
                    size: size,
                    file: filee0,
                  });
                  o.hide();
                })
                  .showMarkdownAndCanvas(!1)
                  .open();
                break;
              case "webpage":
                new X6(i.app, "", function (e) {
                  i.createLinkNode({
                    pos: size,
                    size: size,
                    url: e,
                  });
                  o.hide();
                }).open();
                break;
              case "group":
                i.createGroupNode({
                  pos: size,
                  size: size,
                });
                o.hide();
                break;
              default:
                var r = new Menu();
                i.showCreationMenu(r, size, size);
                r.onHide(function () {
                  o.hide();
                });
                r.showAtMouseEvent(e);
            }
          } else o.hide();
          temporarilyPreventEvent(i.wrapperEl, "click");
        },
        cancel: function () {
          i.selectAll(n);
          o.hide();
        },
      });
    };
    e.prototype.onDoubleClick = function (e) {
      if (!(e.defaultPrevented || e.targetNode !== this.wrapperEl || this.isDragging || this.readonly)) {
        var t = this.posFromEvt(e);
        this.createTextNode({
          pos: t,
          position: "center",
        });
      }
    };
    e.prototype.onContextMenu = function (e) {
      var t = this;
      if (!e.defaultPrevented && e.targetNode === this.wrapperEl && !this.readonly) {
        e.preventDefault();
        this.deselectAll();
        var n = this.posFromEvt(e),
          i = new Menu();
        this.showCreationMenu(i, n);
        i.addSeparator();
        this.history.canUndo() &&
          i.addItem(function (e) {
            e.setTitle(i18nProxy.setting.mobileToolbar.optionUndo())
              .setSection("history")
              .setIcon("lucide-undo-2")
              .onClick(function () {
                t.undo();
              });
          });
        this.history.canRedo() &&
          i.addItem(function (e) {
            e.setTitle(i18nProxy.setting.mobileToolbar.optionRedo())
              .setSection("history")
              .setIcon("lucide-redo-2")
              .onClick(function () {
                t.redo();
              });
          });
        Platform.isDesktopApp &&
          i.addSeparator().addItem(function (t) {
            t.setTitle(i18nProxy.interface.menu.paste())
              .setSection("clipboard")
              .setIcon("lucide-clipboard-check")
              .onClick(function () {
                e.win.electron.remote.getCurrentWebContents().paste();
              });
          });
        this.showQuickSettingsMenu(i);
        i.showAtMouseEvent(e);
      }
    };
    e.prototype.setReadonly = function (readonly) {
      var t = this.quickSettingsButton;
      if (((this.readonly = readonly), t)) {
        var n = readonly ? "lucide-lock" : "lucide-settings",
          i = readonly ? H6.labelDisableReadonly() : H6.labelCanvasSettings();
        setIcon(t, n);
        setTooltip(t, i, {
          placement: "left",
        });
        this.wrapperEl.toggleClass("mod-readonly", readonly);
        this.menu.render(!0);
      }
    };
    e.prototype.showQuickSettingsMenu = function (e) {
      var t = this,
        n = this.view.plugin,
        i = n.options;
      e.addItem(function (e) {
        return e
          .setSection("canvas")
          .setTitle(H6.optionSnapToGrid())
          .setIcon("lucide-grid")
          .setChecked(!!i.snapToGrid)
          .onClick(function () {
            i.snapToGrid = !i.snapToGrid;
            n.saveOptions();
          });
      })
        .addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle(H6.optionSnapToObjects())
            .setIcon("snap-to-object")
            .setChecked(!!i.snapToObjects)
            .onClick(function () {
              i.snapToObjects = !i.snapToObjects;
              n.saveOptions();
            });
        })
        .addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle(H6.labelReadonly())
            .setIcon("lucide-lock")
            .setChecked(t.readonly)
            .onClick(function () {
              t.setReadonly(!t.readonly);
              t.view.saveLocalData();
            });
        });
    };
    e.prototype.showCreationMenu = function (e, t, size) {
      var i = this;
      e.addItem(function (e) {
        e.setTitle(H6.actionAddCard())
          .setSection("create")
          .setIcon("lucide-sticky-note")
          .onClick(function () {
            i.createTextNode({
              pos: t,
              size: size,
            });
          });
      })
        .addItem(function (e) {
          e.setTitle(H6.actionAddNote())
            .setSection("create")
            .setIcon("lucide-file-text")
            .onClick(function () {
              new n6(i, function (filee0) {
                i.createFileNode({
                  pos: t,
                  size: size,
                  file: filee0,
                });
              })
                .showAttachments(!1)
                .open();
            });
        })
        .addItem(function (e) {
          e.setTitle(H6.actionAddMedia())
            .setSection("create")
            .setIcon("lucide-file-image")
            .onClick(function () {
              new i6(i, function (filee0) {
                i.createFileNode({
                  pos: t,
                  size: size,
                  file: filee0,
                });
              }).open();
            });
        })
        .addItem(function (e) {
          e.setTitle(H6.actionAddWebsite())
            .setSection("create")
            .setIcon("lucide-external-link")
            .onClick(function () {
              new X6(i.app, "", function (e) {
                i.createLinkNode({
                  pos: t,
                  size: size,
                  url: e,
                });
              }).open();
            });
        })
        .addItem(function (e) {
          e.setTitle(H6.actionCreateGroup())
            .setSection("create")
            .setIcon("create-group")
            .onClick(function () {
              i.createGroupNode({
                pos: t,
                size: size,
              });
            });
        });
    };
    e.prototype.smartZoom = function (e) {
      var t = this.posFromEvt(e),
        n = U2(t.x, t.y, t.x, t.y);
      if (this.selection.size > 0 && Z2(this.menu.selection.bbox, n)) return void this.zoomToSelection();
      var i = this.getIntersectingNodes(n);
      if (i.length > 0) {
        i.sort(function (e, t) {
          return e.width * e.height - t.width * t.height;
        });
        var r = i[0].bbox;
        this.zoomToBbox(r);
      } else this.zoomToFit();
    };
    e.prototype.onWheel = function (e) {
      if (!this.isDragging && !e.defaultPrevented) {
        var t = this.wrapperEl,
          n = this.options.defaultWheelBehavior,
          i = e.ctrlKey || e.metaKey,
          r = i || this.isHoldingSpace,
          o = Math.abs(e.wheelDeltaY) === 240 && e.wheelDeltaX === 0;
        if ((n !== "zoom" || o || (r = !r), Platform.isMacOS && e.ctrlKey && e.deltaX === 0 && e.deltaY === 0))
          this.smartZoom(e);
        else if (i || !hasScrollableAncestor(e, t)) {
          e.preventDefault();
          var a = e.deltaX,
            s = e.deltaY,
            l = e.deltaMode;
          l && (l === e.DOM_DELTA_LINE ? ((a *= 40), (s *= 40)) : l === e.DOM_DELTA_PAGE && ((a *= 800), (s *= 800)));
          r
            ? (this.zoomBy(-s / 300, s < 0 ? this.domPosFromEvt(e) : undefined),
              (this.pauseAnimation = Date.now() + 200))
            : e.shiftKey && a === 0
              ? ((this.tx += (s / this.scale) * U6), this.markViewportChanged())
              : ((this.tx += (a / this.scale) * U6), (this.ty += (s / this.scale) * U6), this.markViewportChanged());
          var c = e.wheelDeltaX,
            u = e.wheelDeltaY;
          if (
            !(
              (a === 0 && Number.isInteger(u) && Math.abs(u) === 120 && u !== -3 * e.deltaY) ||
              (s === 0 && Number.isInteger(c) && Math.abs(c) === 120 && c !== -3 * e.deltaX)
            )
          ) {
            this.finishViewportAnimation = true;
          }
        }
      }
    };
    e.prototype.handleMoverPointerdown = function (e) {
      var t = this;
      if (e.isPrimary && e.button === 0) {
        var n = this.posFromEvt(e);
        setupPointerDragHandler(e, function () {
          return {
            move: function (e) {
              var i = t.posFromEvt(e);
              t.panBy(n.x - i.x, n.y - i.y);
            },
          };
        });
      }
    };
    e.prototype.onSelectionContextMenu = function (e) {
      var t = this;
      if (!e.defaultPrevented) {
        var n = Menu.forEvent(e);
        n.addSections(["title", "open", "selection", "clipboard", "action", "view", "info", "", "danger"]);
        this.readonly ||
          n.addItem(function (e) {
            e.setTitle(z6.deleteActionShortName())
              .setSection("danger")
              .setIcon("lucide-trash-2")
              .onClick(function () {
                t.deleteSelection();
              });
          });
        n.addItem(function (e) {
          e.setTitle(H6.actionZoomToSelection())
            .setSection("selection")
            .setIcon("zoom-to-selection")
            .onClick(function () {
              t.zoomToSelection();
            });
        });
        this.readonly ||
          n.addItem(function (e) {
            e.setTitle(H6.actionCreateGroup())
              .setSection("selection")
              .setIcon("create-group")
              .onClick(function () {
                var size = G2(
                  Y2(
                    K2(
                      Array.from(t.selection.values()).map(function (e) {
                        return e.getBBox();
                      }),
                    ),
                    20,
                  ),
                );
                t.createGroupNode({
                  pos: size,
                  size: size,
                });
              });
          });
        !this.readonly &&
          Platform.isDesktopApp &&
          n
            .addItem(function (t) {
              t.setTitle(i18nProxy.interface.menu.cut())
                .setIcon("lucide-scissors")
                .setSection("clipboard")
                .onClick(function () {
                  e.win.electron.remote.getCurrentWebContents().cut();
                });
            })
            .addItem(function (t) {
              t.setTitle(i18nProxy.interface.menu.copy())
                .setIcon("lucide-copy")
                .setSection("clipboard")
                .onClick(function () {
                  e.win.electron.remote.getCurrentWebContents().copy();
                });
            })
            .addItem(function (t) {
              t.setTitle(i18nProxy.interface.menu.paste())
                .setIcon("lucide-clipboard-check")
                .setSection("clipboard")
                .onClick(function () {
                  e.win.electron.remote.getCurrentWebContents().paste();
                });
            });
        this.app.workspace.trigger("canvas:selection-menu", n, this);
        var i = Array.from(this.selection)
          .filter(function (e) {
            return e instanceof a4;
          })
          .map(function (e) {
            return e.file;
          });
        if (i.length > 1) {
          this.app.workspace.trigger("files-menu", n, i, "canvas:selection-menu", null);
        }
      }
    };
    e.prototype.canSnap = function (e) {
      return Platform.isMacOS ? !e.ctrlKey : !e.altKey;
    };
    e.prototype.dragTempNode = function (e, t, n) {
      var i = this;
      if (e.isPrimary && e.button === 0) {
        e.preventDefault();
        setupPointerDragHandler(e, function () {
          var r = new i4(i);
          r.resize(t);
          r.attach();
          r.nodeEl.addClass("is-dragging");
          return i.handleDragWithPan(e, {
            move: function (e) {
              i.clearSnapPoints();
              var n = i.posFromEvt(e),
                o = __assign(__assign({}, Q2(n, t)), t);
              if (i.canSnap(e)) {
                var a = [o].map(j2),
                  s = i
                    .getViewportNodes()
                    .filter(function (e) {
                      return !(e instanceof p4);
                    })
                    .map(j2),
                  l = i.getSnapping(a, s, !0, !0);
                o.x += l.x;
                o.y += l.y;
              }
              r.moveTo(o);
              r.render();
            },
            end: function (e) {
              i.posInViewport(i.domPosFromEvt(e)) && n(Pl(r.x, r.y));
            },
            cleanup: function () {
              r.detach();
            },
          });
        });
      }
    };
    e.prototype.handleDragWithPan = function (e, t) {
      var n = this,
        i = this.wrapperEl.getBoundingClientRect();
      this.setDragging(!0);
      var r = e.win,
        o = 0,
        a = 0,
        s = 0;
      return __assign(__assign({}, t), {
        move: function (e) {
          var l,
            c = e.clientX,
            u = e.clientY,
            h = Y2(j2(i), -30);
          o = 0;
          a = 0;
          c < h.minX && (o = c - h.minX);
          c > h.maxX && (o = c - h.maxX);
          u < h.minY && (a = u - h.minY);
          u > h.maxY && (a = u - h.maxY);
          o !== 0 || a !== 0
            ? ((o = Math.clamp(o, -40, 40)),
              (a = Math.clamp(a, -40, 40)),
              s ||
                (s = r.setInterval(function () {
                  var e = 0.5 / Math.sqrt(n.scale);
                  n.panBy(o * e, a * e);
                }, 1e3 / 60)))
            : s && (r.clearInterval(s), (s = 0));
          (l = t.move) === null || undefined === l || l.call(t, e);
        },
        cleanup: function () {
          var e;
          s && (r.clearInterval(s), (s = 0));
          n.endSnapPointRendering();
          n.setDragging(!1);
          (e = t.cleanup) === null || undefined === e || e.call(t);
        },
      });
    };
    e.prototype.handleSelectionDrag = function (e, t, n) {
      var i = this;
      if (!this.readonly) {
        var r = this.posFromEvt(e);
        if (n && !this.selection.has(n)) {
          this.selectOnly(n);
        }
        var o = new Set();
        this.selection.forEach(function (e) {
          if (e instanceof t4 && (o.add(e), e instanceof p4))
            for (var t = 0, n = i.getContainingNodes(e.getBBox()); t < n.length; t++) {
              var r = n[t];
              o.add(r);
            }
        });
        for (var a = Array.from(o), s = new WeakMap(), l = 0, c = a; l < c.length; l++) {
          var u = c[l];
          s.set(u, Pl(u.x, u.y));
          u.nodeEl.addClass("is-dragging");
          u.updateZIndex();
        }
        var h = a,
          p = null,
          d = function (e) {
            var t = Platform.isMacOS ? e.altKey : e.ctrlKey;
            if (t && !p) {
              h = p = [];
              for (var n = 0, r = a; n < r.length; n++) {
                var o = r[n],
                  l = s.get(o),
                  c = new i4(i);
                p.push(c);
                s.set(c, l);
                c.x = o.x;
                c.y = o.y;
                c.width = o.width;
                c.height = o.height;
                c.attach();
                c.render();
                c.nodeEl.addClass("is-dragging");
                o.moveTo(l);
              }
            } else if (!t && p) {
              for (var u = 0; u < a.length; u++) {
                c = p[u];
                a[u].moveTo(c);
                c.detach();
              }
              p = null;
              h = a;
            }
          },
          f = function (e, t) {
            var n = s.get(e);
            return {
              x: n.x + t.x,
              y: n.y + t.y,
              width: e.width,
              height: e.height,
            };
          },
          m = function (e) {
            var t,
              n,
              o,
              a = i.posFromEvt(e),
              s =
                ((n = r),
                {
                  x: (t = a).x - n.x,
                  y: t.y - n.y,
                });
            if ((e.shiftKey && (Math.abs(s.x) > Math.abs(s.y) ? (s.y = 0) : (s.x = 0)), !i.canSnap(e))) return s;
            var l = h.filter(function (e) {
              return e instanceof p4;
            });
            if (l.length === 0) o = h;
            else if (l.length === 1) o = l;
            else if (l.length > 1) {
              o = l.slice();
              for (
                var c = function (e) {
                    var t = e.getBBox();
                    if (
                      l.some(function (n) {
                        return (
                          n !== e &&
                          Z2(n.getBBox(), t) &&
                          ((i = n.getBBox()),
                          (r = t),
                          !(i.maxX === r.maxX && i.maxY === r.maxY && i.minX === r.minX && i.minY === r.minY))
                        );
                        var i, r;
                      })
                    ) {
                      o.remove(e);
                    }
                  },
                  u = 0,
                  p = l;
                u < p.length;
                u++
              ) {
                c(p[u]);
              }
            }
            var d = new Set(h),
              m = o
                .map(function (e) {
                  return f(e, s);
                })
                .map(j2),
              g = i
                .getViewportNodes()
                .filter(function (e) {
                  return !d.has(e) && l.length > 0 == e instanceof p4;
                })
                .map(j2),
              v = i.getSnapping(m, g, s.x !== 0, s.y !== 0);
            return (function (e, t) {
              return {
                x: e.x + t.x,
                y: e.y + t.y,
              };
            })(s, v);
          };
        return this.handleDragWithPan(e, {
          move: function (e) {
            i.clearSnapPoints();
            d(e);
            for (var t = m(e), n = 0, r = h; n < r.length; n++) {
              var o = r[n];
              o.moveTo(f(o, t));
            }
          },
          end: function (e) {
            for (var t = 0, n = a; t < n.length; t++) {
              n[t].nodeEl.removeClass("is-dragging");
            }
            if (p) {
              var r = m(e),
                s = i.getSelectionData(o),
                l = i.cloneData(s, r),
                c = i.importData(l, !1);
              i.clearSnapPoints();
              i.selectAll(c);
            }
            i.setDragging(!1);
            i.requestSave();
          },
          cancel: function () {
            for (var e = 0, t = a; e < t.length; e++) {
              var n = t[e];
              n.moveTo(s.get(n));
              n.nodeEl.removeClass("is-dragging");
            }
          },
          cleanup: function () {
            if (p)
              for (var e = 0, n = p; e < n.length; e++) {
                n[e].detach();
              }
            if (t) {
              temporarilyPreventEvent(t, "click");
            }
          },
          keydown: function (e) {
            d(e);
          },
          keyup: function (e) {
            d(e);
          },
        });
      }
    };
    e.prototype.takeScreenshot = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v;
        return __generator(this, function (y) {
          switch (y.label) {
            case 0:
              n = this.wrapperEl;
              y.label = 1;
            case 1:
              y.trys.push([1, , 6, 7]);
              n.addClass("is-screenshotting");
              t && n.addClass("is-text-garbled");
              this.deselectAll();
              this.app.statusBar.containerEl.hide();
              return [4, sleep(10)];
            case 2:
              y.sent();
              return [4, nextFrame()];
            case 3:
              y.sent();
              i = K2(Array.from(this.nodes.values()).map(j2));
              r = this.domFromPos(Pl(i.minX, i.minY));
              o = r.x;
              a = r.y;
              s = this.domFromPos(Pl(i.maxX, i.maxY));
              l = s.x;
              c = s.y;
              u = this.canvasRect;
              h = u.cx;
              p = u.cy;
              o += h;
              a += p;
              l += h;
              c += p;
              o -= 10;
              a -= 10;
              l += 10;
              c += 10;
              d = n.getBoundingClientRect();
              o < d.x && (o = d.x);
              a < d.y && (a = d.y);
              l > d.right && (l = d.right);
              c > d.bottom && (c = d.bottom);
              f = Il(Math.round(o), Math.round(a), Math.round(l - o), Math.round(c - a));
              m = n.win.electron.remote;
              return [4, m.getCurrentWebContents().capturePage(f)];
            case 4:
              g = y.sent();
              v = cu(g.toPNG());
              return [4, window.require("original-fs").promises.writeFile(e, v)];
            case 5:
              y.sent();
              new Notice(e, 1e4).addButton(
                Platform.isMacOS
                  ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac()
                  : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(),
                function () {
                  return showItemInFolderSetup(e);
                },
              );
              return [3, 7];
            case 6:
              this.app.statusBar.containerEl.show();
              n.removeClass("is-screenshotting");
              n.removeClass("is-text-garbled");
              return [7];
            case 7:
              return [2];
          }
        });
      });
    };
    e.prototype.generateHDImage = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          r,
          o,
          a,
          s,
          l,
          c,
          u,
          h,
          p,
          d,
          f,
          m,
          g,
          v,
          w,
          k,
          C,
          E,
          src,
          M,
          x,
          T,
          D,
          A,
          P,
          L,
          I,
          O,
          F,
          N,
          R,
          B,
          V,
          H,
          z,
          q,
          W,
          U,
          _,
          j,
          G,
          K,
          Y,
          Z,
          X,
          Q,
          $,
          J = this;
        return __generator(this, function (ee) {
          switch (ee.label) {
            case 0:
              e = this.wrapperEl;
              return this.nodes.size === 0
                ? (new Notice(H6.msgExportFailedEmptyCanvas()), [2])
                : ((t = e.win),
                  (n = e.doc),
                  (i = t.electron.remote),
                  (r = i.getCurrentWebContents()),
                  (o = Math.pow(1.2, r.getZoomLevel())),
                  (a = t.devicePixelRatio),
                  (s = Math.round((a / o) * 1e5) / 1e5),
                  (l = Y2(K2(Array.from(this.nodes.values()).map(j2)), 100)),
                  (c = l.maxX - l.minX),
                  (u = l.maxY - l.minY),
                  (h = Math.min(2, 16284 / s / c, 16284 / s / u)),
                  (p = ""),
                  (d = Math.min(1, h)),
                  (f = Math.log2(d)),
                  (m = Math.log2(h)),
                  (g = true),
                  (v = false),
                  (w = "full"),
                  [
                    4,
                    new Promise(function (e) {
                      var t = new Modal(J.app);
                      t.setTitle(H6.actionExportPng());
                      t.modalEl.addClass("mod-narrow");
                      var n,
                        i,
                        r = t.contentEl;
                      r.createEl("p", {
                        cls: "u-muted",
                        text: H6.labelExportPngDesc({
                          title: J.view.file.basename,
                        }),
                      });
                      new Setting(r)
                        .setName(H6.optionExportPngFrame())
                        .setDesc(H6.optionExportPngFrameDesc())
                        .addDropdown(function (e) {
                          return e
                            .addOption("full", H6.optionExportPngFrameFull())
                            .addOption("viewport", H6.optionExportPngFrameViewport())
                            .setValue(w)
                            .onChange(function (e) {
                              var t = (w = e) === "full";
                              n.setVisibility(t);
                              i.setVisibility(t);
                            });
                        });
                      var o = function () {
                        return n.setDesc(
                          H6.labelExportPngDimensions({
                            dimensions: ""
                              .concat(Math.ceil(c * d * s).toLocaleString(), "px x ")
                              .concat(Math.ceil(u * d * s).toLocaleString(), "px"),
                          }),
                        );
                      };
                      n = new Setting(r)
                        .setName(H6.optionExportPngZoom())
                        .setDesc(H6.optionExportPngZoomDesc())
                        .addSlider(function (e) {
                          return (e
                            .setLimits(Math.min(-1, m), m, "any")
                            .setValue(f)
                            .setDynamicTooltip()
                            .onChange(function (e) {
                              f = e;
                              d = Math.pow(2, e);
                              o();
                            }).getValuePretty = function () {
                            return Math.pow(2, e.getValue()).toFixed(2);
                          });
                        });
                      o();
                      i = new Setting(r)
                        .setName(H6.optionExportPngShowLogo())
                        .setDesc(H6.optionExportPngShowLogoDesc())
                        .addToggle(function (e) {
                          return e.setValue(g).onChange(function (e) {
                            return (g = e);
                          });
                        });
                      new Setting(r)
                        .setName(H6.optionExportPngPrivacyMode())
                        .setDesc(H6.optionExportPngPrivacyModeDesc())
                        .addToggle(function (e) {
                          return e.setValue(v).onChange(function (e) {
                            return (v = e);
                          });
                        });
                      r.createDiv("modal-button-container", function (n) {
                        n.createEl("button", {
                          cls: "mod-cta",
                          text: i18nProxy.dialogue.buttonSave(),
                        }).addEventListener("click", function () {
                          return __awaiter(J, undefined, undefined, function () {
                            return __generator(this, function (n) {
                              t.close();
                              e();
                              return [2];
                            });
                          });
                        });
                      });
                      t.open();
                    }),
                  ]);
            case 1:
              ee.sent();
              return [
                4,
                i.dialog.showSaveDialog({
                  defaultPath: this.view.file.basename + ".png",
                  filters: [
                    {
                      name: "PNG Files",
                      extensions: ["png"],
                    },
                    {
                      name: "All Files",
                      extensions: ["*"],
                    },
                  ],
                  properties: ["showOverwriteConfirmation"],
                }),
              ];
            case 2:
              return (k = ee.sent()).canceled || !k.filePath
                ? [2]
                : (p = k.filePath)
                  ? w !== "viewport"
                    ? [3, 4]
                    : [4, this.takeScreenshot(p, v)]
                  : [2];
            case 3:
              ee.sent();
              return [2];
            case 4:
              this.deselectAll();
              C = n.body;
              e.addClass("is-screenshotting");
              v && e.addClass("is-text-garbled");
              this.screenshotting = true;
              C.appendChild(e);
              src = "";
              ee.label = 5;
            case 5:
              ee.trys.push([5, , 16, 18]);
              g &&
                ((l.maxY += 80),
                (u += 80),
                (E = this.canvasEl.createDiv("canvas-watermark")).setCssStyles({
                  position: "absolute",
                  left: l.minX + 80 + "px",
                  top: l.maxY - 80 + "px",
                  transform: "translate(0, -100%) scale(".concat(4 / d, ")"),
                  transformOrigin: "bottom left",
                  display: "flex",
                  whiteSpace: "pre",
                  alignItems: "center",
                  gap: "3px",
                  zIndex: "9999999",
                }),
                E.appendChild(
                  (function (e) {
                    var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    t.setAttrs({
                      viewBox: "0 0 143 25",
                      width: String(e),
                      fill: "currentColor",
                    });
                    t.innerHTML =
                      '<path d="M7 14.6a12 12 0 0 1 2.8-.6 10 10 0 0 1 .5-8.8l.4-.7a32.9 32.9 0 0 0 .9-2.3v-1c-.1-.4-.3-.7-.7-1.1-.6-.2-1.1 0-1.6.3L4.2 5.1c-.3.2-.5.6-.6 1l-.4 3a14.6 14.6 0 0 1 3.7 5.5Zm-4-4.2-.1.3-2.8 6c-.2.7-.1 1.4.4 1.9L4.8 23a8.7 8.7 0 0 0 .8-8.7c-.7-1.8-1.9-3.2-2.6-4Z"/><path d="M5.8 23.5H6a23.8 23.8 0 0 1 7.4 1.4c1.2.4 2.3-.5 2.5-1.7a7 7 0 0 1 .8-2.7c-.8-2-1.6-3.2-2.6-4a5 5 0 0 0-2.9-1.3c-1.6-.2-3 .2-4 .5.6 2.3.4 5-1.4 7.8Z"/><path d="m17.4 19.3 2-3c0-.4 0-.7-.2-1a18 18 0 0 1-2-3.5c-.7-1.4-.7-3.5-.8-4.6 0-.4 0-.7-.3-1l-3.4-4.3v.6L12 4l-.5 1-.3.6A11 11 0 0 0 10 9.4c0 1.3 0 2.8.9 4.7h.4c1.1.2 2.3.6 3.5 1.6 1 .8 1.8 2 2.5 3.6ZM39.8 4.5c-6 0-10.3 3.7-10.3 8.9 0 5.1 4.3 8.9 10.3 8.9 5.9 0 10.2-3.8 10.2-9 0-5-4.3-8.8-10.2-8.8Zm0 3.5c3.5 0 6.1 2.1 6.1 5.4 0 3.2-2.6 5.4-6.1 5.4-3.6 0-6.2-2.2-6.2-5.4 0-3.3 2.6-5.4 6.2-5.4Zm15.7 12.6c.8.9 2.5 1.7 4.6 1.7 4.3 0 6.8-3 6.8-6.6C67 12 64.4 9 60.1 9c-2.1 0-3.8.8-4.6 1.7v-6h-3.9V22h3.9v-1.4Zm-.1-5c0-2 1.7-3.4 3.9-3.4 2 0 3.9 1.2 3.9 3.5 0 2.2-1.8 3.5-4 3.5-2.1 0-3.8-1.4-3.8-3.4v-.2ZM67.3 20a11 11 0 0 0 7.2 2.3c4 0 7-1.5 7-4.4 0-3-2.9-3.5-6.1-3.8-2.8-.4-3.6-.4-3.6-1.1 0-.7.9-1 2.5-1 2 0 3.7.5 4.8 1.6l2-2.3A9.7 9.7 0 0 0 74.5 9c-4 0-6.5 1.7-6.5 4.3 0 2.7 2.5 3.3 5.6 3.7 2.8.3 4 .3 4 1.2 0 .8-1 1.1-2.8 1.1-2.2 0-4.1-.7-5.7-2l-1.8 2.5ZM82.8 8h4V4.9h-4V8Zm3.9 1.4h-3.8V22h3.8V9.4Zm13.1 11.2V22h3.9V4.8h-3.9v6C99 9.8 97.4 9 95.2 9c-4.3 0-6.8 3-6.8 6.6 0 3.6 2.5 6.6 6.8 6.6 2.2 0 3.8-.8 4.6-1.7Zm.1-5v.2c0 2-1.7 3.4-3.9 3.4-2 0-3.9-1.3-3.9-3.5 0-2.3 1.8-3.5 4-3.5 2.1 0 3.8 1.4 3.8 3.4ZM106 8h4V4.9h-4V8Zm3.9 1.4H106V22h3.9V9.4Zm7 12.9a8 8 0 0 0 5.2-1.7c.6 1.2 2.2 2 5 1.4v-2.8c-1.4.3-1.7 0-1.7-.7v-4.6c0-3.2-2.3-4.8-6.4-4.8-3.5 0-6.2 1.5-7 3.8l3.4 1c.4-1 1.7-1.8 3.5-1.8 2 0 2.8.8 2.8 1.7v.1l-5 .5c-3 .3-5.2 1.5-5.2 4 0 2.4 2.2 3.9 5.4 3.9Zm4.8-5.1c0 1.4-2.2 2.3-4.1 2.3-1.5 0-2.4-.5-2.4-1.3s.7-1.1 2-1.3l4.5-.4v.7Zm6.7 4.8h3.8v-6c0-2.2 1.2-3.5 3.3-3.5 2 0 3 1.3 3 3.4V22h3.8v-7.2c0-3.5-2.2-5.7-5.5-5.7-2 0-3.6.8-4.6 1.8V9.4h-3.8V22Z"/>';
                    return t;
                  })(100),
                ));
              x = 5 / o;
              e.setCssStyles({
                top: "".concat(x, "px"),
                left: "".concat(x, "px"),
                bottom: "".concat(x, "px"),
                right: "".concat(x, "px"),
                width: "auto",
                height: "auto",
              });
              M = window.open(
                "about:blank",
                "_blank",
                "popup,x="
                  .concat(t.screenX + 5, ",y=")
                  .concat(t.screenY + 5, ",width=")
                  .concat(t.outerWidth - 10, ",height=")
                  .concat(t.outerHeight - 10),
              );
              T = createEl("base", {
                href: location.href,
              });
              M.document.head.appendChild(T);
              M.document.title = "Obsidian";
              MK(M);
              EK(M, [T])();
              (D = new nJ(M.document)).show();
              D.setMessage("Rendering tiles...");
              A = false;
              D.el.createEl(
                "button",
                {
                  cls: "mod-cta",
                  text: i18nProxy.dialogue.buttonStop(),
                },
                function (e) {
                  e.style.marginTop = "20px";
                  e.onClickEvent(function () {
                    A = true;
                  });
                },
              );
              this.onResize();
              P = e.getBoundingClientRect();
              L = Math.ceil(P.x * o + 1);
              I = Math.ceil(P.y * o + 1);
              O = Math.floor(P.width * o) - 2;
              F = Math.floor(P.height * o) - 2;
              this.zoom = this.tZoom = Math.log2(d / o);
              N = Il(L, I, O, F);
              R = O / d;
              B = F / d;
              V = Math.ceil((l.maxX - l.minX) / R);
              H = Math.ceil((l.maxY - l.minY) / B);
              z = l.minX + R / 2;
              q = l.minY + B / 2;
              (W = n.createElement("canvas")).width = Math.ceil(c * d * s);
              W.height = Math.ceil(u * d * s);
              U = W.getContext("2d");
              this.viewportChanged = true;
              this.requestFrame();
              return [4, sleep(500)];
            case 6:
              ee.sent();
              _ = V * H;
              j = 0;
              G = 0;
              ee.label = 7;
            case 7:
              if (!(G < H)) return [3, 12];
              K = function (e) {
                var i, o, a, l;
                return __generator(this, function (c) {
                  switch (c.label) {
                    case 0:
                      return A
                        ? [
                            2,
                            {
                              value: undefined,
                            },
                          ]
                        : ((Y.x = Y.tx = z + e * R),
                          (Y.y = Y.ty = q + G * B),
                          (Y.viewportChanged = true),
                          Y.requestFrame(),
                          [4, sleep(100)]);
                    case 1:
                      c.sent();
                      return [4, t.nextFrame()];
                    case 2:
                      c.sent();
                      return t.requestIdleCallback
                        ? [
                            4,
                            new Promise(function (e) {
                              return t.requestIdleCallback(e);
                            }),
                          ]
                        : [3, 4];
                    case 3:
                      c.sent();
                      c.label = 4;
                    case 4:
                      return [4, r.capturePage(N)];
                    case 5:
                      i = c.sent();
                      o = lu(i.toPNG());
                      a = new Blob([o], {
                        type: "image/png",
                      });
                      src = URL.createObjectURL(a);
                      (l = n.createElement("img")).src = src;
                      return [
                        4,
                        new Promise(function (e, t) {
                          l.addEventListener("load", e);
                          l.addEventListener("error", t);
                        }),
                      ];
                    case 6:
                      c.sent();
                      U.drawImage(l, e * O * s, G * F * s);
                      URL.revokeObjectURL(src);
                      src = "";
                      j++;
                      D.setProgress(j, _);
                      D.setMessage("Rendering tiles... (".concat(j, "/").concat(_, ")"));
                      return [2];
                  }
                });
              };
              Y = this;
              Z = 0;
              ee.label = 8;
            case 8:
              return Z < V ? [5, K(Z)] : [3, 11];
            case 9:
              if (typeof (X = ee.sent()) == "object") return [2, X.value];
              ee.label = 10;
            case 10:
              Z++;
              return [3, 8];
            case 11:
              G++;
              return [3, 7];
            case 12:
              D.setMessage("Generating final image");
              return [4, canvasToBlob(W, "image/png")];
            case 13:
              return [4, ee.sent().arrayBuffer()];
            case 14:
              Q = ee.sent();
              $ = cu(Q);
              return [4, window.require("original-fs").promises.writeFile(p, $)];
            case 15:
              ee.sent();
              new Notice(p, 1e4).addButton(
                Platform.isMacOS
                  ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac()
                  : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(),
                function () {
                  return showItemInFolderSetup(p);
                },
              );
              return [3, 18];
            case 16:
              this.view.contentEl.appendChild(e);
              E && E.detach();
              e.removeClass("is-screenshotting");
              e.removeClass("is-text-garbled");
              e.setCssStyles({
                top: "",
                left: "",
                bottom: "",
                right: "",
                width: "",
                height: "",
              });
              this.screenshotting = false;
              M && M.close();
              src && URL.revokeObjectURL(src);
              return [4, t.nextFrame()];
            case 17:
              ee.sent();
              this.zoomToFitQueued = true;
              this.onResize();
              return [7];
            case 18:
              return [2];
          }
        });
      });
    };
    return e;
  })();
function Z6(e, t) {
  return e.zIndex - t.zIndex;
}