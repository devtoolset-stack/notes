var MarkdownRenderChild = (function (e) {
    function t(containerEl) {
      var n = e.call(this) || this;
      n.containerEl = containerEl;
      return n;
    }
    __extends(t, e);
    return t;
  })(Component),
  MarkdownPreviewSection = (function () {
    function e(e) {
      this.rendered = false;
      this.height = 0;
      this.computed = false;
      this.lines = 0;
      this.used = true;
      this.highlightRanges = null;
      this.level = 0;
      this.headingCollapsed = false;
      this.shown = true;
      this.usesFrontMatter = false;
      this.html = e || "";
      this.el = createDiv();
      e === null &&
        ((this.rendered = true),
        (this.start = this.end =
          {
            line: 0,
            col: 0,
            offset: 0,
          }));
    }
    e.prototype.render = function () {
      if (!this.rendered) {
        var e = sanitizeHTMLToDom(this.html);
        this.el.appendChild(e);
        var t = this.el.firstChild;
        t && t.nodeType === Node.ELEMENT_NODE && this.el.addClass("el-" + t.tagName.toLowerCase());
        this.rendered = true;
        this.computed = false;
      }
    };
    e.prototype.resetCompute = function () {
      this.computed = false;
      var e = this.highlightRanges;
      if (e)
        for (var t = 0, n = e; t < n.length; t++) {
          n[t].rects = null;
        }
    };
    e.prototype.setCollapsed = function (headingCollapsed) {
      this.headingCollapsed = headingCollapsed;
      CO(this.el, headingCollapsed);
    };
    return e;
  })();
function KN(e, t) {
  var n = e.firstChild;
  if (n && n.instanceOf(HTMLHeadingElement)) {
    t(n);
  }
}
function YN(e, t) {
  for (var n = 0, i = e.findAll("li"); n < i.length; n++) {
    var r = i[n],
      o = r.findAll("ul, ol");
    if (o && o.length > 0) {
      t(r);
    }
  }
}
var ZN = null,
  XN = {
    progressiveRender: true,
    asyncParse: true,
    listBullet: !0,
  },
  MarkdownPreviewRenderer = (function () {
    function e(owner, n, i, workerPath, o) {
      if (undefined === o) {
        o = true;
      }
      var a = this;
      this.previewEl = null;
      this.sizerEl = null;
      this.pusherEl = null;
      this.header = null;
      this.footer = null;
      this.cssClasses = null;
      this.sections = [];
      this.asyncSections = [];
      this.recycledSections = [];
      this.lastText = null;
      this.text = "";
      this.frontmatter = null;
      this.queued = null;
      this.rendered = null;
      this.lastRender = 0;
      this.lastScroll = 0;
      this.viewportHeight = 0;
      this.renderedWidth = 0;
      this.renderExtra = 1;
      this.renderExtraMinPx = 500;
      this.addBottomPadding = false;
      this.topSpace = 0;
      this.parsing = false;
      this.scrolling = false;
      this.owner = owner;
      this.workerPath = workerPath;
      var s = (this.previewEl = i.createDiv("markdown-preview-view markdown-rendered")),
        l = (this.sizerEl = s.createDiv("markdown-preview-sizer markdown-preview-section")),
        c = (this.pusherEl = createDiv("markdown-preview-pusher"));
      c.style.width = "1px";
      c.style.height = "0.1px";
      e.registerDomEvents(l, n, this.handleDetached.bind(this));
      l.on("click", "a.footnote-link", this.onFootnoteLinkClick.bind(this));
      l.on("click", ".task-list-item-checkbox", this.onCheckboxClick.bind(this));
      l.on("click", ".heading-collapse-indicator", this.onHeadingCollapseClick.bind(this));
      l.on("click", "li > .list-collapse-indicator", this.onListCollapseClick.bind(this));
      s.addEventListener("scroll", this.onScroll.bind(this), {
        passive: true,
      });
      o &&
        s.onNodeInserted(function () {
          return a.queueRender();
        });
      mc(function () {
        return a.onResize();
      });
    }
    e.prototype.set = function (texte0) {
      this.text = texte0;
      this.queueRender();
    };
    e.prototype.rerender = function (e) {
      if (((this.lastText = null), e))
        for (var t = this.header, n = this.footer, i = 0, r = this.sections; i < r.length; i++) {
          var o = r[i];
          if (o !== t && o !== n) {
            o.rendered = false;
            o.el.empty();
          }
        }
      this.queueRender();
    };
    e.prototype.clear = function () {
      this.sections = [];
      this.asyncSections = [];
      this.recycledSections = [];
      this.rendered = [];
      this.sizerEl.empty();
      this.text = "";
      this.lastText = null;
      this.lastScroll = 0;
      this.previewEl.scrollTop = 0;
      this.renderedWidth = 0;
      this.owner.onRenderComplete();
      this.cleanupParentComponents();
      this.queueRender();
    };
    e.prototype.belongsToMe = function (t) {
      return e.belongsToMe(t, this.previewEl, this.handleDetached.bind(this));
    };
    e.prototype.handleDetached = function (e) {
      return this.sections.some(function (t) {
        return t.el === e;
      });
    };
    e.prototype.getSectionForElement = function (e) {
      for (var t = 0, n = this.sections; t < n.length; t++) {
        var i = n[t];
        if (i.el.contains(e)) return i;
      }
      return null;
    };
    e.prototype.getSectionInfo = function (e) {
      if (!this.belongsToMe(e)) return null;
      var t = this.getSectionForElement(e);
      return t
        ? {
            text: this.lastText || "",
            lineStart: t.start.line,
            lineEnd: t.end.line,
          }
        : null;
    };
    e.prototype.getInternalLinkHref = function (e) {
      var t = e.getAttr("data-href") || e.getAttr("href");
      return t && this.belongsToMe(e) ? t : null;
    };
    e.prototype.onFootnoteLinkClick = function (e, t) {
      if (e.button === 0 && this.belongsToMe(t)) {
        e.preventDefault();
        var n = t.getAttr("href");
        if (n && n.startsWith("#")) {
          for (
            var i = "[data-footnote-id=" + (n = n.substr(1)) + "]", r = null, o = null, a = 0, s = this.sections;
            a < s.length;
            a++
          ) {
            var l = s[a];
            if ((o = l.el.find(i))) {
              r = l;
              break;
            }
          }
          if (!o || !r) return;
          this.showSection(r);
          this.applyScrollSection(r);
          this.highlightEl(o);
          this.updateVirtualDisplay();
          o.scrollIntoView({
            block: "center",
          });
          this.owner.onScroll();
        }
      }
    };
    e.prototype.onCheckboxClick = function (e, t) {
      if (this.belongsToMe(t)) {
        var n = parseInt(t.getAttribute("data-line"));
        if (!(n < 0 || isNaN(n))) {
          var i = this.getSectionContainer(t);
          if (i) {
            var r = i.start.line + n;
            this.owner.onCheckboxClick(e, t, r);
          }
        }
      }
    };
    e.prototype.onHeadingCollapseClick = function (e, t) {
      if (e.button === 0 && !e.defaultPrevented) {
        var n = t.parentNode;
        if (n && n.instanceOf(HTMLHeadingElement) && this.belongsToMe(n)) {
          var i = this.getSectionContainer(n);
          if (i) {
            e.preventDefault();
            i.setCollapsed(!i.headingCollapsed);
            this.previewEl.win.getSelection().removeAllRanges();
            this.queueRender();
            this.owner.onFoldChange();
          }
        }
      }
    };
    e.prototype.setListCollapse = function (e, t) {
      if (e.findAll("ul, ol")) {
        CO(e, t);
        var n = this.getSectionContainer(e);
        if (n) {
          n.resetCompute();
        }
      }
    };
    e.prototype.onListCollapseClick = function (e, t) {
      if (e.button === 0 && !e.defaultPrevented) {
        var n = t.parentNode;
        if (n && n.instanceOf(HTMLLIElement) && this.belongsToMe(n)) {
          e.preventDefault();
          this.setListCollapse(n, !n.hasClass("is-collapsed"));
          this.queueRender();
          this.owner.onFoldChange();
        }
      }
    };
    e.prototype.queueRender = function () {
      if (!this.rendered) {
        this.rendered = [];
      }
      var e = this.queued,
        t = !this.parsing;
      if (e) {
        if (t && !e.high) {
          e.cancel();
          this.queued = Sc(this.onRender.bind(this), 0);
        }
      } else {
        var n = t ? 0 : 200;
        this.queued = Sc(this.onRender.bind(this), n);
      }
    };
    e.prototype.parseAsync = function () {
      var e = this;
      if (!this.parsing) {
        this.parsing = true;
        __awaiter(e, undefined, Promise, function () {
          var e, parseSections, n, i, scrollTop, o;
          return __generator(this, function (a) {
            switch (a.label) {
              case 0:
                a.trys.push([0, 6, , 7]);
                return ZN ? [3, 2] : [4, _N(this.workerPath)];
              case 1:
                e = a.sent();
                ZN = new WN(e);
                a.label = 2;
              case 2:
                return ZN.promise ? [4, ZN.promise.promise] : [3, 4];
              case 3:
                a.sent();
                return [3, 2];
              case 4:
                parseSections = this.text;
                return [
                  4,
                  ZN.submit({
                    parseSections: parseSections,
                    options: remarkParser.globalOptions,
                  }),
                ];
              case 5:
                n = a.sent();
                i = this.previewEl;
                scrollTop = i.scrollTop;
                this.parseFinish(parseSections, n);
                i.scrollTop = scrollTop;
                this.onRender();
                this.parsing = false;
                return [3, 7];
              case 6:
                o = a.sent();
                this.parsing = false;
                console.error(o);
                this.parseSync();
                this.queueRender();
                return [3, 7];
              case 7:
                return [2];
            }
          });
        });
      }
    };
    e.prototype.parseSync = function () {
      var e = this.text,
        t = fN(e);
      this.parseFinish(e, t);
    };
    e.prototype.parseFinish = function (lastText, t) {
      for (
        var n = t.sections,
          frontmatter = t.frontmatter,
          r = this,
          o = r.recycledSections,
          a = r.header,
          s = r.footer,
          l = this.sections,
          c = new tc(),
          u = 0,
          h = l;
        u < h.length;
        u++
      ) {
        var p = h[u];
        if (p !== a && p !== s) {
          p.used = false;
          c.add(p.html, p);
        }
      }
      for (var sections = [], f = 0; f < n.length; f++) {
        var m = n[f],
          g = m.html,
          level = m.level,
          y = m.pos,
          start = y.start,
          end = y.end,
          k = null,
          C = c.get(g);
        if (C && C.length > 0)
          for (var E = 0, S = C; E < S.length; E++) {
            var M = S[E];
            if (!M.used) {
              M.used = true;
              k = M;
              break;
            }
          }
        if (!k) {
          k = new MarkdownPreviewSection(g);
        }
        var x = f === 0 ? 0 : start.line,
          T = f === n.length - 1 ? end.line + 1 : n[f + 1].pos.start.line;
        k.lines = T - x;
        k.start = start;
        k.end = end;
        k.level = level;
        sections.push(k);
      }
      var D = JSON.stringify(this.frontmatter) === JSON.stringify(frontmatter);
      if (((this.frontmatter = frontmatter), D))
        for (var A = 0, P = sections; A < P.length; A++) {
          if ((k = P[A]).usesFrontMatter) {
            k.rendered = false;
            k.el.empty();
          }
        }
      var L = this.cssClasses,
        I = this.previewEl;
      if (L) {
        I.removeClasses(L);
        this.cssClasses = null;
      }
      var cssClasses = getCssClasses(frontmatter);
      cssClasses && cssClasses.length > 0 && ((this.cssClasses = cssClasses), I.addClasses(cssClasses));
      a && sections.unshift(a);
      s && sections.push(s);
      this.sections = sections;
      var F = this.asyncSections;
      this.asyncSections = [];
      for (var N = 0, R = F; N < R.length; N++) {
        k = R[N];
        if (sections.contains(k)) {
          this.asyncSections.push(k);
        }
      }
      for (var B = 0, V = l; B < V.length; B++) {
        if ((k = V[B]).rendered && !k.used) {
          o.push(k);
        }
      }
      this.lastText = lastText;
      this.lastRender = Date.now();
    };
    e.prototype.onRender = function () {
      var t = this;
      this.queued = null;
      var n = this.previewEl;
      if (!!n.offsetParent && n.offsetWidth > 0) {
        var i = n.scrollTop;
        if (this.lastText !== this.text) {
          !XN.asyncParse || this.text.length < 10240 ? this.parseSync() : this.parseAsync();
        }
        for (
          var r = this,
            o = r.sections,
            a = r.sizerEl,
            s = r.pusherEl,
            l = 0,
            c = performance.now(),
            u = false,
            h = function (n) {
              if (n.rendered) return "continue";
              l++;
              var i = n.el;
              n.render();
              for (var r = 0, o = e.recyclers; r < o.length; r++) {
                (0, o[r])(i, p.recycledSections);
              }
              if (
                (KN(i, function (e) {
                  setIcon(
                    e.createSpan({
                      cls: "heading-collapse-indicator collapse-indicator collapse-icon",
                      prepend: true,
                    }),
                    "right-triangle",
                  );
                }),
                YN(i, function (e) {
                  setIcon(
                    e.createSpan({
                      cls: "list-collapse-indicator collapse-indicator collapse-icon",
                      prepend: true,
                    }),
                    "right-triangle",
                  );
                }),
                XN.listBullet)
              )
                for (var a = 0, s = i.findAll("ul > li"); a < s.length; a++) {
                  var h = s[a];
                  h.parentElement.addClass("has-list-bullet");
                  h.createSpan({
                    cls: "list-bullet",
                    prepend: !0,
                  });
                }
              var d = [];
              if (
                (p.owner.postProcess(n, d, p.frontmatter),
                d.length > 0 &&
                  (p.asyncSections.push(n),
                  Promise.all(d).then(function () {
                    t.asyncSections.remove(n);
                    n.resetCompute();
                    t.queueRender();
                  })),
                l % 10 == 0) &&
                performance.now() - c > 5
              ) {
                u = true;
                return "break";
              }
            },
            p = this,
            d = 0,
            f = o;
          d < f.length;
          d++
        ) {
          if (h((M = f[d])) === "break") break;
        }
        for (var m = [], g = false, v = [s], y = 0, b = 0, w = o; b < w.length; b++) {
          var k = (M = w[b]).el,
            C = k.parentElement === a;
          if (
            (!M.computed && M.rendered ? ((C = true), m.push(M), (g = true), y++) : g && ((C = true), (g = false)),
            C && v.push(k),
            y > 100)
          ) {
            u = true;
            break;
          }
        }
        a.setChildrenInPlace(v);
        for (var E = 0, S = m; E < S.length; E++) {
          var M = S[E];
          this.measureSection(M);
        }
        if (((this.topSpace = s.offsetTop), this.updateShownSections(), this.updateVirtualDisplay(i), u))
          this.queueRender();
        else if (this.lastText === this.text) {
          if (((this.recycledSections = []), this.asyncSections.length > 0)) return;
          if (this.rendered)
            for (var x = 0, T = this.rendered; x < T.length; x++) {
              (0, T[x])();
            }
          this.rendered = null;
          this.owner.onRenderComplete();
          this.cleanupParentComponents();
        }
      }
    };
    e.prototype.updateShownSections = function () {
      for (var e = 7, t = 0, n = this.sections; t < n.length; t++) {
        var i = n[t];
        i.level > e ? (i.shown = false) : ((i.shown = true), (e = 7), i.headingCollapsed && (e = i.level));
      }
    };
    e.prototype.updateVirtualDisplay = function (e) {
      var t = this,
        n = t.previewEl,
        i = t.sizerEl,
        r = t.pusherEl,
        o = t.sections,
        scrollTop = n.scrollTop;
      if ((typeof e == "number" && (scrollTop = e), !XN.progressiveRender)) {
        var s = [];
        s.push(r);
        for (var l = 0, c = o; l < c.length; l++) {
          var u = c[l];
          s.push(u.el);
        }
        i.setChildrenInPlace(s);
        i.style.minHeight = "";
        r.style.marginBottom = "0";
        return void (n.scrollTop = scrollTop);
      }
      this.lastScroll = scrollTop;
      for (
        var h = n.clientHeight,
          p = scrollTop + h,
          d = Math.min(scrollTop, n.scrollHeight - h),
          f = Math.max(h * this.renderExtra, this.renderExtraMinPx),
          m = d - f,
          g = p + f,
          v = 0,
          y = 0,
          b = 0;
        b < o.length;
        b++
      ) {
        if ((O = (u = o[b]).height) > 0) {
          v += O;
          y++;
        }
      }
      var w = 0;
      if (y > 0) {
        w = v / y;
      }
      var k = 0,
        C = this.topSpace,
        E = [];
      E.push(r);
      var S = -1,
        M = -1,
        x = -1,
        T = -1,
        D = null,
        A = null,
        P = window.getSelection();
      if (P.rangeCount > 0) {
        var L = P.getRangeAt(0);
        if (!L.collapsed && n.contains(L.startContainer) && n.contains(L.endContainer)) {
          D = L.startContainer;
          A = L.endContainer;
          (D === r || (D === i && L.startOffset <= 1)) && (x = 0);
          A === i && L.endOffset > 1 && (T = o.length - 1);
        }
      }
      for (b = 0; b < o.length; b++) {
        var I = (u = o[b]).el;
        if ((D && (I === D || I.contains(D)) && (x = b), A && (I === A || I.contains(A)) && (T = b), u.shown)) {
          var O = u.height;
          if (u.computed) {
            (R = C + O) >= m && C <= g && (-1 === S && (S = b), (M = b));
            C = R;
          } else {
            C += O;
            O === 0 && (C += w);
          }
        }
      }
      var F = S,
        N = M;
      -1 !== x && -1 !== T && ((F = Math.min(F, x)), (N = Math.max(N, T)));
      F < 0 && (F = 0);
      ++N > o.length - 1 && (N = o.length - 1);
      C = this.topSpace;
      for (b = 0; b < o.length; b++) {
        I = (u = o[b]).el;
        u.shown && F <= b && b <= N ? E.push(I) : I.parentNode === i && I.detach();
        var R;
        O = u.height;
        u.computed || O !== 0 || (O = w);
        u.shown || (O = 0);
        b === F && (k = C);
        C = R = C + O;
      }
      k > 0 && (k -= this.topSpace) < 0 && (k = 0);
      C -= this.topSpace;
      C = Math.max(0, C);
      r.style.marginBottom = k + "px";
      i.style.minHeight = C - 1 + "px";
      i.setChildrenInPlace(E);
      N !== o.length - 1 && N--;
      for (b = F; b <= N; b++) {
        if ((u = o[b]).shown) {
          this.measureSection(u);
        }
      }
      n.scrollTop !== scrollTop && (n.scrollTop = scrollTop);
      this.renderHighlights(S, M);
    };
    e.prototype.renderHighlights = function (e, t) {
      var n = this.sections,
        i = this.sizerEl,
        r = i.offsetParent;
      if (r) {
        var o = r.getBoundingClientRect(),
          a = 1;
        if (r.instanceOf(HTMLElement)) {
          a = r.offsetWidth / Math.round(o.width);
        }
        for (var s = [], l = e; l <= t; l++)
          if (!(l < 0 || l >= n.length)) {
            var c = n[l];
            if (c.shown) {
              var u = c.highlightRanges;
              if (u && u.length !== 0) {
                var h = [];
                collectTextNodes(c.el, h);
                for (
                  var p = h.map(function (e) {
                      return e.textContent;
                    }),
                    d = 0,
                    f = u;
                  d < f.length;
                  d++
                ) {
                  var m = f[d],
                    g = m.rects;
                  if (!g) {
                    g = m.rects = [];
                    var v = createRangeFromCharOffsets(h, p, m.start, m.end);
                    if (!v) continue;
                    for (var y = v.getClientRects(), b = 0; b < y.length; b++) {
                      var w = y[b];
                      g.push({
                        x: (w.x - o.x + r.scrollLeft) * a,
                        y: (w.y - o.y + r.scrollTop) * a,
                        width: w.width * a,
                        height: w.height * a,
                      });
                    }
                  }
                  for (var k = 0, C = g; k < C.length; k++) {
                    var E = C[k],
                      S = createDiv();
                    m.active && S.addClass("is-active");
                    S.style.left = E.x + "px";
                    S.style.top = E.y + "px";
                    S.style.width = E.width + "px";
                    S.style.height = E.height + "px";
                    s.push(S);
                  }
                }
              }
            }
          }
        if (s.length > 0) {
          var M = createDiv("search-highlight");
          M.setChildrenInPlace(s);
          i.appendChild(M);
        }
      }
    };
    e.prototype.measureSection = function (e) {
      if (e.rendered) {
        var t = e.el,
          n = t.nextSibling,
          i = t.offsetTop,
          r = n ? n.offsetTop : t.offsetTop + t.offsetHeight;
        e.height = r - i;
        e.computed = true;
      }
    };
    e.prototype.onRendered = function (e) {
      this.rendered ? this.rendered.push(e) : e();
    };
    e.prototype.onResize = function () {
      var e = this,
        t = e.sections,
        n = e.previewEl,
        i = e.sizerEl,
        r = (this.viewportHeight = n.clientHeight),
        renderedWidth = n.offsetWidth;
      if (
        ((i.style.paddingBottom = this.addBottomPadding ? Math.round(r / 2) + "px" : "0"),
        renderedWidth !== this.renderedWidth)
      ) {
        this.renderedWidth = renderedWidth;
        for (var a = 0, s = t; a < s.length; a++) {
          s[a].resetCompute();
        }
        this.queueRender();
      } else this.updateVirtualDisplay();
    };
    e.prototype.foldAllHeadings = function () {
      for (
        var e = function (e) {
            KN(e.el, function () {
              e.setCollapsed(!0);
            });
          },
          t = 0,
          n = this.sections;
        t < n.length;
        t++
      ) {
        e(n[t]);
      }
      this.updateShownSections();
      this.updateVirtualDisplay();
      this.owner.onFoldChange();
    };
    e.prototype.unfoldAllHeadings = function () {
      for (var e = 0, t = this.sections; e < t.length; e++) {
        var n = t[e];
        n.setCollapsed(!1);
        n.shown = true;
      }
      this.updateVirtualDisplay();
      this.owner.onFoldChange();
    };
    e.prototype.foldAllLists = function () {
      for (var e = this, t = 0, n = this.sections; t < n.length; t++) {
        YN(n[t].el, function (t) {
          e.setListCollapse(t, !0);
        });
      }
      this.queueRender();
      this.owner.onFoldChange();
    };
    e.prototype.unfoldAllLists = function () {
      for (var e = this, t = 0, n = this.sections; t < n.length; t++) {
        YN(n[t].el, function (t) {
          e.setListCollapse(t, !1);
        });
      }
      this.queueRender();
      this.owner.onFoldChange();
    };
    e.prototype.getFoldInfo = function () {
      var e = this,
        folds = [];
      if (this.frontmatter)
        for (var n = 0, i = this.sections; n < i.length; n++) {
          var r = (h = i[n]).el.find(".metadata-container");
          if (r) {
            if (r.hasClass("is-collapsed")) {
              folds.push({
                from: h.start.line,
                to: h.start.line + h.lines,
              });
            }
            break;
          }
        }
      for (
        var o = function (n) {
            var i = a.sections[n];
            KN(i.el, function () {
              if (i.headingCollapsed) {
                var r = i.start.line + i.lines;
                n < e.sections.length - 1 && (r = e.sections[n + 1].start.line - 1);
                folds.push({
                  from: i.start.line,
                  to: r,
                });
              }
            });
          },
          a = this,
          s = 0;
        s < this.sections.length;
        s++
      )
        o(s);
      for (
        var l = function (e) {
            YN(e.el, function (n) {
              if (n.hasClass("is-collapsed")) {
                var i = parseInt(n.getAttribute("data-line"));
                if (i < 0 || isNaN(i)) return;
                var r = n.nextElementSibling;
                if (!r) {
                  var o = e.start.line + e.lines - 1;
                  return void folds.push({
                    from: e.start.line + i,
                    to: o,
                  });
                }
                var a = parseInt(r.getAttribute("data-line"));
                if (a < i || isNaN(a)) return;
                folds.push({
                  from: e.start.line + i,
                  to: a - 1,
                });
              }
            });
          },
          c = 0,
          u = this.sections;
        c < u.length;
        c++
      ) {
        var h;
        l((h = u[c]));
      }
      return {
        folds: folds,
        lines: this.text.match(/^/gm).length,
      };
    };
    e.prototype.applyFoldInfo = function (e) {
      var t = this;
      if (!(e && e.lines !== this.text.match(/^/gm).length)) {
        this.onRendered(function () {
          var n = new Set();
          if (e)
            for (var i = 0, r = e.folds; i < r.length; i++) {
              var o = r[i];
              n.add(o.from);
            }
          for (
            var a = function (e) {
                KN(e.el, function () {
                  e.setCollapsed(n.has(e.start.line));
                });
              },
              s = 0,
              l = t.sections;
            s < l.length;
            s++
          ) {
            a(l[s]);
          }
          for (
            var c = function (e) {
                YN(e.el, function (t) {
                  var i = parseInt(t.getAttribute("data-line"));
                  if (!(i < 0 || isNaN(i))) {
                    var r = e.start.line + i,
                      o = n.has(r);
                    t.hasClass("is-collapsed") !== o && (CO(t, o), e.resetCompute());
                  }
                });
              },
              u = 0,
              h = t.sections;
            u < h.length;
            u++
          ) {
            c(h[u]);
          }
          t.queueRender();
        });
      }
    };
    e.prototype.onScroll = function () {
      var e = this,
        t = e.previewEl,
        n = e.lastScroll,
        i = e.viewportHeight,
        r = t.scrollTop;
      Math.abs(n - r) > Math.max(i * this.renderExtra, this.renderExtraMinPx) / 2 && this.updateVirtualDisplay(r);
      this.scrolling ? (this.scrolling = false) : this.owner.onScroll();
    };
    e.prototype.getScroll = function () {
      var e = this,
        t = this.previewEl,
        n = this.sections;
      if (n.length === 0) return null;
      for (var i = t.scrollTop, r = 0, o = this.topSpace, a = 0; a < n.length; a++) {
        var s = n[a];
        if (!s.computed) return null;
        if (!(i > o + s.height || (r === 0 && s.lines === 0))) {
          var l = s.height;
          if (r === 0) {
            l += o;
            o = 0;
          }
          var c = r,
            u = i - o,
            h = 0;
          if (s.lines > 0) {
            var p = l / s.lines,
              d = Math.floor(u / p);
            c += d;
            h = u / p - d;
          }
          for (
            var f = function (t) {
                return getRelativeOffset(t, e.previewEl).top;
              },
              m = f(s.el),
              g = undefined,
              v = 0,
              y = 0,
              b = l / s.lines,
              w = 0,
              k = s.el.findAll("li");
            w < k.length;
            w++
          ) {
            var C = k[w];
            if (this.belongsToMe(C)) {
              var E = parseInt(C.getAttribute("data-line"));
              if (!(E < 0 || isNaN(E)) && C.isShown()) {
                if (!(f(C) - m < u)) {
                  if ((y = E - v) > 0) {
                    var S = g ? f(g) : m;
                    b = (f(C) - S) / y;
                  }
                  break;
                }
                v = E;
                g = C;
                b = 0;
              }
            }
          }
          if (g) {
            b === 0 && (b = (s.el.offsetTop + s.height - f(g)) / (s.lines - v));
            c = r + v;
            h = (u - (f(g) - m)) / b;
          }
          return c + h;
        }
        r += s.lines;
        s.shown && (o += s.height);
      }
      return r;
    };
    e.prototype.applyScroll = function (e, t) {
      var n = this;
      if (!Number.isNumber(e) || isNaN(e)) return !1;
      if (this.text !== this.lastText) return !1;
      var i = Math.floor(e),
        r = e - i;
      this.scrolling = true;
      for (
        var o = this.sections, a = t || {}, s = a.highlight, l = a.center, c = 0, u = this.topSpace, h = 0;
        h < o.length;
        h++
      ) {
        var p = o[h];
        if (!p.computed) return !1;
        if (!(c + p.lines <= i)) {
          if (!p.shown && s && (this.showSection(p), p.shown)) return this.applyScroll(e, t);
          var d = p.height;
          if (c === 0) {
            d += u;
            u = 0;
          }
          var f = d / p.lines,
            m = i - c,
            g = 0;
          if (l) {
            g -= (this.previewEl.clientHeight - f) / 2;
          }
          var scrollTop = Math.max(0, u + f * (m + r) + g);
          this.updateVirtualDisplay(scrollTop);
          for (
            var y = null,
              b = function (e) {
                return getRelativeOffset(e, n.previewEl).top;
              },
              w = 0,
              k = 0,
              C = p.el.findAll("li");
            k < C.length;
            k++
          ) {
            var E = C[k];
            if (this.belongsToMe(E)) {
              var S = parseInt(E.getAttribute("data-line"));
              if (!(S < 0 || isNaN(S)) && E.isShown()) {
                if (!(S <= m)) {
                  var M = S - w;
                  if (M > 0) {
                    var x = y ? b(y) : p.el.offsetTop;
                    f = (b(E) - x) / M;
                  }
                  break;
                }
                w = S;
                y = E;
                f = 0;
              }
            }
          }
          if (y) {
            if (f === 0) {
              f = (p.el.offsetTop + p.height - b(y)) / (p.lines - w);
            }
            var T = b(y) - p.el.offsetTop;
            scrollTop = Math.max(0, u + T + f * (m - w + r) + g);
            this.previewEl.scrollTop = scrollTop;
          }
          s && this.highlightEl(y || p.el);
          return !0;
        }
        c += p.lines;
        p.shown && (u += p.height);
      }
      return !0;
    };
    e.prototype.getSectionTop = function (e) {
      for (var t = this.sections, n = 0, i = 0; i < t.length; i++) {
        var r = t[i];
        if (r === e) return n;
        var o = r.height;
        !r.computed && o === 0 && i > 0 && (o = n / i);
        r.shown || (o = 0);
        n += o;
      }
      return -1;
    };
    e.prototype.showSection = function (e) {
      if (!e.shown) {
        var t = this.sections,
          n = t.indexOf(e);
        if (-1 !== n) {
          for (var i = e.level; n >= 0; ) {
            var r = t[n];
            r.headingCollapsed && r.level < i && (r.setCollapsed(!1), (i = r.level));
            n--;
          }
          this.updateShownSections();
          this.updateVirtualDisplay();
        }
      }
    };
    e.prototype.applyScrollSection = function (e) {
      var t = this.previewEl,
        scrollTop = this.getSectionTop(e);
      if (-1 !== scrollTop) {
        this.scrolling = true;
        t.scrollTop = scrollTop;
        return !0;
      }
    };
    e.prototype.applyScrollDelayed = function (e, t, n) {
      var i = this;
      this.applyScroll(e, t)
        ? n && n()
        : this.onRendered(function () {
            i.applyScroll(e, t);
            n && n();
          });
    };
    e.prototype.highlightEl = function (e) {
      for (var t = 0, n = this.sections; t < n.length; t++)
        for (var i = 0, r = n[t].el.findAllSelf(".is-flashing"); i < r.length; i++) {
          r[i].removeClass("is-flashing");
        }
      e.addClass("is-flashing");
      setTimeout(function () {
        e.removeClass("is-flashing");
      }, 3e3);
    };
    e.prototype.getSectionContainer = function (e) {
      for (var t = null, n = 0, i = this.sections; n < i.length; n++) {
        var r = i[n];
        if (r.el.contains(e)) {
          t = r;
          break;
        }
      }
      return t;
    };
    e.prototype.selectRange = function (e) {
      var t = this.sizerEl,
        n = this.previewEl,
        i = e.section,
        r = e.start,
        o = e.end;
      this.showSection(i);
      var scrollTop = this.getSectionTop(i);
      if (!t.contains(i.el)) {
        n.scrollTop = scrollTop;
        this.updateVirtualDisplay();
      }
      var s = createTextRange(i.el, r, o);
      if (s) {
        var l = (function (e) {
          for (; e; ) {
            if (e.instanceOf(HTMLElement)) return e;
            e = e.parentNode;
          }
          return null;
        })(s.startContainer);
        if (l) {
          var c = n.scrollTop + 40,
            u = c + n.clientHeight - 40;
          if (l.offsetTop < c || l.offsetTop + l.offsetHeight > u) {
            l.scrollIntoView({
              behavior: "auto",
              block: "center",
              inline: "nearest",
            });
          }
        }
        this.updateVirtualDisplay();
      }
    };
    e.prototype.addHeader = function () {
      if (!this.header) {
        this.header = new MarkdownPreviewSection(null);
        this.header.el.addClass("mod-header", "mod-ui");
        this.sections.unshift(this.header);
        this.queueRender();
      }
    };
    e.prototype.removeHeader = function () {
      if (this.header) {
        this.sections.remove(this.header);
        this.header = null;
        this.queueRender();
      }
    };
    e.prototype.addFooter = function () {
      if (!this.footer) {
        this.footer = new MarkdownPreviewSection(null);
        this.footer.el.addClass("mod-footer", "mod-ui");
        this.sections.push(this.footer);
        this.queueRender();
      }
    };
    e.prototype.removeFooter = function () {
      if (this.footer) {
        this.sections.remove(this.footer);
        this.footer = null;
        this.queueRender();
      }
    };
    e.prototype.updateHeader = function () {
      var e = this.header;
      if (e) {
        e.resetCompute();
        this.queueRender();
      }
    };
    e.prototype.updateFooter = function () {
      var e = this.footer;
      if (e) {
        e.resetCompute();
        this.queueRender();
      }
    };
    e.prototype.cleanupParentComponents = function () {
      for (var e = [], t = 0, n = this.owner._children; t < n.length; t++) {
        if ((o = n[t]) instanceof MarkdownRenderChild) {
          this.belongsToMe(o.containerEl) || e.push(o);
        }
      }
      for (var i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        this.owner.removeChild(o);
      }
    };
    e.registerPostProcessor = function (e, sortOrder) {
      e.sortOrder = sortOrder;
      var n = this.postProcessors;
      n.push(e);
      n.sort(function (e, t) {
        return (e.sortOrder || 0) - (t.sortOrder || 0);
      });
    };
    e.unregisterPostProcessor = function (e) {
      this.postProcessors.remove(e);
    };
    e.registerRecycler = function (e) {
      this.recyclers.push(e);
    };
    e.unregisterRecycler = function (e) {
      this.recyclers.remove(e);
    };
    e.registerCodeBlockPostProcessor = function (e, t) {
      var n = this.codeBlockPostProcessors;
      if (n.hasOwnProperty(e))
        throw new Error("Code block postprocessor for language ".concat(e, " is already registered"));
      n[e] = t;
    };
    e.unregisterCodeBlockPostProcessor = function (e) {
      delete this.codeBlockPostProcessors[e];
    };
    e.createCodeBlockPostProcessor = function (e, t) {
      return function (n, i) {
        var r = n.findAll("code.language-" + e);
        if (r.length !== 0)
          for (
            var o = function (n) {
                var r = nR(n),
                  o = n.parentElement,
                  a = createDiv("block-language-" + e);
                o.replaceWith(a);
                var s = i;
                s.replaceCode = function (e) {
                  var t = i.getSectionInfo(a);
                  if (t) {
                    var o = t.text.substring(
                        getLineBoundaries(t.text, t.lineStart).start,
                        getLineBoundaries(t.text, t.lineEnd).end,
                      ),
                      s = parseInt(n.dataset.line, 10);
                    if (isNaN(s)) {
                      s = 0;
                    }
                    var l = getLineBoundaries(o, s + 1).start,
                      c = l + r.length;
                    if (o.substring(l, c) === r) {
                      i.replace(o.substring(0, l) + e + o.substring(c), !0);
                      tR.set(n, e);
                      r = e;
                    }
                  }
                };
                var l = t(r, a, s);
                if (l) {
                  i.promises.push(l);
                }
              },
              a = 0,
              s = r;
            a < s.length;
            a++
          ) {
            o(s[a]);
          }
      };
    };
    e.registerDomEvents = function (t, n, i) {
      function r(n) {
        var href = n.getAttr("data-href") || n.getAttr("href");
        return href && e.belongsToMe(n, t, i)
          ? {
              href: href,
              displayText: n.getText().trim(),
            }
          : null;
      }
      function o(e, t) {
        if (e.button === 0 || e.button === 1) {
          var i = r(t);
          if (i) {
            n.onInternalLinkClick(e, t, i.href, i.displayText);
          }
        }
      }
      function a(n, r) {
        if (!n.defaultPrevented) {
          e.belongsToMe(r, t, i) &&
            Platform.isMobile &&
            (n.preventDefault(),
            r.instanceOf(HTMLImageElement) &&
              (function (e) {
                var t = e.cloneNode(),
                  n = document.body.createDiv("mobile-image-viewer");
                n.appendChild(t);
                var i = t.width,
                  r = t.height,
                  o = t.naturalWidth,
                  a = t.naturalHeight,
                  s = 5,
                  l = 0,
                  c = 0,
                  u = 1,
                  h = function () {
                    var e = (u - 1) / u / 2,
                      n = Math.max(0, i * e),
                      o = Math.max(0, r * e);
                    l = Math.clamp(l, -n, n);
                    c = Math.clamp(c, -o, o);
                    u = Math.clamp(u, 1, s);
                    t.style.transform = "scale(".concat(u, ") translate(").concat(l, "px, ").concat(c, "px)");
                  },
                  p = 0,
                  d = 0,
                  f = 0,
                  m = 0,
                  g = function () {
                    cancelAnimationFrame(m);
                    var e = Date.now(),
                      t = e - f;
                    l += Math.cos(d) * p * t;
                    c += Math.sin(d) * p * t;
                    h();
                    (p -= Math.min(0.003 * t, p)) > 0.01 && ((f = e), (m = requestAnimationFrame(g)));
                  };
                t.addEventListener("load", function () {
                  i = t.width;
                  r = t.height;
                  o = t.naturalWidth;
                  a = t.naturalHeight;
                  (s = 2 * Math.max(o / i, a / r)) < 1 && (s = 1);
                  h();
                });
                var v = null,
                  y = null,
                  b = function (e) {
                    cancelAnimationFrame(m);
                    for (
                      var t = Date.now(),
                        n = t - f,
                        i = Array.prototype.slice.call(e.touches),
                        r = null,
                        o = null,
                        a = 0,
                        s = i;
                      a < s.length;
                      a++
                    ) {
                      var b = s[a];
                      v && b.identifier === v.identifier && (r = b);
                      y && b.identifier === y.identifier && (o = b);
                    }
                    if (
                      (o && !r && ((v = y), (r = o), (y = null), (o = null)),
                      r ? i.remove(r) : i.length > 0 && ((r = i.first()), i.splice(0, 1)),
                      o ? i.remove(o) : i.length > 0 && ((o = i.first()), i.splice(0, 1)),
                      v && r && v.identifier === r.identifier)
                    ) {
                      var w = window.innerWidth / 2,
                        k = window.innerHeight / 2;
                      if (y && o && y.identifier === o.identifier) {
                        var C = -l + ((v.clientX + y.clientX) / 2 - w) / u,
                          E = -c + ((v.clientY + y.clientY) / 2 - k) / u,
                          S = (r.clientX + o.clientX) / 2,
                          M = (r.clientY + o.clientY) / 2,
                          x = v.clientX - y.clientX,
                          T = v.clientY - y.clientY,
                          D = r.clientX - o.clientX,
                          A = r.clientY - o.clientY,
                          P = x * x + T * T,
                          L = D * D + A * A;
                        if (P !== 0 && L !== 0) {
                          var I = Math.sqrt(L / P),
                            O = u * I;
                          l = (S - w) / O - C;
                          c = (M - k) / O - E;
                          u = O;
                          h();
                        }
                      } else {
                        var F = (r.clientX - v.clientX) / u,
                          N = (r.clientY - v.clientY) / u;
                        l += F;
                        c += N;
                        p = Math.sqrt(F * F + N * N) / n;
                        d = Math.atan2(N, F);
                        h();
                      }
                    }
                    y = o;
                    (v = r) || y || (m = requestAnimationFrame(g));
                    f = t;
                  };
                n.addEventListener("touchstart", b);
                n.addEventListener("touchend", b);
                n.addEventListener("touchmove", b);
                n.addEventListener("touchcancel", b);
                n.addEventListener("click", function (e) {
                  n.remove();
                  e.preventDefault();
                  cancelAnimationFrame(m);
                });
              })(r));
        }
      }
      t.on("click", "a.internal-link", o);
      t.on("auxclick", "a.internal-link", o);
      t.on("dragstart", "a.internal-link", function (e, t) {
        var i = r(t);
        if (i) {
          n.onInternalLinkDrag(e, t, i.href, i.displayText);
        }
      });
      t.on("contextmenu", "a.internal-link", function (e, t) {
        var i = r(t);
        if (i) {
          n.onInternalLinkRightClick(e, t, i.href, i.displayText);
        }
      });
      t.on("mouseover", "a.internal-link", function (e, t) {
        var i = r(t);
        if (i) {
          n.onInternalLinkMouseover(e, t, i.href, i.displayText);
        }
      });
      t.on("mouseover", "a.footnote-link", function (r, o) {
        var a = o.dataset.footref;
        if (a && e.belongsToMe(o, t, i)) {
          n.onInternalLinkMouseover(r, o, "#[^".concat(a, "]"));
        }
      });
      t.on("click", "a.external-link", function (r, o) {
        if (r.button === 0 || r.button === 1) {
          var a = o.getAttr("href");
          if (a && e.belongsToMe(o, t, i)) {
            n.onExternalLinkClick(r, o, a);
          }
        }
      });
      t.on("contextmenu", "a.external-link", function (r, o) {
        var a = o.getAttr("href");
        if (a && e.belongsToMe(o, t, i)) {
          n.onExternalLinkRightClick(r, o, a);
        }
      });
      t.on("click", "a.tag", function (r, o) {
        if (r.button === 0 && e.belongsToMe(o, t, i)) {
          r.preventDefault();
          var a = o.getText();
          n.onTagClick(r, o, a);
        }
      });
      t.on("click", "img,video", a);
      t.on("contextmenu", "img,video", a);
    };
    e.belongsToMe = function (e, t, n) {
      for (; e; ) {
        if (e === t) return !0;
        if (e.classList.contains("markdown-preview-view")) return !1;
        var i = e.parentElement;
        if (!i) return !!n && n(e);
        e = i;
      }
      return !1;
    };
    e.postProcessors = [];
    e.codeBlockPostProcessors = {};
    e.recyclers = [];
    return e;
  })();
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  var n,
    i = e.find(".frontmatter");
  i == null || i.hide();
  (n = i == null ? undefined : i.parentElement) === null || undefined === n || n.addClass("mod-frontmatter", "mod-ui");
});
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  for (var n = 0, i = e.findAll("[data-footnote-id]"); n < i.length; n++) {
    var r = i[n],
      o = r.getAttr("data-footnote-id");
    r.setAttr("data-footnote-id", o + "-" + t.docId);
    r.id = o + "-" + t.docId;
  }
  for (var a = 0, s = e.findAll("a.footnote-link"); a < s.length; a++) {
    var l = s[a],
      c = l.getAttr("href");
    l.setAttr("href", c + "-" + t.docId);
  }
});
var $N = function (e, t) {
  return __awaiter(undefined, undefined, undefined, function () {
    var n,
      i,
      r,
      o,
      a,
      s,
      innerHTML,
      c,
      u,
      h,
      p,
      d,
      f,
      href,
      g,
      v,
      y,
      innerHTMLw0,
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
      O;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          n = nR(t);
          i = t.parentElement;
          r = t.doc;
          (o = i.clientWidth) === 0 && (o = e.clientWidth);
          o === 0 && (o = e.win.innerWidth);
          a = "m" + ic(16);
          s = r.body.createDiv("mermaid");
          b.label = 1;
        case 1:
          b.trys.push([1, 3, , 4]);
          s.style.width = o + "px";
          s.style.visibility = "hidden";
          s.style.position = "absolute";
          return [4, mermaid.render(a, n, s)];
        case 2:
          if (
            ((innerHTML = b.sent().svg),
            s.detach(),
            ((c = createDiv("mermaid")).innerHTML = innerHTML),
            i.replaceWith(c),
            tR.set(c, n),
            (u = c).instanceOf(Element))
          ) {
            for (
              h = u.findAll('[*|class*="internal-link"] > g.label foreignObject > div'), p = 0, d = h;
              p < d.length;
              p++
            ) {
              f = d[p];
              (href = f.textContent) &&
                (f.empty(),
                f.createEl("a", {
                  cls: "internal-link",
                  href: href,
                  text: href,
                }));
            }
            for (g = [u]; g.length > 0; ) {
              v = g.pop();
              g.push.apply(g, Array.from(v.childNodes));
              v.instanceOf(SVGAElement) && v.href && !v.href.baseVal && (v.href.baseVal = v.getAttr("href"));
            }
            if ((y = u.find("style"))) {
              for (innerHTMLw0 = y.innerHTML, k = innerHTMLw0, C = 0, E = u.findAll("marker"); C < E.length; C++)
                if (((S = E[C]), (M = S.id))) {
                  for (x = a + "-" + M, S.id = x, T = 0, D = ["marker-start", "marker-end"]; T < D.length; T++)
                    for (A = D[T], P = 0, L = u.findAll("[".concat(A, '="url(#').concat(M, ')"]')); P < L.length; P++)
                      (O = L[P]).setAttr(A, "url(#".concat(x, ")"));
                  innerHTMLw0 = innerHTMLw0.replace(new RegExp("#".concat(Jl(M), "(?!\\w|-)"), "g"), "#" + x);
                }
              if (innerHTMLw0 !== k) {
                y.innerHTML = innerHTMLw0;
              }
            }
          }
          return [3, 4];
        case 3:
          I = b.sent();
          (O = r.getElementById("d" + a)) && O.detach();
          s.detach();
          console.error(I);
          t.empty();
          t.appendText("Error parsing Mermaid diagram!\n\n".concat(I.str || I.message));
          return [3, 4];
        case 4:
          return [2];
      }
    });
  });
};
function JN(e, t) {
  var n = this;
  return wN.then(function () {
    return __awaiter(n, undefined, undefined, function () {
      var n, i, r, o, a;
      return __generator(this, function (s) {
        switch (s.label) {
          case 0:
            for (
              n = [],
                i = function (t) {
                  t.isShown() || e.isShown()
                    ? n.push($N(e, t))
                    : t.onNodeInserted(function () {
                        return $N(e, t);
                      }, !0);
                },
                r = 0,
                o = t;
              r < o.length;
              r++
            ) {
              a = o[r];
              i(a);
            }
            return n.length > 0 ? [4, Promise.all(n)] : [3, 2];
          case 1:
            s.sent();
            s.label = 2;
          case 2:
            return [2];
        }
      });
    });
  });
}
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  var n = e.findAll("code.language-mermaid");
  if (n.length !== 0) return JN(t.containerEl, n);
});
var eR = function (e, t) {
  for (var n = 0, i = e; n < i.length; n++)
    for (var r = 0, o = i[n].el.findAll(".mermaid"); r < o.length; r++) {
      var a = o[r];
      if (t === nR(a)) return a;
    }
  return null;
};
MarkdownPreviewRenderer.registerRecycler(function (e, t) {
  for (var n = 0, i = e.findAll("code.language-mermaid"); n < i.length; n++) {
    var r = i[n],
      o = nR(r),
      a = eR(t, o);
    if (a) {
      a.detach();
      r.parentElement.replaceWith(a);
    }
  }
});
var tR = qN();
function nR(e) {
  if (tR.has(e)) return tR.get(e);
  var t = e.getText();
  t.endsWith("\n") && (t = t.substring(0, t.length - 1));
  tR.set(e, t);
  return t;
}
MarkdownPreviewRenderer.registerPostProcessor(function (e) {
  for (
    var t = function (e) {
        var t = e.parentElement;
        if (!t) return "continue";
        if (t.findAll(".copy-code-button").length > 0) return "continue";
        var n = nR(e),
          i = t.createEl("button", {
            cls: "copy-code-button",
          });
        setIcon(i, "lucide-copy");
        i.onClickEvent(function (e) {
          return __awaiter(undefined, undefined, undefined, function () {
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  e.preventDefault();
                  return [4, navigator.clipboard.writeText(n)];
                case 1:
                  t.sent();
                  setIcon(i, "lucide-check");
                  i.setCssStyles({
                    color: "var(--text-success)",
                    display: "inline-flex",
                  });
                  window.setTimeout(function () {
                    setIcon(i, "lucide-copy");
                    i.setCssStyles({
                      color: "",
                      display: "",
                    });
                  }, 1e3);
                  return [2];
              }
            });
          });
        });
      },
      n = 0,
      i = e.findAll("pre > code");
    n < i.length;
    n++
  ) {
    t(i[n]);
  }
});
MarkdownPreviewRenderer.registerPostProcessor(function (e) {
  var t = e.findAll('code[class*="language-"]:not(.is-loaded)');
  if (t.length !== 0)
    return CN.then(function () {
      for (var e = 0, n = t; e < n.length; e++) {
        var i = n[e];
        nR(i);
        Prism.highlightElement(i);
        i.parentElement.removeAttribute("tabindex");
        i.addClass("is-loaded");
      }
    });
}, 100);
var iR = function (e) {
    return e.className
      .split(" ")
      .filter(function (e) {
        return e.startsWith("language-");
      })
      .first();
  },
  rR = function (e, t, n) {
    for (var i = 0, r = e; i < r.length; i++)
      for (var o = 0, a = r[i].el.findAll('code[class*="language-"].is-loaded'); o < a.length; o++) {
        var s = a[o];
        if (n === tR.get(s) && t === iR(s)) return s;
      }
    return null;
  };
MarkdownPreviewRenderer.registerRecycler(function (e, t) {
  for (var n = 0, i = e.findAll('code[class*="language-"]:not(.is-loaded)'); n < i.length; n++) {
    var r = i[n],
      o = nR(r),
      a = iR(r),
      s = rR(t, a, o);
    if (s) {
      s.detach();
      r.replaceWith(s);
    }
  }
});
var oR = qN();
MarkdownPreviewRenderer.registerPostProcessor(function (e) {
  var t = e.findAll(".math:not(.is-loaded)");
  if (t.length !== 0)
    return SN.then(function () {
      for (var e = 0, n = t; e < n.length; e++) {
        var i = n[e],
          r = Ql(i.innerHTML);
        i.empty();
        try {
          var o = renderMath(r, i.classList.contains("math-block"));
          i.appendChild(o);
        } catch (e) {
          i.appendText(r);
        }
        i.addClass("is-loaded");
        oR.set(i, r);
      }
      return finishRenderMath();
    });
});
var aR = function (e, t, n) {
  for (var i = 0, r = e; i < r.length; i++)
    for (var o = 0, a = r[i].el.findAll(".math.is-loaded"); o < a.length; o++) {
      var s = a[o];
      if (t === oR.get(s) && s.classList.contains("math-block") === n) return s;
    }
  return null;
};
function sR(e, t, n) {
  for (var i = 0, r = n; i < r.length; i++) {
    var o = r[i];
    if (e.getAttr(o) !== t.getAttr(o)) return !1;
  }
  return !0;
}
MarkdownPreviewRenderer.registerRecycler(function (e, t) {
  for (var n = 0, i = e.findAll(".math:not(.is-loaded)"); n < i.length; n++) {
    var r = i[n],
      o = Ql(r.innerHTML),
      a = aR(t, o, r.classList.contains("math-block"));
    if (a) {
      a.detach();
      r.replaceWith(a);
    }
  }
});
var lR = function (e, t) {
  for (var n = 0, i = e; n < i.length; n++)
    for (var r = 0, o = i[n].el.findAll(".internal-embed.is-loaded"); r < o.length; r++) {
      var a = o[r];
      if (sR(t, a, ["src", "width", "height", "alt"])) return a;
    }
  return null;
};
MarkdownPreviewRenderer.registerRecycler(function (e, t) {
  for (var n = 0, i = e.findAll(".internal-embed:not(.is-loaded)"); n < i.length; n++) {
    var r = i[n],
      o = lR(t, r);
    if (o) {
      o.detach();
      r.replaceWith(o);
    }
  }
});
MarkdownPreviewRenderer.registerPostProcessor(function (e) {
  var t = e.findAll("img");
  if (t.length !== 0) {
    for (
      var n = [],
        i = function (e) {
          var t = FN(e.src);
          if (t) {
            var i = NN(t);
            e.replaceWith(i);
            return "continue";
          }
          e.referrerPolicy = "no-referrer";
          e.complete ||
            n.push(
              new Promise(function (t) {
                e.addEventListener("load", t);
                e.addEventListener("error", t);
              }),
            );
        },
        r = 0,
        o = t;
      r < o.length;
      r++
    ) {
      i(o[r]);
    }
    return Promise.all(n);
  }
});
var cR = function (e, t, n) {
  for (var i = 0, r = e; i < r.length; i++)
    for (var o = 0, a = r[i].el.findAll("img"); o < a.length; o++) {
      var s = a[o];
      if (s.instanceOf(HTMLImageElement) && s.complete && t === s.src) {
        s.setAttr("width", n.getAttr("width"));
        s.setAttr("height", n.getAttr("height"));
        s.setAttr("alt", n.getAttr("alt"));
        return s;
      }
    }
  return null;
};
function uR(e, t) {
  if (t.startsWith("'") && t.endsWith("'")) t = t.substring(1, t.length - 1).replace(/\\'/g, "'");
  else if (t.startsWith('"'))
    try {
      var n = JSON.parse(t);
      if (String.isString(n)) {
        t = n;
      }
    } catch (e) {}
  if (t.startsWith("<svg")) {
    var i = sanitizeHTMLToDom(t).firstChild;
    if (i && i.instanceOf(SVGSVGElement)) {
      i.setAttrs({
        width: 16,
        height: 16,
        fill: "currentColor",
        stroke: "currentColor",
      });
      e.empty();
      e.appendChild(i);
    }
  } else setIcon(e, t);
}
MarkdownPreviewRenderer.registerRecycler(function (e, t) {
  for (var n = 0, i = e.findAll("img"); n < i.length; n++) {
    var r = i[n];
    if (r.instanceOf(HTMLImageElement)) {
      var o = r.src,
        a = cR(t, o, r);
      if (a) {
        a.detach();
        r.replaceWith(a);
      }
    }
  }
});
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  for (
    var n = function (e) {
        !(function (e) {
          var t = e.getAttr("data-callout-fold");
          if (t === "+" || t === "-") {
            e.addClass("is-collapsible");
            var n = e.find(".callout-title"),
              i = e.find(".callout-content");
            if (n && i && !n.find(".callout-fold")) {
              var r = false,
                o = function () {
                  return a(!r, !0);
                },
                a = function (t, n) {
                  r = t;
                  e.toggleClass("is-collapsed", r);
                  s.toggleClass("is-collapsed", r);
                  toggleElementVisibility(i, r, n);
                },
                s = n.createDiv("callout-fold");
              s.addEventListener("click", function (e) {
                if (e.button === 0) {
                  e.preventDefault();
                  o();
                }
              });
              setIcon(s, "lucide-chevron-down");
              n.addEventListener("click", function (e) {
                setTimeout(function () {
                  if (!(e.button !== 0 || e.defaultPrevented)) {
                    e.preventDefault();
                    o();
                  }
                }, 0);
              });
              t === "-" && a(!0, !1);
            }
          }
        })(e);
        var t = e.find(".callout-icon");
        if (!t || t.firstChild) return "continue";
        var n = e.getAttr("data-callout-icon");
        if ((n || (n = e.getCssPropertyValue("--callout-icon")), n)) {
          uR(t, n);
          return "continue";
        }
        var i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        i.setAttrs({
          width: 16,
          height: 16,
        });
        t.appendChild(i);
        e.isShown() ||
          e.onNodeInserted(function () {
            var n = e.getCssPropertyValue("--callout-icon");
            if (n) {
              uR(t, n);
            }
          }, !0);
      },
      i = 0,
      r = e.findAll(".callout");
    i < r.length;
    i++
  ) {
    n(r[i]);
  }
});
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  for (var n = 0, i = e.findAll("table"); n < i.length; n++) {
    var r = i[n],
      o = r.parentNode;
    if (o && o.instanceOf(HTMLElement) && r === o.firstChild && r === o.lastChild) {
      o.style.overflowX = "auto";
      for (var a = r.findAll("th, td"), s = 0, l = a.length; s < l; s++) {
        var c = a[s],
          dir = detectTextDirectionInNode(c);
        c.dir = dir;
        s === 0 && (o.dir = dir);
      }
    }
  }
});
MarkdownPreviewRenderer.registerPostProcessor(function (e, t) {
  for (var n = 0, i = e.findAll("h1, h2, h3, h4, h5, h6, blockquote, .callout-title"); n < i.length; n++) {
    (a = i[n]).dir = "auto";
  }
  for (var r = 0, o = e.findAll("li, p"); r < o.length; r++) {
    var a;
    if (!(a = o[r]).parentElement.dir) {
      a.dir = "auto";
    }
  }
});
var hR = (function (e) {
    function t(app, dom) {
      var i = e.call(this) || this;
      i.queue = null;
      i.app = app;
      i.dom = dom;
      return i;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this.app.vault;
      this.registerEvent(e.on("rename", this.onFileChanged, this));
      this.registerEvent(e.on("delete", this.onFileDeleted, this));
      this.registerEvent(this.app.metadataCache.on("changed", this.onFileChanged, this));
    };
    t.prototype.onunload = function () {
      this.stop();
    };
    t.prototype.stop = function () {
      var e = this.queue;
      if (e) {
        e.cancel();
        this.queue = null;
      }
    };
    t.prototype.start = function (e) {
      var t = this,
        n = this.app,
        i = this.dom,
        r = (this.queue = new sx({
          onStart: function () {
            var t;
            i.startLoader();
            (t = e == null ? undefined : e.onStart) === null || undefined === t || t.call(e);
          },
          onStop: function () {
            var t;
            i.stopLoader();
            (t = e == null ? undefined : e.onStop) === null || undefined === t || t.call(e);
          },
          onCancel: function () {
            var n;
            t.queue = null;
            (n = e == null ? undefined : e.onCancel) === null || undefined === n || n.call(e);
          },
        })),
        o = n.vault.getFiles(),
        a = i.sortOrder;
      a && o.sort(KF(a));
      r.addList(o);
      return r;
    };
    t.prototype.onFileChanged = function (e) {
      if (e instanceof TFile) {
        var t = this.queue;
        if (t) {
          t.add(e);
        }
      }
    };
    t.prototype.onFileDeleted = function (e) {
      if (e instanceof TFile) {
        var t = this.queue;
        t && t.remove(e);
        this.dom.removeResult(e);
      }
    };
    return t;
  })(Component),
  pR = {},
  dR = (function () {
    function e(info) {
      this.info = info;
    }
    e.prototype.onInternalLinkDrag = function (e, t, n, i) {
      var r = this.info.app;
      r.dragManager.onDragStart(e, r.dragManager.dragLink(e, n, this.info.path, i));
    };
    e.prototype.onInternalLinkClick = function (e, t, n) {
      e.preventDefault();
      this.info.app.workspace.openLinkText(n, this.info.path, Keymap.isModEvent(e));
    };
    e.prototype.onInternalLinkRightClick = function (e, t, n) {
      var i = Menu.forEvent(e);
      i.setParentElement(t);
      i.addSections(["title", "open", "action", "clipboard", "view", "info", "", "danger"]);
      i.addItem(function (e) {
        return e
          .setSection("clipboard")
          .setTitle(i18nProxy.interface.menu.copy())
          .setIcon("lucide-copy")
          .onClick(function () {
            vc(t.getText());
          });
      });
      this.info.app.workspace.handleLinkContextMenu(i, n, this.info.path);
    };
    e.prototype.onExternalLinkClick = function (e, t, href) {
      if ((e.preventDefault(), zc(href))) {
        var i = Keymap.isModEvent(e),
          r = typeof i == "boolean" ? "" : i;
        window.open(href, r);
      } else
        new Notice(
          i18nProxy.interface.msgFailedToOpenHref({
            href: href,
          }),
        );
    };
    e.prototype.onExternalLinkRightClick = function (e, t, n) {
      var i = Menu.forEvent(e);
      i.addSections(["title", "open", "selection", "clipboard", "info", "action", "view", "", "danger"]);
      i.addItem(function (e) {
        return e
          .setSection("clipboard")
          .setTitle(i18nProxy.interface.menu.copy())
          .setIcon("lucide-copy")
          .onClick(function () {
            vc(t.getText());
          });
      });
      this.info.app.workspace.handleExternalLinkContextMenu(i, n);
    };
    e.prototype.onInternalLinkMouseover = function (event, targetEl, linktext) {
      this.info.app.workspace.trigger("hover-link", {
        event: event,
        source: "preview",
        hoverParent: this.info,
        targetEl: targetEl,
        linktext: linktext,
        sourcePath: this.info.path,
      });
    };
    e.prototype.onTagClick = function (e, t, n) {
      var i = this.info.app.internalPlugins.getEnabledPluginById("global-search");
      if (i) {
        i.openGlobalSearch("tag:" + n);
      }
    };
    return e;
  })();
function fR(e, t) {
  var n = e.getAttr("data-href") || e.getAttr("href");
  return n && MarkdownPreviewRenderer.belongsToMe(e, t) ? n : null;
}
function mR(e, t, n, i) {
  if (undefined === i) {
    i = fR;
  }
  for (var r = 0, o = t.findAll("a.internal-link"); r < o.length; r++) {
    var a = o[r],
      s = i(a, t);
    if (s) {
      var l = getLinkpath(s),
        c = e.metadataCache.getFirstLinkpathDest(l, n);
      a.toggleClass("is-unresolved", !c);
    }
  }
}
var MarkdownRenderer = (function (e) {
  function t(app, n, i) {
    if (undefined === i) {
      i = true;
    }
    var r = e.call(this, n) || this;
    r.docId = ic(16);
    r.hoverPopover = null;
    r.requestUpdateLinks = debounce(function () {
      for (var e = 0, t = r.renderer.sections; e < t.length; e++) {
        var n = t[e];
        if (n.rendered) {
          r.resolveLinks(n.el);
        }
      }
    }, 500);
    r.app = app;
    var o = new dR(r);
    r.renderer = new MarkdownPreviewRenderer(r, o, n, "worker.js", i);
    return r;
  }
  __extends(t, e);
  t.prototype.onload = function () {
    var e = this.app;
    this.registerEvent(e.vault.on("modify", this.onFileChange, this));
    this.registerEvent(e.vault.on("delete", this.onFileChange, this));
    this.registerEvent(e.metadataCache.on("changed", this.onFileChange, this));
  };
  t.prototype.onCheckboxClick = function (e, n, i) {
    e.preventDefault();
    var r = this.renderer.text,
      o = t.toggleCheckbox(r, i);
    if (o !== null) {
      var a = this.renderer.getSectionContainer(n);
      if (a) {
        var checked = o.char !== " ",
          l = i - a.start.line;
        if (l >= 0) {
          var c = String(l);
          a.html = a.html.replace(
            /<li class="task-list-item( is-checked)?" data-task="(.)" data-line="(\d+)"><input class="task-list-item-checkbox" type="checkbox"( checked)? data-line="(\d+)">/g,
            function (e, t, n, i, r, a) {
              return i === c && a === c
                ? '<li class="task-list-item'
                    .concat(checked ? " is-checked" : "", '" data-task="')
                    .concat(o.char, '" data-line="')
                    .concat(i, '"><input class="task-list-item-checkbox" type="checkbox"')
                    .concat(checked ? " checked" : "", ' data-line="')
                    .concat(a, '">')
                : e;
            },
          );
        }
        setTimeout(function () {
          n.checked = checked;
          var e = n.parentNode;
          if (e && e.instanceOf(HTMLLIElement)) {
            e.setAttr("data-task", o.char);
            e.toggleClass("is-checked", checked);
          }
        }, 0);
      }
      this.edit(o.text);
    }
  };
  t.toggleCheckbox = function (e, t) {
    var n = getLineBoundaries(e, t);
    if (!n) return null;
    var i = e.slice(n.start, n.end).search(/\[.\]/);
    if (-1 === i) return null;
    var r = n.start + i + 1,
      char = e.charAt(r) === " " ? "x" : " ";
    return {
      text: e.slice(0, r) + char + e.slice(r + 1),
      char: char,
    };
  };
  t.prototype.postProcess = function (e, promises, frontmatter) {
    var i = this,
      r = MarkdownPreviewView.postProcess(this.app, {
        docId: this.docId,
        sourcePath: this.path,
        frontmatter: frontmatter,
        promises: promises,
        addChild: function (e) {
          return i.addChild(e);
        },
        getSectionInfo: function (e) {
          return i.renderer.getSectionInfo(e);
        },
        replace: function (t, n) {
          var r = i.renderer.text,
            o = e.start,
            a = e.end,
            s = r.slice(0, o.offset) + t + r.slice(a.offset);
          if (n) {
            var l = fN(t);
            if (l.sections.length === 1) {
              e.html = l.sections[0].html;
            }
          }
          i.edit(s);
        },
        containerEl: this.renderer.sizerEl,
        el: e.el,
      });
    e.usesFrontMatter = !!r.usesFrontMatter;
    this.resolveLinks(e.el);
  };
  t.prototype.onScroll = function () {};
  t.prototype.onFoldChange = function () {};
  t.prototype.onRenderComplete = function () {};
  Object.defineProperty(t.prototype, "path", {
    get: function () {
      var e;
      return ((e = this.file) === null || undefined === e ? undefined : e.path) || "";
    },
    enumerable: false,
    configurable: true,
  });
  t.prototype.onFileChange = function (e) {
    this.requestUpdateLinks();
  };
  t.prototype.resolveLinks = function (e) {
    var t = this;
    mR(this.app, e, this.path, function (e) {
      return t.renderer.getInternalLinkHref(e);
    });
  };
  t.postProcess = function (e, t) {
    for (
      var sourcePath = t.sourcePath,
        i = t.promises,
        r = t.el,
        displayMode = t.displayMode,
        a = 0,
        s = r.findAll("code.language-query");
      a < s.length;
      a++
    ) {
      var l = s[a],
        c = nR(l).trim(),
        u = l.parentElement;
      t.addChild(vR(e, c, u, sourcePath));
    }
    for (var h = 0, p = MarkdownPreviewRenderer.postProcessors; h < p.length; h++) {
      var d = (0, p[h])(r, t);
      if (d && d.then) {
        i.push(d);
      }
    }
    var depth = cY(t.containerEl),
      m = r.findAll(".internal-embed:not(.is-loaded)");
    if (m.length > 0)
      for (var g = 0, v = m; g < v.length; g++) {
        var containerEl = v[g],
          linktext = containerEl.getAttribute("src"),
          w = vY.load({
            app: e,
            linktext: linktext,
            sourcePath: sourcePath,
            containerEl: containerEl,
            displayMode: displayMode,
            showInline: true,
            depth: depth,
          });
        if (w) {
          t.addChild(w);
          i.push(w.loadFile());
        }
      }
    return t;
  };
  t.renderMarkdown = function (e, n, i, r) {
    return t.render(null, e, n, i, r);
  };
  t.render = function (e, t, containerEl, sourcePath, r) {
    if (!(r && r instanceof Component)) {
      var o = new Error().stack;
      if (typeof o == "string") {
        var a = o.match(/plugin:([^:]+)/);
        if (a) {
          var s = a[1];
          if (!pR.hasOwnProperty(s)) {
            pR[s] = true;
            console.error(
              new Error(
                'Plugin "'.concat(
                  s,
                  '" is not passing Component in renderMarkdown. This is needed to avoid memory leaks when embedded contents register global event handlers.',
                ),
              ),
            );
          }
        }
      }
    }
    var l = parseMetadata(t),
      frontmatter = parseYamlFrontmatter(l),
      u = sanitizeHTMLToDom(renderMarkdown(l));
    containerEl.appendChild(u);
    for (
      var promises = [],
        p = {
          docId: ic(16),
          sourcePath: sourcePath,
          frontmatter: frontmatter,
          promises: promises,
          addChild: function (e) {
            return r && r.addChild(e);
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
        },
        d = 0,
        f = MarkdownPreviewRenderer.postProcessors;
      d < f.length;
      d++
    ) {
      var m = (0, f[d])(containerEl, p);
      if (m && m.then) {
        promises.push(m);
      }
    }
    if (e && r) {
      var depth = cY(containerEl),
        v = containerEl.findAll(".internal-embed:not(.is-loaded)");
      if (v.length > 0)
        for (var y = 0, b = v; y < b.length; y++) {
          var containerElw0 = b[y],
            linktext = containerElw0.getAttribute("src"),
            C = vY.load({
              app: e,
              linktext: linktext,
              sourcePath: sourcePath,
              containerEl: containerElw0,
              displayMode: true,
              showInline: true,
              depth: depth,
            });
          if (C) {
            p.addChild(C);
            promises.push(C.loadFile());
          }
        }
    }
    return promises.length > 0 ? Promise.all(promises).then() : Promise.resolve();
  };
  return t;
})(MarkdownRenderChild);
function vR(e, textt0, n, i) {
  var r = createDiv("internal-query");
  n.replaceWith(r);
  r.createDiv("internal-query-header", function (e) {
    e.createSpan("internal-query-header-icon", function (e) {
      return setIcon(e, "lucide-search");
    });
    e.createSpan({
      cls: "internal-query-header-title",
      text: textt0,
    });
  });
  var o = r.createDiv("search-result-container");
  return new wR(e, o, textt0, i);
}
var yR = (function (e) {
    function t(t, filen0, subpath) {
      var r = e.call(this) || this;
      r.hoverPopover = null;
      r.app = t.app;
      r.containerEl = t.containerEl;
      r.containerEl.addClass("markdown-embed");
      r.file = filen0;
      r.subpath = subpath;
      t.showInline &&
        (r.containerEl.addClass("inline-embed"),
        (r.headerEl = r.containerEl.createDiv({
          cls: "markdown-embed-title",
          prepend: true,
        })));
      return r;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return __awaiter(this, undefined, Promise, function () {
        var e,
          t,
          n,
          i,
          r,
          o,
          a,
          s,
          frontmatter,
          c,
          u,
          containerEl,
          p,
          promises,
          f,
          m = this;
        return __generator(this, function (g) {
          switch (g.label) {
            case 0:
              t = (e = this).app;
              n = e.file;
              i = e.subpath;
              r = t.metadataCache.getFileCache(n);
              o = resolveSubpath(r, i);
              return [4, t.vault.cachedRead(n)];
            case 1:
              a = g.sent();
              o && (a = extractSubpathContent(a, r, o).content);
              s = parseMetadata(a);
              frontmatter = parseYamlFrontmatter(s);
              c = renderMarkdown(s);
              u = sanitizeHTMLToDom(c);
              i || (f = this.headerEl) === null || undefined === f || f.setText(n.basename);
              (containerEl = this.containerEl.createDiv("markdown-preview-view markdown-rendered")).toggleClass(
                "rtl",
                t.vault.getConfig("rightToLeft"),
              );
              containerEl.toggleClass("show-indentation-guide", t.vault.getConfig("showIndentGuide"));
              containerEl.appendChild(u);
              p = new dR(this);
              MarkdownPreviewRenderer.registerDomEvents(containerEl, p);
              promises = [];
              MarkdownPreviewView.postProcess(this.app, {
                docId: ic(16),
                sourcePath: n.path,
                frontmatter: frontmatter,
                promises: promises,
                addChild: function (e) {
                  return m.addChild(e);
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
              g.sent();
              g.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    Object.defineProperty(t.prototype, "path", {
      get: function () {
        var e;
        return ((e = this.file) === null || undefined === e ? undefined : e.path) || "";
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(Component),
  MarkdownPreviewView = (function (e) {
    function t(view) {
      var n = this,
        i = view.contentEl.createDiv("markdown-reading-view");
      i.style.width = "100%";
      i.style.height = "100%";
      (n = e.call(this, view.app, i) || this).search = null;
      n.type = "preview";
      n.view = view;
      var r = n.renderer;
      r.addBottomPadding = true;
      n.updateReadableLineLength();
      n.updateFoldHeading();
      n.updateFoldIndent();
      n.updateIndentGuide();
      n.updateRTL();
      n.updatePropertiesInDocument();
      n.updateStrictLineBreaks();
      n.updateOptions();
      n.onResize();
      n.onFoldChange = debounce(function () {
        return n.view.onMarkdownFold();
      }, 500);
      r.addHeader();
      r.addFooter();
      i.addEventListener("contextmenu", function (e) {
        if (
          !(
            e.defaultPrevented ||
            !e.isTrusted ||
            (e.instanceOf(PointerEvent) && e.pointerType === "touch") ||
            r.sizerEl.contains(e.targetNode)
          )
        ) {
          n.app.workspace.trigger(
            "markdown-viewport-menu",
            Menu.forEvent(e).addSections(["view", ""]),
            view,
            "preview",
            "gutter",
          );
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this;
      this.registerEvent(
        this.app.workspace.on("post-processor-change", function () {
          return e.rerender(!0);
        }),
      );
      this.registerEvent(this.app.vault.on("config-changed", this.onConfigChanged, this));
    };
    Object.defineProperty(t.prototype, "file", {
      get: function () {
        return this.view.file;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.show = function () {
      this.renderer.header.el.appendChild(this.view.inlineTitleEl);
      this.renderer.header.el.appendChild(this.view.metadataEditor.containerEl);
      this.renderer.footer.el.appendChild(this.view.backlinksEl);
      this.containerEl.show();
      this.search && (this.view.scope = this.search.scope);
    };
    t.prototype.hide = function () {
      this.containerEl.hide();
      this.search && (this.view.scope = null);
    };
    t.prototype.get = function () {
      return this.renderer.text;
    };
    t.prototype.set = function (e, t) {
      t && this.clear();
      this.renderer.set(e);
    };
    t.prototype.clear = function () {
      this.renderer.clear();
    };
    t.prototype.beforeUnload = function () {};
    t.prototype.rerender = function (e) {
      this.renderer.rerender(e);
    };
    t.prototype.getEphemeralState = function (e) {};
    t.prototype.setEphemeralState = function (e) {
      var t = this;
      if (e.focusMetadata) this.view.metadataEditor.focusPropertyAtIndex(0);
      else if (e.focus) {
        var n = this.renderer.previewEl;
        n.tabIndex = -1;
        n.focus({
          preventScroll: !0,
        });
      }
      if (e.hasOwnProperty("scroll")) {
        this.renderer.applyScrollDelayed(e.scroll);
      }
      var i = function () {
        return t.view.syncScroll();
      };
      if (
        (undefined !== e.line &&
          e.line >= 0 &&
          this.renderer.applyScrollDelayed(
            e.line,
            {
              highlight: !0,
            },
            i,
          ),
        undefined !== e.propertyMatches)
      ) {
        var r = e.propertyMatches;
        if (r.length > 0 && this.view.canShowProperties()) {
          __awaiter(t, undefined, undefined, function () {
            var e;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, eD(this.app)];
                case 1:
                  (e = t.sent()) &&
                    executeWhenShown(e.containerEl, function () {
                      e.focusProperty(r[0].key);
                    });
                  return [2];
              }
            });
          });
        }
      } else if (undefined !== e.match) {
        var o = e.match,
          a = o.content,
          s = o.matches;
        if (s.length > 0) {
          var l = rc(a, s[0][0]);
          this.renderer.applyScrollDelayed(
            l,
            {
              center: true,
              highlight: !0,
            },
            i,
          );
        }
      }
    };
    t.prototype.getScroll = function () {
      return this.renderer.getScroll();
    };
    t.prototype.applyScroll = function (e) {
      this.renderer.applyScroll(e);
    };
    t.prototype.getFoldInfo = function () {
      return this.renderer.getFoldInfo();
    };
    t.prototype.applyFoldInfo = function (e) {
      this.renderer.applyFoldInfo(e);
    };
    t.prototype.onResize = function () {
      this.renderer.onResize();
      this.view.scroll !== null && this.renderer.applyScrollDelayed(this.view.scroll);
    };
    t.prototype.showSearch = function () {
      var e = this;
      if (!this.search) {
        var t = (this.search = new dN(this.app, this.renderer, this.containerEl, function () {
          e.search = null;
          e.view.scope = null;
        }));
        this.view.scope = t.scope;
      }
      this.search.searchInputEl.focus();
      this.search.searchInputEl.select();
    };
    t.prototype.updateReadableLineLength = function () {
      var e = this.app.vault.getConfig("readableLineLength");
      this.renderer.previewEl.toggleClass("is-readable-line-width", e);
    };
    t.prototype.updateFoldHeading = function () {
      var e = this.app.vault.getConfig("foldHeading");
      this.renderer.previewEl.toggleClass("allow-fold-headings", e);
      e || this.renderer.unfoldAllHeadings();
    };
    t.prototype.updateFoldIndent = function () {
      var e = this.app.vault.getConfig("foldIndent");
      this.renderer.previewEl.toggleClass("allow-fold-lists", e);
      e || this.renderer.unfoldAllLists();
    };
    t.prototype.updateIndentGuide = function () {
      var e = this.app.vault.getConfig("showIndentGuide");
      this.renderer.previewEl.toggleClass("show-indentation-guide", e);
    };
    t.prototype.updateRTL = function () {
      this.renderer.previewEl.toggleClass("rtl", this.app.vault.getConfig("rightToLeft"));
    };
    t.prototype.updatePropertiesInDocument = function () {
      this.renderer.previewEl.toggleClass(
        "show-properties",
        this.app.vault.getConfig("propertiesInDocument") !== "hidden",
      );
    };
    t.prototype.updateStrictLineBreaks = function () {
      remarkParser.globalOptions.breaks = !this.app.vault.getConfig("strictLineBreaks");
      this.rerender();
    };
    t.prototype.onConfigChanged = function (e) {
      switch (e) {
        case "readableLineLength":
          this.updateReadableLineLength();
          break;
        case "foldHeading":
          this.updateFoldHeading();
          break;
        case "foldIndent":
          this.updateFoldIndent();
          break;
        case "showIndentGuide":
          this.updateIndentGuide();
          break;
        case "rightToLeft":
          this.updateRTL();
          break;
        case "propertiesInDocument":
          this.updatePropertiesInDocument();
          break;
        case "strictLineBreaks":
          this.updateStrictLineBreaks();
      }
    };
    t.prototype.updateOptions = function () {};
    t.prototype.edit = function (e) {
      var t = this;
      this.renderer.set(e);
      this.view.onInternalDataChange();
      __awaiter(t, undefined, undefined, function () {
        return __generator(this, function (e) {
          switch (e.label) {
            case 0:
              return [4, this.view.save()];
            case 1:
              e.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.onScroll = function () {
      if (!(Date.now() - this.renderer.lastRender < 100)) {
        this.view.syncScroll();
      }
    };
    t.prototype.onRenderComplete = function () {
      e.prototype.onRenderComplete.call(this);
      this.search && this.search.highlightRanges === null && this.search.updateQuery();
    };
    t.prototype.foldAll = function () {
      var e = this.app.vault,
        t = e.getConfig("foldHeading"),
        n = e.getConfig("foldIndent");
      t && this.renderer.foldAllHeadings();
      n && this.renderer.foldAllLists();
    };
    t.prototype.unfoldAll = function () {
      var e = this.app.vault,
        t = e.getConfig("foldHeading"),
        n = e.getConfig("foldIndent");
      t && this.renderer.unfoldAllHeadings();
      n && this.renderer.unfoldAllLists();
    };
    t.prototype.getSelection = function () {
      return window.getSelection().toString();
    };
    return t;
  })(MarkdownRenderer),
  wR = (function (e) {
    function t(app, n, query, sourcePath) {
      var o = e.call(this, n) || this;
      o.searchQuery = null;
      o.app = app;
      o.query = query;
      o.sourcePath = sourcePath;
      o.dom = new pN(app, n, i18nProxy.plugins.search.labelNoMatches());
      o.queue = new hR(app, o.dom);
      o.addChild(o.queue);
      return o;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var e = this,
        t = e.app,
        n = e.dom,
        i = e.sourcePath;
      n.emptyResults();
      try {
        var searchQuery = new WF(t, this.query.replace(/\r?\n/g, " "), !1);
        if (!searchQuery.matcher) return;
        this.searchQuery = searchQuery;
        var o = this.queue.start();
        UF(t, searchQuery.requiredInputs, o, function (e, t) {
          if (e.path === i) {
            t = t.replace(/```query([\s\S]*?)(```|$)/g, function (e) {
              return e.replace(/./g, " ");
            });
          }
          var o = searchQuery.match(e, t);
          o ? n.addResult(e, o, t) : n.removeResult(e);
        });
      } catch (e) {
        console.log(e);
      }
    };
    t.prototype.onResize = function () {
      this.dom.onResize();
    };
    return t;
  })(MarkdownRenderChild);
function kR(e, t) {
  return e.length === t.length
    ? e.eq(t)
    : e.length < t.length
      ? t.slice(0, e.length).eq(e)
      : e.slice(0, t.length).eq(t);
}
var CR = (function () {
    function e(table, row, col, texti0, padStart, padEnd) {
      undefined === texti0 && (texti0 = "");
      undefined === padStart && (padStart = 1);
      undefined === padEnd && (padEnd = 1);
      this.start = 0;
      this.padStart = 1;
      this.end = 0;
      this.padEnd = 1;
      this.dirty = false;
      this.table = table;
      this.row = row;
      this.col = col;
      this.text = texti0;
      this.padStart = padStart;
      this.padEnd = padEnd;
    }
    e.prototype.setTextDir = function () {
      var e = this,
        t = e.el,
        n = e.row,
        i = e.col,
        r = e.table;
      t.dir = detectTextDirectionInNode(t);
      n === 0 && i === 0 && (r.containerEl.dir = t.dir);
    };
    e.prototype.init = function (e, start, end) {
      var i = this;
      this.el = e;
      this.start = start;
      this.end = end;
      this.setTextDir();
      var r = Array.from(e.childNodes),
        o = (this.contentEl = e.createDiv("table-cell-wrapper"));
      o.append.apply(o, r);
      r.length === 0 && o.createEl("br");
      e.addEventListener("click", function (e) {
        if (e.detail === 4) {
          e.preventDefault();
          var t = i.table,
            n = t.rows.first().first(),
            r = t.rows.last().last();
          i.contentEl.win.setTimeout(function () {
            t.selectCells(n, r);
          });
        }
      });
      e.addEventListener("contextmenu", function (e) {
        if (!e.defaultPrevented) {
          var t = i.table,
            n = t.editor.tableCell,
            r = t.selectedCells.length > 0;
          if (e.pointerType === "mouse") {
            if (r && !t.selectedCells.contains(i)) {
              t.deselectCells();
              t.setCellFocus(i.row, i.col);
              return void t.editor.tableCell.onContextMenu(e);
            }
            if (!r && (n == null ? undefined : n.cell) === i) {
              if (n.cm.hasFocus) return;
              n.cm.focus();
              return void n.onContextMenu(e);
            }
            t.onContextMenu(i, Menu.forEvent(e));
          } else if (r && t.selectedCells.contains(i)) {
            t.onContextMenu(i, Menu.forEvent(e));
          }
        }
      });
      e.addEventListener("dragenter", function () {
        var e,
          t = i.table;
        if (((e = t.editor.tableCell) === null || undefined === e ? undefined : e.cell) !== i) {
          t.editor.editTableCell(t, i);
        }
      });
      e.addEventListener("dragleave", function (t) {
        var n,
          r = i.table.editor;
        if (!isPointInElementRect(t, e) && ((n = r.tableCell) === null || undefined === n ? undefined : n.cell) === i) {
          r.destroyTableCell();
        }
      });
      e.addEventListener("pointerdown", function (e) {
        var t = i.table;
        if (
          (e.button === 2 && t.selectedCells.contains(i) && e.preventDefault(),
          e.isPrimary && e.button === 0 && !e.defaultPrevented)
        ) {
          var n = e.win,
            r = i,
            o = i,
            a = t.isMalformed,
            s = function () {
              a && !t.isMalformed && ((r = t.getCellAt(r.row, r.col)), (o = t.getCellAt(o.row, o.col)), (a = false));
              t.selectCells(r, o);
            },
            l = function () {
              var n;
              if (r !== ((n = t.editor.tableCell) === null || undefined === n ? undefined : n.cell)) {
                var i = (function (e) {
                  var t = e.win.getSelection(),
                    head = {
                      x: e.clientX,
                      y: e.clientY,
                    };
                  if (t.rangeCount < 1)
                    return {
                      head: head,
                      anchor: head,
                    };
                  var i = t.getRangeAt(0).getClientRects();
                  if (i.length === 0)
                    return {
                      head: head,
                      anchor: head,
                    };
                  var r = detectTextDirection(t.toString()) === "rtl",
                    o = i[0],
                    a = i[i.length - 1],
                    anchor = {
                      x: r ? o.right : o.left,
                      y: o.y + o.height / 2,
                    },
                    headl0 = {
                      x: r ? a.left : a.right,
                      y: a.y + a.height / 2,
                    };
                  return Fl(head, anchor) > Fl(head, headl0)
                    ? {
                        head: headl0,
                        anchor: anchor,
                      }
                    : {
                        head: anchor,
                        anchor: headl0,
                      };
                })(e);
                t.setCellFocus(r.row, r.col, function (e) {
                  s();
                  return EditorSelection.single(e.posAtCoords(i.anchor), e.posAtCoords(i.head));
                });
              }
            },
            c = t.editor.tableCell;
          if (c && e.shiftKey) {
            r = c.cell;
            o = i;
          }
          var u,
            h = e.pointerType === "touch";
          if (h) {
            if (c) {
              var p = c.cm,
                d = p.state.selection.main;
              if (p.hasFocus && p.contentDOM.contains(e.targetNode) && d.empty)
                return void i.handleMobileCaretDrag(e, r);
            }
          } else s();
          var f = function (e) {
            m();
            e.defaultPrevented || (e.preventDefault(), l());
          };
          n.addEventListener("click", f);
          var m = function () {
              n.removeEventListener("click", f);
              n.clearTimeout(u);
            },
            g = Ll(e),
            v = setupPointerDragHandler(
              e,
              function () {
                return {
                  move: function (e) {
                    h ? Fl(Ll(e), g) > 5 && (m(), v()) : ((o = t.getClosestCell(e.clientX, e.clientY)), s());
                  },
                  end: function (e) {
                    if (e.type !== "dragstart") {
                      u = n.setTimeout(function () {
                        l();
                      }, 10);
                    }
                  },
                  cancel: function () {
                    m();
                  },
                };
              },
              0,
            );
        }
      });
    };
    e.prototype.handleMobileCaretDrag = function (e, t) {
      var n,
        i = this.table,
        r = i.containerEl,
        o = i.editor,
        a = e.win,
        s = e.pointerId,
        l = o.cm.scrollDOM,
        c = null,
        u = 0,
        h = function (e) {
          var o = u === 0 ? 50 : e - u;
          c = a.requestAnimationFrame(h);
          u = e;
          var s = autoScrollOnDrag(r, n, o, 1),
            p = autoScrollOnDrag(l, n, o, 1);
          if (s || p) {
            var d = i.getClosestCell(n.x, n.y);
            i.selectCells(t, d);
          }
        };
      if (Platform.isIosApp) {
        var p = Date.now(),
          d = function (e) {
            if (e.pointerId === s && !(Date.now() - p < 200)) {
              n = Ll(e);
              c || (c = a.requestAnimationFrame(h));
              var r = i.getClosestCell(n.x, n.y);
              i.selectCells(t, r);
            }
          },
          f = function (e) {
            if (e.pointerId === s) {
              g();
              i.selectedCells.length && i.editor.destroyTableCell();
            }
          },
          m = function (e) {
            if (e.pointerId === s) {
              g();
            }
          },
          g = function () {
            a.cancelAnimationFrame(c);
            a.removeEventListener("pointermove", d);
            a.removeEventListener("pointerup", f);
            a.removeEventListener("pointercancel", m);
          };
        a.addEventListener("pointermove", d);
        a.addEventListener("pointerup", f);
        return void a.addEventListener("pointercancel", m);
      }
      if (Platform.isAndroidApp) {
        var v = 0,
          y = false,
          b = 0,
          w = l.scrollTop,
          k = r.scrollLeft,
          C = function (e) {
            if (e.touches.length === 1) {
              v = e.touches[0].identifier;
            }
          },
          E = function (e) {
            var o = Rc(e, v);
            if (o)
              if (y || (w === l.scrollTop && k === r.scrollLeft)) {
                n = Ll(o);
                var s = i.getClosestCell(n.x, n.y);
                s !== t && !y && b > 0 && Date.now() - b > 50 && ((y = true), c || (c = a.requestAnimationFrame(h)));
                y && i.selectCells(t, s);
              } else T();
          },
          S = function (e) {
            if (Rc(e, v)) {
              T();
              i.selectedCells.length && i.editor.destroyTableCell();
            }
          },
          M = function (e) {
            if (Rc(e, v)) {
              T();
            }
          },
          x = function (e) {
            if (e.pointerId === s) {
              b = Date.now();
            }
          },
          T = function () {
            a.cancelAnimationFrame(c);
            a.removeEventListener("touchstart", C);
            a.removeEventListener("touchmove", E);
            a.removeEventListener("touchend", S);
            a.removeEventListener("touchcancel", M);
            a.removeEventListener("pointerup", T);
            a.removeEventListener("pointercancel", x);
          };
        a.addEventListener("touchstart", C);
        a.addEventListener("touchmove", E);
        a.addEventListener("touchend", S);
        a.addEventListener("touchcancel", M);
        a.addEventListener("pointerup", T);
        a.addEventListener("pointercancel", x);
      }
    };
    e.prototype.updateWidth = function (e) {
      var t = this,
        n = t.text,
        i = t.table,
        r = t.col,
        o = e - n.length,
        a = i.alignments[r],
        padStart = 1,
        padEnd = 1;
      a === "right"
        ? (padStart = o - 1)
        : a === "center"
          ? ((padStart = Math.floor(o / 2)), (padEnd = Math.ceil(o / 2)))
          : (padEnd = o - 1);
      this.padStart = padStart;
      this.padEnd = padEnd;
    };
    e.prototype.getTextWithPadding = function () {
      return " ".repeat(this.padStart) + this.text + " ".repeat(this.padEnd);
    };
    e.prototype.getLength = function () {
      return this.padStart + this.padEnd + this.text.length;
    };
    e.prototype.getAbsoluteOffsets = function () {
      var e = this.table.start,
        t = this,
        n = t.start,
        i = t.end;
      return {
        start: e + n,
        end: e + i,
        textStart: e + n + t.padStart,
        textEnd: e + i - t.padEnd,
      };
    };
    e.prototype.lockDimensions = function () {
      var e = this.el,
        t = e.getBoundingClientRect(),
        n = t.width,
        i = t.height;
      e.setCssStyles({
        width: "".concat(n, "px"),
        height: "".concat(i, "px"),
      });
      e.win.setTimeout(function () {
        return e.removeAttribute("style");
      });
    };
    e.prototype.scrollIntoView = function () {
      var e,
        t = this.table,
        n = this.el,
        i = t.editor,
        r = t.containerEl;
      if (r.isShown()) {
        var o,
          a,
          s = i.cm.scrollDOM,
          l = null;
        if (
          (((e = i.tableCell) === null || undefined === e ? undefined : e.cell) === this && (l = i.tableCell.cm),
          r.scrollWidth > r.clientWidth)
        ) {
          var c = r.getBoundingClientRect(),
            u = (o = n.getBoundingClientRect());
          l && o.width > c.width && (u = a = l.coordsAtPos(l.state.selection.main.head));
          u.left < c.left ? r.scrollBy(u.left - c.left, 0) : u.right > c.right && r.scrollBy(u.right - c.right, 0);
        }
        if (s.scrollHeight > s.clientHeight) {
          if (!o) {
            o = n.getBoundingClientRect();
          }
          var h = s.getBoundingClientRect(),
            p = o;
          l && o.height > h.height && (p = a || l.coordsAtPos(l.state.selection.main.head));
          p.top < h.top ? s.scrollBy(0, p.top - h.top) : p.bottom > h.bottom && s.scrollBy(0, p.bottom - h.bottom);
        }
      }
    };
    return e;
  })(),
  ER = Annotation.define(),
  SR = (function (e) {
    function t(t, n, doc, isDocComplete) {
      var o = e.call(this, t, n) || this;
      o.rows = [];
      o.alignments = [];
      o.colWidths = [];
      o.isMalformed = false;
      o.tableEl = null;
      o.selectedCells = [];
      o.selectionAnchor = null;
      o.selectionHead = null;
      o.updateCellReadonly = debounce(
        function () {
          var e = o,
            t = e.selectionAnchor,
            n = e.selectionHead,
            i = e.editor;
          if (i.tableCell) {
            var r = !(!t || !n);
            i.tableCell.setReadonly(r);
          }
        },
        50,
        !0,
      );
      o.cellChildMap = new Map();
      o.doc = doc;
      o.containerEl = createDiv({
        cls: "cm-embed-block cm-table-widget markdown-rendered",
        onpointerdown: function (e) {
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        },
      });
      o.isDocComplete = isDocComplete;
      return o;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "text", {
      get: function () {
        return this.doc.toString();
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.clear = function () {
      this.rows.length = 0;
      this.alignments.length = 0;
      this.containerEl.empty();
      this.cleanupChildren();
    };
    t.prototype.getSelectedCell = function (e) {
      if (!e) return null;
      for (var t = this.rows, n = null, i = 0, r = e.ranges; i < r.length; i++) {
        var o = r[i],
          a = o.from,
          s = o.to;
        if (n) {
          var l = n.start,
            c = n.end;
          if (a >= l && a <= c && s >= l && s <= c) continue;
          return null;
        }
        for (var u = 0, h = t; u < h.length; u++) {
          for (var p = 0, d = h[u]; p < d.length; p++) {
            var f = d[p];
            l = f.start;
            c = f.end;
            if (a >= l && a <= c && s >= l && s <= c) {
              n = f;
              break;
            }
          }
          if (n) break;
        }
      }
      return n;
    };
    t.prototype.containsSelection = function (e) {
      var t = this;
      return (
        !!e &&
        e.ranges.every(function (e) {
          var n = e.from,
            i = e.to;
          return t.containsRange(n, i);
        })
      );
    };
    t.prototype.containedBySelection = function (e) {
      if (!e) return !1;
      var t = this.start,
        n = this.end;
      return e.ranges.some(function (e) {
        var i = e.from,
          r = e.to;
        return i <= t && r >= n;
      });
    };
    t.prototype.containsRange = function (e, t) {
      var n = this.start,
        i = this.end;
      return e >= n && e <= i && t >= n && t <= i;
    };
    t.prototype.getTableString = function (e) {
      for (
        var t = this.validateSelectionBounds(e),
          n = t.minRow,
          i = t.maxRow,
          r = t.minCol,
          o = t.maxCol,
          a = this,
          s = a.rows,
          l = a.alignments,
          c = a.colWidths,
          u = "",
          h = n;
        h <= i;
        h++
      ) {
        for (var p = s[h], d = r; d <= o; d++) {
          var f = p[d].text,
            m = c[d] - f.length,
            g = l[d],
            v = 1,
            y = 1;
          g === "right"
            ? (v = m - 1)
            : g === "center"
              ? ((v = Math.floor(m / 2)), (y = Math.ceil(m / 2)))
              : (y = m - 1);
          u += "|" + " ".repeat(v) + f + " ".repeat(y);
        }
        u += "|";
        h === n && (u += "\n" + this.makeAlignmentRow(r, o));
        h !== i && (u += "\n");
      }
      return u;
    };
    t.prototype.makeAlignmentRow = function (e, t) {
      for (var n = this.alignments, i = this.colWidths, r = "", o = e; o <= t; o++) {
        var a = i[o];
        switch (n[o]) {
          case "left":
            r += "| :" + "-".repeat(a - 3) + " ";
            break;
          case "center":
            r += "| :" + "-".repeat(a - 4) + ": ";
            break;
          case "right":
            r += "| " + "-".repeat(a - 3) + ": ";
            break;
          default:
            r += "| " + "-".repeat(a - 2) + " ";
        }
      }
      return (r += "|");
    };
    t.prototype.rebuildTable = function () {
      var e = this,
        t = e.editor,
        n = e.rows,
        i = e.alignments,
        r = this.getTableString({
          minRow: 0,
          maxRow: n.length - 1,
          minCol: 0,
          maxCol: i.length - 1,
        }),
        o = t.cm,
        a = (this.doc = o.state.toText(r));
      r && this.render();
      return a;
    };
    t.prototype.dispatchTable = function (e, t, n) {
      var i = this,
        from = i.start,
        o = i.end,
        a = i.editor.cm,
        selection = a.state.selection,
        insert = this.rebuildTable();
      if (insert.length && undefined !== e && undefined !== t) {
        var c = this.rows,
          u = this.alignments;
        e = Math.clamp(e, 0, c.length - 1);
        t = Math.clamp(t, 0, u.length - 1);
        var h = this.getCellAt(e, t);
        if (h) {
          var p = h.getAbsoluteOffsets().textStart,
            d = p,
            f = n
              ? function (e) {
                  var t = n(e),
                    i = Tm(e.state.doc.toString()),
                    r = t.map(i.changes).main;
                  p += r.from;
                  d += r.to;
                  return t;
                }
              : undefined;
          this.receiveCellFocus(h.row, h.col, f);
          selection = EditorSelection.single(p, d);
        }
      }
      a.dispatch({
        selection: selection,
        changes: [
          {
            from: from,
            to: o,
            insert: insert,
          },
        ],
        scrollIntoView: false,
      });
    };
    t.prototype.trimCell = function (e) {
      var t = e.text,
        n = t.trim();
      if (t !== n) {
        this.isMalformed = true;
        this.updateCell(e, n);
      }
    };
    t.prototype.dispatchUpdate = function (e, t) {
      var changes,
        i = this,
        r = i.doc,
        o = i.editor,
        a = i.start,
        s = e.cell,
        annotations = [ER.of(!0)],
        c = t.annotation(Transaction.userEvent);
      if (c && !/^select/.test(c)) {
        annotations.push(Transaction.userEvent.of(c));
      }
      var u = Tm(t.newDoc.toString());
      if (t.docChanged || u.result !== s.text) {
        var h = this.updateCell(s, u.result);
        if (h.length) {
          changes = h.map(function (e) {
            return {
              from: e.from + a,
              to: e.to + a,
              insert: e.insert,
            };
          });
          this.doc = ChangeSet.of(h, r.length).apply(r);
        }
      }
      var p = s.getAbsoluteOffsets(),
        d = p.textStart,
        f = p.textEnd - d,
        m = t.newSelection.map(u.changes);
      m = xm(m, 0, f);
      o.cm.dispatch({
        annotations: annotations,
        changes: changes,
        selection: Mm(m, d),
        scrollIntoView: false,
      });
    };
    t.prototype.reconcileChanges = function (e, t) {
      var n,
        i = this,
        r = this,
        o = r.start,
        a = r.end,
        s = r.tableEl,
        l = r.doc;
      if (!s) return null;
      var c = true,
        u = new Map(),
        h = [],
        p = l.line(2),
        d = null;
      if (
        (t.changes.iterChanges(function (t, n, r, s, insert) {
          if (c)
            if ((t < o && n > o) || (t < a && n > a)) c = false;
            else if (i.containsRange(t, n)) {
              var from = t - o,
                m = n - o;
              if (wm(p, from, m))
                from !== p.from || m !== p.to
                  ? (c = false)
                  : (h.push({
                      from: from,
                      to: m,
                      insert: insert,
                    }),
                    (d = insert));
              else if (t === o && n === a && e.eq(insert)) c = false;
              else {
                var g = i.getSelectedCell(EditorSelection.single(from, m));
                if (g) {
                  var v = u.get(g);
                  if (!v) {
                    v = [];
                    u.set(g, v);
                  }
                  var y = g.getAbsoluteOffsets().start;
                  v.push({
                    from: t - y,
                    to: n - y,
                    insert: insert,
                  });
                  h.push({
                    from: from,
                    to: m,
                    insert: insert,
                  });
                } else c = false;
              }
            }
        }),
        !c)
      )
        return null;
      l = ChangeSet.of(h, l.length).apply(l);
      var f = d ? d.length - p.length : 0;
      if (u.size) this.applyCellUpdates(t, u, f);
      else {
        var m = (n = this.rows.first()) === null || undefined === n ? undefined : n.last();
        if (m && f !== 0) {
          this.offsetCellsAfter(m, f);
        }
      }
      return l;
    };
    t.prototype.receiveUpdate = function (e, doc) {
      var n = this.doc;
      if (!this.isDocComplete) {
        this.isDocComplete = true;
        return !!kR(n, doc) && ((this.doc = doc), this.render(), !0);
      }
      var i = doc.eq(n);
      if (!e.docChanged || e.annotation(ER)) return i;
      var r = false,
        o = this.editor.tableCell;
      if (o && (e.isUserEvent("undo") || e.isUserEvent("redo"))) {
        var a = o.cell.getAbsoluteOffsets(),
          s = a.start,
          l = a.end;
        if (e.changes.touchesRange(s, l)) {
          r = true;
        }
      }
      if (!r && i) return !0;
      var docc0 = this.reconcileChanges(doc, e);
      return docc0 && docc0.eq(doc) ? ((this.doc = docc0), !0) : ((this.doc = doc), this.render(), !0);
    };
    t.prototype.receiveIncompleteUpdate = function (e, t) {
      if (!e.docChanged || e.annotation(ER)) return kR(this.doc, t);
      var n = this.doc,
        i = this.reconcileChanges(t, e);
      i && (this.doc = n = i);
      return kR(n, t);
    };
    t.prototype.applyCellUpdates = function (e, t, n) {
      var i,
        r = this,
        o = r.start,
        a = r.editor,
        s = r.colWidths,
        l = r.rows,
        c = a.cm,
        u = c.hasFocus,
        h = [],
        p = Array.from(t.entries()),
        d = new Set();
      p.sort(function (e, t) {
        return t[0].start - e[0].start;
      });
      for (var f = 0, m = p; f < m.length; f++) {
        var g = m[f],
          v = g[0],
          changes = g[1],
          b = v.getAbsoluteOffsets(),
          w = b.start,
          k = b.end,
          C = c.state.doc.slice(w, k),
          E = ChangeSet.of(changes, C.length)
            .apply(C)
            .toString()
            .match(/^(\s*)(.*?)(\s*)$/);
        if (E) {
          var S = v.start,
            M = v.end;
          v.padStart = E[1].length;
          v.text = E[2];
          v.padEnd = E[3].length;
          v.dirty = true;
          var x = (v.end = S + v.getLength());
          M !== x && ((this.isMalformed = true), d.add(v.col));
          this.offsetCellsAfter(v, x - M);
          h.push(v);
        }
      }
      var T = (i = this.rows.first()) === null || undefined === i ? undefined : i.last();
      if ((T && n !== 0 && this.offsetCellsAfter(T, n), this.isMalformed))
        for (var D = 0, A = Array.from(d); D < A.length; D++) {
          for (var P = A[D], L = 5, I = 0, O = l; I < O.length; I++) {
            var F = O[I][P].text.length;
            L = Math.max(L, F + 2);
          }
          s[P] = L;
        }
      var N = null,
        R = null;
      if (e.selection && (N = this.getSelectedCell(Mm(e.selection, -o)))) {
        var B = N.getAbsoluteOffsets(),
          V = B.textStart,
          H = B.textEnd,
          z = xm(e.selection, V, H);
        R = Mm(z, -V);
      }
      var q = a.tableCell;
      if (q && q.table === this) {
        v = q.cell;
        var W = q.cm;
        if (v.dirty || N === v) {
          var U = Dm(v.text),
            _ = ChangeSet.of(U.changes, v.text.length),
            selection = ((changes = undefined), undefined);
          v.dirty &&
            (changes = [
              {
                from: 0,
                to: W.state.doc.length,
                insert: U.result,
              },
            ]);
          N === v && (selection = R == null ? undefined : R.map(_));
          (changes || selection) &&
            W.dispatch({
              changes: changes,
              selection: selection,
              annotations: [ER.of(!0)],
            });
        }
        h.remove(v);
      }
      for (var G = 0, K = h; G < K.length; G++) {
        v = K[G];
        this.rerenderCell(v);
      }
      if (u && N && (!q || q.cell !== N)) {
        U = Dm((v = N).text);
        var Y = ChangeSet.of(U.changes, v.text.length);
        this.receiveCellFocus(v.row, v.col, function () {
          return R == null ? undefined : R.map(Y);
        });
      }
    };
    t.prototype.receiveSelection = function (e) {
      var t,
        n,
        i = this,
        r = this,
        o = r.rows,
        a = r.start,
        s = r.end,
        l = r.editor,
        c = r.tableEl,
        u = e.isUserEvent("undo") || e.isUserEvent("redo");
      if (
        c &&
        a !== s &&
        (u || l.cm.hasFocus || ((t = l.tableCell) === null || undefined === t ? undefined : t.cm.hasFocus)) &&
        !e.annotation(ER) &&
        !e.annotation(mm) &&
        this.containsSelection(e.newSelection)
      ) {
        var h = e.newSelection,
          p = this.getSelectedCell(Mm(h, -a));
        if (p) {
          var d = l.tableCell,
            f = (d == null ? undefined : d.cell) === p;
          if (f && !e.selection) return;
          var m = p.getAbsoluteOffsets(),
            g = m.textStart,
            v = m.textEnd,
            y = Dm(p.text),
            selection = Mm((h = xm(h, g, v)), -g).map(y.changes);
          if (f) {
            var w = d.editor.cm;
            l.cm.hasFocus && w.focus();
            w.dispatch({
              annotations: [ER.of(!0)],
              selection: selection,
            });
            this.selectionHead || p.scrollIntoView();
          } else
            this.receiveCellFocus(p.row, p.col, function () {
              return selection;
            });
        } else {
          var k = h.ranges;
          if (k.length === 1) {
            var C = k[0];
            if (C.from === C.to) {
              var E = (n = e.startState.selection) === null || undefined === n ? undefined : n.ranges,
                S = (E == null ? undefined : E.length) ? E[0] : null;
              if (S) {
                var M = this.containerEl.win;
                if (S.head <= a) {
                  var x = o.first().first();
                  if (x) {
                    M.setTimeout(function () {
                      i.placeCursorInCell(x, "start");
                    });
                  }
                } else {
                  var T = o.last().first();
                  if (T) {
                    M.setTimeout(function () {
                      i.placeCursorInCell(T, "last-line");
                    });
                  }
                }
              }
            }
          }
        }
      }
    };
    t.prototype.offsetCellsAfter = function (e, start) {
      for (var n = this.rows, i = n[e.row], r = e.col + 1, o = i.length; r < o; r++) {
        i[r].start += start;
        i[r].end += start;
      }
      for (r = e.row + 1, o = n.length; r < o; r++)
        for (var a = 0, s = n[r]; a < s.length; a++) {
          var l = s[a];
          l.start += start;
          l.end += start;
        }
    };
    t.prototype.updateCell = function (e, textt0) {
      var n = this,
        i = n.rows,
        r = n.colWidths,
        o = n.alignments,
        a = e.col,
        s = 5;
      e.text = textt0;
      e.dirty = true;
      for (var l = 0, c = i; l < c.length; l++) {
        var u = (y = c[l][a]).text.length;
        s = Math.max(s, u + 2);
      }
      var h = [],
        p = r[a] !== s,
        start = 0;
      r[a] = s;
      for (var f = 0, m = i.length; f < m; f++) {
        for (var g = 0, v = i[f]; g < v.length; g++) {
          var y,
            b = (y = v[g]).padStart,
            w = y.padEnd,
            from = y.start,
            C = y.end;
          if (y.col === a) {
            y.updateWidth(s);
            var E = y.padStart,
              S = y.padEnd;
            if (y !== e) {
              y.start += start;
              E !== b &&
                ((start += E - b),
                h.push({
                  from: from,
                  to: from + b,
                  insert: " ".repeat(E),
                }));
              S !== w &&
                ((start += S - w),
                h.push({
                  from: C - w,
                  to: C,
                  insert: " ".repeat(S),
                }));
              y.end += start;
            } else {
              var insert = y.getTextWithPadding();
              y.start = from + start;
              y.end = from + start + insert.length;
              start = y.end - C;
              h.push({
                from: from,
                to: C,
                insert: insert,
              });
            }
          } else if (start) {
            y.start += start;
            y.end += start;
          }
        }
        if (f === 0 && p) {
          var x = this.doc.line(2),
            insertT0 = this.makeAlignmentRow(0, o.length - 1);
          start += insertT0.length - x.length;
          h.push({
            from: x.from,
            to: x.to,
            insert: insertT0,
          });
        }
      }
      return h;
    };
    t.prototype.setCellFocus = function (e, t, n) {
      this.isMalformed ? this.dispatchTable(e, t, n) : this.receiveCellFocus(e, t, n, !0);
    };
    t.prototype.receiveCellFocus = function (e, t, n, i) {
      if (undefined === i) {
        i = false;
      }
      var r = this,
        o = r.rows,
        a = r.alignments,
        s = r.editor,
        l = r.containerEl,
        c = Math.clamp(e, 0, o.length - 1),
        u = Math.clamp(t, 0, a.length - 1),
        h = o[c][u],
        p = s.editTableCell(this, h),
        d = p.editor.cm;
      l.isShown() ||
        l.onNodeInserted(function () {
          return d.focus();
        }, !0);
      n &&
        d.dispatch({
          annotations: i ? [] : [ER.of(!0)],
          selection: n(d),
        });
      this.selectionHead || h.scrollIntoView();
      this.updateCellReadonly();
      return p;
    };
    t.prototype.setAlignment = function (e, t) {
      for (var n = this.alignments, i = 0, r = e; i < r.length; i++) {
        var o = r[i];
        if (!(o < 0 || o >= n.length)) {
          var a = getComputedStyle(this.tableEl).direction === "rtl",
            s = null;
          t === "start"
            ? (s = a ? "right" : "left")
            : t === "end"
              ? (s = a ? "left" : "right")
              : t === "center" && (s = "center");
          n[o] = s;
          for (var l = 0, c = this.rows; l < c.length; l++) {
            c[l][o].el.setAttr("align", s);
          }
        }
      }
      this.dispatchTable();
    };
    t.prototype.insertRow = function (e, t, n) {
      var i = this.rows;
      e = Math.clamp(e, 0, i.length);
      for (var r = n ? i[e] : null, o = [], a = 0, s = this.alignments.length; a < s; a++) {
        var l = r ? r[a] : null;
        o.push(
          new CR(
            this,
            e,
            a,
            l == null ? undefined : l.text,
            l == null ? undefined : l.padStart,
            l == null ? undefined : l.padEnd,
          ),
        );
      }
      i.splice(e, 0, o);
      this.dispatchTable(n ? e + 1 : e, t);
    };
    t.prototype.moveRow = function (e, t, n) {
      var i = this.rows;
      if (!(t >= i.length || t < 0)) {
        nc(i, e, t);
        this.dispatchTable(t, n);
      }
    };
    t.prototype.removeRow = function (e, t) {
      var n = this.rows;
      if (!(e < 0 || e >= n.length)) {
        n.splice(e, 1);
        this.cleanupChildren();
        this.dispatchTable(e - 1, t);
      }
    };
    t.prototype.insertColumn = function (e, t, n, i) {
      var r = this,
        o = r.rows,
        a = r.colWidths,
        s = r.alignments;
      if (!(t < 0 || t > s.length)) {
        s.splice(t, 0, n);
        a.splice(t, 0, i ? a[t] : 5);
        for (var l = 0; l < o.length; l++) {
          var c = o[l],
            u = i ? c[t] : null;
          c.splice(
            t,
            0,
            new CR(
              this,
              l,
              t,
              u == null ? undefined : u.text,
              u == null ? undefined : u.padStart,
              u == null ? undefined : u.padEnd,
            ),
          );
        }
        this.dispatchTable(e, i ? t + 1 : t);
      }
    };
    t.prototype.moveColumn = function (e, t, n) {
      var i = this,
        r = i.rows,
        o = i.alignments,
        a = i.colWidths;
      if (!(t >= o.length || t < 0)) {
        nc(o, e, t);
        nc(a, e, t);
        for (var s = 0, l = r; s < l.length; s++) {
          nc(l[s], e, t);
        }
        this.dispatchTable(n, t);
      }
    };
    t.prototype.removeColumn = function (e, t) {
      var n = this.alignments,
        i = this.colWidths;
      if (!(t < 0 || t >= n.length)) {
        if ((n.splice(t, 1), i.splice(t, 1), n.length === 0)) {
          var r = this,
            from = r.start,
            a = r.end,
            s = r.editor.cm;
          s.dispatch({
            changes: [
              {
                from: from,
                to: a,
                insert: "",
              },
            ],
            selection: {
              anchor: from,
              head: from,
            },
          });
          return void s.focus();
        }
        for (var l = 0, c = this.rows; l < c.length; l++) {
          c[l].splice(t, 1);
        }
        this.cleanupChildren();
        this.dispatchTable(e, t - 1);
      }
    };
    t.prototype.sortByColumn = function (e, t, n) {
      var i = this.rows,
        r = i[0],
        o = i.slice(1).sort(function (e, i) {
          return n(e[t], i[t]);
        });
      this.rows = __spreadArray([r], o, !0);
      this.dispatchTable(e, t);
    };
    t.prototype.addNewLine = function (e) {
      var t = this.editor.cm;
      e === "before"
        ? t.dispatch({
            changes: [
              {
                from: this.start,
                insert: "\n",
              },
            ],
            selection: EditorSelection.cursor(this.start),
            annotations: [ER.of(!0)],
            scrollIntoView: true,
          })
        : t.dispatch({
            annotations: [ER.of(!0)],
            changes: [
              {
                from: this.end,
                insert: "\n",
              },
            ],
            selection: EditorSelection.cursor(this.end + 1),
            scrollIntoView: true,
          });
      t.focus();
    };
    t.prototype.getCellAt = function (e, t) {
      var n = this.rows[e];
      if (!n) return null;
      var i = n[t];
      return i || null;
    };
    t.prototype.getNextCell = function (e, t) {
      var n = e.row,
        i = e.col;
      if (t === "end") {
        var r = this.rows[n];
        return i === r.length - 1 ? (n === this.rows.length - 1 ? null : this.rows[n + 1].first()) : r[i + 1];
      }
      return i === 0 && n === 0 ? null : i === 0 ? this.rows[n - 1].last() : this.rows[n][i - 1];
    };
    t.prototype.getCellAbove = function (e) {
      var t = e.row,
        n = e.col;
      return this.getCellAt(t - 1, n);
    };
    t.prototype.getCellBelow = function (e) {
      var t = e.row,
        n = e.col;
      return this.getCellAt(t + 1, n);
    };
    t.prototype.placeCursorAround = function (e) {
      var t,
        n = this.editor.cm,
        i = n.state.doc;
      e === "before" ? (t = i.lineAt(this.start).number - 1) : (t = i.lineAt(this.end).number + 1);
      t < 1
        ? this.addNewLine("before")
        : t > i.lines
          ? this.addNewLine("after")
          : (n.dispatch({
              selection: EditorSelection.cursor(i.line(t).from),
            }),
            n.focus());
    };
    t.prototype.placeCursorInCell = function (e, t) {
      this.setCellFocus(e.row, e.col, function (e) {
        var n = e.state.doc,
          i = 0;
        if (t === "end") i = n.length;
        else if (t === "last-line") {
          var r = n.length;
          i = e.moveToLineBoundary(EditorSelection.range(r, r), !1, !0).from;
        }
        return EditorSelection.single(i, i);
      });
    };
    t.prototype.getClosestCell = function (e, t) {
      for (var n = this.rows, i = n[0], r = 1 / 0, o = 0, a = n; o < a.length; o++) {
        var s = a[o];
        if ((p = s.first().el.getBoundingClientRect()).top <= t && t <= p.bottom) {
          r = 0;
          i = s;
          break;
        }
        if ((d = Math.min(Math.abs(p.bottom - t), Math.abs(p.top - t))) > r) break;
        i = s;
        r = d;
      }
      for (var l = i[0], c = 1 / 0, u = 0, h = i; u < h.length; u++) {
        var p,
          d,
          f = h[u];
        if ((p = f.el.getBoundingClientRect()).left <= e && e <= p.right) {
          c = 0;
          l = f;
          break;
        }
        if ((d = Math.min(Math.abs(p.left - e), Math.abs(p.right - e))) > c) break;
        l = f;
        c = d;
      }
      return l;
    };
    t.prototype.toDOM = function () {
      var e = this,
        t = this,
        n = t.containerEl,
        i = t.editor,
        r = t.isDocComplete;
      t.tableEl ||
        (r
          ? this.render()
          : n.onNodeInserted(function () {
              if (!(e.isDocComplete || e.tableEl)) {
                n.addClass("is-loading");
                n.style.height = "".concat(1.1 * i.containerEl.clientHeight, "px");
              }
            }, !0));
      return n;
    };
    t.prototype.initDOM = function () {
      return this.containerEl;
    };
    t.prototype.render = function () {
      var e = this,
        t = this,
        n = t.doc,
        i = t.containerEl,
        r = t.rows;
      this.clear();
      var o,
        a = parseMetadata(n.toString());
      if (
        (visit(a, "table", function (e) {
          o = e;
          return visit.EXIT;
        }),
        o)
      ) {
        var s = (this.alignments = o.align);
        if (s == null ? undefined : s.length) {
          var l = (this.colWidths = s.map(function () {
              return 5;
            })),
            c = sanitizeHTMLToDom(renderMarkdown(a));
          if (c == null ? undefined : c.firstChild.instanceOf(HTMLTableElement)) {
            var tableEl = c.firstChild;
            tableEl.addClass("table-editor");
            tableEl.tabIndex = -1;
            var h = [];
            h.push.apply(h, Array.from(tableEl.tHead.rows));
            for (var p = 0, d = Array.from(tableEl.tBodies); p < d.length; p++) {
              var f = d[p];
              h.push.apply(h, Array.from(f.rows));
            }
            var m = s.length,
              g = m,
              isMalformed = false;
            visit(o, "tableRow", function (t) {
              var i = [],
                o = r.length,
                a = h[o],
                c = true;
              visit(t, "tableCell", function (t) {
                var r = t.position,
                  u = t.padding,
                  h = r.start,
                  p = r.end,
                  d = i.length,
                  f = a.cells[d],
                  g = n.sliceString(h.offset + u.start, p.offset - u.end);
                f || ((isMalformed = true), (f = a.insertCell(d)));
                !c || (g && /^\s*:?\s*-+\s*:?\s*$/.test(g)) || (c = false);
                var y = new CR(e, o, d, g, u.start, u.end);
                if (
                  (y.init(f, h.offset, p.offset),
                  i.push(y),
                  e.postProcess(y),
                  o === 0 && e.createDragHandle(y, "col"),
                  d === 0 && e.createDragHandle(y, "row"),
                  d >= m)
                ) {
                  isMalformed = true;
                  for (var b = m; b <= d; b++) {
                    s[b] = null;
                    l[b] = 5;
                  }
                  m = s.length;
                }
                l[d] = Math.max(l[d], g.length + 2);
              });
              c ? (isMalformed = true) : r.push(i);
            });
            for (var y = 0, b = r.length; y < b; y++) {
              var w = (E = r[y]).length;
              if (w < m) {
                isMalformed = true;
                (S = tableEl.rows[y]) || (S = tableEl.insertRow(y));
                for (var k = w; k < m; k++) {
                  (M = S.cells[k]) || (M = S.insertCell(k));
                  (P = new CR(this, y, k)).init(M, -1, -1);
                  E[k] = P;
                }
              }
            }
            var C = n.line(n.lines).text;
            if (/^\|[^\|]*$/.test(C) || (g !== m && /^\|(?:\s*:?\s*-+\s*:?\s*\|)+$/.test(C))) {
              isMalformed = true;
              var E = [],
                S = ((y = r.length), tableEl.insertRow(y));
              r.push(E);
              for (k = 0; k < m; k++) {
                var M = S.insertCell();
                (P = new CR(this, y, k)).init(M, -1, -1);
                E[k] = P;
              }
            }
            if (!isMalformed) {
              var x = 0;
              e: for (b = l.length; x < b; x++)
                for (var T = l[x], D = 0, A = r; D < A.length; D++) {
                  var P;
                  if ((P = (E = A[D])[x]).end - P.start !== T) {
                    isMalformed = true;
                    break e;
                  }
                }
            }
            i.createDiv("table-wrapper", function (t) {
              t.append(tableEl);
              t.createDiv("table-row-btn", function (t) {
                setIcon(t, "lucide-plus");
                setTooltip(t, i18nProxy.table.actionRowAfter());
                t.addEventListener("pointerdown", function (e) {
                  return e.preventDefault();
                });
                t.addEventListener("click", function () {
                  return e.insertRow(e.rows.length, 0);
                });
              });
              t.createDiv("table-col-btn", function (t) {
                setIcon(t, "lucide-plus");
                setTooltip(t, i18nProxy.table.actionColumnAfter());
                t.addEventListener("pointerdown", function (e) {
                  return e.preventDefault();
                });
                t.addEventListener("click", function () {
                  return e.insertColumn(0, e.alignments.length, null);
                });
              });
            });
            i.removeClass("is-loading");
            i.removeAttribute("style");
            i.addEventListener("click", function (t) {
              if (t.target === i) {
                e.placeCursorAround("after");
              }
            });
            this.isMalformed = isMalformed;
            this.tableEl = tableEl;
            var L = this.selectionAnchor,
              I = this.selectionHead;
            if (L && I) {
              L = this.getCellAt(L.row, L.col);
              I = this.getCellAt(I.row, I.col);
              L && I ? this.selectCells(L, I) : this.deselectCells();
            }
          }
        }
      }
    };
    t.prototype.createDragHandle = function (e, t) {
      var n = this,
        i = e.row,
        r = e.col,
        o = e.el,
        a = this.editor,
        s = this.containerEl,
        l = t === "col",
        c = l ? s : a.cm.scrollDOM;
      o.createDiv("table-".concat(t, "-drag-handle"), function (o) {
        setIcon(o, "lucide-grip-".concat(l ? "horizontal" : "vertical"));
        o.dataset.ignoreSwipe = "true";
        o.addEventListener("contextmenu", function (t) {
          var i = Menu.forEvent(t);
          l ? (n.makeSortMenu(i, e), n.makeColMenu(i, e)) : n.makeRowMenu(i, e);
          i.showAtMouseEvent(t);
          i.onHide(function () {
            return n.deselectCells();
          });
        });
        o.addEventListener("pointerdown", function (e) {
          if (e.isPrimary && e.button === 0) {
            var a = n.tableEl;
            e.preventDefault();
            s.addClass("is-dragging");
            l
              ? (n.receiveCellFocus(0, r), n.selectCells(n.getCellAt(0, r), n.getCellAt(n.rows.length - 1, r), !0))
              : (n.receiveCellFocus(i, 0),
                n.selectCells(n.getCellAt(i, 0), n.getCellAt(i, n.alignments.length - 1), !0));
            var u = o.getBoundingClientRect(),
              h = a.getBoundingClientRect(),
              p = a.parentElement,
              d = parseInt(getComputedStyle(o).getPropertyValue("--table-border-width"));
            if (isNaN(d)) {
              d = 0;
            }
            var f,
              m,
              g = l ? a.rows[0].cells : a.rows,
              v = (function (e, t) {
                for (var n = [], index = 0, r = t.length; index < r; index++) {
                  var o = t[index].getBoundingClientRect();
                  n.push({
                    index: index,
                    left: o.left - e.left,
                    top: o.top - e.top,
                    right: o.right - e.left,
                    bottom: o.bottom - e.top,
                  });
                }
                return n;
              })(h, Array.from(g)),
              y = function (e) {
                return {
                  min: e[l ? "left" : "top"],
                  max: e[l ? "right" : "bottom"],
                };
              },
              b = function (e) {
                return l ? e.x : e.y;
              },
              w = function () {
                return l ? c.scrollLeft : c.scrollTop;
              },
              k = y(h),
              C = y(u),
              E = l ? o.offsetLeft : o.offsetTop,
              S = w(),
              M = Ll(e),
              x = M,
              T = (C.min + C.max) / 2 - k.min,
              D = k.min - C.min + d,
              A = k.max - C.max - d,
              P = null,
              L = 0,
              I = s.dir === "rtl",
              O = e.win,
              F = function (e) {
                P = O.requestAnimationFrame(F);
                var n = e - L;
                L === 0 && (n = 50);
                L = e;
                autoScrollOnDrag(c, x, n);
                var a = S - w(),
                  u = b(x) - b(M) - a,
                  d = Math.clamp(T + u, 0, k.max - k.min),
                  g = "".concat(Math.clamp(E + u, D, A), "px");
                o.style[l ? "left" : "top"] = g;
                for (var C = 0, N = v; C < N.length; C++) {
                  var R = N[C],
                    B = y(R);
                  if (d >= B.min && d <= B.max) {
                    f = R;
                    m || (m = s.createDiv("table-drag-target mod-" + t));
                    var V = I ? R.right : R.left,
                      H = I ? R.left : R.right,
                      z = l
                        ? {
                            display: R.index === r ? "none" : "block",
                            left: "".concat((R.index < r ? V : H) + p.offsetLeft, "px"),
                            top: "".concat(p.offsetTop, "px"),
                            height: "".concat(h.height, "px"),
                          }
                        : {
                            display: R.index === i ? "none" : "block",
                            left: "".concat(p.offsetLeft, "px"),
                            top: "".concat((R.index < i ? R.top : R.bottom) + p.offsetTop, "px"),
                            width: "".concat(h.width, "px"),
                          };
                    return void m.setCssStyles(z);
                  }
                }
              };
            P = O.requestAnimationFrame(F);
            setupPointerDragHandler(
              e,
              function () {
                return {
                  move: function (e) {
                    x = Ll(e);
                  },
                  end: function () {
                    if (f)
                      if (l) {
                        if ((r !== f.index && n.moveColumn(r, f.index, 0), e.pointerType === "mouse")) {
                          var t = n.rows.first()[f.index],
                            o = n.rows.last()[f.index];
                          n.selectCells(t, o);
                        } else n.deselectCells();
                      } else if ((i !== f.index && n.moveRow(i, f.index, 0), e.pointerType === "mouse")) {
                        t = n.rows[f.index].first();
                        o = n.rows[f.index].last();
                        n.selectCells(t, o);
                      } else n.deselectCells();
                  },
                  cleanup: function () {
                    O.cancelAnimationFrame(P);
                    o.style.left = "";
                    o.style.top = "";
                    m == null || m.detach();
                    m = null;
                    s.removeClass("is-dragging");
                  },
                };
              },
              0,
            );
          }
        });
      });
    };
    t.prototype.setActiveDragHandles = function (e) {
      var t, n;
      (t = this.getCellAt(e.row, 0)) === null || undefined === t || t.el.addClass("mod-active-row-handle");
      (n = this.getCellAt(0, e.col)) === null || undefined === n || n.el.addClass("mod-active-col-handle");
    };
    t.prototype.unsetActiveDragHandles = function (e) {
      var t, n;
      (t = this.getCellAt(e.row, 0)) === null || undefined === t || t.el.removeClass("mod-active-row-handle");
      (n = this.getCellAt(0, e.col)) === null || undefined === n || n.el.removeClass("mod-active-col-handle");
    };
    t.prototype.getSelectionBounds = function () {
      var e = this.selectionAnchor,
        t = this.selectionHead;
      return e && t
        ? this.validateSelectionBounds({
            minRow: Math.min(e.row, t.row),
            maxRow: Math.max(e.row, t.row),
            minCol: Math.min(e.col, t.col),
            maxCol: Math.max(e.col, t.col),
          })
        : null;
    };
    t.prototype.validateSelectionBounds = function (e) {
      var t = this.alignments,
        n = this.rows,
        minCol = e.minCol,
        maxCol = e.maxCol,
        minRow = e.minRow,
        maxRow = e.maxRow;
      minCol < 0 && (minCol = 0);
      maxCol >= t.length && (maxCol = t.length - 1);
      minRow < 0 && (minRow = 0);
      maxRow >= n.length && (maxRow = n.length - 1);
      return {
        minRow: minRow,
        maxRow: maxRow,
        minCol: minCol,
        maxCol: maxCol,
      };
    };
    t.prototype.selectTable = function () {
      this.containerEl.addClass("is-selected");
    };
    t.prototype.deselectTable = function () {
      this.containerEl.removeClass("is-selected");
    };
    t.prototype.selectCells = function (selectionAnchor, selectionHead, n) {
      if (
        (undefined === n && (n = false),
        (this.selectionAnchor !== selectionAnchor || this.selectionHead !== selectionHead || n) &&
          (this.deselectCells(), selectionAnchor !== selectionHead))
      ) {
        this.selectionAnchor = selectionAnchor;
        this.selectionHead = selectionHead;
        var i = this.getSelectionBounds();
        if (i) {
          for (
            var r = i.minRow, o = i.maxRow, a = i.minCol, s = i.maxCol, l = this.rows, selectedCells = [], u = r;
            u <= o;
            u++
          )
            for (var h = l[u], p = a; p <= s; p++) {
              var d = h[p],
                f = ["is-selected"];
              n && f.push("mod-dragging");
              p === a && f.push("start");
              p === s && f.push("end");
              u === r && f.push("top");
              u === o && f.push("bottom");
              d.el.addClasses(f);
              selectedCells.push(d);
            }
          this.selectedCells = selectedCells;
          this.containerEl.addClass("has-selection");
          this.updateCellReadonly();
        }
      }
    };
    t.prototype.deselectCells = function () {
      var e = this.selectedCells;
      if (e.length !== 0) {
        this.selectionAnchor = null;
        this.selectionHead = null;
        for (
          var t = ["mod-dragging", "is-selected", "start", "end", "top", "bottom"], n = 0, i = e;
          n < i.length;
          n++
        ) {
          i[n].el.removeClasses(t);
        }
        this.selectedCells = [];
        this.containerEl.removeClass("has-selection");
        this.updateCellReadonly();
      }
    };
    t.prototype.deleteSelection = function (e) {
      var t = this.getSelectionBounds();
      if (t) {
        var n = t.minRow,
          i = t.maxRow,
          r = t.minCol,
          o = t.maxCol,
          a = this,
          s = a.alignments,
          l = a.colWidths,
          c = a.rows,
          u = a.selectionHead;
        if ((this.deselectCells(), r === 0 && o === s.length - 1)) {
          var h = this,
            from = h.start,
            d = h.end,
            f = h.editor.cm,
            m = c.length;
          if (n === 0 && i === m - 1) {
            f.dispatch({
              changes: [
                {
                  from: from,
                  to: d,
                  insert: "",
                },
              ],
              selection: {
                anchor: from,
              },
            });
            return void f.focus();
          }
          if ((c.splice(n, i - n + 1), this.cleanupChildren(), n > 0 && i < m - 1))
            return void this.dispatchTable(-1 === e ? n - 1 : n, u.col);
          var insert = this.rebuildTable();
          n === 0
            ? (insert = ChangeSet.of(
                [
                  {
                    from: 0,
                    insert: "\n",
                  },
                ],
                insert.length,
              ).apply(insert))
            : i === m - 1 &&
              (insert = ChangeSet.of(
                [
                  {
                    from: insert.length,
                    insert: "\n",
                  },
                ],
                insert.length,
              ).apply(insert));
          f.dispatch({
            selection: {
              anchor: n === 0 ? from : from + insert.length,
            },
            changes: [
              {
                from: from,
                to: d,
                insert: insert,
              },
            ],
            scrollIntoView: false,
          });
          return void f.focus();
        }
        if (n === 0 && i === c.length - 1) {
          var v = o - r + 1;
          s.splice(r, v);
          l.splice(r, v);
          for (var y = n; y <= i; y++) c[y].splice(r, v);
          this.cleanupChildren();
          return void this.dispatchTable(u.row, -1 === e ? r - 1 : r);
        }
        for (var b = n; b <= i; b++)
          for (var w = c[b], k = r; k <= o; k++) {
            var C = w[k];
            this.updateCell(C, "");
          }
        this.dispatchTable(-1 === e ? n : i, -1 === e ? r : o);
      }
    };
    t.prototype.copySelection = function (e, t) {
      var n = this.getSelectionBounds();
      if (!n) return !1;
      for (
        var i = this.getTableString(n),
          r = n.minRow,
          o = n.maxRow,
          a = n.minCol,
          s = n.maxCol,
          l = this.rows,
          rows = [],
          alignment = this.alignments.slice(a, s + 1),
          h = r;
        h <= o;
        h++
      ) {
        for (var p = l[h], d = [], f = a; f <= s; f++) {
          var m = p[f];
          d.push(m.text);
        }
        rows.push(d);
      }
      e.clipboardData.setData("text/plain", i);
      e.clipboardData.setData(
        "obsidian/table",
        JSON.stringify({
          rows: rows,
          alignment: alignment,
        }),
      );
      t && this.deleteSelection(-1);
      return !0;
    };
    t.prototype.pasteSelection = function (e) {
      var t,
        n,
        i = this.rows,
        r = this.alignments,
        o = this.getSelectionBounds();
      if (
        !(n = o
          ? this.getCellAt(o.minRow, o.minCol)
          : (t = this.editor.tableCell) === null || undefined === t
            ? undefined
            : t.cell)
      )
        return !1;
      var a,
        s,
        l = e.clipboardData.getData("obsidian/table");
      if (!l) return !1;
      try {
        var c = JSON.parse(l);
        a = c.rows;
        s = c.alignment;
      } catch (e) {
        return !1;
      }
      var u = n.col,
        h = n.row,
        p = u + s.length - 1,
        d = h + a.length - 1;
      if (n.row === 0) for (var f = u; f <= p; f++) r[f] = s[f - u];
      else {
        var m = r.length;
        for (f = m; f <= p; f++) r[f] = s[f - m];
      }
      for (var g = Math.max(d + 1, i.length), v = r.length, y = 0; y < g; y++) {
        if (((S = i[y]) || (i[y] = S = []), y < h || y > d)) {
          for (var b = 0; b < v; b++)
            if (!S[b]) {
              S[b] = new CR(this, y, b);
            }
        } else
          for (b = 0; b < v; b++)
            b >= u && b <= p ? (S[b] = new CR(this, y, b, a[y - h][b - u])) : S[b] || (S[b] = new CR(this, y, b));
      }
      var w = this.colWidths;
      for (f = u; f <= p; f++) {
        for (var k = 5, C = 0, E = i; C < E.length; C++) {
          var S = E[C];
          k = Math.max(k, S[f].text.length + 2);
        }
        if (k !== w[f]) {
          w[f] = k;
          for (var M = 0, x = i; M < x.length; M++) {
            (S = x[M])[f].updateWidth(k);
          }
        }
      }
      this.dispatchTable(d, p);
      return !0;
    };
    t.prototype.rerenderCell = function (e) {
      var t;
      if (e.dirty)
        if ((this.removeChildren(e), e.contentEl.empty(), e.text)) {
          var n = sanitizeHTMLToDom(renderMarkdown(parseMetadata("| ".concat(e.text, " |\n| - |")))).find("th"),
            i = (n == null ? undefined : n.childNodes.length) ? Array.from(n.childNodes) : [createEl("br")];
          (t = e.contentEl).append.apply(t, i);
          e.dirty = false;
          e.setTextDir();
          this.postProcess(e);
        } else e.contentEl.createEl("br");
    };
    t.prototype.removeChildren = function (e) {
      var t = this.cellChildMap;
      if (t.has(e)) {
        var n = t.get(e);
        t.delete(e);
        for (var i = 0, r = n; i < r.length; i++) {
          var o = r[i];
          this.removeChild(o);
        }
      }
    };
    t.prototype.cleanupChildren = function () {
      for (
        var e, t = this, n = t.cellChildMap, i = t.rows, r = t.editor, o = new Set(), a = 0, s = i;
        a < s.length;
        a++
      )
        for (var l = 0, c = s[a]; l < c.length; l++) {
          var u = c[l];
          o.add(u);
        }
      for (var h = 0, p = Array.from(n.keys()); h < p.length; h++) {
        u = p[h];
        if (!o.has(u)) {
          var d = n.get(u);
          n.delete(u);
          for (var f = 0, m = d; f < m.length; f++) {
            var g = m[f];
            this.removeChild(g);
          }
        }
      }
      if (
        !(((e = r.tableCell) === null || undefined === e ? undefined : e.table) !== this || o.has(r.tableCell.cell))
      ) {
        r.destroyTableCell();
      }
    };
    t.prototype.postProcess = function (e) {
      var t = this,
        n = this,
        i = n.app,
        r = n.cellChildMap,
        containerEl = n.containerEl,
        a = n.editor,
        s = e.contentEl;
      r.set(e, []);
      MarkdownPreviewView.postProcess(i, {
        docId: ic(16),
        sourcePath: a.path,
        frontmatter: undefined,
        promises: [],
        addChild: function (n) {
          if (r.has(e)) {
            r.get(e).push(n);
            t.addChild(n);
          }
        },
        getSectionInfo: function () {
          return null;
        },
        replace: function () {
          return null;
        },
        containerEl: containerEl,
        el: s,
        displayMode: false,
      });
      mR(i, s, a.path);
    };
    t.prototype.onContextMenu = function (e, t) {
      var n = this,
        i = this.editor.editor.cm,
        r = this.selectedCells;
      if (r.length > 0) {
        if (Platform.isDesktopApp) {
          var o = this.containerEl.win.electron;
          t.addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.cut())
              .setSection("clipboard")
              .setIcon("lucide-scissors")
              .onClick(function () {
                o.remote.getCurrentWebContents().cut();
              });
          });
          t.addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.copy())
              .setSection("clipboard")
              .setIcon("lucide-copy")
              .onClick(function () {
                o.remote.getCurrentWebContents().copy();
              });
          });
          t.addItem(function (e) {
            return e
              .setTitle(i18nProxy.interface.menu.paste())
              .setSection("clipboard")
              .setIcon("lucide-clipboard-check")
              .onClick(function () {
                o.remote.getCurrentWebContents().paste();
              });
          });
        }
        var a = r.first().getAbsoluteOffsets(),
          s = a.textStart,
          l = a.textEnd,
          c = EditorSelection.range(s, l),
          u = af(i.state, c);
        UO(t, this.editor.editor, u, "selection");
        var h = this.getSelectionBounds();
        if (h) {
          for (var p = h.minRow, d = h.maxRow, f = h.minCol, m = h.maxCol, g = [], v = f; v <= m; v++) g.push(v);
          this.makeAlignmentMenu(t, g);
          t.addItem(function (e) {
            return e
              .setSection("table")
              .setIcon("lucide-eraser")
              .setTitle(i18nProxy.table.actionClearSelection())
              .onClick(function () {
                for (var e = p; e <= d; e++) for (var t = n.rows[e], i = f; i <= m; i++) t[i].text = "";
                n.dispatchTable(p, f);
              });
          });
        }
        t.addItem(function (e) {
          return e
            .setSection("table")
            .setIcon("lucide-trash-2")
            .setTitle(i18nProxy.table.actionDeleteSelection())
            .onClick(function () {
              n.deleteSelection(-1);
            });
        });
      } else {
        t.addItem(function (t) {
          var i = t.setSection("table").setIcon("lucide-table").setTitle(i18nProxy.table.labelRow()).setSubmenu();
          n.makeRowMenu(i, e);
        });
        t.addItem(function (t) {
          var i = t.setSection("table").setIcon("lucide-table").setTitle(i18nProxy.table.labelColumn()).setSubmenu();
          n.makeColMenu(i, e);
        });
        this.makeSortMenu(t, e);
      }
    };
    t.prototype.makeColMenu = function (e, t) {
      var n = this;
      e.addItem(function (e) {
        return e
          .setSection("table-add")
          .setIcon("lucide-arrow-left")
          .setTitle(i18nProxy.table.actionColumnBefore())
          .onClick(function () {
            var e = n.alignments[t.col];
            n.insertColumn(t.row, t.col, e);
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-add")
          .setIcon("lucide-arrow-right")
          .setTitle(i18nProxy.table.actionColumnAfter())
          .onClick(function () {
            var e = n.alignments[t.col];
            n.insertColumn(t.row, t.col + 1, e);
          });
      });
      t.col < this.alignments.length - 1 &&
        e.addItem(function (e) {
          return e
            .setSection("table-move")
            .setIcon("lucide-arrow-right")
            .setTitle(i18nProxy.table.actionColumnRight())
            .onClick(function () {
              n.moveColumn(t.col, t.col + 1, t.row);
            });
        });
      t.col > 0 &&
        e.addItem(function (e) {
          return e
            .setSection("table-move")
            .setIcon("lucide-arrow-left")
            .setTitle(i18nProxy.table.actionColumnLeft())
            .onClick(function () {
              n.moveColumn(t.col, t.col - 1, t.row);
            });
        });
      this.makeAlignmentMenu(e, [t.col]);
      e.addItem(function (e) {
        return e
          .setSection("table-modify")
          .setIcon("lucide-copy")
          .setTitle(i18nProxy.table.actionDuplicateColumn())
          .onClick(function () {
            var e = n.alignments[t.col];
            n.insertColumn(t.row, t.col, e, !0);
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-modify")
          .setIcon("lucide-trash-2")
          .setTitle(i18nProxy.table.actionDeleteColumn())
          .onClick(function () {
            n.removeColumn(t.row, t.col);
          });
      });
    };
    t.prototype.makeAlignmentMenu = function (e, t) {
      var n = this;
      e.addItem(function (e) {
        return e
          .setSection("table-align")
          .setIcon("lucide-align-left")
          .setTitle(i18nProxy.table.actionAlignLeft())
          .onClick(function () {
            n.setAlignment(t, "start");
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-align")
          .setIcon("lucide-align-center")
          .setTitle(i18nProxy.table.actionAlignCenter())
          .onClick(function () {
            n.setAlignment(t, "center");
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-align")
          .setIcon("lucide-align-right")
          .setTitle(i18nProxy.table.actionAlignRight())
          .onClick(function () {
            n.setAlignment(t, "end");
          });
      });
    };
    t.prototype.makeRowMenu = function (e, t) {
      var n = this;
      e.addItem(function (e) {
        return e
          .setSection("table-add")
          .setIcon("lucide-arrow-up")
          .setTitle(i18nProxy.table.actionRowBefore())
          .onClick(function () {
            n.insertRow(t.row, t.col);
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-add")
          .setIcon("lucide-arrow-down")
          .setTitle(i18nProxy.table.actionRowAfter())
          .onClick(function () {
            n.insertRow(t.row + 1, t.col);
          });
      });
      t.row > 0 &&
        e.addItem(function (e) {
          return e
            .setSection("table-move")
            .setIcon("lucide-arrow-up")
            .setTitle(i18nProxy.table.actionRowUp())
            .onClick(function () {
              n.moveRow(t.row, t.row - 1, t.col);
            });
        });
      t.row !== this.rows.length - 1 &&
        e.addItem(function (e) {
          return e
            .setSection("table-move")
            .setIcon("lucide-arrow-down")
            .setTitle(i18nProxy.table.actionRowDown())
            .onClick(function () {
              n.moveRow(t.row, t.row + 1, t.col);
            });
        });
      e.addItem(function (e) {
        return e
          .setSection("table-modify")
          .setIcon("lucide-copy")
          .setTitle(i18nProxy.table.actionDuplicateRow())
          .onClick(function () {
            n.insertRow(t.row, t.col, !0);
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-modify")
          .setIcon("lucide-trash-2")
          .setTitle(i18nProxy.table.actionDeleteRow())
          .onClick(function () {
            n.removeRow(t.row, t.col);
          });
      });
    };
    t.prototype.makeSortMenu = function (e, t) {
      var n = this;
      e.addItem(function (e) {
        return e
          .setSection("table-sort")
          .setIcon("lucide-arrow-down-za")
          .setTitle(i18nProxy.table.actionSortAZ())
          .onClick(function () {
            var e = n.rows.map(function (e) {
              return e.map(function (e) {
                return e.contentEl.innerText;
              });
            });
            n.sortByColumn(t.row, t.col, function (t, n) {
              return Eb(e[t.row][t.col], e[n.row][n.col]);
            });
          });
      });
      e.addItem(function (e) {
        return e
          .setSection("table-sort")
          .setIcon("lucide-arrow-up-az")
          .setTitle(i18nProxy.table.actionSortZA())
          .onClick(function () {
            var e = n.rows.map(function (e) {
              return e.map(function (e) {
                return e.contentEl.innerText;
              });
            });
            n.sortByColumn(t.row, t.col, function (t, n) {
              return Eb(e[n.row][n.col], e[t.row][t.col]);
            });
          });
      });
    };
    Object.defineProperty(t.prototype, "estimatedHeight", {
      get: function () {
        var e = this.containerEl.offsetHeight;
        return e > 0 ? e : 50;
      },
      enumerable: false,
      configurable: true,
    });
    t.cellSanitizerPlugin = function (e) {
      return EditorState.changeFilter.of(function (t) {
        if (!e.tableCell || !t.docChanged || t.annotation(ER)) return !0;
        if (t.isUserEvent("set")) {
          e.destroyTableCell();
          return !0;
        }
        var n = e.tableCell.cell,
          i = n.getAbsoluteOffsets(),
          r = i.textStart,
          o = i.textEnd,
          a = false,
          s = [];
        if (
          (t.changes.iterChanges(function (e, t, n, i, insert) {
            if (!a) {
              e < r || t > o
                ? (a = true)
                : s.push({
                    from: e - r,
                    to: t - r,
                    insert: insert,
                  });
            }
          }),
          a)
        )
          return !0;
        var l = n.text,
          c = ChangeSet.of(s, l.length),
          u = t.startState.toText(l),
          h = Dm(l),
          p = Dm(c.apply(u).toString()),
          changes = c.map(h.changes),
          selection = Mm(t.newSelection, -r).map(p.changes),
          annotations = [],
          g = t.annotation(Transaction.userEvent);
        if (g) {
          annotations.push(Transaction.userEvent.of(g));
        }
        var v = e.tableCell.cm;
        v.dom.win.setTimeout(function () {
          v.dispatch({
            annotations: annotations,
            selection: selection,
            changes: changes,
          });
        });
        return [r - 1, o + 1];
      });
    };
    t.detectSurroundingClick = function (e) {
      return EditorView.domEventHandlers({
        pointerdown: function (n, i) {
          if (n.button === 0 || n.isPrimary) {
            var from = i.posAtCoords(
                {
                  x: n.clientX,
                  y: n.clientY,
                },
                !1,
              ),
              o = wb(i.state.doc) + 1,
              a = i.state.doc.length;
            if (!(from > o && from < a)) {
              i.state.field(e).between(from, from, function (e, n, o) {
                if (o.spec.widget instanceof t) {
                  i.dispatch({
                    changes: [
                      {
                        from: from,
                        insert: "\n",
                      },
                    ],
                    selection: EditorSelection.cursor(from === 0 ? 0 : from + 1),
                    annotations: [ER.of(!0)],
                  });
                  i.focus();
                  return !1;
                }
              });
            }
          }
        },
      });
    };
    return t;
  })(RO);
function MR(e, t) {
  return EditorState.transactionFilter.of(function (n) {
    if (!n.docChanged || e.tableCell || n.isUserEvent("set") || n.annotation(ER) || e.cm.composing) return n;
    var i = n.startState.field(t).update({
      filter: function (e, t, n) {
        return n.spec.widget instanceof SR;
      },
    });
    return i.size === 0
      ? n
      : n.isUserEvent("delete.backward")
        ? (function (e, t) {
            var changes = [],
              i = [],
              r = e.startState,
              o = r.doc,
              a = r.selection,
              s = false;
            e.changes.iterChanges(function (from, r, a, l, insert) {
              var u;
              a === l &&
                from + 1 === r &&
                insert.length === 0 &&
                t.between(from - 1, r + 1, function (t, i) {
                  if (i === from) {
                    var a = Platform.isAndroidApp && t > 0 ? t - 1 : t;
                    u = EditorSelection.range(r, a);
                    return !1;
                  }
                  if (t === r + 1 && o.lineAt(r - 1).text.trim() !== "") {
                    u = EditorSelection.cursor(from);
                    changes.push({
                      from: from,
                      to: r,
                      insert: "\n",
                    });
                    return !1;
                  }
                });
              u
                ? ((s = true), i.push(u))
                : (changes.push({
                    from: from,
                    to: r,
                    insert: insert,
                  }),
                  i.push(EditorSelection.cursor(from)));
            });
            return s
              ? {
                  changes: changes,
                  selection: EditorSelection.create(i, a.mainIndex),
                  annotations: [Transaction.userEvent.of("delete.backward"), ER.of(!0)],
                }
              : e;
          })(n, i)
        : (function (e, t) {
            var changes = [],
              i = e.newDoc,
              r = wb(e.newDoc);
            e.changes.iterChanges(function (o, a) {
              t.between(o, a + 1, function (t) {
                if (!(a > t) && o !== r) {
                  var from = e.changes.mapPos(t);
                  return from > 0 && i.lineAt(from - 1).text.trim() !== ""
                    ? (changes.push({
                        insert: "\n",
                        from: from,
                      }),
                      !1)
                    : undefined;
                }
              });
            });
            return changes.length
              ? [
                  e,
                  {
                    annotations: [ER.of(!0)],
                    changes: changes,
                    sequential: true,
                  },
                ]
              : e;
          })(n, i);
  });
}
function xR(e) {
  return (e.match(/>/g) || []).length;
}
function TR(e) {
  var t = 0,
    n = function () {
      for (; e.startsWith("\t"); ) {
        e = e.substring(1);
        t++;
      }
      for (; e.startsWith("    "); ) {
        e = e.substring(4);
        t++;
      }
    };
  e.startsWith(">") && ((e = e.substring(1)), n(), e.startsWith(" ") && (e = e.substring(1)));
  n();
  return t;
}
var DR = /^\s*(?:> |#{1,6} |([-_*])(\s*\1){2,}\s*$|~~~|```)/;
function AR(e) {
  return EditorState.transactionFilter.of(function (t) {
    if (
      !t.docChanged ||
      e.tableCell ||
      t.isUserEvent("set") ||
      t.isUserEvent("input.renumber") ||
      t.annotation(ER) ||
      e.cm.composing
    )
      return t;
    var n = t.newDoc,
      i = t.startState.doc,
      r = new Map();
    function o(e) {
      if (r.has(e)) return r.get(e);
      var t = Ab.exec(e);
      r.set(e, t);
      return t;
    }
    var changes = [],
      s = [],
      l = [];
    t.changes.iterChangedRanges(function (e, t, from, r) {
      l.push({
        from: from,
        to: r,
      });
      for (var o = n.lineAt(from), a = n.lineAt(r), c = o.number; c <= a.number + 1; c++) s.push(c);
    });
    s = ec(s).sort(Mb);
    for (
      var c = new Set(),
        u = function (e) {
          if (!c.has(e.number)) {
            c.add(e.number);
            var r = o(e.text);
            if (r && r[0] && r[4]) {
              var s = r[1],
                u = TR(s),
                h = xR(s),
                p = r[5],
                d = (function (e, t, n, i, r) {
                  for (var o = null, a = false, s = t - 1; s >= 1; s--) {
                    var l = e.line(s),
                      c = r(l.text),
                      u = xR(c[1]);
                    if (l.text && l.text !== c[1]) {
                      if (c && c[0]) {
                        if (c[2]) {
                          var h = TR(c[1]);
                          if (h === n && u === i) {
                            if (c[4]) {
                              o = parseInt(c[4], 10);
                            }
                            break;
                          }
                          if (h < n || u < i) break;
                        } else a = true;
                      } else {
                        if (i || DR.test(l.text)) break;
                        a = true;
                      }
                    } else if (i > u || a) break;
                  }
                  return o;
                })(n, e.number, u, h, o);
              if (d === null) {
                d = 1;
                for (var f = false, m = 0, g = l; m < g.length; m++) {
                  if (wm(g[m], e.from, e.to))
                    if (!(y = o((v = i.lineAt(t.changes.invertedDesc.mapPos(e.to))).text)) || y[2] !== r[2]) {
                      f = true;
                      break;
                    }
                }
                if (f) d = parseInt(r[4], 10);
                else {
                  var v,
                    y,
                    b = t.changes.invertedDesc.mapPos(e.to);
                  if ((y = o((v = i.lineAt(b)).text)) && TR(y[1]) === u) {
                    var w = xR(y[1]);
                    d = (function (e, t, n, i, r) {
                      for (var o = 1, a = false, s = t; s >= 1; s--) {
                        var l = e.line(s);
                        if (l.text) {
                          var c = r(l.text);
                          if (c && c[0]) {
                            if (c[2]) {
                              var u = TR(c[1]),
                                h = xR(c[1]);
                              if ((u === n && h === i && c[4] && (o = parseInt(c[4], 10)), u < n || h < i)) break;
                            } else a = true;
                          } else {
                            if (i || DR.test(l.text)) break;
                            a = true;
                          }
                        } else if (i || a) break;
                      }
                      return o;
                    })(i, v.number, u, w, o);
                  }
                }
              } else d++;
              if (String(d) !== r[4]) {
                changes.push({
                  insert: d + p,
                  from: e.from + s.length,
                  to: e.from + s.length + r[3].length,
                });
              }
              for (var k = false, C = e.number + 1; C <= n.lines && !c.has(C); C++) {
                var E = n.line(C);
                if (E.text) {
                  var S = o(E.text);
                  if (S && S[0]) {
                    var M = TR(S[1]),
                      x = xR(S[1]);
                    if (!S[1] || S[2]) {
                      if (M === u && x === h) {
                        if (!S[4]) break;
                        if ((d++, String(d) === S[4])) {
                          c.add(C);
                          break;
                        }
                        changes.push({
                          insert: d + S[5],
                          from: E.from + S[1].length,
                          to: E.from + S[1].length + S[3].length,
                        });
                        c.add(C);
                      }
                      if (M < u) break;
                    }
                  } else if (k || DR.test(E.text)) break;
                } else k = true;
              }
            }
          }
        },
        h = 0,
        p = s;
      h < p.length;
      h++
    ) {
      var d = p[h];
      if (d <= n.lines) {
        u(n.line(d));
      }
    }
    return changes.length
      ? [
          t,
          {
            changes: changes,
            sequential: true,
            userEvent: "input.renumber",
          },
        ]
      : t;
  });
}
function PR(e) {
  var t = Ab.exec(e);
  return t && t[0] ? t[0] : null;
}
function LR(e, from, n) {
  var i = false;
  e.iterate({
    from: from,
    to: n,
    enter: function (e) {
      var t = e.type,
        n = t.prop(lineClassNodeProp);
      if (n && n.contains("HyperMD-codeblock")) {
        i = true;
      }
      var r = t.prop(tokenClassNodeProp);
      if (r && r.contains("hmd-indented-code")) {
        i = true;
      }
    },
  });
  return i;
}
var IR = (function () {
    function e(view) {
      var t = this;
      this.decorations = Decoration.none;
      this.indentCache = new Map();
      this.markCache = new Map();
      this.requestUpdateDom = gc(this.updateDom.bind(this));
      this.view = view;
      this.observer = new MutationObserver(function (e) {
        return t.checkMutations(e);
      });
      this.observe();
      this.buildDeco(view);
    }
    e.prototype.destroy = function () {
      this.observer.disconnect();
    };
    e.prototype.update = function (t) {
      var n = this.indentCache;
      Sm(t.transactions, e.clearCache) && (n.clear(), this.markCache.clear());
      (t.docChanged ||
        t.viewportChanged ||
        t.geometryChanged ||
        t.selectionSet ||
        t.focusChanged ||
        this.tree !== syntaxTree(t.view.state)) &&
        (this.buildDeco(t.view), this.requestUpdateDom());
    };
    e.prototype.buildDeco = function (e) {
      var t = this.indentCache,
        n = e.defaultCharacterWidth,
        i = new RangeSetBuilder(),
        r = this.markCache,
        tree = syntaxTree(e.state);
      this.tree = tree;
      for (var a = 0, s = e.viewportLineBlocks; a < s.length; a++) {
        var l = s[a],
          c = e.state.doc.lineAt(l.from),
          u = c.number,
          texth0 = PR(c.text);
        if (texth0 && !LR(tree, c.from, c.from + texth0.length)) {
          var p = this.getCached(u, texth0);
          if (!p) {
            p = {
              text: texth0,
              size: Math.floor(countColumn(texth0, e.state.tabSize) * n),
              dirty: false,
            };
          }
          var d = p.size;
          if (d > 0) {
            var f = r.get(d);
            f ||
              ((f = Decoration.line({
                attributes: {
                  style: "text-indent:".concat(-d, "px;padding-inline-start:").concat(d, "px"),
                },
              })),
              r.set(d, f));
            i.add(c.from, c.from, f);
          }
        } else t.delete(u);
      }
      this.decorations = i.finish();
    };
    e.prototype.observe = function () {
      this.observer.observe(this.view.contentDOM, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    };
    e.prototype.checkMutations = function (e) {
      for (var t = this.view, n = t.contentDOM, i = new Set(), r = 0, o = e; r < o.length; r++) {
        for (var a = o[r].target; a.parentNode && a.parentNode !== n; ) a = a.parentNode;
        if (a && n.contains(a)) {
          i.add(a);
        }
      }
      for (var s = false, l = 0, c = Array.from(i); l < c.length; l++) {
        var u = c[l];
        if (u.instanceOf(HTMLElement) && u.hasClass("cm-line")) {
          var h = t.posAtDOM(u),
            p = t.state.doc.lineAt(h),
            d = this.indentCache.get(p.number);
          if (d) {
            d.dirty = true;
            s = true;
          }
        }
      }
      if (s) {
        this.requestUpdateDom();
      }
    };
    e.prototype.getCached = function (e, t) {
      var n = this.indentCache,
        i = n.get(e);
      if (i && i.text === t) return i;
      var r = n.get(e - 1);
      if (r && r.text === t) return r;
      var o = n.get(e + 1);
      return o && o.text === t ? o : i && i.text.length === t.length ? i : null;
    };
    e.prototype.updateDom = function () {
      var requestUpdateDom = this.requestUpdateDom,
        t = this.view.scrollDOM;
      this.view.coordsAtPos(0);
      var n = t.scrollTop;
      try {
        this.requestUpdateDom = function () {};
        Object.defineProperty(t, "scrollTop", {
          configurable: true,
          get: function () {
            return n;
          },
          set: function () {
            return 0;
          },
        });
        var i = this.observer.takeRecords();
        this.observer.disconnect();
        i.length > 0 && this.checkMutations(i);
        this.updateDomInternal();
      } finally {
        this.requestUpdateDom = requestUpdateDom;
        this.observe();
        delete t.scrollTop;
      }
    };
    e.prototype.updateDomInternal = function () {
      var e = this.view,
        t = this.indentCache,
        n = e.contentDOM;
      if (n.offsetParent) {
        for (var i = this.tree, r = [], o = 0, a = Array.from(n.childNodes); o < a.length; o++) {
          if (
            (lineEl = a[o]).instanceOf(HTMLElement) &&
            lineEl.hasClass("cm-line") &&
            lineEl.contentEditable !== "false"
          ) {
            var s = e.posAtDOM(lineEl),
              l = e.state.doc.lineAt(s);
            if (i.length < l.to) break;
            if ((textv0 = PR(l.text)) && !LR(i, l.from, l.from + textv0.length))
              if (!((b = t.get(l.number)) && b.text === textv0 && !b.dirty)) {
                r.push({
                  lineEl: lineEl,
                  pos: l.from,
                  line: l.number,
                  text: textv0,
                });
              }
          }
        }
        if (r.length !== 0) {
          for (var c = 0, u = r; c < u.length; c++) {
            (lineEl = u[c].lineEl).style.textIndent = "";
            lineEl.style.paddingInlineStart = "";
          }
          for (var h = [], p = false, d = 0, f = r; d < f.length; d++) {
            var m = f[d],
              lineEl = m.lineEl,
              textv0 = ((s = m.pos), (l = m.line), m.text),
              y = e.coordsAtPos(s + textv0.length, 1);
            if (y) {
              var b,
                w = e.textDirectionAt(s),
                size = 0,
                C = lineEl.getBoundingClientRect(),
                E = getComputedStyle(lineEl),
                S = 0;
              if (
                ((S = w === Direction.LTR ? C.left + parseFloat(E.borderLeft) : C.right - parseFloat(E.borderRight)),
                (size = Math.floor(Math.abs((w === Direction.LTR ? y.right : y.left) - S))) &&
                  size > lineEl.offsetWidth / 2)
              ) {
                if (!(y = e.coordsAtPos(s + textv0.length, -1))) continue;
                size = Math.floor(Math.abs((w === Direction.LTR ? y.right : y.left) - S));
              }
              if (size) {
                (b = t.get(l)) && b.size === size
                  ? ((b.text = textv0), (b.dirty = false))
                  : (t.set(l, {
                      text: textv0,
                      size: size,
                      dirty: !1,
                    }),
                    (p = true));
                h.push({
                  lineEl: lineEl,
                  size: size,
                });
              }
            }
          }
          for (var M = 0, x = h; M < x.length; M++) {
            var T = x[M];
            lineEl = T.lineEl;
            size = T.size;
            lineEl.style.textIndent = "".concat(-size, "px");
            lineEl.style.paddingInlineStart = "".concat(size, "px");
          }
          if (p) {
            this.buildDeco(this.view);
          }
        }
      }
    };
    e.clearCache = StateEffect.define();
    return e;
  })(),
  OR = ViewPlugin.define(
    function (e) {
      return new IR(e);
    },
    {
      decorations: function (e) {
        return e.decorations;
      },
    },
  );
var FR = (function () {
    function e(left, top, height, fontFamily, fontSize, fontWeight, color, className, letter) {
      this.left = left;
      this.top = top;
      this.height = height;
      this.fontFamily = fontFamily;
      this.fontSize = fontSize;
      this.fontWeight = fontWeight;
      this.color = color;
      this.className = className;
      this.letter = letter;
    }
    e.prototype.draw = function () {
      var e = document.createElement("div");
      e.className = this.className;
      this.adjust(e);
      return e;
    };
    e.prototype.adjust = function (e) {
      e.style.left = this.left + "px";
      e.style.top = this.top + "px";
      e.style.height = this.height + "px";
      e.style.lineHeight = this.height + "px";
      e.style.fontFamily = this.fontFamily;
      e.style.fontSize = this.fontSize;
      e.style.fontWeight = this.fontWeight;
      e.className = this.className;
      e.textContent = this.letter;
    };
    e.prototype.eq = function (e) {
      return (
        this.left == e.left &&
        this.top == e.top &&
        this.height == e.height &&
        this.className == e.className &&
        this.letter == e.letter
      );
    };
    return e;
  })(),
  NR = (function () {
    function e(view, t) {
      this.view = view;
      this.rangePieces = [];
      this.cursors = [];
      this.cm = t;
      this.measureReq = {
        read: this.readPos.bind(this),
        write: this.drawSel.bind(this),
      };
      this.cursorLayer = view.scrollDOM.appendChild(document.createElement("div"));
      this.cursorLayer.className = "cm-cursorLayer cm-vimCursorLayer";
      this.cursorLayer.setAttribute("aria-hidden", "true");
      view.requestMeasure(this.measureReq);
      this.setBlinkRate();
    }
    e.prototype.setBlinkRate = function () {
      var e = getDrawSelectionConfig(this.cm.cm6.state).cursorBlinkRate;
      this.cursorLayer.style.animationDuration = e + "ms";
    };
    e.prototype.update = function (e) {
      (e.selectionSet || e.geometryChanged || e.viewportChanged || Sm(e.transactions, EY)) &&
        (this.scheduleRedraw(),
        (this.cursorLayer.style.animationName =
          this.cursorLayer.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink"));
      (function (e) {
        return getDrawSelectionConfig(e.startState) != getDrawSelectionConfig(e.state);
      })(e) && this.setBlinkRate();
    };
    e.prototype.scheduleRedraw = function () {
      this.view.requestMeasure(this.measureReq);
    };
    e.prototype.readPos = function () {
      for (var e = this.view.state, cursors = [], n = 0, i = e.selection.ranges; n < i.length; n++) {
        var r = i[n],
          o = r == e.selection.main,
          a = BR(this.cm, this.view, r, o);
        if (a) {
          cursors.push(a);
        }
      }
      return {
        cursors: cursors,
      };
    };
    e.prototype.drawSel = function (e) {
      var t = this,
        cursors = e.cursors;
      if (
        cursors.length != this.cursors.length ||
        cursors.some(function (e, n) {
          return !e.eq(t.cursors[n]);
        })
      ) {
        var i = this.cursorLayer.children;
        if (i.length !== cursors.length) {
          this.cursorLayer.textContent = "";
          for (var r = 0, o = cursors; r < o.length; r++) {
            var a = o[r];
            this.cursorLayer.appendChild(a.draw());
          }
        } else
          cursors.forEach(function (e, t) {
            return e.adjust(i[t]);
          });
        this.cursors = cursors;
      }
    };
    e.prototype.destroy = function () {
      this.cursorLayer.remove();
    };
    return e;
  })(),
  RR = Prec.highest(
    EditorView.theme({
      ".cm-vimMode .cm-line": {
        caretColor: "transparent !important",
      },
      ".cm-fat-cursor": {
        position: "absolute",
        border: "none",
        whiteSpace: "pre",
      },
      "&.cm-focused > .cm-scroller > .cm-cursorLayer > .cm-fat-cursor": {
        background: "var(--interactive-accent)",
        color: "var(--text-on-accent)",
      },
      "&:not(.cm-focused) > .cm-scroller > .cm-cursorLayer > .cm-fat-cursor": {
        color: "transparent !important",
      },
    }),
  );
function BR(e, t, n, i) {
  var r,
    o,
    a = t.dom.ownerDocument.defaultView.HTMLElement,
    s = n.head,
    l = false,
    c = e.state.vim;
  if (c && (!c.insertMode || e.state.overwrite)) {
    if (((l = true), c.visualBlock && !i)) return null;
    if (n.anchor < n.head)
      if ((m = s < t.state.doc.length && t.state.sliceDoc(s, s + 1)) != "\n") {
        s--;
      }
  }
  if (l) {
    var u = t.coordsAtPos(s, 1);
    if (!u) return null;
    var h = (function (e) {
        var t = e.scrollDOM.getBoundingClientRect();
        return {
          left:
            (e.textDirection == Direction.LTR ? t.left : t.right - e.scrollDOM.clientWidth) - e.scrollDOM.scrollLeft,
          top: t.top - e.scrollDOM.scrollTop,
        };
      })(t),
      p = t.contentDOM,
      d = t.domAtPos(s);
    if (d) {
      p = d.node;
      var f = d.node.childNodes[d.offset];
      if (f) {
        for (; f instanceof a && f.firstChild instanceof a; ) f = f.firstChild;
        p = f;
      }
    }
    p = p.instanceOf(a) ? p : p.parentNode;
    var m,
      g = getComputedStyle(p);
    if ((m = s < t.state.doc.length && t.state.sliceDoc(s, s + 1)) && /[\uDC00-\uDFFF]/.test(m) && s > 1) {
      s--;
      m = t.state.sliceDoc(s, s + 1);
    }
    var v = u.left,
      y = (o = (r = t).coordsForChar) === null || undefined === o ? undefined : o.call(r, s);
    if ((y && (v = y.left), m && m != "\n" && m != "\r")) {
      if (m == "\t") {
        m = " ";
        var b = t.coordsAtPos(s + 1, -1);
        if (b) {
          v = b.left - (b.left - u.left) / parseInt(g.tabSize);
        }
      } else if (/[\uD800-\uDBFF]/.test(m) && s < t.state.doc.length - 1) {
        m += t.state.sliceDoc(s + 1, s + 2);
      }
    } else m = " ";
    var w = u.bottom - u.top;
    return new FR(
      v - h.left,
      u.top - h.top,
      w,
      g.fontFamily,
      g.fontSize,
      g.fontWeight,
      g.color,
      i ? "cm-fat-cursor cm-cursor-primary" : "cm-fat-cursor cm-cursor-secondary",
      m,
    );
  }
  return null;
}
var VR = function (e) {
  var t = e.state,
    n = e.dispatch;
  if (t.readOnly) return !1;
  var i = t.changeByRange(function (e) {
    var simulateBreak = e.from,
      i = e.to,
      r = t.doc.lineAt(simulateBreak),
      o =
        simulateBreak == i &&
        (function (e, from) {
          if (/\(\)|\[\]|\{\}/.test(e.sliceDoc(from - 1, from + 1)))
            return {
              from: from,
              to: from,
            };
          var n,
            i = syntaxTree(e).resolveInner(from),
            r = i.childBefore(from),
            o = i.childAfter(from);
          return r &&
            o &&
            r.to <= from &&
            o.from >= from &&
            (n = r.type.prop(NodeProp.closedBy)) &&
            n.indexOf(o.name) > -1 &&
            e.doc.lineAt(r.to).from == e.doc.lineAt(o.from).from &&
            !/\S/.test(e.sliceDoc(r.to, o.from))
            ? {
                from: r.to,
                to: o.from,
              }
            : null;
        })(t, simulateBreak);
    var a = new IndentContext(t, {
        simulateBreak: simulateBreak,
        simulateDoubleBreak: !!o,
      }),
      s = getIndentation(a, simulateBreak);
    for (
      s == null && (s = countColumn(/^\s*/.exec(t.doc.lineAt(simulateBreak).text)[0], t.tabSize));
      i < r.to && /\s/.test(r.text[i - r.from]);
    )
      i++;
    o
      ? ((simulateBreak = o.from), (i = o.to))
      : simulateBreak > r.from &&
        simulateBreak < r.from + 100 &&
        !/\S/.test(r.text.slice(0, simulateBreak)) &&
        (simulateBreak = r.from);
    var l = [indentString(t, s), ""];
    o && l.push(indentString(t, a.lineIndent(r.from, -1)));
    return {
      changes: {
        from: r.from,
        to: r.from,
        insert: Text.of(l),
      },
      range: EditorSelection.cursor(r.from + l[0].length),
    };
  });
  n(
    t.update(i, {
      scrollIntoView: true,
      userEvent: "input",
    }),
  );
  return !0;
};
function HR(e, t) {
  var n = t.ch,
    i = t.line + 1;
  if (i < 1) return 0;
  if (i > e.lines) return e.length;
  var r = e.line(i);
  return Math.min(r.from + Math.max(0, n), r.to);
}
function zR(e, t) {
  if (t < 0 || t > e.length) return null;
  var n = e.lineAt(t);
  return {
    line: n.number - 1,
    ch: t - n.from,
  };
}
var qR,
  Pos = function (line, t) {
    this.line = line;
    this.ch = t;
  };
function UR(e, t, n) {
  if (e.addEventListener) e.addEventListener(t, n, !1);
  else {
    var i = e._handlers || (e._handlers = {});
    i[t] = (i[t] || []).concat(n);
  }
}
function off(e, t, n) {
  if (e.removeEventListener) e.removeEventListener(t, n, !1);
  else {
    var i = e._handlers,
      r = i && i[t];
    if (r) {
      var o = r.indexOf(n);
      if (o > -1) {
        i[t] = r.slice(0, o).concat(r.slice(o + 1));
      }
    }
  }
}
function signal(e, t) {
  for (var n, i = [], r = 2; r < arguments.length; r++) i[r - 2] = arguments[r];
  var o = (n = e._handlers) === null || undefined === n ? undefined : n[t];
  if (o) for (var a = 0; a < o.length; ++a) o[a].apply(o, i);
}
function GR(e) {
  for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
  if (e) for (var i = 0; i < e.length; ++i) e[i].apply(e, t);
}
try {
  qR = new RegExp("[\\w\\p{Alphabetic}\\p{Number}_]", "u");
} catch (e) {
  qR = /[\w]/;
}
function KR(e, t) {
  var n = e.cm6;
  if (!n.state.readOnly) {
    var value = "input.type.compose";
    if (
      (e.curOp && (e.curOp.lastChange || (value = "input.type.compose.start")),
      t.annotations && Array.isArray(t.annotations))
    )
      try {
        t.annotations.some(function (e) {
          if (e.value == "input") {
            e.value = value;
          }
        });
      } catch (e) {
        console.error(e);
      }
    else t.userEvent = value;
    return n.dispatch(t);
  }
}
function YR(e, t) {
  var n;
  e.curOp && (e.curOp.$changeStart = undefined);
  (t ? undo : redo)(e.cm6);
  var anchor = (n = e.curOp) === null || undefined === n ? undefined : n.$changeStart;
  if (anchor != null) {
    e.cm6.dispatch({
      selection: {
        anchor: anchor,
      },
    });
  }
}
var keys = {};
"Left|Right|Up|Down|Backspace|Delete".split("|").forEach(function (e) {
  keys[e] = function (t) {
    return runScopeHandlers(
      t.cm6,
      {
        key: e,
      },
      "editor",
    );
  };
});