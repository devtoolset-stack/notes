var Setting = (function () {
    function e(e) {
      this.components = [];
      var t = (this.settingEl = e.createDiv("setting-item")),
        n = (this.infoEl = t.createDiv("setting-item-info"));
      this.nameEl = n.createDiv("setting-item-name");
      this.descEl = n.createDiv("setting-item-description");
      this.controlEl = t.createDiv("setting-item-control");
    }
    e.prototype.setName = function (e) {
      this.nameEl.setText(e);
      return this;
    };
    e.prototype.setDesc = function (e) {
      this.descEl.setText(e);
      return this;
    };
    e.prototype.setClass = function (e) {
      this.settingEl.addClass(e);
      return this;
    };
    e.prototype.setTooltip = function (e, t) {
      setTooltip(this.nameEl, e, t);
      return this;
    };
    e.prototype.setHeading = function () {
      this.settingEl.addClass("setting-item-heading");
      return this;
    };
    e.prototype.setDisabled = function (e) {
      this.settingEl.toggleClass("is-disabled", e);
      for (var t = 0, n = this.components; t < n.length; t++) {
        n[t].setDisabled(e);
      }
      return this;
    };
    e.prototype.setNoInfo = function () {
      this.infoEl.hide();
      return this;
    };
    e.prototype.addButton = function (e) {
      var t = new ButtonComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addExtraButton = function (e) {
      var t = new ExtraButtonComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addToggle = function (e) {
      var t = new ToggleComponent(this.controlEl);
      this.components.push(t);
      e(t);
      this.settingEl.addClass("mod-toggle");
      return this;
    };
    e.prototype.addText = function (e) {
      var t = new TextComponent(this.controlEl);
      if (!Platform.hasPhysicalKeyboard) {
        var n = t.inputEl;
        n.addEventListener("keydown", function (e) {
          if (!(e.isComposing || e.defaultPrevented || e.key !== "Enter")) {
            n.blur();
          }
        });
      }
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addSearch = function (e) {
      var t = new SearchComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addTextArea = function (e) {
      var t = new TextAreaComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addMomentFormat = function (e) {
      var t = new MomentFormatComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addDropdown = function (e) {
      var t = new DropdownComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addColorPicker = function (e) {
      var t = new ColorComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addProgressBar = function (e) {
      var t = new ProgressBarComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.addSlider = function (e) {
      var t = new SliderComponent(this.controlEl);
      this.components.push(t);
      e(t);
      return this;
    };
    e.prototype.then = function (e) {
      e(this);
      return this;
    };
    e.prototype.clear = function () {
      this.controlEl.empty();
      this.components = [];
      return this;
    };
    e.prototype.setVisibility = function (e) {
      this.settingEl.toggle(e);
      return this;
    };
    return e;
  })(),
  BaseComponent = (function () {
    function e() {
      this.disabled = false;
    }
    e.prototype.then = function (e) {
      e(this);
      return this;
    };
    e.prototype.setDisabled = function (disabled) {
      this.disabled = disabled;
      return this;
    };
    return e;
  })(),
  ValueComponent = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.registerOptionListener = function (e, t) {
      var n = this;
      e[t] = function (e) {
        undefined !== e && n.setValue(e);
        return n.getValue();
      };
      return this;
    };
    return t;
  })(BaseComponent),
  ButtonComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this,
        i = (n.buttonEl = t.createEl("button"));
      i.addEventListener("click", function (e) {
        return __awaiter(n, undefined, undefined, function () {
          var t;
          return __generator(this, function (n) {
            switch (n.label) {
              case 0:
                if (((t = this.clickCallback), this.disabled || !t)) return [3, 4];
                i.addClass("mod-loading");
                n.label = 1;
              case 1:
                n.trys.push([1, , 3, 4]);
                return [4, t(e)];
              case 2:
                n.sent();
                return [3, 4];
              case 3:
                i.removeClass("mod-loading");
                return [7];
              case 4:
                return [2];
            }
          });
        });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (disabled) {
      e.prototype.setDisabled.call(this, disabled);
      this.buttonEl.disabled = disabled;
      return this;
    };
    t.prototype.setLoading = function (e) {
      this.buttonEl.toggleClass("mod-loading", e);
      return this;
    };
    t.prototype.setCta = function () {
      this.buttonEl.addClass("mod-cta");
      return this;
    };
    t.prototype.removeCta = function () {
      this.buttonEl.removeClass("mod-cta");
      return this;
    };
    t.prototype.setWarning = function () {
      this.buttonEl.addClass("mod-warning");
      return this;
    };
    t.prototype.setTooltip = function (e, t) {
      setTooltip(this.buttonEl, e, t);
      return this;
    };
    t.prototype.setButtonText = function (e) {
      this.buttonEl.setText(e);
      return this;
    };
    t.prototype.setIcon = function (e) {
      setIcon(this.buttonEl, e);
      return this;
    };
    t.prototype.setClass = function (e) {
      this.buttonEl.addClass(e);
      return this;
    };
    t.prototype.onClick = function (clickCallback) {
      this.clickCallback = clickCallback;
      return this;
    };
    return t;
  })(BaseComponent),
  ExtraButtonComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this,
        i = (n.extraSettingsEl = t.createDiv("clickable-icon extra-setting-button"));
      setIcon(i, "lucide-settings");
      i.addEventListener("click", function () {
        var e = n.changeCallback;
        if (!n.disabled && e) {
          e();
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (t) {
      e.prototype.setDisabled.call(this, t);
      this.extraSettingsEl.toggleClass("is-disabled", t);
      return this;
    };
    t.prototype.setTooltip = function (e, t) {
      setTooltip(this.extraSettingsEl, e, t);
      return this;
    };
    t.prototype.setIcon = function (e) {
      setIcon(this.extraSettingsEl, e);
      return this;
    };
    t.prototype.onClick = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(BaseComponent),
  ToggleComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.on = false;
      (n.toggleEl = t.createDiv("checkbox-container", function (e) {
        e.createEl("input", {
          attr: {
            type: "checkbox",
            tabIndex: 0,
          },
        });
      })).addEventListener("click", n.onClick.bind(n));
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (t) {
      e.prototype.setDisabled.call(this, t);
      this.toggleEl.toggleClass("is-disabled", t);
      return this;
    };
    t.prototype.getValue = function () {
      return this.on;
    };
    t.prototype.setValue = function (e) {
      var t;
      this.on !== e &&
        ((this.on = e),
        this.toggleEl.toggleClass("is-enabled", e),
        (t = this.changeCallback) === null || undefined === t || t.call(this, e));
      return this;
    };
    t.prototype.setSmall = function () {
      this.toggleEl.addClass("mod-small");
      return this;
    };
    t.prototype.setTooltip = function (e, t) {
      setTooltip(this.toggleEl, e, t);
      return this;
    };
    t.prototype.onClick = function () {
      if (!this.disabled) {
        this.setValue(!this.getValue());
      }
    };
    t.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(ValueComponent),
  AbstractTextComponent = (function (e) {
    function t(inputEl) {
      var n = e.call(this) || this;
      n.inputEl = inputEl;
      inputEl.addEventListener("input", n.onChanged.bind(n));
      inputEl.setAttribute("spellcheck", "false");
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (disabled) {
      e.prototype.setDisabled.call(this, disabled);
      this.inputEl.disabled = disabled;
      return this;
    };
    t.prototype.getValue = function () {
      return this.inputEl.value;
    };
    t.prototype.setValue = function (value) {
      String.isString(value) && (this.inputEl.value = value);
      return this;
    };
    t.prototype.setPlaceholder = function (e) {
      this.inputEl.setAttribute("placeholder", e);
      return this;
    };
    t.prototype.onChanged = function () {
      var e = this.changeCallback;
      if (e) {
        e(this.inputEl.value);
      }
    };
    t.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(ValueComponent),
  TextComponent = (function (e) {
    function t(t) {
      var n = t.createEl("input", {
        type: "text",
      });
      return e.call(this, n) || this;
    }
    __extends(t, e);
    t.prototype.autoSelect = function () {
      focusAndSelectOnPhysicalKeyboard(this.inputEl);
      return this;
    };
    return t;
  })(AbstractTextComponent),
  SearchComponent = (function (e) {
    function t(t) {
      var n = this,
        containerEl = t.createDiv("search-input-container"),
        r = containerEl.createEl("input", {
          type: "search",
          attr: {
            enterkeyhint: "search",
          },
        });
      (n = e.call(this, r) || this).containerEl = containerEl;
      n.clearButtonEl = containerEl.createDiv("search-input-clear-button", function (e) {
        e.addEventListener("mousedown", function (e) {
          return e.preventDefault();
        });
        e.addEventListener("click", function () {
          if (!n.disabled) {
            r.value = "";
            n.onChanged();
            r.focus();
          }
        });
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onChanged = function () {
      e.prototype.onChanged.call(this);
    };
    t.prototype.setValue = function (t) {
      return e.prototype.setValue.call(this, t);
    };
    t.prototype.setClass = function (e) {
      this.containerEl.addClass(e);
      return this;
    };
    t.prototype.autoSelect = function () {
      focusAndSelectOnPhysicalKeyboard(this.inputEl);
      return this;
    };
    t.prototype.addRightDecorator = function (e) {
      e(this.containerEl.createDiv("input-right-decorator"));
      return this;
    };
    return t;
  })(AbstractTextComponent),
  TextAreaComponent = (function (e) {
    function t(t) {
      return e.call(this, t.createEl("textarea")) || this;
    }
    __extends(t, e);
    return t;
  })(AbstractTextComponent),
  _T = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.inputEl.setAttribute("type", "number");
      return n;
    }
    __extends(t, e);
    t.prototype.getValueAsNumber = function () {
      return this.inputEl.valueAsNumber;
    };
    t.prototype.setValueAsNumber = function (valueAsNumber) {
      this.inputEl.valueAsNumber = valueAsNumber;
      return this;
    };
    t.prototype.setLimits = function (e, t, step) {
      this.inputEl.setAttrs({
        min: e,
        max: t,
        step: step,
      });
      return this;
    };
    return t;
  })(TextComponent),
  MomentFormatComponent = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.setDefaultFormat = function (defaultFormat) {
      this.defaultFormat = defaultFormat;
      this.setPlaceholder(defaultFormat);
      this.updateSample();
      return this;
    };
    t.prototype.setSampleEl = function (sampleEl) {
      this.sampleEl = sampleEl;
      this.updateSample();
      return this;
    };
    t.prototype.setValue = function (t) {
      e.prototype.setValue.call(this, t);
      this.updateSample();
      return this;
    };
    t.prototype.onChanged = function () {
      e.prototype.onChanged.call(this);
      this.updateSample();
    };
    t.prototype.updateSample = function () {
      var e = this.sampleEl;
      if (e) {
        var t = this.inputEl.value || this.defaultFormat;
        if (t) {
          var n = window.moment().format(t);
          e.setText(n);
        } else e.setText("");
      }
    };
    return t;
  })(TextComponent),
  DropdownComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.selectEl = t.createEl("select", "dropdown");
      n.selectEl.addEventListener("change", function () {
        var e = n.changeCallback;
        if (e) {
          e(n.getValue());
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (disabled) {
      e.prototype.setDisabled.call(this, disabled);
      this.selectEl.disabled = disabled;
      return this;
    };
    t.prototype.addOption = function (value, textt0) {
      this.selectEl.createEl("option", {
        value: value,
        text: textt0,
      });
      return this;
    };
    t.prototype.addOptions = function (e) {
      for (var value in e)
        if (e.hasOwnProperty(value)) {
          this.selectEl.createEl("option", {
            value: value,
            text: e[value],
          });
        }
      return this;
    };
    t.prototype.getValue = function () {
      return this.selectEl.value;
    };
    t.prototype.setValue = function (value) {
      this.selectEl.value = value;
      return this;
    };
    t.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(ValueComponent),
  ProgressBarComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.progressBar = t.createDiv("setting-progress-bar", function (e) {
        n.lineEl = e.createDiv("setting-progress-bar-inner");
      });
      return n;
    }
    __extends(t, e);
    t.prototype.getValue = function () {
      return this.value;
    };
    t.prototype.setValue = function (value) {
      value = Math.clamp(value, 0, 100);
      this.value = value;
      this.lineEl.style.width = "".concat(value, "%");
      return this;
    };
    t.prototype.setVisibility = function (e) {
      this.progressBar.hidden = !e;
      return this;
    };
    return t;
  })(ValueComponent),
  SliderComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.dynamicTooltip = false;
      n.instant = false;
      var i = (n.sliderEl = t.createEl("input", {
        type: "range",
        cls: "slider",
      }));
      i.dataset.ignoreSwipe = "true";
      i.addEventListener("input", function () {
        if ((n.dynamicTooltip && n.showTooltip(), n.instant)) {
          var e = n.changeCallback;
          if (e) {
            e(n.getValue());
          }
        }
      });
      i.addEventListener("change", function () {
        if (!n.instant) {
          var e = n.changeCallback;
          if (e) {
            e(n.getValue());
          }
        }
      });
      i.addEventListener("touchend", function (e) {
        hideTooltip();
      });
      i.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (disabled) {
      e.prototype.setDisabled.call(this, disabled);
      this.sliderEl.disabled = disabled;
      return this;
    };
    t.prototype.setInstant = function (instant) {
      this.instant = instant;
      return this;
    };
    t.prototype.setLimits = function (e, t, step) {
      this.sliderEl.setAttrs({
        min: e,
        max: t,
        step: step,
      });
      return this;
    };
    t.prototype.getValue = function () {
      return this.sliderEl.valueAsNumber;
    };
    t.prototype.setValue = function (valueAsNumber) {
      if (this.sliderEl.valueAsNumber !== valueAsNumber) {
        this.sliderEl.valueAsNumber = valueAsNumber;
        var t = this.changeCallback;
        if (t) {
          t(valueAsNumber);
        }
      }
      return this;
    };
    t.prototype.getValuePretty = function () {
      var e = this.sliderEl,
        t = this.getValue();
      return e.step === "any" || parseFloat(e.step) < 1 ? t.toFixed(2) : t.toString();
    };
    t.prototype.setDynamicTooltip = function () {
      var e = this.sliderEl;
      e.addEventListener("mouseenter", this.showTooltip.bind(this));
      e.addEventListener("mouseleave", hideTooltip);
      this.dynamicTooltip = true;
      return this;
    };
    t.prototype.showTooltip = function () {
      displayTooltip(this.sliderEl, this.getValuePretty(), {
        placement: "top",
      });
    };
    t.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(ValueComponent),
  ColorComponent = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.colorPickerEl = t.createEl("input", {
        type: "color",
      });
      n.colorPickerEl.addEventListener("change", function () {
        var e = n.changeCallback;
        if (e) {
          e(n.getValue());
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setDisabled = function (disabled) {
      e.prototype.setDisabled.call(this, disabled);
      this.colorPickerEl.disabled = disabled;
      return this;
    };
    t.prototype.getValue = function () {
      return this.colorPickerEl.value;
    };
    t.prototype.getValueRgb = function () {
      return (
        AT(this.getValue()) || {
          r: 0,
          g: 0,
          b: 0,
        }
      );
    };
    t.prototype.getValueHsl = function () {
      return xT(this.getValueRgb());
    };
    t.prototype.getValueInt = function () {
      return parseInt(this.getValue().slice(1), 16);
    };
    t.prototype.setValue = function (value) {
      if (this.colorPickerEl.value !== value) {
        this.colorPickerEl.value = value;
        var t = this.changeCallback;
        if (t) {
          t(this.getValue());
        }
      }
      return this;
    };
    t.prototype.setValueRgb = function (e) {
      return this.setValue(DT(e));
    };
    t.prototype.setValueHsl = function (e) {
      return this.setValueRgb(MT(e));
    };
    t.prototype.setValueInt = function (e) {
      return this.setValue("#" + e.toString(16).padStart(6, "0"));
    };
    t.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    return t;
  })(ValueComponent),
  XT = (function (e) {
    function t(app, n) {
      var i = e.call(this, app) || this;
      i.clearable = false;
      i._items = [];
      i.value = null;
      i.app = app;
      i.suggestEl.addClass("combobox");
      var r = (i.bgEl = createDiv("suggestion-bg"));
      r.style.opacity = "0";
      var o = (i.buttonEl = n.createDiv({
        cls: "combobox-button",
        attr: {
          tabindex: 0,
        },
      }));
      (i.iconEl = o.createDiv("combobox-button-icon")).hide();
      i.labelEl = o.createDiv("combobox-button-label");
      o.createDiv("combobox-clear-button", function (e) {
        setIcon(e, "lucide-x");
        e.addEventListener("mousedown", function (e) {
          return e.preventDefault();
        });
        e.addEventListener("click", function (e) {
          e.preventDefault();
          i.buttonEl.blur();
          i.selectSuggestion(null, e);
        });
      });
      o.createDiv("combobox-button-chevron", function (e) {
        return setIcon(e, "lucide-chevrons-up-down");
      });
      o.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          (e.key.startsWith("Arrow") || e.key.length === 1) && i.open();
        }
      });
      o.addEventListener("click", function (e) {
        if (!e.defaultPrevented) {
          e.preventDefault();
          i.toggle();
        }
      });
      i.searchComponent = new SearchComponent(i.suggestEl)
        .setPlaceholder(i18nProxy.plugins.search.promptStartSearch())
        .onChange(function (e) {
          i.onInputChange(e);
        });
      i.suggestEl.prepend(i.searchComponent.containerEl);
      i.suggestEl.on("mousedown", ".suggestion", function (e) {
        return e.preventDefault();
      });
      var a = i.searchComponent.inputEl;
      a.addEventListener("focus", function () {
        return i.suggestEl.addClass("has-input-focus");
      });
      a.addEventListener("blur", function () {
        return i.suggestEl.removeClass("has-input-focus");
      });
      a.addEventListener("keydown", function (e) {
        if (!(e.isComposing || e.key !== "Tab")) {
          focusOrBlurOnPhysicalKeyboard(i.buttonEl, {
            preventScroll: !0,
          });
        }
      });
      i.suggestEl.addEventListener("focusout", function (e) {
        a.win.setTimeout(function () {
          if (!o.isActiveElement()) {
            i.close();
          }
        }, 0);
      });
      Platform.isPhone &&
        (i.suggestEl.createDiv({
          cls: "menu-grabber",
          prepend: !0,
        }),
        i.suggestEl.addClass("menu"),
        i.suggestInnerEl.addClass("menu-scroll"),
        r.addEventListener("mousedown", function (e) {
          return e.preventDefault();
        }),
        r.onClickEvent(function () {
          return i.close();
        }),
        _M(i.suggestEl, i.suggestInnerEl, r, function () {
          i.suggestEl.detach();
          i.close();
        }));
      return i;
    }
    __extends(t, e);
    t.prototype.setPlaceholder = function (e) {
      this.labelEl.setAttribute("placeholder", e);
      return this;
    };
    t.prototype.setItems = function (_items) {
      this._items = _items;
      return this;
    };
    t.prototype.getItems = function () {
      return this._items;
    };
    t.prototype.setClearable = function (clearable) {
      this.clearable = clearable;
      this.value != null && this.renderLabel();
      return this;
    };
    t.prototype.renderLabel = function () {
      var e,
        t = this.value,
        n = "";
      t && (n = (e = t.display) !== null && undefined !== e ? e : t.value);
      this.labelEl.setText(n);
      (t == null ? undefined : t.icon) ? setIcon(this.iconEl, t.icon) : this.iconEl.empty();
      this.buttonEl.toggleClass("mod-clearable", this.clearable && t != null);
      this.iconEl.toggle(Boolean(t && t.icon));
    };
    t.prototype.setValue = function (value) {
      this.value = value;
      this.renderLabel();
      return this;
    };
    t.prototype.setValueById = function (e) {
      var t = this.getItems().find(function (t) {
        return t.value === e;
      });
      t && this.setValue(t);
      return this;
    };
    t.prototype.toggle = function () {
      this.isOpen
        ? (focusOrBlurOnPhysicalKeyboard(this.buttonEl, {
            preventScroll: !0,
          }),
          this.close())
        : this.open();
    };
    t.prototype.close = function () {
      var t;
      if (this.isOpen) {
        e.prototype.close.call(this);
        this.isOpen = false;
        this.buttonEl.removeClass("has-focus");
        this.searchComponent.inputEl.value = "";
        (t = this._onClose) === null || undefined === t || t.call(this);
      }
    };
    t.prototype.attachDom = function () {
      var t = this.bgEl,
        n = this.suggestEl;
      activeDocument.body.appendChild(n);
      Platform.isPhone ? (activeDocument.body.appendChild(t), Tl(n, t)) : e.prototype.attachDom.call(this);
      n.style.left = "";
      n.style.top = "";
    };
    t.prototype.detachDom = function () {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              n = (t = this).bgEl;
              i = t.suggestEl;
              return Platform.isPhone ? (n.isShown() ? [4, Dl(i, n)] : [3, 2]) : [3, 3];
            case 1:
              r.sent();
              r.label = 2;
            case 2:
              i.detach();
              n.detach();
              return [3, 4];
            case 3:
              e.prototype.detachDom.call(this);
              r.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype.open = function () {
      var t;
      if (!this.isOpen) {
        if ((e.prototype.open.call(this), this.buttonEl.addClass("has-focus"), Platform.isPhone))
          this.suggestions.setSuggestions(this.getSuggestions(""));
        else {
          var n = this.buttonEl.getBoundingClientRect();
          this.suggestions.setSuggestions(this.getSuggestions(""));
          this.reposition(n);
          this.searchComponent.autoSelect();
        }
        this.setAutoDestroy(this.buttonEl);
        (t = this._onOpen) === null || undefined === t || t.call(this);
      }
    };
    t.prototype.onOpen = function (_onOpen) {
      this._onOpen = _onOpen;
      return this;
    };
    t.prototype.onClose = function (_onClose) {
      this._onClose = _onClose;
      return this;
    };
    t.prototype.onEscapeKey = function (e) {
      focusOrBlurOnPhysicalKeyboard(this.buttonEl, {
        preventScroll: !0,
      });
      this.close();
    };
    t.prototype.selectSuggestion = function (e, t) {
      var n;
      this.setValue(e);
      focusOrBlurOnPhysicalKeyboard(this.buttonEl, {
        preventScroll: !0,
      });
      (n = this.selectCb) === null || undefined === n || n.call(this, e);
      this.close();
    };
    t.prototype.renderSuggestion = function (e, t) {
      var n;
      if ((t.addClasses(["mod-complex", "mod-toggle"]), this.value && this.value.value === e.value)) {
        setIcon(t.createDiv("suggestion-icon mod-checked"), "lucide-check");
      }
      if (e.icon) {
        setIcon(t.createDiv("suggestion-icon").createDiv("suggestion-flair"), e.icon);
      }
      renderResults(
        t.createSpan("suggestion-content").createDiv("suggestion-title"),
        (n = e.display) !== null && undefined !== n ? n : e.value,
        e,
      );
    };
    t.prototype.onInputChange = function (e) {
      var t = this.getSuggestions(e);
      this.suggestions.setSuggestions(t);
    };
    t.prototype.getSuggestions = function (e) {
      for (var t = prepareQuery(e), n = [], i = 0, r = this.getItems(); i < r.length; i++) {
        var o = r[i],
          a = fuzzySearch(t, o.value);
        a
          ? n.push(
              __assign(__assign({}, o), {
                matches: a.matches,
                score: a.score,
              }),
            )
          : o.display &&
            (a = fuzzySearch(t, o.display)) &&
            n.push(
              __assign(__assign({}, o), {
                matches: a.matches,
                score: a.score - 10,
              }),
            );
      }
      n.sort(function (e, t) {
        return t.score - e.score;
      });
      return n;
    };
    t.prototype.onSelect = function (selectCb) {
      this.selectCb = selectCb;
      return this;
    };
    t.prototype.focus = function () {
      focusOrBlurOnPhysicalKeyboard(this.buttonEl, {
        preventScroll: !0,
      });
      this.open();
    };
    return t;
  })(PopoverSuggest);
function QT(e) {
  return e && typeof e == "object" && Object.hasOwn(e, "metadataEditor") && e.metadataEditor instanceof tD;
}
function $T(e) {
  if (e === null || e === "") return null;
  if (Array.isArray(e)) {
    var t = e
      .filter(function (e) {
        return e != null;
      })
      .map(function (e) {
        return String(e);
      });
    return t.length > 0 ? t : null;
  }
  return String.isString(e) ? [e] : [String(e)];
}
function JT(e) {
  var t,
    n = e.activeEditor;
  if (QT(n) && n.canShowProperties()) return n.metadataEditor;
  var i = (t = e.activeLeaf) === null || undefined === t ? undefined : t.view;
  return QT(i) && i.canShowProperties() ? i.metadataEditor : null;
}
function eD(e) {
  return __awaiter(this, undefined, Promise, function () {
    var t, n, i, r;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return (t = JT(e.workspace))
            ? [2, t]
            : (n = e.workspace.getActiveFile()) &&
                n.extension === "md" &&
                (i = e.internalPlugins.getEnabledPluginById("properties"))
              ? [4, i.ensurePropertiesView(n)]
              : [3, 2];
        case 1:
          if ((r = o.sent())) return [2, r.metadataEditor];
          o.label = 2;
        case 2:
          return [2, null];
      }
    });
  });
}
var tD = (function (e) {
    function t(app, owner) {
      var i = e.call(this) || this;
      i.hoverPopover = null;
      i.properties = [];
      i.selectedLines = new Set();
      i.collapsed = false;
      i.app = app;
      i.owner = owner;
      i.rendered = [];
      i.containerEl = createDiv({
        cls: "metadata-container",
        attr: {
          tabIndex: -1,
        },
      });
      i.errorEl = i.containerEl.createDiv("metadata-error-container");
      i.containerEl.setAttr("data-property-count", 0);
      i.containerEl.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.target === i.containerEl && i.handleKeypress(e);
        }
      });
      i.containerEl.addEventListener("focusin", function (e) {
        for (var t = 0, n = i.rendered; t < n.length; t++) {
          if (n[t].containerEl === e.targetNode) return;
        }
        i.clearSelection();
      });
      i.headingEl = i.containerEl.createDiv(
        {
          cls: "metadata-properties-heading",
          attr: {
            tabIndex: 0,
          },
        },
        function (e) {
          setIcon(
            (i.foldEl = e.createDiv({
              cls: "collapse-indicator collapse-icon",
            })),
            "right-triangle",
          );
          e.createDiv({
            cls: "metadata-properties-title",
            text: i18nProxy.properties.labelHeading(),
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            i.toggleCollapse();
          });
          e.addEventListener("contextmenu", i.showPropertiesMenu.bind(i));
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)) {
              e.key === "ArrowLeft"
                ? (e.preventDefault(), i.setCollapse(!0))
                : e.key === "ArrowRight"
                  ? (e.preventDefault(), i.setCollapse(!1))
                  : e.key === "ArrowUp"
                    ? (e.preventDefault(), i.owner.shiftFocusBefore())
                    : (e.key !== "ArrowDown" && e.key !== "j") ||
                      (e.preventDefault(), i.collapsed ? i.owner.shiftFocusAfter() : i.focusPropertyAtIndex(0));
            }
          });
        },
      );
      var r = (i.contentEl = i.containerEl.createDiv("metadata-content"));
      i.propertyListEl = r.createDiv("metadata-properties");
      i.addPropertyButtonEl = r.createDiv(
        {
          cls: "metadata-add-button text-icon-button",
          attr: {
            tabIndex: 0,
          },
        },
        function (e) {
          e.createSpan("text-button-icon", function (e) {
            return setIcon(e, "lucide-plus");
          });
          e.createSpan({
            cls: "text-button-label",
            text: i18nProxy.properties.labelAddPropertyButton(),
          });
          e.addEventListener("click", function () {
            return i.addProperty();
          });
          e.addEventListener("keydown", function (e) {
            if (!e.isComposing) {
              e.key === " " || e.key === "Enter"
                ? (e.preventDefault(), i.addProperty())
                : e.key === "ArrowUp" || e.key === "k" || (e.shiftKey && e.key === "Tab")
                  ? (e.preventDefault(), i.focusPropertyAtIndex(-1))
                  : e.key === "ArrowDown" || e.key === "j" || e.key === "Tab"
                    ? (e.preventDefault(), i.owner.shiftFocusAfter())
                    : i.handleKeypress(e);
            }
          });
        },
      );
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "focusedLine", {
      get: function () {
        for (var e = this.containerEl.doc.activeElement, t = 0, n = this.rendered; t < n.length; t++) {
          var i = n[t];
          if (i.containerEl.contains(e)) return i;
        }
        return null;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.handleKeypress = function (e) {
      var t, n, i, r;
      if (e.key === "o") {
        e.preventDefault();
        this.addProperty();
      } else if (e.key === "Home" || (e.key === "ArrowDown" && e.altKey)) {
        e.preventDefault();
        this.owner.shiftFocusAfter();
      } else if ((e.key !== "ArrowUp" && e.key !== "ArrowDown") || !e.shiftKey) {
        if (e.key === "ArrowUp" || e.key === "k" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          this.clearSelection();
          c = (s = this.focusedLine) ? this.rendered.indexOf(s) : -1;
          var o = this.rendered[c - 1];
          o ? o.focusProperty() : this.headingEl.focus();
        } else if (e.key === "ArrowDown" || e.key === "j" || (e.key === "Tab" && !e.shiftKey)) {
          e.preventDefault();
          this.clearSelection();
          c = (s = this.focusedLine) ? this.rendered.indexOf(s) : -1;
          (u = this.rendered[c + 1]) ? u.focusProperty() : this.addPropertyButtonEl.focus();
        } else if (e.key === "a" && Keymap.isModifier(e, "Mod")) {
          e.preventDefault();
          this.selectAll();
        } else if (e.key === "z" && e.shiftKey && Keymap.isModifier(e, "Mod")) {
          e.preventDefault();
          (n = (t = this.owner).redo) === null || undefined === n || n.call(t);
        } else if (e.key === "z" && Keymap.isModifier(e, "Mod")) {
          e.preventDefault();
          (r = (i = this.owner).undo) === null || undefined === r || r.call(i);
        } else if ((Platform.isMacOS && e.key === "Backspace" && e.metaKey) || e.key === "Delete") {
          e.preventDefault();
          s = this.focusedLine;
          var a = Array.from(this.selectedLines);
          a.length === 0 && s && a.push(s);
          this.removeProperties(a);
          this.clearSelection();
        }
      } else {
        e.preventDefault();
        var s = this.focusedLine,
          l = e.key === "ArrowDown" ? 1 : -1;
        if (s) {
          var c = this.rendered.indexOf(s),
            u = this.rendered[c + l],
            h = this.selectedLines.has(s) && this.selectedLines.has(u);
          if (u) {
            h ? this.selectProperty(s, !1) : (this.selectProperty(s, !0), this.selectProperty(u, !0));
            u.focusProperty();
          }
        }
      }
    };
    t.prototype.onload = function () {
      this.registerEvent(this.app.metadataTypeManager.on("changed", this.onMetadataTypeChange, this));
    };
    t.prototype.hasFocus = function () {
      var e = this.containerEl.doc.activeElement;
      return this.containerEl.contains(e);
    };
    t.prototype.hasPropertyFocused = function () {
      for (var e = this.containerEl.doc.activeElement, t = 0, n = this.rendered; t < n.length; t++) {
        if (n[t].containerEl === e) return !0;
      }
      return !1;
    };
    t.prototype.showPropertiesMenu = function (e) {
      var t = this;
      if (!this.headingEl.hasClass("has-active-menu")) {
        var n = Menu.forEvent(e);
        n.addSections(["title", "action-primary", "action", "action.sort", "", "danger"]);
        n.setSectionSubmenu("action.sort", {
          title: "Sort",
          icon: "lucide-sort-asc",
        });
        n.addItem(function (e) {
          return e
            .setTitle(i18nProxy.commands.addProperty())
            .onClick(function () {
              return t.addProperty();
            })
            .setSection("action-primary");
        })
          .addItem(function (e) {
            return e
              .setTitle(i18nProxy.commands.labelSortPropertyAToZ())
              .onClick(function () {
                return t.sortProperties();
              })
              .setSection("action.sort");
          })
          .addItem(function (e) {
            return e
              .setTitle(i18nProxy.commands.labelSortPropertyZToA())
              .onClick(function () {
                return t.sortProperties(!0);
              })
              .setSection("action.sort");
          })
          .addItem(function (e) {
            return e
              .setTitle(i18nProxy.commands.clearProperties())
              .onClick(function () {
                return t.removeProperties(t.rendered);
              })
              .setSection("danger")
              .setWarning(!0);
          });
        this.app.workspace.trigger("markdown-properties-menu", n, this.owner.getFile());
      }
    };
    t.prototype.toggleCollapse = function () {
      this.setCollapse(!this.collapsed);
    };
    t.prototype.selectAll = function () {
      for (var e = 0, t = this.rendered; e < t.length; e++) {
        var n = t[e];
        this.selectProperty(n, !0);
      }
    };
    t.prototype.setCollapse = function (collapsed, t = true) {
      this.collapsed !== collapsed &&
        ((this.collapsed = collapsed),
        this.containerEl.toggleClass("is-collapsed", this.collapsed),
        this.headingEl.toggleClass("is-collapsed", this.collapsed),
        this.foldEl.toggleClass("is-collapsed", this.collapsed),
        toggleElementVisibility(this.contentEl, this.collapsed, t),
        t && this.owner.onMarkdownFold());
    };
    t.prototype.focusPropertyAtIndex = function (e) {
      if (-1 === e) {
        e = this.rendered.length - 1;
      }
      var t = this.rendered[e];
      t ? t.focusProperty() : this.addPropertyButtonEl.focus();
    };
    t.prototype._copyToClipboard = function (e, t) {
      for (var n = {}, i = 0, r = t; i < r.length; i++) {
        var o = r[i];
        n[o.entry.key] = o.entry.value;
      }
      e.clipboardData.setData("Text", stringifyYaml(n));
      e.clipboardData.setData("obsidian/properties", JSON.stringify(n));
    };
    t.prototype.handleCut = function (e) {
      if (this.hasPropertyFocused()) {
        var t = Array.from(this.selectedLines);
        t.length === 0 && this.focusedLine && t.push(this.focusedLine);
        t.length !== 0 && (e.preventDefault(), this._copyToClipboard(e, t), this.removeProperties(t));
      }
    };
    t.prototype.handleCopy = function (e) {
      if (this.hasPropertyFocused()) {
        var t = Array.from(this.selectedLines);
        t.length === 0 && this.focusedLine && t.push(this.focusedLine);
        t.length !== 0 && (e.preventDefault(), this._copyToClipboard(e, t));
      }
    };
    t.prototype.insertProperties = function (e) {
      var t = this.serialize();
      vx(t, e);
      this.synchronize(t);
      this.save();
    };
    t.prototype.handlePaste = function (e) {
      var t = e.clipboardData.getData("obsidian/properties");
      if (t) {
        e.preventDefault();
        var n = null;
        try {
          n = JSON.parse(t);
        } catch (e) {
          console.error(e);
        }
        if (n) {
          this.insertProperties(n);
        }
      }
    };
    t.prototype.handleItemSelection = function (e, t) {
      var n = this.selectedLines,
        i = this.focusedLine;
      if ((t.focusProperty(), e.altKey && !e.shiftKey)) {
        this.selectProperty(t, !n.has(t));
        return !0;
      }
      if (e.shiftKey) {
        if (i)
          for (
            var r = [this.rendered.indexOf(i), this.rendered.indexOf(t)].sort(Mb),
              o = r[0],
              a = r[1],
              s = n.has(i) && n.has(t),
              l = o;
            l <= a;
            l++
          )
            this.selectProperty(this.rendered[l], !s);
        else this.selectProperty(t, !0);
        return !0;
      }
      this.clearSelection();
      return !1;
    };
    t.prototype.selectProperty = function (e, t) {
      if (e) {
        t ? (this.selectedLines.add(e), e.setSelected(!0)) : (this.selectedLines.delete(e), e.setSelected(!1));
      }
    };
    t.prototype.clearSelection = function () {
      this.selectedLines.forEach(function (e) {
        e.setSelected(!1);
      });
      this.selectedLines.clear();
    };
    t.prototype.clear = function () {
      this.hasFocus() && clearFocusAndSelection();
      this.selectedLines = new Set();
    };
    t.prototype.focus = function (e) {
      undefined === e &&
        (e = {
          bottom: !1,
        });
      return (
        this.properties.length > 0 &&
        (this.collapsed || !e.bottom ? this.headingEl.focus() : this.addPropertyButtonEl.focus(), !0)
      );
    };
    t.prototype.focusProperty = function (e) {
      var t = this.rendered.find(function (t) {
        return t.entry.key === e;
      });
      if (t) {
        Platform.hasPhysicalKeyboard ? t.focusProperty() : flashElement(t.containerEl);
      }
    };
    t.prototype.focusKey = function (e) {
      var t = this.rendered.find(function (t) {
        return t.entry.key === e;
      });
      if (!(t == null)) {
        t.focusKey();
      }
    };
    t.prototype.focusValue = function (e, t) {
      var n = this.rendered.find(function (t) {
        return t.entry.key === e;
      });
      if (!(n == null)) {
        n.focusValue(t);
      }
    };
    t.prototype.onMetadataTypeChange = function (e) {
      var t = this.rendered.find(function (t) {
        return t.entry.key.toLowerCase() === e;
      });
      if (t) {
        t.renderProperty(t.entry, !0);
      }
    };
    t.prototype.synchronize = function (e) {
      var t = this,
        n = !!e,
        properties = [],
        rendered = [];
      if (e)
        for (var o in e)
          if (Object.hasOwn(e, o)) {
            properties.push({
              key: o,
              value: e[o],
            });
          }
      for (
        var a = function (e) {
            var t = properties[e],
              n = s.rendered.find(function (e) {
                return e.entry.key === t.key;
              });
            n || (n = new nD(s.app, s, t));
            n.renderProperty(t);
            rendered.push(n);
          },
          s = this,
          l = 0;
        l < properties.length;
        l++
      )
        a(l);
      var c = this.rendered.find(function (e) {
        return e.entry.key === "";
      });
      if (c) {
        var u = this.containerEl.doc.activeElement;
        if (c.containerEl.contains(u)) {
          rendered.push(c);
          properties.push(c.entry);
        }
      }
      this.propertyListEl.setChildrenInPlace(
        rendered.map(function (e) {
          return e.containerEl;
        }),
      );
      this.properties = properties;
      this.rendered = rendered;
      this.invalidFrontmatter = !n;
      this.containerEl.setAttr("data-property-count", this.properties.length);
      this.containerEl.toggleClass("mod-error", !n);
      this.headingEl.toggle(n);
      this.addPropertyButtonEl.toggle(n);
      this.errorEl.toggle(!n);
      n ||
        this.errorEl.firstChild ||
        (this.errorEl.createDiv({
          cls: "metadata-error-title",
          text: i18nProxy.properties.labelInvalidHeading(),
        }),
        this.errorEl.createDiv("text-icon-button metadata-show-source-button", function (e) {
          e.createSpan({
            cls: "text-button-label",
            text: i18nProxy.properties.labelShowSource(),
          });
          e.addEventListener("click", function () {
            var e = t.owner.getFile(),
              n = t.app.workspace.getActiveFileView();
            if (n.file !== e) {
              var i = t.app.workspace.getLeaf();
              i.openFile(e);
              n = i.view;
            }
            if (n instanceof MarkdownView) {
              var r = n.leaf.getViewState();
              r.state.mode = "source";
              n.leaf.setViewState(r, {
                focus: true,
                cursor: {
                  from: {
                    line: 0,
                    ch: 0,
                  },
                },
              });
            }
          });
        }));
    };
    t.prototype.serialize = function () {
      for (var e = {}, t = 0, n = this.properties; t < n.length; t++) {
        var i = n[t];
        e[i.key] = i.value;
      }
      return e;
    };
    t.prototype.sortProperties = function (e) {
      if (undefined === e) {
        e = false;
      }
      var t = this.serialize(),
        n = Object.keys(t);
      e ? n.sort(Sb) : n.sort(Eb);
      for (var i = {}, r = 0, o = n; r < o.length; r++) {
        var a = o[r];
        i[a] = t[a];
      }
      this.synchronize(i);
    };
    t.prototype.addProperty = function (e) {
      if ((undefined === e && (e = ""), this.invalidFrontmatter))
        new Notice(i18nProxy.properties.msgInvalidProperties());
      else {
        var t = this.serialize();
        t.hasOwnProperty(e) || ((t[e] = null), this.synchronize(t), e && this.owner.saveFrontmatter(t));
        e ? this.focusValue(e, "both") : this.focusKey(e);
      }
    };
    t.prototype.removeProperties = function (e, t) {
      if (undefined === t) {
        t = true;
      }
      for (
        var n = 0, i = this.focusedLine, r = i ? this.rendered.indexOf(i) : -1, o = this.serialize(), a = 0, s = e;
        a < s.length;
        a++
      ) {
        var l = s[a];
        this.rendered.indexOf(l) <= r && n++;
        delete o[l.entry.key];
      }
      r -= n;
      this.synchronize(o);
      t &&
        (Object.keys(o).length > 0
          ? this.focusPropertyAtIndex(Math.clamp(r, 0, this.rendered.length - 1))
          : this.owner.shiftFocusAfter());
      this.owner.saveFrontmatter(o);
    };
    t.prototype.save = function () {
      var e = this.serialize();
      this.owner.saveFrontmatter(e);
    };
    t.prototype.reorderKey = function (e, t) {
      var n = this.serialize();
      delete n[e.key];
      for (var i = {}, r = Object.keys(n), o = 0; o < r.length; o++) {
        if (o === t) {
          i[e.key] = e.value;
        }
        var a = r[o];
        i[a] = n[a];
      }
      t >= r.length && (i[e.key] = e.value);
      this.owner.saveFrontmatter(i);
    };
    return t;
  })(Component),
  nD = (function () {
    function e(app, metadataEditor, entry) {
      var i = this;
      this.app = app;
      this.metadataEditor = metadataEditor;
      this.entry = entry;
      this.typeInfo = this.app.metadataTypeManager.getTypeInfo(entry.key, entry.value);
      this.containerEl = createDiv({
        cls: "metadata-property",
        attr: {
          tabIndex: 0,
        },
      });
      this.containerEl.setAttr("data-property-key", entry.key);
      this.containerEl.addEventListener("keydown", function (e) {
        if (!e.isComposing && !e.defaultPrevented && e.target === i.containerEl)
          if (i.metadataEditor.selectedLines.size > 1) i.metadataEditor.handleKeypress(e);
          else if (e.key === "Enter" || e.key === " " || e.key === "A" || e.key === "i") {
            e.preventDefault();
            var t = "both";
            e.key === "A" ? (t = "end") : e.key === "i" && (t = "start");
            i.metadataEditor.focusValue(entry.key, t);
          } else
            e.key === "ArrowLeft" || e.key === "h"
              ? (e.preventDefault(), i.focusKey())
              : e.key === "ArrowRight" || e.key === "l"
                ? (e.preventDefault(), i.focusValue())
                : i.metadataEditor.handleKeypress(e);
      });
      this.keyEl = this.containerEl.createDiv({
        cls: "metadata-property-key",
      });
      this.iconEl = this.keyEl.createSpan(
        {
          cls: "metadata-property-icon",
          attr: {
            "aria-disabled": !this.entry.key,
          },
        },
        function (e) {
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (t) {
            t.preventDefault();
            e.getAttr("aria-disabled") !== "true" &&
              (i.containerEl.hasClass("has-active-menu") || i.handleItemClick(t));
          });
          Platform.isMobileApp ||
            e.addEventListener("contextmenu", function (t) {
              t.preventDefault();
              e.getAttr("aria-disabled") !== "true" &&
                (i.containerEl.hasClass("has-active-menu") || (i.focusProperty(), i.showPropertyMenu(t)));
            });
        },
      );
      this.keyInputEl = this.keyEl.createEl(
        "input",
        {
          cls: "metadata-property-key-input",
          value: this.entry.key,
          type: "text",
          attr: {
            autocapitalize: "none",
            enterkeyhint: Platform.isAndroidApp ? "enter" : "next",
          },
        },
        function (t) {
          Platform.isMobile || setTooltip(t, i.entry.key);
          t.addEventListener("blur", function (e) {
            if (t !== t.doc.activeElement) {
              var n = t.value.trim();
              n !== "" || i.entry.key !== ""
                ? i.handleUpdateKey(n) || (t.value = i.entry.key)
                : i.metadataEditor.removeProperties([i], !1);
            }
          });
          t.addEventListener("keydown", function (r) {
            if (!r.isComposing && !r.defaultPrevented)
              if (r.key === "Tab" || r.key === "Enter") {
                r.preventDefault();
                var o = t.value.trim();
                if (i.handleUpdateKey(o)) {
                  app.nextFrame(function () {
                    i.renderProperty(i.entry, !0);
                    i.focusValue();
                  });
                }
              } else if (r.key === "Escape") {
                r.preventDefault();
                t.value = entry.key;
                entry.key ? i.focusProperty() : i.metadataEditor.removeProperties([i]);
              }
          });
          t.addEventListener("input", function () {
            var e = entry.key || t.value.trim();
            i.iconEl.setAttr("aria-disabled", !e);
          });
          new DD(app, t, i.metadataEditor.properties).onSelect(function (n) {
            var value = n.text.trim();
            t.value = value;
            i.handleUpdateKey(value) &&
              app.nextFrame(function () {
                i.renderProperty(i.entry, !0);
                i.focusValue();
              });
          });
        },
      );
      this.valueEl = this.containerEl.createDiv("metadata-property-value");
      xc(this.valueEl);
      var r = (this.warningEl = this.containerEl.createDiv({
        cls: "clickable-icon metadata-property-warning-icon",
      }));
      setTooltip(
        r,
        i18nProxy.properties.labelTypeMismatchWarning({
          type: this.typeInfo.expected.name(),
        }),
      );
      setIcon(r, "lucide-alert-triangle");
      r.toggle(this.typeInfo.expected !== this.typeInfo.inferred);
      r.addEventListener("click", function (e) {
        new OD(i.app, i).open();
      });
      Vc(
        this.iconEl,
        this.containerEl,
        this.metadataEditor.propertyListEl,
        10,
        function () {},
        function (e) {
          return i.metadataEditor.reorderKey(i.entry, e);
        },
      );
    }
    e.prototype.setSelected = function (e) {
      this.containerEl.toggleClass("is-selected", e);
    };
    e.prototype.handleItemClick = function (e) {
      if (!this.metadataEditor.handleItemSelection(e, this)) {
        this.showPropertyMenu(e);
      }
    };
    e.prototype.focusKey = function () {
      var e = this.metadataEditor,
        t = this.keyInputEl;
      e.collapsed && e.setCollapse(!1, !0);
      t.focus();
    };
    e.prototype.focusProperty = function () {
      var e = this.metadataEditor,
        t = this.containerEl;
      e.collapsed && e.setCollapse(!1, !0);
      t.focus();
    };
    e.prototype.focusValue = function (e) {
      if (undefined === e) {
        e = "both";
      }
      var t = this.metadataEditor,
        n = this.rendered;
      t.collapsed && t.setCollapse(!1, !0);
      n.focus(e);
    };
    e.prototype.showPropertyMenu = function (e) {
      var t,
        n = this;
      e.preventDefault();
      var i = new Menu();
      i.addSections(["title", "action", "action.changeType", "selection", "clipboard", "", "danger"]);
      var r = this.app.metadataTypeManager,
        o = !xM.hasOwnProperty(this.entry.key),
        a = r.registeredTypeWidgets;
      Platform.isPhone &&
        i.addItem(function (e) {
          return e.setTitle(n.entry.key).setSection("title").removeIcon().setIsLabel(!0);
        });
      Platform.isMobile &&
        i
          .addItem(function (e) {
            return e
              .setTitle(i18nProxy.properties.optionPropertyType())
              .setSection("action.changeType")
              .removeIcon()
              .setIsLabel(!0)
              .titleEl.addClass("u-small");
          })
          .onHide(function () {
            clearFocusAndSelection();
          });
      i.setSectionSubmenu("action.changeType", {
        title: i18nProxy.properties.optionPropertyType(),
        icon: "lucide-info",
      });
      for (
        var s = function (e) {
            if (
              e.reservedKeys &&
              !((t = e.reservedKeys) === null || undefined === t ? undefined : t.contains(l.entry.key))
            )
              return "continue";
            i.addItem(function (t) {
              return t
                .setTitle(e.name())
                .setIcon(e.icon)
                .setSection("action.changeType")
                .setDisabled(!o)
                .setChecked(e.type === n.typeInfo.expected.type)
                .onClick(function () {
                  r.setType(n.entry.key, e.type);
                  n.renderProperty(n.entry, !0);
                  n.entry.value == null || e.validate(n.entry.value) || new OD(n.app, n).open();
                });
            });
          },
          l = this,
          c = 0,
          u = Object.values(a);
        c < u.length;
        c++
      ) {
        s(u[c]);
      }
      Platform.isDesktopApp &&
        (i.addItem(function (t) {
          return t
            .setTitle(i18nProxy.interface.menu.cut())
            .setSection("clipboard")
            .setIcon("lucide-scissors")
            .onClick(function () {
              e.win.electron.remote.getCurrentWebContents().cut();
            });
        }),
        i.addItem(function (t) {
          return t
            .setTitle(i18nProxy.interface.menu.copy())
            .setSection("clipboard")
            .setIcon("lucide-copy")
            .onClick(function () {
              e.win.electron.remote.getCurrentWebContents().copy();
            });
        }),
        i.addItem(function (t) {
          return t
            .setTitle(i18nProxy.interface.menu.paste())
            .setSection("clipboard")
            .setIcon("lucide-clipboard-check")
            .onClick(function () {
              e.win.electron.remote.getCurrentWebContents().paste();
            });
        }));
      i.addItem(function (e) {
        return e
          .setTitle(i18nProxy.interface.menu.remove())
          .setWarning(!0)
          .setSection("danger")
          .setIcon("lucide-trash-2")
          .onClick(function () {
            n.metadataEditor.removeProperties([n]);
          });
      });
      i.setParentElement(this.containerEl).showAtMouseEvent(e);
    };
    e.prototype.handleUpdateKey = function (key) {
      if (key === "") {
        this.keyInputEl.isActiveElement() &&
          displayTooltip(this.keyInputEl, i18nProxy.properties.msgEmptyPropertyName(), {
            classes: ["mod-error"],
          });
        return !1;
      }
      if (this.entry.key !== key) {
        var t = this.metadataEditor.rendered.find(function (t) {
          return t.entry.key.toLowerCase() === key.toLowerCase();
        });
        if (t && t !== this.metadataEditor.focusedLine) {
          flashElement(t.containerEl);
          displayTooltip(this.keyInputEl, i18nProxy.properties.msgDuplicatePropertyName(), {
            classes: ["mod-error"],
          });
          return !1;
        }
        this.entry.key = key;
        this.containerEl.setAttr("data-property-key", key);
        this.metadataEditor.save();
      }
      hideTooltip();
      this.iconEl.setAttr("aria-disabled", !1);
      return !0;
    };
    e.prototype.handleUpdateValue = function (value) {
      if (this.entry.value !== value) {
        (value === "" || (Array.isArray(value) && value.length === 0)) && (value = null);
        this.entry.value = value;
        this.metadataEditor.save();
      }
    };
    e.prototype.handlePropertyBlur = function () {
      clearFocusAndSelection();
      Platform.hasPhysicalKeyboard && this.focusProperty();
    };
    e.prototype.renderProperty = function (entry, t, n) {
      var i, r, o;
      undefined === t && (t = false);
      undefined === n && (n = false);
      var a = this.typeInfo.inferred.type,
        s = (i = this.entry) === null || undefined === i ? undefined : i.value;
      this.entry = entry;
      var l = (this.typeInfo = this.app.metadataTypeManager.getTypeInfo(entry.key, entry.value)),
        c = n ? l.expected : l.inferred;
      if (
        !(
          !t &&
          (this.valueEl.contains(this.containerEl.doc.activeElement) ||
            (this.valueEl.hasChildNodes() && s === this.entry.value && a === l.inferred.type))
        )
      ) {
        setIcon(this.iconEl, l.expected.icon);
        setTooltip(
          this.warningEl,
          i18nProxy.properties.labelTypeMismatchWarning({
            type: this.typeInfo.expected.name(),
          }),
        );
        this.warningEl.toggle(!n && l.expected !== l.inferred);
        this.valueEl.empty();
        this.rendered = c.render(this.valueEl, this.entry.value, {
          app: this.app,
          key: this.entry.key,
          onChange: this.handleUpdateValue.bind(this),
          sourcePath:
            (o = (r = this.metadataEditor.owner.getFile()) === null || undefined === r ? undefined : r.path) !== null &&
            undefined !== o
              ? o
              : "",
          blur: this.handlePropertyBlur.bind(this),
          hoverSource: this.metadataEditor.owner.getHoverSource(),
        });
      }
    };
    return e;
  })(),
  iD = (function () {
    function e(containerEl) {
      this.containerEl = containerEl;
    }
    e.prototype.focus = function (e) {
      undefined === e && (e = "both");
      this.onFocus(e);
    };
    return e;
  })(),
  text = {
    name: i18nProxy.properties.types.optionText,
    type: "text",
    icon: "lucide-text",
    validate: function (e) {
      return typeof e == "string";
    },
    render: function (e, t, n) {
      var i = new oD(n, e);
      i.setValue(String(t != null ? t : ""));
      new TD(n, i.inputEl, function (e, t) {
        t.preventDefault();
        i.setValue(e);
        n.onChange(e);
        clearFocusAndSelection();
        n.blur();
      });
      return i;
    },
  },
  oD = (function (e) {
    function t(ctx, containerEl) {
      var hoverParent = e.call(this, containerEl) || this;
      hoverParent.type = "text";
      hoverParent.hoverPopover = null;
      hoverParent.ctx = ctx;
      hoverParent.containerEl = containerEl;
      var spellcheck = String(ctx.app.vault.getConfig("spellcheck")),
        o = (hoverParent.inputEl = containerEl.createDiv({
          cls: "metadata-input-longtext",
          type: "text",
          attr: {
            placeholder: i18nProxy.properties.labelNoValue(),
            contentEditable: true,
            spellcheck: spellcheck,
            tabIndex: 0,
          },
        })),
        a = function (e) {
          hoverParent.setValue(e);
          hoverParent.ctx.onChange(e);
        };
      o.addEventListener("drop", function (e) {
        var n = ctx.app.dragManager.draggable;
        if (n) {
          var i = generateLinksFromData(ctx.app, n, ctx.sourcePath);
          if (i.length > 0) {
            e.preventDefault();
            a(i[0]);
          }
        }
      });
      o.addEventListener("keydown", function (e) {
        if (!e.isComposing)
          if (e.key === "Enter") {
            if (e.shiftKey) return;
            if (e.defaultPrevented) return;
            e.preventDefault();
            a(o.textContent);
            hoverParent.ctx.blur();
          } else if (e.key === "Escape") {
            e.preventDefault();
            hoverParent.setValue(hoverParent.value);
            hoverParent.ctx.blur();
          }
      });
      o.addEventListener("input", function (e) {
        if (!e.isComposing) {
          normalizeElementText(o, !0);
        }
      });
      o.addEventListener("paste", function (e) {
        handlePasteText(o, e);
      });
      o.addEventListener("blur", function (e) {
        if (!e.defaultPrevented) {
          a(o.textContent.trimEnd());
        }
      });
      var targetEl = (hoverParent.linkEl = containerEl.createDiv("metadata-link")),
        l = (hoverParent.linkTextEl = targetEl.createDiv("metadata-link-inner"));
      targetEl.createDiv("metadata-link-flair", function (e) {
        return setIcon(e, "lucide-pencil");
      });
      l.onClickEvent(function (e) {
        if (!(e.button !== 0 && e.button !== 1)) {
          e.preventDefault();
          hoverParent.isWikilink()
            ? hoverParent.ctx.app.workspace.openLinkText(
                hoverParent.getLinkText(),
                hoverParent.ctx.sourcePath,
                Keymap.isModEvent(e),
              )
            : qc(hoverParent.value)
              ? window.open(hoverParent.value, "_blank")
              : _c(hoverParent.value) && window.open("mailto:" + hoverParent.value, "_blank");
        }
      });
      l.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var t = new Menu().addSections([
          "title",
          "correction",
          "spellcheck",
          "open",
          "selection",
          "clipboard",
          "action",
          "view",
          "info",
          "",
          "danger",
        ]);
        hoverParent.isWikilink()
          ? hoverParent.ctx.app.workspace.handleLinkContextMenu(
              t,
              hoverParent.getLinkText(),
              hoverParent.ctx.sourcePath,
            )
          : qc(hoverParent.value)
            ? hoverParent.ctx.app.workspace.handleExternalLinkContextMenu(t, hoverParent.value)
            : _c(hoverParent.value) &&
              hoverParent.ctx.app.workspace.handleExternalLinkContextMenu(t, "mailto:" + hoverParent.value);
        t.showAtMouseEvent(e);
      });
      hoverParent.isWikilink() &&
        ctx.app.dragManager.handleDrag(l, function (e) {
          return ctx.app.dragManager.dragLink(e, hoverParent.getLinkText(), ctx.sourcePath);
        });
      targetEl.addEventListener("click", function (e) {
        if (!e.defaultPrevented) {
          hoverParent.onFocus();
        }
      });
      targetEl.addEventListener("mouseover", function (event) {
        if (l.hasClass("internal-link")) {
          hoverParent.ctx.app.workspace.trigger("hover-link", {
            event: event,
            source: ctx.hoverSource,
            hoverParent: hoverParent,
            targetEl: targetEl,
            linktext: hoverParent.getLinkText(),
          });
        }
      });
      return hoverParent;
    }
    __extends(t, e);
    t.prototype.isWikilink = function () {
      var e = this.value;
      return e && e.startsWith("[[") && e.endsWith("]]");
    };
    t.prototype.render = function () {
      var e = this.ctx.app,
        t = this.linkTextEl,
        n = this.getLinkText();
      t.setText(this.getDisplayText());
      var i = this.isWikilink(),
        r = qc(this.value),
        o = _c(this.value),
        a = i && !e.metadataCache.getFirstLinkpathDest(getLinkpath(n), this.ctx.sourcePath);
      t.toggleClass("internal-link", i);
      t.toggleClass("external-link", r || o);
      t.toggleClass("is-unresolved", a);
      i || r || o ? (this.inputEl.hide(), this.linkEl.show()) : (this.linkEl.hide(), this.inputEl.show());
    };
    t.prototype.isAlias = function () {
      var e = this.value;
      return !!(e && e.startsWith("[[") && e.endsWith("]]")) && parseAliasLink(e.slice(2, -2)).isAlias;
    };
    t.prototype.getDisplayText = function () {
      var e = this.value;
      return e && e.startsWith("[[") && e.endsWith("]]") ? parseAliasLink(e.slice(2, -2)).title : e || "";
    };
    t.prototype.getLinkText = function () {
      var e = this.value;
      return e && e.startsWith("[[") && e.endsWith("]]") ? parseAliasLink(e.slice(2, -2)).href : e || "";
    };
    t.prototype.setValue = function (textContent) {
      textContent === null && (textContent = "");
      this.value = String(textContent);
      this.inputEl.textContent = textContent;
      this.render();
    };
    t.prototype.onFocus = function (e) {
      undefined === e && (e = "both");
      this.inputEl.show();
      this.linkEl.hide();
      Platform.isPhone
        ? this.inputEl.focus()
        : focusAndSelectContent(
            this.inputEl,
            (function (e) {
              return e === "start" || (e !== "end" && undefined);
            })(e),
          );
    };
    return t;
  })(iD),
  aD = (function (e) {
    function t(t, hoverEl, i) {
      var hoverParent = e.call(this, hoverEl) || this;
      hoverParent.type = "multitext";
      hoverParent.hoverPopover = null;
      i = $T(i);
      hoverParent.valueSet = new Set(i);
      var o = t.app,
        a = t.onChange,
        s = t.sourcePath,
        l = function (e, n) {
          new TD(
            t,
            e,
            function (e, t) {
              return n(e, !0);
            },
            function (e) {
              return e.type !== "text" || !hoverParent.valueSet.has(e.text);
            },
          );
        },
        c = function (e) {
          return e && e.startsWith("[[") && e.endsWith("]]");
        },
        u = (hoverParent.multiselect = new dT(hoverEl)
          .setOptionRenderer(function (e, n) {
            var targetEl = n.el,
              a = n.pillEl;
            if (c(e)) {
              var l = e.slice(2, -2),
                u = parseAliasLink(l),
                texth0 = u.title,
                linktext = u.href;
              targetEl.createSpan({
                text: texth0,
              });
              a.addClass("internal-link");
              a.toggleClass("is-unresolved", !o.metadataCache.getFirstLinkpathDest(getLinkpath(linktext), s));
              targetEl.onClickEvent(function (e) {
                if (!(e.button !== 0 && e.button !== 1)) {
                  o.workspace.openLinkText(linktext, s, Keymap.isModEvent(e));
                }
              });
              o.dragManager.handleDrag(a, function (e) {
                return o.dragManager.dragLink(e, l, s);
              });
              targetEl.addEventListener("mouseover", function (event) {
                o.workspace.trigger("hover-link", {
                  event: event,
                  source: t.hoverSource,
                  hoverParent: hoverParent,
                  targetEl: targetEl,
                  linktext: linktext,
                });
              });
            } else if ((targetEl.setText(e), qc(e) || _c(e))) {
              var d = _c(e) ? "mailto:" + e : e;
              targetEl.addClass("external-link");
              targetEl.onClickEvent(function (e) {
                if (!(e.button !== 0 && e.button !== 1)) {
                  window.open(d, "_blank");
                }
              });
            }
          })
          .setOptionContextmenuHandler(function (e, t) {
            if (
              (e.addSections([
                "title",
                "correction",
                "spellcheck",
                "open",
                "selection",
                "clipboard",
                "action",
                "view",
                "info",
                "",
                "danger",
              ]),
              c(t))
            ) {
              var n = parseAliasLink(t.slice(2, -2)).href;
              o.workspace.handleLinkContextMenu(e, n, s);
            } else if (qc(t)) {
              o.workspace.handleExternalLinkContextMenu(e, t);
            }
          })
          .setValues(i)
          .allowCreatingOptions(function (e) {
            return e;
          })
          .preventDuplicates(function (e, t) {
            return t.indexOf(e);
          })
          .setupInputEl(l)
          .onChange(function (e) {
            hoverParent.valueSet = new Set(e);
            a(e.slice());
          }));
      o.dragManager.handleDrop(u.rootEl, function (e, t, i) {
        if (t) {
          if (!i) {
            var r = generateLinksFromData(o, t, s);
            if (r.length > 0) {
              e.preventDefault();
              for (var a = 0, l = r; a < l.length; a++) {
                var c = l[a];
                u.addElement(c);
              }
            }
          }
          return {
            hoverClass: "is-being-dragged-over",
            hoverEl: hoverEl,
            dropEffect: "copy",
          };
        }
      });
      u.inputEl.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.key === "Escape" && (e.preventDefault(), t.blur());
        }
      });
      l(u.inputEl, function (e) {
        hoverParent.multiselect.addElement(e);
        hoverParent.multiselect.setInputText("");
      });
      return hoverParent;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      Platform.isPhone ? this.multiselect.inputEl.focus() : focusAndSelectContent(this.multiselect.inputEl);
    };
    t.prototype.setValue = function (e) {
      var t = $T(e);
      this.valueSet = new Set(t);
      this.multiselect.setValues(t);
    };
    return t;
  })(iD),
  sD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "tags";
      i != null || (i = []);
      var o = new Set(i),
        a = (r.multiselect = new dT(n)
          .setOptionRenderer(function (texte0, n) {
            var i = n.el,
              r = n.pillEl;
            texte0.startsWith("#") && (texte0 = texte0.slice(1));
            i.createEl("span", {
              text: texte0,
            });
            gb("#" + texte0) || (r.addClass("is-invalid"), setTooltip(r, i18nProxy.properties.msgInvalidTag()));
            handleTextSelectionClick(i, function () {
              var n = t.app.internalPlugins.getEnabledPluginById("global-search");
              if (n) {
                n.openGlobalSearch("tag:" + texte0);
              }
            });
          })
          .preventDuplicates(function (e, t) {
            var n = function (e) {
              return e.startsWith("#") ? e.slice(1) : e;
            };
            return t.map(n).indexOf(n(e));
          })
          .allowCreatingOptions(function (e) {
            var t = e;
            if (t.trim()) {
              t.startsWith("#") || (t = "#" + t);
              return gb(t)
                ? (hideTooltip(), e)
                : (displayTooltip(a.inputEl, i18nProxy.properties.msgInvalidTag(), {
                    classes: ["mod-error"],
                  }),
                  null);
            }
          })
          .setValues(i)
          .onChange(function (e) {
            t.onChange(e.slice());
            o = new Set(e);
          }));
      a.inputEl.autocapitalize = "none";
      new ID(t.app, a.inputEl, function (e) {
        return !o.has(e.tag);
      }).onSelect(function (e) {
        a.addElement(e.tag);
        a.setInputText("");
      });
      a.inputEl.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.key === "Escape" && (e.preventDefault(), t.blur());
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      Platform.isPhone ? this.multiselect.inputEl.focus() : focusAndSelectContent(this.multiselect.inputEl);
    };
    t.prototype.setValue = function (e) {
      this.multiselect.setValues($T(e));
    };
    return t;
  })(iD),
  lD = (function (e) {
    function t(ctx, containerEl, i) {
      var r = e.call(this, containerEl) || this;
      r.type = "aliases";
      r.hoverPopover = null;
      i = $T(i);
      r.ctx = ctx;
      r.containerEl = containerEl;
      var o = (r.multiselect = new dT(containerEl)
        .setOptionRenderer(function (e, t) {
          return t.el.setText(e);
        })
        .preventDuplicates(function (e, t) {
          return t.indexOf(e);
        })
        .allowCreatingOptions(function (e) {
          return e.trim();
        })
        .setValues(i)
        .onChange(function (e) {
          return ctx.onChange(e.slice());
        }));
      o.inputEl.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.key === "Escape" && (e.preventDefault(), ctx.blur());
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      Platform.isPhone ? this.multiselect.inputEl.focus() : focusAndSelectContent(this.multiselect.inputEl);
    };
    t.prototype.setValue = function (e) {
      this.multiselect.setValues($T(e));
    };
    return t;
  })(iD),
  cD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "date";
      r.hoverPopover = null;
      r.dirty = false;
      r.value = "";
      r.value = i != null ? i : "";
      r.parse(i);
      r.dirty = false;
      var o = (r.inputEl = r.buildInput(n));
      o.toggleClass("is-empty", !i);
      o.addEventListener("input", function () {
        o.toggleClass("is-empty", !o.value);
        r.parse(o.value);
        r.dirty = true;
      });
      o.addEventListener("blur", function () {
        if (r.dirty && (o.value === "" || r.date.isValid())) {
          r.value = o.value;
          t.onChange(r.format(r.date));
          r.dirty = false;
        }
      });
      o.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.key === "Enter"
            ? (e.preventDefault(), t.blur())
            : e.key === "Escape" && (e.preventDefault(), r.setValue(r.value), t.blur());
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.inputEl.focus();
    };
    t.prototype.setValue = function (value) {
      this.dirty = false;
      this.inputEl.value = this.value = value;
      this.inputEl.toggleClass("is-empty", !value);
      this.parse(value);
    };
    return t;
  })(iD),
  uD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.type = "datetime";
      r.buttonEl = null;
      var o = t.app,
        a = o.internalPlugins.getEnabledPluginById("daily-notes");
      a &&
        (r.buttonEl = n.createDiv("clickable-icon", function (e) {
          setIcon(e, "lucide-link");
          setTooltip(e, i18nProxy.plugins.properties.actionOpenDailyNote());
          e.onClickEvent(function (e) {
            return __awaiter(r, undefined, undefined, function () {
              var t;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, a.getDailyNote(this.date)];
                  case 1:
                    t = n.sent();
                    o.workspace.getLeaf(Keymap.isModEvent(e)).openFile(t);
                    return [2];
                }
              });
            });
          });
          e.toggle(!!r.value);
        }));
      return r;
    }
    __extends(t, e);
    t.prototype.buildInput = function (e) {
      return e.createEl("input", {
        cls: "metadata-input metadata-input-text mod-date",
        type: "date",
        placeholder: i18nProxy.properties.labelNoValue(),
        value: this.format(this.date),
        attr: {
          max: "9999-12-31",
        },
      });
    };
    t.prototype.parse = function (e) {
      var t,
        n = (this.date = window.moment(e, TM));
      if (!((t = this.buttonEl) === null || undefined === t)) {
        t.toggle(n.isValid());
      }
    };
    t.prototype.format = function (e) {
      return e.isValid() ? e.format("YYYY-MM-DD") : "";
    };
    return t;
  })(cD),
  hD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.type = "datetime";
      return r;
    }
    __extends(t, e);
    t.prototype.buildInput = function (e) {
      return e.createEl("input", {
        cls: "metadata-input metadata-input-text mod-datetime",
        type: "datetime-local",
        placeholder: i18nProxy.properties.labelNoValue(),
        value: this.format(this.date),
        attr: {
          max: "9999-12-31T23:59",
        },
      });
    };
    t.prototype.parse = function (e) {
      this.date = window.moment(e, DM);
    };
    t.prototype.format = function (e) {
      return e.isValid() ? e.format("YYYY-MM-DD[T]HH:mm:ss") : "";
    };
    return t;
  })(cD),
  pD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "file";
      var o = (r.inputEl = n.createEl("input", {
        cls: "metadata-input metadata-input-text",
        type: "text",
        placeholder: i18nProxy.properties.labelNoValue(),
        value: i != null ? i : "",
      }));
      o.addEventListener("change", function (e) {
        t.onChange(o.value);
      });
      o.addEventListener("keydown", function (e) {
        if (!(e.isComposing || (e.key !== "Enter" && e.key !== "Escape"))) {
          e.preventDefault();
          t.blur();
        }
      });
      var a = new vT(t.app, o).onSelect(function (e) {
        o.value = e.item.path;
        t.onChange(o.value);
      });
      a.suggestEl.addClass("mod-property-value");
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.inputEl.focus();
    };
    t.prototype.setValue = function (value) {
      value === null && (value = "");
      this.inputEl.value = value;
    };
    return t;
  })(iD),
  dD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "folder";
      var o = (r.inputEl = n.createEl("input", {
        cls: "metadata-input metadata-input-text",
        type: "text",
        placeholder: i18nProxy.properties.labelNoValue(),
        value: i != null ? i : "",
      }));
      o.addEventListener("change", function (e) {
        t.onChange(o.value);
      });
      o.addEventListener("keydown", function (e) {
        if (!(e.isComposing || (e.key !== "Enter" && e.key !== "Escape"))) {
          e.preventDefault();
          t.blur();
        }
      });
      var a = new mT(t.app, o, !1, !0).onSelect(function (e) {
        o.value = e.item.path;
        t.onChange(o.value);
      });
      a.suggestEl.addClass("mod-property-value");
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.inputEl.focus();
    };
    t.prototype.setValue = function (value) {
      value === null && (value = "");
      this.inputEl.value = value;
    };
    return t;
  })(iD),
  fD = (function (e) {
    function t(t, n, checked) {
      var r = e.call(this, n) || this;
      r.type = "checkbox";
      var o = (r.checkboxEl = n.createEl("input", {
        type: "checkbox",
        cls: "metadata-input-checkbox",
      }));
      o.checked = checked;
      o.setAttr("data-indeterminate", checked == null);
      o.addEventListener("keydown", function (e) {
        if (!(e.isComposing || (e.key !== "Enter" && e.key !== "Escape"))) {
          e.preventDefault();
          t.blur();
        }
      });
      o.addEventListener("change", function (e) {
        t.onChange(o.checked);
        o.setAttr("data-indeterminate", !1);
      });
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.checkboxEl.focus();
    };
    t.prototype.setValue = function (checked) {
      if (checked === null) {
        this.checkboxEl.checked = false;
        return void this.checkboxEl.setAttr("data-indeterminate", !0);
      }
      this.checkboxEl.checked = checked;
    };
    return t;
  })(iD),
  mD = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.getItems = function () {
      var e = this;
      return Object.values(this.app.metadataTypeManager.getAllProperties()).map(function (t) {
        return {
          value: t.name,
          icon: e.app.metadataTypeManager.getWidget(t.widget).icon,
        };
      });
    };
    return t;
  })(XT),
  gD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "property";
      r.combobox = new mD(t.app, n)
        .setPlaceholder(i18nProxy.plugins.bases.labelPropertyKey())
        .onSelect(function (e) {
          return t.onChange(e == null ? undefined : e.value);
        })
        .setValueById(i);
      return r;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.combobox.focus();
    };
    t.prototype.setValue = function (e) {
      this.combobox.setValueById(e);
    };
    return t;
  })(iD),
  property = {
    name: i18nProxy.properties.types.optionPropertyName,
    type: "property",
    icon: "lucide-info",
    reservedKeys: [],
    validate: function (e) {
      return typeof e == "string";
    },
    render: function (e, t, n) {
      return new gD(n, e, t);
    },
  },
  aliases = {
    name: i18nProxy.properties.types.optionAliases,
    type: "aliases",
    icon: "lucide-forward",
    reservedKeys: ["aliases"],
    validate: function (e) {
      return typeof e == "string" || uc(e, !0);
    },
    render: function (e, t, n) {
      return new lD(n, e, $T(t));
    },
  },
  tagsbD0 = {
    name: i18nProxy.properties.types.optionTags,
    type: "tags",
    icon: "lucide-tags",
    reservedKeys: ["tags"],
    validate: function (e) {
      return typeof e == "string" || uc(e, !0);
    },
    render: function (e, t, n) {
      return new sD(n, e, $T(t));
    },
  },
  folder = {
    name: i18nProxy.properties.types.optionFolder,
    type: "folder",
    icon: "lucide-folder",
    reservedKeys: [],
    validate: function (e) {
      return typeof e == "string";
    },
    render: function (e, t, n) {
      return new dD(n, e, t);
    },
  },
  file = {
    name: i18nProxy.properties.types.optionFile,
    type: "file",
    icon: "lucide-file",
    reservedKeys: [],
    validate: function (e) {
      return typeof e == "string";
    },
    render: function (e, t, n) {
      return new pD(n, e, t);
    },
  },
  date = {
    name: i18nProxy.properties.types.optionDate,
    type: "date",
    icon: "lucide-calendar",
    validate: function (e) {
      return !e || window.moment(e, TM).isValid();
    },
    render: function (e, t, n) {
      return new uD(n, e, t);
    },
  },
  datetime = {
    name: i18nProxy.properties.types.optionDatetime,
    type: "datetime",
    icon: "lucide-clock",
    validate: function (e) {
      return !e || window.moment(e, DM).isValid();
    },
    render: function (e, t, n) {
      return new hD(n, e, t);
    },
  },
  SD = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, n) || this;
      r.type = "number";
      var o = (r.inputEl = n.createEl("input", {
          cls: "metadata-input metadata-input-number",
          type: "number",
          placeholder: i18nProxy.properties.labelNoValue(),
          value: Number.isNaN(i) ? "" : "" + i,
          attr: {
            inputmode: "decimal",
            step: "any",
          },
        })),
        a = function (e) {
          var n = null;
          e && ((n = +o.value), Number.isNaN(n)) ? r.showError() : t.onChange(n);
        };
      o.addEventListener("keydown", function (e) {
        if (!e.isComposing) {
          e.key === "Enter"
            ? (e.preventDefault(), o.validity.valid ? (a(o.value), t.blur()) : r.showError())
            : e.key === "Escape" && (e.preventDefault(), (o.value = i ? String(i) : ""), t.blur());
        }
      });
      o.addEventListener("blur", function (e) {
        if (!e.defaultPrevented) {
          o.validity.valid ? a(o.value) : (o.value = i ? String(i) : "");
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.showError = function () {
      displayTooltip(this.inputEl, i18nProxy.properties.msgInvalidNumber(), {
        classes: ["mod-error"],
      });
    };
    t.prototype.onFocus = function () {
      this.inputEl.focus();
    };
    t.prototype.setValue = function (e) {
      this.inputEl.value = e === null ? "" : String(e);
    };
    return t;
  })(iD),
  number = {
    name: i18nProxy.properties.types.optionNumber,
    type: "number",
    icon: "lucide-binary",
    validate: function (e) {
      return Number.isNumber(e);
    },
    render: function (e, t, n) {
      return new SD(n, e, t);
    },
  },
  checkbox = {
    name: i18nProxy.properties.types.optionCheckbox,
    type: "checkbox",
    icon: "lucide-check-square",
    validate: function (e) {
      return typeof e == "boolean";
    },
    render: function (e, t, n) {
      return new fD(n, e, t);
    },
  },
  TD = (function (e) {
    function t(context, inputEl, onSelectLink, suggestionFilter) {
      var o = e.call(this, context.app, inputEl) || this;
      o.context = context;
      o.inputEl = inputEl;
      o.onSelectLink = onSelectLink;
      o.suggestionFilter = suggestionFilter;
      o.instructionsEl = createDiv("prompt-instructions");
      o.sourcePath = context.sourcePath;
      o.manager = new sT(context.app, function () {
        return context.sourcePath;
      });
      o.suggestEl.addClass("mod-property-value");
      o.suggestEl.setAttr("data-property-key", context.key);
      o.scope.register(["Shift"], "Enter", function (e) {
        o.selectSuggestion(null, e);
        return !1;
      });
      o.scope.register([], "Tab", function (e) {
        if (!e.isComposing && o.suggestions.useSelectedItem(e)) return !1;
      });
      o.scope.register(null, "#", function (e) {
        if (o.inputEl.getText().startsWith("[["))
          return (
            ((o.manager.mode !== "file" && o.manager.mode !== "heading") || !o.suggestions.useSelectedItem(e)) &&
            undefined
          );
      });
      o.scope.register(null, "^", function (e) {
        if (o.manager.mode === "file" && o.suggestions.useSelectedItem(e)) return !1;
      });
      return o;
    }
    __extends(t, e);
    t.prototype.updateInstructions = function (e) {
      e && Ix(this.instructionsEl, this.manager.getInstructions());
      Ix(this.instructionsEl, [
        {
          command: i18nProxy.properties.valueSuggestion.keyLinkNote(),
          purpose: i18nProxy.properties.valueSuggestion.instructionLinkNote(),
        },
        {
          command: "esc",
          purpose: i18nProxy.properties.valueSuggestion.instructionDismiss(),
        },
      ]);
    };
    t.prototype.showSuggestions = function (t) {
      if ((e.prototype.showSuggestions.call(this, t), this.context)) {
        var n = this.inputEl.getText();
        (n === "[[" || n.startsWith("[[^") || n.startsWith("#")) && this.suggestions.forceSetSelectedItem(-1, null);
        this.updateInstructions(n.startsWith("[["));
      }
    };
    t.prototype.selectSuggestion = function (e, t) {
      var textContent,
        i = true,
        r = null;
      if (e == null) {
        if ((textContent = this.getValue()).startsWith("[[") && !textContent.endsWith("]]")) {
          textContent += "]]";
        }
      } else if (e.type === "text") textContent = e.text;
      else {
        var o = t.instanceOf(KeyboardEvent) ? getKeyName(t) : "";
        i = !o || o === "Enter";
        var a = this.inputEl.getText(),
          s = this.inputEl.win.getSelection().getRangeAt(0),
          l = a.substring(2, s.startOffset),
          c = aT(this.app, e, l, a, 0, s.startOffset, this.sourcePath, o, "frontmatter");
        if (e.type === "block" && c.blockId) {
          var u = db(e, c.blockId),
            h = u.blockEnd,
            p = u.addition,
            d = e.content,
            f = e.file;
          d = d.slice(0, h) + p + d.slice(h);
          this.app.vault.modify(f, d);
        }
        textContent = c.replacement;
        r = {
          from: c.selectionStart,
          to: c.selectionEnd,
        };
      }
      i
        ? (this.close(), this.onSelectLink(textContent, t))
        : ((this.inputEl.textContent = textContent),
          focusAndSelectRange(this.inputEl, r),
          this.inputEl.trigger("input"));
    };
    t.prototype.renderSuggestion = function (e, t) {
      if (e.type === "text") {
        if (e.text.startsWith("[[") && e.text.endsWith("]]")) {
          t.addClass("mod-complex");
          var n = t.createDiv("suggestion-content"),
            i = t.createDiv("suggestion-aux"),
            r = n.createDiv("suggestion-title"),
            o = n.createDiv("suggestion-note"),
            a = parseAliasLink(e.text.slice(2, -2)),
            s = a.title,
            l = a.href,
            c = a.isAlias;
          c && o.setText(l);
          i.createSpan(
            {
              cls: "suggestion-flair",
            },
            function (e) {
              c
                ? (setIcon(e, "lucide-forward"), setTooltip(e, i18nProxy.interface.tooltip.alias()))
                : setIcon(e, "lucide-link");
            },
          );
          jx(e.matches, -2);
          renderResults(r, s, e);
        } else {
          t.addClass("mod-nowrap");
          renderResults(t, e.text, e);
        }
      } else oT(e, t, this.manager.global);
    };
    t.prototype.getSuggestions = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return e.startsWith("[[")
                ? ((n = this.manager.runnable) && n.cancel(),
                  (n = this.manager.runnable = new ax()),
                  (i = undefined),
                  (r = this.inputEl.win.getSelection()) && r.rangeCount > 0 && (i = r.getRangeAt(0).startOffset),
                  (e = e.slice(2, i)),
                  [4, this.manager.getSuggestionsAsync(n, e)])
                : [3, 2];
            case 1:
              return !(t = o.sent()) || n.isCancelled() ? [2, []] : (t.length === 0 && (t = [tT]), t.sort(eT), [3, 3]);
            case 2:
              t = (function (e, t, n) {
                n = n.toLowerCase();
                for (
                  var i = [], r = [n], o = e.metadataCache.getFrontmatterPropertyValuesForKey(t), a = 0, s = o;
                  a < s.length;
                  a++
                ) {
                  var textl0 = s[a];
                  if (n === "")
                    i.push({
                      type: "text",
                      text: textl0,
                      score: 0,
                      matches: null,
                    });
                  else {
                    var matches = Gx(r, textl0.toLowerCase());
                    if (matches) {
                      i.push({
                        type: "text",
                        text: textl0,
                        score: qx(matches, n.length, textl0.length, 0),
                        matches: matches,
                      });
                    }
                  }
                }
                i.sort(function (e, t) {
                  return t.score - e.score;
                });
                return i;
              })(this.app, this.context.key, e);
              o.label = 3;
            case 3:
              return this.suggestionFilter ? [2, t.filter(this.suggestionFilter)] : [2, t];
          }
        });
      });
    };
    return t;
  })(AbstractInputSuggest);
var DD = (function (e) {
    function t(t, n, properties) {
      var r = e.call(this, t, n) || this;
      r.properties = properties;
      r.suggestEl.addClass("mod-property-key");
      r.scope.register(["Shift"], "Enter", function (e) {
        r.selectSuggestion(
          {
            type: "text",
            text: r.getValue(),
            widget: "text",
            score: 0,
            matches: null,
          },
          e,
        );
        return !1;
      });
      return r;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      t.addClass("mod-complex");
      var n = t.createDiv("suggestion-icon");
      renderResults(t.createDiv("suggestion-content").createDiv("suggestion-title"), e.text, e);
      var i = this.app.metadataTypeManager.getWidget(e.widget);
      n.createSpan(
        {
          cls: "suggestion-flair",
        },
        function (e) {
          setIcon(e, i.icon);
        },
      );
    };
    t.prototype.getSuggestions = function (e) {
      for (
        var t = new Set(
            this.properties.map(function (e) {
              return e.key.toLowerCase();
            }),
          ),
          n = this.app.metadataTypeManager.getAllProperties(),
          i = Object.entries(n)
            .filter(function (e) {
              var n = e[0];
              e[1];
              return !t.has(n);
            })
            .map(function (e) {
              e[0];
              return e[1].name;
            }),
          r = [],
          o = [(e = e.toLowerCase())],
          a = 0,
          s = i;
        a < s.length;
        a++
      ) {
        var textl0 = s[a],
          widget = this.app.metadataTypeManager.getTypeInfo(textl0).inferred.type;
        if (e === "")
          r.push({
            type: "text",
            text: textl0,
            widget: widget,
            score: 0,
            matches: null,
          });
        else {
          var matches = Gx(o, textl0.toLowerCase());
          if (matches) {
            r.push({
              type: "text",
              text: textl0,
              widget: widget,
              score: qx(matches, e.length, textl0.length, 0),
              matches: matches,
            });
          }
        }
      }
      r.sort(function (e, t) {
        return t.score - e.score;
      });
      return r;
    };
    return t;
  })(AbstractInputSuggest),
  multitext = {
    name: i18nProxy.properties.types.optionMultitext,
    type: "multitext",
    icon: "lucide-list",
    validate: function (e) {
      return typeof e == "string" || uc(e, !0);
    },
    render: function (e, t, n) {
      return new aD(n, e, $T(t));
    },
  },
  PD = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.type = "unknown";
      i.el = t.createSpan({
        cls: "metadata-property-value-item mod-unknown",
        text: JSON.stringify(n),
        attr: {
          tabindex: 0,
        },
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onFocus = function () {
      this.el.focus();
    };
    t.prototype.setValue = function (e) {
      this.el.setText(JSON.stringify(e));
    };
    return t;
  })(iD),
  LD = {
    name: i18nProxy.properties.types.optionUnknown,
    type: "unknown",
    icon: "lucide-file-question",
    validate: function (e) {
      return !0;
    },
    render: function (e, t, n) {
      return new PD(e, t);
    },
  },
  ID = (function (e) {
    function t(t, n, suggestionFilter) {
      var r = e.call(this, t, n) || this;
      r.suggestionFilter = suggestionFilter;
      r.suggestEl.addClass("mod-property-value");
      r.scope.register([], "Tab", function (e) {
        if (!e.isComposing) {
          var t = r.suggestions,
            i = t.values[t.selectedItem];
          if (i) {
            var o = $x(i.tag, i.matches);
            n.setText(o);
            focusAndSelectRange(n, {
              from: o.length,
            });
            n.trigger("input");
          }
          return !1;
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getSuggestions = function (e) {
      return pT(this.app.metadataCache, e, e.startsWith("#")).filter(this.suggestionFilter);
    };
    t.prototype.renderSuggestion = function (e, t) {
      renderMatches(t, e.tag, e.matches);
    };
    return t;
  })(AbstractInputSuggest),
  OD = (function (e) {
    function t(t, line) {
      var i = e.call(this, t) || this;
      i.line = line;
      var r = line.typeInfo,
        o = r.inferred,
        type = r.expected.type,
        oldType = o.type;
      i.setTitle(
        i18nProxy.properties.labelChangePropertyType({
          type: type,
        }),
      );
      i.contentEl.createEl("p", {
        text: i18nProxy.properties.labelChangePropertyTypeDesc({
          oldType: oldType,
        }),
      });
      i.addButton("mod-cta", i18nProxy.dialogue.buttonUpdate(), function (e) {
        i.onSubmit(e);
      });
      i.addCancelButton();
      i.scope.register([], "Enter", i.onSubmit.bind(i));
      return i;
    }
    __extends(t, e);
    t.prototype.onSubmit = function (e) {
      e.preventDefault();
      this.close();
      this.shouldRestoreSelection = false;
      this.line.renderProperty(this.line.entry, !0, !0);
      this.line.focusValue();
    };
    return t;
  })(GM);
var KI = Decoration.line({
    attributes: {
      class: "cm-active",
    },
  }),
  YI = ViewPlugin.fromClass(
    (function () {
      function e(e) {
        this.decorations = this.getDeco(e);
      }
      e.prototype.update = function (e) {
        if (e.docChanged || e.selectionSet) {
          this.decorations = this.getDeco(e.view);
        }
      };
      e.prototype.getDeco = function (e) {
        for (var t = -1, n = [], i = 0, r = e.state.selection.ranges; i < r.length; i++) {
          var o = r[i],
            a = e.lineBlockAt(o.head);
          if (a.from > t) {
            n.push(KI.range(a.from));
            t = a.from;
          }
        }
        return Decoration.set(n);
      };
      return e;
    })(),
    {
      decorations: function (e) {
        return e.decorations;
      },
    },
  ),
  ZI = new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.elementClass = "cm-active";
      return t;
    }
    __extends(t, e);
    return t;
  })(GutterMarker))(),
  XI = gutterLineClass.compute(["selection"], function (e) {
    for (var t = [], n = -1, i = 0, r = e.selection.ranges; i < r.length; i++) {
      var o = r[i],
        a = e.doc.lineAt(o.head).from;
      if (a > n) {
        n = a;
        t.push(ZI.range(a));
      }
    }
    return RangeSet.of(t);
  }),
  QI = {
    brackets: ["(", "[", "{", "'", '"'],
    before: ")]}'\":;>",
  },
  $I = StateEffect.define({
    map: function (e, t) {
      var n = t.mapPos(e, -1, MapMode.TrackAfter);
      return n == null ? undefined : n;
    },
  }),
  JI = StateEffect.define({
    map: function (e, t) {
      return t.mapPos(e);
    },
  }),
  eO = new ((function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    return t;
  })(RangeValue))();
eO.startSide = 1;
eO.endSide = -1;
var tO = StateField.define({
  create: function () {
    return RangeSet.empty;
  },
  update: function (e, t) {
    if (t.selection) {
      var n = t.state.doc.lineAt(t.selection.main.head).from,
        i = t.startState.doc.lineAt(t.startState.selection.main.head).from;
      if (n != t.changes.mapPos(i, -1)) {
        e = RangeSet.empty;
      }
    }
    e = e.map(t.changes);
    for (
      var r = function (t) {
          t.is($I)
            ? (e = e.update({
                add: [eO.range(t.value, t.value + 1)],
              }))
            : t.is(JI) &&
              (e = e.update({
                filter: function (e) {
                  return e != t.value;
                },
              }));
        },
        o = 0,
        a = t.effects;
      o < a.length;
      o++
    ) {
      r(a[o]);
    }
    return e;
  },
});
var nO = "()[]{}<>";
function iO(e) {
  for (var t = 0; t < 8; t += 2) if (nO.charCodeAt(t) == e) return nO.charAt(t + 1);
  return fromCodePoint(e < 128 ? e : e + 1);
}
function rO(e, t) {
  return e.languageDataAt("closeBrackets", t)[0] || QI;
}
var oO = typeof navigator == "object" && /Android\b/.test(navigator.userAgent),
  aO = EditorView.inputHandler.of(function (e, t, n, i) {
    if ((oO ? e.composing : e.compositionStarted) || e.state.readOnly) return !1;
    var r = e.state.selection.main;
    if (i.length > 2 || (i.length == 2 && codePointSize(codePointAt(i, 0)) == 1) || t != r.from || n != r.to) return !1;
    var o = (function (e, t) {
      for (var n = rO(e, e.selection.main.head), i = n.brackets || QI.brackets, r = 0, o = i; r < o.length; r++) {
        var a = o[r],
          s = iO(codePointAt(a, 0));
        if (t == a) return s == a ? mO(e, a, i.indexOf(a + a + a) > -1) : hO(e, a, s, n.before || QI.before);
        if (t == s && lO(e, e.selection.main.from)) return pO(e, a, s);
      }
      return null;
    })(e.state, i);
    return !!o && (e.dispatch(o), !0);
  }),
  sO = [
    {
      key: "Backspace",
      run: function (e) {
        var t = e.state,
          n = e.dispatch;
        if (t.readOnly) return !1;
        var i = rO(t, t.selection.main.head).brackets || QI.brackets,
          r = null,
          o = t.changeByRange(function (e) {
            if (e.empty)
              for (
                var n = (function (e, t) {
                    var n = e.sliceString(t - 2, t);
                    return codePointSize(codePointAt(n, 0)) == n.length ? n : n.slice(1);
                  })(t.doc, e.head),
                  o = 0,
                  a = i;
                o < a.length;
                o++
              ) {
                var s = a[o];
                if (s == n && cO(t.doc, e.head) == iO(codePointAt(s, 0)))
                  return {
                    changes: {
                      from: e.head - s.length,
                      to: e.head + s.length,
                    },
                    range: EditorSelection.cursor(e.head - s.length),
                    userEvent: "delete.backward",
                  };
              }
            return {
              range: (r = e),
            };
          });
        r ||
          n(
            t.update(o, {
              scrollIntoView: !0,
            }),
          );
        return !r;
      },
    },
  ];
function lO(e, t) {
  var n = false;
  e.field(tO).between(0, e.doc.length, function (e) {
    if (e == t) {
      n = true;
    }
  });
  return n;
}
function cO(e, t) {
  var n = e.sliceString(t, t + 2);
  return n.slice(0, codePointSize(codePointAt(n, 0)));
}
function uO(e, t) {
  var n = e.doc.lineAt(t.head),
    i = e.doc.lineAt(t.anchor);
  return n.number !== i.number;
}
function hO(e, insert, insertn0, i) {
  var r = null,
    o = e.changeByRange(function (o) {
      if (!o.empty)
        return uO(e, o)
          ? {
              changes: [
                {
                  insert: insert + insertn0,
                  from: o.from,
                  to: o.to,
                },
              ],
              effects: $I.of(o.from + insert.length),
              range: EditorSelection.range(o.anchor + insert.length, o.anchor + insert.length),
            }
          : {
              changes: [
                {
                  insert: insert,
                  from: o.from,
                },
                {
                  insert: insertn0,
                  from: o.to,
                },
              ],
              effects: $I.of(o.to + insert.length),
              range: EditorSelection.range(o.anchor + insert.length, o.head + insert.length),
            };
      var a = cO(e.doc, o.head);
      return !a || /\s/.test(a) || i.indexOf(a) > -1
        ? {
            changes: {
              insert: insert + insertn0,
              from: o.head,
            },
            effects: $I.of(o.head + insert.length),
            range: EditorSelection.cursor(o.head + insert.length),
          }
        : {
            range: (r = o),
          };
    });
  return r
    ? null
    : e.update(o, {
        scrollIntoView: true,
        userEvent: "input.type",
      });
}
function pO(e, t, n) {
  var i = null,
    r = e.selection.ranges.map(function (t) {
      return t.empty && cO(e.doc, t.head) == n ? EditorSelection.cursor(t.head + n.length) : (i = t);
    });
  return i
    ? null
    : e.update({
        selection: EditorSelection.create(r, e.selection.mainIndex),
        scrollIntoView: true,
        effects: e.selection.ranges.map(function (e) {
          var t = e.from;
          return JI.of(t);
        }),
      });
}
var dO = ["%", "`"];
function fO(e, t) {
  var n,
    i,
    r = e.lineAt(t).text.match(Ab);
  if (r) {
    var o = (n = r[1]) !== null && undefined !== n ? n : "",
      a = (i = r[3]) !== null && undefined !== i ? i : "";
    return o + " ".repeat(a.length);
  }
  return "";
}
function mO(e, t, n) {
  var i = null,
    r = e.changeByRange(function (r) {
      if (!r.empty) {
        var insert = t,
          inserta0 = t;
        if (n && r.from >= 2 && e.doc.sliceString(r.from - 2, r.from) === t + t) {
          var s = fO(e.doc, r.from);
          e.doc.sliceString(r.from, r.from + 1) !== "\n" && (insert = t + "\n" + s);
          e.doc.sliceString(r.to - 1, r.to) !== "\n" && (inserta0 = "\n" + s + t);
        } else if (!dO.contains(t) && uO(e, r))
          return {
            changes: [
              {
                insert: insert + inserta0,
                from: r.from,
                to: r.to,
              },
            ],
            effects: $I.of(r.from + insert.length),
            range: EditorSelection.range(r.from + insert.length, r.from + insert.length),
          };
        return {
          changes: [
            {
              insert: insert,
              from: r.from,
            },
            {
              insert: inserta0,
              from: r.to,
            },
          ],
          effects: $I.of(r.to + insert.length),
          range: EditorSelection.range(r.anchor + insert.length, r.head + insert.length),
        };
      }
      var from = r.head,
        c = cO(e.doc, from);
      if (c == t) {
        if (gO(e, from))
          return {
            changes: {
              insert: t + t,
              from: from,
            },
            effects: $I.of(from + t.length),
            range: EditorSelection.cursor(from + t.length),
          };
        if (lO(e, from)) {
          var u = n && e.sliceDoc(from, from + 3 * t.length) == t + t + t;
          return {
            range: EditorSelection.cursor(from + t.length * (u ? 3 : 1)),
            effects: JI.of(from),
          };
        }
      } else {
        if (n && e.sliceDoc(from - 2 * t.length, from) == t + t && gO(e, from - 2 * t.length))
          return {
            changes: {
              insert: t + "\n" + fO(e.doc, r.from) + t + t + t,
              from: from,
            },
            effects: $I.of(from + t.length),
            range: EditorSelection.cursor(from + t.length),
          };
        if (e.charCategorizer(from)(c) == CharCategory.Space) {
          var h = e.sliceDoc(from - 1, from);
          if (h != t && e.charCategorizer(from)(h) == CharCategory.Space)
            return {
              changes: {
                insert: t + t,
                from: from,
              },
              effects: $I.of(from + t.length),
              range: EditorSelection.cursor(from + t.length),
            };
        }
      }
      return {
        range: (i = r),
      };
    });
  return i
    ? null
    : e.update(r, {
        scrollIntoView: true,
        userEvent: "input.type",
      });
}
function gO(e, t) {
  var n = syntaxTree(e).resolveInner(t + 1);
  return n.parent && n.from == t;
}
var vO = Facet.define({
  combine: function (e) {
    return combineConfig(
      e,
      {
        cursorBlinkRate: 1200,
        drawRangeCursor: !0,
      },
      {
        cursorBlinkRate: function (e, t) {
          return Math.min(e, t);
        },
        drawRangeCursor: function (e, t) {
          return e || t;
        },
      },
    );
  },
});
function yO(e) {
  return e.startState.facet(vO) != e.startState.facet(vO);
}
var bO = layer({
  above: true,
  markers: function (e) {
    for (var t = e.state, n = t.facet(vO), i = [], r = 0, o = t.selection.ranges; r < o.length; r++) {
      var a = o[r],
        s = a == t.selection.main;
      if (a.empty ? !s : n.drawRangeCursor)
        for (
          var l = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary",
            c = a.empty ? a : EditorSelection.cursor(a.head, a.head > a.anchor ? -1 : 1),
            u = 0,
            h = RectangleMarker.forRange(e, l, c);
          u < h.length;
          u++
        ) {
          var p = h[u];
          i.push(p);
        }
    }
    return i;
  },
  update: function (e, t) {
    if (
      e.transactions.some(function (e) {
        return e.scrollIntoView;
      })
    ) {
      t.style.animationName = t.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink";
    }
    var n = yO(e);
    n && wO(e.state, t);
    return e.docChanged || e.selectionSet || n;
  },
  mount: function (e, t) {
    wO(t.state, e);
  },
  class: "cm-cursorLayer",
});
function wO(e, t) {
  t.style.animationDuration = e.facet(vO).cursorBlinkRate + "ms";
}
var kO = layer({
  above: false,
  markers: function (e) {
    return e.state.selection.ranges
      .filter(function (t) {
        return t !== e.state.selection.main;
      })
      .map(function (t) {
        return t.empty ? [] : RectangleMarker.forRange(e, "cm-selectionBackground", t);
      })
      .reduce(function (e, t) {
        return e.concat(t);
      }, []);
  },
  update: function (e, t) {
    return e.docChanged || e.selectionSet || e.viewportChanged || yO(e);
  },
  class: "cm-selectionLayer",
});
function CO(e, t) {
  e.toggleClass("is-collapsed", t);
  var n = e.find(".collapse-icon");
  if (n) {
    n.toggleClass("is-collapsed", t);
  }
}
function EO(e, t, n) {
  var i = null;
  e.between(t, n, function (from, t) {
    if (!i || i.from > from) {
      i = {
        from: from,
        to: t,
      };
    }
  });
  return i;
}
var SO = (function (e) {
    function t(folded) {
      var n = e.call(this) || this;
      n.folded = folded;
      return n;
    }
    __extends(t, e);
    t.prototype.eq = function (e) {
      return e.folded == this.folded;
    };
    t.prototype.toDOM = function (e) {
      var t = createDiv("cm-fold-indicator");
      t.appendText("​");
      var n = t.createDiv("collapse-indicator collapse-icon");
      CO(t, this.folded);
      setIcon(n, "right-triangle");
      t.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
      t.addEventListener("click", function (n) {
        var i = e.posAtDOM(t),
          r = e.state.doc.lineAt(i),
          o = EO(foldedRanges(e.state), r.from, r.to);
        if (o) {
          e.dispatch({
            effects: unfoldEffect.of(o),
          });
          return void n.preventDefault();
        }
        var a = foldable(e.state, r.from, r.to);
        return a
          ? (e.dispatch({
              effects: foldEffect.of(a),
            }),
            void n.preventDefault())
          : undefined;
      });
      return t;
    };
    return t;
  })(WidgetType),
  MO = Decoration.widget({
    widget: new SO(!0),
  }),
  xO = Decoration.widget({
    widget: new SO(!1),
  }),
  TO = (function () {
    function e(e) {
      this.decorations = Decoration.none;
      this.wasComposing = false;
      this.buildDeco(e);
    }
    e.prototype.update = function (e) {
      if (e.view.composing) {
        this.decorations = this.decorations.map(e.changes);
        return void (this.wasComposing = true);
      }
      if (
        e.docChanged ||
        e.viewportChanged ||
        e.startState.facet(language) !== e.state.facet(language) ||
        foldedRanges(e.startState) !== foldedRanges(e.state) ||
        this.wasComposing
      ) {
        this.wasComposing = false;
        this.buildDeco(e.view);
      }
    };
    e.prototype.buildDeco = function (e) {
      for (
        var t = new RangeSetBuilder(), n = foldedRanges(e.state), i = 0, r = e.viewportLineBlocks;
        i < r.length;
        i++
      ) {
        var o = r[i],
          a = null;
        if ((EO(n, o.from, o.to) ? (a = MO) : foldable(e.state, o.from, o.to) && (a = xO), a)) {
          var s = e.state.doc.sliceString(o.from, o.to),
            l = o.from + s.match(/^\s*/)[0].length;
          t.add(l, l, a);
        }
      }
      this.decorations = t.finish();
    };
    return e;
  })(),
  DO = EditorState.transactionFilter.of(function (e) {
    if (e.docChanged && gm(e)) {
      var t = foldedRanges(e.startState).map(e.changes),
        effects = [];
      e.changes.iterChangedRanges(function (e, i, r, o) {
        t.between(e, r, function (from, t) {
          effects.push(
            unfoldEffect.of({
              from: from,
              to: t,
            }),
          );
        });
      });
      return [
        e,
        {
          effects: effects,
          sequential: !0,
        },
      ];
    }
    return e;
  }),
  AO = [
    ViewPlugin.define(
      function (e) {
        return new TO(e);
      },
      {
        decorations: function (e) {
          return e.decorations;
        },
      },
    ),
    EditorView.atomicRanges.of(function (e) {
      return foldedRanges(e.state);
    }),
    DO,
  ],
  PO = Decoration.mark({
    class: "cm-indent",
  }),
  LO = Decoration.mark({
    class: "cm-indent cm-active-indent",
  }),
  IO = Decoration.mark({
    class: "cm-indent-spacing",
  }),
  OO = ViewPlugin.fromClass(
    (function () {
      function e(e) {
        this.decorations = this.getDeco(e);
      }
      e.prototype.update = function (e) {
        if (e.docChanged || e.viewportChanged || e.selectionSet) {
          this.decorations = this.getDeco(e.view);
        }
      };
      e.prototype.getDeco = function (e) {
        var t = new RangeSetBuilder(),
          n = e.state.doc,
          i = /^[\s>]+/,
          r = n.lineAt(e.state.selection.main.from),
          o = "",
          a = "",
          s = r.text.match(Ab);
        if (s && s[0])
          if (((o = s[1]), s[2])) a = " ".repeat(s[2].length);
          else
            for (var l = r.number - 1; l > 0; ) {
              var c = n.line(l),
                u = c.text.match(Ab);
              if (!u || !u[0]) break;
              if (u[2] || u[1] !== o) {
                var h = u[1] || "";
                if (u[2] && o.startsWith(h) && u[0].length <= o.length) {
                  r = c;
                  o = u[1];
                  a = " ".repeat(u[2].length);
                }
                break;
              }
              l--;
            }
        for (var p = r.number + 1; p <= n.lines; ) {
          var d = n.line(p).text;
          if (!d.startsWith(o)) break;
          if (((d = d.substr(o.length)), a)) {
            if (d.startsWith(a)) {
              p++;
              continue;
            }
            a = "";
          }
          if (!/^(\t| {4})/.test(d)) break;
          p++;
        }
        for (var f = 0, m = e.viewportLineBlocks; f < m.length; f++) {
          var g = m[f],
            v = n.lineAt(g.from);
          if ((h = v.text.match(i)))
            for (var y = h[0], b = 0, w = r.number < v.number && v.number < p; b < y.length; ) {
              var k = y.charAt(b),
                C = g.from + b,
                E = false,
                S = w && b === o.length;
              if (k === ">") {
                b++;
                y.charAt(b) === " " && b++;
              } else if (k === "\t") {
                E = true;
                b++;
              } else {
                for (var M = true, x = b + 4, T = b; T < x; T++)
                  if (y.charAt(T) !== " ") {
                    b = T;
                    M = false;
                    break;
                  }
                if (!M) {
                  t.add(C, g.from + b, IO);
                  b++;
                  continue;
                }
                E = true;
                b = x;
              }
              if (E) {
                t.add(C, g.from + b, S ? LO : PO);
              }
            }
        }
        return t.finish();
      };
      return e;
    })(),
    {
      decorations: function (e) {
        return e.decorations;
      },
    },
  );
var FO,
  NO = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.start = -1;
      t.end = -1;
      return t;
    }
    __extends(t, e);
    t.prototype.setPos = function (start, end) {
      this.start = start;
      this.end = end;
    };
    t.prototype.hookClickHandler = function (e, n) {
      this.setOwner(n);
      handleTextSelectionClick(n, function (i) {
        for (var r = i.targetNode, o = e.contentDOM; r && r !== o; ) {
          if (r.instanceOf(HTMLElement) && r.hasClass("cm-editor")) return;
          r = r.parentNode;
        }
        t.selectElement(e, n);
      });
    };
    t.prototype.addEditButton = function (e, n) {
      this.setOwner(n);
      var i = n.createDiv("edit-block-button");
      setIcon(i, "lucide-code-2");
      setTooltip(i, i18nProxy.editor.menu.labelEditBlock());
      i.addEventListener("click", function () {
        t.selectElement(e, n);
      });
    };
    t.prototype.resizeWidget = function (e, t) {
      this.resizeObserver ||
        (this.resizeObserver = new ResizeObserver(function () {
          e.requestMeasure();
        }));
      this.resizeObserver.observe(t, {
        box: "border-box",
      });
    };
    t.prototype.destroy = function () {
      var e;
      if (!((e = this.resizeObserver) === null || undefined === e)) {
        e.disconnect();
      }
    };
    t.prototype.toDOM = function (e) {
      var t = this.containerEl;
      t || (this.containerEl = t = this.initDOM(e));
      return t;
    };
    t.prototype.setOwner = function (e) {
      t.widgetOwner.set(e, this);
    };
    t.selectElement = function (e, n) {
      var i = t.getOwner(n),
        head = i.start,
        anchor = i.end;
      if (head < 0 || anchor < 0)
        !(function (e, t) {
          try {
            var head = t.posAtDOM(e);
            t.dispatch({
              selection: {
                head: head,
                anchor: head,
              },
            });
            t.focus();
          } catch (e) {}
        })(n, e);
      else {
        if (Platform.isMobile) {
          anchor = head;
        }
        try {
          e.focus();
          e.dispatch({
            selection: {
              head: head,
              anchor: anchor,
            },
            scrollIntoView: true,
          });
        } catch (e) {}
      }
    };
    t.getOwner = function (e) {
      return t.widgetOwner.get(e);
    };
    t.widgetOwner = new WeakMap();
    return t;
  })(WidgetType),
  RO = (function (e) {
    function t(app, editor) {
      var i = e.call(this) || this;
      i.children = [];
      i.app = app;
      i.editor = editor;
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "noReuse", {
      get: function () {
        return !0;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.addChild = function (e) {
      this.editor.addChild(e);
      this.children.push(e);
    };
    t.prototype.removeChild = function (e) {
      this.editor.removeChild(e);
      this.children.remove(e);
    };
    return t;
  })(NO);
function BO(modifiers, t) {
  return {
    modifiers: modifiers,
    key: t,
  };
}
function VO(e) {
  return e.startsWith("Key") && e.length === 4 ? e.charAt(3) : e;
}
function HO(e) {
  var t = [];
  modifierPriorityOrder.forEach(function (n) {
    if (e.modifiers.contains(n)) {
      t.push(modifierDisplayMap[n]);
    }
  });
  var n = (e.code ? VO(e.code) : e.key) || "";
  t.push(
    (function (e) {
      if (specialKeyDisplay.hasOwnProperty(e)) return specialKeyDisplay[e];
      var t = e.replace(/([A-Z])/g, " $1").trim();
      return t.charAt(0).toUpperCase() + t.slice(1);
    })(n),
  );
  return t.join(isMacOS ? " " : " + ");
}
var zO = Symbol("customKeys"),
  HotkeyManager = (function () {
    function e(app) {
      this.defaultKeys = {};
      this[FO] = {};
      this.baked = false;
      this.bakedHotkeys = [];
      this.bakedIds = [];
      this.onConfigFileChange = debounce(this.load, 50);
      this.app = app;
      this.app.scope.register(null, null, this.onTrigger.bind(this));
    }
    Object.defineProperty(e.prototype, "customKeys", {
      get: function () {
        return Object.assign({}, this[zO]);
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.registerListeners = function () {
      this.app.vault.on("raw", this.onRaw.bind(this));
    };
    e.prototype.onRaw = function (e) {
      if (e === this.app.vault.configDir + "/hotkeys.json") {
        this.onConfigFileChange();
      }
    };
    e.prototype.save = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.app.vault.writeConfigJson("hotkeys", this[zO])];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.load = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return [4, this.app.vault.readConfigJson("hotkeys")];
            case 1:
              (e = t.sent()) && typeof e == "object" && ((this[zO] = e || {}), (this.baked = false));
              return [2];
          }
        });
      });
    };
    e.prototype.getDefaultHotkeys = function (e) {
      return this.defaultKeys[e];
    };
    e.prototype.addDefaultHotkeys = function (e, t) {
      this.defaultKeys[e] = t;
      this.baked = false;
    };
    e.prototype.removeDefaultHotkeys = function (e) {
      delete this.defaultKeys[e];
      this.baked = false;
    };
    e.prototype.getHotkeys = function (e) {
      return this[zO][e];
    };
    e.prototype.setHotkeys = function (e, t) {
      this[zO][e] = t;
      this.baked = false;
      Platform.isDesktopApp && this.app.appMenuBarManager.requestRender();
    };
    e.prototype.removeHotkeys = function (e) {
      delete this[zO][e];
      this.baked = false;
    };
    e.prototype.printHotkeyForCommand = function (e) {
      var t = this.getHotkeys(e) || this.getDefaultHotkeys(e);
      return t && t.length > 0 ? HO(t[0]) : "";
    };
    e.prototype.bake = function () {
      if (!this.baked) {
        this.baked = true;
        var e = this.defaultKeys,
          t = this[zO],
          bakedHotkeys = [],
          bakedIds = [],
          r = function (e, t) {
            for (var r = 0, o = t; r < o.length; r++) {
              var a = o[r];
              bakedHotkeys.push({
                modifiers: Keymap.compileModifiers(a.modifiers),
                key: a.code ? VO(a.code) : a.key,
              });
              bakedIds.push(e);
            }
          };
        for (var o in t)
          if (t.hasOwnProperty(o)) {
            r(o, t[o]);
          }
        for (var o in e)
          if (e.hasOwnProperty(o) && !t.hasOwnProperty(o)) {
            r(o, e[o]);
          }
        this.bakedHotkeys = bakedHotkeys;
        this.bakedIds = bakedIds;
      }
    };
    e.prototype.onTrigger = function (e, t) {
      this.bake();
      for (var n = this.bakedHotkeys, i = this.bakedIds, r = 0; r < n.length; r++) {
        var o = n[r];
        if (Keymap.isMatch(o, t)) {
          var a = i[r],
            s = this.app.commands.findCommand(a);
          if (s && (!e.repeat || s.repeatable)) if (this.app.commands.executeCommand(s)) return !1;
        }
      }
    };
    return e;
  })();
function WO(e) {
  var t = e.showSearch;
  return t && typeof t == "function";
}
function UO(e, t, n, i) {
  e.addSections([i + "-basic", i + "-advanced", i + "-danger"]);
  e.addItem(function (e) {
    e.setSection(i)
      .setTitle(i18nProxy.interface.formatting.labelFormatting())
      .setIcon("lucide-paintbrush")
      .setSubmenu()
      .addItem(function (e) {
        return e
          .setSection(i + "-basic")
          .setTitle(i18nProxy.interface.formatting.toggleBold())
          .setChecked(n.bold)
          .setIcon("lucide-bold")
          .onClick(function () {
            return t.toggleMarkdownFormatting("bold");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-basic")
          .setTitle(i18nProxy.interface.formatting.toggleItalics())
          .setChecked(n.italic)
          .setIcon("lucide-italic")
          .onClick(function () {
            return t.toggleMarkdownFormatting("italic");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-basic")
          .setTitle(i18nProxy.interface.formatting.toggleStrikethrough())
          .setChecked(n.strikethrough)
          .setIcon("lucide-strikethrough")
          .onClick(function () {
            return t.toggleMarkdownFormatting("strikethrough");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-basic")
          .setTitle(i18nProxy.interface.formatting.toggleHighlight())
          .setChecked(n.highlight)
          .setIcon("lucide-highlighter")
          .onClick(function () {
            return t.toggleMarkdownFormatting("highlight");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-advanced")
          .setTitle(i18nProxy.interface.formatting.toggleCode())
          .setChecked(n.code)
          .setIcon("lucide-code-2")
          .onClick(function () {
            return t.toggleMarkdownFormatting("code");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-advanced")
          .setTitle(i18nProxy.interface.formatting.toggleMath())
          .setChecked(n.math)
          .setIcon("lucide-sigma")
          .onClick(function () {
            return t.toggleMarkdownFormatting("math");
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-advanced")
          .setTitle(i18nProxy.interface.formatting.toggleComments())
          .setChecked(n.comment)
          .setIcon("lucide-percent")
          .onClick(function () {
            return t.toggleComment();
          });
      })
      .addItem(function (e) {
        return e
          .setSection(i + "-danger")
          .setTitle(i18nProxy.interface.formatting.clear())
          .setIcon("lucide-eraser")
          .onClick(function () {
            return t.clearMarkdownFormatting();
          });
      });
  });
}
function _O(e) {
  return String(e).padStart(2, "0");
}
function jO(e) {
  return ""
    .concat(((t = e.getFullYear()), String(t).padStart(4, "0")), "-")
    .concat(_O(e.getMonth() + 1), "-")
    .concat(_O(e.getDate()));
  var t;
}
function GO(e) {
  return "".concat(_O(e.getHours()), ":").concat(_O(e.getMinutes()), ":").concat(_O(e.getSeconds()));
}
function KO(e, t) {
  if (Object.hasOwn(e, t)) return t;
  for (var n = t.toLowerCase(), i = 0, r = Object.keys(e); i < r.length; i++) {
    var o = r[i];
    if (o.toLowerCase() === n) return o;
  }
  return t;
}
FO = zO;
var YO =
    /A-Za-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC/,
  ZO =
    YO.source +
    /0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19/
      .source,
  XO = new RegExp("[".concat(ZO, "]")),
  QO = function (e) {
    if (e.length === 0) return "";
    var t = e.charAt(0),
      n = e.charAt(e.length - 1),
      i = XO.test(t),
      r = XO.test(n);
    return (i ? "(?:^|[^".concat(ZO, "])") : "") + "(".concat(Jl(e), ")") + (r ? "(?![".concat(ZO, "])") : "()");
  };
var $O = function () {},
  JO = (function () {
    function e(strings, original, keys, caseSensitive) {
      this.cache = null;
      this.data = null;
      this.strings = strings;
      this.original = original;
      this.keys = keys;
      this.caseSensitive = caseSensitive;
    }
    e.prototype.clone = function () {
      var t = new e(Object.assign({}, this.strings), this.original, this.keys.slice(), this.caseSensitive);
      t.cache = this.cache;
      this.data && (t.data = new Map(this.data));
      return t;
    };
    e.prototype.cloneForPropertyContent = function (e) {
      var t = this.clone();
      t.keys = ["content"];
      t.strings.content = String(e);
      t.setData(BF, e);
      return t;
    };
    e.prototype.setData = function (e, t) {
      this.data || (this.data = new Map());
      this.data.set(e, t);
    };
    e.prototype.getData = function (e) {
      return this.data ? this.data.get(e) : null;
    };
    e.prototype.deleteData = function (e) {
      if (this.data) {
        this.data.delete(e);
        this.data.size === 0 && (this.data = null);
      }
    };
    return e;
  })(),
  eF = ["filename", "filepath", "content", "propertyName", "tag"];
function tF(e) {
  for (var t = 0, n = 0, i = eF; n < i.length; n++) {
    var r = i[n];
    if (e[r]) {
      t += e[r].length;
    }
  }
  e.properties && (t += e.properties.length);
  return t;
}
function nF(e, t) {
  for (var n, i, r = 0, o = eF; r < o.length; r++) {
    var a = o[r];
    if (t[a]) {
      e[a] = t[a].concat((n = e[a]) !== null && undefined !== n ? n : []);
    }
  }
  if (t.properties) {
    e.properties = t.properties.concat((i = e.properties) !== null && undefined !== i ? i : []);
  }
}
var iF = (function () {
    function e() {
      this.matchedTokens = [];
    }
    e.prototype.eatToken = function (e) {
      var t = e.pos,
        n = e.tokens;
      this.matchedTokens.push(n[t]);
      e.pos++;
    };
    e.prototype.getContext = function (e) {
      for (var t = 0, n = this.matchedTokens; t < n.length; t++) {
        var token = n[t];
        if (e >= token.pos && e <= MF(token))
          return {
            matcherStack: [this],
            token: token,
          };
      }
      return null;
    };
    return e;
  })(),
  rF = (function (e) {
    function t(t) {
      var n = e.call(this) || this;
      n.expected = null;
      t === "TRUE" ? (n.expected = true) : t === "FALSE" && (n.expected = false);
      return n;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t = e.getData(BF);
      return t === this.expected
        ? {
            content: [[0, String(t).length]],
          }
        : null;
    };
    t.prototype.getInfo = function () {
      return !0 === this.expected
        ? i18nProxy.plugins.search.labelMatchTrue()
        : !1 === this.expected
          ? i18nProxy.plugins.search.labelMatchFalse()
          : i18nProxy.plugins.search.labelMatchEmpty();
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    return t;
  })(iF),
  oF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      for (var t = {}, n = 0, i = e.keys; n < i.length; n++) {
        var r = i[n];
        if (e.strings[r]) {
          t[r] = [[0, 0]];
        }
      }
      return t;
    };
    t.prototype.getInfo = function () {
      return "";
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    return t;
  })(iF),
  aF = {},
  sF = {},
  lF = debounce(
    function () {
      aF = {};
      sF = {};
    },
    6e4,
    !0,
  );
function cF(e, t) {
  var n = null,
    i = t ? aF : sF;
  i.hasOwnProperty(e) && (n = i[e]);
  n || (n = i[e] = new RegExp(e, t ? "gm" : "gmi"));
  return n;
}
function uF(e, t, n) {
  var i = [];
  if (!t) return i;
  for (e.lastIndex = 0; ; ) {
    var r = e.exec(t);
    if (!r) break;
    var o = r[0].length;
    if (o !== 0) {
      if (n) {
        if (!r[1] || r[1].length === 0) {
          e.lastIndex++;
          continue;
        }
        o = r[1].length;
      }
      var a = e.lastIndex,
        s = a - o;
      i.push([s, a]);
    } else e.lastIndex++;
  }
  return i;
}
var hF = (function (e) {
    function t(regex) {
      var n = e.call(this) || this;
      n.regex = regex;
      return n;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (this.regex !== "")
        return (function (e, t, n) {
          for (var i = cF(t, e.caseSensitive), r = false, o = {}, a = 0, s = e.keys; a < s.length; a++) {
            var l = s[a],
              c = uF(i, e.strings[l], n);
            if (c.length > 0) {
              o[l] = c;
              r = true;
            }
          }
          return r ? o : null;
        })(e, this.regex, !1);
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchRegex() + "/".concat(this.regex, "/");
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(iF),
  pF = (function (e) {
    function t(key, value) {
      var i = e.call(this) || this;
      i.key = key;
      i.value = value;
      return i;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t;
      if (e.strings.hasOwnProperty("content")) {
        var n = (t = e.cache) === null || undefined === t ? undefined : t.frontmatter;
        if (!n) return null;
        var i = [];
        for (var propertyName in n)
          if (n.hasOwnProperty(propertyName)) {
            var o = e.clone();
            o.keys = ["propertyName"];
            o.strings.propertyName = propertyName;
            this.key.match(o) && i.push(propertyName);
          }
        for (var properties = [], s = 0, l = i; s < l.length; s++) {
          var c = l[s];
          if (this.value !== null) {
            var u = n[c];
            if (Array.isArray(u))
              for (var h = 0; h < u.length; h++) {
                var p = u[h],
                  d = e.cloneForPropertyContent(p);
                if ((v = this.value.match(d)) && v.content)
                  for (var f = 0, m = Nx(v.content); f < m.length; f++) {
                    var g = m[f];
                    properties.push({
                      key: c,
                      subkey: [h],
                      pos: g,
                    });
                  }
              }
            else {
              var v;
              d = e.cloneForPropertyContent(u);
              if ((v = this.value.match(d)) && v.content)
                for (var y = 0, b = v.content; y < b.length; y++) {
                  g = b[y];
                  properties.push({
                    key: c,
                    pos: g,
                  });
                }
            }
          } else
            properties.push({
              key: c,
            });
        }
        return properties.length > 0
          ? {
              properties: properties,
            }
          : null;
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchProperty();
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    t.prototype.getContext = function (t) {
      var n,
        i = this.key.getContext(t) || ((n = this.value) === null || undefined === n ? undefined : n.getContext(t));
      return i ? (i.matcherStack.push(this), i) : e.prototype.getContext.call(this, t);
    };
    return t;
  })(iF),
  dF = (function (e) {
    function t(textt0) {
      var n = e.call(this) || this;
      n.text = textt0;
      n.wholeWordRegex = QO(textt0);
      n.partialMatchRegex = Jl(textt0);
      return n;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (this.text !== "") {
        for (var t = false, n = {}, i = 0, r = e.keys; i < r.length; i++) {
          var o = r[i];
          if (o !== "propertyName") {
            var a = false,
              s = this.partialMatchRegex;
            if (o === "content") {
              a = true;
              s = this.wholeWordRegex;
            }
            var l = uF(cF(s, e.caseSensitive), e.strings[o], a);
            if (l.length > 0) {
              n[o] = l;
              t = true;
            }
          } else if (e.strings[o].toLowerCase() === this.text.toLowerCase()) {
            n[o] = [[0, this.text.length]];
            t = true;
          }
        }
        return t ? n : null;
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchExactText() + '"'.concat(this.text, '"');
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(iF),
  fF = (function (e) {
    function t(textt0) {
      var n = e.call(this, Jl(textt0)) || this;
      n.text = textt0;
      return n;
    }
    __extends(t, e);
    t.prototype.setText = function (texte0) {
      this.text = texte0;
      this.regex = Jl(texte0);
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchText() + '"'.concat(this.text, '"');
    };
    t.prototype.match = function (t) {
      return this.text === "" ? null : e.prototype.match.call(this, t);
    };
    return t;
  })(hF),
  mF = (function (e) {
    function t(matchers) {
      var n = e.call(this) || this;
      n.matchers = [];
      n.matchers = matchers;
      return n;
    }
    __extends(t, e);
    t.prototype.requiredInputs = function () {
      for (var e = {}, t = 0, n = this.matchers; t < n.length; t++) {
        var i = n[t];
        Object.assign(e, i.requiredInputs());
      }
      return e;
    };
    t.prototype.getContext = function (t) {
      for (var n = 0, i = this.matchers; n < i.length; n++) {
        var r = i[n].getContext(t);
        if (r) {
          r.matcherStack.push(this);
          return r;
        }
      }
      var o = e.prototype.getContext.call(this, t);
      o && o.matcherStack.push(this);
      return o;
    };
    return t;
  })(iF),
  gF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      for (var t = undefined, n = 0, i = this.matchers; n < i.length; n++) {
        var r = i[n].match(e);
        if (r === null) return null;
        t ? r && nF(t, r) : (t = r);
      }
      return t;
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchAll();
    };
    return t;
  })(mF),
  vF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      for (var t = undefined, n = 0, i = this.matchers; n < i.length; n++) {
        var r = i[n].match(e);
        t || undefined === r ? r && nF(t, r) : (t = r);
      }
      return t;
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchAny();
    };
    return t;
  })(mF),
  yF = (function (e) {
    function t(matcher) {
      var n = e.call(this) || this;
      n.matcher = matcher;
      return n;
    }
    __extends(t, e);
    t.prototype.requiredInputs = function () {
      return this.matcher.requiredInputs();
    };
    t.prototype.getContext = function (t) {
      var n = this.matcher.getContext(t);
      return n ? (n.matcherStack.push(this), n) : e.prototype.getContext.call(this, t);
    };
    return t;
  })(iF),
  bF = (function (e) {
    function t(type, n) {
      var i = e.call(this) || this;
      if (((i.type = type), n instanceof fF)) i.text = n.text;
      else {
        if (!(n instanceof dF))
          throw new Error("".concat(type, " operator cannot be applied to matcher ").concat(n.getInfo()));
        i.text = n.text;
      }
      return i;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t = e.getData(BF);
      return t != null &&
        ((this.type === "lessthan" && t < this.text) || (this.type === "greaterthan" && t > this.text))
        ? {
            content: [[0, String(t).length]],
          }
        : null;
    };
    t.prototype.getInfo = function () {
      return this.type === "lessthan"
        ? i18nProxy.plugins.search.labelMatchLessThan() + this.text
        : i18nProxy.plugins.search.labelMatchGreaterThan() + this.text;
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    return t;
  })(iF),
  wF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t = this.matcher.match(e);
      if (undefined !== t) return t ? null : {};
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelExcluding();
    };
    return t;
  })(yF);
function kF(tokens, operators) {
  return CF({
    tokens: tokens,
    pos: 0,
    operatorStack: [],
    operators: operators,
  });
}
function CF(e) {
  for (var t = [], matchedTokens = []; e.pos < e.tokens.length; ) {
    var i = EF(e);
    if (i && (t.push(i), e.pos < e.tokens.length)) {
      var r = e.tokens[e.pos];
      if (r.type === "or") {
        matchedTokens.push(r);
        e.pos++;
        continue;
      }
    }
    break;
  }
  if (t.length === 0) return null;
  if (t.length === 1) return t[0];
  var o = new vF(t);
  o.matchedTokens = matchedTokens;
  return o;
}
function EF(e) {
  for (var t = []; e.pos < e.tokens.length; ) {
    var n = SF(e);
    if (!n) break;
    t.push(n);
  }
  return t.length === 0 ? null : t.length === 1 ? t[0] : new gF(t);
}
function SF(e) {
  var t = e.tokens[e.pos];
  if (!t) return null;
  var n = t.type,
    i = t.content;
  if (
    n === "text" &&
    e.pos < e.tokens.length - 1 &&
    e.tokens[e.pos + 1].type === "colon" &&
    !e.operatorStack.contains("[")
  ) {
    var r = t,
      o = i.toLowerCase(),
      a = e.operators[o];
    if (!a) throw new Error('Operator "'.concat(o, '" not recognized'));
    if (a.exclusive)
      for (var s = 0, l = e.operatorStack; s < l.length; s++) {
        var c = l[s],
          u = e.operators[c];
        if (u.exclusive && (!u.allowSelf || c !== o))
          throw new Error('Operator "'.concat(o, '" cannot be nested within "').concat(c, '"'));
      }
    e.operatorStack.push(o);
    e.pos++;
    var h = e.tokens[e.pos];
    e.pos++;
    var p = SF(e);
    e.operatorStack.pop();
    p || (p = new fF(""));
    (d = a.operate(p)).matchedTokens.push(r);
    d.matchedTokens.push(h);
    return d;
  }
  if (n === "bracket" && i === "[") {
    if (e.operatorStack.contains("[")) throw new Error("Property cannot be nested within a property.");
    e.operatorStack.push(i);
    e.pos++;
    var d = (function (e) {
      var t = CF(e);
      if (!t) {
        t = new fF("");
      }
      var n = null,
        matchedTokens = [];
      if (xF(e, "colon")) {
        var r = e.tokens[e.pos];
        e.operatorStack.push(r.content);
        matchedTokens.push(r);
        e.pos++;
        n = CF(e);
        e.operatorStack.pop();
      }
      var o = new pF(t, n);
      o.matchedTokens = matchedTokens;
      return o;
    })(e);
    d.matchedTokens.push(t);
    e.operatorStack.pop();
    xF(e, "bracket") && d.eatToken(e);
    return d;
  }
  if (n === "bracket" && i === "]") return null;
  if (n === "text") {
    (d = new fF(i)).eatToken(e);
    return d;
  }
  if (n === "quote") {
    (d = new dF(i)).eatToken(e);
    return d;
  }
  if (n === "regex") {
    try {
      new RegExp(i);
    } catch (e) {
      throw (console.error(e), new Error("Failed to parse regular expression. ".concat(e.message)));
    }
    (d = new hF(i)).eatToken(e);
    return d;
  }
  if (n === "parenthesis" && i === "(") {
    e.pos++;
    var d = (function (e) {
      var t = CF(e);
      if (e.pos < e.tokens.length) {
        var n = e.tokens[e.pos],
          i = n.type,
          r = n.content;
        if (i === "parenthesis" && r === ")") {
          t && t.matchedTokens.push(n);
          e.pos++;
        }
      }
      return t;
    })(e);
    d || (d = new fF(""));
    d.matchedTokens.push(t);
    return d;
  }
  if (n === "parenthesis" && i === ")") return null;
  if (n === "or") return null;
  if (n === "false" || n === "true" || n === "empty") {
    (d = new rF(i)).eatToken(e);
    return d;
  }
  if (n === "colon") return null;
  if (n === "not") {
    e.pos++;
    return (p = SF(e)) ? ((d = new wF(p)).matchedTokens.push(t), d) : null;
  }
  if (n === "greaterthan" || n === "lessthan") {
    e.pos++;
    return (p = SF(e)) ? ((d = new bF(n, p)).matchedTokens.push(t), d) : null;
  }
  throw new Error("Failed to parse, error at ".concat(t.pos, ' "').concat(i, '"'));
}
function MF(e) {
  var t = e.pos + e.content.length;
  return e.type === "quote" || e.type === "regex" ? t + 2 : t;
}
function xF(e, t) {
  if (e.pos < e.tokens.length && e.tokens[e.pos].type === t) return !0;
  return !1;
}
function TF(e) {
  for (
    var t = 0,
      n = e.length,
      i = [],
      r = function (content, t) {
        content === "TRUE"
          ? i.push({
              type: "true",
              content: content,
              pos: t,
            })
          : content === "FALSE"
            ? i.push({
                type: "false",
                content: content,
                pos: t,
              })
            : content === "EMPTY"
              ? i.push({
                  type: "empty",
                  content: content,
                  pos: t,
                })
              : content === "OR"
                ? i.push({
                    type: "or",
                    content: content,
                    pos: t,
                  })
                : i.push({
                    type: "text",
                    content: content,
                    pos: t,
                  });
      };
    t < n;
  ) {
    var contento0 = e.charAt(t);
    if (contento0 !== '"') {
      if (contento0 !== "/") {
        if (contento0 !== "-")
          for (var a = t, s = ""; t <= n; ) {
            if (t === n) {
              if (s) {
                r(s, a);
              }
              break;
            }
            content = e.charAt(t);
            if ((t++, content === "[" || content === "]")) {
              s && r(s, a);
              i.push({
                type: "bracket",
                content: content,
                pos: t - 1,
              });
              break;
            }
            if (content === "(" || content === ")") {
              s && r(s, a);
              i.push({
                type: "parenthesis",
                content: content,
                pos: t - 1,
              });
              break;
            }
            if (content === ":") {
              s && r(s, a);
              i.push({
                type: "colon",
                content: content,
                pos: t - 1,
              });
              break;
            }
            if (content === ">") {
              s && r(s, a);
              i.push({
                type: "greaterthan",
                content: content,
                pos: t - 1,
              });
              break;
            }
            if (content === "<") {
              s && r(s, a);
              i.push({
                type: "lessthan",
                content: content,
                pos: t - 1,
              });
              break;
            }
            if (content === " ") {
              if (s) {
                r(s, a);
                a += s.length;
              }
              break;
            }
            s += content;
          }
        else {
          var l = t;
          t++;
          i.push({
            type: "not",
            content: contento0,
            pos: l,
          });
        }
      } else {
        var c = t;
        t++;
        for (var contentu0 = ""; t <= n; ) {
          if (t === n) {
            i.push({
              type: "regex",
              content: contentu0,
              pos: c,
            });
            break;
          }
          var content = e.charAt(t);
          if ((t++, content === "\\" && t < e.length)) {
            var p = e.charAt(t);
            if (p === "/") {
              contentu0 += p;
              t++;
              continue;
            }
            if (p === "\\") {
              contentu0 += "\\\\";
              t++;
              continue;
            }
          }
          if (content === "/") {
            i.push({
              type: "regex",
              content: contentu0,
              pos: c,
            });
            break;
          }
          contentu0 += content;
        }
      }
    } else {
      var d = t;
      t++;
      for (var contentf0 = ""; t <= n; ) {
        if (t === n) {
          i.push({
            type: "quote",
            content: contentf0,
            pos: d,
          });
          break;
        }
        var content = e.charAt(t);
        if ((t++, content === "\\" && t < n)) {
          contentf0 += e.charAt(t);
          t++;
        } else {
          if (content === '"') {
            i.push({
              type: "quote",
              content: contentf0,
              pos: d,
            });
            break;
          }
          contentf0 += content;
        }
      }
    }
  }
  return i;
}
var DF = (function (e) {
    function t(t, caseSensitive) {
      var i = e.call(this, t) || this;
      i.caseSensitive = caseSensitive;
      return i;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t = e.clone();
      t.caseSensitive = this.caseSensitive;
      return this.matcher.match(t);
    };
    t.prototype.getInfo = function () {
      return this.caseSensitive
        ? i18nProxy.plugins.search.labelCaseSensitive()
        : i18nProxy.plugins.search.labelCaseInsensitive();
    };
    return t;
  })(yF),
  AF = "filepath",
  PF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty(AF)) {
        var t = e.clone();
        t.keys = [AF];
        return this.matcher.match(t);
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchFilePath();
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    return t;
  })(yF),
  LF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("filename")) {
        var t = e.clone();
        t.keys = ["filename"];
        return this.matcher.match(t);
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchFileName();
    };
    t.prototype.requiredInputs = function () {
      return {};
    };
    return t;
  })(yF),
  IF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("content")) {
        var t = e.clone();
        t.keys = ["content"];
        return this.matcher.match(t);
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchContent();
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(yF),
  OF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.splitContentMatch = function (e, t) {
      var n = this,
        i = e.clone();
      i.keys = ["content"];
      var r = false,
        o = false,
        content = [];
      t(i, function (content, t) {
        i.strings.content = content;
        var s = n.matcher.match(i);
        if (undefined === s) o = true;
        else if (s) {
          r = true;
          var l = s.content;
          if (l) {
            jx(l, t);
            for (var c = 0, u = l; c < u.length; c++) {
              var h = u[c];
              content.push(h);
            }
          } else content.push([t, t]);
        }
      });
      return r
        ? {
            content: content,
          }
        : o
          ? undefined
          : null;
    };
    return t;
  })(yF),
  FF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("content")) {
        var t = e.strings.content;
        return this.splitContentMatch(e, function (e, n) {
          for (var i = 0, r = 0, o = t.split("\n"); r < o.length; r++) {
            var a = o[r];
            n(a, i);
            i = i + a.length + 1;
          }
        });
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchLine();
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(OF),
  NF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("content")) {
        var t = e.cache;
        if (!t) return null;
        var n = e.strings.content;
        return this.splitContentMatch(e, function (e, i) {
          if (t.sections)
            for (var r = 0, o = t.sections; r < o.length; r++) {
              var a = o[r];
              if (a.type !== "list") {
                var s = (h = a.position).start.offset,
                  l = h.end.offset;
                i(n.substring(s, l), s);
              }
            }
          if (t.listItems)
            for (var c = 0, u = t.listItems; c < u.length; c++) {
              var h;
              s = (h = u[c].position).start.offset;
              l = h.end.offset;
              i(n.substring(s, l), s);
            }
        });
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchBlock();
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(OF),
  RF = new $O(),
  BF = new $O();
var VF = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("content")) {
        var t = e.cache;
        if (!t) return null;
        var n = e.getData(RF),
          i = t.headings;
        if (!i) {
          if (n) return null;
          e.setData(RF, {
            sections: null,
            index: 0,
          });
          var r = this.matcher.match(e);
          e.deleteData(RF);
          return r;
        }
        var sections,
          a,
          s,
          l = e.original,
          c = 0;
        if (n) {
          sections = n.sections;
          var u = n.index,
            h = sections[u];
          if (h.children === 0) return null;
          c = h.start;
          a = n.index + 1;
          s = Math.min(sections.length, a + h.children);
        } else {
          sections = (function (e, t) {
            for (var n = [], i = 0; i < e.length; i++) {
              var r = e[i],
                o = e[i + 1],
                start = r.position.start.offset;
              if (i === 0 && start > 0) {
                n.push({
                  start: 0,
                  end: start,
                  children: 0,
                });
              }
              for (
                var s = o ? o.position.start.offset : t, children = 0, c = i + 1;
                c < e.length && e[c].level > r.level;
                c++
              )
                children++;
              n.push({
                start: start,
                end: s,
                children: children,
              });
            }
            return n;
          })(i, l.length);
          a = 0;
          s = sections.length;
        }
        return this.splitContentMatch(e, function (e, t) {
          for (var index = a; index < s; index++) {
            var i = sections[index],
              r = i.start,
              u = i.end;
            if (!(u <= r)) {
              e.setData(RF, {
                sections: sections,
                index: index,
              });
              t(l.substring(r, u), r - c);
            }
          }
        });
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchSection();
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(OF),
  HF = (function (e) {
    function t(t, completed) {
      var i = this;
      t instanceof dF && t.text === "" && (t = new oF());
      (i = e.call(this, t) || this).completed = completed;
      return i;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      if (e.strings.hasOwnProperty("content")) {
        var t = e.cache;
        if (!t) return null;
        var n = e.strings.content,
          i = this.completed;
        return this.splitContentMatch(e, function (e, r) {
          if (t.listItems)
            for (var o = 0, a = t.listItems; o < a.length; o++) {
              var s = a[o];
              if (undefined !== s.task && (typeof i != "boolean" || i === (s.task !== " "))) {
                var l = s.position,
                  c = l.start.offset,
                  u = l.end.offset;
                r(n.substring(c, u), c);
              }
            }
        });
      }
    };
    t.prototype.getInfo = function () {
      var e = this.completed;
      return !0 === e
        ? i18nProxy.plugins.search.labelMatchTaskDone()
        : !1 === e
          ? i18nProxy.plugins.search.labelMatchTaskTodo()
          : i18nProxy.plugins.search.labelMatchTask();
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    return t;
  })(OF),
  zF = (function (e) {
    function t(matcher) {
      var n = e.call(this) || this;
      matcher.text.charAt(0) !== "#" && matcher.setText("#" + matcher.text);
      n.matcher = matcher;
      return n;
    }
    __extends(t, e);
    t.prototype.match = function (e) {
      var t = new RegExp("^" + this.matcher.regex + "($|\\/)", "gmi");
      if (e.strings.hasOwnProperty("tag") && t.test(e.strings.tag)) return {};
      if (e.strings.hasOwnProperty("content")) {
        var n = e.cache;
        if (!n) return null;
        var properties = undefined,
          content = [],
          o = false,
          a = parseFrontMatterTags(n.frontmatter);
        if (a)
          for (var s = KO(n.frontmatter, "tags"), l = 0, c = a; l < c.length; l++) {
            var u = c[l];
            t.lastIndex = 0;
            t.test(u) &&
              ((o = true),
              (properties = [
                {
                  key: s,
                },
              ]));
          }
        var h = n.tags;
        if (h)
          for (var p = 0, d = h; p < d.length; p++) {
            u = d[p];
            t.lastIndex = 0;
            t.test(u.tag) && (content.push([u.position.start.offset, u.position.end.offset]), (o = true));
          }
        return o
          ? {
              content: content,
              properties: properties,
            }
          : null;
      }
    };
    t.prototype.getInfo = function () {
      return i18nProxy.plugins.search.labelMatchTag() + this.matcher.text;
    };
    t.prototype.requiredInputs = function () {
      return {
        content: !0,
      };
    };
    t.prototype.getContext = function (t) {
      var n = this.matcher.getContext(t);
      return n ? (n.matcherStack.push(this), n) : e.prototype.getContext.call(this, t);
    };
    return t;
  })(iF),
  qF = {
    "match-case": {
      operate: function (e) {
        return new DF(e, !0);
      },
    },
    "ignore-case": {
      operate: function (e) {
        return new DF(e, !1);
      },
    },
    path: {
      exclusive: true,
      operate: function (e) {
        return new PF(e);
      },
    },
    file: {
      exclusive: true,
      operate: function (e) {
        return new LF(e);
      },
    },
    content: {
      exclusive: true,
      operate: function (e) {
        return new IF(e);
      },
    },
    line: {
      exclusive: true,
      operate: function (e) {
        return new FF(e);
      },
    },
    block: {
      exclusive: true,
      operate: function (e) {
        return new NF(e);
      },
    },
    section: {
      exclusive: true,
      allowSelf: true,
      operate: function (e) {
        return new VF(e);
      },
    },
    task: {
      exclusive: true,
      operate: function (e) {
        return new HF(e, undefined);
      },
    },
    "task-todo": {
      exclusive: true,
      operate: function (e) {
        return new HF(e, !1);
      },
    },
    "task-done": {
      exclusive: true,
      operate: function (e) {
        return new HF(e, !0);
      },
    },
    tag: {
      exclusive: true,
      operate: function (e) {
        if (!(e instanceof fF)) throw new Error('Operator "tag" can only be followed by text');
        return new zF(e);
      },
    },
  },
  WF = (function () {
    function e(app, query, caseSensitive, i) {
      this.app = app;
      i = i || qF;
      this.query = query;
      this.caseSensitive = caseSensitive;
      var r = TF(query),
        o = (this.matcher = kF(r, i));
      this.requiredInputs = o && o.requiredInputs();
    }
    e.prototype.match = function (e, contentt0) {
      var n = this.app;
      if (e.extension === "canvas" && n.internalPlugins.getEnabledPluginById("canvas")) {
        var i = undefined;
        try {
          i = JSON.parse(contentt0);
        } catch (e) {}
        if (i && Array.isArray(i.nodes)) {
          for (
            var r = false,
              o = {},
              a = i.nodes.filter(function (e) {
                return e.type === "text";
              }),
              s = n.internalPlugins.getEnabledPluginById("canvas").index.get(e),
              l = 0,
              c = a;
            l < c.length;
            l++
          ) {
            var u = c[l],
              h = u.id,
              content = u.text,
              d = new JO(
                {
                  filename: e.name,
                  filepath: e.path,
                  content: content,
                },
                content,
                ["content"],
                this.caseSensitive,
              );
            d.cache = s == null ? undefined : s.caches[h];
            var f = this._match(d);
            if (f !== null) if (((r = true), f)) o["canvas-".concat(h)] = f.content;
          }
          var m = this._match(
            new JO(
              {
                content: "",
                filename: e.name,
                filepath: e.path,
              },
              "",
              ["content", "filename"],
              this.caseSensitive,
            ),
          );
          if ((m !== null && ((r = true), m && (o.filename = m.filename)), r)) return o;
        }
      }
      var g = {
          filename: e.name,
          filepath: e.path,
          content: contentt0,
        },
        v = [];
      isNotMediaExtension(e.extension) || v.push("filename");
      e.extension === "md" && v.push("content");
      var y = new JO(g, contentt0, v, this.caseSensitive);
      e.extension === "md" && (y.cache = n.metadataCache.getFileCache(e));
      return this._match(y);
    };
    e.prototype.matchContent = function (content) {
      var t = {
        content: content,
      };
      return this._match(new JO(t, content, ["content"], this.caseSensitive));
    };
    e.prototype.matchTag = function (e) {
      var t = {
        tag: e,
      };
      return this._match(new JO(t, e, ["tag"], this.caseSensitive));
    };
    e.prototype.matchFilepath = function (filepath) {
      var t = {
        filename: getFilename(filepath),
        filepath: filepath,
      };
      return this._match(new JO(t, filepath, ["filename"], this.caseSensitive));
    };
    e.prototype._match = function (e) {
      lF();
      var t = this.matcher.match(e);
      if (t)
        for (var n = 0, i = eF; n < i.length; n++) {
          var r = i[n];
          if (t.hasOwnProperty(r)) {
            t[r] = Nx(t[r]);
          }
        }
      undefined === t && (t = {});
      return t;
    };
    return e;
  })();
function UF(e, t, n, i, r) {
  return __awaiter(this, undefined, Promise, function () {
    var o, a, s, l, c, u, h, p, error, f, m, g, v;
    return __generator(this, function (y) {
      switch (y.label) {
        case 0:
          o = cx(n.generator(), r);
          y.label = 1;
        case 1:
          y.trys.push([1, 11, 12, 17]);
          a = true;
          s = __asyncValues(o);
          y.label = 2;
        case 2:
          return [4, s.next()];
        case 3:
          if (((l = y.sent()), (f = l.done))) return [3, 10];
          if (((v = l.value), (a = false), (c = v), e.metadataCache.isUserIgnored(c.path))) return [3, 9];
          if (!e.metadataCache.isSupportedFile(c)) return [3, 9];
          if (((u = c.extension === "md" || c.extension === "canvas"), (h = ""), !u || !t.content)) return [3, 7];
          y.label = 4;
        case 4:
          y.trys.push([4, 6, , 7]);
          return [4, e.vault.cachedRead(c)];
        case 5:
          h = y.sent();
          return [3, 7];
        case 6:
          p = y.sent();
          console.error(p);
          return [3, 7];
        case 7:
          return n.runnable.isCancelled() ? [2] : [4, i(c, h)];
        case 8:
          y.sent();
          y.label = 9;
        case 9:
          a = true;
          return [3, 2];
        case 10:
          return [3, 17];
        case 11:
          error = y.sent();
          m = {
            error: error,
          };
          return [3, 17];
        case 12:
          y.trys.push([12, , 15, 16]);
          return a || f || !(g = s.return) ? [3, 14] : [4, g.call(s)];
        case 13:
          y.sent();
          y.label = 14;
        case 14:
          return [3, 16];
        case 15:
          if (m) throw m.error;
          return [7];
        case 16:
          return [7];
        case 17:
          return [2];
      }
    });
  });
}
var _F = [
    ["alphabetical", "alphabeticalReverse"],
    ["byModifiedTime", "byModifiedTimeReverse"],
    ["byCreatedTime", "byCreatedTimeReverse"],
  ],
  jF = {
    alphabetical: i18nProxy.plugins.fileExplorer.labelSortAToZ,
    alphabeticalReverse: i18nProxy.plugins.fileExplorer.labelSortZToA,
    byModifiedTime: i18nProxy.plugins.fileExplorer.labelSortNewToOld,
    byModifiedTimeReverse: i18nProxy.plugins.fileExplorer.labelSortOldToNew,
    byCreatedTime: i18nProxy.plugins.fileExplorer.labelSortCreatedNewToOld,
    byCreatedTimeReverse: i18nProxy.plugins.fileExplorer.labelSortCreatedOldToNew,
  },
  GF = {
    alphabetical: function (e, t) {
      return Eb(e.basename, t.basename);
    },
    alphabeticalReverse: function (e, t) {
      return -GF.alphabetical(e, t);
    },
    byModifiedTime: function (e, t) {
      return t.stat.mtime - e.stat.mtime;
    },
    byModifiedTimeReverse: function (e, t) {
      return -GF.byModifiedTime(e, t);
    },
    byCreatedTime: function (e, t) {
      return t.stat.ctime - e.stat.ctime;
    },
    byCreatedTimeReverse: function (e, t) {
      return -GF.byCreatedTime(e, t);
    },
  };
function KF(e) {
  GF.hasOwnProperty(e) || (e = "alphabetical");
  return GF[e];
}
var YF = (function () {
  function e(owner) {
    this._children = [];
    this.owner = owner;
  }
  e.prototype.addChild = function (e) {
    this._children.push(e);
    e.parent = this.owner;
  };
  e.prototype.setChildren = function (e) {
    this.clear();
    for (var t = 0, n = e; t < n.length; t++) {
      var i = n[t];
      this.addChild(i);
    }
  };
  e.prototype.removeChild = function (e) {
    this._children.remove(e);
    e.parent = undefined;
  };
  e.prototype.hasChildren = function () {
    return this._children.length > 0;
  };
  e.prototype.first = function () {
    return this._children.first();
  };
  e.prototype.last = function () {
    return this._children.last();
  };
  e.prototype.size = function () {
    return this._children.length;
  };
  e.prototype.sort = function (e) {
    return this._children.sort(e);
  };
  Object.defineProperty(e.prototype, "children", {
    get: function () {
      return this._children;
    },
    enumerable: false,
    configurable: true,
  });
  e.prototype.clear = function () {
    this._children = [];
  };
  return e;
})();
function ZF(e) {
  return "vChildren" in e && "childrenEl" in e;
}
function XF(e) {
  for (var t = [], n = e; n.parent; ) {
    t.push(n.parent.vChildren.children.indexOf(n));
    n = n.parent;
  }
  return t.reverse();
}
function QF(e, t, n) {
  if ((undefined === n && (n = false), e)) {
    for (var i = 0, r = e.vChildren.children; i < r.length; i++) {
      var o = r[i];
      if (!t(o) && ZF(o)) {
        (n && o.collapsed) || QF(o, t, n);
      }
    }
    return !1;
  }
}
function $F(e, t) {
  var n;
  n = (function (e, t) {
    for (var n = XF(e), i = XF(t), r = 0; r < n.length; r++) {
      var o = n[r],
        a = i[r];
      if (undefined === a) return [t, e];
      if (o !== a) return o <= a ? [e, t] : [t, e];
    }
    return [e, t];
  })(e, t);
  e = n[0];
  for (var i = [(t = n[1])], r = e; r && r !== t; ) {
    i.push(r);
    r = eN(r, !1);
  }
  return i;
}
function JF(e) {
  var t = e.parent.vChildren.children,
    n = t.indexOf(e) + 1;
  return n < t.length ? t[n] : null;
}
function eN(e, t) {
  for (; e; ) {
    if (!ZF(e) || (t && e.collapsed) || !e.vChildren.hasChildren())
      for (var n = false; e && e.parent && !n; ) {
        var i = JF(e);
        i ? ((e = i), (n = true)) : (e = e.parent);
      }
    else e = e.vChildren.children[0];
    if (e && !e.info.hidden) return e.parent ? e : null;
  }
  return null;
}
function tN(e) {
  var t = e.parent.vChildren.children,
    n = t.indexOf(e) - 1;
  return n >= 0 ? t[n] : null;
}
function nN(e, t) {
  for (; e; ) {
    if (!e || !e.parent) return null;
    if (e.parent.vChildren.children.indexOf(e) === 0) e = e.parent;
    else e = iN(tN(e), t);
    if (e && !e.info.hidden) return e;
  }
  return null;
}
function iN(e, t) {
  if (!e) return null;
  var n = e;
  if (ZF(n)) for (var i = t && n.collapsed; !i && ZF(n) && n.vChildren.hasChildren(); ) n = n.vChildren.last();
  for (; n.info.hidden; ) n = nN(n, !0);
  return (function (e) {
    for (var t, n = e; (t = n.parent) === null || undefined === t ? undefined : t.collapsed; ) n = n.parent;
    return n;
  })(n);
}
function rN() {
  var e = createDiv();
  e.style.width = "1px";
  e.style.height = "0.1px";
  e.style.marginBottom = "0";
  return e;
}
var oN = function (e, t) {
    if ((t(e), ZF(e))) {
      var n = e.vChildren;
      if (e.childrenEl.parentNode)
        for (var i = 0, r = n.children; i < r.length; i++) {
          var o = r[i];
          oN(o, t);
        }
    }
  },
  aN = (function () {
    function e(scrollEl) {
      var t = this;
      this.rootMargin = 0.25;
      this.renderBlockSize = 50;
      this.width = 0;
      this.height = 0;
      this.lastScroll = 0;
      this.queued = null;
      this.rtl = getComputedStyle(scrollEl).direction === "rtl";
      this.scrollEl = scrollEl;
      var n = getComputedStyle(scrollEl).overflowX;
      this.setWidth = n === "auto" || n === "scroll";
      scrollEl.style.position = "relative";
      scrollEl.addEventListener("scroll", this.onScroll.bind(this), {
        passive: true,
      });
      scrollEl.onNodeInserted(function () {
        return t.queueCompute();
      });
    }
    e.prototype.invalidate = function (e, t) {
      t
        ? oN(e, function (e) {
            return (e.info.computed = false);
          })
        : (e.info.computed = false);
      this.queueCompute();
    };
    e.prototype.invalidateAll = function () {
      if (this.rootEl) {
        oN(this.rootEl, function (e) {
          return (e.info.computed = false);
        });
        this.queueCompute();
      }
    };
    e.prototype.onScroll = function () {
      var e = this,
        t = e.scrollEl,
        n = e.lastScroll,
        i = e.height,
        r = t.scrollTop;
      if (Math.abs(n - r) > Math.max(i, 300) / 2) {
        this.updateVirtualDisplay(r);
      }
    };
    e.prototype.onResize = function () {
      var e = this.scrollEl;
      if (e.offsetParent !== null) {
        this.height = e.clientHeight;
        var width = e.clientWidth;
        this.setWidth || width === this.width
          ? this.updateVirtualDisplay()
          : ((this.width = width), this.invalidateAll());
      }
    };
    e.prototype.queueCompute = function () {
      var e = this;
      if (!this.queued) {
        this.queued = Sc(function () {
          return e.compute();
        }, 50);
      }
    };
    e.prototype.compute = function (e) {
      if (this.queued) {
        this.queued.cancel();
        this.queued = null;
      }
      var t = this.scrollEl,
        n = this.rootEl;
      if (n) {
        var i = t.scrollTop;
        if (t.offsetParent !== null) {
          var r = {
            num: 0,
            limit: e ? 9999 : this.renderBlockSize,
            finished: true,
          };
          this._precompute(n);
          this._layout(n, r);
          this._measure(n);
          var computed = r.finished;
          if (computed && ZF(n))
            for (var a = 0, s = n.vChildren.children; a < s.length; a++) {
              if (!s[a].info.computed) {
                computed = false;
                break;
              }
            }
          n.info.computed = computed;
          this.updateVirtualDisplay(i);
          computed || this.queueCompute();
        }
      }
    };
    e.prototype._precompute = function (e) {
      if (ZF(e)) {
        var t = e.vChildren,
          n = e.childrenEl;
        if (t.hasChildren() && n.parentNode)
          for (var i = t.last(), r = 0, o = t.children; r < o.length; r++) {
            var a = o[r];
            if (!this._precompute(a)) {
              e.info.computed = false;
            }
            var next = a !== i;
            if (a.info.next !== next) {
              a.info.next = next;
              a.info.computed = false;
              e.info.computed = false;
            }
          }
      }
      e.info.queued = false;
      return e.info.computed;
    };
    e.prototype._layout = function (e, t) {
      var n,
        i,
        r,
        o = e.info;
      if (o.computed) return !1;
      if (t.num >= t.limit) {
        t.finished = false;
        return !1;
      }
      var a = true,
        s = false;
      if (ZF(e)) {
        var l = e.vChildren,
          c = e.childrenEl,
          u = e.pusherEl;
        if (c.parentNode) {
          u.style.marginBottom = "0";
          for (var h = [u], p = 0, d = false, f = 0, m = l.children; f < m.length; f++) {
            var g = m[f],
              v = this._layout(g, t);
            v && (s = true);
            g.info.computed
              ? (oN(g, function (e) {
                  return (p += e.info.height);
                }),
                (v || d || g.el.parentNode === c) &&
                  (h.push(g.el), (r = g.onRender) === null || undefined === r || r.call(g), (d = false)))
              : ((a = false),
                v || t.finished
                  ? (h.push(g.el), (n = g.onRender) === null || undefined === n || n.call(g), (d = true))
                  : d && (h.push(g.el), (i = g.onRender) === null || undefined === i || i.call(g), (d = false)));
          }
          c.setChildrenInPlace(h);
          c.style.minHeight = p + "px";
        }
      }
      a &&
        ((o.queued = true),
        e.coverEl && ((e.coverEl.style.marginInlineStart = ""), (e.coverEl.style.paddingInlineStart = "")),
        t.num++);
      return a || s;
    };
    e.prototype._measure = function (e) {
      if (!e.info.computed && ZF(e)) {
        var t = e.vChildren;
        if (e.childrenEl.parentNode)
          for (var n = 0, i = t.children; n < i.length; n++) {
            var r = i[n];
            this._measure(r);
            r.info.queued && (this.measure(e, r), (r.info.computed = true));
          }
      }
    };
    e.prototype.measure = function (e, t) {
      var n = t.el,
        i = t.info;
      if (n.offsetParent) {
        i.hidden = false;
        for (var r = t === e.vChildren.children[0], o = n.nextSibling; o && !o.isShown(); ) o = o.nextSibling;
        var a = r ? e.childrenEl.offsetTop : n.offsetTop,
          s = o ? o.offsetTop : n.offsetTop + n.offsetHeight,
          l = 0;
        if (
          (ZF(t) && (l = t.childrenEl.innerHeight),
          (i.height = s - a - l),
          i.height < 0 && (i.height = 0),
          i.height === 0 && l === 0 && (i.hidden = true),
          this.setWidth && (i.width = Math.max(n.scrollWidth, n.offsetWidth)),
          ZF(t) && (i.childTop = t.childrenEl.offsetTop - a),
          t.coverEl)
        ) {
          var c = getRelativeOffset(t.el, this.scrollEl);
          i.childLeft = this.rtl ? c.right : c.left;
          i.childLeftPadding = parseInt(getComputedStyle(t.coverEl).paddingInlineStart);
        }
      } else i.hidden = true;
    };
    e.prototype.updateVirtualDisplay = function (e) {
      var t = this,
        n = t.scrollEl,
        i = t.rootEl,
        r = t.rootMargin,
        lastScroll = n.scrollTop;
      typeof e == "number" && (lastScroll = e);
      this.lastScroll = lastScroll;
      var a = n.clientHeight,
        s = lastScroll + a,
        l = Math.min(lastScroll, n.scrollTop),
        c = Math.max(a * r, 300),
        u = l - c,
        h = s + c,
        p = parseInt(getComputedStyle(n).paddingInlineStart),
        d = 0,
        f = 0;
      oN(i, function (e) {
        var t = e.info.height;
        if (t > 0) {
          d += t;
          f++;
        }
      });
      d /= f;
      this.update(i, this.getRootTop(), u, h, p, d);
      n.scrollTop !== lastScroll && (n.scrollTop = lastScroll);
    };
    e.prototype.update = function (e, t, n, i, r, o) {
      var a,
        s = e.info,
        l = e.coverEl;
      if (l && s.childLeft !== 0) {
        var c = s.childLeft - r;
        l.style.setProperty("margin-inline-start", -c + "px", "important");
        l.style.setProperty("padding-inline-start", c + s.childLeftPadding + "px", "important");
      }
      if (ZF(e)) {
        var u = e.vChildren,
          h = e.childrenEl,
          p = e.pusherEl;
        if (h.parentNode) {
          if (s.hidden) return;
          var d = this.setWidth,
            f = 0,
            m = 0,
            g = [p],
            v = false,
            y = 0;
          t += s.height;
          for (
            var b = function (e) {
                var s = 0;
                oN(e, function (e) {
                  return (s += e.info.hidden ? 0 : e.info.height || o);
                });
                m += s;
                var l = t + s;
                d && (y = Math.max(y, e.info.width));
                v = false;
                l < n
                  ? ((f += s),
                    oN(e, function (e) {
                      return e.el.parentNode && e.el.detach();
                    }))
                  : t > i
                    ? oN(e, function (e) {
                        return e.el.parentNode && e.el.detach();
                      })
                    : (g.push(e.el),
                      (a = e.onRender) === null || undefined === a || a.call(e),
                      w.update(e, t, n, i, r, o),
                      (v = true));
                t = l;
              },
              w = this,
              k = 0,
              C = u.children;
            k < C.length;
            k++
          ) {
            b((M = C[k]));
          }
          h.setChildrenInPlace(g);
          u.children.length === 0 && h.empty();
          p.style.marginBottom = f + "px";
          d && ((y = Math.max(1, y)), (p.style.width = y + "px"));
          h.style.minHeight = v ? "" : m + "px";
        } else {
          g = [];
          for (var E = 0, S = u.children; E < S.length; E++) {
            var M = S[E];
            g.push(M.el);
          }
          h.setChildrenInPlace(g);
          h.style.minHeight = "";
        }
      }
    };
    e.prototype.scrollIntoView = function (e, t) {
      undefined === t && (t = 0);
      this.compute(!0);
      for (var n = 0; n < 9 && !this.rootEl.info.computed; n++) this.compute(!0);
      var scrollTop = this.findElementTop(e, this.rootEl, this.getRootTop());
      if (scrollTop !== null) {
        var r = scrollTop + e.info.height,
          o = this.scrollEl,
          a = o.scrollTop,
          s = a + o.clientHeight;
        r += t;
        (scrollTop -= t) < a ? (o.scrollTop = scrollTop) : r > s && (o.scrollTop = r - o.clientHeight);
        this.updateVirtualDisplay();
      }
    };
    e.prototype.findElementTop = function (e, t, n) {
      if (e === t) return n;
      if (ZF(t)) {
        var i = t.vChildren,
          r = t.childrenEl,
          o = t.info;
        if (r.parentNode) {
          n += o.childTop;
          for (
            var a = function (t) {
                var value = s.findElementTop(e, t, n);
                if (value !== null)
                  return {
                    value: value,
                  };
                var r = 0;
                oN(t, function (e) {
                  return (r += e.info.hidden ? 0 : e.info.height);
                });
                n += r;
              },
              s = this,
              l = 0,
              c = i.children;
            l < c.length;
            l++
          ) {
            var u = a(c[l]);
            if (typeof u == "object") return u.value;
          }
        }
      }
      return null;
    };
    e.prototype.getRootTop = function () {
      for (var e = this.scrollEl, t = this.rootEl.childrenEl, n = 0; t && t !== e; ) {
        n += t.offsetTop;
        t = t.offsetParent;
      }
      return n;
    };
    return e;
  })(),
  sN = /\r?\n\r?\n/y;
function lN(e, t, n, i, r) {
  !(function (e, t, n, i) {
    for (var r = e, o = 0; o < n.length; o++) {
      var a = n[o],
        s = a[0];
      if (s >= t) break;
      var l = a[1];
      if (!(l < e)) {
        s < e && (s = e);
        l > t && (l = t);
        s > r && i(!1, r, s);
        i(!0, s, l);
        r = l;
      }
    }
    if (r < t) {
      i(!1, r, t);
    }
  })(n, i, r, function (n, i, r) {
    var texto0 = t.substring(i, r);
    n
      ? e.createSpan({
          cls: "search-result-file-matched-text",
          text: texto0,
        })
      : e.createSpan({
          text: texto0,
        });
  });
}
var cN = (function () {
    function e(app, parentDom, filen0, result, content, showTitle) {
      if (undefined === showTitle) {
        showTitle = true;
      }
      var a = this;
      this.onMatchRender = null;
      this.collapsible = true;
      this.collapsed = false;
      this.extraContext = true;
      this.showTitle = true;
      this.separateMatches = false;
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
      this.rendered = false;
      this.app = app;
      this.parentDom = parentDom;
      this.file = filen0;
      this.result = result;
      this.content = content;
      this.showTitle = showTitle;
      var s = (this.el = this.containerEl = createDiv("tree-item search-result"));
      if (showTitle) {
        var l = (this.selfEl = s.createDiv("tree-item-self search-result-file-title is-clickable")),
          c = (this.collapseEl = l.createDiv("tree-item-icon collapse-icon"));
        setIcon(c, "right-triangle");
        c.style.visibility = "hidden";
        xc(l);
        l.onClickEvent(this.onResultClick.bind(this));
        l.addEventListener("mouseover", function (e) {
          return a.onResultMouseover(e, l);
        });
        l.addEventListener("contextmenu", this.onResultContextMenu.bind(this));
        c.addEventListener("click", this.onCollapseClick.bind(this));
        var u = l.createDiv("tree-item-inner");
        if (result.filename || result.filepath) {
          var h = undefined,
            p = undefined;
          if (result.filepath) {
            if (((h = filen0.path), (p = result.filepath), result.filename)) {
              for (var d = filen0.path.length - filen0.name.length, f = 0, m = result.filename; f < m.length; f++) {
                var v = m[f];
                p.push([v[0] + d, v[1] + d]);
              }
              p = Nx(p);
            }
          } else {
            h = filen0.name;
            p = result.filename;
            filen0.extension === "md" &&
              (p.length === 0 || p.last()[1] <= filen0.basename.length) &&
              (h = filen0.basename);
          }
          lN(u, h, 0, h.length, p);
        } else u.setText(filen0.extension === "md" ? filen0.basename : filen0.name);
        var y = tF(
          __assign(__assign({}, result), {
            filename: undefined,
          }),
        );
        if (y > 0) {
          l.createDiv("tree-item-flair-outer").createSpan("tree-item-flair").setText(String(y));
        }
        var b = this.app.dragManager;
        b.handleDrag(l, function (e) {
          return b.dragFile(e, a.file);
        });
      }
      this.childrenEl = s.createDiv("search-result-file-matches");
    }
    e.prototype.onRender = function () {
      if (!this.rendered) {
        this.rendered = true;
        this.renderContentMatches();
      }
    };
    e.prototype.renderContentMatches = function () {
      var e = this,
        t = this,
        n = t.app,
        i = t.file,
        r = t.result,
        o = t.content,
        a = t.collapsible,
        s = t.extraContext,
        l = t.separateMatches,
        c = t.collapseEl;
      this.vChildren.clear();
      this.showTitle && (c.style.visibility = "hidden");
      var u = false,
        h = function (t, n, i, r) {
          t.sort(function (e, t) {
            return e[0] - t[0];
          });
          u = true;
          var o = 0,
            a = function (a, s, c, u) {
              var h = o + 1;
              if (!l)
                for (; h < t.length; ) {
                  var p = t[h];
                  if (p[0] >= s) break;
                  if (p[1] > s) {
                    s = p[1];
                    h++;
                    break;
                  }
                  h++;
                }
              var d = t.slice(o, h),
                f = new hN(e, n, i, a, s, d, r);
              f.onMatchRender = e.onMatchRender;
              f.render(c, u);
              e.vChildren.addChild(f);
              o = h;
            };
          if (s)
            for (; o < t.length; ) {
              h = t[o];
              var c = e.getMatchExtraPositions(n, h, i);
              a(c[0], c[1]);
            }
          else
            for (; o < t.length; ) {
              var h = t[o],
                p = Qx(n, h);
              a(p[0], p[1], p[2], p[3]);
            }
        };
      if (i.extension === "canvas" && o)
        try {
          for (
            var p = JSON.parse(o)
                .nodes.filter(function (e) {
                  return e.type === "text";
                })
                .sort(function (e, t) {
                  return e.y - t.y || e.x - t.x;
                }),
              d = n.internalPlugins.getEnabledPluginById("canvas").index.get(i),
              f = function (e) {
                var nodeId = e.id,
                  n = "canvas-".concat(nodeId);
                if (r.hasOwnProperty(n)) {
                  var i = r[n];
                  if (i && i.length > 0) {
                    h(i, e.text, d.caches[nodeId] || {}, function (e) {
                      e.match.nodeId = nodeId;
                    });
                  }
                }
              },
              m = 0,
              g = p;
            m < g.length;
            m++
          ) {
            f(g[m]);
          }
        } catch (e) {}
      else {
        var v = this.app.metadataCache.getFileCache(i) || {};
        r.properties &&
          r.properties.length > 0 &&
          (function (t, n, i) {
            u = true;
            for (
              var r = (function (e) {
                  for (var t = {}, n = 0, i = e; n < i.length; n++) {
                    var r = i[n];
                    t.hasOwnProperty(r.key) || (t[r.key] = []);
                    t[r.key].push(r);
                  }
                  return t;
                })(t),
                o = 0,
                a = Object.keys(r);
              o < a.length;
              o++
            ) {
              var s = r[a[o]],
                l = new uN(e, i, s);
              l.onMatchRender = e.onMatchRender;
              l.render();
              e.vChildren.addChild(l);
            }
          })(r.properties, 0, v);
        r.content && r.content.length > 0 && h(r.content, o, v);
      }
      this.showTitle && a && u && (c.style.visibility = "");
      this.invalidate();
    };
    e.prototype.getMatchExtraPositions = function (e, t, n) {
      var i = n.listItems,
        r = n.sections;
      if (i) {
        var o = i[(u = binarySearchByOffset(i, t[0]))];
        if (o && t[0] >= o.position.start.offset && t[1] <= o.position.end.offset) {
          var a = o,
            s = u + 1,
            l = new Set();
          for (l.add(a.position.start.line); s < i.length; ) {
            var c = i[s];
            if (!l.has(c.parent)) break;
            l.add(c.position.start.line);
            s++;
            a = c;
          }
          return [o.position.start.offset - o.position.start.col, a.position.end.offset];
        }
      }
      if (r) {
        var u,
          h = r[(u = binarySearchByOffset(r, t[0]))];
        if (h && t[0] >= h.position.start.offset && t[1] <= h.position.end.offset)
          return [h.position.start.offset, h.position.end.offset];
      }
      for (var p = t[0], d = p - 1e3; p > 0 && p > d && e.charCodeAt(p - 1) !== 10; ) p--;
      for (var f = t[0], m = f + 1e3; f < e.length && f < m && e.charCodeAt(f) !== 10; ) f++;
      var g = e.substring(p, f).match(Ab);
      if (g && g[2]) {
        for (var v = f; v < e.length; ) {
          var y = e.indexOf("\n", v + 1);
          if (-1 === y) {
            y = e.length;
          }
          var b = e.substring(v + 1, y).match(Ab);
          if (b && b[1].length <= g[1].length) break;
          v = y;
        }
        return [p, v];
      }
      for (var lastIndex = p; lastIndex > 0 && lastIndex > d && ((sN.lastIndex = lastIndex), !sN.test(e)); )
        lastIndex--;
      for (; e.charCodeAt(lastIndex) === 10 && lastIndex < p; ) lastIndex++;
      for (
        var lastIndexk0 = f;
        lastIndexk0 < e.length && lastIndexk0 < m && ((sN.lastIndex = lastIndexk0), !sN.test(e));
      )
        lastIndexk0++;
      return [lastIndex, lastIndexk0];
    };
    e.prototype.onCollapseClick = function (e) {
      e.preventDefault();
      Keymap.isModifier(e, "Mod")
        ? this.parentDom.setCollapseAll(!this.collapsed)
        : this.setCollapse(!this.collapsed, !0);
    };
    e.prototype.onResultClick = function (e) {
      if (!((e.instanceOf(MouseEvent) && e.button !== 0 && e.button !== 1) || e.defaultPrevented)) {
        e.preventDefault();
        this.app.workspace.getLeaf(Keymap.isModEvent(e)).openFile(this.file, {
          eState: {
            match: {
              content: this.content,
              matches: this.result.content || [],
            },
            propertyMatches: this.result.properties,
          },
        });
      }
    };
    e.prototype.onResultMouseover = function (event, targetEl, n) {
      if (!event.defaultPrevented && Mc(event, targetEl)) {
        event.preventDefault();
        var linktext = this.file.path,
          state = null;
        if (n && n.length > 0)
          state = {
            scroll: rc(this.content, n[0][0]),
          };
        this.app.workspace.trigger("hover-link", {
          event: event,
          source: "search",
          hoverParent: this.parentDom,
          targetEl: targetEl,
          linktext: linktext,
          state: state,
        });
      }
    };
    e.prototype.onResultContextMenu = function (e) {
      var t = this,
        n = new Menu().addSections([
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
      if (this.app.workspace.handleLinkContextMenu(n, this.file.path, "")) {
        e.preventDefault();
        this.selfEl.contains(e.targetNode) &&
          n.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(i18nProxy.interface.menu.deleteFile())
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                return t.app.fileManager.promptForFileDeletion(t.file);
              });
          });
        n.setParentElement(this.containerEl).showAtMouseEvent(e);
      }
    };
    e.prototype.setCollapse = function (collapsed, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              return this.collapsed === collapsed
                ? [2]
                : ((this.collapsed = collapsed),
                  (i = (n = this).containerEl),
                  (r = n.childrenEl),
                  CO(i, collapsed),
                  [4, toggleElementMount(r, i, collapsed, t)]);
            case 1:
              o.sent();
              this.invalidate();
              return [2];
          }
        });
      });
    };
    e.prototype.setCollapsible = function (collapsible) {
      if (this.collapsible !== collapsible) {
        this.collapsible = collapsible;
        this.collapseEl.style.visibility = collapsible ? "" : "hidden";
      }
    };
    e.prototype.setExtraContext = function (extraContext) {
      if (this.extraContext !== extraContext) {
        this.extraContext = extraContext;
        this.renderContentMatches();
      }
    };
    e.prototype.invalidate = function () {
      this.parentDom.infinityScroll.invalidate(this, !0);
    };
    return e;
  })(),
  uN = (function () {
    function e(parentDom, cache, matches) {
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
      this.onMatchRender = null;
      this.parentDom = parentDom;
      this.cache = cache;
      this.matches = matches;
      var i = (this.el = createDiv("search-result-file-match tappable"));
      xc(i);
      i.onClickEvent(this.onResultClick.bind(this));
      i.addEventListener("mouseover", this.onFocusEnter.bind(this));
      i.addEventListener("mouseout", this.onFocusExit.bind(this));
      i.addEventListener("contextmenu", function (t) {
        return parentDom.onResultContextMenu(t);
      });
    }
    e.prototype.onResultClick = function (e) {
      if (!((e.instanceOf(MouseEvent) && e.button !== 0 && e.button !== 1) || e.defaultPrevented)) {
        e.preventDefault();
        var eState = {
            propertyMatches: this.matches,
          },
          n = this.parentDom,
          i = n.app,
          r = n.file;
        i.workspace.getLeaf(Keymap.isModEvent(e)).openFile(r, {
          eState: eState,
        });
      }
    };
    e.prototype.onFocusExit = function (e) {
      if (!(e && e.instanceOf(MouseEvent) && !Mc(e, this.el))) {
        this.el.classList.contains("has-focus");
      }
    };
    e.prototype.onFocusEnter = function (e) {
      if (!(!e || !e.instanceOf(MouseEvent))) {
        Mc(e, this.el);
      }
    };
    e.prototype.render = function () {
      var e,
        t = this,
        n = t.el,
        i = t.parentDom,
        r = t.matches;
      n.empty();
      var o = r[0].key;
      n.createSpan({
        text: o + ": ",
      });
      var a = ((e = this.cache.frontmatter) !== null && undefined !== e ? e : {})[o];
      if (Array.isArray(a))
        for (
          var s = function (e) {
              var t = a[e];
              if (!t) return "continue";
              var i = String(t),
                o = r.filter(function (t) {
                  var n;
                  return t.pos && ((n = t.subkey) === null || undefined === n ? undefined : n[0]) === e;
                }),
                s = Nx(
                  o.map(function (e) {
                    return e.pos;
                  }),
                );
              lN(n, i, 0, i.length, s);
              n.createSpan({
                text: " ",
              });
            },
            l = 0;
          l < a.length;
          l++
        )
          s(l);
      else {
        var c = String(a),
          u = Nx(
            r
              .map(function (e) {
                return e.pos;
              })
              .filter(Boolean),
          );
        lN(n, c, 0, c.length, u);
      }
      i.parentDom.infinityScroll.invalidate(this);
    };
    return e;
  })(),
  hN = (function () {
    function e(parentDom, content, cache, start, end, matches, mutateEState) {
      var s = this;
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
      this.onMatchRender = null;
      this.parentDom = parentDom;
      this.content = content;
      this.cache = cache;
      this.start = start;
      this.end = end;
      this.matches = matches;
      this.mutateEState = mutateEState;
      var l = (this.el = createDiv("search-result-file-match tappable"));
      this.showMoreBeforeEl = l.createDiv("search-result-hover-button mod-top", function (e) {
        setIcon(e, "lucide-chevron-up");
        setTooltip(e, i18nProxy.plugins.search.labelMoreContext(), {
          placement: "top",
        });
        e.addEventListener("click", function (e) {
          e.preventDefault();
          s.showMoreBefore();
        });
      });
      this.showMoreAfterEl = l.createDiv("search-result-hover-button mod-bottom", function (e) {
        setIcon(e, "lucide-chevron-down");
        setTooltip(e, i18nProxy.plugins.search.labelMoreContext(), {
          placement: "bottom",
        });
        e.addEventListener("click", function (e) {
          e.preventDefault();
          s.showMoreAfter();
        });
      });
      this.showMoreBeforeEl.hide();
      this.showMoreAfterEl.hide();
      xc(l);
      l.onClickEvent(this.onResultClick.bind(this));
      l.addEventListener("mouseover", this.onFocusEnter.bind(this));
      l.addEventListener("mouseout", this.onFocusExit.bind(this));
      l.addEventListener("contextmenu", function (t) {
        return parentDom.onResultContextMenu(t);
      });
    }
    e.prototype.onResultClick = function (e) {
      var t;
      if (!((e.instanceOf(MouseEvent) && e.button !== 0 && e.button !== 1) || e.defaultPrevented)) {
        e.preventDefault();
        var eState = {
          match: {
            content: this.content,
            matches: this.matches,
          },
        };
        if (!((t = this.mutateEState) === null || undefined === t)) {
          t.call(this, eState);
        }
        var i = this.parentDom,
          r = i.app,
          o = i.file;
        r.workspace.getLeaf(Keymap.isModEvent(e)).openFile(o, {
          eState: eState,
        });
      }
    };
    e.prototype.onFocusExit = function (e) {
      if (!((e && e.instanceOf(MouseEvent) && !Mc(e, this.el)) || this.el.classList.contains("has-focus"))) {
        this.showMoreBeforeEl.hide();
        this.showMoreAfterEl.hide();
      }
    };
    e.prototype.onFocusEnter = function (e) {
      if (e && e.instanceOf(MouseEvent)) {
        if (!Mc(e, this.el)) return;
        this.parentDom.onResultMouseover(e, this.el, this.matches);
      }
      this.toggleShowMoreContextButtons();
    };
    e.prototype.toggleShowMoreContextButtons = function () {
      this.showMoreBeforeEl.toggle(this.start > 0);
      this.showMoreAfterEl.toggle(this.end < this.content.length);
    };
    e.prototype.showMoreBefore = function () {
      for (var start = this.start; start > 0; ) {
        start--;
        var t = this.getPrevPos(start);
        if (t < start) {
          start = t;
          break;
        }
      }
      this.start = start;
      this.render();
      this.onFocusEnter();
    };
    e.prototype.showMoreAfter = function () {
      for (var end = this.end, t = this.content.length; end < t; ) {
        end++;
        var n = this.getNextPos(end);
        if (n > end) {
          end = n;
          break;
        }
      }
      this.end = end;
      this.render();
      this.onFocusEnter();
    };
    e.prototype.getPrevPos = function (e) {
      var t = this.content,
        n = this.cache,
        i = n.listItems,
        r = n.sections;
      if (i) {
        var o = i[binarySearchByOffset(i, e, !0)];
        if (o) {
          var a = o.position,
            s = a.start,
            l = a.end;
          if (s.offset - s.col <= e && l.offset >= e) return s.offset - s.col;
        }
      }
      if (r) {
        var c = r[binarySearchByOffset(r, e, !0)];
        if (c && c.type !== "list") {
          var u = c.position;
          s = u.start;
          l = u.end;
          if (s.offset - s.col <= e && l.offset >= e) return s.offset - s.col;
        }
      }
      for (var h = e; h > 0 && t.charCodeAt(h - 1) !== 10; ) h--;
      return h;
    };
    e.prototype.getNextPos = function (e) {
      var t = this.content,
        n = this.cache,
        i = n.listItems,
        r = n.sections;
      if (i) {
        var o = i[(d = binarySearchByOffset(i, e, !0))];
        if (o) {
          var a = o.position,
            s = a.start,
            l = a.end;
          if (s.offset - s.col <= e && l.offset >= e) {
            var c = o,
              u = d + 1,
              h = new Set();
            for (h.add(c.position.start.line); u < i.length; ) {
              var p = i[u];
              if (!h.has(p.parent)) break;
              h.add(p.position.start.line);
              u++;
              c = p;
            }
            return c.position.end.offset;
          }
        }
      }
      if (r) {
        var d,
          f = r[(d = binarySearchByOffset(r, e, !0))];
        if (f && f.type !== "list") {
          var m = f.position;
          s = m.start;
          l = m.end;
          if (s.offset - s.col <= e && l.offset >= e) return l.offset;
        }
      }
      for (var g = e; g < t.length && t.charCodeAt(g) !== 10; ) g++;
      return g;
    };
    e.prototype.render = function (e, t) {
      var n = this,
        i = n.el,
        r = n.content,
        o = n.parentDom,
        a = n.matches,
        s = n.onMatchRender;
      i.empty();
      e && i.appendText("...");
      lN(i, r, this.start, this.end, a);
      i.appendChild(this.showMoreBeforeEl);
      i.appendChild(this.showMoreAfterEl);
      t && i.appendText("...");
      s && s(a[0], i);
      o.parentDom.infinityScroll.invalidate(this);
    };
    return e;
  })(),
  pN = (function () {
    function e(app, t, textn0, i) {
      this.changed = debounce(this.onChange.bind(this), 0);
      this.infinityScroll = null;
      this.vChildren = new YF(this);
      this.resultDomLookup = new Map();
      this.focusedItem = null;
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
      this.pusherEl = rN();
      this.emptyStateEl = null;
      this.showingEmptyState = false;
      this.working = false;
      this.sortOrder = "alphabetical";
      this.collapseAll = false;
      this.extraContext = false;
      this.app = app;
      this.el = t;
      this.emptyStateEl = createDiv({
        cls: "search-empty-state",
        text: textn0,
      });
      this.childrenEl = this.el.createDiv("search-results-children");
      var r = (this.infinityScroll = new aN(i || this.el));
      r.rootEl = this;
      r.setWidth = false;
    }
    e.prototype.startLoader = function () {
      this.working = true;
      this.el.addClass("is-loading");
      this.onChange();
    };
    e.prototype.stopLoader = function () {
      this.working = false;
      this.el.removeClass("is-loading");
      this.onChange();
    };
    e.prototype.onChange = function () {
      var e = this,
        t = e.sortOrder,
        n = e.vChildren,
        i = e.emptyStateEl,
        r = e.infinityScroll,
        o = KF(t);
      n.sort(function (e, t) {
        return o(e.file, t.file);
      });
      n.hasChildren() || this.working ? i.detach() : this.el.appendChild(i);
      r.queueCompute();
    };
    e.prototype.emptyResults = function () {
      this.vChildren.clear();
      this.resultDomLookup.clear();
      this.changed();
    };
    e.prototype.getResult = function (e) {
      return this.resultDomLookup.get(e);
    };
    e.prototype.removeResult = function (e) {
      var t = this.vChildren,
        n = this.resultDomLookup,
        i = n.get(e);
      if (i) {
        t.removeChild(i);
        n.delete(e);
        this.changed();
        var r = this.focusedItem;
        if (!(!r || (r !== i && r.parent !== i))) {
          this.setFocusedItem(null);
        }
      }
      return i;
    };
    e.prototype.addResult = function (e, t, n, i) {
      if ((undefined === i && (i = true), e)) {
        var r = this.vChildren,
          o = this.resultDomLookup,
          a = this.removeResult(e),
          s = new cN(this.app, this, e, t, n, i);
        a ? s.setCollapse(a.collapsed, !1) : s.setCollapse(this.collapseAll, !1);
        s.extraContext = this.extraContext;
        r.addChild(s);
        o.set(e, s);
        this.changed();
        return s;
      }
    };
    e.prototype.toggle = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, toggleElementVisibility(this.el, e, t)];
            case 1:
              n.sent();
              e || this.infinityScroll.invalidateAll();
              return [2];
          }
        });
      });
    };
    e.prototype.setCollapseAll = function (collapseAll) {
      this.collapseAll = collapseAll;
      for (var t = 0, n = this.vChildren.children; t < n.length; t++) {
        n[t].setCollapse(collapseAll, !1);
      }
      this.infinityScroll.invalidateAll();
    };
    e.prototype.setExtraContext = function (extraContext) {
      this.extraContext = extraContext;
      for (var t = 0, n = this.vChildren.children; t < n.length; t++) {
        n[t].setExtraContext(extraContext);
      }
      this.infinityScroll.invalidateAll();
    };
    e.prototype.onResize = function () {
      this.infinityScroll.onResize();
    };
    e.prototype.getFiles = function () {
      return this.vChildren.children.map(function (e) {
        return e.file;
      });
    };
    e.prototype.getMatchCount = function () {
      for (var e = 0, t = 0, n = this.vChildren.children; t < n.length; t++) {
        e += tF(n[t].result);
      }
      return e;
    };
    e.prototype.setFocusedItem = function (focusedItem) {
      var t;
      (t = this.focusedItem) === null || undefined === t || t.el.removeClass("has-focus");
      this.focusedItem instanceof hN && this.focusedItem.onFocusExit();
      this.focusedItem = focusedItem;
      focusedItem &&
        (focusedItem.el.addClass("has-focus"),
        this.infinityScroll.scrollIntoView(focusedItem),
        focusedItem instanceof hN && focusedItem.onFocusEnter());
    };
    e.prototype.changeFocusedItem = function (e) {
      if (this.focusedItem !== null) {
        var t = e === "forwards" ? eN(this.focusedItem, !0) : nN(this.focusedItem, !0);
        if (t) {
          this.setFocusedItem(t);
        }
      } else {
        var n = e === "forwards" ? this.vChildren.first() : iN(this, !0);
        this.setFocusedItem(n);
      }
    };
    return e;
  })(),
  dN = (function () {
    function e(e, renderer, n, onClose) {
      var r = this;
      this.scope = null;
      this.searchContainerEl = null;
      this.searchInputEl = null;
      this.lastQuery = null;
      this.highlightRanges = null;
      this.selectedRange = -1;
      this.lastText = null;
      this.renderer = renderer;
      this.onClose = onClose;
      var o = (this.scope = new Scope(e.scope)),
        a = (this.searchContainerEl = n.createDiv({
          cls: "document-search-container",
          prepend: true,
        })).createDiv("document-search"),
        s = a.createDiv("search-input-container document-search-input"),
        l = (this.searchInputEl = s.createEl("input", {
          type: "text",
          placeholder: i18nProxy.editor.search.placeholderFind(),
        }));
      this.countEl = s.createDiv("document-search-count");
      l.addEventListener("input", debounce(this.onSearchInput.bind(this), 150, !0));
      l.addEventListener("keydown", function (e) {
        if (!(e.isComposing || Platform.hasPhysicalKeyboard || e.key !== "Enter")) {
          e.preventDefault();
          clearFocusAndSelection();
        }
      });
      var c = a.createDiv({
        cls: "document-search-buttons",
        type: "text",
      });
      c.createEl(
        "button",
        {
          cls: "clickable-icon document-search-button",
        },
        function (e) {
          setIcon(e, "lucide-arrow-up");
          setTooltip(e, i18nProxy.editor.search.labelPrevious() + "\n" + HO(BO(["Shift"], "F3")), {
            placement: "top",
          });
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            r.findPrevious();
          });
        },
      );
      c.createEl(
        "button",
        {
          cls: "clickable-icon document-search-button",
        },
        function (e) {
          setIcon(e, "lucide-arrow-down");
          setTooltip(e, i18nProxy.editor.search.labelNext() + "\n" + HO(BO([], "F3")), {
            placement: "top",
          });
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            r.findNext();
          });
        },
      );
      c.createDiv("clickable-icon document-search-close-button", function (e) {
        setIcon(e, "lucide-x");
        setTooltip(e, i18nProxy.editor.search.labelExitSearch(), {
          placement: "top",
        });
        e.addEventListener("click", function (e) {
          e.preventDefault();
          r.close();
        });
      });
      o.register([], "F3", this.findNext.bind(this));
      o.register(["Mod"], "G", this.findNext.bind(this));
      o.register(["Shift"], "F3", this.findPrevious.bind(this));
      o.register(["Mod", "Shift"], "G", this.findPrevious.bind(this));
      o.register([], "Enter", this.onEnter.bind(this));
      o.register(["Shift"], "Enter", this.onShiftEnter.bind(this));
      o.register([], "Escape", this.close.bind(this));
      var value = activeWindow.getSelection().toString();
      value && (l.value = value);
      this.updateQuery();
      this.updateCount();
    }
    e.prototype.close = function () {
      var e = this.searchContainerEl,
        t = this.searchInputEl;
      e.detach();
      t.value = "";
      t.removeClass("mod-no-match");
      this.updateQuery();
      this.onClose();
    };
    e.prototype.updateQuery = function () {
      var lastQuery = this.getQuery().toLowerCase(),
        t = this.renderer,
        n = this.searchInputEl,
        lastText = t.lastText;
      if (!lastQuery) {
        lastText = null;
      }
      var r = this.lastText !== lastText,
        o = this.lastQuery !== lastQuery;
      if ((r && (this.lastText = lastText), o && ((this.lastQuery = lastQuery), (this.selectedRange = -1)), r || o)) {
        n.removeClass("mod-no-match");
        for (var a = 0, s = t.sections; a < s.length; a++) {
          (section = s[a]).highlightRanges = null;
        }
        if ((t.queueRender(), lastQuery)) {
          for (var highlightRangesl0 = [], c = 0, u = t.sections; c < u.length; c++) {
            var section,
              p = [];
            collectTextNodes((section = u[c]).el, p);
            for (
              var d = p
                  .map(function (e) {
                    return e.textContent;
                  })
                  .join("")
                  .toLowerCase(),
                highlightRanges = [],
                start = 0;
              -1 !== (start = d.indexOf(lastQuery, start));
            ) {
              var g = start + lastQuery.length,
                v = {
                  section: section,
                  start: start,
                  end: g,
                  active: !1,
                };
              highlightRanges.push(v);
              highlightRangesl0.push(v);
              start = g;
            }
            if (highlightRanges.length > 0) {
              section.highlightRanges = highlightRanges;
            }
          }
          this.highlightRanges = highlightRangesl0;
          n.toggleClass("mod-no-match", highlightRangesl0.length === 0);
        } else this.highlightRanges = null;
      }
    };
    e.prototype.updateCount = function () {
      var e,
        t = this.selectedRange + 1,
        n = ((e = this.highlightRanges) === null || undefined === e ? undefined : e.length) || 0;
      this.countEl.toggle(!!this.getQuery());
      this.countEl.setText("".concat(t, " / ").concat(n));
    };
    e.prototype.onSearchInput = function () {
      this.updateQuery();
      this.selectRange(0);
      this.updateCount();
    };
    e.prototype.findNext = function () {
      this.selectRange(this.selectedRange + 1);
      this.updateCount();
    };
    e.prototype.findPrevious = function () {
      this.selectRange(this.selectedRange - 1);
      this.updateCount();
    };
    e.prototype.selectRange = function (selectedRange) {
      var t = this.highlightRanges;
      if (t && t.length !== 0) {
        selectedRange > t.length - 1 && (selectedRange = 0);
        selectedRange < 0 && (selectedRange = t.length - 1);
        var n = t[this.selectedRange];
        n && (n.active = false);
        this.selectedRange = selectedRange;
        var i = t[this.selectedRange];
        i.active = true;
        this.renderer.selectRange(i);
      }
    };
    e.prototype.getQuery = function () {
      return this.searchInputEl.value;
    };
    e.prototype.onEnter = function (e) {
      if (!e.isComposing && this.searchInputEl.isActiveElement()) {
        this.findNext();
      }
    };
    e.prototype.onShiftEnter = function (e) {
      if (!e.isComposing && this.searchInputEl.isActiveElement()) {
        this.findPrevious();
      }
    };
    return e;
  })();
function fN(e) {
  var t = parseMetadata(e),
    n = {
      definitions: node2Definitions(t),
    },
    sections = [],
    r = t.children,
    frontmatter = parseYamlFrontmatter(t);
  t.children = [null];
  for (
    var a = function (e) {
        var o = r[e],
          level = 7;
        o.type === "heading" && (level = o.depth || 1);
        visit(o, ["checklist", "listItem", "code"], function (e) {
          var t = (e.data = e.data || {});
          (t.hProperties = t.hProperties || {})["data-line"] = String(e.position.start.line - o.position.start.line);
        });
        t.children[0] = o;
        var html = renderMarkdown(t, n);
        sections.push({
          html: html,
          pos: toZeroBasedRange(o.position),
          level: level,
        });
      },
      s = 0;
    s < r.length;
    s++
  )
    a(s);
  return {
    sections: sections,
    frontmatter: frontmatter,
  };
}
var mN = lazyLoadScript("/lib/pdfjs/pdf.min.mjs", {
    type: "module",
    after: function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/lib/pdfjs/pdf.worker.min.mjs";
      Kl(window, "pdfjsLib");
      Kl(pdfjsLib.GlobalWorkerOptions, "workerSrc");
    },
  }),
  gN = lazyLoadScript("/lib/pdfjs/pdf.viewer.min.mjs", {
    type: "module",
    after: function () {
      Kl(window, "pdfjsViewer");
    },
  });
function loadPdfJs() {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, mN.promise];
        case 1:
          e.sent();
          return [2, window.pdfjsLib];
      }
    });
  });
}
function yN() {
  return __awaiter(this, undefined, undefined, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, mN.promise];
        case 1:
          e.sent();
          return [4, gN.promise];
        case 2:
          e.sent();
          return [2, window.pdfjsViewer];
      }
    });
  });
}
var bN = lazyLoadScript("/lib/codemirror/modes.min.js"),
  wN = lazyLoadScript("/lib/mermaid.min.js", {
    after: function () {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        themeVariables: {
          fontFamily: "var(--font-mermaid)",
        },
        flowchart: {
          useMaxWidth: !1,
        },
        sequence: {
          useMaxWidth: !1,
        },
        gantt: {
          useMaxWidth: true,
          axisFormatter: [
            [
              "%Y-%m-%d",
              function (e) {
                return e.getDay() === 1;
              },
            ],
          ],
        },
        journey: {
          useMaxWidth: !0,
        },
        class: {
          useMaxWidth: !0,
        },
        git: {
          useMaxWidth: !1,
        },
        state: {
          useMaxWidth: !0,
        },
        er: {
          useMaxWidth: !1,
        },
        pie: {
          useMaxWidth: !0,
        },
      });
    },
  });
function loadMermaid() {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, wN.promise];
        case 1:
          e.sent();
          return [2, mermaid];
      }
    });
  });
}
var CN = lazyLoadScript("/lib/prism.min.js", {
  before: function () {
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
  },
});
function loadPrism() {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, CN.promise];
        case 1:
          e.sent();
          return [2, Prism];
      }
    });
  });
}
var SN = lazyLoadScript("/lib/mathjax/tex-chtml-full.js", {
  before: function () {
    window.MathJax = {
      tex: {
        inlineMath: [],
        displayMath: [],
        processEscapes: false,
        processEnvironments: false,
        processRefs: false,
      },
      startup: {
        typeset: !1,
      },
      options: {
        enableMenu: false,
        menuOptions: {
          settings: {
            renderer: "CHTML",
          },
        },
        renderActions: {
          assistiveMml: [],
        },
        safeOptions: {
          safeProtocols: {
            http: true,
            https: true,
            file: true,
            javascript: false,
            data: false,
          },
        },
      },
    };
    window.publish && delete window.MathJax.options.renderActions;
    localStorage.removeItem("MathJax-Menu-Settings");
  },
});
function loadMathJax() {
  return __awaiter(this, undefined, Promise, function () {
    return __generator(this, function (e) {
      switch (e.label) {
        case 0:
          return [4, SN.promise];
        case 1:
          e.sent();
          return [2];
      }
    });
  });
}
function renderMath(e, display) {
  return MathJax.tex2chtml(e, {
    display: display,
  });
}
var TN = null,
  DN = 0,
  AN = null,
  PN = function () {
    var e = MathJax.chtmlStylesheet();
    (AN && e === AN) || (AN && AN.detach(), (AN = e), document.head.appendChild(e));
    AN.dataset.change = AN.dataset.change === "1" ? "2" : "1";
    TN.resolve();
    TN = null;
  };
function finishRenderMath() {
  TN || (TN = rx());
  clearTimeout(DN);
  DN = window.setTimeout(PN, 100);
  return TN.promise;
}
var IN =
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)(?:\/(?:[\w\-]+\?(?:.*?\&)*v=|embed\/|v\/)?)([\w\-]+)(?:\??&?(?:t|start)=([0-9]+))?(?:\S+)?$/,
  ON = /^(?:https?:\/\/)?(?:mobile\.)?(?:twitter|x)\.com\/.+\/(\d+)/;
function FN(e) {
  if (!e || typeof e != "string") return null;
  var t;
  if ((t = e.match(IN))) {
    e = "https://www.youtube.com/embed/" + t[1];
    t[2] && (e += "?start=" + t[2]);
    return e;
  }
  if ((t = e.match(ON))) {
    var n = document.body.hasClass("theme-dark");
    return "https://platform.twitter.com/embed/Tweet.html?dnt=true&theme="
      .concat(n ? "dark" : "light", "&id=")
      .concat(t[1]);
  }
  return null;
}
function NN(src) {
  var t = createEl("iframe", "external-embed mod-receives-events");
  t.setAttr("sandbox", "allow-forms allow-presentation allow-same-origin allow-scripts allow-modals allow-popups");
  t.setAttr("allow", "fullscreen");
  t.setAttr("frameborder", "0");
  t.src = src;
  src.contains("platform.twitter.com") &&
    (t.setAttr("scrolling", "no"),
    (function (e, t) {
      e.addEventListener("framemessage", function (e) {
        if (e.detail) {
          t(e.detail);
        }
      });
      BN(e.win);
      e.onWindowMigrated(function () {
        return BN(e.win);
      });
    })(t, function (e) {
      var n = e.data;
      if (n) {
        var i = n["twttr.embed"];
        if (i && i.method === "twttr.private.resize") {
          var r = i.params[0].height;
          if (Number.isNumber(r)) {
            t.style.height = String(Math.min(1e3, r)) + "px";
          }
        }
      }
    }));
  return t;
}
var RN = new WeakSet();
function BN(e) {
  if (!RN.has(e)) {
    RN.add(e);
    e.addEventListener("message", function (detail) {
      for (var n = 0, i = e.document.body.findAll("iframe"); n < i.length; n++) {
        var r = i[n];
        if (r.contentWindow === detail.source)
          return void r.dispatchEvent(
            new CustomEvent("framemessage", {
              bubbles: false,
              detail: detail,
            }),
          );
      }
    });
  }
}
var VN = (function () {
    function e() {
      this.map = new WeakMap();
    }
    e.prototype.get = function (e) {
      return this.map.get(e);
    };
    e.prototype.set = function (e, t) {
      this.map.set(e, t);
      return this;
    };
    e.prototype.has = function (e) {
      return this.map.has(e);
    };
    e.prototype.delete = function (e) {
      return this.map.delete(e);
    };
    return e;
  })(),
  HN = 0,
  zN = (function () {
    function e() {
      this._ = "_weakmap_" + HN++;
    }
    e.prototype.get = function (e) {
      return this.has(e) ? e[this._] : undefined;
    };
    e.prototype.set = function (e, value) {
      Object.defineProperty(e, this._, {
        configurable: true,
        value: value,
      });
      return this;
    };
    e.prototype.has = function (e) {
      return Object.hasOwnProperty.call(e, this._);
    };
    e.prototype.delete = function (e) {
      return this.has(e) && delete e[this._];
    };
    return e;
  })();
function qN() {
  return window.WeakMap ? new VN() : new zN();
}
var WN = (function () {
  function e(worker) {
    this.promise = null;
    this.worker = worker;
    this.worker.onmessage = this.onReceiveMessageFromWorker.bind(this);
  }
  e.prototype.onReceiveMessageFromWorker = function (e) {
    if (this.promise) {
      var t = this.promise;
      this.promise = null;
      t.resolve(e.data);
    }
  };
  e.prototype.submit = function (e, t) {
    return this.promise ? null : ((this.promise = rx()), this.worker.postMessage(e, t), this.promise.promise);
  };
  return e;
})();
function UN(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n;
    return __generator(this, function (i) {
      switch (i.label) {
        case 0:
          return [
            4,
            ajaxPromise({
              url: e,
            }),
          ];
        case 1:
          n = i.sent();
          return [2, new Worker(window.URL.createObjectURL(new Blob([n])), t)];
      }
    });
  });
}
function _N(e, t) {
  return __awaiter(this, undefined, undefined, function () {
    return __generator(this, function (n) {
      if (Wl) return [2, UN(e, t)];
      try {
        return [2, new Worker(e, t)];
      } catch (t) {
        return [2, UN(e)];
      }
      return [2];
    });
  });
}