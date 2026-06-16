var X6 = (function (e) {
    function t(t, n, onSave) {
      var r = e.call(this, t, n) || this;
      r.title = H6.labelEnterUrl();
      r.onSave = onSave;
      return r;
    }
    __extends(t, e);
    t.prototype.validate = function (t) {
      e.prototype.validate.call(this, t);
      try {
        new URL(t);
      } catch (e) {
        return void this.displayError("Invalid URL", !1);
      }
    };
    t.prototype.submit = function (e) {
      try {
        new URL(e);
      } catch (e) {
        return void this.displayError("Invalid URL", !1);
      }
      this.close();
      this.onSave(e);
    };
    return t;
  })(XM),
  Q6 = i18nProxy.interface,
  $6 = i18nProxy.plugins.canvas,
  J6 = (function (e) {
    function t(t, filen0, mode, r) {
      var o = e.call(this, t) || this;
      o.fileSuggestions = null;
      o.mode = "heading";
      o.runnable = null;
      o.emptyStateText = i18nProxy.plugins.canvas.labelNoSectionFound();
      o.file = filen0;
      o.cb = r;
      o.mode = mode;
      o.setInstructions([
        {
          command: "↑↓",
          purpose: i18nProxy.plugins.templates.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: o.mode === "block" ? $6.instructionNarrowBlock() : $6.instructionNarrowHeading(),
        },
        {
          command: "esc",
          purpose: i18nProxy.plugins.templates.instructionDismiss(),
        },
      ]);
      o.setPlaceholder($6.promptToNarrow());
      return o;
    }
    __extends(t, e);
    t.prototype.onChooseSuggestion = function (e, t) {
      this.cb(e);
    };
    t.prototype.getSuggestions = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e = e.trim();
              return [4, this.getSuggestionsAsync(e)];
            case 1:
              return (t = n.sent())
                ? (t.sort(eT),
                  e ||
                    t.unshift({
                      alias: $6.labelNoNarrow(),
                      type: "alias",
                      file: this.file,
                      matches: null,
                      path: this.file.path,
                      score: 0,
                    }),
                  [2, t])
                : [2, null];
          }
        });
      });
    };
    t.prototype.getSuggestionsAsync = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          n = (t = this).mode;
          (i = t.runnable) && i.cancel();
          i = this.runnable = new ax();
          return n === "block"
            ? [2, this.getBlockSuggestions(i, e)]
            : n === "heading"
              ? ((r = e).startsWith("#") || (r = "#" + r), [2, this.getHeadingSuggestions(i, r)])
              : [2, []];
        });
      });
    };
    t.prototype.getHeadingSuggestions = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          i = (n = this).app.metadataCache;
          r = n.file;
          o = i.getFileCache(r);
          return [2, iT(e, this.file, o.headings, r.path, t)];
        });
      });
    };
    t.prototype.getBlockSuggestions = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, this.app.metadataCache.blockCache.getForFile(e, this.file)];
            case 1:
              n = i.sent();
              return [2, rT(e, this.file, this.file.path, n, t)];
          }
        });
      });
    };
    t.prototype.renderSuggestion = function (e, t) {
      oT(e, t);
    };
    t.prototype.close = function () {
      e.prototype.close.call(this);
      this.fileSuggestions = null;
    };
    return t;
  })(SuggestModal),
  e4 = (function () {
    function e(canvas) {
      var t = this;
      this.canvas = canvas;
      for (
        var n = (this.interactionEl = createDiv("canvas-node-interaction-layer")),
          i = function (dataSide) {
            var i = createDiv({
              cls: "canvas-node-resizer",
              attr: {
                "data-resize": dataSide,
              },
            });
            i.addEventListener("pointerdown", function (n) {
              var r;
              if (n.targetNode === i && n.pointerType === "mouse") {
                (r = t.target) === null || undefined === r || r.onResizePointerdown(n, dataSide);
              }
            });
            i.addEventListener("click", function (e) {
              var n;
              return (n = t.target) === null || undefined === n ? undefined : n.onClick(e);
            });
            (dataSide !== "bottom" && dataSide !== "right") ||
              i.addEventListener("dblclick", function (n) {
                var i;
                return (i = t.target) === null || undefined === i ? undefined : i.onResizeDblclick(n, dataSide);
              });
            i.createDiv({
              cls: "canvas-node-connection-point",
              attr: {
                "data-side": dataSide,
              },
            }).addEventListener("pointerdown", function (n) {
              var i;
              return (i = t.target) === null || undefined === i ? undefined : i.onConnectionPointerdown(n, dataSide);
            });
            n.append(i);
          },
          r = 0,
          o = ["top", "right", "bottom", "left"];
        r < o.length;
        r++
      ) {
        i(o[r]);
      }
      for (
        var a = function (dataResize) {
            var i = createDiv({
              cls: "canvas-node-resizer",
              attr: {
                "data-resize": dataResize,
              },
            });
            i.addEventListener("pointerdown", function (n) {
              var i;
              return (i = t.target) === null || undefined === i ? undefined : i.onResizePointerdown(n, dataResize);
            });
            i.addEventListener("click", function (e) {
              var n;
              return (n = t.target) === null || undefined === n ? undefined : n.onClick(e);
            });
            n.append(i);
          },
          s = 0,
          l = ["topright", "bottomright", "bottomleft", "topleft"];
        s < l.length;
        s++
      ) {
        a(l[s]);
      }
    }
    e.prototype.setTarget = function (target) {
      if (this.target !== target) {
        this.target = target;
        this.render();
      }
    };
    e.prototype.render = function () {
      var e = this,
        t = e.canvas,
        n = e.target,
        i = e.interactionEl;
      if ((n ? i.parentNode || t.canvasEl.appendChild(i) : i.parentNode && i.detach(), n)) {
        var r = n.x,
          o = n.y,
          a = n.width,
          s = n.height;
        this.interactionEl.setCssStyles({
          transform: "translate(".concat(r, "px, ").concat(o, "px)"),
          width: "".concat(a, "px"),
          height: "".concat(s, "px"),
          zIndex: String(t.zIndexCounter + 1),
        });
      }
    };
    return e;
  })(),
  t4 = (function () {
    function e(canvas, t) {
      undefined === t && (t = ic(16));
      this.x = 0;
      this.y = 0;
      this.width = 100;
      this.height = 100;
      this.color = "";
      this.unknownData = {};
      this.initialized = false;
      this.zIndex = -1;
      this.aspectRatio = 0;
      this.isEditing = false;
      this.destroyed = false;
      this.renderedZIndex = -1;
      this.app = canvas.app;
      this.canvas = canvas;
      this.id = t;
      this.nodeEl = createDiv("canvas-node");
    }
    e.prototype.getData = function () {
      var e = this,
        t = e.id,
        n = e.x,
        i = e.y,
        width = e.width,
        height = e.height,
        color = e.color,
        s = e.unknownData,
        l = __assign(__assign({}, s), {
          id: t,
          x: n,
          y: i,
          width: width,
          height: height,
        });
      color && (l.color = color);
      return l;
    };
    e.prototype.setData = function (e) {
      var t = this.canvas,
        n = e.x,
        i = e.y,
        width = e.width,
        height = e.height,
        color = e.color,
        unknownData = __rest(e, ["x", "y", "width", "height", "color"]),
        l = false,
        c = false;
      n = Math.round(n);
      i = Math.round(i);
      width = Math.round(width);
      height = Math.round(height);
      isNaN(n) || this.x === n || ((this.x = n), (c = true), (l = true));
      isNaN(i) || this.y === i || ((this.y = i), (c = true), (l = true));
      isNaN(width) || this.width === width || ((this.width = width), (c = true), (l = true));
      isNaN(height) || this.height === height || ((this.height = height), (c = true), (l = true));
      color = m6(color || "");
      this.color !== color && ((this.color = color), (l = true));
      l && t.markDirty(this);
      c && t.markMoved(this);
      this.unknownData = unknownData;
    };
    Object.defineProperty(e.prototype, "rect", {
      get: function () {
        return {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
        };
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.setColor = function (color, t) {
      undefined === t && (t = false);
      color = m6(color || "");
      this.color !== color && ((this.color = color), t ? this.render() : this.canvas.markDirty(this));
    };
    e.prototype.moveTo = function (e) {
      this.moveAndResize(
        __assign(
          {
            width: this.width,
            height: this.height,
          },
          e,
        ),
      );
    };
    e.prototype.resize = function (e) {
      this.moveAndResize(
        __assign(
          {
            x: this.x,
            y: this.y,
          },
          e,
        ),
      );
    };
    e.prototype.moveAndResize = function (e) {
      this.x = Math.round(e.x);
      this.y = Math.round(e.y);
      this.width = Math.round(e.width);
      this.height = Math.round(e.height);
      this.canvas.markMoved(this);
    };
    e.prototype.destroy = function () {
      this.nodeEl.detach();
      this.destroyed = true;
    };
    e.prototype.attach = function () {
      var e = this.nodeEl,
        t = this.canvas;
      e.parentNode || t.canvasEl.appendChild(e);
      this.updateBreakpoint(t.zoom > t.zoomBreakpoint || this.isEditing);
    };
    e.prototype.preDetach = function () {};
    e.prototype.detach = function () {
      if (this.nodeEl.parentNode) {
        this.nodeEl.detach();
      }
    };
    e.prototype.updateBreakpoint = function (e) {};
    Object.defineProperty(e.prototype, "isAttached", {
      get: function () {
        return !!this.nodeEl.parentNode;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.initialize = function () {
      var e = this.nodeEl;
      e.addEventListener("click", this.onClick.bind(this));
      e.addEventListener("contextmenu", this.onContextMenu.bind(this));
      (this.containerEl = e.createDiv("canvas-node-container")).addEventListener(
        "pointerdown",
        this.onPointerdown.bind(this),
      );
    };
    e.prototype.setIsEditing = function (isEditing) {
      if (this.isEditing !== isEditing) {
        this.isEditing = isEditing;
        this.nodeEl.toggleClass("is-editing", isEditing);
      }
    };
    e.prototype.isEditable = function () {
      return !1;
    };
    e.prototype.startEditing = function () {
      var e = this.canvas;
      if (!e.readonly) {
        e.selectOnly(this);
        var t = e.zoomBreakpoint + 0.1;
        if (e.zoom < t) {
          e.zoomToBbox(this.getBBox());
        }
      }
    };
    e.prototype.getBBox = function () {
      return j2(this);
    };
    e.prototype.render = function () {
      if (!this.initialized) {
        this.initialized = true;
        this.initialize();
        this.zIndex < 0 && this.updateZIndex();
      }
      var e = this,
        t = e.nodeEl,
        n = e.x,
        i = e.y,
        r = e.width,
        o = e.height,
        a = e.color,
        s = e.canvas;
      t.setCssStyles({
        transform: "translate(".concat(n, "px, ").concat(i, "px)"),
        width: "".concat(r, "px"),
        height: "".concat(o, "px"),
      });
      t.setCssProps({
        "--canvas-node-width": "".concat(r, "px"),
        "--canvas-node-height": "".concat(o, "px"),
      });
      d6(t, a);
      t.toggleClass("is-themed", !!a);
      this.renderZIndex();
      this.updateBreakpoint(s.zoom > s.zoomBreakpoint || this.isEditing);
    };
    e.prototype.updateZIndex = function () {
      var e = this.canvas;
      this.zIndex !== e.zIndexCounter && (this.zIndex = e.getZIndex());
      this.renderZIndex();
    };
    e.prototype.renderZIndex = function () {
      var e = this.canvas,
        renderedZIndex = this.zIndex;
      e.selection.size == 1 && e.selection.has(this) && (renderedZIndex = e.zIndexCounter + 1);
      renderedZIndex !== this.renderedZIndex &&
        ((this.nodeEl.style.zIndex = renderedZIndex.toString()), (this.renderedZIndex = renderedZIndex));
    };
    Object.defineProperty(e.prototype, "isFocused", {
      get: function () {
        return this.nodeEl.hasClass("is-focused");
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.focus = function () {
      this.nodeEl.addClass("is-focused");
      this.renderZIndex();
    };
    e.prototype.blur = function () {
      this.nodeEl.removeClass("is-focused");
      this.setIsEditing(!1);
      this.renderZIndex();
    };
    e.prototype.select = function () {
      this.nodeEl.addClass("is-selected");
      this.renderZIndex();
    };
    e.prototype.deselect = function () {
      this.nodeEl.removeClass("is-selected");
      this.renderZIndex();
    };
    e.prototype.onPointerdown = function (e) {
      var t = this;
      if (
        !(
          !e.isPrimary ||
          e.button !== 0 ||
          this.isEditing ||
          e.pointerType !== "mouse" ||
          this.canvas.readonly ||
          fG(e.targetNode)
        )
      ) {
        setupPointerDragHandler(e, function () {
          return t.canvas.handleSelectionDrag(e, t.nodeEl, t);
        });
      }
    };
    e.prototype.onClick = function (e) {
      if (!this.isEditing) {
        var t = this.canvas;
        e.shiftKey ? t.toggleSelect(this) : t.selectOnly(this);
      }
    };
    e.prototype.onContextMenu = function (e) {
      if (!this.isEditing && !e.defaultPrevented) {
        var t = this.canvas;
        if (t.selection.has(this) && t.selection.size > 1) t.onSelectionContextMenu(e);
        else {
          t.selectOnly(this);
          var n = Menu.forEvent(e);
          n.addSections([
            "title",
            "canvas",
            "open",
            "action-primary",
            "action",
            "info",
            "view",
            "system",
            "",
            "danger",
          ]);
          this.showMenu(n);
        }
      }
    };
    e.prototype.showMenu = function (e) {
      var t = this,
        n = this.canvas;
      n.readonly ||
        e.addItem(function (e) {
          return e
            .setSection("danger")
            .setTitle($6.actionRemove())
            .setIcon("lucide-trash-2")
            .setWarning(!0)
            .onClick(function () {
              n.removeNode(t);
              n.requestSave();
            });
        });
      Platform.isMobile &&
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle($6.actionDuplicate())
            .setIcon("lucide-files")
            .onClick(function () {
              var e = n.getSelectionData(),
                t = n.cloneData(e),
                i = n.importData(t, !1);
              n.deselectAll();
              i.forEach(function (e) {
                return n.select(e);
              });
            });
        });
      e.addItem(function (e) {
        return e
          .setSection("canvas")
          .setTitle($6.actionZoomToSelection())
          .setIcon("zoom-to-selection")
          .onClick(function () {
            n.zoomToSelection();
          });
      });
      this.app.workspace.trigger("canvas:node-menu", e, this);
    };
    e.prototype.onResizePointerdown = function (e, t) {
      var n = this;
      if (e.isPrimary && e.button === 0 && (e.pointerType === "mouse" || this.canvas.selection.has(this))) {
        e.preventDefault();
        setupPointerDragHandler(e, function () {
          var i = n,
            r = i.canvas,
            o = i.x,
            a = i.y,
            width = i.width,
            height = i.height,
            c = r.options,
            u = c.snapToGrid,
            h = c.snapToObjects;
          r.selectOnly(n);
          n.nodeEl.addClass("is-dragging");
          return n.canvas.handleDragWithPan(e, {
            move: function (e) {
              var i,
                c,
                p = r.config.minContainerDimension,
                d = r.posFromEvt(e);
              r.clearSnapPoints();
              var f = 0,
                m = 0,
                g = J2(t, d, n),
                v = g.source,
                y = g.resizeX,
                b = g.resizeY;
              if (r.canSnap(e)) {
                if (h) {
                  var w = s6([j2(v)]),
                    k = s6(r.getViewportNodes(!0).map(j2)),
                    C = r.snapDistance;
                  y && (i = c6(w, k, C, "x")) && (f = i.delta);
                  b && (c = c6(w, k, C, "y")) && (m = c.delta);
                }
                if (u) {
                  var E = r.gridSpacing;
                  y && !i && (f = Math.round(d.x / E) * E - d.x);
                  b && !c && (m = Math.round(d.y / E) * E - d.y);
                }
              }
              var S = d.x + f,
                M = d.y + m,
                x = j2({
                  x: o,
                  y: a,
                  width: width,
                  height: height,
                });
              t.contains("top") &&
                ((x.minY = Math.min(x.maxY - p, M)), x.minY !== M && ((c = null), (m = x.minY - d.y)));
              t.contains("left") &&
                ((x.minX = Math.min(x.maxX - p, S)), x.minX !== S && ((i = null), (f = x.minX - d.x)));
              t.contains("bottom") &&
                ((x.maxY = Math.max(x.minY + p, M)), x.maxY !== M && ((c = null), (m = x.maxY - d.y)));
              t.contains("right") &&
                ((x.maxX = Math.max(x.minX + p, S)), x.maxX !== S && ((i = null), (f = x.maxX - d.x)));
              var T = {
                  x: x.minX,
                  y: x.minY,
                  width: x.maxX - x.minX,
                  height: x.maxY - x.minY,
                },
                D = n.aspectRatio;
              if (D !== 0) {
                var widthA0 = T.width,
                  heightP0 = T.height;
                if (y && b) {
                  var L = Math.max(widthA0, heightP0 * D);
                  heightP0 = Math.max(heightP0, widthA0 / D);
                  (widthA0 = L) !== T.width ? (i = null) : heightP0 !== T.height && (c = null);
                } else y ? (heightP0 = widthA0 / D) : b && (widthA0 = heightP0 * D);
                if (t.includes("left")) {
                  var I = o + width - widthA0;
                  f += I - T.x;
                  T.x = I;
                }
                if (t.includes("top")) {
                  var O = a + height - heightP0;
                  m += O - T.y;
                  T.y = O;
                }
                t.includes("right") && (f += widthA0 - T.width);
                t.includes("bottom") && (m += heightP0 - T.height);
                T.width = widthA0;
                T.height = heightP0;
              }
              (i || c) && r.renderSnapPoints(i, c, f, m);
              n.moveAndResize(T);
            },
            end: function () {
              r.requestSave();
            },
            cancel: function () {
              n.moveAndResize({
                x: o,
                y: a,
                width: width,
                height: height,
              });
              r.requestSave();
            },
            cleanup: function () {
              n.nodeEl.removeClass("is-dragging");
            },
          });
        });
      }
    };
    e.prototype.onConnectionPointerdown = function (e, side) {
      var node = this;
      if (e.isPrimary && e.button === 0 && (e.pointerType !== "touch" || this.canvas.selection.has(this))) {
        e.preventDefault();
        setupPointerDragHandler(e, function () {
          var i = node.canvas,
            noder0 = new i4(i),
            o = null;
          i.canvasEl.addClass("is-connecting");
          i.deselectAll();
          var sidea0 = (function (e) {
              switch (e) {
                case "right":
                  return "left";
                case "left":
                  return "right";
                case "top":
                  return "bottom";
              }
              return "top";
            })(side),
            s = {
              side: side,
              node: node,
              end: w4,
            },
            l = new C4(i, ic(16), s, {
              side: sidea0,
              node: noder0,
              end: k4,
            });
          i.addEdge(l);
          return node.canvas.handleDragWithPan(e, {
            move: function (e) {
              var t = i.posFromEvt(e);
              noder0.x = t.x;
              noder0.y = t.y;
              noder0.width = 0;
              noder0.height = 0;
              var c = i
                .getIntersectingNodes(Y2(noder0.getBBox(), node.canvas.config.objectSnapDistance))
                .filter(function (e) {
                  return (
                    e !== node &&
                    !(e instanceof p4 && Z2(e.getBBox(), node.getBBox())) &&
                    !(node instanceof p4 && Z2(node.getBBox(), e.getBBox()))
                  );
                });
              (o = o6(t, c, i.config.objectSnapDistance))
                ? l.update(s, {
                    side: o.side,
                    node: o.node,
                    end: k4,
                  })
                : l.update(s, {
                    side: sidea0,
                    node: noder0,
                    end: k4,
                  });
            },
            end: function (e) {
              if (o) i.requestSave();
              else {
                var t = node.app,
                  r = t.metadataCache,
                  c = new Menu().addSections(["action", "file", ""]),
                  u = false,
                  h = function () {
                    activeWindow.setTimeout(function () {
                      u || i.removeEdge(l);
                      u = false;
                    }, 50);
                  };
                c.onHide(h);
                var p = function (nodee0) {
                    l.update(s, {
                      side: sidea0,
                      node: nodee0,
                      end: k4,
                    });
                    i.requestSave();
                  },
                  d = function (filet0, subpath) {
                    var r = i.posFromEvt(e),
                      o = i.createFileNode({
                        pos: r,
                        position: sidea0,
                        file: filet0,
                        subpath: subpath,
                      });
                    p(o);
                  },
                  f = function (o, s) {
                    return __awaiter(node, undefined, undefined, function () {
                      var n, l, c, h, f, m, g, v;
                      return __generator(this, function (y) {
                        switch (y.label) {
                          case 0:
                            u = true;
                            n = i.posFromEvt(e);
                            return o
                              ? ((c = parseLinktext(o)),
                                (h = c.path),
                                (f = c.subpath),
                                (m = r.getFirstLinkpathDest(h, s))
                                  ? [3, 2]
                                  : ((g = parseLinktext(o).path),
                                    (v = t.fileManager.getNewFileParent(o, g)),
                                    [4, t.fileManager.createNewMarkdownFile(v, g)]))
                              : [3, 3];
                          case 1:
                            m = y.sent();
                            y.label = 2;
                          case 2:
                            d(m, f);
                            return [3, 4];
                          case 3:
                            l = i.createTextNode({
                              pos: n,
                              position: sidea0,
                            });
                            p(l);
                            y.label = 4;
                          case 4:
                            return [2];
                        }
                      });
                    });
                  };
                if (
                  (c
                    .addItem(function (e) {
                      return e
                        .setTitle($6.actionAddCard())
                        .setSection("action")
                        .onClick(function () {
                          return f("", "");
                        });
                    })
                    .addItem(function (e) {
                      return e
                        .setTitle($6.actionAddNote())
                        .setSection("action")
                        .onClick(function () {
                          u = true;
                          new n6(
                            node.canvas,
                            function (e) {
                              u = true;
                              d(e, "");
                            },
                            h,
                          ).open();
                        });
                    }),
                  node instanceof a4)
                ) {
                  var m = node.file,
                    g = [];
                  iterateRefs(r.getFileCache(m).links, function (e) {
                    var t = parseLinktext(e.link),
                      n = t.path,
                      i = t.subpath,
                      o = r.getFirstLinkpathDest(n, m.path);
                    o && g.push(r4(o, i));
                  });
                  for (
                    var v = 0,
                      w = node.getConnectedFiles(),
                      k = function (e) {
                        return w.has(e)
                          ? "continue"
                          : (w.add(e),
                            c.addItem(function (t) {
                              return t
                                .setTitle(e)
                                .setSection("file")
                                .onClick(function () {
                                  return f(e, m.path);
                                });
                            }),
                            ++v >= 20 ? "break" : undefined);
                      },
                      C = 0,
                      E = g;
                    C < E.length;
                    C++
                  ) {
                    if (k(E[C]) === "break") break;
                  }
                }
                node.app.workspace.trigger("canvas:node-connection-drop-menu", c, node, l);
                c.showAtMouseEvent(e);
              }
            },
            cancel: function () {
              i.removeEdge(l);
            },
            cleanup: function () {
              i.canvasEl.removeClass("is-connecting");
            },
          });
        });
      }
    };
    e.prototype.onResizeDblclick = function (e, t) {};
    e.prototype.getConnectedFiles = function () {
      for (var e = this.canvas, t = new Set(), n = 0, i = e.edgeFrom.getArray(this); n < i.length; n++) {
        var r = i[n],
          o = r.to.node;
        if (r.from.node === this && o instanceof a4 && o.file) {
          t.add(r4(o.file, o.subpath));
        }
      }
      return t;
    };
    return e;
  })(),
  n4 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.isContentMounted = false;
      t.alwaysKeepLoaded = false;
      return t;
    }
    __extends(t, e);
    t.prototype.attach = function () {
      var t = !this.nodeEl.parentNode;
      e.prototype.attach.call(this);
      t && this.contentEl && restoreScrollPositionsWalk(this.contentEl);
    };
    t.prototype.preDetach = function () {
      if (!this.alwaysKeepLoaded) {
        this.nodeEl.parentNode && this.contentEl && saveScrollPositions(this.contentEl);
      }
    };
    t.prototype.detach = function () {
      if (!this.alwaysKeepLoaded) {
        e.prototype.detach.call(this);
      }
    };
    t.prototype.updateBreakpoint = function (t) {
      e.prototype.updateBreakpoint.call(this, t);
      t ? this.mountContent() : this.unmountContent();
    };
    t.prototype.mountContent = function () {
      var e = this.initialized,
        t = this.containerEl;
      if (e && !this.isContentMounted) {
        t.appendChild(this.contentEl);
        t.appendChild(this.contentBlockerEl);
        this.placeholderEl.detach();
        this.isContentMounted = true;
        restoreScrollPositionsWalk(this.contentEl);
      }
    };
    t.prototype.unmountContent = function () {
      if (!this.alwaysKeepLoaded) {
        this.initialized &&
          this.isContentMounted &&
          (saveScrollPositions(this.contentEl),
          this.contentEl.detach(),
          this.contentBlockerEl.detach(),
          this.containerEl.appendChild(this.placeholderEl),
          (this.isContentMounted = false));
      }
    };
    t.prototype.initialize = function () {
      e.prototype.initialize.call(this);
      this.contentEl = createDiv("canvas-node-content");
      this.contentBlockerEl = createDiv("canvas-node-content-blocker");
      this.placeholderEl = this.containerEl.createDiv("canvas-node-placeholder");
    };
    return t;
  })(t4),
  i4 = (function (e) {
    function t(t) {
      var n = e.call(this, t, ic(16)) || this;
      n.nodeEl.addClass("is-dummy");
      return n;
    }
    __extends(t, e);
    return t;
  })(t4);
function r4(e, t) {
  return e.path + t;
}
var o4 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.resizeDirty = false;
      return t;
    }
    __extends(t, e);
    t.prototype.initialize = function () {
      var t = this;
      e.prototype.initialize.call(this);
      var n = function (e) {
        if (e.doc.activeElement.closest("button, input")) return !0;
        if (fG(e.targetNode)) return !0;
        var t = e.targetNode;
        return !(!t.instanceOf(Element) || !t.closest("button, input, .collapse-indicator"));
      };
      this.containerEl.addEventListener("dblclick", function (e) {
        if (!e.defaultPrevented) {
          var i = t.child;
          if (i instanceof IK && !i.editMode && !n(e)) {
            t.startEditing(Ll(e));
          }
        }
      });
      handleTextSelectionClick(this.contentEl, function (e) {
        if (!(t.destroyed || n(e))) {
          t.startEditing(Ll(e));
        }
      });
    };
    t.prototype.blur = function () {
      e.prototype.blur.call(this);
      var t = this.child;
      if (t instanceof c4 || t instanceof yY) {
        t.showPreview(!0);
        t.applyScope(null);
      }
    };
    t.prototype.focus = function () {
      e.prototype.focus.call(this);
      var t = this.app.workspace,
        activeEditor = this.child instanceof IK ? this.child : null;
      t.activeEditor = activeEditor;
      var i = null;
      this instanceof a4 && (i = this.file);
      this.canvas.requestUpdateFileOpen(i);
    };
    t.prototype.destroy = function () {
      e.prototype.destroy.call(this);
      var t = this.child;
      (t instanceof c4 || t instanceof yY) && t.applyScope(null);
      this.unloadChild();
    };
    t.prototype.unloadChild = function () {
      this.aspectRatio = 0;
      this.child && (this.child.unload(), (this.child = null), (this.alwaysKeepLoaded = false));
      this.contentEl && this.contentEl.empty();
      this.setIsEditing(!1);
    };
    t.prototype.startEditing = function (t) {
      e.prototype.startEditing.call(this);
      var n = this.child;
      if (!this.canvas.readonly && n instanceof IK) {
        n.showEditor(t);
        this.setIsEditing(!0);
      }
    };
    t.prototype.isEditable = function () {
      return this.child instanceof IK;
    };
    t.prototype.onClick = function (t) {
      var n = this.child;
      this.canvas.readonly || (n instanceof IK ? this.setIsEditing(!!n.editMode) : this.setIsEditing(!1));
      e.prototype.onClick.call(this, t);
    };
    t.prototype.onResizeDblclick = function (t, n) {
      t.preventDefault();
      e.prototype.onResizeDblclick.call(this, t, n);
      var i = this.child;
      if (i instanceof IK) {
        var r = i.previewMode.renderer.previewEl;
        if (!r.isShown()) return;
        if (n === "top" || n === "bottom") {
          for (var o = 0; o < 10; o++) {
            var a = r.clientHeight;
            r.style.height = "1px";
            var s = r.scrollHeight;
            r.style.height = "";
            var l = s - a + 1;
            if (Math.abs(l) < 0.5) break;
            this.resize({
              width: this.width,
              height: this.height + l,
            });
            this.render();
            this.canvas.requestSave();
          }
          return;
        }
        r.style.height = "1px";
        try {
          var c = r.scrollHeight + 0.1,
            widthu0 = this.width,
            h = 0,
            widthp0 = widthu0;
          for (o = 0; o < 10; o++) {
            var width = Math.round((h + widthp0) / 2);
            if (
              (this.resize({
                width: width,
                height: this.height,
              }),
              this.render(),
              r.scrollHeight > c ? (h = width) : (widthp0 = width),
              widthp0 - h < 1)
            )
              break;
          }
          this.resize({
            width: widthp0,
            height: this.height,
          });
          r.scrollHeight > c
            ? (this.resize({
                width: widthu0,
                height: this.height,
              }),
              this.render())
            : this.canvas.requestSave();
        } finally {
          r.style.height = "";
        }
      }
    };
    t.prototype.moveAndResize = function (t) {
      var n = this,
        i = n.width,
        r = n.height;
      n.child instanceof IK && (i !== t.width || r !== t.height) && (this.resizeDirty = true);
      e.prototype.moveAndResize.call(this, t);
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      var t = this.child;
      this.resizeDirty && t instanceof IK && t.previewMode.renderer.onResize();
      this.resizeDirty = false;
    };
    return t;
  })(n4),
  a4 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.filePath = "";
      t.subpath = "";
      t.file = null;
      return t;
    }
    __extends(t, e);
    t.prototype.initFile = function () {
      var e = this,
        t = e.filePath,
        n = e.file,
        i = e.app;
      if (t && (n == null ? undefined : n.path) !== t) {
        this.file = null;
        var filer0 = i.vault.getAbstractFileByPath(t);
        if (filer0 instanceof TFile) {
          this.file = filer0;
        }
      }
    };
    t.prototype.getData = function () {
      return __assign(__assign({}, e.prototype.getData.call(this)), {
        type: "file",
        file: this.file ? this.file.path : this.filePath,
        subpath: this.subpath || undefined,
      });
    };
    t.prototype.setData = function (t) {
      e.prototype.setData.call(this, t);
      var n = t.file,
        i = t.subpath;
      if (n) {
        this.setFilePath(n, i || "");
      }
    };
    t.prototype.setFilePath = function (filePath, subpath) {
      if (!(this.filePath === filePath && this.subpath === subpath)) {
        this.filePath = filePath;
        (this.file && this.file.path === filePath && this.subpath === subpath) ||
          ((this.subpath = subpath), this.initFile(), this.unloadChild());
        this.canvas.markDirty(this);
      }
    };
    t.prototype.setFile = function (filee0, subpath, n) {
      subpath = subpath || "";
      (n || this.filePath !== filee0.path || this.subpath !== subpath) &&
        ((this.subpath = subpath),
        (this.filePath = filee0.path),
        this.file !== filee0 && ((this.file = filee0), this.unloadChild()),
        this.canvas.markDirty(this));
    };
    t.prototype.blur = function () {
      e.prototype.blur.call(this);
      this.canvas.requestUpdateFileOpen(null);
    };
    t.prototype.focus = function () {
      e.prototype.focus.call(this);
      this.child && this.onFileFocus();
    };
    t.prototype.onFileFocus = function () {
      var e = this.app.workspace,
        activeEditor = this.child instanceof IK ? this.child : null;
      e.activeEditor = activeEditor;
      this.canvas.requestUpdateFileOpen(this.file);
    };
    t.prototype.initialize = function () {
      e.prototype.initialize.call(this);
    };
    t.prototype.updateNodeLabel = function (e) {
      var t = this,
        n = t.labelEl,
        i = t.canvas,
        r = t.nodeEl,
        o = i.options.cardLabelVisibility;
      o !== "never"
        ? (n ||
            ((n = this.labelEl = r.createDiv("canvas-node-label")).addEventListener(
              "click",
              this.onLabelClick.bind(this),
            ),
            n.addEventListener("dblclick", this.onLabelDblClick.bind(this)),
            n.addEventListener("pointerdown", this.onPointerdown.bind(this))),
          n.toggleClass("mod-hover-label", o === "hover"),
          n.setText(e))
        : n && (n.detach(), (this.labelEl = null));
    };
    t.prototype.updateBreakpoint = function (e) {
      if (e) this.mountContent();
      else {
        var t = this.child;
        t instanceof uY || t instanceof R4 ? this.mountContent() : this.unmountContent();
      }
    };
    t.prototype.render = function () {
      var t,
        n,
        i = this;
      e.prototype.render.call(this);
      var r = this,
        o = r.file,
        texta0 = r.filePath,
        s = r.subpath;
      if (o) {
        var l = o.getShortName();
        s && o.extension === "md" && (l += " › " + s.substring(1));
        this.updateNodeLabel(l);
        this.placeholderEl.setText(l);
      } else {
        this.updateNodeLabel(
          createFragment(function (e) {
            setIcon(e.createSpan(), "lucide-alert-triangle");
            e.createSpan({
              text: texta0,
            });
          }),
        );
        this.placeholderEl.setText(texta0);
      }
      if (!this.child) {
        var c,
          u = {
            app: this.app,
            linktext: this.filePath + this.subpath,
            sourcePath:
              (n = (t = this.canvas.view.file) === null || undefined === t ? undefined : t.path) !== null &&
              undefined !== n
                ? n
                : "",
            containerEl: this.contentEl,
            depth: 0,
          };
        o
          ? (c = this.child = vY.load(u)) instanceof yY &&
            ((c.useLocalPropertiesFoldState = true), (c.editable = true), (c.useIframe = true))
          : (c = this.child =
              new h4(u, this, function () {
                return i.render();
              }));
        this.isFocused && this.onFileFocus();
        c.load();
        __awaiter(i, undefined, undefined, function () {
          var e,
            t,
            n,
            i,
            r,
            o,
            a,
            s = this;
          return __generator(this, function (l) {
            switch (l.label) {
              case 0:
                return [4, c.loadFile()];
              case 1:
                l.sent();
                c instanceof rY &&
                  c.viewer.then(function (e) {
                    var t = e.pdfViewer,
                      n = e.toolbar;
                    t.setHeight("auto");
                    n.toolbarRightEl.createDiv("clickable-icon", function (n) {
                      setIcon(n, "lucide-file-symlink");
                      setTooltip(n, i18nProxy.pdf.actionSavePDFLocation());
                      e.on(
                        "pagechanging",
                        debounce(
                          function () {
                            s.subpath !== "#page=".concat(t.page)
                              ? n.setAttr("aria-disabled", "false")
                              : n.getAttr("aria-disable") !== "true" && n.setAttr("aria-disabled", "true");
                          },
                          100,
                          !0,
                        ),
                      );
                      n.addEventListener("click", function () {
                        s.subpath = "#page=".concat(t.page);
                        s.canvas.requestSave();
                        n.setAttr("aria-disabled", "true");
                      });
                    });
                  });
                return (e = this.contentEl.firstChild)
                  ? ((t = null),
                    e.instanceOf(HTMLImageElement)
                      ? ((t = {
                          width: e.naturalWidth,
                          height: e.naturalHeight,
                        }),
                        (e.draggable = false))
                      : e.instanceOf(HTMLVideoElement)
                        ? (t = {
                            width: e.videoWidth,
                            height: e.videoHeight,
                          })
                        : e.instanceOf(HTMLAudioElement) &&
                          ((n = function () {
                            s.resize({
                              width: s.width,
                              height: e.clientHeight || 42,
                            });
                          }),
                          e.isShown() || e.onNodeInserted(n, !0),
                          n()),
                    t &&
                      t.height !== 0 &&
                      ((i = this.aspectRatio = t.width / t.height),
                      (o = (r = this).width),
                      (a = r.height),
                      o / a !== i &&
                        (this.resize({
                          width: Math.min(o, a * i),
                          height: Math.min(a, o / i),
                        }),
                        this.canvas.overrideHistory())),
                    [2])
                  : [2];
            }
          });
        });
      }
    };
    t.prototype.onLabelClick = function (e) {
      var t = Keymap.isModEvent(e);
      if (t) {
        this.app.workspace.getLeaf(t).openLinkText(this.filePath + this.subpath, "");
      }
    };
    t.prototype.onLabelDblClick = function (e) {
      this.app.workspace.getLeaf(!1).openLinkText(this.filePath + this.subpath, "");
    };
    t.prototype.onPointerdown = function (t) {
      var n;
      if (
        !(
          this.child instanceof rY &&
          t.targetNode.instanceOf(HTMLElement) &&
          ((n = t.targetNode.parentElement) === null || undefined === n ? undefined : n.hasClass("textLayer"))
        )
      ) {
        e.prototype.onPointerdown.call(this, t);
      }
    };
    t.prototype.showMenu = function (t) {
      var n = this;
      e.prototype.showMenu.call(this, t);
      var i = this,
        r = i.file,
        o = i.child,
        a = i.canvas;
      a.readonly ||
        t.addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle($6.actionSwapFile())
            .setIcon(r ? "lucide-arrow-left-right" : "lucide-wrench")
            .onClick(function () {
              var e = !r || r.extension === "md" || r.extension === "canvas",
                t = !r || r.extension !== "md";
              new n6(n.canvas, function (e) {
                n.setFile(e, "");
                n.canvas.requestSave();
              })
                .showMarkdownAndCanvas(e)
                .showAttachments(t)
                .open();
            });
        });
      r &&
        (r.extension === "md" &&
          t.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(Q6.menu.openInNewTab())
              .setIcon("lucide-file-plus")
              .onClick(function () {
                n.app.workspace.getLeaf("tab").openFile(r);
              });
          }),
        !a.readonly &&
          o instanceof yY &&
          t.addItem(function (e) {
            return e
              .setSection("canvas")
              .setTitle(Q6.menu.edit())
              .setIcon("lucide-edit")
              .onClick(function () {
                return n.startEditing();
              });
          }),
        a.readonly ||
          r.extension !== "md" ||
          (t.addItem(function (e) {
            return e
              .setSection("canvas")
              .setIcon("lucide-minimize-2")
              .setTitle($6.actionNarrowHeading())
              .onClick(function () {
                new J6(n.app, r, "heading", function (e) {
                  var t = Jx(e),
                    i = t.path,
                    r = t.subpath;
                  n.setFilePath(i, r);
                  n.canvas.requestSave();
                }).open();
              });
          }),
          t.addItem(function (e) {
            return e
              .setSection("canvas")
              .setIcon("lucide-minimize-2")
              .setTitle($6.actionNarrowBlock())
              .onClick(function () {
                new J6(n.app, r, "block", function (e) {
                  if (e.type === "block" && !e.node.id) {
                    var t = e.content,
                      i = e.file,
                      r = (e.node.id = ic(6)),
                      o = db(e, r),
                      a = o.blockEnd,
                      s = o.addition;
                    t = t.slice(0, a) + s + t.slice(a);
                    n.app.vault.modify(i, t);
                  }
                  var l = Jx(e),
                    c = l.path,
                    u = l.subpath;
                  n.setFilePath(c, u);
                  n.canvas.requestSave();
                }).open();
              });
          })),
        a.readonly ||
          r.extension !== "base" ||
          t.addItem(function (e) {
            return e
              .setSection("canvas")
              .setIcon("lucide-minimize-2")
              .setTitle($6.actionNarrowBasesView())
              .onClick(function () {
                return __awaiter(n, undefined, undefined, function () {
                  var e,
                    t,
                    n,
                    i,
                    o = this;
                  return __generator(this, function (a) {
                    switch (a.label) {
                      case 0:
                        return [4, this.app.vault.cachedRead(r)];
                      case 1:
                        e = a.sent();
                        (t = (i = parseYaml(e)) === null || undefined === i ? undefined : i.views).unshift(null);
                        n = this.subpath.slice(1);
                        new s4(this.app, t, n, function (e) {
                          var t = e ? "#" + e : "";
                          o.setFilePath(o.filePath, t);
                          o.canvas.requestSave();
                        }).open();
                        return [2];
                    }
                  });
                });
              });
          }),
        this.subpath ||
          (t.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(i18nProxy.plugins.fileExplorer.menuOptRename())
              .setIcon("lucide-edit-3")
              .onClick(function () {
                return n.app.fileManager.promptForFileRename(r);
              });
          }),
          this.app.workspace.trigger("file-menu", t, r, "canvas-menu")));
    };
    return t;
  })(o4),
  s4 = (function (e) {
    function t(t, views, currentViewName, r) {
      var o = e.call(this, t) || this;
      o.views = views;
      o.currentViewName = currentViewName;
      o.cb = r;
      o.setInstructions([
        {
          command: "↑↓",
          purpose: i18nProxy.plugins.commandPalette.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: i18nProxy.plugins.commandPalette.instructionUse(),
        },
        {
          command: "esc",
          purpose: i18nProxy.plugins.commandPalette.instructionDismiss(),
        },
      ]);
      o.scope.register(null, "Tab", function () {
        return !1;
      });
      o.scope.register(null, "Enter", function (e) {
        if (!e.isComposing) {
          o.selectActiveSuggestion(e);
          return !1;
        }
      });
      return o;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return this.views;
    };
    t.prototype.getItemText = function (e) {
      return e ? e.name : "";
    };
    t.prototype.renderSuggestion = function (e, t) {
      t.addClass("mod-complex");
      var n = t.createDiv("suggestion-icon"),
        i = t.createSpan("suggestion-content").createDiv("suggestion-title"),
        r = e.item;
      if (r !== null) {
        if ((renderResults(i, r.name, e.match), r.name === this.currentViewName))
          t.createSpan("suggestion-aux").createSpan({
            cls: "flair toolbar-badge",
            text: i18nProxy.setting.appearance.labelCurrentlyActive(),
          });
        var o = this.app.internalPlugins.getEnabledPluginById("bases");
        if (o) {
          var a = o.getRegistration(r.type);
          setIcon(n.createDiv("suggestion-flair"), (a && a.icon) || "lucide-table");
        }
      } else i.setText(i18nProxy.plugins.canvas.labelShowDefaultView());
    };
    t.prototype.onChooseItem = function (e, t) {
      this.cb(e.name);
    };
    return t;
  })(FuzzySuggestModal),
  l4 = (function (e) {
    function t(t, n) {
      if (undefined === n) {
        n = ic(16);
      }
      var i = e.call(this, t, n) || this;
      i.text = "";
      return i;
    }
    __extends(t, e);
    t.prototype.getData = function () {
      return __assign(__assign({}, e.prototype.getData.call(this)), {
        type: "text",
        text: this.text,
      });
    };
    t.prototype.setData = function (t) {
      e.prototype.setData.call(this, t);
      var n = t.text;
      if (String.isString(n)) {
        this.setText(n);
      }
    };
    t.prototype.setText = function (texte0) {
      if (this.text !== texte0) {
        this.text = texte0;
        this.child && this.child.set(texte0);
      }
    };
    t.prototype.initialize = function () {
      e.prototype.initialize.call(this);
      setIcon(this.placeholderEl.createDiv("canvas-icon-placeholder"), "lucide-align-left");
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      this.child || ((this.child = new c4(this)), this.child.set(this.text), this.child.load());
    };
    t.prototype.showMenu = function (t) {
      var n = this;
      if (!(e.prototype.showMenu.call(this, t), this.canvas.readonly)) {
        this.child &&
          t
            .addItem(function (e) {
              return e
                .setSection("canvas")
                .setTitle(Q6.menu.edit())
                .setIcon("lucide-edit")
                .onClick(function () {
                  return n.startEditing();
                });
            })
            .addItem(function (e) {
              return e
                .setSection("canvas")
                .setTitle($6.actionConvertToFile())
                .setIcon("lucide-file-input")
                .onClick(function () {
                  return n.convertToFile();
                });
            });
      }
    };
    t.prototype.convertToFile = function () {
      var e = this,
        t = this.canvas,
        n = this.text,
        i = t.view.file.path;
      new QM(this.app, "Untitled", function (t) {
        return __awaiter(e, undefined, undefined, function () {
          var e, r, o, a, files0, node, c, u, h, p;
          return __generator(this, function (d) {
            switch (d.label) {
              case 0:
                r = (e = this).app;
                o = e.canvas;
                a = r.fileManager.getNewFileParent(i, t);
                d.label = 1;
              case 1:
                d.trys.push([1, 3, , 4]);
                return [4, r.fileManager.createNewMarkdownFile(a, t, n)];
              case 2:
                for (
                  files0 = d.sent(),
                    node = o.createFileNode({
                      pos: this,
                      size: this,
                      file: files0,
                      save: false,
                      focus: false,
                    }),
                    c = o.getEdgesForNode(this),
                    u = 0,
                    h = c;
                  u < h.length;
                  u++
                ) {
                  (p = h[u]).from.node === this &&
                    p.update(
                      __assign(__assign({}, p.from), {
                        node: node,
                      }),
                      p.to,
                    );
                  p.to.node === this &&
                    p.update(
                      p.from,
                      __assign(__assign({}, p.to), {
                        node: node,
                      }),
                    );
                }
                o.removeNode(this);
                o.selectOnly(node);
                o.requestSave();
                return [3, 4];
              case 3:
                return [2, d.sent()];
              case 4:
                return [2];
            }
          });
        });
      }).open();
    };
    return t;
  })(o4),
  c4 = (function (e) {
    function t(node) {
      var n = e.call(this, node.app, node.contentEl, null) || this;
      n.editable = true;
      n.useIframe = true;
      n.scope = null;
      n.node = node;
      n.containerEl.addClass("markdown-embed");
      return n;
    }
    __extends(t, e);
    t.prototype.save = function (textt0, n) {
      undefined === n && (n = false);
      e.prototype.save.call(this, textt0, n);
      n && this.node.text !== textt0 && ((this.node.text = textt0), this.node.canvas.requestSave());
    };
    t.prototype.applyScope = function (scope) {
      if (scope !== this.scope) {
        this.scope && this.app.keymap.popScope(this.scope);
        scope && this.app.keymap.pushScope(scope);
        this.scope = scope;
      }
    };
    t.prototype.onunload = function () {
      e.prototype.onunload.call(this);
      this.applyScope(null);
    };
    Object.defineProperty(t.prototype, "linktext", {
      get: function () {
        var e = this.node;
        return e.canvas.view.file.path + "#^" + e.id;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.getFoldInfo = function () {
      return this.app.foldManager.loadPath(this.linktext);
    };
    t.prototype.onMarkdownFold = function () {
      var e = this.getMode() === "preview" ? this.previewMode.renderer.getFoldInfo() : this.editMode.getFoldInfo();
      this.app.foldManager.savePath(this.linktext, e);
    };
    return t;
  })(IK),
  u4 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.url = "";
      t.alwaysKeepLoaded = true;
      return t;
    }
    __extends(t, e);
    t.prototype.getData = function () {
      return __assign(__assign({}, e.prototype.getData.call(this)), {
        type: "link",
        url: this.url,
      });
    };
    t.prototype.setData = function (t) {
      e.prototype.setData.call(this, t);
      var n = t.url;
      if (n) {
        this.setUrl(n);
      }
    };
    t.prototype.setUrl = function (url) {
      if (this.url !== url) {
        this.url = url;
        this.canvas.markDirty(this);
        this.setFrameUrl();
      }
    };
    t.prototype.recreateFrame = function () {
      var e,
        t = this;
      if ((this.frameEl && this.frameEl.detach(), Platform.isDesktopApp)) {
        var n = this.contentEl,
          i = n.doc,
          frameEl = i.createElement("webview"),
          partition = this.app.getWebviewPartition();
        electron.ipcRenderer.send("create-browser-session", partition, null);
        frameEl.partition = partition;
        frameEl.addClass("canvas-link");
        frameEl.allowpopups = true;
        e = this.frameEl = frameEl;
        frameEl.addEventListener("did-frame-finish-load", function () {
          t.updateNodeLabel(frameEl.getTitle());
        });
        frameEl.addEventListener("destroyed", function () {
          if (i !== n.doc) {
            frameEl.detach();
            t.recreateFrame();
          }
        });
        i.contains(n)
          ? n.appendChild(frameEl)
          : n.onNodeInserted(function () {
              n.doc === i ? n.appendChild(frameEl) : t.recreateFrame();
            }, !0);
      } else {
        (e = this.frameEl = this.contentEl.createEl("iframe", "canvas-link")).setAttr(
          "sandbox",
          "allow-forms allow-presentation allow-same-origin allow-scripts allow-modals",
        );
        e.setAttr("allow", "fullscreen");
      }
      e.style.width = "100%";
      e.style.height = "100%";
      this.setFrameUrl();
    };
    t.prototype.initialize = function () {
      e.prototype.initialize.call(this);
      this.recreateFrame();
    };
    t.prototype.updateNodeLabel = function (e) {
      var t = this,
        n = this,
        i = n.labelEl,
        r = n.canvas,
        o = n.nodeEl,
        a = r.options.cardLabelVisibility;
      a !== "never"
        ? (i ||
            ((i = this.labelEl = o.createDiv("canvas-node-label")).addEventListener(
              "click",
              this.onLabelClick.bind(this),
            ),
            i.addEventListener("dblclick", function () {
              window.open(t.url, "_blank");
            }),
            i.addEventListener("pointerdown", this.onPointerdown.bind(this))),
          i.toggleClass("mod-hover-label", a === "hover"),
          i.setText(e))
        : i && (i.detach(), (this.labelEl = null));
    };
    t.prototype.onLabelClick = function (e) {
      if (Keymap.isModifier(e, "Mod")) {
        window.open(this.url, "_blank");
      }
    };
    t.prototype.setFrameUrl = function () {
      var e = this.frameEl,
        src = this.url;
      if (e && (this.updateNodeLabel(src), /^https?:\/\//.test(src))) {
        var n = FN(src);
        if ((n && (src = n), (e.src = src), isWebViewElement(e) && e.isShown()))
          try {
            e.loadURL(src);
          } catch (e) {}
      }
    };
    t.prototype.showMenu = function (t) {
      var n = this;
      e.prototype.showMenu.call(this, t);
      this.canvas.readonly ||
        t.addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle($6.actionChangeUrl())
            .setIcon("lucide-link")
            .onClick(function () {
              new X6(n.app, n.url, function (e) {
                n.setUrl(e);
                n.canvas.requestSave();
              }).open();
            });
        });
      t.addItem(function (e) {
        return e
          .setSection("canvas")
          .setTitle(i18nProxy.interface.menu.openInBrowser())
          .setIcon("lucide-globe")
          .onClick(function () {
            window.open(n.url, "_blank");
          });
      })
        .addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle(i18nProxy.interface.menu.copyUrl())
            .setIcon("lucide-copy")
            .onClick(function () {
              vc(n.url);
              new Notice(
                i18nProxy.interface.copied({
                  item: i18nProxy.interface.url(),
                }),
              );
            });
        })
        .addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle($6.actionReloadPage())
            .setIcon("lucide-rotate-ccw")
            .onClick(function () {
              var e = n.frameEl;
              if (isWebViewElement(e))
                try {
                  e.loadURL(n.url);
                } catch (e) {}
              else e.src = n.url;
            });
        });
    };
    return t;
  })(n4),
  h4 = (function (e) {
    function t(ctx, node, reload) {
      var r = e.call(this) || this;
      r.file = null;
      r.ctx = ctx;
      r.node = node;
      r.reload = reload;
      r.containerEl = ctx.containerEl;
      return r;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, linktext, o, a, s, l;
        return __generator(this, function (c) {
          t = (e = this).containerEl;
          n = e.ctx;
          i = n.app;
          linktext = n.linktext;
          o = n.sourcePath;
          a = e.node;
          s = a.canvas;
          a.contentBlockerEl.detach();
          l = parseLinktext(linktext).path;
          t.createDiv("canvas-empty-embed-container", function (e) {
            e.createDiv({
              cls: "canvas-empty-embed-label",
              text: $6.labelEmptyEmbed({
                linktext: linktext,
              }),
            });
            e.createDiv("canvas-empty-embed-action-list", function (e) {
              var t = getExtension(l);
              (t !== "md" && t !== "") ||
                e.createEl(
                  "button",
                  {
                    cls: "empty-state-action",
                    text: i18nProxy.interface.emptyState.createNewFile(),
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      i.fileManager.createNewMarkdownFileFromLinktext(linktext, o);
                    });
                  },
                );
              e.createEl(
                "button",
                {
                  cls: "empty-state-action",
                  text: $6.actionSwapFile(),
                },
                function (e) {
                  e.addEventListener("click", function (e) {
                    new n6(a.canvas, function (e) {
                      a.setFile(e, "");
                      s.requestSave();
                    }).open();
                  });
                },
              );
              e.createEl(
                "button",
                {
                  cls: "empty-state-action mod-warning",
                  text: $6.actionRemove(),
                },
                function (e) {
                  e.addEventListener("click", function (e) {
                    s.removeNode(a);
                    s.requestSave();
                  });
                },
              );
            });
          });
          t.addClass("mod-canvas-empty");
          return [2];
        });
      });
    };
    t.prototype.onload = function () {
      var e = this,
        t = this.ctx,
        n = t.app,
        i = t.linktext,
        r = debounce(function (t) {
          var n = parseLinktext(i),
            r = n.path,
            o = n.subpath;
          if (t instanceof TFile && t.path === r) {
            e.node.setFile(t, o, !0);
          }
        });
      this.registerEvent(n.vault.on("create", r));
      this.registerEvent(n.vault.on("rename", r));
    };
    t.prototype.onClick = function (e) {
      var t = this.ctx,
        n = t.app,
        i = t.linktext,
        r = t.sourcePath;
      n.workspace.openLinkText(i, r, Keymap.isModEvent(e));
    };
    return t;
  })(Component),
  p4 = (function (e) {
    function t(t, n) {
      if (undefined === n) {
        n = ic(16);
      }
      var i = e.call(this, t, n) || this;
      i.label = "";
      i.bgPath = "";
      i.bgStyle = "";
      i.nodeEl.addClass("canvas-node-group");
      return i;
    }
    __extends(t, e);
    t.prototype.getData = function () {
      var t = __assign(__assign({}, e.prototype.getData.call(this)), {
          type: "group",
        }),
        n = this,
        label = n.label,
        r = n.bgPath,
        o = n.bgFile,
        backgroundStyle = n.bgStyle;
      label && (t.label = label);
      r &&
        ((t.background = o ? o.path : r),
        backgroundStyle && backgroundStyle !== "cover" && (t.backgroundStyle = backgroundStyle));
      return t;
    };
    t.prototype.setData = function (t) {
      var n = t.label,
        bgPath = t.background,
        r = __rest(t, ["label", "background"]);
      e.prototype.setData.call(this, r);
      var bgStyle = t.backgroundStyle;
      if ((n && String.isString(n) && this.setLabel(n), bgStyle || (bgStyle = ""), bgPath && String.isString(bgPath))) {
        if (this.bgPath !== bgPath || (this.bgFile && this.bgFile.path !== bgPath)) {
          this.bgPath = bgPath;
          var a = this.app.vault.getAbstractFileByPath(bgPath);
          this.bgFile = a instanceof TFile ? a : null;
          this.canvas.markDirty(this);
        }
        if (this.bgStyle !== bgStyle) {
          this.bgStyle = bgStyle;
          this.canvas.markDirty(this);
        }
      } else if (this.bgPath) {
        this.bgPath = "";
        this.bgFile = null;
        this.bgStyle = "";
        this.canvas.markDirty(this);
      }
      this.updateAspectRatio();
    };
    t.prototype.setLabel = function (label) {
      if (this.label !== label) {
        this.label = label;
        this.canvas.markDirty(this);
      }
    };
    t.prototype.setBackgroundFile = function (bgFile) {
      var bgPath = bgFile ? bgFile.path : "";
      if (!(this.bgPath === bgPath && this.bgFile === bgFile)) {
        this.bgPath = bgPath;
        this.bgFile = bgFile;
        bgFile || (this.bgStyle = "");
        this.updateAspectRatio();
        this.canvas.markDirty(this);
      }
    };
    t.prototype.setBackgroundStyle = function (bgStyle) {
      this.bgPath || (bgStyle = "");
      this.bgStyle !== bgStyle && ((this.bgStyle = bgStyle), this.updateAspectRatio(), this.canvas.markDirty(this));
    };
    t.prototype.initialize = function () {
      var t = this;
      e.prototype.initialize.call(this);
      this.contentEl = this.containerEl.createDiv("canvas-node-content");
      var n = (this.labelEl = this.nodeEl.createDiv("canvas-group-label"));
      n.spellcheck = false;
      n.addEventListener("pointerdown", this.onPointerdown.bind(this));
      n.addEventListener("dblclick", function () {
        return t.focusLabel();
      });
      n.addEventListener("keypress", function (e) {
        if (!(e.isComposing || e.key !== "Enter")) {
          e.preventDefault();
          t.blurLabel();
        }
      });
      n.addEventListener("blur", function () {
        return t.blurLabel();
      });
    };
    t.prototype.focusLabel = function () {
      var e = this.labelEl;
      if (e) {
        e.show();
        e.setAttr("contenteditable", !0);
        focusAndSelectContent(e);
      }
    };
    t.prototype.blur = function () {
      e.prototype.blur.call(this);
      this.blurLabel();
    };
    t.prototype.blurLabel = function () {
      var e = this.labelEl;
      if (e) {
        e.setAttr("contenteditable", !1);
        e.blur();
        var t = e.getText();
        this.label !== t ? (this.setLabel(t), this.canvas.requestSave()) : (e.toggle(!!t), e.setText(t));
      }
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      var t = this,
        n = t.labelEl,
        i = t.label,
        r = t.color;
      if (!n.isActiveElement()) {
        n.toggle(!!i);
        n.setText(i);
      }
      var o = false,
        a = false;
      if (r) {
        var s = undefined;
        if (p6.test(r)) {
          var l = n.getCssPropertyValue("--canvas-color-".concat(r));
          s = IT("rgb(".concat(l, ")"));
        } else s = IT(r);
        if (s) {
          OT(s) ? (a = true) : (o = true);
        }
      }
      n.toggleClass("mod-foreground-light", o);
      n.toggleClass("mod-foreground-dark", a);
      var c = this,
        u = c.app,
        h = c.bgFile,
        p = c.bgStyle,
        d = c.contentEl;
      if (h) {
        var f = {
          backgroundImage: 'url("'.concat(CSS.escape(u.vault.getResourcePath(h)), '")'),
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        };
        p === "repeat" &&
          ((f.backgroundRepeat = "repeat"), (f.backgroundPosition = "top left"), (f.backgroundSize = "auto"));
        d.setCssStyles(f);
      } else
        d.setCssStyles({
          backgroundImage: "",
          backgroundRepeat: "",
          backgroundPosition: "",
          backgroundSize: "",
        });
    };
    t.prototype.updateAspectRatio = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              t = (e = this).bgFile;
              return e.bgStyle === "ratio" && t
                ? ((i = (n = this).app),
                  (r = n.canvas),
                  (o = n.width),
                  (a = n.height),
                  [4, getImageNaturalSize(i.vault.getResourcePath(t))])
                : ((this.aspectRatio = 0), [2]);
            case 1:
              (s = c.sent()) &&
                s.height !== 0 &&
                ((l = this.aspectRatio = s.width / s.height),
                o / a !== l &&
                  (this.resize({
                    width: Math.min(o, a * l),
                    height: Math.min(a, o / l),
                  }),
                  r.overrideHistory()));
              return [2];
          }
        });
      });
    };
    t.prototype.updateZIndex = function () {
      this.renderZIndex();
    };
    t.prototype.renderZIndex = function () {
      var e = (this.zIndex = Math.round(-this.width * this.height));
      this.nodeEl.style.zIndex = String(e);
    };
    t.prototype.isEditable = function () {
      return !0;
    };
    t.prototype.startEditing = function () {
      e.prototype.startEditing.call(this);
      this.canvas.readonly || this.focusLabel();
    };
    t.prototype.showMenu = function (t) {
      var n = this;
      e.prototype.showMenu.call(this, t);
      this.canvas.readonly ||
        t.addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle($6.actionEditLabel())
            .setIcon("lucide-edit")
            .onClick(function () {
              return n.startEditing();
            });
        });
    };
    return t;
  })(t4),
  d4 = i18nProxy.plugins.canvas;
function f4(e, t) {
  var n = X2(e.getBBox()),
    i = X2(t.getBBox()),
    r = Math.atan2(i.y - n.y, i.x - n.x),
    o = Math.atan2(e.height, e.width);
  return r > -o && r <= o
    ? "right"
    : r > o && r <= Math.PI - o
      ? "bottom"
      : r > Math.PI - o || r <= -(Math.PI - o)
        ? "left"
        : "top";
}
function m4(e, t) {
  switch (t) {
    case "top":
      return Pl((e.minX + e.maxX) / 2, e.minY);
    case "right":
      return Pl(e.maxX, (e.minY + e.maxY) / 2);
    case "bottom":
      return Pl((e.minX + e.maxX) / 2, e.maxY);
    case "left":
      return Pl(e.minX, (e.minY + e.maxY) / 2);
  }
}
function g4(e, t) {
  var n = __assign({}, e);
  switch (t) {
    case "top":
      n.y -= 7;
      break;
    case "bottom":
      n.y += 7;
      break;
    case "left":
      n.x -= 7;
      break;
    case "right":
      n.x += 7;
  }
  return n;
}
function v4(e, t, n) {
  switch (e) {
    case "left":
      return {
        x: t.x - n,
        y: t.y,
      };
    case "right":
      return {
        x: t.x + n,
        y: t.y,
      };
    case "top":
      return {
        x: t.x,
        y: t.y - n,
      };
    case "bottom":
      return {
        x: t.x,
        y: t.y + n,
      };
  }
}
function y4(from, t, n, i) {
  var r = Fl(from, n),
    o = Math.clamp(r / 2, 70, 150),
    a = v4(t, from, o),
    s = v4(i, n, o);
  return {
    from: from,
    to: n,
    cp1: a,
    cp2: s,
    path: "M"
      .concat(from.x, ",")
      .concat(from.y, " C")
      .concat(a.x, ",")
      .concat(a.y, " ")
      .concat(s.x, ",")
      .concat(s.y, " ")
      .concat(n.x, ",")
      .concat(n.y),
  };
}
var b4 = {
    top: "180",
    bottom: "0",
    left: "90",
    right: "270",
  },
  w4 = "none",
  k4 = "arrow",
  C4 = (function () {
    function e(canvas, t, from, i) {
      this.color = "";
      this.label = "";
      this.unknownData = {};
      this.initialized = false;
      this.canvas = canvas;
      this.id = t;
      this.from = from;
      this.to = i;
      this.lineGroupEl = createSvg("g");
      this.lineEndGroupEl = createSvg("g");
    }
    e.prototype.attach = function () {
      if (!this.isAttached) {
        this.canvas.edgeContainerEl.appendChild(this.lineGroupEl);
        this.canvas.edgeEndContainerEl.appendChild(this.lineEndGroupEl);
      }
    };
    e.prototype.detach = function () {
      if (this.isAttached) {
        this.lineGroupEl.detach();
        this.lineEndGroupEl.detach();
      }
    };
    Object.defineProperty(e.prototype, "isAttached", {
      get: function () {
        return !!this.lineGroupEl.parentNode;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.destroy = function () {
      var e, t, n;
      (e = this.labelElement) === null || undefined === e || e.destroy();
      (t = this.lineGroupEl) === null || undefined === t || t.remove();
      (n = this.lineEndGroupEl) === null || undefined === n || n.remove();
    };
    e.prototype.getData = function () {
      var e = this,
        t = e.id,
        n = e.from,
        i = e.to,
        color = e.color,
        label = e.label,
        a = e.unknownData,
        s = __assign(__assign({}, a), {
          id: t,
          fromNode: n.node.id,
          fromSide: n.side,
          toNode: i.node.id,
          toSide: i.side,
        });
      n.end !== w4 && (s.fromEnd = n.end);
      i.end !== k4 && (s.toEnd = i.end);
      color && (s.color = color);
      label && (s.label = label);
      return s;
    };
    e.prototype.setData = function (e) {
      var t = e.fromNode,
        side = e.fromSide,
        end = e.fromEnd,
        r = e.toNode,
        sideo0 = e.toSide,
        enda0 = e.toEnd,
        color = e.color,
        label = e.label,
        unknownData = __rest(e, ["fromNode", "fromSide", "fromEnd", "toNode", "toSide", "toEnd", "color", "label"]),
        u = false;
      color = m6(color || "");
      this.color !== color && ((this.color = color), (u = true));
      this.label !== label && ((this.label = label), (u = true));
      var h = this.canvas,
        p = h.nodes,
        d = false;
      t && t !== this.from.node.id && p.has(t) && ((d = true), (this.from.node = p.get(t)));
      end = end || w4;
      t && end !== this.from.end && ((this.from.end = end), (u = true));
      r && r !== this.to.node.id && p.has(r) && ((d = true), (this.to.node = p.get(r)));
      enda0 = enda0 || k4;
      r && enda0 !== this.to.end && ((this.to.end = enda0), (u = true));
      t &&
        (side = side != null ? side : f4(this.from.node, this.to.node)) !== this.from.side &&
        ((this.from.side = side), (u = true));
      r &&
        (sideo0 = sideo0 != null ? sideo0 : f4(this.to.node, this.from.node)) !== this.to.side &&
        ((this.to.side = sideo0), (u = true));
      d && h.markMoved(this);
      u && h.markDirty(this);
      this.unknownData = unknownData;
    };
    e.prototype.setColor = function (color, t) {
      undefined === t && (t = false);
      color = m6(color || "");
      this.color !== color && ((this.color = color), t ? this.render() : this.canvas.markDirty(this));
    };
    e.prototype.setLabel = function (label) {
      if (this.label !== label) {
        this.label = label;
      }
    };
    e.prototype.update = function (from, t) {
      var n = this.canvas;
      this.from.node !== from.node &&
        (n.edgeFrom.delete(this.from.node, this), from.node instanceof i4 || n.edgeFrom.add(from.node, this));
      this.to.node !== t.node &&
        (n.edgeTo.delete(this.to.node, this), t.node instanceof i4 || n.edgeTo.add(t.node, this));
      this.from = from;
      this.to = t;
      n.markMoved(this);
    };
    e.prototype.getBBox = function () {
      var e = this.from,
        t = this.to,
        n = m4(e.node.getBBox(), e.side),
        i = m4(t.node.getBBox(), t.side);
      return {
        minX: Math.min(n.x, i.x),
        minY: Math.min(n.y, i.y),
        maxX: Math.max(n.x, i.x),
        maxY: Math.max(n.y, i.y),
      };
    };
    e.prototype.focus = function () {
      this.select();
    };
    e.prototype.blur = function () {
      var e;
      this.deselect();
      (e = this.labelElement) === null || undefined === e || e.blur();
    };
    e.prototype.select = function () {
      this.lineGroupEl.addClass("is-focused");
      this.lineEndGroupEl.addClass("is-focused");
    };
    e.prototype.deselect = function () {
      this.lineGroupEl.removeClass("is-focused");
      this.lineEndGroupEl.removeClass("is-focused");
    };
    e.prototype.editLabel = function () {
      this.labelElement || (this.labelElement = new E4(this));
      this.labelElement.focus();
    };
    e.prototype.getCenter = function () {
      return (function (e, t) {
        var n = t.from,
          i = t.to,
          r = t.cp1,
          o = t.cp2,
          a = 1 - e,
          s = a * a * a,
          l = 3 * e * a * a,
          c = 3 * e * e * a,
          u = e * e * e;
        return {
          x: s * n.x + l * r.x + c * o.x + u * i.x,
          y: s * n.y + l * r.y + c * o.y + u * i.y,
        };
      })(0.5, this.bezier);
    };
    e.prototype.initialize = function () {
      var e = this,
        t = this.lineGroupEl;
      t.addEventListener("click", function (t) {
        return e.onClick(t);
      });
      t.addEventListener("contextmenu", function (t) {
        return e.onContextMenu(t);
      });
      t.addEventListener("pointerdown", function (t) {
        return e.onConnectionPointerdown(t);
      });
      this.path = {
        interaction: t.createSvg("path", "canvas-interaction-path"),
        display: t.createSvg("path", "canvas-display-path"),
      };
    };
    e.prototype.render = function () {
      var e;
      if (!this.initialized) {
        this.initialized = true;
        this.initialize();
      }
      var t = this,
        n = t.lineGroupEl,
        i = t.lineEndGroupEl,
        r = t.color,
        o = t.label;
      this.updatePath();
      this.labelElement && !o && this.labelElement.destroy(!0);
      (e = this.labelElement) === null || undefined === e || e.render();
      o && (this.labelElement || (this.labelElement = new E4(this)), this.labelElement.setText(o));
      d6(n, r);
      d6(i, r);
      n.toggleClass("is-themed", !!r);
      i.toggleClass("is-themed", !!r);
    };
    e.prototype.updatePath = function () {
      var e = this,
        t = e.from,
        n = e.to,
        i = e.path,
        r = e.toLineEnd,
        o = e.fromLineEnd,
        a = m4(t.node.getBBox(), t.side),
        s = g4(a, t.side),
        l = m4(n.node.getBBox(), n.side),
        c = g4(l, n.side),
        u = (this.bezier = y4(s, t.side, c, n.side));
      t.end !== (o == null ? undefined : o.type) &&
        (o && o.el.detach(), (o = this.fromLineEnd = this.createEdgeEnd(t.end)));
      n.end !== (r == null ? undefined : r.type) &&
        (r && r.el.detach(), (r = this.toLineEnd = this.createEdgeEnd(n.end)));
      var h = u.path;
      o
        ? (o.el.style.transform = "translate("
            .concat(a.x, "px, ")
            .concat(a.y, "px) rotate(")
            .concat(b4[t.side], "deg)"))
        : (h = "M".concat(a.x, " ").concat(a.y, " L").concat(s.x, " ").concat(s.y, " ").concat(h));
      r
        ? (r.el.style.transform = "translate("
            .concat(l.x, "px, ")
            .concat(l.y, "px) rotate(")
            .concat(b4[n.side], "deg)"))
        : (h = "".concat(h, " M").concat(c.x, " ").concat(c.y, " L").concat(l.x, " ").concat(l.y));
      i.interaction.setAttr("d", h);
      i.display.setAttr("d", h);
    };
    e.prototype.createEdgeEnd = function (typee0) {
      return typee0 === "arrow"
        ? {
            el: this.lineEndGroupEl.createSvg("g", {}, function (e) {
              e.createSvg("polygon", {
                cls: "canvas-path-end",
                attr: {
                  points: "0,0 6.5,10.4 -6.5,10.4",
                },
              });
            }),
            type: typee0,
          }
        : null;
    };
    e.prototype.onClick = function (e) {
      var t = this.canvas;
      if (!(e.button !== 0 || t.readonly)) {
        e.shiftKey
          ? t.toggleSelect(this)
          : t.selection.size === 1 && t.selection.has(this)
            ? this.editLabel()
            : t.selectOnly(this);
      }
    };
    e.prototype.onContextMenu = function (e) {
      if (!e.defaultPrevented) {
        var t = this.canvas;
        if (t.selection.has(this) && t.selection.size > 1) t.onSelectionContextMenu(e);
        else {
          if (!t.readonly) {
            t.selectOnly(this);
          }
          var n = new Menu().addSections(["canvas"]);
          this.showMenu(n, e);
          e.preventDefault();
          n.showAtMouseEvent(e);
        }
      }
    };
    e.prototype.showMenu = function (e, t) {
      var n = this;
      this.canvas.readonly ||
        (e.addItem(function (e) {
          return e
            .setSection("danger")
            .setTitle(d4.actionRemove())
            .setIcon("lucide-trash-2")
            .setWarning(!0)
            .onClick(function () {
              n.canvas.removeEdge(n);
              n.canvas.requestSave();
            });
        }),
        e.addItem(function (e) {
          return e
            .setSection("canvas")
            .setTitle(d4.actionEditLabel())
            .setIcon("lucide-edit")
            .onClick(function () {
              return n.editLabel();
            });
        }));
      e.addItem(function (e) {
        return e
          .setSection("canvas")
          .setTitle(d4.actionFollowConnection())
          .setIcon("lucide-corner-down-right")
          .onClick(function () {
            var e = n,
              i = e.canvas,
              r = e.from,
              o = e.to,
              a = i.posFromEvt(t),
              s = m4(r.node.getBBox(), r.side),
              l = m4(o.node.getBBox(), o.side),
              c = (Fl(a, s) > Fl(a, l) ? "to" : "from") === "from" ? o.node : r.node;
            i.zoomToBbox(c.getBBox());
          });
      });
      this.canvas.app.workspace.trigger("canvas:edge-menu", e, this);
    };
    e.prototype.onConnectionPointerdown = function (e) {
      var t = this,
        n = this.canvas;
      if (e.isPrimary && e.button === 0 && !n.readonly && (e.pointerType !== "touch" || n.selection.has(this))) {
        e.preventDefault();
        setupPointerDragHandler(e, function () {
          var n = t,
            i = n.canvas,
            r = n.from,
            o = n.to,
            a = i.posFromEvt(e),
            s = m4(r.node.getBBox(), r.side),
            l = m4(o.node.getBBox(), o.side),
            c = Fl(a, s) > Fl(a, l) ? "to" : "from",
            u = c === "from" ? o : r,
            node = new i4(i),
            p = null;
          i.canvasEl.addClass("is-connecting");
          i.deselectAll();
          return t.canvas.handleDragWithPan(e, {
            move: function (e) {
              var n = i.posFromEvt(e);
              node.x = n.x;
              node.y = n.y;
              node.width = 0;
              node.height = 0;
              var a = i.getIntersectingNodes(Y2(node.getBBox(), i.config.objectSnapDistance));
              a.remove(u.node);
              p = o6(n, a, i.config.objectSnapDistance);
              c === "from"
                ? p
                  ? t.update(
                      {
                        side: p.side,
                        node: p.node,
                        end: r.end,
                      },
                      o,
                    )
                  : t.update(
                      {
                        side: r.side,
                        node: node,
                        end: r.end,
                      },
                      o,
                    )
                : p
                  ? t.update(r, {
                      side: p.side,
                      node: p.node,
                      end: o.end,
                    })
                  : t.update(r, {
                      side: o.side,
                      node: node,
                      end: o.end,
                    });
            },
            end: function () {
              p || i.removeEdge(t);
              i.requestSave();
            },
            cancel: function () {
              t.update(r, o);
            },
            cleanup: function () {
              i.canvasEl.removeClass("is-connecting");
              temporarilyPreventEvent(t.lineGroupEl, "click");
            },
          });
        });
      }
    };
    return e;
  })(),
  E4 = (function () {
    function e(edge) {
      var t = this;
      this.isEditing = false;
      this.initialTextState = "";
      this.edge = edge;
      var n = edge.canvas,
        parent = (this.wrapperEl = n.canvasEl.createDiv("canvas-path-label-wrapper"));
      parent.addEventListener("click", function (i) {
        if (!n.readonly) {
          if (i.shiftKey) {
            t.blur();
            return void n.toggleSelect(edge);
          }
          var r = n.selection;
          r.size === 1 && r.has(edge) ? t.isEditing || t.focus(Ll(i)) : n.selectOnly(edge);
        }
      });
      this.textareaEl = parent.createDiv(
        {
          parent: parent,
          cls: "canvas-path-label",
          text: this.edge.label,
          attr: {
            contentEditable: false,
            "data-placeholder": d4.promptAddText(),
          },
        },
        function (e) {
          e.addEventListener("input", function () {
            t.edge.label = e.innerText;
            t.edge.canvas.requestSave(!1);
          });
          t.edge.label ||
            setTimeout(function () {
              return t.focus();
            });
        },
      );
      this.render();
    }
    e.prototype.setText = function (e) {
      this.textareaEl.setText(e);
    };
    e.prototype.focus = function (e) {
      var t,
        n = this.textareaEl;
      this.isEditing = true;
      n.setAttr("contenteditable", !0);
      n.addClass("is-editing");
      e ? (t = n.doc.caretRangeFromPoint(e.x, e.y)) : (t = n.doc.createRange()).selectNodeContents(n);
      var i = n.win.getSelection();
      i.removeAllRanges();
      i.addRange(t);
      n.focus();
      this.initialTextState = this.edge.label || "";
    };
    e.prototype.blur = function () {
      var e = this.textareaEl;
      this.isEditing = false;
      e.blur();
      e.setAttr("contenteditable", !1);
      e.removeClass("is-editing");
      this.edge.label ? this.initialTextState !== this.edge.label && this.edge.canvas.requestSave() : this.destroy();
      this.initialTextState = "";
    };
    e.prototype.render = function () {
      var e = this.wrapperEl,
        t = this.edge.getCenter();
      e.style.transform = "translate(".concat(t.x, "px, ").concat(t.y, "px)");
      d6(e, this.edge.color);
      e.toggleClass("is-themed", !!this.edge.color);
    };
    e.prototype.destroy = function (e) {
      var t = this.edge;
      t.label && delete t.label;
      this.initialTextState && !e && t.canvas.requestSave();
      this.wrapperEl.remove();
      t.labelElement = null;
    };
    return e;
  })(),
  S4 = i18nProxy.plugins.canvas,
  M4 = (function (e) {
    function t(view, n) {
      var i = e.call(this, view.app) || this;
      i.emptyStateText = S4.msgNoGroupsFound();
      i.view = view;
      i.cb = n;
      i.setInstructions([
        {
          command: "↑↓",
          purpose: i18nProxy.plugins.templates.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: S4.instructionJumpToGroup(),
        },
        {
          command: "esc",
          purpose: i18nProxy.plugins.templates.instructionDismiss(),
        },
      ]);
      i.setPlaceholder(S4.actionJumpToGroup());
      i.scope.register(null, "Tab", function () {
        return !1;
      });
      return i;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return this.view.canvas.getData().nodes.filter(function (e) {
        return e.type === "group";
      });
    };
    t.prototype.onChooseItem = function (e) {
      this.cb(e);
    };
    t.prototype.getItemText = function (e) {
      return e.label || S4.labelUntitledGroup();
    };
    return t;
  })(FuzzySuggestModal),
  x4 = (function (e) {
    function t(app) {
      var n = e.call(this) || this;
      n.index = {};
      n.fileQueue = [];
      n.app = app;
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this.app.vault;
      this.registerEvent(e.on("create", this.onCreate, this));
      this.registerEvent(e.on("modify", this.onModify, this));
      this.registerEvent(e.on("rename", this.onRename, this));
      this.registerEvent(e.on("delete", this.onDelete, this));
      for (var t = 0, n = e.getFiles(); t < n.length; t++) {
        var i = n[t];
        if (this.canProcess(i)) {
          this.queue(i);
        }
      }
    };
    t.prototype.onunload = function () {
      this.index = {};
      this.fileQueue = [];
      this.frame && (this.frame.cancel(), (this.frame = null));
    };
    t.prototype.onCreate = function (e) {
      if (e instanceof TFile && this.canProcess(e)) {
        this.queue(e);
      }
    };
    t.prototype.onModify = function (e) {
      if (e instanceof TFile && this.canProcess(e)) {
        this.queue(e);
      }
    };
    t.prototype.onRename = function (e, t) {
      if (e instanceof TFile && this.canProcess(e)) {
        var n = this.index;
        if (n.hasOwnProperty(t)) {
          var i = n[t];
          delete n[t];
          n[e.path] = i;
        }
      }
    };
    t.prototype.onDelete = function (e) {
      var t = this.index;
      t.hasOwnProperty(e.path) && delete t[e.path];
      e instanceof TFile && this.fileQueue.remove(e);
    };
    t.prototype.queue = function (e) {
      this.fileQueue.contains(e) || this.fileQueue.push(e);
      this.requestFrame();
    };
    t.prototype.requestFrame = function () {
      if (!this.frame) {
        this.frame = Sc(this.run.bind(this), 100);
      }
    };
    t.prototype.run = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              if (!((e = this.fileQueue).length > 0)) return [3, 5];
              t = e.pop();
              r.label = 1;
            case 1:
              r.trys.push([1, 3, , 4]);
              return [4, this.process(t)];
            case 2:
              (n = r.sent()) && (this.index[t.path] = n);
              return [3, 4];
            case 3:
              i = r.sent();
              console.error("Failed to index ".concat(t.path), i);
              return [3, 4];
            case 4:
              this.frame = null;
              r.label = 5;
            case 5:
              e.length > 0 && this.requestFrame();
              return [2];
          }
        });
      });
    };
    t.prototype.get = function (e) {
      return this.getForPath(e.path);
    };
    t.prototype.getForPath = function (e) {
      return this.index.hasOwnProperty(e) ? this.index[e] : null;
    };
    t.prototype.getAll = function () {
      return this.index;
    };
    return t;
  })(Component),
  T4 = "canvas",
  D4 = "canvas",
  A4 = i18nProxy.plugins.canvas,
  P4 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.refNodeIds = new WeakMap();
      return t;
    }
    __extends(t, e);
    t.prototype.canProcess = function (e) {
      return e.extension === D4;
    };
    t.prototype.process = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, embeds, caches, a, s, l, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              return [4, this.app.vault.cachedRead(e)];
            case 1:
              if (!(t = p.sent())) return [2, null];
              if (((n = JSON.parse(t)), !(i = n.nodes) || !Array.isArray(i))) return [2, null];
              embeds = [];
              caches = {};
              a = this.refNodeIds;
              s = function (e) {
                var t, n, i;
                return __generator(this, function (s) {
                  switch (s.label) {
                    case 0:
                      return e.type !== "file"
                        ? [3, 1]
                        : (embeds.push({
                            file: e.file,
                            subpath: e.subpath,
                          }),
                          [3, 6]);
                    case 1:
                      return e.type === "group" && e.background
                        ? (embeds.push({
                            file: e.background,
                            subpath: "",
                          }),
                          [3, 6])
                        : [3, 2];
                    case 2:
                      if (e.type !== "text") return [3, 6];
                      t = e.text;
                      s.label = 3;
                    case 3:
                      s.trys.push([3, 5, , 6]);
                      return [4, l.parseText(t)];
                    case 4:
                      traverseLinksOrEmbeds((n = s.sent()), function (t) {
                        a.set(t, e.id);
                      });
                      caches[e.id] = n;
                      return [3, 6];
                    case 5:
                      i = s.sent();
                      console.error(i);
                      return [3, 6];
                    case 6:
                      return [2];
                  }
                });
              };
              l = this;
              c = 0;
              u = i;
              p.label = 2;
            case 2:
              return c < u.length ? ((h = u[c]), [5, s(h)]) : [3, 5];
            case 3:
              p.sent();
              p.label = 4;
            case 4:
              c++;
              return [3, 2];
            case 5:
              return [
                2,
                {
                  embeds: embeds,
                  caches: caches,
                },
              ];
          }
        });
      });
    };
    t.prototype.parseText = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return e.length < 5e3
                ? [2, parseDocumentMetadata(e)]
                : ((t = df(e)), [4, this.app.metadataCache.computeMetadataAsync(t)]);
            case 1:
              return [2, n.sent()];
          }
        });
      });
    };
    return t;
  })(x4),
  L4 = (function () {
    function e(app, canvas) {
      this.app = app;
      this.canvas = canvas;
    }
    e.prototype.iterateReferences = function (e) {
      var t = this.canvas.index.getAll(),
        n = function (n) {
          if (!t.hasOwnProperty(n)) return "continue";
          var i = t[n];
          for (var r in i.caches) {
            if (i.caches.hasOwnProperty(r))
              traverseLinksOrEmbeds(i.caches[r], function (t) {
                e(n, t);
              });
          }
        };
      for (var i in t) n(i);
    };
    e.prototype.applyUpdates = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              n = this.canvas.index.refNodeIds;
              r.label = 1;
            case 1:
              r.trys.push([1, 3, , 4]);
              return [
                4,
                this.app.vault.process(e, function (e) {
                  for (var i = JSON.parse(e), r = new tc(), o = 0, a = t; o < a.length; o++) {
                    var s = a[o],
                      l = n.get(s.reference);
                    if (l) {
                      r.add(l, s);
                    }
                  }
                  for (var c = 0, u = i.nodes; c < u.length; c++) {
                    var h = u[c];
                    if (h.type === "text") {
                      var p = r.get(h.id);
                      if (p) {
                        h.text = bx(h.text, p);
                      }
                    }
                  }
                  return sc(i);
                }),
              ];
            case 2:
              r.sent();
              return [3, 4];
            case 3:
              i = r.sent();
              console.error(i);
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.renameSubpath = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o, a, s, l, c, u, h, p, d, f, m, g;
        return __generator(this, function (v) {
          switch (v.label) {
            case 0:
              for (m in ((i = e.path), (r = []), (o = this.canvas.index.getAll())))
                if (o.hasOwnProperty(m))
                  for (a = o[m], s = 0, l = a.embeds; s < l.length; s++)
                    if ((c = l[s]).file === i && c.subpath)
                      if (((u = c.subpath.substring(1)), t.startsWith("^"))) {
                        if (u.toLowerCase() === t) {
                          r.push(m);
                          break;
                        }
                      } else if (stripHeading(u).toLowerCase() === t) {
                        r.push(m);
                        break;
                      }
              if (r.length === 0) return [2];
              new Notice("Canvas detected file renames affecting ".concat(r.length, " canvas files, updating..."));
              h = this.app.vault;
              p = 0;
              d = 0;
              f = r;
              v.label = 1;
            case 1:
              return d < f.length
                ? ((m = f[d]),
                  (g = h.getAbstractFileByPath(m)) instanceof TFile && g.extension === D4
                    ? [
                        4,
                        h.process(g, function (e) {
                          if (!e) return e;
                          for (var r = JSON.parse(e), o = 0, a = r.nodes; o < a.length; o++) {
                            var s = a[o];
                            if (s.type === "file" && s.file === i && s.subpath) {
                              var l = s.subpath.substring(1);
                              t.startsWith("^")
                                ? l.toLowerCase() === t && (s.subpath = "#" + n)
                                : stripHeading(l).toLowerCase() === t && (s.subpath = "#" + n);
                            }
                          }
                          return sc(r);
                        }),
                      ]
                    : [3, 3])
                : [3, 4];
            case 2:
              v.sent();
              v.label = 3;
            case 3:
              d++;
              return [3, 1];
            case 4:
              p > 0 && new Notice("Canvas updated ".concat(p, " embed cards."));
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  I4 = (function () {
    function e(app) {
      this.app = app;
    }
    e.prototype.load = function (e) {
      return e ? this.app.loadLocalStorage("canvas-" + e.path) : null;
    };
    e.prototype.save = function (e, t) {
      if (e) {
        this.app.saveLocalStorage("canvas-" + e.path, t);
      }
    };
    e.prototype.handleRename = function (e, t) {
      var n = this.app.loadLocalStorage("canvas-" + e);
      if (n) {
        this.remove(e);
        this.save(t, n);
      }
    };
    e.prototype.handleDelete = function (e) {
      this.remove(e.path);
    };
    e.prototype.remove = function (e) {
      this.app.saveLocalStorage("canvas-" + e, null);
    };
    return e;
  })(),
  O4 = (function () {
    function e() {
      var e = this;
      this.id = "canvas";
      this.name = A4.name();
      this.description = A4.desc();
      this.defaultOn = true;
      this.options = {};
      this.renames = [];
      this.renameQueue = new ix();
      this.requestProcessRename = debounce(
        function () {
          var t = e.renames;
          e.renames = [];
          e.renameQueue.queue(function () {
            return __awaiter(e, undefined, undefined, function () {
              var e, n, i, r, o, a, s, l, c, count, h, p, d, f;
              return __generator(this, function (m) {
                switch (m.label) {
                  case 0:
                    for (d in ((e = t.map(function (e) {
                      return e[0];
                    })),
                    (n = []),
                    (i = this.index.getAll())))
                      if (i.hasOwnProperty(d))
                        for (r = i[d], o = 0, a = r.embeds; o < a.length; o++)
                          if (((s = a[o]), e.contains(s.file))) {
                            n.push(d);
                            break;
                          }
                    if (n.length === 0) return [2];
                    (l = new Notice(
                      A4.msgUpdatingLinks({
                        count: n.length,
                      }),
                    )).containerEl.addClass("is-loading");
                    c = this.app.vault;
                    count = 0;
                    h = 0;
                    p = n;
                    m.label = 1;
                  case 1:
                    return h < p.length
                      ? ((d = p[h]),
                        (f = c.getAbstractFileByPath(d)) instanceof TFile
                          ? [
                              4,
                              c.process(f, function (e) {
                                if (!e) return e;
                                for (var n = JSON.parse(e), i = 0, r = n.nodes; i < r.length; i++) {
                                  var o = r[i];
                                  if (o.type === "file")
                                    for (var a = 0, s = t; a < s.length; a++) {
                                      var l = s[a];
                                      if (o.file === l[0]) {
                                        o.file = l[1];
                                        count++;
                                      }
                                    }
                                  else if (o.type === "group")
                                    for (var c = 0, h = t; c < h.length; c++) {
                                      l = h[c];
                                      if (o.background === l[0]) {
                                        o.background = l[1];
                                        count++;
                                      }
                                    }
                                }
                                return sc(n);
                              }),
                            ]
                          : [3, 3])
                      : [3, 4];
                  case 2:
                    m.sent();
                    m.label = 3;
                  case 3:
                    h++;
                    return [3, 1];
                  case 4:
                    count > 0 &&
                      (l.containerEl.removeClass("is-loading"),
                      l.containerEl.addClass("mod-success"),
                      l.setMessage(
                        A4.msgUpdatedLinks({
                          count: count,
                        }),
                      ));
                    return [2];
                }
              });
            });
          });
        },
        500,
        !0,
      );
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerViewType(T4, function (e) {
        return new F4(e, n);
      });
      plugin.registerGlobalCommand({
        id: "canvas:new-file",
        name: A4.commandCreateNewCanvas(),
        icon: "lucide-layout-dashboard",
        callback: function () {
          return __awaiter(n, undefined, undefined, function () {
            var t, n, i, r;
            return __generator(this, function (o) {
              switch (o.label) {
                case 0:
                  t = (r = this.app.workspace.getActiveFile()) === null || undefined === r ? undefined : r.path;
                  n = this.getNewFileParent(t);
                  return [4, this.createNewCanvasFile(n)];
                case 1:
                  i = o.sent();
                  return [
                    4,
                    app.workspace.getLeaf().openFile(i, {
                      eState: {
                        rename: "all",
                      },
                    }),
                  ];
                case 2:
                  o.sent();
                  return [2];
              }
            });
          });
        },
      });
      Platform.isDesktopApp &&
        plugin.registerGlobalCommand({
          id: "canvas:export-as-image",
          name: A4.actionExportPng(),
          icon: "lucide-image",
          checkCallback: function (e) {
            var t = n.app.workspace.getActiveViewOfType(F4);
            return !!t && (e || t.canvas.generateHDImage(), !0);
          },
        });
      plugin.registerGlobalCommand({
        id: "canvas:jump-to-group",
        name: A4.actionJumpToGroup(),
        icon: "lucide-move",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(F4);
          return (
            !!t &&
            (e ||
              new M4(t, function (e) {
                var n = j2(e);
                t.canvas.zoomToBbox(n);
              }).open(),
            !0)
          );
        },
      });
      plugin.registerGlobalCommand({
        id: "canvas:convert-to-file",
        name: A4.commandConvertToFile(),
        icon: "lucide-file-input",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(F4);
          if (t) {
            var i = t.canvas.selection;
            if (i.size === 1) {
              var r = i.values().next().value;
              if (r instanceof l4) {
                e || r.convertToFile();
                return !0;
              }
            }
          }
          return !1;
        },
      });
      plugin.registerRibbonItem(A4.commandCreateNewCanvas(), "lucide-layout-dashboard", function (t) {
        return __awaiter(n, undefined, undefined, function () {
          var n, i, r, o;
          return __generator(this, function (a) {
            switch (a.label) {
              case 0:
                n = (o = this.app.workspace.getActiveFile()) === null || undefined === o ? undefined : o.path;
                i = this.getNewFileParent(n);
                return [4, this.createNewCanvasFile(i)];
              case 1:
                r = a.sent();
                return [
                  4,
                  app.workspace.getLeaf(Keymap.isModEvent(t)).openFile(r, {
                    active: true,
                    eState: {
                      rename: "all",
                    },
                  }),
                ];
              case 2:
                a.sent();
                return [2];
            }
          });
        });
      });
      this.index = plugin.addChild(new P4(app));
      this.localDataManager = new I4(app);
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              t.registerEvent(e.vault.on("rename", this.onRename, this));
              t.registerEvent(e.vault.on("delete", this.onDelete, this));
              e.fileManager.linkUpdaters[D4] = new L4(e, this);
              t.register(function () {
                return delete e.fileManager.linkUpdaters[D4];
              });
              e.viewRegistry.registerExtensions([D4], T4);
              e.embedRegistry.registerExtension(D4, function (e, t, n) {
                return new R4(e, t, n);
              });
              e.fileManager.registerFileParentCreator(D4, this.getNewFileParent.bind(this));
              n = this;
              r = (i = Object).assign;
              o = [
                {
                  snapToObjects: true,
                  snapToGrid: !0,
                },
              ];
              return [4, t.loadData()];
            case 1:
              n.options = r.apply(i, o.concat([a.sent()]));
              t.addSettingTab(new B4(e, t, this));
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function (e) {
      e.viewRegistry.unregisterExtensions([D4]);
      e.embedRegistry.unregisterExtension(D4);
      e.fileManager.unregisterFileCreator(D4);
    };
    e.prototype.onExternalSettingsChange = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this;
              return [4, this.plugin.loadData()];
            case 1:
              e.options = t.sent() || {};
              this.rerenderCanvases();
              return [2];
          }
        });
      });
    };
    e.prototype.onUserDisable = function (e) {
      e.workspace.detachLeavesOfType(T4);
    };
    e.prototype.onDelete = function (e) {
      if (e instanceof TFile && e.extension === D4) {
        this.localDataManager.handleDelete(e);
      }
    };
    e.prototype.onRename = function (e, t) {
      if (e instanceof TFile) {
        e.extension === D4 && this.localDataManager.handleRename(t, e);
        this.renames.push([t, e.path]);
        this.requestProcessRename();
      }
    };
    e.prototype.onFileMenu = function (e, t, n, i) {
      var r = this;
      if (n === "file-explorer-context-menu" && t instanceof TFolder) {
        e.addItem(function (e) {
          return e
            .setSection("action-primary")
            .setIcon("lucide-layout-dashboard")
            .setTitle(A4.actionNewCanvas())
            .onClick(function (e) {
              return __awaiter(r, undefined, undefined, function () {
                var n, i;
                return __generator(this, function (r) {
                  switch (r.label) {
                    case 0:
                      return [4, this.createNewCanvasFile(t)];
                    case 1:
                      n = r.sent();
                      i = Keymap.isModEvent(e);
                      return [
                        4,
                        this.app.workspace.getLeaf(i).openFile(n, {
                          eState: {
                            rename: "all",
                          },
                        }),
                      ];
                    case 2:
                      r.sent();
                      return [2];
                  }
                });
              });
            });
        });
      }
    };
    e.prototype.getNewFileParent = function (e) {
      var t = this.app.vault,
        n = this.options,
        i = n.newFileLocation;
      if (i === "folder") {
        if ((o = n.newFileFolderPath) != null && (r = t.getAbstractFileByPath(o)) instanceof TFolder) return r;
      } else if (e && i === "current") {
        var r,
          o = Zc(e);
        if ((r = t.getAbstractFileByPath(o)) instanceof TFolder) return r;
      }
      return t.getRoot();
    };
    e.prototype.createNewCanvasFile = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (i) {
          return [2, this.app.fileManager.createNewFile(e, t, D4, n)];
        });
      });
    };
    e.prototype.saveOptions = function () {
      this.plugin.saveData(this.options);
    };
    e.prototype.rerenderCanvases = function () {
      for (var e = 0, t = this.app.workspace.getLeavesOfType(T4); e < t.length; e++) {
        var n = t[e].view;
        if (n instanceof F4) {
          n.canvas.rerenderViewport();
        }
      }
    };
    return e;
  })(),
  F4 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.icon = "lucide-layout-dashboard";
      i.hoverPopover = null;
      i.isPlaintext = false;
      i.plugin = plugin;
      i.canvas = new Y6(i);
      var r = (i.scope = new Scope(i.app.scope));
      r.register(["Mod"], "z", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.undo();
        }
      });
      r.register(["Mod"], "a", function (e) {
        if (!fG(e.targetNode)) {
          i.canvas.selectAll();
        }
      });
      var o = function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.redo();
        }
      };
      r.register(["Mod", "Shift"], "z", o);
      r.register(["Mod"], "y", o);
      r.register(["Shift"], "1", function (e) {
        if (!fG(e.targetNode)) {
          i.canvas.zoomToFit();
        }
      });
      r.register(["Shift"], "2", function (e) {
        if (!fG(e.targetNode)) {
          i.canvas.zoomToSelection();
        }
      });
      r.register([], "ArrowRight", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "right");
        }
      });
      r.register(["Shift"], "ArrowRight", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "right");
        }
      });
      r.register([], "ArrowLeft", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "left");
        }
      });
      r.register(["Shift"], "ArrowLeft", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "left");
        }
      });
      r.register([], "ArrowUp", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "up");
        }
      });
      r.register(["Shift"], "ArrowUp", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "up");
        }
      });
      r.register([], "ArrowDown", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "down");
        }
      });
      r.register(["Shift"], "ArrowDown", function (e) {
        if (!fG(e.targetNode)) {
          e.preventDefault();
          i.canvas.nudgeSelection(e, "down");
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              i.sent();
              t.viewState && this.canvas.setState(t.viewState);
              return [2];
          }
        });
      });
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.viewState = this.canvas.getState();
      return t;
    };
    t.prototype.setEphemeralState = function (t) {
      if (
        (e.prototype.setEphemeralState.call(this, t),
        t.focus &&
          this.canvas.wrapperEl.focus({
            preventScroll: !0,
          }),
        undefined !== t.match)
      ) {
        var n = this.canvas,
          i = t.match,
          r = i.nodeId,
          o = i.content,
          a = i.matches,
          s = r && n.nodes.get(r);
        if (
          s &&
          (n.selectOnly(s), n.panIntoView(s.getBBox()), s instanceof l4 && s.child instanceof c4 && a.length > 0)
        ) {
          var l = rc(o, a[0][0]);
          s.child.previewMode.renderer.applyScrollDelayed(l, {
            center: true,
            highlight: true,
          });
        }
      }
    };
    t.prototype.onResize = function () {
      this.canvas.onResize();
    };
    t.prototype.getViewType = function () {
      return T4;
    };
    t.prototype.getViewData = function () {
      return sc(this.canvas.data);
    };
    t.prototype.setViewData = function (e, t) {
      var n = this.canvas;
      if (
        (t && this.clear(),
        e
          ? (n.setData(JSON.parse(e)), t && ((n.zoomToFitQueued = true), n.onResize()))
          : (n.createPlaceholder(), n.requestFrame()),
        t)
      ) {
        var i = this.getLocalData();
        if (i && i.hasOwnProperty("readonly") && typeof i.readonly == "boolean") {
          n.setReadonly(i.readonly);
        }
      }
    };
    t.prototype.clear = function () {
      this.canvas.clear();
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          this.canvas.load();
          return [2, e.prototype.onOpen.call(this)];
        });
      });
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, e.prototype.onClose.call(this)];
            case 1:
              t.sent();
              this.canvas.unload();
              return [2];
          }
        });
      });
    };
    t.prototype.handleCut = function (e) {
      this.canvas.handleCut(e);
    };
    t.prototype.handleCopy = function (e) {
      this.canvas.handleCopy(e);
    };
    t.prototype.handlePaste = function (e) {
      this.canvas.handlePaste(e);
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      Platform.isDesktopApp &&
        t.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(A4.actionExportPng())
            .setIcon("lucide-image")
            .onClick(function () {
              return i.canvas.generateHDImage();
            });
        });
    };
    t.prototype.getLocalData = function () {
      return this.plugin.localDataManager.load(this.file);
    };
    t.prototype.saveLocalData = function () {
      var e = {};
      this.canvas.readonly && (e.readonly = true);
      Object.keys(e).length === 0 && (e = null);
      this.plugin.localDataManager.save(this.file, e);
    };
    return t;
  })(TextFileView);
function N4(e, t) {
  var n;
  try {
    n = JSON.parse(t);
  } catch (e) {
    return;
  }
  var i = n.nodes,
    r = n.edges;
  if (i && i.length !== 0) {
    if (!r) {
      r = [];
    }
    for (var o = createSvg("svg", "canvas-minimap"), a = {}, s = [], l = 0, c = i; l < c.length; l++) {
      var u = j2((T = c[l]));
      a[T.id] = u;
      s.push(u);
    }
    for (
      var h = K2(s),
        p = function (e) {
          d6(
            o.createSvg("rect", {
              attr: {
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height,
                rx: "20",
                ry: "20",
              },
            }),
            e.color,
          );
        },
        d = 0,
        f = i;
      d < f.length;
      d++
    ) {
      if ((T = f[d]).type === "group") {
        p(T);
      }
    }
    for (var m = Math.sqrt((h.maxX - h.minX) / 10), g = 0, v = r; g < v.length; g++) {
      var y = v[g],
        b = a[y.fromNode],
        w = a[y.toNode];
      if (b && w) {
        var k = y.fromSide,
          C = y.toSide,
          E = y4(m4(b, k), k, m4(w, C), C),
          S = o.createSvg("path", {
            attr: {
              d: E.path,
            },
          });
        S.style.strokeWidth = String(m);
        d6(S, y.color);
      }
    }
    for (var M = 0, x = i; M < x.length; M++) {
      var T;
      if ((T = x[M]).type !== "group") {
        p(T);
      }
    }
    h = Y2(h, Math.max(h.maxX - h.minX, h.maxY - h.minY) / 20);
    o.setAttr(
      "viewBox",
      ""
        .concat(h.minX, " ")
        .concat(h.minY, " ")
        .concat(h.maxX - h.minX, " ")
        .concat(h.maxY - h.minY),
    );
    e.appendChild(o);
  }
}