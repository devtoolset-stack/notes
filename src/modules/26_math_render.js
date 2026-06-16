var A7 = "\nlet pattern = /(?:[0-9]+(?:(?:,|\\.)[0-9]+)*|[\\-'’"
  .concat(YO.source, "஀-௿가-힣ꥠ-ꥼힰ-ퟆ])+|[")
  .concat(
    /\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u4E00-\u9FD5\uAC00-\uD7A3\uA960-\uA97C\uD7B0-\uD7C6/
      .source,
    "]/g;\nfunction countWords(str) {\n\tpattern.lastIndex = 0;\n\tlet m = str.match(pattern);\n\treturn m ? m.length : 0;\n}\n\nself.onmessage = function (e) {\n\ttry {\n\t\tself.postMessage(countWords(e.data));\n\t} catch (e) {\n\t\tconsole.error('WordCount', e);\n\t}\n};\n",
  );
function P7(e) {
  var t = getFrontMatterInfo(e);
  return t.exists ? e.slice(t.contentStart) : e;
}
var L7 = (function () {
    function e() {
      this.id = "word-count";
      this.name = i18nProxy.plugins.wordCount.name();
      this.description = i18nProxy.plugins.wordCount.desc();
      this.defaultOn = true;
      this.worker = null;
      this.wordEl = null;
      this.charEl = null;
      this.mobileInfoEl = null;
      this.wordCount = 0;
      this.charCount = 0;
      this.requestWordCount = debounce(this.countWords, 200);
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerStatusBarItem();
      plugin.registerMobileFileInfo(this.updateMobileFileInfo.bind(this));
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          t.registerEvent(e.workspace.on("file-open", this.onFileOpen, this));
          t.registerEvent(e.workspace.on("quick-preview", this.onQuickPreview, this));
          t.registerEvent(e.workspace.on("editor-selection-change", this.onSelection, this));
          this.worker = (function (e, t) {
            return new Worker(
              URL.createObjectURL(
                new Blob([e], {
                  type: "text/javascript",
                }),
              ),
              t,
            );
          })(A7);
          this.worker.onmessage = this.onMessage.bind(this);
          (n = t.statusBarEl) &&
            (n.empty(),
            (this.wordEl = n.createSpan({
              cls: "status-bar-item-segment",
              text: "",
            })),
            (this.charEl = n.createSpan({
              cls: "status-bar-item-segment",
              text: "",
            })),
            n.hide());
          return [2];
        });
      });
    };
    e.prototype.onDisable = function () {
      this.worker.terminate();
      this.worker = null;
      this.wordEl = null;
      this.charEl = null;
    };
    e.prototype.onFileOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              e = "";
              t = false;
              return (n = this.app.workspace.getActiveFileView()) &&
                n.file &&
                (n.file.extension === "md" || (n instanceof TextFileView && n.isPlaintext))
                ? ((i = n.file.extension === "md"), [4, this.app.vault.cachedRead(n.file)])
                : [3, 2];
            case 1:
              r = o.sent();
              e = i ? P7(r) : r;
              t = true;
              o.label = 2;
            case 2:
              this.plugin.statusBarEl.toggle(t);
              this.updateCount(e);
              return [2];
          }
        });
      });
    };
    e.prototype.onSelection = function (e, t) {
      var n = t.editor.getSelection();
      n ? this.updateCount(n) : this.onFileOpen();
    };
    e.prototype.onQuickPreview = function (e, t) {
      if (this.app.workspace.getActiveFile() === e) {
        var n = P7(t);
        this.updateCount(n);
      }
    };
    e.prototype.countWords = function (e) {
      e ? this.worker.postMessage(e) : ((this.wordCount = 0), this.updateMobileFileInfo(), this.updateDisplay());
    };
    e.prototype.onMessage = function (e) {
      this.wordCount = e.data;
      this.updateMobileFileInfo();
      this.updateDisplay();
    };
    e.prototype.updateCount = function (e) {
      this.charCount = e.length;
      this.requestWordCount(e);
    };
    e.prototype.updateMobileFileInfo = function (mobileInfoEl) {
      if ((mobileInfoEl ? (this.mobileInfoEl = mobileInfoEl) : (mobileInfoEl = this.mobileInfoEl), mobileInfoEl)) {
        var fileCount = i18nProxy.nouns.wordWithCount({
            count: this.wordCount,
          }),
          folderCount = i18nProxy.nouns.characterWithCount({
            count: this.charCount,
          }),
          i = i18nProxy.plugins.fileExplorer.tooltipFoldersFilesCount({
            fileCount: fileCount,
            folderCount: folderCount,
          });
        mobileInfoEl.setText(i);
      }
    };
    e.prototype.updateDisplay = function () {
      var e = this.charEl,
        t = this.wordEl;
      e == null ||
        e.setText(
          i18nProxy.nouns.characterWithCount({
            count: this.charCount,
          }),
        );
      t == null ||
        t.setText(
          i18nProxy.nouns.wordWithCount({
            count: this.wordCount,
          }),
        );
    };
    return e;
  })(),
  I7 = i18nProxy.plugins.workspaces,
  O7 = (function () {
    function e() {
      this.id = "workspaces";
      this.name = I7.name();
      this.description = I7.desc();
      this.workspaces = {};
      this.activeWorkspace = "";
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerGlobalCommand({
        id: "workspaces:load",
        name: I7.actionLoadLayout(),
        icon: "lucide-layout",
        callback: this.onLoad.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "workspaces:save",
        name: I7.actionSave(),
        icon: "lucide-save",
        callback: this.onSave.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "workspaces:save-and-load",
        name: I7.actionSaveAndLoadLayout(),
        icon: "lucide-layout",
        callback: this.onSaveAndLoad.bind(this),
      });
      plugin.registerRibbonItem(I7.actionManageLayouts(), "lucide-layout", this.onOpenModal.bind(this));
      plugin.registerGlobalCommand({
        id: "workspaces:open-modal",
        name: I7.actionManageLayouts(),
        icon: "lucide-layout",
        callback: this.onOpenModal.bind(this),
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, t.loadData()];
            case 1:
              e = n.sent() || {};
              this.workspaces = e.workspaces || {};
              this.activeWorkspace = e.active || "";
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.saveData()];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.onOpenModal = function () {
      new F7(this.app, this).open();
    };
    e.prototype.onLoad = function () {
      new N7(this.app, this, !1).open();
      return !1;
    };
    e.prototype.onSave = function () {
      var namee0 = this.activeWorkspace,
        t = this.workspaces;
      namee0
        ? t.hasOwnProperty(namee0) &&
          (this.saveWorkspace(namee0),
          new Notice(
            I7.msgSaveLayoutSuccess({
              name: namee0,
            }),
          ))
        : new F7(this.app, this).open();
    };
    e.prototype.onSaveAndLoad = function () {
      new N7(this.app, this, !0).open();
      return !1;
    };
    e.prototype.saveWorkspace = function (e) {
      var t = this.app.workspace.getLayout();
      t.mtime = window.moment().format();
      this.workspaces[e] = t;
      this.saveData();
    };
    e.prototype.setActiveWorkspace = function (activeWorkspace) {
      this.activeWorkspace = activeWorkspace;
      this.saveData();
    };
    e.prototype.loadWorkspace = function (activeWorkspace) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this.workspaces.hasOwnProperty(activeWorkspace)
                ? ((this.activeWorkspace = activeWorkspace),
                  [4, this.app.workspace.changeLayout(this.workspaces[activeWorkspace])])
                : [3, 2];
            case 1:
              t.sent();
              this.saveData();
              t.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    e.prototype.deleteWorkspace = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              delete this.workspaces[e];
              return [4, this.saveData()];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.saveData = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [
                4,
                this.plugin.saveData({
                  workspaces: this.workspaces,
                  active: this.activeWorkspace,
                }),
              ];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  F7 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = plugin;
      i.titleEl.setText(I7.actionManageLayouts());
      i.contentEl.createDiv("list-item", function (e) {
        var t = (i.nameEl = e.createEl("input", {
          cls: "list-item-part mod-extended",
          type: "text",
        }));
        t.placeholder = I7.placeholderSaveCurrentLayoutAs();
        t.addEventListener("keypress", function (e) {
          if (!(e.isComposing || e.key !== "Enter")) {
            i.onFinish();
          }
        });
        var n = e.createEl("button", {
          cls: "list-item-part",
          text: I7.buttonSave(),
        });
        n.addEventListener("mousedown", function (e) {
          return e.preventDefault();
        });
        n.addEventListener("click", i.onFinish.bind(i));
      });
      i.listContainerEl = i.contentEl.createDiv("list-container mod-manage-workspaces");
      i.renderList();
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.nameEl.focus();
    };
    t.prototype.renderList = function () {
      var e = this,
        t = this.listContainerEl,
        n = this.plugin,
        i = n.workspaces;
      t.empty();
      var r = function (textr0) {
        if (!i.hasOwnProperty(textr0)) return "continue";
        var o = i[textr0];
        t.createDiv("list-item", function (t) {
          t.createDiv("list-item-part mod-extended", function (t) {
            t.createSpan({
              text: textr0,
            });
            textr0 === e.plugin.activeWorkspace &&
              t.createSpan({
                cls: "flair mod-pop",
                text: i18nProxy.setting.appearance.labelCurrentlyActive(),
              });
            t.createDiv("list-item-desc", function (e) {
              if (o.mtime) {
                var t = window.moment(o.mtime);
                e.createDiv({
                  cls: "list-item-part",
                  text: I7.labelWorkspaceModifiedTime({
                    time: t.fromNow(),
                  }),
                });
              }
            });
          });
          t.createDiv("list-item-actions", function (t) {
            t.createEl(
              "button",
              {
                cls: "list-item-part",
                text: I7.buttonLoad(),
              },
              function (t) {
                t.addEventListener("click", function () {
                  n.loadWorkspace(textr0);
                  e.close();
                });
              },
            );
            t.createDiv("list-item-part clickable-icon", function (t) {
              setIcon(t, "lucide-x");
              setTooltip(t, I7.tooltipDeleteLayout());
              t.addEventListener("mousedown", function (e) {
                return e.preventDefault();
              });
              t.addEventListener("click", function () {
                return __awaiter(e, undefined, undefined, function () {
                  return __generator(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, n.deleteWorkspace(textr0)];
                      case 1:
                        e.sent();
                        this.renderList();
                        return [2];
                    }
                  });
                });
              });
            });
          });
        });
      };
      for (var o in this.plugin.workspaces) r(o);
    };
    t.prototype.onFinish = function () {
      var namee0 = this.nameEl.value.trim();
      namee0
        ? (this.plugin.saveWorkspace(namee0),
          this.plugin.setActiveWorkspace(namee0),
          new Notice(
            I7.msgSaveLayoutSuccess({
              name: namee0,
            }),
          ),
          (this.nameEl.value = ""),
          this.renderList())
        : new Notice(I7.msgEnterName());
    };
    return t;
  })(Modal),
  N7 = (function (e) {
    function t(t, plugin, shouldSave) {
      var r = e.call(this, t) || this;
      r.emptyStateText = I7.labelNoLayoutFound();
      r.plugin = plugin;
      r.shouldSave = shouldSave;
      r.setPlaceholder(I7.placeholderTypeToSearchLayouts());
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
      return r;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return Object.keys(this.plugin.workspaces);
    };
    t.prototype.getEmptySearchItems = function () {
      return this.getItems();
    };
    t.prototype.getItemText = function (e) {
      return e;
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n = e.item;
      renderMatches(t, this.getItemText(n), e.match ? e.match.matches : null);
      n === this.plugin.activeWorkspace &&
        t.createSpan({
          cls: "flair mod-pop",
          text: i18nProxy.setting.appearance.labelCurrentlyActive(),
        });
    };
    t.prototype.onChooseItem = function (e) {
      if (this.shouldSave) {
        var t = this.plugin,
          n = t.workspaces,
          i = t.activeWorkspace;
        if (i && n[i]) {
          this.plugin.saveWorkspace(i);
        }
      }
      this.plugin.loadWorkspace(e);
    };
    return t;
  })(FuzzySuggestModal),
  R7 = (function () {
    function e(app, containerEl) {
      this.app = app;
      this.containerEl = containerEl;
    }
    e.prototype.registerStatusBarItem = function () {
      return this.containerEl.createDiv("status-bar-item");
    };
    return e;
  })();
function B7(e) {
  return e
    .replace(/["]/g, "")
    .split(",")
    .map(function (e) {
      return e.trim();
    })
    .filter(function (e) {
      return e;
    });
}
function V7(e) {
  return e
    .map(function (e) {
      return e.contains(" ") ? '"'.concat(e, '"') : e;
    })
    .join(", ");
}
function H7(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t;
    return __generator(this, function (n) {
      switch (n.label) {
        case 0:
          return e === "" ? [2, !0] : [4, (t = document.fonts).ready];
        case 1:
          n.sent();
          return [2, t.check('12px "'.concat(e, '"'))];
      }
    });
  });
}
var z7 = i18nProxy.setting.appearance,
  q7 = (function (e) {
    function t(t, n, values, r) {
      var o = e.call(this, t) || this;
      o.setTitle(n);
      o.values = values;
      o.descEl = o.contentEl.createDiv();
      o.fontListEl = o.contentEl.createDiv("setting-font-list");
      var a = null,
        s = null,
        l = null,
        c = function () {
          var e = l.getValue();
          e && !o.values.contains(e) && (o.values.push(e), o.display());
          l.setValue("");
          a.extraSettingsEl.hide();
        };
      new Setting(o.contentEl)
        .setName(z7.labelFontName())
        .addExtraButton(function (e) {
          return e
            .setIcon("lucide-alert-circle")
            .setTooltip(z7.msgFontNotFound())
            .then(function (e) {
              a = e;
              e.extraSettingsEl.addClass("mod-warning");
              e.extraSettingsEl.hide();
            });
        })
        .addText(function (e) {
          l = e;
          e.setPlaceholder(z7.optionFontPlaceholder());
          e.onChange(function (e) {
            return __awaiter(o, undefined, undefined, function () {
              var t;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, H7(e)];
                  case 1:
                    t = n.sent();
                    a.extraSettingsEl.toggle(!t);
                    return [2];
                }
              });
            });
          });
          var n = e.inputEl;
          n.addEventListener("focus", function () {
            o.modalEl.style.transition = "unset";
            xl(function () {
              o.modalEl.style.transition = "";
            });
            s ||
              ((s = new W7(t, n)).onSelect(function (e, t) {
                c();
                t.instanceOf(MouseEvent) && n.blur();
              }),
              G7.then(function () {
                s.onInputChange();
              }));
          });
          n.addEventListener("keydown", function (e) {
            if (!e.isComposing) {
              e.key === "Enter" && c();
            }
          });
        })
        .addButton(function (e) {
          return e.setButtonText(i18nProxy.interface.buttonAdd()).onClick(c);
        });
      o.addButton("mod-cta", i18nProxy.dialogue.buttonSave(), function () {
        o.close();
        r(o.values);
      });
      o.addCancelButton();
      return o;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.display();
    };
    t.prototype.display = function () {
      var e = this,
        t = this,
        n = t.fontListEl,
        i = t.descEl,
        r = t.values;
      r.length === 0 ? i.setText(z7.labelNoCustomFontSet()) : i.setText(z7.labelFontApplied());
      n.empty();
      for (
        var o = function (fontFamily) {
            n.createDiv("mobile-option-setting-item", function (i) {
              i.createSpan({
                cls: "mobile-option-setting-item-name",
                text: fontFamily,
              }).style.fontFamily = fontFamily;
              var o = i.createSpan("mobile-option-setting-item-option-icon");
              H7(fontFamily).then(function (e) {
                e
                  ? (o.addClass("mod-success"), setIcon(o, "lucide-check-circle-2"), setTooltip(o, z7.msgFontFound()))
                  : (o.addClass("mod-warning"), setIcon(o, "lucide-alert-circle"), setTooltip(o, z7.msgFontNotFound()));
              });
              i.createDiv("clickable-icon mobile-option-setting-item-option-icon", function (n) {
                setIcon(n, "lucide-x");
                setTooltip(n, i18nProxy.interface.deleteActionShortName());
                n.addEventListener("click", function () {
                  r.remove(fontFamily);
                  e.display();
                });
              });
              i.createDiv(
                "clickable-icon mobile-option-setting-item-option-icon mobile-option-setting-drag-icon",
                function (o) {
                  setIcon(o, "lucide-menu");
                  setTooltip(o, i18nProxy.interface.dragToRearrange());
                  Vc(
                    i,
                    i,
                    n,
                    5,
                    function () {
                      return null;
                    },
                    function (n) {
                      r.remove(fontFamily);
                      r.splice(n, 0, fontFamily);
                      e.display();
                    },
                  );
                },
              );
            });
          },
          a = 0,
          s = r;
        a < s.length;
        a++
      ) {
        o(s[a]);
      }
    };
    return t;
  })(GM),
  W7 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.fonts = (function () {
        var e = this;
        if (_7) return _7;
        _7 = ["Inter", "Source Code Pro"];
        var t = document.createElement("canvas").getContext("2d"),
          n = "abcdefghijklmnopqrstuvwxyz0123456789";
        t.font = "72px monospace";
        var i = t.measureText(n).width,
          r = function (r) {
            return __awaiter(e, undefined, undefined, function () {
              var e, o, a, s;
              return __generator(this, function (l) {
                switch (l.label) {
                  case 0:
                    e = 0;
                    o = 0;
                    a = r;
                    l.label = 1;
                  case 1:
                    return o < a.length
                      ? ((s = a[o]),
                        j7.has(s)
                          ? [3, 3]
                          : (j7.add(s),
                            (t.font = "72px ".concat(s, ", monospace")),
                            t.measureText(n).width != i && _7.push(s),
                            ++e % 10 != 0
                              ? [3, 3]
                              : [
                                  4,
                                  new Promise(function (e) {
                                    return Sc(e, 0);
                                  }),
                                ]))
                      : [3, 4];
                  case 2:
                    l.sent();
                    l.label = 3;
                  case 3:
                    o++;
                    return [3, 1];
                  case 4:
                    _7.sort();
                    return [2];
                }
              });
            });
          };
        G7 = (function () {
          return __awaiter(e, undefined, undefined, function () {
            var e, t;
            return __generator(this, function (n) {
              switch (n.label) {
                case 0:
                  if (((e = []), !Platform.isDesktopApp)) return [3, 4];
                  n.label = 1;
                case 1:
                  n.trys.push([1, 3, , 4]);
                  return [4, loadModule("get-fonts").getFonts()];
                case 2:
                  t = n.sent();
                  e.push(r(t));
                  return [3, 4];
                case 3:
                  n.sent();
                  return [3, 4];
                case 4:
                  if (!Platform.isMobileApp) return [3, 8];
                  n.label = 5;
                case 5:
                  n.trys.push([5, 7, , 8]);
                  return [4, capacitorAppPlugin.getFonts()];
                case 6:
                  t = n.sent().fonts;
                  e.push(r(t));
                  return [3, 8];
                case 7:
                  n.sent();
                  return [3, 8];
                case 8:
                  e.push(r(U7));
                  return [4, Promise.all(e)];
                case 9:
                  n.sent();
                  return [2];
              }
            });
          });
        })();
        return _7;
      })();
      return i;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (fontFamily, t) {
      t.setText(fontFamily);
      t.style.fontFamily = fontFamily;
    };
    t.prototype.getSuggestions = function (e) {
      var t = [];
      if (!(e = e.toLowerCase())) {
        t.push("Inter");
      }
      for (var n = 0, i = this.fonts; n < i.length; n++) {
        var r = i[n];
        if (r.toLowerCase().contains(e)) {
          t.push(r);
        }
      }
      return t;
    };
    t.prototype.selectSuggestion = function (t, n) {
      this.setValue(t);
      this.textInputEl.trigger("input");
      this.close();
      e.prototype.selectSuggestion.call(this, t, n);
    };
    return t;
  })(AbstractInputSuggest),
  U7 = [
    "Arial",
    "Arial Black",
    "Bahnschrift",
    "Calibri",
    "Cambria",
    "Cambria Math",
    "Candara",
    "Comic Sans MS",
    "Consolas",
    "Constantia",
    "Corbel",
    "Courier New",
    "Ebrima",
    "Franklin Gothic Medium",
    "Gabriola",
    "Gadugi",
    "Georgia",
    "HoloLens MDL2 Assets",
    "Impact",
    "Ink Free",
    "Javanese Text",
    "Leelawadee UI",
    "Lucida Console",
    "Lucida Sans Unicode",
    "Malgun Gothic",
    "Marlett",
    "Microsoft Himalaya",
    "Microsoft JhengHei",
    "Microsoft New Tai Lue",
    "Microsoft PhagsPa",
    "Microsoft Sans Serif",
    "Microsoft Tai Le",
    "Microsoft YaHei",
    "Microsoft Yi Baiti",
    "MingLiU-ExtB",
    "Mongolian Baiti",
    "MS Gothic",
    "MV Boli",
    "Myanmar Text",
    "Nirmala UI",
    "Palatino Linotype",
    "Segoe MDL2 Assets",
    "Segoe Print",
    "Segoe Script",
    "Segoe UI",
    "Segoe UI Historic",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "SimSun",
    "Sitka",
    "Sylfaen",
    "Symbol",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "Webdings",
    "Wingdings",
    "Yu Gothic",
    "American Typewriter",
    "Andale Mono",
    "Arial",
    "Arial Black",
    "Arial Narrow",
    "Arial Rounded MT Bold",
    "Arial Unicode MS",
    "Avenir",
    "Avenir Next",
    "Avenir Next Condensed",
    "Baskerville",
    "Big Caslon",
    "Bodoni 72",
    "Bodoni 72 Oldstyle",
    "Bodoni 72 Smallcaps",
    "Bradley Hand",
    "Brush Script MT",
    "Chalkboard",
    "Chalkboard SE",
    "Chalkduster",
    "Charter",
    "Cochin",
    "Comic Sans MS",
    "Copperplate",
    "Courier",
    "Courier New",
    "Didot",
    "DIN Alternate",
    "DIN Condensed",
    "Futura",
    "Geneva",
    "Georgia",
    "Gill Sans",
    "Helvetica",
    "Helvetica Neue",
    "Herculanum",
    "Hoefler Text",
    "Impact",
    "Lucida Grande",
    "Luminari",
    "Marker Felt",
    "Menlo",
    "Microsoft Sans Serif",
    "Monaco",
    "Noteworthy",
    "Optima",
    "Palatino",
    "Papyrus",
    "Phosphate",
    "Rockwell",
    "Savoye LET",
    "SignPainter",
    "Skia",
    "Snell Roundhand",
    "Tahoma",
    "Times",
    "Times New Roman",
    "Trattatello",
    "Trebuchet MS",
    "Verdana",
    "Zapfino",
  ],
  _7 = null,
  j7 = new Set(),
  G7 = Promise.resolve();
function K7(e) {
  return String.fromCharCode.apply(String, Array.from(e));
}
function Y7(e, t) {
  return (e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3];
}
function Z7(e, t) {
  return e[t] | (e[t + 1] << 8) | (e[t + 2] << 16) | (e[t + 3] << 24);
}
var X7 = ["ic07", "ic13", "ic08", "ic14", "ic09", "ic10"];
var Q7 = [137, 80, 78, 71, 13, 10, 26, 10],
  $7 = [73, 72, 68, 82];
var J7 = i18nProxy.setting.appearance,
  e9 = [
    {
      id: "obsidian",
      nameI18n: "dark-theme",
    },
    {
      id: "moonstone",
      nameI18n: "light-theme",
    },
    {
      id: "system",
      nameI18n: "system-theme",
    },
  ],
  t9 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.modalEl.addClass("mod-lg");
      n.setTitle(i18nProxy.setting.appearance.labelModalConfiguration());
      return n;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.render();
    };
    t.prototype.render = function () {
      var e = this,
        t = this.contentEl,
        n = this.app.workspace.leftRibbon;
      if ((t.empty(), Platform.isPhone)) {
        var i,
          r = new Setting(t)
            .setName(i18nProxy.setting.appearance.optionMobileQuickRibbonItem())
            .setDesc(i18nProxy.setting.appearance.optionMobileQuickRibbonItemDesc()),
          o = this.app.vault.getConfig("mobileQuickRibbonItem");
        r.addExtraButton(function (e) {
          setIcon((i = e.extraSettingsEl), "lucide-menu");
        });
        r.addDropdown(function (t) {
          t.addOption("", J7.optionMobileQuickRibbonDefault());
          for (var r = 0, a = n.items; r < a.length; r++) {
            var s = a[r];
            t.addOption(s.id, s.title);
            s.id === o && (t.setValue(o), setIcon(i, s.icon));
          }
          t.onChange(function (t) {
            e.app.vault.setConfig("mobileQuickRibbonItem", t);
            e.render();
          });
        });
        t.createEl("hr");
      }
      t.createEl("p", {
        text: i18nProxy.setting.appearance.labelModalConfigurationDesc(),
      });
      for (
        var a = t.createDiv(""),
          s = function (t) {
            var i = a.createDiv("mobile-option-setting-item");
            if (t.hidden) {
              i.hide();
              return "continue";
            }
            i.createSpan("mobile-option-setting-item-remove-icon", function (i) {
              setIcon(i, "lucide-minus-circle");
              i.addEventListener("click", function () {
                t.hidden = true;
                n.onChange(!0);
                e.render();
              });
            });
            i.createSpan("mobile-option-setting-item-option-icon", function (e) {
              return setIcon(e, t.icon);
            });
            i.createSpan({
              cls: "mobile-option-setting-item-name",
              text: t.title,
            });
            i.createDiv(
              "clickable-icon mobile-option-setting-item-option-icon mobile-option-setting-drag-icon",
              function (e) {
                setIcon(e, "lucide-menu");
                setTooltip(e, i18nProxy.interface.dragToRearrange());
                Vc(
                  e,
                  i,
                  a,
                  5,
                  function () {
                    return null;
                  },
                  function (e) {
                    n.items.remove(t);
                    n.items.splice(e, 0, t);
                    n.onChange(!0);
                  },
                );
              },
            );
          },
          l = 0,
          c = n.items;
        l < c.length;
        l++
      ) {
        s(c[l]);
      }
      var u = n.items.filter(function (e) {
        return e.hidden;
      });
      if (u.length > 0) {
        new Setting(t).setName(i18nProxy.setting.appearance.labelAdditionalRibbonItems()).setHeading();
        for (
          var h = t.createDiv(""),
            p = function (t) {
              h.createDiv("mobile-option-setting-item", function (i) {
                i.createSpan("mobile-option-setting-item-add-icon", function (i) {
                  setIcon(i, "lucide-plus-circle");
                  i.addEventListener("click", function () {
                    t.hidden = false;
                    n.onChange(!0);
                    e.render();
                  });
                });
                i.createSpan("mobile-option-setting-item-option-icon", function (e) {
                  return setIcon(e, t.icon);
                });
                i.createSpan({
                  cls: "mobile-option-setting-item-name",
                  text: t.title,
                });
              });
            },
            d = 0,
            f = u;
          d < f.length;
          d++
        ) {
          p(f[d]);
        }
      }
      t.createDiv("modal-button-container", function (t) {
        t.createEl(
          "button",
          {
            cls: "mod-cta",
            text: i18nProxy.dialogue.buttonDone(),
          },
          function (t) {
            t.addEventListener("click", e.close.bind(e));
          },
        );
      });
    };
    return t;
  })(Modal),
  n9 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = J7.name();
      t.id = "appearance";
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          r,
          o,
          count,
          counts0,
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
          S,
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
          R = this;
        return __generator(this, function (B) {
          for (
            t = (e = this).containerEl,
              n = e.app,
              t.empty(),
              i = n.customCss,
              new Setting(t)
                .setName(J7.optionBaseTheme())
                .setDesc(J7.optionBaseThemeDescription())
                .addDropdown(function (e) {
                  e.onChange(function (e) {
                    n.changeTheme(e);
                  });
                  for (var t = 0, i = e9; t < i.length; t++) {
                    var r = i[t];
                    e.addOption(r.id, J7(r.nameI18n));
                  }
                  e.setValue(n.vault.getConfig("theme"));
                }),
              new Setting(t)
                .setName(J7.optionAccentColor())
                .setDesc(J7.optionAccentColorDescription())
                .setClass("mod-toggle")
                .addExtraButton(function (e) {
                  return e
                    .setIcon("lucide-rotate-ccw")
                    .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
                    .onClick(function () {
                      n.vault.setConfig("accentColor", "");
                      r.value = n.getAccentColor();
                    });
                })
                .addColorPicker(function (e) {
                  r = e.colorPickerEl;
                  e.setValue(n.getAccentColor());
                  e.onChange(function (e) {
                    n.vault.setConfig("accentColor", e);
                  });
                }),
              o = new Setting(t).setName(J7.optionThemes()).setDesc(J7.optionManageThemesDescription()),
              Platform.isDesktopApp &&
                o.addExtraButton(function (e) {
                  return e
                    .setIcon("lucide-folder-open")
                    .setTooltip(J7.buttonOpenThemesFolder())
                    .onClick(function () {
                      return __awaiter(R, undefined, undefined, function () {
                        var e, t;
                        return __generator(this, function (n) {
                          switch (n.label) {
                            case 0:
                              e = this.app.vault;
                              t = i.getThemeFolder();
                              return [4, e.exists(t)];
                            case 1:
                              return n.sent() ? [3, 3] : [4, e.createFolder(t)];
                            case 2:
                              n.sent();
                              n.label = 3;
                            case 3:
                              this.app.openWithDefaultApp(t);
                              return [2];
                          }
                        });
                      });
                    });
                }),
              o.addDropdown(function (e) {
                return e
                  .then(function (e) {
                    var t = R.app.customCss;
                    for (var n in (e.addOption("", i18nProxy.setting.appearance.labelDefaultTheme()), t.themes))
                      e.addOption(n, n);
                    for (var i = 0, r = t.oldThemes; i < r.length; i++) {
                      n = r[i];
                      if (!t.themes.hasOwnProperty(n)) {
                        e.addOption(n, n + " (Legacy)");
                      }
                    }
                    var o = t.themes.hasOwnProperty(t.theme) ? t.theme : "";
                    e.setValue(o);
                  })
                  .onChange(function (e) {
                    R.app.customCss.setTheme(e);
                  });
              }),
              o.addButton(function (e) {
                return e
                  .setButtonText(J7.optionThemeButtonManage())
                  .setCta()
                  .onClick(function () {
                    new w1(n, !1)
                      .setCloseCallback(function () {
                        return R.display();
                      })
                      .open();
                  });
              }),
              count = Object.keys(i.themes).length + i.oldThemes.length,
              counts0 = Object.keys(i.updates).length,
              new Setting(t)
                .setName(J7.labelCurrentThemes())
                .setDesc(
                  J7.labelCurrentlyInstalled({
                    count: count,
                  }) +
                    " " +
                    (counts0 > 0
                      ? J7.msgUpdatesFound({
                          count: counts0,
                        })
                      : ""),
                )
                .then(function (e) {
                  counts0 > 0
                    ? (e.addButton(function (e) {
                        return e.setButtonText(J7.buttonViewUpdates()).onClick(function () {
                          new w1(n, !0)
                            .setCloseCallback(function () {
                              return R.display();
                            })
                            .open();
                        });
                      }),
                      e.addButton(function (e) {
                        return e
                          .setCta()
                          .setButtonText(J7.buttonUpdateAllThemes())
                          .onClick(function () {
                            return withLoadingClass(R.containerEl, function () {
                              return __awaiter(R, undefined, undefined, function () {
                                var e, t, n;
                                return __generator(this, function (r) {
                                  switch (r.label) {
                                    case 0:
                                      e = 0;
                                      t = Object.values(i.updates);
                                      r.label = 1;
                                    case 1:
                                      return e < t.length
                                        ? ((n = t[e]), [4, i.installTheme(n.themeInfo, n.version)])
                                        : [3, 4];
                                    case 2:
                                      r.sent();
                                      r.label = 3;
                                    case 3:
                                      e++;
                                      return [3, 1];
                                    case 4:
                                      this.display();
                                      return [2];
                                  }
                                });
                              });
                            });
                          });
                      }))
                    : count > 0 &&
                      e.addButton(function (e) {
                        return e
                          .setCta()
                          .setButtonText(J7.buttonCheckForUpdates())
                          .onClick(function () {
                            return __awaiter(R, undefined, undefined, function () {
                              return __generator(this, function (e) {
                                switch (e.label) {
                                  case 0:
                                    return [
                                      4,
                                      withLoadingClass(this.containerEl, function () {
                                        return i.checkForUpdates();
                                      }),
                                    ];
                                  case 1:
                                    e.sent();
                                    this.display();
                                    return [2];
                                }
                              });
                            });
                          });
                      });
                }),
              new Setting(t).setHeading().setName(J7.optionFont()),
              l = function (e, i, r) {
                var o = function () {
                    var e = B7(n.vault.getConfig(r)),
                      t = createFragment();
                    if ((t.appendText(i), e.length === 1)) {
                      var texto0 = e[0];
                      t.createSpan({
                        text: J7.labelSingleFontCurrentlyInEffect(),
                      });
                      t.createSpan({
                        text: texto0,
                        cls: "u-pop",
                      });
                    } else if (e.length > 1) {
                      t.createSpan({
                        text: J7.labelMultipleFontsCurrentlyInEffect(),
                      });
                      for (
                        var s = t.createEl("ul"),
                          l = function (texte0) {
                            var t = s.createEl("li", "");
                            t.createSpan({
                              text: texte0,
                            });
                            H7(texte0).then(function (e) {
                              if (!e) {
                                t.appendText(" ");
                                t.createSpan("mod-warning", function (e) {
                                  setIcon(e, "lucide-alert-circle");
                                  setTooltip(e, i18nProxy.setting.appearance.msgFontNotFound());
                                });
                              }
                            });
                          },
                          c = 0,
                          u = e;
                        c < u.length;
                        c++
                      ) {
                        l((texto0 = u[c]));
                      }
                    }
                    a.setDesc(t);
                  },
                  a = new Setting(t).setName(e).addButton(function (t) {
                    return t.setButtonText(J7.optionThemeButtonManage()).onClick(function () {
                      new q7(n, e, B7(n.vault.getConfig(r)), function (e) {
                        n.vault.setConfig(r, e.join(","));
                        o();
                      }).open();
                    });
                  });
                o();
              },
              l(J7.optionInterfaceFont(), J7.optionInterfaceFontDescription(), "interfaceFontFamily"),
              l(J7.optionTextFont(), J7.optionTextFontDescription(), "textFontFamily"),
              l(J7.optionMonospaceFont(), J7.optionMonospaceFontDescription(), "monospaceFontFamily"),
              h = Ub.baseFontSize,
              p = function (e) {
                return c.extraSettingsEl.toggleVisibility(e !== h);
              },
              new Setting(t)
                .setName(J7.optionFontSize())
                .setDesc(J7.optionFontSizeDescription())
                .addExtraButton(function (e) {
                  return (c = e
                    .setIcon("lucide-rotate-ccw")
                    .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
                    .onClick(function () {
                      u.setValue(h);
                    }));
                })
                .addSlider(function (e) {
                  return (u = e
                    .setLimits(10, 30, 1)
                    .setDynamicTooltip()
                    .setValue(n.vault.getConfig("baseFontSize"))
                    .onChange(function (e) {
                      n.vault.setConfig("baseFontSize", e);
                      p(e);
                    }));
                }),
              p(u.getValue()),
              new Setting(t)
                .setName(J7.optionFontSizeAction())
                .setDesc(J7.optionFontSizeActionDescription())
                .addToggle(function (e) {
                  return e.setValue(n.vault.getConfig("baseFontSizeAction")).onChange(function (e) {
                    n.vault.setConfig("baseFontSizeAction", e);
                  });
                }),
              new Setting(t).setHeading().setName(J7.optionInterface()),
              new Setting(this.containerEl)
                .setName(i18nProxy.setting.editor.optionShowInlineTitle())
                .setDesc(i18nProxy.setting.editor.optionShowInlineTitleDescription())
                .addToggle(function (e) {
                  return e.setValue(R.app.vault.getConfig("showInlineTitle")).onChange(function (e) {
                    n.vault.setConfig("showInlineTitle", e);
                  });
                }),
              Platform.isPhone ||
                new Setting(t)
                  .setName(i18nProxy.setting.appearance.optionShowViewHeader())
                  .setDesc(i18nProxy.setting.appearance.optionShowViewHeaderDesc())
                  .addToggle(function (e) {
                    return e.setValue(n.vault.getConfig("showViewHeader")).onChange(function (e) {
                      n.vault.setConfig("showViewHeader", e);
                    });
                  }),
              Platform.canDisplayRibbon &&
                new Setting(t)
                  .setName(i18nProxy.setting.appearance.optionShowRibbon())
                  .setDesc(i18nProxy.setting.appearance.optionShowRibbonDesc())
                  .addToggle(function (e) {
                    return e.setValue(n.vault.getConfig("showRibbon")).onChange(function (e) {
                      n.vault.setConfig("showRibbon", e);
                      R.display();
                    });
                  }),
              (Platform.isMobile || n.vault.getConfig("showRibbon")) &&
                new Setting(t)
                  .setName(i18nProxy.setting.appearance.optionConfigureRibbon())
                  .setDesc(i18nProxy.setting.appearance.optionConfigureRibbonDesc())
                  .addButton(function (e) {
                    return e.setButtonText(i18nProxy.dialogue.buttonManage()).onClick(function () {
                      new t9(R.app).open();
                    });
                  }),
              Platform.isDesktopApp && new Setting(t).setHeading().setName(J7.optionAdvanced()),
              Platform.isDesktopApp &&
                new Setting(t)
                  .setName(J7.optionZoomLevel())
                  .setDesc(J7.optionZoomLevelDescription())
                  .addExtraButton(function (e) {
                    return e
                      .setIcon("lucide-rotate-ccw")
                      .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
                      .onClick(function () {
                        electron.webFrame.setZoomLevel(0);
                        d.setValue(0);
                      });
                  })
                  .addSlider(function (e) {
                    d = e
                      .setLimits(-2.5, 3, 0.5)
                      .setDynamicTooltip()
                      .setValue(electron.webFrame.getZoomLevel())
                      .onChange(function (e) {
                        return electron.webFrame.setZoomLevel(e);
                      });
                    e.getValuePretty = function () {
                      return "".concat(Math.round(100 * Math.pow(1.2, e.getValue())), "%");
                    };
                  }),
              Platform.isDesktopApp &&
                new Setting(t)
                  .setName(i18nProxy.setting.appearance.optionNativeMenus())
                  .setDesc(i18nProxy.setting.appearance.optionNativeMenusDesc())
                  .addToggle(function (e) {
                    return e.setValue(Menu.useNativeMenu).onChange(function (e) {
                      n.vault.setConfig("nativeMenus", e);
                    });
                  }),
              Platform.isDesktopApp &&
                ((m = electron.ipcRenderer.sendSync("frame")),
                new Setting(t)
                  .setName(J7.optionFrameStyle())
                  .setDesc(J7.optionFrameDescription())
                  .addButton(function (e) {
                    f = e;
                    e.setCta()
                      .setButtonText(i18nProxy.setting.about.buttonRelaunch())
                      .onClick(function () {
                        electron.remote.app.relaunch();
                        electron.remote.app.quit();
                      });
                    e.buttonEl.hide();
                  })
                  .addDropdown(function (e) {
                    e.onChange(function (e) {
                      electron.ipcRenderer.sendSync("frame", e);
                      f.buttonEl.show();
                    });
                    e.addOption("hidden", J7.optionFrameHidden());
                    e.addOption("custom", J7.optionFrameObsidian());
                    e.addOption("native", J7.optionFrameNative());
                    e.setValue(m || "hidden");
                  })),
              Platform.isDesktopApp &&
                ((w = loadModule("path")),
                (k = loadModule("fs")),
                (C = loadModule("url")),
                (E = electron.remote),
                (S = new Setting(t)
                  .setName(J7.optionCustomIcon())
                  .addExtraButton(function (e) {
                    return (v = e
                      .setIcon("lucide-rotate-ccw")
                      .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
                      .onClick(function () {
                        electron.ipcRenderer.sendSync("set-icon", null, null);
                        x();
                        g.buttonEl.show();
                      }));
                  })
                  .addButton(function (e) {
                    return e.setButtonText(i18nProxy.dialogue.buttonChoose()).onClick(function () {
                      return __awaiter(R, undefined, undefined, function () {
                        var e, n, i, r, o, a, s, src, width, height, h, p, d, f, m, v;
                        return __generator(this, function (y) {
                          switch (y.label) {
                            case 0:
                              if (
                                !(
                                  (e = E.dialog.showOpenDialogSync({
                                    title: J7.optionCustomIcon(),
                                    properties: ["openFile", "dontAddToRecent"],
                                    filters: [
                                      {
                                        name: "PNG/ICO/ICNS",
                                        extensions: ["png", "ico", "icns"],
                                      },
                                    ],
                                  })) && e.length > 0
                                )
                              )
                                return [3, 3];
                              if (((n = e[0]), (i = getExtension(getFilename(n))), !["png", "ico", "icns"].contains(i))) {
                                new Notice("Supported file types are: png, ico, icns");
                                return [2];
                              }
                              if (((r = k.readFileSync(n)), i === "icns")) {
                                if (
                                  ((s = lu(r)),
                                  (o = (function (e) {
                                    var t = new Uint8Array(e);
                                    if (t.length < 8 || K7(t.slice(0, 4)) !== "icns") return null;
                                    for (var n = 8, i = null; n < t.byteLength; ) {
                                      var r = K7(t.slice(n, n + 4)),
                                        o = Y7(t, n + 4),
                                        a = X7.indexOf(r);
                                      -1 !== a && a > -1 && (i = t.slice(n + 8, n + o));
                                      n += o;
                                    }
                                    return i ? pf(i) : null;
                                  })(s)),
                                  !o)
                                ) {
                                  new Notice("This icns file does not have usable icons.");
                                  return [2];
                                }
                                r = cu(o);
                                i = "png";
                              }
                              if (i === "ico" && !Platform.isWin) {
                                if (
                                  ((s = lu(r)),
                                  (o = (function (e) {
                                    var t = new Uint8Array(e);
                                    if (t.length < 6) return null;
                                    for (
                                      var n = (function (e, t) {
                                          return e[t] | (e[t + 1] << 8);
                                        })(t, 4),
                                        i = 0,
                                        r = null,
                                        o = 0;
                                      o < n;
                                      o++
                                    ) {
                                      for (
                                        var a = 6 + 16 * o,
                                          s = Z7(t, a + 12),
                                          l = t.slice(s, s + Z7(t, a + 8)),
                                          c = true,
                                          u = 0;
                                        u < 8;
                                        u++
                                      )
                                        if (l[u] !== Q7[u]) {
                                          c = false;
                                          break;
                                        }
                                      if (c) {
                                        for (var h = 0; h < 4; h++)
                                          if (l[12 + h] !== $7[h]) {
                                            c = false;
                                            break;
                                          }
                                        if (c) {
                                          var p = Y7(l, 16),
                                            d = Y7(l, 20);
                                          if (p * d > i) {
                                            i = p * d;
                                            r = l;
                                          }
                                        }
                                      }
                                    }
                                    return r ? pf(r) : null;
                                  })(s)),
                                  !o)
                                ) {
                                  new Notice("This ico file does not have usable icons.");
                                  return [2];
                                }
                                r = cu(o);
                                i = "png";
                              }
                              return i !== "png"
                                ? [3, 2]
                                : ((a = new Image()),
                                  (s = lu(r)),
                                  (src = "data:image/png;base64,".concat(arrayBufferToBase64(s))),
                                  [
                                    4,
                                    new Promise(function (e) {
                                      var t = function () {
                                        return e();
                                      };
                                      a.addEventListener("load", t);
                                      a.addEventListener("error", t);
                                      a.src = src;
                                    }),
                                  ]);
                            case 1:
                              y.sent();
                              width = a.naturalWidth;
                              height = a.naturalHeight;
                              (h = t.doc.createElement("canvas")).width = width;
                              h.height = height;
                              (p = h.getContext("2d")).clearRect(0, 0, width, height);
                              p.drawImage(a, 0, 0, width, height);
                              d = Math.floor((3 * Math.min(width, height)) / 32);
                              f = (function () {
                                for (
                                  var e = p.getImageData(0, 0, width, height),
                                    t = function (t, n) {
                                      return e.data[4 * (t * width + n) + 3];
                                    },
                                    n = Math.floor(d / 2),
                                    i = 0;
                                  i < n;
                                  i++
                                ) {
                                  for (var r = 0; r < width; r++)
                                    if (t(r, i) > 128 || t(r, height - i - 1) > 128) return !1;
                                  for (r = 0; r < height; r++)
                                    if (t(i, r) > 128 || t(width - i - 1, r) > 128) return !1;
                                }
                                return !0;
                              })();
                              f ||
                                (p.clearRect(0, 0, width, height),
                                p.drawImage(a, d, d, width - 2 * d, height - 2 * d),
                                (m = h.toDataURL("image/png")),
                                (v = m.match(/^data:([\w/\-.]+);base64,(.*)/)),
                                (r = cu(base64ToArrayBuffer(v[2]))));
                              y.label = 2;
                            case 2:
                              electron.ipcRenderer.sendSync("set-icon", "icon." + i, r);
                              x();
                              g.buttonEl.show();
                              y.label = 3;
                            case 3:
                              return [2];
                          }
                        });
                      });
                    });
                  })
                  .addButton(function (e) {
                    g = e;
                    e.setCta()
                      .setButtonText(i18nProxy.setting.about.buttonRelaunch())
                      .onClick(function () {
                        E.app.relaunch();
                        E.app.quit();
                      });
                  })),
                (M = function (e) {
                  var t = w.join(E.app.getPath("userData"), e),
                    n = C.pathToFileURL(t).href;
                  n.startsWith("file:///")
                    ? (n = n.substring(8))
                    : n.startsWith("file://") && (n = "%5C%5C" + n.substring(7));
                  return Platform.resourcePathPrefix + n + "?" + Date.now();
                }),
                (x = function () {
                  var e = electron.ipcRenderer.sendSync("get-icon");
                  v.extraSettingsEl.toggle(!!e);
                  e
                    ? S.setDesc(
                        createFragment(function (t) {
                          t.createEl("img", {
                            attr: {
                              width: 64,
                              height: 64,
                              src: M(e),
                            },
                          });
                        }),
                      )
                    : S.setDesc(J7.optionCustomIconDesc());
                }),
                g.buttonEl.hide(),
                x()),
              Platform.isDesktopApp &&
                isDarwin() &&
                new Setting(t)
                  .setName(i18nProxy.plugins.translucency.name())
                  .setDesc(i18nProxy.plugins.translucency.desc())
                  .addToggle(function (e) {
                    return e.setValue(n.vault.getConfig("translucency")).onChange(function (e) {
                      i.setTranslucency(e);
                    });
                  }),
              Platform.isDesktopApp &&
                ((T = electron.ipcRenderer.sendSync("disable-gpu")),
                new Setting(t)
                  .setName(i18nProxy.setting.about.optionHwAcceleration())
                  .setDesc(
                    createFragment(function (e) {
                      e.createDiv({
                        text: i18nProxy.setting.about.optionHwAccelerationDescription(),
                      });
                      e.createDiv({
                        cls: "mod-warning",
                        text: i18nProxy.setting.about.optionHwAccelerationWarning(),
                      });
                    }),
                  )
                  .addButton(function (e) {
                    D = e;
                    e.setCta()
                      .setButtonText(i18nProxy.setting.about.buttonRelaunch())
                      .onClick(function () {
                        callbackWithElectron(function (e) {
                          e.ipcRenderer.sendSync("relaunch");
                        });
                      });
                    e.buttonEl.hide();
                  })
                  .addToggle(function (e) {
                    return e.setValue(!T).onChange(function (e) {
                      e = !e;
                      callbackWithElectron(function (t) {
                        t.ipcRenderer.sendSync("disable-gpu", e);
                        D.buttonEl.toggle(e !== T);
                      });
                    });
                  })),
              A = i.snippets,
              P = i.enabledSnippets,
              L = new Setting(t)
                .setHeading()
                .setName(J7.optionCssSnippets())
                .addExtraButton(function (e) {
                  return e
                    .setIcon("lucide-refresh-cw")
                    .setTooltip(J7.buttonReloadSnippets())
                    .onClick(function () {
                      return __awaiter(R, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.readSnippets()];
                            case 1:
                              e.sent();
                              new Notice(J7.msgReloadedSnippets());
                              this.display();
                              return [2];
                          }
                        });
                      });
                    });
                }),
              Platform.isDesktopApp &&
                L.addExtraButton(function (e) {
                  return e
                    .setIcon("lucide-folder-open")
                    .setTooltip(J7.buttonOpenSnippetsFolder())
                    .onClick(function () {
                      return __awaiter(R, undefined, undefined, function () {
                        var e, t;
                        return __generator(this, function (n) {
                          switch (n.label) {
                            case 0:
                              e = this.app.vault;
                              t = i.getSnippetsFolder();
                              return [4, e.exists(t)];
                            case 1:
                              return n.sent() ? [3, 3] : [4, e.createFolder(t)];
                            case 2:
                              n.sent();
                              n.label = 3;
                            case 3:
                              this.app.openWithDefaultApp(t);
                              return [2];
                          }
                        });
                      });
                    });
                }),
              A.length === 0 &&
                new Setting(t).setName(J7.labelNoCssSnippetsFound()).setDesc(
                  J7.noSnippetDescription({
                    path: "vault/".concat(i.getSnippetsFolder()),
                  }),
                ),
              I = function (e) {
                new Setting(t)
                  .setName(e)
                  .setDesc(
                    J7.optionToggleSnippetDescription({
                      path: "vault/".concat(i.getSnippetPath(e)),
                    }),
                  )
                  .addToggle(function (t) {
                    return t.setValue(P.has(e)).onChange(function (t) {
                      i.setCssEnabledStatus(e, t);
                    });
                  });
              },
              O = 0,
              F = A;
            O < F.length;
            O++
          ) {
            N = F[O];
            I(N);
          }
          return [2];
        });
      });
    };
    return t;
  })(SettingTab),
  i9 = i18nProxy.setting.thirdPartyPlugin,
  r9 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = i9.name();
      t.id = "community-plugins";
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      this.render(!0);
    };
    t.prototype.render = function (e) {
      var t = this,
        n = this.containerEl;
      n.empty();
      var i = this.app.plugins;
      if (i.isEnabled()) {
        new Setting(n)
          .setName(i9.optionRestrictedMode())
          .setDesc(i9.optionRestrictedModeDescription())
          .addButton(function (e) {
            return e.setButtonText(i9.buttonTurnOn()).onClick(function () {
              return __awaiter(t, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, i.setEnable(!1)];
                    case 1:
                      e.sent();
                      window.location.reload();
                      return [2];
                  }
                });
              });
            });
          });
        new Setting(n)
          .setName(i9.optionBrowseCommunityPlugins())
          .setDesc(i9.optionBrowseCommunityPluginsDescription())
          .addButton(function (e) {
            return e
              .setCta()
              .setButtonText(i9.buttonBrowse())
              .onClick(function () {
                new s1(t.app)
                  .setCloseCallback(function () {
                    return t.display();
                  })
                  .open();
              });
          });
        var r = i.manifests,
          o = i.plugins,
          a = Object.keys(r),
          s = i.updates,
          count = Object.keys(s).length;
        if (
          (a.sort(function (e, t) {
            return r[e].name.localeCompare(r[t].name);
          }),
          new Setting(n)
            .setName(i9.labelCurrentPlugins())
            .setDesc(
              i9.labelCurrentlyInstalled({
                count: a.length,
              }) +
                " " +
                (count > 0
                  ? i9.msgUpdatesFound({
                      count: count,
                    })
                  : ""),
            )
            .then(function (e) {
              count > 0
                ? e.addButton(function (e) {
                    return e
                      .setCta()
                      .setButtonText(i9.buttonUpdateAllPlugins())
                      .onClick(function () {
                        return withLoadingClass(n, function () {
                          return __awaiter(t, undefined, undefined, function () {
                            var e, t, n, r, o, a;
                            return __generator(this, function (l) {
                              switch (l.label) {
                                case 0:
                                  for (n in ((t = []), (e = s))) t.push(n);
                                  r = 0;
                                  l.label = 1;
                                case 1:
                                  return r < t.length
                                    ? (n = t[r]) in e
                                      ? ((o = n),
                                        s.hasOwnProperty(o)
                                          ? ((a = s[o]), [4, i.installPlugin(a.repo, a.version, a.manifest)])
                                          : [3, 3])
                                      : [3, 3]
                                    : [3, 4];
                                case 2:
                                  l.sent();
                                  l.label = 3;
                                case 3:
                                  r++;
                                  return [3, 1];
                                case 4:
                                  this.render();
                                  return [2];
                              }
                            });
                          });
                        });
                      });
                  })
                : a.length > 0 &&
                  e.addButton(function (e) {
                    return e
                      .setCta()
                      .setButtonText(i9.buttonCheckForUpdates())
                      .onClick(function () {
                        return withLoadingClass(n, function () {
                          return __awaiter(t, undefined, undefined, function () {
                            return __generator(this, function (e) {
                              switch (e.label) {
                                case 0:
                                  return [4, i.checkForUpdates()];
                                case 1:
                                  e.sent();
                                  this.render();
                                  return [2];
                              }
                            });
                          });
                        });
                      });
                  });
            }),
          a.length > 0)
        ) {
          new Setting(n)
            .setName(i9.optionSearchInstalledPlugin())
            .setDesc(i9.optionSearchInstalledPluginDescription())
            .addSearch(function (n) {
              return n
                .setPlaceholder(i9.placeholderSearchInstalledPlugin())
                .onChange(function (e) {
                  t.updateSearch(e);
                })
                .then(function () {
                  n.inputEl.addEventListener("keypress", function (e) {
                    if (!(e.isComposing || e.key !== "Enter" || Platform.hasPhysicalKeyboard)) {
                      clearFocusAndSelection();
                    }
                  });
                  e &&
                    Platform.hasPhysicalKeyboard &&
                    setTimeout(function () {
                      return n.inputEl.focus();
                    });
                });
            });
          var c = new Setting(n)
            .setHeading()
            .setName(i9.labelInstalledPlugins())
            .addExtraButton(function (e) {
              return e
                .setIcon("lucide-refresh-cw")
                .setTooltip(i9.buttonReloadPlugins())
                .onClick(function () {
                  return __awaiter(t, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, i.loadManifests()];
                        case 1:
                          e.sent();
                          new Notice(i9.msgReloadedThirdPartyPlugins());
                          this.render();
                          return [2];
                      }
                    });
                  });
                });
            });
          if (Platform.isDesktopApp) {
            c.addExtraButton(function (e) {
              return e
                .setIcon("lucide-folder-open")
                .setTooltip(i9.buttonOpenPluginsFolder())
                .onClick(function () {
                  return __awaiter(t, undefined, undefined, function () {
                    var e, t;
                    return __generator(this, function (n) {
                      switch (n.label) {
                        case 0:
                          e = this.app.vault;
                          t = i.getPluginFolder();
                          return [4, e.exists(t)];
                        case 1:
                          return n.sent() ? [3, 3] : [4, e.createFolder(t)];
                        case 2:
                          n.sent();
                          n.label = 3;
                        case 3:
                          this.app.openWithDefaultApp(t);
                          return [2];
                      }
                    });
                  });
                });
            });
          }
        }
        for (
          var u = function (e) {
              if (!r.hasOwnProperty(e)) {
                var a = o[e].manifest;
                new Setting(n)
                  .setName(a.name)
                  .setDesc(a.description)
                  .addToggle(function (e) {
                    return e.setValue(!0).onChange(function (e) {
                      return __awaiter(t, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.disablePluginAndSave(a.id)];
                            case 1:
                              e.sent();
                              this.render();
                              return [2];
                          }
                        });
                      });
                    });
                  });
              }
            },
            h = 0,
            p = Object.keys(o);
          h < p.length;
          h++
        ) {
          u(p[h]);
        }
        this.installedPluginsEl = n.createDiv("installed-plugins-container");
        this.updateSearch("");
      } else {
        n.createEl("p", {
          text: i9.labelExitRestrictedModeDescription_1(),
        });
        n.createEl("p", {
          text: i9.labelExitRestrictedModeDescription_2(),
        });
        n.createDiv({}, function (e) {
          new Setting(e)
            .setName(i9.labelCodeReview())
            .setDesc(i9.labelCodeReviewDesc())
            .settingEl.prepend(
              createDiv("setting-icon", function (e) {
                setIcon(e, "lucide-inspect");
              }),
            );
          new Setting(e)
            .setName(i9.labelOpenSource())
            .setDesc(i9.labelOpenSourceDesc())
            .settingEl.prepend(
              createDiv("setting-icon", function (e) {
                setIcon(e, "lucide-github");
              }),
            );
          new Setting(e)
            .setName(i9.labelPeerAudit())
            .setDesc(i9.labelPeerAuditDesc())
            .settingEl.prepend(
              createDiv("setting-icon", function (e) {
                setIcon(e, "lucide-users");
              }),
            );
          new Setting(e)
            .setName(i9.labelReportMechanism())
            .setDesc(i9.labelReportMechanismDesc())
            .settingEl.prepend(
              createDiv("setting-icon", function (e) {
                setIcon(e, "lucide-bug");
              }),
            );
        });
        n.createEl("p", {
          text: i9.labelExitRestrictedModeDisableConfirmation(),
        });
        var d = n.createDiv("community-modal-button-container").createEl("button", {
          cls: "mod-cta",
          text: i9.buttonTurnOnCommunityPlugins(),
        });
        d.addEventListener("click", function () {
          return __awaiter(t, undefined, undefined, function () {
            var e = this;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    withModLoadingClass(d, function () {
                      return e.app.plugins.setEnable(!0);
                    }),
                  ];
                case 1:
                  t.sent();
                  this.render();
                  return [2];
              }
            });
          });
        });
        n.createEl("p", {}, function (e) {
          e.createEl("a", {
            text: i9.labelLearnMore(),
            href: "https://help.obsidian.md/plugin-security",
            attr: {
              target: "_blank",
              rel: "noopener",
            },
          });
        });
      }
    };
    t.prototype.renderInstalledPlugin = function (e, t, n, i, r) {
      var o,
        a,
        s = this,
        l = this.app.plugins,
        c = l.plugins,
        u = l.updates,
        h = e.id,
        p = function () {
          var t = false,
            n = false;
          l.getPlugin(e.id) &&
            ((t = s.setting.pluginTabs.some(function (t) {
              return t.id === e.id;
            })),
            Object.keys(s.app.commands.commands).some(function (t) {
              return t.startsWith(e.id + ":");
            }) && (n = true));
          o.extraSettingsEl.toggle(t);
          a.extraSettingsEl.toggle(n);
        },
        d = new Setting(t)
          .setDesc(
            createFragment(function (t) {
              if (
                (e.version &&
                  t.createDiv({
                    text: i9.labelVersion({
                      version: e.version,
                    }),
                  }),
                e.author)
              ) {
                renderMatches(
                  t.createDiv({
                    text: i9.labelByAuthor(),
                  }),
                  e.author,
                  i,
                );
              }
              renderMatches(t.createDiv(), e.description, r);
            }),
          )
          .then(function (t) {
            if (u.hasOwnProperty(h)) {
              var i = u[h];
              t.addButton(function (e) {
                return e
                  .setCta()
                  .setButtonText(i9.buttonUpdate())
                  .setTooltip(
                    i9.msgUpdatePlugin({
                      version: i.version,
                    }),
                  )
                  .onClick(function () {
                    return withLoadingClass(t.settingEl, function () {
                      return __awaiter(s, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, l.installPlugin(i.repo, i.version, i.manifest)];
                            case 1:
                              e.sent();
                              this.render();
                              return [2];
                          }
                        });
                      });
                    });
                  });
              });
            }
            renderMatches(t.nameEl, e.name, n);
          })
          .addExtraButton(function (t) {
            return (o = t
              .setIcon("lucide-settings")
              .setTooltip(i18nProxy.setting.options())
              .onClick(function () {
                return s.setting.openTabById(e.id);
              }));
          })
          .addExtraButton(function (t) {
            return (a = t
              .setIcon("lucide-plus-circle")
              .setTooltip(i18nProxy.setting.hotkeys.name())
              .onClick(function () {
                var t = s.setting.openTabById("hotkeys");
                if (t instanceof o1) {
                  t.setQuery(e.id);
                }
              }));
          });
      e.fundingUrl &&
        d.addExtraButton(function (t) {
          return t
            .setIcon("lucide-heart")
            .setTooltip(
              i9.labelDonateModalTitle({
                name: e.name,
              }),
            )
            .onClick(function () {
              new l1(s.app, e.name, e.fundingUrl).open();
            });
        });
      d.addExtraButton(function (t) {
        return t
          .setIcon("lucide-trash-2")
          .setTooltip(i9.labelUninstall())
          .onClick(function () {
            new GM(s.app)
              .setTitle(i9.labelUninstallPlugin())
              .setContent(i9.labelUninstallPluginConfirmation())
              .addButton("mod-warning", i9.labelUninstall(), function () {
                return __awaiter(s, undefined, undefined, function () {
                  return __generator(this, function (t) {
                    switch (t.label) {
                      case 0:
                        return [4, l.uninstallPlugin(e.id)];
                      case 1:
                        t.sent();
                        this.render();
                        return [2];
                    }
                  });
                });
              })
              .addCancelButton()
              .open();
          });
      });
      d.addToggle(function (t) {
        return t.setValue(c.hasOwnProperty(e.id)).onChange(function (n) {
          return __awaiter(s, undefined, undefined, function () {
            return __generator(this, function (i) {
              switch (i.label) {
                case 0:
                  return n ? [4, l.enablePluginAndSave(e.id)] : [3, 2];
                case 1:
                  i.sent() || t.setValue(!1);
                  return [3, 4];
                case 2:
                  return [4, l.disablePluginAndSave(e.id)];
                case 3:
                  i.sent();
                  i.label = 4;
                case 4:
                  p();
                  n && setTimeout(p, 100);
                  return [2];
              }
            });
          });
        });
      });
      var f = d.infoEl;
      f.style.cursor = "pointer";
      f.addEventListener("click", function () {
        new s1(s.app)
          .setCloseCallback(function () {
            return s.display();
          })
          .setAutoOpen(h)
          .open();
      });
      p();
    };
    t.prototype.updateSearch = function (e) {
      var t = this.app.plugins,
        n = this.installedPluginsEl;
      n.empty();
      var i = t.manifests,
        r = Object.keys(i);
      r.sort(function (e, t) {
        return i[e].name.localeCompare(i[t].name);
      });
      for (var o = (e = e.trim().toLowerCase()).split(" "), a = 0, s = r; a < s.length; a++) {
        var l = s[a],
          c = i[l],
          u = null,
          h = null,
          p = null;
        if (
          !e ||
          ((u = Gx(o, c.name.toLowerCase())),
          (h = c.author ? Gx(o, c.author.toLowerCase()) : null),
          (p = c.description ? Gx(o, c.description.toLowerCase()) : null),
          u || h || p)
        ) {
          this.renderInstalledPlugin(c, n, u, h, p);
        }
      }
    };
    return t;
  })(SettingTab),
  o9 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = i18nProxy.setting.editor.name();
      t.id = "editor";
      t.passedVimTest = false;
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this;
      this.containerEl.empty();
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionOpenTabInForeground())
        .setDesc(i18nProxy.setting.editor.optionOpenTabInForegroundDescription())
        .addToggle(function (t) {
          return t.setValue(e.app.vault.getConfig("focusNewTab")).onChange(function (t) {
            e.app.vault.setConfig("focusNewTab", t);
          });
        });
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionDefaultNewTabView())
        .setDesc(i18nProxy.setting.editor.optionDefaultNewTabViewDescription())
        .addDropdown(function (t) {
          return t
            .addOption("source", i18nProxy.setting.editor.optionDefaultNewTabViewEditing())
            .addOption("preview", i18nProxy.setting.editor.optionDefaultNewTabViewReading())
            .setValue(e.app.vault.getConfig("defaultViewMode"))
            .onChange(function (t) {
              e.app.vault.setConfig("defaultViewMode", t);
            });
        });
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionDefaultEditingMode())
        .setDesc(i18nProxy.setting.editor.optionDefaultEditingModeDescription())
        .addDropdown(function (t) {
          return t
            .addOption("live-preview", i18nProxy.setting.editor.optionDefaultEditingModeLivePreview())
            .addOption("source", i18nProxy.setting.editor.optionDefaultEditingModeSource())
            .setValue(e.app.vault.getConfig("livePreview") ? "live-preview" : "source")
            .onChange(function (t) {
              e.app.vault.setConfig("livePreview", t === "live-preview");
              for (var n = 0, i = e.app.workspace.getLeavesOfType(typef00); n < i.length; n++) {
                var r = i[n],
                  o = r.getViewState();
                o.state.source = t !== "live-preview";
                r.setViewState(o);
              }
            });
        });
      new Setting(this.containerEl)
        .setName(i18nProxy.plugins.editorStatus.name())
        .setDesc(i18nProxy.plugins.editorStatus.desc())
        .addToggle(function (t) {
          var n = e.app.internalPlugins.plugins["editor-status"];
          t.setValue(n.enabled).onChange(function (e) {
            e ? n.enable(!0) : n.disable(!0);
          });
        });
      new Setting(this.containerEl).setHeading().setName(i18nProxy.setting.editor.sectionDisplay());
      this.addOption(
        "readableLineLength",
        i18nProxy.setting.editor.optionReadableLineLength(),
        i18nProxy.setting.editor.optionReadableLineDescription(),
      );
      this.addOption(
        "strictLineBreaks",
        i18nProxy.setting.editor.optionStrictLineBreak(),
        i18nProxy.setting.editor.optionStrictLineBreakDescription(),
      );
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionPropertiesInDocument())
        .setDesc(i18nProxy.setting.editor.optionPropertiesInDocumentDescription())
        .addDropdown(function (t) {
          return t
            .addOption("visible", i18nProxy.setting.editor.optionPropertiesVisible())
            .addOption("hidden", i18nProxy.setting.editor.optionPropertiesHidden())
            .addOption("source", i18nProxy.setting.editor.optionPropertiesSource())
            .setValue(e.app.vault.getConfig("propertiesInDocument"))
            .onChange(function (t) {
              e.app.vault.setConfig("propertiesInDocument", t);
            });
        });
      this.addOption(
        "foldHeading",
        i18nProxy.setting.editor.optionFoldHeading(),
        i18nProxy.setting.editor.optionFoldHeadingDescription(),
      );
      this.addOption(
        "foldIndent",
        i18nProxy.setting.editor.optionFoldIndent(),
        i18nProxy.setting.editor.optionFoldIndentDescription(),
      );
      this.addOption(
        "showLineNumber",
        i18nProxy.setting.editor.optionShowLineNumber(),
        i18nProxy.setting.editor.optionShowLineNumberDescription(),
      );
      this.addOption(
        "showIndentGuide",
        i18nProxy.setting.editor.optionIndentationGuide(),
        i18nProxy.setting.editor.optionIndentationGuideDescription(),
      );
      this.addOption(
        "rightToLeft",
        i18nProxy.setting.editor.optionRtl(),
        i18nProxy.setting.editor.optionRtlDescription(),
      );
      new Setting(this.containerEl).setHeading().setName(i18nProxy.setting.editor.sectionBehavior());
      var t,
        n = this.app.vault.getConfig("spellcheck"),
        i = new Setting(this.containerEl)
          .setName(i18nProxy.setting.editor.optionSpellcheck())
          .setDesc(i18nProxy.setting.editor.optionSpellcheckDescription());
      Platform.isDesktopApp &&
        i.addExtraButton(function (t) {
          return t.onClick(function () {
            new a9(e.app).open();
          });
        });
      i.addToggle(function (t) {
        return t.setValue(n).onChange(function (t) {
          return e.app.vault.setConfig("spellcheck", t);
        });
      });
      Platform.isDesktopApp &&
        callbackWithElectron(function (t) {
          var n = t.remote.getCurrentWebContents().session,
            i = new Setting(e.containerEl)
              .setName(i18nProxy.setting.editor.spellcheckLanguages())
              .setDesc(i18nProxy.setting.editor.spellcheckLanguagesDescription());
          if (isMacOS) i.setDesc(i18nProxy.setting.editor.spellcheckLanguagesMacDescription());
          else {
            var r = function () {
              i.clear();
              var o = n.availableSpellCheckerLanguages,
                a = e.app.getSpellcheckLanguages(),
                s = i.controlEl.createDiv("setting-command-hotkeys");
              if (a) {
                var l = a.map(function (lang) {
                  return {
                    lang: lang,
                    display: o.contains(lang) ? om(lang) : om(lang) + " (Not available)",
                  };
                });
                l.sort(function (e, t) {
                  return Eb(e.display, t.display);
                });
                for (
                  var c = function (t, textn0) {
                      s.createSpan({
                        cls: "setting-hotkey",
                        text: textn0,
                      }).createSpan("setting-hotkey-icon", function (n) {
                        setIcon(n, "lucide-x");
                        n.addEventListener("click", function () {
                          e.app.setSpellcheckLanguages(
                            a.filter(function (e) {
                              return e !== t;
                            }),
                          );
                          r();
                        });
                      });
                    },
                    u = 0,
                    h = l;
                  u < h.length;
                  u++
                ) {
                  var p = h[u];
                  c(p.lang, p.display);
                }
                var d = i.controlEl.createSpan("clickable-icon setting-restore-hotkey-button");
                setIcon(d, "lucide-rotate-ccw");
                d.addEventListener("click", function () {
                  e.app.setSpellcheckLanguages(null);
                  r();
                });
              } else
                s.createSpan({
                  cls: "setting-hotkey",
                  text: om(t.remote.app.getLocale()),
                });
              i.addDropdown(function (n) {
                n.selectEl.style.width = "80px";
                n.addOption("", "+");
                var i = o.map(function (lang) {
                  return {
                    lang: lang,
                    display: om(lang),
                  };
                });
                i.sort(function (e, t) {
                  return Eb(e.display, t.display);
                });
                for (var s = 0, l = i; s < l.length; s++) {
                  var c = l[s],
                    u = c.lang,
                    h = c.display;
                  n.addOption(u, h);
                }
                n.onChange(function (n) {
                  if (n) {
                    if ((a || (a = [t.remote.app.getLocale()]), a.contains(n))) return void r();
                    a.push(n);
                    e.app.setSpellcheckLanguages(a);
                    r();
                  }
                });
              });
            };
            r();
          }
        });
      this.addOption(
        "autoPairBrackets",
        i18nProxy.setting.editor.optionAutoPairBrackets(),
        i18nProxy.setting.editor.optionAutoPairBracketsDescription(),
      );
      this.addOption(
        "autoPairMarkdown",
        i18nProxy.setting.editor.optionAutoPairMarkdown(),
        i18nProxy.setting.editor.optionAutoPairMarkdownDescription(),
      );
      this.addOption(
        "smartIndentList",
        i18nProxy.setting.editor.optionSmartIndentLists(),
        i18nProxy.setting.editor.optionSmartIndentListsDescription(),
      );
      this.addOption(
        "useTab",
        i18nProxy.setting.editor.optionUseTabs(),
        i18nProxy.setting.editor.optionUseTabsDescription(),
      );
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionTabSize())
        .setDesc(i18nProxy.setting.editor.optionTabSizeDescription())
        .addExtraButton(function (n) {
          return n
            .setIcon("lucide-rotate-ccw")
            .setTooltip(i18nProxy.setting.hotkeys.tooltipRestoreDefault())
            .onClick(function () {
              e.app.vault.setConfig("tabSize", 4);
              t.setValue(4);
            });
        })
        .addSlider(function (n) {
          return (t = n
            .setLimits(2, 8, 1)
            .setDynamicTooltip()
            .setValue(e.app.vault.getConfig("tabSize"))
            .onChange(function (t) {
              e.app.vault.setConfig("tabSize", t);
            }));
        });
      new Setting(this.containerEl).setHeading().setName(i18nProxy.setting.about.optionAdvanced());
      this.addOption(
        "autoConvertHtml",
        i18nProxy.setting.editor.optionAutoConvertHtml(),
        i18nProxy.setting.editor.optionAutoConvertHtmlDescription(),
      );
      new Setting(this.containerEl)
        .setName(i18nProxy.setting.editor.optionVimKeyBindings())
        .setDesc(
          createFragment(function (e) {
            e.appendText(i18nProxy.setting.editor.optionVimKeyBindingsDescription());
            Platform.isMobile &&
              (e.createEl("br"), e.appendText(i18nProxy.setting.editor.optionVimKeyBindingsMobile()));
          }),
        )
        .addToggle(function (t) {
          return t.setValue(e.app.isVimEnabled()).onChange(function (n) {
            e.passedVimTest || !0 !== n
              ? Platform.isMobile
                ? (n ? localStorage.setItem("vim", "true") : localStorage.removeItem("vim"),
                  e.app.workspace.updateOptions())
                : e.app.vault.setConfig("vimMode", n)
              : (t.setValue(!1), e.startVimTest(t));
          });
        });
    };
    t.prototype.addOption = function (e, t, n) {
      var i = this;
      new Setting(this.containerEl)
        .setName(t)
        .setDesc(n)
        .addToggle(function (t) {
          return t.setValue(i.app.vault.getConfig(e)).onChange(function (t) {
            return i.app.vault.setConfig(e, t);
          });
        });
    };
    t.prototype.startVimTest = function (e) {
      var t,
        n = this,
        i = createFragment(),
        r = function () {
          var i = t.value.toLowerCase();
          i === ""
            ? new Notice(i18nProxy.setting.editor.msgVimModePleaseEnterCommand())
            : i.startsWith(":q")
              ? ((n.passedVimTest = true),
                e.setValue(!0),
                o.close(),
                new Notice(i18nProxy.setting.editor.msgVimModeEnabled()))
              : new Notice(i18nProxy.setting.editor.msgVimModeNotEnabled());
        },
        o = new GM(this.app);
      i.createEl("p", {
        cls: "mod-warning",
        text: i18nProxy.setting.editor.labelVimWarning(),
      });
      i.createEl("p", {
        text: i18nProxy.setting.editor.labelVimTest(),
      });
      i.createEl(
        "p",
        {
          cls: "form-field",
        },
        function (e) {
          e.createEl("label", {
            cls: "input-label",
            text: i18nProxy.setting.editor.labelVimYourAnswer(),
          });
          (t = e.createEl("input", {
            type: "text",
          })).setAttribute("placeholder", i18nProxy.setting.editor.placeholderEnterCommand());
          t.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.key !== "Enter")) {
              r();
            }
          });
        },
      );
      o.setTitle(i18nProxy.setting.editor.labelConfirmEnableVim());
      o.setContent(i);
      o.addButton("mod-cta", i18nProxy.setting.editor.buttonConfirmEnableVim(), function () {
        r();
        return !0;
      });
      o.addCancelButton();
      o.open();
      t.focus();
    };
    return t;
  })(SettingTab),
  a9 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.titleEl.setText(i18nProxy.setting.editor.spellcheckDict());
      return n;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.rerender();
    };
    t.prototype.onClose = function () {
      this.contentEl.empty();
    };
    t.prototype.rerender = function () {
      var e = this,
        t = this.contentEl;
      t.empty();
      callbackWithElectron(function (n) {
        return __awaiter(e, undefined, undefined, function () {
          var e,
            i,
            r,
            o,
            a,
            s,
            l,
            c = this;
          return __generator(this, function (u) {
            switch (u.label) {
              case 0:
                return [4, (e = n.remote.getCurrentWebContents().session).listWordsInSpellCheckerDictionary()];
              case 1:
                for (
                  (i = u.sent()).sort(Eb),
                    r = t.createDiv("spellchecker-dictionary-container"),
                    o = function (textt0) {
                      var n = r.createDiv("spellchecker-dictionary-item"),
                        i = n.createDiv("spellchecker-dictionary-remove-button");
                      setIcon(i, "lucide-x");
                      setTooltip(i, "Remove from dictionary");
                      i.addEventListener("click", function () {
                        e.removeWordFromSpellCheckerDictionary(textt0);
                        c.rerender();
                      });
                      n.createDiv({
                        cls: "spellchecker-dictionary-word",
                        text: textt0,
                      });
                    },
                    a = 0,
                    s = i;
                  a < s.length;
                  a++
                ) {
                  l = s[a];
                  o(l);
                }
                i.length === 0 &&
                  t.createEl("p", {
                    text: i18nProxy.setting.editor.spellcheckDictEmpty(),
                  });
                return [2];
            }
          });
        });
      });
    };
    return t;
  })(Modal),
  s9 = "didProvideMobileFeedback",
  l9 = i18nProxy.interface.mobile.feedback,
  c9 = (function () {
    function e(app, parentEl) {
      var n = this;
      this.app = app;
      this.parentEl = parentEl;
      this.containerEl = parentEl.createDiv({
        cls: "feedback-banner-container",
      });
      this.containerEl.hide();
      this.bannerEl = this.containerEl.createDiv(
        {
          cls: "feedback-banner",
        },
        function (e) {
          e.createDiv({
            cls: "feedback-banner-title",
            text: l9.labelFeedback(),
          });
          e.createDiv(
            {
              cls: "feedback-banner-content",
            },
            function (e) {
              e.createDiv({
                cls: "feedback-banner-body",
                text: l9.labelFeedbackDesc(),
              });
              e.createEl("button", {
                cls: "mod-muted",
                text: l9.actionRate(),
              }).addEventListener("click", function () {
                n.submitRating();
              });
            },
          );
          e.createDiv({
            cls: "feedback-banner-dismiss-button",
            text: l9.actionDismiss(),
          }).addEventListener("click", function () {
            localStorage.setItem(s9, "1");
            n.hide();
          });
        },
      );
    }
    e.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.shouldShow()];
            case 1:
              e.sent() && this.containerEl.show();
              return [2];
          }
        });
      });
    };
    e.prototype.shouldShow = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return isDev
                ? [2, !0]
                : ((e = this.app),
                  navigator.onLine
                    ? localStorage.getItem(s9)
                      ? [2, !1]
                      : c$.license ||
                          ((i = e.internalPlugins.getEnabledPluginById("sync")) === null || undefined === i
                            ? undefined
                            : i.getRemoteVaultId())
                        ? Platform.isIosApp
                          ? [4, capacitorAppPlugin.isInstalledFromStore()]
                          : [3, 2]
                        : [2]
                    : [2, !1]);
            case 1:
              if (!r.sent()) return [2, !1];
              r.label = 2;
            case 2:
              return e.vault.getRoot().getFileCount() < 50
                ? [2, !1]
                : ((t = e.vault.configDir), [4, e.vault.adapter.stat(t)]);
            case 3:
              n = r.sent();
              return Date.now() - n.ctime < 15552e6 ? [2, !1] : [2, !0];
          }
        });
      });
    };
    e.prototype.hide = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              this.containerEl.setCssStyles({
                height: this.containerEl.offsetHeight + "px",
              });
              t = this.bannerEl;
              new Promise(function (e) {
                fl(
                  t,
                  new cl({
                    duration: 150,
                    fn: "cubic-bezier(0.45,0.05,0.55,0.95)",
                  }).addProp("transform", "", "scale(0.01)", ""),
                  function () {
                    return e(null);
                  },
                );
              });
              return [4, sleep(70)];
            case 1:
              e.sent();
              return [4, gl(this.containerEl)];
            case 2:
              e.sent();
              this.containerEl.hide();
              return [2];
          }
          var t;
        });
      });
    };
    e.prototype.submitRating = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              localStorage.setItem(s9, "1");
              return [4, rateAppPlugin.requestReview()];
            case 1:
              e.sent();
              return [4, sleep(400)];
            case 2:
              e.sent();
              this.hide();
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  u9 = i18nProxy.setting.file,
  h9 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = u9.name();
      t.id = "file";
      t.deleteOption = [
        {
          value: "system",
          description: u9.optionChoiceSystemTrash(),
        },
        {
          value: "local",
          description: u9.optionChoiceVaultTrash(),
        },
        {
          value: "none",
          description: u9.optionChoicePermanentDelete(),
        },
      ];
      t.newNoteLocationOptions = [
        {
          value: "root",
          description: u9.optionChoiceVaultRoot(),
        },
        {
          value: "current",
          description: u9.optionChoiceCurrentFolder(),
        },
        {
          value: "folder",
          description: u9.optionChoiceSpecifiedFolder(),
        },
      ];
      t.newLinkFormatOptions = [
        {
          value: "shortest",
          description: u9.optionChoiceShortestLinktext(),
        },
        {
          value: "relative",
          description: u9.optionChoiceRelativePath(),
        },
        {
          value: "absolute",
          description: u9.optionChoiceAbsolutePath(),
        },
      ];
      t.newAttachmentLocationOptions = [
        {
          value: "root",
          description: u9.optionChoiceVaultRoot(),
        },
        {
          value: "folder",
          description: u9.optionChoiceSpecifiedFolder(),
        },
        {
          value: "current",
          description: u9.optionChoiceCurrentFolder(),
        },
        {
          value: "subfolder",
          description: u9.optionChoiceSubdirectory(),
        },
      ];
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this.app,
        n = this.containerEl;
      n.empty();
      new Setting(n)
        .setName(u9.optionConfirmFileDeletion())
        .setDesc(u9.optionConfirmFileDeletionDescription())
        .addToggle(function (n) {
          return n.setValue(t.vault.getConfig("promptDelete")).onChange(function (t) {
            e.app.vault.setConfig("promptDelete", t);
          });
        });
      new Setting(n)
        .setName(u9.optionDeleteDestination())
        .setDesc(u9.optionDeleteDestinationDescription())
        .addDropdown(function (n) {
          n.onChange(function (e) {
            t.vault.setConfig("trashOption", e);
          });
          for (var i = 0, r = e.deleteOption; i < r.length; i++) {
            var o = r[i];
            n.addOption(o.value, o.description);
          }
          n.setValue(t.vault.getConfig("trashOption"));
        });
      var i = t.vault.getConfig("alwaysUpdateLinks");
      new Setting(n)
        .setName(u9.optionAlwaysUpdateLinks())
        .setDesc(u9.optionAlwaysUpdateLinksDescription())
        .addToggle(function (t) {
          return t.setValue(i).onChange(function (t) {
            e.app.vault.setConfig("alwaysUpdateLinks", t);
          });
        });
      var r,
        o = function () {
          s.settingEl.toggle(r.getValue() === "folder");
        };
      new Setting(n)
        .setName(u9.optionNewNoteLocation())
        .setDesc(u9.optionNewNoteLocationDescription())
        .addDropdown(function (n) {
          r = n;
          n.onChange(function (e) {
            t.vault.setConfig("newFileLocation", e);
            o();
          });
          for (var i = 0, a = e.newNoteLocationOptions; i < a.length; i++) {
            var s = a[i];
            n.addOption(s.value, s.description);
          }
          n.setValue(t.vault.getConfig("newFileLocation"));
        });
      var a = t.vault.getConfig("newFileFolderPath"),
        s = new Setting(n)
          .setName(u9.optionNewFileFolderPath())
          .setDesc(u9.optionNewFileFolderPathDescription())
          .addText(function (e) {
            e.setPlaceholder(i18nProxy.setting.folderPathExamplePlaceholder())
              .setValue(a === "/" ? "" : a)
              .onChange(function (e) {
                t.vault.setConfig("newFileFolderPath", e);
              });
            new mT(t, e.inputEl, !1, !0);
          });
      new Setting(n)
        .setName(u9.optionLinkAutocompletedFormat())
        .setDesc(u9.optionLinkAutocompletedFormatDescription())
        .addDropdown(function (n) {
          n.onChange(function (e) {
            t.vault.setConfig("newLinkFormat", e);
          });
          for (var i = 0, r = e.newLinkFormatOptions; i < r.length; i++) {
            var o = r[i];
            n.addOption(o.value, o.description);
          }
          n.setValue(t.vault.getConfig("newLinkFormat"));
        });
      new Setting(n)
        .setName(u9.optionUseWikiLinks())
        .setDesc(u9.optionUseWikiLinksDescription())
        .addToggle(function (e) {
          return e.setValue(!t.vault.getConfig("useMarkdownLinks")).onChange(function (e) {
            t.vault.setConfig("useMarkdownLinks", !e);
          });
        });
      new Setting(n)
        .setName(u9.optionShowUnsupportedFiles())
        .setDesc(u9.optionShowUnsupportedFilesDescription())
        .addToggle(function (e) {
          return e.setValue(t.vault.getConfig("showUnsupportedFiles")).onChange(function (e) {
            t.vault.setConfig("showUnsupportedFiles", e);
          });
        });
      var l,
        c,
        u,
        h,
        p,
        d = u9.optionNewAttachmentLocationDefault(),
        f = function () {
          var e = l.getValue();
          c.settingEl.toggle(e === "folder");
          u.settingEl.toggle(e === "subfolder");
        },
        m = function () {
          var e = l.getValue();
          return e === "root"
            ? "/"
            : e === "folder"
              ? h.getValue() || d
              : e === "current"
                ? "./"
                : e === "subfolder"
                  ? "./" + (p.getValue() || d)
                  : "";
        };
      new Setting(n)
        .setName(u9.optionNewAttachmentLocation())
        .setDesc(u9.optionNewAttachmentLocationDescription())
        .addDropdown(function (n) {
          n.onChange(function (e) {
            f();
            t.vault.setConfig("attachmentFolderPath", m());
          });
          for (var i = 0, r = e.newAttachmentLocationOptions; i < r.length; i++) {
            var o = r[i];
            n.addOption(o.value, o.description);
          }
          l = n;
        });
      c = new Setting(n)
        .setName(u9.optionAttachmentFolderPath())
        .setDesc(u9.optionAttachmentFolderPathDescription())
        .addText(function (e) {
          e.setPlaceholder(d).onChange(function (e) {
            t.vault.setConfig("attachmentFolderPath", m());
          });
          new mT(t, e.inputEl, !1, !0);
          h = e;
        });
      u = new Setting(n)
        .setName(u9.optionAttachmentSubfolderPath())
        .setDesc(u9.optionAttachmentSubfolderPathDescription())
        .addText(function (e) {
          e.setPlaceholder(d).onChange(function (e) {
            t.vault.setConfig("attachmentFolderPath", m());
          });
          p = e;
        });
      var g,
        v = function () {
          w.setDesc(
            createFragment(function (e) {
              e.appendText(u9.optionExcludedFilesDesc());
              var n = t.vault.getConfig("userIgnoreFilters");
              if (n && n.length > 0)
                for (
                  var i = e.createEl("ul"),
                    r = function (texte0) {
                      i.createEl("li", "").createSpan(
                        {
                          text: texte0,
                        },
                        function (t) {
                          if (texte0.length > 2 && texte0.startsWith("/") && texte0.endsWith("/")) {
                            t.createSpan({
                              text: "Regex",
                              cls: "flair mod-flat",
                            });
                          }
                        },
                      );
                    },
                    o = 0,
                    a = n;
                  o < a.length;
                  o++
                ) {
                  r(a[o]);
                }
            }),
          );
        },
        w = new Setting(n).setName(u9.optionExcludedFiles()).addButton(function (e) {
          return e.setButtonText(i18nProxy.interface.buttonManage()).onClick(function () {
            var e = t.vault.getConfig("userIgnoreFilters") || [];
            new p9(t, e, function (e) {
              e.length === 0 && (e = null);
              t.vault.setConfig("userIgnoreFilters", e);
              v();
            }).open();
          });
        }),
        k = localStorage.getItem(this.app.appId + "-config") || "",
        C = k;
      new Setting(n)
        .setName(i18nProxy.setting.about.optionConfigLocation())
        .setDesc(i18nProxy.setting.about.optionConfigLocationDescription())
        .addButton(function (t) {
          g = t;
          t.setCta()
            .setButtonText(i18nProxy.setting.about.buttonRelaunch())
            .onClick(function () {
              localStorage.setItem(e.app.appId + "-config", C);
              window.location.reload();
            });
          t.buttonEl.hide();
        })
        .addText(function (e) {
          e.setPlaceholder(".obsidian")
            .setValue(k)
            .onChange(function (t) {
              !t || Vault.validateConfigDir(t)
                ? (hideTooltip(), (C = t), g.buttonEl.toggle(t !== k))
                : displayTooltip(e.inputEl, i18nProxy.setting.about.optionConfigLocationWarning(), {
                    placement: "left",
                    classes: ["mod-error"],
                  });
            });
        });
      new Setting(n).setHeading().setName(i18nProxy.setting.about.optionAdvanced());
      new Setting(n)
        .setName(u9.optionUriCallbacks())
        .setDesc(
          createFragment(function (e) {
            e.appendText(u9.optionUriCallbacksDesc() + " ");
            e.createEl("a", {
              href: "https://help.obsidian.md/Extending+Obsidian/Obsidian+URI#Use+x-callback-url+parameters",
              text: i18nProxy.interface.buttonLearnMore(),
              attr: {
                target: "_blank",
              },
            });
          }),
        )
        .addToggle(function (n) {
          return n.setValue(t.vault.getConfig("uriCallbacks")).onChange(function (t) {
            e.app.vault.setConfig("uriCallbacks", t);
          });
        });
      new Setting(n)
        .setName(i18nProxy.setting.editor.optionReindexVault())
        .setDesc(
          createFragment(function (e) {
            e.createSpan({
              cls: "mod-warning",
              text: i18nProxy.setting.editor.optionReindexVaultDescription(),
            });
            e.createEl("br");
            e.createEl("a", {
              href: "https://help.obsidian.md/Files+and+folders/How+Obsidian+stores+data#Metadata+cache",
              text: i18nProxy.interface.buttonLearnMore(),
              attr: {
                target: "_blank",
              },
            });
          }),
        )
        .addButton(function (t) {
          return t
            .setButtonText(i18nProxy.setting.editor.labelReindex())
            .setClass("mod-destructive")
            .onClick(function () {
              return __awaiter(e, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.app.metadataCache.clear()];
                    case 1:
                      e.sent();
                      window.location.reload();
                      return [2];
                  }
                });
              });
            });
        });
      v();
      o();
      (function (e) {
        if (e !== "/") {
          if (e !== "." && e !== "./") {
            if (e.startsWith("./")) {
              var t = e.slice(2);
              l.setValue("subfolder");
              return void p.setValue(t !== d ? t : "");
            }
            l.setValue("folder");
            h.setValue(e !== d ? e : "");
          } else l.setValue("current");
        } else l.setValue("root");
      })(t.vault.getConfig("attachmentFolderPath"));
      f();
    };
    return t;
  })(SettingTab),
  p9 = (function (e) {
    function t(t, values, i) {
      var r,
        o = e.call(this, t) || this;
      o.setTitle(u9.optionExcludedFiles());
      o.values = values;
      o.descEl = o.contentEl.createEl("p");
      o.listEl = o.contentEl.createDiv();
      var a = function () {
        var e = r.getValue();
        if (!e.trim()) {
          displayTooltip(r.inputEl, u9.messageEmptyFilter(), {
            classes: ["mod-error"],
          });
          return void setTimeout(function () {
            return hideTooltip();
          }, 2e3);
        }
        o.values.push(e);
        o.display();
        r.setValue("");
      };
      new Setting(o.contentEl)
        .setName(u9.labelExcludedFilter())
        .addText(function (e) {
          r = e;
          e.setPlaceholder(u9.placeholderExcludedFilter());
          var n = e.inputEl;
          n.addEventListener("keydown", function (e) {
            if (!e.isComposing) {
              e.key === "Enter" && a();
            }
          });
          new mT(t, n, !0, !1).onSelect(function (e) {
            e && r.setValue(e.item.path + "/");
            a();
          });
        })
        .addButton(function (e) {
          return e.setButtonText(i18nProxy.interface.buttonAdd()).onClick(a);
        });
      o.addButton("mod-cta", i18nProxy.dialogue.buttonSave(), function () {
        o.close();
        i(o.values);
      });
      o.addCancelButton();
      return o;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      this.display();
    };
    t.prototype.display = function () {
      var e = this,
        t = this,
        n = t.listEl,
        i = t.descEl,
        r = t.values;
      r.length === 0 ? i.setText(u9.labelNoExcludedFiltersApplied()) : i.setText(u9.labelExcludedFiltersApplied());
      n.empty();
      for (
        var o = function (textt0) {
            n.createDiv("mobile-option-setting-item", function (n) {
              n.createSpan(
                {
                  cls: "mobile-option-setting-item-name",
                  text: textt0,
                },
                function (e) {
                  if (textt0.length > 2 && textt0.startsWith("/") && textt0.endsWith("/")) {
                    e.createSpan({
                      text: "Regex",
                      cls: "flair mod-flat",
                    });
                  }
                },
              );
              n.createDiv("clickable-icon mobile-option-setting-item-option-icon", function (n) {
                setIcon(n, "lucide-x");
                setTooltip(n, i18nProxy.interface.deleteActionShortName());
                n.addEventListener("click", function () {
                  r.remove(textt0);
                  e.display();
                });
              });
            });
          },
          a = 0,
          s = r;
        a < s.length;
        a++
      ) {
        o(s[a]);
      }
    };
    return t;
  })(GM),
  d9 = i18nProxy.setting.mobileToolbar,
  f9 = (function (e) {
    function t(t, callback) {
      var i = e.call(this, t) || this;
      i.emptyStateText = i18nProxy.plugins.commandPalette.labelNoCommands();
      i.callback = callback;
      i.setPlaceholder(d9.placeholderSelectQuickAction());
      return i;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return [null].concat(Object.values(this.app.commands.commands));
    };
    t.prototype.getItemText = function (e) {
      return e ? e.name : d9.quickActionDisabled();
    };
    t.prototype.onChooseItem = function (e) {
      this.app.vault.setConfig("mobilePullAction", e ? e.id : "");
      this.callback && this.callback();
    };
    return t;
  })(FuzzySuggestModal),
  m9 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.name = d9.name();
      i.id = "mobile";
      t.commands.addCommand({
        id: "mobile:quick-action",
        name: d9.optionConfigureQuickAction(),
        icon: "lucide-terminal-square",
        checkCallback: function (e) {
          if (Platform.isMobile) {
            e || new f9(t).open();
            return !0;
          }
        },
      });
      return i;
    }
    __extends(t, e);
    t.prototype.display = function () {
      var e = this,
        t = this.app,
        n = this.containerEl;
      n.empty();
      var i = t.vault.getConfig("mobilePullAction"),
        r = t.commands.findCommand(i);
      new Setting(n)
        .setName(d9.optionConfigureQuickAction())
        .setDesc(
          d9.optionConfigureQuickActionDescription({
            command: r ? r.name : d9.quickActionDisabled(),
          }),
        )
        .addButton(function (n) {
          return n.setButtonText(d9.buttonConfigure()).onClick(function () {
            return new f9(t, function () {
              return e.display();
            }).open();
          });
        });
      var o = t.commands.commands,
        a = t.commands.editorCommands,
        s = t.vault.getConfig("mobileToolbarCommands"),
        l = Object.keys(a).filter(function (e) {
          return !s.contains(e);
        }),
        c = function () {
          t.vault.setConfig("mobileToolbarCommands", s);
          e.display();
        };
      if (s) {
        new Setting(n).setName(d9.manageToolbarOptions()).setHeading();
        var u = n.createDiv();
        s = s.filter(function (e) {
          return o[e];
        });
        for (
          var h = function (e) {
              var t = o[e];
              u.createDiv("mobile-option-setting-item", function (n) {
                n.createSpan("mobile-option-setting-item-remove-icon", function (t) {
                  setIcon(t, "lucide-minus-circle");
                  t.addEventListener("click", function () {
                    if (s.contains(e)) {
                      s.remove(e);
                      c();
                    }
                  });
                });
                n.createSpan("mobile-option-setting-item-option-icon", function (e) {
                  return setIcon(e, t.icon || "question-mark-glyph");
                });
                n.createSpan({
                  cls: "mobile-option-setting-item-name",
                  text: t.name,
                });
                n.createDiv(
                  "clickable-icon mobile-option-setting-item-option-icon mobile-option-setting-drag-icon",
                  function (t) {
                    setIcon(t, "lucide-menu");
                    setTooltip(t, i18nProxy.interface.dragToRearrange());
                    Vc(
                      t,
                      n,
                      u,
                      5,
                      function () {
                        return null;
                      },
                      function (t) {
                        s.remove(e);
                        s.splice(t, 0, e);
                        c();
                      },
                    );
                  },
                );
              });
            },
            p = 0,
            d = s;
          p < d.length;
          p++
        ) {
          h(d[p]);
        }
      }
      if (l.length > 0) {
        new Setting(n).setName(d9.optionMoreToolbarOptions()).setHeading();
        for (
          var f = function (e) {
              var t = o[e];
              n.createDiv("mobile-option-setting-item", function (n) {
                n.createSpan("mobile-option-setting-item-add-icon", function (t) {
                  setIcon(t, "lucide-plus-circle");
                  t.addEventListener("click", function () {
                    if (!s.contains(e)) {
                      s.push(e);
                      c();
                    }
                  });
                });
                n.createSpan("mobile-option-setting-item-option-icon", function (e) {
                  return setIcon(e, t.icon || "question-mark-glyph");
                });
                n.createSpan({
                  text: t.name,
                });
              });
            },
            m = 0,
            g = l;
          m < g.length;
          m++
        ) {
          f(g[m]);
        }
      }
      var v = Object.keys(o)
        .filter(function (e) {
          return !a[e] && !s.contains(e);
        })
        .map(function (e) {
          return o[e];
        });
      new Setting(n)
        .setName(d9.optionAddCommand())
        .setDesc(d9.optionAddCommandDescription())
        .addText(function (t) {
          return t.setPlaceholder(i18nProxy.plugins.commandPalette.promptTypeCommand()).then(function () {
            new V4(e.app, t.inputEl, v, function (e) {
              var t = e.id;
              if (!s.contains(t)) {
                s.push(t);
                c();
              }
            });
          });
        });
    };
    return t;
  })(SettingTab),
  g9 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = i18nProxy.setting.builtinPlugins();
      t.id = "plugins";
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      this.render(!0);
    };
    t.prototype.render = function (e) {
      var t = this,
        n = this.app.internalPlugins;
      this.containerEl.empty();
      var i = this.containerEl.createDiv("plugin-list-plugins");
      new Setting(i)
        .setName(i18nProxy.setting.corePlugin.optionSearchPlugin())
        .setDesc(i18nProxy.setting.corePlugin.optionSearchPluginDescription())
        .addSearch(function (t) {
          return t
            .setPlaceholder(i18nProxy.setting.corePlugin.placeholderSearchPlugin())
            .onChange(function (e) {
              return a(e);
            })
            .then(function () {
              if (e && Platform.hasPhysicalKeyboard) {
                setTimeout(function () {
                  return t.inputEl.focus();
                });
              }
            });
        });
      var r = i.createDiv(),
        o = {},
        a = function (e) {
          r.empty();
          new Setting(r).setHeading().setName(i18nProxy.setting.corePlugin.pluginList());
          var i = (e = (e || "").trim().toLowerCase()).split(" "),
            a = n.plugins,
            s = Object.keys(a).filter(function (e) {
              return !a[e].instance.hiddenFromList;
            });
          s.sort(function (e, t) {
            return Eb(a[e].instance.name, a[t].instance.name);
          });
          for (
            var l = function (n) {
                var s,
                  l,
                  c = a[n],
                  u = c.instance,
                  h = null,
                  p = null;
                if (e && ((h = Gx(i, u.name.toLowerCase())), (p = Gx(i, u.description.toLowerCase())), !h && !p))
                  return "continue";
                var d = function () {
                  var e = false,
                    i = false;
                  c.enabled &&
                    ((e = t.setting.pluginTabs.some(function (e) {
                      return e.id === n;
                    })),
                    Object.keys(t.app.commands.commands).some(function (e) {
                      return e.startsWith(n + ":");
                    }) && (i = true));
                  s.extraSettingsEl.toggle(e);
                  l.extraSettingsEl.toggle(i);
                };
                new Setting(r)
                  .setName(
                    createFragment(function (e) {
                      return renderMatches(e, u.name, h);
                    }),
                  )
                  .setDesc(
                    createFragment(function (e) {
                      return renderMatches(e, u.description, p);
                    }),
                  )
                  .addExtraButton(function (e) {
                    return (s = e
                      .setIcon("lucide-settings")
                      .setTooltip(i18nProxy.setting.options())
                      .onClick(function () {
                        return t.setting.openTabById(n);
                      }));
                  })
                  .addExtraButton(function (e) {
                    l = e;
                    e.extraSettingsEl.addClass("mod-hotkeys");
                    e.setIcon("lucide-plus-circle")
                      .setTooltip(i18nProxy.setting.hotkeys.name())
                      .onClick(function () {
                        var e = t.setting.openTabById("hotkeys");
                        if (e instanceof o1) {
                          e.setQuery(n);
                        }
                      });
                  })
                  .addToggle(function (e) {
                    o[n] = e;
                    e.setValue(c.enabled).onChange(function (e) {
                      return __awaiter(t, undefined, undefined, function () {
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return e ? [4, c.enable(!0)] : [3, 2];
                            case 1:
                              t.sent();
                              return [3, 3];
                            case 2:
                              c.disable(!0);
                              t.label = 3;
                            case 3:
                              d();
                              return [2];
                          }
                        });
                      });
                    });
                  });
                d();
              },
              c = 0,
              u = s;
            c < u.length;
            c++
          ) {
            l(u[c]);
          }
        };
      a();
      n.on("change", function () {
        t.updateEnabledState(o, t.app.internalPlugins);
      });
    };
    t.prototype.updateEnabledState = function (e, t) {
      var n = t.plugins;
      for (var i in n)
        if (n.hasOwnProperty(i)) {
          var r = n[i],
            o = e[i];
          if (o) {
            o.setValue(r.enabled);
          }
        }
    };
    return t;
  })(SettingTab),
  v9 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.settingTabs = [];
      n.pluginTabs = [];
      n.activeTab = null;
      n.activeTabCloseable = null;
      n.feedbackBanner = null;
      n.lastTabId = "";
      n.modalEl.addClass("mod-settings", "mod-sidebar-layout");
      n.updateModalTitle();
      n.contentEl.addClass("vertical-tabs-container");
      n.tabHeadersEl = n.contentEl.createDiv("vertical-tab-header", function (e) {
        Platform.isPhone && (n.feedbackBanner = new c9(n.app, e));
        e.createDiv("vertical-tab-header-group", function (e) {
          e.createDiv({
            cls: "vertical-tab-header-group-title",
            text: i18nProxy.setting.options(),
          });
          n.tabContainer = e.createDiv("vertical-tab-header-group-items");
        });
        e.createDiv("vertical-tab-header-group", function (e) {
          n.corePluginTabHeaderGroup = e.createDiv({
            cls: "vertical-tab-header-group-title",
            text: i18nProxy.setting.builtinPlugins(),
          });
          n.corePluginTabHeaderGroup.hide();
          n.corePluginTabContainer = e.createDiv("vertical-tab-header-group-items");
        });
        e.createDiv("vertical-tab-header-group", function (e) {
          n.communityPluginTabHeaderGroup = e.createDiv({
            cls: "vertical-tab-header-group-title",
            text: i18nProxy.setting.thirdPartyPlugin.name(),
          });
          n.communityPluginTabHeaderGroup.hide();
          n.communityPluginTabContainer = e.createDiv("vertical-tab-header-group-items");
        });
      });
      n.tabContentContainer = createDiv("vertical-tab-content-container");
      n.addSettingTab(new B5(t, n));
      n.addSettingTab(new o9(t, n));
      Platform.isMobile && n.addSettingTab(new m9(t, n));
      n.addSettingTab(new h9(t, n));
      n.addSettingTab(new n9(t, n));
      n.addSettingTab(new o1(t, n));
      n.addSettingTab(new g9(t, n));
      n.addSettingTab(new r9(t, n));
      Platform.isMobile &&
        OM(n.contentEl, function (e) {
          if (e.points === 1 && e.direction === "x" && n.activeTab && !(e.touch.clientX > 40)) {
            var t = n.activeTab.containerEl;
            n.contentEl.prepend(n.tabHeadersEl);
            restoreScrollPositionsWalk(n.tabHeadersEl);
            e.registerCallback({
              move: function (n, i) {
                var r = t.offsetWidth,
                  o = Math.clamp((n - e.startX) / r, 0, 1);
                t.style.transform = "translateX(".concat(o * r, "px)");
              },
              cancel: function () {
                t.style.transform = "";
                n.tabHeadersEl.detach();
              },
              finish: function (i, r, o) {
                var a = t.offsetWidth,
                  s = Math.clamp((i - e.startX) / a, 0, 1);
                0.5 * o < a / 2
                  ? fl(
                      t,
                      new cl({
                        duration: 150 * s,
                      }).addProp("transform", null, "translateX(0)", ""),
                      function () {
                        n.tabHeadersEl.detach();
                      },
                    )
                  : fl(
                      t,
                      new cl({
                        duration: 100 * (1 - s),
                        fn: "ease-out",
                      }).addProp("transform", null, "translateX(".concat(a, "px)"), ""),
                      function () {
                        t.detach();
                        n.closeActiveTab();
                      },
                    );
              },
            });
          }
        });
      return n;
    }
    __extends(t, e);
    t.prototype.updateModalTitle = function (e) {
      this.titleEl.empty();
      e ? this.titleEl.setText(e.name) : this.titleEl.setText(i18nProxy.interface.settings());
    };
    t.prototype.addSettingTab = function (e) {
      var t = this;
      e.navEl ||
        (e.navEl = createDiv(
          {
            cls: "vertical-tab-nav-item",
            text: e.name,
          },
          function (n) {
            n.createDiv("vertical-tab-nav-item-chevron", function (e) {
              return setIcon(e, "lucide-chevron-right");
            });
            n.addEventListener("click", function () {
              t.openTab(e);
            });
          },
        ));
      this.isPluginSettingTab(e)
        ? this.pluginTabs.push(e)
        : (this.settingTabs.push(e), this.tabContainer.appendChild(e.navEl));
      this.updatePluginSection();
    };
    t.prototype.removeSettingTab = function (e) {
      this.pluginTabs.remove(e);
      this.settingTabs.remove(e);
      var t = this.activeTab;
      t && t === e && this.closeActiveTab();
      this.updatePluginSection();
    };
    t.prototype.isPluginSettingTab = function (e) {
      return e instanceof j1 || e instanceof PluginSettingTab;
    };
    t.prototype.updatePluginSection = function () {
      var e = this.pluginTabs,
        t = e.filter(function (e) {
          return e instanceof j1;
        }),
        n = e.filter(function (e) {
          return e instanceof PluginSettingTab;
        });
      t.sort(function (e, t) {
        return Eb(e.name, t.name);
      });
      this.corePluginTabHeaderGroup.toggle(t.length > 0);
      this.corePluginTabContainer.setChildrenInPlace(
        t.map(function (e) {
          return e.navEl;
        }),
      );
      n.sort(function (e, t) {
        return Eb(e.name, t.name);
      });
      this.communityPluginTabHeaderGroup.toggle(n.length > 0);
      this.communityPluginTabContainer.setChildrenInPlace(
        n.map(function (e) {
          return e.navEl;
        }),
      );
    };
    t.prototype.openTab = function (activeTab) {
      var t = this,
        n = this,
        i = n.activeTab,
        r = n.contentEl,
        o = n.tabContentContainer,
        a = n.tabHeadersEl;
      o.empty();
      RM(this.activeTabCloseable);
      this.updateModalTitle(activeTab);
      i && (i.navEl.removeClass("is-active"), i.hide());
      this.activeTab = activeTab;
      this.lastTabId = activeTab.id;
      activeTab.navEl.addClass("is-active");
      this.activeTabCloseable = {
        close: this.closeActiveTab.bind(this),
      };
      NM(this.activeTabCloseable);
      o.appendChild(activeTab.containerEl);
      this.titleEl.createDiv(
        {
          cls: "modal-setting-back-button",
          prepend: !0,
        },
        function (e) {
          e.addEventListener("click", function () {
            return t.closeActiveTab();
          });
          e.createSpan("modal-setting-back-button-icon", function (e) {
            setIcon(e, "lucide-arrow-left");
          });
        },
      );
      Platform.isPhone && !i ? (saveScrollPositions(a), Ml(r, o, "right")) : r.appendChild(o);
      activeTab.display();
    };
    t.prototype.closeActiveTab = function () {
      var e = this,
        t = this,
        n = t.activeTab,
        i = t.contentEl,
        r = t.tabContentContainer,
        o = t.tabHeadersEl;
      if (n) {
        var a = function () {
          r.empty();
          n.navEl.removeClass("is-active");
          n.hide();
          e.updateModalTitle();
          RM(e.activeTabCloseable);
          e.activeTabCloseable = null;
        };
        Platform.isPhone && i.isShown() && this.activeTab.containerEl.isShown()
          ? Ml(i, o, "left", a)
          : (i.setChildrenInPlace([o]), a());
        restoreScrollPositionsWalk(o);
        this.activeTab = null;
      }
    };
    t.prototype.openTabById = function (e) {
      for (var t = 0, n = this.settingTabs; t < n.length; t++) {
        if ((o = n[t]).id === e) {
          this.openTab(o);
          return o;
        }
      }
      for (var i = 0, r = this.pluginTabs; i < r.length; i++) {
        var o;
        if ((o = r[i]).id === e) {
          this.openTab(o);
          return o;
        }
      }
      return null;
    };
    t.prototype.onOpen = function () {
      e.prototype.onOpen.call(this);
      Platform.isPhone || this.openTabById(this.lastTabId) || this.openTab(this.settingTabs[0]);
      Platform.isPhone && this.feedbackBanner && this.feedbackBanner.show();
    };
    t.prototype.onClose = function () {
      e.prototype.onClose.call(this);
      this.closeActiveTab();
    };
    t.prototype.animateOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              (e = this.modalEl.doc.body).addClass("hide-cursor");
              return [
                4,
                ((n = this.modalEl),
                (i = this.bgEl),
                (r = this.bgOpacity),
                undefined === r && (r = "0.85"),
                new Promise(function (e) {
                  var t = n.offsetWidth - 1,
                    durationo0 = Math.clamp(0.35 * t, 100, 250);
                  fl(
                    n,
                    new cl({
                      duration: durationo0,
                      fn: "var(--anim-motion-swing)",
                    }).addProp("transform", "translateX(-".concat(t, "px)"), ""),
                    function () {
                      return e(null);
                    },
                  );
                  i &&
                    fl(
                      i,
                      new cl({
                        duration: durationo0,
                        fn: easeInFast,
                      }).addProp("opacity", "0", r),
                    );
                })),
              ];
            case 1:
              t.sent();
              e.removeClass("hide-cursor");
              return [2];
          }
          var n, i, r;
        });
      });
    };
    t.prototype.animateClose = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              (e = this.modalEl.doc.body).addClass("hide-cursor");
              return [
                4,
                ((n = this.modalEl),
                (i = this.bgEl),
                new Promise(function (e) {
                  var t = n.offsetWidth - 1,
                    durationr0 = Math.clamp(0.35 * t, 100, 250);
                  fl(
                    n,
                    new cl({
                      duration: durationr0,
                      fn: easeOutSine,
                    }).addProp("transform", "", "translateX(-".concat(t, "px)"), ""),
                    function () {
                      return e(null);
                    },
                  );
                  fl(
                    i,
                    new cl({
                      duration: durationr0,
                      fn: easeOutSmooth,
                    }).addProp("opacity", null, "0", ""),
                  );
                })),
              ];
            case 1:
              t.sent();
              e.removeClass("hide-cursor");
              return [2];
          }
          var n, i;
        });
      });
    };
    return t;
  })(Modal),
  apiVersion = "1.9.14",
  b9 = "28.2.3";
function requireApiVersion(e) {
  return !pG(apiVersion, e);
}
callbackWithElectron(function (e) {
  apiVersion = e.ipcRenderer.sendSync("version");
});