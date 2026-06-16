// 文本解析与转换工作线程
// 处理Markdown文本解析、转换和元数据提取

"use strict";

// 导入依赖模块
var Definitions = require("mdast-util-definitions").definitions;
var u = require('unist-builder').u;
var visit = require('unist-util-visit').visit;
var All = require('mdast-util-to-hast/lib/all');
var HastUtilToHtml = require('hast-util-to-html');
var RemarkParser = require('remark-parse');
var ToHast = require('mdast-util-to-hast');
var VFile = require('vfile');
var Wrap = require('mdast-util-to-hast/lib/wrap');
var YAML = require("yaml");

// 变量定义
var whiteSpaceCharCode = 32;          // 空格字符码
var leftSqureBracketsCharCode = 91;   // 左方括号字符码
var rightSqureBracketsCharCode = 93;  // 右方括号字符码
var circumflexAccentCharCode = 94;    // 插入符号字符码

// 缓存类定义
var TransformerCache = (function () {
    function Cache() { 
        this.transformers = []; 
    }
    
    Cache.prototype.addTransformer = function (transformer) { 
        this.transformers.push(transformer); 
    };
    
    Cache.prototype.removeTransformer = function (transformer) {
        var caches = this.transformers;
        for (var index = 0; index < caches.length;)
            caches[index] === transformer ? caches.splice(index, 1) : index++;
    };
    
    return Cache;
})();

// 注册内联标记解析器
function registerInlineTokenizer(parser, type, after, tokenizer, locator) {
    var tokenizers = parser.prototype.inlineTokenizers;
    var methods = parser.prototype.inlineMethods;
    tokenizer.locator = locator;
    tokenizers[type] = tokenizer;
    methods.splice(methods.indexOf(after), 0, type);
}

// 注册块级标记解析器
function registerBlockTokenizer(parser, type, after, tokenizer, locator) {
    var tokenizers = parser.prototype.blockTokenizers;
    var methods = parser.prototype.blockMethods;
    tokenizer.locator = locator;
    tokenizers[type] = tokenizer;
    methods.splice(methods.indexOf(after), 0, type);
}

// 在指定位置后插入缓存项
function registerAfter(cache, expect, value) {
    for (var index = 0; index < cache.length && cache[index][0] !== expect; index++)
        ;
    cache.splice(index + 1, 0, [value]);
}

// 根据选项截取子字符串
function substringWithOption(value, option) {
    var start = option.position.end;
    var end = option.position.end;
    var children = option.children;
    if (children.length > 0) {
        start = children[0].position.start;
        end = children[children.length - 1].position.end;
    }
    return value.substring(start.offset, end.offset).trim();
}

// 应用定义的标记解析器
function tokenizerApply(definition, tokenizers, node, value) {
    for (var length = definition.length, index = -1; ++index < length;)
        if (tokenizers[definition[index][0]].apply(node, value))
            return true;
    return false;
}

// 检查路径是否为相对路径
function checkPath(value) {
    return (value.startsWith("./") || value.startsWith("../") || -1 === value.indexOf(":"));
}

// 规范化数据
function normalizeData(data) {
    var nonBreakingSpacePattern = /\u00A0/g;
    return data.replace(nonBreakingSpacePattern, " ").trim().normalize("NFC");
}

// 解析双括号链接标题
function resolveDoubleBracketLinkTitle(link) {
    return link.split("#").filter(function (value) { return !!value; }).join(" > ").trim();
}

// 解析双括号链接
function resolveDoubleBracketLink(href) {
    var title = "", index = href.indexOf("|"), isAlias = index > 0;
    if (isAlias) {
        title = href.substring(index + 1).trim();
        href = href.substring(0, index).trim();
    }
    else {
        href = href.trim();
        title = resolveDoubleBracketLinkTitle(href);
    }
    href.endsWith("\\") && (href = href.substring(0, href.length - 1));
    href = normalizeData(href);
    return { href: href, title: title, isAlias: isAlias };
}

// 解析区域数据
function parseAreaData(value, parent) {
    var resolved = (function (value) {
        var match = value.match(/^\s*([0-9]+)\s*(?:x\s*([0-9]+)\s*)?$/);
        return match ? { x: parseInt(match[1]), y: match[2] ? parseInt(match[2]) : 0 } : null;
    })(value);
    if (!resolved)
        return false;
    parent.data = parent.data || {};
    parent.data.hProperties = parent.data.hProperties || {};
    var properties = parent.data.hProperties;
    properties.width = String(resolved.x);
    if (resolved.y)
        properties.height = String(resolved.y);
    return true;
}

// 初始化解析器
var remarkParser = RemarkParser.Parser;
remarkParser.globalOptions = { breaks: true, commonmark: true };
var transformerCache = new TransformerCache();
var transformerCacheAlt = new TransformerCache();
var DefinitionsHandlers = {};

// 解析元数据
function parseMetadata(meta) {
    var file = VFile(meta);
    var parser = new remarkParser(String(file), file);
    parser.setOptions(remarkParser.globalOptions);
    var node = parser.parse(), transformers = transformerCache.transformers;
    for (var index = 0; index < transformers.length; index++) {
        transformers[index](node, meta);
    }
    return node;
}

// 注册标记解析器
function registerMarkAfterText(parser) {
    var spacePatten = /\s/, checkSpace = function (value) { return spacePatten.test(value); }, symbolEqual = "==";
    registerInlineTokenizer(parser, "mark", "text", function (eat, value, silent) {
        if (this.options.gfm &&
            value.substr(0, 2) === symbolEqual &&
            value.substr(0, 4) !== symbolEqual + symbolEqual && !checkSpace(value.charAt(2))) {
            var next = "", current = "", previous = "", text = "", length = value.length;
            var position = eat.now();
            position.column += 2;
            position.offset += 2;
            for (var index = 1; ++index < length;) {
                next = value.charAt(index);
                if (!("=" !== next || "=" !== current || (previous && checkSpace(previous))))
                    return (silent || eat(symbolEqual + text + symbolEqual)({
                        type: "mark",
                        children: this.tokenizeInline(text, position),
                        data: { hName: "mark" },
                    }));
                text += current;
                previous = current;
                current = next;
            }
        }
    }, function (value, from) { return value.indexOf(symbolEqual, from); });
}

// 注册内部链接解析器
function registerInternalLinkAfterLink(parser) {
    registerInlineTokenizer(parser, "ilink", "link", function (eat, value, silent) {
        var match = /^(!?)\[\[(.+?)]]/.exec(value);
        if (match) {
            var displayText = match[2].trim();
            if (-1 !== displayText.indexOf("[["))
                return false;
            if (silent)
                return true;
            var expand = "!" === match[1], link = resolveDoubleBracketLink(displayText), href = link.href, title = link.title, isAlias = link.isAlias;
            if (expand) {
                return eat(match[0])({
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
                        hChildren: [{ type: "text", value: title }],
                    },
                });
            }
            var property = { className: "internal-link", href: href, dataHref: href };
            if (isAlias) {
                property["aria-label"] = resolveDoubleBracketLinkTitle(href);
                property["data-tooltip-position"] = "top";
            }
            return eat(match[0])({
                type: "ilink",
                href: href,
                title: title,
                data: {
                    hName: "a",
                    hProperties: property,
                    hChildren: [{ type: "text", value: title }],
                },
            });
        }
    }, function (value, from) {
        var pattern = /!?\[\[/g;
        pattern.lastIndex = from;
        var match = pattern.exec(value);
        return match ? match.index : -1;
    });
}

// 注册标签解析器
function registerTagAfterImage(parser) {
    registerInlineTokenizer(parser, "tag", "image", function (eat, value, silent) {
        var match = /^#[^\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,.:;<=>?@^`{|}~\[\]\\\s]+/.exec(value);
        if (match) {
            var text = match[0];
            return (!/^#\d+$/.test(text) && (silent || eat(text)({
                type: "tag",
                tag: text,
                data: {
                    hName: "a",
                    hProperties: { className: "tag", href: text },
                    hChildren: [{ type: "text", value: text }],
                },
            })));
        }
    }, function (value, from) {
        for (var index = from; -1 !== (index = value.indexOf("#", index));) {
            if (index <= 0)
                return index;
            var current = value.charAt(index - 1);
            if (/\s/.test(current))
                return index;
            index++;
        }
    });
}

// 注册数学公式解析器
function registerMathAfterText(parser) {
    registerInlineTokenizer(parser, "math", "text", function (eat, value, silent) {
        var r, i, o, s, a, l, c, u = value.length, f = false, h = false, p = 0;
        if ((92 === value.charCodeAt(p) && ((h = !0), p++), 36 === value.charCodeAt(p))) {
            if ((p++, h))
                return silent || eat(value.slice(0, p))({ type: "text", value: "$" });
            if ((36 === value.charCodeAt(p) && ((f = !0), p++),
                (o = value.charCodeAt(p)), f || (32 !== o && 9 !== o))) {
                for (s = p; p < u;) {
                    if (((i = o), (o = value.charCodeAt(p + 1)), 36 === i)) {
                        if (((r = value.charCodeAt(p - 1)), (!f && 32 !== r && 9 !== r && (o != o || o < 48 || o > 57)) || (f && 36 === o))) {
                            if (((a = p - 1), p++, f))
                                for (var d = ++p; d < u;) {
                                    var m = value.charAt(d);
                                    if ("\n" === m) {
                                        p = d + 1;
                                        break;
                                    }
                                    if (!/\s/.test(m))
                                        break;
                                    d++;
                                }
                            l = p;
                            break;
                        }
                    }
                    else
                        92 === i && (p++, (o = value.charCodeAt(p + 1)));
                    p++;
                }
                if (void 0 !== l)
                    return (!!silent || ((c = value.slice(s, a + 1)),
                        eat(value.slice(0, l))({
                            type: "inlineMath",
                            value: c,
                            data: {
                                hName: "span",
                                hProperties: {
                                    className: f
                                        ? "math math-block"
                                        : "math math-inline",
                                },
                                hChildren: [{ type: "text", value: c }],
                            },
                        })));
            }
        }
    }, function (value, from) {
        return value.indexOf("$", from);
    });
}

// 注册块级数学公式解析器
function registerMathAfterFencedCode(parser) {
    registerBlockTokenizer(parser, "math", "fencedCode", function (eat, value, silent) {
        for (var r, i, o, s, a, l, c, u, f, h, p, d = value.length, m = 0; m < d && 32 === value.charCodeAt(m);)
            m++;
        for (a = m; m < d && 36 === value.charCodeAt(m);)
            m++;
        if (!((l = m - a) < 2)) {
            for (; m < d && 32 === value.charCodeAt(m);)
                m++;
            for (c = m; m < d;) {
                if (36 === (r = value.charCodeAt(m)))
                    return;
                if (10 === r)
                    break;
                m++;
            }
            if (10 === value.charCodeAt(m)) {
                if (silent)
                    return true;
                for (i = [], c !== m && i.push(value.slice(c, m)), m++, o = -1 === (o = value.indexOf("\n", m + 1)) ? d : o; m < d;) {
                    for (u = !1, h = m, p = o, s = o, f = 0; s > h && 32 === value.charCodeAt(s - 1);)
                        s--;
                    for (; s > h && 36 === value.charCodeAt(s - 1);)
                        (f++, s--);
                    for (l <= f && value.indexOf("$", h) === s && ((u = !0), (p = s)); h <= p && h - m < a && 32 === value.charCodeAt(h);)
                        h++;
                    if (u)
                        for (; p > h && 32 === value.charCodeAt(p - 1);)
                            p--;
                    if (((u && h === p) || i.push(value.slice(h, p)), u))
                        break;
                    ((m = o + 1), (o = -1 === (o = value.indexOf("\n", m + 1)) ? d : o));
                }
                return ((i = i.join("\n")), eat(value.slice(0, o))({
                    type: "math",
                    value: i,
                    data: {
                        hName: "div",
                        hProperties: { className: "math math-block" },
                        hChildren: [{ type: "text", value: i }],
                    },
                }));
            }
        }
    });
    var proto = parser.prototype;
    registerAfter(proto.interruptParagraph, "fencedCode", "math");
    registerAfter(proto.interruptList, "fencedCode", "math");
    registerAfter(proto.interruptBlockquote, "fencedCode", "math");
}

// 注册脚注类型
function registerFootnoteTypes(parser) {
    var proto = parser.prototype;
    var blockMethods = proto.blockMethods, blockTokenizers = proto.blockTokenizers, inlineTokenizers = proto.inlineTokenizers;
    var definitionCache = [];
    for (var index = 0; index < blockMethods.length; index++) {
        var method = blockMethods[index];
        if ("newline" !== method && "indentedCode" !== method && "paragraph" !== method && "footnoteDefinition" !== method)
            definitionCache.push([method]);
    }
    definitionCache.push(["footnoteDefinition"]);
    proto.interruptFootnoteDefinition = definitionCache;
    registerInlineTokenizer(parser, "inlineNote", "reference", function (eat, value, silent) {
        var position, charCode, footnoteIndex, footnoteLength, codeStart, codeBeginMarksCount, codeEndMarksCount;
        var limit = value.length + 1, offset = 0, bracketsCount = 0;
        if (value.charCodeAt(offset++) === circumflexAccentCharCode &&
            value.charCodeAt(offset++) === leftSqureBracketsCharCode) {
            footnoteIndex = offset;
            while (offset < limit) {
                charCode = value.charCodeAt(offset);
                if (!codeBeginMarksCount) {
                    if (92 === charCode) { // '\\'
                        offset += 2;
                    }
                    else if (charCode === leftSqureBracketsCharCode) {
                        bracketsCount++;
                        offset++;
                    }
                    else if (charCode === rightSqureBracketsCharCode) {
                        if (0 === bracketsCount) {
                            footnoteLength = offset;
                            offset++;
                            break;
                        }
                        bracketsCount--;
                        offset++;
                    }
                    else if (96 === charCode) { // '`'
                        codeStart = offset;
                        codeBeginMarksCount = 1;
                        while (96 === value.charCodeAt(codeStart + codeBeginMarksCount))
                            codeBeginMarksCount++;
                        offset += codeBeginMarksCount;
                    }
                    else {
                        offset++;
                    }
                }
                else if (96 === charCode) {
                    codeStart = offset;
                    codeEndMarksCount = 1;
                    while (96 === value.charCodeAt(codeStart + codeEndMarksCount))
                        codeEndMarksCount++;
                    offset += codeEndMarksCount;
                    codeBeginMarksCount === codeEndMarksCount && (codeBeginMarksCount = undefined);
                    codeEndMarksCount = undefined;
                }
                else
                    offset++;
            }
            if (footnoteLength)
                return (silent || ((position = eat.now()),
                    (position.column += 2),
                    (position.offset += 2),
                    eat(value.slice(0, offset))({
                        type: "footnote",
                        children: this.tokenizeInline(value.slice(footnoteIndex, footnoteLength), position),
                    })));
        }
    }, function (value, from) { return value.indexOf("^[", from); });
    registerBlockTokenizer(parser, "footnoteDefinition", "definition", function (eat, value, silent) {
        var r, mark, o, charCode, l, c, u, f, h, p, d, m, g;
        var that = this, interruptFootnoteDefinition = that.interruptFootnoteDefinition;
        var offset = that.offset, limit = value.length + 1;
        var x = [];
        for (var index = 0; index < limit && (9 === (charCode = value.charCodeAt(index)) || charCode === whiteSpaceCharCode);)
            index++;
        if (value.charCodeAt(index++) === leftSqureBracketsCharCode &&
            value.charCodeAt(index++) === circumflexAccentCharCode) {
            for (mark = index; index < limit;) {
                charCode = value.charCodeAt(index);
                if (10 === charCode || 9 === charCode || charCode === whiteSpaceCharCode)
                    return;
                if (93 === charCode) {
                    ((o = index), index++);
                    break;
                }
                index++;
            }
            if (undefined !== o && mark !== o && 58 === value.charCodeAt(index++)) {
                if (silent)
                    return true;
                for (r = value.slice(mark, o), l = eat.now(), h = 0, p = 0, d = index, m = []; index < limit;) {
                    if ((charCode = value.charCodeAt(index)) != charCode || 10 === charCode)
                        ((g = {
                            start: h,
                            contentStart: d || index,
                            contentEnd: index,
                            end: index,
                        }),
                            m.push(g), 10 === charCode && ((h = index + 1), (p = 0), (d = void 0), (g.end = h)));
                    else if (void 0 !== p)
                        if (charCode === whiteSpaceCharCode || 9 === charCode) {
                            (p += charCode === whiteSpaceCharCode ? 1 : 4 - (p % 4)) > 4 && ((p = void 0), (d = index));
                        }
                        else {
                            if (p < 4 && g && (g.contentStart === g.contentEnd || tokenizerApply(interruptFootnoteDefinition, blockTokenizers, that, [eat, value.slice(index, 1024), true])))
                                break;
                            ((p = void 0), (d = index));
                        }
                    index++;
                }
                for (index = -1, limit = m.length; limit > 0 && (g = m[limit - 1]).contentStart === g.contentEnd;)
                    limit--;
                for (c = eat(value.slice(0, g.contentEnd)); ++index < limit;)
                    ((g = m[index]),
                        (offset[l.line + index] = (offset[l.line + index] || 0) + (g.contentStart - g.start)),
                        x.push(value.slice(g.contentStart, g.end)));
                return ((u = that.enterBlock()),
                    (f = that.tokenizeBlock(x.join(""), l)),
                    u(),
                    c({
                        type: "footnoteDefinition",
                        identifier: r.toLowerCase(),
                        label: r,
                        children: f,
                    }));
            }
        }
    });
    registerInlineTokenizer(parser, "footnoteCall", "reference", function (eat, value, silent) {
        var r, i, o, s, a = value.length + 1, l = 0;
        if (value.charCodeAt(l++) === leftSqureBracketsCharCode && circumflexAccentCharCode === value.charCodeAt(l++)) {
            for (i = l; l < a;) {
                if ((s = value.charCodeAt(l)) != s ||
                    10 === s ||
                    9 === s ||
                    s === whiteSpaceCharCode)
                    return;
                if (93 === s) {
                    ((o = l), l++);
                    break;
                }
                l++;
            }
            if (void 0 !== o && i !== o)
                return (!!silent ||
                    ((r = value.slice(i, o)),
                        eat(value.slice(0, l))({
                            type: "footnoteReference",
                            identifier: r.toLowerCase(),
                            label: r,
                        })));
        }
    }, function (value, from) {
        return value.indexOf("[", from);
    });
    var definition = blockTokenizers.definition;
    var reference = inlineTokenizers.reference;
    function Reference(e, value, n) {
        var index = 0;
        value.charCodeAt(index) === 33 && index++;
        if (value.charCodeAt(index) === leftSqureBracketsCharCode &&
            value.charCodeAt(index + 1) !== circumflexAccentCharCode)
            return reference.call(this, e, value, n);
    }
    blockTokenizers.definition = function (e, value, n) {
        for (var index = 0, charCode = value.charCodeAt(index); charCode === whiteSpaceCharCode || 9 === charCode;)
            charCode = value.charCodeAt(++index);
        var nextCode = value.charCodeAt(index + 1);
        if (charCode === leftSqureBracketsCharCode && nextCode !== circumflexAccentCharCode)
            return definition.call(this, e, value, n);
    };
    inlineTokenizers.reference = Reference;
    Reference.locator = reference.locator;
}

// 注册换行符处理
function registerBreaks(parser) {
    var inlineTokenizers = parser.prototype.inlineTokenizers;
    var originBreakFn = inlineTokenizers.break;
    var breakFn = function (eat, value, silent) {
        if (!this.options.breaks && !this.options.breakOnce)
            return originBreakFn.call(this, eat, value, silent);
        for (var charCode, length = value.length, index = -1; ++index < length;) {
            if (10 === (charCode = value.charCodeAt(index)))
                return ((this.options.breakOnce = false),
                    silent || eat(value.slice(0, index + 1))({ type: "break" }));
            if (32 !== charCode)
                return;
        }
    };
    ((breakFn.locator = originBreakFn.locator), (inlineTokenizers.break = breakFn));
}

// 注册前置元数据解析器
function registerFrontmatter(parser) {
    var t = "---", n = function (e, n, r) {
        if (n.slice(0, 3) === t && "\n" === n.charAt(3)) {
            for (var i = n.indexOf(t, 3); -1 !== i && "\n" !== n.charAt(i - 1);)
                i = n.indexOf(t, i + 3);
            return -1 !== i ? !!r || e(n.slice(0, i + 3))({
                type: "yaml",
                value: n.slice(4, i - 1),
            }) : void 0;
        }
    };
    n.onlyAtStart = !0;
    var proto = parser.prototype;
    (proto.blockMethods.unshift("frontmatter"), (proto.blockTokenizers.frontmatter = n));
}

// 注册块ID类型
function registerBlockidTypes(parser) {
    var t = /^\^([a-zA-Z0-9\-]+)$/, n = /\s/;
    registerInlineTokenizer(parser, "blockid", "text", function (e, n, r) {
        var i = t.exec(n);
        if (i) {
            var o = i[1];
            return !!r || e(i[0])({ type: "blockid", id: o });
        }
    }, function (e, t) {
        for (var r = t; -1 !== (r = e.indexOf("^", r));) {
            if (r <= 0)
                return -1;
            var i = e.charAt(r - 1);
            if (n.test(i))
                return r;
            r++;
        }
    });
    var r = /^\^([a-zA-Z0-9\-]+)(?=$|\n$|\n\n)/;
    registerBlockTokenizer(parser, "blockid", "paragraph", function (e, t, n) {
        var i = r.exec(t);
        if (i) {
            var o = i[1];
            return !!n || e(i[0])({ type: "blockid", id: o });
        }
    });
}

// 注册注释类型
function registerCommentTypes(parser, definitions) {
    registerInlineTokenizer(parser, "comment", "text", function (eat, value, silent) {
        var match = /^%%(.+?)%%/.exec(value);
        if (match) {
            if (silent)
                return true;
            var position = eat.now();
            return ((position.column += 2),
                (position.offset += 2),
                eat(match[0])({
                    type: "comment",
                    children: this.tokenizeInline(match[1], position),
                }));
        }
    }, function (value, from) {
        return value.indexOf("%%", from);
    });
    definitions.comment = function () {
        return null;
    };
    registerBlockTokenizer(parser, "comment", "fencedCode", function (eat, value, silent) {
        for (var length = value.length, index = 0; index < length && 32 === value.charCodeAt(index);)
            index++;
        for (var start = index; index < length && 37 === value.charCodeAt(index);)
            index++;
        var s = index - start;
        if (!(s < 2)) {
            for (var a = index; index < length;) {
                var charCode = value.charCodeAt(index);
                if (37 === charCode)
                    return;
                if (10 === charCode)
                    break;
                index++;
            }
            if (silent)
                return true;
            for (var c = length, u = 0; index < length;) {
                if (37 === value.charCodeAt(index)) {
                    if (s === ++u) {
                        c = index + 1;
                        break;
                    }
                }
                else
                    u = 0;
                index++;
            }
            var f = value.substring(a, c - s), position = eat.now();
            return eat(value.slice(0, c))({
                type: "comment",
                value: f,
                children: this.tokenizeInline(f, position),
            });
        }
    });
    var proto = parser.prototype;
    registerAfter(proto.interruptParagraph, "fencedCode", "comment");
    registerAfter(proto.interruptList, "fencedCode", "comment");
    registerAfter(proto.interruptBlockquote, "fencedCode", "comment");
}

// 添加列表项转换器
function addListItemTransformer(cache) {
    function visitor(node) {
        if ("boolean" == typeof node.checked) {
            var current = node;
            current.data = current.data || {};
            current.data.hProperties = current.data.hProperties || {};
            var property = current.data.hProperties;
            property.className = "task-list-item";
            node.checked && (property.className += " is-checked");
            node.checklist && (property.dataTask = node.checklist);
            var child = current.children[0];
            child && "paragraph" === child.type && (current = child);
            current.children.unshift({
                type: "checklist",
                data: {
                    hName: "input",
                    hProperties: {
                        className: "task-list-item-checkbox",
                        type: "checkbox",
                        checked: node.checked,
                    },
                },
                position: node.position,
            });
            delete node.checked;
        }
    }
    cache.addTransformer(function (node) { visit(node, "listItem", visitor); });
}

// 添加链接转换器
function addLinkTransformer(cache) {
    cache.addTransformer(function (node) {
        visit(node, "link", function (e, t, n) {
            var url = e.url;
            if (url && checkPath(url)) {
                var i;
                try {
                    i = decodeURI(url);
                }
                catch (e) {
                    return;
                }
                var o = normalizeData(i);
                n.children[t] = {
                    type: "ilink",
                    href: o,
                    title: "",
                    converted: !0,
                    data: {
                        url: url,
                        hName: "a",
                        hProperties: {
                            href: o,
                            dataHref: o,
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
}

// 添加图片转换器
function addImageTransformer(cache) {
    cache.addTransformer(function (node) {
        visit(node, "image", function (node, index, parent) {
            var url = node.url;
            if (url && checkPath(url)) {
                var urlNormalized = normalizeData((function (data) {
                    try {
                        return decodeURI(data);
                    }
                    catch (exception) {
                        return data;
                    }
                })(url));
                parent.children[index] = {
                    type: "iembed",
                    href: urlNormalized,
                    title: node.alt,
                    data: {
                        hName: "span",
                        hProperties: {
                            className: "internal-embed",
                            src: urlNormalized,
                            alt: node.alt,
                        },
                    },
                    children: node.children,
                    position: node.position,
                };
            }
        });
    });
}

// 添加脚注定义转换器
function addFootnoteDefinitionTransformer(caches) {
    caches.addTransformer(function (node) {
        var t = [], n = {}, r = {};
        function i(e, t, n) {
            var r, i, o, s, a = String(t + 1), l = a;
            if ((n > 0 && (l += "-" + n),
                (e.type = "fnRef"),
                (e.data = {
                    hName: "sup",
                    hProperties: {
                        className: "footnote-ref",
                        "data-footnote-id": "fnref-" + l,
                    },
                }),
                !e.identifier && e.hasOwnProperty("children"))) {
                var c = e.children, u = null ===
                    (i =
                        null === (r = c[0]) || void 0 === r
                            ? void 0
                            : r.position) || void 0 === i
                    ? void 0
                    : i.start, f = null ===
                        (s =
                            null === (o = c[c.length - 1]) || void 0 === o
                                ? void 0
                                : o.position) || void 0 === s
                        ? void 0
                        : s.end;
                u &&
                    f &&
                    ((e.data.contentPosition = { start: u, end: f }),
                        (e.identifier = "".concat("[inline").concat(t)));
            }
            e.children = [
                {
                    type: "element",
                    data: {
                        hName: "a",
                        hProperties: {
                            className: "footnote-link",
                            href: "#fn-" + a,
                            "data-footref": e.identifier,
                        },
                        hChildren: [{ type: "text", value: "[" + l + "]" }],
                    },
                },
            ];
        }
        (visit(node, "footnoteDefinition", function (e) {
            var t = String(e.identifier);
            ((r[":" + t] = -1),
                (n[":" + t] = { children: e.children, position: e.position }));
        }), visit(node, ["footnote", "footnoteReference"], function (e) {
            if ("footnote" === e.type) {
                var o = t.length, s = String(o);
                (t.push({ count: 1, identifier: s }),
                    (n[s] = {
                        children: e.children,
                        position: e.position,
                        isInline: !e.identifier && e.hasOwnProperty("children"),
                    }),
                    i(e, o, 0));
            }
            else {
                s = String(e.identifier);
                if (!r.hasOwnProperty(":" + s))
                    return ((e.type = "text"), void (e.value = s));
                -1 === (o = r[":" + s]) &&
                    ((o = t.length),
                        (r[":" + s] = o),
                        t.push({ count: 0, identifier: ":" + s }));
                var a = t[o], l = a.count;
                (a.count++, i(e, o, l));
            }
        }));
        for (var o = [], s = 0; s < t.length; s++) {
            var a = t[s], l = n[a.identifier];
            if (l) {
                var c = l.children, u = c[c.length - 1];
                u && "paragraph" === u.type && (c = u.children);
                for (var f = String(s + 1), h = 0; h < a.count; h++) {
                    var p = f;
                    (h > 0 && (p += "-" + h),
                        c.push({
                            type: "element",
                            data: {
                                hName: "a",
                                hProperties: {
                                    className: "footnote-backref footnote-link",
                                    href: "#fnref-" + p,
                                },
                                hChildren: [{ type: "text", value: "↩︎" }],
                            },
                        }));
                }
                o.push({
                    type: "listItem",
                    synthetic: !0,
                    data: {
                        hProperties: { "data-footnote-id": "fn-" + f },
                        isInline: l.isInline,
                    },
                    children: [{ type: "paragraph", children: l.children }],
                    position: l.position,
                });
            }
        }
        if (0 !== o.length) {
            var d, m = node.children[node.children.length - 1], g = {
                start: (d = m
                    ? m.position.end
                    : { line: 1, column: 1, offset: 0 }),
                end: d,
            };
            node.children = node.children.concat({ type: "text", value: "\n", position: g }, {
                type: "element",
                position: g,
                data: {
                    hName: "section",
                    hProperties: { className: "footnotes" },
                },
                children: [
                    { type: "thematicBreak", position: g },
                    {
                        type: "list",
                        position: g,
                        ordered: !0,
                        start: 1,
                        spread: !1,
                        children: o,
                    },
                ],
            });
        }
    });
}

// 添加图片alt转换器
function addImageAltTransformer(cache) {
    cache.addTransformer(function (node) {
        visit(node, "image", function (image) {
            if (image.alt) {
                var index = image.alt.lastIndexOf("|");
                if (-1 !== index)
                    parseAreaData(image.alt.substr(index + 1), image) && (image.alt = image.alt.substr(0, index));
            }
        });
    });
}

// 添加嵌入标题转换器
function addIEmbedTitleTransformer(cache) {
    cache.addTransformer(function (node) {
        visit(node, "iembed", function (e) {
            var title = e.title;
            if (title) {
                var n = title.lastIndexOf("|");
                if (-1 !== n)
                    parseAreaData(title.substr(n + 1), e) && (title = title.substr(0, n));
                else
                    parseAreaData(title, e) && (title = "");
                (title || (title = e.href), (e.data.hProperties.alt = title));
            }
        });
    });
}

// 添加块ID转换器
function addBlockIdTransformer(cache, definitions) {
    ((definitions.blockid = function () { return null; }),
        cache.addTransformer(function (e) {
            for (var t, children = e.children, r = function (index) {
                var node = children[index];
                if ("blockid" === node.type) {
                    if (index > 0)
                        children[index - 1].id = node.id;
                    return (children.splice(index, 1), index--, (t = index), "continue");
                }
                if ("list" === node.type)
                    return (visit(node, "listItem", function (node) {
                        var id = null;
                        (visit(node, ["list", "blockid"], function (e) { i = e.id; }), i && (node.id = i), (t = index));
                    }), (t = index), "continue");
                var i = null;
                (visit(node, "blockid", function (e) { i = e.id; }), i && (node.id = i), (t = index));
            }, i = 0; i < children.length; i++)
                (r(i), (i = t));
        }));
}

// 添加标题转换器
function addHeadingTransformer(cache) {
    cache.addTransformer(function (node, t) {
        visit(node, "heading", function (e, n, r) {
            var i = substringWithOption(t, e);
            e.data = { hProperties: { dataHeading: i } };
        });
    });
}

// 添加提示框转换器
function addCalloutTransformer(cache, definitions) {
    ((definitions.callout = function (e, parent) {
        var n = parent.callout, r = n.color, i = null;
        if (r) {
            r = r.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/i, function (e, t, n, r) {
                return "#" + t + t + n + n + r + r;
            });
            var match = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
            match && (i = "--callout-color: " + [
                parseInt(match[1], 16),
                parseInt(match[2], 16),
                parseInt(match[3], 16),
            ].join(",") + ";");
        }
        return e(parent, "div", {
            className: "callout",
            dataCallout: n.type,
            dataCalloutIcon: n.icon,
            dataCalloutFold: n.fold,
            dataCalloutMetadata: n.data,
            style: i,
        }, All(e, parent));
    }), (definitions["callout-title"] = function (e, t) {
        return e(t, "div", { className: "callout-title" }, [
            e({}, "div", { className: "callout-icon" }),
            e({}, "div", { className: "callout-title-inner" }, All(e, t)),
        ]);
    }), (definitions["callout-content"] = function (e, t) {
        return e(t, "div", { className: "callout-content" }, Wrap(All(e, t), true));
    }), cache.addTransformer(function (node) {
        visit(node, "blockquote", function (e) {
            var t = e.callout;
            if (t) {
                e.type = "callout";
                var n = [], r = e.children, i = r && r[0];
                if (i && i.position.start.line === e.position.start.line)
                    if ("paragraph" === i.type) {
                        for (var children = i.children, index = 0, a = undefined; index < children.length; index++)
                            if ("break" === children[index].type) {
                                a = children[index];
                                break;
                            }
                        var l = r.slice(1);
                        (a ? (n.push({
                            type: "callout-title",
                            position: {
                                start: i.position.start,
                                end: a.position.start,
                            },
                            children: children.slice(0, index),
                        }), (i.position.start = a.position.end), (i.children = children.slice(index + 1)), l.unshift(i))
                            : n.push({
                                type: "callout-title",
                                position: i.position,
                                children: children,
                            }), l.length > 0 && n.push({
                                type: "callout-content",
                                position: {
                                    start: l[0].position.start,
                                    end: l[l.length - 1].position.end,
                                },
                                children: l,
                            }));
                    }
                    else {
                        n.push({
                            type: "callout-title",
                            position: i.position,
                            children: [i],
                        });
                        var c = r[1];
                        if (c) {
                            var u = c.position.start, f = r[r.length - 1].position.end;
                            n.push({
                                type: "callout-content",
                                position: { start: u, end: f },
                                children: r.slice(1),
                            });
                        }
                    }
                else {
                    var h = { start: e.position.start, end: e.position.start }, p = t.type.trim().replace(/\-/g, " ").toLowerCase();
                    ((p = p.charAt(0).toUpperCase() + p.substr(1)),
                        n.push({
                            type: "callout-title",
                            position: h,
                            children: [{ type: "text", value: p, position: h }],
                        }), i && n.push({
                            type: "callout-content",
                            position: e.position,
                            children: r,
                        }));
                }
                e.children = n;
            }
        });
    }));
}

// 添加元素转换器
function addElementTransformer(cache) {
    function visitor(node) {
        var properties = node.properties;
        if (properties && !properties.className) {
            ((properties.className = "external-link"), (properties.target = "_blank"), (properties.rel = "noopener nofollow"));
            var value = "", children = node.children;
            (children && children.length > 0 && (value = children[0].value),
                properties.href !== value && ((properties["aria-label"] = properties.href),
                    (properties["data-tooltip-position"] = "top")));
        }
    }
    cache.addTransformer(function (node) {
        visit(node, { type: "element", tagName: "a" }, visitor);
    });
}

// 注册各种解析器和转换器
registerMarkAfterText(remarkParser);
registerInternalLinkAfterLink(remarkParser);
registerTagAfterImage(remarkParser);
addListItemTransformer(transformerCache);
registerMathAfterText(remarkParser);
registerMathAfterFencedCode(remarkParser);
registerFootnoteTypes(remarkParser);
registerBreaks(remarkParser);
registerFrontmatter(remarkParser);
registerBlockidTypes(remarkParser);
addLinkTransformer(transformerCache);
addImageTransformer(transformerCache);
addFootnoteDefinitionTransformer(transformerCache);
addImageAltTransformer(transformerCache);
addIEmbedTitleTransformer(transformerCache);
addBlockIdTransformer(transformerCache, DefinitionsHandlers);
addHeadingTransformer(transformerCache);
addCalloutTransformer(transformerCache, DefinitionsHandlers);
addElementTransformer(transformerCacheAlt);

// YAML处理器
DefinitionsHandlers.yaml = function (parse, options) {
    var n = options.value || "";
    return parse(options.position, "pre", { className: "frontmatter" }, [
        parse(options, "code", { className: "language-yaml" }, [u("text", n)]),
    ]);
};

registerCommentTypes(remarkParser, DefinitionsHandlers);

// 解析YAML
function parseYaml(tree) {
    var node = tree.children[0];
    if (node && "yaml" === node.type)
        try {
            var doc = YAML.parse(node.value, undefined, {});
            if (doc && "object" == typeof doc && !Array.isArray(doc))
                return doc || undefined;
        }
        catch (e) {
            return null;
        }
}

// 缓存节点文本
function cacheNodeText(node) {
    var cache = [];
    if (!node)
        return cache;
    for (var index = 0; index < node.length; index++) {
        cache.push(resolveText(node[index]));
    }
    return cache;
}

// 解析文本
function resolveText(node) {
    if (!node)
        return "";
    var type = node.type;
    if ("html" === type)
        return "";
    if ("iembed" === type)
        return node.href;
    if ("listItem" === type) {
        var text = cacheNodeText(node.children);
        return 1 === text.length ? text[0] + "\n" : text.join("\n");
    }
    if ("tag" === type)
        return node.tag;
    if ("comment" === type)
        return "";
    var value = node.value || node.alt || node.title || (node.hasOwnProperty("children") && cacheNodeText(node.children).join("")) || "";
    ("list" === type && void 0 !== node.start && null !== node.start && (value = node.start + ". " + value),
        "paragraph" === type || "break" === type || "heading" === type || "code" === type || "break" === type
            ? (value += "\n")
            : value.endsWith("\n") && (value = value.substring(0, value.length - 1)),
        "tableCell" === type ? (value += " ") : "tableRow" === type && (value += "\n"));
    return value;
}

// 解析段落
function parseSections(sections) {
    var tree = parseMetadata(sections), definitions = { definitions: Definitions(tree) }, sectionHtml = [], lineNumbers = [], levels = [], children = tree.children, doc = parseYaml(tree);
    tree.children = [null];
    var parse = function (index) {
        var current = children[index], headingLevel = 7;
        var startLine = current.position.start.line - 1;
        var endLine = current.position.end.line - 1;
        "heading" === current.type && (headingLevel = current.depth || 1);
        visit(current, ["checklist", "listItem", "code"], function (node) {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties["data-line"] = String(node.position.start.line - 1 - startLine);
        });
        tree.children[0] = current;
        var html = (function (tree, definitions) {
            (((definitions = definitions || {}).allowDangerousHtml = true),
                (definitions.handlers = DefinitionsHandlers));
            for (var r = ToHast(tree, definitions), index = 0, transformers = transformerCacheAlt.transformers; index < transformers.length; index++)
                (0, transformers[index])(r, "");
            return HastUtilToHtml(r, { allowDangerousHtml: true });
        })(tree, definitions);
        (sectionHtml.push(html),
            lineNumbers.push([startLine, endLine]),
            levels.push(headingLevel));
    };
    for (var index = 0; index < children.length; index++)
        parse(index);
    return { sectionHtml: sectionHtml, lineNumbers: lineNumbers, levels: levels, frontmatter: doc };
}

// 解析点
function parsePoint(point) {
    return { line: point.line - 1, col: point.column - 1, offset: point.offset };
}

// 解析位置
function parsePosition(postion) {
    return { start: parsePoint(postion.start), end: parsePoint(postion.end) };
}

// 解析双括号链接
function parseDoubleBracketLink(data) {
    var cache = [], parse = function (_prefix, _key, value) {
        var key = _prefix ? _prefix + "." + _key : _key;
        if ("string" == typeof value) {
            if (value.startsWith("[[") && value.endsWith("]]")) {
                var s = resolveDoubleBracketLink(value.substring(2, value.length - 2));
                var title = s.title;
                var link = s.href;
                cache.push({ key: key, link: link, original: value, displayText: title });
            }
        }
        else
            resolve(key, value);
    }, resolve = function (prefix, data) {
        if (Array.isArray(data)) {
            for (var index = 0; index < data.length; index++)
                parse(prefix, String(index), data[index]);
        }
        else if ("object" == typeof data) {
            for (var key in data)
                data.hasOwnProperty(key) && parse(prefix, key, data[key]);
        }
    };
    resolve("", data);
    return (cache);
}

// 发送消息
function PostMessage(message) {
    self.postMessage(message);
}

// 消息处理
self.onmessage = function (event) {
    try {
        var message = event.data;
        if (message.hasOwnProperty("metadataCache"))
            return void (function (metadataCache) {
                if (!metadataCache)
                    return void PostMessage({});
                PostMessage((function (metadata, flag) {
                    var root = {
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
                    }, tree = parseMetadata(metadata), node = tree.children[0];
                    if (node && "yaml" === node.type) {
                        var doc = parseYaml(tree);
                        doc && ((root.frontmatter = doc),
                            (root.frontmatterPosition = parsePosition(node.position)),
                            (root.frontmatterLinks = parseDoubleBracketLink(doc)));
                    }
                    for (var index = 0, children = tree.children; index < children.length; index++) {
                        var current = children[index], position = parsePosition(current.position), section = { type: current.type, position: position }, id = current.id;
                        (id && "string" == typeof id && ((section.id = id),
                            (root.blocks[id.toLowerCase()] = { position: position, id: id })), root.sections.push(section));
                    }
                    return (visit(tree, [
                        "heading",
                        "ilink",
                        "iembed",
                        "tag",
                        "listItem",
                        "fnRef",
                        "footnoteDefinition",
                        "definition",
                    ], function (node, index, parent) {
                        if ("fnRef" === node.type) {
                            var contentPosition = node.data ? node.data.contentPosition : undefined;
                            contentPosition
                                ? root.footnotes.push({
                                    position: parsePosition(contentPosition),
                                    id: node.identifier || "",
                                })
                                : root.footnoteRefs.push({
                                    position: parsePosition(node.position),
                                    id: node.identifier || "",
                                });
                        }
                        else if ("footnoteDefinition" === node.type)
                            root.footnotes.push({
                                position: parsePosition(node.position),
                                id: node.identifier || "",
                            });
                        else if ("definition" === node.type && node.url) {
                            var id = node.label || node.identifier;
                            root.referenceLinks.push({
                                position: parsePosition(node.position),
                                id: id || "",
                                link: node.url || "",
                            });
                        }
                        else if ("heading" === node.type && "root" === parent.type) {
                            var heading = substringWithOption(metadata, node);
                            root.headings.push({
                                position: parsePosition(node.position),
                                heading: heading,
                                level: node.depth || 1,
                            });
                        }
                        else if ("ilink" === node.type) {
                            var original = metadata.substring(node.position.start.offset, node.position.end.offset), link = node.href || "";
                            !(displayText = node.title || "") && node.converted && (displayText = resolveText(node));
                            link = {
                                position: parsePosition(node.position),
                                link: link,
                                original: original,
                                displayText: displayText,
                            };
                            (flag && delete link.original, root.links.push(link));
                        }
                        else if ("iembed" === node.type) {
                            ((original = metadata.substring(node.position.start.offset, node.position.end.offset)),
                                (link = node.href || ""));
                            var displayText = node.title || "";
                            ((link = {
                                position: parsePosition(node.position),
                                link: link,
                                original: original,
                                displayText: displayText,
                            }), flag && delete link.original, root.embeds.push(link));
                        }
                        else if ("tag" === node.type) {
                            var tag = node.tag || "";
                            root.tags.push({ position: parsePosition(node.position), tag: tag });
                        }
                        else if ("listItem" === node.type) {
                            if (node.synthetic) {
                                if (!node.data && node.data.isInline)
                                    return;
                                return "skip";
                            }
                            var position = parsePosition(node.position), children = node.children;
                            if (children && children.length > 1)
                                for (var index_1 = children.length - 1; index_1 >= 0; index_1--) {
                                    var node_1 = children[index_1];
                                    if ("list" !== node_1.type) {
                                        position.end = parsePoint(node_1.position.end);
                                        break;
                                    }
                                    node_1.listParentPosition = node_1.position;
                                }
                            var k = 0;
                            "list" === parent.type && (parent.listParentPosition
                                ? (k = parent.listParentPosition.start.line - 1)
                                : 0 == (k = -(parent.position.start.line - 1)) && (k = -1));
                            var item = { position: position, parent: k }, checklist = node.checklist;
                            ("string" == typeof checklist && (item.task = checklist),
                                (id = node.id) && "string" == typeof id && ((item.id = id), (root.blocks[id.toLowerCase()] = { position: position, id: id, })),
                                root.listItems.push(item));
                        }
                    }),
                        0 === root.links.length && delete root.links,
                        0 === root.embeds.length && delete root.embeds,
                        0 === root.tags.length && delete root.tags,
                        0 === root.headings.length && delete root.headings,
                        0 === root.footnotes.length && delete root.footnotes,
                        0 === root.footnoteRefs.length && delete root.footnoteRefs,
                        0 === root.referenceLinks.length && delete root.referenceLinks,
                        (0 === root.sections.length || flag) && delete root.sections,
                        0 === root.listItems.length && delete root.listItems,
                        0 === Object.keys(root.blocks).length && delete root.blocks,
                        root);
                })(new TextDecoder().decode(metadataCache)));
            })(message.metadataCache);
        if (message.hasOwnProperty("parseSections"))
            return ((sections = message.parseSections),
                (options = message.options),
                (remarkParser.globalOptions = options || {}),
                void postMessage(parseSections(sections)));
    }
    catch (e) {
        console.error("AppWorker exception", e);
    }
    var sections, options;
    postMessage(null);
};