var R4 = (function (e) {
    function t(ctx, filen0, subpath) {
      var r = e.call(this) || this,
        o = (r.app = ctx.app);
      r.ctx = ctx;
      var a = (r.containerEl = ctx.containerEl);
      a.addClass("canvas-embed");
      r.file = filen0;
      r.subpath = subpath;
      ctx.showInline &&
        (a.addClass("inline-embed"),
        (r.headerEl = a.createDiv(
          {
            cls: "embed-title",
          },
          function (e) {
            e.createSpan(
              {
                cls: "file-embed-icon",
              },
              function (e) {
                setIcon(e, "lucide-layout-dashboard");
              },
            );
            e.appendText(" " + r.file.basename);
          },
        )));
      a.addEventListener("click", function (e) {
        o.workspace.getLeaf(Keymap.isModEvent(e)).openLinkText(ctx.linktext, ctx.sourcePath);
      });
      return r;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              t = (e = this).containerEl;
              n = e.headerEl;
              t.empty();
              n && t.appendChild(n);
              i = N4;
              r = [t];
              return [4, this.app.vault.cachedRead(this.file)];
            case 1:
              i.apply(undefined, r.concat([o.sent()]));
              return [2];
          }
        });
      });
    };
    return t;
  })(Component),
  B4 = (function (e) {
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
      var n,
        i = this.instance.options,
        r = function () {
          s.settingEl.toggle(n.getValue() === "folder");
        };
      new Setting(t).setName(A4.optionNewCanvasLocation()).addDropdown(function (t) {
        n = t;
        t.addOption("root", i18nProxy.setting.file.optionChoiceVaultRoot())
          .addOption("current", i18nProxy.setting.file.optionChoiceCurrentFolder())
          .addOption("folder", i18nProxy.setting.file.optionChoiceSpecifiedFolder())
          .setValue(i.newFileLocation || "root")
          .onChange(function (newFileLocation) {
            i.newFileLocation = newFileLocation;
            e.plugin.saveData(i);
            r();
          });
      });
      var o,
        a,
        s = new Setting(t)
          .setName(A4.optionNewCanvasFolderPath())
          .setDesc(A4.optionNewCanvasFolderPathDescription())
          .addText(function (t) {
            t.setPlaceholder(i18nProxy.setting.folderPathExamplePlaceholder())
              .setValue(i.newFileFolderPath === "/" ? "" : i.newFileFolderPath)
              .onChange(function (newFileFolderPath) {
                i.newFileFolderPath = newFileFolderPath;
                e.plugin.saveData(i);
              });
            new mT(e.app, t.inputEl, !1, !0);
          });
      new Setting(t).setName(A4.optionWheelBehavior()).addDropdown(function (t) {
        return t
          .addOption("pan", A4.labelPan())
          .addOption("zoom", A4.labelZoom())
          .setValue(i.defaultWheelBehavior || "pan")
          .onChange(function (defaultWheelBehavior) {
            i.defaultWheelBehavior = defaultWheelBehavior;
            e.plugin.saveData(i);
          });
      });
      new Setting(t)
        .setName(
          A4.optionModDragBehavior({
            key: z2(["Mod", "Drag"]),
          }),
        )
        .addDropdown(function (t) {
          return t
            .addOption("menu", A4.optionShowMenu())
            .addOption("card", A4.actionAddCard())
            .addOption("note", A4.actionAddNote())
            .addOption("media", A4.actionAddMedia())
            .addOption("webpage", A4.actionAddWebsite())
            .addOption("group", A4.actionCreateGroup())
            .setValue(i.defaultModDragBehavior || "menu")
            .onChange(function (defaultModDragBehavior) {
              i.defaultModDragBehavior = defaultModDragBehavior;
              e.plugin.saveData(i);
            });
        });
      new Setting(t).setName(A4.optionNodeLabel()).addDropdown(function (t) {
        return t
          .addOption("always", A4.labelAlways())
          .addOption("hover", A4.labelHover())
          .addOption("never", A4.labelNever())
          .setValue(i.cardLabelVisibility || "always")
          .onChange(function (cardLabelVisibility) {
            i.cardLabelVisibility = cardLabelVisibility;
            e.plugin.saveData(i);
            e.instance.rerenderCanvases();
          });
      });
      new Setting(t)
        .setName(A4.optionSnapToGrid())
        .setDesc(A4.optionSnapToGridDesc())
        .addToggle(function (t) {
          return t.setValue(i.snapToGrid).onChange(function (snapToGrid) {
            i.snapToGrid = snapToGrid;
            e.plugin.saveData(i);
          });
        });
      new Setting(t)
        .setName(A4.optionSnapToObjects())
        .setDesc(A4.optionSnapToObjectsDesc())
        .addToggle(function (t) {
          return t.setValue(i.snapToObjects).onChange(function (snapToObjects) {
            i.snapToObjects = snapToObjects;
            e.plugin.saveData(i);
          });
        });
      var l = function (e) {
        return a.extraSettingsEl.toggleVisibility(e !== 0);
      };
      new Setting(t)
        .setName(A4.optionZoomBreakpoint())
        .setDesc(A4.optionZoomBreakpointDesc())
        .addExtraButton(function (e) {
          return (a = e
            .setIcon("lucide-rotate-ccw")
            .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
            .onClick(function () {
              o.setValue(0);
            }));
        })
        .addSlider(function (t) {
          return (o = t
            .setLimits(-0.7, 2.3999999999999995, 0.01)
            .setValue(i.zoomBreakpoint || 0)
            .onChange(function (zoomBreakpoint) {
              i.zoomBreakpoint = zoomBreakpoint;
              e.plugin.saveData(i);
              l(zoomBreakpoint);
            }));
        });
      r();
      l(i.zoomBreakpoint || 0);
    };
    return t;
  })(j1),
  V4 = (function (e) {
    function t(t, n, commands, r) {
      var o = e.call(this, t, n) || this;
      o.commands = commands;
      o.cb = r;
      return o;
    }
    __extends(t, e);
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
      if (o.icon) {
        i.createSpan(
          {
            cls: "suggestion-flair",
          },
          function (e) {
            setIcon(e, o.icon);
          },
        );
      }
    };
    t.prototype.getSuggestions = function (e) {
      for (var t = prepareFuzzySearch(e), n = [], i = 0, r = this.commands; i < r.length; i++) {
        var item = r[i],
          match = t(item.name);
        if (match) {
          n.push({
            match: match,
            item: item,
          });
        }
      }
      sortSearchResults(n);
      return n;
    };
    t.prototype.selectSuggestion = function (e) {
      this.cb(e.item);
      this.close();
    };
    return t;
  })(AbstractInputSuggest);
function H4(e, t) {
  var n = new Map(
    t.map(function (e, t) {
      return [e, t];
    }),
  );
  return e.sort(function (e, t) {
    var i, r;
    return (
      ((i = n.get(e.id)) !== null && undefined !== i ? i : 1 / 0) -
      ((r = n.get(t.id)) !== null && undefined !== r ? r : 1 / 0)
    );
  });
}
var z4 = (function () {
    function e() {
      this.id = "command-palette";
      this.name = i18nProxy.plugins.commandPalette.name();
      this.description = i18nProxy.plugins.commandPalette.desc();
      this.defaultOn = true;
      this.modal = null;
      this.options = {};
      this.recentCommands = [];
      this.plugin = null;
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      this.openCallback = this.onOpen.bind(this);
      plugin.registerRibbonItem(i18nProxy.plugins.commandPalette.actionOpen(), "lucide-terminal", this.openCallback);
      plugin.registerGlobalCommand({
        id: "command-palette:open",
        name: i18nProxy.plugins.commandPalette.actionOpen(),
        icon: "lucide-terminal-square",
        callback: this.openCallback,
        hotkeys: [BO(["Mod"], "P")],
        showOnMobileToolbar: true,
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, recentCommands;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              this.modal = new q4(e, this);
              n = this;
              r = (i = Object).assign;
              o = [{}];
              return [4, t.loadData()];
            case 1:
              n.options = r.apply(i, o.concat([s.sent()]));
              (recentCommands = this.app.loadLocalStorage("recent-commands")) &&
                Array.isArray(recentCommands) &&
                (this.recentCommands = recentCommands);
              t.addSettingTab(new W4(e, t, this));
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function (e, t) {
      this.modal = null;
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
    e.prototype.saveSettings = function (e) {
      e.saveData(this.options);
      this.app.saveLocalStorage("recent-commands", this.recentCommands);
    };
    e.prototype.onOpen = function () {
      this.modal && this.modal.open();
      return !1;
    };
    e.prototype.getCommands = function () {
      var e,
        t = this.app.commands.listCommands(),
        n = [],
        i = this.options.pinned;
      if (i && i.length > 0) {
        var r = new Set(i);
        e = (function (e, t) {
          for (var n = [], i = [], r = 0, o = e; r < o.length; r++) {
            var a = o[r];
            t(a) ? n.push(a) : i.push(a);
          }
          return [n, i];
        })(t, function (e) {
          return r.has(e.id);
        });
        n = e[0];
        t = e[1];
        H4(n, i);
      }
      t.sort(function (e, t) {
        return Eb(e.name, t.name);
      });
      H4(t, this.recentCommands);
      return n.concat(t);
    };
    return e;
  })(),
  q4 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.emptyStateText = i18nProxy.plugins.commandPalette.labelNoCommands();
      i.commands = null;
      i.plugin = plugin;
      i.setInstructions([
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
      i.setPlaceholder(i18nProxy.plugins.commandPalette.promptTypeCommand());
      i.scope.register(null, "Tab", function () {
        return !1;
      });
      i.scope.register(null, "Enter", function (e) {
        if (!e.isComposing) {
          i.selectActiveSuggestion(e);
          return !1;
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.commands = null;
      e.prototype.onOpen.call(this);
    };
    t.prototype.onClose = function () {
      this.commands = null;
      e.prototype.onClose.call(this);
    };
    t.prototype.getItems = function () {
      var e = this.commands;
      e || (e = this.commands = this.plugin.getCommands());
      return e;
    };
    t.prototype.getItemText = function (e) {
      return e.name;
    };
    t.prototype.sortSuggestions = function (t) {
      for (var n = 0, i = t; n < i.length; n++) {
        var r = i[n];
        if (r.match.score > 0) {
          var score = r.item.name.length / 1e4;
          r.match.score += score;
        }
      }
      e.prototype.sortSuggestions.call(this, t);
    };
    t.prototype.renderSuggestion = function (e, t) {
      t.addClass("mod-complex");
      var n = t.createDiv("suggestion-content"),
        i = t.createDiv("suggestion-aux"),
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
          var y = v[g];
          i.createEl("kbd", {
            cls: "suggestion-hotkey",
            text: HO(y),
          });
        }
      var b = this.plugin.options.pinned;
      if (b && b.contains(o.id)) {
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
    t.prototype.onChooseItem = function (e, lastEvent) {
      this.app.lastEvent = lastEvent;
      lQ(e);
      var n = this.plugin.recentCommands;
      n.remove(e.id);
      n.unshift(e.id);
      n.length > 100 && (n.length = 100);
      this.app.saveLocalStorage("recent-commands", n);
    };
    return t;
  })(FuzzySuggestModal),
  W4 = (function (e) {
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
      new Setting(t).setHeading().setName(i18nProxy.plugins.commandPalette.labelPinnedCommands());
      var n = [],
        i = function () {
          var pinned = n.map(function (e) {
            return e.id;
          });
          pinned.length === 0 && (pinned = null);
          e.instance.options.pinned = pinned;
          e.instance.saveSettings(e.plugin);
          e.display();
        },
        r = this.instance.options.pinned;
      if (r)
        for (var o = 0, a = r; o < a.length; o++) {
          var s = a[o];
          if ((m = this.app.commands.commands[s])) {
            n.push(m);
          }
        }
      for (
        var l = t.createDiv(),
          c = function (e) {
            l.createDiv("mobile-option-setting-item", function (t) {
              t.createSpan({
                cls: "mobile-option-setting-item-name",
                text: e.name,
              });
              t.createDiv("clickable-icon", function (t) {
                setIcon(t, "lucide-x");
                setTooltip(t, i18nProxy.interface.deleteActionShortName());
                t.addEventListener("click", function () {
                  n.remove(e);
                  i();
                });
              });
              t.createDiv("clickable-icon mobile-option-setting-drag-icon", function (r) {
                setIcon(r, "lucide-menu");
                setTooltip(r, i18nProxy.interface.dragToRearrange());
                Vc(
                  r,
                  t,
                  l,
                  5,
                  function () {
                    return null;
                  },
                  function (t) {
                    n.remove(e);
                    n.splice(t, 0, e);
                    i();
                  },
                );
              });
            });
          },
          u = 0,
          h = n;
        u < h.length;
        u++
      ) {
        c((m = h[u]));
      }
      if (n.length === 0) {
        l.createDiv({
          cls: "mobile-option-setting-item",
          text: i18nProxy.plugins.commandPalette.labelNoCommands(),
        });
      }
      var p = this.app.commands.commands,
        d = [];
      for (var f in p) {
        var m = p[f];
        if (!n.contains(m)) {
          d.push(m);
        }
      }
      new Setting(t)
        .setName(i18nProxy.plugins.commandPalette.optionAddNewPin())
        .setDesc(i18nProxy.plugins.commandPalette.optionAddNewPinDescription())
        .addText(function (t) {
          return t.setPlaceholder(i18nProxy.plugins.commandPalette.promptTypeCommand()).then(function () {
            new V4(e.app, t.inputEl, d, function (e) {
              n.push(e);
              i();
            });
          });
        });
    };
    return t;
  })(j1),
  U4 = "YYYY-MM-DD",
  _4 = "HH:mm";
function j4(e, t, n) {
  for (var i in t)
    if (t.hasOwnProperty(i)) {
      var r = t[i],
        o = new RegExp("{{".concat(i, "}}"), "gi");
      e = e.replace(o, r);
    }
  var a = null;
  return (e = e.replace(/{{(date|time)(?::(.*?))?}}/gi, function (e, t, i) {
    a || (a = window.moment());
    return i
      ? a.format(i)
      : t.toLowerCase() === "date"
        ? a.format((n && n.dateFormat) || U4)
        : a.format((n && n.timeFormat) || _4);
  }));
}
var G4 = "YYYY-MM-DD",
  K4 = i18nProxy.plugins.dailyNotes,
  Y4 = (function () {
    function e() {
      this.id = "daily-notes";
      this.name = K4.name();
      this.description = K4.desc();
      this.defaultOn = true;
      this.app = null;
      this.plugin = null;
      this.options = {};
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(K4.actionOpen(), "lucide-calendar", this.onOpenDailyNote.bind(this));
      plugin.registerGlobalCommand({
        id: "daily-notes",
        name: K4.actionOpen(),
        icon: "lucide-calendar-days",
        callback: this.onOpenDailyNote.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "daily-notes:goto-prev",
        name: K4.actionOpenPrevious(),
        icon: "lucide-calendar-minus",
        checkCallback: function (e) {
          var t = n.getCurrentFileDateTimestamp();
          return !!t && (e || n.gotoPreviousExisting(t), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "daily-notes:goto-next",
        name: K4.actionOpenNext(),
        icon: "lucide-calendar-plus",
        checkCallback: function (e) {
          var t = n.getCurrentFileDateTimestamp();
          return !!t && (e || n.gotoNextExisting(t), !0);
        },
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              n = this;
              return [4, t.loadData()];
            case 1:
              n.options = o.sent() || {};
              t.addSettingTab(new Z4(e, t, this));
              this.app.workspace.onLayoutReady(function () {
                if (r.options.autorun) {
                  r.onOpenDailyNote();
                }
              });
              t.registerEvent(
                this.app.workspace.on("receive-text-menu", function (e, t) {
                  e.addItem(function (e) {
                    return e
                      .setSection("options")
                      .setTitle(K4.actionInsertText())
                      .setIcon("lucide-calendar-check")
                      .onClick(function () {
                        return __awaiter(r, undefined, undefined, function () {
                          var e;
                          return __generator(this, function (n) {
                            switch (n.label) {
                              case 0:
                                return [4, this.getDailyNote()];
                              case 1:
                                e = n.sent();
                                return [4, this.app.fileManager.insertIntoFile(e, t)];
                              case 2:
                                n.sent();
                                return [
                                  4,
                                  this.app.workspace.getLeaf().openFile(e, {
                                    active: true,
                                    state: {
                                      mode: "source",
                                    },
                                  }),
                                ];
                              case 3:
                                n.sent();
                                return [2];
                            }
                          });
                        });
                      });
                  });
                }),
              );
              t.registerEvent(
                this.app.workspace.on("receive-files-menu", function (e, t) {
                  e.addItem(function (e) {
                    return e
                      .setTitle(K4.actionInsertLink())
                      .setIcon("lucide-calendar-check")
                      .onClick(function () {
                        return __awaiter(r, undefined, undefined, function () {
                          var e,
                            n,
                            i = this;
                          return __generator(this, function (r) {
                            switch (r.label) {
                              case 0:
                                return [4, this.getDailyNote()];
                              case 1:
                                e = r.sent();
                                n = t.map(function (t) {
                                  return i.app.fileManager.generateMarkdownLink(t, e.path);
                                });
                                return [4, this.app.fileManager.insertIntoFile(e, n.join("\n"))];
                              case 2:
                                r.sent();
                                return [
                                  4,
                                  this.app.workspace.getLeaf().openFile(e, {
                                    active: true,
                                    state: {
                                      mode: "source",
                                    },
                                  }),
                                ];
                              case 3:
                                r.sent();
                                return [2];
                            }
                          });
                        });
                      });
                  });
                }),
              );
              i = function (e) {
                return __awaiter(r, undefined, undefined, function () {
                  var t, n, i, r, o;
                  return __generator(this, function (a) {
                    switch (a.label) {
                      case 0:
                        return [4, this.getDailyNote()];
                      case 1:
                        t = a.sent();
                        n = this.app;
                        i = n.fileManager;
                        r = n.workspace;
                        o = e.content;
                        return e.clipboard ? [4, navigator.clipboard.readText()] : [3, 3];
                      case 2:
                        o = a.sent();
                        a.label = 3;
                      case 3:
                        return o ? [4, i.insertIntoFile(t, o, e.prepend ? "prepend" : "append")] : [3, 5];
                      case 4:
                        a.sent();
                        a.label = 5;
                      case 5:
                        return e.silent
                          ? [3, 7]
                          : [
                              4,
                              r.getLeaf().openFile(t, {
                                active: true,
                                state: {
                                  mode: "source",
                                },
                              }),
                            ];
                      case 6:
                        a.sent();
                        a.label = 7;
                      case 7:
                        r.handleXCallback(e, t);
                        return [2];
                    }
                  });
                });
              };
              this.app.workspace.registerObsidianProtocolHandler("daily", i);
              t.register(function () {
                return r.app.workspace.unregisterObsidianProtocolHandler("daily", i);
              });
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
    e.prototype.getDailyNote = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, title, format, a, folderOption, l, c, u, h, p, template, f, m, g, v;
        return __generator(this, function (y) {
          switch (y.label) {
            case 0:
              n = (t = this).app;
              i = t.options;
              e != null || (e = window.moment());
              title = null;
              format = this.getFormat();
              try {
                title = e.format(format);
              } catch (e) {
                new Notice(
                  K4.msgFailFormat({
                    format: format,
                  }),
                );
                console.error(e);
                return [2];
              }
              if ((title && (title = title.trim()), (folderOption = i.folder) && String.isString(folderOption))) {
                if (((l = normalizePath(folderOption)), !((c = n.vault.getAbstractFileByPath(l)) instanceof TFolder))) {
                  new Notice(
                    K4.msgFailFolder({
                      folderOption: folderOption,
                    }),
                  );
                  return [2, null];
                }
                a = c;
              } else a = n.fileManager.getNewFileParent("");
              if (
                ((u = a.getParentPrefix() + title + ".md"),
                (h = n.vault.getAbstractFileByPathInsensitive(u)) && !(h instanceof TFile))
              )
                return [2, null];
              if ((p = h)) return [3, 8];
              y.label = 1;
            case 1:
              y.trys.push([1, 7, , 8]);
              return (template = i.template)
                ? (f = n.metadataCache.getFirstLinkpathDest(template, ""))
                  ? [4, n.vault.cachedRead(f)]
                  : (new Notice(
                      K4.msgFailTemplateFile({
                        template: template,
                      }),
                    ),
                    [2])
                : [3, 4];
            case 2:
              m = y.sent();
              g = j4(
                m,
                {
                  title: title,
                },
                {},
              );
              return [4, n.fileManager.createNewMarkdownFile(a, title, g)];
            case 3:
              p = y.sent();
              return [3, 6];
            case 4:
              return [4, n.fileManager.createNewMarkdownFile(a, title)];
            case 5:
              p = y.sent();
              y.label = 6;
            case 6:
              return [3, 8];
            case 7:
              v = y.sent();
              new Notice(v.toString());
              return [2];
            case 8:
              return [2, p];
          }
        });
      });
    };
    e.prototype.onOpenDailyNote = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.getDailyNote()];
            case 1:
              return (t = n.sent())
                ? [
                    4,
                    this.app.workspace.getLeaf(Keymap.isModEvent(e || this.app.lastEvent)).openFile(t, {
                      state: {
                        mode: "source",
                      },
                    }),
                  ]
                : [3, 3];
            case 2:
              n.sent();
              n.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    e.prototype.gotoPreviousExisting = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = Number.NEGATIVE_INFINITY;
              n = null;
              this.iterateDailyNotes(function (i, r) {
                if (r < e && r > t) {
                  n = i;
                  t = r;
                }
              });
              return n
                ? [
                    4,
                    this.app.workspace.getLeaf().openFile(n, {
                      active: !0,
                    }),
                  ]
                : (new Notice(K4.msgNoPrevious()), [2]);
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.gotoNextExisting = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = Number.POSITIVE_INFINITY;
              n = null;
              this.iterateDailyNotes(function (i, r) {
                if (r > e && r < t) {
                  n = i;
                  t = r;
                }
              });
              return n
                ? [
                    4,
                    this.app.workspace.getLeaf().openFile(n, {
                      active: !0,
                    }),
                  ]
                : (new Notice(K4.msgNoNext()), [2]);
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.iterateDailyNotes = function (e) {
      var t = this.app.vault.getAllLoadedFiles(),
        n = this.getFormat();
      t.forEach(function (t) {
        if (t instanceof TFile) {
          var i = window.moment(t.basename, n, !0);
          if (i.isValid()) {
            e(t, i.valueOf());
          }
        }
      });
    };
    e.prototype.getCurrentFileDateTimestamp = function () {
      var e = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (e) {
        var t = e.file.basename,
          n = this.getFormat(),
          i = window.moment(t, n, !0);
        if (i.isValid()) return i.valueOf();
      }
      return null;
    };
    e.prototype.getFormat = function () {
      var e = this.options.format;
      return e && String.isString(e) ? e : G4;
    };
    return e;
  })(),
  Z4 = (function (e) {
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
      var n = this.instance.options,
        i = document.createDocumentFragment();
      i.appendText(K4.labelReferToSyntax());
      i.createEl("a", {
        text: K4.labelSyntaxLink(),
        attr: {
          href: "https://momentjs.com/docs/#/displaying/format/",
          target: "_blank",
          rel: "noopener",
        },
      });
      i.createEl("br");
      i.appendText(K4.labelSyntaxLivePreview());
      var r = i.createEl("b", "u-pop");
      new Setting(t)
        .setName(K4.optionDateFormat())
        .setDesc(i)
        .addMomentFormat(function (t) {
          return t
            .setSampleEl(r)
            .setDefaultFormat(G4)
            .setValue(n.format)
            .onChange(function (t) {
              n.format = t.trim();
              e.plugin.saveData(n);
            });
        });
      new Setting(t)
        .setName(K4.optionNewFileLocation())
        .setDesc(K4.optionNewFileLocationDescription())
        .addText(function (t) {
          t.setPlaceholder(i18nProxy.setting.folderPathExamplePlaceholder())
            .setValue(n.folder)
            .onChange(function (t) {
              n.folder = t.trim();
              e.plugin.saveData(n);
            });
          new mT(e.app, t.inputEl, !1, !0);
        });
      new Setting(t)
        .setName(K4.optionTemplate())
        .setDesc(K4.optionTemplateDescription())
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
        .setName(K4.optionOpenOnStart())
        .setDesc(K4.optionOpenOnStartDescription())
        .addToggle(function (t) {
          return t.setValue(n.autorun).onChange(function (autorun) {
            n.autorun = autorun;
            e.plugin.saveData(n);
          });
        });
    };
    return t;
  })(j1),
  X4 = (function () {
    function e() {
      this.items = {};
      this.queue = new ix();
    }
    e.prototype.thumbnailBg = function (e, src) {
      var n = this,
        i = this.items;
      if (Object.hasOwn(i, src)) e.style.backgroundImage = 'url("'.concat(i[src], '")');
      else {
        var backgroundImage = 'url("'.concat(src, '")');
        e.style.backgroundImage = backgroundImage;
        var o = "";
        try {
          if ((o = getExtension(new URL(src).pathname)) === "gif" || o === "svg") return;
        } catch (e) {}
        this.queue.queue(function () {
          return __awaiter(n, undefined, undefined, function () {
            var n, a, s, l, width, height, h, p, srcd0;
            return __generator(this, function (f) {
              switch (f.label) {
                case 0:
                  return e.style.backgroundImage !== backgroundImage
                    ? [2]
                    : Object.hasOwn(i, src)
                      ? ((e.style.backgroundImage = 'url("'.concat(i[src], '")')), [2])
                      : (((n = new Image()).crossOrigin = "anonymous"),
                        [
                          4,
                          new Promise(function (e) {
                            var i = function () {
                              return e();
                            };
                            n.addEventListener("load", i);
                            n.addEventListener("error", i);
                            activeWindow.setTimeout(i, 1e4);
                            n.src = src;
                          }),
                        ]);
                case 1:
                  f.sent();
                  return e.isShown() && e.style.backgroundImage === backgroundImage
                    ? ((a = n.naturalWidth),
                      (s = n.naturalHeight),
                      a === 0 || s === 0
                        ? ((i[src] = src), [2])
                        : ((l = Math.max(e.offsetWidth / a, e.offsetHeight / s)),
                          (l *= e.win.devicePixelRatio) <= 0 || l > 0.5
                            ? ((i[src] = src), [2])
                            : ((width = Math.ceil(a * l)),
                              (height = Math.ceil(s * l)),
                              (h = document.createElement("canvas")),
                              ((p = h.getContext("2d")).imageSmoothingQuality = "high"),
                              (h.width = width),
                              (h.height = height),
                              p.drawImage(n, 0, 0, width, height),
                              (srcd0 = h.toDataURL(o === "png" ? "image/png" : "image/jpeg")),
                              (i[src] = srcd0),
                              (e.style.backgroundImage = 'url("'.concat(srcd0, '")')),
                              [2])))
                    : [2];
              }
            });
          });
        });
      }
    };
    e.prototype.clear = function () {
      this.items = {};
    };
    return e;
  })();
function Q4(e) {
  for (var t = [], n = 0; n <= e; n++) t.push(n / e);
  return t;
}
function $4(e, t) {
  var n = null,
    i = new IntersectionObserver(t, {
      threshold: Q4(1e3),
    });
  function r(i) {
    if (n && i.target.contains(e)) {
      t();
    }
  }
  function o() {
    var i = n,
      o = e.isShown() ? e.win : null;
    if (o !== i) {
      i &&
        i.removeEventListener("scroll", r, {
          capture: !0,
        });
      o &&
        o.addEventListener("scroll", r, {
          passive: true,
          capture: !0,
        });
      n = o;
      t();
    }
  }
  i.observe(e);
  o();
  var a = e.onNodeInserted(o);
  return function () {
    a();
    i.disconnect();
    n &&
      (n.removeEventListener("scroll", r, {
        capture: !0,
      }),
      (n = null));
  };
}
function J4(e) {
  for (
    var t = e.getBoundingClientRect(),
      n = t.width > 0 ? e.clientWidth / Math.round(t.width) : t.height > 0 ? e.clientHeight / Math.round(t.height) : 1,
      i = e.ownerDocument,
      r = i.defaultView || window,
      o = 0,
      a = r.innerWidth,
      s = 0,
      l = r.innerHeight,
      c = e.parentNode;
    c && c != i.body;
  )
    if (c.nodeType == 1) {
      var u = c,
        h = window.getComputedStyle(u);
      if ((u.scrollHeight > u.clientHeight || u.scrollWidth > u.clientWidth) && h.overflow != "visible") {
        var p = u.getBoundingClientRect();
        o = Math.max(o, p.left);
        a = Math.min(a, p.right);
        s = Math.max(s, p.top);
        l = Math.min(c == e.parentNode ? r.innerHeight : l, p.bottom);
      }
      c = h.position == "absolute" || h.position == "fixed" ? u.offsetParent : u.parentNode;
    } else {
      if (c.nodeType != 11) break;
      c = c.host;
    }
  return {
    left: n * (o - t.left),
    right: n * (Math.max(o, a) - t.left),
    top: n * (s - t.top),
    bottom: n * (Math.max(s, l) - t.top),
  };
}
var typee30 = "cards",
  t3 = (function (e) {
    function t(t, scrollEl) {
      var i = e.call(this, t) || this;
      i.type = typee30;
      i.groups = [];
      i.items = [];
      i.unusedItems = [];
      i.lastViewport = null;
      i.lastScroll = {
        top: 0,
      };
      i.pendingScroll = null;
      i.thumbnailer = new X4();
      i.testers = null;
      i.measurements = {
        pad: {
          top: 0,
          bottom: 0,
          start: 0,
          end: 0,
        },
        groupGap: 0,
        groupPad: {
          top: 0,
          bottom: 0,
          start: 0,
          end: 0,
        },
        cardGap: 0,
        cardPad: {
          top: 0,
          bottom: 0,
          start: 0,
          end: 0,
        },
        propGap: 0,
        cardsPerRow: 1,
        cardWidth: 200,
        cardHeight: 200,
        coverHeight: 100,
        titleHeight: 24,
        propHeight: 24,
      };
      i.imageProp = null;
      i.imageFitContain = false;
      i.imageAspectRatio = 1;
      i.scrollEl = scrollEl;
      i.containerEl = scrollEl.createDiv("bases-cards-container is-loading");
      return i;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this;
      this.scrollWatcher = $4(this.containerEl, function () {
        return e.updateVirtualDisplay();
      });
      this.registerEvent(this.app.workspace.on("css-change", this.updateVirtualDisplay, this));
    };
    t.prototype.onunload = function () {
      var e;
      (e = this.scrollWatcher) === null || undefined === e || e.call(this);
      this.scrollWatcher = null;
    };
    t.prototype.onResize = function () {
      this.updateVirtualDisplay();
    };
    t.prototype.onDataUpdated = function () {
      this.containerEl.removeClass("is-loading");
      this.display();
    };
    t.prototype.display = function () {
      var e = this,
        t = this.data;
      t && t.data.length !== 0
        ? (dG(
            this.groups,
            this.data.groupedData,
            function () {
              return !0;
            },
            function () {
              return new n3(e);
            },
          ),
          this.updateVirtualDisplay())
        : this.containerEl.empty();
    };
    t.prototype.updateVirtualDisplay = function () {
      var e = this,
        t = this,
        n = t.data,
        i = t.config,
        r = t.containerEl;
      if (n && i && r.isShown()) {
        var o = this,
          a = o.groups,
          s = o.items,
          l = o.unusedItems,
          c = o.measurements,
          u = o.testers,
          h = o.lastViewport,
          p = n.properties;
        if (a.length !== 0) {
          u ||
            ((u = this.testers =
              {
                group: createDiv("bases-cards-group"),
                card: createDiv("bases-cards-item"),
                cover: createDiv("bases-cards-cover"),
                title: createDiv("bases-cards-property mod-title"),
                prop: createDiv("bases-cards-property"),
              }).group.appendChild(u.card),
            u.card.appendChild(u.cover),
            u.card.appendChild(u.title),
            u.title.createDiv({
              cls: "bases-cards-label",
              text: "Fj",
            }),
            u.title.createDiv({
              cls: "bases-cards-line",
              text: "Fj",
            }),
            u.card.appendChild(u.prop),
            u.prop.createDiv({
              cls: "bases-cards-label",
              text: "Fj",
            }),
            u.prop.createDiv({
              cls: "bases-cards-line",
              text: "Fj",
            }),
            u.group.setCssStyles({
              opacity: "0",
              pointerEvents: "none",
              zIndex: "-1",
              width: c.cardWidth + "px",
              height: "100px",
            }),
            u.card.setCssStyles({
              width: "100%",
              height: "100%",
            }));
          u.group.parentNode || r.prepend(u.group);
          var d = i.get("image");
          d && String.isString(d) ? (this.imageProp = bq(d)) : (this.imageProp = null);
          this.imageFitContain = i.get("imageFit") === "contain";
          var imageAspectRatio = i.get("imageAspectRatio");
          imageAspectRatio && Number.isNumber(imageAspectRatio) && imageAspectRatio > 0
            ? (this.imageAspectRatio = imageAspectRatio)
            : (this.imageAspectRatio = 1);
          var m = 200,
            v = i.get("cardSize");
          if (v && Number.isNumber(v) && v > 0) {
            m = v;
          }
          var y = Nl(r.getCssPropertyValue("--bases-cards-scale"), 1);
          if (y > 0) {
            m *= y;
          }
          var b = getComputedStyle(r);
          c.pad = o3(b);
          c.groupGap = Nl(b.gap, 0);
          var w = getComputedStyle(a[0].containerEl);
          c.groupPad = o3(w);
          c.cardGap = Nl(w.gap, 0);
          var k = getComputedStyle(u.card);
          c.cardPad = o3(k);
          c.propGap = Nl(k.gap, 0);
          c.titleHeight = u.title.offsetHeight;
          c.propHeight = u.prop.offsetHeight;
          c.coverHeight = u.cover.offsetHeight;
          var C = r.clientWidth - c.pad.start - c.groupPad.start - c.groupPad.end - c.pad.end;
          c.cardsPerRow = Math.max(1, Math.floor(C / m));
          c.cardWidth = (C - c.cardGap * (c.cardsPerRow - 1)) / c.cardsPerRow;
          c.cardHeight = 0;
          this.imageProp && ((c.coverHeight = c.cardWidth * this.imageAspectRatio), (c.cardHeight += c.coverHeight));
          p.length > 0 && (c.cardHeight += c.cardPad.top + c.cardPad.bottom + c.titleHeight);
          p.length > 1 && (c.cardHeight += (c.propHeight + c.propGap) * (p.length - 1));
          var E = J4(r);
          if (((this.lastViewport = __assign({}, E)), h)) {
            var S = Math.min(E.bottom - E.top, window.innerHeight / 2, 2 * c.cardHeight);
            E.top < h.top && (E.top -= Math.min(h.top - E.top, S));
            E.bottom > h.bottom && (E.bottom += Math.min(E.bottom - h.bottom, S));
          }
          var M = r.doc.activeElement;
          if (r.contains(M) && r !== M) {
            var x = getRelativeOffset(M, r);
            if (x.top < E.top) {
              E.top = x.top;
            }
            var bottom = x.top + M.offsetHeight;
            if (bottom > E.bottom) {
              E.bottom = bottom;
            }
          }
          for (var D = [u.group], items = [], P = c.pad.top, L = 0; L < n.groupedData.length; L++) {
            var I = a[L],
              O = n.groupedData[L].entries,
              F = P,
              N = Math.ceil(O.length / c.cardsPerRow),
              R = O.length === 0 ? 0 : N * c.cardHeight + (N - 1) * c.cardGap;
            I.containerEl.setCssStyles({
              top: F + "px",
              insetInlineStart: c.pad.start + "px",
              insetInlineEnd: c.pad.end + "px",
              height: c.groupPad.top + R + c.groupPad.bottom + "px",
            });
            var B = F + c.groupPad.top,
              V = B + R;
            if (B <= E.bottom && V >= E.top) {
              for (
                var H = Math.floor(Math.max(E.top - B, 0) / (c.cardHeight + c.cardGap)),
                  z = N - Math.floor(Math.max(V - E.bottom, 0) / (c.cardHeight + c.cardGap)),
                  q = [],
                  W = H;
                W < z;
                W++
              )
                for (
                  var U = function (e) {
                      var t = W * c.cardsPerRow + e;
                      if (t >= O.length) return "break";
                      var n = O[t],
                        i = s.findIndex(function (e) {
                          return e.entry.file === n.file;
                        }),
                        r = undefined;
                      -1 !== i ? ((r = s[i]), s.splice(i, 1)) : (r = l.length > 0 ? l.pop() : new i3(_));
                      items.push(r);
                      r.render(n, p);
                      r.el.setCssStyles({
                        top: c.groupPad.top + W * (c.cardHeight + c.cardGap) + "px",
                        insetInlineStart: c.groupPad.start + e * (c.cardWidth + c.cardGap) + "px",
                        width: c.cardWidth + "px",
                        height: c.cardHeight + "px",
                      });
                      q.push(r.el);
                    },
                    _ = this,
                    j = 0;
                  j < c.cardsPerRow;
                  j++
                ) {
                  if (U(j) === "break") break;
                }
              I.containerEl.setChildrenInPlace(q);
            }
            D.push(I.containerEl);
            P = V + c.groupPad.bottom + c.groupGap;
          }
          r.setChildrenInPlace(D);
          for (var G = 0, K = s; G < K.length; G++) {
            K[G].el.detach();
          }
          this.items = items;
          this.unusedItems = l = s.concat(l);
          var length = Math.max(10, 2 * c.cardsPerRow);
          l.length > length && (l.length = length);
          r.style.height ||
            mc(function () {
              return e.updateVirtualDisplay();
            });
          r.setCssStyles({
            height: Math.max(0, P - c.groupGap + c.pad.bottom) + "px",
          });
          var Z = this.scrollEl;
          this.pendingScroll
            ? ((Z.scrollTop = P * this.pendingScroll.top),
              (this.lastScroll = this.pendingScroll),
              (this.pendingScroll = null))
            : (this.lastScroll = {
                top: Z.scrollTop / P,
              });
        } else r.empty();
      }
    };
    t.prototype.setEphemeralState = function (e) {
      var pendingScroll = e.scroll;
      if (pendingScroll && typeof pendingScroll == "object") {
        this.pendingScroll = pendingScroll;
      }
    };
    t.prototype.getEphemeralState = function () {
      var e = {};
      e.scroll = this.lastScroll;
      return e;
    };
    t.getViewOptions = function (e, t) {
      return [
        {
          displayName: i18nProxy.plugins.bases.cards.labelCardSize(),
          component: function (t) {
            var n = e.get("cardSize");
            new SliderComponent(t)
              .setLimits(50, 800, 10)
              .setValue(Number.isNumber(n) ? n : 200)
              .setDynamicTooltip()
              .setInstant(!0)
              .onChange(function (t) {
                e.set("cardSize", t);
              });
          },
        },
        {
          displayName: i18nProxy.plugins.bases.cards.labelImageProperty(),
          component: function (n) {
            new CU(t, n)
              .setPlaceholder(i18nProxy.plugins.bases.labelPropertyKey())
              .filterProperties(function (e) {
                return e === "file.file" || !e.startsWith("file.");
              })
              .setClearable(!0)
              .setValueById(String(e.get("image") || ""))
              .onSelect(function (t) {
                e.set("image", t == null ? undefined : t.value);
              });
          },
        },
        {
          displayName: i18nProxy.plugins.bases.cards.labelImageFit(),
          component: function (t) {
            new DropdownComponent(t)
              .addOptions({
                "": i18nProxy.plugins.bases.cards.optionImageFitCover(),
                contain: i18nProxy.plugins.bases.cards.optionImageFitContain(),
              })
              .setValue(String(e.get("imageFit") || ""))
              .onChange(function (t) {
                e.set("imageFit", t);
              });
          },
        },
        {
          displayName: i18nProxy.plugins.bases.cards.labelImageAspectRatio(),
          component: function (t) {
            var n = e.get("imageAspectRatio");
            new SliderComponent(t)
              .setLimits(0.25, 2.5, 0.05)
              .setValue(Number.isNumber(n) ? n : 1)
              .setDynamicTooltip()
              .setInstant(!0)
              .onChange(function (t) {
                e.set("imageAspectRatio", t);
              });
          },
        },
      ];
    };
    return t;
  })(BasesView),
  n3 = function (view) {
    this.view = view;
    this.containerEl = createDiv("bases-cards-group");
  },
  i3 = (function () {
    function e(view) {
      var t = this;
      this.imageValue = null;
      this.props = [];
      this.view = view;
      var targetEl = (this.el = createDiv("bases-cards-item")),
        i = view.app;
      xc(targetEl);
      targetEl.onClickEvent(function (e) {
        if ((e.button === 0 || e.button === 1) && !e.defaultPrevented && t.entry) {
          var r = targetEl.win,
            o = r.getSelection();
          if (o && o.rangeCount > 0)
            for (var a = 0; a < o.rangeCount; a++) {
              var s = o.getRangeAt(a);
              if (!s.collapsed && (targetEl.contains(s.startContainer) || targetEl.contains(s.endContainer))) return;
            }
          var l = r.document.activeElement;
          if (targetEl === l || !targetEl.contains(l)) {
            var c = e.targetNode;
            if (!(c.closest && c.closest("a"))) {
              e.preventDefault();
              i.workspace.openLinkText(t.entry.file.path, "", Keymap.isModEvent(e));
            }
          }
        }
      });
      targetEl.addEventListener("contextmenu", function (e) {
        if (t.entry) {
          var n = t.entry.file,
            r = Menu.forEvent(e).addSections([
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
          i.workspace.handleLinkContextMenu(r, n.path, "");
          r.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(i18nProxy.interface.menu.deleteFile())
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                return i.fileManager.promptForFileDeletion(n);
              });
          });
        }
      });
      i.dragManager.handleDrag(targetEl, function (e) {
        return t.entry ? i.dragManager.dragLink(e, t.entry.file.path, "") : null;
      });
      targetEl.addEventListener("mouseover", function (event) {
        if (Mc(event, targetEl) && t.entry) {
          i.workspace.trigger("hover-link", {
            event: event,
            source: "bases",
            hoverParent: i.renderContext,
            targetEl: targetEl,
            linktext: t.entry.file.path,
          });
        }
      });
    }
    e.prototype.render = function (entry, t) {
      var n = this;
      this.entry = entry;
      var i = this,
        r = i.props,
        o = i.el,
        a = i.coverEl;
      dG(
        r,
        t,
        function (e, t) {
          return e.prop === t;
        },
        function (e) {
          return new r3(n.view, e);
        },
        function (t) {
          return t.render(entry);
        },
      );
      var s = this.view.measurements,
        l = [],
        c = 0,
        u = this.view,
        h = u.imageProp,
        p = u.imageFitContain;
      if (h) {
        if (!a) {
          this.coverEl = a = createDiv("bases-cards-cover");
        }
        var imageValue = null;
        try {
          for (imageValue = entry.getValue(h); imageValue && imageValue instanceof AH; ) imageValue = imageValue.get(0);
        } catch (e) {}
        if (!CH.equals(imageValue, this.imageValue)) {
          this.imageValue = imageValue;
          var backgroundColor = "",
            m = "",
            g = null;
          if (imageValue instanceof HH) g = imageValue.file;
          else if (imageValue instanceof qH) g = imageValue.resolve();
          else if (imageValue instanceof xH) {
            var v = imageValue.data;
            v.match(/^https?:\/\//)
              ? (m = v)
              : Platform.isDesktopApp && v.startsWith("file:///")
                ? (m = Platform.resourcePathPrefix + v.substring(8))
                : /^#[a-f\d]{6}$/i.test(v)
                  ? (backgroundColor = v)
                  : (g = entry.app.metadataCache.getFirstLinkpathDest(v, entry.file.path));
          }
          g && IMAGE_EXTENSIONS.contains(g.extension) && (m = this.view.app.vault.getResourcePath(g));
          a.setCssStyles({
            backgroundColor: backgroundColor,
            backgroundImage: m ? 'url("'.concat(m, '")') : "",
          });
          m && this.view.thumbnailer.thumbnailBg(a, m);
        }
        l.push(a);
        a.setCssStyles({
          top: c + "px",
          insetInline: "0",
          height: s.coverHeight + "px",
          backgroundSize: p ? "contain" : "cover",
        });
        c += s.coverHeight;
      } else if (a) {
        a.detach();
        this.coverEl = null;
        this.imageValue = null;
      }
      c += s.cardPad.top;
      for (var y = 0; y < r.length; y++) {
        var b = r[y],
          w = y === 0;
        l.push(b.el);
        b.el.toggleClass("mod-title", w);
        var k = w ? s.titleHeight : s.propHeight;
        b.el.setCssStyles({
          top: c + "px",
          insetInlineStart: s.cardPad.start + "px",
          insetInlineEnd: s.cardPad.end + "px",
          height: k + "px",
        });
        c += k + s.propGap;
      }
      o.setChildrenInPlace(l);
    };
    return e;
  })(),
  r3 = (function () {
    function e(view, prop) {
      this.view = view;
      this.prop = prop;
      var n = (this.el = createDiv("bases-cards-property"));
      this.labelEl = n.createDiv("bases-cards-label");
      this.lineEl = n.createDiv("bases-cards-line");
      n.dataset.property = prop;
      this.renderer = new DG(view, prop, this.lineEl);
    }
    e.prototype.render = function (e) {
      var t = this.view.config.getDisplayName(this.prop);
      this.labelEl.getText() !== t && this.labelEl.setText(t);
      this.renderer.render(e);
    };
    return e;
  })();
function o3(e) {
  return {
    top: Nl(e.paddingTop, 0),
    bottom: Nl(e.paddingBottom, 0),
    start: Nl(e.paddingInlineStart, 0),
    end: Nl(e.paddingInlineEnd, 0),
  };
}
var typea30 = "table",
  s3 = i18nProxy.plugins.bases.table,
  l3 = (function (e) {
    function t(t, scrollEl) {
      var i = e.call(this, t) || this;
      i.type = typea30;
      i.groups = [];
      i.rows = [];
      i.unusedRows = [];
      i.columnInfo = {};
      i.lastViewport = null;
      i.lastScroll = {
        left: 0,
        top: 0,
      };
      i.pendingScroll = null;
      i.cellLookup = new WeakMap();
      i.minColWidth = 100;
      i.maxColWidth = 600;
      i.scrollEl = scrollEl;
      var r = (i.containerEl = scrollEl.createDiv("bases-table-container is-loading"));
      r.on("click", ".bases-table-header-resizer", function (e) {
        return e.preventDefault();
      });
      r.on("dblclick", ".bases-table-header-resizer", i.onTableHeaderResizerDblclick.bind(i));
      r.on("dragstart", ".bases-thead .bases-td", i.onTableHeaderDragstart.bind(i));
      Platform.isMobile || r.on("click", ".bases-thead .bases-td", i.onTableHeaderClick.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this;
      this.scrollWatcher = $4(this.containerEl, function () {
        return e.updateVirtualDisplay();
      });
      this.registerEvent(this.app.workspace.on("css-change", this.updateVirtualDisplay, this));
    };
    t.prototype.onunload = function () {
      var e;
      (e = this.scrollWatcher) === null || undefined === e || e.call(this);
      this.scrollWatcher = null;
    };
    t.prototype.onResize = function () {
      this.updateVirtualDisplay();
    };
    t.prototype.onTableHeaderDragstart = function (e, t) {
      var n = this;
      if (!e.defaultPrevented) {
        var i = this.getCellFromDom(t);
        if (i && i instanceof f3) {
          var r = i.prop;
          this.app.dragManager.onDragStart(e, null);
          var o = e.targetNode;
          if (o.instanceOf(HTMLElement) && o.matches(".bases-table-header-resizer")) {
            var a = this.columnInfo[r];
            if (!a) return;
            var s = isElementLTR(i.el);
            o.addClass("is-active");
            var l = e.clientX,
              customWidth = a.customWidth,
              u = i.el.offsetWidth,
              h = 0,
              p = function () {
                if (!h) {
                  h = e.win.requestAnimationFrame(function () {
                    h = 0;
                    n.updateVirtualDisplay();
                  });
                }
              },
              d = function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                var t = e.clientX;
                a.customWidth = Math.round(u + (t - l) * (s ? 1 : -1));
                p();
              },
              f = function () {
                g();
                a.customWidth = customWidth;
                p();
              },
              m = function (e) {
                e.preventDefault();
                g();
                n.saveColumnSizes();
              },
              g = function () {
                window.removeEventListener("dragover", d, {
                  capture: true,
                });
                window.removeEventListener("dragenter", d, {
                  capture: true,
                });
                window.removeEventListener("drop", m, {
                  capture: true,
                });
                window.removeEventListener("dragend", f);
                o.removeClass("is-active");
              };
            window.addEventListener("dragover", d, {
              capture: !0,
            });
            window.addEventListener("dragenter", d, {
              capture: !0,
            });
            window.addEventListener("drop", m, {
              capture: !0,
            });
            return void window.addEventListener("dragend", f);
          }
          var v = this,
            y = v.data,
            b = v.columnInfo,
            w = v.minColWidth,
            k = v.maxColWidth,
            C = v.containerEl,
            E = y.properties,
            S = E.indexOf(i.prop),
            M = S,
            x = C.createDiv("table-drag-target mod-col");
          x.setCssStyles({
            top: "0",
            transition: "all 75ms ease-in",
          });
          var T = function (e) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              var t = isElementLTR(n.containerEl),
                r = C.getBoundingClientRect(),
                o = t ? e.clientX - r.left : r.right - e.clientX;
              if (!x.isShown()) {
                C.appendChild(x);
              }
              var a = C.scrollWidth,
                s = Nl(C.getCssPropertyValue("--table-drop-indicator-half-width"), 2);
              M = 0;
              for (var l = 0, c = true, u = 0, h = E; u < h.length; u++) {
                var p = h[u],
                  d = b[p];
                if (d) {
                  var f = d.getWidth(w, k);
                  if (o < l + (c ? f : 0)) break;
                  l += f;
                }
                M++;
                p === i.prop && (c = false);
              }
              M === E.length && (l = a - s);
              x.setCssStyles({
                insetInlineStart: "".concat(Math.max(l, s), "px"),
                height: "".concat(r.height, "px"),
              });
            },
            D = function () {
              P();
            },
            A = function (e) {
              e.preventDefault();
              P();
              M > S && M--;
              M !== S && (nc(E, S, M), n.config.setOrder(E));
            },
            P = function () {
              window.removeEventListener("dragover", T, {
                capture: true,
              });
              window.removeEventListener("dragenter", T, {
                capture: true,
              });
              window.removeEventListener("drop", A, {
                capture: !0,
              });
              window.removeEventListener("dragend", D);
              x.detach();
            };
          window.addEventListener("dragover", T, {
            capture: !0,
          });
          window.addEventListener("dragenter", T, {
            capture: !0,
          });
          window.addEventListener("drop", A, {
            capture: !0,
          });
          window.addEventListener("dragend", D);
        }
      }
    };
    t.prototype.setEphemeralState = function (e) {
      var pendingScroll = e.scroll;
      if (pendingScroll && typeof pendingScroll == "object") {
        this.pendingScroll = pendingScroll;
      }
    };
    t.prototype.getEphemeralState = function () {
      var e = {};
      e.scroll = this.lastScroll;
      return e;
    };
    t.prototype.onTableHeaderClick = function (e, t) {
      if (!e.defaultPrevented && e.button === 0) {
        var n = this.getCellFromDom(t);
        if (n) {
          e.preventDefault();
          this.config.setSortProperty(n.prop, "TOGGLE");
        }
      }
    };
    t.prototype.onTableHeaderResizerDblclick = function (e, t) {
      if (e.button === 0) {
        var n = this.getCellFromDom(t);
        if (n) {
          var i = this.columnInfo[n.prop];
          if (i) {
            e.preventDefault();
            i.customWidth = 0;
            i.contentWidth = 0;
            this.updateVirtualDisplay();
            this.saveColumnSizes();
          }
        }
      }
    };
    t.prototype.onDataUpdated = function () {
      this.containerEl.removeClass("is-loading");
      this.display();
    };
    t.prototype.display = function () {
      var e = this,
        t = this.config,
        n = this.data.properties,
        i = t.get("columnSize");
      if (i && typeof i == "object")
        for (var r = i, o = this.columnInfo, a = 0, s = n; a < s.length; a++) {
          var l = s[a];
          if (i.hasOwnProperty(l)) {
            var customWidth = r[l];
            if (customWidth && Number.isNumber(customWidth)) {
              var u = o[l];
              u || (u = o[l] = new c3());
              u.customWidth = customWidth;
            }
          }
        }
      dG(
        this.groups,
        this.data.groupedData,
        function () {
          return !0;
        },
        function () {
          return new p3(e);
        },
        function (e) {
          return e.render(n);
        },
      );
      this.updateVirtualDisplay();
    };
    t.prototype.updateVirtualDisplay = function () {
      var e = this,
        t = this,
        n = t.data,
        i = t.config,
        r = t.containerEl;
      if (n && i && r.isShown()) {
        var o = this,
          a = o.groups,
          s = o.rows,
          l = o.unusedRows,
          c = o.columnInfo,
          u = o.lastViewport,
          h = n.properties,
          p = 1;
        switch (i.get("rowHeight")) {
          case "medium":
            p = 2;
            break;
          case "tall":
            p = 4;
            break;
          case "extra":
            p = 8;
        }
        r.setChildrenInPlace(
          a.map(function (e) {
            return e.tableEl;
          }),
        );
        for (var d = null, f = [], m = 0, v = h; m < v.length; m++) {
          var y = v[m];
          if (((j = c[y]) || (j = c[y] = new c3()), !j.customWidth && !j.contentWidth)) {
            for (var b = null, w = "", k = 0, C = n.groupedData; k < C.length; k++)
              for (var E = 0, S = (se = C[k]).entries; E < S.length; E++) {
                var M = S[E];
                try {
                  var x = M.getValue(y),
                    T = (x == null ? undefined : x.toString()) || "";
                  if (T.length > w.length) {
                    w = T;
                    b = M;
                  }
                } catch (e) {}
              }
            if (b) {
              if (!d) {
                d = a[0].tbodyEl.createDiv("bases-tr");
              }
              var D = new g3(this, y);
              d.appendChild(D.el);
              D.render(b);
              D.el.style.contain = "strict";
              f.push(D);
            }
          }
        }
        for (
          var A = Nl(r.getCssPropertyValue("--bases-table-row-height"), 30),
            P = A * p,
            L = (this.minColWidth = Nl(r.getCssPropertyValue("--bases-table-column-min-width"), 40)),
            I = (this.maxColWidth = Nl(r.getCssPropertyValue("--bases-table-column-max-width"), 300)),
            O = isElementLTR(r),
            F = 0,
            N = a;
          F < N.length;
          F++
        ) {
          var R = (se = N[F]).tableEl.getBoundingClientRect(),
            B = se.tbodyEl.getBoundingClientRect();
          se.selfHeight = R.bottom - R.top - B.height;
          se.childStart = B.top - R.top;
        }
        if (a.length > 0)
          for (var V = a[0].header.cells, H = 0; H < V.length; H++) {
            if ((D = V[H]).el.isShown())
              if ((j = c[D.prop])) {
                j.headerWidth = D.innerEl.scrollWidth;
              }
          }
        if (d)
          for (var z = 0, q = f; z < q.length; z++) {
            if ((j = c[(D = q[z]).prop])) {
              j.contentWidth = D.renderer.el.scrollWidth;
            }
          }
        var W = [],
          U = 0,
          _ = true;
        for (H = 0; H < h.length; H++) {
          var j;
          if ((j = c[h[H]])) {
            var G = (W[H] = j.getWidth(L, I));
            U += G;
            H === h.length - 1 && j.customWidth && (_ = false);
          }
        }
        var K = r.parentElement.clientWidth;
        if (_ && h.length > 0 && U < K) {
          var Y = K - U;
          W[W.length - 1] += Y;
          U += Y;
        }
        var Z = r.getBoundingClientRect(),
          X = J4(r);
        if (((this.lastViewport = __assign({}, X)), u)) {
          var Q = Math.min(X.right - X.left, window.innerWidth / 2),
            $ = Math.min(X.bottom - X.top, window.innerHeight / 2, 10 * A);
          X.left < u.left && (X.left -= Math.min(u.left - X.left, Q));
          X.right > u.right && (X.right += Math.min(X.right - u.right, Q));
          X.top < u.top && (X.top -= Math.min(u.top - X.top, $));
          X.bottom > u.bottom && (X.bottom += Math.min(X.bottom - u.bottom, $));
        }
        var J = r.doc.activeElement;
        if (r.contains(J) && r !== J) {
          var ee = getRelativeOffset(J, r);
          ee.left < X.left && (X.left = ee.left);
          ee.top < X.top && (X.top = ee.top);
          var right = ee.left + J.offsetWidth;
          if (right > X.right) {
            X.right = right;
          }
          var bottom = ee.top + J.offsetHeight;
          if (bottom > X.bottom) {
            X.bottom = bottom;
          }
        }
        r.toggleClass("mod-multiline", p > 1);
        d && d.detach();
        var rows = [],
          re = 0,
          oe = O ? X.left : Z.width - X.right,
          ae = O ? X.right : Z.width - X.left;
        for (H = 0; H < n.groupedData.length; H++) {
          var se = a[H],
            le = n.groupedData[H].entries,
            ce = re,
            ue = ce + se.childStart,
            he = le.length * P,
            pe = ue + he;
          if (
            (se.tableEl.setCssStyles({
              top: ce + "px",
              width: U + "px",
            }),
            se.tbodyEl.setCssStyles({
              height: he + "px",
            }),
            se.tbodyEl.setCssProps({
              "--bases-table-row-height": P + "px",
            }),
            ue <= X.bottom && pe >= X.top)
          ) {
            for (
              var de = Math.floor(Math.max(X.top - ue, 0) / P),
                fe = le.length - Math.floor(Math.max(pe - X.bottom, 0) / P),
                me = [],
                ge = function (e) {
                  var t = le[e],
                    n = s.findIndex(function (e) {
                      return e.entry.file === t.file;
                    }),
                    i = undefined;
                  -1 !== n ? ((i = s[n]), s.splice(n, 1)) : (i = l.length ? l.pop() : new m3(ve));
                  rows.push(i);
                  i.render(t, h);
                  i.virtualize(W, oe, ae);
                  i.el.setCssStyles({
                    top: e * P + "px",
                    width: U + "px",
                  });
                  me.push(i.el);
                },
                ve = this,
                ye = de;
              ye < fe;
              ye++
            )
              ge(ye);
            se.tbodyEl.setChildrenInPlace(me);
          }
          se.virtualize(W, oe, ae);
          re += se.selfHeight + he;
        }
        for (var be = 0, we = s; be < we.length; be++) {
          we[be].el.detach();
        }
        this.rows = rows;
        this.unusedRows = l = s.concat(l);
        l.length > 10 && (l.length = 10);
        r.style.height ||
          mc(function () {
            return e.updateVirtualDisplay();
          });
        r.setCssStyles({
          width: U + "px",
          height: re + "px",
        });
        var ke = this.scrollEl;
        this.pendingScroll
          ? ((ke.scrollTop = re * this.pendingScroll.top),
            (ke.scrollLeft = U * this.pendingScroll.left),
            (this.lastScroll = this.pendingScroll),
            (this.pendingScroll = null))
          : (this.lastScroll = {
              top: ke.scrollTop / re,
              left: ke.scrollLeft / U,
            });
      }
    };
    t.prototype.saveColumnSizes = function () {
      for (var e = this.columnInfo, t = {}, n = 0, i = this.data.properties; n < i.length; n++) {
        var r = i[n];
        if (e.hasOwnProperty(r)) {
          var o = e[r];
          if (o.customWidth) {
            t[r] = o.customWidth;
          }
        }
      }
      this.config.set("columnSize", t);
    };
    t.prototype.getCellFromDom = function (e) {
      var t = e.closest(".bases-td");
      return t ? this.cellLookup.get(t) : null;
    };
    t.getViewOptions = function (e) {
      var t = e.get("rowHeight");
      return [
        {
          displayName: s3.labelRowHeight(),
          component: function (n) {
            new DropdownComponent(n)
              .addOptions({
                "": s3.optionShort(),
                medium: s3.optionMedium(),
                tall: s3.optionTall(),
                extra: s3.optionExtraTall(),
              })
              .setValue(String.isString(t) ? t : "")
              .onChange(function (t) {
                var n;
                n = t === "" ? null : t;
                e.set("rowHeight", n);
              });
          },
        },
      ];
    };
    return t;
  })(BasesView),
  c3 = (function () {
    function e() {
      this.headerWidth = 0;
      this.contentWidth = 0;
      this.customWidth = 0;
    }
    e.prototype.getWidth = function (e, t) {
      return this.customWidth
        ? Math.max(e, this.customWidth)
        : Math.clamp(Math.max(this.contentWidth, this.headerWidth) + 1, e, t);
    };
    return e;
  })(),
  u3 = (function () {
    function e(view) {
      this.cells = [];
      this.view = view;
      this.el = createDiv("bases-tr");
    }
    e.prototype.virtualize = function (e, t, n) {
      for (var i = this.cells, r = this.el, o = 0, a = [], s = 0; s < i.length; s++) {
        var l = i[s],
          c = e[s],
          u = o + c;
        u >= t &&
          o <= n &&
          (a.push(l.el),
          l.el.setCssStyles({
            insetInlineStart: o + "px",
            width: c + "px",
          }));
        o = u;
      }
      r.setChildrenInPlace(a);
    };
    return e;
  })(),
  h3 = function (view, prop) {
    this.view = view;
    this.prop = prop;
    this.el = createDiv("bases-td");
    view.cellLookup.set(this.el, this);
  },
  p3 = (function () {
    function e(view) {
      this.view = view;
      var t = (this.tableEl = createDiv("bases-table"));
      this.theadEl = t.createDiv("bases-thead");
      this.tbodyEl = t.createDiv("bases-tbody");
      this.header = new d3(view);
      this.theadEl.appendChild(this.header.el);
    }
    e.prototype.render = function (e) {
      this.header.render(e);
    };
    e.prototype.virtualize = function (e, t, n) {
      this.header.virtualize(e, t, n);
    };
    return e;
  })(),
  d3 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.cells = [];
      n.el.dataset.ignoreSwipe = "true";
      return n;
    }
    __extends(t, e);
    t.prototype.render = function (e) {
      var t = this;
      dG(
        this.cells,
        e,
        function (e, t) {
          return e.prop === t;
        },
        function (e) {
          return new f3(t.view, e);
        },
        function (e, t) {
          return e.render(t);
        },
      );
    };
    return t;
  })(u3),
  f3 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this,
        r = i.el,
        o = Xz(n),
        a = o.type,
        names0 = o.name;
      r.draggable = true;
      var l = r.createDiv("bases-table-header"),
        c = (i.innerEl = l.createDiv("bases-table-header-label"));
      i.sortEl = r.createDiv({
        cls: "bases-table-header-sort",
      });
      r.createDiv("bases-table-header-resizer").draggable = true;
      r.toggleClass("mod-formula", a === "formula");
      r.toggleClass("mod-implicit", a === "file");
      i.iconEl = c.createDiv({
        cls: "bases-table-header-icon",
      });
      i.nameEl = c.createDiv({
        cls: "bases-table-header-name",
      });
      r.addEventListener(Platform.isMobile ? "click" : "contextmenu", function (e) {
        var o,
          c = Menu.forEvent(e).setParentElement(r).addSections(["action", "sort", "", "danger"]);
        c.addItem(function (e) {
          return e
            .setTitle(s3.actionHideColumn())
            .setSection("action")
            .setIcon("lucide-eye-off")
            .onClick(function () {
              var e = t.config.getOrder();
              e.remove(i.prop);
              t.config.setOrder(e);
            });
        });
        c.addItem(function (e) {
          return e
            .setTitle(a === "formula" ? s3.actionEditFormula() : s3.actionEditProperty())
            .setSection("danger")
            .setIcon("lucide-edit-3")
            .onClick(function () {
              var e = new SU(t.app, l, names0);
              e.scrollEl.createDiv("bases-toolbar-menu-container", function (e) {
                var n = e.createDiv("bases-toolbar-menu-container-header");
                n.createDiv("menu-title").createDiv({
                  cls: "menu-title-inner",
                  text: i18nProxy.plugins.bases.titleEditProperty({
                    name: names0,
                  }),
                });
                var r = n.createDiv("clickable-icon"),
                  o = new aG(t.queryController, i.prop, !1);
                r.addEventListener("click", function (e) {
                  return o.showActions(e, r);
                });
                setIcon(r, "lucide-more-vertical");
                e.appendChild(o.containerEl);
              });
              e.setAutoDestroy(r);
              e.setOpen(!0);
            });
        });
        var u = i.view.config.getSort().find(function (e) {
          return e.property === n;
        });
        if (
          (c.addItem(function (e) {
            return e
              .setTitle(s3.actionSortAZ())
              .setSection("sort")
              .setChecked((u == null ? undefined : u.direction) === "ASC")
              .setIcon("lucide-arrow-down-wide-narrow")
              .onClick(function () {
                i.view.config.setSortProperty(n, "ASC");
              });
          }),
          c.addItem(function (e) {
            return e
              .setTitle(s3.actionSortZA())
              .setSection("sort")
              .setChecked((u == null ? undefined : u.direction) === "DESC")
              .setIcon("lucide-arrow-up-narrow-wide")
              .onClick(function () {
                i.view.config.setSortProperty(n, "DESC");
              });
          }),
          u &&
            c.addItem(function (e) {
              return e
                .setTitle(s3.actionSortDefault())
                .setSection("sort")
                .setIcon("lucide-eraser")
                .setWarning(!0)
                .onClick(function () {
                  i.view.config.setSortProperty(n, "NONE");
                });
            }),
          a === "note")
        ) {
          c.setSectionSubmenu("action.changeType", {
            title: i18nProxy.properties.optionPropertyType(),
            icon: "lucide-info",
          });
          for (
            var h = i.view.app.metadataTypeManager,
              p = h.registeredTypeWidgets,
              d = h.getTypeInfo(names0).inferred,
              f = function (e) {
                if (
                  e.reservedKeys &&
                  !((o = e.reservedKeys) === null || undefined === o ? undefined : o.contains(names0))
                )
                  return "continue";
                var t = !xM.hasOwnProperty(names0);
                c.addItem(function (n) {
                  return n
                    .setTitle(e.name())
                    .setIcon(e.icon)
                    .setSection("action.changeType")
                    .setDisabled(!t)
                    .setChecked(e.type === d.type)
                    .onClick(function () {
                      h.setType(names0, e.type);
                    });
                });
              },
              m = 0,
              g = Object.values(p);
            m < g.length;
            m++
          ) {
            f(g[m]);
          }
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.render = function (prop) {
      this.prop = prop;
      var t = this,
        n = t.el,
        i = t.iconEl,
        r = t.nameEl,
        o = t.sortEl,
        a = Xz(prop),
        s = a.type,
        l = a.name;
      if (
        (n.toggleClass("mod-formula", s === "formula"),
        n.toggleClass("mod-implicit", s === "file"),
        r.setText(this.view.config.getDisplayName(prop)),
        s === "note")
      ) {
        var c = this.view.app.metadataTypeManager,
          u = c.getPropertyInfo(l).widget;
        setIcon(i, c.getWidget(u).icon);
      } else s === "formula" ? setIcon(i, "lucide-square-function") : s === "file" && setIcon(i, "lucide-info");
      var h = this.view.config.getSort().find(function (t) {
        return t.property === prop;
      });
      h
        ? (n.setAttr("data-sort", h.direction),
          setIcon(o, h.direction === "ASC" ? "lucide-chevron-up" : "lucide-chevron-down"))
        : (n.setAttr("data-sort", null), o.empty());
    };
    return t;
  })(h3),
  m3 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.cells = [];
      return t;
    }
    __extends(t, e);
    t.prototype.render = function (entry, t) {
      var n = this;
      this.entry = entry;
      dG(
        this.cells,
        t,
        function (e, t) {
          return e.prop === t;
        },
        function (e) {
          return new g3(n.view, e);
        },
        function (t) {
          return t.render(entry);
        },
      );
    };
    return t;
  })(u3),
  g3 = (function (e) {
    function t(t, propertyn0) {
      var i = e.call(this, t, propertyn0) || this;
      i.el.dataset.property = propertyn0;
      var r = i.el.createDiv("bases-table-cell");
      i.renderer = t.createRenderer(propertyn0, r);
      r.addEventListener("click", function (e) {
        var t;
        if (e.targetNode === r && i.renderer instanceof xG) {
          (t = i.renderer.propertyEditor) === null || undefined === t || t.focus("end");
        }
      });
      return i;
    }
    __extends(t, e);
    t.prototype.render = function (e) {
      this.renderer.render(e);
    };
    return t;
  })(h3),
  v3 = i18nProxy.plugins.bases,
  y3 = "base",
  b3 = (function () {
    function e() {
      this.id = "bases";
      this.name = v3.name();
      this.description = v3.desc();
      this.defaultOn = true;
      this.registrations = {};
    }
    e.prototype.init = function (app, t) {
      var n = this;
      this.app = app;
      t.registerGlobalCommand({
        id: "bases:new-file",
        name: v3.commandCreateNew(),
        icon: "lucide-layout-list",
        callback: this.createAndOpenBase.bind(this),
      });
      t.registerGlobalCommand({
        id: "bases:insert",
        name: v3.commandInsertNew(),
        icon: "lucide-layout-list",
        editorCheckCallback: function (e, t, i) {
          if (t instanceof uK && !t.inTableCell) {
            e || n.createAndEmbedBase(t);
            return !0;
          }
        },
      });
      t.registerGlobalCommand({
        id: "bases:copy-table",
        name: v3.commandCopyTable(),
        icon: "lucide-copy",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType($j);
          if (t) {
            var i = t.controller.getActiveBasesViewOfType(l3);
            if (i) {
              e || i.copyToClipboard();
              return !0;
            }
          }
        },
      });
      t.registerGlobalCommand({
        id: "bases:change-view",
        name: v3.commandChangeView(),
        icon: "lucide-shapes",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType($j);
          if (t) {
            var i = t.controller.getQueryViewNames();
            if (i.length > 1) {
              e || new w3(n.app, t.controller, i).open();
              return !0;
            }
          }
        },
      });
      t.registerGlobalCommand({
        id: "bases:add-view",
        name: v3.commandAddView(),
        icon: "lucide-shapes",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType($j);
          if (t) {
            e || t.controller.promptForAddView();
            return !0;
          }
        },
      });
      t.registerGlobalCommand({
        id: "bases:add-item",
        name: v3.commandAddItem(),
        icon: "lucide-shapes",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveViewOfType($j);
          if (t) {
            e || t.controller.newItemMenu.open();
            return !0;
          }
        },
      });
      t.registerRibbonItem(v3.commandCreateNew(), "lucide-layout-list", this.createAndOpenBase.bind(this));
      var i = function (t, i, r) {
          t = t.replace(/^(\t+)/gm, function (e, t) {
            return "    ".repeat(t.length);
          });
          var o = app.vault.getFileByPath(r.sourcePath),
            a = new PG(n.app, n, i, o);
          i.addClass("bases-embed", "interactive-child");
          var s = new MarkdownRenderChild(i);
          r.addChild(s);
          s.addChild(a);
          var l = gq.fromString(t),
            c = debounce(function (e) {
              return r.replaceCode(e.toString());
            }, 100);
          l.saveFn = function () {
            a.setQuery(l);
            c(l);
          };
          a.setQuery(l);
        },
        r = MarkdownPreviewRenderer.createCodeBlockPostProcessor(y3, i);
      MarkdownPreviewRenderer.registerPostProcessor(r);
      MarkdownPreviewRenderer.registerCodeBlockPostProcessor(y3, i);
      this.app.workspace.trigger("post-processor-change");
      t.register(function () {
        MarkdownPreviewRenderer.unregisterCodeBlockPostProcessor(y3);
        MarkdownPreviewRenderer.unregisterPostProcessor(r);
        n.app.workspace.trigger("post-processor-change");
        n.registrations = {};
      });
    };
    e.prototype.createAndEmbedBase = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = this.app.fileManager;
              n =
                (s = (a = e.editorComponent.file) === null || undefined === a ? undefined : a.path) !== null &&
                undefined !== s
                  ? s
                  : "";
              i = t.getNewFileParent(n);
              return [4, t.createNewFile(i, undefined, y3)];
            case 1:
              r = l.sent();
              o = e.cm.state;
              e.cm.dispatch(
                o.changeByRange(function (e) {
                  var t = bm(o.doc, e.from),
                    n = "![[".concat(r.path, "]]"),
                    insert = t.ch > 0 ? "\n" + n + "\n" : n + "\n";
                  return {
                    range: EditorSelection.cursor(e.from + n.length),
                    changes: [
                      {
                        from: e.from,
                        to: e.to,
                        insert: insert,
                      },
                    ],
                  };
                }),
              );
              return [2];
          }
        });
      });
    };
    e.prototype.onEnable = function (e, t) {
      var n = this;
      CodeMirror.modes.base = CodeMirror.modes.yaml;
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
      e.embedRegistry.registerExtension(y3, function (e, t, i) {
        var r = (i == null ? undefined : i.startsWith("#")) ? i.substring(1) : "";
        return new LG(n.app, n, e, t, r);
      });
      e.fileManager.registerFileParentCreator(y3, function (e) {
        return n.app.fileManager.getNewFileParent("path", y3);
      });
      t.register(function () {
        e.embedRegistry.unregisterExtension(y3);
      });
      e.workspace.registerHoverLinkSource("bases", {
        display: this.name,
        defaultMod: true,
      });
      e.workspace.registerOperatorFuncConfigs("bases", [
        {
          funcName: "hasProperty",
          display: "has property",
          inverseDisplay: "does not have property",
        },
        {
          funcName: "isEmpty",
          display: "is empty",
          inverseDisplay: "is not empty",
        },
        {
          funcName: "startsWith",
          display: "starts with",
          inverseDisplay: "does not start with",
        },
        {
          funcName: "endsWith",
          display: "ends with",
          inverseDisplay: "does not end with",
        },
        {
          funcName: "contains",
          display: "contains",
          inverseDisplay: "does not contain",
        },
        {
          funcName: "containsAny",
          display: "contains any of",
          inverseDisplay: "does not contain any of",
        },
        {
          funcName: "containsAll",
          display: "contains all of",
          inverseDisplay: "does not contain all of",
        },
        {
          funcName: "matches",
          display: "matches",
          inverseDisplay: "does not match",
        },
        {
          funcName: "hasLink",
          display: "links to",
          inverseDisplay: "does not link to",
        },
        {
          funcName: "inFolder",
          display: "in folder",
          inverseDisplay: "is not in folder",
        },
        {
          funcName: "hasTag",
          display: "has tag",
          inverseDisplay: "does not have tag",
        },
      ]);
      e.viewRegistry.registerViewWithExtensions([y3], Qj, function (e) {
        return new $j(e, n);
      });
      t.register(function () {
        e.viewRegistry.unregisterExtensions([y3]);
        e.viewRegistry.unregisterView(Qj);
      });
      this.registerView(typea30, {
        name: v3.table.name(),
        icon: "lucide-table",
        factory: function (e, t) {
          return new l3(e, t);
        },
        options: l3.getViewOptions,
      });
      this.registerView(typee30, {
        name: v3.cards.name(),
        icon: "lucide-layout-grid",
        factory: function (e, t) {
          return new t3(e, t);
        },
        options: t3.getViewOptions,
      });
    };
    e.prototype.onFileMenu = function (e, t, n, i) {
      var r = this;
      if (n === "file-explorer-context-menu" && t instanceof TFolder) {
        e.addItem(function (e) {
          return e
            .setSection("action-primary")
            .setIcon("lucide-layout-list")
            .setTitle(v3.actionNewBase())
            .onClick(function (e) {
              return __awaiter(r, undefined, undefined, function () {
                var n;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return [4, this.createNewBasesFile(t)];
                    case 1:
                      n = i.sent();
                      return [
                        4,
                        this.app.workspace.getLeaf(Keymap.isModEvent(e)).openFile(n, {
                          eState: {
                            rename: "all",
                          },
                        }),
                      ];
                    case 2:
                      i.sent();
                      return [2];
                  }
                });
              });
            });
        });
      }
    };
    e.prototype.createAndOpenBase = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              e = this.app;
              t =
                (o = (r = e.workspace.getActiveFile()) === null || undefined === r ? undefined : r.path) !== null &&
                undefined !== o
                  ? o
                  : "";
              n = e.fileManager.getNewFileParent(t);
              return [4, this.createNewBasesFile(n, undefined)];
            case 1:
              i = a.sent();
              return [
                4,
                e.workspace.getLeaf().openFile(i, {
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
    };
    e.prototype.createNewBasesFile = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (i) {
          return [2, this.app.fileManager.createNewFile(e, t, y3, n)];
        });
      });
    };
    e.prototype.registerView = function (viewId, viewIdt0) {
      this.registrations.hasOwnProperty(viewId)
        ? new Notice(
            v3.msgErrorRegisterView({
              viewId: viewId,
            }),
          )
        : (this.registrations[viewId] = viewIdt0);
    };
    e.prototype.deregisterView = function (e) {
      delete this.registrations[e];
    };
    e.prototype.getRegistration = function (e) {
      return Object.hasOwn(this.registrations, e) ? this.registrations[e] : null;
    };
    e.prototype.getRegistrations = function () {
      return this.registrations;
    };
    e.prototype.getViewFactory = function (e) {
      return Object.hasOwn(this.registrations, e) ? this.registrations[e].factory : null;
    };
    return e;
  })(),
  w3 = (function (e) {
    function t(t, controller, options) {
      var r = e.call(this, t) || this;
      r.options = options;
      r.controller = controller;
      r.setInstructions([
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
      r.scope.register(null, "Tab", function () {
        return !1;
      });
      r.scope.register(null, "Enter", function (e) {
        if (!e.isComposing) {
          r.selectActiveSuggestion(e);
          return !1;
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return this.options;
    };
    t.prototype.renderSuggestion = function (t, n) {
      e.prototype.renderSuggestion.call(this, t, n);
      var i = this.controller.viewName;
      if (t.item === i) {
        n.createSpan({
          cls: "flair toolbar-badge",
          text: i18nProxy.setting.appearance.labelCurrentlyActive(),
        });
      }
    };
    t.prototype.getItemText = function (e) {
      return e;
    };
    t.prototype.onChooseItem = function (e, t) {
      this.controller.selectView(e);
    };
    return t;
  })(FuzzySuggestModal),
  k3 = (function () {
    function e() {
      this.id = "editor-status";
      this.name = i18nProxy.plugins.editorStatus.name();
      this.description = i18nProxy.plugins.editorStatus.desc();
      this.defaultOn = true;
      this.hiddenFromList = true;
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerStatusBarItem();
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("layout-change", this.updateStatus, this));
      t.registerEvent(e.workspace.on("active-leaf-change", this.updateStatus, this));
      t.statusBarEl.addEventListener("click", this.onClick.bind(this));
      t.statusBarEl.addEventListener("contextmenu", this.onClick.bind(this));
      t.statusBarEl.addClass("mod-clickable");
      this.updateStatus();
    };
    e.prototype.onDisable = function () {};
    e.prototype.getStatus = function () {
      var e = this.getActiveView();
      return e
        ? e.getMode() === "preview"
          ? "read"
          : e.editMode
            ? e.editMode.sourceMode
              ? "source"
              : "live-preview"
            : "source"
        : "";
    };
    e.prototype.getActiveView = function () {
      var e = this.app.workspace.getActiveFileView();
      return e && e instanceof MarkdownView ? e : null;
    };
    e.prototype.setStatus = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, state;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              if (!(t = this.getActiveView())) return [2];
              switch (((state = t.getState()), e)) {
                case "read":
                  state.mode = "preview";
                  break;
                case "source":
                  state.mode = "source";
                  state.source = true;
                  break;
                case "live-preview":
                  state.mode = "source";
                  state.source = false;
              }
              return [
                4,
                t.leaf.setViewState({
                  type: typef00,
                  state: state,
                }),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.updateStatus = function () {
      var e = this.plugin.statusBarEl;
      e.empty();
      e.show();
      var t = e.createSpan("status-bar-item-icon");
      switch (this.getStatus()) {
        case "":
          return void e.hide();
        case "read":
          setIcon(t, "lucide-book-open");
          setTooltip(e, i18nProxy.plugins.editorStatus.read(), {
            placement: "top",
          });
          break;
        case "source":
          setIcon(t, "lucide-code-2");
          setTooltip(e, i18nProxy.plugins.editorStatus.editSource(), {
            placement: "top",
          });
          break;
        case "live-preview":
          setIcon(t, "lucide-edit-3");
          setTooltip(e, i18nProxy.plugins.editorStatus.editLivePreview(), {
            placement: "top",
          });
      }
    };
    e.prototype.onClick = function (e) {
      var t = this,
        n = this.getActiveView();
      if (n) {
        var i = new Menu(),
          r = this.getStatus(),
          o = function (e, n, o) {
            i.addItem(function (i) {
              return i
                .setTitle(o)
                .setIcon(n)
                .setChecked(r === e)
                .onClick(function () {
                  return t.setStatus(e);
                });
            });
          };
        o("read", "lucide-book-open", i18nProxy.plugins.editorStatus.read());
        o("source", "lucide-code-2", i18nProxy.plugins.editorStatus.editSource());
        n.editMode && o("live-preview", "lucide-edit-3", i18nProxy.plugins.editorStatus.editLivePreview());
        i.showAtMouseEvent(e);
      }
    };
    return e;
  })(),
  C3 = i18nProxy.plugins.fileExplorer,
  E3 = (function (e) {
    function t(view, filen0, i) {
      var r = e.call(this, i) || this;
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
      r.rendered = false;
      r.view = view;
      r.file = filen0;
      return r;
    }
    __extends(t, e);
    t.prototype.updateTitle = function () {
      this.innerEl.setText(this.getTitle());
      this.selfEl.setAttr("data-path", this.file.path);
    };
    t.prototype.onRender = function () {
      var e = this;
      if (!this.rendered) {
        this.rendered = true;
        this.updateTitle();
        var t = this.selfEl,
          n = this.view,
          i = n.app.dragManager;
        i.handleDrag(t, function (r) {
          if (n.fileBeingRenamed) return null;
          var o = n.dragFiles(r, e);
          if (o) return o;
          i.updateSource([t], "is-being-dragged");
          var a = e.file;
          return a instanceof TFile ? i.dragFile(r, a) : a instanceof TFolder ? i.dragFolder(r, a) : null;
        });
      }
    };
    t.prototype.isFullTitleShown = function () {
      var e = this.selfEl,
        t = this.innerEl,
        n = e.offsetParent,
        i = parseInt(getComputedStyle(e).paddingLeft) + e.offsetLeft,
        r = n.clientWidth;
      return i + t.scrollWidth <= r + n.scrollLeft;
    };
    t.prototype.startRename = function () {
      var e = this.selfEl,
        t = this.innerEl;
      e.addClass("is-being-renamed");
      t.setAttribute("contenteditable", "true");
      var n = this.view.app.vault.getConfig("spellcheck");
      t.setAttribute("spellcheck", String(n));
      focusAndSelectContent(t);
    };
    t.prototype.stopRename = function () {
      var e = this.innerEl;
      this.selfEl.removeClass("is-being-renamed");
      e.removeAttribute("contenteditable");
      e.scrollLeft = 0;
      var t = e.parentElement.find(".tooltip");
      if (t) {
        t.remove();
      }
    };
    return t;
  })(w_),
  S3 = createTemplateCache(function () {
    var e = createDiv("tree-item nav-file");
    e.createDiv("tree-item-self nav-file-title tappable is-clickable").createDiv(
      "tree-item-inner nav-file-title-content",
    );
    return e;
  }),
  M3 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n, S3()) || this;
      i.tagEl = null;
      return i;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      return this.file.basename;
    };
    t.prototype.updateTitle = function () {
      e.prototype.updateTitle.call(this);
      var t = this.selfEl,
        n = this.tagEl;
      t.toggleClass("is-unsupported", !this.isSupported());
      var i = this.file.extension;
      MARKDOWN_EXTENSIONS.contains(i)
        ? n && (n.detach(), (this.tagEl = null))
        : (n ||
            (n = this.tagEl =
              t.createDiv({
                cls: "nav-file-tag",
              })),
          n.setText(i));
    };
    t.prototype.isSupported = function () {
      return this.view.app.viewRegistry.isExtensionRegistered(this.file.extension);
    };
    t.prototype.onSelfClick = function (e) {
      if (!this.view.tree.handleItemSelection(e, this)) {
        var t = this.view.app.workspace;
        !e.instanceOf(KeyboardEvent) || (e.key !== "ArrowUp" && e.key !== "ArrowDown")
          ? (t.getLeaf(Keymap.isModEvent(e)).openFile(this.file),
            t.setActiveLeaf(t.getMostRecentLeaf(), {
              focus: !0,
            }))
          : t.getUnpinnedLeaf(!1).openFile(this.file);
      }
    };
    return t;
  })(E3),
  x3 = createTemplateCache(function () {
    var e = createDiv("tree-item nav-folder");
    e.createDiv("tree-item-self nav-folder-title is-clickable").createDiv("tree-item-inner nav-folder-title-content");
    e.createDiv("tree-item-children nav-folder-children");
    return e;
  }),
  T3 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n, x3()) || this;
      i.vChildren = new YF(i);
      i.pusherEl = rN();
      i.setCollapsible(!0);
      i.collapsed = true;
      CO(i.el, !0);
      i.childrenEl.detach();
      return i;
    }
    __extends(t, e);
    t.prototype.getTitle = function () {
      var e = this.file,
        t = e.name;
      e.isRoot() && (t = e.vault.getName());
      return t;
    };
    t.prototype.onSelfClick = function (e) {
      if (!(e.instanceOf(MouseEvent) && e.button !== 0)) {
        this.view.fileBeingRenamed !== this.file &&
          (this.view.tree.handleItemSelection(e, this) || this.toggleCollapsed(!0));
      }
    };
    t.prototype.setCollapsed = function (t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return this.collapsed === t
                ? [2]
                : ((r = (i = this).view),
                  (o = i.childrenEl),
                  (a = r.tree),
                  (o.style.minHeight = ""),
                  a.infinityScroll.invalidate(this, !0),
                  [4, e.prototype.setCollapsed.call(this, t, n)]);
            case 1:
              s.sent();
              a.infinityScroll.invalidate(this, !0);
              t || this.file.isRoot() || r.setIsAllCollapsed(!1);
              r.ready && a.requestSaveFolds();
              return [2];
          }
        });
      });
    };
    t.prototype.sort = function () {
      var e = this.view;
      this.vChildren.setChildren(e.getSortedFolderItems(this.file));
    };
    return t;
  })(k_(E3)),
  D3 = "file-explorer",
  A3 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.prefersCollapsed = true;
      return t;
    }
    __extends(t, e);
    t.prototype.selectItem = function (t) {
      if (!(!this.app.vault.getConfig("showUnsupportedFiles") && t instanceof M3 && !t.isSupported())) {
        e.prototype.selectItem.call(this, t);
      }
    };
    t.prototype.onKeyArrowRight = function (t) {
      this.focusedItem && this.focusedItem instanceof M3
        ? this.focusedItem.onSelfClick(t)
        : e.prototype.onKeyArrowRight.call(this, t);
    };
    return t;
  })(z0),
  P3 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-folder-closed";
      n.activeDom = null;
      n.collapseOrExpandAllEl = null;
      n.ready = false;
      n.sortOrder = "alphabetical";
      n.autoRevealFile = false;
      n.fileBeingRenamed = null;
      n.requestSort = debounce(n.sort.bind(n), 20);
      n._revealActiveFileQueued = false;
      n._sortQueued = false;
      n.mouseoverExpandTimeout = null;
      n.lastDropTargetEl = null;
      var i = n.containerEl;
      n.navFileContainerEl = i.createDiv("nav-files-container");
      var scope = (n.scope = new Scope(n.app.scope));
      n.tree = new A3(n, {
        app: n.app,
        containerEl: n.navFileContainerEl,
        id: D3,
        scope: scope,
        getNodeId: n.getNodeId.bind(n),
        handleDeleteSelectedItems: n.onDeleteSelectedFiles.bind(n),
        handleRenameFocusedItem: n.onKeyRename.bind(n),
        handleCollapseAll: n.setIsAllCollapsed.bind(n),
      });
      n.tree.infinityScroll.setWidth = true;
      var o = (n.headerDom = new s0(n.app, i));
      o.addNavButton("lucide-edit", C3.actionNewNote(), n.onCreateNewNoteClick.bind(n));
      o.addNavButton("lucide-folder-plus", C3.actionNewFolder(), n.onCreateNewFolderClick.bind(n));
      o.addSortButton(
        _F,
        jF,
        function (e) {
          return n.setSortOrder(e);
        },
        function () {
          return n.sortOrder;
        },
      );
      n.autoRevealButtonEl = o.addNavButton(
        "lucide-gallery-vertical",
        C3.actionAutoReveal(),
        n.onToggleAutoReveal.bind(n),
      );
      n.collapseOrExpandAllEl = o.addNavButton("lucide-chevrons-up-down", C3.actionExpandAll(), function () {
        return n.tree.toggleCollapseAll();
      });
      n.fileItems = {};
      n.files = qN();
      n.fileRenameScope = new Scope(n.app.scope);
      n.fileRenameScope.register([], "Enter", n.onKeyEnterInRename.bind(n));
      n.fileRenameScope.register([], "Escape", n.onKeyEscInRename.bind(n));
      xc(i);
      i.on("click", ".nav-file-title, .nav-folder-title", n.onFileClick.bind(n));
      i.on("auxclick", ".nav-file-title, .nav-folder-title", n.onFileClick.bind(n));
      i.on("mouseover", ".nav-file-title, .nav-folder-title", n.onFileMouseover.bind(n));
      i.on("mouseout", ".nav-file-title, .nav-folder-title", n.onFileMouseout.bind(n));
      i.on("contextmenu", ".nav-file-title, .nav-folder-title", n.openFileContextMenu.bind(n));
      i.on("blur", ".nav-file-title-content, .nav-folder-title-content", n.onTitleBlur.bind(n), {
        capture: !0,
      });
      i.on("input", ".nav-file-title-content, .nav-folder-title-content", n.onFileRenameInput.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.isItem = function (e) {
      return e instanceof E3;
    };
    t.prototype.getNodeId = function (e) {
      return e.file.path;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.sortOrder = this.sortOrder;
      t.autoReveal = this.autoRevealFile;
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, o, a;
        return __generator(this, function (s) {
          i = t.autoReveal;
          r = t.sortOrder;
          isBoolean(i) && this.setAutoReveal(i);
          r && this.sortOrder !== r && ((this.sortOrder = t.sortOrder), this.requestSort());
          t.hasOwnProperty("newFile") &&
            String.isString(t.newFile) &&
            ((o = t.newFile), (a = this.app.vault.getAbstractFileByPath(o)) && this.afterCreate(a, !1));
          return [2, e.prototype.setState.call(this, t, n)];
        });
      });
    };
    t.prototype.setIsAllCollapsed = function (isAllCollapsed) {
      this.tree.isAllCollapsed = isAllCollapsed;
      isAllCollapsed
        ? (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-up-down"),
          setTooltip(this.collapseOrExpandAllEl, C3.actionExpandAll()))
        : (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-down-up"),
          setTooltip(this.collapseOrExpandAllEl, C3.actionCollapseAll()));
    };
    t.prototype.getDisplayText = function () {
      return C3.name();
    };
    t.prototype.getViewType = function () {
      return D3;
    };
    t.prototype.load = function () {
      var t = this;
      e.prototype.load.call(this);
      var n = this.app,
        i = n.vault;
      this.registerEvent(i.on("create", this.onCreate, this));
      this.registerEvent(i.on("delete", this.onDelete, this));
      this.registerEvent(i.on("rename", this.onRename, this));
      this.registerEvent(i.on("modify", this.onModify, this));
      this.registerEvent(i.on("config-changed", this.onConfigChanged, this));
      this.registerEvent(n.workspace.on("file-open", this.onFileOpen, this));
      this.registerEvent(n.viewRegistry.on("extensions-updated", this.onExtensionsUpdated, this));
      this.navFileContainerEl.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.targetNode === t.navFileContainerEl &&
          (t.tree.clearSelectedDoms(), t.tree.setFocusedItem(null), t.onFileContextMenu(e, n.vault.getRoot()));
      });
      this.ready = false;
      for (var r = 0, o = n.vault.getAllLoadedFiles(); r < o.length; r++) {
        var a = o[r];
        if (!(a instanceof TFolder && a.isRoot())) {
          this.onCreate(a);
        }
      }
      this.attachDropHandler(n.vault.getRoot(), this.navFileContainerEl);
      this.updateShowUnsupportedFiles();
      this.app.workspace.onLayoutReady(function () {
        t.ready = true;
        t.sort();
        t.onFileOpen(t.app.workspace.getActiveFile());
        t.tree.loadFolds();
      });
    };
    t.prototype.onCreate = function (e) {
      if (!(e instanceof TFolder && e.isRoot())) {
        var t = this.fileItems,
          n = e.path;
        if (!t.hasOwnProperty(n)) {
          var i = undefined;
          e instanceof TFile
            ? (i = new M3(this, e))
            : e instanceof TFolder && ((i = new T3(this, e)), this.attachDropHandler(e, i.el));
          t[n] = i;
          this.files.set(i.el, e);
        }
        this.requestSort();
      }
    };
    t.prototype.onDelete = function (e) {
      var t = this.fileItems,
        n = e.path;
      if (t.hasOwnProperty(n)) {
        var i = t[n];
        this.files.delete(i.el);
        delete t[n];
        this.activeDom === i && (this.activeDom = null);
        this.tree.selectedDoms.delete(i);
        this.tree.focusedItem === i && this.tree.setFocusedItem(null);
      }
      this.requestSort();
    };
    t.prototype.onRename = function (e, t) {
      var n = this.fileItems,
        i = e.path;
      if (n.hasOwnProperty(t)) {
        var r = n[t];
        delete n[t];
        n[i] = r;
        r.updateTitle();
        this.files.set(r.el, e);
        r instanceof T3 && this.tree.requestSaveFolds();
        r.info.computed = false;
      }
      this.requestSort();
    };
    t.prototype.onModify = function () {
      if (!(this.sortOrder !== "byModifiedTime" && this.sortOrder !== "byModifiedTimeReverse")) {
        this.requestSort();
      }
    };
    t.prototype.onConfigChanged = function (e) {
      if (e === "showUnsupportedFiles") {
        this.updateShowUnsupportedFiles();
      }
    };
    t.prototype.updateShowUnsupportedFiles = function () {
      var e = this.app.vault;
      this.navFileContainerEl.toggleClass("show-unsupported", e.getConfig("showUnsupportedFiles"));
      this.tree.infinityScroll.invalidateAll();
    };
    t.prototype.onFileContextMenu = function (e, t) {
      var n = this,
        i = new Menu().addSections([
          "title",
          "open",
          "action-primary",
          "action",
          "info",
          "view",
          "system",
          "",
          "danger",
        ]),
        r = t instanceof TFolder && t.isRoot(),
        o = Array.from(this.tree.selectedDoms);
      if (
        o.length > 1 &&
        o.some(function (e) {
          return e.file === t;
        })
      ) {
        var a = o.map(function (e) {
            return e.file;
          }),
          s = XJ(a);
        Platform.isPhone &&
          i.addItem(function (e) {
            return e
              .setSection("title")
              .setIcon("lucide-files")
              .setTitle(
                i18nProxy.nouns.fileWithCount({
                  count: o.length,
                }),
              )
              .setIsLabel(!0);
          });
        i.addItem(function (e) {
          return e
            .setSection("action-primary")
            .setTitle(
              C3.actionNewFolderWithCount({
                count: s.length,
              }),
            )
            .setIcon("lucide-folder-plus")
            .onClick(function () {
              return __awaiter(n, undefined, undefined, function () {
                var e, n;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      e = null;
                      t && (e = t instanceof TFolder ? t : t.parent);
                      return [4, this.app.fileManager.createNewFolder(e)];
                    case 1:
                      n = i.sent();
                      return [4, this.afterCreate(n, !1)];
                    case 2:
                      i.sent();
                      return [4, YJ(this.app, s, n)];
                    case 3:
                      i.sent();
                      this.tree.clearSelectedDoms();
                      return [2];
                  }
                });
              });
            });
        });
        i.addItem(function (e) {
          return e
            .setSection("danger")
            .setTitle(C3.menuOptDelete())
            .setIcon("lucide-trash-2")
            .setWarning(!0)
            .onClick(function () {
              return __awaiter(n, undefined, undefined, function () {
                var e, t, n;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      e = 0;
                      t = a;
                      i.label = 1;
                    case 1:
                      return e < t.length ? ((n = t[e]), [4, this.app.vault.exists(n.path)]) : [3, 5];
                    case 2:
                      return i.sent() ? [4, this.app.fileManager.promptForDeletion(n)] : [3, 4];
                    case 3:
                      i.sent();
                      i.label = 4;
                    case 4:
                      e++;
                      return [3, 1];
                    case 5:
                      return [2];
                  }
                });
              });
            });
        });
        this.app.workspace.trigger("files-menu", i, a, "file-explorer-context-menu", null);
      } else {
        if (Platform.isPhone) {
          var l = createFragment(function (e) {
            return e.createDiv({
              text: t.name,
            });
          });
          if (t instanceof TFile) {
            var c = C3.tooltipModifiedTime({
                time: window.moment(t.stat.mtime).format("YYYY-MM-DD HH:mm"),
              }),
              u = C3.tooltipCreatedTime({
                time: window.moment(t.stat.ctime).format("YYYY-MM-DD HH:mm"),
              });
            l.createDiv({
              cls: "menu-item-desc",
              text: "".concat(c, "\n").concat(u),
            });
          } else if (t instanceof TFolder) {
            var fileCount = i18nProxy.nouns.fileWithCount({
                count: t.getFileCount(),
              }),
              folderCount = i18nProxy.nouns.folderWithCount({
                count: t.getFolderCount(),
              });
            l.createDiv({
              cls: "menu-item-desc",
              text: C3.tooltipFoldersFilesCount({
                fileCount: fileCount,
                folderCount: folderCount,
              }),
            });
          }
          i.addItem(function (e) {
            return e.setSection("title").setTitle(l).removeIcon().setIsLabel(!0);
          });
        }
        if (t instanceof TFolder) {
          var d = t;
          i.addItem(function (e) {
            return e
              .setSection("action-primary")
              .setTitle(C3.menuOptNewNote())
              .setIcon("lucide-edit")
              .onClick(function (e) {
                var t = Keymap.isModifier(e, "Mod");
                n.createAbstractFile("file", d, t);
              });
          }).addItem(function (e) {
            return e
              .setSection("action-primary")
              .setTitle(C3.menuOptNewFolder())
              .setIcon("lucide-folder-open")
              .onClick(function (e) {
                var t = Keymap.isModifier(e, "Mod");
                n.createAbstractFile("folder", d, t);
              });
          });
        }
        r ||
          i.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(C3.menuOptRename())
              .setIcon("lucide-edit-3")
              .onClick(function () {
                return n.startRenameFile(t);
              });
          });
        t instanceof TFile &&
          (i.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openInNewTab())
              .setIcon("lucide-file-plus")
              .onClick(function () {
                return __awaiter(n, undefined, undefined, function () {
                  return __generator(this, function (e) {
                    t instanceof TFile && this.app.workspace.openLinkText(t.path, "", "tab");
                    return [2];
                  });
                });
              });
          }),
          Platform.canSplit &&
            i.addItem(function (e) {
              return e
                .setSection("open")
                .setTitle(i18nProxy.interface.menu.openToTheRight())
                .setIcon("lucide-separator-vertical")
                .onClick(function () {
                  return __awaiter(n, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      t instanceof TFile && this.app.workspace.openLinkText(t.path, "", "split");
                      return [2];
                    });
                  });
                });
            }));
        r ||
          (i.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(Platform.isMacOS ? C3.menuOptMakeCopyMac() : C3.menuOptMakeCopy())
              .setIcon("lucide-files")
              .onClick(function (e) {
                return __awaiter(n, undefined, undefined, function () {
                  var n, i, r;
                  return __generator(this, function (o) {
                    switch (o.label) {
                      case 0:
                        n = Keymap.isModifier(e, "Mod");
                        i = this.app.vault.getAvailablePath($c(t.path), t instanceof TFile ? t.extension : undefined);
                        return [4, this.app.vault.copy(t, i)];
                      case 1:
                        r = o.sent();
                        this.afterCreate(r, n);
                        return [2];
                    }
                  });
                });
              });
          }),
          i.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(C3.menuOptDelete())
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                n.app.fileManager.promptForDeletion(t);
              });
          }));
        this.app.workspace.trigger("file-menu", i, t, "file-explorer-context-menu", null);
      }
      i.showAtMouseEvent(e);
      var f = this.fileItems[t.path];
      if (f) {
        this.tree.setFocusedItem(f);
        f.selfEl.addClass("has-active-menu");
        i.onHide(function () {
          f.selfEl.removeClass("has-active-menu");
        });
      }
    };
    t.prototype.openFileContextMenu = function (e, t) {
      var n = this.files.get(t.parentElement);
      if (this.fileBeingRenamed !== n) {
        e.preventDefault();
        this.onFileContextMenu(e, n);
      }
    };
    t.prototype.setSortOrder = function (sortOrder) {
      this.sortOrder = sortOrder;
      this.sort();
    };
    t.prototype.setAutoReveal = function (autoRevealFile) {
      if (autoRevealFile !== this.autoRevealFile) {
        this.autoRevealFile = autoRevealFile;
        this.autoRevealButtonEl.toggleClass("is-active", autoRevealFile);
      }
    };
    t.prototype.onToggleAutoReveal = function () {
      this.setAutoReveal(!this.autoRevealFile);
      this.autoRevealFile && this.revealActiveFile();
      this.app.workspace.requestSaveLayout();
    };
    t.prototype.onCreateNewFolderClick = function (e) {
      e.preventDefault();
      this.createAbstractFile("folder", null, !1);
    };
    t.prototype.onCreateNewNoteClick = function (e) {
      e.preventDefault();
      var t = "",
        n = this.app.workspace.getActiveFile();
      if (n) {
        t = n.path;
      }
      var i = this.app.fileManager.getNewFileParent(t);
      this.createAbstractFile("file", i, Keymap.isModEvent(e) || "tab");
    };
    t.prototype.createAbstractFile = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = this.app;
              r = null;
              a.label = 1;
            case 1:
              a.trys.push([1, 6, , 7]);
              return e !== "file" ? [3, 3] : [4, i.fileManager.createNewMarkdownFile(t)];
            case 2:
              r = a.sent();
              return [3, 5];
            case 3:
              return e !== "folder" ? [3, 5] : [4, i.fileManager.createNewFolder(t)];
            case 4:
              r = a.sent();
              a.label = 5;
            case 5:
              return [3, 7];
            case 6:
              o = a.sent();
              new Notice(o.toString());
              return [2];
            case 7:
              this.afterCreate(r, n);
              return [2];
          }
        });
      });
    };
    t.prototype.afterCreate = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return e
                ? ((n = this.app),
                  e instanceof TFile
                    ? ((i = n.workspace),
                      [
                        4,
                        i.getLeaf(t).openFile(e, {
                          active: true,
                          state: {
                            mode: "source",
                          },
                          eState: {
                            rename: "all",
                          },
                        }),
                      ])
                    : [3, 2])
                : [2];
            case 1:
              o.sent();
              return [3, 3];
            case 2:
              n.nextFrame(function () {
                r.sort();
                r.startRenameFile(e);
                var t = r.fileItems[e.path];
                if (t) {
                  r.tree.infinityScroll.scrollIntoView(t, 4);
                }
              });
              o.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    t.prototype.onFileClick = function (e, t) {
      if (!e.defaultPrevented && (e.button === 0 || e.button === 1)) {
        var n = this.files.get(t.parentElement);
        if (n) {
          var i = this.fileItems[n.path];
          if (i) {
            i.onSelfClick(e);
          }
        }
      }
    };
    t.prototype.onFileMouseover = function (event, targetEl) {
      if (Mc(event, targetEl) && !Nc(event)) {
        var n = this.files.get(targetEl.parentElement);
        if (n) {
          var i = "",
            r = "";
          if (n instanceof TFile) {
            i = C3.tooltipModifiedTime({
              time: window.moment(n.stat.mtime).format("YYYY-MM-DD HH:mm"),
            });
            r = C3.tooltipCreatedTime({
              time: window.moment(n.stat.ctime).format("YYYY-MM-DD HH:mm"),
            });
          }
          var o = this.fileItems[n.path],
            a = "";
          if ((o && !o.isFullTitleShown() && (a += o.getTitle()), n instanceof TFile)) {
            a !== "" && (a += "\n\n");
            a += "".concat(i, "\n").concat(r);
          } else if (n instanceof TFolder) {
            var fileCount = i18nProxy.nouns.fileWithCount({
                count: n.getFileCount(),
              }),
              folderCount = i18nProxy.nouns.folderWithCount({
                count: n.getFolderCount(),
              });
            a !== "" && (a += "\n\n");
            a += C3.tooltipFoldersFilesCount({
              fileCount: fileCount,
              folderCount: folderCount,
            });
          }
          a !== "" &&
            displayTooltip(targetEl, a, {
              placement: this.getSideTooltipPlacement(),
              gap: 24,
              horizontalParent: this.containerEl,
              delay: DEFAULT_TOOLTIP_DELAY,
            });
          n instanceof TFile &&
            this.app.workspace.trigger("hover-link", {
              event: event,
              source: "file-explorer",
              hoverParent: this,
              targetEl: targetEl,
              linktext: n.path,
            });
        }
      }
    };
    t.prototype.onFileMouseout = function (e, t) {
      if (Mc(e, t)) {
        hideTooltip();
      }
    };
    t.prototype.onFileOpen = function (e) {
      var t,
        activeDom = e ? this.fileItems[e.path] : null;
      if (activeDom !== this.activeDom) {
        activeDom !== this.tree.focusedItem && this.tree.clearSelectedDoms();
        (t = this.activeDom) === null || undefined === t || t.selfEl.removeClass("is-active");
        activeDom == null || activeDom.selfEl.addClass("is-active");
        this.activeDom = activeDom;
        this.autoRevealFile && this.revealActiveFile();
      }
    };
    t.prototype.revealActiveFile = function () {
      var e = this,
        t = this.activeDom,
        n = this.containerEl;
      if (t)
        if (n.isShown()) {
          this._revealActiveFileQueued = false;
          for (var i = t.parent; i && i instanceof T3; ) {
            i.setCollapsed(!1, !1);
            i = i.parent;
          }
          this.tree.infinityScroll.scrollIntoView(t, 4);
        } else if (!this._revealActiveFileQueued) {
          n.onNodeInserted(function () {
            return e.revealActiveFile();
          }, !0);
          this._revealActiveFileQueued = true;
        }
    };
    t.prototype.revealInFolder = function (e) {
      var t = this,
        n = this.fileItems;
      if (n.hasOwnProperty(e.path)) {
        for (var i = n[e.path], r = e.parent; r && r.path !== null; ) {
          var o = n[r.path];
          o && o instanceof T3 && o.collapsed && o.toggleCollapsed(!1);
          r = r.parent;
        }
        this.tree.setFocusedItem(i);
        this.app.nextFrame(function () {
          t.tree.infinityScroll.scrollIntoView(i, 4);
          flashElement(i.selfEl);
          t.app.workspace.setActiveLeaf(t.leaf);
        });
      }
    };
    t.prototype.sort = function () {
      var e = this;
      if (this.ready)
        if (this.containerEl.isShown()) {
          this._sortQueued = false;
          var t = this,
            n = t.app.vault,
            i = t.fileItems,
            r = t.tree,
            o = [];
          for (var a in i)
            if (i.hasOwnProperty(a)) {
              o.push(i[a]);
            }
          for (var s = this.navFileContainerEl, scrollTop = s.scrollTop, c = 0, u = o; c < u.length; c++) {
            var h = u[c];
            if (h instanceof T3) {
              h.sort();
            }
          }
          var p = this.getSortedFolderItems(n.getRoot());
          r.infinityScroll.rootEl.vChildren.setChildren(p);
          s.scrollTop = scrollTop;
          r.infinityScroll.compute();
          this.autoRevealFile && this.revealActiveFile();
        } else if (!this._sortQueued) {
          this.containerEl.onNodeInserted(function () {
            return e.requestSort();
          }, !0);
          this._sortQueued = true;
        }
    };
    t.prototype.getSortedFolderItems = function (e) {
      var t = KF(this.sortOrder),
        n = e.children.slice();
      n.sort(function (e, n) {
        var i = e instanceof TFolder,
          r = n instanceof TFolder;
        return i || r ? (i && !r ? -1 : r && !i ? 1 : Eb(e.name, n.name)) : t(e, n);
      });
      for (var i = [], r = 0, o = n; r < o.length; r++) {
        var a = o[r],
          s = this.fileItems[a.path];
        if (s) {
          i.push(s);
        }
      }
      return i;
    };
    t.prototype.dragFiles = function (e, t) {
      var n = this.tree.selectedDoms,
        i = n.entries().next().value;
      if (n.size === 0 || (n.size === 1 && i === t)) return null;
      if (!n.has(t)) return null;
      var r = [],
        o = [];
      n.forEach(function (e) {
        o.push(e.file);
        r.push(e.el);
      });
      var a = this.app.dragManager;
      a.updateSource(r, "is-being-dragged");
      return a.dragFiles(e, o);
    };
    t.prototype.attachDropHandler = function (e, lastDropTargetEl) {
      var n = this;
      this.app.dragManager.handleDrop(
        lastDropTargetEl,
        function (i, r, o) {
          i.preventDefault();
          var foldera0 = e.name || n.app.vault.getName();
          if (o) {
            var s = n.fileItems[e.path];
            if (n.lastDropTargetEl !== lastDropTargetEl) {
              lastDropTargetEl.win.clearTimeout(n.mouseoverExpandTimeout);
              n.mouseoverExpandTimeout = lastDropTargetEl.win.setTimeout(function () {
                n.lastDropTargetEl === lastDropTargetEl && s instanceof T3 && s.setCollapsed(!1, !0);
              }, 750);
              n.lastDropTargetEl = lastDropTargetEl;
            }
          } else {
            lastDropTargetEl.win.clearTimeout(n.mouseoverExpandTimeout);
            n.lastDropTargetEl = null;
            n.mouseoverExpandTimeout = null;
          }
          if (!r)
            return hasFilesInDragData(i.dataTransfer)
              ? (o || n.app.importAttachments(extractFilesFromDataTransfer(i.dataTransfer, "drop", !0), e),
                {
                  dropEffect: "copy",
                  hoverEl: lastDropTargetEl,
                  hoverClass: "is-being-dragged-over",
                })
              : undefined;
          if (r.type === "file" || r.type === "folder") {
            var l = r.file;
            if (!ZJ(l, e)) return;
            if (!o) {
              var c = l.name;
              if ((e.path !== "/" && (c = e.path + "/" + c), l.parent === e)) return;
              if (r.type === "file") {
                var u = $c(c),
                  h = getExtension(getFilename(c));
                c = n.app.vault.getAvailablePath(u, h);
              } else c = n.app.vault.getAvailablePath(c);
              n.app.fileManager.renameFile(l, c);
            }
            return {
              action: i18nProxy.interface.dragAndDrop.moveIntoFolder({
                folder: foldera0,
              }),
              dropEffect: "move",
              hoverEl: lastDropTargetEl,
              hoverClass: "is-being-dragged-over",
            };
          }
          if (r.type === "files") {
            var p = QJ(r.files, e);
            if (p.length === 0) return;
            if (!o) {
              YJ(n.app, p, e);
              var d = n.fileItems[e.path];
              if (d && d instanceof T3 && d.collapsed) {
                n.tree.clearSelectedDoms();
              }
            }
            return {
              action: i18nProxy.interface.dragAndDrop.moveIntoFolder({
                folder: foldera0,
              }),
              dropEffect: "move",
              hoverEl: lastDropTargetEl,
              hoverClass: "is-being-dragged-over",
            };
          }
        },
        !0,
      );
    };
    t.prototype.onTitleBlur = function () {
      this.acceptRename();
    };
    t.prototype.onFileRenameInput = function (e, t) {
      var n = this.files.get(t.parentElement.parentElement),
        i = t.getText();
      ((t.childNodes.length === 1 && t.firstChild.nodeType === Node.TEXT_NODE) ||
        (t.setText(i), focusAndSelectContent(t, !1)),
      (i = i.trim()),
      hideTooltip(),
      Zb.test(i))
        ? displayTooltip(t.parentElement, C3.msgInvalidCharacters() + Kb, {
            classes: ["mod-error"],
          })
        : this.app.vault.checkForDuplicate(n, i)
          ? displayTooltip(t.parentElement, C3.msgFileAlreadyExists(), {
              classes: ["mod-error"],
            })
          : Xb.test(i) &&
            displayTooltip(t.parentElement, C3.msgUnsafeCharacters() + Yb, {
              classes: ["mod-error"],
            });
    };
    t.prototype.startRenameFile = function (fileBeingRenamed) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return fileBeingRenamed instanceof TFolder && fileBeingRenamed.isRoot() ? [2] : [4, this.acceptRename()];
            case 1:
              for (
                r.sent(), this.fileBeingRenamed = fileBeingRenamed, t = fileBeingRenamed.parent;
                t && t.path !== null;
              ) {
                (n = this.fileItems[t.path]) && n instanceof T3 && n.collapsed && n.toggleCollapsed(!1);
                t = t.parent;
              }
              this.app.keymap.pushScope(this.fileRenameScope);
              i = this.fileItems[fileBeingRenamed.path];
              this.tree.setFocusedItem(i, !0);
              i.startRename();
              return [2];
          }
        });
      });
    };
    t.prototype.acceptRename = function () {
      return __awaiter(this, undefined, undefined, function () {
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
              if (!(e = this.fileBeingRenamed)) return [2];
              if ((this.exitRename(), (t = this.fileItems[e.path]), (n = t.innerEl), (i = n.getText().trim()) === "")) {
                t.updateTitle();
                this.displayError(C3.msgEmptyFileName(), t);
                return [2];
              }
              if (i.startsWith(".")) {
                t.updateTitle();
                this.displayError(C3.msgBadDotfile(), t);
                return [2];
              }
              if (((r = e.getNewPathAfterRename(i)), e.path === r)) {
                t.updateTitle();
                return [2];
              }
              l.label = 1;
            case 1:
              l.trys.push([1, 3, , 4]);
              return [4, this.app.fileManager.renameFile(e, r)];
            case 2:
              l.sent();
              return [3, 4];
            case 3:
              (o = l.sent()) && (console.error(o), (a = o.message || o.code || o.toString()), this.displayError(a, t));
              return [3, 4];
            case 4:
              t.updateTitle();
              setTimeout(function () {
                return s.tree.infinityScroll.scrollIntoView(t, 4);
              }, 0);
              return [2];
          }
        });
      });
    };
    t.prototype.displayError = function (e, t) {
      displayTooltip(t.selfEl, e, {
        placement: "bottom",
        classes: ["mod-error"],
      });
      setTimeout(hideTooltip, 2e3);
    };
    t.prototype.exitRename = function () {
      var e = this.fileBeingRenamed;
      this.fileBeingRenamed = null;
      this.fileItems[e.path].stopRename();
      this.app.keymap.popScope(this.fileRenameScope);
    };
    t.prototype.onKeyEnterInRename = function (e) {
      if (!e.isComposing) {
        e.preventDefault();
        this.acceptRename();
      }
    };
    t.prototype.onKeyEscInRename = function () {
      var e = this.fileBeingRenamed;
      if (e) {
        this.fileItems[e.path].updateTitle();
        this.exitRename();
      }
    };
    t.prototype.onDeleteSelectedFiles = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              e.preventDefault();
              t = [];
              n = this.tree;
              i = n.focusedItem;
              (r = n.selectedDoms).size > 0
                ? (t = Array.from(r).map(function (e) {
                    return e.file;
                  }))
                : i instanceof E3 && t.push(i.file);
              o = 0;
              a = t;
              l.label = 1;
            case 1:
              return o < a.length
                ? (s = a[o]) === this.app.vault.getRoot()
                  ? [3, 4]
                  : [4, this.app.vault.exists(s.path)]
                : [3, 5];
            case 2:
              return l.sent() ? [4, this.app.fileManager.promptForDeletion(s)] : [3, 4];
            case 3:
              l.sent();
              l.label = 4;
            case 4:
              o++;
              return [3, 1];
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.onKeyRename = function (e) {
      var t = this.tree.focusedItem;
      if (t) {
        e.preventDefault();
        var n = this.files.get(t.el);
        if (n) {
          this.startRenameFile(n);
        }
      }
    };
    t.prototype.onExtensionsUpdated = function () {
      var e = this.fileItems;
      for (var t in e)
        if (e.hasOwnProperty(t)) {
          e[t].updateTitle();
        }
    };
    return t;
  })(View),
  L3 = i18nProxy.plugins.fileExplorer,
  I3 = (function () {
    function e() {
      this.id = "file-explorer";
      this.name = L3.name();
      this.description = L3.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerGlobalCommand({
        id: "file-explorer:open",
        name: L3.actionShow(),
        icon: "lucide-files",
        callback: function () {
          n.app.workspace.ensureSideLeaf(D3, "left", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "file-explorer:reveal-active-file",
        name: L3.actionRevealActiveFile(),
        icon: "lucide-navigation",
        checkCallback: function (e) {
          var t = n.app.workspace.getActiveFile();
          if (t) {
            e || n.revealInFolder(t);
            return !0;
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "file-explorer:new-folder",
        name: L3.actionCreateFolder(),
        icon: "lucide-folder-plus",
        callback: function () {
          return __awaiter(n, undefined, undefined, function () {
            var t;
            return __generator(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, app.fileManager.createNewFolder()];
                case 1:
                  t = n.sent();
                  this.app.workspace.ensureSideLeaf(D3, "left", {
                    active: true,
                    reveal: true,
                    state: {
                      newFile: t.path,
                    },
                  });
                  return [2];
              }
            });
          });
        },
      });
      plugin.registerViewType(D3, function (e) {
        return new P3(e);
      });
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
      t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
      e.workspace.registerHoverLinkSource("file-explorer", {
        display: this.name,
        defaultMod: true,
      });
    };
    e.prototype.onDisable = function (e) {
      e.workspace.unregisterHoverLinkSource("file-explorer");
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.onFileMenu = function (e, t, n) {
      var i = this;
      if (!Platform.isMobile && t instanceof TFile && n !== "file-explorer-context-menu") {
        e.addItem(function (e) {
          return e
            .setSection("system")
            .setTitle(L3.actionRevealFile())
            .setIcon("lucide-folder-open")
            .onClick(function () {
              return i.revealInFolder(t);
            });
        });
      }
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(D3, "left", {
        reveal: !1,
      });
    };
    e.prototype.revealInFolder = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t = this.app;
              return (n = t.workspace.getLeavesOfType(D3)).length !== 0
                ? [3, 2]
                : [
                    4,
                    (i = t.workspace.getLeftLeaf(!1)).setViewState({
                      type: "file-explorer",
                    }),
                  ];
            case 1:
              r.sent();
              return [3, 3];
            case 2:
              i = n[0];
              r.label = 3;
            case 3:
              return [4, t.workspace.revealLeaf(i)];
            case 4:
              r.sent();
              this.app.workspace.setActiveLeaf(i, {
                focus: !0,
              });
              i.view.revealInFolder(e);
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  O3 = {
    intervalMinutes: 5,
    keepDays: 7,
  },
  F3 = i18nProxy.plugins.fileRecovery,
  N3 = (function () {
    function e() {
      this.id = "file-recovery";
      this.name = F3.name();
      this.description = F3.desc();
      this.defaultOn = true;
      this.app = null;
      this.pluginInstance = null;
      this.db = null;
      this.tsCache = {};
      this.pendingFiles = new Set();
    }
    e.prototype.init = function (app, pluginInstance) {
      var n = this;
      this.app = app;
      this.pluginInstance = pluginInstance;
      pluginInstance.registerGlobalCommand({
        id: "file-recovery:open",
        name: F3.actionOpen(),
        icon: "lucide-rotate-ccw",
        callback: function () {
          var e = n.app.workspace.getActiveFile(),
            t = "";
          e && e.extension === "md" && (t = e.path);
          n.openModal(t);
        },
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r,
          o,
          a,
          s = this;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              n = this;
              r = (i = Object).assign;
              o = [{}, O3];
              return [4, t.loadData()];
            case 1:
              if (
                ((n.options = r.apply(i, o.concat([l.sent()]))),
                t.addSettingTab(new R3(e, t, this)),
                !Platform.supportsIndexedDb)
              )
                return [2];
              t.registerEvent(e.vault.on("modify", this.onFileChanged, this));
              t.registerEvent(e.workspace.on("file-open", this.onFileChanged, this));
              t.registerInterval(window.setInterval(this.resave.bind(this), 6e4));
              t.registerInterval(window.setInterval(this.cleanup.bind(this), 36e5));
              e.workspace.onLayoutReady(function () {
                t.registerEvent(e.vault.on("create", s.onFileChanged, s));
              });
              l.label = 2;
            case 2:
              l.trys.push([2, 4, , 5]);
              a = this;
              return [
                4,
                EX(this.app.appId + "-backup", 1, {
                  upgrade: function (e) {
                    if (e.objectStoreNames.contains("backups")) {
                      e.deleteObjectStore("backups");
                    }
                    var t = e.createObjectStore("backups", {
                      autoIncrement: true,
                    });
                    t.createIndex("path", "path");
                    t.createIndex("ts", "ts");
                  },
                }),
              ];
            case 3:
              a.db = l.sent();
              window.setTimeout(this.cleanup.bind(this), 6e4);
              return [3, 5];
            case 4:
              l.sent();
              console.error("File Recovery failed to connect to IndexedDB");
              return [3, 5];
            case 5:
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function () {
      if (this.db) {
        this.db.close();
        this.db = null;
      }
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
    e.prototype.onFileChanged = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, path, o, a, paths0, l, c, data;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              return e &&
                e instanceof TFile &&
                (e.extension === "md" || e.extension === "canvas" || e.extension === "base")
                ? ((n = (t = this).db),
                  (i = t.tsCache),
                  n
                    ? ((path = e.path),
                      (o = i[path]),
                      (a = null),
                      i.hasOwnProperty(path) ? [3, 2] : [4, this.getLastVersionByPath(path)])
                    : [2])
                : [2];
            case 1:
              a = h.sent();
              o = a ? a.ts : 0;
              i[path] = o;
              h.label = 2;
            case 2:
              paths0 = Date.now();
              l = paths0 - o;
              c = this.options.intervalMinutes;
              (isNaN(c) || c < 0) && (c = 5);
              return l < 60 * c * 1e3 ? (this.pendingFiles.add(path), [2]) : [4, this.app.vault.cachedRead(e)];
            case 3:
              data = h.sent();
              return a ? [3, 5] : [4, this.getLastVersionByPath(path)];
            case 4:
              a = h.sent();
              h.label = 5;
            case 5:
              return a && a.data === data
                ? [2]
                : [
                    4,
                    n.add("backups", {
                      path: path,
                      ts: paths0,
                      data: data,
                    }),
                  ];
            case 6:
              h.sent();
              i[path] = paths0;
              return [2];
          }
        });
      });
    };
    e.prototype.forceAdd = function (path, data) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, patho0;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = (n = this).db;
              r = n.tsCache;
              return i
                ? ((patho0 = Date.now()),
                  [
                    4,
                    i.add("backups", {
                      path: path,
                      ts: patho0,
                      data: data,
                    }),
                  ])
                : [2];
            case 1:
              a.sent();
              r[path] = patho0;
              return [2];
          }
        });
      });
    };
    e.prototype.resave = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              e = this.pendingFiles;
              t = Array.from(e);
              n = this.app.vault;
              i = 0;
              r = t;
              a.label = 1;
            case 1:
              return i < r.length
                ? ((o = r[i]), e.delete(o), [4, this.onFileChanged(n.getAbstractFileByPath(o))])
                : [3, 4];
            case 2:
              a.sent();
              a.label = 3;
            case 3:
              i++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      });