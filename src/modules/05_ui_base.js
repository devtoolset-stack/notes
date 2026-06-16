var nonBreakingSpaceRegex = /\u00A0/g;
function safeDecodeURI(e) {
  try {
    return decodeURI(e);
  } catch (t) {
    return e;
  }
}
function cleanString(e) {
  return e.replace(nonBreakingSpaceRegex, " ").trim().normalize("NFC");
}
function encodeSpecialChars(e) {
  return e.replace(/[\\\x00\x08\x0B\x0C\x0E-\x1F ]/g, function (e) {
    return encodeURIComponent(e);
  });
}
function extractMarkdownTitle(e) {
  var t = e.match(/^#{1,6} (.*)/m);
  return t !== null ? t[1] : null;
}
function formatTagPath(e) {
  return e
    .split("#")
    .filter(function (e) {
      return !!e;
    })
    .join(" > ")
    .trim();
}
function parseAliasLink(e) {
  var title = "",
    n = e.indexOf("|"),
    isAlias = n > 0;
  isAlias
    ? ((title = e.substring(n + 1).trim()), (e = e.substring(0, n).trim()))
    : (title = formatTagPath((e = e.trim())));
  e.endsWith("\\") && (e = e.substring(0, e.length - 1));
  return {
    href: (e = cleanString(e)),
    title: title,
    isAlias: isAlias,
  };
}
const hastUtil2Html = require("hast-util-to-html-ns");
const definitions = require("mdast-util-definitions");
// const VFile = require("modules/7074.js") /* n(7074) */,
// VFileDefault = VFile.default;
const VFile = require("vfile");

var //Hk = require("unist-builder") /* n(9650) */,
  // zk = require("unist-util-visit") /* n(6658) */,
  // qk = require("unist-util-position") /* n(1039) */,
  // Wk = require("unist-util-generated") /* n(6859) */,
  // Uk = require("mdast-util-definitions") /* n(7497) */,
  // _k = require("mdast-util-to-hast/lib/one.js") /* n(7194) */,
  jk = require("mdast-util-to-hast/lib/all.js") /* n(4297) */,
  Gk = require("mdast-util-to-hast/lib/wrap.js") /* n(7824) */,
  // Kk = require("mdast-util-to-hast/lib/footer.js") /* n(7583) */,
  // Yk = require("mdast-util-to-hast/lib/handlers") /* n(942) */,
  // Zk = {}.hasOwnProperty,
  Xk = false;
const mdastUtil2Hast = require("mdast-util-to-hast");
var $k = 32,
  Jk = 91,
  eC = "[inline";
function tC(e, t, n, i) {
  for (var r = e.length, o = -1; ++o < r; ) if (t[e[o][0]].apply(n, i)) return !0;
  return !1;
}
function nC(e) {
  var t = e.match(/^\s*([0-9]+)\s*(?:x\s*([0-9]+)\s*)?$/);
  return t
    ? {
        x: parseInt(t[1]),
        y: t[2] ? parseInt(t[2]) : 0,
      }
    : null;
}
function iC(e, t) {
  var n = nC(e);
  if (!n) return !1;
  var i = n.x,
    r = n.y,
    o = (t.data = t.data || {}),
    a = (o.hProperties = o.hProperties || {});
  a.width = String(i);
  r !== 0 && (a.height = String(r));
  return !0;
}
remarkParser.globalOptions = {
  breaks: true,
  commonmark: !0,
};
var transformerCache = new TransformerCache();
var transformerCacheAlt = new TransformerCache();
var DefinitionsHandlers = {};
function parseMetadata(meta) {
  var file = VFile(meta);
  var parser = new remarkParser(String(file), file);
  parser.setOptions(remarkParser.globalOptions);
  var node = parser.parse(),
    transformers = transformerCache.transformers;
  for (var index = 0; index < transformers.length; index++) {
    transformers[index](node, meta);
  }
  return node;
}
!(function registerMarkAfterText(parser) {
  var spacePatten = /\s/,
    checkSpace = (e) => spacePatten.test(e),
    symbolEqual = "==";
  registerInlineTokenizer(
    parser,
    "mark",
    "text",
    function (e, t, r) {
      if (
        this.options.gfm &&
        t.substr(0, 2) === symbolEqual &&
        t.substr(0, 4) !== symbolEqual + symbolEqual &&
        !checkSpace(t.charAt(2))
      ) {
        var o = "",
          a = "",
          s = "",
          l = "",
          c = 1,
          u = t.length,
          h = e.now();
        for (h.column += 2, h.offset += 2; ++c < u; ) {
          if (!((o = t.charAt(c)) !== "=" || a !== "=" || (s && checkSpace(s))))
            return (
              !!r ||
              e(symbolEqual + l + symbolEqual)({
                type: "mark",
                children: this.tokenizeInline(l, h),
                data: {
                  hName: "mark",
                },
              })
            );
          l += a;
          s = a;
          a = o;
        }
      }
    },
    function (e, t) {
      return e.indexOf(symbolEqual, t);
    },
  );
})(remarkParser);
(function (parser) {
  var t = /!?\[\[/g,
    n = /^(!?)\[\[(.+?)]]/;
  registerInlineTokenizer(
    parser,
    "ilink",
    "link",
    function (e, t, i) {
      var r = n.exec(t);
      if (r) {
        var o = r[2].trim();
        if (-1 !== o.indexOf("[[")) return !1;
        if (i) return !0;
        var a = ("0" + o).substring(1),
          s = r[1] === "!",
          l = parseAliasLink(a),
          href = l.href,
          title = l.title,
          h = l.isAlias;
        if (s)
          return e(r[0])({
            type: "iembed",
            href: href,
            title: title,
            data: {
              hName: "span",
              hProperties: {
                className: "internal-embed",
                src: href,
                alt: title,
              },
              hChildren: [
                {
                  type: "text",
                  value: title,
                },
              ],
            },
          });
        var hProperties = {
          className: "internal-link",
          href: href,
          dataHref: href,
        };
        h && ((hProperties["aria-label"] = formatTagPath(href)), (hProperties["data-tooltip-position"] = "top"));
        return e(r[0])({
          type: "ilink",
          href: href,
          title: title,
          data: {
            hName: "a",
            hProperties: hProperties,
            hChildren: [
              {
                type: "text",
                value: title,
              },
            ],
          },
        });
      }
    },
    function (e, lastIndex) {
      t.lastIndex = lastIndex;
      var i = t.exec(e);
      return i ? i.index : -1;
    },
  );
})(remarkParser);
(function registerTagAfterImage(parser) {
  registerInlineTokenizer(
    parser,
    "tag",
    "image",
    function (eat, value, silent) {
      var match = hb.exec(value);
      if (match) {
        var href = match[0];
        return (
          !/^#\d+$/.test(href) &&
          (!!silent ||
            eat(href)({
              type: "tag",
              tag: href,
              data: {
                hName: "a",
                hProperties: {
                  className: "tag",
                  href: href,
                },
                hChildren: [
                  {
                    type: "text",
                    value: href,
                  },
                ],
              },
            }))
        );
      }
    },
    function (value, from) {
      for (var i = from; -1 !== (i = value.indexOf("#", i)); ) {
        if (i <= 0) return i;
        var r = value.charAt(i - 1);
        if (/\s/.test(r)) return i;
        i++;
      }
    },
  );
})(remarkParser);
(function (e) {
  function t(e) {
    if (typeof e.checked == "boolean") {
      var t = e,
        n = (t.data = t.data || {}),
        i = (n.hProperties = n.hProperties || {});
      i.className = "task-list-item";
      e.checked && (i.className += " is-checked");
      e.checklist && (i.dataTask = e.checklist);
      var r = t.children[0];
      r && r.type === "paragraph" && (t = r);
      t.children.unshift({
        type: "checklist",
        data: {
          hName: "input",
          hProperties: {
            className: "task-list-item-checkbox",
            type: "checkbox",
            checked: e.checked,
          },
        },
        position: e.position,
      });
      delete e.checked;
    }
  }
  e.addTransformer(function (e) {
    visit(e, "listItem", t);
  });
})(transformerCache);
(function (e) {
  registerInlineTokenizer(
    e,
    "math",
    "text",
    function (e, t, n) {
      var i,
        r,
        o,
        a,
        s,
        l,
        value,
        u = t.length,
        h = false,
        p = false,
        d = 0;
      if ((t.charCodeAt(d) === 92 && ((p = true), d++), t.charCodeAt(d) === 36)) {
        if ((d++, p))
          return (
            !!n ||
            e(t.slice(0, d))({
              type: "text",
              value: "$",
            })
          );
        if ((t.charCodeAt(d) === 36 && ((h = true), d++), (o = t.charCodeAt(d)), h || (o !== 32 && o !== 9))) {
          for (a = d; d < u; ) {
            if (((r = o), (o = t.charCodeAt(d + 1)), r === 36)) {
              if (
                ((i = t.charCodeAt(d - 1)),
                (!h && i !== 32 && i !== 9 && (o != o || o < 48 || o > 57)) || (h && o === 36))
              ) {
                if (((s = d - 1), d++, h))
                  for (var f = ++d; f < u; ) {
                    var m = t.charAt(f);
                    if (m === "\n") {
                      d = f + 1;
                      break;
                    }
                    if (!/\s/.test(m)) break;
                    f++;
                  }
                l = d;
                break;
              }
            } else if (r === 92) {
              d++;
              o = t.charCodeAt(d + 1);
            }
            d++;
          }
          if (undefined !== l)
            return (
              !!n ||
              ((value = t.slice(a, s + 1)),
              e(t.slice(0, l))({
                type: "inlineMath",
                value: value,
                data: {
                  hName: "span",
                  hProperties: {
                    className: h ? "math math-block" : "math math-inline",
                  },
                  hChildren: [
                    {
                      type: "text",
                      value: value,
                    },
                  ],
                },
              }))
            );
        }
      }
    },
    function (e, t) {
      return e.indexOf("$", t);
    },
  );
})(remarkParser);
(function (e) {
  registerBlockTokenizer(e, "math", "fencedCode", function (e, t, n) {
    for (var i, value, o, a, s, l, c, u, h, p, d, f = t.length, m = 0; m < f && t.charCodeAt(m) === 32; ) m++;
    for (s = m; m < f && t.charCodeAt(m) === 36; ) m++;
    if (!((l = m - s) < 2)) {
      for (; m < f && t.charCodeAt(m) === 32; ) m++;
      for (c = m; m < f; ) {
        if ((i = t.charCodeAt(m)) === 36) return;
        if (i === 10) break;
        m++;
      }
      if (t.charCodeAt(m) === 10) {
        if (n) return !0;
        for (
          value = [], c !== m && value.push(t.slice(c, m)), m++, o = -1 === (o = t.indexOf("\n", m + 1)) ? f : o;
          m < f;
        ) {
          for (u = false, p = m, d = o, a = o, h = 0; a > p && t.charCodeAt(a - 1) === 32; ) a--;
          for (; a > p && t.charCodeAt(a - 1) === 36; ) {
            h++;
            a--;
          }
          for (
            l <= h && t.indexOf("$", p) === a && ((u = true), (d = a));
            p <= d && p - m < s && t.charCodeAt(p) === 32;
          )
            p++;
          if (u) for (; d > p && t.charCodeAt(d - 1) === 32; ) d--;
          if (((u && p === d) || value.push(t.slice(p, d)), u)) break;
          m = o + 1;
          o = -1 === (o = t.indexOf("\n", m + 1)) ? f : o;
        }
        value = value.join("\n");
        return e(t.slice(0, o))({
          type: "math",
          value: value,
          data: {
            hName: "div",
            hProperties: {
              className: "math math-block",
            },
            hChildren: [
              {
                type: "text",
                value: value,
              },
            ],
          },
        });
      }
    }
  });
  var t = e.prototype;
  registerAfter(t.interruptParagraph, "fencedCode", "math");
  registerAfter(t.interruptList, "fencedCode", "math");
  registerAfter(t.interruptBlockquote, "fencedCode", "math");
})(remarkParser);
(function (e) {
  for (var t = e.prototype, n = t.blockMethods, interruptFootnoteDefinition = [], r = 0; r < n.length; r++) {
    var o = n[r];
    if (o !== "newline" && o !== "indentedCode" && o !== "paragraph" && o !== "footnoteDefinition") {
      interruptFootnoteDefinition.push([o]);
    }
  }
  interruptFootnoteDefinition.push(["footnoteDefinition"]);
  t.interruptFootnoteDefinition = interruptFootnoteDefinition;
  registerInlineTokenizer(
    e,
    "inlineNote",
    "reference",
    function (e, t, n) {
      var i,
        r,
        o,
        a,
        s,
        l,
        c,
        u = t.length + 1,
        h = 0,
        p = 0;
      if (t.charCodeAt(h++) === 94 && t.charCodeAt(h++) === Jk) {
        for (o = h; h < u; ) {
          if ((r = t.charCodeAt(h)) != r) return;
          if (undefined === l) {
            if (r === 92) h += 2;
            else if (r === Jk) {
              p++;
              h++;
            } else if (r === 93) {
              if (p === 0) {
                a = h;
                h++;
                break;
              }
              p--;
              h++;
            } else if (r === 96) {
              for (s = h, l = 1; t.charCodeAt(s + l) === 96; ) l++;
              h += l;
            } else h++;
          } else if (r === 96) {
            for (s = h, c = 1; t.charCodeAt(s + c) === 96; ) c++;
            h += c;
            l === c && (l = undefined);
            c = undefined;
          } else h++;
        }
        if (undefined !== a)
          return (
            !!n ||
            (((i = e.now()).column += 2),
            (i.offset += 2),
            e(t.slice(0, h))({
              type: "footnote",
              children: this.tokenizeInline(t.slice(o, a), i),
            }))
          );
      }
    },
    function (e, t) {
      return e.indexOf("^[", t);
    },
  );
  registerBlockTokenizer(e, "footnoteDefinition", "definition", function (e, t, n) {
    for (
      var label,
        r,
        o,
        s,
        l,
        c,
        u,
        children,
        start,
        d,
        f,
        m,
        g,
        v = this,
        y = v.interruptFootnoteDefinition,
        b = v.offset,
        w = t.length + 1,
        contentEnd = 0,
        C = [];
      contentEnd < w && ((s = t.charCodeAt(contentEnd)) === 9 || s === $k);
    )
      contentEnd++;
    if (t.charCodeAt(contentEnd++) === Jk && t.charCodeAt(contentEnd++) === 94) {
      for (r = contentEnd; contentEnd < w; ) {
        if ((s = t.charCodeAt(contentEnd)) != s || s === 10 || s === 9 || s === $k) return;
        if (s === 93) {
          o = contentEnd;
          contentEnd++;
          break;
        }
        contentEnd++;
      }
      if (undefined !== o && r !== o && t.charCodeAt(contentEnd++) === 58) {
        if (n) return !0;
        for (label = t.slice(r, o), l = e.now(), start = 0, d = 0, f = contentEnd, m = []; contentEnd < w; ) {
          if ((s = t.charCodeAt(contentEnd)) != s || s === 10) {
            g = {
              start: start,
              contentStart: f || contentEnd,
              contentEnd: contentEnd,
              end: contentEnd,
            };
            m.push(g);
            s === 10 && ((start = contentEnd + 1), (d = 0), (f = undefined), (g.end = start));
          } else if (undefined !== d)
            if (s === $k || s === 9) {
              if ((d += s === $k ? 1 : 4 - (d % 4)) > 4) {
                d = undefined;
                f = contentEnd;
              }
            } else {
              if (d < 4 && g && (g.contentStart === g.contentEnd || tC(y, a, v, [e, t.slice(contentEnd, 1024), !0])))
                break;
              d = undefined;
              f = contentEnd;
            }
          contentEnd++;
        }
        for (contentEnd = -1, w = m.length; w > 0 && (g = m[w - 1]).contentStart === g.contentEnd; ) w--;
        for (c = e(t.slice(0, g.contentEnd)); ++contentEnd < w; ) {
          g = m[contentEnd];
          b[l.line + contentEnd] = (b[l.line + contentEnd] || 0) + (g.contentStart - g.start);
          C.push(t.slice(g.contentStart, g.end));
        }
        u = v.enterBlock();
        children = v.tokenizeBlock(C.join(""), l);
        u();
        return c({
          type: "footnoteDefinition",
          identifier: label.toLowerCase(),
          label: label,
          children: children,
        });
      }
    }
  });
  registerInlineTokenizer(
    e,
    "footnoteCall",
    "reference",
    function (e, t, n) {
      var label,
        r,
        o,
        a,
        s = t.length + 1,
        l = 0;
      if (t.charCodeAt(l++) === Jk && t.charCodeAt(l++) === 94) {
        for (r = l; l < s; ) {
          if ((a = t.charCodeAt(l)) != a || a === 10 || a === 9 || a === $k) return;
          if (a === 93) {
            o = l;
            l++;
            break;
          }
          l++;
        }
        if (undefined !== o && r !== o)
          return (
            !!n ||
            ((label = t.slice(r, o)),
            e(t.slice(0, l))({
              type: "footnoteReference",
              identifier: label.toLowerCase(),
              label: label,
            }))
          );
      }
    },
    function (e, t) {
      return e.indexOf("[", t);
    },
  );
  var a = t.blockTokenizers,
    s = t.inlineTokenizers,
    l = a.definition,
    c = s.reference;
  function reference(e, t, n) {
    var i = 0;
    if ((t.charCodeAt(i) === 33 && i++, t.charCodeAt(i) === Jk && t.charCodeAt(i + 1) !== 94))
      return c.call(this, e, t, n);
  }
  a.definition = function (e, t, n) {
    for (var i = 0, r = t.charCodeAt(i); r === $k || r === 9; ) r = t.charCodeAt(++i);
    if (r === Jk && t.charCodeAt(i + 1) !== 94) return l.call(this, e, t, n);
  };
  s.reference = reference;
  reference.locator = c.locator;
})(remarkParser);
(function (e) {
  var t = e.prototype.inlineTokenizers,
    n = t.break,
    breaki0 = function (e, t, i) {
      if (!this.options.breaks) return n.call(this, e, t, i);
      for (var r, o = t.length, a = -1; ++a < o; ) {
        if ((r = t.charCodeAt(a)) === 10)
          return (
            !!i ||
            e(t.slice(0, a + 1))({
              type: "break",
            })
          );
        if (r !== 32) return;
      }
    };
  breaki0.locator = n.locator;
  t.break = breaki0;
})(remarkParser);
(function (e) {
  var t = "---",
    frontmatter = function (e, n, i) {
      if (n.slice(0, 3) === t && n.charAt(3) === "\n") {
        for (var r = n.indexOf(t, 3); -1 !== r && n.charAt(r - 1) !== "\n"; ) r = n.indexOf(t, r + 3);
        return -1 !== r
          ? !!i ||
              e(n.slice(0, r + 3))({
                type: "yaml",
                value: n.slice(4, r - 1),
              })
          : undefined;
      }
    };
  frontmatter.onlyAtStart = true;
  var i = e.prototype;
  i.blockMethods.unshift("frontmatter");
  i.blockTokenizers.frontmatter = frontmatter;
})(remarkParser);
(function (e) {
  var t = /^\^([a-zA-Z0-9\-]+)$/,
    n = /\s/;
  registerInlineTokenizer(
    e,
    "blockid",
    "text",
    function (e, n, i) {
      var r = t.exec(n);
      if (r) {
        var o = r[1];
        return (
          !!i ||
          e(r[0])({
            type: "blockid",
            id: o,
          })
        );
      }
    },
    function (e, t) {
      for (var i = t; -1 !== (i = e.indexOf("^", i)); ) {
        if (i <= 0) return -1;
        var r = e.charAt(i - 1);
        if (n.test(r)) return i;
        i++;
      }
    },
  );
  var i = /^\^([a-zA-Z0-9\-]+)(?=$|\n$|\n\n)/;
  registerBlockTokenizer(e, "blockid", "paragraph", function (e, t, n) {
    var r = i.exec(t);
    if (r) {
      var o = r[1];
      return (
        !!n ||
        e(r[0])({
          type: "blockid",
          id: o,
        })
      );
    }
  });
})(remarkParser);
(function (e) {
  e.addTransformer(function (e) {
    visit(e, "link", function (e, t, n) {
      var i = e.url;
      if (i && isRelativePath(i)) {
        var r = undefined;
        try {
          r = decodeURI(i);
        } catch (e) {
          return;
        }
        var href = cleanString(r);
        n.children[t] = {
          type: "ilink",
          href: href,
          title: "",
          converted: true,
          data: {
            url: i,
            hName: "a",
            hProperties: {
              href: href,
              dataHref: href,
              className: "internal-link",
              title: e.title,
            },
          },
          children: e.children,
          position: e.position,
        };
      }
    });
  });
})(transformerCache);
(function (e) {
  e.addTransformer(function (e) {
    visit(e, "image", function (e, t, n) {
      var i = e.url;
      if (i && isRelativePath(i)) {
        var href = cleanString(safeDecodeURI(i));
        n.children[t] = {
          type: "iembed",
          href: href,
          title: e.alt,
          data: {
            hName: "span",
            hProperties: {
              className: "internal-embed",
              src: href,
              alt: e.alt,
            },
          },
          children: e.children,
          position: e.position,
        };
      }
    });
  });
})(transformerCache);
(function (e) {
  e.addTransformer(function (e) {
    var t = [],
      n = {},
      i = {};
    function r(e, t, n) {
      var i,
        r,
        o,
        a,
        s = String(t + 1),
        l = s;
      if (
        (n > 0 && (l += "-" + n),
        (e.type = "fnRef"),
        (e.data = {
          hName: "sup",
          hProperties: {
            className: "footnote-ref",
            "data-footnote-id": "fnref-" + l,
          },
        }),
        !e.identifier && e.hasOwnProperty("children"))
      ) {
        var c = e.children,
          start =
            (r = (i = c[0]) === null || undefined === i ? undefined : i.position) === null || undefined === r
              ? undefined
              : r.start,
          h =
            (a = (o = c[c.length - 1]) === null || undefined === o ? undefined : o.position) === null || undefined === a
              ? undefined
              : a.end;
        if (start && h) {
          e.data.contentPosition = {
            start: start,
            end: h,
          };
          e.identifier = "".concat(eC).concat(t);
        }
      }
      e.children = [
        {
          type: "element",
          data: {
            hName: "a",
            hProperties: {
              className: "footnote-link",
              href: "#fn-" + s,
              "data-footref": e.identifier,
            },
            hChildren: [
              {
                type: "text",
                value: "[" + l + "]",
              },
            ],
          },
        },
      ];
    }
    visit(e, "footnoteDefinition", function (e) {
      var t = String(e.identifier);
      i[":" + t] = -1;
      n[":" + t] = {
        children: e.children,
        position: e.position,
      };
    });
    visit(e, ["footnote", "footnoteReference"], function (e) {
      if (e.type === "footnote") {
        var o = t.length,
          identifier = String(o);
        t.push({
          count: 1,
          identifier: identifier,
        });
        n[identifier] = {
          children: e.children,
          position: e.position,
          isInline: !e.identifier && e.hasOwnProperty("children"),
        };
        r(e, o, 0);
      } else {
        identifier = String(e.identifier);
        if (!i.hasOwnProperty(":" + identifier)) {
          e.type = "text";
          return void (e.value = identifier);
        }
        if (-1 === (o = i[":" + identifier])) {
          o = t.length;
          i[":" + identifier] = o;
          t.push({
            count: 0,
            identifier: ":" + identifier,
          });
        }
        var s = t[o],
          l = s.count;
        s.count++;
        r(e, o, l);
      }
    });
    for (var children = [], a = 0; a < t.length; a++) {
      var s = t[a],
        l = n[s.identifier];
      if (l) {
        var c = l.children,
          u = c[c.length - 1];
        if (u && u.type === "paragraph") {
          c = u.children;
        }
        for (var h = String(a + 1), p = 0; p < s.count; p++) {
          var d = h;
          p > 0 && (d += "-" + p);
          c.push({
            type: "element",
            data: {
              hName: "a",
              hProperties: {
                className: "footnote-backref footnote-link",
                href: "#fnref-" + d,
              },
              hChildren: [
                {
                  type: "text",
                  value: "↩︎",
                },
              ],
            },
          });
        }
        children.push({
          type: "listItem",
          synthetic: true,
          data: {
            hProperties: {
              "data-footnote-id": "fn-" + h,
            },
            isInline: l.isInline,
          },
          children: [
            {
              type: "paragraph",
              children: l.children,
            },
          ],
          position: l.position,
        });
      }
    }
    if (children.length !== 0) {
      var f,
        m = e.children[e.children.length - 1],
        position = {
          start: (f = m
            ? {
                line: m.position.end.line + 1,
                column: 1,
                offset: m.position.end.offset,
              }
            : {
                line: 1,
                column: 1,
                offset: 0,
              }),
          end: f,
        };
      e.children = e.children.concat(
        {
          type: "text",
          value: "\n",
          position: position,
        },
        {
          type: "element",
          position: position,
          data: {
            hName: "section",
            hProperties: {
              className: "footnotes",
            },
          },
          children: [
            {
              type: "thematicBreak",
              position: position,
            },
            {
              type: "list",
              position: position,
              ordered: true,
              start: 1,
              spread: false,
              children: children,
            },
          ],
        },
      );
    }
  });
})(transformerCache);
(function (e) {
  e.addTransformer(function (e) {
    visit(e, "image", function (e) {
      var t = e.alt;
      if (t) {
        var n = t.lastIndexOf("|");
        if (-1 !== n)
          if (iC(t.substr(n + 1), e)) {
            e.alt = t.substr(0, n);
          }
      }
    });
  });
})(transformerCache);
(function (e) {
  e.addTransformer(function (e) {
    visit(e, "iembed", function (e) {
      var alt = e.title;
      if (alt) {
        var n = alt.lastIndexOf("|");
        if (-1 !== n) {
          if (iC(alt.substr(n + 1), e)) {
            alt = alt.substr(0, n);
          }
        } else if (iC(alt, e)) {
          alt = "";
        }
        alt || (alt = e.href);
        e.data.hProperties.alt = alt;
      }
    });
  });
})(transformerCache);
(function (e, t) {
  t.blockid = function () {
    return null;
  };
  e.addTransformer(function (e) {
    for (
      var t,
        n = e.children,
        i = function (e) {
          var i = n[e];
          if (i.type === "blockid") {
            if (e > 0) n[e - 1].id = i.id;
            n.splice(e, 1);
            e--;
            t = e;
            return "continue";
          }
          if (i.type === "list") {
            visit(i, "listItem", function (e) {
              var t = null;
              visit(e, ["list", "blockid"], function (e) {
                return e.type === "list" ? "skip" : ((t = e.id), !1);
              });
              t && (e.id = t);
            });
            t = e;
            return "continue";
          }
          var r = null;
          visit(i, "blockid", function (e) {
            r = e.id;
          });
          r && (i.id = r);
          t = e;
        },
        r = 0;
      r < n.length;
      r++
    ) {
      i(r);
      r = t;
    }
  });
})(transformerCache, DefinitionsHandlers);
(function (e) {
  e.addTransformer(function (e, t) {
    visit(e, "heading", function (e, n, i) {
      var dataHeading = substringWithOption(t, e);
      e.data = {
        hProperties: {
          dataHeading: dataHeading,
        },
      };
    });
  });
})(transformerCache);
(function (e, t) {
  t.callout = function (e, t) {
    var n = t.callout,
      i = n.color,
      style = null;
    if (i) {
      i = i.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/i, function (e, t, n, i) {
        return "#" + t + t + n + n + i + i;
      });
      var o = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);
      if (o) {
        style = "--callout-color: " + [parseInt(o[1], 16), parseInt(o[2], 16), parseInt(o[3], 16)].join(",") + ";";
      }
    }
    return e(
      t,
      "div",
      {
        className: "callout",
        dataCallout: n.type,
        dataCalloutIcon: n.icon,
        dataCalloutFold: n.fold,
        dataCalloutMetadata: n.data,
        style: style,
      },
      jk(e, t),
    );
  };
  t["callout-title"] = function (e, t) {
    return e(
      t,
      "div",
      {
        className: "callout-title",
      },
      [
        e({}, "div", {
          className: "callout-icon",
        }),
        e(
          {},
          "div",
          {
            className: "callout-title-inner",
          },
          jk(e, t),
        ),
      ],
    );
  };
  t["callout-content"] = function (e, t) {
    return e(
      t,
      "div",
      {
        className: "callout-content",
      },
      Gk(jk(e, t), !0),
    );
  };
  e.addTransformer(function (e) {
    visit(e, "blockquote", function (e) {
      var t = e.callout;
      if (t) {
        e.type = "callout";
        var childrenn0 = [],
          childreni0 = e.children,
          r = childreni0 && childreni0[0];
        if (r && r.position.start.line === e.position.start.line) {
          if (r.type === "paragraph") {
            for (var children = r.children, a = 0, s = undefined; a < children.length; a++)
              if (children[a].type === "break") {
                s = children[a];
                break;
              }
            var childrenl0 = childreni0.slice(1);
            s
              ? (childrenn0.push({
                  type: "callout-title",
                  position: {
                    start: r.position.start,
                    end: s.position.start,
                  },
                  children: children.slice(0, a),
                }),
                (r.position.start = s.position.end),
                (r.children = children.slice(a + 1)),
                childrenl0.unshift(r))
              : childrenn0.push({
                  type: "callout-title",
                  position: r.position,
                  children: children,
                });
            childrenl0.length > 0 &&
              childrenn0.push({
                type: "callout-content",
                position: {
                  start: childrenl0[0].position.start,
                  end: childrenl0[childrenl0.length - 1].position.end,
                },
                children: childrenl0,
              });
          } else {
            childrenn0.push({
              type: "callout-title",
              position: r.position,
              children: [r],
            });
            var c = childreni0[1];
            if (c) {
              var start = c.position.start,
                h = childreni0[childreni0.length - 1].position.end;
              childrenn0.push({
                type: "callout-content",
                position: {
                  start: start,
                  end: h,
                },
                children: childreni0.slice(1),
              });
            }
          }
        } else {
          var position = {
              start: e.position.start,
              end: e.position.start,
            },
            value = t.type.trim().replace(/\-/g, " ").toLowerCase();
          value = value.charAt(0).toUpperCase() + value.substr(1);
          childrenn0.push({
            type: "callout-title",
            position: position,
            children: [
              {
                type: "text",
                value: value,
                position: position,
              },
            ],
          });
          r &&
            childrenn0.push({
              type: "callout-content",
              position: e.position,
              children: childreni0,
            });
        }
        e.children = childrenn0;
      }
    });
  });
})(transformerCache, DefinitionsHandlers);
(function (e) {
  function t(e) {
    var t = e.properties;
    if (t && !t.className) {
      t.className = "external-link";
      t.target = "_blank";
      t.rel = "noopener nofollow";
      var n = "",
        i = e.children;
      i && i.length > 0 && (n = i[0].value);
      t.href !== n && ((t["aria-label"] = t.href), (t["data-tooltip-position"] = "top"));
    }
  }
  e.addTransformer(function (e) {
    visit(
      e,
      {
        type: "element",
        tagName: "a",
      },
      t,
    );
  });
})(transformerCacheAlt);
(function (e, t) {
  t.yaml = function (e, t) {
    var n = t.value || "";
    return e(
      t.position,
      "pre",
      {
        className: "frontmatter",
      },
      [
        e(
          t,
          "code",
          {
            className: "language-yaml",
          },
          [unistBuilder("text", n)],
        ),
      ],
    );
  };
})(0, DefinitionsHandlers);
(function (e, t) {
  var n = /^%%(.+?)%%/;
  registerInlineTokenizer(
    e,
    "comment",
    "text",
    function (e, t, i) {
      var r = n.exec(t);
      if (r) {
        if (i) return !0;
        var o = e.now();
        o.column += 2;
        o.offset += 2;
        return e(r[0])({
          type: "comment",
          children: this.tokenizeInline(r[1], o),
        });
      }
    },
    function (e, t) {
      return e.indexOf("%%", t);
    },
  );
  t.comment = function () {
    return null;
  };
  registerBlockTokenizer(e, "comment", "fencedCode", function (e, t, n) {
    for (var i = t.length, r = 0; r < i && t.charCodeAt(r) === 32; ) r++;
    for (var o = r; r < i && t.charCodeAt(r) === 37; ) r++;
    var a = r - o;
    if (!(a < 2)) {
      for (var s = r; r < i; ) {
        var l = t.charCodeAt(r);
        if (l === 37) return;
        if (l === 10) break;
        r++;
      }
      if (n) return !0;
      for (var c = i, u = 0; r < i; ) {
        if (t.charCodeAt(r) === 37) {
          if (a === ++u) {
            c = r + 1;
            break;
          }
        } else u = 0;
        r++;
      }
      var value = t.substring(s, c - a),
        p = e.now();
      return e(t.slice(0, c))({
        type: "comment",
        value: value,
        children: this.tokenizeInline(value, p),
      });
    }
  });
  var i = e.prototype;
  registerAfter(i.interruptParagraph, "fencedCode", "comment");
  registerAfter(i.interruptList, "fencedCode", "comment");
  registerAfter(i.interruptBlockquote, "fencedCode", "comment");
})(remarkParser, DefinitionsHandlers);
const FRONTMATTER_START_PATTERN = /^---(\r?\n)/g;
const FRONTMATTER_END_PATTERN = /---(\r?\n|$)/g;
function getFrontMatterInfo(content) {
  FRONTMATTER_START_PATTERN.lastIndex = 0;
  if (!FRONTMATTER_START_PATTERN.exec(content)) {
    return {
      exists: false,
      contentStart: 0,
      from: 0,
      to: 0,
      frontmatter: "",
    };
  }
  const lastIndex = FRONTMATTER_START_PATTERN.lastIndex;
  FRONTMATTER_END_PATTERN.lastIndex = lastIndex;
  for (var endMatch = FRONTMATTER_END_PATTERN.exec(content); endMatch && content.charAt(endMatch.index - 1) !== "\n"; )
    endMatch = FRONTMATTER_END_PATTERN.exec(content);
  if (!endMatch) {
    return {
      exists: false,
      contentStart: 0,
      from: 0,
      to: 0,
      frontmatter: "",
    };
  }
  const endPos = endMatch.index;
  const contentStart = FRONTMATTER_END_PATTERN.lastIndex;
  return {
    exists: true,
    frontmatter: content.slice(lastIndex, endPos),
    from: lastIndex,
    to: endPos,
    contentStart: contentStart,
  };
}
function removeYamlFrontmatterNode(rootNode) {
  const firstChild = rootNode.children[0];
  firstChild?.type === "yaml" && rootNode.children.shift();
  return rootNode;
}
function parseYamlFrontmatter(rootNode) {
  const firstChild = rootNode.children[0];
  if (firstChild?.type === "yaml") {
    try {
      const parsedData = parseDocument(firstChild.value, undefined, {});
      if (parsedData && typeof parsedData == "object" && !Array.isArray(parsedData)) {
        return parsedData || undefined;
      }
    } catch (error) {
      return null;
    }
  }
}
function renderMarkdown(markdown, options = {}) {
  options.allowDangerousHtml = true;
  options.handlers = DefinitionsHandlers;
  const ast = mdastUtil2Hast(markdown, options);
  const transformers = transformerCacheAlt.transformers;
  for (var i = 0; i < transformers.length; i++) {
    transformers[i](ast, "");
  }
  return hastUtil2Html(ast, {
    allowDangerousHtml: true,
  });
}
function parseFrontMatterEntry(frontMatter, key) {
  if (!frontMatter) return null;
  if (typeof key == "string") return Object.prototype.hasOwnProperty.call(frontMatter, key) ? frontMatter[key] : null;
  for (var n in frontMatter)
    if (Object.prototype.hasOwnProperty.call(frontMatter, n) && key.test(n)) return frontMatter[n];
  return null;
}
function parseFrontMatterStringArray(e, t) {
  var n = parseFrontMatterEntry(e, t);
  return n
    ? typeof n == "string"
      ? [n.trim()]
      : Array.isArray(n)
        ? n
            .filter(function (e) {
              return typeof e == "string";
            })
            .map(function (e) {
              return e.trim();
            })
        : null
    : null;
}
function parseFrontMatterAliases(e) {
  return parseFrontMatterStringArray(e, /^aliases$/i);
}
function parseFrontMatterTags(e) {
  if (!e) return null;
  var t = parseFrontMatterStringArray(e, /^tags$/i);
  if (t) {
    t = t.filter(function (e) {
      return !!e && !e.includes(" ");
    });
    for (var n = 0; n < t.length; n++) {
      var i = t[n];
      if (i.charAt(0) !== "#") {
        t[n] = "#" + i;
      }
    }
  }
  return t;
}
function getCssClasses(frontmatter) {
  if (!frontmatter) return null;
  const classes = parseFrontMatterStringArray(frontmatter, /^cssclasses$/i);
  return classes ? classes.filter((cls) => !!cls && !cls.includes(" ")) : null;
}
function node2Definitions(node) {
  const definitions = require("mdast-util-definitions");
  return definitions(node);
}
function mapChildrenToText(children) {
  const texts = [];
  if (!children) return texts;
  for (const child of children) {
    texts.push(nodeToPlainText(child));
  }
  return texts;
}
function nodeToPlainText(node) {
  if (!node) return "";
  const type = node.type;
  if (type === "html") return "";
  if (type === "iembed") return node.href;
  if (type === "listItem") {
    const childTexts = mapChildrenToText(node.children);
    return childTexts.length === 1 ? childTexts[0] + "\n" : childTexts.join("\n");
  }
  if (type === "tag") return node.tag;
  if (type === "comment") return "";
  let text =
    node.value ||
    node.alt ||
    node.title ||
    (node.hasOwnProperty("children") && mapChildrenToText(node.children).join("")) ||
    "";
  type === "list" && node.start !== undefined && node.start !== null && (text = node.start + ". " + text);
  type === "paragraph" || type === "break" || type === "heading" || type === "code" || type === "break"
    ? (text += "\n")
    : text.endsWith("\n") && (text = text.substring(0, text.length - 1));
  type === "tableCell" ? (text += " ") : type === "tableRow" && (text += "\n");
  return text;
}
function hasPosition(data) {
  return data.hasOwnProperty("position");
}
function hasKey(data) {
  return data.hasOwnProperty("key");
}
function toZeroBasedPosition(data) {
  return {
    line: data.line - 1,
    col: data.column - 1,
    offset: data.offset,
  };
}
function toZeroBasedRange(range) {
  return {
    start: toZeroBasedPosition(range.start),
    end: toZeroBasedPosition(range.end),
  };
}
function extractFrontmatterLinks(obj) {
  const links = [];
  const addLink = function (parentKey, key, original) {
    const fullKey = parentKey ? parentKey + "." + key : key;
    if (typeof original == "string") {
      if (original.startsWith("[[") && original.endsWith("]]")) {
        const alias = parseAliasLink(original.substring(2, original.length - 2));
        links.push({
          key: fullKey,
          link: alias.href,
          original: original,
          displayText: alias.title,
        });
      }
    } else {
      traverse(fullKey, original);
    }
  };
  const traverse = function (parentKey, data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        addLink(parentKey, String(i), data[i]);
      }
    } else if (typeof data == "object" && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          addLink(parentKey, key, data[key]);
        }
      }
    }
  };
  traverse("", obj);
  return links;
}
function parseDocumentMetadata(content, skipOriginal) {
  const metadata = {
    links: [],
    embeds: [],
    tags: [],
    headings: [],
    footnotes: [],
    footnoteRefs: [],
    referenceLinks: [],
    sections: [],
    listItems: [],
    blocks: {},
  };
  const ast = parseMetadata(content);
  const firstChild = ast.children[0];
  if (firstChild && firstChild.type === "yaml") {
    const frontmatter = parseYamlFrontmatter(ast);
    if (frontmatter) {
      metadata.frontmatter = frontmatter;
      metadata.frontmatterPosition = toZeroBasedRange(firstChild.position);
      metadata.frontmatterLinks = extractFrontmatterLinks(frontmatter);
    }
  }
  for (const child of ast.children) {
    const position = toZeroBasedRange(child.position);
    const sectionInfo = {
      type: child.type,
      position: position,
    };
    const id = child.id;
    if (typeof id == "string") {
      sectionInfo.id = id;
      metadata.blocks[id.toLowerCase()] = {
        position,
        id,
      };
    }
    metadata.sections.push(sectionInfo);
  }
  visit(
    ast,
    ["heading", "ilink", "iembed", "tag", "listItem", "fnRef", "footnoteDefinition", "definition"],
    function (node, index, parent) {
      if (node.type === "fnRef") {
        metadata.footnoteRefs.push({
          position: toZeroBasedRange(node.data?.contentPosition || node.position),
          id: node.identifier || "",
        });
      } else if (node.type === "footnoteDefinition") {
        metadata.footnotes.push({
          position: toZeroBasedRange(node.position),
          id: node.identifier || "",
        });
      } else if (node.type === "definition" && node.url) {
        metadata.referenceLinks.push({
          position: toZeroBasedRange(node.position),
          id: node.label || node.identifier || "",
          link: node.url || "",
        });
      } else if (node.type === "heading" && parent.type === "root") {
        const heading = substringWithOption(content, node);
        metadata.headings.push({
          position: toZeroBasedRange(node.position),
          heading,
          level: node.depth || 1,
        });
      } else if (node.type === "ilink") {
        const original = content.substring(node.position.start.offset, node.position.end.offset);
        const link = node.href || "";
        let displayText = node.title || "";
        if (!displayText && node.converted) {
          displayText = nodeToPlainText(node);
        }
        const linkEntry = {
          position: toZeroBasedRange(node.position),
          link,
          original,
          displayText,
        };
        skipOriginal && delete linkEntry.original;
        metadata.links.push(linkEntry);
      } else if (node.type === "iembed") {
        const original = content.substring(node.position.start.offset, node.position.end.offset);
        const link = node.href || "";
        const displayText = node.title || "";
        const linkEntry = {
          position: toZeroBasedRange(node.position),
          link,
          original,
          displayText,
        };
        skipOriginal && delete linkEntry.original;
        metadata.embeds.push(linkEntry);
      } else if (node.type === "tag") {
        metadata.tags.push({
          position: toZeroBasedRange(node.position),
          tag: node.tag || "",
        });
      } else if (node.type === "listItem") {
        if (node.synthetic) {
          if (node.data?.isInline) return;
          return "skip";
        }
        const listItemPos = toZeroBasedRange(node.position);
        const children = node.children;
        if (children && children.length > 1)
          for (let idx = children.length - 1; idx >= 0; idx--) {
            const child = children[idx];
            if (child.type !== "list") {
              listItemPos.end = toZeroBasedPosition(child.position.end);
              break;
            }
            child.listParentPosition = node.position;
          }
        let parent = 0;
        if (parent.type === "list") {
          parent.listParentPosition
            ? (parent = parent.listParentPosition.start.line - 1)
            : (parent = -(parent.position.start.line - 1)) === 0 && (parent = -1);
        }
        const listItemEntry = {
          position: listItemPos,
          parent,
        };
        const task = node.checklist;
        typeof task == "string" && (listItemEntry.task = task);
        const itemId = node.id;
        itemId &&
          typeof itemId == "string" &&
          ((listItemEntry.id = itemId),
          (metadata.blocks[itemId.toLowerCase()] = {
            position: listItemPos,
            id: itemId,
          }));
        metadata.listItems.push(listItemEntry);
      }
    },
  );
  metadata.links.length === 0 && delete metadata.links;
  metadata.embeds.length === 0 && delete metadata.embeds;
  metadata.tags.length === 0 && delete metadata.tags;
  metadata.headings.length === 0 && delete metadata.headings;
  metadata.footnotes.length === 0 && delete metadata.footnotes;
  metadata.footnoteRefs.length === 0 && delete metadata.footnoteRefs;
  metadata.referenceLinks.length === 0 && delete metadata.referenceLinks;
  (metadata.sections.length === 0 || skipOriginal) && delete metadata.sections;
  metadata.listItems.length === 0 && delete metadata.listItems;
  Object.keys(metadata.blocks).length === 0 && delete metadata.blocks;
  return metadata;
}
function traverseMetadata(metadata, callback) {
  if (!metadata) return metadata;
  if (metadata.links) {
    for (const link of metadata.links) callback(link);
  }
  if (metadata.embeds) {
    for (const embed of metadata.embeds) callback(embed);
  }
  if (metadata.tags) {
    for (const tag of metadata.tags) callback(tag);
  }
  if (metadata.headings) {
    for (const heading of metadata.headings) callback(heading);
  }
  if (metadata.sections) {
    for (const section of metadata.sections) callback(section);
  }
  if (metadata.listItems) {
    for (const item of metadata.listItems) callback(item);
  }
  if (metadata.blocks) {
    for (const key in metadata.blocks) {
      metadata.blocks.hasOwnProperty(key) && callback(metadata.blocks[key]);
    }
  }
  return metadata;
}
function positionToTuple(pos) {
  const { start, end } = pos;
  return [start.line, start.col, start.offset, end.line, end.col, end.offset];
}
function replacePositionWithPos(data) {
  const pos = data.position;
  if (pos) {
    delete data.position;
    data.pos = positionToTuple(pos);
  }
}
function tupleToPosition(tuple) {
  return {
    start: {
      line: tuple[0],
      col: tuple[1],
      offset: tuple[2],
    },
    end: {
      line: tuple[3],
      col: tuple[4],
      offset: tuple[5],
    },
  };
}
function replacePosWithPosition(data) {
  const pos = data.pos;
  if (pos && Array.isArray(pos) && pos.length === 6) {
    delete data.pos;
    data.position = tupleToPosition(pos);
  }
}
function normalizeCachePositions(cache) {
  if (cache.frontmatterPos) {
    cache.frontmatterPosition = tupleToPosition(cache.frontmatterPos);
    delete cache.frontmatterPos;
  }
  return traverseMetadata(cache, replacePosWithPosition);
}
function migrateCache(cache) {
  var version = cache.v || 0;
  if (version < 1) {
    if (cache.frontmatter && Array.isArray(cache.frontmatter)) {
      cache.frontmatter = null;
      delete cache.frontmatterPos;
      delete cache.frontmatterLinks;
    }
    if (cache.frontmatter) {
      if (!cache.frontmatterPos && cache.frontmatter.pos) {
        cache.frontmatterPos = cache.frontmatter.pos;
        delete cache.frontmatter.pos;
      }
      if (!cache.frontmatterLinks) {
        cache.frontmatterLinks = extractFrontmatterLinks(cache.frontmatter);
      }
    }
    traverseLinksOrEmbeds(cache, (entry) => {
      entry.link = cleanString(entry.link);
    });
    cache.v = 1;
  }
  return cache.v !== version;
}
function binarySearchByOffset(items, targetOffset, preferEnd) {
  let low = 0;
  let high = items.length;
  while (low < high) {
    const mid = ((low + high) / 2) | 0;
    const cmp = compareOffset(items[mid], targetOffset);
    if (cmp === 0) return mid;
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return preferEnd ? high : low;

  function compareOffset(item, offset) {
    if (offset < item.position.start.offset) return 1;
    if (offset > item.position.end.offset) return -1;
    return 0;
  }
}
function getLinkpath(link) {
  const hashIndex = link.indexOf("#");
  return -1 === hashIndex ? link : link.substring(0, hashIndex);
}
function parseLinktext(link) {
  const hashIndex = link.indexOf("#");
  return {
    path: -1 === hashIndex ? link : link.substring(0, hashIndex),
    subpath: -1 === hashIndex ? "" : link.substring(hashIndex),
  };
}
function iterateCacheRefs(cache, predicate) {
  return !!cache && (iterateRefs(cache.links, predicate) || iterateRefs(cache.embeds, predicate));
}
function traverseLinksOrEmbeds(e, t) {
  return (
    !!e &&
    (!0 === iterateRefs(e.frontmatterLinks, t) || !0 === iterateRefs(e.links, t) || !0 === iterateRefs(e.embeds, t))
  );
}
function iterateRefs(e, t) {
  if (!e) return !1;
  for (var n = 0, i = e; n < i.length; n++) {
    if (!0 === t(i[n])) return !0;
  }
  return !1;
}
function getAllTags(e) {
  if (!e) return null;
  var t = [],
    n = parseFrontMatterTags(e.frontmatter);
  if (n)
    for (var i = 0, r = n; i < r.length; i++) {
      var o = r[i];
      t.push(o);
    }
  var a = e.tags;
  if (a)
    for (var s = 0, l = a; s < l.length; s++) {
      o = l[s];
      t.push(o.tag);
    }
  return t;
}
const HEADING_STRIP_REGEX = /[!"#$%&()*+,.:;<=>?@^`{|}~\/\[\]\\\r\n]/g;
const HEADING_LINK_STRIP_REGEX = /([:#|^\\\r\n]|%%|\[\[|]])/g;
function stripHeading(e) {
  return e.replace(HEADING_STRIP_REGEX, " ").replace(/\s+/g, " ").trim();
}
function stripHeadingForLink(e) {
  return e.replace(HEADING_LINK_STRIP_REGEX, " ").replace(/\s+/g, " ").trim();
}
function getHeadingDisplayText(data) {
  let text = nodeToPlainText(parseMetadata(data.heading));
  if (!text) text = data.heading;
  return text;
}
function resolveSubpath(e, t) {
  if (!e || !t) return null;
  var n = t.split("#").filter(function (e) {
    return !!e;
  });
  if (!n || n.length === 0) return null;
  if (n.length === 1) {
    var i = n[0];
    if (i.startsWith("^")) {
      var r = i.substr(1).toLowerCase(),
        o = e.blocks;
      if (o && o.hasOwnProperty(r))
        for (var a in o)
          if (a.toLowerCase() === r && o.hasOwnProperty(a)) {
            var block = o[a],
              list = null;
            if (e.listItems)
              for (var c = 0, u = e.listItems; c < u.length; c++) {
                var h = u[c];
                if (h.id && h.id.toLowerCase() === r) {
                  list = h;
                  break;
                }
              }
            return {
              type: "block",
              block: block,
              list: list,
              start: block.position.start,
              end: block.position.end,
            };
          }
    } else if (i.startsWith("[^")) {
      var p = i.slice(2, -1);
      if (e.footnotes)
        for (var d = 0, f = e.footnotes; d < f.length; d++) {
          var footnote = f[d];
          if (footnote.id === p)
            return {
              type: "footnote",
              footnote: footnote,
              start: footnote.position.start,
              end: footnote.position.end,
            };
        }
    }
  }
  var g = e.headings;
  if (!g || g.length === 0) return null;
  for (var v = 0, y = 0, current = null, next = null, k = 0, C = g; k < C.length; k++) {
    var E = C[k];
    if (current && E.level <= y) {
      next = E;
      break;
    }
    if (!current && E.level > y && stripHeading(E.heading).toLowerCase() === stripHeading(n[v]).toLowerCase()) {
      v++;
      y = E.level;
      v === n.length && (current = E);
    }
  }
  return current
    ? {
        type: "heading",
        current: current,
        next: next,
        start: current.position.start,
        end: next ? next.position.start : null,
      }
    : null;
}
function extractSubpathContent(content, cache, resolved, includeHeading = false) {
  let before = "";
  let after = "";
  let indent = "";
  let heading = "";
  if (resolved.type === "block" && resolved.list) {
    var l = (function (e, t) {
        var n = e.listItems;
        if (!n) return t;
        var i = n.indexOf(t);
        if (-1 === i) return t;
        var r = new Set();
        r.add(t.position.start.line);
        for (var o = t, a = i + 1; a < n.length; a++) {
          var s = n[a];
          if (!r.has(s.parent)) break;
          r.add(s.position.start.line);
          o = s;
        }
        return o;
      })(cache, resolved.list),
      c = (function (e, t) {
        var n = e.position.start,
          i = t.position.end;
        return {
          start: n.offset - n.col,
          end: i.offset,
        };
      })(resolved.list, l),
      u = c.start,
      h = c.end;
    before = content.substring(0, u);
    after = content.substring(h);
    var p = (function (e) {
      var t = e.split("\n"),
        indent = t[0].match(/^\s*/)[0],
        i = indent.replace(/\t/g, "    ").length;
      if (i > 0)
        for (var r = 0; r < t.length; r++) {
          for (var o = t[r], a = 0, s = 0; a < o.length && s < i; ) {
            s += o.charAt(a) === "\t" ? 4 : 1;
            a++;
          }
          t[r] = o.substr(a);
        }
      return {
        indent: indent,
        text: t.join("\n"),
      };
    })(content.substring(u, h));
    content = p.text;
    indent = p.indent;
  } else {
    u = resolved.start.offset;
    h = resolved.end ? resolved.end.offset : content.length;
    var d = u;
    includeHeading &&
      resolved.type === "heading" &&
      ((d = resolved.current.position.end.offset + 1), (heading = content.substring(u, d)));
    before = content.substring(0, u);
    after = content.substring(h);
    content = content.substring(d, h);
  }
  if (resolved.type === "footnote") {
    var f = content.match(/^\[\^[^\]]+\]:\s*/);
    f && ((before += f[0]), (content = content.slice(f[0].length)));
    content = content.replace(/\n( {4}|\t)/g, "\n");
  }
  return {
    before: before,
    after: after,
    indent: indent,
    heading: heading,
    content: content,
  };
}
function getSubpathType(subpath) {
  return subpath ? (subpath.startsWith("#[^") ? "footnote" : subpath.startsWith("#^") ? "block" : "heading") : null;
}
function getNextFootnoteNumber(cache) {
  let maxNumber = 0;
  if (cache == null ? undefined : cache.footnotes)
    for (var n = 0, i = cache.footnotes; n < i.length; n++) {
      var r = i[n];
      if (!r.id.startsWith(eC) && /^\d+$/.test(r.id)) {
        var o = parseInt(r.id, 10);
        if (o > maxNumber) {
          maxNumber = o;
        }
      }
    }
  return maxNumber + 1;
}
const lucideIconArray = {
  "a-arrow-down": [
    [6, "M3.5 13h6"],
    [6, "m2 16 4.5-9 4.5 9"],
    [6, "M18 7v9"],
    [6, "m14 12 4 4 4-4"],
  ],
  "a-arrow-up": [
    [6, "M3.5 13h6"],
    [6, "m2 16 4.5-9 4.5 9"],
    [6, "M18 16V7"],
    [6, "m14 11 4-4 4 4"],
  ],
  "a-large-small": [
    [6, "M21 14h-5"],
    [6, "M16 16v-3.5a2.5 2.5 0 0 1 5 0V16"],
    [6, "M4.5 13h6"],
    [6, "m3 16 4.5-9 4.5 9"],
  ],
  accessibility: [
    [1, 16, 4, 1],
    [6, "m18 19 1-7-6 1"],
    [6, "m5 8 3-3 5.5 3-2.36 3.5"],
    [6, "M4.24 14.5a5 5 0 0 0 6.88 6"],
    [6, "M13.76 17.5a5 5 0 0 0-6.88-6"],
  ],
  activity: [
    [
      6,
      "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
    ],
  ],
  "activity-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M17 12h-2l-2 5-2-10-2 5H7"],
  ],
  "air-vent": [
    [6, "M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"],
    [6, "M6 8h12"],
    [6, "M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12"],
    [6, "M6.6 15.6A2 2 0 1 0 10 17v-5"],
  ],
  airplay: [
    [6, "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"],
    [6, "m12 15 5 6H7Z"],
  ],
  "alarm-check": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "m9 13 2 2 4-4"],
  ],
  "alarm-clock": [
    [1, 12, 13, 8],
    [6, "M12 9v4l2 2"],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
  ],
  "alarm-clock-check": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "m9 13 2 2 4-4"],
  ],
  "alarm-clock-minus": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "M9 13h6"],
  ],
  "alarm-clock-off": [
    [6, "M6.87 6.87a8 8 0 1 0 11.26 11.26"],
    [6, "M19.9 14.25a8 8 0 0 0-9.15-9.15"],
    [6, "m22 6-3-3"],
    [6, "M6.26 18.67 4 21"],
    [6, "m2 2 20 20"],
    [6, "M4 4 2 6"],
  ],
  "alarm-clock-plus": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "M12 10v6"],
    [6, "M9 13h6"],
  ],
  "alarm-minus": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "M9 13h6"],
  ],
  "alarm-plus": [
    [1, 12, 13, 8],
    [6, "M5 3 2 6"],
    [6, "m22 6-3-3"],
    [6, "M6.38 18.7 4 21"],
    [6, "M17.64 18.67 20 21"],
    [6, "M12 10v6"],
    [6, "M9 13h6"],
  ],
  "alarm-smoke": [
    [6, "M11 21c0-2.5 2-2.5 2-5"],
    [6, "M16 21c0-2.5 2-2.5 2-5"],
    [6, "m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8"],
    [6, "M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z"],
    [6, "M6 21c0-2.5 2-2.5 2-5"],
  ],
  album: [
    [5, 3, 3, 18, 18, 2, 2],
    [2, "11 3 11 11 14 8 17 11 17 3"],
  ],
  "alert-circle": [
    [1, 12, 12, 10],
    [0, 12, 8, 12, 12],
    [0, 12, 16, 12.01, 16],
  ],
  "alert-octagon": [
    [6, "M12 16h.01"],
    [6, "M12 8v4"],
    [
      6,
      "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
    ],
  ],
  "alert-triangle": [
    [6, "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"],
    [6, "M12 9v4"],
    [6, "M12 17h.01"],
  ],
  "align-center": [
    [0, 21, 6, 3, 6],
    [0, 17, 12, 7, 12],
    [0, 19, 18, 5, 18],
  ],
  "align-center-horizontal": [
    [6, "M2 12h20"],
    [6, "M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"],
    [6, "M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"],
    [6, "M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"],
    [6, "M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1"],
  ],
  "align-center-vertical": [
    [6, "M12 2v20"],
    [6, "M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4"],
    [6, "M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"],
    [6, "M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1"],
    [6, "M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1"],
  ],
  "align-end-horizontal": [
    [5, 4, 2, 6, 16, 2],
    [5, 14, 9, 6, 9, 2],
    [6, "M22 22H2"],
  ],
  "align-end-vertical": [
    [5, 2, 4, 16, 6, 2],
    [5, 9, 14, 9, 6, 2],
    [6, "M22 22V2"],
  ],
  "align-horizontal-distribute-center": [
    [5, 4, 5, 6, 14, 2],
    [5, 14, 7, 6, 10, 2],
    [6, "M17 22v-5"],
    [6, "M17 7V2"],
    [6, "M7 22v-3"],
    [6, "M7 5V2"],
  ],
  "align-horizontal-distribute-end": [
    [5, 4, 5, 6, 14, 2],
    [5, 14, 7, 6, 10, 2],
    [6, "M10 2v20"],
    [6, "M20 2v20"],
  ],
  "align-horizontal-distribute-start": [
    [5, 4, 5, 6, 14, 2],
    [5, 14, 7, 6, 10, 2],
    [6, "M4 2v20"],
    [6, "M14 2v20"],
  ],
  "align-horizontal-justify-center": [
    [5, 2, 5, 6, 14, 2],
    [5, 16, 7, 6, 10, 2],
    [6, "M12 2v20"],
  ],
  "align-horizontal-justify-end": [
    [5, 2, 5, 6, 14, 2],
    [5, 12, 7, 6, 10, 2],
    [6, "M22 2v20"],
  ],
  "align-horizontal-justify-start": [
    [5, 6, 5, 6, 14, 2],
    [5, 16, 7, 6, 10, 2],
    [6, "M2 2v20"],
  ],
  "align-horizontal-space-around": [
    [5, 9, 7, 6, 10, 2],
    [6, "M4 22V2"],
    [6, "M20 22V2"],
  ],
  "align-horizontal-space-between": [
    [5, 3, 5, 6, 14, 2],
    [5, 15, 7, 6, 10, 2],
    [6, "M3 2v20"],
    [6, "M21 2v20"],
  ],
  "align-justify": [
    [0, 3, 6, 21, 6],
    [0, 3, 12, 21, 12],
    [0, 3, 18, 21, 18],
  ],
  "align-left": [
    [0, 21, 6, 3, 6],
    [0, 15, 12, 3, 12],
    [0, 17, 18, 3, 18],
  ],
  "align-right": [
    [0, 21, 6, 3, 6],
    [0, 21, 12, 9, 12],
    [0, 21, 18, 7, 18],
  ],
  "align-start-horizontal": [
    [5, 4, 6, 6, 16, 2],
    [5, 14, 6, 6, 9, 2],
    [6, "M22 2H2"],
  ],
  "align-start-vertical": [
    [5, 6, 14, 9, 6, 2],
    [5, 6, 4, 16, 6, 2],
    [6, "M2 2v20"],
  ],
  "align-vertical-distribute-center": [
    [6, "M22 17h-3"],
    [6, "M22 7h-5"],
    [6, "M5 17H2"],
    [6, "M7 7H2"],
    [5, 5, 14, 14, 6, 2],
    [5, 7, 4, 10, 6, 2],
  ],
  "align-vertical-distribute-end": [
    [5, 5, 14, 14, 6, 2],
    [5, 7, 4, 10, 6, 2],
    [6, "M2 20h20"],
    [6, "M2 10h20"],
  ],
  "align-vertical-distribute-start": [
    [5, 5, 14, 14, 6, 2],
    [5, 7, 4, 10, 6, 2],
    [6, "M2 14h20"],
    [6, "M2 4h20"],
  ],
  "align-vertical-justify-center": [
    [5, 5, 16, 14, 6, 2],
    [5, 7, 2, 10, 6, 2],
    [6, "M2 12h20"],
  ],
  "align-vertical-justify-end": [
    [5, 5, 12, 14, 6, 2],
    [5, 7, 2, 10, 6, 2],
    [6, "M2 22h20"],
  ],
  "align-vertical-justify-start": [
    [5, 5, 16, 14, 6, 2],
    [5, 7, 6, 10, 6, 2],
    [6, "M2 2h20"],
  ],
  "align-vertical-space-around": [
    [5, 7, 9, 10, 6, 2],
    [6, "M22 20H2"],
    [6, "M22 4H2"],
  ],
  "align-vertical-space-between": [
    [5, 5, 15, 14, 6, 2],
    [5, 7, 3, 10, 6, 2],
    [6, "M2 21h20"],
    [6, "M2 3h20"],
  ],
  ambulance: [
    [6, "M10 10H6"],
    [6, "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"],
    [
      6,
      "M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14",
    ],
    [6, "M8 8v4"],
    [6, "M9 18h6"],
    [1, 17, 18, 2],
    [1, 7, 18, 2],
  ],
  ampersand: [
    [6, "M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13"],
    [6, "M16 12h3"],
  ],
  ampersands: [
    [6, "M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5"],
    [6, "M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5"],
  ],
  amphora: [
    [6, "M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8"],
    [6, "M10 5H8a2 2 0 0 0 0 4h.68"],
    [6, "M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8"],
    [6, "M14 5h2a2 2 0 0 1 0 4h-.68"],
    [6, "M18 22H6"],
    [6, "M9 2h6"],
  ],
  anchor: [
    [6, "M12 22V8"],
    [6, "M5 12H2a10 10 0 0 0 20 0h-3"],
    [1, 12, 5, 3],
  ],
  angry: [
    [1, 12, 12, 10],
    [6, "M16 16s-1.5-2-4-2-4 2-4 2"],
    [6, "M7.5 8 10 9"],
    [6, "m14 9 2.5-1"],
    [6, "M9 10h.01"],
    [6, "M15 10h.01"],
  ],
  annoyed: [
    [1, 12, 12, 10],
    [6, "M8 15h8"],
    [6, "M8 9h2"],
    [6, "M14 9h2"],
  ],
  antenna: [
    [6, "M2 12 7 2"],
    [6, "m7 12 5-10"],
    [6, "m12 12 5-10"],
    [6, "m17 12 5-10"],
    [6, "M4.5 7h15"],
    [6, "M12 16v6"],
  ],
  anvil: [
    [6, "M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4"],
    [6, "M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z"],
    [6, "M9 12v5"],
    [6, "M15 12v5"],
    [6, "M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1"],
  ],
  aperture: [
    [1, 12, 12, 10],
    [6, "m14.31 8 5.74 9.94"],
    [6, "M9.69 8h11.48"],
    [6, "m7.38 12 5.74-9.94"],
    [6, "M9.69 16 3.95 6.06"],
    [6, "M14.31 16H2.83"],
    [6, "m16.62 12-5.74 9.94"],
  ],
  "app-window": [
    [5, 2, 4, 20, 16, 2],
    [6, "M10 4v4"],
    [6, "M2 8h20"],
    [6, "M6 4v4"],
  ],
  "app-window-mac": [
    [5, 2, 4, 20, 16, 2],
    [6, "M6 8h.01"],
    [6, "M10 8h.01"],
    [6, "M14 8h.01"],
  ],
  apple: [
    [
      6,
      "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",
    ],
    [6, "M10 2c1 .5 2 2 2 5"],
  ],
  archive: [
    [5, 2, 3, 20, 5, 1],
    [6, "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"],
    [6, "M10 12h4"],
  ],
  "archive-restore": [
    [5, 2, 3, 20, 5, 1],
    [6, "M4 8v11a2 2 0 0 0 2 2h2"],
    [6, "M20 8v11a2 2 0 0 1-2 2h-2"],
    [6, "m9 15 3-3 3 3"],
    [6, "M12 12v9"],
  ],
  "archive-x": [
    [5, 2, 3, 20, 5, 1],
    [6, "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"],
    [6, "m9.5 17 5-5"],
    [6, "m9.5 12 5 5"],
  ],
  "area-chart": [
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [
      6,
      "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z",
    ],
  ],
  armchair: [
    [6, "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"],
    [
      6,
      "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
    ],
    [6, "M5 18v2"],
    [6, "M19 18v2"],
  ],
  "arrow-big-down": [[6, "M15 6v6h4l-7 7-7-7h4V6h6z"]],
  "arrow-big-down-dash": [
    [6, "M15 5H9"],
    [6, "M15 9v3h4l-7 7-7-7h4V9z"],
  ],
  "arrow-big-left": [[6, "M18 15h-6v4l-7-7 7-7v4h6v6z"]],
  "arrow-big-left-dash": [
    [6, "M19 15V9"],
    [6, "M15 15h-3v4l-7-7 7-7v4h3v6z"],
  ],
  "arrow-big-right": [[6, "M6 9h6V5l7 7-7 7v-4H6V9z"]],
  "arrow-big-right-dash": [
    [6, "M5 9v6"],
    [6, "M9 9h3V5l7 7-7 7v-4H9V9z"],
  ],
  "arrow-big-up": [[6, "M9 18v-6H5l7-7 7 7h-4v6H9z"]],
  "arrow-big-up-dash": [
    [6, "M9 19h6"],
    [6, "M9 15v-3H5l7-7 7 7h-4v3H9z"],
  ],
  "arrow-down": [
    [6, "M12 5v14"],
    [6, "m19 12-7 7-7-7"],
  ],
  "arrow-down-01": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [5, 15, 4, 4, 6, 0, 2],
    [6, "M17 20v-6h-2"],
    [6, "M15 20h4"],
  ],
  "arrow-down-10": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [6, "M17 10V4h-2"],
    [6, "M15 10h4"],
    [5, 15, 14, 4, 6, 0, 2],
  ],
  "arrow-down-az": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [6, "M20 8h-5"],
    [6, "M15 10V6.5a2.5 2.5 0 0 1 5 0V10"],
    [6, "M15 14h5l-5 6h5"],
  ],
  "arrow-down-circle": [
    [1, 12, 12, 10],
    [6, "M12 8v8"],
    [6, "m8 12 4 4 4-4"],
  ],
  "arrow-down-from-line": [
    [6, "M19 3H5"],
    [6, "M12 21V7"],
    [6, "m6 15 6 6 6-6"],
  ],
  "arrow-down-left": [
    [6, "M17 7 7 17"],
    [6, "M17 17H7V7"],
  ],
  "arrow-down-left-from-circle": [
    [6, "M2 12a10 10 0 1 1 10 10"],
    [6, "m2 22 10-10"],
    [6, "M8 22H2v-6"],
  ],
  "arrow-down-left-from-square": [
    [6, "M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"],
    [6, "m3 21 9-9"],
    [6, "M9 21H3v-6"],
  ],
  "arrow-down-left-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "m16 8-8 8"],
    [6, "M16 16H8V8"],
  ],
  "arrow-down-narrow-wide": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [6, "M11 4h4"],
    [6, "M11 8h7"],
    [6, "M11 12h10"],
  ],
  "arrow-down-right": [
    [6, "m7 7 10 10"],
    [6, "M17 7v10H7"],
  ],
  "arrow-down-right-from-circle": [
    [6, "M12 22a10 10 0 1 1 10-10"],
    [6, "M22 22 12 12"],
    [6, "M22 16v6h-6"],
  ],
  "arrow-down-right-from-square": [
    [6, "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"],
    [6, "m21 21-9-9"],
    [6, "M21 15v6h-6"],
  ],
  "arrow-down-right-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "m8 8 8 8"],
    [6, "M16 8v8H8"],
  ],
  "arrow-down-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M12 8v8"],
    [6, "m8 12 4 4 4-4"],
  ],
  "arrow-down-to-dot": [
    [6, "M12 2v14"],
    [6, "m19 9-7 7-7-7"],
    [1, 12, 21, 1],
  ],
  "arrow-down-to-line": [
    [6, "M12 17V3"],
    [6, "m6 11 6 6 6-6"],
    [6, "M19 21H5"],
  ],
  "arrow-down-up": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [6, "m21 8-4-4-4 4"],
    [6, "M17 4v16"],
  ],
  "arrow-down-wide-narrow": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 20V4"],
    [6, "M11 4h10"],
    [6, "M11 8h7"],
    [6, "M11 12h4"],
  ],
  "arrow-down-za": [
    [6, "m3 16 4 4 4-4"],
    [6, "M7 4v16"],
    [6, "M15 4h5l-5 6h5"],
    [6, "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20"],
    [6, "M20 18h-5"],
  ],
  "arrow-left": [
    [6, "m12 19-7-7 7-7"],
    [6, "M19 12H5"],
  ],
  "arrow-left-circle": [
    [1, 12, 12, 10],
    [6, "M16 12H8"],
    [6, "m12 8-4 4 4 4"],
  ],
  "arrow-left-from-line": [
    [6, "m9 6-6 6 6 6"],
    [6, "M3 12h14"],
    [6, "M21 19V5"],
  ],
  "arrow-left-right": [
    [6, "M8 3 4 7l4 4"],
    [6, "M4 7h16"],
    [6, "m16 21 4-4-4-4"],
    [6, "M20 17H4"],
  ],
  "arrow-left-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "m12 8-4 4 4 4"],
    [6, "M16 12H8"],
  ],
  "arrow-left-to-line": [
    [6, "M3 19V5"],
    [6, "m13 6-6 6 6 6"],
    [6, "M7 12h14"],
  ],
  "arrow-right": [
    [6, "M5 12h14"],
    [6, "m12 5 7 7-7 7"],
  ],
  "arrow-right-circle": [
    [1, 12, 12, 10],
    [6, "M8 12h8"],
    [6, "m12 16 4-4-4-4"],
  ],
  "arrow-right-from-line": [
    [6, "M3 5v14"],
    [6, "M21 12H7"],
    [6, "m15 18 6-6-6-6"],
  ],
  "arrow-right-left": [
    [6, "m16 3 4 4-4 4"],
    [6, "M20 7H4"],
    [6, "m8 21-4-4 4-4"],
    [6, "M4 17h16"],
  ],
  "arrow-right-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M8 12h8"],
    [6, "m12 16 4-4-4-4"],
  ],
  "arrow-right-to-line": [
    [6, "M17 12H3"],
    [6, "m11 18 6-6-6-6"],
    [6, "M21 5v14"],
  ],
  "arrow-up": [
    [6, "m5 12 7-7 7 7"],
    [6, "M12 19V5"],
  ],
  "arrow-up-01": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [5, 15, 4, 4, 6, 0, 2],
    [6, "M17 20v-6h-2"],
    [6, "M15 20h4"],
  ],
  "arrow-up-10": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [6, "M17 10V4h-2"],
    [6, "M15 10h4"],
    [5, 15, 14, 4, 6, 0, 2],
  ],
  "arrow-up-az": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [6, "M20 8h-5"],
    [6, "M15 10V6.5a2.5 2.5 0 0 1 5 0V10"],
    [6, "M15 14h5l-5 6h5"],
  ],
  "arrow-up-circle": [
    [1, 12, 12, 10],
    [6, "m16 12-4-4-4 4"],
    [6, "M12 16V8"],
  ],
  "arrow-up-down": [
    [6, "m21 16-4 4-4-4"],
    [6, "M17 20V4"],
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
  ],
  "arrow-up-from-dot": [
    [6, "m5 9 7-7 7 7"],
    [6, "M12 16V2"],
    [1, 12, 21, 1],
  ],
  "arrow-up-from-line": [
    [6, "m18 9-6-6-6 6"],
    [6, "M12 3v14"],
    [6, "M5 21h14"],
  ],
  "arrow-up-left": [
    [6, "M7 17V7h10"],
    [6, "M17 17 7 7"],
  ],
  "arrow-up-left-from-circle": [
    [6, "M2 8V2h6"],
    [6, "m2 2 10 10"],
    [6, "M12 2A10 10 0 1 1 2 12"],
  ],
  "arrow-up-left-from-square": [
    [6, "M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"],
    [6, "m3 3 9 9"],
    [6, "M3 9V3h6"],
  ],
  "arrow-up-left-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M8 16V8h8"],
    [6, "M16 16 8 8"],
  ],
  "arrow-up-narrow-wide": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [6, "M11 12h4"],
    [6, "M11 16h7"],
    [6, "M11 20h10"],
  ],
  "arrow-up-right": [
    [6, "M7 7h10v10"],
    [6, "M7 17 17 7"],
  ],
  "arrow-up-right-from-circle": [
    [6, "M22 12A10 10 0 1 1 12 2"],
    [6, "M22 2 12 12"],
    [6, "M16 2h6v6"],
  ],
  "arrow-up-right-from-square": [
    [6, "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"],
    [6, "m21 3-9 9"],
    [6, "M15 3h6v6"],
  ],
  "arrow-up-right-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M8 8h8v8"],
    [6, "m8 16 8-8"],
  ],
  "arrow-up-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "m16 12-4-4-4 4"],
    [6, "M12 16V8"],
  ],
  "arrow-up-to-line": [
    [6, "M5 3h14"],
    [6, "m18 13-6-6-6 6"],
    [6, "M12 7v14"],
  ],
  "arrow-up-wide-narrow": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [6, "M11 12h10"],
    [6, "M11 16h7"],
    [6, "M11 20h4"],
  ],
  "arrow-up-za": [
    [6, "m3 8 4-4 4 4"],
    [6, "M7 4v16"],
    [6, "M15 4h5l-5 6h5"],
    [6, "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20"],
    [6, "M20 18h-5"],
  ],
  "arrows-up-from-line": [
    [6, "m4 6 3-3 3 3"],
    [6, "M7 17V3"],
    [6, "m14 6 3-3 3 3"],
    [6, "M17 17V3"],
    [6, "M4 21h16"],
  ],
  asterisk: [
    [6, "M12 6v12"],
    [6, "M17.196 9 6.804 15"],
    [6, "m6.804 9 10.392 6"],
  ],
  "asterisk-square": [
    [5, 3, 3, 18, 18, 2],
    [6, "M12 8v8"],
    [6, "m8.5 14 7-4"],
    [6, "m8.5 10 7 4"],
  ],
  "at-sign": [
    [1, 12, 12, 4],
    [6, "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"],
  ],
  atom: [
    [1, 12, 12, 1],
    [
      6,
      "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
    ],
    [
      6,
      "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
    ],
  ],
  "audio-lines": [
    [6, "M2 10v3"],
    [6, "M6 6v11"],
    [6, "M10 3v18"],
    [6, "M14 8v7"],
    [6, "M18 5v13"],
    [6, "M22 10v3"],
  ],
  "audio-waveform": [
    [6, "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"],
  ],
  award: [
    [
      6,
      "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
    ],
    [1, 12, 8, 6],
  ],
  axe: [
    [6, "m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"],
    [6, "M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z"],
  ],
  "axis-3d": [
    [6, "M4 4v16h16"],
    [6, "m4 20 7-7"],
  ],
  baby: [
    [6, "M9 12h.01"],
    [6, "M15 12h.01"],
    [6, "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"],
    [
      6,
      "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",
    ],
  ],
  backpack: [
    [6, "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"],
    [6, "M8 10h8"],
    [6, "M8 18h8"],
    [6, "M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"],
    [6, "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"],
  ],
  badge: [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
  ],
  "badge-alert": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [0, 12, 8, 12, 12],
    [0, 12, 16, 12.01, 16],
  ],
  "badge-cent": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M12 7v10"],
    [6, "M15.4 10a4 4 0 1 0 0 4"],
  ],
  "badge-check": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "m9 12 2 2 4-4"],
  ],
  "badge-dollar-sign": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"],
    [6, "M12 18V6"],
  ],
  "badge-euro": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M7 12h5"],
    [6, "M15 9.4a4 4 0 1 0 0 5.2"],
  ],
  "badge-help": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"],
    [0, 12, 17, 12.01, 17],
  ],
  "badge-indian-rupee": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M8 8h8"],
    [6, "M8 12h8"],
    [6, "m13 17-5-1h1a4 4 0 0 0 0-8"],
  ],
  "badge-info": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [0, 12, 16, 12, 12],
    [0, 12, 8, 12.01, 8],
  ],
  "badge-japanese-yen": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "m9 8 3 3v7"],
    [6, "m12 11 3-3"],
    [6, "M9 12h6"],
    [6, "M9 16h6"],
  ],
  "badge-minus": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [0, 8, 12, 16, 12],
  ],
  "badge-percent": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "m15 9-6 6"],
    [6, "M9 9h.01"],
    [6, "M15 15h.01"],
  ],
  "badge-plus": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [0, 12, 8, 12, 16],
    [0, 8, 12, 16, 12],
  ],
  "badge-pound-sterling": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M8 12h4"],
    [6, "M10 16V9.5a2.5 2.5 0 0 1 5 0"],
    [6, "M8 16h7"],
  ],
  "badge-russian-ruble": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M9 16h5"],
    [6, "M9 12h5a2 2 0 1 0 0-4h-3v9"],
  ],
  "badge-swiss-franc": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [6, "M11 17V8h4"],
    [6, "M11 12h3"],
    [6, "M9 16h4"],
  ],
  "badge-x": [
    [
      6,
      "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
    ],
    [0, 15, 9, 9, 15],
    [0, 9, 9, 15, 15],
  ],
  "baggage-claim": [
    [6, "M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2"],
    [6, "M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10"],
    [5, 8, 6, 13, 8, 1],
    [1, 18, 20, 2],
    [1, 9, 20, 2],
  ],
  ban: [
    [1, 12, 12, 10],
    [6, "m4.9 4.9 14.2 14.2"],
  ],
  banana: [
    [6, "M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5"],
    [
      6,
      "M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z",
    ],
  ],
  bandage: [
    [6, "M10 10.01h.01"],
    [6, "M10 14.01h.01"],
    [6, "M14 10.01h.01"],
    [6, "M14 14.01h.01"],
    [6, "M18 6v11.5"],
    [6, "M6 6v12"],
    [5, 2, 6, 20, 12, 2],
  ],
  banknote: [
    [5, 2, 6, 20, 12, 2],
    [1, 12, 12, 2],
    [6, "M6 12h.01M18 12h.01"],
  ],
  "bar-chart": [
    [0, 12, 20, 12, 10],
    [0, 18, 20, 18, 4],
    [0, 6, 20, 6, 16],
  ],
  "bar-chart-2": [
    [0, 18, 20, 18, 10],
    [0, 12, 20, 12, 4],
    [0, 6, 20, 6, 14],
  ],
  "bar-chart-3": [
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [6, "M18 17V9"],
    [6, "M13 17V5"],
    [6, "M8 17v-3"],
  ],
  "bar-chart-4": [
    [6, "M13 17V9"],
    [6, "M18 17V5"],
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [6, "M8 17v-3"],
  ],
  "bar-chart-big": [
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [5, 15, 5, 4, 12, 1],
    [5, 7, 8, 4, 9, 1],
  ],
  "bar-chart-horizontal": [
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [6, "M7 16h8"],
    [6, "M7 11h12"],
    [6, "M7 6h3"],
  ],
  "bar-chart-horizontal-big": [
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
    [5, 7, 13, 9, 4, 1],
    [5, 7, 5, 12, 4, 1],
  ],
  barcode: [
    [6, "M3 5v14"],
    [6, "M8 5v14"],
    [6, "M12 5v14"],
    [6, "M17 5v14"],
    [6, "M21 5v14"],
  ],
  baseline: [
    [6, "M4 20h16"],
    [6, "m6 16 6-12 6 12"],
    [6, "M8 12h8"],
  ],
  bath: [
    [6, "M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"],
    [0, 10, 5, 8, 7],
    [0, 2, 12, 22, 12],
    [0, 7, 19, 7, 21],
    [0, 17, 19, 17, 21],
  ],
  battery: [
    [5, 2, 7, 16, 10, 2, 2],
    [0, 22, 11, 22, 13],
  ],
  "battery-charging": [
    [6, "M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"],
    [6, "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"],
    [6, "m11 7-3 5h4l-3 5"],
    [0, 22, 11, 22, 13],
  ],
  "battery-full": [
    [5, 2, 7, 16, 10, 2, 2],
    [0, 22, 11, 22, 13],
    [0, 6, 11, 6, 13],
    [0, 10, 11, 10, 13],
    [0, 14, 11, 14, 13],
  ],
  "battery-low": [
    [5, 2, 7, 16, 10, 2, 2],
    [0, 22, 11, 22, 13],
    [0, 6, 11, 6, 13],
  ],
  "battery-medium": [
    [5, 2, 7, 16, 10, 2, 2],
    [0, 22, 11, 22, 13],
    [0, 6, 11, 6, 13],
    [0, 10, 11, 10, 13],
  ],
  "battery-warning": [
    [6, "M10 17h.01"],
    [6, "M10 7v6"],
    [6, "M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"],
    [6, "M22 11v2"],
    [6, "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"],
  ],
  beaker: [
    [6, "M4.5 3h15"],
    [6, "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"],
    [6, "M6 14h12"],
  ],
  bean: [
    [
      6,
      "M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z",
    ],
    [6, "M5.341 10.62a4 4 0 1 0 5.279-5.28"],
  ],
  "bean-off": [
    [6, "M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1"],
    [6, "M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66"],
    [6, "M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04"],
    [0, 2, 2, 22, 22],
  ],
  bed: [
    [6, "M2 4v16"],
    [6, "M2 8h18a2 2 0 0 1 2 2v10"],
    [6, "M2 17h20"],
    [6, "M6 8v9"],
  ],
  "bed-double": [
    [6, "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"],
    [6, "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"],
    [6, "M12 4v6"],
    [6, "M2 18h20"],
  ],
  "bed-single": [
    [6, "M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"],
    [6, "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"],
    [6, "M3 18h18"],
  ],
  beef: [
    [1, 12.5, 8.5, 2.5],
    [
      6,
      "M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z",
    ],
    [
      6,
      "m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5",
    ],
  ],
  beer: [
    [6, "M17 11h1a3 3 0 0 1 0 6h-1"],
    [6, "M9 12v6"],
    [6, "M13 12v6"],
    [
      6,
      "M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z",
    ],
    [6, "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"],
  ],
  "beer-off": [
    [6, "M13 13v5"],
    [6, "M17 11.47V8"],
    [6, "M17 11h1a3 3 0 0 1 2.745 4.211"],
    [6, "m2 2 20 20"],
    [6, "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3"],
    [6, "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268"],
    [
      6,
      "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12",
    ],
    [6, "M9 14.6V18"],
  ],
  bell: [
    [6, "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
  ],
  "bell-dot": [
    [6, "M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
    [1, 18, 8, 3],
  ],
  "bell-electric": [
    [6, "M18.8 4A6.3 8.7 0 0 1 20 9"],
    [6, "M9 9h.01"],
    [1, 9, 9, 7],
    [5, 4, 16, 10, 6, 2],
    [6, "M14 19c3 0 4.6-1.6 4.6-1.6"],
    [1, 20, 16, 2],
  ],
  "bell-minus": [
    [6, "M18.4 12c.8 3.8 2.6 5 2.6 5H3s3-2 3-9c0-3.3 2.7-6 6-6 1.8 0 3.4.8 4.5 2"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
    [6, "M15 8h6"],
  ],
  "bell-off": [
    [6, "M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"],
    [6, "M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
    [6, "m2 2 20 20"],
  ],
  "bell-plus": [
    [6, "M19.3 14.8C20.1 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 1 0 1.9.2 2.8.7"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
    [6, "M15 8h6"],
    [6, "M18 5v6"],
  ],
  "bell-ring": [
    [6, "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"],
    [6, "M10.3 21a1.94 1.94 0 0 0 3.4 0"],
    [6, "M4 2C2.8 3.7 2 5.7 2 8"],
    [6, "M22 8c0-2.3-.8-4.3-2-6"],
  ],
  "between-horizonal-end": [
    [5, 3, 3, 13, 7, 1],
    [6, "m22 15-3-3 3-3"],
    [5, 3, 14, 13, 7, 1],
  ],
  "between-horizonal-start": [
    [5, 8, 3, 13, 7, 1],
    [6, "m2 9 3 3-3 3"],
    [5, 8, 14, 13, 7, 1],
  ],
  "between-horizontal-end": [
    [5, 3, 3, 13, 7, 1],
    [6, "m22 15-3-3 3-3"],
    [5, 3, 14, 13, 7, 1],
  ],
  "between-horizontal-start": [
    [5, 8, 3, 13, 7, 1],
    [6, "m2 9 3 3-3 3"],
    [5, 8, 14, 13, 7, 1],
  ],
  "between-vertical-end": [
    [5, 3, 3, 7, 13, 1],
    [6, "m9 22 3-3 3 3"],
    [5, 14, 3, 7, 13, 1],
  ],
  "between-vertical-start": [
    [5, 3, 8, 7, 13, 1],
    [6, "m15 2-3 3-3-3"],
    [5, 14, 8, 7, 13, 1],
  ],
  "biceps-flexed": [
    [
      6,
      "M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1",
    ],
    [6, "M15 14a5 5 0 0 0-7.584 2"],
    [6, "M9.964 6.825C8.019 7.977 9.5 13 8 15"],
  ],
  bike: [
    [1, 18.5, 17.5, 3.5],
    [1, 5.5, 17.5, 3.5],
    [1, 15, 5, 1],
    [6, "M12 17.5V14l-3-3 4-3 2 3h2"],
  ],
  binary: [
    [5, 14, 14, 4, 6, 2],
    [5, 6, 4, 4, 6, 2],
    [6, "M6 20h4"],
    [6, "M14 10h4"],
    [6, "M6 14h2v6"],
    [6, "M14 4h2v6"],
  ],
  binoculars: [
    [6, "M10 10h4"],
    [6, "M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3"],
    [6, "M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z"],
    [6, "M 22 16 L 2 16"],
    [6, "M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z"],
    [6, "M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3"],
  ],
  biohazard: [
    [1, 12, 11.9, 2],
    [6, "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6"],
    [6, "m8.9 10.1 1.4.8"],
    [6, "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5"],
    [6, "m15.1 10.1-1.4.8"],
    [6, "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2"],
    [6, "M12 13.9v1.6"],
    [6, "M13.5 5.4c-1-.2-2-.2-3 0"],
    [6, "M17 16.4c.7-.7 1.2-1.6 1.5-2.5"],
    [6, "M5.5 13.9c.3.9.8 1.8 1.5 2.5"],
  ],
  bird: [
    [6, "M16 7h.01"],
    [6, "M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"],
    [6, "m20 7 2 .5-2 .5"],
    [6, "M10 18v3"],
    [6, "M14 17.75V21"],
    [6, "M7 18a6 6 0 0 0 3.84-10.61"],
  ],
  bitcoin: [
    [
      6,
      "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
    ],
  ],
  blend: [
    [1, 9, 9, 7],
    [1, 15, 15, 7],
  ],
  blinds: [
    [6, "M3 3h18"],
    [6, "M20 7H8"],
    [6, "M20 11H8"],
    [6, "M10 19h10"],
    [6, "M8 15h12"],
    [6, "M4 3v14"],
    [1, 4, 19, 2],
  ],
  blocks: [
    [5, 14, 3, 7, 7, 1],
    [6, "M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"],
  ],
  bluetooth: [[6, "m7 7 10 10-5 5V2l5 5L7 17"]],
  "bluetooth-connected": [
    [6, "m7 7 10 10-5 5V2l5 5L7 17"],
    [0, 18, 12, 21, 12],
    [0, 3, 12, 6, 12],
  ],
  "bluetooth-off": [
    [6, "m17 17-5 5V12l-5 5"],
    [6, "m2 2 20 20"],
    [6, "M14.5 9.5 17 7l-5-5v4.5"],
  ],
  "bluetooth-searching": [
    [6, "m7 7 10 10-5 5V2l5 5L7 17"],
    [6, "M20.83 14.83a4 4 0 0 0 0-5.66"],
    [6, "M18 12h.01"],
  ],
  bold: [[6, "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"]],
  bolt: [
    [
      6,
      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    ],
    [1, 12, 12, 4],
  ],
  bomb: [
    [1, 11, 13, 9],
    [6, "M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95"],
    [6, "m22 2-1.5 1.5"],
  ],
  bone: [
    [
      6,
      "M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z",
    ],
  ],
  book: [[6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"]],
  "book-a": [
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "m8 13 4-7 4 7"],
    [6, "M9.1 11h5.7"],
  ],
  "book-audio": [
    [6, "M12 6v7"],
    [6, "M16 8v3"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M8 8v3"],
  ],
  "book-check": [
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "m9 9.5 2 2 4-4"],
  ],
  "book-copy": [
    [6, "M2 16V4a2 2 0 0 1 2-2h11"],
    [6, "M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12"],
    [6, "M5 14H4a2 2 0 1 0 0 4h1"],
  ],
  "book-dashed": [
    [6, "M12 17h2"],
    [6, "M12 22h2"],
    [6, "M12 2h2"],
    [6, "M18 22h1a1 1 0 0 0 1-1"],
    [6, "M18 2h1a1 1 0 0 1 1 1v1"],
    [6, "M20 15v2h-2"],
    [6, "M20 8v3"],
    [6, "M4 11V9"],
    [6, "M4 19.5V15"],
    [6, "M4 5v-.5A2.5 2.5 0 0 1 6.5 2H8"],
    [6, "M8 22H6.5a1 1 0 0 1 0-5H8"],
  ],
  "book-down": [
    [6, "M12 13V7"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "m9 10 3 3 3-3"],
  ],
  "book-headphones": [
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M8 12v-2a4 4 0 0 1 8 0v2"],
    [1, 15, 12, 1],
    [1, 9, 12, 1],
  ],
  "book-heart": [
    [
      6,
      "M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7",
    ],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
  ],
  "book-image": [
    [6, "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [1, 10, 8, 2],
  ],
  "book-key": [
    [6, "m19 3 1 1"],
    [6, "m20 2-4.5 4.5"],
    [6, "M20 8v13a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14"],
    [1, 14, 8, 2],
  ],
  "book-lock": [
    [6, "M18 6V4a2 2 0 1 0-4 0v2"],
    [6, "M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10"],
    [5, 12, 6, 8, 5, 1],
  ],
  "book-marked": [
    [6, "M10 2v8l3-3 3 3V2"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
  ],
  "book-minus": [
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M9 10h6"],
  ],
  "book-open": [
    [6, "M12 7v14"],
    [
      6,
      "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
    ],
  ],
  "book-open-check": [
    [6, "M12 21V7"],
    [6, "m16 12 2 2 4-4"],
    [
      6,
      "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
    ],
  ],
  "book-open-text": [
    [6, "M12 7v14"],
    [6, "M16 12h2"],
    [6, "M16 8h2"],
    [
      6,
      "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
    ],
    [6, "M6 12h2"],
    [6, "M6 8h2"],
  ],
  "book-plus": [
    [6, "M12 7v6"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M9 10h6"],
  ],
  "book-template": [
    [6, "M12 17h2"],
    [6, "M12 22h2"],
    [6, "M12 2h2"],
    [6, "M18 22h1a1 1 0 0 0 1-1"],
    [6, "M18 2h1a1 1 0 0 1 1 1v1"],
    [6, "M20 15v2h-2"],
    [6, "M20 8v3"],
    [6, "M4 11V9"],
    [6, "M4 19.5V15"],
    [6, "M4 5v-.5A2.5 2.5 0 0 1 6.5 2H8"],
    [6, "M8 22H6.5a1 1 0 0 1 0-5H8"],
  ],
  "book-text": [
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M8 11h8"],
    [6, "M8 7h6"],
  ],
  "book-type": [
    [6, "M10 13h4"],
    [6, "M12 6v7"],
    [6, "M16 8V6H8v2"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
  ],
  "book-up": [
    [6, "M12 13V7"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "m9 10 3-3 3 3"],
  ],
  "book-up-2": [
    [6, "M12 13V7"],
    [6, "M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2"],
    [6, "m9 10 3-3 3 3"],
    [6, "m9 5 3-3 3 3"],
  ],
  "book-user": [
    [6, "M15 13a3 3 0 1 0-6 0"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [1, 12, 8, 2],
  ],
  "book-x": [
    [6, "m14.5 7-5 5"],
    [6, "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"],
    [6, "m9.5 7 5 5"],
  ],
  bookmark: [[6, "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"]],
  "bookmark-check": [
    [6, "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"],
    [6, "m9 10 2 2 4-4"],
  ],
  "bookmark-minus": [
    [6, "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
    [0, 15, 10, 9, 10],
  ],
  "bookmark-plus": [
    [6, "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
    [0, 12, 7, 12, 13],
    [0, 15, 10, 9, 10],
  ],
  "bookmark-x": [
    [6, "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"],
    [6, "m14.5 7.5-5 5"],
    [6, "m9.5 7.5 5 5"],
  ],
  "boom-box": [
    [6, "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"],
    [6, "M8 8v1"],
    [6, "M12 8v1"],
    [6, "M16 8v1"],
    [5, 2, 9, 20, 12, 2],
    [1, 8, 15, 2],
    [1, 16, 15, 2],
  ],
  bot: [
    [6, "M12 8V4H8"],
    [5, 4, 8, 16, 12, 2],
    [6, "M2 14h2"],
    [6, "M20 14h2"],
    [6, "M15 13v2"],
    [6, "M9 13v2"],
  ],
  "bot-message-square": [
    [6, "M12 6V2H8"],
    [6, "m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"],
    [6, "M2 12h2"],
    [6, "M9 11v2"],
    [6, "M15 11v2"],
    [6, "M20 12h2"],
  ],
  "bot-off": [
    [6, "M13.67 8H18a2 2 0 0 1 2 2v4.33"],
    [6, "M2 14h2"],
    [6, "M20 14h2"],
    [6, "M22 22 2 2"],
    [6, "M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586"],
    [6, "M9 13v2"],
    [6, "M9.67 4H12v2.33"],
  ],
  box: [
    [
      6,
      "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    ],
    [6, "m3.3 7 8.7 5 8.7-5"],
    [6, "M12 22V12"],
  ],
  "box-select": [
    [6, "M5 3a2 2 0 0 0-2 2"],
    [6, "M19 3a2 2 0 0 1 2 2"],
    [6, "M21 19a2 2 0 0 1-2 2"],
    [6, "M5 21a2 2 0 0 1-2-2"],
    [6, "M9 3h1"],
    [6, "M9 21h1"],
    [6, "M14 3h1"],
    [6, "M14 21h1"],
    [6, "M3 9v1"],
    [6, "M21 9v1"],
    [6, "M3 14v1"],
    [6, "M21 14v1"],
  ],
  boxes: [
    [6, "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"],
    [6, "m7 16.5-4.74-2.85"],
    [6, "m7 16.5 5-3"],
    [6, "M7 16.5v5.17"],
    [6, "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"],
    [6, "m17 16.5-5-3"],
    [6, "m17 16.5 4.74-2.85"],
    [6, "M17 16.5v5.17"],
    [6, "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"],
    [6, "M12 8 7.26 5.15"],
    [6, "m12 8 4.74-2.85"],
    [6, "M12 13.5V8"],
  ],
  braces: [
    [6, "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"],
    [6, "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"],
  ],
  brackets: [
    [6, "M16 3h3v18h-3"],
    [6, "M8 21H5V3h3"],
  ],
  brain: [
    [6, "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"],
    [6, "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"],
    [6, "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"],
    [6, "M17.599 6.5a3 3 0 0 0 .399-1.375"],
    [6, "M6.003 5.125A3 3 0 0 0 6.401 6.5"],
    [6, "M3.477 10.896a4 4 0 0 1 .585-.396"],
    [6, "M19.938 10.5a4 4 0 0 1 .585.396"],
    [6, "M6 18a4 4 0 0 1-1.967-.516"],
    [6, "M19.967 17.484A4 4 0 0 1 18 18"],
  ],
  "brain-circuit": [
    [6, "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"],
    [6, "M9 13a4.5 4.5 0 0 0 3-4"],
    [6, "M6.003 5.125A3 3 0 0 0 6.401 6.5"],
    [6, "M3.477 10.896a4 4 0 0 1 .585-.396"],
    [6, "M6 18a4 4 0 0 1-1.967-.516"],
    [6, "M12 13h4"],
    [6, "M12 18h6a2 2 0 0 1 2 2v1"],
    [6, "M12 8h8"],
    [6, "M16 8V5a2 2 0 0 1 2-2"],
    [1, 16, 13, 0.5],
    [1, 18, 3, 0.5],
    [1, 20, 21, 0.5],
    [1, 20, 8, 0.5],
  ],
  "brain-cog": [
    [
      6,
      "M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3.2 3.2 0 0 0 .164-.546c.028-.13.306-.13.335 0a3.2 3.2 0 0 0 .163.546 4 4 0 0 0 7.636-2.106 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5",
    ],
    [6, "M17.599 6.5a3 3 0 0 0 .399-1.375"],
    [6, "M6.003 5.125A3 3 0 0 0 6.401 6.5"],
    [6, "M3.477 10.896a4 4 0 0 1 .585-.396"],
    [6, "M19.938 10.5a4 4 0 0 1 .585.396"],
    [6, "M6 18a4 4 0 0 1-1.967-.516"],
    [6, "M19.967 17.484A4 4 0 0 1 18 18"],
    [1, 12, 12, 3],
    [6, "m15.7 10.4-.9.4"],
    [6, "m9.2 13.2-.9.4"],
    [6, "m13.6 15.7-.4-.9"],
    [6, "m10.8 9.2-.4-.9"],
    [6, "m15.7 13.5-.9-.4"],
    [6, "m9.2 10.9-.9-.4"],
    [6, "m10.5 15.7.4-.9"],
    [6, "m13.1 9.2.4-.9"],
  ],
  "brick-wall": [
    [5, 3, 3, 18, 18, 2],
    [6, "M12 9v6"],
    [6, "M16 15v6"],
    [6, "M16 3v6"],
    [6, "M3 15h18"],
    [6, "M3 9h18"],
    [6, "M8 15v6"],
    [6, "M8 3v6"],
  ],
  briefcase: [
    [6, "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"],
    [5, 2, 6, 20, 14, 2],
  ],
  "briefcase-business": [
    [6, "M12 12h.01"],
    [6, "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"],
    [6, "M22 13a18.15 18.15 0 0 1-20 0"],
    [5, 2, 6, 20, 14, 2],
  ],
  "briefcase-conveyor-belt": [
    [6, "M10 20v2"],
    [6, "M14 20v2"],
    [6, "M18 20v2"],
    [6, "M21 20H3"],
    [6, "M6 20v2"],
    [6, "M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"],
    [5, 4, 6, 16, 10, 2],
  ],
  "briefcase-medical": [
    [6, "M12 11v4"],
    [6, "M14 13h-4"],
    [6, "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"],
    [6, "M18 6v14"],
    [6, "M6 6v14"],
    [5, 2, 6, 20, 14, 2],
  ],
  "bring-to-front": [
    [5, 8, 8, 8, 8, 2],
    [6, "M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"],
    [6, "M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"],
  ],
  brush: [
    [6, "m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"],
    [
      6,
      "M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z",
    ],
  ],
  bug: [
    [6, "m8 2 1.88 1.88"],
    [6, "M14.12 3.88 16 2"],
    [6, "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"],
    [6, "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"],
    [6, "M12 20v-9"],
    [6, "M6.53 9C4.6 8.8 3 7.1 3 5"],
    [6, "M6 13H2"],
    [6, "M3 21c0-2.1 1.7-3.9 3.8-4"],
    [6, "M20.97 5c0 2.1-1.6 3.8-3.5 4"],
    [6, "M22 13h-4"],
    [6, "M17.2 17c2.1.1 3.8 1.9 3.8 4"],
  ],
  "bug-off": [
    [6, "M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2"],
    [6, "M14.12 3.88 16 2"],
    [6, "M22 13h-4v-2a4 4 0 0 0-4-4h-1.3"],
    [6, "M20.97 5c0 2.1-1.6 3.8-3.5 4"],
    [6, "m2 2 20 20"],
    [6, "M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13"],
    [6, "M12 20v-8"],
    [6, "M6 13H2"],
    [6, "M3 21c0-2.1 1.7-3.9 3.8-4"],
  ],
  "bug-play": [
    [6, "M12.765 21.522a.5.5 0 0 1-.765-.424v-8.196a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z"],
    [6, "M14.12 3.88 16 2"],
    [6, "M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5"],
    [6, "M20.97 5c0 2.1-1.6 3.8-3.5 4"],
    [6, "M3 21c0-2.1 1.7-3.9 3.8-4"],
    [6, "M6 13H2"],
    [6, "M6.53 9C4.6 8.8 3 7.1 3 5"],
    [6, "m8 2 1.88 1.88"],
    [6, "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"],
  ],
  building: [
    [5, 4, 2, 16, 20, 2, 2],
    [6, "M9 22v-4h6v4"],
    [6, "M8 6h.01"],
    [6, "M16 6h.01"],
    [6, "M12 6h.01"],
    [6, "M12 10h.01"],
    [6, "M12 14h.01"],
    [6, "M16 10h.01"],
    [6, "M16 14h.01"],
    [6, "M8 10h.01"],
    [6, "M8 14h.01"],
  ],
  "building-2": [
    [6, "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"],
    [6, "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"],
    [6, "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"],
    [6, "M10 6h4"],
    [6, "M10 10h4"],
    [6, "M10 14h4"],
    [6, "M10 18h4"],
  ],
  bus: [
    [6, "M8 6v6"],
    [6, "M15 6v6"],
    [6, "M2 12h19.6"],
    [6, "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"],
    [1, 7, 18, 2],
    [6, "M9 18h5"],
    [1, 16, 18, 2],
  ],
  "bus-front": [
    [6, "M4 6 2 7"],
    [6, "M10 6h4"],
    [6, "m22 7-2-1"],
    [5, 4, 3, 16, 16, 2],
    [6, "M4 11h16"],
    [6, "M8 15h.01"],
    [6, "M16 15h.01"],
    [6, "M6 19v2"],
    [6, "M18 21v-2"],
  ],
  cable: [
    [6, "M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"],
    [6, "M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"],
    [6, "M21 21v-2h-4"],
    [6, "M3 5h4V3"],
    [6, "M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"],
  ],
  "cable-car": [
    [6, "M10 3h.01"],
    [6, "M14 2h.01"],
    [6, "m2 9 20-5"],
    [6, "M12 12V6.5"],
    [5, 4, 12, 16, 10, 3],
    [6, "M9 12v5"],
    [6, "M15 12v5"],
    [6, "M4 17h16"],
  ],
  cake: [
    [6, "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"],
    [6, "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"],
    [6, "M2 21h20"],
    [6, "M7 8v3"],
    [6, "M12 8v3"],
    [6, "M17 8v3"],
    [6, "M7 4h.01"],
    [6, "M12 4h.01"],
    [6, "M17 4h.01"],
  ],
  "cake-slice": [
    [1, 9, 7, 2],
    [6, "M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6"],
    [6, "M16 13H3"],
    [6, "M16 17H3"],
  ],
  calculator: [
    [5, 4, 2, 16, 20, 2],
    [0, 8, 6, 16, 6],
    [0, 16, 14, 16, 18],
    [6, "M16 10h.01"],
    [6, "M12 10h.01"],
    [6, "M8 10h.01"],
    [6, "M12 14h.01"],
    [6, "M8 14h.01"],
    [6, "M12 18h.01"],
    [6, "M8 18h.01"],
  ],
  calendar: [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
  ],
  "calendar-arrow-down": [
    [6, "m14 18 4 4 4-4"],
    [6, "M16 2v4"],
    [6, "M18 14v8"],
    [6, "M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
  ],
  "calendar-arrow-up": [
    [6, "m14 18 4-4 4 4"],
    [6, "M16 2v4"],
    [6, "M18 22v-8"],
    [6, "M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
  ],
  "calendar-check": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
    [6, "m9 16 2 2 4-4"],
  ],
  "calendar-check-2": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [6, "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"],
    [6, "M3 10h18"],
    [6, "m16 20 2 2 4-4"],
  ],
  "calendar-clock": [
    [6, "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"],
    [6, "M16 2v4"],
    [6, "M8 2v4"],
    [6, "M3 10h5"],
    [6, "M17.5 17.5 16 16.3V14"],
    [1, 16, 16, 6],
  ],
  "calendar-cog": [
    [6, "m15.2 16.9-.9-.4"],
    [6, "m15.2 19.1-.9.4"],
    [6, "M16 2v4"],
    [6, "m16.9 15.2-.4-.9"],
    [6, "m16.9 20.8-.4.9"],
    [6, "m19.5 14.3-.4.9"],
    [6, "m19.5 21.7-.4-.9"],
    [6, "M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"],
    [6, "m21.7 16.5-.9.4"],
    [6, "m21.7 19.5-.9-.4"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
    [1, 18, 18, 3],
  ],
  "calendar-days": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
    [6, "M8 14h.01"],
    [6, "M12 14h.01"],
    [6, "M16 14h.01"],
    [6, "M8 18h.01"],
    [6, "M12 18h.01"],
    [6, "M16 18h.01"],
  ],
  "calendar-fold": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [6, "M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z"],
    [6, "M3 10h18"],
    [6, "M15 22v-4a2 2 0 0 1 2-2h4"],
  ],
  "calendar-heart": [
    [6, "M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"],
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [
      6,
      "M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z",
    ],
  ],
  "calendar-minus": [
    [6, "M16 19h6"],
    [6, "M16 2v4"],
    [6, "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
  ],
  "calendar-minus-2": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
    [6, "M10 16h4"],
  ],
  "calendar-off": [
    [6, "M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18"],
    [6, "M21 15.5V6a2 2 0 0 0-2-2H9.5"],
    [6, "M16 2v4"],
    [6, "M3 10h7"],
    [6, "M21 10h-5.5"],
    [6, "m2 2 20 20"],
  ],
  "calendar-plus": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [6, "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"],
    [6, "M3 10h18"],
    [6, "M16 19h6"],
    [6, "M19 16v6"],
  ],
  "calendar-plus-2": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
    [6, "M10 16h4"],
    [6, "M12 14v4"],
  ],
  "calendar-range": [
    [5, 3, 4, 18, 18, 2],
    [6, "M16 2v4"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
    [6, "M17 14h-6"],
    [6, "M13 18H7"],
    [6, "M7 14h.01"],
    [6, "M17 18h.01"],
  ],
  "calendar-search": [
    [6, "M16 2v4"],
    [6, "M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25"],
    [6, "m22 22-1.875-1.875"],
    [6, "M3 10h18"],
    [6, "M8 2v4"],
    [1, 18, 18, 3],
  ],
  "calendar-x": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [5, 3, 4, 18, 18, 2],
    [6, "M3 10h18"],
    [6, "m14 14-4 4"],
    [6, "m10 14 4 4"],
  ],
  "calendar-x2": [
    [6, "M8 2v4"],
    [6, "M16 2v4"],
    [6, "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"],
    [6, "M3 10h18"],
    [6, "m17 22 5-5"],
    [6, "m17 17 5 5"],
  ],
  camera: [
    [6, "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"],
    [1, 12, 13, 3],
  ],
  "camera-off": [
    [0, 2, 2, 22, 22],
    [6, "M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"],
    [6, "M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"],
    [6, "M14.121 15.121A3 3 0 1 1 9.88 10.88"],
  ],
  "candlestick-chart": [
    [6, "M9 5v4"],
    [5, 7, 9, 4, 6, 1],
    [6, "M9 15v2"],
    [6, "M17 3v2"],
    [5, 15, 5, 4, 8, 1],
    [6, "M17 13v3"],
    [6, "M3 3v16a2 2 0 0 0 2 2h16"],
  ],
  candy: [
    [6, "m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z"],
    [6, "M14 6.5v10"],
    [6, "M10 7.5v10"],
    [6, "m16 7 1-5 1.37.68A3 3 0 0 0 19.7 3H21v1.3c0 .46.1.92.32 1.33L22 7l-5 1"],
    [6, "m8 17-1 5-1.37-.68A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.32-1.33L2 17l5-1"],
  ],
  "candy-cane": [
    [6, "M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z"],
    [6, "M17.75 7 15 2.1"],
    [6, "M10.9 4.8 13 9"],
    [6, "m7.9 9.7 2 4.4"],
    [6, "M4.9 14.7 7 18.9"],
  ],
  "candy-off": [
    [6, "m8.5 8.5-1 1a4.95 4.95 0 0 0 7 7l1-1"],
    [6, "M11.843 6.187A4.947 4.947 0 0 1 16.5 7.5a4.947 4.947 0 0 1 1.313 4.657"],
    [6, "M14 16.5V14"],
    [6, "M14 6.5v1.843"],
    [6, "M10 10v7.5"],
    [6, "m16 7 1-5 1.367.683A3 3 0 0 0 19.708 3H21v1.292a3 3 0 0 0 .317 1.341L22 7l-5 1"],
    [6, "m8 17-1 5-1.367-.683A3 3 0 0 0 4.292 21H3v-1.292a3 3 0 0 0-.317-1.341L2 17l5-1"],
    [0, 2, 2, 22, 22],
  ],
  cannabis: [
    [6, "M12 22v-4"],
    [
      6,
      "M7 12c-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3 1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5 0 0 2.5.5 6-1-.5-1.5-3.5-3-5-3 1.5-1 4-4 4-6-2.5 0-5.5 1.5-7 3 0-2.5-.5-5-2-7-1.5 2-2 4.5-2 7-1.5-1.5-4.5-3-7-3 0 2 2.5 5 4 6",
    ],
  ],
  captions: [
    [5, 3, 5, 18, 14, 2, 2],
    [6, "M7 15h4M15 15h2M7 11h2M13 11h4"],
  ],
  "captions-off": [
    [6, "M10.5 5H19a2 2 0 0 1 2 2v8.5"],
    [6, "M17 11h-.5"],
    [6, "M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2"],
    [6, "m2 2 20 20"],
    [6, "M7 11h4"],
    [6, "M7 15h2.5"],
  ],