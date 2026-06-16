        h++
      ) {
        u(p[h]);
      }
      n &&
        effects.push(
          um.of(function (e, t, n) {
            return n !== s;
          }),
        );
      effects.push(cm.of(a));
      r.dispatch({
        effects: effects,
      });
    };
    t.prototype.removeHighlights = function (e) {
      if (this.cm.dom.isShown() && this.hasHighlight(e))
        if (e) {
          var t = hm.get(e);
          this.cm.dispatch({
            effects: um.of(function (e, n, i) {
              return i !== t;
            }),
          });
        } else
          this.cm.dispatch({
            effects: um.of(function () {
              return !1;
            }),
          });
    };
    t.prototype.hasHighlight = function (e) {
      var t = this.cm.state.field(pm);
      if (!e) return t.size > 0;
      for (var n = hm.get(e), i = t.iter(); i.value; ) {
        if (i.value === n) return !0;
        i.next();
      }
      return !1;
    };
    t.prototype.getAllFoldableLines = function () {
      for (var e = this.cm.state, t = [], n = 1; n <= e.doc.lines; n++) {
        var i = e.doc.line(n),
          r = foldable(this.cm.state, i.from, i.to);
        if (r) {
          t.push(r);
        }
      }
      return t;
    };
    t.prototype.getFoldOffsets = function () {
      for (var e = foldedRanges(this.cm.state), t = new Set(), n = e.iter(); n.value; ) {
        t.add(n.from);
        n.next();
      }
      return t;
    };
    t.prototype.foldLess = function () {
      for (
        var e = this.cm.state.doc,
          t = this.getFoldOffsets(),
          n = this.getAllFoldableLines(),
          i = [],
          r = function (r) {
            for (
              var o = e.lineAt(r.to).to,
                a = {
                  from: r.from,
                  to: o,
                },
                s = n.filter(function (e) {
                  return wm(a, e.from, e.to);
                }),
                l = 0,
                c = s;
              l < c.length;
              l++
            ) {
              var u = c[l];
              if (t.has(u.from)) {
                i.push(u);
                break;
              }
            }
          },
          o = 0,
          a = this.cm.state.selection.ranges;
        o < a.length;
        o++
      ) {
        r(a[o]);
      }
      if (i.length > 0) {
        this.cm.dispatch({
          effects: i.map(function (e) {
            return unfoldEffect.of(e);
          }),
        });
      }
    };
    t.prototype.foldMore = function () {
      for (
        var e = this.cm.state.doc,
          t = this.getFoldOffsets(),
          n = this.getAllFoldableLines(),
          i = [],
          r = function (r) {
            for (
              var o = e.lineAt(r.to).to,
                a = {
                  from: r.from,
                  to: o,
                },
                s = n.filter(function (e) {
                  return wm(a, e.from, e.to);
                }),
                l = s.length - 1;
              l >= 0;
              l--
            ) {
              var c = s[l];
              if (!t.has(c.from)) {
                i.push(c);
                break;
              }
            }
          },
          o = 0,
          a = this.cm.state.selection.ranges;
        o < a.length;
        o++
      ) {
        r(a[o]);
      }
      if (i.length > 0) {
        this.cm.dispatch({
          effects: i.map(function (e) {
            return foldEffect.of(e);
          }),
        });
      }
    };
    t.prototype.insertHorizontalRule = function () {
      var e = this.cm.state;
      this.cm.dispatch(
        e.changeByRange(function (t) {
          var n = bm(e.doc, t.from).ch > 0 ? 2 : 1,
            insert = "\n".repeat(n) + "---\n";
          return {
            range: EditorSelection.cursor(t.from + insert.length),
            changes: [
              {
                from: t.from,
                to: t.to,
                insert: insert,
              },
            ],
          };
        }),
      );
    };
    t.prototype.insertBlock = function (e, t) {
      for (
        var n = this.cm.state,
          i = n.doc,
          r = n.selection,
          o = EditorSelection.create(
            r.ranges.map(function (e) {
              var t = i.lineAt(e.from),
                n = i.lineAt(e.to);
              return EditorSelection.range(t.from, n.to);
            }),
          ),
          changes = [],
          s = 0,
          l = o.ranges;
        s < l.length;
        s++
      ) {
        var c = l[s];
        changes.push({
          insert: e + "\n",
          from: c.from,
        });
        changes.push({
          insert: "\n" + t,
          from: c.to,
        });
      }
      var u = e.length + 1;
      this.cm.dispatch({
        changes: changes,
        selection: EditorSelection.create(
          r.ranges.map(function (e) {
            return EditorSelection.range(e.anchor + u, e.head + u);
          }),
        ),
      });
    };
    t.prototype.insertMarkdownLink = function () {
      var e = this.cm.state,
        t = e.changeByRange(function (t) {
          var n = e.sliceDoc(t.from, t.to),
            insert = "[" + n + "]()",
            r = t.empty ? 1 : 1 + n.length + 2;
          return {
            changes: {
              from: t.from,
              to: t.to,
              insert: insert,
            },
            range: Am(t, t.from + r, t.from + r),
          };
        });
      t.userEvent = "input.autocomplete";
      this.cm.dispatch(t);
    };
    t.prototype.triggerWikilink = function (e) {
      var t = this.cm.state,
        n = t.changeByRange(function (n) {
          var i = e ? "![[" : "[[",
            r = t.sliceDoc(n.from, n.to),
            insert = i + r + "]]",
            a = n.from + i.length + r.length;
          return {
            changes: {
              from: n.from,
              to: n.to,
              insert: insert,
            },
            range: Am(n, a, a),
          };
        });
      n.userEvent = "input.autocomplete";
      this.cm.dispatch(n);
    };
    t.prototype.clearMarkdownFormatting = function () {
      for (
        var e = this.cm,
          changes = [],
          n = this.getTableSelection(),
          i =
            n.length > 0
              ? n.map(function (e) {
                  var t = e.getAbsoluteOffsets(),
                    n = t.textStart,
                    i = t.textEnd;
                  return EditorSelection.range(n, i);
                })
              : e.state.selection.ranges,
          r = 0,
          o = i;
        r < o.length;
        r++
      ) {
        var a = o[r];
        if (!a.empty) {
          syntaxTree(e.state).iterate({
            from: a.from,
            to: a.to,
            enter: function (e) {
              var n;
              new Set(((n = e.type.prop(tokenClassNodeProp)) !== null && undefined !== n ? n : "").split(" ")).has(
                "formatting",
              ) &&
                changes.push({
                  from: e.from,
                  to: e.to,
                  insert: "",
                });
            },
          });
        }
      }
      this.cm.dispatch({
        changes: changes,
      });
    };
    Object.defineProperty(t.prototype, "inTableCell", {
      get: function () {
        var e = this.editorComponent;
        return e instanceof vK || !!e.tableCell;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.getTableSelection = function () {
      return this.editorComponent.tableCell ? this.editorComponent.tableCell.table.selectedCells : [];
    };
    t.prototype.toggleMarkdownFormatting = function (e) {
      var t = this.cm,
        n = syntaxTree(t.state).cursor(IterMode.ExcludeBuffers),
        i = nf[e],
        r = 0,
        o = [],
        changes = [],
        s = true,
        l = this.getTableSelection(),
        c = t.state.selection.ranges;
      if (l.length > 0) {
        c = l.map(function (e) {
          var t = e.getAbsoluteOffsets(),
            n = t.textStart,
            i = t.textEnd;
          return EditorSelection.range(n, i);
        });
        s = false;
      }
      for (
        var u = af(t.state, c[0])[e],
          h = function (l) {
            var c = rf(t.state, l),
              from = c.from,
              p = c.to,
              d = [],
              f = function (e, t, n) {
                if (undefined === n) {
                  n = 0;
                }
                for (var i = e === t, o = r, a = r, s = 0, c = d; s < c.length; s++) {
                  var u = c[s],
                    h = u.from - u.to + u.insert.length;
                  u.to <= e && (o += h);
                  ((h < 0 && u.to <= t) || u.to < t) && (a += h);
                  r += h;
                }
                var p = e + o + n,
                  f = i ? p : t + a + n;
                return l.head >= l.anchor ? EditorSelection.range(p, f) : EditorSelection.range(f, p);
              };
            if ((of(n, l.from), u)) {
              if (l.empty) {
                var m = uf(t.state, from, i);
                if (m) {
                  var g = m.to - m.from;
                  o.push(f(from, from, g));
                  return "continue-selectionLoop";
                }
              }
              var v = hf(
                  t.state,
                  n,
                  {
                    from: from,
                    to: p,
                  },
                  e,
                ),
                y = cf(t.state, v, e);
              d.push.apply(d, y);
              o.push(f(from, Math.min(p, v.to)));
            } else {
              if (l.empty) {
                var b = t.state.wordAt(from);
                if (b) {
                  from = b.from;
                  p = b.to;
                }
              }
              for (var w = t.state.doc.lineAt(l.from), k = t.state.doc.lineAt(l.to), C = w.number; C <= k.number; C++) {
                var fromE0 = from,
                  fromS0 = p,
                  M = t.state.doc.line(C);
                if (!(l.from < M.from || l.to > M.to) || !sf(t.state, M)) {
                  if (!l.empty) {
                    var x = lf(t.state, C);
                    fromE0 = Math.clamp(x.from, from, p);
                    fromS0 = Math.clamp(x.to, from, p);
                  }
                  if ((s && l.empty) || fromE0 !== fromS0) {
                    y = cf(
                      t.state,
                      {
                        from: fromE0,
                        to: fromS0,
                      },
                      e,
                    );
                    d.push.apply(d, y);
                    d.push({
                      from: fromE0,
                      to: fromE0,
                      insert: i.surroundingChars,
                    });
                    d.push({
                      from: fromS0,
                      to: fromS0,
                      insert: i.surroundingChars,
                    });
                  }
                }
              }
              if (l.empty && s) {
                var T = from === p ? -i.surroundingChars.length : 0;
                o.push(f(l.from, l.from, T));
              } else o.push(f(from, p));
            }
            changes = changes.concat(d);
          },
          p = 0,
          d = c;
        p < d.length;
        p++
      )
        h(d[p]);
      this.cm.dispatch({
        changes: changes,
        selection: o.length > 0 ? EditorSelection.create(o) : undefined,
        userEvent: "input.type",
      });
    };
    t.prototype.insertTable = function () {
      var e = this.cm,
        from = e.state.selection.main.anchor,
        n = e.state.doc.lineAt(from),
        i = "\n";
      n.text.length && ((from = n.to), (i = "\n\n"));
      e.dispatch({
        changes: [
          {
            from: from,
            insert: i + "|     |     |\n| --- | --- |\n|     |     |\n",
          },
        ],
      });
      e.dispatch({
        selection: {
          anchor: from + i.length + 1,
        },
      });
    };
    t.prototype.toggleComment = function () {
      var e = this.cm,
        t = syntaxTree(e.state).cursor(IterMode.ExcludeBuffers),
        n = e.state.changeByRange(function (range) {
          var i,
            changes,
            o = af(e.state, range);
          if (o.comment) {
            var a = hf(e.state, t, range, "comment");
            changes = cf(e.state, a, "comment");
          } else {
            range.empty && (range = (i = e.state.wordAt(range.from)) !== null && undefined !== i ? i : range);
            (changes = cf(e.state, range, "comment")).push({
              from: range.from,
              to: range.from,
              insert: "%% ",
            });
            changes.push({
              from: range.to,
              to: range.to,
              insert: " %%",
            });
          }
          range = range.map(ChangeSet.of(changes, e.state.doc.length));
          !o.comment &&
            range.empty &&
            (range = EditorSelection.cursor(range.anchor + 3, range.assoc, range.goalColumn, range.bidiLevel));
          return {
            range: range,
            changes: changes,
          };
        });
      this.cm.dispatch(n);
    };
    t.prototype.searchCursor = function (e) {
      var t = this.cm,
        n = this,
        i = function (n, i) {
          return new SearchCursor(t.state.doc, e, n, i, function (e) {
            return e.toLowerCase();
          });
        },
        r = t.state.selection.main.from,
        o = t.state.selection.main.to;
      function a(t, n) {
        for (var r = n; ; ) {
          for (var o = Math.max(t, r - 1e4 - e.length), a = i(o, r), s = null; !a.nextOverlapping().done; ) s = a.value;
          if (s) return s;
          if (o == t) return null;
          r -= 1e4;
        }
      }
      var s = null;
      return {
        getIndexAndCount: function () {
          if (!s) return [0, 0];
          for (var e = 0, n = 0, r = ym(t.state.doc, s.to), o = i(); n < 9999 && !o.next().done; ) {
            o.value.from <= r && e++;
            n++;
          }
          return [e, n];
        },
        current: function () {
          return s;
        },
        findPrevious: function () {
          s = null;
          var e = a(0, r) || a(r, t.state.doc.length);
          if (!e) return null;
          var n = t.state.doc;
          r = e.from;
          o = e.to;
          return (s = {
            from: bm(n, e.from),
            to: bm(n, e.to),
          });
        },
        findNext: function () {
          var e = i(o).nextOverlapping();
          if ((e.done && (e = i(0).nextOverlapping()), e.done)) return (s = null);
          var n = e.value,
            a = t.state.doc;
          r = n.from;
          o = n.to;
          return (s = {
            from: bm(a, n.from),
            to: bm(a, n.to),
          });
        },
        replace: function (e, t) {
          var i = this.current();
          if (i) {
            n.replaceRange(e, i.from, i.to, t);
          }
        },
        findAll: function () {
          for (var e = i(), n = [], r = t.state.doc; !e.next().done; ) {
            var o = e.value;
            n.push({
              from: bm(r, o.from),
              to: bm(r, o.to),
            });
          }
          return n;
        },
        replaceAll: function (texte0, t) {
          var changes = this.findAll().map(function (t) {
            return {
              from: t.from,
              to: t.to,
              text: texte0,
            };
          });
          n.transaction(
            {
              changes: changes,
            },
            t,
          );
        },
      };
    };
    t.prototype.getClickableTokenAt = function (e) {
      if (!e) return null;
      var t = this.cm,
        n = t.state.doc,
        i = [],
        r = n.line(e.line + 1),
        o = syntaxTree(t.state),
        from = r.from;
      o.iterate({
        from: r.from,
        to: r.to,
        enter: function (e) {
          var t = e.type,
            fromn0 = e.from,
            r = e.to,
            type = t.prop(tokenClassNodeProp);
          if (type) {
            from < fromn0 &&
              i.push({
                type: "",
                from: from,
                to: fromn0,
              });
            i.push({
              type: type,
              from: fromn0,
              to: r,
            });
            from = r;
          }
        },
      });
      from < r.to &&
        i.push({
          type: "",
          from: from,
          to: r.to,
        });
      for (var s = ym(n, e), l = -1, c = 0; c < i.length; c++) {
        var u = i[c];
        if (u.from <= s && u.to >= s) {
          l = c;
          break;
        }
      }
      if (!(l < 0)) {
        var h = function (e) {
            return n.sliceString(e.from, e.to);
          },
          p = i[l],
          d = p.type,
          f = d.split(" "),
          m = h(p),
          g = "hmd-internal-link",
          v = f.contains(g),
          y = f.contains("formatting-link") && ["[[", "![[", "]]"].contains(m);
        if (v || y) {
          for (var b = l - 1; b >= 0; ) {
            var w = i[b].type;
            if (!w || !w.contains(g)) break;
            b--;
          }
          for (var k = l + 1; k < i.length; ) {
            var C = i[k].type;
            if (!C || !C.contains(g)) break;
            k++;
          }
          var E = "",
            S = r.to,
            M = r.from;
          for (c = b + 1; c < k; c++) {
            var x = i[c];
            if (x.type.contains(g)) {
              E += h(x);
              x.from < S && (S = x.from);
              x.to > M && (M = x.to);
            }
          }
          var T = (function (e) {
            var t = e,
              displayText = "",
              i = e.indexOf("|");
            if (-1 !== i) {
              displayText = e.slice(i + 1);
              e.charAt(i - 1) === "\\" && i--;
              t = e.slice(0, i);
            }
            var r = parseLinktext((t = t.trim()));
            return {
              path: r.path,
              subpath: r.subpath,
              displayText: displayText,
            };
          })(E);
          return {
            type: "internal-link",
            text: T.path + T.subpath,
            displayText: T.displayText,
            start: bm(n, S),
            end: bm(n, M),
          };
        }
        if (f.contains("link")) {
          for (var D = l + 1; D < i.length; ) {
            var A = i[D];
            if (!A || !A.type.split(" ").contains("link")) {
              if (A) {
                var P = A.type.split(" ");
                if (P.contains("string") && P.contains("url")) break;
              }
              D = -1;
              break;
            }
            D++;
          }
          if (D > -1 && D < i.length) {
            l = D;
            f = (d = (p = i[D]).type).split(" ");
          }
        }
        if (f.contains("url")) {
          var textL0 = h(p);
          if (
            (textL0 === "(" || textL0 === "["
              ? (textL0 = h((p = i[l + 1])))
              : (textL0 !== ")" && textL0 !== "]") || (textL0 = h((p = i[l - 1]))),
            !p)
          )
            return null;
          var type = "external-link";
          if (f.contains("hmd-footref2")) type = "external-ref-link";
          else if (f.contains("string")) {
            if (isRelativePath((textL0 = extractTagName(textL0)))) {
              type = "internal-link";
              try {
                textL0 = decodeURI(textL0);
              } catch (e) {
                return null;
              }
              textL0 = Kc(textL0).trim();
            }
          } else
            _c(textL0)
              ? (textL0 = "mailto:" + textL0)
              : /^([a-z0-9+.-]+):/.test(textL0) || (textL0 = "https://" + textL0);
          type === "external-link" && (textL0 = normalizeURL(textL0));
          return {
            type: type,
            text: textL0,
            start: bm(n, p.from),
            end: bm(n, p.to),
          };
        }
        if (f.contains("hashtag")) {
          var textO0 = "";
          for (S = r.to, M = r.from, c = 0; c < i.length; c++) {
            var F = i[c];
            if (F.type && F.type.split(" ").contains("hashtag")) {
              textO0 += h(F);
              F.from < S && (S = F.from);
              F.to > M && (M = F.to);
            } else {
              if (!(c < l)) break;
              textO0 = "";
              S = s;
              M = s;
            }
          }
          if (textO0)
            return {
              type: "tag",
              text: textO0,
              start: bm(n, S),
              end: bm(n, M),
            };
        }
        return f.contains("blockid")
          ? {
              type: "blockid",
              text: h(p),
              start: bm(n, p.from),
              end: bm(n, p.to),
            }
          : f.contains("footref") && !f.contains("inline-footnote")
            ? (f.contains("formatting-link-start")
                ? (p = i[l + 1])
                : f.contains("formatting-link-end") && (p = i[l - 1]),
              {
                type: "footref",
                text: h(p).toLowerCase(),
                start: bm(n, p.from - 2),
                end: bm(n, p.to + 1),
              })
            : null;
      }
    };
    t.prototype.insertFootnote = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          hoverParent,
          o,
          a,
          insert,
          l,
          from,
          u,
          changes,
          p,
          d,
          f,
          m,
          g,
          targetEl,
          y,
          w,
          k,
          C,
          E = this;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              t = (e = this).cm;
              n = e.editorComponent;
              i = n.app;
              hoverParent = n.owner;
              o = n.file;
              a = o ? i.metadataCache.getFileCache(o) : null;
              insert = "[^" + getNextFootnoteNumber(a) + "]";
              l = t.state.selection.main;
              from = l.from;
              u = l.to;
              changes = [
                {
                  from: from,
                  insert: insert,
                },
              ];
              p = t.state.doc;
              d = p.slice(u).toString().match(/\n*$/);
              f = d[0].length;
              m = "\n".repeat(2 - Math.min(f, 2));
              changes.push({
                from: p.length,
                insert: m + insert + ": \n",
              });
              t.dispatch({
                changes: changes,
                selection: EditorSelection.cursor(from + insert.length),
              });
              return hoverParent instanceof MarkdownView ? [4, hoverParent.saveImmediately()] : [3, 2];
            case 1:
            case 3:
              b.sent();
              return [3, 5];
            case 2:
              return hoverParent instanceof yY ? [4, hoverParent.save(hoverParent.text, !0)] : [3, 4];
            case 4:
              return [2];
            case 5:
              return [4, i.metadataCache.computeFileMetadataAsync(o)];
            case 6:
              b.sent();
              g = t.domAtPos(from + 1).node;
              targetEl = g.instanceOf(HTMLElement) ? g : g.parentElement;
              y = getComputedStyle(targetEl).direction === "rtl";
              w = t.coordsAtPos(from);
              return [
                4,
                IG.create({
                  app: i,
                  hoverParent: hoverParent,
                  targetEl: targetEl,
                  linktext: "#" + insert,
                  sourcePath: o == null ? undefined : o.path,
                  waitTime: 0,
                  state: {
                    mode: "source",
                  },
                  position: {
                    x: w[y ? "right" : "left"],
                    y: (w.top + w.bottom) / 2,
                  },
                }),
              ];
            case 7:
              k = b.sent();
              (C = k.embed) instanceof yY &&
                C.editMode.register(function () {
                  var e = targetEl.win,
                    t = targetEl.doc;
                  e.setTimeout(function () {
                    if (t.activeElement === t.body) {
                      E.focus();
                    }
                  });
                });
              return [2];
          }
        });
      });
    };
    t.commands = {
      goUp: cursorLineUp,
      goDown: cursorLineDown,
      goLeft: cursorCharLeft,
      goRight: cursorCharRight,
      goStart: goStart,
      goEnd: cursorDocEnd,
      goWordLeft: cursorGroupLeft,
      goWordRight: cursorGroupRight,
      indentMore: indentMoreGG0,
      indentLess: indentLessKG0,
      newlineAndIndent: insertNewlineAndIndent,
      swapLineUp: moveLineUp,
      swapLineDown: moveLineDown,
      deleteLine: deleteLine,
      toggleFold: function (e) {
        return unfoldCode(e) || foldCode(e);
      },
      foldAll: foldAllUG0,
      unfoldAll: unfoldAll,
    };
    return t;
  })(Editor),
  hK = [],
  pK = (function (e) {
    function t(app, containerEl, owner) {
      var r = e.call(this) || this;
      r.cleanupLivePreview = null;
      r.sourceMode = true;
      r.cmInit = false;
      r.cursorPopupEl = null;
      r.tableCell = null;
      r.app = app;
      r.owner = owner;
      r.containerEl = containerEl;
      r.editorSuggest = app.workspace.editorSuggest;
      r.sourceMode = !r.app.vault.getConfig("livePreview");
      var parent = (r.editorEl = containerEl.createDiv("markdown-source-view cm-s-obsidian mod-cm6")),
        a = (r.cm = new EditorView({
          parent: parent,
        }));
      r.editor = new uK(r);
      r.clipboardManager = new ClipboardManager(owner);
      MarkdownPreviewRenderer.registerDomEvents(a.contentDOM, new dR(r.owner));
      parent.addEventListener("click", r.onEditorClick.bind(r));
      parent.addEventListener("mousedown", r.onEditorClick.bind(r), {
        capture: true,
      });
      Platform.isIosApp && Fc(parent, r.onEditorClick.bind(r));
      parent.addEventListener("contextmenu", r.onContextMenu.bind(r));
      parent.on("mouseover", ".cm-link, .cm-hmd-internal-link, .cm-footref", r.onEditorLinkMouseover.bind(r));
      parent.addEventListener("dragstart", r.onEditorDragStart.bind(r));
      parent.onNodeInserted(function () {
        return r.reinit();
      });
      setTimeout(function () {
        return r.onResize;
      }, 0);
      return r;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      this.registerEvent(this.app.vault.on("config-changed", this.onConfigChanged, this));
    };
    Object.defineProperty(t.prototype, "file", {
      get: function () {
        return this.owner.file;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(t.prototype, "path", {
      get: function () {
        var e;
        return ((e = this.file) === null || undefined === e ? undefined : e.path) || "";
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.get = function () {
      return this.cm.state.doc.toString();
    };
    t.prototype.set = function (e, t) {
      var n = this.cm;
      if (t || !this.cmInit) {
        this.cleanupLivePreview && (this.cleanupLivePreview(), (this.cleanupLivePreview = null));
        this.livePreviewPlugin = null;
        this.editorSuggest.close();
        var extensions = [this.getLocalExtensions(), cK.of(this.getDynamicExtensions()), lK];
        try {
          var r = this.path;
          if (r) {
            var o = hK.find(function (e) {
              return e.file === r;
            });
            if (o && o.length === e.length) {
              var a = historyField.spec.fromJSON(o.data);
              extensions.push(
                historyField.init(function () {
                  return a;
                }),
              );
            }
          }
        } catch (e) {
          console.error(e);
        }
        var s = EditorState.create({
          doc: e,
          extensions: extensions,
        });
        n.setState(s);
        n.dispatch({
          effects: [EditorView.scrollIntoView(0), Em.of()],
        });
        n.scrollDOM.scrollTop = 0;
        n.dispatch({
          effects: [Em.of()],
        });
        this.cmInit = true;
      } else {
        for (
          var l = n.state.doc, c = e.split(/\r?\n/g), u = l.lines, line = 0;
          line < c.length && line < u && c[line] === l.line(line + 1).text;
        )
          line++;
        if (line === c.length && line === u) return;
        for (var linep0 = u - 1, d = c.length - 1; linep0 > line && d > line && l.line(linep0 + 1).text === c[d]; ) {
          linep0--;
          d--;
        }
        var f = {
            line: line,
            ch: 0,
          },
          m = {
            line: linep0,
            ch: l.line(linep0 + 1).length,
          },
          insert = c.slice(line, d + 1).join("\n");
        if (line === linep0 && line === d && line < u && line < c.length) {
          for (
            var v = l.line(line + 1).text, y = c[line], b = 0;
            b < v.length && b < y.length && v.charAt(b) === y.charAt(b);
          )
            b++;
          for (
            var w = 0;
            w < v.length - b && w < y.length - b && v.charAt(v.length - 1 - w) === y.charAt(y.length - 1 - w);
          )
            w++;
          if (b > 0 || w > 0) {
            f.ch = b;
            m.ch -= w;
            insert = insert.slice(b, insert.length - w);
          }
        }
        line === Math.min(u, c.length) &&
          ((f = {
            line: line - 1,
            ch: l.line(line).length,
          }),
          c.length > u && (insert = "\n" + insert));
        n.dispatch({
          changes: {
            from: ym(l, f),
            to: ym(l, m),
            insert: insert,
          },
          userEvent: "set",
        });
      }
    };
    t.prototype.saveHistory = function () {
      var filee0 = this.path;
      if (filee0)
        try {
          var t = this.cm.state,
            n = t.field(historyField);
          if (n) {
            var data = historyField.spec.toJSON(n, t),
              r = function (e) {
                if (e && Array.isArray(e))
                  for (var t = 0, n = e; t < n.length; t++) {
                    var i = n[t];
                    if (i.changes && i.changes.length) return !0;
                  }
                return !1;
              };
            if (!r(data.done) && !r(data.undone)) return;
            (hK = hK.filter(function (t) {
              return t.file !== filee0;
            })).push({
              ts: Date.now(),
              file: filee0,
              data: data,
              length: t.doc.length,
            });
            hK.length > 20 && hK.shift();
          }
        } catch (e) {
          console.error(e);
        }
    };
    t.prototype.reinit = function () {
      this.cm.setRoot(this.editorEl.doc);
      this.onResize();
    };
    t.prototype.reparent = function (containerEl) {
      this.containerEl = containerEl;
      containerEl.appendChild(this.editorEl);
      this.reinit();
    };
    t.prototype.clear = function () {
      var e = this;
      this.cleanupLivePreview && (this.cleanupLivePreview(), (this.cleanupLivePreview = null));
      this.livePreviewPlugin = null;
      var t = EditorState.create({
        extensions: [
          this.getLocalExtensions(),
          cK.of(this.getDynamicExtensions()),
          lK,
          editorLivePreviewField.init(function () {
            return !e.sourceMode;
          }),
        ],
      });
      this.cm.setState(t);
      this.cmInit = true;
    };
    t.prototype.destroy = function () {
      this.localExtensions = null;
      this.cleanupLivePreview && (this.cleanupLivePreview(), (this.cleanupLivePreview = null));
      this.livePreviewPlugin = null;
      this.cm.setState(EditorState.create({}));
      this.cm.destroy();
      this.editorSuggest.close();
      this.scope && this.app.keymap.popScope(this.scope);
      Platform.isMobile && this.app.mobileToolbar.update();
      this.destroyTableCell();
    };
    t.prototype.updateEvent = function () {
      var e = this,
        t = false,
        n = debounce(function () {
          e.editorSuggest.trigger(e.editor, e.file, t);
          t = false;
        }, 50),
        i = debounce(function () {
          e.editor.expandText();
        }, 10),
        r = debounce(this.updateLinkPopup.bind(this), 300);
      return function (o) {
        var a = o.transactions,
          s = o.docChanged && a.some(gm);
        s && (i(), a.some(vm) && (t = true));
        (o.focusChanged || o.docChanged || o.selectionSet) && (n(), r());
        e.onUpdate(o, s);
      };
    };
    t.prototype.buildLocalExtensions = function () {
      var e = this,
        t = [];
      t.push(
        editorEditorField.init(function () {
          return e.cm;
        }),
      );
      t.push(
        editorInfoField.init(function () {
          return e.owner;
        }),
      );
      t.push(EditorView.updateListener.of(this.updateEvent()));
      var n = function () {
        return e.editorSuggest.isShowingSuggestion();
      };
      t.push(
        keymap.of([
          {
            key: "ArrowUp",
            run: n,
            preventDefault: !0,
          },
          {
            key: "ArrowDown",
            run: n,
            preventDefault: !0,
          },
          {
            key: "Enter",
            run: n,
            preventDefault: !0,
          },
          {
            key: "Tab",
            run: n,
            preventDefault: !0,
          },
          {
            key: "Escape",
            run: function () {
              e.editor.removeHighlights();
              return !1;
            },
            preventDefault: true,
          },
        ]),
      );
      Platform.isMobileApp && Platform.isIosApp && t.push(HG);
      t.push(
        EditorView.domEventHandlers({
          dragstart: function (e) {
            return e.dataTransfer.clearData("text/html");
          },
          dragover: function (t) {
            return e.clipboardManager.handleDragOver(t);
          },
          drop: function (t) {
            return e.clipboardManager.handleDrop(t);
          },
          copy: function (t) {
            if (!(e.editor.getSelection() || e.editor.getLine(e.editor.getCursor().line))) {
              t.preventDefault();
            }
          },
          paste: function (t) {
            return e.clipboardManager.handlePaste(t);
          },
          focus: function (t) {
            e.app.workspace.activeEditor = e.owner;
            Platform.isMobile && e.app.mobileToolbar.update();
            e.destroyTableCell();
          },
          blur: function () {
            Platform.isMobile && e.app.mobileToolbar.update();
            e.owner instanceof MarkdownView && e.owner.saveImmediately();
            e.editorSuggest.close();
          },
        }),
      );
      return t;
    };
    t.prototype.getLocalExtensions = function () {
      var e = this.localExtensions;
      e || (e = this.localExtensions = this.buildLocalExtensions());
      return e;
    };
    t.prototype.getDynamicExtensions = function () {
      var e = [],
        t = this.app.vault,
        n = t.getConfig("useTab"),
        i = t.getConfig("tabSize");
      e.push(EditorState.tabSize.of(i));
      e.push(indentUnit.of(n ? "\t" : "    "));
      var r = t.getConfig("rightToLeft") || this.editorEl.doc.body.hasClass("mod-rtl");
      this.editorEl.toggleClass("is-rtl", r);
      this.editorEl.setAttr("dir", r ? "rtl" : null);
      r &&
        e.push(
          EditorView.theme({
            "&": {
              direction: "rtl",
            },
          }),
        );
      var o = t.getConfig("spellcheck");
      e.push(
        EditorView.contentAttributes.of({
          spellcheck: String(o),
          autocorrect: "on",
          autocapitalize: "on",
          contenteditable: "true",
        }),
      );
      var a = !this.sourceMode;
      if (
        (this.editorEl.toggleClass("is-live-preview", a),
        e.push(
          editorLivePreviewField.init(function () {
            return a;
          }),
        ),
        a)
      ) {
        var s = this.livePreviewPlugin;
        s || (s = this.livePreviewPlugin = sZ(this, this.cm));
        e.push(s);
      }
      var l = t.getConfig("autoPairBrackets"),
        c = t.getConfig("autoPairMarkdown");
      if (l || c) {
        var bracketsu0 = [];
        l && bracketsu0.push("(", "[", "{", "'", '"');
        c && bracketsu0.push("*", "_", "`", "```");
        var closeBracketsh0 = {
          brackets: bracketsu0,
        };
        e.push([aO, tO]);
        e.push(keymap.of(sO));
        e.push(
          EditorState.languageData.of(function () {
            return [
              {
                closeBrackets: closeBracketsh0,
              },
            ];
          }),
        );
        e.push(bB);
      }
      this.app.isVimEnabled() && e.push([cB, Prec.highest(uB), RR, dB]);
      e.push.apply(e, this.app.workspace.editorExtensions);
      return e;
    };
    t.prototype.onConfigChanged = function (e) {
      if (
        !(
          e !== "useTab" &&
          e !== "tabSize" &&
          e !== "rightToLeft" &&
          e !== "spellcheck" &&
          e !== "autoPairBrackets" &&
          e !== "autoPairMarkdown" &&
          e !== "smartIndentList" &&
          e !== "vimMode"
        )
      ) {
        this.updateOptions();
      }
    };
    t.prototype.updateOptions = function () {
      if (this.cmInit) {
        this.cm.dispatch({
          effects: [
            cK.reconfigure(this.getDynamicExtensions()),
            YG.of({
              field: editorLivePreviewField,
              value: !this.sourceMode,
            }),
          ],
        });
      }
    };
    t.prototype.resetSyntaxHighlighting = function () {
      var e = this.cm;
      if (e.state.doc.length > 0) {
        e.dispatch({
          changes: [
            {
              from: 0,
              to: 1,
              insert: e.state.doc.sliceString(0, 1),
            },
          ],
          userEvent: "set",
        });
      }
    };
    t.prototype.getFoldInfo = function () {
      for (var e = this.cm, t = e.state.doc, folds = [], i = foldedRanges(e.state).iter(); i.value; ) {
        var r = bm(t, i.from),
          o = bm(t, i.to);
        folds.push({
          from: r.line,
          to: o.line,
        });
        i.next();
      }
      return {
        folds: folds,
        lines: t.lines,
      };
    };
    t.prototype.applyFoldInfo = function (e) {
      var t = this.cm;
      if (!e || t.state.doc.lines === e.lines) {
        unfoldAll(t);
        var effects = [];
        if (e)
          for (var i = t.state.doc, r = 0, o = e.folds; r < o.length; r++) {
            var a = o[r],
              s = i.line(a.from + 1),
              l = i.line(Math.min(a.to + 1, i.lines)),
              c = foldable(t.state, s.from, s.to);
            if (c) {
              effects.push(
                foldEffect.of({
                  from: c.from,
                  to: Math.max(c.to, l.to),
                }),
              );
            }
          }
        if (effects.length !== 0) {
          t.dispatch({
            effects: effects,
          });
        }
      }
    };
    t.prototype.toggleFoldFrontmatter = function () {
      if (this.cm.state.doc.lineAt(0).text === "---") {
        var e = foldable(this.cm.state, 0, 0);
        if (e) {
          var t = EO(foldedRanges(this.cm.state), 0, 0) ? unfoldEffect : foldEffect;
          this.cm.dispatch({
            effects: t.of(e),
          });
        }
      }
    };
    t.prototype.getClickableTokenHref = function (e) {
      var t;
      if (e.type === "external-link") return e.text;
      if (e.type === "external-ref-link") {
        if (!this.file) return null;
        var n = this.app.metadataCache.getFileCache(this.file),
          i =
            (t = n == null ? undefined : n.referenceLinks) === null || undefined === t
              ? undefined
              : t.find(function (t) {
                  return t.id === e.text;
                });
        return i && normalizeURL(i.link) ? i.link : null;
      }
      return null;
    };
    t.prototype.triggerClickableToken = function (e, t) {
      var n = this;
      if (e.type === "internal-link")
        setTimeout(function () {
          n.app.workspace.openLinkText(e.text, n.path, t);
        }, 100);
      else if (e.type === "external-link" || e.type === "external-ref-link") {
        var href = this.getClickableTokenHref(e);
        if (!href) return;
        zc(href)
          ? !0 === t
            ? window.open(href, "tab")
            : !1 === t
              ? window.open(href)
              : window.open(href, t)
          : new Notice(
              i18nProxy.interface.msgFailedToOpenHref({
                href: href,
              }),
            );
      } else if (e.type === "tag") {
        var r = e.text;
        if (!r.startsWith("#")) {
          r = "#" + r;
        }
        var o = this.app.internalPlugins.getEnabledPluginById("global-search");
        if (o) {
          o.openGlobalSearch("tag:" + r);
        }
      }
    };
    t.prototype.updateLinkPopup = function () {
      var e = this;
      if (Platform.isMobile && this.sourceMode) {
        var t = this,
          n = t.cm,
          i = t.editor,
          r = t.cursorPopupEl;
        if ((r && (r.detach(), (this.cursorPopupEl = null)), n.hasFocus)) {
          var o = i.getCursor("from"),
            a = i.getClickableTokenAt(o);
          if (a && a.type !== "footref") {
            var s = n.scrollDOM;
            this.cursorPopupEl = s.createDiv();
            var targetEl = this.cursorPopupEl.createDiv("follow-link-popover tappable");
            a.type === "internal-link"
              ? targetEl.setText(i18nProxy.editor.linkPopover.tooltipFollowLink())
              : a.type === "external-link" || a.type === "external-ref-link"
                ? targetEl.setText(i18nProxy.editor.linkPopover.tooltipOpenLink())
                : a.type === "tag" && targetEl.setText(i18nProxy.editor.linkPopover.tooltipSearchTag());
            targetEl.createDiv("popover-arrow");
            targetEl.style.position = "absolute";
            targetEl.style.cursor = "pointer";
            targetEl.style.zIndex = "var(--layer-popover)";
            targetEl.style.top = "0";
            targetEl.style.left = "0";
            var c = i.coordsAtPos(a.start, !0),
              u = i.coordsAtPos(a.end, !0);
            if (c && u) {
              var h = targetEl.offsetWidth,
                p = targetEl.offsetParent ? targetEl.offsetParent.clientWidth : s.clientWidth,
                d = c.top - targetEl.offsetHeight - 8,
                f = (c.left + u.left) / 2 - h / 2;
              u.top >= c.bottom && (f = c.left - h / 2);
              targetEl.style.top = d + "px";
              targetEl.style.left = Math.clamp(f, 0, p - h) + "px";
              targetEl.addEventListener("mousedown", function (e) {
                return e.preventDefault();
              });
              targetEl.onClickEvent(function (t) {
                targetEl.detach();
                e.triggerClickableToken(a, t.shiftKey || t.button === 1);
                t.preventDefault();
              });
              a.type === "internal-link" &&
                targetEl.addEventListener("mouseover", function (event) {
                  if (Mc(event, targetEl)) {
                    e.app.workspace.trigger("hover-link", {
                      event: event,
                      source: "editor",
                      hoverParent: e.owner,
                      targetEl: targetEl,
                      linktext: a.text,
                      sourcePath: e.path,
                    });
                  }
                });
            } else targetEl.detach();
          }
        }
      }
    };
    t.prototype.toggleSource = function () {
      this.sourceMode = !this.sourceMode;
      this.updateOptions();
      this.cm.dispatch({
        effects: [Em.of()],
      });
    };
    t.prototype.onUpdate = function (e, t) {};
    t.prototype.onEditorClick = function (e, t) {
      var n = this;
      if (
        Platform.isMobileApp
          ? (Platform.isAndroidApp && e.type === "mousedown") ||
            (e.type === "click" && !e.isTrusted && !!t) ||
            (Platform.isIosApp && e.type === "click" && e.isTrusted)
          : (e.type === "click" && e.button === 0) || (e.type === "mousedown" && e.button === 1)
      ) {
        var i = Keymap.isModifier(e, "Mod") || e.button === 1;
        if ((!this.sourceMode || i) && (this.sourceMode || e.button !== 0 || i || (!e.altKey && !e.shiftKey))) {
          var r = t || e.target,
            o = this.cm.contentDOM;
          if (o.contains(r) && r !== o && r.parentNode !== o) {
            for (var a = r; a && a !== o; ) {
              if (
                a.instanceOf(HTMLElement) &&
                a.contentEditable === "false" &&
                !a.hasClass("external-link") &&
                !a.draggable
              )
                return;
              a = a.parentNode;
            }
            var s = this.editor.getClickableTokenAt(this.editor.posAtMouse(e));
            if (s) {
              var l = Keymap.isModEvent(e);
              if (
                (function () {
                  if (n.sourceMode) return !0;
                  if (l) return !0;
                  if (!r.instanceOf(HTMLElement)) return !1;
                  if (s.type === "tag") return !0;
                  if (s.type === "internal-link") {
                    if (!r.matchParent(".cm-underline")) return !1;
                    if (r.matchParent(".cm-hmd-internal-link")) return !0;
                    if (r.matchParent(".cm-link")) return !0;
                  }
                  if (s.type === "external-link" || s.type === "external-ref-link") {
                    if (r.matchParent(".external-link")) return !0;
                    if (!r.matchParent(".cm-underline")) return !1;
                    if (r.matchParent(".cm-url")) return !0;
                    if (r.matchParent(".cm-link")) return !0;
                  }
                  return !1;
                })()
              ) {
                this.sourceMode && l === "tab" && e.button !== 1 && !Keymap.isModifier(e, "Shift") && (l = false);
                this.triggerClickableToken(s, l);
                e.preventDefault();
              }
            }
          }
        }
      }
    };
    t.prototype.onEditorLinkMouseover = function (event, targetEl) {
      if (Mc(event, targetEl)) {
        var n = this.editor.getClickableTokenAt(this.editor.posAtMouse(event)),
          i = (n == null ? undefined : n.type) === "footref";
        if ((n == null ? undefined : n.type) === "internal-link" || i) {
          this.app.workspace.trigger("hover-link", {
            event: event,
            source: "editor",
            hoverParent: this.owner,
            targetEl: targetEl,
            linktext: i ? "#[^".concat(n.text, "]") : n.text,
            sourcePath: this.path,
          });
        }
      }
    };
    t.prototype.onEditorDragStart = function (e) {
      var t = e.targetNode;
      if (t.instanceOf(HTMLElement) && t.draggable) {
        var n = this.cm.contentDOM;
        if (!n.contains(t)) return;
        if (t === n || t.parentNode === n) return;
        var i = this.editor.getClickableTokenAt(this.editor.posAtMouse(e));
        if (!i) return;
        if (i.type === "internal-link")
          this.app.dragManager.onDragStart(e, this.app.dragManager.dragLink(e, i.text, this.path, i.displayText));
        else if (i.type === "external-link" || i.type === "external-ref-link") {
          var r = this.getClickableTokenHref(i);
          if (r) {
            setDragTextAndURL(e.dataTransfer, r);
          }
        }
      }
    };
    t.prototype.onContextMenu = function (e) {
      return __awaiter(this, arguments, undefined, function (e, t) {
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
          f,
          m,
          g,
          v,
          w,
          k,
          C,
          E,
          S,
          M,
          x,
          T,
          D,
          A = this;
        undefined === t && (t = false);
        return __generator(this, function (P) {
          switch (P.label) {
            case 0:
              if (e.defaultPrevented) return [2];
              if (Platform.isMobile) {
                if (e.instanceOf(PointerEvent) && e.pointerType === "mouse" && -1 === e.button) return [2];
                if (!t && Platform.mobileSoftKeyboardVisible && (!e.isTrusted || e.instanceOf(TouchEvent))) return [2];
              }
              i = (n = this).app;
              r = n.editor;
              return (o = r.posAtMouse(e))
                ? ((a = new Menu().addSections([
                    "title",
                    "correction",
                    "spellcheck",
                    "open",
                    "selection-link",
                    "selection",
                    "insert",
                    "clipboard",
                    "info",
                    "action",
                    "view",
                    "",
                    "danger",
                  ])),
                  (s = true),
                  (l = true),
                  (c = true),
                  (h = Platform.isDesktopApp && e.win.electron),
                  (p = false),
                  h && e.isTrusted ? [4, onContextMenuCallback(e)] : [3, 2])
                : [2];
            case 1:
              if (!(d = P.sent()) || e.defaultPrevented) return [2];
              if (
                ((u = h.remote.webContents.fromId(d.webContentsId)),
                (T = d.editFlags || {}),
                (s = T.canCut),
                (l = T.canCopy),
                (c = T.canPaste),
                u && d.misspelledWord)
              ) {
                if ((f = d.dictionarySuggestions || []).length === 0)
                  a.addItem(function (e) {
                    return e
                      .setSection("correction")
                      .setDisabled(!0)
                      .setTitle(i18nProxy.editor.spellcheck.noSuggestion());
                  });
                else
                  for (
                    f.length > 6 && (f = f.slice(0, 6)),
                      m = function (e) {
                        a.addItem(function (t) {
                          return t
                            .setSection("correction")
                            .setTitle(e)
                            .setIcon("lucide-repeat")
                            .onClick(function () {
                              a.hide();
                              u.replaceMisspelling(e);
                            });
                        });
                      },
                      g = 0,
                      v = f;
                    g < v.length;
                    g++
                  ) {
                    w = v[g];
                    m(w);
                  }
                a.addItem(function (e) {
                  return e
                    .setSection("spellcheck")
                    .setTitle(i18nProxy.editor.spellcheck.addToDictionary())
                    .setIcon("lucide-folder-tree")
                    .onClick(function () {
                      u.session.addWordToSpellCheckerDictionary(d.misspelledWord);
                      u.replaceMisspelling(d.misspelledWord);
                    });
                });
              }
              return [3, 3];
            case 2:
              p = true;
              P.label = 3;
            case 3:
              if (
                ((k = r.getClickableTokenAt(o)),
                !t &&
                  (function (e) {
                    var t = e.targetNode;
                    return !(!t || !t.instanceOf(Element)) && t.hasClass("cm-line");
                  })(e) &&
                  ((p = true), (k = null)),
                k)
              ) {
                (k.type !== "internal-link" && k.type !== "external-link") ||
                  a.addItem(function (e) {
                    return e
                      .setSection("selection")
                      .setTitle(i18nProxy.editor.menu.editLink())
                      .setIcon("lucide-text-cursor-input")
                      .onClick(function () {
                        r.focus();
                        r.setSelection(k.start, k.end);
                      });
                  });
                k.type === "internal-link"
                  ? i.workspace.handleLinkContextMenu(a, k.text, this.path)
                  : k.type === "external-link" || k.type === "external-ref-link"
                    ? (C = this.getClickableTokenHref(k)) && i.workspace.handleExternalLinkContextMenu(a, C)
                    : k.type === "tag"
                      ? a.addItem(function (e) {
                          return e
                            .setSection("selection")
                            .setTitle(i18nProxy.editor.menu.editTag())
                            .setIcon("lucide-text-cursor-input")
                            .onClick(function () {
                              r.focus();
                              r.setSelection(Tb(k.start, 1), k.end);
                            });
                        })
                      : k.type === "footref" &&
                        this.file &&
                        ((E = i.metadataCache.getFileCache(this.file)),
                        (S =
                          (D = E == null ? undefined : E.footnotes) === null || undefined === D
                            ? undefined
                            : D.find(function (e) {
                                return e.id === k.text;
                              })) &&
                          a.addItem(function (e) {
                            return e
                              .setSection("action")
                              .setTitle(i18nProxy.editor.menu.labelDeleteFootrefAndNote())
                              .setIcon("lucide-file-signature")
                              .onClick(function () {
                                A.cm.dispatch({
                                  changes: [
                                    {
                                      from: r.posToOffset(k.start),
                                      to: r.posToOffset(k.end),
                                      insert: "",
                                    },
                                    {
                                      from: S.position.start.offset - 1,
                                      to: S.position.end.offset,
                                      insert: "",
                                    },
                                  ],
                                });
                              });
                          }));
              } else if (Platform.isMobile && !t) return [2];
              M = r.getSelection().trim();
              Platform.isDesktopApp &&
                Platform.isMacOS &&
                M.length > 0 &&
                a.addItem(function (e) {
                  return e
                    .setSection("title")
                    .setTitle(
                      i18nProxy.interface.menu.lookupSelection({
                        selection: hc(M, 25),
                      }),
                    )
                    .setIcon("lucide-library")
                    .onClick(function () {
                      return __awaiter(A, undefined, undefined, function () {
                        return __generator(this, function (e) {
                          h.remote.getCurrentWebContents().showDefinitionForSelection();
                          return [2];
                        });
                      });
                    });
                });
              Platform.isMobile ||
                (a.addItem(function (e) {
                  return e
                    .setSection("clipboard")
                    .setTitle(i18nProxy.interface.menu.cut())
                    .setIcon("lucide-scissors")
                    .setDisabled(!s)
                    .onClick(function () {
                      return __awaiter(A, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return h && u ? (u.cut(), [3, 3]) : [3, 1];
                            case 1:
                              e = r.getSelection();
                              r.replaceSelection("");
                              return [4, navigator.clipboard.writeText(e)];
                            case 2:
                              t.sent();
                              t.label = 3;
                            case 3:
                              return [2];
                          }
                        });
                      });
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("clipboard")
                    .setTitle(i18nProxy.interface.menu.copy())
                    .setIcon("lucide-copy")
                    .setDisabled(!l)
                    .onClick(function () {
                      return __awaiter(A, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return h && u ? (u.copy(), [3, 3]) : [3, 1];
                            case 1:
                              e = r.getSelection();
                              return [4, navigator.clipboard.writeText(e)];
                            case 2:
                              t.sent();
                              t.label = 3;
                            case 3:
                              return [2];
                          }
                        });
                      });
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("clipboard")
                    .setTitle(i18nProxy.interface.menu.paste())
                    .setIcon("lucide-clipboard-check")
                    .setDisabled(!c)
                    .onClick(function () {
                      return __awaiter(A, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return h && u ? (u.paste(), [3, 3]) : [3, 1];
                            case 1:
                              return [4, navigator.clipboard.readText()];
                            case 2:
                              e = t.sent();
                              r.replaceSelection(e);
                              t.label = 3;
                            case 3:
                              return [2];
                          }
                        });
                      });
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("clipboard")
                    .setTitle(i18nProxy.interface.menu.pasteAsPlainText())
                    .setIcon("lucide-clipboard-type")
                    .setDisabled(!c)
                    .onClick(function () {
                      return __awaiter(A, undefined, undefined, function () {
                        var e;
                        return __generator(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return h && u ? (u.pasteAndMatchStyle(), [3, 3]) : [3, 1];
                            case 1:
                              return [4, navigator.clipboard.readText()];
                            case 2:
                              e = t.sent();
                              r.replaceSelection(e);
                              t.label = 3;
                            case 3:
                              return [2];
                          }
                        });
                      });
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("clipboard")
                    .setTitle(i18nProxy.interface.menu.selectAll())
                    .setIcon("lucide-box-select")
                    .onClick(function () {
                      var line = r.lineCount() - 1;
                      r.setSelection(
                        {
                          line: 0,
                          ch: 0,
                        },
                        {
                          line: line,
                          ch: r.getLine(line).length,
                        },
                      );
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("selection-link")
                    .setTitle(i18nProxy.interface.formatting.insertLink())
                    .setIcon("lucide-link")
                    .setDisabled(/\n/.test(M))
                    .onClick(function () {
                      A.editor.triggerWikilink(!1);
                    });
                }),
                a.addItem(function (e) {
                  return e
                    .setSection("selection-link")
                    .setTitle(i18nProxy.interface.formatting.insertExternalLink())
                    .setIcon("lucide-external-link")
                    .setDisabled(/\n/.test(M))
                    .onClick(function () {
                      A.editor.insertMarkdownLink();
                    });
                }),
                (x = af(r.cm.state, r.cm.state.selection.main)),
                k || UO(a, r, x, "selection"),
                a.addSections([
                  "selection-heading",
                  "selection-list",
                  "selection-insert-basic",
                  "selection-insert-advanced",
                ]),
                a
                  .addItem(function (e) {
                    var t = e
                      .setSection("selection")
                      .setTitle(i18nProxy.interface.formatting.labelParagraph())
                      .setDisabled(r.inTableCell)
                      .setIcon("lucide-pilcrow")
                      .setSubmenu();
                    t.addItem(function (e) {
                      return e
                        .setSection("selection-list")
                        .setTitle(i18nProxy.interface.formatting.toggleBulletList())
                        .setIcon("lucide-list")
                        .onClick(function () {
                          return A.editor.toggleBulletList();
                        });
                    })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-list")
                          .setTitle(i18nProxy.interface.formatting.toggleNumberedList())
                          .setIcon("lucide-list-ordered")
                          .onClick(function () {
                            return A.editor.toggleNumberList();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-list")
                          .setTitle(i18nProxy.interface.formatting.toggleChecklist())
                          .setIcon("lucide-check-square")
                          .onClick(function () {
                            return A.editor.toggleCheckList();
                          });
                      });
                    for (
                      var n = function (level) {
                          t.addItem(function (t) {
                            return t
                              .setSection("selection-heading")
                              .setTitle(
                                i18nProxy.interface.formatting.setHeading({
                                  level: level,
                                }),
                              )
                              .setIcon("lucide-heading-" + level)
                              .setChecked(x.uniformHeading && x.headingLevel === level)
                              .onClick(function () {
                                return A.editor.setHeading(level);
                              });
                          });
                        },
                        i = 0,
                        o = [1, 2, 3, 4, 5, 6];
                      i < o.length;
                      i++
                    ) {
                      n(o[i]);
                    }
                    t.addItem(function (e) {
                      return e
                        .setSection("selection-heading")
                        .setTitle(i18nProxy.interface.formatting.noHeading())
                        .setIcon("lucide-text")
                        .setChecked(x.uniformHeading && x.headingLevel === 0)
                        .onClick(function () {
                          return A.editor.setHeading(0);
                        });
                    }).addItem(function (e) {
                      return e
                        .setSection("selection-block")
                        .setTitle(i18nProxy.interface.formatting.toggleQuote())
                        .setIcon("lucide-quote")
                        .onClick(function () {
                          return A.editor.toggleBlockquote();
                        });
                    });
                  })
                  .addItem(function (e) {
                    e.setSection("selection")
                      .setTitle(i18nProxy.interface.formatting.labelInsert())
                      .setDisabled(r.inTableCell)
                      .setIcon("lucide-list-plus")
                      .setSubmenu()
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-basic")
                          .setTitle(i18nProxy.interface.formatting.insertFootnote())
                          .setIcon("lucide-file-signature")
                          .onClick(function () {
                            return A.editor.insertFootnote();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-basic")
                          .setTitle(i18nProxy.interface.formatting.insertTable())
                          .setIcon("lucide-table")
                          .onClick(function () {
                            return A.editor.insertTable();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-basic")
                          .setTitle(i18nProxy.interface.formatting.insertCallout())
                          .setIcon("lucide-quote")
                          .onClick(function () {
                            return A.editor.insertCallout();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-basic")
                          .setTitle(i18nProxy.interface.formatting.insertHorizontalRule())
                          .setIcon("lucide-minus")
                          .onClick(function () {
                            return A.editor.insertHorizontalRule();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-advanced")
                          .setTitle(i18nProxy.interface.formatting.insertCodeBlock())
                          .setIcon("lucide-code")
                          .onClick(function () {
                            return A.editor.insertCodeblock();
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("selection-insert-advanced")
                          .setTitle(i18nProxy.interface.formatting.insertMathBlock())
                          .setIcon("lucide-sigma-square")
                          .onClick(function () {
                            return A.editor.insertMathBlock();
                          });
                      });
                  }));
              (!t && Platform.isMobile && k) || (i.workspace.trigger("editor-menu", a, r, this.owner), this.onMenu(a));
              a.showAtMouseEvent(e);
              p && e.preventDefault();
              return [2];
          }
        });
      });
    };
    t.prototype.onMenu = function (e) {};
    t.prototype.onResize = function () {
      var e = this.editor;
      if (this.containerEl.offsetParent) {
        this.editorSuggest.reposition();
        Platform.isMobile &&
          e.hasFocus() &&
          e.scrollIntoView({
            from: e.getCursor("anchor"),
            to: e.getCursor("head"),
          });
        e.refresh();
      }
    };
    Object.defineProperty(t.prototype, "activeCM", {
      get: function () {
        return this.tableCell ? this.tableCell.cm : this.cm;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.editTableCell = function (e, t) {
      var n = this.tableCell,
        i = this.cm;
      if (e === (n == null ? undefined : n.table) && t === (n == null ? undefined : n.cell)) return n;
      var r = createDiv("table-cell-wrapper"),
        o = (this.tableCell = this.addChild(new vK(this, r, e, t)));
      i.observer.ignore(function () {
        var e;
        t.lockDimensions();
        (e = t.contentEl) === null || undefined === e || e.hide();
        t.el.append(r);
      });
      o.cm.focus();
      n && this.destroyTableCell(n);
      e.setActiveDragHandles(t);
      e.containerEl.addClass("has-focus");
      return o;
    };
    t.prototype.destroyTableCell = function (e) {
      if (!e) {
        if (!this.tableCell) return;
        e = this.tableCell;
        this.tableCell = null;
      }
      var t = this.cm,
        n = e.cell,
        i = e.table,
        r = e.containerEl;
      i.unsetActiveDragHandles(n);
      i.containerEl.removeClass("has-focus");
      t.observer.ignore(function () {
        n.lockDimensions();
        r.detach();
        n.contentEl.show();
      });
      i.rerenderCell(n);
      this.removeChild(e);
    };
    return t;
  })(Component),
  dK = (function (e) {
    function t(t, n, i) {
      var r = e.call(this, t, n, i) || this;
      r.isScrolling = false;
      r.cssClasses = [];
      var o = r.cm;
      o.contentDOM.detach();
      var a = (r.sizerEl = o.scrollDOM.createDiv("cm-sizer")).createDiv("cm-contentContainer"),
        s = o.scrollDOM.find(".cm-gutters");
      s && a.appendChild(s);
      a.appendChild(o.contentDOM);
      o.scrollDOM.addEventListener("scroll", function () {
        return r.onScroll();
      });
      r.search = new CB(t, r.editor, r.editorEl, function (scope) {
        if (scope !== r.scope) {
          r.scope && t.keymap.popScope(r.scope);
          scope && t.keymap.pushScope(scope);
          r.scope = scope;
        }
      });
      r.editorEl.addEventListener("click", r.onViewClick.bind(r));
      return r;
    }
    __extends(t, e);
    t.prototype.onScroll = function () {
      this.editorSuggest.reposition();
      this.isScrolling ? (this.isScrolling = false) : this.handleScroll();
    };
    t.prototype.handleScroll = function () {
      this.owner.syncScroll();
    };
    t.prototype.show = function () {
      this.editorEl.show();
    };
    t.prototype.hide = function () {
      this.editorEl.hide();
      this.editorSuggest.close();
      this.search.hide();
    };
    t.prototype.focus = function () {
      var e = this.editor,
        t = e.getScrollInfo();
      e.focus();
      e.scrollTo(t.left, t.top);
      Platform.isMobileApp && keyboardPlugin && keyboardPlugin.show();
    };
    t.prototype.getScroll = function () {
      var e = this.cm,
        t = e.contentDOM.offsetTop,
        n = e.scrollDOM.scrollTop,
        i = e.lineBlockAtHeight(Math.max(n - t, 0)),
        r = e.state.doc.lineAt(i.from).number - 1,
        o = e.state.doc.lineAt(i.to).number - 1 - r + 1,
        a = n - i.top,
        s = i.height;
      r === 0 ? (s += t) : (a -= t);
      return r + (o * Math.max(0, a)) / Math.max(1, s);
    };
    t.prototype.applyScroll = function (e) {
      if (Number.isNumber(e) && !isNaN(e)) {
        var t = this.cm;
        e < 0 && (e = 0);
        e >= t.state.doc.lines && (e = t.state.doc.lines - 0.99);
        var n = Math.floor(e),
          i = e - n,
          r = t.state.doc.line(n + 1),
          o = function () {
            var e = t.lineBlockAt(r.from),
              o = t.state.doc.lineAt(e.from).number - 1,
              a = t.state.doc.lineAt(e.to).number - 1 - o + 1,
              s = n - o,
              l = e.top,
              c = e.height,
              u = t.contentDOM.offsetTop;
            o === 0 ? (c += u) : (l += u);
            return l + (s + i) * (c / a);
          };
        if (
          t.visibleRanges.some(function (e) {
            var t = e.from,
              n = e.to;
            return t <= r.from && r.from <= n;
          })
        ) {
          this.isScrolling = true;
          return void (t.scrollDOM.scrollTop = o());
        }
        this.isScrolling = true;
        t.dispatch({
          effects: EditorView.scrollIntoView(r.from, {
            y: "nearest",
          }),
        });
        t.requestMeasure({
          read: function () {},
          write: function () {
            t.requestMeasure({
              read: function () {
                return o();
              },
              write: function (scrollTop) {
                this.isScrolling = true;
                t.scrollDOM.scrollTop = scrollTop;
              },
            });
          },
        });
      }
    };
    t.prototype.showSearch = function (e) {
      undefined === e && (e = false);
      this.destroyTableCell();
      this.search.show(e);
    };
    t.prototype.buildLocalExtensions = function () {
      var t = this,
        n = e.prototype.buildLocalExtensions.call(this);
      n.push(oK);
      n.push(OR);
      n.push(
        EditorView.scrollHandler.of(function (e, n) {
          var i = t.tableCell;
          return (
            (i == null ? undefined : i.containerEl.isShown()) &&
            (i == null ? undefined : i.table.containsRange(n.anchor, n.head))
          );
        }),
      );
      n.push(
        keymap.of([
          {
            key: "Enter",
            run: function () {
              if (t.app.vault.getConfig("smartIndentList")) {
                var e = t.editor.cm.state,
                  n = e.selection.main.from;
                return sf(e, e.doc.lineAt(n))
                  ? (t.editor.newlineAndIndentOnly(), !0)
                  : (t.editor.newlineAndIndentContinueMarkdownList(), !0);
              }
              return !1;
            },
            shift: function () {
              return !!t.app.vault.getConfig("smartIndentList") && (t.editor.newlineAndIndentOnly(), !0);
            },
            preventDefault: true,
          },
          {
            key: "Tab",
            run: function () {
              t.editor.indentList();
              return !0;
            },
            shift: function () {
              t.editor.unindentList();
              return !0;
            },
          },
        ]),
      );
      return n;
    };
    t.prototype.onConfigChanged = function (t) {
      e.prototype.onConfigChanged.call(this, t);
      (t !== "showLineNumber" &&
        t !== "showIndentGuide" &&
        t !== "foldHeading" &&
        t !== "foldIndent" &&
        t !== "propertiesInDocument") ||
        this.updateOptions();
    };
    t.prototype.getDynamicExtensions = function () {
      var t = e.prototype.getDynamicExtensions.call(this),
        n = this.app.vault;
      n.getConfig("showLineNumber") &&
        (t.push(
          gutters({
            fixed: !1,
          }),
        ),
        t.push(XI),
        t.push(lineNumbers()));
      n.getConfig("smartIndentList") && t.push(AR(this));
      n.getConfig("showIndentGuide") && t.push(OO);
      var i = n.getConfig("foldHeading"),
        r = n.getConfig("foldIndent"),
        o = i || r;
      this.editorEl.toggleClass("is-folding", o);
      o && (t.push(codeFolding()), t.push(AO), i && t.push(zG), r && t.push(RG), t.push(qG));
      var a = n.getConfig("autoPairBrackets"),
        s = n.getConfig("autoPairMarkdown");
      (a || s) && t.push([fm]);
      this.editorEl.toggleClass("show-properties", n.getConfig("propertiesInDocument") === "visible");
      return t;
    };
    t.prototype.setCssClass = function (cssClasses) {
      var t = this.editorEl;
      if ((t.removeClasses(this.cssClasses), cssClasses && cssClasses.length > 0)) {
        var n = t.classList;
        cssClasses = cssClasses.filter(function (e) {
          return !n.contains(e);
        });
        t.addClasses(cssClasses);
      } else cssClasses = [];
      this.cssClasses = cssClasses;
    };
    t.prototype.onCssChange = function () {
      this.cm.dispatch({
        effects: IR.clearCache.of(),
      });
      this.editor.refresh();
    };
    t.prototype.onViewClick = function (e) {
      var t = this;
      if (!e.defaultPrevented) {
        this.editorSuggest.close();
        setTimeout(function () {
          return t.editor.removeHighlights();
        }, 0);
      }
    };
    t.prototype.onUpdate = function (t, n) {
      e.prototype.onUpdate.call(this, t, n);
      t.docChanged && this.app.workspace.trigger("editor-change", this.editor, this.owner);
      (t.selectionSet || n || t.focusChanged) &&
        this.app.workspace.trigger("editor-selection-change", this.editor, this.owner);
    };
    return t;
  })(pK);
function fK(e, t, n) {
  if (t !== n) {
    t.contains("insert") ? Vim.enterInsertMode(e) : Vim.exitInsertMode(e, !0);
  }
}
function mK(e) {
  var t, n;
  return (n = (t = e.state.vim) === null || undefined === t ? undefined : t.mode) !== null && undefined !== n ? n : "";
}
var gK = new Compartment(),
  vK = (function (e) {
    function t(t, n, table, cell) {
      var o = e.call(this, t.app, n, t.owner) || this;
      o.editorEl.removeClass("markdown-source-view");
      o.sourceMode = false;
      o.table = table;
      o.cell = cell;
      o.set(Dm(cell.text).result);
      var a = t.cm.plugin(uB),
        s = o.cm.plugin(uB);
      a &&
        s &&
        o.containerEl.win.setTimeout(function () {
          fK(s.cm, mK(a.cm), mK(s.cm));
          s.cm.on("vim-mode-change", function () {
            fK(a.cm, mK(s.cm), mK(a.cm));
          });
        }, 0);
      Platform.isIosApp &&
        n.createSpan({
          attr: {
            contenteditable: "true",
          },
        });
      n.dataset.ignoreSwipe = "true";
      return o;
    }
    __extends(t, e);
    t.prototype.onunload = function () {
      e.prototype.onunload.call(this);
      this.destroy();
    };
    t.prototype.onUpdate = function (t, n) {
      e.prototype.onUpdate.call(this, t, n);
      for (var i = t.transactions, r = this.table, o = 0, a = i; o < a.length; o++) {
        var s = a[o];
        if (!((!s.docChanged && !s.selection) || s.annotation(ER) || s.isUserEvent("set"))) {
          r.dispatchUpdate(this, s);
        }
      }
    };
    t.prototype.buildLocalExtensions = function () {
      var t = this,
        n = e.prototype.buildLocalExtensions.call(this);
      n.push(aK);
      var getNextTablePos = function (e, n, i) {
          var a = e.state,
            c = a.doc.lineAt(n.head);
          if (i === "up" || i === "down") {
            var u = c.number + (i === "down" ? 1 : -1);
            if (u > 1 && u < a.doc.lines) return !1;
          } else {
            var h = n.head + (i === "end" ? 1 : -1);
            if (h >= 0 && h < c.length) return !1;
          }
          t.table.trimCell(t.cell);
          t.containerEl.win.setTimeout(function () {
            i === "up" ? r() : i === "down" ? o() : i === "start" ? s(e) : i === "end" && l(e);
          }, 10);
          return !0;
        },
        r = function () {
          var e = t,
            n = e.table,
            i = e.cell,
            r = n.getCellAbove(i);
          r ? n.placeCursorInCell(r, "last-line") : n.placeCursorAround("before");
        },
        o = function () {
          var e = t,
            n = e.table,
            i = e.cell,
            r = n.getCellBelow(i);
          r ? n.placeCursorInCell(r, "start") : n.placeCursorAround("after");
        },
        a = function (e, t, n) {
          return (e.textDirection === Direction.RTL) == (detectTextDirection(t.text) === "rtl")
            ? n
            : n === "end"
              ? "start"
              : "end";
        },
        s = function (e) {
          var n = t,
            i = n.table,
            r = n.cell,
            o = i.getNextCell(r, "start");
          o ? i.placeCursorInCell(o, a(e, o, "end")) : i.placeCursorAround("before");
        },
        l = function (e) {
          var n = t,
            i = n.table,
            r = n.cell,
            o = i.getNextCell(r, "end");
          o ? i.placeCursorInCell(o, a(e, o, "start")) : i.placeCursorAround("after");
        },
        c = function (e, n) {
          var i = e.state,
            a = i.selection,
            c = i.doc;
          if (a.ranges.length > 1) return !1;
          var u = t,
            h = u.table,
            p = u.cell;
          if (h.selectionHead) {
            var d = h.getSelectionBounds(),
              f = d.minRow,
              m = d.minCol,
              g = d.maxRow,
              v = d.maxCol;
            switch ((h.deselectCells(), h.trimCell(p), n)) {
              case "up":
              case "start":
                h.placeCursorInCell(h.getCellAt(f, m), "start");
                return !0;
              case "down":
              case "end":
                h.placeCursorInCell(h.getCellAt(g, v), "end");
                return !0;
            }
          }
          var y = a.main;
          if (y.from !== y.to) return !1;
          var b = e.textDirection !== e.textDirectionAt(y.head);
          switch ((h.trimCell(p), n)) {
            case "up":
              var w = e.moveVertically(y, !1);
              return !(e.coordsAtPos(y.from).top !== e.coordsAtPos(w.from).top) && (r(), !0);
            case "down":
              w = e.moveVertically(y, !0);
              return !(e.coordsAtPos(y.from).top !== e.coordsAtPos(w.from).top) && (o(), !0);
            case "start":
              return y.from === 0 && (b ? l(e) : s(e), !0);
            case "end":
              return y.to === c.length && (b ? s(e) : l(e), !0);
          }
        },
        u = function (e, n) {
          var i = e.state,
            r = i.selection,
            o = i.doc;
          if (r.ranges.length > 1) return !1;
          var a,
            s = t,
            l = s.table,
            c = s.cell,
            u = l.selectionHead,
            h = l.selectionAnchor,
            p = u || c,
            d = p.row,
            f = p.col,
            m = r.main;
          switch (n) {
            case "up":
              if (!u) if (e.moveToLineBoundary(m, !1, !0).from !== 0) return !1;
              a = l.getCellAt(d - 1, f);
              break;
            case "down":
              if (!u) if (e.moveToLineBoundary(m, !0, !0).from !== o.length) return !1;
              a = l.getCellAt(d + 1, f);
              break;
            case "start":
              if (!u && m.head !== 0) return !1;
              a = l.getCellAt(d, f - 1);
              break;
            case "end":
              if (!u && m.head !== o.length) return !1;
              a = l.getCellAt(d, f + 1);
          }
          a && (l.selectCells(h || c, a), a.scrollIntoView());
          return !0;
        },
        h = function () {
          redo(t.table.editor.cm);
          return !0;
        },
        p = function (e) {
          var n = t.table;
          return !!n.selectionHead && (n.deleteSelection(e), !0);
        };
      if (this.app.isVimEnabled()) {
        n.push(
          Prec.low(
            ViewPlugin.define(function (e) {
              e.getNextTablePos = getNextTablePos;
              return {
                destroy: function () {
                  delete e.getNextTablePos;
                },
              };
            }),
          ),
        );
      }
      var d = function (e) {
          return function () {
            var n = t.table.editor.cm;
            n.focus();
            return e(n);
          };
        },
        f = function (e, t) {
          return e.textDirectionAt(e.state.selection.main.head) === Direction.RTL
            ? t === "left"
              ? "end"
              : "start"
            : t === "left"
              ? "start"
              : "end";
        };
      n.push(
        Prec.high(
          keymap.of([
            {
              key: "ArrowUp",
              run: function (e) {
                return c(e, "up");
              },
              shift: function (e) {
                return u(e, "up");
              },
            },
            {
              key: "ArrowDown",
              run: function (e) {
                return c(e, "down");
              },
              shift: function (e) {
                return u(e, "down");
              },
            },
            {
              key: "ArrowRight",
              run: function (e) {
                return c(e, f(e, "right"));
              },
              shift: function (e) {
                return u(e, f(e, "right"));
              },
            },
            {
              key: "Mod-ArrowRight",
              run: function (e) {
                return c(e, f(e, "right"));
              },
            },
            {
              key: "ArrowLeft",
              run: function (e) {
                return c(e, f(e, "left"));
              },
              shift: function (e) {
                return u(e, f(e, "left"));
              },
            },
            {
              key: "Mod-ArrowLeft",
              run: function (e) {
                return c(e, f(e, "left"));
              },
            },
            {
              key: "Mod-z",
              run: function () {
                undo(t.table.editor.cm);
                return !0;
              },
              preventDefault: true,
            },
            {
              key: "Mod-y",
              mac: "Mod-Shift-z",
              run: h,
              preventDefault: true,
            },
            {
              linux: "Ctrl-Shift-z",
              run: h,
              preventDefault: !0,
            },
            {
              key: "Mod-Shift-z",
              run: h,
              preventDefault: !0,
            },
            {
              key: "Delete",
              run: function () {
                return p(1);
              },
            },
            {
              key: "Backspace",
              run: function () {
                return p(-1);
              },
            },
            {
              mac: "Cmd-ArrowUp",
              run: d(goStart),
              shift: d(selectDocStart),
            },
            {
              mac: "Ctrl-ArrowUp",
              run: d(cursorPageUp),
              shift: d(selectPageUp),
            },
            {
              mac: "Cmd-ArrowDown",
              run: d(cursorDocEnd),
              shift: d(selectDocEnd),
            },
            {
              mac: "Ctrl-ArrowDown",
              run: d(cursorPageDown),
              shift: d(selectPageDown),
            },
            {
              key: "PageUp",
              run: d(cursorPageUp),
              shift: d(selectPageUp),
            },
            {
              key: "PageDown",
              run: d(cursorPageDown),
              shift: d(selectPageDown),
            },
            {
              key: "Mod-Home",
              run: d(goStart),
              shift: d(selectDocStart),
            },
            {
              key: "Mod-End",
              run: d(cursorDocEnd),
              shift: d(selectDocEnd),
            },
          ]),
        ),
      );
      var m = function (e) {
        t.table.setCellFocus(e.row, e.col, function (e) {
          return EditorSelection.create([EditorSelection.range(0, e.state.doc.length)]);
        });
      };
      n.push(
        keymap.of([
          {
            key: "Tab",
            run: function () {
              var e = t,
                n = e.table,
                i = e.cell,
                r = n.getNextCell(i, "end");
              n.trimCell(i);
              r ? m(r) : n.insertRow(n.rows.length, 0);
              return !0;
            },
            shift: function () {
              var e = t,
                n = e.table,
                i = e.cell,
                r = n.getNextCell(i, "start");
              n.trimCell(i);
              r ? m(r) : n.insertRow(0, n.alignments.length - 1);
              return !0;
            },
          },
          {
            key: "Enter",
            run: function () {
              var e = t,
                n = e.table,
                i = e.cell;
              if ((n.trimCell(i), i.row === n.rows.length - 1)) n.insertRow(i.row + 1, i.col);
              else {
                var r = n.getCellBelow(i);
                if (r) {
                  m(r);
                }
              }
              return !0;
            },
          },
        ]),
      );
      n.push(
        Prec.high(
          EditorView.domEventHandlers({
            copy: function (e) {
              return t.table.copySelection(e);
            },
            cut: function (e) {
              return t.table.copySelection(e, !0);
            },
            paste: function (e) {
              return t.table.pasteSelection(e);
            },
            blur: function (e) {
              var n = t,
                i = n.app,
                r = n.containerEl,
                o = n.editorSuggest,
                a = n.table,
                s = n.cell,
                l = a.editor;
              a.trimCell(s);
              Platform.isMobile && i.mobileToolbar.update();
              o.close();
              r.win.setTimeout(function () {
                if (!l.activeCM.hasFocus) {
                  l.cm.contentDOM.dispatchEvent(e);
                }
              });
              return !0;
            },
          }),
        ),
      );
      n.push(gK.of(EditorState.readOnly.of(!1)));
      return n;
    };
    t.prototype.setReadonly = function (e) {
      this.cm.dispatch({
        effects: gK.reconfigure(EditorState.readOnly.of(e)),
      });
    };
    t.prototype.onContextMenu = function (t, n) {
      var i = this.cell;
      if (!this.table.selectedCells.contains(i)) {
        e.prototype.onContextMenu.call(this, t, n);
      }
    };
    t.prototype.onMenu = function (t) {
      e.prototype.onMenu.call(this, t);
      this.table.onContextMenu(this.cell, t);
    };
    return t;
  })(pK),
  yK = ["--zoom-factor", "--keyboard-height"],
  bK = ["is-frameless", "is-focused", "is-fullscreen"],
  wK = [
    "fullscreenchange",
    "click",
    "contextmenu",
    "auxclick",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "mousemove",
    "copy",
    "paste",
    "cut",
    "drag",
    "dragstart",
    "dragover",
    "dragend",
    "dragenter",
    "dragleave",
    "drop",
    "open-url",
  ];
function kK(e) {
  var t = new e.constructor(e.type, e),
    n = t.preventDefault;
  t.preventDefault = function () {
    n.call(t);
    e.preventDefault();
  };
  var i = t.stopPropagation;
  t.stopPropagation = function () {
    i.call(t);
    e.stopPropagation();
  };
  var r = t.stopImmediatePropagation;
  t.stopImmediatePropagation = function () {
    r.call(t);
    e.stopImmediatePropagation();
  };
  Object.defineProperty(t, "target", {
    get: function () {
      return e.target;
    },
  });
  Object.defineProperty(t, "currentTarget", {
    get: function () {
      return e.currentTarget;
    },
  });
  return t;
}
function CK(e) {
  for (var t = 0, n = wK; t < n.length; t++) {
    var i = n[t];
    e.addEventListener(
      i,
      function (e) {
        return window.dispatchEvent(kK(e));
      },
      {
        capture: !0,
      },
    );
  }
}
function EK(e, t) {
  if (undefined === t) {
    t = [];
  }
  var n = new WeakMap(),
    i = [],
    r = function (e) {
      var t = n.get(e);
      if (!t && ((t = e.cloneNode(!0)), n.set(e, t), e instanceof HTMLStyleElement && e.id === "MJX-CHTML-styles")) {
        for (var i = [], r = e.sheet.cssRules, o = 0; o < r.length; o++) i.push(r[o].cssText);
        t.textContent = i.join("\n");
      }
      return t;
    },
    o = function () {
      for (var n = __spreadArray([], t, !0), o = 0, a = Array.from(document.head.childNodes); o < a.length; o++) {
        if ((c = a[o]) instanceof HTMLStyleElement || (c instanceof HTMLLinkElement && c.type === "text/css")) {
          if (c instanceof HTMLStyleElement && c.textContent.contains("ͼ1")) continue;
          n.push(r(c));
        }
      }
      for (var s = 0, l = i; s < l.length; s++) {
        var c = l[s];
        if (!n.contains(c)) {
          c.detach();
        }
      }
      for (var u = e.document.head, h = u.lastChild, p = n.length - 1; p >= 0; p--) {
        h !== (c = n[p]) ? u.insertBefore(c, h ? h.nextSibling : null) : (h = h.previousSibling);
      }
      i = n;
    },
    a = function () {
      for (
        var t = document.body,
          n = e.document.body,
          i = t.className.split(" "),
          r = new Set(n.className.split(" ")),
          o = 0,
          a = bK;
        o < a.length;
        o++
      ) {
        var s = a[o];
        r.has(s) ? i.push(s) : i.remove(s);
      }
      var l = e.parent;
      l === e
        ? i.push("is-popout-window")
        : l && (l.document.body.classList.contains("is-focused") ? i.push("is-focused") : i.remove("is-focused"));
      n.className = i.join(" ");
      for (var c = 0; c < t.style.length; c++) {
        var u = t.style[c];
        if (u.startsWith("--") && !yK.contains(u)) {
          var h = t.style.getPropertyValue(u);
          n.style.setProperty(u, h);
        }
      }
      e.document.documentElement.style.setProperty("font-size", getComputedStyle(document.body).fontSize);
    },
    s = new MutationObserver(function (e) {
      for (
        var t = false,
          i = false,
          r = function (e) {
            if (e instanceof HTMLStyleElement || e instanceof HTMLLinkElement) {
              n.delete(e);
              t = true;
            }
          },
          s = 0,
          l = e;
        s < l.length;
        s++
      ) {
        var c = l[s];
        if (c.target !== document.body) {
          r(c.target);
          for (var u = 0, h = Array.from(c.addedNodes); u < h.length; u++) {
            r(h[u]);
          }
        } else i = true;
      }
      t && o();
      i && a();
    });
  s.observe(document.head, {
    attributes: true,
    attributeFilter: ["data-change"],
    subtree: true,
    childList: true,
    characterData: true,
  });
  s.observe(document.body, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  e.parent !== e && e.parent.addEventListener("focuschange", a);
  o();
  a();
  return function () {
    s.disconnect();
    e.parent && e.parent.removeEventListener("focuschange", a);
  };
}
function SK(e) {
  var t = e.document,
    n = function () {
      return t.body.toggleClass("is-focused", t.hasFocus());
    };
  Platform.isDesktopApp && e.electronWindow
    ? ((n = function () {
        return t.body.toggleClass("is-focused", e.electronWindow.isFocused());
      }),
      e.addEventListener("focuschange", n))
    : (e.addEventListener("focus", n), e.addEventListener("blur", n));
  n();
}
function MK(e) {
  var t = window.globalEnhance.toString();
  e.eval.call(e, "(".concat(t, ")()\n//# sourceURL=enhance.js"));
}
var innerHTML =
    '<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect></svg>',
  TK = (function () {
    function e(eWin, win) {
      this.requestUpdateStatus = debounce(this.updateStatus.bind(this), 50, !0);
      this.eWin = eWin;
      this.win = win;
      var n = (this.isMac = window.process.platform === "darwin"),
        i = win.document,
        r = i.body;
      r.addClass("is-frameless");
      var o = (this.titleBarEl = i.createElement("div"));
      o.className = "titlebar";
      r.insertBefore(o, r.firstChild);
      var a = (this.titleBarInnerEl = o.createDiv("titlebar-inner"));
      this.titleBarTextEl = a.createDiv({
        cls: "titlebar-text",
        text: "Obsidian",
      });
      win.addEventListener("resize", this.requestUpdateStatus.bind(this));
      var s = i.head.find("title");
      s || (s = i.head.createEl("title"));
      new MutationObserver(this.updateTitle.bind(this)).observe(s, {
        subtree: true,
        characterData: true,
        childList: true,
      });
      this.leftButtonContainerEl = a.createDiv("titlebar-button-container mod-left");
      var l = a.createDiv("titlebar-button-container mod-right");
      if ((this.updateStatus(), this.updateTitle(), !n)) {
        if (eWin.minimizable) {
          var c = l.createDiv({
            cls: "titlebar-button mod-minimize",
            onclick: function () {
              return eWin.minimize();
            },
          });
          c.innerHTML =
            '<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg>';
          prepare.then(function () {
            setTooltip(c, i18nProxy.interface.window.minimize());
          });
        }
        if (eWin.maximizable) {
          var u = l.createDiv({
            cls: "titlebar-button mod-maximize",
            onclick: function () {
              eWin.isMaximized() ? eWin.unmaximize() : eWin.maximize();
              h();
            },
          });
          u.innerHTML = innerHTML;
          var h = function () {
            if (!win.closed) {
              eWin.isMaximized()
                ? ((u.innerHTML =
                    '<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5H8.5V10.5H1.5V3.5Z" stroke="currentColor"/> <path d="M4 2H10V8H9V9H11V1H3V3H4V2Z" fill="currentColor"/></svg>'),
                  setTooltip(u, i18nProxy.interface.window.restoreDown()))
                : ((u.innerHTML = innerHTML), setTooltip(u, i18nProxy.interface.window.maximize()));
            }
          };
          prepare.then(function () {
            h();
          });
          win.addEventListener("resize", h);
        }
        if (eWin.closable) {
          var p = l.createDiv({
            cls: "titlebar-button mod-close",
            onclick: function () {
              return eWin.close();
            },
          });
          p.innerHTML =
            '<svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"> <path fill="currentColor" fill-rule="evenodd" d="M10.052 10.968 1.03 1.93l.849-.848 9.023 9.037-.849.848Z"/><path fill="currentColor" fill-rule="evenodd" d="M1.023 10.112 10.06 1.09l.848.85-9.037 9.023-.848-.85Z"/></svg>';
          prepare.then(function () {
            setTooltip(p, i18nProxy.interface.window.closeWindow());
          });
        }
      }
      DK(a);
    }
    e.prototype.updateTitle = function () {
      this.titleBarTextEl.setText(this.win.document.title);
    };
    e.prototype.updateStatus = function () {
      var e = this.win,
        t = this.eWin;
      if (!e.closed) {
        var n = t.webContents.getZoomFactor(),
          i = e.document.body;
        if (
          (i.toggleClass("is-fullscreen", t.isFullScreen()),
          i.toggleClass("is-maximized", t.isMaximized()),
          i.style.setProperty("--zoom-factor", String(n)),
          this.isMac && e.titlebarStyle === "hidden")
        ) {
          var r = 40,
            o = getComputedStyle(i).getPropertyValue("--header-height");
          o && (r = parseFloat(o));
          (isNaN(r) || r === 0) && (r = 40);
          var a = Math.floor((r * n) / 2 - 8);
          a < -5 && (a = 0);
          (t.setWindowButtonPosition || t.setTrafficLightPosition)({
            x: a + 2,
            y: a,
          });
        }
      }
    };
    return e;
  })();
function DK(e) {
  if (Platform.isMacOS && Platform.isDesktopApp) {
    e.addEventListener("dblclick", function (t) {
      if (t.button === 0) {
        var n = t.target;
        if (
          !n.instanceOf(HTMLElement) ||
          !(
            n.closest(".clickable-icon") ||
            n.closest(".workspace-tab-header-inner-close-button") ||
            (n.closest(".workspace-tab-header") && n.closest(".workspace-split.mod-sidedock"))
          )
        ) {
          var i = e.win.electronWindow;
          i.isMaximizable &&
            callbackWithElectron(function (e) {
              var t = e.remote.systemPreferences.getUserDefault("AppleActionOnDoubleClick", "string");
              t === "Minimize"
                ? i.minimize()
                : (t !== "Maximize" && t !== "") || (i.isMaximized() ? i.unmaximize() : i.maximize());
            });
        }
      }
    });
  }
}
function AK(e) {
  for (var t = e; t !== t.parent && t.parent !== null; ) t = t.parent;
  var n = t.require;
  if (n) {
    var electron = n("electron");
    if (electron) {
      if (((e.electron = electron), !electron.remote))
        try {
          electron.remote = n("@electron/remote");
        } catch (e) {
          console.error(e);
        }
      e.electronWindow = electron.remote.getCurrentWindow();
      var r = e.open;
      e.open = function (e, t, n) {
        return typeof e == "string" && e.indexOf("file:") === 0
          ? (electron.ipcRenderer.send("open-url", e), null)
          : r.apply(this, arguments);
      };
      e.parent === e &&
        (function (e) {
          var titlebarStyle = e.electron.ipcRenderer.sendSync("frame") || "hidden";
          e.titlebarStyle = titlebarStyle;
          titlebarStyle !== "native" &&
            ((e.frameDom = new TK(e.electronWindow, e)),
            titlebarStyle === "hidden" && e.document.body.addClass("is-hidden-frameless"));
        })(e);
    }
  }
}
var PK = (function (e) {
    function t(owner) {
      var n = e.call(this, owner.app, owner.editorEl, owner) || this;
      if (
        ((n.iframeEl = null),
        (n.cleanup = null),
        (n.requestSaveFolds = debounce(function () {
          return n.owner.onMarkdownFold();
        }, 500)),
        (n.owner = owner),
        owner.useIframe)
      ) {
        n.editorEl.detach();
        n.editorEl.addClass("mod-inside-iframe");
        var i = (n.iframeEl = n.owner.editorEl.createEl("iframe", "embed-iframe is-controlled"));
        i.setAttr("sandbox", "allow-forms allow-presentation allow-same-origin allow-scripts allow-modals");
        i.contentDocument && n.onIframeLoad();
        i.onload = n.onIframeLoad.bind(n);
      }
      owner instanceof yY && n.sizerEl.prepend(owner.inlineTitleEl);
      return n;
    }
    __extends(t, e);
    t.prototype.cleanupIframe = function () {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = null;
      }
    };
    t.prototype.onunload = function () {
      e.prototype.onunload.call(this);
      this.cleanupIframe();
    };
    t.prototype.onIframeLoad = function () {
      var e = this;
      this.cleanupIframe();
      var t = this.iframeEl,
        n = t.contentDocument,
        i = t.contentWindow,
        r = createEl("base", {
          href: location.href,
        });
      n.head.appendChild(r);
      CK(i);
      i.addEventListener(
        "focus",
        function (e) {
          t.win.dispatchEvent(kK(e));
          t.dispatchEvent(
            new FocusEvent("focusin", {
              bubbles: !0,
            }),
          );
        },
        {
          capture: !0,
        },
      );
      i.addEventListener(
        "blur",
        function (e) {
          return t.win.dispatchEvent(kK(e));
        },
        {
          capture: !0,
        },
      );
      this.cleanup = EK(i, [r]);
      i.app = this.app;
      MK(i);
      Platform.isDesktopApp && AK(i);
      initTooltipListeners(n);
      n.body.setCssProps({
        "--safe-area-inset-top": "0",
        "--safe-area-inset-bottom": "0",
        "--safe-area-inset-left": "0",
        "--safe-area-inset-right": "0",
      });
      activeWindow.setTimeout(function () {
        return e.reparent(n.body);
      });
    };
    t.prototype.onUpdate = function (t, n) {
      if ((e.prototype.onUpdate.call(this, t, n), n)) {
        var i = t.state.doc;
        this.owner.save(i.toString());
        this.requestSaveFolds();
      }
      var r = t.transactions;
      if (Sm(r, foldEffect) || Sm(r, unfoldEffect)) {
        this.requestSaveFolds();
      }
    };
    t.prototype.getDynamicExtensions = function () {
      var t = this,
        n = e.prototype.getDynamicExtensions.call(this);
      if (!this.sourceMode) {
        var i = this.propertiesExtension;
        i || (i = this.propertiesExtension = kb(this));
        n.push(i);
      }
      n.push(
        keymap.of([
          {
            key: "Escape",
            run: function (e) {
              var n,
                i = (n = e.cm) === null || undefined === n ? undefined : n.vim;
              return (!i || !i.insertMode) && (t.owner.showPreview(!0), !0);
            },
          },
        ]),
      );
      return n;
    };
    return t;
  })(dK),
  LK = (function (e) {
    function t(owner, n) {
      if (undefined === n) {
        n = true;
      }
      var i = e.call(this, owner.app, owner.previewEl, n) || this;
      i.search = null;
      i.owner = owner;
      i.onFoldChange = debounce(function () {
        return i.owner.onMarkdownFold();
      }, 500);
      return i;
    }
    __extends(t, e);
    Object.defineProperty(t.prototype, "file", {
      get: function () {
        return this.owner.file;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.set = function (e) {
      var t = this.app,
        n = this.renderer;
      n.set(e);
      n.previewEl.toggleClass("rtl", t.vault.getConfig("rightToLeft"));
      n.previewEl.toggleClass("show-indentation-guide", t.vault.getConfig("showIndentGuide"));
      n.applyFoldInfo(this.owner.getFoldInfo());
      var i = t.vault.getConfig("foldHeading"),
        r = t.vault.getConfig("foldIndent");
      n.previewEl.toggleClass("allow-fold-headings", i);
      n.previewEl.toggleClass("allow-fold-lists", r);
      i || n.unfoldAllHeadings();
      r || n.unfoldAllLists();
    };
    t.prototype.edit = function (e) {
      this.renderer.set(e);
      this.owner.save(e, !0);
    };
    t.prototype.onunload = function () {
      e.prototype.onunload.call(this);
      this.search && this.owner.applyScope(null);
    };
    t.prototype.showSearch = function () {
      var e = this;
      if (!this.search) {
        var t = (this.search = new dN(this.app, this.renderer, this.containerEl, function () {
          e.search = null;
          e.owner.applyScope(null);
        }));
        this.owner.applyScope(t.scope);
      }
    };
    t.prototype.onScroll = function () {
      this.owner.syncScroll();
    };
    return t;
  })(MarkdownRenderer),
  IK = (function (e) {
    function t(app, containerEl, filei0, state) {
      var o = e.call(this) || this;
      o.file = null;
      o.hoverPopover = null;
      o.editable = false;
      o.text = "";
      o.dirty = false;
      o.useIframe = false;
      o.requestSaveFolds = debounce(function () {
        return o.onMarkdownFold();
      }, 500);
      o.requestSave = debounce(function () {
        return o.save(o.text, !0);
      }, 2e3);
      o.app = app;
      o.containerEl = containerEl;
      o.file = filei0;
      o.state = state;
      o.previewEl = o.containerEl.createDiv("markdown-embed-content");
      o.editorEl = o.containerEl.createDiv("markdown-embed-content");
      preserveScrollPositionOnInsert(o.previewEl);
      preserveScrollPositionOnInsert(o.editorEl);
      o.previewMode = o.addChild(new LK(o));
      return o;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var t;
      e.prototype.onload.call(this);
      ((t = this.state) === null || undefined === t ? undefined : t.mode) === "source"
        ? this.showEditor()
        : this.showPreview();
    };
    t.prototype.save = function (texte0, t) {
      undefined === t && (t = false);
      this.text = texte0;
      this.dirty = !t;
      t || this.requestSave();
      this.set(texte0);
    };
    t.prototype.set = function (texte0, t) {
      this.text = texte0;
      this.previewMode.set(texte0);
      this.editMode && this.editMode.set(texte0, t);
    };
    t.prototype.showSearch = function (e) {
      this.editMode ? this.editMode.showSearch(e) : this.previewMode.showSearch();
    };
    t.prototype.destroyEditor = function (e) {
      if (undefined === e) {
        e = false;
      }
      var t = this.editMode;
      t &&
        (e && (this.requestSave.cancel(), this.save(t.cm.state.doc.toString(), !0)),
        t.destroy(),
        this.removeChild(t),
        (this.editMode = null));
      this.editorEl.empty();
      this.applyScope(null);
      this.app.workspace.unsetActiveEditor(this);
    };
    t.prototype.onunload = function () {
      this.destroyEditor();
      this.containerEl.empty();
      this.app.workspace.unsetActiveEditor(this);
    };
    t.prototype.showPreview = function (e) {
      if (undefined === e) {
        e = false;
      }
      var t = null;
      this.editMode && (t = this.editMode.getScroll());
      this.editorEl.hide();
      this.previewEl.show();
      this.destroyEditor(e);
      var n = this.getFoldInfo();
      if (t !== null) {
        this.previewMode.renderer.applyScrollDelayed(t);
        this.previewMode.renderer.applyFoldInfo(n);
      }
    };
    t.prototype.showEditor = function (e) {
      if (this.editable) {
        var t = this.previewMode.renderer.getScroll();
        this.previewEl.hide();
        this.editorEl.show();
        var n = this.editMode;
        n || (n = this.editMode = this.addChild(new PK(this)));
        n.set(this.text, !0);
        var i = this.getFoldInfo();
        executeWhenShown(n.editorEl, function () {
          if ((n.applyFoldInfo(i), n.applyScroll(t), n.focus(), e)) {
            if (n.iframeEl) {
              var r = getFrameTransform(n.iframeEl.contentWindow),
                o = r.x,
                a = r.y,
                s = r.scale;
              e.x = (e.x - o) / s;
              e.y = (e.y - a) / s;
            }
            n.editorEl.win.setTimeout(function () {
              n.cm.dispatch({
                userEvent: "select.pointer",
                selection: EditorSelection.single(n.cm.posAtCoords(e, !1)),
              });
            });
          }
        });
      }
    };
    Object.defineProperty(t.prototype, "path", {
      get: function () {
        var e;
        return ((e = this.file) === null || undefined === e ? undefined : e.path) || "";
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(t.prototype, "editor", {
      get: function () {
        var e;
        return (e = this.editMode) === null || undefined === e ? undefined : e.editor;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.getMode = function () {
      return this.editMode ? "source" : "preview";
    };
    t.prototype.toggleMode = function () {
      this.getMode() === "preview" ? this.showEditor() : this.showPreview();
    };
    t.prototype.syncScroll = function () {
      this.app.workspace.trigger("markdown-scroll", this);
    };
    Object.defineProperty(t.prototype, "scroll", {
      get: function () {
        return this.getMode() === "preview" ? this.previewMode.renderer.getScroll() : this.editMode.getScroll();
      },
      enumerable: false,
      configurable: true,
    });
    return t;
  })(Component),
  VIEW_TYPE = "audio",
  FK = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-file-audio";
      return t;
    }
    __extends(t, e);
    t.prototype.getViewType = function () {
      return VIEW_TYPE;
    };
    t.prototype.canAcceptExtension = function (e) {
      return AUDIO_EXTENSIONS.contains(e);
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = (n = this).app;
              Hc((r = n.contentEl));
              r.empty();
              o = r.createDiv("audio-container");
              return [4, t.displayInEl(e, i, o)];
            case 1:
              a.sent();
              return [2];
          }
        });
      });
    };
    t.displayInEl = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          i = t.vault.getResourcePath(e);
          return [2, preloadAudio(n, i)];
        });
      });
    };
    t.VIEW_TYPE = VIEW_TYPE;
    return t;
  })(EditableFileView),
  VIEW_TYPENK0 = "image",
  RK = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.icon = "lucide-image";
      return t;
    }
    __extends(t, e);
    t.prototype.getViewType = function () {
      return VIEW_TYPENK0;
    };
    t.prototype.canAcceptExtension = function (e) {
      return IMAGE_EXTENSIONS.contains(e);
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = (n = this).app;
              (r = n.contentEl).empty();
              o = r.createDiv("image-container");
              return [4, t.displayInEl(e, i, o)];
            case 1:
              a.sent();
              return [2];
          }
        });
      });
    };
    t.displayInEl = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          i = t.vault.getResourcePath(e);
          return [2, preloadImage(n, i)];
        });
      });
    };
    t.VIEW_TYPE = VIEW_TYPENK0;
    return t;
  })(EditableFileView),
  baseConfig = {
    enableScripting: false,
    externalLinkTarget: 2,
    imageResourcesPath: "/lib/pdfjs/images/",
    maxCanvasPixels: 16777216,
    pdfBugEnabled: false,
    sidebarViewOnLoad: 0,
    viewerCssTheme: 0,
    disablePreferences: false,
    disableHistory: true,
    verbosity: 0,
    defaultZoomValue: "page-width",
    cMapPacked: true,
    cMapUrl: "/lib/pdfjs/cmaps/",
    standardFontDataUrl: "/lib/pdfjs/standard_fonts/",
    wasmUrl: "/lib/pdfjs/wasm/",
    iccUrl: "/lib/pdfjs/iccs/",
    workerSrc: "/lib/pdfjs/pdf.worker.min.js",
    defaultUrl: "",
    disableTelemetry: true,
    isEvalSupported: false,
  },
  VK = i18nProxy.pdf,
  HK = i18nProxy.plugins.search,
  zK = "pdfjs-search-settings",
  qK = (function () {
    function e(app, containerEl, eventBus, scope) {
      var r = this;
      this.opened = false;
      this.searchSettings = {
        highlightAll: false,
        caseSensitive: false,
        matchDiacritics: false,
        entireWord: false,
      };
      this.clickOutsideHandler = function (e) {
        var t = r,
          n = t.settingsToggleEl,
          i = t.settingsEl;
        if (!(e.target === i || e.target === n || i.contains(e.target))) {
          r.toggleSettings(!1);
          i.win.removeEventListener("click", r.clickOutsideHandler);
        }
      };
      this.keyHandlers = null;
      this.app = app;
      this.containerEl = containerEl;
      this.eventBus = eventBus;
      this.scope = scope;
      var o = app.loadLocalStorage(zK);
      if (o)
        try {
          this.searchSettings = JSON.parse(o);
        } catch (e) {}
      var a = (this.barEl = containerEl.createDiv("pdf-findbar pdf-toolbar mod-hidden")),
        s = this.searchSettings;
      a.createDiv("pdf-search-wrapper", function (e) {
        e.createDiv(
          {
            cls: "pdf-findbar-message",
            attr: {
              "aria-live": "polite",
            },
          },
          function (e) {
            r.findResultsCountEl = e.createSpan("pdf-toolbar-label pdf-find-results-count");
          },
        );
        new SearchComponent(e)
          .setPlaceholder(HK.promptStartSearch())
          .setClass("global-search-input-container")
          .addRightDecorator(function (e) {
            setTooltip(e, HK.labelMatchCase());
            setIcon(e, "uppercase-lowercase-a");
            e.addClass("clickable-icon");
            e.addEventListener("click", function () {
              s.caseSensitive = !s.caseSensitive;
              r.saveSettings();
              r.dispatchEvent("casesensitivitychange");
              e.toggleClass("is-active", s.caseSensitive);
            });
            e.toggleClass("is-active", s.caseSensitive);
          })
          .onChange(
            debounce(
              function () {
                return r.dispatchEvent("");
              },
              250,
              !0,
            ),
          )
          .then(function (searchComponent) {
            setTooltip(searchComponent.clearButtonEl, HK.tooltipClearSearch());
            r.searchComponent = searchComponent;
            searchComponent.inputEl.addEventListener("keypress", function (e) {
              if (!e.isComposing) {
                e.key === "Enter" &&
                  (Platform.isMobile && clearFocusAndSelection(), r.dispatchEvent("again", e.shiftKey));
              }
            });
          });
        r.findPreviousButtonEl = e.createEl(
          "button",
          {
            cls: "pdf-toolbar-button clickable-icon",
          },
          function (e) {
            setIcon(e, "lucide-arrow-up");
            setTooltip(e, HO(Platform.isMacOS ? BO(["Mod", "Shift"], "G") : BO(["Shift"], "F3")), {
              placement: "top",
            });
            e.addEventListener("click", function () {
              r.dispatchEvent("again", !0);
            });
          },
        );
        r.findNextButtonEl = e.createEl(
          "button",
          {
            cls: "pdf-toolbar-button clickable-icon",
          },
          function (e) {
            setIcon(e, "lucide-arrow-down");
            setTooltip(e, HO(Platform.isMacOS ? BO(["Mod"], "G") : BO([], "F3")), {
              placement: "top",
            });
            e.addEventListener("click", function () {
              r.dispatchEvent("again", !1);
            });
          },
        );
        e.createDiv("clickable-icon pdf-findbar-settings-btn", function (settingsToggleEl) {
          setTooltip(settingsToggleEl, HK.labelToggleSearchSettings());
          setIcon(settingsToggleEl, "lucide-sliders-horizontal");
          r.settingsToggleEl = settingsToggleEl;
          settingsToggleEl.addEventListener("click", function () {
            r.toggleSettings();
          });
        });
        e.createDiv("pdf-toolbar-divider");
        e.createDiv("clickable-icon", function (e) {
          setTooltip(e, i18nProxy.interface.emptyState.close());
          setIcon(e, "lucide-x");
          e.addEventListener("click", function () {
            r.close();
          });
        });
      });
      this.settingsEl = createDiv("pdf-findbar-settings", function (e) {
        new Setting(e)
          .setName(VK.actionHighlightAll())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(s.highlightAll)
              .onChange(function (highlightAll) {
                s.highlightAll = highlightAll;
                r.saveSettings();
                r.dispatchEvent("highlightallchange");
              });
          });
        new Setting(e)
          .setName(VK.actionMatchDiacritics())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(s.matchDiacritics)
              .onChange(function (matchDiacritics) {
                s.matchDiacritics = matchDiacritics;
                r.saveSettings();
                r.dispatchEvent("diacriticmatchingchange");
              });
          });
        new Setting(e)
          .setName(VK.actionWholeWords())
          .setClass("mod-toggle")
          .addToggle(function (e) {
            return e
              .setSmall()
              .setValue(s.entireWord)
              .onChange(function (entireWord) {
                s.entireWord = entireWord;
                r.saveSettings();
                r.dispatchEvent("entirewordchange");
              });
          });
      });
    }
    e.prototype.toggleSettings = function (e) {
      var t = this,
        n = this.settingsToggleEl,
        i = this.settingsEl;
      if (!1 === e || i.isShown()) {
        n.removeClass("is-active");
        i.win.removeEventListener("click", this.clickOutsideHandler);
        return void i.detach();
      }
      var r = n.offsetLeft,
        o = n.offsetTop,
        a = n.clientHeight,
        s = n.clientWidth;
      n.addClass("is-active");
      i.setCssProps({
        top: "".concat(o + a + 6, "px"),
        left: "".concat(r + s, "px"),
      });
      this.containerEl.append(i);
      setTimeout(function () {
        i.win.addEventListener("click", t.clickOutsideHandler);
      });
    };
    e.prototype.saveSettings = function () {
      try {
        this.app.saveLocalStorage(zK, JSON.stringify(this.searchSettings));
      } catch (e) {
        console.error("Error saving PDF search settings", e);
      }
    };
    e.prototype.reset = function () {
      this.updateUIState();
    };
    e.prototype.dispatchEvent = function (type, findPrevioust0) {
      if (undefined === findPrevioust0) {
        findPrevioust0 = false;
      }
      var n = this.searchComponent,
        i = this.searchSettings;
      this.eventBus.dispatch(
        "find",
        __assign(
          {
            source: this,
            type: type,
            query: n.inputEl.value,
            findPrevious: findPrevioust0,
          },
          i,
        ),
      );
    };
    e.prototype.updateUIState = function (e, t, n) {
      var i = this.searchComponent,
        r = i.inputEl,
        o = i.containerEl,
        a = "";
      switch ((o.removeClasses(["mod-pending", "mod-not-found"]), e)) {
        case pdfjsViewer.FindState.PENDING:
          a = "mod-pending";
          break;
        case pdfjsViewer.FindState.NOT_FOUND:
          a = "mod-not-found";
      }
      a && o.addClass(a);
      r.setAttribute("aria-invalid", String(e === pdfjsViewer.FindState.NOT_FOUND));
      this.updateResultsCount(n);
    };
    e.prototype.updateResultsCount = function (e) {
      var t = e || {
          current: 0,
          total: 0,
        },
        current = t.current,
        total = t.total,
        textContent = "";
      total > 0 &&
        (textContent =
          total > 1e3
            ? VK.msgMaxSearchResults({
                current: current,
                limit: 1e3,
              })
            : total > 1
              ? VK.msgSearchCount_plural({
                  current: current,
                  total: total,
                })
              : VK.msgSearchCount({
                  current: current,
                  total: total,
                }));
      this.findResultsCountEl.textContent = textContent;
    };
    e.prototype.showSearch = function () {
      var e = this.searchComponent.inputEl;
      this.opened && e.doc.activeElement !== e ? this.searchComponent.autoSelect() : this.toggle();
    };
    e.prototype.open = function () {
      var e = this,
        t = this,
        n = t.barEl,
        i = t.searchComponent,
        r = t.eventBus,
        o = t.scope;
      this.opened ||
        ((this.opened = true),
        n.removeClass("mod-hidden"),
        n.parentElement.addClass("findbarOpen"),
        n.parentElement.setCssProps({
          "--findbar-height": "".concat(n.clientHeight, "px"),
        }));
      i.autoSelect();
      r.dispatch("findbaropen", {
        source: this,
      });
      this.keyHandlers = [
        o.register([], "F3", function () {
          return e.dispatchEvent("again", !1);
        }),
        o.register(["Mod"], "G", function () {
          return e.dispatchEvent("again", !1);
        }),
        o.register(["Shift"], "F3", function () {
          return e.dispatchEvent("again", !0);
        }),
        o.register(["Mod", "Shift"], "G", function () {
          return e.dispatchEvent("again", !0);
        }),
      ];
    };
    e.prototype.close = function () {
      var e = this,
        t = e.barEl,
        n = e.eventBus,
        i = e.scope,
        r = e.keyHandlers;
      if (this.opened) {
        this.opened = false;
        t.addClass("mod-hidden");
        t.parentElement.removeClass("findbarOpen");
        t.parentElement.setCssProps({
          "--findbar-height": "",
        });
        n.dispatch("findbarclose", {
          source: this,
        });
        for (var o = 0, a = r; o < a.length; o++) {
          var s = a[o];
          i.unregister(s);
        }
        this.keyHandlers = null;
        this.toggleSettings(!1);
      }
    };
    e.prototype.toggle = function () {
      return this.opened ? (this.close(), !1) : (this.open(), !0);
    };
    return e;
  })(),
  WK = i18nProxy.pdf;
var UK = (function () {
    function e() {}
    e.prototype.getLanguage = function () {
      return getLanguage();
    };
    e.prototype.getDirection = function () {
      return "ltr";
    };
    e.prototype.get = function (e) {
      return __awaiter(this, arguments, Promise, function (e, t, n) {
        undefined === t && (t = null);
        return __generator(this, function (i) {
          return [2, WK[e](t) || n];
        });
      });
    };
    e.prototype.translate = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          for (
            t = (function (e) {
              return e ? Array.from(e.querySelectorAll("*[data-l10n-id]")) : [];
            })(e),
              n = 0,
              i = t;
            n < i.length;
            n++
          ) {
            r = i[n];
            o = r.dataset;
            a = o.l10nId;
            s = o.l10nArgs ? JSON.parse(o.l10nArgs) : null;
            a && s && (s.attr ? r.setAttr(s.attr, WK[a](s)) : r.setText(WK[a](s)));
          }
          return [2];
        });
      });
    };
    e.prototype.pause = function () {};
    e.prototype.resume = function () {};
    return e;
  })(),
  _K = (function (e) {
    function t(owner, item, parent) {
      var r = e.call(this) || this;
      r.owner = owner;
      r.item = item;
      r.parent = parent;
      r.innerEl.setText(item.title);
      r.renderLabels();
      r.selfEl.addEventListener("contextmenu", function (e) {
        if (!e.defaultPrevented) {
          r.owner.onItemContextMenu(r, e);
        }
      });
      return r;
    }
    __extends(t, e);
    t.prototype.getExplicitDestination = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return undefined !== this.explicitDest
                ? [2, this.explicitDest]
                : ((e = this), [4, this.fetchExplicitDestination(this.owner.pdfDocument)]);
            case 1:
              return [2, (e.explicitDest = t.sent())];
          }
        });
      });
    };
    t.prototype.getPageNumber = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          switch (t.label) {
            case 0:
              return undefined !== this.pageNumber
                ? [2, this.pageNumber]
                : ((e = this), [4, this.fetchPageNumber(this.owner.pdfDocument)]);
            case 1:
              return [2, (e.pageNumber = t.sent())];
          }
        });
      });
    };
    t.prototype.fetchExplicitDestination = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (((n = (t = this).owner), (i = t.item), typeof (r = i.dest) != "string")) return [3, 5];
              l.label = 1;
            case 1:
              l.trys.push([1, 3, , 4]);
              return [4, n.pdfDocument.getDestination(r)];
            case 2:
              o = l.sent();
              return e !== n.pdfDocument
                ? [2, null]
                : o &&
                    Array.isArray(o) &&
                    typeof ((s = o[0]) === null || undefined === s ? undefined : s.num) == "number"
                  ? [2, o]
                  : [3, 4];
            case 3:
              a = l.sent();
              console.error(a);
              return [2, null];
            case 4:
              return [3, 6];
            case 5:
              if (Array.isArray(r)) return [2, r];
              l.label = 6;
            case 6:
              return [2, null];
          }
        });
      });
    };
    t.prototype.fetchPageNumber = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              t = this.owner;
              return [4, this.getExplicitDestination()];
            case 1:
              if (!(n = o.sent())) return [2, null];
              if (((i = null), typeof (r = n[0]) != "object" || r === null)) return [3, 6];
              if ((i = e.cachedPageNumber(r)) !== null) return [3, 5];
              o.label = 2;
            case 2:
              o.trys.push([2, 4, , 5]);
              return [4, t.pdfDocument.getPageIndex(r)];
            case 3:
              i = o.sent() + 1;
              return e !== t.pdfDocument ? [2, null] : [3, 5];
            case 4:
              o.sent();
              return [3, 5];
            case 5:
              return [3, 7];
            case 6:
              if (!Number.isInteger(r)) return [2, null];
              i = r + 1;
              o.label = 7;
            case 7:
              return [2, i];
          }
        });
      });
    };
    t.prototype.getMarkdownLink = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return [4, this.getExplicitDestination()];
            case 1:
              e = a.sent();
              return [4, this.getPageNumber()];
            case 2:
              t = a.sent();
              return e && t !== null
                ? ((n = "page=".concat(t)),
                  e[1] &&
                    e[1].name === "XYZ" &&
                    e.length === 5 &&
                    e[2] !== null &&
                    ((i = [e[2]]),
                    e[3] !== null && (i.push(e[3]), e[4] !== null && i.push(e[4])),
                    (n += "&offset=".concat(i.join(",")))),
                  (r = this.item.title) && (r = r.replace(/[\s\n\r]+/g, " ")),
                  [
                    2,
                    (o = this.owner.viewer).getMarkdownLink("#".concat(n), "".concat(o.file.basename, ", ").concat(r)),
                  ])
                : [2, null];
          }
        });
      });
    };
    t.prototype.renderLabels = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, texti0, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              e = this.owner;
              return [4, this.getPageNumber()];
            case 1:
              t = a.sent();
              return e.outline && t !== null
                ? ((n = (r = e.pageLabels) !== null && undefined !== r ? r : []),
                  (texti0 = String((o = n[t - 1]) !== null && undefined !== o ? o : t)),
                  this.selfEl.createDiv("tree-item-flair-outer").createSpan({
                    cls: "tree-item-flair",
                    text: texti0,
                  }),
                  [2])
                : [2];
          }
        });
      });
    };
    t.prototype.onSelfClick = function (e) {
      if (!e.defaultPrevented) {
        this.owner.onItemClick(this);
      }
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      var t = this.children;
      this.setCollapsible(t && t.length > 0);
      this.setClickable(!0);
      var n = this.item,
        i = n.bold,
        r = n.italic;
      i && (this.innerEl.style.fontWeight = "bold");
      r && (this.innerEl.style.fontStyle = "italic");
    };
    t.prototype.setActive = function (e) {
      this.selfEl.toggleClass("mod-active", e);
    };
    t.prototype.reveal = function () {
      for (var e = this.parent; e !== null; ) {
        e.setCollapsed(!1, !1);
        e = e.parent;
      }
      this.selfEl.scrollIntoView({
        block: "start",
      });
    };
    return t;
  })(M_),
  jK = (function (e) {
    function t(viewer, n, eventBus, linkService) {
      var o = e.call(this, n) || this;
      o.allItems = [];
      o.highlighted = null;
      o.pageLabels = null;
      o.viewer = viewer;
      o.eventBus = eventBus;
      o.linkService = linkService;
      eventBus._on("toggleoutlinetree", o.toggleAllTreeItems.bind(o));
      eventBus._on("currentoutlineitem", o.findCurrentOutlineItem.bind(o));
      eventBus._on("pagechanging", function (e) {
        o.currentPageNumber = e.pageNumber;
      });
      eventBus._on("pagesloaded", function (e) {
        var t;
        o.isPagesLoaded = !!e.pagesCount;
        (t = o.currentOutlineItemCapability) === null || undefined === t || t.resolve(o.isPagesLoaded);
      });
      eventBus._on("sidebarviewchanged", function (e) {
        o.sidebarView = e.view;
      });
      o.reset();
      return o;
    }
    __extends(t, e);
    t.prototype.reset = function () {
      var e;
      this.outline = null;
      this.pageNumberToDestHashCapability = null;
      this.currentPageNumber = 1;
      this.isPagesLoaded = null;
      this.highlighted = null;
      this.allItems = [];
      (e = this.currentOutlineItemCapability) === null || undefined === e || e.resolve(!1);
      this.currentOutlineItemCapability = null;
      this.clear();
    };
    t.prototype.recurseTree = function (e, t, n) {
      if ((undefined === n && (n = null), !e.length)) return [];
      for (var i = [], r = 0, o = e; r < o.length; r++) {
        var a = o[r],
          s = new _K(this, a, n);
        a.items.length && s.setCollapsed(!0, !1);
        s.children = this.recurseTree(a.items, t, s);
        i.push(s);
        t.push(s);
      }
      return i;
    };
    t.prototype.setPageNumber = function (currentPageNumber) {
      this.currentPageNumber = currentPageNumber;
    };
    t.prototype.renderTree = function (e) {
      var t = e.outline,
        n = e.pdfDocument;
      if (
        (this.outline && (this.outline !== t ? this.reset() : this.clear()),
        (this.outline = t || null),
        (this.pdfDocument = n || null),
        t)
      ) {
        for (var i = (this.allItems = []), r = 0, o = this.recurseTree(t, i); r < o.length; r++) {
          var a = o[r];
          this.addRoot(a);
        }
        this.highlighted = null;
        this.render();
        this.dispatchEvent(i.length);
      } else this.dispatchEvent(0);
    };
    t.prototype.dispatchEvent = function (outlineCount) {
      var t = (this.currentOutlineItemCapability = pdfjsViewer.createPromiseWithResolvers()),
        n = this,
        i = n.pdfDocument,
        r = n.isPagesLoaded,
        o = n.eventBus;
      outlineCount === 0 || (i == null ? undefined : i.loadingParams.disableAutoFetch)
        ? t.resolve(!1)
        : r !== null && t.resolve(r);
      o.dispatch("outlineloaded", {
        source: this,
        outlineCount: outlineCount,
        currentOutlineItemPromise: t.promise,
      });
    };
    t.prototype.onItemClick = function (highlighted) {
      var t = this.highlighted,
        n = this.linkService,
        i = highlighted.item,
        r = i.url,
        o = i.action,
        a = i.dest,
        s = i.setOCGState;
      highlighted.item.dest
        ? (t !== highlighted &&
            (t == null || t.setActive(!1), highlighted.setActive(!0), (this.highlighted = highlighted)),
          r
            ? activeWindow.open(pdfjsViewer.removeNullCharacters(r), "_blank")
            : o
              ? n.executeNamedAction(o)
              : s
                ? n.executeSetOCGState(s)
                : n.goToDestination(a))
        : highlighted.children.length && highlighted.toggleCollapsed(!0);
    };
    t.prototype.onItemContextMenu = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              ((o = this.viewer.opts) === null || undefined === o ? undefined : o.isEmbed) && t.preventDefault();
              return [4, e.getMarkdownLink()];
            case 1:
              return (n = a.sent())
                ? ((i = e.item.title) && (i = i.replace(/[\s\n\r]+/g, " ")),
                  (r = i
                    ? i18nProxy.pdf.actionCopySectionLinkTitle({
                        title: hc(i, 40),
                      })
                    : i18nProxy.pdf.actionCopySectionLink()),
                  new Menu()
                    .addItem(function (e) {
                      return e
                        .setTitle(r)
                        .setIcon("lucide-copy")
                        .onClick(function () {
                          t.view.navigator.clipboard.writeText(n);
                        });
                    })
                    .showAtMouseEvent(t),
                  [2])
                : [2];
          }
        });
      });
    };
    t.prototype.toggleAllTreeItems = function () {
      var e,
        t = this.allItems;
      if ((e = this.allItems) === null || undefined === e ? undefined : e.length)
        for (var n = t[0].collapsed, i = 0, r = t; i < r.length; i++) {
          r[i].setCollapsed(!n, !1);
        }
    };
    t.prototype.findCurrentOutlineItem = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, highlighted, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (!this.isPagesLoaded) throw new Error("findCurrentOutlineItem: All pages have not been loaded.");
              return this.outline && this.pdfDocument ? [4, this.getPageNumberToDestHash(this.pdfDocument)] : [2];
            case 1:
              if (!(e = l.sent())) return [2];
              if (
                ((s = this.highlighted) === null || undefined === s || s.setActive(!1),
                (this.highlighted = null),
                this.sidebarView !== 2)
              )
                return [2];
              for (t = this.currentPageNumber; t > 0; t--)
                if ((n = e.get(t)))
                  for (i = 0, r = this.allItems; i < r.length; i++)
                    if (((highlighted = r[i]), (a = highlighted.item.dest) && a === n)) {
                      highlighted.setActive(!0);
                      highlighted.reveal();
                      this.highlighted = highlighted;
                      return [2];
                    }
              return [2];
          }
        });
      });
    };
    t.prototype.getPageNumberToDestHash = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              if (this.pageNumberToDestHashCapability) return [2, this.pageNumberToDestHashCapability.promise];
              t = this.pageNumberToDestHashCapability = pdfjsViewer.createPromiseWithResolvers();
              n = new Map();
              i = 0;
              r = this.allItems;
              l.label = 1;
            case 1:
              return i < r.length ? ((o = r[i]), (a = o.item.dest), [4, o.getPageNumber()]) : [3, 4];
            case 2:
              if (((s = l.sent()), e !== this.pdfDocument)) return [2, null];
              n.set(s, a);
              l.label = 3;
            case 3:
              i++;
              return [3, 1];
            case 4:
              t.resolve(n.size > 0 ? n : null);
              return [2, t.promise];
          }
        });
      });
    };
    t.prototype.setPageLabels = function (e) {
      this.pageLabels = e || null;
      this.pdfDocument &&
        this.renderTree({
          outline: this.outline,
          pdfDocument: this.pdfDocument,
        });
    };
    return t;
  })(x_),
  GK = i18nProxy.pdf,
  KK = (function () {
    function e(containerEl, eventBus) {
      this.updateCallback = null;
      this.reason = null;
      this.containerEl = containerEl;
      this.eventBus = eventBus;
    }
    e.prototype.buildUI = function () {
      var e = this,
        t = this.reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;
      this.dialogEl = this.containerEl.createDiv("pdf-password-dialog", function (n) {
        setIcon(n.createDiv("pdf-lock-icon"), "lucide-lock");
        n.createDiv({
          text: GK.msgPasswordProtected(),
        });
        n.createDiv({
          text: t ? GK.msgInvalidPassword() : GK.msgEnterPassword(),
          cls: t ? "mod-warning mod-small" : "mod-small",
        });
        n.createEl(
          "input",
          {
            type: "password",
            placeholder: i18nProxy.setting.account.labelPassword(),
          },
          function (t) {
            t.addEventListener("keydown", function (n) {
              if (n.code === "Enter") {
                e.verify(t.value);
              }
            });
            setTimeout(function () {
              t.focus();
            });
          },
        );
      });
    };
    e.prototype.open = function () {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          this.buildUI();
          this.eventBus.dispatch("passwordpromptopen", {
            source: this,
          });
          return [2];
        });
      });
    };
    e.prototype.close = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e;
        return __generator(this, function (t) {
          (e = this.dialogEl) === null || undefined === e || e.detach();
          this.dialogEl = null;
          return [2];
        });
      });
    };
    e.prototype.verify = function (e) {
      if ((e == null ? undefined : e.length) > 0) {
        this.invokeCallback(e);
      }
    };
    e.prototype.invokeCallback = function (e) {
      if (this.updateCallback) {
        this.close();
        this.updateCallback(e);
        this.updateCallback = null;
      }
    };
    e.prototype.setUpdateCallback = function (updateCallback, reason) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          this.updateCallback = updateCallback;
          this.reason = reason;
          return [2];
        });
      });
    };
    e.prototype.reset = function () {
      this.close();
      this.updateCallback = null;
      this.reason = null;
    };
    return e;
  })(),
  YK = i18nProxy.pdf,
  ZK = (function () {
    function e(e, t, n) {
      var source = this,
        pdfViewer = n.pdfViewer,
        eventBus = pdfViewer.eventBus;
      this.pdfViewer = pdfViewer;
      this.eventBus = eventBus;
      this.toolbarEl = t.createDiv(
        {
          cls: "pdf-toolbar",
          prepend: !0,
        },
        function (t) {
          t.createDiv("pdf-toolbar-left", function (toolbarLeftEl) {
            source.toolbarLeftEl = toolbarLeftEl;
            source.sidebarToggleEl = toolbarLeftEl.createDiv("clickable-icon", function (e) {
              setTooltip(e, YK.actionToggleSidebar());
              setIcon(e, "lucide-layout-list");
              e.addEventListener("click", function () {
                eventBus.dispatch("togglesidebar", {
                  source: source,
                });
              });
            });
            source.sidebarOptionsEl = toolbarLeftEl.createDiv("clickable-icon", function (e) {
              setIcon(e, "lucide-chevron-down");
              setTooltip(e, YK.tooltipSidebarOptions());
              var t = false;
              e.addEventListener("click", function () {
                if (!t) {
                  var n = pdfViewer.pdfSidebar,
                    a = pdfViewer.pdfOutlineViewer.outline,
                    s = n.isOpen && n.active === 1,
                    l = n.isOpen && n.active === 2,
                    c = new Menu()
                      .addSections(["view", "action"])
                      .addItem(function (e) {
                        return e
                          .setSection("view")
                          .setIcon("lucide-layout-grid")
                          .setTitle(YK.actionShowThumbnails())
                          .setChecked(s)
                          .onClick(function () {
                            return n.switchView(s ? 0 : 1, !0);
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("view")
                          .setIcon("lucide-list")
                          .setTitle(YK.actionShowOutline())
                          .setChecked(l)
                          .setDisabled(!a)
                          .onClick(function () {
                            return n.switchView(l ? 0 : 2, !0);
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("action")
                          .setIcon("lucide-list-start")
                          .setTitle(YK.actionRevealInOutline())
                          .setDisabled(!a)
                          .onClick(function () {
                            l || n.switchView(2, !0);
                            eventBus.dispatch("currentoutlineitem", {
                              source: source,
                            });
                          });
                      });
                  c.onHide(function () {
                    t = false;
                  });
                  var u = e.getBoundingClientRect();
                  c.setParentElement(e).showAtPosition({
                    x: u.x,
                    y: u.bottom,
                    width: u.width,
                    overlap: true,
                    left: false,
                  });
                  t = true;
                }
              });
            });
            toolbarLeftEl.createDiv("pdf-toolbar-spacer");
            source.zoomOutEl = toolbarLeftEl.createDiv("clickable-icon", function (e) {
              setTooltip(e, i18nProxy.commands.zoomOut());
              setIcon(e, "lucide-zoom-out");
              e.addEventListener("click", function () {
                eventBus.dispatch("zoomout", {
                  source: source,
                });
              });
            });
            toolbarLeftEl.createDiv("pdf-toolbar-divider");
            source.zoomInEl = toolbarLeftEl.createDiv("clickable-icon", function (e) {
              setTooltip(e, i18nProxy.commands.zoomIn());
              setIcon(e, "lucide-zoom-in");
              e.addEventListener("click", function () {
                eventBus.dispatch("zoomin", {
                  source: source,
                });
              });
            });
            toolbarLeftEl.createDiv("clickable-icon", function (t) {
              setIcon(t, "lucide-chevron-down");
              setTooltip(t, YK.tooltipDisplayOptions());
              var a = false;
              t.addEventListener("click", function () {
                if (!a) {
                  var s = pdfViewer.pdfViewer.currentScaleValue,
                    l = s === "page-width",
                    c = s === "page-height",
                    u = pdfViewer.pdfViewer.spreadMode,
                    h = u === 0,
                    p = u === 1,
                    d = u === 2,
                    f = e.loadLocalStorage(QK),
                    m = new Menu()
                      .addSections(["zoom", "spread", "appearance"])
                      .addItem(function (e) {
                        return e
                          .setSection("zoom")
                          .setIcon("lucide-move-horizontal")
                          .setTitle(YK.actionFitWidth())
                          .setChecked(l)
                          .onClick(function () {
                            return eventBus.dispatch("scalechanged", {
                              source: source,
                              value: "page-width",
                            });
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("zoom")
                          .setIcon("lucide-move-vertical")
                          .setTitle(YK.actionFitHeight())
                          .setChecked(c)
                          .onClick(function () {
                            return eventBus.dispatch("scalechanged", {
                              source: source,
                              value: "page-height",
                            });
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("spread")
                          .setIcon("lucide-rectangle-vertical")
                          .setTitle(YK.labelSpreadSingle())
                          .setChecked(h)
                          .onClick(function () {
                            return eventBus.dispatch("switchspreadmode", {
                              source: source,
                              mode: 0,
                            });
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("spread")
                          .setIcon("rectangle-vertical-double")
                          .setTitle(YK.labelSpreadOdd())
                          .setChecked(p)
                          .onClick(function () {
                            return eventBus.dispatch("switchspreadmode", {
                              source: source,
                              mode: 1,
                            });
                          });
                      })
                      .addItem(function (e) {
                        return e
                          .setSection("spread")
                          .setIcon("rectangle-vertical-double")
                          .setTitle(YK.labelSpreadEven())
                          .setChecked(d)
                          .onClick(function () {
                            return eventBus.dispatch("switchspreadmode", {
                              source: source,
                              mode: 2,
                            });
                          });
                      })
                      .addItem(function (t) {
                        return t
                          .setSection("appearance")
                          .setIcon("lucide-palette")
                          .setTitle(YK.labelAdaptToTheme())
                          .setChecked(!!f)
                          .onClick(function () {
                            e.saveLocalStorage(QK, f ? null : "true");
                            n.onCSSChange();
                          });
                      });
                  m.onHide(function () {
                    a = false;
                  });
                  var g = t.getBoundingClientRect();
                  m.setParentElement(t).showAtPosition({
                    x: g.x,
                    y: g.bottom,
                    width: g.width,
                    overlap: true,
                    left: false,
                  });
                  a = true;
                }
              });
            });
            toolbarLeftEl.createDiv("pdf-toolbar-spacer");
            source.pageInputEl = toolbarLeftEl.createEl(
              "input",
              {
                cls: "pdf-page-input",
              },
              function (e) {
                e.addEventListener("click", function () {
                  return e.select();
                });
                e.addEventListener("change", function () {
                  eventBus.dispatch("pagenumberchanged", {
                    source: source,
                    value: e.value,
                  });
                });
              },
            );
            source.pageNumberEl = toolbarLeftEl.createSpan("pdf-page-numbers");
          });
          t.createDiv("pdf-toolbar-right", function (toolbarRightEl) {
            source.toolbarRightEl = toolbarRightEl;
          });
        },
      );
      eventBus._on("sidebarviewchanged", function (e) {
        var t = e.view;
        source.sidebarToggleEl.toggleClass("is-active", t > 0);
      });
      this.eventBus = eventBus;
      this.reset();
    }
    e.prototype.setPageNumber = function (pageNumber, pageLabel) {
      this.pageNumber = pageNumber;
      this.pageLabel = pageLabel;
      this.updateUIState(!1);
    };
    e.prototype.setPagesCount = function (pagesCount, hasPageLabels) {
      this.pagesCount = pagesCount;
      this.hasPageLabels = hasPageLabels;
      this.updateUIState(!0);
    };
    e.prototype.setPageScale = function (e, pageScale) {
      this.pageScaleValue = (e || pageScale).toString();
      this.pageScale = pageScale;
      this.updateUIState(!1);
    };
    e.prototype.reset = function () {
      this.pageNumber = 0;
      this.pageLabel = null;
      this.hasPageLabels = false;
      this.pagesCount = 0;
      this.pageScaleValue = pdfjsViewer.DEFAULT_SCALE_VALUE;
      this.pageScale = pdfjsViewer.DEFAULT_SCALE;
      this.updateUIState(!0);
      this.updateLoadingIndicatorState();
      this.eventBus.dispatch("toolbarreset", {
        source: this,
      });
    };
    e.prototype.updateUIState = function (e) {
      var t, n;
      if (undefined === e) {
        e = false;
      }
      var i = this,
        count = i.pagesCount,
        current = i.pageNumber,
        a = i.pageScale,
        s = i.pageInputEl,
        l = i.pageNumberEl;
      e &&
        (this.hasPageLabels
          ? (s.type = "text")
          : ((s.type = "number"),
            (l.textContent = YK.labelOfPages({
              count: count,
            }))),
        (s.max = count.toString()));
      this.hasPageLabels
        ? ((s.value = this.pageLabel),
          (l.textContent = YK.labelPageOfPages({
            current: current,
            count: count,
          })))
        : (s.value = current.toString());
      (t = this.prevPageEl) === null || undefined === t || t.toggleClass("mod-disabled", current <= 1);
      (n = this.nextPageEl) === null || undefined === n || n.toggleClass("mod-disabled", current >= count);
      this.zoomOutEl.toggleClass("mod-disabled", a <= pdfjsViewer.MIN_SCALE);
      this.zoomInEl.toggleClass("mod-disabled", a >= pdfjsViewer.MAX_SCALE);
    };
    e.prototype.updateLoadingIndicatorState = function (e) {
      undefined === e && (e = false);
      this.pageInputEl.toggleClass("mod-page-loading", e);
    };
    return e;
  })(),
  XK = i18nProxy.pdf,
  QK = "pdfjs-is-themed";
function $K(e, t, n) {
  if (!e.contains(t)) return null;
  for (var i, r = e.doc.createNodeIterator(e, NodeFilter.SHOW_TEXT), o = n; (i = r.nextNode()) && t !== i; )
    o += i.textContent.length;
  return o;
}
function JK(e, t) {
  if (!e.contains(t)) return null;
  if (t.instanceOf(HTMLElement) && t.hasClass("textLayerNode")) return t;
  for (var n = t; (n = n.parentNode); ) {
    if (n === e) return null;
    if (n.instanceOf(HTMLElement) && n.hasClass("textLayerNode")) return n;
  }
  return null;
}
function eY(e) {
  if (!e) return null;
  var t = parseInt(e);
  return Number.isNaN(t) ? null : t;
}
var tY = (function () {
    function e(app, scope, containerEl, opts) {
      var r = this;
      this.subpathHighlight = null;
      this.unloaded = false;
      this.annotationHighlight = null;
      this.highlightedText = [];
      this.app = app;
      this.scope = scope;
      this.containerEl = containerEl;
      this.opts = opts;
      this.resizeObserver = new ResizeObserver(
        debounce(
          function () {
            return r.onResize();
          },
          200,
          !0,
        ),
      );
    }
    e.prototype.load = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          eventBus,
          containerEl,
          pdfContainerEl,
          a,
          pageBackground,
          pageInvert,
          contentEl,
          viewerContainerEl,
          viewerEl,
          sidebarContainerEl,
          d,
          thumbnailViewEl,
          outlineViewEl,
          g,
          v,
          w,
          k,
          C = this;
        return __generator(this, function (E) {
          switch (E.label) {
            case 0:
              return ((w = this.opts) === null || undefined === w ? undefined : w.initDelay)
                ? [4, sleep(this.opts.initDelay)]
                : [3, 2];
            case 1:
              if ((E.sent(), this.unloaded)) return [2];
              E.label = 2;
            case 2:
              return [4, yN()];
            case 3:
              E.sent();
              Platform.isMobile && (baseConfig.maxCanvasPixels = 5242880);
              return this.unloaded
                ? [2]
                : ((t = (e = this).app),
                  (n = e.opts),
                  (eventBus = new pdfjsViewer.EventBus()),
                  (containerEl = this.loadingEl = this.containerEl.doc.body.createDiv()).setCssStyles({
                    position: "fixed",
                    opacity: "0",
                    zIndex: "-9999",
                  }),
                  (pdfContainerEl = containerEl.createDiv("pdf-container")),
                  (a = t.loadLocalStorage(QK)),
                  (pageBackground = null),
                  (pageInvert = false),
                  a &&
                    (pdfContainerEl.addClass("mod-themed"),
                    (pageBackground = pdfContainerEl.getCssPropertyValue("--pdf-page-background")),
                    (pageInvert = document.body.hasClass("theme-dark"))),
                  (contentEl = pdfContainerEl.createDiv("pdf-content-container")),
                  (viewerContainerEl = contentEl.createDiv("pdf-viewer-container", function (source) {
                    source.style.position = "absolute";
                    source.addEventListener(
                      "transitionend",
                      function (t) {
                        if (t.target === source) {
                          eventBus.dispatch("resize", {
                            source: source,
                          });
                        }
                      },
                      !0,
                    );
                    source.addEventListener("contextmenu", C.onContextMenu.bind(C));
                    source.addEventListener("pointerdown", C.onAnnotationPointerDown.bind(C));
                  })),
                  (viewerEl = viewerContainerEl.createDiv("pdfViewer")),
                  (sidebarContainerEl = contentEl.createDiv("pdf-sidebar-container", function (e) {
                    e.addEventListener("contextmenu", C.onThumbnailContextMenu.bind(C));
                  })),
                  (d = sidebarContainerEl.createDiv("pdf-sidebar-content-wrapper").createDiv("pdf-sidebar-content")),
                  (thumbnailViewEl = d.createDiv("pdf-thumbnail-view")),
                  (outlineViewEl = d.createDiv("pdf-outline-view hidden")),
                  (g = {
                    containerEl: containerEl,
                    contentEl: contentEl,
                    outlineViewEl: outlineViewEl,
                    pdfContainerEl: pdfContainerEl,
                    sidebarContainerEl: sidebarContainerEl,
                    thumbnailViewEl: thumbnailViewEl,
                    viewerContainerEl: viewerContainerEl,
                    viewerEl: viewerEl,
                  }),
                  ((v = this.pdfViewer =
                    pdfjsViewer.createObsidianPDFViewer({
                      baseConfig: baseConfig,
                      dom: g,
                      eventBus: eventBus,
                      height: n == null ? undefined : n.height,
                      isEmbed: n == null ? undefined : n.isEmbed,
                      l10n: new UK(),
                      removePageBorders: n == null ? undefined : n.removePageBorders,
                      pageBackground: pageBackground,
                      pageInvert: pageInvert,
                    })).toolbar = this.toolbar =
                    new ZK(t, containerEl, this)),
                  (v.findBar = this.findBar = new qK(t, contentEl, eventBus, this.scope)),
                  (v.passwordPrompt = new KK(viewerContainerEl, eventBus)),
                  (v.pdfOutlineViewer = new jK(this, outlineViewEl, eventBus)),
                  contentEl.onWindowMigrated(function () {
                    return __awaiter(C, undefined, undefined, function () {
                      var e, t;
                      return __generator(this, function (n) {
                        switch (n.label) {
                          case 0:
                            return this.file ? ((e = v.subpath), [4, v.close()]) : [2];
                          case 1:
                            n.sent();
                            return [4, this.loadFile(this.file)];
                          case 2:
                            n.sent();
                            return e
                              ? [4, (t = v.pdfLoadingTask) === null || undefined === t ? undefined : t.promise]
                              : [3, 4];
                          case 3:
                            n.sent();
                            v.applySubpath(e);
                            n.label = 4;
                          case 4:
                            return [2];
                        }
                      });
                    });
                  }),
                  eventBus._on("sidebarviewchanged", function (e) {
                    sidebarContainerEl.setAttr("data-view", e.view);
                  }),
                  this.scope.register([], "Escape", function () {
                    C.clearEphemeralUI();
                    C.findBar.close();
                  }),
                  eventBus._on("find", function () {
                    return C.clearEphemeralUI();
                  }),
                  this.resizeObserver.observe(pdfContainerEl),
                  [4, v.initialize()]);
            case 4:
              E.sent();
              return this.unloaded
                ? (this.unload(), [2])
                : ((k = this.loadingEl) === null || undefined === k || k.detach(),
                  (this.loadingEl = null),
                  (g.containerEl = this.containerEl),
                  this.containerEl.appendChild(this.toolbar.toolbarEl),
                  this.containerEl.appendChild(pdfContainerEl),
                  (n == null ? undefined : n.isEmbed) && (n == null ? undefined : n.height) && v.setHeight(n.height),
                  eventBus._on("textlayerrendered", function (e) {
                    var t,
                      n = e.source;
                    if (n) {
                      var i = n.textLayer,
                        r = n.id;
                      if (
                        (Platform.isMobile &&
                          ((t = i.div) === null ||
                            undefined === t ||
                            t.addEventListener("copy", function (e) {
                              C.onMobileCopy(e, n);
                            })),
                        C.subpathHighlight && C.subpathHighlight.type === "text")
                      ) {
                        var o = C.subpathHighlight,
                          a = o.page,
                          s = o.range;
                        if (r === a) {
                          C.highlightText(a, s);
                        }
                      }
                    }
                  }),
                  (n == null ? undefined : n.isEmbed) &&
                    eventBus.on(
                      "pagerendered",
                      function () {
                        var e = pdfContainerEl.querySelector(".hiddenCopyElement");
                        if (e) {
                          e.detach();
                        }
                      },
                      {
                        once: !0,
                      },
                    ),
                  eventBus._on("annotationlayerrendered", function (e) {
                    var t = e.source;
                    if (C.subpathHighlight && C.subpathHighlight.type === "annotation") {
                      var n = C.subpathHighlight,
                        i = n.page,
                        r = n.id;
                      if ((t == null ? undefined : t.id) === i) {
                        C.highlightAnnotation(i, r);
                      }
                    }
                  }),
                  [2]);
          }
        });
      });
    };
    e.prototype.unload = function () {
      var e, t, n, i;
      this.unloaded = true;
      this.resizeObserver.disconnect();
      (e = this.pdfViewer) === null || undefined === e || e.unbindWindowEvents();
      (t = this.pdfViewer) === null || undefined === t || t.close();
      this.pdfViewer = null;
      this.toolbar = null;
      (n = this.findBar) === null || undefined === n || n.close();
      this.findBar = null;
      (i = this.loadingEl) === null || undefined === i || i.detach();
      this.loadingEl = null;
      this.containerEl.empty();
      this.destroyAnnotationPopup();
    };
    e.prototype.getPage = function (e) {
      return this.pdfViewer.pdfViewer.getPageView(e - 1);
    };
    e.prototype.renderAnnotationPopup = function (e) {
      var t = this,
        n = e.layer,
        i = e.data,
        r = e.parent,
        o = r.page,
        a = o.pageNumber,
        s = o.view,
        l = this.getPage(a),
        c = i.id,
        u = i.rect,
        h = i.contentsObj,
        p = h.dir,
        d = h.str,
        f = createDiv("popup");
      if (
        (f.createDiv(
          {
            cls: "popupContent",
            attr: {
              dir: p,
            },
          },
          function (e) {
            for (var t = d.split(/(?:\r\n?|\n)/), n = 0, i = t.length; n < i; n++) {
              e.appendText(t[n]);
              n < i - 1 && e.createEl("br");
            }
          },
        ),
        f.createDiv("popupMeta", function (e) {
          if (i.titleObj) {
            e.createDiv({
              cls: "popupTitle",
              text: i.titleObj.str,
              attr: {
                dir: i.titleObj.dir,
              },
            });
          }
          var n = pdfjsLib.PDFDateString.toDateObject(i.modificationDate);
          n &&
            e.createSpan({
              cls: "popupDate",
              text: "".concat(n.toLocaleDateString(), ", ").concat(n.toLocaleTimeString()),
            });
          l &&
            e.createDiv("clickable-icon", function (e) {
              setIcon(e, "lucide-copy");
              setTooltip(e, i18nProxy.interface.menu.copy());
              e.addEventListener("click", function () {
                return __awaiter(t, undefined, undefined, function () {
                  var t, n, r;
                  return __generator(this, function (o) {
                    switch (o.label) {
                      case 0:
                        t = [];
                        return [4, this.getAnnotatedText(l, c)];
                      case 1:
                        (n = o.sent()) && t.push("> ".concat(n));
                        t.push("".concat(this.getMarkdownLink("#page=".concat(a, "&annotation=").concat(c))));
                        ((r = i.contentsObj) === null || undefined === r ? undefined : r.str) &&
                          t.push("".concat(i.contentsObj.str));
                        return [4, navigator.clipboard.writeText(t.join("\n\n"))];
                      case 2:
                        o.sent();
                        setIcon(e, "lucide-check");
                        return [2];
                    }
                  });
                });
              });
            });
        }),
        Platform.isPhone)
      ) {
        var m = new Modal(this.app).setBackgroundOpacity("0.4");
        m.containerEl.addClass("pdf-annotation-modal");
        m.contentEl.append(f);
        return void activeWindow.setTimeout(function () {
          m.open();
        }, 20);
      }
      var g = r.viewport.rawDims,
        v = g.pageWidth,
        w = g.pageHeight,
        k = g.pageX,
        C = g.pageY,
        E = pdfjsLib.Util.normalizeRect([u[0], s[3] - u[1] + s[1], u[2], s[3] - u[3] + s[1]]),
        activeAnnotationPopupEl = createDiv({
          cls: "popupWrapper",
          attr: {
            "data-annotation-id": i.id,
          },
        });
      if (
        (activeAnnotationPopupEl.append(f),
        activeAnnotationPopupEl.setCssStyles({
          left: "".concat((100 * ((E[0] + E[2]) / 2 - k)) / v, "%"),
          top: "".concat((100 * (E[3] - C)) / w, "%"),
        }),
        i.color)
      ) {
        var M = i.color,
          x = M[0],
          T = M[1],
          D = M[2];
        activeAnnotationPopupEl.style.setProperty("--annotation-color", "".concat(x, ", ").concat(T, ", ").concat(D));
      }
      n.append(activeAnnotationPopupEl);
      fl(
        activeAnnotationPopupEl,
        new cl({
          duration: 200,
          fn: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }).addProp("transform", "translate(-50%, -1px) scale(0.97)", "translate(-50%, 0) scale(1)", ""),
      );
      var A = this.pdfViewer.dom.viewerContainerEl.getBoundingClientRect(),
        P = activeAnnotationPopupEl.getBoundingClientRect();
      (P.top > A.top && P.bottom < A.bottom) ||
        activeAnnotationPopupEl.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      this.activeAnnotationPopupEl = activeAnnotationPopupEl;
    };
    e.prototype.destroyAnnotationPopup = function () {
      if (this.activeAnnotationPopupEl) {
        var e = this.activeAnnotationPopupEl;
        this.activeAnnotationPopupEl = null;
        fl(
          e,
          new cl({
            duration: 200,
            fn: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          })
            .addProp("transform", "translate(-50%, 0) scale(1)", "translate(-50%, -1px) scale(0.9)")
            .addProp("opacity", "1", "0"),
          function () {
            e.detach();
          },
        );
      }
    };
    e.prototype.clearEphemeralUI = function () {
      this.destroyAnnotationPopup();
      this.clearAnnotationHighlight();
      this.clearTextHighlight();
      this.subpathHighlight = null;
    };
    e.prototype.getAnnotationFromEvt = function (e, t) {
      var n = e.getPagePointFromEvent(t),
        i = n[0],
        r = n[1];
      return e.annotationLayer.getAnnotationAtPoint(i, r);
    };
    e.prototype.onAnnotationPointerDown = function (e) {
      var t,
        n = this;
      if (
        e.button === 0 &&
        !jl(e) &&
        !((t = this.activeAnnotationPopupEl) === null || undefined === t ? undefined : t.contains(e.targetNode))
      ) {
        var i = e.target.closest(".page");
        if (!i || !i.dataset.pageNumber) return this.clearEphemeralUI();
        var r = i.dataset.pageNumber,
          o = this.getPage(parseInt(r)),
          a = e.view,
          s = e.clientX,
          l = e.clientY,
          c = e.pointerId,
          u = false,
          h = function (e) {
            if (e.pointerId === c && Math.hypot(s - e.clientX, l - e.clientY) > 5) {
              u = true;
            }
          },
          p = function (t) {
            var i;
            if (t.pointerId === c) {
              d();
              var r = (i = n.activeAnnotationPopupEl) === null || undefined === i ? undefined : i.dataset.annotationId;
              if ((n.clearEphemeralUI(), !u)) {
                var a = n.getAnnotationFromEvt(o, e);
                if (a && a.data.subtype !== "Widget" && a.data.subtype !== "Link" && a.data.id !== r) {
                  n.renderAnnotationPopup(a);
                }
              }
            }
          },
          d = function () {
            a.removeEventListener("pointermove", h);
            a.removeEventListener("pointerup", p);
            a.removeEventListener("pointercancel", p);
          };
        a.addEventListener("pointermove", h);
        a.addEventListener("pointerup", p);
        a.addEventListener("pointercancel", p);
      }
    };
    e.prototype.getPageLinkAlias = function (page) {
      return "".concat(this.file.basename, ", ").concat(
        XK.labelPage({
          page: page,
        }),
      );
    };
    e.prototype.getTextSelectionRangeStr = function (e) {
      var t = e.win.getSelection(),
        n = t.rangeCount > 0 ? t.getRangeAt(0) : null;
      if (n && !n.collapsed) {
        var i = JK(e, n.startContainer),
          r = JK(e, n.endContainer);
        if (i && r) {
          var o = i.dataset.idx,
            a = r.dataset.idx,
            s = $K(i, n.startContainer, n.startOffset),
            l = $K(r, n.endContainer, n.endOffset);
          if (s !== null && l !== null) return "".concat(o, ",").concat(s, ",").concat(a, ",").concat(l);
        }
      }
      return null;
    };
    e.prototype.onContextMenu = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              return Platform.isDesktopApp
                ? ((t = e.target),
                  (n = t.closest(".page")) && n.instanceOf(HTMLElement)
                    ? ((i = parseInt(n.dataset.pageNumber)),
                      Number.isNaN(i)
                        ? [2]
                        : ((r = true),
                          (a = false),
                          (s = Platform.isDesktopApp && e.win.electron) && e.isTrusted
                            ? [4, onContextMenuCallback(e)]
                            : [3, 2]))
                    : [2])
                : [2];
            case 1:
              return !(l = b.sent()) || e.defaultPrevented
                ? [2]
                : ((o = s.remote.webContents.fromId(l.webContentsId)), (r = (l.editFlags || {}).canCopy), [3, 3]);
            case 2:
              a = true;
              b.label = 3;
            case 3:
              c = this.getPage(i);
              u = e.view.getSelection();
              h = u.toString();
              p = new Menu().addSections(["action", "selection", "annotation"]);
              h && (h = pdfjsViewer.removeNullCharacters(pdfjsLib.normalizeUnicode(h.replace(/[\n\r]+/g, " "))));
              Platform.isMacOS &&
                s &&
                h &&
                p.addItem(function (e) {
                  return e
                    .setSection("action")
                    .setTitle(
                      i18nProxy.interface.menu.lookupSelection({
                        selection: hc(h, 25),
                      }),
                    )
                    .setIcon("lucide-library")
                    .onClick(function () {
                      s.remote.getCurrentWebContents().showDefinitionForSelection();
                    });
                });
              d = this.getAnnotationFromEvt(c, e);
              f = null;
              m = null;
              return d && d.data.subtype !== "Widget" ? ((f = d.data.id), [4, this.getAnnotatedText(c, f)]) : [3, 5];
            case 4:
              m = b.sent();
              b.label = 5;
            case 5:
              h &&
                p.addItem(function (e) {
                  return e
                    .setSection("selection")
                    .setTitle(i18nProxy.interface.menu.copy())
                    .setIcon("lucide-copy")
                    .setDisabled(!r)
                    .onClick(function () {
                      s && o ? o.copy() : navigator.clipboard.writeText(h);
                    });
                });
              (g = this.getTextSelectionRangeStr(n)) &&
                ((v = this.getMarkdownLink("#page=".concat(i, "&selection=").concat(g), this.getPageLinkAlias(i))),
                p.addItem(function (e) {
                  return e
                    .setSection("selection")
                    .setTitle(XK.actionCopyQuote())
                    .setIcon("lucide-copy")
                    .onClick(function () {
                      navigator.clipboard.writeText("> ".concat(h.replace(/[\r\n]+/g, " "), "\n\n").concat(v));
                    });
                }),
                p.addItem(function (e) {
                  return e
                    .setSection("selection")
                    .setTitle(XK.actionCopySelectionLink())
                    .setIcon("lucide-copy")
                    .onClick(function () {
                      navigator.clipboard.writeText(v);
                    });
                }));
              f &&
                ((y = this.getMarkdownLink("#page=".concat(i, "&annotation=").concat(f), this.getPageLinkAlias(i))),
                m &&
                  p.addItem(function (e) {
                    return e
                      .setSection("annotation")
                      .setTitle(XK.actionCopyAnnotation())
                      .setIcon("lucide-copy")
                      .onClick(function () {
                        navigator.clipboard.writeText("> ".concat(m, "\n\n").concat(y));
                      });
                  }),
                p.addItem(function (e) {
                  return e
                    .setSection("annotation")
                    .setTitle(XK.actionCopyAnnotLink())
                    .setIcon("lucide-copy")
                    .onClick(function () {
                      navigator.clipboard.writeText(y);
                    });
                }));
              this.clearEphemeralUI();
              p.showAtMouseEvent(e);
              (((w = this.opts) === null || undefined === w ? undefined : w.isEmbed) || a) && e.preventDefault();
              return [2];
          }
        });
      });
    };
    e.prototype.onMobileCopy = function (e, t) {
      var n = t.div,
        i = t.id,
        r = e.clipboardData.getData("text/plain");
      if (r) {
        var o = this.getTextSelectionRangeStr(n);
        if (o) {
          var a = this.getMarkdownLink("#page=".concat(i, "&selection=").concat(o), this.getPageLinkAlias(i));
          e.clipboardData.setData("text/plain", "> ".concat(r, "\n\n").concat(a));
        }
      }
    };
    e.prototype.onThumbnailContextMenu = function (e) {
      var t = e.targetNode;
      if (t.instanceOf(HTMLElement) && t.hasClass("thumbnail")) {
        var page = parseInt(t.dataset.pageNumber);
        if (Number.isNaN(page)) return;
        var i = this.getMarkdownLink("#page=".concat(page), this.getPageLinkAlias(page));
        new Menu()
          .addItem(function (t) {
            return t
              .setTitle(
                XK.actionCopyPageLink({
                  page: page,
                }),
              )
              .setIcon("lucide-copy")
              .onClick(function () {
                e.view.navigator.clipboard.writeText(i);
              });
          })
          .showAtMouseEvent(e);
      }
    };
    e.prototype.getAnnotatedText = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, c, u, h, p, d, f, m, g, v, y, w, k, C, E;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              n = e.annotationLayer.annotationLayer.getAnnotation(t);
              return (
                (i = (E = n.data) === null || undefined === E ? undefined : E.quadPoints) == null ? undefined : i.length
              )
                ? (r = e.textLayer).renderingDone
                  ? [3, 2]
                  : [4, r.textLayer.renderingTask.promise]
                : [2, null];
            case 1:
              b.sent();
              b.label = 2;
            case 2:
              for (o = "", a = 0, s = i.length; a < s; a += 8) {
                l = i.slice(a, a + 8);
                c = l[0];
                u = l[1];
                h = l[2];
                p = l[3];
                d = l[4];
                f = l[5];
                m = l[6];
                g = l[7];
                v = Math.min(c, h, d, m);
                y = Math.max(c, h, d, m);
                w = Math.min(u, p, f, g);
                k = Math.max(u, p, f, g);
                (C = this.getTextByRect(e, [v, w, y, k])) && o !== "" && (o += " ");
                o += C;
              }
              return [2, o.trim() || null];
          }
        });
      });
    };
    e.prototype.getTextByRect = function (e, t) {
      for (
        var n, i = t[0], r = t[1], o = t[2], a = t[3], s = "", l = 0, c = e.textLayer.textLayer.textContentItems;
        l < c.length;
        l++
      ) {
        var u = c[l];
        if ((n = u.chars) === null || undefined === n ? undefined : n.length)
          for (var h = 0, p = u.chars; h < p.length; h++) {
            var d = p[h],
              f = (d.r[0] + d.r[2]) / 2,
              m = (d.r[1] + d.r[3]) / 2;
            if (f >= i && f <= o && m >= r && m <= a) {
              s += d.u;
            }
          }
      }
      return s;
    };
    e.prototype.clearAnnotationHighlight = function () {
      if (this.annotationHighlight) {
        this.annotationHighlight.detach();
        this.annotationHighlight = null;
      }
    };
    e.prototype.highlightAnnotation = function (e, t) {
      var n = this;
      if ((this.clearAnnotationHighlight(), !(e < 1 || e > this.pdfViewer.pagesCount))) {
        var i = this.getPage(e);
        if (i == null ? undefined : i.div.dataset.loaded) {
          var r = i.annotationLayer.annotationLayer.getAnnotation(t);
          if (r)
            i.annotationLayer.div.createDiv("boundingRect mod-focused", function (annotationHighlight) {
              var t = r.data.rect,
                i = r.parent.page.view,
                o = r.parent.viewport.rawDims,
                a = o.pageWidth,
                s = o.pageHeight,
                l = o.pageX,
                c = o.pageY,
                u = pdfjsLib.Util.normalizeRect([t[0], i[3] - t[1] + i[1], t[2], i[3] - t[3] + i[1]]);
              annotationHighlight.setCssStyles({
                left: "".concat((100 * (u[0] - l)) / a, "%"),
                top: "".concat((100 * (u[1] - c)) / s, "%"),
                width: "".concat((100 * (u[2] - u[0])) / a, "%"),
                height: "".concat((100 * (u[3] - u[1])) / s, "%"),
              });
              n.annotationHighlight = annotationHighlight;
              activeWindow.setTimeout(function () {
                pdfjsViewer.scrollIntoView(annotationHighlight, {
                  top: -50,
                });
              });
            });
        }
      }
    };
    e.prototype.clearTextHighlight = function () {
      if (this.highlightedText.length) {
        for (var e = 0, t = this.highlightedText; e < t.length; e++) {
          var n = t[e],
            i = n[0],
            r = n[1],
            o = this.getPage(i).textLayer.textLayer,
            a = o.textDivs,
            s = o.textContentItems,
            l = a[r];
          l.textContent = s[r].str;
          l.className = l.hasClass("textLayerNode") ? "textLayerNode" : "";
        }
        this.highlightedText = [];
      }
    };
    e.prototype.highlightText = function (e, t) {
      if ((this.clearTextHighlight(), !(e < 1 || e > this.pdfViewer.pagesCount))) {
        var n = this.getPage(e);
        if (n == null ? undefined : n.div.dataset.loaded) {
          var i = n.textLayer.textLayer,
            r = i.textDivs,
            o = i.textContentItems,
            highlightedText = [],
            s = function (t, n, i) {
              highlightedText.push([e, t]);
              highlightedText.length === 1 &&
                pdfjsViewer.scrollIntoView(
                  r[t],
                  {
                    top: -50,
                  },
                  !0,
                );
              r[t].textContent = "";
              return l(t, 0, n, i);
            },
            l = function (t, n, i, s) {
              highlightedText.push([e, t]);
              var l = r[t];
              if (l.nodeType === Node.TEXT_NODE) {
                var c = createSpan();
                l.before(c);
                c.append(l);
                r[t] = c;
                l = c;
              }
              var u = o[t].str.substring(n, i),
                h = document.createTextNode(u);
              s ? (c = l.createSpan("".concat(s, " appended"))).append(h) : l.append(h);
            },
            c = t[0],
            u = c[0],
            h = c[1],
            p = t[1],
            d = p[0],
            f = p[1],
            m = "selected";
          if ((s(u, h), u === d)) l(u, h, f, "mod-focused " + m);
          else {
            l(u, h, undefined, "mod-focused begin " + m);
            for (var g = u + 1, v = d; g < v; g++) {
              highlightedText.push([e, g]);
              r[g].classList.add("mod-focused", "middle", m);
            }
            s(d, f, "mod-focused end" + m);
          }
          l(d, f, undefined);
          this.highlightedText = highlightedText;
        }
      }
    };
    e.prototype.loadFile = function (filee0, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              n = this.pdfViewer;
              return this.unloaded || !n
                ? [2]
                : ((n.subpath = null),
                  (this.file = null),
                  (i = function () {
                    return __awaiter(r, undefined, undefined, function () {
                      var i, r, o, a, s, l;
                      return __generator(this, function (c) {
                        switch (c.label) {
                          case 0:
                            (i = (l = this.opts) === null || undefined === l ? undefined : l.displayMode) &&
                              ((n.pdfViewer._scrollMode = 3), (n.pdfViewer._spreadMode = 0));
                            c.label = 1;
                          case 1:
                            c.trys.push([1, 5, , 6]);
                            r = this.containerEl;
                            t && this.applySubpath(t);
                            return [
                              4,
                              n.open({
                                url: this.app.vault.getResourcePath(filee0),
                                ownerDocument: r.doc,
                              }),
                            ];
                          case 2:
                            c.sent();
                            this.file = filee0;
                            return i ? [4, (o = n.pdfViewer)._pagesCapability.promise] : [3, 4];
                          case 3:
                            if ((c.sent(), !(a = o.getPageView(o._currentPageNumber - 1)).canvas)) return [2];
                            a.canvas.setCssStyles({
                              maxWidth: "".concat(a.width, "px"),
                              zoom: "",
                            });
                            r.createDiv("canvasWrapper").append(a.canvas);
                            (n.height !== "auto" && n.height !== "page") ||
                              r.setCssStyles({
                                height: "auto",
                              });
                            c.label = 4;
                          case 4:
                            return [3, 6];
                          case 5:
                            s = c.sent();
                            console.error(s);
                            return [3, 6];
                          case 6:
                            return [2];
                        }
                      });
                    });
                  }),
                  this.containerEl.offsetParent
                    ? [
                        4,
                        new Promise(function (e) {
                          n.eventBus.on("passwordpromptopen", e, {
                            once: true,
                          });
                          i().finally(e);
                        }),
                      ]
                    : (this.containerEl.onNodeInserted(i, !0), [2]));
            case 1:
              o.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.applySubpath = function (e) {
      if (e) {
        var t = this.pdfViewer,
          n = t.pdfLoadingTask,
          i = (function (dest) {
            var t;
            if (dest[0] === "#") {
              dest = dest.substring(1);
            }
            var n = new URLSearchParams(dest);
            if (!n.has("page"))
              return {
                dest: dest,
                highlight: null,
              };
            var page = (t = eY(n.get("page"))) !== null && undefined !== t ? t : 1,
              r = n.has("offset") ? n.get("offset").split(",") : [],
              o = eY(r[0]),
              a = eY(r[1]),
              s = eY(r[2]),
              l =
                s === null
                  ? [
                      page - 1,
                      {
                        name: "FitBH",
                      },
                      a,
                    ]
                  : [
                      page - 1,
                      {
                        name: "XYZ",
                      },
                      o,
                      a,
                      s,
                    ],
              highlight = null;
            if (n.has("annotation"))
              highlight = {
                type: "annotation",
                page: page,
                id: n.get("annotation"),
              };
            else if (n.has("selection")) {
              var u = n.get("selection").split(","),
                h = eY(u[0]),
                p = eY(u[1]),
                d = eY(u[2]),
                f = eY(u[3]);
              if (h !== null && p !== null && d !== null && f !== null) {
                highlight = {
                  type: "text",
                  page: page,
                  range: [
                    [h, p],
                    [d, f],
                  ],
                };
              }
            }
            var height = n.has("height") ? eY(n.get("height")) : null;
            return {
              dest: JSON.stringify(l),
              highlight: highlight,
              height: height,
            };
          })(e),
          subpath = i.dest,
          o = i.highlight;
        n
          ? n.promise.then(function () {
              t.applySubpath(subpath);
            })
          : (t.subpath = subpath);
        this.subpathHighlight = o || null;
      }
    };
    e.prototype.onResize = function () {
      if (this.containerEl.isShown() && this.pdfViewer) {
        this.pdfViewer.eventBus.dispatch("resize", {
          source: this,
        });
      }
    };
    e.prototype.on = function (e, t) {
      this.pdfViewer.eventBus._on(e, t);
    };
    e.prototype.off = function (e, t) {
      this.pdfViewer.eventBus._off(e, t);
    };
    e.prototype.onCSSChange = function () {
      var e = this.pdfViewer,
        t = this.app,
        n = e.dom.pdfContainerEl,
        i = t.loadLocalStorage(QK),
        r = i ? n.getCssPropertyValue("--pdf-page-background") : null,
        o = !!i && document.body.hasClass("theme-dark");
      if (r !== e.pageBackground) {
        n.toggleClass("mod-themed", !!r);
        e.setBackground(r, o);
      }
    };
    e.prototype.getMarkdownLink = function (e, t, n) {
      var i = this.app.fileManager.generateMarkdownLink(this.file, "", e, t);
      return n ? i : i.substring(1);
    };
    return e;
  })(),
  nY = (function (e) {
    function t(app, containerEl, opts) {
      var r = e.call(this) || this;
      r.child = null;
      r.next = [];
      r.app = app;
      r.containerEl = containerEl;
      r.opts = opts;
      r.scope = new Scope(app.scope);
      return r;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e,
          t,
          n,
          i,
          r = this;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              this.registerEvent(
                this.app.workspace.on("css-change", function () {
                  r.then(function (e) {
                    return e.onCSSChange();
                  });
                }),
              );
              return this.child
                ? [2]
                : [4, (e = this.child = new tY(this.app, this.scope, this.containerEl, this.opts)).load()];
            case 1:
              if ((o.sent(), this.child === e))
                for (t = this.next, this.next = null, n = 0, i = t; n < i.length; n++) (0, i[n])(e);
              return [2];
          }
        });
      });
    };
    t.prototype.onunload = function () {
      if (this.child) {
        this.child.unload();
        this.child = null;
        this.next = [];
      }
    };
    t.prototype.then = function (e) {
      this.next ? this.next.push(e) : this.child && e(this.child);
    };
    t.prototype.loadFile = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n = this;
        return __generator(this, function (i) {
          return [
            2,
            new Promise(function (i) {
              n._loaded || i();
              n.then(function (n) {
                n.loadFile(e, t).then(i);
              });
            }),
          ];
        });
      });
    };
    return t;
  })(Component),
  iY = (function (e) {
    function t(t) {
      var n = e.call(this, t) || this;
      n.icon = "lucide-file-text";
      var i = (n.viewer = n.addChild(
          new nY(n.app, n.contentEl, {
            removePageBorders: Platform.isMobile,
          }),
        )),
        r = (n.scope = n.viewer.scope),
        o = function (e) {
          return function (t) {
            var n, r;
            if (!isContentEditable(t.targetNode)) {
              var o =
                (r = (n = i.child) === null || undefined === n ? undefined : n.pdfViewer) === null || undefined === r
                  ? undefined
                  : r.pdfViewer;
              if (o) {
                var a = o.currentScaleValue;
                if (["page-width", "page-height"].includes(a)) {
                  t.preventDefault();
                  e(o);
                }
              }
            }
          };
        };
      r.register(
        [],
        "ArrowLeft",
        o(function (e) {
          return e.previousPage();
        }),
      );
      r.register(
        [],
        "ArrowRight",
        o(function (e) {
          return e.nextPage();
        }),
      );
      return n;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      e.prototype.onload.call(this);
      var t = this.app.vault;
      this.registerEvent(t.on("modify", this.onModify, this));
    };
    t.prototype.getViewType = function () {
      return "pdf";
    };
    t.prototype.onModify = function (e) {
      if (e === this.file) {
        this.onLoadFile(e);
      }
    };
    t.prototype.onLoadFile = function (e) {
      return this.viewer.loadFile(e);
    };
    t.prototype.setEphemeralState = function (t) {
      e.prototype.setEphemeralState.call(this, t);
      this.viewer.then(function (e) {
        var n;
        if ((e.applySubpath(t.subpath), t.focus)) {
          var i = e.pdfViewer.pdfViewer;
          if (!((n = i.firstPagePromise) === null || undefined === n)) {
            n.then(function () {
              i.focus();
            });
          }
        }
      });
    };
    t.prototype.onUnloadFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (e) {
          this.viewer.then(function (e) {
            return e.pdfViewer.close();
          });
          return [2];
        });
      });
    };
    t.prototype.showSearch = function () {
      this.viewer.then(function (e) {
        return e.findBar.showSearch();
      });
    };
    t.VIEW_TYPE = "pdf";
    return t;
  })(EditableFileView),
  rY = (function (e) {
    function t(t, filen0, subpath) {
      var r = e.call(this) || this;
      r.app = t.app;
      r.containerEl = t.containerEl;
      r.file = filen0;
      r.subpath = subpath;
      var height = "page";
      if (subpath) {
        var a = new URLSearchParams(subpath.substring(1));
        if (a.has("height")) {
          var s = eY(a.get("height"));
          if (s && s > 0) {
            height = s;
          }
        }
      }
      r.containerEl.addClass("pdf-embed");
      r.viewer = r.addChild(
        new nY(r.app, r.containerEl, {
          removePageBorders: true,
          isEmbed: true,
          height: height,
          initDelay: 300,
          displayMode: t.displayMode,
        }),
      );
      r.viewer.then(function (e) {
        var n = e.toolbar.toolbarRightEl;
        n.createDiv("pdf-toolbar-spacer");
        n.createDiv("clickable-icon", function (e) {
          setIcon(e, "lucide-more-vertical");
          setTooltip(e, i18nProxy.setting.about.buttonOpen());
          e.addEventListener("click", function () {
            var n = new Menu().setParentElement(e);
            if (t.app.workspace.handleLinkContextMenu(n, t.linktext, t.sourcePath)) {
              var i = e.getBoundingClientRect();
              n.showAtPosition({
                x: i.x,
                y: i.bottom,
                width: i.width,
                overlap: true,
                left: true,
              });
            }
          });
        });
        preserveScrollPositionOnInsert(e.pdfViewer.dom.viewerContainerEl);
      });
      return r;
    }
    __extends(t, e);
    t.prototype.onload = function () {
      var t = this;
      e.prototype.onload.call(this);
      var n = this.app;
      this.registerEvent(
        n.vault.on("modify", function (e) {
          if (e === t.file) {
            t.loadFile();
          }
        }),
      );
    };
    t.prototype.loadFile = function () {
      return this.viewer.loadFile(this.file, this.subpath);
    };
    return t;
  })(Component),
  VIEW_TYPEoY0 = "video",
  aY = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.getViewType = function () {
      return VIEW_TYPEoY0;
    };
    t.prototype.canAcceptExtension = function (e) {
      return VIDEO_EXTENSIONS.contains(e);
    };
    t.prototype.onLoadFile = function (e) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              i = (n = this).app;
              Hc((r = n.contentEl));
              r.empty();
              o = r.createDiv("video-container");
              return [4, t.displayInEl(e, i, o)];
            case 1:
              a.sent();
              return [2];
          }
        });
      });
    };
    t.displayInEl = function (e, t, n) {
      return __awaiter(this, undefined, Promise, function () {
        var i;
        return __generator(this, function (r) {
          i = t.vault.getResourcePath(e);
          return [2, preloadVideo(n, i)];
        });
      });
    };
    t.VIEW_TYPE = VIEW_TYPEoY0;
    return t;
  })(EditableFileView);
function sY(e, t, n) {
  displayTooltip(e, t, {
    classes: ["mod-wide", "mod-error"],
  });
  n &&
    setTimeout(function () {
      return hideTooltip();
    }, 2e3);
}
var lY = new WeakMap();
function cY(e) {
  for (; e; ) {
    if (lY.has(e)) return lY.get(e);
    e = e.parentElement;
  }
  return 0;
}
var uY = (function (e) {
    function t(t, filen0) {
      var i = e.call(this) || this;
      i.app = t.app;
      i.containerEl = t.containerEl;
      i.file = filen0;
      i.containerEl.addClass("media-embed");
      return i;
    }
    __extends(t, e);
    t.prototype.onunload = function () {
      Hc(this.containerEl);
      e.prototype.onunload.call(this);
    };
    return t;
  })(Component),
  hY = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.containerEl.addClass("image-embed");
      return i;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return RK.displayInEl(this.file, this.app, this.containerEl);
    };
    return t;
  })(uY),
  pY = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.containerEl.addClass("audio-embed");
      return i;
    }
    __extends(t, e);
    t.prototype.loadFile = function () {
      return FK.displayInEl(this.file, this.app, this.containerEl);
    };