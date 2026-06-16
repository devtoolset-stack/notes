            case 1:
              return [2, n.sent().arrayBuffer()];
          }
        });
      });
    };
    e.prototype.getCurrentSlug = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this.siteId;
              t.label = 1;
            case 1:
              t.trys.push([1, 3, , 4]);
              return [4, this.apiGetSlugs([e])];
            case 2:
              return [2, t.sent()[e]];
            case 3:
              t.sent();
              return [2, e];
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.getHash = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          return (t = this.getHashFromMetadataCache(e)) ? [2, t] : [2, this.computeHash(e)];
        });
      });
    };
    e.prototype.getPublishFlag = function (e) {
      var t = this.app.metadataCache.getFileCache(e);
      if (!t) return null;
      var n = parseFrontMatterEntry(t.frontmatter, "publish");
      if (n != null) {
        if (String.isString(n)) {
          if ((n = n.toLowerCase()) === "false" || n === "no") return !1;
          if (n === "true" || n === "yes") return !0;
        }
        return !!n;
      }
      for (var i = 0, r = this.excludes; i < r.length; i++) {
        var o = r[i];
        if (e.path.startsWith(o + "/")) return !1;
      }
      for (var a = 0, s = this.includes; a < s.length; a++) {
        o = s[a];
        if (e.path.startsWith(o + "/")) return !0;
      }
      return null;
    };
    e.prototype.getHashFromMetadataCache = function (e) {
      var t = this.app.metadataCache.getFileInfo(e.path);
      return t && t.mtime === e.stat.mtime && t.size === e.stat.size ? t.hash : null;
    };
    e.prototype.computeHash = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.vault.readBinary(e)];
            case 1:
              return [4, computeSha256Hex(t.sent())];
            case 2:
              return [2, t.sent()];
          }
        });
      });
    };
    e.prototype.openModal = function (e) {
      var t = this.modal;
      t || (t = this.modal = new W5(this.app, this));
      e && t.autoLoad(e(t));
      t.open();
    };
    e.prototype.openPublishChanges = function () {
      this.openModal();
    };
    e.prototype.viewSites = function () {
      this.openModal(function (e) {
        return e.manageSitesSection;
      });
    };
    e.prototype.uploadFile = function (e) {
      this.openModal(function (t) {
        t.uploadProgressSection.addChanges([
          {
            path: e.path,
            ctime: 0,
            mtime: 0,
            size: 0,
            type: "new",
            checked: true,
          },
        ]);
        return t.uploadProgressSection;
      });
    };
    return e;
  })(),
  v8 = i18nProxy.plugins.quickSwitcher,
  options = {
    showExistingOnly: false,
    showAttachments: true,
    showAllFileTypes: false,
  },
  b8 = (function () {
    function e() {
      this.id = "switcher";
      this.name = v8.name();
      this.description = v8.desc();
      this.defaultOn = true;
      this.plugin = null;
      this.options = options;
      this.QuickSwitcherModal = QuickSwitcherModal;
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(v8.actionOpen(), "lucide-file-search", this.onOpen.bind(this));
      plugin.registerGlobalCommand({
        id: "switcher:open",
        name: v8.actionOpen(),
        icon: "lucide-navigation",
        callback: this.onOpen.bind(this),
        hotkeys: [BO(["Mod"], "O")],
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t.addSettingTab(new k8(e, t, this));
              n = this;
              return [4, t.loadData()];
            case 1:
              n.options = i.sent() || options;
              return [2];
          }
        });
      });
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
    e.prototype.onOpen = function () {
      new QuickSwitcherModal(this.app, this.options).open();
    };
    return e;
  })(),
  QuickSwitcherModal = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.emptyStateText = v8.labelNoNoteCreateNew();
      i.shouldShowNonFileBookmarks = true;
      i.allowCreateNewFile = true;
      i.shouldShowUnresolved = !n.showExistingOnly;
      i.shouldShowNonImageAttachments = n.showAttachments;
      i.shouldShowImages = n.showAttachments;
      i.shouldShowAllTypes = n.showAllFileTypes;
      i.setPlaceholder(v8.promptTypeFileName());
      i.setInstructions([
        {
          command: "↑↓",
          purpose: v8.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: v8.instructionOpen(),
        },
        {
          command: isMacOS ? "⌘ ↵" : "ctrl ↵",
          purpose: v8.instructionOpenInNewTab(),
        },
        {
          command: isMacOS ? "⌘ ⌥ ↵" : "ctrl alt ↵",
          purpose: v8.instructionOpenToTheRight(),
        },
        {
          command: "shift ↵",
          purpose: v8.instructionCreate(),
        },
        {
          command: "esc",
          purpose: v8.instructionDismiss(),
        },
      ]);
      var r = i.scope;
      r.register(["Shift"], "Enter", function (e) {
        i.selectSuggestion(null, e);
        return !1;
      });
      r.register(["Mod", "Shift"], "Enter", function (e) {
        i.selectSuggestion(null, e);
        return !1;
      });
      r.register(null, "Enter", function (e) {
        i.selectActiveSuggestion(e);
        return !1;
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onChooseSuggestion = function (e, t) {
      var n,
        i = Keymap.isModEvent(t),
        r = "",
        o = this.app.workspace.getActiveViewOfType(FileView);
      if ((o && (r = ((n = o.file) === null || undefined === n ? undefined : n.path) || ""), e)) {
        if (e.type === "file" || e.type === "alias") {
          this.app.workspace.getLeaf(i).openFile(e.file, {
            active: !0,
          });
        } else if (e.type === "unresolved") {
          this.app.workspace.getLeaf(i).openLinkText(e.linktext, r, {
            active: !0,
          });
        } else if (e.type === "bookmark") {
          var a = this.app.internalPlugins.getEnabledPluginById("bookmarks");
          if (!(a == null)) {
            a.openBookmark(e.item, i);
          }
        }
      } else
        this.app.workspace.openLinkText(this.inputEl.value, r, i, {
          active: true,
        });
    };
    return t;
  })(E2),
  k8 = (function (e) {
    function t(t, n, instance) {
      var r = e.call(this, t, n) || this;
      r.instance = instance;
      return r;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this.containerEl;
      t.empty();
      var n = this.instance.options;
      new Setting(t)
        .setName(v8.optionShowExistingOnly())
        .setDesc(v8.optionShowExistingOnlyDescription())
        .addToggle(function (t) {
          return t.setValue(n.showExistingOnly).onChange(function (showExistingOnly) {
            n.showExistingOnly = showExistingOnly;
            e.plugin.saveData(n);
          });
        });
      new Setting(t)
        .setName(v8.optionShowAttachments())
        .setDesc(v8.optionShowAttachmentsDesc())
        .addToggle(function (t) {
          return t.setValue(n.showAttachments).onChange(function (showAttachments) {
            n.showAttachments = showAttachments;
            e.plugin.saveData(n);
          });
        });
      this.app.vault.getConfig("showUnsupportedFiles") &&
        new Setting(t)
          .setName(v8.optionShowAllFileTypes())
          .setDesc(v8.optionShowAllFileTypesDesc())
          .addToggle(function (t) {
            return t.setValue(n.showAllFileTypes).onChange(function (showAllFileTypes) {
              n.showAllFileTypes = showAllFileTypes;
              e.plugin.saveData(n);
            });
          });
    };
    return t;
  })(j1),
  C8 = (function () {
    function e() {
      this.id = "random-note";
      this.name = i18nProxy.plugins.randomNote.name();
      this.description = i18nProxy.plugins.randomNote.desc();
      this.app = null;
      this.pluginInstance = null;
    }
    e.prototype.init = function (app, pluginInstance) {
      this.app = app;
      this.pluginInstance = pluginInstance;
      pluginInstance.registerRibbonItem(
        i18nProxy.plugins.randomNote.actionOpen(),
        "dice",
        this.onRandomNote.bind(this),
      );
      pluginInstance.registerGlobalCommand({
        id: "random-note",
        name: i18nProxy.plugins.randomNote.actionOpen(),
        icon: "dice-glyph",
        callback: this.onRandomNote.bind(this),
      });
    };
    e.prototype.onRandomNote = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = this.app.vault.getMarkdownFiles();
              n = t[Math.floor(Math.random() * t.length)];
              return [4, this.app.workspace.getLeaf(Keymap.isModEvent(e != null ? e : this.app.lastEvent)).openFile(n)];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  E8 = (function () {
    function e() {
      this.id = "slash-command";
      this.name = i18nProxy.plugins.slashCommand.name();
      this.description = i18nProxy.plugins.slashCommand.desc();
      this.defaultOn = false;
    }
    e.prototype.init = function (e, t) {
      this.suggest = new M8(e);
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          e.workspace.editorSuggest.addSuggest(this.suggest);
          return [2];
        });
      });
    };
    e.prototype.onDisable = function (e, t) {
      e.workspace.editorSuggest.removeSuggest(this.suggest);
    };
    return e;
  })(),
  S8 = /(^|\s)\/([^\s\/]*)$/,
  M8 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.onTrigger = function (e, t, n) {
      if (!n) return null;
      var line = e.line,
        r = t.getLine(line).substr(0, e.ch).match(S8);
      if (r) {
        var o = r.index + r[1].length,
          query = r[2];
        return {
          start: {
            line: line,
            ch: o,
          },
          end: {
            line: line,
            ch: e.ch,
          },
          query: query,
        };
      }
      return null;
    };
    t.prototype.selectSuggestion = function (e, lastEvent) {
      var n = this.context;
      if ((this.close(), n)) {
        this.app.lastEvent = lastEvent;
        n.editor.replaceRange("", n.start, n.end);
        lQ(e.item);
      }
    };
    t.prototype.getSuggestions = function (e) {
      for (
        var t = this.app.internalPlugins.getPluginById("command-palette").instance.getCommands(),
          n = prepareFuzzySearch(e.query),
          i = [],
          r = 0,
          o = t;
        r < o.length;
        r++
      ) {
        var item = o[r],
          match = n(item.name);
        if (match) {
          i.push({
            match: match,
            item: item,
          });
        }
      }
      sortSearchResults(i);
      return i;
    };
    t.prototype.renderSuggestion = function (e, t) {
      t.addClass("mod-complex");
      var n = t.createSpan("suggestion-content"),
        i = t.createSpan("suggestion-aux"),
        r = n.createDiv("suggestion-title"),
        o = e.item,
        a = o.name,
        s = a.indexOf(": ");
      if (-1 !== s) {
        var l = a.slice(0, s),
          c = a.slice(s + 2);
        renderResults(r.createSpan("suggestion-prefix"), l, e.match);
        renderResults(r.createSpan(), c, e.match, -(s + 2));
      } else renderResults(r.createSpan(), a, e.match);
      var u = this.app,
        h = u.hotkeyManager.getHotkeys(o.id),
        p = u.hotkeyManager.getDefaultHotkeys(o.id);
      if (h)
        for (var d = 0, f = h; d < f.length; d++) {
          var m = f[d];
          i.createEl("kbd", {
            cls: "suggestion-hotkey",
            text: HO(m),
          });
        }
      else if (p)
        for (var g = 0, v = p; g < v.length; g++) {
          m = v[g];
          i.createEl("kbd", {
            cls: "suggestion-hotkey",
            text: HO(m),
          });
        }
      var y = this.app.internalPlugins.getPluginById("command-palette").instance.options.pinned;
      if (y && y.contains(o.id)) {
        i.createSpan(
          {
            cls: "suggestion-flair",
          },
          function (e) {
            setIcon(e, "lucide-pin");
          },
        );
      }
    };
    return t;
  })(EditorSuggest),
  x8 = lazyLoadScript("/lib/reveal/reveal.js"),
  T8 = (function () {
    function e() {
      this.id = "slides";
      this.name = i18nProxy.plugins.slides.name();
      this.description = i18nProxy.plugins.slides.desc();
    }
    e.prototype.init = function (app, t) {
      var n = this;
      this.app = app;
      t.registerGlobalCommand({
        id: "slides:start",
        name: i18nProxy.plugins.slides.actionStart(),
        icon: "lucide-monitor",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveFile();
          if (t && t.extension === "md") {
            e || new D8(n.app).openFile(t);
            return !0;
          }
        },
      });
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
    };
    e.prototype.onFileMenu = function (e, t) {
      var n = this;
      if (t instanceof TFile && t.extension === "md") {
        e.addItem(function (e) {
          return e
            .setSection("view")
            .setTitle(i18nProxy.plugins.slides.actionStart())
            .setIcon("lucide-monitor")
            .onClick(function () {
              return new D8(n.app).openFile(t);
            });
        });
      }
    };
    return e;
  })(),
  D8 = (function (e) {
    function t(app) {
      var n = e.call(this) || this;
      n.containerEl = null;
      n.revealCssEl = null;
      n.themeCssEl = null;
      n.deck = null;
      n.app = app;
      n.scope = new Scope();
      n.scope.register([], "Escape", n.close.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.openFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          s,
          containerEl,
          c,
          frontmatter,
          h,
          p,
          d,
          f,
          m,
          g,
          promises,
          y,
          w = this;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              this.destroy();
              this.app.keymap.pushScope(this.scope);
              return [4, this.app.vault.read(e)];
            case 1:
              t = b.sent();
              b.label = 2;
            case 2:
              for (
                b.trys.push([2, 6, , 7]),
                  this.containerEl && this.containerEl.detach(),
                  n = x8.promise,
                  i = this.app.vault.getConfig("theme") === "moonstone",
                  r = this.containerEl = activeDocument.body.createDiv("slides-container"),
                  (o = this.themeCssEl =
                    activeDocument.head.createEl("link", {
                      prepend: true,
                    })).setAttribute("rel", "stylesheet"),
                  i ? o.setAttribute("href", "/lib/reveal/white.css") : o.setAttribute("href", "/lib/reveal/black.css"),
                  (a = this.revealCssEl =
                    activeDocument.head.createEl("link", {
                      prepend: true,
                    })).setAttribute("rel", "stylesheet"),
                  a.setAttribute("href", "/lib/reveal/reveal.css"),
                  s = r.createDiv("reveal"),
                  containerEl = s.createDiv("slides"),
                  s.createDiv("slides-close-btn", function (e) {
                    setIcon(e, "lucide-x-square");
                    e.addEventListener("click", w.close.bind(w));
                  }),
                  c = parseMetadata(t),
                  frontmatter = parseYamlFrontmatter(c),
                  h = {
                    definitions: node2Definitions(c),
                  },
                  p = c.children,
                  d = [[]],
                  g = 0;
                g < p.length;
                g++
              )
                (f = p[g]).type === "thematicBreak" ? d.push([]) : d.last().push(f);
              for (
                m = function (e) {
                  var children = d[e];
                  if (children.length === 0) return "continue";
                  c.children = children;
                  var n = renderMarkdown(c, h);
                  containerEl.createEl("section", {}, function (e) {
                    var t = sanitizeHTMLToDom(n);
                    e.appendChild(t);
                  });
                },
                  g = 0;
                g < d.length;
                g++
              )
                m(g);
              promises = [];
              MarkdownPreviewView.postProcess(this.app, {
                docId: ic(16),
                sourcePath: e.path,
                frontmatter: frontmatter,
                promises: promises,
                addChild: function (e) {
                  return w.addChild(e);
                },
                getSectionInfo: function () {
                  return null;
                },
                replace: function () {
                  return null;
                },
                containerEl: containerEl,
                el: containerEl,
              });
              return promises.length > 0 ? [4, Promise.all(promises)] : [3, 4];
            case 3:
              b.sent();
              b.label = 4;
            case 4:
              return [4, n];
            case 5:
              b.sent();
              (this.deck = new Reveal(s, {
                embedded: true,
                keyboardCondition: "focused",
                controlsTutorial: false,
                overview: false,
              })).initialize();
              setTimeout(function () {
                s.dispatchEvent(new PointerEvent("pointerdown"));
              }, 0);
              return [3, 7];
            case 6:
              y = b.sent();
              console.error(y);
              this.close();
              return [3, 7];
            case 7:
              return [2];
          }
        });
      });
    };
    t.prototype.close = function () {
      this.destroy();
    };
    t.prototype.destroy = function () {
      this.app.keymap.popScope(this.scope);
      var e = this,
        t = e.deck,
        n = e.containerEl,
        i = e.revealCssEl,
        r = e.themeCssEl;
      n && (n.detach(), (this.containerEl = null));
      i && (i.detach(), (this.revealCssEl = null));
      r && (r.detach(), (this.themeCssEl = null));
      t && t.destroy();
    };
    return t;
  })(Component),
  A8 = i18nProxy.plugins.sync,
  P8 = i18nProxy.plugins.publish,
  L8 = 36e5,
  I8 = (function (e) {
    function t(t, n, sync) {
      var r = e.call(this, t, n) || this;
      r.vaults = [];
      r.sync = sync;
      return r;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this,
        n = t.app,
        i = t.sync,
        r = t.containerEl;
      if ((r.empty(), Platform.supportsIndexedDb)) {
        if (i.initialized) {
          var o = i.getRemoteVaultId(),
            namea0 = i.getRemoteVaultName();
          if (c$.token) {
            var service = "",
              l = n.vault.adapter;
            if (l instanceof FileSystemAdapter)
              (c = l.getBasePath().toLowerCase()).contains("dropbox")
                ? (service = "Dropbox")
                : c.contains("com~apple~clouddocs") || c.contains("icloud~")
                  ? (service = "iCloud")
                  : c.contains("onedrive") && (service = "OneDrive");
            else if (l instanceof CapacitorAdapter && l.fs.dir === "ICLOUD") {
              service = "iCloud";
            }
            if (service)
              new Setting(r).setName(A8.labelThirdPartySyncWarning()).setDesc(
                createFragment(function (e) {
                  e.createSpan({
                    cls: "mod-warning",
                    text: A8.labelThirdPartySyncWarningDesc({
                      service: service,
                    }),
                  });
                  e.createEl("br");
                  e.createEl("a", {
                    href: "https://help.obsidian.md/sync/switch",
                    text: i18nProxy.interface.buttonLearnMore(),
                    attr: {
                      target: "_blank",
                    },
                  });
                }),
              );
            else if (Platform.isMacOS && l instanceof FileSystemAdapter) {
              var c = l.getBasePath().toLowerCase(),
                u = window.electron.ipcRenderer.sendSync("documents-dir"),
                h = window.electron.ipcRenderer.sendSync("desktop-dir");
              if (c.startsWith(u.toLowerCase()) || c.startsWith(h.toLowerCase())) {
                new Setting(r).setDesc(
                  createFragment(function (e) {
                    e.createSpan({
                      text: A8.labelIcloudDriveWarning(),
                    });
                    e.createEl("br");
                    e.createEl("a", {
                      href: "https://help.obsidian.md/sync/switch",
                      text: i18nProxy.interface.buttonLearnMore(),
                      attr: {
                        target: "_blank",
                      },
                    });
                  }),
                );
              }
            }
            if (!o && !c$.token) {
              var p = rJ(r);
              __awaiter(e, undefined, undefined, function () {
                var e,
                  t = this;
                return __generator(this, function (n) {
                  switch (n.label) {
                    case 0:
                      n.trys.push([0, 2, , 3]);
                      return [4, KQ(c$)];
                    case 1:
                      n.sent();
                      this.display();
                      return [2];
                    case 2:
                      e = n.sent();
                      p.hide();
                      return e.message === "Not logged in"
                        ? (this.displayRequireLogin(), [2])
                        : (r
                            .createEl("p", {
                              text: i18nProxy.plugins.publish.msgNetworkError(),
                            })
                            .createDiv("modal-button-container", function (e) {
                              e.createEl(
                                "button",
                                {
                                  cls: "mod-cta",
                                  text: A8.buttonRetry(),
                                },
                                function (e) {
                                  e.addEventListener("click", function () {
                                    t.display();
                                  });
                                },
                              );
                            }),
                          [3, 3]);
                    case 3:
                      return [2];
                  }
                });
              });
            }
            var d = new Setting(r).setName(A8.optionRemoteVault());
            if (
              (namea0
                ? (d.setDesc(
                    A8.optionRemoteVaultDescConnected({
                      name: namea0,
                    }),
                  ),
                  d.addButton(function (t) {
                    return t
                      .setButtonText(A8.buttonDisconnectFromRemoteVault())
                      .setClass("mod-destructive")
                      .onClick(function () {
                        return __awaiter(e, undefined, undefined, function () {
                          return __generator(this, function (e) {
                            switch (e.label) {
                              case 0:
                                return [4, this.sync.unsetup()];
                              case 1:
                                e.sent();
                                return [4, this.display()];
                              case 2:
                                e.sent();
                                return [2];
                            }
                          });
                        });
                      });
                  }))
                : d.setDesc(A8.optionRemoteVaultDescNotConnected()),
              d.addButton(function (e) {
                return e
                  .setButtonText(A8(o ? "button-manage-remote-vault" : "button-choose-remote-vault"))
                  .onClick(function () {
                    i.openChooseRemoteVaultModal();
                  });
              }),
              o)
            ) {
              var f;
              i.getPause()
                ? new Setting(r)
                    .setName(A8.optionSyncStatus())
                    .setDesc(A8.optionSyncStatusDescPaused())
                    .addButton(function (t) {
                      return t
                        .setButtonText(A8.buttonResume())
                        .setCta()
                        .onClick(function () {
                          i.setPause(!1);
                          i.requestSync();
                          e.display();
                        });
                    })
                : new Setting(r)
                    .setName(A8.optionSyncStatus())
                    .setDesc(A8.optionSyncStatusDescRunning())
                    .addButton(function (t) {
                      return t.setButtonText(A8.buttonPause()).onClick(function () {
                        i.setPause(!0);
                        e.display();
                      });
                    });
              -1 !== i.encryptionVersion &&
                i.encryptionVersion < 3 &&
                new Setting(r)
                  .setName(A8.labelUpgradeVaultEncryption())
                  .setDesc(A8.labelUpgradeVaultEncryptionDesc())
                  .addButton(function (t) {
                    return t.setButtonText(A8.labelUpgradeVault()).onClick(function () {
                      new V8(e.app, e.sync).open();
                    });
                  });
              new Setting(r)
                .setName(A8.optionDeviceName())
                .setDesc(A8.optionDeviceNameDesc())
                .addText(function (e) {
                  return e
                    .setPlaceholder(i.getDefaultDeviceName())
                    .setValue(i.deviceName)
                    .onChange(function (deviceName) {
                      i.deviceName = deviceName;
                      i.forceSaveData();
                    });
                });
              new Setting(r)
                .setName(A8.labelResolveConflicts())
                .setDesc(A8.labelResolveConflictsDesc())
                .addDropdown(function (e) {
                  return e
                    .addOption("merge", A8.optionAutomaticMerge())
                    .addOption("conflict", A8.optionConflictFile())
                    .setValue(i.conflictAction)
                    .onChange(function (conflictAction) {
                      if (
                        !(
                          conflictAction === i.conflictAction ||
                          (conflictAction !== "merge" && conflictAction !== "conflict")
                        )
                      ) {
                        i.conflictAction = conflictAction;
                        i.forceSaveData();
                      }
                    });
                });
              new Setting(r)
                .setName(A8.optionViewDeletedFiles())
                .setDesc(A8.optionViewDeletedFilesDesc())
                .addButton(function (e) {
                  return e.setButtonText(A8.buttonView()).onClick(function () {
                    return i.showDeletedFiles();
                  });
                })
                .addButton(function (e) {
                  return e.setButtonText(A8.buttonBulkRestore()).onClick(function () {
                    return i.showDeletedFiles(!0);
                  });
                });
              new Setting(r)
                .setName(A8.optionSyncLog())
                .setDesc(A8.optionSyncLogDesc())
                .addButton(function (e) {
                  return e.setButtonText(A8.buttonView()).onClick(function () {
                    return i.showSyncLog();
                  });
                });
              var m = function () {
                  return __awaiter(e, undefined, undefined, function () {
                    var e, t, n, r, size, limit, s, l;
                    return __generator(this, function (c) {
                      switch (c.label) {
                        case 0:
                          return [4, i.size()];
                        case 1:
                          e = c.sent();
                          t = e.size;
                          n = t > e.limit;
                          r = t > 0.95 * e.limit;
                          size = t < 0 ? "Unknown" : Ef(t);
                          limit = e.limit < 0 ? "Unknown" : Ef(e.limit);
                          s =
                            limit === "Unknown" && size === "Unknown"
                              ? A8.optionVaultSizeUnknown()
                              : A8.optionVaultSizeDesc({
                                  size: size,
                                  limit: limit,
                                });
                          r && !n && v.setName(A8.optionAlmostOverSize());
                          v.setDesc(s);
                          g.setDesc(s);
                          v.setVisibility(r);
                          g.setVisibility(!r);
                          r || ((l = Math.max(1, (t / e.limit) * 100)), f.setValue(l));
                          return [2];
                      }
                    });
                  });
                },
                g = new Setting(r)
                  .setName(A8.optionVaultSize())
                  .setDesc(A8.optionVaultSizeLoading())
                  .addProgressBar(function (e) {
                    f = e;
                  }),
                v = new Setting(r)
                  .setName(A8.optionOverSize())
                  .setDesc(A8.optionVaultSizeLoading())
                  .addButton(function (e) {
                    return e.setButtonText(A8.buttonUpgradeStorage()).onClick(function () {
                      window.open("https://obsidian.md/account#sync");
                    });
                  })
                  .addButton(function (e) {
                    return e.setButtonText(A8.msgLargestFiles()).onClick(function () {
                      new _8(n, i).open();
                    });
                  })
                  .addButton(function (t) {
                    return t
                      .setWarning()
                      .setButtonText(A8.buttonPurgeRemote())
                      .setTooltip(A8.tooltipPurgeRemote())
                      .onClick(function () {
                        return __awaiter(e, undefined, undefined, function () {
                          return __generator(this, function (e) {
                            switch (e.label) {
                              case 0:
                                return [4, i.purge()];
                              case 1:
                                e.sent();
                                new Notice(A8.msgPurgeComplete());
                                return [4, m()];
                              case 2:
                                e.sent();
                                return [2];
                            }
                          });
                        });
                      });
                  });
              v.settingEl.hide();
              m();
              Platform.isMobileApp &&
                new Setting(r)
                  .setName(A8.optionPreventSleep())
                  .setDesc(A8.optionPreventSleepDesc())
                  .addToggle(function (t) {
                    return t.setValue(e.sync.preventSleep).onChange(function (preventSleep) {
                      return (e.sync.preventSleep = preventSleep);
                    });
                  });
              new Setting(r)
                .setName(A8.optionContactSupport())
                .setDesc(A8.optionContactSupportDesc())
                .addButton(function (t) {
                  return t.setButtonText(A8.buttonCopyDebug()).onClick(function () {
                    return __awaiter(e, undefined, undefined, function () {
                      var e, t;
                      return __generator(this, function (n) {
                        switch (n.label) {
                          case 0:
                            t = (e = navigator.clipboard).writeText;
                            return [4, this.gatherSyncSystemInfo()];
                          case 1:
                            return [4, t.apply(e, [n.sent()])];
                          case 2:
                            n.sent();
                            new Notice(i18nProxy.interface.copied_generic());
                            return [2];
                        }
                      });
                    });
                  });
                })
                .addButton(function (t) {
                  return t.setButtonText(A8.buttonEmailSupport()).onClick(function () {
                    return __awaiter(e, undefined, undefined, function () {
                      var e, t;
                      return __generator(this, function (n) {
                        switch (n.label) {
                          case 0:
                            return [4, this.gatherSyncSystemInfo()];
                          case 1:
                            e = n.sent();
                            t = encodeURIComponent(e);
                            window.open("mailto:support@obsidian.md?subject=Obsidian%20Sync%20Support&body=".concat(t));
                            return [2];
                        }
                      });
                    });
                  });
                });
              new Setting(r).setHeading().setName(A8.optionSelectiveSync());
              new Setting(r)
                .setName(A8.optionExcludedFolders())
                .setDesc(
                  createFragment(function (t) {
                    var n = e.sync.ignoreFolders;
                    if ((t.appendText(A8.optionExcludedFolderDesc()), n.length > 0)) {
                      t.appendText(A8.optionCurrentlyExcludedFolders());
                      for (var i = t.createEl("ul"), r = 0, o = n; r < o.length; r++) {
                        var texta0 = o[r];
                        i.createEl("li", {
                          text: texta0,
                        });
                      }
                    }
                  }),
                )
                .addButton(function (t) {
                  return t.setButtonText(A8.buttonManageExcludedFolders()).onClick(function () {
                    e.manageExclusions();
                  });
                });
              var w = function (e, t) {
                var n = null;
                new Setting(r)
                  .setName(i18nProxy("plugins.sync.option-sync-" + e))
                  .setDesc(i18nProxy("plugins.sync.option-sync-" + e + "-desc", t))
                  .addExtraButton(function (e) {
                    return e
                      .setIcon("lucide-alert-circle")
                      .setTooltip(A8.tooltipUpdateSettingOnAllDevices())
                      .then(function (e) {
                        n = e;
                        e.extraSettingsEl.hide();
                      });
                  })
                  .addToggle(function (t) {
                    return t.setValue(i.allowTypes.has(e)).onChange(function (t) {
                      i.setSyncType(e, t);
                      n.extraSettingsEl.show();
                    });
                  });
              };
              w("image", {
                extensions: IMAGE_EXTENSIONS.join(", "),
              });
              w("audio", {
                extensions: AUDIO_EXTENSIONS.join(", "),
              });
              w("video", {
                extensions: VIDEO_EXTENSIONS.join(", "),
              });
              w("pdf");
              w("unsupported");
              var k = function (e) {
                var t = null;
                new Setting(r)
                  .setName(i18nProxy("plugins.sync.option-sync-" + e))
                  .setDesc(i18nProxy("plugins.sync.option-sync-" + e + "-desc"))
                  .addExtraButton(function (e) {
                    return e
                      .setIcon("lucide-alert-circle")
                      .setTooltip(A8.tooltipUpdateSettingOnAllDevices())
                      .then(function (e) {
                        t = e;
                        e.extraSettingsEl.hide();
                      });
                  })
                  .addToggle(function (n) {
                    return n.setValue(i.allowSpecialFiles.has(e)).onChange(function (n) {
                      i.setAllowSpecialFile(e, n);
                      t.extraSettingsEl.show();
                    });
                  });
              };
              new Setting(r).setHeading().setName(A8.optionVaultConfigSync());
              new Setting(r)
                .setName(A8.optionViewConfigFiles())
                .setDesc(A8.optionViewConfigFilesDesc())
                .addButton(function (e) {
                  return e.setButtonText(A8.buttonView()).onClick(function () {
                    return i.showConfigFiles();
                  });
                });
              k("app");
              k("appearance");
              k("appearance-data");
              k("hotkey");
              k("core-plugin");
              k("core-plugin-data");
              k("community-plugin");
              k("community-plugin-data");
            }
          } else this.displayRequireLogin();
        } else this.displayInitializing();
      } else
        new Setting(r)
          .setName(i18nProxy.interface.msgIndexedDbNotSupported())
          .setDesc(i18nProxy.interface.msgIndexedDbIOS());
    };
    t.prototype.manageExclusions = function () {
      new U8(this.app, this.sync, this).open();
    };
    t.prototype.displayInitializing = function () {
      var e = this,
        t = this.containerEl;
      t.createEl("p", {
        text: A8.labelSyncLoading(),
      });
      t.createDiv("modal-button-container", function (t) {
        t.createEl(
          "button",
          {
            text: "Refresh",
          },
          function (t) {
            t.addEventListener("click", function () {
              e.display();
            });
          },
        );
      });
    };
    t.prototype.displayRequireLogin = function () {
      var e = this,
        t = this.containerEl;
      t.createEl("p", {
        text: A8.labelSyncIntroduction(),
      });
      t.createEl("p", {
        text: A8.labelAccountRequired(),
      });
      t.createDiv("modal-button-container", function (t) {
        t.createEl(
          "button",
          {
            cls: "mod-cta",
            text: A8.buttonSignUp(),
          },
          function (e) {
            e.addEventListener("click", function () {
              Platform.isIosApp && capacitorBrowserPlugin
                ? capacitorBrowserPlugin.open({
                    url: "https://obsidian.md/auth#signup",
                  })
                : window.open("https://obsidian.md/auth#signup");
            });
          },
        );
        t.createEl(
          "button",
          {
            text: A8.buttonLogIn(),
          },
          function (t) {
            t.addEventListener("click", function () {
              new V5(e.app)
                .setCloseCallback(function () {
                  return e.display();
                })
                .open();
            });
          },
        );
      });
    };
    t.prototype.gatherSyncSystemInfo = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r, o, a, s, l, c, u;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              t = (e = this).app;
              n = e.sync;
              return [4, Y$()];
            case 1:
              if (
                ((i = h.sent()),
                (r = t.vault.adapter),
                (o = ""),
                r instanceof FileSystemAdapter
                  ? (o = r.getBasePath())
                  : r instanceof CapacitorAdapter && r.fs.dir === "ICLOUD" && (o = "iCloud"),
                (a = [
                  "SYNC INFO:",
                  "\tVault ID: ".concat(n.getRemoteVaultId()),
                  "\tHost server: ".concat(n.getHost()),
                  "\tDevice name: ".concat(n.deviceName),
                  "\tAllowed file types: ".concat(Array.from(n.allowTypes).join(", ")),
                  "\tAllowed special types: ".concat(Array.from(n.allowSpecialFiles).join(", ")),
                  "\tIgnored directories:".concat(
                    n.ignoreFolders
                      .map(function (e) {
                        return "\n\t\t- " + e;
                      })
                      .join(""),
                  ),
                ]),
                o !== "" && a.push("\tVault path: ".concat(o)),
                Platform.isMobile && a.push("\tPrevent sleep: ".concat(n.preventSleep)),
                t.plugins.isEnabled())
              )
                for (u in ((s = t.plugins.manifests),
                (l = t.plugins.plugins),
                a.push(
                  "\tPlugins: ("
                    .concat(Object.keys(l).length, " enabled/")
                    .concat(Object.keys(s).length, " installed)"),
                ),
                (c = 1),
                l))
                  if (l.hasOwnProperty(u)) {
                    a.push("\t\t".concat(c, ": ").concat(l[u].manifest.name, " v").concat(l[u].manifest.version));
                    c++;
                  }
              a.push("\tSync logs:");
              a.push.apply(
                a,
                n.syncLog.slice(-20).map(function (e) {
                  return "\t\t"
                    .concat(e.ts, " ")
                    .concat(e.error ? "Error" : "Info ", " ")
                    .concat(e.info)
                    .concat(e.file ? " - " + e.file : "");
                }),
              );
              return [2, (i += a.join("\n"))];
          }
        });
      });
    };
    return t;
  })(j1),
  O8 = [
    "mod-avatar-color-1",
    "mod-avatar-color-2",
    "mod-avatar-color-3",
    "mod-avatar-color-4",
    "mod-avatar-color-5",
    "mod-avatar-color-6",
    "mod-avatar-color-7",
    "mod-avatar-color-8",
  ],
  F8 = (function (e) {
    function t(t, plugin, filepath) {
      var r = e.call(this, t) || this;
      r.plugin = null;
      r.items = [];
      r.filepath = null;
      r.listContainerEl = null;
      r.listEl = null;
      r.contentContainerEl = null;
      r.contentDiffEl = null;
      r.activeItemParentEl = null;
      r.activeItemEl = null;
      r.loadMoreButtonEl = null;
      r.activeItem = null;
      r.cache = {};
      r.plugin = plugin;
      r.filepath = filepath;
      r.setTitle(filepath);
      var o = r,
        a = o.contentEl;
      o.modalEl.addClass("mod-sync-history", "mod-sidebar-layout");
      var s = (r.backButtonEl = r.titleEl.createDiv("modal-setting-back-button", function (e) {
        e.createSpan("modal-setting-back-button-icon", function (e) {
          setIcon(e, "lucide-arrow-left");
        });
        e.addEventListener("click", function () {
          Ml(r.contentEl, r.listContainerEl, "left");
          s.hide();
        });
      }));
      s.hide();
      var l = (r.listContainerEl = a.createDiv("sync-history-list-container"));
      r.listEl = l.createDiv("modal-sidebar sync-history-list");
      r.loadMoreButtonEl = createEl(
        "button",
        {
          cls: "sync-history-button",
          text: A8.labelLoadMore(),
        },
        function (e) {
          e.addEventListener("click", r.fetchMore.bind(r));
        },
      );
      var c = (r.contentContainerEl = a.createDiv("sync-history-content-container"));
      if (Platform.isPhone) {
        c.detach();
      }
      var u = (r.contentTextEl = c.createDiv("sync-history-content"));
      r.contentTitlebarEl = u.createDiv("modal-setting-titlebar", function (e) {
        e.createDiv({
          cls: "modal-setting-title",
          text: getExtension(r.filepath) === "md" ? Qc(r.filepath) : r.filepath,
        });
        e.createDiv("modal-setting-titlebar-actions", function (e) {
          e.createSpan(
            {
              text: A8.labelShowDiff(),
              cls: "modal-setting-titlebar-toggle",
            },
            function (e) {
              r.diffToggle = new ToggleComponent(e).setSmall().setValue(!!localStorage.getItem("history-show-diff"));
            },
          );
          r.contentCopyButton = new ButtonComponent(e).setButtonText(i18nProxy.interface.labelCopyShort());
          r.restoreVersionButton = new ButtonComponent(e)
            .setButtonText(A8.labelRestoreThisVersion())
            .onClick(function () {
              return __awaiter(r, undefined, undefined, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return this.activeItem === this.items[0][0]
                        ? (new Notice(A8.msgAlreadyLatestVersion()), [2])
                        : ((e = this.filepath !== this.activeItem.path ? this.filepath : ""),
                          [4, this.plugin.restoreVersion(this.activeItem.uid, e)]);
                    case 1:
                      t.sent();
                      new Notice(
                        A8.msgRestoredVersion({
                          time: window.moment(this.activeItem.ts).fromNow(),
                        }),
                      );
                      this.close();
                      return [2];
                  }
                });
              });
            });
        });
      });
      r.contentPreviewEl = u.createDiv("sync-history-preview");
      r.contentDiffEl = u.createDiv("sync-history-diff");
      return r;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      var e = this;
      if ((this.fetchMore(), MARKDOWN_EXTENSIONS.contains(getExtension(this.filepath)))) {
        var t = this.app.internalPlugins.getEnabledPluginById("file-recovery");
        if (t) {
          this.listEl.createEl("button", {
            prepend: true,
            cls: "sync-history-button",
            text: i18nProxy.plugins.fileRecovery.actionOpen(),
            onclick: function () {
              return t.openModal(e.filepath);
            },
          });
        }
      }
    };
    t.prototype.openHistory = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r,
          o,
          a,
          s,
          l,
          c,
          from,
          h,
          p,
          d,
          f = this;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              i = (n = this).contentContainerEl;
              r = n.diffToggle;
              o = n.contentPreviewEl;
              a = n.contentDiffEl;
              s = n.contentCopyButton;
              l = n.contentTitlebarEl;
              c = n.restoreVersionButton;
              o.removeClass("markdown-rendered");
              o.empty();
              a.empty();
              l.hide();
              r.setDisabled(!0);
              s.buttonEl.setAttr("disabled", !0);
              c.buttonEl.hide();
              Platform.isPhone && (Ml(this.contentEl, this.contentContainerEl, "right"), this.backButtonEl.show());
              return e.relatedpath
                ? ((from = getFilename(e.relatedpath)),
                  (h = getFilename(e.path)),
                  (p = Zc(e.relatedpath)),
                  (d = Zc(e.path)),
                  from === h
                    ? o.createDiv({
                        cls: "sync-history-desc",
                        text: A8.labelFileMovedFromTo({
                          from: p || "/",
                          to: d || "/",
                        }),
                      })
                    : p === d
                      ? o.createDiv({
                          cls: "sync-history-desc",
                          text: A8.labelFileRenamedFromTo({
                            from: from,
                            to: h,
                          }),
                        })
                      : o.createDiv({
                          cls: "sync-history-desc",
                          text: A8.labelFileRenamedFromTo({
                            from: e.relatedpath,
                            to: e.path,
                          }),
                        }),
                  o.show(),
                  [3, 4])
                : [3, 1];
            case 1:
              return e.deleted
                ? (o.createDiv({
                    cls: "sync-history-desc",
                    text: A8.labelFileDeleted(),
                  }),
                  o.show(),
                  [3, 4])
                : [3, 2];
            case 2:
              c.buttonEl.show();
              l.show();
              return [
                4,
                withLoadingClass(i, function () {
                  return __awaiter(f, undefined, undefined, function () {
                    var typen0,
                      i,
                      l,
                      c,
                      u,
                      h,
                      p,
                      d,
                      f,
                      m = this;
                    return __generator(this, function (g) {
                      switch (g.label) {
                        case 0:
                          typen0 = getExtension(getFilename(this.filepath));
                          return MARKDOWN_EXTENSIONS.contains(typen0) ||
                            SCRIPT_STYLE_EXTENSIONS.contains(typen0) ||
                            BASE_EXTENSIONS.contains(typen0)
                            ? ((l = ff), [4, this.getContentForVersion(e.uid)])
                            : [3, 3];
                        case 1:
                          i = l.apply(undefined, [g.sent()]);
                          o.addClass("markdown-rendered");
                          r.setDisabled(!1);
                          s.buttonEl.removeAttribute("disabled");
                          s.onClick(function (e) {
                            vc(i);
                            new Notice(
                              i18nProxy.interface.copied({
                                context: "generic",
                              }),
                            );
                          });
                          c = false;
                          u = false;
                          h = function () {
                            return __awaiter(m, undefined, undefined, function () {
                              var e, s, l, h, p;
                              return __generator(this, function (d) {
                                switch (d.label) {
                                  case 0:
                                    (e = r.getValue())
                                      ? localStorage.setItem("history-show-diff", "true")
                                      : localStorage.removeItem("history-show-diff");
                                    o.toggle(!e);
                                    a.toggle(e);
                                    return !e || u
                                      ? [3, 4]
                                      : ((u = true), t ? ((h = ff), [4, this.getContentForVersion(t.uid)]) : [3, 2]);
                                  case 1:
                                    l = h.apply(undefined, [d.sent()]);
                                    return [3, 3];
                                  case 2:
                                    l = i;
                                    d.label = 3;
                                  case 3:
                                    s = l;
                                    a.empty();
                                    a.appendChild(Zj(s, i));
                                    return [3, 5];
                                  case 4:
                                    e ||
                                      c ||
                                      ((c = true),
                                      MARKDOWN_EXTENSIONS.contains(typen0)
                                        ? ((p = renderMarkdown(parseMetadata(i))), o.appendChild(sanitizeHTMLToDom(p)))
                                        : o.createEl("pre").setText(i));
                                    d.label = 5;
                                  case 5:
                                    return [2];
                                }
                              });
                            });
                          };
                          r.onChange(h);
                          return [4, h()];
                        case 2:
                          g.sent();
                          return [3, 9];
                        case 3:
                          return IMAGE_EXTENSIONS.contains(typen0) ? [4, this.getContentForVersion(e.uid)] : [3, 5];
                        case 4:
                          d = g.sent();
                          p = URL.createObjectURL(
                            new Blob([d], {
                              type: "image/" + typen0,
                            }),
                          );
                          preloadImage(o, p).then(function () {
                            URL.revokeObjectURL(p);
                          });
                          return [3, 8];
                        case 5:
                          return CANVAS_EXTENSIONS.contains(typen0)
                            ? ((f = ff), [4, this.getContentForVersion(e.uid)])
                            : [3, 7];
                        case 6:
                          d = f.apply(undefined, [g.sent()]);
                          N4(o, d);
                          return [3, 8];
                        case 7:
                          o.createDiv(
                            A8.labelPreviewUnsupportedFileType({
                              type: typen0,
                            }),
                          );
                          g.label = 8;
                        case 8:
                          o.show();
                          a.hide();
                          g.label = 9;
                        case 9:
                          return [2];
                      }
                    });
                  });
                }),
              ];
            case 3:
              m.sent();
              m.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype.getContentForVersion = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              t = this.cache;
              n = t[e];
              return t.hasOwnProperty(e) ? [3, 2] : ((i = t), (r = e), [4, this.plugin.getContentForVersion(e)]);
            case 1:
              n = i[r] = o.sent();
              o.label = 2;
            case 2:
              return [2, n];
          }
        });
      });
    };
    t.prototype.setActiveHistoryItem = function (activeItemEl, activeItem, activeItemParentEl) {
      this.activeItemEl && this.activeItemEl.removeClass("is-active");
      this.activeItemParentEl && this.activeItemParentEl.removeClass("is-active");
      this.activeItemEl = activeItemEl;
      activeItemEl.addClass("is-active");
      this.activeItem = activeItem;
      activeItemParentEl && ((this.activeItemParentEl = activeItemParentEl), activeItemParentEl.addClass("is-active"));
    };
    t.prototype.createHistoryItemAvatar = function (e, t) {
      var n = false,
        i = t.username || t.email;
      if (!i) {
        n = true;
        i = c$.name;
      }
      var textr0 = i
          .split(" ")
          .map(function (e) {
            return e.charAt(0);
          })
          .slice(0, 2)
          .join(""),
        o = "";
      if (n) o = "mod-avatar-current-user";
      else {
        for (var a = 0, s = 0; s < i.length; s++) a += i.charCodeAt(s);
        o = O8[a % O8.length];
      }
      setTooltip(
        e.createDiv({
          cls: "sync-history-list-item-avatar " + o,
          text: textr0,
        }),
        (function (e) {
          var t = "";
          e.username
            ? (t = e.email ? "".concat(e.username, " (").concat(e.email, ")") : e.username)
            : e.email && (t = e.email);
          if (t.length > 0) {
            t += "\n";
          }
          if (e.device) {
            t += e.device;
          }
          if (e.relatedpath || e.deleted || e.size === 0) return t;
          t += ", " + Ef(e.size);
          return t;
        })(t),
        {
          placement: "bottom",
          gap: 16,
          delay: DEFAULT_TOOLTIP_DELAY,
        },
      );
    };
    t.prototype.fetchMore = function () {
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
          w = this;
        return __generator(this, function (k) {
          switch (k.label) {
            case 0:
              t = (e = this).items;
              n = e.listEl;
              i = e.loadMoreButtonEl;
              r = null;
              o = this.filepath;
              a = t.length === 0;
              i.detach();
              t.length > 0 && ((s = t.last().last()), (r = s.uid), (o = s.relatedpath || s.path));
              k.label = 1;
            case 1:
              k.trys.push([1, 3, , 4]);
              return [4, this.plugin.getHistory(o, r)];
            case 2:
              l = k.sent();
              return [3, 4];
            case 3:
              k.sent();
              new Notice(A8.labelUnableToRetrieve());
              this.listEl.append(i);
              return [2];
            case 4:
              for (
                c = l.items,
                  -1 !==
                    (u = c.findIndex(function (e) {
                      return e.relatedpath && !e.deleted;
                    })) && (u < c.length - 1 && (c = c.slice(0, u + 1)), (l.more = true)),
                  h = (function (e) {
                    for (var t = [], n = [], i = 0, r = e; i < r.length; i++) {
                      var o = r[i];
                      if ((!o.deleted || !o.relatedpath) && !o.folder)
                        if (n.length !== 0) {
                          var a = n.first();
                          o.deleted || o.relatedpath || !window.moment(a.ts).isSame(o.ts, "day")
                            ? (t.push(n), (n = [o]))
                            : a.device === o.device && a.username === o.username && a.ts - o.ts < L8
                              ? n.push(o)
                              : (t.push(n), (n = [o]));
                        } else n.push(o);
                    }
                    if (n.length > 0) {
                      t.push(n);
                    }
                    return t;
                  })(c),
                  p = function (e) {
                    var activeItem = e[0],
                      r = t.push(e) - 1,
                      o = n.createDiv("sync-history-list-item");
                    if (!(activeItem.username || activeItem.email)) {
                      o.addClass("mod-current-user");
                    }
                    var s = o.createDiv("sync-history-list-item-header"),
                      textl0 =
                        activeItem.ts + 864e5 < Date.now()
                          ? window.moment(activeItem.ts).format("llll")
                          : window.moment(activeItem.ts).fromNow();
                    d.createHistoryItemAvatar(s, activeItem);
                    var c = s.createDiv({
                        cls: "sync-history-list-item-details",
                        text: textl0,
                      }),
                      u = s.createDiv("tree-item-flair-outer"),
                      h = c.createDiv("u-small u-muted");
                    if (activeItem.relatedpath) {
                      var from = getFilename(activeItem.relatedpath),
                        f = getFilename(activeItem.path),
                        m = Zc(activeItem.relatedpath),
                        g = Zc(activeItem.path);
                      from === f
                        ? h.setText(
                            A8.labelFileMovedFrom({
                              from: m || "/",
                            }),
                          )
                        : m === g
                          ? h.setText(
                              A8.labelFileRenamedFrom({
                                from: from,
                              }),
                            )
                          : h.setText(
                              A8.labelFileRenamedFrom({
                                from: activeItem.relatedpath,
                              }),
                            );
                    } else if (activeItem.deleted)
                      activeItem.username || activeItem.email
                        ? h.setText(A8.labelFileDeleted())
                        : h.setText(
                            A8.labelFileDeletedVia({
                              device: activeItem.device,
                            }),
                          );
                    else if (activeItem.size === 0) h.setText(A8.labelEmptyFile());
                    else {
                      var v = A8.labelRevision({
                          count: e.length,
                        }),
                        k =
                          activeItem.username || activeItem.email
                            ? ""
                            : " " +
                              A8.labelViaDevice({
                                device: activeItem.device,
                              });
                      h.setText(v + k);
                    }
                    var C = o.createDiv("version-group-container");
                    C.hide();
                    C.createSpan("connecting-line");
                    for (
                      var E = function (n) {
                          var activeItem = e[n],
                            o = C.createDiv({
                              cls: "version-group-item",
                              text: window.moment(activeItem.ts).format("LT"),
                            });
                          o.addEventListener("click", function () {
                            return __awaiter(w, undefined, undefined, function () {
                              var a;
                              return __generator(this, function (l) {
                                switch (l.label) {
                                  case 0:
                                    a = null;
                                    a = n === e.length - 1 ? (r !== t.length - 1 ? t[r + 1].first() : null) : e[n + 1];
                                    return [4, this.openHistory(activeItem, a)];
                                  case 1:
                                    l.sent();
                                    this.activeItem = activeItem;
                                    Platform.isMobile || this.setActiveHistoryItem(o, activeItem, s);
                                    return [2];
                                }
                              });
                            });
                          });
                        },
                        S = 0;
                      S < e.length;
                      S++
                    )
                      E(S);
                    var M = u.createSpan({
                      cls: "is-collapsed tree-item-flair",
                    });
                    if (!Platform.isMobile) {
                      M.addClass("collapse-icon");
                    }
                    var x = function () {
                      var e = !M.hasClass("is-collapsed");
                      M.toggleClass("is-collapsed", e);
                      toggleElementVisibility(C, e, !0);
                    };
                    setIcon(M, Platform.isMobile ? "chevrons-up-down" : "right-triangle");
                    M.addEventListener("click", function (e) {
                      e.stopPropagation();
                      x();
                    });
                    s.addEventListener("click", function (n) {
                      return __awaiter(w, undefined, undefined, function () {
                        var r, o;
                        return __generator(this, function (a) {
                          switch (a.label) {
                            case 0:
                              return M.contains(n.targetNode)
                                ? [2]
                                : this.activeItem === activeItem
                                  ? (x(), [2])
                                  : ((r = t.indexOf(e)),
                                    (o = -1 !== r && r !== t.length - 1 ? t[r + 1].first() : null),
                                    [4, this.openHistory(activeItem, o)]);
                            case 1:
                              a.sent();
                              Platform.isMobile || this.setActiveHistoryItem(s, activeItem);
                              this.activeItem = activeItem;
                              return [2];
                          }
                        });
                      });
                    });
                    !a || d.activeItemEl || Platform.isMobile || d.setActiveHistoryItem(s, activeItem);
                  },
                  d = this,
                  f = 0,
                  m = h;
                f < m.length;
                f++
              ) {
                g = m[f];
                p(g);
              }
              return a
                ? t.length !== 0
                  ? [3, 5]
                  : (n.createDiv({
                      cls: "list-item mod-empty",
                      text: A8.labelNoHistory(),
                    }),
                    [3, 7])
                : [3, 7];
            case 5:
              return Platform.isMobile
                ? [3, 7]
                : ((v = t.length > 1 ? t[1][0] : null), [4, this.openHistory(t[0][0], v)]);
            case 6:
              k.sent();
              k.label = 7;
            case 7:
              l.more && this.listEl.append(i);
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal);
function N8(e, t) {
  e.addEventListener(
    "scroll",
    function () {
      if (e.scrollTop + e.clientHeight >= e.scrollHeight - e.clientHeight / 2) {
        t();
      }
    },
    {
      passive: !0,
    },
  );
}
var R8 = (function (e) {
    function t(t, plugin, i, r) {
      var o = e.call(this, t) || this;
      o.plugin = null;
      o.history = [];
      o.offset = 0;
      o.plugin = plugin;
      o.history = r.filter(function (e) {
        return !e.folder;
      });
      o.setTitle(i);
      o.modalEl.addClass("mod-lg");
      var a = o.contentEl,
        s = a.createDiv({
          cls: "sync-modal-header",
        });
      s.createEl("p", {
        cls: "u-faded-text",
        text: i18nProxy.nouns.fileWithCount({
          count: o.history.length,
        }),
      });
      s.createEl("p", {
        text: A8.labelClickToSeeHistory(),
      });
      o.historyListEl = a.createDiv("sync-file-tree-container");
      N8(o.historyListEl, function () {
        return o.loadMore();
      });
      return o;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.loadMore();
    };
    t.prototype.loadMore = function () {
      var e = this,
        t = this.history;
      if (!(this.offset >= t.length))
        for (
          var n = Math.min(this.offset + 30, t.length),
            i = function () {
              var n = t[r.offset];
              r.offset++;
              var i = r.historyListEl.createDiv("list-item mod-selectable tappable");
              i.createDiv("list-item-part mod-extended", function (e) {
                e.createDiv({
                  text: ou(n.path),
                });
                var textt0 = window.moment(n.ts).fromNow();
                n.device && (textt0 = "[".concat(n.device, "] ") + textt0);
                e.createDiv({
                  cls: "u-muted u-small list-item-part",
                  text: textt0,
                });
              });
              i.addEventListener("click", function () {
                e.plugin.showVersionHistory(n.path);
              });
            },
            r = this;
          this.offset < n;
        )
          i();
    };
    return t;
  })(Modal),
  B8 = (function (e) {
    function t(t, plugin, i) {
      var r = e.call(this, t) || this;
      r.plugin = null;
      r.history = [];
      r.lastSelectedItem = 0;
      r.offset = 0;
      r.checkboxes = [];
      r.modalEl.addClass("mod-lg");
      r.plugin = plugin;
      r.history = i.filter(function (e) {
        return !e.folder;
      });
      r.setTitle(A8.labelDeletedFiles());
      r.modalEl.addClass("mod-scrollable-content");
      r.contentEl
        .createDiv({
          cls: "sync-modal-header",
        })
        .createEl("p", {
          cls: "u-faded-text",
          text: i18nProxy.nouns.fileWithCount({
            count: r.history.length,
          }),
        });
      r.historyListEl = r.contentEl.createDiv("sync-file-tree-container");
      N8(r.historyListEl, function () {
        return r.loadMore();
      });
      r.restoreButtonEl = r.buttonContainerEl.createEl("button", {
        cls: "mod-cta",
        text: A8.buttonRestoreFiles({
          count: 0,
        }),
      });
      r.restoreButtonEl.ariaDisabled = String(!0);
      r.restoreButtonEl.addEventListener("click", function () {
        return __awaiter(r, undefined, undefined, function () {
          var e, t, succeeded, i, r, o, a, s, l, c, u, h;
          return __generator(this, function (p) {
            switch (p.label) {
              case 0:
                e = this.checkboxes
                  .filter(function (e) {
                    return e.checkboxEl.checked;
                  })
                  .map(function (e) {
                    return e.historyItem;
                  });
                t = new Notice(A8.msgRestoring() + " (0/".concat(e.length, ")"), 0);
                succeeded = 0;
                i = 0;
                r = 0;
                o = e;
                p.label = 1;
              case 1:
                if (!(r < o.length)) return [3, 11];
                a = o[r];
                p.label = 2;
              case 2:
                p.trys.push([2, 8, , 9]);
                return [4, this.plugin.getHistory(a.path, null)];
              case 3:
                s = p.sent();
                l = 0;
                c = s.items;
                p.label = 4;
              case 4:
                return l < c.length ? ((u = c[l]).deleted ? [3, 6] : [4, this.plugin.restoreVersion(u.uid)]) : [3, 7];
              case 5:
                p.sent();
                succeeded++;
                return [3, 7];
              case 6:
                l++;
                return [3, 4];
              case 7:
                i++;
                return [3, 9];
              case 8:
                h = p.sent();
                console.error(h);
                return [3, 9];
              case 9:
                t.setMessage(A8.msgRestoring() + " (".concat(i, "/").concat(e.length, ")"));
                p.label = 10;
              case 10:
                r++;
                return [3, 1];
              case 11:
                setTimeout(function () {
                  return t.hide();
                }, 4e3);
                new Notice(
                  A8.msgRestoringComplete({
                    succeeded: succeeded,
                    failed: e.length - succeeded,
                  }),
                );
                return [2];
            }
          });
        });
      });
      r.addCancelButton();
      return r;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.loadMore();
    };
    t.prototype.loadMore = function () {
      var e = this,
        t = this.history;
      if (!(this.offset >= t.length))
        for (
          var n = Math.min(this.offset + 30, t.length),
            i = function () {
              var historyItem = t[r.offset];
              r.offset++;
              var i = r.historyListEl.createDiv("list-item mod-selectable tappable"),
                checkboxEl = i.createEl("input", {
                  type: "checkbox",
                }),
                a = {
                  checkboxEl: checkboxEl,
                  historyItem: historyItem,
                };
              r.checkboxes.push(a);
              i.createDiv(
                {
                  cls: "list-item-part mod-extended",
                },
                function (e) {
                  e.createDiv({
                    text: ou(historyItem.path),
                  });
                  var textt0 = window.moment(historyItem.ts).fromNow();
                  historyItem.device && (textt0 = "[".concat(historyItem.device, "] ") + textt0);
                  e.createDiv({
                    cls: "u-muted u-small list-item-part",
                    text: textt0,
                  });
                },
              );
              i.addEventListener("click", function (t) {
                var lastSelectedItem = e.checkboxes.indexOf(a),
                  checked = t.target === checkboxEl ? checkboxEl.checked : !checkboxEl.checked;
                if (t.shiftKey)
                  for (
                    var r = Math.min(e.lastSelectedItem, lastSelectedItem),
                      s = Math.max(e.lastSelectedItem, lastSelectedItem),
                      l = r;
                    l <= s;
                    l++
                  )
                    e.checkboxes[l].checkboxEl.checked = checked;
                e.lastSelectedItem = lastSelectedItem;
                t.target !== checkboxEl && (checkboxEl.checked = checked);
                setTimeout(function () {
                  var count = e.checkboxes.filter(function (e) {
                    return e.checkboxEl.checked;
                  }).length;
                  e.restoreButtonEl.setText(
                    A8.buttonRestoreFiles({
                      count: count,
                    }),
                  );
                  e.restoreButtonEl.ariaDisabled = String(count === 0);
                }, 5);
              });
            },
            r = this;
          this.offset < n;
        )
          i();
    };
    return t;
  })(GM),
  V8 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = plugin;
      i.setTitle(A8.labelUpgradeVaultEncryption());
      var r = i.contentEl;
      r.createEl("p", {
        text: A8.msgMigratePreConfirmationPart1(),
      });
      r.createEl("p", {
        text: A8.msgMigratePreConfirmationPart2(),
      });
      r.createEl("p", {
        text: A8.msgMigratePreConfirmationPart3(),
      });
      i.buttonContainerEl.createEl("a", {
        cls: "mod-secondary",
        text: i18nProxy.interface.buttonLearnMore(),
        attr: {
          href: "https://help.obsidian.md/sync/migrate",
          target: "_blank",
          rel: "noopener",
        },
      });
      i.addButton("mod-cta", i18nProxy.dialogue.buttonContinue(), function () {
        new H8(i.app, i.plugin).open();
      });
      i.addCancelButton();
      return i;
    }
    __extends(t, e);
    return t;
  })(GM),
  H8 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = null;
      i.settingTab = null;
      i.region = "";
      i.useOwnPassword = true;
      i.password = "";
      i.plugin = plugin;
      i.modalEl.addClass("mod-lg");
      i.settingTab = plugin.settingTab;
      i.setTitle(A8.labelRemoteVaultConfiguration());
      i.loaderEl = rJ(i.contentEl);
      i.loaderEl.hide();
      (i.migrateVaultEl = i.contentEl.createDiv()).createDiv("message-container", function (e) {
        i.errorEl = e.createDiv("message mod-error");
        i.errorEl.hide();
      });
      i.confirmationEl = i.contentEl.createDiv();
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
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
          h = this;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              this.startLoading();
              e = this.migrateVaultEl;
              t = true;
              return [4, QQ(c$.token)];
            case 1:
              for (n = p.sent(), i = 0, r = n.vaults; i < r.length; i++)
                if ((o = r[i]).id === this.plugin.getRemoteVaultId()) {
                  t = false;
                  this.useOwnPassword = !o.password;
                }
              return t
                ? (e.createEl("p", {
                    text: "This is a shared vault and may only be migrated by the owner.",
                  }),
                  this.stopLoading(),
                  [2])
                : (this.addButton(
                    "mod-cta",
                    i18nProxy.dialogue.buttonContinue(),
                    this.showConfirmationModal.bind(this),
                  ),
                  this.addCancelButton(),
                  [4, this.plugin.size()]);
            case 2:
              (a = p.sent()) && a.vault_size && (this.vaultSize = a.vault_size);
              s = this.plugin.getHost().replace(/^wss?:\/\//, "");
              return [4, ZQ(c$.token, s)];
            case 3:
              l = p.sent();
              c = null;
              new Setting(e)
                .setName(A8.optionVaultRegion())
                .setDesc(A8.optionVaultRegionDesc())
                .addDropdown(function (e) {
                  c = e;
                  e.addOption("", A8.optVaultRegionAutomatic());
                  l.forEach(function (e) {
                    c.addOption(e.value, e.name);
                  });
                  e.setValue("existing").onChange(function (region) {
                    h.region = region;
                  });
                });
              u = null;
              new Setting(e)
                .setName(A8.optionEncryption())
                .setDesc(
                  createFragment(function (e) {
                    e.createDiv({
                      text: A8.optionEncryptionDesc(),
                    });
                    e.createDiv({
                      cls: "mod-warning",
                      text: A8.optionEncryptionWarning(),
                    });
                  }),
                )
                .addDropdown(function (e) {
                  return e
                    .addOptions({
                      "end-to-end": A8.optionEncryptionEndToEnd(),
                      standard: A8.optionEncryptionStandard(),
                    })
                    .setValue(h.useOwnPassword ? "end-to-end" : "standard")
                    .onChange(function (e) {
                      var useOwnPassword = e === "end-to-end";
                      u.settingEl.toggle(useOwnPassword);
                      h.useOwnPassword = useOwnPassword;
                    });
                });
              u = new Setting(e)
                .setName(A8.optionEncryptionPassword())
                .setDesc(
                  createFragment(function (e) {
                    e.createDiv({
                      text: A8.optionEncryptionPasswordDesc(),
                    });
                    e.createDiv({
                      cls: "mod-warning",
                      text: A8.optionEncryptionPasswordDescWarning(),
                    });
                    e.createDiv({
                      text: A8.optionEncryptionPasswordDesc_2(),
                    });
                  }),
                )
                .addText(function (e) {
                  e.inputEl.type = "password";
                  e.setPlaceholder(A8.optionEncryptionPasswordPlaceholder()).onChange(function (password) {
                    return (h.password = password);
                  });
                });
              u.settingEl.toggle(this.useOwnPassword);
              this.stopLoading();
              return [2];
          }
        });
      });
    };
    t.prototype.showConfirmationModal = function () {
      var e = this,
        t = e.useOwnPassword,
        n = e.password,
        i = e.errorEl,
        r = e.confirmationEl;
      i.hide();
      var o = "";
      if ((!0 === t && n === "" && (o = A8.msgPleaseEnterPassword()), o)) {
        i.setText(o);
        i.show();
        return !0;
      }
      this.setTitle(A8.labelConfirmMigrate());
      this.migrateVaultEl.hide();
      var texta0 = this.vaultSize
        ? A8.msgMigrateConfirmationSize({
            size: Ef(this.vaultSize),
          })
        : A8.msgMigrateConfirmation();
      r.empty();
      r.createEl("p", {
        text: texta0,
      });
      r.createEl("p", {
        text: A8.msgProceedPrompt(),
      });
      this.buttonContainerEl.empty();
      this.addButton("mod-cta", A8.buttonMigrate(), this.onBeginMigration.bind(this));
      this.addCancelButton();
      r.show();
      return !0;
    };
    t.prototype.onBeginMigration = function () {
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
          p,
          deviceName,
          f,
          m,
          ignoreFolders,
          v,
          y,
          w = this;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              t = (e = this).region;
              n = e.useOwnPassword;
              i = e.password;
              r = e.errorEl;
              this.startLoading();
              a = null;
              return n ? ((o = d$()), [4, f$(i, o, 3)]) : [3, 2];
            case 1:
              a = b.sent();
              b.label = 2;
            case 2:
              b.trys.push([2, 6, 7, 8]);
              s = this.plugin.getRemoteVaultId();
              return [4, JQ(c$.token, s, a, o, t, 3)];
            case 3:
              l = b.sent();
              c = l.id;
              u = l.name;
              h = l.host;
              p = l.encryption_version;
              n || ((i = l.password), (o = l.salt));
              deviceName = this.plugin.deviceName;
              f = this.plugin.allowTypes;
              m = this.plugin.allowSpecialFiles;
              ignoreFolders = this.plugin.ignoreFolders;
              return [4, this.plugin.unsetup()];
            case 4:
              b.sent();
              return [4, this.plugin.setup(c, u, i, o, h, p)];
            case 5:
              b.sent();
              this.plugin.setPause(!0);
              u$.forEach(function (e) {
                return w.plugin.allowTypes.delete(e);
              });
              h$.forEach(function (e) {
                return w.plugin.allowSpecialFiles.delete(e);
              });
              this.plugin.deviceName = deviceName;
              f.forEach(function (e) {
                return w.plugin.allowTypes.add(e);
              });
              m.forEach(function (e) {
                return w.plugin.allowSpecialFiles.add(e);
              });
              this.plugin.ignoreFolders = ignoreFolders;
              this.plugin.forceSaveData();
              v = this.plugin.on("status-change", function () {
                if (w.plugin.getStatus() === "synced") {
                  w.plugin.offref(v);
                  new Notice(A8.msgVaultMigrationCompleted());
                }
              });
              this.plugin.setPause(!1);
              this.close();
              new Notice(A8.msgVaultMigrationStarted());
              return [3, 8];
            case 6:
              y = b.sent();
              r.setText(y.message);
              r.show();
              this.setTitle(A8.labelMigrateRemoteVault());
              this.buttonContainerEl.empty();
              this.addButton("mod-cta", i18nProxy.dialogue.buttonContinue(), this.showConfirmationModal.bind(this));
              this.addCancelButton();
              return [2, !0];
            case 7:
              this.stopLoading();
              return [7];
            case 8:
              return [2, !0];
          }
        });
      });
    };
    t.prototype.startLoading = function () {
      this.migrateVaultEl.hide();
      this.confirmationEl.hide();
      this.loaderEl.show();
    };
    t.prototype.stopLoading = function () {
      this.migrateVaultEl.show();
      this.loaderEl.hide();
    };
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      this.settingTab.display();
    };
    return t;
  })(GM),
  z8 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = null;
      i.vaultName = "";
      i.region = "";
      i.useOwnPassword = true;
      i.key = "";
      i.createVaultEl = null;
      i.errorEl = null;
      i.plugin = plugin;
      i.modalEl.addClass("mod-lg");
      i.setTitle(A8.labelCreateRemoteVault());
      i.contentEl.createDiv("message-container", function (e) {
        i.errorEl = e.createDiv("message mod-error");
        i.errorEl.hide();
      });
      i.contentEl.createEl("p", {
        text: A8.labelRemoteVaultExplanation(),
      });
      new Setting(i.contentEl)
        .setName(A8.optionVaultName())
        .setDesc(A8.optionVaultNameDesc())
        .addText(function (e) {
          return e.setPlaceholder(A8.optionVaultNamePlaceholder()).onChange(function (vaultName) {
            return (i.vaultName = vaultName);
          });
        });
      new Setting(i.contentEl)
        .setName(A8.optionVaultRegion())
        .setDesc(A8.optionVaultRegionDesc())
        .addDropdown(function (regionSettingDropdown) {
          i.regionSettingDropdown = regionSettingDropdown;
          regionSettingDropdown
            .addOption("", "Automatic")
            .setValue("")
            .onChange(function (region) {
              i.region = region;
            });
        });
      var r = null;
      new Setting(i.contentEl)
        .setName(A8.optionEncryption())
        .setDesc(
          createFragment(function (e) {
            e.createDiv({
              text: A8.optionEncryptionDesc(),
            });
            e.createDiv({
              cls: "mod-warning",
              text: A8.optionEncryptionWarning(),
            });
          }),
        )
        .addDropdown(function (e) {
          return e
            .addOptions({
              "end-to-end": A8.optionEncryptionEndToEnd(),
              standard: A8.optionEncryptionStandard(),
            })
            .setValue("end-to-end")
            .onChange(function (e) {
              var useOwnPassword = e === "end-to-end";
              r.settingEl.toggle(useOwnPassword);
              i.useOwnPassword = useOwnPassword;
            });
        });
      r = new Setting(i.contentEl)
        .setName(A8.optionEncryptionPassword())
        .setDesc(
          createFragment(function (e) {
            e.createDiv({
              text: A8.optionEncryptionPasswordDesc(),
            });
            e.createDiv({
              cls: "mod-warning",
              text: A8.optionEncryptionPasswordDescWarning(),
            });
            e.createDiv({
              text: A8.optionEncryptionPasswordDesc_2(),
            });
          }),
        )
        .addText(function (e) {
          e.inputEl.type = "password";
          e.setPlaceholder(A8.optionEncryptionPasswordPlaceholder()).onChange(function (key) {
            return (i.key = key);
          });
        });
      (i.ctaButtonEl = i.buttonContainerEl.createEl("button", {
        cls: "mod-cta",
        text: i18nProxy.interface.startScreen.buttonCreateVault(),
      })).addEventListener("click", i.onCreateVault.bind(i));
      i.addCancelButton();
      return i;
    }
    __extends(t, e);
    t.prototype.onCreateVault = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, namet0, n, i, r, o, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              namet0 = (e = this).vaultName;
              n = e.region;
              i = e.useOwnPassword;
              r = e.key;
              (o = e.errorEl).hide();
              a = "";
              !0 === i && r === "" && (a = A8.msgPleaseEnterPassword());
              namet0 === "" && (a = A8.msgVaultNameCannotBeEmpty());
              return a
                ? (o.setText(a), o.show(), [2, !0])
                : (this.ctaButtonEl.addClass("mod-loading"), (l = null), i ? ((s = d$()), [4, f$(r, s, 3)]) : [3, 2]);
            case 1:
              l = u.sent();
              u.label = 2;
            case 2:
              u.trys.push([2, 4, 5, 6]);
              return [4, $Q(c$.token, namet0, l, s, n, 3)];
            case 3:
              u.sent();
              return [3, 6];
            case 4:
              c = u.sent();
              o.setText(c.message);
              o.show();
              return [2, !0];
            case 5:
              this.ctaButtonEl.removeClass("mod-loading");
              return [7];
            case 6:
              this.close();
              new Notice(
                A8.msgSuccessfullyCreatedVault({
                  name: namet0,
                }),
              );
              this.plugin.openChooseRemoteVaultModal();
              return [2, !0];
          }
        });
      });
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e = this;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.vaultName = "";
              this.region = "";
              this.useOwnPassword = true;
              this.key = "";
              return [4, ZQ(c$.token)];
            case 1:
              t.sent().forEach(function (t) {
                e.regionSettingDropdown.addOption(t.value, t.name);
              });
              return [2];
          }
        });
      });
    };
    return t;
  })(GM),
  q8 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = null;
      i.errorEl = null;
      i.vaultsEl = null;
      i.loaderEl = null;
      i.plugin = plugin;
      i.setTitle(A8.labelRemoteVaults());
      i.modalEl.addClass("mod-lg");
      i.errorEl = i.contentEl.createDiv("error-container");
      i.errorEl.hide();
      i.loaderEl = rJ(i.contentEl);
      i.loaderEl.hide();
      i.vaultsEl = i.contentEl.createDiv();
      return i;
    }
    __extends(t, e);
    t.prototype.loadRemoteVaults = function () {
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
          v = this;
        return __generator(this, function (w) {
          switch (w.label) {
            case 0:
              t = (e = this).errorEl;
              n = e.vaultsEl;
              i = this.plugin.getRemoteVaultId();
              w.label = 1;
            case 1:
              w.trys.push([1, 3, , 4]);
              return [4, QQ(c$.token)];
            case 2:
              if ("error" in (r = w.sent())) throw new Error("Failed to fetch remote vaults!");
              return [3, 4];
            case 3:
              w.sent();
              this.stopLoading();
              t.empty();
              t.createDiv({
                cls: "error-text",
                text: A8.msgErrorFailedToFetch(),
              });
              (o = t.createEl("button", {
                text: A8.buttonRetry(),
              })).addEventListener("click", function () {
                withModLoadingClass(o, function () {
                  return v.loadRemoteVaults();
                });
              });
              t.show();
              return [2];
            case 4:
              if (((a = r.limit), (s = r.vaults), (l = r.shared), t.hide(), n.empty(), a === 0))
                n.createDiv("vault-empty-state", function (e) {
                  e.createEl("p", {
                    text: A8.labelNoSubscription(),
                  });
                  e.createEl("p", {}, function (e) {
                    e.createSpan({
                      text: A8.labelPleaseVisit() + " ",
                    });
                    e.createEl("a", {
                      cls: "mod-cta",
                      text: "obsidian.md/sync",
                      href: "https://obsidian.md/sync",
                      attr: {
                        target: "_blank",
                      },
                    });
                    e.createSpan({
                      text: ".",
                    });
                  });
                });
              else if (s.length === 0)
                n.createDiv("vault-empty-state", function (e) {
                  e.createEl("p", {
                    text: A8.labelNotRemoteVaults(),
                  });
                });
              else
                for (
                  p = n.createDiv("list-container vault-list"),
                    c = function (e) {
                      p.createDiv("list-item vault-list-item", function (t) {
                        var n = i === e.id;
                        n && e.name !== v.plugin.getRemoteVaultName() && v.plugin.setVaultName(e.name);
                        t.createDiv("list-item-part mod-extended", function (t) {
                          t.createDiv("vault-list-item-title", function (t) {
                            t.toggleClass("is-connected", n);
                            t.createDiv("vault-list-item-icon list-item-part", function (e) {
                              setIcon(e, n ? "open-vault" : "vault");
                            });
                            t.createSpan({
                              text: e.name,
                            });
                          });
                          t.createDiv("list-item-desc vault-list-item-desc", function (t) {
                            e.hasOwnProperty("region") &&
                              e.region !== "" &&
                              t.createDiv({
                                cls: "list-item-part",
                                text: e.region,
                              });
                            t.createDiv({
                              cls: "list-item-part",
                              text: Ef(e.size),
                            });
                            t.createDiv({
                              cls: "list-item-part mod-extended",
                              text: A8.labelVaultCreatedTime({
                                time: window.moment(e.created).fromNow(),
                              }),
                            });
                          });
                        });
                        t.createDiv("list-item-actions", function (t) {
                          n ||
                            t.createDiv("list-item-part clickable-icon", function (t) {
                              setIcon(t, "lucide-trash-2");
                              setTooltip(t, A8.tooltipDeleteRemoteVault());
                              t.addEventListener("click", function () {
                                var t = createFragment();
                                t.createEl("p", {
                                  text: A8.labelConfirmDeleteRemoteVaultQuestion({
                                    name: e.name,
                                  }),
                                });
                                t.createEl("p", {
                                  text: A8.labelConfirmDeleteRemoteVaultResult(),
                                });
                                t.createEl("p", {
                                  cls: "mod-warning",
                                  text: A8.labelConfirmDeleteRemoteVaultWarning(),
                                });
                                var n = new GM(v.app);
                                n.setTitle(A8.labelConfirmDeleteRemoteVault())
                                  .setContent(t)
                                  .addButton("mod-warning", "Delete", function () {
                                    return __awaiter(v, undefined, undefined, function () {
                                      var t;
                                      return __generator(this, function (i) {
                                        switch (i.label) {
                                          case 0:
                                            this.startLoading();
                                            n.close();
                                            i.label = 1;
                                          case 1:
                                            i.trys.push([1, 3, 4, 5]);
                                            return [
                                              4,
                                              ((token = c$.token),
                                              (vault_uid = e.id),
                                              HQ("/vault/delete", {
                                                token: token,
                                                vault_uid: vault_uid,
                                              })),
                                            ];
                                          case 2:
                                            i.sent();
                                            new Notice(
                                              A8.msgRemoteVaultDeleted({
                                                name: e.name,
                                              }),
                                            );
                                            this.open();
                                            return [3, 5];
                                          case 3:
                                            t = i.sent();
                                            new Notice(t.message);
                                            return [3, 5];
                                          case 4:
                                            this.onOpen();
                                            return [7];
                                          case 5:
                                            return [2];
                                        }
                                        var token, vault_uid;
                                      });
                                    });
                                  })
                                  .addCancelButton()
                                  .open();
                              });
                            });
                          t.createDiv("list-item-part clickable-icon", function (t) {
                            setIcon(t, "lucide-edit-3");
                            setTooltip(t, A8.tooltipRenameRemoteVault());
                            var i = function (t) {
                              return __awaiter(v, undefined, Promise, function () {
                                var i;
                                return __generator(this, function (r) {
                                  switch (r.label) {
                                    case 0:
                                      if (t === "" || t === e.name) return [2];
                                      this.startLoading();
                                      r.label = 1;
                                    case 1:
                                      r.trys.push([1, 3, 4, 5]);
                                      return [4, e$(c$.token, e.id, t)];
                                    case 2:
                                      r.sent();
                                      return [3, 5];
                                    case 3:
                                      i = r.sent();
                                      new Notice(i.message);
                                      return [2];
                                    case 4:
                                      this.stopLoading();
                                      return [7];
                                    case 5:
                                      return n ? [4, this.plugin.setRemoteVaultName(t)] : [3, 7];
                                    case 6:
                                      r.sent();
                                      r.label = 7;
                                    case 7:
                                      this.onOpen();
                                      return [2];
                                  }
                                });
                              });
                            };
                            t.addEventListener("click", function () {
                              new G8(v.app, e.name, i).open();
                            });
                          });
                          t.createDiv("list-item-part clickable-icon", function (t) {
                            setIcon(t, "lucide-users");
                            setTooltip(
                              t,
                              A8.tooltipManageSharing({
                                name: e.name,
                              }),
                            );
                            t.addEventListener("click", function () {
                              new K8(v.app, e.name, e.id).open();
                            });
                          });
                          i ||
                            t.createEl(
                              "button",
                              {
                                cls: "list-item-part vault-list-item-button",
                                text: A8.buttonConnectToRemoteVault(),
                              },
                              function (t) {
                                t.addEventListener("click", function () {
                                  return __awaiter(v, undefined, undefined, function () {
                                    var n,
                                      i = this;
                                    return __generator(this, function (r) {
                                      switch (r.label) {
                                        case 0:
                                          return [
                                            4,
                                            withModLoadingClass(t, function () {
                                              return a$(c$.token);
                                            }),
                                          ];
                                        case 1:
                                          return ("error" in (n = r.sent()))
                                            ? [2]
                                            : n.sync
                                              ? (new j8(this.app, this.plugin)
                                                  .connect(e, function () {
                                                    return i.close();
                                                  })
                                                  .open(),
                                                [2])
                                              : (this.errorEl.setText(A8.labelRequireSubscriptionToConnect()),
                                                this.errorEl.show(),
                                                [2]);
                                      }
                                    });
                                  });
                                });
                              },
                            );
                        });
                      });
                    },
                    u = 0,
                    h = s;
                  u < h.length;
                  u++
                ) {
                  g = h[u];
                  c(g);
                }
              if (
                (s.length < a
                  ? n.createDiv("modal-button-container", function (e) {
                      e.createEl(
                        "button",
                        {
                          cls: "mod-cta js-create-vault",
                          text: A8.buttonCreateNewRemoteVault(),
                        },
                        function (e) {
                          e.addEventListener("click", function () {
                            v.close();
                            new z8(v.app, v.plugin).open();
                          });
                        },
                      );
                    })
                  : a > 0 &&
                    n.createEl("p", {
                      cls: "u-small u-muted",
                      text: A8.msgRemoteVaultLimitHit(),
                    }),
                l.length > 0)
              )
                for (
                  new Setting(n).setName(A8.labelVaultsSharedWithYou()).setHeading(),
                    p = n.createDiv("list-container vault-list"),
                    d = function (e) {
                      p.createDiv("list-item vault-list-item", function (t) {
                        var n = i === e.id;
                        n && e.name !== v.plugin.getRemoteVaultName() && v.plugin.setVaultName(e.name);
                        t.createDiv("list-item-part mod-extended", function (t) {
                          t.createDiv("vault-list-item-title", function (t) {
                            t.toggleClass("is-connected", n);
                            t.createDiv("vault-list-item-icon list-item-part", function (e) {
                              setIcon(e, n ? "open-vault" : "vault");
                            });
                            t.createSpan({
                              text: e.name,
                            });
                          });
                          t.createDiv("list-item-desc vault-list-item-desc", function (t) {
                            e.hasOwnProperty("region") &&
                              e.region !== "" &&
                              t.createDiv({
                                cls: "list-item-part",
                                text: e.region,
                              });
                            t.createDiv({
                              cls: "list-item-part",
                              text: Ef(e.size),
                            });
                            t.createDiv({
                              cls: "list-item-part mod-extended",
                              text: A8.labelVaultCreatedTime({
                                time: window.moment(e.created).fromNow(),
                              }),
                            });
                          });
                        });
                        t.createDiv("list-item-actions", function (t) {
                          n
                            ? t
                                .createEl("button", {
                                  cls: "list-item-part vault-list-item-button",
                                  text: A8.buttonDisconnectFromRemoteVault(),
                                })
                                .addEventListener("click", function () {
                                  return __awaiter(v, undefined, undefined, function () {
                                    return __generator(this, function (e) {
                                      switch (e.label) {
                                        case 0:
                                          this.startLoading();
                                          return [4, this.plugin.unsetup()];
                                        case 1:
                                          e.sent();
                                          this.open();
                                          return [2];
                                      }
                                    });
                                  });
                                })
                            : i ||
                              t.createEl(
                                "button",
                                {
                                  cls: "list-item-part vault-list-item-button",
                                  text: A8.buttonConnectToRemoteVault(),
                                },
                                function (t) {
                                  t.addEventListener("click", function () {
                                    return __awaiter(v, undefined, undefined, function () {
                                      var n,
                                        i = this;
                                      return __generator(this, function (r) {
                                        switch (r.label) {
                                          case 0:
                                            return [
                                              4,
                                              withModLoadingClass(t, function () {
                                                return a$(c$.token);
                                              }),
                                            ];
                                          case 1:
                                            return ("error" in (n = r.sent()))
                                              ? [2]
                                              : n.sync
                                                ? (new j8(this.app, this.plugin)
                                                    .connect(e, function () {
                                                      return i.close();
                                                    })
                                                    .open(),
                                                  [2])
                                                : (this.errorEl.setText(A8.labelRequireSubscriptionToConnect()),
                                                  this.errorEl.show(),
                                                  [2]);
                                        }
                                      });
                                    });
                                  });
                                },
                              );
                          t.createDiv("clickable-icon", function (t) {
                            setIcon(t, "lucide-x");
                            setTooltip(t, A8.tooltipLeaveVaultSharing());
                            t.addEventListener("click", function () {
                              var t = createFragment();
                              t.createEl("p", {
                                cls: "setting-message mod-warning",
                                text: A8.labelLeaveVaultConfirmationDetails(),
                              });
                              t.createEl("p", {
                                text: A8.labelLeaveVaultConfirmationDetails(),
                              });
                              new GM(v.app)
                                .setTitle(
                                  A8.labelLeaveVaultConfirmation({
                                    vault: e.name,
                                  }),
                                )
                                .setContent(t)
                                .addButton("mod-warning", A8.buttonLeave(), function () {
                                  v.deleteVaultShare(e.id, e.share_uid);
                                })
                                .addCancelButton()
                                .open();
                            });
                          });
                        });
                      });
                    },
                    f = 0,
                    m = l;
                  f < m.length;
                  f++
                ) {
                  g = m[f];
                  d(g);
                }
              this.stopLoading();
              return [2];
          }
        });
      });
    };
    t.prototype.onOpen = function () {
      this.startLoading();
      this.loadRemoteVaults();
    };
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      this.plugin.settingTab.display();
    };
    t.prototype.startLoading = function () {
      this.vaultsEl.hide();
      this.loaderEl.show();
    };
    t.prototype.stopLoading = function () {
      this.vaultsEl.show();
      this.loaderEl.hide();
    };
    t.prototype.deleteVaultShare = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              i.trys.push([0, 2, , 3]);
              return [
                4,
                oJ(this.contentEl, function () {
                  return t$(c$.token, e, t);
                }),
              ];
            case 1:
              i.sent();
              return [3, 3];
            case 2:
              n = i.sent();
              new Notice(n.message);
              return [2];
            case 3:
              return this.plugin.getRemoteVaultId() !== e ? [3, 5] : [4, this.plugin.unsetup()];
            case 4:
              i.sent();
              i.label = 5;
            case 5:
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal),
  W8 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = null;
      i.syncLog = [];
      i.syncLogContainerEl = null;
      i.filterEventType = "all";
      i.searchQuery = null;
      i.plugin = plugin;
      i.updateSyncLog = i.updateSyncLog.bind(i);
      var r = i.contentEl;
      i.modalEl.addClass("mod-sync-log", "mod-lg");
      i.setTitle(A8.labelSyncLog());
      new Setting(r)
        .addDropdown(function (e) {
          return e
            .addOptions({
              all: A8.optionEventTypeAll(),
              errors: A8.optionEventTypeErrors(),
              skipped: A8.optionEventTypeSkipped(),
              merge: A8.optionEventTypeMergeConflicts(),
            })
            .onChange(function (filterEventType) {
              i.filterEventType = filterEventType;
              i.updateSyncLog();
            });
        })
        .addSearch(function (e) {
          return e.setPlaceholder(i18nProxy.interface.promptFilter()).onChange(function (e) {
            var t = new WF(i.app, e, !1);
            i.searchQuery = t.matcher ? t : null;
            i.updateSyncLog();
          });
        });
      i.syncLogContainerEl = r.createDiv("sync-log-container");
      r.createDiv("modal-button-container", function (e) {
        e.createEl("button", {
          text: A8.buttonCopySyncLog(),
          cls: "mod-cta",
        }).addEventListener("click", i.onCopyResults.bind(i));
        e.createEl("button", {
          text: i18nProxy.dialogue.buttonDone(),
        }).addEventListener("click", function () {
          return i.close();
        });
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      e.prototype.onOpen.call(this);
      this.updateSyncLog();
      this.plugin.on("new-log", this.updateSyncLog);
    };
    t.prototype.onClose = function () {
      this.plugin.off("new-log", this.updateSyncLog);
      e.prototype.onClose.call(this);
    };
    t.prototype.updateSyncLog = function () {
      for (
        var e, t = this.syncLogContainerEl, n = (this.syncLog = this.plugin.syncLog), i = 0, r = n;
        i < r.length;
        i++
      ) {
        if (!(u = r[i]).el) {
          var o = window.moment(u.ts).format("YYYY-MM-DD HH:mm"),
            texta0 = (u.textContent = ""
              .concat(o, " - ")
              .concat(u.info, " ")
              .concat((e = u.file) !== null && undefined !== e ? e : ""));
          u.el = createDiv({
            cls: "list-item",
            text: texta0,
          });
          u.error && u.el.addClass("mod-error");
        }
      }
      for (var s = [], l = 0, c = n; l < c.length; l++) {
        var u = c[l];
        if (
          (this.filterEventType !== "errors" || u.error) &&
          !(
            (this.filterEventType === "merge" && u.type !== "merge") ||
            (this.filterEventType === "skipped" && u.type !== "skip")
          )
        ) {
          var h = u.textContent;
          texta0 = undefined === h ? "" : h;
          if (this.searchQuery) {
            var p = this.searchQuery.matchContent(texta0);
            if (!p) continue;
            u.el.empty();
            renderMatches(u.el, texta0, p.content);
          } else u.el.setText(texta0);
          s.push(u.el);
        }
      }
      t.setChildrenInPlace(s);
      t.scrollTop = t.scrollHeight;
    };
    t.prototype.onCopyResults = function () {
      for (var e = "", t = 0, n = this.syncLog; t < n.length; t++) {
        var i = n[t];
        e += "".concat(window.moment(i.ts).format("YYYY-MM-DD HH:mm"));
        e += " - ".concat(i.info);
        i.file && (e += " ".concat(i.file));
        e += "\n";
      }
      vc(e);
      new Notice(A8.msgSuccessfullyCopiedSyncLog());
    };
    return t;
  })(Modal),
  U8 = (function (e) {
    function t(t, sync, settingTab) {
      var r =
        e.call(
          this,
          t,
          A8.labelAddExcludedFolder(),
          A8.labelAddExcludedFolderDesc(),
          "plugins.sync.label-number-of-folders-excluded",
        ) || this;
      r.sync = null;
      r.settingTab = null;
      r.sync = sync;
      r.settingTab = settingTab;
      r.modalEl.addClass("mod-lg");
      r.setTitle(A8.labelManageExcludedFolders());
      return r;
    }
    __extends(t, e);
    t.prototype.onClose = function () {
      this.settingTab.display();
    };
    t.prototype.getPaths = function () {
      return this.sync.ignoreFolders;
    };
    t.prototype.setPaths = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          this.sync.setIgnoreFolders(e);
          return [2];
        });
      });
    };
    return t;
  })(z5),
  _8 = (function (e) {
    function t(t, sync) {
      var i = e.call(this, t) || this;
      i.sync = sync;
      i.modalEl.addClass("mod-lg");
      i.titleEl.setText(A8.msgLargestFiles());
      i.contentEl.createDiv({
        text: A8.msgLargestFilesDesc(),
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a;
        return __generator(this, function (s) {
          for (n in ((e = this.sync.serverFiles), (t = []), e))
            if (e.hasOwnProperty(n) && (a = e[n]).size > 0) {
              t.push(a);
            }
          for (
            t = t
              .sort(function (e, t) {
                return t.size - e.size;
              })
              .slice(0, 20),
              i = this.contentEl,
              r = 0,
              o = t;
            r < o.length;
            r++
          ) {
            a = o[r];
            i.createDiv({
              cls: "u-small u-muted",
              text: a.path + " (" + Ef(a.size) + ")",
            });
          }
          return [2];
        });
      });
    };
    return t;
  })(Modal),
  j8 = (function (e) {
    function t(t, sync) {
      var i = e.call(this, t) || this;
      i.sync = sync;
      i.settingTab = sync.settingTab;
      i.modalEl.addClass("mod-lg");
      i.msgContainerEl = createDiv("message-container");
      i.errorEl = i.msgContainerEl.createDiv("message mod-error");
      i.setTitle(A8.labelConnectingToVault());
      i.loaderEl = rJ(i.contentEl);
      return i;
    }
    __extends(t, e);
    t.prototype.showError = function (e) {
      e ? (this.contentEl.prepend(this.msgContainerEl), this.errorEl.setText(e)) : this.msgContainerEl.detach();
    };
    t.prototype.showLoading = function () {
      this.contentEl.empty();
      this.buttonContainerEl.empty();
      this.setTitle(A8.labelConnectingToVault());
      this.contentEl.appendChild(this.loaderEl);
    };
    t.prototype.showSetupRetry = function (e) {
      this.contentEl.empty();
      this.buttonContainerEl.empty();
      this.setTitle(A8.labelConnectionFailed());
      this.contentEl.createEl("p", {
        text: A8.labelConnectionFailedDesc(),
      });
      this.addButton("mod-cta", A8.buttonRetry(), e);
      this.addCancelButton();
    };
    t.prototype.connect = function (e, t) {
      var n = this,
        i = function () {
          return __awaiter(n, undefined, undefined, function () {
            var n, r;
            return __generator(this, function (o) {
              switch (o.label) {
                case 0:
                  if (((n = e.password), (r = false), !e.password)) return [3, 4];
                  o.label = 1;
                case 1:
                  o.trys.push([1, 3, , 4]);
                  return [4, m$(e.id, n, e.salt, e.host, e.encryption_version)];
                case 2:
                  o.sent();
                  r = true;
                  return [3, 4];
                case 3:
                  o.sent();
                  return [3, 4];
                case 4:
                  return r ? [3, 6] : [4, this.showPasswordPrompt(e)];
                case 5:
                  o.sent();
                  this.showLoading();
                  o.label = 6;
                case 6:
                  o.trys.push([6, 8, , 9]);
                  return [4, this.sync.setup(e.id, e.name, e.password, e.salt, e.host, e.encryption_version)];
                case 7:
                  o.sent();
                  this.sync.setPause(!0);
                  t == null || t();
                  this.showConfiguration(e.name);
                  return [3, 9];
                case 8:
                  o.sent();
                  this.showSetupRetry(i);
                  return [3, 9];
                case 9:
                  return [2, !0];
              }
            });
          });
        };
      this.app.vault.getFiles().length > 0 ? this.showConfirmVault(e.name, i) : i();
      return this;
    };
    t.prototype.showPasswordPrompt = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var password,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          this.contentEl.empty();
          this.buttonContainerEl.empty();
          this.setTitle(A8.labelUnlockEncryptedVault());
          this.contentEl.createEl("p", {
            text: A8.labelEncryptionPasswordExplanation({
              name: e.name,
            }),
          });
          password = "";
          new Setting(this.contentEl).setName(A8.optionEncryptionPassword()).addText(function (e) {
            e.inputEl.type = "password";
            e.onChange(function (e) {
              password = e;
              r.showError("");
            }).setPlaceholder(A8.optionEncryptionPasswordPlaceholder());
          });
          n = rx();
          (i = this.buttonContainerEl.createEl("button", {
            cls: "mod-cta",
            text: A8.buttonUnlockVault(),
          })).addEventListener("click", function () {
            return __awaiter(r, undefined, undefined, function () {
              var r;
              return __generator(this, function (o) {
                switch (o.label) {
                  case 0:
                    o.trys.push([0, 2, , 3]);
                    return [
                      4,
                      withModLoadingClass(i, function () {
                        return m$(e.id, password, e.salt, e.host, e.encryption_version);
                      }),
                    ];
                  case 1:
                    o.sent();
                    e.password = password;
                    n.resolve();
                    return [3, 3];
                  case 2:
                    r = o.sent();
                    console.error(r);
                    r instanceof XMLHttpRequest
                      ? this.showError(i18nProxy.plugins.publish.msgNetworkError())
                      : this.showError(r.message);
                    return [3, 3];
                  case 3:
                    return [2];
                }
              });
            });
          });
          this.addCancelButton(function () {
            return n.reject();
          });
          return [2, n.promise];
        });
      });
    };
    t.prototype.showConfiguration = function (namee0) {
      var t = this;
      this.setTitle(A8.labelSetupConnection());
      this.contentEl.empty();
      var n = this.contentEl.createDiv("modal-confirmation-state");
      setIcon(n.createDiv("modal-status-icon mod-success"), "circle-check");
      n.createEl("p", {
        text: A8.labelNowConnectedToVault({
          name: namee0,
        }),
      });
      this.buttonContainerEl.empty();
      this.addButton("", A8.labelManageExcludedFolders(), function (e) {
        t.settingTab.manageExclusions();
        return !0;
      });
      this.addButton("mod-cta", A8.buttonStartSyncing(), function (e) {
        t.sync.setPause(!1);
        t.settingTab.display();
      });
    };
    t.prototype.showConfirmVault = function (namee0, t) {
      this.setTitle(A8.labelConfirmMergeVault());
      this.contentEl.empty();
      this.contentEl.createEl("p", {
        text: A8.msgVaultHasNotes(),
      });
      this.contentEl.createEl("p", {
        text: A8.msgVaultMergeWarning({
          name: namee0,
        }),
      });
      this.buttonContainerEl.empty();
      this.addButton("mod-cta", i18nProxy.dialogue.buttonContinue(), t);
      this.addCancelButton();
    };
    return t;
  })(GM),
  G8 = (function (e) {
    function t(t, namen0, i) {
      var r = e.call(this, t) || this;
      r.cb = i;
      r.setTitle(
        A8.labelRenameRemoteVault({
          name: namen0,
        }),
      );
      r.addButton("mod-cta", i18nProxy.dialogue.buttonSave(), r.submit.bind(r));
      r.addCancelButton();
      var o = r.contentEl;
      o.empty();
      new Setting(o)
        .setName(A8.optionVaultName())
        .setDesc(A8.labelRenameRemoteVaultDesc())
        .addText(function (textEl) {
          r.textEl = textEl;
          textEl.setPlaceholder(namen0);
        });
      return r;
    }
    __extends(t, e);
    t.prototype.submit = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          this.cb(this.textEl.getValue());
          return [2];
        });
      });
    };
    return t;
  })(GM),
  K8 = (function (e) {
    function t(t, namen0, vaultId) {
      var r = e.call(this, t) || this;
      r.shares = [];
      r.shareItemEls = {};
      r.vaultId = vaultId;
      var o = r.contentEl;
      o.addClass("sync-vault-share-container");
      r.setTitle(
        P8.labelManageSharing({
          name: namen0,
        }),
      );
      o.createEl("p", {
        cls: "u-muted",
        text: A8.labelSharingWithUsers(),
      });
      r.sharesContainerEl = o.createDiv({
        cls: "sync-vault-shares-list-item-container",
      });
      new Setting(o)
        .setName(P8.optionInviteUser())
        .addText(function (e) {
          return e.setPlaceholder(P8.placeholderInviteUser()).then(function (emailTextComponent) {
            r.emailTextComponent = emailTextComponent;
            emailTextComponent.inputEl.addEventListener("keydown", function (t) {
              if (!t.isComposing) {
                t.key === "Enter" && r.inviteToVault(emailTextComponent.getValue());
              }
            });
          });
        })
        .addButton(function (e) {
          return (r.addButtonComponent = e
            .setButtonText(i18nProxy.interface.buttonAdd())
            .setCta()
            .onClick(function () {
              r.inviteToVault(r.emailTextComponent.getValue());
            }));
        });
      r.addButton("", i18nProxy.dialogue.buttonDone(), function () {
        return r.close();
      });
      r.loadShareItems();
      return r;
    }
    __extends(t, e);
    t.prototype.loadShareItems = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          r,
          shareItemEls,
          a,
          s,
          l,
          c,
          u,
          h,
          p,
          d = this;
        return __generator(this, function (f) {
          switch (f.label) {
            case 0:
              t = (e = this).contentEl;
              n = e.sharesContainerEl;
              f.label = 1;
            case 1:
              f.trys.push([1, 3, , 4]);
              return [
                4,
                oJ(this.contentEl, function () {
                  token = c$.token;
                  vault_uid = d.vaultId;
                  return HQ("/vault/share/list", {
                    token: token,
                    vault_uid: vault_uid,
                  });
                  var token, vault_uid;
                }),
              ];
            case 2:
              i = f.sent();
              this.shares = i.shares;
              return [3, 4];
            case 3:
              r = f.sent();
              t.empty();
              t.createEl("p", {
                cls: "mod-warning",
                text: r.message,
              });
              return [2];
            case 4:
              if (this.shares.length > 0) {
                for (
                  shareItemEls = {},
                    a = function (e) {
                      shareItemEls[e.uid] =
                        (p = s.shareItemEls[e.uid]) !== null && undefined !== p
                          ? p
                          : n.createDiv("list-item", function (t) {
                              e.name
                                ? (t.createDiv({
                                    cls: "list-item-part",
                                    text: e.name,
                                  }),
                                  t.createDiv({
                                    cls: "list-item-part mod-extended",
                                    text: "<".concat(e.email, ">"),
                                  }))
                                : t.createDiv({
                                    cls: "list-item-part mod-extended",
                                    text: e.email,
                                  });
                              e.accepted ||
                                t.createDiv(
                                  {
                                    cls: "list-item-part",
                                  },
                                  function (e) {
                                    e.createSpan({
                                      cls: "u-muted",
                                      text: P8.labelInvitePending(),
                                    });
                                  },
                                );
                              t.createDiv("list-item-part clickable-icon", function (n) {
                                setIcon(n, "lucide-x");
                                setTooltip(n, P8.tooltipRemoveUser());
                                n.addEventListener("click", function () {
                                  return __awaiter(d, undefined, undefined, function () {
                                    var n,
                                      i = this;
                                    return __generator(this, function (r) {
                                      switch (r.label) {
                                        case 0:
                                          t.hide();
                                          r.label = 1;
                                        case 1:
                                          r.trys.push([1, 3, , 4]);
                                          return [
                                            4,
                                            withLoadingClass(this.contentEl, function () {
                                              return t$(c$.token, i.vaultId, e.uid);
                                            }),
                                          ];
                                        case 2:
                                          r.sent();
                                          return [3, 4];
                                        case 3:
                                          n = r.sent();
                                          new Notice(n.message);
                                          return [3, 4];
                                        case 4:
                                          return [4, this.loadShareItems()];
                                        case 5:
                                          r.sent();
                                          return [2];
                                      }
                                    });
                                  });
                                });
                              });
                            });
                    },
                    s = this,
                    l = 0,
                    c = this.shares;
                  l < c.length;
                  l++
                ) {
                  u = c[l];
                  a(u);
                }
                n.setChildrenInPlace(Object.values(shareItemEls));
                this.shareItemEls = shareItemEls;
              } else
                this.sharesContainerEl.setChildrenInPlace([
                  createEl("p", {
                    cls: "u-muted",
                    text: A8.labelNotSharing(),
                  }),
                ]);
              h = this.emailTextComponent.inputEl;
              this.addButtonComponent.buttonEl.ariaDisabled = undefined;
              h.ariaDisabled = undefined;
              h.value = "";
              h.focus();
              return [2];
          }
        });
      });
    };
    t.prototype.inviteToVault = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              if ((e = e.trim()) === "" || !e.includes("@")) {
                new Notice(P8.errorEmailMustBeValid());
                return [2];
              }
              t = this.emailTextComponent.inputEl;
              n = this.addButtonComponent.buttonEl;
              o.label = 1;
            case 1:
              o.trys.push([1, 3, 4, 5]);
              t.ariaDisabled = String(!0);
              n.ariaDisabled = String(!0);
              return [
                4,
                withLoadingClass(this.contentEl, function () {
                  return (function (token, vault_uid, email) {
                    return HQ("/vault/share/invite", {
                      token: token,
                      vault_uid: vault_uid,
                      email: email,
                    });
                  })(c$.token, r.vaultId, e);
                }),
              ];
            case 2:
              o.sent();
              return [3, 5];
            case 3:
              i = o.sent();
              new Notice(i.message);
              return [2];
            case 4:
              t.ariaDisabled = undefined;
              n.ariaDisabled = undefined;
              return [7];
            case 5:
              return [4, this.loadShareItems()];
            case 6:
              o.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(GM);
var Y8 = i18nProxy.plugins.sync,
  Z8 = (function (e) {
    function t(t, sync) {
      var i = e.call(this, t) || this;
      i.hideMyChanges = false;
      i.activeDom = null;
      i.userMapLoaded = false;
      i.userMap = {};
      i.fileItems = {};
      i.sync = sync;
      i.files = qN();
      var r = i,
        o = r.contentEl,
        a = r.containerEl;
      i.uninitializedEl = o.createDiv({
        cls: "pane-empty sync-uninitialized",
        text: Y8.labelSyncDisconnected(),
      });
      i.uninitializedEl.hide();
      var s = (i.headerDom = new s0(i.app, i.containerEl)),
        l = s.addNavButton("users", Y8.buttonHideMyChanges(), function () {
          i.hideMyChanges = !i.hideMyChanges;
          l.toggleClass("is-active", i.hideMyChanges);
          i.updateRecentChanges();
        });
      i.loadingEl = a.createDiv({
        prepend: true,
        cls: "is-loading",
      });
      var containerEl = i.contentEl.createDiv("recent-changes-container");
      s.navHeaderEl.hide();
      containerEl.hide();
      i.scope = new Scope(i.app.scope);
      var u = (i.tree = new z0(i, {
          app: i.app,
          containerEl: containerEl,
          id: i7,
          scope: i.scope,
          getNodeId: function (e) {
            return e instanceof Q8 ? e.id : "";
          },
        })),
        h = (i.groups = {
          today: new Q8(u, "today", Y8.labelToday()),
          yesterday: new Q8(u, "yesterday", Y8.labelYesterday()),
          week: new Q8(u, "week", Y8.labelThisWeek()),
          older: new Q8(u, "older", Y8.labelOlder()),
        });
      u.root.vChildren.setChildren([h.today, h.yesterday, h.week, h.older]);
      h.older.setCollapsed(!0, !1);
      i.tree.loadFolds();
      return i;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.registerEvent(this.app.vault.on("delete", this.onDelete, this));
      this.registerEvent(this.app.vault.on("rename", this.onRename, this));
      this.registerEvent(this.app.workspace.on("file-open", this.onFileOpen, this));
      var e = debounce(this.updateRecentChanges.bind(this), 1e3);
      this.registerEvent(this.sync.on("status-change", e));
      var t = window.setInterval(this.handleRefreshInterval.bind(this), 3e5);
      this.registerInterval(t);
    };
    t.prototype.handleRefreshInterval = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return window.moment().isSame(this.previousRefreshDate, "day") ? [3, 2] : [4, this.updateRecentChanges()];
            case 1:
              e.sent();
              e.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    t.prototype.getViewType = function () {
      return i7;
    };
    t.prototype.getDisplayText = function () {
      return Y8.labelSyncChanges();
    };
    t.prototype.getIcon = function () {
      return "refresh-ccw";
    };
    t.prototype.onResize = function () {
      this.tree.infinityScroll.onResize();
    };
    t.prototype.onDelete = function (e) {
      this.removeFile(e.path);
    };
    t.prototype.onRename = function (e, t) {
      this.removeFile(t);
    };
    t.prototype.onFileOpen = function (e) {
      var t;
      if (e && this.fileItems.hasOwnProperty(e.path)) {
        var activeDom = e ? this.fileItems[e.path] : null;
        if (activeDom !== this.activeDom) {
          activeDom !== this.tree.focusedItem && this.tree.clearSelectedDoms();
          (t = this.activeDom) === null || undefined === t || t.selfEl.removeClass("is-active");
          activeDom == null || activeDom.selfEl.addClass("is-active");
          this.activeDom = activeDom;
        }
      }
    };
    t.prototype.removeFile = function (e) {
      if (this.fileItems.hasOwnProperty(e)) {
        var t = this.fileItems[e];
        this.files.delete(t.el);
        delete this.fileItems[e];
        this.activeDom === t && (this.activeDom = null);
        this.tree.selectedDoms.delete(t);
        this.tree.focusedItem === t && this.tree.setFocusedItem(null);
      }
    };
    t.prototype.updateRecentChanges = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              return this.sync.dataLoaded ? [4, this.loadUsernameMap()] : [2];
            case 1:
              for (
                b.sent(),
                  e = Object.keys(this.userMap).length > 1,
                  this.headerDom.navHeaderEl.toggle(e),
                  e || (this.hideMyChanges = false),
                  this.loadingEl.hide(),
                  t = this.sync.getStatus(),
                  n = t !== "uninitialized" && t !== "disconnected",
                  this.tree.containerEl.toggle(n),
                  this.uninitializedEl.toggle(!n),
                  i = this.getRecentSyncFiles(),
                  r = this.groups,
                  o = r.today,
                  a = r.yesterday,
                  s = r.week,
                  l = r.older,
                  o.clear(),
                  c = 0,
                  u = i.today;
                c < u.length;
                c++
              ) {
                g = u[c];
                this.addItemToGroup(g, o);
              }
              for (o.setFlair(i.today.length), a.clear(), h = 0, p = i.yesterday; h < p.length; h++) {
                g = p[h];
                this.addItemToGroup(g, a);
              }
              for (a.setFlair(i.yesterday.length), s.clear(), d = 0, f = i.week; d < f.length; d++) {
                g = f[d];
                this.addItemToGroup(g, s);
              }
              for (s.setFlair(i.week.length), l.clear(), m = 0; m < i.older.length; m++) {
                g = i.older[m];
                m < 100 ? this.addItemToGroup(g, l) : this.removeFile(g.path);
              }
              i.older.length > 100 && ((v = i.older.length - 100), (y = new $8(this, l, v)), l.addChild(y));
              l.setFlair(i.older.length);
              this.activeDom || ((w = this.app.workspace.getActiveFile()) && this.onFileOpen(w));
              this.tree.infinityScroll.queueCompute();
              this.previousRefreshDate = window.moment();
              return [2];
          }
        });
      });
    };
    t.prototype.addItemToGroup = function (sFile, t) {
      var n = this.fileItems[sFile.path];
      n ? (n.sFile = sFile) : (this.fileItems[sFile.path] = n = new J8(this, sFile));
      this.files.set(n.el, sFile);
      t.addChild(n);
    };
    t.prototype.getRecentSyncFiles = function () {
      for (
        var e = this.sync,
          t = this.hideMyChanges,
          n = {
            today: [],
            yesterday: [],
            week: [],
            older: [],
          },
          i = 864e5,
          r = window.moment().startOf("day").valueOf(),
          o = r - i,
          a = r - 5184e5,
          s = 0,
          l = Object.values(e.serverFiles);
        s < l.length;
        s++
      ) {
        var c = l[s];
        if (!(c.folder || c.deleted || c.path.startsWith(configDir))) {
          (!t || (c.user && c.user !== e.userId)) &&
            (c.mtime > r
              ? n.today.push(c)
              : c.mtime > o
                ? n.yesterday.push(c)
                : c.mtime > a
                  ? n.week.push(c)
                  : n.older.push(c));
        }
      }
      n.today.sort(function (e, t) {
        return t.mtime - e.mtime;
      });
      n.yesterday.sort(function (e, t) {
        return t.mtime - e.mtime;
      });
      n.week.sort(function (e, t) {
        return t.mtime - e.mtime;
      });
      n.older.sort(function (e, t) {
        return t.mtime - e.mtime;
      });
      return n;
    };
    t.prototype.loadUsernameMap = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return this.userMapLoaded
                ? [2]
                : (e = this.sync.getStatus()) !== "synced" && e !== "syncing"
                  ? [3, 2]
                  : ((t = this), [4, this.sync.getUsernames()]);
            case 1:
              t.userMap = n.sent();
              this.userMapLoaded = true;
              n.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    return t;
  })(ItemView),
  X8 = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.info = {
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
      delete t.coverEl;
      return t;
    }
    __extends(t, e);
    return t;
  })(w_),
  Q8 = (function (e) {
    function t(tree, n, i) {
      var r = e.call(this) || this;
      r.vChildren = new YF(r);
      r.pusherEl = rN();
      r.tree = tree;
      r.id = n;
      r.setClickable(!0);
      r.setCollapsible(!0);
      r.el.addClass("nav-folder");
      r.selfEl.addClass("nav-folder-title");
      r.innerEl.addClass("nav-folder-title-content");
      r.childrenEl.addClass("nav-folder-children");
      r.innerEl.setText(i);
      r.flairEl = r.selfEl.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      r.collapseEl.empty();
      return r;
    }
    __extends(t, e);
    t.prototype.clear = function () {
      this.vChildren.clear();
      this.setFlair(0);
    };
    t.prototype.addChild = function (e) {
      this.vChildren.addChild(e);
    };
    t.prototype.onSelfClick = function () {
      this.toggleCollapsed(!0);
    };
    t.prototype.setFlair = function (count) {
      this.flairEl.setText(
        i18nProxy.nouns.count({
          count: count,
        }),
      );
    };
    t.prototype.setCollapsed = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, e.prototype.setCollapsed.call(this, t, n)];
            case 1:
              i.sent();
              this.tree.infinityScroll.invalidate(this);
              this.tree.requestSaveFolds();
              return [2];
          }
        });
      });
    };
    return t;
  })(k_(X8)),
  $8 = (function (e) {
    function t(t, parent, count) {
      var r = e.call(this) || this;
      r.parent = parent;
      r.count = count;
      r.setClickable(!1);
      r.el.addClass("nav-file");
      r.selfEl.addClass("more-button");
      r.innerEl.addClass("nav-file-title-content");
      r.innerEl.setText(
        Y8.labelMore({
          count: count,
        }),
      );
      return r;
    }
    __extends(t, e);
    return t;
  })(X8),
  J8 = (function (e) {
    function t(view, sFile) {
      var i = e.call(this) || this;
      i.view = view;
      i.sFile = sFile;
      i.setClickable(!0);
      i.el.addClass("nav-file");
      i.selfEl.addClass("nav-file-title");
      i.innerEl.addClass("nav-file-title-content");
      var textr0 = getExtension(sFile.path);
      MARKDOWN_EXTENSIONS.contains(textr0) ||
        i.selfEl.createDiv({
          cls: "nav-file-tag",
          text: textr0,
        });
      i.innerEl.setText(Qc(sFile.path));
      i.selfEl.setAttr("data-path", i.sFile.path);
      i.selfEl.addEventListener("mouseover", i.onFileMouseover.bind(i));
      i.selfEl.addEventListener("mouseout", i.onFileMouseout.bind(i));
      i.selfEl.addEventListener("contextmenu", i.openFileContextMenu.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      this.view.app.workspace.openLinkText(this.sFile.path, "", Keymap.isModEvent(e));
    };
    t.prototype.openFileContextMenu = function (e) {
      var t = this;
      e.preventDefault();
      var n = this.view.app.metadataCache.getFirstLinkpathDest(this.sFile.path, "");
      if (n) {
        var i = new Menu().addSections(["title", "open", "action", "view", "info", "", "danger"]);
        i.addItem(function (e) {
          return e
            .setSection("view")
            .setTitle(Y8.menuOptViewVersionHistory())
            .setIcon("lucide-history")
            .onClick(function () {
              return t.view.sync.showVersionHistory(t.sFile.path);
            });
        });
        this.view.app.workspace.trigger("file-menu", i, n, "sync-sidebar");
        i.showAtMouseEvent(e);
      }
    };
    t.prototype.onFileMouseover = function (e) {
      if (Mc(e, this.selfEl) && !Nc(e)) {
        var t = window.moment(this.sFile.mtime).format("llll");
        this.sFile.user &&
          this.view.userMap.hasOwnProperty(this.sFile.user) &&
          (t += "\n" + this.view.userMap[this.sFile.user]);
        displayTooltip(this.selfEl, t, {
          placement: this.view.getSideTooltipPlacement(),
          gap: 24,
          horizontalParent: this.view.containerEl,
          delay: DEFAULT_TOOLTIP_DELAY,
        });
      }
    };
    t.prototype.onFileMouseout = function (e) {
      if (Mc(e, this.selfEl)) {
        hideTooltip();
      }
    };
    return t;
  })(X8),
  e7 = (function () {
    function e(e, t, n, i) {
      this.min = e || 0;
      this.max = t || Number.MAX_VALUE;
      this.base = n || 1e3;
      this.jitter = i || !0;
      this.count = 0;
      this.nextTs = Date.now();
    }
    e.prototype.success = function () {
      this.count = 0;
      this.nextTs = Date.now() + this.getTimeout();
    };
    e.prototype.fail = function () {
      this.count++;
      this.nextTs = Date.now() + this.getTimeout();
    };
    e.prototype.getTimeout = function () {
      if (this.count === 0) return this.min;
      var e = this.count - 1,
        t = this.base * Math.pow(2, e);
      if (this.jitter) {
        t *= 0.5 + 0.5 * Math.random();
      }
      return (t = Math.floor(Math.min(this.max, this.min + t)));
    };
    e.prototype.getNextTs = function () {
      return this.nextTs;
    };
    e.prototype.isReady = function () {
      return Date.now() > this.nextTs;
    };
    return e;
  })(),
  t7 = i18nProxy.plugins.sync,
  n7 = {
    1e3: "Disconnected",
    1001: "Going Away",
    1002: "Protocol Error",
    1003: "Unsupported Data",
    1004: "(For future)",
    1005: "No Status Received",
    1006: "Disconnected",
    1007: "Invalid frame payload data",
    1008: "Policy Violation",
    1009: "Message too big",
    1010: "Missing Extension",
    1011: "Internal Error",
    1012: "Service Restart",
    1013: "Try Again Later",
    1014: "Bad Gateway",
    1015: "TLS Handshake",
  },
  i7 = "sync",
  r7 = window.WebSocket,
  o7 = window.URL,
  a7 = Object.getOwnPropertyDescriptor(o7.prototype, "hostname").get,
  s7 = String.prototype.endsWith;