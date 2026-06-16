var nJ = (function () {
  function e(doc) {
    if (undefined === doc) {
      doc = activeDocument;
    }
    var t = this;
    this.doc = doc;
    var n = (this.containerEl = createDiv("progress-bar-container")),
      i = (this.el = n.createDiv({
        cls: "progress-bar",
      }));
    this.messageEl = i.createDiv({
      cls: "progress-bar-message u-center-text",
    });
    i.createDiv("progress-bar-indicator", function (e) {
      e.createDiv("progress-bar-line");
      t.lineEl = e.createDiv("progress-bar-subline");
      t.line1El = e.createDiv("progress-bar-subline mod-increase");
      t.line2El = e.createDiv("progress-bar-subline mod-decrease");
    });
    this.contextEl = i.createDiv("progress-bar-context");
    n.addEventListener("click", function (e) {
      e.preventDefault();
    });
    this.setUnknownProgress();
  }
  Object.defineProperty(e, "instance", {
    get: function () {
      e._instance || (e._instance = new e());
      return e._instance;
    },
    enumerable: false,
    configurable: true,
  });
  e.prototype.show = function () {
    this.doc.body.prepend(this.containerEl);
    this.doc.body.addClass("in-progress");
    this.containerEl.style.opacity = "";
    return this;
  };
  e.prototype.hide = function () {
    this.containerEl.remove();
    this.doc.body.removeClass("in-progress");
    return this;
  };
  e.prototype.setMessage = function (e) {
    this.messageEl.setText(e);
    return this;
  };
  e.prototype.setUnknownProgress = function () {
    this.lineEl.hide();
    this.line1El.show();
    this.line2El.show();
    return this;
  };
  e.prototype.setProgress = function (e, t) {
    this.lineEl.show();
    this.line1El.hide();
    this.line2El.hide();
    var n = ((e / t) * 100).toFixed(4);
    this.lineEl.style.width = "".concat(n, "%");
    return this;
  };
  e.prototype.clearContext = function () {
    this.contextEl.empty();
    return this;
  };
  e.prototype.setContext = function (e) {
    this.contextEl.empty();
    e(this.contextEl);
    return this;
  };
  return e;
})();
function iJ(e) {
  for (var t = createDiv("loader-cube"), n = 1; n <= 9; n++)
    t.createDiv({
      cls: "sk-cube sk-cube".concat(n),
    });
  e && e.appendChild(t);
  return t;
}
function rJ(e) {
  var t = createDiv("loader-spinner");
  setIcon(t, "loader-2");
  e && e.appendChild(t);
  return t;
}
function oJ(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          n = rJ(e);
          i.label = 1;
        case 1:
          i.trys.push([1, , 3, 4]);
          return [4, t()];
        case 2:
          return [2, i.sent()];
        case 3:
          n.detach();
          return [7];
        case 4:
          return [2];
      }
    });
  });
}
i18nProxy.interface.startScreen.mobile;
var aJ,
  sJ = [],
  lJ = null,
  cJ = null,
  uJ = "Documents",
  hJ = false;
function pJ() {
  return __awaiter(this, undefined, undefined, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          e.trys.push([0, 2, , 3]);
          return [4, filesystemPlugin.checkPerms()];
        case 1:
          e.sent();
          hJ = true;
          return [3, 3];
        case 2:
          e.sent();
          hJ = false;
          return [3, 3];
        case 3:
          return [2, hJ];
      }
    });
  });
}
function dJ() {
  return __awaiter(this, undefined, Promise, function () {
    var e,
      t,
      n,
      i,
      r,
      o,
      location,
      s,
      l,
      c,
      u = this;
    return __generator(this, function (h) {
      switch (h.label) {
        case 0:
          e = [];
          t = function (t, n, i, r, o) {
            return __awaiter(u, undefined, undefined, function () {
              var a, s, l, c, u, nameh0;
              return __generator(this, function (p) {
                switch (p.label) {
                  case 0:
                    p.trys.push([0, 2, , 3]);
                    return [4, t.readdir(n)];
                  case 1:
                    a = p.sent();
                    return [3, 3];
                  case 2:
                    s = p.sent();
                    console.error(s);
                    return [2];
                  case 3:
                    for (l = 0, c = a; l < c.length; l++) {
                      u = c[l];
                      (nameh0 = u.name).startsWith(".") ||
                        (o && o.contains(nameh0)) ||
                        (u.type === "directory" &&
                          e.push({
                            name: nameh0,
                            location: i + nameh0,
                            storageType: r ? "iCloud" : "local",
                          }));
                    }
                    return [2];
                }
              });
            });
          };
          return isIOSPlatform ? (lJ ? [4, t(lJ, uJ, "icloud/", !0)] : [3, 2]) : [3, 4];
        case 1:
          h.sent();
          h.label = 2;
        case 2:
          return [4, t(aJ, "", "documents/")];
        case 3:
          h.sent();
          return [3, 13];
        case 4:
          return isAndroidPlatform ? ((n = []), [4, pJ()]) : [3, 13];
        case 5:
          if (!h.sent()) return [3, 11];
          i = aJ.getUri("") + "/";
          r = 0;
          o = sJ;
          h.label = 6;
        case 6:
          if (!(r < o.length)) return [3, 11];
          location = o[r];
          h.label = 7;
        case 7:
          h.trys.push([7, 9, , 10]);
          (s = cJ.getUri(location)).startsWith(i) &&
            ((l = s.substr(i.length)).contains("/") || n.push(decodeURIComponent(l)));
          return [4, cJ.stat(location)];
        case 8:
          h.sent().type === "directory" &&
            e.push({
              location: location,
              name: getFilename(location),
              storageType: "local",
            });
          return [3, 10];
        case 9:
          c = h.sent();
          console.error(c);
          return [3, 10];
        case 10:
          r++;
          return [3, 6];
        case 11:
          return [4, t(aJ, "", "", !1, n)];
        case 12:
          h.sent();
          h.label = 13;
        case 13:
          return [2, e];
      }
    });
  });
}
!(function () {
  function e(e) {
    var t = (this.el = e.createDiv("mobile-vault-chooser-action tappable"));
    this.iconEl = t.createDiv({
      cls: "mobile-vault-chooser-action-icon",
    });
    this.titleEl = t.createDiv({
      cls: "mobile-vault-chooser-action-name",
    });
  }
  e.prototype.setIcon = function (e) {
    setIcon(this.iconEl, e);
    return this;
  };
  e.prototype.setTitle = function (e) {
    this.titleEl.setText(e);
    return this;
  };
  e.prototype.onClick = function (e) {
    this.el.addEventListener("click", function (t) {
      if (!(t.button !== 0 || t.defaultPrevented)) {
        e(t);
      }
    });
    return this;
  };
  e.prototype.addButton = function (e, t) {
    var n = this.el.createDiv({
      cls: "mobile-vault-chooser-action-icon",
    });
    setIcon(n, e);
    t &&
      n.onClickEvent(function (e) {
        e.preventDefault();
        t(e);
      });
    return this;
  };
})();
var fJ = function (app, t) {
    var n = this;
    if (((this.app = app), Platform.isDesktopApp)) {
      var texti0 = app.vault.getName(),
        r = "";
      if (app.vault.adapter instanceof FileSystemAdapter) {
        r = app.vault.adapter.getBasePath();
      }
      var o = window.require("path");
      this.containerEl = t.createDiv("workspace-sidedock-vault-profile", function (e) {
        e.createDiv("workspace-drawer-vault-switcher", function (horizontalParent) {
          horizontalParent.createDiv("workspace-drawer-vault-switcher-icon", function (e) {
            return setIcon(e, "lucide-chevrons-up-down");
          });
          var t = horizontalParent.createDiv({
            cls: "workspace-drawer-vault-name",
            text: texti0,
          });
          horizontalParent.addEventListener("mouseover", function (i) {
            var o = n.app.vault,
              fileCount = i18nProxy.nouns.fileWithCount({
                count: o.getRoot().getFileCount(),
              }),
              folderCount = i18nProxy.nouns.folderWithCount({
                count: o.getRoot().getFolderCount(),
              }),
              l = i18nProxy.plugins.fileExplorer.tooltipFoldersFilesCount({
                fileCount: fileCount,
                folderCount: folderCount,
              });
            displayTooltip(t, r + "\n\n" + l, {
              placement: "top",
              gap: 24,
              horizontalParent: horizontalParent,
              delay: DEFAULT_TOOLTIP_DELAY,
            });
          });
          horizontalParent.addEventListener("mouseleave", hideTooltip);
          horizontalParent.addEventListener("click", function (t) {
            if (!horizontalParent.hasClass("has-active-menu")) {
              var i = electron.ipcRenderer.sendSync("vault").path,
                r = electron.ipcRenderer.sendSync("vault-list"),
                a = Menu.forEvent(t),
                s = function (e) {
                  if (!r.hasOwnProperty(e)) return "continue";
                  var t = r[e],
                    n = o.basename(t.path),
                    s = i === t.path;
                  a.addItem(function (e) {
                    return e
                      .setTitle(n)
                      .setChecked(s)
                      .onClick(function (e) {
                        if (!s) {
                          !0 !== window.electron.ipcRenderer.sendSync("vault-open", t.path, !1) &&
                            new Notice(i18nProxy.interface.startScreen.msgErrorFailedToOpenVault());
                        }
                      });
                  });
                };
              for (var l in r) s(l);
              a.addSeparator()
                .addItem(function (e) {
                  return e
                    .setTitle(i18nProxy.interface.manageVaults())
                    .setIcon("open-vault")
                    .onClick(function () {
                      return n.app.openVaultChooser();
                    });
                })
                .setParentElement(horizontalParent);
            }
          });
          horizontalParent.addEventListener("contextmenu", function (t) {
            var i = Menu.forEvent(t);
            i.addSections(["title", "open", "action", "", "danger"]);
            i.setParentElement(horizontalParent).addItem(function (e) {
              return e
                .setTitle(
                  Platform.isMacOS
                    ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac()
                    : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(),
                )
                .setIcon("lucide-arrow-up-right")
                .onClick(function () {
                  return n.app.showInFolder("");
                });
            });
          });
        });
        e.createDiv(
          {
            cls: "workspace-drawer-vault-actions",
          },
          function (e) {
            e.createSpan("clickable-icon", function (e) {
              setIcon(e, "help");
              e.addEventListener("click", function () {
                return n.app.openHelp();
              });
            });
            e.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-settings");
              e.addEventListener("click", function () {
                return n.app.setting.open();
              });
            });
          },
        );
      });
    }
  },
  mJ = 200,
  gJ = {
    duration: 140,
    fn: "var(--anim-motion-swing)",
  },
  WorkspaceItem = (function (e) {
    function t(workspace, n) {
      var i = e.call(this) || this;
      i.containerEl = null;
      i.dimension = null;
      i.component = new Component();
      i.app = workspace.app;
      i.workspace = workspace;
      i.id = n || ic(16);
      var r = (i.containerEl = createDiv()),
        o = (i.resizeHandleEl = r.createEl("hr", "workspace-leaf-resize-handle"));
      i.component.load();
      o.addEventListener("mousedown", i.onResizeStart.bind(i));
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "parentSplit", {
      get: function () {
        return this.parent;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.serialize = function () {
      var e = {
        id: this.id,
        type: this.type,
      };
      this.dimension && (e.dimension = this.dimension);
      return e;
    };
    t.prototype.onResizeStart = function (e) {
      if (e.button === 0) {
        e.preventDefault();
        var t = this.parent;
        if (t instanceof WorkspaceSplit) {
          t.onChildResizeStart(this, e);
        }
      }
    };
    t.prototype.setParent = function (parent) {
      this.parent = parent;
    };
    t.prototype.getRoot = function () {
      for (var e = this; e.parent; ) e = e.parent;
      return e;
    };
    t.prototype.getContainer = function () {
      for (var e = this; e.parent; ) {
        if (e instanceof WorkspaceContainer) return e;
        e = e.parent;
      }
      return e instanceof WorkspaceContainer ? e : this.workspace.rootSplit;
    };
    t.prototype.setDimension = function (dimension) {
      dimension !== null && (dimension <= 0 || dimension >= 100) && (dimension = null);
      this.dimension = dimension;
      var t = this.containerEl,
        flexGrow = "";
      dimension && (flexGrow = String(dimension));
      t.style.flexGrow = flexGrow;
    };
    t.prototype.detach = function () {
      if (this.parent) {
        this.parent.removeChild(this);
      }
    };
    t.prototype.getIcon = function () {
      return "lucide-file";
    };
    return t;
  })(Events),
  WorkspaceParent = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.allowSingleChild = false;
      t.autoManageDOM = true;
      return t;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      t.children = this.children.map(function (e) {
        return e.serialize();
      });
      return t;
    };
    t.prototype.replaceChild = function (e, t) {
      var n = this,
        i = n.workspace,
        r = n.autoManageDOM,
        o = n.containerEl,
        a = n.children;
      e < 0 && (e = 0);
      e >= a.length && (e = a.length);
      var s = a[e],
        l = s.containerEl.nextSibling;
      if ((r && s.containerEl.detach(), s.setParent(null), (a[e] = t), r)) {
        var c = t.containerEl;
        o.insertBefore(c, l);
      }
      t.setParent(this);
      i.onLayoutChange(this);
    };
    t.prototype.insertChild = function (e, t) {
      var n = this,
        i = n.workspace,
        r = n.autoManageDOM,
        o = n.containerEl,
        a = n.children;
      if (e < 0 || e >= a.length) {
        e = a.length;
      }
      var s = a[e],
        l = s ? s.containerEl : null;
      if ((a.splice(e, 0, t), r)) {
        var c = t.containerEl;
        o.insertBefore(c, l);
      }
      t.setParent(this);
      i.onLayoutChange(this);
    };
    t.prototype.removeChild = function (e) {
      var t = this,
        n = t.workspace,
        i = t.autoManageDOM,
        r = t.parent,
        o = t.children;
      if ((o.remove(e), e.setParent(null), i && e.containerEl.detach(), r))
        if (o.length !== 1 || this.allowSingleChild) {
          if (o.length === 0) return void r.removeChild(this);
        } else {
          var a = o[0];
          o.remove(a);
          i && a.containerEl.detach();
          a.setParent(null);
          var s = r.children.indexOf(this);
          i && r.replaceChild(s, a);
          a.setDimension(this.dimension);
        }
      n.onLayoutChange(this);
    };
    t.prototype.recomputeChildrenDimensions = function () {};
    return t;
  })(WorkspaceItem),
  WorkspaceSplit = (function (e) {
    function t(workspace, n, i) {
      var r = e.call(this, workspace, i) || this;
      r.parent = null;
      r.children = [];
      r.type = "split";
      r.direction = null;
      r.resizeStartPos = null;
      r.originalSizes = null;
      r.isResizing = false;
      r.workspace = workspace;
      r.containerEl.addClass("workspace-split");
      r.setDirection(n);
      return r;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      t.direction = this.direction;
      return t;
    };
    t.prototype.setDirection = function (direction) {
      this.containerEl.removeClass("mod-" + this.direction);
      this.direction = direction;
      this.containerEl.addClass("mod-" + direction);
    };
    t.prototype.recomputeChildrenDimensions = function () {
      for (var e = this.children, t = 0, n = 0, i = e; n < i.length; n++) {
        if ((a = i[n]).dimension == null) {
          t = null;
          break;
        }
        t += a.dimension;
      }
      for (var r = 0, o = e; r < o.length; r++) {
        var a = o[r];
        t == null || isNaN(t) ? a.setDimension(null) : a.setDimension((100 * a.dimension) / t);
      }
      this.workspace.requestResize();
    };
    t.prototype.onChildResizeStart = function (e, t) {
      var n = this;
      if (t.button === 0) {
        var i = t.win;
        this.resizeStartPos = {
          x: t.clientX,
          y: t.clientY,
        };
        var r = function (t) {
            if (t.button === 0) {
              var i = t.clientX,
                r = t.clientY,
                o = 0;
              n.direction === "vertical"
                ? (o = i - n.resizeStartPos.x)
                : n.direction === "horizontal" && (o = r - n.resizeStartPos.y);
              var a = n.children.indexOf(e);
              if (
                (n.isResizing ||
                  ((n.originalSizes = n.children.map(function (e) {
                    return n.getElSize(e.containerEl);
                  })),
                  (n.isResizing = true)),
                n.isResizing)
              ) {
                var s = n.children.slice(0, a + 1),
                  l = n.children.slice(a + 1);
                if ((s.reverse(), o > 0)) {
                  var c = n.resizeItemsByDiff(l, o, 1);
                  Math.abs(o) > c && (o = c);
                  n.resizeItemsByDiff(s, o, -1);
                } else {
                  c = n.resizeItemsByDiff(s, o, -1);
                  Math.abs(o) > c && (o = -c);
                  n.resizeItemsByDiff(l, o, 1);
                }
                t.preventDefault();
              }
            }
          },
          o = function () {
            i.removeEventListener("mousemove", r);
            i.removeEventListener("mouseup", o);
            document.body.removeClass("is-grabbing");
            try {
              n.finishResize();
            } catch (e) {
              console.error(e);
            }
          };
        i.addEventListener("mousemove", r);
        i.addEventListener("mouseup", o);
        document.body.addClass("is-grabbing");
      }
    };
    t.prototype.resizeItemsByDiff = function (e, t, n) {
      for (var i = 0, r = 0, o = e; r < o.length; r++) {
        var a = o[r],
          s = this.children.indexOf(a),
          l = this.originalSizes[s],
          c = l - t * n,
          u = l - (c = Math.max(200, c));
        t -= u * n;
        i += Math.abs(u);
        this.setElSize(this.children[s].containerEl, c);
      }
      return i;
    };
    t.prototype.finishResize = function () {
      this.isResizing = false;
      this.resizeStartPos = null;
      for (var e = this.children, t = [], n = 0, i = 0, r = e; i < r.length; i++) {
        var o = r[i],
          a = this.getElSize(o.containerEl);
        t.push(a);
        n += a;
      }
      for (var s = 0; s < e.length; s++) {
        o = e[s];
        a = t[s];
        this.unsetElSize(o.containerEl);
        var l = (a / n) * 100;
        o.setDimension(l);
      }
      this.workspace.requestSaveLayout();
      this.workspace.requestResize();
    };
    t.prototype.getElSize = function (e) {
      return this.direction === "vertical"
        ? e.offsetWidth
        : this.direction === "horizontal"
          ? e.offsetHeight
          : undefined;
    };
    t.prototype.setElSize = function (e, t) {
      e.style.flex = "0 0 auto";
      return this.direction === "vertical"
        ? (e.style.width = "".concat(t, "px"))
        : this.direction === "horizontal"
          ? (e.style.height = "".concat(t, "px"))
          : undefined;
    };
    t.prototype.unsetElSize = function (e) {
      e.style.flex = "";
      e.style.width = "";
      e.style.height = "";
    };
    return t;
  })(WorkspaceParent),
  WorkspaceSidedock = (function (e) {
    function t(t, n, side, r) {
      var o = e.call(this, t, n, r) || this;
      o.size = 300;
      o.collapsed = false;
      o.emptyStateEl = null;
      o.side = side;
      o.containerEl.addClass("mod-sidedock");
      o.containerEl.addClass("mod-".concat(side, "-split"));
      o.workspace.containerEl.addClass("is-".concat(side, "-sidedock-open"));
      side === "left" && new fJ(t.app, o.containerEl);
      o.resizeHandleEl.addEventListener("mousedown", o.onSidedockResizeStart.bind(o));
      o.emptyStateEl = o.containerEl.createDiv("workspace-sidedock-empty-state", function (e) {
        e.createEl("p", {
          cls: "u-muted",
          text: i18nProxy.interface.emptySidebar(),
        });
      });
      o.setSize(o.size);
      return o;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      t.width = this.size;
      this.collapsed && (t.collapsed = true);
      return t;
    };
    t.prototype.setSize = function (size) {
      this.size = size;
      this.containerEl.style.width = "".concat(size, "px");
    };
    t.prototype.toggle = function () {
      this.collapsed ? this.expand() : this.collapse();
    };
    t.prototype.collapse = function () {
      if (!this.collapsed) {
        this.collapsed = true;
        var e = this,
          t = e.workspace,
          n = e.side,
          i = e.containerEl,
          r = e.resizeHandleEl,
          o = e.children;
        if (
          (t.containerEl.removeClass("is-".concat(n, "-sidedock-open")),
          i.addClass("is-sidedock-collapsed"),
          n === "left" ? t.leftRibbon.setCollapsedState(!0) : n === "right" && t.rightRibbon.setCollapsedState(!0),
          this.workspace.layoutReady)
        ) {
          for (
            var minWidth = "".concat(this.size, "px"),
              s = o.map(function (e) {
                return e.containerEl;
              }),
              l = 0,
              c = s;
            l < c.length;
            l++
          ) {
            c[l].style.minWidth = minWidth;
          }
          pl(i, !0);
          i.style.overflow = "hidden";
          fl(i, new cl(gJ).addProp("width", minWidth, "0"), function () {
            i.hide();
            i.style.overflow = "";
            for (var e = 0, n = s; e < n.length; e++) {
              n[e].style.minWidth = "";
            }
            t.requestResize();
          });
        } else {
          i.hide();
          i.style.width = "0";
        }
        var u = t.activeLeaf,
          h = t.rootSplit;
        u &&
          u.getRoot() === this &&
          t.setActiveLeaf(t.getMostRecentLeaf(h), {
            focus: !0,
          });
        t.requestSaveLayout();
        t.updateFrameless();
        r.style.opacity = "0";
      }
    };
    t.prototype.expand = function () {
      if (this.collapsed) {
        this.collapsed = false;
        var e = this,
          t = e.workspace,
          n = e.side,
          i = e.containerEl,
          r = e.resizeHandleEl,
          o = e.children;
        t.containerEl.addClass("is-".concat(n, "-sidedock-open"));
        i.removeClass("is-sidedock-collapsed");
        n === "left" ? t.leftRibbon.setCollapsedState(!1) : n === "right" && t.rightRibbon.setCollapsedState(!1);
        for (
          var minWidth = "".concat(this.size, "px"),
            s = o.map(function (e) {
              return e.containerEl;
            }),
            l = 0,
            c = s;
          l < c.length;
          l++
        ) {
          c[l].style.minWidth = minWidth;
        }
        i.show();
        pl(i, !0);
        i.style.overflow = "hidden";
        fl(i, new cl(gJ).addProp("width", "0", minWidth), function () {
          i.style.overflow = "";
          for (var e = 0, n = s; e < n.length; e++) {
            n[e].style.minWidth = "";
          }
          t.requestResize();
        });
        t.requestSaveLayout();
        t.updateFrameless();
        r.style.opacity = "1";
      }
    };
    t.prototype.onSidedockResizeStart = function (e) {
      var t = this;
      if (e.button === 0) {
        var n = e.win;
        this.app.disableCssTransition();
        var i = function (e) {
            var n = e.clientX,
              i = mJ,
              r = t.containerEl.getBoundingClientRect();
            if (
              (t.side === "left"
                ? ((i = n - r.x), (i += t.resizeHandleEl.offsetWidth / 2))
                : t.side === "right" &&
                  ((i = t.workspace.containerEl.clientWidth - n), (i += t.resizeHandleEl.offsetWidth / 2)),
              !t.collapsed && i < 50)
            )
              t.collapse();
            else if (t.collapsed && i >= mJ) t.expand();
            else if (!t.collapsed) {
              var o = t.workspace.containerEl.clientWidth,
                a = Math.clamp(i, mJ, Math.max(mJ, 0.8 * o));
              t.setSize(a);
            }
            e.preventDefault();
          },
          r = function (e) {
            if (e.button === 0) {
              n.removeEventListener("mousemove", i);
              n.removeEventListener("mouseup", r);
              document.body.removeClass("is-grabbing");
              t.app.enableCssTransition();
              t.workspace.requestSaveLayout();
              t.workspace.requestResize();
            }
          };
        n.addEventListener("mousemove", i);
        n.addEventListener("mouseup", r);
        document.body.addClass("is-grabbing");
      }
    };
    t.prototype.recomputeChildrenDimensions = function () {
      e.prototype.recomputeChildrenDimensions.call(this);
      this.children.length === 0
        ? (this.collapse(), this.emptyStateEl.show(), this.side === "right" && this.workspace.rightRibbon.hide())
        : (this.emptyStateEl.hide(), this.side === "right" && this.workspace.rightRibbon.show());
    };
    return t;
  })(WorkspaceSplit),
  WorkspaceContainer = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.allowSingleChild = true;
      return t;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      var e = this;
      setTimeout(function () {
        if (e.doc.hasFocus()) {
          var t = !!e.doc.querySelector(".modal-container"),
            n = e.workspace,
            i = n.activeLeaf;
          if (!i || i.getContainer() !== e) {
            var r = n.getMostRecentLeaf(e);
            if (r) {
              n.setActiveLeaf(r, {
                focus: !Platform.isMobile && !t,
              });
            }
          }
        }
      }, 100);
    };
    t.prototype.focus = function () {
      if (Platform.isDesktopApp && !this.doc.hasFocus()) {
        var e = this.win.electronWindow;
        e.isMinimized() && e.restore();
        e.focus();
      }
    };
    return t;
  })(WorkspaceSplit),
  CJ = (function (e) {
    function t(n, side, r) {
      var o = e.call(this, n, r) || this;
      o.type = "mobile-drawer";
      o.children = [];
      o.allowSingleChild = true;
      o.autoManageDOM = false;
      o.currentTab = 0;
      o.collapsed = false;
      o.isPinned = false;
      o.containerEl = null;
      o.backdropEl = null;
      o.innerEl = null;
      o.headerEl = null;
      o.tabContainerEl = null;
      o.activeTabContentEl = null;
      o.pinIconEl = null;
      o.side = side;
      o.collapsed = true;
      var a = (o.containerEl = createDiv("workspace-drawer"));
      a.hide();
      var s = (o.innerEl = a.createDiv("workspace-drawer-inner"));
      o.backdropEl = createDiv("workspace-drawer-backdrop", function (e) {
        e.addEventListener("click", o.collapse.bind(o));
        e.style.opacity = "0";
      });
      o.headerEl = s.createDiv("workspace-drawer-header");
      var l = (o.tabContainerEl = s.createDiv("workspace-drawer-tab-container")),
        c = (o.activeTabEl = l.createDiv("workspace-drawer-active-tab-container")),
        u = (o.activeTabHeaderEl = c.createEl("label", "workspace-drawer-active-tab-header tappable")),
        h = (o.activeTabSelectEl = u.createEl("select"));
      h.addEventListener("change", function (e) {
        o.selectTabIndex(Number(h.value));
        u.removeClass("is-open");
      });
      o.activeTabIconEl = u.createSpan("workspace-drawer-active-tab-icon");
      o.activeTabTitleEl = u.createSpan("workspace-drawer-active-tab-title");
      u.addEventListener("contextmenu", function (e) {
        var t = o.children[o.currentTab];
        if (!(t == null)) {
          t.onOpenTabHeaderMenu(e, u);
        }
      });
      u.createDiv("clickable-icon workspace-drawer-active-tab-chevron", function (e) {
        setIcon(e, "lucide-chevrons-up-down");
      });
      o.activeTabContentEl = c.createDiv("workspace-drawer-active-tab-content");
      o.component.registerEvent(n.on("active-leaf-change", o.onLeafChange, o));
      var p = side === "left" ? 1 : -1;
      o.component.registerEvent(
        n.on("swipe", function (e) {
          if (!o.isPinned && !(e.points > 1 || e.direction !== "x")) {
            var n = o,
              r = n.containerEl,
              a = n.backdropEl;
            pl(r);
            pl(a);
            var s = o.workspace.leftSplit,
              l = o.workspace.rightSplit,
              c = s.collapsed || (s instanceof t && s.isPinned),
              u = l.collapsed || (l instanceof t && l.isPinned),
              h = c && u && ((side === "left" && e.x > e.startX) || (side === "right" && e.x < e.startX));
            if (o.collapsed) {
              if (h) {
                o.collapsed = false;
                clearFocusAndSelection();
                r.show();
                o.fixIosEvent();
                o.workspace.containerEl.appendChild(a);
                var d = r.offsetWidth;
                e.registerCallback({
                  move: function (t) {
                    var n = Math.clamp(((t - e.startX) * p) / d, 0, 1);
                    n = Math.clamp(n, 0, 1);
                    r.style.transform = "translateX(".concat(-(1 - n) * d * p, "px)");
                    a.style.opacity = String(n);
                  },
                  cancel: function () {
                    r.style.transform = "";
                    r.hide();
                    a.detach();
                    o.collapsed = true;
                  },
                  finish: function (t, n, i) {
                    var s,
                      l = Math.clamp(((t - e.startX) * p) / d, 0, 1);
                    i * p > d / 2
                      ? (fl(
                          r,
                          new cl({
                            duration: 150 * (s = 1 - l),
                            fn: "ease-out",
                          }).addProp("transform", null, "translateX(0)", ""),
                        ),
                        fl(
                          a,
                          new cl({
                            duration: 150 * s,
                            fn: "linear",
                          }).addProp("opacity", null, "1", ""),
                        ),
                        o.onExpand())
                      : ((o.collapsed = true),
                        o.onCollapse(),
                        fl(
                          r,
                          new cl({
                            duration: 150 * (s = l),
                          }).addProp("transform", null, "translateX(".concat(-d * p, "px)"), ""),
                          function () {
                            r.hide();
                          },
                        ),
                        fl(
                          a,
                          new cl({
                            duration: 150 * s,
                            fn: "linear",
                          }).addProp("opacity", null, "0"),
                          function () {
                            a.detach();
                          },
                        ));
                  },
                });
              }
            } else {
              var f = r.offsetWidth;
              e.registerCallback({
                move: function (t) {
                  var n = Math.clamp((-(t - e.startX) * p) / f, 0, 1);
                  r.style.transform = "translateX(".concat(-n * f * p, "px)");
                  a.style.opacity = String(1 - n);
                },
                cancel: function () {
                  r.style.transform = "";
                  a.style.opacity = "";
                },
                finish: function (t, n, i) {
                  var s,
                    l = Math.clamp((-(t - e.startX) * p) / f, 0, 1);
                  -i * p < f / 2
                    ? (fl(
                        r,
                        new cl({
                          duration: 150 * (s = l),
                        }).addProp("transform", null, "translateX(0)", ""),
                      ),
                      fl(
                        a,
                        new cl({
                          duration: 150 * s,
                          fn: "linear",
                        }).addProp("opacity", null, "1", ""),
                      ))
                    : ((o.collapsed = true),
                      o.onCollapse(),
                      fl(
                        r,
                        new cl({
                          duration: 150 * (s = 1 - l),
                          fn: "ease-out",
                        }).addProp("transform", null, "translateX(".concat(-f * p, "px)"), ""),
                        function () {
                          r.hide();
                        },
                      ),
                      fl(
                        a,
                        new cl({
                          duration: 150 * s,
                          fn: "linear",
                        }).addProp("opacity", null, "0"),
                        function () {
                          a.detach();
                        },
                      ));
                },
              });
            }
          }
        }),
      );
      n.on("resize", function () {
        if (Platform.isPhone && o.isPinned) {
          o.setPinned(!1);
        }
      });
      return o;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      t.currentTab = this.currentTab;
      this.isPinned && (t.pinned = true);
      return t;
    };
    t.prototype.onLeafChange = function (e) {
      if (!(this.collapsed || (e && e.getRoot() === this))) {
        this.collapse();
      }
    };
    t.prototype.expand = function () {
      if (this.collapsed) {
        this.collapsed = false;
        this.onExpand();
        var e = this.containerEl,
          t = this.backdropEl;
        e.show();
        this.fixIosEvent();
        this.workspace.containerEl.appendChild(t);
        clearFocusAndSelection();
        var n = e.offsetWidth * (this.side === "left" ? -1 : 1);
        fl(
          t,
          new cl({
            duration: 150,
            fn: "linear",
          }).addProp("opacity", "0", "1"),
        );
        fl(
          e,
          new cl({
            duration: 150,
          }).addProp("transform", "translateX(".concat(n, "px)"), "translateX(0)", ""),
        );
      }
    };
    t.prototype.fixIosEvent = function () {
      if (Platform.isIosApp) {
        var e = this.containerEl;
        e.show();
        e.offsetHeight;
        e.hide();
        e.offsetHeight;
        e.show();
      }
    };
    t.prototype.onExpand = function () {};
    t.prototype.collapse = function () {
      if (!this.isPinned && !this.collapsed) {
        this.collapsed = true;
        this.onCollapse();
        var e = this.containerEl,
          t = this.backdropEl;
        clearFocusAndSelection();
        var n = e.offsetWidth * (this.side === "left" ? -1 : 1);
        fl(
          t,
          new cl({
            duration: 150,
            fn: "linear",
          }).addProp("opacity", "1", "0"),
          function () {
            t.detach();
          },
        );
        fl(
          e,
          new cl({
            duration: 150,
          }).addProp("transform", "translateX(0)", "translateX(".concat(n, "px)"), ""),
          function () {
            e.hide();
          },
        );
      }
    };
    t.prototype.onCollapse = function () {
      var e = this.workspace,
        t = e.activeLeaf,
        n = e.rootSplit;
      if (t && t.getRoot() === this) {
        e.setActiveLeaf(e.getMostRecentLeaf(n));
      }
    };
    t.prototype.toggle = function () {
      this.collapsed ? this.expand() : this.collapse();
    };
    t.prototype.selectTabIndex = function (currentTab) {
      this.currentTab = currentTab;
      this.recomputeChildrenDimensions();
      this.workspace.requestSaveLayout();
      this.workspace.requestResize();
    };
    t.prototype.selectTab = function (e) {
      var t = this.children.indexOf(e);
      if (-1 !== t) {
        this.selectTabIndex(t);
      }
    };
    t.prototype.recomputeChildrenDimensions = function () {
      var e = this,
        t = this,
        n = t.innerEl,
        i = t.children,
        r = t.headerEl,
        o = t.currentTab,
        a = undefined === o ? 0 : o,
        s = t.tabContainerEl,
        l = t.activeTabIconEl,
        c = t.activeTabSelectEl,
        u = t.activeTabTitleEl,
        h = t.activeTabContentEl;
      this.currentTab = Math.clamp(a, 0, i.length - 1);
      var p = i[this.currentTab];
      if (
        (p
          ? (setIcon(l, p.getIcon()), u.setText(p.getDisplayText()), h.setChildrenInPlace([p.containerEl]))
          : (l.empty(), u.setText(i18nProxy.interface.emptyState.empty()), h.empty()),
        c.setChildrenInPlace(
          i.map(function (t, n) {
            var i = createEl("option", {
              text: t.getDisplayText(),
              value: String(n),
            });
            n === e.currentTab && (i.selected = true);
            return i;
          }),
        ),
        this.side === "left")
      ) {
        var d = this.workspace.leftRibbon.containerEl;
        d.removeClass("workspace-ribbon");
        d.addClass("workspace-drawer-ribbon");
        n.setChildrenInPlace([d, r, s]);
      } else if (this.side === "right") {
        n.setChildrenInPlace([r, s]);
      }
    };
    t.prototype.openLeaf = function (e) {
      var t = this.children.indexOf(e);
      if (-1 !== t) {
        this.selectTabIndex(t);
      }
    };
    t.prototype.addHeaderButton = function (e, t) {
      return this.headerEl.createDiv("clickable-icon workspace-drawer-header-icon", function (n) {
        setIcon(n, e);
        n.addEventListener("click", t);
      });
    };
    t.prototype.setPinned = function (isPinned) {
      Platform.canPinSidebar || (isPinned = false);
      this.isPinned !== isPinned &&
        ((this.isPinned = isPinned),
        this.containerEl.toggleClass("is-pinned", isPinned),
        this.backdropEl.toggle(!isPinned),
        isPinned ? this.expand() : this.collapse(),
        this.workspace.requestUpdateLayout());
    };
    t.prototype.togglePinned = function () {
      this.setPinned(!this.isPinned);
    };
    return t;
  })(WorkspaceParent),
  EJ = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, "left", n) || this;
      i.fileCountEl = null;
      var r = i.app.vault;
      i.headerEl.createDiv("workspace-drawer-header-left", function (e) {
        e.createDiv(
          {
            cls: "workspace-drawer-header-name",
          },
          function (e) {
            e.createEl("label", "workspace-drawer-header-switcher", function (e) {
              e.createSpan({
                cls: "workspace-drawer-header-name-text",
                text: r.getName(),
              });
              e.createSpan("workspace-drawer-header-name-chevron", function (e) {
                return setIcon(e, "lucide-chevron-down");
              });
              var t = e.createEl("select", "", function (e) {
                return __awaiter(i, undefined, undefined, function () {
                  var t, n, i, r, o, texta0, s;
                  return __generator(this, function (l) {
                    switch (l.label) {
                      case 0:
                        t = e.createEl("option", {
                          text: i18nProxy.interface.manageVaults(),
                          value: "manage-vaults",
                        });
                        n = localStorage.getItem("mobile-selected-vault");
                        i = 0;
                        return [4, dJ()];
                      case 1:
                        r = l.sent();
                        l.label = 2;
                      case 2:
                        if (!(i < r.length)) return [3, 4];
                        o = r[i];
                        texta0 = o.name;
                        o.storageType === "iCloud" && (texta0 += " (iCloud)");
                        s = e.createEl("option", {
                          text: texta0,
                          value: o.location,
                        });
                        n === o.location && (s.selected = true);
                        l.label = 3;
                      case 3:
                        i++;
                        return [3, 2];
                      case 4:
                        e.appendChild(t);
                        return [2];
                    }
                  });
                });
              });
              t.addEventListener("change", function (e) {
                var n = t.value;
                n === "manage-vaults"
                  ? i.app.openVaultChooser()
                  : (window.localStorage.setItem("mobile-selected-vault", n), location.reload());
              });
            });
          },
        );
        e.createDiv("workspace-drawer-header-info", function (e) {
          i.fileCountEl = e.createDiv();
          i.updateInfo();
        });
      });
      i.addHeaderButton("lucide-settings", function (e) {
        i.app.setting.open();
      }).addClass("mod-settings");
      i.pinIconEl = i.addHeaderButton("pin", function (e) {
        i.togglePinned();
      });
      i.pinIconEl.addClass("mod-pin");
      i.containerEl.addClass("mod-left");
      i.component.registerEvent(r.on("create", i.updateInfo.bind(i)));
      i.component.registerEvent(r.on("delete", i.updateInfo.bind(i)));
      return i;
    }
    __extends(t, e);
    t.prototype.updateInfo = function () {
      var e = this.app.vault,
        fileCount = i18nProxy.nouns.fileWithCount({
          count: e.getRoot().getFileCount(),
        }),
        folderCount = i18nProxy.nouns.folderWithCount({
          count: e.getRoot().getFolderCount(),
        }),
        i = i18nProxy.plugins.fileExplorer.tooltipFoldersFilesCount({
          fileCount: fileCount,
          folderCount: folderCount,
        });
      this.fileCountEl.setText(i);
    };
    return t;
  })(CJ),
  SJ = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, "right", n) || this;
      i.fileNameEl = null;
      i.fileInfoElToRenderer = [];
      var r = i.headerEl,
        o = t.mobileFileInfos;
      r.createDiv("workspace-drawer-header-left", function (e) {
        e.createDiv(
          {
            cls: "workspace-drawer-header-name",
          },
          function (e) {
            i.fileNameEl = e.createDiv({
              cls: "workspace-drawer-header-name-text",
              text: i18nProxy.interface.noFile(),
            });
          },
        );
        e.createDiv("workspace-drawer-header-info", function (e) {
          for (var t = 0, n = o; t < n.length; t++) {
            var r = n[t],
              a = e.createDiv("workspace-drawer-header-info-item");
            i.fileInfoElToRenderer.push({
              el: a,
              renderer: r.renderCallback,
            });
          }
        });
      });
      i.containerEl.addClass("mod-right");
      i.component.registerEvent(i.app.vault.on("rename", i.updateName.bind(i)));
      i.component.registerEvent(t.on("quick-preview", i.onQuickPreview, i));
      i.component.registerEvent(t.on("file-open", i.onFileOpen, i));
      i.pinIconEl = i.addHeaderButton("pin", function (e) {
        i.togglePinned();
      });
      i.pinIconEl.addClass("mod-pin");
      return i;
    }
    __extends(t, e);
    t.prototype.onFileOpen = function (e) {
      this.updateName(e);
      this.updateInfo();
    };
    t.prototype.onQuickPreview = function (e) {
      if (this.app.workspace.getActiveFile() === e) {
        this.updateInfo();
      }
    };
    t.prototype.updateName = function (e) {
      var t = e ? e.getShortName() : i18nProxy.interface.noFile();
      this.fileNameEl.setText(t);
    };
    t.prototype.updateInfo = function () {
      for (var e = 0, t = this.fileInfoElToRenderer; e < t.length; e++) {
        var n = t[e];
        n.renderer(n.el);
      }
    };
    return t;
  })(CJ),
  MJ = i18nProxy.plugins.search,
  xJ = [
    {
      type: "operator",
      name: "path:",
      token: "path:",
      infoTextI18n: i18nProxy.plugins.search.labelPathOptionDescription,
    },
    {
      type: "operator",
      name: "file:",
      token: "file:",
      infoTextI18n: i18nProxy.plugins.search.labelFileNameOptionDescription,
    },
    {
      type: "operator",
      name: "tag:",
      token: "tag:",
      infoTextI18n: i18nProxy.plugins.search.labelTagOptionDescription,
    },
    {
      type: "operator",
      name: "line:",
      token: "line:()",
      infoTextI18n: i18nProxy.plugins.search.labelLineOptionDescription,
    },
    {
      type: "operator",
      name: "section:",
      token: "section:()",
      infoTextI18n: i18nProxy.plugins.search.labelSectionOptionDescription,
    },
    {
      type: "operator",
      name: "[property]",
      token: "[]",
      infoTextI18n: i18nProxy.plugins.search.labelPropertyOptionDescription,
    },
  ],
  TJ = (function (e) {
    function t(t, inputEl, showHistory, r) {
      if (undefined === r) {
        r = false;
      }
      var o = e.call(this, t) || this;
      o.inputEl = null;
      o.showHistory = true;
      o.tokens = [];
      o.inputEl = inputEl;
      o.showHistory = showHistory;
      r ||
        (inputEl.addEventListener("input", o.onInputChange.bind(o)),
        inputEl.addEventListener("focus", o.onInputChange.bind(o)));
      inputEl.addEventListener("blur", o.close.bind(o));
      o.suggestEl.on("mousedown", ".suggestion-item", function (e) {
        e.preventDefault();
      });
      o.suggestEl.addClass("mod-search-suggestion");
      o.scope.register(["Shift"], "Enter", function (e) {
        o.suggestions.useSelectedItem(e);
        return !1;
      });
      return o;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      var n = this;
      t.addClass("mod-complex", "search-suggest-item");
      var i = t.createDiv("suggestion-content"),
        r = t.createDiv("suggestion-aux"),
        o = i.createDiv("suggestion-title");
      o.createSpan({
        text: e.name,
      });
      e.type === "operator"
        ? o.createSpan({
            cls: "search-suggest-info-text",
            text: e.infoTextI18n(),
          })
        : e.type === "group" &&
          (t.addClass("mod-group"),
          o.addClass("list-item-part", "mod-extended"),
          r.createDiv("list-item-part search-suggest-icon clickable-icon", function (t) {
            setIcon(t, e.icon);
            setTooltip(t, e.iconTooltip);
            t.addEventListener("click", function (t) {
              t.preventDefault();
              t.stopPropagation();
              e.callback();
              n.onInputChange();
            });
          }));
    };
    t.prototype.getSuggestions = function (e) {
      var t = this,
        n = this.inputEl;
      if (n.selectionStart !== n.selectionEnd) return [];
      var i = n.selectionStart;
      if (n.selectionStart < e.length - 1 && e.charAt(i) !== " ") return [];
      var r,
        o = (this.tokens = TF(e.slice(0, i)));
      try {
        r = kF(o, qF);
      } catch (e) {
        return [];
      }
      var a = r == null ? undefined : r.getContext(i),
        s = "";
      if (a) {
        var l = a.token;
        if (["quote", "text", "regex"].contains(l.type)) {
          s = l.content;
        }
        var c = a.matcherStack[0];
        if (
          ((c instanceof dF || c instanceof fF) && (a.matcherStack.shift(), (c = a.matcherStack[0])), c instanceof pF)
        ) {
          if (c.value || l.type === "colon" || l.content === "]") return [];
          for (
            var u = [],
              h = prepareFuzzySearch(s),
              p = 0,
              d = Object.keys(this.app.metadataTypeManager.getAllProperties());
            p < d.length;
            p++
          ) {
            var namef0 = d[p];
            if ((S = h(namef0))) {
              u.push({
                type: "property-key",
                name: namef0,
                score: S.score,
              });
            }
          }
          return u.length > 0
            ? (u.sort(function (e, t) {
                return t.score - e.score;
              }),
              __spreadArray(
                [
                  {
                    type: "group",
                    name: MJ.labelPropertiesGroup(),
                    icon: "lucide-info",
                    iconTooltip: MJ.tooltipReadMore(),
                    callback: function () {
                      window.open("https://help.obsidian.md/Plugins/Search", "_blank");
                    },
                  },
                ],
                u,
                !0,
              ))
            : [];
        }
        if (c instanceof zF) {
          h = prepareFuzzySearch(s);
          var m = [],
            g = Object.keys(this.app.metadataCache.getTags());
          g.sort(Eb);
          for (var v = 0, y = g; v < y.length; v++) {
            var nameb0 = y[v];
            if ((S = h(nameb0.slice(1)))) {
              m.push({
                type: "string",
                name: nameb0,
                score: S.score,
              });
            }
          }
          return m.length > 0
            ? (m.sort(function (e, t) {
                return t.score - e.score;
              }),
              __spreadArray(
                [
                  {
                    type: "group",
                    name: MJ.labelTagsGroup(),
                    icon: "lucide-info",
                    iconTooltip: MJ.tooltipReadMore(),
                    callback: function () {
                      window.open("https://help.obsidian.md/Plugins/Search", "_blank");
                    },
                  },
                ],
                m,
                !0,
              ))
            : [];
        }
        if (c instanceof PF) {
          h = prepareFuzzySearch(s);
          for (var w = [], C = 0, E = this.app.vault.getAllLoadedFiles(); C < E.length; C++) {
            var S,
              M = E[C];
            if (M instanceof TFolder)
              if (!M.isRoot())
                if ((S = h(M.path))) {
                  w.push({
                    type: "string",
                    name: M.path,
                    score: S.score,
                  });
                }
          }
          w.sort(function (e, t) {
            return t.score - e.score;
          });
          return w;
        }
        if (l.type === "quote") return [];
        if (a.matcherStack.length > 0) return [];
      }
      var x = [],
        T = xJ.filter(function (e) {
          return e.name.startsWith(s.toLowerCase());
        });
      if (
        (T.length > 0 &&
          (x.push({
            type: "group",
            name: MJ.labelSearchOptions(),
            icon: "lucide-info",
            iconTooltip: MJ.tooltipReadMore(),
            callback: function () {
              window.open("https://help.obsidian.md/Plugins/Search", "_blank");
            },
          }),
          x.push.apply(x, T)),
        this.showHistory && !e)
      ) {
        var D = this.app.loadLocalStorage("recent-searches");
        if (D && Array.isArray(D) && D.length > 0) {
          x.push({
            type: "group",
            name: MJ.labelHistory(),
            icon: "lucide-x",
            iconTooltip: MJ.tooltipClearHistory(),
            callback: function () {
              t.app.saveLocalStorage("recent-searches", null);
            },
          });
          for (var A = 0, P = D; A < P.length; A++) {
            var nameL0 = P[A];
            x.push({
              type: "history",
              name: nameL0,
            });
          }
        }
      }
      return x;
    };
    t.prototype.selectSuggestion = function (e, t) {
      if (e.type !== "group") {
        for (
          var n = this.inputEl,
            i = n.selectionStart,
            r = n.value,
            o = this.tokens.findLastIndex(function (e) {
              return e.pos <= i;
            }),
            a = this.tokens[o];
          a && !["text", "regex", "quote"].contains(a.type);
        ) {
          o++;
          a = this.tokens[o];
        }
        if (a && i > MF(a)) {
          a = null;
        }
        var s = i,
          l = r.length;
        if (a) {
          s = a.pos;
          l = MF(a);
        }
        var c = e.name;
        e.type === "string" && /[\[\]\(\)\s:]/.test(c) && (c = '"'.concat(c, '"'));
        e.type === "property-key" && (c = Keymap.isModifier(t, "Shift") ? '"'.concat(c, '"] ') : '"'.concat(c, '":'));
        e.type === "string" ? (c += " ") : e.type === "operator" && (c = e.token);
        var value = r.slice(0, s) + c + r.slice(l).trimStart();
        e.type === "string" && (value += " ");
        n.value = value;
        n.trigger("input");
        var h = s + c.length;
        e.type === "operator" && e.token.match(/[\)\]]$/) && (h -= 1);
        n.setSelectionRange(h, h);
        n.trigger("input");
        Platform.isMobile && this.close();
      } else t.preventDefault();
    };
    t.prototype.onInputChange = function () {
      var e = this.inputEl,
        t = e.value,
        n = this.getSuggestions(t);
      n && n.length > 0
        ? (this.suggestions.setSuggestions(n),
          this.suggestions.values[0].type === "group" && this.suggestions.forceSetSelectedItem(1),
          this.open(),
          (this.suggestEl.style.width = Math.max(this.inputEl.offsetWidth, 300) + "px"),
          this.setAutoDestroy(e),
          this.reposition(e.getBoundingClientRect()))
        : this.close();
    };
    t.attach = function (e, n, i) {
      undefined === i && (i = true);
      new t(e, n, i);
    };
    t.showOnce = function (e, n, i) {
      undefined === i && (i = true);
      new t(e, n, i, !0).onInputChange();
      n.focus();
    };
    return t;
  })(PopoverSuggest),
  DJ = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.navigation = false;
      n.allowNoFile = true;
      n.requestUpdate = debounce(n.update, 10);
      return n;
    }
    __extends(t, e);
    t.prototype.load = function () {
      var t = this;
      e.prototype.load.call(this);
      var n = this.app.workspace;
      this.registerEvent(n.on("file-open", this.onFileOpen, this));
      n.onLayoutReady(function () {
        return t.onFileOpen(n.getActiveFile());
      });
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t.hasOwnProperty("group") ||
                this.leaf.pinned ||
                ((i = this.leaf.workspace.getActiveFile()) && (t.file = i == null ? undefined : i.path));
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              r.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.update();
          return [2];
        });
      });
    };
    t.prototype.onUnloadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.requestUpdate();
          return [2];
        });
      });
    };
    t.prototype.onFileOpen = function (e) {
      if (!(this.leaf.group || this.leaf.pinned)) {
        e && e instanceof TFile ? this.loadFile(e) : this.loadFile(null);
      }
    };
    t.prototype.onGroupChange = function () {
      if ((e.prototype.onGroupChange.call(this), this.leaf.group))
        for (var t = 0, n = this.leaf.workspace.getGroupLeaves(this.leaf.group); t < n.length; t++) {
          var i = n[t];
          if (i !== this.leaf && i.view instanceof FileView) {
            this.leaf.openFile(i.view.file);
            break;
          }
        }
      else {
        var r = this.leaf.workspace.getActiveFile();
        this.loadFile(r);
      }
    };
    return t;
  })(FileView),
  AJ = i18nProxy.plugins.graphView,
  PJ = (function () {
    function e() {
      this.id = "graph";
      this.name = AJ.name();
      this.description = AJ.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(AJ.actionOpen(), "lucide-git-fork", function (e) {
        n.openGraphView(Keymap.isModEvent(e));
      });
      plugin.registerGlobalCommand({
        id: "graph:open",
        name: AJ.actionOpen(),
        icon: "lucide-git-fork",
        callback: this.openGraphView.bind(this),
        hotkeys: [BO(["Mod"], "G")],
      });
      plugin.registerGlobalCommand({
        id: "graph:open-local",
        name: AJ.actionOpenLocal(),
        icon: "lucide-git-fork",
        checkCallback: this.openLocalGraph.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "graph:animate",
        name: AJ.actionTimelapse(),
        icon: "lucide-wand",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType(IJ);
          if (t) {
            e || t.dataEngine.renderProgression();
            return !0;
          }
        },
      });
      plugin.registerViewType(typeLJ0, function (e) {
        return new IJ(e);
      });
      plugin.registerViewType(type, function (e) {
        return new FJ(e);
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              n = this;
              return [4, t.loadData()];
            case 1:
              n.options = i.sent() || {};
              e.workspace.registerHoverLinkSource("graph", {
                display: this.name,
                defaultMod: true,
              });
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function (e) {
      e.workspace.unregisterHoverLinkSource("graph");
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
              return [2];
          }
        });
      });
    };
    e.prototype.onFileMenu = function (e, t, n, group) {
      var r = this;
      if (t instanceof TFile && group && t.extension === "md" && n !== "sidebar-context-menu") {
        e.addItem(function (e) {
          return e
            .setSection("view.linked")
            .setTitle(AJ.actionOpenLocal())
            .setIcon("lucide-git-fork")
            .onClick(function () {
              return __awaiter(r, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.app.workspace.splitLeafOrActive(group, "vertical").setViewState({
                          type: type,
                          active: true,
                          group: group,
                          state: {
                            file: t.path,
                          },
                        }),
                      ];
                    case 1:
                      e.sent();
                      return [2];
                  }
                });
              });
            });
        });
      }
    };
    e.prototype.openGraphView = function (e) {
      this.app.workspace.getLeaf(e).setViewState({
        type: typeLJ0,
        active: true,
        state: {},
      });
    };
    e.prototype.openLocalGraph = function (e) {
      var t = this.app.workspace,
        n = t.getActiveFile();
      if (n) {
        if (!e)
          t.splitActiveLeaf("vertical").setViewState({
            type: type,
            active: true,
            group: t.activeLeaf,
            state: {
              file: n.path,
            },
          });
        return !0;
      }
    };
    e.prototype.saveOptions = function () {
      this.plugin.saveData(this.options);
    };
    return e;
  })(),
  typeLJ0 = "graph",
  IJ = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-git-fork";
      n.navigation = true;
      var i = (n.renderer = new h_(n.contentEl, !Platform.isIosApp, !0));
      n.dataEngine = new BJ(t.app, n, i);
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return AJ.name();
    };
    t.prototype.onload = function () {
      this.registerEvent(this.app.metadataCache.on("resolved", this.update, this));
      this.dataEngine.load();
      var e = this.app.internalPlugins.getPluginById("graph").instance;
      this.dataEngine.setOptions(e.options);
      this.dataEngine.requestUpdateSearch.run();
      this.update();
    };
    t.prototype.getViewType = function () {
      return typeLJ0;
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.renderer.destroy();
          return [2];
        });
      });
    };
    t.prototype.onResize = function () {
      this.renderer.onResize();
    };
    t.prototype.showSearch = function () {
      var e = this.dataEngine.filterOptions;
      this.dataEngine.controlsEl.removeClass("is-close");
      e.setCollapsed(!1, !0);
      e.search.autoSelect();
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(AJ.actionCopyScreenshot())
          .setIcon("lucide-image")
          .onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e, t;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    e = this.renderer.getTransparentScreenshot();
                    n.label = 1;
                  case 1:
                    n.trys.push([1, 3, , 4]);
                    return [4, h_.copyToClipboard(e, "image/png")];
                  case 2:
                    n.sent();
                    new Notice(AJ.msgScreenshotCopied());
                    return [3, 4];
                  case 3:
                    t = n.sent();
                    new Notice(t.toString());
                    return [3, 4];
                  case 4:
                    return [2];
                }
              });
            });
          });
      });
    };
    t.prototype.update = function () {
      this.dataEngine.render();
    };
    t.prototype.onOptionsChange = function () {
      if (this._loaded) {
        var e = this.app.internalPlugins.getPluginById("graph").instance;
        e.options = this.dataEngine.getOptions();
        e.saveOptions();
      }
    };
    return t;
  })(ItemView),
  type = "localgraph",
  FJ = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-git-fork";
      n.renderedFile = null;
      var i = (n.renderer = new h_(n.contentEl, !Platform.isIosApp, !0));
      n.engine = new BJ(t.app, n, i);
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return !this.file || Platform.isMobile
        ? AJ.name()
        : AJ.tabTitle({
            displayText: e.prototype.getDisplayText.call(this),
          });
    };
    t.prototype.getViewType = function () {
      return type;
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.options = this.engine.getOptions();
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t.options && this.engine.setOptions(t.options);
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.load = function () {
      e.prototype.load.call(this);
      this.registerEvent(this.app.metadataCache.on("resolved", this.update, this));
      this.engine.load();
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          this.renderer.destroy();
          return [2];
        });
      });
    };
    t.prototype.onFileChanged = function (e) {
      if (e === this.file) {
        this.requestUpdate();
      }
    };
    t.prototype.onResize = function () {
      this.renderer.onResize();
    };
    t.prototype.update = function () {
      var e = this,
        renderedFile = e.file,
        n = e.renderer,
        i = e.engine;
      if (e.renderedFile !== renderedFile) {
        n.resetPan();
        this.renderedFile = renderedFile;
      }
      var r = i.options;
      n.highlightNode = null;
      r.localFile = renderedFile ? renderedFile.path : null;
      i.render();
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(AJ.actionCopyScreenshot())
          .setIcon("lucide-image")
          .onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e, t;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    e = this.renderer.getTransparentScreenshot();
                    n.label = 1;
                  case 1:
                    n.trys.push([1, 3, , 4]);
                    return [4, h_.copyToClipboard(e, "image/png")];
                  case 2:
                    n.sent();
                    new Notice(AJ.msgScreenshotCopied());
                    return [3, 4];
                  case 3:
                    t = n.sent();
                    new Notice(t.toString());
                    return [3, 4];
                  case 4:
                    return [2];
                }
              });
            });
          });
      });
    };
    t.prototype.onOptionsChange = function () {
      this.app.workspace.requestSaveLayout();
    };
    return t;
  })(DJ);
function NJ(e, t) {
  return (Math.pow(t, 1 - e) - t) / (1 - t);
}
function RJ(e, t) {
  return 1 - Math.log(e * (1 - t) + t) / Math.log(t);
}