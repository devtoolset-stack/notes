    };
    e.prototype.cleanup = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return (e = this.db)
                ? ((t = e.transaction("backups", "readwrite", {
                    durability: "relaxed",
                  })),
                  (n = t.store.index("ts")),
                  (i = this.options.keepDays),
                  (isNaN(i) || i < 1) && (i = 7),
                  [4, n.openCursor(IDBKeyRange.upperBound(Date.now() - 24 * i * 60 * 60 * 1e3))])
                : [2];
            case 1:
              r = o.sent();
              o.label = 2;
            case 2:
              return r ? [4, r.delete()] : [3, 5];
            case 3:
              o.sent();
              return [4, r.continue()];
            case 4:
              r = o.sent();
              return [3, 2];
            case 5:
              return [4, t.done];
            case 6:
              o.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.openModal = function (e) {
      var t = new V3(this.app, this);
      t.open();
      e && t.switchToPath(e);
    };
    e.prototype.clearData = function () {
      this.db.clear("backups");
      this.tsCache = {};
    };
    e.prototype.getLastVersionByPath = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = this.db.transaction("backups", "readonly");
              return [4, t.store.index("path").openCursor(e, "prev")];
            case 1:
              return [2, (n = i.sent()) ? n.value : null];
          }
        });
      });
    };
    return e;
  })(),
  R3 = (function (e) {
    function t(t, n, instance) {
      var r = e.call(this, t, n) || this;
      r.instance = instance;
      return r;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this.containerEl;
      if ((t.empty(), Platform.supportsIndexedDb)) {
        var n = this.instance.options;
        new Setting(t)
          .setName(F3.optionInterval())
          .setDesc(F3.optionIntervalDescription())
          .addText(function (t) {
            return t.setValue(String(n.intervalMinutes)).onChange(function (t) {
              var intervalMinutes = parseFloat(t);
              if (!isNaN(intervalMinutes) && intervalMinutes >= 0) {
                n.intervalMinutes = intervalMinutes;
                e.plugin.saveData(n);
              }
            });
          });
        new Setting(t)
          .setName(F3.optionKeep())
          .setDesc(F3.optionKeepDescription())
          .addText(function (t) {
            return t.setValue(String(n.keepDays)).onChange(function (t) {
              var keepDays = parseFloat(t);
              if (!isNaN(keepDays) && keepDays >= 1) {
                n.keepDays = keepDays;
                e.plugin.saveData(n);
              }
            });
          });
        new Setting(t)
          .setName(F3.optionOpenHistory())
          .setDesc(F3.optionOpenHistoryDescription())
          .addButton(function (t) {
            return t
              .setButtonText(F3.buttonViewHistory())
              .setCta()
              .onClick(function () {
                e.instance.openModal();
              });
          });
        new Setting(t)
          .setName(F3.optionClear())
          .setDesc(F3.optionClearDescription())
          .addButton(function (t) {
            return t
              .setButtonText(F3.buttonClearHistory())
              .setWarning()
              .onClick(function () {
                new GM(e.app)
                  .setTitle(F3.optionClear())
                  .setContent(
                    createFragment(function (e) {
                      e.createEl("p", {
                        cls: "mod-warning",
                        text: F3.labelClearWarning(),
                      });
                    }),
                  )
                  .addButton("mod-warning", F3.buttonClearHistory(), function () {
                    e.instance.clearData();
                    new Notice(F3.msgClearComplete());
                  })
                  .addCancelButton()
                  .open();
              });
          });
      } else
        new Setting(t)
          .setName(i18nProxy.interface.msgIndexedDbNotSupported())
          .setDesc(i18nProxy.interface.msgIndexedDbIOS());
    };
    return t;
  })(j1),
  B3 = (function (e) {
    function t(t, n, paths, modal) {
      var o = e.call(this, t, n) || this;
      o.paths = [];
      o.modal = null;
      o.paths = paths;
      o.modal = modal;
      return o;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      t.setText(ou(e));
    };
    t.prototype.getSuggestions = function (e) {
      e = e.toLowerCase();
      for (var t = [], n = 0, i = this.paths; n < i.length; n++) {
        var r = i[n];
        if (r.toLowerCase().contains(e)) {
          t.push(r);
        }
      }
      return t.slice(0, 100);
    };
    t.prototype.selectSuggestion = function (e) {
      var t = this.textInputEl;
      this.modal.switchToPath(e);
      t.trigger("input");
      this.close();
    };
    return t;
  })(AbstractInputSuggest),
  V3 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = null;
      i.currentVersion = null;
      i.activeVersionEl = null;
      i.historyListContainerEl = null;
      i.historyListEl = null;
      i.versionListEl = null;
      i.fileContentEl = null;
      i.titleSetting = null;
      i.diffToggle = null;
      i.backButtonEl = null;
      i.textareaEl = null;
      i.diffEl = null;
      i.plugin = plugin;
      i.setTitle(F3.name());
      i.modalEl.addClass("mod-sync-history", "mod-sidebar-layout");
      i.historyListContainerEl = i.contentEl.createDiv("file-recovery-list-container");
      var r = (i.historyListEl = i.historyListContainerEl.createDiv("modal-sidebar file-recovery-list"));
      new Setting(r).setNoInfo().addSearch(function (searchComponent) {
        i.searchComponent = searchComponent;
        searchComponent.setPlaceholder(F3.placeholderChooseFile());
      });
      i.versionListEl = r.createDiv("file-recovery-list-item-container");
      var o = (i.fileContentEl = i.contentEl.createDiv("sync-history-content-container mod-empty"));
      o.createEl("p", {
        cls: "sync-history-content-empty",
        text: F3.labelSelectFile(),
      });
      var a = o.createDiv("sync-history-content");
      i.titleSetting = new Setting(a);
      i.titleSetting.controlEl.createEl("label", {
        text: i18nProxy.plugins.sync.labelShowDiff(),
      });
      i.titleSetting
        .addToggle(function (e) {
          return (i.diffToggle = e.setSmall().setValue(!1));
        })
        .addButton(function (e) {
          e.setButtonText(i18nProxy.interface.labelCopyShort()).onClick(function () {
            vc(i.currentVersion.data);
            new Notice(
              i18nProxy.interface.copied({
                context: "generic",
              }),
            );
          });
        })
        .addButton(function (e) {
          e.setButtonText(i18nProxy.plugins.sync.labelRestoreThisVersion()).onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e, t, n, i, time;
              return __generator(this, function (o) {
                switch (o.label) {
                  case 0:
                    e = this.currentVersion;
                    t = e.data;
                    n = e.path;
                    i = e.ts;
                    time = window.moment(i).fromNow();
                    return [4, this.app.vault.adapter.write(n, t)];
                  case 1:
                    o.sent();
                    return [4, this.plugin.forceAdd(n, t)];
                  case 2:
                    o.sent();
                    new Notice(
                      i18nProxy.plugins.sync.msgRestoredVersion({
                        time: time,
                      }),
                    );
                    this.switchToPath(n);
                    return [2];
                }
              });
            });
          });
        });
      i.textareaEl = a.createEl("textarea", {
        cls: "file-recovery-text",
        attr: {
          spellcheck: !1,
        },
      });
      i.diffEl = a.createDiv("file-recovery-diff");
      Platform.isPhone &&
        (o.detach(),
        (i.backButtonEl = createDiv(
          {
            cls: "modal-setting-back-button",
          },
          function (e) {
            e.createSpan("modal-setting-back-button-icon", function (e) {
              setIcon(e, "lucide-arrow-left");
            });
            e.addEventListener("click", function () {
              Ml(i.contentEl, i.historyListContainerEl, "left", function () {
                var e, t;
                (e = i.backButtonEl) === null || undefined === e || e.detach();
                (t = i.activeVersionEl) === null || undefined === t || t.removeClass("is-active");
                i.activeVersionEl = null;
              });
              restoreScrollPositionsWalk(i.historyListContainerEl);
            });
          },
        )));
      return i;
    }
    __extends(t, e);
    t.prototype.switchToPath = function (e) {
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
          h,
          p = this;
        return __generator(this, function (d) {
          switch (d.label) {
            case 0:
              n = (t = this).versionListEl;
              i = t.fileContentEl;
              r = t.titleSetting;
              o = t.searchComponent.inputEl;
              n.empty();
              o.value = ou(e);
              o.blur();
              r.setName(ru(e));
              a = this.plugin.db;
              s = a.transaction("backups", "readonly");
              return [4, s.store.index("path").getAll(e)];
            case 1:
              for (
                (l = d.sent()).sort(function (e, t) {
                  return t.ts - e.ts;
                }),
                  this.activeVersionEl = null,
                  c = function (e) {
                    var currentVersion = l[e],
                      r = l[e + 1],
                      activeVersionEl = n.createDiv("file-recovery-list-item-header"),
                      a = activeVersionEl.createDiv({
                        cls: "file-recovery-list-item-details",
                        text: window.moment(currentVersion.ts).format("llll"),
                      });
                    a.createDiv("u-small u-muted").setText(Ef(currentVersion.data.length));
                    var s = function () {
                      p.activeVersionEl && p.activeVersionEl.removeClass("is-active");
                      p.activeVersionEl = activeVersionEl;
                      p.activeVersionEl.addClass("is-active");
                      i.removeClass("mod-empty");
                      p.currentVersion = currentVersion;
                      p.openHistory(currentVersion, r);
                    };
                    a.addEventListener("click", s);
                    u.activeVersionEl === null && Platform.hasPhysicalKeyboard && s();
                  },
                  u = this,
                  h = 0;
                h < l.length;
                h++
              )
                c(h);
              return [2];
          }
        });
      });
    };
    t.prototype.openHistory = function (e, t) {
      var n = this,
        i = n.textareaEl,
        r = n.diffEl,
        o = n.diffToggle,
        value = e.data;
      i.value = value;
      i.setAttr("data-ext", getExtension(e.path));
      r.empty();
      var s = false,
        l = function () {
          var e = o.getValue();
          if ((i.toggle(!e), r.toggle(e), e && !s)) {
            s = true;
            var n = "";
            t && (n = t.data);
            r.empty();
            r.appendChild(Zj(n, value));
          }
        };
      o.onChange(l);
      l();
      Platform.isPhone
        ? (saveScrollPositions(this.historyListContainerEl),
          Ml(this.contentEl, this.fileContentEl, "right"),
          this.titleEl.prepend(this.backButtonEl))
        : this.fileContentEl.parentNode || this.contentEl.appendChild(this.fileContentEl);
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t = this;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e = this.contentEl;
              return [
                4,
                withLoadingClass(this.contentEl, function () {
                  return __awaiter(t, undefined, undefined, function () {
                    var t, n, i, r, o, a;
                    return __generator(this, function (s) {
                      switch (s.label) {
                        case 0:
                          t = this.plugin.db;
                          n = t.transaction("backups", "readonly");
                          return [4, n.store.index("path").openCursor(null, "nextunique")];
                        case 1:
                          i = s.sent();
                          r = [];
                          s.label = 2;
                        case 2:
                          return i ? (r.push(i.value.path), [4, i.continue()]) : [3, 4];
                        case 3:
                          i = s.sent();
                          return [3, 2];
                        case 4:
                          r.sort(Eb);
                          return r.length === 0
                            ? (this.titleEl.setText(F3.name()),
                              e.createEl("p", {
                                text: F3.labelNoHistoryFound(),
                              }),
                              [2])
                            : ((o = this.searchComponent.inputEl),
                              (a = new B3(this.app, o, r, this)),
                              setTimeout(function () {
                                if (!o.value) {
                                  o.focus({
                                    preventScroll: !0,
                                  });
                                  a.onInputChange();
                                }
                              }),
                              [2]);
                      }
                    });
                  });
                }),
              ];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal),
  H3 = i18nProxy.plugins.footnotesPane,
  z3 = "footnotes";
var q3 = (function (e) {
    function t(app, filen0, footnoteId, r, footRefPositions) {
      if (undefined === footRefPositions) {
        footRefPositions = [];
      }
      var a = e.call(this) || this;
      a.app = app;
      a.file = filen0;
      a.footnoteId = footnoteId;
      a.footRefPositions = footRefPositions;
      var s = (a.containerEl = createDiv("footnote-list-item")).createDiv("footnote");
      a.idEl = s.createDiv(
        {
          cls: "footnote-id",
          text: String(r + 1),
        },
        function (e) {
          e.toggleClass("mod-no-occurrences", !footRefPositions.length);
        },
      );
      a.contentEl = s.createDiv("footnote-content");
      return a;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.renderEmbed();
    };
    t.prototype.onunload = function () {
      this.containerEl.detach();
    };
    t.prototype.renderEmbed = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, linktext, containerEl, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              t = (e = this).app;
              n = e.file;
              i = e.contentEl;
              r = e.containerEl;
              o = e.footnoteId;
              linktext = "#[^".concat(o, "]");
              containerEl = i.createDiv();
              (l = this.embed =
                this.addChild(
                  new yY(
                    {
                      app: t,
                      linktext: linktext,
                      sourcePath: n.path,
                      containerEl: containerEl,
                      depth: 0,
                    },
                    n,
                    linktext,
                  ),
                )).editable = true;
              r.addEventListener("click", function (e) {
                if (!l.editorEl.isShown()) {
                  var t = function (e) {
                    r.toggleClass("is-editing", e);
                  };
                  t(!0);
                  l.showEditor(Ll(e));
                  l.editMode.register(function () {
                    return t(!1);
                  });
                  l.editMode.registerDomEvent(r.win, "click", function (e) {
                    if (!r.contains(e.targetNode)) {
                      t(!1);
                      l.showPreview();
                    }
                  });
                }
              });
              return [4, l.loadFile()];
            case 1:
              c.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.update = function (e, footRefPositions) {
      if (undefined === footRefPositions) {
        footRefPositions = [];
      }
      var n = this.idEl;
      this.footRefPositions = footRefPositions;
      n.toggleClass("mod-no-occurrences", !footRefPositions.length);
      var i = String(e + 1);
      if (n.textContent !== i) {
        n.empty();
        n.setText(i);
      }
    };
    t.prototype.onResize = function () {
      var e, t;
      if (
        !((t = (e = this.embed) === null || undefined === e ? undefined : e.previewMode) === null || undefined === t)
      ) {
        t.renderer.onResize();
      }
    };
    return t;
  })(Component),
  W3 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-file-signature";
      n.hoverPopover = null;
      n.cache = new Map();
      var i = (n.listWrapperEl = n.contentEl.createDiv("footnotes-view"));
      n.listEl = i.createDiv("footnotes-list", function (e) {
        return e.hide();
      });
      n.emptyEl = i.createDiv(
        {
          cls: "pane-empty",
          text: H3.labelNoFootnotes(),
        },
        function (e) {
          return e.hide();
        },
      );
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.registerEvent(this.app.metadataCache.on("resolve", this.onCacheUpdate, this));
      this.requestUpdate();
    };
    t.prototype.onunload = function () {
      this.cache.clear();
    };
    t.prototype.getDisplayText = function () {
      return H3.shortName();
    };
    t.prototype.getViewType = function () {
      return z3;
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.onResize = function () {
      for (var e = 0, t = Array.from(this.cache.values()); e < t.length; e++) {
        t[e].onResize();
      }
    };
    t.prototype.onCacheUpdate = function (e) {
      if (e === this.file) {
        this.update();
      }
    };
    t.prototype.clearCache = function () {
      for (var e = this.cache, t = 0, n = Array.from(e.values()); t < n.length; t++) {
        var i = n[t];
        this.removeChild(i);
      }
      e.clear();
    };
    t.prototype.cleanCache = function (e) {
      for (
        var t = this.cache,
          n = new Set(
            e.map(function (e) {
              return e.id;
            }),
          ),
          i = 0,
          r = Array.from(t.keys());
        i < r.length;
        i++
      ) {
        var o = r[i];
        if (!n.has(o)) {
          var a = t.get(o);
          t.delete(o);
          a.containerEl.detach();
          this.removeChild(a);
        }
      }
    };
    t.prototype.renderFootnote = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o, a, s, l, c, u, h, p, d;
        return __generator(this, function (f) {
          switch (f.label) {
            case 0:
              r = (i = this).app;
              o = i.cache;
              a = i.file;
              return [4, r.vault.cachedRead(a)];
            case 1:
              if (
                ((s = f.sent()),
                (l = r.metadataCache.getFileCache(a)),
                (c = n == null ? undefined : n[e.id]),
                o.has(e.id))
              ) {
                if (
                  ((u = o.get(e.id)),
                  (h = resolveSubpath(l, "#[^".concat(e.id, "]"))) &&
                    ((p = extractSubpathContent(s, l, h).content), u.embed.text === p))
                ) {
                  u.update(t, c);
                  return [2, u];
                }
                u.containerEl.detach();
                o.delete(e.id);
                this.removeChild(u);
              }
              d = this.addChild(new q3(r, a, e.id, t, c));
              o.set(e.id, d);
              return [2, d];
          }
        });
      });
    };
    t.prototype.update = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l, c, u, h, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              if (
                ((t = (e = this).cache),
                (n = e.app),
                (i = e.file),
                (r = e.listEl),
                (o = e.emptyEl),
                (a = i ? n.metadataCache.getFileCache(i) : null),
                (s = !!((m = a == null ? undefined : a.footnotes) === null || undefined === m ? undefined : m.length)),
                r.toggle(s),
                o.toggle(!s),
                !s)
              ) {
                this.clearCache();
                return [2];
              }
              for (l = 0, c = Array.from(t.values()); l < c.length; l++) if (c[l].embed.editMode) return [2];
              u = (function (e) {
                var t,
                  n,
                  i = {};
                if ((t = e.footnoteRefs) === null || undefined === t ? undefined : t.length)
                  for (var r = 0, o = e.footnoteRefs; r < o.length; r++) {
                    var a = o[r];
                    (c = i[a.id]) || (c = i[a.id] = []);
                    c.push(a.position);
                  }
                if ((n = e.footnotes) === null || undefined === n ? undefined : n.length)
                  for (var s = 0, l = e.footnotes; s < l.length; s++) {
                    var c,
                      u = l[s];
                    if (u.id.startsWith(eC)) {
                      (c = i[u.id]) || (c = i[u.id] = []);
                      c.push(u.position);
                    }
                  }
                return i;
              })(a);
              h = (function (e, t) {
                var n = e.footnotes.slice();
                n.sort(function (e, n) {
                  var i = t[e.id],
                    r = t[n.id];
                  return i && i.length !== 0 ? (r && r.length !== 0 ? i[0].start.offset - r[0].start.offset : -1) : 1;
                });
                return n;
              })(a, u);
              p = [];
              d = 0;
              g.label = 1;
            case 1:
              return d < h.length ? [4, this.renderFootnote(h[d], d, u)] : [3, 4];
            case 2:
              f = g.sent().containerEl;
              p.push(f);
              g.label = 3;
            case 3:
              d++;
              return [3, 1];
            case 4:
              r.setChildrenInPlace(p);
              this.cleanCache(h);
              return [2];
          }
        });
      });
    };
    return t;
  })(DJ),
  U3 = (function () {
    function e() {
      this.id = "footnotes";
      this.name = H3.name();
      this.description = H3.desc();
      this.defaultOn = false;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerViewType(z3, function (e) {
        return new W3(e);
      });
      plugin.registerGlobalCommand({
        id: "footnotes:open",
        name: H3.actionShow(),
        icon: "lucide-file-signature",
        callback: function () {
          n.app.workspace.ensureSideLeaf(z3, "right", {
            active: !0,
          });
        },
      });
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(z3, "right", {
        reveal: !1,
      });
    };
    return e;
  })(),
  _3 = i18nProxy.plugins.markdownFormatImporter,
  j3 = (function () {
    function e() {
      this.id = "markdown-importer";
      this.name = _3.name();
      this.description = _3.desc();
    }
    e.prototype.init = function (app, t) {
      this.app = app;
      t.registerRibbonItem(_3.actionOpen(), "lucide-binary", this.onOpen.bind(this));
      t.registerGlobalCommand({
        id: "markdown-importer:open",
        name: _3.actionOpen(),
        icon: "lucide-download",
        callback: this.onOpen.bind(this),
      });
    };
    e.prototype.onOpen = function () {
      new $3(this.app).open();
      return !1;
    };
    return e;
  })(),
  G3 = /\^\^(\S(.*?\S)?)\^\^/g,
  K3 = /::(\S(.*?\S)?)::/g,
  Y3 = /\[\[(\d+?)\]\]/g,
  Z3 = /(^|\s)\#([^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]+)/g,
  X3 = /\B\#(\[\[[\w \t]*?\]\])/g,
  Q3 = /\{\{\[\[(TODO|DONE)\]\]\}\}/g,
  $3 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.converters = [];
      var i = n.contentEl,
        r = n.converters;
      n.titleEl.setText(_3.name());
      for (
        var o = (n.conversionsEl = i.createDiv()),
          a = [
            {
              name: _3.optionRoamTagFixer(),
              description: _3.optionRoamTagFixerDescription(),
              convert: function (e, t, n, i) {
                n = n.replace(Z3, function (e, t, n) {
                  for (var r = true, o = 0; o < n.length; o++) {
                    var a = n.charCodeAt(o);
                    if (a < 48 || a > 57) {
                      r = false;
                      break;
                    }
                  }
                  return r ? e : (i.replaced++, t + "[[" + n + "]]");
                });
                return n.replace(X3, function (e, t) {
                  i.replaced++;
                  return t;
                });
              },
            },
            {
              name: _3.optionRoamHighlightFixer(),
              description: _3.optionRoamHighlightFixerDescription(),
              convert: function (e, t, n, i) {
                return n.replace(G3, function (e, t) {
                  i.replaced++;
                  return "==" + t + "==";
                });
              },
            },
            {
              name: _3.optionRoamTodoConverter(),
              description: _3.optionRoamTodoConverterDescription(yamlInterpolation),
              convert: function (e, t, n, i) {
                return n.replace(Q3, function (e, t) {
                  i.replaced++;
                  return t === "TODO" ? "[ ]" : "[x]";
                });
              },
            },
            {
              name: _3.optionBearHighlightFixer(),
              description: _3.optionBearHighlightFixerDescription(),
              convert: function (e, t, n, i) {
                return n.replace(K3, function (e, t) {
                  i.replaced++;
                  return "==" + t + "==";
                });
              },
            },
            {
              name: _3.zettelkastenLinkFixer(),
              description: _3.zettelkastenLinkFixerDescription(),
              convert: function (e, t, n, i) {
                return n.replace(Y3, function (n, r) {
                  for (var o = 0, a = e.vault.getAllLoadedFiles(); o < a.length; o++) {
                    var s = a[o];
                    if (s instanceof TFile && s.basename.contains(r)) {
                      i.replaced++;
                      return "[[" + e.metadataCache.fileToLinktext(s, t.path) + "]]";
                    }
                  }
                  return n;
                });
              },
            },
            {
              name: _3.zettelkastenLinkBeautifier(),
              description: _3.zettelkastenLinkBeautifierDescription(),
              convert: function (e, t, n, i) {
                return n.replace(Y3, function (n, r) {
                  for (var o = 0, a = e.vault.getAllLoadedFiles(); o < a.length; o++) {
                    var s = a[o];
                    if (s instanceof TFile && s.basename.contains(r)) {
                      i.replaced++;
                      return (
                        "[[" + e.metadataCache.fileToLinktext(s, t.path) + "|" + s.basename.replace(r, "").trim() + "]]"
                      );
                    }
                  }
                  return n;
                });
              },
            },
            {
              name: _3.frontmatterMigration(),
              description: _3.frontmatterMigrationDescription(),
              convert: function (e, t, n, i) {
                var r = false,
                  o = mx(n, function (e) {
                    var t = KO(e, "aliases");
                    if (!Object.hasOwn(e, t))
                      for (var n in e)
                        if (Object.hasOwn(e, n) && n.toLowerCase() === "alias") {
                          dc(e, n, t);
                          r = true;
                          break;
                        }
                    if (Object.hasOwn(e, t)) {
                      var i = e[t];
                      if (String.isString(i)) {
                        e[t] = i
                          .split(/[,\n]/)
                          .map(function (e) {
                            return e.trim();
                          })
                          .filter(function (e) {
                            return !!e;
                          });
                        r = true;
                      }
                    }
                    var o = KO(e, "tags");
                    if (!Object.hasOwn(e, o))
                      for (var n in e)
                        if (Object.hasOwn(e, n) && n.toLowerCase() === "tag") {
                          dc(e, n, o);
                          r = true;
                          break;
                        }
                    if (Object.hasOwn(e, o)) {
                      var a = e[o];
                      if (String.isString(a)) {
                        e[o] = a.split(/[ ,\n]/).filter(function (e) {
                          return !!e;
                        });
                        r = true;
                      }
                    }
                    var s = KO(e, "cssclasses");
                    if (!Object.hasOwn(e, s))
                      for (var n in e)
                        if (Object.hasOwn(e, n) && n.toLowerCase() === "cssclass") {
                          dc(e, n, s);
                          r = true;
                          break;
                        }
                    if (Object.hasOwn(e, s)) {
                      var l = e[s];
                      if (String.isString(l)) {
                        e[s] = l.split(/[ ,\n]/).filter(function (e) {
                          return !!e;
                        });
                        r = true;
                      }
                    }
                  });
                return r ? o : n;
              },
            },
          ],
          s = function (conversion) {
            new Setting(o)
              .setName(conversion.name)
              .setDesc(conversion.description)
              .addToggle(function (toggle) {
                toggle.setValue(!1);
                r.push({
                  toggle: toggle,
                  conversion: conversion,
                });
              });
          },
          l = 0,
          c = a;
        l < c.length;
        l++
      ) {
        s(c[l]);
      }
      o.createEl("p", {
        cls: "setting-message mod-warning",
        text: _3.msgAllFilesWarning(),
      });
      o.createEl("p", {
        cls: "setting-message mod-warning",
        text: _3.msgOverrideFilesWarning(),
      });
      o.createDiv("modal-button-container")
        .createEl("button", {
          cls: "mod-cta",
          text: _3.labelStartConversion(),
        })
        .addEventListener("click", n.onProcess.bind(n));
      var u = (n.resultEl = createDiv());
      n.statusEl = u.createEl("p", "u-center-text");
      n.processedEl = u.createDiv("changelog-item mod-success");
      n.modifiedEl = u.createDiv("changelog-item mod-highlighted");
      n.replacedEl = u.createDiv("changelog-item mod-highlighted");
      n.failedEl = u.createDiv("changelog-item mod-failed");
      n.renderStats({
        processed: 0,
        modified: 0,
        replaced: 0,
        failed: 0,
      });
      var h = u.createDiv("modal-button-container");
      (n.cancelEl = h.createEl("button", {
        cls: "mod-warning",
        text: _3.labelStop(),
      })).addEventListener("click", n.onCancel.bind(n));
      (n.goBackEl = h.createEl("button", {
        cls: "",
        text: _3.labelGoBack(),
      })).addEventListener("click", n.onGoBack.bind(n));
      (n.doneEl = h.createEl("button", {
        cls: "mod-cta",
        text: _3.labelDone(),
      })).addEventListener("click", n.close.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.onProcess = function () {
      for (var e = this, t = [], n = 0, i = this.converters; n < i.length; n++) {
        var r = i[n];
        if (r.toggle.getValue()) {
          t.push(r.conversion);
        }
      }
      if (t.length !== 0) {
        this.runnable = new ax({
          onCancel: function () {
            e.cancelEl.hide();
            e.statusEl.setText(_3.labelCancelling());
          },
        });
        this.conversionsEl.detach();
        this.contentEl.append(this.resultEl);
        this.cancelEl.show();
        this.goBackEl.hide();
        this.doneEl.hide();
        this.statusEl.setText(_3.labelProcessing());
        this.process(t);
      }
    };
    t.prototype.onCancel = function () {
      var e = this.runnable;
      if (e) {
        e.cancel();
      }
    };
    t.prototype.onGoBack = function () {
      this.resultEl.detach();
      this.contentEl.append(this.conversionsEl);
      for (var e = 0, t = this.converters; e < t.length; e++) {
        t[e].toggle.setValue(!1);
      }
    };
    t.prototype.onFinish = function (e) {
      this.renderStats(e);
      this.cancelEl.hide();
      this.goBackEl.show();
      this.statusEl.setText(_3.labelFinished());
      this.doneEl.show();
    };
    t.prototype.renderStats = function (e) {
      this.processedEl.setText(_3.labelProcessedFiles());
      this.processedEl.setAttribute("data-label", e.processed.toString());
      this.modifiedEl.setText(_3.labelModifiedFiles());
      this.modifiedEl.setAttribute("data-label", e.modified.toString());
      this.replacedEl.setText(_3.labelTotalReplacements());
      this.replacedEl.setAttribute("data-label", e.replaced.toString());
      this.failedEl.toggle(e.failed > 0);
      this.failedEl.setText(_3.labelFailed());
      this.failedEl.setAttribute("data-label", e.failed.toString());
    };
    t.prototype.onClose = function () {
      this.onCancel();
      this.onGoBack();
    };
    t.prototype.process = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c, u, h, error, d, f, m, g;
        return __generator(this, function (v) {
          switch (v.label) {
            case 0:
              n = (t = this).app;
              i = t.runnable;
              r = {
                processed: 0,
                modified: 0,
                replaced: 0,
                failed: 0,
              };
              o = n.vault.getMarkdownFiles();
              a = [];
              v.label = 1;
            case 1:
              v.trys.push([1, 7, 8, 13]);
              s = function () {
                var filet0, o;
                return __generator(this, function (s) {
                  switch (s.label) {
                    case 0:
                      if (((g = h.value), (c = false), (filet0 = g), i.isCancelled())) {
                        l.onFinish(r);
                        return [2, "break"];
                      }
                      s.label = 1;
                    case 1:
                      s.trys.push([1, 3, , 4]);
                      return [
                        4,
                        n.vault.process(
                          filet0,
                          function (content) {
                            for (var o = content, s = 0, l = e; s < l.length; s++) {
                              o = l[s].convert(n, filet0, o, r);
                            }
                            o !== content &&
                              (r.modified++,
                              a.push({
                                file: filet0,
                                mtime: filet0.stat.mtime,
                                content: content,
                              }));
                            return o;
                          },
                          {
                            mtime: filet0.stat.mtime + 1,
                          },
                        ),
                      ];
                    case 2:
                      s.sent();
                      return [3, 4];
                    case 3:
                      o = s.sent();
                      r.failed++;
                      console.error(o);
                      return [3, 4];
                    case 4:
                      r.processed++;
                      return i.isCancelled()
                        ? (l.onFinish(r), l.app.fileManager.notifyForBulkUndo(a), [2, "break"])
                        : (l.renderStats(r), r.processed % 10 != 0 ? [3, 6] : [4, sleep(0)]);
                    case 5:
                      s.sent();
                      s.label = 6;
                    case 6:
                      return [2];
                  }
                });
              };
              l = this;
              c = true;
              u = __asyncValues(lx(o));
              v.label = 2;
            case 2:
              return [4, u.next()];
            case 3:
              h = v.sent();
              return (d = h.done) ? [3, 6] : [5, s()];
            case 4:
              if (v.sent() === "break") return [3, 6];
              v.label = 5;
            case 5:
              c = true;
              return [3, 2];
            case 6:
              return [3, 13];
            case 7:
              error = v.sent();
              f = {
                error: error,
              };
              return [3, 13];
            case 8:
              v.trys.push([8, , 11, 12]);
              return c || d || !(m = u.return) ? [3, 10] : [4, m.call(u)];
            case 9:
              v.sent();
              v.label = 10;
            case 10:
              return [3, 12];
            case 11:
              if (f) throw f.error;
              return [7];
            case 12:
              return [7];
            case 13:
              this.onFinish(r);
              this.app.fileManager.notifyForBulkUndo(a);
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal),
  J3 = i18nProxy.plugins.noteComposer,
  e5 = (function () {
    function e() {
      this.id = "note-composer";
      this.name = J3.name();
      this.description = J3.desc();
      this.defaultOn = true;
      this.options = {};
      this.app = null;
      this.pluginInstance = null;
    }
    e.prototype.init = function (app, pluginInstance) {
      var n = this;
      this.app = app;
      this.pluginInstance = pluginInstance;
      pluginInstance.registerGlobalCommand({
        id: "note-composer:merge-file",
        name: J3.commandMergeFile(),
        icon: "lucide-git-merge",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveFile();
          if (t && t.extension === "md") {
            if (!e) {
              var i = new t5(n.app, n);
              i.setCurrentFile(t);
              i.open();
            }
            return !0;
          }
        },
      });
      pluginInstance.registerGlobalCommand({
        id: "note-composer:split-file",
        name: J3.commandSplitFile(),
        icon: "lucide-scissors",
        editorCheckCallback: function (e, t, i) {
          if (i.file && t.somethingSelected()) {
            if (!e) {
              var r = new n5(n.app, t, n);
              r.setCurrentFile(i.file);
              r.open();
            }
            return !0;
          }
        },
      });
      pluginInstance.registerGlobalCommand({
        id: "note-composer:extract-heading",
        name: J3.commandExtractHeading(),
        icon: "lucide-scissors",
        editorCheckCallback: function (e, t, i) {
          if (i.file) {
            var r = t.getCursor().line;
            return extractMarkdownTitle(t.getLine(r)) !== null ? (e || n.extractHeading(i.file, t), !0) : undefined;
          }
        },
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              n = this;
              return [4, t.loadData()];
            case 1:
              n.options = i.sent() || {
                askBeforeMerging: !0,
              };
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              t.registerEvent(e.workspace.on("editor-menu", this.onEditorMenu, this));
              t.addSettingTab(new i5(e, t, this));
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
              return [4, this.pluginInstance.loadData()];
            case 1:
              e.options = t.sent() || {};
              return [2];
          }
        });
      });
    };
    e.prototype.onFileMenu = function (e, t, n) {
      var i = this;
      if (n !== "link-context-menu" && t instanceof TFile && t.extension === "md") {
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(J3.actionMergeFile())
            .setIcon("lucide-git-merge")
            .onClick(function () {
              var e = new t5(i.app, i);
              e.setCurrentFile(t);
              e.open();
            });
        });
      }
    };
    e.prototype.onEditorMenu = function (e, t, n) {
      var i = this,
        r = n.file;
      if (r) {
        if (t.getSelection().trim()) {
          e.addItem(function (e) {
            return e
              .setTitle(J3.commandSplitFile())
              .setIcon("lucide-git-branch-plus")
              .setSection("selection")
              .onClick(function () {
                var e = new n5(i.app, t, i);
                e.setCurrentFile(r);
                e.open();
              });
          });
        }
        var o = t.getCursor().line;
        if (extractMarkdownTitle(t.getLine(o)) !== null) {
          e.addItem(function (e) {
            return e
              .setTitle(J3.commandExtractHeading())
              .setIcon("lucide-git-branch-plus")
              .onClick(function () {
                return i.extractHeading(r, t);
              });
          });
        }
      }
    };
    e.prototype.extractHeading = function (e, t) {
      var n = t.getCursor().line,
        i = this.getSelectionUnderHeading(e, t, n);
      if (i) {
        var r = i.heading,
          o = i.start,
          a = i.end;
        t.setSelection(o, a);
        var s = new n5(this.app, t, this, r);
        s.setCurrentFile(e);
        s.open();
      } else new Notice(J3.msgFailToFindHeading());
    };
    e.prototype.getSelectionUnderHeading = function (e, t, n) {
      var i = this.app.metadataCache.getFileCache(e);
      if (!i) return null;
      var r = i.headings;
      if (!r || r.length === 0) return null;
      for (var o, a = 0, s = null, l = null, c = 0, u = r; c < u.length; c++) {
        var h = u[c];
        if (s && h.level <= a) {
          l = h;
          break;
        }
        if (!(s || h.position.start.line !== n)) {
          a = h.level;
          s = h;
        }
      }
      if (!s) return null;
      if (l) for (o = l.position.start.line - 1; t.getLine(o).trim() === "" && o > n; ) o--;
      else o = t.lineCount() - 1;
      return {
        heading: s.heading.trim(),
        start: xb(n, 0),
        end: xb(o, t.getLine(o).length),
      };
    };
    e.prototype.applyTemplate = function (content, fromTitle, newTitle) {
      return __awaiter(this, undefined, Promise, function () {
        var template, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return (template = this.options.template)
                ? ((r = this.app),
                  (o = r.metadataCache.getFirstLinkpathDest(template, ""))
                    ? [4, r.vault.cachedRead(o)]
                    : (new Notice(
                        J3.msgFailToFetchTemplate({
                          template: template,
                        }),
                      ),
                      [2, content]))
                : [2, content];
            case 1:
              return (a = s.sent())
                ? (a.contains("{{content}}") || (a += "\n\n{{content}}"),
                  [
                    2,
                    j4(a, {
                      fromTitle: fromTitle,
                      newTitle: newTitle,
                      content: content,
                    }),
                  ])
                : [2, content];
          }
        });
      });
    };
    return e;
  })(),
  t5 = (function (e) {
    function t(t, composer) {
      var i = e.call(this, t) || this;
      i.currentFile = null;
      i.emptyStateText = J3.labelNoFiles();
      i.composer = composer;
      i.shouldShowNonImageAttachments = false;
      i.shouldShowImages = false;
      i.shouldShowNonAttachments = false;
      i.setPlaceholder(J3.promptSelectFileToMerge());
      i.setInstructions([
        {
          command: "↑↓",
          purpose: J3.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: J3.instructionMerge(),
        },
        {
          command: isMacOS ? "cmd ↵" : "ctrl ↵",
          purpose: J3.instructionCreateNew(),
        },
        {
          command: "shift ↵",
          purpose: J3.instructionMergeAtTop(),
        },
        {
          command: "esc",
          purpose: J3.instructionDismiss(),
        },
      ]);
      i.scope.register(["Shift"], "Enter", function (e) {
        i.selectActiveSuggestion(e);
        return !1;
      });
      i.scope.register(["Mod"], "Enter", function (e) {
        i.selectActiveSuggestion(e);
        return !1;
      });
      return i;
    }
    __extends(t, e);
    t.prototype.setCurrentFile = function (currentFile) {
      this.currentFile = currentFile;
    };
    t.prototype.onChooseSuggestion = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
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
          m = this;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              if (
                ((n = this.app), (i = this.inputEl.value), !Keymap.isModifier(t, "Mod") && e && e.type !== "unresolved")
              )
                return [3, 5];
              o = i;
              e && e.type === "unresolved" && (o = e.linktext);
              a = n.fileManager.getNewFileParent(this.currentFile.path, o);
              g.label = 1;
            case 1:
              g.trys.push([1, 3, , 4]);
              return [4, n.fileManager.createNewMarkdownFile(a, o)];
            case 2:
              r = g.sent();
              return [3, 4];
            case 3:
              s = g.sent();
              new Notice(s.toString());
              return [2];
            case 4:
              return [3, 6];
            case 5:
              e.type === "bookmark"
                ? e.item.type === "file" && (l = n.vault.getAbstractFileByPath(e.item.path)) instanceof TFile && (r = l)
                : (r = e.file);
              g.label = 6;
            case 6:
              return r && r !== this.currentFile
                ? ((c = this.currentFile),
                  (u = this.composer),
                  (h = false),
                  (p = function () {
                    return __awaiter(m, undefined, undefined, function () {
                      return __generator(this, function (e) {
                        switch (e.label) {
                          case 0:
                            h && ((u.options.askBeforeMerging = false), u.pluginInstance.saveData(u.options));
                            return [4, this.mergeFile(r, c, t.shiftKey ? "prepend" : "append")];
                          case 1:
                            e.sent();
                            return [2];
                        }
                      });
                    });
                  }),
                  u.options.askBeforeMerging
                    ? ((d = document.createDocumentFragment()).createEl("p", {
                        text: J3.labelConfirmFileMerge({
                          file: c.basename,
                          destination: r.basename,
                        }),
                      }),
                      (f = new GM(n).setTitle(J3.labelMergeFile()).setContent(d)),
                      Platform.isMobile
                        ? f.addButton("mod-warning", i18nProxy.dialogue.buttonDeleteDoNotAskAgain(), function () {
                            return __awaiter(m, undefined, undefined, function () {
                              return __generator(this, function (e) {
                                return [2, p()];
                              });
                            });
                          })
                        : f.addCheckbox(i18nProxy.dialogue.labelDoNotAskAgain(), function (e) {
                            h = e.target.checked;
                          }),
                      f
                        .addButton("mod-warning", J3.buttonMerge(), function () {
                          return p();
                        })
                        .addCancelButton()
                        .open())
                    : p(),
                  [2])
                : [2];
          }
        });
      });
    };
    t.prototype.mergeFile = function (e, t) {
      return __awaiter(this, arguments, undefined, function (resolvedFile, t, n) {
        var i,
          r,
          o,
          a,
          s = this;
        undefined === n && (n = "append");
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              i = this.app;
              r = i.fileManager;
              return [4, i.vault.read(t)];
            case 1:
              o = l.sent();
              return [4, this.composer.applyTemplate(o, t.basename, resolvedFile.basename)];
            case 2:
              a = l.sent();
              return [
                4,
                r.runAsyncLinkUpdate(function (i) {
                  return __awaiter(s, undefined, undefined, function () {
                    var o, s, l;
                    return __generator(this, function (c) {
                      switch (c.label) {
                        case 0:
                          return [4, r.insertIntoFile(resolvedFile, a, n)];
                        case 1:
                          c.sent();
                          return [4, r.trashFile(t)];
                        case 2:
                          if ((c.sent(), i))
                            for (o = 0, s = i; o < s.length; o++)
                              if ((l = s[o]).resolvedFile === t) {
                                l.resolvedFile = resolvedFile;
                                l.resolvedPaths = [];
                              }
                          return [2];
                      }
                    });
                  });
                }),
              ];
            case 3:
              l.sent();
              return [4, i.workspace.getLeaf().openFile(resolvedFile)];
            case 4:
              l.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(E2),
  n5 = (function (e) {
    function t(t, editor, composer, defaultValue) {
      var o = e.call(this, t) || this;
      if (
        ((o.defaultValue = ""),
        (o.allowCreateNewFile = true),
        (o.editor = editor),
        (o.composer = composer),
        (o.shouldShowUnresolved = true),
        (o.shouldShowNonImageAttachments = false),
        (o.shouldShowImages = false),
        (o.shouldShowNonAttachments = false),
        !defaultValue)
      ) {
        var a = editor.getSelection().split("\n");
        if (a.length > 0) defaultValue = extractMarkdownTitle(a[0]);
      }
      defaultValue || (defaultValue = "");
      o.defaultValue = defaultValue;
      o.setPlaceholder(J3.promptSelectFileToMerge());
      o.setInstructions([
        {
          command: "↑↓",
          purpose: J3.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: J3.instructionAppend(),
        },
        {
          command: isMacOS ? "cmd ↵" : "ctrl ↵",
          purpose: J3.instructionCreateNew(),
        },
        {
          command: "shift ↵",
          purpose: J3.instructionPrepend(),
        },
        {
          command: "esc",
          purpose: J3.instructionDismiss(),
        },
      ]);
      o.scope.register(["Shift"], "Enter", function (e) {
        o.selectActiveSuggestion(e);
        return !1;
      });
      o.scope.register(["Mod"], "Enter", function (e) {
        o.selectActiveSuggestion(e);
        return !1;
      });
      return o;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      e.prototype.onOpen.call(this);
      this.inputEl.value = this.defaultValue;
      this.updateSuggestions();
    };
    t.prototype.setCurrentFile = function (currentFile) {
      this.currentFile = currentFile;
    };
    t.prototype.onChooseSuggestion = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, c, u;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              n = this.app;
              i = this.editor.getSelection();
              r = Keymap.isModifier(t, "Mod");
              a = this.currentFile;
              h.label = 1;
            case 1:
              h.trys.push([1, 7, , 8]);
              return !r && e
                ? [3, 3]
                : [4, n.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, a.path)];
            case 2:
              o = h.sent();
              return [3, 6];
            case 3:
              return e.type !== "unresolved"
                ? [3, 5]
                : [4, n.fileManager.createNewMarkdownFileFromLinktext(e.linktext, a.path)];
            case 4:
              o = h.sent();
              return [3, 6];
            case 5:
              (e.type !== "file" && e.type !== "alias") || (o = e.file);
              h.label = 6;
            case 6:
              return [3, 8];
            case 7:
              s = h.sent();
              new Notice(s.toString());
              return [2];
            case 8:
              return [4, this.composer.applyTemplate(i, a.basename, o.basename)];
            case 9:
              l = h.sent();
              return [4, n.fileManager.insertIntoFile(o, l, t.shiftKey ? "prepend" : "append")];
            case 10:
              h.sent();
              c = n.fileManager.generateMarkdownLink(o, a.path);
              (u = this.composer.options.replacementText) === "embed"
                ? this.editor.replaceSelection("!" + c)
                : u === "none"
                  ? this.editor.replaceSelection("")
                  : this.editor.replaceSelection(c);
              return [2];
          }
        });
      });
    };
    return t;
  })(E2),
  i5 = (function (e) {
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
        .setName(J3.optionSplitReplacementText())
        .setDesc(J3.optionSplitReplacementTextDescription())
        .addDropdown(function (t) {
          return t
            .addOption("link", J3.optionChoiceSplitReplacementTextLink())
            .addOption("embed", J3.optionChoiceSplitReplacementTextEmbed())
            .addOption("none", J3.optionChoiceSplitReplacementTextNone())
            .setValue(n.replacementText || "link")
            .onChange(function (replacementText) {
              n.replacementText = replacementText;
              e.plugin.saveData(n);
            });
        });
      new Setting(t)
        .setName(J3.optionTemplateFile())
        .setDesc(J3.optionTemplateFileDescription(yamlInterpolation))
        .addText(function (t) {
          t.setPlaceholder(i18nProxy.setting.filePathExamplePlaceholder())
            .setValue(n.template)
            .onChange(function (t) {
              n.template = t.trim();
              e.plugin.saveData(n);
            });
          new yT(e.app, t.inputEl);
        });
      new Setting(t)
        .setName(J3.optionConfirmFileMerge())
        .setDesc(J3.optionConfirmFileMergeDescription())
        .addToggle(function (t) {
          return t.setValue(n.askBeforeMerging).onChange(function (askBeforeMerging) {
            n.askBeforeMerging = askBeforeMerging;
            e.plugin.saveData(n);
          });
        });
    };
    return t;
  })(j1),
  typer50 = "outgoing-link",
  o5 = i18nProxy.plugins.outgoingLinks,
  a5 = (function () {
    function e() {
      this.id = "outgoing-link";
      this.name = o5.name();
      this.description = o5.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerViewType(typer50, function (e) {
        return new s5(e);
      });
      plugin.registerGlobalCommand({
        id: "outgoing-links:open",
        name: o5.actionShow(),
        icon: "lucide-link",
        callback: function () {
          n.app.workspace.ensureSideLeaf(typer50, "right", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "outgoing-links:open-for-current",
        name: o5.actionOpenForCurrent(),
        icon: "lucide-link",
        checkCallback: this.openForCurrentFile.bind(this),
      });
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.onUserDisable = function (e) {
      e.workspace.detachLeavesOfType(typer50);
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(typer50, "right", {
        reveal: !1,
      });
    };
    e.prototype.onFileMenu = function (e, t, n, group) {
      var r = this;
      if (!Platform.isMobile && t instanceof TFile && group && t.extension === "md" && n !== "sidebar-context-menu") {
        e.addItem(function (e) {
          return e
            .setSection("view.linked")
            .setTitle(o5.actionOpen())
            .setIcon("links-going-out")
            .onClick(function () {
              return __awaiter(r, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.app.workspace.splitLeafOrActive(group, "horizontal").setViewState({
                          type: typer50,
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
    e.prototype.openForCurrentFile = function (e) {
      var t = this.app.workspace,
        n = t.getActiveFile();
      if (n) {
        if (!e)
          t.splitActiveLeaf("vertical").setViewState({
            type: typer50,
            active: true,
            group: t.activeLeaf,
            state: {
              file: n.path,
            },
          });
        return !0;
      }
    };
    return e;
  })(),
  s5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "links-going-out";
      var i = n.contentEl.createDiv("outgoing-link-pane");
      n.outgoingLink = n.addChild(new l5(n.app, i));
      n.requestUpdate();
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return !this.file || Platform.isMobile
        ? o5.name()
        : o5("tab-title", {
            displayText: e.prototype.getDisplayText.call(this),
          });
    };
    t.prototype.getViewType = function () {
      return typer50;
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.linksCollapsed = this.outgoingLink.linksCollapsed;
      t.unlinkedCollapsed = this.outgoingLink.unlinkedCollapsed;
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              o.sent();
              i = t.linksCollapsed;
              r = t.unlinkedCollapsed;
              return isBoolean(i) ? [4, this.outgoingLink.setLinksCollapsed(i, !1)] : [3, 3];
            case 2:
              o.sent();
              o.label = 3;
            case 3:
              return isBoolean(r) ? [4, this.outgoingLink.setUnlinkedCollapsed(r, !1)] : [3, 5];
            case 4:
              o.sent();
              o.label = 5;
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.onResize = function () {
      this.outgoingLink.onResize();
    };
    t.prototype.update = function () {
      this.leaf.updateHeader();
      var e = this.outgoingLink;
      e.file = this.file;
      e.tooltipPlacement = this.getSideTooltipPlacement();
      e.update();
    };
    return t;
  })(DJ),
  l5 = (function (e) {
    function t(app, n, i) {
      var r = e.call(this) || this;
      r.showSearch = false;
      r.outgoingFile = null;
      r.linksCollapsed = false;
      r.linksHeaderEl = null;
      r.linksCountEl = null;
      r.linksQueue = null;
      r.unlinkedFile = null;
      r.unlinkedCollapsed = false;
      r.unlinkedHeaderEl = null;
      r.unlinkedCountEl = null;
      r.unlinksQueue = null;
      r.unlinkedDomInfo = new WeakMap();
      r.requestUpdate = debounce(r.update.bind(r), 50);
      r.app = app;
      i = i || n;
      var o = (r.linksHeaderEl = n.createDiv("tree-item-self is-clickable"));
      o.createSpan("tree-item-icon collapse-icon", function (e) {
        setIcon(e, "right-triangle");
      });
      o.createDiv({
        cls: "tree-item-inner",
        text: o5.labelLinks(),
      });
      o.addEventListener("click", r.toggleLinksCollapsed.bind(r));
      r.linksCountEl = o.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      r.outgoingLinkDom = new c5(n.createDiv("search-result-container"));
      r.outgoingLinkInfinityScroller = new aN(i);
      r.outgoingLinkInfinityScroller.rootEl = r.outgoingLinkDom;
      var a = (r.unlinkedHeaderEl = n.createDiv("tree-item-self is-clickable"));
      a.createSpan("tree-item-icon collapse-icon", function (e) {
        setIcon(e, "right-triangle");
      });
      a.createDiv({
        cls: "tree-item-inner",
        text: o5.labelUnlinkedMentions(),
      });
      a.addEventListener("click", r.toggleUnlinkedCollapsed.bind(r));
      r.unlinkedCountEl = a.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      r.unlinkedDom = new pN(app, n.createDiv("search-result-container"), o5.labelUnlinkedMentions(), i);
      r.setUnlinkedCollapsed(!0, !1);
      return r;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this.app,
        t = e.vault;
      this.registerEvent(e.metadataCache.on("resolve", this.onFileResolved, this));
      this.registerEvent(t.on("delete", this.onFileDeleted, this));
    };
    t.prototype.onResize = function () {
      this.outgoingLinkInfinityScroller.onResize();
      this.unlinkedDom.onResize();
    };
    t.prototype.toggleLinksCollapsed = function () {
      this.setLinksCollapsed(!this.linksCollapsed, !0);
    };
    t.prototype.setLinksCollapsed = function (linksCollapsed, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return linksCollapsed === this.linksCollapsed
                ? [2]
                : ((this.linksCollapsed = linksCollapsed),
                  this.updateHeaderTooltip(this.linksHeaderEl, linksCollapsed),
                  [4, toggleElementVisibility(this.outgoingLinkDom.el, linksCollapsed, t)]);
            case 1:
              n.sent();
              linksCollapsed || this.outgoingLinkInfinityScroller.invalidateAll();
              this.update();
              this.app.workspace.requestSaveLayout();
              this.outgoingLinkInfinityScroller.updateVirtualDisplay();
              this.unlinkedDom.infinityScroll.updateVirtualDisplay();
              return [2];
          }
        });
      });
    };
    t.prototype.toggleUnlinkedCollapsed = function () {
      this.setUnlinkedCollapsed(!this.unlinkedCollapsed, !0);
    };
    t.prototype.setUnlinkedCollapsed = function (unlinkedCollapsed, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return unlinkedCollapsed === this.unlinkedCollapsed
                ? [2]
                : ((this.unlinkedCollapsed = unlinkedCollapsed),
                  [4, this.setSectionCollapsed(this.unlinkedHeaderEl, this.unlinkedDom, unlinkedCollapsed, t)]);
            case 1:
              n.sent();
              this.app.workspace.requestSaveLayout();
              this.outgoingLinkInfinityScroller.updateVirtualDisplay();
              this.unlinkedDom.infinityScroll.updateVirtualDisplay();
              return [2];
          }
        });
      });
    };
    t.prototype.updateHeaderTooltip = function (e, t) {
      CO(e, t);
      setTooltip(e, t ? i18nProxy.interface.tooltip.clickToExpand() : i18nProxy.interface.tooltip.clickToCollapse(), {
        placement: this.tooltipPlacement,
      });
    };
    t.prototype.setSectionCollapsed = function (e, t, n, i) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              this.updateHeaderTooltip(e, n);
              return [4, t.toggle(n, i)];
            case 1:
              r.sent();
              this.update();
              return [2];
          }
        });
      });
    };
    t.prototype.onFileResolved = function (e) {
      if (e === this.file) {
        this.outgoingFile = null;
        this.unlinkedFile = null;
        this.update();
      }
    };
    t.prototype.onFileDeleted = function () {
      this.unlinkedFile = null;
      this.requestUpdate();
    };
    t.prototype.update = function () {
      var e = this.file;
      this.outgoingFile !== e && this.recomputeLinks();
      this.unlinkedFile !== e && this.recomputeUnlinked();
      this.updateHeaderTooltip(this.linksHeaderEl, this.linksCollapsed);
      this.updateHeaderTooltip(this.unlinkedHeaderEl, this.unlinkedCollapsed);
    };
    t.prototype.recomputeLinks = function () {
      var e = this,
        t = this.linksQueue;
      t && !t.runnable.isCancelled() && (t.runnable.cancel(), (this.outgoingFile = null));
      this.linksQueue = null;
      var n = this.linksCollapsed,
        i = this.linksCountEl;
      if (n) i.hide();
      else {
        var outgoingFile = this.file;
        this.outgoingFile = outgoingFile;
        var o = this.outgoingLinkDom,
          a = this.outgoingLinkInfinityScroller;
        if ((a.queueCompute(), i.show(), i.setText("0"), outgoingFile && outgoingFile.extension === "md")) {
          var s = this.app.metadataCache,
            l = s.getFileCache(outgoingFile);
          if (l) {
            var c = [];
            if (
              (traverseLinksOrEmbeds(l, function (e) {
                c.push({
                  linktext: e.link,
                  pos: hasPosition(e) ? e.position.start.offset : 0,
                });
              }),
              c.sort(function (e, t) {
                return e.pos - t.pos;
              }),
              c.length !== 0)
            ) {
              for (var u = outgoingFile.path, h = 0, p = 0, d = o.vChildren.children; p < d.length; p++) {
                d[p].invalidated = true;
              }
              var f = function () {
                var e = o.vChildren,
                  t = __spreadArray([], o.vChildren.children, !0);
                t.sort(function (e, t) {
                  return e.pos - t.pos;
                });
                for (var n = 0; n < t.length; n++) {
                  var r = t[n];
                  if (-1 !== h && r.pos > h) break;
                  if (r.invalidated) {
                    t.splice(n, 1);
                    n--;
                  }
                }
                e.setChildren(t);
                a.queueCompute();
                i.setText(String(e.children.length));
              };
              t = this.linksQueue = new sx({
                onStart: function () {},
                onStop: function () {
                  h = -1;
                  f();
                },
                onCancel: function () {
                  e.linksQueue = null;
                },
              });
              var m = new Set();
              t.addList(c);
              var g = cx(t.generator(), {
                batchSize: 20,
                beforePause: function () {
                  f();
                },
              });
              __awaiter(e, undefined, undefined, function () {
                var e, t, n, i, pos, a, l, c, p, d, f, error, y, w, k, C;
                return __generator(this, function (b) {
                  switch (b.label) {
                    case 0:
                      b.trys.push([0, 5, 6, 11]);
                      e = true;
                      t = __asyncValues(g);
                      b.label = 1;
                    case 1:
                      return [4, t.next()];
                    case 2:
                      if (((n = b.sent()), (y = n.done))) return [3, 4];
                      if (
                        ((C = n.value),
                        (e = false),
                        (i = C.linktext),
                        (pos = C.pos),
                        (a = parseLinktext(i)),
                        (l = a.path),
                        (c = a.subpath),
                        (p = s.getFirstLinkpathDest(l, u)) || (l = NX(l)),
                        (d = (p ? p.path : l) + c),
                        m.has(d))
                      )
                        return [3, 3];
                      m.add(d);
                      (f = new u5(this, i, l, c, u, p)).pos = pos;
                      h = pos;
                      o.vChildren.addChild(f);
                      b.label = 3;
                    case 3:
                      e = true;
                      return [3, 1];
                    case 4:
                      return [3, 11];
                    case 5:
                      error = b.sent();
                      w = {
                        error: error,
                      };
                      return [3, 11];
                    case 6:
                      b.trys.push([6, , 9, 10]);
                      return e || y || !(k = t.return) ? [3, 8] : [4, k.call(t)];
                    case 7:
                      b.sent();
                      b.label = 8;
                    case 8:
                      return [3, 10];
                    case 9:
                      if (w) throw w.error;
                      return [7];
                    case 10:
                      return [7];
                    case 11:
                      return [2];
                  }
                });
              });
            } else o.vChildren.clear();
          } else o.vChildren.clear();
        } else o.vChildren.clear();
      }
    };
    t.prototype.recomputeUnlinked = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          unlinkedFile,
          o,
          a,
          s,
          l,
          c,
          u,
          h,
          content,
          d,
          f,
          m,
          g,
          v,
          w,
          C,
          E,
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
          V = this;
        return __generator(this, function (H) {
          switch (H.label) {
            case 0:
              (e = this.unlinksQueue) && !e.runnable.isCancelled() && (e.runnable.cancel(), (this.unlinkedFile = null));
              this.unlinksQueue = null;
              n = (t = this).unlinkedCollapsed;
              i = t.unlinkedCountEl;
              return n
                ? (i.hide(), [2])
                : ((unlinkedFile = this.file),
                  (o = this.unlinkedDom),
                  (s = (a = this).app),
                  (l = a.unlinkedDomInfo),
                  (this.unlinkedFile = unlinkedFile),
                  i.show(),
                  i.setText("0"),
                  unlinkedFile && unlinkedFile.extension === "md"
                    ? ((c = new Map()),
                      (u = function (texte0, t) {
                        texte0 = texte0.toLowerCase();
                        var n = c.get(texte0) || {
                          text: texte0,
                          files: [],
                        };
                        c.set(texte0, n);
                        n.files.contains(t) || n.files.push(t);
                      }),
                      (h = s.metadataCache.getFileCache(unlinkedFile)),
                      [4, s.vault.cachedRead(unlinkedFile)])
                    : (o.emptyResults(), [2]));
            case 1:
              for (content = H.sent(), d = s.vault.getMarkdownFiles(), f = 0, m = d; f < m.length; f++)
                if (
                  (g = m[f]) !== unlinkedFile &&
                  !s.metadataCache.isUserIgnored(g.path) &&
                  (u(g.basename, g),
                  (v = s.metadataCache.getFileCache(g)) && (w = parseFrontMatterAliases(v.frontmatter)))
                )
                  for (C = 0, E = w; C < E.length; C++)
                    if ((M = E[C])) {
                      u(M, g);
                    }
              if (
                ((x = Array.from(c.values()).sort(function (e, t) {
                  return Eb(e.text, t.text);
                })),
                (T = o.getResult(unlinkedFile)))
              ) {
                for (D = T.vChildren, A = __spreadArray([], D.children, !0), P = 0; P < A.length; P++)
                  if ((L = A[P]) instanceof hN) {
                    ((I = l.get(L)) && c.has(I.text)) || (A.splice(P, 1), P--);
                  }
                D.setChildren(A);
                T.content = content;
              } else {
                o.emptyResults();
                T = o.addResult(
                  unlinkedFile,
                  {
                    content: [],
                  },
                  content,
                  !1,
                );
              }
              T.separateMatches = true;
              O = function () {
                T.vChildren.sort(function (e, t) {
                  return Array.isArray(e.matches)
                    ? Array.isArray(t.matches)
                      ? e.matches[0][0] - t.matches[0][0]
                      : 1
                    : -1;
                });
                o.infinityScroll.queueCompute();
                i.setText(String(T.vChildren.size()));
              };
              e = this.unlinksQueue = new sx({
                onStart: function () {},
                onStop: function () {
                  O();
                },
                onCancel: function () {
                  V.linksQueue = null;
                },
              });
              F = 0;
              (N = h == null ? undefined : h.frontmatterPosition) && (F = N.end.offset);
              R = content.toLowerCase();
              e.addList(x);
              B = cx(e.generator(), {
                beforePause: function () {
                  O();
                },
              });
              __awaiter(V, undefined, undefined, function () {
                var e, t, n, i, error, a, s, l, c;
                return __generator(this, function (u) {
                  switch (u.label) {
                    case 0:
                      u.trys.push([0, 5, 6, 11]);
                      e = true;
                      t = __asyncValues(B);
                      u.label = 1;
                    case 1:
                      return [4, t.next()];
                    case 2:
                      if (((n = u.sent()), (a = n.done))) return [3, 4];
                      c = n.value;
                      e = false;
                      i = c;
                      this.processInfo(unlinkedFile, content, R, h, F, T, i);
                      u.label = 3;
                    case 3:
                      e = true;
                      return [3, 1];
                    case 4:
                      return [3, 11];
                    case 5:
                      error = u.sent();
                      s = {
                        error: error,
                      };
                      return [3, 11];
                    case 6:
                      u.trys.push([6, , 9, 10]);
                      return e || a || !(l = t.return) ? [3, 8] : [4, l.call(t)];
                    case 7:
                      u.sent();
                      u.label = 8;
                    case 8:
                      return [3, 10];
                    case 9:
                      if (s) throw s.error;
                      return [7];
                    case 10:
                      return [7];
                    case 11:
                      return [2];
                  }
                });
              }).then();
              return [2];
          }
        });
      });
    };
    t.prototype.processInfo = function (e, t, n, i, r, o, a) {
      for (var s = a.files, l = a.text, c = __spreadArray([], o.vChildren.children, !0), u = 0; u < c.length; u++) {
        var h = c[u];
        if (h instanceof hN) {
          var p = this.unlinkedDomInfo.get(h);
          if (!(p && p.text !== l)) {
            c.splice(u, 1);
            u--;
          }
        }
      }
      o.vChildren.setChildren(c);
      for (
        var d = QO(l),
          f = new RegExp(d, "giy"),
          m = d.startsWith("(?:") ? -1 : 0,
          g = n.indexOf(l, r),
          v = function () {
            f.lastIndex = g + m;
            var r = g,
              c = g + l.length;
            if (((g = n.indexOf(l, c)), !f.test(t))) return "continue";
            if (
              iterateCacheRefs(i, function (e) {
                return e.position.start.offset <= r && e.position.end.offset >= c;
              })
            )
              return "continue";
            var u = [r, c],
              h = y.renderMatch(e, o, s, i, t, u);
            y.unlinkedDomInfo.set(h, a);
            o.vChildren.addChild(h);
          },
          y = this;
        -1 !== g;
      )
        v();
    };
    t.prototype.renderMatch = function (e, t, n, i, r, o) {
      var a = this,
        s = this.app,
        l = Qx(r, o),
        c = l[0],
        u = l[1],
        h = l[2],
        p = l[3],
        d = new hN(t, r, i, c, u, [o]);
      d.onMatchRender = function (r, l) {
        for (
          var c = l.createDiv({
              cls: "search-result-file-match-destination-file-container",
            }),
            u = function (n) {
              var r = c.createDiv({
                cls: "search-result-file-match-destination-file",
              });
              r.createSpan(
                {
                  cls: "search-result-file-match-destination-file-icon",
                },
                function (e) {
                  setIcon(e, "lucide-link");
                },
              );
              r.createSpan({
                cls: "search-result-file-match-destination-file-name",
                text: n.basename,
              });
              var u = n.parent.path !== "/",
                h = o5.tooltipLinkFile();
              u && (h = $c(n.path) + "\n\n" + h);
              setTooltip(r, h);
              r.addEventListener("click", function (r) {
                return __awaiter(a, undefined, undefined, function () {
                  var a, c, u, h, p, d, f;
                  return __generator(this, function (m) {
                    switch (m.label) {
                      case 0:
                        r.preventDefault();
                        l.detach();
                        t.invalidate();
                        a = s.vault;
                        c = o[0];
                        u = o[1];
                        return n ? [4, a.read(e)] : [2];
                      case 1:
                        h = m.sent();
                        p = h.slice(c, u);
                        d = s.fileManager.generateMarkdownLink(n, e.path, "", p);
                        ((f = i.sections) === null || undefined === f
                          ? undefined
                          : f.some(function (e) {
                              return e.type === "table" && e.position.start.offset <= c && e.position.end.offset >= u;
                            })) && (d = d.replace("|", "\\|"));
                        h = h.slice(0, c) + d + h.slice(u);
                        return [4, a.modify(e, h)];
                      case 2:
                        m.sent();
                        return [2];
                    }
                  });
                });
              });
            },
            h = 0,
            p = n;
          h < p.length;
          h++
        ) {
          u(p[h]);
        }
      };
      d.render(h, p);
      return d;
    };
    return t;
  })(Component),
  c5 = function (childrenEl) {
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
    this.vChildren = new YF(this);
    this.pusherEl = rN();
    this.el = childrenEl;
    this.childrenEl = childrenEl;
  },
  u5 = function (hoverParent, linktext, n, i, sourcePath, o) {
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
    this.invalidated = false;
    this.sourcePath = sourcePath;
    var a = hoverParent.app,
      targetEl = (this.el = createDiv("tree-item-self is-clickable outgoing-link-item")),
      l = targetEl.createSpan("tree-item-icon"),
      c = "lucide-link",
      textu0 = n,
      texth0 = "";
    if (o) {
      if (i) {
        var p = resolveSubpath(a.metadataCache.getFileCache(o), i);
        p
          ? p.type === "heading"
            ? ((c = "heading-glyph"), (textu0 = p.current.heading), (texth0 = n))
            : p.type === "block" && ((c = "lucide-layout-list"), (textu0 = p.block.id), (texth0 = n))
          : ((c = "lucide-file-question"), (textu0 = i), (texth0 = n));
      } else {
        c = "lucide-link";
        o.parent.path !== "/" && (texth0 = Zc(o.path));
      }
    } else {
      c = "lucide-file-plus";
      setTooltip(targetEl, o5.tooltipNotCreated());
    }
    setIcon(l, c);
    var d = targetEl.createDiv({
      cls: "tree-item-inner",
    });
    if (
      (d.createDiv({
        cls: "tree-item-inner-text",
        text: textu0,
      }),
      texth0 &&
        d.createDiv({
          cls: "tree-item-inner-subtext",
          text: texth0,
        }),
      targetEl.onClickEvent(function (e) {
        if (!(e.button !== 0 && e.button !== 1)) {
          a.workspace.openLinkText(linktext, sourcePath, Keymap.isModEvent(e));
        }
      }),
      targetEl.addEventListener("contextmenu", function (e) {
        var n = new Menu().addSections(["title", "open", "action", "view", "info", "", "danger"]);
        if (a.workspace.handleLinkContextMenu(n, linktext, sourcePath)) {
          e.preventDefault();
          n.setParentElement(targetEl).showAtMouseEvent(e);
        }
      }),
      targetEl.addEventListener("mouseover", function (event) {
        if (!event.defaultPrevented && Mc(event, targetEl)) {
          event.preventDefault();
          a.workspace.trigger("hover-link", {
            event: event,
            source: "search",
            hoverParent: hoverParent,
            targetEl: targetEl,
            linktext: linktext,
            sourcePath: sourcePath,
          });
        }
      }),
      o)
    ) {
      var f = a.dragManager;
      f.handleDrag(targetEl, function (e) {
        return f.dragFile(e, o);
      });
    }
  },
  typeh50 = "outline";
function p5(e) {
  var t = e.charAt(e.length - 1) === "\n",
    n = e.charAt(e.length - 2) === "\n";
  return t ? (n ? e : e + "\n") : e + "\n\n";
}
var d5 = (function (e) {
    function t(view, tree, heading) {
      var r = e.call(this) || this;
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
      r.vChildren = new YF(r);
      r.view = view;
      r.tree = tree;
      r.heading = heading;
      r.setClickable(!0);
      r.setCollapsible(!1);
      r.headingText = getHeadingDisplayText(r.heading);
      r.innerEl.setText(r.headingText);
      return r;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      var t = this.view,
        n = t.findCorrespondingLeaf(),
        eState = {
          line: this.heading.position.start.line,
        };
      if (n) {
        t.leaf.workspace.setActiveLeaf(n, {
          focus: !0,
        });
        n.view.setEphemeralState(eState);
      } else {
        var r = this.view,
          o = r.app,
          a = r.file;
        (n = o.workspace.getLeaf()).openFile(a, {
          eState: eState,
        });
      }
    };
    t.prototype.updateCollapsed = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              this.collapsed || (i = (n = this.tree).handleCollapseAll) === null || undefined === i || i.call(n, !1);
              return [4, e.prototype.updateCollapsed.call(this, t)];
            case 1:
              r.sent();
              this.tree.infinityScroll.invalidate(this);
              return [2];
          }
        });
      });
    };
    return t;
  })(C_),
  f5 = (function () {
    function e() {
      this.id = "outline";
      this.name = i18nProxy.plugins.outline.name();
      this.description = i18nProxy.plugins.outline.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerViewType(typeh50, function (e) {
        return new m5(e, n);
      });
      plugin.registerGlobalCommand({
        id: "outline:open",
        name: i18nProxy.plugins.outline.actionShow(),
        icon: "lucide-list",
        callback: function () {
          n.app.workspace.ensureSideLeaf(typeh50, "right", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "outline:open-for-current",
        name: i18nProxy.plugins.outline.actionOpenForCurrent(),
        icon: "lucide-list",
        checkCallback: this.openTocForActiveFile.bind(this),
      });
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
      e.workspace.registerHoverLinkSource("outline", {
        display: this.name,
        defaultMod: true,
      });
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(typeh50, "right", {
        reveal: !1,
      });
    };
    e.prototype.onFileMenu = function (e, t, n, group) {
      var r = this;
      if (!Platform.isMobile && t instanceof TFile && t.extension === "md" && group && n !== "sidebar-context-menu") {
        e.addItem(function (e) {
          return e
            .setSection("view.linked")
            .setTitle(i18nProxy.plugins.outline.actionOpen())
            .setIcon("lucide-list")
            .onClick(function () {
              return __awaiter(r, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.app.workspace.splitLeafOrActive(group, "vertical").setViewState({
                          type: typeh50,
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
    e.prototype.openTocForActiveFile = function (e) {
      var t = this.app.workspace,
        n = t.getActiveFile();
      if (n) {
        if (!e)
          t.splitActiveLeaf("vertical").setViewState({
            type: typeh50,
            active: true,
            group: t.activeLeaf,
            state: {
              file: n.path,
            },
          });
        return !0;
      }
    };
    return e;
  })(),
  m5 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.icon = "lucide-list";
      i.activeEl = null;
      i.searchQuery = null;
      i.cachedHeadingDom = [];
      i.isShowingSearch = false;
      i.followCursor = false;
      i.onSelectionChange = debounce(i.handleSelectionChange.bind(i), 20);
      i.plugin = plugin;
      var containerEl = i.contentEl;
      i.scope = new Scope(i.app.scope);
      i.tree = new z0(i, {
        app: i.app,
        containerEl: containerEl,
        id: typeh50,
        scope: i.scope,
        handleCollapseAll: i.handleCollapseAll.bind(i),
      });
      i.tree.isAllCollapsed = false;
      var o = new s0(i.app, i.containerEl);
      i.showSearchButtonEl = o.addNavButton(
        "lucide-search",
        i18nProxy.plugins.backlinks.labelShowSearch(),
        i.onToggleShowSearch.bind(i),
      );
      i.searchComponent = new SearchComponent(o.navHeaderEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(debounce(i.updateSearch.bind(i), 300, !0))
        .then(function (e) {
          setTooltip(e.clearButtonEl, i18nProxy.plugins.search.tooltipClearSearch());
          e.inputEl.addEventListener("keypress", function (e) {
            if (!(e.isComposing || e.key !== "Enter")) {
              Platform.hasPhysicalKeyboard || clearFocusAndSelection();
              i.updateSearch();
            }
          });
          e.containerEl.hide();
        });
      i.followCursorButtonEl = o.addNavButton(
        "lucide-gallery-vertical",
        i18nProxy.plugins.outline.labelFollowCursor(),
        i.onToggleFollowCursor.bind(i),
      );
      i.collapseOrExpandAllEl = o.addNavButton(
        "lucide-chevrons-down-up",
        i18nProxy.plugins.fileExplorer.actionCollapseAll(),
        function () {
          return i.tree.toggleCollapseAll();
        },
      );
      i.emptyEl = i.contentEl.createDiv({
        cls: "pane-empty",
        text: i18nProxy.plugins.outline.labelNoHeadings(),
      });
      i.app.dragManager.handleDrop(containerEl, function (e, t, n) {
        if (t.source === "outline" && t.type === "heading" && t.file === i.file) {
          if (!i.tree.root.vChildren.hasChildren()) return;
          var r = q0(e, i.tree),
            hoverEl = G0(i.tree, r, [], n);
          n ||
            __awaiter(i, undefined, undefined, function () {
              var e, n, i, o, a, s, l, c, u, h, p, d, f, m, g;
              return __generator(this, function (v) {
                switch (v.label) {
                  case 0:
                    if (
                      !(e = this.app.metadataCache.getFileCache(this.file)) ||
                      !e.headings ||
                      !(r == null ? undefined : r.node)
                    )
                      return [2];
                    if (
                      ((n = e.headings),
                      (i = t.heading),
                      (o = n.indexOf(i)),
                      (a = r.node.heading),
                      (s = n.indexOf(a)),
                      -1 === o || -1 === s)
                    )
                      return [2];
                    if ((r.placement === "after" && (s++, (a = n[s])), o === s)) return [2];
                    for (l = o + 1; l < n.length && !(n[l].level <= i.level); l++);
                    c = i.position.start.offset;
                    u = l < n.length ? n[l].position.start.offset : -1;
                    h = a ? a.position.start.offset : -1;
                    p = Math.max(c, u, h) + 1;
                    f = -1 === u ? p : u;
                    return (d = -1 === h ? p : h) >= c && d <= f ? [2] : [4, this.app.vault.read(this.file)];
                  case 1:
                    m = v.sent();
                    -1 === u && (u = m.length);
                    -1 === h && (h = m.length);
                    g = p5(m.substring(c, u));
                    m =
                      h < c
                        ? p5(m.substring(0, h)) + g + m.substring(h, c) + m.substring(u)
                        : m.substring(0, c) + p5(m.substring(u, h)) + g + m.substring(h);
                    return [4, this.app.vault.modify(this.file, m)];
                  case 2:
                    v.sent();
                    return [2];
                }
              });
            });
          return {
            dropEffect: "move",
            hoverEl: hoverEl,
            hoverClass: "is-active",
          };
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.findCorrespondingLeaf = function () {
      var e,
        t = this.leaf,
        n = t.group,
        i = t.workspace;
      if (n) e = i.getGroupLeaves(n);
      else {
        e = [];
        var r = i.getActiveFileView();
        if (r) {
          e.push(r.leaf);
        }
      }
      for (var o = 0, a = e; o < a.length; o++) {
        var s = a[o];
        if (s && s.view instanceof MarkdownView && s.view.file === this.file) return s;
      }
      return null;
    };
    t.prototype.handleCollapseAll = function (isAllCollapsed) {
      this.tree.isAllCollapsed = isAllCollapsed;
      isAllCollapsed
        ? (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-up-down"),
          setTooltip(this.collapseOrExpandAllEl, i18nProxy.plugins.tagPane.actionExpandAll()))
        : (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-down-up"),
          setTooltip(this.collapseOrExpandAllEl, i18nProxy.plugins.tagPane.actionCollapseAll()));
    };
    t.prototype.getDisplayText = function () {
      return !this.file || Platform.isMobile
        ? i18nProxy.plugins.outline.name()
        : i18nProxy.plugins.outline.tabTitle({
            displayText: e.prototype.getDisplayText.call(this),
          });
    };
    t.prototype.getViewType = function () {
      return typeh50;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.followCursor = this.followCursor;
      t.showSearch = this.isShowingSearch;
      t.searchQuery = this.searchComponent.getValue();
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              a.sent();
              i = t.followCursor;
              r = t.searchQuery;
              o = t.showSearch;
              isBoolean(i) && this.setFollowCursor(i);
              isBoolean(o) && this.setShowSearch(o);
              String.isString(r) && (this.searchComponent.setValue(r), this.updateSearch());
              return [2];
          }
        });
      });
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.onload = function () {
      this.registerEvent(this.app.workspace.on("editor-selection-change", this.onSelectionChange));
      this.registerEvent(this.app.workspace.on("markdown-scroll", debounce(this.onMarkdownScroll.bind(this), 20)));
      this.registerEvent(this.app.metadataCache.on("changed", this.onFileChanged, this));
    };
    t.prototype.findActiveHeading = function (e) {
      if (!e) return null;
      var t;
      if (e.getMode() === "preview") {
        var n = e.scroll;
        QF(this.tree.root, function (e) {
          if (n >= e.heading.position.end.line) {
            t = e;
          }
        });
      } else if (e.file) {
        var i = e.editor.listSelections().first(),
          r = pb(this.app, e.file, i.head);
        QF(this.tree.root, function (e) {
          if (e.heading === r) {
            t = e;
            return !0;
          }
        });
      }
      return t;
    };
    t.prototype.setHighlightedItem = function (e) {
      var t;
      if ((e == null ? undefined : e.selfEl) !== this.activeEl) {
        (t = this.activeEl) === null || undefined === t || t.removeClass("is-active");
        this.activeEl = null;
        e &&
          ((this.activeEl = e.selfEl),
          this.activeEl.addClass("is-active"),
          this.followCursor && this.tree.infinityScroll.scrollIntoView(e, 20));
      }
    };
    t.prototype.getOwner = function () {
      var e = this.app.workspace.activeEditor;
      if (e && e.file === this.file && !(e instanceof yY && e.subpath)) return e;
      var t = this.findCorrespondingLeaf();
      return t && t.view instanceof MarkdownView ? t.view : null;
    };
    t.prototype.onMarkdownScroll = function (e) {
      if (e.getMode() === "preview" && e === this.getOwner()) {
        var t = this.findActiveHeading(e);
        this.setHighlightedItem(t);
      }
    };
    t.prototype.onFileChanged = function (e) {
      if (this.app.workspace.layoutReady && e === this.file) {
        this.requestUpdate();
      }
    };
    t.prototype.handleSelectionChange = function (e, t) {
      if (t === this.getOwner() && !((t instanceof MarkdownView && t.dirty) || (t instanceof IK && t.dirty))) {
        var n = this.findActiveHeading(t);
        this.setHighlightedItem(n);
      }
    };
    t.prototype.createItemDom = function (e) {
      var hoverParent = this,
        n = new d5(this, this.tree, e);
      this.app.dragManager.handleDrag(n.selfEl, function (e) {
        hoverParent.app.dragManager.updateSource([n.selfEl], "is-being-dragged");
        setDragText(e.dataTransfer, n.heading.heading);
        return {
          source: "outline",
          type: "heading",
          icon: "heading-glyph",
          title: n.heading.heading,
          heading: n.heading,
          file: hoverParent.file,
        };
      });
      var targetEl = n.selfEl;
      targetEl.addEventListener("mouseover", function (event) {
        if (Mc(event, targetEl) && !Nc(event)) {
          var linktext = hoverParent.file.path + "#" + stripHeadingForLink(e.heading);
          hoverParent.app.workspace.trigger("hover-link", {
            event: event,
            source: "outline",
            hoverParent: hoverParent,
            targetEl: targetEl,
            linktext: linktext,
          });
        }
      });
      return n;
    };
    t.prototype.update = function () {
      var e = this;
      this.file !== this.cachedFile &&
        ((this.activeEl = null), (this.cachedHeadingDom = []), (this.cachedFile = this.file));
      this.tree.root.vChildren.clear();
      var t = this.getHeadings();
      if (t.length > 0) {
        var n = this.cachedHeadingDom;
        this.emptyEl.detach();
        dG(
          n,
          t,
          function (e, heading) {
            var n = e.heading,
              i = n.level === heading.level && n.heading === heading.heading;
            i && ((e.heading = heading), (e.info.computed = false), e.vChildren.hasChildren() && e.vChildren.clear());
            return i;
          },
          function (t) {
            return e.createItemDom(t);
          },
        );
        for (var i = [], r = 0, o = n; r < o.length; r++) {
          for (var a = o[r], s = a.heading, l = i.last(); l && l.heading.level >= s.level; ) {
            i.pop();
            l = i.last();
          }
          i.push(a);
          l ? (l.vChildren.addChild(a), l.setCollapsible(!0)) : this.tree.root.vChildren.addChild(a);
        }
      } else this.contentEl.appendChild(this.emptyEl);
      var c = this.findActiveHeading(this.getOwner());
      this.setHighlightedItem(c);
      this.filterSearchResults();
      this.tree.infinityScroll.queueCompute();
    };
    t.prototype.filterSearchResults = function () {
      var e,
        t = this,
        n = !!((e = this.searchComponent) === null || undefined === e ? undefined : e.getValue());
      QF(this.tree.root, function (e) {
        if (n) {
          var i = t.searchQuery.matchContent(e.heading.heading);
          if (i) {
            e.innerEl.empty();
            renderMatches(e.innerEl, e.headingText, i.content);
            for (var r = e; r; ) {
              r.el.show();
              r = r.parent;
            }
          } else {
            e.innerEl.setText(e.headingText);
            e.el.hide();
          }
        } else {
          e.innerEl.setText(e.headingText);
          e.el.show();
        }
      });
      this.tree.infinityScroll.invalidateAll();
    };
    t.prototype.getHeadings = function () {
      var e = this.file;
      if (!e || e.extension !== "md") return [];
      var t = this.app.metadataCache.getFileCache(e);
      if (!t) return [];
      var n = t.headings;
      return n && n.length !== 0 ? n : [];
    };
    t.prototype.setFollowCursor = function (followCursor) {
      if (followCursor !== this.followCursor) {
        this.followCursor = followCursor;
        this.followCursorButtonEl.toggleClass("is-active", followCursor);
      }
    };
    t.prototype.onToggleFollowCursor = function () {
      if ((this.setFollowCursor(!this.followCursor), this.followCursor)) {
        var e = this.findActiveHeading(this.getOwner());
        if (e) {
          this.tree.infinityScroll.scrollIntoView(e, 20);
        }
      }
      this.app.workspace.requestSaveLayout();
    };
    t.prototype.onToggleShowSearch = function () {
      this.setShowSearch(!this.isShowingSearch);
      this.isShowingSearch && this.searchComponent.inputEl.focus();
    };
    t.prototype.showSearch = function () {
      this.setShowSearch(!0);
      this.searchComponent.inputEl.focus();
    };
    t.prototype.setShowSearch = function (isShowingSearch) {
      if (isShowingSearch !== this.isShowingSearch) {
        this.isShowingSearch = isShowingSearch;
        this.searchComponent.containerEl.toggle(isShowingSearch);
        this.showSearchButtonEl.toggleClass("is-active", isShowingSearch);
        isShowingSearch || (this.searchComponent.setValue(""), this.updateSearch());
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.updateSearch = function () {
      var e = this.searchComponent.getValue(),
        t = this.searchQuery;
      if (!((!t && !e) || (t && t.query === e)))
        try {
          if (e) {
            var searchQuery = new WF(this.app, e, !1);
            searchQuery.matcher ? (this.searchQuery = searchQuery) : (this.searchQuery = null);
          } else this.searchQuery = null;
          this.filterSearchResults();
        } catch (e) {
          console.log(e);
        }
    };
    return t;
  })(DJ),
  g5 = (function () {
    function e() {
      this.id = "page-preview";
      this.name = i18nProxy.plugins.pagePreview.name();
      this.description = i18nProxy.plugins.pagePreview.desc();
      this.defaultOn = true;
      this.overrides = {};
    }
    e.prototype.init = function (app, t) {
      this.app = app;
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t.registerEvent(e.workspace.on("link-hover", this.onLinkHover, this));
              t.registerEvent(e.workspace.on("hover-link", this.onHoverLink, this));
              n = this;
              r = (i = Object).assign;
              o = [{}];
              return [4, t.loadData()];
            case 1:
              n.overrides = r.apply(i, o.concat([s.sent()]));
              t.addSettingTab(new v5(e, t, this));
              a = this.app.loadLocalStorage("page-preview-unfold-properties");
              yY.collapseProperties = !a;
              return [2];
          }
        });
      });
    };
    e.prototype.onHoverLink = function (e) {
      var t = this,
        n = e.event,
        i = e.source,
        r = e.hoverParent,
        o = e.targetEl,
        a = e.linktext,
        s = e.sourcePath,
        l = undefined === s ? "" : s,
        c = e.state;
      if (!Nc(n)) {
        var u = e.event.relatedTarget;
        if (!u || !u.instanceOf(HTMLElement) || u.isShown()) {
          var h = true;
          if (
            (Object.hasOwn(this.overrides, i)
              ? (h = this.overrides[i])
              : this.app.workspace.hoverLinkSources.hasOwnProperty(i) &&
                (h = this.app.workspace.hoverLinkSources[i].defaultMod),
            __(n),
            h && !Keymap.isModifier(n, "Mod"))
          ) {
            if (!o) return;
            var p = n.doc,
              d = false,
              f = function () {
                d = true;
                g.cancel();
                p.removeEventListener("keydown", m);
                p.removeEventListener("mouseover", v);
                p.removeEventListener("mouseleave", y);
                p.removeEventListener("mousemove", g);
                p.removeEventListener("click", f);
              },
              m = function (e) {
                if (!d) {
                  !o || p.body.contains(o)
                    ? e.key.startsWith("Arrow") || e.key.length === 1
                      ? f()
                      : Keymap.isModifier(e, "Mod") && (f(), t.onLinkHover(r, o, a, l, c))
                    : f();
                }
              },
              g = debounce(
                function () {
                  return f();
                },
                2e3,
                !0,
              ),
              v = function (e) {
                if (!(d || o === e.target || o.contains(e.target))) {
                  f();
                }
              },
              y = function (e) {
                if (!d) {
                  e.target === p && f();
                }
              };
            p.addEventListener("keydown", m);
            p.addEventListener("mouseleave", y);
            p.addEventListener("mouseover", v);
            p.addEventListener("mousemove", g);
            return void p.addEventListener("click", f);
          }
          this.onLinkHover(r, o, a, l, c);
        }
      }
    };
    e.prototype.onLinkHover = function (hoverParent, targetEl, linktext, sourcePath, state) {
      return __awaiter(this, undefined, undefined, function () {
        var o,
          a,
          s = this;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              return (o = hoverParent.hoverPopover) &&
                o.state !== PopoverState.Hidden &&
                targetEl &&
                o.targetEl === targetEl
                ? [2]
                : [
                    4,
                    IG.create({
                      app: this.app,
                      hoverParent: hoverParent,
                      targetEl: targetEl,
                      linktext: linktext,
                      sourcePath: sourcePath,
                      state: state,
                    }),
                  ];
            case 1:
              (a = l.sent()) &&
                a.register(function () {
                  s.app.saveLocalStorage("page-preview-unfold-properties", !yY.collapseProperties);
                });
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  v5 = (function (e) {
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
      new Setting(t).setHeading().setName(
        i18nProxy.plugins.pagePreview.labelRequireMod({
          key: modifierDisplayMap.Mod,
        }),
      );
      var n = this.instance.overrides,
        i = this.app.workspace.hoverLinkSources,
        r = function (r) {
          var o = i[r],
            a = n[r];
          Object.hasOwn(n, r) || (a = o.defaultMod);
          new Setting(t).setName(o.display).addToggle(function (t) {
            return t.setValue(a).onChange(function (t) {
              t === o.defaultMod ? delete n[r] : (n[r] = t);
              e.plugin.saveData(n);
            });
          });
        };
      for (var o in i) r(o);
    };
    return t;
  })(j1),
  y5 = i18nProxy.plugins.properties,
  b5 = "all-properties",
  typew50 = "file-properties",
  k5 = [
    ["alphabetical", "alphabeticalReverse"],
    ["frequency", "frequencyReverse"],
  ],
  C5 = {
    alphabetical: y5.labelSortByNameAToZ,
    alphabeticalReverse: y5.labelSortByNameZToA,
    frequency: y5.labelSortByFrequencyHighToLow,
    frequencyReverse: y5.labelSortByFrequencyLowToHigh,
  },
  E5 = (function () {
    function e() {
      this.id = "properties";
      this.name = y5.name();
      this.description = y5.desc();
      this.defaultOn = false;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerStatusBarItem();
      plugin.registerGlobalCommand({
        id: "properties:open",
        name: y5.actionShow(),
        icon: "lucide-archive",
        callback: function () {
          var e = Platform.isMobile ? "left" : "right";
          n.app.workspace.ensureSideLeaf(b5, e, {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "properties:open-local",
        name: y5.actionShowLocal(),
        icon: "lucide-info",
        callback: function () {
          var e = n.app.workspace.getActiveFile();
          n.ensurePropertiesView(e);
        },
      });
      plugin.registerViewType(b5, function (e) {
        return new M5(e);
      });
      plugin.registerViewType(typew50, function (e) {
        return new x5(e, n);
      });
    };
    e.prototype.initLeaf = function () {
      var e = Platform.isMobile ? "left" : "right";
      this.app.workspace.ensureSideLeaf(b5, e, {
        reveal: !1,
      });
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.updateStatusbar = function (count) {
      var t = this.plugin.statusBarEl;
      if (t) {
        t.setText(
          i18nProxy.nouns.propertiesWithCount({
            count: count,
          }),
        );
        t.toggle(count > 0);
      }
    };
    e.prototype.onFileOpen = function (e) {
      var t,
        n = 0;
      if (e) {
        var i = this.app.metadataCache.getFileCache(e);
        if (i) {
          n = Object.keys((t = i.frontmatter) !== null && undefined !== t ? t : {}).length;
        }
      }
      this.updateStatusbar(n);
    };
    e.prototype.onCacheChanged = function (e, t, n) {
      var i;
      if (e === this.app.workspace.getActiveFile()) {
        var r = Object.keys((i = n.frontmatter) !== null && undefined !== i ? i : {}).length;
        this.updateStatusbar(r);
      }
    };
    e.prototype.onEnable = function (e, t) {
      var n = this;
      t.registerEvent(e.workspace.on("file-open", this.onFileOpen, this));
      t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
      t.registerEvent(e.metadataCache.on("changed", this.onCacheChanged, this));
      var i = this.plugin.statusBarEl;
      i &&
        (i.addClass("mod-clickable"),
        i.addEventListener("click", function () {
          var e = n.app.workspace.getActiveFile();
          n.ensurePropertiesView(e);
        }));
      e.workspace.registerHoverLinkSource("properties", {
        display: this.name,
        defaultMod: true,
      });
    };
    e.prototype.onDisable = function (e, t) {
      e.workspace.unregisterHoverLinkSource("properties");
    };
    e.prototype.onFileMenu = function (e, t, n, group) {
      var r = this;
      if (!Platform.isMobile && t instanceof TFile && group && t.extension === "md" && n !== "sidebar-context-menu") {
        e.addItem(function (e) {
          return e
            .setSection("view.linked")
            .setTitle(y5.actionOpenLocal())
            .setIcon("lucide-info")
            .onClick(function () {
              return __awaiter(r, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [
                        4,
                        this.app.workspace.splitLeafOrActive(group, "horizontal").setViewState({
                          type: typew50,
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
    e.prototype.ensurePropertiesView = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              for (n = this.app.workspace.getLeavesOfType(typew50), i = 0, r = n; i < r.length; i++)
                if (
                  !(o = r[i]).pinned ||
                  ((a = o.getViewState().state) === null || undefined === a ? undefined : a.file) === e.path
                ) {
                  t = o;
                  break;
                }
              t || (t = this.app.workspace.getRightLeaf(!1));
              return [4, this.app.workspace.revealLeaf(t)];
            case 1:
              s.sent();
              return [
                4,
                t.setViewState({
                  type: typew50,
                  state: e
                    ? {
                        file: e.path,
                      }
                    : undefined,
                }),
              ];
            case 2:
              s.sent();
              this.app.workspace.setActiveLeaf(t, {
                focus: !0,
              });
              return [2, t.view];
          }
        });
      });
    };
    e.prototype.addProperty = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.ensurePropertiesView(e)];
            case 1:
              t.sent().metadataEditor.addProperty();
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  S5 = (function (e) {
    function t(view) {
      var n = e.call(this) || this;
      n.info = {
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
      n.vChildren = new YF(n);
      n.pusherEl = rN();
      n.view = view;
      n.app = view.app;
      var i = n,
        r = i.selfEl,
        o = i.innerEl;
      n.iconEl = n.selfEl.createDiv({
        cls: "tree-item-icon",
        prepend: true,
      });
      n.titleEl = o.createDiv("tree-item-inner-text");
      n.flairEl = r.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      n.selfEl.addClass("tappable");
      n.selfEl.addEventListener("contextmenu", n.onContextMenu.bind(n));
      n.setClickable(!0);
      n.titleEl.addEventListener("blur", function () {
        n.view.acceptRename(n);
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onContextMenu = function (e) {
      var t,
        n = this;
      if (!e.defaultPrevented) {
        e.preventDefault();
        this.view.tree.setFocusedItem(this, !1);
        var i = this.app.metadataTypeManager,
          r = new Menu().addSections(["action", "action.changeType", "danger"]);
        if (
          (r.setSectionSubmenu("action.changeType", {
            title: i18nProxy.properties.optionPropertyType(),
            icon: "lucide-menu",
          }),
          this.view.tree.selectedDoms.size > 1 && this.view.tree.selectedDoms.has(this))
        ) {
          var o = Array.from(this.view.tree.selectedDoms),
            a = o.every(function (e) {
              var t = e.property.name,
                n = !xM.hasOwnProperty(t),
                r = !!i.getAssignedWidget(t);
              return n && r;
            });
          r.addItem(function (e) {
            return e
              .setSection("danger")
              .setIcon("lucide-circle-slash")
              .setDisabled(!a)
              .setTitle(y5.optUnassignType())
              .onClick(function () {
                for (var e = 0, t = o; e < t.length; e++) {
                  var n = t[e];
                  i.unsetType(n.property.name);
                }
              })
              .setWarning(!0);
          });
        } else {
          for (
            var s = !xM.hasOwnProperty(this.property.name),
              l = i.getTypeInfo(this.property.name).inferred,
              c = !!i.getAssignedWidget(this.property.name),
              u = function (e) {
                if (
                  e.reservedKeys &&
                  !((t = e.reservedKeys) === null || undefined === t ? undefined : t.contains(h.property.name))
                )
                  return "continue";
                r.addItem(function (t) {
                  return t
                    .setTitle(e.name())
                    .setIcon(e.icon)
                    .setSection("action.changeType")
                    .setDisabled(!s)
                    .setChecked(e.type === l.type)
                    .onClick(function () {
                      i.setType(n.property.name, e.type);
                    });
                });
              },
              h = this,
              p = 0,
              d = Object.values(i.registeredTypeWidgets);
            p < d.length;
            p++
          ) {
            u(d[p]);
          }
          r.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(i18nProxy.interface.menu.rename())
              .setIcon("lucide-edit-3")
              .setDisabled(!s)
              .onClick(function () {
                return n.view.startRename(n);
              });
          });
          r.addItem(function (e) {
            return e
              .setSection("danger")
              .setIcon("lucide-circle-slash")
              .setDisabled(!s || !c)
              .setTitle(y5.optUnassignType())
              .onClick(function () {
                i.unsetType(n.property.name);
              })
              .setWarning(!0);
          });
        }
        r.setParentElement(this.el).showAtMouseEvent(e);
      }
    };
    t.prototype.displayError = function (e) {
      var t = this.selfEl;
      displayTooltip(t, e, {
        placement: "bottom",
        classes: ["mod-error"],
      });
      t.win.setTimeout(hideTooltip, 2e3);
    };
    t.prototype.startRename = function () {
      var e = this,
        t = e.app,
        n = e.selfEl,
        i = e.titleEl;
      n.addClass("is-being-renamed");
      i.setAttribute("contenteditable", "true");
      var r = t.vault.getConfig("spellcheck");
      i.setAttribute("spellcheck", String(r));
      focusAndSelectContent(i);
    };
    t.prototype.stopRename = function () {
      var e = this.selfEl,
        t = this.titleEl;
      e.removeClass("is-being-renamed");
      t.removeAttribute("contenteditable");
      t.removeAttribute("spellcheck");
    };
    t.prototype.onSelfClick = function (e) {
      if (!this.view.tree.handleItemSelection(e, this)) {
        var t = this.view.app.internalPlugins.getEnabledPluginById("global-search");
        if (t) {
          var n = Keymap.isModEvent(e),
            i = t.getGlobalSearchQuery(),
            r = '["'.concat(this.property.name, '"]');
          n && i !== ""
            ? i.contains(r)
              ? t.openGlobalSearch(i.replace(r, "").trim())
              : t.openGlobalSearch("".concat(i.trim(), " ").concat(r))
            : t.openGlobalSearch(r);
        }
      }
    };
    t.prototype.updateTitle = function () {
      this.titleEl.setText(this.property.name);
    };
    t.prototype.setProperty = function (propertye0) {
      var t = this.app.metadataTypeManager;
      this.property = propertye0;
      var n = t.getPropertyInfo(propertye0.name).widget,
        i = t.getWidget(n);
      setIcon(this.iconEl, i.icon);
      this.updateTitle();
      this.flairEl.setText(String(propertye0.occurrences));
      return this;
    };
    return t;
  })(w_),
  M5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-archive";
      n.doms = {};
      n.searchQuery = null;
      n.sortOrder = "frequency";
      n.isShowingSearch = false;
      n.propertyBeingRenamed = null;
      n.requestUpdate = debounce(n.update.bind(n), 100);
      var i = n.containerEl;
      n.emptyStateEl = createDiv({
        cls: "pane-empty properties-pane-empty",
        text: y5.labelNoProperties(),
      });
      n.scope = new Scope(n.app.scope);
      n.scope.register([], "Enter", n.onKeyEnterInFocus.bind(n));
      n.scope.register(["Mod"], "Enter", n.onKeyEnterInFocus.bind(n));
      var r = new s0(n.app, n.containerEl);
      r.addSortButton(
        k5,
        C5,
        function (e) {
          return n.setSortOrder(e);
        },
        function () {
          return n.sortOrder;
        },
      );
      n.showSearchButtonEl = r.addNavButton(
        "lucide-search",
        i18nProxy.plugins.backlinks.labelShowSearch(),
        n.onToggleShowSearch.bind(n),
      );
      n.searchComponent = new SearchComponent(r.navHeaderEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(debounce(n.updateSearch.bind(n), 300, !0))
        .then(function (e) {
          setTooltip(e.clearButtonEl, i18nProxy.plugins.search.tooltipClearSearch());
          e.inputEl.addEventListener("keypress", function (e) {
            if (!(e.isComposing || e.key !== "Enter")) {
              Platform.hasPhysicalKeyboard || clearFocusAndSelection();
              n.updateSearch();
            }
          });
          e.containerEl.hide();
        });
      n.tree = new z0(n, {
        app: n.app,
        containerEl: n.contentEl,
        id: b5,
        scope: n.scope,
      });
      n.propertyRenameScope = new Scope(n.app.scope);
      n.propertyRenameScope.register([], "Enter", n.onKeyEnterInRename.bind(n));
      n.propertyRenameScope.register([], "Escape", n.cancelRename.bind(n));
      i.addEventListener("click", function () {
        n.tree.setFocusedItem(null);
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this;
      this.registerEvent(this.app.vault.on("delete", this.requestUpdate, this));
      this.registerEvent(this.app.metadataCache.on("finished", this.requestUpdate, this));
      this.registerEvent(this.app.metadataTypeManager.on("changed", this.requestUpdate, this));
      this.app.workspace.onLayoutReady(function () {
        e.update();
      });
    };
    t.prototype.startRename = function (propertyBeingRenamed) {
      this.propertyBeingRenamed
        ? this.cancelRename()
        : ((this.propertyBeingRenamed = propertyBeingRenamed),
          this.app.keymap.pushScope(this.propertyRenameScope),
          propertyBeingRenamed.startRename());
    };
    t.prototype.onKeyEnterInRename = function (e) {
      if (!e.isComposing) {
        e.preventDefault();
        this.acceptRename(this.propertyBeingRenamed);
      }
    };
    t.prototype.exitRename = function () {
      var e = this.propertyBeingRenamed;
      this.propertyBeingRenamed = null;
      e.stopRename();
      this.app.keymap.popScope(this.propertyRenameScope);
    };
    t.prototype.cancelRename = function () {
      var e = this.propertyBeingRenamed;
      if (e) {
        e.updateTitle();
        this.exitRename();
      }
    };
    t.prototype.acceptRename = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var oldKey, newKey, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return e && e === this.propertyBeingRenamed
                ? (this.exitRename(),
                  (oldKey = e.property.name),
                  (newKey = e.titleEl.getText().trim()),
                  oldKey === newKey
                    ? (e.updateTitle(), [2])
                    : newKey === ""
                      ? (e.updateTitle(), e.displayError(i18nProxy.properties.msgEmptyPropertyName()), [2])
                      : ((i = this.app.metadataCache.getAllPropertyInfos()),
                        (r = i.hasOwnProperty(newKey))
                          ? [
                              4,
                              new KM(this.app, i18nProxy.dialogue.buttonSave())
                                .setTitle(
                                  y5.msgMergePropertiesWarning({
                                    oldKey: oldKey,
                                    newKey: newKey,
                                  }),
                                )
                                .setContent(
                                  y5.msgMergePropertiesWarningDesc({
                                    oldKey: oldKey,
                                  }),
                                )
                                .prompt(),
                            ]
                          : [3, 2]))
                : [2];
            case 1:
              if (!a.sent()) {
                e.updateTitle();
                return [2];
              }
              a.label = 2;
            case 2:
              a.trys.push([2, 4, , 5]);
              return [4, this.app.fileManager.renameProperty(oldKey, newKey)];
            case 3:
              a.sent();
              o = this.doms[newKey];
              this.tree.infinityScroll.scrollIntoView(o, 4);
              r && flashElement(o.selfEl);
              return [3, 5];
            case 4:
              a.sent();
              e.updateTitle();
              return [3, 5];
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.onToggleShowSearch = function () {
      this.setShowSearch(!this.isShowingSearch);
      this.isShowingSearch && this.searchComponent.inputEl.focus();
    };
    t.prototype.showSearch = function () {
      this.setShowSearch(!0);
      this.searchComponent.inputEl.focus();
    };
    t.prototype.setShowSearch = function (isShowingSearch) {
      if (isShowingSearch !== this.isShowingSearch) {
        this.isShowingSearch = isShowingSearch;
        this.searchComponent.containerEl.toggle(isShowingSearch);
        this.showSearchButtonEl.toggleClass("is-active", isShowingSearch);
        isShowingSearch || (this.searchComponent.setValue(""), this.updateSearch());
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.updateSearch = function () {
      var e = this.searchComponent.getValue(),
        t = this.searchQuery;
      if (!((!t && !e) || (t && t.query === e)))
        try {
          if (e) {
            var searchQuery = new WF(this.app, e, !1);
            searchQuery.matcher ? (this.searchQuery = searchQuery) : (this.searchQuery = null);
          } else this.searchQuery = null;
          this.update();
        } catch (e) {
          console.log(e);
        }
    };
    t.prototype.isItem = function (e) {
      return e instanceof S5;
    };
    t.prototype.onKeyEnterInFocus = function (e) {
      e.preventDefault();
      this.isItem(this.tree.focusedItem) && this.tree.focusedItem.onSelfClick(e);
    };
    t.prototype.getDisplayText = function () {
      return y5.nameGlobal();
    };
    t.prototype.getViewType = function () {
      return b5;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.sortOrder = this.sortOrder;
      t.showSearch = this.isShowingSearch;
      t.searchQuery = this.searchComponent.getValue();
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, sortOrder;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              a.sent();
              i = t.searchQuery;
              r = t.showSearch;
              sortOrder = t.sortOrder;
              String.isString(sortOrder) && C5.hasOwnProperty(sortOrder) && (this.sortOrder = sortOrder);
              isBoolean(r) && this.setShowSearch(r);
              String.isString(i) && (this.searchComponent.setValue(i), this.updateSearch());
              this.update();
              return [2];
          }
        });
      });
    };
    t.prototype.setSortOrder = function (sortOrder) {
      this.sortOrder = sortOrder;
      this.update();
    };
    Object.defineProperty(t.prototype, "root", {
      get: function () {
        return this.tree.infinityScroll.rootEl;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.onResize = function () {
      this.tree.infinityScroll.onResize();
    };
    t.prototype.update = function () {
      var e = this.app,
        t = this.doms,
        n = e.metadataTypeManager.getAllProperties();
      if (((this.doms = {}), this.root.vChildren.clear(), (this.tree.focusedItem = null), Object.keys(n).length > 0)) {
        this.emptyStateEl.detach();
        var i = this.sortOrder,
          r = null;
        if (i === "alphabetical")
          r = function (e, t) {
            return Eb(e.property.name, t.property.name);
          };
        else if (i === "alphabeticalReverse")
          r = function (e, t) {
            return -Eb(e.property.name, t.property.name);
          };
        else {
          var o = i === "frequencyReverse" ? -1 : 1;
          r = function (e, t) {
            var i,
              r,
              a,
              s,
              l = e.property.name.toLowerCase(),
              c = t.property.name.toLowerCase(),
              u =
                (r = (i = n[l]) === null || undefined === i ? undefined : i.occurrences) !== null && undefined !== r
                  ? r
                  : 0,
              h =
                (s = (a = n[c]) === null || undefined === a ? undefined : a.occurrences) !== null && undefined !== s
                  ? s
                  : 0;
            return u === h ? Eb(l, c) : o * (h - u);
          };
        }
        for (var a = 0, s = Object.entries(n); a < s.length; a++) {
          var l = s[a],
            c = l[0],
            u = l[1];
          if (!this.searchQuery || this.searchQuery.matchContent(c)) {
            var h = t[c] || new S5(this);
            h.setProperty(u);
            this.root.vChildren.addChild(h);
            this.doms[c] = h;
          }
        }
        this.root.vChildren.sort(r);
      } else this.contentEl.appendChild(this.emptyStateEl);
      this.tree.infinityScroll.queueCompute();
    };
    return t;
  })(ItemView),
  x5 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.icon = "lucide-info";
      i.modifyingFile = null;
      i.rawFrontmatter = null;
      i.frontmatter = {};
      i.plugin = plugin;
      i.scope = new Scope(i.app.scope);
      i.contentEl.addEventListener("click", function (e) {
        if (e.target === i.contentEl) {
          i.metadataEditor.containerEl.focus();
        }
      });
      i.metadataEditor = new tD(i.app, i);
      i.contentEl.appendChild(i.metadataEditor.containerEl);
      i.addChild(i.metadataEditor);
      i.contentEl.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.targetNode === i.contentEl && i.isSupportedFile(i.file) && i.metadataEditor.showPropertiesMenu(e);
      });
      i.emptyStateEl = i.contentEl.createDiv({
        cls: "pane-empty",
        text: y5.labelNoProperties(),
      });
      i.updateEmptyState();
      return i;
    }
    __extends(t, e);
    t.prototype.setEphemeralState = function (t) {
      e.prototype.setEphemeralState.call(this, t);
      t.focus && this.metadataEditor.containerEl.focus();
    };
    t.prototype.onload = function () {
      this.registerEvent(this.app.vault.on("modify", this.onFileChange, this));
      this.registerEvent(this.app.workspace.on("quick-preview", this.onQuickPreview, this));
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.getFile = function () {
      return this.file;
    };
    t.prototype.getHoverSource = function () {
      return "properties";
    };
    t.prototype.canShowProperties = function () {
      return !0;
    };
    t.prototype.shiftFocusAfter = function () {};
    t.prototype.shiftFocusBefore = function () {};
    t.prototype.onMarkdownFold = function () {};
    t.prototype.handleCut = function (e) {
      this.metadataEditor.handleCut(e);
    };
    t.prototype.handleCopy = function (e) {
      this.metadataEditor.handleCopy(e);
    };
    t.prototype.handlePaste = function (e) {
      if (e.clipboardData.getData("obsidian/properties")) {
        this.metadataEditor.handlePaste(e);
      }
    };
    t.prototype.saveFrontmatter = function (e) {
      var t = this.file,
        n = this.modifyingFile;
      if (t && t.extension === "md" && t === n) {
        this.app.vault.process(t, function (t) {
          return Ex(t, e);
        });
      }
    };
    t.prototype.isSupportedFile = function (e) {
      return !!e && e.extension === "md";
    };
    t.prototype.readSupportedFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return this.isSupportedFile(e) ? [2, this.app.vault.cachedRead(e)] : [2, ""];
        });
      });
    };
    t.prototype.onLoadFile = function (modifyingFile) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, this.readSupportedFile(modifyingFile)];
            case 1:
              n = i.sent();
              this.updateFrontmatter(modifyingFile, n);
              this.isSupportedFile(modifyingFile) && (this.modifyingFile = modifyingFile);
              return [4, e.prototype.onLoadFile.call(this, modifyingFile)];
            case 2:
              i.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onUnloadFile = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              this.modifyingFile = null;
              this.updateFrontmatter(null, "");
              this.rawFrontmatter = null;
              this.metadataEditor.clear();
              return [4, e.prototype.onUnloadFile.call(this, t)];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onQuickPreview = function (e, t) {
      if (e === this.file) {
        this.updateFrontmatter(e, t);
        this.requestUpdate();
      }
    };
    t.prototype.onFileChange = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return e !== this.file ? [3, 2] : [4, this.readSupportedFile(e)];
            case 1:
              t = n.sent();
              this.updateFrontmatter(e, t);
              this.requestUpdate();
              n.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    t.prototype.getDisplayText = function () {
      return !this.file || Platform.isMobile
        ? y5.nameLocal()
        : y5.tabTitle({
            displayText: e.prototype.getDisplayText.call(this),
          });
    };
    t.prototype.getViewType = function () {
      return typew50;
    };
    t.prototype.updateFrontmatter = function (e, t) {
      var n;
      if (!this.isSupportedFile(e)) {
        this.rawFrontmatter = null;
        return void (this.frontmatter = null);
      }
      var rawFrontmatter = getFrontMatterInfo(t).frontmatter;
      if (this.rawFrontmatter === null || this.rawFrontmatter !== rawFrontmatter) {
        this.rawFrontmatter = rawFrontmatter;
        try {
          var frontmatter = (n = parseYaml(rawFrontmatter)) !== null && undefined !== n ? n : {};
          if (typeof frontmatter != "object" || Array.isArray(frontmatter))
            throw new Error("Frontmatter must be a valid object!");
          this.frontmatter = frontmatter;
        } catch (e) {
          this.frontmatter = null;
        }
      }
    };
    t.prototype.updateEmptyState = function () {
      var e = !this.isSupportedFile(this.file);
      this.metadataEditor.containerEl.toggle(!e);
      this.emptyStateEl.toggle(e);
    };
    t.prototype.update = function () {
      this.metadataEditor.synchronize(this.frontmatter);
      this.updateEmptyState();
    };
    return t;
  })(DJ),
  T5 = i18nProxy.plugins.publish,
  D5 = (function (e) {
    function t(t, plugin, i, r, o) {
      var a = e.call(this, t) || this;
      a.plugin = plugin;
      a.modalEl.addClass("mod-scrollable-content");
      a.titleEl.setText(T5.labelNavigationModalTitle());
      new Setting(a.contentEl)
        .setName(T5.optionNavigationOrder())
        .setDesc(T5.labelNavigationModalDesc())
        .addExtraButton(function (e) {
          return e
            .setIcon("lucide-rotate-ccw")
            .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
            .onClick(function () {
              var e;
              s.navOrder = [];
              (e = s.orderChangeCb) === null || undefined === e || e.call(s, []);
              s.render();
            });
        });
      var s = (a.tree = new I5(a.plugin, a.contentEl, r, o));
      i.forEach(function (e) {
        return s.createItem(e);
      });
      s.render();
      new Setting(a.contentEl)
        .setName(T5.optionHideItemsInNavigation())
        .setDesc(T5.optionHideItemsInNavigationDesc())
        .addExtraButton(function (e) {
          return e
            .setIcon("lucide-rotate-ccw")
            .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
            .onClick(function () {
              var e;
              s.hiddenItems = [];
              (e = s.visibilityChangeCb) === null || undefined === e || e.call(s, []);
              s.render();
            });
        });
      a.modalEl.createDiv("modal-button-container", function (e) {
        e.createEl("button", {
          text: i18nProxy.dialogue.buttonDone(),
        }).addEventListener("click", function () {
          return a.close();
        });
      });
      return a;
    }
    __extends(t, e);
    t.prototype.onOrderChange = function (orderChangeCb) {
      this.tree.orderChangeCb = orderChangeCb;
      return this;
    };
    t.prototype.onVisibilityChange = function (visibilityChangeCb) {
      this.tree.visibilityChangeCb = visibilityChangeCb;
      return this;
    };
    return t;
  })(Modal),
  A5 = (function (e) {
    function t(tree, path) {
      var i = e.call(this) || this;
      i.hidden = false;
      i.tree = tree;
      i.name = getFilename(path);
      i.path = path;
      i.el.addClass("mod-custom-nav");
      i.selfEl.addEventListener("contextmenu", i.onContextMenu.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onContextMenu = function (e) {
      var t = this;
      new Menu()
        .addItem(function (e) {
          return e
            .setTitle(T5.optionHideInNavigation())
            .setChecked(t.hidden)
            .onClick(function () {
              var e, n;
              t.hidden = !t.hidden;
              var i = t.tree.hiddenItems;
              t.hidden ? i.push(t.path) : i.remove(t.path);
              (n = (e = t.tree).visibilityChangeCb) === null || undefined === n || n.call(e, i);
              t.render();
            });
        })
        .showAtMouseEvent(e);
    };
    t.prototype.render = function () {
      var t,
        n,
        i = this;
      if ((this.el.toggleClass("hidden", this.hidden), !this.hidden || this.tree.showHidden)) {
        this.el.show();
        e.prototype.render.call(this);
        var r =
          (n = (t = this.parent) === null || undefined === t ? undefined : t.childrenEl) !== null && undefined !== n
            ? n
            : this.tree.childrenEl;
        Vc(
          this.selfEl,
          this.el,
          r,
          10,
          function () {},
          function (e) {
            var t,
              n,
              r =
                (n = (t = i.parent) === null || undefined === t ? undefined : t.children) !== null && undefined !== n
                  ? n
                  : i.tree.children;
            r.remove(i);
            r.splice(e, 0, i);
            i.tree.rebuildNavOrder();
          },
        );
      } else this.el.hide();
    };
    return t;
  })(M_),
  P5 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.type = "file";
      var r = i.innerEl,
        texto0 = getFilename(n);
      r.createDiv({
        cls: "tree-item-title",
        text: texto0,
      });
      return i;
    }
    __extends(t, e);
    t.prototype.render = function () {
      e.prototype.render.call(this);
      this.setCollapsible(!1);
      this.setClickable(!0);
    };
    return t;
  })(A5),
  L5 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.type = "folder";
      i.children = [];
      i.selfEl.addClass("mod-folder");
      i.setCollapsible(!0);
      i.setClickable(!0);
      i.setCollapsed(!0, !1);
      i.innerEl.createDiv({
        cls: "file-tree-item-title",
        text: i.name,
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      this.toggleCollapsed(!0);
    };
    return t;
  })(A5),
  I5 = (function (e) {
    function t(publish, n, navOrder, hiddenItems) {
      var o = e.call(this, n) || this;
      o.children = [];
      o.showHidden = false;
      o.hiddenItems = [];
      o.navOrder = [];
      o.folders = {};
      o.files = {};
      o.publish = publish;
      o.navOrder = navOrder;
      o.hiddenItems = hiddenItems;
      var a = n.createDiv("tree-list-container");
      a.createDiv("tree-list-header", function (e) {
        e.createDiv({
          cls: "tree-list-title",
          text: i18nProxy.plugins.publish.labelNavigationPreview(),
        });
        e.createEl(
          "label",
          {
            cls: "tree-list-action mod-checkbox",
          },
          function (e) {
            e.createEl("input", {
              attr: {
                tabindex: -1,
              },
              type: "checkbox",
            }).addEventListener("click", function () {
              o.setShowHidden(!o.showHidden);
            });
            e.appendText(T5.optionShowHiddenItems());
          },
        );
      });
      o.childrenEl = a.createDiv("tree-list");
      return o;
    }
    __extends(t, e);
    t.prototype.setShowHidden = function (showHidden) {
      this.showHidden = showHidden;
      this.render();
    };
    t.prototype.addChild = function (e) {
      var t = Zc(e.path);
      if (t) {
        var n = this.folders,
          parent = n[t];
        parent || ((parent = n[t] = new L5(this, t)), this.addChild(parent));
        parent.children.push(e);
        e.parent = parent;
      } else this.addRoot(e);
    };
    t.prototype.createItem = function (e) {
      var t = new P5(this, e);
      this.files[e] = t;
      this.addChild(t);
      return t;
    };
    t.prototype.rebuildNavOrder = function () {
      var e,
        navOrder = [],
        n = function (e) {
          var i = e.slice();
          b_(i, {}, !1);
          for (var r = false, o = 0; o < e.length; o++)
            if (i[o].path !== e[o].path) {
              r = true;
              break;
            }
          for (var a = 0, s = e; a < s.length; a++) {
            var l = s[a];
            r && navOrder.push(l.path);
            l instanceof L5 && n(l.children);
          }
        };
      n(this.children);
      this.navOrder = navOrder;
      (e = this.orderChangeCb) === null || undefined === e || e.call(this, this.navOrder);
      return navOrder;
    };
    t.prototype.render = function () {
      for (var t = {}, n = 0; n < this.navOrder.length; n++) {
        t[this.navOrder[n]] = n;
      }
      b_(this.children, t);
      var i = new Set(this.hiddenItems),
        r = function (e) {
          for (var t = 0, n = e; t < n.length; t++) {
            var o = n[t];
            o.hidden = i.has(o.path);
            o.type === "folder" && r(o.children);
          }
        };
      r(this.children);
      e.prototype.render.call(this);
    };
    return t;
  })(x_),
  O5 = (function () {
    function e(e) {
      var t = (this.containerEl = e.createDiv("startup-stat"));
      this.infoEl = t.createDiv("startup-info");
    }
    e.prototype.setHeading = function (e) {
      this.containerEl.toggleClass("mod-heading", e);
      return this;
    };
    e.prototype.addLabel = function (texte0) {
      this.infoEl.createSpan({
        cls: "startup-label",
        text: texte0,
      });
      return this;
    };
    e.prototype.addDesc = function (texte0) {
      this.infoEl.createSpan({
        cls: "startup-desc",
        text: texte0,
      });
      return this;
    };
    e.prototype.addValue = function (texte0) {
      this.containerEl.createDiv({
        cls: "startup-value",
        text: texte0,
      });
      return this;
    };
    return e;
  })(),
  F5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.setTitle("Startup time");
      n.modalEl.addClass("mod-lg", "mod-scrollable-content", "mod-plugin-debug");
      var i = lm({
          maximumFractionDigits: 0,
        }),
        r = function (e) {
          return i.format(e) + "ms";
        },
        o = n.contentEl.createDiv("startup-stat-list"),
        a = new O5(o).addLabel("Device"),
        s = new O5(o).addLabel("Operating system"),
        l = new O5(o).addLabel("Obsidian");
      if (Platform.isMobileApp)
        __awaiter(n, undefined, undefined, function () {
          var e, t;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, capacitorDevicePlugin.getInfo()];
              case 1:
                e = n.sent();
                a.addValue("".concat(e.manufacturer, " ").concat(e.model));
                s.addValue(
                  ""
                    .concat(
                      ((i = e.platform),
                      i.toLowerCase() === "ios" ? "iOS" : i.toLowerCase() === "android" ? "Android" : i),
                      " ",
                    )
                    .concat(e.osVersion),
                );
                return [4, capacitorAppPlugin.getInfo()];
              case 2:
                t = n.sent();
                l.addDesc("v" + t.version);
                l.addLabel("Build");
                l.addDesc(t.build);
                return [2];
            }
            var i;
          });
        });
      else if (Platform.isDesktopApp) {
        a.containerEl.hide();
        s.addValue(Bl);
        var c = electron.ipcRenderer.sendSync("version"),
          u = electron.remote.app.getVersion();
        l.addDesc("v" + c);
        l.addLabel("Installer");
        l.addDesc("v" + u);
      }
      var h = n.contentEl.createDiv("startup-timing-list");
      new O5(h).setHeading(!0).addLabel("Total app startup").addValue(r(eJ()));
      new O5(h).addLabel("Initialization").addValue(r(eJ("initialization")));
      new O5(h)
        .addLabel("Vault")
        .addDesc(
          i18nProxy.nouns.fileWithCount({
            count: t.vault.getRoot().getFileCount(),
          }),
        )
        .addValue(r(eJ("vault")));
      new O5(h)
        .addLabel("Workspace")
        .addDesc("".concat(X$.views, " tabs (").concat(X$.deferredViews, " deferred)"))
        .addValue(r(eJ("workspace")));
      new O5(h)
        .addLabel("Core plugins")
        .addDesc(
          i18nProxy.nouns.pluginActiveWithCount({
            count: t.internalPlugins.getEnabledPlugins().length,
          }),
        )
        .addValue(r(eJ("corePlugins")));
      var p = n.contentEl.createDiv("startup-timing-list"),
        d = J$("communityPlugins");
      if (d) {
        for (
          var count = Object.keys(t.plugins.plugins).length, m = [], g = 0, v = Object.values(d.children);
          g < v.length;
          g++
        ) {
          var w = v[g];
          m.push({
            id: w.key,
            time: w.duration,
          });
        }
        new O5(p)
          .setHeading(!0)
          .addLabel("Community plugins")
          .addDesc(
            i18nProxy.nouns.pluginActiveWithCount({
              count: count,
            }),
          )
          .addValue(r(eJ("communityPlugins")));
        m.sort(function (e, t) {
          return t.time - e.time;
        });
        for (var k = 0, C = m; k < C.length; k++) {
          var E = C[k],
            S = E.id,
            M = E.time,
            x = n.app.plugins.manifests[S];
          new O5(p)
            .addLabel(x ? x.name : S)
            .addDesc(x ? "v" + x.version : "")
            .addValue(r(M));
        }
      }
      n.addButton("mod-secondary", i18nProxy.interface.labelCopy(), function () {
        return __awaiter(n, undefined, undefined, function () {
          var e;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, tJ(t)];
              case 1:
                e = n.sent();
                return [4, navigator.clipboard.writeText(e)];
              case 2:
                n.sent();
                new Notice(
                  i18nProxy.interface.copied({
                    context: "generic",
                  }),
                );
                return [2, !0];
            }
          });
        });
      }).addButton("mod-cancel", i18nProxy.dialogue.buttonDone(), function () {});
      return n;
    }
    __extends(t, e);
    return t;
  })(GM);