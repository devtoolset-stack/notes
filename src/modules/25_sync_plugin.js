var l7 = window.process && window.process.platform,
  c7 = isNotWeb || (l7 && l7 !== "win32" && l7 !== "darwin"),
  u7 = isNotWeb ? 500 : 2e3;
function h7(e) {
  return e === "manifest.json" || e === "main.js" || e === "styles.css" || e === "data.json";
}
var p7 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.id = "sync";
      t.name = t7.name();
      t.description = t7.desc();
      t.defaultOn = true;
      t.app = null;
      t.vault = null;
      t.plugin = null;
      t.db = null;
      t.vaultId = null;
      t.vaultName = null;
      t.key = null;
      t.salt = null;
      t.encryptionVersion = -1;
      t.encryptionProvider = null;
      t.host = null;
      t.deviceName = "";
      t.userId = -1;
      t.version = 0;
      t.initial = true;
      t.localFiles = {};
      t.scanSpecialFiles = false;
      t.scanSpecialFileQueue = [];
      t.serverFiles = {};
      t.fileRetry = {};
      t.newServerFiles = [];
      t.allowTypes = new Set(u$);
      t.conflictAction = "merge";
      t.allowSpecialFiles = new Set(h$);
      t.ignoreFolders = [];
      t.preventSleep = false;
      t.initialized = false;
      t.dirty = false;
      t.dataLoaded = false;
      t.requestSaveData = debounce(t.saveData.bind(t), 2e3);
      t.boundOnFileAdd = t.onFileAdd.bind(t);
      t.boundOnFileRemove = t.onFileRemove.bind(t);
      t.boundOnFileRename = t.onFileRename.bind(t);
      t.boundOnRaw = t.onRaw.bind(t);
      t.pause = false;
      t.syncing = false;
      t.error = false;
      t.ready = false;
      t.server = null;
      t.syncLog = [];
      t.timer = 0;
      t.backoff = new e7(0, 3e5, 5e3, !0);
      t.statusIconEl = null;
      t.filterCache = {};
      t.syncingPath = "";
      t.syncStatus = "";
      t.requestStatusBarUpdate = debounce(t._updateStatusBar, 100);
      return t;
    }
    __extends(t, e);
    t.prototype.getRemoteVaultId = function () {
      return this.vaultId;
    };
    t.prototype.getRemoteVaultName = function () {
      return this.vaultName;
    };
    t.prototype.setRemoteVaultName = function (vaultName) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.vaultName = vaultName;
              return [4, this.saveData()];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.vault = app.vault;
      this.plugin = plugin;
      this.settingTab = new I8(app, plugin, this);
      plugin.registerStatusBarItem();
      plugin.registerViewType(i7, function (e) {
        return new Z8(e, n);
      });
      plugin.registerGlobalCommand({
        id: "sync:setup",
        name: i18nProxy.plugins.sync.actionSetupSync(),
        icon: "lucide-settings",
        checkCallback: function (e) {
          e || n.openSettings();
          return !n.vaultId;
        },
      });
      plugin.registerGlobalCommand({
        id: "sync:view-version-history",
        name: i18nProxy.plugins.sync.actionViewVersionHistory(),
        icon: "lucide-history",
        checkCallback: function (e) {
          if (!n.vaultId) return !1;
          var t = n.app.workspace.getActiveViewOfType(FileView);
          return t ? (e || n.showVersionHistory(t.file.path), !0) : undefined;
        },
      });
      plugin.registerGlobalCommand({
        id: "sync:open-sync-view",
        name: t7.actionViewSyncSidebar(),
        icon: "lucide-rotate-ccw",
        checkCallback: function (e) {
          return (
            !!n.vaultId &&
            (e ||
              n.app.workspace.ensureSideLeaf(i7, "right", {
                active: true,
                reveal: true,
              }),
            !0)
          );
        },
      });
      plugin.registerGlobalCommand({
        id: "sync:open-sync-log",
        name: t7.actionActivityLog(),
        icon: "lucide-align-left",
        checkCallback: function (e) {
          return !!n.vaultId && (e || n.showSyncLog(), !0);
        },
      });
      this.setStatus("Uninitialized");
    };
    t.prototype.openChooseRemoteVaultModal = function () {
      new q8(this.app, this).open();
    };
    t.prototype.connectToVault = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          (t = new j8(this.app, this).connect(e)).shouldAnimate = !1;
          t.open();
          return [2];
        });
      });
    };
    t.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r,
          o = this;
        return __generator(this, function (a) {
          n = e.workspace;
          this.registerEvents();
          t.addSettingTab(this.settingTab);
          t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
          n.onLayoutReady(function () {
            return __awaiter(o, undefined, undefined, function () {
              return __generator(this, function (e) {
                switch (e.label) {
                  case 0:
                    return [4, this.loadData()];
                  case 1:
                    e.sent();
                    this.initialized = true;
                    this.dataLoaded = true;
                    this.requestSync();
                    this.requestStatusBarUpdate();
                    return [2];
                }
              });
            });
          });
          this.timer = window.setInterval(this.requestSync.bind(this), 3e4);
          this.on("status-change", function () {
            return o.requestStatusBarUpdate();
          });
          Platform.isMobile
            ? n.onLayoutReady(function () {
                var e = n.rightSplit;
                o.statusIconEl = e.addHeaderButton("sync-small", o.openStatusIconMenu.bind(o));
                o.statusIconEl.addEventListener("contextmenu", o.openStatusIconMenu.bind(o));
                o.statusIconEl.addClass("sync-status-icon");
              })
            : (i = t.statusBarEl) &&
              ((r = i.createDiv("status-bar-item-segment")),
              (this.statusIconEl = r.createSpan("status-bar-item-icon sync-status-icon")),
              i.addEventListener("click", this.openStatusIconMenu.bind(this)),
              i.addEventListener("contextmenu", this.openStatusIconMenu.bind(this)));
          return [2];
        });
      });
    };
    t.prototype.onDisable = function (e, t) {
      this.server && (this.server.disconnect(), (this.server = null));
      this.timer && (clearInterval(this.timer), (this.timer = 0));
      this.statusIconEl && this.statusIconEl.detach();
      this.unregisterEvents();
    };
    t.prototype.onFileMenu = function (e, t, n) {
      var i = this;
      if (t instanceof TFile && (n === "tab-header" || n === "more-options" || n === "file-explorer-context-menu")) {
        e.addItem(function (e) {
          return e
            .setSection("view")
            .setTitle(t7.menuOptViewVersionHistory())
            .setIcon("lucide-history")
            .onClick(function () {
              return i.showVersionHistory(t.path);
            });
        });
      }
    };
    t.prototype.openStatusIconMenu = function (e) {
      var t = this,
        n = Menu.forEvent(e);
      n.addSections(["status", "selection", "", "global"]);
      var i = this.app.workspace.getActiveFile();
      if (
        (n.addItem(function (e) {
          return e
            .setSection("status")
            .setTitle(
              t7.labelSyncStatus({
                status: t.syncStatus,
              }),
            )
            .setIsLabel(!0)
            .removeIcon()
            .titleEl.addClass("u-small");
        }),
        this.vaultId)
      ) {
        var r = this.pause;
        n.addItem(function (e) {
          return e
            .setSection("status")
            .setTitle(t7(r ? "button-resume" : "button-pause"))
            .setIcon(r ? "lucide-play-circle" : "paused")
            .onClick(function () {
              return t.setPause(!r);
            });
        })
          .addItem(function (e) {
            return e
              .setTitle(t7.labelVersionHistory())
              .setIcon("lucide-history")
              .setSection("selection")
              .setDisabled(!i)
              .onClick(function () {
                if (i) {
                  t.showVersionHistory(i.path);
                }
              });
          })
          .addItem(function (e) {
            return e
              .setTitle(t7.optionSyncLog())
              .setIcon("lucide-align-left")
              .setSection("global")
              .onClick(function () {
                return t.showSyncLog();
              });
          })
          .addItem(function (e) {
            return e
              .setTitle(t7.optionViewDeletedFiles())
              .setIcon("lucide-trash-2")
              .setSection("global")
              .onClick(function () {
                return t.showDeletedFiles();
              });
          })
          .addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.settings())
              .setIcon("lucide-settings")
              .setSection("global")
              .onClick(function () {
                return t.openSettings();
              });
          });
      } else
        n.addItem(function (e) {
          return e
            .setTitle(i18nProxy.interface.settings())
            .setIcon("lucide-settings")
            .onClick(function () {
              return t.openSettings();
            });
        });
      n.setParentElement(this.statusIconEl).showAtMouseEvent(e);
    };
    t.prototype.loadData = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              e = null;
              u.label = 1;
            case 1:
              u.trys.push([1, 4, , 5]);
              t = this;
              return [
                4,
                EX(this.app.appId + "-sync", 1, {
                  upgrade: function (e, t, n, i) {
                    if (!e.objectStoreNames.contains("data")) {
                      e.createObjectStore("data");
                    }
                  },
                }),
              ];
            case 2:
              return [4, (t.db = u.sent()).get("data", "data")];
            case 3:
              e = u.sent();
              return [3, 5];
            case 4:
              n = u.sent();
              console.error("Failed to load sync data", n);
              return [3, 5];
            case 5:
              if (!e) return [2];
              i = 0;
              try {
                this.vaultId = e.vaultId;
                this.vaultName = e.vaultName;
                this.encryptionVersion = e.encryptionVersion || 0;
                this.key = base64ToArrayBuffer(e.key);
                this.salt = e.salt;
                this.host = e.host;
                this.deviceName = e.deviceName || "";
                this.userId = e.userId || -1;
                this.pause = !!e.pause;
                this.version = e.version || 0;
                this.initial = undefined === e.initial || !!e.initial;
                this.localFiles = e.local || {};
                this.serverFiles = e.remote || {};
                this.newServerFiles = e.pending || [];
                (r = e.appId) &&
                  r !== this.app.appId &&
                  ((this.pause = true),
                  (this.version = 0),
                  (this.initial = true),
                  (this.localFiles = {}),
                  (this.serverFiles = {}),
                  (this.newServerFiles = []));
                this.fileRetry = {};
                this.filterCache = {};
                this.allowTypes = new Set(e.allowTypes || u$);
                this.allowSpecialFiles = new Set(e.allowSpecialFiles || []);
                this.ignoreFolders = e.ignoreFolders || [];
                this.preventSleep = e.preventSleep || !1;
                !Object.hasOwn(e, "conflictAction") || (e.conflictAction !== "merge" && e.conflictAction !== "conflict")
                  ? (this.conflictAction = "merge")
                  : (this.conflictAction = e.conflictAction);
                i = e.dataVer || 0;
              } catch (e) {
                console.error(e);
              }
              this.scanFiles();
              this.vault.getRoot().children.length === 0 &&
                ((this.pause = true),
                this.setStatus("Error"),
                this.log(
                  "Empty vault detected, sync paused to prevent accidental data loss. Resuming Sync may delete all files from your remote vault. See https://help.obsidian.md/sync/troubleshoot for more details.",
                ));
              a = (o = this).serverFiles;
              s = o.localFiles;
              try {
                if (i < 1)
                  for (l in a)
                    if (Object.hasOwn(a, l) && !Object.hasOwn(s, l) && l.toLowerCase().endsWith(".canvas")) {
                      (c = a[l]).folder || this.newServerFiles.push(c);
                    }
              } catch (e) {
                console.error(e);
              }
              try {
                if (i < 2)
                  for (l in a)
                    if (Object.hasOwn(a, l) && !Object.hasOwn(s, l) && l.toLowerCase().endsWith(".base")) {
                      (c = a[l]).folder || this.newServerFiles.push(c);
                    }
              } catch (e) {
                console.error(e);
              }
              return [2];
          }
        });
      });
    };
    t.prototype.saveData = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this.dirty
                ? ((this.dirty = false),
                  ((e = {}).appId = this.app.appId),
                  (e.vaultId = this.vaultId),
                  (e.vaultName = this.vaultName),
                  (e.key = arrayBufferToBase64(this.key)),
                  (e.salt = this.salt),
                  (e.encryptionVersion = this.encryptionVersion),
                  (e.host = this.host),
                  (e.deviceName = this.deviceName),
                  (e.userId = this.userId),
                  (e.pause = this.pause),
                  (e.version = this.version),
                  (e.initial = this.initial),
                  (e.local = this.localFiles),
                  (e.remote = this.serverFiles),
                  (e.pending = this.newServerFiles),
                  (e.allowTypes = Array.from(this.allowTypes)),
                  (e.allowSpecialFiles = Array.from(this.allowSpecialFiles)),
                  (e.ignoreFolders = this.ignoreFolders),
                  (e.preventSleep = this.preventSleep),
                  (e.conflictAction = this.conflictAction),
                  (e.dataVer = 2),
                  [4, this.db.put("data", e, "data")])
                : [2];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.getDefaultDeviceName = function () {
      return Platform.isDesktopApp ? loadModule("os").hostname() : p$ || "Unknown";
    };
    t.prototype.setup = function (vaultId, vaultName, n, salt, host, encryptionVersion) {
      return __awaiter(this, undefined, undefined, function () {
        var a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              this.vaultId = vaultId;
              this.vaultName = vaultName;
              a = this;
              return [4, PQ(n, salt)];
            case 1:
              a.key = s.sent();
              this.salt = salt;
              this.encryptionVersion = encryptionVersion;
              this.host = host;
              this.clear();
              this.scanFiles();
              return [4, this.saveData()];
            case 2:
              s.sent();
              this.requestSync();
              return [2];
          }
        });
      });
    };
    t.prototype.unsetup = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              this.vaultId = null;
              this.vaultName = null;
              this.key = null;
              this.salt = null;
              this.encryptionVersion = -1;
              this.encryptionProvider = null;
              this.host = null;
              this.clear();
              this.setStatus("Uninitialized");
              return [4, this.saveData()];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.clear = function () {
      this.dirty = true;
      this.version = 0;
      this.initial = true;
      this.serverFiles = {};
      this.newServerFiles = [];
      this.fileRetry = {};
      this.ignoreFolders = [];
      this.filterCache = {};
      this.allowTypes = new Set(u$);
      this.allowSpecialFiles = new Set(h$);
      var e = this.server;
      e && (e.disconnect(), (this.server = null));
      this.gettingServer = null;
      this.backoff.success();
    };
    t.prototype.setVaultName = function (vaultName) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          this.vaultName = vaultName;
          this.forceSaveData();
          return [2];
        });
      });
    };
    t.prototype.setPause = function (pause) {
      this.pause = pause;
      pause
        ? (this.setStatus("Paused"), this.log("Paused"))
        : (this.setStatus("Resumed"), this.log("Resumed. Detecting changes..."));
      this.dirty = true;
      this.saveData();
      this.requestSync();
    };
    t.prototype.getPause = function () {
      return this.pause;
    };
    t.prototype.changeFilter = function (e) {
      var t = this.serverFiles,
        n = this.newServerFiles,
        i = [];
      for (var r in t)
        if (t.hasOwnProperty(r)) {
          var o = t[r];
          if (!this.allowSyncFile(o.path, o.folder)) {
            i.push(o);
          }
        }
      e();
      this.filterCache = {};
      for (var a = [], s = 0, l = i; s < l.length; s++) {
        o = l[s];
        if (this.allowSyncFile(o.path, o.folder)) {
          a.push(o);
        }
      }
      a.sort(function (e, t) {
        return e.path.length - t.path.length;
      });
      n.unshift.apply(n, a);
    };
    t.prototype.log = function (e, t, n) {
      undefined === n && (n = false);
      this.logTags(e, "", t, n);
    };
    t.prototype.logMerge = function (e, t, n) {
      undefined === n && (n = false);
      this.logTags(e, "merge", t, n);
    };
    t.prototype.logSkip = function (e, t, n) {
      undefined === n && (n = false);
      this.logTags(e, "skip", t, n);
    };
    t.prototype.logTags = function (info, typet0, filen0, error) {
      if (undefined === error) {
        error = false;
      }
      var r = this.syncLog;
      if (info === "Fully synced" && r.last().info === info) return;
      r.push({
        file: filen0,
        info: info,
        ts: Date.now(),
        error: error,
        type: typet0,
      });
      r.length > u7 && r.splice(0, 100);
      this.trigger("new-log");
    };
    t.prototype.scanFiles = function () {
      for (var e = this.vault, t = this.localFiles, n = [e.getRoot()]; n.length; ) {
        var i = n.pop();
        if ((this.onFileAdd(i), i instanceof TFolder))
          for (var r = 0, o = i.children; r < o.length; r++) {
            var a = o[r];
            n.push(a);
          }
      }
      for (var s in t) {
        if (t.hasOwnProperty(s) && !s.startsWith("."))
          if (!e.getAbstractFileByPath(s)) {
            delete t[s];
          }
      }
      this.scanSpecialFiles = true;
    };
    t.prototype.setIgnoreFolders = function (ignoreFolders) {
      var t = this;
      this.changeFilter(function () {
        t.ignoreFolders = ignoreFolders;
      });
      this.forceSaveData();
      this.requestSync();
    };
    t.prototype.setSyncType = function (e, t) {
      var n = this;
      if (this.allowTypes.has(e) !== t) {
        this.changeFilter(function () {
          t ? n.allowTypes.add(e) : n.allowTypes.delete(e);
        });
        this.forceSaveData();
        this.requestSync();
      }
    };
    t.prototype.setAllowSpecialFile = function (e, t) {
      var n = this;
      if (this.allowSpecialFiles.has(e) !== t) {
        this.changeFilter(function () {
          t ? n.allowSpecialFiles.add(e) : n.allowSpecialFiles.delete(e);
        });
        this.forceSaveData();
        this.requestSync();
      }
    };
    t.prototype.registerEvents = function () {
      this.vault.on("create", this.boundOnFileAdd);
      this.vault.on("modify", this.boundOnFileAdd);
      this.vault.on("delete", this.boundOnFileRemove);
      this.vault.on("rename", this.boundOnFileRename);
      this.vault.on("raw", this.boundOnRaw);
    };
    t.prototype.unregisterEvents = function () {
      this.vault.off("create", this.boundOnFileAdd);
      this.vault.off("modify", this.boundOnFileAdd);
      this.vault.off("delete", this.boundOnFileRemove);
      this.vault.off("rename", this.boundOnFileRename);
      this.vault.off("raw", this.boundOnRaw);
    };
    t.prototype.onFileAdd = function (e) {
      var path = e.path;
      if (path !== "/") {
        var n = this.localFiles,
          i = n[path];
        if (
          (i ||
            (n[path] = i =
              {
                path: path,
                previouspath: "",
                folder: false,
                ctime: 0,
                mtime: 0,
                size: 0,
                hash: "",
                synctime: 0,
                synchash: "",
              }),
          (i.path = path),
          e instanceof TFolder)
        ) {
          i.folder = true;
          i.ctime = 0;
          i.mtime = 0;
          i.size = 0;
          i.hash = "";
        } else if (e instanceof TFile) {
          i.folder = false;
          var r = e.stat,
            mtime = Math.ceil(r.mtime),
            ctime = Math.ceil(r.ctime),
            size = r.size;
          (i.mtime && i.mtime === mtime && i.size === r.size) || (i.hash = "");
          i.mtime = mtime;
          i.ctime = ctime;
          i.size = size;
        }
        this.requestSync();
      }
    };
    t.prototype.onFileRemove = function (e) {
      delete this.localFiles[e.path];
      this.requestSync();
    };
    t.prototype.onFileRename = function (e, previouspath) {
      var n = this.localFiles,
        i = n[previouspath];
      n[e.path] = i;
      delete n[previouspath];
      i.path = e.path;
      i.previouspath || (i.previouspath = previouspath);
      i.synctime = 0;
      this.onFileAdd(e);
      this.setDirty();
      this.requestSync();
    };
    t.prototype.onRaw = function (e) {
      if (e.startsWith(this.vault.configDir + "/")) {
        var t = this.scanSpecialFileQueue;
        if (t.contains(e)) return;
        t.push(e);
        this.requestSync();
      }
    };
    t.prototype.onPushedFile = function (e) {
      if (((this.version = e.uid), !this.initial || !e.deleted)) {
        var t = e.path,
          n = {
            path: e.path,
            size: e.size,
            hash: e.hash,
            ctime: e.ctime,
            mtime: e.mtime,
            folder: e.folder,
            deleted: e.deleted,
            uid: e.uid,
            device: e.device,
            user: e.user,
          };
        if (this.initial) {
          n.initial = true;
        }
        var i = this.newServerFiles;
        if (e.wasJustPushed) {
          for (var r = 0; r < i.length; r++)
            if (i[r].path === t) {
              i.splice(r, 1);
              r -= 1;
            }
          this.serverFiles[t] = n;
          return void this.setDirty();
        }
        this.log(
          "Server pushed" +
            (e.folder ? " (folder)" : "") +
            (e.deleted ? " (deleted or renamed)" : "") +
            (e.device ? " [" + e.device + "]" : ""),
          e.path,
        );
        i.push(n);
        this.requestSync();
      }
    };
    t.prototype.allowSyncFile = function (e, t) {
      var n = this.filterCache;
      return n.hasOwnProperty(e) ? n[e] : (n[e] = this._allowSyncFile(e, t));
    };
    t.prototype._allowSyncFile = function (e, t) {
      for (var n = 0, i = this.ignoreFolders; n < i.length; n++) {
        var r = i[n];
        if ((t && e === r) || e.startsWith(r + "/")) return !1;
      }
      if (!t && e.startsWith(this.vault.configDir + "/")) {
        var o = e.substring((this.vault.configDir + "/").length),
          a = o.split("/");
        if (
          a.some(function (e) {
            return e === "node_modules" || e.startsWith(".");
          })
        )
          return !1;
        var s = getFilename(o),
          l = getExtension(s),
          c = null;
        return (
          o !== "workspace.json" &&
          o !== "workspace-mobile.json" &&
          (o === "app.json" || o === "types.json"
            ? (c = "app")
            : o === "appearance.json"
              ? (c = "appearance")
              : o === "hotkeys.json"
                ? (c = "hotkey")
                : o === "core-plugins.json" || o === "core-plugins-migration.json"
                  ? (c = "core-plugin")
                  : o === "community-plugins.json"
                    ? (c = "community-plugin")
                    : a[0] !== "themes" || a.length !== 3 || (s !== "theme.css" && s !== "manifest.json")
                      ? a[0] === "snippets" && a.length === 2 && l === "css"
                        ? (c = "appearance-data")
                        : a.length === 1 && l === "json"
                          ? (c = "core-plugin-data")
                          : a[0] === "plugins" && a.length === 3 && h7(s) && (c = "community-plugin-data")
                      : (c = "appearance-data"),
          c && this.allowSpecialFiles.has(c))
        );
      }
      if (e.startsWith(".")) return !1;
      if (t) return !0;
      if (e.startsWith(".")) return !1;
      var u = getExtension(getFilename(e));
      if (u === "md" || u === "canvas" || u === "base") return !0;
      var h = this.allowTypes;
      return IMAGE_EXTENSIONS.contains(u)
        ? h.has("image")
        : u === "webm"
          ? h.has("audio") || h.has("video")
          : AUDIO_EXTENSIONS.contains(u)
            ? h.has("audio")
            : VIDEO_EXTENSIONS.contains(u)
              ? h.has("video")
              : PDF_EXTENSIONS.contains(u)
                ? h.has("pdf")
                : !!h.has("unsupported");
    };
    t.prototype.canSyncPath = function (e, t) {
      var n = this.fileRetry;
      for (var i in n) if (n.hasOwnProperty(i) && n[i].ts > e && t.startsWith(i)) return !1;
      return !0;
    };
    t.prototype.canSyncLocalFile = function (e, t) {
      if (!t.synctime) return !0;
      var n = t.size,
        i = n > 10240 ? (n > 102400 ? 30 : 20) : 10;
      return e - t.synctime > 1e3 * i;
    };
    t.prototype.getHost = function () {
      var e = this.host || "127.0.0.1:3003";
      return e.startsWith("127.0.0.1") || e.startsWith("localhost") ? "ws://" + e : "wss://" + e;
    };
    t.prototype.setStatus = function (syncStatus) {
      this.syncStatus = syncStatus;
      this.trigger("status-change");
    };
    t.prototype.getStatus = function () {
      return this.initialized
        ? this.vaultId
          ? this.error || Object.keys(this.fileRetry).length > 0
            ? "error"
            : this.pause
              ? "paused"
              : this.syncing
                ? "syncing"
                : "synced"
          : "disconnected"
        : "uninitialized";
    };
    t.prototype.failedSync = function (error) {
      var t = this.syncingPath;
      if ((this.log(error, t, !0), t)) {
        var n = this.fileRetry,
          i = Date.now(),
          r = n[t];
        r ||
          (r = n[t] =
            {
              count: 0,
              error: "",
              ts: 0,
            });
        r.error = error;
        var o = (r.count = r.count + 1),
          a = 5 * Math.pow(2, o) * 1e3;
        a = Math.min(a, 3e5);
        r.ts = i + a;
      }
    };
    t.prototype.requestSync = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return this.syncing
                ? [2]
                : ((this.syncing = true), (this.error = false), this.trigger("status-change"), [4, sleep(50)]);
            case 1:
              a.sent();
              e = null;
              t = true;
              a.label = 2;
            case 2:
              if (!t || !this.plugin.enabled || this.pause || !this.vaultId) return [3, 8];
              !e && isNotWeb && this.preventSleep && (e = requestKeepAwake());
              a.label = 3;
            case 3:
              a.trys.push([3, 5, , 6]);
              this.error = false;
              this.syncingPath = null;
              return [4, this._sync()];
            case 4:
              t = a.sent();
              (n = this.syncingPath) && delete this.fileRetry[n];
              return [3, 6];
            case 5:
              i = a.sent();
              console.log("Sync Error!");
              console.error(i);
              this.error = true;
              this.failedSync(i.message);
              t = false;
              this.trigger("status-change");
              return [3, 6];
            case 6:
              this.dirty && this.requestSaveData();
              r = 0;
              this.server && ((o = Date.now() - this.server.lastNetworkRequestTs), (r = Math.max(0, 50 - o)));
              return [4, sleep(r)];
            case 7:
              a.sent();
              return [3, 2];
            case 8:
              e && e.release();
              this.syncing = false;
              this.trigger("status-change");
              return [2];
          }
        });
      });
    };
    t.prototype.getServer = function () {
      var e = this,
        t = this.gettingServer;
      if (!t) {
        this.gettingServer = t = this.asyncGetServer();
        var n = function () {
          e.gettingServer = null;
        };
        t.then(n, n);
      }
      return t;
    };
    t.prototype.asyncGetServer = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n,
          i,
          r,
          o = this;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              if (
                (!(e = this.server) ||
                  e.isConnected() ||
                  e.isConnecting() ||
                  (e.disconnect(), (e = this.server = null), this.backoff.fail()),
                e)
              )
                return [3, 5];
              if (this.encryptionProvider || !this.key) return [3, 4];
              a.label = 1;
            case 1:
              a.trys.push([1, 3, , 4]);
              t = this;
              return [4, LQ(this.encryptionVersion, this.key, this.salt)];
            case 2:
              t.encryptionProvider = a.sent();
              return [3, 4];
            case 3:
              n = a.sent();
              console.error(n);
              this.log("Unable to decrypt vault", null, !0);
              this.error = true;
              this.backoff.fail();
              return [2, null];
            case 4:
              if (!(this.host && c$.token && this.vaultId && this.encryptionProvider)) return [2, null];
              e = this.server = new d7(this.encryptionProvider);
              a.label = 5;
            case 5:
              if (e.hasConnection()) return [3, 12];
              this.setStatus("Connecting to server");
              this.log("Connecting to server");
              this.ready = false;
              a.label = 6;
            case 6:
              a.trys.push([6, 8, , 12]);
              i = this.deviceName || this.getDefaultDeviceName();
              return [
                4,
                e.connect(
                  this.getHost(),
                  c$.token,
                  this.vaultId,
                  this.version,
                  this.initial,
                  i,
                  function (version) {
                    o.log("Connection successful. Detecting changes...");
                    o.ready = true;
                    o.initial && (o.initial = false);
                    o.version < version && (o.version = version);
                    o.dirty = true;
                    o.requestSaveData();
                    o.requestSync();
                  },
                  this.onPushedFile.bind(this),
                ),
              ];
            case 7:
              a.sent();
              this.backoff.success();
              return [3, 12];
            case 8:
              return (r = a.sent()).message && r.message.contains("Your subscription to Obsidian Sync has expired")
                ? (new Notice(r.message), [3, 11])
                : [3, 9];
            case 9:
              return r.message && r.message.contains("Vault not found")
                ? (new Notice(t7.msgDisconnectFromDeletedVault()), [4, this.unsetup()])
                : [3, 11];
            case 10:
              a.sent();
              a.label = 11;
            case 11:
              console.error(r);
              this.log(r.message, null, !0);
              e.disconnect();
              e = this.server = null;
              this.error = true;
              this.backoff.fail();
              return [2, null];
            case 12:
              this.userId = e.userId;
              return [2, e];
          }
        });
      });
    };
    t.prototype._sync = function () {
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
          d,
          f,
          m,
          g,
          v,
          y,
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
          size,
          R,
          B,
          V,
          H,
          z,
          q,
          W,
          U,
          _,
          j,
          path,
          K,
          ctime,
          mtime,
          X,
          synchash,
          $,
          J = this;
        return __generator(this, function (ee) {
          switch (ee.label) {
            case 0:
              if (this.pause) return [2, !1];
              if (!this.backoff.isReady()) {
                this.log("Waiting to connect to server");
                return [2, !1];
              }
              if (!c$.token) throw new Error("Not logged in");
              return [4, this.getServer()];
            case 1:
              if (!(e = ee.sent())) return [2, !1];
              if (this.pause || !this.vaultId) return [2, !1];
              t = this.localFiles;
              n = this.serverFiles;
              i = this.newServerFiles;
              r = this.vault;
              o = r.adapter;
              a = Date.now();
              s = 0;
              this.setStatus("Indexing...");
              l = r.configDir;
              c = l + "/";
              ee.label = 2;
            case 2:
              if ((ee.trys.push([2, 24, , 25]), (u = {}), (h = this.scanSpecialFileQueue), !this.scanSpecialFiles))
                return [3, 20];
              for (path in ((this.scanSpecialFiles = false),
              this.setStatus("Initializing..."),
              (h = this.scanSpecialFileQueue = []),
              t))
                if (t.hasOwnProperty(path) && path.startsWith(".")) {
                  u[path] = t[path];
                  delete t[path];
                }
              return [4, o.exists(l)];
            case 3:
              return ee.sent() ? (h.push(c + "config"), [4, o.list(l)]) : [3, 20];
            case 4:
              for (p = ee.sent(), d = 0, f = p.files; d < f.length; d++)
                if (getExtension((I = f[d])) === "json") {
                  h.push(I);
                }
              return [4, o.exists(c + "themes")];
            case 5:
              return ee.sent() ? [4, o.list(c + "themes")] : [3, 10];
            case 6:
              m = ee.sent();
              g = 0;
              v = m.folders;
              ee.label = 7;
            case 7:
              return g < v.length ? ((D = v[g]), [4, o.list(D)]) : [3, 10];
            case 8:
              for (y = ee.sent(), w = 0, k = y.files; w < k.length; w++) {
                I = k[w];
                ((O = getFilename(I)) !== "manifest.json" && O !== "theme.css") || h.push(I);
              }
              ee.label = 9;
            case 9:
              g++;
              return [3, 7];
            case 10:
              return [4, o.exists(c + "snippets")];
            case 11:
              return ee.sent() ? [4, o.list(c + "snippets")] : [3, 13];
            case 12:
              for (C = ee.sent(), E = 0, S = C.files; E < S.length; E++)
                if (getExtension((I = S[E])) === "css") {
                  h.push(I);
                }
              ee.label = 13;
            case 13:
              return [4, o.exists(c + "plugins")];
            case 14:
              return ee.sent() ? [4, o.list(c + "plugins")] : [3, 19];
            case 15:
              M = ee.sent();
              x = 0;
              T = M.folders;
              ee.label = 16;
            case 16:
              return x < T.length ? ((D = T[x]), [4, o.list(D)]) : [3, 19];
            case 17:
              for (A = ee.sent(), P = 0, L = A.files; P < L.length; P++) {
                I = L[P];
                h7((O = getFilename(I))) && h.push(I);
              }
              ee.label = 18;
            case 18:
              x++;
              return [3, 16];
            case 19:
              this.forceSaveData();
              ee.label = 20;
            case 20:
              return h.length > 0 ? ((path = h.pop()), [4, o.exists(path)]) : [3, 23];
            case 21:
              return ee.sent() ? [4, o.stat(path)] : (delete t[path], [3, 20]);
            case 22:
              return (F = ee.sent()) && F.type === "file"
                ? ((j = t[path]) ||
                    (j = u.hasOwnProperty(path)
                      ? (t[path] = u[path])
                      : (t[path] = {
                          path: path,
                          previouspath: "",
                          ctime: 0,
                          mtime: 0,
                          size: 0,
                          folder: false,
                          hash: "",
                          synchash: "",
                          synctime: 0,
                        })),
                  (mtime = Math.ceil(F.mtime)),
                  (ctime = Math.ceil(F.ctime)),
                  (size = F.size),
                  (j.mtime && j.mtime === mtime && j.size === F.size) || (j.hash = ""),
                  (j.mtime = mtime),
                  (j.ctime = ctime),
                  (j.size = size),
                  [3, 20])
                : (delete t[path], [3, 20]);
            case 23:
              return [3, 25];
            case 24:
              R = ee.sent();
              console.error("Failed to scan config files", R);
              return [3, 25];
            case 25:
              if (!(i.length > 0)) return [3, 29];
              B = function (l) {
                var u,
                  syncingPath,
                  p,
                  d,
                  f,
                  m,
                  g,
                  v,
                  y,
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
                  R,
                  B,
                  H,
                  z,
                  q,
                  W,
                  U,
                  _,
                  j,
                  G,
                  K;
                return __generator(this, function (b) {
                  switch (b.label) {
                    case 0:
                      if (
                        ((u = i[l]),
                        (syncingPath = u.path),
                        (p = n[syncingPath]),
                        (d = t[syncingPath]),
                        (f = function (e, t) {
                          e || J.log("Accepted", syncingPath);
                          d && (d.synctime = Date.now());
                          t || (n[syncingPath] = u);
                          i.splice(l, 1);
                          J.setDirty();
                          return !0;
                        }),
                        !V.allowSyncFile(syncingPath, u.folder))
                      )
                        return [
                          2,
                          {
                            value: f(!0),
                          },
                        ];
                      if (!$b(syncingPath) || (Platform.isAndroidApp && /[*?<>"]/.test(syncingPath))) {
                        V.log("Ignoring remote file name with illegal characters", syncingPath, !0);
                        new Notice('Sync: Unable to download file with illegal name "'.concat(syncingPath, '"'));
                        return [
                          2,
                          {
                            value: f(!0, !0),
                          },
                        ];
                      }
                      if (normalizePath(syncingPath).split("/").contains(".."))
                        return [
                          2,
                          {
                            value: f(!0),
                          },
                        ];
                      if (!V.canSyncPath(a, syncingPath)) {
                        s++;
                        return [2, "continue"];
                      }
                      for (V.syncingPath = syncingPath, m = l + 1; m < i.length; m++)
                        if (i[m].path === syncingPath) {
                          V.log("Skipped", syncingPath);
                          return [
                            2,
                            {
                              value: f(!0, !0),
                            },
                          ];
                        }
                      if (d) return [3, 8];
                      if (u.deleted)
                        return [
                          2,
                          {
                            value: f(!0),
                          },
                        ];
                      if ((V.setStatus("Downloading " + syncingPath), !Platform.isAndroidApp)) return [3, 5];
                      b.label = 1;
                    case 1:
                      b.trys.push([1, 3, , 4]);
                      return [4, V.syncFileDown(e, u)];
                    case 2:
                      b.sent();
                      return [3, 4];
                    case 3:
                      if ((g = b.sent()) && typeof g.message == "string" && g.message.contains("FILE_NOTCREATED")) {
                        V.log("Ignoring remote file name with illegal characters", syncingPath, !0);
                        new Notice('Sync: Unable to download file with illegal name "'.concat(syncingPath, '"'));
                        return [
                          2,
                          {
                            value: f(!0, !0),
                          },
                        ];
                      }
                      throw g;
                    case 4:
                      return [3, 7];
                    case 5:
                      return [4, V.syncFileDown(e, u)];
                    case 6:
                      b.sent();
                      b.label = 7;
                    case 7:
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 8:
                      return d.folder || d.hash
                        ? [3, 10]
                        : (V.getHashFromMetadataCache(d),
                          d.hash ? [3, 10] : (V.setStatus("Computing hash " + syncingPath), [4, V.updateHash(d)]));
                    case 9:
                      b.sent();
                      b.label = 10;
                    case 10:
                      if (!d.folder || !u.folder) return [3, 15];
                      if (!u.deleted) return [3, 14];
                      if (!(E = r.getAbstractFileByPath(syncingPath))) return [3, 14];
                      if (E instanceof TFolder && E.children.length > 0)
                        return [
                          2,
                          {
                            value: f(!0),
                          },
                        ];
                      V.setStatus("Deleting " + syncingPath);
                      V.log("Deleting", syncingPath);
                      b.label = 11;
                    case 11:
                      b.trys.push([11, 13, , 14]);
                      return [4, r.delete(E, !0)];
                    case 12:
                      b.sent();
                      return [3, 14];
                    case 13:
                      v = b.sent();
                      y = (v ? v.message : "") || "Failed to delete folder";
                      V.log(y, syncingPath, !0);
                      return [3, 14];
                    case 14:
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                    case 15:
                      return d.folder || u.folder || d.hash !== u.hash
                        ? p && ((d.folder && p.folder) || d.hash === p.hash)
                          ? u.deleted
                            ? (V.setStatus("Deleting " + syncingPath),
                              (E = r.getAbstractFileByPath(syncingPath))
                                ? (V.log("Deleting", syncingPath), [4, r.delete(E)])
                                : [3, 17])
                            : [3, 20]
                          : [3, 22]
                        : [
                            2,
                            {
                              value: f(!0),
                            },
                          ];
                    case 16:
                      b.sent();
                      return [3, 19];
                    case 17:
                      V.log("Deleting", syncingPath);
                      return [4, o.remove(syncingPath)];
                    case 18:
                      b.sent();
                      b.label = 19;
                    case 19:
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 20:
                      V.setStatus("Downloading " + syncingPath);
                      return [4, V.syncFileDown(e, u)];
                    case 21:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 22:
                      return d.folder || !u.folder
                        ? [3, 24]
                        : (E = r.getAbstractFileByPath(syncingPath)) instanceof TFile
                          ? ((w = E.extension),
                            (k = w ? syncingPath.substr(syncingPath.length - w.length - 1) : ""),
                            (C = syncingPath.substr(0, syncingPath.length - k.length)),
                            (F = C + " (Conflicted copy)" + k),
                            V.setStatus("Renaming conflicted file " + syncingPath),
                            V.log("Renaming conflicted file", syncingPath),
                            [4, r.rename(E, F)])
                          : [3, 24];
                    case 23:
                      b.sent();
                      V.setDirty();
                      return [
                        2,
                        {
                          value: !0,
                        },
                      ];
                    case 24:
                      return u.initial && u.mtime > d.mtime
                        ? (V.setStatus("Downloading " + syncingPath), [4, V.syncFileDown(e, u)])
                        : [3, 26];
                    case 25:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 26:
                      if (
                        u.initial ||
                        d.folder ||
                        u.folder ||
                        u.deleted ||
                        getExtension(syncingPath) !== "md" ||
                        u.hash === d.synchash
                      )
                        return [3, 53];
                      if (
                        (V.setStatus("Merging " + syncingPath),
                        V.logMerge("Merging conflicted file", syncingPath),
                        !((E = r.getAbstractFileByPath(syncingPath)) instanceof TFile))
                      ) {
                        V.logMerge("Merge failed.", syncingPath, !0);
                        return [
                          2,
                          {
                            value: f(!0),
                          },
                        ];
                      }
                      S = undefined;
                      b.label = 27;
                    case 27:
                      b.trys.push([27, 29, , 30]);
                      return [4, r.read(E)];
                    case 28:
                      S = b.sent();
                      return [3, 30];
                    case 29:
                      M = b.sent();
                      V.logMerge("Merge failed. " + M.toString(), syncingPath, !0);
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                    case 30:
                      return S ? [3, 32] : [4, V.syncFileDown(e, u)];
                    case 31:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 32:
                      if (((x = ""), !p || p.deleted)) return [3, 36];
                      b.label = 33;
                    case 33:
                      b.trys.push([33, 35, , 36]);
                      T = ff;
                      return [4, e.pull(p.uid)];
                    case 34:
                      x = T.apply(undefined, [b.sent()]);
                      return [3, 36];
                    case 35:
                      D = b.sent();
                      V.logMerge("Merge failed. " + D.toString(), syncingPath, !0);
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                    case 36:
                      A = undefined;
                      b.label = 37;
                    case 37:
                      b.trys.push([37, 39, , 40]);
                      P = ff;
                      return [4, e.pull(u.uid)];
                    case 38:
                      A = P.apply(undefined, [b.sent()]);
                      return [3, 40];
                    case 39:
                      L = b.sent();
                      V.logMerge("Merge failed. " + L.toString(), syncingPath, !0);
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                    case 40:
                      if (x === A || S === A)
                        return [
                          2,
                          {
                            value: f(),
                          },
                        ];
                      if (!A)
                        return [
                          2,
                          {
                            value: f(),
                          },
                        ];
                      if (V.conflictAction !== "conflict") return [3, 46];
                      I = window.moment().format("YYYYMMDDHHmm");
                      O = (function (e, t) {
                        if (undefined === t) {
                          t = "_";
                        }
                        var n = e.trim();
                        if (n && ((n = e.replace(Zb, t)), t.length === 1)) {
                          var i = Jl(t),
                            r = new RegExp("".concat(i, "{2,}"), "g");
                          n = n.replace(r, t);
                        }
                        return n;
                      })(V.deviceName || V.getDefaultDeviceName());
                      F = V.vault.getAvailablePath(
                        "".concat($c(syncingPath), " (Conflicted copy ").concat(O, " ").concat(I, ")"),
                        getExtension(syncingPath),
                      );
                      b.label = 41;
                    case 41:
                      b.trys.push([41, 44, , 45]);
                      return [
                        4,
                        r.create(F, S, {
                          ctime: E.stat.ctime,
                          mtime: E.stat.mtime,
                        }),
                      ];
                    case 42:
                      b.sent();
                      return [
                        4,
                        r.modify(E, A, {
                          ctime: u.ctime,
                          mtime: u.mtime,
                        }),
                      ];
                    case 43:
                      b.sent();
                      V.logMerge("Conflicted copy stored", syncingPath);
                      return [3, 45];
                    case 44:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 45:
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 46:
                      return x
                        ? [3, 51]
                        : Math.abs(Date.now() - d.ctime) < 18e4
                          ? (V.app.fileManager.storeTextFileBackup(syncingPath, S),
                            V.setStatus("Downloading " + syncingPath),
                            [
                              4,
                              r.modify(E, A, {
                                ctime: u.ctime,
                                mtime: u.mtime,
                              }),
                            ])
                          : [3, 48];
                    case 47:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 48:
                      return u.mtime > d.mtime
                        ? (V.app.fileManager.storeTextFileBackup(syncingPath, S),
                          V.setStatus("Downloading " + syncingPath),
                          [
                            4,
                            r.modify(E, A, {
                              ctime: u.ctime,
                              mtime: u.mtime,
                            }),
                          ])
                        : [3, 50];
                    case 49:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 50:
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 51:
                      V.app.fileManager.storeTextFileBackup(syncingPath, S);
                      N = Kj(x, S, A);
                      return [4, r.modify(E, N)];
                    case 52:
                      b.sent();
                      V.logMerge("Merge successful", syncingPath);
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 53:
                      if (u.folder || u.deleted || !(u.size > 0) || !syncingPath.startsWith(c)) return [3, 62];
                      if (getExtension(syncingPath) !== "json") return [3, 60];
                      b.label = 54;
                    case 54:
                      b.trys.push([54, 59, , 60]);
                      V.setStatus("Merging " + syncingPath);
                      V.log("Merging conflicted file", syncingPath);
                      H = (B = JSON).parse;
                      return [4, o.read(syncingPath)];
                    case 55:
                      return !(R = H.apply(B, [b.sent()])) || Array.isArray(R) || typeof R != "object"
                        ? [3, 58]
                        : ((W = (q = JSON).parse), (U = ff), [4, e.pull(u.uid)]);
                    case 56:
                      if (
                        !(z = W.apply(q, [U.apply(undefined, [b.sent()])])) ||
                        Array.isArray(z) ||
                        typeof z != "object"
                      )
                        return [3, 58];
                      for (_ in z)
                        if (z.hasOwnProperty(_)) {
                          R[_] = z[_];
                        }
                      j = df(JSON.stringify(R, undefined, 2));
                      syncingPath === V.vault.configDir + "/core-plugins.json" &&
                        (G = V.patchCorePluginsFile(j)) !== j &&
                        ((j = G), V.log("Fixing core plugins list", syncingPath));
                      return [4, o.writeBinary(syncingPath, j)];
                    case 57:
                      b.sent();
                      V.log("Merge successful", syncingPath);
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                    case 58:
                      return [3, 60];
                    case 59:
                      K = b.sent();
                      V.log("Merge failed. " + K.toString(), syncingPath, !0);
                      return [3, 60];
                    case 60:
                      return [4, V.syncFileDown(e, u)];
                    case 61:
                      b.sent();
                      return [
                        2,
                        {
                          value: f(),
                        },
                      ];
                    case 62:
                      V.log("Rejected server change", syncingPath);
                      return [
                        2,
                        {
                          value: f(!0),
                        },
                      ];
                  }
                });
              };
              V = this;
              H = 0;
              ee.label = 26;
            case 26:
              return H < i.length ? [5, B(H)] : [3, 29];
            case 27:
              if (typeof (z = ee.sent()) == "object") return [2, z.value];
              ee.label = 28;
            case 28:
              H++;
              return [3, 26];
            case 29:
              if (!this.ready) return [2, !1];
              for (path in ((q = null), (W = null), n))
                if (n.hasOwnProperty(path) && ((K = n[path]), !t.hasOwnProperty(path))) {
                  if (K.deleted) {
                    delete n[path];
                    continue;
                  }
                  if (!this.allowSyncFile(path, K.folder)) continue;
                  K.folder
                    ? (!W || K.path.length > W.path.length) && (W = K)
                    : (!q || K.path.length > q.path.length) && (q = K);
                }
              return q
                ? ((path = q.path),
                  this.setStatus("Deleting remote file " + path),
                  this.log("Deleting remote file", path),
                  (this.syncingPath = path),
                  [4, e.push(path, null, !1, !0, 0, 0, "", null)])
                : [3, 31];
            case 30:
              ee.sent();
              q.deleted = true;
              this.setDirty();
              return [2, !0];
            case 31:
              return W
                ? ((path = W.path),
                  this.setStatus("Deleting remote folder " + path),
                  this.log("Deleting remote folder", path),
                  (this.syncingPath = path),
                  [4, e.push(path, null, !0, !0, 0, 0, "", null)])
                : [3, 33];
            case 32:
              ee.sent();
              W.deleted = true;
              this.setDirty();
              return [2, !0];
            case 33:
              for (path in ((U = null), (_ = null), t))
                if (
                  t.hasOwnProperty(path) &&
                  ((j = t[path]),
                  (!(K = n[path]) ||
                    K.deleted ||
                    j.folder !== K.folder ||
                    j.ctime !== K.ctime ||
                    j.mtime !== K.mtime ||
                    j.size !== K.size ||
                    !j.hash ||
                    j.hash !== K.hash) &&
                    this.allowSyncFile(path, j.folder))
                )
                  if (this.canSyncPath(a, path)) {
                    if (
                      (c7 &&
                        !j.folder &&
                        K &&
                        K.ctime &&
                        (j.ctime === 0 || j.ctime > K.ctime) &&
                        !K.folder &&
                        !K.deleted &&
                        (j.ctime = K.ctime),
                      j.folder || !(j.size > e.perFileMax))
                    )
                      if (K && !K.deleted) {
                        if (!U)
                          if (j.folder) {
                            if (!this.canSyncLocalFile(a, j)) {
                              s++;
                              continue;
                            }
                            if (!K.folder) {
                              (!U || j.path.length < U.path.length) && (U = j);
                            }
                          } else if (K.folder) {
                            if (!this.canSyncLocalFile(a, j)) {
                              s++;
                              continue;
                            }
                            W = K;
                          } else if ((j.hash || this.getHashFromMetadataCache(j), !j.hash || j.hash !== K.hash)) {
                            if (!this.canSyncLocalFile(a, j)) {
                              s++;
                              continue;
                            }
                            if (!_ || j.size < _.size) {
                              _ = j;
                            }
                          }
                      } else {
                        if (!this.canSyncLocalFile(a, j)) {
                          s++;
                          continue;
                        }
                        j.folder
                          ? (!U || j.path.length < U.path.length) && (U = j)
                          : (!_ || j.size < _.size) && (_ = j);
                      }
                  } else s++;
              return U
                ? ((path = U.path),
                  (this.syncingPath = path),
                  this.setStatus("Uploading " + path),
                  this.log("Uploading", path),
                  [4, e.push(path, U.previouspath, !0, !1, 0, 0, "", null)])
                : [3, 35];
            case 34:
              ee.sent();
              n.hasOwnProperty(path)
                ? n[path].deleted && (n[path].deleted = false)
                : (n[path] = {
                    uid: 0,
                    path: path,
                    size: 0,
                    hash: "",
                    ctime: 0,
                    mtime: 0,
                    folder: true,
                    deleted: false,
                    device: this.deviceName,
                  });
              U.previouspath = "";
              U.synctime = Date.now();
              this.setDirty();
              return [2, !0];
            case 35:
              return _
                ? ((path = _.path),
                  (this.syncingPath = path),
                  this.setStatus("Uploading " + path),
                  (K = n[path]),
                  !_.hash && (this.getHashFromMetadataCache(_), _.hash && K && !K.deleted && K.hash === _.hash)
                    ? (this.setStatus("Comparing " + path), this.setDirty(), [2, !0])
                    : ((ctime = _.ctime), (mtime = _.mtime), [4, o.readBinary(path)]))
                : [3, 39];
            case 36:
              X = ee.sent();
              $ = _;
              return [4, computeSha256Hex(X)];
            case 37:
              synchash = $.hash = ee.sent();
              return K && !K.deleted && K.hash === _.hash
                ? (this.setStatus("Comparing " + path), this.setDirty(), [2, !0])
                : (this.log("Uploading file", path),
                  [4, e.push(path, _.previouspath, !1, !1, ctime, mtime, synchash, X)]);
            case 38:
              ee.sent();
              _.synchash = synchash;
              this.log("Upload complete", path);
              _.previouspath = "";
              _.synctime = Date.now();
              this.setDirty();
              return [2, !0];
            case 39:
              return s === 0
                ? (this.log("Fully synced"), this.setStatus("Fully synced"), (this.fileRetry = {}), [2, !1])
                : (this.setStatus("Indexing..."), [2, !0]);
          }
        });
      });
    };
    t.prototype.setDirty = function () {
      this.dirty = true;
      this.trigger("status-change");
    };
    t.prototype.forceSaveData = function () {
      this.setDirty();
      this.requestSaveData();
    };
    t.prototype.getHashFromMetadataCache = function (e) {
      var t = this.app.metadataCache.getFileInfo(e.path);
      if (t && Math.ceil(t.mtime) === e.mtime && t.size === e.size) {
        e.hash = t.hash;
      }
    };
    t.prototype.syncFileDown = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, c, u, h, hash, d, ctime, m, g, v, y;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              n = t.path;
              return [4, (i = this.vault.adapter).stat(n)];
            case 1:
              if (((r = b.sent()), !t.folder)) return [3, 8];
              if (!r || r.type !== "folder") return [3, 4];
              if ((o = this.localFiles)[n]) return [3, 3];
              for (l in ((a = n.toLowerCase()), (s = ""), o))
                if (o.hasOwnProperty(l) && l.toLowerCase() === a) {
                  s = l;
                  break;
                }
              return s
                ? (this.log("Detected case sensitive folder collision, renaming folder", n),
                  [4, i.rename(s, normalizePath(n))])
                : [3, 3];
            case 2:
              b.sent();
              b.label = 3;
            case 3:
              return [2];
            case 4:
              return r && r.type === "file" ? (this.log("Deleting local file", n), [4, i.remove(n)]) : [3, 6];
            case 5:
              b.sent();
              b.label = 6;
            case 6:
              this.log("Creating local folder", n);
              return [4, i.mkdir(n)];
            case 7:
              b.sent();
              return [2];
            case 8:
              return r && r.type === "folder" ? [4, i.list(n)] : [3, 13];
            case 9:
              return (c = b.sent()).files.length !== 0 || c.folders.length !== 0
                ? [3, 11]
                : (this.log("Deleting local folder", n), [4, i.rmdir(n, !0)]);
            case 10:
              b.sent();
              return [2];
            case 11:
              this.log("Renaming conflicted file", n);
              return [4, i.rename(n, n + " (Conflicted copy)")];
            case 12:
              b.sent();
              return [2];
            case 13:
              this.log("Downloading file", n);
              return [4, e.pull(t.uid)];
            case 14:
              if (!(u = b.sent())) throw new Error("Failed to download file, no data.");
              if (n === this.vault.configDir + "/core-plugins.json")
                try {
                  if ((h = this.patchCorePluginsFile(u)) !== u) {
                    u = h;
                    this.log("Fixing core plugins list", n);
                  }
                } catch (e) {
                  this.log("File is corrupt, ignoring", n);
                  return [2];
                }
              return [4, computeSha256Hex(u)];
            case 15:
              hash = b.sent();
              return [4, hx(i.promise)];
            case 16:
              b.sent();
              return [4, i.stat(n)];
            case 17:
              if ((d = b.sent()) && (!r || d.mtime !== r.mtime || d.size !== r.size))
                throw new Error("Download cancelled because file was changed locally. Will try again soon.");
              return r
                ? ((ctime = undefined),
                  t.ctime && (r.ctime === 0 || t.ctime < r.ctime) && (ctime = t.ctime),
                  (m = this.vault.getAbstractFileByPath(n)) instanceof TFile
                    ? m.saving
                      ? [4, hx(i.promise)]
                      : [3, 19]
                    : [3, 21])
                : [3, 24];
            case 18:
              b.sent();
              b.label = 19;
            case 19:
              return [
                4,
                this.vault.modifyBinary(m, u, {
                  ctime: ctime,
                  mtime: t.mtime,
                }),
              ];
            case 20:
              b.sent();
              return [3, 23];
            case 21:
              return [
                4,
                i.writeBinary(n, u, {
                  ctime: ctime,
                  mtime: t.mtime,
                }),
              ];
            case 22:
              b.sent();
              b.label = 23;
            case 23:
              return [3, 30];
            case 24:
              g = Zc(n);
              return (v = g !== "/" && g !== "") ? [4, i.exists(g)] : [3, 26];
            case 25:
              v = !b.sent();
              b.label = 26;
            case 26:
              return v ? [4, i.mkdir(g)] : [3, 28];
            case 27:
              b.sent();
              b.label = 28;
            case 28:
              return [
                4,
                i.writeBinary(n, u, {
                  ctime: t.ctime,
                  mtime: t.mtime,
                }),
              ];
            case 29:
              b.sent();
              b.label = 30;
            case 30:
              (y = this.localFiles[n]) && ((y.hash = hash), (y.synchash = hash));
              this.log("Downloading complete", n);
              b.label = 31;
            case 31:
              return [2];
          }
        });
      });
    };
    t.prototype.patchCorePluginsFile = function (e) {
      var t = JSON.parse(ff(e)),
        n = false;
      Array.isArray(t)
        ? t.contains("sync") || (t.push("sync"), (n = true))
        : typeof t == "object" && !0 !== t.sync && ((t.sync = true), (n = true));
      n && (e = df(JSON.stringify(t, null, 2)));
      return e;
    };
    t.prototype.updateHash = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return e.folder || e.hash ? [2, null] : [4, this.vault.adapter.readBinary(e.path)];
            case 1:
              t = i.sent();
              n = e;
              return [4, computeSha256Hex(t)];
            case 2:
              n.hash = i.sent();
              return [2, t];
          }
        });
      });
    };
    t.prototype._updateStatusBar = function () {
      var e = this.getStatus(),
        t = this.statusIconEl;
      if (t) {
        setTooltip(this.plugin.statusBarEl, this.syncStatus, {
          placement: "top",
        });
        t.removeClass("mod-success", "mod-working", "mod-error", "mod-spin");
        e === "uninitialized"
          ? (setIcon(t, "sync-small"), t.addClass("mod-working"))
          : e === "disconnected"
            ? (setIcon(t, "refresh-cw-off"), t.addClass("mod-error"))
            : e === "paused"
              ? (setIcon(t, "paused"), t.addClass("mod-working"))
              : e === "syncing" || this.syncStatus === "Connecting to server"
                ? (setIcon(t, "sync-small"), t.addClass("mod-working", "mod-spin"))
                : e === "synced"
                  ? (setIcon(t, "check-small"), t.addClass("mod-success"))
                  : e === "error" && (setIcon(t, "sync-small"), t.addClass("mod-error"));
      }
    };
    t.prototype.showVersionHistory = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          new F8(this.app, this, e).open();
          return [2];
        });
      });
    };
    t.prototype.getHistory = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return [4, n.sent().listHistory(e, t)];
            case 2:
              return [2, n.sent()];
          }
        });
      });
    };
    t.prototype.getContentForVersion = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return [2, t.sent().pull(e)];
          }
        });
      });
    };
    t.prototype.restoreVersion = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              n = o.sent();
              return t ? [3, 3] : [4, n.restore(e)];
            case 2:
              o.sent();
              return [2];
            case 3:
              r = ff;
              return [4, n.pull(e)];
            case 4:
              i = r.apply(undefined, [o.sent()]);
              return [2, this.vault.adapter.write(t, i)];
          }
        });
      });
    };
    t.prototype.showDeletedFiles = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return [4, n.sent().listDeleted()];
            case 2:
              (t = n.sent()).reverse();
              e ? new B8(this.app, this, t).open() : new R8(this.app, this, t7.labelDeletedFiles(), t).open();
              return [2];
          }
        });
      });
    };
    t.prototype.showConfigFiles = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r;
        return __generator(this, function (o) {
          for (i in ((e = []), (t = this.serverFiles), (n = this.app.vault.configDir + "/"), t))
            if (t.hasOwnProperty(i) && !(r = t[i]).folder && r.path.startsWith(n)) {
              e.push({
                uid: r.uid,
                ts: r.mtime,
                folder: r.folder,
                path: r.path,
                relatedpath: "",
                size: r.size,
                deleted: r.deleted,
                device: r.device,
              });
            }
          e.sort(function (e, t) {
            return t.ts - e.ts;
          });
          new R8(this.app, this, t7.labelSettingFiles(), e).open();
          return [2];
        });
      });
    };
    t.prototype.getUsernames = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return [2, e.sent().getUsernames()];
          }
        });
      });
    };
    t.prototype.purge = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return [4, e.sent().purge()];
            case 2:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.size = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.getServer()];
            case 1:
              return (e = t.sent())
                ? [4, e.size()]
                : [
                    2,
                    {
                      size: -1,
                      limit: -1,
                      vault_size: -1,
                    },
                  ];
            case 2:
              return [2, t.sent()];
          }
        });
      });
    };
    t.prototype.openSettings = function () {
      var e = this.app.setting;
      e.open();
      e.activeTab !== this.settingTab && e.openTabById(this.id);
    };
    t.prototype.showSyncLog = function () {
      this.vaultId ? new W8(this.app, this).open() : this.openSettings();
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
  d7 = (function () {
    function e(encryptionProvider) {
      this.socket = null;
      this.queue = new ix();
      this.notifyQueue = new ix();
      this.perFileMax = 208666624;
      this.userId = -1;
      this.justPushed = null;
      this.encryptionProvider = encryptionProvider;
    }
    e.prototype.isConnecting = function () {
      var e = this.socket;
      return e && e.readyState === r7.CONNECTING;
    };
    e.prototype.isConnected = function () {
      var e = this.socket;
      return e && e.readyState === r7.OPEN;
    };
    e.prototype.hasConnection = function () {
      return !!this.socket;
    };
    e.prototype.connect = function (e, token, n, version, initial, device, onReady, onPush) {
      return __awaiter(this, undefined, Promise, function () {
        var keyhash,
          c = this;
        return __generator(this, function (u) {
          return this.hasConnection()
            ? [2]
            : ((this.onReady = onReady),
              (this.onPush = onPush),
              (keyhash = this.encryptionProvider.keyHash),
              [
                2,
                new Promise(function (a, s) {
                  var u = new o7(e),
                    h = a7.call(u);
                  if (!s7.call(h, ".obsidian.md") && h !== "127.0.0.1")
                    return s(new Error("Unable to connect to server."));
                  var p = false,
                    d = function (e) {
                      if (!p) {
                        p = true;
                        c.disconnect();
                        s(e);
                      }
                    },
                    f = (c.socket = new r7(u));
                  f.binaryType = "arraybuffer";
                  f.onclose = function (e) {
                    e.code === 1006
                      ? d(new Error("Unable to connect to server."))
                      : d(
                          new Error(
                            "Disconnected. Code: " +
                              e.code +
                              " " +
                              (function (e) {
                                if (e >= 0 && e <= 999) return "(Unused)";
                                if (e >= 1016) {
                                  if (e <= 1999) return "(For WebSocket standard)";
                                  if (e <= 2999) return "(For WebSocket extensions)";
                                  if (e <= 3999) return "(For libraries and frameworks)";
                                  if (e <= 4999) return "(For applications)";
                                }
                                return n7.hasOwnProperty(e) ? n7[e] : "(Unknown)";
                              })(e.code),
                          ),
                        );
                  };
                  f.onopen = function () {
                    c.lastMessageTs = Date.now();
                    c.heartbeat = window.setInterval(function () {
                      var e = Date.now() - c.lastMessageTs;
                      e > 12e4
                        ? c.disconnect()
                        : e > 1e4 &&
                          c.send({
                            op: "ping",
                          });
                    }, 2e4);
                    c.send({
                      op: "init",
                      token: token,
                      id: n,
                      keyhash: keyhash,
                      version: version,
                      initial: initial,
                      device: device,
                      encryption_version: c.encryptionProvider.encryptionVersion,
                    });
                  };
                  f.onmessage = function (e) {
                    var t,
                      n = e.data;
                    if (typeof n != "string") return d(new Error("Server returned binary"));
                    try {
                      t = JSON.parse(n);
                    } catch (e) {
                      console.error(e);
                      return d(new Error("Server JSON failed to parse: " + n));
                    }
                    if (t.op !== "pong") {
                      if (t.status === "err" || t.res === "err")
                        return d(new Error("Failed to authenticate: " + t.msg));
                      if (t.res !== "ok") return d(new Error("Did not respond to login request: " + n));
                      if (t.hasOwnProperty("perFileMax")) {
                        var perFileMax = t.perFileMax;
                        if (!Number.isInteger(perFileMax) || isNaN(perFileMax) || perFileMax < 0)
                          return d(new Error("Unexpected value from server for max file size"));
                        c.perFileMax = perFileMax;
                      }
                      t.userId && (c.userId = t.userId);
                      a();
                      p = true;
                      f.onmessage = c.onMessage.bind(c);
                      f.onclose = c.disconnect.bind(c);
                      f.onerror = c.disconnect.bind(c);
                    }
                  };
                }),
              ]);
        });
      });
    };
    e.prototype.disconnect = function () {
      this.socket && this.socket.close();
      this.socket = null;
      clearInterval(this.heartbeat);
      this.heartbeat = null;
      var e = new Error("Disconnected");
      this.responsePromise && (this.responsePromise.reject(e), (this.responsePromise = null));
      this.dataPromise && (this.dataPromise.reject(e), (this.dataPromise = null));
    };
    e.prototype.pull = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          return [
            2,
            this.queue.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                var t, n, i, r, o, a, s;
                return __generator(this, function (l) {
                  switch (l.label) {
                    case 0:
                      this.lastNetworkRequestTs = Date.now();
                      return [
                        4,
                        this.request({
                          op: "pull",
                          uid: e,
                        }),
                      ];
                    case 1:
                      if ((t = l.sent()).deleted) return [3, 8];
                      n = t.size;
                      i = t.pieces;
                      r = new ArrayBuffer(n);
                      o = 0;
                      a = 0;
                      l.label = 2;
                    case 2:
                      return a < i ? [4, this.dataResponse()] : [3, 5];
                    case 3:
                      s = l.sent();
                      new Uint8Array(r, o, s.byteLength).set(new Uint8Array(s));
                      o += s.byteLength;
                      l.label = 4;
                    case 4:
                      a++;
                      return [3, 2];
                    case 5:
                      return r.byteLength > 0 ? [4, this.encryptionProvider.decrypt(r)] : [3, 7];
                    case 6:
                      r = l.sent();
                      l.label = 7;
                    case 7:
                      return [2, r];
                    case 8:
                      return [2, null];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.push = function (e, t, foldern0, deleted, ctime, mtime, hash, s) {
      return __awaiter(this, undefined, Promise, function () {
        var l = this;
        return __generator(this, function (c) {
          return [
            2,
            this.queue.queue(function () {
              return __awaiter(l, undefined, undefined, function () {
                var path, relatedpath, u, extension, size, d, pieces, m, g, v;
                return __generator(this, function (y) {
                  switch (y.label) {
                    case 0:
                      this.lastNetworkRequestTs = Date.now();
                      return [4, this.encryptionProvider.deterministicEncodeStr(e)];
                    case 1:
                      path = y.sent();
                      return t ? [4, this.encryptionProvider.deterministicEncodeStr(t)] : [3, 3];
                    case 2:
                      u = y.sent();
                      return [3, 4];
                    case 3:
                      u = null;
                      y.label = 4;
                    case 4:
                      relatedpath = u;
                      extension = foldern0 ? "" : getExtension(getFilename(e));
                      return foldern0 || deleted
                        ? ((this.justPushed = {
                            path: path,
                            folder: foldern0,
                            deleted: deleted,
                            mtime: 0,
                            hash: "",
                          }),
                          [
                            4,
                            this.request({
                              op: "push",
                              path: path,
                              relatedpath: relatedpath,
                              extension: extension,
                              hash: "",
                              ctime: 0,
                              mtime: 0,
                              folder: foldern0,
                              deleted: deleted,
                            }),
                          ])
                        : [3, 6];
                    case 5:
                      y.sent();
                      return [2];
                    case 6:
                      return s.byteLength > 0 ? [4, this.encryptionProvider.encrypt(s)] : [3, 8];
                    case 7:
                      s = y.sent();
                      y.label = 8;
                    case 8:
                      return hash ? [4, this.encryptionProvider.deterministicEncodeStr(hash)] : [3, 10];
                    case 9:
                      hash = y.sent();
                      y.label = 10;
                    case 10:
                      size = s.byteLength;
                      d = 2097152;
                      pieces = Math.ceil(size / d);
                      this.justPushed = {
                        path: path,
                        folder: foldern0,
                        deleted: deleted,
                        mtime: mtime,
                        hash: hash,
                      };
                      return [
                        4,
                        this.request({
                          op: "push",
                          path: path,
                          relatedpath: relatedpath,
                          extension: extension,
                          hash: hash,
                          ctime: ctime,
                          mtime: mtime,
                          folder: foldern0,
                          deleted: deleted,
                          size: size,
                          pieces: pieces,
                        }),
                      ];
                    case 11:
                      if (y.sent().res === "ok") {
                        this.justPushed = null;
                        return [2];
                      }
                      m = 0;
                      y.label = 12;
                    case 12:
                      return m < pieces
                        ? ((g = m * d),
                          (v = Math.min(d, size - g)),
                          this.sendBinary(new Uint8Array(s, g, v)),
                          [4, this.response()])
                        : [3, 15];
                    case 13:
                      y.sent();
                      y.label = 14;
                    case 14:
                      m++;
                      return [3, 12];
                    case 15:
                      this.justPushed = null;
                      return [2];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.listDeleted = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e = this;
        return __generator(this, function (t) {
          return [
            2,
            this.queue.queue(function () {
              return __awaiter(e, undefined, undefined, function () {
                var e, t, n, i, r, o;
                return __generator(this, function (a) {
                  switch (a.label) {
                    case 0:
                      return [
                        4,
                        this.request({
                          op: "deleted",
                          suppressrenames: true,
                        }),
                      ];
                    case 1:
                      e = a.sent();
                      t = e.items;
                      n = 0;
                      i = t;
                      a.label = 2;
                    case 2:
                      return n < i.length
                        ? ((r = i[n]), (o = r), [4, this.encryptionProvider.deterministicDecodeStr(r.path)])
                        : [3, 5];
                    case 3:
                      o.path = a.sent();
                      a.label = 4;
                    case 4:
                      n++;
                      return [3, 2];
                    case 5:
                      return [2, t];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.listHistory = function (e, last) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          return [
            2,
            this.queue.queue(function () {
              return __awaiter(n, undefined, undefined, function () {
                var path, i, r, o, a, s, l, c, relatedpath;
                return __generator(this, function (h) {
                  switch (h.label) {
                    case 0:
                      return [4, this.encryptionProvider.deterministicEncodeStr(e)];
                    case 1:
                      path = h.sent();
                      return [
                        4,
                        this.request({
                          op: "history",
                          path: path,
                          last: last,
                        }),
                      ];
                    case 2:
                      i = h.sent();
                      r = i.items;
                      o = 0;
                      a = r;
                      h.label = 3;
                    case 3:
                      return o < a.length
                        ? ((s = a[o]), (l = s), [4, this.encryptionProvider.deterministicDecodeStr(s.path)])
                        : [3, 8];
                    case 4:
                      l.path = h.sent();
                      c = s;
                      return (relatedpath = s.relatedpath)
                        ? [4, this.encryptionProvider.deterministicDecodeStr(s.relatedpath)]
                        : [3, 6];
                    case 5:
                      relatedpath = h.sent();
                      h.label = 6;
                    case 6:
                      c.relatedpath = relatedpath;
                      h.label = 7;
                    case 7:
                      o++;
                      return [3, 3];
                    case 8:
                      return [2, i];
                  }
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.restore = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t = this;
        return __generator(this, function (n) {
          return [
            2,
            this.queue.queue(function () {
              return __awaiter(t, undefined, undefined, function () {
                return __generator(this, function (t) {
                  return [
                    2,
                    this.request({
                      op: "restore",
                      uid: e,
                    }),
                  ];
                });
              });
            }),
          ];
        });
      });
    };
    e.prototype.getUsernames = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e = this;
        return __generator(this, function (t) {
          return [
            2,
            this.queue.queue(function () {
              return e.request({
                op: "usernames",
              });
            }),
          ];
        });
      });
    };
    e.prototype.purge = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e = this;
        return __generator(this, function (t) {
          return [
            2,
            this.queue.queue(function () {
              return e.request({
                op: "purge",
              });
            }),
          ];
        });
      });
    };
    e.prototype.size = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e = this;
        return __generator(this, function (t) {
          return [
            2,
            this.queue.queue(function () {
              return e.request({
                op: "size",
              });
            }),
          ];
        });
      });
    };
    e.prototype.onServerPush = function (e) {
      var t = this,
        n = this.justPushed;
      n &&
        n.path === e.path &&
        n.folder === e.folder &&
        n.deleted === e.deleted &&
        n.mtime === e.mtime &&
        n.hash === e.hash &&
        ((this.justPushed = null), (e.wasJustPushed = true));
      return this.notifyQueue.queue(function () {
        return __awaiter(t, undefined, undefined, function () {
          var t, n;
          return __generator(this, function (i) {
            switch (i.label) {
              case 0:
                t = e;
                return [4, this.encryptionProvider.deterministicDecodeStr(e.path)];
              case 1:
                t.path = i.sent();
                return e.hash ? ((n = e), [4, this.encryptionProvider.deterministicDecodeStr(e.hash)]) : [3, 3];
              case 2:
                n.hash = i.sent();
                i.label = 3;
              case 3:
                this.onPush(e);
                return [2];
            }
          });
        });
      });
    };
    e.prototype.response = function () {
      return (this.responsePromise = rx()).promise;
    };
    e.prototype.dataResponse = function () {
      return (this.dataPromise = rx()).promise;
    };
    e.prototype.request = function (e) {
      return __awaiter(this, arguments, Promise, function (e, t) {
        var n, i, r, o, a;
        undefined === t && (t = 6e4);
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              n = this.responsePromise = rx();
              this.send(e);
              i = new Error("Timeout");
              r = window.setTimeout(function () {
                return n.reject(i);
              }, t);
              s.label = 1;
            case 1:
              s.trys.push([1, 3, , 4]);
              return [4, n.promise];
            case 2:
              o = s.sent();
              clearTimeout(r);
              return [3, 4];
            case 3:
              throw ((a = s.sent()) === i && this.disconnect(), a);
            case 4:
              if (o.err) throw new Error(o.err);
              return [2, o];
          }
        });
      });
    };
    e.prototype.onMessage = function (e) {
      if (((this.lastMessageTs = Date.now()), typeof e.data == "string")) {
        var t = undefined;
        try {
          t = JSON.parse(e.data);
        } catch (t) {
          console.log(e.data);
          return void this.disconnect();
        }
        var n = t.op;
        if (n === "pong") return;
        if (n === "ready") return void this.onReady(t.version);
        if (n === "push") return void this.onServerPush(t);
        var i = this.responsePromise;
        if (i) {
          this.responsePromise = null;
          i.resolve(t);
        }
      } else {
        var r = this.dataPromise;
        if (r) {
          this.dataPromise = null;
          r.resolve(e.data);
        }
      }
    };
    e.prototype.send = function (e) {
      this.socket.send(JSON.stringify(e));
    };
    e.prototype.sendBinary = function (e) {
      this.socket.send(e);
    };
    return e;
  })(),
  f7 = i18nProxy.plugins.tagPane,
  m7 = (function () {
    function e() {
      this.id = "tag-pane";
      this.name = f7.name();
      this.description = f7.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerGlobalCommand({
        id: "tag-pane:open",
        name: f7.actionShow(),
        icon: "lucide-tag",
        callback: function () {
          n.app.workspace.ensureSideLeaf(g7, "right", {
            active: !0,
          });
        },
      });
      plugin.registerViewType(g7, function (e) {
        return new k7(e);
      });
    };
    e.prototype.onEnable = function (e, t) {
      t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.initLeaf = function () {
      var e = "right";
      Platform.isMobile && (e = "left");
      this.app.workspace.ensureSideLeaf(g7, e, {
        reveal: !1,
      });
    };
    return e;
  })(),
  g7 = "tag",
  v7 = [
    ["alphabetical", "alphabeticalReverse"],
    ["frequency", "frequencyReverse"],
  ],
  y7 = {
    alphabetical: i18nProxy.plugins.tagPane.labelSortByNameAToZ,
    alphabeticalReverse: i18nProxy.plugins.tagPane.labelSortByNameZToA,
    frequency: i18nProxy.plugins.tagPane.labelSortByFrequencyHighToLow,
    frequencyReverse: i18nProxy.plugins.tagPane.labelSortByFrequencyLowToHigh,
  },
  b7 = (function (e) {
    function t(tree, tagView) {
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
      i.tag = "";
      i.count = -1;
      i.vChildren = new YF(i);
      i.pusherEl = rN();
      i.tree = tree;
      i.tagView = tagView;
      var r = i,
        o = r.selfEl,
        a = r.innerEl;
      o.addClass("tag-pane-tag");
      i.tagTextEl = a.createDiv("tree-item-inner-text");
      i.tagCountEl = o.createDiv("tree-item-flair-outer").createSpan("tag-pane-tag-count tree-item-flair");
      i.setCollapsible(!0);
      i.setClickable(!0);
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      var t = this.tagView.app,
        n = "tag:" + this.tag,
        i = t.internalPlugins.getEnabledPluginById("global-search");
      if (i) {
        var r = i.getGlobalSearchQuery();
        if (!Keymap.isModEvent(e) || r === "") return void i.openGlobalSearch(n);
        r.contains(n)
          ? i.openGlobalSearch(r.replace(n, "").trim())
          : i.openGlobalSearch("".concat(r.trim(), " ").concat(n));
        this.tagView.tree.setFocusedItem(null, !1);
      }
    };
    t.prototype.setTag = function (tag) {
      if (this.tag !== tag) {
        this.tag = tag;
        var t = this.tagTextEl;
        if (tag.startsWith("#")) {
          tag = tag.substr(1);
        }
        var textn0 = tag.split("/").last(),
          texti0 = tag.substr(0, tag.length - textn0.length);
        t.empty();
        t.createSpan({
          cls: "tag-pane-tag-parent",
          text: texti0,
        });
        t.createSpan({
          cls: "tree-item-inner-text",
          text: textn0,
        });
      }
      return this;
    };
    t.prototype.setCount = function (count) {
      if (this.count !== count) {
        this.count = count;
        this.tagCountEl.setText(String(count));
      }
      return this;
    };
    t.prototype.onCollapseClick = function (t) {
      e.prototype.onCollapseClick.call(this, t);
      this.tree.requestSaveFolds();
    };
    t.prototype.updateCollapsed = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return [4, e.prototype.updateCollapsed.call(this, t)];
            case 1:
              r.sent();
              this.collapsed || (i = (n = this.tree).handleCollapseAll) === null || undefined === i || i.call(n, !1);
              this.tree.infinityScroll.invalidate(this);
              return [2];
          }
        });
      });
    };
    return t;
  })(C_),
  w7 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.getFoldKey = function () {
      return "tag-pane-fold";
    };
    return t;
  })(z0),
  k7 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-tags";
      n.tagDoms = {};
      n.tagPaneEl = null;
      n.searchQuery = null;
      n.sortOrder = "frequency";
      n.useHierarchy = false;
      n.isShowingSearch = false;
      var i = n.containerEl;
      n.tagPaneEl = n.containerEl.createDiv("tag-container");
      n.scope = new Scope(n.app.scope);
      n.tree = new w7(n, {
        app: n.app,
        containerEl: n.tagPaneEl,
        id: g7,
        scope: n.scope,
        getNodeId: n.getNodeId.bind(n),
      });
      n.emptyEl = createDiv({
        cls: "pane-empty tag-pane-empty",
        text: f7.labelNoTags(),
      });
      var r = new s0(n.app, i);
      r.addNavButton("lucide-sort-asc", i18nProxy.plugins.fileExplorer.actionChangeSort(), function (e) {
        e.preventDefault();
        for (var t = new Menu(), i = n.sortOrder, r = 0, o = v7; r < o.length; r++) {
          for (
            var a = function (sortOrder) {
                var r = y7[sortOrder]();
                t.addItem(function (t) {
                  return t
                    .setTitle(r)
                    .setChecked(sortOrder === i)
                    .onClick(function () {
                      n.sortOrder = sortOrder;
                      n.requestUpdateTags();
                      n.app.workspace.requestSaveLayout();
                    });
                });
              },
              s = 0,
              l = o[r];
            s < l.length;
            s++
          ) {
            a(l[s]);
          }
          t.addSeparator();
        }
        t.showAtMouseEvent(e);
      });
      n.useHierarchyEl = r.addNavButton("lucide-folder-tree", f7.actionShowNestedTags(), function () {
        n.setUseHierarchy(!n.useHierarchy);
        n.app.workspace.requestSaveLayout();
      });
      n.collapseOrExpandAllEl = r.addNavButton("lucide-chevrons-up-down", f7.actionExpandAll(), function () {
        n.tree.toggleCollapseAll();
        n.app.workspace.requestSaveLayout();
      });
      n.showSearchButtonEl = r.addNavButton(
        "lucide-search",
        i18nProxy.plugins.backlinks.labelShowSearch(),
        function () {
          n.onToggleShowSearch();
          n.app.workspace.requestSaveLayout();
        },
      );
      var o = debounce(
        function () {
          n.updateSearch();
          n.app.workspace.requestSaveLayout();
        },
        300,
        !0,
      );
      n.searchComponent = new SearchComponent(r.navHeaderEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(o)
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
      n.scope.register([], "Enter", n.onKeyEnterInFocus.bind(n));
      n.scope.register(["Mod"], "Enter", n.onKeyEnterInFocus.bind(n));
      i.addEventListener("click", function () {
        n.tree.setFocusedItem(null);
      });
      n.requestUpdateTags = debounce(n.updateTags.bind(n), 10);
      n.setUseHierarchy(!0);
      return n;
    }
    __extends(t, e);
    t.prototype.getNodeId = function (e) {
      return e.tag.toLowerCase();
    };
    t.prototype.isItem = function (e) {
      return e instanceof b7;
    };
    t.prototype.onKeyEnterInFocus = function (e) {
      e.preventDefault();
      this.isItem(this.tree.focusedItem) && this.tree.focusedItem.onSelfClick(e);
    };
    t.prototype.getDisplayText = function () {
      return f7.shortName();
    };
    t.prototype.getViewType = function () {
      return g7;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.sortOrder = this.sortOrder;
      t.useHierarchy = this.useHierarchy;
      t.showSearch = this.isShowingSearch;
      t.searchQuery = this.searchComponent.getValue();
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var sortOrder, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              s.sent();
              sortOrder = t.sortOrder;
              r = t.useHierarchy;
              o = t.showSearch;
              a = t.searchQuery;
              String.isString(sortOrder) && y7.hasOwnProperty(sortOrder) && (this.sortOrder = sortOrder);
              isBoolean(r) && this.setUseHierarchy(r);
              isBoolean(o) && this.setShowSearch(o);
              String.isString(a) && (this.searchComponent.setValue(a), this.updateSearch());
              this.requestUpdateTags();
              return [2];
          }
        });
      });
    };
    t.prototype.onload = function () {
      this.registerEvent(this.app.metadataCache.on("finished", this.requestUpdateTags, this));
      this.requestUpdateTags();
    };
    t.prototype.onResize = function () {
      this.tree.onResize();
    };
    t.prototype.setIsAllCollapsed = function (isAllCollapsed) {
      this.tree.isAllCollapsed = isAllCollapsed;
      isAllCollapsed
        ? (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-up-down"),
          setTooltip(this.collapseOrExpandAllEl, f7.actionExpandAll()))
        : (setIcon(this.collapseOrExpandAllEl, "lucide-chevrons-down-up"),
          setTooltip(this.collapseOrExpandAllEl, f7.actionCollapseAll()));
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
          this.updateTags();
        } catch (e) {
          console.log(e);
        }
    };
    t.prototype.setUseHierarchy = function (useHierarchy) {
      if (this.useHierarchy !== useHierarchy) {
        this.collapseOrExpandAllEl.ariaDisabled = String(!useHierarchy);
        this.useHierarchy = useHierarchy;
        this.useHierarchyEl.toggleClass("is-active", useHierarchy);
        this.requestUpdateTags();
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.updateTags = function () {
      var e,
        t = this,
        n = this,
        i = n.app,
        r = n.tagDoms,
        o = n.tree,
        a = i.metadataCache.getTags(),
        s = Object.keys(a),
        l = (this.tagDoms = {}),
        c = this.app.loadLocalStorage("tag-pane-fold"),
        u = new Set(c || null);
      if ((o.root.vChildren.clear(), o.setFocusedItem(null, !1), s.length > 0)) {
        this.emptyEl.detach();
        var h = this.sortOrder,
          p = null;
        if (h === "alphabetical")
          p = function (e, t) {
            return Eb(e.tag, t.tag);
          };
        else if (h === "alphabeticalReverse")
          p = function (e, t) {
            return -Eb(e.tag, t.tag);
          };
        else {
          var d = h === "frequencyReverse" ? -1 : 1;
          p = function (e, t) {
            var n = e.tag,
              i = t.tag,
              r = a[n],
              o = a[i];
            return r === o ? Eb(n, i) : d * (o - r);
          };
        }
        var f = this.useHierarchy,
          m = function (e, n) {
            var i = e.split("/").last();
            if (f && i !== e) {
              var r = e.substr(0, e.length - i.length - 1),
                o = r.toLowerCase(),
                a = l[o];
              a || ((a = new b7(t.tree, t)).setTag(r), (l[o] = a));
              -1 === a.vChildren.children.indexOf(n) && a.vChildren.addChild(n);
              m(r, a);
            } else if (-1 === t.tree.root.vChildren.children.indexOf(n)) {
              t.tree.root.vChildren.addChild(n);
            }
          };
        for (var g in r)
          if (r.hasOwnProperty(g)) {
            r[g].vChildren.clear();
          }
        for (var v = 0, y = s; v < y.length; v++) {
          (C = r[(g = (k = y[v]).toLowerCase())] || new b7(this.tree, this)).setTag(k);
          l[g] = C;
        }
        for (var b = 0, w = s; b < w.length; b++) {
          var k;
          g = (k = w[b]).toLowerCase();
          m(k, l[g]);
        }
        for (var g in l)
          if (l.hasOwnProperty(g)) {
            var C,
              E = (C = l[g]).vChildren.hasChildren();
            C.setCollapsible(E);
            C.setCount(a[C.tag] || 0);
            E && C.setCollapsed(u.has(g), !1);
          }
        o.root.vChildren.sort(p);
        var S = !!((e = this.searchComponent) === null || undefined === e ? undefined : e.getValue());
        QF(
          o.root,
          function (e) {
            if ((ZF(e) && e.vChildren.sort(p), S)) {
              if (t.searchQuery.matchContent(e.tag))
                for (var n = e; n; ) {
                  n.el.show();
                  n = n.parent;
                }
              else e.el.hide();
            } else e.el.show();
          },
          !1,
        );
      } else this.tagPaneEl.appendChild(this.emptyEl);
      o.infinityScroll.invalidateAll();
    };
    return t;
  })(View),
  C7 = (function () {
    function e() {
      this.id = "templates";
      this.name = i18nProxy.plugins.templates.name();
      this.description = i18nProxy.plugins.templates.desc();
      this.defaultOn = true;
      this.app = null;
      this.plugin = null;
      this.options = {};
      this.templateFiles = [];
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(
        i18nProxy.plugins.templates.actionInsert(),
        "lucide-files",
        this.onInsertTemplate.bind(this),
      );
      plugin.registerGlobalCommand({
        id: "insert-template",
        name: i18nProxy.plugins.templates.actionInsert(),
        icon: "lucide-copy",
        callback: this.onInsertTemplate.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "insert-current-date",
        name: i18nProxy.plugins.templates.actionInsertCurrentDate(),
        icon: "lucide-calendar-days",
        editorCallback: this.insertCurrentDate.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "insert-current-time",
        name: i18nProxy.plugins.templates.actionInsertCurrentTime(),
        icon: "lucide-clock",
        editorCallback: this.insertCurrentTime.bind(this),
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
              n.options = i.sent() || {};
              t.addSettingTab(new S7(e, t, this));
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
    e.prototype.insertTemplate = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c, u, h, p, d;
        return __generator(this, function (f) {
          switch (f.label) {
            case 0:
              t = this.app;
              n = t.workspace;
              i = t.vault;
              return (r = n.activeEditor)
                ? ((o = n.activeEditor), (a = o.editor), (s = o.file), [4, i.cachedRead(e)])
                : [2];
            case 1:
              if (
                ((l = j4(
                  (l = f.sent()),
                  {
                    title: (d = s == null ? undefined : s.basename) !== null && undefined !== d ? d : "",
                  },
                  {
                    dateFormat: this.options.dateFormat,
                    timeFormat: this.options.timeFormat,
                  },
                )),
                (c = a.getCursor("from")).line === 0 && c.ch === 0)
              ) {
                a.replaceSelection(l);
                return [2];
              }
              try {
                p = kx(l);
                u = p.content;
                h = p.frontmatter;
              } catch (e) {
                new Notice(i18nProxy.plugins.templates.msgFailInvalidTemplateProperties());
                return [2];
              }
              a.replaceSelection(u);
              h && r instanceof MarkdownView && r.metadataEditor.insertProperties(h);
              return [2];
          }
        });
      });
    };
    e.prototype.onInsertTemplate = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          folderOption,
          r,
          o,
          a = this;
        return __generator(this, function (s) {
          t = (e = this).app;
          n = e.options;
          return (folderOption = n.folder) && String.isString(folderOption)
            ? ((r = normalizePath(Kc(folderOption).normalize("NFC"))),
              (o = t.vault.getAbstractFileByPath(r)) && o instanceof TFolder
                ? o.isRoot()
                  ? (new Notice(i18nProxy.plugins.templates.msgFailInvalidFolder()), [2])
                  : ((this.templateFiles = []),
                    Vault.recurseChildren(o, function (e) {
                      if (e instanceof TFile && e.extension === "md") {
                        a.templateFiles.push(e);
                      }
                    }),
                    this.templateFiles.sort(function (e, t) {
                      return Eb(e.path, t.path);
                    }),
                    new E7(t, this, r).open(),
                    [2])
                : (new Notice(
                    i18nProxy.plugins.templates.msgFailFolderNotFound({
                      folderOption: folderOption,
                    }),
                  ),
                  [2]))
            : (new Notice(i18nProxy.plugins.templates.msgNoFolderSet()), [2]);
        });
      });
    };
    e.prototype.insertCurrentDate = function (e) {
      var t = this.options.dateFormat || U4,
        n = window.moment().format(t);
      this.insertText(e, n);
    };
    e.prototype.insertCurrentTime = function (e) {
      var t = this.options.timeFormat || _4,
        n = window.moment().format(t);
      this.insertText(e, n);
    };
    e.prototype.insertText = function (e, textt0) {
      var from = e.getCursor("head");
      e.transaction({
        changes: [
          {
            text: textt0,
            from: from,
          },
        ],
        selection: {
          from: Tb(from, textt0.length),
        },
      });
    };
    return e;
  })(),
  E7 = (function (e) {
    function t(t, templatePlugin, sourcePath) {
      var r = e.call(this, t) || this;
      r.emptyStateText = i18nProxy.plugins.templates.msgNoTemplatesFound();
      r.templatePlugin = null;
      r.sourcePath = "";
      r.templatePlugin = templatePlugin;
      r.sourcePath = sourcePath;
      r.setInstructions([
        {
          command: "↑↓",
          purpose: i18nProxy.plugins.templates.instructionNavigate(),
        },
        {
          command: "↵",
          purpose: i18nProxy.plugins.templates.instructionInsert(),
        },
        {
          command: "esc",
          purpose: i18nProxy.plugins.templates.instructionDismiss(),
        },
      ]);
      r.setPlaceholder(i18nProxy.plugins.templates.promptTypeTemplate());
      r.scope.register(null, "Tab", function () {
        return !1;
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      return this.templatePlugin.templateFiles;
    };
    t.prototype.onChooseItem = function (e) {
      this.templatePlugin.insertTemplate(e);
    };
    t.prototype.getItemText = function (e) {
      return $c(e.path).slice(this.sourcePath.length + 1);
    };
    return t;
  })(FuzzySuggestModal),
  S7 = (function (e) {
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
        .setName(i18nProxy.plugins.templates.optionTemplateFolderLocation())
        .setDesc(i18nProxy.plugins.templates.optionTemplateFolderLocationDescription())
        .addText(function (t) {
          t.setPlaceholder(i18nProxy.setting.folderPathExamplePlaceholder())
            .setValue(n.folder)
            .onChange(function (t) {
              n.folder = t.trim();
              e.plugin.saveData(n);
            });
          new gT(e.app, t.inputEl, function (e) {
            return e.path !== "/";
          });
        });
      var i = document.createDocumentFragment();
      i.appendText(i18nProxy.plugins.templates.optionTemplateDateFormatDescription(yamlInterpolation));
      i.createEl("br");
      i.appendText(i18nProxy.plugins.templates.optionTemplateDateFormatDescription2(yamlInterpolation));
      i.createEl("br");
      i.appendText(i18nProxy.plugins.dailyNotes.labelReferToSyntax());
      i.createEl("a", {
        text: i18nProxy.plugins.dailyNotes.labelSyntaxLink(),
        attr: {
          href: "https://momentjs.com/docs/#/displaying/format/",
          target: "_blank",
        },
      });
      i.createEl("br");
      i.appendText(i18nProxy.plugins.dailyNotes.labelSyntaxLivePreview());
      var r = i.createEl("b", "u-pop");
      new Setting(t)
        .setName(i18nProxy.plugins.templates.optionTemplateDateFormat())
        .setDesc(i)
        .addMomentFormat(function (t) {
          return t
            .setSampleEl(r)
            .setDefaultFormat(U4)
            .setValue(n.dateFormat)
            .onChange(function (t) {
              n.dateFormat = t.trim();
              e.plugin.saveData(n);
            });
        });
      var o = document.createDocumentFragment();
      o.appendText(i18nProxy.plugins.templates.optionTemplateTimeFormatDescription(yamlInterpolation));
      o.createEl("br");
      o.appendText(i18nProxy.plugins.templates.optionTemplateTimeFormatDescription2(yamlInterpolation));
      o.createEl("br");
      o.appendText(i18nProxy.plugins.dailyNotes.labelReferToSyntax());
      o.createEl("a", {
        text: i18nProxy.plugins.dailyNotes.labelSyntaxLink(),
        attr: {
          href: "https://momentjs.com/docs/#/displaying/format/",
          target: "_blank",
        },
      });
      o.createEl("br");
      o.appendText(i18nProxy.plugins.dailyNotes.labelSyntaxLivePreview());
      var a = o.createEl("b", "u-pop");
      new Setting(t)
        .setName(i18nProxy.plugins.templates.optionTemplateTimeFormat())
        .setDesc(o)
        .addMomentFormat(function (t) {
          return t
            .setSampleEl(a)
            .setDefaultFormat(_4)
            .setValue(n.timeFormat)
            .onChange(function (t) {
              n.timeFormat = t.trim();
              e.plugin.saveData(n);
            });
        });
    };
    return t;
  })(j1),
  M7 =
    ((function (e) {
      function t(plugin, n, i) {
        var r = e.call(this, n, i) || this;
        r.plugin = plugin;
        return r;
      }
      __extends(t, e);
      t.prototype.getSuggestions = function (t) {
        var n = this.app,
          i = this.plugin,
          r = e.prototype.getSuggestions.call(this, t);
        if (t !== "") return r;
        var o = i.options.folder;
        if (!o || !String.isString(o)) return r;
        var a = normalizePath(Kc(o).normalize("NFC")),
          s = n.vault.getFolderByPath(a);
        return s
          ? r.filter(function (e) {
              return e.item.path.startsWith(s.path);
            })
          : r;
      };
    })(yT),
    "YYYYMMDDHHmm"),
  x7 = i18nProxy.plugins.uniqueNoteCreator,
  T7 = (function () {
    function e() {
      this.id = "zk-prefixer";
      this.name = x7.name();
      this.description = x7.desc();
      this.app = null;
      this.plugin = null;
      this.options = {};
    }
    e.prototype.init = function (app, plugin) {
      this.app = app;
      this.plugin = plugin;
      plugin.registerRibbonItem(x7.actionCreateNote(), "sheets-in-box", this.onCreateNote.bind(this));
      plugin.registerGlobalCommand({
        id: "zk-prefixer",
        name: x7.actionCreateNote(),
        icon: "box-glyph",
        callback: this.onCreateNote.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "insert-unique-link",
        name: x7.actionAddLink(),
        icon: "lucide-link",
        editorCallback: this.addUniqueLink.bind(this),
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
              n.options = i.sent() || {};
              t.addSettingTab(new D7(e, t, this));
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
    e.prototype.getUniquePath = function (e) {
      if (undefined === e) {
        e = "";
      }
      var t = this.app.vault.getAllLoadedFiles(),
        n = function (e) {
          for (var n = false, i = 0, r = t; i < r.length; i++) {
            var o = r[i];
            if (o instanceof TFile && o.name.startsWith(e)) {
              n = true;
              break;
            }
          }
          return n;
        },
        i = window.moment(),
        format = this.getFormat(),
        o = i.format(format);
      if ((e && (o = o + " " + e), n(o))) {
        for (var a = "", s = 0, l = ["m", "h", "d", "w", "M", "y"]; s < l.length; s++) {
          var c = l[s];
          if ((h = i.clone().add(1, c).format(format)) !== o) {
            a = c;
            break;
          }
        }
        if (!a) {
          new Notice(
            x7.msgFailedToGenerate({
              format: format,
            }),
          );
          return null;
        }
        for (var u = i.clone(); ; ) {
          var h;
          if (!n((h = u.add(1, a).format(format)))) {
            o = h;
            break;
          }
        }
      }
      return o;
    };
    e.prototype.onCreateNote = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, title, o, a, folderOption, l, c, u, template, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              if (((n = (t = this).app), (i = t.options), !(title = this.getUniquePath()))) return [2];
              if (
                ((o = this.app.workspace.getLeaf(Keymap.isModEvent(e || this.app.lastEvent))),
                (folderOption = i.folder) && String.isString(folderOption))
              ) {
                if (
                  ((l = normalizePath(Kc(folderOption).normalize("NFC"))),
                  !((c = n.vault.getAbstractFileByPath(l)) instanceof TFolder))
                ) {
                  new Notice(
                    x7.msgFolderNotFound({
                      folderOption: folderOption,
                    }),
                  );
                  return [2];
                }
                a = c;
              } else a = n.fileManager.getNewFileParent("", title);
              g.label = 1;
            case 1:
              g.trys.push([1, 7, , 8]);
              return (template = i.template)
                ? (p = n.metadataCache.getFirstLinkpathDest(template, ""))
                  ? [4, n.vault.cachedRead(p)]
                  : (new Notice(
                      x7.msgTemplateFileNotFound({
                        template: template,
                      }),
                    ),
                    [2])
                : [3, 4];
            case 2:
              d = g.sent();
              f = j4(
                d,
                {
                  title: title,
                },
                {},
              );
              return [4, n.fileManager.createNewMarkdownFile(a, title, f)];
            case 3:
              u = g.sent();
              return [3, 6];
            case 4:
              return [4, n.fileManager.createNewMarkdownFile(a, title)];
            case 5:
              u = g.sent();
              g.label = 6;
            case 6:
              return [3, 8];
            case 7:
              m = g.sent();
              new Notice(m.toString());
              return [2];
            case 8:
              return [
                4,
                o.openFile(u, {
                  active: true,
                  state: {
                    mode: "source",
                  },
                  eState: {
                    rename: "end",
                  },
                }),
              ];
            case 9:
              g.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.addUniqueLink = function (e) {
      var t = this,
        n = e.cm.state,
        i = n.changeByRange(function (range) {
          var i = "[[",
            r = n.sliceDoc(range.from, range.to),
            o = t.getUniquePath(r);
          if (!o)
            return {
              range: range,
            };
          var insert = i + o + "]]",
            ranges0 = range.empty
              ? EditorSelection.cursor(range.from + 2 + o.length)
              : Am(range, range.from + 2, range.from + 2 + o.length);
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: insert,
            },
            range: ranges0,
          };
        });
      i.userEvent = "input.autocomplete";
      e.cm.dispatch(i);
    };
    e.prototype.getFormat = function () {
      var e = this.options.format;
      return e && String.isString(e) ? e : M7;
    };
    return e;
  })(),
  D7 = (function (e) {
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
        .setName(x7.optionNewFileLocation())
        .setDesc(x7.optionNewFileLocationDescription())
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
        .setName(x7.optionTemplateFile())
        .setDesc(x7.optionTemplateFileDescription())
        .addText(function (t) {
          t.setPlaceholder(x7.optionTemplateFilePlaceholder())
            .setValue(n.template)
            .onChange(function (t) {
              n.template = t.trim();
              e.plugin.saveData(n);
            });
          new vT(e.app, t.inputEl);
        });
      var i = document.createDocumentFragment();
      i.appendText(i18nProxy.plugins.dailyNotes.labelReferToSyntax());
      i.createEl("a", {
        text: i18nProxy.plugins.dailyNotes.labelSyntaxLink(),
        attr: {
          href: "https://momentjs.com/docs/#/displaying/format/",
          target: "_blank",
        },
      });
      i.createEl("br");
      i.appendText(i18nProxy.plugins.dailyNotes.labelSyntaxLivePreview());
      var r = i.createEl("b", "u-pop");
      new Setting(t)
        .setName(x7.optionIdFormat())
        .setDesc(i)
        .addMomentFormat(function (t) {
          return t
            .setSampleEl(r)
            .setDefaultFormat(M7)
            .setValue(n.format)
            .onChange(function (t) {
              n.format = t.trim();
              e.plugin.saveData(n);
            });
        });
    };
    return t;
  })(j1);