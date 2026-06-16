const emulateMobileLiteralString = "EmulateMobile";
const debugModeLiteralString = "DebugMode";
class App {
  constructor(adapter, appId) {
    var self = this;
    this.appMenuBarManager = null;
    this.embedRegistry = new gY();
    this.viewRegistry = new ViewRegistry();
    this.nextFrameEvents = [];
    this.nextFrameTimer = null;
    this.isMobile = false;
    this.mobileToolbar = null;
    this.mobileNavbar = null;
    this.mobileTabSwitcher = null;
    this.lastEvent = null;
    console.log("%cObsidian Developer Console", "color:#7f6df2; font-size:40px; font-weight:bold;");
    const body = document.body;
    this.title = document.title;
    this.appId = appId;
    this.keymap = Keymap.init();
    this.scope = Keymap.global.getRootScope();
    this.commands = new CcommandManager(this);
    this.hotkeyManager = new HotkeyManager(this);
    this.dragManager = new DragManager(this);
    this.dom = new DOMManager(body);
    this.customCss = new StyleManager(this);
    this.shareReceiver = new ShareReceiver(this);
    this.renderContext = new RenderContext(this);
    body.addClass("obsidian-app");
    if (this.loadLocalStorage(debugModeLiteralString) === "1") {
      runDebugMode = true;
      new Notice("Obsidian debug mode enabled.");
      console.debug("[Obsidian] Debug mode enabled. Run `app.debugMode(false)` to disable.");
    } else {
      new Notice("Obsidian debug mode disabled.");
      console.debug("[Obsidian] Debug mode disabled.");
    }
    if (!Platform.isMobile && localStorage.getItem(emulateMobileLiteralString)) {
      Platform.isMobile = true;
      Platform.isDesktop = false;
      Platform.hasPhysicalKeyboard = false;
      body.addClass("emulate-mobile");
      if (Platform.isMobile) {
        document.body.on("mouseover", Lc, function (e, t) {
          if (Mc(e, t)) {
            Nc(e) || (Ic == null || Ic.removeClass(Pc), (Ic = t).addClass(Pc));
          }
        });
        document.body.on("mouseout", Lc, function (e, t) {
          if (!Nc(e)) {
            Mc(e, t) && (Ic == null || Ic.removeClass(Pc));
          }
        });
        document.addEventListener(
          "touchstart",
          function (e) {
            if (e.touches.length === 1) {
              const target = e.targetNode;
              const match = target.instanceOf(Element)
                ? target.matchParent(Lc)
                : target.instanceOf(HTMLElement)
                  ? target
                  : target.parentElement;
              if (match) {
                const timeStamp = e.timeStamp;
                const touch = e.touches[0];
                const identifier = touch.identifier;
                let cancelled = false;
                const timeout = window.setTimeout(function () {
                  cancelled || match.addClass(Pc);
                }, 10);
                const endTouch = function (event) {
                  cancelled = true;
                  cleanup();
                  const delay = Math.max(10, 300 - (event.timeStamp - timeStamp));
                  window.setTimeout(() => match.removeClass(Pc), delay);
                };
                const moveTouch = function (event) {
                  var movedTouch = Rc(event, identifier);
                  if (movedTouch && !cancelled) {
                    window.clearTimeout(timeout);
                    Fl(Ll(movedTouch), Ll(touch)) > 5 && endTouch(event);
                  }
                };
                const cleanup = function () {
                  document.removeEventListener("touchmove", moveTouch);
                  document.removeEventListener("touchcancel", endTouch);
                  document.removeEventListener("touchend", endTouch);
                };
                document.addEventListener("touchmove", moveTouch);
                document.addEventListener("touchcancel", endTouch);
                document.addEventListener("touchend", endTouch);
              }
            }
          },
          true,
        );
      }
      if (window.frameDom) {
        window.frameDom.titleBarEl.hide();
      }
      const mediaQuery = window.matchMedia("(min-width: 600px) and (min-height: 600px)");
      const updateDeviceType = function () {
        if (!Platform.mobileSoftKeyboardVisible) {
          Platform.isTablet = mediaQuery.matches;
          Platform.isPhone = !mediaQuery.matches;
          document.body.toggleClass("is-tablet", Platform.isTablet);
          document.body.toggleClass("is-phone", Platform.isPhone);
        }
      };
      mediaQuery.addEventListener("change", debounce(updateDeviceType, 10));
      updateDeviceType();
    }
    if (keyboardPlugin) {
      keyboardPlugin.hasPhysicalKeyboard().then(function (e) {
        Platform.hasPhysicalKeyboard = e.hasPhysicalKeyboard;
      });
    }
    this.isMobile = Platform.isMobile;
    if (Platform.isMobile) {
      body.addClass("is-mobile");
    }
    if (!Platform.isMacOS) {
      document.body.addClass("styled-scrollbars");
    }
    if (Platform.isIosApp) {
      (function () {
        document.body.style["-webkit-touch-callout"] = "none";
        window.addEventListener("touchstart", function (t) {
          if (!(t.touches.length > 1)) {
            var n = t.touches[0],
              i = t.targetNode,
              clientX = n.clientX,
              clientY = n.clientY,
              a = n.identifier,
              s = 800;
            i instanceof Element && i.matchParent('[draggable="true"]') && (s = 1200);
            var l = window.setTimeout(function () {
                c();
                i.dispatchEvent(
                  new MouseEvent("contextmenu", {
                    button: 0,
                    buttons: 0,
                    ctrlKey: t.ctrlKey,
                    altKey: t.altKey,
                    metaKey: t.metaKey,
                    shiftKey: t.shiftKey,
                    screenX: n.screenX,
                    screenY: n.screenY,
                    bubbles: true,
                    cancelable: true,
                    clientX: clientX,
                    clientY: clientY,
                  }),
                ) || navigator.vibrate(200);
              }, s),
              c = function () {
                window.removeEventListener("touchcancel", h, !0);
                window.removeEventListener("touchend", h, !0);
                window.removeEventListener("touchmove", p, !0);
                window.removeEventListener("dragstart", d, !0);
                window.clearTimeout(l);
                Tc = null;
              };
            Tc = c;
            var u = function (e, t) {
                var n = t.clientX - clientX,
                  i = t.clientY - clientY;
                n * n + i * i > 25 && c();
              },
              h = function (e) {
                for (var t = e.changedTouches, n = 0; n < t.length; n++) {
                  if (t[n].identifier === a) return void c();
                }
              },
              p = function (e) {
                for (var t = e.changedTouches, n = 0; n < t.length; n++) {
                  var i = t[n];
                  if (i.identifier === a) return void u(0, i);
                }
              },
              d = function (e) {
                var t = e.targetNode;
                t && (t === i || t.contains(i)) && c();
              };
            window.addEventListener("touchcancel", h, !0);
            window.addEventListener("touchend", h, !0);
            window.addEventListener("touchmove", p, !0);
            window.addEventListener("dragstart", d, !0);
          }
        });
      })();
    }
    if (window.ServiceWorkerContainer) {
      window.ServiceWorkerContainer.prototype.register = function () {
        return new Promise(function () {});
      };
    }
    (async function () {
      const progress = nJ.instance;
      const timeout = setTimeout(function () {
        progress.setContext(function (ctx) {
          ctx.createDiv("progress-bar-button-container", function (e) {
            e.createEl(
              "button",
              {
                text: i18nProxy.interface.startUp.buttonReloadApp(),
              },
              function (e) {
                e.onClickEvent(function () {
                  window.location.reload();
                });
              },
            );
            if (lezerHighlight.plugins && lezerHighlight.plugins.isEnabled()) {
              e.createEl(
                "button",
                {
                  cls: "mod-cta",
                  text: i18nProxy.interface.startUp.buttonReloadAppInSafeMode(),
                },
                function (btn) {
                  btn.onClickEvent(async () => {
                    await self.plugins.setEnable(false);
                    window.location.reload();
                  });
                },
              );
            }
            e.createEl(
              "button",
              {
                text: i18nProxy.interface.startUp.buttonOpenAnotherVault(),
              },
              function (e) {
                e.onClickEvent(function () {
                  lezerHighlight.openVaultChooser();
                });
              },
            );
          });
        });
      }, 20000);
      try {
        progress.setMessage(i18nProxy.interface.startUp.loadingObsidian()).show();
        await this.initializeWithAdapter(adapter);
        progress.hide();
      } catch (err) {
        console.error(err);
        progress.setMessage(i18nProxy.interface.startUp.obsidianLoadError() + " " + (err ? err.toString() : "unknown"));
        progress.setContext(function (ctx) {
          ctx.createDiv("progress-bar-button-container", function (e) {
            e.createEl(
              "button",
              {
                cls: "mod-cta",
                text: i18nProxy.interface.startUp.buttonReloadApp(),
              },
              function (e) {
                e.onClickEvent(function () {
                  window.location.reload();
                });
              },
            );
            lezerHighlight.plugins &&
              lezerHighlight.plugins.isEnabled() &&
              e.createEl(
                "button",
                {
                  cls: "mod-cta",
                  text: i18nProxy.interface.startUp.buttonReloadAppInSafeMode(),
                },
                function (e) {
                  e.onClickEvent(async () => {
                    await self.plugins.setEnable(false);
                    window.location.reload();
                  });
                },
              );
            e.createEl(
              "button",
              {
                cls: "mod-cta",
                text: i18nProxy.interface.startUp.buttonOpenAnotherVault(),
              },
              function (e) {
                e.onClickEvent(function () {
                  lezerHighlight.openVaultChooser();
                });
              },
            );
          });
        });
      } finally {
        clearTimeout(timeout);
        if (Platform.isMobileApp && splashScreenPlugin) {
          await window.nextFrame();
          splashScreenPlugin.hide();
        }
      }
    })();
    (async () => {
      try {
        if (navigator.storage && navigator.storage.persist) {
          await navigator.storage.persist();
        }
      } catch (err) {
        console.log("Failed to persist local storages");
      }
    })();
  }
  nextFrame(e) {
    if (!this.nextFrameTimer) {
      this.nextFrameTimer = window.requestAnimationFrame(this.onNextFrame.bind(this));
    }
    this.nextFrameEvents.push(e);
  }
  onNextFrame(e) {
    this.nextFrameTimer = null;
    var t = this.nextFrameEvents;
    this.nextFrameEvents = [];
    for (var n = 0, i = t; n < i.length; n++) {
      (0, i[n])(e);
    }
  }
  nextFrameOnceCallback(e) {
    var t = this,
      n = false;
    return function () {
      if (!n) {
        n = true;
        t.nextFrame(function (t) {
          n = false;
          e(t);
        });
      }
    };
  }
  async initializeWithAdapter(adapter) {
    const self = this;
    this.vault = new Vault(adapter);
    if (!Platform.isDesktopApp) {
      try {
        await this.vault.readRaw("");
      } catch (err) {
        if (err.code === "ENOENT") {
          this.vault = null;
          this.openVaultChooser(true);
          return;
        }
      }
    }
    this.vault.on("closed", function () {
      return self.openVaultChooser(!0);
    });
    this.vault.on("config-changed", this.onConfigChanged.bind(this));
    const overrideDir = App.getOverrideConfigDir(this.appId);
    if (overrideDir) {
      this.vault.setConfigDir(overrideDir);
    }
    await this.vault.setupConfig();
    timeSampling("vault.setup");
    this.disableCssTransition();
    this.workspace = new Workspace(this, this.dom.workspaceEl);
    this.fileManager = new FileManager(this);
    this.statusBar = new R7(this, this.dom.statusBarEl);
    this.metadataCache = new MetadataCache(this, this.vault);
    this.metadataTypeManager = new IM(this);
    this.setting = new v9(this);
    this.foldManager = new C0(this);
    this.internalPlugins = new a0(this);
    this.plugins = new Y1(this);
    timeSampling("workspace.components");
    const updateSystemTheme = function () {
      if (this.vault.getConfig("theme") === "system") {
        self.updateTheme();
      }
    };
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateSystemTheme);
    if (Platform.isDesktopApp) {
      window.electron.remote.nativeTheme.removeAllListeners("updated").on("updated", updateSystemTheme);
    }
    this.updateAccentColor();
    this.updateTheme();
    this.updateFontFamily();
    this.updateFontSize();
    this.updateTabSize();
    this.customCss.load();
    this.updateInlineTitleDisplay();
    this.updateRibbonDisplay();
    this.updateViewHeaderDisplay();
    this.updateUseNativeMenu();
    timeSampling("workspace.appearance");
    if (Platform.isDesktopApp) {
      this.appMenuBarManager = new w0(this);
    }
    if (Platform.isMobile) {
      this.mobileToolbar = new x0(this);
      this.mobileNavbar = new E0(this);
      this.mobileTabSwitcher = new M0(this);
    }
    this.shareReceiver.setupWorkspace();
    await this.metadataTypeManager.load();
    await this.hotkeyManager.load();
    this.registerCommands();
    timeSampling("workspace.components");
    nJ.instance.setMessage(i18nProxy.interface.startUp.loadingPlugins());
    this.internalPlugins.loadPlugin(new I3());
    this.internalPlugins.loadPlugin(new D0());
    this.internalPlugins.loadPlugin(new b8());
    this.internalPlugins.loadPlugin(new PJ());
    this.internalPlugins.loadPlugin(new c0());
    this.internalPlugins.loadPlugin(new O4());
    this.internalPlugins.loadPlugin(new a5());
    this.internalPlugins.loadPlugin(new m7());
    this.internalPlugins.loadPlugin(new U3());
    this.internalPlugins.loadPlugin(new E5());
    this.internalPlugins.loadPlugin(new g5());
    this.internalPlugins.loadPlugin(new Y4());
    this.internalPlugins.loadPlugin(new C7());
    this.internalPlugins.loadPlugin(new e5());
    this.internalPlugins.loadPlugin(new z4());
    this.internalPlugins.loadPlugin(new E8());
    this.internalPlugins.loadPlugin(new k3());
    this.internalPlugins.loadPlugin(new V2());
    this.internalPlugins.loadPlugin(new j3());
    this.internalPlugins.loadPlugin(new T7());
    this.internalPlugins.loadPlugin(new C8());
    this.internalPlugins.loadPlugin(new f5());
    this.internalPlugins.loadPlugin(new L7());
    this.internalPlugins.loadPlugin(new T8());
    this.internalPlugins.loadPlugin(new A2());
    this.internalPlugins.loadPlugin(new O7());
    this.internalPlugins.loadPlugin(new N3());
    this.internalPlugins.loadPlugin(new g8());
    this.internalPlugins.loadPlugin(new p7());
    this.internalPlugins.loadPlugin(new b3());
    if (Platform.isDesktopApp) {
      this.internalPlugins.loadPlugin(new i2());
    }
    await this.internalPlugins.enable();
    timeSampling("corePlugins");
    await this.plugins.initialize();
    nJ.instance.setMessage(i18nProxy.interface.startUp.loadingVault());
    try {
      this.metadataCache.preload();
      await this.vault.load();
    } catch (err) {
      new Notice(i18nProxy.interface.startUp.msgFailedToLoadVault() + (err ? err.message : ""));
      console.error(err);
      throw err;
    }
    this.hotkeyManager.registerListeners();
    this.metadataTypeManager.registerListeners();
    nJ.instance.setMessage(i18nProxy.interface.startUp.loadingCache());
    await this.metadataCache.initialize();
    timeSampling("vault");
    nJ.instance.setMessage(i18nProxy.interface.startUp.loadingWorkspace());
    await this.workspace.loadLayout();
    timeSampling("workspace.layout");
    setTimeout(() => self.enableCssTransition(), 500);
    this.workspace.registerUriHook();
    this.registerQuitHook();
    this.metadataCache.showIndexingNotice();
    this.shareReceiver.setupNative();
    if (Platform.isDesktopApp) {
      let updateNotified = false;
      const showUpdateNotice = function () {
        if (updateNotified) return;
        updateNotified = true;
        new Notice(
          createFragment(function (element) {
            element.createEl("b", {
              text: i18nProxy.interface.labelUpdateAvailable(),
            });
            element.createEl("p", {
              text: i18nProxy.setting.about.labelManualUpdateRequired(),
            });
          }),
          0,
        ).addButton(i18nProxy.dialogue.buttonDownload(), () => window.open(getDownloadUrl()));
      };
      if (pG(electronVersion, b9) && !electron.ipcRenderer.sendSync("disable-update")) {
        showUpdateNotice();
      } else {
        const checkUpdate = function () {
          callbackWithElectron(function (ipc) {
            if (ipc.ipcRenderer.sendSync("update") === "update-manual-required") {
              clearInterval(interval);
              showUpdateNotice();
            }
          });
        };
        const interval = setInterval(checkUpdate, 3600000);
        checkUpdate();
      }
      const recentVersion = localStorage.getItem("most-recently-installed-version");
      if (pG(recentVersion || electron.remote.app.getVersion(), apiVersion)) {
        this.showReleaseNotes();
        localStorage.setItem("most-recently-installed-version", apiVersion);
      }
      if (electron) {
        window.addEventListener(
          "drop",
          function (event) {
            const dt = event.dataTransfer;
            if (hasFilesInDragData(dt)) {
              const files = extractFilesFromDataTransfer(dt, "drop", false);
              if (files.length !== 1) return false;
              const file = files[0];
              if (file.extension === "asar" && file.name.match(/^obsidian-\d+\.\d+\.\d+/)) {
                event.preventDefault();
                const version = /^obsidian-(\d+\.\d+\.\d+)/.exec(file.name)[1];
                apiVersion === version || pG(apiVersion, version)
                  ? new GM(self)
                      .setTitle("Install Obsidian v" + version + "?")
                      .setContent("This build is potentially experimental. Ensure your vault data is backed up.")
                      .addButton("mod-cta", "Install", function () {
                        electron.ipcRenderer.sendSync("copy-asar", file.filepath) &&
                          electron.ipcRenderer.sendSync("relaunch");
                      })
                      .addCancelButton()
                      .open()
                  : new GM(self)
                      .setTitle("Unable to install Obsidian v" + version)
                      .setContent(
                        "The build is older than the currently installed version of Obsidian (v".concat(
                          apiVersion,
                          ").",
                        ),
                      )
                      .addButton("mod-cancel", "Okay", function () {})
                      .open();
              }
            }
          },
          {
            capture: true,
          },
        );
      }
    }
    timeSampling("workspace.extra");
    window.setTimeout(function () {
      try {
        var syncPlugin = self.internalPlugins.getPluginById("sync");
        if (syncPlugin && !syncPlugin.enabled) {
          const req = indexedDB.deleteDatabase(self.appId + "-sync");
          req.addEventListener("blocked", (e) => {});
          kX(req).then(() => {});
        }
      } catch (e) {
        console.error("Failed to clean-up Sync DB", e);
      }
    }, 30000);
    Q$.duration = performance.now();
    let totalViews = 0,
      deferredViews = 0;
    self.workspace.iterateAllLeaves((leaf) => {
      totalViews++;
      if (leaf.view instanceof j$ || leaf.view instanceof Pj || leaf.view instanceof G$) deferredViews++;
    });
    X$.views = totalViews;
    X$.deferredViews = deferredViews;
    timestamps.sort((left, right) => left.ts - right.ts);
    for (var i = 0, r = 0, o = timestamps; r < o.length; r++) {
      var a = o[r],
        durations0 = a.ts - i;
      i = a.ts;
      for (var l = Q$, c = 0, u = a.key.split("."); c < u.length; c++) {
        var h = u[c];
        l.children[h] ||
          (l.children[h] = {
            key: h,
            children: {},
            duration: 0,
          });
        (l = l.children[h]).duration += durations0;
      }
    }
    timestamps = [];
    if (this.loadLocalStorage("slow-startup-check") === "1" && eJ() > 8e3) {
      new Notice(i18nProxy.interface.msgSlowBoot()).addButton(i18nProxy.dialogue.buttonView(), function () {
        var e = new F5(self);
        e.shouldAnimate = false;
        e.open();
      });
    }
  }
  onConfigChanged(e) {
    switch (e) {
      case "accentColor":
        this.updateAccentColor();
        break;
      case "theme":
        this.updateTheme();
        break;
      case "interfaceFontFamily":
      case "textFontFamily":
      case "monospaceFontFamily":
        this.updateFontFamily();
        break;
      case "baseFontSize":
        this.updateFontSize();
        break;
      case "showInlineTitle":
        this.updateInlineTitleDisplay();
        break;
      case "showViewHeader":
        this.updateViewHeaderDisplay();
        break;
      case "showRibbon":
        this.updateRibbonDisplay();
        this.workspace.updateFrameless();
        break;
      case "nativeMenus":
        this.updateUseNativeMenu();
        break;
      case "mobileQuickRibbonItem":
        this.mobileNavbar.updateRibbonMenuItem();
        break;
      case "tabSize":
        this.updateTabSize();
    }
  }
  registerCommands() {
    var self = this,
      t = this.commands;
    t.addCommand({
      id: "app:go-back",
      name: i18nProxy.commands.navigateBack(),
      icon: "lucide-arrow-left",
      checkCallback: function (t) {
        var n = self.workspace.activeLeaf;
        if (n && n.view.navigation) {
          t || n.history.back();
          return !0;
        }
      },
      hotkeys: [BO(["Mod", "Alt"], "ArrowLeft")],
    });
    t.addCommand({
      id: "app:go-forward",
      name: i18nProxy.commands.navigateForward(),
      icon: "lucide-arrow-right",
      checkCallback: function (t) {
        var n = self.workspace.activeLeaf;
        if (n && n.view.navigation) {
          t || n.history.forward();
          return !0;
        }
      },
      hotkeys: [BO(["Mod", "Alt"], "ArrowRight")],
    });
    t.addCommand({
      id: "app:open-vault",
      name: i18nProxy.interface.switchVault(),
      icon: "vault",
      callback: this.openVaultChooser.bind(this),
    });
    Platform.isMobile &&
      t.addCommand({
        id: "app:show-tab-switcher",
        name: i18nProxy.interface.mobile.actionShowSwitcher(),
        icon: "lucide-square",
        checkCallback: function (t) {
          if (Platform.isPhone) {
            t || self.mobileTabSwitcher.show();
            return !0;
          }
        },
      });
    t.addCommand({
      id: "theme:use-dark",
      name: i18nProxy.commands.useDarkMode(),
      callback: function () {
        return self.changeTheme("obsidian");
      },
    });
    t.addCommand({
      id: "theme:use-light",
      name: i18nProxy.commands.useLightMode(),
      callback: function () {
        return self.changeTheme("moonstone");
      },
    });
    t.addCommand({
      id: "theme:switch",
      name: i18nProxy.commands.changeTheme(),
      callback: function () {
        return new g1(self).open();
      },
    });
    t.addCommand({
      id: "app:open-settings",
      name: i18nProxy.commands.openSettings(),
      icon: "lucide-settings",
      callback: function () {
        return self.setting.open();
      },
      hotkeys: [BO(["Mod"], ",")],
    });
    Platform.isDesktopApp &&
      t.addCommand({
        id: "app:show-release-notes",
        name: i18nProxy.commands.showReleaseNotes(),
        callback: function () {
          return self.showReleaseNotes();
        },
      });
    t.addCommand({
      id: "markdown:toggle-preview",
      name: i18nProxy.commands.togglePreview(),
      icon: "lucide-book-open",
      checkCallback: function (t) {
        var n = self.workspace.activeEditor;
        if (n) {
          t || n.toggleMode();
          return !0;
        }
      },
      hotkeys: [BO(["Mod"], "E")],
    });
    var canEditProperties = function () {
      if (JT(self.workspace)) return !0;
      if (self.internalPlugins.getEnabledPluginById("properties")) {
        var t = self.workspace.getActiveFile();
        return (t == null ? undefined : t.extension) === "md";
      }
      return !1;
    };
    t.addCommand({
      id: "markdown:add-metadata-property",
      name: i18nProxy.commands.addProperty(),
      icon: "lucide-plus-circle",
      checkCallback: function (checking) {
        if (canEditProperties()) {
          if (!checking) {
            (async () => {
              const editor = await eD(this);
              if (editor) editor.addProperty();
            })();
          }
          return true;
        }
      },
      hotkeys: [BO(["Mod"], ";")],
    });
    t.addCommand({
      id: "markdown:add-alias",
      name: i18nProxy.commands.addAlias(),
      icon: "lucide-forward",
      checkCallback: function (checking) {
        if (canEditProperties()) {
          if (!checking) {
            (async () => {
              const editor = await eD(this);
              if (editor) editor.addProperty("aliases");
            })();
          }
          return true;
        }
      },
    });
    t.addCommand({
      id: "markdown:clear-metadata-properties",
      name: i18nProxy.commands.clearProperties(),
      icon: "lucide-package-x",
      checkCallback: function (t) {
        var n = self.workspace.getActiveFile();
        if (n && MARKDOWN_EXTENSIONS.contains(n.extension)) {
          t ||
            self.vault.process(n, function (e) {
              return Ex(e, {});
            });
          return !0;
        }
      },
    });
    t.addCommand({
      id: "app:delete-file",
      name: i18nProxy.commands.deleteCurrentFile(),
      icon: "lucide-trash-2",
      checkCallback: function (t) {
        var n = self.workspace.getActiveFile();
        if (n) {
          t || self.fileManager.promptForFileDeletion(n);
          return !0;
        }
      },
    });
    t.addCommand({
      id: "app:toggle-ribbon",
      name: i18nProxy.commands.toggleRibbon(),
      checkCallback: function (t) {
        if (Platform.isDesktop && activeWindow === window) {
          if (!t) {
            var n = self.vault.getConfig("showRibbon");
            self.vault.setConfig("showRibbon", !n);
          }
          return !0;
        }
        return !1;
      },
    });
    t.addCommand({
      id: "editor:toggle-readable-line-length",
      name: i18nProxy.commands.toggleReadableLineLength(),
      icon: "lucide-ruler",
      callback: function () {
        return self.vault.setConfig("readableLineLength", !self.vault.getConfig("readableLineLength"));
      },
    });
    t.addCommand({
      id: "app:toggle-left-sidebar",
      name: i18nProxy.commands.toggleLeftSidebar(),
      checkCallback: function (t) {
        if (activeWindow === window) {
          if (!t) {
            var n = self.workspace.leftSplit;
            Platform.canPinSidebar && n instanceof CJ ? n.togglePinned() : n.toggle();
          }
          return !0;
        }
        return !1;
      },
    });
    t.addCommand({
      id: "app:toggle-right-sidebar",
      name: i18nProxy.commands.toggleRightSidebar(),
      checkCallback: function (t) {
        if (activeWindow === window) {
          if (!t) {
            var n = self.workspace.rightSplit;
            Platform.canPinSidebar && n instanceof CJ ? n.togglePinned() : n.toggle();
          }
          return !0;
        }
        return !1;
      },
    });
    t.addCommand({
      id: "app:toggle-default-new-pane-mode",
      name: i18nProxy.commands.toggleDefaultNewTabMode(),
      callback: function () {
        var t = self.vault.getConfig("defaultViewMode");
        t === "source"
          ? (self.vault.setConfig("defaultViewMode", "preview"), new Notice(i18nProxy.interface.msgSwitchedToRead()))
          : t === "preview" &&
            (self.vault.setConfig("defaultViewMode", "source"), new Notice(i18nProxy.interface.msgSwitchedToEdit()));
      },
    });
    t.addCommand({
      id: "app:open-help",
      name: i18nProxy.commands.openHelp(),
      icon: "question-mark-glyph",
      callback: this.openHelp.bind(this),
      hotkeys: [BO([], "F1")],
    });
    t.addCommand({
      id: "app:reload",
      name: i18nProxy.commands.reload(),
      icon: "lucide-rotate-ccw",
      callback: function () {
        return window.location.reload();
      },
    });
    t.addCommand({
      id: "app:show-debug-info",
      name: i18nProxy.commands.showDebugInfo(),
      callback: function () {
        return new KJ(self).open();
      },
    });
    Platform.isDesktopApp &&
      (t.addCommand({
        id: "app:open-sandbox-vault",
        name: i18nProxy.commands.openSandboxVault(),
        callback: function () {
          electron.ipcRenderer.sendSync("sandbox");
        },
      }),
      t.addCommand({
        id: "window:toggle-always-on-top",
        name: i18nProxy.commands.alwaysOnTop(),
        checkCallback: function (e) {
          if (activeWindow !== window) {
            var t = activeWindow.electronWindow;
            if (!t.isMaximized()) {
              e || t.setAlwaysOnTop(!t.isAlwaysOnTop());
              return !0;
            }
          }
          return !1;
        },
      }),
      t.addCommand({
        id: "window:zoom-in",
        name: i18nProxy.commands.zoomIn(),
        callback: function () {
          var e = electron.webFrame.getZoomLevel();
          if (e < 3) {
            electron.webFrame.setZoomLevel(e + 0.5);
          }
        },
      }),
      t.addCommand({
        id: "window:zoom-out",
        name: i18nProxy.commands.zoomOut(),
        callback: function () {
          var e = electron.webFrame.getZoomLevel();
          if (e > -2.5) {
            electron.webFrame.setZoomLevel(e - 0.5);
          }
        },
      }),
      t.addCommand({
        id: "window:reset-zoom",
        name: i18nProxy.commands.resetZoom(),
        callback: function () {
          electron.webFrame.setZoomLevel(0);
        },
      }));
    t.addCommand({
      id: "file-explorer:new-file",
      name: i18nProxy.plugins.fileExplorer.actionCreateNote(),
      icon: "lucide-file-plus",
      callback: function () {
        return self.fileManager.createAndOpenMarkdownFile("", "tab");
      },
      hotkeys: [BO(["Mod"], "N")],
    });
    t.addCommand({
      id: "file-explorer:new-file-in-current-tab",
      name: i18nProxy.plugins.fileExplorer.actionCreateNoteInCurrentTab(),
      icon: "lucide-file-plus",
      callback: function () {
        return self.fileManager.createAndOpenMarkdownFile("", !1);
      },
    });
    t.addCommand({
      id: "file-explorer:new-file-in-new-pane",
      name: i18nProxy.plugins.fileExplorer.actionCreateNoteToTheRight(),
      icon: "lucide-file-plus",
      callback: function () {
        return self.fileManager.createAndOpenMarkdownFile("", "split");
      },
      hotkeys: [BO(["Mod", "Shift"], "N")],
    });
    t.addCommand({
      id: "open-with-default-app:open",
      name: Platform.isMobileApp
        ? i18nProxy.plugins.openWithDefaultApp.actionOpenFileMobile()
        : i18nProxy.plugins.openWithDefaultApp.actionOpenFile(),
      icon: "lucide-arrow-up-right",
      checkCallback: function (t) {
        var n = self.workspace.getActiveFile();
        if (n) {
          t || self.openWithDefaultApp(n.path);
          return !0;
        }
      },
    });
    t.addCommand({
      id: "file-explorer:move-file",
      name: i18nProxy.plugins.fileExplorer.commandMoveFile(),
      icon: "lucide-folder-tree",
      checkCallback: function (t) {
        var n = self.workspace.getActiveFile();
        if (n) {
          t || new JJ(self, [n]).open();
          return !0;
        }
      },
    });
    t.addCommand({
      id: "file-explorer:duplicate-file",
      name: Platform.isMacOS
        ? i18nProxy.plugins.fileExplorer.commandMakeACopyMac()
        : i18nProxy.plugins.fileExplorer.commandMakeACopy(),
      icon: "lucide-files",
      checkCallback: (checking) => {
        const file = this.workspace.getActiveFile();
        if (file) {
          if (!checking) {
            (async () => {
              const newPath = this.vault.getAvailablePath($c(file.path), file.extension);
              const newFile = await this.vault.copy(file, newPath);
              this.workspace.getLeaf("tab").openFile(newFile, {
                active: true,
                eState: {
                  rename: "all",
                },
              });
            })();
          }
          return true;
        }
      },
    });
    Platform.isDesktopApp &&
      t.addCommand({
        id: "open-with-default-app:show",
        name: Platform.isMacOS
          ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac()
          : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(),
        icon: "lucide-files",
        checkCallback: function (t) {
          var n = self.workspace.getActiveFile();
          if (n) {
            t || self.showInFolder(n.path);
            return !0;
          }
        },
      });
    (function (self) {
      var t = this,
        commands = self.commands;
      function i() {
        var t = self.vault.getConfig("foldHeading"),
          n = self.vault.getConfig("foldIndent");
        return t || n;
      }
      commands.addCommand({
        id: "editor:toggle-source",
        name: i18nProxy.commands.toggleSourceMode(),
        icon: "lucide-code-2",
        checkCallback: function (t) {
          var n = self.workspace.activeEditor;
          if (n instanceof MarkdownView && n.currentMode === n.editMode) {
            if (!t) {
              var i = n.leaf,
                state = n.getState();
              state.source = !state.source;
              i.setViewState({
                type: typef00,
                state: state,
                active: !0,
              });
              self.workspace.requestSaveLayout();
            }
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:open-search",
        name: i18nProxy.commands.searchCurrentFile(),
        icon: "lucide-search",
        checkCallback: function (t) {
          var n,
            i = self.workspace.activeEditor;
          if (i && WO(i)) {
            t || i.showSearch(!1);
            return !0;
          }
          var r = (n = self.workspace.activeLeaf) === null || undefined === n ? undefined : n.view;
          return r && WO(r) ? (t || r.showSearch(!1), !0) : undefined;
        },
        hotkeys: [BO(["Mod"], "F")],
      });
      commands.addCommand({
        id: "editor:open-search-replace",
        name: i18nProxy.commands.searchReplaceCurrentFile(),
        icon: "lucide-search",
        checkCallback: function (t) {
          var n = self.workspace.activeEditor;
          if (n && n.getMode() === "source") {
            t || n.showSearch(!0);
            return !0;
          }
        },
        hotkeys: [isMacOS ? BO(["Mod", "Alt"], "F") : BO(["Mod"], "H")],
      });
      commands.addCommand({
        id: "editor:focus",
        name: i18nProxy.commands.focusEditor(),
        checkCallback: function (t) {
          var n = self.workspace.getActiveViewOfType(MarkdownView);
          if (!n) {
            var i = null;
            self.workspace.iterateAllLeaves(function (e) {
              if (e.view instanceof MarkdownView && (!i || i.activeTime < e.activeTime)) {
                i = e;
              }
            });
            i && (n = i.view);
          }
          if (n) {
            t || n.editor.focus();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:toggle-fold-properties",
        name: i18nProxy.commands.toggleFoldProperties(),
        icon: "lucide-diff",
        checkCallback: function (t) {
          var n = JT(self.workspace);
          if (n) {
            t || n.toggleCollapse();
            return !0;
          }
          var i = self.workspace.activeEditor;
          return (i == null ? undefined : i.getMode()) === "source"
            ? (t || i.editMode.toggleFoldFrontmatter(), !0)
            : undefined;
        },
      });
      commands.addCommand({
        id: "editor:toggle-fold",
        name: i18nProxy.commands.toggleFold(),
        icon: "lucide-diff",
        allowProperties: true,
        editorCheckCallback: function (e, t, n) {
          return t.hasFocus()
            ? !!i() && (e || t.exec("toggleFold"), !0)
            : QT(n)
              ? (e || n.metadataEditor.toggleCollapse(), !0)
              : undefined;
        },
      });
      commands.addCommand({
        id: "editor:fold-all",
        name: i18nProxy.commands.foldAll(),
        icon: "lucide-minimize-2",
        allowPreview: true,
        allowProperties: true,
        editorCheckCallback: function (e, t, n) {
          if ((QT(n) && (e || n.collapseProperties(!0)), i()))
            return n instanceof MarkdownView && n.getMode() === "preview"
              ? (e || n.previewMode.foldAll(), !0)
              : (e || t.exec("foldAll"), !0);
        },
      });
      commands.addCommand({
        id: "editor:unfold-all",
        name: i18nProxy.commands.unfoldAll(),
        icon: "lucide-maximize-2",
        allowPreview: true,
        allowProperties: true,
        editorCheckCallback: function (e, t, n) {
          if ((QT(n) && (e || n.collapseProperties(!1)), i()))
            return n instanceof MarkdownView && n.getMode() === "preview"
              ? (e || n.previewMode.unfoldAll(), !0)
              : (e || t.exec("unfoldAll"), !0);
        },
      });
      commands.addCommand({
        id: "editor:fold-less",
        name: i18nProxy("commands.fold-less"),
        icon: "lucide-unfold-vertical",
        editorCallback: function (e) {
          return e.foldLess();
        },
      });
      commands.addCommand({
        id: "editor:fold-more",
        name: i18nProxy.commands.foldMore(),
        icon: "lucide-fold-vertical",
        editorCallback: function (e) {
          return e.foldMore();
        },
      });
      commands.addCommand({
        id: "editor:insert-wikilink",
        name: i18nProxy.setting.mobileToolbar.optionInternalLink(),
        icon: "bracket-glyph",
        editorCallback: function (e) {
          if (e instanceof uK) {
            e.triggerWikilink(!1);
          }
        },
      });
      commands.addCommand({
        id: "editor:insert-embed",
        name: i18nProxy.setting.mobileToolbar.optionInternalEmbed(),
        icon: "lucide-sticky-note",
        editorCallback: function (e) {
          if (e instanceof uK) {
            e.triggerWikilink(!0);
          }
        },
      });
      commands.addCommand({
        id: "editor:insert-link",
        name: i18nProxy.commands.insertLink(),
        icon: "lucide-link",
        editorCallback: function (e) {
          if (e instanceof uK) {
            e.insertMarkdownLink();
          }
        },
        hotkeys: [BO(["Mod"], "K")],
      });
      commands.addCommand({
        id: "editor:insert-tag",
        name: i18nProxy.setting.mobileToolbar.optionTag(),
        icon: "lucide-tag",
        editorCallback: function (e) {
          var t = e.getCursor("from");
          e.replaceRange("#", t, t, "input.autocomplete");
          e.setSelection(Tb(t, 1));
        },
      });
      var r = false;
      commands.addCommand({
        id: "editor:set-heading",
        name: i18nProxy.setting.mobileToolbar.optionHeading(),
        icon: "heading-glyph",
        editorCallback: function (e) {
          if (!r) {
            r = true;
            Platform.isPhone && e.blur();
            for (
              var t = new Menu(),
                n = function (level) {
                  var i =
                      level === 0
                        ? i18nProxy.editor.headingSuggestion.labelNoHeading()
                        : i18nProxy.editor.headingSuggestion.labelHeadingLevel({
                            level: level,
                          }),
                    r = level === 0 ? "lucide-type" : "lucide-heading-" + level;
                  t.addItem(function (t) {
                    return t
                      .setIcon(r)
                      .setTitle(i)
                      .onClick(function () {
                        return e.setHeading(level);
                      });
                  });
                },
                i = 0,
                o = [0, 1, 2, 3, 4, 5, 6];
              i < o.length;
              i++
            )
              n(o[i]);
            t.onHide(function () {
              r = false;
              Platform.isPhone && e.focus();
            });
            var a = e.coordsAtPos(e.getCursor());
            t.showAtPosition({
              x: a.left,
              y: a.top,
            });
          }
        },
      });
      commands.addCommand({
        id: "editor:set-heading-0",
        name: i18nProxy.commands.removeHeading(),
        icon: "heading-glyph",
        editorCallback: function (e) {
          return e.setHeading(0);
        },
      });
      for (
        var o = function (level) {
            commands.addCommand({
              id: "editor:set-heading-".concat(level),
              name: i18nProxy.commands.toggleHeading({
                level: level,
              }),
              icon: "heading-glyph",
              editorCallback: function (t) {
                return t.setHeading(level);
              },
            });
          },
          a = 0,
          s = [1, 2, 3, 4, 5, 6];
        a < s.length;
        a++
      )
        o(s[a]);
      commands.addCommand({
        id: "editor:toggle-bold",
        name: i18nProxy.commands.toggleBold(),
        icon: "lucide-bold",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("bold");
        },
        hotkeys: [BO(["Mod"], "B")],
      });
      commands.addCommand({
        id: "editor:toggle-italics",
        name: i18nProxy.commands.toggleItalics(),
        icon: "lucide-italic",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("italic");
        },
        hotkeys: [BO(["Mod"], "I")],
      });
      commands.addCommand({
        id: "editor:toggle-strikethrough",
        name: i18nProxy.setting.mobileToolbar.optionStrikethrough(),
        icon: "lucide-strikethrough",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("strikethrough");
        },
      });
      commands.addCommand({
        id: "editor:toggle-highlight",
        name: i18nProxy.commands.toggleHighlight(),
        icon: "lucide-highlighter",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("highlight");
        },
      });
      commands.addCommand({
        id: "editor:toggle-code",
        name: i18nProxy.setting.mobileToolbar.optionCode(),
        icon: "lucide-code-2",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("code");
        },
      });
      commands.addCommand({
        id: "editor:toggle-inline-math",
        name: i18nProxy.setting.mobileToolbar.optionInlineMath(),
        icon: "lucide-sigma",
        editorCallback: function (e) {
          return e.toggleMarkdownFormatting("math");
        },
      });
      commands.addCommand({
        id: "editor:toggle-blockquote",
        name: i18nProxy.setting.mobileToolbar.optionBlockquote(),
        icon: "lucide-quote",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.toggleBlockquote();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:toggle-comments",
        name: i18nProxy.commands.toggleComments(),
        icon: "lucide-percent",
        editorCallback: function (e) {
          return e.toggleComment();
        },
        hotkeys: [BO(["Mod"], "/")],
      });
      commands.addCommand({
        id: "editor:clear-formatting",
        name: i18nProxy.commands.clearFormatting(),
        icon: "lucide-eraser",
        editorCheckCallback: function (e, t) {
          if (t instanceof uK && t.somethingSelected()) {
            e || t.clearMarkdownFormatting();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:toggle-bullet-list",
        name: i18nProxy.setting.mobileToolbar.optionBulletList(),
        icon: "lucide-list",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.toggleBulletList();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:toggle-numbered-list",
        name: i18nProxy.setting.mobileToolbar.optionNumberedList(),
        icon: "lucide-list-ordered",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.toggleNumberList();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:toggle-checklist-status",
        name: i18nProxy.commands.toggleChecklist(),
        icon: "lucide-check-square",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.toggleCheckList();
            return !0;
          }
        },
        hotkeys: [BO(["Mod"], "l")],
      });
      commands.addCommand({
        id: "editor:cycle-list-checklist",
        name: i18nProxy.commands.cycleListChecklist(),
        icon: "lucide-check-square",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.toggleCheckList(!0);
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:insert-callout",
        name: i18nProxy.commands.insertCallout(),
        icon: "lucide-quote",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.insertCallout();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:insert-codeblock",
        name: i18nProxy.commands.insertCodeBlock(),
        icon: "lucide-code",
        editorCheckCallback: function (e, t, n) {
          if (!t.inTableCell) {
            e || t.insertCodeblock();
            return !0;
          }
        },
      });
      commands.addCommand({
        id: "editor:insert-horizontal-rule",
        name: i18nProxy.commands.insertHorizontalRule(),
        icon: "lucide-minus",
        editorCallback: function (e) {
          return e.insertHorizontalRule();
        },
      });
      commands.addCommand({
        id: "editor:insert-mathblock",
        name: i18nProxy.commands.insertMathBlock(),
        icon: "lucide-sigma-square",
        editorCallback: function (e) {
          return e.insertMathBlock();
        },
      });
      commands.addCommand({
        id: "editor:insert-table",
        name: i18nProxy.commands.insertTable(),
        icon: "lucide-table",
        editorCallback: function (e) {
          return e.insertTable();
        },
      });
      commands.addCommand({
        id: "editor:insert-footnote",
        name: i18nProxy.commands.insertFootnote(),
        icon: "lucide-file-signature",
        editorCallback: function (e) {
          return e.insertFootnote();
        },
      });
      commands.addCommand({
        id: "editor:indent-list",
        name: i18nProxy.setting.mobileToolbar.optionIndentList(),
        icon: "lucide-indent",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.indentList();
        },
      });
      commands.addCommand({
        id: "editor:unindent-list",
        name: i18nProxy.setting.mobileToolbar.optionUnindentList(),
        icon: "lucide-outdent",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.unindentList();
        },
      });
      commands.addCommand({
        id: "editor:swap-line-up",
        name: i18nProxy.commands.swapLineUp(),
        icon: "lucide-corner-right-up",
        repeatable: true,
        editorCallback: function (e) {
          return e.exec("swapLineUp");
        },
      });
      commands.addCommand({
        id: "editor:swap-line-down",
        name: i18nProxy.commands.swapLineDown(),
        icon: "lucide-corner-right-down",
        repeatable: true,
        editorCallback: function (e) {
          return e.exec("swapLineDown");
        },
      });
      commands.addCommand({
        id: "editor:undo",
        name: i18nProxy.setting.mobileToolbar.optionUndo(),
        icon: "lucide-undo-2",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.undo();
        },
      });
      commands.addCommand({
        id: "editor:redo",
        name: i18nProxy.setting.mobileToolbar.optionRedo(),
        icon: "lucide-redo-2",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.redo();
        },
      });
      commands.addCommand({
        id: "editor:move-caret-up",
        name: i18nProxy.setting.mobileToolbar.optionMoveCaretUp(),
        icon: "lucide-chevron-up",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goUp");
        },
      });
      commands.addCommand({
        id: "editor:move-caret-down",
        name: i18nProxy.setting.mobileToolbar.optionMoveCaretDown(),
        icon: "lucide-chevron-down",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goDown");
        },
      });
      commands.addCommand({
        id: "editor:move-caret-left",
        name: i18nProxy.setting.mobileToolbar.optionMoveCaretLeft(),
        icon: "lucide-chevron-left",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goLeft");
        },
      });
      commands.addCommand({
        id: "editor:move-caret-right",
        name: i18nProxy.setting.mobileToolbar.optionMoveCaretRight(),
        icon: "lucide-chevron-right",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goRight");
        },
      });
      commands.addCommand({
        id: "editor:go-start",
        name: i18nProxy.setting.mobileToolbar.optionFirstLine(),
        icon: "lucide-chevrons-up",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goStart");
        },
      });
      commands.addCommand({
        id: "editor:go-end",
        name: i18nProxy.setting.mobileToolbar.optionLastLine(),
        icon: "lucide-chevrons-down",
        mobileOnly: true,
        editorCallback: function (e) {
          return e.exec("goEnd");
        },
      });
      commands.addCommand({
        id: "editor:toggle-keyboard",
        name: i18nProxy.setting.mobileToolbar.optionToggleKeyboard(),
        icon: "keyboard-toggle",
        mobileOnly: true,
        editorCallback: function (e) {
          e.hasFocus() ? e.blur() : e.focus();
        },
      });
      commands.addCommand({
        id: "editor:configure-toolbar",
        name: i18nProxy.setting.mobileToolbar.optionConfigureToolbar(),
        icon: "lucide-wrench",
        mobileOnly: true,
        editorCallback: function () {
          var t = self.setting;
          t.openTabById("mobile");
          t.open();
        },
      });
      commands.addCommand({
        id: "editor:attach-file",
        name: i18nProxy.setting.mobileToolbar.optionAttach(),
        icon: "lucide-paperclip",
        editorCallback: function (editor) {
          var timeout;
          const doc = activeDocument;
          const input = doc.body.createEl("input", {
            type: "file",
          });
          input.style.position = "fixed";
          input.style.opacity = "0";
          input.style.zIndex = "-9999";
          input.addEventListener("change", async () => {
            cleanup();
            const files = input.files;
            if (!files) return removeInput();
            const activeFile = self.workspace.getActiveFile();
            if (!activeFile) return removeInput();
            try {
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const parsedName = getFilename(file.name);
                const buffer = await file.arrayBuffer();
                const savedFile = await self.saveAttachment(Qc(parsedName), getExtension(parsedName), buffer);
                if (savedFile) {
                  const link = self.fileManager.generateMarkdownLink(savedFile, activeFile.path);
                  editor.replaceSelection(link);
                }
              }
            } finally {
              removeInput();
            }
          });
          const cleanup = function () {
            doc.removeEventListener("focus", onFocus);
            doc.removeEventListener("click", onFocus);
            clearTimeout(timeout);
          };
          const removeInput = () => input.detach();
          const onFocus = () => {
            cleanup();
            timeout = window.setTimeout(removeInput, 5000);
          };
          input.focus();
          input.click();
          setTimeout(function () {
            doc.addEventListener("focus", onFocus);
            doc.addEventListener("click", onFocus);
          }, 0);
        },
      });
      commands.addCommand({
        id: "editor:delete-paragraph",
        name: i18nProxy.commands.deleteParagraph(),
        icon: "lucide-scissors",
        repeatable: true,
        editorCallback: function (e) {
          return e.exec("deleteLine");
        },
        hotkeys: [BO(["Mod"], "D")],
      });
      commands.addCommand({
        id: "editor:add-cursor-below",
        name: i18nProxy.commands.addCursorBelow(),
        icon: "lucide-mouse-pointer-click",
        repeatable: true,
        editorCheckCallback: function (e, t) {
          if (t instanceof uK) {
            if (!e) {
              for (var n = t.cm, i = n.state.selection, r = i.ranges[0], o = 1; o < i.ranges.length; o++) {
                var a = i.ranges[o];
                if (a.to > r.to) {
                  r = a;
                }
              }
              var s = bm(n.state.doc, r.from),
                l = ym(n.state.doc, {
                  line: s.line + 1,
                  ch: s.ch,
                });
              n.dispatch({
                selection: i.addRange(EditorSelection.cursor(l)),
                userEvent: "select",
              });
            }
            return !0;
          }
          return !1;
        },
      });
      commands.addCommand({
        id: "editor:add-cursor-above",
        name: i18nProxy.commands.addCursorAbove(),
        icon: "lucide-mouse-pointer-click",
        repeatable: true,
        editorCheckCallback: function (e, t) {
          if (t instanceof uK) {
            if (!e) {
              for (var n = t.cm, i = n.state.selection, r = i.ranges[0], o = 1; o < i.ranges.length; o++) {
                var a = i.ranges[o];
                if (a.from < r.from) {
                  r = a;
                }
              }
              var s = bm(n.state.doc, r.from),
                l = ym(n.state.doc, {
                  line: s.line - 1,
                  ch: s.ch,
                });
              n.dispatch({
                selection: i.addRange(EditorSelection.cursor(l)),
                userEvent: "select",
              });
            }
            return !0;
          }
          return !1;
        },
      });
      commands.addCommand({
        id: "editor:toggle-spellcheck",
        name: i18nProxy.commands.toggleSpellcheck(),
        callback: function () {
          self.vault.setConfig("spellcheck", !self.vault.getConfig("spellcheck"));
        },
      });
      var l = function (e, command, icon, r, o) {
        commands.addCommand({
          id: "editor:table-" + e,
          name: i18nProxy.table.labelCommand({
            command: command,
          }),
          icon: icon,
          editorCheckCallback: function (e, t) {
            if (!(t instanceof uK && t.editorComponent.tableCell)) return !1;
            var n = t.editorComponent.tableCell;
            return e ? !o || o(n) : (r(n), !0);
          },
        });
      };
      l("row-before", i18nProxy.table.actionRowBefore(), "lucide-arrow-up", function (e) {
        var t = e.table,
          n = e.cell;
        t.insertRow(n.row, n.col);
      });
      l("row-after", i18nProxy.table.actionRowAfter(), "lucide-arrow-down", function (e) {
        var t = e.table,
          n = e.cell;
        t.insertRow(n.row + 1, n.col);
      });
      l(
        "row-up",
        i18nProxy.table.actionRowUp(),
        "lucide-arrow-up",
        function (e) {
          var t = e.table,
            n = e.cell;
          t.moveRow(n.row, n.row - 1, n.col);
        },
        function (e) {
          return e.cell.row > 0;
        },
      );
      l(
        "row-down",
        i18nProxy.table.actionRowDown(),
        "lucide-arrow-down",
        function (e) {
          var t = e.table,
            n = e.cell;
          t.moveRow(n.row, n.row + 1, n.col);
        },
        function (e) {
          var t = e.table;
          return e.cell.row < t.rows.length - 1;
        },
      );
      l("row-copy", i18nProxy.table.actionDuplicateRow(), "lucide-copy", function (e) {
        var t = e.table,
          n = e.cell;
        t.insertRow(n.row, n.col, !0);
      });
      l("row-delete", i18nProxy.table.actionDeleteRow(), "lucide-trash-2", function (e) {
        var t = e.table,
          n = e.cell;
        t.removeRow(n.row, n.col);
      });
      l("col-before", i18nProxy.table.actionColumnBefore(), "lucide-arrow-left", function (e) {
        var t = e.table,
          n = e.cell,
          i = t.alignments[n.col];
        t.insertColumn(n.row, n.col, i);
      });
      l("col-after", i18nProxy.table.actionColumnAfter(), "lucide-arrow-right", function (e) {
        var t = e.table,
          n = e.cell,
          i = t.alignments[n.col];
        t.insertColumn(n.row, n.col + 1, i);
      });
      l(
        "col-left",
        i18nProxy.table.actionColumnLeft(),
        "lucide-arrow-left",
        function (e) {
          var t = e.table,
            n = e.cell;
          t.moveColumn(n.col, n.col - 1, n.row);
        },
        function (e) {
          return e.cell.col > 0;
        },
      );
      l(
        "col-right",
        i18nProxy.table.actionColumnRight(),
        "lucide-arrow-right",
        function (e) {
          var t = e.table,
            n = e.cell;
          t.moveColumn(n.col, n.col + 1, n.row);
        },
        function (e) {
          var t = e.table;
          return e.cell.col < t.alignments.length - 1;
        },
      );
      l("col-copy", i18nProxy.table.actionDuplicateColumn(), "lucide-copy", function (e) {
        var t = e.table,
          n = e.cell,
          i = t.alignments[n.col];
        t.insertColumn(n.row, n.col, i, !0);
      });
      l("col-delete", i18nProxy.table.actionDeleteColumn(), "lucide-trash-2", function (e) {
        var t = e.table,
          n = e.cell;
        t.removeColumn(n.row, n.col);
      });
      l("col-align-left", i18nProxy.table.actionAlignLeft(), "lucide-align-left", function (e) {
        var t = e.table,
          n = e.cell;
        t.setAlignment([n.col], "start");
      });
      l("col-align-center", i18nProxy.table.actionAlignCenter(), "lucide-align-center", function (e) {
        var t = e.table,
          n = e.cell;
        t.setAlignment([n.col], "center");
      });
      l("col-align-right", i18nProxy.table.actionAlignRight(), "lucide-align-right", function (e) {
        var t = e.table,
          n = e.cell;
        t.setAlignment([n.col], "end");
      });
      Platform.isMobileApp &&
        (commands.addCommand({
          id: "editor:cut",
          name: i18nProxy.interface.menu.cut(),
          icon: "lucide-scissors",
          editorCallback: async (e) => {
            await window.navigator.clipboard.writeText(e.getSelection());
            e.replaceSelection("");
          },
        }),
        commands.addCommand({
          id: "editor:copy",
          name: i18nProxy.interface.menu.copy(),
          icon: "lucide-copy",
          editorCallback: async (e) => {
            await window.navigator.clipboard.writeText(e.getSelection());
          },
        }),
        commands.addCommand({
          id: "editor:paste",
          name: i18nProxy.interface.menu.paste(),
          icon: "lucide-clipboard-type",
          editorCallback: async (e) => {
            const text = await window.navigator.clipboard.readText();
            e.replaceSelection(text);
          },
        }));
      commands.addCommand({
        id: "editor:context-menu",
        name: i18nProxy.commands.contextMenu(),
        icon: "lucide-menu",
        editorCallback: function (e, t) {
          if (e.editorComponent.tableCell) {
            var n = e.editorComponent.tableCell;
            t = n.owner;
            e = n.editor;
          }
          var i = e.getCursor("head"),
            r = e.coordsAtPos(i);
          if (r) {
            if (Platform.isDesktopApp) {
              var o = e.containerEl.win.electron.remote.getCurrentWebContents(),
                a = Math.pow(1.2, o.getZoomLevel()),
                s = r.left * a,
                l = ((r.top + r.bottom) / 2) * a;
              o.sendInputEvent({
                type: "mouseDown",
                x: s,
                y: l,
                button: "right",
              });
              return void o.sendInputEvent({
                type: "mouseUp",
                x: s,
                y: l,
                button: "right",
              });
            }
            t.editMode.onContextMenu(
              new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 0,
                buttons: 0,
                clientX: r.left,
                clientY: r.top,
              }),
              !0,
            );
          }
        },
      });
    })(this);
    Platform.isDesktopApp &&
      MarkdownPreviewRenderer.registerPostProcessor(function (t, n) {
        return self.fixFileLinks(t, n.sourcePath);
      });
  }
  disableCssTransition() {
    this.dom.appContainerEl.addClass("no-transition");
  }
  enableCssTransition() {
    this.dom.appContainerEl.removeClass("no-transition");
  }
  getAppTitle(e) {
    return e ? e + " - " + this.title : this.title;
  }
  getWebviewPartition() {
    return "persist:vault-" + this.appId;
  }
  fixFileLinks(e, t) {
    for (var n = 0, i = e.findAll("img, audio, video, source, iframe"); n < i.length; n++) {
      var r = i[n],
        o = r.getAttr("src");
      if (
        o &&
        (Platform.isDesktopApp && o.startsWith("file:///") && (r.src = Platform.resourcePathPrefix + o.substring(8)),
        isRelativePath(o) &&
          (r.tagName === "IMG" || r.tagName === "AUDIO" || r.tagName === "VIDEO" || r.tagName === "SOURCE"))
      ) {
        o = cleanString(safeDecodeURI(o));
        var a = this.metadataCache.getFirstLinkpathDest(o, t);
        if (a) {
          r.src = this.vault.getResourcePath(a);
        }
      }
    }
  }
  getTheme() {
    return this.customCss.isDarkMode() ? "obsidian" : "moonstone";
  }
  hangeTheme(e) {
    var t = this;
    if (e) {
      this.disableCssTransition();
      this.vault.setConfig("theme", e);
      setTimeout(function () {
        t.enableCssTransition();
      }, 200);
    }
  }
  updateTheme() {
    var e = this.vault.getConfig("theme"),
      t = e === "system",
      n = e === "obsidian";
    if (t) {
      n = window.matchMedia("(prefers-color-scheme: dark)").matches;
      !Platform.isDesktopApp ||
        Platform.isMacOS ||
        Platform.isWin ||
        (n = window.electron.remote.nativeTheme.shouldUseDarkColors);
    }
    var i = document.body,
      r = false;
    if (
      (i.hasClass("theme-light") !== !n && (i.toggleClass("theme-light", !n), (r = true)),
      i.hasClass("theme-dark") !== n && (i.toggleClass("theme-dark", n), (r = true)),
      r && this.workspace.trigger("css-change"),
      Platform.isMobileApp)
    )
      if (
        (statusBarPlugin.setStyle({
          style: n ? KeyboardStyle.Dark : KeyboardStyle.Light,
        }),
        Platform.isAndroidApp)
      ) {
        var o = LT("--system-status-background");
        if (!(o && o.a !== 0)) {
          o = ET(getComputedStyle(document.body).backgroundColor);
        }
        var color = o ? DT(o) : n ? "#161616" : "#f2f3f5";
        statusBarPlugin.setBackgroundColor({
          color: color,
        });
      } else if (Platform.isIosApp) {
        keyboardPlugin.setStyle({
          style: t ? M.Default : n ? M.Dark : M.Light,
        });
        t || clearFocusAndSelection();
      }
  }
  updateInlineTitleDisplay() {
    document.body.toggleClass("show-inline-title", this.vault.getConfig("showInlineTitle"));
  }
  updateViewHeaderDisplay() {
    document.body.toggleClass("show-view-header", this.vault.getConfig("showViewHeader"));
  }
  updateRibbonDisplay() {
    document.body.toggleClass("show-ribbon", this.vault.getConfig("showRibbon"));
  }
  updateFontFamily() {
    var e = B7(this.vault.getConfig("interfaceFontFamily"));
    document.body.style.setProperty("--font-interface-override", V7(e));
    var t = B7(this.vault.getConfig("textFontFamily"));
    document.body.style.setProperty("--font-text-override", V7(t));
    t
      ? document.body.style.setProperty("--font-print-override", V7(t))
      : document.body.style.removeProperty("--font-print-override");
    var n = B7(this.vault.getConfig("monospaceFontFamily"));
    document.body.style.setProperty("--font-monospace-override", V7(n));
    this.workspace.trigger("css-change");
  }
  updateFontSize() {
    var e = this.vault.getConfig("baseFontSize");
    e = Math.clamp(e, 10, 30);
    document.body.style.setProperty("--font-text-size", "".concat(e, "px"));
    document.documentElement.style.setProperty("font-size", "".concat(e, "px"));
    this.workspace.trigger("css-change");
  }
  updateUseNativeMenu() {
    var useNativeMenu = this.vault.getConfig("nativeMenus");
    Platform.isMacOS && useNativeMenu === null && (useNativeMenu = true);
    Menu.useNativeMenu = useNativeMenu;
  }
  updateTabSize() {
    var e = this.vault.getConfig("tabSize");
    document.body.style.setProperty("--indent-size", String(e));
  }
  showReleaseNotes(currentVersion) {
    if (Platform.isDesktopApp) {
      this.workspace.getLeaf(!0).setViewState({
        type: typenQ0,
        active: true,
        state: {
          currentVersion: currentVersion,
        },
      });
    }
  }
  updateAccentColor() {
    var e = this.vault.getConfig("accentColor");
    this.setAccentColor(e);
  }
  getAccentColor() {
    var e,
      t,
      n,
      i = this.vault.getConfig("accentColor"),
      r = document.body;
    if (!i) {
      var o = getComputedStyle(r),
        a = o.getPropertyValue("--accent-h"),
        s = o.getPropertyValue("--accent-s"),
        l = o.getPropertyValue("--accent-l");
      return DT(
        MT(
          ((e = a),
          (n = l),
          (t = s).endsWith("%") && (t = t.slice(0, -1)),
          e.endsWith("%") && (e = e.slice(0, -1)),
          {
            h: parseInt(e),
            s: parseInt(t),
            l: parseInt(n),
          }),
        ),
      );
    }
    return i;
  }
  setAccentColor(e) {
    const body = document.body;
    if (!e) {
      body.style.removeProperty("--text-on-accent");
      body.style.removeProperty("--accent-h");
      body.style.removeProperty("--accent-s");
      body.style.removeProperty("--accent-l");
      return;
    }
    var n = AT(e);
    if (!n) {
      body.style.removeProperty("--text-on-accent");
      body.style.removeProperty("--accent-h");
      body.style.removeProperty("--accent-s");
      void body.style.removeProperty("--accent-l");
      return;
    }
    var i = xT(n),
      r = i.h,
      o = i.s,
      a = i.l;
    body.style.setProperty("--accent-h", String(r));
    body.style.setProperty("--accent-s", "".concat(o, "%"));
    body.style.setProperty("--accent-l", "".concat(a, "%"));
    OT(n)
      ? body.style.setProperty("--text-on-accent", "var(--text-on-accent-inverted)")
      : body.style.removeProperty("--text-on-accent");
  }
  garbleText() {
    this.dom.appContainerEl.addClass("is-text-garbled");
  }
  async importAttachments(files, folder) {
    if (files.length === 0) return [];
    const vault = this.vault;
    const result = [];
    for (const file of files) {
      let { name, extension, filepath, data } = file;
      if (filepath && (destPath = vault.resolveFilePath(filepath))) {
        result.push(destPath);
        continue;
      }
      const buffer = await data;
      if (!buffer) continue;
      if (name !== "Pasted image") {
        continue;
      }
      name += " " + window.moment().format("YYYYMMDDHHmmss");
      if (folder) {
        const availablePath = vault.getAvailablePath(folder.getParentPrefix() + name, extension);
        destPath = await vault.createBinary(availablePath, buffer);
      } else {
        destPath = await this.saveAttachment(name, extension, buffer);
      }
      result.push(destPath);
    }
    return result;
  }
  async saveAttachment(name, extension, data) {
    const activeFile = this.workspace.getActiveFile();
    const path = await this.vault.getAvailablePathForAttachments(name, extension, activeFile);
    return await this.vault.createBinary(path, data);
  }
  openVaultChooser(e) {
    Platform.isDesktopApp
      ? (callbackWithElectron(function (e) {
          e.ipcRenderer.sendSync("starter");
        }),
        e && window.close())
      : Platform.isMobileApp &&
        (localStorage.removeItem("mobile-selected-vault"),
        setTimeout(function () {
          location.reload();
        }, 500));
  }
  openHelp() {
    Platform.isDesktopApp
      ? callbackWithElectron(function (e) {
          e.ipcRenderer.sendSync("help");
        })
      : window.open("https://help.obsidian.md/", "_blank");
  }
  async openWithDefaultApp(path) {
    const adapter = this.vault.adapter;
    if (Platform.isDesktopApp && adapter instanceof FileSystemAdapter) {
      const fullPath = adapter.getFullPath(path);
      callbackWithElectron((electron) => {
        const shell = electron.shell;
        if (shell) shell.openPath ? shell.openPath(fullPath) : shell.openItem(fullPath);
      });
    } else if (Platform.isMobileApp && isNotWeb && adapter instanceof CapacitorAdapter) {
      try {
        await adapter.open(path);
      } catch (err) {
        new Notice(
          err.message ||
            i18nProxy.interface.msgFailedToLoadFile({
              filepath: path,
            }),
        );
      }
    }
  }
  async showInFolder(path) {
    if (Platform.isDesktopApp) {
      const adapter = this.vault.adapter;
      if (adapter instanceof FileSystemAdapter) {
        const fullPath = adapter.getFullPath(path);
        const exists = await adapter.exists(path);
        if (exists) showItemInFolderSetup(fullPath);
        else
          new Notice(
            i18nProxy.dialogue.msgFileOrFolderNotFound({
              path: fullPath,
            }),
          );
      }
    }
  }
  getObsidianUrl(e) {
    var t = this.vault.getName(),
      n = ou(e.path);
    return "obsidian://open?vault=" + encodeURIComponent(t) + "&file=" + encodeURIComponent(n);
  }
  copyObsidianUrl(e) {
    vc(this.getObsidianUrl(e));
    new Notice(
      i18nProxy.interface.copied({
        item: i18nProxy.interface.url(),
      }),
    );
  }
  registerQuitHook() {
    const self = this;
    window.onbeforeunload = function (event) {
      window.onbeforeunload = null;

      const workspace = self.workspace;
      if (!workspace) return;
      const quitEvent = new ux();
      workspace.trigger("quit", quitEvent);
      if (quitEvent.isEmpty()) return;
      event.preventDefault();
      event.returnValue = "Saving...";
      nJ.instance.show().setMessage("Saving...");
      (async () => {
        await quitEvent.promise();
        window.close();
      })();
    };
  }
  loadLocalStorage(key) {
    try {
      const value = localStorage.getItem(`${this.appId}-${key}`);
      if (value) return JSON.parse(value);
    } catch (e) {}
    return null;
  }
  saveLocalStorage(key, value) {
    try {
      value
        ? localStorage.setItem(`${this.appId}-${key}`, JSON.stringify(value))
        : localStorage.removeItem(`${this.appId}-${key}`);
    } catch (e) {}
  }
  on() {}
  setTheme() {
    const self = this;
    setTimeout(() => self.updateTheme());
  }
  emulateMobile(enable) {
    enable ? (localStorage[emulateMobileLiteralString] = 1) : delete localStorage[emulateMobileLiteralString];
    window.location.reload();
  }
  debugMode(enable) {
    const config = enable ? "1" : null;
    this.saveLocalStorage(debugModeLiteralString, config);
    !enable && localStorage.removeItem(debugModeLiteralString);
    window.location.reload();
  }
  static getOverrideConfigDir(name) {
    var path = localStorage.getItem(name + "-config");
    return path && String.isString(path) ? path : null;
  }
  getSpellcheckLanguages() {
    var e = this.vault.getConfig("spellcheckLanguages"),
      t = localStorage.getItem("spellcheck-languages");
    if ((t && e && this.vault.setConfig("spellcheckLanguages", null), t))
      try {
        var n = JSON.parse(t);
        if (Array.isArray(n)) {
          e = n;
        }
      } catch (e) {}
    else localStorage.setItem("spellcheck-languages", JSON.stringify(e));
    return e;
  }
  setSpellcheckLanguages(e) {
    this.vault.getConfig("spellcheckLanguages") && this.vault.setConfig("spellcheckLanguages", null);
    e && e.length > 0
      ? localStorage.setItem("spellcheck-languages", JSON.stringify(e))
      : localStorage.removeItem("spellcheck-languages");
    Platform.isDesktopApp && setSpellCheckerLanguages(e);
  }
  isVimEnabled() {
    return Platform.isMobile ? !!localStorage.getItem("vim") : this.vault.getConfig("vimMode");
  }
}
(!async function () {
  // 初始化平台标志
  Platform.isDesktopApp = true;
  Platform.isDesktop = true;
  Platform.hasPhysicalKeyboard = true;
  timeSampling("initialization");
  await prepare;

  // 加载模块
  const electronInstance = loadModule("electron");
  const vaultInstance = electronInstance.ipcRenderer.sendSync("vault");
  const vaultId = vaultInstance.id;
  const vaultPath = vaultInstance.path;

  // 验证保险库路径
  if (!vaultPath || !loadModule("original-fs").existsSync(vaultPath)) {
    electronInstance.ipcRenderer.sendSync("starter");
    window.close();
    return;
  }

  // 重写 clipboard API
  try {
    const originalClipboard = navigator.clipboard;
    originalClipboard.readText = async function () {
      return window.electron.clipboard.readText();
    };
    originalClipboard.writeText = async function (text) {
      window.electron.clipboard.writeText(text);
    };
    Object.defineProperty(navigator, "clipboard", {
      get: function () {
        if (activeWindow === window) return originalClipboard;
        const winClipboard = activeWindow.navigator.clipboard;
        winClipboard.readText = originalClipboard.readText;
        winClipboard.writeText = originalClipboard.writeText;
        return winClipboard;
      },
    });
  } catch (e) {}

  // Linux 平台鼠标中键处理
  if (Platform.isLinux) {
    window.addEventListener("mousedown", function (e) {
      if (e.button === 1) {
        const win = e.win,
          doc = win.document,
          activeEl = doc.activeElement,
          originalEvent = e;
        let shouldPrevent = false;
        const onMouseUp = function (e) {
          if (e.button === 1) {
            win.removeEventListener("mouseup", onMouseUp);
            if (originalEvent.defaultPrevented) {
              e.preventDefault();
            } else if (doc.activeElement !== activeEl || shouldPrevent) {
              e.preventDefault();
            } else {
              const onAuxClick = function (e) {
                if (!e.defaultPrevented) cleanup();
              };
              const onPaste = function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
              };
              const cleanup = function () {
                win.removeEventListener("auxclick", onAuxClick);
                win.removeEventListener("paste", onPaste, {
                  capture: true,
                });
                win.clearTimeout(timeoutId);
              };
              win.addEventListener("auxclick", onAuxClick);
              win.addEventListener("paste", onPaste, {
                capture: true,
              });
              timeoutId = win.setTimeout(cleanup, 100);
            }
          }
        };
        win.addEventListener("mouseup", onMouseUp);
        if (activeEl && activeEl.instanceOf(HTMLElement) && activeEl !== doc.body) {
          let node = e.targetNode;
          if (activeEl.contains(node)) {
            if (!activeEl.instanceOf(HTMLInputElement)) {
              for (; node && node !== activeEl; ) {
                if (node.instanceOf(HTMLElement)) {
                  if (node.contentEditable === "false") {
                    shouldPrevent = true;
                    break;
                  }
                  if (node.contentEditable === "true") break;
                }
                node = node.parentElement;
              }
            }
          } else {
            activeEl.blur();
          }
        } else {
          shouldPrevent = true;
        }
      }
    });
  }

  // 初始化其他模块
  AK(window);
  C9(window);
  SK(window);
  const fileSystemAdapter = new FileSystemAdapter(vaultPath);
  document.title = getFilename(normalizePath(vaultPath)) + " - Obsidian v" + electronInstance.ipcRenderer.sendSync("version");

  // 应用初始化
  ready(async function () {
    window.app = new App(fileSystemAdapter, vaultId);
  });
})();
