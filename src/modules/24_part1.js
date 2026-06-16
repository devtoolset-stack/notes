var N5 = i18nProxy.setting.about,
  R5 = i18nProxy.setting.account;
var B5 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = N5.name();
      t.id = "about";
      return t;
    }
    __extends(t, e);
    t.prototype.display = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n,
          version,
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
          g = this;
        return __generator(this, function (v) {
          switch (v.label) {
            case 0:
              (e = this.containerEl).empty();
              t = (function () {
                var appVersion = i18nProxy.setting.about.labelUnknownVersion(),
                  installerVersion = i18nProxy.setting.about.labelUnknownVersion(),
                  update = "",
                  checking = false,
                  updateDisabled = false;
                callbackWithElectron(function (o) {
                  var a = o.remote.app.getVersion();
                  installerVersion = "v" + a;
                  appVersion = "v" + o.ipcRenderer.sendSync("version");
                  update = o.ipcRenderer.sendSync("update");
                  checking = o.ipcRenderer.sendSync("check-update");
                  updateDisabled = o.ipcRenderer.sendSync("disable-update");
                });
                return {
                  appVersion: appVersion,
                  installerVersion: installerVersion,
                  update: update,
                  checking: checking,
                  updateDisabled: updateDisabled,
                };
              })();
              n = t.appVersion;
              version = t.installerVersion;
              r = t.update;
              o = t.updateDisabled;
              a = t.checking;
              s = this.app.setting;
              Platform.isDesktopApp
                ? (a &&
                    ((l = function () {
                      callbackWithElectron(function (e) {
                        a = e.ipcRenderer.sendSync("check-update");
                      });
                      a ? setTimeout(l, 1e3) : g.display();
                    }),
                    setTimeout(l, 300)),
                  new Setting(e).setName(N5.labelApp()).setHeading(),
                  (c = new Setting(e).setName(N5.labelCurrentVersion() + n).setDesc(
                    createFragment(function (e) {
                      e.appendText(
                        N5.labelInstallVersion({
                          version: version,
                        }),
                      );
                      e.createEl("br");
                      r === "update-downloaded"
                        ? (e.appendText(N5.labelNewVersionReady()),
                          e.createEl("br"),
                          e.createEl("a", {
                            text: N5.labelReadChangelog(),
                            attr: {
                              href: "https://obsidian.md/changelog",
                              target: "_blank",
                              rel: "noopener",
                            },
                          }))
                        : r === "update-manual-required" || pG(electronVersion, b9)
                          ? (e.createEl("b", {
                              text: N5.labelManualUpdateRequired(),
                            }),
                            e.appendText(" "),
                            e.createEl("a", {
                              text: i18nProxy.dialogue.buttonDownload(),
                              attr: {
                                href: getDownloadUrl(),
                                target: "_blank",
                                rel: "noopener",
                              },
                            }))
                          : (e.appendText(N5.labelUpToDate()),
                            e.createEl("br"),
                            e.createEl("a", {
                              text: N5.labelReadChangelog(),
                              attr: {
                                href: "https://obsidian.md/changelog",
                                target: "_blank",
                                rel: "noopener",
                              },
                            }));
                    }),
                  )),
                  r === "update-downloaded"
                    ? c.addButton(function (e) {
                        return e
                          .setCta()
                          .setButtonText(N5.buttonRelaunch())
                          .onClick(function () {
                            callbackWithElectron(function (e) {
                              e.ipcRenderer.sendSync("relaunch");
                            });
                          });
                      })
                    : c.addButton(function (e) {
                        return e
                          .setCta()
                          .setButtonText(N5.buttonCheckForUpdates())
                          .setLoading(a)
                          .onClick(function () {
                            callbackWithElectron(function (e) {
                              return __awaiter(g, undefined, undefined, function () {
                                return __generator(this, function (t) {
                                  e.ipcRenderer.send("check-update", !0);
                                  this.display();
                                  return [2];
                                });
                              });
                            });
                          });
                      }),
                  new Setting(e)
                    .setName(N5.optionAutoUpdate())
                    .setDesc(N5.optionAutoUpdateDescription())
                    .addToggle(function (e) {
                      return e.setValue(!o).onChange(function (e) {
                        callbackWithElectron(function (t) {
                          t.ipcRenderer.sendSync("disable-update", !e);
                          setTimeout(function () {
                            return g.display();
                          }, 500);
                        });
                      });
                    }),
                  c$.license &&
                    Platform.isDesktopApp &&
                    ((u = false),
                    callbackWithElectron(function (e) {
                      u = e.ipcRenderer.sendSync("insider-build", null);
                    }),
                    new Setting(e)
                      .setName(N5.optionInsiderBuild())
                      .setDesc(N5.optionInsiderBuildDescription())
                      .addToggle(function (e) {
                        return e.setValue(u).onChange(function (e) {
                          callbackWithElectron(function (t) {
                            t.ipcRenderer.sendSync("insider-build", e);
                          });
                        });
                      })))
                : isNotWeb &&
                  ((h = N5.labelCurrentVersion() + apiVersion),
                  (p = new Setting(e).setName(h)),
                  __awaiter(g, undefined, undefined, function () {
                    var e;
                    return __generator(this, function (t) {
                      switch (t.label) {
                        case 0:
                          return [4, capacitorAppPlugin.getInfo()];
                        case 1:
                          e = t.sent();
                          p.setName(h + " (".concat(e.build, ")"));
                          return [2];
                      }
                    });
                  }));
              d = getLanguage();
              f = d;
              new Setting(e)
                .setName(N5.optionLanguage())
                .setDesc(
                  createFragment(function (e) {
                    e.appendText(N5.optionLanguageDescription());
                    e.createEl("br");
                    e.createEl("a", {
                      text: N5.labelAddOwnLanguage(),
                      attr: {
                        href: "https://help.obsidian.md/Translations",
                        target: "_blank",
                        rel: "noopener",
                      },
                    });
                  }),
                )
                .addButton(function (e) {
                  m = e;
                  e.setCta()
                    .setButtonText(N5.buttonRelaunch())
                    .onClick(function () {
                      f === fallbackLng
                        ? localStorage.removeItem(languageLiteral)
                        : localStorage.setItem(languageLiteral, f);
                      window.location.reload();
                    });
                  e.buttonEl.hide();
                })
                .addDropdown(function (e) {
                  e.onChange(function (e) {
                    f = e;
                    m.buttonEl.toggle(d !== f);
                  });
                  for (var t = 0, n = languageSupportedKeys; t < n.length; t++) {
                    var i = n[t];
                    e.addOption(i, languageSupported[i]);
                  }
                  e.setValue(d);
                });
              new Setting(e)
                .setName(N5.optionGetHelp())
                .setDesc(N5.optionGetHelpDescription())
                .addButton(function (e) {
                  return e.setButtonText(N5.buttonOpen()).onClick(function () {
                    s.close();
                    g.app.openHelp();
                  });
                });
              new Setting(e).setName(i18nProxy.setting.account.name()).setHeading();
              this.accountSetting = new Setting(e);
              this.catalystSetting = new Setting(e);
              this.commercialLicenseSetting = new Setting(e);
              new Setting(e).setHeading().setName(N5.optionAdvanced());
              new Setting(e)
                .setName(N5.optionCheckSlowStartup())
                .setDesc(N5.optionCheckSlowStartupDescription())
                .addExtraButton(function (e) {
                  return e
                    .setIcon("lucide-timer")
                    .setTooltip(N5.buttonCheckStartup())
                    .onClick(function () {
                      new F5(g.app).open();
                    });
                })
                .addToggle(function (e) {
                  return e.setValue(g.app.loadLocalStorage("slow-startup-check")).onChange(function (e) {
                    e
                      ? g.app.saveLocalStorage("slow-startup-check", "1")
                      : g.app.saveLocalStorage("slow-startup-check", null);
                  });
                });
              this.updateAccountSettings();
              v.label = 1;
            case 1:
              v.trys.push([1, , 4, 5]);
              return [4, KQ(c$)];
            case 2:
              v.sent();
              return [4, YQ(c$)];
            case 3:
              v.sent();
              return [3, 5];
            case 4:
              this.updateAccountSettings();
              return [7];
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.updateAccountSettings = function () {
      var e = this;
      if (
        (this.accountSetting.clear(), this.catalystSetting.clear(), this.commercialLicenseSetting.clear(), c$.email)
      ) {
        if (
          (this.accountSetting
            .setName(R5.optionYourAccount())
            .setDesc(
              R5.optionYourAccountDesc({
                name: c$.name,
                email: c$.email,
              }),
            )
            .addButton(function (e) {
              return e.setButtonText(i18nProxy.interface.buttonManage()).onClick(function () {
                window.open("https://obsidian.md/account");
              });
            })
            .addButton(function (t) {
              return t
                .setButtonText(R5.buttonLogOut())
                .setClass("mod-destructive")
                .onClick(function () {
                  return __awaiter(e, undefined, undefined, function () {
                    var e;
                    return __generator(this, function (n) {
                      switch (n.label) {
                        case 0:
                          n.trys.push([0, 2, , 3]);
                          t.buttonEl.addClass("mod-loading");
                          return [4, GQ(c$)];
                        case 1:
                          n.sent();
                          this.display();
                          return [3, 3];
                        case 2:
                          e = n.sent();
                          t.buttonEl.removeClass("mod-loading");
                          new Notice(e.message).containerEl.addClass("mod-error");
                          return [3, 3];
                        case 3:
                          return [2];
                      }
                    });
                  });
                });
            }),
          c$.license)
        ) {
          var t = c$.license,
            tier = R5("label-".concat(t));
          this.catalystSetting.setName(N5.optionCatalyst()).setDesc(
            N5.optionCatalystDesc({
              tier: tier,
            }),
          );
          t !== "vip" &&
            this.catalystSetting.addButton(function (e) {
              return e.setButtonText(R5.buttonUpgradeCatalyst()).onClick(function () {
                window.open("https://obsidian.md/account");
              });
            });
        } else
          this.catalystSetting
            .setName(N5.optionCatalyst())
            .setDesc(
              createFragment(function (e) {
                e.appendText(N5.optionCatalystDescNoLicense());
                e.createEl("br");
                e.createEl("a", {
                  text: i18nProxy.interface.buttonLearnMore(),
                  attr: {
                    href: "https://help.obsidian.md/Catalyst+license",
                    target: "_blank",
                    rel: "noopener",
                  },
                });
              }),
            )
            .addButton(function (e) {
              return e
                .setButtonText(R5.buttonPurchase())
                .setCta()
                .onClick(function () {
                  window.open("https://obsidian.md/account");
                });
            });
        this.catalystSetting.settingEl.show();
      } else {
        this.accountSetting
          .setName(R5.optionYourAccount())
          .setDesc(R5.optionYourAccountDescNoLogin())
          .addButton(function (t) {
            return t.setButtonText(R5.labelLogIn()).onClick(function () {
              new V5(e.app)
                .setCloseCallback(function () {
                  return e.display();
                })
                .open();
            });
          })
          .addButton(function (e) {
            return e.setButtonText(R5.labelSignUp()).onClick(function () {
              Platform.isIosApp && capacitorBrowserPlugin
                ? capacitorBrowserPlugin.open({
                    url: "https://obsidian.md/auth#signup",
                  })
                : window.open("https://obsidian.md/auth#signup");
            });
          });
        this.catalystSetting.settingEl.hide();
      }
      if (c$.key) {
        var i = c$.key,
          r = c$.keyValidation,
          o = this.commercialLicenseSetting,
          a = N5.labelYourCommercialLicenseKey({
            key: i,
          });
        r === "valid" &&
          (a +=
            " " +
            N5.labelCommercialLicenseInfo({
              company: c$.company,
              seats: c$.seats,
              expiry: window.moment(c$.expiry).format("MMMM D, YYYY"),
            }));
        o.setName(N5.labelCommercialLicense()).setDesc(a);
        r === "valid"
          ? o.addButton(function (t) {
              return t.setButtonText(N5.buttonRemoveCommercialLicense()).onClick(function () {
                c$.setKey(null);
                e.display();
              });
            })
          : r
            ? (o.descEl.createEl("p", {
                text: N5.labelInvalidCommercialLicense() + "".concat(r),
              }),
              o.addButton(function (t) {
                return t
                  .setButtonText(N5.buttonActivate())
                  .setCta()
                  .onClick(function () {
                    new H5(e.app)
                      .setCloseCallback(function () {
                        return e.display();
                      })
                      .open();
                  });
              }))
            : o.descEl.createEl("p", {
                text: N5.labelValidatingCommercialLicense(),
              });
      } else
        this.commercialLicenseSetting
          .setName(R5.optionCommercialLicense())
          .setDesc(
            createFragment(function (e) {
              e.appendText(R5.optionCommercialLicenseDesc());
              e.createEl("br");
              e.createEl("a", {
                text: i18nProxy.interface.buttonLearnMore(),
                attr: {
                  href: "https://help.obsidian.md/Commercial+license",
                  target: "_blank",
                  rel: "noopener",
                },
              });
            }),
          )
          .addButton(function (t) {
            return t
              .setButtonText(N5.buttonActivate())
              .setCta()
              .onClick(function () {
                new H5(e.app)
                  .setCloseCallback(function () {
                    return e.display();
                  })
                  .open();
              });
          })
          .addButton(function (e) {
            return e.setButtonText(R5.buttonPurchase()).onClick(function () {
              window.open("https://obsidian.md/account");
            });
          });
    };
    return t;
  })(SettingTab),
  V5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this,
        i = n,
        r = i.modalEl,
        o = i.contentEl;
      r.addClass("mod-lg", "mod-form");
      n.loadingEl = iJ(r);
      n.loadingEl.hide();
      n.titleEl.setText(R5.labelLogIn());
      o.createDiv("message-container", function (e) {
        n.errorEl = e.createDiv("message mod-error");
        n.errorEl.hide();
      });
      n.emailSectionEl = o.createEl("p", "form-field", function (e) {
        e.createEl("label", {
          cls: "input-label",
          text: R5.labelEmail(),
        });
        n.emailEl = e.createEl(
          "input",
          {
            type: "email",
            attr: {
              autocomplete: "email",
              autocapitalize: "off",
              autocorrect: "off",
              spellcheck: "false",
            },
          },
          function (e) {
            e.setAttribute("placeholder", R5.placeholderEmail());
            e.addEventListener("keydown", function (e) {
              if (!(e.isComposing || e.key !== "Enter")) {
                n.login();
              }
            });
          },
        );
      });
      n.passwordSectionEl = o.createEl("p", "form-field", function (e) {
        e.createEl("label", {
          cls: "input-label",
          text: R5.labelPassword(),
        });
        n.passwordEl = e.createEl(
          "input",
          {
            type: "password",
            attr: {
              autocomplete: "current-password",
            },
          },
          function (e) {
            e.setAttribute("placeholder", R5.placeholderPassword());
            e.addEventListener("keydown", function (e) {
              if (!(e.isComposing || e.key !== "Enter")) {
                n.login();
              }
            });
          },
        );
      });
      n.mfaSectionEl = o.createEl("p", "form-field", function (e) {
        e.createEl("label", {
          cls: "input-label",
          text: R5.labelMfaCode(),
        });
        n.mfaEl = e.createEl(
          "input",
          {
            type: "text",
          },
          function (e) {
            e.setAttribute("autocomplete", "one-time-code");
            e.setAttribute("maxlength", "6");
            e.inputMode = "numeric";
            e.addEventListener("keydown", function (e) {
              if (!(e.isComposing || e.key !== "Enter")) {
                n.login();
              }
            });
          },
        );
      });
      n.mfaSectionEl.hide();
      n.buttonContainerEl.createEl("a", {
        cls: "mod-secondary",
        text: R5.labelForgotPassword(),
        attr: {
          href: "https://obsidian.md/account#forgotpass",
          target: "_blank",
        },
      });
      n.buttonContainerEl.createEl(
        "button",
        {
          cls: "mod-cta",
          text: R5.buttonLogin(),
        },
        function (e) {
          e.addEventListener("click", n.login.bind(n));
        },
      );
      n.addCancelButton();
      return n;
    }
    __extends(t, e);
    t.prototype.showError = function (e) {
      var t = this.errorEl;
      t.setText(e);
      t.show();
    };
    t.prototype.login = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              if (
                ((t = (e = this).emailEl),
                (n = e.passwordEl),
                (i = e.mfaEl),
                this.errorEl.hide(),
                (r = t.value),
                (o = n.value),
                (a = i.value),
                r === "")
              ) {
                this.showError(R5.messageEmptyEmail());
                return [2];
              }
              if (-1 === r.indexOf("@")) {
                this.showError(R5.messageInvalidEmail());
                return [2];
              }
              if (o === "") {
                this.showError(R5.messageEmptyPassword());
                return [2];
              }
              if (a !== "" && !/^\d{6}$/.test(a)) {
                this.showError(R5.mfaWrongFormat());
                return [2];
              }
              this.loadingEl.show();
              this.contentEl.hide();
              c.label = 1;
            case 1:
              c.trys.push([1, 3, , 4]);
              return [4, jQ(c$, r, o, a)];
            case 2:
              c.sent();
              this.close();
              return [3, 4];
            case 3:
              (s = c.sent()) instanceof VQ
                ? (l = s.error).contains("2FA code is incorrect")
                  ? this.showError(R5.mfaVerificationFailed())
                  : l.contains("2FA code")
                    ? (this.emailSectionEl.hide(), this.passwordSectionEl.hide(), this.mfaSectionEl.show())
                    : this.showError(l)
                : this.showError(R5.messageLoginFailed());
              this.loadingEl.hide();
              this.contentEl.show();
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    return t;
  })(GM),
  H5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.modalEl.addClass("mod-lg", "mod-form");
      n.setTitle(N5.labelCommercialLicense());
      n.contentEl.createDiv("message-container", function (e) {
        n.errorEl = e.createDiv("message mod-error");
        n.errorEl.hide();
        e.createEl(
          "p",
          {
            cls: "form-field ",
          },
          function (e) {
            e.createEl("label", {
              cls: "input-label",
              text: N5.labelLicenseKey(),
            });
            n.licenseKeyEl = e.createEl(
              "input",
              {
                type: "text",
              },
              function (e) {
                e.setAttribute("placeholder", N5.licenseKeyPlaceholder());
              },
            );
          },
        );
      });
      n.buttonContainerEl.createEl("a", {
        cls: "mod-secondary",
        text: i18nProxy.interface.buttonLearnMore(),
        attr: {
          href: "https://help.obsidian.md/Commercial+license",
          target: "_blank",
          rel: "noopener",
        },
      });
      n.addButton("mod-cta", N5.buttonActivate(), function () {
        return __awaiter(n, undefined, undefined, function () {
          return __generator(this, function (e) {
            switch (e.label) {
              case 0:
                c$.key = this.licenseKeyEl.value.trim();
                return [4, YQ(c$)];
              case 1:
                e.sent();
                c$.keyValidation === "valid"
                  ? this.close()
                  : (this.errorEl.setText(c$.keyValidation), this.errorEl.show());
                return [2, !0];
            }
          });
        });
      }).addCancelButton();
      return n;
    }
    __extends(t, e);
    return t;
  })(GM),
  z5 = (function (e) {
    function t(t, n, i, labelI18nKey) {
      var o = e.call(this, t) || this;
      o.settingTab = null;
      o.displayEl = null;
      o.labelI18nKey = labelI18nKey;
      var a = o.contentEl;
      o.displayEl = a.createEl("p");
      new Setting(a)
        .setName(n)
        .setDesc(i)
        .addText(function (e) {
          var n = e.inputEl,
            i = new gT(
              t,
              n,
              function (e) {
                return !o.getPaths().contains(e.path);
              },
              !0,
            ),
            r = function () {
              return __awaiter(o, undefined, undefined, function () {
                var e, t;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return (e = normalizePath(n.value))
                        ? ((n.value = ""), (t = this.getPaths()).push(e), [4, this.setPaths(t)])
                        : [2];
                    case 1:
                      i.sent();
                      this.updateDisplay();
                      return [2];
                  }
                });
              });
            };
          i.onSelect(r);
          n.addEventListener("keydown", function (e) {
            if (!e.isComposing) {
              e.key === "Enter" && r();
            }
          });
        });
      o.addButton("", i18nProxy.dialogue.buttonDone(), o.close.bind(o));
      return o;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      e.prototype.onOpen.call(this);
      this.updateDisplay();
    };
    t.prototype.onClose = function () {
      this.settingTab.display();
    };
    t.prototype.updateDisplay = function () {
      var e = this,
        t = this.getPaths(),
        n = this.displayEl;
      n.empty();
      var folders = i18nProxy.nouns.folderWithCount({
        count: t.length,
      });
      n.setText(
        i18nProxy(this.labelI18nKey, {
          folders: folders,
        }),
      );
      for (
        var r = function (textt0) {
            var i = n.createDiv("sync-exclude-folder"),
              r = i.createDiv("sync-exclude-folder-remove clickable-icon");
            setIcon(r, "lucide-x");
            setTooltip(r, i18nProxy.plugins.sync.tooltipRemoveExcludedFolder());
            r.addEventListener("click", function () {
              return __awaiter(e, undefined, undefined, function () {
                var e;
                return __generator(this, function (n) {
                  switch (n.label) {
                    case 0:
                      (e = this.getPaths()).remove(textt0);
                      return [4, this.setPaths(e)];
                    case 1:
                      n.sent();
                      this.updateDisplay();
                      return [2];
                  }
                });
              });
            });
            i.createSpan("clickable-icon", function (e) {
              return setIcon(e, "lucide-folder-open");
            });
            i.createDiv(
              {
                cls: "sync-exclude-folder-name",
              },
              function (e) {
                e.createSpan({
                  text: textt0,
                });
              },
            );
          },
          o = 0,
          a = t;
        o < a.length;
        o++
      ) {
        r(a[o]);
      }
    };
    return t;
  })(GM),
  q5 = i18nProxy.plugins.publish,
  W5 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t) || this;
      i.offlineSection = null;
      i.noAccountSection = null;
      i.manageSitesSection = null;
      i.siteOptionsSection = null;
      i.siteFiltersSection = null;
      i.reviewChangesSection = null;
      i.uploadProgressSection = null;
      i.editSiteSlugSection = null;
      i.listPasswordSection = null;
      i.addPasswordSection = null;
      i.configureCustomDomainSection = null;
      i.errorMessageEl = null;
      i.loaderEl = null;
      i.currentSection = null;
      i.autoLoadSection = null;
      i.plugin = plugin;
      i.modalEl.addClass("mod-publish", "mod-lg", "mod-scrollable-content");
      i.setTitleText(q5.actionPublishChanges());
      i.contentEl.createDiv("message-container", function (e) {
        i.errorMessageEl = e.createDiv("message mod-error");
        i.errorMessageEl.hide();
      });
      i.offlineSection = new j5(i);
      i.loaderEl = iJ(i.contentEl);
      i.loaderEl.hide();
      i.noAccountSection = new G5(i);
      i.manageSitesSection = new K5(i);
      i.siteOptionsSection = new Y5(i);
      i.siteFiltersSection = new Z5(i);
      i.reviewChangesSection = new t8(i);
      i.uploadProgressSection = new n8(i);
      i.editSiteSlugSection = new i8(i);
      i.listPasswordSection = new r8(i);
      i.addPasswordSection = new o8(i);
      i.configureCustomDomainSection = new a8(i);
      return i;
    }
    __extends(t, e);
    t.prototype.handleError = function (e) {
      console.error(e);
      this.loaderEl.hide();
      e instanceof f8
        ? e.code === "AUTHFAIL"
          ? (this.openSection(this.manageSitesSection), this.showError(q5.msgNoPermissionToPublishToSite()))
          : e.code === "NET"
            ? this.showError(q5.msgNetworkError() + e.message)
            : this.showError(e.message)
        : this.showError(q5.msgSomethingWentWrong() + " " + (e.message || e.toString()));
    };
    t.prototype.showError = function (e) {
      this.errorMessageEl.setText(e);
      this.errorMessageEl.show();
    };
    t.prototype.hideError = function () {
      this.errorMessageEl.hide();
    };
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              if ((this.closeSection(), this.loaderEl.show(), c$.token)) return [3, 4];
              t.label = 1;
            case 1:
              t.trys.push([1, 3, , 4]);
              return [4, KQ(c$)];
            case 2:
              t.sent();
              return [3, 4];
            case 3:
              return t.sent().message === "Not logged in"
                ? [2, this.openSection(this.noAccountSection)]
                : [2, this.openSection(this.offlineSection)];
            case 4:
              return this.plugin.siteId
                ? this.autoLoadSection
                  ? ((e = this.autoLoadSection), (this.autoLoadSection = null), [2, this.openSection(e)])
                  : [2, this.openReviewChanges()]
                : [2, this.openSection(this.manageSitesSection)];
          }
        });
      });
    };
    t.prototype.autoLoad = function (autoLoadSection) {
      this.autoLoadSection = autoLoadSection;
    };
    t.prototype.onClose = function () {};
    t.prototype.deleteSite = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, i$(c$.token, e)];
            case 1:
              t.sent();
              return this.plugin.siteId !== e ? [3, 3] : [4, this.plugin.setup(null, null)];
            case 2:
              t.sent();
              t.label = 3;
            case 3:
              return [4, this.openSection(this.manageSitesSection)];
            case 4:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.deleteSiteShare = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, o$(c$.token, e, t)];
            case 1:
              n.sent();
              return this.plugin.siteId !== e ? [3, 3] : [4, this.plugin.setup(null, null)];
            case 2:
              n.sent();
              n.label = 3;
            case 3:
              return [4, this.openSection(this.manageSitesSection)];
            case 4:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.acceptSiteShare = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [
                4,
                ((token = c$.token),
                (code = t),
                HQ("/publish/share/accept", {
                  token: token,
                  code: code,
                })),
              ];
            case 1:
              n.sent();
              return this.plugin.siteId !== e ? [3, 3] : [4, this.plugin.setup(null, null)];
            case 2:
              n.sent();
              n.label = 3;
            case 3:
              return [4, this.openSection(this.manageSitesSection)];
            case 4:
              n.sent();
              return [2];
          }
          var token, code;
        });
      });
    };
    t.prototype.openReviewChanges = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.openSection(this.reviewChangesSection)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.openManageSites = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.openSection(this.manageSitesSection)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.editSlug = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              this.editSiteSlugSection.setSiteInfo(e);
              this.editSiteSlugSection.setExistingSlug(t);
              return [4, this.openSection(this.editSiteSlugSection)];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.uploadChanges = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          this.uploadProgressSection.addChanges(e);
          this.openSection(this.uploadProgressSection);
          return [2];
        });
      });
    };
    t.prototype.showPasswords = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              e = this.listPasswordSection;
              i.label = 1;
            case 1:
              i.trys.push([1, 4, , 5]);
              this.currentSection.hide();
              this.loaderEl.show();
              return [4, this.plugin.apiGetPassword()];
            case 2:
              t = i.sent().pass;
              e.setPasswords(t);
              e.updateDisplay();
              return [4, this.openSection(e)];
            case 3:
              i.sent();
              return [3, 5];
            case 4:
              n = i.sent();
              this.handleError(n);
              return [2];
            case 5:
              return [2];
          }
        });
      });
    };
    t.prototype.openAddPassword = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.openSection(this.addPasswordSection)];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.setTitleText = function (e) {
      this.titleEl.setText(e);
    };
    t.prototype.closeSection = function () {
      this.errorMessageEl.hide();
      this.currentSection && this.currentSection.hide();
      this.currentSection = null;
    };
    t.prototype.openSection = function (currentSection) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.closeSection();
              currentSection.title && this.setTitleText(currentSection.title);
              this.currentSection = currentSection;
              this.loaderEl.show();
              return [4, currentSection.show()];
            case 1:
              t.sent();
              this.loaderEl.hide();
              return [2];
          }
        });
      });
    };
    return t;
  })(Modal),
  U5 = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.selectSuggestion = function (e) {
      var t = this.textInputEl;
      this.setValue(e.item.path);
      t.trigger("input");
      this.close();
    };
    t.prototype.filePredicate = function (e) {
      return IMAGE_EXTENSIONS.contains(e.extension);
    };
    return t;
  })(vT),
  _5 = (function () {
    function e(parentModal) {
      this.title = null;
      this.el = null;
      this.parentModal = null;
      this.parentModal = parentModal;
      this.el = parentModal.contentEl.createDiv();
      this.hide();
    }
    e.prototype.show = function () {
      this.el.show();
    };
    e.prototype.hide = function () {
      this.el.hide();
    };
    return e;
  })(),
  j5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.el.createEl("p", {
        text: q5.labelNoInternetAccess(),
      });
      return n;
    }
    __extends(t, e);
    return t;
  })(_5),
  G5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.el.createEl("p", {
        text: q5.labelPublishServiceDescription(),
      });
      n.el.createEl("p", {
        text: q5.labelPleaseLogin(),
      });
      n.el.createDiv("modal-button-container", function (e) {
        e.createEl("button", {
          cls: "mod-cta",
          text: i18nProxy.setting.account.linkSignUpNow(),
          onclick: function () {
            return window.open("http://obsidian.md/account", "_blank");
          },
        });
        e.createEl("button", {
          text: i18nProxy.setting.account.buttonLogin(),
          onclick: function () {
            var e = n.parentModal.app;
            n.parentModal.close();
            new V5(e)
              .setCloseCallback(function () {
                return n.parentModal.open();
              })
              .open();
          },
        });
      });
      return n;
    }
    __extends(t, e);
    return t;
  })(_5),
  K5 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.labelManageSites();
      n.slugInputEl = null;
      return n;
    }
    __extends(t, e);
    t.prototype.show = function () {
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
          count,
          h,
          p,
          d,
          f,
          m,
          g,
          v,
          w,
          limit,
          C,
          E,
          S,
          M,
          x,
          T = this;
        return __generator(this, function (D) {
          switch (D.label) {
            case 0:
              n = (t = this).parentModal;
              i = t.el;
              r = n.plugin;
              o = n.app;
              i.empty();
              D.label = 1;
            case 1:
              D.trys.push([1, 3, , 4]);
              return [
                4,
                ((token = c$.token),
                HQ("/publish/list", {
                  token: token,
                })),
              ];
            case 2:
              a = D.sent();
              return [3, 4];
            case 3:
              s = D.sent();
              n.handleError(s);
              return [2];
            case 4:
              l = a.sites;
              c = a.shared;
              count = a.limit;
              new Setting(i).setName(q5.labelYourSites()).setHeading();
              h = i.createDiv("site-list-container");
              p = l
                .map(function (e) {
                  return e.id;
                })
                .concat(
                  c.map(function (e) {
                    return e.id;
                  }),
                );
              d = {};
              D.label = 5;
            case 5:
              D.trys.push([5, 7, , 8]);
              return [4, r.apiGetSlugs(p)];
            case 6:
              d = D.sent();
              return [3, 8];
            case 7:
              f = D.sent();
              console.error(f);
              return [3, 8];
            case 8:
              if (l.length === 0 && count !== 0)
                h.createDiv("site-empty-state u-center-text", function (e) {
                  e.createEl("p", {
                    text: q5.labelNoSites(),
                  });
                });
              else
                for (
                  m = function (e) {
                    h.createDiv("site-list-item list-item", function (t) {
                      var texti0 = d[e.id] || e.id;
                      t.createDiv({
                        cls: "list-item-part mod-extended",
                        text: texti0,
                      });
                      t.createEl(
                        "button",
                        {
                          text: q5.buttonChoose(),
                        },
                        function (t) {
                          t.addEventListener("click", function () {
                            return __awaiter(T, undefined, undefined, function () {
                              return __generator(this, function (t) {
                                switch (t.label) {
                                  case 0:
                                    return [4, r.setup(e.id, e.host)];
                                  case 1:
                                    t.sent();
                                    return [4, n.openReviewChanges()];
                                  case 2:
                                    t.sent();
                                    return [2];
                                }
                              });
                            });
                          });
                        },
                      );
                      t.createDiv(
                        {
                          cls: "clickable-icon",
                        },
                        function (t) {
                          setIcon(t, "lucide-edit-3");
                          setTooltip(t, q5.tooltipEditSiteId());
                          t.addEventListener("click", function () {
                            n.editSlug(e, d[e.id] || "");
                          });
                        },
                      );
                      t.createDiv("clickable-icon", function (t) {
                        setIcon(t, "lucide-x");
                        setTooltip(t, q5.tooltipDeleteSite());
                        t.addEventListener("click", function () {
                          var t = document.createDocumentFragment();
                          t.createEl("p", {
                            text: q5.labelDeleteSiteConfirmation(),
                          });
                          t.createEl("p", {
                            cls: "setting-message mod-warning",
                            text: q5.labelDeleteSiteDetails(),
                          });
                          new GM(o)
                            .setTitle(
                              q5.labelConfirmDeleteSite({
                                site: texti0,
                              }),
                            )
                            .setContent(t)
                            .addButton("mod-warning", i18nProxy.dialogue.buttonDelete(), function () {
                              n.deleteSite(e.id);
                            })
                            .addCancelButton()
                            .open();
                        });
                      });
                    });
                  },
                    g = 0,
                    v = l;
                  g < v.length;
                  g++
                ) {
                  w = v[g];
                  m(w);
                }
              if (
                (l.length < count
                  ? (new Setting(i)
                      .setName(q5.optionSiteId())
                      .setDesc(q5.optionSiteIdDescription())
                      .addText(function (e) {
                        e.setPlaceholder(q5.optionSiteIdPlaceholder());
                        e.inputEl.addEventListener("keydown", function (e) {
                          if (!(e.isComposing || e.key !== "Enter")) {
                            T.createSite();
                          }
                        });
                        T.slugInputEl = e.inputEl;
                      })
                      .setClass("site-list-site-id-setting"),
                    i.createDiv("u-center-text", function (e) {
                      e.createEl(
                        "button",
                        {
                          text: q5.buttonCreate(),
                          cls: "mod-cta",
                        },
                        function (e) {
                          e.addEventListener("click", T.createSite.bind(T));
                        },
                      );
                    }))
                  : count === 0
                    ? h.createDiv("list-item", function (e) {
                        e.createDiv({
                          cls: "list-item-part mod-extended u-muted",
                          text: q5.labelNoSitesBought(),
                        });
                        e.createEl(
                          "button",
                          {
                            cls: "list-item-part mod-cta",
                            text: q5.buttonGetSite(),
                          },
                          function (e) {
                            e.addEventListener("click", function () {
                              window.open("https://obsidian.md/account", "_blank");
                            });
                          },
                        );
                      })
                    : ((limit = i18nProxy.nouns.siteWithCount({
                        count: count,
                      })),
                      h.createDiv("list-item", function (e) {
                        e.createDiv({
                          cls: "list-item-part mod-extended u-muted",
                          text: q5.labelSiteUsage({
                            site: l.length.toString(),
                            limit: limit,
                          }),
                        });
                        e.createEl(
                          "button",
                          {
                            cls: "list-item-part mod-cta",
                            text: q5.buttonAddMoreSites(),
                          },
                          function (e) {
                            e.addEventListener("click", function () {
                              window.open("https://obsidian.md/account", "_blank");
                            });
                          },
                        );
                      })),
                c.length > 0)
              )
                for (
                  new Setting(i).setName(q5.labelSitesSharedWithYou()).setHeading(),
                    C = i.createDiv("site-list-container"),
                    E = function (e) {
                      C.createDiv("site-list-item list-item", function (t) {
                        var i = e.id,
                          texta0 = d[i] || i;
                        t.createDiv({
                          cls: "list-item-part mod-extended",
                          text: texta0,
                        });
                        t.createEl(
                          "button",
                          {
                            text: q5.buttonChoose(),
                          },
                          function (t) {
                            t.addEventListener("click", function () {
                              return __awaiter(T, undefined, undefined, function () {
                                return __generator(this, function (t) {
                                  switch (t.label) {
                                    case 0:
                                      return [4, r.setup(i, e.host)];
                                    case 1:
                                      t.sent();
                                      return [4, n.openReviewChanges()];
                                    case 2:
                                      t.sent();
                                      return [2];
                                  }
                                });
                              });
                            });
                          },
                        );
                        t.createDiv("clickable-icon", function (t) {
                          setIcon(t, "lucide-x");
                          setTooltip(t, q5.tooltipLeaveSiteSharing());
                          t.addEventListener("click", function () {
                            var t = document.createDocumentFragment();
                            t.createEl("p", {
                              cls: "setting-message mod-warning",
                              text: q5.labelLeaveSiteConfirmationDetails(),
                            });
                            t.createEl("p", {
                              text: q5.labelLeaveSiteConfirmationDetails_2(),
                            });
                            new GM(o)
                              .setTitle(
                                q5.labelLeaveSiteConfirmation({
                                  site: texta0,
                                }),
                              )
                              .setContent(t)
                              .addButton("mod-warning", q5.buttonLeave(), function () {
                                n.deleteSiteShare(i, e.share_uid);
                              })
                              .addCancelButton()
                              .open();
                          });
                        });
                      });
                    },
                    S = 0,
                    M = c;
                  S < M.length;
                  S++
                ) {
                  x = M[S];
                  E(x);
                }
              e.prototype.show.call(this);
              return [2];
          }
          var token;
        });
      });
    };
    t.prototype.createSite = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (
                ((t = (e = this).parentModal),
                (n = e.slugInputEl),
                (i = t.plugin),
                t.hideError(),
                (r = n.value.toLowerCase()),
                !/^[a-z0-9\-]+$/.test(r))
              ) {
                t.showError(q5.msgInvalidSiteId());
                return [2];
              }
              l.label = 1;
            case 1:
              l.trys.push([1, 3, , 13]);
              return [4, i.apiCheckSlug(r)];
            case 2:
              l.sent();
              t.showError(q5.msgSiteIdInUse());
              return [3, 13];
            case 3:
              if (!((o = l.sent()) instanceof f8 && o.code === "NOTFOUND")) return [3, 11];
              l.label = 4;
            case 4:
              l.trys.push([4, 9, , 10]);
              return [
                4,
                ((token = c$.token),
                HQ("/publish/create", {
                  token: token,
                })),
              ];
            case 5:
              a = l.sent();
              return [4, i.apiSetSlug(a.id, a.host, r)];
            case 6:
              l.sent();
              return [4, i.setup(a.id, a.host)];
            case 7:
              l.sent();
              return [4, t.openReviewChanges()];
            case 8:
              l.sent();
              return [3, 10];
            case 9:
              s = l.sent();
              t.handleError(s);
              return [3, 10];
            case 10:
              return [3, 12];
            case 11:
              t.handleError(o);
              l.label = 12;
            case 12:
              return [3, 13];
            case 13:
              return [2];
          }
          var token;
        });
      });
    };
    return t;
  })(_5),
  Y5 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.title = q5.labelSiteOptions();
      return t;
    }
    __extends(t, e);
    t.prototype.show = function () {
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
          h = this;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              n = (t = this).el;
              i = t.parentModal;
              r = i.plugin;
              o = i.app;
              n.empty();
              p.label = 1;
            case 1:
              p.trys.push([1, 3, , 4]);
              return [4, r.apiOptions()];
            case 2:
              a = p.sent();
              return [3, 4];
            case 3:
              s = p.sent();
              i.handleError(s);
              n.createDiv("modal-button-container", function (e) {
                e.createEl(
                  "button",
                  {
                    text: q5.buttonGoBack(),
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      return __awaiter(h, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.openReviewChanges()];
                            case 1:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    });
                  },
                );
              });
              return [2];
            case 4:
              l = {};
              c = function (e) {
                return a.hasOwnProperty(e) ? a[e] : ZU[e];
              };
              u = n.createDiv("publish-site-settings-container");
              new Setting(u).setName(q5.optionSiteGeneral()).setHeading();
              new Setting(u)
                .setName(q5.optionSiteName())
                .setDesc(q5.optionSiteNameDescription())
                .addText(function (e) {
                  return e
                    .setPlaceholder(q5.optionSiteNamePlaceholder())
                    .setValue(c(LU))
                    .onChange(function (e) {
                      return (l[LU] = e);
                    });
                });
              new Setting(u)
                .setName(q5.optionHomePageFile())
                .setDesc(q5.optionHomePageFileDescription())
                .addText(function (e) {
                  e.setPlaceholder(q5.optionHomePageFilePlaceholder())
                    .setValue(c(PU))
                    .onChange(function (e) {
                      return (l[PU] = e);
                    });
                  new yT(o, e.inputEl);
                });
              new Setting(u)
                .setName(q5.optionLogo())
                .setDesc(q5.optionLogoDescription())
                .addText(function (e) {
                  e.setPlaceholder(q5.optionLogoPlaceholder())
                    .setValue(c(IU))
                    .onChange(function (e) {
                      return (l[IU] = e);
                    });
                  new U5(o, e.inputEl);
                });
              r.isGuest ||
                (new Setting(u)
                  .setName(q5.optionSiteCollaboration())
                  .setDesc(q5.optionSiteCollaborationDesc())
                  .addButton(function (e) {
                    return e.setButtonText(q5.buttonManageCollaborators()).onClick(function () {
                      return __awaiter(h, undefined, undefined, function () {
                        var e, t;
                        return __generator(this, function (n) {
                          switch (n.label) {
                            case 0:
                              e = r.siteId;
                              return [4, r.getCurrentSlug()];
                            case 1:
                              t = n.sent();
                              new s8(o, t, e).open();
                              return [2];
                          }
                        });
                      });
                    });
                  }),
                new Setting(u)
                  .setName(q5.optionCustomDomain())
                  .setDesc(q5.optionCustomDomainDesc())
                  .addButton(function (e) {
                    return e.setButtonText(q5.buttonConfigure()).onClick(function () {
                      return __awaiter(h, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.openSection(i.configureCustomDomainSection)];
                            case 1:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    });
                  }),
                new Setting(u)
                  .setName(q5.optionNoindex())
                  .setDesc(q5.optionNoindexDesc())
                  .addToggle(function (e) {
                    return e.setValue(c(OU)).onChange(function (e) {
                      return (l[OU] = e);
                    });
                  }));
              new Setting(u).setName(q5.optionSiteAppearance()).setHeading();
              new Setting(u)
                .setName(q5.optionTheme())
                .setDesc(q5.optionThemeDescription())
                .addDropdown(function (e) {
                  return e
                    .addOption("light", i18nProxy.setting.appearance.lightTheme())
                    .addOption("dark", i18nProxy.setting.appearance.darkTheme())
                    .addOption("system", q5.optionThemeSystem())
                    .setValue(c(FU))
                    .onChange(function (e) {
                      return (l[FU] = e);
                    });
                });
              new Setting(u)
                .setName(q5.optionShowThemeToggle())
                .setDesc(q5.optionShowThemeToggleDescription())
                .addToggle(function (e) {
                  return e.setValue(c(NU)).onChange(function (e) {
                    return (l[NU] = e);
                  });
                });
              new Setting(u).setName(q5.optionSiteReadingExperience()).setHeading();
              new Setting(u)
                .setName(q5.optionHoverPreviewFile())
                .setDesc(q5.optionHoverPreviewFileDescription())
                .addToggle(function (e) {
                  return e.setValue(c(_U)).onChange(function (e) {
                    return (l[_U] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionHideTitle())
                .setDesc(q5.optionHideTitleDescription())
                .addToggle(function (e) {
                  return e.setValue(c(qU)).onChange(function (e) {
                    return (l[qU] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionReadableLineLength())
                .setDesc(q5.optionReadableLineLengthDescription())
                .addToggle(function (e) {
                  return e.setValue(c(WU)).onChange(function (e) {
                    return (l[WU] = e);
                  });
                });
              new Setting(u)
                .setName(i18nProxy.setting.editor.optionStrictLineBreak())
                .setDesc(i18nProxy.setting.editor.optionStrictLineBreakDescription())
                .addToggle(function (e) {
                  return e.setValue(c(UU)).onChange(function (e) {
                    return (l[UU] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionSlidingWindowMode())
                .setDesc(q5.optionSlidingWindowModeDescription())
                .addToggle(function (e) {
                  return e.setValue(c(GU)).onChange(function (e) {
                    return (l[GU] = e);
                  });
                });
              new Setting(u).setName(q5.optionSiteComponents()).setHeading();
              new Setting(u)
                .setName(q5.optionShowNavigation())
                .setDesc(q5.optionShowNavigationDescription())
                .addToggle(function (e) {
                  return e.setValue(c(RU)).onChange(function (e) {
                    l[RU] = e;
                  });
                });
              new Setting(u)
                .setName(q5.optionCustomizeNavigation())
                .setDesc(q5.optionCustomizeNavigationDesc())
                .addButton(function (e) {
                  return e.setButtonText(q5.buttonCustomizeSidebar()).onClick(function () {
                    return __awaiter(h, undefined, undefined, function () {
                      var e, t, n, a, s, u, h, p;
                      return __generator(this, function (d) {
                        switch (d.label) {
                          case 0:
                            e = [];
                            d.label = 1;
                          case 1:
                            d.trys.push([1, 3, , 4]);
                            return [4, r.apiList()];
                          case 2:
                            for (t = d.sent(), n = 0, a = t.files; n < a.length; n++) {
                              s = a[n];
                              e.push(s.path);
                            }
                            return [3, 4];
                          case 3:
                            u = d.sent();
                            i.handleError(u);
                            return [3, 4];
                          case 4:
                            h = c(KU);
                            p = c(YU);
                            new D5(o, r, e, h, p)
                              .onOrderChange(function (e) {
                                l[KU] = e;
                              })
                              .onVisibilityChange(function (e) {
                                l[YU] = e;
                              })
                              .open();
                            return [2];
                        }
                      });
                    });
                  });
                });
              new Setting(u)
                .setName(q5.optionShowSearch())
                .setDesc(q5.optionShowSearchDescription())
                .addToggle(function (e) {
                  return e.setValue(c(HU)).onChange(function (e) {
                    return (l[HU] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionShowGraph())
                .setDesc(q5.optionShowGraphDescription())
                .addToggle(function (e) {
                  return e.setValue(c(BU)).onChange(function (e) {
                    return (l[BU] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionShowOutline())
                .setDesc(q5.optionShowOutlineDescription())
                .addToggle(function (e) {
                  return e.setValue(c(VU)).onChange(function (e) {
                    return (l[VU] = e);
                  });
                });
              new Setting(u)
                .setName(q5.optionShowBacklinks())
                .setDesc(q5.optionShowBacklinksDescription())
                .addToggle(function (e) {
                  return e.setValue(c(jU)).onChange(function (e) {
                    return (l[jU] = e);
                  });
                });
              r.isGuest ||
                (new Setting(u).setName(q5.optionSiteMisc()).setHeading(),
                new Setting(u)
                  .setName(q5.optionSitePassword())
                  .setDesc(q5.optionSitePasswordDescription())
                  .addButton(function (e) {
                    return e.setButtonText(q5.buttonManagePasswords()).onClick(function () {
                      return __awaiter(h, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.showPasswords()];
                            case 1:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    });
                  }),
                new Setting(u)
                  .setName(q5.optionGoogleAnalytics())
                  .setDesc(q5.optionGoogleAnalyticsDescription())
                  .addText(function (e) {
                    return (e
                      .setPlaceholder("UA-XXXXX-Y or G-XXXXXXXX")
                      .setValue(c(zU))
                      .onChange(function (e) {
                        return (l[zU] = e);
                      }).inputEl.style.width = "200px");
                  }));
              n.createDiv("modal-button-container", function (e) {
                e.createEl(
                  "button",
                  {
                    text: q5.buttonSaveSiteSettings(),
                    cls: "mod-cta",
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      return __awaiter(h, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              t.trys.push([0, 2, , 3]);
                              return [4, r.apiOptions(l)];
                            case 1:
                              t.sent();
                              return [3, 3];
                            case 2:
                              e = t.sent();
                              i.handleError(e);
                              return [2];
                            case 3:
                              new Notice(q5.msgUpdatedOptions());
                              return [4, i.openReviewChanges()];
                            case 4:
                              t.sent();
                              return [2];
                          }
                        });
                      });
                    });
                  },
                );
                e.createEl(
                  "button",
                  {
                    text: q5.buttonGoBack(),
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      return __awaiter(h, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, i.openReviewChanges()];
                            case 1:
                              e.sent();
                              return [2];
                          }
                        });
                      });
                    });
                  },
                );
              });
              e.prototype.show.call(this);
              return [2];
          }
        });
      });
    };
    return t;
  })(_5),
  Z5 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.title = q5.labelSiteOptions();
      return t;
    }
    __extends(t, e);
    t.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          s = this;
        return __generator(this, function (l) {
          n = (t = this).el;
          i = t.parentModal;
          r = i.plugin;
          o = i.app;
          n.empty();
          a = n.createDiv("publish-site-settings-container");
          new Setting(a)
            .setName(q5.optionIncludedFolders())
            .setDesc(
              createFragment(function (e) {
                var t = s.parentModal.plugin.includes;
                if ((e.appendText(q5.optionIncludedFoldersDesc()), t.length > 0)) {
                  e.appendText(i18nProxy.plugins.publish.optionCurrentlyIncludedFolders());
                  for (var n = e.createEl("ul"), i = 0, r = t; i < r.length; i++) {
                    var texto0 = r[i];
                    n.createEl("li", {
                      text: texto0,
                    });
                  }
                }
              }),
            )
            .addButton(function (e) {
              return e.setButtonText(i18nProxy.interface.buttonManage()).onClick(function () {
                new u8(o, r, s).open();
              });
            });
          new Setting(a)
            .setName(q5.optionExcludedFolders())
            .setDesc(
              createFragment(function (e) {
                var t = s.parentModal.plugin.excludes;
                if ((e.appendText(q5.optionExcludedFoldersDesc()), t.length > 0)) {
                  e.appendText(i18nProxy.plugins.sync.optionCurrentlyExcludedFolders());
                  for (var n = e.createEl("ul"), i = 0, r = t; i < r.length; i++) {
                    var texto0 = r[i];
                    n.createEl("li", {
                      text: texto0,
                    });
                  }
                }
              }),
            )
            .addButton(function (e) {
              return e.setButtonText(i18nProxy.interface.buttonManage()).onClick(function () {
                new h8(o, r, s).open();
              });
            });
          n.createDiv("modal-button-container", function (e) {
            e.createEl(
              "button",
              {
                cls: "mod-cta",
                text: i18nProxy.dialogue.buttonDone(),
              },
              function (e) {
                e.addEventListener("click", function () {
                  return __awaiter(s, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, i.openReviewChanges()];
                        case 1:
                          e.sent();
                          return [2];
                      }
                    });
                  });
                });
              },
            );
          });
          e.prototype.show.call(this);
          return [2];
        });
      });
    };
    return t;
  })(_5),
  X5 = (function (e) {
    function t(section) {
      var n = e.call(this) || this;
      n.visible = true;
      n.children = null;
      n.section = section;
      n.innerEl.addClass("file-tree-item");
      return n;
    }
    __extends(t, e);
    t.prototype.setChecked = function (e) {};
    t.prototype.setVisible = function (visible) {
      this.visible = visible;
      this.el.toggle(visible);
    };
    t.prototype.applyQuery = function (e) {};
    t.prototype.updateCheckedRecursive = function () {
      for (var e = this.parent; e; ) {
        e.updateChecked();
        e = e.parent;
      }
      this.section.updateChecked();
    };
    return t;
  })(M_),
  Q5 = function (e, t) {
    var n = e instanceof J5,
      i = t instanceof J5;
    if (n || i) {
      if (n && !i) return -1;
      if (i && !n) return 1;
    }
    return Eb(e.name, t.name);
  },
  $5 = (function (e) {
    function t(t, diff) {
      var i = e.call(this, t) || this;
      i.diff = diff;
      i.path = diff.path;
      var namer0 = getFilename(diff.path),
        o = getExtension(namer0);
      o === "md" && (namer0 = Qc(namer0));
      i.name = namer0;
      var a = i,
        s = a.selfEl,
        l = a.innerEl;
      s.addClass("mod-file", "mod-".concat(diff.type));
      (i.checkboxEl = l.createEl("input", {
        cls: "file-tree-item-checkbox",
        type: "checkbox",
      })).addEventListener("change", i.updateChecked.bind(i));
      setIcon(l.createDiv("file-tree-item-icon"), "lucide-file");
      l.createDiv({
        cls: "file-tree-item-title",
        text: namer0,
      });
      i.updateChecked();
      l.createDiv("tree-item-flair-outer").createSpan({
        cls: "tree-item-flair",
        text: diff.type === "to-delete" ? "To delete" : diff.type,
      });
      diff.type !== "changed" ||
        (o !== "md" && o !== "css" && o !== "js") ||
        l
          .createDiv("clickable-icon", function (e) {
            setIcon(e, "lucide-columns");
            setTooltip(e, q5.labelCompareWithLive());
          })
          .addEventListener("click", function (e) {
            return __awaiter(i, undefined, undefined, function () {
              return __generator(this, function (t) {
                e.preventDefault();
                new l8(this.section.publish.app, this.section.publish, this.path).open();
                return [2];
              });
            });
          });
      s.addEventListener("contextmenu", i.onContextMenu.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      this.setChecked(!this.diff.checked);
      this.updateCheckedRecursive();
    };
    t.prototype.setChecked = function (checked) {
      if (this.diff.checked !== checked) {
        this.diff.checked = checked;
        this.updateChecked();
      }
    };
    t.prototype.updateChecked = function () {
      var checked = this.diff.checked;
      this.checkboxEl.checked = checked;
      this.selfEl.toggleClass("is-selected", checked);
    };
    t.prototype.applyQuery = function (e) {
      this.setVisible(this.diff.checked || this.path.toLowerCase().contains(e));
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      this.setCollapsible(!1);
      this.setClickable(!0);
    };
    t.prototype.onContextMenu = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          o,
          a,
          s = this;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              e.preventDefault();
              t = new Menu();
              n = this.diff;
              i = n.type;
              r = n.path;
              o = this.section.publish.app;
              return [4, this.section.publish.getCurrentSlug()];
            case 1:
              a = l.sent();
              (i !== "changed" && i !== "deleted" && i !== "to-delete") ||
                t.addItem(function (e) {
                  return e
                    .setIcon("lucide-globe")
                    .setTitle(q5.labelOpenInLiveSite())
                    .onClick(function () {
                      window.open(d8 + "/" + a + "/" + y_(ou(r)));
                    });
                });
              (i !== "changed" && i !== "new" && i !== "to-delete") ||
                t.addItem(function (e) {
                  return e
                    .setIcon("lucide-folder-open")
                    .setTitle(q5.labelOpenFile())
                    .onClick(function () {
                      var e = o.workspace.getLeaf(),
                        t = o.vault.getAbstractFileByPath(r);
                      if (t && t instanceof TFile) {
                        e.openFile(t, {
                          active: !0,
                        });
                        s.section.publish.modal.close();
                      }
                    });
                });
              i === "changed" &&
                t.addItem(function (e) {
                  return e
                    .setIcon("lucide-columns")
                    .setTitle(q5.labelCompareWithLive())
                    .onClick(function () {
                      new l8(o, s.section.publish, s.path).open();
                    });
                });
              (i !== "changed" && i !== "deleted") ||
                t.addItem(function (e) {
                  return e
                    .setIcon("lucide-pencil")
                    .setTitle(q5.buttonUseLiveVersion())
                    .onClick(function () {
                      return __awaiter(s, undefined, undefined, function () {
                        var e, t, n, i;
                        return __generator(this, function (a) {
                          switch (a.label) {
                            case 0:
                              return [4, this.section.publish.apiDownloadFile(r)];
                            case 1:
                              e = a.sent();
                              return (t = o.vault.getAbstractFileByPath(r)) && t instanceof TFile
                                ? (new c8(o, t, this.section.publish.modal, e).open(), [3, 9])
                                : [3, 2];
                            case 2:
                              n = Zc(r);
                              return (i = n) ? [4, o.vault.exists(n)] : [3, 4];
                            case 3:
                              i = !a.sent();
                              a.label = 4;
                            case 4:
                              return i ? [4, o.vault.createFolder(n)] : [3, 6];
                            case 5:
                              a.sent();
                              a.label = 6;
                            case 6:
                              return [4, o.vault.createBinary(r, e)];
                            case 7:
                              a.sent();
                              new Notice(q5.messageSuccessfullyUsedLiveVersion());
                              return [4, this.section.publish.modal.reviewChangesSection.show()];
                            case 8:
                              a.sent();
                              a.label = 9;
                            case 9:
                              return [2];
                          }
                        });
                      });
                    });
                });
              t.showAtMouseEvent(e);
              return [2];
          }
        });
      });
    };
    return t;
  })(X5),
  J5 = (function (e) {
    function t(t, path) {
      var i = e.call(this, t) || this;
      i.children = [];
      i.path = path;
      i.name = getFilename(path);
      i.setCollapsible(!0);
      var r = i.innerEl;
      i.selfEl.addClass("mod-folder");
      (i.checkboxEl = r.createEl("input", {
        cls: "file-tree-item-checkbox",
        type: "checkbox",
      })).addEventListener("change", i.updateChecked.bind(i));
      setIcon(r.createDiv("file-tree-item-icon"), "lucide-folder-open");
      r.createDiv({
        cls: "file-tree-item-title",
        text: i.name,
      });
      return i;
    }
    __extends(t, e);
    t.prototype.getChecked = function () {
      for (var count = 0, checked = 0, i = 0, r = this.children; i < r.length; i++) {
        var o = r[i];
        if (o instanceof $5) {
          count++;
          o.diff.checked && checked++;
        } else if (o instanceof t) {
          var a = o.getChecked();
          count += a.count;
          checked += a.checked;
        }
      }
      return {
        count: count,
        checked: checked,
      };
    };
    t.prototype.onSelfClick = function (e) {
      var t = this.getChecked(),
        n = t.count,
        i = t.checked;
      if (n !== 0) {
        for (var r = i < n, o = 0, a = this.children; o < a.length; o++) {
          a[o].setChecked(r);
        }
        this.updateChecked();
        this.updateCheckedRecursive();
      }
    };
    t.prototype.setChecked = function (e) {
      for (var t = 0, n = this.children; t < n.length; t++) {
        n[t].setChecked(e);
      }
      this.updateChecked();
    };
    t.prototype.updateChecked = function () {
      var e = this.getChecked(),
        t = e.count,
        n = e.checked,
        i = this.checkboxEl,
        checked = t > 0 && n === t;
      i.checked = checked;
      i.indeterminate = !checked && n > 0;
      this.selfEl.toggleClass("is-selected", checked);
    };
    t.prototype.applyQuery = function (e) {
      for (var t = false, n = 0, i = this.children; n < i.length; n++) {
        var r = i[n];
        r.applyQuery(e);
        t = t || r.visible;
      }
      this.setVisible(t);
    };
    t.prototype.render = function () {
      this.children.sort(Q5);
      e.prototype.render.call(this);
      this.setClickable(!0);
    };
    return t;
  })(X5),
  e8 = (function (e) {
    function t(publish, n, texti0) {
      var r = e.call(this, n) || this;
      r.children = [];
      r.collapsed = false;
      r.folders = {};
      r.files = {};
      r.publish = publish;
      var sectionEl = n.createDiv("file-tree publish-section"),
        headerEl = sectionEl.createDiv("publish-section-header");
      r.childrenEl = sectionEl.createDiv("publish-change-list");
      r.sectionEl = sectionEl;
      r.headerEl = headerEl;
      headerEl.createDiv("publish-section-header-toggle-collapsed-button collapse-icon", function (e) {
        setIcon(e, "right-triangle");
        e.addEventListener("click", function () {
          return r.toggleCollapsed(!0);
        });
      });
      headerEl.createDiv(
        {
          cls: "publish-section-header-text",
          text: texti0,
        },
        function (e) {
          e.addEventListener("click", function () {
            return r.toggleCollapsed(!0);
          });
        },
      );
      r.selectedEl = headerEl.createDiv("publish-section-header-selected", function (e) {
        r.selectedCountEl = e.createSpan({
          cls: "publish-section-header-selected-count",
          text: "0",
        });
        e.createSpan({
          text: q5.labelFileSelected(),
        });
      });
      headerEl
        .createDiv({
          cls: "publish-section-header-action button",
          text: q5.buttonSelectAllFiles(),
        })
        .addEventListener("click", r.checkAll.bind(r));
      headerEl
        .createDiv({
          cls: "publish-section-header-action",
          text: q5.buttonDeselectAllFiles(),
        })
        .addEventListener("click", r.uncheckAll.bind(r));
      return r;
    }
    __extends(t, e);
    t.prototype.toggleCollapsed = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.setCollapsed(!this.collapsed, e)];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.setCollapsed = function (collapsed, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return this.collapsed === collapsed
                ? [2]
                : ((this.collapsed = collapsed),
                  CO(this.sectionEl, collapsed),
                  [4, toggleElementVisibility(this.childrenEl, collapsed, t)]);
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.collapseAll = function () {
      for (var e = this.children.slice(); e.length > 0; ) {
        var t = e.pop();
        if (t.children) {
          t.toggleCollapsed(!1);
          e.push.apply(e, t.children);
        }
      }
    };
    t.prototype.checkAll = function () {
      for (var e = 0, t = this.children; e < t.length; e++) {
        t[e].setChecked(!0);
      }
      this.updateChecked();
    };
    t.prototype.uncheckAll = function () {
      for (var e = 0, t = this.children; e < t.length; e++) {
        t[e].setChecked(!1);
      }
      this.updateChecked();
    };
    t.prototype.updateChecked = function () {
      var e = this,
        t = e.files,
        n = e.selectedEl,
        i = e.selectedCountEl,
        r = 0,
        o = 0;
      for (var a in t)
        if (t.hasOwnProperty(a)) {
          t[a].diff.checked && r++;
          o++;
        }
      i.setText(String(r) + "/" + String(o));
      n.toggleClass("u-pop", r > 0);
    };
    t.prototype.addChild = function (e) {
      var t = Zc(e.path);
      if (t) {
        var n = this.folders,
          parent = n[t];
        parent || ((parent = n[t] = new J5(this, t)), this.addChild(parent));
        parent.children.push(e);
        e.parent = parent;
      } else this.addRoot(e);
    };
    t.prototype.createItem = function (e) {
      var t = new $5(this, e);
      this.files[e.path] = t;
      this.addChild(t);
    };
    t.prototype.render = function () {
      this.children.sort(Q5);
      e.prototype.render.call(this);
      this.updateChecked();
    };
    t.prototype.applyQuery = function (e) {
      for (var t = 0, n = this.children; t < n.length; t++) {
        n[t].applyQuery(e);
      }
    };
    t.prototype.clear = function () {
      e.prototype.clear.call(this);
      this.folders = {};
      this.files = {};
      this.updateChecked();
    };
    return t;
  })(x_),
  t8 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.name();
      n.siteOptionsEl = null;
      n.siteFiltersEl = null;
      n.noChangesEl = null;
      n.pathToDiffMap = {};
      n.currentlyPublishedToSiteNameEl = null;
      n.filterComponent = null;
      n.app = t.app;
      n.el.createDiv(
        {
          cls: "publish-changes-info",
        },
        function (e) {
          e.createDiv({
            cls: "publish-changes-info-publishing-to",
            text: q5.labelPublishingTo(),
          });
          (n.currentlyPublishedToSiteNameEl = e.createEl("a", "publish-changes-current-site-name")).setAttribute(
            "target",
            "_blank",
          );
          e.createDiv("publish-changes-switch-site", function (e) {
            e.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-repeat");
              setTooltip(e, q5.tooltipSwitchSite());
              e.addEventListener("click", function () {
                return __awaiter(n, undefined, undefined, function () {
                  var e;
                  return __generator(this, function (t) {
                    switch (t.label) {
                      case 0:
                        return [4, (e = this.parentModal).openSection(e.manageSitesSection)];
                      case 1:
                        t.sent();
                        return [2];
                    }
                  });
                });
              });
            });
            n.siteOptionsEl = e.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-settings");
              setTooltip(e, q5.tooltipOpenSiteOptions());
              e.addEventListener("click", function () {
                var e = n.parentModal;
                e.openSection(e.siteOptionsSection);
              });
            });
            n.siteFiltersEl = e.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-filter");
              setTooltip(e, q5.tooltipManagePublishFilters());
              e.addEventListener("click", function () {
                var e = n.parentModal;
                e.openSection(e.siteFiltersSection);
              });
            });
            e.createSpan("clickable-icon", function (e) {
              setIcon(e, "lucide-life-buoy");
              setTooltip(e, q5.tooltipContactSupport());
              e.addEventListener("click", function () {
                window.open("mailto:support@obsidian.md?subject=Obsidian%20Publish%20Support");
              });
            });
          });
          n.filterComponent = new SearchComponent(e).setPlaceholder(i18nProxy.setting.hotkeys.promptFilter());
          e.createEl(
            "button",
            {
              cls: "publish-changes-add-linked-btn",
              text: q5.buttonAddLinked(),
            },
            function (e) {
              setTooltip(e, q5.tooltipAddLinked());
              e.addEventListener("click", function () {
                return __awaiter(n, undefined, undefined, function () {
                  var e, t, n, i, r, o, a, s, l, count, u, h, p;
                  return __generator(this, function (d) {
                    for (u in ((e = this.app.metadataCache),
                    (n = (t = this).pathToDiffMap),
                    (i = t.sectionNew),
                    (r = []),
                    n))
                      if (n.hasOwnProperty(u) && (h = n[u]).checked && h.type !== "deleted") {
                        r.push(u);
                      }
                    for (
                      o = new Set(),
                        a = function (t) {
                          iterateCacheRefs(e.getCache(t), function (n) {
                            var i = e.getFirstLinkpathDest(n.link, t);
                            if (i) {
                              o.add(i.path);
                            }
                          });
                        },
                        s = 0,
                        l = r;
                      s < l.length;
                      s++
                    ) {
                      u = l[s];
                      a(u);
                    }
                    for (u in ((count = 0), n))
                      if (n.hasOwnProperty(u) && o.has(u)) {
                        (h = n[u]).checked ||
                          h.type !== "new" ||
                          ((p = i.files[u]) && (p.setChecked(!0), p.updateCheckedRecursive(), (count += 1)));
                      }
                    new Notice(
                      q5.msgAddedLinkedFiles({
                        count: count,
                      }),
                    );
                    return [2];
                  });
                });
              });
            },
          );
        },
      );
      n.noChangesEl = n.el.createEl("p", {
        text: q5.labelNoChangesDetected(),
      });
      var i = n.el.createDiv("publish-sections-container");
      n.sectionChanged = new e8(t.plugin, i, q5.labelChangedFilesToBePublished());
      n.sectionUnchanged = new e8(t.plugin, i, q5.labelUnchangedFilesAlreadyPublished());
      n.sectionNew = new e8(t.plugin, i, q5.labelNewFilesToBePublished());
      var r = n.el.createDiv("modal-button-container");
      r.createEl(
        "button",
        {
          cls: "mod-cta",
          text: q5.buttonPublish(),
        },
        function (e) {
          e.addEventListener("click", n.uploadChanges.bind(n));
        },
      );
      r.createEl(
        "button",
        {
          text: i18nProxy.dialogue.buttonCancel(),
        },
        function (e) {
          e.addEventListener("click", n.parentModal.close.bind(n.parentModal));
        },
      );
      return n;
    }
    __extends(t, e);
    t.prototype.setCurrentSiteName = function (e) {
      this.currentlyPublishedToSiteNameEl.setText(e);
      this.currentlyPublishedToSiteNameEl.setAttribute("href", d8 + "/" + e);
    };
    t.prototype.show = function () {
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
          p,
          d,
          f = this;
        return __generator(this, function (m) {
          switch (m.label) {
            case 0:
              t = this.parentModal;
              this.pathToDiffMap = {};
              t.plugin.getCurrentSlug().then(function (e) {
                return f.setCurrentSiteName(e);
              });
              n = [];
              m.label = 1;
            case 1:
              m.trys.push([1, 3, , 4]);
              return [4, t.plugin.scanForChanges()];
            case 2:
              n = m.sent();
              this.noChangesEl.toggle(n.length === 0);
              return [3, 4];
            case 3:
              i = m.sent();
              t.handleError(i);
              return [2];
            case 4:
              for (
                o = (r = this).sectionChanged,
                  a = r.sectionUnchanged,
                  s = r.sectionNew,
                  o.clear(),
                  a.clear(),
                  s.clear(),
                  l = 0,
                  c = n;
                l < c.length;
                l++
              ) {
                u = c[l];
                this.pathToDiffMap[u.path] = u;
                (h = u.type) === "changed" || h === "deleted"
                  ? o.createItem(u)
                  : h === "new"
                    ? s.createItem(u)
                    : h === "to-delete" && a.createItem(u);
              }
              if (
                (this.filterComponent.onChange(function (e) {
                  e = e.trim().toLowerCase();
                  o.applyQuery(e);
                  a.applyQuery(e);
                  s.applyQuery(e);
                }),
                o.children.length > 0)
              ) {
                for (d in (a.setCollapsed(!0, !1), s.setCollapsed(!0, !1), o.files))
                  if (o.files.hasOwnProperty(d) && (p = o.files[d]).diff.type !== "deleted") {
                    p.setChecked(!0);
                  }
                for (d in o.folders)
                  if (o.folders.hasOwnProperty(d)) {
                    o.folders[d].updateChecked();
                  }
              } else {
                o.setCollapsed(!0, !1);
                a.setCollapsed(!0, !1);
              }
              o.render();
              a.collapseAll();
              a.render();
              s.collapseAll();
              s.render();
              return [2, e.prototype.show.call(this)];
          }
        });
      });
    };
    t.prototype.uploadChanges = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              for (n in ((e = this.pathToDiffMap), (t = []), e))
                if (e.hasOwnProperty(n) && (i = e[n]).checked) {
                  t.push(i);
                }
              return t.length === 0
                ? (new Notice(q5.msgSelectAtLeastOneFile()), [2])
                : [4, this.parentModal.uploadChanges(t)];
            case 1:
              r.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(_5),
  n8 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.labelUploadChanges();
      n.changesContainer = null;
      n.doneButton = null;
      n.successMessageEl = null;
      n.siteLinkEl = null;
      n.runnable = null;
      n.changes = [];
      n.pathToEl = {};
      n.changesContainer = n.el.createDiv("list-item-parent upload-progress-container");
      n.successMessageEl = n.el.createDiv({}, function (e) {
        e.createEl("p", {
          text: q5.labelClearCache(),
        });
        e.createEl(
          "p",
          {
            text: q5.labelVisitSite(),
          },
          function (e) {
            return __awaiter(n, undefined, undefined, function () {
              return __generator(this, function (t) {
                this.siteLinkEl = e.createEl("a");
                this.siteLinkEl.setAttribute("target", "_blank");
                return [2];
              });
            });
          },
        );
      });
      n.successMessageEl.hide();
      n.el.createDiv("modal-button-container", function (e) {
        n.doneButton = e.createEl(
          "button",
          {
            cls: "mod-cta",
            text: q5.buttonDone(),
          },
          function (e) {
            e.addEventListener("click", function () {
              n.runnable ? (n.runnable.cancel(), (n.runnable = null)) : n.parentModal.close();
            });
          },
        );
        e.createEl(
          "button",
          {
            text: q5.buttonGoBack(),
          },
          function (e) {
            e.addEventListener("click", function () {
              n.runnable && n.runnable.cancel();
              n.parentModal.openReviewChanges();
            });
          },
        );
      });
      return n;
    }
    __extends(t, e);
    t.prototype.addChanges = function (changes) {
      this.changes = changes;
    };
    t.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              this.runnable && this.runnable.cancel();
              return [4, e.prototype.show.call(this)];
            case 1:
              for (
                a.sent(),
                  this.successMessageEl.hide(),
                  this.changesContainer.removeClass("is-finished"),
                  this.doneButton.addClass("mod-warning"),
                  this.doneButton.setText(q5.buttonStop()),
                  this.changesContainer.empty(),
                  this.pathToEl = {},
                  t = function (e) {
                    n.pathToEl[e.path] = n.changesContainer.createDiv("publish-upload-item list-item", function (t) {
                      t.createDiv("list-item-part", function (e) {
                        setIcon(e, "lucide-file");
                      });
                      t.createDiv({
                        cls: "list-item-part mod-extended publish-upload-item-title",
                        text: $c(e.path),
                      });
                      t.createDiv("list-item-part", function (t) {
                        var n = t.createSpan("flair");
                        e.type === "new" || e.type === "changed"
                          ? n.setText(q5.labelStatusToPublish())
                          : e.type === "deleted" && n.setText(q5.labelStatusToDelete());
                      });
                    });
                  },
                  n = this,
                  i = 0,
                  r = this.changes;
                i < r.length;
                i++
              ) {
                o = r[i];
                t(o);
              }
              this.startUpload();
              return [2];
          }
        });
      });
    };
    t.prototype.startUpload = function () {
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
              e = this.parentModal;
              t = e.app;
              n = e.plugin;
              i = this.runnable = new ax({
                onStop: function () {
                  return __awaiter(h, undefined, undefined, function () {
                    var e, t;
                    return __generator(this, function (r) {
                      switch (r.label) {
                        case 0:
                          this.doneButton.removeClass("mod-warning");
                          this.doneButton.setText(q5.buttonDone());
                          t = d8 + "/";
                          return [4, n.getCurrentSlug()];
                        case 1:
                          e = t + r.sent();
                          this.siteLinkEl.setText(e);
                          this.siteLinkEl.setAttribute("href", e);
                          this.successMessageEl.show();
                          this.changesContainer.addClass("is-finished");
                          this.runnable === i && (this.runnable = null);
                          return [2];
                      }
                    });
                  });
                },
              });
              i.start();
              r = 0;
              o = this.changes;
              p.label = 1;
            case 1:
              if (!(r < o.length)) return [3, 10];
              if (((a = o[r]), (s = this.pathToEl[a.path]), (l = s.find(".flair")), i.isCancelled())) {
                l.setText(q5.labelStatusCancelled());
                s.addClass("mod-failed", "mod-completed");
                return [3, 9];
              }
              p.label = 2;
            case 2:
              p.trys.push([2, 7, , 8]);
              l.setText(q5.labelStatusUploading());
              return a.type !== "deleted" && a.type !== "to-delete" ? [3, 4] : [4, n.apiRemoveFile(a.path)];
            case 3:
              p.sent();
              l.setText(q5.labelStatusDeleted());
              return [3, 6];
            case 4:
              return (c = t.vault.getAbstractFileByPath(a.path)) && c instanceof TFile
                ? [4, n.apiUploadFile(c)]
                : [3, 6];
            case 5:
              p.sent();
              l.setText(q5.labelStatusPublished());
              p.label = 6;
            case 6:
              s.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              return [3, 8];
            case 7:
              u = p.sent();
              this.parentModal.handleError(u);
              l.setText(q5.labelStatusFailed());
              s.addClass("mod-failed");
              return [3, 8];
            case 8:
              s.addClass("mod-completed");
              p.label = 9;
            case 9:
              r++;
              return [3, 1];
            case 10:
              i.stop();
              return [2];
          }
        });
      });
    };
    return t;
  })(_5),
  i8 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.tooltipEditSiteId();
      n.newSlug = null;
      n.site = null;
      n.slugInputEl = null;
      new Setting(n.el)
        .setName(q5.optionSiteId())
        .setDesc(q5.optionSiteIdDescription())
        .addText(function (e) {
          e.setPlaceholder(q5.optionSiteIdPlaceholder()).onChange(function (e) {
            return (n.newSlug = e.toLowerCase());
          });
          n.slugInputEl = e.inputEl;
        })
        .setClass("site-list-site-id-setting");
      n.el.createEl("p", "modal-button-container", function (e) {
        e.createEl(
          "button",
          {
            cls: "mod-cta",
            text: q5.buttonChange(),
          },
          function (e) {
            return __awaiter(n, undefined, undefined, function () {
              var n = this;
              return __generator(this, function (i) {
                e.addEventListener("click", function () {
                  return __awaiter(n, undefined, undefined, function () {
                    var e, n;
                    return __generator(this, function (i) {
                      switch (i.label) {
                        case 0:
                          e = t.plugin;
                          i.label = 1;
                        case 1:
                          i.trys.push([1, 3, , 4]);
                          return [4, e.apiSetSlug(this.site.id, this.site.host, this.newSlug)];
                        case 2:
                          i.sent();
                          return [3, 4];
                        case 3:
                          n = i.sent();
                          t.handleError(n);
                          return [2];
                        case 4:
                          return [4, t.openSection(t.siteOptionsSection)];
                        case 5:
                          i.sent();
                          return [2];
                      }
                    });
                  });
                });
                return [2];
              });
            });
          },
        );
        e.createEl(
          "button",
          {
            text: i18nProxy.dialogue.buttonCancel(),
          },
          function (e) {
            return __awaiter(n, undefined, undefined, function () {
              var n = this;
              return __generator(this, function (i) {
                e.addEventListener("click", function () {
                  return __awaiter(n, undefined, undefined, function () {
                    return __generator(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, t.openSection(t.manageSitesSection)];
                        case 1:
                          e.sent();
                          return [2];
                      }
                    });
                  });
                });
                return [2];
              });
            });
          },
        );
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setSiteInfo = function (site) {
      this.site = site;
    };
    t.prototype.setExistingSlug = function (value) {
      this.slugInputEl.value = value;
    };
    return t;
  })(_5),
  r8 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.labelManagePasswords();
      n.passwords = null;
      n.updateDisplay();
      return n;
    }
    __extends(t, e);
    t.prototype.setPasswords = function (passwords) {
      this.passwords = passwords;
    };
    t.prototype.updateDisplay = function () {
      var e = this,
        t = this.el;
      if ((t.empty(), this.passwords === null))
        t.createEl("p", {
          cls: "u-muted",
          text: q5.labelNoPassword(),
        });
      else {
        var n = 0;
        t.createEl("p", {
          cls: "u-muted",
          text: q5.labelHavePassword(),
        });
        t.createEl("hr");
        for (
          var i = t.createDiv("passwords-container"),
            r = function (t) {
              i.createDiv("list-item password-item", function (i) {
                i.createDiv({
                  cls: "list-item-part",
                  text: t.name || q5.labelUntitledPassword(),
                });
                i.createDiv({
                  cls: "u-muted u-small list-item-part mod-extended",
                  text: q5.labelPasswordCreatedTime({
                    time: window.moment(t.ts).fromNow(),
                  }),
                });
                i.createDiv("list-item-part clickable-icon", function (t) {
                  setIcon(t, "lucide-x");
                  setTooltip(t, i18nProxy.dialogue.buttonDelete());
                  var i = n;
                  t.addEventListener("click", function () {
                    return __awaiter(e, undefined, undefined, function () {
                      return __generator(this, function (e) {
                        switch (e.label) {
                          case 0:
                            return [4, this.parentModal.plugin.apiDelPassword(i)];
                          case 1:
                            e.sent();
                            return [4, this.parentModal.showPasswords()];
                          case 2:
                            e.sent();
                            return [2];
                        }
                      });
                    });
                  });
                  n += 1;
                });
              });
            },
            o = 0,
            a = this.passwords;
          o < a.length;
          o++
        ) {
          r(a[o]);
        }
      }
      t.createDiv("modal-button-container", function (t) {
        t.createEl(
          "button",
          {
            cls: "mod-cta",
            text: q5.actionNewPassword(),
          },
          function (t) {
            t.addEventListener("click", function () {
              e.parentModal.openAddPassword();
            });
          },
        );
        t.createEl(
          "button",
          {
            text: q5.buttonGoBack(),
          },
          function (t) {
            t.addEventListener("click", function () {
              var t = e.parentModal;
              t.openSection(t.siteOptionsSection);
            });
          },
        );
      });
    };
    return t;
  })(_5),
  o8 = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.title = q5.labelAddPassword();
      n.passwordFieldEl = null;
      n.nicknameFieldEl = null;
      new Setting(n.el)
        .setName(q5.optionPasswordName())
        .setDesc(q5.optionPasswordDesc())
        .addText(function (e) {
          return e.setPlaceholder(q5.optionPasswordPlaceholder()).then(function (e) {
            e.inputEl.setAttribute("type", "password");
            n.passwordFieldEl = e.inputEl;
          });
        });
      new Setting(n.el)
        .setName(q5.optionNicknameName())
        .setDesc(q5.optionNicknameDesc())
        .addText(function (e) {
          return (n.nicknameFieldEl = e.inputEl);
        });
      n.el.createDiv("modal-button-container", function (e) {
        e.createEl(
          "button",
          {
            text: q5.actionAddPassword(),
            cls: "mod-cta",
          },
          function (e) {
            e.addEventListener("click", function () {
              return __awaiter(n, undefined, undefined, function () {
                var e, t, n;
                return __generator(this, function (i) {
                  switch (i.label) {
                    case 0:
                      i.trys.push([0, 2, , 3]);
                      e = this.passwordFieldEl.value;
                      t = this.nicknameFieldEl.value;
                      return [4, this.parentModal.plugin.apiAddPassword(t, e)];
                    case 1:
                      i.sent();
                      return [3, 3];
                    case 2:
                      n = i.sent();
                      this.parentModal.handleError(n);
                      return [2];
                    case 3:
                      new Notice(q5.msgAddedNewPassword());
                      return [4, this.parentModal.showPasswords()];
                    case 4:
                      i.sent();
                      return [2];
                  }
                });
              });
            });
          },
        );
        e.createEl(
          "button",
          {
            text: q5.buttonGoBack(),
          },
          function (e) {
            e.addEventListener("click", function () {
              return __awaiter(n, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.parentModal.showPasswords()];
                    case 1:
                      e.sent();
                      return [2];
                  }
                });
              });
            });
          },
        );
      });
      return n;
    }
    __extends(t, e);
    t.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          this.passwordFieldEl.value = "";
          this.nicknameFieldEl.value = "";
          e.prototype.show.call(this);
          return [2];
        });
      });
    };
    return t;
  })(_5),
  a8 = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.title = q5.labelConfigureCustomDomain();
      return t;
    }
    __extends(t, e);
    t.prototype.show = function () {
      return __awaiter(this, undefined, undefined, function () {
        var t,
          n,
          i,
          r,
          innerHTMLo0,
          a = this;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              (t = this.el).empty();
              return [4, e.prototype.show.call(this)];
            case 1:
              s.sent();
              return [4, this.parentModal.plugin.apiCustomUrl()];
            case 2:
              n = s.sent();
              new Setting(t)
                .setName(q5.optionCustomUrlName())
                .setDesc(q5.optionCustomUrlDesc())
                .addText(function (e) {
                  return (i = e.setPlaceholder(q5.optionCustomUrlPlaceholder()).setValue(n.url || ""));
                });
              new Setting(t)
                .setName(q5.optionCustomUrlRedirect())
                .setDesc(q5.optionCustomUrlRedirectDesc())
                .addToggle(function (e) {
                  return (r = e.setValue(n.redirect));
                });
              innerHTMLo0 = q5.labelCustomDomainInstructions({
                link: '<a href="https://help.obsidian.md/Obsidian+Publish/Set+up+a+custom+domain" target="_blank">'.concat(
                  q5.labelCustomDomainLinkName(),
                  "</a>",
                ),
              });
              this.el.createEl(
                "p",
                {
                  cls: "u-muted",
                },
                function (e) {
                  e.innerHTML = innerHTMLo0;
                },
              );
              this.el.createDiv("modal-button-container", function (e) {
                e.createEl(
                  "button",
                  {
                    text: q5.buttonUpdateCustomDomain(),
                    cls: "mod-cta",
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      return __awaiter(a, undefined, undefined, function () {
                        var e, t, n, o;
                        return __generator(this, function (a) {
                          switch (a.label) {
                            case 0:
                              a.trys.push([0, 2, , 3]);
                              e = i.getValue();
                              t = r.getValue();
                              return [4, this.parentModal.plugin.apiCustomUrl(e, t)];
                            case 1:
                              a.sent();
                              return [3, 3];
                            case 2:
                              n = a.sent();
                              this.parentModal.handleError(n);
                              return [2];
                            case 3:
                              (o = this.parentModal).openSection(o.siteOptionsSection);
                              return [2];
                          }
                        });
                      });
                    });
                  },
                );
                e.createEl(
                  "button",
                  {
                    text: q5.buttonGoBack(),
                  },
                  function (e) {
                    e.addEventListener("click", function () {
                      return __awaiter(a, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          (e = this.parentModal).openSection(e.siteOptionsSection);
                          return [2];
                        });
                      });
                    });
                  },
                );
              });
              return [2];
          }
        });
      });
    };
    return t;
  })(_5),
  s8 = (function (e) {
    function t(t, namen0, siteId) {
      var r = e.call(this, t) || this;
      r.shares = [];
      r.siteId = siteId;
      r.setTitle(
        q5.labelManageSharing({
          name: namen0,
        }),
      );
      r.addButton("", i18nProxy.dialogue.buttonDone(), function () {
        return r.close();
      });
      r.display();
      return r;
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
          a,
          s,
          l = this;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              this.contentEl.empty();
              c.label = 1;
            case 1:
              c.trys.push([1, 3, , 4]);
              return [
                4,
                oJ(this.contentEl, function () {
                  token = c$.token;
                  site_uid = l.siteId;
                  return HQ("/publish/share/list", {
                    token: token,
                    site_uid: site_uid,
                  });
                  var token, site_uid;
                }),
              ];
            case 2:
              e = c.sent();
              this.shares = e.shares;
              return [3, 4];
            case 3:
              t = c.sent();
              new Notice(t.message);
              return [2];
            case 4:
              if (this.shares.length > 0)
                for (
                  this.contentEl.createEl("p", {
                    cls: "u-muted",
                    text: q5.labelSharingWithUsers(),
                  }),
                    n = this.contentEl.createDiv(),
                    i = function (e) {
                      n.createDiv("list-item", function (t) {
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
                                text: q5.labelInvitePending(),
                              });
                            },
                          );
                        t.createDiv("list-item-part", function (t) {
                          setIcon(t, "lucide-x");
                          setTooltip(t, q5.tooltipRemoveUser());
                          t.addEventListener("click", function () {
                            return __awaiter(l, undefined, undefined, function () {
                              var t,
                                n = this;
                              return __generator(this, function (i) {
                                switch (i.label) {
                                  case 0:
                                    i.trys.push([0, 2, , 3]);
                                    return [
                                      4,
                                      oJ(this.contentEl, function () {
                                        return o$(c$.token, n.siteId, e.uid);
                                      }),
                                    ];
                                  case 1:
                                    i.sent();
                                    return [3, 3];
                                  case 2:
                                    t = i.sent();
                                    new Notice(t.message);
                                    return [3, 3];
                                  case 3:
                                    return [4, this.display()];
                                  case 4:
                                    i.sent();
                                    return [2];
                                }
                              });
                            });
                          });
                        });
                      });
                    },
                    r = 0,
                    o = this.shares;
                  r < o.length;
                  r++
                ) {
                  a = o[r];
                  i(a);
                }
              else
                this.contentEl.createEl("p", {
                  cls: "u-muted",
                  text: q5.labelNotSharing(),
                });
              s = null;
              new Setting(this.contentEl)
                .setName(q5.optionInviteUser())
                .addText(function (e) {
                  return e.setPlaceholder(q5.placeholderInviteUser()).then(function (e) {
                    s = e;
                    e.inputEl.addEventListener("keydown", function (t) {
                      if (!t.isComposing) {
                        t.key === "Enter" && l.inviteToSite(e.getValue());
                      }
                    });
                  });
                })
                .addButton(function (e) {
                  return e
                    .setButtonText(i18nProxy.interface.buttonAdd())
                    .setCta()
                    .onClick(function () {
                      l.inviteToSite(s.getValue());
                    });
                });
              return [2];
          }
        });
      });
    };
    t.prototype.inviteToSite = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return (e = e.trim()) !== "" && e.includes("@")
                ? [4, r$(c$.token, this.siteId, e)]
                : (new Notice(q5.errorEmailMustBeValid()), [2]);
            case 1:
              t.sent();
              this.display();
              return [2];
          }
        });
      });
    };
    return t;
  })(GM),
  l8 = (function (e) {
    function t(t, publish, path) {
      var r = e.call(this, t) || this;
      r.path = path;
      r.publish = publish;
      return r;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s, l, c, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              t = (e = this).app;
              n = e.path;
              i = e.publish;
              r = t.vault.getAbstractFileByPath(n);
              return [4, this.publish.apiDownloadFile(n)];
            case 1:
              o = p.sent();
              a = getExtension(getFilename(n));
              s = new GM(t);
              this.setTitle(q5.labelCompareWithLive());
              this.contentEl.style.overflow = "auto";
              return MARKDOWN_EXTENSIONS.contains(a)
                ? ((l = ff(o)), (c = ""), r && r instanceof TFile ? [4, t.vault.cachedRead(r)] : [3, 3])
                : [3, 4];
            case 2:
              c = p.sent();
              p.label = 3;
            case 3:
              this.contentEl.appendChild(Zj(l, c));
              return [3, 8];
            case 4:
              return IMAGE_EXTENSIONS.contains(a)
                ? r && r instanceof TFile
                  ? [4, preloadImage(this.contentEl, t.vault.getResourcePath(r))]
                  : [3, 6]
                : [3, 8];
            case 5:
              p.sent();
              p.label = 6;
            case 6:
              u = new Blob([new Uint8Array(o)], {
                type: "image/" + a,
              });
              h = URL.createObjectURL(u);
              return [4, preloadImage(this.contentEl, h)];
            case 7:
              p.sent();
              URL.revokeObjectURL(h);
              p.label = 8;
            case 8:
              r instanceof TFile &&
                this.addButton("", q5.buttonUseLiveVersion(), function () {
                  new c8(t, r, i.modal, o).open();
                });
              this.addButton("mod-cta", q5.buttonDone(), function () {
                return s.close();
              });
              return [2];
          }
        });
      });
    };
    return t;
  })(GM),
  c8 = (function (e) {
    function t(t, n, i, r) {
      var o = e.call(this, t) || this;
      o.setTitle(q5.labelConfirmOverride());
      o.contentEl.createEl("p", {
        text: q5.labelConfirmOverride_1(),
      });
      o.contentEl.createEl("p", {
        text: q5.labelConfirmOverride_2(),
      });
      o.addButton("mod-warning", q5.buttonProceed(), function () {
        return __awaiter(o, undefined, undefined, function () {
          return __generator(this, function (e) {
            switch (e.label) {
              case 0:
                return n && n instanceof TFile ? [4, t.vault.modifyBinary(n, r)] : [3, 3];
              case 1:
                e.sent();
                new Notice(q5.messageSuccessfullyUsedLiveVersion());
                return [4, i.reviewChangesSection.show()];
              case 2:
                e.sent();
                this.close();
                e.label = 3;
              case 3:
                return [2];
            }
          });
        });
      });
      o.addButton("", i18nProxy.dialogue.buttonCancel(), function () {
        return o.close();
      });
      return o;
    }
    __extends(t, e);
    return t;
  })(GM),
  u8 = (function (e) {
    function t(t, publish, section) {
      var r =
        e.call(
          this,
          t,
          q5.labelAddIncludedFolder(),
          q5.labelAddIncludedFolderDesc(),
          "plugins.publish.label-number-of-folders-included",
        ) || this;
      r.publish = null;
      r.section = null;
      r.publish = publish;
      r.section = section;
      r.titleEl.setText(q5.labelManageIncludedFolders());
      return r;
    }
    __extends(t, e);
    t.prototype.onClose = function () {
      this.section.show();
    };
    t.prototype.getPaths = function () {
      return this.publish.includes;
    };
    t.prototype.setPaths = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.publish.setIncludes(e)];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(z5),
  h8 = (function (e) {
    function t(t, publish, section) {
      var r =
        e.call(
          this,
          t,
          i18nProxy.plugins.sync.labelAddExcludedFolder(),
          i18nProxy.plugins.sync.labelAddExcludedFolderDesc(),
          "plugins.publish.label-number-of-folders-excluded",
        ) || this;
      r.publish = null;
      r.section = null;
      r.publish = publish;
      r.section = section;
      r.titleEl.setText(i18nProxy.plugins.sync.labelManageExcludedFolders());
      return r;
    }
    __extends(t, e);
    t.prototype.onClose = function () {
      this.section.show();
    };
    t.prototype.getPaths = function () {
      return this.publish.excludes;
    };
    t.prototype.setPaths = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.publish.setExcludes(e)];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(z5),
  p8 = i18nProxy.plugins.publish,
  d8 = "https://publish.obsidian.md";
if (isDev) {
  d8 = "http://127.0.0.1:3001";
}
var f8 = (function (e) {
    function t(code, i) {
      var r = e.call(this, i) || this;
      r.name = "RequestError";
      r.code = code;
      Object.setPrototypeOf(r, t.prototype);
      return r;
    }
    __extends(t, e);
    return t;
  })(Error),
  m8 = ["obsidian.css", "publish.css", "favicon.ico", "publish.js"],
  g8 = (function () {
    function e() {
      this.id = "publish";
      this.name = p8.name();
      this.description = p8.desc();
      this.app = null;
      this.vault = null;
      this.plugin = null;
      this.siteId = null;
      this.host = null;
      this.isGuest = null;
      this.includes = [];
      this.excludes = [];
      this.modal = null;
      this.requestSaveData = debounce(this.saveData.bind(this), 2e3);
    }
    e.prototype.init = function (app, plugin) {
      var n = this;
      this.app = app;
      this.vault = app.vault;
      this.plugin = plugin;
      plugin.registerRibbonItem(p8.actionPublishChanges(), "lucide-send", this.openPublishChanges.bind(this));
      plugin.registerGlobalCommand({
        id: "publish:view-changes",
        name: p8.actionPublishChanges(),
        icon: "lucide-send",
        callback: this.openPublishChanges.bind(this),
      });
      plugin.registerGlobalCommand({
        id: "publish:publish-file",
        name: p8.actionPublishFile(),
        icon: "lucide-send",
        checkCallback: function (t) {
          if (!n.siteId) return !1;
          var i = app.workspace.getActiveFile();
          return !(!i || !n.isFileSupported(i) || !1 === n.getPublishFlag(i)) && (t || n.uploadFile(i), !0);
        },
      });
      plugin.registerGlobalCommand({
        id: "publish:open-in-live-site",
        name: p8.labelOpenInLiveSite(),
        icon: "lucide-globe",
        checkCallback: function (t) {
          if (!n.siteId) return !1;
          var i = app.workspace.getActiveFile();
          return (
            !(!i || !n.isFileSupported(i) || !1 === n.getPublishFlag(i)) &&
            (t ||
              n.getCurrentSlug().then(function (e) {
                window.open(d8 + "/" + e + "/" + y_(ou(i.path)));
              }),
            !0)
          );
        },
      });
    };
    e.prototype.onEnable = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n = this;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              return [4, this.loadData()];
            case 1:
              i.sent();
              t.registerEvent(
                e.workspace.on(
                  "file-menu",
                  function (e, t, i) {
                    if (
                      t instanceof TFile &&
                      (i === "tab-header" || i === "more-options" || i === "file-explorer-context-menu") &&
                      n.isFileSupported(t) &&
                      !1 !== n.getPublishFlag(t)
                    ) {
                      e.addItem(function (e) {
                        return e
                          .setSection("action")
                          .setTitle(p8.actionPublishFile())
                          .setIcon("lucide-send")
                          .onClick(function () {
                            n.uploadFile(t);
                          });
                      });
                    }
                  },
                  this,
                ),
              );
              return [2];
          }
        });
      });
    };
    e.prototype.onDisable = function (e, t) {
      this.modal = null;
    };
    e.prototype.loadData = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.plugin.loadData()];
            case 1:
              if (!(e = t.sent())) return [2];
              try {
                this.siteId = e.siteId;
                this.host = e.host;
                this.includes = e.included || [];
                this.excludes = e.excluded || [];
              } catch (e) {
                console.error(e);
              }
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
                  siteId: this.siteId,
                  host: this.host,
                  included: this.includes,
                  excluded: this.excludes,
                }),
              ];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.setup = function (siteId, host) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              this.siteId = siteId;
              this.host = host;
              return [4, this.saveData()];
            case 1:
              n.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.setIncludes = function (includes) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.includes = includes;
              return [4, this.saveData()];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.setExcludes = function (excludes) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              this.excludes = excludes;
              return [4, this.saveData()];
            case 1:
              t.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.getHost = function () {
      var e = this.host || "127.0.0.1:3002";
      return e.startsWith("127.0.0.1") || e.startsWith("localhost") ? "http://" + e : "https://" + e;
    };
    e.prototype.isFileSupported = function (e) {
      t = e.extension;
      return ALL_SUPPORTED_EXTENSIONS.contains(t) || m8.contains(e.name);
      var t;
    };
    e.prototype.scanForChanges = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, r, o, a, path, l, c, u, h, p, d, f, m;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              e = this.vault;
              t = [];
              return [4, this.apiList()];
            case 1:
              n = g.sent();
              this.isGuest = !n.owner;
              i = {};
              r = 0;
              o = n.files;
              g.label = 2;
            case 2:
              return r < o.length
                ? ((a = o[r]),
                  (path = a.path),
                  (i[path] = a),
                  (l = e.getAbstractFileByPath(path)) && l instanceof TFile
                    ? !1 === (m = this.getPublishFlag(l))
                      ? [3, 4]
                      : [4, this.getHash(l)]
                    : [3, 4])
                : [3, 6];
            case 3:
              g.sent() !== a.hash
                ? t.push({
                    path: path,
                    ctime: a.ctime,
                    mtime: a.mtime,
                    size: a.size,
                    type: "changed",
                    checked: !0 === m,
                  })
                : t.push({
                    path: path,
                    ctime: a.ctime,
                    mtime: a.mtime,
                    size: a.size,
                    type: "to-delete",
                    checked: false,
                  });
              return [3, 5];
            case 4:
              t.push({
                path: path,
                ctime: a.ctime,
                mtime: a.mtime,
                size: a.size,
                type: "deleted",
                checked: false,
              });
              g.label = 5;
            case 5:
              r++;
              return [3, 2];
            case 6:
              for (c = e.getRoot(), u = [c]; u.length; )
                if ((h = u.pop()) instanceof TFolder)
                  for (p = 0, d = h.children; p < d.length; p++) {
                    f = d[p];
                    u.push(f);
                  }
                else if (h instanceof TFile && this.isFileSupported(h) && !i.hasOwnProperty(h.path)) {
                  if (!1 === (m = this.getPublishFlag(h))) continue;
                  t.push({
                    path: h.path,
                    ctime: 0,
                    mtime: 0,
                    size: 0,
                    type: "new",
                    checked: !0 === m,
                  });
                }
              return [2, t];
          }
        });
      });
    };
    e.prototype.apiRequest = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              r.trys.push([0, 2, , 3]);
              return [4, ajaxPromise(e)];
            case 1:
              t = r.sent();
              return [3, 3];
            case 2:
              if ((n = r.sent()) instanceof XMLHttpRequest) throw new f8("NET", "Network unavailable.");
              if (n instanceof Error) throw new f8("NET", n.message);
              throw new f8("NET", "Unknown");
            case 3:
              if ((i = JSON.parse(t)).code && i.message) throw new f8(i.code, i.message);
              return [2, i];
          }
        });
      });
    };
    e.prototype.apiPostFrontend = function (e, data) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          data.token = c$.token;
          return [
            2,
            this.apiRequest({
              method: "POST",
              url: d8 + "/" + e,
              data: data,
            }),
          ];
        });
      });
    };
    e.prototype.apiPostBackend = function (e, data) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          data.id = this.siteId;
          data.token = c$.token;
          return [
            2,
            this.apiRequest({
              method: "POST",
              url: this.getHost() + "/" + e,
              data: data,
            }),
          ];
        });
      });
    };
    e.prototype.apiSetSlug = function (e, host, slug) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (i) {
          return [
            2,
            this.apiPostFrontend("api/slug", {
              id: e,
              host: host,
              slug: slug,
            }),
          ];
        });
      });
    };
    e.prototype.apiGetSlugs = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [
            2,
            this.apiPostFrontend("api/slugs", {
              ids: e,
            }),
          ];
        });
      });
    };
    e.prototype.apiCheckSlug = function (slug) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [
            2,
            this.apiPostFrontend("api/site", {
              slug: slug,
            }),
          ];
        });
      });
    };
    e.prototype.apiCustomUrl = function (e, redirect) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          return [
            2,
            this.apiPostFrontend("api/customurl", {
              id: this.siteId,
              host: this.host,
              url: e,
              redirect: redirect,
            }),
          ];
        });
      });
    };
    e.prototype.apiList = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [
            2,
            this.apiPostBackend("api/list", {
              version: 2,
            }),
          ];
        });
      });
    };
    e.prototype.apiOptions = function (options) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [
            2,
            this.apiPostBackend("api/options", {
              options: options,
            }),
          ];
        });
      });
    };
    e.prototype.apiGetPassword = function () {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (e) {
          return [2, this.apiPostBackend("api/password", {})];
        });
      });
    };
    e.prototype.apiAddPassword = function (namee0, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          return [
            2,
            this.apiPostBackend("api/password", {
              name: namee0,
              pw: t,
            }),
          ];
        });
      });
    };
    e.prototype.apiDelPassword = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [
            2,
            this.apiPostBackend("api/password", {
              del: e,
            }),
          ];
        });
      });
    };
    e.prototype.apiRemoveFile = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (t) {
          return [
            2,
            this.apiPostBackend("api/remove", {
              path: path,
            }),
          ];
        });
      });
    };
    e.prototype.apiUploadFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var obsHash, data, headers;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              if (e.stat.size > 52428800) throw new f8("TOOLARGE", "Failed to upload file over limit of 50mb.");
              return [4, this.getHash(e)];
            case 1:
              obsHash = r.sent();
              return [4, this.vault.readBinary(e)];
            case 2:
              data = r.sent();
              headers = {
                "obs-token": c$.token,
                "obs-id": this.siteId,
                "obs-path": encodeURIComponent(e.path),
                "obs-hash": obsHash,
              };
              return [
                2,
                this.apiRequest({
                  method: "POST",
                  url: this.getHost() + "/api/upload",
                  headers: headers,
                  data: data,
                }),
              ];
          }
        });
      });
    };
    e.prototype.apiDownloadFile = function (path) {
      return __awaiter(this, undefined, Promise, function () {
        var t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              t = {
                id: this.siteId,
                token: c$.token,
                path: path,
              };
              return [
                4,
                fetch(this.getHost() + "/api/download", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(t),
                }),
              ];