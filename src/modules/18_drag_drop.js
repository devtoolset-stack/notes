var B0 = (function () {
    function e(e, t) {
      var n = this;
      t.addClass("webviewer-address-container");
      var i = t.createDiv("webviewer-address");
      this.addrInputEl = i.createEl("input", {
        type: "text",
      });
      this.addrInputEl.setAttr("spellcheck", !1);
      this.suggest = new V0(e, this.addrInputEl);
      var value = "";
      this.addrInputEl.addEventListener("focus", function () {
        t.win.setTimeout(function () {
          return n.addrInputEl.select();
        }, 100);
        value = n.addrInputEl.value;
        n.suggest.open();
      });
      this.addrInputEl.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          e.preventDefault();
          n.addrInputEl.blur();
          n.addrInputEl.value = value;
        }
      });
    }
    e.prototype.setValue = function (e) {
      this.addrInputEl.value = e || "";
    };
    e.prototype.focus = function () {
      this.addrInputEl.focus();
    };
    return e;
  })(),
  V0 = (function (e) {
    function t(webview, inputEl) {
      var i = e.call(this, webview.app, inputEl) || this;
      i.webview = webview;
      i.inputEl = inputEl;
      i.scope.register([], "Escape", function () {
        i.close();
      });
      return i;
    }
    __extends(t, e);
    t.prototype.selectSuggestion = function (e, t) {
      this.inputEl.blur();
      this.webview.navigate(e.url, !0);
      this.close();
    };
    t.prototype.getSuggestions = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var query, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w, matches;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              query = e;
              e = e.toLowerCase();
              n = [e];
              (i = {})["about:blank"] = {
                url: "about:blank",
                title: "Blank",
                type: "about",
              };
              r = 0;
              return [4, this.webview.plugin.db.getHistoryItems()];
            case 1:
              o = b.sent();
              b.label = 2;
            case 2:
              if (!(r < o.length)) return [3, 4];
              a = o[r];
              i[a.url] ||
                (i[a.url] = {
                  url: a.url,
                  title: a.title,
                  type: "history",
                });
              b.label = 3;
            case 3:
              r++;
              return [3, 2];
            case 4:
              if ((s = this.app.internalPlugins.getEnabledPluginById("bookmarks")))
                for (
                  l = s.getBookmarks(),
                    c = l.filter(function (e) {
                      return e.type === "url";
                    }),
                    u = 0,
                    h = c;
                  u < h.length;
                  u++
                ) {
                  p = h[u];
                  i[p.url] = {
                    url: p.url,
                    title: p.title,
                    type: "bookmark",
                  };
                }
              for (d = [], f = false, m = 0, g = Object.values(i); m < g.length; m++) {
                v = g[m];
                y = {
                  title: v.title,
                  url: v.url,
                  type: v.type,
                  score: 0,
                  matches: null,
                };
                e !== ""
                  ? (v.url.toLowerCase() === e && (f = true),
                    (w = "".concat(v.title, " ").concat(v.url).toLowerCase()),
                    (matches = Gx(n, w)) &&
                      ((y.matches = matches), (y.score = qx(matches, e.length, w.length, 0)), d.push(y)))
                  : d.push(y);
              }
              return f || e === ""
                ? [2, d]
                : e.startsWith("http://") || e.startsWith("https://")
                  ? (d.unshift({
                      title: "",
                      url: query,
                      score: 100,
                      matches: null,
                      type: "typed",
                    }),
                    [2, d])
                  : ((C = /([^\/?#]+)/.exec(e)[0]),
                    -1 !== (E = C.lastIndexOf(".")) && E !== C.length - 1
                      ? (d.unshift({
                          title: "",
                          url: "https://" + query,
                          score: 100,
                          matches: null,
                          type: "typed",
                        }),
                        [2, d])
                      : (d.unshift({
                          title: i18nProxy.plugins.webViewer.actionSearchForQuery({
                            query: query,
                          }),
                          url: this.webview.plugin.getSearchEngineUrl(query),
                          score: 100,
                          matches: null,
                          type: "search",
                        }),
                        [2, d]));
          }
          var C, E;
        });
      });
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n = this;
      t.addClass("mod-complex");
      t.addClass("webviewer-addressbar-suggestion");
      var i = t.createDiv("suggestion-icon"),
        r = t.createDiv("suggestion-content"),
        o = t.createDiv("suggestion-aux");
      if (
        (e.type === "search"
          ? i.createSpan(
              {
                cls: "suggestion-flair-left",
              },
              function (e) {
                setIcon(e, "lucide-search");
              },
            )
          : (e.type !== "history" && e.type !== "bookmark") ||
            i.createSpan(
              {
                cls: "suggestion-flair-left",
              },
              function (t) {
                n.webview.plugin.db.setIcon(t, e.url);
              },
            ),
        e.type === "bookmark" &&
          o.createSpan(
            {
              cls: "suggestion-flair",
            },
            function (e) {
              setIcon(e, "lucide-bookmark");
            },
          ),
        renderMatches(r.createDiv("suggestion-title"), e.title, e.matches),
        e.type !== "search")
      ) {
        renderMatches(r.createDiv("suggestion-url"), e.url, e.matches, -(e.title.length + 1));
      }
    };
    t.prototype.reposition = function (t) {
      e.prototype.reposition.call(this, t);
      var width = (t.right - t.left).toString() + "px";
      this.suggestEl.style.width = width;
      this.suggestEl.style.maxWidth = width;
    };
    return t;
  })(AbstractInputSuggest),
  H0 = function (e) {
    this.vChildren = new YF(this);
    this.info = {
      height: 0,
      width: 0,
      childLeft: 0,
      childLeftPadding: 0,
      childTop: 0,
      computed: false,
      queued: false,
      hidden: false,
      next: false,
    };
    this.pusherEl = rN();
    this.el = e;
    this.childrenEl = e.createDiv();
  },
  z0 = (function () {
    function e(view, t) {
      var n = this;
      this.activeDom = null;
      this.focusedItem = null;
      this.selectedDoms = new Set();
      this.prefersCollapsed = false;
      this.isAllCollapsed = true;
      this.requestSaveFolds = debounce(this.saveFolds.bind(this), 200);
      this.id = t.id;
      this.app = t.app;
      this.view = view;
      this.scope = t.scope;
      this.handleDeleteSelectedItems = t.handleDeleteSelectedItems;
      this.handleCollapseAll = t.handleCollapseAll;
      this.handleRenameFocusedItem = t.handleRenameFocusedItem;
      this.containerEl = t.containerEl;
      this.getNodeId = t.getNodeId;
      this.infinityScroll = new aN(t.containerEl);
      this.infinityScroll.rootEl = new H0(t.containerEl);
      this.initializeKeyboardNav();
      this.containerEl.addEventListener("click", function (e) {
        if (e.target === n.containerEl) {
          n.clearSelectedDoms();
          n.setFocusedItem(null, !1);
        }
      });
    }
    e.prototype.isItem = function (e) {
      return !(e && e instanceof H0) && !!e;
    };
    Object.defineProperty(e.prototype, "root", {
      get: function () {
        return this.infinityScroll.rootEl;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.initializeKeyboardNav = function () {
      this.scope.register([], "ArrowDown", this.onKeyArrowDown.bind(this));
      this.scope.register(["Shift"], "ArrowDown", this.onKeyArrowDown.bind(this));
      this.scope.register(["Mod"], "ArrowDown", this.onKeyArrowDown.bind(this));
      this.scope.register([], "ArrowUp", this.onKeyArrowUp.bind(this));
      this.scope.register(["Shift"], "ArrowUp", this.onKeyArrowUp.bind(this));
      this.scope.register(["Mod"], "ArrowUp", this.onKeyArrowUp.bind(this));
      this.scope.register([], "ArrowLeft", this.onKeyArrowLeft.bind(this));
      this.scope.register(["Mod"], "ArrowLeft", this.onKeyArrowLeft.bind(this));
      this.scope.register([], "ArrowRight", this.onKeyArrowRight.bind(this));
      this.scope.register(["Mod"], "ArrowRight", this.onKeyArrowRight.bind(this));
      Platform.isMacOS && this.handleRenameFocusedItem
        ? this.scope.register([], "Enter", this.handleRenameFocusedItem.bind(this))
        : this.scope.register([], "Enter", this.onKeyOpen.bind(this));
      this.scope.register([], " ", this.onKeyOpen.bind(this));
      this.handleRenameFocusedItem && this.scope.register([], "F2", this.handleRenameFocusedItem.bind(this));
      this.scope.register(["Mod"], "Enter", this.onKeyOpen.bind(this));
      this.handleDeleteSelectedItems &&
        (Platform.isMacOS
          ? this.scope.register(["Mod"], "Backspace", this.handleDeleteSelectedItems.bind(this))
          : this.scope.register([], "Delete", this.handleDeleteSelectedItems.bind(this)));
    };
    e.prototype.toggleCollapseAll = function () {
      this.setCollapseAll(!this.isAllCollapsed);
    };
    e.prototype.setCollapseAll = function (isAllCollapsed) {
      var t;
      if (this.isAllCollapsed !== isAllCollapsed) {
        this.isAllCollapsed = isAllCollapsed;
        QF(this.root, function (t) {
          ZF(t) && t.setCollapsed(isAllCollapsed, !1);
        });
        (t = this.handleCollapseAll) === null || undefined === t || t.call(this, isAllCollapsed);
        this.requestSaveFolds();
      }
    };
    e.prototype.onResize = function () {
      this.infinityScroll.onResize();
    };
    e.prototype.handleItemSelection = function (e, activeDom) {
      var n = this,
        i = n.selectedDoms,
        r = n.activeDom,
        o = n.view;
      if (!Keymap.isModEvent(e)) {
        if (e.altKey && !e.shiftKey) {
          this.app.workspace.setActiveLeaf(o.leaf, {
            focus: !0,
          });
          i.has(activeDom)
            ? this.deselectItem(activeDom)
            : (this.selectItem(activeDom), this.setFocusedItem(activeDom, !1), (this.activeDom = activeDom));
          return !0;
        }
        if (e.shiftKey) {
          this.app.workspace.setActiveLeaf(o.leaf, {
            focus: !0,
          });
          for (var a = 0, s = r ? $F(r, activeDom) : [activeDom]; a < s.length; a++) {
            var l = s[a];
            this.selectItem(l);
          }
          return !0;
        }
        if (activeDom.selfEl.hasClass("is-being-renamed")) return !0;
        if (!(e.instanceOf(PointerEvent) && e.pointerType === "touch") && activeDom.selfEl.hasClass("is-active")) {
          this.app.workspace.setActiveLeaf(o.leaf, {
            focus: !0,
          });
          this.setFocusedItem(activeDom, !1);
          return !0;
        }
      }
      e.instanceOf(MouseEvent) && (this.clearSelectedDoms(), this.setFocusedItem(null));
      this.activeDom = activeDom;
      return !1;
    };
    e.prototype.clearSelectedDoms = function () {
      this.selectedDoms.forEach(function (e) {
        e.selfEl.removeClass("is-selected");
      });
      this.selectedDoms.clear();
    };
    e.prototype.deselectItem = function (e) {
      if (this.isItem(e) && this.selectedDoms.has(e)) {
        this.selectedDoms.delete(e);
        e.selfEl.removeClass("is-selected");
      }
    };
    e.prototype.selectItem = function (e) {
      if (this.isItem(e) && !this.selectedDoms.has(e)) {
        this.selectedDoms.add(e);
        e.selfEl.addClass("is-selected");
      }
    };
    e.prototype.onKeyOpen = function (e) {
      if (this.isItem(this.focusedItem)) {
        this.focusedItem.onSelfClick(e);
      }
    };
    e.prototype.onKeyArrowUp = function (e) {
      e.preventDefault();
      var t = this.focusedItem;
      this.changeFocusedItem("backwards");
      !(ZF(this.focusedItem) && this.focusedItem.collapsible) &&
        Keymap.isModEvent(e) &&
        this.onKeyOpen(
          createKeyboardEvent(e, {
            metaKey: !1,
          }),
        );
      e.shiftKey && (this.selectItem(t), this.selectItem(this.focusedItem));
    };
    e.prototype.onKeyArrowDown = function (e) {
      e.preventDefault();
      clearFocusAndSelection();
      var t = this.focusedItem;
      this.changeFocusedItem("forwards");
      !(ZF(this.focusedItem) && this.focusedItem.collapsible) &&
        Keymap.isModEvent(e) &&
        this.onKeyOpen(
          createKeyboardEvent(e, {
            metaKey: !1,
          }),
        );
      e.shiftKey && (this.selectItem(t), this.selectItem(this.focusedItem));
    };
    e.prototype.onKeyArrowLeft = function (e) {
      var t;
      if (!isContentEditable(e.targetNode) && (e.preventDefault(), this.focusedItem))
        if (this.focusedItem !== this.root) {
          if (ZF(this.focusedItem) && this.focusedItem.collapsible)
            this.focusedItem.collapsed
              ? ZF(this.focusedItem.parent) && this.setFocusedItem(this.focusedItem.parent)
              : this.focusedItem.setCollapsed(!0, !0);
          else {
            if (this.focusedItem.parent === this.root) return void this.setCollapseAll(!0);
            this.focusedItem.parent.setCollapsed(!0, !0);
          }
          for (var n = this.focusedItem; (t = n.parent) === null || undefined === t ? undefined : t.collapsed; )
            n = n.parent;
          this.setFocusedItem(n);
        } else this.setCollapseAll(!0);
    };
    e.prototype.onKeyArrowRight = function (e) {
      if (!isContentEditable(e.targetNode)) {
        e.preventDefault();
        var t = this.focusedItem;
        if (t && ZF(t)) {
          t.collapsed ? t.setCollapsed(!1, !0) : t.vChildren.hasChildren() && this.changeFocusedItem("forwards");
        }
      }
    };
    e.prototype.setFocusedItem = function (focusedItem, t) {
      undefined === t && (t = true);
      focusedItem !== this.root &&
        (this.isItem(this.focusedItem) && this.focusedItem.selfEl.removeClass("has-focus"),
        (this.focusedItem = focusedItem),
        focusedItem &&
          this.isItem(focusedItem) &&
          (focusedItem.selfEl.addClass("has-focus"), t && this.infinityScroll.scrollIntoView(focusedItem)));
    };
    e.prototype.changeFocusedItem = function (e) {
      if (
        ((this.focusedItem && !this.focusedItem.info.hidden) ||
          (this.activeDom
            ? (this.focusedItem = this.activeDom)
            : this.selectedDoms.size
              ? (this.focusedItem = Array.from(this.selectedDoms).last())
              : (this.focusedItem = this.root)),
        this.focusedItem !== this.root || e !== "backwards")
      ) {
        var t = e === "forwards" ? eN(this.focusedItem, !0) : nN(this.focusedItem, !0);
        if (t) {
          this.setFocusedItem(t);
        }
      } else this.setFocusedItem(iN(this.root, !0));
    };
    e.prototype.getFoldKey = function () {
      return this.prefersCollapsed ? this.id + "-unfold" : this.id + "-folds";
    };
    e.prototype.loadFolds = function () {
      var e = this;
      if (this.getNodeId) {
        var t = new Set(this.app.loadLocalStorage(this.getFoldKey())),
          n = !this.prefersCollapsed;
        QF(this.root, function (i) {
          if (ZF(i) && t.has(e.getNodeId(i))) {
            i.setCollapsed(n, !1);
          }
        });
      }
    };
    e.prototype.saveFolds = function () {
      var e = this;
      if (this.getNodeId && this.app.workspace.layoutReady) {
        var t = [];
        QF(this.root, function (n) {
          if (ZF(n) && n.collapsed !== e.prefersCollapsed) {
            t.push(e.getNodeId(n));
          }
        });
        this.app.saveLocalStorage(this.getFoldKey(), t);
      }
    };
    return e;
  })();
function q0(e, t) {
  var n = null,
    i = t.root,
    r = (function (e) {
      if (!e) return null;
      for (var t = eN(e, !0); t.info.hidden; ) t = eN(e, !0);
      return t;
    })(i),
    o = iN(i, !0),
    a = r.selfEl.offsetLeft;
  return !i.vChildren.hasChildren() || (r.selfEl.isShown() && e.clientY < r.selfEl.getBoundingClientRect().top)
    ? {
        node: null,
        idx: 0,
        placement: "before",
        x: a,
        y: r.selfEl.offsetTop,
      }
    : o.selfEl.isShown() && e.clientY > o.selfEl.getBoundingClientRect().bottom
      ? {
          node: null,
          idx: i.vChildren.children.length,
          placement: "after",
          x: a,
          y: o.selfEl.offsetTop + o.selfEl.offsetHeight,
        }
      : (QF(
          i,
          function (node) {
            if (!node.info.hidden && node.selfEl.isShown()) {
              if (t.selectedDoms.has(node)) return !0;
              var o = node.selfEl,
                s = o.getBoundingClientRect(),
                l = 2 * s.height,
                c = s.bottom - e.clientY;
              if (c < l && e.clientY >= s.top) {
                l = c;
                var u = s.height / 2,
                  h = s.top + u,
                  p = Math.abs(e.clientY - h),
                  placement = e.clientY > h ? "after" : "before",
                  parentNode = null,
                  overlapsNode = false,
                  g = 0;
                ZF(node) && node.collapsible && p / u < 0.9 && ((overlapsNode = true), (placement = "after"));
                ZF(node) && !node.collapsed && placement === "after"
                  ? ((parentNode = node), (g = 0))
                  : (node.parent && ZF(node.parent)
                      ? (g = (parentNode = node.parent).vChildren.children.indexOf(node))
                      : ((parentNode = null), (g = t.root.vChildren.children.indexOf(node))),
                    placement === "after" && g++);
                var v = a,
                  y = placement === "before" ? o.offsetTop : o.offsetTop + s.height;
                parentNode && parentNode !== i && (v = parentNode.info.childLeft + parentNode.info.childLeftPadding);
                n = {
                  node: node,
                  parentNode: parentNode,
                  overlapsNode: overlapsNode,
                  idx: g,
                  placement: placement,
                  x: v,
                  y,
                };
              }
            }
          },
          !0,
        ),
        n);
}
var W0 = createDiv("drop-indicator is-active"),
  U0 = debounce(function (e) {
    var t = e.x,
      n = e.y,
      i = e.placement;
    W0.style.left = t + "px";
    W0.style.top = n + (i === "after" ? 1 : -1) - 2 + "px";
  }, 0),
  _0 = null,
  j0 = null;
function G0(e, t, n, i) {
  var r = e.containerEl.win;
  if ((j0 == null || j0.removeClass("is-being-dragged-over"), !i)) {
    W0.detach();
    return void (j0 = null);
  }
  if (t && t.overlapsNode && ZF(t.node) && !n.contains(t.node)) {
    var o = t.node;
    o.selfEl !== j0 && (r.clearTimeout(_0), (_0 = null));
    (j0 = o.selfEl) == null || j0.addClass("is-being-dragged-over");
    o.collapsed &&
      !_0 &&
      (_0 = r.setTimeout(function () {
        if (j0 === o.selfEl) {
          o.setCollapsed(!1, !0);
        }
      }, 750));
  } else j0 = null;
  if (t) {
    W0.parentNode !== e.containerEl && e.containerEl.prepend(W0);
    U0(t);
  }
  var a = t && !j0;
  if (a && e.selectedDoms.size === 1) {
    var s = t.node,
      l = t.placement,
      c = e.selectedDoms.values().next().value;
    if (s === c || (l === "after" && s && s === tN(c)) || (l === "before" && s && s === JF(c))) {
      a = false;
    }
  }
  W0.toggle(a);
  return W0;
}
var K0 = i18nProxy.plugins.webViewer,
  Y0 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.icon = "lucide-clock";
      i.itemDoms = new Map();
      i.requestUpdate = debounce(i.update.bind(i), 100);
      i.plugin = plugin;
      i.scope = new Scope(i.app.scope);
      i.tree = new z0(i, {
        app: i.app,
        containerEl: i.contentEl,
        id: $0,
        scope: i.scope,
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.registerEvent(this.app.workspace.on("webviewer:update-history", this.requestUpdate, this));
    };
    t.prototype.getViewType = function () {
      return $0;
    };
    t.prototype.getDisplayText = function () {
      return K0.historyName();
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(K0.actionClearHistory())
          .setIcon("lucide-eraser")
          .onClick(function (e) {
            i.plugin.db.clearHistoryItems();
          });
      });
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.update();
          return [2];
        });
      });
    };
    t.prototype.onResize = function () {
      this.tree.infinityScroll.onResize();
    };
    t.prototype.update = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, itemDoms, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return [4, this.plugin.db.getHistoryItems()];
            case 1:
              for (e = s.sent(), t = [], itemDoms = new Map(), i = 0, r = e; i < r.length; i++) {
                o = r[i];
                (a = this.itemDoms.get(o.id)) || (a = new Z0(this.app, this.plugin, o));
                t.push(a);
                itemDoms.set(o.id, a);
              }
              this.itemDoms = itemDoms;
              this.tree.root.vChildren.setChildren(t);
              this.tree.infinityScroll.queueCompute();
              return [2];
          }
        });
      });
    };
    return t;
  })(ItemView),
  Z0 = (function (e) {
    function t(app, plugin, item) {
      var r = e.call(this) || this;
      r.vChildren = new YF(r);
      r.pusherEl = rN();
      r.info = {
        height: 0,
        width: 0,
        childLeft: 0,
        childLeftPadding: 0,
        childTop: 0,
        computed: false,
        queued: false,
        hidden: false,
        next: false,
      };
      r.app = app;
      r.plugin = plugin;
      r.item = item;
      var o = r.selfEl.createDiv({
        cls: "tree-item-icon",
        prepend: !0,
      });
      r.plugin.db.setIcon(o, item.url);
      r.titleEl = r.innerEl.createDiv("tree-item-inner-text webviewer-history-view-item");
      r.titleEl.setText(item.title || item.url);
      r.selfEl.addEventListener("contextmenu", r.onContextMenu.bind(r));
      r.setClickable(!0);
      return r;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      this.app.workspace.getLeaf(Keymap.isModEvent(e)).setViewState({
        type: typeQ00,
        state: {
          url: this.item.url,
          title: this.item.title,
          navigate: true,
        },
      });
    };
    t.prototype.onContextMenu = function (e) {
      var t = this;
      if (!e.defaultPrevented) {
        var n = new Menu().addSections(["action", "danger"]);
        n.addItem(function (e) {
          return e
            .setTitle(K0.actionCopyURL())
            .setIcon("lucide-copy")
            .setSection("action")
            .onClick(function () {
              navigator.clipboard.writeText(t.item.url);
            });
        });
        n.addItem(function (e) {
          return e
            .setTitle(K0.actionRemoveFromHistory())
            .setIcon("lucide-trash-2")
            .setSection("danger")
            .setWarning(!0)
            .onClick(function () {
              t.plugin.db.removeHistoryItem(t.item);
            });
        });
        n.showAtMouseEvent(e);
      }
    };
    return t;
  })(w_),
  X0 = (function () {
    function e(app) {
      this.db = null;
      this.app = app;
    }
    e.prototype.connect = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this;
              return [
                4,
                EX(this.app.appId + "-webview", 1, {
                  upgrade: function (e, t, n, i) {
                    e.objectStoreNames.contains("icons") || e.createObjectStore("icons");
                    e.objectStoreNames.contains("history") ||
                      e.createObjectStore("history", {
                        keyPath: "id",
                        autoIncrement: true,
                      });
                  },
                }),
              ];
            case 1:
              e.db = t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.getHistoryItems = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return this.db ? [4, this.db.getAll("history")] : [2, []];
            case 1:
              return [2, e.sent().reverse()];
          }
        });
      });
    };
    e.prototype.addHistoryItem = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              return this.db
                ? [4, (n = this.db.transaction("history", "readonly")).objectStore("history").openCursor(null, "prev")]
                : [2];
            case 1:
              return (i = c.sent()) && i.value.url === e
                ? (n.commit(), [2])
                : (n.commit(),
                  (r = {
                    title: t || "",
                    url: e,
                    accessTs: Date.now(),
                  }),
                  [4, this.db.put("history", r)]);
            case 2:
              o = c.sent();
              r.id = o;
              return [4, this.db.getAllKeys("history")];
            case 3:
              (a = c.sent()).length > 1e3 &&
                ((s = a.length - 1e3), (l = a[s - 1]), this.db.delete("history", IDBKeyRange.upperBound(l)));
              this.app.workspace.trigger("webviewer:update-history");
              return [2];
          }
        });
      });
    };
    e.prototype.removeHistoryItem = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.db.delete("history", e.id)];
            case 1:
              t.sent();
              this.app.workspace.trigger("webviewer:update-history");
              return [2];
          }
        });
      });
    };
    e.prototype.clearHistoryItems = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.db.delete("history", IDBKeyRange.lowerBound(0, !0))];
            case 1:
              e.sent();
              this.app.workspace.trigger("webviewer:update-history");
              return [2];
          }
        });
      });
    };
    e.prototype.setIcon = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, src;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              i = (function (e) {
                var t = e.toLowerCase().match(/^https?:\/\/([^\/?#]+)/);
                if (t) return t[1];
              })(t);
              return i ? [4, this.loadIcon(i, n)] : [3, 2];
            case 1:
              if ((src = o.sent())) {
                e.createEl("img").src = src;
                return [2];
              }
              o.label = 2;
            case 2:
              setIcon(e, "globe-2");
              return [2];
          }
        });
      });
    };
    e.prototype.loadIcon = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return this.db ? [4, this.db.get("icons", e)] : [2, null];
            case 1:
              return (n = i.sent()) ? [2, n == null ? undefined : n.base64] : [2, this.storeIcon(e, t)];
          }
        });
      });
    };
    e.prototype.storeIcon = function (e, source) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, base64;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              if (!source) return [2, null];
              s.label = 1;
            case 1:
              s.trys.push([1, 3, , 4]);
              return [4, requestUrl(source)];
            case 2:
              n = s.sent();
              i = n.headers["content-type"];
              r = Array.from(new Uint8Array(n.arrayBuffer));
              o = btoa(String.fromCharCode.apply(null, r));
              base64 = "data:".concat(i, ";base64,").concat(o);
              this.db.put(
                "icons",
                {
                  source: source,
                  base64: base64,
                },
                e,
              );
              return [2, base64];
            case 3:
              s.sent();
              return [2, null];
            case 4:
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  typeQ00 = "webviewer",
  $0 = "webviewer-history",
  J0 = "duckduckgo",
  e2 = i18nProxy.plugins.webViewer,
  t2 = {
    duckduckgo: {
      display: "DuckDuckGo",
      url: "https://duckduckgo.com/?q=%s",
    },
    brave: {
      display: "Brave",
      url: "https://search.brave.com/search?q=%s",
    },
    bing: {
      display: "Bing",
      url: "https://www.bing.com/search?q=%s",
    },
    google: {
      display: "Google",
      url: "https://www.google.com/search?q=%s",
    },
    custom: {
      display: "custom",
    },
  },
  n2 = {
    openExternalURLs: true,
    enableAdblocking: !0,
  },
  i2 = (function () {
    function e() {
      this.id = "webviewer";
      this.name = e2.name();
      this.description = e2.desc();
      this.defaultOn = false;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      this.db = new X0(app);
      plugin.registerGlobalCommand({
        id: "webviewer:open",
        name: e2.actionOpen(),
        callback: function () {
          n.app.workspace.getLeaf(!0).setViewState({
            type: typeQ00,
            active: true,
            state: {
              url: n.options.homepage || "about:blank",
            },
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:open-history",
        name: e2.actionShowHistory(),
        icon: "lucide-clock",
        callback: function () {
          n.app.workspace.ensureSideLeaf($0, "left", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:toggle-reader-mode",
        name: e2.actionToggleReaderMode(),
        icon: "glasses",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return !!t && (e || t.toggleReaderMode(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:focus-address-bar",
        name: e2.actionFocusAddressBar(),
        icon: "text-cursor-input",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return !!t && (e || t.addressBar.focus(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:zoom-in",
        name: i18nProxy.commands.zoomIn(),
        icon: "zoom-in",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return !!t && (e || t.zoomIn(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:zoom-reset",
        name: i18nProxy.commands.resetZoom(),
        icon: "rotate-cw",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return !!t && (e || t.zoomReset(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:zoom-out",
        name: i18nProxy.commands.zoomOut(),
        icon: "zoom-in",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return !!t && (e || t.zoomOut(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:search",
        name: e2.actionSearchTheWeb(),
        icon: "search",
        callback: function () {
          new a2(n.app, n).open();
        },
      });
      plugin.registerGlobalCommand({
        id: "webviewer:save-to-vault",
        name: e2.actionSaveToVault(),
        icon: "lucide-file-down",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(h2);
          return (
            !!t &&
            (e ||
              t.saveAsMarkdown().then(function (e) {
                if (e) {
                  n.app.workspace.getLeaf("tab").openFile(e);
                }
              }),
            !0)
          );
        },
      });
      plugin.registerViewType(typeQ00, function (e) {
        return new h2(e, n);
      });
      plugin.registerViewType($0, function (e) {
        return new Y0(e, n);
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t.registerEvent(e.workspace.on("url-menu", this.onUrlMenu, this));
              n = this.handleOpenUrl.bind(this);
              window.addEventListener("open-url", n);
              t.register(function () {
                window.removeEventListener("open-url", n);
              });
              i = this;
              o = (r = Object).assign;
              a = [n2];
              return [4, t.loadData()];
            case 1:
              i.options = o.apply(r, a.concat([s.sent()]));
              t.addSettingTab(new r2(e, t, this));
              this.updateSession();
              this.db.connect();
              return [2];
          }
        });
      });
    };
    e.prototype.saveOptions = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2, this.plugin.saveData(this.options)];
        });
      });
    };
    e.prototype.onUrlMenu = function (e, t) {
      var n = this;
      if (this.options.openExternalURLs) {
        e.addItem(function (e) {
          return e
            .setTitle(i18nProxy.plugins.webViewer.actionOpenLinkWebViewer())
            .setIcon("lucide-globe-2")
            .setSection("open")
            .onClick(function (e) {
              n.openUrl(t, Keymap.isModEvent(e));
            });
        });
      }
    };
    e.prototype.getSearchEngineUrl = function (e) {
      var t,
        n =
          this.options.searchEngine === "custom"
            ? this.options.customSearchEngine
            : (t = t2[this.options.searchEngine]) === null || undefined === t
              ? undefined
              : t.url;
      n || (n = t2[J0].url);
      return n.replace("%s", encodeURIComponent(e));
    };
    e.prototype.updateSession = function () {
      electron.ipcRenderer.send(
        "create-browser-session",
        this.app.getWebviewPartition(),
        this.options.enableAdblocking,
      );
    };
    e.prototype.handleOpenUrl = function (e) {
      if (this.options.openExternalURLs) {
        var t = e.detail,
          n = t.url,
          i = t.leaf,
          r = t.active,
          o = activeDocument.querySelector(".modal-container") !== null ? "window" : i;
        e.preventDefault();
        this.openUrl(n, o, r);
      }
    };
    e.prototype.openUrl = function (title, t, active) {
      if (undefined === active) {
        active = true;
      }
      var i = this.app.workspace.getLeaf(t);
      if (!(i == null)) {
        i.setViewState({
          type: typeQ00,
          active: active,
          state: {
            url: title,
            title: title,
            navigate: !0,
          },
        });
      }
    };
    return e;
  })(),
  r2 = (function (e) {
    function t(t, n, instance) {
      var r = e.call(this, t, n) || this;
      r.instance = instance;
      return r;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this.containerEl,
        n = this.instance.options;
      t.empty();
      new Setting(t)
        .setName(e2.optionOpenExternalLinks())
        .setDesc(e2.optionOpenExternalLinksDesc())
        .addToggle(function (t) {
          t.setValue(n.openExternalURLs).onChange(function (openExternalURLs) {
            n.openExternalURLs = openExternalURLs;
            e.plugin.saveData(n);
          });
        });
      new Setting(t)
        .setName(e2.optionHomepage())
        .setDesc(e2.optionHomepageDesc())
        .addText(function (t) {
          t.setValue(n.homepage).onChange(function (homepage) {
            n.homepage = homepage;
            e.plugin.saveData(n);
          });
        });
      new Setting(t)
        .setName(e2.optionSavedMarkdown())
        .setDesc(e2.optionSavedMarkdownDesc())
        .addText(function (t) {
          t.setPlaceholder(i18nProxy.setting.folderPathExamplePlaceholder())
            .setValue(n.markdownPath)
            .onChange(function (t) {
              n.markdownPath = t.trim();
              e.plugin.saveData(n);
            });
          new mT(e.app, t.inputEl);
        });
      var i,
        r = n.searchEngine === "custom";
      new Setting(t)
        .setName(e2.optionSearchEngine())
        .setDesc(e2.optionSearchEngineDesc())
        .addDropdown(function (t) {
          for (var r = 0, o = Object.entries(t2); r < o.length; r++) {
            var a = o[r],
              s = a[0],
              l = a[1],
              c = l.display === "custom" ? e2.optionSearchEngineCustomDropDown() : l.display;
            t.addOption(s, c);
          }
          t.setValue(n.searchEngine || J0).onChange(function (searchEngine) {
            searchEngine !== "custom" || n.customSearchEngine || (n.customSearchEngine = t2[J0].url);
            i.setVisibility(searchEngine === "custom");
            n.searchEngine = searchEngine;
            e.plugin.saveData(n);
          });
        });
      i = new Setting(t)
        .setName(e2.optionSearchEngineCustom())
        .setDesc(e2.optionSearchEngineDesc())
        .setVisibility(r)
        .addText(function (t) {
          t.setValue(n.customSearchEngine || t2[J0].url).setPlaceholder(t2[J0].url);
          t.inputEl.addEventListener("blur", function (i) {
            var customSearchEngine = t.getValue();
            if (!customSearchEngine.contains("%s")) {
              displayTooltip(t.inputEl, 'Search engine URL must contain "%s"', {
                placement: "bottom",
                classes: ["mod-error"],
              });
              window.setTimeout(hideTooltip, 2e3);
              return void t.setValue(n.customSearchEngine);
            }
            n.customSearchEngine = customSearchEngine;
            e.plugin.saveData(n);
          });
        });
      new Setting(t)
        .setName(e2.optionEnableAdblock())
        .setDesc(e2.optionEnableAdblockDesc())
        .addToggle(function (t) {
          t.setValue(n.enableAdblocking).onChange(function (enableAdblocking) {
            n.enableAdblocking = enableAdblocking;
            e.plugin.saveData(n);
            e.instance.updateSession();
          });
        });
      var o = electron.ipcRenderer.sendSync("adblock-lists");
      new Setting(t)
        .setName(e2.optionAdblockLists())
        .setDisabled(n.enableAdblocking)
        .setDesc(e2.optionAdblockListsDesc())
        .addTextArea(function (e) {
          e.setValue(o.join("\n"));
          e.inputEl.addEventListener("blur", function () {
            var t = e.inputEl.value.split("\n");
            o = electron.ipcRenderer.sendSync("adblock-lists", t);
          });
          e.inputEl.addClass("webviewer-adblock-lists");
        });
      var a = electron.ipcRenderer.sendSync("adblock-frequency");
      new Setting(t)
        .setName(e2.optionAdblockFrequency())
        .setDesc(e2.optionAdblockFrequencyDesc())
        .addSlider(function (e) {
          e.setLimits(0, 24, 1)
            .setValue(a)
            .setDynamicTooltip()
            .onChange(function (e) {
              a = electron.ipcRenderer.sendSync("adblock-frequency", e);
            });
        });
      new Setting(t).setName(e2.labelWebViewerData()).addButton(function (t) {
        t.setButtonText(e2.labelClearData()).onClick(function () {
          new o2(e.app, e.instance).open();
        });
      });
    };
    return t;
  })(j1),
  o2 = (function (e) {
    function t(t, webviewer) {
      var i = e.call(this, t) || this;
      i.clearCookies = true;
      i.clearCache = true;
      i.clearHistory = true;
      i.clearAll = false;
      i.webviewer = webviewer;
      var r = i,
        o = r.titleEl,
        a = r.contentEl;
      o.setText(e2.titleClearDataModal());
      var s = null,
        l = new Setting(a)
          .setName(e2.actionClearDataCookies())
          .setDesc(e2.actionClearDataCookiesDesc())
          .addToggle(function (e) {
            s = e;
            e.setValue(i.clearCookies).onChange(function (clearCookies) {
              i.clearCookies = clearCookies;
            });
          }),
        c = null,
        u = new Setting(a).setName(e2.actionClearDataCache()).addToggle(function (e) {
          c = e;
          e.setValue(i.clearCache).onChange(function (clearCache) {
            i.clearCache = clearCache;
          });
        }),
        h = null,
        p = new Setting(a).setName(e2.actionClearDataHistory()).addToggle(function (e) {
          h = e;
          e.setValue(i.clearHistory).onChange(function (clearAll) {
            i.clearAll = clearAll;
          });
        });
      new Setting(a)
        .setName(e2.actionClearDataAll())
        .setDesc(e2.actionClearDataAllDesc())
        .addToggle(function (e) {
          e.setValue(i.clearAll).onChange(function (clearAll) {
            i.clearAll = clearAll;
            l.setDisabled(clearAll);
            u.setDisabled(clearAll);
            p.setDisabled(clearAll);
            clearAll && (s.setValue(!0), c.setValue(!0), h.setValue(!0));
          });
        });
      a.createDiv("modal-button-container").createEl(
        "button",
        {
          cls: "mod-cta",
          text: e2.actionClearData(),
        },
        function (e) {
          e.addEventListener("click", i.performClearData.bind(i));
        },
      );
      return i;
    }
    __extends(t, e);
    t.prototype.performClearData = function () {
      return __awaiter(this, undefined, Promise, function () {
        var storages, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              storages = [];
              this.clearAll
                ? (storages = [
                    "cookies",
                    "filesystem",
                    "indexdb",
                    "localstorage",
                    "shadercache",
                    "websql",
                    "serviceworkers",
                    "cachestorage",
                  ])
                : (this.clearCookies && storages.push("cookies"), this.clearCache && storages.push("cachestorage"));
              return storages.length > 0
                ? [
                    4,
                    (t = electron.remote.session.fromPartition(this.app.getWebviewPartition())).clearStorageData({
                      storages: storages,
                    }),
                  ]
                : [3, 3];
            case 1:
              n.sent();
              return this.clearAll ? [4, t.clearData()] : [3, 3];
            case 2:
              n.sent();
              n.label = 3;
            case 3:
              return this.clearHistory ? [4, this.webviewer.db.clearHistoryItems()] : [3, 5];
            case 4:
              n.sent();
              n.label = 5;
            case 5:
              this.close();
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal),
  a2 = (function (e) {
    function t(t, webviewer) {
      var i = e.call(this, t) || this;
      i.inputEl = null;
      i.webviewer = webviewer;
      var r = i.modalEl;
      r.removeClass("modal");
      r.addClass("prompt");
      r.empty();
      r.createDiv("prompt-input-container", function (e) {
        i.inputEl = e.createEl("input", {
          cls: "prompt-input",
          type: "text",
          placeholder: e2.labelSearchTheWeb(),
        });
      });
      i.inputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var t = i.webviewer.getSearchEngineUrl(i.inputEl.value);
          i.app.workspace.getLeaf("tab").setViewState({
            type: typeQ00,
            active: true,
            state: {
              url: t,
              navigate: !0,
            },
          });
          i.close();
        }
      });
      return i;
    }
    __extends(t, e);
    return t;
  })(Modal),
  s2 = (function (e) {
    function t(t, webview, i) {
      var r = e.call(this, t, i) || this;
      r.foundInPageHandler = r._foundInPageHandler.bind(r);
      r.webview = webview;
      return r;
    }
    __extends(t, e);
    t.prototype.findPrevious = function () {
      var e = this.getQuery();
      e
        ? this.webview.findInPage(e, {
            findNext: false,
            forward: !1,
          })
        : this.webview.stopFindInPage("clearSelection");
    };
    t.prototype.findNext = function () {
      var findNexte0 = this.currentResult == this.numResults,
        t = this.getQuery();
      t
        ? this.webview.findInPage(t, {
            findNext: findNexte0,
          })
        : this.webview.stopFindInPage("clearSelection");
    };
    t.prototype.findNextOrReplace = function () {
      this.findNext();
    };
    t.prototype.onSearchInput = function () {
      var e = this.getQuery();
      if (e) {
        this.webview.findInPage(e, {
          findNext: !0,
        });
      }
    };
    t.prototype.show = function () {
      var e = this,
        t = e.containerEl,
        n = e.searchContainerEl,
        i = e.searchInputEl;
      t.prepend(n);
      focusAndSelectOnPhysicalKeyboard(i);
      this.app.keymap.pushScope(this.scope);
      this.onSearchInput();
      this.webview.addEventListener("found-in-page", this.foundInPageHandler);
    };
    t.prototype.hide = function () {
      this.webview.stopFindInPage("clearSelection");
      this.searchContainerEl.detach();
      this.app.keymap.popScope(this.scope);
      this.webview.removeEventListener("found-in-page", this.foundInPageHandler);
    };
    t.prototype._foundInPageHandler = function (e) {
      if (e.result.finalUpdate) {
        this.numResults = e.result.matches;
        this.currentResult = e.result.activeMatchOrdinal;
      }
    };
    return t;
  })(kB),
  l2 = i18nProxy.plugins.webViewer,
  c2 = {
    "image/avif": "avif",
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/pict": "pict",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/tiff": "tiff",
    "image/webp": "webp",
  },
  u2 = "data:text/plain,",
  h2 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.navigation = true;
      i.hasConfiguredWebContents = false;
      i.webviewMounted = false;
      i.loadFirstPage = null;
      i.webviewFirstLoadFinished = false;
      i.requestCommitPageLoad = debounce(i.commitPageLoad.bind(i));
      i.plugin = plugin;
      i.mode = "blank";
      return i;
    }
    __extends(t, e);
    t.prototype.getViewType = function () {
      return typeQ00;
    };
    t.prototype.getDisplayText = function () {
      return this.title || l2.labelNewWebViewer();
    };
    t.prototype.getState = function () {
      return __assign(__assign({}, e.prototype.getState.call(this)), {
        url: this.url,
        title: this.title,
        mode: this.mode,
      });
    };
    t.prototype.getIcon = function () {
      return "globe-2";
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              r.sent();
              return t.url && this.url !== t.url
                ? (t.title && (this.title = t.title), (i = t.navigate || !1), this.navigate(t.url, i), [2])
                : [2];
          }
        });
      });
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      t.addItem(function (e) {
        return e
          .setTitle(l2.actionSaveToVault())
          .setIcon("lucide-file-down")
          .onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e;
              return __generator(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, this.saveAsMarkdown()];
                  case 1:
                    (e = t.sent()) && this.app.workspace.getLeaf("tab").openFile(e);
                    return [2];
                }
              });
            });
          });
      });
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(i18nProxy.interface.menu.find())
          .setIcon("lucide-file-search")
          .onClick(i.showSearch.bind(i));
      });
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(l2.actionOpenDefaultBrowser())
          .setIcon("lucide-globe-2")
          .onClick(function () {
            return window.open(i.url, "_external");
          });
      });
      var r = this.webview.getZoomFactor();
      t.addItem(function (e) {
        return e
          .setTitle(i18nProxy.commands.zoomIn())
          .setIcon("zoom-in")
          .setSection("zoom")
          .setDisabled(r >= 3)
          .onClick(i.zoomIn.bind(i));
      });
      t.addItem(function (e) {
        return e
          .setTitle(i18nProxy.commands.resetZoom())
          .setIcon("rotate-cw")
          .setSection("zoom")
          .setDisabled(r === 1)
          .onClick(i.zoomReset.bind(i));
      });
      t.addItem(function (e) {
        return e
          .setTitle(i18nProxy.commands.zoomOut())
          .setIcon("zoom-out")
          .setSection("zoom")
          .setDisabled(r <= 0.5)
          .onClick(i.zoomOut.bind(i));
      });
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          this.headerEl.addClass("view-header-always-show");
          e = createDiv("view-header-reload-button");
          this.reloadButtonEl = e.createEl("button", "clickable-icon");
          setIcon(this.reloadButtonEl, "rotate-cw");
          this.headerEl.insertBefore(e, this.titleContainerEl);
          this.titleEl.detach();
          this.addressBar = new B0(this, this.titleContainerEl);
          (t = this.contentEl).addClass("webviewer-content");
          this.searchContainerEl = t.createDiv("search-in-page");
          this.readerView = t.createDiv("reader-mode-content");
          this.readerView.hide();
          this.readerView.addEventListener("contextmenu", this.onReaderModeContextMenu.bind(this));
          this.instantiateWebView();
          this.errorView = t.createDiv("error-notice", function (e) {
            e.createEl("h1", {
              text: l2.labelFailToLoad(),
            });
            e.createEl("p", {
              text: l2.labelFailToLoadDesc(),
            });
            e.hide();
          });
          this.readerModeToggleBtn = this.addAction("glasses", "Reader view", this.toggleReaderMode.bind(this));
          return [2];
        });
      });
    };
    t.prototype.toggleReaderMode = function () {
      this.mode === "reader" ? this.displayWebView() : this.displayReaderView();
    };
    t.prototype.zoomIn = function () {
      var e = this.webview.getZoomFactor();
      if (e < 3) {
        this.webview.setZoomFactor(e + 0.1);
      }
    };
    t.prototype.zoomOut = function () {
      var e = this.webview.getZoomFactor();
      if (e > 0.5) {
        this.webview.setZoomFactor(e - 0.1);
      }
    };
    t.prototype.zoomReset = function () {
      this.webview.setZoomFactor(1);
    };
    t.prototype.reportPageLoad = function (e, title, navigate) {
      if (e) {
        this.requestCommitPageLoad.cancel();
        this.inProgressPageLoad &&
          this.inProgressPageLoad.hasOwnProperty("navigate") &&
          (navigate = this.inProgressPageLoad.navigate);
        this.showLoadingIndicator(!0);
        this.inProgressPageLoad = {
          url: e,
          title: title,
          navigate: navigate,
        };
      }
    };
    t.prototype.showLoadingIndicator = function (e) {
      if (this.contentEl.hasClass("is-loading") !== e) {
        var t = e ? "x" : "rotate-cw";
        setIcon(this.reloadButtonEl, t);
        this.contentEl.toggleClass("is-loading", e);
      }
    };
    t.prototype.commitPageLoad = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, url, title, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return this.inProgressPageLoad
                ? ((e = this.inProgressPageLoad),
                  (url = e.url),
                  (title = e.title),
                  (i = e.navigate),
                  (this.inProgressPageLoad = null),
                  url === u2
                    ? [2]
                    : (i && this.webviewFirstLoadFinished
                        ? this.pushViewStackHistory(url)
                        : this.webviewFirstLoadFinished || (this.webviewFirstLoadFinished = true),
                      (this.url = url),
                      this.addressBar.setValue(url),
                      title ? ((this.title = title), [3, 3]) : [3, 1]))
                : [2];
            case 1:
              return [4, this.storeCurrentPageTitle()];
            case 2:
              o.sent();
              o.label = 3;
            case 3:
              this.title !== u2 &&
                (this.leaf.tabHeaderInnerTitleEl.setText(this.title),
                this.plugin.db.addHistoryItem(this.url, this.title));
              (r = this.app.internalPlugins.getEnabledPluginById("bookmarks")) && r.updateTabHeaders();
              this.hasConfiguredWebContents || ((this.hasConfiguredWebContents = true), this.configureWebContents());
              this.mode === "reader"
                ? this.displayReaderView()
                : this.webview.executeJavaScript(
                    "document.querySelectorAll('[target=\"_blank\"]').forEach(el => { el.removeAttribute('target')})",
                  );
              this.app.workspace.requestSaveLayout();
              return [2];
          }
        });
      });
    };
    t.prototype.instantiateWebView = function () {
      var e = this,
        t = this.contentEl,
        n = t.doc;
      this.webview && this.webview.detach();
      this.hasConfiguredWebContents = false;
      this.webviewMounted = false;
      this.webviewFirstLoadFinished = false;
      var i = (this.webview = n.createElement("webview"));
      i.style.backgroundColor = "white";
      i.allowpopups = true;
      i.partition = this.app.getWebviewPartition();
      i.setAttr("src", this.url || u2);
      this.reloadButtonEl.addEventListener("click", function () {
        i.isLoading() ? (i.stop(), e.showLoadingIndicator(!1)) : i.reload();
      });
      i.addEventListener("did-start-navigation", function (t) {
        if (t.isMainFrame) {
          e.reportPageLoad(t.url, undefined, !0);
        }
      });
      i.addEventListener("did-redirect-navigation", function (t) {
        return __awaiter(e, undefined, undefined, function () {
          return __generator(this, function (e) {
            return t.isMainFrame ? (this.reportPageLoad(t.url, undefined, !1), [2]) : [2];
          });
        });
      });
      i.addEventListener("dom-ready", function () {
        if (((e.webviewMounted = true), e.loadFirstPage)) {
          var t = e.loadFirstPage;
          e.loadFirstPage = null;
          t();
        }
        e.requestCommitPageLoad();
      });
      i.addEventListener("did-stop-loading", function () {
        e.showLoadingIndicator(!1);
      });
      i.addEventListener("did-finish-load", function () {
        return __awaiter(e, undefined, undefined, function () {
          return __generator(this, function (e) {
            this.showLoadingIndicator(!1);
            return [2];
          });
        });
      });
      i.addEventListener("did-fail-load", function (t) {
        if (-3 !== t.errorCode && t.isMainFrame) {
          e.showLoadingIndicator(!1);
          e.displayErrorView();
          e.requestCommitPageLoad();
        }
      });
      i.addEventListener("did-navigate-in-page", function () {
        return __awaiter(e, undefined, undefined, function () {
          return __generator(this, function (e) {
            this.requestCommitPageLoad();
            return [2];
          });
        });
      });
      i.addEventListener("page-favicon-updated", function (t) {
        var n = e.selectFavicon(t.favicons);
        e.setFavicon(n);
      });
      i.addEventListener("page-title-updated", function (t) {
        e.leaf.tabHeaderInnerTitleEl.setText(t.title);
        e.title = t.title;
      });
      i.addEventListener("context-menu", this.displayContextMenu.bind(this));
      i.addEventListener("destroyed", function () {
        if (n !== t.doc) {
          i.detach();
          e.instantiateWebView();
        }
      });
      n.contains(t)
        ? t.appendChild(this.webview)
        : t.onNodeInserted(function () {
            t.doc === n ? t.appendChild(e.webview) : e.instantiateWebView();
          }, !0);
    };
    t.prototype.storeCurrentPageTitle = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.title = this.webview.getTitle();
          return [2];
        });
      });
    };
    t.prototype.displayErrorView = function () {
      this.hideAll();
      this.mode = "error";
      this.errorView.show();
    };
    t.prototype.displayWebView = function () {
      this.hideAll();
      this.mode = "webview";
      this.webview.show();
      this.renderer = null;
      this.app.workspace.requestSaveLayout();
    };
    t.prototype.configureWebContents = function () {
      var e = this,
        t = electron.remote.webContents.fromId(this.webview.getWebContentsId());
      t.noContextMenu = true;
      t.on("before-input-event", function (n, i) {
        if (i.type === "keyDown" && !t.isDestroyed()) {
          var r = e.app.keymap.onKeyEvent(
            new KeyboardEvent("keydown", {
              code: i.code,
              key: i.key,
              shiftKey: i.shift,
              altKey: i.alt,
              ctrlKey: i.control,
              metaKey: i.meta,
              repeat: i.isAutoRepeat,
            }),
          );
          t.setIgnoreMenuShortcuts(!!r);
        }
      });
      t.on("input-event", function (t, n) {
        if (n.type === "mouseDown") {
          e.app.workspace.setActiveLeaf(e.leaf);
        }
      });
    };
    t.prototype.getReaderModeContent = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, title, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return [4, fetch("/lib/readability.js")];
            case 1:
              return (e = a.sent()).ok ? [4, e.text()] : (new Notice(l2.msgErrorExtractingContent()), [2]);
            case 2:
              t = a.sent();
              return [4, this.webview.executeJavaScript(t)];
            case 3:
              a.sent();
              n = "new Readability(document.cloneNode(true)).parse()";
              a.label = 4;
            case 4:
              a.trys.push([4, 6, , 7]);
              return [4, this.webview.executeJavaScript(n)];
            case 5:
              i = a.sent();
              return [3, 7];
            case 6:
              a.sent();
              new Notice(l2.msgErrorFindingContent());
              return [2];
            case 7:
              return i && i.content && typeof i.content == "string"
                ? typeof (title = i.title || i.siteName || "Untitled") != "string"
                  ? (console.error("Unexpected value when extracting site title"),
                    new Notice(l2.msgErrorFindingContent()),
                    [2])
                  : ((title = R0(title)),
                    (o = sanitizeHTMLToDom(i.content)),
                    [
                      2,
                      {
                        md: htmlToMarkdown(o),
                        title: title,
                      },
                    ])
                : (new Notice(l2.msgErrorFindingContent()), [2]);
          }
        });
      });
    };
    t.prototype.displayReaderView = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.getReaderModeContent()];
            case 1:
              return (e = n.sent())
                ? ((t = this.app.vault.getConfig("readableLineLength")),
                  this.readerView.toggleClass("is-readable-line-width", t),
                  this.renderer ||
                    (this.readerView.empty(),
                    (this.renderer = new MarkdownPreviewRenderer(this, this, this.readerView, "worker.js", !1))),
                  this.renderer.clear(),
                  this.renderer.set(e.md),
                  this.hideAll(),
                  this.readerModeToggleBtn.addClass("mod-webviewer"),
                  this.readerView.show(),
                  (this.mode = "reader"),
                  this.app.workspace.requestSaveLayout(),
                  [2])
                : [2];
          }
        });
      });
    };
    t.prototype.displayBlank = function () {
      var e = this;
      this.hideAll();
      this.mode = "blank";
      this.titleContainerEl.win.setTimeout(function () {
        e.addressBar.focus();
      }, 100);
      this.app.workspace.requestSaveLayout();
    };
    t.prototype.hideAll = function () {
      this.readerModeToggleBtn.removeClass("mod-webviewer");
      this.closeSearch();
      this.webview.hide();
      this.errorView.hide();
      this.readerView.hide();
    };
    t.prototype.saveAsMarkdown = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, this.getReaderModeContent()];
            case 1:
              return (e = i.sent())
                ? ((t = this.plugin.options.markdownPath || "") && (t += "/"),
                  (n = this.app.vault.getAvailablePath(t + e.title, "md")),
                  [2, this.app.vault.create(n, e.md)])
                : [2];
          }
        });
      });
    };
    t.prototype.navigate = function (e, t) {
      var n = this;
      if (e)
        if (this.webviewMounted) {
          if ((e !== u2 && this.addressBar.setValue(e), e === "about:blank")) {
            this.url = "about:blank";
            return void this.displayBlank();
          }
          this.reportPageLoad(e, undefined, t);
          this.webview.stop();
          this.webview
            .loadURL(e)
            .then(function () {
              if (n.mode !== "webview" && n.mode !== "reader") {
                n.displayWebView();
              }
            })
            .catch(function (e) {});
        } else
          this.loadFirstPage = function () {
            n.navigate(e, t);
          };
    };
    t.prototype.pushViewStackHistory = function (e) {
      var t,
        n = this.url,
        title = this.title,
        r = (t = this.leaf.history.backHistory.last()) === null || undefined === t ? undefined : t.state.state;
      if (!(this.url === e || (r && r.url === n))) {
        this.leaf.recordHistory({
          title: title,
          icon: "globe-2",
          state: {
            state: {
              url: n,
            },
            type: "webviewer",
          },
          eState: null,
        });
      }
    };
    t.prototype.selectFavicon = function (e) {
      if (e.length !== 0) {
        if (e.length === 1) return e[0];
        for (var t = 0, n = e[0], i = /(\d+)x\d+/, r = 0, o = e; r < o.length; r++) {
          var a = o[r],
            s = a.match(i);
          if (s) {
            var l = Number.parseInt(s[1]);
            if (l === 32) return a;
            if (l > t) {
              t = l;
              n = a;
            }
          }
        }
        return n;
      }
    };
    t.prototype.setFavicon = function (faviconUrl) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return faviconUrl && this.faviconUrl == faviconUrl
                ? [2]
                : ((this.faviconUrl = faviconUrl),
                  this.faviconImgEl
                    ? this.faviconImgEl.empty()
                    : (this.faviconImgEl = createDiv("webviewer-favicon-container")),
                  (t = this.webview.src) ? [4, this.plugin.db.setIcon(this.faviconImgEl, t, faviconUrl)] : [2]);
            case 1:
              n.sent();
              this.leaf.tabHeaderInnerIconEl.empty();
              this.leaf.tabHeaderInnerIconEl.appendChild(this.faviconImgEl);
              return [2];
          }
        });
      });
    };
    t.prototype.contextMenuItemsForLink = function (e, t) {
      var n = this,
        i = function (t) {
          n.app.workspace.getLeaf(t).setViewState({
            type: typeQ00,
            active: true,
            state: {
              url: e,
            },
          });
        },
        r = [
          {
            label: l2.actionOpenLink(),
            click: function () {
              i();
            },
          },
          {
            label: l2.actionOpenLinkNewTab(),
            click: function () {
              i("tab");
            },
          },
          {
            label: l2.actionOpenLinkNewSplit(),
            click: function () {
              i("split");
            },
          },
          {
            label: l2.actionOpenLinkNewWindow(),
            click: function () {
              i("window");
            },
          },
          {
            label: l2.actionOpenLinkDefaultBrowser(),
            click: function () {
              window.open(e, "_external");
            },
          },
          {
            type: "separator",
          },
          {
            label: l2.actionCopyLinkAddress(),
            click: function () {
              navigator.clipboard.writeText(e);
            },
          },
        ],
        o = this.app.internalPlugins.getEnabledPluginById("bookmarks");
      o &&
        r.push({
          label: l2.actionBookmarkLink(),
          click: function () {
            var t = v2(e);
            new F0(o, t, !1).open();
          },
        });
      return r;
    };
    t.prototype.contextMenuItemsForSelection = function (e, t) {
      var n = this,
        i = [
          {
            label: l2.actionSearchForQuery({
              query: hc(e, 15),
            }),
            click: function () {
              var t = encodeURIComponent(e),
                i = n.plugin.getSearchEngineUrl(t);
              n.app.workspace.getLeaf("tab").setViewState({
                type: typeQ00,
                active: true,
                state: {
                  url: i,
                },
              });
            },
          },
          {
            label: l2.actionExtractSelection(),
            click: function () {
              return __awaiter(n, undefined, undefined, function () {
                var t, n;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      t = R0(this.title);
                      n = this.app.vault.getAvailablePath(t, "md");
                      return [4, this.app.vault.create(n, e)];
                    case 1:
                      i.sent();
                      this.app.workspace.openLinkText(n, "", !0);
                      return [2];
                  }
                });
              });
            },
          },
          {
            type: "separator",
          },
          {
            label: l2.actionCopySelection(),
            accelerator: "CmdOrCtrl+C",
            role: "copy",
          },
        ];
      t &&
        i.push(
          {
            label: l2.actionCut(),
            accelerator: "CmdOrCtrl+X",
            role: "cut",
          },
          {
            label: l2.actionPaste(),
            accelerator: "CmdOrCtrl+V",
            role: "paste",
          },
          {
            label: l2.actionDelete(),
            accelerator: "Delete",
            role: "delete",
          },
          {
            label: l2.actionSelectAll(),
            accelerator: "CmdOrCtrl+A",
            role: "selectAll",
          },
        );
      return i;
    };
    t.prototype.contextMenuItemsForImg = function (e) {
      var t = this;
      return [
        {
          label: l2.actionSaveImage(),
          click: function () {
            return __awaiter(t, undefined, undefined, function () {
              var t, n, i, r;
              return __generator(this, function (o) {
                switch (o.label) {
                  case 0:
                    return [4, requestUrl(e)];
                  case 1:
                    t = o.sent();
                    n = R0((n = decodeURIComponent(Qc(e))));
                    i = c2[t.headers["content-type"]] || getExtension(e);
                    return [4, this.app.vault.getAvailablePathForAttachments(n, i, null)];
                  case 2:
                    r = o.sent();
                    this.app.vault.createBinary(r, t.arrayBuffer);
                    new Notice('Stored as "'.concat(r, '"'));
                    return [2];
                }
              });
            });
          },
        },
        {
          label: l2.actionCopyImage(),
          click: function () {
            return __awaiter(t, undefined, undefined, function () {
              var t, n, i;
              return __generator(this, function (r) {
                switch (r.label) {
                  case 0:
                    return [4, requestUrl(e)];
                  case 1:
                    t = r.sent();
                    n = cu(t.arrayBuffer);
                    i = electron.nativeImage.createFromBuffer(n);
                    electron.clipboard.writeImage(i);
                    return [2];
                }
              });
            });
          },
        },
        {
          label: l2.actionCopyImageLink(),
          click: function () {
            electron.clipboard.writeText(e);
          },
        },
      ];
    };
    t.prototype.displayContextMenu = function (e) {
      var t = this;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var n = e.params,
        i = [];
      if (
        (n.linkURL && i.push.apply(i, this.contextMenuItemsForLink(n.linkURL, n.linkText)),
        n.selectionText
          ? (i.length > 0 &&
              i.push({
                type: "separator",
              }),
            i.push.apply(i, this.contextMenuItemsForSelection(n.selectionText, n.isEditable)))
          : n.isEditable &&
            (i.length > 0 &&
              i.push({
                type: "separator",
              }),
            i.push(
              {
                label: l2.actionPaste(),
                role: "paste",
              },
              {
                label: l2.actionSelectAll(),
                role: "selectAll",
              },
            )),
        n.mediaType === "image" &&
          n.srcURL &&
          (i.length > 0 &&
            i.push({
              type: "separator",
            }),
          i.push.apply(i, this.contextMenuItemsForImg(n.srcURL))),
        !n.selectionText && n.mediaType === "none" && !n.linkURL)
      ) {
        i.length > 0 &&
          i.push({
            type: "separator",
          });
        i.push(
          {
            label: l2.actionBackward(),
            enabled: this.leaf.history.backHistory.length > 0,
            click: function () {
              t.leaf.history.back();
            },
          },
          {
            label: l2.actionForward(),
            enabled: this.leaf.history.forwardHistory.length > 0,
            click: function () {
              t.leaf.history.forward();
            },
          },
          {
            label: l2.actionReload(),
            click: function () {
              t.webview.reload();
            },
          },
        );
        var r = this.app.internalPlugins.getEnabledPluginById("bookmarks");
        r &&
          i.push({
            label: l2.actionBookmarkPage(),
            click: function () {
              var e = v2(t.url, t.title);
              new F0(r, e, !1).open();
            },
          });
        i.push(
          {
            label: l2.actionOpenDefaultBrowser(),
            click: function () {
              window.open(t.url, "_external");
            },
          },
          {
            label: l2.actionSelectAll(),
            accelerator: "CmdOrCtrl+A",
            role: "selectAll",
          },
        );
      }
      var o = electron.remote.Menu.buildFromTemplate(i),
        window = this.webview.win.electronWindow;
      o.popup({
        window: window,
      });
    };
    t.prototype.showSearch = function () {
      var e = this;
      this.mode === "reader"
        ? (this.searchReader ||
            (this.searchReader = new dN(this.plugin.app, this.renderer, this.searchContainerEl, function () {
              e.app.keymap.popScope(e.searchReader.scope);
              e.searchReader = null;
            })),
          focusAndSelectOnPhysicalKeyboard(this.searchReader.searchInputEl),
          this.app.keymap.pushScope(this.searchReader.scope))
        : this.mode === "webview" &&
          (this.searchWebView || (this.searchWebView = new s2(this.app, this.webview, this.searchContainerEl)),
          this.searchWebView.show());
    };
    t.prototype.closeSearch = function () {
      this.searchReader && (this.searchReader.close(), (this.searchReader = null));
      this.searchWebView && this.searchWebView.hide();
    };
    t.prototype.onExternalLinkClick = function (e, t, n) {
      e.preventDefault();
      e.stopPropagation();
      this.navigate(n, !0);
    };
    t.prototype.onReaderModeContextMenu = function (e) {
      var t,
        n = this;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var i = [],
        r = e.targetNode;
      if (r.instanceOf(HTMLElement))
        switch (r.nodeName) {
          case "A":
            var o = r.getAttr("href"),
              a = r.innerText;
            i.push.apply(i, this.contextMenuItemsForLink(o, a));
            break;
          case "IMG":
            var s = r.getAttr("src");
            i.push.apply(i, this.contextMenuItemsForImg(s));
        }
      var l = (t = r.win.getSelection()) === null || undefined === t ? undefined : t.toString();
      if (
        (l &&
          (i.length > 0 &&
            i.push({
              type: "separator",
            }),
          i.push.apply(i, this.contextMenuItemsForSelection(l))),
        i.length === 0)
      ) {
        var c = this.app.internalPlugins.getEnabledPluginById("bookmarks");
        c &&
          i.push({
            label: l2.actionBookmarkPage(),
            click: function () {
              var e = v2(n.url, n.title);
              new F0(c, e, !1).open();
            },
          });
        i.push(
          {
            label: l2.actionOpenDefaultBrowser(),
            click: function () {
              window.open(n.url, "_external");
            },
          },
          {
            label: l2.actionSelectAll(),
            accelerator: "CmdOrCtrl+A",
            click: function () {
              var e = n.renderer.previewEl.win,
                t = e.getSelection(),
                i = e.document.createRange();
              i.selectNodeContents(n.renderer.previewEl);
              t.removeAllRanges();
              t.addRange(i);
            },
          },
        );
      }
      var u = electron.remote.Menu.buildFromTemplate(i),
        window = r.win.electronWindow;
      u.popup({
        window: window,
      });
    };
    t.prototype.onCheckboxClick = function (e, t, n) {};
    t.prototype.onFoldChange = function () {};
    t.prototype.onScroll = function () {};
    t.prototype.postProcess = function (e, t, n) {};
    t.prototype.onRenderComplete = function () {};
    t.prototype.onInternalLinkClick = function (e, t, n) {};
    t.prototype.onInternalLinkRightClick = function (e, t, n) {};
    t.prototype.onInternalLinkDrag = function (e, t, n) {};
    t.prototype.onInternalLinkMouseover = function (e, t, n) {};
    t.prototype.onTagClick = function (e, t, n) {};
    t.prototype.onExternalLinkRightClick = function (e, t, n) {};
    return t;
  })(ItemView),
  p2 = i18nProxy.plugins.bookmarks;
function d2(e, subpath) {
  subpath || (subpath = undefined);
  return {
    type: "file",
    ctime: Date.now(),
    path: e.path,
    subpath: subpath,
  };
}
function f2(e) {
  return {
    type: "folder",
    ctime: Date.now(),
    path: e.path,
  };
}
function m2(e) {
  return {
    type: "group",
    ctime: Date.now(),
    items: [],
    title: e || p2.labelUntitledGroup(),
  };
}
function g2(options, t) {
  return {
    type: "graph",
    ctime: Date.now(),
    title: t || p2.labelUntitledGraph(),
    options: options,
  };
}
function v2(e, t) {
  return {
    type: "url",
    ctime: Date.now(),
    url: e,
    title: t || "",
  };
}
function y2(query) {
  return {
    type: "search",
    ctime: Date.now(),
    query: query,
  };
}
function b2(e) {
  return e.view instanceof IJ
    ? g2(e.view.dataEngine.getOptions())
    : e.view instanceof P0
      ? y2(e.view.getQuery())
      : e.view instanceof FileView
        ? d2(e.view.file)
        : e.view instanceof h2
          ? v2(e.view.url, e.view.getDisplayText())
          : null;
}
function w2(e, t) {
  var n = function (e, i) {
    for (var r = 0, o = e; r < o.length; r++) {
      var a = o[r];
      if (t(a, i)) return;
      if (a.type === "group") {
        n(a.items, i + a.title + "/");
      }
    }
  };
  n(e, "");
}
function k2(e) {
  for (var t = [], n = 0, i = XJ(e); n < i.length; n++) {
    var r = i[n];
    r instanceof TFile ? t.push(d2(r)) : r instanceof TFolder && t.push(f2(r));
  }
  return t;
}
function C2(e) {
  return e.extension === "md" ? $c(e.path) : e.path;
}