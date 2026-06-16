var Component = (function () {
    function e() {
      this._loaded = false;
      this._events = [];
      this._children = [];
    }
    e.prototype.load = function () {
      if (!this._loaded) {
        this._loaded = true;
        this.onload();
        for (var e = 0, t = this._children.slice(); e < t.length; e++) {
          t[e].load();
        }
      }
    };
    e.prototype.onload = function () {};
    e.prototype.unload = function () {
      if (this._loaded) {
        this._loaded = false;
        for (var e = this._children, t = this._events; e.length > 0; ) {
          e.pop().unload();
        }
        for (; t.length > 0; ) {
          t.pop()();
        }
        this.onunload();
      }
    };
    e.prototype.onunload = function () {};
    e.prototype.addChild = function (e) {
      this._children.push(e);
      this._loaded && e.load();
      return e;
    };
    e.prototype.removeChild = function (e) {
      var t = this._children,
        n = t.indexOf(e);
      -1 !== n && (t.splice(n, 1), e.unload());
      return e;
    };
    e.prototype.register = function (e) {
      this._events.push(e);
    };
    e.prototype.registerEvent = function (e) {
      this.register(function () {
        return e.e.offref(e);
      });
    };
    e.prototype.registerDomEvent = function (e, t, n, i) {
      e.addEventListener(t, n, i);
      this.register(function () {
        return e.removeEventListener(t, n, i);
      });
    };
    e.prototype.registerScopeEvent = function (e) {
      this.register(function () {
        return e.scope.unregister(e);
      });
    };
    e.prototype.registerInterval = function (e) {
      this.register(function () {
        return clearInterval(e);
      });
      return e;
    };
    return e;
  })(),
  MenuItem = (function () {
    function e(menu) {
      this.submenu = null;
      this.disabled = false;
      this.checked = null;
      this.section = "";
      this.menu = menu;
      var t = (this.dom = createDiv("menu-item tappable"));
      this.iconEl = t.createDiv("menu-item-icon");
      this.titleEl = t.createDiv("menu-item-title");
      t.addEventListener("click", this.handleEvent.bind(this));
    }
    e.prototype.setTitle = function (e) {
      typeof e == "string" ? this.titleEl.setText(e) : (this.titleEl.empty(), this.titleEl.appendChild(e));
      return this;
    };
    e.prototype.setIcon = function (e) {
      e ? setIcon(this.iconEl, e) : this.iconEl.empty();
      return this;
    };
    e.prototype.removeIcon = function () {
      this.iconEl.detach();
      return this;
    };
    e.prototype.setActive = function (e) {
      return this.setChecked(e);
    };
    e.prototype.setChecked = function (checked) {
      checked
        ? this.checkIconEl ||
          setIcon((this.checkIconEl = this.dom.createDiv("menu-item-icon mod-checked")), "lucide-check")
        : this.checkIconEl && this.checkIconEl.detach();
      this.checked = checked;
      this.dom.toggleClass("mod-checked", checked);
      return this;
    };
    e.prototype.setDisabled = function (disabled) {
      this.disabled = disabled;
      this.dom.toggleClass("is-disabled", disabled);
      return this;
    };
    e.prototype.setWarning = function (e) {
      this.dom.toggleClass("is-warning", e);
      return this;
    };
    e.prototype.setIsLabel = function (e) {
      this.dom.toggleClass("tappable", !e);
      this.dom.toggleClass("is-label", e);
      return this;
    };
    e.prototype.setSubmenu = function () {
      var t = this;
      if (!this.submenu) {
        this.dom.addClass("has-submenu");
        var n = (this.submenu = new Menu());
        setIcon(this.dom.createDiv("menu-item-icon mod-submenu"), "lucide-chevron-right");
        this.onClick(function (i) {
          if ((i.preventDefault(), Platform.isPhone)) {
            var r = e.create(n);
            r.setSection("title")
              .setTitle(t.titleEl.getText())
              .setIcon("lucide-chevron-left")
              .setIsLabel(!0)
              .onClick(function (e) {
                return __awaiter(t, undefined, undefined, function () {
                  return __generator(this, function (t) {
                    switch (t.label) {
                      case 0:
                        e.preventDefault();
                        zM = this.menu;
                        return [4, animateSlideSwap(this.submenu.scrollEl, this.menu.scrollEl, "left")];
                      case 1:
                        t.sent();
                        this.submenu.items.remove(r);
                        return [2];
                    }
                  });
                });
              });
            n.items.unshift(r);
            n.sort();
            zM = t.submenu;
            animateSlideSwap(t.menu.scrollEl, n.scrollEl, "right");
          }
        });
      }
      return this.submenu;
    };
    e.prototype.onClick = function (callback) {
      this.callback = callback;
      return this;
    };
    e.prototype.handleEvent = function (e) {
      if (this.disabled) e.preventDefault();
      else {
        var t = this.callback;
        if (t) {
          t(e);
        }
      }
    };
    e.prototype.setSection = function (section) {
      this.section = section;
      this.dom.setAttr("data-section", section);
      return this;
    };
    e.create = function (t) {
      return new e(t);
    };
    return e;
  })(),
  MenuSeparator = function (menu) {
    this.menu = menu;
    this.dom = createDiv("menu-separator");
  },
  zM = null;
function qM() {
  for (; zM; ) {
    var e = zM.parentMenu;
    zM.close();
    zM = e;
  }
}
var Menu = (function (e) {
    function t() {
      var n = e.call(this) || this;
      n.unloading = false;
      n.useNativeMenu = t.useNativeMenu;
      n.items = [];
      n.sections = [];
      n.submenuConfigs = {};
      n.selected = -1;
      n.openSubmenuSoon = debounce(n.openSubmenu.bind(n), 250, !0);
      n.scope = new Scope(Keymap.global.getRootScope());
      var i = (n.dom = createDiv("menu"));
      i.createDiv("menu-grabber");
      var r = (n.scrollEl = i.createDiv("menu-scroll")),
        o = (n.bgEl = createDiv("suggestion-bg"));
      o.style.opacity = "0";
      o.addEventListener("mousedown", function (e) {
        return e.preventDefault();
      });
      i.addEventListener("mousedown", function (e) {
        if (e.button === 0) {
          e.preventDefault();
        }
      });
      Platform.isPhone &&
        _M(i, r, o, function () {
          n.dom.detach();
          n.hide();
        });
      o.onClickEvent(function () {
        return n.hide();
      });
      n.scope.register([], "ArrowUp", n.onArrowUp.bind(n));
      n.scope.register([], "ArrowDown", n.onArrowDown.bind(n));
      n.scope.register([], "ArrowLeft", n.onArrowLeft.bind(n));
      n.scope.register([], "ArrowRight", n.onArrowRight.bind(n));
      n.scope.register([], "Enter", n.onEnter.bind(n));
      n.scope.register([], "Escape", n.hide.bind(n));
      Platform.isDesktop && i.addEventListener("mouseover", n.onMouseOver.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this;
      this.registerDomEvent(window, "click", this.onMenuClick.bind(this));
      this.registerDomEvent(window, "mousedown", function (t) {
        var n = t.targetNode;
        if (n && !e.isInside(n)) {
          e.hide();
        }
      });
      Platform.isDesktop && this.registerDomEvent(window, "contextmenu", this.hide.bind(this));
      Keymap.global.pushScope(this.scope);
    };
    t.prototype.onunload = function () {
      Keymap.global.popScope(this.scope);
    };
    t.prototype.onMenuClick = function (e) {
      var t = e.targetNode;
      if (
        !(
          t &&
          t.instanceOf(Element) &&
          (t.matchParent(".menu-item.has-submenu") || t.matchParent(".menu-item.is-label"))
        )
      ) {
        this.hide();
      }
    };
    t.prototype.isInside = function (e) {
      var t;
      if (this.dom.contains(e) || ((t = this.parentEl) === null || undefined === t ? undefined : t.contains(e)))
        return !0;
      for (var n = this.parentMenu; n; ) {
        if (n.dom.contains(e)) return !0;
        n = n.parentMenu;
      }
      for (var i = this.currentSubmenu; i; ) {
        if (i.dom.contains(e)) return !0;
        i = i.currentSubmenu;
      }
      return !1;
    };
    t.prototype.sort = function () {
      for (
        var e = this,
          items = e.items,
          n = e.sections,
          i = e.submenuConfigs,
          r = {
            "": [],
          },
          o = 0,
          a = items;
        o < a.length;
        o++
      ) {
        var s = "";
        (b = a[o]) instanceof MenuItem && (s = b.section);
        s === "" || n.contains(s) || n.push(s);
        var l = r[s];
        r.hasOwnProperty(s) || (l = r[s] = []);
        l.push(b);
      }
      items = [];
      for (var c = null, u = null, h = "", p = 0, d = n; p < d.length; p++) {
        s = d[p];
        if (r.hasOwnProperty(s)) {
          var f = s.split(".")[0];
          if (c !== f) {
            c !== null && items.push(new MenuSeparator(this));
            c = f;
          }
          var m = r[s];
          if (m.length > 1 && !Platform.isMobile) {
            var g = "";
            for (var v in i)
              if (i.hasOwnProperty(v) && (s === v || s.substring(v.length + 1) === v + ".")) {
                g = v;
                break;
              }
            if (g) {
              if (u && g === h) u.items.push(new MenuSeparator(this));
              else {
                var y = i[g],
                  b = MenuItem.create(this);
                items.push(b);
                b.setTitle(y.title);
                y.icon && b.setIcon(y.icon);
                y.disabled && b.setDisabled(!0);
                u = b.setSubmenu();
                h = g;
              }
              for (var w = 0, k = r[s]; w < k.length; w++) {
                b = k[w];
                u.items.push(b);
              }
              continue;
            }
          }
          for (var C = 0, E = m; C < E.length; C++) {
            b = E[C];
            items.push(b);
          }
        }
      }
      if (!n.contains(""))
        for (var S = 0, M = r[""]; S < M.length; S++) {
          b = M[S];
          items.push(b);
        }
      for (; items.last() instanceof MenuSeparator; ) items.pop();
      this.items = items;
      this.scrollEl.empty();
      for (var x = null, T = 0, D = this.items; T < D.length; T++) {
        (b = D[T]) instanceof MenuItem
          ? (x || (x = this.scrollEl.createDiv("menu-group")), x.appendChild(b.dom))
          : b instanceof MenuSeparator && ((x = null), this.scrollEl.appendChild(b.dom));
      }
    };
    t.prototype.addSections = function (e) {
      var t = this.sections;
      e = e.filter(function (e) {
        return !t.contains(e);
      });
      var n = t.indexOf("");
      -1 === n && (n = t.length);
      t.splice.apply(t, __spreadArray([n, 0], e, !1));
      return this;
    };
    t.prototype.setSectionSubmenu = function (e, t) {
      this.submenuConfigs[e] = t;
      return this;
    };
    t.prototype.setNoIcon = function () {
      this.dom.addClass("mod-no-icon");
      return this;
    };
    t.prototype.setUseNativeMenu = function (useNativeMenu) {
      this.useNativeMenu = useNativeMenu;
      return this;
    };
    t.prototype.addItem = function (e) {
      if (this._loaded) return this;
      var t = MenuItem.create(this);
      this.items.push(t);
      e(t);
      return this;
    };
    t.prototype.addSeparator = function () {
      if (this._loaded) return this;
      var e = new MenuSeparator(this);
      this.items.push(e);
      return this;
    };
    t.prototype.setParentElement = function (parentEl) {
      this.parentEl && this.parentEl.removeClass("has-active-menu");
      this.parentEl = parentEl;
      return this;
    };
    t.prototype.showAtMouseEvent = function (e) {
      return this.showAtPosition(
        {
          x: e.clientX,
          y: e.clientY,
        },
        e.doc,
      );
    };
    t.prototype.showAtPosition = function (e, t) {
      var n = this;
      if ((this.unload(), this.items.length === 0)) return this;
      var i = (t = t || activeDocument).body,
        r = e.x,
        o = e.y,
        a = getFrameTransform(i.win);
      if (a) {
        var s = a.scale;
        r = r * s + a.x;
        o = o * s + a.y;
        i = (t = (w = a.win).document).body;
      }
      if (
        (this.parentEl &&
          (this.parentEl.addClass("has-active-menu"),
          waitForElementHidden(this.parentEl, 500, function () {
            return n.hide();
          })),
        this.sort(),
        hideTooltip(),
        !Platform.isDesktop || !this.useNativeMenu)
      ) {
        NM(this);
        setTimeout(this.load.bind(this), 0);
        var l = this.dom,
          c = this.bgEl;
        if ((i.appendChild(l), i.appendChild(c), Platform.isPhone)) {
          if (Platform.isMobileApp && keyboardPlugin) {
            keyboardPlugin.hide();
          }
          var u = l.offsetHeight - 1;
          fl(
            l,
            new cl({
              duration: 150,
              fn: "var(--anim-motion-swing)",
            }).addProp("transform", "translateY(".concat(u, "px)"), ""),
          );
          fl(
            c,
            new cl({
              duration: 150,
            }).addProp("opacity", "0", "0.85"),
          );
          l.style.left = "";
          l.style.top = "";
        } else {
          var h = l.offsetWidth,
            p = l.offsetHeight,
            d = i.clientWidth,
            f = i.clientHeight,
            m = parseFloat(getComputedStyle(i).paddingTop);
          if (!(m && !isNaN(m))) {
            m = 0;
          }
          var g = r,
            v = g;
          e.width
            ? e.overlap
              ? ((g = r), (v = r + e.width))
              : ((g = r + e.width), (v = r))
            : ((g = r + 2), (v = r - 2));
          var y = l.style,
            b = v - h >= 0;
          !(g + h <= d) || (e.left && b) ? (y.left = Math.max(0, v - h) + "px") : (y.left = g + "px");
          o + p > f && (o = Math.max(m, o - p));
          y.top = o + 2 + "px";
          attachAutoScrollOnHover(this.scrollEl);
          c.style.opacity = "0.85";
        }
        zM = this;
        return this;
      }
      var w = t.win,
        k = function (e) {
          for (
            var t = [],
              n = function (e) {
                if (e instanceof MenuItem) {
                  var n = {
                    label: e.titleEl.getText().replace(/\B&\B/, "&&"),
                    enabled: !e.disabled && !e.dom.hasClass("is-label"),
                    checked: e.checked,
                    type: isBoolean(e.checked) ? "checkbox" : undefined,
                    click: function (t, n, i) {
                      return e.handleEvent(new MouseEvent("click", i));
                    },
                  };
                  e.submenu && (e.submenu.sort(), (n.submenu = k(e.submenu.items)));
                  t.push(n);
                } else if (e instanceof MenuSeparator) {
                  t.push({
                    type: "separator",
                  });
                }
              },
              i = 0,
              r = e;
            i < r.length;
            i++
          ) {
            n(r[i]);
          }
          return t;
        },
        C = k(this.items),
        E = w.electron.remote.Menu.buildFromTemplate(C);
      E.on("menu-will-close", function () {
        return n.hide();
      });
      var S = w.electron.remote.getCurrentWebContents(),
        M = Math.pow(1.2, S.getZoomLevel());
      E.popup({
        x: Math.round(r * M),
        y: Math.round(o * M),
        window: w.electron.remote.getCurrentWindow(),
        frame: S.focusedFrame,
      });
    };
    t.prototype.hide = function () {
      var e = this;
      if ((this.unload(), this.unloading)) return this;
      this.unloading = true;
      RM(this);
      this.unselect();
      this.closeSubmenu();
      this.parentMenu && this.parentMenu.currentSubmenu === this
        ? (zM === this && (zM = this.parentMenu), (this.parentMenu.currentSubmenu = null))
        : (zM = null);
      this.parentMenu = null;
      this.parentEl && (this.parentEl.removeClass("has-active-menu"), (this.parentEl = null));
      var t = this,
        n = t.dom,
        i = t.bgEl,
        r = t.hideCallback;
      if (Platform.isPhone && n.isShown()) {
        var o = n.offsetHeight - 1;
        fl(
          n,
          new cl({
            duration: 150,
          }).addProp("transform", "", "translateY(".concat(o, "px)")),
          function () {
            n.detach();
            r && r();
            e.unloading = false;
          },
        );
        fl(
          i,
          new cl({
            duration: 150,
          }).addProp("opacity", null, "0"),
          function () {
            i.detach();
          },
        );
      } else {
        n.detach();
        i.detach();
        r && r();
        this.unloading = false;
      }
      return this;
    };
    t.prototype.close = function () {
      this.hide();
    };
    t.prototype.onHide = function (hideCallback) {
      this.hideCallback = hideCallback;
    };
    t.prototype.onArrowUp = function (e) {
      e.preventDefault();
      for (var t = this.items, n = this.selected - 1, i = 0; i < t.length; ) {
        var r = t[n];
        if (r && r instanceof MenuItem && !r.disabled) {
          this.select(n);
          return !1;
        }
        --n < 0 && (n = t.length - 1);
        i++;
      }
      return !1;
    };
    t.prototype.onArrowDown = function (e) {
      e.preventDefault();
      for (var t = this.items, n = this.selected + 1, i = 0; i < t.length; ) {
        var r = t[n];
        if (r && r instanceof MenuItem && !r.disabled) {
          this.select(n);
          return !1;
        }
        ++n >= t.length && (n = 0);
        i++;
      }
      return !1;
    };
    t.prototype.onArrowLeft = function (e) {
      e.preventDefault();
      this.parentMenu && this.hide();
      return !1;
    };
    t.prototype.onArrowRight = function (e) {
      e.preventDefault();
      var t = this.items[this.selected];
      t instanceof MenuItem && t.submenu && (this.openSubmenu(t), this.currentSubmenu && this.currentSubmenu.select(0));
      return !1;
    };
    t.prototype.onEnter = function (e) {
      var t = this.items[this.selected];
      t && t instanceof MenuItem && (t.handleEvent(e), this.hide());
      return !1;
    };
    t.prototype.onMouseOver = function (e) {
      for (var t = e.targetNode, n = this.parentMenu, i = this.items, r = 0; r < i.length; r++) {
        var o = i[r];
        if (o.dom.contains(t)) {
          if (n)
            for (var a = n.items, s = 0; s < a.length; s++) {
              var l = a[s];
              if (l instanceof MenuItem && l.submenu === this) {
                if (n.selected !== s) {
                  n.openSubmenuSoon.cancel();
                  n.select(s);
                }
                break;
              }
            }
          return void (o instanceof MenuItem && (this.select(r), this.openSubmenuSoon(o)));
        }
      }
    };
    t.prototype.unselect = function () {
      var e = this.items[this.selected];
      e && e.dom.removeClass("selected");
      this.selected = null;
      this.closeSubmenu();
    };
    t.prototype.select = function (selected) {
      var t = this.items,
        n = this.selected;
      if (t.length !== 0) {
        selected < 0 && (selected = t.length - 1);
        selected >= t.length && (selected = 0);
        var i = t[n];
        i && i.dom.removeClass("selected");
        this.selected = selected;
        var r = t[selected];
        r.dom.addClass("selected");
        r.dom.scrollIntoView({
          block: "nearest",
        });
      }
    };
    t.prototype.openSubmenu = function (e) {
      this.openSubmenuSoon.cancel();
      var currentSubmenu = e.submenu,
        n = e.dom,
        i = this.currentSubmenu,
        r = this.parentMenu;
      if (!e.disabled) {
        if (i) {
          if (i === currentSubmenu || (r && r.selected !== this.parentMenu.items.indexOf(e))) return;
          this.closeSubmenu();
        }
        if (currentSubmenu) {
          currentSubmenu.parentMenu = this;
          this.currentSubmenu = currentSubmenu;
          var o = getComputedStyle(this.dom),
            a = parseFloat(o.paddingTop) + parseFloat(o.borderTopWidth),
            s = parseFloat(o.paddingLeft) + parseFloat(o.borderLeftWidth) + 2,
            l = parseFloat(o.paddingRight) + parseFloat(o.borderRightWidth) + 2,
            c = n.getBoundingClientRect();
          currentSubmenu.showAtPosition(
            {
              x: c.x - s,
              y: c.y - a,
              width: c.width + s + l,
            },
            n.doc,
          );
        }
      }
    };
    t.prototype.closeSubmenu = function () {
      this.openSubmenuSoon.cancel();
      var e = this.currentSubmenu;
      if (e) {
        e.hide();
        e.parentMenu = null;
        this.currentSubmenu = null;
      }
    };
    t.forEvent = function (e) {
      e.preventDefault();
      var n = UM.get(e);
      n ||
        ((n = new t()),
        UM.set(e, n),
        e.win.setTimeout(function () {
          return n.showAtMouseEvent(e);
        }));
      return n;
    };
    t.useNativeMenu = false;
    return t;
  })(Component),
  UM = new WeakMap();
function _M(e, t, n, i) {
  var r = function (r) {
    var o = e.doc.body;
    r.registerCallback({
      move: function (i, a) {
        r.evt.stopPropagation();
        t.style.overscrollBehavior = "none";
        o.addClass("hide-cursor");
        var s = t.offsetHeight,
          l = Math.clamp((a - r.startY) / s, 0, 1);
        e.style.transform = "translateY(".concat(l * s, "px)");
        n && (n.style.opacity = String(1 - l));
      },
      cancel: function () {
        t.style.overscrollBehavior = "";
        e.style.transform = "";
        n && (n.style.opacity = "");
      },
      finish: function (a, s, l) {
        t.style.overscrollBehavior = "";
        var c,
          u = t.offsetHeight,
          h = Math.clamp((s - r.startY) / u, 0, 1);
        l < u / 2
          ? (fl(
              e,
              new cl({
                duration: 200 * (c = h),
              }).addProp("transform", null, "translateY(0)", ""),
              function () {
                o.removeClass("hide-cursor");
              },
            ),
            n &&
              fl(
                n,
                new cl({
                  duration: 150 * c,
                  fn: "linear",
                }).addProp("opacity", null, "1", ""),
              ))
          : (fl(
              e,
              new cl({
                duration: 100 * (c = 1 - h),
                fn: "ease-out",
              }).addProp("transform", null, "translateY(".concat(u, "px)"), ""),
              function () {
                i();
                o.removeClass("hide-cursor");
              },
            ),
            n &&
              fl(
                n,
                new cl({
                  duration: 150 * c,
                  fn: "linear",
                }).addProp("opacity", null, "0"),
              ));
      },
    });
  };
  OM(e, function (t) {
    if (t.points === 1 && t.direction === "y") {
      e.scrollTop > 0 || r(t);
    }
  });
  n &&
    OM(n, function (e) {
      if (e.points === 1 && e.direction === "y") {
        r(e);
      }
    });
}
var Modal = (function () {
    function e(app) {
      var t = this;
      this.shouldRestoreSelection = true;
      this.selection = null;
      this.win = null;
      this.shouldAnimate = true;
      this.dimBackground = true;
      this.bgOpacity = "0.85";
      this.app = app;
      this.scope = new Scope();
      this.scope.register([], "Escape", this.onEscapeKey.bind(this));
      this.onWindowClose = this.onWindowClose.bind(this);
      this.containerEl = createDiv("modal-container");
      var n = (this.bgEl = this.containerEl.createDiv("modal-bg"));
      this.modalEl = this.containerEl.createDiv("modal");
      var i = this.modalEl.createDiv("modal-close-button");
      if (
        ((this.headerEl = this.modalEl.createDiv("modal-header")),
        (this.titleEl = this.headerEl.createDiv("modal-title")),
        (this.contentEl = this.modalEl.createDiv("modal-content")),
        this.scope.setTabFocusContainerEl(this.containerEl),
        i.addEventListener("click", this.close.bind(this)),
        Platform.isDesktopApp && Platform.isMacOS)
      ) {
        var r = null,
          o = null;
        n.addEventListener("click", function (e) {
          if (Math.hypot(e.screenX - r, e.screenY - o) < 5) {
            t.close();
          }
        });
        Platform.isMacOS &&
          n.addEventListener("mousedown", function (e) {
            r = e.screenX;
            o = e.screenY;
          });
      } else n.addEventListener("click", this.close.bind(this));
      if (Platform.isMobile) {
        OM(this.titleEl, function (e) {
          if (e.points === 1 && e.direction === "y") {
            var n = t,
              i = n.modalEl,
              r = n.bgEl;
            e.registerCallback({
              move: function (n, r) {
                var o = i.offsetHeight,
                  a = Math.clamp((r - e.startY) / o, 0, 1);
                i.style.transform = "translateY(".concat(a * o, "px)");
                t.bgEl.style.opacity = String(1 - a);
              },
              cancel: function () {
                i.style.transform = "";
                r.style.opacity = "";
              },
              finish: function (n, o, a) {
                var s,
                  l = i.offsetHeight,
                  c = Math.clamp((o - e.startY) / l, 0, 1);
                a < l / 2
                  ? (fl(
                      i,
                      new cl({
                        duration: 150 * (s = c),
                      }).addProp("transform", null, "translateY(0)", ""),
                    ),
                    fl(
                      r,
                      new cl({
                        duration: 150 * s,
                        fn: "linear",
                      }).addProp("opacity", null, "1", ""),
                    ))
                  : (fl(
                      i,
                      new cl({
                        duration: 150 * (s = 1 - c),
                        fn: "ease-out",
                      }).addProp("transform", null, "translateY(".concat(l, "px)"), ""),
                      function () {
                        t.close();
                      },
                    ),
                    fl(
                      r,
                      new cl({
                        duration: 150 * s,
                        fn: "linear",
                      }).addProp("opacity", null, "0"),
                    ));
              },
            });
          }
        });
      }
    }
    e.prototype.open = function () {
      var e = this.app,
        t = this.containerEl;
      if (!t.parentNode) {
        var n = (this.win = activeWindow);
        this.shouldRestoreSelection
          ? (this.selection = (function (e) {
              if (!e) {
                e = window;
              }
              var t = e.getSelection();
              if (!t) return null;
              var focusEl = e.document.activeElement;
              if (
                (focusEl === e.document.body && (focusEl = null),
                (focusEl == null ? undefined : focusEl.tagName) === "IFRAME")
              ) {
                var i = focusEl;
                if (i.contentDocument) {
                  focusEl = i.contentDocument.activeElement;
                }
              }
              var range = null;
              if (focusEl && t.rangeCount > 0) {
                var o = t.getRangeAt(0),
                  a = o.commonAncestorContainer;
                if (focusEl === a || focusEl.contains(a)) {
                  range = o;
                }
              }
              return {
                win: e,
                range: range,
                focusEl: focusEl,
              };
            })(n))
          : (this.selection = null);
        clearFocusAndSelection(n);
        e.keymap.pushScope(this.scope);
        n.document.body.appendChild(t);
        Platform.isPhone && pl(this.modalEl);
        this.onOpen();
        var i = this,
          r = i.modalEl,
          o = i.bgEl,
          a = i.dimBackground;
        t.toggleClass("mod-dim", a);
        Platform.isPhone ? this.animateOpen() : (o.style.opacity = a ? this.bgOpacity : "0");
        qM();
        NM(this);
        Platform.hasPhysicalKeyboard &&
          findAndFocusFirstFocusable(r, {
            preventScroll: !0,
          });
        n !== window && n.addEventListener("beforeunload", this.onWindowClose);
      }
    };
    e.prototype.animateOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this.shouldAnimate
                ? ((e = this.modalEl.doc.body).addClass("hide-cursor"),
                  [4, Tl(this.modalEl, this.bgEl, this.bgOpacity)])
                : [2];
            case 1:
              t.sent();
              e.removeClass("hide-cursor");
              return [2];
          }
        });
      });
    };
    e.prototype.animateClose = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              (e = this.modalEl.doc.body).addClass("hide-cursor");
              return [4, Dl(this.modalEl, this.bgEl)];
            case 1:
              t.sent();
              e.removeClass("hide-cursor");
              return [2];
          }
        });
      });
    };
    e.prototype.close = function () {
      var e = this,
        t = this,
        n = t.app,
        i = t.win,
        r = t.containerEl;
      n.keymap.popScope(this.scope);
      var o = function () {
        var t;
        r.detach();
        e.onClose();
        (t = e.onCloseCallback) === null || undefined === t || t.call(e);
      };
      Platform.isPhone ? this.animateClose().then(o) : o();
      RM(this);
      this.shouldRestoreSelection &&
        (function (e) {
          if (e && (e.focusEl || e.range)) {
            var t = e.win,
              n = e.focusEl,
              i = e.range;
            t.focus();
            var r = n && n.instanceOf(HTMLElement) && n.hasClass("cm-content");
            if (
              i &&
              !r &&
              isElementContainedInDocumentBody(t, i.startContainer) &&
              isElementContainedInDocumentBody(t, i.endContainer)
            ) {
              var o = t.getSelection();
              if (o) {
                o.removeAllRanges();
                o.addRange(i);
              }
            }
            if (
              n &&
              (n.instanceOf(HTMLElement) || n.instanceOf(SVGElement)) &&
              isElementContainedInDocumentBody(t, n)
            ) {
              n.focus({
                preventScroll: !0,
              });
            }
          }
        })(this.selection);
      i && i !== window && i.removeEventListener("beforeunload", this.onWindowClose);
      this.win = null;
    };
    e.prototype.onOpen = function () {};
    e.prototype.onClose = function () {};
    e.prototype.onWindowClose = function () {
      this.close();
    };
    e.prototype.onEscapeKey = function (e) {
      if (!e.defaultPrevented) {
        this.close();
      }
    };
    e.prototype.setTitle = function (e) {
      this.titleEl.setText(e);
      return this;
    };
    e.prototype.setContent = function (e) {
      String.isString(e) ? this.contentEl.setText(e) : this.contentEl.appendChild(e);
      return this;
    };
    e.prototype.setBackgroundOpacity = function (bgOpacity) {
      this.bgOpacity = bgOpacity;
      return this;
    };
    e.prototype.setCloseCallback = function (onCloseCallback) {
      this.onCloseCallback = onCloseCallback;
      return this;
    };
    e.prototype.setDimBackground = function (dimBackground) {
      this.dimBackground = dimBackground;
      return this;
    };
    return e;
  })(),
  GM = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.buttonContainerEl = null;
      n.containerEl.addClass("mod-confirmation");
      n.buttonContainerEl = n.modalEl.createDiv("modal-button-container");
      return n;
    }
    __extends(t, e);
    t.prototype.addCheckbox = function (e, t) {
      this.buttonContainerEl.createEl(
        "label",
        {
          cls: "mod-checkbox",
        },
        function (n) {
          n.createEl("input", {
            attr: {
              tabindex: -1,
            },
            type: "checkbox",
          }).addEventListener("click", t);
          n.appendText(e);
        },
      );
      return this;
    };
    t.prototype.addButton = function (e, textt0, n) {
      var i = this,
        r = Array.isArray(e) ? e : [e],
        o = this.buttonContainerEl.createEl("button", {
          cls: r.join(" "),
          text: textt0,
        });
      o.addEventListener("click", function (e) {
        return __awaiter(i, undefined, undefined, function () {
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                t.trys.push([0, , 2, 3]);
                o.addClass("mod-loading");
                return [4, n(e)];
              case 1:
                t.sent() || this.close();
                return [3, 3];
              case 2:
                o.removeClass("mod-loading");
                return [7];
              case 3:
                return [2];
            }
          });
        });
      });
      return this;
    };
    t.prototype.addCancelButton = function (e) {
      return this.addButton("mod-cancel", i18nProxy.dialogue.buttonCancel(), function () {
        if (!(e == null)) {
          e();
        }
      });
    };
    t.prototype.onClose = function () {
      hideTooltip();
    };
    return t;
  })(Modal),
  KM = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.addButton("mod-cta", n, i.accept.bind(i));
      i.addCancelButton(i.cancel.bind(i));
      i.scope.register([], "Enter", i.accept.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      var e = this;
      this.promise = new Promise(function (resolve) {
        e.resolve = resolve;
      });
    };
    t.prototype.accept = function () {
      var e;
      if (!((e = this.resolve) === null || undefined === e)) {
        e.call(this, !0);
      }
    };
    t.prototype.cancel = function () {
      var e;
      if (!((e = this.resolve) === null || undefined === e)) {
        e.call(this, !1);
      }
    };
    t.prototype.prompt = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.open();
          return [2, this.promise];
        });
      });
    };
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      this.cancel();
    };
    return t;
  })(GM),
  YM = createDiv("notice-container"),
  Notice = (function () {
    function e(texte0, t) {
      if (undefined === t) {
        t = 4e3;
      }
      var n = this,
        i = activeWindow;
      i.document.body.appendChild(YM);
      var r = (this.containerEl = YM.createDiv({
        cls: "notice",
      }));
      this.messageEl = this.noticeEl = r.createDiv({
        cls: "notice-message",
        text: texte0,
      });
      Platform.isMobile
        ? fl(r, new cl().addProp("transform", "translateY(100%)", "", ""))
        : fl(r, new cl().addProp("transform", "translateX(350px)", "", ""));
      var o = false,
        a = function () {
          if (!o) {
            n.hide();
          }
        };
      t &&
        (i.setTimeout(a, t),
        r.addEventListener("mouseenter", function () {
          return (o = true);
        }),
        r.addEventListener("mouseleave", function () {
          o = false;
          i.setTimeout(a, 1e3);
        }));
      r.addEventListener("click", function () {
        return n.hide();
      });
      Platform.isPhone &&
        _M(r, r, null, function () {
          r.detach();
          n.hide();
        });
    }
    e.prototype.setMessage = function (e) {
      this.messageEl.setText(e);
      return this;
    };
    e.prototype.addButton = function (texte0, t) {
      var n = this;
      this.containerEl
        .createDiv({
          cls: "notice-cta",
          text: texte0,
        })
        .addEventListener("click", function (e) {
          n.hide();
          t(e);
        });
      return this;
    };
    e.prototype.hide = function () {
      var e = this.containerEl,
        t = function () {
          e.detach();
          YM.childElementCount === 0 && YM.detach();
        };
      if (e.isShown()) {
        if (Platform.isMobile)
          fl(
            e,
            new cl({
              duration: 150,
            })
              .addProp("transform", "scale(1, 1)", "scale(0.85, 0.85)", "")
              .addProp("opacity", "1", "0", ""),
            t,
          );
        else {
          var n = getComputedStyle(e),
            i = -e.offsetHeight,
            r = parseInt(n.marginBottom);
          isNaN(r) || (i -= r);
          fl(
            e,
            new cl({
              duration: 120,
            })
              .addProp("opacity", "1", "0")
              .addProp("margin-top", "0px", i + "px"),
            t,
          );
        }
      } else t();
    };
    return e;
  })();
window.Notice = Notice;
var XM = (function (e) {
    function t(t, innerText) {
      var i = e.call(this, t) || this;
      i.title = i18nProxy.dialogue.labelRenameFileGeneric();
      i.modalEl.addClass("mod-file-rename");
      var r = (i.inputEl = createEl("textarea", {
        cls: "rename-textarea",
      }));
      r.rows = 1;
      r.innerText = innerText;
      i.app.nextFrame(function () {
        r.style.height = "auto";
        r.style.height = r.scrollHeight + "px";
      });
      r.addEventListener("keypress", function (e) {
        if (!(e.key !== "Enter" || e.isComposing)) {
          e.preventDefault();
          i.submit(r.value.trim());
        }
      });
      r.addEventListener("input", function (e) {
        hideTooltip();
        r.rows = 1;
        r.style.height = "auto";
        r.style.height = r.scrollHeight + "px";
        i.validate(r.value.trim());
      });
      i.setContent(
        createFragment(function (e) {
          e.appendChild(r);
        }),
      )
        .addButton("mod-cta", i18nProxy.dialogue.buttonSave(), function () {
          return i.submit(r.value.trim());
        })
        .addCancelButton();
      return i;
    }
    __extends(t, e);
    t.prototype.validate = function (e) {};
    t.prototype.onOpen = function () {
      e.prototype.onOpen.call(this);
      this.setTitle(this.title);
      this.inputEl.select();
      this.inputEl.focus();
    };
    t.prototype.displayError = function (e, t) {
      displayTooltip(this.inputEl, e, {
        classes: ["mod-wide", "mod-error"],
      });
      t &&
        setTimeout(function () {
          return hideTooltip();
        }, 2e3);
    };
    return t;
  })(GM),
  QM = (function (e) {
    function t(t, n, onSave) {
      var r = e.call(this, t, n) || this;
      r.onSave = onSave;
      return r;
    }
    __extends(t, e);
    t.prototype.validate = function (e) {
      Zb.test(e)
        ? this.displayError(i18nProxy.plugins.fileExplorer.msgInvalidCharacters() + Kb, !1)
        : e.startsWith(".")
          ? this.displayError(i18nProxy.plugins.fileExplorer.msgBadDotfile(), !1)
          : Xb.test(e) && this.displayError(i18nProxy.plugins.fileExplorer.msgUnsafeCharacters() + Yb, !1);
    };
    t.prototype.submit = function (e) {
      this.close();
      this.onSave(e);
    };
    return t;
  })(XM),
  $M = (function (e) {
    function t(t, filen0) {
      var i = e.call(this, t, filen0.basename) || this;
      i.file = filen0;
      filen0.extension === "md" && (i.title = i18nProxy.dialogue.labelRenameFile());
      return i;
    }
    __extends(t, e);
    t.prototype.validate = function (t) {
      e.prototype.validate.call(this, t);
      var n = this.app,
        i = this.file;
      if (n.vault.checkForDuplicate(i, t)) {
        this.displayError(i18nProxy.plugins.fileExplorer.msgFileAlreadyExists(), !1);
      }
    };
    t.prototype.submit = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              if ((this.close(), (n = (t = this).app), (i = t.file), e === "")) {
                new Notice(i18nProxy.plugins.fileExplorer.msgEmptyFileName());
                return [2];
              }
              if (((r = i.getNewPathAfterRename(e)), i.path === r)) return [2];
              s.label = 1;
            case 1:
              s.trys.push([1, 3, , 4]);
              return [4, n.fileManager.renameFile(i, r)];
            case 2:
              s.sent();
              new Notice(i18nProxy.dialogue.msgRenameSuccess());
              return [3, 4];
            case 3:
              (o = s.sent()) && ((a = o.message || o.code || o.toString()), new Notice(a));
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    return t;
  })(XM),
  JM = (function (e) {
    function t(t, editor, filei0, tokenRange, o) {
      var a = e.call(this, t, o) || this;
      a.file = filei0;
      a.editor = editor;
      a.tokenRange = tokenRange;
      return a;
    }
    __extends(t, e);
    t.prototype.submit = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, countl0, count, u, h, reference, links, files, m, g, v, y, w, k, C, E;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              return (t = this.getError(e))
                ? (displayTooltip(this.inputEl, t, {
                    placement: "bottom",
                    classes: ["mod-error"],
                  }),
                  [2, !0])
                : ((i = (n = this).file),
                  (r = n.app),
                  (o = r.fileManager),
                  (a = r.vault),
                  (s = this.getChanges(e)),
                  (countl0 = s.data.size),
                  (count = s.count()) !== 0 ? [3, 1] : (this.replaceInEditor(e), [3, 6]));
            case 1:
              return (u = s.get(i.path)) && u.length > 0
                ? (s.clear(i.path),
                  (h = this.replaceInFile(e)),
                  (reference = {
                    link: "",
                    original: "",
                    position: {
                      start: {
                        line: 0,
                        col: 0,
                        offset: h.start,
                      },
                      end: {
                        line: 0,
                        col: 0,
                        offset: h.end,
                      },
                    },
                  }),
                  u.push({
                    sourcePath: i.path,
                    change: h.text,
                    reference: reference,
                  }),
                  [
                    4,
                    a.process(i, function (e) {
                      return bx(e, u);
                    }),
                  ])
                : [3, 3];
            case 2:
              b.sent();
              return [3, 4];
            case 3:
              this.replaceInEditor(e);
              b.label = 4;
            case 4:
              return [4, o.updateInternalLinks(s)];
            case 5:
              b.sent();
              links = i18nProxy.nouns.linkWithCount({
                count: count,
              });
              files = i18nProxy.nouns.fileWithCount({
                count: countl0,
              });
              m = i18nProxy.dialogue.msgUpdatedLinks({
                links: links,
                files: files,
              });
              new Notice(m);
              b.label = 6;
            case 6:
              for (g = o.linkUpdaters, v = 0, y = Object.values(g); v < y.length; v++) {
                w = y[v];
                k = this.getCustomReplacements(e);
                C = k.oldSubpath;
                E = k.newSubpath;
                w.renameSubpath(this.file, C, E);
              }
              this.close();
              return [2];
          }
        });
      });
    };
    return t;
  })(XM),
  ex = (function (e) {
    function t(t, n, i, r, oldHeading) {
      var a = e.call(this, t, n, i, r, oldHeading) || this;
      a.title = i18nProxy.dialogue.labelRenameHeading();
      a.oldHeading = oldHeading;
      return a;
    }
    __extends(t, e);
    t.prototype.getError = function (e) {
      return e === "" ? i18nProxy.dialogue.msgHeadingEmpty() : null;
    };
    t.prototype.getChanges = function (e) {
      var t = this.file,
        n = this.app,
        i = n.metadataCache,
        r = new tc(),
        o = stripHeading(this.oldHeading).toLowerCase(),
        a = stripHeadingForLink(e);
      n.fileManager.iterateAllRefs(function (sourcePath, reference) {
        var s = parseLinktext(reference.link),
          l = s.path,
          c = s.subpath;
        if (c && stripHeading(c.substring(1)).toLowerCase() === o && i.getFirstLinkpathDest(l, sourcePath) === t) {
          r.add(sourcePath, {
            sourcePath: sourcePath,
            reference: reference,
            change: wx(reference, l + "#" + a),
          });
        }
      });
      return r;
    };
    t.prototype.replaceInEditor = function (e) {
      var t = this.tokenRange,
        n = this.editor,
        i = n.offsetToPos(t.start),
        r = n.getLine(i.line),
        o = this.replaceHeadingText(r, e);
      n.setLine(i.line, o);
    };
    t.prototype.replaceInFile = function (e) {
      var t = this.tokenRange,
        n = this.editor,
        i = n.offsetToPos(t.start),
        r = n.getLine(i.line),
        texto0 = this.replaceHeadingText(r, e);
      return __assign(__assign({}, t), {
        text: texto0,
      });
    };
    t.prototype.replaceHeadingText = function (e, t) {
      return e.replace(/^(#{1,6} ).*/m, function (e, n) {
        return n + t;
      });
    };
    t.prototype.getCustomReplacements = function (e) {
      return {
        oldSubpath: stripHeading(this.oldHeading).toLowerCase(),
        newSubpath: stripHeadingForLink(e),
      };
    };
    return t;
  })(JM),
  tx = (function (e) {
    function t(t, n, i, r, token) {
      var a = e.call(this, t, n, i, r, token.text.substring(1)) || this;
      a.title = i18nProxy.dialogue.labelRenameBlockid();
      a.token = token;
      return a;
    }
    __extends(t, e);
    t.prototype.getError = function (e) {
      return e === ""
        ? i18nProxy.dialogue.msgBlockIdEmpty()
        : /^[a-zA-Z0-9\-]+$/.test(e)
          ? null
          : i18nProxy.dialogue.msgBlockIdInvalid();
    };
    t.prototype.getChanges = function (e) {
      var t = this,
        n = t.file,
        i = t.app,
        r = t.token,
        o = i.metadataCache,
        a = new tc(),
        s = "#" + r.text.toLowerCase();
      i.fileManager.iterateAllRefs(function (sourcePath, reference) {
        var r = parseLinktext(reference.link),
          l = r.path,
          c = r.subpath;
        if (c && c.toLowerCase() === s && o.getFirstLinkpathDest(l, sourcePath) === n) {
          a.add(sourcePath, {
            sourcePath: sourcePath,
            reference: reference,
            change: wx(reference, l + "#^" + e),
          });
        }
      });
      return a;
    };
    t.prototype.replaceInEditor = function (e) {
      var t = this.editor,
        n = this.token;
      t.replaceRange("^" + e, n.start, n.end);
    };
    t.prototype.replaceInFile = function (e) {
      return __assign(__assign({}, this.tokenRange), {
        text: "^" + e,
      });
    };
    t.prototype.getCustomReplacements = function (e) {
      return {
        oldSubpath: this.token.text.toLowerCase(),
        newSubpath: "^" + e,
      };
    };
    return t;
  })(JM),
  nx = (function () {
    function e() {
      this.queue = [];
      this.offset = 0;
    }
    e.prototype.get = function () {
      return this.queue;
    };
    Object.defineProperty(e.prototype, "length", {
      get: function () {
        return this.queue.length - this.offset;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.isEmpty = function () {
      return this.queue.length == 0;
    };
    e.prototype.enqueue = function (e) {
      this.queue.push(e);
    };
    e.prototype.enqueueArray = function (e) {
      for (var t = this.queue, n = 0, i = e; n < i.length; n++) {
        var r = i[n];
        t.push(r);
      }
    };
    e.prototype.remove = function (e) {
      for (var t = this.queue, n = t.length - 1; n >= this.offset; n--)
        if (t[n] === e) {
          t.splice(n, 1);
        }
    };
    e.prototype.clear = function () {
      this.queue = [];
      this.offset = 0;
    };
    e.prototype.dequeue = function () {
      var e = this.queue,
        offset = this.offset;
      if (e.length != 0) {
        var n = e[offset];
        e[offset] = undefined;
        2 * (offset += 1) >= e.length && ((this.queue = e.slice(offset)), (offset = 0));
        this.offset = offset;
        return n;
      }
    };
    e.prototype.peek = function () {
      return this.queue.length > 0 ? this.queue[this.offset] : undefined;
    };
    return e;
  })(),
  ix = (function () {
    function e() {
      this.promise = Promise.resolve();
    }
    e.prototype.queue = function (e) {
      var promise = this.promise.then(e, e);
      this.promise = promise;
      return promise;
    };
    return e;
  })();
function rx() {
  var e = {
    promise: null,
    resolve: null,
    reject: null,
  };
  e.promise = new Promise(function (resolve, reject) {
    e.resolve = resolve;
    e.reject = reject;
  });
  return e;
}
function ox(e, t, n) {
  var i = this;
  if (undefined === n) {
    n = t;
  }
  var r = null,
    o = 0,
    a = null;
  return function () {
    return __awaiter(i, undefined, Promise, function () {
      var i = this;
      return __generator(this, function (s) {
        return a
          ? [2, a]
          : r && o > Date.now()
            ? [2, r]
            : ((a = __awaiter(i, undefined, undefined, function () {
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      o = Date.now() + n;
                      i.label = 1;
                    case 1:
                      i.trys.push([1, 3, , 4]);
                      return [4, e()];
                    case 2:
                      r = i.sent();
                      return [3, 4];
                    case 3:
                      i.sent();
                      a = null;
                      return [2, null];
                    case 4:
                      o = Date.now() + t;
                      a = null;
                      setTimeout(function () {
                        if (o > Date.now()) {
                          r = null;
                        }
                      }, t);
                      return [2, r];
                  }
                });
              })),
              [2, a]);
      });
    });
  };
}
var ax = (function () {
    function e(e) {
      this.running = false;
      this.cancelled = false;
      var t = e || {},
        n = t.onStart,
        i = t.onStop,
        r = t.onCancel;
      this.onStart = n || null;
      this.onStop = i || null;
      this.onCancel = r || null;
    }
    e.prototype.start = function () {
      if (!this.running) {
        this.running = true;
        this.onStart && this.onStart();
      }
    };
    e.prototype.stop = function () {
      if (this.running) {
        this.running = false;
        this.onStop && this.onStop();
      }
    };
    e.prototype.cancel = function () {
      this.stop();
      this.cancelled || ((this.cancelled = true), this.onCancel && this.onCancel());
    };
    e.prototype.isRunning = function () {
      return this.running;
    };
    e.prototype.isCancelled = function () {
      return this.cancelled;
    };
    return e;
  })(),
  sx = (function () {
    function e(e) {
      this.items = new nx();
      this.promise = null;
      this.runnable = new ax(e);
    }
    e.prototype.addList = function (e) {
      this.items.enqueueArray(e);
      this.notify();
    };
    e.prototype.add = function (e) {
      this.items.enqueue(e);
      this.notify();
    };
    e.prototype.remove = function (e) {
      this.items.remove(e);
    };
    e.prototype.clear = function () {
      this.items.clear();
    };
    e.prototype.notify = function () {
      var e = this.promise;
      if (e) {
        this.promise = null;
        setTimeout(function () {
          e && e.resolve();
        }, 0);
      }
    };
    e.prototype.cancel = function () {
      this.runnable.cancel();
    };
    e.prototype.generator = function () {
      return __asyncGenerator(this, arguments, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e = this.runnable;
              n.label = 1;
            case 1:
              return e.isCancelled() ? [4, __await(undefined)] : [3, 3];
            case 2:
              return [2, n.sent()];
            case 3:
              return (t = this.items).length !== 0 ? [3, 5] : (e.stop(), [4, __await((this.promise = rx()).promise)]);
            case 4:
              n.sent();
              return [3, 8];
            case 5:
              e.start();
              return [4, __await(t.dequeue())];
            case 6:
              return [4, n.sent()];
            case 7:
              n.sent();
              n.label = 8;
            case 8:
              return [3, 1];
            case 9:
              return [2];
          }
        });
      });
    };
    return e;
  })();
function lx(e) {
  return __asyncGenerator(this, arguments, function () {
    var t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          t = 0;
          n = e;
          i.label = 1;
        case 1:
          return t < n.length ? [4, __await(n[t])] : [3, 5];
        case 2:
          return [4, i.sent()];
        case 3:
          i.sent();
          i.label = 4;
        case 4:
          t++;
          return [3, 1];
        case 5:
          return [2];
      }
    });
  });
}
function cx(e, t) {
  return __asyncGenerator(this, arguments, function () {
    var n, i, r, o, a, s, l, c, u, h, p, d, f, m, error, v, y, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          i = (n = t || {}).batchSize;
          r = undefined === i ? 10 : i;
          o = n.duration;
          a = undefined === o ? 5 : o;
          s = n.maxDelay;
          l = undefined === s ? 100 : s;
          c = n.beforePause;
          u = 0;
          h = performance.now();
          b.label = 1;
        case 1:
          b.trys.push([1, 9, 10, 15]);
          p = true;
          d = __asyncValues(e);
          b.label = 2;
        case 2:
          return [4, __await(d.next())];
        case 3:
          f = b.sent();
          return (v = f.done) ? [3, 8] : ((k = f.value), (p = false), [4, __await(k)]);
        case 4:
          return [4, b.sent()];
        case 5:
          b.sent();
          return ++u % r != 0
            ? [3, 7]
            : (m = performance.now()) - h > a
              ? (c && c(m),
                [
                  4,
                  __await(
                    new Promise(function (e) {
                      return Sc(e, l);
                    }),
                  ),
                ])
              : [3, 7];
        case 6:
          b.sent();
          h = performance.now();
          b.label = 7;
        case 7:
          p = true;
          return [3, 2];
        case 8:
          return [3, 15];
        case 9:
          error = b.sent();
          y = {
            error: error,
          };
          return [3, 15];
        case 10:
          b.trys.push([10, , 13, 14]);
          return p || v || !(w = d.return) ? [3, 12] : [4, __await(w.call(d))];
        case 11:
          b.sent();
          b.label = 12;
        case 12:
          return [3, 14];
        case 13:
          if (y) throw y.error;
          return [7];
        case 14:
          return [7];
        case 15:
          return [2];
      }
    });
  });
}
var ux = (function () {
  function e() {
    this.promises = [];
  }
  e.prototype.add = function (e) {
    this.promises.push(e());
  };
  e.prototype.addPromise = function (e) {
    this.promises.push(e);
  };
  e.prototype.isEmpty = function () {
    return this.promises.length === 0;
  };
  e.prototype.promise = function () {
    return Promise.all(this.promises);
  };
  return e;
})();
function hx(e) {
  return new Promise(function (t) {
    return e.then(t, t);
  });
}
var px = /^(!?\[\[)(.*?)(\|(.*))?(]])$/,
  dx = /^(!?\[)(.*?)(]\(\s*)((<[^>]*?>|[^ "]+?)(\s+([^ ]+|"[^"]+"|'[^']+'|\([^']+\)))?)?(\s*\))$/,
  FileManager = (function () {
    function e(app) {
      this.app = null;
      this.vault = null;
      this.fileParentCreatorByType = {};
      this.inProgressUpdates = null;
      this.updateQueue = new ix();
      this.linkUpdaters = {};
      this.app = app;
      this.vault = app.vault;
      this.registerFileParentCreator("md", this.getMarkdownNewFileParent.bind(this));
    }
    e.prototype.getMarkdownNewFileParent = function (e) {
      var t = this.vault,
        n = t.getConfig("newFileLocation");
      if (n === "folder") {
        var i = t.getConfig("newFileFolderPath");
        if ((r = t.getAbstractFileByPath(i)) instanceof TFolder) return r;
      } else if (n === "current") {
        var r;
        i = Zc(e);
        if ((r = t.getAbstractFileByPath(i)) instanceof TFolder) return r;
      }
      return t.getRoot();
    };
    e.prototype.getNewFileParent = function (e, t) {
      var n = (t && getExtension(t)) || "md",
        i = this.fileParentCreatorByType[n];
      i ||
        (console.error(
          "No file creator assigned to create file with extension " + n + ". Falling back to Markdown file creator.",
        ),
        (i = this.fileParentCreatorByType.md));
      return i(e);
    };
    e.prototype.registerFileParentCreator = function (e, t) {
      this.fileParentCreatorByType[e] = t;
    };
    e.prototype.unregisterFileCreator = function (e) {
      delete this.fileParentCreatorByType[e];
    };
    e.prototype.canCreateFileWithExt = function (e) {
      return this.fileParentCreatorByType.hasOwnProperty(e || "md");
    };
    e.prototype.createNewMarkdownFileFromLinktext = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          if (!$b(e)) throw new Error(i18nProxy.plugins.fileExplorer.msgInvalidCharacters() + Kb);
          n = null;
          e.contains("/") || (n = this.getNewFileParent(t, e));
          return [2, this.createNewMarkdownFile(n, e)];
        });
      });
    };
    e.prototype.createNewMarkdownFile = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          return [2, this.createNewFile(e, t, "md", n)];
        });
      });
    };
    e.prototype.createNewFile = function (e, t, n, i) {
      return __awaiter(this, undefined, Promise, function () {
        var r,
          o,
          a,
          s,
          l,
          c,
          u,
          h = this;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              r = this.vault;
              e || (e = r.getRoot());
              n || (n = (t && getExtension(t)) || "md");
              this.fileParentCreatorByType.hasOwnProperty(n) || (n = "md");
              o = e.getParentPrefix();
              t
                ? (tu((t = t.trim()), n) && (t = $c(t)), (t = normalizePath(t)), (a = r.getAvailablePath(o + t, n)))
                : ((s = i18nProxy.plugins.fileExplorer.labelUntitledFile()), (a = r.getAvailablePath(o + s, n)));
              l = Zc(a);
              c = getFilename(a);
              return [
                4,
                __awaiter(h, undefined, undefined, function () {
                  var e;
                  return __generator(this, function (t) {
                    return l && l !== "/"
                      ? (e = r.getAbstractFileByPathInsensitive(l)) && e instanceof TFolder
                        ? [2, e]
                        : [2, r.createFolder(l)]
                      : [2, r.getRoot()];
                  });
                }),
              ];
            case 1:
              u = p.sent();
              return [2, r.create(u.getParentPrefix() + c, i || "")];
          }
        });
      });
    };
    e.prototype.createNewFolder = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              t = !e || e.isRoot() ? "" : e.path + "/";
              n = i18nProxy.plugins.fileExplorer.labelUntitledFolder();
              i = this.vault.getAvailablePath(t + n);
              return [4, this.vault.createFolder(i)];
            case 1:
              o.sent();
              return (r = this.vault.getAbstractFileByPath(i)) && r instanceof TFolder ? [2, r] : [2, null];
          }
        });
      });
    };
    e.prototype.renameFile = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                this.runAsyncLinkUpdate(function () {
                  return n.vault.rename(e, t);
                }),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.iterateAllRefs = function (e) {
      this.app.metadataCache.iterateReferences(e);
      for (var t = this.linkUpdaters, n = 0, i = Object.values(t); n < i.length; n++) {
        i[n].iterateReferences(e);
      }
    };
    e.prototype.runAsyncLinkUpdate = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t = this;
        return __generator(this, function (n) {
          return this.inProgressUpdates
            ? (this.inProgressUpdates.push(e), [2])
            : [
                2,
                this.updateQueue.queue(function () {
                  return __awaiter(t, undefined, undefined, function () {
                    var t,
                      n,
                      i,
                      r,
                      o,
                      a = this;
                    return __generator(this, function (s) {
                      switch (s.label) {
                        case 0:
                          return [
                            4,
                            new Promise(function (e) {
                              return a.app.metadataCache.onCleanCache(e);
                            }),
                          ];
                        case 1:
                          s.sent();
                          t = [];
                          n = this.app;
                          i = n.metadataCache;
                          r = n.vault;
                          this.iterateAllRefs(function (e, reference) {
                            var o = getLinkpath(reference.link);
                            if (o) {
                              var sourceFile = r.getAbstractFileByPath(e);
                              if (sourceFile instanceof TFile) {
                                var s = i.getLinkpathDest(o, e);
                                if (s.length > 0) {
                                  t.push({
                                    sourceFile: sourceFile,
                                    reference: reference,
                                    resolvedFile: s[0],
                                    resolvedPaths: s.map(function (e) {
                                      return e.path;
                                    }),
                                  });
                                }
                              }
                            }
                          });
                          s.label = 2;
                        case 2:
                          s.trys.push([2, , 7, 8]);
                          this.inProgressUpdates = [];
                          return [4, e(t)];
                        case 3:
                          s.sent();
                          s.label = 4;
                        case 4:
                          return this.inProgressUpdates.length > 0
                            ? ((o = this.inProgressUpdates),
                              (this.inProgressUpdates = []),
                              [
                                4,
                                Promise.all(
                                  o.map(function (e) {
                                    return e(t);
                                  }),
                                ),
                              ])
                            : [3, 6];
                        case 5:
                          s.sent();
                          return [3, 4];
                        case 6:
                          return [3, 8];
                        case 7:
                          this.inProgressUpdates = null;
                          return [7];
                        case 8:
                          return [4, this.updateAllLinks(t)];
                        case 9:
                          s.sent();
                          return [2];
                      }
                    });
                  });
                }),
              ];
        });
      });
    };
    e.prototype.updateAllLinks = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          count,
          links,
          files,
          u,
          h = this;
        return __generator(this, function (p) {
          for (t = new tc(), n = this.app.metadataCache, i = 0, r = e; i < r.length; i++) {
            o = r[i];
            (a = gx(o, n)) && t.add(a.sourcePath, a);
          }
          return (count = t.count()) === 0
            ? [2]
            : ((links = i18nProxy.nouns.linkWithCount({
                count: count,
              })),
              (files = i18nProxy.nouns.fileWithCount({
                count: t.data.size,
              })),
              (u = function () {
                return __awaiter(h, undefined, undefined, function () {
                  return __generator(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.updateInternalLinks(t)];
                      case 1:
                        e.sent();
                        new Notice(
                          i18nProxy.dialogue.msgUpdatedLinks({
                            links: links,
                            files: files,
                          }),
                        );
                        return [2];
                    }
                  });
                });
              }),
              this.vault.getConfig("alwaysUpdateLinks")
                ? [2, u()]
                : [
                    2,
                    new Promise(function (e, t) {
                      try {
                        var textn0 = i18nProxy.dialogue.labelLinkAffected({
                            links: links,
                            files: files,
                          }),
                          i = new GM(h.app);
                        i.titleEl.setText(i18nProxy.dialogue.labelUpdateLinks());
                        i.contentEl.createEl("p", {
                          text: i18nProxy.dialogue.labelConfirmUpdateLinkToFile(),
                        });
                        i.contentEl.createEl("p", {
                          text: textn0,
                        });
                        i.setCloseCallback(e);
                        var r = function (t) {
                            i.setCloseCallback(null);
                            i.close();
                            t && h.app.vault.setConfig("alwaysUpdateLinks", !0);
                            e(u());
                          },
                          o = i.buttonContainerEl;
                        i.buttonContainerEl
                          .createEl("button", {
                            text: i18nProxy.dialogue.buttonAlwaysUpdate(),
                          })
                          .addEventListener("click", function () {
                            return r(!0);
                          });
                        o.createEl("button", {
                          text: i18nProxy.dialogue.buttonJustOnce(),
                        }).addEventListener("click", function () {
                          return r();
                        });
                        o.createEl("button", {
                          text: i18nProxy.dialogue.buttonDoNotUpdate(),
                        }).addEventListener("click", function () {
                          return i.close();
                        });
                        i.open();
                      } catch (e) {
                        t(e);
                      }
                    }),
                  ]);
        });
      });
    };
    e.prototype.renameProperty = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              n = this.app;
              i = n.metadataCache;
              (r = n.metadataTypeManager).assignedWidgets.hasOwnProperty(e) &&
                ((o = r.assignedWidgets[e].widget), xM.hasOwnProperty(e) || r.unsetType(e), r.setType(t, o));
              a = 0;
              s = i.getCachedFiles();
              p.label = 1;
            case 1:
              return a < s.length
                ? ((l = s[a]),
                  i.isUserIgnored(l)
                    ? [3, 3]
                    : (c = i.getCache(l)) &&
                        (u = c.frontmatter) &&
                        u.hasOwnProperty(e) &&
                        (h = this.vault.getAbstractFileByPath(l)) &&
                        h instanceof TFile
                      ? [
                          4,
                          this.app.vault.process(h, function (n) {
                            var i,
                              r = kx(n),
                              o = r.content,
                              a = r.frontmatter;
                            a.hasOwnProperty(t) ? (vx(a, (((i = {})[t] = a[e]), i)), delete a[e]) : dc(a, e, t);
                            return Cx(a) + o;
                          }),
                        ]
                      : [3, 3])
                : [3, 4];
            case 2:
              p.sent();
              p.label = 3;
            case 3:
              a++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.getAllLinkResolutions = function () {
      return [];
    };
    e.prototype.updateInternalLinks = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t = this.linkUpdaters;
              n = function (n) {
                var r, o, a;
                return __generator(this, function (s) {
                  switch (s.label) {
                    case 0:
                      return (r = i.vault.getAbstractFileByPath(n)) instanceof TFile
                        ? ((o = r.extension),
                          (a = e.get(n)),
                          t.hasOwnProperty(o) ? [4, t[o].applyUpdates(r, a)] : [3, 2])
                        : [2, "continue"];
                    case 1:
                      s.sent();
                      return [3, 4];
                    case 2:
                      return [
                        4,
                        i.vault.process(r, function (e) {
                          return bx(e, a);
                        }),
                      ];
                    case 3:
                      s.sent();
                      s.label = 4;
                    case 4:
                      return [2];
                  }
                });
              };
              i = this;
              r = 0;
              o = e.keys();
              s.label = 1;
            case 1:
              return r < o.length ? ((a = o[r]), [5, n(a)]) : [3, 4];
            case 2:
              s.sent();
              s.label = 3;
            case 3:
              r++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.promptForDeletion = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          count,
          texts0,
          l = this;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              t = this.app;
              n = t.vault.getConfig("promptDelete");
              i = t.vault.getConfig("trashOption");
              return n
                ? ((r = document.createDocumentFragment()).createEl("p", {
                    cls: "u-break-word",
                    text: i18nProxy.dialogue.labelConfirmDeletion({
                      filename: e.name,
                    }),
                  }),
                  i === "system"
                    ? r.createEl("p", {
                        text: i18nProxy.dialogue.labelMoveToSystemTrash(),
                      })
                    : i === "local"
                      ? r.createEl("p", {
                          text: i18nProxy.dialogue.labelMoveToVaultTrash(),
                        })
                      : i === "none" &&
                        r.createEl("p", {
                          cls: "mod-warning",
                          text: i18nProxy.dialogue.labelPermanentDelete(),
                        }),
                  e instanceof TFolder &&
                    e.children.length > 0 &&
                    (r.createEl("p", {
                      cls: "mod-warning",
                      text: i18nProxy.dialogue.labelNonEmptyFolder(),
                    }),
                    r.createEl("p", {
                      cls: "mod-warning",
                      text: i18nProxy.dialogue.labelDeleteFolderWarning(),
                    })),
                  e instanceof TFile &&
                    ((o = t.metadataCache.getBacklinksForFile(e)),
                    (count = o.count()) > 0 &&
                      ((texts0 = i18nProxy.dialogue.labelExistingBacklink({
                        count: count,
                      })),
                      r.createEl("p", {
                        cls: "mod-warning",
                        text: texts0,
                      }))),
                  [
                    4,
                    new Promise(function (n, i) {
                      var o = false,
                        a = new GM(t)
                          .setTitle(
                            e instanceof TFolder
                              ? i18nProxy.dialogue.labelDeleteFolder()
                              : i18nProxy.dialogue.labelDeleteFile(),
                          )
                          .setContent(r);
                      Platform.isMobile
                        ? a.addButton("mod-destructive", i18nProxy.dialogue.buttonDeleteDoNotAskAgain(), function () {
                            return __awaiter(l, undefined, undefined, function () {
                              var r;
                              return __generator(this, function (o) {
                                switch (o.label) {
                                  case 0:
                                    o.trys.push([0, 2, , 3]);
                                    t.vault.setConfig("promptDelete", !1);
                                    return [4, this.trashFile(e)];
                                  case 1:
                                    o.sent();
                                    n();
                                    return [3, 3];
                                  case 2:
                                    r = o.sent();
                                    i(r);
                                    return [3, 3];
                                  case 3:
                                    return [2];
                                }
                              });
                            });
                          })
                        : a.addCheckbox(i18nProxy.dialogue.labelDoNotAskAgain(), function (e) {
                            o = e.target.checked;
                          });
                      a.addButton("mod-warning", i18nProxy.dialogue.buttonDelete(), function () {
                        return __awaiter(l, undefined, undefined, function () {
                          var r;
                          return __generator(this, function (a) {
                            switch (a.label) {
                              case 0:
                                a.trys.push([0, 2, , 3]);
                                o && t.vault.setConfig("promptDelete", !1);
                                return [4, this.trashFile(e)];
                              case 1:
                                a.sent();
                                n();
                                return [3, 3];
                              case 2:
                                r = a.sent();
                                i(r);
                                return [3, 3];
                              case 3:
                                return [2];
                            }
                          });
                        });
                      })
                        .addCancelButton(function () {
                          n();
                        })
                        .open();
                    }),
                  ])
                : [3, 2];
            case 1:
              c.sent();
              return [3, 4];
            case 2:
              return [4, this.trashFile(e)];
            case 3:
              c.sent();
              c.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.promptForFolderDeletion = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          return [2, this.promptForDeletion(e)];
        });
      });
    };
    e.prototype.promptForFileDeletion = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          return [2, this.promptForDeletion(e)];
        });
      });
    };
    e.prototype.promptForFileRename = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          new $M(this.app, e).open();
          return [2];
        });
      });
    };
    e.prototype.trashFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = this.app;
              return (n = t.vault.getConfig("trashOption")) !== "system" ? [3, 2] : [4, t.vault.trash(e, !0)];
            case 1:
              i.sent();
              return [3, 6];
            case 2:
              return n !== "local" ? [3, 4] : [4, t.vault.trash(e, !1)];
            case 3:
              i.sent();
              return [3, 6];
            case 4:
              return n !== "none" ? [3, 6] : [4, t.vault.delete(e, !0)];
            case 5:
              i.sent();
              i.label = 6;
            case 6:
              return [2];
          }
        });
      });
    };
    e.prototype.downloadAttachmentsForNote = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          s = this;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              return e.extension !== "md"
                ? [2]
                : ((t = []),
                  (n = []),
                  (i = []),
                  (r = function (e) {
                    var r = kx(e).frontmatter,
                      o = parseMetadata(e);
                    for (var a in ((t = []), (n = []), (i = []), r))
                      if (Object.hasOwn(r, a)) {
                        var value = r[a];
                        if (String.isString(value) && Wc(value) && IMAGE_EXTENSIONS.contains(getExtension(value))) {
                          t.push({
                            key: a,
                            value: value,
                          });
                          i.push(value);
                        }
                      }
                    visit(o, ["image"], function (e, t, r) {
                      var o = e.url;
                      if (o && !isRelativePath(o) && /^(https?:\/\/|data:)/.test(o)) {
                        n.push(e);
                        i.push(o);
                      }
                    });
                  }),
                  [4, this.app.vault.read(e)]);
            case 1:
              o = l.sent();
              r(o);
              return i.length === 0
                ? (new Notice(i18nProxy.dialogue.labelNoAttachments()), [2])
                : [4, this.promptForImageDownload(i.unique())];
            case 2:
              return (a = l.sent()) && Object.keys(a).length !== 0
                ? [
                    4,
                    this.app.vault.process(e, function (i) {
                      if (i !== o) {
                        r(i);
                      }
                      for (var l = [], c = 0, u = n; c < u.length; c++) {
                        var h = u[c],
                          p = h.url;
                        if (Object.hasOwn(a, p)) {
                          var d = a[p],
                            f = h.position,
                            m = "";
                          if (h.alt && typeof h.alt == "string") {
                            m = h.alt;
                          }
                          var textg0 = s.app.fileManager.generateMarkdownLink(d, e.path, "", m);
                          l.push({
                            from: f.start.offset,
                            to: f.end.offset,
                            text: textg0,
                          });
                        }
                      }
                      l.sort(function (e, t) {
                        return t.from - e.from;
                      });
                      for (var v = 0, y = l; v < y.length; v++) {
                        var b = y[v];
                        i = i.substring(0, b.from) + b.text + i.substring(b.to);
                      }
                      t.length > 0 &&
                        (i = mx(i, function (e) {
                          for (var n = 0, i = t; n < i.length; n++) {
                            var r = i[n],
                              o = r.key,
                              l = r.value;
                            if (Object.hasOwn(a, l)) {
                              var c = a[l],
                                u = s.app.metadataCache.fileToLinktext(c, "", !1);
                              e[o] = "[[".concat(u, "]]");
                            }
                          }
                        }));
                      return i;
                    }),
                  ]
                : [2];
            case 3:
              l.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.promptForImageDownload = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          s,
          l,
          c,
          u,
          name,
          p,
          d,
          f = this;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              if (e.length === 0) return [2];
              for (
                (t = new KM(this.app, i18nProxy.dialogue.buttonDownload()).setTitle(
                  i18nProxy.dialogue.labelDownloadAttachments(),
                )).modalEl.addClass("mod-scrollable-content"),
                  n = [],
                  i = {},
                  r = 0,
                  o = e;
                r < o.length;
                r++
              )
                if (((a = o[r]), (s = new Sx(a)), n.push(s), (i[a] = s), a.startsWith("data:"))) {
                  if ((l = parseDataUrl(a))) {
                    c = su(l.contentType) || "jpg";
                    s.name = "Image." + c;
                  }
                } else {
                  if (
                    ((u = new URL(a)),
                    (name = u.pathname
                      .split("/")
                      .filter(function (e) {
                        return !!e;
                      })
                      .last()),
                    Zb.test(name) || Xb.test(name))
                  )
                    continue;
                  if (-1 === (p = name.lastIndexOf(".")) || !/^[a-z0-9]+$/i.test(name.substring(p + 1))) continue;
                  s.name = name;
                }
              t.contentEl.createDiv("download-attachments").setChildrenInPlace(
                n.map(function (e) {
                  return e.el;
                }),
              );
              return [4, t.prompt()];
            case 1:
              return m.sent()
                ? ((d = {}),
                  [
                    4,
                    withLoadingClass(t.contentEl, function () {
                      return __awaiter(f, undefined, undefined, function () {
                        var t, n, r, o, a, s, l, c, u, h, p, f, m, g, v, y, w, k, C, E, S, M, x;
                        return __generator(this, function (b) {
                          switch (b.label) {
                            case 0:
                              t = 0;
                              n = e;
                              b.label = 1;
                            case 1:
                              return t < n.length
                                ? ((r = n[t]),
                                  (o = i[r]).checked
                                    ? ((a = o.name),
                                      r.startsWith("data:")
                                        ? (s = parseDataUrl(r))
                                          ? ((l = Qc(a) || "Image"),
                                            (c = su(s.contentType) || "jpg"),
                                            (u = d),
                                            (h = r),
                                            [4, this.app.saveAttachment(l, c, s.arrayBuffer)])
                                          : [3, 3]
                                        : [3, 4])
                                    : [3, 7])
                                : [3, 8];
                            case 2:
                              u[h] = b.sent();
                              b.label = 3;
                            case 3:
                              return [3, 7];
                            case 4:
                              return [4, requestUrl(r)];
                            case 5:
                              if (
                                ((p = b.sent()),
                                (f = getHeaderIgnoreCase(p.headers, "Content-Disposition") || ""),
                                (m = f
                                  .split(";")
                                  .map(function (e) {
                                    return e.trim();
                                  })
                                  .filter(function (e) {
                                    return !!e;
                                  })),
                                m.contains("attachment"))
                              )
                                for (g = 0, v = m; g < v.length; g++)
                                  if ((y = v[g]).startsWith("filename=")) {
                                    a = y.substring(9).replace(/"/g, "");
                                    break;
                                  }
                              a ||
                                ((w = (getHeaderIgnoreCase(p.headers, "Content-Type") || "").split(";")[0].trim())
                                  .toLowerCase()
                                  .startsWith("image/") &&
                                  ((k = su(w) || "jpg"), (a = "Image." + k)));
                              a || (a = "Image.jpg");
                              C = Qc(a);
                              E = getExtension(a);
                              S = p.arrayBuffer;
                              M = d;
                              x = r;
                              return [4, this.app.saveAttachment(C, E, S)];
                            case 6:
                              M[x] = b.sent();
                              b.label = 7;
                            case 7:
                              t++;
                              return [3, 1];
                            case 8:
                              return [2];
                          }
                        });
                      });
                    }),
                  ])
                : [2, null];
            case 2:
              m.sent();
              t.close();
              new Notice(
                i18nProxy.dialogue.labelDownloadedAttachments({
                  count: Object.keys(d).length,
                }),
              );
              return [2, d];
          }
        });
      });
    };
    e.prototype.generateMarkdownLink = function (e, t, n, i) {
      var r,
        o = this.app,
        a = o.vault.getConfig("useMarkdownLinks"),
        s = !a,
        l = o.metadataCache.fileToLinktext(e, t, s) + (n || "");
      if ((e.path === t && n && (l = n), a)) {
        var c = encodeSpecialChars(l);
        r =
          e.extension === "md"
            ? "[".concat(i || e.basename, "](").concat(c, ")")
            : "![".concat(i || "", "](").concat(c, ")");
      } else {
        i && i.toLowerCase() === l.toLowerCase() && ((l = i), (i = null));
        r = i ? "[[".concat(l, "|").concat(i, "]]") : "[[".concat(l, "]]");
        e.extension !== "md" && (r = "!" + r);
      }
      return r;
    };
    e.prototype.createAndOpenMarkdownFile = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              n = this.app.workspace;
              i =
                (s = (a = n.getActiveFile()) === null || undefined === a ? undefined : a.path) !== null &&
                undefined !== s
                  ? s
                  : "";
              r = this.getNewFileParent(i, e);
              return [4, this.createNewMarkdownFile(r, e)];
            case 1:
              o = l.sent();
              return [
                4,
                n.getLeaf(t).openFile(o, {
                  active: true,
                  state: {
                    mode: "source",
                  },
                  eState: {
                    rename: "all",
                  },
                }),
              ];
            case 2:
              l.sent();
              return [2, o];
          }
        });
      });
    };
    e.prototype.insertIntoFile = function (e, t) {
      return __awaiter(this, arguments, undefined, function (e, t, n) {
        undefined === n && (n = "append");
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                this.app.vault.process(e, function (e) {
                  var i, r, o, a, s, l;
                  try {
                    o = (i = kx(t)).content;
                    a = i.frontmatter;
                  } catch (e) {
                    o = t;
                    a = {};
                    new Notice(i18nProxy.properties.msgInvalidProperties());
                  }
                  try {
                    s = (r = kx(e)).content;
                    l = r.frontmatter;
                  } catch (t) {
                    s = e;
                    l = {};
                    new Notice(i18nProxy.properties.msgInvalidProperties());
                  }
                  var c,
                    u = n === "prepend" ? o : s,
                    h = n === "prepend" ? s : o;
                  if (
                    ((c =
                      u && h && !(u.slice(-2) + h.slice(0, 2)).contains("\n\n")
                        ? u.endsWith("\n") || h.startsWith("\n")
                          ? u + "\n" + h
                          : u + "\n\n" + h
                        : u + h),
                    vx(l, a),
                    Object.keys(l).length > 0)
                  ) {
                    var p = stringifyYaml(l).trim();
                    c = "---\n".concat(p, "\n---\n") + c;
                  }
                  return c;
                }),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.processFrontMatter = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return e.extension !== "md"
                ? [2]
                : [
                    4,
                    this.vault.process(
                      e,
                      function (e) {
                        return mx(e, t);
                      },
                      n,
                    ),
                  ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.storeTextFileBackup = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              i.trys.push([0, 3, , 4]);
              return (n = this.app.internalPlugins.getEnabledPluginById("file-recovery"))
                ? [4, n.forceAdd(e, t)]
                : [3, 2];
            case 1:
              i.sent();
              i.label = 2;
            case 2:
              return [3, 4];
            case 3:
              i.sent();
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.getAvailablePathForAttachment = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          n = this.app;
          i = n.vault;
          r = n.workspace;
          o = Qc(e);
          a = getExtension(e);
          s = null;
          t ? (l = i.getAbstractFileByPath(t)) && l instanceof TFile && (s = l) : (s = r.getActiveFile());
          return [2, i.getAvailablePathForAttachments(o, a, s)];
        });
      });
    };
    e.prototype.notifyForBulkUndo = function (e, t) {
      var n = this;
      undefined === t && (t = 3e4);
      e.length !== 0 &&
        new Notice(
          i18nProxy.dialogue.msgFilesUpdated({
            count: e.length,
          }),
          t,
        ).addButton(i18nProxy.dialogue.buttonUndo(), function () {
          n.updateQueue.queue(function () {
            return __awaiter(n, undefined, undefined, function () {
              var t, n, i, r, o, mtime, s;
              return __generator(this, function (l) {
                switch (l.label) {
                  case 0:
                    t = this.app.vault;
                    n = 0;
                    i = e;
                    l.label = 1;
                  case 1:
                    return n < i.length
                      ? ((r = i[n]),
                        (o = r.file),
                        (mtime = r.mtime),
                        (s = r.content),
                        [
                          4,
                          t.modify(o, s, {
                            mtime: mtime,
                          }),
                        ])
                      : [3, 4];
                  case 2:
                    l.sent();
                    l.label = 3;
                  case 3:
                    n++;
                    return [3, 1];
                  case 4:
                    new Notice(
                      i18nProxy.dialogue.msgFilesReverted({
                        count: e.length,
                      }),
                    );
                    return [2];
                }
              });
            });
          });
        });
    };
    return e;
  })();
function mx(e, t) {
  var n = getFrontMatterInfo(e),
    i = n.exists ? parseYaml(n.frontmatter) : {};
  if (((i && typeof i == "object") || (i = {}), t(i), Object.keys(i).length === 0))
    return n.exists ? e.slice(n.contentStart) : e;
  var r = stringifyYaml(i);
  return n.exists ? e.slice(0, n.from) + r + e.slice(n.to) : "---\n" + r + "---\n" + e;
}
function gx(e, t) {
  var reference = e.reference,
    i = e.sourceFile,
    r = e.resolvedPaths,
    sourcePath = i.path,
    a = parseLinktext(reference.link),
    s = a.path,
    l = a.subpath,
    c = t.getLinkpathDest(s, sourcePath).map(function (e) {
      return e.path;
    });
  if (
    c.length === 0 ||
    !(function (e, t) {
      if (e === t) return !0;
      if (e == null || t == null) return !1;
      if (e.length !== t.length) return !1;
      for (var n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
      return !0;
    })(r, c)
  ) {
    var u = px.test(reference.original),
      h = t.fileToLinktext(e.resolvedFile, sourcePath, u) + l;
    if (reference.link !== h) {
      var p = [],
        d = t.getFileCache(e.resolvedFile);
      d && (p = parseFrontMatterAliases(d.frontmatter));
      return {
        sourcePath: sourcePath,
        reference: reference,
        change: wx(reference, h, p),
      };
    }
  }
}
function vx(e, t) {
  if (Object.keys(t).length !== 0)
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var i = e.hasOwnProperty(n) ? e[n] : undefined,
          r = t[n];
        i
          ? Array.isArray(i) && Array.isArray(r)
            ? (e[n] = i.concat(r).unique())
            : typeof i == "object" && r !== null && typeof r == "object"
              ? vx(i, r)
              : r !== null && (e[n] = r)
          : (e[n] = r);
      }
}
function yx(e, t, n) {
  for (; e && t.length; ) {
    var i = t.shift();
    if (Array.isArray(e)) {
      var r = parseInt(i);
      if (isNaN(r) || r < 0 || r >= e.length) return;
      if (!(t.length > 0)) return void (e[r] = n);
      e = e[r];
    } else {
      if (typeof e != "object") return;
      if (!(t.length > 0)) return void (e[i] = n);
      e = e[i];
    }
  }
}
function bx(e, t) {
  for (var n = [], i = [], r = 0, o = t; r < o.length; r++) {
    var a = o[r];
    if (hasPosition(a.reference)) {
      var s = a.reference.position;
      n.push({
        start: s.start.offset,
        end: s.end.offset,
        text: a.change,
      });
    } else if (hasKey(a.reference)) {
      i.push({
        key: a.reference.key,
        value: a.change,
      });
    }
  }
  if (
    ((e = (function (e, t) {
      t.sort(function (e, t) {
        return t.start - e.start;
      });
      for (var n = 0, i = t; n < i.length; n++) {
        var r = i[n];
        e = e.substring(0, r.start) + r.text + e.substring(r.end);
      }
      return e;
    })(e, n)),
    i.length === 0)
  )
    return e;
  var l,
    c = getFrontMatterInfo(e);
  if (!c.exists) return e;
  try {
    l = parseYaml(c.frontmatter);
  } catch (t) {
    return e;
  }
  for (var u = 0, h = i; u < h.length; u++) {
    var p = h[u];
    yx(l, p.key.split("."), p.value);
  }
  var d = stringifyYaml(l);
  return e.slice(0, c.from) + d + e.slice(c.to);
}
function wx(e, t, n) {
  var i,
    r,
    o = e.original,
    a = e.link,
    s = o.match(px);
  if (s) {
    var l = s[1],
      c = s[2],
      u = s[4],
      h = undefined === u ? "" : u,
      p = s[5];
    if (h) {
      var d = /\\\|/.test(o) ? "\\|" : "|",
        f = h.trim();
      ru(c) !== f || (n == null ? undefined : n.contains(f)) || (h = ru(getLinkpath(t)));
      r = l + t + d + h + p;
    } else r = l + t + p;
  } else {
    var m = o.match(dx),
      g = !m || !m[5].startsWith("<") ? encodeSpecialChars(t) : "<" + t + ">";
    if (m) {
      var v = m[2],
        y = Kc(v).trim();
      y === ru((c = getLinkpath(a)))
        ? (v = ru(getLinkpath(t)))
        : y.contains("/") && y === ou(c) && (v = ou(getLinkpath(t)));
      r = m[1] + v + m[3] + g + ((i = m[6]) !== null && undefined !== i ? i : "") + m[8];
    } else {
      r = "[](".concat(g, ")");
      o.startsWith("!") && (r = "!" + r);
    }
  }
  return r;
}
function kx(e) {
  var frontmatter = {},
    n = getFrontMatterInfo(e),
    i = n.contentStart,
    r = n.frontmatter,
    content = e.slice(i);
  r && (frontmatter = parseYaml(r));
  return {
    content: content,
    frontmatter: frontmatter,
  };
}
function Cx(e) {
  var t = "";
  if (e && Object.keys(e).length > 0) {
    var n = stringifyYaml(e).trim();
    t = "---\n".concat(n, "\n---\n");
  }
  return t;
}
function Ex(e, t) {
  var n = Cx(t),
    i = getFrontMatterInfo(e).contentStart;
  return n + e.slice(i);
}
var Sx = (function () {
  function e(url) {
    var t = this;
    this.name = "";
    this.url = url;
    this.el = createDiv("download-attachment-item");
    this.el.addEventListener("click", function (e) {
      if (!(e.button !== 0 || e.defaultPrevented)) {
        t.setChecked(!t.checked);
      }
    });
    var n = (this.checkboxEl = this.el.createEl("input", {
      type: "checkbox",
    }));
    n.addEventListener("change", function () {
      t.setChecked(n.checked);
    });
    this.setChecked(!0);
    setDynamicTooltip(this.el, function () {
      var e = hc(t.url, 100);
      t.name && (e = t.name + "\n" + e);
      return e;
    });
    this.el.createEl("img", {
      attr: {
        src: url,
      },
    });
  }
  e.prototype.setChecked = function (checked) {
    if (this.checked !== checked) {
      this.checked = checked;
      this.checkboxEl.checked = checked;
      this.el.toggleClass("is-selected", checked);
    }
  };
  return e;
})();
function Mx(e) {
  var t = Ab.exec(e);
  t && t[0] && (e = e.slice(t[0].length));
  return detectTextDirection(e);
}
var xx = {
  auto: Decoration.line({
    attributes: {
      dir: "auto",
    },
  }),
  rtl: Decoration.line({
    attributes: {
      dir: "rtl",
    },
  }),
  ltr: Decoration.line({
    attributes: {
      dir: "ltr",
    },
  }),
};
function Tx(e) {
  for (
    var t = e.state.doc, n = wb(t), i = new RangeSetBuilder(), r = "auto", o = 0, a = e.viewportLineBlocks;
    o < a.length;
    o++
  ) {
    var s = a[o];
    if (!(s.from < n)) {
      var l = Mx(t.sliceString(s.from, s.to));
      l === "auto" && (l = r);
      i.add(s.from, s.from, xx[l]);
      r = l;
    }
  }
  return i.finish();
}
var Dx = ViewPlugin.define(
  function (e) {
    return {
      deco: Tx(e),
      update: function (e) {
        if (e.docChanged || e.viewportChanged || e.heightChanged) {
          this.deco = Tx(e.view);
        }
      },
    };
  },
  {
    decorations: function (e) {
      return e.deco;
    },
  },
);
var Ax = (function () {
    function e(chooser, containerEl, n) {
      var i = this;
      this.chooser = chooser;
      this.containerEl = containerEl;
      this.values = [];
      this.suggestions = [];
      this.selectedItem = 0;
      containerEl.on("click", ".suggestion-item", this.onSuggestionClick.bind(this));
      containerEl.on("auxclick", ".suggestion-item", this.onSuggestionClick.bind(this));
      containerEl.on("mousemove", ".suggestion-item", this.onSuggestionMouseover.bind(this));
      this.moveUp = this.moveUp.bind(this);
      this.moveDown = this.moveDown.bind(this);
      n.register([], "ArrowUp", this.moveUp);
      n.register([], "ArrowDown", this.moveDown);
      n.register([], "PageUp", this.pageUp.bind(this));
      n.register([], "PageDown", this.pageDown.bind(this));
      n.register([], "Home", function (e) {
        i.setSelectedItem(0, e);
        return !1;
      });
      n.register([], "End", function (e) {
        i.setSelectedItem(i.suggestions.length - 1, e);
        return !1;
      });
      (Platform.isMacOS || Platform.isIosApp) &&
        (n.register(["Ctrl"], "p", this.moveUp), n.register(["Ctrl"], "n", this.moveDown));
      n.register([], "Enter", function (e) {
        if (!e.isComposing) {
          i.useSelectedItem(e);
          return !1;
        }
      });
    }
    e.prototype.getSelectedElement = function () {
      var e;
      return (e = this.suggestions[this.selectedItem]) !== null && undefined !== e ? e : null;
    };
    e.prototype.getSelectedValue = function () {
      var e;
      return (e = this.values[this.selectedItem]) !== null && undefined !== e ? e : null;
    };
    e.prototype.moveUp = function (e) {
      if (!e.isComposing) {
        this.setSelectedItem(this.selectedItem - 1, e);
        return !1;
      }
    };
    e.prototype.moveDown = function (e) {
      if (!e.isComposing) {
        this.setSelectedItem(this.selectedItem + 1, e);
        return !1;
      }
    };
    Object.defineProperty(e.prototype, "rowHeight", {
      get: function () {
        return this.suggestions[this.selectedItem].clientHeight;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(e.prototype, "numVisibleItems", {
      get: function () {
        return Math.floor(this.containerEl.clientHeight / this.rowHeight);
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.pageUp = function (e) {
      if (!e.isComposing) {
        var t = this,
          n = t.containerEl,
          i = t.numVisibleItems,
          r = t.rowHeight,
          o = n.scrollTop - parseFloat(getComputedStyle(n).paddingTop),
          a = Math.floor(o / r);
        if (this.selectedItem <= a) {
          a -= i;
        }
        var s = Math.max(0, a);
        this.setSelectedItem(s, e);
        return !1;
      }
    };
    e.prototype.pageDown = function (e) {
      if (!e.isComposing) {
        var t = this,
          n = t.containerEl,
          i = t.numVisibleItems,
          r = t.rowHeight,
          o = n.scrollTop - parseFloat(getComputedStyle(n).paddingTop),
          a = Math.floor(o / r) + (i - 1);
        if (this.selectedItem >= a) {
          a += i;
        }
        var s = Math.min(this.suggestions.length - 1, a);
        this.setSelectedItem(s, e);
        return !1;
      }
    };
    e.prototype.setSuggestions = function (values) {
      var t = this.containerEl;
      t.empty();
      var suggestions = [];
      if (values)
        for (var i = 0, r = values; i < r.length; i++) {
          var o = r[i],
            a = t.createDiv("suggestion-item");
          this.chooser.renderSuggestion(o, a);
          suggestions.push(a);
        }
      this.values = values;
      this.suggestions = suggestions;
      this.setSelectedItem(0, null);
    };
    e.prototype.addSuggestion = function (e) {
      var t = this.values,
        n = this.suggestions;
      if (t) {
        var i = this.containerEl.createDiv("suggestion-item");
        this.chooser.renderSuggestion(e, i);
        t.push(e);
        n.push(i);
      }
    };
    e.prototype.addMessage = function (texte0) {
      return this.containerEl.createDiv({
        cls: "suggestion-empty",
        text: texte0,
      });
    };
    e.prototype.setSelectedItem = function (e, t) {
      var n = this.suggestions;
      if (n.length !== 0) {
        e < 0 ? (e = n.length - 1) : e >= n.length && (e = 0);
        this.forceSetSelectedItem(e, t);
      }
    };
    e.prototype.forceSetSelectedItem = function (selectedItem, t) {
      var n,
        i,
        r = this.suggestions,
        o = r[this.selectedItem];
      o && o.removeClass("is-selected");
      this.selectedItem = selectedItem;
      var a = r[this.selectedItem];
      a &&
        (a.addClass("is-selected"),
        (t && !t.instanceOf(KeyboardEvent)) ||
          a.scrollIntoView({
            block: "nearest",
          }));
      (i = (n = this.chooser).onSelectedChange) === null || undefined === i || i.call(n, this.values[selectedItem], t);
    };
    e.prototype.onSuggestionClick = function (e, t) {
      if (!e.defaultPrevented) {
        e.preventDefault();
        var n = this.suggestions.indexOf(t);
        this.setSelectedItem(n, e);
        this.useSelectedItem(e);
      }
    };
    e.prototype.onSuggestionMouseover = function (e, t) {
      var n = this.suggestions.indexOf(t);
      this.setSelectedItem(n, e);
    };
    e.prototype.useSelectedItem = function (e) {
      if (!this.values) return !1;
      var t = this.values[this.selectedItem];
      return undefined !== t && (this.chooser.selectSuggestion(t, e), !0);
    };
    return e;
  })(),
  Px = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.setSuggestions = function (values) {
      var t = this.containerEl;
      t.empty();
      var suggestions = [];
      if (values)
        for (var i = null, r = undefined, o = 0, a = values; o < a.length; o++) {
          var s = a[o];
          if (!(r && s.group === i)) {
            r = t.createDiv({
              cls: "suggestion-group",
              attr: {
                "data-group": s.group,
              },
            });
          }
          var l = r.createDiv("suggestion-item");
          this.chooser.renderSuggestion(s, l);
          suggestions.push(l);
          i = s.group;
        }
      var c = suggestions[this.selectedItem];
      c && c.addClass("is-selected");
      this.values = values;
      this.suggestions = suggestions;
    };
    return t;
  })(Ax),
  PopoverSuggest = (function () {
    function e(app, t) {
      var n = this;
      this.isOpen = false;
      this.app = app;
      this.scope = new Scope(t || app.scope);
      this.suggestEl = createDiv("suggestion-container");
      var i = (this.suggestInnerEl = this.suggestEl.createDiv("suggestion"));
      this.suggestions = new Ax(this, i, this.scope);
      this.scope.register([], "Escape", function (e) {
        n.onEscapeKey(e);
        return !1;
      });
    }
    e.prototype.onEscapeKey = function (e) {
      this.close();
    };
    e.prototype.attachDom = function () {
      var e = this.suggestEl;
      activeDocument.body.appendChild(e);
      fl(
        e,
        new cl({
          fn: "var(--anim-motion-swing)",
          duration: 80,
        }).addProp("opacity", "0", "1", ""),
      );
    };
    e.prototype.detachDom = function () {
      this.suggestEl.detach();
    };
    e.prototype.open = function () {
      var e = this.app;
      if (!this.isOpen) {
        this.isOpen = true;
        e.keymap.pushScope(this.scope);
        this.attachDom();
        NM(this);
      }
    };
    e.prototype.close = function () {
      var e = this.app;
      this.suggestEl;
      this.autoDestroy && (this.autoDestroy(), (this.autoDestroy = null));
      e.keymap.popScope(this.scope);
      this.isOpen && ((this.isOpen = false), this.suggestions.setSuggestions([]), this.detachDom(), RM(this));
    };
    e.prototype.reposition = function (e, t) {
      if (undefined === t) {
        t = "auto";
      }
      var n = this.suggestEl;
      positionFloatingElement(e, n, {
        gap: 5,
        preventOverlap: true,
        horizontalAlignment: {
          rtl: "right",
          ltr: "left",
          auto: getComputedStyle(n).direction === "rtl" ? "right" : "left",
        }[t],
      });
    };
    e.prototype.setAutoDestroy = function (e) {
      var t = this;
      this.autoDestroy && this.autoDestroy();
      e &&
        (this.autoDestroy = waitForElementHidden(e, 500, function () {
          t.close();
        }));
    };
    return e;
  })();
function Ix(e, t) {
  e.empty();
  for (
    var n = function (t) {
        e.createDiv("prompt-instruction", function (e) {
          e.createSpan({
            cls: "prompt-instruction-command",
            text: t.command,
          });
          e.createSpan({
            text: t.purpose,
          });
        });
      },
      i = 0,
      r = t;
    i < r.length;
    i++
  ) {
    n(r[i]);
  }
  return e;
}