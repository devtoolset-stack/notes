var EditorSuggest = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.instructionsEl = createDiv("prompt-instructions");
      n.context = null;
      n.limit = 100;
      n.suggestEl.addEventListener("mousedown", function (e) {
        return e.preventDefault();
      });
      return n;
    }
    __extends(t, e);
    t.prototype.setInstructions = function (e) {
      e.length > 0
        ? (Ix(this.instructionsEl, e), this.suggestEl.appendChild(this.instructionsEl))
        : this.instructionsEl.detach();
    };
    t.prototype.trigger = function (editor, filet0, n) {
      var i = this,
        r = editor.getCursor("from"),
        o = editor.getCursor("to");
      if (r.line !== o.line || r.ch !== o.ch) {
        this.context = null;
        return !1;
      }
      var a = this.onTrigger(r, editor, filet0);
      if (a) {
        var s = (this.context = {
          editor: editor,
          file: filet0,
          start: a.start,
          end: a.end,
          query: a.query,
        });
        if (n || this.isOpen) {
          var l = this.getSuggestions(s);
          if (Array.isArray(l)) this.showSuggestions(l);
          else {
            if (!l) return;
            __awaiter(i, undefined, undefined, function () {
              var t;
              return __generator(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, l];
                  case 1:
                    t = n.sent();
                    return editor.hasFocus() ? (t && this.showSuggestions(t), [2]) : (this.close(), [2]);
                }
              });
            });
          }
        }
        return !0;
      }
      this.context = null;
      return !1;
    };
    t.prototype.showSuggestions = function (e) {
      if (e.length !== 0) {
        var t = this.limit;
        t > 0 && e.length > t && (e = e.slice(0, t));
        this.suggestions.setSuggestions(e);
        this.updatePosition(!0);
      } else this.close();
    };
    t.prototype.updatePosition = function (e) {
      var t = this.context;
      if (t) {
        var n = t.editor,
          i = n.coordsAtPos(t.start),
          r = n.coordsAtPos(t.end);
        if (i && r) {
          var o = transformRectToTopWindow(
            {
              top: i.top,
              left: Math.min(i.left, r.left),
              right: Math.max(i.right, r.right),
              bottom: r.bottom,
            },
            n.containerEl.win,
          ).rect;
          this.open();
          this.reposition(o, Mx(n.getLine(t.start.line)));
        }
      }
    };
    t.prototype.close = function () {
      this.context = null;
      e.prototype.close.call(this);
    };
    return t;
  })(PopoverSuggest),
  Fx = function (e, t) {
    return e[0] - t[0];
  };
function Nx(e) {
  if (e.length === 0) return e;
  e.sort(Fx);
  for (var t = [e[0]], n = 1; n < e.length; n++) {
    var i = t.last();
    i[1] < e[n][0] ? t.push(e[n]) : i[1] < e[n][1] && (i[1] = e[n][1]);
  }
  return t;
}
var Rx = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/,
  Bx = /\s/,
  Vx = /[\u0F00-\u0FFF\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
function prepareQuery(query) {
  for (var t = query.toLowerCase(), tokens = [], i = 0, r = 0; r < t.length; r++) {
    var o = t.charAt(r);
    Bx.test(o)
      ? (i !== r && tokens.push(t.substring(i, r)), (i = r + 1))
      : (Rx.test(o) || Vx.test(o)) && (i !== r && tokens.push(t.substring(i, r)), tokens.push(o), (i = r + 1));
  }
  i !== t.length && tokens.push(t.substring(i, t.length));
  return {
    query: query,
    tokens: tokens,
    fuzzy: t.split(""),
  };
}
function prepareFuzzySearch(e) {
  var t = prepareQuery(e);
  return function (e) {
    return fuzzySearch(t, e);
  };
}
function qx(e, t, n, i) {
  if (e.length === 0) return 0;
  var r = 0;
  r -= Math.max(0, e.length - 1);
  r -= i / 10;
  var o = e[0][0];
  r -= (e[e.length - 1][1] - o + 1 - t) / 100;
  r -= o / 1e3;
  return (r -= n / 1e4);
}
function Wx(e, t, n, i) {
  if (e.length === 0) return null;
  for (var r = n.toLowerCase(), o = 0, a = 0, matches = [], l = 0; l < e.length; l++) {
    var c = e[l],
      u = r.indexOf(c, a);
    if (-1 === u) return null;
    var h = n.charAt(u);
    if (u > 0 && !Rx.test(h) && !Vx.test(h)) {
      var p = n.charAt(u - 1);
      if (
        (h.toLowerCase() !== h && p.toLowerCase() !== p) ||
        (h.toUpperCase() !== h && !Rx.test(p) && !Bx.test(p) && !Vx.test(p))
      )
        if (i) {
          if (u !== a) {
            a += c.length;
            l--;
            continue;
          }
        } else o += 1;
    }
    if (matches.length === 0) matches.push([u, u + c.length]);
    else {
      var d = matches[matches.length - 1];
      d[1] < u ? matches.push([u, u + c.length]) : (d[1] = u + c.length);
    }
    a = u + c.length;
  }
  return {
    matches: matches,
    score: qx(matches, t.length, r.length, o),
  };
}
function fuzzySearch(e, t) {
  if (e.query === "")
    return {
      score: 0,
      matches: [],
    };
  var n = Wx(e.tokens, e.query, t, !1);
  return n || Wx(e.fuzzy, e.query, t, !0);
}
function sortSearchResults(e) {
  e.sort(function (e, t) {
    return t.match.score - e.match.score;
  });
}
function jx(e, t) {
  if (e)
    for (var n = 0, i = e; n < i.length; n++) {
      var r = i[n];
      r[0] += t;
      r[1] += t;
    }
}
function Gx(e, t) {
  for (var n = t.toLowerCase(), i = [], r = 0, o = e; r < o.length; r++) {
    var a = o[r];
    if (a) {
      for (var s = false, l = -1, c = a.length; -1 !== (l = n.indexOf(a, l)); ) {
        s = true;
        i.push([l, l + c]);
        l += c + 1;
      }
      if (!s) return null;
    }
  }
  return Nx(i);
}
function Kx(e, t, n) {
  var matches = Gx(e, n);
  return matches
    ? {
        score: qx(matches, t.length, n.length, 0),
        matches: matches,
      }
    : null;
}
function prepareSimpleSearch(e) {
  var t = e.toLowerCase().split(" ");
  return function (n) {
    return Kx(t, e, n);
  };
}
function renderResults(e, t, n, i) {
  undefined === i && (i = 0);
  renderMatches(e, t, n ? n.matches : null, i);
}
function renderMatches(e, t, n, i) {
  undefined === i && (i = 0);
  e.appendChild(
    (function (e, t, n) {
      if (undefined === n) {
        n = 0;
      }
      if (!t || t.length === 0) return document.createTextNode(e);
      for (var i = document.createDocumentFragment(), r = 0, o = 0; r < e.length && o < t.length; o++) {
        var a = t[o],
          s = a[0] + n,
          l = a[1] + n;
        if (!(l <= 0)) {
          if (s >= e.length) break;
          s < 0 && (s = 0);
          s !== r && i.appendText(e.substring(r, s));
          i.createSpan({
            cls: "suggestion-highlight",
            text: e.substring(s, l),
          });
          r = l;
        }
      }
      if (r < e.length) {
        i.appendText(e.substring(r));
      }
      return i;
    })(t, n, i),
  );
}
function Qx(e, t, n) {
  if (undefined === n) {
    n = 100;
  }
  for (var i = t[0] - 1, r = 0; r < n && i >= 0; ) {
    if (e.charAt(i) === "\n") break;
    i--;
    r++;
  }
  i++;
  for (var o = r === n, a = t[1], s = 0; s < n && a < e.length; ) {
    if (e.charAt(a) === "\n") break;
    a++;
    s++;
  }
  return [i, a, o, s === n];
}
function $x(e, t) {
  if (t && t.length > 0) {
    var n = t.last()[1],
      i = e.indexOf("/", n);
    if (-1 !== i) return e.slice(0, i + 1);
  }
  return e;
}
function Jx(e) {
  var t,
    path = "",
    subpath = "";
  e.type === "block" && ((path = e.file.path), (subpath = "#^" + e.node.id));
  e.type === "heading" && ((path = e.file.path), (subpath = "#" + stripHeadingForLink(e.heading)));
  (e.type !== "file" && e.type !== "alias") || ((path = e.file.path), (subpath = ""));
  e.type === "linktext" && ((path = (t = parseLinktext(e.path)).path), (subpath = t.subpath));
  return {
    path: path,
    subpath: subpath,
  };
}
var eT = function (e, t) {
    return t.score - e.score;
  },
  tT = {
    type: "none",
    matches: null,
    score: 0,
  };
function nT(e) {
  return e ? -(e.length + (e.length > 0 ? e[0][0] / 10 : 0)) : 0;
}
function iT(e, filet0, n, path, r) {
  return __awaiter(this, undefined, Promise, function () {
    var o, a, s, l, c, u, h, p, d, f, m, g, error, y, w, k, C;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          if (!n || n.length === 0) return [2, []];
          o = r.split("#").filter(function (e) {
            return !!e;
          });
          r.endsWith("#") && o.push("");
          (a = "#" + o.slice(0, o.length - 1).join("#")).endsWith("#") || (a += "#");
          s = 0;
          l = 0;
          c = [];
          b.label = 1;
        case 1:
          b.trys.push([1, 6, 7, 12]);
          u = true;
          h = __asyncValues(
            cx(lx(n), {
              maxDelay: 0,
            }),
          );
          b.label = 2;
        case 2:
          return [4, h.next()];
        case 3:
          if (((p = b.sent()), (y = p.done))) return [3, 5];
          if (((C = p.value), (u = false), (d = C), e.isCancelled())) return [3, 5];
          if (d.level <= l || s >= o.length) return [3, 5];
          f = d.heading.toLowerCase();
          s === o.length - 1
            ? (m = o[s]) === ""
              ? c.push({
                  type: "heading",
                  file: filet0,
                  path: path,
                  subpath: a + stripHeadingForLink(d.heading),
                  level: d.level,
                  heading: d.heading,
                  score: 0,
                  matches: null,
                })
              : (g = fuzzySearch(prepareQuery(m), d.heading)) &&
                c.push({
                  type: "heading",
                  file: filet0,
                  path: path,
                  subpath: a + stripHeadingForLink(d.heading),
                  level: d.level,
                  heading: d.heading,
                  score: g.score,
                  matches: g.matches,
                })
            : f === o[s].toLowerCase() && (s++, (l = d.level));
          b.label = 4;
        case 4:
          u = true;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = b.sent();
          w = {
            error: error,
          };
          return [3, 12];
        case 7:
          b.trys.push([7, , 10, 11]);
          return u || y || !(k = h.return) ? [3, 9] : [4, k.call(h)];
        case 8:
          b.sent();
          b.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (w) throw w.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2, c];
      }
    });
  });
}
function rT(e, filet0, path, i, r) {
  return __awaiter(this, undefined, undefined, function () {
    var content, a, s, l, c, u, h, matches, score, idMatch, m, error, v, y, w, k;
    return __generator(this, function (b) {
      switch (b.label) {
        case 0:
          if (!i) return [2, []];
          content = i.content;
          a = r.toLowerCase().split(" ");
          s = [];
          b.label = 1;
        case 1:
          b.trys.push([1, 6, 7, 12]);
          l = true;
          c = __asyncValues(
            cx(lx(i.blocks), {
              maxDelay: 0,
            }),
          );
          b.label = 2;
        case 2:
          return [4, c.next()];
        case 3:
          if (((u = b.sent()), (v = u.done))) return [3, 5];
          if (((k = u.value), (l = false), (h = k), e.isCancelled())) return [3, 5];
          matches = Gx(a, h.display.toLowerCase());
          score = nT(matches);
          idMatch = null;
          (m = h.node.id) && String.isString(m) && (idMatch = Gx(a, m.toLowerCase())) && (score = 0);
          (matches || idMatch) &&
            s.push({
              type: "block",
              file: filet0,
              path: path,
              content: content,
              display: h.display,
              node: h.node,
              score: score,
              matches: matches,
              idMatch: idMatch,
            });
          b.label = 4;
        case 4:
          l = true;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = b.sent();
          y = {
            error: error,
          };
          return [3, 12];
        case 7:
          b.trys.push([7, , 10, 11]);
          return l || v || !(w = c.return) ? [3, 9] : [4, w.call(c)];
        case 8:
          b.sent();
          b.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (y) throw y.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [2, s];
      }
    });
  });
}
function oT(e, t, n) {
  undefined === n && (n = false);
  t.addClass("mod-complex");
  var i = t.createDiv("suggestion-content"),
    r = t.createDiv("suggestion-aux"),
    o = i.createDiv("suggestion-title"),
    a = i.createDiv("suggestion-note"),
    s = e.matches;
  if (
    (!n || (e.type !== "heading" && e.type !== "block") || a.setText(ou(e.file.path)),
    e.downranked && t.addClass("mod-downranked"),
    e.type === "none")
  )
    o.setText(i18nProxy.editor.linkSuggestion.labelNoMatchFound());
  else if (e.type === "file") {
    var l = e.path,
      c = getFilename(l),
      u = l.substr(0, l.length - c.length);
    renderMatches(a, u, s);
    renderMatches(o, c, s, -u.length);
  } else if (e.type === "alias") {
    var h = "lucide-forward";
    a.setText(e.path);
    IMAGE_EXTENSIONS.contains(getExtension(e.path)) && nC(e.alias)
      ? ((h = "lucide-scaling"),
        o.setText(
          i18nProxy.editor.linkSuggestion.labelImageSize({
            size: e.alias,
          }),
        ))
      : e.alias
        ? renderMatches(o, e.alias, s)
        : o.createSpan({
            cls: "suggestion-empty-suggestion",
            text: i18nProxy.editor.linkSuggestion.labelNoAlias(),
          });
    r.createSpan(
      {
        cls: "suggestion-flair",
      },
      function (e) {
        setIcon(e, h);
        setTooltip(e, i18nProxy.interface.tooltip.alias());
      },
    );
  } else if (e.type === "linktext") renderMatches(o, e.path, s);
  else if (e.type === "heading") {
    e.heading
      ? renderMatches(o, e.heading, s)
      : o.createSpan({
          cls: "suggestion-empty-suggestion",
          text: i18nProxy.editor.linkSuggestion.labelNoHeading(),
        });
    e.level > 0 &&
      r.createSpan({
        cls: "suggestion-flair",
        text: "H" + e.level,
      });
  } else if (e.type === "bases-view") {
    renderMatches(o, e.viewName, s);
    r.createSpan(
      {
        cls: "suggestion-flair",
      },
      function (e) {
        setIcon(e, "lucide-table");
      },
    );
  } else if (e.type === "block") {
    renderMatches(o, e.display, s);
    var p = e.node.id;
    if (p && String.isString(p)) {
      a.getText().trim() && a.appendText(" > ");
      renderMatches(a, p, e.idMatch);
    }
  }
}
function aT(e, t, n, i, start, o, a, s, l) {
  var blockId = null,
    u = "",
    h = "",
    selectionStart = o,
    selectionEnd = o,
    f = l === "markdown" && e.vault.getConfig("useMarkdownLinks"),
    m = !f,
    g = "",
    replacement = "",
    y = function (t, n) {
      return n !== null
        ? m || !n || t.extension !== "md" || n.endsWith(".md")
          ? n
          : n + ".md"
        : t.path === a
          ? ""
          : e.metadataCache.fileToLinktext(t, a, m);
    };
  if (t.type === "none") {
    if (!(s !== "Enter" && s !== "Tab")) {
      g = n;
    }
  } else if (t.type === "file") {
    u = t.file.basename;
    g = e.metadataCache.fileToLinktext(t.file, a, m);
  } else if (t.type === "alias") {
    h = u = t.alias;
    var b = parseLinktext(t.path),
      w = b.path,
      k = b.subpath;
    t.file && (w = e.metadataCache.fileToLinktext(t.file, a, m));
    g = w + k;
  } else if (t.type === "linktext") {
    u = t.path;
    g = t.path;
  } else if (t.type === "bases-view") {
    w = y(t.file, t.path);
    u = t.viewName;
    g = w + t.subpath;
  } else if (t.type === "heading") {
    w = y(t.file, t.path);
    u = t.heading;
    g = w + t.subpath;
  } else if (t.type === "block") {
    u = "";
    w = y(t.file, t.path);
    var C = t.node;
    g = C.id ? w + "#^" + C.id : w + "#^" + (blockId = ic(6));
  }
  var E = i.match(/^(\s*)(\|)?(.*?)(]])/);
  if (
    (E && !E[0].contains("[[") && (E[2] && !h && ((h = E[3]), u || (u = h)), (o += E[0].length)),
    !h && t.type === "file")
  ) {
    var S = t.file.extension;
    if (S === "canvas" || (!IMAGE_EXTENSIONS.contains(S) && g.contains("/"))) {
      h = u;
    }
  }
  if (f && s !== "#" && s !== "^") {
    replacement = "[".concat(u, "](").concat(encodeSpecialChars(g), ")");
    selectionStart = selectionEnd = u ? start + replacement.length : start + 1;
  } else {
    s === "#"
      ? ((g += "#"), t.type === "file" && PDF_EXTENSIONS.contains(t.file.extension) && (g += "page="))
      : s === "^" && (g += "^");
    h && (g += "|" + h);
    var M = g.endsWith("]]") ? "" : "]]",
      x = start + (replacement = "[[" + g + M).length - 2;
    s === "Tab"
      ? h
        ? ((selectionStart = x - h.length), (selectionEnd = x))
        : (selectionStart = selectionEnd = x)
      : (selectionStart = selectionEnd =
          s === "#" || s === "^" || s === "|" ? (h ? x - h.length - 1 : x) : start + replacement.length);
  }
  return {
    replacement: replacement,
    start: start,
    end: o,
    selectionStart: selectionStart,
    selectionEnd: selectionEnd,
    blockId: blockId,
  };
}
var sT = (function () {
    function e(app, getSourcePath) {
      this.runnable = null;
      this.mode = "file";
      this.global = false;
      this.fileSuggestions = null;
      this.app = app;
      this.getSourcePath = getSourcePath;
    }
    e.prototype.getInstructions = function () {
      return this.mode === "file"
        ? [
            {
              command: i18nProxy.editor.linkSuggestion.labelTypeHash(),
              purpose: i18nProxy.editor.linkSuggestion.labelLinkHeading(),
            },
            {
              command: i18nProxy.editor.linkSuggestion.labelTypeBlock(),
              purpose: i18nProxy.editor.linkSuggestion.labelLinkBlock(),
            },
            {
              command: i18nProxy.editor.linkSuggestion.labelTypePipe(),
              purpose: i18nProxy.editor.linkSuggestion.labelChangeDisplayText(),
            },
          ]
        : [
            {
              command: "↵",
              purpose: i18nProxy.editor.linkSuggestion.labelAccept(),
            },
          ];
    };
    e.prototype.getSuggestionsAsync = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l, c;
        return __generator(this, function (u) {
          if (
            ((n = t.indexOf("|")), (i = null), -1 !== n && ((i = t.substr(n + 1)), (t = t.substr(0, n))), i === null)
          ) {
            if (t.startsWith("##")) {
              t = t.substr(2);
              this.mode = "heading";
              this.global = true;
              return [2, this.getGlobalHeadingSuggestions(e, t)];
            }
            if (t.startsWith("^^")) {
              t = t.substr(2);
              this.mode = "block";
              this.global = true;
              return [2, this.getGlobalBlockSuggestions(e, t)];
            }
          }
          this.global = false;
          r = parseLinktext(t);
          o = r.path;
          a = r.subpath;
          return i !== null
            ? ((this.mode = "display"), [2, this.getDisplaySuggestions(e, o, a, i)])
            : a
              ? a.startsWith("#^")
                ? ((s = a.substr(2)), (this.mode = "block"), [2, this.getBlockSuggestions(e, o, s)])
                : ((this.mode = "heading"), [2, this.getHeadingSuggestions(e, o, a)])
              : -1 !== (l = o.lastIndexOf("^"))
                ? ((c = o.substr(l + 1)),
                  (o = o.substr(0, l)),
                  (this.mode = "block"),
                  [2, this.getBlockSuggestions(e, o, c)])
                : ((this.mode = "file"), [2, this.getFileSuggestions(e, o)]);
        });
      });
    };
    e.prototype.getDisplaySuggestions = function (e, t, n, aliasi0) {
      var r = this.app.metadataCache,
        o = this.getSourcePath(),
        filea0 = r.getFirstLinkpathDest(t, o),
        s = [];
      if (filea0) {
        var l = r.getFileCache(filea0),
          c = parseFrontMatterAliases(l == null ? undefined : l.frontmatter);
        if (c && c.length > 0)
          for (var u = prepareQuery(aliasi0), h = 0, p = c; h < p.length; h++) {
            var alias = p[h],
              f = fuzzySearch(u, alias);
            if (f) {
              s.push({
                type: "alias",
                alias: alias,
                file: filea0,
                path: t + n,
                score: f.score,
                matches: f.matches,
              });
            }
          }
      }
      return s.length > 0
        ? s
        : [
            {
              type: "alias",
              file: null,
              path: t + n,
              alias: aliasi0,
              score: 0,
              matches: [[0, aliasi0.length]],
            },
          ];
    };
    e.prototype.getHeadingSuggestions = function (e, path, subpath) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, fileo0, a, s, l, c, u, h, p, d, f, m, g, v;
        return __generator(this, function (y) {
          switch (y.label) {
            case 0:
              i = this.app.metadataCache;
              r = this.getSourcePath();
              return (fileo0 = i.getFirstLinkpathDest(path, r))
                ? fileo0.extension !== "base"
                  ? [3, 2]
                  : ((a = prepareQuery(subpath.slice(1))), (s = []), [4, this.app.vault.cachedRead(fileo0)])
                : [2, []];
            case 1:
              for (
                l = y.sent(),
                  c = (v = parseYaml(l)) === null || undefined === v ? undefined : v.views,
                  u = [],
                  c &&
                    Array.isArray(c) &&
                    (u = c
                      .map(function (e) {
                        return {
                          name: e == null ? undefined : e.name,
                          type: e == null ? undefined : e.type,
                        };
                      })
                      .filter(function (e) {
                        return String.isString(e.name) && String.isString(e.type);
                      })),
                  h = 0,
                  p = u;
                h < p.length;
                h++
              ) {
                d = p[h];
                (f = fuzzySearch(a, d.name)) &&
                  s.push({
                    type: "bases-view",
                    file: fileo0,
                    path: path,
                    subpath: "#" + stripHeadingForLink(d.name),
                    viewName: d.name,
                    viewType: d.type,
                    score: f.score,
                    matches: f.matches,
                  });
              }
              return [2, s];
            case 2:
              return fileo0.extension !== "md"
                ? [2, []]
                : ((m = i.getFileCache(fileo0)), [4, iT(e, fileo0, m == null ? undefined : m.headings, path, subpath)]);
            case 3:
              return (g = y.sent()).length > 0
                ? [2, g]
                : [
                    2,
                    [
                      {
                        type: "heading",
                        file: null,
                        path: path,
                        subpath: subpath,
                        score: 0,
                        heading: subpath.slice(1),
                        level: 0,
                        matches: [[0, subpath.length]],
                      },
                    ],
                  ];
          }
        });
      });
    };
    e.prototype.getGlobalHeadingSuggestions = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, filel0, c, u, h, p, d, f, subpath, error, v, y, w, k;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              n = this.app.metadataCache;
              i = [];
              r = prepareQuery(t);
              o = 0;
              a = n.getCachedFiles();
              b.label = 1;
            case 1:
              if (!(o < a.length)) return [3, 14];
              if (((s = a[o]), e.isCancelled())) return [3, 14];
              if (n.isUserIgnored(s)) return [3, 13];
              if (!((filel0 = this.app.vault.getAbstractFileByPath(s)) instanceof TFile) || filel0.extension !== "md")
                return [3, 13];
              if (!(c = n.getCache(s)) || !c.headings || c.headings.length === 0) return [3, 13];
              b.label = 2;
            case 2:
              b.trys.push([2, 7, 8, 13]);
              u = true;
              y = undefined;
              h = __asyncValues(
                cx(lx(c.headings), {
                  maxDelay: 0,
                }),
              );
              b.label = 3;
            case 3:
              return [4, h.next()];
            case 4:
              if (((p = b.sent()), (v = p.done))) return [3, 6];
              if (((k = p.value), (u = false), (d = k), e.isCancelled())) return [3, 6];
              (f = fuzzySearch(r, d.heading)) &&
                ((subpath = "#" + stripHeadingForLink(d.heading)),
                i.push({
                  type: "heading",
                  file: filel0,
                  path: null,
                  subpath: subpath,
                  level: d.level,
                  heading: d.heading,
                  score: f.score,
                  matches: f.matches,
                }));
              b.label = 5;
            case 5:
              u = true;
              return [3, 3];
            case 6:
              return [3, 13];
            case 7:
              error = b.sent();
              y = {
                error: error,
              };
              return [3, 13];
            case 8:
              b.trys.push([8, , 11, 12]);
              return u || v || !(w = h.return) ? [3, 10] : [4, w.call(h)];
            case 9:
              b.sent();
              b.label = 10;
            case 10:
              return [3, 12];
            case 11:
              if (y) throw y.error;
              return [7];
            case 12:
              return [7];
            case 13:
              o++;
              return [3, 1];
            case 14:
              return [2, i];
          }
        });
      });
    };
    e.prototype.getBlockSuggestions = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i, r, o, a;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              i = this.app.metadataCache;
              r = this.getSourcePath();
              return (o = i.getFirstLinkpathDest(t, r)) && o.extension === "md"
                ? [4, i.blockCache.getForFile(e, o)]
                : [2, []];
            case 1:
              a = s.sent();
              return [2, rT(e, o, t, a, n)];
          }
        });
      });
    };
    e.prototype.getGlobalBlockSuggestions = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, error, y, w, k, C;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              n = this.app.metadataCache;
              i = this.getSourcePath();
              r = this.app.vault.getAbstractFileByPath(i);
              o = t.toLowerCase().split(" ");
              a = [];
              b.label = 1;
            case 1:
              b.trys.push([1, 6, 7, 12]);
              s = true;
              l = __asyncValues(
                cx(n.blockCache.getAll(e), {
                  batchSize: 1,
                  maxDelay: 0,
                }),
              );
              b.label = 2;
            case 2:
              return [4, l.next()];
            case 3:
              if (((c = b.sent()), (y = c.done))) return [3, 5];
              if (((C = c.value), (s = false), (u = C), e.isCancelled())) return [3, 5];
              if (((h = u.file), (p = u.content), h.extension !== "md")) return [3, 4];
              for (d = 0, f = u.blocks; d < f.length; d++) {
                m = f[d];
                (g = this.matchBlock(r, h, m, null, p, o)) && a.push(g);
              }
              b.label = 4;
            case 4:
              s = true;
              return [3, 2];
            case 5:
              return [3, 12];
            case 6:
              error = b.sent();
              w = {
                error: error,
              };
              return [3, 12];
            case 7:
              b.trys.push([7, , 10, 11]);
              return s || y || !(k = l.return) ? [3, 9] : [4, k.call(l)];
            case 8:
              b.sent();
              b.label = 9;
            case 9:
              return [3, 11];
            case 10:
              if (w) throw w.error;
              return [7];
            case 11:
              return [7];
            case 12:
              return [2, a];
          }
        });
      });
    };
    e.prototype.matchBlock = function (e, filet0, n, path, content, o) {
      if (
        this.sourcePosition &&
        filet0 === e &&
        n.node.position.start.line - 1 <= this.sourcePosition.line &&
        n.node.position.end.line - 1 >= this.sourcePosition.line
      )
        return null;
      var matches = Gx(o, n.display.toLowerCase()),
        score = nT(matches),
        idMatch = null,
        c = n.node.id;
      c && String.isString(c) && (idMatch = Gx(o, c.toLowerCase())) && (score = 0);
      return matches || idMatch
        ? {
            type: "block",
            file: filet0,
            path: path,
            content: content,
            display: n.display,
            node: n.node,
            score: score,
            matches: matches,
            idMatch: idMatch,
          }
        : null;
    };
    e.prototype.getFileSuggestions = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n, i, r, o, a, s, l, c, u, h, filep0, downranked, alias, m, error, v, y, w, k;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              if (
                ((n = this.app.metadataCache),
                (i = this.fileSuggestions) || (i = this.fileSuggestions = n.getLinkSuggestions()),
                (r = []),
                t === "")
              ) {
                for (o = 0, a = i; o < a.length; o++)
                  if (((h = a[o]), (filep0 = h.file))) {
                    if (n.isUserIgnored(filep0.path)) continue;
                    (alias = h.alias)
                      ? r.push({
                          type: "alias",
                          alias: alias,
                          file: filep0,
                          path: h.path,
                          score: filep0.stat.mtime,
                          matches: null,
                        })
                      : r.push({
                          type: "file",
                          file: filep0,
                          path: h.path,
                          score: filep0.stat.mtime,
                          matches: null,
                        });
                  } else
                    r.push({
                      type: "linktext",
                      path: h.path,
                      score: 0,
                      matches: null,
                    });
                return [2, r.sort(eT)];
              }
              s = i.length < 1e4 ? prepareFuzzySearch(t) : prepareSimpleSearch(t);
              b.label = 1;
            case 1:
              b.trys.push([1, 6, 7, 12]);
              l = true;
              c = __asyncValues(
                cx(lx(i), {
                  maxDelay: 0,
                }),
              );
              b.label = 2;
            case 2:
              return [4, c.next()];
            case 3:
              if (((u = b.sent()), (v = u.done))) return [3, 5];
              if (((k = u.value), (l = false), (h = k), e.isCancelled())) return [3, 5];
              (filep0 = h.file)
                ? ((downranked = n.isUserIgnored(filep0.path)),
                  (alias = h.alias)
                    ? (m = s(alias)) &&
                      r.push({
                        type: "alias",
                        alias: alias,
                        file: h.file,
                        path: h.path,
                        score: m.score + (downranked ? -10 : 0),
                        matches: m.matches,
                        downranked: downranked,
                      })
                    : (m = cT(s, h.path)) &&
                      r.push({
                        type: "file",
                        file: h.file,
                        path: h.path,
                        score: m.score + (downranked ? -10 : 0),
                        matches: m.matches,
                        downranked: downranked,
                      }))
                : (m = s(h.path)) &&
                  r.push({
                    type: "linktext",
                    path: h.path,
                    score: m.score,
                    matches: m.matches,
                  });
              b.label = 4;
            case 4:
              l = true;
              return [3, 2];
            case 5:
              return [3, 12];
            case 6:
              error = b.sent();
              y = {
                error: error,
              };
              return [3, 12];
            case 7:
              b.trys.push([7, , 10, 11]);
              return l || v || !(w = c.return) ? [3, 9] : [4, w.call(c)];
            case 8:
              b.sent();
              b.label = 9;
            case 9:
              return [3, 11];
            case 10:
              if (y) throw y.error;
              return [7];
            case 11:
              return [7];
            case 12:
              return [2, r];
          }
        });
      });
    };
    return e;
  })(),
  lT = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.suggestManager = new sT(n.app, function () {
        var e, t;
        return (t = (e = n.context.file) === null || undefined === e ? undefined : e.path) !== null && undefined !== t
          ? t
          : "";
      });
      n.setInstructions(n.suggestManager.getInstructions());
      n.scope.register(["Shift"], "Enter", function (e) {
        if (!e.isComposing) {
          n.selectSuggestion(
            {
              type: "none",
              matches: [],
              score: 0,
            },
            e,
          );
          return !1;
        }
      });
      n.scope.register([], "Tab", function (e) {
        if (!e.isComposing && n.suggestions.useSelectedItem(e)) return !1;
      });
      n.scope.register(null, "#", function (e) {
        if (
          (n.suggestManager.mode === "file" || n.suggestManager.mode === "heading") &&
          n.suggestions.useSelectedItem(e)
        )
          return !1;
      });
      n.scope.register(null, "^", function (e) {
        if (n.suggestManager.mode === "file" && n.suggestions.useSelectedItem(e)) return !1;
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onTrigger = function (e, t, n) {
      var line = e.line,
        r = t.getLine(line).substr(0, e.ch),
        o = r.lastIndexOf("[["),
        a = r.lastIndexOf("]");
      return -1 !== o && a < o
        ? {
            start: {
              line: line,
              ch: o + 2,
            },
            end: {
              line: line,
              ch: e.ch,
            },
            query: r.substr(o + 2),
          }
        : null;
    };
    t.prototype.getSuggestions = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              (t = this.suggestManager.runnable) && t.cancel();
              t = this.suggestManager.runnable = new ax();
              n = (n = e.query).trim();
              return [4, this.suggestManager.getSuggestionsAsync(t, n)];
            case 1:
              return !(i = r.sent()) || t.isCancelled()
                ? [2, null]
                : (i.length === 0 && (i = [tT]),
                  i.sort(eT),
                  this.setInstructions(this.suggestManager.getInstructions()),
                  [2, i]);
          }
        });
      });
    };
    t.prototype.showSuggestions = function (t) {
      if ((e.prototype.showSuggestions.call(this, t), this.context)) {
        var n = this.context.query;
        if (!(n && n !== "^" && n !== "#")) {
          this.suggestions.forceSetSelectedItem(-1, null);
        }
      }
    };
    t.prototype.renderSuggestion = function (e, t) {
      oT(e, t, this.suggestManager.global);
    };
    t.prototype.selectSuggestion = function (e, t) {
      var n = this.context;
      if ((this.close(), n)) {
        var i = n.editor,
          r = n.start,
          o = n.end,
          a = n.file,
          s = n.query;
        r = Tb(r, -2);
        var l = aT(
            this.app,
            e,
            s,
            i.getLine(o.line).substr(o.ch),
            r.ch,
            o.ch,
            (a == null ? undefined : a.path) || "",
            t.instanceOf(KeyboardEvent) ? getKeyName(t) : "",
            "markdown",
          ),
          c = {
            line: r.line,
            ch: 0,
          },
          changes = [
            {
              from: Tb(c, l.start),
              to: Tb(c, l.end),
              text: l.replacement,
            },
          ],
          selection = {
            from: Tb(c, l.selectionStart),
            to: Tb(c, l.selectionEnd),
          };
        if (e.type === "block" && l.blockId) {
          var p = db(e, l.blockId),
            d = p.blockStart,
            f = p.blockEnd,
            textm0 = p.addition,
            line = p.newlines,
            v = e.content,
            y = e.file;
          if (a !== y) {
            v = v.slice(0, f) + textm0 + v.slice(f);
            this.app.vault.modify(y, v);
          } else {
            var b = v.substring(d, f);
            if (b === "") return void this.close();
            for (var w = i.getValue(), k = 0, C = -99999; ; ) {
              var E = w.indexOf(b, k);
              if (-1 === E) break;
              Math.abs(d - E) < Math.abs(d - C) && (C = E);
              k = E + b.length;
            }
            if (C >= 0) {
              var from = Ob(w, [C + b.length])[0];
              changes.push({
                from: from,
                text: textm0,
              });
              selection.from.line += line;
              selection.to.line += line;
            }
          }
        }
        i.transaction(
          {
            changes: changes,
            selection: selection,
          },
          "input.autocomplete",
        );
        setTimeout(function () {
          return i.focus();
        });
      }
    };
    t.prototype.close = function () {
      e.prototype.close.call(this);
      this.suggestManager.fileSuggestions = null;
      this.suggestManager.runnable && (this.suggestManager.runnable.cancel(), (this.suggestManager.runnable = null));
    };
    return t;
  })(EditorSuggest);
function cT(e, t) {
  var n = getFilename(t),
    i = e(n);
  return i ? (jx(i.matches, t.length - n.length), i) : ((i = e(t)) && (i.score -= 1), i);
}
var uT = /(^|\s)#[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]*$/g,
  hT = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.scope.register([], "Tab", function (e) {
        if (!e.isComposing) {
          var t = n.suggestions,
            i = t.values[t.selectedItem];
          if (i) {
            var r = n.context,
              o = r.editor,
              from = r.start,
              s = r.end,
              textl0 = "#" + $x(i.tag, i.matches);
            o.transaction({
              changes: [
                {
                  from: from,
                  to: s,
                  text: textl0,
                },
              ],
            });
            return !1;
          }
        }
      });
      return n;
    }
    __extends(t, e);
    t.prototype.onTrigger = function (e, t, n) {
      var line = e.line,
        r = t.getLine(line),
        o = r.substr(0, e.ch);
      if (o.match(uT) && r.substr(e.ch, 1) !== "#") {
        var a = o.lastIndexOf("#"),
          query = o.substr(a + 1);
        return {
          start: {
            line: line,
            ch: a,
          },
          end: {
            line: line,
            ch: e.ch,
          },
          query: query,
        };
      }
      return null;
    };
    t.prototype.renderSuggestion = function (e, t) {
      renderResults(t, e.tag, e);
    };
    t.prototype.selectSuggestion = function (e) {
      var t = this.context;
      if ((this.close(), t)) {
        var n = t.editor,
          from = t.start,
          r = t.end;
        n.transaction({
          changes: [
            {
              from: from,
              to: r,
              text: "#" + e.tag + " ",
            },
          ],
        });
        setTimeout(function () {
          return n.focus();
        });
      }
    };
    t.prototype.getSuggestions = function (e) {
      return pT(this.app.metadataCache, e.query);
    };
    return t;
  })(EditorSuggest);
function pT(e, t, n) {
  undefined === n && (n = false);
  t = t.toLowerCase();
  var i = Object.keys(e.getTags());
  if (!n) {
    i = i.map(function (e) {
      return e.slice(1);
    });
  }
  var r = [],
    o = prepareQuery(t);
  i.sort(Eb);
  for (var a = 0, s = i; a < s.length; a++) {
    var l = s[a];
    if (t === "" || (t === "#" && n))
      r.push({
        tag: l,
        score: 0,
        matches: null,
      });
    else {
      var c = fuzzySearch(o, l.toLowerCase());
      if (c) {
        r.push({
          tag: l,
          score: c.score,
          matches: c.matches,
        });
      }
    }
  }
  r.sort(function (e, t) {
    return t.score - e.score;
  });
  return r;
}
var dT = (function () {
    function e(e) {
      var t = this;
      this.elements = [];
      this.values = [];
      var n = (this.rootEl = e.createDiv({
          cls: "multi-select-container",
          attr: {
            tabIndex: -1,
          },
        })),
        i = function (e) {
          if (t.addElement(e)) {
            t.inputEl.innerText = "";
            t.inputEl.trigger("input");
          }
        },
        r = (this.inputEl = this._createInputEl());
      r.addEventListener("blur", function (e) {
        if (r.getText()) {
          i(r.getText());
        }
      });
      r.addEventListener("keydown", function (e) {
        if (!e.isComposing)
          if (e.key === "Enter" && r.getText().length > 0) {
            e.preventDefault();
            i(r.getText());
          } else if (e.key === "Backspace" && t.inputText.length === 0 && t.elements.length > 0) {
            e.preventDefault();
            var n = t.elements[t.elements.length - 1];
            if (n) {
              n.focus();
            }
          } else if (e.key === "ArrowLeft") {
            var o = r.win.getSelection();
            if (r.getText().length === 0 && o.rangeCount > 0)
              if (o.getRangeAt(0).startOffset === 0) {
                e.preventDefault();
                t.focusElement(t.elements.length - 1);
              }
          }
      });
      r.addEventListener("blur", function (e) {
        i(r.getText());
      });
      n.addEventListener("click", function (e) {
        if (e.targetNode === n) {
          r.focus();
        }
      });
      this.renderValues();
    }
    Object.defineProperty(e.prototype, "inputText", {
      get: function () {
        return this.inputEl.getText();
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.setInputText = function (innerText) {
      this.inputEl.innerText = innerText;
      this.inputEl.trigger("input");
    };
    e.prototype._createInputEl = function () {
      var e = createDiv({
        cls: "multi-select-input",
        attr: {
          contentEditable: true,
          tabIndex: 0,
        },
      });
      e.addEventListener("input", function (t) {
        return normalizeElementText(e, !1);
      });
      e.addEventListener("paste", function (t) {
        return handlePasteText(e, t);
      });
      return e;
    };
    e.prototype.setValues = function (values) {
      var t = false;
      Array.isArray(values) ? ((t = true), (this.values = values)) : ((t = this.values.length > 0), (this.values = []));
      t && (this.renderValues(), this.triggerChange());
      return this;
    };
    e.prototype.onChange = function (changeCallback) {
      this.changeCallback = changeCallback;
      return this;
    };
    e.prototype.setOptionContextmenuHandler = function (onOptionContextmenu) {
      this.onOptionContextmenu = onOptionContextmenu;
      return this;
    };
    e.prototype.setOptionRenderer = function (optionRenderer) {
      this.optionRenderer = optionRenderer;
      this.values.length > 0 && this.renderValues();
      return this;
    };
    e.prototype.allowCreatingOptions = function (createOption) {
      this.createOption = createOption;
      return this;
    };
    e.prototype.preventDuplicates = function (findDuplicate) {
      this.findDuplicate = findDuplicate;
      return this;
    };
    e.prototype.setupInputEl = function (setupInput) {
      this.setupInput = setupInput;
      return this;
    };
    e.prototype._createElement = function (e) {
      var t,
        n = (t = this.createOption) === null || undefined === t ? undefined : t.call(this, e);
      return n || null;
    };
    e.prototype.addElement = function (e) {
      var t,
        n = this._createElement(e);
      if (n) {
        var i = (t = this.findDuplicate) === null || undefined === t ? undefined : t.call(this, n, this.values);
        if (undefined !== i && i >= 0 && i < this.elements.length) {
          var r = this.elements[i];
          r.hasClass("multi-select-duplicate") ||
            (r.addClass("multi-select-duplicate"),
            r.win.setTimeout(function () {
              return r.removeClass("multi-select-duplicate");
            }, 2e3));
          return !1;
        }
        this.values.push(n);
        this.renderValues();
        this.triggerChange();
      }
      return !!n;
    };
    e.prototype.editElement = function (e) {
      var t,
        n = this;
      if (!(e < 0 || e >= this.values.length)) {
        var i = this.elements[e],
          r = this._createInputEl(),
          o = false,
          a = function (t, i) {
            var r;
            if (undefined === i) {
              i = false;
            }
            var a = n._createElement(t);
            if (a) {
              var s = (r = n.findDuplicate) === null || undefined === r ? undefined : r.call(n, a, n.values);
              if (undefined !== s && s >= 0 && s < n.elements.length && s !== e) {
                var l = n.elements[s];
                l.hasClass("multi-select-duplicate") ||
                  (l.addClass("multi-select-duplicate"),
                  l.win.setTimeout(function () {
                    return l.removeClass("multi-select-duplicate");
                  }, 2e3));
                return !1;
              }
              o = false;
              n.values[e] = a;
              n.renderValues();
              i && n.focusElement(e);
              n.triggerChange();
              return !0;
            }
            return !1;
          };
        (t = this.setupInput) === null || undefined === t || t.call(this, r, a);
        r.addEventListener("focus", function (e) {
          o = true;
        });
        r.addEventListener("blur", function (e) {
          if (o) {
            o = false;
            var t = r.getText();
            t ? a(t) : (n.rootEl.insertBefore(i, r), r.detach());
          }
        });
        r.addEventListener("keydown", function (e) {
          if (!e.isComposing) {
            e.key === "Enter" && r.getText().length > 0
              ? (e.preventDefault(), a(r.getText(), !0))
              : e.key === "Escape" &&
                (e.preventDefault(), (o = false), n.rootEl.insertBefore(i, r), r.detach(), i.focus());
          }
        });
        r.innerText = String(this.values[e]);
        this.rootEl.insertBefore(r, i);
        i.detach();
        focusAndSelectContent(r);
      }
    };
    e.prototype.removeElement = function (e, t) {
      undefined === t && (t = false);
      e < 0 ||
        e >= this.values.length ||
        ((this.values = this.values.filter(function (t, n) {
          return n !== e;
        })),
        this.renderValues(),
        t && this.focusElement(e - 1),
        this.triggerChange());
    };
    e.prototype.focusElement = function (e) {
      var t = Math.max(0, e),
        n = this.elements[t];
      n ? n.focus() : this.inputEl.focus();
    };
    e.prototype.renderValues = function () {
      var e = this;
      this.elements = [];
      for (
        var t = function (t) {
            var i = n.values[t],
              r = t,
              pillEl = n.rootEl.createDiv({
                cls: "multi-select-pill",
                attr: {
                  tabIndex: 0,
                },
              }),
              a = pillEl.createDiv({
                cls: "multi-select-pill-content",
              }),
              s = pillEl.createDiv({
                cls: "multi-select-pill-remove-button",
              });
            setIcon(s, "lucide-x");
            pillEl.addEventListener("copy", function (e) {
              return vc(String(i));
            });
            pillEl.addEventListener("contextmenu", function (t) {
              var n,
                s = Menu.forEvent(t);
              s.addSections(["title", "open", "action-primary", "action", "info", "view", "system", "", "danger"]);
              s.addItem(function (t) {
                return t
                  .setSection("action-primary")
                  .setTitle(i18nProxy.interface.menu.edit())
                  .setIcon("lucide-edit-3")
                  .onClick(function () {
                    return e.editElement(r);
                  });
              })
                .addItem(function (e) {
                  return e
                    .setSection("action-primary")
                    .setTitle(i18nProxy.interface.menu.copy())
                    .setIcon("lucide-copy")
                    .onClick(function () {
                      return navigator.clipboard.writeText(String(i));
                    });
                })
                .addItem(function (t) {
                  return t
                    .setWarning(!0)
                    .setSection("action-primary")
                    .setIcon("lucide-trash-2")
                    .setTitle(i18nProxy.interface.menu.removeFromList())
                    .onClick(function () {
                      return e.removeElement(r);
                    });
                });
              (n = e.onOptionContextmenu) === null ||
                undefined === n ||
                n.call(e, s, i, {
                  el: a,
                  pillEl: pillEl,
                });
            });
            pillEl.addEventListener("dblclick", function (t) {
              t.preventDefault();
              e.editElement(r);
            });
            pillEl.addEventListener("keydown", function (t) {
              t.key === "Enter"
                ? (t.preventDefault(), e.editElement(r))
                : t.key === "Backspace"
                  ? (t.preventDefault(), e.removeElement(r, !0))
                  : t.key === "ArrowUp"
                    ? (t.preventDefault(), e.focusElement(0))
                    : t.key === "ArrowDown"
                      ? (t.preventDefault(), e.inputEl.focus())
                      : t.key === "ArrowLeft"
                        ? (t.preventDefault(), e.focusElement(r - 1))
                        : t.key === "ArrowRight" && (t.preventDefault(), e.focusElement(r + 1));
            });
            n.optionRenderer
              ? n.optionRenderer(i, {
                  el: a,
                  pillEl: pillEl,
                })
              : a.createSpan({
                  text: String(i),
                });
            n.elements.push(pillEl);
            s.addEventListener("mousedown", function (e) {
              return e.preventDefault();
            });
            s.addEventListener("click", function (t) {
              t.preventDefault();
              e.removeElement(r);
              e.inputEl.trigger("input");
            });
          },
          n = this,
          i = 0;
        i < this.values.length;
        i++
      )
        t(i);
      this.rootEl.setChildrenInPlace(__spreadArray(__spreadArray([], this.elements, !0), [this.inputEl], !1));
      this.inputEl.setAttr("placeholder", this.elements.length > 0 ? "" : i18nProxy.properties.labelNoValue());
    };
    e.prototype.triggerChange = function () {
      if (this.changeCallback) {
        this.changeCallback(this.values);
      }
    };
    return e;
  })(),
  AbstractInputSuggest = (function (e) {
    function t(t, textInputEl) {
      var i = e.call(this, t) || this;
      i.limit = 100;
      i.textInputEl = textInputEl;
      i.autoReposition = i.autoReposition.bind(i);
      textInputEl.addEventListener("input", i.onInputChange.bind(i));
      textInputEl.addEventListener("focus", i.onInputFocus.bind(i));
      textInputEl.addEventListener("blur", i.close.bind(i));
      i.suggestEl.on("mousedown", ".suggestion-item", function (e) {
        e.preventDefault();
      });
      return i;
    }
    __extends(t, e);
    t.prototype.showSuggestions = function (e) {
      var t = this.textInputEl;
      if (e.length !== 0) {
        if (t.isShown()) {
          var n = this.limit;
          n > 0 && e.length > n && (e = e.slice(0, n));
          this.suggestions.setSuggestions(e);
          this.open();
          this.setAutoDestroy(t);
        }
      } else this.close();
    };
    t.prototype.setValue = function (value) {
      this.textInputEl.instanceOf(HTMLInputElement)
        ? (this.textInputEl.value = value)
        : (this.textInputEl.innerText = value);
    };
    t.prototype.getValue = function () {
      return this.textInputEl.instanceOf(HTMLInputElement) ? this.textInputEl.value : this.textInputEl.innerText;
    };
    t.prototype.onInputFocus = function () {
      var e = this;
      Platform.isIosApp
        ? xl(function () {
            return e.onInputChange();
          })
        : this.onInputChange();
    };
    t.prototype.onInputChange = function () {
      var e = this;
      if (this.textInputEl.isActiveElement()) {
        var t = this.getValue(),
          n = this.getSuggestions(t);
        if (Array.isArray(n)) this.showSuggestions(n);
        else {
          if (!n) return;
          __awaiter(e, undefined, undefined, function () {
            var e;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  e = this.showSuggestions;
                  return [4, n];
                case 1:
                  e.apply(this, [t.sent()]);
                  return [2];
              }
            });
          });
        }
      }
    };
    t.prototype.selectSuggestion = function (e, t) {
      var n;
      if (!((n = this.selectCb) === null || undefined === n)) {
        n.call(this, e, t);
      }
    };
    t.prototype.onSelect = function (selectCb) {
      this.selectCb = selectCb;
      return this;
    };
    t.prototype.close = function () {
      e.prototype.close.call(this);
      this.textInputEl.doc.removeEventListener("scroll", this.autoReposition);
    };
    t.prototype.reposition = function (lastRect) {
      e.prototype.reposition.call(this, lastRect);
      this.lastRect = lastRect;
    };
    t.prototype.open = function () {
      e.prototype.open.call(this);
      var t = this.textInputEl,
        n = transformRectToTopWindow(t.getBoundingClientRect(), t.win).rect;
      this.reposition(n);
      t.doc.addEventListener("scroll", this.autoReposition, {
        capture: true,
        passive: true,
      });
    };
    t.prototype.autoReposition = function () {
      var e = this.lastRect,
        t = this.textInputEl,
        n = transformRectToTopWindow(t.getBoundingClientRect(), t.win).rect;
      if (!(n.bottom === e.bottom && n.top === e.top && n.left === e.left && n.right === e.right)) {
        this.reposition(n);
      }
    };
    return t;
  })(PopoverSuggest),
  mT = (function (e) {
    function t(t, n, allowNullSelection, includeRoot) {
      undefined === allowNullSelection && (allowNullSelection = false);
      undefined === includeRoot && (includeRoot = false);
      var o = e.call(this, t, n) || this;
      o.includeRoot = false;
      o.allowNullSelection = allowNullSelection;
      o.includeRoot = includeRoot;
      return o;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      e ? renderMatches(t, e.item.path, e.match.matches) : t.setText("+ " + this.getValue());
    };
    t.prototype.getSuggestions = function (e) {
      for (
        var n = prepareQuery(e), i = [], r = 0, o = this.app.vault.getAllFolders(this.includeRoot);
        r < o.length;
        r++
      ) {
        var item = o[r];
        if (i.length >= t.MAX_SUGGESTIONS) break;
        if (this.filePredicate(item)) {
          var match = fuzzySearch(n, item.path);
          if (match) {
            i.push({
              item: item,
              match: match,
            });
          }
        }
      }
      sortSearchResults(i);
      this.allowNullSelection && e && i.push(null);
      return i;
    };
    t.prototype.filePredicate = function (e) {
      return !0;
    };
    t.prototype.selectSuggestion = function (t, n) {
      t && (this.setValue(t.item.path), this.textInputEl.trigger("input"));
      this.close();
      e.prototype.selectSuggestion.call(this, t, n);
    };
    t.MAX_SUGGESTIONS = 100;
    return t;
  })(AbstractInputSuggest),
  gT = (function (e) {
    function t(t, n, folderPredicate, r) {
      if (undefined === r) {
        r = false;
      }
      var o = e.call(this, t, n, r) || this;
      o.folderPredicate = folderPredicate;
      return o;
    }
    __extends(t, e);
    t.prototype.filePredicate = function (e) {
      return this.folderPredicate(e);
    };
    return t;
  })(mT),
  vT = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      t.addClass("mod-nowrap");
      var n = e.item;
      renderMatches(t, n.extension === "md" ? $c(n.path) : n.path, e.match.matches);
    };
    t.prototype.getSuggestions = function (e) {
      for (var n = [], i = prepareQuery(e), r = 0, o = this.app.vault.getAllLoadedFiles(); r < o.length; r++) {
        var item = o[r];
        if (n.length >= t.MAX_SUGGESTIONS) break;
        if (item instanceof TFile && this.filePredicate(item)) {
          var match = fuzzySearch(i, item.path);
          if (match) {
            n.push({
              item: item,
              match: match,
            });
          }
        }
      }
      sortSearchResults(n);
      return n;
    };
    t.prototype.filePredicate = function (e) {
      return !0;
    };
    t.prototype.selectSuggestion = function (e) {
      var t = e.item,
        n = t.extension === "md" ? $c(t.path) : t.path;
      this.setValue(n);
      this.textInputEl.trigger("input");
      this.textInputEl.trigger("change");
      this.close();
    };
    t.MAX_SUGGESTIONS = 100;
    return t;
  })(AbstractInputSuggest),
  yT = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.filePredicate = function (e) {
      return e.extension === "md";
    };
    return t;
  })(vT),
  bT = function (e) {
    return 255 & parseInt(e);
  },
  wT = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)$/i,
  kT = /^hsla?\s*\(\s*([\d.]+)(deg|rad|grad|turn)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(,\s*[\d.]+\s*)?\)$/i,
  CT = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
function ET(e) {
  var t = e.match(wT);
  return t
    ? {
        r: bT(t[1]),
        g: bT(t[2]),
        b: bT(t[3]),
        a: t[4] ? Math.clamp(parseFloat(t[4].substring(1)), 0, 1) : 1,
      }
    : null;
}
function ST(e, t, n) {
  n < 0 && (n += 1);
  n > 1 && (n -= 1);
  return n < 1 / 6 ? e + 6 * (t - e) * n : n < 0.5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function MT(e) {
  var t,
    n,
    i,
    r = e.h,
    o = e.s,
    a = e.l;
  if (((r /= 360), (a /= 100), (o /= 100) == 0)) t = n = i = a;
  else {
    var s = a < 0.5 ? a * (1 + o) : a + o - a * o,
      l = 2 * a - s;
    t = ST(l, s, r + 1 / 3);
    n = ST(l, s, r);
    i = ST(l, s, r - 1 / 3);
  }
  return {
    r: Math.round(255 * t),
    g: Math.round(255 * n),
    b: Math.round(255 * i),
  };
}
function xT(e) {
  var t = e.r,
    n = e.g,
    i = e.b;
  t /= 255;
  n /= 255;
  i /= 255;
  var r,
    o,
    a = Math.max(t, n, i),
    s = Math.min(t, n, i),
    l = (a + s) / 2;
  if (a == s) r = o = 0;
  else {
    var c = a - s;
    switch (((o = l > 0.5 ? c / (2 - a - s) : c / (a + s)), a)) {
      case t:
        r = (n - i) / c + (n < i ? 6 : 0);
        break;
      case n:
        r = (i - t) / c + 2;
        break;
      case i:
        r = (t - n) / c + 4;
    }
    r /= 6;
  }
  return {
    h: Math.round(360 * r),
    s: Math.round(100 * o),
    l: Math.round(100 * l),
  };
}
function TT(e) {
  var t = e.toString(16);
  return t.length === 1 ? "0" + t : t;
}
function DT(e) {
  var t = e.r,
    n = e.g,
    i = e.b;
  return "#" + TT(t) + TT(n) + TT(i);
}
function AT(e) {
  var t = CT.exec(e);
  return t
    ? {
        r: parseInt(t[1], 16),
        g: parseInt(t[2], 16),
        b: parseInt(t[3], 16),
      }
    : null;
}
function PT(e) {
  return (e.r << 16) | (e.g << 8) | e.b;
}
function LT(e) {
  var t = document.body.createDiv();
  t.style.color = "var(".concat(e, ")");
  var n = getComputedStyle(t).color;
  t.detach();
  return ET(n);
}
function IT(e) {
  var t = AT(e);
  if (t) return t;
  if ((t = ET(e))) return t;
  var n = (function (e) {
    var t = e.match(kT);
    if (t) {
      var n = t[1],
        i = t[2],
        r = parseFloat(n);
      i === "rad" ? (r = (180 * r) / Math.PI) : i === "grad" ? (r *= 0.9) : i === "turn" && (r *= 360);
      return {
        h: r,
        s: bT(t[3]),
        l: bT(t[4]),
        a: t[5] ? Math.clamp(parseFloat(t[5].substring(1)), 0, 1) : 1,
      };
    }
    return null;
  })(e);
  return n ? MT(n) : null;
}
function OT(e) {
  return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3 >= 150;
}