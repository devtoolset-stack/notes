var WorkspaceTabs = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.type = "tabs";
      i.children = [];
      i.parent = null;
      i.allowSingleChild = true;
      i.autoManageDOM = false;
      i.tabHeaderEls = [];
      i.currentTab = 0;
      i.hasLockedTabWidths = false;
      i.isStacked = false;
      i.containerEl.addClass("workspace-tabs");
      var r = (i.tabHeaderContainerEl = i.containerEl.createDiv("workspace-tab-header-container")),
        o = (i.tabsInnerEl = r.createDiv("workspace-tab-header-container-inner")),
        a = (i.tabsContainerEl = i.containerEl.createDiv("workspace-tab-container"));
      i.containerEl.on("click", ".workspace-tab-header", function (e, t) {
        var n = i.tabHeaderEls.indexOf(t);
        if (-1 !== n) {
          i.selectTabIndex(n);
          var r = i.children[n];
          if (r instanceof WorkspaceLeaf) {
            i.workspace.setActiveLeaf(r, {
              focus: !0,
            });
          }
        }
      });
      o.addEventListener("wheel", k1, {
        passive: !1,
      });
      window.frameDom && DK(r);
      r.addEventListener("mouseleave", function () {
        i.unlockTabWidths();
      });
      a.addEventListener(
        "scroll",
        function () {
          return i.onContainerScroll();
        },
        {
          passive: !0,
        },
      );
      r.createDiv("workspace-tab-header-new-tab", function (e) {
        e.createSpan("clickable-icon", function (e) {
          setTooltip(e, i18nProxy.interface.labelNewTab());
          setIcon(e, "lucide-plus");
          e.addEventListener("click", function () {
            var e = new WorkspaceLeaf(i.app);
            i.insertChild(i.children.length, e);
            i.selectTabIndex(i.children.length);
            i.workspace.setActiveLeaf(e, {
              focus: !0,
            });
          });
        });
      });
      r.createDiv("workspace-tab-header-spacer");
      r.createDiv("workspace-tab-header-tab-list", function (e) {
        e.createSpan("clickable-icon", function (e) {
          setIcon(e, "lucide-chevron-down");
          var t = function (t) {
            if (!e.classList.contains("has-active-menu")) {
              var n = new Menu().addSections(["action", "close", "", "tablist"]);
              n.dom.addClass("mod-tab-list");
              n.addItem(function (e) {
                return e
                  .setSection("action")
                  .setTitle(i.isStacked ? i18nProxy.interface.menu.unstackTabs() : i18nProxy.interface.menu.stackTabs())
                  .setIcon("lucide-layers")
                  .onClick(function () {
                    i.setStacked(!i.isStacked);
                  });
              }).addItem(function (e) {
                return e
                  .setSection("close")
                  .setTitle(i18nProxy.interface.menu.closeAll())
                  .setIcon("lucide-x")
                  .onClick(function () {
                    for (var e = 0, t = i.children.slice(); e < t.length; e++) {
                      var n = t[e];
                      if (!n.pinned) {
                        n.detach();
                      }
                    }
                  });
              });
              i.workspace.trigger("tab-group-menu", n, i);
              for (
                var r = function (e) {
                    var t = i.children[e];
                    if (!(t instanceof WorkspaceLeaf)) return "continue";
                    var r = t,
                      o = t.view;
                    if (!o) return "continue";
                    n.addItem(function (t) {
                      return t
                        .setSection("tablist")
                        .setTitle(o.getDisplayText())
                        .setChecked(e === i.currentTab)
                        .setIcon(o.getIcon())
                        .onClick(function () {
                          i.workspace.setActiveLeaf(r);
                        });
                    });
                  },
                  o = 0;
                o < i.children.length;
                o++
              )
                r(o);
              var a = e.getBoundingClientRect();
              n.setParentElement(e).showAtPosition({
                x: a.x,
                y: a.bottom,
                width: a.width,
                overlap: true,
                left: true,
              });
            }
          };
          e.addEventListener("click", t);
          e.addEventListener("contextmenu", t);
        });
      });
      i.app.dragManager.handleDrop(r, function (e, t, n) {
        if (t.type === "file" || t.type === "files" || t.type === "link" || t.type === "bookmarks") {
          var r = i.getTabInsertLocation(e.clientX),
            o = r.rect,
            a = r.index,
            s = r.droppedIndex;
          if (t.type === "link") {
            if (s !== null)
              if ((l = i.children[s]).canNavigate()) {
                n ||
                  (i.workspace.setActiveLeaf(l),
                  l.openLinkText(t.linktext, t.sourcePath, {
                    active: true,
                  }));
                return {
                  hoverEl: l.tabHeaderEl,
                  hoverClass: "is-highlighted",
                  action: i18nProxy.interface.dragAndDrop.openInThisTab(),
                  dropEffect: "move",
                };
              }
            if (!n) {
              var l = new WorkspaceLeaf(i.app);
              i.insertChild(a, l);
              l.openLinkText(t.linktext, t.sourcePath, {
                active: true,
              });
            }
          } else if (t.type === "bookmarks") {
            var c = i.app.internalPlugins.getEnabledPluginById("bookmarks"),
              u = t.items
                .map(function (e) {
                  return e.item;
                })
                .filter(function (e) {
                  return e.type === "file" || e.type === "graph";
                });
            if (c) {
              if (s !== null) {
                if (u.length !== 1) return;
                if ((l = i.children[s]).canNavigate()) {
                  n ||
                    (i.workspace.setActiveLeaf(l),
                    c.openBookmarkInLeaf(u[0], l, {
                      active: !0,
                    }));
                  return {
                    hoverEl: l.tabHeaderEl,
                    hoverClass: "is-highlighted",
                    action: i18nProxy.interface.dragAndDrop.openInThisTab(),
                    dropEffect: "move",
                  };
                }
              } else if (u.length === 0) return;
              if (!n) {
                for (var h = [], p = 0; p < u.length; p++) {
                  var d = new WorkspaceLeaf(i.app);
                  i.insertChild(a, d);
                  a++;
                  h.push(d);
                }
                __awaiter(i, undefined, undefined, function () {
                  var e, t;
                  return __generator(this, function (n) {
                    switch (n.label) {
                      case 0:
                        e = 0;
                        n.label = 1;
                      case 1:
                        return e < u.length
                          ? ((t = h[e]),
                            [
                              4,
                              c.openBookmarkInLeaf(u[e], t, {
                                active: true,
                              }),
                            ])
                          : [3, 4];
                      case 2:
                        n.sent();
                        n.label = 3;
                      case 3:
                        e++;
                        return [3, 1];
                      case 4:
                        this.workspace.setActiveLeaf(h.last(), {
                          focus: true,
                        });
                        return [2];
                    }
                  });
                });
              }
            }
          } else {
            var f = (t.type === "files" ? t.files : [t.file]).filter(function (e) {
              return e instanceof TFile;
            });
            if (f.length === 0) return;
            if (f.length === 1 && s !== null)
              if ((l = i.children[s]).canNavigate()) {
                n ||
                  (i.workspace.setActiveLeaf(l),
                  l.openFile(f[0], {
                    active: !0,
                  }));
                return {
                  hoverEl: l.tabHeaderEl,
                  hoverClass: "is-highlighted",
                  action: i18nProxy.interface.dragAndDrop.openInThisTab(),
                  dropEffect: "move",
                };
              }
            if (!n) {
              var m = [];
              for (p = 0; p < f.length; p++) {
                d = new WorkspaceLeaf(i.app);
                i.insertChild(a, d);
                a++;
                m.push(d);
              }
              __awaiter(i, undefined, undefined, function () {
                var e;
                return __generator(this, function (t) {
                  switch (t.label) {
                    case 0:
                      e = 0;
                      t.label = 1;
                    case 1:
                      return e < f.length
                        ? [
                            4,
                            m[e].openFile(f[e], {
                              active: !1,
                            }),
                          ]
                        : [3, 4];
                    case 2:
                      t.sent();
                      t.label = 3;
                    case 3:
                      e++;
                      return [3, 1];
                    case 4:
                      this.workspace.setActiveLeaf(m.last(), {
                        focus: true,
                      });
                      return [2];
                  }
                });
              });
            }
          }
          i.app.dragManager.showOverlay(e.doc, o);
          return {
            action: i18nProxy.interface.dragAndDrop.openAsTab(),
            dropEffect: "copy",
          };
        }
      });
      new ResizeObserver(i.updateSlidingTabs.bind(i)).observe(i.tabsContainerEl);
      return i;
    }
    __extends(t, e);
    t.createFrom = function (e, n) {
      var i = new t(e);
      i.insertChild(0, n);
      return i;
    };
    t.prototype.setStacked = function (isStacked) {
      Platform.canStackTabs || (isStacked = false);
      this.isStacked !== isStacked &&
        ((this.isStacked = isStacked),
        this.containerEl.toggleClass("mod-stacked", isStacked),
        this.children.length > 0 &&
          (this.updateTabDisplay(), this.scrollIntoView(this.currentTab), this.workspace.requestUpdateLayout()));
    };
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      this.currentTab > 0 && (t.currentTab = this.currentTab);
      this.isStacked && (t.stacked = true);
      return t;
    };
    t.prototype.selectTabIndex = function (currentTab) {
      var t;
      currentTab = Math.clamp(currentTab, 0, this.children.length - 1);
      this.currentTab !== currentTab &&
        ((this.currentTab = currentTab),
        this.updateTabDisplay(),
        this.isStacked &&
          ((t = this.children[this.currentTab]) === null || undefined === t || t.containerEl.removeClass("is-hidden"),
          this.scrollIntoView(this.currentTab)),
        this.workspace.requestSaveLayout(),
        this.workspace.requestResize());
    };
    t.prototype.selectTab = function (e) {
      var t = this.children.indexOf(e);
      if (-1 !== t) {
        this.selectTabIndex(t);
      }
    };
    t.prototype.updateTabDisplay = function () {
      var e = this,
        t = e.isStacked,
        currentTab = e.currentTab,
        i = e.tabsInnerEl,
        r = e.tabsContainerEl,
        o = e.children;
      if (o.length !== 0) {
        if ((currentTab = Math.clamp(currentTab, 0, o.length - 1)) !== this.currentTab) {
          this.currentTab = currentTab;
          this.workspace.requestSaveLayout();
          this.workspace.requestResize();
        }
        for (var tabHeaderEls = [], s = [], l = 0, c = o; l < c.length; l++) {
          var u = (I = c[l]).tabHeaderEl;
          tabHeaderEls.push(u);
          t && (s.push(u), I.loadIfDeferred());
          s.push(I.containerEl);
        }
        this.tabHeaderEls = tabHeaderEls;
        for (var h = new Set(s), p = 0, d = Array.from(r.children); p < d.length; p++) {
          var f = d[p];
          if (!h.has(f)) {
            saveScrollPositions(f);
          }
        }
        for (var m = 0, g = o; m < g.length; m++) {
          if ((f = (I = g[m]).containerEl).parentNode !== r) {
            saveScrollPositions(f);
          }
        }
        if (t)
          for (var v = r.firstChild, y = new Set(), b = 0; b < s.length; b++) {
            if ((f = s[b]).parentNode === r) {
              for (; v && (!h.has(v) || y.has(v)); ) v = v.nextSibling;
              v !== f ? (saveScrollPositions(f), y.add(f)) : (v = v.nextSibling);
            }
          }
        var w = null;
        for (b = 0; b < o.length; b++) {
          var k = b === currentTab;
          (u = (I = o[b]).tabHeaderEl).toggleClass("is-active", k);
          I.containerEl.toggle(t || k);
          b === currentTab && (w = I);
          t && pl(u);
        }
        if (t) r.setChildrenInPlace(s);
        else {
          for (var C = 0, E = Array.from(r.children); C < E.length; C++) {
            f = E[C];
            if (!h.has(f)) {
              f.detach();
            }
          }
          for (var S = 0, M = o; S < M.length; S++) {
            if ((f = (I = M[S]).containerEl).parentNode !== r) {
              r.appendChild(f);
            }
          }
        }
        if ((restoreScrollPositionsWalk(r), this.updateSlidingTabs(), !t)) {
          if (i.isShown()) {
            for (
              var x = [], T = [], D = i.firstChild, A = new Set(tabHeaderEls), P = 0, L = tabHeaderEls;
              P < L.length;
              P++
            ) {
              for (var I = L[P]; D && !A.has(D); ) {
                f = D;
                D = D.nextSibling;
                x.push(f);
              }
              I !== D ? (I.parentNode !== i && T.push(I), i.insertBefore(I, D)) : (D = D.nextSibling);
            }
            for (; D; ) {
              f = D;
              D = D.nextSibling;
              x.push(f);
            }
            for (var O = 0, F = T; O < F.length; O++) {
              (H = F[O]).style.flex = "";
              H.style.width = "";
            }
            for (var N = [], R = [], B = 0, V = T; B < V.length; B++) {
              var H = V[B];
              N.push(H.clientWidth);
            }
            for (var z = 0, q = x; z < q.length; z++) {
              H = q[z];
              R.push(H.clientWidth);
            }
            var W = function (e) {
              var t = T[e],
                n = N[e];
              pl(t, !0);
              t.style.flex = "0 0 auto";
              fl(
                t,
                new cl({
                  duration: 200,
                })
                  .addProp("width", "0", n + "px", "")
                  .addProp("opacity", "0", "1", ""),
                function () {
                  t.style.flex = "";
                },
              );
            };
            for (b = 0; b < T.length; b++) W(b);
            var U = function (e) {
              var t = x[e],
                n = R[e],
                i = t.cloneNode(!0);
              t.replaceWith(i);
              i.style.flex = "0 0 auto";
              fl(
                i,
                new cl({
                  duration: 200,
                })
                  .addProp("width", n + "px", "0", "")
                  .addProp("opacity", "1", "0", ""),
                function () {
                  i.detach();
                },
              );
            };
            for (b = 0; b < x.length; b++) U(b);
          } else i.setChildrenInPlace(tabHeaderEls);
          if (w) {
            i.style.setProperty("--animation-dur", "0s");
            this.getRoot() instanceof WorkspaceSidedock && (i.scrollLeft = w.tabHeaderEl.clientWidth * currentTab);
            this.containerEl.isShown() && w.loadIfDeferred();
            i.style.setProperty("--animation-dur", "250ms");
          }
        }
      } else r.empty();
    };
    t.prototype.recomputeChildrenDimensions = function () {
      this.updateTabDisplay();
    };
    t.prototype.getTabInsertLocation = function (e) {
      for (
        var t = this.tabHeaderEls,
          n = this.children,
          rect = this.tabHeaderContainerEl.getBoundingClientRect(),
          index = t.length,
          droppedIndex = null,
          a = 0;
        a < n.length;
        a++
      ) {
        var s = n[a].tabHeaderEl.getBoundingClientRect(),
          l = s.x,
          c = s.right;
        if (a === n.length - 1 || e <= c) {
          rect = {
            x: l,
            y: s.y,
            width: 10,
            height: s.height,
          };
          index = a;
          var u = (l + c) / 2;
          Math.abs(e - u) / (c - l) < 0.25 && (droppedIndex = a);
          e > u && (index++, (rect.x = c));
          break;
        }
      }
      rect.x -= 5;
      return {
        rect: rect,
        index: index,
        droppedIndex: droppedIndex,
      };
    };
    t.prototype.insertChild = function (t, n) {
      e.prototype.insertChild.call(this, t, n);
      n instanceof WorkspaceLeaf && (n.updateHeader(), pl(n.tabHeaderEl));
      this.unlockTabWidths();
    };
    t.prototype.removeChild = function (t) {
      var n = this.children.indexOf(t),
        i = this.currentTab,
        r = this.children[i];
      t.tabHeaderEl.removeClass("is-active");
      this.children.length === 1 && (this.workspace.lastTabGroupStacked = this.isStacked);
      e.prototype.removeChild.call(this, t);
      this.children.length > 0 && n === i
        ? ((this.currentTab = Math.max(0, n - 1)), this.workspace.onLayoutChange(this))
        : (this.currentTab = this.children.indexOf(r));
    };
    t.prototype.lockTabWidths = function () {
      if (this.tabHeaderContainerEl.isShown() && !this.isStacked) {
        this.hasLockedTabWidths = true;
        for (var e = [], t = 0, n = this.children; t < n.length; t++) {
          var i = n[t];
          e.push(i.tabHeaderEl.clientWidth);
        }
        for (var r = 0; r < this.children.length; r++) this.children[r].tabHeaderEl.style.width = e[r] + "px";
      }
    };
    t.prototype.unlockTabWidths = function () {
      if (this.hasLockedTabWidths)
        if (((this.hasLockedTabWidths = false), this.tabHeaderContainerEl.isShown())) {
          for (var e = [], t = 0, n = this.children; t < n.length; t++) {
            var i = n[t];
            e.push(i.tabHeaderEl.clientWidth);
          }
          for (var r = 0; r < this.children.length; r++) {
            fl(
              this.children[r].tabHeaderEl,
              new cl({
                duration: 250,
              }).addProp("width", e[r] + "px", ""),
            );
          }
        } else
          for (var o = 0, a = this.children; o < a.length; o++) {
            (i = a[o]).tabHeaderEl.style.width = "";
          }
    };
    t.prototype.updateSlidingTabs = function () {
      var e = this,
        t = e.isStacked,
        n = e.children,
        i = e.tabsContainerEl;
      if (t) {
        for (var r = 0, o = [], a = 0; a < n.length; a++) {
          var s = (m = n[a]).tabHeaderEl.offsetWidth;
          o.push(s);
          r += s;
        }
        var l = i.clientWidth,
          c = Math.max(300, l - r),
          u = c / n.length,
          h = 0,
          p = r;
        for (a = 0; a < n.length; a++) {
          (m = n[a]).tabHeaderEl.style.left = h + "px";
          h += o[a];
          p -= o[a];
          m.tabHeaderEl.style.right = p + "px";
          m.containerEl.style.left = h + "px";
          m.containerEl.style.minWidth = u + "px";
          m.containerEl.style.maxWidth = c + "px";
        }
        this.onContainerScroll();
      } else
        for (var d = 0, f = this.children; d < f.length; d++) {
          var m;
          (m = f[d]).tabHeaderEl.style.left = "";
          m.tabHeaderEl.style.right = "";
          m.containerEl.style.left = "";
          m.containerEl.style.minWidth = "";
          m.containerEl.style.maxWidth = "";
        }
    };
    t.prototype.onContainerScroll = function () {
      var e = this,
        t = e.isStacked,
        n = e.children,
        i = e.currentTab,
        r = e.tabsContainerEl;
      if (t) {
        for (var o = [], a = [], s = 0; s < n.length; s++) {
          var l = n[s];
          o.push(l.tabHeaderEl.offsetWidth);
          a.push(l.containerEl.offsetWidth);
        }
        var c = r.scrollLeft,
          u = c + r.clientWidth,
          h = 0;
        for (s = 0; s < n.length; s++) {
          var p = h + o[s],
            d = p + a[s];
          h = d;
          var f = s !== i && (d <= c || p >= u);
          n[s].containerEl.toggleClass("is-hidden", f);
        }
      }
    };
    t.prototype.scrollIntoView = function (e) {
      var t = this.children,
        n = this.tabsContainerEl,
        i = t[e];
      if (i) {
        for (var r = 0, o = 0, a = 0, s = 0; s < t.length; s++) {
          var l = t[s],
            c = l.tabHeaderEl.offsetWidth;
          s <= e ? ((r += c), (a += c), s < e && (a += l.containerEl.offsetWidth)) : (o += c);
        }
        var leftu0 = a - r,
          left = a + i.containerEl.offsetWidth - n.clientWidth + o,
          p = n.scrollLeft;
        p < left
          ? n.scrollTo({
              behavior: "smooth",
              left: left,
            })
          : p > leftu0 &&
            n.scrollTo({
              behavior: "smooth",
              left: leftu0,
            });
      }
    };
    return t;
  })(WorkspaceParent),
  E1 = (function () {
    function e(owner) {
      this.owner = owner;
      this.backHistory = [];
      this.forwardHistory = [];
    }
    e.prototype.updateState = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              t = e.state;
              n = e.eState;
              t.popstate = true;
              return [4, this.owner.setViewState(t, n)];
            case 1:
              i.sent();
              this.owner.trigger("history-change");
              return [2];
          }
        });
      });
    };
    e.prototype.forward = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          return [2, this.go(1)];
        });
      });
    };
    e.prototype.back = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          return [2, this.go(-1)];
        });
      });
    };
    e.prototype.pushState = function (e) {
      var t = this.backHistory;
      t.push(e);
      t.length > 20 && t.unshift();
      this.forwardHistory = [];
      this.owner.trigger("history-change");
    };
    e.prototype.go = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              if (this.owner.working) {
                new Notice(i18nProxy.interface.msgTabBusy());
                return [2];
              }
              for (t = this.owner.getHistoryState(), n = t; e > 0 && (i = this.forwardHistory.pop()); ) {
                this.backHistory.push(n);
                n = i;
                e--;
              }
              for (; e < 0 && (i = this.backHistory.pop()); ) {
                this.forwardHistory.push(n);
                n = i;
                e++;
              }
              return n === t ? [3, 2] : [4, this.updateState(n)];
            case 1:
              r.sent();
              r.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    e.prototype.serialize = function () {
      return {
        backHistory: __spreadArray([], this.backHistory, !0),
        forwardHistory: __spreadArray([], this.forwardHistory, !0),
      };
    };
    e.prototype.deserialize = function (e) {
      if (e) {
        e.backHistory && (this.backHistory = e.backHistory);
        e.forwardHistory && (this.forwardHistory = e.forwardHistory);
        this.owner.trigger("history-change");
      }
    };
    return e;
  })(),
  WorkspaceLeaf = (function (e) {
    function t(app, n) {
      var hoverParent = e.call(this, app.workspace, n) || this;
      hoverParent.type = "leaf";
      hoverParent.activeTime = 0;
      hoverParent.history = new E1(hoverParent);
      hoverParent.hoverPopover = null;
      hoverParent.tabHeaderEl = null;
      hoverParent.tabHeaderInnerIconEl = null;
      hoverParent.tabHeaderInnerTitleEl = null;
      hoverParent.tabHeaderStatusContainerEl = null;
      hoverParent.tabHeaderStatusPinEl = null;
      hoverParent.tabHeaderStatusLinkEl = null;
      hoverParent.tabHeaderCloseEl = null;
      hoverParent.group = null;
      hoverParent.pinned = false;
      hoverParent.width = 0;
      hoverParent.height = 0;
      hoverParent.resizeObserver = null;
      hoverParent.working = false;
      hoverParent.app = app;
      var r = hoverParent.containerEl;
      r.addClass("workspace-leaf");
      r.addEventListener("focusin", function () {
        hoverParent.app.workspace.setActiveLeaf(hoverParent);
      });
      r.addEventListener(
        "pointerdown",
        function () {
          hoverParent.app.workspace.setActiveLeaf(hoverParent);
        },
        {
          capture: !0,
        },
      );
      var o = function () {
          if (hoverParent.parent instanceof WorkspaceTabs) {
            var e = hoverParent.parent.children;
            hoverParent === e.last() ? hoverParent.parent.unlockTabWidths() : hoverParent.parent.lockTabWidths();
          }
          hoverParent.detach();
        },
        targetEl = (hoverParent.tabHeaderEl = createDiv("workspace-tab-header tappable"));
      targetEl.draggable = true;
      targetEl.createDiv("workspace-tab-header-inner", function (e) {
        hoverParent.tabHeaderInnerIconEl = e.createDiv("workspace-tab-header-inner-icon");
        hoverParent.tabHeaderInnerTitleEl = e.createDiv("workspace-tab-header-inner-title");
        hoverParent.tabHeaderStatusContainerEl = e.createDiv("workspace-tab-header-status-container");
        hoverParent.tabHeaderCloseEl = e.createDiv("workspace-tab-header-inner-close-button", function (e) {
          setIcon(e, "lucide-x");
          setTooltip(e, i18nProxy.interface.menu.close());
          e.addEventListener("click", o);
        });
      });
      targetEl.addEventListener("dragstart", function (e) {
        hoverParent.workspace.onDragLeaf(e, hoverParent);
      });
      targetEl.addEventListener("contextmenu", function (e) {
        return hoverParent.onOpenTabHeaderMenu(e, targetEl);
      });
      targetEl.addEventListener("mousedown", function (e) {
        if (e.button === 1) {
          e.preventDefault();
        }
      });
      targetEl.addEventListener("auxclick", function (e) {
        if (e.button === 1) {
          o();
        }
      });
      targetEl.addEventListener("mouseover", function (event) {
        var t;
        if (!event.defaultPrevented && Mc(event, targetEl)) {
          var linktext = (t = hoverParent.getViewState().state) === null || undefined === t ? undefined : t.file;
          if (linktext && String.isString(linktext))
            if (hoverParent.app.vault.getFileByPath(linktext)) {
              hoverParent.workspace.trigger("hover-link", {
                event: event,
                source: "tab-header",
                hoverParent: hoverParent,
                targetEl: targetEl,
                linktext: linktext,
              });
            }
        }
      });
      var s = debounce(hoverParent.onResize.bind(hoverParent), 20, !0),
        l = (hoverParent.resizeObserver = new ResizeObserver(function (e) {
          for (var t = 0, n = e; t < n.length; t++) {
            if (n[t].target === r) {
              var width = r.offsetWidth,
                height = r.offsetHeight;
              return void (
                (width === hoverParent.width && height === hoverParent.height) ||
                ((hoverParent.width = width), (hoverParent.height = height), s())
              );
            }
          }
        }));
      l.observe(r);
      hoverParent.view = hoverParent._empty = new Pj(hoverParent);
      hoverParent.view.open(hoverParent.containerEl);
      return hoverParent;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this);
      this.pinned && (t.pinned = true);
      t.state = this.getViewState();
      this.group && (t.group = this.group);
      return t;
    };
    t.prototype.canNavigate = function () {
      return this.view.navigation && !this.pinned;
    };
    t.prototype.openFile = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, typei0, state, active, group, s, l;
        return __generator(this, function (c) {
          switch (c.label) {
            case 0:
              return e
                ? ((t = t || {}),
                  (n = this.view),
                  (typei0 = this.app.viewRegistry.getTypeByExtension(e.extension)),
                  n && n instanceof FileView && n.canAcceptExtension(e.extension) && (typei0 = n.getViewType()),
                  typei0
                    ? ((state = t.state || {}),
                      (active = (l = t.active) !== null && undefined !== l ? l : this === this.workspace.activeLeaf),
                      (group = t.group),
                      (state.file = e.path),
                      (s = {
                        type: typei0,
                        state: state,
                        active: active,
                        group: group,
                      }),
                      [4, this.setViewState(s, t.eState)])
                    : (this.app.openWithDefaultApp(e.path), [2]))
                : [2];
            case 1:
              c.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.openLinkText = function (e, t, n) {
      return __awaiter(this, undefined, undefined, function () {
        var i, r, o, subpath, s, state, eState, u, h;
        return __generator(this, function (p) {
          switch (p.label) {
            case 0:
              i = this.app;
              p.label = 1;
            case 1:
              p.trys.push([1, 6, , 7]);
              n = n || {};
              r = parseLinktext(e);
              o = r.path;
              subpath = r.subpath;
              s = i.metadataCache.getFirstLinkpathDest(o, t);
              state = n.state || {};
              eState = n.eState || {};
              return s ? (subpath && (eState.subpath = subpath), [3, 4]) : [3, 2];
            case 2:
              u = null;
              o.contains("/") || (u = i.fileManager.getNewFileParent(t, e));
              return [4, i.fileManager.createNewFile(u, o)];
            case 3:
              s = p.sent();
              state.mode = "source";
              p.label = 4;
            case 4:
              n.state = state;
              n.eState = eState;
              return [4, this.openFile(s, n)];
            case 5:
              p.sent();
              return [3, 7];
            case 6:
              h = p.sent();
              new Notice(h.message);
              console.error(h);
              return [2];
            case 7:
              return [2];
          }
        });
      });
    };
    t.prototype.open = function (view) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              t = this.view;
              return view === t
                ? [2, view]
                : t
                  ? ((n = t.close()), t instanceof j$ || t instanceof Pj ? [3, 2] : [4, n])
                  : [3, 2];
            case 1:
              r.sent();
              r.label = 2;
            case 2:
              this.containerEl.setChildrenInPlace([this.resizeHandleEl]);
              view || (view = this._empty);
              this.view = view;
              r.label = 3;
            case 3:
              r.trys.push([3, 5, , 6]);
              return [4, view.open(this.containerEl)];
            case 4:
              r.sent();
              return [3, 6];
            case 5:
              i = r.sent();
              console.error("Failed to open view", i);
              return [3, 6];
            case 6:
              return [2, view];
          }
        });
      });
    };
    t.prototype.highlight = function () {
      this.containerEl.addClass("is-highlighted");
    };
    t.prototype.unhighlight = function () {
      this.containerEl.removeClass("is-highlighted");
    };
    t.prototype.getViewState = function () {
      var e = this.view,
        t = this.pinned,
        n = {
          type: e ? e.getViewType() : "empty",
          state: e ? e.getState() : {},
        };
      t && (n.pinned = true);
      e && ((n.icon = e.getIcon() || undefined), (n.title = e.getDisplayText().trim() || undefined));
      return n;
    };
    t.prototype.setViewState = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l, c, u;
        return __generator(this, function (h) {
          switch (h.label) {
            case 0:
              if (this.working) return [2];
              this.working = true;
              h.label = 1;
            case 1:
              h.trys.push([1, , 10, 11]);
              n = this.view;
              i = n ? n.getViewType() : "";
              r = n instanceof j$;
              o = e.type !== i;
              a = undefined;
              !n || n instanceof Pj || (a = this.getHistoryState());
              s = {
                history: false,
                layout: false,
                close: !1,
              };
              return o || r
                ? ((l = this.app.viewRegistry.getViewCreatorByType(e.type)),
                  (n = l
                    ? a || r || !e.icon || undefined === e.title || this.containerEl.isShown()
                      ? l(this)
                      : new j$(this, e.type, e.icon, e.title)
                    : typeof e.type != "string" || e.type === "empty"
                      ? this._empty
                      : new G$(this, e.type)),
                  [4, this.open(n)])
                : [3, 3];
            case 2:
              h.sent();
              s.history = true;
              s.layout = true;
              h.label = 3;
            case 3:
              c = e.state || {};
              h.label = 4;
            case 4:
              h.trys.push([4, 6, , 7]);
              return [4, n.setState(c, s)];
            case 5:
              h.sent();
              return [3, 7];
            case 6:
              u = h.sent();
              console.error(u);
              return [3, 7];
            case 7:
              return s.close ? [4, this.open(null)] : [3, 9];
            case 8:
              h.sent();
              h.label = 9;
            case 9:
              e.active &&
                this.workspace.setActiveLeaf(this, {
                  focus: !0,
                });
              undefined !== e.group && this.setGroupMember(e.group);
              t && this.setEphemeralState(t);
              (e.popstate || c.sync || (r && !o)) && (s.history = false);
              s.layout && this.workspace.onLayoutChange();
              this.updateHeader();
              s.history && a && this.recordHistory(a);
              s.done && s.done();
              return [3, 11];
            case 10:
              this.working = false;
              return [7];
            case 11:
              return [2];
          }
        });
      });
    };
    Object.defineProperty(t.prototype, "isDeferred", {
      get: function () {
        return this.view instanceof j$;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.loadIfDeferred = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return this.view instanceof j$ ? [4, this.view.rerender()] : [3, 2];
            case 1:
              e.sent();
              e.label = 2;
            case 2:
              return [2];
          }
        });
      });
    };
    t.prototype.rebuildView = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              e = this.getViewState();
              t = this.getEphemeralState();
              return [4, this.open(null)];
            case 1:
              n.sent();
              return [4, this.setViewState(e, t)];
            case 2:
              n.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.getEphemeralState = function () {
      return this.view.getEphemeralState();
    };
    t.prototype.setEphemeralState = function (e) {
      if (e && e.focus) {
        var t = this.containerEl.doc.activeElement;
        if (
          t &&
          t.instanceOf(HTMLElement) &&
          t !== document.body &&
          this.containerEl !== t &&
          !this.containerEl.contains(t)
        ) {
          t.blur();
          getSelection().removeAllRanges();
        }
      }
      this.view.setEphemeralState(e);
    };
    t.prototype.togglePinned = function () {
      this.setPinned(!this.pinned);
    };
    t.prototype.setPinned = function (pinned) {
      this.pinned = pinned;
      this.trigger("pinned-change", pinned);
      this.updateHeader();
      this.workspace.requestSaveLayout();
      var t = this.group;
      if (t)
        for (var n = 0, i = this.workspace.getGroupLeaves(t); n < i.length; n++) {
          var r = i[n];
          if (r.pinned !== pinned) {
            r.setPinned(pinned);
          }
        }
    };
    t.prototype.canPin = function () {
      return this.parent instanceof WorkspaceTabs;
    };
    t.prototype.setGroupMember = function (e) {
      if (e !== this) {
        var t = null;
        e && ((t = e.group) || ((t = ic(16)), e.setGroup(t)));
        this.setGroup(t);
      }
    };
    t.prototype.setGroup = function (group) {
      if (group !== this.group) {
        var t = this.pinned;
        if (!t)
          for (var n = 0, i = this.workspace.getGroupLeaves(group); n < i.length; n++) {
            if (i[n].pinned) {
              t = true;
              break;
            }
          }
        this.setPinned(t);
        this.group = group;
        this.trigger("group-change", group);
        this.updateHeader();
        this.workspace.requestUpdateLayout();
      }
    };
    t.prototype.detach = function () {
      var t,
        n = (t = this.parent) === null || undefined === t ? undefined : t.id,
        i = this.getRoot().id;
      e.prototype.detach.call(this);
      var r = this,
        o = r.group,
        a = r.view,
        s = r.resizeObserver;
      if (o)
        for (var l = 0, c = this.workspace.getGroupLeaves(o); l < c.length; l++) {
          c[l].unhighlight();
        }
      a && (this.workspace.pushUndoHistory(this, n, i), a.close(), (this.view = this._empty));
      s && s.disconnect();
    };
    t.prototype.updateHeader = function () {
      var e,
        t,
        n = this;
      setIcon(this.tabHeaderInnerIconEl, this.getIcon());
      this.tabHeaderInnerTitleEl.setText(this.getDisplayText());
      this.group
        ? this.tabHeaderStatusLinkEl ||
          (this.tabHeaderStatusLinkEl = this.tabHeaderStatusContainerEl.createDiv(
            {
              cls: "workspace-tab-header-status-icon mod-linked",
              prepend: true,
            },
            function (e) {
              setIcon(e, "lucide-link");
              setTooltip(e, i18nProxy.interface.menu.unlinkTab());
              e.addEventListener("click", function () {
                for (var e = 0, t = n.workspace.getGroupLeaves(n.group); e < t.length; e++) {
                  t[e].unhighlight();
                }
                n.setGroup(null);
              });
              e.addEventListener("mouseover", function () {
                setIcon(e, "lucide-unlink");
                for (var t = 0, i = n.workspace.getGroupLeaves(n.group); t < i.length; t++) {
                  i[t].highlight();
                }
              });
              e.addEventListener("mouseout", function () {
                setIcon(e, "lucide-link");
                for (var t = 0, i = n.workspace.getGroupLeaves(n.group); t < i.length; t++) {
                  i[t].unhighlight();
                }
              });
            },
          ))
        : ((e = this.tabHeaderStatusLinkEl) === null || undefined === e || e.detach(),
          (this.tabHeaderStatusLinkEl = null));
      this.pinned
        ? (this.tabHeaderCloseEl.hide(),
          this.tabHeaderStatusPinEl ||
            (this.tabHeaderStatusPinEl = this.tabHeaderStatusContainerEl.createDiv(
              "workspace-tab-header-status-icon mod-pinned",
              function (e) {
                setIcon(e, "lucide-pin");
                setTooltip(e, i18nProxy.interface.menu.unpin());
                e.addEventListener("click", function () {
                  return n.setPinned(!1);
                });
              },
            )))
        : (this.tabHeaderCloseEl.show(),
          (t = this.tabHeaderStatusPinEl) === null || undefined === t || t.detach(),
          (this.tabHeaderStatusPinEl = null));
      setTooltip(this.tabHeaderEl, hc(this.getDisplayText(), 100), {
        delay: 300,
      });
      this.parent instanceof CJ && this.parent.recomputeChildrenDimensions();
      var i = this.view ? this.view.getViewType() : "";
      this.tabHeaderEl.setAttr("data-type", i);
      this.tabHeaderEl.toggleClass("mod-unknown", this.view && this.view instanceof G$);
    };
    t.prototype.getIcon = function () {
      var t = this.view.getIcon();
      return t || e.prototype.getIcon.call(this);
    };
    t.prototype.getDisplayText = function () {
      var e = this.view.getDisplayText();
      return e || "";
    };
    t.prototype.isVisible = function () {
      var e;
      return (
        (!Platform.isMobile ||
          !((e = this.app.mobileTabSwitcher) === null || undefined === e ? undefined : e.isVisible)) &&
        this.containerEl.isShown()
      );
    };
    t.prototype.onOpenTabHeaderMenu = function (e, t) {
      var n = this;
      e.preventDefault();
      var i = Menu.forEvent(e).addSections([
        "title",
        "close",
        "pane",
        "open",
        "action",
        "find",
        "info",
        "view",
        "view.linked",
        "system",
        "",
        "danger",
      ]);
      i.setSectionSubmenu("view.linked", {
        title: i18nProxy.interface.menu.openLinkedView(),
        icon: "lucide-link",
      });
      Platform.isPhone &&
        i.addItem(function (e) {
          return e
            .setSection("title")
            .setTitle(n.view.getDisplayText())
            .setIcon(n.view.getIcon())
            .setIsLabel(!0)
            .titleEl.addClass("u-muted");
        });
      this.view.onTabMenu(i);
      this.isVisible() &&
        (this.view.onPaneMenu(i, this.workspace.isInSidebar(this) ? "sidebar-context-menu" : "tab-header"),
        this.app.workspace.trigger("leaf-menu", i, this));
      i.setParentElement(t);
    };
    t.prototype.handleDrop = function (e, t, n) {
      if (t.type === "bookmarks") {
        var i = this.app.internalPlugins.getEnabledPluginById("bookmarks");
        if (i) {
          var r = t.items
            .map(function (e) {
              return e.item;
            })
            .filter(function (e) {
              return e.type === "file" || e.type === "graph";
            });
          if (r.length !== 1) return;
          if (!n) {
            i.openBookmarkInLeaf(r[0], this, {
              active: !0,
            });
          }
        }
        return {
          action: i18nProxy.interface.dragAndDrop.openInThisTab(),
          dropEffect: "move",
        };
      }
      if (t.type === "file" || t.type === "link") {
        n ||
          (this.workspace.setActiveLeaf(this),
          t.type === "file" ? this.openFile(t.file) : this.openLinkText(t.linktext, t.sourcePath));
        return {
          action: i18nProxy.interface.dragAndDrop.openInThisTab(),
          dropEffect: "move",
        };
      }
    };
    t.prototype.getHistoryState = function () {
      return {
        title: this.getDisplayText(),
        icon: this.getIcon(),
        state: this.getViewState(),
        eState: this.getEphemeralState(),
      };
    };
    t.prototype.recordHistory = function (e) {
      var t = this.view,
        n = this.history;
      if (t && t.navigation && !(t instanceof Pj)) {
        var i = n.backHistory.last();
        if (i) if (!(JSON.stringify(i.state) !== JSON.stringify(e.state))) return;
        n.pushState(e);
      }
    };
    t.prototype.onResize = function () {
      if (this.view) {
        this.view.onResize();
      }
    };
    t.prototype.trigger = function (t) {
      for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
      e.prototype.trigger.apply(this, __spreadArray([t], n, !1));
    };
    t.prototype.on = function (t, n, i) {
      return e.prototype.on.call(this, t, n, i);
    };
    return t;
  })(WorkspaceItem),
  WorkspaceRibbon = (function () {
    function e(workspace, t) {
      this.items = [];
      this.workspace = null;
      this.containerEl = null;
      this.ribbonItemsEl = null;
      this.ribbonSettingEl = null;
      this.workspace = workspace;
      var n = (this.containerEl = createDiv("workspace-ribbon side-dock-ribbon"));
      n.addClass("mod-".concat(t));
      t === "left" &&
        ((this.ribbonItemsEl = n.createDiv("side-dock-actions")),
        (this.ribbonSettingEl = n.createDiv("side-dock-settings")),
        Platform.isMobile || attachAutoScrollOnHover(n));
      n.addEventListener("contextmenu", this.onContextMenu.bind(this));
    }
    e.prototype.load = function (e) {
      var t;
      if (e.hasOwnProperty("hiddenItems")) {
        for (var n = e.hiddenItems, i = 0, r = this.items; i < r.length; i++) {
          var o = r[i];
          o.hidden = (t = n[o.id]) !== null && undefined !== t && t;
        }
        var a = Object.keys(n);
        this.items.sort(function (e, t) {
          return a.indexOf(e.id) - a.indexOf(t.id);
        });
      }
      this.onChange(!1);
    };
    e.prototype.serialize = function () {
      for (var hiddenItems = {}, t = 0, n = this.items; t < n.length; t++) {
        var i = n[t];
        hiddenItems[i.id] = i.hidden;
      }
      return {
        hiddenItems: hiddenItems,
      };
    };
    e.prototype.addRibbonItemButton = function (e, icon, title, callback) {
      var r = this,
        buttonEl = this.makeRibbonItemButton(icon, title, callback);
      Vc(
        buttonEl,
        buttonEl,
        this.ribbonItemsEl,
        5,
        function () {
          return null;
        },
        function (t) {
          var n = 0,
            i = 0;
          for (n = 0; n < r.items.length && i !== t; n++)
            if (r.items[n].buttonEl) {
              i++;
            }
          var o = r.items.find(function (t) {
            return t.id === e;
          });
          r.items.remove(o);
          r.items.splice(n, 0, o);
          r.onChange(!0);
        },
      );
      var a = this.items.find(function (t) {
        return t.id === e;
      });
      a
        ? ((a.title = title), (a.icon = icon), (a.callback = callback))
        : ((a = {
            id: e,
            icon: icon,
            title: title,
            callback: callback,
            hidden: false,
          }),
          this.items.push(a));
      a.buttonEl = buttonEl;
      this.onChange(!1);
      return buttonEl;
    };
    e.prototype.removeRibbonAction = function (e) {
      for (var t = 0, n = this.items; t < n.length; t++) {
        var i = n[t];
        if (i.id === e) {
          delete i.buttonEl;
          delete i.callback;
          break;
        }
      }
    };
    e.prototype.setCollapsedState = function (e) {
      this.containerEl.toggleClass("is-collapsed", e);
    };
    e.prototype.hide = function () {
      this.containerEl.addClass("is-hidden");
    };
    e.prototype.show = function () {
      this.containerEl.removeClass("is-hidden");
    };
    e.prototype.onChange = function (e) {
      for (var t = [], n = 0, i = this.items; n < i.length; n++) {
        var r = i[n],
          o = r.buttonEl;
        if (o) {
          o.toggle(!r.hidden);
          t.push(o);
        }
      }
      this.ribbonItemsEl.setChildrenInPlace(t);
      e && this.workspace.requestSaveLayout();
    };
    e.prototype.makeRibbonItemButton = function (e, t, n) {
      var i = createDiv("clickable-icon side-dock-ribbon-action");
      i.onClickEvent(n);
      setTooltip(i, t, {
        delay: 300,
        placement: "right",
      });
      setIcon(i, e);
      return i;
    };
    e.prototype.onContextMenu = function (e) {
      var t = this;
      if (e.target === this.containerEl) {
        for (
          var n = new Menu(),
            i = function (e) {
              if (!e.buttonEl) return "continue";
              n.addItem(function (n) {
                return n
                  .setSection("order")
                  .setTitle(e.title)
                  .setIcon(e.icon)
                  .setChecked(!e.hidden)
                  .onClick(function () {
                    e.hidden = !e.hidden;
                    t.onChange(!0);
                  });
              });
            },
            r = 0,
            o = this.items;
          r < o.length;
          r++
        ) {
          i(o[r]);
        }
        n.addItem(function (e) {
          return e
            .setSection("ribbon")
            .setTitle(i18nProxy.interface.optionHideRibbon())
            .setIcon("lucide-panel-left-close")
            .onClick(function () {
              t.workspace.app.vault.setConfig("showRibbon", !1);
            });
        });
        n.showAtMouseEvent(e);
      }
    };
    return e;
  })(),
  WorkspaceRoot = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.win = window;
      t.doc = document;
      return t;
    }
    __extends(t, e);
    return t;
  })(WorkspaceContainer),
  WorkspaceFloating = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.parent = null;
      t.children = [];
      t.type = "floating";
      t.allowSingleChild = true;
      t.autoManageDOM = false;
      return t;
    }
    __extends(t, e);
    return t;
  })(WorkspaceParent),
  WorkspaceWindow = (function (e) {
    function t(workspace, n, i) {
      var r = e.call(this, workspace, "vertical", n) || this;
      r.parent = null;
      r.children = [];
      r.type = "window";
      r.size = {};
      r.workspace = workspace;
      r.containerEl.addClass("mod-root", "workspace-window");
      r.component.load();
      var o = ["popup"];
      if (i) {
        if (i.size) {
          i.width = Math.max(i.size.width, 600);
          i.height = Math.max(i.size.height, 600);
        }
        for (var a = 0, s = ["x", "y", "width", "height"]; a < s.length; a++) {
          var l = s[a];
          if (i.hasOwnProperty(l)) {
            o.push("".concat(l, "=").concat(i[l]));
            r.size[l] = i[l];
          }
        }
      }
      try {
        var c = ET(getComputedStyle(window.document.body).backgroundColor);
        if (c) {
          o.push("background=" + DT(c));
        }
      } catch (e) {}
      var u = (r.win = window.open("about:blank", "_blank", o.join(",")));
      r.doc = u.document;
      var h = createEl("base", {
        href: location.href,
      });
      if (
        (u.document.head.appendChild(h),
        MK(u),
        AK(u),
        (u.app = r.workspace.app),
        initTooltipListeners(u.document),
        C9(u),
        SK(u),
        (r.rootEl = u.document.body.createDiv("app-container"))
          .createDiv("horizontal-main-container")
          .createDiv("workspace")
          .appendChild(r.containerEl),
        (u.document.title = "Obsidian"),
        u.addEventListener("focus", function () {
          activeWindow = u;
          activeDocument = u.document;
          r.onFocus();
        }),
        u.addEventListener("beforeunload", function () {
          r.close();
        }),
        (u.history.forward = function () {
          return window.history.forward();
        }),
        (u.history.back = function () {
          return window.history.back();
        }),
        (u.history.go = function (e) {
          return window.history.go(e);
        }),
        u.addEventListener(
          "resize",
          debounce(function () {
            r.workspace.iterateLeaves(r, function (e) {
              return e.onResize();
            });
            r.workspace.requestSaveLayout();
            r.updateSize();
          }, 50),
        ),
        sm(u.document),
        CK(u),
        (r.cleanup = EK(u, [h])),
        r.component.registerEvent(
          r.workspace.on("quit", function () {
            u.close();
          }),
        ),
        r.component.registerEvent(
          r.workspace.on("layout-change", function () {
            r.updateTitle();
          }),
        ),
        u.electronWindow.show(),
        i)
      ) {
        if (i.maximize) {
          u.electronWindow.maximize();
        }
        var p = i.zoom;
        if (p && typeof p == "number") {
          u.electron.webFrame.setZoomLevel(p);
        }
      } else u.electron.webFrame.setZoomLevel(window.electron.webFrame.getZoomLevel());
      workspace.trigger("window-open", r, u);
      r.updateSize();
      return r;
    }
    __extends(t, e);
    t.prototype.serialize = function () {
      var t = e.prototype.serialize.call(this),
        n = this.win;
      if (n && !n.closed) {
        t.x = n.screenX;
        t.y = n.screenY;
        t.width = n.outerWidth;
        t.height = n.outerHeight;
        this.updateSize();
        var i = this.size;
        if (i) {
          Object.assign(t, i);
        }
        try {
          var r = this.win.electronWindow;
          t.maximize = r.isMaximized();
          t.zoom = r.webContents.zoomLevel;
        } catch (e) {}
      }
      return t;
    };
    t.prototype.updateSize = function () {
      if (this.win) {
        var e = this.win.electronWindow;
        if (e && !e.isMaximized() && !e.isMinimized() && !e.isFullScreen()) {
          var t = e.getBounds();
          this.size = {
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
          };
        }
      }
    };
    t.prototype.updateTitle = function () {
      if (this.win) {
        var e = this.workspace.getMostRecentLeaf(this);
        this.win.document.title = this.app.getAppTitle(e ? e.getDisplayText().trim() : "");
      }
    };
    t.prototype.detach = function () {
      this.close();
    };
    t.prototype.close = function () {
      e.prototype.detach.call(this);
      this.workspace.iterateLeaves(this, function (e) {
        e.detach();
      });
      var t = this,
        n = t.workspace,
        i = t.win,
        r = t.component,
        o = t.cleanup;
      activeWindow === i && ((activeWindow = window), (activeDocument = document));
      o && (o(), (this.cleanup = null));
      r.unload();
      i && (i.close(), n.trigger("window-close", this, i), (this.win = null));
    };
    t.prototype.removeChild = function (t) {
      e.prototype.removeChild.call(this, t);
      this.children.length === 0 && this.close();
    };
    return t;
  })(WorkspaceContainer),
  A1 = "workspace.json",
  P1 = "workspace-mobile.json",
  L1 = (function () {
    function e(workspace, vault) {
      this.workspace = workspace;
      this.vault = vault;
      this.lastOpenFiles = [];
      vault.on("create", this.onFileCreated, this);
      vault.on("rename", this.onRename, this);
    }
    e.prototype.load = function (lastOpenFiles) {
      this.lastOpenFiles = lastOpenFiles;
    };
    e.prototype.serialize = function () {
      return this.lastOpenFiles;
    };
    e.prototype.collect = function (e) {
      if (this.lastOpenFiles[0] !== e.path) {
        for (
          var t = {
              md: 25,
              canvas: 10,
              image: 10,
              other: 10,
            },
            lastOpenFiles = [e.path],
            i = 0,
            r = this.lastOpenFiles;
          i < r.length;
          i++
        ) {
          var o = r[i];
          if (o !== e.path) {
            var a = getExtension(o),
              s = "other";
            MARKDOWN_EXTENSIONS.contains(a) && (s = "md");
            CANVAS_EXTENSIONS.contains(a) && (s = "canvas");
            IMAGE_EXTENSIONS.contains(a) && (s = "image");
            var l = t[s];
            if (!(l <= 0)) {
              lastOpenFiles.push(o);
              t[s] = l - 1;
            }
          }
        }
        this.lastOpenFiles = lastOpenFiles;
      }
    };
    e.prototype.onFileOpen = function (e, t) {
      if (this.workspace.layoutReady && t) {
        this.collect(t);
        this.workspace.requestSaveLayout();
      }
    };
    e.prototype.onFileCreated = function (e) {
      if (this.workspace.layoutReady) {
        this.collect(e);
        this.workspace.requestSaveLayout();
      }
    };
    e.prototype.onRename = function (e, t) {
      if (this.workspace.layoutReady) {
        var n = e.path;
        this.lastOpenFiles = this.lastOpenFiles.map(function (e) {
          return e === t ? n : e;
        });
        this.workspace.requestSaveLayout();
      }
    };
    e.prototype.getLastOpenFiles = function () {
      return this.getRecentFiles({
        showMarkdown: true,
        showNonAttachments: true,
        showNonImageAttachments: true,
        showImages: true,
      });
    };
    e.prototype.getRecentFiles = function (e) {
      for (
        var t = Object.assign(
            {
              showMarkdown: true,
              showNonAttachments: true,
              showNonImageAttachments: false,
              showImages: false,
              maxCount: 10,
            },
            e,
          ),
          n = [],
          i = 0,
          r = this.lastOpenFiles;
        i < r.length;
        i++
      ) {
        var o = r[i],
          a = getExtension(o);
        if (
          (a === "md"
            ? t.showMarkdown && n.push(o)
            : a === "canvas" || a === "base"
              ? t.showNonAttachments && n.push(o)
              : IMAGE_EXTENSIONS.contains(a)
                ? t.showImages && n.push(o)
                : t.showNonImageAttachments && n.push(o),
          n.length >= t.maxCount)
        )
          break;
      }
      return n;
    };
    return e;
  })();
function I1() {
  if (!Platform.isDesktopApp) {
    var e = i18nProxy.interface.msgDesktopOnlyFeature();
    throw (new Notice(e), new Error(e));
  }
  if (electronMajorVersion < 13) {
    e = i18nProxy.interface.msgUpgradeInstaller();
    throw (new Notice(e), new Error(e));
  }
}
var Workspace = (function (e) {
  function t(app, containerEl) {
    var i = e.call(this) || this;
    if (
      ((i.leftSplit = null),
      (i.rightSplit = null),
      (i.leftRibbon = null),
      (i.rightRibbon = null),
      (i.rootSplit = null),
      (i.floatingSplit = null),
      (i.activeLeaf = null),
      (i.activeTabGroup = null),
      (i.containerEl = null),
      (i.layoutReady = false),
      (i.requestSaveLayout = debounce(i.saveLayout.bind(i), 1e3)),
      (i.requestResize = debounce(i.onResize.bind(i), 0)),
      (i.requestActiveLeafEvents = debounce(i.activeLeafEvents.bind(i), 0)),
      (i.requestUpdateLayout = gc(i.updateLayout)),
      (i.requestLayoutChangeEvents = debounce(function () {
        return i.layoutReady && i.trigger("layout-change");
      }, 10)),
      (i.mobileFileInfos = []),
      (i.backlinkInDocument = false),
      (i.lastTabGroupStacked = false),
      (i.protocolHandlers = new Map()),
      (i.onLayoutReadyCallbacks = []),
      (i.undoHistory = []),
      (i.lastActiveFile = null),
      (i._activeEditor = null),
      (i.layoutItemQueue = []),
      (i.handleXCallback = function (e, t) {
        if (!i.app.vault.getConfig("uriCallbacks")) return !1;
        if (e.hasOwnProperty("x-success")) {
          var n = e["x-success"],
            r = {
              name: t.basename,
              url: i.app.getObsidianUrl(t),
            };
          if (Platform.isDesktopApp && i.app.vault.adapter instanceof FileSystemAdapter) {
            r.file = i.app.vault.adapter.getFilePath(t.path);
          }
          try {
            if (((n = UrlHelper.addQuery(n, r)), new URL(n).protocol.toLowerCase() === "file:")) return !0;
            window.open(n);
          } catch (e) {
            console.error(e);
          }
          return !0;
        }
        return !1;
      }),
      (i.hoverLinkSources = {}),
      (i.operatorFuncConfigs = {}),
      (i.editorExtensions = []),
      (i.app = app),
      (i.containerEl = containerEl),
      (i.scope = new DynamicScope(app.scope, function () {
        var e = i.activeLeaf;
        return e && e.view && e.view.scope ? e.view.scope : null;
      })),
      (i.recentFileTracker = new L1(i, app.vault)),
      i.app.scope.register([], "Escape", function () {
        var e = null,
          t = activeDocument.activeElement;
        i.activeLeaf &&
          i.activeLeaf.view instanceof MarkdownView &&
          i.activeLeaf.view.currentMode.type === "source" &&
          i.activeLeaf.view.titleEl !== t &&
          i.activeLeaf.view.inlineTitleEl !== t &&
          !isContentEditable(t) &&
          !i.activeLeaf.view.editor.hasFocus() &&
          i.activeLeaf.view.editor.focus();
        (i.activeLeaf && i.activeLeaf.view.navigation) ||
          (i.activeLeaf &&
            i.iterateLeaves(i.activeLeaf.getContainer(), function (t) {
              if (t.view.navigation && (!e || e.activeTime < t.activeTime)) {
                e = t;
              }
            }),
          e ||
            i.iterateAllLeaves(function (t) {
              if (t.view.navigation && (!e || e.activeTime < t.activeTime)) {
                e = t;
              }
            }),
          i.setActiveLeaf(e));
      }),
      app.keymap.pushScope(i.scope),
      (i.leftRibbon = new WorkspaceRibbon(i, "left")),
      (i.rightRibbon = new WorkspaceRibbon(i, "right")),
      (i.leftSidebarToggleButtonEl = createDiv("sidebar-toggle-button mod-left", function (e) {
        setDynamicTooltip(
          e,
          function () {
            return i.leftSplit.collapsed ? i18nProxy.interface.sidebarExpand() : i18nProxy.interface.sidebarCollapse();
          },
          {
            placement: "right",
          },
        );
        e.createDiv("clickable-icon", function (e) {
          return setIcon(e, "sidebar-toggle-button-icon");
        });
        e.addEventListener("click", function () {
          return i.leftSplit.toggle();
        });
        e.addEventListener("contextmenu", function (e) {
          Menu.forEvent(e)
            .addItem(function (e) {
              return e
                .setTitle(i18nProxy.interface.menu.leftSidebar())
                .setIcon("sidebar-left")
                .setChecked(!i.leftSplit.collapsed)
                .onClick(function () {
                  i.leftSplit.toggle();
                });
            })
            .addItem(function (e) {
              return e
                .setTitle(i18nProxy.interface.menu.ribbon())
                .setIcon("lucide-panel-left-close")
                .setChecked(i.app.vault.getConfig("showRibbon"))
                .onClick(function () {
                  var e = i.app.vault.getConfig("showRibbon");
                  i.app.vault.setConfig("showRibbon", !e);
                });
            });
        });
      })),
      (i.rightSidebarToggleButtonEl = createDiv("sidebar-toggle-button mod-right", function (e) {
        setDynamicTooltip(
          e,
          function () {
            return i.rightSplit.collapsed ? i18nProxy.interface.sidebarExpand() : i18nProxy.interface.sidebarCollapse();
          },
          {
            placement: "left",
          },
        );
        e.createDiv("clickable-icon", function (e) {
          return setIcon(e, "sidebar-toggle-button-icon");
        });
        e.addEventListener("click", function () {
          return i.rightSplit.toggle();
        });
        e.addEventListener("contextmenu", function (e) {
          Menu.forEvent(e).addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.rightSidebar())
              .setIcon("sidebar-right")
              .setChecked(!i.rightSplit.collapsed)
              .onClick(function () {
                i.rightSplit.toggle();
              });
          });
        });
      })),
      (i.editorSuggest = new GJ(app)),
      window.addEventListener("resize", i.requestResize.bind(i)),
      window.addEventListener("popstate", function (e) {
        qM();
        e.preventDefault();
      }),
      (window.history.forward = function () {
        var e;
        return (e = i.activeLeaf) === null || undefined === e ? undefined : e.history.forward();
      }),
      (window.history.back = function () {
        var e;
        return (e = i.activeLeaf) === null || undefined === e ? undefined : e.history.back();
      }),
      (window.history.go = function (e) {
        var t;
        return (t = i.activeLeaf) === null || undefined === t ? undefined : t.history.go(e);
      }),
      Platform.isLinux ||
        window.addEventListener(
          "mousedown",
          function (e) {
            if (!(e.button !== 3 && e.button !== 4)) {
              e.preventDefault();
              e.stopPropagation();
              e.button === 3 ? window.history.back() : window.history.forward();
            }
          },
          {
            capture: !0,
          },
        ),
      Platform.isDesktopApp &&
        (window.addEventListener("focus", function () {
          activeWindow = window;
          activeDocument = document;
          i.rootSplit && i.rootSplit.onFocus();
        }),
        window.addEventListener("fullscreenchange", function () {
          return i.updateFrameless();
        })),
      window.addEventListener("copy", function (e) {
        if (!e.defaultPrevented && e.isTrusted) {
          var t = activeDocument.activeElement;
          if (!(i.activeLeaf && !isContentEditable(t) && (i.activeLeaf.view.handleCopy(e), e.defaultPrevented))) {
            t !== activeDocument.body &&
              t.dispatchEvent(
                new ClipboardEvent("copy", {
                  bubbles: true,
                  cancelable: true,
                }),
              );
          }
        }
      }),
      window.addEventListener("paste", function (e) {
        if (!(e.defaultPrevented || !i.activeLeaf || isContentEditable(activeDocument.activeElement))) {
          i.activeLeaf.view.handlePaste(e);
        }
      }),
      window.addEventListener("cut", function (e) {
        if (!(e.defaultPrevented || !i.activeLeaf || isContentEditable(activeDocument.activeElement))) {
          i.activeLeaf.view.handleCut(e);
        }
      }),
      Platform.isIosApp)
    ) {
      var r = function (e) {
        if (e.scrollTop !== 0) {
          e.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          return !0;
        }
      };
      window.addEventListener("statusTap", function () {
        var e = document.querySelectorAll(".modal-container");
        if (e.length) {
          walkDOM(e[e.length - 1], r);
        } else {
          var t = i,
            n = t.activeLeaf,
            o = t.leftSplit,
            a = t.rightSplit;
          if (o instanceof CJ && !o.collapsed && !o.isPinned) walkDOM(o.containerEl, r);
          else if (a instanceof CJ && !a.collapsed && !a.isPinned) walkDOM(a.containerEl, r);
          else if (n) {
            if (n.view instanceof MarkdownView)
              return void n.view.setEphemeralState({
                scroll: 0,
              });
            walkDOM(n.containerEl, r);
          }
        }
      });
    }
    i.app.vault.on("rename", function (e, t) {
      var n;
      if (e instanceof TFile) {
        var r = function (n) {
            var i;
            if (((i = n.state.state) === null || undefined === i ? undefined : i.file) === t) {
              n.title = e.basename;
              n.state.state.file = e.path;
            }
          },
          o = function (e) {
            for (var t = 0, n = e.backHistory; t < n.length; t++) {
              var i = n[t];
              r(i);
            }
            for (var o = 0, a = e.forwardHistory; o < a.length; o++) {
              i = a[o];
              r(i);
            }
          };
        i.iterateAllLeaves(function (e) {
          o(e.history);
        });
        for (var a = 0, s = i.undoHistory; a < s.length; a++) {
          var l = s[a];
          ((n = l.state.state) === null || undefined === n ? undefined : n.file) === t && (l.state.state.file = e.path);
          o(l.leafHistory);
        }
      }
    });
    var o = function (e) {
      for (
        var t = function (e) {
            if (e.view instanceof j$) return "continue";
            var t = e.getViewState();
            __awaiter(i, undefined, undefined, function () {
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, e.open(new Pj(e))];
                  case 1:
                    n.sent();
                    return [4, e.setViewState(t)];
                  case 2:
                    n.sent();
                    return [2];
                }
              });
            });
          },
          n = 0,
          r = i.getLeavesOfType(e);
        n < r.length;
        n++
      ) {
        t(r[n]);
      }
    };
    i.app.viewRegistry.on("view-registered", o);
    i.app.viewRegistry.on("view-unregistered", o);
    i.on("file-menu", function (e, n, r, o) {
      if (
        (n instanceof TFile &&
          (e.addItem(function (e) {
            return e
              .setSection("info")
              .setTitle(i18nProxy.commands.copyUrl())
              .setIcon("lucide-copy")
              .onClick(function () {
                return i.app.copyObsidianUrl(n);
              });
          }),
          e.addItem(function (e) {
            return e
              .setSection("system")
              .setTitle(
                Platform.isMobileApp
                  ? i18nProxy.plugins.openWithDefaultApp.actionOpenFileMobile()
                  : i18nProxy.plugins.openWithDefaultApp.actionOpenFile(),
              )
              .setIcon("lucide-arrow-up-right")
              .onClick(function () {
                return i.app.openWithDefaultApp(n.path);
              });
          })),
        !(n instanceof TFolder && n.isRoot()) &&
          (e.addItem(function (e) {
            return e
              .setSection("action")
              .setTitle(
                n instanceof TFile
                  ? i18nProxy.plugins.fileExplorer.actionMoveFile()
                  : i18nProxy.plugins.fileExplorer.actionMoveFolder(),
              )
              .setIcon("lucide-folder-tree")
              .onClick(function () {
                new JJ(i.app, [n]).open();
              });
          }),
          Platform.isDesktopApp &&
            (e.addItem(function (e) {
              return e
                .setSection("system")
                .setTitle(
                  Platform.isMacOS
                    ? i18nProxy.plugins.openWithDefaultApp.actionShowInFolderMac()
                    : i18nProxy.plugins.openWithDefaultApp.actionShowInFolder(),
                )
                .setIcon("lucide-arrow-up-right")
                .onClick(function () {
                  return i.app.showInFolder(n.path);
                });
            }),
            app.vault.adapter instanceof FileSystemAdapter)))
      ) {
        var a = app.vault.adapter.getFullPath(n.path);
        e.addItem(function (e) {
          return e
            .setSection("info")
            .setTitle(i18nProxy.interface.copyPath())
            .setIcon("lucide-copy")
            .onClick(function () {
              vc(a);
              new Notice(
                i18nProxy.interface.copied({
                  context: "generic",
                }),
              );
            });
        }).addItem(function (e) {
          return e
            .setSection("info")
            .setTitle(i18nProxy.interface.copyRelativePath())
            .setIcon("lucide-copy")
            .onClick(function () {
              vc(n.path);
              new Notice(
                i18nProxy.interface.copied({
                  context: "generic",
                }),
              );
            });
        });
      }
      if (Platform.canPopoutWindow && n instanceof TFile) {
        e.addItem(function (e) {
          return e
            .setSection("open")
            .setTitle(i18nProxy.interface.menu.openInNewWindow())
            .setIcon("lucide-picture-in-picture-2")
            .onClick(function () {
              return __awaiter(i, undefined, undefined, function () {
                return __generator(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, this.app.workspace.openPopoutLeaf().openFile(n)];
                    case 1:
                      e.sent();
                      return [2];
                  }
                });
              });
            });
        });
      }
    });
    i.on("files-menu", function (e, t) {
      return e.addItem(function (e) {
        return e
          .setSection("action")
          .setTitle(
            i18nProxy.plugins.fileExplorer.actionMoveItems({
              count: t.length,
            }),
          )
          .setIcon("lucide-folder-tree")
          .onClick(function () {
            new JJ(i.app, t).open();
          });
      });
    });
    i.on("markdown-viewport-menu", function (e, n, i, r) {
      var o = app.vault,
        a = o.getConfig("showLineNumber"),
        s = o.getConfig("readableLineLength");
      i === "source" &&
        e.addItem(function (e) {
          return e
            .setSection("view")
            .setTitle(i18nProxy.setting.editor.optionShowLineNumber())
            .setIcon("lucide-list-ordered")
            .setChecked(a)
            .onClick(function () {
              return o.setConfig("showLineNumber", !a);
            });
        });
      e.addItem(function (e) {
        return e
          .setSection("view")
          .setTitle(i18nProxy.setting.editor.optionReadableLineLength())
          .setIcon("lucide-ruler")
          .setChecked(s)
          .onClick(function () {
            return o.setConfig("readableLineLength", !s);
          });
      });
    });
    var a = function () {
      var e = [],
        t = false;
      i.iterateAllLeaves(function (n) {
        var i = n.view;
        if (i instanceof TextFileView) {
          i.saving && (t = true);
          i.data !== i.lastSavedData && e.push(i.save());
        }
      });
      t && e.push(i.app.vault.adapter.promise);
      return e;
    };
    i.on("quit", function (e) {
      i.requestSaveLayout.cancel();
      i.app.vault.requestSaveConfig.run();
      for (var t = 0, n = a(); t < n.length; t++) {
        var r = n[t];
        e.addPromise(r);
      }
    });
    Platform.isMobileApp &&
      capacitorAppPlugin &&
      (capacitorAppPlugin.addListener("appStateChange", function (e) {
        if (i.layoutReady && !e.isActive) {
          a();
        }
      }),
      capacitorAppPlugin.addListener("shake", function () {
        return __awaiter(i, undefined, undefined, function () {
          var e,
            n,
            i,
            r = this;
          return __generator(this, function (o) {
            switch (o.label) {
              case 0:
                e = [];
                app.plugins.isEnabled() &&
                  e.push({
                    title: i18nProxy.interface.mobile.debug.disablePlugins(),
                    action: function () {
                      return __awaiter(r, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          switch (e.label) {
                            case 0:
                              return [4, app.plugins.setEnable(!1)];
                            case 1:
                              e.sent();
                              window.location.reload();
                              return [2];
                          }
                        });
                      });
                    },
                  });
                ((n = app.customCss.snippets).length > 0 || app.customCss.theme !== "") &&
                  e.push({
                    title: i18nProxy.interface.mobile.debug.disableTheme(),
                    action: function () {
                      for (var e = 0, i = n; e < i.length; e++) {
                        var r = i[e];
                        app.customCss.setCssEnabledStatus(r, !1);
                      }
                      app.customCss.setTheme("");
                    },
                  });
                e.push({
                  title: i18nProxy.interface.mobile.debug.closeVault(),
                  action: function () {
                    app.openVaultChooser();
                  },
                });
                e.push({
                  title: i18nProxy.dialogue.buttonCancel(),
                  action: function () {},
                  style: aQ.Cancel,
                });
                return [
                  4,
                  actionSheetPlugin.showActions({
                    title: i18nProxy.interface.mobile.debug.name(),
                    message: i18nProxy.interface.mobile.debug.desc(),
                    options: e.map(function (e) {
                      e.action;
                      return __rest(e, ["action"]);
                    }),
                  }),
                ];
              case 1:
                i = o.sent();
                e[i.index].action();
                return [2];
            }
          });
        });
      }));
    i.on("editor-menu", function (e, t, n) {
      var r = n.file;
      if (r) {
        var o = t.getCursor(),
          a = extractMarkdownTitle(t.getLine(o.line));
        if (a !== null) {
          e.addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.renameHeading())
              .setIcon("lucide-edit-3")
              .onClick(function () {
                var e = n.file;
                if (r === e || Db(o, t.getCursor())) {
                  var s = n instanceof yY ? n.before.length : 0,
                    l = t.cm.state,
                    c = l.doc,
                    u = l.selection,
                    h = c.lineAt(u.main.from),
                    p = {
                      start: h.from + s,
                      end: h.to + s,
                    };
                  new ex(i.app, t, r, p, a).open();
                }
              });
          });
        }
      }
    });
    i.on("editor-menu", function (e, t, n) {
      var r = n.file;
      if (r) {
        var o = t.getCursor(),
          a = t.getClickableTokenAt(o);
        if (a && a.type === "blockid") {
          e.addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.renameBlockid())
              .setIcon("lucide-edit-3")
              .onClick(function () {
                if (r === n.file || Db(o, t.getCursor())) {
                  var e = n instanceof yY ? n.before.length : 0,
                    s = {
                      start: t.posToOffset(a.start) + e,
                      end: t.posToOffset(a.end) + e,
                    };
                  new tx(i.app, t, r, s, a).open();
                }
              });
          });
        }
      }
    });
    var s = i.app.commands;
    if (
      (s.addCommand({
        id: "editor:save-file",
        name: i18nProxy.commands.saveFile(),
        checkCallback: function (e) {
          var t = i.app.workspace.getActiveViewOfType(TextFileView);
          if (t) {
            e || t.save();
            return !0;
          }
        },
        hotkeys: [BO(["Mod"], "S")],
      }),
      s.addCommand({
        id: "editor:download-attachments",
        name: i18nProxy.commands.downloadAttachments(),
        checkCallback: function (e) {
          var t = i.app.workspace.getActiveFile();
          if (t && t.extension === "md") {
            e || i.app.fileManager.downloadAttachmentsForNote(t);
            return !0;
          }
        },
      }),
      s.addCommand({
        id: "editor:follow-link",
        name: i18nProxy.commands.followCursorLink(),
        icon: "lucide-link",
        editorCheckCallback: function (e, t, n) {
          var i = t.getClickableTokenAt(t.getCursor());
          return !!i && (e || n.editMode.triggerClickableToken(i, !1), !0);
        },
        hotkeys: [BO(["Alt"], "Enter")],
      }),
      s.addCommand({
        id: "editor:open-link-in-new-leaf",
        name: i18nProxy.commands.openCursorLinkInNewTab(),
        icon: "lucide-link",
        editorCheckCallback: function (e, t, n) {
          var i = t.getClickableTokenAt(t.getCursor());
          return !!i && (e || n.editMode.triggerClickableToken(i, "tab"), !0);
        },
        hotkeys: [BO(["Mod"], "Enter")],
      }),
      Platform.canPopoutWindow &&
        s.addCommand({
          id: "editor:open-link-in-new-window",
          name: i18nProxy.commands.openCursorLinkInNewWindow(),
          icon: "lucide-link",
          editorCheckCallback: function (e, t, n) {
            var i = t.getClickableTokenAt(t.getCursor());
            return !!i && (e || n.editMode.triggerClickableToken(i, "window"), !0);
          },
          hotkeys: [BO(["Mod", "Alt", "Shift"], "Enter")],
        }),
      s.addCommand({
        id: "workspace:toggle-pin",
        name: i18nProxy.commands.togglePin(),
        icon: "lucide-pin",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          return !(!(t && t.view instanceof ItemView) || t.view instanceof Pj) && (e || t.togglePinned(), !0);
        },
      }),
      Platform.canSplit)
    ) {
      s.addCommand({
        id: "editor:open-link-in-new-split",
        name: i18nProxy.commands.openCursorLinkToTheRight(),
        icon: "lucide-link",
        editorCheckCallback: function (e, t, n) {
          var i = t.getClickableTokenAt(t.getCursor());
          return !!i && (e || n.editMode.triggerClickableToken(i, "split"), !0);
        },
        hotkeys: [BO(["Mod", "Alt"], "Enter")],
      });
      var l = function (e, namet0) {
        s.addCommand({
          id: "editor:focus-" + e,
          name: namet0,
          checkCallback: function (t) {
            var n = i.getAdjacentLeafInDirection(i.activeLeaf, e);
            return (
              !!n &&
              (t ||
                (clearFocusAndSelection(),
                i.setActiveLeaf(n, {
                  focus: !0,
                })),
              !0)
            );
          },
        });
      };
      l("top", i18nProxy.commands.navigateTabAbove());
      l("bottom", i18nProxy.commands.navigateTabBelow());
      l("left", i18nProxy.commands.navigateTabLeft());
      l("right", i18nProxy.commands.navigateTabRight());
      s.addCommand({
        id: "workspace:split-vertical",
        name: i18nProxy.commands.splitRight(),
        icon: "lucide-separator-vertical",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          return (
            !(!(t && t.view instanceof ItemView) || i.isInSidebar(t)) &&
            (e || i.duplicateLeaf(i.activeLeaf, "vertical"), !0)
          );
        },
      });
      s.addCommand({
        id: "workspace:split-horizontal",
        name: i18nProxy.commands.splitDown(),
        icon: "lucide-separator-horizontal",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          return !!(t && t.view instanceof ItemView) && (e || i.duplicateLeaf(i.activeLeaf, "horizontal"), !0);
        },
      });
    }
    Platform.canStackTabs &&
      s.addCommand({
        id: "workspace:toggle-stacked-tabs",
        name: i18nProxy.commands.toggleStackedTabs(),
        icon: "lucide-layers",
        checkCallback: function (e) {
          var t = i.activeLeaf.parent;
          if (t instanceof WorkspaceTabs) {
            var n = t.getRoot();
            if (n === i.leftSplit || n === i.rightSplit) return;
            e || t.setStacked(!t.isStacked);
            return !0;
          }
        },
      });
    s.addCommand({
      id: "workspace:edit-file-title",
      name: i18nProxy.commands.editFileTitle(),
      icon: "lucide-edit-3",
      checkCallback: function (e) {
        var t = i.getActiveFileView();
        if (t && t instanceof EditableFileView) {
          e ||
            t.leaf.setEphemeralState({
              rename: "all",
            });
          return !0;
        }
      },
      hotkeys: [BO([], "F2")],
    });
    s.addCommand({
      id: "workspace:copy-path",
      name: i18nProxy.commands.copyPath(),
      icon: "lucide-copy",
      checkCallback: function (e) {
        var t = i.getActiveFile();
        if (t) {
          e ||
            (vc(t.path),
            new Notice(
              i18nProxy.interface.copied({
                context: "generic",
              }),
            ));
          return !0;
        }
      },
    });
    s.addCommand({
      id: "workspace:copy-url",
      name: i18nProxy.commands.copyUrl(),
      icon: "lucide-copy",
      checkCallback: function (e) {
        var t = i.getActiveFile();
        if (t) {
          e || i.app.copyObsidianUrl(t);
          return !0;
        }
      },
    });
    s.addCommand({
      id: "workspace:undo-close-pane",
      name: i18nProxy.commands.undoCloseTab(),
      icon: "lucide-undo-2",
      checkCallback: function (e) {
        var t = i.undoHistory;
        if (t.length > 0) {
          if (!e) {
            var n = t.shift(),
              r = i.activeLeaf,
              o = i.rootSplit;
            if (
              (n.rootId &&
                (o = [i.rootSplit, i.floatingSplit, i.leftSplit, i.rightSplit].find(function (e) {
                  return e.id === n.rootId;
                })),
              n.parentId)
            ) {
              var a = null;
              i.iterateTabs([o], function (e) {
                if (e.id === n.parentId) {
                  a = e;
                }
              });
              a && (r = i.createLeafInTabGroup(a));
            }
            (r && r.view.getViewType() === "empty") ||
              ((r =
                o === i.floatingSplit
                  ? i.openPopoutLeaf()
                  : Platform.isMobile
                    ? i.createLeafInTabGroup()
                    : i.splitActiveLeaf()),
              n.parentId && (r.parent.id = n.parentId));
            n.leafId && (r.id = n.leafId);
            n.state.active = true;
            n.leafHistory && r.history.deserialize(n.leafHistory);
            r.setViewState(n.state, n.eState);
          }
          return !0;
        }
      },
      hotkeys: [BO(["Mod", "Shift"], "T")],
    });
    Platform.canExportPdf &&
      s.addCommand({
        id: "workspace:export-pdf",
        name: i18nProxy.commands.exportPdf(),
        checkCallback: function (e) {
          var t = i.getActiveViewOfType(MarkdownView);
          if (t) {
            e || t.printToPdf();
            return !0;
          }
        },
      });
    s.addCommand({
      id: "editor:rename-heading",
      name: i18nProxy.interface.menu.renameHeading(),
      icon: "lucide-edit-3",
      editorCheckCallback: function (e, t, n) {
        var r = n.file;
        if (r) {
          var o = t.getCursor(),
            a = extractMarkdownTitle(t.getLine(o.line));
          if (a) {
            if (!e) {
              var s = n instanceof yY ? n.before.length : 0,
                l = t.cm.state,
                c = l.doc,
                u = l.selection,
                h = c.lineAt(u.main.from),
                p = {
                  start: h.from + s,
                  end: h.to + s,
                };
              new ex(i.app, t, r, p, a).open();
            }
            return !0;
          }
        }
      },
    });
    Platform.canPopoutWindow &&
      (s.addCommand({
        id: "workspace:open-in-new-window",
        name: i18nProxy.commands.openInNewWindow(),
        icon: "lucide-maximize",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          if (t && t.view instanceof ItemView) {
            e ||
              i.openPopoutLeaf().setViewState(t.getViewState(), {
                focus: !0,
              });
            return !0;
          }
        },
      }),
      s.addCommand({
        id: "workspace:move-to-new-window",
        name: i18nProxy.commands.moveToNewWindow(),
        icon: "lucide-maximize",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          if (t && t.view instanceof ItemView) {
            e || i.moveLeafToPopout(t);
            return !0;
          }
        },
      }));
    s.addCommand({
      id: "workspace:next-tab",
      name: i18nProxy.commands.goToNextTab(),
      icon: "lucide-arrow-right",
      checkCallback: function (e) {
        var t = i.activeLeaf;
        if (t && t.parent instanceof WorkspaceTabs) {
          if (!e) {
            var n = t.parent,
              r = n.currentTab + 1;
            r >= n.children.length && (r = 0);
            n.selectTabIndex(r);
            var o = n.children[r];
            if (o instanceof WorkspaceLeaf) {
              i.setActiveLeaf(o, {
                focus: !0,
              });
            }
          }
          return !0;
        }
      },
      hotkeys: [BO(["Ctrl"], "Tab"), Platform.isMacOS ? BO(["Meta", "Shift"], "]") : BO(["Ctrl"], "PageDown")],
    });
    for (
      var c = function (e) {
          s.addCommand({
            id: "workspace:goto-tab-".concat(e),
            name: i18nProxy.commands.goToNthTab({
              n: e,
            }),
            checkCallback: function (t) {
              if (Platform.isPhone) return !1;
              var n = i.activeLeaf;
              if (n && n.parent instanceof WorkspaceTabs) {
                var r = n.parent.children[e - 1];
                if (r) {
                  t ||
                    i.setActiveLeaf(r, {
                      focus: !0,
                    });
                  return !0;
                }
              }
              return !1;
            },
            hotkeys: [BO(["Mod"], String(e))],
          });
        },
        u = 0,
        h = [1, 2, 3, 4, 5, 6, 7, 8];
      u < h.length;
      u++
    ) {
      c(h[u]);
    }
    if (
      (s.addCommand({
        id: "workspace:goto-last-tab",
        name: i18nProxy.commands.goToLastTab(),
        checkCallback: function (e) {
          var t = i.activeLeaf;
          if (t && t.parent instanceof WorkspaceTabs) {
            var n = t.parent,
              r = n.children.length - 1,
              o = n.children[r];
            if (o) {
              e ||
                i.setActiveLeaf(o, {
                  focus: !0,
                });
              return !0;
            }
          }
          return !1;
        },
        hotkeys: [BO(["Mod"], "9")],
      }),
      s.addCommand({
        id: "workspace:previous-tab",
        name: i18nProxy.commands.goToPrevTab(),
        icon: "lucide-arrow-left",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          if (t && t.parent instanceof WorkspaceTabs) {
            if (!e) {
              var n = t.parent,
                r = n.currentTab - 1;
              r < 0 && (r = n.children.length - 1);
              n.selectTabIndex(r);
              var o = n.children[r];
              if (o instanceof WorkspaceLeaf) {
                i.setActiveLeaf(o, {
                  focus: !0,
                });
              }
            }
            return !0;
          }
        },
        hotkeys: [BO(["Ctrl", "Shift"], "Tab"), Platform.isMacOS ? BO(["Meta", "Shift"], "[") : BO(["Ctrl"], "PageUp")],
      }),
      s.addCommand({
        id: "workspace:new-tab",
        name: i18nProxy.commands.newTab(),
        checkCallback: function (e) {
          var t = i.getMostRecentLeaf();
          if (t && t.parent instanceof WorkspaceTabs) {
            if (!e) {
              var n = t.parent,
                r = new WorkspaceLeaf(i.app),
                o = n.children.length;
              n.insertChild(o, r);
              n.selectTabIndex(o);
              i.setActiveLeaf(r, {
                focus: !0,
              });
            }
            return !0;
          }
        },
        hotkeys: [BO(["Mod"], "T")],
      }),
      s.addCommand({
        id: "workspace:close",
        name: i18nProxy.commands.closeActiveTab(),
        icon: "lucide-x",
        checkCallback: function (e) {
          var t = i.activeLeaf;
          if ((!t || !i.isInSidebar(t) || t.view instanceof ItemView || (t = i.getMostRecentLeaf(i.rootSplit)), t)) {
            e || (!Platform.isPhone && t.pinned ? t.setPinned(!1) : t.detach());
            return !0;
          }
        },
        hotkeys: [BO(["Mod"], "W")],
      }),
      Platform.canPopoutWindow &&
        s.addCommand({
          id: "workspace:close-window",
          name: i18nProxy.interface.window.closeWindow(),
          icon: "lucide-x",
          callback: function () {
            activeWindow.close();
          },
          hotkeys: [BO(["Mod", "Shift"], "W")],
        }),
      s.addCommand({
        id: "workspace:close-others",
        name: i18nProxy.commands.closeOtherTabs(),
        icon: "lucide-x",
        checkCallback: function (e) {
          var t = i.activeLeaf,
            n = [];
          if (
            (i.iterateLeaves(t.getContainer(), function (e) {
              if (!(e === t || e.pinned)) {
                n.push(e);
              }
            }),
            !e)
          )
            for (var r = 0, o = n; r < o.length; r++) {
              o[r].detach();
            }
          return n.length > 0;
        },
      }),
      s.addCommand({
        id: "workspace:close-tab-group",
        name: i18nProxy.commands.closeTabGroup(),
        icon: "lucide-x",
        checkCallback: function (e) {
          if (Platform.canSplit) {
            var t = i.activeLeaf;
            if (t && !i.isInSidebar(t)) {
              if (!e)
                for (var n = 0, r = t.parent.children.slice(); n < r.length; n++) {
                  var o = r[n];
                  if (!o.pinned) {
                    o.detach();
                  }
                }
              return !0;
            }
          }
        },
      }),
      s.addCommand({
        id: "workspace:close-others-tab-group",
        name: i18nProxy.commands.closeOthersInTabGroup(),
        icon: "lucide-x",
        checkCallback: function (e) {
          if (Platform.canSplit) {
            var t = i.activeLeaf;
            if (t && !i.isInSidebar(t) && t && t.parent.children.length > 1) {
              if (!e)
                for (var n = 0, r = t.parent.children.slice(); n < r.length; n++) {
                  var o = r[n];
                  if (!(o === t || o.pinned)) {
                    o.detach();
                  }
                }
              return !0;
            }
          }
        },
      }),
      Platform.isDesktopApp &&
        s.addCommand({
          id: "workspace:show-trash",
          name: i18nProxy.commands.showTrash(),
          checkCallback: function (e) {
            if (app.vault.getConfig("trashOption") === "local") {
              e || app.showInFolder(".trash");
              return !0;
            }
          },
        }),
      i.registerObsidianProtocolHandler("open", function (e) {
        if (e.file) {
          var t = parseLinktext(e.file),
            n = t.path,
            subpath = t.subpath;
          n = normalizePath(n);
          var o = i.app.metadataCache.getFirstLinkpathDest(n, "");
          if (o) {
            var a = i.getLeaf(),
              eState = {};
            subpath && (eState.subpath = subpath);
            a.openFile(o, {
              active: true,
              eState: eState,
            });
            new Notice(
              i18nProxy.interface.msgOpenFileThroughUri({
                path: o.path,
              }),
            );
          } else
            new Notice(
              i18nProxy.interface.msgFileNotFoundThroughUri({
                name: e.file,
              }),
            );
        }
      }),
      i.registerObsidianProtocolHandler("search", function (e) {
        var t = i.app.internalPlugins.getEnabledPluginById("global-search");
        if (t) {
          t.openGlobalSearch(e.query);
        }
      }),
      i.registerObsidianProtocolHandler("new", function (e) {
        return __awaiter(i, undefined, undefined, function () {
          var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v;
          return __generator(this, function (y) {
            switch (y.label) {
              case 0:
                t = null;
                n = this.app;
                i = n.vault;
                r = n.fileManager;
                o = n.metadataCache;
                a = e.overwrite;
                s = e.append || e.prepend || a;
                return e.file
                  ? ((l = e.file),
                    /\.\.[\/\\]/.test(l)
                      ? [2]
                      : (s &&
                          ((t = o.getFirstLinkpathDest(l, "")) ||
                            ((c = i.getAbstractFileByPathInsensitive(l)) instanceof TFile && (t = c))),
                        t ? [3, 7] : ((u = Zc(l)), (m = undefined), u !== "" ? [3, 1] : ((m = i.getRoot()), [3, 3]))))
                  : [3, 8];
              case 1:
                return (m = i.getAbstractFileByPathInsensitive(u)) ? [3, 3] : [4, i.createFolder(u)];
              case 2:
                y.sent();
                m = i.getAbstractFileByPathInsensitive(u);
                y.label = 3;
              case 3:
                if (!(m instanceof TFolder)) return [2];
                y.label = 4;
              case 4:
                y.trys.push([4, 6, , 7]);
                return [4, r.createNewFile(m, getFilename(l))];
              case 5:
                t = y.sent();
                return [3, 7];
              case 6:
                h = y.sent();
                new Notice(h.toString());
                return [2];
              case 7:
                return [3, 12];
              case 8:
                if (((p = (p = e.name || "").replace(/[\/\\]/, "")), s && (t = o.getFirstLinkpathDest(p, "")), t))
                  return [3, 12];
                d = "";
                (f = this.getActiveFile()) && (d = f.path);
                m = r.getNewFileParent(d, p);
                y.label = 9;
              case 9:
                y.trys.push([9, 11, , 12]);
                return [4, r.createNewFile(m, p)];
              case 10:
                t = y.sent();
                return [3, 12];
              case 11:
                g = y.sent();
                new Notice(g.toString());
                return [2];
              case 12:
                return t ? ((v = e.content), e.clipboard ? [4, navigator.clipboard.readText()] : [3, 14]) : [2];
              case 13:
                v = y.sent();
                y.label = 14;
              case 14:
                return v
                  ? e.append || e.prepend
                    ? [4, r.insertIntoFile(t, v, e.prepend ? "prepend" : "append")]
                    : [3, 16]
                  : [3, 18];
              case 15:
                y.sent();
                return [3, 18];
              case 16:
                return [4, i.modify(t, v)];
              case 17:
                y.sent();
                y.label = 18;
              case 18:
                return e.silent
                  ? [3, 20]
                  : [
                      4,
                      this.getLeaf().openFile(t, {
                        active: true,
                        state: {
                          mode: "source",
                        },
                        eState: {
                          rename: "all",
                        },
                      }),
                    ];
              case 19:
                y.sent();
                y.label = 20;
              case 20:
                this.handleXCallback(e, t);
                return [2];
            }
          });
        });
      }),
      i.registerObsidianProtocolHandler("show-plugin", function (e) {
        var t = i.app;
        if (!t.plugins.isEnabled()) {
          var n = t.setting;
          n.open();
          return void n.openTabById("community-plugins");
        }
        if (e.id) {
          new s1(t).setAutoOpen(e.id).setDimBackground(!0).open();
        }
      }),
      i.registerObsidianProtocolHandler("show-theme", function (e) {
        if (e.name) {
          new w1(i.app, !1).setAutoOpen(e.name).setDimBackground(!0).open();
        }
      }),
      i.registerObsidianProtocolHandler("show-release-notes", function (e) {
        if (e.version) {
          i.app.showReleaseNotes(e.version);
        }
      }),
      i.registerObsidianProtocolHandler("debug-info", function (e) {
        new KJ(app).open();
      }),
      i.registerObsidianProtocolHandler("publish-sites", function () {
        return __awaiter(i, undefined, undefined, function () {
          var e;
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                (e = this.app.internalPlugins.getPluginById("publish")).enabled || e.enable(!1);
                return [4, e.instance.viewSites()];
              case 1:
                t.sent();
                return [2];
            }
          });
        });
      }),
      i.registerObsidianProtocolHandler("sync-setup", function (e) {
        i.onLayoutReady(function () {
          if (e.vault) {
            var t = i.app.internalPlugins.getPluginById("sync");
            t.enabled || t.enable(!1);
            t.instance.connectToVault(JSON.parse(e.vault));
          } else i.app.openVaultChooser();
        });
      }),
      i.registerObsidianProtocolHandler("vault-setup", function () {
        return __awaiter(i, undefined, undefined, function () {
          var e, t, n;
          return __generator(this, function (i) {
            switch (i.label) {
              case 0:
                return [
                  4,
                  this.app.vault.create(
                    i18nProxy.interface.starterContent.welcomeFilename() + ".md",
                    i18nProxy.interface.starterContent.welcomeFileContent(),
                  ),
                ];
              case 1:
                e = i.sent();
                t = this.getLeaf();
                return [
                  4,
                  (n = this.getLeaf("split")).setViewState({
                    type: typeLJ0,
                  }),
                ];
              case 2:
                i.sent();
                n.view instanceof IJ &&
                  n.view.dataEngine.setOptions({
                    close: !0,
                  });
                t.openFile(e, {
                  active: !0,
                });
                return [2];
            }
          });
        });
      }),
      i.registerObsidianProtocolHandler("hook-get-address", function (e) {
        if (i.app.vault.getConfig("uriCallbacks")) {
          var t = i.getActiveFile();
          if (t) {
            if (!i.handleXCallback(e, t)) {
              var n = i.app.getObsidianUrl(t);
              vc("[".concat(t.basename, "](").concat(n, ")"));
            }
          } else if (e.hasOwnProperty("x-error")) {
            window.open(
              UrlHelper.addQuery(e["x-error"], {
                errorCode: "NotFound",
                errorMessage: "No file is open at the moment",
              }),
            );
          }
        }
      }),
      isNotWeb)
    ) {
      var p = 0,
        d = null;
      capacitorAppPlugin.addListener("backButton", function () {
        var e;
        if (FM.length > 0) FM.last().close();
        else {
          var t = i.leftSplit,
            n = i.rightSplit;
          if (t.collapsed || (t instanceof CJ && t.isPinned)) {
            if (n.collapsed || (n instanceof CJ && n.isPinned)) {
              var r = (e = i.activeLeaf) === null || undefined === e ? undefined : e.history;
              if (r && r.backHistory.length > 0) r.back();
              else {
                var o = Date.now();
                o - p < 5e3
                  ? (d && (d.containerEl.detach(), d.hide()), capacitorAppPlugin.minimizeApp())
                  : ((p = o),
                    (d = new Notice(i18nProxy.interface.mobile.msgBackAgainToExit(), 0)),
                    window.setTimeout(function () {
                      d && d.hide();
                      d = null;
                    }, 5e3));
              }
            } else n.collapse();
          } else t.collapse();
        }
      });
    }
    OM(i.containerEl, function (e) {
      i.trigger("swipe", e);
    });
    i.on("swipe", function (e) {
      if (!(e.points > 1 || e.direction !== "y" || e.y < e.startY) && i.rootSplit.containerEl.contains(e.targetEl)) {
        var n = i.app.vault.getConfig("mobilePullAction");
        if (n) {
          var r = i.app.commands.findCommand(n),
            texto0 = r ? r.name : "Configure pull action",
            a = document.body.createDiv({
              cls: "pull-action pull-down-action",
              text: texto0,
            });
          a.onClickEvent(function () {
            a.detach();
          });
          var s = a.offsetHeight,
            l = false;
          e.registerCallback({
            move: function (t, n) {
              var i = (n - e.startY) / s;
              i = Math.clamp(i, 0, 1);
              a.toggleClass("mod-activated", i === 1);
              a.style.transform = "translateY(".concat((i - 1) * s, "px)");
              i !== 1 || l || navigator.vibrate(100);
              l = i === 1;
            },
            cancel: function () {
              a.detach();
            },
            finish: function (e, n, i) {
              a.detach();
              l &&
                (r
                  ? lQ(r)
                  : new Notice(i18nProxy.setting.mobileToolbar.msgMissingQuickAction()).addButton(
                      i18nProxy.setting.mobileToolbar.buttonConfigure(),
                      function () {
                        app.commands.executeCommandById("mobile:quick-action");
                      },
                    ));
            },
          });
        }
      }
    });
    i.on("swipe", function (e) {
      if (
        e.points === 2 &&
        e.direction === "x" &&
        i.rootSplit.containerEl.contains(e.targetEl) &&
        (!Platform.isIosApp || !Platform.mobileSoftKeyboardVisible)
      ) {
        var t = e.x > e.startX,
          n = t ? i.app.commands.findCommand("app:go-back") : i.app.commands.findCommand("app:go-forward");
        if (n) {
          var r = document.body.createDiv({
            cls: "pull-action pull-out-action",
            text: n.name,
          });
          r.onClickEvent(function () {
            r.detach();
          });
          t ? (r.style.left = "0") : (r.style.right = "0");
          var o = t ? 1 : -1,
            a = r.offsetWidth,
            s = a / 90,
            l = false;
          e.registerCallback({
            move: function (t) {
              var n = Math.clamp(((t - e.startX) * o) / 90, 0, 1);
              r.toggleClass("mod-activated", n === 1);
              r.style.transform = "translateX(".concat(90 * -(1 - n) * o * s, "px)");
              n !== 1 || l || (navigator.vibrate(100), (l = true));
            },
            cancel: function () {
              r.detach();
            },
            finish: function (n, c, u) {
              var h = Math.clamp(((n - e.startX) * o) / 90, 0, 1);
              fl(
                r,
                new cl({
                  duration: 100 * h,
                }).addProp(
                  "transform",
                  "translateX(".concat(90 * -(1 - h) * o * s, "px)"),
                  "translateX(".concat(a * s * -o, "px)"),
                  null,
                ),
                function () {
                  r.detach();
                },
              );
              l &&
                (t
                  ? i.app.commands.executeCommandById("app:go-back")
                  : i.app.commands.executeCommandById("app:go-forward"));
            },
          });
        }
      }
    });
    Platform.isIosApp &&
      i.on("css-change", function () {
        return __awaiter(i, undefined, undefined, function () {
          var e;
          return __generator(this, function (t) {
            switch (t.label) {
              case 0:
                ((e = LT("--background-primary")) && e.a !== 0) ||
                  (e = ET(getComputedStyle(document.body).backgroundColor));
                return e
                  ? [
                      4,
                      capacitorAppPlugin.setBackgroundColor({
                        r: e.r / 255,
                        g: e.g / 255,
                        b: e.b / 255,
                      }),
                    ]
                  : [3, 2];
              case 1:
                t.sent();
                t.label = 2;
              case 2:
                return [2];
            }
          });
        });
      });
    i.registerHoverLinkSource("search", {
      display: i18nProxy.plugins.pagePreview.labelSourceSearch(),
      defaultMod: true,
    });
    i.registerHoverLinkSource("preview", {
      display: i18nProxy.plugins.pagePreview.labelSourcePreview(),
      defaultMod: false,
    });
    i.registerHoverLinkSource("editor", {
      display: i18nProxy.plugins.pagePreview.labelSourceEditor(),
      defaultMod: true,
    });
    i.registerHoverLinkSource("tab-header", {
      display: i18nProxy.plugins.pagePreview.labelSourceTabHeader(),
      defaultMod: true,
    });
    var getMode = CodeMirror.getMode;
    CodeMirror.getMode = function (e, t) {
      var n = getMode.call(CodeMirror, e, t);
      !t ||
        (n && n.name !== "null") ||
        ((CodeMirror.getMode = getMode),
        bN.then(function () {
          for (var e = 0, t = i.getLeavesOfType(MarkdownView.VIEW_TYPE); e < t.length; e++) {
            var n = t[e];
            if (n.view instanceof MarkdownView) {
              n.view.editMode.resetSyntaxHighlighting();
            }
          }
        }));
      return n;
    };
    return i;
  }
  __extends(t, e);
  t.prototype.loadLayout = function () {
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
            e = this.app.vault;
            t = Platform.isMobile ? P1 : A1;
            n = {};
            p.label = 1;
          case 1:
            p.trys.push([1, 3, , 4]);
            r = (i = JSON).parse;
            return [4, e.adapter.read(e.configDir + "/" + t)];
          case 2:
            n = r.apply(i, [p.sent()]);
            return [3, 4];
          case 3:
            p.sent();
            return [3, 4];
          case 4:
            n.hasOwnProperty("lastOpenFiles") && this.recentFileTracker.load(n.lastOpenFiles);
            return [4, this.setLayout(n)];
          case 5:
            if ((p.sent(), !Platform.isDesktopApp || this.app.vault.getName() !== "Obsidian Sandbox")) return [3, 7];
            if (
              !((o = this.app.vault.adapter) instanceof FileSystemAdapter) ||
              electron.ipcRenderer.sendSync("get-sandbox-vault-path") !== o.getBasePath()
            )
              return [2];
            for (
              new Notice(i18nProxy.interface.msgSandboxVault(), 0),
                a = [],
                this.iterateLeaves([this.rootSplit, this.floatingSplit], function (e) {
                  a.push(e);
                }),
                s = 0,
                l = a;
              s < l.length;
              s++
            )
              l[s].detach();
            this.updateLayout();
            return (c = this.app.metadataCache.getFirstLinkpathDest("Start Here", "")) && c.extension === "md"
              ? [
                  4,
                  this.getLeaf().openFile(c, {
                    active: true,
                    state: {
                      mode: "source",
                      source: !1,
                    },
                  }),
                ]
              : [3, 7];
          case 6:
            p.sent();
            p.label = 7;
          case 7:
            this.trigger("layout-ready");
            u = this.onLayoutReadyCallbacks;
            this.onLayoutReadyCallbacks = null;
            __awaiter(h, undefined, undefined, function () {
              var e, t, n, plugin, r, o;
              return __generator(this, function (a) {
                switch (a.label) {
                  case 0:
                    e = 0;
                    t = u;
                    a.label = 1;
                  case 1:
                    if (!(e < t.length)) return [3, 6];
                    n = t[e];
                    plugin = n.pluginId;
                    r = n.callback;
                    a.label = 2;
                  case 2:
                    a.trys.push([2, 4, , 5]);
                    return [4, sleep(0)];
                  case 3:
                    a.sent();
                    r();
                    return [3, 5];
                  case 4:
                    o = a.sent();
                    console.error(o);
                    plugin &&
                      new Notice(
                        i18nProxy.interface.msgPluginError({
                          plugin: plugin,
                        }),
                      );
                    return [3, 5];
                  case 5:
                    e++;
                    return [3, 1];
                  case 6:
                    return [2];
                }
              });
            });
            return [2];
        }
      });
    });
  };
  t.prototype.clearLayout = function () {
    return __awaiter(this, undefined, undefined, function () {
      var e, t, n, i;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            this.layoutReady = false;
            this.requestLayoutChangeEvents.cancel();
            e = [];
            this.iterateAllLeaves(function (t) {
              e.push(t.open(null));
            });
            return [4, Promise.all(e)];
          case 1:
            for (
              r.sent(),
                this.leftSplit.containerEl.detach(),
                this.rootSplit.containerEl.detach(),
                this.rightSplit.containerEl.detach(),
                this.floatingSplit.containerEl.detach(),
                this.rootSplit.component.unload(),
                this.leftSplit.component.unload(),
                this.rightSplit.component.unload(),
                this.floatingSplit.component.unload(),
                t = 0,
                n = this.floatingSplit.children.slice();
              t < n.length;
              t++
            )
              if ((i = n[t]) instanceof WorkspaceWindow) {
                i.close();
              }
            this.rootSplit = null;
            this.leftSplit = null;
            this.rightSplit = null;
            this.floatingSplit = null;
            this.activeLeaf = null;
            this.layoutItemQueue = [];
            return [2];
        }
      });
    });
  };
  t.prototype.setLayout = function (e) {
    return __awaiter(this, undefined, undefined, function () {
      var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w, k, C, E, S, M;
      return __generator(this, function (b) {
        switch (b.label) {
          case 0:
            this.layoutReady = false;
            t = this.app.vault;
            n = Platform.isMobile;
            return (s = e.main) ? ((l = this), [4, this.deserializeLayout(s, "root")]) : [3, 2];
          case 1:
            (i = l.rootSplit = b.sent()) &&
              i.direction !== "vertical" &&
              (i.setDirection("vertical"), i.recomputeChildrenDimensions());
            b.label = 2;
          case 2:
            return (c = e.left) ? ((u = this), [4, this.deserializeLayout(c, "left")]) : [3, 4];
          case 3:
            (r = u.leftSplit = b.sent()) &&
              r instanceof WorkspaceSidedock &&
              r.direction !== "horizontal" &&
              (r.setDirection("horizontal"), r.recomputeChildrenDimensions());
            b.label = 4;
          case 4:
            return (h = e.right) ? ((p = this), [4, this.deserializeLayout(h, "right")]) : [3, 6];
          case 5:
            (o = p.rightSplit = b.sent()) &&
              o instanceof WorkspaceSidedock &&
              o.direction !== "horizontal" &&
              (o.setDirection("horizontal"), o.recomputeChildrenDimensions());
            b.label = 6;
          case 6:
            return (d = e.floating) ? ((f = this), [4, this.deserializeLayout(d, null)]) : [3, 8];
          case 7:
            a = f.floatingSplit = b.sent();
            b.label = 8;
          case 8:
            (m = e["left-ribbon"]) && this.leftRibbon.load(m);
            return i
              ? [3, 11]
              : ((i = this.rootSplit = new WorkspaceRoot(this, "vertical")),
                (g = new WorkspaceTabs(this)),
                (v = new WorkspaceLeaf(this.app)),
                g.insertChild(0, v),
                i.insertChild(0, g),
                (y = this.getLastOpenFiles()).length > 0
                  ? ((w = y[0]), (k = t.getAbstractFileByPath(w)) && k instanceof TFile ? [4, v.openFile(k)] : [3, 10])
                  : [3, 10]);
          case 9:
            b.sent();
            b.label = 10;
          case 10:
            this.setActiveLeaf(v);
            b.label = 11;
          case 11:
            i.containerEl.addClass("mod-root");
            r ||
              (n
                ? (r = this.leftSplit = new EJ(this)).collapse()
                : (r = this.leftSplit = new WorkspaceSidedock(this, "horizontal", "left")));
            o ||
              (o = this.rightSplit = n ? new SJ(this) : new WorkspaceSidedock(this, "horizontal", "right")).collapse();
            a || (a = this.floatingSplit = new WorkspaceFloating(this));
            C = this.containerEl;
            Platform.isMobile
              ? C.setChildrenInPlace([r.containerEl, i.containerEl, o.containerEl])
              : C.setChildrenInPlace([
                  this.leftRibbon.containerEl,
                  r.containerEl,
                  i.containerEl,
                  o.containerEl,
                  this.rightRibbon.containerEl,
                ]);
            E = e.active;
            (S = this.getLeafById(E)) &&
              this.setActiveLeaf(S, {
                focus: !0,
              });
            M = [];
            this.iterateAllLeaves(function (e) {
              if (e.isVisible()) {
                M.push(e.loadIfDeferred());
              }
            });
            return [4, Promise.all(M)];
          case 12:
            b.sent();
            this.layoutReady = true;
            this.onLayoutChange();
            this.requestActiveLeafEvents();
            return [2];
        }
      });
    });
  };
  t.prototype.onLayoutReady = function (callback) {
    this.onLayoutReadyCallbacks === null
      ? callback()
      : this.onLayoutReadyCallbacks.push({
          pluginId: this.app.plugins.loadingPluginId,
          callback: callback,
        });
  };
  t.prototype.changeLayout = function (e) {
    return __awaiter(this, undefined, undefined, function () {
      return __generator(this, function (t) {
        switch (t.label) {
          case 0:
            return this.layoutReady ? [4, this.clearLayout()] : [2];
          case 1:
            t.sent();
            return [4, this.setLayout(e)];
          case 2:
            t.sent();
            return [2];
        }
      });
    });
  };
  t.prototype.deserializeLayout = function (e, t) {
    return __awaiter(this, undefined, Promise, function () {
      var n,
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
            if (
              ((n = function (t) {
                return __awaiter(f, undefined, undefined, function () {
                  var n, i, r;
                  return __generator(this, function (o) {
                    switch (o.label) {
                      case 0:
                        n = 0;
                        o.label = 1;
                      case 1:
                        return n < e.children.length ? [4, this.deserializeLayout(e.children[n], null)] : [3, 4];
                      case 2:
                        (i = o.sent())
                          ? (i.type !== "leaf" ||
                              t.type === "tabs" ||
                              t instanceof CJ ||
                              ((r = new WorkspaceTabs(this)).insertChild(0, i), (i = r)),
                            t.insertChild(n, i))
                          : (e.children.splice(n, 1), n--);
                        o.label = 3;
                      case 3:
                        n++;
                        return [3, 1];
                      case 4:
                        return [2];
                    }
                  });
                });
              }),
              e.type !== "split")
            )
              return [3, 2];
            if (((i = undefined), t === "root")) i = new WorkspaceRoot(this, e.direction, e.id);
            else if (t) {
              if (Platform.isMobile) return [2, null];
              r = i = new WorkspaceSidedock(this, e.direction, t, e.id);
              e.width && r.setSize(e.width);
              e.collapsed && r.collapse();
            } else i = new WorkspaceSplit(this, e.direction, e.id);
            return [4, n(i)];
          case 1:
            if ((m.sent(), i.children.length === 0 && !(i instanceof WorkspaceSidedock))) return [2, null];
            for (s = 0; s < e.children.length; s++) {
              l = e.children[s].dimension;
              i.children[s].setDimension(l);
            }
            i.recomputeChildrenDimensions();
            return [2, i];
          case 2:
            if (e.type !== "floating") return [3, 4];
            for (o = new WorkspaceFloating(this, e.id), s = 0; s < e.children.length; s++)
              if (e.children[s].type !== "window") {
                e.children.splice(s, 1);
                s--;
              }
            return [4, n(o)];
          case 3:
            m.sent();
            return [2, o];
          case 4:
            return e.type === "window" && Platform.isDesktopApp && electronMajorVersion >= 13
              ? ((a = new WorkspaceWindow(this, e.id, e)), [4, n(a)])
              : [3, 6];
          case 5:
            if ((m.sent(), a.children.length === 0)) return [2, null];
            for (s = 0; s < e.children.length; s++) {
              l = e.children[s].dimension;
              a.children[s].setDimension(l);
            }
            a.recomputeChildrenDimensions();
            return [2, a];
          case 6:
            return e.type !== "tabs"
              ? [3, 8]
              : ((c = new WorkspaceTabs(this, e.id)), e.stacked && c.setStacked(!0), [4, n(c)]);
          case 7:
            m.sent();
            return c.children.length === 0
              ? [2, null]
              : ((u = e.currentTab || 0), c.selectTabIndex(u), c.recomputeChildrenDimensions(), [2, c]);
          case 8:
            return e.type !== "leaf"
              ? [3, 10]
              : ((h = new WorkspaceLeaf(this.app, e.id)), (p = e.state || {}), [4, h.setViewState(p)]);
          case 9:
            m.sent();
            return h.view
              ? (e.group && h.setGroup(e.group), e.pinned && h.togglePinned(), [2, h])
              : (h.detach(), [2, null]);
          case 10:
            return e.type !== "mobile-drawer"
              ? [3, 12]
              : Platform.isMobile
                ? ((d = undefined),
                  t === "left" ? (d = new EJ(this, e.id)) : t === "right" && (d = new SJ(this, e.id)),
                  [4, n(d)])
                : [2, null];
          case 11:
            m.sent();
            d.currentTab = e.currentTab;
            d.recomputeChildrenDimensions();
            e.pinned && d.setPinned(!0);
            return [2, d];
          case 12:
            return [2, null];
        }
      });
    });
  };
  t.prototype.getLayout = function () {
    var e = {};
    e.main = this.rootSplit.serialize();
    e.left = this.leftSplit.serialize();
    e.right = this.rightSplit.serialize();
    e["left-ribbon"] = this.leftRibbon.serialize();
    this.floatingSplit.children.length && (e.floating = this.floatingSplit.serialize());
    var t = this.activeLeaf;
    t && (e.active = t.id);
    return e;
  };
  t.prototype.saveLayout = function () {
    return __awaiter(this, undefined, undefined, function () {
      var e, t, n;
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            if (!this.layoutReady) return [2];
            e = this.app.vault;
            (t = this.getLayout()).lastOpenFiles = this.recentFileTracker.serialize();
            i.label = 1;
          case 1:
            i.trys.push([1, 3, , 4]);
            n = Platform.isMobile ? P1 : A1;
            return [4, e.adapter.write(e.configDir + "/" + n, JSON.stringify(t, null, 2))];
          case 2:
            i.sent();
            return [3, 4];
          case 3:
            i.sent();
            return [3, 4];
          case 4:
            return [2];
        }
      });
    });
  };
  Object.defineProperty(t.prototype, "activeEditor", {
    get: function () {
      var e;
      return (e = this._activeEditor) !== null && undefined !== e ? e : this.getActiveViewOfType(MarkdownView);
    },
    set: function (_activeEditor) {
      if (!(_activeEditor instanceof MarkdownView)) {
        this._activeEditor = _activeEditor;
      }
    },
    enumerable: false,
    configurable: true,
  });
  t.prototype.unsetActiveEditor = function (e) {
    if (!(e && this._activeEditor !== e)) {
      this._activeEditor = null;
    }
  };
  t.prototype.onDragLeaf = function (e, t) {
    var n = this;
    if (Platform.isPhone) e.preventDefault();
    else {
      var i = function (e) {
        if (e.touches.length === 0) {
          v();
        }
      };
      Platform.isMobile && window.addEventListener("touchend", i);
      Platform.isIosApp && (Ac(), navigator.vibrate(200));
      e.dataTransfer.setData("text/plain", "");
      var r = createDiv("drag-ghost mod-leaf", function (e) {
        e.createDiv("drag-ghost-icon", function (e) {
          setIcon(e, t.getIcon());
        });
        e.createSpan({
          text: hc(t.getDisplayText(), 60),
        });
      });
      Platform.isMobile
        ? setupTransparentDragImage(e)
        : (e.doc.body.appendChild(r),
          e.dataTransfer.setDragImage(r, 0, 0),
          setTimeout(function () {
            return r.detach();
          }));
      var o = this.app.dragManager,
        a = null,
        s = createDiv("workspace-fake-target-overlay"),
        l = e.clientX,
        c = e.clientY,
        u = false,
        h = null;
      t.loadIfDeferred();
      var p = function (e, t) {
          return e instanceof WorkspaceSidedock ? ["left", "right", "top", "bottom"] : t ? ["left", "right"] : null;
        },
        d = function () {
          h && (h.style.opacity = null);
          o.hideOverlay();
          s.hide();
        },
        f = function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "none";
          var i = e.clientX,
            f = e.clientY;
          if (!u) {
            var m = i - l,
              g = f - c;
            if (m * m + g * g < 25) return;
            u = true;
            document.body.addClass("is-grabbing");
          }
          var v = e.doc,
            y = n.getDropLocation(e);
          if (y && y !== t) {
            if (Platform.isMobile) {
              r.style.left = i - r.offsetWidth / 2 + "px";
              r.style.top = f - r.offsetHeight - 20 + "px";
              var b = e.doc;
              r.parentNode !== b.body && b.body.appendChild(r);
              r.show();
            }
            var w = y.getRoot(),
              k = w === n.leftSplit || w === n.rightSplit;
            if (t.view instanceof ItemView || w === n.leftSplit || w === n.rightSplit) {
              var C = y.containerEl.getBoundingClientRect(),
                E = C.width,
                S = C.height,
                M = C.x,
                x = C.y,
                T = n.getDropDirection(e, C, p(y, k), y);
              if (y instanceof WorkspaceTabs || y !== t.parent || (T !== "center" && t.parent.children.length !== 1)) {
                if (
                  ((e.dataTransfer.dropEffect = "move"),
                  y === n.leftSplit && n.leftSplit.collapsed
                    ? (C = n.leftSidebarToggleButtonEl.getBoundingClientRect())
                    : y === n.rightSplit && n.rightSplit.collapsed
                      ? (C = n.rightSidebarToggleButtonEl.getBoundingClientRect())
                      : y instanceof WorkspaceTabs && T === "center" && (C = y.getTabInsertLocation(i).rect),
                  y instanceof WorkspaceParent && y.children.length === 1 && y.children[0] === t)
                )
                  d();
                else {
                  if ((o.showOverlay(v, C), T === "center")) {
                    h && (h.style.opacity = null);
                    return void s.hide();
                  }
                  var D, A, P, L;
                  if (
                    (T === "top"
                      ? ((D = C.x), (A = x + C.height), (L = E), (P = S - C.height))
                      : T === "left"
                        ? ((D = M + C.width), (A = C.y), (L = E - C.width), (P = S))
                        : T === "right"
                          ? ((D = M), (A = x), (L = E - C.width), (P = S))
                          : T === "bottom" && ((D = M), (A = x), (L = E), (P = S - C.height)),
                    !a || !h || y.containerEl !== h)
                  ) {
                    h && (h.style.opacity = null);
                    s.empty();
                    s.appendChild(y.containerEl.cloneNode(!0));
                    y.containerEl.style.opacity = "0";
                    h = y.containerEl;
                    for (var I = s, O = y.containerEl.parentElement, F = O.doc.body; O && O !== F; ) {
                      var N = createDiv(O.className);
                      N.appendChild(I);
                      I = N;
                      O = O.parentElement;
                    }
                    a && a.detach();
                    a = I;
                  }
                  y.containerEl.style.opacity = T === "center" ? null : "0";
                  a.parentNode !== v.body && (a.addClass("workspace-fake-target-container"), v.body.appendChild(a));
                  s.toggle(T !== "center");
                  s.toggleClass("is-in-sidebar", w !== n.rootSplit);
                  s.style.transform = "translate(".concat(D, "px, ").concat(A, "px)");
                  s.style.width = "".concat(L, "px");
                  s.style.height = "".concat(P, "px");
                }
              } else d();
            } else d();
          } else d();
        },
        m = false,
        g = function (e) {
          if (((m = false), v(), u)) {
            var i = n.getDropLocation(e);
            if (i && i !== t) {
              var r = i.getRoot(),
                o = r === n.leftSplit || r === n.rightSplit,
                a = t.parent;
              if (i instanceof WorkspaceParent && (i === n.leftSplit || i === n.rightSplit)) {
                if ((a.removeChild(t), t.setDimension(null), Platform.isMobile)) i.insertChild(-1, t);
                else {
                  var s = i.children.first(),
                    l = undefined;
                  s instanceof WorkspaceTabs ? (l = s) : ((l = new WorkspaceTabs(n)), i.insertChild(-1, l));
                  l.insertChild(-1, t);
                }
                n.requestResize();
              } else if (t.view instanceof ItemView || r === n.leftSplit || r === n.rightSplit) {
                var c = i.containerEl.getBoundingClientRect(),
                  h = n.getDropDirection(e, c, p(i, o), i);
                if (
                  i instanceof WorkspaceTabs ||
                  i !== t.parent ||
                  (h !== "center" && t.parent.children.length !== 1)
                ) {
                  if ((o && t.setGroupMember(null), i instanceof WorkspaceTabs && h === "center")) {
                    var d = i.getTabInsertLocation(e.clientX).index;
                    if (a === i) {
                      var f = i.children.indexOf(t);
                      if ((d > f && d--, f === d)) return;
                    }
                    a.removeChild(t);
                    t.setDimension(null);
                    i.insertChild(d, t);
                    i.selectTabIndex(i.children.indexOf(t));
                    return void n.requestResize();
                  }
                  if (!(i instanceof WorkspaceParent && i.children.length === 1 && i.children[0] === t)) {
                    var g = i.parent;
                    if (g && g instanceof WorkspaceSplit) {
                      var y = h === "top" || h === "bottom" ? "horizontal" : "vertical";
                      if (o) {
                        l = new WorkspaceTabs(n);
                        n.splitLeaf(i, l, y, h === "left" || h === "top");
                        a.removeChild(t);
                        t.setDimension(null);
                        l.insertChild(0, t);
                      } else if (h === "center") {
                        var b = a.children.indexOf(t),
                          w = g.children.indexOf(i),
                          k = t.dimension,
                          C = i.dimension,
                          E = new WorkspaceLeaf(n.app);
                        g.replaceChild(w, E);
                        a.replaceChild(b, i);
                        g.replaceChild(w, t);
                        t.setDimension(C);
                        i.setDimension(k);
                        i instanceof WorkspaceLeaf && i.view instanceof Pj && i.detach();
                      } else {
                        a.removeChild(t);
                        t.setDimension(null);
                        n.splitLeaf(i, t, y, h === "left" || h === "top");
                      }
                      n.requestResize();
                    } else;
                  }
                }
              }
            }
          }
        },
        v = function () {
          if (
            (window.removeEventListener("touchend", i),
            window.removeEventListener("dragover", f),
            window.removeEventListener("dragenter", y),
            window.removeEventListener("dragleave", b),
            window.removeEventListener("dragend", v, {
              capture: !0,
            }),
            window.removeEventListener("drop", g),
            h && (h.style.opacity = null),
            o.removeOverlay(),
            r.detach(),
            a == null || a.detach(),
            s.detach(),
            document.body.removeClass("is-grabbing"),
            Platform.isMobile &&
              (u ||
                e.target.dispatchEvent(
                  new MouseEvent("contextmenu", {
                    button: 0,
                    buttons: 0,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    metaKey: e.metaKey,
                    shiftKey: e.shiftKey,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    bubbles: true,
                    cancelable: true,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  }),
                )),
            Platform.isDesktopApp && e && m && t.view instanceof ItemView)
          ) {
            var size = t.containerEl.getBoundingClientRect(),
              zoom = t.containerEl.win.electron.webFrame.getZoomLevel();
            m = false;
            t.parent && t.parent.removeChild(t);
            t.setDimension(null);
            n.openPopout({
              x: e.screenX,
              y: e.screenY,
              size: size,
              zoom: zoom,
            }).insertChild(0, WorkspaceTabs.createFrom(n, t));
            n.setActiveLeaf(t, {
              focus: !0,
            });
          }
        },
        y = function (e) {
          e.target && (m = false);
          f(e);
        },
        b = function (e) {
          if (!(e.relatedTarget || e.buttons === 0)) {
            d();
            e.win.setTimeout(function () {
              m = true;
            }, 10);
          }
        };
      window.addEventListener("dragover", f);
      window.addEventListener("dragenter", y);
      window.addEventListener("dragleave", b);
      window.addEventListener("dragend", v, {
        capture: !0,
      });
      window.addEventListener("drop", g);
    }
  };
  t.prototype.onStartLink = function (e) {
    var t = this,
      n = this.app.dragManager,
      i = function (i) {
        i.preventDefault();
        var r = t.getDropLocation(i);
        if (r && r !== e) {
          if ((r instanceof WorkspaceTabs && (r = r.children[r.currentTab]), r instanceof WorkspaceLeaf)) {
            if (r.view instanceof ItemView) {
              var o = r.containerEl.getBoundingClientRect();
              n.showOverlay(i.doc, o);
            } else n.hideOverlay();
          } else n.hideOverlay();
        } else n.hideOverlay();
      },
      r = function (o) {
        window.removeEventListener("mousemove", i);
        window.removeEventListener("mouseup", r);
        n.removeOverlay();
        var a = t.getDropLocation(o);
        if (a && a !== e) {
          a instanceof WorkspaceTabs && (a = a.children[a.currentTab]);
          a instanceof WorkspaceLeaf && a.view instanceof ItemView && e.setGroupMember(a);
        }
      };
    window.addEventListener("mousemove", i);
    window.addEventListener("mouseup", r);
  };
  t.prototype.getDropLocation = function (e) {
    var t = e.win;
    if (t !== window)
      for (var n = 0, i = this.floatingSplit.children; n < i.length; n++) {
        var r = i[n];
        if (r instanceof WorkspaceWindow && r.win === t) return this.recursiveGetTarget(e, r);
      }
    var o = this,
      a = o.leftRibbon,
      s = o.rightRibbon,
      l = o.leftSidebarToggleButtonEl,
      c = o.rightSidebarToggleButtonEl,
      u = o.leftSplit,
      h = o.rightSplit,
      p = o.rootSplit;
    return isPointInElementRect(e, a.containerEl) || isPointInElementRect(e, l)
      ? u
      : isPointInElementRect(e, s.containerEl) || isPointInElementRect(e, c)
        ? h
        : isPointInElementRect(e, u.containerEl)
          ? u.children.length === 0
            ? u
            : this.recursiveGetTarget(e, u)
          : isPointInElementRect(e, h.containerEl)
            ? h.children.length === 0
              ? h
              : this.recursiveGetTarget(e, h)
            : isPointInElementRect(e, p.containerEl)
              ? this.recursiveGetTarget(e, p)
              : null;
  };
  t.prototype.recursiveGetTarget = function (e, t) {
    for (var n = 0, i = t.children; n < i.length; n++) {
      var r = i[n];
      if (isPointInElementRect(e, r.containerEl))
        return r instanceof WorkspaceTabs ? r : r instanceof WorkspaceParent ? this.recursiveGetTarget(e, r) : r;
    }
    return null;
  };
  t.prototype.getDropDirection = function (e, t, n, i) {
    var r = e.clientX,
      o = e.clientY,
      a = Math.abs(r - t.x) / t.width,
      s = Math.abs(o - t.y) / t.height,
      l = Math.abs(r - (t.x + t.width)) / t.width,
      c = Math.abs(o - (t.y + t.height)) / t.height;
    n = n || [];
    i instanceof WorkspaceTabs &&
      i.isStacked &&
      !isPointInElementRect(e, i.tabHeaderContainerEl) &&
      n.push("left", "right");
    var u = "center",
      h = 1;
    if (s < 0.33 && s < h && !n.contains("top"))
      if (((h = s), i instanceof WorkspaceTabs)) {
        if (!i.isStacked && isPointInElementRect(e, i.tabHeaderContainerEl)) {
          h = 0;
        }
        var p = i.tabHeaderContainerEl.getBoundingClientRect();
        o - t.y <= p.height / 3 ? (u = "top") : ((u = "center"), i.isStacked && (h = 1));
      } else u = "top";
    a < 0.33 && a < h && !n.contains("left") && ((h = a), (u = "left"));
    l < 0.33 && l < h && !n.contains("right") && ((h = l), (u = "right"));
    c < 0.33 && c < h && !n.contains("bottom") && ((h = c), (u = "bottom"));
    var width = ["left", "right"].contains(u) ? t.width : t.height;
    switch (((width = Math.max(width / 3, 40)), u)) {
      case "center":
        break;
      case "left":
        t.width = width;
        break;
      case "top":
        t.height = width;
        break;
      case "right":
        t.x += t.width - width;
        t.width = width;
        break;
      case "bottom":
        t.y += t.height - width;
        t.height = width;
    }
    return u;
  };
  t.prototype.createLeafInParent = function (e, t) {
    var n = new WorkspaceLeaf(this.app);
    e.children.length > 0 && n.setDimension(100 / e.children.length);
    e.insertChild(t, n);
    this.setActiveLeaf(n);
    return n;
  };
  t.prototype.splitLeaf = function (e, t, n, i) {
    var r, o;
    if (undefined === n) {
      n = "vertical";
    }
    for (var a = e; a; ) {
      if (a instanceof WorkspaceSplit) {
        o = (r = a).children.indexOf(e);
        break;
      }
      e = a;
      a = a.parent;
    }
    if (!(t instanceof WorkspaceTabs)) {
      t = WorkspaceTabs.createFrom(this, t);
    }
    var s = e.dimension;
    if (n !== r.direction) {
      e.setDimension(null);
      var l = new WorkspaceSplit(this, n);
      r.replaceChild(o, l);
      l.setDimension(s);
      i ? (l.insertChild(0, t), l.insertChild(1, e)) : (l.insertChild(0, e), l.insertChild(1, t));
    } else {
      s !== null && (e.setDimension(s / 2), t.setDimension(s / 2));
      i ? r.insertChild(o, t) : r.insertChild(o + 1, t);
    }
  };
  t.prototype.createLeafBySplit = function (e, t, n) {
    var i = new WorkspaceLeaf(this.app);
    this.splitLeaf(e, i, t, n);
    this.setActiveLeaf(i);
    return i;
  };
  t.prototype.splitActiveLeaf = function (e) {
    var t = this.getMostRecentLeaf();
    return t ? this.createLeafBySplit(t, e) : this.createLeafInParent(this.rootSplit, 0);
  };
  t.prototype.splitLeafOrActive = function (e, t) {
    return e ? this.createLeafBySplit(e, t) : this.splitActiveLeaf(t);
  };
  t.prototype.duplicateLeaf = function (e, t, n) {
    return __awaiter(this, undefined, Promise, function () {
      var i, r, o, a;
      return __generator(this, function (s) {
        switch (s.label) {
          case 0:
            return e
              ? ((t !== "horizontal" && t !== "vertical") || ((n = t), (t = "split")),
                (i = e.getViewState()),
                (r = e.getEphemeralState()),
                (o = e.history.serialize()),
                [
                  4,
                  (a = t === "split" ? this.createLeafBySplit(e, n) : this.getLeaf(t)).setViewState(
                    i,
                    __assign(__assign({}, r), {
                      focus: !0,
                    }),
                  ),
                ])
              : [2];
          case 1:
            s.sent();
            a.history.deserialize(o);
            return [2, a];
        }
      });
    });
  };
  t.prototype.getUnpinnedLeaf = function (e) {
    var t, n;
    if (undefined === e) {
      e = true;
    }
    var i = this.activeLeaf;
    if (i && i.canNavigate()) return i;
    var r = (t = i == null ? undefined : i.getContainer()) !== null && undefined !== t ? t : this.rootSplit,
      o = null;
    if (
      (this.iterateLeaves(r, function (e) {
        if (e.canNavigate()) {
          var t = e.parent;
          if (
            t &&
            (t.children[t.currentTab] === e || (t instanceof WorkspaceTabs && t.isStacked)) &&
            (!o || o.activeTime < e.activeTime)
          ) {
            o = e;
          }
        }
      }),
      !o)
    ) {
      var a = this.getMostRecentLeaf(r),
        s = (n = a == null ? undefined : a.parent) !== null && undefined !== n ? n : r;
      o = new WorkspaceLeaf(this.app);
      s.insertChild(-1, o);
    }
    e && this.setActiveLeaf(o);
    return o;
  };
  t.prototype.getLeaf = function (e, t) {
    return e === "split"
      ? this.splitActiveLeaf(t)
      : e === "tab" || !0 === e
        ? this.createLeafInTabGroup()
        : e === "window"
          ? this.openPopoutLeaf()
          : this.getUnpinnedLeaf();
  };
  t.prototype.createLeafInTabGroup = function (e) {
    if (!e) {
      var t = this.getMostRecentLeaf();
      if (!t) throw new Error("No tab group found.");
      e = t.parent;
    }
    for (var n = e.children.length - 1, i = e.children[n], r = 0; r < e.children.length; r++) {
      var o = e.children[r];
      if (o.activeTime > i.activeTime) {
        i = o;
        n = r;
      }
    }
    if (i.view instanceof Pj) return i;
    var a = new WorkspaceLeaf(this.app);
    e.insertChild(n + 1, a);
    this.app.vault.getConfig("focusNewTab") && this.setActiveLeaf(a);
    return a;
  };
  t.prototype.moveLeafToPopout = function (e, t) {
    var n;
    if ((I1(), e.view instanceof ItemView)) {
      t != null || (t = {});
      t.size || (t.size = e.containerEl.getBoundingClientRect());
      t.zoom || (t.zoom = e.containerEl.win.electron.webFrame.getZoomLevel());
      var i = this.app.workspace.openPopout(t);
      (n = e.parent) === null || undefined === n || n.removeChild(e);
      e.setDimension(null);
      i.insertChild(0, WorkspaceTabs.createFrom(this, e));
      return i;
    }
  };
  t.prototype.openPopout = function (e) {
    I1();
    var t = new WorkspaceWindow(this, null, e);
    this.floatingSplit.insertChild(-1, t);
    return t;
  };
  t.prototype.openPopoutLeaf = function (e) {
    var t = this.openPopout(e),
      n = new WorkspaceLeaf(this.app);
    t.insertChild(0, WorkspaceTabs.createFrom(this, n));
    return n;
  };
  t.prototype.openLinkText = function (e, t, n, i) {
    return __awaiter(this, undefined, undefined, function () {
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.getLeaf(n).openLinkText(e, t, i)];
          case 1:
            r.sent();
            return [2];
        }
      });
    });
  };
  t.prototype.setActiveLeaf = function (activeLeaf, t, n) {
    var i;
    if (t && typeof t != "boolean") {
      n = t.focus;
    }
    var r = this.activeLeaf;
    if (this.isAttached(activeLeaf))
      if (r !== activeLeaf) {
        if (
          (r && (r.containerEl.removeClass("mod-active"), r.tabHeaderEl.removeClass("mod-active")),
          this.activeTabGroup && this.activeTabGroup.containerEl.removeClass("mod-active"),
          (this.activeLeaf = activeLeaf),
          (this.activeTabGroup = activeLeaf == null ? undefined : activeLeaf.parent),
          (this._activeEditor = null),
          activeLeaf)
        ) {
          activeLeaf.activeTime = Date.now();
          activeLeaf.containerEl.addClass("mod-active");
          activeLeaf.tabHeaderEl.addClass("mod-active");
          (i = this.activeTabGroup) === null || undefined === i || i.containerEl.addClass("mod-active");
          var o = activeLeaf.parent;
          if (o instanceof WorkspaceTabs) {
            var a = o.children.indexOf(activeLeaf);
            o.selectTabIndex(a);
          }
          var s = activeLeaf.getContainer();
          s instanceof WorkspaceWindow ? s.updateTitle() : this.updateTitle();
          n &&
            (Platform.isDesktopApp && s.focus(),
            activeLeaf.setEphemeralState({
              focus: !0,
            }));
          this.updateMobileVisibleTabGroup();
          this.requestActiveLeafEvents();
        }
      } else if (n && activeLeaf) {
        activeLeaf.setEphemeralState({
          focus: !0,
        });
      }
  };
  t.prototype.activeLeafEvents = function () {
    if (this.layoutReady) {
      var e = this.activeLeaf;
      this.trigger("active-leaf-change", e);
      var t = this.lastActiveFile,
        lastActiveFile = this.getActiveFile();
      if (t !== lastActiveFile) {
        this.recentFileTracker.onFileOpen(lastActiveFile, t);
        this.lastActiveFile = lastActiveFile;
        this.trigger("file-open", lastActiveFile);
      }
    }
  };
  t.prototype.getLeafById = function (e) {
    var t = null;
    this.iterateAllLeaves(function (n) {
      if (n.id === e) {
        t = n;
        return !0;
      }
    });
    return t;
  };
  t.prototype.getGroupLeaves = function (e) {
    var t = [];
    return e
      ? (this.iterateAllLeaves(function (n) {
          if (n.group === e) {
            t.push(n);
          }
        }),
        t)
      : t;
  };
  t.prototype.getFocusedContainer = function () {
    if (activeWindow === window) return this.rootSplit;
    for (var e = 0, t = this.floatingSplit.children; e < t.length; e++) {
      var n = t[e];
      if (n instanceof WorkspaceWindow && n.win === activeWindow) return n;
    }
    return this.rootSplit;
  };
  t.prototype.isAttached = function (e) {
    if (!e) return !1;
    var t = e.getRoot();
    return [this.leftSplit, this.rootSplit, this.floatingSplit, this.rightSplit].includes(t);
  };
  t.prototype.getMostRecentLeaf = function (e) {
    var t = null;
    this.iterateLeaves(e != null ? e : [this.rootSplit, this.floatingSplit], function (e) {
      if (!t || t.activeTime < e.activeTime) {
        t = e;
      }
    });
    return t;
  };
  t.prototype.getLeftLeaf = function (e) {
    return this.getSideLeaf(this.leftSplit, e);
  };
  t.prototype.getRightLeaf = function (e) {
    return this.getSideLeaf(this.rightSplit, e);
  };
  t.prototype.ensureSideLeaf = function (typee0, t, n) {
    return __awaiter(this, undefined, Promise, function () {
      var i, r, o, a, s, state, c, u;
      return __generator(this, function (h) {
        switch (h.label) {
          case 0:
            r = (i = n || {}).active;
            o = i.split;
            a = i.reveal;
            s = undefined === a || a;
            state = i.state;
            c = this.getLeavesOfType(typee0);
            u = c.length === 0 ? (t === "left" ? this.getLeftLeaf(o) : this.getRightLeaf(o)) : c[0];
            return r || s ? [4, u.loadIfDeferred()] : [3, 2];
          case 1:
            h.sent();
            h.label = 2;
          case 2:
            return state || u.view.getViewType() !== typee0
              ? [
                  4,
                  u.setViewState({
                    type: typee0,
                    state: state,
                  }),
                ]
              : [3, 4];
          case 3:
            h.sent();
            h.label = 4;
          case 4:
            return s ? [4, this.revealLeaf(u)] : [3, 6];
          case 5:
            h.sent();
            h.label = 6;
          case 6:
            r &&
              this.setActiveLeaf(u, {
                focus: !0,
              });
            return [2, u];
        }
      });
    });
  };
  t.prototype.getActiveLeafOfViewType = function (e) {
    return this.getActiveViewOfType(e);
  };
  t.prototype.getActiveViewOfType = function (e) {
    var t = this.activeLeaf;
    if (!t) return null;
    var n = t.view;
    return n instanceof e ? n : null;
  };
  t.prototype.getActiveFileView = function () {
    var e = this.activeLeaf;
    if (e && e.view.navigation) return e.view instanceof FileView ? e.view : null;
    e = null;
    var t = null;
    this.iterateAllLeaves(function (n) {
      if (n.view.navigation && (!e || e.activeTime < n.activeTime)) {
        e = n;
        t = n.view instanceof FileView ? n.view : null;
      }
    });
    return t;
  };
  t.prototype.getActiveFile = function () {
    var e, t;
    return (
      ((e = this.activeEditor) === null || undefined === e ? undefined : e.file) ||
      ((t = this.getActiveFileView()) === null || undefined === t ? undefined : t.file) ||
      null
    );
  };
  t.prototype.getSideLeaf = function (e, t) {
    if (e instanceof CJ) {
      var n = new WorkspaceLeaf(this.app);
      e.insertChild(-1, n);
      return n;
    }
    if (t) {
      var i = new WorkspaceTabs(this);
      e.insertChild(-1, i);
      n = new WorkspaceLeaf(this.app);
      i.insertChild(-1, n);
      return n;
    }
    if (e.children.length === 0) {
      e.insertChild(0, new WorkspaceTabs(this));
    }
    var r = e.children[0];
    if (r instanceof WorkspaceParent) {
      n = new WorkspaceLeaf(this.app);
      r.insertChild(-1, n);
      return n;
    }
    return null;
  };
  t.prototype.iterateTabs = function (e, t) {
    if (!Array.isArray(e)) {
      e = [e];
    }
    for (var n = 0, i = e; n < i.length; n++) {
      var r = i[n];
      if (r instanceof WorkspaceTabs && t(r)) return !0;
      if (r instanceof WorkspaceParent && this.iterateTabs(r.children, t)) return !0;
    }
    return !1;
  };
  t.prototype.iterateLeaves = function (e, t) {
    if (typeof e == "function" && t instanceof WorkspaceItem) {
      var n = t;
      t = e;
      e = n;
    }
    if (Array.isArray(e))
      for (var i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        if (this.iterateLeaves(o, t)) return !0;
      }
    else if (e instanceof WorkspaceLeaf) {
      if (t(e)) return !0;
    } else if (e instanceof WorkspaceParent)
      for (var a = 0, s = e.children; a < s.length; a++) {
        var l = s[a];
        if (this.iterateLeaves(l, t)) return !0;
      }
    return !1;
  };
  t.prototype.iterateRootLeaves = function (e) {
    this.iterateLeaves(this.rootSplit, e);
  };
  t.prototype.iterateAllLeaves = function (e) {
    this.iterateLeaves(this.rootSplit, e);
    this.iterateLeaves(this.leftSplit, e);
    this.iterateLeaves(this.rightSplit, e);
    this.iterateLeaves(this.floatingSplit, e);
  };
  t.prototype.getLeavesOfType = function (e) {
    var t = [];
    this.iterateAllLeaves(function (n) {
      if (n.view.getViewType() === e) {
        t.push(n);
      }
    });
    return t;
  };
  t.prototype.detachLeavesOfType = function (e) {
    for (var t = 0, n = this.getLeavesOfType(e); t < n.length; t++) {
      n[t].detach();
    }
  };
  t.prototype.getAdjacentLeafInDirection = function (e, t) {
    if (!e) return null;
    if (e instanceof WorkspaceLeaf && e.parent instanceof WorkspaceTabs) {
      e = e.parent;
    }
    var n = e.containerEl.getBoundingClientRect(),
      i = null;
    switch (t) {
      case "top":
        i = {
          x: n.left + n.width / 2,
          y: n.top - 5,
        };
        break;
      case "bottom":
        i = {
          x: n.left + n.width / 2,
          y: n.top + n.height + 5,
        };
        break;
      case "left":
        i = {
          x: n.left - 5,
          y: n.top + n.height / 2,
        };
        break;
      case "right":
        i = {
          x: n.left + n.width + 5,
          y: n.top + n.height / 2,
        };
    }
    if (i) {
      var r = activeDocument.elementFromPoint(i.x, i.y),
        o = null,
        a = e.getContainer();
      if (
        (this.iterateLeaves(a, function (e) {
          if (e.containerEl.contains(r)) {
            o = e;
            return !0;
          }
        }),
        o ||
          this.iterateTabs(a, function (e) {
            if (e.containerEl.contains(r)) {
              o = e.children[e.currentTab];
              return !0;
            }
          }),
        o)
      )
        return o;
    }
    for (var s = null, l = t === "left" || t === "right" ? "vertical" : "horizontal"; e; ) {
      var c = e.parent;
      if (
        (c instanceof WorkspaceTabs && (t === "left" || t == "right")) ||
        (c instanceof WorkspaceSplit && c.direction === l)
      ) {
        var u = c.children,
          h = u.indexOf(e);
        if (t === "left" || t === "top") {
          if (h > 0) {
            s = u[h - 1];
            break;
          }
        } else if (h < u.length - 1) {
          s = u[h + 1];
          break;
        }
      }
      e = c;
    }
    if (!s) return null;
    for (; s instanceof WorkspaceParent; ) {
      var p = s instanceof WorkspaceTabs ? s.currentTab : 0;
      s = s.children[p];
    }
    return s instanceof WorkspaceLeaf ? s : null;
  };
  t.prototype.revealLeaf = function (e) {
    return __awaiter(this, undefined, undefined, function () {
      var t, n, i, r, o;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            t = e.getRoot();
            n = false;
            t instanceof WorkspaceSidedock && t.collapsed && ((n = true), t.expand());
            t instanceof CJ &&
              (t.openLeaf(e),
              t.expand(),
              t === this.leftSplit ? this.rightSplit.collapse() : t === this.rightSplit && this.leftSplit.collapse());
            (i = e.parent) instanceof WorkspaceTabs &&
              ((r = i.currentTab), i.selectTab(e), (n || i.currentTab !== r) && flashElement(e.tabHeaderEl));
            (o = e.getContainer()) && o.focus();
            return [4, e.loadIfDeferred()];
          case 1:
            a.sent();
            return [2];
        }
      });
    });
  };
  t.prototype.getLastOpenFiles = function () {
    return this.recentFileTracker.getLastOpenFiles();
  };
  t.prototype.getRecentFiles = function (e) {
    return this.recentFileTracker.getRecentFiles(e);
  };
  t.prototype.isInSidebar = function (e) {
    var t = this.leftSplit,
      n = this.rightSplit,
      i = e.getRoot();
    return i === t || i === n;
  };
  t.prototype.updateOptions = function () {
    if (this.layoutReady) {
      this.iterateAllLeaves(function (e) {
        e && e.view instanceof MarkdownView && e.view.updateOptions();
      });
      Platform.isDesktopApp && !isMacOS && setSpellCheckerLanguages(this.app.getSpellcheckLanguages());
    }
  };
  t.prototype.onLayoutChange = function (e) {
    if ((this.requestUpdateLayout(), e)) {
      var t = this.layoutItemQueue;
      if (!t.contains(e)) {
        t.push(e);
      }
    }
  };
  t.prototype.updateLayout = function () {
    var e, t;
    if (this.layoutReady) {
      for (var n = this.layoutItemQueue; n.length > 0; ) n.pop().recomputeChildrenDimensions();
      if (this.rootSplit.children.length === 0) {
        var i = new WorkspaceLeaf(this.app),
          r = new WorkspaceTabs(this);
        this.lastTabGroupStacked && r.setStacked(!0);
        r.insertChild(0, i);
        this.rootSplit.insertChild(0, r);
      }
      if (!this.activeLeaf || !this.isAttached(this.activeLeaf)) {
        var o = this.activeTabGroup,
          a = null;
        o && o instanceof WorkspaceTabs && this.isAttached(o) && (a = o.children[o.currentTab]);
        a || (a = this.getMostRecentLeaf(this.getFocusedContainer()));
        a ||
          this.iterateAllLeaves(function (e) {
            if (!a || a.activeTime < e.activeTime) {
              a = e;
            }
          });
        a || (a = this.createLeafInParent(this.rootSplit, 0));
        this.setActiveLeaf(a, {
          focus: !0,
        });
      }
      var activeTabGroup = (e = this.activeLeaf) === null || undefined === e ? undefined : e.parent;
      activeTabGroup !== this.activeTabGroup &&
        ((t = this.activeTabGroup) === null || undefined === t || t.containerEl.removeClass("mod-active"),
        (this.activeTabGroup = activeTabGroup),
        activeTabGroup == null || activeTabGroup.containerEl.addClass("mod-active"));
      this.updateMobileVisibleTabGroup();
      var l = {};
      for (var c in (this.iterateAllLeaves(function (e) {
        var t = e.group;
        if (t) {
          l[t] = (l[t] || 0) + 1;
        }
      }),
      l))
        if (l.hasOwnProperty(c) && l[c] === 1)
          for (var u = 0, h = this.getGroupLeaves(c); u < h.length; u++) {
            (i = h[u]).setGroup(null);
          }
      this.updateFrameless();
      this.updateTitle();
      this.requestSaveLayout();
      this.requestResize();
      this.requestLayoutChangeEvents();
    }
  };
  t.prototype.updateMobileVisibleTabGroup = function () {
    if (Platform.isMobile) {
      var e = this.activeLeaf;
      if (this.activeTabGroup instanceof CJ) {
        e = this.getMostRecentLeaf();
      }
      for (var t = new Set(), n = e.parent; n; ) {
        t.add(n);
        n.containerEl.addClass("mod-visible");
        n = n.parent;
      }
      var i = function (e) {
        if (!t.has(e)) {
          e.containerEl.removeClass("mod-visible");
        }
        for (var n = 0, r = e.children; n < r.length; n++) {
          var o = r[n];
          if (o instanceof WorkspaceParent) {
            i(o);
          }
        }
      };
      i(this.rootSplit);
    }
  };
  t.prototype.updateFrameless = function () {
    var e = this;
    if (this.layoutReady) {
      var t = this,
        n = t.rootSplit,
        i = t.leftSplit,
        r = t.rightSplit,
        o = t.floatingSplit,
        a = [],
        s = function (e) {
          if (e instanceof WorkspaceTabs) a.push(e);
          else if (e instanceof WorkspaceParent)
            for (var t = 0, n = e.children; t < n.length; t++) {
              var i = n[t];
              s(i);
            }
        };
      s(n);
      s(i);
      s(r);
      s(o);
      for (var l = 0, c = a; l < c.length; l++) {
        c[l].containerEl.removeClass("mod-top", "mod-top-left-space", "mod-top-right-space");
      }
      var u = function (t) {
        var o = [],
          a = function (e) {
            if (e instanceof WorkspaceTabs) o.push(e);
            else if (e instanceof WorkspaceSplit)
              if (e.direction === "vertical")
                for (var t = 0, n = e.children; t < n.length; t++) {
                  var i = n[t];
                  a(i);
                }
              else {
                var r = e.children[0];
                if (r) {
                  a(r);
                }
              }
          };
        a(t);
        for (var s = 0, l = o; s < l.length; s++) {
          l[s].containerEl.addClass("mod-top");
        }
        var c = null,
          u = null,
          h = null,
          p = null;
        if ((o.length > 0 && ((h = c = o.first()), (p = u = o.last())), t === n)) {
          var d = i.children[0],
            f = r.children[0];
          d instanceof WorkspaceTabs &&
            (d.containerEl.addClass("mod-top", "mod-top-left-space"), i.collapsed || (c = d));
          f instanceof WorkspaceTabs &&
            (f.containerEl.addClass("mod-top", "mod-top-right-space"), r.collapsed || (u = f));
          var m = e,
            g = m.leftSidebarToggleButtonEl,
            v = m.rightSidebarToggleButtonEl,
            y = function (e, t, n) {
              var i = e.parentElement;
              if (t !== i) {
                var r = n.prepend,
                  o = n.oldStyle,
                  a = n.newStyle,
                  s = e.offsetWidth,
                  l = i ? parseInt(getComputedStyle(i).paddingLeft) : 0,
                  c = t ? parseInt(getComputedStyle(t).paddingLeft) : 0;
                if ((isNaN(l) && (l = 0), isNaN(c) && (c = 0), i && o !== "")) {
                  var u = e.cloneNode(!0);
                  e.replaceWith(u);
                  var h = new cl(gJ);
                  o === "offset"
                    ? h.addProp("margin-left", c + "px", -s + "px").addProp("left", "", -l + "px")
                    : o !== "none" && h.addProp("overflow", "hidden", "hidden", "").addProp("width", s + "px", "0");
                  fl(u, h, function () {
                    return u.detach();
                  });
                }
                if ((r ? t.prepend(e) : t.appendChild(e), i && a !== "")) {
                  h = new cl(gJ);
                  a === "offset"
                    ? h.addProp("margin-left", -(s + l) + "px", "").addProp("left", -l + "px", "")
                    : a !== "none" && h.addProp("overflow", "hidden", "hidden", "").addProp("width", "0", s + "px", "");
                  fl(e, h);
                }
              }
            };
          (Platform.isDesktopApp &&
            (!e.leftRibbon.containerEl.isShown() || (Platform.isMacOS && window.titlebarStyle === "hidden"))) ||
          Platform.isTablet
            ? !i.collapsed && d instanceof WorkspaceTabs
              ? y(g, d.tabHeaderContainerEl, {
                  oldStyle: "offset",
                  newStyle: "",
                })
              : i.collapsed &&
                h &&
                y(g, h.tabHeaderContainerEl, {
                  prepend: true,
                  oldStyle: "none",
                  newStyle: "offset",
                })
            : e.leftRibbon.containerEl.prepend(g);
          Platform.isTablet && i instanceof CJ && i.isPinned && g.detach();
          Platform.isDesktopApp &&
          !r.collapsed &&
          (Platform.isMacOS || window.titlebarStyle !== "hidden" || electronWindow.isFullScreen())
            ? f instanceof WorkspaceTabs &&
              y(v, f.tabHeaderContainerEl, {
                newStyle: "",
              })
            : p &&
              y(v, p.tabHeaderContainerEl, {
                oldStyle: "none",
                newStyle: "",
              });
          Platform.isTablet && r instanceof CJ && r.isPinned && v.detach();
        }
        if (Platform.isDesktopApp) {
          c && c.containerEl.addClass("mod-top-left-space");
          u && u.containerEl.addClass("mod-top-right-space");
        }
      };
      u(n);
      for (var h = 0, p = o.children; h < p.length; h++) {
        var d = p[h];
        if (d instanceof WorkspaceWindow) {
          u(d);
        }
      }
      this.trigger("window-frame-change");
    }
  };
  t.prototype.onQuickPreview = function (e, t) {
    this.trigger("quick-preview", e, t);
  };
  t.prototype.onResize = function () {
    this.trigger("resize");
  };
  t.prototype.handleLinkContextMenu = function (e, t, n, i) {
    var r = this;
    if (!t) return !1;
    var o = parseLinktext(t).path,
      a = this.app.metadataCache.getFirstLinkpathDest(o, n);
    Platform.isPhone &&
      e.addItem(function (e) {
        return e
          .setSection("title")
          .setTitle(a ? a.getShortName() : o)
          .setIsLabel(!0);
      });
    return a
      ? (Platform.isPhone &&
          e.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openLink())
              .setIcon("lucide-file")
              .onClick(function (e) {
                return r.openLinkText(t, n, Keymap.isModEvent(e));
              });
          }),
        e.addItem(function (e) {
          return e
            .setSection("open")
            .setTitle(i18nProxy.interface.menu.openInNewTab())
            .setIcon("lucide-file-plus")
            .onClick(function () {
              r.app.workspace.openLinkText(t, n, "tab");
            });
        }),
        Platform.canSplit &&
          e.addItem(function (e) {
            return e
              .setSection("open")
              .setTitle(i18nProxy.interface.menu.openToTheRight())
              .setIcon("lucide-separator-vertical")
              .onClick(function () {
                r.app.workspace.openLinkText(t, n, "split");
              });
          }),
        e.addItem(function (e) {
          return e
            .setSection("action")
            .setTitle(i18nProxy.plugins.fileExplorer.menuOptRename())
            .setIcon("lucide-edit-3")
            .onClick(function () {
              return r.app.fileManager.promptForFileRename(a);
            });
        }),
        this.trigger("file-menu", e, a, "link-context-menu", i),
        !0)
      : (e.addItem(function (e) {
          return e
            .setSection("open")
            .setTitle(i18nProxy.interface.menu.createFile())
            .setIcon("lucide-file")
            .onClick(function (e) {
              return r.openLinkText(t, n, Keymap.isModEvent(e));
            });
        }),
        !0);
  };
  t.prototype.handleExternalLinkContextMenu = function (e, t) {
    return (
      !!t &&
      (e.addItem(function (e) {
        return e
          .setTitle(i18nProxy.interface.menu.copyUrl())
          .setSection("info")
          .setIcon("lucide-link")
          .onClick(function () {
            vc(t);
            new Notice(
              i18nProxy.interface.copied({
                item: i18nProxy.interface.url(),
              }),
            );
          });
      }),
      e.addItem(function (e) {
        return e
          .setTitle(i18nProxy.plugins.webViewer.actionOpenLinkDefaultBrowser())
          .setIcon("lucide-globe-2")
          .setSection("open")
          .onClick(function () {
            window.open(t, "_external");
          });
      }),
      this.trigger("url-menu", e, t),
      !0)
    );
  };
  t.prototype.iterateCodeMirrors = function (e) {};
  t.prototype.addMobileFileInfo = function (e) {
    this.mobileFileInfos.push(e);
  };
  t.prototype.registerUriHook = function () {
    var e = this,
      OBS_ACT = function (t) {
        if (t) {
          console.log("Received URL action", t);
          e.getFocusedContainer().focus();
          var n = e.protocolHandlers;
          if (n.has(t.action)) n.get(t.action)(t);
        }
      },
      n = window.OBS_ACT;
    if (((window.OBS_ACT = OBS_ACT), n && OBS_ACT(n), isNotWeb)) {
      capacitorAppPlugin.addListener("appUrlOpen", function (n) {
        var i;
        i = n.url;
        __awaiter(e, undefined, undefined, function () {
          var e;
          return __generator(this, function (n) {
            return i && (e = v$(i))
              ? e.vault && e.vault.toLowerCase() !== this.app.vault.getName().toLowerCase()
                ? (sessionStorage.setItem("obsidian-uri", i), window.location.reload(), [2])
                : (OBS_ACT(e), [2])
              : [2];
          });
        });
      });
    }
  };
  t.prototype.registerObsidianProtocolHandler = function (e, t) {
    if (this.protocolHandlers.has(e)) throw new Error('Action "'.concat(e, '" is already registered as a handler.'));
    this.protocolHandlers.set(e, t);
  };
  t.prototype.unregisterObsidianProtocolHandler = function (e, t) {
    if (!(t && this.protocolHandlers.get(e) !== t)) {
      this.protocolHandlers.delete(e);
    }
  };
  t.prototype.registerHoverLinkSource = function (e, t) {
    this.hoverLinkSources[e] = t;
  };
  t.prototype.unregisterHoverLinkSource = function (e) {
    delete this.hoverLinkSources[e];
  };
  t.prototype.registerOperatorFuncConfigs = function (e, t) {
    this.operatorFuncConfigs[e] = t;
  };
  t.prototype.unregisterOperatorFuncConfigs = function (e) {
    delete this.operatorFuncConfigs[e];
  };
  t.prototype.hasUndoHistory = function () {
    return this.undoHistory.length > 0;
  };
  t.prototype.pushUndoHistory = function (e, parentId, rootId) {
    if (e) {
      var state = e.getViewState();
      if (state.type !== "empty") {
        var eState = e.getEphemeralState(),
          o = this.undoHistory;
        o.unshift({
          leafId: e.id,
          state: state,
          eState: eState,
          parentId: parentId,
          rootId: rootId,
          leafHistory: e.history.serialize(),
        });
        o.length > 10 && o.pop();
      }
    }
  };
  t.prototype.updateTitle = function () {
    var e = this.getMostRecentLeaf(this.rootSplit);
    document.title = this.app.getAppTitle(e ? e.getDisplayText().trim() : "");
  };
  t.prototype.registerEditorExtension = function (e) {
    this.editorExtensions.push(e);
    this.updateOptions();
  };
  t.prototype.unregisterEditorExtension = function (e) {
    this.editorExtensions.remove(e);
    this.updateOptions();
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
var F1 = "manifest.json",
  N1 = "main.js",
  R1 = "styles.css";
Prec.override = Prec.highest;
Prec.extend = Prec.high;
Prec.fallback = Prec.lowest;
var B1 =
    "See the stack trace to find the faulty plugin and file an issue with the plugin author. \nDetails: https://discuss.codemirror.net/t/release-0-20-0/4302",
  V1 = Tree.prototype.iterate,
  H1 = function (e) {
    return function (t) {
      console.error(new Error("[CM6] tree.iterate has changed syntax.\n".concat(B1)));
      e.call(this, t.type, t.from, t.to);
    };
  };
Tree.prototype.iterate = function (e) {
  e.enter && e.enter.length > 1 && (e.enter = H1(e.enter));
  e.leave && e.leave.length > 1 && (e.leave = H1(e.leave));
  V1.call(this, e);
};
var define = {
  from: function () {},
};
codemirrorTooltip.PluginField = {
  define: define,
  decorations: define,
  atomicRanges: define,
  scrollMargins: define,
};
var q1 = {
    obsidian: obsidian,
    "@codemirror/autocomplete": codemirrorClosebrackets,
    "@codemirror/collab": codemirrorCollab,
    "@codemirror/commands": codemirrorHistory,
    "@codemirror/language": codemirrorStreamParser,
    "@codemirror/lint": codemirrorLint,
    "@codemirror/search": codemirrorSearch,
    "@codemirror/state": codemirrorRangeset,
    "@codemirror/text": codemirrorRangeset,
    "@codemirror/view": codemirrorTooltip,
    "@lezer/common": lezerCommon,
    "@lezer/lr": lezerLr,
    "@lezer/highlight": lezerHighlight,
  },
  W1 = {
    "@codemirror/closebrackets": codemirrorClosebrackets,
    "@codemirror/comment": codemirrorHistory,
    "@codemirror/fold": codemirrorStreamParser,
    "@codemirror/gutter": codemirrorTooltip,
    "@codemirror/highlight": codemirrorStreamParser,
    "@codemirror/history": codemirrorHistory,
    "@codemirror/matchbrackets": codemirrorStreamParser,
    "@codemirror/panel": codemirrorTooltip,
    "@codemirror/rangeset": codemirrorRangeset,
    "@codemirror/rectangular-selection": codemirrorTooltip,
    "@codemirror/stream-parser": codemirrorStreamParser,
    "@codemirror/tooltip": codemirrorTooltip,
  },
  Plugin = (function (e) {
    function t(app, manifest) {
      var i = e.call(this) || this;
      i._lastDataModifiedTime = 0;
      i._userDisabled = false;
      i.onConfigFileChange = debounce(i._onConfigFileChange, 50);
      i.app = app;
      i.manifest = manifest;
      return i;
    }
    __extends(t, e);
    t.prototype.load = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return this._loaded ? [2] : ((this._loaded = true), [4, this.onload()]);
            case 1:
              for (n.sent(), e = 0, t = this._children.slice(); e < t.length; e++) t[e].load();
              return [2];
          }
        });
      });
    };
    t.prototype.onload = function () {};
    t.prototype.addRibbonIcon = function (e, t, n) {
      var i = this.app,
        r = this.manifest.id + ":" + t,
        o = i.workspace.leftRibbon.addRibbonItemButton(r, e, t, n);
      this.register(function () {
        i.workspace.leftRibbon.removeRibbonAction(r);
        o.detach();
      });
      return o;
    };
    t.prototype.addStatusBarItem = function () {
      var e = this.app.statusBar.registerStatusBarItem();
      e.addClass("plugin-" + this.manifest.id.toLowerCase().replace(/[^_a-zA-Z0-9-]/, "-"));
      this.register(function () {
        return e.detach();
      });
      return e;
    };
    t.prototype.addCommand = function (e) {
      var t = this;
      e.id = this.manifest.id + ":" + e.id;
      e.name = this.manifest.name + ": " + e.name;
      this.app.commands.addCommand(e);
      this.register(function () {
        return t.app.commands.removeCommand(e.id);
      });
      return e;
    };
    t.prototype.removeCommand = function (e) {
      this.app.commands.removeCommand(this.manifest.id + ":" + e);
    };
    t.prototype.addSettingTab = function (e) {
      var t = this;
      this.app.setting.addSettingTab(e);
      this.register(function () {
        return t.app.setting.removeSettingTab(e);
      });
    };
    t.prototype.registerView = function (e, t) {
      var n = this;
      this.app.viewRegistry.registerView(e, t);
      this.register(function () {
        n.app.viewRegistry.unregisterView(e);
        n._userDisabled && n.app.workspace.detachLeavesOfType(e);
      });
    };
    t.prototype.registerHoverLinkSource = function (e, t) {
      var n = this;
      this.app.workspace.registerHoverLinkSource(e, t);
      this.register(function () {
        return n.app.workspace.unregisterHoverLinkSource(e);
      });
    };
    t.prototype.registerExtensions = function (e, t) {
      var n = this;
      this.app.viewRegistry.registerExtensions(e, t);
      this.register(function () {
        return n.app.viewRegistry.unregisterExtensions(e);
      });
    };
    t.prototype.registerMarkdownPostProcessor = function (e, t) {
      var n = this;
      MarkdownPreviewRenderer.registerPostProcessor(e, t);
      this.app.workspace.trigger("post-processor-change");
      this.register(function () {
        MarkdownPreviewRenderer.unregisterPostProcessor(e);
        n.app.workspace.trigger("post-processor-change");
      });
      return e;
    };
    t.prototype.registerMarkdownCodeBlockProcessor = function (e, t, n) {
      var i = this,
        r = MarkdownPreviewRenderer.createCodeBlockPostProcessor(e, t);
      MarkdownPreviewRenderer.registerPostProcessor(r, n);
      MarkdownPreviewRenderer.registerCodeBlockPostProcessor(e, t);
      this.app.workspace.trigger("post-processor-change");
      this.register(function () {
        MarkdownPreviewRenderer.unregisterCodeBlockPostProcessor(e);
        MarkdownPreviewRenderer.unregisterPostProcessor(r);
        i.app.workspace.trigger("post-processor-change");
      });
      return r;
    };
    t.prototype.registerBasesView = function (e, t) {
      var n = this.app.internalPlugins.getEnabledPluginById("bases");
      return (
        !!n &&
        (n.registerView(e, t),
        this.register(function () {
          n.deregisterView(e);
        }),
        !0)
      );
    };
    t.prototype.registerGlobalFunc = function (e) {
      QH.addGlobal(e);
      var t = e.name;
      this.register(function () {
        return QH.removeGlobal(t);
      });
    };
    t.prototype.registerInstanceFunc = function (e, t) {
      QH.addForType(e, t);
      var n = t.name;
      this.register(function () {
        return QH.removeForType(e, n);
      });
    };
    t.prototype.registerCodeMirror = function (e) {};
    t.prototype.registerEditorExtension = function (e) {
      var t = this;
      this.app.workspace.registerEditorExtension(e);
      this.register(function () {
        return t.app.workspace.unregisterEditorExtension(e);
      });
    };
    t.prototype.registerObsidianProtocolHandler = function (e, t) {
      var n = this;
      this.app.workspace.registerObsidianProtocolHandler(e, t);
      this.register(function () {
        return n.app.workspace.unregisterObsidianProtocolHandler(e, t);
      });
    };
    t.prototype.registerEditorSuggest = function (e) {
      var t = this;
      this.app.workspace.editorSuggest.addSuggest(e);
      this.register(function () {
        return t.app.workspace.editorSuggest.removeSuggest(e);
      });
    };
    t.prototype.loadData = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t;
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, this.app.vault.readPluginData(this.manifest.dir)];
            case 1:
              return (e = n.sent()) && this.onExternalSettingsChange
                ? ((t = this), [4, this.getModifiedTime()])
                : [3, 3];
            case 2:
              t._lastDataModifiedTime = n.sent();
              n.label = 3;
            case 3:
              return [2, e];
          }
        });
      });
    };
    t.prototype.saveData = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var _lastDataModifiedTime;
        return __generator(this, function (n) {
          _lastDataModifiedTime = Date.now();
          this._lastDataModifiedTime = _lastDataModifiedTime;
          return [
            2,
            this.app.vault.writePluginData(this.manifest.dir, e, {
              mtime: _lastDataModifiedTime,
            }),
          ];
        });
      });
    };
    t.prototype.loadCSS = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e, t, n, i, textContent, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              t = (e = this).app;
              n = e.manifest;
              i = n.dir + "/" + R1;
              return [4, t.vault.exists(i)];
            case 1:
              return s.sent() ? [4, t.vault.readRaw(i)] : [3, 3];
            case 2:
              textContent = s.sent();
              (o = createEl("style", {
                type: "text/css",
              })).textContent = textContent;
              a = this.app.customCss.styleEl;
              document.head.insertBefore(o, a);
              this.register(function () {
                return o.detach();
              });
              s.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    t.prototype.onUserEnable = function () {};
    t.prototype.getModifiedTime = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              e = this.app.vault;
              t.label = 1;
            case 1:
              t.trys.push([1, 3, , 4]);
              return [4, e.adapter.stat(normalizePath(this.manifest.dir + "/data.json"))];
            case 2:
              return [2, t.sent().mtime];
            case 3:
              t.sent();
              return [2, 0];
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype._onConfigFileChange = function () {
      return __awaiter(this, undefined, undefined, function () {
        var _lastDataModifiedTime;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return this.onExternalSettingsChange ? [4, this.getModifiedTime()] : [2];
            case 1:
              _lastDataModifiedTime = t.sent();
              this._lastDataModifiedTime < _lastDataModifiedTime && this.onExternalSettingsChange();
              this._lastDataModifiedTime = _lastDataModifiedTime;
              return [2];
          }
        });
      });
    };
    return t;
  })(Component),
  PluginSettingTab = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t, t.setting) || this;
      i.plugin = plugin;
      i.name = plugin.manifest.name;
      i.id = plugin.manifest.id;
      return i;
    }
    __extends(t, e);
    return t;
  })(SettingTab),
  j1 = (function (e) {
    function t(t, plugin) {
      var i = e.call(this, t, t.setting) || this;
      i.plugin = null;
      i.plugin = plugin;
      i.name = plugin.instance.name;
      i.id = plugin.instance.id;
      return i;
    }
    __extends(t, e);
    return t;
  })(SettingTab),
  G1 = /^\/\/[@#] sourceMappingURL=data:application\/json(?:;charset[:=][^;]+)?;base64,.*$/gm,
  K1 = "\n/* nosourcemap */";