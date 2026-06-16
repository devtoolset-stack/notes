var E2 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.shouldShowUnresolved = false;
      n.shouldShowMarkdown = true;
      n.shouldShowNonAttachments = true;
      n.shouldShowAlias = true;
      n.shouldShowNonImageAttachments = true;
      n.shouldShowImages = true;
      n.shouldShowAllTypes = false;
      n.shouldShowNonFileBookmarks = false;
      n.createButtonEl = null;
      n.allowCreateNewFile = false;
      n.context = "view";
      n.limit = 20;
      n.scope.register([], "Tab", function (e) {
        var t;
        if (!e.isComposing) {
          var i,
            r = n.chooser,
            o = r.values,
            a = r.selectedItem,
            s = n.inputEl.value,
            l = o[a];
          if (l) {
            var value = $x(
              (i = l).type === "file" || i.type === "alias"
                ? ou(i.file.path)
                : i.type === "unresolved"
                  ? i.linktext
                  : i.type === "bookmark"
                    ? i.bookmarkPath
                    : "",
              (t = l.match) === null || undefined === t ? undefined : t.matches,
            );
            value === s && (value += "/");
            n.inputEl.value = value;
            n.inputEl.trigger("input");
          }
          return !1;
        }
      });
      n.createButtonEl = createEl("button", "clickable-icon", function (e) {
        setIcon(e, "lucide-file-plus");
        e.addEventListener("click", function (e) {
          n.onChooseSuggestion(null, e);
          n.close();
        });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onInput = function () {
      var t, n;
      if ((e.prototype.onInput.call(this), Platform.isMobile && this.allowCreateNewFile)) {
        var i = this,
          r = i.createButtonEl,
          o = i.chooser,
          a = i.ctaEl,
          s = i.inputEl.value.trim();
        if (s === "") return void r.detach();
        if (!r.parentElement) {
          a.appendChild(r);
          fl(
            r,
            new cl({
              duration: 150,
              fn: "cubic-bezier(0, 0.55, 0.45, 1)",
            }).addProp("transform", "scale(0.10)", ""),
          );
        }
        var l =
          (n = (t = o.suggestions[0]) === null || undefined === t ? undefined : t.getText()) !== null && undefined !== n
            ? n
            : "";
        r.ariaDisabled = String(s.toLowerCase() === l.toLowerCase());
      }
    };
    Object.defineProperty(t.prototype, "supportsCreate", {
      get: function () {
        return this.allowCreateNewFile && this.shouldShowMarkdown;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.onNoSuggestion = function () {
      var e = this.inputEl.value.trim();
      if (e && this.supportsCreate) this.chooser.setSuggestions([null]);
      else {
        var t = e ? this.emptyStateText : i18nProxy.setting.thirdPartyPlugin.labelNoRecentFilesFound();
        this.chooser.setSuggestions(null);
        this.chooser.addMessage(t);
      }
    };
    t.prototype.getSuggestions = function (e) {
      var t = this;
      e = e.trim();
      var n = this.app,
        i = n.embedRegistry,
        r = n.workspace,
        o = n.vault,
        a = n.metadataCache,
        s = n.viewRegistry,
        l = [],
        c = this.shouldShowAllTypes,
        u = this.context === "view" ? s : i,
        h = function (e) {
          return e.extension === "md"
            ? t.shouldShowMarkdown
            : e.extension === "canvas" || e.extension === "base"
              ? t.shouldShowNonAttachments
              : IMAGE_EXTENSIONS.contains(e.extension)
                ? t.shouldShowImages
                : !!c || (!!t.shouldShowNonImageAttachments && u.isExtensionRegistered(e.extension));
        };
      if (!e) {
        for (
          var p = 0,
            d = r.getRecentFiles({
              showNonImageAttachments: this.shouldShowNonImageAttachments,
              showImages: this.shouldShowImages,
              showNonAttachments: this.shouldShowNonAttachments,
              showMarkdown: this.shouldShowMarkdown,
            });
          p < d.length;
          p++
        ) {
          var f = d[p];
          if ((fileb0 = o.getAbstractFileByPath(f)) instanceof TFile) {
            a.isUserIgnored(fileb0.path) ||
              (h(fileb0) &&
                l.push({
                  type: "file",
                  file: fileb0,
                  match: null,
                }));
          }
        }
        return l;
      }
      var m,
        g = o.getFiles().filter(function (e) {
          return h(e);
        });
      m = g.length < 1e4 ? prepareFuzzySearch(e) : prepareSimpleSearch(e);
      for (var v = 0, y = g; v < y.length; v++) {
        var fileb0 = y[v],
          downranked = a.isUserIgnored(fileb0.path);
        if (
          ((match = cT(m, C2(fileb0))) &&
            (downranked && (match.score -= 10),
            l.push({
              type: "file",
              file: fileb0,
              match: match,
              downranked: downranked,
            })),
          this.shouldShowAlias)
        ) {
          var k = a.getFileCache(fileb0);
          if (k) {
            var C = parseFrontMatterAliases(k.frontmatter);
            if (C)
              for (var E = 0, S = C; E < S.length; E++) {
                var alias = S[E],
                  matchx0 = m(alias);
                if (matchx0) {
                  downranked && (matchx0.score -= 10);
                  l.push({
                    type: "alias",
                    alias: alias,
                    file: fileb0,
                    match: matchx0,
                    downranked: downranked,
                  });
                }
              }
          }
        }
      }
      if (this.shouldShowUnresolved) {
        var T = a.unresolvedLinks,
          D = [];
        for (var A in T)
          if (T.hasOwnProperty(A)) {
            var P = T[A];
            for (var L in P)
              if (P.hasOwnProperty(L)) {
                D.push(L);
              }
          }
        for (var I = 0, O = (D = Array.from(new Set(D))); I < O.length; I++) {
          var match,
            linktext = O[I];
          if ((match = m(linktext))) {
            l.push({
              type: "unresolved",
              linktext: linktext,
              match: match,
            });
          }
        }
      }
      var R = this.app.internalPlugins.getEnabledPluginById("bookmarks");
      if (R) {
        var B = function (item, t) {
          var bookmarkPath = t + R.getItemTitle(item),
            matchi0 = m(bookmarkPath);
          if (matchi0) {
            l.push({
              type: "bookmark",
              match: matchi0,
              item: item,
              bookmarkPath: bookmarkPath,
            });
          }
        };
        w2(R.items, function (e, n) {
          if (e.type !== "file" || e.subpath) {
            if (t.shouldShowNonFileBookmarks && e.type !== "group") {
              B(e, n);
            }
          } else {
            var i = t.app.vault.getAbstractFileByPath(e.path);
            if (i instanceof TFile && h(i)) {
              B(e, n);
            }
          }
        });
      }
      sortSearchResults(l);
      return l;
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n = this;
      t.addClass("mod-complex");
      var i = t.createDiv("suggestion-content"),
        r = t.createDiv("suggestion-aux");
      if (!e) {
        var texto0 = this.inputEl.value;
        i.createDiv({
          cls: "suggestion-title",
          text: texto0,
        });
        return void r.createSpan({
          cls: "suggestion-action",
          text: i18nProxy.interface.labelEnterToCreate(),
        });
      }
      if ((e.downranked && t.addClass("mod-downranked"), e.type === "file")) {
        renderResults(i.createDiv("suggestion-title"), C2(e.file), e.match);
        r.createSpan({
          cls: "suggestion-flair",
        });
      } else if (e.type === "alias") {
        renderResults(i.createDiv("suggestion-title"), e.alias, e.match);
        i.createDiv({
          cls: "suggestion-note",
          text: C2(e.file),
        });
        r.createSpan(
          {
            cls: "suggestion-flair",
          },
          function (e) {
            setIcon(e, "lucide-forward");
            setTooltip(e, i18nProxy.interface.tooltip.alias());
          },
        );
      } else if (e.type === "unresolved") {
        renderResults((a = i.createDiv("suggestion-title")), e.linktext, e.match);
        r.createSpan(
          {
            cls: "suggestion-flair",
          },
          function (e) {
            setIcon(e, "lucide-file-plus");
            setTooltip(e, i18nProxy.interface.tooltip.notCreatedYet());
          },
        );
      } else if (e.type === "bookmark") {
        var a = i.createDiv("suggestion-title"),
          s = i.createDiv("suggestion-note");
        renderResults(a, e.bookmarkPath, e.match);
        r.createSpan(
          {
            cls: "suggestion-flair",
          },
          function (t) {
            var i;
            if (e.item.type === "file") {
              setIcon(t, "lucide-bookmark");
              s.setText(ou(e.item.path) + ((i = e.item.subpath) !== null && undefined !== i ? i : ""));
            } else if (e.item.type === "folder") {
              setIcon(t, "lucide-bookmark");
              s.setText(ou(e.item.path));
            } else if (e.item.type === "search") {
              setIcon(t, "lucide-search");
              s.setText(e.item.query);
            } else if (e.item.type === "graph") {
              setIcon(t, "lucide-git-fork");
              s.detach();
            } else if (e.item.type === "url") {
              var r = n.app.internalPlugins.getEnabledPluginById("webviewer");
              r ? (t.addClass("webviewer-favicon-container"), r.db.setIcon(t, e.item.url)) : setIcon(t, "globe-2");
              s.setText(e.item.url);
            }
          },
        );
      }
    };
    return t;
  })(SuggestModal),
  ShareReceiver = (function () {
    function e(app) {
      this.app = app;
    }
    e.prototype.setupNative = function () {
      var e = this;
      if (isNotWeb) {
        capacitorAppPlugin.addListener("appShareIntent", function (t) {
          return __awaiter(e, undefined, undefined, function () {
            return __generator(this, function (e) {
              switch (e.label) {
                case 0:
                  clearFocusAndSelection();
                  return t.type !== "text" ? [3, 2] : [4, this.handleShareText(t.text)];
                case 1:
                  e.sent();
                  e.label = 2;
                case 2:
                  return t.type !== "files" ? [3, 4] : [4, this.handleShareFiles(t.files)];
                case 3:
                  e.sent();
                  e.label = 4;
                case 4:
                  return [2];
              }
            });
          });
        });
      }
    };
    e.prototype.setupWorkspace = function () {
      var e = this.app,
        t = e.workspace;
      t.on("receive-text-menu", function (n, i) {
        var r = t.getActiveViewOfType(MarkdownView);
        r &&
          n.addItem(function (t) {
            return t
              .setSection("options")
              .setTitle(
                i18nProxy.interface.mobile.actionInsertTextIntoFile({
                  filename: r.file.basename,
                }),
              )
              .setIcon("lucide-file")
              .onClick(function () {
                var t = "\n" + i + "\n";
                r.getMode() === "preview" ? e.fileManager.insertIntoFile(r.file, t) : r.editor.insertText(t);
              });
          });
        n.addItem(function (t) {
          return t
            .setSection("options")
            .setTitle(i18nProxy.interface.mobile.actionChooseFileToInsert())
            .setIcon("lucide-navigation")
            .onClick(function () {
              new M2(e, i).open();
            });
        });
      });
      t.on("receive-files-menu", function (n, i) {
        var r = t.getActiveViewOfType(MarkdownView);
        if (r) {
          n.addItem(function (t) {
            return t
              .setTitle(
                i18nProxy.interface.mobile.actionInsertLinkIntoFile({
                  filename: r.file.basename,
                }),
              )
              .setIcon("lucide-file")
              .onClick(function () {
                var t = i.map(function (t) {
                  return e.fileManager.generateMarkdownLink(t, r.file.path);
                });
                r.editor.insertText("\n" + t.join("\n") + "\n");
              });
          });
        }
      });
    };
    e.prototype.handleShareText = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          t = new Menu()
            .addSections(["title", "options", "danger"])
            .addItem(function (t) {
              return t
                .setSection("title")
                .setTitle(hc(e, 300))
                .setIcon("lucide-list-end")
                .setIsLabel(!0)
                .titleEl.addClass("u-muted", "u-small");
            })
            .addItem(function (e) {
              return e
                .setSection("options")
                .setTitle(i18nProxy.interface.mobile.actionInsertTextDesc())
                .removeIcon()
                .setIsLabel(!0)
                .titleEl.addClass("u-muted", "u-small");
            });
          this.app.workspace.trigger("receive-text-menu", t, e);
          t.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(i18nProxy.dialogue.buttonCancel())
              .setIcon("lucide-x")
              .onClick(function () {
                return null;
              });
          }).showAtPosition({
            x: 0,
            y: 0,
          });
          return [2];
        });
      });
    };
    e.prototype.handleShareFiles = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t = this;
        return __generator(this, function (n) {
          new Menu()
            .addItem(function (t) {
              return t
                .setTitle(
                  createFragment(function (t) {
                    for (var n = 0, i = e; n < i.length; n++) {
                      var r = i[n];
                      t.createDiv({
                        text: r.name,
                      });
                    }
                  }),
                )
                .removeIcon()
                .setIsLabel(!0)
                .titleEl.addClass("u-muted", "u-small");
            })
            .addSeparator()
            .addItem(function (n) {
              return n
                .setTitle(i18nProxy.interface.mobile.actionImport())
                .setIcon("lucide-files")
                .onClick(function () {
                  return t.importFiles(e);
                });
            })
            .addItem(function (e) {
              return e
                .setTitle(i18nProxy.dialogue.buttonCancel())
                .setIcon("lucide-x")
                .onClick(function () {
                  return null;
                });
            })
            .showAtPosition({
              x: 0,
              y: 0,
            });
          return [2];
        });
      });
    };
    e.prototype.importFiles = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              t = [];
              n = new Notice(i18nProxy.interface.mobile.msgImporting(), 0);
              i = 0;
              r = this.app.vault;
              o = 0;
              a = e;
              g.label = 1;
            case 1:
              if (!(o < a.length)) return [3, 12];
              s = a[o];
              g.label = 2;
            case 2:
              g.trys.push([2, 10, , 11]);
              e.length > 1 &&
                n.setMessage(i18nProxy.interface.mobile.msgImporting() + " (".concat(i, "/").concat(e.length, ")"));
              return [4, fetch(CapacitorCore.Capacitor.convertFileSrc(s.uri))];
            case 3:
              return [4, g.sent().arrayBuffer()];
            case 4:
              l = g.sent();
              c = s.name || getFilename(s.uri);
              u = Qc(c);
              h = getExtension(c);
              p = undefined;
              return h === "md"
                ? [3, 6]
                : [4, r.getAvailablePathForAttachments(u, h, this.app.workspace.getActiveFile())];
            case 5:
              p = g.sent();
              return [3, 8];
            case 6:
              return [4, r.getAvailablePath(u, h)];
            case 7:
              p = g.sent();
              g.label = 8;
            case 8:
              return [4, r.createBinary(p, l)];
            case 9:
              d = g.sent();
              t.push(d);
              i++;
              return [3, 11];
            case 10:
              f = g.sent();
              n.hide();
              new Notice(
                i18nProxy.interface.mobile.msgFailedToImportFile({
                  filename: s.name,
                }),
              );
              new Notice(f.toString());
              return [2];
            case 11:
              o++;
              return [3, 1];
            case 12:
              n.hide();
              (m = new Menu()
                .addItem(function (e) {
                  return e.setTitle(i18nProxy.interface.mobile.msgImportSuccess()).removeIcon().setIsLabel(!0);
                })
                .addSeparator()).addItem(function (e) {
                return e
                  .setTitle(i18nProxy.dialogue.buttonDone())
                  .setIcon("lucide-check")
                  .onClick(function () {
                    return null;
                  });
              });
              this.app.workspace.trigger("receive-files-menu", m, t);
              m.showAtPosition({
                x: 0,
                y: 0,
              });
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  M2 = (function (e) {
    function t(t, textn0) {
      var i = e.call(this, t) || this;
      i.emptyStateText = i18nProxy.plugins.quickSwitcher.labelNoNoteCreateNew();
      i.allowCreateNewFile = true;
      i.text = textn0;
      i.shouldShowUnresolved = true;
      i.shouldShowNonImageAttachments = false;
      i.shouldShowImages = false;
      i.shouldShowNonAttachments = false;
      i.shouldShowAllTypes = false;
      i.setPlaceholder("Choose file to insert");
      i.setInstructions([
        {
          command: "↑↓",
          purpose: "to navigate",
        },
        {
          command: "↵",
          purpose: "to select",
        },
        {
          command: "esc",
          purpose: "to dismiss",
        },
      ]);
      return i;
    }
    __extends(t, e);
    t.prototype.onChooseSuggestion = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t = null;
              n = this.app;
              r.label = 1;
            case 1:
              r.trys.push([1, 7, , 8]);
              return e ? [3, 3] : [4, n.fileManager.createNewMarkdownFileFromLinktext(this.inputEl.value, "")];
            case 2:
              t = r.sent();
              return [3, 6];
            case 3:
              return e.type !== "unresolved"
                ? [3, 5]
                : [4, n.fileManager.createNewMarkdownFileFromLinktext(e.linktext, "")];
            case 4:
              t = r.sent();
              return [3, 6];
            case 5:
              (e.type !== "file" && e.type !== "alias") || (t = e.file);
              r.label = 6;
            case 6:
              return [3, 8];
            case 7:
              i = r.sent();
              new Notice(i.toString());
              return [2];
            case 8:
              return t ? [4, this.app.fileManager.insertIntoFile(t, this.text)] : [3, 11];
            case 9:
              r.sent();
              return [4, this.app.workspace.getLeaf().openFile(t)];
            case 10:
              r.sent();
              r.label = 11;
            case 11:
              return [2];
          }
        });
      });
    };
    return t;
  })(E2),
  x2 = require("./modules/9547.js"),
  T2 = x2.default,
  D2 = "audio/mp4",
  A2 = (function () {
    function e() {
      this.id = "audio-recorder";
      this.name = i18nProxy.plugins.audioRecorder.name();
      this.description = i18nProxy.plugins.audioRecorder.desc();
      this.app = null;
      this.plugin = null;
      this.recording = false;
      this.recorder = null;
      this.extension = "";
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(
        i18nProxy.plugins.audioRecorder.actionToggle(),
        "lucide-mic",
        this.onRecordAudio.bind(this),
      );
      plugin.registerGlobalCommand({
        id: "audio-recorder:start",
        name: i18nProxy.plugins.audioRecorder.actionStart(),
        icon: "lucide-play-circle",
        checkCallback: function (e) {
          return !n.recording && (e || n.onStartRecording(), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "audio-recorder:stop",
        name: i18nProxy.plugins.audioRecorder.actionStop(),
        icon: "lucide-stop-circle",
        checkCallback: function (e) {
          return !!n.recording && (e || n.onStopRecording(), !0);
        },
      });
    };
    e.prototype.checkPermission = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return Platform.isDesktopApp && Bl === "macOS"
                ? (e = loadModule("electron"))
                  ? ((t = e.remote.systemPreferences),
                    (n = t.getMediaAccessStatus("microphone")),
                    ["denied", "restricted", "unknown"].contains(n)
                      ? (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgAccessDenied(), !0), [2, !1])
                      : [3, 1])
                  : (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgAccessDenied(), !0), [2, !1])
                : [3, 5];
            case 1:
              return n !== "not-determined"
                ? [3, 3]
                : (this.showRecordingMessage(i18nProxy.plugins.audioRecorder.msgPendingGrant(), !1),
                  [4, t.askForMediaAccess("microphone")]);
            case 2:
              return [2, i.sent()];
            case 3:
              if (n === "granted") return [2, !0];
              i.label = 4;
            case 4:
              return [2, !1];
            case 5:
              return [2, !0];
          }
        });
      });
    };
    e.prototype.onRecordAudio = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.checkPermission()];
            case 1:
              return e.sent() ? (this.recording ? [3, 3] : [4, this.onStartRecording()]) : [2];
            case 2:
              e.sent();
              return [3, 4];
            case 3:
              this.onStopRecording();
              e.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    e.prototype.onStartRecording = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              if (isIOSPlatform && !navigator.mediaDevices) {
                new Notice("This functionality requires iOS 14.5.");
                return [2];
              }
              i.label = 1;
            case 1:
              i.trys.push([1, 4, , 5]);
              return [
                4,
                navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: false,
                }),
              ];
            case 2:
              e = i.sent();
              return [4, this.startRecording(e)];
            case 3:
              i.sent();
              return [3, 5];
            case 4:
              (t = i.sent()).message.contains("Requested device not found") && this.plugin.addedButtonEls.length > 0
                ? ((n = i18nProxy.plugins.audioRecorder.msgNoMicrophone()), this.showRecordingMessage(n, !0))
                : (t.message.contains("denied") && new Notice(t.message), console.error(t));
              return [2];
            case 5:
              this.recording = true;
              this.plugin.addedButtonEls.forEach(function (e) {
                setIcon(e, "lucide-mic");
                e.addClass("is-active");
              });
              return [2];
          }
        });
      });
    };
    e.prototype.onStopRecording = function () {
      this.recording = false;
      this.recorder.stop();
      this.plugin.addedButtonEls.forEach(function (e) {
        e.removeClass("is-active");
      });
    };
    e.prototype.startRecording = function (e) {
      var t = this,
        n = [],
        mimeType = 'audio/webm;codecs="opus"';
      this.extension = "webm";
      MediaRecorder.isTypeSupported(D2) && ((mimeType = D2), (this.extension = "m4a"));
      this.recorder = new MediaRecorder(e, {
        mimeType: mimeType,
      });
      this.recorder.addEventListener("dataavailable", function (e) {
        if (e.data.size > 0) {
          n.push(e.data);
        }
      });
      this.recorder.addEventListener("stop", function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, o, a;
          return __generator(this, function (s) {
            switch (s.label) {
              case 0:
                if (
                  ((this.recorder = null),
                  e.getTracks().forEach(function (e) {
                    e.stop();
                  }),
                  (t = new Blob(n, {
                    type: mimeType,
                  })),
                  this.extension !== "webm")
                )
                  return [3, 4];
                s.label = 1;
              case 1:
                s.trys.push([1, 3, , 4]);
                return [4, T2()(t)];
              case 2:
                t = s.sent();
                return [3, 4];
              case 3:
                o = s.sent();
                console.error(o);
                return [3, 4];
              case 4:
                a = this.saveRecording;
                return [4, t.arrayBuffer()];
              case 5:
                return [4, a.apply(this, [s.sent()])];
              case 6:
                s.sent();
                r && r.release();
                return [2];
            }
          });
        });
      });
      this.recorder.start();
      var r = null;
      if (isNotWeb) {
        r = requestKeepAwake();
      }
    };
    e.prototype.saveRecording = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              t = this.app;
              n = t.workspace;
              i = "Recording " + window.moment().format("YYYYMMDDHHmmss");
              r = n.getActiveFile();
              o = n.getActiveViewOfType(MarkdownView);
              return [4, t.vault.getAvailablePathForAttachments(i, this.extension, r)];
            case 1:
              a = c.sent();
              return [4, t.vault.createBinary(a, e)];
            case 2:
              s = c.sent();
              return o
                ? ((l = this.app.fileManager.generateMarkdownLink(s, o.file.path)),
                  o.editor.replaceSelection("\n".concat(l, "\n")),
                  [2])
                : [
                    4,
                    n.getUnpinnedLeaf().openFile(s, {
                      active: !0,
                    }),
                  ];
            case 3:
              c.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.showRecordingMessage = function (e, t) {
      if (this.plugin.addedButtonEls.length > 0) {
        displayTooltip(this.plugin.addedButtonEls[0], e, {
          placement: "right",
          classes: t ? ["mod-error"] : [],
        });
      }
    };
    return e;
  })(),
  P2 = i18nProxy.plugins.bookmarks,
  L2 = i18nProxy.plugins.fileExplorer,
  source = "bookmarks",
  O2 = (function (e) {
    function t(view, tree) {
      var i = e.call(this) || this;
      i.info = {
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
      i.renameScope = null;
      i.tree = tree;
      i.view = view;
      i.selfEl.addClass("bookmark");
      i.selfEl.addEventListener("contextmenu", i.onContextMenu.bind(i));
      i.titleEl = i.innerEl.createSpan({
        cls: "tree-item-inner-text",
      });
      var r = (i.renameScope = new Scope(view.app.scope));
      r.register([], "Enter", function () {
        i.stopRename(!0);
      });
      r.register([], "Escape", function () {
        i.stopRename(!1);
      });
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "path", {
      get: function () {
        for (var e = this.view.plugin, t = [], n = this; n; ) {
          t.push(e.getItemTitle(n.item));
          n = n.parent instanceof F2 ? n.parent : null;
        }
        return t.reverse().join("/");
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.startRename = function () {
      var e = this,
        t = e.selfEl,
        n = e.titleEl,
        i = e.tree,
        r = e.view;
      t.addClass("is-being-renamed");
      i.setFocusedItem(this, !0);
      n.setAttribute("contenteditable", "true");
      focusAndSelectContent(n);
      r.app.keymap.pushScope(this.renameScope);
    };
    t.prototype.update = function () {
      var e = this.item,
        t = this.view,
        n = t.plugin.getItemTitle(e);
      this.titleEl.setText(n);
      this.el.setAttr("data-path", this.path);
      var i = false;
      e.type === "file" && (this.selfEl.toggle(!!t.app.vault.getAbstractFileByPath(e.path)), (i = true));
      this.tree.infinityScroll.invalidate(this, i);
    };
    t.prototype.setActive = function (e) {
      this.selfEl.toggleClass("is-active", e);
    };
    t.prototype.stopRename = function (e) {
      var t = this,
        n = t.item,
        i = t.selfEl,
        r = t.view;
      if (e) {
        var title = this.titleEl.textContent.trim();
        title ? ((n.title = title), r.plugin.onItemsChanged(!0)) : this.update();
      } else this.update();
      this.titleEl.removeAttribute("contenteditable");
      i.removeClass("is-being-renamed");
      r.app.keymap.popScope(this.renameScope);
    };
    t.prototype.onTitleBlur = function (e) {
      this.stopRename(!0);
    };
    t.prototype.onContextMenu = function (e) {
      var t = this,
        n = this.view,
        i = n.app,
        r = n.tree,
        o = n.plugin,
        a = Menu.forEvent(e)
          .setParentElement(this.selfEl)
          .addSections(["title", "open", "action", "view", "info", "", "danger"]);
      if (r.selectedDoms.size > 1 && r.selectedDoms.has(this)) {
        var s = Array.from(r.selectedDoms).map(function (e) {
          return e.item;
        });
        a.addItem(function (e) {
          return e
            .setSection("open")
            .setTitle(i18nProxy.interface.menu.openInNewTab())
            .setIcon("lucide-file-plus")
            .onClick(function (e) {
              return o.openBookmarks(s, "tab");
            });
        });
        Platform.canSplit &&
          a.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openToTheRight())
              .setIcon("lucide-separator-vertical")
              .onClick(function (e) {
                return o.openBookmarks(s, "split");
              });
          });
        Platform.canPopoutWindow &&
          a.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openInNewWindow())
              .setIcon("lucide-picture-in-picture-2")
              .onClick(function (e) {
                return o.openBookmarks(s, "window");
              });
          });
        a.addItem(function (e) {
          return e
            .setSection("danger")
            .setTitle(P2.menuOptRemove())
            .setIcon("lucide-trash-2")
            .onClick(function () {
              r.selectedDoms.forEach(function (e) {
                o.removeItem(e.item);
              });
            });
        });
        i.workspace.trigger("bookmarks:bookmarks-menu", a, s);
      } else {
        if (
          (a
            .addItem(function (e) {
              return e
                .setSection("action")
                .setTitle(P2.menuOptRename())
                .setIcon("lucide-pencil")
                .onClick(function (e) {
                  return t.startRename();
                });
            })
            .addItem(function (e) {
              return e
                .setSection("danger")
                .setTitle(P2.menuOptRemove())
                .setIcon("lucide-trash-2")
                .onClick(function () {
                  t.view.plugin.removeItem(t.item);
                });
            }),
          this.item.type === "group")
        ) {
          var l = this.item,
            c = this.item.items;
          a.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(P2.actionNewBookmark())
              .setIcon("lucide-bookmark-plus")
              .onClick(function (t) {
                var n = b2(i.workspace.getMostRecentLeaf());
                if (e) {
                  new F0(o, n, !1).setBookmarkGroup(l).open();
                }
              });
          })
            .addItem(function (e) {
              return e
                .setSection("action")
                .setIcon("lucide-folder-plus")
                .setTitle(P2.actionNewGroup())
                .onClick(function () {
                  return t.view.createNewGroup(l);
                });
            })
            .addItem(function (e) {
              return e
                .setSection("open")
                .setTitle(i18nProxy.interface.menu.openInNewTab())
                .setIcon("lucide-file-plus")
                .onClick(function (e) {
                  return o.openBookmarks(c, "tab");
                });
            });
          Platform.canSplit &&
            a.addItem(function (e) {
              return e
                .setSection("open")
                .setTitle(i18nProxy.interface.menu.openToTheRight())
                .setIcon("lucide-separator-vertical")
                .onClick(function (e) {
                  return o.openBookmarks(c, "split");
                });
            });
          Platform.canPopoutWindow &&
            a.addItem(function (e) {
              return e
                .setSection("open")
                .setTitle(i18nProxy.interface.menu.openInNewWindow())
                .setIcon("lucide-picture-in-picture-2")
                .onClick(function (e) {
                  return o.openBookmarks(c, "window");
                });
            });
        } else {
          (this.item.type !== "file" && this.item.type !== "graph") ||
            (a.addItem(function (e) {
              return e
                .setSection("open")
                .setTitle(i18nProxy.interface.menu.openInNewTab())
                .setIcon("lucide-file-plus")
                .onClick(function (e) {
                  return o.openBookmark(t.item, "tab");
                });
            }),
            Platform.canSplit &&
              a.addItem(function (e) {
                return e
                  .setSection("open")
                  .setTitle(i18nProxy.interface.menu.openToTheRight())
                  .setIcon("lucide-separator-vertical")
                  .onClick(function (e) {
                    return o.openBookmark(t.item, "split");
                  });
              }),
            Platform.canPopoutWindow &&
              a.addItem(function (e) {
                return e
                  .setSection("open")
                  .setTitle(i18nProxy.interface.menu.openInNewWindow())
                  .setIcon("lucide-picture-in-picture-2")
                  .onClick(function (e) {
                    return o.openBookmark(t.item, "window");
                  });
              }));
          a.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(P2.menuOptEdit())
              .setIcon("lucide-wrench")
              .onClick(function (e) {
                new F0(t.view.plugin, t.item, !0).open();
              });
          });
        }
        if (this.item.type === "file" || this.item.type === "folder") {
          var u = i.vault.getAbstractFileByPath(this.item.path);
          if (u) {
            a.addItem(function (e) {
              return e
                .setSection("view")
                .setTitle(i18nProxy.plugins.fileExplorer.actionRevealFile())
                .setIcon("lucide-folder-open")
                .onClick(function (e) {
                  i.internalPlugins.getEnabledPluginById("file-explorer").revealInFolder(u);
                });
            });
          }
        }
        i.workspace.trigger("bookmarks:bookmarks-menu", a, [this.item]);
      }
    };
    return t;
  })(w_),
  F2 = (function (e) {
    function t(view, n, item) {
      var r = e.call(this, view, n) || this;
      r.vChildren = new YF(r);
      r.pusherEl = rN();
      r.view = view;
      r.item = item;
      r.setCollapsible(!0);
      r.setClickable(!0);
      r.titleEl.addEventListener("blur", r.onTitleBlur.bind(r));
      return r;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      if (!this.tree.handleItemSelection(e, this)) {
        this.onCollapseClick(e);
      }
    };
    t.prototype.refreshChildren = function () {
      var e = this.view,
        n = this.item;
      this.vChildren.clear();
      this.tree.infinityScroll.invalidate(this);
      for (var i = 0, r = n.items; i < r.length; i++) {
        var o = r[i],
          a = e.getItemDom(o);
        this.vChildren.addChild(a);
        a.update();
        a instanceof t && a.refreshChildren();
      }
    };
    t.prototype.onCollapseClick = function (t) {
      e.prototype.onCollapseClick.call(this, t);
      this.tree.requestSaveFolds();
    };
    t.prototype.updateCollapsed = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              n = this.tree.infinityScroll;
              this.collapsed || (r = (i = this.tree).handleCollapseAll) === null || undefined === r || r.call(i, !1);
              n.invalidate(this, !0);
              return [4, e.prototype.updateCollapsed.call(this, t)];
            case 1:
              o.sent();
              n.invalidate(this);
              return [2];
          }
        });
      });
    };
    return t;
  })(k_(O2)),
  N2 = (function (e) {
    function t(t, n, item) {
      var r = e.call(this, t, n) || this;
      if (
        ((r.app = t.app),
        (r.item = item),
        (r.iconEl = r.selfEl.createDiv({
          cls: "tree-item-icon",
          prepend: true,
        })),
        r.setClickable(!0),
        r.constructDom(),
        item.type === "file" && !item.subpath)
      ) {
        var o = t.app.workspace.getActiveFile();
        r.setActive(item.path === (o == null ? undefined : o.path));
      }
      return r;
    }
    __extends(t, e);
    t.prototype.onFileMouseover = function (event) {
      var t;
      if (!Nc(event) && this.item.type === "file") {
        var n = this.view.app,
          i = n.vault.getAbstractFileByPath(this.item.path);
        if (i instanceof TFile) {
          n.workspace.trigger("hover-link", {
            event: event,
            source: source,
            hoverParent: this,
            targetEl: this.selfEl,
            linktext: i.path + ((t = this.item.subpath) !== null && undefined !== t ? t : ""),
          });
        }
      }
    };
    t.prototype.onSelfClick = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          this.tree.handleItemSelection(e, this) ||
            this.view.plugin.openBookmark(this.item, Keymap.isModEvent(e), {
              eState: {
                focus: !0,
              },
            });
          return [2];
        });
      });
    };
    t.prototype.constructDom = function () {
      var e,
        t,
        n = this.item;
      if (n.type === "file") {
        n.path.endsWith(".canvas")
          ? setIcon(this.iconEl, "lucide-layout-dashboard")
          : ((e = n.subpath) === null || undefined === e ? undefined : e.startsWith("#^"))
            ? setIcon(this.iconEl, "lucide-toy-brick")
            : ((t = n.subpath) === null || undefined === t ? undefined : t.startsWith("#"))
              ? setIcon(this.iconEl, "lucide-heading")
              : setIcon(this.iconEl, "lucide-file");
        this.selfEl.addEventListener("mouseover", this.onFileMouseover.bind(this));
      } else if (n.type === "folder") setIcon(this.iconEl, "lucide-folder");
      else if (n.type === "search") setIcon(this.iconEl, "lucide-search");
      else if (n.type === "graph") setIcon(this.iconEl, "lucide-git-fork");
      else if (n.type === "url") {
        var i = this.app.internalPlugins.getEnabledPluginById("webviewer");
        i ? i.db.setIcon(this.iconEl, n.url) : setIcon(this.iconEl, "globe-2");
      }
      this.titleEl.addEventListener("blur", this.onTitleBlur.bind(this));
    };
    return t;
  })(O2),
  R2 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.plugin = plugin;
      i.icon = "lucide-bookmark";
      i.itemDoms = new WeakMap();
      i.collapseOrExpandAllEl = null;
      i.requestUpdate = debounce(i.update.bind(i), 50);
      i.emptyEl = createDiv({
        cls: "pane-empty bookmarks-pane-empty",
        text: P2.labelNoBookmarks(),
      });
      i.invalidStateEl = createDiv(
        {
          cls: "pane-empty mod-error",
        },
        function (e) {
          e.createDiv({
            text: P2.labelInvalidData(),
          });
          e.createDiv({
            text: P2.labelInvalidDataDesc(),
          });
        },
      );
      i.scope = new Scope(i.app.scope);
      var r = new s0(i.app, i.containerEl);
      i.tree = new z0(i, {
        app: i.app,
        containerEl: i.contentEl,
        id: source,
        scope: i.scope,
        getNodeId: i.getNodeId.bind(i),
        handleDeleteSelectedItems: i.onDeleteSelectedItems.bind(i),
        handleRenameFocusedItem: i.onRenameKey.bind(i),
        handleCollapseAll: i.handleCollapseAll.bind(i),
      });
      r.addNavButton("lucide-bookmark-plus", P2.actionNewBookmark(), function () {
        var e = b2(i.app.workspace.getMostRecentLeaf());
        if (e) {
          new F0(i.plugin, e, !1).open();
        }
      });
      r.addNavButton("lucide-folder-plus", P2.actionNewGroup(), function () {
        return i.createNewGroup();
      });
      i.collapseOrExpandAllEl = r.addNavButton("lucide-chevrons-down-up", P2.actionCollapseAll(), function () {
        return i.tree.toggleCollapseAll();
      });
      i.containerEl.addEventListener("contextmenu", i.onContextMenu.bind(i));
      i.attachDropHandler();
      return i;
    }
    __extends(t, e);
    t.prototype.load = function () {
      var t = this;
      e.prototype.load.call(this);
      var n = this.app;
      this.registerEvent(n.vault.on("create", this.onFileCreate.bind(this), this));
      this.registerEvent(n.vault.on("delete", this.onFileDelete.bind(this), this));
      this.registerEvent(this.plugin.on("changed", this.requestUpdate, this));
      this.registerEvent(n.metadataCache.on("finished", this.requestUpdate, this));
      this.registerEvent(n.workspace.on("file-open", this.onFileOpen, this));
      this.app.workspace.onLayoutReady(function () {
        t.onFileOpen(n.workspace.getActiveFile());
        t.update();
        t.tree.loadFolds();
      });
    };
    t.prototype.onFileCreate = function (e) {
      QF(this.tree.root, function (t) {
        if (!((t.item.type !== "file" && t.item.type !== "folder") || t.item.path !== e.path)) {
          t.update();
        }
      });
    };
    t.prototype.onFileDelete = function (e) {
      QF(this.tree.root, function (t) {
        if (!((t.item.type !== "file" && t.item.type !== "folder") || t.item.path !== e.path)) {
          t.update();
        }
      });
    };
    t.prototype.handleCollapseAll = function (isAllCollapsed) {
      this.tree.isAllCollapsed = isAllCollapsed;
      isAllCollapsed
        ? (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-up-down"),
          setTooltip(this.collapseOrExpandAllEl, L2.actionExpandAll()))
        : (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-down-up"),
          setTooltip(this.collapseOrExpandAllEl, L2.actionCollapseAll()));
    };
    t.prototype.getDisplayText = function () {
      return P2.name();
    };
    t.prototype.getViewType = function () {
      return source;
    };
    t.prototype.isItem = function (e) {
      return e instanceof O2;
    };
    Object.defineProperty(t.prototype, "root", {
      get: function () {
        return this.tree.infinityScroll.rootEl;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.attachDropHandler = function () {
      var e = this,
        dropEffect = "move";
      this.app.dragManager.handleDrop(this.containerEl, function (n, i, r) {
        var o = q0(n, e.tree),
          a = [];
        if (i.source === "bookmarks" && i.type === "bookmarks") {
          a = i.items;
        }
        var hoverEl = G0(e.tree, o, a, r);
        if (!o) return null;
        if (!r) {
          var l = function (t) {
            var n = o.parentNode instanceof F2 ? o.parentNode.item : null;
            e.plugin.moveItem(t, n, o.idx);
          };
          if (i.type === "bookmarks")
            for (var c = 0, u = i.items; c < u.length; c++) {
              var h = u[c];
              if (o.parentNode !== h) {
                l(h.item);
              }
            }
          else if (i.type === "file") {
            dropEffect = "copy";
            l(d2(i.file));
          } else if (i.type === "heading") {
            dropEffect = "copy";
            var p = "#" + stripHeadingForLink(i.heading.heading);
            l(d2(i.file, p));
          } else if (i.type === "link") {
            if (i.file) {
              dropEffect = "copy";
              p = parseLinktext(i.linktext).subpath;
              var d = d2(i.file, p);
              d.title = i.title;
              l(d);
            }
          } else if (i.type === "folder") {
            dropEffect = "copy";
            k2([i.file]).forEach(l);
          } else if (i.type === "files") {
            dropEffect = "copy";
            k2(i.files).forEach(l);
          }
        }
        return {
          dropEffect: dropEffect,
          hoverEl: hoverEl,
          hoverClass: "is-active",
        };
      });
    };
    t.prototype.onRenameKey = function (e) {
      e.preventDefault();
      this.tree.isItem(this.tree.focusedItem) && this.tree.focusedItem.startRename();
    };
    t.prototype.onDeleteSelectedItems = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          e.preventDefault();
          t = this.tree;
          n = t.focusedItem;
          (i = t.selectedDoms).size > 0
            ? i.forEach(function (e) {
                r.plugin.removeItem(e.item);
              })
            : n instanceof N2 && this.plugin.removeItem(n.item);
          return [2];
        });
      });
    };
    t.prototype.getNodeId = function (e) {
      return "item-".concat(e.item.ctime);
    };
    t.prototype.createNewGroup = function (e) {
      var t = m2();
      (e ? e.items : this.plugin.items).push(t);
      this.plugin.saveData();
      this.update();
      this.getItemDom(t).startRename();
    };
    t.prototype.onContextMenu = function (e) {
      var t = this;
      if (!e.defaultPrevented) {
        new Menu()
          .addItem(function (e) {
            return e
              .setIcon("lucide-folder-plus")
              .setTitle(P2.actionNewGroup())
              .onClick(function () {
                return t.createNewGroup();
              });
          })
          .showAtMouseEvent(e);
      }
    };
    t.prototype.onFileOpen = function (e) {
      QF(this.root, function (t) {
        if (t.item.type === "file") {
          var n = e && t.item.path === e.path && !t.item.subpath;
          t.setActive(n);
        }
      });
    };
    t.prototype.onResize = function () {
      this.tree.infinityScroll.onResize();
    };
    t.prototype.dragSelectedBookmarks = function (e, t) {
      var n = this.tree.selectedDoms;
      if (n.size === 0 || (n.size === 1 && n.has(t))) return null;
      if (!n.has(t)) return null;
      var i = [],
        r = [];
      n.forEach(function (e) {
        r.push(e.item);
        i.push(e.selfEl);
      });
      var items = Array.from(n);
      items.sort(function (e, t) {
        return e.selfEl.offsetTop - t.selfEl.offsetTop;
      });
      this.app.dragManager.updateSource(i, "is-being-dragged");
      return {
        source: "bookmarks",
        type: "bookmarks",
        icon: "lucide-bookmark",
        items: items,
        title: P2.labelBookmarkWithCount({
          count: n.size,
        }),
      };
    };
    t.prototype.getItemDom = function (e) {
      var t = this.itemDoms.get(e);
      t ||
        ((t = e.type === "group" ? new F2(this, this.tree, e) : new N2(this, this.tree, e)),
        this.itemDoms.set(e, t),
        this.attachDragHandler(t));
      return t;
    };
    t.prototype.attachDragHandler = function (e) {
      var t = this,
        n = this.plugin,
        i = this.app.dragManager;
      i.handleDrag(e.selfEl, function (r) {
        var o = t.dragSelectedBookmarks(r, e);
        return (
          o ||
          (t.tree.selectedDoms.has(e) || (t.tree.clearSelectedDoms(), t.tree.selectItem(e)),
          i.updateSource([e.selfEl], "is-being-dragged"),
          setDragText(r.dataTransfer, n.getItemTitle(e.item)),
          {
            source: "bookmarks",
            type: "bookmarks",
            icon: "lucide-bookmark",
            items: [e],
            title: n.getItemTitle(e.item),
          })
        );
      });
    };
    t.prototype.update = function () {
      var e = this.root.vChildren;
      if ((e.clear(), this.invalidStateEl.detach(), this.emptyEl.detach(), this.plugin.hasValidData)) {
        for (var t = false, n = 0, i = this.plugin.items; n < i.length; n++) {
          var r = i[n],
            o = this.getItemDom(r);
          e.addChild(o);
          o.update();
          o instanceof F2 && o.refreshChildren();
          o.el.style.display !== "none" && (t = true);
        }
        t ? this.emptyEl.detach() : this.contentEl.appendChild(this.emptyEl);
      } else this.contentEl.appendChild(this.invalidStateEl);
      this.tree.infinityScroll.invalidate(this.root);
    };
    t.prototype.handlePaste = function (e) {
      var t = e.clipboardData.getData("obsidian/bookmarks");
      if (t) {
        var n = this.tree.focusedItem,
          i = [];
        try {
          i = JSON.parse(t);
        } catch (e) {
          console.log(e);
        }
        if (i && Array.isArray(i)) {
          var r = undefined;
          if (n) {
            n instanceof F2 ? (r = n.item) : n.parent instanceof F2 && (r = n.parent.item);
          }
          for (var ctime = Date.now(), a = 0, s = i; a < s.length; a++) {
            var l = s[a];
            this.plugin.addItem(
              __assign(__assign({}, l), {
                ctime: ctime,
              }),
              r,
            );
          }
        }
      }
    };
    t.prototype._copyToClipboard = function (e, t) {
      e.clipboardData.setData("obsidian/bookmarks", JSON.stringify(t));
    };
    t.prototype._getActiveBookmarks = function () {
      var e = this.tree,
        t = e.focusedItem,
        n = e.selectedDoms;
      return n.size > 0
        ? Array.from(n).map(function (e) {
            return e.item;
          })
        : t && this.tree.isItem(t)
          ? [t.item]
          : [];
    };
    t.prototype.handleCopy = function (e) {
      var t = this._getActiveBookmarks();
      if (t.length !== 0) {
        e.preventDefault();
        this._copyToClipboard(e, t);
      }
    };
    t.prototype.handleCut = function (e) {
      var t = this._getActiveBookmarks();
      if (t.length !== 0) {
        e.preventDefault();
        this._copyToClipboard(e, t);
        for (var n = 0, i = t; n < i.length; n++) {
          var r = i[n];
          this.plugin.removeItem(r);
        }
      }
    };
    return t;
  })(ItemView),
  B2 = i18nProxy.plugins.bookmarks,
  V2 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.id = "bookmarks";
      t.name = B2.name();
      t.description = B2.desc();
      t.defaultOn = true;
      t.hasValidData = false;
      t.items = [];
      t.bookmarkLookup = {};
      t.urlBookmarkLookup = {};
      t.bookmarkedViews = new WeakMap();
      t.onItemsChanged = debounce(t._onItemsChanged.bind(t), 20);
      return t;
    }
    __extends(t, e);
    t.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerGlobalCommand({
        id: "bookmarks:open",
        name: B2.actionShow(),
        icon: "lucide-bookmark",
        callback: function () {
          n.app.workspace.ensureSideLeaf(source, "left", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:bookmark-current-view",
        name: i18nProxy.plugins.bookmarks.actionBookmark(),
        icon: "lucide-bookmark-plus",
        checkCallback: function (t) {
          var i = app.workspace.getMostRecentLeaf();
          if (i) {
            var r = n.findBookmarkByView(i.view),
              o = !!r;
            if ((r || (r = b2(i)), r)) {
              t || new F0(n, r, o).open();
              return !0;
            }
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:bookmark-current-search",
        name: i18nProxy.plugins.bookmarks.actionBookmarkSearch(),
        icon: "lucide-search",
        checkCallback: function (e) {
          var t = n.app.internalPlugins.getEnabledPluginById("global-search");
          if (t) {
            if (!e) {
              var i = t.getGlobalSearchQuery();
              if (!i) {
                new Notice(B2.msgNoSearchQuery());
                return !0;
              }
              var r = y2(i);
              new F0(n, r, !1).open();
            }
            return !0;
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:unbookmark-current-view",
        name: i18nProxy.plugins.bookmarks.actionRemoveBookmark(),
        icon: "lucide-bookmark-plus",
        checkCallback: function (e) {
          var t = n.app.workspace.getMostRecentLeaf(),
            i = n.findBookmarkByView(t.view);
          if (i) {
            e || n.removeItem(i);
            return !0;
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:bookmark-current-section",
        name: i18nProxy.plugins.bookmarks.actionBookmarkBlock(),
        icon: "lucide-bookmark-plus",
        editorCallback: function (e, t) {
          var i,
            r = (function (e, t) {
              var n = e.app.metadataCache,
                i = e.file,
                r = n.getFileCache(i);
              if (!r) return null;
              function o(e) {
                return t.line < e.position.start.line ? -1 : t.line > e.position.end.line ? 1 : 0;
              }
              var a = cc(r.sections || [], o);
              return (a == null ? undefined : a.type) === "list"
                ? cc(r.listItems || [], o)
                : (a == null ? undefined : a.type) === "heading"
                  ? cc(r.headings || [], o)
                  : a;
            })(t.editMode, e.getCursor("to")),
            o = undefined;
          if (r) {
            if (
              (function (e) {
                return e.hasOwnProperty("heading");
              })(r)
            )
              i = d2(t.file, "#" + stripHeadingForLink(r.heading));
            else {
              var a = r.id;
              a ||
                ((a = ic(6)),
                (o = function () {
                  !(function (e, t, n, i) {
                    __awaiter(this, undefined, undefined, function () {
                      var r, o, a, s, l, c, u, h, p;
                      return __generator(this, function (d) {
                        switch (d.label) {
                          case 0:
                            i = i != null ? i : ic(6);
                            r = t.editor;
                            o = t.file;
                            return [4, t.app.metadataCache.blockCache.getForFile(e, o)];
                          case 1:
                            for (a = d.sent(), s = 0, l = a.blocks; s < l.length; s++)
                              if (
                                ((c = l[s]),
                                (u = c.node.position) && u.start.line - 1 <= n.line && u.end.line - 1 >= n.line)
                              ) {
                                h = {
                                  content: a.content,
                                  node: c.node,
                                };
                                p = db(h, i);
                                r.cm.dispatch({
                                  changes: {
                                    from: p.blockEnd,
                                    insert: p.addition,
                                  },
                                });
                                return [2];
                              }
                            return [2];
                        }
                      });
                    });
                  })(new ax(), t.editMode, e.getCursor("to"), a);
                }));
              i = d2(t.file, "#^" + a);
            }
            e.somethingSelected() && (i.title = e.getSelection().trim());
            new F0(n, i, !1, o).open();
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:bookmark-current-heading",
        name: i18nProxy.plugins.bookmarks.actionBookmarkHeading(),
        icon: "lucide-bookmark-plus",
        editorCallback: function (e, t) {
          var i = (function (e) {
            var t = e.app,
              n = e.file,
              i = e.editor.getCursor("to");
            return n ? pb(t, n, i) : null;
          })(t.editMode);
          if (i) {
            var r = d2(t.file, "#" + stripHeadingForLink(i.heading));
            new F0(n, r, !1).open();
          }
        },
      });
      plugin.registerGlobalCommand({
        id: "bookmarks:bookmark-all-tabs",
        name: i18nProxy.plugins.bookmarks.actionBookmarkAllTabs(),
        icon: "lucide-bookmark-plus",
        callback: function () {
          var e = n.app.workspace,
            t = e.rootSplit,
            i = e.floatingSplit,
            r = [];
          n.app.workspace.iterateLeaves([t, i], function (e) {
            var t = b2(e);
            if (t) {
              r.push(t);
            }
          });
          r.length > 0 && new N0(n.app, n, r).open();
        },
      });
      plugin.registerViewType(source, function (e) {
        return new R2(e, n);
      });
    };
    t.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    t.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(source, "left", {
        reveal: !1,
      });
    };
    t.prototype.findBookmarkByView = function (e) {
      return e instanceof FileView && e.file
        ? this.bookmarkLookup[e.file.path]
        : e instanceof h2
          ? this.urlBookmarkLookup[e.url]
          : null;
    };
    t.prototype.onFileRename = function (e, t) {
      var n = false;
      w2(this.items, function (i) {
        if (!((i.type !== "file" && i.type !== "folder") || i.path !== t)) {
          i.path = e.path;
          n = true;
        }
      });
      n && this.onItemsChanged(!0);
    };
    t.prototype.updateTabHeaders = function () {
      var e = this;
      this.app.workspace.iterateAllLeaves(function (t) {
        var n = t.view;
        if (n instanceof ItemView) {
          var i = e.findBookmarkByView(n),
            r = i ? B2.labelBookmarked() : B2.labelBookmark(),
            o = e.bookmarkedViews.get(n);
          o ||
            (o = n.addAction("lucide-bookmark", r, function () {
              var i = e.findBookmarkByView(n),
                r = !!i;
              i || (i = b2(t));
              new F0(e, i, r).open();
            })).addClass("mod-bookmark");
          e.bookmarkedViews.set(n, o);
          o.toggleClass(["mod-bookmarked", "mod-filled"], !!i);
          setTooltip(o, r);
        }
      });
    };
    t.prototype.getBookmarks = function () {
      var e = [];
      w2(this.items, function (t) {
        e.push(t);
      });
      return e;
    };
    t.prototype.getItemTitle = function (e) {
      if (!e.title) {
        if (e.type === "file" && e.subpath) return ru(e.path) + e.subpath;
        if (e.type === "file" || e.type === "folder") {
          var t = this.app.vault.getAbstractFileByPath(e.path);
          return t instanceof TFile ? t.getShortName() : t instanceof TFolder ? t.name : ru(e.path);
        }
        if (e.type === "search") return e.query;
      }
      return e.title;
    };
    t.prototype.addItem = function (e, t) {
      var n = t ? t.items : this.items;
      e[I0] = t;
      n.push(e);
      this.onItemsChanged(!0);
    };
    t.prototype.editItem = function (e) {
      this._onItemsChanged(!0);
    };
    t.prototype.removeItem = function (e) {
      var t, n;
      if (e) {
        ((n = (t = e[I0]) === null || undefined === t ? undefined : t.items) !== null && undefined !== n
          ? n
          : this.items
        ).remove(e);
        this.onItemsChanged(!0);
      }
    };
    t.prototype.moveItem = function (e, t, n) {
      var i = e[I0],
        r = i ? i.items : this.items,
        o = r.indexOf(e);
      r.remove(e);
      var a = t ? t.items : this.items;
      -1 !== o && o < n && r === a && n--;
      a.splice(n, 0, e);
      e[I0] = t;
      this._onItemsChanged(!0);
    };
    t.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t.registerEvent(e.workspace.on("editor-menu", this.onEditorMenu, this));
              t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              t.registerEvent(e.workspace.on("files-menu", this.onFilesMenu, this));
              t.registerEvent(e.workspace.on("leaf-menu", this.onLeafMenu, this));
              t.registerEvent(e.workspace.on("search:results-menu", this.onSearchResultsMenu, this));
              t.registerEvent(e.workspace.on("tab-group-menu", this.onTabGroupMenu, this));
              t.registerEvent(e.workspace.on("layout-change", this.updateTabHeaders, this));
              t.registerEvent(e.vault.on("rename", this.onFileRename.bind(this), this));
              e.workspace.registerHoverLinkSource(source, {
                display: this.name,
                defaultMod: true,
              });
              return [4, this.loadData()];
            case 1:
              i.sent() ||
                e.workspace.onLayoutReady(function () {
                  return __awaiter(n, undefined, undefined, function () {
                    var e, items, ctime, i, r, o;
                    return __generator(this, function (a) {
                      switch (a.label) {
                        case 0:
                          return [4, this.app.vault.readConfigJson("starred")];
                        case 1:
                          if ((e = a.sent()) && e.hasOwnProperty("items") && Array.isArray(e.items)) {
                            for (items = [], ctime = Date.now(), i = 0, r = e.items; i < r.length; i++)
                              if (
                                ((o = r[i]).type !== "file" && o.type !== "folder") ||
                                this.app.vault.getAbstractFileByPath(o.path)
                              ) {
                                o.type === "file" && delete o.title;
                                o.ctime || (o.ctime = ctime);
                                items.push(o);
                              }
                            this.items = items;
                            this._onItemsChanged(!0);
                          }
                          return [2];
                      }
                    });
                  });
                });
              return [2];
          }
        });
      });
    };
    t.prototype.loadData = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.plugin.loadData()];
            case 1:
              e = n.sent();
              this.hasValidData = undefined !== e;
              e &&
                e.hasOwnProperty("items") &&
                Array.isArray(e.items) &&
                ((t = function (e, n) {
                  for (var i = 0, r = e; i < r.length; i++) {
                    var o = r[i];
                    o[I0] = n;
                    o.type === "group" && t(o.items, o);
                  }
                }),
                t(e.items, null),
                (this.items = e.items));
              this.rebuildBookmarkCache();
              return [2, !!this.items];
          }
        });
      });
    };
    t.prototype.onExternalSettingsChange = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.loadData()];
            case 1:
              e.sent();
              this.onItemsChanged(!1);
              return [2];
          }
        });
      });
    };
    t.prototype.onEditorMenu = function (e, t, n) {
      var i = this,
        r = n.file;
      if (r) {
        var o = t.getCursor(),
          a = extractMarkdownTitle(t.getLine(o.line));
        if (a) {
          var s = "#" + stripHeadingForLink(a);
          e.addItem(function (e) {
            return e
              .setTitle(B2.menuOptBookmarkHeading())
              .setIcon("lucide-bookmark")
              .setSection("action")
              .onClick(function () {
                var e = d2(r, s);
                new F0(i, e, !1).open();
              });
          });
        }
      }
    };
    t.prototype.onFilesMenu = function (e, t, n, i) {
      var r = this;
      e.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(B2.actionBookmark())
          .setIcon("lucide-bookmark")
          .onClick(function () {
            var e = k2(t);
            new N0(r.app, r, e).open();
          });
      });
    };
    t.prototype.onFileMenu = function (e, t, n, i) {
      var r = this;
      if (!(t instanceof TFolder && t.isRoot())) {
        var o = this.bookmarkLookup.hasOwnProperty(t.path);
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(o ? B2.actionEditBookmark() : B2.actionBookmark())
            .setIcon("lucide-bookmark")
            .onClick(function () {
              var e = r.bookmarkLookup[t.path];
              e || (t instanceof TFile ? (e = d2(t)) : t instanceof TFolder && (e = f2(t)));
              e && new F0(r, e, o).open();
            });
        });
      }
    };
    t.prototype.onTabGroupMenu = function (e, t) {
      var n = this,
        i = t.children.map(b2).filter(Boolean),
        count = i.length;
      if (count > 0) {
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(
              B2.actionBookmarkTabGroup({
                count: count,
              }),
            )
            .setIcon("lucide-bookmark")
            .onClick(function () {
              new N0(n.app, n, i).open();
            });
        });
      }
    };
    t.prototype.onSearchResultsMenu = function (e, t) {
      var n = this,
        i = t.getQuery();
      e.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(B2.actionBookmark())
          .setIcon("lucide-bookmark")
          .onClick(function () {
            var e = y2(i);
            new F0(n, e, !1).open();
          });
      });
    };
    t.prototype.onLeafMenu = function (e, t) {
      var n = this;
      if (t.view instanceof IJ) {
        var i = t.view.dataEngine.getOptions();
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(B2.actionBookmark())
            .setIcon("lucide-bookmark")
            .onClick(function () {
              var e = g2(i);
              new F0(n, e, !1).open();
            });
        });
      } else if (t.view instanceof h2) {
        var r = t.view,
          o = r.url,
          a = r.title,
          s = this.urlBookmarkLookup.hasOwnProperty(o);
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(s ? B2.actionEditBookmark() : B2.actionBookmark())
            .setIcon("lucide-bookmark")
            .onClick(function () {
              var e = n.urlBookmarkLookup[o];
              e || (e = v2(o, a));
              e && new F0(n, e, s).open();
            });
        });
      }
    };
    t.prototype._onItemsChanged = function (e) {
      this.trigger("changed");
      this.rebuildBookmarkCache();
      this.updateTabHeaders();
      e && this.saveData();
    };
    t.prototype.saveData = function () {
      this.plugin.saveData({
        items: this.items,
      });
    };
    t.prototype.rebuildBookmarkCache = function () {
      var e = this;
      this.bookmarkLookup = {};
      this.urlBookmarkLookup = {};
      w2(this.items, function (t) {
        t.type === "folder" || (t.type === "file" && !t.subpath)
          ? (e.bookmarkLookup[t.path] = t)
          : t.type === "url" && (e.urlBookmarkLookup[t.url] = t);
      });
    };
    t.prototype.openBookmarkInLeaf = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return e.type !== "file"
                ? [3, 1]
                : ((i = e.path + ((o = e.subpath) !== null && undefined !== o ? o : "")),
                  t.openLinkText(i, "", n),
                  [3, 5]);
            case 1:
              return e.type !== "graph"
                ? [3, 4]
                : (r = this.app.internalPlugins.getEnabledPluginById("graph"))
                  ? [
                      4,
                      t.setViewState({
                        type: "graph",
                      }),
                    ]
                  : [3, 3];
            case 2:
              a.sent();
              t.view instanceof IJ && t.view.dataEngine.setOptions(e.options);
              r.options.options = e.options;
              a.label = 3;
            case 3:
              return [3, 5];
            case 4:
              e.type === "url" && window.open(e.url, "_blank");
              a.label = 5;
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.openBookmark = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o, a, s, l;
        return __generator(this, function (c) {
          if (e.type === "file" || e.type === "graph") {
            i = this.app.workspace.getLeaf(t);
            return [2, this.openBookmarkInLeaf(e, i, n)];
          }
          if (e.type === "url") window.open(e.url, "_blank");
          else if (e.type === "folder") {
            if (
              (r = this.app.vault.getAbstractFileByPath(e.path)) &&
              (o = this.app.internalPlugins.getEnabledPluginById("file-explorer"))
            ) {
              o.revealInFolder(r);
            }
          } else if (
            e.type === "search" &&
            ((a = e.query), (s = this.app.internalPlugins.getEnabledPluginById("global-search")))
          ) {
            if (((l = s.getGlobalSearchQuery()), !t || l === "")) {
              s.openGlobalSearch(a);
              return [2];
            }
            l.contains(a)
              ? s.openGlobalSearch(l.replace(a, "").trim())
              : s.openGlobalSearch("".concat(l.trim(), " ").concat(a));
          }
          return [2];
        });
      });
    };
    t.prototype.openBookmarks = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (
                (n = e.filter(function (e) {
                  return e.type === "file" || e.type === "graph";
                })).length === 0
              )
                return [2];
              for (i = this.app.workspace.getLeaf(t), r = i.parent.children.length, o = [i], s = 1; s < n.length; s++) {
                a = new WorkspaceLeaf(this.app);
                i.parent.insertChild(r, a);
                o.push(a);
                r++;
              }
              s = 0;
              l.label = 1;
            case 1:
              return s < o.length
                ? [
                    4,
                    this.openBookmarkInLeaf(n[s], o[s], {
                      active: !1,
                    }),
                  ]
                : [3, 4];
            case 2:
              l.sent();
              l.label = 3;
            case 3:
              s++;
              return [3, 1];
            case 4:
              this.app.vault.getConfig("focusNewTab") &&
                this.app.workspace.setActiveLeaf(i, {
                  focus: !0,
                });
              return [2];
          }
        });
      });
    };
    t.prototype.trigger = function (t) {
      for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
      e.prototype.trigger.apply(this, __spreadArray([t], n, !1));
    };
    t.prototype.on = function (t, n, i) {
      return e.prototype.on.call(this, t, n, i);
    };
    return t;
  })(Events),
  H2 = i18nProxy.plugins.canvas;
function z2(e) {
  for (var t = [], n = 0, i = e; n < i.length; n++) {
    var r = i[n];
    modifierDisplayMap.hasOwnProperty(r) ? t.push(modifierDisplayMap[r]) : t.push(r);
  }
  return t.join(Platform.isMacOS ? " " : " + ");
}