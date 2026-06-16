var View = (function (e) {
    function t(leaf) {
      var n = e.call(this) || this;
      n.icon = "lucide-file";
      n.navigation = false;
      n.app = leaf.app;
      n.leaf = leaf;
      n.containerEl = leaf.containerEl.createDiv("workspace-leaf-content");
      n.containerEl.setAttribute("data-type", n.getViewType());
      return n;
    }
    __extends(t, e);
    t.prototype.open = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e.appendChild(this.containerEl);
              this.load();
              return [4, this.onOpen()];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.close = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              this.containerEl.detach();
              this.unload();
              return [4, this.onClose()];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    t.prototype.getState = function () {
      return {};
    };
    t.prototype.setState = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    t.prototype.getEphemeralState = function () {
      return {};
    };
    t.prototype.setEphemeralState = function (e) {};
    t.prototype.getIcon = function () {
      return this.icon ? this.icon : "lucide-file";
    };
    t.prototype.onResize = function () {};
    t.prototype.onPaneMenu = function (e, t) {};
    t.prototype.onHeaderMenu = function (e) {};
    t.prototype.onTabMenu = function (e) {
      var t = this,
        n = this.leaf,
        i = n.parent,
        r = i.children.indexOf(n);
      e.addItem(function (e) {
        return e
          .setSection("close")
          .setTitle(i18nProxy.interface.menu.close())
          .setIcon("lucide-x")
          .onClick(function () {
            return t.leaf.detach();
          });
      });
      var o = i.children.slice();
      if (!this.app.workspace.isInSidebar(n)) {
        var a = o.filter(function (e) {
          return !e.pinned && e !== n;
        });
        if (a.length > 0) {
          e.addItem(function (e) {
            return e
              .setSection("close")
              .setTitle(i18nProxy.interface.menu.closeOthers())
              .setIcon("lucide-x")
              .onClick(function () {
                for (var e = 0, t = a; e < t.length; e++) {
                  t[e].detach();
                }
              });
          });
        }
        var s = o.slice(r + 1).filter(function (e) {
          return !e.pinned;
        });
        if (s.length > 0) {
          e.addItem(function (e) {
            return e
              .setSection("close")
              .setTitle(i18nProxy.interface.menu.closeAfter())
              .setIcon("lucide-x")
              .onClick(function () {
                for (var e = 0, t = s; e < t.length; e++) {
                  t[e].detach();
                }
              });
          });
        }
        var l = o.filter(function (e) {
          return !e.pinned;
        });
        if (l.length > 0 && (l.length !== 1 || l[0] !== n)) {
          e.addItem(function (e) {
            return e
              .setSection("close")
              .setTitle(i18nProxy.interface.menu.closeAll())
              .setIcon("lucide-x")
              .onClick(function () {
                for (var e = 0, t = l; e < t.length; e++) {
                  t[e].detach();
                }
              });
          });
        }
      }
    };
    t.prototype.getSideTooltipPlacement = function () {
      var e = this.leaf.getRoot();
      return e.side === "left" ? "right" : e.side === "right" ? "left" : undefined;
    };
    t.prototype.handleCut = function (e) {};
    t.prototype.handleCopy = function (e) {};
    t.prototype.handlePaste = function (e) {};
    return t;
  })(Component),
  ItemView = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.canDropAnywhere = false;
      var i = n.app,
        r = i.workspace,
        o = (n.headerEl = n.containerEl.createDiv("view-header"));
      n.contentEl = n.containerEl.createDiv("view-content");
      o.createDiv("view-header-left", function (e) {
        Platform.isMobile &&
          e.createEl(
            "button",
            "view-action clickable-icon mod-left-split-toggle sidebar-toggle-button mod-left",
            function (e) {
              setTooltip(e, i18nProxy.interface.sidebarExpand());
              setIcon(e, "sidebar-toggle-button-icon");
              e.addEventListener("click", function () {
                n.app.workspace.leftSplit.toggle();
              });
            },
          );
        e.createDiv("view-header-nav-buttons", function (e) {
          n.backButtonEl = Tj(
            i,
            function () {
              return n.leaf;
            },
            "backward",
          );
          setIcon(n.backButtonEl, "lucide-arrow-left");
          e.appendChild(n.backButtonEl);
          n.forwardButtonEl = Tj(
            i,
            function () {
              return n.leaf;
            },
            "forward",
          );
          setIcon(n.forwardButtonEl, "lucide-arrow-right");
          e.appendChild(n.forwardButtonEl);
        });
        n.updateNavButtons();
      });
      n.titleContainerEl = o.createDiv("view-header-title-container mod-at-start", function (e) {
        n.titleParentEl = e.createDiv({
          cls: "view-header-title-parent",
        });
        n.titleEl = e.createDiv({
          cls: "view-header-title",
        });
      });
      applyScrollFadeEffect(n.titleContainerEl, n.titleEl);
      n.actionsEl = o.createDiv("view-actions");
      Platform.isMobile
        ? ((n.moreOptionsButtonEl = n.addAction(
            "lucide-more-vertical",
            i18nProxy.interface.menu.moreOptions(),
            function (e) {
              n.onMoreOptions(e);
            },
          )),
          n.moreOptionsButtonEl.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            r.rightSplit.expand();
          }))
        : (n.moreOptionsButtonEl = n.addAction(
            "lucide-more-vertical",
            i18nProxy.interface.menu.moreOptions(),
            function (e) {
              if (!e.currentTarget.classList.contains("has-active-menu")) {
                n.onMoreOptions(e);
              }
            },
          ));
      i.dragManager.handleDrop(n.containerEl, n.handleDrop.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.updateNavButtons = function () {
      var e = this.leaf.history,
        t = e.backHistory,
        n = e.forwardHistory;
      this.backButtonEl.ariaDisabled = String(t.length === 0);
      this.forwardButtonEl.ariaDisabled = String(n.length === 0);
    };
    t.prototype.load = function () {
      e.prototype.load.call(this);
      var t = this.leaf;
      this.titleEl.setText(this.getDisplayText());
      this.registerEvent(t.on("group-change", this.onGroupChange, this));
      this.registerEvent(t.on("history-change", this.updateNavButtons, this));
    };
    t.prototype.handleDrop = function (e, t, n) {
      if (this.canDropAnywhere || (isMacOS ? e.shiftKey : e.altKey) || this.headerEl.contains(e.target)) {
        var i = this.leaf.handleDrop(e, t, n);
        if (i) {
          i.hoverEl = this.headerEl;
          i.hoverClass = "is-highlighted";
          return i;
        }
      }
    };
    t.prototype.onGroupChange = function () {};
    t.prototype.addAction = function (e, t, n) {
      var i = createEl("button", "clickable-icon view-action");
      this.actionsEl.prepend(i);
      setIcon(i, e);
      setTooltip(i, t);
      i.onClickEvent(function (e) {
        if (e.button === 0 || e.button === 1) return n(e);
      });
      return i;
    };
    t.prototype.onMoreOptions = function (e) {
      e.preventDefault();
      var t = new Menu().addSections([
        "close",
        "pane",
        "open",
        "action",
        "find",
        "info",
        "view",
        "view.linked",
        "system",
        "",
        "danger",
      ]);
      t.setSectionSubmenu("view.linked", {
        title: i18nProxy.interface.menu.openLinkedView(),
        icon: "lucide-link",
      });
      this.onPaneMenu(t, "more-options");
      this.onMoreOptionsMenu(t);
      this.app.workspace.trigger("leaf-menu", t, this.leaf);
      var n = e.target,
        i = n.getBoundingClientRect();
      t.setParentElement(n).showAtPosition({
        x: i.x,
        y: i.bottom,
        width: i.width,
        overlap: true,
        left: true,
      });
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      var r = this.app,
        o = this.leaf;
      Platform.isPhone &&
        n === "more-options" &&
        (t.addItem(function (e) {
          return e
            .setSection("close")
            .setTitle(i18nProxy.interface.menu.close())
            .setIcon("lucide-x")
            .onClick(function () {
              return i.leaf.detach();
            });
        }),
        t.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(i.leaf.pinned ? i18nProxy.interface.menu.unpin() : i18nProxy.interface.menu.pin())
            .setIcon(i.leaf.pinned ? "lucide-pin-off" : "lucide-pin")
            .onClick(function () {
              return i.leaf.togglePinned();
            });
        }));
      Platform.canSplit &&
        o.canPin() &&
        t
          .addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.commands.splitRight())
              .setDisabled(r.workspace.isInSidebar(i.leaf))
              .setIcon("lucide-separator-vertical")
              .onClick(function () {
                return r.workspace.duplicateLeaf(o, "vertical");
              });
          })
          .addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.commands.splitDown())
              .setIcon("lucide-separator-horizontal")
              .onClick(function () {
                return r.workspace.duplicateLeaf(o, "horizontal");
              });
          });
    };
    t.prototype.onTabMenu = function (t) {
      e.prototype.onTabMenu.call(this, t);
      var n = this.app,
        i = this.leaf;
      i.canPin() &&
        t.addItem(function (e) {
          return e
            .setSection("pane")
            .setTitle(i.pinned ? i18nProxy.interface.menu.unpin() : i18nProxy.interface.menu.pin())
            .setIcon("lucide-pin")
            .onClick(function () {
              return i.togglePinned();
            });
        });
      i.group
        ? t.addItem(function (e) {
            return e
              .setSection("pane")
              .setTitle(i18nProxy.interface.menu.unlinkTab())
              .setIcon("lucide-link")
              .onClick(function () {
                return i.setGroup(null);
              });
          })
        : i.canPin() &&
          t.addItem(function (e) {
            return e
              .setSection("pane")
              .setTitle(i18nProxy.interface.menu.linkTab())
              .setIcon("lucide-link")
              .onClick(function () {
                return n.workspace.onStartLink(i);
              });
          });
      Platform.canPopoutWindow &&
        t.addItem(function (e) {
          return e
            .setSection("open")
            .setTitle(i18nProxy.interface.menu.moveToNewWindow())
            .setIcon("lucide-picture-in-picture")
            .onClick(function () {
              n.workspace.moveLeafToPopout(i);
            });
        });
    };
    t.prototype.onMoreOptionsMenu = function (e) {};
    return t;
  })(View),
  Pj = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.canDropAnywhere = true;
      n.navigation = true;
      var hoverEl = (n.emptyStateEl = n.contentEl.createDiv("empty-state")),
        r = (n.clickableAreaEl = hoverEl.createDiv("empty-state-container"));
      n.emptyTitleEl = r.createDiv({
        cls: "empty-state-title",
      });
      n.actionListEl = r.createDiv("empty-state-action-list");
      n.app.dragManager.handleDrop(hoverEl, function (e, t, r) {
        var o = n.leaf.handleDrop(e, t, r);
        if (o) {
          o.hoverEl = hoverEl;
          o.hoverClass = "is-highlighted";
          return o;
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return i18nProxy.interface.labelNewTab();
    };
    t.prototype.getViewType = function () {
      return "empty";
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
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
          p = this;
        return __generator(this, function (d) {
          t = (e = this).app;
          (n = e.actionListEl).empty();
          i = "file-explorer:new-file";
          r = "";
          Platform.hasPhysicalKeyboard && (o = t.hotkeyManager.printHotkeyForCommand(i)) && (r = " (".concat(o, ")"));
          n.createDiv(
            {
              cls: "empty-state-action tappable",
              text: i18nProxy.interface.emptyState.createNewFile() + r,
            },
            function (e) {
              e.addEventListener("click", function (e) {
                t.commands.executeCommandById(i, e);
              });
            },
          );
          t.vault.isEmpty() ||
            ((a = "switcher:open"),
            (s = ""),
            Platform.hasPhysicalKeyboard && (l = t.hotkeyManager.printHotkeyForCommand(a)) && (s = " (".concat(l, ")")),
            n.createDiv(
              {
                cls: "empty-state-action tappable",
                text: i18nProxy.interface.emptyState.goToFile() + s,
              },
              function (e) {
                e.addEventListener("click", function (e) {
                  t.commands.executeCommandById(a, e);
                });
              },
            ),
            n.createDiv(
              {
                cls: "empty-state-action tappable",
                text: i18nProxy.interface.emptyState.seeRecentFiles() + s,
              },
              function (e) {
                e.addEventListener("click", function (e) {
                  t.commands.executeCommandById(a, e);
                });
              },
            ));
          this.app.internalPlugins.getEnabledPluginById("webviewer") &&
            ((c = "webviewer:open"),
            (u = ""),
            (h = t.hotkeyManager.printHotkeyForCommand(c)) && (u = " (".concat(h, ")")),
            n.createDiv(
              {
                cls: "empty-state-action tappable",
                text: i18nProxy.plugins.webViewer.actionOpen() + u,
              },
              function (e) {
                e.addEventListener("click", function (e) {
                  t.commands.executeCommandById(c, e);
                });
              },
            ));
          n.createDiv(
            {
              cls: "empty-state-action tappable mod-close",
              text: i18nProxy.interface.emptyState.close(),
            },
            function (e) {
              e.addEventListener("click", function () {
                p.leaf.detach();
              });
            },
          );
          return [2];
        });
      });
    };
    return t;
  })(ItemView),
  FileView = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.allowNoFile = false;
      n.navigation = true;
      return n;
    }
    __extends(t, e);
    t.prototype.renderBreadcrumbs = function () {
      var e,
        t,
        n = this;
      this.titleParentEl.empty();
      var i =
        (t = (e = this.file) === null || undefined === e ? undefined : e.parent) === null || undefined === t
          ? undefined
          : t.path;
      if (i && i !== "/")
        for (
          var r = i.split("/"),
            o = function (e) {
              var t = r.slice(0, e + 1).join("/"),
                texti0 = r[e],
                o = a.titleParentEl.createSpan({
                  cls: "view-header-breadcrumb",
                  text: texti0,
                });
              Platform.isMobile || setTooltip(o, texti0);
              o.addEventListener("click", function () {
                var e = n.app.internalPlugins.getEnabledPluginById("file-explorer");
                if (e) {
                  var i = n.app.vault.getFolderByPath(normalizePath(t));
                  if (i) {
                    e.revealInFolder(i);
                  }
                }
              });
              o.addEventListener("contextmenu", function (e) {
                var i = n.app,
                  r = i.fileManager,
                  a = i.vault,
                  s = i.workspace,
                  l = a.getFolderByPath(normalizePath(t));
                if (l) {
                  var c = Menu.forEvent(e).addSections([
                    "title",
                    "open",
                    "action-primary",
                    "action",
                    "info",
                    "view",
                    "system",
                    "",
                    "danger",
                  ]);
                  c.addItem(function (e) {
                    return e
                      .setSection("action-primary")
                      .setTitle(i18nProxy.plugins.fileExplorer.menuOptNewNote())
                      .setIcon("lucide-edit")
                      .onClick(function (e) {
                        return __awaiter(n, undefined, undefined, function () {
                          var t;
                          return __generator(this, function (n) {
                            switch (n.label) {
                              case 0:
                                return [4, r.createNewMarkdownFile(l)];
                              case 1:
                                t = n.sent();
                                s.getLeaf(Keymap.isModEvent(e)).openFile(t, {
                                  active: true,
                                  state: {
                                    mode: "source",
                                  },
                                  eState: {
                                    rename: "all",
                                  },
                                });
                                return [2];
                            }
                          });
                        });
                      });
                  });
                  c.setParentElement(o);
                  n.app.workspace.trigger("file-menu", c, l, "file-explorer-context-menu");
                }
              });
              a.app.dragManager.handleDrag(o, function (e) {
                var i = n.app.vault.getFolderByPath(normalizePath(t));
                return i
                  ? (n.app.dragManager.updateSource([o], "is-being-dragged"), n.app.dragManager.dragFolder(e, i))
                  : null;
              });
              a.titleParentEl.createSpan({
                cls: "view-header-breadcrumb-separator",
                text: "/",
              });
            },
            a = this,
            s = 0;
          s < r.length;
          s++
        )
          o(s);
    };
    t.prototype.getDisplayText = function () {
      return this.file ? this.file.basename : i18nProxy.interface.noFile();
    };
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      var t = this.app.vault;
      this.registerEvent(t.on("rename", this.onRename.bind(this)));
      this.registerEvent(t.on("delete", this.onDelete.bind(this)));
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this),
        n = this.file;
      n && (t.file = n.path);
      return t;
    };
    t.prototype.syncState = function () {
      var e = this.leaf,
        n = e.group;
      if (n)
        for (var i = 0, r = this.app.workspace.getGroupLeaves(n); i < r.length; i++) {
          var o = r[i];
          if (o !== e && o.view instanceof t) {
            o.view.receiveSyncState(this);
          }
        }
    };
    t.prototype.receiveSyncState = function (e) {
      if (e.file !== this.file) {
        this.leaf.openFile(e.file);
      }
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i,
          r,
          o = this;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = false;
              return t.hasOwnProperty("file")
                ? (r = this.app.vault.getAbstractFileByPath(t.file)) instanceof TFile
                  ? [4, this.loadFile(r)]
                  : [3, 2]
                : [3, 4];
            case 1:
              i = a.sent();
              return [3, 4];
            case 2:
              return [4, this.loadFile(null)];
            case 3:
              i = a.sent();
              a.label = 4;
            case 4:
              this.file || this.allowNoFile || (n.close = true);
              i && ((n.layout = true), (n.history = true));
              return [4, e.prototype.setState.call(this, t, n)];
            case 5:
              a.sent();
              t.sync ||
                (!n.layout && !n.history) ||
                (n.done = function () {
                  return o.syncState();
                });
              return [2];
          }
        });
      });
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              this.contentEl.empty();
              return [4, this.loadFile(null)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.loadFile = function (filee0) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return (t = this.file) === filee0 ? [2, !1] : t ? [4, this.onUnloadFile(t)] : [3, 2];
            case 1:
              o.sent();
              o.label = 2;
            case 2:
              if (((this.file = null), !filee0)) return [3, 6];
              o.label = 3;
            case 3:
              o.trys.push([3, 5, , 6]);
              this.file = filee0;
              return [4, this.onLoadFile(filee0)];
            case 4:
              o.sent();
              return [3, 6];
            case 5:
              n = o.sent();
              this.file = null;
              new Notice(
                i18nProxy.interface.msgFailedToLoadFile({
                  plugin: filee0.path,
                }),
              );
              console.error(n);
              return [3, 6];
            case 6:
              this.renderBreadcrumbs();
              this.titleEl.setText(this.getDisplayText());
              i = this.leaf;
              (r = i.workspace).activeLeaf === i && r.requestActiveLeafEvents();
              this.leaf.updateHeader();
              return [2, !0];
          }
        });
      });
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    t.prototype.onUnloadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    t.prototype.onRename = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          e === this.file &&
            (this.renderBreadcrumbs(),
            this.titleEl.setText(e.basename),
            this.app.workspace.onLayoutChange(),
            this.leaf.updateHeader());
          return [2];
        });
      });
    };
    t.prototype.onDelete = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return e !== this.file ? [3, 8] : this.allowNoFile ? [4, this.loadFile(null)] : [3, 2];
            case 1:
              n.sent();
              return [3, 7];
            case 2:
              return (t = this.leaf).history.backHistory.length > 0 ? [4, t.history.back()] : [3, 4];
            case 3:
              n.sent();
              return [3, 6];
            case 4:
              return [4, t.open(null)];
            case 5:
              n.sent();
              n.label = 6;
            case 6:
              this.leaf.view instanceof Pj && t.parent.children.length > 1 && t.detach();
              n.label = 7;
            case 7:
              this.app.workspace.onLayoutChange();
              n.label = 8;
            case 8:
              return [2];
          }
        });
      });
    };
    t.prototype.canAcceptExtension = function (e) {
      return !1;
    };
    return t;
  })(ItemView);
function Ij(e, t, n, i) {
  return Zb.test(n)
    ? i18nProxy.plugins.fileExplorer.msgInvalidCharacters() + Kb
    : i && n === ""
      ? i18nProxy.plugins.fileExplorer.msgEmptyFileName()
      : n.startsWith(".")
        ? i18nProxy.plugins.fileExplorer.msgBadDotfile()
        : e.vault.checkForDuplicate(t, n)
          ? i18nProxy.plugins.fileExplorer.msgFileAlreadyExists()
          : Xb.test(n)
            ? i18nProxy.plugins.fileExplorer.msgUnsafeCharacters() + Yb
            : Zb.test(n)
              ? i18nProxy.plugins.fileExplorer.msgInvalidCharacters() + Kb
              : "";
}
function Oj(e, t) {
  displayTooltip(e, t, {
    classes: ["mod-wide", "mod-error"],
  });
}
var Fj,
  EditableFileView = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.fileBeingRenamed = null;
      return t;
    }
    __extends(t, e);
    t.prototype.setEphemeralState = function (t) {
      e.prototype.setEphemeralState.call(this, t);
      var n = t.rename;
      if (n) {
        var i = undefined;
        n === "start" ? (i = true) : n === "end" && (i = false);
        this.titleEl.isShown()
          ? (Platform.isMobileApp && (this.titleEl.contentEditable = "true"), focusAndSelectContent(this.titleEl, i))
          : this.app.fileManager.promptForFileRename(this.file);
      }
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t = this;
        return __generator(this, function (n) {
          (e = this.titleEl).tabIndex = -1;
          Platform.isMobileApp
            ? e.addEventListener("touchstart", function () {
                e.contentEditable = "true";
              })
            : (e.contentEditable = "true");
          e.addEventListener("focus", this.onTitleFocus.bind(this));
          e.addEventListener("blur", this.onTitleBlur.bind(this));
          e.addEventListener("input", function () {
            return t.onTitleChange(e);
          });
          e.addEventListener("paste", function (n) {
            return t.onTitlePaste(e, n);
          });
          e.addEventListener("keydown", this.onTitleKeydown.bind(this));
          return [2];
        });
      });
    };
    t.prototype.onTitleFocus = function () {
      var e = this;
      this.fileBeingRenamed = this.file;
      this.titleEl.spellcheck = this.app.vault.getConfig("spellcheck");
      fl(
        this.titleParentEl,
        new cl({
          duration: 150,
        })
          .addProp("opacity", "1", "0", "0")
          .addProp("width", this.titleParentEl.clientWidth + "px", "0", ""),
        function () {
          return e.titleParentEl.detach();
        },
      );
    };
    t.prototype.onTitleBlur = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              e = this.titleEl;
              (t = e.doc.getSelection()).rangeCount > 0 &&
                ((n = t.getRangeAt(0)),
                (i = n.commonAncestorContainer),
                (e === i || e.contains(i)) && t.removeRange(n));
              return [4, this.saveTitle(this.titleEl)];
            case 1:
              r.sent() || e.setText(this.file.basename);
              hideTooltip();
              this.fileBeingRenamed = null;
              this.titleEl.spellcheck = false;
              Platform.isMobileApp && (e.contentEditable = "false");
              this.titleContainerEl.prepend(this.titleParentEl);
              fl(
                this.titleParentEl,
                new cl({
                  duration: 150,
                })
                  .addProp("opacity", "0", "1", "")
                  .addProp("width", "0", this.titleParentEl.clientWidth + "px", ""),
              );
              this.titleEl.scrollTo({
                left: 0,
              });
              return [2];
          }
        });
      });
    };
    t.prototype.onTitlePaste = function (e, t) {
      handlePasteText(e, t);
    };
    t.prototype.onTitleChange = function (e) {
      var t = this.file;
      normalizeElementText(e);
      var n = e.getText().trim(),
        i = Ij(this.app, t, n, !1);
      i ? Oj(e, i) : hideTooltip();
    };
    t.prototype.onTitleKeydown = function (e) {
      var t = this;
      if (!e.isComposing) {
        var n = function () {
            i.blur();
            t.setEphemeralState({
              focus: true,
              focusOnMobile: i !== t.titleEl,
            });
          },
          i = e.targetNode;
        if (
          (e.key === "Escape" &&
            (e.preventDefault(), (this.fileBeingRenamed = null), i.setText(this.file.basename), n()),
          e.key === "Enter" || e.key === "Tab")
        ) {
          e.preventDefault();
          __awaiter(t, undefined, undefined, function () {
            return __generator(this, function (e) {
              switch (e.label) {
                case 0:
                  return [4, this.saveTitle(i)];
                case 1:
                  e.sent() && n();
                  return [2];
              }
            });
          });
        } else if (e.key === "ArrowDown") {
          var r = i.win.getSelection();
          if (r && r.rangeCount >= 1 && i.instanceOf(HTMLElement)) {
            var o = r.getRangeAt(0);
            if (i === o.startContainer || i.contains(o.startContainer)) {
              var a = o.getBoundingClientRect();
              if (a.bottom + a.height / 2 >= i.getBoundingClientRect().bottom) {
                e.preventDefault();
                i.blur();
                i.win.getSelection().empty();
                this.setEphemeralState({
                  focus: true,
                  focusMetadata: !e.altKey,
                });
              }
            }
          }
        }
      }
    };
    t.prototype.saveTitle = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              if (((n = (t = this).file), (i = t.fileBeingRenamed), n !== i || n.deleted)) return [2, !0];
              if (((r = e.getText().trim()), (o = Ij(this.app, n, r, !0)))) {
                Oj(e, o);
                return [2, !1];
              }
              if (((a = n.getNewPathAfterRename(r)), n.path === a)) return [2, !0];
              c.label = 1;
            case 1:
              c.trys.push([1, 3, , 4]);
              return [4, this.app.fileManager.renameFile(n, a)];
            case 2:
              c.sent();
              return [3, 4];
            case 3:
              (s = c.sent()) && (console.error(s), (l = s.message || s.code || s.toString()), Oj(e, l));
              return [2, !1];
            case 4:
              return [2, !0];
          }
        });
      });
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      var r = this.file;
      if (r) {
        t.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(i18nProxy.plugins.fileExplorer.menuOptRename())
            .setIcon("lucide-edit-3")
            .onClick(function () {
              return i.app.fileManager.promptForFileRename(r);
            });
        });
        t.addItem(function (e) {
          return e
            .setSection("danger")
            .setTitle(i18nProxy.interface.menu.deleteFile())
            .setIcon("lucide-trash-2")
            .setWarning(!0)
            .onClick(function () {
              return i.app.fileManager.promptForFileDeletion(r);
            });
        });
        this.app.workspace.trigger("file-menu", t, r, n, this.leaf);
      }
    };
    return t;
  })(FileView),
  Rj = /[^a-zA-Z0-9]/,
  Bj = /\s/,
  Vj = /[\r\n]/,
  Hj = /\n\r?\n$/,
  zj = /^\r?\n\r?\n/;
function qj(e, t) {
  return e < t ? e : t;
}
function Wj(e, t) {
  return e > t ? e : t;
}
!(function (e) {
  e[(e.DIFF_DELETE = -1)] = "DIFF_DELETE";
  e[(e.DIFF_INSERT = 1)] = "DIFF_INSERT";
  e[(e.DIFF_EQUAL = 0)] = "DIFF_EQUAL";
})(Fj || (Fj = {}));
var Uj = /\W/;
function _j(e, t) {
  for (var n = e.length, i = t; i < n; i += 1) if (Uj.test(e[i])) return i;
  return -1;
}
var jj = (function () {
    function e() {
      this.diffTimeout = 1;
      this.diffEditCost = 4;
      this.matchThreshold = 0.5;
      this.matchDistance = 1e3;
      this.patchDeleteThreshold = 0.5;
      this.patchMargin = 4;
      this.matchMaxBits = 32;
    }
    e.prototype.diff_main = function (e, t, n, i) {
      if (undefined === i) {
        i = this.diffTimeout <= 0 ? Number.MAX_VALUE : Date.now() + 1e3 * this.diffTimeout;
      }
      var r = i;
      if (e == null || t == null) throw new Error("Null input. (diff_main)");
      if (e === t) return e ? [[Fj.DIFF_EQUAL, e]] : [];
      if (undefined === n) {
        n = true;
      }
      var o = n,
        a = this.diff_commonPrefix(e, t),
        s = e.substring(0, a);
      e = e.substring(a);
      t = t.substring(a);
      a = this.diff_commonSuffix(e, t);
      var l = e.substring(e.length - a);
      e = e.substring(0, e.length - a);
      t = t.substring(0, t.length - a);
      var c = this.diff_compute_(e, t, o, r);
      s && c.unshift([Fj.DIFF_EQUAL, s]);
      l && c.push([Fj.DIFF_EQUAL, l]);
      this.diff_cleanupMerge(c);
      return c;
    };
    e.prototype.diff_lineMode = function (e, t) {
      var n = this.diff_linesToChars_(e, t),
        i = n.chars1,
        r = n.chars2,
        o = n.lineArray,
        a = this.diff_main(i, r, !1);
      this.diff_charsToLines_(a, o);
      return a;
    };
    e.prototype.diff_wordMode = function (e, t) {
      var n = this.diff_wordsToChars_(e, t),
        i = n.chars1,
        r = n.chars2,
        o = n.lineArray,
        a = this.diff_main(i, r, !1);
      this.diff_charsToLines_(a, o);
      return a;
    };
    e.prototype.diff_wordsToChars_ = function (e, t) {
      var lineArray = [],
        i = {};
      lineArray[0] = "";
      var r = function (e) {
        var t = "",
          r = lineArray.length;
        (function (e, t) {
          for (var n = 0, i = -1; i < e.length - 1; ) {
            if (-1 === (i = _j(e, n))) {
              t(e.substring(n, e.length));
              i = e.length;
              break;
            }
            n !== i && t(e.substring(n, i));
            t(e[i]);
            n = i + 1;
          }
        })(e, function (e) {
          (i.hasOwnProperty ? i.hasOwnProperty(e) : undefined !== i[e])
            ? (t += String.fromCharCode(i[e]))
            : ((t += String.fromCharCode(r)), (i[e] = r), (lineArray[r++] = e));
        });
        return t;
      };
      return {
        chars1: r(e),
        chars2: r(t),
        lineArray: lineArray,
      };
    };
    e.prototype.diff_commonPrefix = function (e, t) {
      if (!e || !t || e.charAt(0) !== t.charAt(0)) return 0;
      for (var n = 0, i = qj(e.length, t.length), r = i, o = 0; n < r; ) {
        e.substring(o, r) === t.substring(o, r) ? (o = n = r) : (i = r);
        r = Math.floor((i - n) / 2 + n);
      }
      return r;
    };
    e.prototype.diff_commonSuffix = function (e, t) {
      if (!e || !t || e.charAt(e.length - 1) !== t.charAt(t.length - 1)) return 0;
      for (var n = 0, i = qj(e.length, t.length), r = i, o = 0; n < r; ) {
        e.substring(e.length - r, e.length - o) === t.substring(t.length - r, t.length - o) ? (o = n = r) : (i = r);
        r = Math.floor((i - n) / 2 + n);
      }
      return r;
    };
    e.prototype.diff_cleanupSemantic = function (e) {
      for (var t = false, n = [], i = 0, r = null, o = 0, a = 0, s = 0, l = 0, c = 0; o < e.length; ) {
        e[o][0] === Fj.DIFF_EQUAL
          ? ((n[i++] = o), (a = l), (s = c), (l = 0), (c = 0), (r = e[o][1]))
          : (e[o][0] === Fj.DIFF_INSERT ? (l += e[o][1].length) : (c += e[o][1].length),
            r &&
              r.length <= Wj(a, s) &&
              r.length <= Wj(l, c) &&
              (e.splice(n[i - 1], 0, [Fj.DIFF_DELETE, r]),
              (e[n[i - 1] + 1][0] = Fj.DIFF_INSERT),
              i--,
              (o = --i > 0 ? n[i - 1] : -1),
              (a = 0),
              (s = 0),
              (l = 0),
              (c = 0),
              (r = null),
              (t = true)));
        o++;
      }
      for (t && this.diff_cleanupMerge(e), this.diff_cleanupSemanticLossless(e), o = 1; o < e.length; ) {
        if (e[o - 1][0] === Fj.DIFF_DELETE && e[o][0] === Fj.DIFF_INSERT) {
          var u = e[o - 1][1],
            h = e[o][1],
            p = this.diff_commonOverlap_(u, h),
            d = this.diff_commonOverlap_(h, u);
          p >= d
            ? (p >= u.length / 2 || p >= h.length / 2) &&
              (e.splice(o, 0, [Fj.DIFF_EQUAL, h.substring(0, p)]),
              (e[o - 1][1] = u.substring(0, u.length - p)),
              (e[o + 1][1] = h.substring(p)),
              o++)
            : (d >= u.length / 2 || d >= h.length / 2) &&
              (e.splice(o, 0, [Fj.DIFF_EQUAL, u.substring(0, d)]),
              (e[o - 1][0] = Fj.DIFF_INSERT),
              (e[o - 1][1] = h.substring(0, h.length - d)),
              (e[o + 1][0] = Fj.DIFF_DELETE),
              (e[o + 1][1] = u.substring(d)),
              o++);
          o++;
        }
        o++;
      }
    };
    e.prototype.diff_cleanupSemanticLossless = function (e) {
      for (var t = 1; t < e.length - 1; ) {
        if (e[t - 1][0] === Fj.DIFF_EQUAL && e[t + 1][0] === Fj.DIFF_EQUAL) {
          var n = e[t - 1][1],
            i = e[t][1],
            r = e[t + 1][1],
            o = this.diff_commonSuffix(n, i);
          if (o) {
            var a = i.substring(i.length - o);
            n = n.substring(0, n.length - o);
            i = a + i.substring(0, i.length - o);
            r = a + r;
          }
          for (
            var s = n, l = i, c = r, u = this.diff_cleanupSemanticScore_(n, i) + this.diff_cleanupSemanticScore_(i, r);
            i.charAt(0) === r.charAt(0);
          ) {
            n += i.charAt(0);
            i = i.substring(1) + r.charAt(0);
            r = r.substring(1);
            var h = this.diff_cleanupSemanticScore_(n, i) + this.diff_cleanupSemanticScore_(i, r);
            if (h >= u) {
              u = h;
              s = n;
              l = i;
              c = r;
            }
          }
          if (e[t - 1][1] !== s) {
            s ? (e[t - 1][1] = s) : (e.splice(t - 1, 1), t--);
            e[t][1] = l;
            c ? (e[t + 1][1] = c) : (e.splice(t + 1, 1), t--);
          }
        }
        t++;
      }
    };
    e.prototype.diff_cleanupEfficiency = function (e) {
      for (var t = false, n = [], i = 0, r = null, o = 0, a = false, s = false, l = false, c = false; o < e.length; ) {
        e[o][0] === Fj.DIFF_EQUAL
          ? (e[o][1].length < this.diffEditCost && (l || c)
              ? ((n[i++] = o), (a = l), (s = c), (r = e[o][1]))
              : ((i = 0), (r = null)),
            (l = c = false))
          : (e[o][0] === Fj.DIFF_DELETE ? (c = true) : (l = true),
            r &&
              ((a && s && l && c) ||
                (r.length < this.diffEditCost / 2 && Number(a) + Number(s) + Number(l) + Number(c) === 3)) &&
              (e.splice(n[i - 1], 0, [Fj.DIFF_DELETE, r]),
              (e[n[i - 1] + 1][0] = Fj.DIFF_INSERT),
              i--,
              (r = null),
              a && s ? ((l = c = true), (i = 0)) : ((o = --i > 0 ? n[i - 1] : -1), (l = c = false)),
              (t = true)));
        o++;
      }
      if (t) {
        this.diff_cleanupMerge(e);
      }
    };
    e.prototype.diff_cleanupMerge = function (e) {
      e.push([Fj.DIFF_EQUAL, ""]);
      for (var t, n = 0, i = 0, r = 0, o = "", a = ""; n < e.length; )
        switch (e[n][0]) {
          case Fj.DIFF_INSERT:
            r++;
            a += e[n][1];
            n++;
            break;
          case Fj.DIFF_DELETE:
            i++;
            o += e[n][1];
            n++;
            break;
          case Fj.DIFF_EQUAL:
            i + r > 1
              ? (i !== 0 &&
                  r !== 0 &&
                  ((t = this.diff_commonPrefix(a, o)) !== 0 &&
                    (n - i - r > 0 && e[n - i - r - 1][0] === Fj.DIFF_EQUAL
                      ? (e[n - i - r - 1][1] += a.substring(0, t))
                      : (e.splice(0, 0, [Fj.DIFF_EQUAL, a.substring(0, t)]), n++),
                    (a = a.substring(t)),
                    (o = o.substring(t))),
                  (t = this.diff_commonSuffix(a, o)) !== 0 &&
                    ((e[n][1] = a.substring(a.length - t) + e[n][1]),
                    (a = a.substring(0, a.length - t)),
                    (o = o.substring(0, o.length - t)))),
                (n -= i + r),
                e.splice(n, i + r),
                o.length && (e.splice(n, 0, [Fj.DIFF_DELETE, o]), n++),
                a.length && (e.splice(n, 0, [Fj.DIFF_INSERT, a]), n++),
                n++)
              : n !== 0 && e[n - 1][0] === Fj.DIFF_EQUAL
                ? ((e[n - 1][1] += e[n][1]), e.splice(n, 1))
                : n++;
            r = 0;
            i = 0;
            o = "";
            a = "";
        }
      if (e[e.length - 1][1] === "") {
        e.pop();
      }
      var s = false;
      for (n = 1; n < e.length - 1; ) {
        e[n - 1][0] === Fj.DIFF_EQUAL &&
          e[n + 1][0] === Fj.DIFF_EQUAL &&
          (e[n][1].substring(e[n][1].length - e[n - 1][1].length) === e[n - 1][1]
            ? ((e[n][1] = e[n - 1][1] + e[n][1].substring(0, e[n][1].length - e[n - 1][1].length)),
              (e[n + 1][1] = e[n - 1][1] + e[n + 1][1]),
              e.splice(n - 1, 1),
              (s = true))
            : e[n][1].substring(0, e[n + 1][1].length) === e[n + 1][1] &&
              ((e[n - 1][1] += e[n + 1][1]),
              (e[n][1] = e[n][1].substring(e[n + 1][1].length) + e[n + 1][1]),
              e.splice(n + 1, 1),
              (s = true)));
        n++;
      }
      if (s) {
        this.diff_cleanupMerge(e);
      }
    };
    e.prototype.diff_xIndex = function (e, t) {
      var n,
        i = 0,
        r = 0,
        o = 0,
        a = 0;
      for (
        n = 0;
        n < e.length &&
        (e[n][0] !== Fj.DIFF_INSERT && (i += e[n][1].length),
        e[n][0] !== Fj.DIFF_DELETE && (r += e[n][1].length),
        !(i > t));
        n++
      ) {
        o = i;
        a = r;
      }
      return e.length !== n && e[n][0] === Fj.DIFF_DELETE ? a : a + (t - o);
    };
    e.prototype.diff_prettyHtml = function (e) {
      for (var t = [], n = /&/g, i = /</g, r = />/g, o = /\n/g, a = 0; a < e.length; a++) {
        var s = e[a][0],
          l = e[a][1].replace(n, "&amp;").replace(i, "&lt;").replace(r, "&gt;").replace(o, "&para;<br>");
        switch (s) {
          case Fj.DIFF_INSERT:
            t[a] = '<ins style="background:#e6ffe6;">' + l + "</ins>";
            break;
          case Fj.DIFF_DELETE:
            t[a] = '<del style="background:#ffe6e6;">' + l + "</del>";
            break;
          case Fj.DIFF_EQUAL:
            t[a] = "<span>" + l + "</span>";
        }
      }
      return t.join("");
    };
    e.prototype.diff_text1 = function (e) {
      for (var t = [], n = 0; n < e.length; n++)
        if (e[n][0] !== Fj.DIFF_INSERT) {
          t[n] = e[n][1];
        }
      return t.join("");
    };
    e.prototype.diff_text2 = function (e) {
      for (var t = [], n = 0; n < e.length; n++)
        if (e[n][0] !== Fj.DIFF_DELETE) {
          t[n] = e[n][1];
        }
      return t.join("");
    };
    e.prototype.diff_levenshtein = function (e) {
      for (var t = 0, n = 0, i = 0, r = 0; r < e.length; r++) {
        var o = e[r][0],
          a = e[r][1];
        switch (o) {
          case Fj.DIFF_INSERT:
            n += a.length;
            break;
          case Fj.DIFF_DELETE:
            i += a.length;
            break;
          case Fj.DIFF_EQUAL:
            t += Wj(n, i);
            n = 0;
            i = 0;
        }
      }
      return (t += Wj(n, i));
    };
    e.prototype.diff_toDelta = function (e) {
      for (var t = [], n = 0; n < e.length; n++)
        switch (e[n][0]) {
          case Fj.DIFF_INSERT:
            t[n] = "+" + encodeURI(e[n][1]);
            break;
          case Fj.DIFF_DELETE:
            t[n] = "-" + e[n][1].length;
            break;
          case Fj.DIFF_EQUAL:
            t[n] = "=" + e[n][1].length;
        }
      return t.join("\t").replace(/%20/g, " ");
    };
    e.prototype.diff_fromDelta = function (e, t) {
      for (var n = [], i = 0, r = 0, o = t.split(/\t/g), a = 0; a < o.length; a++) {
        var s = o[a].substring(1);
        switch (o[a].charAt(0)) {
          case "+":
            try {
              n[i++] = [Fj.DIFF_INSERT, decodeURI(s)];
            } catch (e) {
              throw new Error("Illegal escape in diff_fromDelta: " + s);
            }
            break;
          case "-":
          case "=":
            var l = parseInt(s, 10);
            if (isNaN(l) || l < 0) throw new Error("Invalid number in diff_fromDelta: " + s);
            var c = e.substring(r, (r += l));
            o[a].charAt(0) === "=" ? (n[i++] = [Fj.DIFF_EQUAL, c]) : (n[i++] = [Fj.DIFF_DELETE, c]);
            break;
          default:
            if (o[a]) throw new Error("Invalid diff operation in diff_fromDelta: " + o[a]);
        }
      }
      if (r !== e.length)
        throw new Error("Delta length (" + r + ") does not equal source text length (" + e.length + ")");
      return n;
    };
    e.prototype.match_main = function (e, t, n) {
      if (e == null || t == null || n == null) throw new Error("Null input. (match_main)");
      n = Wj(0, qj(n, e.length));
      return e === t ? 0 : e.length ? (e.substring(n, n + t.length) === t ? n : this.match_bitap_(e, t, n)) : -1;
    };
    e.prototype.patch_make = function (e, t, n) {
      var i, r;
      if (typeof e == "string" && typeof t == "string" && undefined === n) {
        i = e;
        (r = this.diff_main(i, t, !0)).length > 2 && (this.diff_cleanupSemantic(r), this.diff_cleanupEfficiency(r));
      } else if (e && typeof e == "object" && undefined === t && undefined === n) {
        r = e;
        i = this.diff_text1(r);
      } else if (typeof e == "string" && t && typeof t == "object" && undefined === n) {
        i = e;
        r = t;
      } else {
        if (typeof e != "string" || typeof t != "string" || !n || typeof n != "object")
          throw new Error("Unknown call format to patch_make");
        i = e;
        r = n;
      }
      if (r.length === 0) return [];
      for (var o = [], a = new Gj(), s = 0, start1 = 0, start2 = 0, u = i, h = i, p = 0; p < r.length; p++) {
        var d = r[p][0],
          f = r[p][1];
        switch ((s || d === Fj.DIFF_EQUAL || ((a.start1 = start1), (a.start2 = start2)), d)) {
          case Fj.DIFF_INSERT:
            a.diffs[s++] = r[p];
            a.length2 += f.length;
            h = h.substring(0, start2) + f + h.substring(start2);
            break;
          case Fj.DIFF_DELETE:
            a.length1 += f.length;
            a.diffs[s++] = r[p];
            h = h.substring(0, start2) + h.substring(start2 + f.length);
            break;
          case Fj.DIFF_EQUAL:
            f.length <= 2 * this.patchMargin && s && r.length !== p + 1
              ? ((a.diffs[s++] = r[p]), (a.length1 += f.length), (a.length2 += f.length))
              : f.length >= 2 * this.patchMargin &&
                s &&
                (this.patch_addContext_(a, u), o.push(a), (a = new Gj()), (s = 0), (u = h), (start1 = start2));
        }
        d !== Fj.DIFF_INSERT && (start1 += f.length);
        d !== Fj.DIFF_DELETE && (start2 += f.length);
      }
      s && (this.patch_addContext_(a, u), o.push(a));
      return o;
    };
    e.prototype.patch_deepCopy = function (e) {
      for (var t = [], n = 0; n < e.length; n++) {
        for (var i = e[n], r = new Gj(), o = 0; o < i.diffs.length; o++) r.diffs[o] = [i.diffs[o][0], i.diffs[o][1]];
        r.start1 = i.start1;
        r.start2 = i.start2;
        r.length1 = i.length1;
        r.length2 = i.length2;
        t[n] = r;
      }
      return t;
    };
    e.prototype.patch_apply = function (e, t) {
      if (e.length === 0) return [t, []];
      e = this.patch_deepCopy(e);
      var n = this.patch_addPadding(e);
      t = n + t + n;
      this.patch_splitMax(e);
      for (var i = 0, r = [], o = 0; o < e.length; o++) {
        var a = e[o].start2 + i,
          s = this.diff_text1(e[o].diffs),
          l = undefined,
          c = -1;
        if (
          (s.length > this.matchMaxBits
            ? -1 !== (l = this.match_main(t, s.substring(0, this.matchMaxBits), a)) &&
              (-1 ===
                (c = this.match_main(t, s.substring(s.length - this.matchMaxBits), a + s.length - this.matchMaxBits)) ||
                l >= c) &&
              (l = -1)
            : (l = this.match_main(t, s, a)),
          -1 === l)
        ) {
          r[o] = false;
          i -= e[o].length2 - e[o].length1;
        } else {
          r[o] = true;
          i = l - a;
          var u = undefined;
          if (s === (u = -1 === c ? t.substring(l, l + s.length) : t.substring(l, c + this.matchMaxBits)))
            t = t.substring(0, l) + this.diff_text2(e[o].diffs) + t.substring(l + s.length);
          else {
            var h = this.diff_main(s, u, !1);
            if (s.length > this.matchMaxBits && this.diff_levenshtein(h) / s.length > this.patchDeleteThreshold)
              r[o] = false;
            else {
              this.diff_cleanupSemanticLossless(h);
              for (var p = 0, d = 0, f = 0; f < e[o].diffs.length; f++) {
                var m = e[o].diffs[f];
                m[0] !== Fj.DIFF_EQUAL && (d = this.diff_xIndex(h, p));
                m[0] === Fj.DIFF_INSERT
                  ? (t = t.substring(0, l + d) + m[1] + t.substring(l + d))
                  : m[0] === Fj.DIFF_DELETE &&
                    (t = t.substring(0, l + d) + t.substring(l + this.diff_xIndex(h, p + m[1].length)));
                m[0] !== Fj.DIFF_DELETE && (p += m[1].length);
              }
            }
          }
        }
      }
      return [(t = t.substring(n.length, t.length - n.length)), r];
    };
    e.prototype.patch_addPadding = function (e) {
      for (var start1 = this.patchMargin, n = "", i = 1; i <= start1; i++) n += String.fromCharCode(i);
      for (i = 0; i < e.length; i++) {
        e[i].start1 += start1;
        e[i].start2 += start1;
      }
      var r = e[0],
        o = r.diffs;
      if (o.length === 0 || o[0][0] !== Fj.DIFF_EQUAL) {
        o.unshift([Fj.DIFF_EQUAL, n]);
        r.start1 -= start1;
        r.start2 -= start1;
        r.length1 += start1;
        r.length2 += start1;
      } else if (start1 > o[0][1].length) {
        var start1a0 = start1 - o[0][1].length;
        o[0][1] = n.substring(o[0][1].length) + o[0][1];
        r.start1 -= start1a0;
        r.start2 -= start1a0;
        r.length1 += start1a0;
        r.length2 += start1a0;
      }
      if ((o = (r = e[e.length - 1]).diffs).length === 0 || o[o.length - 1][0] !== Fj.DIFF_EQUAL) {
        o.push([Fj.DIFF_EQUAL, n]);
        r.length1 += start1;
        r.length2 += start1;
      } else if (start1 > o[o.length - 1][1].length) {
        start1a0 = start1 - o[o.length - 1][1].length;
        o[o.length - 1][1] += n.substring(0, start1a0);
        r.length1 += start1a0;
        r.length2 += start1a0;
      }
      return n;
    };
    e.prototype.patch_splitMax = function (e) {
      for (var t = this.matchMaxBits, n = 0; n < e.length; n++)
        if (!(e[n].length1 <= t)) {
          var i = e[n];
          e.splice(n--, 1);
          for (var r = i.start1, o = i.start2, a = ""; i.diffs.length !== 0; ) {
            var s = new Gj(),
              l = true;
            for (
              s.start1 = r - a.length,
                s.start2 = o - a.length,
                a !== "" && ((s.length1 = s.length2 = a.length), s.diffs.push([Fj.DIFF_EQUAL, a]));
              i.diffs.length !== 0 && s.length1 < t - this.patchMargin;
            ) {
              var c = i.diffs[0][0],
                u = i.diffs[0][1];
              c === Fj.DIFF_INSERT
                ? ((s.length2 += u.length), (o += u.length), s.diffs.push(i.diffs.shift()), (l = false))
                : c === Fj.DIFF_DELETE && s.diffs.length === 1 && s.diffs[0][0] === Fj.DIFF_EQUAL && u.length > 2 * t
                  ? ((s.length1 += u.length), (r += u.length), (l = false), s.diffs.push([c, u]), i.diffs.shift())
                  : ((u = u.substring(0, t - s.length1 - this.patchMargin)),
                    (s.length1 += u.length),
                    (r += u.length),
                    c === Fj.DIFF_EQUAL ? ((s.length2 += u.length), (o += u.length)) : (l = false),
                    s.diffs.push([c, u]),
                    u === i.diffs[0][1] ? i.diffs.shift() : (i.diffs[0][1] = i.diffs[0][1].substring(u.length)));
            }
            a = (a = this.diff_text2(s.diffs)).substring(a.length - this.patchMargin);
            var h = this.diff_text1(i.diffs).substring(0, this.patchMargin);
            h !== "" &&
              ((s.length1 += h.length),
              (s.length2 += h.length),
              s.diffs.length !== 0 && s.diffs[s.diffs.length - 1][0] === Fj.DIFF_EQUAL
                ? (s.diffs[s.diffs.length - 1][1] += h)
                : s.diffs.push([Fj.DIFF_EQUAL, h]));
            l || e.splice(++n, 0, s);
          }
        }
    };
    e.prototype.patch_toText = function (e) {
      for (var t = [], n = 0; n < e.length; n++) t[n] = e[n];
      return t.join("");
    };
    e.prototype.patch_fromText = function (e) {
      var t = [];
      if (!e) return t;
      for (var n = e.split("\n"), i = 0, r = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; i < n.length; ) {
        var o = n[i].match(r);
        if (!o) throw new Error("Invalid patch string: " + n[i]);
        var a = new Gj();
        t.push(a);
        a.start1 = parseInt(o[1], 10);
        o[2] === ""
          ? (a.start1--, (a.length1 = 1))
          : o[2] === "0"
            ? (a.length1 = 0)
            : (a.start1--, (a.length1 = parseInt(o[2], 10)));
        a.start2 = parseInt(o[3], 10);
        o[4] === ""
          ? (a.start2--, (a.length2 = 1))
          : o[4] === "0"
            ? (a.length2 = 0)
            : (a.start2--, (a.length2 = parseInt(o[4], 10)));
        i++;
        for (var s = undefined, l = undefined, c = undefined; i < n.length; ) {
          s = n[i].charAt(0);
          c = n[i].substring(1);
          try {
            l = decodeURI(c);
          } catch (e) {
            throw new Error("Illegal escape in patch_fromText: " + c);
          }
          if (s === "-") a.diffs.push([Fj.DIFF_DELETE, l]);
          else if (s === "+") a.diffs.push([Fj.DIFF_INSERT, l]);
          else if (s === " ") a.diffs.push([Fj.DIFF_EQUAL, l]);
          else {
            if (s === "@") break;
            if (s !== "") throw new Error('Invalid patch mode "' + s + '" in: ' + l);
          }
          i++;
        }
      }
      return t;
    };
    e.prototype.diff_compute_ = function (e, t, n, i) {
      var r;
      if (!e) return [[Fj.DIFF_INSERT, t]];
      if (!t) return [[Fj.DIFF_DELETE, e]];
      var o = e.length > t.length ? e : t,
        a = e.length > t.length ? t : e,
        s = o.indexOf(a);
      if (-1 !== s) {
        r = [
          [Fj.DIFF_INSERT, o.substring(0, s)],
          [Fj.DIFF_EQUAL, a],
          [Fj.DIFF_INSERT, o.substring(s + a.length)],
        ];
        e.length > t.length && ((r[0][0] = Fj.DIFF_DELETE), (r[2][0] = Fj.DIFF_DELETE));
        return r;
      }
      if (a.length === 1)
        return [
          [Fj.DIFF_DELETE, e],
          [Fj.DIFF_INSERT, t],
        ];
      var l = this.diff_halfMatch_(e, t);
      if (l) {
        var c = l[0],
          u = l[1],
          h = l[2],
          p = l[3],
          d = l[4],
          f = this.diff_main(c, h, n, i),
          m = this.diff_main(u, p, n, i);
        return f.concat([[Fj.DIFF_EQUAL, d]], m);
      }
      return n && e.length > 100 && t.length > 100 ? this.diff_lineMode_(e, t, i) : this.diff_bisect_(e, t, i);
    };
    e.prototype.diff_lineMode_ = function (e, t, n) {
      var i = this.diff_linesToChars_(e, t);
      e = i.chars1;
      t = i.chars2;
      var r = i.lineArray,
        o = this.diff_main(e, t, !1, n);
      this.diff_charsToLines_(o, r);
      this.diff_cleanupSemantic(o);
      o.push([Fj.DIFF_EQUAL, ""]);
      for (var a = 0, s = 0, l = 0, c = "", u = ""; a < o.length; ) {
        switch (o[a][0]) {
          case Fj.DIFF_INSERT:
            l++;
            u += o[a][1];
            break;
          case Fj.DIFF_DELETE:
            s++;
            c += o[a][1];
            break;
          case Fj.DIFF_EQUAL:
            if (s >= 1 && l >= 1) {
              o.splice(a - s - l, s + l);
              a = a - s - l;
              for (var h = this.diff_main(c, u, !1, n), p = h.length - 1; p >= 0; p--) o.splice(a, 0, h[p]);
              a += h.length;
            }
            l = 0;
            s = 0;
            c = "";
            u = "";
        }
        a++;
      }
      o.pop();
      return o;
    };
    e.prototype.diff_bisect_ = function (e, t, n) {
      for (
        var i = e.length,
          r = t.length,
          o = Math.ceil((i + r) / 2),
          a = o,
          s = 2 * o,
          l = new Array(s),
          c = new Array(s),
          u = 0;
        u < s;
        u++
      ) {
        l[u] = -1;
        c[u] = -1;
      }
      l[a + 1] = 0;
      c[a + 1] = 0;
      for (var h = i - r, p = h % 2 != 0, d = 0, f = 0, m = 0, g = 0, v = 0; v < o && !(Date.now() > n); v++) {
        for (var y = -v + d; y <= v - f; y += 2) {
          for (
            var b = a + y,
              w = undefined,
              k = (w = y === -v || (y !== v && l[b - 1] < l[b + 1]) ? l[b + 1] : l[b - 1] + 1) - y;
            w < i && k < r && e.charAt(w) === t.charAt(k);
          ) {
            w++;
            k++;
          }
          if (((l[b] = w), w > i)) f += 2;
          else if (k > r) d += 2;
          else if (p) {
            if ((E = a + h - y) >= 0 && E < s && -1 !== c[E])
              if (w >= (S = i - c[E])) return this.diff_bisectSplit_(e, t, w, k, n);
          }
        }
        for (var C = -v + m; C <= v - g; C += 2) {
          for (
            var E = a + C,
              S = undefined,
              M = (S = C === -v || (C !== v && c[E - 1] < c[E + 1]) ? c[E + 1] : c[E - 1] + 1) - C;
            S < i && M < r && e.charAt(i - S - 1) === t.charAt(r - M - 1);
          ) {
            S++;
            M++;
          }
          if (((c[E] = S), S > i)) g += 2;
          else if (M > r) m += 2;
          else if (!p) {
            if ((b = a + h - C) >= 0 && b < s && -1 !== l[b]) {
              k = a + (w = l[b]) - b;
              if (w >= (S = i - S)) return this.diff_bisectSplit_(e, t, w, k, n);
            }
          }
        }
      }
      return [
        [Fj.DIFF_DELETE, e],
        [Fj.DIFF_INSERT, t],
      ];
    };
    e.prototype.diff_bisectSplit_ = function (e, t, n, i, r) {
      var o = e.substring(0, n),
        a = t.substring(0, i),
        s = e.substring(n),
        l = t.substring(i),
        c = this.diff_main(o, a, !1, r),
        u = this.diff_main(s, l, !1, r);
      return c.concat(u);
    };
    e.prototype.diff_linesToChars_ = function (e, t) {
      var lineArray = [],
        i = {};
      lineArray[0] = "";
      return {
        chars1: this.diff_linesToCharsMunge_(e, lineArray, i, 4e4),
        chars2: this.diff_linesToCharsMunge_(t, lineArray, i, 65535),
        lineArray: lineArray,
      };
    };
    e.prototype.diff_linesToCharsMunge_ = function (e, t, n, i) {
      for (var r = "", o = 0, a = -1, s = t.length; a < e.length - 1; ) {
        if (-1 === (a = e.indexOf("\n", o))) {
          a = e.length - 1;
        }
        var l = e.substring(o, a + 1);
        (n.hasOwnProperty ? n.hasOwnProperty(l) : undefined !== n[l])
          ? (r += String.fromCharCode(n[l]))
          : (s === i && ((l = e.substring(o)), (a = e.length)),
            (r += String.fromCharCode(s)),
            (n[l] = s),
            (t[s++] = l));
        o = a + 1;
      }
      return r;
    };
    e.prototype.diff_charsToLines_ = function (e, t) {
      for (var n = 0; n < e.length; n++) {
        for (var i = e[n][1], r = [], o = 0; o < i.length; o++) r[o] = t[i.charCodeAt(o)];
        e[n][1] = r.join("");
      }
    };
    e.prototype.diff_commonOverlap_ = function (e, t) {
      var n = e.length,
        i = t.length;
      if (n === 0 || i === 0) return 0;
      n > i ? (e = e.substring(n - i)) : n < i && (t = t.substring(0, n));
      var r = qj(n, i);
      if (e === t) return r;
      for (var o = 0, a = 1; ; ) {
        var s = e.substring(r - a),
          l = t.indexOf(s);
        if (-1 === l) return o;
        a += l;
        (l !== 0 && e.substring(r - a) !== t.substring(0, a)) || ((o = a), a++);
      }
    };
    e.prototype.diff_halfMatch_ = function (e, t) {
      if (this.diffTimeout <= 0) return null;
      var n = e.length > t.length ? e : t,
        i = e.length > t.length ? t : e;
      if (n.length < 4 || 2 * i.length < n.length) return null;
      var r,
        o,
        a,
        s,
        l,
        c = this.diff_halfMatchI_(n, i, Math.ceil(n.length / 4)),
        u = this.diff_halfMatchI_(n, i, Math.ceil(n.length / 2));
      if (!c && !u) return null;
      var h = (r = u ? (c && c[4].length > u[4].length ? c : u) : c)[4];
      e.length > t.length
        ? ((o = r[0]), (a = r[1]), (s = r[2]), (l = r[3]))
        : ((s = r[0]), (l = r[1]), (o = r[2]), (a = r[3]));
      return [o, a, s, l, h];
    };
    e.prototype.diff_halfMatchI_ = function (e, t, n) {
      for (var i, r, o, a, s = e.substring(n, n + Math.floor(e.length / 4)), l = "", c = t.indexOf(s, 0); -1 !== c; ) {
        var u = this.diff_commonPrefix(e.substring(n), t.substring(c)),
          h = this.diff_commonSuffix(e.substring(0, n), t.substring(0, c));
        l.length < h + u &&
          ((l = t.substring(c - h, c) + t.substring(c, c + u)),
          (i = e.substring(0, n - h)),
          (r = e.substring(n + u)),
          (o = t.substring(0, c - h)),
          (a = t.substring(c + u)));
        c = t.indexOf(s, c + 1);
      }
      return 2 * l.length >= e.length ? [i, r, o, a, l] : null;
    };
    e.prototype.diff_cleanupSemanticScore_ = function (e, t) {
      if (!e || !t) return 6;
      var n = e.charAt(e.length - 1),
        i = t.charAt(0),
        r = n.match(Rj),
        o = i.match(Rj),
        a = r && n.match(Bj),
        s = o && i.match(Bj),
        l = a && n.match(Vj),
        c = s && i.match(Vj),
        u = l && e.match(Hj),
        h = c && t.match(zj);
      return u || h ? 5 : l || c ? 4 : r && !a && s ? 3 : a || s ? 2 : r || o ? 1 : 0;
    };
    e.prototype.match_bitap_ = function (e, t, n) {
      if (t.length > this.matchMaxBits) throw new Error("Pattern too long for this browser");
      var i = this.match_alphabet_(t),
        r = this.matchThreshold,
        o = e.indexOf(t, n);
      if (-1 !== o) {
        r = qj(this.match_bitapScore_(0, o, t, n), r);
        -1 !== (o = e.lastIndexOf(t, n + t.length)) && (r = qj(this.match_bitapScore_(0, o, t, n), r));
      }
      var a,
        s,
        l = 1 << (t.length - 1);
      o = -1;
      for (var c, u = t.length + e.length, h = 0; h < t.length; h++) {
        for (a = 0, s = u; a < s; ) {
          this.match_bitapScore_(h, n + s, t, n) <= r ? (a = s) : (u = s);
          s = Math.floor((u - a) / 2 + a);
        }
        u = s;
        var p = Wj(1, n - s + 1),
          d = qj(n + s, e.length) + t.length,
          f = Array(d + 2);
        f[d + 1] = (1 << h) - 1;
        for (var m = d; m >= p; m--) {
          var g = i[e.charAt(m - 1)];
          if (
            ((f[m] =
              h === 0
                ? ((f[m + 1] << 1) | 1) & g
                : (((f[m + 1] << 1) | 1) & g) | ((c[m + 1] | c[m]) << 1) | 1 | c[m + 1]),
            f[m] & l)
          ) {
            var v = this.match_bitapScore_(h, m - 1, t, n);
            if (v <= r) {
              if (((r = v), !((o = m - 1) > n))) break;
              p = Wj(1, 2 * n - o);
            }
          }
        }
        if (this.match_bitapScore_(h + 1, n, t, n) > r) break;
        c = f;
      }
      return o;
    };
    e.prototype.match_bitapScore_ = function (e, t, n, i) {
      var r = e / n.length,
        o = Math.abs(i - t);
      return this.matchDistance ? r + o / this.matchDistance : o ? 1 : r;
    };
    e.prototype.match_alphabet_ = function (e) {
      for (var t = {}, n = 0; n < e.length; n++) t[e.charAt(n)] = 0;
      for (n = 0; n < e.length; n++) t[e.charAt(n)] |= 1 << (e.length - n - 1);
      return t;
    };
    e.prototype.patch_addContext_ = function (e, t) {
      if (t.length !== 0) {
        if (e.start2 == null) throw Error("patch not initialized");
        for (
          var n = t.substring(e.start2, e.start2 + e.length1), i = 0;
          t.indexOf(n) !== t.lastIndexOf(n) && n.length < this.matchMaxBits - this.patchMargin - this.patchMargin;
        ) {
          i += this.patchMargin;
          n = t.substring(e.start2 - i, e.start2 + e.length1 + i);
        }
        i += this.patchMargin;
        var r = t.substring(e.start2 - i, e.start2);
        if (r) {
          e.diffs.unshift([Fj.DIFF_EQUAL, r]);
        }
        var o = t.substring(e.start2 + e.length1, e.start2 + e.length1 + i);
        o && e.diffs.push([Fj.DIFF_EQUAL, o]);
        e.start1 -= r.length;
        e.start2 -= r.length;
        e.length1 += r.length + o.length;
        e.length2 += r.length + o.length;
      }
    };
    return e;
  })(),
  Gj = (function () {
    function e() {
      this.diffs = [];
      this.start1 = 0;
      this.start2 = 0;
      this.length1 = 0;
      this.length2 = 0;
    }
    e.prototype.toString = function () {
      for (
        var e,
          t = [
            "@@ -" +
              (this.length1 === 0
                ? this.start1 + ",0"
                : this.length1 === 1
                  ? this.start1 + 1
                  : this.start1 + 1 + "," + this.length1) +
              " +" +
              (this.length2 === 0
                ? this.start2 + ",0"
                : this.length2 === 1
                  ? this.start2 + 1
                  : this.start2 + 1 + "," + this.length2) +
              " @@\n",
          ],
          n = 0;
        n < this.diffs.length;
        n++
      ) {
        switch (this.diffs[n][0]) {
          case Fj.DIFF_INSERT:
            e = "+";
            break;
          case Fj.DIFF_DELETE:
            e = "-";
            break;
          case Fj.DIFF_EQUAL:
            e = " ";
        }
        t[n + 1] = e + encodeURI(this.diffs[n][1]) + "\n";
      }
      return t.join("").replace(/%20/g, " ");
    };
    return e;
  })();
function Kj(e, t, n) {
  var i = new jj(),
    r = i.diff_main(e, t, !0, 0);
  if (r.length > 2) {
    i.diff_cleanupSemantic(r);
    i.diff_cleanupEfficiency(r);
  }
  var o = i.patch_make(e, r);
  return i.patch_apply(o, n)[0];
}
function Yj(e) {
  var t = e.split("\n");
  t.length > 1 && t.last() === "" && t.pop();
  return t;
}
function Zj(e, t) {
  e.endsWith("\n") || (e += "\n");
  t.endsWith("\n") || (t += "\n");
  var n = new jj(),
    i = n.diff_lineMode(e, t);
  n.diff_cleanupSemantic(i);
  for (
    var r = createDiv("diff-view"),
      o = function (e, t) {
        var n = createEl("div", "diff-line");
        t && n.addClass("mod-" + t);
        e != null && n.setText(e);
        n.createEl("br");
        return n;
      },
      a = [],
      s = function (e) {
        if (a.length !== 0) {
          var t = r.childNodes.length === 0,
            n = t || e ? 5 : 10;
          if (a.length > n) {
            var i = [],
              o = createDiv("diff-collapsed");
            o.addEventListener("click", function () {
              var e = o.parentNode;
              if (e) {
                for (var t = 0, n = i; t < n.length; t++) {
                  var r = n[t];
                  e.insertBefore(r, o);
                }
                o.detach();
              }
            });
            var s = 0;
            if (t) {
              for (var l = 0; l < a.length - 3; l++) {
                i.push(a[l]);
                s++;
              }
              r.appendChild(o);
              for (l = a.length - 3; l < a.length; l++) r.appendChild(a[l]);
            } else if (e) {
              for (l = 0; l < 3; l++) r.appendChild(a[l]);
              r.appendChild(o);
              for (l = 3; l < a.length; l++) {
                i.push(a[l]);
                s++;
              }
            } else {
              for (l = 0; l < 3; l++) r.appendChild(a[l]);
              for (l = 3; l < a.length - 3; l++) {
                i.push(a[l]);
                s++;
              }
              r.appendChild(o);
              for (l = a.length - 3; l < a.length; l++) r.appendChild(a[l]);
            }
            o.setText("".concat(s, " lines folded"));
          } else
            for (var c = 0, u = a; c < u.length; c++) {
              var h = u[c];
              r.appendChild(h);
            }
          a = [];
        }
      },
      l = [],
      c = [],
      u = function () {
        if (l.length !== 0 || c.length !== 0) {
          for (var e = 0, t = l; e < t.length; e++) {
            var n = t[e];
            r.appendChild(n);
          }
          for (var i = 0, o = c; i < o.length; i++) {
            n = o[i];
            r.appendChild(n);
          }
          l = [];
          c = [];
        }
      },
      h = function (e, t) {
        var i = e !== t;
        if (e && t && i) {
          var r = n.diff_wordMode(e, t);
          if (n.diff_levenshtein(r) < Math.max(e.length, t.length) / 2) {
            var h = createFragment(),
              p = createFragment();
            (function (e, t) {
              for (var n = 0; n < e.length; n++) {
                var i = e[n];
                t(i[0], i[1]);
              }
            })(r, function (e, textt0) {
              switch (e) {
                case Fj.DIFF_INSERT:
                  p.createSpan({
                    cls: "diff-changed",
                    text: textt0,
                  });
                  break;
                case Fj.DIFF_DELETE:
                  h.createSpan({
                    cls: "diff-changed",
                    text: textt0,
                  });
                  break;
                case Fj.DIFF_EQUAL:
                  h.createSpan({
                    text: textt0,
                  });
                  p.createSpan({
                    text: textt0,
                  });
              }
            });
            s();
            l.push(o(h, "left"));
            return void c.push(o(p, "right"));
          }
        }
        i ? (s(), l.push(o(e, "left")), c.push(o(t, "right"))) : (u(), a.push(o(e, null)));
      },
      p = 0;
    p < i.length;
    p++
  ) {
    var d = i[p][0],
      f = Yj(i[p][1]),
      m = p + 1;
    if (d === Fj.DIFF_DELETE && m < i.length && i[m][0] === Fj.DIFF_INSERT) {
      for (var g = Yj(i[m][1]), v = Math.max(f.length, g.length), y = 0; y < v; y++) {
        h(f[y], g[y]);
      }
      p++;
    } else
      for (var b = 0, w = f; b < w.length; b++) {
        var k = w[b];
        switch (d) {
          case Fj.DIFF_INSERT:
            h(null, k);
            break;
          case Fj.DIFF_DELETE:
            h(k, null);
            break;
          case Fj.DIFF_EQUAL:
            h(k, k);
        }
      }
  }
  u();
  s(!0);
  return r;
}
var TextFileView = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.lastSavedData = null;
      n.saving = false;
      n.saveAgain = false;
      n.isPlaintext = true;
      n.data = null;
      n.dirty = false;
      var i = debounce(n.save.bind(n), 2e3);
      n.requestSave = function () {
        n.dirty = true;
        i();
      };
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      var t = this.app.vault;
      this.registerEvent(t.on("modify", this.onModify, this));
    };
    t.prototype.onUnloadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.save(!0)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.loadFileInternal(e, !0)];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.saveImmediately = function () {
      if (this.dirty) return this.save(!1);
    };
    t.prototype.save = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, data, lastSavedData, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (((this.dirty = false), (n = (t = this).file), (i = t.app), (r = i.vault), !n || n.deleted))
                return [2];
              if (this.saving) {
                e || (this.saveAgain = true);
                return [2];
              }
              if (
                ((this.saveAgain = false),
                (data = this.getViewData()),
                this.lastSavedData === data || this.lastSavedData === null)
              )
                return [3, 6];
              lastSavedData = this.lastSavedData;
              e
                ? ((this.data = null), (this.lastSavedData = null), this.clear())
                : ((this.data = data), (this.lastSavedData = data));
              this.saving = true;
              l.label = 1;
            case 1:
              l.trys.push([1, 4, 5, 6]);
              return [4, hx(r.adapter.promise)];
            case 2:
              l.sent();
              return [4, r.modify(n, data)];
            case 3:
              l.sent();
              return [3, 6];
            case 4:
              throw (
                (s = l.sent()),
                (this.lastSavedData = lastSavedData),
                console.error(s),
                new Notice(
                  i18nProxy.interface.msgFailToSaveFile({
                    filepath: n.path,
                    message: s.message,
                  }),
                  0,
                ),
                this.app.fileManager.storeTextFileBackup(n.path, data),
                s
              );
            case 5:
              this.saving = false;
              this.saveAgain && !e && this.save();
              return [7];
            case 6:
              return [2];
          }
        });
      });
    };
    t.prototype.onModify = function (e) {
      if (!this.saving) {
        e === this.file && this.loadFileInternal(e, !1);
      }
    };
    t.prototype.loadFileInternal = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var lastSavedData, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return e.saving ? [4, this.app.vault.cachedRead(e)] : [3, 2];
            case 1:
              lastSavedData = o.sent();
              return [3, 4];
            case 2:
              return [4, this.app.vault.read(e)];
            case 3:
              lastSavedData = o.sent();
              o.label = 4;
            case 4:
              if (((i = this.lastSavedData), (this.lastSavedData = lastSavedData), !t && i)) {
                if (i === lastSavedData) return [2];
                if (this.dirty) {
                  if ((r = this.getViewData()) === lastSavedData) return [2];
                  if (r !== i && this.isPlaintext) {
                    lastSavedData = Kj(i, r, lastSavedData);
                    new Notice(
                      i18nProxy.interface.msgFileChanged({
                        file: e.path,
                      }),
                    );
                  }
                }
              }
              this.setData(lastSavedData, t);
              return [2];
          }
        });
      });
    };
    t.prototype.setData = function (data, t) {
      if (this.data !== data || t) {
        this.data = data;
        this.setViewData(data, t);
      }
    };
    return t;
  })(EditableFileView),
  Qj = "bases",
  $j = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.navigation = true;
      i.isPlaintext = false;
      i.lastData = "";
      i.plugin = plugin;
      var r = i.app.workspace.isInSidebar(i.leaf) ? i.app.workspace.getActiveFile() : null,
        o = (i.controller = new PG(i.app, i.plugin, i.contentEl, r));
      i.controller.events.on("view-changed", i.onViewChanged, i);
      i.addChild(o);
      return i;
    }
    __extends(t, e);
    t.prototype.load = function () {
      e.prototype.load.call(this);
      this.registerEvent(this.app.workspace.on("file-open", this.updateCurrentFile, this));
      this.registerEvent(this.app.workspace.on("layout-change", this.onLayoutChange, this));
    };
    t.prototype.onLayoutChange = function () {
      this.navigation = !this.app.workspace.isInSidebar(this.leaf);
    };
    t.prototype.getViewType = function () {
      return Qj;
    };
    t.prototype.getIcon = function () {
      var e,
        t = (e = this.controller.view) === null || undefined === e ? undefined : e.type;
      if (t) {
        var n = this.plugin.getRegistration(t);
        if (n && n.icon) return n.icon;
      }
      return "lucide-layout-list";
    };
    t.prototype.canAcceptExtension = function (e) {
      return e === "base";
    };
    t.prototype.updateCurrentFile = function (e) {
      this.app.workspace.isInSidebar(this.leaf)
        ? this.leaf.group ||
          this.leaf.pinned ||
          this.leaf.app.workspace.activeLeaf === this.leaf ||
          (e && e instanceof TFile ? this.controller.updateCurrentFile(e) : this.controller.updateCurrentFile(null))
        : this.controller.updateCurrentFile(null);
    };
    t.prototype.receiveSyncState = function (e) {
      this.controller.updateCurrentFile(e.file);
    };
    t.prototype.onGroupChange = function () {
      if ((e.prototype.onGroupChange.call(this), this.leaf.group))
        for (var t = 0, n = this.leaf.workspace.getGroupLeaves(this.leaf.group); t < n.length; t++) {
          var i = n[t];
          if (i !== this.leaf && i.view instanceof FileView) {
            this.controller.updateCurrentFile(i.view.file);
            break;
          }
        }
      else {
        var r = this.leaf.workspace.getActiveFile();
        this.controller.updateCurrentFile(r);
      }
    };
    t.prototype.getViewData = function () {
      var e = this.query;
      return e ? e.toString() : this.lastData;
    };
    t.prototype.setViewData = function (lastData, t) {
      var query,
        i = this;
      this.lastData = lastData;
      try {
        (query = gq.fromString(lastData)).saveFn = function (e) {
          return i.saveQuery(e);
        };
        this.query = query;
      } catch (e) {
        query = e;
        this.query = null;
      }
      t && this.controller.clear();
      this.controller.setQuery(query);
      this.leaf.updateHeader();
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.viewName = this.controller.viewName;
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              i = t.viewName;
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              r.sent();
              i && (this.controller.selectView(i), this.leaf.updateHeader());
              return [2];
          }
        });
      });
    };
    t.prototype.setEphemeralState = function (t) {
      if ((e.prototype.setEphemeralState.call(this, t), Object.hasOwn(t, "subpath") && t.subpath.startsWith("#"))) {
        var n = t.subpath.substring(1);
        this.controller.selectView(n);
      }
      this.controller.setEphemeralState(t);
    };
    t.prototype.getEphemeralState = function () {
      var t = e.prototype.getEphemeralState.call(this);
      Object.assign(t, this.controller.getEphemeralState());
      return t;
    };
    t.prototype.saveQuery = function (query) {
      var t = this;
      this.requestSave();
      this.lastData = query.toString();
      query.saveFn = function (e) {
        return t.saveQuery(e);
      };
      this.query = query;
      this.controller.setQuery(query);
    };
    t.prototype.clear = function () {
      this.controller.clear();
    };
    t.prototype.onViewChanged = function () {
      this.app.workspace.requestSaveLayout();
      this.leaf.updateHeader();
    };
    return t;
  })(TextFileView),
  Jj = i18nProxy.plugins.bases,
  eG = (function (e) {
    function t(app, containerEl) {
      var i = e.call(this) || this;
      i.errorEl = createDiv({
        cls: "tooltip bases-filter-query-message",
        text: Jj.msgNewItemFiltered(),
      });
      i.newlyCreatedFile = null;
      i.hoverPopover = null;
      i.app = app;
      i.containerEl = containerEl;
      i.buttonEl = containerEl.createDiv(
        {
          cls: "text-icon-button",
          attr: {
            tabindex: 0,
          },
        },
        function (e) {
          e.createSpan("text-button-icon", function (e) {
            return setIcon(e, "plus");
          });
          e.createSpan({
            cls: "text-button-label",
            text: Jj.labelNewItem(),
          });
          e.addEventListener("click", function (e) {
            return i.toggle(e);
          });
          e.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.defaultPrevented || (e.key !== " " && e.key !== "Enter"))) {
              i.open();
            }
          });
        },
      );
      i.registerDomEvent(containerEl.win, "click", function (e) {
        if (i.popover && !e.defaultPrevented) {
          i.popover.hoverEl.contains(e.targetNode) || i.close();
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.toggle = function (e) {
      e.preventDefault();
      this.popover ? this.close() : this.open();
    };
    t.prototype.close = function () {
      this.popover && (this.popover.hide(), (this.popover = null));
      this.newlyCreatedFile = null;
    };
    t.prototype.open = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          targetEl,
          i,
          r,
          o,
          a,
          s,
          l,
          c,
          u,
          newlyCreatedFile,
          p,
          d,
          f,
          m,
          g,
          v = this;
        return __generator(this, function (y) {
          switch (y.label) {
            case 0:
              return this.viewConfig && this.query
                ? ((t = (e = this).app),
                  (targetEl = e.containerEl),
                  (i = {}),
                  (r = this.query.newItemTemplate),
                  (o = this.query.newItemFolder || ""),
                  (a = false),
                  r &&
                    (s = t.vault.getFileByPath(r)) &&
                    (o === "" && (o = ((f = s.parent) === null || undefined === f ? undefined : f.path) || ""),
                    (i = t.metadataCache.getFileCache(s).frontmatter || {}),
                    (a = true)),
                  a || ((l = this.extractFrontmatterFromFormula()), o === "" && (o = l.folder), (i = l.frontmatter)),
                  o === "" &&
                    ((c =
                      (m = this.queryController.getCurrentFile()) === null || undefined === m ? undefined : m.path) ||
                      (c =
                        (g = t.workspace.getActiveViewOfType($j)) === null || undefined === g
                          ? undefined
                          : g.file.path),
                    (o = t.fileManager.getNewFileParent(c || "").path)),
                  o && !o.endsWith("/") && (o += "/"),
                  (u = t.vault.getAvailablePath(normalizePath("".concat(o, "Untitled")), "md")),
                  [4, t.vault.create(u, "")])
                : (this.close(), [2]);
            case 1:
              newlyCreatedFile = y.sent();
              return [
                4,
                t.fileManager.processFrontMatter(newlyCreatedFile, function (e) {
                  for (var t in i) e[t] = i[t];
                }),
              ];
            case 2:
              y.sent();
              return Platform.isPhone
                ? (this.app.workspace.getLeaf("tab").openFile(newlyCreatedFile, {
                    active: true,
                    eState: {
                      rename: "all",
                    },
                  }),
                  [2])
                : ((this.newlyCreatedFile = newlyCreatedFile),
                  this.buttonEl.addClass("has-active-menu"),
                  (d = this),
                  [
                    4,
                    IG.create({
                      app: t,
                      hoverParent: this,
                      targetEl: targetEl,
                      linktext: newlyCreatedFile.path,
                      sourcePath: newlyCreatedFile.path,
                      state: {
                        mode: "source",
                      },
                      waitTime: 0,
                    }),
                  ]);
            case 3:
              p = d.popover = y.sent();
              this.addChild(p);
              p.setIsFocused(!0);
              p.hoverEl.addClass("bases-new-item-popover");
              p.register(function () {
                var e;
                (e = v.errorEl) === null || undefined === e || e.detach();
                v.buttonEl.removeClass("has-active-menu");
              });
              p.embed instanceof yY && p.embed.focusTitle();
              return [2];
          }
        });
      });
    };
    t.prototype.updateQuery = function (queryController, query, viewConfig, i) {
      if (
        ((this.queryController = queryController),
        (this.query = query),
        (this.viewConfig = viewConfig),
        this.newlyCreatedFile && this.popover)
      )
        if (i.has(this.newlyCreatedFile)) this.errorEl.detach();
        else if (!this.errorEl.isShown()) {
          var r = this.popover.hoverEl,
            o = r.getBoundingClientRect();
          r.doc.body.append(this.errorEl);
          positionFloatingElement(o, this.errorEl, {
            horizontalAlignment: "center",
            gap: 10,
          });
        }
    };
    t.prototype.extractFrontmatterFromFormula = function () {
      for (
        var foldere0 = "",
          frontmatter = {},
          n = new lq([this.query.filters, this.viewConfig.filters].filter(Boolean)).optimize(),
          i = 0,
          r = (n == null ? undefined : n.getFilterRules()) || [];
        i < r.length;
        i++
      ) {
        var o = r[i];
        if (!o.negated) {
          var a = o.rule.rule.formula;
          if (a instanceof zz) {
            var s = a.expr;
            if (s instanceof qz && s.name === "isEmpty") {
              var l = this.evaluatePropertyFromFormula(s.subject),
                c = l.name;
              if (!((h = l.type) !== "note" || Object.hasOwn(frontmatter, c))) {
                frontmatter[c] = "";
              }
            }
          } else if (a instanceof Bz)
            try {
              if (![">=", "<=", "=="].includes(a.operator)) continue;
              var u = this.evaluatePropertyFromFormula(a.left),
                h = ((c = u.name), u.type),
                p = this.evaluateValueFromFormula([a.right]);
              h === "note"
                ? (frontmatter[c] = p)
                : h === "file" && c === "folder" && a.operator === "==" && String.isString(p) && (foldere0 = p);
            } catch (e) {}
          else if (a instanceof qz)
            try {
              var d = this.evaluatePropertyFromFormula(a.subject);
              c = d.name;
              h = d.type;
              p = this.evaluateValueFromFormula(a.args);
              if (h === "note") {
                if (["startsWith", "endsWith", "contains", "containsAny", "containsAll"].includes(a.name)) {
                  this.app.metadataTypeManager.getTypeInfo(c).inferred.type !== "multitext" ||
                    Array.isArray(p) ||
                    (p = [p]);
                  frontmatter[c] = p;
                }
              } else if (h === "file")
                if (a.name === "hasTag" && String.isString(p)) {
                  var tagsf0 = Object.hasOwn(frontmatter, "tags") ? frontmatter.tags : [];
                  if (Array.isArray(tagsf0)) {
                    tagsf0.push(p);
                    frontmatter.tags = tagsf0;
                  }
                } else if (a.name === "inFolder" && String.isString(p)) {
                  foldere0 = p;
                }
            } catch (e) {}
        }
      }
      for (var m = 0, g = this.viewConfig.getOrder(); m < g.length; m++) {
        var v = Xz(g[m]);
        c = v.name;
        if (!((h = v.type) !== "note" || Object.hasOwn(frontmatter, c))) {
          frontmatter[c] = null;
        }
      }
      return {
        frontmatter: frontmatter,
        folder: foldere0,
      };
    };
    t.prototype.evaluatePropertyFromFormula = function (e) {
      if (e instanceof Uz) {
        if (e.object instanceof Yz)
          return (type = e.object.id) === "note" || type === "file" || type === "formula"
            ? {
                type: type,
                name: e.index,
                isThis: !1,
              }
            : {
                type: "note",
                name: "".concat(e.object.id, ".").concat(e.index),
                isThis: false,
              };
      } else if (e instanceof Wz) {
        if (e.array instanceof Yz) {
          var type = e.array.id,
            n = e.index;
          if ((type === "note" || type === "file" || type === "formula") && n instanceof jz)
            return {
              type: type,
              name: n.value.toString(),
              isThis: !1,
            };
        }
      } else {
        if (e instanceof Yz) {
          if (["true", "false", "null"].contains(e.id)) throw new Error("Unsupported left-hand side of formula");
          return e.id === "file"
            ? {
                type: "file",
                name: "file",
                isThis: !1,
              }
            : {
                type: "note",
                name: e.id,
                isThis: !1,
              };
        }
        if (e instanceof qz && e.name === "list" && e.args.length === 1)
          return this.evaluatePropertyFromFormula(e.args[0]);
      }
      throw new Error("Formula cannot be deserialized");
    };
    t.prototype.evaluateValueFromFormula = function (e) {
      if (e.length === 0) throw new Error("Formula cannot be deserialized");
      for (var t = [], n = 0, i = e; n < i.length; n++) {
        var r = i[n],
          o = this.queryController.getMockValue(r);
        o instanceof HH
          ? t.push("[[".concat(o.file.path, "]]"))
          : o instanceof MH && !(o instanceof qH)
            ? t.push(o.data)
            : t.push(o.toString());
      }
      return t.length > 1 ? t : t[0];
    };
    return t;
  })(Component),
  tG = (function (e) {
    function t(controller) {
      var n = e.call(this) || this;
      n.containerEl = createDiv("bases-toolbar-menu-container");
      n.controller = controller;
      n.scope = new Scope(n.controller.scope);
      return n;
    }
    __extends(t, e);
    t.prototype.onShow = function () {};
    return t;
  })(Component),
  nG = i18nProxy.plugins.bases,
  iG = (function (e) {
    function t(queryController, n) {
      var i = e.call(this) || this;
      i.pageStack = [];
      i.formulas = {};
      i.viewConfig = null;
      var r = (i.app = queryController.app);
      i.queryController = queryController;
      i.toolbarItem = new EU(r, n, nG.labelProperties(), "list")
        .onOpen(function () {
          return i.onOpen();
        })
        .onClose(function () {
          return i.onClose();
        });
      i.toolbarItem.addClass("mod-properties");
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "scope", {
      get: function () {
        return this.toolbarItem.scope;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.onOpen = function () {
      var e = this;
      this.show(
        new rG(this)
          .onNext(function (t) {
            return e.show(new oG(e, t));
          })
          .onSelect(this.togglePropertyVisibility.bind(this)),
      );
    };
    t.prototype.onClose = function () {
      var e;
      for (this.toolbarItem.scrollEl.empty(); (e = this.pageStack.pop()); ) this.app.keymap.popScope(e.scope);
    };
    t.prototype.setEnabled = function (e) {
      this.toolbarItem.setEnabled(e);
    };
    t.prototype.show = function (e) {
      this.toolbarItem.scrollEl.setChildrenInPlace([e.containerEl]);
      e.onShow();
      this.pageStack.push(e);
      this.app.keymap.pushScope(e.scope);
    };
    t.prototype.close = function () {
      this.toolbarItem.setOpen(!1);
    };
    t.prototype.back = function () {
      var e = this.pageStack.pop();
      if (e) {
        this.app.keymap.popScope(e.scope);
      }
      var t = this.pageStack.last();
      if (t) {
        this.toolbarItem.scrollEl.setChildrenInPlace([t.containerEl]);
        t.onShow();
      }
    };
    t.prototype.updateQuery = function (query, viewConfig) {
      var n;
      this.query = query;
      this.viewConfig = viewConfig;
      this.formulas = (n = query.formulas) !== null && undefined !== n ? n : {};
      var i = false;
      for (var r in query.formulas)
        if (query.formulas[r] instanceof Nz) {
          i = true;
          break;
        }
      this.toolbarItem.buttonEl.toggleClass("mod-error", i);
    };
    t.prototype.setPropertyVisibility = function (e, t) {
      if (this.viewConfig.getOrder().contains(e) !== t) {
        this.togglePropertyVisibility(e);
      }
    };
    t.prototype.togglePropertyVisibility = function (e) {
      var t = this.viewConfig.getOrder();
      t.contains(e) ? t.remove(e) : t.push(e);
      this.viewConfig.setOrder(t);
    };
    t.prototype.updateFormula = function (e, t) {
      this.formulas[e] = t;
      this.query.setFormulas(this.formulas);
    };
    return t;
  })(Component),
  rG = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.query = "";
      n.searchComponent = new SearchComponent(n.containerEl)
        .setPlaceholder(nG.placeholderSearchProperty())
        .onChange(function (query) {
          n.query = query;
          n.renderProperties();
        });
      var i = n.searchComponent.inputEl;
      i.addEventListener("focus", function () {
        return n.containerEl.addClass("has-input-focus");
      });
      i.addEventListener("blur", function () {
        return n.containerEl.removeClass("has-input-focus");
      });
      var r = n.containerEl.createDiv("bases-toolbar-items");
      n.chooser = new Px(n, r, n.scope);
      n.scope.register([], "ArrowRight", function () {
        var e,
          t = n.chooser.getSelectedValue();
        if (t && t.type === "property") {
          (e = n.handleNext) === null || undefined === e || e.call(n, t.propId);
        }
      });
      n.scope.register(["Alt"], "ArrowUp", function () {
        var e = n.chooser.getSelectedValue();
        if (e && e.type === "property") {
          var t = n.controller.viewConfig,
            i = t.getOrder(),
            r = i.indexOf(e.propId);
          if (-1 !== r) {
            nc(i, r, Math.clamp(r - 1, 0, i.length));
            t.setOrder(i);
            n.renderProperties();
            n.chooser.setSelectedItem(
              n.chooser.values.findIndex(function (t) {
                return t.type === "property" && t.propId === e.propId;
              }),
            );
          }
        }
      });
      n.scope.register(["Alt"], "ArrowDown", function () {
        var e = n.chooser.getSelectedValue();
        if (e && e.type === "property") {
          var t = n.controller.viewConfig,
            i = t.getOrder(),
            r = i.indexOf(e.propId);
          if (-1 !== r) {
            nc(i, r, Math.clamp(r + 1, 0, i.length));
            t.setOrder(i);
            n.renderProperties();
            n.chooser.setSelectedItem(
              n.chooser.values.findIndex(function (t) {
                return t.type === "property" && t.propId === e.propId;
              }),
            );
          }
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onSelect = function (handleSelect) {
      this.handleSelect = handleSelect;
      return this;
    };
    t.prototype.onNext = function (handleNext) {
      this.handleNext = handleNext;
      return this;
    };
    t.prototype.onShow = function () {
      this.searchComponent.autoSelect();
      this.renderProperties();
    };
    t.prototype.selectSuggestion = function (e, t) {
      var n;
      e.type === "action"
        ? e.callback()
        : e.type === "property" && ((n = this.handleSelect) === null || undefined === n || n.call(this, e.propId));
      var i = this.chooser.getSelectedElement();
      if (i) {
        i.empty();
        this.renderSuggestion(e, i);
      }
    };
    t.prototype.renderProperties = function () {
      var e,
        t,
        n,
        i = this,
        r = prepareQuery(this.query),
        o = [],
        a = this.controller.viewConfig,
        s = a.getOrder(),
        l = this.controller.app.metadataTypeManager.getAllProperties(),
        c = this.controller.queryController.getProperties().filter(function (e) {
          return e !== "file.file";
        });
      if (this.query)
        for (var u in l) {
          var h = Qz("note", l[u].name);
          if (!c.contains(h)) {
            c.push(h);
          }
        }
      for (var p = 0, d = s; p < d.length; p++) {
        h = d[p];
        if (!c.contains(h)) {
          c.push(h);
        }
      }
      c.sort(function (e, t) {
        return Eb(e, t);
      });
      s &&
        ((e = c),
        (t = function (e) {
          return e;
        }),
        (n = new Map(
          s.map(function (e, t) {
            return [e, t];
          }),
        )),
        e.sort(function (e, i) {
          var r, o;
          return (
            ((r = n.get(t(e))) !== null && undefined !== r ? r : 1 / 0) -
            ((o = n.get(t(i))) !== null && undefined !== o ? o : 1 / 0)
          );
        }));
      for (var f = 0, m = c; f < m.length; f++) {
        var propId = m[f],
          v = Xz(propId).name,
          y = a.getDisplayName(propId),
          b = y !== v;
        if (fuzzySearch(r, y) || (b && fuzzySearch(r, v))) {
          o.push({
            type: "property",
            propId: propId,
            group: "properties",
          });
        }
      }
      var name = this.query.trim();
      if (name) {
        Object.hasOwn(l, name) ||
          o.push({
            type: "action",
            name: nG.actionAddProperty({
              name: name,
            }),
            icon: "lucide-plus",
            group: "actions",
            callback: function () {
              var e = Qz("note", i.query.trim() || nG.labelUntitledProperty());
              i.controller.setPropertyVisibility(e, !0);
              i.controller.show(new oG(i.controller, e, !0));
            },
          });
      }
      o.push({
        type: "action",
        name: nG.actionAddFormula(),
        icon: "lucide-square-function",
        group: "actions",
        callback: function () {
          var e = vU(new Set(Object.keys(i.controller.formulas)), i.query.trim() || nG.labelUntitledProperty()),
            t = Qz("formula", e);
          i.controller.updateFormula(e, new Dz(""));
          i.controller.setPropertyVisibility(t, !0);
          i.controller.show(new oG(i.controller, t, !0));
        },
      });
      o.push({
        group: "actions",
        type: "action",
        name: nG.actionHideAll(),
        icon: "lucide-eye-off",
        callback: function () {
          var e = i.controller.viewConfig;
          e == null || e.setOrder([]);
          i.renderProperties();
        },
      });
      this.chooser.setSuggestions(o);
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n = this,
        i = this.controller,
        r = i.app,
        o = i.viewConfig;
      t.addClass("bases-toolbar-menu-item");
      var a = t.createDiv("bases-toolbar-menu-item-info"),
        s = a.createDiv("bases-toolbar-menu-item-info-icon");
      if (e.type === "action") {
        setIcon(s, e.icon);
        a.createDiv({
          cls: "bases-toolbar-menu-item-name",
          text: e.name,
        });
      } else if (e.type === "property") {
        var l = e.propId,
          c = Xz(l),
          u = c.type,
          h = c.name,
          p = t.createEl("input", {
            type: "checkbox",
            prepend: !0,
          });
        p.addEventListener("touchstart", function (e) {
          e.preventDefault();
          var t = !p.checked,
            i = function (e) {
              e.preventDefault();
              var i = e.touches[0],
                r = document.elementFromPoint(i.clientX, i.clientY).closest("input[type=checkbox");
              if (r && r.checked !== t)
                for (var selectedItem = 0; selectedItem < n.chooser.values.length; selectedItem++) {
                  var a = n.chooser.values[selectedItem];
                  if (n.chooser.suggestions[selectedItem].contains(r)) {
                    n.chooser.selectedItem = selectedItem;
                    n.selectSuggestion(a, null);
                    break;
                  }
                }
            },
            r = function () {
              p.removeEventListener("touchmove", i);
              p.removeEventListener("touchend", r);
              p.removeEventListener("touchcancel", r);
            };
          p.addEventListener("touchmove", i);
          p.addEventListener("touchend", r);
          p.addEventListener("touchcancel", r);
        });
        var d = o.getOrder();
        if (u === "note") setIcon(s, r.metadataTypeManager.getTypeInfo(h).expected.icon);
        else if (u === "formula") {
          setIcon(s, "lucide-square-function");
          var f = this.controller.formulas[h];
          (f == null ? undefined : f.formula) instanceof Nz
            ? (s.addClass("mod-error"), setTooltip(s, f.formula.getErrorMessage()))
            : s.removeClass("mod-error");
        } else setIcon(s, "lucide-info");
        t.toggleClass("mod-implicit", u === "file");
        t.toggleClass("mod-formula", u === "formula");
        a.createDiv({
          cls: "bases-toolbar-menu-item-name",
          text: o.getDisplayName(l),
        });
        var checked = d.contains(l);
        t.toggleClass("mod-hidden", !checked);
        p.checked = checked;
        var g = t.createDiv("clickable-icon bases-toolbar-menu-item-icon");
        setIcon(g, "lucide-chevron-right");
        g.addEventListener("click", function (e) {
          var t;
          e.preventDefault();
          var i = n.chooser.selectedItem;
          if (n.chooser.values[i].type === "property") {
            (t = n.handleNext) === null || undefined === t || t.call(n, l);
          }
        });
        checked &&
          Vc(
            s,
            t,
            t.parentElement,
            10,
            function () {},
            function (e) {
              var t = d.indexOf(l);
              nc(d, t, e);
              o.setOrder(d);
            },
          );
      }
    };
    return t;
  })(tG),
  oG = (function (e) {
    function t(t, n, i) {
      if (undefined === i) {
        i = false;
      }
      var r = e.call(this, t) || this,
        name = Xz(n).name,
        a = r.containerEl.createDiv("bases-toolbar-menu-container-header"),
        s = a.createDiv("back-button");
      setIcon(s.createDiv("back-icon"), "lucide-chevron-left");
      s.createDiv({
        text: i
          ? nG.labelEditProperty()
          : nG.titleEditProperty({
              name: name,
            }),
        cls: "back-label",
      });
      s.addEventListener("click", function () {
        return r.controller.back();
      });
      var l = a.createDiv("clickable-icon");
      setIcon(l, "lucide-more-vertical");
      var c = a.createDiv("close-icon clickable-icon");
      setIcon(c, "lucide-x");
      c.addEventListener("click", function () {
        return r.controller.close();
      });
      r.scope.register([], "Escape", function (e) {
        r.controller.back();
      });
      var u = new aG(t.queryController, n, i).onDelete(function () {
        return r.controller.back();
      });
      l.addEventListener("click", function (e) {
        return u.showActions(e, l);
      });
      r.containerEl.append(u.containerEl);
      return r;
    }
    __extends(t, e);
    return t;
  })(tG),
  aG = (function () {
    function e(queryController, propId, isNewProperty) {
      var i;
      this.queryController = queryController;
      this.propId = propId;
      this.isNewProperty = isNewProperty;
      var r = queryController.app,
        o = queryController.query,
        a = queryController.getViewConfig(),
        s = Xz(propId),
        l = s.type,
        value = s.name,
        u = (this.containerEl = createDiv("bases-toolbar-menu-form"));
      if (
        (u.createDiv("input-row", function (e) {
          if (!isNewProperty) {
            e.createDiv({
              cls: "input-row-label",
              text: nG.labelDisplayName(),
            });
          }
          var i = new TextComponent(e.createDiv("input-row-content"))
            .setPlaceholder(value)
            .setValue(a.getDisplayName(propId))
            .autoSelect().inputEl;
          i.addEventListener("blur", function (e) {
            var s,
              u = i.value.trim();
            if (u !== a.getDisplayName(propId))
              if (isNewProperty) {
                if (l === "formula") {
                  var h = (s = o.formulas) !== null && undefined !== s ? s : {},
                    p = h[value];
                  delete h[value];
                  h[u] = p;
                  o.setFormulas(h);
                } else if (l === "note") {
                  r.fileManager.renameProperty(value, u);
                }
                var d = Qz(l, u);
                a.setOrder(
                  a.getOrder().map(function (e) {
                    return e === propId ? d : e;
                  }),
                );
                value = u;
              } else a.getPropertyConfig(propId).setDisplayName(u);
          });
          i.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.defaultPrevented)) {
              e.key === "Escape"
                ? (e.preventDefault(), (i.value = value), i.blur())
                : e.key === "Enter" && (e.preventDefault(), i.blur());
            }
          });
        }),
        l === "note")
      ) {
        var h = r.metadataTypeManager.registeredTypeWidgets,
          p = r.metadataTypeManager.getTypeInfo(value).inferred,
          d = Object.fromEntries(
            Object.entries(h)
              .filter(function (e) {
                e[0];
                var t,
                  n = e[1];
                return (
                  !n.reservedKeys || ((t = n.reservedKeys) === null || undefined === t ? undefined : t.contains(p.type))
                );
              })
              .map(function (e) {
                return [e[0], e[1].name()];
              }),
          );
        (f = u.createDiv("input-row")).createDiv({
          cls: "input-row-label",
          text: nG.labelPropertyType(),
        });
        new DropdownComponent(f.createDiv("input-row-content"))
          .addOptions(d)
          .setValue(p.type)
          .onChange(function (e) {
            r.metadataTypeManager.setType(value, e);
          });
      } else if (l === "formula") {
        var f,
          m = (i = o.formulas) !== null && undefined !== i ? i : {},
          g = Object.hasOwn(m, value) ? m[value] : null;
        (f = u.createDiv("input-row")).createDiv("input-row-label", function (e) {
          e.setText(nG.labelFormula());
          var t = e.createDiv("clickable-icon help-icon");
          setIcon(t, "lucide-help-circle");
          t.addEventListener("click", function (e) {
            window.open("https://help.obsidian.md/bases/functions", "_blank");
          });
        });
        var v = f.createDiv("input-row-content").createDiv("formula-editor-container"),
          y = f.createDiv("input-row-status"),
          b = y.createDiv("status-icon"),
          w = y.createSpan(),
          C = function (e) {
            var t = e && e.formula instanceof Nz;
            y.toggleClass("mod-error", t);
            y.toggleClass("mod-empty", e && e.toString() === "");
            setIcon(b, t ? "lucide-x-circle" : "lucide-circle-check");
            w.setText(t ? "Invalid formula" : "Valid formula");
            var n = "";
            e && e.formula instanceof Nz && (n = e.formula.getErrorMessage());
            setTooltip(y, n);
          };
        C(g);
        var E = function () {
            var valuee0 = new Dz(M.state.doc.toString());
            m[value] = valuee0;
            o.setFormulas(m);
            C(valuee0);
          },
          S = debounce(E, 250),
          M = new EditorView({
            doc: (g == null ? undefined : g.toString()) || "",
            parent: v.createDiv("formula-editor"),
            extensions: __spreadArray(
              __spreadArray([], bU(), !0),
              [
                placeholder(i18nProxy.plugins.bases.placeholderFormula()),
                queryController.getEditorLanguageSupport(),
                EditorView.domEventHandlers({
                  blur: function () {
                    S.cancel();
                    E();
                  },
                }),
                EditorView.updateListener.of(function (e) {
                  if (e.docChanged) {
                    S();
                  }
                }),
              ],
              !1,
            ),
          });
      }
    }
    e.prototype.showActions = function (e, t) {
      var n = this;
      if (!t || !t.hasClass("has-active-menu")) {
        var i = this.queryController.query,
          r = this.propId,
          o = Xz(r),
          a = o.type,
          s = o.name,
          l = this.queryController.getViewConfig(),
          c = l.getOrder().contains(r),
          u = Menu.forEvent(e);
        u.addSections(["action", "", "danger"]);
        t && u.setParentElement(t);
        u.addItem(function (e) {
          return e
            .setTitle(c ? nG.labelHideProperty() : nG.labelShowProperty())
            .setSection("action")
            .setIcon("lucide-eye-off")
            .onClick(function () {
              var e = l.getOrder();
              e.contains(r) ? e.remove(r) : e.push(r);
              l.setOrder(e);
            });
        });
        a === "formula" &&
          u.addItem(function (e) {
            return e
              .setTitle(nG.actionDeleteFormula())
              .setSection("danger")
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                var e,
                  t = l.getOrder(),
                  o = t.indexOf(r);
                -1 !== o && (t.splice(o, 1), l.setOrder(t));
                l.getPropertyConfig(r).setDisplayName(null);
                delete i.formulas[s];
                i.setFormulas(i.formulas);
                (e = n.handleDelete) === null || undefined === e || e.call(n);
              });
          });
        u.showAtMouseEvent(e);
      }
    };
    e.prototype.onDelete = function (handleDelete) {
      this.handleDelete = handleDelete;
      return this;
    };
    return e;
  })();
function sG(e) {
  return e.replace(/\|/g, "\\|");
}
var lG = (function () {
  function e(header, body) {
    this.header = header;
    this.body = body;
  }
  e.prototype.toCSV = function () {
    return this.toText(",");
  };
  e.prototype.toTSV = function () {
    return this.toText("\t");
  };
  e.prototype.toText = function (e) {
    var t = this.header,
      n = this.body,
      i = new RegExp('["\n\r'.concat(e, "]")),
      r = function (e) {
        return i.test(e) ? '"'.concat(e.replace(/"/g, '""'), '"') : e;
      },
      o = [];
    o.push(t.map(r).join(e));
    for (var a = 0, s = n; a < s.length; a++) {
      var l = s[a];
      o.push(l.map(r).join(e));
    }
    return o.join("\n");
  };
  e.prototype.toMarkdown = function () {
    var e = this.header,
      t = this.body,
      n = [];
    e = e.map(sG);
    t = t.map(function (e) {
      return e.map(sG);
    });
    for (
      var i = e.map(function (e) {
          return e.length;
        }),
        r = 0,
        o = t;
      r < o.length;
      r++
    )
      for (var a = o[r], s = 0; s < a.length; s++) {
        if ((h = a[s]).length > i[s]) {
          i[s] = h.length;
        }
      }
    for (s = 0; s < i.length; s++) i[s] += 2;
    for (var l = 0, c = [e].concat(t); l < c.length; l++) {
      a = c[l];
      var u = "|";
      for (s = 0; s < a.length; s++) {
        var h = a[s],
          p = i[s] - h.length,
          d = Math.floor(p / 2),
          f = p - d;
        u += " ".repeat(d) + h + " ".repeat(f) + "|";
      }
      if ((n.push(u), a === e)) {
        var m = "|";
        for (s = 0; s < a.length; s++) m += " " + "-".repeat(i[s] - 2) + " |";
        n.push(m);
      }
    }
    return n.join("\n");
  };
  e.prototype.toObsidianTableClipboard = function () {
    var e = this.header,
      t = this.body,
      rows = [e].concat(t);
    return JSON.stringify({
      rows: rows,
      alignment: Array(e.length).fill(null),
    });
  };
  return e;
})();
var cG = i18nProxy.plugins.bases,
  uG = (function () {
    function e(app, t) {
      var n = this;
      this.resultCount = 0;
      this.app = app;
      (this.toolbarItem = new EU(
        app,
        t,
        i18nProxy.nouns.resultWithCount({
          count: 0,
        }),
        "lucide-list-filter",
      ).onOpen(function () {
        return n.display();
      })).containerEl.addClass("bases-toolbar-result-count");
    }
    e.prototype.display = function () {
      var e = this,
        t = this,
        n = t.view,
        i = t.viewConfig,
        r = t.toolbarItem.scrollEl;
      r.empty();
      var o = r.createDiv("bases-toolbar-menu-form").createDiv("input-row");
      o.createDiv({
        cls: "input-row-label",
        text: cG.labelLimit(),
      });
      var a = i.getLimit(),
        s = new _T(o.createDiv("input-row-content"))
          .setValue(a !== 0 ? String(a) : "")
          .setPlaceholder(cG.placeholderLimit())
          .setLimits(1, null, 1)
          .onChange(function (e) {
            if ((s.inputEl.removeClass("mod-error"), e === "")) i.setLimit(0);
            else {
              var t = parseInt(e);
              !isNaN(t) && t >= 0 ? i.setLimit(t) : s.inputEl.addClass("mod-error");
            }
            h();
          });
      s.inputEl.addEventListener("keydown", function (t) {
        if (!t.isComposing) {
          t.key === "Enter" && (t.preventDefault(), e.toolbarItem.setOpen(!1));
        }
      });
      var l = r.createDiv("action-row bases-toolbar-menu-item");
      l.addEventListener("click", function (t) {
        t.preventDefault();
        i.setLimit(0);
        e.toolbarItem.setOpen(!1);
      });
      var c = l.createDiv("bases-toolbar-menu-item-info");
      setIcon(c.createDiv("bases-toolbar-menu-item-info-icon"), "lucide-rotate-ccw");
      var u = c.createDiv({
          cls: "bases-toolbar-menu-item-name",
          text: cG.buttonShowAll(),
        }),
        h = function () {
          var t = i.getLimit();
          u.setText(
            t === 0
              ? cG.buttonShowAll()
              : cG.buttonShowAllCount({
                  count: e.resultCount,
                }),
          );
          l.toggleClass("mod-hidden", t === 0);
        };
      h();
      var p = [
        {
          name: i18nProxy.interface.labelCopy(),
          icon: "lucide-copy",
          callback: function () {
            return n.copyToClipboard();
          },
        },
        {
          name: cG.actionExportCSV(),
          icon: "lucide-file-down",
          callback: function () {
            var e, download, r, href, a;
            e = n.exportTable().toCSV();
            download = i.getViewName() + ".csv";
            r = new Blob([e], {
              type: "text/plain",
            });
            href = URL.createObjectURL(r);
            (a = createEl("a", {
              attr: {
                href: href,
                download: download,
              },
            })).style.display = "none";
            a.click();
            a.detach();
            URL.revokeObjectURL(href);
          },
        },
      ];
      p.push.apply(p, this.view.getViewActions());
      for (
        var d = function (t) {
            var n = r.createDiv("action-row bases-toolbar-menu-item");
            n.addEventListener("click", function (n) {
              n.preventDefault();
              e.toolbarItem.setOpen(!1);
              t.callback();
            });
            var i = n.createDiv("bases-toolbar-menu-item-info");
            if (t.icon) {
              setIcon(i.createDiv("bases-toolbar-menu-item-info-icon"), t.icon);
            }
            var texto0 = t.name;
            t.getName && (texto0 = t.getName());
            i.createDiv({
              cls: "bases-toolbar-menu-item-name",
              text: texto0,
            });
            n.toggleClass("mod-destructive", t.destructive);
          },
          f = 0,
          m = p;
        f < m.length;
        f++
      ) {
        d(m[f]);
      }
    };
    e.prototype.updateQuery = function (view, viewConfig, resultCount) {
      this.view = view;
      this.viewConfig = viewConfig;
      this.resultCount = resultCount;
      var count = resultCount,
        r = viewConfig.getLimit(),
        o = false;
      r && count > r && ((count = r), (o = true));
      this.toolbarItem.setButtonText(
        i18nProxy.nouns.resultWithCount({
          count: count,
        }),
      );
      this.toolbarItem.buttonEl.toggleClass("is-active", o);
    };
    e.prototype.setEnabled = function (e) {
      this.toolbarItem.setEnabled(e);
    };
    return e;
  })();
function hG(e) {
  if (!e || typeof e != "string") return null;
  var t = true,
    n = e.split(".").map(function (e) {
      var n = parseInt(e);
      isNaN(n) && (t = false);
      return n;
    });
  return t ? n : null;
}
function pG(e, t) {
  var n = hG(e),
    i = hG(t);
  return (
    !!i &&
    (!n ||
      (function (e, t) {
        for (var n = Math.min(e.length, t.length), i = 0; i < n; i++) {
          if (e[i] < t[i]) return !0;
          if (e[i] > t[i]) return !1;
        }
        return e.length < t.length || (e.length, t.length, !1);
      })(n, i))
  );
}
function dG(e, t, n, i, r) {
  for (var o = 0; o < t.length; o++) {
    for (var a = t[o], s = -1, l = o; l < e.length; l++)
      if (n(e[l], a)) {
        s = l;
        break;
      }
    if (-1 !== s) {
      if (o !== s) {
        var c = e[o];
        e[o] = e[s];
        e[s] = c;
      }
    } else e.splice(o, 0, i(a));
    if (r) {
      r(e[o], a);
    }
  }
  e.length = t.length;
}
function fG(e) {
  if (isContentEditable(e)) return !0;
  if (e.instanceOf(Element)) {
    if (e.closest(".metadata-container")) return !0;
    if (e.closest(".inline-title")) return !0;
  }
  return !1;
}
var mG = i18nProxy.plugins.bases,
  gG = (function (e) {
    function t(app, n) {
      var i = e.call(this) || this;
      i.app = app;
      var r = (i.toolbarItem = new EU(app, n, mG.labelSort(), "lucide-arrow-up-down"));
      r.onOpen(function () {
        return i.onOpen();
      });
      i.flairEl = r.buttonEl.createSpan({
        cls: "flair toolbar-badge",
      });
      i.flairEl.hide();
      i.currentSort = [];
      var o = r.scrollEl.createDiv("bases-sort-container");
      i.sortRowsContainerEl = o.createDiv("bases-toolbar-items bases-sort-items");
      o.createDiv(
        {
          cls: "text-icon-button",
        },
        function (e) {
          e.createSpan("text-button-icon", function (e) {
            return setIcon(e, "plus");
          });
          e.createSpan({
            cls: "text-button-label",
            text: mG.labelAddSort(),
          });
          e.addEventListener("click", function () {
            return i.addSortRow().focus();
          });
          e.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.defaultPrevented || (e.key !== " " && e.key !== "Enter"))) {
              i.addSortRow().focus();
            }
          });
        },
      );
      return i;
    }
    __extends(t, e);
    t.prototype.updateQuery = function (queryController, query, viewConfig) {
      var i, r;
      this.queryController = queryController;
      this.query = query;
      this.viewConfig = viewConfig;
      this.display();
      var o = this.flairEl,
        a =
          (r =
            (i = viewConfig == null ? undefined : viewConfig.getSort()) === null || undefined === i
              ? undefined
              : i.length) !== null && undefined !== r
            ? r
            : 0;
      o.setText(String(a));
      o.toggle(a > 0);
      this.toolbarItem.buttonEl.toggleClass("is-active", a > 0);
    };
    t.prototype.onOpen = function () {
      this.display();
    };
    t.prototype.display = function () {
      var e = this;
      dG(
        this.currentSort,
        this.loadSort(),
        function (e, t) {
          return e.config.property === t.property && e.config.direction === t.direction;
        },
        function (t) {
          var n = new vG(e, t);
          n.render(e.sortRowsContainerEl);
          return n;
        },
      );
      this.sortRowsContainerEl.setChildrenInPlace(
        this.currentSort.map(function (e) {
          return e.rowEl;
        }),
      );
      this.currentSort.length === 0 && this.addSortRow();
    };
    t.prototype.addSortRow = function () {
      var e = new vG(this);
      this.currentSort.push(e);
      e.render(this.sortRowsContainerEl);
      return e;
    };
    t.prototype.removeSortRow = function (e) {
      this.currentSort.remove(e);
      this.saveSort();
    };
    t.prototype.moveSortRow = function (e, t) {
      var n = this.currentSort.indexOf(e);
      if (-1 !== t && t !== n) {
        nc(this.currentSort, n, t);
        this.saveSort();
      }
    };
    t.prototype.loadSort = function () {
      return this.viewConfig ? this.viewConfig.getSort() : [];
    };
    t.prototype.saveSort = function () {
      if (this.viewConfig) {
        for (var sort = [], t = 0, n = this.currentSort; t < n.length; t++) {
          var i = n[t].config;
          if (i.property) {
            sort.push({
              property: i.property,
              direction: i.direction,
            });
          }
        }
        this.viewConfig.sort = sort;
        this.query.save();
      }
    };
    return t;
  })(Component),
  vG = (function () {
    function e(parent, t) {
      this.parent = parent;
      this.config = t || {
        property: "",
        direction: "ASC",
      };
    }
    e.prototype.render = function (e) {
      var t = this,
        n = this.config,
        i = this.parent,
        r = i.app,
        o = i.queryController,
        a = (this.rowEl = e.createDiv("base-toolbar-sort-item")),
        s = a.createDiv("grip-handle");
      setIcon(s, "grip-vertical");
      Vc(
        s,
        a,
        e,
        10,
        function () {},
        function (e) {
          i.moveSortRow(t, e);
        },
      );
      var l,
        c = (this.wrapperEl = a.createDiv("metadata-property bases-sort-property-container"));
      this.propertyCombobox = new CU(o, c)
        .filterProperties(function (e) {
          return e !== "file.file" && e !== "file.backlinks";
        })
        .setValueById(n.property)
        .setPlaceholder(mG.labelPropertyKey())
        .onSelect(function (e) {
          n.property !== e.value && ((n.property = e.value), t.configureSortRow(), i.saveSort());
          l.focus();
        });
      this.propertyCombobox.buttonEl.addClass("bases-sort-property");
      (l = this.sortDirectionCombobox =
        new XT(r, c).onSelect(function (e) {
          if (e.value !== n.direction) {
            n.direction = e.value;
            i.saveSort();
          }
        })).buttonEl.addClass("bases-sort-direction");
      var u = a.createDiv("clickable-icon");
      setIcon(u, "lucide-trash-2");
      u.addEventListener("click", function () {
        t.parent.removeSortRow(t);
      });
      this.configureSortRow();
    };
    e.prototype.configureSortRow = function () {
      var e = this,
        t = e.config,
        n = e.parent,
        i = e.sortDirectionCombobox,
        r = n.queryController,
        o = {
          ASC: mG.labelSortAZ(),
          DESC: mG.labelSortZA(),
        },
        a = r.getWidgetForIdent(yU(t.property));
      a === "date" || a == "datetime"
        ? (o = {
            ASC: mG.labelSortOldNew(),
            DESC: mG.labelSortNewOld(),
          })
        : a === "number" &&
          (o = {
            ASC: mG.labelSort01(),
            DESC: mG.labelSort10(),
          });
      var s = (function () {
          if (t.property === "") return !1;
          var e = Xz(t.property),
            i = e.type,
            r = e.name;
          return i === "formula" && !Object.hasOwn(n.query.formulas, r);
        })(),
        l = this.propertyCombobox.iconEl;
      this.wrapperEl.toggleClass("mod-error", s);
      setTooltip(l, s ? mG.msgErrorInvalidProperty() : "");
      s && setIcon(l, "lucide-alert-triangle");
      i.setItems([
        {
          value: "ASC",
          display: o.ASC,
        },
        {
          value: "DESC",
          display: o.DESC,
        },
      ]);
      i.setValueById(t.direction);
    };
    e.prototype.focus = function () {
      this.propertyCombobox.focus();
    };
    return e;
  })(),
  yG = i18nProxy.plugins.bases,
  bG = ["#", ":", "|", "^", "%%", "[[", "]]"].join(" "),
  wG = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.searchComponent = new SearchComponent(n.containerEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(function () {
          return n.renderViews();
        });
      var i = n.containerEl.createDiv("bases-toolbar-items");
      n.chooser = new Px(n, i, n.scope);
      n.scope.register([], "ArrowRight", function () {
        var e,
          t = n.chooser.selectedItem,
          i = n.chooser.values[t];
        if (i) {
          (e = n.handleNext) === null || undefined === e || e.call(n, i.config);
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onSelect = function (handleSelect) {
      this.handleSelect = handleSelect;
      return this;
    };
    t.prototype.onNext = function (handleNext) {
      this.handleNext = handleNext;
      return this;
    };
    t.prototype.onShow = function () {
      this.searchComponent.autoSelect();
      this.renderViews();
    };
    t.prototype.selectSuggestion = function (e, t) {
      var n,
        i = e.config;
      i ? (n = this.handleSelect) === null || undefined === n || n.call(this, i) : this.addView();
    };
    t.prototype.renderViews = function () {
      for (
        var e = prepareQuery(this.searchComponent.inputEl.value), t = [], n = 0, i = this.controller.query.views;
        n < i.length;
        n++
      ) {
        var config = i[n];
        if (fuzzySearch(e, config.name)) {
          t.push({
            config: config,
            group: "views",
          });
        }
      }
      t.push({
        config: null,
        group: "actions",
      });
      this.chooser.setSuggestions(t);
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n = this,
        i = e.config;
      t.addClass("bases-toolbar-menu-item");
      var r = t.createDiv("bases-toolbar-menu-item-info"),
        o = r.createDiv("bases-toolbar-menu-item-info-icon");
      if (i === null) {
        setIcon(o, "lucide-plus");
        r.createDiv({
          cls: "bases-toolbar-menu-item-name",
          text: yG.buttonAddView(),
        });
      } else {
        var a = this.controller.queryController.plugin.getRegistration(i.type);
        setIcon(o, (a && a.icon) || "lucide-table");
        r.createDiv({
          cls: "bases-toolbar-menu-item-name",
          text: i.name,
        });
        t.toggleClass("mod-active", this.controller.queryController.viewName === i.name);
        var s = t.createDiv("clickable-icon bases-toolbar-menu-item-icon");
        setIcon(s, "lucide-chevron-right");
        s.addEventListener("click", function (e) {
          var t;
          e.preventDefault();
          n.chooser.getSelectedValue() && ((t = n.handleNext) === null || undefined === t || t.call(n, i));
        });
        Vc(
          o,
          t,
          t.parentElement,
          10,
          function () {},
          function (e) {
            var t = n.controller.query,
              r = t.views.indexOf(i);
            nc(t.views, r, e);
            t.save();
          },
        );
      }
    };
    t.prototype.addView = function () {
      var e = this.controller.query,
        t = this.searchComponent.inputEl.value.trim() || yG.labelDefaultView(),
        n = vU(
          new Set(
            this.controller.query.views.map(function (e) {
              return e.name;
            }),
          ),
          t,
        ),
        i = new mq(e, "table", n);
      this.controller.show(new CG(this.controller, i, !0));
    };
    return t;
  })(tG),
  kG = (function (e) {
    function t(app, queryController, i) {
      var r = e.call(this) || this;
      r.query = null;
      r.pageStack = [];
      r.app = app;
      r.queryController = queryController;
      var o = (r.toolbarItem = new EU(app, i, "", "lucide-table")
        .onOpen(function () {
          return r.onOpen();
        })
        .onClose(function () {
          return r.onClose();
        }));
      o.addClass("mod-views");
      o.buttonEl.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var t = queryController.getViewConfig();
        if (t) {
          r.toolbarItem.setOpen(!0);
          r.show(new CG(r, t, !1));
        }
      });
      setIcon(
        o.buttonEl.createSpan({
          cls: "text-button-icon mod-aux",
        }),
        "lucide-chevrons-up-down",
      );
      return r;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "scope", {
      get: function () {
        return this.toolbarItem.scope;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.onOpen = function () {
      var e = this;
      this.show(
        new wG(this)
          .onSelect(function (t) {
            e.queryController.selectView(t.name);
            e.toolbarItem.setOpen(!1);
          })
          .onNext(function (t) {
            return e.show(new CG(e, t, !1));
          }),
      );
    };
    t.prototype.onClose = function () {
      var e;
      for (this.toolbarItem.scrollEl.empty(); (e = this.pageStack.pop()); ) this.app.keymap.popScope(e.scope);
    };
    t.prototype.show = function (e) {
      this.toolbarItem.scrollEl.setChildrenInPlace([e.containerEl]);
      e.onShow();
      this.pageStack.push(e);
      this.app.keymap.pushScope(e.scope);
    };
    t.prototype.setView = function (e, t) {
      this.toolbarItem.setButtonText(e);
      this.toolbarItem.setButtonIcon(t);
    };
    t.prototype.promptForAddView = function () {
      this.toolbarItem.setOpen(!0);
      for (var e = this.pageStack.last(); e && !(e instanceof wG); ) {
        this.back();
        e = this.pageStack.last();
      }
      if (e instanceof wG) {
        e.addView();
      }
    };
    t.prototype.close = function () {
      this.toolbarItem.setOpen(!1);
    };
    t.prototype.back = function () {
      var e = this.pageStack.pop();
      if (e) {
        this.app.keymap.popScope(e.scope);
      }
      var t = this.pageStack.last();
      if (t) {
        this.toolbarItem.scrollEl.setChildrenInPlace([t.containerEl]);
        t.onShow();
      }
    };
    t.prototype.updateQuery = function (query, t) {
      this.query = query;
    };
    return t;
  })(Component),
  CG = (function (e) {
    function t(t, view, i) {
      var r = e.call(this, t) || this;
      r.view = view;
      var o = r.containerEl.createDiv("bases-toolbar-menu-container-header"),
        a = o.createDiv("back-button");
      setIcon(a.createDiv("back-icon"), "lucide-chevron-left");
      a.createDiv({
        text: yG.labelConfigureView(),
        cls: "back-label",
      });
      a.addEventListener("click", function () {
        return r.controller.back();
      });
      var s = o.createDiv("clickable-icon");
      setIcon(s, "lucide-more-vertical");
      s.addEventListener("click", function (e) {
        return r.showActions(e, s);
      });
      var l = o.createDiv("close-icon clickable-icon");
      setIcon(l, "lucide-x");
      l.addEventListener("click", function () {
        return r.controller.close();
      });
      r.scope.register([], "Escape", function (e) {
        if (!(e.defaultPrevented || isContentEditable(r.containerEl.doc.activeElement))) {
          r.controller.back();
        }
      });
      r.formEl = r.containerEl.createDiv("bases-toolbar-menu-form");
      r.display(view, i);
      return r;
    }
    __extends(t, e);
    t.prototype.display = function (e, t) {
      var n = this;
      if (undefined === t) {
        t = false;
      }
      var i = this.controller,
        r = i.app,
        o = i.query,
        a = i.queryController,
        s = this.formEl,
        name = e.name,
        c = "";
      s.empty();
      var u,
        h = s.createDiv("input-row"),
        p = new TextComponent(h.createDiv("input-row-content"))
          .setPlaceholder(yG.labelViewName())
          .setValue(e.name)
          .onChange(function (e) {
            name = e.trim();
            c = (function () {
              if (name.trim() === "") return yG.msgEmptyViewName();
              if (HEADING_LINK_STRIP_REGEX.test(name)) return yG.msgInvalidViewName() + bG;
              for (var e = 0, t = o.views; e < t.length; e++) {
                if (t[e].name === name) return yG.msgDuplicateViewName();
              }
              return "";
            })();
            c
              ? displayTooltip(u, c, {
                  classes: ["mod-error"],
                })
              : hideTooltip();
          })
          .autoSelect();
      (u = p.inputEl).addEventListener("keydown", function (t) {
        if (!(t.isComposing || t.defaultPrevented)) {
          t.key === "Escape"
            ? (t.preventDefault(), (u.value = name = e.name), u.blur())
            : t.key === "Enter" && (t.preventDefault(), c || u.blur());
        }
      });
      u.addEventListener("blur", function () {
        if (t || e.name !== name) {
          c || ((e.name = name), t && (o.views.push(e), (t = false)), a.selectView(name), o.save());
        }
      });
      var d = [],
        f = r.internalPlugins.getEnabledPluginById("bases");
      if (f)
        for (var m = f.getRegistrations(), g = 0, v = Object.keys(m); g < v.length; g++) {
          var value = v[g],
            b = m[value];
          d.push({
            value: value,
            display: b.name,
            icon: b.icon,
          });
        }
      var w = s.createDiv("input-row");
      w.createDiv({
        cls: "input-row-label",
        text: yG.labelViewLayout(),
      });
      new XT(r, w.createDiv("input-row-content"))
        .setItems(d)
        .setValueById(e.type)
        .onSelect(function (t) {
          e.type = t.value;
          n.display(e);
          o.save();
        });
      var k = a.plugin.getRegistration(e.type);
      if (k == null ? undefined : k.options)
        for (
          var C = k.options(e, a),
            E = function (e) {
              if (!e.component) return "continue";
              var t = S.formEl.createDiv("input-row");
              t.createDiv("input-row-label", function (t) {
                t.setText(e.displayName);
              });
              e.component(t.createDiv("input-row-content"));
            },
            S = this,
            M = 0,
            x = C;
          M < x.length;
          M++
        ) {
          E(x[M]);
        }
    };
    t.prototype.showActions = function (e, n) {
      var i = this;
      if (!n || !n.hasClass("has-active-menu")) {
        var r = this.view,
          o = this.controller,
          a = o.query,
          s = Menu.forEvent(e);
        s.addSections(["action", "", "danger"]);
        n && s.setParentElement(n);
        s.addItem(function (e) {
          return e
            .setTitle(yG.actionDuplicateView())
            .setIcon("lucide-files")
            .setSection("action")
            .onClick(function () {
              o.back();
              var e = vU(
                  new Set(
                    a.views.map(function (e) {
                      return e.name;
                    }),
                  ),
                  r.name,
                ),
                n = r.clone(e);
              o.show(new t(i.controller, n, !0));
              a.save();
            });
        }).addItem(function (e) {
          return e
            .setTitle(yG.actionDeleteView())
            .setIcon("lucide-trash-2")
            .setSection("danger")
            .setWarning(!0)
            .onClick(function () {
              var e = i.controller,
                t = e.query,
                n = e.queryController,
                o = t.views.indexOf(r);
              t.views.remove(r);
              var a = t.views[Math.clamp(o - 1, 0, t.views.length)];
              n.selectView(a.name);
              i.controller.back();
              t.save();
            });
        });
      }
    };
    return t;
  })(tG),
  EG = (function () {
    function e(app, config, allProperties, data) {
      this.allProperties = [];
      this.app = app;
      this.config = config;
      this.allProperties = allProperties;
      this.applySort(data);
      this.applyLimit(data);
      this.data = data;
    }
    Object.defineProperty(e.prototype, "groupedData", {
      get: function () {
        if (this.groupedDataCache) return this.groupedDataCache;
        var e = this.config,
          t = this.data,
          n = e.groupBy;
        if (!n) {
          this.groupedDataCache = [
            {
              entries: this.data,
            },
          ];
          return this.groupedDataCache;
        }
        for (var i = {}, r = 0, o = t; r < o.length; r++) {
          var a = o[r],
            s = String(a.getValue(n));
          i[s] || (i[s] = []);
          i[s].push(a);
        }
        var groupedDataCache = [];
        for (var c in i) {
          var entries = i[c];
          groupedDataCache.push({
            key: c,
            entries: entries,
          });
        }
        this.groupedDataCache = groupedDataCache;
        return this.groupedDataCache;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(e.prototype, "properties", {
      get: function () {
        var e = this,
          t = e.app,
          n = e.config,
          i = e.allProperties,
          r = e.propertiesCache;
        if (n && i) {
          if (r) return r;
          for (var o = n.getOrder(), a = new Set(i), propertiesCache = [], l = 0, c = o; l < c.length; l++) {
            var u = c[l];
            if (a.has(u)) propertiesCache.push(u);
            else {
              var h = Xz(u),
                p = h.type,
                d = h.name;
              if (p === "note") {
                var f = t.metadataTypeManager.getPropertyInfo(d);
                propertiesCache.push(Qz("note", f.name));
              }
            }
          }
          this.propertiesCache = propertiesCache;
          return propertiesCache;
        }
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.applySort = function (e) {
      if (e) {
        var t = this.config,
          n = this.allProperties;
        if (t && n) {
          var i = new Set(n),
            r = t.getSort().filter(function (e) {
              return i.has(e.property);
            });
          if (r.length === 0) {
            r = dq.slice();
          }
          var o = function (e, t, n) {
            if (e >= r.length) return 0;
            var i,
              a,
              s = r[e],
              l = s.property,
              c = s.direction;
            try {
              i = t.getValue(l);
              a = n.getValue(l);
            } catch (e) {
              return 0;
            }
            var u = 0;
            if (i instanceof EH && a instanceof EH) u = 0;
            else {
              if (i instanceof EH) return 1;
              if (a instanceof EH) return -1;
              if (i instanceof TH && a instanceof TH) u = i.data - a.data;
              else if (i instanceof NH && a instanceof NH) u = i.date.getTime() - a.date.getTime();
              else if (i instanceof BH && a instanceof BH) u = i.getMilliseconds() - a.getMilliseconds();
              else {
                var h = i.toString(),
                  p = a.toString();
                (i instanceof qH || i instanceof zH) && i.display && (h = i.display.toString());
                (a instanceof qH || a instanceof zH) && a.display && (p = a.display.toString());
                u = Eb(h, p);
              }
            }
            return u === 0 ? o(e + 1, t, n) : c === "ASC" ? u : -u;
          };
          e.sort(function (e, t) {
            return o(0, e, t);
          });
        }
      }
    };
    e.prototype.applyLimit = function (e) {
      var t = this.config.getLimit();
      if (t > 0 && e.length > t) {
        e.splice(t, e.length - t);
      }
    };
    return e;
  })(),
  BasesView = (function (e) {
    function t(queryController) {
      var n = e.call(this) || this;
      n.allProperties = [];
      n.app = queryController.app;
      n.queryController = queryController;
      return n;
    }
    __extends(t, e);
    t.prototype.getViewActions = function () {
      return [];
    };
    t.prototype.onResize = function () {};
    t.prototype.setEphemeralState = function (e) {};
    t.prototype.getEphemeralState = function () {
      return {};
    };
    t.prototype.exportTable = function () {
      var e = this.data,
        t = this.config,
        n = e.properties.map(function (e) {
          return t.getDisplayName(e);
        }),
        i = e.data.map(function (t) {
          return e.properties.map(function (e) {
            try {
              var n = t.getValue(e);
              return n == null || n === EH.value ? "" : n.toString();
            } catch (e) {
              return "";
            }
          });
        });
      return new lG(n, i);
    };
    t.prototype.copyToClipboard = function () {
      var e = this.exportTable(),
        textPlain = e.toTSV(),
        textMarkdown = e.toMarkdown(),
        i = (function (e) {
          var t = activeDocument.createElement("textarea");
          t.value = e["text/plain"] || Object.values(e)[0];
          t.style.top = "0";
          t.style.left = "0";
          t.style.position = "fixed";
          t.style.opacity = "0";
          activeDocument.body.appendChild(t);
          var n = false;
          try {
            activeDocument.addEventListener(
              "copy",
              function (t) {
                var n;
                t.preventDefault();
                for (var i = 0, r = Object.keys(e); i < r.length; i++) {
                  var o = r[i];
                  if (!((n = t.clipboardData) === null || undefined === n)) {
                    n.setData(o, e[o]);
                  }
                }
              },
              {
                once: !0,
              },
            );
            t.focus({
              preventScroll: !0,
            });
            t.select();
            n = activeDocument.execCommand("copy");
          } catch (e) {
            console.error("Copy failed:", e);
          }
          t.detach();
          return n;
        })({
          "text/plain": textPlain,
          "text/markdown": textMarkdown,
          "text/html": renderMarkdown(parseMetadata(textMarkdown)),
          "obsidian/table": e.toObsidianTableClipboard(),
        }),
        r = i
          ? i18nProxy.interface.copied({
              context: "generic",
            })
          : i18nProxy.interface.copy_failed();
      new Notice(r);
    };
    t.prototype.createRenderer = function (e, t) {
      return e === "file.name" ? new TG(this, e, t) : Xz(e).type === "note" ? new xG(this, e, t) : new DG(this, e, t);
    };
    return t;
  })(Component),
  MG = function (view, prop, n) {
    this.view = view;
    this.prop = prop;
    this.el = n;
  },
  xG = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.propertyEditor = null;
      r.inferredType = null;
      r.el.addClass("bases-metadata-value", "metadata-property-value");
      return r;
    }
    __extends(t, e);
    t.prototype.render = function (entry) {
      var t = this,
        n = this,
        i = n.view,
        r = n.el,
        o = n.prop,
        a = n.val,
        s = Xz(o).name,
        l = i.app,
        c = entry.getRawProperty(s),
        val = JSON.stringify(c);
      if (((this.entry = entry), (this.val = val), entry.file.extension !== "md")) {
        this.propertyEditor = null;
        r.empty();
        return void r.setAttr("disabled", !0);
      }
      r.setAttr("disabled", null);
      var inferredType = l.metadataTypeManager.getTypeInfo(s, c).inferred;
      if (!(this.propertyEditor && inferredType === this.inferredType && a === val)) {
        r.empty();
        this.inferredType = inferredType;
        this.propertyEditor = inferredType.render(r, c, {
          app: l,
          blur: function () {
            clearFocusAndSelection();
            r.scrollLeft = 0;
          },
          key: s,
          hoverSource: "bases",
          onChange: function (e) {
            var valn0 = JSON.stringify(e);
            valn0 !== t.val && ((t.val = valn0), t.entry.updateProperty(s, e));
          },
          sourcePath: entry.file.path,
        });
      }
    };
    return t;
  })(MG),
  TG = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.el.addClass("bases-rendered-value");
      return r;
    }
    __extends(t, e);
    t.prototype.render = function (entry) {
      var t = this,
        n = t.view,
        i = t.el,
        r = t.entry,
        o = t.filepath;
      this.entry = entry;
      this.filepath = entry.file.path;
      ((r == null ? undefined : r.file) === entry.file && o === this.filepath) ||
        (i.empty(), n.app.renderContext.renderFileLink(entry.file, null, i));
    };
    return t;
  })(MG),
  DG = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.value = null;
      r.error = null;
      r.el.addClass("bases-rendered-value");
      return r;
    }
    __extends(t, e);
    t.prototype.render = function (entry) {
      var t = this,
        n = this,
        i = n.el,
        r = n.prop,
        o = n.value,
        a = n.error,
        value = null,
        error = null;
      try {
        value = entry.getValue(r);
      } catch (e) {
        error = e;
      }
      if (
        ((this.entry = entry),
        (this.value = value),
        (this.error = error),
        !CH.equals(o, value) || (error == null ? undefined : error.message) !== (a == null ? undefined : a.message))
      ) {
        if ((i.empty(), error)) {
          var c = i.createDiv("bases-formula-error");
          setIcon(c.createDiv("warning-icon"), "lucide-info");
          c.createDiv({
            text: error.message,
          });
          setTooltip(c, error.message, {
            delay: 300,
          });
          c.addEventListener("click", function () {
            return displayTooltip(c, error.message);
          });
          return void c.addEventListener("dblclick", function (e) {
            e.preventDefault();
            var name = Xz(r).name,
              i = new SU(t.view.app, c, name);
            i.scrollEl.createDiv("bases-toolbar-menu-container", function (e) {
              var i = e.createDiv("bases-toolbar-menu-container-header");
              i.createDiv("menu-title").createDiv({
                cls: "menu-title-inner",
                text: i18nProxy.plugins.bases.titleEditProperty({
                  name: name,
                }),
              });
              var r = i.createDiv("clickable-icon"),
                o = new aG(t.view.queryController, t.prop, !1);
              r.addEventListener("click", function (e) {
                return o.showActions(e, r);
              });
              setIcon(r, "lucide-more-vertical");
              e.appendChild(o.containerEl);
            });
            i.setAutoDestroy(c);
            i.setOpen(!0);
          });
        }
        if (value) {
          value.renderTo(i, this.view.app.renderContext);
        }
      }
    };
    return t;
  })(MG),
  AG = i18nProxy.plugins.bases,
  PG = (function (e) {
    function t(app, plugin, i, currentFile) {
      if (undefined === currentFile) {
        currentFile = null;
      }
      var o = e.call(this) || this;
      o.currentFile = null;
      o.query = null;
      o.results = new Map();
      o.errors = new Set();
      o.ctx = null;
      o.viewEstates = {};
      o.error = null;
      o.events = new ((function (e) {
        function t() {
          return (e !== null && e.apply(this, arguments)) || this;
        }
        __extends(t, e);
        t.prototype.trigger = function (t) {
          for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
          e.prototype.trigger.apply(this, __spreadArray([t], n, !1));
        };
        t.prototype.on = function (t, n, i) {
          return e.prototype.on.call(this, t, n, i);
        };
        return t;
      })(Events))();
      o.requestNotifyView = debounce(o.notifyView.bind(o), 50);
      o.relevantProperties = new Set();
      o.queryState = "";
      o.app = app;
      o.plugin = plugin;
      o.currentFile = currentFile;
      o.viewHeaderEl = i.createDiv(
        {
          cls: "bases-header",
        },
        function (e) {
          var n = e.createDiv({
            cls: "query-toolbar",
          });
          o.viewMenu = o.addChild(new kG(app, o, n));
          o.resultsMenu = new uG(app, n);
          o.sortMenu = new gG(app, n);
          o.filterMenu = new yj(o, n);
          o.propertyMenu = o.addChild(new iG(o, n));
          o.newItemMenu = o.addChild(new eG(app, n.createDiv("query-toolbar-item mod-add-note")));
        },
      );
      o.errorEl = i.createDiv("bases-error");
      o.viewContainerEl = i.createDiv("bases-view");
      o.mockContext = new kq(o);
      o.queue = new hR(app, o);
      o.addChild(o.queue);
      new ResizeObserver(function () {
        return o.onResize();
      }).observe(o.viewContainerEl);
      return o;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.registerEvent(this.app.metadataTypeManager.on("changed", this.requestNotifyView.bind(this)));
      this.registerEvent(this.app.vault.on("config-changed", this.onConfigChanged, this));
    };
    t.prototype.onConfigChanged = function (e) {
      if (e === "userIgnoreFilters") {
        this.queryState = "";
        this.update();
      }
    };
    t.prototype.setEphemeralState = function (e) {
      if (e && Object.hasOwn(e, "views")) {
        var t = (this.viewEstates = e.views);
        if (Object.hasOwn(t, this.viewName)) {
          this.view.setEphemeralState(t[this.viewName]);
        }
      }
    };
    t.prototype.getEphemeralState = function () {
      var views = this.viewEstates;
      views[this.viewName] = this.view.getEphemeralState();
      return {
        views: views,
      };
    };
    t.prototype.onResize = function () {
      var e;
      if (!((e = this.view) === null || undefined === e)) {
        e.onResize();
      }
    };
    t.prototype.promptForAddView = function () {
      this.viewMenu.promptForAddView();
    };
    t.prototype.selectView = function (viewName) {
      if (this.viewName !== viewName) {
        var t = this.viewEstates;
        this.view && (t[this.viewName] = this.view.getEphemeralState());
        this.viewName = viewName;
        this.error === "view" && this.clearError();
        this.update();
        this.view && Object.hasOwn(t, this.viewName) && this.view.setEphemeralState(t[this.viewName]);
        this.events.trigger("view-changed");
      }
    };
    t.prototype.setQuery = function (query) {
      this.clearError();
      query instanceof Error
        ? this.displayError("query", query)
        : ((this.query && query.toString() === this.query.toString()) || (this.query = query), this.update());
    };
    t.prototype.setQueryAndView = function (e, viewName) {
      var n = this.viewName;
      this.viewName = viewName;
      this.setQuery(e);
      n !== viewName && this.events.trigger("view-changed");
    };
    t.prototype.getActiveBasesViewOfType = function (e) {
      return this.view instanceof e ? this.view : null;
    };
    t.prototype.getQueryViewNames = function () {
      var e, t;
      return (
        ((t = (e = this.query) === null || undefined === e ? undefined : e.views) === null || undefined === t
          ? undefined
          : t.map(function (e) {
              return e.name;
            })) || []
      );
    };
    t.prototype.getCurrentFile = function () {
      return this.currentFile;
    };
    t.prototype.getViewConfig = function () {
      return this.query.getViewConfig(this.viewName);
    };
    t.prototype.updateCurrentFile = function (currentFile) {
      if (currentFile !== this.currentFile && ((this.currentFile = currentFile), this.query)) {
        var t = this.getViewConfig(),
          n = (this.ctx = this.buildBasesContext(t == null ? undefined : t.filters));
        this.runQuery(n);
      }
    };
    t.prototype.update = function () {
      var e,
        t,
        n = this.query,
        view = this.viewName;
      if (n) {
        var config = n.getViewConfig(view);
        if (!config) {
          this.viewMenu.updateQuery(n, null);
          this.displayError(
            "view",
            new Error(
              AG.msgErrorViewNotFound({
                view: view,
              }),
            ),
          );
          this.viewMenu.setView(view, "lucide-file-question");
          this.queryState = "";
          return void this.events.trigger("view-changed");
        }
        if (!view) {
          this.viewName = view = config.name;
          this.events.trigger("view-changed");
        }
        var o = this.plugin.getRegistration(config.type);
        if (
          (this.viewMenu.setView(config.name, (o == null ? undefined : o.icon) || "lucide-file-question"),
          config.type !== ((e = this.view) === null || undefined === e ? undefined : e.type))
        ) {
          if (this.view) {
            this.removeChild(this.view);
            this.view = null;
            this.viewContainerEl.empty();
          }
          var a = this.plugin.getViewFactory(config.type);
          if (!a) {
            this.viewMenu.updateQuery(n, config);
            return void this.displayError(
              "view",
              new Error(
                AG.msgErrorUnknownViewType({
                  viewtype: config.type,
                }),
              ),
            );
          }
          this.view = a(this, this.viewContainerEl);
          this.addChild(this.view);
          this.events.trigger("view-changed");
        }
        this.view && (this.view.config = config);
        this.viewContainerEl.dataset.viewType =
          ((t = this.view) === null || undefined === t ? undefined : t.type) || "";
        var s = n.formulas,
          formulas = {};
        if (s)
          for (var c in s)
            if (s.hasOwnProperty(c)) {
              formulas[c] = s[c].toString();
            }
        var u = (this.ctx = this.buildBasesContext(config == null ? undefined : config.filters)),
          queryState = JSON.stringify({
            filter: u.filter,
            formulas: formulas,
          });
        queryState !== this.queryState ? ((this.queryState = queryState), this.runQuery(u)) : this.requestNotifyView();
      }
    };
    t.prototype.buildBasesContext = function (e) {
      var t = this.app,
        n = this.query,
        i = n.filters,
        r = n.formulas,
        o = oq.and(i, e);
      return new $z(t, o, r, this.currentFile);
    };
    t.prototype.clear = function () {
      this.query = null;
      this.queryState = null;
      this.viewName = "";
      this.queue.stop();
      this.view && (this.removeChild(this.view), (this.view = null), this.viewContainerEl.empty());
      this.events.trigger("view-changed");
    };
    t.prototype.displayError = function (error, t) {
      this.error = error;
      this.viewContainerEl.hide();
      this.viewHeaderEl.toggle(error !== "query");
      this.filterMenu.setEnabled(!1);
      this.propertyMenu.setEnabled(!1);
      var n = this.errorEl;
      n.empty();
      error === "query" &&
        n.createEl("p", {
          text: AG.msgErrorUnableToParse(),
        });
      n.createEl("p", {
        text: t.message,
      });
      n.show();
    };
    t.prototype.clearError = function () {
      this.error = null;
      this.viewContainerEl.show();
      this.viewHeaderEl.show();
      this.errorEl.empty();
      this.errorEl.hide();
      this.filterMenu.setEnabled(!0);
      this.propertyMenu.setEnabled(!0);
    };
    t.prototype.notifyView = function () {
      var e = this,
        t = e.app,
        n = e.query,
        i = e.view;
      if (n && !this.initialScan) {
        var r = Array.from(this.errors);
        this.errors.clear();
        for (var o = 0, a = r; o < a.length; o++) {
          var s = a[o];
          new Notice(s);
        }
        var l = n.getViewConfig(this.viewName);
        if ((this.viewMenu.updateQuery(n, l), l)) {
          var c = Array.from(this.results.values());
          c.sort(function (e, t) {
            return Eb(e.file.path, t.file.path);
          });
          this.evaluateRelevantProperties(c);
          var allProperties = this.getProperties();
          i && ((i.allProperties = allProperties), (i.data = new EG(t, l, allProperties, c)), i.onDataUpdated());
          this.mockContext.reset();
          this.filterMenu.updateQuery(n, l);
          this.propertyMenu.updateQuery(n, l);
          this.newItemMenu.updateQuery(this, n, l, this.results);
          this.sortMenu.updateQuery(this, n, l);
          this.resultsMenu.updateQuery(i, l, this.results.size);
        }
      }
    };
    t.prototype.evaluateRelevantProperties = function (e) {
      for (var t = (this.relevantProperties = new Set()), n = 0, i = e; n < i.length; n++)
        for (var r = 0, o = i[n].getPropertyKeys(); r < o.length; r++) {
          var a = o[r];
          t.add(a.toLowerCase());
        }
    };
    t.prototype.getProperties = function () {
      var e = this.app.metadataTypeManager,
        t = [];
      t.push.apply(t, eq.FILE_PROPERTIES);
      for (var n = 0, i = Array.from(this.relevantProperties); n < i.length; n++) {
        var r = i[n];
        t.push(Qz("note", e.getPropertyInfo(r).name));
      }
      for (var o = 0, a = Object.keys(this.query.formulas || {}); o < a.length; o++) {
        var s = a[o];
        t.push(Qz("formula", s));
      }
      return t;
    };
    t.prototype.runQuery = function (e) {
      var t = this,
        n = this.viewContainerEl;
      this.queue.stop();
      this.errors.clear();
      var i = this.queue.start(),
        r = cx(i.generator(), {
          batchSize: 10,
          duration: 50,
          maxDelay: 16,
        });
      this.initialScan = true;
      __awaiter(t, undefined, Promise, function () {
        var t, o, a, s, l, c, error, h, p, d, f;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              t = false;
              m.label = 1;
            case 1:
              m.trys.push([1, 8, 9, 14]);
              o = true;
              a = __asyncValues(r);
              m.label = 2;
            case 2:
              return [4, a.next()];
            case 3:
              s = m.sent();
              return (h = s.done)
                ? [3, 7]
                : ((f = s.value),
                  (o = false),
                  (l = f),
                  i.runnable.isCancelled()
                    ? [2]
                    : n.isShown()
                      ? [3, 5]
                      : [
                          4,
                          new Promise(function (e) {
                            return n.onNodeInserted(e, !0);
                          }),
                        ]);
            case 4:
              m.sent();
              m.label = 5;
            case 5:
              if (e.local && e.local.file === l)
                if (t) {
                  if (e.localUsed) {
                    this.runQuery(e.regenerateLocal());
                    return [2];
                  }
                } else t = true;
              if ((this.removeResult(l), this.app.metadataCache.isUserIgnored(l.path))) return [3, 6];
              try {
                c = new eq(e, l);
                (!e.filter || e.filter.test(c)) && this.addResult(l, c);
              } catch (e) {
                this.errors.add(
                  AG.msgErrorFilterFailedToEvaluate({
                    message: e.message,
                  }),
                );
              }
              m.label = 6;
            case 6:
              o = true;
              return [3, 2];
            case 7:
              return [3, 14];
            case 8:
              error = m.sent();
              p = {
                error: error,
              };
              return [3, 14];
            case 9:
              m.trys.push([9, , 12, 13]);
              return o || h || !(d = a.return) ? [3, 11] : [4, d.call(a)];
            case 10:
              m.sent();
              m.label = 11;
            case 11:
              return [3, 13];
            case 12:
              if (p) throw p.error;
              return [7];
            case 13:
              return [7];
            case 14:
              return [2];
          }
        });
      });
    };
    t.prototype.startLoader = function () {};
    t.prototype.stopLoader = function () {
      this.initialScan = false;
      this.requestNotifyView();
    };
    t.prototype.addResult = function (e, t) {
      this.results.set(e, t);
    };
    t.prototype.removeResult = function (e) {
      var t = this.results;
      if (t.has(e)) {
        t.delete(e);
        this.requestNotifyView();
      }
    };
    t.prototype.getMockValue = function (e) {
      if (!(e instanceof Nz))
        try {
          return e.getValue(this.mockContext);
        } catch (e) {}
      return EH.value;
    };
    t.prototype.getMockValueForIdent = function (e) {
      var t = new Dz(e);
      return this.getMockValue(t.formula);
    };
    t.prototype.getWidgetForIdent = function (e) {
      switch (e) {
        case "file.file":
        case "file.path":
          return "file";
        case "file.tags":
          return "tags";
        case "file.ctime":
        case "file.mtime":
          return "date";
        case "file.folder":
          return "folder";
        default:
          var t = this.getMockValueForIdent(e);
          return t instanceof NH ? (t.time ? "datetime" : "date") : wU(t.constructor);
      }
    };
    t.prototype.getEditorLanguageSupport = function () {
      return new xj(this.mockContext);
    };
    return t;
  })(Component),
  LG = (function (e) {
    function t(app, plugin, i, filer0, viewName) {
      var a = e.call(this) || this;
      a.requestSave = debounce(function (e) {
        return __awaiter(a, undefined, undefined, function () {
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                return [4, this.app.vault.modify(this.file, e.toString())];
              case 1:
                t.sent();
                return [2];
            }
          });
        });
      }, 1e3);
      a.app = app;
      a.file = filer0;
      a.containerEl = i.containerEl;
      a.plugin = plugin;
      a.containerEl.addClass("bases-embed", "interactive-child");
      var s = (a.containingFile = app.vault.getFileByPath(i.sourcePath)),
        l = (a.controller = new PG(a.app, a.plugin, a.containerEl, s));
      a.addChild(l);
      a.viewName = viewName;
      a.linkText = i.linktext;
      return a;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var t = this;
      e.prototype.onload.call(this);
      this.registerEvent(
        this.app.vault.on("modify", function (e) {
          return __awaiter(t, undefined, undefined, function () {
            var t, n;
            return __generator(this, function (i) {
              switch (i.label) {
                case 0:
                  if (!this.file || e !== this.file) return [3, 5];
                  t = undefined;
                  i.label = 1;
                case 1:
                  i.trys.push([1, 3, , 4]);
                  return [4, this.loadQuery()];
                case 2:
                  t = i.sent();
                  return [3, 4];
                case 3:
                  n = i.sent();
                  t = n;
                  return [3, 4];
                case 4:
                  this.controller.setQuery(t);
                  i.label = 5;
                case 5:
                  return [2];
              }
            });
          });
        }),
      );
    };
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              n.trys.push([0, 2, , 3]);
              return [4, this.loadQuery()];
            case 1:
              e = n.sent();
              return [3, 3];
            case 2:
              t = n.sent();
              e = t;
              return [3, 3];
            case 3:
              this.controller.clear();
              this.controller.setQueryAndView(e, this.viewName);
              return [2];
          }
        });
      });
    };
    t.prototype.loadQuery = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, this.app.vault.read(this.file)];
            case 1:
              e = i.sent();
              (t = gq.fromString(e)).saveFn = function () {
                n.controller.setQuery(t);
                n.requestSave(t);
              };
              return [2, t];
          }
        });
      });
    };
    return t;
  })(Component),
  IG = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.create = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, linktext, sourcePath, state, u, containerEl, activeEditor, d, f;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              n = e.app;
              i = e.hoverParent;
              r = e.targetEl;
              o = e.waitTime;
              a = e.position;
              linktext = e.linktext;
              sourcePath = e.sourcePath;
              state = e.state;
              u = new t(i, r, o, a);
              return [4, sleep(Math.max(0, u.waitTime - 100))];
            case 1:
              m.sent();
              return u.state === PopoverState.Hidden
                ? [2, null]
                : ((containerEl = u.hoverEl.createDiv()),
                  (activeEditor = u.embed =
                    vY.load({
                      app: n,
                      linktext: linktext,
                      sourcePath: sourcePath,
                      containerEl: containerEl,
                      state: state,
                      depth: 0,
                    }))
                    ? ((d = function () {
                        u.setIsFocused(!0);
                        u.hoverEl.toggleClass("is-editing", !0);
                        var e = new Scope(n.scope);
                        n.keymap.pushScope(e);
                        activeEditor.register(function () {
                          return n.keymap.popScope(e);
                        });
                        activeEditor.registerDomEvent(activeEditor.containerEl.win, "click", function (e) {
                          if (!(e.defaultPrevented || containerEl.contains(e.targetNode))) {
                            u.hide();
                          }
                        });
                      }),
                      activeEditor instanceof LG
                        ? handleTextSelectionClick(activeEditor.containerEl, function () {
                            return d();
                          })
                        : activeEditor instanceof yY &&
                          ((activeEditor.editable = true),
                          (f = function (e) {
                            activeEditor.showEditor(e);
                            activeEditor.editMode.register(function () {
                              return u.hide();
                            });
                          }),
                          (state == null ? undefined : state.mode) === "source"
                            ? ((n.workspace.activeEditor = activeEditor), d(), f())
                            : handleTextSelectionClick(activeEditor.containerEl, function (e) {
                                if (!activeEditor.editorEl.isShown()) {
                                  n.workspace.activeEditor = activeEditor;
                                  d();
                                  fG(e.targetNode) || f(Ll(e));
                                }
                              })),
                      u.watchResize(containerEl),
                      u.addChild(activeEditor),
                      [4, activeEditor.loadFile()])
                    : [3, 3]);
            case 2:
              m.sent();
              m.label = 3;
            case 3:
              u.state === PopoverState.Shown && u.position();
              return [2, u];
          }
        });
      });
    };
    return t;
  })(HoverPopover);
EditorView.EDIT_CONTEXT = false;
var OG = new Set([
    "Alt-ArrowUp",
    "Shift-Alt-ArrowUp",
    "Alt-ArrowDown",
    "Shift-Alt-ArrowDown",
    "Alt-l",
    "Alt-v",
    "Ctrl-m",
  ]),
  FG = defaultKeymap.filter(function (e) {
    return !OG.has(e.key);
  }),
  NG = function (e, t) {
    var n = t.text.search(/\S/);
    return -1 === n ? -1 : countColumn(t.text.substr(0, n), e.facet(EditorState.tabSize));
  },
  RG = foldService.of(function (e, t, from) {
    try {
      var i = e.doc.lineAt(t),
        r = NG(e, i);
      if (r < 0) return;
      for (var o = null, a = i.number + 1, s = e.doc.lines; a <= s; ++a) {
        var l = e.doc.line(a),
          c = NG(e, l);
        if (-1 == c);
        else {
          if (!(c > r)) break;
          o = l;
        }
      }
      if (o)
        return {
          from: from,
          to: o.to,
        };
    } catch (e) {
      console.error(e);
    }
    return null;
  }),
  BG = ViewPlugin.define(function () {
    return {
      lastInsert: "",
    };
  }),
  VG = EditorView.inputHandler.of(function (e, from, n, lastInsert) {
    if (e.compositionStarted || e.state.readOnly) return !1;
    if (from === n) {
      var r = e.plugin(BG),
        o = r.lastInsert === "-" && lastInsert === "—" && e.state.doc.lineAt(from).from === from;
      r.lastInsert = lastInsert;
      return (
        !!o &&
        (e.dispatch({
          changes: [
            {
              insert: "--",
              from: from,
            },
          ],
          selection: {
            anchor: from + 2,
          },
          userEvent: "input.type",
        }),
        !0)
      );
    }
  }),
  HG = [BG, VG],
  zG = foldService.of(function (e, t, n) {
    var i = syntaxTree(e);
    function r(e) {
      if (i.length < e.to) return !0;
      var t = i.resolve(e.from, 1).type.prop(tokenClassNodeProp);
      return t && /\bheader\b/.test(t);
    }
    function o(t) {
      var n = t && t.text.match(/^\s*(#{1,6})(\s+|$)/);
      if (n && r(t)) return n[1].length;
      if (e.doc.lines <= t.number) return 100;
      var o = e.doc.line(t.number + 1);
      return (n = o.text.match(/^[=\-]+\s*$/)) && i.length >= o.to && r(o) ? (o.text[0] == "=" ? 1 : 2) : 100;
    }
    try {
      var a = e.doc.lines,
        s = e.doc.lineAt(t);
      if (s.number === a) return null;
      var l = o(s);
      if (l === 100) return null;
      for (var c = e.doc.line(s.number + 1), u = s.to; c && !(o(c) <= l) && ((u = c.to), c.number !== a); )
        c = e.doc.line(c.number + 1);
      return u === s.to
        ? null
        : {
            from: s.to,
            to: u,
          };
    } catch (e) {
      console.error(e);
    }
    return null;
  }),
  qG = foldService.of(function (e, from, n) {
    var i = e.doc.lineAt(from);
    if (i.text === "---") {
      for (var r = i.number - 1; r > 0; r--) if (e.doc.line(r).text.trim()) return;
      for (var o = e.doc.lines, a = i.number + 1; a <= o && e.doc.line(a).text !== "---"; ) a++;
      if (!(a > o))
        return {
          from: from,
          to: e.doc.line(a).to,
        };
    }
  }),
  goStart = function (e) {
    var t = e.state;
    (0, e.dispatch)(
      t.update({
        selection: {
          anchor: 0,
        },
        scrollIntoView: !0,
      }),
    );
    return !0;
  },
  foldAllUG0 = function (e) {
    forceParsing(e, e.state.doc.length, 5e3);
    for (var t = e.state, effects = [], i = 1; i <= t.doc.lines; i++) {
      var r = t.doc.line(i),
        o = foldable(t, r.from, r.to);
      if (o) {
        effects.push(foldEffect.of(o));
      }
    }
    for (var a = 0; a < t.doc.length; ) {
      a = (r = e.lineBlockAt(a)).to + 1;
    }
    effects.length &&
      e.dispatch({
        effects: effects,
      });
    return !!effects.length;
  };
function _G(e, t) {
  var n = -1;
  return e.changeByRange(function (i) {
    for (var changes = [], o = i.from; o <= i.to; ) {
      var a = e.doc.lineAt(o);
      a.number > n && (i.empty || i.to > a.from) && (t(a, changes, i), (n = a.number));
      o = a.to + 1;
    }
    var s = e.changes(changes);
    return {
      changes: changes,
      range: EditorSelection.range(s.mapPos(i.anchor, 1), s.mapPos(i.head, 1)),
    };
  });
}
var jG = /^[\s>]+/,
  indentMoreGG0 = function (e) {
    var t = e.state,
      n = e.dispatch;
    return (
      !t.readOnly &&
      (n(
        t.update(
          _G(t, function (e, n) {
            var from = e.from,
              r = e.text.match(jG);
            if (r) {
              var o = r[0].lastIndexOf(">");
              if (-1 !== o) {
                r[0].charAt(o + 1) === " " && o++;
                from = from + o + 1;
              }
            }
            n.push({
              from: from,
              insert: t.facet(indentUnit),
            });
          }),
          {
            userEvent: "input.indent",
          },
        ),
      ),
      !0)
    );
  },
  indentLessKG0 = function (e) {
    var t = e.state,
      n = e.dispatch;
    return (
      !t.readOnly &&
      (n(
        t.update(
          _G(t, function (e, n) {
            var i = e.text.match(jG);
            if (i) {
              var r = i[0],
                o = r.indexOf(">");
              if (o > 0)
                n.push({
                  from: e.from,
                  to: e.from + o,
                  insert: "",
                });
              else if (r !== "> ") {
                var a = r.lastIndexOf(">");
                if (-1 !== a && r.charAt(a + 1) === " ") {
                  a++;
                }
                var s = a + 1,
                  l = r.substr(s);
                if (l) {
                  for (
                    var c = countColumn(l, t.tabSize), u = 0, h = indentString(t, Math.max(0, c - getIndentUnit(t)));
                    u < l.length && u < h.length && l.charCodeAt(u) == h.charCodeAt(u);
                  )
                    u++;
                  n.push({
                    from: e.from + s + u,
                    to: e.from + r.length,
                    insert: h.slice(u),
                  });
                }
              }
            }
          }),
          {
            userEvent: "delete.dedent",
          },
        ),
      ),
      !0)
    );
  },
  YG = StateEffect.define(),
  ZG = function (e) {
    var t = StateField.define({
      create: function () {
        return e;
      },
      update: function (e, n) {
        for (var i = 0, r = n.effects; i < r.length; i++) {
          var o = r[i];
          if (o.is(YG) && o.value.field === t) {
            e = o.value.value;
          }
        }
        return e;
      },
    });
    return t;
  },
  editorEditorField = ZG(null),
  editorInfoField = ZG(null),
  editorViewField = editorInfoField,
  editorLivePreviewField = ZG(!1),
  eK = EditorView.mouseSelectionStyle.of(function (e, t) {
    if (t.detail != 3 || t.button != 0) return null;
    var n = e.posAtCoords(t);
    if (n == null) return null;
    var i = e.state.selection;
    return {
      get: function (t, r, o) {
        var a = e.posAtCoords(t);
        if (a == null) return i;
        var s = r ? i.main.anchor : n,
          l = e.state.doc.lineAt(s),
          c = e.state.doc.lineAt(a),
          u = a >= s ? EditorSelection.range(l.from, c.to) : EditorSelection.range(l.to, c.from);
        return o ? i.addRange(u) : EditorSelection.create([u]);
      },
      update: function (e) {
        n = e.changes.mapPos(n);
        i = i.map(e.changes);
      },
    };
  }),
  tK = new Compartment();
function nK(e, from, n) {
  var i = false;
  e.iterate({
    from: from,
    to: n,
    enter: function (e) {
      var t = e.type.prop(lineClassNodeProp);
      if (t && t.contains("HyperMD-table")) {
        i = true;
        return !1;
      }
    },
  });
  return i;
}
var iK = function (e) {
    return function (t) {
      for (
        var n = t.state, i = n.doc, r = n.selection, o = [], a = syntaxTree(t.state), s = 0, l = r.ranges;
        s < l.length;
        s++
      ) {
        var c = l[s],
          u = c.head,
          h = c.anchor,
          p = t.lineBlockAt(u),
          d = !nK(a, c.from, c.to),
          f = t.moveToLineBoundary(c, !1, d);
        if (f.head == u && f.head != p.from) {
          f = t.moveToLineBoundary(c, !1, !1);
        }
        var m = i.sliceString(p.from, p.to),
          g = Ab.exec(m);
        if (g && g[0] && f.head <= p.from + g[0].length) {
          var v = g[1],
            y = undefined === v ? "" : v,
            b = g[2],
            w = undefined === b ? "" : b,
            k = p.from + y.length + w.length,
            C = k < u ? k : p.from;
          f = EditorSelection.cursor(C);
        }
        e ? o.push(EditorSelection.range(h, f.head, f.goalColumn)) : o.push(f);
      }
      t.dispatch({
        selection: EditorSelection.create(o, r.mainIndex),
        scrollIntoView: true,
      });
      return !0;
    };
  },
  rK = function (e) {
    return function (t) {
      for (var n = t.state.selection, i = [], r = syntaxTree(t.state), o = 0, a = n.ranges; o < a.length; o++) {
        var s = a[o],
          l = s.head,
          c = s.anchor,
          u = t.lineBlockAt(l),
          h = !nK(r, s.from, s.to),
          p = t.moveToLineBoundary(s, !0, h);
        p.head == l && p.head != u.from && (p = t.moveToLineBoundary(s, !0, !1));
        e ? i.push(EditorSelection.range(c, p.head, p.goalColumn)) : i.push(p);
      }
      t.dispatch({
        selection: EditorSelection.create(i, n.mainIndex),
        scrollIntoView: true,
      });
      return !0;
    };
  },
  oK = StreamLanguage.define(
    CodeMirror.getMode(
      {},
      {
        name: "hypermd",
      },
    ),
  ),
  aK = StreamLanguage.define(
    CodeMirror.getMode(
      {},
      {
        name: "hypermd",
        front_matter: false,
        table: false,
        fencedCodeBlockHighlighting: false,
        taskLists: false,
        headers: false,
        blockquotes: false,
        indentedCode: false,
        lists: false,
        hr: false,
        blockId: false,
      },
    ),
  ),
  sK = [];
sK.push(EditorView.exceptionSink.of(console.error));
sK.push(
  (function (e) {
    undefined === e && (e = {});
    return [vO.of(e), bO, kO];
  })(),
);
sK.push(EditorState.allowMultipleSelections.of(!0));
sK.push(
  rectangularSelection({
    eventFilter: function (e) {
      return (
        !(e.button !== 0 || !e.altKey || !e.shiftKey) ||
        ((!Platform.isDesktopApp || !Platform.isLinux) && e.button === 1)
      );
    },
  }),
);
sK.push(history());
sK.push(
  EditorState.phrases.of({
    "folded code": "",
  }),
);
sK.push(EditorView.lineWrapping);
sK.push([Dx, EditorView.perLineTextDirection.of(!0)]);
sK.push(indentOnInput());
sK.push(lineHighlighter);
sK.push(Prec.lowest(pm));
sK.push(YI);
sK.push(bB);
sK.push(eK);
sK.push(
  EditorView.clickAddsSelectionRange.of(function (e) {
    return e.altKey && !e.ctrlKey && !e.metaKey;
  }),
);
sK.push(
  ignoreSpellcheckToken.of(
    "url inline-code property footref hmd-footnote math link-has-alias formatting-link hmd-codeblock blockid hmd-frontmatter hashtag",
  ),
);
sK.push(
  keymap.of(
    __spreadArray(
      __spreadArray(
        __spreadArray(
          [
            {
              key: "Home",
              run: iK(!1),
              shift: iK(!0),
              preventDefault: true,
            },
            {
              mac: "Cmd-ArrowLeft",
              run: iK(!1),
              shift: iK(!0),
              preventDefault: true,
            },
            {
              key: "End",
              run: rK(!1),
              shift: rK(!0),
              preventDefault: true,
            },
            {
              mac: "Cmd-ArrowRight",
              run: rK(!1),
              shift: rK(!0),
              preventDefault: true,
            },
          ],
          FG,
          !0,
        ),
        historyKeymap,
        !0,
      ),
      [
        {
          key: "Mod-Shift-z",
          run: redo,
          preventDefault: !0,
        },
      ],
      !1,
    ),
  ),
);
sK.push(
  indentService.of(function (e, t) {
    var n = e.state.doc.lineAt(t).text.match(/^\s*/);
    return n ? e.countColumn(n[0]) : null;
  }),
);
sK.push(
  EditorView.domEventHandlers({
    compositionend: function (e, t) {
      setTimeout(function () {
        return t.dispatch({});
      }, 100);
    },
  }),
);
var lK = tK.of(sK),
  cK = new Compartment(),
  uK = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.init(t);
      return n;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "activeCM", {
      get: function () {
        return this.editorComponent.activeCM;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.init = function (editorComponent) {
      this.editorComponent = editorComponent;
      this.cm = editorComponent.cm;
      this.containerEl = editorComponent.cm.dom;
    };
    t.prototype.refresh = function () {
      this.cm.requestMeasure();
    };
    t.prototype.getValue = function () {
      return this.cm.state.doc.toString();
    };
    t.prototype.setValue = function (insert) {
      var t = this.cm;
      t.dispatch({
        changes: {
          from: 0,
          to: t.state.doc.length,
          insert: insert,
        },
      });
    };
    t.prototype.getLine = function (e) {
      var t = this.cm.state.doc;
      return e >= t.lines ? "" : t.line(e + 1).text;
    };
    t.prototype.lineCount = function () {
      return this.cm.state.doc.lines;
    };
    t.prototype.lastLine = function () {
      return this.cm.state.doc.lines - 1;
    };
    t.prototype.getSelection = function () {
      var e = this.cm,
        t = e.state.selection.main;
      return e.state.doc.sliceString(t.from, t.to);
    };
    t.prototype.getRange = function (e, t) {
      var n = this.cm,
        i = n.state.doc;
      return n.state.doc.sliceString(ym(i, e), ym(i, t));
    };
    t.prototype.replaceSelection = function (e, userEvent) {
      var n = this.cm,
        i = n.state.replaceSelection(e);
      i.userEvent = userEvent;
      n.dispatch(i);
    };
    t.prototype.replaceRange = function (insert, t, n, userEvent) {
      var r = this.cm,
        o = r.state.doc,
        from = ym(o, t),
        s = n ? ym(o, n) : from;
      r.dispatch({
        changes: {
          from: from,
          to: s,
          insert: insert,
        },
        scrollIntoView: true,
        userEvent: userEvent,
      });
    };
    t.prototype.getCursor = function (e) {
      if (undefined === e) {
        e = "head";
      }
      var t = this.cm,
        n = t.state.selection.main,
        i = t.state.doc;
      switch (e) {
        case "from":
          return bm(i, n.from);
        case "to":
          return bm(i, n.to);
        case "anchor":
          return bm(i, n.anchor);
        case "head":
          return bm(i, n.head);
      }
      return null;
    };
    t.prototype.listSelections = function () {
      for (var e = this.cm, t = e.state.selection.ranges, n = e.state.doc, i = [], r = 0, o = t; r < o.length; r++) {
        var a = o[r];
        i.push({
          anchor: bm(n, a.anchor),
          head: bm(n, a.head),
        });
      }
      return i;
    };
    t.prototype.setSelection = function (e, t) {
      var n = this.cm,
        i = n.state.doc,
        anchor = ym(i, e),
        head = t ? ym(i, t) : anchor;
      n.dispatch({
        selection: {
          anchor: anchor,
          head: head,
        },
        scrollIntoView: true,
      });
    };
    t.prototype.setSelections = function (e, t) {
      var n = this.cm,
        i = n.state.doc;
      n.dispatch({
        selection: EditorSelection.create(
          e.map(function (e) {
            var t = ym(i, e.anchor),
              n = e.head ? ym(i, e.head) : t;
            return EditorSelection.range(t, n);
          }),
        ),
        scrollIntoView: true,
      });
    };
    t.prototype.exec = function (e) {
      var n = this.editorComponent.activeCM;
      t.commands[e](n);
    };
    t.prototype.focus = function () {
      this.editorComponent.activeCM.focus();
    };
    t.prototype.blur = function () {
      this.editorComponent.activeCM.contentDOM.blur();
    };
    t.prototype.hasFocus = function () {
      return this.editorComponent.activeCM.hasFocus;
    };
    t.prototype.getScrollInfo = function () {
      var e = this.cm.scrollDOM;
      return {
        top: e.scrollTop,
        left: e.scrollLeft,
        clientHeight: e.clientHeight,
        clientWidth: e.clientWidth,
        height: e.offsetHeight,
        width: e.offsetWidth,
      };
    };
    t.prototype.scrollTo = function (e, t) {
      var n = this.cm.scrollDOM;
      e == null && (e = n.scrollLeft);
      t == null && (t = n.scrollTop);
      n.scroll(e, t);
    };
    t.prototype.scrollIntoView = function (e, t) {
      var n = this.cm,
        i = ym(n.state.doc, e.from),
        r = ym(n.state.doc, e.to),
        o = EditorSelection.range(i, r);
      n.dispatch({
        effects: EditorView.scrollIntoView(o, {
          y: t ? "center" : "nearest",
        }),
      });
    };
    t.prototype.transaction = function (e, userEvent) {
      var n = e.replaceSelection,
        i = e.changes,
        r = e.selection,
        o = e.selections,
        a = this.cm,
        s = a.state.doc,
        l = {},
        changes = [];
      if (((l.scrollIntoView = true), String.isString(n))) {
        var u = a.state.replaceSelection(n);
        changes.push(u.changes);
        l.selection = u.selection;
        l.effects = u.effects;
      }
      if (i)
        for (var h = 0, p = i; h < p.length; h++) {
          u = p[h];
          var from = ym(s, u.from),
            head = u.to ? ym(s, u.to) : from;
          changes.push({
            from: from,
            to: head,
            insert: u.text,
          });
        }
      if (changes.length > 0) {
        var m = ChangeSet.of(changes, s.length, a.state.facet(EditorState.lineSeparator));
        l.changes = [m];
        (o || r) && (s = m.apply(s));
      } else l.changes = changes;
      if (o)
        l.selection = EditorSelection.create(
          o.map(function (e) {
            var t = ym(s, e.from),
              n = e.to ? ym(s, e.to) : t;
            return EditorSelection.range(t, n);
          }),
        );
      else if (r) {
        from = ym(s, r.from);
        head = r.to ? ym(s, r.to) : from;
        l.selection = {
          anchor: from,
          head: head,
        };
      }
      l.userEvent = userEvent;
      this.cm.dispatch(l);
    };
    t.prototype.wordAt = function (e) {
      var t = this.cm.state.doc,
        n = this.cm.state.wordAt(ym(t, e));
      return n
        ? {
            from: bm(t, n.from),
            to: bm(t, n.to),
          }
        : null;
    };
    t.prototype.posToOffset = function (e) {
      return ym(this.cm.state.doc, e);
    };
    t.prototype.offsetToPos = function (e) {
      return bm(this.cm.state.doc, e);
    };
    t.prototype.undo = function () {
      undo(this.cm);
    };
    t.prototype.redo = function () {
      redo(this.cm);
    };
    t.prototype.coordsAtPos = function (e, t) {
      var n = this.cm,
        i = n.coordsAtPos(ym(n.state.doc, e));
      if (!i) return null;
      var r = {
        top: i.top,
        left: i.left,
        bottom: i.bottom,
        right: i.right,
      };
      if (t) {
        var o = n.scrollDOM.getBoundingClientRect(),
          left = o.left,
          top = o.top;
        left -= n.scrollDOM.scrollLeft;
        top -= n.scrollDOM.scrollTop;
        r.top -= top;
        r.bottom -= top;
        r.left -= left;
        r.right -= left;
      }
      return r;
    };
    t.prototype.posAtCoords = function (e, t) {
      var n = this.cm,
        i = n.posAtCoords(
          {
            x: e,
            y: t,
          },
          !1,
        );
      return i === null ? null : bm(n.state.doc, i);
    };
    t.prototype.addHighlights = function (e, classt0, n, i) {
      var r = this.cm,
        effects = [],
        a = [],
        s = hm.get(classt0);
      if (!s) {
        s = Decoration.mark({
          class: classt0,
        });
        hm.set(classt0, s);
      }
      for (
        var l = r.state.doc,
          c = foldedRanges(r.state),
          u = function (e) {
            var t = ym(l, e.from),
              n = ym(l, e.to);
            if (t >= n) return "continue";
            a.push(s.range(t, n));
            i &&
              c.between(t, n, function (from, i) {
                if (n !== from && t !== i) {
                  effects.push(
                    unfoldEffect.of({
                      from: from,
                      to: i,
                    }),
                  );
                }
              });
          },
          h = 0,
          p = e;
        h < p.length;