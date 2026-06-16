var Y1 = (function () {
    function e(app) {
      this.manifests = {};
      this.plugins = {};
      this.enabledPlugins = new Set();
      this.updates = {};
      this.requestSaveConfig = debounce(this.saveConfig, 1e3);
      this.app = app;
      this.app.vault.on("raw", this.onRaw.bind(this));
    }
    e.prototype.onRaw = function (e) {
      if (e.startsWith(this.app.vault.configDir)) {
        var t = getFilename(Zc(e));
        if (this.enabledPlugins.has(t) && e === "".concat(this.getPluginFolder(), "/").concat(t, "/data.json")) {
          var n = this.plugins[t];
          if (n) {
            n.onConfigFileChange();
          }
        }
      }
    };
    e.prototype.loadManifests = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, dir, s, l, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              e = this.app.vault.adapter;
              t = this.manifests = {};
              n = this.getPluginFolder();
              return [4, e.exists(n)];
            case 1:
              return p.sent() ? [4, e.list(n)] : [3, 10];
            case 2:
              i = p.sent();
              r = 0;
              o = i.folders;
              p.label = 3;
            case 3:
              if (!(r < o.length)) return [3, 10];
              dir = o[r];
              p.label = 4;
            case 4:
              p.trys.push([4, 8, , 9]);
              s = dir + "/" + F1;
              return [4, e.exists(s)];
            case 5:
              return p.sent() ? ((u = (c = JSON).parse), [4, e.read(s)]) : [3, 7];
            case 6:
              if (!(l = u.apply(c, [p.sent()])).id) return [3, 9];
              l.dir = dir;
              (l.author && l.author.toLowerCase() !== "obsidian") || (l.author = "");
              t[l.id] = l;
              p.label = 7;
            case 7:
              return [3, 9];
            case 8:
              h = p.sent();
              console.error(h);
              return [3, 9];
            case 9:
              r++;
              return [3, 3];
            case 10:
              return [2];
          }
        });
      });
    };
    e.prototype.loadManifest = function (dir) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = this.app.vault.adapter;
              n = this.manifests;
              l.label = 1;
            case 1:
              l.trys.push([1, 5, , 6]);
              i = dir + "/" + F1;
              return [4, t.exists(i)];
            case 2:
              return l.sent() ? ((a = (o = JSON).parse), [4, t.read(i)]) : [3, 4];
            case 3:
              if (!(r = a.apply(o, [l.sent()])).id) return [2];
              r.dir = dir;
              (r.author && r.author.toLowerCase() !== "obsidian") || (r.author = "");
              n[r.id] = r;
              l.label = 4;
            case 4:
              return [3, 6];
            case 5:
              s = l.sent();
              console.error(s);
              return [3, 6];
            case 6:
              return [2];
          }
        });
      });
    };
    e.prototype.loadPlugin = function (e) {
      return __awaiter(this, arguments, Promise, function (e, t) {
        var n, i, r, o, a, s, l, c, u, h;
        undefined === t && (t = false);
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              return this.isEnabled()
                ? (n = this.plugins[e])
                  ? [2, n]
                  : (i = this.manifests[e])
                    ? [4, this.app.vault.adapter.read(i.dir + "/" + N1)]
                    : [2, null]
                : [2];
            case 1:
              if (
                ((r = p.sent()),
                runDebugMode || (r = (d = r).endsWith(K1) ? d : d.replace(G1, "")),
                (o = e),
                (a = document.body.hasClass("emulate-mobile")),
                (s = function (e) {
                  return W1.hasOwnProperty(e)
                    ? (console.error(
                        new Error("[CM6][".concat(o, '] Using a deprecated package: "').concat(e, '".\n').concat(B1)),
                      ),
                      W1[e])
                    : q1.hasOwnProperty(e)
                      ? q1[e]
                      : a
                        ? (new Notice("".concat(o, ' attempted to load NodeJS package: "').concat(e, '"')),
                          console.error(
                            new Error("[".concat(o, '] Attempting to load NodeJS package: "').concat(e, '"')),
                          ),
                          null)
                        : loadModule(e);
                }),
                (c = {
                  exports: (l = {}),
                }),
                (u = (function (e, t) {
                  return window.eval(
                    "(function anonymous(require,module,exports){".concat(e, "\n})\n//# sourceURL=").concat(t, "\n"),
                  );
                })(r, "plugin:" + encodeURIComponent(e))),
                u(s, c, l),
                !(h = (l = c.exports || l).default || c.exports))
              )
                throw new Error("Failed to load plugin " + e + ". No exports detected.");
              if (!((n = new h(this.app, i)) instanceof Plugin)) throw new Error("Failed to load plugin " + e);
              this.plugins[e] = n;
              return [4, n.load()];
            case 2:
              p.sent();
              return [4, n.loadCSS()];
            case 3:
              p.sent();
              t && n.onUserEnable();
              return [2, n];
          }
          var d;
        });
      });
    };
    e.prototype.unloadPlugin = function (e) {
      return __awaiter(this, arguments, undefined, function (e, _userDisabled) {
        var n;
        undefined === _userDisabled && (_userDisabled = false);
        return __generator(this, function (i) {
          return (n = this.plugins[e])
            ? ((n._userDisabled = _userDisabled), n.unload(), delete this.plugins[e], [2])
            : [2];
        });
      });
    };
    e.prototype.initialize = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          r,
          o,
          a,
          s,
          l = this;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              return [4, (e = this.app).vault.readConfigJson("community-plugins")];
            case 1:
              ((t = c.sent()) && Array.isArray(t)) || (t = []);
              this.enabledPlugins = new Set(t);
              return [4, this.loadManifests()];
            case 2:
              if ((c.sent(), (n = this.manifests), Object.keys(n).length === 0)) return [2];
              if (!this.isEnabled()) {
                localStorage.getItem("enable-plugin-" + this.app.appId) === null && new Z1(e).open();
                return [2];
              }
              timeSampling("communityPlugins");
              i = function (plugin) {
                var t;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return n.hasOwnProperty(plugin)
                        ? ((t = window.setTimeout(function () {
                            nJ.instance.setContext(function (t) {
                              t.createDiv({
                                text: i18nProxy.interface.startUp.msgPluginHang({
                                  plugin: plugin,
                                }),
                              });
                              t.createDiv("progress-bar-context-button", function (t) {
                                t.createEl(
                                  "button",
                                  {
                                    text: i18nProxy.setting.thirdPartyPlugin.buttonDisable(),
                                  },
                                  function (t) {
                                    t.onClickEvent(function () {
                                      return __awaiter(l, undefined, undefined, function () {
                                        return __generator(this, function (t) {
                                          switch (t.label) {
                                            case 0:
                                              this.enabledPlugins.delete(plugin);
                                              return [4, this.saveConfig()];
                                            case 1:
                                              t.sent();
                                              window.location.reload();
                                              return [2];
                                          }
                                        });
                                      });
                                    });
                                  },
                                );
                              });
                            });
                          }, 3e3)),
                          [4, r.enablePlugin(plugin)])
                        : [3, 2];
                    case 1:
                      i.sent();
                      nJ.instance.clearContext();
                      clearTimeout(t);
                      i.label = 2;
                    case 2:
                      return [2];
                  }
                });
              };
              r = this;
              o = 0;
              a = t;
              c.label = 3;
            case 3:
              return o < a.length ? ((s = a[o]), [5, i(s)]) : [3, 6];
            case 4:
              c.sent();
              c.label = 5;
            case 5:
              o++;
              return [3, 3];
            case 6:
              this.requestSaveConfig();
              this.checkForDeprecations();
              setInterval(function () {
                return l.checkForDeprecations();
              }, 432e5);
              return [2];
          }
        });
      });
    };
    e.prototype.getPluginFolder = function () {
      return "".concat(this.app.vault.configDir, "/plugins");
    };
    e.prototype.enablePlugin = function (e) {
      return __awaiter(this, arguments, Promise, function (loadingPluginId, t) {
        var n, i;
        undefined === t && (t = false);
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              if (!(n = this.manifests[loadingPluginId])) return [2, !1];
              if (
                this.isDeprecated(n) ||
                (n.id === "cmdr" && pG(n.version, "0.5.4")) ||
                (n.id === "obsidian-image-toolkit" && pG(n.version, "1.4.3"))
              ) {
                new Notice(
                  "Unable to load plugin "
                    .concat(n.name, " v")
                    .concat(
                      n.version,
                      ". This version has been reported to cause issues. Please check for a newer version of the plugin.",
                    ),
                );
                return [2, !1];
              }
              if (n.id === "better-pdf-plugin" && n.version === "1.4.0") {
                new Notice("Better PDF Plugin is no longer functional. We recommend uninstalling it.", 6e3);
                return [2, !1];
              }
              if (!Platform.isDesktopApp && n.isDesktopOnly) return [2, !1];
              r.label = 1;
            case 1:
              r.trys.push([1, 3, 4, 5]);
              this.loadingPluginId = loadingPluginId;
              return [4, this.loadPlugin(loadingPluginId, t)];
            case 2:
              r.sent();
              this.loadingPluginId = null;
              return [3, 5];
            case 3:
              i = r.sent();
              this.loadingPluginId = null;
              new Notice(
                i18nProxy.interface.msgFailedToLoadPlugin({
                  plugin: loadingPluginId,
                }),
              );
              console.error("Plugin failure: " + loadingPluginId, i);
              return [2, !1];
            case 4:
              timeSampling("communityPlugins.".concat(loadingPluginId));
              return [7];
            case 5:
              return [2, !0];
          }
        });
      });
    };
    e.prototype.disablePlugin = function (e) {
      return __awaiter(this, arguments, undefined, function (e, t) {
        var n;
        undefined === t && (t = false);
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              i.trys.push([0, 2, , 3]);
              return [4, this.unloadPlugin(e, t)];
            case 1:
              i.sent();
              return [3, 3];
            case 2:
              n = i.sent();
              new Notice(
                i18nProxy.setting.thirdPartyPlugin.msgFailedToDisablePlugin({
                  id: e,
                }),
              );
              console.error("Plugin failure: " + e, n);
              return [3, 3];
            case 3:
              return [2];
          }
        });
      });
    };
    e.prototype.enablePluginAndSave = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.enablePlugin(e, !0)];
            case 1:
              return t.sent() ? (this.enabledPlugins.add(e), this.requestSaveConfig(), [2, !0]) : [2, !1];
          }
        });
      });
    };
    e.prototype.disablePluginAndSave = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.enabledPlugins.delete(e);
              this.requestSaveConfig();
              return [4, this.disablePlugin(e, !0)];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.uninstallPlugin = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return [4, this.disablePluginAndSave(e)];
            case 1:
              r.sent();
              return (t = this.manifests[e]) ? ((n = t.dir) ? [4, this.app.vault.exists(n)] : [2]) : [2];
            case 2:
              if (!r.sent()) return [2];
              r.label = 3;
            case 3:
              r.trys.push([3, 5, , 6]);
              return [4, this.app.vault.adapter.rmdir(n, !0)];
            case 4:
              r.sent();
              delete this.manifests[e];
              delete this.updates[e];
              return [3, 6];
            case 5:
              i = r.sent();
              new Notice(
                i18nProxy.setting.thirdPartyPlugin.msgFailedToUninstallPlugin({
                  id: e,
                }),
              );
              console.error("Plugin failure: " + e, i);
              return [3, 6];
            case 6:
              return [2];
          }
        });
      });
    };
    e.prototype.getPlugin = function (e) {
      return this.plugins.hasOwnProperty(e) ? this.plugins[e] : null;
    };
    e.prototype.saveConfig = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.app.vault.writeConfigJson("community-plugins", Array.from(this.enabledPlugins))];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.isEnabled = function () {
      return localStorage.getItem("enable-plugin-" + this.app.appId) === "true";
    };
    e.prototype.setEnable = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              if ((localStorage.setItem("enable-plugin-" + this.app.appId, e ? "true" : "false"), e)) return [3, 5];
              t = Object.keys(this.plugins);
              n = 0;
              i = t;
              s.label = 1;
            case 1:
              return n < i.length ? ((a = i[n]), [4, this.disablePlugin(a)]) : [3, 4];
            case 2:
              s.sent();
              s.label = 3;
            case 3:
              n++;
              return [3, 1];
            case 4:
              return [3, 9];
            case 5:
              r = 0;
              o = Array.from(this.enabledPlugins);
              s.label = 6;
            case 6:
              return r < o.length ? ((a = o[r]), [4, this.enablePlugin(a)]) : [3, 9];
            case 7:
              s.sent();
              s.label = 8;
            case 8:
              r++;
              return [3, 6];
            case 9:
              return [2];
          }
        });
      });
    };
    e.prototype.checkForDeprecations = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              if (Object.keys(this.plugins).length === 0) return [2];
              a.label = 1;
            case 1:
              a.trys.push([1, 3, , 4]);
              return [4, requestWithWrapper(t0).json];
            case 2:
              n0 = a.sent();
              return [3, 4];
            case 3:
              a.sent();
              return [3, 4];
            case 4:
              for (n in ((e = this.plugins), (t = []), e)) t.push(n);
              i = 0;
              a.label = 5;
            case 5:
              return i < t.length
                ? (n = t[i]) in e
                  ? ((r = n),
                    this.plugins.hasOwnProperty(r)
                      ? ((o = this.manifests[r] || this.plugins[r].manifest),
                        this.isDeprecated(o) ? [4, this.disablePluginAndSave(r)] : [3, 7])
                      : [3, 7])
                  : [3, 7]
                : [3, 8];
            case 6:
              a.sent();
              new Notice(
                "The plugin "
                  .concat(o.name, " v")
                  .concat(
                    o.version,
                    " has been disabled. This version has been reported to cause issues. Please check for a newer version of the plugin.",
                  ),
                0,
              );
              a.label = 7;
            case 7:
              i++;
              return [3, 5];
            case 8:
              return [2];
          }
        });
      });
    };
    e.prototype.isDeprecated = function (e) {
      if (!e) return !1;
      if (!n0.hasOwnProperty(e.id)) return !1;
      var t = e.id,
        n = e.version;
      return n0[t].contains(n);
    };
    e.prototype.installPlugin = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, namer0, o, a, s, l, c, u, h, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              i = n.id;
              namer0 = n.name;
              (o = new Notice(
                X1.msgInstallingPlugin({
                  name: namer0,
                }),
                0,
              )).containerEl.addClass("is-loading");
              a = null;
              g.label = 1;
            case 1:
              g.trys.push([1, 3, , 4]);
              return [4, requestWithWrapper($X(e, t, F1)).text];
            case 2:
              a = g.sent();
              return (s = JSON.parse(a)).id && s.id === i
                ? [3, 4]
                : (o.containerEl.removeClass("is-loading"),
                  o.setMessage("Plugin ID mismatch."),
                  setTimeout(function () {
                    return o.hide();
                  }, 3e3),
                  [2]);
            case 3:
              l = g.sent();
              console.error(l);
              o.containerEl.removeClass("is-loading");
              o.setMessage(
                X1.msgFailedToInstallPlugin({
                  name: namer0,
                }),
              );
              setTimeout(function () {
                return o.hide();
              }, 3e3);
              return [2];
            case 4:
              c = this.app.vault;
              u = this.getPluginFolder();
              return [4, c.exists(u)];
            case 5:
              return g.sent() ? [3, 7] : [4, c.createFolder(u)];
            case 6:
              g.sent();
              g.label = 7;
            case 7:
              h = u + "/" + i;
              return [4, c.exists(h)];
            case 8:
              return g.sent() ? [3, 10] : [4, c.createFolder(h)];
            case 9:
              g.sent();
              g.label = 10;
            case 10:
              return [4, (p = c.adapter).write(h + "/" + F1, a)];
            case 11:
              g.sent();
              g.label = 12;
            case 12:
              g.trys.push([12, 15, , 16]);
              return [4, requestWithWrapper($X(e, t, N1)).text];
            case 13:
              d = g.sent();
              f = d.replace(G1, "") + K1;
              return [4, p.write(h + "/" + N1, f)];
            case 14:
              g.sent();
              return [3, 16];
            case 15:
              g.sent();
              console.log("".concat(namer0, ": ").concat(N1, " not found"));
              return [3, 16];
            case 16:
              g.trys.push([16, 19, , 20]);
              return [4, requestWithWrapper($X(e, t, R1)).text];
            case 17:
              m = g.sent();
              return [4, p.write(h + "/" + R1, m)];
            case 18:
              g.sent();
              return [3, 20];
            case 19:
              g.sent();
              console.log("".concat(namer0, ": ").concat(R1, " not found"));
              return [3, 20];
            case 20:
              delete this.updates[i];
              o.containerEl.removeClass("is-loading");
              o.containerEl.addClass("mod-success");
              o.setMessage(
                X1.msgSuccessfullyInstalledPlugin({
                  name: namer0,
                }),
              );
              setTimeout(function () {
                return o.hide();
              }, 3e3);
              return [4, this.loadManifest(h)];
            case 21:
              g.sent();
              return this.plugins.hasOwnProperty(i) ? [4, this.disablePlugin(i)] : [3, 24];
            case 22:
              g.sent();
              return [4, this.enablePlugin(i, !0)];
            case 23:
              g.sent();
              g.label = 24;
            case 24:
              return [2];
          }
        });
      });
    };
    e.prototype.checkForUpdates = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l, repo, u, manifest, version, count;
        return __generator(this, function (f) {
          switch (f.label) {
            case 0:
              this.updates = {};
              e = this.updates;
              f.label = 1;
            case 1:
              f.trys.push([1, 3, , 4]);
              return [4, $1()];
            case 2:
              t = f.sent();
              return [3, 4];
            case 3:
              n = f.sent();
              console.error(n);
              new Notice(X1.msgFailedLoadPlugins());
              return [2];
            case 4:
              i = 0;
              r = t;
              f.label = 5;
            case 5:
              if (!(i < r.length)) return [3, 12];
              if (((o = r[i]), (a = o.id), !this.manifests.hasOwnProperty(a))) return [3, 11];
              if (((s = this.manifests[a]), !(l = s.version))) return [3, 11];
              repo = o.repo;
              u = XX(repo, F1);
              manifest = null;
              f.label = 6;
            case 6:
              f.trys.push([6, 8, , 9]);
              return [4, requestWithWrapper(u).json];
            case 7:
              return (manifest = f.sent()) && manifest.id && manifest.id === a ? [3, 9] : [3, 11];
            case 8:
              f.sent();
              return [3, 11];
            case 9:
              return [4, JX(repo, manifest)];
            case 10:
              (version = f.sent()) &&
                pG(l, version) &&
                (e[a] = {
                  repo: repo,
                  version: version,
                  manifest: manifest,
                });
              f.label = 11;
            case 11:
              i++;
              return [3, 5];
            case 12:
              count = Object.keys(e).length;
              new Notice(
                count === 0
                  ? X1.msgNoUpdatesFound()
                  : X1.msgUpdatesFound({
                      count: count,
                    }),
              );
              return [2];
          }
        });
      });
    };
    return e;
  })(),
  Z1 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.modalEl.addClass("mod-trust-folder");
      n.titleEl.setText(X1.labelTrustAuthor());
      n.contentEl.createEl("p", {
        text: X1.labelTrustAuthorDescription_1(),
      });
      n.contentEl.createEl("p", {
        text: X1.labelTrustAuthorDescription_2(),
      });
      n.contentEl.createEl("p", {
        text: X1.labelTrustAuthorDescription_3(),
      });
      var i = n.modalEl.createDiv("modal-button-container");
      i.createEl("button", {
        text: X1.buttonEnablePlugins(),
        onclick: function () {
          return __awaiter(n, undefined, undefined, function () {
            return __generator(this, function (e) {
              switch (e.label) {
                case 0:
                  this.close();
                  return [4, this.app.plugins.setEnable(!0)];
                case 1:
                  e.sent();
                  this.app.setting.open();
                  this.app.setting.openTabById("community-plugins");
                  return [2];
              }
            });
          });
        },
      });
      i.createEl("button", {
        text: X1.buttonDontTrustAuthor(),
        onclick: function () {
          return __awaiter(n, undefined, undefined, function () {
            return __generator(this, function (e) {
              switch (e.label) {
                case 0:
                  this.close();
                  return [4, this.app.plugins.setEnable(!1)];
                case 1:
                  e.sent();
                  this.app.setting.open();
                  this.app.setting.openTabById("community-plugins");
                  return [2];
              }
            });
          });
        },
      });
      return n;
    }
    __extends(t, e);
    return t;
  })(Modal),
  X1 = i18nProxy.setting.thirdPartyPlugin,
  Q1 = XX("obsidianmd/obsidian-releases", "community-plugins.json"),
  $1 = ox(
    function () {
      return __awaiter(undefined, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, requestWithWrapper(Q1).json];
            case 1:
              if (((e = t.sent()), !Array.isArray(e))) throw new Error("Failed to parse community plugins.");
              return [2, e];
          }
        });
      });
    },
    3e5,
    6e4,
  ),
  J1 = XX("obsidianmd/obsidian-releases", "community-plugin-stats.json"),
  e0 = ox(
    function () {
      return requestWithWrapper(J1).json;
    },
    3e5,
    6e4,
  ),
  t0 = XX("obsidianmd/obsidian-releases", "community-plugin-deprecation.json"),
  n0 = {},
  i0 = {
    download: i18nProxy.setting.thirdPartyPlugin.labelByPopularity,
    release: i18nProxy.setting.thirdPartyPlugin.labelByReleased,
    alphabetical: i18nProxy.setting.thirdPartyPlugin.labelAlphabetical,
    update: i18nProxy.setting.thirdPartyPlugin.labelByUpdated,
  },
  r0 = (function (e) {
    function t(app, instance, manager) {
      var r = e.call(this) || this;
      r.lastSave = 0;
      r.manager = null;
      r.instance = null;
      r.enabled = false;
      r.commands = [];
      r.ribbonItems = [];
      r.mobileFileInfo = [];
      r.hasStatusBarItem = false;
      r.statusBarEl = null;
      r.addedButtonEls = [];
      r.views = {};
      r.onConfigFileChange = debounce(r.handleConfigFileChange, 50);
      r.app = app;
      r.instance = instance;
      r.manager = manager;
      return r;
    }
    __extends(t, e);
    t.prototype.init = function () {
      var e = this.instance;
      if (e.init) {
        e.init(this.app, this);
      }
    };
    t.prototype.enable = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              if (this.enabled) return [2];
              for (
                this.enabled = true, n = (t = this).instance, i = t.views, r = t.app, o = 0, a = this.commands;
                o < a.length;
                o++
              ) {
                s = a[o];
                r.commands.addCommand(s);
              }
              for (l = 0, c = this.ribbonItems; l < c.length; l++) {
                u = c[l];
                h = r.workspace.leftRibbon.addRibbonItemButton(u.id, u.icon, u.title, u.callback);
                this.addedButtonEls.push(h);
              }
              if (Platform.isMobile)
                for (p = 0, d = this.mobileFileInfo; p < d.length; p++) {
                  f = d[p];
                  r.workspace.addMobileFileInfo(f);
                }
              for (m in (this.hasStatusBarItem &&
                ((this.statusBarEl = r.statusBar.registerStatusBarItem()),
                this.statusBarEl.addClass("plugin-" + this.instance.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/, "-"))),
              i))
                if (i.hasOwnProperty(m)) {
                  this.app.viewRegistry.registerView(m, i[m]);
                }
              return n.onEnable ? [4, n.onEnable(r, this)] : [3, 2];
            case 1:
              g.sent();
              g.label = 2;
            case 2:
              e && n.onUserEnable && n.onUserEnable(r);
              this.load();
              this.manager.requestSaveConfig();
              this.manager.trigger("change", this);
              return [2];
          }
        });
      });
    };
    t.prototype.disable = function (e) {
      if (this.enabled) {
        this.enabled = false;
        var t = this,
          n = t.instance,
          i = t.views,
          r = t.app;
        n.onDisable && n.onDisable(r, this);
        e && n.onUserDisable && n.onUserDisable(r);
        for (var o = 0, a = this.commands; o < a.length; o++) {
          var s = a[o];
          r.commands.removeCommand(s.id);
        }
        for (var l = 0, c = this.addedButtonEls; l < c.length; l++) {
          c[l].detach();
        }
        for (var u = 0, h = this.ribbonItems; u < h.length; u++) {
          var p = h[u];
          r.workspace.leftRibbon.removeRibbonAction(p.id);
        }
        for (var d in (this.statusBarEl && this.statusBarEl.detach(), i))
          if (i.hasOwnProperty(d)) {
            this.app.viewRegistry.unregisterView(d);
            e && r.workspace.detachLeavesOfType(d);
          }
        this.unload();
        this.manager.requestSaveConfig();
        this.manager.trigger("change", this);
      }
    };
    t.prototype.getModifiedTime = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              e = this.instance.id;
              t = this.manager.app;
              n = t.vault.getConfigFile(e);
              i.label = 1;
            case 1:
              i.trys.push([1, 3, , 4]);
              return [4, t.vault.adapter.stat(n)];
            case 2:
              return [2, i.sent().mtime];
            case 3:
              i.sent();
              return [2, 0];
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype.handleConfigFileChange = function () {
      return __awaiter(this, undefined, undefined, function () {
        var lastSave;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this.instance.onExternalSettingsChange ? [4, this.getModifiedTime()] : [2];
            case 1:
              lastSave = t.sent();
              this.lastSave < lastSave && this.instance.onExternalSettingsChange();
              this.lastSave = lastSave;
              return [2];
          }
        });
      });
    };
    t.prototype.loadData = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          e = this.instance.id;
          return [2, this.manager.app.vault.readConfigJson(e)];
        });
      });
    };
    t.prototype.saveData = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, lastSave;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t = this.instance.id;
              n = this.manager.app;
              lastSave = Date.now();
              this.lastSave = lastSave;
              return [
                4,
                n.vault.writeConfigJson(t, e, {
                  mtime: lastSave,
                }),
              ];
            case 1:
              r.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.deleteData = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.manager.app.vault.deleteConfigJson(this.instance.id)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.registerViewType = function (e, t) {
      this.views[e] = t;
    };
    t.prototype.registerGlobalCommand = function (e) {
      e.name = this.instance.name + ": " + e.name;
      this.commands.push(e);
    };
    t.prototype.registerRibbonItem = function (title, icon, callback) {
      var i = this.instance.id + ":" + title;
      this.ribbonItems.push({
        id: i,
        title: title,
        icon: icon,
        callback: callback,
        hidden: false,
      });
    };
    t.prototype.registerStatusBarItem = function () {
      this.hasStatusBarItem = true;
    };
    t.prototype.registerMobileFileInfo = function (renderCallback) {
      this.mobileFileInfo.push({
        renderCallback: renderCallback,
      });
    };
    t.prototype.addSettingTab = function (e) {
      var t = this;
      this.app.setting.addSettingTab(e);
      this.register(function () {
        return t.app.setting.removeSettingTab(e);
      });
    };
    return t;
  })(Component),
  o0 = [
    "file-explorer",
    "global-search",
    "switcher",
    "graph",
    "backlink",
    "outgoing-link",
    "tag-pane",
    "page-preview",
    "daily-notes",
    "templates",
    "note-composer",
    "command-palette",
    "slash-command",
    "editor-status",
    "starred",
    "markdown-importer",
    "zk-prefixer",
    "random-note",
    "outline",
    "word-count",
    "slides",
    "audio-recorder",
    "workspaces",
    "file-recovery",
    "publish",
    "sync",
  ],
  a0 = (function (e) {
    function t(app) {
      var n = e.call(this) || this;
      n.plugins = {};
      n.config = {};
      n.requestSaveConfig = debounce(n.saveConfig.bind(n), 500);
      n.app = app;
      n.app.vault.on("raw", n.onRaw.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.onRaw = function (e) {
      if (Zc(e) === this.app.vault.configDir && getExtension(e) === "json") {
        var t = Qc(e),
          n = this.plugins[t];
        if (n && n.enabled) {
          n.onConfigFileChange();
        }
      }
    };
    t.prototype.getPluginById = function (e) {
      var t = this.plugins;
      return t.hasOwnProperty(e) ? t[e] : null;
    };
    t.prototype.getEnabledPluginById = function (e) {
      var t = this.plugins;
      if (t.hasOwnProperty(e)) {
        var n = t[e];
        if (n.enabled) return n.instance;
      }
      return null;
    };
    t.prototype.loadPlugin = function (e) {
      var t = this.app,
        n = this.plugins;
      if (n.hasOwnProperty(e.id)) throw new Error("Plugin ".concat(e.name, " has already been loaded"));
      var i = new r0(t, e, this);
      i.init();
      n[e.id] = i;
      return e;
    };
    t.prototype.getEnabledPlugins = function () {
      var e = this.plugins,
        t = [];
      for (var n in e)
        if (e.hasOwnProperty(n)) {
          var i = e[n];
          if (i.enabled) {
            t.push(i);
          }
        }
      return t;
    };
    t.prototype.enable = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, config, r, o, a, s, l, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              t = (e = this).app;
              n = e.plugins;
              config = {};
              return [4, t.vault.readConfigJson("core-plugins")];
            case 1:
              return (r = p.sent())
                ? Array.isArray(r)
                  ? [4, t.vault.readConfigJson("core-plugins-migration")]
                  : [3, 3]
                : [3, 4];
            case 2:
              for (
                (o = p.sent()) && typeof o == "object" && (config = o), a = new Set(r), s = 0, l = o0;
                s < l.length;
                s++
              ) {
                u = l[s];
                n.hasOwnProperty(u) && (config[u] = a.has(u));
              }
              return [3, 4];
            case 3:
              typeof r == "object" && (config = r);
              p.label = 4;
            case 4:
              for (u in ((c = []), n))
                if (n.hasOwnProperty(u)) {
                  h = n[u];
                  config.hasOwnProperty(u)
                    ? config[u] && c.push(h.enable(!1))
                    : (h.instance.defaultOn && c.push(h.enable(!1)), this.requestSaveConfig());
                }
              return [4, Promise.all(c)];
            case 5:
              p.sent();
              this.config = config;
              return [2];
          }
        });
      });
    };
    t.prototype.saveConfig = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              for (o in ((t = (e = this).app), (n = e.plugins), (i = e.config), (r = []), n))
                if (n.hasOwnProperty(o)) {
                  i[o] = n[o].enabled;
                  n[o].enabled && r.push(o);
                }
              return [4, t.vault.writeConfigJson("core-plugins", i)];
            case 1:
              a.sent();
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
  s0 = (function () {
    function e(app, t) {
      this.navHeaderEl = null;
      this.navButtonsEl = null;
      this.app = app;
      var n = (this.navHeaderEl = t.createDiv({
        cls: "nav-header",
        prepend: true,
      }));
      this.navButtonsEl = n.createDiv("nav-buttons-container");
    }
    e.prototype.addNavButton = function (e, t, n, i) {
      var r = this.navButtonsEl.createDiv("clickable-icon nav-action-button");
      i && r.addClass(i);
      r.addEventListener("click", n);
      setIcon(r, e);
      setTooltip(r, t);
      return r;
    };
    e.prototype.addSortButton = function (e, t, n, i) {
      return this.addNavButton("lucide-sort-asc", i18nProxy.plugins.fileExplorer.actionChangeSort(), function (r) {
        r.preventDefault();
        var o = r.currentTarget;
        if (!o.classList.contains("has-active-menu")) {
          for (var a = new Menu().setNoIcon(), s = i(), l = 0, c = e; l < c.length; l++) {
            for (
              var u = function (e) {
                  var i = t[e]();
                  a.addItem(function (t) {
                    return t
                      .setTitle(i)
                      .setChecked(e === s)
                      .onClick(function () {
                        n(e);
                      });
                  });
                },
                h = 0,
                p = c[l];
              h < p.length;
              h++
            ) {
              u(p[h]);
            }
            a.addSeparator();
          }
          a.setParentElement(o).showAtMouseEvent(r);
        }
      });
    };
    return e;
  })(),
  typel00 = "backlink",
  c0 = (function () {
    function e() {
      this.id = "backlink";
      this.name = i18nProxy.plugins.backlinks.name();
      this.description = i18nProxy.plugins.backlinks.desc();
      this.defaultOn = true;
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerStatusBarItem();
      plugin.registerViewType(typel00, function (e) {
        return new u0(e);
      });
      plugin.registerGlobalCommand({
        id: "backlink:open",
        name: i18nProxy.plugins.backlinks.actionShow(),
        icon: "lucide-link",
        callback: function () {
          n.app.workspace.ensureSideLeaf(typel00, "right", {
            active: !0,
          });
        },
      });
      plugin.registerGlobalCommand({
        id: "backlink:open-backlinks",
        name: i18nProxy.plugins.backlinks.actionOpenForCurrent(),
        icon: "lucide-link",
        checkCallback: this.openBacklinksForActiveFile.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "backlink:toggle-backlinks-in-document",
        name: i18nProxy.plugins.backlinks.actionToggleBacklinksInDocument(),
        icon: "lucide-link",
        checkCallback: this.toggleBacklinksInDocument.bind(this),
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
              t.registerEvent(e.workspace.on("file-open", this.onFileOpen, this));
              t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              t.registerEvent(e.metadataCache.on("resolved", this.updateBacklinks, this));
              (n = this.plugin.statusBarEl) &&
                (n.addClass("mod-clickable"),
                n.addEventListener("click", function () {
                  s.app.workspace.ensureSideLeaf(typel00, "right", {
                    active: true,
                    reveal: true,
                  });
                }));
              i = this;
              o = (r = Object).assign;
              a = [{}];
              return [4, t.loadData()];
            case 1:
              i.options = o.apply(r, a.concat([l.sent()]));
              this.app.workspace.backlinkInDocument = this.options.backlinkInDocument;
              t.addSettingTab(new p0(e, t, this));
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
              this.app.workspace.backlinkInDocument = this.options.backlinkInDocument;
              return [2];
          }
        });
      });
    };
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.onUserDisable = function (e) {
      e.workspace.detachLeavesOfType(typel00);
      for (var t = 0, n = e.workspace.getLeavesOfType(typef00); t < n.length; t++) {
        var i = n[t],
          r = i.getViewState();
        r.state.backlinks = false;
        i.setViewState(r);
      }
      e.workspace.requestSaveLayout();
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(typel00, "right", {
        reveal: !1,
      });
    };
    e.prototype.onFileMenu = function (e, t, n, group) {
      var r = this;
      if (t instanceof TFile) {
        !Platform.isMobile &&
          group &&
          n !== "sidebar-context-menu" &&
          e.addItem(function (e) {
            return e
              .setSection("view.linked")
              .setTitle(i18nProxy.plugins.backlinks.actionOpen())
              .setIcon("links-coming-in")
              .onClick(function () {
                return __awaiter(r, undefined, undefined, function () {
                  return __generator(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [
                          4,
                          this.app.workspace.splitLeafOrActive(group, "horizontal").setViewState({
                            type: typel00,
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
        group &&
          group.view instanceof MarkdownView &&
          group.view.canToggleBacklinks() &&
          e.addItem(function (e) {
            return e
              .setSection("pane")
              .setTitle(i18nProxy.plugins.backlinks.menuOptBacklinksInDocument())
              .setChecked(!!(group == null ? undefined : group.view.getState().backlinks))
              .setIcon("links-coming-in")
              .onClick(function () {
                var e = group.view;
                e instanceof MarkdownView && e.toggleBacklinks();
              });
          });
      }
    };
    e.prototype.onFileOpen = function (e) {
      this.file = e instanceof TFile ? e : null;
      this.updateBacklinks();
    };
    e.prototype.updateBacklinks = function () {
      var e = this.file,
        t = this.plugin.statusBarEl;
      if (t) {
        if (!e) {
          t.setText("");
          return void t.hide();
        }
        var count = 0,
          i = e.path,
          r = this.app.metadataCache.resolvedLinks;
        for (var o in r)
          if (o !== i && r.hasOwnProperty(o) && r[o].hasOwnProperty(i)) {
            count += r[o][i];
          }
        var a = i18nProxy.nouns.backlinkWithCount({
          count: count,
        });
        t.setText(a);
        t.show();
      }
    };
    e.prototype.openBacklinksForActiveFile = function (e) {
      var t = this.app.workspace,
        n = t.getActiveFile();
      if (n) {
        if (!e)
          t.splitActiveLeaf("vertical").setViewState({
            type: typel00,
            active: true,
            group: t.activeLeaf,
            state: {
              file: n.path,
            },
          });
        return !0;
      }
    };
    e.prototype.toggleBacklinksInDocument = function (e) {
      var t = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (t && t.canToggleBacklinks()) {
        e || t.toggleBacklinks();
        return !0;
      }
    };
    return e;
  })(),
  u0 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "links-coming-in";
      var i = n.contentEl;
      n.backlink = n.addChild(new h0(n.app, i));
      n.requestUpdate();
      return n;
    }
    __extends(t, e);
    t.prototype.getDisplayText = function () {
      return !this.file || Platform.isMobile
        ? i18nProxy.plugins.backlinks.name()
        : i18nProxy.plugins.backlinks.tabTitle({
            displayText: e.prototype.getDisplayText.call(this),
          });
    };
    t.prototype.getViewType = function () {
      return typel00;
    };
    t.prototype.canAcceptExtension = function (e) {
      return !0;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      return Object.assign(t, this.backlink.getState());
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              i.sent();
              return [4, this.backlink.setState(t)];
            case 2:
              i.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.showSearch = function () {
      this.backlink.setShowSearch(!0);
      this.backlink.searchComponent.inputEl.focus();
    };
    t.prototype.onResize = function () {
      this.backlink.onResize();
    };
    t.prototype.update = function () {
      this.leaf.updateHeader();
      var e = this.backlink;
      e.file = this.file;
      e.tooltipPlacement = this.getSideTooltipPlacement();
      e.update();
    };
    return t;
  })(DJ),
  h0 = (function (e) {
    function t(app, n, i) {
      var r = e.call(this) || this;
      r.collapseAll = false;
      r.extraContext = false;
      r.sortOrder = "alphabetical";
      r.isShowingSearch = false;
      r.searchQuery = null;
      r.backlinkFile = null;
      r.backlinkCollapsed = false;
      r.backlinkHeaderEl = null;
      r.backlinkCountEl = null;
      r.backlinkQueue = null;
      r.unlinkedFile = null;
      r.unlinkedCollapsed = false;
      r.unlinkedHeaderEl = null;
      r.unlinkedCountEl = null;
      r.unlinkedAliases = "";
      r.unlinkedQueue = null;
      r.app = app;
      var o = (r.headerDom = new s0(r.app, n));
      r.collapseAllButtonEl = o.addNavButton(
        "lucide-list",
        i18nProxy.plugins.search.labelCollapseResults(),
        r.onToggleCollapseClick.bind(r),
      );
      r.extraContextButtonEl = o.addNavButton(
        "lucide-move-vertical",
        i18nProxy.plugins.search.labelMoreContext(),
        r.onToggleMoreContextClick.bind(r),
      );
      o.addSortButton(
        _F,
        jF,
        function (e) {
          return r.setSortOrder(e);
        },
        function () {
          return r.sortOrder;
        },
      );
      r.showSearchButtonEl = o.addNavButton(
        "lucide-search",
        i18nProxy.plugins.backlinks.labelShowSearch(),
        r.onToggleShowSearch.bind(r),
      );
      r.searchComponent = new SearchComponent(o.navHeaderEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(debounce(r.updateSearch.bind(r), 300, !0))
        .then(function (e) {
          setTooltip(e.clearButtonEl, i18nProxy.plugins.search.tooltipClearSearch());
          e.inputEl.addEventListener("keypress", function (e) {
            if (!(e.isComposing || e.key !== "Enter")) {
              Platform.hasPhysicalKeyboard || clearFocusAndSelection();
              r.updateSearch();
            }
          });
          e.containerEl.hide();
        });
      var a = n.createDiv("backlink-pane");
      i = i || a;
      var s = (r.backlinkHeaderEl = a.createDiv("tree-item-self is-clickable"));
      s.createSpan("tree-item-icon collapse-icon", function (e) {
        setIcon(e, "right-triangle");
      });
      s.createDiv({
        cls: "tree-item-inner",
        text: i18nProxy.plugins.backlinks.labelLinkedMentions(),
      });
      s.addEventListener("click", r.toggleBacklinkCollapsed.bind(r));
      r.backlinkCountEl = s.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      r.backlinkDom = new pN(
        r.app,
        a.createDiv("search-result-container"),
        i18nProxy.plugins.backlinks.labelNoBacklinks(),
        i,
      );
      var l = (r.unlinkedHeaderEl = a.createDiv("tree-item-self is-clickable"));
      l.createSpan("tree-item-icon collapse-icon", function (e) {
        setIcon(e, "right-triangle");
      });
      l.createDiv({
        cls: "tree-item-inner",
        text: i18nProxy.plugins.backlinks.labelUnlinkedMentions(),
      });
      l.addEventListener("click", r.toggleUnlinkedCollapsed.bind(r));
      r.unlinkedCountEl = l.createDiv("tree-item-flair-outer").createSpan("tree-item-flair");
      r.unlinkedDom = new pN(
        r.app,
        a.createDiv("search-result-container"),
        i18nProxy.plugins.backlinks.labelNoUnlinkedMentions(),
        i,
      );
      r.setUnlinkedCollapsed(!0, !1);
      return r;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this.app,
        t = e.vault;
      this.registerEvent(e.metadataCache.on("resolve", this.onMetadataChanged, this));
      this.registerEvent(t.on("create", this.onFileChanged, this));
      this.registerEvent(t.on("modify", this.onFileChanged, this));
      this.registerEvent(t.on("rename", this.onFileRename, this));
      this.registerEvent(t.on("delete", this.onFileDeleted, this));
    };
    t.prototype.onToggleCollapseClick = function () {
      this.setCollapseAll(!this.collapseAll);
    };
    t.prototype.setCollapseAll = function (collapseAll) {
      if (collapseAll !== this.collapseAll) {
        this.collapseAll = collapseAll;
        this.backlinkDom.setCollapseAll(collapseAll);
        this.unlinkedDom.setCollapseAll(collapseAll);
        this.collapseAllButtonEl.toggleClass("is-active", collapseAll);
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.onToggleMoreContextClick = function () {
      this.setExtraContext(!this.extraContext);
    };
    t.prototype.setExtraContext = function (extraContext) {
      if (extraContext !== this.extraContext) {
        this.extraContext = extraContext;
        this.backlinkDom.setExtraContext(extraContext);
        this.unlinkedDom.setExtraContext(extraContext);
        this.extraContextButtonEl.toggleClass("is-active", extraContext);
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.getState = function () {
      return {
        collapseAll: this.collapseAll,
        extraContext: this.extraContext,
        sortOrder: this.sortOrder,
        showSearch: this.isShowingSearch,
        searchQuery: this.searchComponent.getValue(),
        backlinkCollapsed: this.backlinkCollapsed,
        unlinkedCollapsed: this.unlinkedCollapsed,
      };
    };
    t.prototype.setState = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = e.collapseAll;
              n = e.extraContext;
              i = e.sortOrder;
              r = e.showSearch;
              o = e.searchQuery;
              a = e.backlinkCollapsed;
              s = e.unlinkedCollapsed;
              isBoolean(t) && this.setCollapseAll(t);
              isBoolean(n) && this.setExtraContext(n);
              isBoolean(r) && this.setShowSearch(r);
              String.isString(i) && GF.hasOwnProperty(i) && this.setSortOrder(i);
              return isBoolean(a) ? [4, this.setBacklinkCollapsed(a, !1)] : [3, 2];
            case 1:
              l.sent();
              l.label = 2;
            case 2:
              return isBoolean(s) ? [4, this.setUnlinkedCollapsed(s, !1)] : [3, 4];
            case 3:
              l.sent();
              l.label = 4;
            case 4:
              String.isString(o) && (this.searchComponent.setValue(o), this.updateSearch());
              return [2];
          }
        });
      });
    };
    t.prototype.onToggleShowSearch = function () {
      this.setShowSearch(!this.isShowingSearch);
      this.isShowingSearch && this.searchComponent.inputEl.focus();
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
    t.prototype.setSortOrder = function (sortOrder) {
      if (sortOrder !== this.sortOrder) {
        this.sortOrder = sortOrder;
        this.backlinkDom.sortOrder = sortOrder;
        this.backlinkDom.changed();
        this.unlinkedDom.sortOrder = sortOrder;
        this.unlinkedDom.changed();
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.onResize = function () {
      this.backlinkDom.onResize();
      this.unlinkedDom.onResize();
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
          this.backlinkFile = null;
          this.unlinkedFile = null;
          this.update();
        } catch (e) {
          new Notice(e.message);
          console.log(e);
        }
    };
    t.prototype.toggleBacklinkCollapsed = function () {
      this.setBacklinkCollapsed(!this.backlinkCollapsed, !0);
    };
    t.prototype.setBacklinkCollapsed = function (backlinkCollapsed, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return backlinkCollapsed === this.backlinkCollapsed
                ? [2]
                : ((this.backlinkCollapsed = backlinkCollapsed),
                  [4, this.setSectionCollapsed(this.backlinkHeaderEl, this.backlinkDom, backlinkCollapsed, t)]);
            case 1:
              n.sent();
              this.app.workspace.requestSaveLayout();
              this.backlinkDom.infinityScroll.updateVirtualDisplay();
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
              this.backlinkDom.infinityScroll.updateVirtualDisplay();
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
    t.prototype.onMetadataChanged = function (e) {
      var t = this.backlinkQueue;
      if ((t && t.add(e), this.onFileChanged(e), e === this.unlinkedFile)) {
        var n = "",
          i = this.app.metadataCache.getFileCache(e);
        if (i) {
          var r = parseFrontMatterAliases(i.frontmatter);
          if (r) {
            n = JSON.stringify(r);
          }
        }
        if (this.unlinkedAliases !== n) {
          this.recomputeUnlinked(e);
        }
      }
    };
    t.prototype.onFileChanged = function (e) {
      var t = this.unlinkedQueue;
      if (t) {
        t.add(e);
      }
    };
    t.prototype.onFileRename = function (e) {
      if (e === this.unlinkedFile) {
        this.recomputeBacklink(e);
        this.recomputeUnlinked(e);
      } else {
        this.onFileChanged(e);
        var t = this.backlinkQueue;
        if (t) {
          t.add(e);
        }
      }
    };
    t.prototype.onFileDeleted = function (e) {
      var t = this.unlinkedQueue;
      if (t) {
        t.remove(e);
      }
      var n = this.backlinkQueue;
      n && n.remove(e);
      this.backlinkDom.removeResult(e);
      this.unlinkedDom.removeResult(e);
    };
    t.prototype.update = function () {
      var e = this.file;
      this.backlinkFile !== e && this.recomputeBacklink(e);
      this.unlinkedFile !== e && this.recomputeUnlinked(e);
      this.updateHeaderTooltip(this.backlinkHeaderEl, this.backlinkCollapsed);
      this.updateHeaderTooltip(this.unlinkedHeaderEl, this.unlinkedCollapsed);
    };
    t.prototype.passSearchFilter = function (e, t) {
      var n = this.searchQuery;
      if (n && !n.match(e, t)) return !1;
      return !0;
    };
    t.prototype.recomputeBacklink = function (backlinkFile) {
      var t = this;
      this.stopBacklinkSearch();
      var n = this.backlinkCollapsed,
        i = this.backlinkCountEl;
      if (n) i.hide();
      else {
        this.backlinkFile = backlinkFile;
        var r = this.app,
          o = this.backlinkDom;
        if ((i.show(), i.setText("0"), o.emptyResults(), backlinkFile)) {
          var a = this.app.metadataCache,
            beforePause = function () {
              i.setText(String(o.getMatchCount()));
              o.changed();
            },
            l = (this.backlinkQueue = new sx({
              onStart: function () {
                o.startLoader();
              },
              onStop: function () {
                o.stopLoader();
                beforePause();
              },
              onCancel: function () {
                t.backlinkQueue = null;
                beforePause();
              },
            }));
          o.emptyResults();
          var c = r.vault.getMarkdownFiles();
          c.sort(KF(o.sortOrder));
          l.addList(c);
          var u = (function () {
              return __asyncGenerator(this, arguments, function () {
                var t, n, i, r, error, c, u, h, p;
                return __generator(this, function (d) {
                  switch (d.label) {
                    case 0:
                      d.trys.push([0, 8, 9, 14]);
                      t = true;
                      n = __asyncValues(l.generator());
                      d.label = 1;
                    case 1:
                      return [4, __await(n.next())];
                    case 2:
                      i = d.sent();
                      return (c = i.done)
                        ? [3, 7]
                        : ((p = i.value),
                          (t = false),
                          (function (t) {
                            var n = t.path,
                              i = a.resolvedLinks;
                            return i.hasOwnProperty(n) && i[n].hasOwnProperty(backlinkFile.path);
                          })((r = p))
                            ? [4, __await(r)]
                            : [3, 5]);
                    case 3:
                      return [4, d.sent()];
                    case 4:
                      d.sent();
                      return [3, 6];
                    case 5:
                      o.removeResult(r);
                      d.label = 6;
                    case 6:
                      t = true;
                      return [3, 1];
                    case 7:
                      return [3, 14];
                    case 8:
                      error = d.sent();
                      u = {
                        error: error,
                      };
                      return [3, 14];
                    case 9:
                      d.trys.push([9, , 12, 13]);
                      return t || c || !(h = n.return) ? [3, 11] : [4, __await(h.call(n))];
                    case 10:
                      d.sent();
                      d.label = 11;
                    case 11:
                      return [3, 13];
                    case 12:
                      if (u) throw u.error;
                      return [7];
                    case 13:
                      return [7];
                    case 14:
                      return [2];
                  }
                });
              });
            })(),
            h = cx(r.vault.generateFiles(u, !0), {
              batchSize: 2,
              beforePause: beforePause,
            });
          __awaiter(t, undefined, undefined, function () {
            var t, n, i, r, s, c, error, p, d, f, m;
            return __generator(this, function (g) {
              switch (g.label) {
                case 0:
                  g.trys.push([0, 5, 6, 11]);
                  t = function () {
                    m = s.value;
                    i = false;
                    var t = m.file,
                      r = m.content;
                    if (l.runnable.isCancelled())
                      return {
                        value: undefined,
                      };
                    if (backlinkFile === t) return "continue";
                    var c = false,
                      u = {},
                      h = a.getFileCache(t);
                    if (!h) {
                      o.removeResult(t);
                      return "continue";
                    }
                    if (!n.passSearchFilter(t, r)) return "continue";
                    var p = [];
                    traverseLinksOrEmbeds(h, function (n) {
                      if (
                        (function (t, n) {
                          var i = getLinkpath(n.link),
                            r = a.getFirstLinkpathDest(i, t);
                          return r && r === backlinkFile;
                        })(t.path, n)
                      ) {
                        p.push(n);
                      }
                    });
                    u.content = [];
                    u.properties = [];
                    for (var d = 0, f = p; d < f.length; d++) {
                      var g = f[d];
                      if (hasPosition(g)) u.content.push([g.position.start.offset, g.position.end.offset]);
                      else if (hasKey(g)) {
                        var v = g.key.split("."),
                          y = v[0],
                          b = v.slice(1),
                          subkey = undefined;
                        if (b) {
                          subkey = [];
                          for (var k = 0, C = b; k < C.length; k++) {
                            var E = C[k],
                              S = Number(E);
                            subkey.push(Number.isNaN(S) ? E : S);
                          }
                        }
                        u.properties.push({
                          key: y,
                          subkey: subkey,
                          pos: [0, g.original.length],
                        });
                      }
                      c = true;
                    }
                    c ? o.addResult(t, u, r) : o.removeResult(t);
                  };
                  n = this;
                  i = true;
                  r = __asyncValues(h);
                  g.label = 1;
                case 1:
                  return [4, r.next()];
                case 2:
                  if (((s = g.sent()), (p = s.done))) return [3, 4];
                  if (typeof (c = t()) == "object") return [2, c.value];
                  g.label = 3;
                case 3:
                  i = true;
                  return [3, 1];
                case 4:
                  return [3, 11];
                case 5:
                  error = g.sent();
                  d = {
                    error: error,
                  };
                  return [3, 11];
                case 6:
                  g.trys.push([6, , 9, 10]);
                  return i || p || !(f = r.return) ? [3, 8] : [4, f.call(r)];
                case 7:
                  g.sent();
                  g.label = 8;
                case 8:
                  return [3, 10];
                case 9:
                  if (d) throw d.error;
                  return [7];
                case 10:
                  return [7];
                case 11:
                  return [2];
              }
            });
          });
        }
      }
    };
    t.prototype.stopBacklinkSearch = function () {
      var e = this.backlinkQueue;
      e && !e.runnable.isCancelled() && (e.runnable.cancel(), (this.backlinkFile = null));
      this.backlinkQueue = null;
    };
    t.prototype.recomputeUnlinked = function (unlinkedFile) {
      var t = this;
      this.stopUnlinkedSearch();
      var n = this.unlinkedCollapsed,
        i = this.unlinkedCountEl;
      if (n) i.hide();
      else {
        this.unlinkedFile = unlinkedFile;
        this.unlinkedAliases = "";
        var r = this.app,
          o = this.unlinkedDom;
        if ((i.show(), i.setText("0"), o.emptyResults(), unlinkedFile)) {
          var a = [new RegExp(QO(unlinkedFile.basename), "gi")],
            s = this.app.metadataCache.getFileCache(unlinkedFile);
          if (s) {
            var l = parseFrontMatterAliases(s.frontmatter);
            if (l) {
              for (var c = 0, u = l; c < u.length; c++) {
                var h = u[c];
                if (h) {
                  a.push(new RegExp(QO(h), "gi"));
                }
              }
              this.unlinkedAliases = JSON.stringify(l);
            }
          }
          var beforePause = function () {
              i.setText(String(o.getMatchCount()));
            },
            d = (this.unlinkedQueue = new sx({
              onStart: function () {
                o.startLoader();
              },
              onStop: function () {
                o.stopLoader();
                beforePause();
              },
              onCancel: function () {
                t.unlinkedQueue = null;
              },
            }));
          o.emptyResults();
          var f = r.vault.getMarkdownFiles();
          f.sort(GF[o.sortOrder]);
          d.addList(f);
          var m = d.generator(),
            g = cx(r.vault.generateFiles(m, !0), {
              beforePause: beforePause,
            });
          __awaiter(t, undefined, undefined, function () {
            var t, n, i, s, l, c, u, h, p, d, f, m, v, y, w, k, C, E, M, x, error, D, A, P, L;
            return __generator(this, function (b) {
              switch (b.label) {
                case 0:
                  b.trys.push([0, 5, 6, 11]);
                  t = true;
                  n = __asyncValues(g);
                  b.label = 1;
                case 1:
                  return [4, n.next()];
                case 2:
                  if (((i = b.sent()), (D = i.done))) return [3, 4];
                  if (((L = i.value), (t = false), (s = L.file), (l = L.content), unlinkedFile === s)) return [3, 3];
                  if (r.metadataCache.isUserIgnored(s.path)) return [3, 3];
                  if (((c = r.metadataCache.getFileCache(s)), !this.passSearchFilter(s, l))) return [3, 3];
                  for (u = false, h = [], p = 0, d = a; p < d.length; p++)
                    for ((f = d[p]).lastIndex = 0, m = f.exec(l); m; ) {
                      v = f.lastIndex;
                      y = v - m[1].length;
                      h.push([y, v]);
                      m = f.exec(l);
                    }
                  for (
                    (w = {}).content = [],
                      k = function (e) {
                        var t = iterateCacheRefs(c, function (t) {
                          return t.position.start.offset <= e[0] && t.position.end.offset >= e[1];
                        });
                        if (c && c.frontmatterPosition) {
                          var n = c.frontmatterPosition;
                          if (n && n.start.offset <= e[0] && n.end.offset >= e[1]) {
                            t = true;
                          }
                        }
                        if (!t) {
                          u = true;
                          w.content.push(e);
                        }
                      },
                      C = 0,
                      E = h;
                    C < E.length;
                    C++
                  ) {
                    M = E[C];
                    k(M);
                  }
                  u
                    ? ((x = o.addResult(s, w, l)), this.addLinkFunction(x, unlinkedFile, s), (x.separateMatches = true))
                    : o.removeResult(s);
                  b.label = 3;
                case 3:
                  t = true;
                  return [3, 1];
                case 4:
                  return [3, 11];
                case 5:
                  error = b.sent();
                  A = {
                    error: error,
                  };
                  return [3, 11];
                case 6:
                  b.trys.push([6, , 9, 10]);
                  return t || D || !(P = n.return) ? [3, 8] : [4, P.call(n)];
                case 7:
                  b.sent();
                  b.label = 8;
                case 8:
                  return [3, 10];
                case 9:
                  if (A) throw A.error;
                  return [7];
                case 10:
                  return [7];
                case 11:
                  return [2];
              }
            });
          });
        }
      }
    };
    t.prototype.stopUnlinkedSearch = function () {
      var e = this.unlinkedQueue;
      e && !e.runnable.isCancelled() && (e.runnable.cancel(), (this.unlinkedFile = null));
      this.unlinkedQueue = null;
    };
    t.prototype.addLinkFunction = function (e, t, n) {
      var i = this;
      e.onMatchRender = function (r, o) {
        o.createEl("button", {
          cls: "search-result-file-match-replace-button",
          text: i18nProxy.plugins.backlinks.labelLinkButtonText(),
        }).addEventListener("click", function (a) {
          return __awaiter(i, undefined, undefined, function () {
            var i, s, l, c, u, h;
            return __generator(this, function (p) {
              switch (p.label) {
                case 0:
                  a.preventDefault();
                  o.detach();
                  e.invalidate();
                  i = this.app.vault;
                  s = r[0];
                  l = r[1];
                  return [4, i.read(n)];
                case 1:
                  c = p.sent();
                  u = c.slice(s, l);
                  h = this.app.fileManager.generateMarkdownLink(t, n.path, "", u);
                  c = c.slice(0, s) + h + c.slice(l);
                  return [4, i.modify(n, c)];
                case 2:
                  p.sent();
                  return [2];
              }
            });
          });
        });
      };
    };
    return t;
  })(Component),
  p0 = (function (e) {
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
        .setName(i18nProxy.plugins.backlinks.optionBacklinkInDocument())
        .setDesc(i18nProxy.plugins.backlinks.optionBacklinkInDocumentDesc())
        .addToggle(function (t) {
          return t.setValue(n.backlinkInDocument).onChange(function (backlinkInDocument) {
            n.backlinkInDocument = backlinkInDocument;
            e.app.workspace.backlinkInDocument = backlinkInDocument;
            e.plugin.saveData(n);
          });
        });
    };
    return t;
  })(j1),
  d0 = (function (e) {
    function t(view) {
      var n = e.call(this, view.app, view.contentEl, view) || this;
      n.type = "source";
      n.requestOnInternalDataChange = debounce(function () {
        return n.view.onInternalDataChange();
      }, 10);
      n.requestSaveFolds = debounce(function () {
        return n.view.onMarkdownFold();
      }, 500);
      n.view = view;
      n.app = view.app;
      n.search.applyScope = function (scope) {
        n.view.scope = scope;
      };
      view.addChild(n);
      n.updateReadableLineLength();
      n.updateOptions();
      n.cm.scrollDOM.addEventListener("contextmenu", function (e) {
        if (!e.defaultPrevented && e.isTrusted && (!e.instanceOf(PointerEvent) || e.pointerType !== "touch")) {
          var i = e.targetNode;
          if (!(n.sizerEl.contains(i) && !i.parentElement.closest(".cm-gutters"))) {
            n.app.workspace.trigger(
              "markdown-viewport-menu",
              Menu.forEvent(e).addSections(["view", ""]),
              view,
              "source",
              "gutter",
            );
          }
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.show = function () {
      e.prototype.show.call(this);
      this.sizerEl.prepend(this.view.metadataEditor.containerEl);
      this.sizerEl.prepend(this.view.inlineTitleEl);
      this.sizerEl.appendChild(this.view.backlinksEl);
    };
    t.prototype.set = function (t, n) {
      e.prototype.set.call(this, t, n);
    };
    t.prototype.clear = function () {
      e.prototype.clear.call(this);
      this.propertiesExtension = null;
    };
    t.prototype.destroy = function () {
      e.prototype.destroy.call(this);
      this.propertiesExtension = null;
    };
    t.prototype.getSelection = function () {
      return this.editor.getSelection();
    };
    t.prototype.beforeUnload = function () {
      this.requestOnInternalDataChange.cancel();
      this.requestSaveFolds.run();
      this.saveHistory();
    };
    t.prototype.getEphemeralState = function (e) {
      var t = this.cm,
        n = t.state.doc,
        i = bm(n, t.state.selection.main.anchor),
        r = bm(n, t.state.selection.main.head);
      e.cursor = {
        from: {
          line: i.line,
          ch: i.ch,
        },
        to: {
          line: r.line,
          ch: r.ch,
        },
      };
    };
    t.prototype.setEphemeralState = function (e) {
      this.setState(e);
      this.setHighlight(e);
    };
    t.prototype.setState = function (e) {
      var t = this.editor,
        n = e.cursor,
        i = t.getScrollInfo(),
        r = e.focus && (!Platform.isMobile || e.focusOnMobile);
      if (
        (n && n.from && (Platform.isDesktop && (r = true), t.setSelection(n.from, n.to), t.scrollTo(i.left, i.top)),
        e.focusMetadata)
      ) {
        var o = this.view.metadataEditor;
        this.view.canShowProperties() && o && o.properties.length > 0 ? (o.focus(), (r = false)) : (r = true);
      }
      r && this.focus();
      e.hasOwnProperty("scroll") && this.applyScroll(e.scroll);
    };
    t.prototype.setHighlight = function (e) {
      var t = this,
        n = this.editor;
      if (undefined !== e.startLoc && undefined !== e.endLoc) {
        var i = e.startLoc,
          r = e.endLoc,
          from = {
            line: i.line,
            ch: i.col,
          },
          a = r
            ? {
                line: r.line,
                ch: r.col,
              }
            : {
                line: n.lastLine(),
                ch: n.getLine(n.lastLine()).length,
              };
        this.highlightSearchMatches([
          {
            from: from,
            to: a,
          },
        ]);
        this.isScrolling = true;
        this.onScroll();
      } else if (undefined !== e.line && e.line >= 0) {
        var line = e.line;
        from = {
          line: line,
          ch: 0,
        };
        a = {
          line: line,
          ch: n.getLine(line).length,
        };
        n.setSelection(a, a);
        this.highlightSearchMatches([
          {
            from: from,
            to: a,
          },
        ]);
        this.isScrolling = true;
        this.onScroll();
      } else if (undefined !== e.propertyMatches) {
        var l = e.propertyMatches;
        if (l.length > 0) {
          this.app.vault.getConfig("propertiesInDocument") === "hidden" || this.view.canShowProperties()
            ? __awaiter(t, undefined, undefined, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [4, eD(this.app)];
                    case 1:
                      (e = t.sent()) && e.focusProperty(l[0].key);
                      return [2];
                  }
                });
              })
            : (n.setSelection({
                line: 0,
                ch: 0,
              }),
              (this.isScrolling = true),
              this.onScroll());
        }
      } else if (undefined !== e.match) {
        var c = e.match,
          u = (function (e, t) {
            for (var n = [], i = 0, r = t; i < r.length; i++) {
              var o = r[i];
              n.push(o[0], o[1]);
            }
            for (var a = Ob(e, n), s = [], l = 0; l < t.length; l++)
              s.push({
                from: a[2 * l],
                to: a[2 * l + 1],
              });
            return s;
          })(c.content, c.matches);
        this.highlightSearchMatches(u);
        this.isScrolling = true;
        this.onScroll();
      }
    };
    t.prototype.highlightSearchMatches = function (e, t, n, i) {
      undefined === t && (t = true);
      undefined === n && (n = true);
      undefined === i && (i = true);
      var r = this.editor;
      if (e.length !== 0) {
        r.addHighlights(e, "is-flashing", i, !0);
        var o = e[0];
        n && r.setCursor(o.from);
        t &&
          r.scrollIntoView(
            {
              from: o.to,
              to: o.from,
            },
            !0,
          );
      } else r.removeHighlights("is-flashing");
    };
    t.prototype.getFoldInfo = function () {
      var t,
        n,
        i = e.prototype.getFoldInfo.call(this),
        folds = (t = i == null ? undefined : i.folds) !== null && undefined !== t ? t : [],
        lines = (n = i == null ? undefined : i.lines) !== null && undefined !== n ? n : this.editor.lineCount(),
        a = this.view.metadataEditor;
      this.view.canShowProperties() &&
        a.properties.length > 0 &&
        ((folds = folds.filter(function (e) {
          return e.from !== 0;
        })),
        a.collapsed &&
          folds.unshift({
            from: 0,
            to: 0,
          }));
      return {
        folds: folds,
        lines: lines,
      };
    };
    t.prototype.getDynamicExtensions = function () {
      var t = e.prototype.getDynamicExtensions.call(this);
      if (!this.sourceMode) {
        var n = this.propertiesExtension;
        n || (n = this.propertiesExtension = kb(this, this.view));
        t.push(n);
      }
      return t;
    };
    t.prototype.onUpdate = function (t, n) {
      e.prototype.onUpdate.call(this, t, n);
      var i = t.transactions;
      n && (this.view.requestSave(), this.requestSaveFolds(), this.requestOnInternalDataChange());
      (Sm(i, foldEffect) || Sm(i, unfoldEffect)) && this.requestSaveFolds();
    };
    t.prototype.onResize = function () {
      e.prototype.onResize.call(this);
      var t = this.containerEl;
      if (t.offsetParent) {
        this.updateBottomPadding(t.clientHeight);
      }
    };
    t.prototype.updateBottomPadding = function (e) {
      var t = this.view.backlinksEl,
        paddingBottom = "".concat(Math.round(e / 2), "px");
      Platform.isMobile &&
        document.body.hasClass("keyboard-animating") &&
        (paddingBottom = "calc((".concat(e, "px + var(--keyboard-height)) / 2)"));
      t.isShown() && ((paddingBottom = "100px"), (t.style.minHeight = Math.max(0, e / 2 - 100) + "px"));
      this.cm.contentDOM.style.paddingBottom = paddingBottom;
    };
    t.prototype.updateReadableLineLength = function () {
      var e = this.app.vault.getConfig("readableLineLength");
      this.editorEl.toggleClass("is-readable-line-width", e);
    };
    t.prototype.onConfigChanged = function (t) {
      e.prototype.onConfigChanged.call(this, t);
      t === "readableLineLength" && this.updateReadableLineLength();
    };
    return t;
  })(dK),
  typef00 = "markdown",
  MarkdownView = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-file";
      n.modeButtonEl = null;
      n.modes = {};
      n.currentMode = null;
      n.scroll = null;
      n.showBacklinks = false;
      n.rawFrontmatter = null;
      n.editMode = n.registerMode(new d0(n));
      n.sourceMode = {
        cmEditor: n.editor,
      };
      n.previewMode = n.registerMode(new MarkdownPreviewView(n));
      var i = (n.inlineTitleEl = createDiv("inline-title"));
      i.contentEditable = "true";
      i.spellcheck = n.app.vault.getConfig("spellcheck");
      i.autocapitalize = "on";
      i.tabIndex = -1;
      i.enterKeyHint = Platform.isAndroidApp ? "enter" : "done";
      i.addEventListener("focus", function () {
        n.fileBeingRenamed = n.file;
      });
      i.addEventListener("blur", function () {
        return n.onInlineTitleBlur();
      });
      i.addEventListener("input", function () {
        return n.onTitleChange(i);
      });
      i.addEventListener("paste", function (e) {
        return n.onTitlePaste(i, e);
      });
      i.addEventListener("keydown", n.onTitleKeydown.bind(n));
      n.metadataEditor = new tD(n.app, n);
      n.addChild(n.metadataEditor);
      n.backlinksEl = createDiv("embedded-backlinks");
      n.backlinksEl.hide();
      n.modeButtonEl = n.addAction("lucide-book-open", "", n.onSwitchView.bind(n));
      var r = n.modes;
      for (var o in r)
        if (r.hasOwnProperty(o)) {
          r[o].hide();
        }
      var a = n.app.vault.getConfig("defaultViewMode");
      (a && r.hasOwnProperty(a)) || (a = "source");
      n.currentMode = r[a];
      n.containerEl.setAttribute("data-mode", n.getMode());
      n.currentMode.show();
      n.updateButtons();
      n.showBacklinks = n.app.workspace.backlinkInDocument;
      n.updateShowBacklinks();
      n.addChild(n.previewMode);
      var s = 0;
      n.containerEl.addEventListener(
        "wheel",
        function (e) {
          if (n.app.vault.getConfig("baseFontSizeAction")) {
            var t = e.ctrlKey,
              i = Date.now();
            if (t && !(s > i - 500)) {
              if (t && e.deltaY !== 0) {
                if (isMacOS && Number.isInteger(e.deltaY)) return;
                var r = n.app.vault.getConfig("baseFontSize");
                e.deltaY < 0 ? r++ : r--;
                r = Math.clamp(r, 10, 30);
                n.app.vault.setConfig("baseFontSize", r);
              }
            } else s = i;
          }
        },
        {
          passive: !0,
        },
      );
      return n;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "editor", {
      get: function () {
        return this.editMode.editor;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.saveFrontmatter = function (e) {
      var t = Ex(this.getViewData(), e);
      this.setViewData(t, !1);
      this.onInternalDataChange();
      this.save();
    };
    t.prototype.getFile = function () {
      return this.file;
    };
    t.prototype.shiftFocusAfter = function () {
      this.setEphemeralState({
        focus: true,
        focusOnMobile: true,
        cursor: {
          from: {
            line: 0,
            ch: 0,
          },
        },
      });
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
    t.prototype.onInlineTitleBlur = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this.inlineTitleEl;
              return [4, this.saveTitle(e)];
            case 1:
              t.sent() || e.setText(this.file.basename);
              hideTooltip();
              return [2];
          }
        });
      });
    };
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      var t = this.leaf;
      this.registerEvent(t.workspace.on("quick-preview", this.onExternalDataChange, this));
      this.registerEvent(t.workspace.on("resize", this.onResize, this));
      this.registerEvent(t.workspace.on("css-change", this.onCssChange, this));
      this.registerEvent(this.app.vault.on("config-changed", this.onConfigChanged, this));
      this.onResize();
    };
    t.prototype.onClose = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, e.prototype.onClose.call(this)];
            case 1:
              t.sent();
              this.editMode.destroy();
              return [2];
          }
        });
      });
    };
    t.prototype.getViewType = function () {
      return typef00;
    };
    t.prototype.canAcceptExtension = function (e) {
      return MARKDOWN_EXTENSIONS.contains(e);
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.mode = this.getMode();
      t.source = this.editMode.sourceMode;
      t.backlinks = this.showBacklinks;
      this.backlinks && (t.backlinkOpts = this.backlinks.getState());
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, showBacklinks, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              i = false;
              r = t.mode;
              showBacklinks = t.backlinks;
              a = t.backlinkOpts;
              s = t.source;
              return r ? ((l = this.modes).hasOwnProperty(r) ? [4, this.setMode(l[r])] : [3, 2]) : [3, 2];
            case 1:
              i = u.sent();
              u.label = 2;
            case 2:
              c = this.editMode;
              typeof s == "boolean" && c.sourceMode !== s && (c.toggleSource(), (i = true));
              isBoolean(showBacklinks) &&
                ((this.showBacklinks = showBacklinks),
                this.updateShowBacklinks(),
                showBacklinks && a && typeof a == "object" && this.backlinks.setState(a));
              i && (n.layout = true);
              return [4, e.prototype.setState.call(this, t, n)];
            case 3:
              u.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.getEphemeralState = function () {
      var t = e.prototype.getEphemeralState.call(this);
      this.currentMode.getEphemeralState(t);
      this.scroll !== null && (t.scroll = this.scroll);
      return t;
    };
    t.prototype.setEphemeralState = function (t) {
      var n = t.rename;
      if (n) {
        var i = undefined;
        if ((n === "start" ? (i = true) : n === "end" && (i = false), this.inlineTitleEl.isShown()))
          if (
            (this.currentMode === this.editMode ? this.editMode.cm.scrollDOM.scrollTop : this.previewMode.getScroll()) <
            0.5
          ) {
            focusAndSelectContent(this.inlineTitleEl, i);
            delete t.rename;
          }
      }
      e.prototype.setEphemeralState.call(this, t);
      var r = t.subpath;
      if (r) {
        var o = resolveSubpath(this.app.metadataCache.getFileCache(this.file), r);
        if (o) {
          t.line = o.start.line;
          t.startLoc = o.start;
          t.endLoc = o.end || null;
        }
      }
      this.currentMode.setEphemeralState(t);
      t.hasOwnProperty("scroll") && (this.scroll = t.scroll);
    };
    t.prototype.onUnloadFile = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          this.onMarkdownFold();
          this.currentMode.beforeUnload();
          this.rawFrontmatter = null;
          this.metadataEditor.clear();
          this.editMode.setCssClass(null);
          return [2, e.prototype.onUnloadFile.call(this, t)];
        });
      });
    };
    t.prototype.registerMode = function (e) {
      this.modes[e.type] = e;
      return e;
    };
    t.prototype.getMode = function () {
      return this.currentMode.type;
    };
    t.prototype.getHoverSource = function () {
      return this.getMode();
    };
    t.prototype.toggleMode = function () {
      var e = this.leaf,
        t = e.getViewState();
      t.state.mode = t.state.mode === "preview" ? "source" : "preview";
      e.setViewState(t, {
        focus: !0,
      });
    };
    t.prototype.updateButtons = function () {
      var e = this.currentMode,
        t = this.modeButtonEl,
        n = i18nProxy.interface.menu.modClickOpenNewTab({
          key: modifierDisplayMap.Mod,
        });
      e.type === "source"
        ? (setIcon(t, "lucide-book-open"),
          setTooltip(
            t,
            i18nProxy("interface.menu.edit-view") + "\n" + i18nProxy("interface.menu.switch-to-read-view") + "\n" + n,
          ))
        : (setIcon(t, "lucide-edit-3"),
          setTooltip(
            t,
            i18nProxy("interface.menu.read-view") + "\n" + i18nProxy("interface.menu.switch-to-edit-view") + "\n" + n,
          ));
    };
    t.prototype.setMode = function (currentMode) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, scroll, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return currentMode && this.currentMode !== currentMode
                ? ((n = (t = this).currentMode), (scroll = t.scroll), n.type !== "source" ? [3, 2] : [4, this.save()])
                : [2, !1];
            case 1:
              o.sent();
              o.label = 2;
            case 2:
              r = n.getFoldInfo();
              this.app.foldManager.save(this.file, r);
              n.hide();
              this.currentMode = currentMode;
              currentMode.show();
              this.data !== null && currentMode.set(this.data, !1);
              currentMode.onResize();
              scroll !== null &&
                currentMode.setEphemeralState({
                  scroll: scroll,
                });
              currentMode.applyFoldInfo(r);
              this.metadataEditor.setCollapse(
                !!r &&
                  r.folds.some(function (e) {
                    return e.from === 0;
                  }),
                !1,
              );
              this.updateButtons();
              this.containerEl.setAttribute("data-mode", this.getMode());
              return [2, !0];
          }
        });
      });
    };
    t.prototype.getViewData = function () {
      return this.currentMode.get();
    };
    t.prototype.clear = function () {
      var e = this,
        t = e.currentMode,
        n = e.editMode,
        i = e.modes;
      for (var r in (t === n && this.onMarkdownFold(), (this.scroll = null), i))
        if (i.hasOwnProperty(r)) {
          i[r].clear();
        }
    };
    Object.defineProperty(t.prototype, "path", {
      get: function () {
        return this.file.path;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.onSwitchView = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, state, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              e.preventDefault();
              t = this.leaf;
              (state = this.getState()).mode = this.getMode() === "preview" ? "source" : "preview";
              i = {
                type: typef00,
                state: state,
              };
              Keymap.isModEvent(e) &&
                ((r = this.app.workspace),
                (t = r.createLeafBySplit(this.leaf)),
                (i.active = true),
                (i.group = this.leaf));
              return [4, t.setViewState(i)];
            case 1:
              o.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.canToggleBacklinks = function () {
      return this.getMode() === "preview" || this.editMode instanceof d0;
    };
    t.prototype.toggleBacklinks = function () {
      return __awaiter(this, undefined, undefined, function () {
        var state;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              (state = this.getState()).backlinks = !state.backlinks;
              return [
                4,
                this.leaf.setViewState({
                  type: typef00,
                  state: state,
                }),
              ];
            case 1:
              t.sent();
              this.app.workspace.requestSaveLayout();
              return [2];
          }
        });
      });
    };
    t.prototype.updateShowBacklinks = function () {
      var e = this.showBacklinks,
        t = this.app,
        n = this.backlinks;
      e && !n
        ? (this.backlinksEl.show(),
          (this.backlinks = this.addChild(new h0(t, this.backlinksEl))),
          this.updateBacklinks())
        : !e && n && (this.removeChild(n), this.backlinksEl.empty(), this.backlinksEl.hide(), (this.backlinks = null));
      this.currentMode === this.editMode && this.editMode.onResize();
    };
    t.prototype.updateBacklinks = function () {
      var e = this.backlinks;
      if (e) {
        e.file = this.file;
        e.update();
      }
    };
    t.prototype.onLoadFile = function (t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              this.inlineTitleEl.setText(this.getDisplayText());
              return [4, e.prototype.onLoadFile.call(this, t)];
            case 1:
              n.sent();
              this.updateBacklinks();
              return [2];
          }
        });
      });
    };
    t.prototype.onRename = function (t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              t === this.file && this.inlineTitleEl.setText(t.basename);
              return [4, e.prototype.onRename.call(this, t)];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.syncScroll = function () {
      var scroll = this.currentMode.getScroll();
      scroll !== null && (this.scroll = scroll);
      this.app.workspace.trigger("markdown-scroll", this);
      return this.syncState();
    };
    t.prototype.receiveSyncState = function (e) {
      this.file !== e.file
        ? this.leaf.openFile(e.file, {
            eState: e.getEphemeralState(),
          })
        : this.setEphemeralState(e.getEphemeralState());
    };
    t.prototype.onMarkdownFold = function () {
      this.app.foldManager.save(this.file, this.currentMode.getFoldInfo());
    };
    t.prototype.onPaneMenu = function (t, n) {
      var i = this;
      e.prototype.onPaneMenu.call(this, t, n);
      var r = this.getMode();
      t.addItem(function (e) {
        return e
          .setSection("pane")
          .setTitle(i18nProxy.interface.menu.toggleReadingView())
          .setChecked(r === "preview")
          .setIcon("lucide-book-open")
          .onClick(i.onSwitchView.bind(i));
      });
      t.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(i18nProxy.interface.menu.addProperty())
          .setDisabled(!i.canShowProperties())
          .setIcon("lucide-plus-circle")
          .onClick(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e, t, n;
              return __generator(this, function (i) {
                switch (i.label) {
                  case 0:
                    t = (e = this).app;
                    n = e.leaf;
                    t.workspace.setActiveLeaf(n);
                    return [4, eD(this.app)];
                  case 1:
                    i.sent().addProperty();
                    return [2];
                }
              });
            });
          });
      });
      r === "source" &&
        t.addItem(function (e) {
          return e
            .setSection("pane")
            .setTitle(i18nProxy.interface.menu.toggleSourceMode())
            .setIcon("lucide-code-2")
            .setChecked(!!i.getState().source)
            .onClick(function () {
              var state = i.getState();
              state.source = !state.source;
              i.leaf.setViewState({
                type: typef00,
                state: state,
              });
            });
        });
      t.addItem(function (e) {
        return e
          .setSection("find")
          .setTitle(i18nProxy.interface.menu.find())
          .setIcon("lucide-file-search")
          .onClick(function () {
            return i.showSearch();
          });
      });
      t.addItem(function (e) {
        return e
          .setSection("find")
          .setDisabled(r !== "source")
          .setTitle(i18nProxy.interface.menu.replace())
          .setIcon("lucide-file-search")
          .onClick(function () {
            return i.showSearch(!0);
          });
      });
      Platform.canExportPdf &&
        t.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(i18nProxy.commands.exportPdf())
            .setIcon("lucide-file-down")
            .onClick(function (e) {
              return i.printToPdf();
            });
        });
    };
    t.prototype.onResize = function () {
      this.currentMode.onResize();
    };
    t.prototype.onCssChange = function () {
      this.editMode.onCssChange();
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
        this.editMode.setCssClass(getCssClasses(i));
        this.metadataEditor.synchronize(i);
      }
    };
    t.prototype.onInternalDataChange = function () {
      var data = this.currentMode.get();
      if (this.data !== data) {
        this.data = data;
        this.leaf.workspace.onQuickPreview(this.file, this.data);
        this.loadFrontmatter(data);
      }
    };
    t.prototype.onExternalDataChange = function (e, t) {
      if (e === this.file) {
        this.setData(t, !1);
      }
    };
    t.prototype.setViewData = function (e, t) {
      var n = this.currentMode,
        i = this.modes;
      if (t) {
        for (var r in ((this.scroll = null), i))
          if (i.hasOwnProperty(r)) {
            i[r].set(e, !0);
          }
        var o = this.app.foldManager.load(this.file);
        o && n.applyFoldInfo(o);
        this.metadataEditor.setCollapse(
          !!o &&
            o.folds.some(function (e) {
              return e.from === 0;
            }),
          !1,
        );
      } else n.set(e, !1);
      this.loadFrontmatter(e);
    };
    t.prototype.onConfigChanged = function (e) {
      if (e === "spellcheck") {
        this.inlineTitleEl.spellcheck = this.app.vault.getConfig("spellcheck");
      }
    };
    t.prototype.updateOptions = function () {
      var e = this.modes;
      for (var t in e)
        if (e.hasOwnProperty(t)) {
          e[t].updateOptions();
        }
    };
    t.prototype.showSearch = function (e) {
      undefined === e && (e = false);
      this.currentMode.showSearch(e);
    };
    t.prototype.canShowProperties = function () {
      return (
        (this.getMode() !== "source" || !this.editMode.sourceMode) &&
        this.app.vault.getConfig("propertiesInDocument") === "visible"
      );
    };
    t.prototype.undo = function () {
      this.editMode.editor.undo();
    };
    t.prototype.redo = function () {
      this.editMode.editor.redo();
    };
    t.prototype.collapseProperties = function (e) {
      this.metadataEditor.setCollapse(e, !1);
    };
    t.prototype.metadataHasFocus = function () {
      return this.metadataEditor.hasFocus();
    };
    t.prototype.getSelection = function () {
      return this.currentMode.getSelection();
    };
    t.prototype.printToPdf = function () {
      new v0(this.app, this.file).open();
    };
    t.prototype.triggerClickableToken = function (e, t) {
      var n = this;
      if (e.type === "internal-link")
        setTimeout(function () {
          n.app.workspace.openLinkText(e.text, n.file.path, t);
        }, 100);
      else if (e.type === "external-link") window.open(e.text);
      else if (e.type === "tag") {
        var i = e.text;
        if (!i.startsWith("#")) {
          i = "#" + i;
        }
        var r = this.app.internalPlugins.getEnabledPluginById("global-search");
        if (r) {
          r.openGlobalSearch("tag:" + i);
        }
      }
    };
    t.prototype.handleCut = function (e) {
      if (this.metadataEditor.hasFocus()) {
        this.metadataEditor.handleCut(e);
      }
    };
    t.prototype.handleCopy = function (e) {
      if (this.metadataEditor.hasFocus()) {
        this.metadataEditor.handleCopy(e);
      }
    };
    t.prototype.handlePaste = function (e) {
      if (e.clipboardData.getData("obsidian/properties")) {
        this.metadataEditor.handlePaste(e);
      }
    };
    t.VIEW_TYPE = typef00;
    return t;
  })(TextFileView),
  g0 = i18nProxy.editor.printModal,
  v0 = (function (e) {
    function t(t, filen0) {
      var i = e.call(this, t) || this;
      i.file = filen0;
      i.modalEl.addClass("mod-narrow");
      i.titleEl.setText(g0.title());
      var r = i.contentEl;
      r.createEl("p", {
        cls: "u-muted u-break-word",
        text: g0.caption({
          filename: filen0.basename,
        }),
      });
      var o = t.vault.getConfig("pdfExportSettings");
      new Setting(r).setName(g0.settingIncludeFileName()).addToggle(function (e) {
        return e.setValue(o.includeName).then(function (includeName) {
          return (i.includeName = includeName);
        });
      });
      new Setting(r).setName(g0.settingPageSize()).addDropdown(function (e) {
        return e
          .addOption("A3", g0.settingPageSizeA3())
          .addOption("A4", g0.settingPageSizeA4())
          .addOption("A5", g0.settingPageSizeA5())
          .addOption("Legal", g0.settingPageSizeLegal())
          .addOption("Letter", g0.settingPageSizeLetter())
          .addOption("Tabloid", g0.settingPageSizeTabloid())
          .setValue(o.pageSize)
          .then(function (pageSize) {
            return (i.pageSize = pageSize);
          });
      });
      new Setting(r).setName(g0.settingLandscape()).addToggle(function (e) {
        return e.setValue(o.landscape).then(function (landscape) {
          return (i.landscape = landscape);
        });
      });
      new Setting(r).setName(g0.settingMargin()).addDropdown(function (e) {
        return e
          .addOption("0", g0.settingMarginDefault())
          .addOption("2", g0.settingMarginMinimal())
          .addOption("1", g0.settingMarginNone())
          .setValue(o.margin)
          .then(function (marginsType) {
            return (i.marginsType = marginsType);
          });
      });
      new Setting(r).setName(g0.settingDownscalePercent()).addSlider(function (e) {
        return e
          .setLimits(10, 100, 1)
          .setDynamicTooltip()
          .setValue(o.downscalePercent)
          .then(function (scaleFactor) {
            return (i.scaleFactor = scaleFactor);
          });
      });
      i.buttonContainerEl.createEl(
        "button",
        {
          cls: "mod-cta",
          text: g0.buttonExportToPdf(),
        },
        function (ctaEl) {
          i.ctaEl = ctaEl;
          ctaEl.addEventListener("click", function () {
            return __awaiter(i, undefined, undefined, function () {
              var n, i, r, o;
              return __generator(this, function (a) {
                switch (a.label) {
                  case 0:
                    ctaEl.addClass("mod-loading");
                    n = {
                      includeName: this.includeName.getValue(),
                      pageSize: this.pageSize.getValue(),
                      landscape: this.landscape.getValue(),
                      margin: this.marginsType.getValue(),
                      downscalePercent: this.scaleFactor.getValue(),
                    };
                    t.vault.setConfig("pdfExportSettings", n);
                    (i = {}).includeName = n.includeName;
                    i.pageSize = n.pageSize;
                    i.landscape = n.landscape;
                    i.marginsType = parseInt(n.margin);
                    (i.marginsType !== 1 && i.marginsType !== 2) ||
                      (i.margins = {
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                      });
                    i.scaleFactor = n.downscalePercent;
                    i.scale = Math.clamp(i.scaleFactor / 100, 0.1, 2);
                    i.open = true;
                    r = this.file;
                    return [
                      4,
                      loadModule("electron").remote.dialog.showSaveDialog({
                        defaultPath: r.basename + ".pdf",
                        filters: [
                          {
                            name: "PDF Files",
                            extensions: ["pdf"],
                          },
                          {
                            name: "All Files",
                            extensions: ["*"],
                          },
                        ],
                        properties: ["showOverwriteConfirmation"],
                      }),
                    ];
                  case 1:
                    o = a.sent();
                    ctaEl.removeClass("mod-loading");
                    return o.canceled || !o.filePath
                      ? [2]
                      : ((i.filepath = o.filePath), this.close(), [4, this.printToPdf(i)]);
                  case 2:
                    a.sent();
                    return [2];
                }
              });
            });
          });
        },
      );
      i.addCancelButton();
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      var e = this;
      this.win.setTimeout(function () {
        return e.ctaEl.focus();
      });
    };
    t.prototype.printToPdf = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = window.open("about:blank", "_blank", "popup,hide=true");
              n = createEl("base", {
                href: location.href,
              });
              t.document.head.appendChild(n);
              t.document.title = this.file.basename;
              sm(t.document);
              MK(t);
              AK(t);
              EK(t, [n])();
              nJ.instance.setMessage(i18nProxy.dialogue.preparingPdf()).show();
              i = t.document;
              return [4, sleep(200)];
            case 1:
              l.sent();
              i.body.removeClass("theme-dark");
              i.body.addClass("theme-light");
              r = i.body.createDiv("print");
              (o = new Component()).load();
              a = function () {
                r.detach();
                o.unload();
                t.close();
                nJ.instance.hide();
              };
              r.addEventListener("click", a);
              l.label = 2;
            case 2:
              l.trys.push([2, 6, 7, 8]);
              return [4, this.print(r, o, e.includeName)];
            case 3:
              l.sent();
              return [4, sleep(200)];
            case 4:
              l.sent();
              return [4, printToPdf(r.win.electron, e)];
            case 5:
              l.sent();
              new Notice("PDF Saved to ".concat(e.filepath));
              return [3, 8];
            case 6:
              s = l.sent();
              console.error(s);
              new Notice("Failed to save PDF.");
              return [3, 8];
            case 7:
              a();
              return [7];
            case 8:
              return [2];
          }
        });
      });
    };
    t.prototype.testPrint = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              (e = document.body.createDiv("print")).addEventListener("click", function () {
                e.detach();
                t.unload();
              });
              (t = new Component()).load();
              return [4, this.print(e, t, !0)];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.print = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var containerEl, r, o, a, s, l, frontmatter, u, h, p, d, f, m, g, promises, y, w, k;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              containerEl = e.createDiv("markdown-preview-view markdown-rendered");
              o = (r = this).app;
              a = r.file;
              containerEl.toggleClass("rtl", o.vault.getConfig("rightToLeft"));
              containerEl.toggleClass("show-properties", o.vault.getConfig("propertiesInDocument") !== "hidden");
              n &&
                containerEl.createEl("h1", {
                  text: a.basename,
                });
              return [4, this.app.vault.cachedRead(a)];
            case 1:
              for (
                s = b.sent(),
                  l = parseMetadata(s),
                  frontmatter = parseYamlFrontmatter(l),
                  u = renderMarkdown(l),
                  h = sanitizeHTMLToDom(u),
                  p = createFragment(),
                  d = function (e) {
                    e.tagName === "HR"
                      ? p.appendChild(e)
                      : p.createDiv({}, function (t) {
                          return t.appendChild(e);
                        });
                  },
                  f = 0,
                  m = Array.from(h.children);
                f < m.length;
                f++
              ) {
                g = m[f];
                d(g);
              }
              containerEl.appendChild(p);
              containerEl.addClasses(getCssClasses(frontmatter));
              promises = [];
              MarkdownPreviewView.postProcess(o, {
                docId: ic(16),
                sourcePath: a.path,
                frontmatter: frontmatter,
                promises: promises,
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
                el: containerEl,
                displayMode: true,
              });
              return promises.length > 0 ? [4, Promise.all(promises)] : [3, 3];
            case 2:
              b.sent();
              b.label = 3;
            case 3:
              for (y = containerEl.findAll("a.internal-link"), w = 0, k = y; w < k.length; w++)
                k[w].removeAttribute("href");
              return [2, containerEl];
          }
        });
      });
    };
    return t;
  })(GM),
  y0 = {
    Mod: "CommandOrControl",
    Ctrl: "Ctrl",
    Meta: "Command",
    Alt: "Alt",
    Shift: "Shift",
  },
  b0 = (function () {
    function e(app) {
      var t = this;
      this.requestRender = debounce(this.render.bind(this), 200);
      this.onLayoutChange = debounce(this._onLayoutChange.bind(this), 200);
      this.onWindowFrameChange = debounce(this.updateWorkspace.bind(this), 200);
      this.app = app;
      app.workspace.registerEditorExtension(k0());
      app.workspace.on("layout-change", this.onLayoutChange);
      app.workspace.on("window-frame-change", this.onWindowFrameChange);
      Platform.isMacOS && this.app.workspace.on("file-open", this.updateShareMenuItem, this);
      app.workspace.onLayoutReady(function () {
        return t.render();
      });
    }
    e.prototype._onLayoutChange = function () {
      this.updateViewState();
      this.updateWorkspace();
    };
    e.prototype.updateViewState = function () {
      var t = this.app.workspace.getActiveFileView(),
        enabled = false,
        checked = false,
        checkedr0 = false;
      t &&
        t instanceof MarkdownView &&
        ((enabled = true), (checkedr0 = !(checked = t.getMode() === "preview") && t.editMode.sourceMode));
      e.updateMenuItems([
        {
          itemId: "markdown:toggle-preview",
          eState: {
            checked: checked,
            enabled: enabled,
          },
        },
        {
          itemId: "editor:toggle-source",
          eState: {
            checked: checkedr0,
            enabled: enabled && !checked,
          },
        },
      ]);
    };
    e.prototype.updateWorkspace = function () {
      var t = this.app.workspace,
        n = t.leftSplit,
        i = t.rightSplit,
        enabled = activeWindow === window;
      e.updateMenuItems([
        {
          itemId: "app:toggle-left-sidebar",
          eState: {
            checked: n && !(n == null ? undefined : n.collapsed),
            enabled: enabled,
          },
        },
        {
          itemId: "app:toggle-right-sidebar",
          eState: {
            checked: i && !i.collapsed,
            enabled: enabled,
          },
        },
        {
          itemId: "app:toggle-ribbon",
          eState: {
            checked: document.body.hasClass("show-ribbon"),
            enabled: enabled,
          },
        },
      ]);
    };
    e.prototype.updateShareMenuItem = function (t) {
      var n = this.app.vault.adapter;
      if (n instanceof FileSystemAdapter) {
        e.updateMenuItems(
          [
            {
              itemId: "share-menu",
              eState: {
                sharingItem: {
                  filePaths: t ? [n.getFullPath(t.path)] : [],
                },
              },
            },
          ],
          !0,
        );
      }
    };
    e.prototype.buildMenu = function () {
      var e = i18nProxy.menuItems,
        t = __spreadArray(
          __spreadArray(
            [],
            Platform.isMacOS
              ? [
                  {
                    label: "Obsidian",
                    submenu: [
                      {
                        before: ["preferences-section"],
                        appCommand: "app:open-settings",
                        label: "Preferences...",
                      },
                      {
                        type: "separator",
                      },
                    ],
                  },
                ]
              : [],
            !0,
          ),
          [
            {
              label: "&File",
              submenu: __spreadArray(
                __spreadArray(
                  [
                    {
                      before: ["open-section"],
                      appCommand: "file-explorer:new-file",
                      label: e.newFile(),
                    },
                    {
                      before: ["open-section"],
                      appCommand: "file-explorer:new-file-in-new-pane",
                      label: e.newFileToTheRight(),
                    },
                    {
                      before: ["open-section"],
                      type: "separator",
                    },
                    {
                      before: ["open-section"],
                      appCommand: "switcher:open",
                      label: e.openSwitcher(),
                    },
                    {
                      before: ["quit"],
                      type: "separator",
                    },
                    {
                      before: ["quit"],
                      appCommand: "workspace:close",
                      label: e.closeTab(),
                    },
                    {
                      before: ["quit"],
                      appCommand: "workspace:close-window",
                      label: e.closeWindow(),
                    },
                  ],
                  Platform.isMacOS
                    ? [
                        {
                          before: ["quit"],
                          type: "separator",
                        },
                        {
                          id: "share-menu",
                          before: ["quit"],
                          enabled: false,
                          role: "shareMenu",
                        },
                      ]
                    : [],
                  !0,
                ),
                [
                  {
                    before: ["quit"],
                    appCommand: "workspace:export-pdf",
                    label: e.exportPdf(),
                  },
                ],
                !1,
              ),
            },
            {
              label: "&Edit",
              submenu: [
                {
                  id: "find-section",
                  before: ["speech-section"],
                  type: "separator",
                },
                {
                  before: ["speech-section"],
                  appCommand: "editor:open-search",
                  label: e.find(),
                },
                {
                  before: ["speech-section"],
                  appCommand: "editor:open-search-replace",
                  label: e.replace(),
                },
                {
                  type: "separator",
                },
              ],
            },
            {
              label: "&Insert",
              submenu: [
                {
                  appCommand: "editor:insert-wikilink",
                  label: e.insertWikilink(),
                },
                {
                  appCommand: "editor:insert-link",
                  label: e.insertMarkdownLink(),
                },
                {
                  appCommand: "editor:insert-callout",
                  label: e.insertCallout(),
                },
                {
                  appCommand: "editor:insert-blockquote",
                  label: e.insertQuote(),
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "editor:insert-codeblock",
                  label: e.insertCodeblock(),
                },
                {
                  appCommand: "editor:insert-mathblock",
                  label: e.insertMathBlock(),
                },
                {
                  appCommand: "editor:insert-table",
                  label: e.insertTable(),
                },
                {
                  appCommand: "editor:insert-footnote",
                  label: e.insertFootnote(),
                },
                {
                  type: "separator",
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "editor:toggle-bullet-list",
                  label: e.toggleBulletList(),
                },
                {
                  appCommand: "editor:toggle-numbered-list",
                  label: e.toggleNumberedList(),
                },
                {
                  appCommand: "editor:toggle-checklist-status",
                  label: e.toggleChecklist(),
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "editor:attach-file",
                  label: e.insertAttachment(),
                },
                {
                  type: "separator",
                },
                {
                  label: e.foldingMenu(),
                  submenu: [
                    {
                      appCommand: "editor:fold-all",
                      label: e.foldAll(),
                    },
                    {
                      appCommand: "editor:unfold-all",
                      label: e.unfoldAll(),
                    },
                    {
                      type: "separator",
                    },
                    {
                      appCommand: "editor:fold-more",
                      label: e("fold-more"),
                    },
                    {
                      appCommand: "editor:fold-less",
                      label: e("fold-less"),
                    },
                  ],
                },
              ],
            },
            {
              label: "&Format",
              submenu: [
                {
                  id: "heading-indeterminate",
                  label: "Indeterminate heading level",
                  type: "radio",
                  visible: false,
                },
                {
                  appCommand: "editor:set-heading-1",
                  label: e.setHeading({
                    level: 1,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-2",
                  label: e.setHeading({
                    level: 2,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-3",
                  label: e.setHeading({
                    level: 3,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-4",
                  label: e.setHeading({
                    level: 4,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-5",
                  label: e.setHeading({
                    level: 5,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-6",
                  label: e.setHeading({
                    level: 6,
                  }),
                  type: "radio",
                },
                {
                  appCommand: "editor:set-heading-0",
                  label: e.noHeading(),
                  type: "radio",
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "editor:toggle-bold",
                  label: e.toggleBold(),
                  type: "checkbox",
                },
                {
                  appCommand: "editor:toggle-italics",
                  label: e.toggleItalics(),
                  type: "checkbox",
                },
                {
                  appCommand: "editor:toggle-code",
                  label: e.toggleCode(),
                  type: "checkbox",
                },
                {
                  appCommand: "editor:toggle-highlight",
                  label: e.toggleHighlight(),
                  type: "checkbox",
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "editor:toggle-strikethrough",
                  label: e.toggleStrikethrough(),
                  type: "checkbox",
                },
                {
                  appCommand: "editor:toggle-inline-math",
                  label: e.toggleInlineMath(),
                  type: "checkbox",
                },
                {
                  appCommand: "editor:toggle-comments",
                  label: e.toggleComment(),
                  type: "checkbox",
                },
                {
                  type: "separator",
                },
              ],
            },
            {
              label: "&View",
              submenu: [
                {
                  type: "checkbox",
                  appCommand: "markdown:toggle-preview",
                  label: e.readingView(),
                },
                {
                  type: "checkbox",
                  appCommand: "editor:toggle-source",
                  label: e.sourceMode(),
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "app:toggle-left-sidebar",
                  label: e.toggleLeftSidebar(),
                  type: "checkbox",
                },
                {
                  appCommand: "app:toggle-right-sidebar",
                  label: e.toggleRightSidebar(),
                  type: "checkbox",
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "app:toggle-ribbon",
                  label: e.toggleRibbon(),
                  type: "checkbox",
                },
                {
                  type: "separator",
                },
                {
                  appCommand: "workspace:split-vertical",
                  label: e.splitRight(),
                },
                {
                  appCommand: "workspace:split-horizontal",
                  label: e.splitDown(),
                },
                {
                  type: "separator",
                },
                {
                  before: ["developer-section"],
                  label: e.navigateBack(),
                  appCommand: "app:go-back",
                },
                {
                  before: ["developer-section"],
                  label: e.navigateForward(),
                  appCommand: "app:go-forward",
                },
                {
                  before: ["developer-section"],
                  type: "separator",
                },
              ],
            },
            {
              label: "&Help",
              role: "help",
              submenu: [
                {
                  label: e.releaseNotes(),
                  appCommand: "app:show-release-notes",
                  before: ["help-links"],
                },
                {
                  appCommand: "app:show-debug-info",
                  label: e.showDebugInfo(),
                },
                {
                  appCommand: "app:open-sandbox-vault",
                  label: e.openSandbox(),
                },
              ],
            },
          ],
          !1,
        );
      this.applyHotkeys(t);
      this.hideUnregisteredCommands(t);
      return t;
    };
    e.prototype.render = function () {
      var template = this.buildMenu();
      callbackWithElectron(function (t) {
        t.ipcRenderer.send("set-menu", {
          template: template,
        });
      });
    };
    e.prototype.getAcceleratorFromHotkey = function (e) {
      if (!e) return "";
      var t = [];
      modifierPriorityOrder.forEach(function (n) {
        var i;
        if ((i = e.modifiers) === null || undefined === i ? undefined : i.contains(n)) {
          t.push(y0[n]);
        }
      });
      e.key && t.push(e.key.replace("Arrow", ""));
      return t.join("+");
    };
    e.prototype.applyHotkeys = function (e) {
      for (var t = 0, n = e; t < n.length; t++) {
        var i = n[t];
        if ("appCommand" in i) {
          var r = this.app.hotkeyManager.getHotkeys(i.appCommand),
            o = this.app.hotkeyManager.getDefaultHotkeys(i.appCommand),
            a = (r == null ? undefined : r[0]) || (o == null ? undefined : o[0]) || null;
          i.accelerator = this.getAcceleratorFromHotkey(a);
          i.registerAccelerator = false;
        }
        if ("submenu" in i) {
          this.applyHotkeys(i.submenu);
        }
      }
    };
    e.prototype.hideUnregisteredCommands = function (e) {
      for (var t = 0, n = e; t < n.length; t++) {
        var i = n[t];
        "appCommand" in i && (this.app.commands.findCommand(i.appCommand) || (i.visible = false));
        "submenu" in i && this.hideUnregisteredCommands(i.submenu);
      }
    };
    e.updateMenuItems = function (e, t) {
      undefined === t && (t = false);
      callbackWithElectron(function (n) {
        n.ipcRenderer.send("update-menu-items", e, t);
      });
    };
    return e;
  })();
const w0 = b0;
function k0() {
  return [
    ViewPlugin.fromClass(
      (function () {
        function e(view) {
          this.view = view;
          this.update = debounce(this.rawUpdate, 500, !0);
        }
        e.prototype.destroy = function () {
          this.update.cancel();
        };
        e.prototype.rawUpdate = function (e) {
          var t = e.view.state,
            n = af(t, t.selection.ranges[0]);
          b0.updateMenuItems([
            n.uniformHeading
              ? {
                  itemId: "editor:set-heading-".concat(n.headingLevel),
                  eState: {
                    checked: !0,
                  },
                }
              : {
                  itemId: "heading-indeterminate",
                  eState: {
                    checked: !0,
                  },
                },
            {
              itemId: "editor:toggle-italics",
              eState: {
                checked: !!n.italic,
              },
            },
            {
              itemId: "editor:toggle-bold",
              eState: {
                checked: !!n.bold,
              },
            },
            {
              itemId: "editor:toggle-code",
              eState: {
                checked: !!n.code,
              },
            },
            {
              itemId: "editor:toggle-highlight",
              eState: {
                checked: !!n.highlight,
              },
            },
            {
              itemId: "editor:toggle-comments",
              eState: {
                checked: !!n.comment,
              },
            },
            {
              itemId: "editor:toggle-strikethrough",
              eState: {
                checked: !!n.strikethrough,
              },
            },
          ]);
        };
        return e;
      })(),
    ),
  ];
}
var C0 = (function () {
    function e(app) {
      this.app = app;
    }
    e.prototype.cleanup = function () {
      var e = this.app,
        t = this.app.appId + "-note-fold-";
      for (var n in localStorage)
        if (n.startsWith(t)) {
          var i = n.substr(t.length);
          if (!e.vault.getAbstractFileByPath(i)) {
            localStorage.removeItem(n);
          }
        }
    };
    e.prototype.loadPath = function (e) {
      return this.app.loadLocalStorage("note-fold-" + e);
    };
    e.prototype.load = function (e) {
      return e ? this.loadPath(e.path) : null;
    };
    e.prototype.savePath = function (e, t) {
      t && t.folds.length === 0 && (t = null);
      return this.app.saveLocalStorage("note-fold-" + e, t);
    };
    e.prototype.save = function (e, t) {
      if (e) {
        this.savePath(e.path, t);
      }
    };
    return e;
  })(),
  E0 = (function () {
    function e(app) {
      var t = this;
      this.isVisible = false;
      this.app = app;
      this.showRibbonMenu = this.showRibbonMenu.bind(this);
      this.onRibbonMenuClick = this.showRibbonMenu;
      this.containerEl = createDiv("mobile-navbar", function (n) {
        n.createDiv("mobile-navbar-actions", function (n) {
          n.createDiv("mobile-navbar-action mobile-navbar-action-back", function (n) {
            t.backButtonEl = Tj(
              app,
              function () {
                return app.workspace.activeLeaf;
              },
              "backward",
            );
            setIcon(t.backButtonEl, "lucide-chevron-left");
            n.appendChild(t.backButtonEl);
          });
          n.createDiv("mobile-navbar-action mobile-navbar-action-forward", function (n) {
            t.forwardButtonEl = Tj(
              app,
              function () {
                return app.workspace.activeLeaf;
              },
              "forward",
            );
            setIcon(t.forwardButtonEl, "lucide-chevron-right");
            n.appendChild(t.forwardButtonEl);
          });
          n.createDiv("mobile-navbar-action mobile-navbar-action-quick-switcher", function (t) {
            t.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-search");
            });
            t.addEventListener("click", function () {
              var t, n;
              if (
                !(
                  (n =
                    (t = app.internalPlugins.getPluginById("switcher")) === null || undefined === t
                      ? undefined
                      : t.instance) === null || undefined === n
                )
              ) {
                n.onOpen();
              }
            });
          });
          n.createDiv("mobile-navbar-action mobile-navbar-action-new-tab", function (t) {
            t.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-plus");
            });
            t.addEventListener("click", function () {
              if (!app.workspace.getActiveViewOfType(Pj)) {
                app.commands.executeCommandById("workspace:new-tab");
              }
            });
          });
          n.createDiv("mobile-navbar-action mobile-navbar-action-tabs", function (e) {
            e.createDiv("clickable-icon", function (e) {
              setIcon(e, "tab-frame");
              t.tabButtonEl = e.createDiv("mobile-navbar-tabs-number");
            });
            e.addEventListener("click", function (e) {
              e.preventDefault();
              t.app.mobileTabSwitcher.show();
            });
            e.addEventListener("contextmenu", function (e) {
              return t.app.mobileTabSwitcher.showTabManagementMenu(e);
            });
          });
          n.createDiv("mobile-navbar-action mobile-navbar-action-menu has-longpress-menu", function (e) {
            t.ribbonMenuItemEl = e.createSpan("clickable-icon", function (e) {
              e.addEventListener("click", function (e) {
                return t.onRibbonMenuClick(e);
              });
              e.addEventListener("contextmenu", t.showRibbonMenu);
              setIcon(e, "lucide-menu");
            });
            t.ribbonMenuFlairEl = e.createDiv("navbar-action-flair", function (e) {
              return setIcon(e, "chevrons-up-down");
            });
          });
        });
      });
      var n = function () {
        var n = 0;
        app.workspace.iterateRootLeaves(function () {
          n++;
        });
        t.tabButtonEl.setText(String(n));
      };
      app.workspace.onLayoutReady(function () {
        n();
        t.updateRibbonMenuItem();
      });
      app.workspace.on("active-leaf-change", this.updateNavButtons, this);
      app.workspace.on("layout-change", n);
      window.addEventListener("keyboardWillHide", function () {
        t.show();
      });
      window.addEventListener("keyboardWillShow", function () {
        t.hide();
      });
      this.show();
    }
    e.prototype.updateRibbonMenuItem = function () {
      var e,
        t = this.app.workspace.leftRibbon.items,
        n = this.app.vault.getConfig("mobileQuickRibbonItem");
      n &&
        (e = t.find(function (e) {
          return e.id === n;
        }));
      this.ribbonMenuFlairEl.toggle(!!e);
      e
        ? ((this.onRibbonMenuClick = e.callback), setIcon(this.ribbonMenuItemEl, e.icon))
        : ((this.onRibbonMenuClick = this.showRibbonMenu), setIcon(this.ribbonMenuItemEl, "lucide-menu"));
    };
    e.prototype.showRibbonMenu = function (e) {
      e.preventDefault();
      for (
        var t = this.app.workspace.leftRibbon.items,
          n = this.app.vault.getConfig("mobileQuickRibbonItem"),
          i = new Menu(),
          r = function (e) {
            if (e.hidden) return "continue";
            i.addItem(function (t) {
              return t
                .setTitle(e.title)
                .setIcon(e.icon)
                .setChecked(n && e.id === n)
                .onClick(function (t) {
                  e.callback(t);
                });
            });
          },
          o = 0,
          a = t;
        o < a.length;
        o++
      ) {
        r(a[o]);
      }
      var s = this.ribbonMenuItemEl.getBoundingClientRect();
      i.setParentElement(this.ribbonMenuItemEl).showAtPosition({
        x: s.x,
        y: s.bottom,
        width: s.width,
        overlap: true,
        left: true,
      });
    };
    e.prototype.updateNavButtons = function () {
      var e = this.app.workspace.activeLeaf;
      if (e) {
        var t = e.history,
          n = t.backHistory,
          i = t.forwardHistory;
        this.backButtonEl.ariaDisabled = String(n.length === 0);
        this.forwardButtonEl.ariaDisabled = String(i.length === 0);
      }
    };
    e.prototype.show = function () {
      if (!(this.isVisible || this.app.mobileToolbar.isVisible || Platform.mobileSoftKeyboardVisible)) {
        this.isVisible = true;
        this.app.dom.appContainerEl.appendChild(this.containerEl);
      }
    };
    e.prototype.hide = function () {
      this.isVisible = false;
      this.containerEl.detach();
    };
    return e;
  })(),
  S0 = (function () {
    function e(leaf, switcher) {
      var n = this;
      this.app = leaf.app;
      this.leaf = leaf;
      this.switcher = switcher;
      this.containerEl = createDiv("mobile-tab", function (i) {
        var r = i.createDiv("mobile-tab-preview"),
          o = r.createDiv("mobile-tab-pin", function (e) {
            setIcon(e, "lucide-pin");
            e.addEventListener("click", function (e) {
              e.preventDefault();
              n.leaf.setPinned(!1);
            });
          }),
          a = r.createDiv("close-button", function (e) {
            setIcon(e, "lucide-x");
            e.addEventListener("click", function (e) {
              e.preventDefault();
              n.containerEl.detach();
              n.leaf.detach();
            });
          });
        o.toggle(leaf.pinned);
        a.toggle(!leaf.pinned);
        leaf.on("pinned-change", function () {
          o.toggle(n.leaf.pinned);
          a.toggle(!n.leaf.pinned);
        });
        var s = (n.previewImgEl = r.createEl("img", "mobile-tab-preview-embed"));
        setIcon((n.placeholderEl = r.createDiv("mobile-tab-preview-empty")), leaf.getIcon());
        s.src = switcher.cacheDir + "leaf-".concat(leaf.id, ".png") + "?" + Date.now();
        s.addEventListener("error", function (e) {
          n.togglePlaceholder(!0);
        });
        s.addEventListener("load", function (t) {
          n.togglePlaceholder(leaf.view instanceof Pj);
        });
        n.titleEl = i.createDiv({
          cls: "mobile-tab-title",
          text: leaf.getDisplayText(),
        });
        i.addEventListener("click", function (e) {
          if (!e.defaultPrevented) {
            e.preventDefault();
            n.onClick();
          }
        });
        i.addEventListener("contextmenu", function (t) {
          if (!t.defaultPrevented) {
            t.preventDefault();
            leaf.onOpenTabHeaderMenu(t, i);
          }
        });
      });
    }
    e.prototype.togglePlaceholder = function (e) {
      this.placeholderEl.toggle(e);
      this.previewImgEl.toggle(!e);
    };
    e.prototype.onClick = function () {
      this.app.workspace.setActiveLeaf(this.leaf);
      this.switcher.hide();
    };
    e.prototype.render = function () {
      var e = this.containerEl,
        t = this.leaf;
      e.removeClass("is-active");
      this.titleEl.setText(t.getDisplayText());
    };
    return e;
  })(),
  M0 = (function () {
    function e(app) {
      var t = this;
      this.cacheDir = "";
      this.tabPreviewLookup = new WeakMap();
      this.isVisible = false;
      this.requestRender = debounce(function () {
        return t.render();
      }, 100);
      this.app = app;
      this.containerEl = createDiv("mobile-tab-switcher");
      this.scrollEl = this.containerEl.createDiv("mobile-tab-switcher-scroll");
      this.innerScrollEl = this.scrollEl.createDiv("mobile-tab-switcher-inner-scroll");
      var n = (this.menuBarEl = this.containerEl.createDiv("mobile-tab-switcher-menubar"));
      n.createDiv("mobile-tab-switcher-menu-spacer", function (n) {
        n.createDiv(
          {
            cls: "clickable-icon",
          },
          function (n) {
            setIcon(n, "lucide-plus");
            n.addEventListener("click", function (n) {
              app.commands.executeCommandById("workspace:new-tab");
              t.hide();
            });
          },
        );
      });
      n.createDiv(
        {
          cls: "mobile-tab-switcher-menu-button tappable",
        },
        function (e) {
          t.tabCountEl = e.createSpan();
          setIcon(e.createSpan("mobile-tab-switcher-menu-button-chevron"), "lucide-chevron-down");
        },
      ).addEventListener("click", function (e) {
        return t.showTabManagementMenu(e);
      });
      n.createDiv("mobile-tab-switcher-menu-spacer", function (e) {
        e.createDiv(
          {
            cls: "clickable-icon",
            text: i18nProxy.dialogue.buttonDone(),
          },
          function (e) {
            e.addEventListener("click", function (e) {
              t.hide();
            });
          },
        );
      });
      this.setupCacheDir();
      Platform.isMobileApp &&
        capacitorAppPlugin &&
        capacitorAppPlugin.addListener("screenshotSaved", function (e) {
          for (
            var n = CapacitorCore.Capacitor.convertFileSrc(e.uri), i = 0, r = t.innerScrollEl.findAll("img");
            i < r.length;
            i++
          ) {
            var o = r[i];
            if (o.src.startsWith(n)) return void (o.src = n + "?" + Date.now());
          }
        });
      app.workspace.on("layout-change", this.onLayoutChange, this);
    }
    e.prototype.onLayoutChange = function () {
      if (this.isVisible) {
        this.requestRender();
      }
    };
    e.prototype.setupCacheDir = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e = this.app;
              return Platform.isMobileApp && filesystemPlugin
                ? [
                    4,
                    filesystemPlugin.getUri({
                      path: "".concat(e.appId, "/tab-preview"),
                      directory: zX.Cache,
                    }),
                  ]
                : [3, 2];
            case 1:
              t = n.sent();
              this.cacheDir = CapacitorCore.Capacitor.convertFileSrc(t.uri);
              this.cacheDir.endsWith("/") || (this.cacheDir += "/");
              n.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    e.prototype.render = function () {
      var e = this,
        t = this.app,
        n = this.tabPreviewLookup,
        count = 0;
      t.workspace.iterateRootLeaves(function () {
        count++;
      });
      var r = function (t) {
          for (
            var i, r = e.innerScrollEl.createDiv("mobile-tab-group-container"), o = 0, a = t.children;
            o < a.length;
            o++
          ) {
            var s = a[o],
              l = r.createDiv("mobile-tab-wrapper"),
              c = (i = n.get(s)) !== null && undefined !== i ? i : new S0(s, e);
            n.set(s, c);
            c.render();
            l.append(c.containerEl);
          }
          return r;
        },
        o = [],
        a = function (e) {
          for (var t = 0, n = e.children; t < n.length; t++) {
            var i = n[t];
            i instanceof WorkspaceTabs ? o.push(r(i)) : i instanceof WorkspaceSplit && a(i);
          }
        };
      a(t.workspace.rootSplit);
      this.innerScrollEl.setChildrenInPlace(o);
      this.tabCountEl.setText(
        i18nProxy.nouns.tabsWithCount({
          count: count,
        }),
      );
      var s = this.app.workspace.getMostRecentLeaf();
      if (s) {
        var l = this.tabPreviewLookup.get(s);
        if (!(l == null)) {
          l.containerEl.addClass("is-active");
        }
      }
    };
    e.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, rect, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              this.isVisible = true;
              NM(this);
              return (e = this.app.workspace.getMostRecentLeaf()) && Platform.isMobileApp && capacitorAppPlugin
                ? ((t = e.view),
                  (n = t.containerEl),
                  t instanceof ItemView && t.contentEl.isShown() && (n = t.contentEl),
                  document.body.addClass("is-screenshotting"),
                  [4, nextFrame()])
                : [3, 6];
            case 1:
              p.sent();
              i = n.getBoundingClientRect();
              r = i.x;
              o = i.y;
              a = i.width;
              s = i.height;
              rect =
                a > 0 && s > 0
                  ? {
                      x: Math.round(r),
                      y: Math.round(o),
                      width: Math.round(a),
                      height: Math.round(s),
                    }
                  : undefined;
              p.label = 2;
            case 2:
              p.trys.push([2, 4, 5, 6]);
              return [
                4,
                capacitorAppPlugin.takeScreenshot({
                  path: "".concat(this.app.appId, "/tab-preview/leaf-").concat(e.id, ".png"),
                  rect: rect,
                }),
              ];
            case 3:
              p.sent();
              return [3, 6];
            case 4:
              c = p.sent();
              console.error(c);
              return [3, 6];
            case 5:
              document.body.removeClass("is-screenshotting");
              return [7];
            case 6:
              this.render();
              document.body.appendChild(this.containerEl);
              (u = this.app.workspace.getMostRecentLeaf()) &&
                ((h = this.tabPreviewLookup.get(u)) == null ||
                  h.containerEl.scrollIntoView({
                    block: "nearest",
                  }));
              fl(
                this.containerEl,
                new cl({
                  duration: 90,
                  fn: "var(--anim-motion-swing)",
                })
                  .addProp("opacity", "0", "1", "")
                  .addProp("transform", "scale(1.1)", "scale(1)", ""),
              );
              return [2];
          }
        });
      });
    };
    e.prototype.showTabManagementMenu = function (e) {
      var t = this,
        n = Menu.forEvent(e);
      n.addSections(["open", "danger"]);
      n.addItem(function (e) {
        return e
          .setTitle(i18nProxy.commands.newTab())
          .setIcon("lucide-plus-circle")
          .setSection("open")
          .onClick(function () {
            t.app.commands.executeCommandById("workspace:new-tab");
          });
      }).addItem(function (e) {
        return e
          .setTitle(i18nProxy.commands.undoCloseTab())
          .setSection("open")
          .setIcon("lucide-undo-2")
          .setDisabled(!t.app.workspace.hasUndoHistory())
          .onClick(function () {
            t.app.commands.executeCommandById("workspace:undo-close-pane");
          });
      });
      var i = this.app.workspace.getMostRecentLeaf(),
        r = [];
      i && (r = i.parent.children.slice());
      r.length > 1 &&
        n.addItem(function (e) {
          return e
            .setTitle(
              i18nProxy.interface.menu.closeTabsWithCount({
                count: r.length,
              }),
            )
            .setIcon("lucide-archive-x")
            .setDisabled(!i)
            .setSection("danger")
            .setWarning(!0)
            .onClick(function () {
              if (i)
                for (var e = 0, t = r; e < t.length; e++) {
                  t[e].detach();
                }
            });
        });
      this.isVisible ||
        n.addItem(function (e) {
          return e
            .setTitle(i18nProxy.interface.menu.close())
            .setSection("danger")
            .setDisabled(!i)
            .setWarning(!0)
            .setIcon("lucide-x")
            .onClick(function () {
              if (!(i == null)) {
                i.detach();
              }
            });
        });
    };
    e.prototype.hide = function () {
      var e = this.containerEl;
      this.isVisible = false;
      RM(this);
      fl(
        e,
        new cl({
          duration: 90,
          fn: easeOutSine,
        })
          .addProp("opacity", "1", "0", "")
          .addProp("transform", "scale(1)", "scale(1.1)", ""),
        function () {
          return e.detach();
        },
      );
    };
    e.prototype.close = function () {
      this.hide();
    };
    return e;
  })(),
  x0 = (function () {
    function e(app) {
      var t = this;
      this.isVisible = false;
      this.isMultiWindowMode = false;
      this.hasKeyboard = false;
      this.lastCommandIds = "";
      this.app = app;
      this.spacerEl = createDiv("mobile-toolbar-spacer");
      var n = (this.wrapperEl = createDiv("mobile-toolbar")),
        i = (this.containerEl = n.createDiv("mobile-toolbar-options-container"));
      this.optionsListEl = i.createDiv("mobile-toolbar-options-list");
      Platform.isIosApp &&
        Platform.isMobile &&
        (applyScrollFadeEffect(i, this.optionsListEl),
        i.createDiv("mobile-toolbar-floating-options", function (e) {
          e.createDiv("mobile-toolbar-option", function (e) {
            setIcon(e, "keyboard-toggle");
            e.addEventListener("mousedown", function (e) {
              return e.preventDefault();
            });
            e.addEventListener("click", function (e) {
              t.app.commands.executeCommandById("editor:toggle-keyboard", e);
              e.preventDefault();
            });
          });
        }));
      this.update = debounce(this.update.bind(this), 0, !0);
      window.addEventListener("keyboardWillHide", function (e) {
        if (!e.hasPhysicalKeyboard) {
          t.hasKeyboard = false;
          t.update();
        }
      });
      window.addEventListener("keyboardWillShow", function () {
        t.hasKeyboard = true;
        t.update();
      });
      Platform.isAndroidApp &&
        (window.addEventListener("multiWindowModeChanged", function (e) {
          t.isMultiWindowMode = e.isMultiWindowMode;
          t.update();
        }),
        keyboardPlugin &&
          keyboardPlugin.isMultiWindowMode().then(function (e) {
            t.isMultiWindowMode = e.isMultiWindowMode;
            t.update();
          }));
    }
    e.prototype.compileToolbar = function () {
      var e = this.app,
        t = this.optionsListEl,
        n = e.vault.getConfig("mobileToolbarCommands"),
        lastCommandIds = JSON.stringify(n);
      if (lastCommandIds !== this.lastCommandIds) {
        t.empty();
        for (
          var r = e.commands,
            o = function (e) {
              var n = r.findCommand(e);
              if (!n) return "continue";
              t.createDiv("mobile-toolbar-option", function (t) {
                var i = n.icon;
                i || (i = "question-mark-glyph");
                setIcon(t, i);
                t.addEventListener("click", function (t) {
                  r.executeCommandById(e, t);
                  t.preventDefault();
                });
                t.addEventListener("mousedown", function (e) {
                  e.preventDefault();
                });
              });
            },
            a = 0,
            s = n;
          a < s.length;
          a++
        ) {
          o(s[a]);
        }
        this.lastCommandIds = lastCommandIds;
      }
    };
    e.prototype.update = function () {
      var e,
        t = this.app,
        n = this.isVisible;
      ((e = t.workspace.activeEditor) === null || undefined === e ? undefined : e.editor.hasFocus()) &&
      (this.hasKeyboard || this.isMultiWindowMode)
        ? n || this.show()
        : n && this.hide();
    };
    e.prototype.show = function () {
      if (this.app.vault.getConfig("mobileToolbarCommands").length !== 0) {
        if ((this.app.mobileNavbar.hide(), !this.isVisible)) {
          this.isVisible = true;
          this.compileToolbar();
          var e = this,
            t = e.app,
            n = e.spacerEl,
            i = e.wrapperEl;
          if (
            (t.dom.appContainerEl.appendChild(n),
            t.dom.appContainerEl.appendChild(i),
            document.body.addClass("mod-toolbar-open"),
            Platform.isMobileApp)
          ) {
            var r = getComputedStyle(document.documentElement).getPropertyValue("--keyboard-height");
            Platform.isIosApp &&
              fl(
                i,
                new cl({
                  duration: 300,
                  fn: "cubic-bezier(.12,0,.44,.99)",
                }).addProp("transform", "translateY(".concat(r, ")"), ""),
              );
            Platform.isAndroidApp &&
              fl(
                i,
                new cl({
                  duration: 350,
                  fn: "cubic-bezier(.22,.25,0,1)",
                }).addProp("transform", "translateY(".concat(r, ")"), ""),
              );
          }
        }
      } else this.hide();
    };
    e.prototype.hide = function () {
      this.isVisible = false;
      this.spacerEl.detach();
      this.wrapperEl.detach();
      this.app.mobileNavbar.show();
      document.body.removeClass("mod-toolbar-open");
    };
    return e;
  })(),
  T0 = i18nProxy.plugins.search,
  D0 = (function () {
    function e() {
      this.id = "global-search";
      this.name = T0.name();
      this.description = T0.desc();
      this.defaultOn = true;
      this.app = null;
      this.plugin = null;
      this.options = {};
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.plugin = plugin;
      plugin.registerGlobalCommand({
        id: "global-search:open",
        name: T0.actionOpenSearch(),
        icon: "lucide-search",
        callback: function () {
          var t = window.getSelection().toString(),
            i = app.workspace.getActiveViewOfType(MarkdownView);
          if (i) {
            var r = i.getSelection();
            if (r) {
              t = r;
            }
          }
          t ? t.contains(" ") && (t = '"'.concat(t.replace(/\\/, "\\\\").replace(/"/, '\\"'), '"')) : (t = null);
          n.openGlobalSearch(t);
        },
        hotkeys: [BO(["Mod", "Shift"], "F")],
      });
      plugin.registerViewType(A0, function (e) {
        return new P0(e);
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t.registerEvent(e.workspace.on("layout-ready", this.initLeaf, this));
              t.registerEvent(e.workspace.on("editor-menu", this.onEditorMenu, this));
              t.registerEvent(e.workspace.on("file-menu", this.onFileMenu, this));
              n = this;
              return [4, t.loadData()];
            case 1:
              n.options = i.sent() || {};
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
    e.prototype.onUserEnable = function () {
      this.initLeaf();
    };
    e.prototype.initLeaf = function () {
      this.app.workspace.ensureSideLeaf(A0, "left", {
        reveal: !1,
      });
    };
    e.prototype.onFileMenu = function (e, t, n) {
      var i = this;
      if (n === "file-explorer-context-menu" && t instanceof TFolder) {
        t.isRoot() ||
          e.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(T0.menuOptSearchInFolder())
              .setIcon("lucide-folder-search")
              .onClick(function () {
                i.openGlobalSearch('path:"'.concat(t.path, '/" '));
              });
          });
      }
    };
    e.prototype.onEditorMenu = function (e, t) {
      var n = this,
        i = t.getSelection();
      if (i) {
        e.addItem(function (e) {
          return e
            .setTitle(
              T0.menuOptSearchFor({
                keyword: hc(i, 25),
              }),
            )
            .setIcon("lucide-search")
            .setSection("view")
            .onClick(function () {
              i.contains(" ") && (i = '"'.concat(i.replace(/\\/g, "\\\\").replace(/"/g, '\\"'), '"'));
              n.openGlobalSearch(i);
            });
        });
      }
    };
    e.prototype.openGlobalSearch = function (query) {
      this.app.workspace.ensureSideLeaf(A0, "left", {
        active: true,
        reveal: true,
        state: {
          query: query,
        },
      });
    };
    e.prototype.getGlobalSearchQuery = function () {
      var e,
        t = this.app.workspace.getLeavesOfType(A0);
      if (t.length === 0) return "";
      var n = t[0].getViewState();
      return String.isString((e = n == null ? undefined : n.state) === null || undefined === e ? undefined : e.query)
        ? n.state.query
        : "";
    };
    return e;
  })(),
  A0 = "search",
  P0 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-search";
      n.searchContainerEl = null;
      n.searchInfoEl = null;
      n.infoEl = null;
      n.resultCountEl = null;
      n.matchingCase = false;
      n.explainSearch = false;
      n.showParams = false;
      n.searchQuery = null;
      n.requestSaveSearch = debounce(n.saveSearch.bind(n), 5e3, !0);
      var i = n.containerEl,
        r = createDiv("search-result-container mod-global-search");
      n.dom = new pN(n.app, r, T0.labelNoMatches());
      var o = debounce(n.startSearch.bind(n), 0),
        a = i.createDiv("search-row");
      new SearchComponent(a)
        .setPlaceholder(T0.promptStartSearch())
        .setClass("global-search-input-container")
        .addRightDecorator(function (matchingCaseButtonEl) {
          n.matchingCaseButtonEl = matchingCaseButtonEl;
          setTooltip(matchingCaseButtonEl, T0.labelMatchCase());
          setIcon(matchingCaseButtonEl, "uppercase-lowercase-a");
          matchingCaseButtonEl.addClass("clickable-icon");
          matchingCaseButtonEl.addEventListener("click", function () {
            return n.setMatchingCase(!n.matchingCase);
          });
        })
        .onChange(function (e) {
          n.dom.setFocusedItem(null);
          n.stopSearch();
          e ? o() : (n.startSearch(), n.infoEl.hide());
        })
        .then(function (searchComponent) {
          setTooltip(searchComponent.clearButtonEl, T0.tooltipClearSearch());
          n.searchComponent = searchComponent;
          n.searchComponent.inputEl.addEventListener("keypress", function (e) {
            if (!(e.isComposing || e.key !== "Enter")) {
              Platform.hasPhysicalKeyboard || clearFocusAndSelection();
              n.startSearch();
            }
          });
          Platform.isMobile &&
            searchComponent.containerEl.createDiv("search-input-suggest-button", function (t) {
              setIcon(t, "right-triangle");
              t.addEventListener("click", function () {
                TJ.showOnce(n.app, searchComponent.inputEl, !0);
              });
            });
        });
      n.searchInfoEl = i.createDiv({
        cls: "search-info-container",
      });
      n.searchInfoEl.hide();
      n.filterSectionToggleEl = a.createDiv("clickable-icon", function (e) {
        setTooltip(e, T0.labelToggleSearchSettings());
        setIcon(e, "lucide-sliders-horizontal");
        e.addEventListener("click", function (e) {
          n.toggleFilterSection();
        });
      });
      n.searchParamsContainerEl = i.createDiv("search-params", function (e) {
        new Setting(e)
          .setName(T0.labelCollapseResults())
          .setClass("mod-toggle")
          .addToggle(function (collapseResultsToggle) {
            n.collapseResultsToggle = collapseResultsToggle;
            collapseResultsToggle.setSmall().onChange(function (e) {
              return n.setCollapseAll(e);
            });
          });
        new Setting(e)
          .setName(T0.labelMoreContext())
          .setClass("mod-toggle")
          .addToggle(function (extraContextToggle) {
            n.extraContextToggle = extraContextToggle;
            extraContextToggle.setSmall().onChange(function (e) {
              return n.setExtraContext(e);
            });
          });
        new Setting(e)
          .setName(T0.labelExplainSearchTerm())
          .setClass("mod-toggle")
          .addToggle(function (explainSearchToggle) {
            n.explainSearchToggle = explainSearchToggle;
            explainSearchToggle.setSmall().onChange(function (e) {
              return n.setExplainSearch(e);
            });
          });
      });
      n.searchParamsContainerEl.hide();
      n.infoEl = i.createDiv("search-results-info", function (e) {
        e.createDiv("clickable-icon search-results-result-count", function (e) {
          n.resultCountEl = e.createSpan();
          e.createDiv("more-options-icon", function (e) {
            setIcon(e, "lucide-more-horizontal");
          });
          e.addEventListener("click", function (t) {
            if (!e.classList.contains("has-active-menu")) {
              var i = new Menu().addSections(["action"]).addItem(function (e) {
                return e
                  .setSection("action")
                  .setIcon("lucide-copy")
                  .setTitle(T0.labelCopySearchResults())
                  .onClick(n.onCopyResultsClick.bind(n));
              });
              n.app.workspace.trigger("search:results-menu", i, n);
              i.setParentElement(e).showAtMouseEvent(t);
            }
          });
        });
        for (
          var t = (n.sortOrderDropdown = new DropdownComponent(e).onChange(function (e) {
              n.setSortOrder(e);
              n.app.workspace.requestSaveLayout();
            })),
            i = 0,
            r = _F;
          i < r.length;
          i++
        )
          for (var o = 0, a = r[i]; o < a.length; o++) {
            var s = a[o],
              l = jF[s]();
            t.addOption(s, l);
          }
        t.setValue("alphabetical");
      });
      n.infoEl.hide();
      n.containerEl.appendChild(r);
      n.scope = new Scope(n.app.scope);
      n.scope.register([], "Enter", n.onKeyEnterInFocus.bind(n));
      n.scope.register(["Mod"], "Enter", n.onKeyEnterInFocus.bind(n));
      n.scope.register([], "ArrowDown", n.onKeyArrowDownInFocus.bind(n));
      n.scope.register([], "ArrowUp", n.onKeyArrowUpInFocus.bind(n));
      n.scope.register([], "ArrowLeft", n.onKeyArrowLeftInFocus.bind(n));
      n.scope.register([], "ArrowRight", n.onKeyArrowRightInFocus.bind(n));
      n.scope.register(["Shift"], "ArrowUp", n.onKeyShowMoreBefore.bind(n));
      n.scope.register(["Shift"], "ArrowDown", n.onKeyShowMoreAfter.bind(n));
      n.queue = new hR(n.app, n.dom);
      n.addChild(n.queue);
      Platform.isMobile || TJ.attach(n.app, n.searchComponent.inputEl, !0);
      return n;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          this.registerDomEvent(this.leaf.tabHeaderEl, "click", this.onTabHeaderClick.bind(this));
          return [2, e.prototype.onOpen.call(this)];
        });
      });
    };
    t.prototype.toggleFilterSection = function () {
      this.showParams = !this.showParams;
      this.filterSectionToggleEl.toggleClass("is-active", this.showParams);
      this.searchParamsContainerEl.toggle(this.showParams);
    };
    t.prototype.saveSearch = function () {
      var e = this.searchComponent.getValue();
      if (e) {
        var t = this.app.loadLocalStorage("recent-searches");
        (t && Array.isArray(t)) || (t = []);
        t.remove(e);
        t.unshift(e);
        t.length > 20 && (t = t.slice(0, 20));
        this.app.saveLocalStorage("recent-searches", t);
      }
    };
    t.prototype.getDisplayText = function () {
      return T0.name();
    };
    t.prototype.getViewType = function () {
      return A0;
    };
    t.prototype.getState = function () {
      var t = e.prototype.getState.call(this);
      t.query = this.getQuery();
      t.matchingCase = this.matchingCase;
      t.explainSearch = this.explainSearch;
      t.collapseAll = this.dom.collapseAll;
      t.extraContext = this.dom.extraContext;
      t.sortOrder = this.dom.sortOrder;
      return t;
    };
    t.prototype.setState = function (t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              return [4, e.prototype.setState.call(this, t, n)];
            case 1:
              c.sent();
              i = t.query;
              r = t.matchingCase;
              o = t.explainSearch;
              a = t.collapseAll;
              s = t.extraContext;
              l = t.sortOrder;
              (String.isString(i) || i === null) && this.setQuery(i);
              isBoolean(r) && this.setMatchingCase(r);
              isBoolean(o) && this.explainSearchToggle.setValue(o);
              isBoolean(a) && this.collapseResultsToggle.setValue(a);
              isBoolean(s) && this.extraContextToggle.setValue(s);
              String.isString(l) && GF.hasOwnProperty(l) && (this.sortOrderDropdown.setValue(l), this.setSortOrder(l));
              return [2];
          }
        });
      });
    };
    t.prototype.setEphemeralState = function (t) {
      if ((e.prototype.setEphemeralState.call(this, t), t.focus)) {
        var n = this.searchComponent.inputEl;
        n.setSelectionRange(0, n.value.length);
        n.focus({
          preventScroll: !0,
        });
      }
    };
    t.prototype.setMatchingCase = function (matchingCase) {
      if (matchingCase !== this.matchingCase) {
        this.matchingCase = matchingCase;
        this.matchingCaseButtonEl.toggleClass("is-active", matchingCase);
        this.app.workspace.requestSaveLayout();
        this.searchComponent.getValue() !== "" && this.startSearch();
      }
    };
    t.prototype.setExplainSearch = function (explainSearch) {
      if (explainSearch !== this.explainSearch) {
        this.explainSearch = explainSearch;
        this.searchInfoEl.toggle(explainSearch);
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.setCollapseAll = function (e) {
      if (e !== this.dom.collapseAll) {
        this.dom.setCollapseAll(e);
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.setExtraContext = function (e) {
      if (e !== this.dom.extraContext) {
        this.dom.setExtraContext(e);
        this.app.workspace.requestSaveLayout();
      }
    };
    t.prototype.onCopyResultsClick = function (e) {
      e.preventDefault();
      new L0(this.app, this.dom).open();
    };
    t.prototype.onKeyEnterInFocus = function (e) {
      var t = this.dom.focusedItem;
      if (t && (t instanceof hN || t instanceof cN)) {
        t.onResultClick(e);
      }
    };
    t.prototype.onKeyArrowUpInFocus = function (e) {
      e.preventDefault();
      this.dom.changeFocusedItem("backwards");
    };
    t.prototype.onKeyArrowDownInFocus = function (e) {
      if (!e.defaultPrevented) {
        e.preventDefault();
        clearFocusAndSelection();
        this.dom.changeFocusedItem("forwards");
      }
    };
    t.prototype.onKeyArrowLeftInFocus = function (e) {
      var t;
      if (!this.searchComponent.inputEl.isActiveElement()) {
        e.preventDefault();
        var n = this.dom.focusedItem;
        if (n instanceof cN) n.setCollapse(!0, !0);
        else if (n.parent instanceof cN) {
          n.parent.setCollapse(!0, !0);
          for (var i = n; (t = i.parent) === null || undefined === t ? undefined : t.collapsed; ) i = i.parent;
          this.dom.setFocusedItem(i);
        } else if (n === this.dom.infinityScroll.rootEl) {
          this.dom.setCollapseAll(!0);
        }
      }
    };
    t.prototype.onKeyArrowRightInFocus = function (e) {
      if (!this.searchComponent.inputEl.isActiveElement()) {
        e.preventDefault();
        this.dom.focusedItem === this.dom.infinityScroll.rootEl
          ? this.dom.setCollapseAll(!1)
          : this.dom.focusedItem instanceof cN && this.dom.focusedItem.setCollapse(!1, !0);
      }
    };
    t.prototype.onKeyShowMoreBefore = function (e) {
      if (this.dom.focusedItem instanceof hN) {
        this.dom.focusedItem.showMoreBefore();
      }
    };
    t.prototype.onKeyShowMoreAfter = function (e) {
      if (this.dom.focusedItem instanceof hN) {
        this.dom.focusedItem.showMoreAfter();
      }
    };
    t.prototype.setSortOrder = function (sortOrder) {
      var t = this.dom;
      t.sortOrder = sortOrder;
      t.changed();
    };
    t.prototype.onResize = function () {
      this.dom.onResize();
    };
    t.prototype.startSearch = function () {
      var e = this;
      this.stopSearch();
      var t = this,
        n = t.app,
        i = t.dom,
        r = t.searchInfoEl;
      i.emptyResults();
      this.dom.setFocusedItem(null);
      try {
        var o = this.searchComponent.getValue(),
          searchQuery = new WF(n, o, this.matchingCase);
        if (!searchQuery.matcher) return;
        this.searchQuery = searchQuery;
        this.renderSearchInfo(searchQuery.matcher, r);
        var s = false,
          onStop = function () {
            e.resultCountEl.setText(
              T0.labelResultCount({
                count: i.getMatchCount(),
              }),
            );
          },
          c = this.queue.start({
            onStop: onStop,
          });
        this.infoEl.show();
        UF(
          n,
          searchQuery.requiredInputs,
          c,
          function (t, n) {
            return __awaiter(e, undefined, undefined, function () {
              var e;
              return __generator(this, function (r) {
                switch (r.label) {
                  case 0:
                    (e = searchQuery.match(t, n)) ? i.addResult(t, e, n) : i.removeResult(t);
                    return !s || i.el.isShown()
                      ? [3, 2]
                      : [
                          4,
                          new Promise(function (e) {
                            return i.el.onNodeInserted(e, !0);
                          }),
                        ];
                  case 1:
                    r.sent();
                    r.label = 2;
                  case 2:
                    return [2];
                }
              });
            });
          },
          {
            beforePause: function () {
              s = i.el.isShown();
              onStop();
            },
          },
        );
      } catch (e) {
        r.createDiv({
          cls: "search-info",
          text: e.message,
        });
        console.log(e);
      }
      this.app.workspace.requestSaveLayout();
      this.requestSaveSearch();
    };
    t.prototype.stopSearch = function () {
      this.queue.stop();
      this.searchInfoEl.empty();
    };
    t.prototype.renderSearchInfo = function (e, t) {
      var n = this;
      if (
        (t.createDiv({
          text: e.getInfo(),
        }),
        e instanceof mF)
      )
        for (var i = t.createDiv("search-info-children"), r = 0, o = e.matchers; r < o.length; r++) {
          var a = o[r];
          this.renderSearchInfo(a, i);
        }
      else if (e instanceof yF) {
        i = t.createDiv("search-info-children");
        this.renderSearchInfo(e.matcher, i);
      } else if (e instanceof pF) {
        t.createDiv("search-info-children", function (t) {
          t.createSpan({
            text: "Key:",
          });
          t.createDiv("search-info-children", function (t) {
            n.renderSearchInfo(e.key, t);
          });
          e.value &&
            (t.createSpan({
              text: "Value:",
            }),
            t.createDiv("search-info-children", function (t) {
              n.renderSearchInfo(e.value, t);
            }));
        });
      }
    };
    t.prototype.setQuery = function (value) {
      var t = this.searchComponent,
        n = t.inputEl;
      String.isString(value) && ((n.value = value), t.setValue(value));
      this.startSearch();
    };
    t.prototype.getQuery = function () {
      return this.searchComponent.getValue();
    };
    t.prototype.onTabHeaderClick = function () {
      this.searchComponent.autoSelect();
    };
    return t;
  })(View),
  L0 = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.setTitle(T0.labelCopySearchResults());
      var r = i.contentEl,
        o = {},
        a = i.app.internalPlugins.getEnabledPluginById("global-search");
      if (a) {
        o = a.options;
      }
      var s,
        l,
        c,
        u = r.createDiv("copy-search-result-container"),
        h = u.createEl("textarea", "copy-search-result-textarea"),
        p = function () {
          var e = n.getFiles();
          h.value = e
            .map(function (e, t) {
              var n = s.getValue() ? e.path : e.getShortName(),
                i = l.getValue();
              i === "wikilink"
                ? (n = "[[".concat(n, "]]"))
                : i === "markdown" && (n = "[".concat(e.basename, "](").concat(n, ")"));
              var r = c.getValue();
              r === "-"
                ? (n = "- ".concat(n))
                : r === "*"
                  ? (n = "* ".concat(n))
                  : r === "num" && (n = "".concat(t + 1, ". ").concat(n));
              o.showFullPath = s.getValue();
              o.linkStyle = l.getValue();
              o.listStyle = c.getValue();
              a.plugin.saveData(o);
              return n;
            })
            .join("\n");
          h.select();
        };
      new Setting(u)
        .setName(T0.optionShowPath())
        .setDesc(T0.optionShowPathDescription())
        .addToggle(function (e) {
          e.setValue(!!o.showFullPath).onChange(p);
          s = e;
        });
      new Setting(u)
        .setName(T0.optionLinkStyle())
        .setDesc(T0.optionLinkStyleDescription())
        .addDropdown(function (e) {
          e.addOption("none", T0.optionChoiceLinkStyleNone())
            .addOption("wikilink", T0.optionChoiceLinkStyleWikilink())
            .addOption("markdown", T0.optionChoiceLinkStyleMarkdownLink())
            .setValue(o.linkStyle || "none")
            .onChange(p);
          l = e;
        });
      new Setting(u)
        .setName(T0.optionListPrefix())
        .setDesc(T0.optionListPrefixDescription())
        .addDropdown(function (e) {
          e.addOption("none", T0.optionChoiceListStyleNone())
            .addOption("-", T0.optionChoiceListStyleDash())
            .addOption("*", T0.optionChoiceListStyleAsterisk())
            .addOption("num", T0.optionChoiceListStyleNumbered())
            .setValue(o.listStyle || "none")
            .onChange(p);
          c = e;
        });
      r.createDiv("modal-button-container", function (e) {
        e.createEl("button", {
          text: T0.buttonCopyResults(),
          cls: "mod-cta",
        }).addEventListener("click", function () {
          vc(h.value);
          new Notice(T0.msgSuccessfullyCopied());
        });
        e.createEl("button", {
          text: i18nProxy.dialogue.buttonDone(),
        }).addEventListener("click", function () {
          return i.close();
        });
      });
      p();
      return i;
    }
    __extends(t, e);
    return t;
  })(Modal),
  I0 = Symbol("parent"),
  O0 = i18nProxy.plugins.bookmarks,
  F0 = (function (e) {
    function t(plugin, item, isExistingItem, r) {
      var o = e.call(this, plugin.app) || this;
      o.plugin = plugin;
      o.item = item;
      o.isExistingItem = isExistingItem;
      o.initialBookmarkGroup = null;
      o.bookmarkGroup = null;
      o.bookmarkGroupOptions = new Map();
      o.reverseBookmarkGroupOptions = new Map();
      o.modalEl.addClass("mod-bookmark");
      var a = isExistingItem
        ? i18nProxy.plugins.bookmarks.actionEditBookmark()
        : i18nProxy.plugins.bookmarks.actionAddBookmark();
      o.setTitle(a);
      var s = plugin.getItemTitle(item),
        title = item.title,
        c = function () {
          item.title = title;
          isExistingItem
            ? (plugin.editItem(item),
              o.initialBookmarkGroup !== o.bookmarkGroup &&
                plugin.moveItem(item, o.bookmarkGroup, o.bookmarkGroup.items.length - 1))
            : plugin.addItem(item, o.bookmarkGroup);
          r == null || r();
          o.close();
        },
        u = function (e) {
          if (!(e.isComposing || e.key !== "Enter")) {
            e.preventDefault();
            c();
          }
        };
      if (item.type === "file" || item.type === "folder") {
        var h = ou(item.path);
        item.type === "file" && item.subpath && (h += item.subpath);
        new Setting(o.contentEl).setName(O0.optionPath()).addText(function (e) {
          e.setDisabled(!0).setValue(h);
        });
      } else
        item.type === "search"
          ? new Setting(o.contentEl).setName(O0.optionQuery()).addText(function (e) {
              e.setDisabled(!0).setValue(item.query);
            })
          : item.type === "url" &&
            new Setting(o.contentEl).setName(O0.optionURL()).addText(function (e) {
              e.setDisabled(!0).setValue(item.url);
            });
      new Setting(o.contentEl).setName(O0.optionTitle()).addText(function (e) {
        o.titleInputEl = e.inputEl;
        o.titleInputEl.enterKeyHint = Platform.isAndroidApp ? "enter" : "done";
        e.setPlaceholder(s)
          .setValue(title)
          .onChange(function (e) {
            title = e;
          });
        e.inputEl.addEventListener("keydown", u);
      });
      new Setting(o.contentEl).setName(O0.optionGroup()).addDropdown(function (bookmarkGroupComponent) {
        o.bookmarkGroupComponent = bookmarkGroupComponent;
        var n = function (t, i) {
          for (var r = 0, a = t; r < a.length; r++) {
            var s = a[r];
            if (s.type === "group") {
              var l = ic(16);
              bookmarkGroupComponent.addOption(l, i + s.title);
              o.bookmarkGroupOptions.set(l, s);
              o.reverseBookmarkGroupOptions.set(s, l);
              n(s.items, i + " ".repeat(4));
            }
          }
        };
        n(plugin.items, "");
        bookmarkGroupComponent.onChange(function (e) {
          o.bookmarkGroup = o.bookmarkGroupOptions.get(e);
        });
      });
      var p = function () {
        plugin.removeItem(item);
        o.close();
      };
      Platform.isPhone
        ? (o.modalEl.createEl(
            "button",
            {
              cls: "modal-nav-action mod-secondary",
              text: i18nProxy.dialogue.buttonCancel(),
            },
            function (e) {
              e.addEventListener("click", function () {
                return o.close();
              });
            },
          ),
          o.modalEl.createEl(
            "button",
            {
              cls: "modal-nav-action mod-cta",
              text: i18nProxy.dialogue.buttonSave(),
            },
            function (e) {
              e.addEventListener("click", c);
            },
          ),
          isExistingItem
            ? (o.contentEl.appendChild(o.buttonContainerEl),
              o.buttonContainerEl.createEl(
                "button",
                {
                  cls: "mod-warning",
                  text: O0.menuOptRemove(),
                },
                function (e) {
                  e.addEventListener("click", p);
                },
              ))
            : o.buttonContainerEl.detach())
        : (isExistingItem && o.addButton(["mod-secondary", "mod-destructive"], O0.menuOptRemove(), p),
          o.addCancelButton(),
          o.addButton("mod-cta", i18nProxy.dialogue.buttonSave(), c));
      return o;
    }
    __extends(t, e);
    t.prototype.setBookmarkGroup = function (bookmarkGroup) {
      this.bookmarkGroup = bookmarkGroup;
      var t = this.reverseBookmarkGroupOptions.get(bookmarkGroup);
      this.bookmarkGroupComponent.setValue(t);
      return this;
    };
    t.prototype.onOpen = function () {
      this.bookmarkGroup || (this.bookmarkGroup = this.item[I0]);
      this.initialBookmarkGroup = this.bookmarkGroup;
      var e = this.reverseBookmarkGroupOptions.get(this.initialBookmarkGroup);
      this.bookmarkGroupComponent.setValue(e);
      focusAndSelectOnPhysicalKeyboard(this.titleInputEl);
    };
    return t;
  })(GM),
  N0 = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t) || this;
      r.modalEl.addClass("mod-bookmark");
      r.setTitle("Add ".concat(i.length, " bookmarks"));
      var o = window.moment().format("LLL"),
        a = "",
        s = null,
        l = function () {
          var e = m2(a || o);
          n.addItem(e, s);
          for (var t = 0, l = i; t < l.length; t++) {
            var c = l[t];
            n.addItem(c, e);
          }
          r.close();
        },
        c = function (e) {
          if (!(e.isComposing || e.key !== "Enter")) {
            e.preventDefault();
            l();
          }
        };
      new Setting(r.contentEl).setName(O0.optionTitle()).addText(function (e) {
        e.setPlaceholder(o)
          .setValue(a)
          .onChange(function (e) {
            a = e;
          });
        e.inputEl.addEventListener("keydown", c);
      });
      var u = new Map();
      new Setting(r.contentEl).setName(O0.optionGroup()).addDropdown(function (e) {
        var t = function (n, i) {
          for (var r = 0, o = n; r < o.length; r++) {
            var a = o[r];
            if (a.type === "group") {
              var s = ic(16);
              e.addOption(s, i + a.title);
              u.set(s, a);
              t(a.items, i + " ".repeat(4));
            }
          }
        };
        t(n.items, "");
        e.onChange(function (e) {
          s = u.get(e);
        });
      });
      r.addCancelButton();
      r.addButton("mod-cta", i18nProxy.dialogue.buttonSave(), l);
      return r;
    }
    __extends(t, e);
    return t;
  })(GM);
function R0(e) {
  e = normalizePath((e = (e = e.replace(/[?*]/g, "")).replace(/[\\/:]/g, " - ")));
  try {
    Jb(e);
  } catch (e) {
    return "Untitled";
  }
  return e;
}