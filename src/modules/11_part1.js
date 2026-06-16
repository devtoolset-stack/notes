var CodeMirrorAdapter = (function () {
  function e(cm6) {
    this.state = {};
    this.marks = Object.create(null);
    this.$mid = 0;
    this.options = {};
    this._handlers = {};
    this.$lastChangeEndOffset = 0;
    this.virtualSelection = null;
    this.cm6 = cm6;
    this.onChange = this.onChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  e.prototype.openDialog = function (e, t, n) {
    return tB(this, e, t, n);
  };
  e.prototype.openNotification = function (e, t) {
    return (function (e, t, n) {
      $R(e, s);
      var i,
        r = QR(e, t, n && n.bottom),
        o = false,
        a = n && undefined !== n.duration ? n.duration : 5e3;
      function s() {
        if (!o) {
          o = true;
          clearTimeout(i);
          r.remove();
          eB(e, r);
        }
      }
      r.onclick = function (e) {
        e.preventDefault();
        s();
      };
      JR(e, r);
      a && (i = window.setTimeout(s, a));
      return s;
    })(this, e, t);
  };
  e.prototype.on = function (e, t) {
    UR(this, e, t);
  };
  e.prototype.off = function (e, t) {
    off(this, e, t);
  };
  e.prototype.signal = function (e, t, n) {
    signal(this, e, t, n);
  };
  e.prototype.indexFromPos = function (e) {
    return HR(this.cm6.state.doc, e);
  };
  e.prototype.posFromIndex = function (e) {
    return zR(this.cm6.state.doc, e);
  };
  e.prototype.foldCode = function (e) {
    var t = this.cm6,
      rangesn0 = t.state.selection.ranges,
      i = HR(this.cm6.state.doc, e),
      ranges = EditorSelection.create([EditorSelection.range(i, i)], 0).ranges;
    t.state.selection.ranges = ranges;
    foldCode(t);
    t.state.selection.ranges = rangesn0;
  };
  e.prototype.firstLine = function () {
    return 0;
  };
  e.prototype.lastLine = function () {
    return this.cm6.state.doc.lines - 1;
  };
  e.prototype.lineCount = function () {
    return this.cm6.state.doc.lines;
  };
  e.prototype.setCursor = function (line, t) {
    if (typeof line == "object") {
      t = line.ch;
      line = line.line;
    }
    var anchor = HR(this.cm6.state.doc, {
      line: line,
      ch: t || 0,
    });
    this.cm6.dispatch(
      {
        selection: {
          anchor: anchor,
        },
      },
      {
        scrollIntoView: !this.curOp,
        userEvent: "select",
      },
    );
    this.curOp && !this.curOp.isVimOp && this.onBeforeEndOperation();
  };
  e.prototype.getCursor = function (e) {
    var t = this.cm6.state.selection.main,
      n = e != "head" && e ? (e == "anchor" ? t.anchor : e == "start" ? t.from : e == "end" ? t.to : null) : t.head;
    if (n == null) throw new Error("Invalid cursor type");
    return this.posFromIndex(n);
  };
  e.prototype.listSelections = function () {
    var e = this.cm6.state.doc;
    return this.cm6.state.selection.ranges.map(function (t) {
      return {
        anchor: zR(e, t.anchor),
        head: zR(e, t.head),
      };
    });
  };
  e.prototype.getMainSelection = function () {
    var e = this.cm6.state.doc,
      t = this.cm6.state.selection.main;
    return {
      anchor: zR(e, t.anchor),
      head: zR(e, t.head),
    };
  };
  e.prototype.setSelections = function (e, t) {
    var n = this.cm6.state.doc,
      i = e.map(function (e) {
        var t = HR(n, e.head),
          i = HR(n, e.anchor);
        return t == i ? EditorSelection.cursor(t, 1) : EditorSelection.range(i, t);
      });
    this.cm6.dispatch({
      selection: EditorSelection.create(i, t),
    });
  };
  e.prototype.setSelection = function (anchor, head, n) {
    this.setSelections(
      [
        {
          anchor: anchor,
          head: head,
        },
      ],
      0,
    );
    n && n.origin == "*mouse" && this.onBeforeEndOperation();
  };
  e.prototype.getLine = function (e) {
    var t = this.cm6.state.doc;
    return e < 0 || e >= t.lines ? "" : this.cm6.state.doc.line(e + 1).text;
  };
  e.prototype.getLineHandle = function (e) {
    this.$lineHandleChanges || (this.$lineHandleChanges = []);
    return {
      row: e,
      index: this.indexFromPos(new Pos(e, 0)),
    };
  };
  e.prototype.getLineNumber = function (e) {
    var t = this.$lineHandleChanges;
    if (!t) return null;
    for (var n = e.index, i = 0; i < t.length; i++)
      if ((n = t[i].changes.mapPos(n, 1, MapMode.TrackAfter)) == null) return null;
    var r = this.posFromIndex(n);
    return r.ch == 0 ? r.line : null;
  };
  e.prototype.releaseLineHandles = function () {
    this.$lineHandleChanges = undefined;
  };
  e.prototype.getRange = function (e, t) {
    var n = this.cm6.state.doc;
    return this.cm6.state.sliceDoc(HR(n, e), HR(n, t));
  };
  e.prototype.replaceRange = function (insert, t, n, i) {
    if (!n) {
      n = t;
    }
    var r = this.cm6.state.doc;
    KR(this, {
      changes: {
        from: HR(r, t),
        to: HR(r, n),
        insert: insert,
      },
    });
  };
  e.prototype.replaceSelection = function (e) {
    KR(this, this.cm6.state.replaceSelection(e));
  };
  e.prototype.replaceSelections = function (e) {
    var changes = this.cm6.state.selection.ranges.map(function (t, n) {
      return {
        from: t.from,
        to: t.to,
        insert: e[n] || "",
      };
    });
    KR(this, {
      changes: changes,
    });
  };
  e.prototype.getSelection = function () {
    return this.getSelections().join("\n");
  };
  e.prototype.getSelections = function () {
    var e = this.cm6;
    return e.state.selection.ranges.map(function (t) {
      return e.state.sliceDoc(t.from, t.to);
    });
  };
  e.prototype.somethingSelected = function () {
    return this.cm6.state.selection.ranges.some(function (e) {
      return !e.empty;
    });
  };
  e.prototype.getInputField = function () {
    return this.cm6.contentDOM;
  };
  e.prototype.clipPos = function (e) {
    var t = this.cm6.state.doc,
      n = e.ch,
      i = e.line + 1;
    i < 1 && ((i = 1), (n = 0));
    i > t.lines && ((i = t.lines), (n = Number.MAX_VALUE));
    var r = t.line(i);
    n = Math.min(Math.max(0, n), r.to - r.from);
    return new Pos(i - 1, n);
  };
  e.prototype.getValue = function () {
    return this.cm6.state.doc.toString();
  };
  e.prototype.setValue = function (insert) {
    var t = this.cm6;
    return t.dispatch({
      changes: {
        from: 0,
        to: t.state.doc.length,
        insert: insert,
      },
      selection: EditorSelection.range(0, 0),
    });
  };
  e.prototype.focus = function () {
    return this.cm6.focus();
  };
  e.prototype.blur = function () {
    return this.cm6.contentDOM.blur();
  };
  e.prototype.defaultTextHeight = function () {
    return this.cm6.defaultLineHeight;
  };
  e.prototype.findMatchingBracket = function (e, t) {
    var n = this.cm6.state,
      i = HR(n.doc, e),
      r = matchBrackets(n, i + 1, -1);
    return (r && r.end) || ((r = matchBrackets(n, i, 1)) && r.end)
      ? {
          to: zR(n.doc, r.end.from),
        }
      : {
          to: undefined,
        };
  };
  e.prototype.scanForBracket = function (e, t, n, i) {
    return (function (e, t, n, i, r) {
      for (
        var o = (r && r.maxScanLineLength) || 1e4,
          a = (r && r.maxScanLines) || 1e3,
          s = [],
          l = (function (e) {
            return (e && e.bracketRegex) || /[(){}[\]]/;
          })(r),
          c = n > 0 ? Math.min(t.line + a, e.lastLine() + 1) : Math.max(e.firstLine() - 1, t.line - a),
          u = t.line;
        u != c;
        u += n
      ) {
        var h = e.getLine(u);
        if (h) {
          var p = n > 0 ? 0 : h.length - 1,
            d = n > 0 ? h.length : -1;
          if (!(h.length > o))
            for (u == t.line && (p = t.ch - (n < 0 ? 1 : 0)); p != d; p += n) {
              var f = h.charAt(p);
              if (l.test(f)) {
                var m = nB[f];
                if (m && (m.charAt(1) == ">") == n > 0) s.push(f);
                else {
                  if (!s.length)
                    return {
                      pos: new Pos(u, p),
                      ch: f,
                    };
                  s.pop();
                }
              }
            }
        }
      }
      return u - n != (n > 0 ? e.lastLine() : e.firstLine()) && null;
    })(this, e, t, 0, i);
  };
  e.prototype.indentLine = function (e, t) {
    t ? this.indentMore() : this.indentLess();
  };
  e.prototype.indentMore = function () {
    indentMore(this.cm6);
  };
  e.prototype.indentLess = function () {
    indentLess(this.cm6);
  };
  e.prototype.execCommand = function (t) {
    if (t == "indentAuto") e.commands.indentAuto(this);
    else if (t == "goLineLeft") cursorLineBoundaryBackward(this.cm6);
    else if (t == "goLineRight") {
      cursorLineBoundaryForward(this.cm6);
      var n = this.cm6.state,
        i = n.selection.main.head;
      if (i < n.doc.length && n.sliceDoc(i, i + 1) !== "\n") {
        cursorCharBackward(this.cm6);
      }
    } else console.log(t + " is not implemented");
  };
  e.prototype.setBookmark = function (e, t) {
    var n = (t == null ? undefined : t.insertLeft) ? 1 : -1,
      i = this.indexFromPos(e);
    return new aB(this, i, n);
  };
  e.prototype.addOverlay = function (e) {
    var t = e.query,
      cm6Query = new SearchQuery({
        regexp: true,
        search: t.source,
        caseSensitive: !/i/.test(t.flags),
      });
    if (cm6Query.valid) {
      cm6Query.forVim = true;
      this.cm6Query = cm6Query;
      var effects = setSearchQuery.of(cm6Query);
      this.cm6.dispatch({
        effects: effects,
      });
      return cm6Query;
    }
  };
  e.prototype.removeOverlay = function (e) {
    if (this.cm6Query) {
      this.cm6Query.forVim = false;
      var effects = setSearchQuery.of(this.cm6Query);
      this.cm6.dispatch({
        effects: effects,
      });
    }
  };
  e.prototype.getSearchCursor = function (e, t) {
    var n = this,
      i = null,
      r = null;
    if (t.ch == null) {
      t.ch = Number.MAX_VALUE;
    }
    var o = HR(n.cm6.state.doc, t),
      a = e.source.replace(/(\\.|{(?:\d+(?:,\d*)?|,\d+)})|[{}]/g, function (e, t) {
        return t || "\\" + e;
      });
    function s(t, n, i) {
      undefined === n && (n = 0);
      undefined === i && (i = t.length);
      return new RegExpCursor(
        t,
        a,
        {
          ignoreCase: e.ignoreCase,
        },
        n,
        i,
      );
    }
    return {
      findNext: function () {
        return this.find(!1);
      },
      findPrevious: function () {
        return this.find(!0);
      },
      find: function (e) {
        var t = n.cm6.state.doc;
        if (e) {
          var a = i ? (i.from == i.to ? i.to - 1 : i.from) : o;
          i = (function (e, t) {
            for (var i = n.cm6.state.doc, r = 1; ; r++) {
              for (var o = Math.max(e, t - 1e4 * r), a = s(i, o, t), l = null; !a.next().done; ) l = a.value;
              if (l && (o == e || l.from > o + 10)) return l;
              if (o == e) return null;
            }
          })(0, a);
        } else {
          var l = i ? (i.from == i.to ? i.to + 1 : i.to) : o;
          i = (function (e) {
            var t = n.cm6.state.doc;
            if (e > t.length) return null;
            var i = s(t, e).next();
            return i.done ? null : i.value;
          })(l);
        }
        r = i && {
          from: zR(t, i.from),
          to: zR(t, i.to),
          match: i.match,
        };
        return i && i.match;
      },
      from: function () {
        return r == null ? undefined : r.from;
      },
      to: function () {
        return r == null ? undefined : r.to;
      },
      replace: function (insert) {
        if (i) {
          KR(n, {
            changes: {
              from: i.from,
              to: i.to,
              insert: insert,
            },
          });
          i.to = i.from + insert.length;
          r && (r.to = zR(n.cm6.state.doc, i.to));
        }
      },
    };
  };
  e.prototype.moveByChar = function (e, t, n) {
    for (var i = this.cm6, r = HR(this.cm6.state.doc, e), o = EditorSelection.cursor(r); n > 0; n--) {
      var a = i.getNextTablePos;
      if (a && a(i, o, t ? "end" : "start")) break;
      o = this.cm6.moveByChar(o, t);
    }
    var s = this.posFromIndex(o.head);
    return s.line !== e.line ? e : s;
  };
  e.prototype.findPosV = function (e, t, n, i) {
    for (
      var r,
        focusBefore,
        a = this.cm6,
        s = a.state.doc,
        l = n == "page" ? a.dom.clientHeight : 0,
        c = HR(s, e),
        u = EditorSelection.cursor(c, 1, undefined, i),
        h = Math.round(Math.abs(t)),
        p = t > 0,
        d = function (e) {
          if (n == "page") u = a.moveVertically(u, p, l);
          else if (n == "line") {
            var value = a.moveVertically(u, p),
              i = a.getNextTablePos;
            if (i && i(a, u, p ? "down" : "up"))
              return {
                value: value,
              };
            var s = a.getNextPosUpDown;
            if (s) {
              var c = s(a.state, u, p);
              if (c && Math.abs(value.head - u.head) > Math.abs(c.head - u.head)) value = c;
              else if (h === 1 && !p && bb(a, u.head)) {
                var d = a.state.field(editorInfoField);
                if (QT(d)) {
                  var m = d;
                  focusBefore =
                    ((r = f.state.vimPlugin) === null || undefined === r ? undefined : r.lastKeydown) === "ArrowUp"
                      ? function () {
                          return m.shiftFocusBefore();
                        }
                      : function () {
                          return m.metadataEditor.focus({
                            bottom: !0,
                          });
                        };
                }
              }
            }
            u = value;
          }
        },
        f = this,
        m = 0;
      m < h;
      m++
    ) {
      var g = d();
      if (typeof g == "object") return g.value;
    }
    var v = zR(s, u.head);
    focusBefore && (v.focusBefore = focusBefore);
    ((t < 0 && u.head == 0 && i != 0 && e.line == 0 && e.ch != 0) ||
      (t > 0 && u.head == s.length && v.ch != i && e.line == v.line)) &&
      (v.hitSide = true);
    return v;
  };
  e.prototype.charCoords = function (e, t) {
    var n,
      i,
      r = this.cm6,
      o = HR(r.state.doc, e),
      a = r.coordsAtPos(o) || {
        left: 0,
        top: 0,
        bottom: 0,
      },
      s = a.left,
      l = a.top,
      c = a.bottom,
      u = 0,
      h = 0;
    t === "div"
      ? ((u = (n = r.contentDOM.getBoundingClientRect()).left), (h = n.top))
      : ((u = (i = r.scrollDOM.getBoundingClientRect()).left),
        (h = i.top),
        (u -= r.scrollDOM.scrollLeft),
        (h -= r.scrollDOM.scrollTop));
    return {
      left: s - u,
      top: l - h,
      bottom: c - h,
    };
  };
  e.prototype.coordsChar = function (e, t) {
    var n,
      i,
      r = this.cm6,
      o = 0,
      a = 0;
    t === "div"
      ? ((o = (n = r.contentDOM.getBoundingClientRect()).left), (a = n.top))
      : ((o = (i = r.scrollDOM.getBoundingClientRect()).left),
        (a = i.top),
        (o -= r.scrollDOM.scrollLeft),
        (a -= r.scrollDOM.scrollTop));
    var s = {
        x: e.left + o,
        y: e.top + a,
      },
      l = this.cm6.posAtCoords(s) || 0;
    return zR(this.cm6.state.doc, l);
  };
  e.prototype.getScrollInfo = function () {
    var e = this.cm6.scrollDOM;
    return {
      left: e.scrollLeft,
      top: e.scrollTop,
      height: e.scrollHeight,
      width: e.scrollWidth,
      clientHeight: e.clientHeight,
      clientWidth: e.clientWidth,
    };
  };
  e.prototype.scrollTo = function (scrollLeft, scrollTop) {
    scrollLeft != null && (this.cm6.scrollDOM.scrollLeft = scrollLeft);
    scrollTop != null && (this.cm6.scrollDOM.scrollTop = scrollTop);
  };
  e.prototype.scrollInfo = function () {
    return 0;
  };
  e.prototype.scrollIntoView = function (e, yMargin) {
    e
      ? this.cm6.dispatch({
          effects: EditorView.scrollIntoView(this.indexFromPos(e), {
            yMargin: yMargin,
          }),
        })
      : this.cm6.dispatch({
          scrollIntoView: true,
          userEvent: "scroll",
        });
  };
  e.prototype.getWrapperElement = function () {
    return this.cm6.dom;
  };
  e.prototype.getMode = function () {
    return {
      name: this.getOption("mode"),
    };
  };
  e.prototype.setSize = function (e, t) {
    this.cm6.dom.style.width = e + 4 + "px";
    this.cm6.dom.style.height = t + "px";
    this.refresh();
  };
  e.prototype.refresh = function () {
    this.cm6.measure();
  };
  e.prototype.destroy = function () {
    this.removeOverlay();
  };
  e.prototype.getLastEditEnd = function () {
    return this.posFromIndex(this.$lastChangeEndOffset);
  };
  e.prototype.onChange = function (e) {
    var t = this;
    for (var n in (this.$lineHandleChanges && this.$lineHandleChanges.push(e), this.marks)) {
      this.marks[n].update(e.changes);
    }
    if (this.virtualSelection) {
      this.virtualSelection = EditorSelection.create(
        this.virtualSelection.ranges.map(function (t) {
          return t.map(e.changes);
        }),
        this.virtualSelection.mainIndex,
      );
    }
    var i = (this.curOp = this.curOp || {});
    e.changes.iterChanges(function (e, n, $changeStart, $lastChangeEndOffset, a) {
      (i.$changeStart == null || i.$changeStart > $changeStart) && (i.$changeStart = $changeStart);
      t.$lastChangeEndOffset = $lastChangeEndOffset;
      var lastChange = {
        text: a.toJSON(),
      };
      i.lastChange ? (i.lastChange.next = i.lastChange = lastChange) : (i.lastChange = i.change = lastChange);
    }, !0);
    i.changeHandlers || (i.changeHandlers = this._handlers.change && this._handlers.change.slice());
  };
  e.prototype.onSelectionChange = function () {
    var e = (this.curOp = this.curOp || {});
    e.cursorActivityHandlers ||
      (e.cursorActivityHandlers = this._handlers.cursorActivity && this._handlers.cursorActivity.slice());
    this.curOp.cursorActivity = true;
  };
  e.prototype.operation = function (e, t) {
    var n;
    this.curOp ||
      (this.curOp = {
        $d: 0,
      });
    this.curOp.$d++;
    try {
      n = e();
    } finally {
      if (this.curOp) {
        this.curOp.$d--;
        this.curOp.$d || this.onBeforeEndOperation();
      }
    }
    return n;
  };
  e.prototype.onBeforeEndOperation = function () {
    var e = this.curOp,
      t = false;
    if (e) {
      if (
        (e.change && GR(e.changeHandlers, this, e.change),
        e && e.cursorActivity && (GR(e.cursorActivityHandlers, this, null), e.isVimOp && (t = true)),
        e.isVimOp)
      ) {
        for (
          var n = foldedRanges(this.cm6.state),
            effects = [],
            r = function (e) {
              n.between(e.from, e.to, function (from, n) {
                if (e.to !== from && e.from !== n) {
                  effects.push(
                    unfoldEffect.of({
                      from: from,
                      to: n,
                    }),
                  );
                }
              });
            },
            o = 0,
            a = this.cm6.state.selection.ranges;
          o < a.length;
          o++
        ) {
          r(a[o]);
        }
        if (effects.length > 0) {
          this.cm6.dispatch({
            effects: effects,
          });
        }
      }
      this.curOp = null;
    }
    if (t) {
      this.scrollIntoView();
    }
  };
  e.prototype.moveH = function (e, t) {
    if (t == "char") {
      var n = this.getCursor();
      this.setCursor(n.line, n.ch + e);
    }
  };
  e.prototype.setOption = function (e, keyMap) {
    switch (e) {
      case "keyMap":
        this.state.keyMap = keyMap;
        break;
      case "textwidth":
        this.state.textwidth = keyMap;
    }
  };
  e.prototype.getOption = function (e) {
    switch (e) {
      case "firstLineNumber":
        return 1;
      case "tabSize":
        return this.cm6.state.tabSize || 4;
      case "readOnly":
        return this.cm6.state.readOnly;
      case "indentWithTabs":
        return this.cm6.state.facet(indentUnit) == "\t";
      case "indentUnit":
        return this.cm6.state.facet(indentUnit).length || 2;
      case "textwidth":
        return this.state.textwidth;
      case "keyMap":
        return this.state.keyMap || "vim";
    }
  };
  e.prototype.toggleOverwrite = function (overwrite) {
    this.state.overwrite = overwrite;
  };
  e.prototype.getTokenTypeAt = function (e) {
    var t,
      n = this.indexFromPos(e),
      i = ensureSyntaxTree(this.cm6.state, n),
      r = i == null ? undefined : i.resolve(n),
      o = ((t = r == null ? undefined : r.type) === null || undefined === t ? undefined : t.name) || "";
    return /comment/i.test(o) ? "comment" : /string/i.test(o) ? "string" : "";
  };
  e.prototype.overWriteSelection = function (e) {
    var t = this.cm6.state.doc,
      n = this.cm6.state.selection,
      i = n.ranges.map(function (e) {
        if (e.empty) {
          var n = e.to < t.length ? t.sliceString(e.from, e.to + 1) : "";
          if (n && !/\n/.test(n)) return EditorSelection.range(e.from, e.to + 1);
        }
        return e;
      });
    this.cm6.dispatch({
      selection: EditorSelection.create(i, n.mainIndex),
    });
    this.replaceSelection(e);
  };
  e.prototype.isInMultiSelectMode = function () {
    return this.cm6.state.selection.ranges.length > 1;
  };
  e.prototype.virtualSelectionMode = function () {
    return !!this.virtualSelection;
  };
  e.prototype.forEachSelection = function (e) {
    var t = this.cm6.state.selection;
    this.virtualSelection = EditorSelection.create(t.ranges, t.mainIndex);
    for (var n = 0; n < this.virtualSelection.ranges.length; n++) {
      var i = this.virtualSelection.ranges[n];
      if (i) {
        this.cm6.dispatch({
          selection: EditorSelection.create([i]),
        });
        e();
        this.virtualSelection.ranges[n] = this.cm6.state.selection.ranges[0];
      }
    }
    this.cm6.dispatch({
      selection: this.virtualSelection,
    });
    this.virtualSelection = null;
  };
  e.prototype.hardWrap = function (e) {
    return (function (e, t) {
      var n,
        i = t.column || e.getOption("textwidth") || 80,
        r = t.allowMerge != 0,
        o = Math.min(t.from, t.to),
        a = Math.max(t.from, t.to);
      for (; o <= a; ) {
        var s = e.getLine(o);
        if (s.length > i) {
          if ((u = f(s, i, 5))) {
            var l = (n = /^\s*/.exec(s)) === null || undefined === n ? undefined : n[0];
            e.replaceRange("\n" + l, new Pos(o, u.start), new Pos(o, u.end));
          }
          a++;
        } else if (r && /\S/.test(s) && o != a) {
          var c = e.getLine(o + 1);
          if (c && /\S/.test(c)) {
            var u,
              h = s.replace(/\s+$/, ""),
              p = c.replace(/^\s+/, ""),
              d = h + " " + p;
            ((u = f(d, i, 5)) && u.start > h.length) || d.length < i
              ? (e.replaceRange(" ", new Pos(o, h.length), new Pos(o + 1, c.length - p.length)), o--, a--)
              : h.length < s.length && e.replaceRange("", new Pos(o, h.length), new Pos(o, s.length));
          }
        }
        o++;
      }
      return o;
      function f(e, t, n) {
        if (!(e.length < t)) {
          var i = e.slice(0, t),
            r = e.slice(t),
            o = /^(?:(\s+)|(\S+)(\s+))/.exec(r),
            a = /(?:(\s+)|(\s+)(\S+))$/.exec(i),
            start = 0,
            l = 0;
          a && !a[2] && ((start = t - a[1].length), (l = t));
          o && !o[2] && (start || (start = t), (l = t + o[1].length));
          return start
            ? {
                start: start,
                end: l,
              }
            : a && a[2] && a.index > n
              ? {
                  start: a.index,
                  end: a.index + a[2].length,
                }
              : o && o[2]
                ? {
                    start: (start = t + o[2].length),
                    end: start + o[3].length,
                  }
                : undefined;
        }
      }
    })(this, e);
  };
  e.isMac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
  e.Pos = Pos;
  e.StringStream = StringStream;
  e.commands = {
    cursorCharLeft: function (e) {
      cursorCharLeft(e.cm6);
    },
    redo: function (e) {
      YR(e, !1);
    },
    undo: function (e) {
      YR(e, !0);
    },
    newlineAndIndent: function (e) {
      insertNewlineAndIndent({
        state: e.cm6.state,
        dispatch: function (t) {
          return KR(e, t);
        },
      });
    },
    newlineAndIndentBefore: function (e) {
      VR(e.cm6);
    },
    indentAuto: function (e) {
      indentSelection(e.cm6);
    },
  };
  e.isWordChar = function (e) {
    return qR.test(e);
  };
  e.keys = keys;
  e.addClass = function () {};
  e.rmClass = function () {};
  e.e_preventDefault = function (e) {
    e.preventDefault();
  };
  e.e_stop = function (e) {
    var t, n;
    (t = e == null ? undefined : e.stopPropagation) === null || undefined === t || t.call(e);
    (n = e == null ? undefined : e.preventDefault) === null || undefined === n || n.call(e);
  };
  e.lookupKey = function (t, n, i) {
    var r = e.keys[t];
    if (r) {
      i(r);
    }
  };
  e.on = UR;
  e.off = off;
  e.signal = signal;
  e.findMatchingTag = findMatchingTag;
  e.findEnclosingTag = findEnclosingTag;
  e.keyName = undefined;
  return e;
})();
function QR(e, t, n) {
  var i = document.createElement("div");
  i.appendChild(t);
  return i;
}
function $R(e, currentNotificationClose) {
  e.state.currentNotificationClose && e.state.currentNotificationClose();
  e.state.currentNotificationClose = currentNotificationClose;
}
function JR(e, dialog) {
  var n = e.state.dialog;
  e.state.dialog = dialog;
  dialog &&
    n !== dialog &&
    (n && n.contains(document.activeElement) && e.focus(),
    n && n.parentElement ? n.parentElement.replaceChild(dialog, n) : n && n.remove(),
    CodeMirrorAdapter.signal(e, "dialog"));
}
function eB(e, t) {
  if (e.state.dialog == t) {
    e.state.dialog = null;
    CodeMirrorAdapter.signal(e, "dialog");
  }
}
function tB(e, t, n, i) {
  i || (i = {});
  $R(e, undefined);
  var r = QR(0, t, i.bottom),
    o = false;
  function a(value) {
    if (typeof value == "string") s.value = value;
    else {
      if (o) return;
      o = true;
      eB(e, r);
      e.state.dialog || e.focus();
      i.onClose && i.onClose(r);
    }
  }
  JR(e, r);
  var s = r.getElementsByTagName("input")[0];
  s &&
    (i.value && ((s.value = i.value), !1 !== i.selectValueOnOpen && s.select()),
    i.onInput &&
      CodeMirrorAdapter.on(s, "input", function (e) {
        i.onInput(e, s.value, a);
      }),
    i.onKeyUp &&
      CodeMirrorAdapter.on(s, "keyup", function (e) {
        i.onKeyUp(e, s.value, a);
      }),
    CodeMirrorAdapter.on(s, "keydown", function (e) {
      if (!(i && i.onKeyDown && i.onKeyDown(e, s.value, a))) {
        e.keyCode == 13 && n(s.value);
        (e.keyCode == 27 || (!1 !== i.closeOnEnter && e.keyCode == 13)) && (s.blur(), CodeMirrorAdapter.e_stop(e), a());
      }
    }),
    !1 !== i.closeOnBlur &&
      CodeMirrorAdapter.on(s, "blur", function () {
        setTimeout(function () {
          if (document.activeElement !== s) {
            a();
          }
        });
      }),
    s.focus());
  return a;
}
var nB = {
  "(": ")>",
  ")": "(<",
  "[": "]>",
  "]": "[<",
  "{": "}>",
  "}": "{<",
  "<": ">>",
  ">": "<<",
};
function findMatchingTag(e, t) {}
function findEnclosingTag(e, t) {
  var n,
    i,
    r = e.cm6.state,
    o = e.indexFromPos(t);
  if (o < r.doc.length && r.sliceDoc(o, o + 1) == "<") {
    o++;
  }
  for (var a = ensureSyntaxTree(r, o), s = (a == null ? undefined : a.resolve(o)) || null; s; ) {
    if (
      ((n = s.firstChild) === null || undefined === n ? undefined : n.type.name) == "OpenTag" &&
      ((i = s.lastChild) === null || undefined === i ? undefined : i.type.name) == "CloseTag"
    )
      return {
        open: oB(r.doc, s.firstChild),
        close: oB(r.doc, s.lastChild),
      };
    s = s.parent;
  }
}
function oB(e, t) {
  return {
    from: zR(e, t.from),
    to: zR(e, t.to),
  };
}
var aB = (function () {
  function e(e, offset, assoc) {
    this.cm = e;
    this.id = e.$mid++;
    this.offset = offset;
    this.assoc = assoc;
    e.marks[this.id] = this;
  }
  e.prototype.clear = function () {
    delete this.cm.marks[this.id];
  };
  e.prototype.find = function () {
    return this.offset == null ? null : this.cm.posFromIndex(this.offset);
  };
  e.prototype.update = function (e) {
    if (this.offset != null) {
      this.offset = e.mapPos(this.offset, this.assoc, MapMode.TrackDel);
    }
  };
  return e;
})();
var sB =
    typeof navigator != "undefined" && /linux/i.test(navigator.platform) && / Gecko\/\d+/.exec(navigator.userAgent),
  Vim = initVimMode(CodeMirrorAdapter);
CodeMirrorAdapter.Vim = Vim;
window.CodeMirrorAdapter = CodeMirrorAdapter;
var cB = EditorView.theme({
    ".cm-vimMode .cm-cursorLayer:not(.cm-vimCursorLayer)": {
      display: "none",
    },
    ".cm-vim-panel": {
      padding: "0px 10px",
      fontFamily: "monospace",
      minHeight: "1.3em",
    },
    ".cm-vim-panel input": {
      background: "transparent",
      border: "none",
      outline: "none",
    },
  }),
  uB = ViewPlugin.fromClass(
    (function () {
      function e(view) {
        var t = this;
        this.status = "";
        this.query = null;
        this.decorations = Decoration.none;
        this.waitForCopy = false;
        this.lastKeydown = "";
        this.useNextTextInput = false;
        this.compositionText = "";
        this.view = view;
        var n = (this.cm = new CodeMirrorAdapter(view));
        Vim.enterVimMode(this.cm);
        this.view.cm = this.cm;
        this.cm.state.vimPlugin = this;
        this.blockCursor = new NR(view, n);
        this.updateClass();
        this.cm.on("vim-command-done", function () {
          n.state.vim && (n.state.vim.status = "");
          t.blockCursor.scheduleRedraw();
          t.updateStatus();
        });
        this.cm.on("vim-mode-change", function (e) {
          if (n.state.vim) {
            n.state.vim.mode = e.mode;
            e.subMode && (n.state.vim.mode += " block");
            n.state.vim.status = "";
            t.blockCursor.scheduleRedraw();
            t.updateClass();
            t.updateStatus();
          }
        });
        this.cm.on("dialog", function () {
          t.cm.state.statusbar
            ? t.updateStatus()
            : view.dispatch({
                effects: pB.of(!!t.cm.state.dialog),
              });
        });
        this.dom = document.createElement("span");
        this.dom.style.cssText = "position: absolute; right: 10px; top: 1px";
        this.statusButton = document.createElement("span");
        this.statusButton.onclick = function (e) {
          Vim.handleKey(t.cm, "<Esc>", "user");
          t.cm.focus();
        };
        this.statusButton.style.cssText = "cursor: pointer";
      }
      e.prototype.update = function (e) {
        var t;
        if (
          ((e.viewportChanged || e.docChanged) && this.query && this.highlight(this.query),
          e.docChanged && this.cm.onChange(e),
          e.selectionSet && this.cm.onSelectionChange(),
          e.viewportChanged,
          this.cm.curOp && !this.cm.curOp.isVimOp && this.cm.onBeforeEndOperation(),
          e.transactions)
        )
          for (var n = 0, i = e.transactions; n < i.length; n++)
            for (var r = 0, o = i[n].effects; r < o.length; r++) {
              var a = o[r];
              if (a.is(setSearchQuery))
                if ((t = a.value) === null || undefined === t ? undefined : t.forVim) {
                  var s = a.value.create();
                  this.highlight(s);
                } else this.highlight(null);
            }
        this.blockCursor.update(e);
      };
      e.prototype.updateClass = function () {
        var e = this.cm.state;
        !e.vim || (e.vim.insertMode && !e.overwrite)
          ? this.view.scrollDOM.classList.remove("cm-vimMode")
          : this.view.scrollDOM.classList.add("cm-vimMode");
      };
      e.prototype.updateStatus = function () {
        var e = this.cm.state.statusbar,
          t = this.cm.state.vim;
        if (e && t) {
          var n = this.cm.state.dialog;
          if (n) {
            if (n.parentElement != e) {
              e.textContent = "";
              e.appendChild(n);
            }
          } else {
            e.textContent = "";
            var i = (t.mode || "normal").toUpperCase();
            t.insertModeReturn && (i += "(C-O)");
            this.statusButton.textContent = "--".concat(i, "--");
            e.appendChild(this.statusButton);
          }
          this.dom.textContent = t.status;
          e.appendChild(this.dom);
        }
      };
      e.prototype.destroy = function () {
        Vim.leaveVimMode(this.cm);
        this.cm.state.vim = null;
        this.updateClass();
        this.blockCursor.destroy();
        delete this.view.cm;
      };
      e.prototype.highlight = function (query) {
        if (((this.query = query), !query)) return (this.decorations = Decoration.none);
        for (var t = this.view, n = new RangeSetBuilder(), i = 0, r = t.visibleRanges, o = r.length; i < o; i++) {
          for (var a = r[i], s = a.from, l = a.to; i < o - 1 && l > r[i + 1].from - 500; ) l = r[++i].to;
          query.highlight(t.state, s, l, function (e, t) {
            n.add(e, t, hB);
          });
        }
        return (this.decorations = n.finish());
      };
      e.prototype.handleKey = function (e, t) {
        var n = this.cm,
          i = n.state.vim;
        if (i) {
          var r = Vim.vimKeyFromEvent(e, i);
          if (
            (CodeMirror.signal(this.cm, "inputEvent", {
              type: "handleKey",
              key: r,
            }),
            r)
          ) {
            if (r == "<Esc>" && !i.insertMode && !i.visualMode && this.query) {
              var o = i.searchState_;
              if (o) {
                n.removeOverlay(o.getOverlay());
                o.setOverlay(null);
              }
            }
            var a;
            if (r === "<C-c>" && !CodeMirrorAdapter.isMac && n.somethingSelected()) {
              this.waitForCopy = true;
              return !0;
            }
            i.status = (i.status || "") + r;
            try {
              a = Vim.multiSelectHandleKey(n, r, "user");
            } catch (e) {
              console.error(e);
              n.state.vim.insertMode || (a = true);
            }
            i = Vim.maybeInitVimState_(n);
            !a &&
              i.insertMode &&
              n.state.overwrite &&
              (e.key && e.key.length == 1 && e.key && !/\n/.test(e.key)
                ? ((a = true), n.overWriteSelection(e.key))
                : e.key == "Backspace" && ((a = true), CodeMirrorAdapter.commands.cursorCharLeft(n)));
            a &&
              (CodeMirrorAdapter.signal(this.cm, "vim-keypress", r),
              e.preventDefault(),
              e.stopPropagation(),
              this.blockCursor.scheduleRedraw());
            this.updateStatus();
            return !!a;
          }
        }
      };
      return e;
    })(),
    {
      eventHandlers: {
        copy: function (e, t) {
          var n = this;
          if (this.waitForCopy) {
            this.waitForCopy = false;
            Promise.resolve().then(function () {
              var e = n.cm,
                t = e.state.vim;
              t &&
                (t.insertMode
                  ? e.setSelection(e.getCursor(), e.getCursor())
                  : e.operation(function () {
                      e.curOp && (e.curOp.isVimOp = true);
                      Vim.handleKey(e, "<Esc>", "user");
                    }));
            });
          }
        },
        compositionstart: function (e, t) {
          this.useNextTextInput = true;
          CodeMirror.signal(this.cm, "inputEvent", e);
        },
        compositionupdate: function (e, t) {
          CodeMirror.signal(this.cm, "inputEvent", e);
        },
        compositionend: function (e, t) {
          CodeMirror.signal(this.cm, "inputEvent", e);
        },
        keypress: function (e, t) {
          if (this.lastKeydown == "Dead") {
            this.handleKey(e, t);
          }
        },
        keydown: function (e, t) {
          CodeMirror.signal(this.cm, "inputEvent", e);
          this.lastKeydown = e.key;
          this.lastKeydown == "Unidentified" || this.lastKeydown == "Process" || this.lastKeydown == "Dead"
            ? (this.useNextTextInput = true)
            : ((this.useNextTextInput = false), this.handleKey(e, t));
        },
      },
      provide: function () {
        return [
          EditorView.inputHandler.of(function (e, from, n, texti0) {
            var r,
              o,
              a = e.cm || null;
            if (!a) return !1;
            var s = (r = a.state) === null || undefined === r ? undefined : r.vim,
              l = a.state.vimPlugin;
            if (s && !s.insertMode && !((o = a.curOp) === null || undefined === o ? undefined : o.isVimOp)) {
              if (texti0 === "\0\0") return !0;
              if (
                (CodeMirror.signal(a, "inputEvent", {
                  type: "text",
                  text: texti0,
                  from: from,
                  to: n,
                }),
                texti0.length == 1 && l.useNextTextInput)
              ) {
                if (s.expectLiteralNext && e.composing) {
                  l.compositionText = texti0;
                  return !1;
                }
                if (l.compositionText) {
                  var c = l.compositionText;
                  l.compositionText = "";
                  var u = e.state.selection.main.head;
                  if (c === e.state.sliceDoc(u - c.length, u)) {
                    var h = a.getCursor();
                    a.replaceRange("", a.posFromIndex(u - c.length), h);
                  }
                }
                l.handleKey({
                  key: texti0,
                  preventDefault: function () {},
                  stopPropagation: function () {},
                });
                (function (e) {
                  var t = e.scrollDOM.parentElement;
                  if (!t) return;
                  if (sB) {
                    e.contentDOM.textContent = "\0\0";
                    return void e.contentDOM.dispatchEvent(new CustomEvent("compositionend"));
                  }
                  var n = e.scrollDOM.nextSibling,
                    i = window.getSelection(),
                    r = i && {
                      anchorNode: i.anchorNode,
                      anchorOffset: i.anchorOffset,
                      focusNode: i.focusNode,
                      focusOffset: i.focusOffset,
                    };
                  e.scrollDOM.remove();
                  t.insertBefore(e.scrollDOM, n);
                  try {
                    if (r && i) {
                      i.setPosition(r.anchorNode, r.anchorOffset);
                      r.focusNode && i.extend(r.focusNode, r.focusOffset);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                  e.focus();
                  e.contentDOM.dispatchEvent(new CustomEvent("compositionend"));
                })(e);
                return !0;
              }
            }
            return !1;
          }),
        ];
      },
      decorations: function (e) {
        return e.decorations;
      },
    },
  );
var hB = Decoration.mark({
    class: "obsidian-search-match-highlight",
  }),
  pB = StateEffect.define(),
  dB = StateField.define({
    create: function () {
      return !1;
    },
    update: function (e, t) {
      for (var n = 0, i = t.effects; n < i.length; n++) {
        var r = i[n];
        if (r.is(pB)) {
          e = r.value;
        }
      }
      return e;
    },
    provide: function (e) {
      return showPanel.from(e, function (e) {
        return e ? fB : null;
      });
    },
  });
function fB(e) {
  var t = document.createElement("div");
  t.className = "cm-vim-panel";
  var n = e.cm;
  n.state.dialog && t.appendChild(n.state.dialog);
  return {
    top: false,
    dom: t,
  };
}
var mB,
  gB,
  vB,
  yB = ["=", "~", "$", "%"],
  bB = EditorView.inputHandler.of(function (e, t, n, insert) {
    if (e.composing || e.state.readOnly) return !1;
    var r = e.state.selection.main;
    if (
      insert.length > 2 ||
      (insert.length == 2 && codePointSize(codePointAt(insert, 0)) == 1) ||
      t != r.from ||
      n != r.to
    )
      return !1;
    for (
      var o = e.state,
        a = function (t) {
          if (insert !== t) return "continue";
          var n = null,
            r = o.changeByRange(function (e) {
              return e.empty
                ? {
                    range: (n = e),
                  }
                : {
                    changes: [
                      {
                        insert: insert,
                        from: e.from,
                      },
                      {
                        insert: insert,
                        from: e.to,
                      },
                    ],
                    range: EditorSelection.range(e.anchor + insert.length, e.head + insert.length),
                  };
            });
          return n
            ? {
                value: !1,
              }
            : (e.dispatch(
                o.update(r, {
                  scrollIntoView: true,
                  userEvent: "input.type",
                }),
              ),
              {
                value: !0,
              });
        },
        s = 0,
        l = yB;
      s < l.length;
      s++
    ) {
      var c = a(l[s]);
      if (typeof c == "object") return c.value;
    }
    return !1;
  }),
  wB = "obsidian-search-match-highlight",
  kB = (function () {
    function e(app, containerEl) {
      var n = this;
      this.replaceInputEl = null;
      this.scope = null;
      this.app = app;
      this.containerEl = containerEl;
      this.searchContainerEl = createDiv("document-search-container");
      var i = this.searchContainerEl.createDiv("document-search"),
        r = i.createDiv("search-input-container document-search-input");
      this.searchInputEl = r.createEl("input", {
        type: "text",
        placeholder: i18nProxy.editor.search.placeholderFind(),
      });
      this.countEl = r.createDiv("document-search-count");
      this.searchInputEl.addEventListener("input", this.onSearchInput.bind(this));
      this.searchInputEl.addEventListener("keydown", function (e) {
        if (!(e.isComposing || Platform.hasPhysicalKeyboard || e.key !== "Enter")) {
          e.preventDefault();
          clearFocusAndSelection();
        }
      });
      this.searchButtonContainerEl = i.createDiv({
        cls: "document-search-buttons",
        type: "text",
      });
      this.searchButtonContainerEl.createEl(
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
            n.findPrevious();
          });
        },
      );
      this.searchButtonContainerEl.createEl(
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
            n.findNext();
          });
        },
      );
      i.createDiv("clickable-icon document-search-close-button", function (e) {
        setIcon(e, "lucide-x");
        setTooltip(e, i18nProxy.editor.search.labelExitSearch(), {
          placement: "top",
        });
        e.addEventListener("click", function (e) {
          e.preventDefault();
          n.hide();
        });
      });
      var o = (this.scope = new Scope(app.scope));
      o.register([], "F3", this.findNext.bind(this));
      o.register(["Mod"], "G", this.findNext.bind(this));
      o.register(["Shift"], "F3", this.findPrevious.bind(this));
      o.register(["Mod", "Shift"], "G", this.findPrevious.bind(this));
      o.register([], "Enter", this.onEnter.bind(this));
      o.register(["Shift"], "Enter", this.onShiftEnter.bind(this));
      o.register([], "Escape", this.hide.bind(this));
      o.register([], "Tab", this.goToNextInput.bind(this));
      o.register(["Shift"], "Tab", this.goToNextInput.bind(this));
    }
    e.prototype.getQuery = function () {
      return this.searchInputEl.value;
    };
    e.prototype.goToNextInput = function (e) {
      if (this.replaceInputEl) {
        this.searchInputEl.isActiveElement()
          ? (this.replaceInputEl.focus(), e.preventDefault())
          : this.replaceInputEl.isActiveElement() && (this.searchInputEl.focus(), e.preventDefault());
      }
    };
    e.prototype.onEnter = function (e) {
      var t;
      if (
        !(
          e.isComposing ||
          (!this.searchInputEl.isActiveElement() &&
            !((t = this.replaceInputEl) === null || undefined === t ? undefined : t.isActiveElement()))
        )
      ) {
        this.findNextOrReplace();
      }
    };
    e.prototype.onShiftEnter = function (e) {
      var t;
      if (
        !(
          e.isComposing ||
          (!this.searchInputEl.isActiveElement() &&
            !((t = this.replaceInputEl) === null || undefined === t ? undefined : t.isActiveElement()))
        )
      ) {
        this.findPrevious();
      }
    };
    return e;
  })(),
  CB = (function (e) {
    function t(t, editor, i, applyScope) {
      var o = e.call(this, t, i) || this;
      o.editor = null;
      o.cursor = null;
      o.isActive = false;
      o.isReplace = false;
      o.requestUpdateCount = debounce(o.updateCount.bind(o), 20, !0);
      o.editor = editor;
      o.applyScope = applyScope;
      o.searchButtonContainerEl.createEl(
        "button",
        {
          cls: "clickable-icon document-search-button",
        },
        function (e) {
          setIcon(e, "lucide-text-select");
          setTooltip(e, i18nProxy.editor.search.labelFindAll() + "\n" + HO(BO(["Alt"], "Enter")), {
            placement: "top",
          });
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            o.searchAll();
          });
        },
      );
      var a = o.searchContainerEl.createDiv("document-replace");
      o.replaceInputEl = a.createEl("input", {
        cls: "document-replace-input",
        type: "text",
      });
      o.replaceInputEl.setAttribute("placeholder", i18nProxy.editor.search.placeholderReplace());
      var s = a.createDiv({
        cls: "document-replace-buttons",
        type: "text",
      });
      s.createEl(
        "button",
        {
          cls: "clickable-icon document-search-button",
        },
        function (e) {
          setIcon(e, "lucide-replace");
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            o.replaceCurrentMatch();
          });
          setTooltip(e, i18nProxy.editor.search.labelReplace() + "\n" + HO(BO([], "Enter")), {
            placement: "top",
          });
        },
      );
      s.createEl(
        "button",
        {
          cls: "clickable-icon document-search-button",
        },
        function (e) {
          setIcon(e, "lucide-replace-all");
          setTooltip(e, i18nProxy.editor.search.labelReplaceAll() + "\n" + HO(BO(["Mod", "Alt"], "Enter")), {
            placement: "top",
          });
          e.addEventListener("mousedown", function (e) {
            return e.preventDefault();
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            o.replaceAll();
          });
        },
      );
      o.scope.register(["Alt"], "Enter", o.onAltEnter.bind(o));
      o.scope.register(["Mod", "Alt"], "Enter", o.onModAltEnter.bind(o));
      return o;
    }
    __extends(t, e);
    t.prototype.show = function (isReplace) {
      undefined === isReplace && (isReplace = false);
      this.isActive = true;
      this.isReplace = isReplace;
      var t = this,
        n = t.containerEl,
        i = t.searchContainerEl,
        r = t.editor,
        o = t.searchInputEl;
      i.toggleClass("mod-replace-mode", isReplace);
      n.prepend(i);
      var value = r.getSelection();
      value && (o.value = value);
      o.focus();
      o.select();
      this.applyScope(this.scope);
      this.onSearchInput();
    };
    t.prototype.hide = function () {
      if (this.isActive) {
        this.isActive = false;
        var e = this,
          t = e.editor,
          n = e.searchContainerEl,
          i = e.searchInputEl;
        if (this.cursor && (i.isActiveElement() || this.replaceInputEl.isActiveElement())) {
          var r = this.cursor.current();
          if (r) {
            t.setSelection(r.from, r.to);
          }
        }
        n.detach();
        i.value = "";
        i.removeClass("mod-no-match");
        this.cursor = null;
        t.removeHighlights("obsidian-search-match-highlight");
        this.applyScope(null);
        t.focus();
      }
    };
    t.prototype.updateCount = function () {
      var e,
        t = 0,
        n = 0,
        i = this.getQuery();
      this.cursor && i && ((t = (e = this.cursor.getIndexAndCount())[0]), (n = e[1]));
      this.countEl.toggle(!!i);
      this.countEl.setText("".concat(t, " / ").concat(n));
    };
    t.prototype.onSearchInput = function () {
      var e = this.getQuery();
      this.cursor = this.editor.searchCursor(e);
      var t = e ? this.cursor.findNext() : null;
      t ? this.highlight([t]) : this.clear();
      this.searchInputEl.toggleClass("mod-no-match", e && !t);
      this.requestUpdateCount();
    };
    t.prototype.findPrevious = function () {
      if (this.cursor) {
        var e = this.cursor.findPrevious();
        e ? this.highlight([e]) : this.clear();
        this.requestUpdateCount();
      }
    };
    t.prototype.findNextOrReplace = function () {
      if (this.cursor) {
        var e = this.replaceInputEl.value;
        this.replaceInputEl.isActiveElement() && e !== "" && this.cursor.replace(e, "searchReplace");
        this.findNext();
      }
    };
    t.prototype.replaceCurrentMatch = function () {
      if (this.cursor) {
        var e = this.replaceInputEl.value;
        this.cursor.replace(e, "searchReplace");
        this.findNext();
      }
    };
    t.prototype.replaceAll = function () {
      var e = this.replaceInputEl.value;
      this.cursor.replaceAll(e, "searchReplace");
    };
    t.prototype.findNext = function () {
      if (this.cursor) {
        var e = this.cursor.findNext();
        e ? this.highlight([e]) : this.clear();
        this.requestUpdateCount();
      }
    };
    t.prototype.searchAll = function () {
      var e = this.cursor.findAll();
      this.highlight(e);
    };
    t.prototype.highlight = function (e) {
      this.editor.addHighlights(e, wB, !0, !0);
      var t = e[0];
      if (t) {
        this.editor.scrollIntoView(t, !0);
      }
    };
    t.prototype.clear = function () {
      this.editor.removeHighlights(wB);
    };
    t.prototype.onAltEnter = function (e) {
      if (this.searchInputEl.isActiveElement() || this.replaceInputEl.isActiveElement()) {
        this.searchAll();
      }
    };
    t.prototype.onModAltEnter = function (e) {
      if (this.isReplace && this.replaceInputEl.isActiveElement()) {
        this.replaceAll();
      }
    };
    return t;
  })(kB),
  EB = window.CodeMirror,
  SB = /^(?:[*\-+]|^[0-9]+([.)]))\s+/,
  MB =
    /^(?:(?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i,
  xB =
    /^(?:(?:[^<>()[\]\\.,;:\s@\"`]+(?:\.[^<>()[\]\\.,;:\s@\"]+)*)|(?:\".+\"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/,
  TB = /^(?:[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s])+/;
function DB(e) {
  return /[a-z]/i.test(e);
}
!(function (e) {
  e[(e.NONE = 0)] = "NONE";
  e[(e.NORMAL = 1)] = "NORMAL";
  e[(e.WITH_SPACE = 2)] = "WITH_SPACE";
})(gB || (gB = {}));
(function (e) {
  e[(e.NONE = 0)] = "NONE";
  e[(e.SIMPLE = 1)] = "SIMPLE";
  e[(e.NORMAL = 2)] = "NORMAL";
})(vB || (vB = {}));
var AB,
  PB,
  LB = /^\s*[^\|].*?\|.*[^|]\s*$/,
  IB = /^\s*[^\|].*\|/,
  OB = /^\|(?:[^|]+\|)+?\s*$/,
  FB = /^\|/,
  NB = /^\s*-+\s*:\s*$/,
  RB = /^\s*:\s*-+\s*$/,
  BB = /^\s*:\s*-+\s*:\s*$/,
  VB = /^\s*-+\s*$/;
!(function (e) {
  e[(e.NONE = 0)] = "NONE";
  e[(e.FRONT_MATTER = 1)] = "FRONT_MATTER";
  e[(e.FRONT_MATTER_END = 2)] = "FRONT_MATTER_END";
})(AB || (AB = {}));
(function (e) {
  e[(e.NONE = 0)] = "NONE";
  e[(e.BARELINK = 1)] = "BARELINK";
  e[(e.FOOTREF = 2)] = "FOOTREF";
  e[(e.NORMAL = 3)] = "NORMAL";
  e[(e.FOOTNOTE = 4)] = "FOOTNOTE";
  e[(e.MAYBE_FOOTNOTE_URL = 5)] = "MAYBE_FOOTNOTE_URL";
  e[(e.MAYBE_FOOTNOTE_URL_TITLE = 6)] = "MAYBE_FOOTNOTE_URL_TITLE";
  e[(e.BARELINK2 = 7)] = "BARELINK2";
  e[(e.FOOTREF2 = 8)] = "FOOTREF2";
  e[(e.INTERNAL_LINK = 9)] = "INTERNAL_LINK";
  e[(e.EMBED = 10)] = "EMBED";
})(PB || (PB = {}));
var HB =
  (((mB = {})[PB.BARELINK] = "hmd-barelink"),
  (mB[PB.BARELINK2] = "hmd-barelink2"),
  (mB[PB.FOOTREF] = "hmd-barelink footref"),
  (mB[PB.FOOTNOTE] = "hmd-barelink hmd-footnote line-HyperMD-footnote"),
  (mB[PB.FOOTREF2] = "hmd-footref2"),
  (mB[PB.INTERNAL_LINK] = "hmd-internal-link"),
  (mB[PB.EMBED] = "hmd-internal-link hmd-embed"),
  mB);
function zB(e) {
  e.hmdTable = vB.NONE;
  e.hmdTableRTL = false;
  e.hmdTableColumns = [];
  e.hmdTableID = null;
  e.hmdTableCol = e.hmdTableRow = 0;
}
var qB,
  tokenTypeOverrides = {
    hr: "line-HyperMD-hr line-background-HyperMD-hr-bg hr",
    list1: "list-1",
    list2: "list-2",
    list3: "list-3",
    code: "inline-code",
    hashtag: "hashtag meta",
  };
function UB(e, t) {
  return e.replace(new RegExp("\\s?[^\\s]*".concat(t, "[^\\s]*"), "g"), "");
}
window.CodeMirror.defineMode(
  "hypermd",
  function (e, t) {
    var n = {
      front_matter: true,
      math: true,
      table: true,
      toc: true,
      orgModeMarkup: true,
      hashtag: true,
      fencedCodeBlockHighlighting: true,
      name: "markdown",
      highlightFormatting: true,
      taskLists: true,
      strikethrough: true,
      emoji: false,
      highlight: true,
      tokenTypeOverrides: tokenTypeOverrides,
      headers: true,
      blockquotes: true,
      indentedCode: true,
      lists: true,
      hr: true,
      blockId: true,
    };
    Object.assign(n, t);
    n.tokenTypeOverrides !== tokenTypeOverrides &&
      (n.tokenTypeOverrides = Object.assign({}, tokenTypeOverrides, n.tokenTypeOverrides));
    n.name = "markdown";
    var i = {
        htmlBlock: null,
        block: null,
      },
      r = EB.getMode(e, n),
      o = __assign({}, r);
    function hmdOverride(e, t) {
      var n = t.hmdInnerExitChecker(e, t),
        i = t.hmdInnerStyle,
        r = ((!n || !n.skipInnerMode) && t.hmdInnerMode.token(e, t.hmdInnerState)) || "";
      i && (r += " " + i);
      n
        ? (n.style && (r += " " + n.style),
          n.endPos && (e.pos = n.endPos),
          (t.hmdInnerExitChecker = null),
          (t.hmdInnerMode = null),
          (t.hmdInnerState = null),
          (t.hmdOverride = null))
        : e.start === e.pos && e.skipToEnd();
      return r.trim() || null;
    }
    function s(e) {
      return {
        token: function (t) {
          var pos = t.string.indexOf(e, t.start);
          -1 === pos
            ? t.skipToEnd()
            : pos === 0
              ? (t.pos += e.length)
              : ((t.pos = pos), t.string.charAt(pos - 1) === "\\" && t.pos++);
          return null;
        },
      };
    }
    function l(t, n, hmdInnerMode, r) {
      if (
        (typeof hmdInnerMode == "string" && (hmdInnerMode = EB.getMode(e, hmdInnerMode)),
        !(
          (hmdInnerMode && hmdInnerMode.name !== "null") ||
          (hmdInnerMode = "endTag" in r ? s(r.endTag) : typeof r.fallbackMode == "function" && r.fallbackMode())
        ))
      )
        throw new Error("no mode");
      var o, l;
      n.hmdInnerExitChecker =
        "endTag" in r
          ? ((o = r.endTag),
            l || (l = {}),
            function (e, t) {
              return e.string.substr(e.start, o.length) === o ? ((l.endPos = e.start + o.length), l) : null;
            })
          : r.exitChecker;
      n.hmdInnerStyle = r.style;
      n.hmdInnerMode = hmdInnerMode;
      n.hmdOverride = hmdOverride;
      n.hmdInnerState = EB.startState(hmdInnerMode);
      var c = r.style || "";
      r.skipFirstToken || (c += " " + hmdInnerMode.token(t, n.hmdInnerState));
      return c.trim();
    }
    o.startState = function () {
      var e = r.startState();
      zB(e);
      e.hmdOverride = null;
      e.hmdInnerExitChecker = null;
      e.hmdInnerMode = null;
      e.hmdLinkType = PB.NONE;
      e.hmdNextMaybe = n.front_matter ? AB.FRONT_MATTER : AB.NONE;
      e.hmdNextState = null;
      e.hmdNextStyle = null;
      e.hmdNextPos = null;
      e.hmdHashtag = false;
      i.block = e.block;
      return e;
    };
    o.copyState = function (e) {
      for (
        var t = r.copyState(e),
          n = 0,
          i = [
            "hmdLinkType",
            "hmdNextMaybe",
            "hmdTable",
            "hmdTableID",
            "hmdTableCol",
            "hmdTableRow",
            "hmdOverride",
            "hmdInnerMode",
            "hmdInnerStyle",
            "hmdInnerExitChecker",
            "hmdNextPos",
            "hmdNextState",
            "hmdNextStyle",
            "hmdHashtag",
            "comment",
            "internalLink",
            "internalEmbed",
            "inlineFootnote",
            "hasAlias",
            "isAlias",
            "wasHeading",
            "isHeading",
            "mathed",
            "inFootnote",
          ];
        n < i.length;
        n++
      ) {
        var o = i[n];
        t[o] = e[o];
      }
      t.hmdTableColumns = e.hmdTableColumns.slice(0);
      e.hmdInnerMode && (t.hmdInnerState = EB.copyState(e.hmdInnerMode, e.hmdInnerState));
      return t;
    };
    o.blankLine = function (e) {
      var t,
        n = e.hmdInnerMode;
      n ? n.blankLine && (t = n.blankLine(e.hmdInnerState)) : (t = r.blankLine(e));
      t || (t = "");
      e.hmdNextMaybe === AB.FRONT_MATTER && (e.hmdNextMaybe = AB.NONE);
      e.hmdLinkType && (e.hmdLinkType = PB.NONE);
      e.inFootnote && (t += " line-HyperMD-footnote");
      -1 === e.code && (t += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg");
      zB(e);
      return t.trim() || null;
    };
    o.indent = function (e, t) {
      var n = e.hmdInnerMode || r,
        i = n.indent;
      return typeof i == "function" ? i.apply(n, arguments) : EB.Pass;
    };
    o.innerMode = function (e) {
      return e.hmdInnerMode
        ? {
            mode: e.hmdInnerMode,
            state: e.hmdInnerState,
          }
        : r.innerMode(e);
    };
    o.token = function (t, o) {
      var a;
      if (((t.tabSize = 4), o.hmdOverride)) return o.hmdOverride(t, o);
      if (o.hmdTable && t.peek() === " ") {
        if (t.string[t.pos - 1] === "|" && t.string[t.pos - 2] !== "\\") {
          t.match(/^ +/);
          return "";
        }
        if (t.match(/^ +\|/)) {
          t.backUp(1);
          return "";
        }
      }
      if (o.hmdNextMaybe === AB.FRONT_MATTER) {
        if (t.string === "---") {
          o.hmdNextMaybe = AB.FRONT_MATTER_END;
          return l(t, o, "yaml", {
            style: "hmd-frontmatter",
            fallbackMode: function () {
              return s("---");
            },
            exitChecker: function (e, t) {
              return e.string.startsWith("---") && e.string.substring(3).trim() === ""
                ? ((t.hmdNextMaybe = AB.NONE),
                  {
                    endPos: e.string.length,
                  })
                : null;
            },
          });
        }
        o.hmdNextMaybe = AB.NONE;
      }
      var c = o.f === i.htmlBlock,
        u = -1 === o.code,
        h = o.quote,
        p = t.start === 0;
      if (p) {
        (o.inFootnote && o.hmdLinkType === PB.MAYBE_FOOTNOTE_URL) || (o.hmdLinkType = PB.NONE);
        o.inlineFootnote = false;
        o.wasHeading = o.isHeading;
        o.isHeading = false;
        !o.code || (o.code !== 1 && o.code !== 2) || (o.code = 0);
      }
      var d,
        f,
        m = o.linkText,
        g = o.linkHref,
        v = !(u || c),
        y = v && !(o.code || o.indentedCode || o.linkHref),
        b = "",
        w = false,
        posk0 = -1,
        C = false;
      if (v) {
        if (
          (y && t.peek() === "\\" && (C = true),
          o.list && !o.header && t.peek() === "#" && /^\s*[*\-+]\s$/.test(t.string.substr(0, t.pos)))
        ) {
          var E = t.match(/^(#+)(?: |$)/, !0);
          if (E) {
            var header = E[1].length;
            o.header = header;
            return "formatting formatting-header formatting-header-" + header + " header header-" + header;
          }
        }
        if (
          n.math &&
          y &&
          t.peek() === "$" &&
          (o.hmdLinkType === PB.NONE || o.hmdLinkType === PB.MAYBE_FOOTNOTE_URL) &&
          !o.internalLink &&
          !o.internalEmbed
        ) {
          var M = t.match(/^(\$)[^\s$]/, !1),
            x = t.match(/^(\${2})/, !1),
            T = M ? "$" : "$$";
          if (M)
            if (!((O = t.string.slice(t.pos + 1).match(/[^\\]\$(.|$)/)) && O[0].match(/^[^\s\\]\$([^0-9]|$)/))) {
              M = null;
            }
          var mathed = false;
          if (M || x) {
            if (t.pos !== 0 || o.mathed) {
              var style = "math";
              if (o.quote) {
                style +=
                  " line-HyperMD-quote line-HyperMD-quote-" + o.quote + " line-HyperMD-quote-lazy line-parse-next";
              }
              var P = EB.getMode(e, {
                  name: "stex",
                }),
                skipFirstToken = P.name !== "stex";
              b += l(t, o, P, {
                style: style,
                skipFirstToken: skipFirstToken,
                fallbackMode: function () {
                  return s(T);
                },
                exitChecker: function (e, t) {
                  var endPos = e.start,
                    i = e.string,
                    styler0 = "formatting formatting-math formatting-math-end math-";
                  return t.hmdTable && i[endPos] === "|"
                    ? {
                        endPos: endPos,
                        style: styler0,
                      }
                    : i.substr(endPos, T.length) === T
                      ? {
                          endPos: endPos + T.length,
                          style: styler0,
                        }
                      : null;
                },
              });
              return M
                ? (skipFirstToken && (t.pos += M[1].length), (b += " formatting formatting-math formatting-math-begin"))
                : (skipFirstToken && (t.pos += x[1].length),
                  (b += " formatting formatting-math formatting-math-begin math-block"));
            }
            mathed = true;
            posk0 = 0;
          }
          o.mathed = mathed;
        }
        if (y) {
          o.internalLink
            ? ((o.hmdLinkType = PB.INTERNAL_LINK), (o.internalLink = false))
            : o.internalEmbed && ((o.hmdLinkType = PB.EMBED), (o.internalEmbed = false));
          var I = o.hmdLinkType === PB.INTERNAL_LINK || o.hmdLinkType === PB.EMBED;
          if (I) {
            if (t.peek() === "|") {
              o.isAlias = true;
              posk0 = t.pos + 1;
              b += " link-alias-pipe";
            } else if (t.peek() === "]" && t.match("]]", !1)) {
              o.hmdLinkType = PB.NONE;
              o.linkText = false;
              o.isAlias = false;
              o.hasAlias = false;
              posk0 = t.pos + 2;
              b += " formatting-link formatting-link-end";
            } else {
              w = true;
              o.isAlias && (b += " link-alias");
              o.hasAlias && !o.isAlias && (b += " link-has-alias");
              var O = t.match(/^([^|\]]*?)/, !1);
              posk0 = t.pos + Math.max(1, O[0].length);
            }
          } else if ((O = (t.peek() === "!" || t.peek() === "[") && t.match(/^(!?\[\[)(.*?)]]/, !1))) {
            O[1].charAt(0) === "!"
              ? ((b += " formatting-link formatting-link-start formatting-embed"), (o.internalEmbed = true))
              : ((b += " formatting-link formatting-link-start"), (o.internalLink = true));
            posk0 = t.pos + O[1].length;
            o.hasAlias = O[2].contains("|");
          }
          if (o.hmdLinkType === PB.FOOTREF) {
            if (((w = true), t.peek() === "]")) {
              o.hmdLinkType = PB.NONE;
              posk0 = t.pos + 1;
              b += " formatting formatting-link formatting-link-end " + HB[PB.FOOTREF];
            } else {
              var O = t.match(/^([^\]]*?)/, !1);
              posk0 = t.pos + Math.max(1, O[0].length);
            }
          } else if (!(!(O = t.peek() === "[" && t.match(/^\[\^([^\]\s]*?)\](:?)/, !1)) || (p && O[2]))) {
            t.match("[^");
            b += " formatting formatting-link formatting-link-start";
            o.hmdLinkType = PB.FOOTREF;
            posk0 = t.pos;
          }
          if (n.blockId && t.peek() === "^" && t.match(/^\^([a-zA-Z0-9\-]+)$/)) return (b += " blockid");
          !o.inlineFootnote && t.peek() === "^" && t.match("^[", !1)
            ? ((o.inlineFootnote = true),
              (b += " inline-footnote-start formatting-inline-footnote"),
              (posk0 = t.pos + 2))
            : o.inlineFootnote &&
              !I &&
              o.hmdLinkType === PB.NONE &&
              !o.image &&
              t.match("]") &&
              ((o.inlineFootnote = false),
              (b += " footref inline-footnote inline-footnote-end formatting-inline-footnote"),
              (posk0 = t.pos));
          t.peek() === "%" && t.match("%%", !1)
            ? (o.comment
                ? ((b += " comment formatting comment-end"), (o.comment = false))
                : ((b += " comment formatting comment-start"), (o.comment = true)),
              (posk0 = t.pos + 2))
            : o.comment && (b += " comment");
        }
        if (
          (y &&
            (o.hmdLinkType ||
              o.image ||
              o.linkText ||
              (((DB(t.peek()) && t.match(MB)) || ((f = t.peek()), !/[\s<>()[\]\\.,;:\s@\"`]/.test(f) && t.match(xB))) &&
                ((b += " url"), (posk0 = t.pos)))),
          p && o.inFootnote)
        ) {
          var F = t.match(/^\s*/, !1)[0].replace(/\t/g, "    ").length;
          F && F % t.tabSize == 0 ? (b += " line-HyperMD-footnote") : (o.inFootnote = false);
        }
        var N = p && t.peek() === "[" && t.match(/^\[((?:[^\]\\]|\\.)*)\]:/, !1);
        if (N) {
          var R = N[1];
          if (R[0] !== "^" || !/\s/.test(R)) {
            t.match(/\[\^?/);
            o.hmdLinkType = PB.FOOTNOTE;
            o.formatting = "link";
            o.linkText = true;
            return (b += "formatting formatting-link link " + HB[PB.FOOTNOTE]);
          }
        } else if (o.hmdLinkType === PB.FOOTNOTE) {
          if (t.peek() === "]" && t.match("]:")) {
            b += " formatting formatting-link link " + HB[PB.FOOTNOTE];
            o.linkText = false;
            o.inFootnote = true;
            o.hmdLinkType = PB.MAYBE_FOOTNOTE_URL;
            o.f = o.inline = r.startState().inline;
            return b;
          }
          b += " link " + HB[PB.FOOTNOTE];
        } else if (o.hmdLinkType === PB.MAYBE_FOOTNOTE_URL) {
          if (t.eatSpace()) return b;
          if (DB(t.peek()) && t.match(MB)) {
            b += " url hmd-footnote-url";
            o.hmdLinkType = PB.MAYBE_FOOTNOTE_URL_TITLE;
            return b;
          }
          o.hmdLinkType = PB.NONE;
        } else if (o.hmdLinkType === PB.MAYBE_FOOTNOTE_URL_TITLE) {
          if (t.eatSpace()) return b;
          if (((o.hmdLinkType = PB.NONE), t.match(/^(["']).*?\1/) || t.match(/^\([^)]*?\)/)))
            return (b += " hmd-footnote-url-title");
        }
      }
      if (
        (o.hmdTable &&
          t.peek() === "|" &&
          t.string[t.pos - 1] !== "\\" &&
          (function (e) {
            e.code = false;
            e.comment = false;
            e.em = false;
            e.formatting = false;
            e.highlight = false;
            e.hmdHashtag = false;
            e.hmdLinkType = PB.NONE;
            e.isAlias = false;
            e.internalEmbed = false;
            e.internalLink = false;
            e.linkHref = false;
            e.linkText = false;
            e.linkTitle = false;
            e.strikethrough = false;
            e.strong = false;
          })(o),
        o.hmdNextState)
      ) {
        t.pos = o.hmdNextPos;
        b += " " + (o.hmdNextStyle || "");
        Object.assign(o, o.hmdNextState);
        o.hmdNextState = null;
        o.hmdNextStyle = null;
        o.hmdNextPos = null;
      } else {
        var B = p && t.pos !== 0;
        if (w) {
          var V = r.copyState(o),
            pos = t.pos;
          b += " " + (r.token(t, V) || "");
          t.pos = pos;
        } else b += " " + (r.token(t, o) || "");
        B && o.f === o.block && (o.f = o.inline = r.startState().inline);
        o.inFootnote && (o.indentationDiff = 0);
      }
      b = (function (e, t, n) {
        return t
          ? (!n.hr && e.hr && ((t = UB(t, "hr")), (e.hr = false)),
            !n.headers && e.header && ((t = UB(t, "header")), (e.header = 0)),
            !n.indentedCode && e.indentedCode && ((t = UB(t, "inline-code")), (e.indentedCode = false)),
            !n.blockquotes && e.quote && ((t = UB(t, "quote")), (e.quote = 0)),
            !n.lists && e.list && ((t = UB(t, "list")), (e.list = false)),
            t)
          : t;
      })(o, b, n);
      b.contains("formatting-task") && (b += " line-HyperMD-task-line");
      -1 !== posk0 && (t.pos = posk0);
      o.hmdHashtag && (b += " " + n.tokenTypeOverrides.hashtag);
      o.header && (o.isHeading = true);
      !i.htmlBlock && o.htmlState && (i.htmlBlock = o.f);
      var z = o.f === i.htmlBlock,
        q = -1 === o.code;
      if (((v = v && !(z || q)), (y = y && v && !(o.code || o.indentedCode || o.linkHref)), o.hmdTable && z)) {
        var W = t.current();
        if (/(?:^|[^\\])\|/.test(W) && (b.trim() === "" || /string|attribute|error/.test(b))) {
          z = false;
          c = false;
          o.htmlState = null;
          o.block = i.block;
          o.f = o.inline = r.startState().inline;
          t.pos = W === "|" ? t.start : t.start + 1;
        }
      }
      var U = t.current();
      if (
        (z !== c && (z ? ((b += " hmd-html-begin"), (i.htmlBlock = o.f)) : (b += " hmd-html-end")),
        (u || q) &&
          ((o.localMode && u) || (b = b.replace("inline-code", "")),
          (b += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg hmd-codeblock"),
          q !== u &&
            (q
              ? u || (b += " line-HyperMD-codeblock-begin line-background-HyperMD-codeblock-begin-bg")
              : (b += " line-HyperMD-codeblock-end line-background-HyperMD-codeblock-end-bg")),
          !1 !== o.list &&
            ((a = o.listStack) === null || undefined === a ? undefined : a.length) > 0 &&
            (b += " line-HyperMD-list-line-nobullet line-HyperMD-list-line")),
        v)
      ) {
        var hmdTable = o.hmdTable;
        if (p && hmdTable)
          (hmdTable == vB.SIMPLE ? IB : FB).test(t.string) ? ((o.hmdTableCol = 0), o.hmdTableRow++) : zB(o);
        if (
          (p &&
            o.header &&
            (/^(?:---+|===+)\s*$/.test(t.string) && o.prevLine && o.prevLine.header
              ? (b += " line-HyperMD-header-line line-HyperMD-header-line-" + o.header)
              : (b += " line-HyperMD-header line-HyperMD-header-" + o.header)),
          o.indentedCode && (b += " hmd-indented-code"),
          o.quote)
        ) {
          if (
            ((t.match(/^\s*>/, !1) && !t.eol()) ||
              ((b += " line-HyperMD-quote line-HyperMD-quote-" + o.quote + " line-parse-next"),
              /^ {0,3}\>/.test(t.string) || (b += " line-HyperMD-quote-lazy")),
            p && (d = U.match(/^\s+/)))
          ) {
            t.pos = d[0].length;
            return (b += " hmd-indent-in-quote").trim();
          }
          if (o.quote > h)
            if ((O = t.peek() === "[" && t.match(/^\[!([^\]]+)\]([+\-]?)(?:\s|$)/))) {
              b +=
                " line-HyperMD-callout hmd-callout line-HyperMD-quote line-HyperMD-quote-" +
                o.quote +
                " line-parse-next";
            }
        }
        var j = (o.listStack[o.listStack.length - 1] || 0) + 3,
          G = p && /^\s+$/.test(U) && (!1 !== o.list || t.indentation() <= j),
          K = o.list && b.contains("formatting-list");
        if (K || (G && (!1 !== o.list || t.match(SB, !1)))) {
          var Y = (o.listStack && o.listStack.length) || 0;
          if (G) {
            if (t.match(SB, !1)) {
              if (!1 === o.list) {
                Y++;
              }
            } else {
              for (; Y > 0 && t.pos < o.listStack[Y - 1]; ) Y--;
              if (!Y) return b.trim() || null;
              b += " line-HyperMD-list-line-nobullet line-HyperMD-list-line line-HyperMD-list-line-".concat(Y);
            }
            b += " hmd-list-indent hmd-list-indent-".concat(Y);
          } else if (K) {
            b += " line-HyperMD-list-line line-HyperMD-list-line-".concat(Y);
          }
        }
        if (
          (m !== o.linkText &&
            (m || o.internalLink || o.internalEmbed
              ? o.hmdLinkType !== PB.FOOTNOTE &&
                (o.hmdLinkType in HB && (b += " " + HB[o.hmdLinkType]), (o.hmdLinkType = PB.NONE))
              : (d = t.match(/^([^\]]+)\](\(| ?\[|\:)?/, !1))
                ? d[2]
                  ? (d[2] !== "[" && d[2] !== " [") || t.string.charAt(t.pos + d[0].length) !== "]"
                    ? (o.hmdLinkType = PB.NORMAL)
                    : (o.hmdLinkType = PB.BARELINK2)
                  : d[1][0] !== "^" || /\s/.test(d[1])
                    ? (o.hmdLinkType = PB.BARELINK)
                    : (o.hmdLinkType = PB.FOOTREF)
                : (o.hmdLinkType = PB.BARELINK)),
          g !== o.linkHref &&
            (g
              ? o.hmdLinkType && ((b += " " + HB[o.hmdLinkType]), (o.hmdLinkType = PB.NONE))
              : U === "[" && t.peek() !== "]" && (o.hmdLinkType = PB.FOOTREF2)),
          o.hmdLinkType !== PB.NONE && o.hmdLinkType in HB && (b += " " + HB[o.hmdLinkType]),
          o.inlineFootnote && (b += " footref inline-footnote"),
          C && U.length > 1)
        ) {
          var posZ0 = U.length - 1,
            X = b.replace("formatting-escape", "escape") + " hmd-escape-char";
          o.hmdOverride = function (e, t) {
            e.pos += posZ0;
            t.hmdOverride = null;
            return X.trim();
          };
          b += " hmd-escape-backslash";
          t.pos -= posZ0;
          return b;
        }
        if (!b.trim() && n.table) {
          var Q = false;
          if (
            (U.charAt(0) === "|" && ((t.pos = t.start + 1), (U = "|"), (Q = true)),
            !hmdTable &&
              o.prevLine &&
              o.prevLine.stream &&
              o.prevLine.stream.string.trim() &&
              !o.wasHeading &&
              (Q = false),
            Q)
          ) {
            if (!hmdTable) {
              LB.test(t.string) ? (hmdTable = vB.SIMPLE) : OB.test(t.string) && (hmdTable = vB.NORMAL);
              var hmdTableColumns = undefined;
              if (hmdTable) {
                var J = t.lookAhead(1);
                if (
                  (hmdTable === vB.NORMAL
                    ? OB.test(J)
                      ? (J = J.replace(/^\s*\|/, "").replace(/\|\s*$/, ""))
                      : (hmdTable = vB.NONE)
                    : hmdTable === vB.SIMPLE && (LB.test(J) || (hmdTable = vB.NONE)),
                  hmdTable)
                ) {
                  hmdTableColumns = J.split("|");
                  for (var ee = 0; ee < hmdTableColumns.length; ee++) {
                    var te = hmdTableColumns[ee];
                    if (NB.test(te)) te = "right";
                    else if (RB.test(te)) te = "left";
                    else if (BB.test(te)) te = "center";
                    else {
                      if (!VB.test(te)) {
                        hmdTable = vB.NONE;
                        break;
                      }
                      te = "default";
                    }
                    hmdTableColumns[ee] = te;
                  }
                }
              }
              if (hmdTable) {
                o.hmdTable = hmdTable;
                o.hmdTableColumns = hmdTableColumns;
                detectTextDirection(t.string) === "rtl" && (o.hmdTableRTL = true);
                o.hmdTableRow = o.hmdTableCol = 0;
              }
            }
            if (hmdTable) {
              var ne = o.hmdTableColumns.length - 1,
                ie = ((te = o.hmdTableRow), o.hmdTableCol);
              ie == 0 &&
                ((b += " line-HyperMD-table-"
                  .concat(hmdTable, " line-HyperMD-table-row line-HyperMD-table-row-")
                  .concat(te, " line-parse-next")),
                o.hmdTableRTL && (b += " line-HyperMD-table-rtl"));
              hmdTable === vB.NORMAL &&
              ((o.hmdTableCol === 0 && /^\s*\|$/.test(t.string.slice(0, t.pos))) || t.match(/^\s*$/, !1))
                ? (b += " hmd-table-sep hmd-table-sep-dummy")
                : o.hmdTableCol < ne && ((b += " hmd-table-sep hmd-table-sep-".concat(ie)), (o.hmdTableCol += 1));
            }
          }
        }
        if ((hmdTable && o.hmdTableRow === 1 && b.contains("emoji") && (b = ""), y && U === "<")) {
          var endTag = null;
          if (
            (t.peek() === "!" && t.match(/^\![A-Z]+/)
              ? (endTag = ">")
              : t.peek() === "!" && t.match("![CDATA[")
                ? (endTag = "]]>")
                : t.peek() === "?" && (endTag = "?>"),
            endTag != null)
          )
            return l(t, o, null, {
              endTag: endTag,
              style: (b + " comment hmd-cdata-html").trim(),
            });
        }
        if (n.hashtag && y)
          if (o.hmdHashtag) {
            var oe = false;
            if (!(b = b.replace(/((formatting )?formatting-em|em) /g, "")).contains("formatting") && !/^\s*$/.test(U)) {
              d = U.match(TB);
              var ae = U.length - (d ? d[0].length : 0);
              if (ae > 0) {
                t.backUp(ae);
                oe = true;
              }
            }
            if ((oe || (oe = t.eol()), oe || (oe = !TB.test(t.peek())), oe)) {
              b += " hashtag-end " + (ce = "tag-" + (ce = t.current()).replace(/[^_a-zA-Z0-9\-]/g, ""));
              o.hmdHashtag = false;
            }
          } else if (U === "#" && !o.linkText && !o.image && (p || /^\s*$/.test(t.string.charAt(t.start - 1)))) {
            var se = t.string.slice(t.pos).replace(/\\./g, ""),
              le = TB.exec(se);
            if (le && /[^0-9]/.test(le[0])) {
              var ce = "tag-" + le[0].replace(/[^_a-zA-Z0-9\-]/g, "");
              o.hmdHashtag = true;
              b += " formatting formatting-hashtag hashtag-begin " + n.tokenTypeOverrides.hashtag + " " + ce;
            }
          }
      }
      return b.trim() || null;
    };
    return o;
  },
  "hypermd",
);
EB.defineMIME("text/x-hypermd", "hypermd");
var _B = new NodeProp();
function jB(e) {
  return Facet.define({
    combine: e
      ? function (t) {
          return t.concat(e);
        }
      : undefined,
  });
}
var GB = new NodeProp(),
  KB = (function () {
    function e(data, parser, n, name) {
      undefined === n && (n = []);
      undefined === name && (name = "");
      this.data = data;
      this.name = name;
      EditorState.prototype.hasOwnProperty("tree") ||
        Object.defineProperty(EditorState.prototype, "tree", {
          get: function () {
            return XB(this);
          },
        });
      this.parser = parser;
      this.extension = [
        oV.of(this),
        EditorState.languageData.of(function (e, t, n) {
          var i = YB(e, t, n),
            r = i.type.prop(_B);
          if (!r) return [];
          var o = e.facet(r),
            a = i.type.prop(GB);
          if (a)
            for (var s = i.resolve(t - i.from, n), l = 0, c = a; l < c.length; l++) {
              var u = c[l];
              if (u.test(s, e)) {
                var h = e.facet(u.facet);
                return u.type == "replace" ? h : h.concat(o);
              }
            }
          return o;
        }),
      ].concat(n);
    }
    e.prototype.isActiveAt = function (e, t, n) {
      undefined === n && (n = -1);
      return YB(e, t, n).type.prop(_B) == this.data;
    };
    e.prototype.findRegions = function (e) {
      var t = this,
        n = e.facet(oV);
      if ((n == null ? undefined : n.data) == this.data)
        return [
          {
            from: 0,
            to: e.doc.length,
          },
        ];
      if (!n || !n.allowsNesting) return [];
      var i = [],
        r = function (e, from) {
          if (e.prop(_B) != t.data) {
            var o = e.prop(NodeProp.mounted);
            if (o) {
              if (o.tree.prop(_B) == t.data) {
                if (o.overlay)
                  for (var a = 0, s = o.overlay; a < s.length; a++) {
                    var l = s[a];
                    i.push({
                      from: l.from + from,
                      to: l.to + from,
                    });
                  }
                else
                  i.push({
                    from: from,
                    to: from + e.length,
                  });
                return;
              }
              if (o.overlay) {
                var c = i.length;
                if ((r(o.tree, o.overlay[0].from + from), i.length > c)) return;
              }
            }
            for (var u = 0; u < e.children.length; u++) {
              var h = e.children[u];
              if (h instanceof Tree) {
                r(h, e.positions[u] + from);
              }
            }
          } else
            i.push({
              from: from,
              to: from + e.length,
            });
        };
      r(XB(e), 0);
      return i;
    };
    Object.defineProperty(e.prototype, "allowsNesting", {
      get: function () {
        return !0;
      },
      enumerable: false,
      configurable: true,
    });
    return e;
  })();
function YB(e, t, n) {
  var i = e.facet(oV),
    r = XB(e).topNode;
  if (!i || i.allowsNesting)
    for (var o = r; o; o = o.enter(t, n, IterMode.ExcludeBuffers))
      if (o.type.isTop) {
        r = o;
      }
  return r;
}
KB.setState = StateEffect.define();
var ZB = (function (e) {
  function t(t, parser, i) {
    var r = e.call(this, t, parser, [], i) || this;
    r.parser = parser;
    return r;
  }
  __extends(t, e);
  t.define = function (e) {
    var n = jB(e.languageData);
    return new t(
      n,
      e.parser.configure({
        props: [
          _B.add(function (e) {
            return e.isTop ? n : undefined;
          }),
        ],
      }),
      e.name,
    );
  };
  t.prototype.configure = function (e, n) {
    return new t(this.data, this.parser.configure(e), n || this.name);
  };
  Object.defineProperty(t.prototype, "allowsNesting", {
    get: function () {
      return this.parser.hasWrappers();
    },
    enumerable: false,
    configurable: true,
  });
  return t;
})(KB);
function XB(e) {
  var t = e.field(KB.state, !1);
  return t ? t.tree : Tree.empty;
}
var QB = (function () {
    function e(doc) {
      this.doc = doc;
      this.cursorPos = 0;
      this.string = "";
      this.cursor = doc.iter();
    }
    Object.defineProperty(e.prototype, "length", {
      get: function () {
        return this.doc.length;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.syncTo = function (e) {
      this.string = this.cursor.next(e - this.cursorPos).value;
      this.cursorPos = e + this.string.length;
      return this.cursorPos - this.string.length;
    };
    e.prototype.chunk = function (e) {
      this.syncTo(e);
      return this.string;
    };
    Object.defineProperty(e.prototype, "lineChunks", {
      get: function () {
        return !0;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.read = function (e, t) {
      var n = this.cursorPos - this.string.length;
      return e < n || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - n, t - n);
    };
    return e;
  })(),
  $B = null,
  JB = (function () {
    function e(parser, state, fragments, tree, treeLen, viewport, skipped, scheduleOn) {
      undefined === fragments && (fragments = []);
      this.parser = parser;
      this.state = state;
      this.fragments = fragments;
      this.tree = tree;
      this.treeLen = treeLen;
      this.viewport = viewport;
      this.skipped = skipped;
      this.scheduleOn = scheduleOn;
      this.parse = null;
      this.tempSkipped = [];
    }
    e.create = function (t, n, i) {
      return new e(t, n, [], Tree.empty, 0, i, [], null);
    };
    e.prototype.startParse = function () {
      return this.parser.startParse(new QB(this.state.doc), this.fragments);
    };
    e.prototype.work = function (e, t) {
      var n = this;
      t != null && t >= this.state.doc.length && (t = undefined);
      return this.tree != Tree.empty && this.isDone(t != null ? t : this.state.doc.length)
        ? (this.takeTree(), !0)
        : this.withContext(function () {
            var i;
            if (typeof e == "number") {
              var r = Date.now() + e;
              e = function () {
                return Date.now() > r;
              };
            }
            for (
              n.parse || (n.parse = n.startParse()),
                t != null &&
                  (n.parse.stoppedAt == null || n.parse.stoppedAt > t) &&
                  t < n.state.doc.length &&
                  n.parse.stopAt(t);
              ;
            ) {
              var tree = n.parse.advance();
              if (tree) {
                if (
                  ((n.fragments = n.withoutTempSkipped(
                    TreeFragment.addTree(tree, n.fragments, n.parse.stoppedAt != null),
                  )),
                  (n.treeLen = (i = n.parse.stoppedAt) !== null && undefined !== i ? i : n.state.doc.length),
                  (n.tree = tree),
                  (n.parse = null),
                  !(n.treeLen < (t != null ? t : n.state.doc.length)))
                )
                  return !0;
                n.parse = n.startParse();
              }
              if (e()) return !1;
            }
          });
    };
    e.prototype.takeTree = function () {
      var treeLen,
        tree,
        n = this;
      if (this.parse && (treeLen = this.parse.parsedPos) >= this.treeLen) {
        (this.parse.stoppedAt == null || this.parse.stoppedAt > treeLen) && this.parse.stopAt(treeLen);
        this.withContext(function () {
          for (; !(tree = n.parse.advance()); );
        });
        this.treeLen = treeLen;
        this.tree = tree;
        this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, !0));
        this.parse = null;
      }
    };
    e.prototype.withContext = function (e) {
      var t = $B;
      $B = this;
      try {
        return e();
      } finally {
        $B = t;
      }
    };
    e.prototype.withoutTempSkipped = function (e) {
      for (var t = undefined; (t = this.tempSkipped.pop()); ) e = eV(e, t.from, t.to);
      return e;
    };
    e.prototype.changes = function (t, n) {
      var i = this,
        r = i.fragments,
        o = i.tree,
        a = i.treeLen,
        s = i.viewport,
        l = i.skipped;
      if ((this.takeTree(), !t.empty)) {
        var c = [];
        if (
          (t.iterChangedRanges(function (fromA, t, fromB, i) {
            return c.push({
              fromA: fromA,
              toA: t,
              fromB: fromB,
              toB: i,
            });
          }),
          (r = TreeFragment.applyChanges(r, c)),
          (o = Tree.empty),
          (a = 0),
          (s = {
            from: t.mapPos(s.from, -1),
            to: t.mapPos(s.to, 1),
          }),
          this.skipped.length)
        ) {
          l = [];
          for (var u = 0, h = this.skipped; u < h.length; u++) {
            var p = h[u],
              from = t.mapPos(p.from, 1),
              f = t.mapPos(p.to, -1);
            if (from < f) {
              l.push({
                from: from,
                to: f,
              });
            }
          }
        }
      }
      return new e(this.parser, n, r, o, a, s, l, this.scheduleOn);
    };
    e.prototype.updateViewport = function (viewport) {
      if (this.viewport.from == viewport.from && this.viewport.to == viewport.to) return !1;
      this.viewport = viewport;
      for (var t = this.skipped.length, n = 0; n < this.skipped.length; n++) {
        var i = this.skipped[n],
          r = i.from,
          o = i.to;
        if (r < viewport.to && o > viewport.from) {
          this.fragments = eV(this.fragments, r, o);
          this.skipped.splice(n--, 1);
        }
      }
      return !(this.skipped.length >= t) && (this.reset(), !0);
    };
    e.prototype.reset = function () {
      if (this.parse) {
        this.takeTree();
        this.parse = null;
      }
    };
    e.prototype.skipUntilInView = function (from, t) {
      this.skipped.push({
        from: from,
        to: t,
      });
    };
    e.getSkippingParser = function (e) {
      return new ((function (t) {
        function n() {
          return (t !== null && t.apply(this, arguments)) || this;
        }
        __extends(n, t);
        n.prototype.createParse = function (t, n, i) {
          var parsedPos = i[0].from,
            parsedPoso0 = i[i.length - 1].to,
            a = {
              parsedPos: parsedPos,
              advance: function () {
                var t = $B;
                if (t) {
                  for (var n = 0, a = i; n < a.length; n++) {
                    var s = a[n];
                    t.tempSkipped.push(s);
                  }
                  if (e) {
                    t.scheduleOn = t.scheduleOn ? Promise.all([t.scheduleOn, e]) : e;
                  }
                }
                this.parsedPos = parsedPoso0;
                return new Tree(NodeType.none, [], [], parsedPoso0 - parsedPos);
              },
              stoppedAt: null,
              stopAt: function () {},
            };
          return a;
        };
        return n;
      })(Parser))();
    };
    e.prototype.isDone = function (e) {
      e = Math.min(e, this.state.doc.length);
      var t = this.fragments;
      return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
    };
    e.get = function () {
      return $B;
    };
    return e;
  })();
function eV(e, fromA, n) {
  return TreeFragment.applyChanges(e, [
    {
      fromA: fromA,
      toA: n,
      fromB: fromA,
      toB: n,
    },
  ]);
}
var tV = (function () {
  function e(context) {
    this.context = context;
    this.tree = context.tree;
  }
  e.prototype.apply = function (t) {
    if (!t.docChanged && this.tree == this.context.tree) return this;
    var n = this.context.changes(t.changes, t.state),
      i =
        this.context.treeLen == t.startState.doc.length
          ? undefined
          : Math.max(t.changes.mapPos(this.context.treeLen), n.viewport.to);
    n.work(20, i) || n.takeTree();
    return new e(n);
  };
  e.init = function (t) {
    var n = Math.min(3e3, t.doc.length),
      i = JB.create(t.facet(oV).parser, t, {
        from: 0,
        to: n,
      });
    i.work(20, n) || i.takeTree();
    return new e(i);
  };
  return e;
})();
KB.state = StateField.define({
  create: tV.init,
  update: function (e, t) {
    for (var n = 0, i = t.effects; n < i.length; n++) {
      var r = i[n];
      if (r.is(KB.setState)) return r.value;
    }
    return t.startState.facet(oV) != t.state.facet(oV) ? tV.init(t.state) : e.apply(t);
  },
});
var nV = function (e) {
  var t = setTimeout(function () {
    return e();
  }, 500);
  return function () {
    return clearTimeout(t);
  };
};
if (typeof requestIdleCallback != "undefined") {
  nV = function (e) {
    var t = -1,
      n = setTimeout(function () {
        t = requestIdleCallback(e, {
          timeout: 400,
        });
      }, 100);
    return function () {
      return t < 0 ? clearTimeout(n) : cancelIdleCallback(t);
    };
  };
}
var iV =
    typeof navigator != "undefined" &&
    ((qB = navigator.scheduling) === null || undefined === qB ? undefined : qB.isInputPending)
      ? function () {
          return navigator.scheduling.isInputPending();
        }
      : null,
  rV = ViewPlugin.fromClass(
    (function () {
      function e(view) {
        this.view = view;
        this.working = null;
        this.workScheduled = 0;
        this.chunkEnd = -1;
        this.chunkBudget = -1;
        this.work = this.work.bind(this);
        this.scheduleWork();
      }
      e.prototype.update = function (e) {
        var t = this.view.state.field(KB.state).context;
        (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork();
        (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork());
        this.checkAsyncSchedule(t);
      };
      e.prototype.scheduleWork = function () {
        if (!this.working) {
          var e = this.view.state,
            t = e.field(KB.state);
          if (!(t.tree == t.context.tree && t.context.isDone(e.doc.length))) {
            this.working = nV(this.work);
          }
        }
      };
      e.prototype.work = function (e) {
        this.working = null;
        var t = Date.now();
        if (
          (this.chunkEnd < t &&
            (this.chunkEnd < 0 || this.view.hasFocus) &&
            ((this.chunkEnd = t + 3e4), (this.chunkBudget = 3e3)),
          !(this.chunkBudget <= 0))
        ) {
          var n = this.view,
            i = n.state,
            r = n.viewport.to,
            o = i.field(KB.state);
          if (o.tree != o.context.tree || !o.context.isDone(r + 1e5)) {
            var a = Date.now() + Math.min(this.chunkBudget, 100, e && !iV ? Math.max(25, e.timeRemaining() - 5) : 1e9),
              s = o.context.treeLen < r && i.doc.length > r + 1e3,
              l = o.context.work(
                function () {
                  return (iV && iV()) || Date.now() > a;
                },
                r + (s ? 0 : 1e5),
              );
            this.chunkBudget -= Date.now() - t;
            (l || this.chunkBudget <= 0) &&
              (o.context.takeTree(),
              this.view.dispatch({
                effects: KB.setState.of(new tV(o.context)),
              }));
            this.chunkBudget > 0 && (!l || s) && this.scheduleWork();
            this.checkAsyncSchedule(o.context);
          }
        }
      };
      e.prototype.checkAsyncSchedule = function (e) {
        var t = this;
        if (e.scheduleOn) {
          this.workScheduled++;
          e.scheduleOn
            .then(function () {
              return t.scheduleWork();
            })
            .catch(function (e) {
              return logException(t.view.state, e);
            })
            .then(function () {
              return t.workScheduled--;
            });
          e.scheduleOn = null;
        }
      };
      e.prototype.destroy = function () {
        if (this.working) {
          this.working();
        }
      };
      e.prototype.isWorking = function () {
        return !!(this.working || this.workScheduled > 0);
      };
      return e;
    })(),
    {
      eventHandlers: {
        focus: function () {
          this.scheduleWork();
        },
      },
    },
  ),
  oV = Facet.define({
    combine: function (e) {
      return e.length ? e[0] : null;
    },
    enables: function (e) {
      return [
        KB.state,
        rV,
        EditorView.contentAttributes.compute([e], function (t) {
          var n = t.facet(e);
          return n && n.name
            ? {
                "data-language": n.name,
              }
            : {};
        }),
      ];
    },
  }),
  aV = function (languagee0, support) {
    undefined === support && (support = []);
    this.language = languagee0;
    this.support = support;
    this.extension = [languagee0, support];
  },
  sV =
    ((function () {
      function e(name, alias, extensions, filename, loadFunc, support) {
        undefined === support && (support = undefined);
        this.name = name;
        this.alias = alias;
        this.extensions = extensions;
        this.filename = filename;
        this.loadFunc = loadFunc;
        this.support = support;
        this.loading = null;
      }
      e.prototype.load = function () {
        var e = this;
        return (
          this.loading ||
          (this.loading = this.loadFunc().then(
            function (support) {
              return (e.support = support);
            },
            function (t) {
              throw ((e.loading = null), t);
            },
          ))
        );
      };
      e.of = function (t) {
        var n = t.load,
          i = t.support;
        if (!n) {
          if (!i) throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
          n = function () {
            return Promise.resolve(i);
          };
        }
        return new e(
          t.name,
          (t.alias || []).concat(t.name).map(function (e) {
            return e.toLowerCase();
          }),
          t.extensions || [],
          t.filename,
          n,
          i,
        );
      };
      e.matchFilename = function (e, t) {
        for (var n = 0, i = e; n < i.length; n++) {
          if ((s = i[n]).filename && s.filename.test(t)) return s;
        }
        var r = /\.([^.]+)$/.exec(t);
        if (r)
          for (var o = 0, a = e; o < a.length; o++) {
            var s;
            if ((s = a[o]).extensions.indexOf(r[1]) > -1) return s;
          }
        return null;
      };
      e.matchLanguageName = function (e, t, n) {
        undefined === n && (n = true);
        t = t.toLowerCase();
        for (var i = 0, r = e; i < r.length; i++) {
          if (
            (s = r[i]).alias.some(function (e) {
              return e == t;
            })
          )
            return s;
        }
        if (n)
          for (var o = 0, a = e; o < a.length; o++)
            for (var s, l = 0, c = (s = a[o]).alias; l < c.length; l++) {
              var u = c[l],
                h = t.indexOf(u);
              if (h > -1 && (u.length > 2 || (!/\w/.test(t[h - 1]) && !/\w/.test(t[h + u.length])))) return s;
            }
        return null;
      };
    })(),
    Facet.define({
      combine: function (e) {
        if (!e.length) return "  ";
        var t = e[0];
        if (
          !t ||
          /\S/.test(t) ||
          Array.from(t).some(function (e) {
            return e != t[0];
          })
        )
          throw new Error("Invalid indent unit: " + JSON.stringify(e[0]));
        return t;
      },
    }));
function lV(e) {
  var t = e.facet(sV);
  return t.charCodeAt(0) == 9 ? e.tabSize * t.length : t.length;
}
var cV = (function () {
    function e(state, options) {
      undefined === options && (options = {});
      this.state = state;
      this.options = options;
      this.unit = lV(state);
    }
    e.prototype.lineAt = function (from, t) {
      if (undefined === t) {
        t = 1;
      }
      var n = this.state.doc.lineAt(from),
        i = this.options,
        fromr0 = i.simulateBreak,
        o = i.simulateDoubleBreak;
      return fromr0 != null && fromr0 >= n.from && fromr0 <= n.to
        ? o && fromr0 == from
          ? {
              text: "",
              from: from,
            }
          : (t < 0 ? fromr0 < from : fromr0 <= from)
            ? {
                text: n.text.slice(fromr0 - n.from),
                from: fromr0,
              }
            : {
                text: n.text.slice(0, fromr0 - n.from),
                from: n.from,
              }
        : n;
    };
    e.prototype.textAfterPos = function (e, t) {
      if ((undefined === t && (t = 1), this.options.simulateDoubleBreak && e == this.options.simulateBreak)) return "";
      var n = this.lineAt(e, t),
        i = n.text,
        r = n.from;
      return i.slice(e - r, Math.min(i.length, e + 100 - r));
    };
    e.prototype.column = function (e, t) {
      if (undefined === t) {
        t = 1;
      }
      var n = this.lineAt(e, t),
        i = n.text,
        r = n.from,
        o = this.countColumn(i, e - r),
        a = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
      a > -1 && (o += a - this.countColumn(i, i.search(/\S|$/)));
      return o;
    };
    e.prototype.countColumn = function (e, t) {
      undefined === t && (t = e.length);
      return countColumn(e, this.state.tabSize, t);
    };
    e.prototype.lineIndent = function (e, t) {
      if (undefined === t) {
        t = 1;
      }
      var n = this.lineAt(e, t),
        i = n.text,
        r = n.from,
        o = this.options.overrideIndentation;
      if (o) {
        var a = o(r);
        if (a > -1) return a;
      }
      return this.countColumn(i, i.search(/\S|$/));
    };
    Object.defineProperty(e.prototype, "simulatedBreak", {
      get: function () {
        return this.options.simulateBreak || null;
      },
      enumerable: false,
      configurable: true,
    });
    return e;
  })(),
  uV = new NodeProp();
function hV(e, t, n) {
  for (var i = e; i; i = i.next) {
    var r = pV(i.node);
    if (r) return r(fV.create(t, n, i));
  }
  return 0;
}
function pV(e) {
  var t = e.type.prop(uV);
  if (t) return t;
  var n,
    i = e.firstChild;
  if (i && (n = i.type.prop(NodeProp.closedBy))) {
    var r = e.lastChild,
      o = r && n.indexOf(r.name) > -1;
    return function (e) {
      return gV(
        e,
        !0,
        1,
        undefined,
        o &&
          !(function (e) {
            return e.pos == e.options.simulateBreak && e.options.simulateDoubleBreak;
          })(e)
          ? r.from
          : undefined,
      );
    };
  }
  return e.parent == null ? dV : null;
}
function dV() {
  return 0;
}
var fV = (function (e) {
  function t(base, pos, context) {
    var r = e.call(this, base.state, base.options) || this;
    r.base = base;
    r.pos = pos;
    r.context = context;
    return r;
  }
  __extends(t, e);
  Object.defineProperty(t.prototype, "node", {
    get: function () {
      return this.context.node;
    },
    enumerable: false,
    configurable: true,
  });
  t.create = function (e, n, i) {
    return new t(e, n, i);
  };
  Object.defineProperty(t.prototype, "textAfter", {
    get: function () {
      return this.textAfterPos(this.pos);
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(t.prototype, "baseIndent", {
    get: function () {
      return this.baseIndentFor(this.node);
    },
    enumerable: false,
    configurable: true,
  });
  t.prototype.baseIndentFor = function (e) {
    for (var t = this.state.doc.lineAt(e.from); ; ) {
      for (var n = e.resolve(t.from); n.parent && n.parent.from == n.from; ) n = n.parent;
      if (mV(n, e)) break;
      t = this.state.doc.lineAt(n.from);
    }
    return this.lineIndent(t.from);
  };
  t.prototype.continue = function () {
    return hV(this.context.next, this.base, this.pos);
  };
  return t;
})(cV);
function mV(e, t) {
  for (var n = t; n; n = n.parent) if (e == n) return !0;
  return !1;
}
function gV(e, t, n, i, r) {
  var o = e.textAfter,
    a = o.match(/^\s*/)[0].length,
    s = (i && o.slice(a, a + i.length) == i) || r == e.pos + a,
    l = t
      ? (function (e) {
          var t = e.node,
            n = t.childAfter(t.from),
            i = t.lastChild;
          if (!n) return null;
          for (
            var r = e.options.simulateBreak,
              o = e.state.doc.lineAt(n.from),
              a = r == null || r <= o.from ? o.to : Math.min(o.to, r),
              s = n.to;
            ;
          ) {
            var l = t.childAfter(s);
            if (!l || l == i) return null;
            if (!l.type.isSkipped) {
              if (l.from >= a) return null;
              var c = /^ */.exec(o.text.slice(n.to - o.from))[0].length;
              return {
                from: n.from,
                to: n.to + c,
              };
            }
            s = l.to;
          }
        })(e)
      : null;
  return l ? (s ? e.column(l.from) : e.column(l.to)) : e.baseIndent + (s ? 0 : e.unit * n);
}
function vV(e, t) {
  var from = t.mapPos(e.from, 1),
    i = t.mapPos(e.to, -1);
  return from >= i
    ? undefined
    : {
        from: from,
        to: i,
      };
}
var yV = StateEffect.define({
    map: vV,
  }),
  bV = StateEffect.define({
    map: vV,
  });
var wV = StateField.define({
  create: function () {
    return Decoration.none;
  },
  update: function (e, t) {
    e = e.map(t.changes);
    for (
      var n = function (n) {
          if (
            n.is(yV) &&
            !(function (e, t, n) {
              var i = false;
              e.between(t, t, function (e, r) {
                if (e == t && r == n) {
                  i = true;
                }
              });
              return i;
            })(e, n.value.from, n.value.to)
          ) {
            var i = t.state.facet(EV).preparePlaceholder,
              r = i
                ? Decoration.replace({
                    widget: new xV(i(t.state, n.value)),
                  })
                : MV;
            e = e.update({
              add: [r.range(n.value.from, n.value.to)],
            });
          } else if (n.is(bV)) {
            e = e.update({
              filter: function (e, t) {
                return n.value.from != e || n.value.to != t;
              },
              filterFrom: n.value.from,
              filterTo: n.value.to,
            });
          }
        },
        i = 0,
        r = t.effects;
      i < r.length;
      i++
    ) {
      n(r[i]);
    }
    if (t.selection) {
      var o = false,
        filterFrom = t.selection.main.head;
      e.between(filterFrom, filterFrom, function (e, t) {
        if (e < filterFrom && t > filterFrom) {
          o = true;
        }
      });
      o &&
        (e = e.update({
          filterFrom: filterFrom,
          filterTo: filterFrom,
          filter: function (e, t) {
            return t <= filterFrom || e >= filterFrom;
          },
        }));
    }
    return e;
  },
  provide: function (e) {
    return EditorView.decorations.from(e);
  },
  toJSON: function (e, t) {
    var n = [];
    e.between(0, t.doc.length, function (e, t) {
      n.push(e, t);
    });
    return n;
  },
  fromJSON: function (e) {
    if (!Array.isArray(e) || e.length % 2) throw new RangeError("Invalid JSON for fold state");
    for (var t = [], n = 0; n < e.length; ) {
      var i = e[n++],
        r = e[n++];
      if (typeof i != "number" || typeof r != "number") throw new RangeError("Invalid JSON for fold state");
      t.push(MV.range(i, r));
    }
    return Decoration.set(t, !0);
  },
});
function kV(e, t, n) {
  var i,
    r = null;
  (i = e.field(wV, !1)) === null ||
    undefined === i ||
    i.between(t, n, function (from, t) {
      if (!r || r.from > from) {
        r = {
          from: from,
          to: t,
        };
      }
    });
  return r;
}
var CV = {
    placeholderDOM: null,
    preparePlaceholder: null,
    placeholderText: "…",
  },
  EV = Facet.define({
    combine: function (e) {
      return combineConfig(e, CV);
    },
  });
function SV(e, t) {
  var n = e.state,
    i = n.facet(EV),
    onclick = function (t) {
      var n = e.lineBlockAt(e.posAtDOM(t.target)),
        i = kV(e.state, n.from, n.to);
      i &&
        e.dispatch({
          effects: bV.of(i),
        });
      t.preventDefault();
    };
  if (i.placeholderDOM) return i.placeholderDOM(e, onclick, t);
  var o = document.createElement("span");
  o.textContent = i.placeholderText;
  o.setAttribute("aria-label", n.phrase("folded code"));
  o.title = n.phrase("unfold");
  o.className = "cm-foldPlaceholder";
  o.onclick = onclick;
  return o;
}
var MV = Decoration.replace({
    widget: new ((function (e) {
      function t() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      __extends(t, e);
      t.prototype.toDOM = function (e) {
        return SV(e, null);
      };
      return t;
    })(WidgetType))(),
  }),
  xV = (function (e) {
    function t(value) {
      var n = e.call(this) || this;
      n.value = value;
      return n;
    }
    __extends(t, e);
    t.prototype.eq = function (e) {
      return this.value == e.value;
    };
    t.prototype.toDOM = function (e) {
      return SV(e, this.value);
    };
    return t;
  })(WidgetType);
!(function (e) {
  function t(config, open) {
    var i = e.call(this) || this;
    i.config = config;
    i.open = open;
    return i;
  }
  __extends(t, e);
  t.prototype.eq = function (e) {
    return this.config == e.config && this.open == e.open;
  };
  t.prototype.toDOM = function (e) {
    if (this.config.markerDOM) return this.config.markerDOM(this.open);
    var t = document.createElement("span");
    t.textContent = this.open ? this.config.openText : this.config.closedText;
    t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line");
    return t;
  };
})(GutterMarker);
var TV = (function () {
    function e(specs, t) {
      var n;
      function i(e) {
        var t = xt.newName();
        (n || (n = Object.create(null)))["." + t] = e;
        return t;
      }
      this.specs = specs;
      var r = typeof t.all == "string" ? t.all : t.all ? i(t.all) : undefined,
        o = t.scope;
      this.scope =
        o instanceof KB
          ? function (e) {
              return e.prop(_B) == o.data;
            }
          : o
            ? function (e) {
                return e == o;
              }
            : undefined;
      this.style = tagHighlighter(
        specs.map(function (e) {
          return {
            tag: e.tag,
            class:
              e.class ||
              i(
                Object.assign({}, e, {
                  tag: null,
                }),
              ),
          };
        }),
        {
          all: r,
        },
      ).style;
      this.module = n ? new xt(n) : null;
      this.themeType = t.themeType;
    }
    e.define = function (t, n) {
      return new e(t, n || {});
    };
    return e;
  })(),
  DV = Facet.define(),
  AV = Facet.define({
    combine: function (e) {
      return e.length ? [e[0]] : null;
    },
  });
function PV(e) {
  var t = e.facet(DV);
  return t.length ? t : e.facet(AV);
}
var LV = (function () {
    function e(e) {
      this.markCache = Object.create(null);
      this.tree = XB(e.state);
      this.decorations = this.buildDeco(e, PV(e.state));
      this.decoratedTo = e.viewport.to;
    }
    e.prototype.update = function (e) {
      var tree = XB(e.state),
        n = PV(e.state),
        i = n != PV(e.startState),
        r = e.view.viewport,
        decoratedTo = e.changes.mapPos(this.decoratedTo, 1);
      tree.length < r.to && !i && tree.type == this.tree.type && decoratedTo >= r.to
        ? ((this.decorations = this.decorations.map(e.changes)), (this.decoratedTo = decoratedTo))
        : (tree != this.tree || e.viewportChanged || i) &&
          ((this.tree = tree), (this.decorations = this.buildDeco(e.view, n)), (this.decoratedTo = r.to));
    };
    e.prototype.buildDeco = function (e, t) {
      var n = this;
      if (!t || !this.tree.length) return Decoration.none;
      for (var i = new RangeSetBuilder(), r = 0, o = e.visibleRanges; r < o.length; r++) {
        var a = o[r],
          s = a.from,
          l = a.to;
        highlightTree(
          this.tree,
          t,
          function (e, t, classr0) {
            i.add(
              e,
              t,
              n.markCache[classr0] ||
                (n.markCache[classr0] = Decoration.mark({
                  class: classr0,
                })),
            );
          },
          s,
          l,
        );
      }
      return i.finish();
    };
    return e;
  })(),
  IV = Prec.high(
    ViewPlugin.fromClass(LV, {
      decorations: function (e) {
        return e.decorations;
      },
    }),
  ),
  OV =
    (tags.meta,
    tags.link,
    tags.heading,
    tags.emphasis,
    tags.strong,
    tags.strikethrough,
    tags.keyword,
    tags.atom,
    tags.bool,
    tags.url,
    tags.contentSeparator,
    tags.labelName,
    tags.literal,
    tags.inserted,
    tags.string,
    tags.deleted,
    tags.regexp,
    tags.escape,
    tags.string,
    tags.variableName,
    tags.variableName,
    tags.typeName,
    tags.namespace,
    tags.className,
    tags.variableName,
    tags.macroName,
    tags.propertyName,
    tags.comment,
    tags.invalid,
    EditorView.baseTheme({
      "&.cm-focused .cm-matchingBracket": {
        backgroundColor: "#328c8252",
      },
      "&.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "#bb555544",
      },
    })),
  brackets = "()[]{}",
  NV = Facet.define({
    combine: function (e) {
      return combineConfig(e, {
        afterCursor: true,
        brackets: brackets,
        maxScanDistance: 1e4,
        renderMatch: renderMatch,
      });
    },
  }),
  RV = Decoration.mark({
    class: "cm-matchingBracket",
  }),
  BV = Decoration.mark({
    class: "cm-nonmatchingBracket",
  });
function renderMatch(e) {
  var t = [],
    n = e.matched ? RV : BV;
  t.push(n.range(e.start.from, e.start.to));
  e.end && t.push(n.range(e.end.from, e.end.to));
  return t;
}
var HV = StateField.define({
    create: function () {
      return Decoration.none;
    },
    update: function (e, t) {
      if (!t.docChanged && !t.selection) return e;
      for (var n = [], i = t.state.facet(NV), r = 0, o = t.state.selection.ranges; r < o.length; r++) {
        var a = o[r];
        if (a.empty) {
          var s =
            jV(t.state, a.head, -1, i) ||
            (a.head > 0 && jV(t.state, a.head - 1, 1, i)) ||
            (i.afterCursor &&
              (jV(t.state, a.head, 1, i) || (a.head < t.state.doc.length && jV(t.state, a.head + 1, -1, i))));
          if (s) {
            n = n.concat(i.renderMatch(s, t.state));
          }
        }
      }
      return Decoration.set(n, !0);
    },
    provide: function (e) {
      return EditorView.decorations.from(e);
    },
  }),
  zV = [HV, OV];
function qV(e) {
  undefined === e && (e = {});
  return [NV.of(e), zV];
}
var WV = new NodeProp();
function UV(e, t, n) {
  var i = e.prop(t < 0 ? NodeProp.openedBy : NodeProp.closedBy);
  if (i) return i;
  if (e.name.length == 1) {
    var r = n.indexOf(e.name);
    if (r > -1 && r % 2 == (t < 0 ? 1 : 0)) return [n[r + t]];
  }
  return null;
}
function _V(e) {
  var t = e.type.prop(WV);
  return t ? t(e.node) : e;
}
function jV(e, t, n, i) {
  if (undefined === i) {
    i = {};
  }
  for (
    var r = i.maxScanDistance || 1e4, o = i.brackets || brackets, a = XB(e), s = a.resolveInner(t, n), l = s;
    l;
    l = l.parent
  ) {
    var c = UV(l.type, n, o);
    if (c && l.from < l.to) {
      var u = _V(l);
      if (u && (n > 0 ? t >= u.from && t < u.to : t > u.from && t <= u.to)) return GV(e, t, n, l, u, c, o);
    }
  }
  return (function (e, t, n, i, r, o, a) {
    var s = n < 0 ? e.sliceDoc(t - 1, t) : e.sliceDoc(t, t + 1),
      l = a.indexOf(s);
    if (l < 0 || (l % 2 == 0) != n > 0) return null;
    for (
      var start = {
          from: n < 0 ? t - 1 : t,
          to: n > 0 ? t + 1 : t,
        },
        u = e.doc.iterRange(t, n > 0 ? e.doc.length : 0),
        h = 0,
        p = 0;
      !u.next().done && p <= o;
    ) {
      var d = u.value;
      if (n < 0) {
        p += d.length;
      }
      for (var f = t + p * n, m = n > 0 ? 0 : d.length - 1, g = n > 0 ? d.length : -1; m != g; m += n) {
        var v = a.indexOf(d[m]);
        if (!(v < 0 || i.resolveInner(f + m, 1).type != r))
          if ((v % 2 == 0) == n > 0) h++;
          else {
            if (h == 1)
              return {
                start: start,
                end: {
                  from: f + m,
                  to: f + m + 1,
                },
                matched: v >> 1 == l >> 1,
              };
            h--;
          }
      }
      if (n > 0) {
        p += d.length;
      }
    }
    return u.done
      ? {
          start: start,
          matched: !1,
        }
      : null;
  })(e, t, n, a, s.type, r, o);
}
function GV(e, t, n, i, r, o, a) {
  var s = i.parent,
    start = {
      from: r.from,
      to: r.to,
    },
    c = 0,
    u = s == null ? undefined : s.cursor();
  if (u && (n < 0 ? u.childBefore(i.from) : u.childAfter(i.to)))
    do {
      if (n < 0 ? u.to <= i.from : u.from >= i.to) {
        if (c == 0 && o.indexOf(u.type.name) > -1 && u.from < u.to)
          return {
            start: start,
            end: (h = _V(u))
              ? {
                  from: h.from,
                  to: h.to,
                }
              : undefined,
            matched: true,
          };
        if (UV(u.type, n, a)) c++;
        else if (UV(u.type, -n, a)) {
          var h;
          if (c == 0)
            return {
              start: start,
              end:
                (h = _V(u)) && h.from < h.to
                  ? {
                      from: h.from,
                      to: h.to,
                    }
                  : undefined,
              matched: false,
            };
          c--;
        }
      }
    } while (n < 0 ? u.prevSibling() : u.nextSibling());
  return {
    start: start,
    matched: !1,
  };
}
function KV(e, t, n, i, r) {
  undefined === i && (i = 0);
  undefined === r && (r = 0);
  t == null && -1 == (t = e.search(/[^\s\u00a0]/)) && (t = e.length);
  for (var o = r, a = i; a < t; a++) e.charCodeAt(a) == 9 ? (o += n - (o % n)) : o++;
  return o;
}
var YV = (function () {
  function e(string, tabSize, indentUnitn0, overrideIndent) {
    this.string = string;
    this.tabSize = tabSize;
    this.indentUnit = indentUnitn0;
    this.overrideIndent = overrideIndent;
    this.pos = 0;
    this.start = 0;
    this.lastColumnPos = 0;
    this.lastColumnValue = 0;
  }
  e.prototype.eol = function () {
    return this.pos >= this.string.length;
  };
  e.prototype.sol = function () {
    return this.pos == 0;
  };
  e.prototype.peek = function () {
    return this.string.charAt(this.pos) || undefined;
  };
  e.prototype.next = function () {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  };
  e.prototype.eat = function (e) {
    var t = this.string.charAt(this.pos);
    if (typeof e == "string" ? t == e : t && (e instanceof RegExp ? e.test(t) : e(t))) {
      ++this.pos;
      return t;
    }
  };
  e.prototype.eatWhile = function (e) {
    for (var t = this.pos; this.eat(e); );
    return this.pos > t;
  };
  e.prototype.eatSpace = function () {
    for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos;
    return this.pos > e;
  };
  e.prototype.skipToEnd = function () {
    this.pos = this.string.length;
  };
  e.prototype.skipTo = function (e) {
    var pos = this.string.indexOf(e, this.pos);
    if (pos > -1) {
      this.pos = pos;
      return !0;
    }
  };
  e.prototype.backUp = function (pos) {
    this.pos -= pos;
  };
  e.prototype.column = function () {
    this.lastColumnPos < this.start &&
      ((this.lastColumnValue = KV(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue)),
      (this.lastColumnPos = this.start));
    return this.lastColumnValue;
  };
  e.prototype.indentation = function () {
    var e;
    return (e = this.overrideIndent) !== null && undefined !== e ? e : KV(this.string, null, this.tabSize);
  };
  e.prototype.match = function (e, t, n) {
    if (typeof e == "string") {
      var i = function (e) {
        return n ? e.toLowerCase() : e;
      };
      return i(this.string.substr(this.pos, e.length)) == i(e) ? (!1 !== t && (this.pos += e.length), !0) : null;
    }
    var r = this.string.slice(this.pos).match(e);
    return r && r.index > 0 ? null : (r && !1 !== t && (this.pos += r[0].length), r);
  };
  e.prototype.current = function () {
    return this.string.slice(this.start, this.pos);
  };
  return e;
})();
function ZV(e) {
  if (typeof e != "object") return e;
  var t = {};
  for (var n in e) {
    var i = e[n];
    t[n] = i instanceof Array ? i.slice() : i;
  }
  return t;
}
var XV = new WeakMap();
!(function (e) {
  function t(t) {
    var n,
      i,
      r = this,
      o = jB(t.languageData),
      streamParser = {
        name: (i = t).name || "",
        token: i.token,
        blankLine: i.blankLine || function () {},
        startState:
          i.startState ||
          function () {
            return !0;
          },
        copyState: i.copyState || ZV,
        indent:
          i.indent ||
          function () {
            return null;
          },
        languageData: i.languageData || {},
        tokenTable: i.tokenTable || tH,
        mergeTokens: !1 !== i.mergeTokens,
      },
      s = new ((function (e) {
        function t() {
          return (e !== null && e.apply(this, arguments)) || this;
        }
        __extends(t, e);
        t.prototype.createParse = function (e, t, i) {
          return new JV(n, e, t, i);
        };
        return t;
      })(Parser))();
    (r = e.call(this, o, s, [], t.name) || this).topNode = (function (e, t) {
      var n = NodeType.define({
        id: nH.length,
        name: "Document",
        props: [
          _B.add(function () {
            return e;
          }),
          uV.add(function () {
            return function (e) {
              return t.getIndent(e);
            };
          }),
        ],
        top: true,
      });
      nH.push(n);
      return n;
    })(o, r);
    n = r;
    r.streamParser = streamParser;
    r.stateAfter = new NodeProp({
      perNode: !0,
    });
    r.tokenTable = t.tokenTable ? new pH(streamParser.tokenTable) : dH;
    return r;
  }
  __extends(t, e);
  t.define = function (e) {
    return new t(e);
  };
  t.prototype.getIndent = function (e) {
    var t = undefined,
      n = e.options.overrideIndentation;
    if (n && (t = XV.get(e.state)) != null && t < e.pos - 1e4) {
      t = undefined;
    }
    var i,
      r,
      o = QV(this, e.node.tree, e.node.from, e.node.from, t != null ? t : e.pos);
    if (
      (o ? ((r = o.state), (i = o.pos + 1)) : ((r = this.streamParser.startState(e.unit)), (i = e.node.from)),
      e.pos - i > 1e4)
    )
      return null;
    for (; i < e.pos; ) {
      var a = e.state.doc.lineAt(i),
        s = Math.min(e.pos, a.to);
      if (a.length)
        for (
          var l = n ? n(a.from) : -1, c = new YV(a.text, e.state.tabSize, e.unit, l < 0 ? undefined : l);
          c.pos < s - a.from;
        )
          eH(this.streamParser.token, c, r);
      else this.streamParser.blankLine(r, e.unit);
      if (s == e.pos) break;
      i = a.to + 1;
    }
    var u = e.lineAt(e.pos);
    n && t == null && XV.set(e.state, u.from);
    return this.streamParser.indent(r, /^\s*(.*)/.exec(u.text)[1], e);
  };
  Object.defineProperty(t.prototype, "allowsNesting", {
    get: function () {
      return !1;
    },
    enumerable: false,
    configurable: true,
  });
})(KB);
function QV(e, t, n, i, r) {
  var o = n >= i && n + t.length <= r && t.prop(e.stateAfter);
  if (o)
    return {
      state: e.streamParser.copyState(o),
      pos: n + t.length,
    };
  for (var a = t.children.length - 1; a >= 0; a--) {
    var s = t.children[a],
      l = n + t.positions[a],
      c = s instanceof Tree && l < r && QV(e, s, l, i, r);
    if (c) return c;
  }
  return null;
}
function $V(e, t, n, i, r) {
  if (r && n <= 0 && i >= t.length) return t;
  if (!(r || n != 0 || t.type != e.topNode)) {
    r = true;
  }
  for (var o = t.children.length - 1; o >= 0; o--) {
    var a = t.positions[o],
      s = t.children[o],
      l = undefined;
    if (a < i && s instanceof Tree) {
      if (!(l = $V(e, s, n - a, i - a, r))) break;
      return r ? new Tree(t.type, t.children.slice(0, o).concat(l), t.positions.slice(0, o + 1), a + l.length) : l;
    }
  }
  return null;
}
var JV = (function () {
  function e(lang, input, fragments, ranges) {
    this.lang = lang;
    this.input = input;
    this.fragments = fragments;
    this.ranges = ranges;
    this.stoppedAt = null;
    this.chunks = [];
    this.chunkPos = [];
    this.chunk = [];
    this.chunkReused = undefined;
    this.rangeIndex = 0;
    this.to = ranges[ranges.length - 1].to;
    var r = JB.get(),
      o = ranges[0].from,
      a = (function (e, t, n, i, r) {
        for (var o = 0, a = t; o < a.length; o++) {
          var s = a[o],
            l = s.from + (s.openStart ? 25 : 0),
            c = s.to - (s.openEnd ? 25 : 0),
            u = l <= n && c > n && QV(e, s.tree, 0 - s.offset, n, c),
            tree = undefined;
          if (u && u.pos <= i && (tree = $V(e, s.tree, n + s.offset, u.pos + s.offset, !1)))
            return {
              state: u.state,
              tree: tree,
            };
        }
        return {
          state: e.streamParser.startState(r ? lV(r) : 4),
          tree: Tree.empty,
        };
      })(lang, fragments, o, this.to, r == null ? undefined : r.state),
      state = a.state,
      l = a.tree;
    this.state = state;
    this.parsedPos = this.chunkStart = o + l.length;
    for (var c = 0; c < l.children.length; c++) {
      this.chunks.push(l.children[c]);
      this.chunkPos.push(l.positions[c]);
    }
    r &&
      this.parsedPos < r.viewport.from - 1e5 &&
      ranges.some(function (e) {
        return e.from <= r.viewport.from && e.to >= r.viewport.from;
      }) &&
      ((this.state = this.lang.streamParser.startState(lV(r.state))),
      r.skipUntilInView(this.parsedPos, r.viewport.from),
      (this.parsedPos = r.viewport.from));
    this.moveRangeIndex();
  }
  e.prototype.advance = function () {
    var e = JB.get(),
      t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt),
      n = Math.min(t, this.chunkStart + 2048);
    for (e && (n = Math.min(n, e.viewport.to)); this.parsedPos < n; ) this.parseLine(e);
    this.chunkStart < this.parsedPos && this.finishChunk();
    return this.parsedPos >= t
      ? this.finish()
      : e && this.parsedPos >= e.viewport.to
        ? (e.skipUntilInView(this.parsedPos, t), this.finish())
        : null;
  };
  e.prototype.stopAt = function (stoppedAt) {
    this.stoppedAt = stoppedAt;
  };
  e.prototype.lineAfter = function (e) {
    var t = this.input.chunk(e);
    if (this.input.lineChunks) {
      if (t == "\n") {
        t = "";
      }
    } else {
      var n = t.indexOf("\n");
      if (n > -1) {
        t = t.slice(0, n);
      }
    }
    return e + t.length <= this.to ? t : t.slice(0, this.to - e);
  };
  e.prototype.nextLine = function () {
    for (var e = this.parsedPos, line = this.lineAfter(e), n = e + line.length, i = this.rangeIndex; ; ) {
      var r = this.ranges[i].to;
      if (r >= n) break;
      if (((line = line.slice(0, r - (n - line.length))), ++i == this.ranges.length)) break;
      var o = this.ranges[i].from,
        a = this.lineAfter(o);
      line += a;
      n = o + a.length;
    }
    return {
      line: line,
      end: n,
    };
  };
  e.prototype.skipGapsTo = function (e, t, n) {
    for (;;) {
      var i = this.ranges[this.rangeIndex].to,
        r = e + t;
      if (n > 0 ? i > r : i >= r) break;
      t += this.ranges[++this.rangeIndex].from - i;
    }
    return t;
  };
  e.prototype.moveRangeIndex = function () {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; ) this.rangeIndex++;
  };
  e.prototype.emitToken = function (e, t, n, i) {
    var r = 4;
    if (this.ranges.length > 1) {
      t += i = this.skipGapsTo(t, i, 1);
      var o = this.chunk.length;
      n += i = this.skipGapsTo(n, i, -1);
      r += this.chunk.length - o;
    }
    var a = this.chunk.length - 4;
    this.lang.streamParser.mergeTokens && r == 4 && a >= 0 && this.chunk[a] == e && this.chunk[a + 2] == t
      ? (this.chunk[a + 2] = n)
      : this.chunk.push(e, t, n, r);
    return i;
  };
  e.prototype.parseLine = function (e) {
    var t = this.nextLine(),
      n = t.line,
      parsedPos = t.end,
      r = 0,
      o = this.lang.streamParser,
      a = new YV(n, e ? e.state.tabSize : 4, e ? lV(e.state) : 2);
    if (a.eol()) o.blankLine(this.state, a.indentUnit);
    else
      for (; !a.eol(); ) {
        var s = eH(o.token, a, this.state);
        if (
          (s &&
            (r = this.emitToken(this.lang.tokenTable.resolve(s), this.parsedPos + a.start, this.parsedPos + a.pos, r)),
          a.start > 1e4)
        )
          break;
      }
    this.parsedPos = parsedPos;
    this.moveRangeIndex();
    this.parsedPos < this.to && this.parsedPos++;
  };
  e.prototype.finishChunk = function () {
    var e = Tree.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: nodeSet,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused,
    });
    e = new Tree(e.type, e.children, e.positions, e.length, [
      [this.lang.stateAfter, this.lang.streamParser.copyState(this.state)],
    ]);
    this.chunks.push(e);
    this.chunkPos.push(this.chunkStart - this.ranges[0].from);
    this.chunk = [];
    this.chunkReused = undefined;
    this.chunkStart = this.parsedPos;
  };
  e.prototype.finish = function () {
    return new Tree(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  };
  return e;
})();
function eH(e, t, n) {
  t.start = t.pos;
  for (var i = 0; i < 10; i++) {
    var r = e(t, n);
    if (t.pos > t.start) return r;
  }
  throw new Error("Stream parser failed to advance stream.");
}
for (
  var tH = Object.create(null),
    nH = [NodeType.none],
    nodeSet = new NodeSet(nH),
    rH = [],
    oH = Object.create(null),
    aH = Object.create(null),
    sH = 0,
    lH = [
      ["variable", "variableName"],
      ["variable-2", "variableName.special"],
      ["string-2", "string.special"],
      ["def", "variableName.definition"],
      ["tag", "tagName"],
      ["attribute", "attributeName"],
      ["type", "typeName"],
      ["builtin", "variableName.standard"],
      ["qualifier", "modifier"],
      ["error", "invalid"],
      ["header", "heading"],
      ["property", "propertyName"],
    ];
  sH < lH.length;
  sH++
) {
  var cH = lH[sH],
    uH = cH[0],
    hH = cH[1];
  aH[uH] = mH(tH, hH);
}
var pH = (function () {
    function e(extra) {
      this.extra = extra;
      this.table = Object.assign(Object.create(null), aH);
    }
    e.prototype.resolve = function (e) {
      return e ? this.table[e] || (this.table[e] = mH(this.extra, e)) : 0;
    };
    return e;
  })(),
  dH = new pH(tH);
function fH(e, t) {
  if (!(rH.indexOf(e) > -1)) {
    rH.push(e);
    console.warn(t);
  }
}
function mH(e, t) {
  for (var n, namei0 = [], r = 0, o = t.split(" "); r < o.length; r++) {
    for (var a = [], s = 0, l = o[r].split("."); s < l.length; s++) {
      var c = l[s],
        u = e[c] || tags[c];
      u
        ? typeof u == "function"
          ? a.length
            ? (a = a.map(u))
            : fH(c, "Modifier ".concat(c, " used at start of tag"))
          : a.length
            ? fH(c, "Tag ".concat(c, " used as modifier"))
            : (a = Array.isArray(u) ? u : [u])
        : fH(c, "Unknown highlighting tag ".concat(c));
    }
    for (var h = 0, p = a; h < p.length; h++) {
      var d = p[h];
      namei0.push(d);
    }
  }
  if (!namei0.length) return 0;
  var name = t.replace(/ /g, "_"),
    m =
      name +
      " " +
      namei0.map(function (e) {
        return e.id;
      }),
    g = oH[m];
  if (g) return g.id;
  var v = (oH[m] = NodeType.define({
    id: nH.length,
    name: name,
    props: [styleTags(((n = {}), (n[name] = namei0), n))],
  }));
  nH.push(v);
  return v.id;
}
function gH(e) {
  return e.length <= 4096 && /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/.test(e);
}
function vH(e) {
  for (var t = e.iter(); !t.next().done; ) if (gH(t.value)) return !0;
  return !1;
}
var yH = Facet.define({
  combine: function (e) {
    return e.some(function (e) {
      return e;
    });
  },
});
!(function () {
  function e(e) {
    this.always =
      e.state.facet(yH) || e.textDirection != Direction.LTR || e.state.facet(EditorView.perLineTextDirection);
    this.hasRTL = !this.always && vH(e.state.doc);
    this.tree = XB(e.state);
    this.decorations = this.always || this.hasRTL ? bH(e, this.tree, this.always) : Decoration.none;
  }
  e.prototype.update = function (e) {
    var t,
      n,
      always =
        e.state.facet(yH) || e.view.textDirection != Direction.LTR || e.state.facet(EditorView.perLineTextDirection);
    if (
      (always ||
        this.hasRTL ||
        ((t = e.changes),
        (n = false),
        t.iterChanges(function (e, t, i, r, o) {
          if (!n && vH(o)) {
            n = true;
          }
        }),
        !n) ||
        (this.hasRTL = true),
      always || this.hasRTL)
    ) {
      var tree = XB(e.state);
      if (always != this.always || tree != this.tree || e.docChanged || e.viewportChanged) {
        this.tree = tree;
        this.always = always;
        this.decorations = bH(e.view, tree, always);
      }
    }
  };
})();
function bH(e, t, n) {
  var i = new RangeSetBuilder(),
    r = e.visibleRanges;
  if (!n) {
    r = (function (e, t) {
      for (var n = t.iter(), i = 0, r = [], o = null, a = 0, s = e; a < s.length; a++) {
        var l = s[a],
          c = l.from,
          u = l.to;
        if (!(o && o.to > c && (c = o.to) >= u))
          for (i + n.value.length < c && (n.next(c - (i + n.value.length)), (i = c)); ; ) {
            var from = i,
              p = i + n.value.length;
            if (
              (!n.lineBreak &&
                gH(n.value) &&
                (o && o.to > from - 10
                  ? (o.to = Math.min(u, p))
                  : r.push(
                      (o = {
                        from: from,
                        to: Math.min(u, p),
                      }),
                    )),
              p >= u)
            )
              break;
            i = p;
            n.next();
          }
      }
      return r;
    })(r, e.state.doc);
  }
  for (var o = 0, a = r; o < a.length; o++) {
    var s = a[o],
      from = s.from,
      c = s.to;
    t.iterate({
      enter: function (e) {
        var t = e.type.prop(NodeProp.isolate);
        if (t) {
          i.add(e.from, e.to, wH[t]);
        }
      },
      from: from,
      to: c,
    });
  }
  return i.finish();
}
var wH = {
    rtl: Decoration.mark({
      class: "cm-iso",
      inclusive: true,
      attributes: {
        dir: "rtl",
      },
      bidiIsolate: Direction.RTL,
    }),
    ltr: Decoration.mark({
      class: "cm-iso",
      inclusive: true,
      attributes: {
        dir: "ltr",
      },
      bidiIsolate: Direction.LTR,
    }),
    auto: Decoration.mark({
      class: "cm-iso",
      inclusive: true,
      attributes: {
        dir: "auto",
      },
      bidiIsolate: null,
    }),
  },
  RenderContext = (function () {
    function e(app) {
      this.hoverPopover = null;
      this.app = app;
    }
    e.prototype.renderFileLink = function (e, t, n) {
      var i,
        r,
        hoverParent = this,
        a = this.app;
      if (e instanceof TFile) {
        i = e;
        r = function () {
          return i.path;
        };
      } else {
        var s = getLinkpath(e);
        i = a.metadataCache.getFirstLinkpathDest(s, "");
        r = function () {
          return s;
        };
      }
      n.addClass("markdown-rendered");
      var targetEl = n.createEl("a", {
        cls: "internal-link",
      });
      t
        ? t.renderTo(targetEl, this)
        : String.isString(e)
          ? targetEl.setText(formatTagPath(e))
          : targetEl.setText(i ? i.getShortName() : r());
      targetEl.toggleClass("is-unresolved", !i);
      xc(targetEl);
      targetEl.onClickEvent(function (e) {
        if (!(e.button !== 0 && e.button !== 1)) {
          e.preventDefault();
          a.workspace.openLinkText(r(), "", Keymap.isModEvent(e));
        }
      });
      targetEl.addEventListener("contextmenu", function (t) {
        var n = Menu.forEvent(t).addSections([
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
        a.workspace.handleLinkContextMenu(n, r(), "");
        e instanceof TFile &&
          n.addItem(function (e) {
            return e
              .setSection("danger")
              .setTitle(i18nProxy.interface.menu.deleteFile())
              .setIcon("lucide-trash-2")
              .setWarning(!0)
              .onClick(function () {
                return a.fileManager.promptForFileDeletion(i);
              });
          });
      });
      a.dragManager.handleDrag(targetEl, function (e) {
        return a.dragManager.dragLink(e, r(), "");
      });
      targetEl.addEventListener("mouseover", function (event) {
        if (Mc(event, targetEl)) {
          a.workspace.trigger("hover-link", {
            event: event,
            source: "bases",
            hoverParent: hoverParent,
            targetEl: targetEl,
            linktext: r(),
          });
        }
      });
    };
    e.prototype.renderExternalLink = function (href, t, n) {
      var i = this.app,
        r = n.createEl("a", {
          href: href,
          attr: {
            target: "_blank",
            rel: "noopener",
          },
        });
      t ? t.renderTo(r, this) : r.setText(href);
      r.addEventListener("contextmenu", function (t) {
        var n = Menu.forEvent(t).addSections(["title", "open", "action", "info", "view", "", "danger"]);
        i.workspace.handleExternalLinkContextMenu(n, href);
      });
    };
    e.prototype.renderTag = function (e, t) {
      var n = this,
        texti0 = e.slice(1);
      t.createEl("a", {
        cls: "tag",
        text: texti0,
      });
      t.addEventListener("click", function (e) {
        var t = n.app.internalPlugins.getEnabledPluginById("global-search");
        if (t) {
          t.openGlobalSearch("tag:" + texti0);
        }
      });
    };
    return e;
  })(),
  CH = (function () {
    function e() {
      this.icon = "lucide-file-question";
    }
    e.equals = function (e, t) {
      return e === t || (e && t && e.constructor === t.constructor && e.equals(t));
    };
    e.looseEquals = function (e, t) {
      return (
        e === t ||
        (!(!e || !t) && (!(e.constructor !== t.constructor || !e.equals(t)) || e.looseEquals(t) || t.looseEquals(e)))
      );
    };
    e.toString = function () {
      return this.type;
    };
    e.prototype.equals = function (e) {
      return !1;
    };
    e.prototype.looseEquals = function (e) {
      return !1;
    };
    e.prototype.renderTo = function (e, t) {
      e.setText(this.toString());
    };
    e.prototype.keys = function () {
      return [];
    };
    e.prototype.objectAccess = function (e) {
      return null;
    };
    e.type = "Any";
    return e;
  })(),
  EH = (function (e) {
    function t() {
      var n = e.call(this) || this;
      if (t.value) throw new Error("Use NullValue.value instead of creating a new NullValue.");
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return "null";
    };
    t.prototype.isTruthy = function () {
      return !1;
    };
    t.prototype.equals = function () {
      return !0;
    };
    t.prototype.renderTo = function (e) {};
    t.type = "Null";
    t.value = new t();
    return t;
  })(CH),
  SH = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    return t;
  })(CH),
  MH = (function (e) {
    function t(data) {
      var n = e.call(this) || this;
      n.data = data;
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return String(this.data);
    };
    t.prototype.isTruthy = function () {
      return !!this.data;
    };
    t.prototype.equals = function (e) {
      return this.data === e.data;
    };
    t.prototype.looseEquals = function (e) {
      return e instanceof t && this.data == e.data;
    };
    return t;
  })(SH),
  xH = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-text";
      return t;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.data;
    };
    t.prototype.keys = function () {
      return e.prototype.keys.call(this).concat(["length"]);
    };
    t.prototype.objectAccess = function (t) {
      return t.toLowerCase() === "length" ? new TH(this.data.length) : e.prototype.objectAccess.call(this, t);
    };
    t.prototype.renderTo = function (e, t) {
      e.setText(this.data);
    };
    t.type = "String";
    return t;
  })(MH),
  TH = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-binary";
      return t;
    }
    __extends(t, e);
    t.prototype.renderTo = function (e, t) {
      isFinite(this.data) || isNaN(this.data) ? e.setText(this.toString()) : e.setText("∞");
    };
    t.type = "Number";
    return t;
  })(MH),
  DH = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-check-square";
      return t;
    }
    __extends(t, e);
    t.prototype.isTruthy = function () {
      return this.data;
    };
    t.prototype.renderTo = function (e) {
      e.createEl("input", {
        type: "checkbox",
        attr: {
          disabled: !0,
        },
      }).checked = this.data;
    };
    t.type = "Boolean";
    return t;
  })(MH),
  AH = (function (e) {
    function t(data) {
      var n = e.call(this) || this;
      n.icon = "lucide-list";
      n.lazyEvaluator = function (e, t) {
        return UH(t);
      };
      n.data = data;
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.join(", ").data;
    };
    t.prototype.isTruthy = function () {
      return this.data.length > 0;
    };
    t.prototype.includes = function (e) {
      for (var t = this.data, n = 0; n < t.length; n++) if (CH.looseEquals(e, this.get(n))) return !0;
      return !1;
    };
    t.prototype.equals = function (e) {
      var t = this.data,
        n = e.data;
      if (t === n) return !0;
      if (t.length !== n.length) return !1;
      for (var i = 0; i < t.length; i++) {
        if (t[i] !== n[i]) {
          var r = this.get(i),
            o = e.get(i);
          if (!CH.equals(r, o)) return !1;
        }
      }
      return !0;
    };
    t.prototype.length = function () {
      return this.data.length;
    };
    t.prototype.get = function (e) {
      var t = this.data[e];
      return t == null ? EH.value : t instanceof CH ? t : (this.data[e] = this.lazyEvaluator(e, t));
    };
    t.prototype.slice = function (e, n) {
      return new t(this.data.slice(e, n));
    };
    t.prototype.reverse = function () {
      return new t(this.data.slice().reverse());
    };
    t.prototype.flatten = function () {
      var e = [],
        n = function (i) {
          for (var r = 0, o = i; r < o.length; r++) {
            var a = o[r];
            a instanceof t ? n(a.data) : Array.isArray(a) ? n(a) : e.push(a);
          }
        };
      n(this.data);
      return new t(e);
    };
    t.prototype.unique = function () {
      for (
        var e = this.data,
          n = [],
          i = function (e) {
            var t = r.get(e);
            if (
              n.some(function (e) {
                return CH.equals(t, e);
              })
            )
              return "continue";
            n.push(t);
          },
          r = this,
          o = 0;
        o < e.length;
        o++
      )
        i(o);
      return new t(n);
    };
    t.prototype.sort = function () {
      var e = this.data.slice();
      e.sort(function (e, t) {
        var n = e instanceof MH ? e.data : e instanceof CH ? e.toString() : e,
          i = t instanceof MH ? t.data : t instanceof CH ? t.toString() : t;
        return Number.isNumber(n) && Number.isNumber(i) ? n - i : Eb(n, i);
      });
      return new t(e);
    };
    t.prototype.concat = function (e) {
      return new t(this.data.concat(e.data));
    };
    t.prototype.join = function (e) {
      for (var t = [], n = this.data, i = 0; i < n.length; i++) {
        var r = n[i];
        if (typeof r == "string" || typeof r == "boolean" || Number.isNumber(r)) t.push(String(r));
        else {
          var o = this.get(i);
          t.push(o.toString());
        }
      }
      return new xH(t.join(e));
    };
    t.prototype.keys = function () {
      return e.prototype.keys.call(this).concat(["length"]);
    };
    t.prototype.objectAccess = function (t) {
      return t.toLowerCase() === "length" ? new TH(this.data.length) : e.prototype.objectAccess.call(this, t);
    };
    t.prototype.renderTo = function (e, t) {
      for (var n = e.createDiv("value-list-container"), i = 0, r = this.data.length; i < r; i++) {
        this.get(i).renderTo(n.createSpan("value-list-element"), t);
        i < r - 1 && n.createSpan("value-list-gap").setText("\n");
      }
    };
    t.type = "List";
    return t;
  })(SH);
function PH(e) {
  return e.charAt(0) === "#" ? e : "#" + e;
}
var LH = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this,
        i = (n.data = PH(t));
      n.lowerTag = i.toLowerCase();
      return n;
    }
    __extends(t, e);
    t.prototype.renderTo = function (e, t) {
      t.renderTag(this.data, e);
    };
    t.prototype.tagMatches = function (e) {
      var n = this.lowerTag;
      if (e instanceof xH) {
        var i = e instanceof t ? e.lowerTag : PH(e.data).toLowerCase();
        if (n.startsWith(i) && (n.length === i.length || n.charAt(i.length) === "/")) return !0;
      }
      return !1;
    };
    return t;
  })(xH),
  IH = (function (e) {
    function t(t) {
      var n =
        e.call(
          this,
          t.map(function (e) {
            return new LH(e);
          }),
        ) || this;
      n.icon = "lucide-tags";
      return n;
    }
    __extends(t, e);
    t.prototype.includes = function (e) {
      for (var t = 0, n = this.data; t < n.length; t++) {
        if (n[t].tagMatches(e)) return !0;
      }
      return !1;
    };
    return t;
  })(AH),
  OH = (function (e) {
    function t(data) {
      var n = e.call(this) || this;
      n.icon = "lucide-list";
      n.lazyEvaluator = function (e, t) {
        return UH(t);
      };
      n.data = data;
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      var e = {},
        t = this.data;
      for (var n in t)
        if (Object.hasOwn(t, n)) {
          e[n] = this.get(n).toString();
        }
      return JSON.stringify(e);
    };
    t.prototype.isTruthy = function () {
      return !this.isEmpty();
    };
    t.prototype.isEmpty = function () {
      return Object.keys(this.data).length === 0;
    };
    t.prototype.equals = function (e) {
      var t = this.data,
        n = e.data;
      if (t === n) return !0;
      var i = Object.keys(t),
        r = Object.keys(n);
      if (i.length !== r.length) return !1;
      for (var o = 0, a = i; o < a.length; o++) {
        var s = a[o];
        if (!Object.hasOwn(n, s)) return !1;
      }
      for (var l = 0, c = i; l < c.length; l++) {
        s = c[l];
        if (!CH.equals(this.get(s), e.get(s))) return !1;
      }
      return !0;
    };
    t.prototype.valuesRaw = function () {
      return Object.values(this.data);
    };
    t.prototype.get = function (e) {
      if (!Object.hasOwn(this.data, e)) return EH.value;
      var t = this.data[e];
      return t instanceof CH ? t : (this.data[e] = this.lazyEvaluator(e, t));
    };
    t.prototype.getInsensitive = function (e) {
      return this.get(KO(this.data, e));
    };
    t.prototype.keys = function () {
      return Object.keys(this.data);
    };
    t.prototype.objectAccess = function (e) {
      return this.getInsensitive(e);
    };
    t.fromFrontMatter = function (e, n, i) {
      var r = new t(Object.assign({}, i)),
        lazyEvaluator = (r.lazyEvaluator = function (i, r) {
          if (String.isString(i) && i.toLowerCase() === "tags" && uc(r, !0)) return new IH(r);
          if (String.isString(r)) {
            var a = qH.parseFromString(e, r, n.path);
            if (a) return a;
            if (qc(r)) return new zH(r);
            var s = NH.parseFromString(r);
            if (s) return s;
          }
          var l = UH(r);
          (l instanceof AH || l instanceof t) && (l.lazyEvaluator = lazyEvaluator);
          return l;
        });
      return r;
    };
    t.type = "Object";
    return t;
  })(SH),
  FH = (function (e) {
    function t(regexp) {
      var n = e.call(this) || this;
      n.icon = "lucide-regex";
      n.regexp = regexp;
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.regexp.toString();
    };
    t.prototype.isTruthy = function () {
      return !0;
    };
    t.type = "RegExp";
    return t;
  })(SH),
  NH = (function (e) {
    function t(datet0, time) {
      if (undefined === time) {
        time = true;
      }
      var i = e.call(this) || this;
      i.icon = "lucide-calendar";
      i.date = datet0;
      i.time = time;
      time && (i.icon = "lucide-clock");
      return i;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.time ? ((e = this.date), "".concat(jO(e), "T").concat(GO(e))) : jO(this.date);
      var e;
    };
    t.prototype.printDate = function () {
      return jO(this.date);
    };
    t.prototype.dateOnly = function () {
      return this.time ? new t(new Date(this.printDate() + "T00:00:00"), !1) : this;
    };
    t.prototype.printTime = function () {
      return GO(this.date);
    };
    t.prototype.relative = function () {
      return window.moment(this.date).fromNow();
    };
    t.prototype.isTruthy = function () {
      return !0;
    };
    t.prototype.equals = function (e) {
      return this.time === e.time && this.date.getTime() === e.date.getTime();
    };
    t.prototype.looseEquals = function (e) {
      if (e instanceof xH) {
        var n = t.parseFromString(e.data);
        if (n) {
          e = n;
        }
      }
      return (
        e instanceof t &&
        (this.time && e.time
          ? this.date.getTime() === e.date.getTime()
          : this.dateOnly().date.getTime() === e.dateOnly().date.getTime())
      );
    };
    t.prototype.keys = function () {
      return e.prototype.keys
        .call(this)
        .concat(["year", "month", "day", "hour", "minute", "second", "millisecond", "timestamp"]);
    };
    t.prototype.objectAccess = function (t) {
      var n = this.date;
      switch (t.toLowerCase()) {
        case "year":
          return new TH(n.getFullYear());
        case "month":
          return new TH(n.getMonth() + 1);
        case "day":
          return new TH(n.getDate());
        case "hour":
          return new TH(n.getHours());
        case "minute":
          return new TH(n.getMinutes());
        case "second":
          return new TH(n.getSeconds());
        case "millisecond":
          return new TH(n.getMilliseconds());
        case "timestamp":
          return new TH(n.getTime());
      }
      return e.prototype.objectAccess.call(this, t);
    };
    t.parseFromString = function (e) {
      return (function (e) {
        return /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(e);
      })(e)
        ? new t(new Date(e), !0)
        : (function (e) {
              return /^\d{4}-\d{2}-\d{2}$/.test(e);
            })(e)
          ? new t(new Date(e + "T00:00:00"), !1)
          : null;
    };
    t.prototype.renderTo = function (e) {
      e.createEl("input", {
        cls: "metadata-input metadata-input-text " + (this.time ? "mod-datetime" : "mod-date"),
        type: this.time ? "datetime-local" : "date",
        value: this.toString(),
        attr: {
          step: "any",
          disabled: !0,
        },
      });
    };
    t.type = "Date";
    return t;
  })(SH),
  RH = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.relative();
    };
    t.prototype.renderTo = function (e) {
      e.createSpan(this.time ? "mod-datetime" : "mod-date").setText(this.relative());
    };
    return t;
  })(NH),
  BH = (function (e) {
    function t(years, months, days, hours, minutes, seconds, milliseconds) {
      var l = e.call(this) || this;
      l.icon = "lucide-calendar-range";
      l.years = years;
      l.months = months;
      l.days = days;
      l.hours = hours;
      l.minutes = minutes;
      l.seconds = seconds;
      l.milliseconds = milliseconds;
      return l;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      var e = this,
        years = e.years,
        months = e.months,
        days = e.days,
        hours = e.hours,
        minutes = e.minutes,
        seconds = e.seconds,
        milliseconds = e.milliseconds;
      return window.moment
        .duration({
          years: years,
          months: months,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds,
        })
        .humanize();
    };
    t.prototype.isTruthy = function () {
      return (
        this.years !== 0 ||
        this.months !== 0 ||
        this.days !== 0 ||
        this.hours !== 0 ||
        this.minutes !== 0 ||
        this.seconds !== 0 ||
        this.milliseconds !== 0
      );
    };
    t.prototype.equals = function (e) {
      return (
        this.years === e.years &&
        this.months === e.months &&
        this.days === e.days &&
        this.hours === e.hours &&
        this.minutes === e.minutes &&
        this.seconds === e.seconds &&
        this.milliseconds === e.milliseconds
      );
    };
    t.prototype.looseEquals = function (e) {
      if (e instanceof xH) {
        var n = t.parseFromString(e.data);
        if (n) {
          e = n;
        }
      }
      return e instanceof t && this.getMilliseconds() === e.getMilliseconds();
    };
    t.prototype.addToDate = function (e, t) {
      var n = t ? -1 : 1,
        i = new Date(e.date),
        r = e.time;
      this.years !== 0 && i.setFullYear(i.getFullYear() + n * this.years);
      this.months !== 0 && i.setMonth(i.getMonth() + n * this.months);
      this.days !== 0 && i.setDate(i.getDate() + n * this.days);
      this.hours !== 0 && (i.setHours(i.getHours() + n * this.hours), (r = true));
      this.minutes !== 0 && (i.setMinutes(i.getMinutes() + n * this.minutes), (r = true));
      this.seconds !== 0 && (i.setSeconds(i.getSeconds() + n * this.seconds), (r = true));
      this.milliseconds !== 0 && (i.setMilliseconds(i.getMilliseconds() + n * this.milliseconds), (r = true));
      return new NH(i, r);
    };
    t.prototype.getMilliseconds = function () {
      var e = new NH(new Date());
      return this.addToDate(e).date.getTime() - e.date.getTime();
    };
    t.prototype.keys = function () {
      return e.prototype.keys
        .call(this)
        .concat(["years", "months", "days", "weeks", "hours", "minutes", "seconds", "milliseconds"]);
    };
    t.prototype.objectAccess = function (t) {
      var n = t.toLowerCase();
      switch (n) {
        case "years":
        case "months":
        case "weeks":
        case "days":
        case "hours":
        case "minutes":
        case "seconds":
        case "milliseconds":
          var i = new NH(new Date()),
            r = this.addToDate(i);
          return new TH(window.moment(r.date).diff(i.date, n, !0));
      }
      return e.prototype.objectAccess.call(this, t);
    };
    t.parseFromString = function (e) {
      var n = e.match(
        /P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/,
      );
      if (n) {
        var i = function (e) {
          return undefined === e ? 0 : parseInt(e);
        };
        return new t(i(n[1]), i(n[2]), 7 * i(n[3]) + i(n[4]), i(n[5]), i(n[6]), i(n[7]), 0);
      }
      var r = e.match(/^(-?\d+) ?([dhmswMy]|(?:second|minute|hour|day|week|month|year)[s]?)$/);
      if (r) {
        var o = r[1],
          a = r[2],
          s = parseFloat(o);
        if (a === "y" || a === "year" || a === "years") return new t(s, 0, 0, 0, 0, 0, 0);
        if (a === "M" || a === "month" || a === "months") return new t(0, s, 0, 0, 0, 0, 0);
        if (a === "w" || a === "week" || a === "weeks") return new t(0, 0, 7 * s, 0, 0, 0, 0);
        if (a === "d" || a === "day" || a === "days") return new t(0, 0, s, 0, 0, 0, 0);
        if (a === "h" || a === "hour" || a === "hours") return new t(0, 0, 0, s, 0, 0, 0);
        if (a === "m" || a === "minute" || a === "minutes") return new t(0, 0, 0, 0, s, 0, 0);
        if (a === "s" || a === "second" || a === "seconds") return new t(0, 0, 0, 0, 0, s, 0);
        if (a === "ms" || a === "millisecond" || a === "milliseconds") return new t(0, 0, 0, 0, 0, 0, s);
      }
      return null;
    };
    t.fromMilliseconds = function (e) {
      return new t(0, 0, 0, 0, 0, 0, e);
    };
    t.type = "Duration";
    return t;
  })(SH),
  VH = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-image";
      return t;
    }
    __extends(t, e);
    t.prototype.renderTo = function (e) {
      var t = getIcon(this.data);
      t || (t = getIcon("question-mark-glyph"));
      t && e.appendChild(t);
    };
    return t;
  })(xH),
  HH = (function (e) {
    function t(app, filen0) {
      var i = e.call(this) || this;
      i.icon = "lucide-file";
      i.app = app;
      i.file = filen0;
      return i;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return this.file.path;
    };
    t.prototype.isTruthy = function () {
      return !0;
    };
    t.prototype.equals = function (e) {
      return this.file === e.file;
    };
    t.prototype.looseEquals = function (e) {
      return e instanceof xH && this.file.path === e.data;
    };
    t.prototype.getLinks = function () {
      if (this._cachedLinks) return this._cachedLinks;
      var e = this.app,
        t = this.file,
        n = [],
        i = e.metadataCache.getFileCache(t);
      if (i) {
        if (i.links)
          for (var r = 0, o = i.links; r < o.length; r++) {
            var a = o[r];
            n.push(qH.fromReference(e, t.path, a));
          }
        if (i.embeds)
          for (var s = 0, l = i.embeds; s < l.length; s++) {
            a = l[s];
            n.push(qH.fromReference(e, t.path, a));
          }
        if (i.frontmatterLinks)
          for (var c = 0, u = i.frontmatterLinks; c < u.length; c++) {
            a = u[c];
            n.push(qH.fromReference(e, t.path, a));
          }
      }
      return (this._cachedLinks = new AH(n));
    };
    t.prototype.getBacklinks = function () {
      if (this._cachedBacklinks) return this._cachedBacklinks;
      var e = this.app,
        t = this.file,
        n = e.metadataCache.resolvedLinks,
        i = [];
      for (var r in n)
        if (Object.hasOwn(n, r) && Object.hasOwn(n[r], t.path)) {
          i.push(new qH(e, r, ""));
        }
      return (this._cachedBacklinks = new AH(i));
    };
    t.prototype.getEmbeds = function () {
      if (this._cachedEmbeds) return this._cachedEmbeds;
      var e = this.app,
        t = this.file,
        n = [],
        i = e.metadataCache.getFileCache(t);
      if (i && i.embeds)
        for (var r = 0, o = i.embeds; r < o.length; r++) {
          var a = o[r];
          n.push(qH.fromReference(e, t.path, a));
        }
      return (this._cachedEmbeds = new AH(n));
    };
    t.prototype.getTags = function () {
      if (this._cachedTags) return this._cachedTags;
      var e = this.app,
        t = this.file,
        n = [],
        i = e.metadataCache.getFileCache(t);
      if (i) {
        if (i.tags)
          for (var r = 0, o = i.tags; r < o.length; r++) {
            var a = o[r];
            n.push(a.tag);
          }
        var s = parseFrontMatterTags(i.frontmatter);
        if (s)
          for (var l = 0, c = s; l < c.length; l++) {
            var u = c[l];
            n.push(u);
          }
      }
      return (this._cachedTags = new IH(ec(n)));
    };
    t.prototype.getProps = function () {
      if (this._cachedProps) return this._cachedProps;
      var e = this.app,
        t = this.file,
        n = e.metadataCache.getFileCache(t);
      return (this._cachedProps = OH.fromFrontMatter(e, t, (n == null ? undefined : n.frontmatter) || {}));
    };
    t.prototype.keys = function () {
      return e.prototype.keys
        .call(this)
        .concat([
          "file",
          "name",
          "basename",
          "fullname",
          "path",
          "folder",
          "ext",
          "ctime",
          "mtime",
          "size",
          "links",
          "embeds",
          "backlinks",
          "tags",
          "properties",
        ]);
    };
    t.prototype.objectAccess = function (t) {
      var n = this.file;
      switch (t.toLowerCase()) {
        case "file":
          return this;
        case "name":
          return new xH(n.getShortName());
        case "basename":
          return new xH(n.basename);
        case "fullname":
          return new xH(n.name);
        case "path":
          return new xH(n.path);
        case "folder":
          return new xH(n.parent.path);
        case "ext":
          return new xH(n.extension);
        case "ctime":
          return new NH(new Date(n.stat.ctime));
        case "mtime":
          return new NH(new Date(n.stat.mtime));
        case "size":
          return new TH(n.stat.size);
        case "links":
          return this.getLinks();
        case "embeds":
          return this.getEmbeds();
        case "backlinks":
          return this.getBacklinks();
        case "tags":
          return this.getTags();
        case "properties":
          return this.getProps();
      }
      return e.prototype.objectAccess.call(this, t);
    };
    t.prototype.renderTo = function (e, t) {
      t.renderFileLink(this.file, null, e);
    };
    t.type = "File";
    return t;
  })(SH),
  zH = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.icon = "lucide-link";
      i.display = n != null ? n : null;
      return i;
    }
    __extends(t, e);
    t.prototype.equals = function (e) {
      return this.data === e.data && CH.equals(this.display, e.display);
    };
    t.prototype.renderTo = function (e, t) {
      t.renderExternalLink(this.data, this.display, e);
    };
    t.type = "URL";
    return t;
  })(xH),
  qH = (function (e) {
    function t(app, n, sourcePath, r) {
      var o = e.call(this, n) || this;
      o.icon = "lucide-link";
      o.app = app;
      o.sourcePath = sourcePath;
      o.display = r != null ? r : null;
      return o;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return "[[".concat(this.data).concat(this.display ? "|" + this.display : "", "]]");
    };
    t.prototype.isTruthy = function () {
      return !0;
    };
    t.prototype.equals = function (e) {
      return this.data === e.data && this.sourcePath === e.sourcePath && CH.equals(this.display, e.display);
    };
    t.prototype.looseEquals = function (e) {
      if (e instanceof t) {
        var n = this.resolve(),
          i = e.resolve();
        return n && i ? n === i : this.data === e.data;
      }
      if (e instanceof xH) {
        var r = t.parseFromString(this.app, e.data, "");
        if (r) return this.looseEquals(r);
      }
      return e instanceof HH && this.resolve() === e.file;
    };
    t.prototype.renderTo = function (e, t) {
      t.renderFileLink(this.data, this.display, e);
    };
    t.prototype.resolve = function () {
      return this.app.metadataCache.getFirstLinkpathDest(getLinkpath(this.data), this.sourcePath);
    };
    t.parseFromString = function (e, n, i) {
      if (n.startsWith("[[") && n.endsWith("]]")) {
        var r = n.slice(2, -2),
          o = null,
          a = r.lastIndexOf("|");
        -1 !== a && ((o = new xH(r.substring(a + 1))), (r = r.substring(0, a)));
        return new t(e, r, i, o);
      }
      return null;
    };
    t.fromReference = function (e, n, i) {
      return new t(e, i.link, n, i.displayText ? new xH(i.displayText) : null);
    };
    t.type = "Link";
    return t;
  })(xH),
  WH = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-image";
      return t;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return isRelativePath(this.data) ? "![[".concat(this.data, "]]") : "![](".concat(this.data, ")");
    };
    t.prototype.renderTo = function (e, t) {
      if (isRelativePath(this.data)) {
        var n = t.app.metadataCache.getFirstLinkpathDest(this.data, "");
        if (n && IMAGE_EXTENSIONS.contains(n.extension)) {
          var src = t.app.vault.getResourcePath(n);
          (r = e.createEl("img")).src = src;
        }
      } else {
        var r = e.createEl("img");
        src = this.data;
        Platform.isDesktopApp && src.startsWith("file:///") && (src = Platform.resourcePathPrefix + src.substring(8));
        r.src = src;
      }
    };
    return t;
  })(xH);
function UH(e) {
  if (e == null || typeof e == "function") return EH.value;
  if (String.isString(e)) return new xH(e);
  if (Number.isNumber(e)) return new TH(e);
  if (!0 === e || !1 === e) return new DH(e);
  if (Array.isArray(e)) return new AH(e.slice());
  if (e instanceof Date) return new NH(new Date(e));
  if (typeof e == "object") return new OH(Object.assign({}, e));
  throw new Error("Value type is unsupported " + String(e));
}
var _H = i18nProxy.formulas.funcs;
function jH(name) {
  for (var type = [], n = 1; n < arguments.length; n++) type[n - 1] = arguments[n];
  return {
    name: name,
    type: type,
  };
}
function GH(name) {
  for (var type = [], n = 1; n < arguments.length; n++) type[n - 1] = arguments[n];
  return {
    name: name,
    type: type,
    optional: !0,
  };
}
function KH(name) {
  for (var type = [], n = 1; n < arguments.length; n++) type[n - 1] = arguments[n];
  return [
    {
      name: name,
      type: type,
      variadic: !0,
    },
  ];
}
function YH(name, customWidget) {
  for (var type = [], i = 2; i < arguments.length; i++) type[i - 2] = arguments[i];
  return {
    name: name,
    type: type,
    customWidget: customWidget,
  };
}
var ZH = (function () {
    function e() {
      this.ctx = null;
    }
    e.prototype.applyWithContext = function (ctx) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      this.ctx = ctx;
      try {
        return this.apply.apply(this, t);
      } finally {
        this.ctx = null;
      }
    };
    e.prototype.serialize = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return "".concat(this.name, "(").concat(e.join(", "), ")");
    };
    return e;
  })(),
  XH = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.apply = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new DH(this.operate.apply(this, e));
    };
    t.prototype.serialize = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      var n = e[0],
        i = e.slice(1);
      return "".concat(n, ".").concat(this.name, "(").concat(i.join(", "), ")");
    };
    return t;
  })(ZH),
  QH = new ((function () {
    function e() {
      this.global = {};
      this.instance = new Map();
    }
    e.prototype.addForType = function (e, t) {
      var n = this.instance.get(e);
      n || ((n = {}), this.instance.set(e, n));
      n[t.name.toLowerCase()] = t;
    };
    e.prototype.removeForType = function (e, t) {
      var n = this.instance.get(e);
      if (n) {
        delete n[t.toLowerCase()];
      }
    };
    e.prototype.addGlobal = function (e) {
      this.global[e.name.toLowerCase()] = e;
    };
    e.prototype.removeGlobal = function (e) {
      delete this.global[e.toLowerCase()];
    };
    e.prototype.getAllForValue = function (e) {
      for (var t = {}, n = e.constructor; n; ) {
        var i = this.instance.get(n);
        if ((i && (t = __assign(__assign({}, i), t)), n === CH)) break;
        n = Object.getPrototypeOf(n);
      }
      return t;
    };
    e.prototype.findForValue = function (e, t) {
      for (var n = t.toLowerCase(), i = e.constructor; i; ) {
        var r = this.instance.get(i);
        if (r && Object.hasOwn(r, n)) return r[n];
        if (i === CH) break;
        i = Object.getPrototypeOf(i);
      }
      return null;
    };
    e.prototype.getAllGlobal = function () {
      return Object.values(this.global);
    };
    e.prototype.findGlobal = function (e) {
      var t = e.toLowerCase();
      return Object.hasOwn(this.global, t) ? this.global[t] : null;
    };
    return e;
  })())();
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "now";
      t.params = [];
      t.docString = _H.labelGlobalNow;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function () {
      return new NH(new Date(), !0);
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "today";
      t.params = [];
      t.docString = _H.labelGlobalToday;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function () {
      return new NH(new Date()).dateOnly();
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "date";
      t.params = [jH("input", xH, NH)];
      t.docString = _H.labelGlobalDate;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      if (e instanceof NH) return e;
      var t = NH.parseFromString(e.data);
      if (t) return t;
      var n = (function (e) {
        if (/^\d{12}$/.test(e)) {
          var t = parseInt(e.slice(0, 4), 10),
            n = parseInt(e.slice(4, 6), 10) - 1,
            i = parseInt(e.slice(6, 8), 10),
            r = parseInt(e.slice(8, 10), 10),
            o = parseInt(e.slice(10, 12), 10);
          return new Date(t, n, i, r, o);
        }
        return null;
      })(e.data);
      if (n) return new NH(n, !0);
      var i = (function (e) {
        if (/^\d{8}$/.test(e)) {
          var t = parseInt(e.slice(0, 4), 10),
            n = parseInt(e.slice(4, 6), 10) - 1,
            i = parseInt(e.slice(6, 8), 10);
          return new Date(t, n, i);
        }
        return null;
      })(e.data);
      return i ? new NH(i, !1) : EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "if";
      t.params = [jH("condition", DH), jH("true_result", CH), GH("false_result", CH)];
      t.docString = _H.labelGlobalIf;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t, n) {
      return e.data ? t : n || EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "min";
      t.params = __spreadArray([], KH("inputs", TH), !0);
      t.docString = _H.labelGlobalMin;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      var n = e.filter(Boolean).map(function (e) {
        return e.data;
      });
      return n.length === 0 ? null : new TH(Math.min.apply(Math, n));
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "max";
      t.params = __spreadArray([], KH("inputs", TH), !0);
      t.docString = _H.labelGlobalMax;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      var n = e.filter(Boolean).map(function (e) {
        return e.data;
      });
      return n.length === 0 ? null : new TH(Math.max.apply(Math, n));
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "list";
      t.params = [jH("self", SH)];
      t.docString = _H.labelGlobalList;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e instanceof AH ? e : new AH([e]);
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "link";
      t.params = [jH("self", xH, HH), GH("display", CH)];
      t.docString = _H.labelGlobalLink;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      if (e instanceof zH || (e instanceof xH && zc(e.data))) return new zH(e.data, t);
      if (e instanceof HH) return new qH(this.ctx.app, e.file.path, "", t);
      var n = qH.parseFromString(this.ctx.app, e.data, "");
      return n || new qH(this.ctx.app, e.data, "", t);
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "number";
      t.params = [jH("input", SH)];
      t.docString = _H.labelGlobalNumber;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      if (e instanceof TH) return e;
      if (e instanceof xH) {
        var t = parseFloat(e.data);
        if (isNaN(t)) throw new Error('Unable to parse "'.concat(e.data, '" as a number.'));
        return new TH(t);
      }
      if (e instanceof DH) return new TH(e.data ? 1 : 0);
      if (e instanceof NH) return new TH(e.date.getTime());
      throw new Error('Unable to convert "'.concat(e.constructor.toString(), '" to a number.'));
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "duration";
      t.params = [jH("input", xH)];
      t.docString = _H.labelGlobalDuration;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      var t;
      return (t = BH.parseFromString(e.data)) !== null && undefined !== t ? t : EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "image";
      t.params = [jH("input", xH, HH, qH, zH)];
      t.docString = _H.labelGlobalImage;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      if (e instanceof qH) {
        var t = e.resolve();
        return t ? new WH(t.path) : EH.value;
      }
      return e instanceof xH || e instanceof zH ? new WH(e.data) : e instanceof HH ? new WH(e.file.path) : EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "icon";
      t.params = [jH("input", xH)];
      t.docString = _H.labelGlobalIcon;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new VH(e.data);
    };
    return t;
  })(ZH))(),
);
QH.addGlobal(
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "file";
      t.params = [jH("input", xH, qH, HH)];
      t.docString = _H.labelGlobalFile;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      if (e instanceof HH) return e;
      var t,
        n = this.ctx.app;
      e instanceof qH
        ? (t = e.resolve())
        : e instanceof xH && (t = n.metadataCache.getFirstLinkpathDest(getLinkpath(e.data), ""));
      return t ? new HH(n, t) : EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  CH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "toString";
      t.params = [jH("self", CH)];
      t.docString = _H.labelValueToString;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new xH(e.toString());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  CH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isTruthy";
      t.params = [jH("self", CH)];
      t.docString = _H.labelValueIsTruthy;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new DH(e.isTruthy());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  EH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", EH)];
      t.docString = _H.labelNullIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return !0;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "startsWith";
      t.params = [jH("self", xH), jH("query", xH)];
      t.docString = _H.labelStringStartsWith;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return e.data.startsWith(t.data);
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "endsWith";
      t.params = [jH("self", xH), jH("query", xH)];
      t.docString = _H.labelStringEndsWith;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return e.data.endsWith(t.data);
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "trim";
      t.params = [jH("self", xH)];
      t.docString = _H.labelStringTrim;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      var t = e.data.trim();
      return t === e.data ? e : new xH(t);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "title";
      t.params = [jH("self", xH)];
      t.docString = _H.labelStringTitle;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new xH(
        e.data
          .split(" ")
          .map(function (e) {
            return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
          })
          .join(" "),
      );
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", xH)];
      t.docString = _H.labelStringIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return e.data.length === 0;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "replace";
      t.params = [jH("value", xH), jH("pattern", xH, FH), jH("replacement", xH)];
      t.docString = _H.labelStringReplace;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t, n) {
      return t instanceof FH
        ? new xH(e.data.replace(t.regexp, n.data))
        : t.data === ""
          ? e
          : new xH(e.data.split(t.data).join(n.data));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "reverse";
      t.params = [jH("self", xH)];
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new xH(e.data.split("").reverse().join(""));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "lower";
      t.params = [jH("self", xH)];
      t.docString = _H.labelStringLower;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new xH(e.data.toLowerCase());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "split";
      t.params = [jH("self", xH), jH("separator", xH, FH), GH("n", TH)];
      t.docString = _H.labelStringSplit;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t, n) {
      var i = e.data,
        r = t instanceof xH ? t.data : t.regexp,
        o = n ? i.split(r, n.data) : i.split(r);
      return new AH(o);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "contains";
      t.params = [jH("self", xH), jH("value", xH)];
      t.docString = _H.labelStringContains;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return t.data !== "" && e.data.toLowerCase().includes(t.data.toLowerCase());
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "containsAny";
      t.params = __spreadArray([jH("self", xH)], KH("values", xH), !0);
      t.docString = _H.labelStringContainsAny;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      var i = e.data.toLowerCase();
      return t.some(function (e) {
        return i.includes(e.data.toLowerCase());
      });
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "containsAll";
      t.params = __spreadArray([jH("self", xH)], KH("values", xH), !0);
      t.docString = _H.labelStringContainsAll;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      var i = e.data.toLowerCase();
      return t.every(function (e) {
        return i.includes(e.data.toLowerCase());
      });
    };
    return t;
  })(XH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "slice";
      t.params = [jH("self", xH), jH("start", TH), GH("end", TH)];
      t.docString = _H.labelStringSlice;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t, n) {
      var i = t.data,
        r = n ? n.data : undefined;
      return new xH(e.data.slice(i, r));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  xH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "repeat";
      t.params = [jH("self", xH), jH("count", TH)];
      t.docString = _H.labelStringRepeat;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return new xH(e.data.repeat(t.data));
    };
    return t;
  })(ZH))(),
);
var $H = (function (e) {
  function t() {
    var t = (e !== null && e.apply(this, arguments)) || this;
    t.params = [jH("self", TH)];
    return t;
  }
  __extends(t, e);
  t.prototype.apply = function (e) {
    return new TH(this.operate(e.data));
  };
  return t;
})(ZH);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.params = [jH("self", TH), GH("digits", TH)];
      t.name = "round";
      t.docString = _H.labelNumberRound;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      if (t && t.data > 0) {
        var n = Math.pow(10, t.data);
        return new TH(Math.round(e.data * n) / n);
      }
      return new TH(Math.round(e.data));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "ceil";
      t.docString = _H.labelNumberCeil;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return Math.ceil(e);
    };
    return t;
  })($H))(),
);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "floor";
      t.docString = _H.labelNumberFloor;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return Math.floor(e);
    };
    return t;
  })($H))(),
);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "abs";
      t.docString = _H.labelNumberAbs;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return Math.abs(e);
    };
    return t;
  })($H))(),
);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "toFixed";
      t.params = [jH("self", TH), jH("precision", TH)];
      t.docString = _H.labelNumberToFixed;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return new xH(e.data.toFixed(t.data));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  TH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", TH)];
      t.docString = _H.labelNumberIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return !1;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", AH)];
      t.docString = _H.labelListIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return e.length() === 0;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "join";
      t.params = [jH("self", AH), jH("separator", xH)];
      t.docString = _H.labelListJoin;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return e.join(t.data);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "reverse";
      t.params = [jH("self", AH)];
      t.docString = _H.labelListReverse;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e.reverse();
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "flat";
      t.params = [jH("self", AH)];
      t.docString = _H.labelListFlat;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e.flatten();
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "unique";
      t.params = [jH("self", AH)];
      t.docString = _H.labelListUnique;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e.unique();
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "contains";
      t.params = [jH("self", AH), YH("value", "text", CH)];
      t.docString = _H.labelListContains;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return e.includes(t);
    };
    return t;
  })(XH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "containsAny";
      t.params = __spreadArray([jH("self", AH)], KH("values", CH), !0);
      t.docString = _H.labelListContainsAny;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      if (t.length === 1 && t[0] instanceof AH) {
        for (var i = t[0], r = i.length(), o = 0; o < r; o++) if (e.includes(i.get(o))) return !0;
        return !1;
      }
      return t.some(function (t) {
        return e.includes(t);
      });
    };
    return t;
  })(XH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "containsAll";
      t.params = __spreadArray([jH("self", AH)], KH("values", CH), !0);
      t.docString = _H.labelListContainsAll;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      if (t.length === 1 && t[0] instanceof AH) {
        for (var i = t[0], r = i.length(), o = 0; o < r; o++) if (!e.includes(i.get(o))) return !1;
        return !0;
      }
      return t.every(function (t) {
        return e.includes(t);
      });
    };
    return t;
  })(XH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "slice";
      t.params = [jH("self", AH), jH("start", TH), GH("end", TH)];
      t.docString = _H.labelListSlice;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t, n) {
      var i = t.data,
        r = n ? n.data : undefined;
      return e.slice(i, r);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "sort";
      t.params = [jH("self", AH)];
      t.docString = _H.labelListSort;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e.sort();
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "map";
      t.params = [jH("self", AH), jH("value", CH)];
      t.docString = _H.labelListMap;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return e;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  AH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "filter";
      t.params = [jH("self", AH), jH("value", DH)];
      t.docString = _H.labelListFilter;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return e;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  OH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", OH)];
      t.docString = _H.labelObjectIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return e.isEmpty();
    };
    return t;
  })(XH))(),
);
QH.addForType(
  OH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "keys";
      t.params = [jH("self", OH)];
      t.docString = _H.labelObjectKeys;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new AH(e.keys());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  OH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "values";
      t.params = [jH("self", OH)];
      t.docString = _H.labelObjectValues;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new AH(e.valuesRaw());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  OH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "map";
      t.params = [jH("self", OH), jH("value", CH)];
      t.docString = _H.labelObjectMap;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return new AH(e.valuesRaw());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  OH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "filter";
      t.params = [jH("self", OH), jH("value", DH)];
      t.docString = _H.labelObjectFilter;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return e;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  FH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "matches";
      t.params = [jH("self", FH), jH("value", xH)];
      t.docString = _H.labelRegExpMatches;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return e.regexp.test(t.data);
    };
    return t;
  })(XH))(),
);
QH.addForType(
  NH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "format";
      t.params = [jH("self", NH), jH("format", xH)];
      t.docString = _H.labelDateFormat;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return new xH(window.moment(e.date).format(t.data));
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  NH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "date";
      t.params = [jH("self", NH)];
      t.docString = _H.labelDateDate;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return e.time ? e.dateOnly() : e;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  NH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "time";
      t.params = [jH("self", NH)];
      t.docString = _H.labelDateTime;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new xH(e.printTime());
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  NH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "relative";
      t.params = [jH("self", NH)];
      t.docString = _H.labelDateRelative;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      return new RH(e.date, e.time);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  NH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "isEmpty";
      t.params = [jH("self", NH)];
      t.docString = _H.labelDateIsEmpty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      return !1;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  HH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "asLink";
      t.params = [jH("self", HH), GH("display", CH)];
      t.docString = _H.labelFileAsLink;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e, t) {
      return new qH(this.ctx.app, e.file.path, "", t);
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  HH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "hasLink";
      t.params = [jH("self", HH), YH("dest", "file", HH, qH, xH)];
      t.docString = _H.labelFileHasLink;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      var n, i;
      if (t instanceof HH) {
        n = t.file;
        i = t.file.path;
      } else if (t instanceof qH) i = (n = t.resolve()) ? n.path : t.data;
      else {
        var r = getLinkpath(t.data);
        n = this.ctx.app.metadataCache.getFirstLinkpathDest(r, "");
        i = t.data;
      }
      for (var o = e.getLinks(), a = o.length(), s = 0; s < a; s++) {
        var l = o.get(s);
        if (l instanceof qH) {
          if (n && l.resolve() === n) return !0;
          if (!n && l.data === i) return !0;
        }
      }
      return !1;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  HH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "inFolder";
      t.params = [jH("self", HH), YH("folder", "folder", xH)];
      t.docString = _H.labelFileInFolder;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      var n = normalizePath(t.data);
      return n === "/" || e.file.path.startsWith(n + "/");
    };
    return t;
  })(XH))(),
);
QH.addForType(
  HH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "hasTag";
      t.params = __spreadArray(
        [jH("self", HH)],
        (function (name, customWidget) {
          for (var type = [], i = 2; i < arguments.length; i++) type[i - 2] = arguments[i];
          return [
            {
              name: name,
              type: type,
              variadic: true,
              customWidget: customWidget,
            },
          ];
        })("values", "tags", xH),
        !0,
      );
      t.docString = _H.labelFileHasTag;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      for (
        var i = t.map(function (e) {
            return new LH(e.data);
          }),
          r = e.getTags(),
          o = r.length(),
          a = 0;
        a < o;
        a++
      )
        for (var s = r.get(a), l = 0, c = i; l < c.length; l++) {
          var u = c[l];
          if (s.tagMatches(u)) return !0;
        }
      return !1;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  HH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "hasProperty";
      t.params = [jH("self", HH), YH("property", "property", xH)];
      t.docString = _H.labelFileHasProperty;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      var n = e.getProps();
      return n && n.keys().contains(t.data);
    };
    return t;
  })(XH))(),
);
QH.addForType(
  qH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "linksTo";
      t.params = [jH("self", qH), jH("file", HH)];
      t.docString = _H.labelLinkLinksTo;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return this.ctx.app.metadataCache.getFirstLinkpathDest(e.data, "") === t.file;
    };
    return t;
  })(XH))(),
);
QH.addForType(
  qH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "asFile";
      t.params = [jH("self", qH)];
      t.docString = _H.labelLinkAsFile;
      return t;
    }
    __extends(t, e);
    t.prototype.apply = function (e) {
      var t = this.ctx.app,
        n = e.resolve();
      return n ? new HH(t, n) : EH.value;
    };
    return t;
  })(ZH))(),
);
QH.addForType(
  LH,
  new ((function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.name = "matches";
      t.params = [jH("self", LH), jH("tag", xH)];
      t.docString = _H.labelTagMatches;
      return t;
    }
    __extends(t, e);
    t.prototype.operate = function (e, t) {
      return e.tagMatches(t);
    };
    return t;
  })(XH))(),
);
function Sz(e) {
  if (e.external) {
    var t = e.extend ? 1 : 0;
    return function (n, i) {
      return (e.external(n, i) << 1) | t;
    };
  }
  return e.get;
}
const Mz = {
    __proto__: null,
    null: 56,
    true: 58,
    false: 58,
  },
  xz = LRParser.deserialize({
    version: 14,
    states:
      "'tOYQPOOQ}QQOOOYQPO'#ClOOQO'#DX'#DXO!uOSO'#C{O#TOWO'#C{OOQO'#D['#D[O#cQPO'#DOOYQPO'#DPOOQO'#DW'#DWOYQPO,58xOYQPO,58xOYQPO,58{OYQPO,58}OYQPO,59POYQPO,59SO#jQPO'#DYOOQO,59Y,59YOYQPO,59_O#qQPO,59aO#vQQO,59WOOOO'#DQ'#DQO$zOSO,59gOOQO,59g,59gOOOO'#DR'#DRO%YOWO,59gO%hQQO'#DbO%rQPO,59jOOQO,59j,59jO%zQQO,59kO'SQQO1G.dO'ZQQO1G.dO'bQQO1G.gO'{QQO1G.iO(iQQO1G.kO)]QQO1G.nO*aQQO'#DZO*kQPO,59tOOQO,59t,59tO*sQQO1G.yOOQO1G.{1G.{OOOO-E7O-E7OOOQO1G/R1G/ROOOO-E7P-E7POYQPO,59|OOQO1G/U1G/UOOQO1G/V1G/VOYQPO,59uOOQO1G/`1G/`OOQO7+$e7+$eO*zQQO1G/hO+UQQO1G/a",
    stateData:
      "+c~OxOSyOS~OZQOaQOcWOhVOkXOlUOmUOnUOqXO!PSO!STO~ORYOSZOU[OW]OY^OZ^O]_O^_O__Oc`OhbOjcO~OpeO!PgO!QeO!RgO~OphO!RgO!SgO!ThO~OflO~PYOdvO~PYOkxO~Oc`OhbOjcOR`aS`aU`aW`aY`aZ`a]`a^`a_`av`ae`af`ad`a~OpeO!PzO!QeO!RzO~OphO!RzO!SzO!ThO~Oe!UXf!UX~P}Oe|Of}O~Od!OO~P}OU[OW]OY^OZ^O]_O^_O__Oc`OhbOjcORQivQieQifQidQi~OSZO~P&ROSQi~P&RORTiSTiUTivTieTifTidTi~P!WORViSViUViWVivVieVifVidVi~P!ZORXiSXiUXiWXiYXiZXivXieXifXidXi~P!aOc`OhbOjcOR[iS[iU[iW[iY[iZ[i][i^[i_[iv[ie[if[id[i~Od}Xe}X~P}Od!QOe!PO~Of!RO~P}Oe!Uif!Ui~P}Od}ie}i~P}Onj~",
    goto: "$x!VPP!WPP!WP!WP!WPP!WPPP!WP!hPPPP!hP!hPPPPP!xPP!W!W#Y#`PPPP#f!W$b$r!WPPPPP$umXOQVWYZ[]^_`b|!PmROQVWYZ[]^_`b|!PmUOQVWYZ[]^_`b|!PQfSRyfQiTR{iQPOQdQQjVQmWQnYQoZQp[Qq]Qr^Qs_Qt`QwbQ!S|R!T!PmaPdjmnopqrstw!S!TRu`RkV",
    nodeNames:
      "⚠ program LogicalExpression || && EqualityExpression Equality RelationalExpression Relation AdditiveExpression + - MultiplicativeExpression * / % UnaryExpression ! Call ( ) , ] ArrayAccess [ ObjectAccess . Identifier NullLiteral BooleanLiteral RealNumber String Escape RegExp Array GroupedExpression",
    maxTerm: 52,
    nodeProps: [
      ["closedBy", 19, ")"],
      ["openedBy", 20, "("],
      ["isolate", -2, 31, 33, ""],
    ],
    skippedNodes: [0],
    repeatNodeCount: 2,
    tokenData:
      "Md~RzOX#uXY%{YZ&zZ]#u]^'d^p#upq%{qr(crs*Tst#utu*nuv,]vw-Rwx.nxy/Xyz/}z{0s{|1i|}2_}!O3T!O!P3y!P!Q5q!Q![DV![!^#u!^!_EX!_!`Fy!`!aEX!a!c#u!c!}*n!}#OGs#O#PHi#P#QKO#Q#R#u#R#S*n#S#T#u#T#o*n#o#p#u#p#qKt#q$g#u$g;'S*n;'S;=`,V<%lO*n[#|X!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#uW$nU!TWOY$iZw$ix#O$i#P;'S$i;'S;=`%Q<%lO$iW%TP;=`<%l$iS%]U!QSOY%WZr%Ws#O%W#P;'S%W;'S;=`%o<%lO%WS%rP;=`<%l%W[%xP;=`<%l#u_&U[xR!QS!TWOX#uXY%{Zp#upq%{qr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_'RQ!R[yRYZ'X]^'XR'^QyRYZ'X]^'X_'m[yR!QS!TWOY#uYZ'XZ]#u]^'d^r#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_(lZaP!QS!TWOY#uZr#urs$isw#uwx%Wx!_#u!_!`)_!`#O#u#P;'S#u;'S;=`%u<%lO#u^)hXUQ!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u]*[U!PT!TWOY$iZw$ix#O$i#P;'S$i;'S;=`%Q<%lO$i]*wdkP!QS!TWOY#uZr#urs$ist#utu*nuw#uwx%Wx!Q#u!Q![*n![!c#u!c!}*n!}#O#u#P#R#u#R#S*n#S#T#u#T#o*n#o$g#u$g;'S*n;'S;=`,V<%lO*n],YP;=`<%l*n^,fX_Q!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^-YY!QS!TWOY#uZr#urs$isv#uvw-xwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^.RXSQ!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u].uU!SX!QSOY%WZr%Ws#O%W#P;'S%W;'S;=`%o<%lO%W_/bXcR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_0WXdR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^0|X]Q!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^1rXYQ!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_2hXeR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_3^XZR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u_4SZ!QS!TWjQOY#uZr#urs$isw#uwx%Wx!Q#u!Q![4u![#O#u#P;'S#u;'S;=`%u<%lO#u]5OZ!QS!TWnPOY#uZr#urs$isw#uwx%Wx!Q#u!Q![4u![#O#u#P;'S#u;'S;=`%u<%lO#u_5z]^Q!QS!TWOY6sZr6srs7usw6swx=zx!P6s!P!Q#u!Q!}6s!}#OCP#O#P:}#P;'S6s;'S;=`DP<%lO6s]6|]qP!QS!TWOY6sZr6srs7usw6swx=zx!P6s!P!QA[!Q!}6s!}#OCP#O#P:}#P;'S6s;'S;=`DP<%lO6sX7|ZqP!TWOY7uZw7uwx8ox!P7u!P!Q;d!Q!}7u!}#O<|#O#P:}#P;'S7u;'S;=`=t<%lO7uP8tXqPOY8oZ!P8o!P!Q9a!Q!}8o!}#O:O#O#P:}#P;'S8o;'S;=`;^<%lO8oP9fWqP#W#X9a#Z#[9a#]#^9a#a#b9a#g#h9a#i#j9a#j#k9a#m#n9aP:RVOY:OZ#O:O#O#P:h#P#Q8o#Q;'S:O;'S;=`:w<%lO:OP:kSOY:OZ;'S:O;'S;=`:w<%lO:OP:zP;=`<%l:OP;QSOY8oZ;'S8o;'S;=`;^<%lO8oP;aP;=`<%l8oX;keqP!TWOY$iZw$ix#O$i#P#W$i#W#X;d#X#Z$i#Z#[;d#[#]$i#]#^;d#^#a$i#a#b;d#b#g$i#g#h;d#h#i$i#i#j;d#j#k;d#k#m$i#m#n;d#n;'S$i;'S;=`%Q<%lO$iX=RX!TWOY<|Zw<|wx:Ox#O<|#O#P:h#P#Q7u#Q;'S<|;'S;=`=n<%lO<|X=qP;=`<%l<|X=wP;=`<%l7uT>RZqP!QSOY=zZr=zrs8os!P=z!P!Q>t!Q!}=z!}#O@^#O#P:}#P;'S=z;'S;=`AU<%lO=zT>{eqP!QSOY%WZr%Ws#O%W#P#W%W#W#X>t#X#Z%W#Z#[>t#[#]%W#]#^>t#^#a%W#a#b>t#b#g%W#g#h>t#h#i%W#i#j>t#j#k>t#k#m%W#m#n>t#n;'S%W;'S;=`%o<%lO%WT@cX!QSOY@^Zr@^rs:Os#O@^#O#P:h#P#Q=z#Q;'S@^;'S;=`AO<%lO@^TARP;=`<%l@^TAXP;=`<%l=z]AehqP!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P#W#u#W#XA[#X#Z#u#Z#[A[#[#]#u#]#^A[#^#a#u#a#bA[#b#g#u#g#hA[#h#i#u#i#jA[#j#kA[#k#m#u#m#nA[#n;'S#u;'S;=`%u<%lO#u]CWZ!QS!TWOYCPZrCPrs<|swCPwx@^x#OCP#O#P:h#P#Q6s#Q;'SCP;'S;=`Cy<%lOCP]C|P;=`<%lCP]DSP;=`<%l6s]D`]!QS!TWnPOY#uZr#urs$isw#uwx%Wx!O#u!O!P4u!P!Q#u!Q![DV![#O#u#P;'S#u;'S;=`%u<%lO#u^EbZWQ!QS!TWOY#uZr#urs$isw#uwx%Wx!_#u!_!`FT!`#O#u#P;'S#u;'S;=`%u<%lO#u^F^XWQ!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^GQZ!QS!TWOY#uZr#urs$isw#uwx%Wx!_#u!_!`)_!`#O#u#P;'S#u;'S;=`%u<%lO#u_G|XhR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u~HlVO#iIR#i#jIW#j#lIR#l#mIs#m;'SIR;'S;=`Jx<%lOIR~IWOp~~IZS!Q![Ig!c!iIg#T#ZIg#o#pJ]~IjR!Q![Is!c!iIs#T#ZIs~IvR!Q![JP!c!iJP#T#ZJP~JSR!Q![IR!c!iIR#T#ZIR~J`R!Q![Ji!c!iJi#T#ZJi~JlS!Q![Ji!c!iJi#T#ZJi#q#rIR~J{P;=`<%lIR_KXXfR!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u^K{Z!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P#p#u#p#qLn#q;'S#u;'S;=`%u<%lO#u^LwXRQ!QS!TWOY#uZr#urs$isw#uwx%Wx#O#u#P;'S#u;'S;=`%u<%lO#u",
    tokenizers: [0, 1, 2, 3],
    topRules: {
      program: [0, 1],
    },
    specialized: [
      {
        term: 27,
        get: (e) => Mz[e] || -1,
      },
    ],
    tokenPrec: 476,
  });
var Tz = i18nProxy.formulas,
  Dz = (function () {
    function e(texte0) {
      this.text = texte0;
      this.formula = Fz.parse(texte0);
    }
    e.prototype.toString = function () {
      return this.text;
    };
    e.prototype.test = function (e) {
      return this.formula.test(e);
    };
    e.prototype.getValue = function (e) {
      return this.formula.getValue(e);
    };
    return e;
  })(),
  Az = ZB.define({
    parser: xz.configure({
      props: [
        styleTags({
          "ObjectAccess ArrayAccess": tags.variableName,
          'MultiplicativeExpression/"*"': tags.arithmeticOperator,
          'MultiplicativeExpression/"/"': tags.arithmeticOperator,
          'MultiplicativeExpression/"%"': tags.arithmeticOperator,
          'AdditiveExpression/"+"': tags.arithmeticOperator,
          'AdditiveExpression/"-"': tags.arithmeticOperator,
          Identifier: tags.propertyName,
          Boolean: tags.bool,
          String: tags.string,
          RealNumber: tags.number,
          "( )": tags.paren,
          "[ ]": tags.squareBracket,
        }),
      ],
    }),
  });
function Pz(e) {
  if (e.trim() === "")
    return {
      type: "empty",
    };
  var t = Az.parser.parse(e).topNode.firstChild;
  if (e.substring(0, t.from).trim() !== "" || e.substring(t.to).trim() !== "")
    throw new Error("Unable to parse formula. (position ".concat(t.to, ")"));
  return Oz(t, e);
}
function Lz(e, t) {
  return t.slice(e.from, e.to);
}
function Iz(e) {
  try {
    var t = Pz(e);
    if (t.type === "ident" && t.value === e) return !1;
  } catch (e) {}
  return !0;
}
function Oz(e, t) {
  if (e.name === "Identifier")
    return {
      type: "ident",
      value: Lz(e, t),
    };
  if (e.name === "GroupedExpression")
    return {
      type: "paren",
      value: Oz(e.firstChild.nextSibling, t),
    };
  if (e.name === "UnaryExpression") {
    var n = Lz(e.firstChild, t),
      expr = Oz(e.lastChild, t);
    if (n === "!")
      return {
        type: "not",
        expr: expr,
      };
    if (n === "-")
      return {
        type: "negate",
        expr: expr,
      };
    throw new Error("Unexpected node in parsed formula");
  }
  if (e.name === "Call") {
    for (
      var r = [], o = (l = e.firstChild).nextSibling.nextSibling;
      o && o.name === "," && (o = o.nextSibling), o && o.name !== ")";
    ) {
      r.push(o);
      o = o.nextSibling;
    }
    var object = Oz(l, t),
      args = r.map(function (e) {
        return Oz(e, t);
      });
    return {
      type: "call",
      object: object,
      args: args,
    };
  }
  if (e.name === "ObjectAccess") {
    var l,
      c = (l = e.firstChild).nextSibling.nextSibling;
    return {
      type: "object_access",
      object: Oz(l, t),
      index: Oz(c, t),
    };
  }
  if (e.name === "ArrayAccess") {
    var u = e.firstChild;
    c = u.nextSibling.nextSibling;
    return {
      type: "array_access",
      array: Oz(u, t),
      index: Oz(c, t),
    };
  }
  if (e.name === "AdditiveExpression" || e.name === "MultiplicativeExpression") {
    var h = e.firstChild,
      p = h.nextSibling,
      d = p.nextSibling;
    return {
      type: "math",
      op: Lz(p, t),
      left: Oz(h, t),
      right: Oz(d, t),
    };
  }
  if (e.name === "LogicalExpression" || e.name === "RelationalExpression" || e.name === "EqualityExpression") {
    var f = e.firstChild,
      m = f.nextSibling,
      g = m.nextSibling;
    return {
      type: "compare",
      op: Lz(m, t),
      left: Oz(f, t),
      right: Oz(g, t),
    };
  }
  if (e.name === "String") {
    var v = Lz(e, t),
      y = v.match(/"(.*?)"$/);
    if (y)
      return {
        type: "primitive",
        value: JSON.parse(v),
      };
    if ((y = v.match(/'(.*?)'$/))) {
      var b = v.slice(1, -1).replace(/\\'/g, "'"),
        w = b.split('\\"');
      b = w
        .map(function (e) {
          return e.replace(/"/g, '\\"');
        })
        .join('\\"');
      return {
        type: "primitive",
        value: JSON.parse('"'.concat(b, '"')),
      };
    }
    throw new Error("Unexpected string node does not have quotes");
  }
  if (e.name === "RegExp") {
    var k = Lz(e, t),
      C = k.lastIndexOf("/");
    return {
      type: "regexp",
      pattern: k.slice(1, C),
      flags: k.slice(C + 1),
    };
  }
  if (e.name === "RealNumber") {
    var E = Lz(e, t);
    return {
      type: "primitive",
      value: parseFloat(E),
    };
  }
  if (e.name === "BooleanLiteral")
    return {
      type: "primitive",
      value: Lz(e, t) === "true",
    };
  if (e.name === "NullLiteral")
    return {
      type: "primitive",
      value: null,
    };
  if (e.name === "Array") {
    var S = [];
    for (o = e.firstChild.nextSibling; o && o.name === "," && (o = o.nextSibling), o && o.name !== "]"; ) {
      S.push(o);
      o = o.nextSibling;
    }
    var elements = S.map(function (e) {
      return Oz(e, t);
    });
    return {
      type: "array",
      elements: elements,
    };
  }
  if (e.name === "⚠") throw new Error("Unable to parse formula. (position ".concat(e.from, ")"));
  throw new Error('Unknown node type "'.concat(e.name, '" in parsed formula. (position ').concat(e.from, ")"));
}
var Fz = (function () {
    function e(type) {
      this.type = type;
    }
    e.parse = function (t) {
      try {
        var n = Pz(t);
        return e.fromParsedResult(n);
      } catch (e) {
        return new Nz(t, e.message);
      }
    };
    e.fromParsedResult = function (e) {
      if (!e.hasOwnProperty("type"))
        throw new Error(
          Tz.msgErrorParseFormula({
            formula: JSON.stringify(e),
          }),
        );
      switch (e.type) {
        case "empty":
          return Rz.fromParsedResult(e);
        case "compare":
          return Bz.fromParsedResult(e);
        case "math":
          return Vz.fromParsedResult(e);
        case "negate":
          return e.expr.type === "primitive" && Number.isNumber(e.expr.value)
            ? ((e.expr.value = -e.expr.value), jz.fromParsedResult(e.expr))
            : Hz.fromParsedResult(e);
        case "not":
          return zz.fromParsedResult(e);
        case "call":
          return qz.fromParsedResult(e);
        case "array_access":
          return Wz.fromParsedResult(e);
        case "object_access":
          return Uz.fromParsedResult(e);
        case "paren":
          return _z.fromParsedResult(e);
        case "primitive":
          return jz.fromParsedResult(e);
        case "regexp":
          return Gz.fromParsedResult(e);
        case "array":
          return Kz.fromParsedResult(e);
        case "ident":
          return Yz.fromParsedResult(e);
        default:
          throw new Error("Invalid type " + e.type);
      }
    };
    e.prototype.test = function (e) {
      return this.getValue(e).isTruthy();
    };
    return e;
  })(),
  Nz = (function (e) {
    function t(value, parseError) {
      var i = e.call(this, "invalid") || this;
      i.value = value;
      i.parseError = parseError;
      return i;
    }
    __extends(t, e);
    t.prototype.getErrorMessage = function () {
      return this.parseError ? this.parseError : "Unable to parse formula.";
    };
    t.prototype.getValue = function () {
      return EH.value;
    };
    t.prototype.test = function () {
      return !1;
    };
    return t;
  })(Fz),
  Rz = (function (e) {
    function t() {
      return e.call(this, "empty") || this;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t();
    };
    t.prototype.getValue = function () {
      return EH.value;
    };
    t.prototype.test = function () {
      return !1;
    };
    return t;
  })(Fz),
  Bz = (function (e) {
    function t(operator, left, right) {
      var r = e.call(this, "comparison") || this;
      r.operator = operator;
      r.left = left;
      r.right = right;
      return r;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      var n = Fz.fromParsedResult(e.left),
        i = Fz.fromParsedResult(e.right);
      return new t(e.op, n, i);
    };
    t.prototype.getValue = function (e) {
      var t = this.left,
        n = this.right;
      switch (this.operator) {
        case "&&":
          return new DH(t.getValue(e).isTruthy() && n.getValue(e).isTruthy());
        case "||":
          return new DH(t.getValue(e).isTruthy() || n.getValue(e).isTruthy());
      }
      var i,
        r,
        o = t.getValue(e),
        a = n.getValue(e);
      switch (this.operator) {
        case "==":
          return new DH(CH.looseEquals(o, a));
        case "!=":
          return new DH(!CH.looseEquals(o, a));
      }
      if (o instanceof EH) return EH.value;
      if (a instanceof EH) return EH.value;
      if (o instanceof NH) {
        i = o.date.getTime();
        a instanceof xH && (s = NH.parseFromString(a.data)) && (a = s);
      } else if (o instanceof BH) {
        var s;
        if (((i = o.getMilliseconds()), a instanceof xH))
          if ((s = BH.parseFromString(a.data))) {
            a = s;
          }
      } else i = o instanceof TH ? o.data : o.toString();
      switch (
        ((r =
          a instanceof NH
            ? a.date.getTime()
            : a instanceof BH
              ? a.getMilliseconds()
              : a instanceof TH
                ? a.data
                : a.toString()),
        this.operator)
      ) {
        case "<":
          return new DH(i < r);
        case ">":
          return new DH(i > r);
        case "<=":
          return new DH(i <= r);
        case ">=":
          return new DH(i >= r);
      }
      return EH.value;
    };
    return t;
  })(Fz),
  Vz = (function (e) {
    function t(operator, left, right) {
      var r = e.call(this, "arithmetic") || this;
      r.operator = operator;
      r.left = left;
      r.right = right;
      return r;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      var n = Fz.fromParsedResult(e.left),
        i = Fz.fromParsedResult(e.right);
      return new t(e.op, n, i);
    };
    t.prototype.getValue = function (e) {
      var t = this.left.getValue(e),
        n = this.right.getValue(e),
        i = this.operator;
      if (t instanceof TH && n instanceof TH)
        switch (i) {
          case "+":
            return new TH(t.data + n.data);
          case "-":
            return new TH(t.data - n.data);
          case "*":
            return new TH(t.data * n.data);
          case "/":
            return new TH(t.data / n.data);
          case "%":
            return new TH(t.data % n.data);
          default:
            throw new Error("Invalid operator");
        }
      if (t instanceof NH && n instanceof xH) {
        var r = BH.parseFromString(n.data);
        if (r) {
          n = r;
        }
      }
      if (t instanceof NH && n instanceof BH) {
        if (i !== "+" && i !== "-") throw new Error("Invalid date operator");
        return n.addToDate(t, i === "-");
      }
      if (t instanceof BH && n instanceof TH && (i === "*" || i === "/")) {
        var o = i === "*" ? n.data : 1 / n.data;
        return new BH(
          t.years * o,
          t.months * o,
          t.days * o,
          t.hours * o,
          t.minutes * o,
          t.seconds * o,
          t.milliseconds * o,
        );
      }
      if (t instanceof BH && n instanceof BH && (i === "+" || i === "-")) {
        o = i === "+" ? 1 : -1;
        return new BH(
          t.years + n.years * o,
          t.months + n.months * o,
          t.days + n.days * o,
          t.hours + n.hours * o,
          t.minutes + n.minutes * o,
          t.seconds + n.seconds * o,
          t.milliseconds + n.milliseconds * o,
        );
      }
      if (t instanceof AH && n instanceof AH && i === "+") return t.concat(n);
      if (i === "+" && (t instanceof xH || n instanceof xH)) {
        var a = t === EH.value ? "" : t.toString(),
          s = n === EH.value ? "" : n.toString();
        return new xH(a + s);
      }
      if (i === "-" && t instanceof NH && n instanceof NH)
        return BH.fromMilliseconds(t.date.getTime() - n.date.getTime());
      if (t === EH.value || n === EH.value) return EH.value;
      throw new Error("Invalid operator between " + t.constructor.toString() + " and " + n.constructor.toString());
    };
    return t;
  })(Fz),
  Hz = (function (e) {
    function t(expr) {
      var n = e.call(this, "negate") || this;
      n.expr = expr;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(Fz.fromParsedResult(e.expr));
    };
    t.prototype.getValue = function (e) {
      var t = this.expr.getValue(e);
      if (t === EH.value) return t;
      if (!(t instanceof TH)) throw new Error("Unable to negate " + t.toString());
      return new TH(-t.data);
    };
    return t;
  })(Fz),
  zz = (function (e) {
    function t(expr) {
      var n = e.call(this, "not") || this;
      n.expr = expr;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(Fz.fromParsedResult(e.expr));
    };
    t.prototype.getValue = function (e) {
      var t = this.expr.getValue(e);
      return t === EH.value ? t : new DH(!t.isTruthy());
    };
    return t;
  })(Fz),
  qz = (function (e) {
    function t(name, subject, args) {
      var r = e.call(this, "function") || this;
      r.name = name;
      r.subject = subject;
      r.args = args;
      return r;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      if (e.type !== "call") throw new Error("Invalid type");
      var n = e.object,
        i = e.args;
      if (!n || !i || !Array.isArray(i)) throw new Error("Invalid function");
      var r = null;
      if ((n.type === "object_access" && ((r = Fz.fromParsedResult(n.object)), (n = n.index)), n.type !== "ident"))
        throw new Error("Invalid function name");
      return new t(
        n.value,
        r,
        e.args.map(function (e) {
          return Fz.fromParsedResult(e);
        }),
      );
    };
    t.prototype.getValue = function (e) {
      var t,
        n = this,
        functioni0 = n.name,
        r = n.subject,
        o = n.args;
      if (functioni0 === "if") {
        var a = o.length + (r ? 1 : 0);
        if (a < 2)
          throw new Error(
            Tz.msgErrorNotEnoughArguments({
              function: functioni0,
            }),
          );
        if (a > 3)
          throw new Error(
            Tz.msgErrorTooManyArguments({
              function: functioni0,
            }),
          );
        r || ((r = o[0]), (o = o.slice(1)));
        return (r.getValue(e) || EH.value).isTruthy() ? o[0].getValue(e) : o.length === 2 ? o[1].getValue(e) : EH.value;
      }
      var s = null;
      if (r) {
        if (((s = r.getValue(e) || EH.value), !(t = QH.findForValue(s, functioni0)) && s === EH.value)) return EH.value;
      } else t = QH.findGlobal(functioni0);
      if (s instanceof AH)
        switch (functioni0) {
          case "filter":
          case "map":
            if (o.length < 1)
              throw new Error(
                Tz.msgErrorNotEnoughArguments({
                  function: functioni0,
                }),
              );
            if (o.length > 1)
              throw new Error(
                Tz.msgErrorTooManyArguments({
                  function: functioni0,
                }),
              );
            for (
              var l = o[0],
                c = s.length(),
                u = [],
                h = function (t) {
                  var n = s.get(t),
                    r = {
                      app: e.app,
                      keys: function () {
                        return e.keys().concat(["index", "value"]);
                      },
                      getByIdentifier: function (i) {
                        return i === "index" ? new TH(t) : i === "value" ? n : e.getByIdentifier(i);
                      },
                    };
                  functioni0 === "filter" ? l.test(r) && u.push(n) : functioni0 === "map" && u.push(l.getValue(r));
                },
                p = 0;
              p < c;
              p++
            )
              h(p);
            return new AH(u);
        }
      else if (s instanceof OH)
        switch (functioni0) {
          case "filter":
          case "map":
            if (o.length < 1)
              throw new Error(
                Tz.msgErrorNotEnoughArguments({
                  function: functioni0,
                }),
              );
            if (o.length > 1)
              throw new Error(
                Tz.msgErrorTooManyArguments({
                  function: functioni0,
                }),
              );
            l = o[0];
            var d = s.keys();
            if (functioni0 === "filter") {
              u = {};
              for (
                var f = function (t) {
                    var n = s.get(t),
                      i = {
                        app: e.app,
                        keys: function () {
                          return e.keys().concat(["key", "value"]);
                        },
                        getByIdentifier: function (i) {
                          return i === "key" ? new xH(t) : i === "value" ? n : e.getByIdentifier(i);
                        },
                      };
                    if (l.test(i)) {
                      u[t] = n;
                    }
                  },
                  m = 0,
                  g = d;
                m < g.length;
                m++
              ) {
                f(g[m]);
              }
              return new OH(u);
            }
            if (functioni0 === "map") {
              u = [];
              for (
                var v = function (t) {
                    var n = s.get(t),
                      i = {
                        app: e.app,
                        keys: function () {
                          return e.keys().concat(["key", "value"]);
                        },
                        getByIdentifier: function (i) {
                          return i === "key" ? new xH(t) : i === "value" ? n : e.getByIdentifier(i);
                        },
                      };
                    u.push(l.getValue(i));
                  },
                  y = 0,
                  b = d;
                y < b.length;
                y++
              ) {
                v(b[y]);
              }
              return new AH(u);
            }
        }
      if (!t) {
        var w = undefined;
        throw (
          (w = s
            ? Tz.msgErrorInvalidInstanceFunction({
                function: functioni0,
                type: s.constructor.toString(),
              })
            : Tz.msgErrorInvalidFunction({
                function: functioni0,
              })),
          new Error(w)
        );
      }
      var C = t.params,
        E = 0,
        S = [],
        M = function (e) {
          if (E === C.length) {
            if (!C[C.length - 1].variadic)
              throw new Error(
                Tz.msgErrorTooManyArguments({
                  function: functioni0,
                }),
              );
            E--;
          }
          var t = C[E];
          if (t.optional && e === EH.value) S.push(null);
          else {
            if (
              !t.type.some(function (t) {
                return e instanceof t;
              })
            ) {
              if (e === EH.value) return !1;
              throw new Error(
                Tz.msgErrorTypeError({
                  function: functioni0,
                  parameter: t.name,
                  expected: t.type[0].toString(),
                  given: e.constructor.toString(),
                }),
              );
            }
            S.push(e);
          }
          E++;
          return !0;
        };
      if (s && !M(s)) return EH.value;
      for (p = 0; p < o.length; p++) if (!M(o[p].getValue(e) || EH.value)) return EH.value;
      if (E < C.length)
        for (p = E; p < C.length; p++)
          if (!C[p].optional && !C[p].variadic)
            throw new Error(
              Tz.msgErrorNotEnoughArguments({
                function: functioni0,
              }),
            );
      return t.applyWithContext.apply(t, __spreadArray([e], S, !1));
    };
    return t;
  })(Fz),
  Wz = (function (e) {
    function t(array, index) {
      var i = e.call(this, "array_access") || this;
      i.array = array;
      i.index = index;
      return i;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      if (e.type !== "array_access") throw new Error("Invalid type");
      if (!e.hasOwnProperty("array") || !e.hasOwnProperty("index")) throw new Error("Invalid array access");
      return new t(Fz.fromParsedResult(e.array), Fz.fromParsedResult(e.index));
    };
    t.prototype.getValue = function (e) {
      var t = this.array.getValue(e);
      if (!t || t === EH.value) return EH.value;
      var n = this.index.getValue(e);
      if (!n || n === EH.value) return EH.value;
      if (t instanceof AH) {
        if (!(n instanceof TH)) throw new Error("Array index must be an integer. Got " + n.constructor.toString());