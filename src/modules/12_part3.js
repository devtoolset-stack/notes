    return t;
  })(uY),
  dY = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.containerEl.addClass("video-embed");
      return i;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return aY.displayInEl(this.file, this.app, this.containerEl);
    };
    return t;
  })(uY),
  fY = (function (e) {
    function t(ctx, filen0, subpath) {
      var r = e.call(this) || this;
      r.app = ctx.app;
      r.ctx = ctx;
      r.containerEl = ctx.containerEl;
      r.containerEl.addClass("file-embed", "mod-generic");
      r.file = filen0;
      r.subpath = subpath;
      r.headerEl = r.containerEl.createDiv(
        {
          cls: "file-embed-title",
        },
        function (e) {
          e.createSpan(
            {
              cls: "file-embed-icon",
            },
            function (e) {
              setIcon(e, "lucide-file");
            },
          );
          e.appendText(" " + r.file.name);
        },
      );
      return r;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          t = (e = this).containerEl;
          n = e.ctx;
          i = e.app;
          t.addEventListener("click", function (e) {
            i.workspace.getLeaf(Keymap.isModEvent(e)).openLinkText(n.linktext, n.sourcePath);
          });
          return [2];
        });
      });
    };
    return t;
  })(Component),
  mY = (function (e) {
    function t(ctx) {
      var n = e.call(this) || this;
      n.file = null;
      n.onClick = function (e) {
        var t = n.ctx,
          i = t.app,
          r = t.linktext,
          o = t.sourcePath;
        i.workspace.openLinkText(r, o, Keymap.isModEvent(e));
      };
      n.ctx = ctx;
      n.containerEl = ctx.containerEl;
      return n;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, linktext;
        return __generator(this, function (o) {
          t = (e = this).containerEl;
          n = e.ctx;
          i = n.app;
          linktext = n.linktext;
          t.addClass("file-embed");
          i.fileManager.canCreateFileWithExt(getExtension(linktext))
            ? (t.addClass("mod-empty"),
              t.appendText(
                i18nProxy.plugins.pagePreview.labelEmptyNote({
                  linktext: linktext,
                }),
              ),
              t.addEventListener("click", this.onClick))
            : (t.addClass("mod-empty-attachment"),
              t.appendText(
                i18nProxy.plugins.pagePreview.labelEmptyAttachment({
                  linktext: linktext,
                }),
              ));
          return [2];
        });
      });
    };
    t.prototype.onload = function () {
      var t = this;
      e.prototype.onload.call(this);
      var n = this.ctx.app,
        i = debounce(
          function () {
            if (t._loaded && !(t._children.length > 0)) {
              var e = t.ctx,
                n = e.app,
                i = e.linktext,
                r = e.sourcePath,
                o = parseLinktext(i).path;
              if (n.metadataCache.getFirstLinkpathDest(o, r)) {
                t.containerEl.removeClass("file-embed", "mod-empty");
                t.containerEl.removeEventListener("click", t.onClick);
                t.containerEl.empty();
                var a = vY.load(t.ctx);
                if (a) {
                  t.addChild(a);
                  a.loadFile();
                }
              }
            }
          },
          500,
          !0,
        );
      this.registerEvent(n.vault.on("create", i));
      this.registerEvent(n.vault.on("rename", i));
    };
    return t;
  })(Component),
  gY = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.embedByExtension = {};
      t.registerExtensions(MARKDOWN_EXTENSIONS, function (e, t, n) {
        return e.displayMode ? new yR(e, t, n) : new yY(e, t, n);
      });
      t.registerExtensions(IMAGE_EXTENSIONS, function (e, t) {
        return new hY(e, t);
      });
      t.registerExtensions(AUDIO_EXTENSIONS, function (e, t) {
        return new pY(e, t);
      });
      t.registerExtensions(VIDEO_EXTENSIONS, function (e, t) {
        return new dY(e, t);
      });
      t.registerExtensions(PDF_EXTENSIONS, function (e, t, n) {
        return new rY(e, t, n);
      });
      return t;
    }
    __extends(t, e);
    t.prototype.unregisterExtensions = function (e) {
      for (var t = 0, n = e; t < n.length; t++) {
        var i = n[t];
        this.unregisterExtension(i);
      }
    };
    t.prototype.unregisterExtension = function (e) {
      delete this.embedByExtension[e];
    };
    t.prototype.registerExtension = function (e, t) {
      var n = this.embedByExtension;
      if (this.isExtensionRegistered(e))
        throw new Error('Attempting to register an embed for an already registered extension "'.concat(e, '"'));
      n[e] = t;
    };
    t.prototype.registerExtensions = function (e, t) {
      for (var n = 0, i = e; n < i.length; n++) {
        var r = i[n];
        this.registerExtension(r, t);
      }
    };
    t.prototype.isExtensionRegistered = function (e) {
      return this.embedByExtension.hasOwnProperty(e);
    };
    t.prototype.getEmbedCreator = function (e) {
      return this.isExtensionRegistered(e.extension) ? this.embedByExtension[e.extension] : null;
    };
    return t;
  })(Events),
  vY = (function () {
    function e() {}
    e.load = function (e) {
      var t = e.app,
        n = e.containerEl,
        i = e.linktext,
        r = e.sourcePath;
      e.depth = e.depth + 1;
      n.empty();
      var o = null,
        a = parseLinktext(i),
        s = a.subpath,
        l = a.path,
        c = t.metadataCache.getFirstLinkpathDest(l, r);
      if (c) {
        var u = t.embedRegistry.getEmbedCreator(c);
        u && e.depth <= 5 && (o = u(e, c, s));
        o || (o = new fY(e, c, s));
      }
      o || (o = new mY(e));
      n.addClass("is-loaded");
      lY.set(n, e.depth);
      return o;
    };
    return e;
  })(),
  yY = (function (e) {
    function t(t, n, subpath) {
      var r = e.call(this, t.app, t.containerEl, n, t.state) || this;
      r.subpath = "";
      r.useLocalPropertiesFoldState = false;
      r.localPropertiesFoldState = false;
      r.data = "";
      r.subpathNotFound = false;
      r.before = "";
      r.after = "";
      r.heading = "";
      r.indent = "";
      r.lastSavedData = null;
      r.saving = false;
      r.saveAgain = false;
      r.fileBeingRenamed = null;
      r.rawFrontmatter = null;
      r.subpath = subpath;
      r.containerEl.addClass("markdown-embed");
      t.showInline &&
        (r.containerEl.addClass("inline-embed"),
        (r.headerEl = r.containerEl.createDiv({
          cls: "embed-title markdown-embed-title",
          prepend: true,
        })));
      r.containerEl.createDiv("markdown-embed-link", function (e) {
        setIcon(e, "lucide-maximize-2");
        setTooltip(e, i18nProxy.editor.linkPopover.tooltipOpenLink());
        xc(e);
        e.onClickEvent(function (e) {
          if (!(e.button !== 0 && e.button !== 1)) {
            e.preventDefault();
            r.app.workspace.getLeaf(Keymap.isModEvent(e)).openFile(n, {
              eState: {
                subpath: subpath,
              },
            });
          }
        });
      });
      var o = (r.inlineTitleEl = createDiv("inline-title"));
      o.contentEditable = r.subpath ? "false" : "true";
      o.spellcheck = r.app.vault.getConfig("spellcheck");
      o.autocapitalize = "on";
      o.tabIndex = -1;
      o.enterKeyHint = Platform.isAndroidApp ? "enter" : "done";
      o.addEventListeners({
        focus: function () {
          return (r.fileBeingRenamed = r.file);
        },
        blur: function () {
          return r.saveTitle(o);
        },
        input: function () {
          return r.onTitleChange(o);
        },
        paste: function (e) {
          return r.onTitlePaste(o, e);
        },
        keydown: function (e) {
          return r.onTitleKeydown(e);
        },
      });
      r.metadataEditor = new tD(r.app, r);
      r.addChild(r.metadataEditor);
      return r;
    }
    __extends(t, e);
    t.prototype.showPreview = function (t) {
      e.prototype.showPreview.call(this, t);
      var n = this.previewMode.renderer;
      n.header || n.addHeader();
      n.header.el.prepend(this.metadataEditor.containerEl);
      n.header.el.prepend(this.inlineTitleEl);
    };
    t.prototype.showEditor = function (t) {
      e.prototype.showEditor.call(this, t);
      this.editMode.sizerEl.insertAfter(this.metadataEditor.containerEl, this.inlineTitleEl);
    };
    t.prototype.getFile = function () {
      return this.file;
    };
    t.prototype.getHoverSource = function () {
      return this.getMode();
    };
    t.prototype.focusTitle = function () {
      var e = this.inlineTitleEl;
      if (e.isShown()) {
        this.getMode() === "preview"
          ? this.previewMode.renderer.onRendered(function () {
              return focusAndSelectContent(e);
            })
          : focusAndSelectContent(e);
      }
    };
    t.prototype.canShowProperties = function () {
      return (
        !this.subpath &&
        (this.getMode() !== "source" || !this.editMode.sourceMode) &&
        this.app.vault.getConfig("propertiesInDocument") === "visible"
      );
    };
    t.prototype.shiftFocusAfter = function () {
      this.editMode
        ? (this.editMode.cm.dispatch({
            selection: EditorSelection.single(0),
          }),
          this.editMode.focus())
        : this.previewMode.renderer.previewEl.focus();
    };
    t.prototype.shiftFocusBefore = function () {
      if (
        !(
          this.canShowProperties() &&
          !this.metadataEditor.hasFocus() &&
          this.metadataEditor.focus({
            bottom: !0,
          })
        )
      ) {
        this.inlineTitleEl.isShown() && focusAndSelectContent(this.inlineTitleEl);
      }
    };
    t.prototype.loadFrontmatter = function (e) {
      var t,
        rawFrontmatter = getFrontMatterInfo(e).frontmatter;
      if (this.rawFrontmatter === null || this.rawFrontmatter !== rawFrontmatter) {
        this.rawFrontmatter = rawFrontmatter;
        var i = {};
        try {
          if (
            typeof (i = (t = parseYaml(rawFrontmatter)) !== null && undefined !== t ? t : {}) != "object" ||
            Array.isArray(i)
          )
            throw new Error("Frontmatter must be a valid object!");
        } catch (e) {
          i = null;
        }
        this.editMode && this.editMode.setCssClass(getCssClasses(i));
        this.metadataEditor.synchronize(i);
      }
    };
    t.prototype.saveFrontmatter = function (e) {
      this.save(Ex(this.text, e), !0);
    };
    t.prototype.applyIndent = function (e) {
      var t = this.indent,
        n = getSubpathType(this.subpath) === "footnote" ? /\n/g : /(^|\n)/g;
      return e.replace(n, "$&" + t);
    };
    t.prototype.save = function (t) {
      return __awaiter(this, arguments, undefined, function (t, n) {
        var lastSavedData, r, o, a, s, l, c, u, h, lastSavedDatap0, d;
        undefined === n && (n = false);
        return __generator(this, function (f) {
          switch (f.label) {
            case 0:
              if ((e.prototype.save.call(this, t, n), this.subpathNotFound)) return [2];
              if (
                ((lastSavedData = t),
                (o = (r = this).before),
                (a = r.after),
                (s = r.heading),
                lastSavedData && s && !s.endsWith("\n") && (s += "\n"),
                (lastSavedData = this.data = o + s + this.applyIndent(lastSavedData) + a),
                this.app.workspace.onQuickPreview(this.file, lastSavedData),
                !n)
              )
                return [3, 6];
              if (((this.dirty = false), (c = (l = this).file), (u = l.app), (h = u.vault), !c || c.deleted))
                return [2];
              if (this.saving) {
                this.saveAgain = true;
                return [2];
              }
              if (this.lastSavedData === lastSavedData || this.lastSavedData === null) return [3, 6];
              lastSavedDatap0 = this.lastSavedData;
              this.lastSavedData = lastSavedData;
              this.saving = true;
              f.label = 1;
            case 1:
              f.trys.push([1, 4, 5, 6]);
              return [4, hx(h.adapter.promise)];
            case 2:
              f.sent();
              return [4, h.modify(c, lastSavedData)];
            case 3:
              f.sent();
              return [3, 6];
            case 4:
              throw (
                (d = f.sent()),
                (this.lastSavedData = lastSavedDatap0),
                console.error(d),
                new Notice(
                  i18nProxy.interface.msgFailToSaveFile({
                    filepath: c.path,
                    message: d.message,
                  }),
                  0,
                ),
                this.app.fileManager.storeTextFileBackup(c.path, lastSavedData),
                d
              );
            case 5:
              this.saving = false;
              this.saveAgain && this.save(this.text);
              return [7];
            case 6:
              return [2];
          }
        });
      });
    };
    t.prototype.onTitlePaste = function (e, t) {
      handlePasteText(e, t);
    };
    t.prototype.onTitleChange = function (e) {
      hideTooltip();
      var t = this.file;
      normalizeElementText(e);
      var n = e.getText().trim(),
        i = Ij(this.app, t, n, !1);
      if (i) {
        sY(e, i, !0);
      }
    };
    t.prototype.onTitleKeydown = function (e) {
      if (!e.isComposing)
        if (
          (e.key === "Escape" &&
            (e.preventDefault(), this.inlineTitleEl.setText(this.file.basename), this.inlineTitleEl.blur()),
          e.key === "Enter" || e.key === "Tab")
        ) {
          e.preventDefault();
          clearFocusAndSelection();
          this.editMode && Platform.hasPhysicalKeyboard && this.editMode.editor.focus();
        } else if (e.key === "ArrowDown") {
          var t = e.targetNode,
            n = t.win.getSelection();
          if (n && n.rangeCount >= 1 && t.instanceOf(HTMLElement)) {
            var i = n.getRangeAt(0);
            if (t === i.startContainer || t.contains(i.startContainer)) {
              var r = i.getBoundingClientRect();
              if (r.bottom + r.height / 2 >= t.getBoundingClientRect().bottom) {
                e.preventDefault();
                clearFocusAndSelection();
                this.editMode && (this.editMode.editor.focus(), this.editMode.editor.setSelection(xb(0, 0)));
              }
            }
          }
        }
    };
    t.prototype.saveTitle = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              if ((hideTooltip(), (n = (t = this).file), (i = t.subpath), (r = t.fileBeingRenamed), n !== r))
                return [2];
              if (((o = e.getText().trim()), i)) return [3, 5];
              if ((a = Ij(this.app, n, o, !0))) {
                e.setText(n.basename);
                sY(e, a, !0);
                return [2];
              }
              if (((s = n.getNewPathAfterRename(o)), n.path === s)) return [2];
              u.label = 1;
            case 1:
              u.trys.push([1, 3, , 4]);
              return [4, this.app.fileManager.renameFile(n, s)];
            case 2:
              u.sent();
              return [3, 4];
            case 3:
              (l = u.sent()) && ((c = l.message || l.code || l.toString()), sY(e, c, !0));
              return [3, 4];
            case 4:
              e.setText(n.basename);
              this.fileBeingRenamed = null;
              u.label = 5;
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      this.registerEvent(this.app.metadataCache.on("changed", this.onFileChanged, this));
      this.registerEvent(this.app.vault.on("rename", this.onFileRename, this));
    };
    t.prototype.onunload = function () {
      e.prototype.onunload.call(this);
      this.applyScope(null);
    };
    t.prototype.onFileChanged = function (e, t, n) {
      if (!(e !== this.file || t === this.data || this.dirty)) {
        this.loadFileInternal(t, n);
      }
    };
    t.prototype.onFileRename = function (e, t) {
      if (e instanceof TFile && e === this.file && !this.subpath) {
        this.inlineTitleEl.setText(e.basename);
      }
    };
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
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
              n = (e = this).app;
              i = e.file;
              r = e.headerEl;
              o = e.previewMode;
              a = e.subpath;
              s = e.state;
              a ||
                (r == null || r.setText(i.basename),
                this.inlineTitleEl.setText(i.basename),
                o.registerEvent(
                  n.workspace.on("quick-preview", function (e, t) {
                    if (e === p.file && t !== p.data) {
                      p.loadContents(t);
                    }
                  }),
                ));
              c = this;
              return [4, n.vault.cachedRead(i)];
            case 1:
              l = c.data = d.sent();
              this.loadFileInternal(l);
              s &&
                Number.isNumber(s.scroll) &&
                this.previewMode.renderer.applyScrollDelayed(s.scroll, {
                  highlight: true,
                  center: !0,
                });
              u = this.getFoldInfo();
              this.localPropertiesFoldState = Boolean(
                u &&
                (u == null
                  ? undefined
                  : u.folds.some(function (e) {
                      return e.from === 0;
                    })),
              );
              this.previewMode.renderer.applyFoldInfo(u);
              h = this.useLocalPropertiesFoldState ? this.localPropertiesFoldState : t.collapseProperties;
              this.metadataEditor.setCollapse(h, !1);
              return [2];
          }
        });
      });
    };
    t.prototype.getFoldInfo = function () {
      return this.app.foldManager.load(this.file);
    };
    t.prototype.loadFileInternal = function (lastSavedData, t) {
      var n = this.file,
        i = this.lastSavedData;
      if (((this.lastSavedData = lastSavedData), i)) {
        if (i === lastSavedData) return;
        if (this.dirty) {
          var r = this.data;
          if (r === lastSavedData) return;
          if (r !== i) {
            lastSavedData = Kj(i, r, lastSavedData);
            new Notice(
              i18nProxy.interface.msgFileChanged({
                file: n.path,
              }),
            );
          }
        }
      }
      this.loadContents(lastSavedData, t);
    };
    t.prototype.loadContents = function (e, t) {
      var n = this,
        i = this,
        r = i.app,
        o = i.file,
        a = i.subpath;
      if ((t || (t = r.metadataCache.getFileCache(o)), a && !t && (this.subpathNotFound = false), a && t)) {
        var s = resolveSubpath(t, a);
        this.subpathNotFound = !s;
        var before = "",
          after = "",
          heading = "",
          indent = "";
        if (s) {
          var p = extractSubpathContent(e, t, s, this.editable);
          if (
            ((before = p.before),
            (after = p.after),
            (heading = p.heading),
            (indent = p.indent),
            (e = p.content),
            (this.containerEl.dataset.type = s.type),
            s.type === "heading")
          ) {
            var containerEl = this.inlineTitleEl,
              f = sanitizeHTMLToDom(renderMarkdown(parseMetadata(heading))).firstChild;
            f && f.instanceOf(HTMLHeadingElement)
              ? (containerEl.addClass("markdown-rendered"),
                containerEl.replaceChildren(f),
                mR(r, containerEl, o.path),
                MarkdownPreviewView.postProcess(r, {
                  docId: ic(16),
                  sourcePath: this.path,
                  frontmatter: t.frontmatter,
                  promises: [],
                  addChild: function (e) {
                    return n.addChild(e);
                  },
                  getSectionInfo: function () {
                    return null;
                  },
                  replace: function () {
                    return null;
                  },
                  containerEl: containerEl,
                  el: f,
                  displayMode: false,
                }))
              : containerEl.setText(s.current.heading);
            containerEl.setAttr("data-level", String(s.current.level));
          } else if (s.type === "footnote") {
            indent = r.vault.getConfig("useTab") ? "\t" : "    ";
          }
        }
        this.heading = heading;
        this.before = before;
        this.after = after;
        this.indent = indent;
      }
      if (this.subpathNotFound) {
        var subpath = a.slice(1).replace(/(\[|\])/g, "\\$1");
        if (getSubpathType(a) === "footnote") {
          e = i18nProxy.plugins.pagePreview.labelMissingFootote({
            id: subpath,
          });
          this.containerEl.dataset.type = "footnote";
          this.containerEl.addClass("mod-empty");
          var g = function () {
            n.app.vault.process(o, function (e) {
              var t = e.match(/\n*$/)[0].length;
              return e + "\n".repeat(2 - Math.min(t, 2)) + a.slice(1) + ": \n";
            });
            n.containerEl.removeClass("mod-empty");
            n.containerEl.removeEventListener("click", g);
          };
          this.containerEl.addEventListener("click", g);
        } else
          e =
            "##### " +
            i18nProxy.interface.labelUnableToFindSection({
              subpath: subpath,
              file: o.basename,
            });
      }
      this.set(e, !0);
    };
    t.prototype.set = function (t, n) {
      if ((e.prototype.set.call(this, t, n), this.loadFrontmatter(t), n)) {
        var i = this.app;
        this.previewMode.renderer.previewEl.toggleClass(
          "show-properties",
          i.vault.getConfig("propertiesInDocument") !== "hidden",
        );
      }
    };
    t.prototype.applyScope = function (scope) {
      if (scope !== this.scope) {
        this.scope && this.app.keymap.popScope(this.scope);
        scope && this.app.keymap.pushScope(scope);
        this.scope = scope;
      }
    };
    t.prototype.onMarkdownFold = function () {
      var e = this.file,
        n = this.getMode() === "preview" ? this.previewMode.renderer.getFoldInfo() : this.editMode.getFoldInfo();
      this.useLocalPropertiesFoldState ||
        ((t.collapseProperties = this.metadataEditor.collapsed),
        this.localPropertiesFoldState &&
          n.folds.unshift({
            from: 0,
            to: 0,
          }));
      this.app.foldManager.save(e, n);
    };
    t.collapseProperties = true;
    return t;
  })(IK),
  SuggestModal = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.limit = 100;
      n.emptyStateText = i18nProxy.setting.thirdPartyPlugin.labelNoResultsFound();
      n.isOpen = false;
      n.inputEl = null;
      n.clearButtonEl = null;
      n.ctaEl = null;
      n.resultContainerEl = null;
      n.instructionsEl = createDiv("prompt-instructions");
      var i = n.modalEl;
      i.removeClass("modal");
      i.addClass("prompt");
      i.empty();
      i.createDiv("prompt-input-container", function (e) {
        var t = (n.inputEl = e.createEl("input", {
          cls: "prompt-input",
          type: "text",
          attr: {
            autocapitalize: "off",
            spellcheck: "false",
            enterkeyhint: Platform.isAndroidApp ? "enter" : "done",
          },
        }));
        n.ctaEl = e.createDiv("prompt-input-cta");
        n.clearButtonEl = e.createDiv("search-input-clear-button", function (e) {
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function () {
            t.value !== "" ? ((t.value = ""), t.trigger("input")) : n.close();
          });
        });
      });
      n.resultContainerEl = i.createDiv("prompt-results");
      n.resultContainerEl.on("mousedown", ".suggestion-item", function (e) {
        return e.preventDefault();
      });
      n.chooser = new Ax(n, n.resultContainerEl, n.scope);
      n.inputEl.addEventListener("input", n.onInput.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.setPlaceholder = function (placeholdere0) {
      this.inputEl.placeholder = placeholdere0;
    };
    t.prototype.setInstructions = function (e) {
      e.length > 0
        ? (Ix(this.instructionsEl, e), this.modalEl.appendChild(this.instructionsEl))
        : this.instructionsEl.detach();
    };
    t.prototype.onOpen = function () {
      var e = this.inputEl;
      this.isOpen = true;
      e.value = "";
      e.focus();
      this.updateSuggestions();
    };
    t.prototype.onInput = function () {
      this.updateSuggestions();
    };
    t.prototype.updateSuggestions = function () {
      var e = this,
        t = this.inputEl.value,
        n = this.getSuggestions(t),
        i = function (t) {
          if (t && t.length !== 0) {
            var n = e.limit;
            n && n > 0 && (t = t.slice(0, n));
            e.chooser.setSuggestions(t);
          } else e.onNoSuggestion();
        };
      Array.isArray(n)
        ? i(n)
        : __awaiter(e, undefined, undefined, function () {
            var e;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  e = i;
                  return [4, n];
                case 1:
                  e.apply(undefined, [t.sent()]);
                  return [2];
              }
            });
          });
    };
    t.prototype.onNoSuggestion = function () {
      this.chooser.setSuggestions(null);
      this.chooser.addMessage(this.emptyStateText);
    };
    t.prototype.selectSuggestion = function (e, t) {
      this.app.keymap.updateModifiers(t);
      this.close();
      this.isOpen = false;
      this.onChooseSuggestion(e, t);
    };
    t.prototype.selectActiveSuggestion = function (e) {
      this.chooser.useSelectedItem(e);
    };
    return t;
  })(Modal),
  FuzzySuggestModal = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.sortSuggestions = function (e) {
      sortSearchResults(e);
    };
    t.prototype.getSuggestions = function (e) {
      e = e.trim();
      for (var t = this.getItems(), n = prepareQuery(e), i = [], r = 0, o = t; r < o.length; r++) {
        var item = o[r],
          match = fuzzySearch(n, this.getItemText(item));
        if (match) {
          i.push({
            match: match,
            item: item,
          });
        }
      }
      this.sortSuggestions(i);
      return i;
    };
    t.prototype.renderSuggestion = function (e, t) {
      renderResults(t, this.getItemText(e.item), e.match);
    };
    t.prototype.onChooseSuggestion = function (e, t) {
      this.onChooseItem(e.item, t);
    };
    return t;
  })(SuggestModal),
  kY = {
    info: i18nProxy.callout.type.info,
    important: i18nProxy.callout.type.important,
    tip: i18nProxy.callout.type.tip,
    success: i18nProxy.callout.type.success,
    question: i18nProxy.callout.type.question,
    warning: i18nProxy.callout.type.warning,
    example: i18nProxy.callout.type.example,
    quote: i18nProxy.callout.type.quote,
  },
  CY = __spreadArray(
    __spreadArray([], Object.keys(kY), !0),
    [
      "abstract",
      "summary",
      "tldr",
      "todo",
      "hint",
      "check",
      "done",
      "question",
      "faq",
      "help",
      "caution",
      "attention",
      "failure",
      "fail",
      "missing",
      "danger",
      "error",
      "bug",
      "example",
      "cite",
    ],
    !1,
  ),
  EY = StateEffect.define(),
  livePreviewState = ViewPlugin.define(function () {
    return {
      mousedown: !1,
    };
  }),
  MY = new Set([
    "em",
    "strong",
    "inline-code",
    "strikethrough",
    "highlight",
    "link",
    "image",
    "hmd-internal-link",
    "hmd-embed",
    "formatting-link",
    "footref",
  ]),
  xY = /^\s*(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/,
  decoTY0 = Decoration.replace({}),
  decoDY0 = Decoration.replace({}),
  deco = Decoration.replace({}),
  decoPY0 = Decoration.mark({
    tagName: "a",
    class: "cm-underline",
    attributes: {
      tabIndex: "-1",
      href: "#",
    },
  }),
  decoLY0 = Decoration.mark({
    class: "cm-transparent",
  }),
  IY = Decoration.mark({
    class: "is-unresolved",
  }),
  OY = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.toDOM = function () {
      return createSpan({
        cls: "cm-blockquote-border cm-transparent",
        text: ">",
      });
    };
    return t;
  })(WidgetType),
  decoFY0 = Decoration.replace({
    widget: new OY(),
  }),
  NY = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.eq = function () {
      return !0;
    };
    t.prototype.toDOM = function (e) {
      var t = createDiv("hr cm-line");
      t.createEl("br");
      t.addEventListener("click", function () {
        var n = e.posAtDOM(t),
          i = e.state.doc.lineAt(n);
        e.dispatch({
          selection: {
            head: i.from,
            anchor: i.to,
          },
        });
      });
      t.createEl("hr");
      return t;
    };
    t.prototype.destroy = function (e) {
      e.detach();
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 20;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(WidgetType),
  widgetRY0 = new NY(),
  decoBY0 = Decoration.mark({
    class: "list-bullet",
  }),
  decoVY0 = Decoration.mark({
    class: "list-number",
  }),
  HY = (function (e) {
    function t(content) {
      var n = e.call(this) || this;
      n.content = content;
      return n;
    }
    __extends(t, e);
    t.prototype.eq = function (e) {
      return e.content === this.content;
    };
    t.prototype.updateDOM = function (e) {
      if (e.instanceOf(HTMLLabelElement) && e.firstChild && e.firstChild.instanceOf(HTMLInputElement)) {
        var t = e.firstChild;
        t.setAttribute("data-task", this.content);
        t.checked = this.content !== " ";
        return !0;
      }
      return !1;
    };
    t.prototype.toDOM = function (e) {
      var t = createEl("label", "task-list-label"),
        n = t.createEl("input", {
          cls: "task-list-item-checkbox",
          type: "checkbox",
        });
      n.setAttribute("data-task", this.content);
      n.checked = this.content !== " ";
      t.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
      n.addEventListener("input", function () {
        var t = e.posAtDOM(n),
          i = e.state.doc.lineAt(t),
          r = i.text.search(/\[.]/);
        if (-1 !== r) {
          var o = i.text.charAt(r + 1),
            from = i.from + r + 1;
          if (
            (e.dispatch({
              changes: [
                {
                  from: from,
                  to: from + 1,
                  insert: o === " " ? "x" : " ",
                },
              ],
            }),
            Platform.isAndroidApp)
          ) {
            var scrollTop = e.scrollDOM.scrollTop,
              l = function (t) {
                c();
                t.preventDefault();
                e.scrollDOM.scrollTop = scrollTop;
              },
              c = function () {
                e.scrollDOM.removeEventListener("scroll", l, {
                  capture: true,
                });
              };
            e.scrollDOM.addEventListener("scroll", l, {
              capture: true,
              passive: false,
            });
            n.win.setTimeout(c, 200);
          }
        }
      });
      return t;
    };
    return t;
  })(WidgetType),
  zY = (function (e) {
    function t(styles) {
      var n = e.call(this) || this;
      n.styles = styles;
      return n;
    }
    __extends(t, e);
    t.prototype.eq = function (e) {
      return this.styles === e.styles;
    };
    t.prototype.toDOM = function () {
      return createSpan(this.styles);
    };
    t.prototype.ignoreEvent = function (e) {
      return !1;
    };
    return t;
  })(WidgetType),
  qY = (function (e) {
    function t(lang, code) {
      var i = e.call(this) || this;
      i.lang = lang;
      i.code = code;
      return i;
    }
    __extends(t, e);
    t.prototype.eq = function (e) {
      return e.lang === this.lang && e.code === this.code;
    };
    t.prototype.toDOM = function () {
      var e = this,
        t = createSpan({
          cls: "code-block-flair",
          text: this.lang,
        });
      this.lang || setIcon(t, "lucide-copy");
      setTooltip(t, i18nProxy.interface.menu.copy());
      t.addEventListener("click", function () {
        return __awaiter(e, undefined, undefined, function () {
          var e;
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                (e = this.code).endsWith("\n") && (e = e.substr(0, e.length - 1));
                return [4, navigator.clipboard.writeText(e)];
              case 1:
                t.sent();
                new Notice(
                  i18nProxy.interface.copied({
                    context: "generic",
                  }),
                );
                return [2];
            }
          });
        });
      });
      return t;
    };
    return t;
  })(WidgetType),
  WY = (function (e) {
    function t(url, title) {
      var i = e.call(this) || this;
      i.url = url;
      i.title = title;
      return i;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t,
        n = FN(this.url);
      if (n) t = NN(n);
      else {
        var i = (t = createEl("img"));
        i.src = this.url;
        this.applyTitle(i, this.title);
      }
      this.hookClickHandler(e, t);
      this.resizeWidget(e, t);
      return t;
    };
    t.prototype.applyTitle = function (e, t) {
      var width = 0,
        height = 0;
      if (t) {
        var r = function (e) {
            var t = nC(e);
            return !!t && ((width = t.x), (height = t.y), !0);
          },
          o = t.lastIndexOf("|");
        -1 !== o ? r(t.substr(o + 1)) && (t = t.substr(0, o)) : r(t) && (t = "");
      }
      t || (t = getFilename(this.url));
      width > 0 && (e.width = width);
      height > 0 && (e.height = height);
      e.setAttr("alt", t);
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 30;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(NO),
  UY = (function (e) {
    function t(t, n, sourcePath, href, title, depth) {
      var s = e.call(this, t, n) || this;
      s.sourcePath = sourcePath;
      s.href = href;
      s.title = title;
      s.depth = depth;
      return s;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t = this,
        n = t.app,
        sourcePath = t.sourcePath,
        linktext = t.href,
        o = t.title,
        depth = t.depth,
        containerEl = (this.containerEl = createDiv("internal-embed"));
      containerEl.tabIndex = -1;
      containerEl.setAttr("src", linktext);
      this.applyTitle(containerEl, o);
      var l = vY.load({
        app: n,
        linktext: linktext,
        sourcePath: sourcePath,
        containerEl: containerEl,
        displayMode: false,
        showInline: true,
        depth: depth,
      });
      l && (this.addChild(l), l.loadFile());
      l instanceof rY || l instanceof LG ? this.addEditButton(e, containerEl) : this.hookClickHandler(e, containerEl);
      this.resizeWidget(e, containerEl);
      return containerEl;
    };
    t.prototype.applyTitle = function (e, title) {
      this.title = title;
      var n = 0,
        i = 0;
      if (title) {
        var r = function (e) {
            var t = nC(e);
            return !!t && ((n = t.x), (i = t.y), !0);
          },
          o = title.lastIndexOf("|");
        -1 !== o ? r(title.substr(o + 1)) && (title = title.substr(0, o)) : r(title) && (title = "");
      }
      e.setAttr("alt", title || null);
      e.setAttr("width", n === 0 ? null : String(n));
      e.setAttr("height", i === 0 ? null : String(i));
      var a = e.firstChild;
      if (a && a.instanceOf(HTMLImageElement)) {
        a.setAttr("alt", title || null);
        a.setAttr("width", n === 0 ? null : String(n));
        a.setAttr("height", i === 0 ? null : String(i));
      }
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 100;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(RO),
  _Y = (function (e) {
    function t(t, n, lang, code) {
      var o = e.call(this, t, n) || this;
      o.installed = false;
      o.rendered = false;
      o.lang = lang;
      o.code = code;
      return o;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t = this,
        n = this,
        i = n.app,
        r = n.editor,
        o = n.code,
        a = n.lang,
        s = (this.containerEl = createDiv("cm-preview-code-block cm-embed-block markdown-rendered cm-lang-" + a));
      s.tabIndex = -1;
      var l = s.createEl("pre"),
        c = l.createEl("code", "language-" + a);
      if ((tR.set(c, o), a === "mermaid")) JN(e.contentDOM, [c]);
      else if (a === "query") this.addChild(vR(i, o, l, r.path));
      else if (MarkdownPreviewRenderer.codeBlockPostProcessors.hasOwnProperty(a)) {
        s.empty();
        var u = s.createDiv("block-language-" + a),
          h = MarkdownPreviewRenderer.codeBlockPostProcessors[a];
        try {
          h(o, u, {
            docId: ic(16),
            sourcePath: r.path,
            frontmatter: {},
            promises: [],
            addChild: function (e) {
              return t.addChild(e);
            },
            getSectionInfo: function (n) {
              return s.contains(n)
                ? {
                    lineStart: t.lineStart,
                    lineEnd: t.lineEnd,
                    text: e.state.doc.toString(),
                  }
                : null;
            },
            replace: function (insert) {
              e.dispatch({
                changes: {
                  from: e.state.doc.line(t.lineStart + 1).from,
                  to: e.state.doc.line(t.lineEnd + 1).to,
                  insert: insert,
                },
              });
            },
            replaceCode: function (code) {
              t.code = code;
              tR.set(c, o);
              var i = t,
                from = i.start,
                a = i.end;
              t.end = from + code.length;
              e.dispatch({
                changes: {
                  from: from,
                  to: a,
                  insert: code,
                },
              });
            },
            containerEl: e.scrollDOM,
            el: u,
          });
        } catch (e) {
          console.error(e);
          new Notice(i18nProxy.interface.msgCodeblockRenderError());
          s.empty();
          l = s.createEl("pre");
          (c = l.createEl("code", "language-" + a)).setText(o);
        }
        var depth = cY(e.scrollDOM),
          d = s.findAll(".internal-embed:not(.is-loaded)");
        if (d.length > 0)
          for (var f = 0, m = d; f < m.length; f++) {
            var containerEl = m[f],
              linktext = containerEl.getAttribute("src"),
              y = vY.load({
                app: i,
                linktext: linktext,
                sourcePath: r.path,
                containerEl: containerEl,
                displayMode: true,
                showInline: true,
                depth: depth,
              });
            if (y) {
              this.addChild(y);
              y.loadFile();
            }
          }
      } else c.setText(o);
      this.addEditButton(e, s);
      this.resizeWidget(e, s);
      return s;
    };
    t.canRenderLang = function (e) {
      return e === "mermaid" || e === "query" || MarkdownPreviewRenderer.codeBlockPostProcessors.hasOwnProperty(e);
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 50;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(RO),
  jY = (function (e) {
    function t(t, n, texti0, clazz) {
      var o = e.call(this, t, n) || this;
      o.text = texti0;
      o.clazz = clazz;
      return o;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t = this,
        n = this,
        i = n.app,
        r = n.editor,
        o = n.text,
        a = n.clazz,
        containerEl = (this.containerEl = createDiv("cm-embed-block " + a));
      containerEl.tabIndex = -1;
      var l = containerEl.createDiv("markdown-rendered"),
        c = parseMetadata(o),
        frontmatter = parseYamlFrontmatter(c);
      visit(c, "checklist", function (e) {
        var t = e.position.start.line - 1;
        e.data.hProperties["data-line"] = String(t);
      });
      var h = sanitizeHTMLToDom(renderMarkdown(c));
      l.toggleClass("rtl", i.vault.getConfig("rightToLeft"));
      l.toggleClass("show-indentation-guide", i.vault.getConfig("showIndentGuide"));
      l.appendChild(h);
      MarkdownPreviewView.postProcess(this.app, {
        docId: ic(16),
        sourcePath: r.path,
        frontmatter: frontmatter,
        promises: [],
        addChild: function (e) {
          return t.addChild(e);
        },
        getSectionInfo: function () {
          return null;
        },
        replace: function () {
          return null;
        },
        containerEl: containerEl,
        el: l,
        displayMode: false,
      });
      this.resolveLinks();
      this.hookClickHandler(e, containerEl);
      this.addEditButton(e, containerEl);
      this.resizeWidget(e, containerEl);
      return containerEl;
    };
    t.prototype.resolveLinks = function () {
      mR(this.app, this.containerEl, this.editor.path);
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return (
          (function (e) {
            for (var t = 1, n = 0; -1 !== (n = e.indexOf("\n", n)); ) {
              t++;
              n++;
            }
            return t;
          })(this.text) * this.editor.cm.defaultLineHeight
        );
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(RO),
  GY = (function (e) {
    function t(t, n, i, r) {
      return e.call(this, t, n, r, "cm-callout") || this;
    }
    __extends(t, e);
    t.prototype.getTypePos = function () {
      var e = this.start,
        t = this.editor.cm.state.doc.lineAt(e),
        n = t.text.indexOf("[!") + 2;
      return [n, t.text.indexOf("]", n)];
    };
    t.prototype.getType = function () {
      var e = this.start,
        t = this.editor.cm.state.doc.lineAt(e),
        n = this.getTypePos(),
        i = n[0],
        r = n[1];
      return t.text.slice(i, r);
    };
    t.prototype.updateType = function (insert) {
      var t = this.start,
        n = this.editor.cm,
        i = this.getTypePos(),
        r = i[0],
        o = i[1];
      n.dispatch({
        changes: [
          {
            from: t + r,
            to: t + o,
            insert: insert,
          },
        ],
      });
    };
    t.prototype.remove = function () {
      for (
        var e = this,
          t = e.start,
          n = e.end,
          i = e.editor.cm,
          r = i.state.doc.lineAt(t),
          o = i.state.doc.lineAt(n),
          changes = [
            {
              from: r.from,
              to: r.to + 1,
              insert: "",
            },
          ],
          s = r.number + 1;
        s <= o.number;
        s++
      ) {
        var l = i.state.doc.line(s),
          c = Lm(l.text);
        changes.push({
          from: l.from,
          to: l.from + c,
          insert: "",
        });
      }
      i.dispatch({
        changes: changes,
      });
    };
    t.prototype.initDOM = function (t) {
      var n = this,
        i = e.prototype.initDOM.call(this, t);
      i.on("click", ".task-list-item-checkbox", function (e, r) {
        if (
          (function (e) {
            for (; e; ) {
              if (e === i) return !0;
              if (e.classList.contains("markdown-preview-view")) return !1;
              var t = e.parentElement;
              if (!t) return !1;
              e = t;
            }
          })(r)
        ) {
          var o = parseInt(r.getAttribute("data-line"));
          if (!(o < 0 || isNaN(o)) && r.instanceOf(HTMLInputElement)) {
            e.preventDefault();
            var a = MarkdownRenderer.toggleCheckbox(n.text, o);
            if (a !== null) {
              n.text = a.text;
              t.dom.win.setTimeout(function () {
                var checked = a.char !== " ";
                r.checked = checked;
                var t = r.parentNode;
                t &&
                  t.instanceOf(HTMLLIElement) &&
                  (t.setAttr("data-task", a.char), t.toggleClass("is-checked", checked));
              }, 0);
              t.dispatch({
                changes: [
                  {
                    from: n.start,
                    to: n.end,
                    insert: a.text,
                  },
                ],
              });
            }
          }
        }
      });
      i.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var i = n.getType(),
          r = Menu.forEvent(e).setNoIcon().addSections(["edit", "clipboard", "type", "", "danger"]);
        r.addItem(function (e) {
          return e
            .setTitle(i18nProxy.interface.menu.edit())
            .setSection("edit")
            .onClick(function () {
              return NO.selectElement(t, n.containerEl);
            });
        });
        r.setSectionSubmenu("type", {
          title: i18nProxy.callout.optionType(),
        });
        for (
          var o = function (e) {
              var t = kY[e];
              r.addItem(function (r) {
                return r
                  .setTitle(t())
                  .setSection("type")
                  .setChecked(e === i)
                  .onClick(function () {
                    return n.updateType(e);
                  });
              });
            },
            a = 0,
            s = Object.keys(kY);
          a < s.length;
          a++
        ) {
          o(s[a]);
        }
        r.addItem(function (e) {
          return e
            .setTitle(i18nProxy.callout.optionOther())
            .setSection("type")
            .onClick(function () {
              new lZ(n.app, function (e) {
                return n.updateType(e);
              }).open();
            });
        }).addItem(function (e) {
          return e
            .setTitle(i18nProxy.callout.type.none())
            .setSection("type")
            .onClick(function () {
              return n.remove();
            });
        });
      });
      return i;
    };
    return t;
  })(jY),
  KY = (function (e) {
    function t(math, block) {
      var i = e.call(this) || this;
      i.math = math;
      i.block = block;
      return i;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t = (this.containerEl = createEl(this.block ? "div" : "span", "math"));
      this.block && (t.createEl("br"), t.createEl("br"), this.addEditButton(e, t));
      this.hookClickHandler(e, t);
      this.resizeWidget(e, t);
      this.render(t);
      return t;
    };
    t.prototype.render = function (e) {
      var t = this;
      SN.then(function () {
        var n = t,
          i = n.math,
          r = n.block;
        e.toggleClass("math-block", r);
        e.toggleClass("cm-embed-block", r);
        var o = e.find(".edit-block-button");
        e.empty();
        try {
          var a = renderMath(i, r);
          e.appendChild(a);
        } catch (t) {
          e.appendText(i);
        }
        o && e.appendChild(o);
        finishRenderMath();
      });
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 50;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(NO),
  YY = ["script", "style", "link", "meta", "object", "embed", "webview"],
  ZY = (function (e) {
    function t(app, editor, html, block) {
      var o = e.call(this) || this;
      o.app = app;
      o.editor = editor;
      o.html = html;
      o.block = block;
      return o;
    }
    __extends(t, e);
    t.prototype.initDOM = function (e) {
      var t = this.block,
        n = this.html,
        i = (this.containerEl = createEl(t ? "div" : "span", "cm-html-embed" + (t ? " cm-embed-block" : "")));
      i.tabIndex = -1;
      i.appendChild(sanitizeHTMLToDom(n));
      t && this.addEditButton(e, i);
      this.app.fixFileLinks(i, this.editor.path);
      this.hookClickHandler(e, i);
      this.resizeWidget(e, i);
      return i;
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        return 40;
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(NO),
  XY = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.toDOM = function () {
      return createSpan();
    };
    t.prototype.ignoreEvent = function () {
      return !0;
    };
    t.prototype.eq = function () {
      return !0;
    };
    return t;
  })(WidgetType),
  QY = Decoration.widget({
    widget: new XY(),
    side: -1,
  }),
  $Y = (function () {
    function e(e) {
      this.tree = syntaxTree(e.state);
      this.decorations = this.buildDeco(e);
    }
    e.prototype.update = function (e) {
      var t,
        tree = syntaxTree(e.state);
      tree.length < e.view.viewport.to ||
      e.view.composing ||
      ((t = e.view.plugin(livePreviewState)) === null || undefined === t ? undefined : t.mousedown)
        ? (this.decorations = this.decorations.map(e.changes))
        : (tree != this.tree ||
            e.viewportChanged ||
            e.selectionSet ||
            Sm(e.transactions, EY) ||
            Sm(e.transactions, cm) ||
            Sm(e.transactions, um)) &&
          ((this.tree = tree), (this.decorations = this.buildDeco(e.view)));
    };
    return e;
  })(),
  JY = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.update = function (t) {
      var n,
        i = t.state,
        r = t.view;
      if (
        !t.docChanged &&
        t.selectionSet &&
        !((n = t.view.plugin(livePreviewState)) === null || undefined === n ? undefined : n.mousedown)
      ) {
        var o = i.selection,
          a = this.decorations,
          s = false,
          l = function (e, t, n, i, r) {
            t <= e &&
              e <= n &&
              (i === decoTY0
                ? (e = Math.min(t, e))
                : i === deco
                  ? (e = Math.max(n, e))
                  : i === decoDY0 && r && (e = Math.min(t, e)));
            return e;
          },
          c = o.ranges.map(function (e) {
            for (
              var t = e.anchor,
                n = e.head,
                r = t,
                o = n,
                c = i.doc.lineAt(r).number !== i.doc.lineAt(o).number,
                u = false,
                h = function (e, t, n) {
                  var i = l(r, e, t, n, c),
                    a = l(o, e, t, n, c);
                  if (!(i === r && a === o)) {
                    r = i;
                    o = a;
                    u = true;
                  }
                },
                p = 0;
              p < 10 && ((u = false), a.between(r, r, h), r !== o && a.between(o, o, h), u);
              p++
            );
            return r !== t || o !== n ? ((s = true), EditorSelection.range(r, o)) : e;
          });
        if (s) {
          t.view.dom.win.setTimeout(function () {
            o === i.selection &&
              r.dispatch({
                selection: EditorSelection.create(c, o.mainIndex),
              });
          });
        }
      }
      e.prototype.update.call(this, t);
    };
    t.prototype.buildDeco = function (e) {
      if (!this.tree.length) return Decoration.none;
      for (
        var t = e.state,
          n = e.hasFocus ? t.selection.ranges : [],
          i = t.field(pm),
          r = hm.get("obsidian-search-match-highlight"),
          o = function (e, t) {
            return km(n, e, t) || Cm(i, r, e, t);
          },
          a = function (e) {
            var n = t.doc.lineAt(e);
            return o(n.from, n.to);
          },
          s = new RangeSetBuilder(),
          l = 0,
          c = function (from, n) {
            var i = from,
              r = from,
              c = null,
              h = function (e) {
                c || (c = []);
                c.push(e);
              },
              p = function (e) {
                if (c) {
                  if (o(i, r))
                    for (var t = 0, n = c; t < n.length; t++) {
                      if ((h = n[t]).always) {
                        s.add(h.from, h.to, h.deco);
                      }
                    }
                  else {
                    if (c.length > 1) {
                      var a = c.last();
                      if (a.deco === decoTY0) {
                        a.deco = deco;
                      }
                    }
                    for (var l = 0, u = c; l < u.length; l++) {
                      var h = u[l];
                      s.add(h.from, h.to, h.deco);
                    }
                  }
                  c = null;
                }
                i = e;
                r = e;
              },
              d = "",
              f = false;
            u.tree.iterate({
              from: from,
              to: n,
              enter: function (e) {
                var n = e.type,
                  fromi0 = e.from,
                  froms0 = e.to,
                  c = n.prop(tokenClassNodeProp),
                  u = function () {
                    return t.doc.sliceString(fromi0, froms0);
                  };
                if (((fromi0 === r && c) || p(fromi0), c)) {
                  if (fromi0 < l) return;
                  l = froms0;
                  var m = c.split(" "),
                    g = new Set(m);
                  if (g.has("hmd-codeblock")) return;
                  if (g.has("formatting-header")) {
                    var v = t.doc.lineAt(fromi0);
                    return void (
                      o(v.from, v.to) ||
                      v.text.trim() === u().trim() ||
                      h({
                        from: fromi0,
                        to: froms0,
                        deco: decoDY0,
                      })
                    );
                  }
                  if (g.has("formatting-quote"))
                    return void (
                      a(fromi0) ||
                      (g.has("quote-1")
                        ? h({
                            from: fromi0,
                            to: fromi0 + 1,
                            deco: decoLY0,
                          })
                        : h({
                            from: fromi0,
                            to: fromi0 + 1,
                            deco: decoFY0,
                          }))
                    );
                  if (g.has("hmd-escape-backslash")) {
                    a(fromi0) ||
                      h({
                        from: fromi0,
                        to: froms0,
                        deco: decoTY0,
                      });
                  }
                  var y = m.some(function (e) {
                      return MY.has(e);
                    }),
                    b = g.has("formatting"),
                    w = g.has("string") && g.has("url"),
                    k = g.has("link") && !g.has("url") && !b,
                    C =
                      g.has("hmd-internal-link") &&
                      !g.has("link-has-alias") &&
                      !g.has("link-alias-pipe") &&
                      !g.has("hmd-embed"),
                    E = k || C,
                    S = g.has("image"),
                    M = g.has("formatting-link") || g.has("link-has-alias") || g.has("link-alias-pipe"),
                    x = g.has("formatting-task"),
                    T = g.has("formatting-link-end") || w,
                    D = g.has("formatting-list-ul"),
                    A = g.has("url") && !g.has("string");
                  if (
                    (S ? (f = true) : f && !g.has("url") && (f = false),
                    g.has("formatting-link-start") &&
                      t.doc.length >= froms0 + 2 &&
                      t.doc.sliceString(froms0, froms0 + 2) === "]]")
                  )
                    return;
                  if (g.has("formatting-link-end") && fromi0 >= 2 && t.doc.sliceString(fromi0 - 2, fromi0) === "[[")
                    return;
                  var P = M || w || E || x || D || A;
                  if (
                    (g.has("hmd-barelink") && !g.has("hmd-footnote") && (b = P = false),
                    M && g.has("link") && g.has("url"))
                  ) {
                    o(fromi0, froms0) ||
                      h({
                        from: fromi0,
                        to: froms0,
                        deco: decoPY0,
                      });
                    froms0 + 1 < t.doc.length &&
                      t.doc.sliceString(froms0, froms0 + 1) === ">" &&
                      h({
                        from: froms0,
                        to: froms0 + 1,
                        deco: deco,
                      });
                    return void (r = froms0 + 1);
                  }
                  if (
                    (((M && g.has("link") && u() === "]") || (b && w && u() === "(")) && (T = true),
                    (y || P) && ((r = froms0), b || P))
                  ) {
                    var L = {
                      from: fromi0,
                      to: froms0,
                      deco: T ? deco : decoTY0,
                    };
                    if (x) {
                      var I = t.doc.sliceString(fromi0 + 1, fromi0 + 2);
                      L.deco = Decoration.widget({
                        widget: new HY(I),
                      });
                    } else if (D) {
                      var O = (v = t.doc.lineAt(fromi0)).text.match(Ab);
                      if (!(O && O[6])) {
                        L.deco = decoBY0;
                        L.to = r = fromi0 + 1;
                      }
                    } else if (E) {
                      var F = u();
                      C &&
                        F.length > 1 &&
                        F.startsWith("#") &&
                        (h({
                          from: fromi0,
                          to: fromi0 + 1,
                          deco: decoTY0,
                        }),
                        L.from++);
                      L.deco = decoPY0;
                    } else if (A) {
                      L.deco = decoPY0;
                    }
                    h(L);
                  }
                  if (
                    (g.has("formatting-list-ol") &&
                      ((r = froms0),
                      h({
                        from: fromi0,
                        to: froms0,
                        deco: decoVY0,
                      })),
                    g.has("url") && !b)
                  )
                    d = u();
                  else if (g.has("url") && b && d && u() === ")" && !f) {
                    if (!isRelativePath(d)) {
                      var N =
                        Array.from(g)
                          .map(function (e) {
                            return "cm-" + e;
                          })
                          .join(" ") + " external-link";
                      h({
                        from: froms0,
                        to: froms0,
                        always: true,
                        deco: Decoration.widget({
                          widget: new zY(N),
                        }),
                      });
                    }
                    d = "";
                  } else d = "";
                }
              },
            });
            p(0);
          },
          u = this,
          h = 0,
          p = e.visibleRanges;
        h < p.length;
        h++
      ) {
        var d = p[h];
        c(d.from, d.to);
      }
      return s.finish();
    };
    return t;
  })($Y),
  eZ = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.buildDeco = function (e) {
      if (!this.tree.length) return Decoration.none;
      for (var t = e.state, n = new RangeSetBuilder(), i = 0, r = e.visibleRanges; i < r.length; i++) {
        var o = r[i],
          from = o.from,
          s = o.to;
        this.tree.iterate({
          from: from,
          to: s,
          enter: function (e) {
            var i = e.type,
              r = e.from,
              o = i.prop(lineClassNodeProp);
            if (o && o.contains("HyperMD-task-line")) {
              var a = t.doc.lineAt(r).text.match(Ab);
              if (a && a[6]) {
                n.add(
                  r,
                  r,
                  Decoration.line({
                    attributes: {
                      "data-task": a[6],
                    },
                  }),
                );
              }
            }
          },
        });
      }
      return n.finish();
    };
    return t;
  })($Y);
function tZ(e, t) {
  var n = e.app,
    i = cY(e.cm.scrollDOM),
    r = [],
    o = [],
    a = [],
    s = [],
    l = [],
    c = [],
    u = [],
    h = false,
    p = function (t) {
      for (var n = 0, i = t; n < i.length; n++)
        for (var r = 0, o = i[n].children; r < o.length; r++) {
          var a = o[r];
          e.removeChild(a);
        }
    };
  e.cleanupLivePreview = function () {
    p(r);
    r = [];
    p(o);
    o = [];
    p(s);
    s = [];
    p(a);
    a = [];
    l = [];
    c = [];
    u = [];
  };
  var d = function (h) {
    var d = h.state,
      f = syntaxTree(d),
      m = d.doc,
      g = t.hasFocus ? d.selection.ranges : [],
      v = d.field(pm),
      y = hm.get("obsidian-search-match-highlight"),
      b = function (e, t) {
        return km(g, e, t) || Cm(v, y, e, t);
      },
      w = function (e, t, n) {
        e.block && n === m.length && (e.inclusiveEnd = false);
        return Decoration.replace(e).range(t, n);
      },
      k = e.path,
      C = [],
      E = r.slice();
    r = [];
    var S = o.slice();
    o = [];
    var M = s.slice();
    s = [];
    var x = a.slice();
    a = [];
    var T = l.slice();
    l = [];
    var D = c.slice();
    c = [];
    var A = u.slice();
    u = [];
    var P = false,
      L = -1,
      I = -1,
      O = -1,
      F = "",
      N = false,
      R = "",
      B = "",
      V = -1,
      H = -1,
      z = -1,
      q = false,
      W = -1,
      U = "",
      _ = -1,
      j = "",
      G = -1,
      K = -1,
      Y = -1,
      Z = -1,
      X = function (t, o, a) {
        var s = parseAliasLink(t),
          l = s.href,
          c = s.title,
          u = cZ(E, function (e) {
            return e.sourcePath === k && e.href === l;
          });
        u ? u.title !== c && u.applyTitle(u.containerEl, c) : (u = new UY(n, e, k, l, c, i));
        u.setPos(o, a);
        r.push(u);
        return u;
      },
      Q = function (widget, t, n) {
        var i = m.lineAt(t),
          r = i.from,
          o = i.to,
          a = i.text,
          block = t === r && a.substr(n - r).trim() === "";
        block
          ? b(r, o)
            ? C.push(
                Decoration.widget({
                  widget: widget,
                  block: block,
                  side: 1,
                }).range(o),
              )
            : C.push(
                w(
                  {
                    widget: widget,
                    block: block,
                    side: 1,
                  },
                  r,
                  o,
                ),
              )
          : b(t, n)
            ? C.push(
                Decoration.widget({
                  widget: widget,
                  side: 1,
                }).range(n),
              )
            : C.push(
                Decoration.replace({
                  widget: widget,
                  side: 1,
                }).range(t, n),
              );
      },
      $ = function (i) {
        if (-1 !== G && K < i) {
          var r = m.sliceString(G, K),
            widget = cZ(M, function (e) {
              return e.text === r;
            });
          b(G, K) ||
            (widget || (widget = new GY(n, e, t, r)),
            C.push(
              w(
                {
                  widget: widget,
                  side: 1,
                  block: !0,
                },
                G,
                K,
              ),
            ));
          widget && (widget.setPos(G, K), s.push(widget));
          G = -1;
          K = -1;
        }
      },
      J = function (t) {
        if (-1 !== Y && Z < t) {
          for (
            var i = h.changes,
              r = h.docChanged,
              o = m.slice(Y, Z),
              s = Z !== f.length - 1 || f.length === m.length,
              l = i.invertedDesc.mapPos(Y),
              widget = null,
              u = 0,
              p = x;
            u < p.length;
            u++
          ) {
            var d = p[u],
              g = d.start;
            if (l === g || Y === g || (i.length >= g && Y === i.mapPos(g))) {
              if (s ? d.receiveUpdate(h, o) : !r || d.receiveIncompleteUpdate(h, o)) {
                widget = d;
                x.remove(d);
                break;
              }
            }
          }
          if (!Cm(v, y, Y, Z)) {
            if (!widget) {
              widget = new SR(n, e, o, s);
            }
            var inclusiveStart = Y > 0 && Y > wb(h.newDoc) + 1;
            C.push(
              w(
                {
                  widget: widget,
                  side: 1,
                  block: true,
                  inclusiveStart: inclusiveStart,
                },
                Y,
                Z,
              ),
            );
            Platform.isAndroidApp && Z !== m.length && C.push(QY.range(Z + 1));
          }
          widget && (widget.setPos(Y, Z), widget.receiveSelection(h), a.push(widget));
          Y = -1;
          Z = -1;
        }
      };
    f.iterate({
      enter: function (t) {
        var i = t.type,
          r = t.from,
          a = t.to,
          s = i.prop(tokenClassNodeProp);
        if ((s && ($(r), J(r)), s && !(-1 !== G || -1 !== Y)))
          if ((oe = new Set(s.split(" "))).has("hmd-codeblock"));
          else if (oe.has("formatting-math-begin")) {
            H = r;
            z = a;
            q = oe.has("math-block");
          } else if (-1 !== H) {
            if (oe.has("formatting-math-end")) {
              var h = r,
                p = a,
                block = q,
                f = m.sliceString(z, h);
              (widget = cZ(T, function (e) {
                return e.math === f && e.block === block;
              })) || (widget = new KY(f, block));
              l.push(widget);
              widget.setPos(block && f.startsWith("\n") ? z + 1 : z, block && f.endsWith("\n") ? h - 1 : h);
              block =
                block &&
                (function (e, t) {
                  var n = m.lineAt(e),
                    i = n.from,
                    r = n.text,
                    o = m.lineAt(t),
                    a = o.from,
                    s = o.text;
                  return r.substr(0, e - i).trim() === "" && s.substr(t - a).trim() === "";
                })(H, p);
              b(H, p)
                ? q &&
                  C.push(
                    Decoration.widget({
                      widget: widget,
                      block: block,
                      side: 1,
                    }).range(p),
                  )
                : C.push(
                    w(
                      {
                        widget: widget,
                        block: block,
                        side: 1,
                      },
                      H,
                      p,
                    ),
                  );
              H = -1;
              z = -1;
            }
          } else if (oe.has("formatting-link-start")) {
            P = oe.has("formatting-embed");
            L = r;
            I = a;
          } else if (L > -1) {
            if (oe.has("hmd-internal-link")) {
              F += m.sliceString(r, a);
              O = a;
            } else {
              if (oe.has("formatting-link-end") && F)
                if (P) {
                  var widget = X(F, L, a);
                  Q(widget, L, a);
                } else {
                  var v = parseLinktext((E = parseAliasLink(F).href)).path;
                  if (!n.metadataCache.getFirstLinkpathDest(v, k)) {
                    C.push(IY.range(I, O));
                  }
                }
              F = "";
              L = -1;
            }
          } else if (oe.has("image-marker")) {
            N = true;
            V = r;
          } else if (oe.has("image-alt-text") && !oe.has("formatting")) R = m.sliceString(r, a);
          else if (N && oe.has("url") && !oe.has("formatting")) B = m.sliceString(r, a);
          else if (N && B && oe.has("formatting")) {
            widget = undefined;
            if (isRelativePath((B = extractTagName(B)))) {
              var y = undefined;
              try {
                y = decodeURI(B);
              } catch (e) {
                return;
              }
              var E = Kc(y).trim();
              widget = X(E + "|" + R, V, a);
            } else {
              B = normalizeURL(B);
              Platform.isDesktopApp && B.startsWith("file:///") && (B = Platform.resourcePathPrefix + B.substr(8));
              var M = cZ(A, function (e) {
                return e.url === B && e.title === R;
              });
              M || (M = new WY(B, R));
              u.push(M);
              M.setPos(V, a);
              widget = M;
            }
            Q(widget, V, a);
            N = false;
            B = "";
            R = "";
            V = -1;
          } else if (oe.has("hmd-html-begin")) _ = r;
          else if (_ > -1 && !j && oe.has("tag")) j = m.sliceString(r, a);
          else if (oe.has("hmd-html-end") && j && !YY.contains(j)) {
            var x = a,
              ee = m.sliceString(_, x),
              te = m.lineAt(_),
              ne = m.lineAt(x),
              blockie0 = !isInlineElement(j);
            if (
              (m.sliceString(te.from, _).trim() || m.sliceString(x, ne.to).trim() || ((_ = te.from), (x = ne.to)),
              !b(_, x))
            ) {
              (widget = cZ(D, function (e) {
                return e.html === ee && e.block === blockie0;
              })) || (widget = new ZY(n, e, ee, blockie0));
              c.push(widget);
              widget.setPos(_, x);
              C.push(
                w(
                  {
                    widget: widget,
                    block: blockie0,
                    side: 1,
                  },
                  _,
                  x,
                ),
              );
            }
            _ = -1;
            j = "";
          } else if (oe.has("hr")) {
            b(r, a) ||
              C.push(
                w(
                  {
                    widget: widgetRY0,
                    block: !0,
                  },
                  r,
                  a,
                ),
              );
          }
        var re = i.prop(lineClassNodeProp);
        if (re) {
          var oe,
            ae = re.split(" ");
          if (
            ((oe = new Set(ae)).has("HyperMD-callout") && oe.has("HyperMD-quote-1") && ($(r), (G = r), (K = a)),
            oe.has("HyperMD-quote") && -1 !== G && (r - K > 1 ? $(r) : (K = a)),
            oe.has("HyperMD-table-row") && ($(r), r - Z > 1 && J(r), -1 === Y && (Y = r), (Z = a)),
            oe.has("HyperMD-codeblock-begin") && -1 === W)
          ) {
            var se = m.lineAt(r);
            W = r;
            U = "";
            var le = se.text;
            if (oe.has("HyperMD-list-line")) {
              var ce = se.text.match(Ab);
              if (ce) {
                W = se.from + ce[0].length;
                le = le.slice(ce[0].length);
              }
            }
            var ue = le.match(xY);
            if (ue) {
              U = ue[2];
            }
          }
          if (oe.has("HyperMD-codeblock-end") && -1 !== W) {
            var he = W;
            if (((W = -1), b(he, a))) return;
            if ((ne = m.lineAt(r)).number <= 1) return;
            if ((te = m.lineAt(he)).number >= m.lines) return;
            var pe = m.line(te.number + 1).from,
              de = m.line(ne.number - 1).to;
            if (de < pe) {
              de = pe;
            }
            var fe = m.sliceString(pe, de);
            if (_Y.canRenderLang(U)) {
              (widget = cZ(S, function (e) {
                return e.lang === U && e.code === fe;
              })) || (widget = new _Y(n, e, U, fe));
              widget.setPos(pe, de);
              widget.lineStart = te.number - 1;
              widget.lineEnd = ne.number - 1;
              o.push(widget);
              C.push(
                w(
                  {
                    widget: widget,
                    block: !0,
                  },
                  he,
                  a,
                ),
              );
            } else {
              var me = U;
              try {
                var ge = CodeMirror.findModeByName(me);
                if (ge && ge.name !== "null") {
                  me = ge.name;
                }
              } catch (e) {}
              C.push(decoTY0.range(he, te.to));
              C.push(
                Decoration.widget({
                  widget: new qY(me, fe),
                }).range(te.to),
              );
              C.push(deco.range(ne.from, ne.to));
            }
          }
        }
        $(r);
        J(r);
      },
    });
    $(f.length + 1);
    J(f.length + 1);
    e.tableCell &&
      e.tableCell.cm.hasFocus &&
      h.docChanged &&
      (h.isUserEvent("undo") || h.isUserEvent("redo")) &&
      !e.tableCell.table.containsSelection(d.selection) &&
      t.focus();
    p(E);
    p(S);
    p(M);
    p(x);
    return Decoration.set(C, !0);
  };
  return StateField.define({
    create: function () {
      return Decoration.none;
    },
    update: function (e, n) {
      var i,
        r = true;
      if (
        (ensureSyntaxTree(n.state, t.viewport.to + 2e3, 20) || (r = false),
        (Sm([n], EY) || Sm([n], cm) || Sm([n], um)) && (r = true),
        (t.composing ||
          h ||
          ((i = t.plugin(livePreviewState)) === null || undefined === i ? undefined : i.mousedown)) &&
          (r = false),
        r)
      ) {
        h = true;
        try {
          e = d(n);
        } finally {
          h = false;
        }
      } else {
        e = e.map(n.changes);
        (function (e) {
          if (e.docChanged && a.length)
            for (var t = e.changes, n = 0, i = a; n < i.length; n++) {
              var r = i[n],
                o = r.start,
                s = r.end,
                l = t.touchesRange(o, s);
              if (!(t.length < o || t.length < s)) {
                o = t.mapPos(o);
                s = t.mapPos(s);
                r.setPos(o, s);
                l && r.receiveUpdate(e, e.newDoc.slice(o, s)) && r.receiveSelection(e);
              }
            }
        })(n);
      }
      (function (e) {
        if (e.selection && a.length)
          for (var t = 0, n = a; t < n.length; t++) {
            var i = n[t];
            i.containedBySelection(e.selection)
              ? i.selectTable()
              : (i.deselectTable(), i.containsSelection(e.selection) || i.deselectCells());
          }
      })(n);
      return e;
    },
    provide: function (e) {
      return EditorView.decorations.from(e);
    },
  });
}
var nZ = function (e) {
    e.dom.win.setTimeout(function () {
      return e.dispatch({
        effects: EY.of(),
      });
    }, 10);
  },
  iZ = [
    ViewPlugin.define(function (e) {
      var t = {
          capture: !0,
        },
        n = function (n) {
          if (n.button === 0) {
            if (e.scrollDOM.scrollHeight > e.scrollDOM.clientHeight)
              if (n.clientX > e.scrollDOM.getBoundingClientRect().x + e.scrollDOM.clientWidth) return;
            var i = e.state.selection,
              r = e.state.doc,
              o = e.scrollDOM.scrollTop,
              a = e.plugin(livePreviewState);
            if (a) {
              a.mousedown = true;
              var s = e.scrollDOM.doc,
                l = function () {
                  s.removeEventListener("mouseup", c, t);
                  s.removeEventListener("drag", u, t);
                  a.mousedown = false;
                  (e.state.selection.eq(i) && e.state.doc.eq(r) && e.scrollDOM.scrollTop === o) ||
                    e.dom.win.setTimeout(function () {
                      e.dispatch({
                        annotations: [mm.of(!0)],
                        selection: e.state.selection,
                      });
                    }, 50);
                },
                c = function (e) {
                  if (e.button === 0) {
                    l();
                  }
                },
                u = function () {
                  l();
                };
              s.addEventListener("mouseup", c, t);
              s.addEventListener("drag", u, t);
            }
          }
        };
      e.scrollDOM.addEventListener("mousedown", n, t);
      return {
        destroy: function () {
          e.scrollDOM.removeEventListener("mousedown", n, t);
        },
      };
    }),
    EditorView.domEventHandlers({
      focus: function (e, t) {
        return nZ(t);
      },
      blur: function (e, t) {
        return nZ(t);
      },
      touchstart: function (e, t) {
        if (!t.hasFocus && Platform.isIosApp) {
          var n = e.target;
          if (n && n.closest(".cm-underline")) return !0;
        }
      },
      mousedown: function (e) {
        if (e.button === 0 && (Keymap.isModifier(e, "Mod") || (!e.shiftKey && !e.altKey))) {
          var t = e.targetNode;
          if (t.instanceOf(Element)) {
            var n = t.matchParent('[draggable="true"]');
            if (n) {
              n.setAttr("contenteditable", !1);
              var preventDefault = e.preventDefault;
              e.preventDefault = function () {
                e.preventDefault = preventDefault;
              };
              return !0;
            }
          }
        }
      },
    }),
  ],
  rZ = function (e) {
    return ViewPlugin.define(function (t) {
      var n = e.app.workspace.on("post-processor-change", function () {
        return nZ(t);
      });
      return {
        destroy: function () {
          n.e.offref(n);
        },
      };
    });
  },
  oZ = ViewPlugin.define(
    function (e) {
      return new JY(e);
    },
    {
      decorations: function (e) {
        return e.decorations;
      },
    },
  ),
  aZ = ViewPlugin.define(
    function (e) {
      return new eZ(e);
    },
    {
      decorations: function (e) {
        return e.decorations;
      },
    },
  );
function sZ(e, t) {
  var n = tZ(e, t);
  function getNextPosUpDown(e, t, i) {
    var r = e.doc.lineAt(t.head),
      o = r.number + (i ? 1 : -1);
    if (o < 1 || o > e.doc.lines) return null;
    var a = e.doc.line(o),
      s = true,
      l = null;
    if (
      (e.field(n).between(a.from, a.to, function (e, t, n) {
        if (n.spec.block) return l || e > a.from || t < a.to ? ((s = false), !1) : void (l || (l = n));
      }),
      !s || !l)
    )
      return null;
    if (!l.spec.block) return null;
    var c = t.head - r.from;
    return EditorSelection.cursor(a.from + Math.min(a.length, c), t.assoc);
  }
  function r(e, n, r) {
    var o = e.state,
      a = o.selection,
      selection = EditorSelection.create(
        a.ranges.map(function (a) {
          var s = (function (a) {
            if (!n && !a.empty) return EditorSelection.cursor(r ? a.to : a.from);
            var s = e.moveVertically(a, r),
              l = s.head != a.head ? s : e.moveToLineBoundary(a, r);
            if (!r && !n && bb(e, a.head)) {
              var c = t.state.field(editorInfoField);
              if (QT(c)) {
                c.shiftFocusBefore();
                return l;
              }
            }
            var u = getNextPosUpDown(o, a, r);
            return u && Math.abs(s.head - a.head) > Math.abs(u.head - a.head) ? u : l;
          })(a);
          n && (s = EditorSelection.range(a.anchor, s.head, s.goalColumn));
          return s;
        }),
        a.mainIndex,
      );
    selection.eq(o.selection) ||
      e.dispatch(
        o.update({
          selection: selection,
          scrollIntoView: true,
          userEvent: "select",
        }),
      );
    return !0;
  }
  var o = Prec.high(
      keymap.of([
        {
          key: "ArrowUp",
          run: function (e) {
            return r(e, !1, !1);
          },
          shift: function (e) {
            return r(e, !0, !1);
          },
        },
        {
          key: "ArrowDown",
          run: function (e) {
            return r(e, !1, !0);
          },
          shift: function (e) {
            return r(e, !0, !0);
          },
        },
      ]),
    ),
    a = Prec.low(
      ViewPlugin.define(function (e) {
        e.getNextPosUpDown = getNextPosUpDown;
        return {
          destroy: function () {
            delete e.getNextPosUpDown;
          },
        };
      }),
    ),
    s = [];
  if (Platform.isMobile) {
    var l = debounce(
      function () {
        var e = t.plugin(livePreviewState);
        if (e) {
          e.mousedown = false;
          t.dom.removeClass("dragging-mobile-cursor");
          t.dispatch({
            effects: EY.of(),
          });
        }
      },
      700,
      !0,
    );
    s.push(
      EditorView.updateListener.of(function (e) {
        e.docChanged
          ? l.run()
          : e.transactions.some(function (e) {
              return e.isUserEvent("select");
            }) && ((t.plugin(livePreviewState).mousedown = true), t.dom.addClass("dragging-mobile-cursor"), l());
      }),
    );
  }
  return __spreadArray(
    __spreadArray([livePreviewState], s, !0),
    [oZ, aZ, n, o, iZ, rZ(e), a, MR(e, n), SR.cellSanitizerPlugin(e), SR.detectSurroundingClick(n)],
    !1,
  );
}
var lZ = (function (e) {
  function t(t, onSubmit) {
    var i = e.call(this, t) || this;
    i.onSubmit = onSubmit;
    i.setPlaceholder(i18nProxy.callout.optionOtherPlaceholder());
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
  t.prototype.getItemText = function (e) {
    return e;
  };
  t.prototype.getItems = function () {
    return CY;
  };
  t.prototype.getSuggestions = function (item) {
    var n = e.prototype.getSuggestions.call(this, item);
    return n.length === 0
      ? [
          {
            item: item,
            match: {
              score: 0,
              matches: [],
            },
          },
        ]
      : n;
  };
  t.prototype.onChooseItem = function (e, t) {
    this.onSubmit(e);
  };
  return t;
})(FuzzySuggestModal);
function cZ(e, t) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    if (t(i)) {
      e.splice(n, 1);
      return i;
    }
  }
  return null;
}
const hX = (e, t) => t.some((t) => e instanceof t);
let pX, dX;
const fX = new WeakMap(),
  mX = new WeakMap(),
  gX = new WeakMap();
let vX = {
  get(e, t, n) {
    if (e instanceof IDBTransaction) {
      if (t === "done") return fX.get(e);
      if (t === "store") return n.objectStoreNames[1] ? undefined : n.objectStore(n.objectStoreNames[0]);
    }
    return kX(e[t]);
  },
  set: (e, t, n) => ((e[t] = n), !0),
  has: (e, t) => (e instanceof IDBTransaction && (t === "done" || t === "store")) || t in e,
};
function yX(e) {
  vX = e(vX);
}
function bX(e) {
  return (
    dX || (dX = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])
  ).includes(e)
    ? function (...t) {
        e.apply(CX(this), t);
        return kX(this.request);
      }
    : function (...t) {
        return kX(e.apply(CX(this), t));
      };
}
function wX(e) {
  return typeof e == "function"
    ? bX(e)
    : (e instanceof IDBTransaction &&
        (function (e) {
          if (fX.has(e)) return;
          const t = new Promise((t, n) => {
            const i = () => {
                e.removeEventListener("complete", r);
                e.removeEventListener("error", o);
                e.removeEventListener("abort", o);
              },
              r = () => {
                t();
                i();
              },
              o = () => {
                n(e.error || new DOMException("AbortError", "AbortError"));
                i();
              };
            e.addEventListener("complete", r);
            e.addEventListener("error", o);
            e.addEventListener("abort", o);
          });
          fX.set(e, t);
        })(e),
      hX(e, pX || (pX = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])) ? new Proxy(e, vX) : e);
}
function kX(e) {
  if (e instanceof IDBRequest)
    return (function (e) {
      const t = new Promise((t, n) => {
        const i = () => {
            e.removeEventListener("success", r);
            e.removeEventListener("error", o);
          },
          r = () => {
            t(kX(e.result));
            i();
          },
          o = () => {
            n(e.error);
            i();
          };
        e.addEventListener("success", r);
        e.addEventListener("error", o);
      });
      gX.set(t, e);
      return t;
    })(e);
  if (mX.has(e)) return mX.get(e);
  const t = wX(e);
  t !== e && (mX.set(e, t), gX.set(t, e));
  return t;
}
const CX = (e) => gX.get(e);
function EX(e, t, { blocked: blocked, upgrade: upgrade, blocking: blocking, terminated: terminated } = {}) {
  const a = indexedDB.open(e, t),
    s = kX(a);
  upgrade &&
    a.addEventListener("upgradeneeded", (e) => {
      upgrade(kX(a.result), e.oldVersion, e.newVersion, kX(a.transaction), e);
    });
  blocked && a.addEventListener("blocked", (e) => blocked(e.oldVersion, e.newVersion, e));
  s.then((e) => {
    terminated && e.addEventListener("close", () => terminated());
    blocking && e.addEventListener("versionchange", (e) => blocking(e.oldVersion, e.newVersion, e));
  }).catch(() => {});
  return s;
}
const SX = ["get", "getKey", "getAll", "getAllKeys", "count"],
  MX = ["put", "add", "delete", "clear"],
  xX = new Map();
function TX(e, t) {
  if (!(e instanceof IDBDatabase) || t in e || typeof t != "string") return;
  if (xX.get(t)) return xX.get(t);
  const n = t.replace(/FromIndex$/, ""),
    i = t !== n,
    r = MX.includes(n);
  if (!(n in (i ? IDBIndex : IDBObjectStore).prototype) || (!r && !SX.includes(n))) return;
  const o = async function (e, ...t) {
    const o = this.transaction(e, r ? "readwrite" : "readonly");
    let a = o.store;
    i && (a = a.index(t.shift()));
    return (await Promise.all([a[n](...t), r && o.done]))[0];
  };
  xX.set(t, o);
  return o;
}
yX((e) => ({
  ...e,
  get: (t, n, i) => TX(t, n) || e.get(t, n, i),
  has: (t, n) => !!TX(t, n) || e.has(t, n),
}));
const DX = ["continue", "continuePrimaryKey", "advance"],
  AX = {},
  PX = new WeakMap(),
  LX = new WeakMap(),
  IX = {
    get(e, t) {
      if (!DX.includes(t)) return e[t];
      let n = AX[t];
      n ||
        (n = AX[t] =
          function (...e) {
            PX.set(this, LX.get(this)[t](...e));
          });
      return n;
    },
  };
async function* OX(...e) {
  let t = this;
  if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return;
  const n = new Proxy(t, IX);
  for (LX.set(n, t), gX.set(n, CX(t)); t; ) {
    yield n;
    t = await (PX.get(n) || t.continue());
    PX.delete(n);
  }
}
function FX(e, t) {
  return (
    (t === Symbol.asyncIterator && hX(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
    (t === "iterate" && hX(e, [IDBIndex, IDBObjectStore]))
  );
}
function NX(e) {
  getExtension(getFilename(e)) === "md" && (e = e.substring(0, e.length - 3));
  return e;
}
yX((e) => ({
  ...e,
  get: (t, n, i) => (FX(t, n) ? OX : e.get(t, n, i)),
  has: (t, n) => FX(t, n) || e.has(t, n),
}));
var RX = function (e, t) {
    return e.path.length - t.path.length;
  },
  BX = function (e, t) {
    if (!t) return !1;
    for (var n = 0, i = Object.keys(t); n < i.length; n++) {
      var r = i[n];
      if (e.contains(getFilename(r).toLowerCase())) return !0;
    }
    return !1;
  };
function VX(e) {
  return e.trim().length !== 0 && !e.contains("\n") && !(e.length > 100 && e.contains(" "));
}
var HX = (function () {
  function e(app) {
    this.cache = {};
    this.app = app;
  }
  e.prototype.clear = function () {
    this.cache = {};
  };
  e.prototype.getForFile = function (e, filet0) {
    return __awaiter(this, undefined, Promise, function () {
      var mtime, i, r, content, a, blocks, l, c, u, node, display, error, f, m, g, v, y;
      return __generator(this, function (b) {
        switch (b.label) {
          case 0:
            return filet0.extension !== "md"
              ? [2, null]
              : ((mtime = filet0.stat.mtime),
                (i = this.cache).hasOwnProperty(filet0.path) &&
                (r = i[filet0.path]).file === filet0 &&
                r.mtime === mtime
                  ? [2, r]
                  : [4, this.app.vault.cachedRead(filet0)]);
          case 1:
            if (((content = b.sent()), e.isCancelled())) return [2, null];
            a = parseMetadata(content);
            blocks = [];
            b.label = 2;
          case 2:
            b.trys.push([2, 7, 8, 13]);
            l = true;
            c = __asyncValues(
              cx(lx(a.children), {
                maxDelay: 0,
              }),
            );
            b.label = 3;
          case 3:
            return [4, c.next()];
          case 4:
            if (((u = b.sent()), (m = u.done))) return [3, 6];
            if (((y = u.value), (l = false), (node = y), e.isCancelled())) return [3, 6];
            if (node.type === "yaml") return [3, 5];
            if (node.type === "list") {
              visit(node, "listItem", function (node) {
                var display = nodeToPlainText(node).trim();
                if (display) {
                  blocks.push({
                    display: display,
                    node: node,
                  });
                }
              });
              return [3, 5];
            }
            if ((display = nodeToPlainText(node).trim()) === "") return [3, 5];
            node.type === "heading" &&
              (display =
                Array(node.depth || 1)
                  .fill("#")
                  .join("") +
                " " +
                display);
            blocks.push({
              display: display,
              node: node,
            });
            b.label = 5;
          case 5:
            l = true;
            return [3, 3];
          case 6:
            return [3, 13];
          case 7:
            error = b.sent();
            g = {
              error: error,
            };
            return [3, 13];
          case 8:
            b.trys.push([8, , 11, 12]);
            return l || m || !(v = c.return) ? [3, 10] : [4, v.call(c)];
          case 9:
            b.sent();
            b.label = 10;
          case 10:
            return [3, 12];
          case 11:
            if (g) throw g.error;
            return [7];
          case 12:
            return [7];
          case 13:
            f = {
              file: filet0,
              content: content,
              mtime: mtime,
              blocks: blocks,
            };
            i[filet0.path] = f;
            return [2, f];
        }
      });
    });
  };
  e.prototype.getAll = function (e) {
    return __asyncGenerator(this, arguments, function () {
      var t, n, i, r, o;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            t = this.app.vault;
            n = t.getMarkdownFiles();
            i = 0;
            r = n;
            a.label = 1;
          case 1:
            return i < r.length ? ((o = r[i]), [4, __await(this.getForFile(e, o))]) : [3, 5];
          case 2:
            return [4, a.sent()];
          case 3:
            a.sent();
            a.label = 4;
          case 4:
            i++;
            return [3, 1];
          case 5:
            return [2];
        }
      });
    });
  };
  return e;
})();
var zX,
  qX,
  MetadataCache = (function (e) {
    function t(app, vault) {
      var i = e.call(this) || this;
      i.worker = null;
      i.inProgressTaskCount = 0;
      i.db = null;
      i.fileCache = {};
      i.metadataCache = {};
      i.workQueue = new ix();
      i.uniqueFileLookup = new tc();
      i.didFinish = debounce(
        function () {
          return i.trigger("finished");
        },
        10,
        !0,
      );
      i.initialized = false;
      i.resolvedLinks = {};
      i.unresolvedLinks = {};
      i.linkResolverQueue = null;
      i.onCleanCacheCallbacks = [];
      i.workerResolve = null;
      i.userIgnoreFilters = null;
      i.userIgnoreFiltersString = "";
      i.userIgnoreFilterCache = {};
      i.app = app;
      i.vault = vault;
      i.worker = new Worker("worker.js", {
        name: "Metadata Cache Worker",
      });
      i.worker.onmessage = i.onReceiveMessageFromWorker.bind(i);
      i.blockCache = new HX(app);
      i.linkResolver();
      i.on("finished", i.checkCleanCache, i);
      i.on("resolved", i.checkCleanCache, i);
      return i;
    }
    __extends(t, e);
    t.prototype.getLinkSuggestions = function () {
      for (var e = [], t = {}, n = this.unresolvedLinks, i = 0, r = this.vault.getFiles(); i < r.length; i++) {
        var fileo0 = r[i];
        if (this.isSupportedFile(fileo0)) {
          var path = fileo0.path;
          fileo0.extension === "md" && (path = $c(path));
          t[path] = true;
          e.push({
            file: fileo0,
            path: path,
          });
          var s = this.getFileCache(fileo0);
          if (s) {
            var l = parseFrontMatterAliases(s.frontmatter);
            if (l)
              for (var c = 0, u = l; c < u.length; c++) {
                var alias = u[c];
                e.push({
                  file: fileo0,
                  path: path,
                  alias: alias,
                });
              }
          }
        }
      }
      for (var p in n)
        if (n.hasOwnProperty(p)) {
          var d = n[p];
          for (var pathf0 in d)
            if (d.hasOwnProperty(pathf0)) {
              pathf0.length > 500 && (pathf0 = pathf0.substring(0, 500));
              t[pathf0] ||
                ((t[pathf0] = true),
                e.push({
                  file: null,
                  path: pathf0,
                }));
            }
        }
      return e;
    };
    t.prototype.getTags = function () {
      var e = this.fileCache,
        t = this.metadataCache,
        n = {},
        i = function (e) {
          if ((e.endsWith("/") && (e = e.slice(0, -1)), gb(e))) {
            var t = e.split("/").last();
            n[e] = (n[e] || 0) + 1;
            t !== e && i(e.substr(0, e.length - t.length - 1));
          }
        };
      for (var r in e)
        if (e.hasOwnProperty(r) && !this.isUserIgnored(r)) {
          var o = t[e[r].hash];
          if (o) {
            var a = getAllTags(o);
            if (a)
              for (var s = 0, l = a; s < l.length; s++) {
                var tag = l[s];
                i(tag);
              }
          }
        }
      var u = {};
      for (var tag in n)
        if (n.hasOwnProperty(tag)) {
          var h = tag.toLowerCase(),
            count = n[tag];
          if (u.hasOwnProperty(h)) {
            var d = u[h];
            d.count += count;
            count > d.max && ((d.max = count), (d.tag = tag));
          } else
            u[h] = {
              tag: tag,
              count: count,
              max: count,
            };
        }
      for (var tag in ((n = {}), u))
        if (u.hasOwnProperty(tag)) {
          var f = u[tag];
          n[f.tag] = f.count;
        }
      return n;
    };
    t.prototype.getFirstLinkpathDest = function (e, t) {
      var n = this.getLinkpathDest(e, t);
      return n.length > 0 ? n[0] : null;
    };
    t.prototype.getLinkpathDest = function (e, t) {
      if (e === "" && t && (f = this.vault.getAbstractFileByPath(t)) instanceof TFile) return [f];
      var n = e.toLowerCase(),
        i = getFilename(n),
        r = null;
      if (
        (i.contains(".") && (r = this.uniqueFileLookup.get(i)),
        r || ((i = getFilename((n = (e + ".md").toLowerCase()))), (r = this.uniqueFileLookup.get(i))),
        !r)
      )
        return [];
      if (i === n && r.length === 1) return r.slice();
      var o = Zc(t).toLowerCase();
      if (n.startsWith("./") || n.startsWith("../")) {
        if ((n.startsWith("./../") && (n = n.substr(2)), n.startsWith("./"))) {
          o !== "" && (o += "/");
          n = o + n.substring(2);
        } else {
          for (; n.startsWith("../"); ) {
            n = n.substr(3);
            o = Zc(o);
          }
          o !== "" && (o += "/");
          n = o + n;
        }
        for (var a = 0, s = r; a < s.length; a++) {
          if ((m = (f = s[a]).path.toLowerCase()) === n) return [f];
        }
      }
      if (n.startsWith("/")) {
        n = n.substr(1);
      }
      for (var l = 0, c = r; l < c.length; l++) {
        if ((m = (f = c[l]).path.toLowerCase()) === n) return [f];
      }
      if (e.startsWith("/")) return [];
      for (var u = [], h = [], p = 0, d = r; p < d.length; p++) {
        var f, m;
        if ((m = (f = d[p]).path.toLowerCase()).endsWith(n)) {
          m.startsWith(o) ? u.push(f) : h.push(f);
        }
      }
      u.sort(RX);
      h.sort(RX);
      return u.concat(h);
    };
    t.prototype.getLinks = function () {
      var e = {};
      for (var t in this.fileCache)
        if (this.fileCache.hasOwnProperty(t)) {
          var n = [],
            i = this.fileCache[t].hash,
            r = this.metadataCache[i];
          r && (r.links && (n = n.concat(r.links)), r.embeds && (n = n.concat(r.embeds)));
          e[t] = n;
        }
      return e;
    };
    t.prototype.getFileCache = function (e) {
      return this.getCache(e.path);
    };
    t.prototype.getCache = function (e) {
      if (!this.fileCache.hasOwnProperty(e)) return null;
      if (getExtension(getFilename(e)) !== "md") return {};
      var t = this.fileCache[e].hash;
      return this.metadataCache[t] || null;
    };
    t.prototype.getFileInfo = function (e) {
      return this.fileCache[e];
    };
    t.prototype.getCachedFiles = function () {
      return Object.keys(this.fileCache);
    };
    t.prototype.iterateReferences = function (e) {
      var t = function (t) {
          if (!n.fileCache.hasOwnProperty(t)) return "continue";
          var i = n.fileCache[t].hash;
          traverseLinksOrEmbeds(n.metadataCache[i], function (n) {
            return e(t, n);
          });
        },
        n = this;
      for (var i in this.fileCache) t(i);
    };
    t.prototype.getBacklinksForFile = function (e) {
      var t = this,
        n = new tc();
      this.iterateReferences(function (i, r) {
        var o = getLinkpath(r.link),
          a = t.getFirstLinkpathDest(o, i);
        if (a && a === e) {
          n.add(i, r);
        }
      });
      return n;
    };
    t.prototype.fileToLinktext = function (e, t, n) {
      if (undefined === n) {
        n = true;
      }
      var i = this.vault.getConfig("newLinkFormat"),
        r = e.extension === "md" && n ? $c(e.path) : e.path;
      if (i === "absolute") return r;
      if (i === "relative") {
        for (var o = "", a = Zc(t); a !== "" && a !== "/" && r.indexOf(a + "/") !== 0; ) {
          o = "../" + o;
          a = Zc(a);
        }
        return r.indexOf(a + "/") === 0 ? o + r.substr(a.length + 1) : o + r;
      }
      var s = e.extension === "md" && n ? e.basename : e.name,
        l = getLinkpath(s),
        c = this.getLinkpathDest(l, t);
      return c && c.length === 1 && c[0] === e ? s : e.extension === "md" && n ? $c(e.path) : e.path;
    };
    t.prototype.watchVaultChanges = function () {
      var e = this.vault;
      e.on("create", this.onCreate.bind(this));
      e.on("modify", this.computeFileMetadataAsync.bind(this));
      e.on("delete", this.onDelete.bind(this));
      e.on("rename", this.onRename.bind(this));
      e.on("config-changed", this.onConfigChanged.bind(this));
    };
    t.prototype.preload = function () {
      if (!this.initialized) {
        this.preloadPromise || (this.preloadPromise = this._preload());
        return this.preloadPromise;
      }
    };
    t.prototype._preload = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l, c, u, h, p;
        return __generator(this, function (d) {
          switch (d.label) {
            case 0:
              t = (e = this).fileCache;
              n = e.metadataCache;
              i = null;
              d.label = 1;
            case 1:
              d.trys.push([1, 3, , 4]);
              r = this;
              return [
                4,
                EX(this.app.appId + "-cache", 19, {
                  upgrade: function (e, t, n, i) {
                    e.objectStoreNames.contains("file") && e.deleteObjectStore("file");
                    e.objectStoreNames.contains("metadata") && e.deleteObjectStore("metadata");
                    e.createObjectStore("file");
                    e.createObjectStore("metadata");
                  },
                }),
              ];
            case 2:
              i = r.db = d.sent();
              this.transactionSave = (function (e, t) {
                var n = null;
                return function (i, r, o) {
                  if (n)
                    try {
                      var a = n.objectStore(i);
                      return o ? a.put(o, r) : a.delete(r);
                    } catch (e) {}
                  var s = (n = e.transaction(t, "readwrite", {
                    durability: "relaxed",
                  }));
                  mc(function () {
                    if (n === s) {
                      n = null;
                    }
                  });
                  var l = n.objectStore(i);
                  return o ? l.put(o, r) : l.delete(r);
                };
              })(i, ["file", "metadata"]);
              return [3, 4];
            case 3:
              o = d.sent();
              console.error("Failed to load cache, unable to open IndexedDB", o);
              return [2];
            case 4:
              d.trys.push([4, 8, , 9]);
              return [4, (a = i.transaction(["file", "metadata"], "readonly")).objectStore("file").getAllKeys()];
            case 5:
              s = d.sent();
              return [4, a.objectStore("file").getAll()];
            case 6:
              for (l = d.sent(), c = 0; c < s.length; c++) {
                u = s[c];
                h = l[c];
                u && h && (t[u] = h);
              }
              return [
                4,
                UX(a.objectStore("metadata"), 300, function (e, t) {
                  for (var r = 0; r < e.length; r++) {
                    var o = e[r],
                      a = t[r];
                    if (o && a) {
                      migrateCache(a) &&
                        i
                          .transaction("metadata", "readwrite", {
                            durability: "relaxed",
                          })
                          .store.put(pc(a), o);
                      n[o] = normalizeCachePositions(a);
                    }
                  }
                }),
              ];
            case 7:
              d.sent();
              return [3, 9];
            case 8:
              p = d.sent();
              console.error("Failed to load cache", p);
              return [3, 9];
            case 9:
              return [2];
          }
        });
      });
    };
    t.prototype.initialize = function () {
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
          u = this;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              return [4, this.preload()];
            case 1:
              for (
                h.sent(),
                  this.preloadPromise = null,
                  t = (e = this).fileCache,
                  n = e.metadataCache,
                  setInterval(this.cleanupDeletedCache.bind(this), 6e5),
                  i = {},
                  r = this.vault.getAllLoadedFiles(),
                  o = 0,
                  a = r;
                o < a.length;
                o++
              )
                if ((s = a[o]) instanceof TFile) {
                  this.uniqueFileLookup.add(s.name.toLowerCase(), s);
                  i[s.path] = s;
                }
              for (c in t)
                if (t.hasOwnProperty(c)) {
                  s = i[c];
                  l = t[c];
                  s
                    ? n.hasOwnProperty(l.hash)
                      ? s.stat.mtime !== l.mtime || s.stat.size !== l.size
                        ? this.computeFileMetadataAsync(s)
                        : this.linkResolverQueue.add(s)
                      : this.computeFileMetadataAsync(s)
                    : this.deletePath(c);
                }
              for (c in i)
                if (i.hasOwnProperty(c)) {
                  t.hasOwnProperty(c) || this.computeFileMetadataAsync(i[c]);
                }
              this.initialized = true;
              this.watchVaultChanges();
              this.updateUserIgnoreFilters();
              this.trigger("finished");
              window.setTimeout(function () {
                return u.cleanupDeletedCache();
              }, 6e4);
              return [2];
          }
        });
      });
    };
    t.prototype.clear = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return (e = this.db) ? [4, e.clear("metadata")] : [3, 3];
            case 1:
              t.sent();
              return [4, e.clear("file")];
            case 2:
              t.sent();
              t.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    t.prototype.showIndexingNotice = function () {
      var e,
        t,
        n = this,
        i = createEl("progress"),
        r = createFragment(function (e) {
          e.createSpan({
            text: i18nProxy.interface.msgIndexing(),
          });
          e.createEl("br");
          e.createSpan({
            cls: "u-small",
            text: i18nProxy.interface.msgIndexingDesc(),
          });
          e.append(i);
        }),
        value = Object.keys(this.metadataCache).length,
        max = value + this.inProgressTaskCount;
      i.max = max;
      i.value = value;
      var s = window.setTimeout(function () {
        if (!(n.inProgressTaskCount <= 0)) {
          e = new Notice(r, 0);
          t = window.setInterval(function () {
            e.containerEl.offsetParent ? (i.value = Math.max(0, max - n.inProgressTaskCount)) : clearInterval(t);
          }, 300);
        }
      }, 1e3);
      this.onCleanCache(function () {
        clearTimeout(s);
        clearInterval(t);
        e &&
          (e.setMessage(i18nProxy.interface.msgIndexingComplete()),
          e.containerEl.addClass("mod-success"),
          setTimeout(function () {
            return e.hide();
          }, 3e3));
      });
    };
    t.prototype.linkResolver = function () {
      var e = this,
        t = cx(
          (this.linkResolverQueue = new sx({
            onStop: function () {
              return e.trigger("resolved");
            },
            onCancel: function () {
              e.linkResolverQueue = null;
            },
          })).generator(),
        );
      __awaiter(e, undefined, undefined, function () {
        var e, n, i, r, error, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              u.trys.push([0, 5, 6, 11]);
              e = true;
              n = __asyncValues(t);
              u.label = 1;
            case 1:
              return [4, n.next()];
            case 2:
              if (((i = u.sent()), (a = i.done))) return [3, 4];
              if (((c = i.value), (e = false), !(r = c) || r.extension !== "md")) return [3, 3];
              this.resolveLinks(r.path);
              this.trigger("resolve", r);
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
              return e || a || !(l = n.return) ? [3, 8] : [4, l.call(n)];
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
      });
    };
    t.prototype.resolveLinks = function (e) {
      var t = this,
        n = this.getCache(e);
      if (n) {
        var i = {},
          r = {};
        traverseLinksOrEmbeds(n, function (n) {
          var o = getLinkpath(n.link),
            a = t.getFirstLinkpathDest(o, e);
          if (a) i[a.path] = (i[a.path] || 0) + 1;
          else {
            var s = NX(o);
            r[s] = (r[s] || 0) + 1;
          }
        });
        this.resolvedLinks[e] = i;
        this.unresolvedLinks[e] = r;
      }
    };
    t.prototype.onCleanCache = function (e) {
      this.isCacheClean() ? e() : this.onCleanCacheCallbacks.push(e);
    };
    t.prototype.checkCleanCache = function () {
      for (; this.onCleanCacheCallbacks.length > 0 && this.isCacheClean(); ) {
        var e = this.onCleanCacheCallbacks.shift();
        try {
          e();
        } catch (e) {
          console.error(e);
        }
      }
    };
    t.prototype.isCacheClean = function () {
      return (
        this.inProgressTaskCount === 0 &&
        this.linkResolverQueue.items.length === 0 &&
        !this.linkResolverQueue.runnable.isRunning()
      );
    };
    t.prototype.updateRelatedLinks = function (e) {
      for (
        var t = [],
          n = 0,
          i = (e = e.map(function (e) {
            return e.toLowerCase();
          }));
        n < i.length;
        n++
      ) {
        var r = i[n];
        r.endsWith(".md") && t.push(r.substring(0, r.length - 3));
        t.push(r);
      }
      for (var o = this.resolvedLinks, a = this.unresolvedLinks, s = 0, l = this.getCachedFiles(); s < l.length; s++) {
        var c = l[s];
        if (BX(e, o[c]) || BX(t, a[c])) {
          var u = this.vault.getAbstractFileByPath(c);
          if (u && u instanceof TFile) {
            this.linkResolverQueue.add(u);
          }
        }
      }
    };
    t.prototype.onCreate = function (e) {
      this.computeFileMetadataAsync(e);
      e && e instanceof TFile && this.updateRelatedLinks([e.name]);
    };
    t.prototype.computeFileMetadataAsync = function (e) {
      var t = this;
      if (e && e instanceof TFile) {
        this.uniqueFileLookup.add(e.name.toLowerCase(), e);
        var n = e.stat,
          i = e.path,
          r = null;
        if (e.extension === "md") {
          if (this.fileCache.hasOwnProperty(i)) {
            r = this.fileCache[i];
          }
          var o = false;
          if (r) {
            var a = r.mtime === n.mtime && r.size === n.size,
              s = r.hash && this.metadataCache.hasOwnProperty(r.hash);
            o = a && s;
          } else {
            r = {
              mtime: 0,
              size: 0,
              hash: "",
            };
            this.saveFileCache(i, r);
          }
          if (!o) {
            this.inProgressTaskCount++;
            return this.workQueue.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                var o;
                return __generator(this, function (a) {
                  switch (a.label) {
                    case 0:
                      a.trys.push([0, 2, , 3]);
                      return [
                        4,
                        __awaiter(t, undefined, undefined, function () {
                          var t, o, hash, s, l;
                          return __generator(this, function (c) {
                            switch (c.label) {
                              case 0:
                                return [4, this.vault.readBinary(e)];
                              case 1:
                                t = c.sent();
                                o = ff(t);
                                return [4, computeSha256Hex(t)];
                              case 2:
                                if (
                                  ((hash = c.sent()),
                                  (r.mtime = n.mtime),
                                  (r.size = n.size),
                                  (r.hash = hash),
                                  this.saveFileCache(i, r),
                                  (s = this.metadataCache[hash]))
                                ) {
                                  this.linkResolverQueue.add(e);
                                  this.trigger("changed", e, o, s);
                                  return [2];
                                }
                                l = setTimeout(function () {
                                  new Notice("Indexing taking a long time for " + e.path);
                                }, 1e4);
                                c.label = 3;
                              case 3:
                                c.trys.push([3, , 5, 6]);
                                return [4, this.work(t)];
                              case 4:
                                s = c.sent();
                                return [3, 6];
                              case 5:
                                clearTimeout(l);
                                return [7];
                              case 6:
                                return s
                                  ? (this.saveMetaCache(hash, s),
                                    this.linkResolverQueue.add(e),
                                    this.trigger("changed", e, o, s),
                                    [2])
                                  : (console.log("Metadata failed to parse", e), [2]);
                            }
                          });
                        }),
                      ];
                    case 1:
                      a.sent();
                      return [3, 3];
                    case 2:
                      o = a.sent();
                      console.error(o);
                      return [3, 3];
                    case 3:
                      this.inProgressTaskCount--;
                      this.inProgressTaskCount === 0 && this.didFinish();
                      return [2];
                  }
                });
              });
            });
          }
          this.linkResolverQueue.add(e);
        } else
          this.saveFileCache(i, {
            mtime: n.mtime,
            size: n.size,
            hash: "",
          });
      }
    };
    t.prototype.onDelete = function (e) {
      if (e && e instanceof TFile) {
        this.uniqueFileLookup.remove(e.name.toLowerCase(), e);
        this.trigger("deleted", e, this.getFileCache(e));
        this.deletePath(e.path);
      }
    };
    t.prototype.deletePath = function (e) {
      delete this.resolvedLinks[e];
      delete this.unresolvedLinks[e];
      this.saveFileCache(e, null);
      this.updateRelatedLinks([getFilename(e)]);
      this.linkResolverQueue.add(null);
      this.inProgressTaskCount === 0 && this.didFinish();
    };
    t.prototype.onRename = function (e, t) {
      if (e && e instanceof TFile) {
        var n = e.path,
          i = this,
          r = i.uniqueFileLookup,
          o = i.resolvedLinks,
          a = i.unresolvedLinks,
          s = i.fileCache;
        r.remove(getFilename(t).toLowerCase(), e);
        r.add(e.name.toLowerCase(), e);
        o.hasOwnProperty(t) && ((o[n] = o[t]), delete o[t]);
        a.hasOwnProperty(t) && ((a[n] = a[t]), delete a[t]);
        s.hasOwnProperty(t) && (this.saveFileCache(n, s[t]), this.saveFileCache(t, null));
        var l = getFilename(t),
          c = getFilename(n);
        c !== l ? this.updateRelatedLinks([l, c]) : this.updateRelatedLinks([l]);
        this.linkResolverQueue.add(null);
      }
    };
    t.prototype.saveFileCache = function (e, t) {
      if ((t ? (this.fileCache[e] = t) : delete this.fileCache[e], this.transactionSave))
        return this.transactionSave("file", e, t);
    };
    t.prototype.saveMetaCache = function (e, t) {
      if (t) {
        if (((this.metadataCache[e] = t), !this.transactionSave)) return;
        var n = pc(t);
        (i = n).frontmatterPosition &&
          ((i.frontmatterPos = positionToTuple(i.frontmatterPosition)), delete i.frontmatterPosition);
        traverseMetadata(i, replacePositionWithPos);
        return this.transactionSave("metadata", e, n);
      }
      var i;
      if ((delete this.metadataCache[e], this.transactionSave)) return this.transactionSave("metadata", e, null);
    };
    t.prototype.work = function (metadataCache) {
      var t = this;
      if (this.workerResolve) throw new Error("Work queue must be sequential!");
      return new Promise(function (workerResolve) {
        t.workerResolve = workerResolve;
        t.worker.postMessage(
          {
            metadataCache: metadataCache,
          },
          [metadataCache],
        );
      });
    };
    t.prototype.computeMetadataAsync = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          return [
            2,
            this.workQueue.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                var t;
                return __generator(this, function (n) {
                  switch (n.label) {
                    case 0:
                      n.trys.push([0, 2, , 3]);
                      return [4, this.work(e)];
                    case 1:
                      return [2, n.sent()];
                    case 2:
                      t = n.sent();
                      console.error(t);
                      return [3, 3];
                    case 3:
                      return [2];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    t.prototype.onReceiveMessageFromWorker = function (e) {
      if (this.workerResolve) {
        this.workerResolve(e.data);
        this.workerResolve = null;
      }
    };
    t.prototype.cleanupDeletedCache = function () {
      var e = this.fileCache,
        t = this.metadataCache,
        n = {};
      for (var i in e) {
        if (e.hasOwnProperty(i)) n[e[i].hash] = true;
      }
      for (var r in t)
        if (t.hasOwnProperty(r)) {
          n[r] || this.saveMetaCache(r, null);
        }
    };
    t.prototype.onConfigChanged = function (e) {
      if (e === "userIgnoreFilters") {
        this.updateUserIgnoreFilters();
      }
    };
    t.prototype.updateUserIgnoreFilters = function () {
      var e = this.app.vault.getConfig("userIgnoreFilters"),
        userIgnoreFiltersString = JSON.stringify(e);
      if (this.userIgnoreFiltersString !== userIgnoreFiltersString)
        if (((this.userIgnoreFiltersString = userIgnoreFiltersString), (this.userIgnoreFilterCache = {}), e))
          for (var n = (this.userIgnoreFilters = []), i = 0, r = e; i < r.length; i++) {
            var o = r[i].trim();
            if (o.length !== 0)
              try {
                o.length > 2 && o.startsWith("/") && o.endsWith("/")
                  ? n.push(new RegExp(o.substring(1, o.length - 1), "i"))
                  : n.push(new RegExp("^" + Jl(o), "i"));
              } catch (e) {
                console.error("Bad regex for user ignore filter", e);
              }
          }
        else this.userIgnoreFilters = null;
    };
    t.prototype.isSupportedFile = function (e) {
      var t = this.app;
      return !!t.vault.getConfig("showUnsupportedFiles") || t.viewRegistry.isExtensionRegistered(e.extension);
    };
    t.prototype.isUserIgnored = function (e) {
      var t = this.userIgnoreFilters,
        n = this.userIgnoreFilterCache;
      if (!t) return !1;
      if (Object.hasOwn(n, e)) return n[e];
      for (var i = false, r = 0, o = t; r < o.length; r++) {
        if (o[r].test(e)) {
          i = true;
          break;
        }
      }
      n[e] = i;
      return i;
    };
    t.prototype.getAllPropertyInfos = function () {
      var e = this.fileCache,
        t = this.metadataCache,
        n = {},
        i = this.app.metadataTypeManager.assignedWidgets;
      for (var namer0 in i)
        if (Object.hasOwn(i, namer0)) {
          var o = i[namer0],
            name = o.name,
            widget = o.widget;
          n[namer0] = {
            name: name,
            widget: widget,
            occurrences: 0,
          };
        }
      for (var l in e)
        if (Object.hasOwn(e, l) && !this.isUserIgnored(l)) {
          var c = t[e[l].hash];
          if (c) {
            var u = c.frontmatter;
            if (u)
              for (var namer0 in u)
                if (Object.hasOwn(u, namer0)) {
                  var h = u[namer0],
                    p = namer0.toLowerCase();
                  if (Object.hasOwn(n, p)) {
                    var d = n[p];
                    d.occurrences++;
                    d.widget || h == null || (d.widget = LM(h));
                  } else
                    n[p] = {
                      name: namer0,
                      occurrences: 1,
                      widget: h != null ? LM(h) : undefined,
                    };
                }
          }
        }
      return Object.fromEntries(
        Object.entries(n).map(function (e) {
          var t,
            n = e[0],
            i = e[1];
          return [
            n,
            __assign(__assign({}, i), {
              widget: (t = i.widget) !== null && undefined !== t ? t : "text",
            }),
          ];
        }),
      );
    };
    t.prototype.getFrontmatterPropertyValuesForKey = function (e) {
      if (!e) return [];
      var t = this.fileCache,
        n = this.metadataCache,
        i = new Set();
      for (var r in t)
        if (t.hasOwnProperty(r)) {
          var o = n[t[r].hash];
          if (o) {
            var a = o.frontmatter;
            if (a && a.hasOwnProperty(e)) {
              var s = a[e];
              if (uc(s))
                for (var l = 0, c = s; l < c.length; l++) {
                  var u = c[l];
                  if (VX(u)) {
                    i.add(u);
                  }
                }
              else if (typeof s == "string" && VX(s)) {
                i.add(s);
              }
            }
          }
        }
      return Array.from(i).sort(Eb);
    };
    t.prototype.trigger = function (t) {
      for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
      e.prototype.trigger.apply(this, __spreadArray([t], n, !1));
    };
    t.prototype.on = function (t, n, i) {
      return e.prototype.on.call(this, t, n, i);
    };
    return t;
  })(Events);
function UX(e, t, n) {
  return __awaiter(this, undefined, undefined, function () {
    var i, r, o, a, s;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          return [4, e.getAllKeys()];
        case 1:
          i = l.sent();
          r = 0;
          l.label = 2;
        case 2:
          return r < i.length ? ((o = i[r]), [4, e.getAll(IDBKeyRange.lowerBound(o), t)]) : [3, 4];
        case 3:
          a = l.sent();
          return (s = a.length) === 0 ? [3, 4] : (n(i.slice(r, r + s), a), (r += s), [3, 2]);
        case 4:
          return [2];
      }
    });
  });
}
!(function (e) {
  e.Documents = "DOCUMENTS";
  e.Data = "DATA";
  e.Library = "LIBRARY";
  e.Cache = "CACHE";
  e.External = "EXTERNAL";
  e.ExternalStorage = "EXTERNAL_STORAGE";
})(zX || (zX = {}));
(function (e) {
  e.UTF8 = "utf8";
  e.ASCII = "ascii";
  e.UTF16 = "utf16";
})(qX || (qX = {}));
function _X(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t, n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          i.trys.push([0, 2, , 3]);
          return [4, e];
        case 1:
          return [2, i.sent()];
        case 2:
          throw (
            (t = i.sent()),
            (n = t.message) &&
              (n.contains("does not exist") || n.contains("there is no such file")) &&
              (t.code = "ENOENT"),
            t
          );
        case 3:
          return [2];
      }
    });
  });
}
var jX = 5242880,
  GX = (function () {
    function e(dir) {
      this.uri = "";
      this.dir = dir;
    }
    e.prototype.init = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this;
              return [
                4,
                filesystemPlugin.getUri({
                  directory: this.dir,
                  path: "",
                }),
              ];
            case 1:
              e.uri = t.sent().uri;
              return [2];
          }
        });
      });
    };
    e.prototype.watch = function (path) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                filesystemPlugin.startWatch({
                  directory: this.dir,
                  path: path,
                }),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.verifyIcloud = function (path) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                filesystemPlugin.verifyIcloud({
                  path: path,
                }),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.read = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.readFile({
                    directory: this.dir,
                    path: path,
                    encoding: qX.UTF8,
                  }),
                ),
              ];
            case 1:
              return [2, t.sent().data];
          }
        });
      });
    };
    e.prototype.readBinary = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, _X(this.stat(path))];
            case 1:
              return t.sent().size < jX
                ? [
                    4,
                    _X(
                      filesystemPlugin.readFile({
                        directory: this.dir,
                        path: path,
                      }),
                    ),
                  ]
                : [3, 3];
            case 2:
              return [2, base64ToArrayBuffer(t.sent().data)];
            case 3:
              return [4, fetch(this.getUri(path))];
            case 4:
              return [2, t.sent().arrayBuffer()];
          }
        });
      });
    };
    e.prototype.write = function (path, data) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.writeFile({
                    directory: this.dir,
                    path: path,
                    data: data,
                    encoding: qX.UTF8,
                  }),
                ),
              ];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.writeBinary = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, _X(this.writeBinaryInternal(e, t))];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.writeBinaryInternal = function (path, buffer) {
      return __awaiter(this, undefined, Promise, function () {
        var offset, length, data, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return buffer.byteLength < jX
                ? [
                    4,
                    filesystemPlugin.writeFile({
                      directory: this.dir,
                      path: path,
                      data: arrayBufferToBase64(buffer),
                    }),
                  ]
                : [3, 2];
            case 1:
              s.sent();
              return [2];
            case 2:
              return [
                4,
                filesystemPlugin.writeFile({
                  directory: this.dir,
                  path: path,
                  data: "",
                }),
              ];
            case 3:
              s.sent();
              s.label = 4;
            case 4:
              s.trys.push([4, 8, , 10]);
              offset = 0;
              s.label = 5;
            case 5:
              return offset < buffer.byteLength
                ? ((length = Math.min(1048576, buffer.byteLength - offset)),
                  (data = arrayBufferToBase64(buffer, offset, length)),
                  [
                    4,
                    filesystemPlugin.appendFile({
                      directory: this.dir,
                      path: path,
                      data: data,
                    }),
                  ])
                : [3, 7];
            case 6:
              s.sent();
              offset += length;
              return [3, 5];
            case 7:
              return [3, 10];
            case 8:
              a = s.sent();
              return [
                4,
                filesystemPlugin.deleteFile({
                  directory: this.dir,
                  path: path,
                }),
              ];
            case 9:
              throw (s.sent(), a);
            case 10:
              return [2];
          }
        });
      });
    };
    e.prototype.append = function (path, data) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.appendFile({
                    directory: this.dir,
                    path: path,
                    data: data,
                    encoding: qX.UTF8,
                  }),
                ),
              ];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.mkdir = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.mkdir({
                    directory: this.dir,
                    path: path,
                    recursive: true,
                  }),
                ),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.readdir = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.readdir({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              return [2, t.sent().files];
          }
        });
      });
    };
    e.prototype.stat = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.stat({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              return [2, t.sent()];
          }
        });
      });
    };
    e.prototype.watchAndStatAll = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.watchAndStatAll({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              return [2, t.sent()];
          }
        });
      });
    };
    e.prototype.exists = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              t.trys.push([0, 2, , 3]);
              return [4, this.stat(e)];
            case 1:
              t.sent();
              return [2, !0];
            case 2:
              t.sent();
              return [2, !1];
            case 3:
              return [2];
          }
        });
      });
    };
    e.prototype.setTimes = function (path, ctime, mtime) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.setTimes({
                    directory: this.dir,
                    path: path,
                    ctime: ctime,
                    mtime: mtime,
                  }),
                ),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.rmdir = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.rmdir({
                    directory: this.dir,
                    path: path,
                    recursive: true,
                  }),
                ),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.delete = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.deleteFile({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.rename = function (from, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.rename({
                    directory: this.dir,
                    from: from,
                    to: t,
                  }),
                ),
              ];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.copy = function (from, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.copy({
                    directory: this.dir,
                    from: from,
                    to: t,
                  }),
                ),
              ];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.open = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.open({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.trash = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [
                4,
                _X(
                  filesystemPlugin.trash({
                    directory: this.dir,
                    path: path,
                  }),
                ),
              ];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.getNativeUri = function (e) {
      e = iu(e);
      var t = this.uri;
      return e === "/"
        ? t
        : (t.endsWith("/") || (t += "/"),
          t +
            e
              .split("/")
              .map(function (e) {
                return encodeURIComponent(e);
              })
              .join("/"));
    };
    e.prototype.getUri = function (e) {
      var t = this.getNativeUri(e);
      t.startsWith("file://") && (t = CapacitorCore.Capacitor.convertFileSrc(t));
      return t;
    };
    return e;
  })();
function KX(e) {
  return {
    ctime: Math.round(e.ctime),
    mtime: Math.round(e.mtime),
    size: e.size,
  };
}
window.FS = GX;
var CapacitorAdapter = (function () {
    function e(basePath, t) {
      var n = this;
      this.fs = t;
      this.basePath = basePath;
      this.files = {};
      this.promise = Promise.resolve();
      this.handler = null;
      this.insensitive = false;
      __awaiter(n, undefined, undefined, function () {
        return __generator(this, function (e) {
          try {
            this.testInsensitive();
          } catch (e) {
            console.error(e);
          }
          return [2];
        });
      });
    }
    e.prototype.testInsensitive = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2];
        });
      });
    };
    e.prototype.getName = function () {
      return getFilename(this.basePath);
    };
    e.prototype.watchAndList = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              this.files["/"] = {
                type: "folder",
                realpath: "/",
              };
              o.label = 1;
            case 1:
              o.trys.push([1, 3, , 6]);
              return [4, this.fs.watchAndStatAll(this.basePath)];
            case 2:
              if ((e = o.sent()).children)
                for (t = 0, n = e.children; t < n.length; t++) {
                  i = n[t];
                  this.quickList("", i);
                }
              return [3, 6];
            case 3:
              r = o.sent();
              console.error("Failed to run quick list", r);
              return [4, this.fs.watch(this.basePath)];
            case 4:
              o.sent();
              return [4, this.listRecursive("")];
            case 5:
              o.sent();
              return [3, 6];
            case 6:
              return [2];
          }
        });
      });
    };
    e.prototype.quickList = function (e, t) {
      var n = t.name,
        realpath = iu(e === "" ? n : e + "/" + n),
        r = normalizePath(realpath);
      this.trigger("raw", r);
      Xc(r) ||
        (t.type === "file"
          ? this.reconcileFileChanged(realpath, r, t)
          : t.type === "directory" &&
            (this.files.hasOwnProperty(r)
              ? (this.files[r].realpath = realpath)
              : ((this.files[r] = {
                  type: "folder",
                  realpath: realpath,
                }),
                this.trigger("folder-created", r))));
    };
    e.prototype.listRecursive = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t = this.getFullRealPath(e);
              return [4, this.fs.readdir(t)];
            case 1:
              for (n = s.sent(), i = [], r = 0, o = n; r < o.length; r++) {
                a = o[r];
                i.push(this.listRecursiveChild(e, a));
              }
              return [4, Promise.all(i)];
            case 2:
              s.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.listRecursiveChild = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              n = iu(e === "" ? t.name : e + "/" + t.name);
              i = normalizePath(n);
              this.trigger("raw", i);
              return Xc(i) ? [4, this.reconcileDeletion(n, i)] : [3, 2];
            case 1:
              return [2, r.sent()];
            case 2:
              return t.type !== "file" ? [3, 3] : (this.reconcileFileChanged(n, i, t), [3, 5]);
            case 3:
              return t.type !== "directory" ? [3, 5] : [4, this.reconcileFolderCreation(n, i)];
            case 4:
              r.sent();
              r.label = 5;
            case 5:
              return [2];
          }
        });
      });
    };
    e.prototype.mkdir = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n;
          return __generator(this, function (i) {
            switch (i.label) {
              case 0:
                t = this.getFullPath(e);
                i.label = 1;
              case 1:
                i.trys.push([1, 3, , 4]);
                return [4, this.fs.mkdir(t)];
              case 2:
                i.sent();
                return [3, 4];
              case 3:
                if ((n = i.sent()).message !== "Directory exists") throw n;
                return [3, 4];
              case 4:
                return [4, this.reconcileInternalFile(e)];
              case 5:
                i.sent();
                return [2];
            }
          });
        });
      });
    };
    e.prototype.trashSystem = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                t = this.getFullPath(e);
                n.label = 1;
              case 1:
                n.trys.push([1, 3, , 4]);
                return [4, this.fs.trash(t)];
              case 2:
                n.sent();
                return [3, 4];
              case 3:
                n.sent();
                return [2, !1];
              case 4:
                return [4, this.reconcileInternalFile(e)];
              case 5:
                n.sent();
                return [2, !0];
            }
          });
        });
      });
    };
    e.prototype.trashLocal = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n, i, r, o, a, s, l;
          return __generator(this, function (c) {
            switch (c.label) {
              case 0:
                t = this.getFullPath(e);
                n = this.getFullPath(".trash");
                c.label = 1;
              case 1:
                c.trys.push([1, 3, , 4]);
                return [4, this.fs.mkdir(n)];
              case 2:
                c.sent();
                return [3, 4];
              case 3:
                if ((i = c.sent()).message !== "Directory exists") throw i;
                return [3, 4];
              case 4:
                r = getFilename(t);
                o = $c(r);
                a = getExtension(r);
                s = n + "/" + o;
                a && (s = s + "." + a);
                l = 1;
                c.label = 5;
              case 5:
                return [4, this._exists(s)];
              case 6:
                return c.sent() ? (l++, (s = n + "/" + o + " " + l), a && (s = s + "." + a), [3, 5]) : [3, 7];
              case 7:
                return [4, this.fs.rename(t, s)];
              case 8:
                c.sent();
                return [4, this.reconcileInternalFile(e)];
              case 9:
                c.sent();
                return [2];
            }
          });
        });
      });
    };
    e.prototype.rmdir = function (e, t) {
      var n = this;
      return this.queue(function () {
        return __awaiter(n, undefined, undefined, function () {
          var t;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                t = this.getFullPath(e);
                return [4, this.fs.rmdir(t)];
              case 1:
                n.sent();
                return [4, this.reconcileInternalFile(e)];
              case 2:
                n.sent();
                return [2];
            }
          });
        });
      });
    };
    e.prototype.read = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t,
            n = this;
          return __generator(this, function (i) {
            t = this.getFullPath(e);
            try {
              return [2, this.fs.read(t)];
            } catch (t) {
              throw (
                this.queue(function () {
                  return n.reconcileInternalFile(e);
                }),
                t
              );
            }
            return [2];
          });
        });
      });
    };
    e.prototype.readBinary = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t,
            n = this;
          return __generator(this, function (i) {
            t = this.getFullPath(e);
            try {
              return [2, this.fs.readBinary(t)];
            } catch (t) {
              throw (
                this.queue(function () {
                  return n.reconcileInternalFile(e);
                }),
                t
              );
            }
            return [2];
          });
        });
      });
    };
    e.prototype.write = function (e, t, n) {
      var i = this;
      return this.queue(function () {
        return __awaiter(i, undefined, undefined, function () {
          var i;
          return __generator(this, function (r) {
            switch (r.label) {
              case 0:
                i = this.getFullPath(e);
                r.label = 1;
              case 1:
                r.trys.push([1, , 6, 8]);
                return [4, this.fs.write(i, t)];
              case 2:
                r.sent();
                return n ? (n.ctime || n.mtime ? [4, this.fs.setTimes(i, n.ctime, n.mtime)] : [3, 4]) : [3, 5];
              case 3:
                r.sent();
                r.label = 4;
              case 4:
                n.immediate && n.immediate();
                r.label = 5;
              case 5:
                return [3, 8];
              case 6:
                return [4, this.reconcileInternalFile(e)];
              case 7:
                r.sent();
                return [7];
              case 8:
                return [2];
            }
          });
        });
      });
    };
    e.prototype.writeBinary = function (e, t, n) {
      var i = this;
      return this.queue(function () {
        return __awaiter(i, undefined, undefined, function () {
          var i;
          return __generator(this, function (r) {
            switch (r.label) {
              case 0:
                i = this.getFullPath(e);
                r.label = 1;
              case 1:
                r.trys.push([1, , 6, 8]);
                return [4, this.fs.writeBinary(i, t)];
              case 2:
                r.sent();
                return n ? (n.ctime || n.mtime ? [4, this.fs.setTimes(i, n.ctime, n.mtime)] : [3, 4]) : [3, 5];
              case 3:
                r.sent();
                r.label = 4;
              case 4:
                n.immediate && n.immediate();
                r.label = 5;
              case 5:
                return [3, 8];
              case 6:
                return [4, this.reconcileInternalFile(e)];
              case 7:
                r.sent();
                return [7];
              case 8:
                return [2];
            }
          });
        });
      });
    };
    e.prototype.append = function (e, t, n) {
      var i = this;
      return this.queue(function () {
        return __awaiter(i, undefined, undefined, function () {
          var i;
          return __generator(this, function (r) {
            switch (r.label) {
              case 0:
                i = this.getFullPath(e);
                r.label = 1;
              case 1:
                r.trys.push([1, , 6, 8]);
                return [4, this.fs.append(i, t)];
              case 2:
                r.sent();
                return n ? (n.ctime || n.mtime ? [4, this.fs.setTimes(i, n.ctime, n.mtime)] : [3, 4]) : [3, 5];
              case 3:
                r.sent();
                r.label = 4;
              case 4:
                n.immediate && n.immediate();
                r.label = 5;
              case 5:
                return [3, 8];
              case 6:
                return [4, this.reconcileInternalFile(e)];
              case 7:
                r.sent();
                return [7];
              case 8:
                return [2];
            }
          });
        });
      });
    };
    e.prototype.process = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i = this;
        return __generator(this, function (r) {
          return [
            2,
            this.queue(function () {
              return __awaiter(i, undefined, undefined, function () {
                var i, r, o;
                return __generator(this, function (a) {
                  switch (a.label) {
                    case 0:
                      i = this.getFullPath(e);
                      return [4, this.fs.read(i)];
                    case 1:
                      if (((r = a.sent()), (o = t(r)) === r)) return [2, r];
                      a.label = 2;
                    case 2:
                      a.trys.push([2, , 7, 9]);
                      return [4, this.fs.write(i, o)];
                    case 3:
                      a.sent();
                      return n ? (n.ctime || n.mtime ? [4, this.fs.setTimes(i, n.ctime, n.mtime)] : [3, 5]) : [3, 6];
                    case 4:
                      a.sent();
                      a.label = 5;
                    case 5:
                      n.immediate && n.immediate();
                      a.label = 6;
                    case 6:
                      return [3, 9];
                    case 7:
                      return [4, this.reconcileInternalFile(e)];
                    case 8:
                      a.sent();
                      return [7];
                    case 9:
                      return [2, o];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.getResourcePath = function (e) {
      var t = this.getFullPath(e);
      return this.fs.getUri(t);
    };
    e.prototype.getNativePath = function (e) {
      var t = this.getFullPath(e);
      return this.fs.getNativeUri(t);
    };
    e.prototype.open = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          t = this.getFullPath(e);
          return [2, this.fs.open(t)];
        });
      });
    };
    e.prototype.remove = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                t = this.getFullPath(e);
                return [4, this.fs.delete(t)];
              case 1:
                n.sent();
                return [4, this.reconcileInternalFile(e)];
              case 2:
                n.sent();
                return [2];
            }
          });
        });
      });
    };
    e.prototype.update = function (e) {
      var t = this;
      return this.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                return [4, this.reconcileInternalFile(e)];
              case 1:
                t.sent();
                return [2];
            }
          });
        });
      });
    };
    e.prototype.rename = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return e === t
                ? [2]
                : [
                    4,
                    this.queue(function () {
                      return __awaiter(n, undefined, undefined, function () {
                        var n, i, r, o, realpath, s, l, c, u, h;
                        return __generator(this, function (p) {
                          switch (p.label) {
                            case 0:
                              n = this.getFullPath(e);
                              i = this.getFullPath(t);
                              return [4, this._exists(i, !1)];
                            case 1:
                              if (p.sent() && (!this.insensitive || e.toLowerCase() !== t.toLowerCase()))
                                throw new Error("Destination file already exists!");
                              r = this.files[e];
                              o = r ? r.realpath : null;
                              return [4, this.fs.rename(n, i)];
                            case 2:
                              if ((p.sent(), !r)) return [2];
                              if (
                                (delete this.files[e],
                                (realpath = this.getRealPath(t)),
                                (r.realpath = realpath),
                                (this.files[t] = r),
                                this.trigger("renamed", t, e),
                                r.type === "folder")
                              )
                                for (s in this.files)
                                  if (this.files.hasOwnProperty(s) && s.startsWith(e + "/")) {
                                    l = s.slice(e.length);
                                    c = t + l;
                                    u = this.files[s];
                                    delete this.files[s];
                                    h = u.realpath.slice(o.length);
                                    u.realpath = realpath + h;
                                    this.files[c] = u;
                                    this.trigger("renamed", c, s);
                                  }
                              return [2];
                          }
                        });
                      });
                    }),
                  ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.copy = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [
                4,
                this.queue(function () {
                  return __awaiter(n, undefined, undefined, function () {
                    var n, i;
                    return __generator(this, function (r) {
                      switch (r.label) {
                        case 0:
                          n = this.getFullPath(e);
                          i = this.getFullPath(t);
                          return [4, this.fs.copy(n, i)];
                        case 1:
                          r.sent();
                          return [4, this.reconcileInternalFile(t)];
                        case 2:
                          r.sent();
                          return [2];
                      }
                    });
                  });
                }),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.exists = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          return [
            2,
            this.queue(function () {
              var i = n.getFullPath(e);
              return n._exists(i, t);
            }),
          ];
        });
      });
    };
    e.prototype._exists = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              r.trys.push([0, 2, , 3]);
              return [4, this.fs.stat(e)];
            case 1:
              r.sent();
              return [3, 3];
            case 2:
              r.sent();
              return [2, !1];
            case 3:
              return t && this.insensitive ? ((n = Zc(e)), (i = getFilename(e)), [4, this.fs.readdir(n)]) : [3, 5];
            case 4:
              if (
                -1 ===
                r
                  .sent()
                  .map(function (e) {
                    return e.name;
                  })
                  .indexOf(i)
              )
                return [2, !1];
              r.label = 5;
            case 5:
              return [2, !0];
          }
        });
      });
    };
    e.prototype.stat = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          return [
            2,
            this.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                var t, n, i;
                return __generator(this, function (r) {
                  switch (r.label) {
                    case 0:
                      t = this.getFullPath(e);
                      r.label = 1;
                    case 1:
                      r.trys.push([1, 3, , 4]);
                      return [4, this.fs.stat(t)];
                    case 2:
                      return (n = r.sent()).type === "file"
                        ? [
                            2,
                            __assign(
                              {
                                type: "file",
                              },
                              KX(n),
                            ),
                          ]
                        : n.type === "directory"
                          ? [
                              2,
                              __assign(
                                {
                                  type: "folder",
                                },
                                KX(n),
                              ),
                            ]
                          : [3, 4];
                    case 3:
                      if ((i = r.sent()).code !== "ENOENT") throw i;
                      return [3, 4];
                    case 4:
                      return [2, null];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.list = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          return [
            2,
            this.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                var t, n, i, r, o, a, s, l;
                return __generator(this, function (c) {
                  switch (c.label) {
                    case 0:
                      t = this.getFullPath(e);
                      return [4, this.fs.readdir(t)];
                    case 1:
                      for (
                        n = c.sent(),
                          i = {
                            folders: [],
                            files: [],
                          },
                          r = 0,
                          o = n;
                        r < o.length;
                        r++
                      ) {
                        a = o[r];
                        s = iu(e === "" ? a.name : e + "/" + a.name);
                        l = normalizePath(s);
                        a.type === "file" && i.files.push(l);
                        a.type === "directory" && i.folders.push(l);
                      }
                      return [2, i];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.watch = function (handler) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.stopWatch()];
            case 1:
              n.sent();
              this.handler = handler;
              return [
                4,
                filesystemPlugin.addListener("change", function (e) {
                  var n = iu(e.path),
                    i = iu(n.substr(t.basePath.length));
                  t.onFileChange(i);
                }),
              ];
            case 2:
              n.sent();
              return [
                2,
                this.queue(function () {
                  return t.watchAndList();
                }),
              ];
          }
        });
      });
    };
    e.prototype.stopWatch = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              e.trys.push([0, 2, , 3]);
              return [4, filesystemPlugin.stopWatch()];
            case 1:
              e.sent();
              return [3, 3];
            case 2:
              e.sent();
              return [3, 3];
            case 3:
              this.handler = null;
              return [2];
          }
        });
      });
    };
    e.prototype.onFileChange = function (e) {
      var t = this;
      if (e) {
        e = iu(e);
        setTimeout(function () {
          var n = normalizePath(e);
          t.queue(function () {
            return t.reconcileFile(e, n, !1);
          });
        }, 0);
      }
    };
    e.prototype.reconcileInternalFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [2, this.reconcileFile(this.getRealPath(e), e)];
        });
      });
    };
    e.prototype.reconcileFile = function (e, t) {
      return __awaiter(this, arguments, Promise, function (e, t, n) {
        var i, r, o, a, s, l, c;
        undefined === n && (n = true);
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              this.trigger("raw", t);
              return Xc(t) ? [4, this.reconcileDeletion(e, t, n)] : [3, 2];
            case 1:
              return [2, u.sent()];
            case 2:
              return (i = Zc(t)) && i !== "/"
                ? this.files[t]
                  ? [3, 4]
                  : [4, this.reconcileFile(Zc(e), i, n)]
                : [3, 4];
            case 3:
              u.sent();
              u.label = 4;
            case 4:
              u.trys.push([4, 12, , 16]);
              r = this.getFullRealPath(e);
              return this.insensitive ? ((o = Zc(r)), (a = getFilename(t)), [4, this.fs.readdir(o)]) : [3, 7];
            case 5:
              s = u.sent();
              return -1 !==
                s
                  .map(function (e) {
                    return Kc(e.name).normalize("NFC");
                  })
                  .indexOf(a)
                ? [3, 7]
                : [4, this.reconcileDeletion(e, t, n)];
            case 6:
              return [2, u.sent()];
            case 7:
              return [4, this.fs.stat(r)];
            case 8:
              return (l = u.sent()).type !== "file" ? [3, 9] : (this.reconcileFileChanged(e, t, l), [3, 11]);
            case 9:
              return l.type !== "directory" ? [3, 11] : [4, this.reconcileFolderCreation(e, t)];
            case 10:
              u.sent();
              u.label = 11;
            case 11:
              return [3, 16];
            case 12:
              return (c = u.sent()).code !== "ENOENT" ? [3, 14] : [4, this.reconcileDeletion(e, t, n)];
            case 13:
              u.sent();
              return [3, 15];
            case 14:
              console.error(c);
              u.label = 15;
            case 15:
              return [3, 16];
            case 16:
              return [2];
          }
        });
      });
    };
    e.prototype.reconcileFileChanged = function (realpath, t, n) {
      var i = this.files[t];
      if (i) {
        if (((i.realpath = realpath), i.type === "file" && (i.mtime !== Math.round(n.mtime) || i.size !== n.size))) {
          i.mtime = Math.round(n.mtime);
          i.size = n.size;
          var r = KX(n);
          this.trigger("modified", t, t, r);
        }
      } else this.reconcileFileCreation(realpath, t, n);
    };
    e.prototype.reconcileFileCreation = function (e, t, n) {
      var i = KX(n);
      if (!this.files[t]) {
        this.files[t] = (function (realpath, t) {
          return t.type === "file"
            ? {
                type: "file",
                realpath: realpath,
                ctime: Math.round(t.ctime),
                mtime: Math.round(t.mtime),
                size: t.size,
              }
            : t.type === "directory"
              ? {
                  type: "folder",
                  realpath: realpath,
                }
              : undefined;
        })(e, n);
        this.trigger("file-created", t, t, i);
      }
    };
    e.prototype.reconcileFolderCreation = function (realpath, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return this.files.hasOwnProperty(t)
                ? [3, 2]
                : ((this.files[t] = {
                    type: "folder",
                    realpath: realpath,
                  }),
                  this.trigger("folder-created", t),
                  [4, this.listRecursive(realpath)]);
            case 1:
              n.sent();
              return [3, 3];
            case 2:
              this.files[t].realpath = realpath;
              n.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    e.prototype.reconcileDeletion = function (e, t) {
      return __awaiter(this, arguments, Promise, function (e, t, n) {
        var i,
          r,
          o = this;
        undefined === n && (n = true);
        return __generator(this, function (a) {
          if (t === "/") {
            this.trigger("closed", t);
            return [2];
          }
          if (!(i = this.files[t])) return [2];
          if (!n) {
            setTimeout(function () {
              o.queue(function () {
                return o.reconcileFile(e, t);
              });
            }, 100);
            return [2];
          }
          if (i.type === "folder")
            for (r in this.files)
              if (this.files.hasOwnProperty(r) && r.startsWith(t + "/")) {
                this.removeFile(r);
              }
          this.removeFile(t);
          return [2];
        });
      });
    };
    e.prototype.trigger = function (e, t, n, i) {
      if (this.handler) {
        this.handler(e, t, n, i);
      }
    };
    e.prototype.getRealPath = function (e) {
      for (var t = e; t; ) {
        if (this.files.hasOwnProperty(t)) {
          var n = e.substr(t.length);
          return this.files[t].realpath + n;
        }
        t = Zc(t);
      }
      return e;
    };
    e.prototype.getFullPath = function (e) {
      var t = this.getRealPath(e);
      return this.getFullRealPath(t);
    };
    e.prototype.getFullRealPath = function (e) {
      return this.basePath + "/" + e;
    };
    e.prototype.queue = function (e) {
      var promise = this.promise.then(e, e);
      this.promise = promise;
      return promise;
    };
    e.prototype.removeFile = function (e) {
      var t = this.files[e];
      delete this.files[e];
      t &&
        (t.type === "file"
          ? this.trigger("file-removed", e)
          : t.type === "folder" && this.trigger("folder-removed", e));
    };
    return e;
  })(),
  ZX = "https://github.com/";
function XX(e, t, n) {
  return "https://raw.githubusercontent.com/" + e + "/" + (n || "HEAD") + "/" + t;
}
function QX(e) {
  return ZX + e;
}
function $X(e, t, n) {
  return ZX + e + "/releases/download/" + t + "/" + n;
}
function JX(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n, i, r, o;
    return __generator(this, function (a) {
      switch (a.label) {
        case 0:
          if (((n = t.version || null), (i = t.minAppVersion), !apiVersion || !i || !pG(apiVersion, i))) return [2, n];
          a.label = 1;
        case 1:
          a.trys.push([1, 3, , 4]);
          n = null;
          return [4, requestWithWrapper(XX(e, "versions.json")).json];
        case 2:
          if ((r = a.sent())) {
            for (o in r)
              if (r.hasOwnProperty(o)) {
                pG(apiVersion, r[o]) || (n && !pG(n, o)) || (n = o);
              }
            return [2, n];
          }
          return [3, 4];
        case 3:
          a.sent();
          return [3, 4];
        case 4:
          return [2, null];
      }
    });
  });
}
var eQ = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)$/;
function tQ(e, t) {
  e.on("click", "a", function (t, n) {
    if (t.button === 0 && n.instanceOf(HTMLAnchorElement) && n.getAttr("href").startsWith("#"))
      for (
        var i = n.getAttr("href").substring(1).toLowerCase(), r = 0, o = e.findAll("h1,h2,h3,h4,h5,h6");
        r < o.length;
        r++
      ) {
        var a = o[r],
          s = a.getAttr("data-heading");
        if (s)
          if (s.toLowerCase().replace(Rx, "").replace(/ /g, "-") === i)
            return void a.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
      }
  });
  for (var n = 0, i = Array.from(e.findAll(".internal-embed")); n < i.length; n++) {
    if ((c = (l = i[n]).getAttr("src"))) {
      var r = getExtension(c),
        o = XX(t, c);
      VIDEO_EXTENSIONS.contains(r) ? preloadVideo(l, o) : preloadImage(l, o);
    }
  }
  for (var a = 0, s = Array.from(e.findAll("img, video")); a < s.length; a++) {
    var l;
    if ((l = s[a]).instanceOf(HTMLImageElement) || l.instanceOf(HTMLMediaElement)) {
      var c;
      if (!(c = l.getAttr("src"))) continue;
      if (!c.contains(":")) {
        l.src = XX(t, c);
        continue;
      }
      var u = c.match(eQ);
      if (u) {
        var h = u[1],
          p = u[2],
          d = u[3],
          f = u[4];
        l.src = XX(h + "/" + p, f, d);
        continue;
      }
    }
  }
}
var typenQ0 = "release-notes",
  iQ = "obsidianmd/obsidian-docs",
  rQ = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.canDropAnywhere = true;
      n.navigation = true;
      n.version = "";
      n.contentEl.addClass("release-notes-view");
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return i18nProxy.interface.releaseNotes.tabTitle({
        version: this.version,
      });
    };
    t.prototype.getViewType = function () {
      return typenQ0;
    };
    t.prototype.getIcon = function () {
      return "lucide-book-up";
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.currentVersion = this.version;
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, version;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              i = this.version;
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              o.sent();
              (version = t.currentVersion) && /^(\d+)\.(\d+)(\.\d+)?$/.test(version) && (this.version = version);
              this.version || (this.version = electron.ipcRenderer.sendSync("version"));
              i !== this.version && this.render();
              return [2];
          }
        });
      });
    };
    t.prototype.fetchReleaseNotes = function (version) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t = XX(iQ, "Release%20notes/v".concat(version, ".md"));
              r.label = 1;
            case 1:
              r.trys.push([1, 3, , 4]);
              return [
                4,
                requestWithWrapper({
                  url: t,
                  throw: !0,
                }).text,
              ];
            case 2:
              n = r.sent();
              return [3, 4];
            case 3:
              i = r.sent();
              n =
                i.status === 404
                  ? i18nProxy.interface.releaseNotes.msgMissingReleaseNotes({
                      version: version,
                    })
                  : i18nProxy.interface.releaseNotes.msgFailedToLoad({
                      version: version,
                    });
              return [3, 4];
            case 4:
              return [2, n];
          }
        });
      });
    };
    t.prototype.showPatchNotes = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return e.hasChildNodes()
                ? [3, 2]
                : [
                    4,
                    withLoadingClass(e, function () {
                      return r.fetchReleaseNotes(t);
                    }),
                  ];
            case 1:
              n = o.sent();
              i = renderMarkdown(removeYamlFrontmatterNode(parseMetadata(n)));
              e.appendChild(sanitizeHTMLToDom(i));
              o.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    t.prototype.render = function () {
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
          u = this;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              (e = this.contentEl).empty();
              t = e.createDiv("cm-scroller");
              n = this.app.vault.getConfig("readableLineLength");
              t.toggleClass("is-readable-line-width", n);
              i = t.createDiv("markdown-preview-view markdown-rendered");
              r = hG(this.version);
              (o = r).last() !== 0 && (o = __spreadArray(__spreadArray([], o.slice(0, -1), !0), [0], !1));
              a = function (e, t) {
                return createDiv("callout is-collapsed is-collapsible", function (n) {
                  var i;
                  n.setAttribute("data-callout", e.type);
                  n.createDiv(
                    {
                      cls: "callout-title",
                    },
                    function (t) {
                      t.createDiv({
                        cls: "callout-title-inner",
                        text: e.title,
                      });
                      var r = t.createDiv("callout-fold", function (e) {
                        return setIcon(e, "lucide-chevron-down");
                      });
                      t.addEventListener("click", function () {
                        var t,
                          o = n.hasClass("is-collapsed");
                        toggleElementVisibility(i, !o, !0);
                        n.toggleClass("is-collapsed", !o);
                        r.toggleClass("is-collapsed", !o);
                        (t = e.onClick) === null || undefined === t || t.call(e, i);
                      });
                      r.addClass("is-collapsed");
                    },
                  );
                  i = n.createDiv("callout-content");
                  t == null || t(i);
                  i.hide();
                  n.addClass("is-collapsed");
                });
              };
              r.last() > 0 &&
                (i.appendChild(
                  a({
                    title: "What's new in v".concat(this.version),
                    type: "attention",
                    onClick: function (e) {
                      return u.showPatchNotes(e, u.version);
                    },
                  }),
                ),
                r.last() > 1 &&
                  i.appendChild(
                    a(
                      {
                        title: "Other versions",
                        type: "",
                      },
                      function (e) {
                        for (
                          var t = function (t) {
                              var n = __spreadArray(__spreadArray([], o.slice(0, -1), !0), [t], !1).join(".");
                              e.appendChild(
                                a({
                                  title: "What's new in v".concat(n),
                                  type: "info",
                                  onClick: function (e) {
                                    return u.showPatchNotes(e, n);
                                  },
                                }),
                              );
                            },
                            n = r.last() - 1;
                          n >= 0;
                          n--
                        )
                          t(n);
                      },
                    ),
                  ),
                i.createEl("hr"));
              s = r.slice(0, -1);
              return [4, this.fetchReleaseNotes(s.join("."))];
            case 1:
              l = h.sent();
              c = renderMarkdown(removeYamlFrontmatterNode(parseMetadata(l)));
              i.createEl("h1", {
                text: "What's new in v".concat(s.join(".")),
              });
              i.appendChild(sanitizeHTMLToDom(c));
              tQ(i, iQ);
              i.createEl(
                "section",
                {
                  cls: "footnotes",
                },
                function (e) {
                  e.createEl("hr");
                  e.createEl(
                    "p",
                    {
                      cls: "footnote",
                      text: "A complete list of previous changes can be found on ",
                    },
                    function (e) {
                      e.createEl("a", {
                        href: "https://obsidian.md/changelog",
                        text: "our changelog",
                        cls: "external-link",
                      });
                      e.appendText(".");
                    },
                  );
                },
              );
              return [2];
          }
        });
      });
    };
    return t;
  })(ItemView);
const oQ = rQ;
var aQ,
  ViewRegistry = (function (e) {
    function t() {
      var t = e.call(this) || this;
      t.viewByType = {};
      t.typeByExtension = {};
      t.registerViewWithExtensions(MARKDOWN_EXTENSIONS, MarkdownView.VIEW_TYPE, function (e) {
        return new MarkdownView(e);
      });
      t.registerViewWithExtensions(IMAGE_EXTENSIONS, RK.VIEW_TYPE, function (e) {
        return new RK(e);
      });
      t.registerViewWithExtensions(AUDIO_EXTENSIONS, FK.VIEW_TYPE, function (e) {
        return new FK(e);
      });
      t.registerViewWithExtensions(VIDEO_EXTENSIONS, aY.VIEW_TYPE, function (e) {
        return new aY(e);
      });
      t.registerViewWithExtensions(PDF_EXTENSIONS, iY.VIEW_TYPE, function (e) {
        return new iY(e);
      });
      t.registerView(typenQ0, function (e) {
        return new oQ(e);
      });
      return t;
    }
    __extends(t, e);
    t.prototype.registerView = function (e, t) {
      var n = this.viewByType;
      if (n.hasOwnProperty(e)) throw new Error('Attempting to register an existing view type "'.concat(e, '"'));
      n[e] = t;
      this.trigger("view-registered", e);
    };
    t.prototype.unregisterView = function (e) {
      var t = this.viewByType;
      if (t.hasOwnProperty(e)) {
        delete t[e];
        this.trigger("view-unregistered", e);
      }
    };
    t.prototype.registerExtensions = function (e, t) {
      for (var n = this.typeByExtension, i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        if (n.hasOwnProperty(o)) throw new Error('Attempting to register an existing file extension "'.concat(o, '"'));
      }
      for (var a = 0, s = e; a < s.length; a++) {
        o = s[a];
        this.typeByExtension[o] = t;
      }
      this.trigger("extensions-updated");
    };
    t.prototype.unregisterExtensions = function (e) {
      for (var t = 0, n = e; t < n.length; t++) {
        var i = n[t];
        delete this.typeByExtension[i];
      }
      this.trigger("extensions-updated");
    };
    t.prototype.registerViewWithExtensions = function (e, t, n) {
      this.registerView(t, n);
      this.registerExtensions(e, t);
    };
    t.prototype.getViewCreatorByType = function (e) {
      return this.viewByType[e];
    };
    t.prototype.getTypeByExtension = function (e) {
      return this.typeByExtension[e];
    };
    t.prototype.isExtensionRegistered = function (e) {
      return this.typeByExtension.hasOwnProperty(e);
    };
    t.prototype.trigger = function (t) {
      for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
      e.prototype.trigger.apply(this, __spreadArray([t], n, !1));
    };
    t.prototype.on = function (t, n, i) {
      return e.prototype.on.call(this, t, n, i);
    };
    return t;
  })(Events);
!(function (e) {
  e.Default = "DEFAULT";
  e.Destructive = "DESTRUCTIVE";
  e.Cancel = "CANCEL";
})(aQ || (aQ = {}));
function lQ(e) {
  e.checkCallback
    ? e.checkCallback(!1)
    : e.callback
      ? e.callback()
      : console.error("Command ".concat(e, " did not provide a callback"));
}