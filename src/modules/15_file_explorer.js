var BJ = (function () {
    function e(app, view, renderer) {
      var i = this;
      this.options = Object.assign({}, n_);
      this.searchQueries = null;
      this.fileFilter = {};
      this.hasFilter = false;
      this.queue = null;
      this.onOptionsChange = debounce(
        function () {
          return i.view.onOptionsChange();
        },
        100,
        !0,
      );
      this.lastHoverLink = null;
      this.hoverPopover = null;
      this.requestUpdateSearch = debounce(this.updateSearch.bind(this), 250, !0);
      this.progression = 0;
      this.progressionSpeed = 20;
      this.currentFocusFile = "";
      this.app = app;
      this.view = view;
      this.renderer = renderer;
      renderer.onNodeClick = this.onNodeClick.bind(this);
      renderer.onNodeRightClick = this.onNodeRightClick.bind(this);
      renderer.onNodeHover = this.onNodeHover.bind(this);
      renderer.onNodeUnhover = this.onNodeUnhover.bind(this);
      var r = (this.controlsEl = renderer.containerEl.createDiv("graph-controls"));
      r.dataset.ignoreSwipe = "true";
      r.createDiv("clickable-icon graph-controls-button mod-close", function (e) {
        setIcon(e, "lucide-x");
        setTooltip(e, i18nProxy.interface.menu.close());
        e.addEventListener("click", function () {
          r.addClass("is-close");
          i.onOptionsChange();
        });
      });
      r.createDiv("clickable-icon graph-controls-button mod-open", function (e) {
        setIcon(e, "lucide-settings");
        setTooltip(e, AJ.tooltipOpenGraphSettings());
        e.addEventListener("click", function () {
          r.removeClass("is-close");
          i.onOptionsChange();
        });
      });
      view instanceof FJ ||
        r.createDiv("clickable-icon graph-controls-button mod-animate", function (e) {
          setIcon(e, "lucide-wand-2");
          setTooltip(e, AJ.tooltipStartTimelapseAnimation());
          e.addEventListener("click", function () {
            i.renderProgression();
          });
        });
      r.createDiv(
        {
          cls: "clickable-icon graph-controls-button mod-reset",
        },
        function (e) {
          setIcon(e, "lucide-rotate-ccw");
          setTooltip(e, i18nProxy.interface.tooltipRestoreDefaultSettings());
          e.addEventListener("click", function () {
            i.filterOptions.setDefaultOptions();
            i.colorGroupOptions.setColorQueries([]);
            i.displayOptions.setDefaultOptions();
            i.forceOptions.setDefaultOptions();
          });
        },
      );
      this.filterOptions = new HJ(this, view instanceof FJ);
      this.colorGroupOptions = new zJ(this);
      this.displayOptions = new WJ(this);
      this.forceOptions = new _J(this);
      this.filterOptions.setDefaultOptions();
      this.colorGroupOptions.setColorQueries([]);
      this.displayOptions.setDefaultOptions();
      this.forceOptions.setDefaultOptions();
    }
    e.prototype.load = function () {
      var e = this,
        t = this.app,
        n = this.view,
        i = t.vault,
        r = t.workspace,
        o = t.metadataCache;
      n.registerEvent(i.on("create", this.onFileChanged, this));
      n.registerEvent(i.on("modify", this.onFileChanged, this));
      n.registerEvent(i.on("rename", this.recomputeFile, this));
      n.registerEvent(o.on("resolve", this.recomputeFile, this));
      n.registerEvent(r.on("css-change", this.onCssChange, this));
      n.registerEvent(r.on("file-open", this.onFileOpen, this));
      var a = 0;
      n.registerInterval(
        window.setInterval(function () {
          if (e.renderer.targetScale !== a) {
            a = e.renderer.targetScale;
            e.onOptionsChange();
          }
        }, 2e3),
      );
      var s = {
          38: "up",
          40: "down",
          37: "left",
          39: "right",
          187: "zoomin",
          189: "zoomout",
        },
        l = function (t) {
          var i = e.renderer;
          i.keyboardActions.shift = Keymap.isModifier(t, "Shift");
          var o = t.type === "keydown";
          if (o) {
            var a = e.view.containerEl.doc;
            if (t.repeat || t.defaultPrevented || r.activeLeaf !== n.leaf || a.activeElement !== a.body) return;
          }
          if (s.hasOwnProperty(t.which)) {
            var l = s[t.which];
            i.keyboardActions[l] = o;
            i.changed();
          }
        };
      n.registerDomEvent(window, "keydown", l);
      n.registerDomEvent(window, "keyup", l);
    };
    e.prototype.onCssChange = function () {
      this.renderer.testCSS();
    };
    e.prototype.updateSearch = function () {
      var e = [],
        query = this.filterOptions.search.getValue();
      query &&
        e.push({
          query: query,
          color: null,
        });
      e = e.concat(this.colorGroupOptions.getColoredQueries());
      this.setQuery(e);
      this.onOptionsChange();
    };
    e.prototype.setQuery = function (e) {
      var t = this;
      this.queue && (this.queue.cancel(), (this.queue = null));
      this.hasFilter = false;
      for (var searchQueries = [], i = {}, r = 0, o = e; r < o.length; r++) {
        var a = o[r],
          query = new WF(this.app, a.query, !1);
        query.matcher || (query = null);
        query &&
          (searchQueries.push({
            query: query,
            color: a.color,
          }),
          query.requiredInputs && Object.assign(i, query.requiredInputs),
          a.color || (this.hasFilter = true));
      }
      if (
        (searchQueries.length === 0 && (searchQueries = null), (this.searchQueries = searchQueries), !searchQueries)
      ) {
        this.fileFilter = {};
        return void this.render();
      }
      var l = (this.fileFilter = {}),
        c = (this.queue = new sx({
          onStart: function () {
            t.filterOptions.startSearch();
          },
          onStop: function () {
            t.render();
            t.filterOptions.stopSearch();
          },
          onCancel: function () {
            t.queue = null;
            t.filterOptions.stopSearch();
          },
        })),
        u = this.app;
      c.addList(u.vault.getFiles());
      var h = performance.now(),
        p = true;
      UF(
        u,
        i,
        c,
        function (e, t) {
          for (var i = true, r = null, o = 0, a = searchQueries; o < a.length; o++) {
            var s = a[o],
              c = s.query.match(e, t);
            if (!c && !s.color) {
              i = false;
              break;
            }
            if (c && s.color) {
              r = s.color;
              break;
            }
          }
          l[e.path] = !!i && (r || !0);
          p = p || i;
        },
        {
          beforePause: function (e) {
            if (!(e < h + 333)) {
              h = e;
              p && t.render();
              p = false;
            }
          },
        },
      );
    };
    e.prototype.render = function () {
      var e = this,
        t = this,
        n = t.app,
        i = t.view,
        r = t.renderer,
        o = t.searchQueries,
        a = t.fileFilter,
        s = t.options,
        l = i instanceof FJ;
      if (!l || s.localFile) {
        if (l) {
          this.progression = 0;
        }
        var c = (function (e, t, n, i) {
            var r = e.resolvedLinks,
              o = e.unresolvedLinks,
              a = e.vault,
              s = t.showAttachments,
              l = t.hideUnresolved,
              c = t.showTags,
              u = {};
            if (t.showTags) {
              var h = e.getTags();
              for (var p in h)
                if (h.hasOwnProperty(p)) {
                  u[p.toLowerCase()] = p;
                }
            }
            var nodes = {},
              numLinks = 0,
              m = e.getCachedFiles();
            if (i) {
              for (var g = {}, v = 0, y = m; v < y.length; v++) {
                var b = y[v],
                  w = a.getAbstractFileByPath(b);
                g[b] = w instanceof TFile ? Math.min(w.stat.ctime, w.stat.mtime) : 1 / 0;
              }
              m.sort(function (e, t) {
                return g[e] - g[t];
              });
            }
            for (var k = "", C = 0, E = m; C < E.length; C++) {
              var S = E[C],
                M = isNotSupportedExtension(S);
              if (s || !M) {
                var x = M ? "attachment" : "",
                  color = n(S, x);
                if (color && !e.isUserIgnored(S)) {
                  var D = (nodes[S] = i_(x)),
                    A = D.links;
                  if (
                    (t.showOrphans && (numLinks === i && (k = S), numLinks++),
                    isBoolean(color) || (D.color = color),
                    r.hasOwnProperty(S))
                  ) {
                    var P = r[S];
                    for (var L in P)
                      if (P.hasOwnProperty(L)) {
                        var I = isNotSupportedExtension(L);
                        if (s || !I)
                          if (n(L, I ? "attachment" : "")) {
                            !i || numLinks < i ? (A[L] = true) : numLinks === i && (k = S);
                            numLinks++;
                          }
                      }
                  }
                  if (!l && o.hasOwnProperty(S)) {
                    P = o[S];
                    for (var L in P)
                      if (P.hasOwnProperty(L) && n(L, "unresolved")) {
                        !i || numLinks < i
                          ? ((A[L] = true), nodes.hasOwnProperty(L) || (nodes[L] = i_("unresolved")))
                          : numLinks === i && (k = S);
                        numLinks++;
                      }
                  }
                  if (c)
                    if ((h = getAllTags(e.getCache(S))) && h.length > 0)
                      for (var O = 0, F = h; O < F.length; O++) {
                        if (n((p = F[O]), "tag")) {
                          var N = u[p.toLowerCase()] || p;
                          !i || numLinks < i ? (A[N] = true) : numLinks === i && (k = S);
                          numLinks++;
                          nodes.hasOwnProperty(N) || (nodes[N] = i_("tag"));
                        }
                      }
                }
              }
            }
            if (i && k) {
              var R = m.indexOf(k);
              if (-1 !== R) for (var B = R + 1; B < m.length; B++) delete nodes[m[B]];
            }
            return {
              nodes: nodes,
              numLinks: numLinks,
            };
          })(
            n.metadataCache,
            s,
            function (t, n) {
              return (
                !o ||
                (n === ""
                  ? t === s.localFile || (a.hasOwnProperty(t) ? a[t] : !e.hasFilter)
                  : n === "tag"
                    ? o.every(function (e) {
                        return !!e.color || !!e.query.matchTag(t);
                      })
                    : n !== "attachment" ||
                      o.every(function (e) {
                        return !!e.color || !!e.query.matchFilepath(t);
                      }))
              );
            },
            this.progression,
          ),
          u = c.numLinks;
        if (
          (s.localFile && (c = p_(c, s)),
          s.showOrphans ||
            (function (e) {
              var t = e.nodes,
                n = {};
              for (var i in t)
                if (t.hasOwnProperty(i)) {
                  var r = t[i].links;
                  for (var o in r)
                    if (r.hasOwnProperty(o) && i !== o) {
                      n[o] = true;
                    }
                }
              for (var i in t)
                if (t.hasOwnProperty(i)) {
                  r = t[i].links;
                  var a = false;
                  for (var o in r)
                    if (r.hasOwnProperty(o) && t.hasOwnProperty(o) && i !== o) {
                      a = true;
                      break;
                    }
                  if (!(a || n[i])) {
                    delete t[i];
                  }
                }
            })(c),
          this.currentFocusFile)
        ) {
          var h = c.nodes[this.currentFocusFile];
          if (h) {
            h.type = "focused";
          }
        }
        r.setData(c);
        return u;
      }
      r.setData({
        nodes: {},
      });
    };
    e.prototype.renderProgression = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, progression;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              this.progression = 1;
              e = this.render();
              this.progressionSpeed = Math.clamp(0.5 * Math.sqrt(e), 5, 100);
              t = Date.now();
              i.label = 1;
            case 1:
              return this.progression > 0
                ? ((progression = this.progression),
                  [
                    4,
                    new Promise(function (e) {
                      return Sc(e, 0);
                    }),
                  ])
                : [3, 3];
            case 2:
              i.sent();
              return progression !== this.progression
                ? [3, 3]
                : (progression = 1 + Math.floor((this.progressionSpeed * (Date.now() - t)) / 1e3)) ===
                      this.progression || ((this.progression = progression), this.render())
                  ? [3, 1]
                  : [3, 3];
            case 3:
              return [2];
          }
        });
      });
    };
    e.prototype.onFileChanged = function (e) {
      if (e.extension !== "md") {
        this.recomputeFile(e);
      }
    };
    e.prototype.recomputeFile = function (e) {
      var t = this.queue;
      if (t) {
        t.add(e);
      }
    };
    e.prototype.onFileOpen = function (e) {
      var currentFocusFile = e ? e.path : "";
      if (currentFocusFile !== this.currentFocusFile) {
        this.currentFocusFile = currentFocusFile;
        this.render();
      }
    };
    e.prototype.onNodeClick = function (e, t, n) {
      var i = this.app;
      if (n !== "tag") i.workspace.openLinkText(t, "", Keymap.isModEvent(e));
      else {
        var r = i.internalPlugins.getEnabledPluginById("global-search");
        if (r) {
          r.openGlobalSearch("tag:" + t);
        }
      }
    };
    e.prototype.onNodeRightClick = function (e, t, n) {
      var i = this,
        r = this.app;
      if (n !== "tag") {
        var o = r.metadataCache.getFirstLinkpathDest(t, "");
        if (o && e.instanceOf(MouseEvent)) {
          var a = new Menu().addSections([
            "title",
            "open",
            "action",
            "info",
            "view",
            "view.linked",
            "system",
            "",
            "danger",
          ]);
          a.setSectionSubmenu("view.linked", {
            title: i18nProxy.interface.menu.openLinkedView(),
            icon: "lucide-link",
          });
          a.addItem(function (e) {
            return e
              .setSection("title")
              .setTitle(o.getShortName())
              .setIsLabel(!0)
              .titleEl.addClass("u-muted", "u-small");
          });
          a.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openInNewTab())
              .setIcon("lucide-file-plus")
              .onClick(function (e) {
                return __awaiter(i, undefined, undefined, function () {
                  return __generator(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return [4, this.app.workspace.getLeaf(Keymap.isModEvent(e) || !0).openLinkText(t, "")];
                      case 1:
                        n.sent();
                        return [2];
                    }
                  });
                });
              });
          });
          this.app.workspace.trigger("file-menu", a, o, "graph-context-menu", this.view.leaf);
          a.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(i18nProxy.interface.menu.deleteFile())
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                return i.app.fileManager.promptForFileDeletion(o);
              });
          });
          a.showAtMouseEvent(e);
        }
      } else {
        var s = r.internalPlugins.getEnabledPluginById("global-search");
        if (s) {
          s.openGlobalSearch("tag:" + t);
        }
      }
    };
    e.prototype.onNodeHover = function (event, lastHoverLink, n) {
      if ((this.onNodeUnhover(), event.instanceOf(MouseEvent))) {
        var i = this,
          r = i.app,
          o = i.hoverPopover,
          a = i.lastHoverLink;
        if (n === "" || n === "focused" || n === "attachment") {
          if (o && o.state !== PopoverState.Hidden && a === lastHoverLink) {
            o.onTarget = true;
            return void o.transition();
          }
          this.lastHoverLink = lastHoverLink;
          r.workspace.trigger("hover-link", {
            event: event,
            source: "graph",
            hoverParent: this,
            targetEl: null,
            linktext: lastHoverLink,
          });
        }
      }
    };
    e.prototype.onNodeUnhover = function () {
      var e = this.hoverPopover;
      if (e) {
        e.onTarget = false;
        e.transition();
      }
    };
    e.prototype.getOptions = function () {
      var e = {};
      this.filterOptions.getOptions(e);
      this.colorGroupOptions.getOptions(e);
      this.displayOptions.getOptions(e);
      this.forceOptions.getOptions(e);
      e.scale = this.renderer.targetScale;
      e.close = this.controlsEl.hasClass("is-close");
      return e;
    };
    e.prototype.setOptions = function (e) {
      if (e) {
        this.filterOptions.setOptions(e);
        this.colorGroupOptions.setOptions(e);
        this.displayOptions.setOptions(e);
        this.forceOptions.setOptions(e);
        e.scale && this.renderer.zoomTo(e.scale);
        e.close && this.controlsEl.toggleClass("is-close", e.close);
        this.render();
      }
    };
    return e;
  })(),
  VJ = (function (e) {
    function t(engine, n, texti0) {
      var r = e.call(this) || this;
      r.engine = null;
      r.optionListeners = {};
      r.engine = engine;
      r.el.addClass("graph-control-section", "mod-".concat(n));
      r.setCollapsible(!0);
      r.setCollapsed(!0, !1);
      r.innerEl.createEl("header", {
        cls: "graph-control-section-header",
        text: texti0,
      });
      r.optionListeners["collapse-" + n] = function (e) {
        undefined !== e && isBoolean(e) && r.setCollapsed(e, !1);
        return r.collapsed;
      };
      return r;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      return this.toggleCollapsed(!0);
    };
    t.prototype.updateCollapsed = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, e.prototype.updateCollapsed.call(this, t)];
            case 1:
              n.sent();
              this.engine.onOptionsChange();
              return [2];
          }
        });
      });
    };
    t.prototype.setOptions = function (e) {
      var t = this.optionListeners;
      for (var n in e)
        if (e.hasOwnProperty(n) && t.hasOwnProperty(n)) {
          t[n](e[n]);
        }
    };
    t.prototype.getOptions = function (e) {
      var t = this.optionListeners;
      for (var n in t)
        if (t.hasOwnProperty(n)) {
          var i = t[n]();
          if (undefined !== i) {
            e[n] = i;
          }
        }
    };
    return t;
  })(C_),
  HJ = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, "filter", AJ.labelFilters()) || this;
      i.searchSetting = null;
      t.controlsEl.appendChild(i.el);
      var r = i.childrenEl,
        o = (i.searchSetting = new Setting(r).addSearch(function (e) {
          return e
            .setPlaceholder(AJ.promptFilterNodes())
            .setValue("")
            .onChange(function () {
              i.engine.requestUpdateSearch();
            })
            .then(function (searche0) {
              i.search = searche0;
              setTooltip(searche0.clearButtonEl, i18nProxy.plugins.search.tooltipClearSearch());
              i.optionListeners.search = function (t) {
                undefined !== t && (searche0.setValue(t), i.engine.requestUpdateSearch());
                return searche0.getValue();
              };
              searche0.inputEl.addEventListener("keydown", function (e) {
                if (!(e.isComposing || e.key !== "Enter")) {
                  i.engine.updateSearch();
                }
              });
              TJ.attach(t.app, searche0.inputEl, !1);
            });
        }));
      o.settingEl.addClass("mod-search-setting");
      n &&
        (new Setting(r)
          .setName(AJ.optionDepth())
          .setTooltip(AJ.optionDepthDescription())
          .setClass("mod-local-jumps")
          .setClass("mod-slider")
          .addSlider(function (e) {
            return e
              .setLimits(1, 5, 1)
              .setValue(t.options.localJumps)
              .setDynamicTooltip()
              .setInstant(!0)
              .registerOptionListener(i.optionListeners, "localJumps")
              .onChange(function (localJumps) {
                t.options.localJumps = localJumps;
                t.render();
                t.onOptionsChange();
              });
          }),
        new Setting(r)
          .setName(AJ.optionBacklinks())
          .setTooltip(AJ.optionBacklinksDescription())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(t.options.localBacklinks)
              .registerOptionListener(i.optionListeners, "localBacklinks")
              .onChange(function (localBacklinks) {
                t.options.localBacklinks = localBacklinks;
                t.render();
                t.onOptionsChange();
              });
          }),
        new Setting(r)
          .setName(AJ.optionForelinks())
          .setTooltip(AJ.optionForelinksDescription())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(t.options.localForelinks)
              .registerOptionListener(i.optionListeners, "localForelinks")
              .onChange(function (localForelinks) {
                t.options.localForelinks = localForelinks;
                t.render();
                t.onOptionsChange();
              });
          }),
        new Setting(r)
          .setName(AJ.optionNeighborLinks())
          .setTooltip(AJ.optionNeighborLinksDescription())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(t.options.localInterlinks)
              .registerOptionListener(i.optionListeners, "localInterlinks")
              .onChange(function (localInterlinks) {
                t.options.localInterlinks = localInterlinks;
                t.render();
                t.onOptionsChange();
              });
          }));
      new Setting(r)
        .setName(AJ.optionShowTags())
        .setTooltip(AJ.optionShowTagsDescription())
        .setClass("mod-toggle")
        .addToggle(function (e) {
          return e
            .setSmall()
            .setValue(t.options.showTags)
            .registerOptionListener(i.optionListeners, "showTags")
            .onChange(function (showTags) {
              t.options.showTags = showTags;
              t.render();
              t.onOptionsChange();
            });
        });
      new Setting(r)
        .setName(AJ.optionShowAttachments())
        .setTooltip(AJ.optionShowAttachmentsDescription())
        .setClass("mod-toggle")
        .addToggle(function (e) {
          return e
            .setSmall()
            .setValue(t.options.showAttachments)
            .registerOptionListener(i.optionListeners, "showAttachments")
            .onChange(function (showAttachments) {
              t.options.showAttachments = showAttachments;
              t.render();
              t.onOptionsChange();
            });
        });
      new Setting(r)
        .setName(AJ.optionShowExistingFilesOnly())
        .setTooltip(AJ.optionShowExistingFilesOnlyDescription())
        .setClass("mod-toggle")
        .addToggle(function (e) {
          return e
            .setSmall()
            .setValue(t.options.hideUnresolved)
            .registerOptionListener(i.optionListeners, "hideUnresolved")
            .onChange(function (hideUnresolved) {
              t.options.hideUnresolved = hideUnresolved;
              t.render();
              t.onOptionsChange();
            });
        });
      n ||
        new Setting(r)
          .setName(AJ.optionShowOrphans())
          .setTooltip(AJ.optionShowOrphansDescription())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(t.options.showOrphans)
              .registerOptionListener(i.optionListeners, "showOrphans")
              .onChange(function (showOrphans) {
                t.options.showOrphans = showOrphans;
                t.render();
                t.onOptionsChange();
              });
          });
      return i;
    }
    __extends(t, e);
    t.prototype.startSearch = function () {
      this.searchSetting.settingEl.addClass("is-loading");
    };
    t.prototype.stopSearch = function () {
      this.searchSetting.settingEl.removeClass("is-loading");
    };
    t.prototype.setDefaultOptions = function () {
      this.setOptions(n_);
    };
    return t;
  })(VJ),
  zJ = (function (e) {
    function t(t) {
      var n = e.call(this, t, "color-groups", AJ.labelGroups()) || this;
      t.controlsEl.appendChild(n.el);
      n.optionListeners.colorGroups = function (e) {
        Array.isArray(e) && (n.setColorQueries(e), n.engine.requestUpdateSearch());
        return n.getColoredQueries();
      };
      n.setColorQueries([]);
      return n;
    }
    __extends(t, e);
    t.prototype.getColoredQueries = function () {
      for (var e = [], t = 0, n = this.groups; t < n.length; t++) {
        var i = n[t];
        e.push({
          query: i.query.getValue(),
          color: {
            a: 1,
            rgb: i.color.getValueInt(),
          },
        });
      }
      return e;
    };
    t.prototype.setColorQueries = function (e) {
      var t = this,
        n = this.childrenEl;
      n.empty();
      for (
        var groups = [],
          r = n.createDiv({
            cls: "graph-color-groups-container",
          }),
          o = function (e) {
            var n = r.createDiv("graph-color-group"),
              query = new TextComponent(n)
                .setPlaceholder(AJ.placeholderEnterQuery())
                .setValue(e.query)
                .onChange(function () {
                  return t.engine.requestUpdateSearch();
                })
                .then(function (e) {
                  return TJ.attach(t.engine.app, e.inputEl, !1);
                }),
              color = new ColorComponent(n).setValueInt(e.color ? e.color.rgb : 0).onChange(function () {
                return t.engine.updateSearch();
              }),
              s = color.colorPickerEl;
            setTooltip(s, AJ.tooltipClickToChangeDragToReorder());
            var l = {
              el: n,
              query: query,
              color: color,
            };
            s.addEventListener("mousedown", function (e) {
              t.onDragOption(e, l);
            });
            n.createDiv("clickable-icon", function (e) {
              setIcon(e, "lucide-x");
              setTooltip(e, AJ.tooltipDeleteGraph());
              e.addEventListener("click", function () {
                groups.remove(l);
                n.detach();
                t.engine.updateSearch();
              });
            });
            groups.push(l);
          },
          a = 0,
          s = e;
        a < s.length;
        a++
      ) {
        var l = s[a];
        o(l);
      }
      this.groups = groups;
      n.createDiv("graph-color-button-container", function (e) {
        e.createEl(
          "button",
          {
            cls: "mod-cta",
            text: AJ.buttonNewGroup(),
          },
          function (e) {
            e.addEventListener("click", function () {
              var e = MT({
                h: 40 * t.groups.length,
                s: t.engine.app.customCss.isDarkMode() ? 70 : 60,
                l: 60,
              });
              o({
                query: "",
                color: {
                  a: 1,
                  rgb: PT(e),
                },
              });
              t.engine.updateSearch();
            });
          },
        );
      });
    };
    t.prototype.onDragOption = function (e, t) {
      var n = this;
      if (e.button === 0) {
        var i = e.clientX,
          r = e.clientY,
          o = t.el,
          a = o.getBoundingClientRect(),
          s = e.clientX - a.x,
          l = e.clientY - a.y,
          c = null,
          u = function (e) {
            e.preventDefault();
            var a = e.clientX,
              u = e.clientY,
              h = n.el.doc;
            if (c === null) {
              var p = a - i,
                d = u - r;
              if (p * p + d * d < 25) return;
              var f = o.offsetWidth;
              n.groups.remove(t);
              (c = o.cloneNode(!0)).addClass("drag-ghost");
              c.style.width = f + "px";
              h.body.appendChild(c);
              document.body.addClass("is-grabbing");
              n.childrenEl.addClass("is-grabbing");
            }
            var m = n.getDropIndex(e);
            o.detach();
            hideTooltip();
            c && ((c.style.left = a - s + "px"), (c.style.top = u - l + "px"));
            for (var g = 0; g < n.groups.length; g++) {
              var v = n.groups[g];
              v.el.style.top = g < m ? "0" : "".concat(v.el.offsetHeight, "px");
            }
          },
          h = function (e) {
            if ((window.removeEventListener("mousemove", u), window.removeEventListener("mouseup", h), c)) {
              c.detach();
              document.body.removeClass("is-grabbing");
              n.childrenEl.removeClass("is-grabbing");
              var i = n.getDropIndex(e);
              n.groups.splice(i, 0, t);
              n.setColorQueries(n.getColoredQueries());
              n.engine.updateSearch();
            }
          };
        window.addEventListener("mousemove", u);
        window.addEventListener("mouseup", h);
      }
    };
    t.prototype.getDropIndex = function (e) {
      var t,
        n = e.clientY;
      for (t = 0; t < this.groups.length; t++) {
        var i = this.groups[t].el.getBoundingClientRect();
        if (n < i.top + i.height / 2) return t;
      }
      return t;
    };
    return t;
  })(VJ),
  qJ = {
    showArrow: false,
    textFadeMultiplier: 0,
    nodeSizeMultiplier: 1,
    lineSizeMultiplier: 1,
  },
  WJ = (function (e) {
    function t(t) {
      var n = e.call(this, t, "display", AJ.labelDisplay()) || this;
      t.controlsEl.appendChild(n.el);
      var i = n.childrenEl;
      new Setting(i)
        .setName(AJ.optionShowArrows())
        .setTooltip(AJ.optionShowArrowsDescription())
        .setClass("mod-toggle")
        .addToggle(function (e) {
          return e
            .setSmall()
            .registerOptionListener(n.optionListeners, "showArrow")
            .onChange(function (showArrow) {
              t.renderer.setRenderOptions({
                showArrow: showArrow,
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionTextFade())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(-3, 3, 0.1)
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "textFadeMultiplier")
            .onChange(function (textFadeMultiplier) {
              t.renderer.setRenderOptions({
                textFadeMultiplier: textFadeMultiplier,
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionNodeSize())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(0.1, 5, "any")
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "nodeSizeMultiplier")
            .onChange(function (nodeSizeMultiplier) {
              t.renderer.setRenderOptions({
                nodeSizeMultiplier: nodeSizeMultiplier,
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionLinkThickness())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(0.1, 5, "any")
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "lineSizeMultiplier")
            .onChange(function (lineSizeMultiplier) {
              t.renderer.setRenderOptions({
                lineSizeMultiplier: lineSizeMultiplier,
              });
              t.onOptionsChange();
            });
        });
      t.view instanceof FJ ||
        new Setting(i).addButton(function (e) {
          return e
            .setButtonText(AJ.buttonAnimateTimelapse())
            .setCta()
            .onClick(function () {
              t.renderProgression();
            });
        });
      return n;
    }
    __extends(t, e);
    t.prototype.setDefaultOptions = function () {
      this.setOptions(qJ);
    };
    return t;
  })(VJ),
  UJ = {
    centerStrength: RJ(0.1, 0.01),
    repelStrength: 10,
    linkStrength: RJ(1, 0.01),
    linkDistance: 250,
  },
  _J = (function (e) {
    function t(t) {
      var n = e.call(this, t, "forces", AJ.labelForces()) || this;
      t.controlsEl.appendChild(n.el);
      var i = n.childrenEl;
      new Setting(i)
        .setName(AJ.optionCenterForce())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(0, 1, "any")
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "centerStrength")
            .onChange(function (e) {
              t.renderer.setForces({
                centerStrength: NJ(e, 0.01),
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionRepelForce())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(0, 20, "any")
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "repelStrength")
            .onChange(function (e) {
              t.renderer.setForces({
                repelStrength: e * e * e,
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionLinkForce())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(0, 1, "any")
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "linkStrength")
            .onChange(function (e) {
              t.renderer.setForces({
                linkStrength: NJ(e, 0.01),
              });
              t.onOptionsChange();
            });
        });
      new Setting(i)
        .setName(AJ.optionLinkDistance())
        .setClass("mod-slider")
        .addSlider(function (e) {
          return e
            .setLimits(30, 500, 1)
            .setDynamicTooltip()
            .setInstant(!0)
            .registerOptionListener(n.optionListeners, "linkDistance")
            .onChange(function (linkDistance) {
              t.renderer.setForces({
                linkDistance: linkDistance,
              });
              t.onOptionsChange();
            });
        });
      return n;
    }
    __extends(t, e);
    t.prototype.setDefaultOptions = function () {
      this.setOptions(UJ);
    };
    return t;
  })(VJ);
var jJ = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.onTrigger = function (e, t) {
      var line = e.line,
        i = t.getLine(line),
        r = i.slice(0, e.ch),
        o = i.slice(e.ch),
        a = r.match(/(?:^|[^\[])(\[\^)([^\]]*)$/);
      if (a) {
        var s = r.length,
          query = a[2],
          start = {
            line: line,
            ch: s - (a[1].length + query.length),
          },
          u = {
            line: line,
            ch: e.ch,
          },
          h = o.match(/[\]\s]/);
        return h && h[0] === "]" && ((u.ch = s + h.index + 1), i[u.ch] === ":")
          ? null
          : {
              start: start,
              end: u,
              query: query,
            };
      }
      return null;
    };
    t.prototype.renderSuggestion = function (e, t) {
      renderResults(t, e.footnote, e);
    };
    t.prototype.selectSuggestion = function (e) {
      var t = this.context;
      if ((this.close(), t)) {
        var n = t.editor,
          from = t.start,
          r = t.end;
        if (e.type === "create") {
          n.replaceRange("", from, r);
          return void n.insertFootnote();
        }
        var texto0 = "[^" + e.id + "]";
        n.transaction({
          changes: [
            {
              from: from,
              to: r,
              text: texto0,
            },
          ],
          selection: {
            from: {
              line: from.line,
              ch: from.ch + texto0.length,
            },
          },
        });
        activeWindow.setTimeout(function () {
          return n.focus();
        });
      }
    };
    t.prototype.getSuggestions = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s, l, c, u, h, p, d, footnote, m, g;
        return __generator(this, function (v) {
          switch (v.label) {
            case 0:
              (t = this.runnable) && t.cancel();
              n = this.app;
              i = n.vault;
              r = n.metadataCache;
              return (o = this.context.file) ? ((t = this.runnable = new ax()), [4, i.cachedRead(o)]) : [2, null];
            case 1:
              if (((a = v.sent()), t.isCancelled())) return [2, null];
              if (((s = e.query), (l = prepareQuery(s)), (c = []), (u = r.getFileCache(o)), a && u.footnotes))
                for (h = 0, p = u.footnotes; h < p.length; h++)
                  if (!(d = p[h]).id.startsWith(eC)) {
                    footnote = a.slice(d.position.start.offset, d.position.end.offset);
                    (m = fuzzySearch(l, footnote)) &&
                      c.push({
                        id: d.id,
                        footnote: footnote,
                        score: m.score,
                        matches: m.matches,
                        type: "match",
                      });
                  }
              s ||
                ((g = getNextFootnoteNumber(u)),
                c.push({
                  id: String(g),
                  footnote: "[^".concat(g, "]: ").concat(i18nProxy.editor.linkSuggestion.labelNewFootnote()),
                  score: 1,
                  matches: [],
                  type: "create",
                }));
              c.sort(function (e, t) {
                return t.score - e.score;
              });
              return [2, c];
          }
        });
      });
    };
    return t;
  })(EditorSuggest),
  GJ = (function () {
    function e(e) {
      this.suggests = [];
      this.currentSuggest = null;
      this.addSuggest(new lT(e));
      this.addSuggest(new hT(e));
      this.addSuggest(new jJ(e));
    }
    e.prototype.addSuggest = function (e) {
      this.suggests.push(e);
    };
    e.prototype.removeSuggest = function (e) {
      this.currentSuggest === e && this.close();
      this.suggests.remove(e);
    };
    e.prototype.trigger = function (e, t, n) {
      if (e.cm.hasFocus) {
        for (var i = 0, r = this.suggests; i < r.length; i++) {
          var o = r[i];
          if (o.trigger(e, t, n)) return void (n && this.setCurrentSuggest(o));
        }
        this.close();
      }
    };
    e.prototype.setCurrentSuggest = function (currentSuggest) {
      var t = this.currentSuggest;
      if (t !== currentSuggest) {
        t && t.close();
        this.currentSuggest = currentSuggest;
      }
    };
    e.prototype.isShowingSuggestion = function () {
      var e = this.currentSuggest;
      return e && e.isOpen;
    };
    e.prototype.reposition = function () {
      var e = this.currentSuggest;
      if (e && e.isOpen) {
        e.updatePosition();
      }
    };
    e.prototype.close = function () {
      this.setCurrentSuggest(null);
    };
    return e;
  })(),
  KJ = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.modalEl.addClass("mod-lg");
      n.titleEl.setText(i18nProxy.interface.labelDebugInfo());
      var i = n.contentEl,
        r = (n.infoTextEl = i.createEl("textarea", {
          cls: "debug-textarea",
        }));
      r.spellcheck = false;
      r.disabled = true;
      r.value = "Loading...";
      n.setInfoText.bind(n)();
      n.addButton("mod-secondary", i18nProxy.interface.labelCopy(), function () {
        vc(r.value);
        new Notice(
          i18nProxy.interface.copied({
            item: i18nProxy.interface.labelDebugInfo(),
          }),
        );
      });
      Platform.isDesktop &&
        Platform.isDesktopApp &&
        n.addButton("", i18nProxy.interface.helpScreen.labelSandboxVault(), function () {
          callbackWithElectron(function (e) {
            e.ipcRenderer.sendSync("sandbox");
          });
        });
      n.addButton("mod-cancel", i18nProxy.dialogue.buttonDone(), function () {});
      return n;
    }
    __extends(t, e);
    t.prototype.setInfoText = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, value, r, o, a, s, l, c, u, h, p, d, f, m, g, v;
        return __generator(this, function (y) {
          switch (y.label) {
            case 0:
              t = (e = this).app;
              n = e.infoTextEl;
              return [4, Y$()];
            case 1:
              if (
                ((value = y.sent()),
                (r = t.vault.getConfig("livePreview")),
                (value += "\tLive preview: ".concat(r ? "on" : "off", "\n")),
                document.body.hasClass("emulate-mobile") && (value += "\tEmulate mobile: on\n"),
                (o = t.vault.getConfig("theme")),
                (value += "\tBase theme: ".concat(
                  o === "system" ? "adapt to system" : o === "obsidian" ? "dark" : "light",
                  "\n",
                )),
                (a = t.customCss.theme || "none"),
                (value += "\tCommunity theme: ".concat(a)),
                (s = (v = t.customCss.themes[a]) === null || undefined === v ? undefined : v.version) &&
                  (value += " v" + s),
                (value += "\n"),
                (l = t.customCss.snippets.filter(function (e) {
                  return t.customCss.enabledSnippets.has(e);
                }).length),
                (value += "\tSnippets enabled: ".concat(l, "\n")),
                (c = t.plugins.isEnabled() ? "off" : "on"),
                (value += "\tRestricted mode: ".concat(c, "\n")),
                (u = 0),
                t.plugins.isEnabled())
              )
                for (m in ((h = t.plugins.manifests),
                (p = Object.keys(h)),
                (d = t.plugins.plugins),
                (value += "\tPlugins installed: ".concat(p.length, "\n")),
                (u = Object.keys(d).length),
                (value += "\tPlugins enabled: ".concat(u, "\n")),
                (f = 1),
                d))
                  if (d.hasOwnProperty(m)) {
                    value += "\t\t"
                      .concat(f, ": ")
                      .concat(d[m].manifest.name, " v")
                      .concat(d[m].manifest.version, "\n");
                    f++;
                  }
              value += "\nRECOMMENDATIONS:\n";
              g = "";
              Platform.isDesktopApp &&
                pG(electronVersion, b9) &&
                (g += "\tUpdate installer: installer version too low, please download from ".concat(
                  getDownloadUrl(),
                  " and reinstall.\n",
                ));
              (a !== "none" || l > 0) &&
                (g +=
                  "\tCustom theme and snippets: for cosmetic issues, please first try updating your theme and disabling your snippets. If still not fixed, please try to make the issue happen in the Sandbox Vault or disable community theme and snippets.\n");
              c === "off" &&
                u > 0 &&
                (g +=
                  "\tCommunity plugins: for bugs, please first try updating all your plugins to latest. If still not fixed, please try to make the issue happen in the Sandbox Vault or disable community plugins.\n");
              g === "" && (g = "\tnone\n");
              value += g;
              n.value = value;
              return [2];
          }
        });
      });
    };
    return t;
  })(GM);
function YJ(e, t, n) {
  return __awaiter(this, undefined, undefined, function () {
    var i = this;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          return [
            4,
            e.fileManager.runAsyncLinkUpdate(function () {
              return __awaiter(i, undefined, undefined, function () {
                var i, r, o, a, s, l, c;
                return __generator(this, function (u) {
                  switch (u.label) {
                    case 0:
                      i = e.vault;
                      r = 0;
                      o = t;
                      u.label = 1;
                    case 1:
                      return r < o.length
                        ? (a = o[r]).parent === n
                          ? [3, 3]
                          : ((s = a.name),
                            n.path !== "/" && (s = n.path + "/" + s),
                            a instanceof TFile
                              ? ((l = $c(s)), (c = getExtension(getFilename(s))), (s = i.getAvailablePath(l, c)))
                              : a instanceof TFolder && (s = i.getAvailablePath(s)),
                            [4, i.rename(a, s)])
                        : [3, 4];
                    case 2:
                      u.sent();
                      u.label = 3;
                    case 3:
                      r++;
                      return [3, 1];
                    case 4:
                      return [2];
                  }
                });
              });
            }),
          ];
        case 1:
          r.sent();
          return [2];
      }
    });
  });
}
function ZJ(e, t) {
  return e !== t && !(e instanceof TFolder && e.isRoot()) && !(e instanceof TFolder && t.path.startsWith(e.path + "/"));
}
function XJ(e) {
  for (var t = [], n = 0, i = e; n < i.length; n++) {
    for (var r = i[n], o = true, a = 0, s = e; a < s.length; a++) {
      var l = s[a];
      if (l !== r && l instanceof TFolder && r.path.startsWith(l.path)) {
        o = false;
        break;
      }
    }
    if (o) {
      t.push(r);
    }
  }
  return t;
}
function QJ(e, t) {
  for (var n = [], i = 0, r = e; i < r.length; i++) {
    var o = r[i];
    if (ZJ(o, t)) {
      n.push(o);
    }
  }
  return XJ(n);
}
var $J = i18nProxy.plugins.fileExplorer,
  JJ = (function (e) {
    function t(t, files) {
      var i = e.call(this, t) || this;
      i.limit = 20;
      i.emptyStateText = $J.labelNoFolders();
      i.emptyMatch = Object.freeze({
        match: {
          score: 0,
          matches: [],
        },
        item: null,
      });
      i.files = files;
      i.setInstructions([
        {
          command: "↑↓",
          purpose: $J.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: $J.instructionMove(),
        },
        {
          command: "shift ↵",
          purpose: $J.instructionCreate(),
        },
        {
          command: "esc",
          purpose: $J.instructionDismiss(),
        },
      ]);
      i.inputEl.setAttribute("placeholder", $J.promptTypeFolder());
      i.scope.register(["Shift"], "Enter", function (e) {
        i.selectSuggestion(i.emptyMatch, e);
        return !1;
      });
      i.scope.register([], "Tab", function (e) {
        var t;
        if (!e.isComposing) {
          var n = i.chooser,
            r = n.values,
            o = n.selectedItem,
            a = i.inputEl.value,
            s = r[o];
          if (s) {
            var value = $x(s.item.path, (t = s.match) === null || undefined === t ? undefined : t.matches);
            if (value === "/") return;
            value === a && (value += "/");
            i.inputEl.value = value;
            i.inputEl.trigger("input");
          }
          return !1;
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onNoSuggestion = function () {
      this.chooser.setSuggestions([this.emptyMatch]);
      this.chooser.addMessage(this.emptyStateText);
    };
    t.prototype.renderSuggestion = function (t, n) {
      if (!t.item) {
        n.addClass("mod-complex");
        var i = n.createDiv("suggestion-content"),
          r = n.createDiv("suggestion-aux");
        i.createDiv({
          cls: "suggestion-title",
          text: this.inputEl.value,
        });
        return void r.createSpan({
          cls: "suggestion-hotkey",
          text: i18nProxy.interface.labelEnterToCreate(),
        });
      }
      return e.prototype.renderSuggestion.call(this, t, n);
    };
    t.prototype.getItems = function () {
      for (var e = [], t = 0, n = this.app.vault.getAllLoadedFiles(); t < n.length; t++) {
        var i = n[t];
        if (i instanceof TFolder) {
          e.push(i);
        }
      }
      return e;
    };
    t.prototype.getItemText = function (e) {
      return e.isRoot() ? "/" : e.path;
    };
    t.prototype.onChooseItem = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              n = (t = this).app;
              return (i = t.files) && i.length !== 0
                ? e
                  ? [3, 2]
                  : ((r = this.inputEl.value), [4, n.vault.createFolder(r)])
                : [2];
            case 1:
              s.sent();
              (o = n.vault.getAbstractFileByPathInsensitive(r)) instanceof TFolder && (e = o);
              s.label = 2;
            case 2:
              return (a = QJ(i, e)).length > 0 ? [4, YJ(n, a, e)] : [3, 4];
            case 3:
              s.sent();
              s.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    return t;
  })(FuzzySuggestModal),
  e1 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.sortOrder = "download";
      n.items = {};
      n.itemsVisible = [];
      n.selectedItemId = null;
      n.selectedItemCloseable = null;
      n.dimBackground = false;
      n.returnToGridView = n.returnToGridView.bind(n);
      var i = n,
        r = i.contentEl;
      i.modalEl.addClass("mod-community-modal", "mod-sidebar-layout");
      var o = (n.sidebarEl = r.createDiv("modal-sidebar"));
      n.detailsEl = createDiv("community-modal-details");
      o.createDiv("community-modal-controls", function (e) {
        new Setting(e)
          .addSearch(function (e) {
            return (n.search = e.onChange(debounce(n.update.bind(n), 300)).then(function () {
              e.inputEl.addEventListener("keypress", function (e) {
                if (!(e.isComposing || e.key !== "Enter" || Platform.hasPhysicalKeyboard)) {
                  clearFocusAndSelection();
                }
              });
            }));
          })
          .addButton(function (e) {
            return e
              .onClick(function (e) {
                return n.showSortMenu(e);
              })
              .then(function (e) {
                if (Platform.isPhone) e.setButtonText(i18nProxy.plugins.fileExplorer.actionChangeSort());
                else {
                  var t = e.buttonEl;
                  setIcon(t, "lucide-sort-asc");
                  setTooltip(t, i18nProxy.plugins.fileExplorer.actionChangeSort());
                  t.addClass("clickable-icon");
                }
              });
          });
        n.installedOnlyToggleSetting = new Setting(e)
          .setName(i18nProxy.setting.thirdPartyPlugin.showInstalledOnly())
          .addToggle(function (e) {
            return (n.installedOnlyToggle = e
              .setSmall()
              .setValue(!1)
              .onChange(function () {
                return n.update();
              }));
          });
        n.addCustomControls(e);
        n.searchSummaryEl = e.createDiv("community-modal-search-summary u-muted");
      });
      var a = o.createDiv("community-modal-search-results-wrapper");
      n.emptyStateEl = a.createDiv("community-modal-empty-state");
      n.listEl = a.createDiv("community-modal-search-results");
      Platform.isMobile &&
        OM(n.contentEl, function (e) {
          if (e.points === 1 && e.direction === "x" && !(n.selectedItemId === null || e.touch.clientX > 40)) {
            var t = n,
              i = t.detailsEl,
              r = t.sidebarEl;
            n.contentEl.prepend(r);
            restoreScrollPositionsWalk(r);
            e.registerCallback({
              move: function (t, n) {
                var r = i.offsetWidth,
                  o = Math.clamp((t - e.startX) / r, 0, 1);
                i.style.transform = "translateX(".concat(o * r, "px)");
              },
              cancel: function () {
                i.style.transform = "";
                r.detach();
              },
              finish: function (t, o, a) {
                var s = i.offsetWidth,
                  l = Math.clamp((t - e.startX) / s, 0, 1);
                0.5 * a < s / 2
                  ? fl(
                      i,
                      new cl({
                        duration: 200 * l,
                      }).addProp("transform", null, "translateX(0)", ""),
                      function () {
                        r.detach();
                      },
                    )
                  : fl(
                      i,
                      new cl({
                        duration: 100 * (1 - l),
                        fn: "ease-out",
                      }).addProp("transform", null, "translateX(".concat(s, "px)"), ""),
                      function () {
                        i.detach();
                        n.returnToGridView();
                      },
                    );
              },
            });
          }
        });
      var s = (n.renderQueue = new sx()),
        l = null,
        beforePause = function () {
          a.scrollTop + a.clientHeight < a.scrollHeight - a.clientHeight / 2
            ? l || (l = rx())
            : l && (l.resolve(), (l = null));
        },
        u = cx(s.generator(), {
          batchSize: 10,
          beforePause: beforePause,
        });
      __awaiter(n, undefined, undefined, function () {
        var e, t, n, error, r, o, a, s;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              c.trys.push([0, 6, 7, 12]);
              e = true;
              t = __asyncValues(u);
              c.label = 1;
            case 1:
              return [4, t.next()];
            case 2:
              n = c.sent();
              return (r = n.done) ? [3, 5] : ((s = n.value), (e = false), s(), l ? [4, l.promise] : [3, 4]);
            case 3:
              c.sent();
              c.label = 4;
            case 4:
              e = true;
              return [3, 1];
            case 5:
              return [3, 12];
            case 6:
              error = c.sent();
              o = {
                error: error,
              };
              return [3, 12];
            case 7:
              c.trys.push([7, , 10, 11]);
              return e || r || !(a = t.return) ? [3, 9] : [4, a.call(t)];
            case 8:
              c.sent();
              c.label = 9;
            case 9:
              return [3, 11];
            case 10:
              if (o) throw o.error;
              return [7];
            case 11:
              return [7];
            case 12:
              return [2];
          }
        });
      });
      a.addEventListener("scroll", beforePause, {
        passive: !0,
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              this.listEl.hide();
              this.emptyStateEl.show();
              o.label = 1;
            case 1:
              o.trys.push([1, 3, , 4]);
              e = this;
              return [
                4,
                withLoadingClass(this.emptyStateEl, function () {
                  return r.loadItems();
                }),
              ];
            case 2:
              e.items = o.sent();
              this.listEl.show();
              this.emptyStateEl.hide();
              this.emptyStateEl.empty();
              this.update();
              this.selectedItemId && this.selectItem(this.selectedItemId);
              return [3, 4];
            case 3:
              t = o.sent();
              this.listEl.hide();
              n = createDiv("button-container");
              (i = n.createEl("button", {
                cls: "mod-cta",
                text: i18nProxy.dialogue.buttonRetry(),
              })).addEventListener("click", function () {
                return withModLoadingClass(i, function () {
                  return r.onOpen();
                });
              });
              this.emptyStateEl.setChildrenInPlace([
                createDiv({
                  text: t.message,
                }),
                n,
              ]);
              this.emptyStateEl.show();
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype.onClose = function () {
      RM(this.selectedItemCloseable);
      this.onCloseCallback && this.onCloseCallback();
    };
    t.prototype.onEscapeKey = function () {
      this.selectedItemId ? this.returnToGridView() : this.close();
    };
    t.prototype.update = function () {
      var e = (this.itemsVisible = this.updateItems()),
        t = this.listEl;
      e.length === 0
        ? t.setChildrenInPlace([
            createDiv({
              cls: "community-item",
              text: i18nProxy.setting.thirdPartyPlugin.labelNoResultsFound(),
            }),
          ])
        : t.setChildrenInPlace(
            e.map(function (e) {
              return e.el;
            }),
          );
    };
    t.prototype.returnToGridView = function () {
      var e = this,
        t = function () {
          e.selectItem(null);
        };
      Platform.isPhone && this.detailsEl.isShown()
        ? (Ml(this.contentEl, this.sidebarEl, "left", t), restoreScrollPositionsWalk(this.sidebarEl))
        : t();
    };
    t.prototype.selectItem = function (selectedItemId) {
      var t,
        n = this,
        i = this.detailsEl;
      if (!i.hasClass("is-loading")) {
        var r = this.items,
          o = this.selectedItemId;
        if (
          (r.hasOwnProperty(o) && r[o].el.removeClass("is-selected"),
          i.empty(),
          (t = this.backButtonEl) === null || undefined === t || t.detach(),
          (this.backButtonEl = null),
          RM(this.selectedItemCloseable),
          (this.selectedItemCloseable = null),
          selectedItemId === null || i.parentElement || this.contentEl.append(i),
          selectedItemId === null || !r.hasOwnProperty(selectedItemId))
        ) {
          this.selectedItemId = "";
          return void i.detach();
        }
        this.selectedItemId = selectedItemId;
        this.selectedItemCloseable = {
          close: this.returnToGridView.bind(this),
        };
        NM(this.selectedItemCloseable);
        var a = r[selectedItemId];
        a.el.addClass("is-selected");
        return withLoadingClass(i, function () {
          return __awaiter(n, undefined, undefined, function () {
            var e = this;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  Platform.isPhone
                    ? ((this.backButtonEl = this.titleEl.createDiv("modal-setting-back-button", function (t) {
                        t.addEventListener("click", e.returnToGridView);
                        t.createSpan("modal-setting-back-button-icon", function (e) {
                          setIcon(e, "lucide-arrow-left");
                        });
                      })),
                      saveScrollPositions(this.sidebarEl),
                      Ml(this.contentEl, i, "right"))
                    : i.createDiv("modal-setting-nav-bar", function (t) {
                        t.createDiv("clickable-icon", function (t) {
                          setTooltip(t, i18nProxy.interface.startScreen.buttonBack());
                          setIcon(t, "lucide-chevron-left");
                          t.addEventListener("click", e.returnToGridView);
                        });
                      });
                  return [4, this.showItem(a)];
                case 1:
                  t.sent();
                  return [2];
              }
            });
          });
        });
      }
    };
    t.prototype.showSortMenu = function (e) {
      var t = this;
      e.preventDefault();
      var n = e.currentTarget;
      if (!n.hasClass("has-active-menu")) {
        for (
          var i = new Menu(),
            r = this.sortOrder,
            o = function (sortOrder) {
              var n = i0[sortOrder]();
              i.addItem(function (i) {
                return i
                  .setTitle(n)
                  .setChecked(sortOrder === r)
                  .onClick(function () {
                    t.sortOrder = sortOrder;
                    t.update();
                  });
              });
            },
            a = 0,
            s = this.sortOrderOptions;
          a < s.length;
          a++
        ) {
          o(s[a]);
        }
        i.setParentElement(n).showAtMouseEvent(e);
      }
    };
    t.prototype.sortItems = function (e) {
      var t = this.sortOrder;
      if (t !== "release") {
        var n = null;
        n =
          t === "update"
            ? function (e, t) {
                return new Date(t.updated).getTime() - new Date(e.updated).getTime();
              }
            : t === "alphabetical"
              ? function (e, t) {
                  return Eb(e.name, t.name);
                }
              : function (e, t) {
                  return t.downloads - e.downloads;
                };
        e.sort(n);
      } else e.reverse();
    };
    t.prototype.scrollIntoView = function (e) {
      var t = this.items[e];
      if (t && !Platform.isPhone) {
        t.el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    };
    t.prototype.addCustomControls = function (e) {};
    return t;
  })(Modal),
  SettingTab = (function () {
    function e(app, setting) {
      this.app = null;
      this.setting = null;
      this.containerEl = null;
      this.navEl = null;
      this.app = app;
      this.setting = setting;
      this.containerEl = createDiv("vertical-tab-content");
    }
    e.prototype.hide = function () {};
    return e;
  })(),
  n1 = i18nProxy.setting.hotkeys,
  i1 = (function () {
    function e(e) {
      var t = this;
      this.value = null;
      this.el = createDiv(
        {
          cls: "hotkey-filter",
        },
        function (e) {
          t.innerEl = e.createDiv({
            cls: "hotkey-filter-inner",
            text: n1.labelShowAll(),
          });
          t.removeEl = e.createDiv("hotkey-filter-remove-button", function (e) {
            setIcon(e, "lucide-x");
            setTooltip(e, i18nProxy.interface.menu.close());
          });
        },
      );
      e && e.appendChild(this.el);
    }
    e.prototype.setValue = function (value) {
      this.value = value;
      return this;
    };
    e.prototype.setTitle = function (e) {
      this.innerEl.setText(e);
      return this;
    };
    e.prototype.onRemove = function (handleRemove) {
      this.handleRemove = handleRemove;
      this.removeEl.addEventListener("click", this.remove.bind(this));
      return this;
    };
    e.prototype.remove = function () {
      var e;
      this.value = null;
      this.el.isShown() && (this.el.detach(), (e = this.handleRemove) === null || undefined === e || e.call(this));
    };
    return e;
  })(),
  r1 = {
    "show-all": n1.labelShowAll,
    "show-assigned": n1.labelShowAssigned,
    "show-user-assigned": n1.labelShowUserAssigned,
    "show-unassigned": n1.labelShowUnassigned,
  };
var o1 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.name = n1.name();
      i.id = "hotkeys";
      i.setHotkeyScope = null;
      i.commandBeingCustomized = null;
      i.filterHotkeyScope = null;
      i.filterHotkeyEl = null;
      i.filterHotkeyActiveEl = null;
      i.hotkeyListContainerEl = null;
      i.hotkeyFilter = null;
      i.setHotkeyScope = new Scope();
      i.setHotkeyScope.register(null, null, function (e, n) {
        var r = i.commandBeingCustomized,
          o = t.hotkeyManager;
        if (r) {
          var a = (function (e) {
            var t = Keymap.decompileModifiers(e.modifiers),
              n = e.vkey;
            return t.length !== 0 || /^F[0-9]+$/i.test(n)
              ? t.length === 1 && /^[a-zA-Z]$/i.test(n) && t[0] === "Shift"
                ? null
                : BO(t, n)
              : null;
          })(n);
          if (a) {
            var s = o.getHotkeys(r.id) || o.getDefaultHotkeys(r.id) || [];
            (s = s.slice()).filter(function (e) {
              return HO(e) === HO(a);
            }).length > 0 ||
              (s.push(a),
              o.setHotkeys(r.id, s),
              __awaiter(i, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, o.save()];
                    case 1:
                      e.sent();
                      return [2];
                  }
                });
              }));
            i.finishCustomizingHotkey();
          }
          e.preventDefault();
          e.stopPropagation();
        }
      });
      i.setHotkeyScope.register([], "Escape", function () {
        if (i.commandBeingCustomized) {
          i.finishCustomizingHotkey();
          return !1;
        }
      });
      i.filterHotkeyScope = new Scope();
      i.filterHotkeyScope.register([], "Escape", function (e, t) {
        var n;
        (n = i.hotkeyFilter) === null || undefined === n || n.remove();
        i.finishFilteringByHotkey();
        i.updateHotkeyVisibility();
        return !1;
      });
      i.filterHotkeyScope.register(null, null, function (e, t) {
        var n = BO(Keymap.decompileModifiers(t.modifiers), t.vkey);
        i.setHotkeyFilter(n);
        e.preventDefault();
        e.stopPropagation();
      });
      i.filterHotkeyScope.register([], "Escape", function () {
        i.finishFilteringByHotkey();
        i.updateHotkeyVisibility();
      });
      return i;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e,
        t = this,
        n = this.containerEl;
      n.empty();
      (e = this.hotkeyFilter) === null || undefined === e || e.remove();
      this.headerComponent = new Setting(n)
        .setName(n1.optionSearch())
        .addButton(function (e) {
          setIcon(e.buttonEl, "lucide-filter");
          e.buttonEl.addClass("clickable-icon");
          e.onClick(t.showFilterMenu.bind(t));
        })
        .addSearch(function (searchComponent) {
          t.searchComponent = searchComponent;
          searchComponent.setPlaceholder(n1.promptFilter()).onChange(t.updateHotkeyVisibility.bind(t));
          var n = searchComponent.containerEl;
          n.addClass("mod-hotkey");
          var i = (t.filterHotkeyEl = n.createDiv("input-right-decorator clickable-icon"));
          setIcon(i, "lucide-keyboard");
          t.filterHotkeyActiveEl = createSpan({
            cls: "setting-hotkey mod-active input-right-decorator",
            text: n1.labelWaitingForHotkeyPress(),
          });
          i.addEventListener("click", function () {
            if (t.filterHotkeyActiveEl.isShown()) {
              t.filterHotkeyActiveEl.detach();
              return void t.finishFilteringByHotkey();
            }
            n.appendChild(t.filterHotkeyActiveEl);
            t.app.keymap.pushScope(t.filterHotkeyScope);
          });
        });
      this.filterContainerEl = n.createDiv("setting-filter-container");
      this.statusFilter = new i1()
        .onRemove(function () {
          return t.setStatusFilter("show-all");
        })
        .setTitle(n1.labelShowAll());
      this.hotkeyListContainerEl = n.createDiv("hotkey-list-container");
      this.updateHotkeyVisibility();
      Platform.hasPhysicalKeyboard && this.searchComponent.inputEl.focus();
    };
    t.prototype.setHotkeyFilter = function (e) {
      var t,
        n = this;
      this.statusFilter.remove();
      (t = this.hotkeyFilter) === null || undefined === t || t.remove();
      this.hotkeyFilter = new i1(this.filterContainerEl)
        .setValue(e)
        .setTitle(HO(e))
        .onRemove(function () {
          return n.updateHotkeyVisibility();
        });
      this.finishFilteringByHotkey();
      this.updateHotkeyVisibility();
    };
    t.prototype.setStatusFilter = function (e) {
      var t;
      (t = this.hotkeyFilter) === null || undefined === t || t.remove();
      this.statusFilter.setValue(e);
      e === "show-all"
        ? this.statusFilter.remove()
        : (this.statusFilter.el.isShown() || this.filterContainerEl.appendChild(this.statusFilter.el),
          this.statusFilter.setTitle(r1[e]()));
      this.updateHotkeyVisibility();
    };
    t.prototype.setDescription = function (count, countt0) {
      this.headerComponent.setDesc(
        createFragment(function (n) {
          n.createSpan({
            text: n1.optionSearchDesc({
              count: count,
            }),
          });
          countt0 &&
            n.createSpan({
              cls: "mod-warning",
              text: n1.optionSearchConflict({
                count: countt0,
              }),
            });
        }),
      );
    };
    t.prototype.showFilterMenu = function (e) {
      var t,
        n,
        i = this;
      e.preventDefault();
      var r = e.currentTarget;
      if (!r.hasClass("has-active-menu")) {
        for (
          var o = new Menu(),
            a =
              (n = (t = this.statusFilter) === null || undefined === t ? undefined : t.value) !== null &&
              undefined !== n
                ? n
                : "show-all",
            s = function (e) {
              var t = r1[e];
              o.addItem(function (n) {
                return n
                  .setTitle(t())
                  .setChecked(a === e)
                  .onClick(function () {
                    return i.setStatusFilter(e);
                  });
              });
            },
            l = 0,
            c = Object.keys(r1);
          l < c.length;
          l++
        ) {
          s(c[l]);
        }
        o.setParentElement(r).showAtMouseEvent(e);
      }
    };
    t.prototype.hide = function () {
      this.finishCustomizingHotkey();
    };
    t.prototype.setQuery = function (value) {
      var t = this.searchComponent.inputEl;
      t.value = value;
      t.focus();
      this.updateHotkeyVisibility();
    };
    t.prototype.updateHotkeyVisibility = function () {
      var e,
        t,
        n,
        i = this,
        r = this.app.commands,
        o = this.app.hotkeyManager;
      this.hotkeyListContainerEl.empty();
      var a = new tc();
      for (var s in r.commands)
        if (r.commands.hasOwnProperty(s)) {
          var l = r.commands[s],
            c = o.getHotkeys(s),
            u = o.getDefaultHotkeys(s),
            h = undefined !== c,
            p = undefined !== u && u.length > 0;
          if (h)
            for (var d = 0, f = c; d < f.length; d++) {
              var m = f[d];
              a.add(HO(m), l.name);
            }
          else if (p)
            for (var g = 0, v = u; g < v.length; g++) {
              var w = v[g];
              a.add(HO(w), l.name);
            }
        }
      var k = Object.values(r.commands);
      k.sort(function (e, t) {
        return Eb(e.name, t.name);
      });
      for (
        var C = 0,
          E = new Set(),
          S =
            (t = (e = this.statusFilter) === null || undefined === e ? undefined : e.value) !== null && undefined !== t
              ? t
              : "show-all",
          M = (n = this.hotkeyFilter) === null || undefined === n ? undefined : n.value,
          x = this.searchComponent.inputEl.value.toLowerCase(),
          T = function (commandBeingCustomized) {
            var t = commandBeingCustomized.id,
              n = commandBeingCustomized.name;
            if (x !== "" && !n.toLowerCase().contains(x) && !t.startsWith(x)) return "continue";
            var r = o.getHotkeys(t),
              s = o.getDefaultHotkeys(t),
              l = r || s,
              c = undefined !== r,
              u = undefined !== s;
            if (c)
              for (var h = 0, p = r; h < p.length; h++)
                for (
                  var d = HO(p[h]),
                    f = 0,
                    m = a.get(d).filter(function (e) {
                      return e !== n;
                    });
                  f < m.length;
                  f++
                ) {
                  var g = m[f];
                  E.add(g);
                }
            if (
              M &&
              !(l == null
                ? undefined
                : l.find(function (e) {
                    return HO(e) === HO(M);
                  }))
            )
              return "continue";
            if (S === "show-assigned" && !u && !c) return "continue";
            if (S === "show-user-assigned" && !c) return "continue";
            if (S === "show-unassigned" && (c || u)) return "continue";
            C++;
            var v = new Setting(D.hotkeyListContainerEl).setName(n).controlEl,
              w = v.createDiv("setting-command-hotkeys"),
              k = function (e, t, r) {
                var o = HO(t);
                if (a.get(o)) {
                  var s = a.get(o).filter(function (e) {
                    return e !== n;
                  });
                  if (s.length > 0)
                    if (
                      (e.addClass("has-conflict"),
                      e.addEventListener("click", function (e) {
                        if (!e.defaultPrevented) {
                          i.setQuery("");
                          i.setHotkeyFilter(t);
                        }
                      }),
                      s.length === 1)
                    ) {
                      var command = s[0];
                      setTooltip(
                        e,
                        n1.tooltipHotkeySingleConflict({
                          command: command,
                        }),
                      );
                    } else {
                      var count = s.length;
                      setTooltip(
                        e,
                        n1.tooltipHotkeyMultipleConflicts({
                          count: count,
                        }),
                      );
                    }
                }
                e.appendText(" " + o + " ");
                e.createSpan("setting-hotkey-icon setting-delete-hotkey", function (e) {
                  setIcon(e, "lucide-x");
                  setTooltip(e, n1.tooltipDeleteHotkey());
                  e.addEventListener("click", function (e) {
                    e.preventDefault();
                    r();
                  });
                });
              };
            if (c)
              for (
                var T = function (e) {
                    w.createSpan("setting-hotkey", function (n) {
                      k(n, e, function () {
                        return __awaiter(i, undefined, undefined, function () {
                          var n;
                          return __generator(this, function (i) {
                            switch (i.label) {
                              case 0:
                                (n = r.filter(function (t) {
                                  return HO(t) !== HO(e);
                                })).length !== 0 || u
                                  ? o.setHotkeys(t, n)
                                  : o.removeHotkeys(t);
                                return [4, o.save()];
                              case 1:
                                i.sent();
                                this.updateHotkeyVisibility();
                                return [2];
                            }
                          });
                        });
                      });
                    });
                  },
                  A = 0,
                  P = r;
                A < P.length;
                A++
              ) {
                T(P[A]);
              }
            else if (u)
              for (
                var L = function (e) {
                    w.createSpan("setting-hotkey", function (n) {
                      k(n, e, function () {
                        return __awaiter(i, undefined, undefined, function () {
                          var n;
                          return __generator(this, function (i) {
                            switch (i.label) {
                              case 0:
                                n = s.filter(function (t) {
                                  return HO(t) !== HO(e);
                                });
                                o.setHotkeys(t, n);
                                return [4, o.save()];
                              case 1:
                                i.sent();
                                this.updateHotkeyVisibility();
                                return [2];
                            }
                          });
                        });
                      });
                    });
                  },
                  I = 0,
                  O = s;
                I < O.length;
                I++
              ) {
                L(O[I]);
              }
            D.commandBeingCustomized && t === D.commandBeingCustomized.id
              ? w.createSpan({
                  cls: "setting-hotkey mod-active",
                  text: n1.labelWaitingForHotkeyPress(),
                })
              : ((c && r.length === 0) || (!c && !u)) &&
                w.createSpan({
                  cls: "setting-hotkey mod-empty",
                  text: n1.labelBlankHotkey(),
                });
            c &&
              v.createSpan("clickable-icon setting-restore-hotkey-button", function (e) {
                setIcon(e, "lucide-rotate-ccw");
                setTooltip(e, n1.tooltipRestoreDefault());
                e.addEventListener("click", function () {
                  return __awaiter(i, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          o.removeHotkeys(t);
                          return [4, o.save()];
                        case 1:
                          e.sent();
                          this.finishCustomizingHotkey();
                          return [2];
                      }
                    });
                  });
                });
              });
            v.createSpan("clickable-icon setting-add-hotkey-button", function (t) {
              setIcon(t, "lucide-plus-circle");
              setTooltip(t, n1.tooltipCustomizeCommand());
              t.addEventListener("click", function () {
                i.commandBeingCustomized = commandBeingCustomized;
                i.app.keymap.pushScope(i.setHotkeyScope);
                i.updateHotkeyVisibility();
              });
              t.toggleClass("mod-active", commandBeingCustomized === i.commandBeingCustomized);
            });
          },
          D = this,
          A = 0,
          P = k;
        A < P.length;
        A++
      ) {
        T((l = P[A]));
      }
      this.setDescription(C, E.size);
    };
    t.prototype.finishFilteringByHotkey = function () {
      this.filterHotkeyActiveEl.detach();
      this.app.keymap.popScope(this.filterHotkeyScope);
    };
    t.prototype.finishCustomizingHotkey = function () {
      this.app.keymap.popScope(this.setHotkeyScope);
      this.commandBeingCustomized = null;
      this.updateHotkeyVisibility();
    };
    return t;
  })(SettingTab),
  a1 = i18nProxy.setting.thirdPartyPlugin,
  s1 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.sortOrderOptions = ["download", "update", "release", "alphabetical"];
      n.setTitle(a1.name());
      n.modalEl.addClass("mod-community-plugin");
      n.search.setPlaceholder(a1.placeholderCommunityPlugins());
      n.sortOrder = localStorage.getItem("communityPluginSortOrder") || "download";
      return n;
    }
    __extends(t, e);
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      localStorage.setItem("communityPluginSortOrder", this.sortOrder);
    };
    t.prototype.setAutoOpen = function (selectedItemId) {
      this.selectedItemId = selectedItemId;
      return this;
    };
    t.prototype.loadItems = function () {
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
          switch (d.label) {
            case 0:
              d.trys.push([0, 2, , 3]);
              return [4, $1()];
            case 1:
              e = d.sent();
              return [3, 3];
            case 2:
              t = d.sent();
              console.error(t);
              return [3, 3];
            case 3:
              if (!e) throw new Error(a1.msgFailedLoadPlugins());
              n = {};
              d.label = 4;
            case 4:
              d.trys.push([4, 6, , 7]);
              return [4, e0()];
            case 5:
              n = d.sent();
              return [3, 7];
            case 6:
              i = d.sent();
              console.error(i);
              return [3, 7];
            case 7:
              for (
                r = {},
                  o = function (e) {
                    var t = e.id,
                      downloads = 0,
                      updated = 0;
                    if (n.hasOwnProperty(t)) {
                      var a = n[t];
                      downloads = (u = a.downloads) !== null && undefined !== u ? u : 0;
                      updated = (h = a.updated) !== null && undefined !== h ? h : 0;
                    }
                    var s = createDiv("community-item");
                    s.addEventListener("click", function () {
                      return p.selectItem(t);
                    });
                    r[t] = __assign(__assign({}, e), {
                      downloads: downloads,
                      updated: updated,
                      el: s,
                      nameEl: null,
                      authorEl: null,
                      descEl: null,
                      init: false,
                    });
                  },
                  a = 0,
                  s = e;
                a < s.length;
                a++
              ) {
                l = s[a];
                o(l);
              }
              (c = this.selectedItemId) && !r.hasOwnProperty(c) && this.search.setValue(c.split("-").join(" "));
              return [2, r];
          }
        });
      });
    };
    t.prototype.updateItems = function () {
      var e = this.items,
        t = this.search.getValue().trim().toLowerCase(),
        n = this.installedOnlyToggle.getValue(),
        i = this.app.plugins.manifests,
        r = t.split(" "),
        o = [];
      for (var a in e) {
        if (e.hasOwnProperty(a))
          if ((g = e[a]).id && g.name && g.repo && ((g.matches = null), (g.score = 0), !n || i.hasOwnProperty(g.id)))
            if (t === "") o.push(g);
            else {
              var s = g.name,
                l = g.author,
                c = g.description;
              if (!s) continue;
              l = l || "";
              c = c || "";
              var u = s.toLowerCase() + l.toLowerCase() + c.toLowerCase();
              g.matches = Gx(r, u);
              g.matches && (o.push(g), (g.score = qx(g.matches, u.length, t.length, 0)));
            }
      }
      this.sortItems(o);
      this.renderQueue.clear();
      for (
        var h = 0,
          p = function (e) {
            var t = function () {
              var t = e.el,
                n = e.nameEl,
                r = e.authorEl,
                o = e.descEl,
                a = e.id,
                s = e.name,
                l = e.author,
                c = e.description,
                u = e.matches;
              if (((l = l || ""), (c = c || ""), !e.init)) {
                var h = e.downloads,
                  p = e.updated;
                if (
                  ((n = e.nameEl = t.createDiv("community-item-name")),
                  (r = e.authorEl = t.createDiv("community-item-author")),
                  h)
                ) {
                  var d = t.createDiv("community-item-downloads");
                  d.createSpan({}, function (e) {
                    setIcon(e, "lucide-download-cloud");
                  });
                  d.createSpan({
                    cls: "community-item-downloads-text",
                    text: h.toLocaleString(),
                  });
                }
                p !== 0 &&
                  t.createDiv({
                    cls: "community-item-updated",
                    text: a1.labelLastUpdated({
                      time: window.moment(p).fromNow(),
                    }),
                  });
                o = e.descEl = t.createDiv({
                  cls: "community-item-desc",
                });
                e.init = true;
              }
              n.empty();
              r.empty();
              o.empty();
              renderMatches(n, s, u);
              i.hasOwnProperty(a) &&
                n.createSpan({
                  cls: "flair mod-pop",
                  text: a1.labelInstalled(),
                });
              l && (r.setText(a1.labelByAuthor()), renderMatches(r, l, u, -s.length));
              c && renderMatches(o, hc(c, 200), u, -(s.length + l.length));
              t.show();
            };
            e.el.hide();
            h < 20 ? t() : d.renderQueue.add(t);
            h++;
          },
          d = this,
          f = 0,
          m = o;
        f < m.length;
        f++
      ) {
        var g;
        p((g = m[f]));
      }
      var pluginCount = i18nProxy.nouns.pluginWithCount({
        count: o.length,
      });
      this.searchSummaryEl.setText(
        a1.labelSearchSummary({
          pluginCount: pluginCount,
        }),
      );
      return o;
    };
    t.prototype.showItem = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          texto0,
          texta0,
          s,
          l,
          c,
          u,
          h,
          version,
          d,
          f,
          m,
          g,
          textv0,
          w,
          k,
          href,
          E,
          S,
          M,
          x,
          T,
          D,
          A,
          P,
          L = this;
        return __generator(this, function (I) {
          switch (I.label) {
            case 0:
              n = (t = this).app;
              i = t.detailsEl;
              r = e.id;
              texto0 = e.name;
              texta0 = e.description;
              s = e.repo;
              l = XX(s, F1);
              c = XX(s, "README.md");
              u = null;
              I.label = 1;
            case 1:
              I.trys.push([1, 3, , 4]);
              return [4, requestWithWrapper(l).json];
            case 2:
              return (u = I.sent()).id && u.id === r ? [3, 4] : (new Notice("Plugin ID mismatch."), [2]);
            case 3:
              h = I.sent();
              console.error(h);
              new Notice(a1.msgFailedToLoadManifest());
              return [2];
            case 4:
              return [4, JX(s, u)];
            case 5:
              version = I.sent() || u.version;
              d = i.createDiv("community-modal-info");
              f = d.createDiv({
                cls: "community-modal-info-name",
                text: texto0,
              });
              (m = n.plugins.manifests[r]) &&
                f.createSpan({
                  cls: "flair mod-pop",
                  text: a1.labelInstalled(),
                });
              e.downloads &&
                d.createDiv("community-modal-info-downloads", function (t) {
                  t.createSpan({}, function (e) {
                    setIcon(e, "lucide-download-cloud");
                  });
                  t.createSpan({
                    cls: "community-modal-info-downloads-text",
                    text: e.downloads.toLocaleString(),
                  });
                });
              version &&
                ((g = d.createDiv({
                  cls: "community-modal-info-version",
                  text: a1.labelVersion({
                    version: version,
                  }),
                })),
                m &&
                  m.version &&
                  g.appendText(
                    a1.labelCurrentlyInstalledVersion({
                      version: m.version,
                    }),
                  ));
              (textv0 = e.author || u.author) &&
                ((w = d.createDiv({
                  cls: "community-modal-info-author",
                  text: a1.labelByAuthor(),
                })),
                u.authorUrl
                  ? w.createEl("a", {
                      href: u.authorUrl,
                      text: textv0,
                      attr: {
                        target: "_blank",
                        rel: "noopener",
                      },
                    })
                  : w.appendText(textv0));
              k = d.createDiv({
                cls: "community-modal-info-repo",
                text: a1.labelRepository(),
              });
              href = QX(s);
              k.createEl("a", {
                href: href,
                text: href,
                attr: {
                  target: "_blank",
                  rel: "noopener",
                },
              });
              e.updated !== 0 &&
                d.createDiv(
                  {
                    cls: "community-modal-info-repo",
                    text: a1.labelLastUpdate(),
                  },
                  function (t) {
                    t.createEl(
                      "a",
                      {
                        href: href + "/releases/latest",
                        text: window.moment(e.updated).fromNow(),
                        attr: {
                          target: "_blank",
                          rel: "noopener",
                        },
                      },
                      function (e) {
                        return setTooltip(e, a1.tooltipViewLastUpdate());
                      },
                    );
                  },
                );
              texta0 &&
                d.createDiv({
                  cls: "community-modal-info-desc",
                  text: texta0,
                });
              (E = !Platform.isDesktopApp && u.isDesktopOnly) &&
                d.createDiv({
                  cls: "mod-warning",
                  text: a1.labelUnsupported(),
                });
              S = d.createDiv("community-modal-button-container");
              (M = S.createEl("button", {
                cls: "mod-cta",
                text: a1.buttonInstall(),
              })).addEventListener("click", function () {
                return __awaiter(L, undefined, undefined, function () {
                  var t,
                    n = this;
                  return __generator(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return E ? (new Notice(a1.labelUnsupported()), [2]) : [4, JX(s, u)];
                      case 1:
                        return (t = i.sent())
                          ? [
                              4,
                              withModLoadingClass(M, function () {
                                return n.app.plugins.installPlugin(s, t, u);
                              }),
                            ]
                          : (new Notice("No appropriate version found."), [2]);
                      case 2:
                        i.sent();
                        this.update();
                        return [4, this.selectItem(e.id)];
                      case 3:
                        i.sent();
                        return [2];
                    }
                  });
                });
              });
              m &&
                (pG(m.version, version) ? M.setText(a1.buttonUpdate()) : M.detach(),
                (x = n.plugins.getPlugin(r)) &&
                  ((T = this.app.setting),
                  n.setting.pluginTabs.some(function (e) {
                    return e.id === r;
                  }) &&
                    S.createEl("button", {
                      text: i18nProxy.setting.options(),
                    }).addEventListener("click", function () {
                      L.close();
                      T.open();
                      T.openTabById(u.id);
                    }),
                  Object.keys(n.commands.commands).some(function (e) {
                    return e.startsWith(r + ":");
                  }) &&
                    S.createEl("button", {
                      text: i18nProxy.setting.hotkeys.name(),
                    }).addEventListener("click", function () {
                      L.close();
                      T.open();
                      var e = T.openTabById("hotkeys");
                      if (e instanceof o1) {
                        e.setQuery(u.id);
                      }
                    })),
                S.createEl("button", {
                  cls: x ? "mod-destructive" : "mod-cta",
                  text: a1(x ? "button-disable" : "button-enable"),
                }).addEventListener("click", function () {
                  return __awaiter(L, undefined, undefined, function () {
                    return __generator(this, function (t) {
                      switch (t.label) {
                        case 0:
                          return x ? [4, n.plugins.disablePluginAndSave(r)] : [3, 2];
                        case 1:
                          t.sent();
                          return [3, 4];
                        case 2:
                          return [4, n.plugins.enablePluginAndSave(r)];
                        case 3:
                          t.sent();
                          t.label = 4;
                        case 4:
                          return [4, this.selectItem(e.id)];
                        case 5:
                          t.sent();
                          return [2];
                      }
                    });
                  });
                }),
                S.createEl("button", {
                  cls: "mod-destructive",
                  text: a1.labelUninstall(),
                }).addEventListener("click", function () {
                  return __awaiter(L, undefined, undefined, function () {
                    return __generator(this, function (t) {
                      switch (t.label) {
                        case 0:
                          return [4, n.plugins.uninstallPlugin(r)];
                        case 1:
                          t.sent();
                          this.update();
                          return [4, this.selectItem(e.id)];
                        case 2:
                          t.sent();
                          return [2];
                      }
                    });
                  });
                }));
              S.createEl("button", {
                text: a1.buttonCopyShareLink(),
              }).addEventListener("click", function () {
                return __awaiter(L, undefined, undefined, function () {
                  return __generator(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, navigator.clipboard.writeText("obsidian://show-plugin?id=" + encodeURIComponent(r))];
                      case 1:
                        e.sent();
                        new Notice(i18nProxy.interface.copied());
                        return [2];
                    }
                  });
                });
              });
              u.fundingUrl &&
                S.createEl("button", {
                  text: a1.buttonDonate(),
                }).addEventListener("click", function () {
                  new l1(n, e.name, u.fundingUrl).open();
                });
              I.label = 6;
            case 6:
              I.trys.push([6, 8, , 9]);
              return [4, requestWithWrapper(c).text];
            case 7:
              D = I.sent();
              return [3, 9];
            case 8:
              I.sent();
              D = a1.labelNoReadme();
              return [3, 9];
            case 9:
              d.createEl("hr");
              A = d.createDiv("community-modal-readme markdown-rendered");
              P = renderMarkdown(parseMetadata(D));
              A.appendChild(sanitizeHTMLToDom(P));
              tQ(A, s);
              this.scrollIntoView(r);
              return [2];
          }
        });
      });
    };
    return t;
  })(e1),
  l1 = (function (e) {
    function t(t, namen0, texti0) {
      var r = e.call(this, t) || this;
      r.setTitle(
        a1.labelDonateModalTitle({
          name: namen0,
        }),
      );
      var o = document.createDocumentFragment();
      if (
        (o.createEl("p", {
          text: a1.labelDonateModalText1(),
        }),
        o.createEl("p", {
          text: a1.labelDonateModalText2(),
        }),
        o.createEl("p", {
          text: a1.labelDonateModalText3(),
        }),
        o.createEl("hr"),
        typeof texti0 == "string")
      )
        o.createEl(
          "p",
          {
            text: a1.labelSupportThisPlugin() + " ",
          },
          function (e) {
            e.createEl("a", {
              text: texti0,
              href: texti0,
              cls: "external-link",
              attr: {
                target: "_blank",
              },
            });
          },
        );
      else if (typeof texti0 == "object") {
        var a = function (e) {
          if (!texti0.hasOwnProperty(e)) return "continue";
          var textt0 = texti0[e];
          o.createEl(
            "p",
            {
              text: e + ": ",
            },
            function (e) {
              e.createEl("a", {
                text: textt0,
                href: textt0,
                cls: "external-link",
                attr: {
                  target: "_blank",
                },
              });
            },
          );
        };
        for (var s in texti0) a(s);
      }
      r.setContent(o);
      r.addButton("mod-cta", i18nProxy.dialogue.buttonDone(), function () {
        return r.close();
      });
      return r;
    }
    __extends(t, e);
    return t;
  })(GM),
  c1 = "theme.css",
  u1 = "manifest.json",
  h1 = i18nProxy.plugins.customCss;
var p1 = XX("obsidianmd/obsidian-releases", "community-css-themes.json"),
  d1 = ox(
    function () {
      return __awaiter(undefined, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, requestWithWrapper(p1).json];
            case 1:
              if (((e = t.sent()), !Array.isArray(e))) throw new Error("Failed to parse community themes.");
              return [2, e];
          }
        });
      });
    },
    3e5,
    6e4,
  ),
  f1 = ox(
    function () {
      return requestWithWrapper("https://releases.obsidian.md/stats/theme").json;
    },
    3e5,
    6e4,
  ),
  StyleManager = (function (e) {
    function t(app) {
      var n = e.call(this) || this;
      n.app = null;
      n.styleEl = null;
      n.extraStyleEls = [];
      n.boundRaw = n.onRaw.bind(n);
      n.oldThemes = [];
      n.themes = {};
      n.updates = {};
      n.snippets = [];
      n.enabledSnippets = new Set();
      n.csscache = new Map();
      n.theme = "";
      n.requestLoadTheme = debounce(n.loadTheme.bind(n), 100);
      n.requestLoadSnippets = debounce(n.loadSnippets.bind(n), 100);
      n.requestReadThemes = debounce(n.readThemes.bind(n), 2e3);
      n.queue = new ix();
      n.app = app;
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e.prototype.onload.call(this);
              t = this.app;
              this.loadData();
              return [4, this.readThemes()];
            case 1:
              n.sent();
              return [4, this.readSnippets()];
            case 2:
              n.sent();
              this.styleEl = document.head.createEl("style", {
                type: "text/css",
              });
              this.registerEvent(t.vault.on("raw", this.boundRaw));
              return [4, this.loadTheme()];
            case 3:
              n.sent();
              return [4, this.loadSnippets()];
            case 4:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.loadData = function () {
      var e = this.app.vault,
        t = e.getConfig("enabledCssSnippets");
      if (t) {
        this.enabledSnippets = new Set(t);
      }
      var theme = e.getConfig("cssTheme");
      theme && (this.theme = theme);
      e.getConfig("translucency") && this.enableTranslucency();
    };
    t.prototype.readThemes = function (e) {
      var t = this;
      return this.queue.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n, oldThemes, themes, o, a, s, l, dir, u, h, p, d, f, m, g, v, y, w;
          return __generator(this, function (b) {
            switch (b.label) {
              case 0:
                t = this.app;
                n = this.app.vault.adapter;
                oldThemes = [];
                themes = {};
                o = this.getThemeFolder();
                return [4, t.vault.exists(o)];
              case 1:
                return b.sent() ? [4, n.list(o)] : [3, 10];
              case 2:
                a = b.sent();
                s = 0;
                l = a.folders;
                b.label = 3;
              case 3:
                if (!(s < l.length)) return [3, 9];
                dir = l[s];
                u = getFilename(dir);
                h = normalizePath(dir + "/" + u1);
                p = normalizePath(dir + "/" + c1);
                b.label = 4;
              case 4:
                b.trys.push([4, 7, , 8]);
                return [4, n.exists(p)];
              case 5:
                return b.sent() ? [4, n.read(h)] : [3, 8];
              case 6:
                d = b.sent();
                return (f = JSON.parse(d)).name && f.name === u ? ((f.dir = dir), (themes[u] = f), [3, 8]) : [3, 8];
              case 7:
                m = b.sent();
                console.error(m);
                return [3, 8];
              case 8:
                s++;
                return [3, 3];
              case 9:
                for (g = 0, v = a.files; g < v.length; g++) {
                  y = v[g];
                  (w = getFilename(y)).startsWith(".") || getExtension(w) !== "css" || oldThemes.push(Qc(w));
                }
                b.label = 10;
              case 10:
                this.oldThemes = oldThemes;
                this.themes = themes;
                e && this.requestLoadTheme();
                return [2];
            }
          });
        });
      });
    };
    t.prototype.readSnippets = function (e) {
      var t = this;
      return this.queue.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n, snippets, r, o, a, s, l, c;
          return __generator(this, function (u) {
            switch (u.label) {
              case 0:
                t = this.app.vault;
                n = t.adapter;
                snippets = [];
                r = this.getSnippetsFolder();
                return [4, n.exists(r)];
              case 1:
                return u.sent() ? [4, n.list(r)] : [3, 3];
              case 2:
                for (o = u.sent(), a = 0, s = o.files; a < s.length; a++) {
                  l = s[a];
                  (c = getFilename(l)).startsWith(".") || getExtension(c) !== "css" || snippets.push(Qc(c));
                }
                u.label = 3;
              case 3:
                snippets.sort(Eb);
                this.snippets = snippets;
                e && this.requestLoadSnippets();
                return [2];
            }
          });
        });
      });
    };
    t.prototype.onRaw = function (e) {
      if (this.csscache.has(e)) {
        this.csscache.delete(e);
      }
      var t = getFilename(e),
        n = getExtension(t);
      e === this.getThemePath(this.theme) && this.requestLoadTheme();
      !e.startsWith(this.getThemeFolder()) || (t !== u1 && t !== c1 && n !== "css") || this.requestReadThemes();
      e.startsWith(this.getSnippetsFolder()) && n === "css" && this.readSnippets(!0);
    };
    t.prototype.loadTheme = function (e) {
      var t = this;
      return this.queue.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n, i, textContent;
          return __generator(this, function (o) {
            switch (o.label) {
              case 0:
                n = (t = this).styleEl;
                i = t.theme;
                textContent = "";
                return e ? ((textContent = e), [3, 3]) : [3, 1];
              case 1:
                return i ? [4, this.loadCss(this.getThemePath(i))] : [3, 3];
              case 2:
                textContent = o.sent();
                o.label = 3;
              case 3:
                n.textContent !== textContent &&
                  ((n.textContent = textContent),
                  this.app.workspace.trigger("css-change"),
                  this.app.workspace.trigger("resize"));
                return [2];
            }
          });
        });
      });
    };
    t.prototype.loadSnippets = function () {
      var e = this;
      return this.queue.queue(function () {
        return __awaiter(e, undefined, undefined, function () {
          var e, t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g;
          return __generator(this, function (v) {
            switch (v.label) {
              case 0:
                t = (e = this).styleEl;
                n = e.extraStyleEls;
                i = e.enabledSnippets;
                r = e.snippets;
                o = [];
                a = 0;
                s = r;
                v.label = 1;
              case 1:
                return a < s.length
                  ? ((l = s[a]), i.has(l) ? ((u = (c = o).push), [4, this.loadCss(this.getSnippetPath(l))]) : [3, 3])
                  : [3, 4];
              case 2:
                u.apply(c, [v.sent()]);
                v.label = 3;
              case 3:
                a++;
                return [3, 1];
              case 4:
                for (h = false, p = 0, d = t; p < o.length; p++) {
                  (f = n[p]) ||
                    ((f = createEl("style", {
                      type: "text/css",
                    })),
                    n.push(f),
                    d.parentNode.insertAfter(f, d),
                    (h = true));
                  f.textContent !== o[p] && ((f.textContent = o[p]), (h = true));
                  d = f;
                }
                for (m = n.length - o.length, g = 0; g < m; g++) {
                  n.pop().detach();
                  h = true;
                }
                h && (this.app.workspace.trigger("css-change"), this.app.workspace.trigger("resize"));
                return [2];
            }
          });
        });
      });
    };
    t.prototype.loadCss = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return (t = this.csscache).has(e) ? [2, t.get(e)] : [4, (n = this.app.vault.adapter).exists(e)];
            case 1:
              return r.sent() ? [4, n.read(e)] : [3, 3];
            case 2:
              i = r.sent();
              t.set(e, i);
              return [2, i];
            case 3:
              return [2, null];
          }
        });
      });
    };
    t.prototype.setCssEnabledStatus = function (e, t) {
      var n = this.enabledSnippets;
      t ? n.add(e) : n.delete(e);
      this.app.vault.setConfig("enabledCssSnippets", Array.from(n));
      this.requestLoadSnippets();
    };
    t.prototype.setTheme = function (theme) {
      this.theme = theme;
      this.app.vault.setConfig("cssTheme", theme);
      this.requestLoadTheme();
    };
    t.prototype.setTranslucency = function (e) {
      this.app.vault.setConfig("translucency", e);
      e ? this.enableTranslucency() : this.disableTranslucency();
    };
    t.prototype.enableTranslucency = function () {
      if (Platform.isDesktopApp && isDarwin())
        try {
          setSidebarForDarwin(electronWindow, !0);
          document.body.addClass("is-translucent");
        } catch (e) {
          new Notice(i18nProxy.interface.msgUpgradeInstaller());
        }
    };
    t.prototype.disableTranslucency = function () {
      if (Platform.isDesktopApp && isDarwin()) {
        document.body.removeClass("is-translucent");
        try {
          setSidebarForDarwin(electronWindow, !1);
        } catch (e) {}
      }
    };
    t.prototype.isDarkMode = function () {
      return document.body.hasClass("theme-dark");
    };
    t.prototype.getThemeFolder = function () {
      return "".concat(this.app.vault.configDir, "/themes");
    };
    t.prototype.getSnippetsFolder = function () {
      return "".concat(this.app.vault.configDir, "/snippets");
    };
    t.prototype.getThemePath = function (e) {
      return !this.themes.hasOwnProperty(e) && this.oldThemes.contains(e)
        ? "".concat(this.getThemeFolder(), "/").concat(e, ".css")
        : "".concat(this.getThemeFolder(), "/").concat(e, "/").concat(c1);
    };
    t.prototype.getSnippetPath = function (e) {
      return "".concat(this.getSnippetsFolder(), "/").concat(e, ".css");
    };
    t.prototype.removeTheme = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              t = this.app.vault.adapter;
              n = this.getThemeFolder();
              i = "".concat(n, "/").concat(e);
              return [4, t.exists(i)];
            case 1:
              return a.sent() ? [4, t.rmdir(i, !0)] : [3, 3];
            case 2:
              a.sent();
              a.label = 3;
            case 3:
              r = "".concat(n, "/").concat(e, ".css");
              return (o = this.oldThemes.contains(e)) ? [4, t.exists(r)] : [3, 5];
            case 4:
              o = a.sent();
              a.label = 5;
            case 5:
              return o ? [4, t.remove(r)] : [3, 7];
            case 6:
              a.sent();
              a.label = 7;
            case 7:
              return [4, this.readThemes()];
            case 8:
              a.sent();
              this.theme === e && this.setTheme("");
              return [2];
          }
        });
      });
    };
    t.prototype.downloadLegacyTheme = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, requestWithWrapper(XX(e.repo, "obsidian.css")).text];
            case 1:
              return [2, t.sent()];
          }
        });
      });
    };
    t.prototype.isThemeInstalled = function (e) {
      return this.themes.hasOwnProperty(e) || this.oldThemes.contains(e);
    };
    t.prototype.hasUpdates = function () {
      return this.updates && Object.keys(this.updates).length > 0;
    };
    t.prototype.checkForUpdate = function (themeInfo) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s, l, c, u, h, version, d, f;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              if (
                ((t = this.getThemeFolder()),
                (n = this.updates || {}),
                (i = themeInfo.name),
                (r = themeInfo.repo),
                !this.isThemeInstalled(i))
              )
                return [2];
              o = (d = this.themes[i]) === null || undefined === d ? undefined : d.version;
              a = XX(r, u1);
              s = null;
              m.label = 1;
            case 1:
              m.trys.push([1, 3, , 4]);
              return [4, requestWithWrapper(a).json];
            case 2:
              return (s = m.sent()) && s.name && s.name === i ? [3, 4] : [2];
            case 3:
              m.sent();
              return [3, 4];
            case 4:
              return s ? [3, 10] : [4, this.downloadLegacyTheme(themeInfo)];
            case 5:
              l = m.sent();
              c = !!((f = this.themes[themeInfo.name]) === null || undefined === f ? undefined : f.dir);
              u = c ? "".concat(t, "/").concat(i, "/").concat(c1) : "".concat(t, "/").concat(i, ".css");
              h = "";
              m.label = 6;
            case 6:
              m.trys.push([6, 8, , 9]);
              return [4, this.app.vault.adapter.read(u)];
            case 7:
              h = m.sent();
              return [3, 9];
            case 8:
              m.sent();
              return [2, !1];
            case 9:
              return l !== h
                ? ((n[i] = {
                    themeInfo: themeInfo,
                  }),
                  [2, !0])
                : [2, !1];
            case 10:
              return [4, JX(r, s)];
            case 11:
              version = m.sent();
              return !o || (version && pG(o, version))
                ? ((n[i] = {
                    themeInfo: themeInfo,
                    version: version,
                  }),
                  [2, !0])
                : [2, !1];
          }
        });
      });
    };
    t.prototype.checkForUpdates = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, count;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              this.updates = {};
              a.label = 1;
            case 1:
              a.trys.push([1, 3, , 4]);
              return [4, d1()];
            case 2:
              e = a.sent();
              return [3, 4];
            case 3:
              t = a.sent();
              console.error(t);
              new Notice(h1.msgFailedToInstallTheme());
              return [2];
            case 4:
              n = 0;
              i = e;
              a.label = 5;
            case 5:
              return n < i.length ? ((r = i[n]), [4, this.checkForUpdate(r)]) : [3, 8];
            case 6:
              a.sent();
              a.label = 7;
            case 7:
              n++;
              return [3, 5];
            case 8:
              count = Object.keys(this.updates).length;
              new Notice(
                count === 0
                  ? h1.msgNoUpdatesFound()
                  : h1.msgUpdatesFound({
                      count: count,
                    }),
              );
              return [2];
          }
        });
      });
    };
    t.prototype.installLegacyTheme = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = this.app.vault;
              n = e.name;
              return [4, this.downloadLegacyTheme(e)];
            case 1:
              i = l.sent();
              r = this.getThemeFolder();
              return [4, t.exists(r)];
            case 2:
              return l.sent() ? [3, 4] : [4, t.createFolder(r)];
            case 3:
              l.sent();
              l.label = 4;
            case 4:
              o = "".concat(r, "/").concat(n);
              return [4, t.exists(o)];
            case 5:
              return l.sent() ? [3, 7] : [4, t.createFolder(o)];
            case 6:
              l.sent();
              l.label = 7;
            case 7:
              a = {
                name: (c = e).name,
                version: "0.0.0",
                minAppVersion: "0.16.0",
                author: c.author,
              };
              return [4, t.adapter.write(o + "/" + c1, i)];
            case 8:
              l.sent();
              return [4, t.adapter.write(o + "/" + u1, JSON.stringify(a, null, 4))];
            case 9:
              l.sent();
              s = "".concat(r, "/").concat(n, ".css");
              return [4, t.adapter.exists(s)];
            case 10:
              return l.sent() ? [4, t.adapter.remove(s)] : [3, 12];
            case 11:
              l.sent();
              l.label = 12;
            case 12:
              return [4, this.readThemes()];
            case 13:
              l.sent();
              return [2];
          }
          var c;
        });
      });
    };
    t.prototype.installTheme = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var namen0, i, r, o, a, s, l, c, u, h, p, d, f;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              namen0 = e.name;
              i = e.repo;
              (r = new Notice(
                h1.msgInstallingTheme({
                  name: namen0,
                }),
                0,
              )).containerEl.addClass("is-loading");
              try {
                o = [];
                (a = localStorage.getItem("local-themes")) && ((o = JSON.parse(a)), Array.isArray(o) || (o = []));
                o.contains(namen0) ||
                  (o.push(namen0),
                  localStorage.setItem("local-themes", JSON.stringify(o)),
                  ajax({
                    method: "POST",
                    url: "https://releases.obsidian.md/stats/theme/".concat(encodeURIComponent(namen0), "/download"),
                  }));
              } catch (e) {
                console.error(e);
              }
              return t ? [3, 2] : [4, this.installLegacyTheme(e)];
            case 1:
              m.sent();
              delete this.updates[namen0];
              r.hide();
              return [2];
            case 2:
              m.trys.push([2, 5, , 13]);
              return [4, requestWithWrapper($X(i, t, u1)).text];
            case 3:
              s = m.sent();
              return [4, requestWithWrapper($X(i, t, c1)).text];
            case 4:
              l = m.sent();
              return [3, 13];
            case 5:
              if (((c = m.sent()), s || !(c instanceof HttpError) || c.status !== 404)) return [3, 11];
              m.label = 6;
            case 6:
              m.trys.push([6, 9, , 10]);
              return [4, requestWithWrapper(XX(i, u1)).text];
            case 7:
              s = m.sent();
              return [4, requestWithWrapper(XX(i, c1)).text];
            case 8:
              l = m.sent();
              return [3, 10];
            case 9:
              u = m.sent();
              console.error(u);
              r.containerEl.removeClass("is-loading");
              r.containerEl.addClass("mod-error");
              r.setMessage(
                h1.msgFailedToInstallTheme({
                  name: namen0,
                }),
              );
              setTimeout(function () {
                return r.hide();
              }, 3e3);
              return [2];
            case 10:
              return [3, 12];
            case 11:
              console.error(c);
              r.containerEl.removeClass("is-loading");
              r.containerEl.addClass("mod-error");
              r.setMessage(
                h1.msgFailedToInstallTheme({
                  name: namen0,
                }),
              );
              setTimeout(function () {
                return r.hide();
              }, 3e3);
              return [2];
            case 12:
              return [3, 13];
            case 13:
              return JSON.parse(s).name !== namen0
                ? (r.containerEl.removeClass("is-loading"),
                  r.setMessage(
                    h1.msgFailedToInstallTheme({
                      name: namen0,
                    }) + " Theme name mismatch.",
                  ),
                  setTimeout(function () {
                    return r.hide();
                  }, 3e3),
                  [2])
                : ((h = this.app.vault.adapter), (p = this.getThemeFolder()), [4, h.exists(p)]);
            case 14:
              return m.sent() ? [3, 16] : [4, h.mkdir(p)];
            case 15:
              m.sent();
              m.label = 16;
            case 16:
              d = p + "/" + namen0;
              return [4, h.exists(d)];
            case 17:
              return m.sent() ? [3, 19] : [4, h.mkdir(d)];
            case 18:
              m.sent();
              m.label = 19;
            case 19:
              return [4, h.write(d + "/" + u1, s)];
            case 20:
              m.sent();
              return [4, h.write(d + "/" + c1, l)];
            case 21:
              m.sent();
              f = "".concat(p, "/").concat(namen0, ".css");
              return [4, h.exists(f)];
            case 22:
              return m.sent() ? [4, h.remove(f)] : [3, 24];
            case 23:
              m.sent();
              m.label = 24;
            case 24:
              r.setMessage(
                h1.msgSuccessfullyInstalledTheme({
                  name: namen0,
                }),
              );
              r.containerEl.removeClass("is-loading");
              r.containerEl.addClass("mod-success");
              setTimeout(function () {
                return r.hide();
              }, 3e3);
              delete this.updates[namen0];
              return [4, this.readThemes()];
            case 25:
              m.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.getManifest = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = XX(e, u1);
              n = null;
              i.label = 1;
            case 1:
              i.trys.push([1, 3, , 4]);
              return [4, requestWithWrapper(t).json];
            case 2:
              n = i.sent();
              return [3, 4];
            case 3:
              i.sent();
              return [3, 4];
            case 4:
              return [2, n];
          }
        });
      });
    };
    return t;
  })(Component),
  g1 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.requestThemePreview = debounce(n.previewTheme, 100, !0);
      n.initialTheme = t.customCss.theme;
      n.setInstructions([
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
      n.scope.register(null, "Tab", function () {
        return !1;
      });
      n.scope.register(null, "Enter", function (e) {
        if (!e.isComposing) {
          n.selectActiveSuggestion(e);
          return !1;
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      var e = this.app.customCss,
        t = [];
      for (var namen0 in (t.push({
        name: "",
        display: i18nProxy.setting.appearance.labelDefaultTheme(),
      }),
      e.themes))
        t.push({
          name: namen0,
          display: namen0,
        });
      for (var i = 0, r = e.oldThemes; i < r.length; i++) {
        namen0 = r[i];
        if (!e.themes.hasOwnProperty(namen0)) {
          t.push({
            name: namen0,
            display: namen0 + " (Legacy)",
          });
        }
      }
      return t;
    };
    t.prototype.renderSuggestion = function (t, n) {
      e.prototype.renderSuggestion.call(this, t, n);
      t.item.name === this.initialTheme &&
        n.createSpan({
          cls: "flair mod-pop",
          text: i18nProxy.setting.appearance.labelCurrentlyActive(),
        });
    };
    t.prototype.getItemText = function (e) {
      return e.display;
    };
    t.prototype.onChooseItem = function (e, t) {
      this.app.customCss.setTheme(e.name);
    };
    t.prototype.onSelectedChange = function (e, t) {
      if (t && t.instanceOf(KeyboardEvent)) {
        this.requestThemePreview(e.item.name);
      }
    };
    t.prototype.previewTheme = function (e) {
      if (this.isOpen) {
        this.app.customCss.setTheme(e);
      }
    };
    t.prototype.onEscapeKey = function (t) {
      e.prototype.onEscapeKey.call(this, t);
      this.app.customCss.setTheme(this.initialTheme);
    };
    return t;
  })(FuzzySuggestModal),
  v1 = i18nProxy.plugins.customCss,
  y1 = i18nProxy.setting.thirdPartyPlugin,
  b1 = (function (e) {
    function t(t, onlyShowUpdates) {
      var i = e.call(this, t) || this;
      i.sortOrderOptions = ["download", "release", "alphabetical"];
      i.setTitle(v1.settingCommunityThemes());
      i.modalEl.addClass("mod-community-theme");
      i.search.setPlaceholder(v1.promptFilter());
      i.sortOrder = localStorage.getItem("communityThemeSortOrder") || "download";
      i.onlyShowUpdates = onlyShowUpdates;
      var r = cx((i.imageResizeQueue = new sx()).generator(), {
        batchSize: 1,
        maxDelay: 100,
      });
      __awaiter(i, undefined, undefined, function () {
        var e, t, n, i, o, a, s, error, c, u, h, p;
        return __generator(this, function (d) {
          switch (d.label) {
            case 0:
              d.trys.push([0, 5, 6, 11]);
              e = true;
              t = __asyncValues(r);
              d.label = 1;
            case 1:
              return [4, t.next()];
            case 2:
              if (((n = d.sent()), (c = n.done))) return [3, 4];
              if (((p = n.value), (e = false), !(i = p).isShown())) return [3, 3];
              if (i.naturalWidth > 640 || i.naturalHeight > 320)
                try {
                  o = activeDocument.createElement("canvas");
                  (a = o.getContext("2d")).imageSmoothingQuality = "high";
                  s = Math.min(512 / i.naturalWidth, 288 / i.naturalHeight);
                  o.width = Math.floor(i.naturalWidth * s);
                  o.height = Math.floor(i.naturalHeight * s);
                  a.drawImage(i, 0, 0, o.width, o.height);
                  i.src = o.toDataURL();
                } catch (e) {
                  console.log("Unable to downsize theme image", e);
                }
              d.label = 3;
            case 3:
              e = true;
              return [3, 1];
            case 4:
              return [3, 11];
            case 5:
              error = d.sent();
              u = {
                error: error,
              };
              return [3, 11];
            case 6:
              d.trys.push([6, , 9, 10]);
              return e || c || !(h = t.return) ? [3, 8] : [4, h.call(t)];
            case 7:
              d.sent();
              d.label = 8;
            case 8:
              return [3, 10];
            case 9:
              if (u) throw u.error;
              return [7];
            case 10:
              return [7];
            case 11:
              return [2];
          }
        });
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      localStorage.setItem("communityThemeSortOrder", this.sortOrder);
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          this.onlyShowUpdates
            ? (this.currentModeToggleSetting.settingEl.detach(), this.installedOnlyToggleSetting.settingEl.detach())
            : this.app.vault.getConfig("theme") === "system" &&
              (this.currentModeToggleSetting.settingEl.detach(), this.currentModeToggle.setValue(!1));
          e.prototype.onOpen.call(this);
          return [2];
        });
      });
    };
    t.prototype.addCustomControls = function (e) {
      var t = this;
      this.currentModeToggleSetting = new Setting(e)
        .setName(this.app.vault.getConfig("theme") === "obsidian" ? v1.labelDarkThemeOnly() : v1.labelLightThemeOnly())
        .addToggle(function (e) {
          return (t.currentModeToggle = e
            .setSmall()
            .setValue(!0)
            .onChange(function () {
              return t.update();
            }));
        });
    };
    t.prototype.setAutoOpen = function (selectedItemId) {
      this.selectedItemId = selectedItemId;
      return this;
    };
    t.prototype.loadItems = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, v, namey0, w, namek0, author, repo, modes, screenshot;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              e = this.app.customCss;
              t = {};
              n = {};
              i = d1();
              r = f1();
              b.label = 1;
            case 1:
              b.trys.push([1, 3, , 4]);
              return [4, i];
            case 2:
              for (o = b.sent(), a = 0, s = o; a < s.length; a++) {
                l = s[a];
                t[l.name] = l;
              }
              return [3, 4];
            case 3:
              c = b.sent();
              console.error(c);
              return [3, 4];
            case 4:
              if (Object.keys(t).length === 0) throw new Error(v1.msgLoadError());
              b.label = 5;
            case 5:
              b.trys.push([5, 7, , 8]);
              return [4, r];
            case 6:
              n = b.sent();
              return [3, 8];
            case 7:
              u = b.sent();
              console.error(u);
              return [3, 8];
            case 8:
              for (namey0 in ((h = function (e) {
                return n[e] ? n[e].download : 0;
              }),
              ((p = {})[""] = this.addThemeCard({
                name: "",
                author: "Obsidian",
                modes: ["dark", "light"],
                screenshot: e.isDarkMode() ? "dark.png" : "light.png",
                repo: "obsidianmd/obsidian-releases",
                downloads: 0,
              })),
              e.themes)) {
                d = e.themes[namey0];
                v = t[namey0] || {};
                p[namey0] = this.addThemeCard(
                  __assign(
                    __assign(
                      __assign(
                        {
                          name: namey0,
                          author: "",
                          modes: ["dark", "light"],
                          screenshot: "",
                          repo: "",
                        },
                        v,
                      ),
                      d,
                    ),
                    {
                      downloads: h(namey0),
                    },
                  ),
                );
              }
              for (f = 0, m = e.oldThemes; f < m.length; f++) {
                namey0 = m[f];
                e.themes.hasOwnProperty(namey0) ||
                  ((v = t[namey0] || {}),
                  (p[namey0] = this.addThemeCard(
                    __assign(
                      __assign(
                        {
                          name: namey0,
                          author: "",
                          modes: ["dark", "light"],
                          screenshot: "",
                          repo: "",
                        },
                        v,
                      ),
                      {
                        downloads: h(namey0),
                      },
                    ),
                  )));
              }
              for (namey0 in t)
                if (!p.hasOwnProperty(namey0)) {
                  w = t[namey0];
                  namek0 = w.name;
                  author = w.author;
                  repo = w.repo;
                  modes = w.modes;
                  screenshot = w.screenshot;
                  w.legacy ||
                    (p[namey0] = this.addThemeCard({
                      name: namek0,
                      author: author,
                      repo: repo,
                      modes: modes,
                      screenshot: screenshot,
                      downloads: h(namey0),
                    }));
                }
              return [2, p];
          }
        });
      });
    };
    t.prototype.addThemeCard = function (e) {
      var t = this,
        namen0 = e.name,
        author = e.author,
        repo = e.repo,
        modes = e.modes,
        screenshot = e.screenshot,
        downloads = e.downloads,
        l = createDiv("community-item");
      l.addEventListener("click", function () {
        return t.selectItem(namen0);
      });
      return {
        name: namen0,
        author: author,
        repo: repo,
        modes: modes,
        screenshot: screenshot,
        downloads: downloads,
        el: l,
        nameEl: null,
        authorEl: null,
        updateIconEl: null,
        updated: 0,
        init: false,
      };
    };
    t.prototype.updateItems = function () {
      var e = this,
        t = this.items,
        n = this.app.customCss,
        i = this.search.getValue().trim().toLowerCase(),
        r = this.installedOnlyToggle.getValue(),
        o = this.onlyShowUpdates,
        a = !o && this.currentModeToggle.getValue(),
        s = new Set(n.oldThemes.concat(Object.keys(n.themes)).concat("")),
        l = n.isDarkMode() ? "dark" : "light",
        c = i.split(" "),
        u = [],
        h = null;
      for (var p in t) {
        if (t.hasOwnProperty(p))
          if (
            ((k = t[p]).name === "" && (h = k),
            (!r || s.has(k.name)) && (!a || k.modes.contains(l)) && (!o || n.updates.hasOwnProperty(k.name)))
          )
            if (((k.matches = null), (k.score = 0), i === "")) u.push(k);
            else {
              var d = k.name,
                f = k.author;
              if (!d) continue;
              f = f || "";
              var m = d.toLowerCase() + f.toLowerCase();
              k.matches = Gx(c, m);
              k.matches && (u.push(k), (k.score = qx(k.matches, m.length, i.length, 0)));
            }
      }
      this.sortItems(u);
      h && u.contains(h) && (u.remove(h), u.unshift(h));
      this.renderQueue.clear();
      for (
        var g = 0,
          v = function (t) {
            var i = function () {
              var i = t.el,
                r = t.nameEl,
                o = t.authorEl,
                a = t.updateIconEl,
                l = t.name,
                c = t.author,
                u = t.matches,
                h = l === "";
              if (!t.init) {
                var p = t.downloads,
                  d = t.repo,
                  f = t.screenshot;
                if (
                  ((r = t.nameEl = i.createDiv("community-item-name")),
                  (o = t.authorEl = i.createDiv("community-item-author")),
                  (a = t.updateIconEl = i.createDiv("community-item-badge mod-update")),
                  !h && p)
                ) {
                  var m = i.createDiv("community-item-downloads");
                  m.createSpan({}, function (e) {
                    setIcon(e, "lucide-download-cloud");
                  });
                  m.createSpan({
                    cls: "community-item-downloads-text",
                    text: p.toLocaleString(),
                  });
                }
                if (d && f) {
                  var g = i.createEl("img", {
                    cls: "community-item-screenshot",
                    attr: {
                      alt: l,
                      loading: "lazy",
                    },
                  });
                  g.crossOrigin = "anonymous";
                  g.style.opacity = "0";
                  g.src = XX(d, f);
                  g.addEventListener("load", function () {
                    g.style.opacity = "";
                    (g.naturalWidth > 640 || g.naturalHeight > 320) && e.imageResizeQueue.add(g);
                  });
                } else
                  i.createDiv("community-item-screenshot mod-unavailable", function (e) {
                    setIcon(e.createDiv("placeholder-icon"), "lucide-camera-off");
                  });
                t.init = true;
              }
              var v = s.has(l),
                y = n.theme === l && (v || h);
              i.toggleClass("mod-active", y);
              r.empty();
              h && (l = i18nProxy.setting.appearance.labelDefaultTheme());
              renderMatches(r, l, u);
              y
                ? r.createSpan({
                    cls: "flair mod-pop",
                    text: i18nProxy.setting.appearance.labelCurrentlyActive(),
                  })
                : n.oldThemes.contains(l) && !n.themes.hasOwnProperty(l)
                  ? r.createSpan({
                      cls: "flair",
                      text: v1.labelLegacy(),
                    })
                  : (v || h) &&
                    r.createSpan({
                      cls: "flair",
                      text: v1.labelInstalled(),
                    });
              o.empty();
              c && (o.setText(y1.labelByAuthor()), renderMatches(o, c, u, -l.length));
              n.updates.hasOwnProperty(t.name)
                ? (a.firstChild || (setIcon(a, "lucide-alert-triangle"), setTooltip(a, v1.labelUpdateAvailable())),
                  a.show())
                : a.hide();
              i.show();
            };
            t.el.hide();
            g < 20 ? i() : y.renderQueue.add(i);
            g++;
          },
          y = this,
          b = 0,
          w = u;
        b < w.length;
        b++
      ) {
        var k;
        v((k = w[b]));
      }
      var themeCount = i18nProxy.nouns.themeWithCount({
        count: u.length,
      });
      this.searchSummaryEl.setText(
        v1.labelSearchSummary({
          themeCount: themeCount,
        }),
      );
      return u;
    };
    t.prototype.showItem = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          texto0,
          a,
          s,
          l,
          c,
          u,
          versionh0,
          p,
          version,
          f,
          m,
          g,
          textv0,
          w,
          k,
          href,
          E,
          S,
          M,
          x,
          T,
          D,
          A,
          P = this;
        return __generator(this, function (L) {
          switch (L.label) {
            case 0:
              n = (t = this).app;
              i = t.detailsEl;
              r = n.customCss;
              texto0 = e.name;
              a = e.repo;
              s = texto0 === "";
              l = r.isThemeInstalled(texto0);
              c = r.theme === texto0 && (s || l);
              u = r.oldThemes.contains(texto0) && !r.themes.hasOwnProperty(texto0);
              s && (texto0 = i18nProxy.setting.appearance.labelDefaultTheme());
              versionh0 = "";
              r.themes.hasOwnProperty(e.name) && (versionh0 = r.themes[e.name].version || "");
              return [4, r.getManifest(e.repo)];
            case 1:
              p = L.sent();
              version = "";
              return p ? [4, JX(a, p)] : [3, 3];
            case 2:
              version = L.sent() || p.version;
              L.label = 3;
            case 3:
              f = i.createDiv("community-modal-info");
              m = f.createDiv({
                cls: "community-modal-info-name",
                text: texto0,
              });
              l &&
                m.createSpan({
                  cls: "flair mod-pop",
                  text: u ? v1.labelLegacy() : y1.labelInstalled(),
                });
              e.downloads &&
                f.createDiv("community-modal-info-downloads", function (t) {
                  t.createSpan({}, function (e) {
                    setIcon(e, "lucide-download-cloud");
                  });
                  t.createSpan({
                    cls: "community-modal-info-downloads-text",
                    text: e.downloads.toLocaleString(),
                  });
                });
              version &&
                ((g = f.createDiv({
                  cls: "community-modal-info-version",
                  text: y1.labelVersion({
                    version: version,
                  }),
                })),
                l &&
                  versionh0 &&
                  g.appendText(
                    y1.labelCurrentlyInstalledVersion({
                      version: versionh0,
                    }),
                  ));
              (textv0 = e.author || (p && p.author)) &&
                ((w = f.createDiv({
                  cls: "community-modal-info-author",
                  text: y1.labelByAuthor(),
                })),
                p && p.authorUrl
                  ? w.createEl("a", {
                      href: p.authorUrl,
                      text: textv0,
                      attr: {
                        target: "_blank",
                        rel: "noopener",
                      },
                    })
                  : w.appendText(textv0));
              a &&
                !s &&
                ((k = f.createDiv({
                  cls: "community-modal-info-repo",
                  text: y1.labelRepository(),
                })),
                (href = QX(a)),
                k.createEl("a", {
                  href: href,
                  text: href,
                  attr: {
                    target: "_blank",
                    rel: "noopener",
                  },
                }));
              E = function (t) {
                return __awaiter(P, undefined, undefined, function () {
                  var n,
                    i = this;
                  return __generator(this, function (s) {
                    switch (s.label) {
                      case 0:
                        n = null;
                        return p ? [4, JX(a, p)] : [3, 2];
                      case 1:
                        if (!(n = s.sent())) {
                          new Notice("No appropriate version found.");
                          return [2];
                        }
                        s.label = 2;
                      case 2:
                        return [
                          4,
                          withLoadingClass(t, function () {
                            return __awaiter(i, undefined, undefined, function () {
                              return __generator(this, function (t) {
                                return [2, r.installTheme(e, n)];
                              });
                            });
                          }),
                        ];
                      case 3:
                        s.sent();
                        this.update();
                        return [4, this.selectItem(texto0)];
                      case 4:
                        s.sent();
                        return [2];
                    }
                  });
                });
              };
              S = f.createDiv("community-modal-button-container");
              c
                ? s
                  ? S.createEl("button", {
                      text: i18nProxy.setting.appearance.labelCurrentlyActive(),
                      attr: {
                        disabled: !0,
                      },
                    })
                  : S.createEl("button", {
                      text: v1.labelStopUse(),
                    }).addEventListener("click", function () {
                      return __awaiter(P, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              r.setTheme("");
                              this.update();
                              return [4, this.selectItem(texto0)];
                            case 1:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    })
                : (M = S.createEl("button", {
                    cls: "mod-cta",
                    text: s || l ? v1.labelUse() : v1.labelInstallAndUse(),
                  })).addEventListener("click", function () {
                    return __awaiter(P, undefined, undefined, function () {
                      return __generator(this, function (t) {
                        switch (t.label) {
                          case 0:
                            return s || l ? [3, 2] : [4, E(M)];
                          case 1:
                            t.sent();
                            t.label = 2;
                          case 2:
                            r.setTheme(e.name);
                            this.update();
                            return [4, this.selectItem(texto0)];
                          case 3:
                            t.sent();
                            return [2];
                        }
                      });
                    });
                  });
              !s &&
                l &&
                (r.updates.hasOwnProperty(e.name) || pG(versionh0, version)
                  ? (x = S.createEl("button", {
                      cls: "mod-cta",
                      text: v1.labelUpdate(),
                    })).addEventListener("click", function () {
                      return __awaiter(P, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, E(x)];
                            case 1:
                              e.sent();
                              this.update();
                              return [4, this.selectItem(texto0)];
                            case 2:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    })
                  : p ||
                    S.createEl("button", {
                      text: i18nProxy.setting.appearance.buttonCheckForUpdates(),
                    }).addEventListener("click", function () {
                      return __awaiter(P, undefined, undefined, function () {
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, r.checkForUpdate(e)];
                            case 1:
                              return t.sent() ? [3, 2] : (new Notice(v1.msgNoUpdatesFound()), [3, 4]);
                            case 2:
                              return [4, this.selectItem(texto0)];
                            case 3:
                              t.sent();
                              t.label = 4;
                            case 4:
                              return [2];
                          }
                        });
                      });
                    }));
              r.isThemeInstalled(texto0) &&
                S.createEl("button", {
                  text: y1.labelUninstall(),
                }).addEventListener("click", function () {
                  return __awaiter(P, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, r.removeTheme(texto0)];
                        case 1:
                          e.sent();
                          this.update();
                          return [4, this.selectItem(texto0)];
                        case 2:
                          e.sent();
                          new Notice(
                            v1.msgDeletedTheme({
                              title: texto0,
                            }),
                          );
                          return [2];
                      }
                    });
                  });
                });
              return s
                ? ((T =
                    "\nA simple theme designed to feel intuitive across all platforms. Supports light and dark mode.\n"),
                  [3, 7])
                : [3, 4];
            case 4:
              L.trys.push([4, 6, , 7]);
              return [4, requestWithWrapper(XX(a, "README.md")).text];
            case 5:
              T = L.sent();
              return [3, 7];
            case 6:
              L.sent();
              T = v1.labelNoReadme();
              return [3, 7];
            case 7:
              f.createEl("hr");
              D = f.createDiv("community-modal-readme markdown-rendered");
              A = renderMarkdown(parseMetadata(T));
              D.appendChild(sanitizeHTMLToDom(A));
              tQ(D, a);
              e.el &&
                !Platform.isPhone &&
                e.el.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              return [2];
          }
        });
      });
    };
    return t;
  })(e1);
const w1 = b1;
function k1(e) {
  if (e.deltaY) {
    var t = e.currentTarget;
    Math.abs(e.deltaX) > Math.abs(e.deltaY) ? (t.scrollLeft += e.deltaX) : (t.scrollLeft += e.deltaY);
    e.preventDefault();
  }
}