        var i = n.data;
        i < 0 && (i += t.length());
        return t.get(i);
      }
      if (t instanceof OH) {
        if (!(n instanceof xH)) throw new Error("Object access must be an string. Got " + n.constructor.toString());
        return t.objectAccess(n.data);
      }
      if (t instanceof xH) {
        if (!(n instanceof TH)) throw new Error("String index must be an integer. Got " + n.constructor.toString());
        return new xH(t.data.charAt(n.data));
      }
      if (n instanceof xH) {
        var r = t.objectAccess(n.toString());
        if (r === null)
          throw new Error(
            Tz.msgErrorInvalidObjectAccess({
              index: n.data,
              type: t.constructor.toString(),
            }),
          );
        return r;
      }
      throw new Error(
        Tz.msgErrorInvalidArrayAccess({
          index: n.toString(),
        }),
      );
    };
    return t;
  })(Fz),
  Uz = (function (e) {
    function t(object, index) {
      var i = e.call(this, "object_access") || this;
      i.object = object;
      i.index = index;
      return i;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      if (e.type !== "object_access") throw new Error("Invalid type");
      if (!e.hasOwnProperty("object") || !e.hasOwnProperty("index")) throw new Error("Invalid object access");
      if (e.index.type !== "ident") throw new Error("Invalid object access");
      return new t(Fz.fromParsedResult(e.object), e.index.value);
    };
    t.prototype.getValue = function (e) {
      var t = this.object.getValue(e);
      if (!t || t === EH.value) return EH.value;
      var n = this.index,
        i = t.objectAccess(n);
      if (i === null)
        throw new Error(
          Tz.msgErrorInvalidObjectAccess({
            index: this.index,
            type: t.constructor.toString(),
          }),
        );
      return i;
    };
    return t;
  })(Fz),
  _z = (function (e) {
    function t(value) {
      var n = e.call(this, "paren_expr") || this;
      n.value = value;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(Fz.fromParsedResult(e.value));
    };
    t.prototype.getValue = function (e) {
      return this.value.getValue(e);
    };
    return t;
  })(Fz),
  jz = (function (e) {
    function t(value) {
      var n = e.call(this, "primitive") || this;
      n.value = value;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(e.value);
    };
    t.prototype.getValue = function () {
      return UH(this.value);
    };
    return t;
  })(Fz),
  Gz = (function (e) {
    function t(t) {
      var n = e.call(this, "regexp") || this;
      n.value = new FH(t);
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(new RegExp(e.pattern, e.flags));
    };
    t.prototype.getValue = function () {
      return this.value;
    };
    return t;
  })(Fz),
  Kz = (function (e) {
    function t(elements) {
      var n = e.call(this, "array") || this;
      n.elements = elements;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      if (!e.hasOwnProperty("elements") || !Array.isArray(e.elements)) throw new Error("Invalid array");
      return new t(e.elements.map(Fz.fromParsedResult));
    };
    t.prototype.getValue = function (e) {
      return new AH(
        this.elements.map(function (t) {
          return t.getValue(e);
        }),
      );
    };
    return t;
  })(Fz),
  Yz = (function (e) {
    function t(t) {
      var n = e.call(this, "ident") || this;
      n.id = t;
      return n;
    }
    __extends(t, e);
    t.fromParsedResult = function (e) {
      return new t(e.value);
    };
    t.prototype.getValue = function (e) {
      return e.getByIdentifier(this.id);
    };
    return t;
  })(Fz),
  Zz = i18nProxy.plugins.bases;
function Xz(name) {
  var t = name.indexOf(".");
  if (-1 === t)
    return {
      type: "note",
      name: name,
    };
  var type = name.slice(0, t);
  return type !== "note" && type !== "formula" && type !== "file"
    ? {
        type: "note",
        name: name,
      }
    : {
        type: type,
        name: name.slice(t + 1),
      };
}
function Qz(e, t) {
  return "".concat(e, ".").concat(t);
}
var $z = (function () {
    function e(app, filter, formulas, i) {
      this._local = null;
      this.app = app;
      this.filter = filter;
      this.formulas = formulas;
      i && (this._local = new eq(this, i));
    }
    Object.defineProperty(e.prototype, "local", {
      get: function () {
        this.localUsed = true;
        return this._local;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.regenerateLocal = function () {
      var t;
      return new e(
        this.app,
        this.filter,
        this.formulas,
        (t = this._local) === null || undefined === t ? undefined : t.file,
      );
    };
    return e;
  })(),
  Jz = Symbol(),
  eq = (function () {
    function e(ctx, filet0) {
      var n,
        i,
        r = (this.app = ctx.app);
      this.ctx = ctx;
      this.file = filet0;
      this.frontmatter =
        (i = (n = r.metadataCache.getFileCache(filet0)) === null || undefined === n ? undefined : n.frontmatter) !==
          null && undefined !== i
          ? i
          : {};
      this.note = OH.fromFrontMatter(r, filet0, this.frontmatter);
      this.implicit = new HH(r, filet0);
      this.formulaResults = new tq(this, ctx.formulas);
      this.formula = new iq(this.formulaResults);
    }
    e.prototype.getValue = function (e) {
      var t = Xz(e),
        n = t.type,
        i = t.name;
      switch (n) {
        case "note":
          return this.note.objectAccess(i);
        case "file":
          return this.implicit.objectAccess(i);
        case "formula":
          return this.formulaResults.getFormulaValue(i);
      }
      return null;
    };
    e.prototype.keys = function () {
      var e = new Set(Object.keys(this.frontmatter));
      e.add("this");
      e.add("note");
      e.add("file");
      e.add("formula");
      return Array.from(e);
    };
    e.prototype.getByIdentifier = function (e) {
      switch (e.toLowerCase()) {
        case "this":
          var t = this.ctx.local;
          return t ? new nq(this.app, t.file, t) : EH.value;
        case "note":
          return this.note;
        case "file":
          return this.implicit;
        case "formula":
          return this.formula;
      }
      return this.note.getInsensitive(e);
    };
    e.prototype.getPropertyKeys = function () {
      return Object.keys(this.frontmatter);
    };
    e.prototype.getRawProperty = function (e) {
      var t = KO(this.frontmatter, e);
      return Object.hasOwn(this.frontmatter, t) ? this.frontmatter[t] : null;
    };
    e.prototype.updateProperty = function (e, t) {
      return __awaiter(this, undefined, Promise, function () {
        var n;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              n = KO(this.frontmatter, e);
              return [
                4,
                this.ctx.app.fileManager.processFrontMatter(this.file, function (e) {
                  if (
                    ((t === "" || (Array.isArray(t) && t.length === 0)) && (t = null),
                    !e.hasOwnProperty(n) && t == null)
                  )
                    return e;
                  e[n] = t;
                }),
              ];
            case 1:
              i.sent();
              return [2];
          }
        });
      });
    };
    e.FILE_PROPERTIES = [
      "file.file",
      "file.name",
      "file.basename",
      "file.fullname",
      "file.path",
      "file.folder",
      "file.ext",
      "file.ctime",
      "file.mtime",
      "file.size",
      "file.links",
      "file.backlinks",
      "file.embeds",
      "file.tags",
    ];
    return e;
  })(),
  tq = (function () {
    function e(ctx, formulas) {
      this.ctx = ctx;
      this.formulas = formulas;
      this.cachedFormulaOutputs = {};
    }
    e.prototype.getFormulaValue = function (e) {
      var t = this,
        n = t.ctx,
        i = t.formulas,
        r = t.cachedFormulaOutputs;
      if (((e = KO(i, e)), Object.hasOwn(r, e))) {
        var o = r[e];
        if (o === Jz) throw new Error(Zz.msgErrorInfiniteLoop());
        return o;
      }
      if (Object.hasOwn(i, e))
        try {
          r[e] = Jz;
          var a = i[e].getValue(n);
          r[e] = a;
          return a;
        } catch (t) {
          throw (delete r[e], t);
        }
      return null;
    };
    return e;
  })(),
  nq = (function (e) {
    function t(t, n, entry) {
      var r = e.call(this, t, n) || this;
      r.entry = entry;
      return r;
    }
    __extends(t, e);
    t.prototype.keys = function () {
      return this.entry.keys();
    };
    t.prototype.objectAccess = function (e) {
      return this.entry.getByIdentifier(e);
    };
    t.type = "ThisFile";
    return t;
  })(HH),
  iq = (function (e) {
    function t(formulaResults) {
      var n = e.call(this) || this;
      n.icon = "lucide-square-function";
      n.formulaResults = formulaResults;
      return n;
    }
    __extends(t, e);
    t.prototype.toString = function () {
      return "Formulas".concat(JSON.stringify(Object.keys(this.formulaResults.formulas)));
    };
    t.prototype.isTruthy = function () {
      return !0;
    };
    t.prototype.keys = function () {
      return Object.keys(this.formulaResults.formulas);
    };
    t.prototype.objectAccess = function (e) {
      return this.formulaResults.getFormulaValue(e);
    };
    t.type = "Formulas";
    return t;
  })(SH),
  rq = i18nProxy.plugins.bases,
  oq = (function () {
    function e() {}
    e.prototype.getFilterRules = function () {
      return this.getFilterRulesWithNegation(!1);
    };
    e.prototype.getFilterRulesWithNegation = function (negated) {
      if (this instanceof aq)
        return [
          {
            rule: this,
            negated: negated,
          },
        ];
      if (this instanceof sq) {
        for (var t = [], n = this instanceof uq, i = 0, r = this.filters; i < r.length; i++) {
          var o = r[i];
          t.push.apply(t, o.getFilterRulesWithNegation(negated !== n));
        }
        return t;
      }
      return [];
    };
    e.prototype.optimize = function () {
      return this;
    };
    e.and = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return (e = e.filter(Boolean)).length === 1 ? e[0] : new lq(e).optimize();
    };
    e.or = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return (e = e.filter(Boolean)).length === 1 ? e[0] : new cq(e).optimize();
    };
    e.not = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      e = e.filter(Boolean);
      return new uq(e).optimize();
    };
    return e;
  })(),
  aq = (function (e) {
    function t(rule) {
      var n = e.call(this) || this;
      n.rule = rule;
      return n;
    }
    __extends(t, e);
    t.prototype.hasError = function () {
      return this.rule.formula instanceof Nz;
    };
    t.prototype.serialize = function () {
      return this.rule.toString();
    };
    t.prototype.test = function (e) {
      return this.rule.test(e);
    };
    return t;
  })(oq),
  sq = (function (e) {
    function t(conjunction, filters) {
      var i = e.call(this) || this;
      i.conjunction = conjunction;
      i.filters = filters;
      return i;
    }
    __extends(t, e);
    t.prototype.hasError = function () {
      return this.filters.some(function (e) {
        return e.hasError();
      });
    };
    t.prototype.serialize = function () {
      var e = this.filters.map(function (e) {
        return e.serialize();
      });
      switch (this.conjunction) {
        case "and":
          return {
            and: e,
          };
        case "or":
          return {
            or: e,
          };
        case "not":
          return {
            not: e,
          };
      }
    };
    return t;
  })(oq),
  lq = (function (e) {
    function t(t) {
      return e.call(this, "and", t) || this;
    }
    __extends(t, e);
    t.prototype.optimize = function () {
      for (var e = [], n = 0, i = this.filters; n < i.length; n++) {
        var r = i[n].optimize();
        if (r) {
          r instanceof t ? e.push.apply(e, r.filters) : e.push(r);
        }
      }
      return e.length === 0 ? null : e.length === 1 ? e[0] : new t(e);
    };
    t.prototype.test = function (e) {
      for (var t = 0, n = this.filters; t < n.length; t++) {
        if (!n[t].test(e)) return !1;
      }
      return !0;
    };
    return t;
  })(sq),
  cq = (function (e) {
    function t(t) {
      return e.call(this, "or", t) || this;
    }
    __extends(t, e);
    t.prototype.optimize = function () {
      for (var e = [], n = 0, i = this.filters; n < i.length; n++) {
        var r = i[n].optimize();
        if (r) {
          r instanceof t ? e.push.apply(e, r.filters) : e.push(r);
        }
      }
      return e.length === 0 ? null : e.length === 1 ? e[0] : new t(e);
    };
    t.prototype.test = function (e) {
      for (var t = 0, n = this.filters; t < n.length; t++) {
        if (n[t].test(e)) return !0;
      }
      return !1;
    };
    return t;
  })(sq),
  uq = (function (e) {
    function t(t) {
      return e.call(this, "not", t) || this;
    }
    __extends(t, e);
    t.prototype.optimize = function () {
      for (var e = [], n = 0, i = this.filters; n < i.length; n++) {
        var r = i[n].optimize();
        if (r) {
          e.push(r);
        }
      }
      if (e.length === 0) return null;
      if (e.length === 1) {
        var o = e[0];
        if (o instanceof t) return new lq(o.filters).optimize();
      }
      return new t(e);
    };
    t.prototype.test = function (e) {
      for (var t = 0, n = this.filters; t < n.length; t++) {
        if (n[t].test(e)) return !1;
      }
      return !0;
    };
    return t;
  })(sq),
  hq = {
    "file.file": rq.labelFilePropFile,
    "file.name": rq.labelFilePropName,
    "file.basename": rq.labelFilePropBaseName,
    "file.fullname": rq.labelFilePropFullName,
    "file.path": rq.labelFilePropPath,
    "file.folder": rq.labelFilePropFolder,
    "file.ext": rq.labelFilePropExt,
    "file.ctime": rq.labelFilePropCtime,
    "file.mtime": rq.labelFilePropMtime,
    "file.size": rq.labelFilePropSize,
    "file.links": rq.labelFilePropLinks,
    "file.backlinks": rq.labelFilePropBacklinks,
    "file.embeds": rq.labelFilePropEmbeds,
    "file.tags": rq.labelFilePropTags,
  },
  pq = (function () {
    function e(query, propertyId) {
      this.unrecognizedData = {};
      this.query = query;
      this.propertyId = propertyId;
    }
    e.deserialize = function (t, n, i) {
      for (var r = new e(t, n), o = 0, a = Object.keys(i); o < a.length; o++) {
        var s = a[o],
          displayName = i[s];
        if (s === "displayName") {
          if (String.isString(displayName)) {
            r.displayName = displayName;
          }
        } else r.unrecognizedData[s] = displayName;
      }
      return r;
    };
    e.prototype.serialize = function () {
      var e = Object.assign({}, this.unrecognizedData);
      this.displayName && (e.displayName = this.displayName);
      return Object.keys(e).length > 0 ? e : null;
    };
    e.prototype.getDisplayName = function () {
      return this.displayName
        ? this.displayName
        : Object.hasOwn(hq, this.propertyId)
          ? hq[this.propertyId]()
          : Xz(this.propertyId).name;
    };
    e.prototype.setDisplayName = function (displayName) {
      this.displayName = displayName;
      this.query.save();
    };
    e.prototype.migrateDisplayName = function (displayName) {
      if (!this.displayName) {
        this.displayName = displayName;
      }
    };
    return e;
  })(),
  dq = [
    {
      property: "file.name",
      direction: "ASC",
    },
  ],
  fq = ["file.name"],
  mq = (function () {
    function e(query, type, name) {
      this.query = query;
      this.type = type;
      this.name = name;
    }
    e.prototype.clone = function (name) {
      var t = this.serialize();
      t.name = name;
      return wq(this.query, t, this.query.views.length);
    };
    e.prototype.serialize = function () {
      var e = {
        type: this.type,
        name: this.name,
      };
      if (
        (this.filters && (e.filters = this.filters.serialize()),
        this.groupBy && (e.groupBy = yq(this.groupBy)),
        this.order && (e.order = this.order.map(yq)),
        this.sort &&
          (e.sort = this.sort.map(function (e) {
            return {
              property: yq(e.property),
              direction: e.direction,
            };
          })),
        this.limit && (e.limit = this.limit),
        this.aggregations)
      )
        for (var t = (e.aggregations = {}), n = 0, i = Object.keys(this.aggregations); n < i.length; n++) {
          var r = i[n];
          t[yq(r)] = this.aggregations[r];
        }
      if (this.data)
        for (var o = 0, a = Object.keys(this.data); o < a.length; o++) {
          var s = a[o];
          if (!this.hasOwnProperty(s)) {
            e[s] = this.data[s];
          }
        }
      return e;
    };
    e.prototype.getViewName = function () {
      return this.name;
    };
    e.prototype.getAll = function () {
      return this.data || {};
    };
    e.prototype.get = function (e) {
      var t;
      return (t = this.data) === null || undefined === t ? undefined : t[e];
    };
    e.prototype.set = function (e, t) {
      this.data || (this.data = {});
      t === null ? delete this.data[e] : (this.data[e] = t);
      this.query.save();
    };
    e.prototype.getOrder = function () {
      return this.order || fq.slice();
    };
    e.prototype.setOrder = function (order) {
      this.order = order;
      this.query.save();
    };
    e.prototype.getSort = function () {
      return this.sort || [];
    };
    e.prototype.setSortProperty = function (propertye0, direction) {
      var sort = this.getSort(),
        i = sort.findIndex(function (t) {
          return t.property === propertye0;
        });
      if (i >= 0) {
        if (direction === "TOGGLE") direction = sort[i].direction === "ASC" ? "DESC" : "NONE";
        sort.splice(i, 1);
      }
      direction === "TOGGLE" && (direction = "ASC");
      (direction !== "ASC" && direction !== "DESC") ||
        sort.unshift({
          property: propertye0,
          direction: direction,
        });
      this.sort = sort;
      this.query.save();
    };
    e.prototype.setLimit = function (limit) {
      this.limit = limit;
      this.query.save();
    };
    e.prototype.getLimit = function () {
      return this.limit || 0;
    };
    e.prototype.getDisplayName = function (e) {
      return this.getPropertyConfig(e).getDisplayName();
    };
    e.prototype.getPropertyConfig = function (e) {
      return this.query.getPropertyConfig(e);
    };
    return e;
  })(),
  gq = (function () {
    function e() {
      this.views = [];
      this.unrecognizedData = {};
      this.properties = {};
    }
    e.fromString = function (t) {
      if (t.trim() === "") {
        var n = new e();
        n.views.push(new mq(n, "table", rq.labelViewTypeTable()));
        return n;
      }
      return e.parse(parseYaml(t));
    };
    e.parse = function (t) {
      if (typeof t != "object") throw new Error(rq.msgErrorInvalidQueryFormat());
      var n = t,
        i = n.views,
        r = n.filters,
        o = n.display,
        a = n.properties,
        s = n.formulas,
        newItemFolder = n.newItemFolder,
        newItemTemplate = n.newItemTemplate;
      if (undefined === i) i = [];
      else if (!Array.isArray(i)) throw new Error(rq.msgErrorViewType());
      var u = new e();
      u.views = [];
      for (var h = 0; h < i.length; h++) u.views.push(wq(u, i[h], h + 1));
      if (
        (u.views.length === 0 && u.views.push(new mq(u, "table", rq.labelViewTypeTable())), r && (u.filters = vq(r)), a)
      ) {
        if (typeof a != "object") throw new Error(rq.msgErrorInvalidPropertiesSection());
        for (var p = a, d = 0, f = Object.keys(p); d < f.length; d++) {
          if ((y = p[(x = f[d])]) != null) {
            if (typeof y != "object") throw new Error(rq.msgErrorInvalidPropertiesSection());
            u.properties[x] = pq.deserialize(u, bq(x), y);
          }
        }
      }
      if (o) {
        if (typeof o != "object")
          throw new Error(
            rq.msgErrorMustBeAType({
              key: "display",
              type: "object",
            }),
          );
        for (var m = o, g = 0, v = Object.keys(m); g < v.length; g++) {
          var y;
          if (typeof (y = m[(x = v[g])]) != "string")
            throw new Error(
              rq.msgErrorDisplayValues({
                key: x,
              }),
            );
          u.getPropertyConfig(bq(x)).migrateDisplayName(y);
        }
      }
      if (((u.formulas = {}), s)) {
        if (typeof s != "object")
          throw new Error(
            rq.msgErrorMustBeAType({
              key: "formulas",
              type: "object",
            }),
          );
        for (var b = s, w = 0, k = Object.keys(b); w < k.length; w++) {
          var C = b[(x = k[w])];
          if (typeof C != "string")
            throw new Error(
              rq.msgErrorFormulaValues({
                key: x,
              }),
            );
          u.formulas[x] = new Dz(C);
        }
      }
      if (newItemFolder) {
        if (!String.isString(newItemFolder))
          throw new Error(
            rq.msgErrorMustBeAType({
              key: "newItemFolder",
              type: "string",
            }),
          );
        u.newItemFolder = newItemFolder;
      }
      if (newItemTemplate) {
        if (!String.isString(newItemTemplate))
          throw new Error(
            rq.msgErrorMustBeAType({
              key: "newItemTemplate",
              type: "string",
            }),
          );
        u.newItemTemplate = newItemTemplate;
      }
      for (var E = t, S = 0, M = Object.keys(t); S < M.length; S++) {
        var x;
        switch ((x = M[S])) {
          case "views":
          case "filters":
          case "display":
          case "properties":
          case "formulas":
          case "newItemFolder":
          case "newItemTemplate":
            continue;
          default:
            u.unrecognizedData[x] = E[x];
        }
      }
      return u;
    };
    e.prototype.getSerializable = function () {
      var e = Object.assign({}, this.unrecognizedData);
      if ((this.filters && (e.filters = this.filters.serialize()), this.formulas)) {
        var t = Object.keys(this.formulas);
        if (t.length > 0) {
          e.formulas = {};
          for (var n = 0, i = t; n < i.length; n++) {
            var r = i[n];
            e.formulas[r] = this.formulas[r].toString();
          }
        }
      }
      for (var properties = {}, a = true, s = 0, l = Object.keys(this.properties); s < l.length; s++) {
        r = l[s];
        var c = this.properties[r].serialize();
        if (c !== null) {
          a = false;
          properties[r] = c;
        }
      }
      a || (e.properties = properties);
      this.views &&
        (e.views = this.views.map(function (e) {
          return e.serialize();
        }));
      this.newItemFolder && (e.newItemFolder = this.newItemFolder);
      this.newItemTemplate && (e.newItemTemplate = this.newItemTemplate);
      return e;
    };
    e.prototype.toString = function () {
      var e = this.getSerializable();
      return Object.keys(e).length > 0 ? stringifyYaml(e) : "";
    };
    e.prototype.clone = function () {
      var t = this.getSerializable();
      return e.parse(t);
    };
    e.prototype.save = function () {
      if (this.saveFn) {
        this.saveFn(this);
      }
    };
    e.prototype.setGlobalFilters = function (e) {
      e ? (this.filters = vq(e)) : delete this.filters;
      this.save();
    };
    e.prototype.setViewFilters = function (e, t) {
      var n = this.getViewConfig(e);
      if (!n) throw new Error("Invalid view specified");
      t ? (n.filters = vq(t)) : delete n.filters;
      this.save();
    };
    e.prototype.setFormulas = function (formulas) {
      this.formulas = formulas;
      this.save();
    };
    e.prototype.getPropertyConfig = function (e) {
      var t = this.properties;
      return Object.hasOwn(t, e) ? t[e] : (t[e] = new pq(this, e));
    };
    e.prototype.removeFormula = function (e) {
      var t;
      if (this.formulas && this.formulas.hasOwnProperty(e)) {
        var n = Qz("formula", e);
        delete this.formulas[e];
        delete this.properties[n];
        for (var i = 0, r = this.views; i < r.length; i++) {
          var o = r[i];
          (t = o.order) === null || undefined === t || t.remove(n);
          o.sort &&
            (o.sort = o.sort.filter(function (e) {
              return e.property !== n;
            }));
          o.aggregations && delete o.aggregations[n];
          o.groupBy === n && delete o.groupBy;
        }
        this.save();
      }
    };
    e.prototype.getViewConfig = function (e) {
      if (!e) return this.views[0];
      for (var t = 0, n = this.views; t < n.length; t++) {
        var i = n[t];
        if (i.name === e) return i;
      }
      return null;
    };
    return e;
  })();
function vq(e) {
  if (typeof e == "string") return new aq(new Dz(e));
  if (typeof e != "object") throw new Error(rq.msgErrorFilterType());
  var t = e,
    n = Object.keys(t);
  if (n.length !== 1) throw new Error(rq.msgErrorFilterAllowedKeys());
  switch (n[0]) {
    case "and":
      var i = t.and;
      if (!Array.isArray(i))
        throw new Error(
          rq.msgErrorFilterMustBeArray({
            conjunction: "and",
          }),
        );
      return new lq(i.map(vq));
    case "or":
      var r = t.or;
      if (!Array.isArray(r))
        throw new Error(
          rq.msgErrorFilterMustBeArray({
            conjunction: "or",
          }),
        );
      return new cq(r.map(vq));
    case "not":
      var o = t.not;
      if (!Array.isArray(o))
        throw new Error(
          rq.msgErrorFilterMustBeArray({
            conjunction: "not",
          }),
        );
      return new uq(o.map(vq));
    default:
      throw new Error(rq.msgErrorFilterAllowedKeys());
  }
}
function yq(e) {
  if (e.length > 5 && e.startsWith("note.")) {
    var t = e.substring(5),
      n = t.split(".")[0];
    return ["file", "formula", "note"].contains(n) ? e : t;
  }
  return e === "file.file" ? "file" : e;
}
function bq(e) {
  return e.startsWith("note.") || e.startsWith("formula.") || e.startsWith("file.")
    ? e
    : e === "file"
      ? "file.file"
      : "note.".concat(e);
}
function wq(e, t, index) {
  if (typeof t != "object")
    throw new Error(
      rq.msgErrorViewInvalidFormat({
        index: index,
      }),
    );
  var i = t,
    viewName = i.name;
  if (!viewName || typeof viewName != "string")
    throw new Error(
      rq.msgErrorViewNameInvalid({
        index: index,
      }),
    );
  var o = i.type;
  if (!o)
    throw new Error(
      rq.msgErrorViewMissingRequiredKey({
        key: "type",
        viewName: viewName,
      }),
    );
  if (typeof o != "string")
    throw new Error(
      rq.msgErrorViewIncorrectType({
        key: "type",
        type: "string",
        viewName: viewName,
      }),
    );
  for (var a = new mq(e, o, viewName), s = 0, l = Object.keys(i); s < l.length; s++) {
    var c = l[s];
    switch (c) {
      case "type":
      case "name":
        break;
      case "filters":
        try {
          a.filters = vq(i.filters);
        } catch (e) {
          throw new Error(
            rq.msgErrorViewParsingFilters({
              message: e.message,
              viewName: viewName,
            }),
          );
        }
        break;
      case "groupBy":
        if (typeof i.groupBy != "string")
          throw new Error(
            rq.msgErrorViewIncorrectType({
              key: "groupBy",
              type: "string",
              viewName: viewName,
            }),
          );
        a.groupBy = bq(i.groupBy);
        break;
      case "aggregations":
        if (typeof i.aggregations != "object")
          throw new Error(
            rq.msgErrorViewIncorrectType({
              key: "aggregations",
              type: "object",
              viewName: viewName,
            }),
          );
        a.aggregations = {};
        for (var u = i.aggregations, h = 0, p = Object.keys(u); h < p.length; h++) {
          var d = p[h],
            f = u[d];
          if (typeof f != "string")
            throw new Error(
              rq.msgErrorViewIncorrectValueType({
                key: "aggregations",
                type: "string",
                viewName: viewName,
              }),
            );
          a.aggregations[bq(d)] = f;
        }
        break;
      case "order":
        if (!Array.isArray(i.order))
          throw new Error(
            rq.msgErrorViewIncorrectType({
              key: "order",
              type: "array",
              viewName: viewName,
            }),
          );
        a.order = i.order.map(bq);
        break;
      case "sort":
        if (Array.isArray(i.sort)) {
          a.sort = [];
          for (var m = 0, g = i.sort; m < g.length; m++) {
            var v = g[m];
            if (v.column) {
              v.property = v.column;
            }
            var y = v.property,
              direction = v.direction;
            if (y && String.isString(y) && (direction === "ASC" || direction === "DESC")) {
              a.sort.push({
                property: bq(y),
                direction: direction,
              });
            }
          }
        }
        break;
      case "limit":
        if (Number.isNumber(i.limit) && i.limit > 0) {
          a.limit = i.limit;
        }
        break;
      default:
        a.data || (a.data = {});
        a.data[c] = i[c];
    }
  }
  return a;
}
var kq = (function () {
  function e(controller) {
    this.cachedProps = null;
    this.controller = controller;
    this.app = controller.app;
  }
  e.prototype.cacheProps = function () {
    if (this.cachedProps) return this.cachedProps;
    var e = this.app.metadataTypeManager;
    this.cachedProps = {};
    for (
      var t = this.cachedProps, n = 0, i = Object.keys(this.app.metadataTypeManager.getAllProperties());
      n < i.length;
      n++
    ) {
      var r = i[n],
        o = e.getPropertyInfo(r);
      t[o.name] = Cq(o.widget);
    }
    return t;
  };
  e.prototype.reset = function () {
    this.cachedProps = null;
    this.formulaResults = new tq(this, this.controller.ctx.formulas);
  };
  e.prototype.keys = function () {
    var e = new Set(Object.keys(this.cacheProps()));
    e.add("this");
    e.add("note");
    e.add("file");
    e.add("formula");
    return Array.from(e);
  };
  e.prototype.getByIdentifier = function (e) {
    switch (e.toLowerCase()) {
      case "this":
        return new nq(this.app, this.app.workspace.getActiveFile(), this);
      case "note":
        return new OH(this.cacheProps());
      case "file":
        return new HH(this.app, this.app.workspace.getActiveFile());
      case "formula":
        return new iq(this.formulaResults);
    }
    var t = this.cacheProps();
    e = KO(t, e);
    return Object.hasOwn(t, e) ? t[e] : EH.value;
  };
  return e;
})();
function Cq(e) {
  switch (e) {
    case "file":
    case "folder":
    case "text":
      return new xH("");
    case "number":
      return new TH(0);
    case "checkbox":
      return new DH(!0);
    case "date":
      return new NH(new Date(), !1);
    case "datetime":
      return new NH(new Date(), !0);
    case "tags":
      return new IH([""]);
    case "aliases":
    case "multitext":
      return new AH([""]);
  }
  return EH.value;
}
function vU(e, t) {
  for (var n = t, i = 2; e.has(n); ) {
    n = "".concat(t, " ").concat(i);
    i++;
  }
  return n;
}
function yU(e) {
  if (e === "") return "";
  var t = Xz(e),
    n = t.name,
    i = t.type;
  return i === "file" && n === "file"
    ? "file"
    : Iz(n)
      ? "".concat(i, "[").concat(JSON.stringify(n), "]")
      : i === "note"
        ? n
        : "".concat(i, ".").concat(n);
}
function bU() {
  return [
    EditorView.lineWrapping,
    history(),
    qV(),
    closeBrackets(),
    keymap.of(
      __spreadArray(__spreadArray(__spreadArray([], closeBracketsKeymap, !0), historyKeymap, !0), completionKeymap, !0),
    ),
  ];
}
function wU(e) {
  var t = function (t) {
    return e === t || t.isPrototypeOf(e);
  };
  return t(xH) || t(EH)
    ? "text"
    : t(TH)
      ? "number"
      : t(AH)
        ? "multitext"
        : t(DH)
          ? "checkbox"
          : t(NH)
            ? "date"
            : "unknown";
}
var kU,
  CU = (function (e) {
    function t(queryController, n) {
      var i = e.call(this, queryController.app, n) || this;
      i.queryController = queryController;
      return i;
    }
    __extends(t, e);
    t.prototype.renderSuggestion = function (e, t) {
      if ((t.addClasses(["mod-complex", "mod-toggle"]), this.value && this.value.value === e.value)) {
        setIcon(t.createDiv("suggestion-icon mod-checked"), "lucide-check");
      }
      t.createDiv("suggestion-icon").createSpan("suggestion-flair", function (t) {
        return setIcon(t, e.icon);
      });
      var n = Xz(e.value),
        i = n.type,
        r = n.name,
        o = t.createDiv("suggestion-content"),
        a = t.createDiv("suggestion-aux");
      o.createDiv({
        cls: "suggestion-title",
        text: e.display,
      });
      ((i === "file" && r !== "file") || r !== e.display) &&
        renderResults(a.createSpan("suggestion-flair u-small"), e.value, e);
    };
    t.prototype.filterProperties = function (filterExpr) {
      this.filterExpr = filterExpr;
      return this;
    };
    t.prototype.setValueById = function (e) {
      var t = this.getItems().find(function (t) {
        return t.value === e;
      });
      if (t) this.setValue(t);
      else if (e) {
        var value = e,
          display = this.queryController.getViewConfig().getDisplayName(value);
        this.setValue({
          value: value,
          icon: "lucide-file-question",
          display: display,
        });
      } else this.setValue(null);
      return this;
    };
    t.prototype.getItems = function () {
      var e = this.queryController,
        t = e.getViewConfig(),
        n = Object.values(this.app.metadataTypeManager.getAllProperties()),
        i = e
          .getProperties()
          .filter(function (e) {
            return Xz(e).type !== "note";
          })
          .concat(
            n.map(function (e) {
              return "note.".concat(e.name);
            }),
          );
      this.filterExpr && (i = i.filter(this.filterExpr));
      return i.map(function (value) {
        return {
          value: value,
          display: t.getDisplayName(value),
          icon: e.getMockValueForIdent(yU(value)).icon,
        };
      });
    };
    return t;
  })(XT),
  EU = (function () {
    function e(e, t, textn0, i) {
      var r = this;
      this.enabled = true;
      (this.scope = new Scope(e.scope)).register([], "Escape", function () {
        return r.setOpen(!1);
      });
      var o = (this.containerEl = t.createDiv("query-toolbar-item"));
      this.buttonEl = o.createDiv(
        {
          cls: "text-icon-button",
          attr: {
            tabindex: 0,
          },
        },
        function (e) {
          r.buttonIconEl = e.createSpan("text-button-icon", function (e) {
            return setIcon(e, i);
          });
          r.buttonTextEl = e.createSpan({
            cls: "text-button-label",
            text: textn0,
          });
          e.addEventListener("click", function (e) {
            e.preventDefault();
            r.toggle();
          });
          e.addEventListener("keydown", function (e) {
            if (!(e.isComposing || e.defaultPrevented || (e.key !== " " && e.key !== "Enter"))) {
              r.setOpen(!r.menu.isOpen);
            }
          });
        },
      );
      this.menu = new SU(e, this.buttonEl, textn0);
    }
    e.prototype.addClass = function (e) {
      this.containerEl.addClass(e);
      this.menu.menuEl.addClass(e);
    };
    Object.defineProperty(e.prototype, "scrollEl", {
      get: function () {
        return this.menu.scrollEl;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.onOpen = function (handleOpen) {
      this.menu.handleOpen = handleOpen;
      return this;
    };
    e.prototype.onClose = function (handleClose) {
      this.menu.handleClose = handleClose;
      return this;
    };
    e.prototype.setButtonText = function (e) {
      this.buttonTextEl.setText(e);
    };
    e.prototype.setButtonIcon = function (e) {
      setIcon(this.buttonIconEl, e);
    };
    e.prototype.setEnabled = function (enabled) {
      this.enabled = enabled;
      this.buttonEl.toggleClass("is-disabled", !enabled);
      !enabled && this.menu.isOpen && this.setOpen(!1);
      return this;
    };
    e.prototype.setOpen = function (e) {
      if (!(e && !this.enabled)) {
        e && this.menu.setAutoDestroy(this.buttonEl);
        this.menu.setOpen(e);
      }
    };
    e.prototype.toggle = function () {
      this.setOpen(!this.menu.isOpen);
    };
    return e;
  })(),
  SU = (function () {
    function e(app, parentEl, textn0) {
      var i = this;
      this.enabled = true;
      this._isOpen = false;
      this._cleanup = null;
      this.app = app;
      this.parentEl = parentEl;
      (this.scope = new Scope(app.scope)).register([], "Escape", function () {
        return i.setOpen(!1);
      });
      var r = (this.bgEl = createDiv("suggestion-bg"));
      r.style.opacity = "0";
      r.addEventListener("mousedown", function (e) {
        return e.preventDefault();
      });
      r.onClickEvent(function () {
        return i.setOpen(!1);
      });
      var o = (this.menuEl = createDiv("menu query-toolbar-menu"));
      o.createDiv("menu-grabber");
      var a = (this.mobileHeaderEl = o.createDiv("modal-header"));
      this.mobileTitleEl = a.createDiv({
        cls: "modal-title",
        text: textn0,
      });
      a.createDiv({
        cls: "modal-cta-button",
        text: i18nProxy.dialogue.buttonDone(),
      }).addEventListener("click", function (e) {
        e.preventDefault();
        i.setOpen(!1);
      });
      var s = (this.scrollEl = o.createDiv("menu-scroll"));
      if (Platform.isPhone) {
        _M(o, s, r, function () {
          i.menuEl.detach();
          i.setOpen(!1);
        });
      }
    }
    e.prototype.isNodeOutside = function (e) {
      return !e.closest(".suggestion-container") && !this.parentEl.contains(e) && !this.menuEl.contains(e);
    };
    e.prototype.registerOnClickOutside = function () {
      var e,
        t = this,
        n = this.parentEl,
        i = n.doc,
        r = n.win,
        o = false,
        a = function (e) {
          if (t.isNodeOutside(e.target)) {
            t.setOpen(!1);
            o = false;
          }
        },
        s = function (e) {
          o = false;
          !e.defaultPrevented && t.isNodeOutside(e.targetNode) && (o = true);
        },
        l = function () {
          if (t._isOpen)
            return o
              ? (t.setOpen(!1), void (o = false))
              : void r.setTimeout(function () {
                  var e = i.activeElement;
                  if (e !== i.body && t.isNodeOutside(e)) {
                    t.setOpen(!1);
                    o = false;
                  }
                }, 0);
        };
      r.addEventListener("auxclick", a);
      r.addEventListener("mousedown", s);
      r.addEventListener("click", l);
      (e = this._cleanup) === null || undefined === e || e.call(this);
      this._cleanup = function () {
        r.removeEventListener("auxclick", a);
        r.removeEventListener("mousedown", s);
        r.removeEventListener("click", l);
      };
    };
    e.prototype.onOpen = function (handleOpen) {
      this.handleOpen = handleOpen;
      return this;
    };
    e.prototype.onClose = function (handleClose) {
      this.handleClose = handleClose;
      return this;
    };
    Object.defineProperty(e.prototype, "isOpen", {
      get: function () {
        return this._isOpen;
      },
      enumerable: false,
      configurable: true,
    });
    e.prototype.position = function () {
      positionFloatingElement(this.parentEl.getBoundingClientRect(), this.menuEl, {
        preventOverlap: true,
        gap: 4,
      });
    };
    e.prototype.watchResize = function () {
      var e = this;
      if (!this.observer) {
        var t = 0,
          n = 0;
        this.observer = new ResizeObserver(function () {
          var i = Date.now();
          i - n > 100 && ((n = i), (t = 0));
          ++t >= 10 || e.position();
        });
      }
      this.observer.observe(this.menuEl);
    };
    e.prototype.setAutoDestroy = function (e) {
      var t,
        n = this;
      (t = this.autoDestroy) === null || undefined === t || t.call(this);
      this.autoDestroy = waitForElementHidden(e, 500, function () {
        n.setOpen(!1);
      });
    };
    e.prototype.setOpen = function (_isOpen) {
      var t,
        n,
        i,
        r,
        o = this;
      if (this._isOpen !== _isOpen && (!_isOpen || this.enabled)) {
        var a = this,
          s = a.menuEl,
          l = a.bgEl,
          c = a.parentEl;
        if (((this._isOpen = _isOpen), c.toggleClass("has-active-menu", _isOpen), _isOpen)) {
          this.app.keymap.pushScope(this.scope);
          c.win.setTimeout(function () {
            return o.registerOnClickOutside();
          }, 0);
          (t = this.handleOpen) === null || undefined === t || t.call(this);
          var u = this.parentEl.doc.body;
          if ((u.appendChild(l), u.appendChild(s), Platform.isPhone)) {
            if (Platform.isMobileApp && keyboardPlugin) {
              keyboardPlugin.hide();
            }
            var h = s.offsetHeight - 1;
            fl(
              s,
              new cl({
                duration: 150,
                fn: "var(--anim-motion-swing)",
              }).addProp("transform", "translateY(".concat(h, "px)"), ""),
            );
            fl(
              l,
              new cl({
                duration: 150,
              }).addProp("opacity", "0", "0.85"),
            );
          } else {
            this.position();
            this.watchResize();
          }
        } else if (
          (this.autoDestroy && (this.autoDestroy(), (this.autoDestroy = null)),
          (n = this.handleClose) === null || undefined === n || n.call(this),
          (i = this._cleanup) === null || undefined === i || i.call(this),
          this.app.keymap.popScope(this.scope),
          Platform.isPhone && s.isShown())
        ) {
          h = s.offsetHeight - 1;
          fl(
            s,
            new cl({
              duration: 150,
            }).addProp("transform", "", "translateY(".concat(h, "px)")),
            function () {
              s.detach();
            },
          );
          fl(
            l,
            new cl({
              duration: 150,
            }).addProp("opacity", null, "0"),
            function () {
              l.detach();
            },
          );
        } else {
          var p = this.menuEl.contains(this.menuEl.doc.activeElement);
          this.bgEl.detach();
          this.menuEl.detach();
          (r = this.observer) === null || undefined === r || r.disconnect();
          this.observer = null;
          p && c.focus();
        }
      }
    };
    e.prototype.toggle = function () {
      this.setOpen(!this._isOpen);
    };
    return e;
  })(),
  MU = require("./modules/5897.js"),
  xU = MU.default,
  TU = require("./modules/1928.js"),
  DU = TU.default,
  AU = (function () {
    function e() {
      this.cache = {};
      this.uniqueFiles = new tc();
      this.aliases = {};
      this.permalinks = {};
    }
    e.prototype.load = function (cache) {
      return __awaiter(this, undefined, undefined, function () {
        var t, n, i, r, o, a, s, l, c;
        return __generator(this, function (u) {
          for (n in ((this.cache = cache), (t = this.uniqueFiles = new tc()), cache))
            if (
              cache.hasOwnProperty(n) &&
              (t.add(getFilename(n).toLowerCase(), n), (i = cache[n]) && (normalizeCachePositions(i), (r = i.frontmatter)))
            ) {
              if ((o = parseFrontMatterAliases(r)))
                for (a = 0, s = o; a < s.length; a++) {
                  l = s[a];
                  this.aliases[l.toLowerCase()] = n;
                }
              if ((c = r.permalink) && typeof c == "string") {
                c.startsWith("/") && (c = c.substring(1));
                this.permalinks[c] = n;
              }
            }
          return [2];
        });
      });
    };
    e.prototype.getCache = function (e) {
      var t = this.cache;
      return t.hasOwnProperty(e) ? t[e] : null;
    };
    e.prototype.has = function (e) {
      return this.cache.hasOwnProperty(e);
    };
    e.prototype.getLinktextDest = function (e, t) {
      var n = getLinkpath(e);
      return this.getLinkpathDest(n, t);
    };
    e.prototype.getLinkpathDest = function (e, t) {
      if (e === "" && t && this.cache.hasOwnProperty(t)) return t;
      var n = this._getLinkpathDest(e, t);
      if (n.length > 0) return n[0];
      if ((n = this._getLinkpathDest(e + ".md", t)).length > 0) return n[0];
      var i = this.aliases,
        r = e.toLowerCase();
      if (i.hasOwnProperty(r)) return i[r];
      var o = getFilename(e);
      return i.hasOwnProperty(o) ? i[o] : null;
    };
    e.prototype._getLinkpathDest = function (e, t) {
      var n = e.toLowerCase(),
        i = getFilename(n),
        r = this.uniqueFiles.get(i);
      if (!r) return [];
      var o = Zc(t).toLowerCase();
      if (n.startsWith("./") || n.startsWith("../")) {
        if ((n.startsWith("./../") && (n = n.substr(2)), n.startsWith("./"))) {
          o !== "" && (o += "/");
          n = o + n.substring(2);
        } else {
          for (; n.startsWith("../"); ) {
            n = n.substr(3);
            o = Zc(o);
          }
          o !== "" && (o += "/");
          n = o + n;
        }
        for (var a = 0, s = r; a < s.length; a++) {
          if ((m = (f = s[a]).toLowerCase()) === n) return [f];
        }
      }
      for (var l = 0, c = r; l < c.length; l++) {
        if ((m = (f = c[l]).toLowerCase()) === n) return [f];
      }
      for (var u = [], h = [], p = 0, d = r; p < d.length; p++) {
        var f, m;
        if ((m = (f = d[p]).toLowerCase()).endsWith(n)) {
          m.startsWith(o) ? u.push(f) : h.push(f);
        }
      }
      u.sort(function (e, t) {
        return e.length - t.length;
      });
      h.sort(function (e, t) {
        return e.length - t.length;
      });
      return u.concat(h);
    };
    return e;
  })(),
  PU = "indexFile",
  LU = "siteName",
  IU = "logo",
  OU = "noindex",
  FU = "defaultTheme",
  NU = "showThemeToggle",
  RU = "showNavigation",
  BU = "showGraph",
  VU = "showOutline",
  HU = "showSearch",
  zU = "googleAnalytics",
  qU = "hideTitle",
  WU = "readableLineLength",
  UU = "strictLineBreaks",
  _U = "showHoverPreview",
  jU = "showBacklinks",
  GU = "slidingWindowMode",
  KU = "navigationOrdering",
  YU = "navigationHiddenItems",
  ZU =
    (((kU = {})[PU] = ""),
    (kU[IU] = ""),
    (kU[LU] = ""),
    (kU[OU] = false),
    (kU[FU] = "light"),
    (kU[NU] = false),
    (kU[RU] = true),
    (kU[BU] = true),
    (kU[VU] = false),
    (kU[HU] = false),
    (kU[zU] = ""),
    (kU[qU] = false),
    (kU[WU] = true),
    (kU[UU] = false),
    (kU[_U] = false),
    (kU[jU] = false),
    (kU[GU] = false),
    (kU[KU] = []),
    (kU[YU] = []),
    kU),
  XU = 0.2,
  QU = function (e, t, n) {
    undefined === n && (n = 0.9);
    return e * n + t * (1 - n);
  },
  $U = function (e, t) {
    return (
      (QU((e >> 16) & 255, (t >> 16) & 255) << 16) +
      (QU((e >> 8) & 255, (t >> 8) & 255) << 8) +
      (0 | QU(255 & e, 255 & t))
    );
  },
  JU = function (e, t) {
    return t.right < e.left || t.left > e.right || t.bottom < e.top || t.top > e.bottom;
  },
  e_ = function (e, t, n) {
    return {
      left: e - n,
      right: e + n,
      top: t - n,
      bottom: t + n,
    };
  },
  t_ = function (e) {
    e.style.margin = "0";
    e.style.padding = "0";
    e.style.border = "0";
    e.style.width = "100%";
    e.style.height = "100%";
    e.style.overflow = "hidden";
  },
  n_ = {
    showAttachments: false,
    hideUnresolved: false,
    showOrphans: true,
    showTags: false,
    localFile: null,
    localJumps: 1,
    localInterlinks: false,
    localForelinks: true,
    localBacklinks: true,
  };
function i_(type) {
  undefined === type && (type = "");
  return {
    type: type,
    links: {},
  };
}
function r_(e) {
  if (!e) return i_();
  var t = i_(e.type);
  e.color && (t.color = e.color);
  return t;
}
var o_ = {
    tag: !0,
  },
  a_ = {
    fill: "color-fill",
    fillFocused: "color-fill-focused",
    fillTag: "color-fill-tag",
    fillUnresolved: "color-fill-unresolved",
    fillAttachment: "color-fill-attachment",
    arrow: "color-arrow",
    circle: "color-circle",
    line: "color-line",
    text: "color-text",
    fillHighlight: "color-fill-highlight",
    lineHighlight: "color-line-highlight",
  },
  s_ = 100,
  l_ = (function () {
    function e(renderer, t, type) {
      var i = this;
      this.x = null;
      this.y = null;
      this.fx = null;
      this.fy = null;
      this.forward = {};
      this.reverse = {};
      this.weight = 0;
      this.color = null;
      this.rendered = false;
      this.fadeAlpha = 0;
      this.moveText = 0;
      this.fontDirty = false;
      this.onClick = function (e) {
        var t = e.nativeEvent;
        if (e.button === 2 || (t.instanceOf(MouseEvent) && jl(t))) {
          var n = i.renderer;
          if (n.onNodeRightClick) {
            n.onNodeRightClick(e.nativeEvent, i.id, i.type);
          }
        }
      };
      this.renderer = renderer;
      this.id = t;
      this.type = type;
    }
    e.prototype.initGraphics = function () {
      var e = this;
      if (this.rendered) return !1;
      this.rendered = true;
      var t,
        n = this.renderer;
      (t = this.circle = new PIXI.Graphics()).eventMode = "static";
      t.beginFill(16777215);
      t.drawCircle(s_, s_, s_);
      t.endFill();
      Platform.isMobile && (t.beginFill(16777215, 1e-4), t.drawCircle(s_, s_, 500), t.endFill());
      t.pivot.x = s_;
      t.pivot.y = s_;
      t.cursor = "pointer";
      t.zIndex = 1;
      t.on("pointerdown", function (t) {
        return n.onPointerDown(e, t);
      })
        .on("pointerover", function (t) {
          return n.onPointerOver(e, t);
        })
        .on("pointerout", function () {
          return n.onPointerOut();
        })
        .on("click", this.onClick)
        .on("rightclick", this.onClick);
      var i = this.getFillColor();
      t.alpha = i.a;
      t.tint = i.rgb;
      n.hanger.addChild(t);
      var r = new PIXI.TextStyle(this.getTextStyle()),
        o = (this.text = new PIXI.Text(this.getDisplayText(), r));
      o.eventMode = "none";
      o.resolution = 2;
      o.anchor.set(0.5, 0);
      o.zIndex = 2;
      n.hanger.addChild(o);
      this.fadeAlpha = 0;
      return !0;
    };
    e.prototype.clearGraphics = function () {
      if (this.rendered) {
        this.rendered = false;
        var e = this,
          t = e.circle,
          n = e.highlight,
          i = e.text;
        t && ((this.circle = null), t.parent && t.parent.removeChild(t), t.destroy());
        n && ((this.highlight = null), n.parent && n.parent.removeChild(n), n.destroy());
        i && ((this.text = null), i.parent && i.parent.removeChild(i), i.destroy());
      }
    };
    e.prototype.getTextStyle = function () {
      var e = this.renderer,
        t = this.getSize();
      return new PIXI.TextStyle({
        fontSize: 14 + t / 4,
        fill: e.colors.text.rgb,
        fontFamily:
          'ui-sans-serif, -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif',
        wordWrap: true,
        wordWrapWidth: 300,
        align: "center",
      });
    };
    e.prototype.render = function () {
      if (this.rendered) {
        var e = this,
          t = e.renderer,
          n = e.x,
          i = e.y,
          r = e.circle,
          o = e.highlight,
          a = e.text,
          s = e.fadeAlpha,
          l = e.moveText,
          c = this.getSize(),
          u = this.getFillColor(),
          h = t.colors.text,
          p = t.getHighlightNode(),
          d = p === this,
          f = t.nodeScale,
          m = a.visible,
          g = XU;
        if (!p || d || this.forward.hasOwnProperty(p.id) || this.reverse.hasOwnProperty(p.id)) {
          g = 1;
        }
        var alpha = (s = this.fadeAlpha = QU(s, g)) * u.a,
          alphay0 = t.textAlpha;
        alphay0 *= s;
        d && (alphay0 = 1);
        alphay0 *= h.a;
        var b = d ? 15 : 0;
        l = this.moveText = m ? QU(l, b) : b;
        var visiblew0 = alphay0 > 0.001,
          k = t.viewport,
          visible = d || !JU(k, e_(n, i, c * f + 1));
        if (
          (visiblew0 &&
            (visiblew0 =
              d ||
              !JU(k, {
                left: n - 300,
                right: n + 300,
                top: i,
                bottom: i + 200,
              })),
          (r.tint = $U(r.tint, u.rgb)),
          (r.visible = visible),
          visible && ((r.x = n), (r.y = i), (r.scale.x = r.scale.y = (c / 100) * f), (r.alpha = alpha)),
          (a.visible = visiblew0),
          visiblew0 &&
            ((a.x = n),
            (a.y = i + (c + 5) * f + l / t.scale),
            (a.scale.x = a.scale.y = f),
            d && t.scale < 1 && (a.scale.x = a.scale.y = 1 / t.scale),
            (a.alpha = alphay0)),
          d)
        ) {
          o || (((o = this.highlight = new PIXI.Graphics()).eventMode = "none"), (o.zIndex = 1), t.hanger.addChild(o));
          o.x = n;
          o.y = i;
          o.scale.x = o.scale.y = f;
          o.clear();
          var E = Math.max(1, 1 / t.scale / f),
            S = t.colors.circle;
          o.alpha = S.a;
          o.lineStyle(E, S.rgb, 1);
          o.drawCircle(0, 0, c + E / 2);
        } else if (o) {
          o.parent.removeChild(o);
          o.destroy();
          this.highlight = null;
        }
        if (this.fontDirty) {
          this.fontDirty = false;
          a.style = this.getTextStyle();
        }
      }
    };
    e.prototype.getFillColor = function () {
      var e = this,
        t = e.renderer,
        n = e.type,
        i = e.color;
      if (t.getHighlightNode() === this) return t.colors.fillHighlight;
      if (n === "focused") {
        var r = t.colors.fillFocused;
        if (r.a > 0) return r;
      } else {
        if (i) return i;
        if (n === "tag") return t.colors.fillTag;
        if (n === "unresolved") return t.colors.fillUnresolved;
        if (n === "attachment") return t.colors.fillAttachment;
      }
      return t.colors.fill;
    };
    e.prototype.getSize = function () {
      return this.renderer.fNodeSizeMult * Math.max(8, Math.min(3 * Math.sqrt(this.weight + 1), 30));
    };
    e.prototype.getDisplayText = function () {
      var e = this.id;
      tu(e, "md") && (e = Qc(e));
      return e;
    };
    e.prototype.getRelated = function () {
      return Object.keys(this.forward).concat(Object.keys(this.reverse));
    };
    return e;
  })(),
  c_ = (function () {
    function e(renderer, source, target) {
      this.rendered = false;
      this.renderer = renderer;
      this.source = source;
      this.target = target;
    }
    e.prototype.initGraphics = function () {
      if (!this.rendered && this.source.rendered && this.target.rendered) {
        this.rendered = true;
        var e = this.renderer,
          t = (this.px = new PIXI.Container());
        e.hanger.addChild(t);
        var n = (this.line = new PIXI.Sprite(PIXI.Texture.WHITE));
        n.eventMode = "none";
        var i = e.colors.line;
        n.alpha = XU * i.a;
        n.tint = i.rgb;
        t.addChild(n);
        var r = (this.arrow = new PIXI.Graphics());
        r.eventMode = "none";
        var o = e.colors.text;
        r.alpha = XU * o.a;
        r.tint = o.rgb;
        r.beginFill(16777215);
        r.moveTo(0, 0);
        r.lineTo(-4, -2);
        r.lineTo(-3, 0);
        r.lineTo(-4, 2);
        r.lineTo(0, 0);
        r.endFill();
        r.zIndex = 1;
        e.hanger.addChild(r);
      }
    };
    e.prototype.clearGraphics = function () {
      if (this.rendered) {
        this.rendered = false;
        var e = this,
          t = e.px,
          n = e.line,
          i = e.arrow;
        t && ((this.px = null), t.parent && t.parent.removeChild(t), t.destroy(), (t.visible = false));
        n && ((this.line = null), n.destroy(), (n.visible = false));
        i && ((this.arrow = null), i.parent && i.parent.removeChild(i), i.destroy(), (i.visible = false));
      }
    };
    e.prototype.render = function () {
      if (this.rendered) {
        var e = this,
          t = e.px,
          n = e.line,
          i = e.arrow,
          r = e.renderer,
          o = e.source,
          a = e.target,
          s = r.getHighlightNode(),
          l = o === s || a === s,
          c = XU;
        if (!(s && !l)) {
          c = 1;
        }
        var u = c * Math.clamp(2 * (r.scale - 0.3), 0, 1),
          h = r.colors.line;
        if (l) {
          h = r.colors.lineHighlight;
        }
        var p,
          d,
          f = r.colors.arrow,
          visible = !(o.reverse.hasOwnProperty(a.id) && o.id.localeCompare(a.id) < 0),
          visibleg0 = r.fShowArrow,
          height = r.fLineSizeMult / r.scale,
          y = r.viewport,
          b = e_(o.x, o.y, height),
          w = e_(a.x, a.y, height),
          k = !JU(
            y,
            ((p = b),
            (d = w),
            {
              left: Math.min(p.left, d.left),
              right: Math.max(p.right, d.right),
              top: Math.min(p.top, d.top),
              bottom: Math.max(p.bottom, d.bottom),
            }),
          );
        if (
          ((c *= h.a),
          (u *= f.a),
          (n.alpha = QU(n.alpha, c)),
          (i.alpha = QU(i.alpha, u)),
          (visible = visible && k),
          (visibleg0 = visibleg0 && k && i.alpha > 0.001),
          (n.visible = visible),
          (i.visible = visibleg0),
          visible || visibleg0)
        ) {
          var C = a.x - o.x,
            E = a.y - o.y,
            S = Math.sqrt(C * C + E * E),
            M = o.getSize() * r.nodeScale,
            x = a.getSize() * r.nodeScale;
          i.visible = visibleg0 = visibleg0 && S > height;
          visible &&
            ((t.x = o.x + (C * M) / S),
            (t.y = o.y + (E * M) / S),
            t.pivot.set(0, 0),
            (t.rotation = Math.atan2(E, C)),
            (n.x = 0),
            (n.y = -height / 2),
            (n.width = Math.max(0, S - M - x)),
            (n.height = height),
            (n.tint = $U(n.tint, h.rgb)));
          i.visible = visibleg0;
          visibleg0 &&
            ((x += 1),
            (i.x = a.x - (C * x) / S),
            (i.y = a.y - (E * x) / S),
            i.pivot.set(0, 0),
            (i.rotation = Math.atan2(E, C)),
            (i.scale.x = i.scale.y = (2 * Math.sqrt(r.fLineSizeMult)) / r.scale),
            (i.tint = f.rgb));
        }
      }
    };
    return e;
  })(),
  u_ = (function () {
    function e(renderer) {
      this.rendered = false;
      this.renderer = renderer;
    }
    e.prototype.initGraphics = function () {
      var e = this.renderer;
      if (!this.text) {
        var t = (this.text = new PIXI.Text("Powered by Obsidian", this.getTextStyle()));
        t.eventMode = "none";
        t.anchor.set(1, 1);
        t.zIndex = 3;
        t.alpha = 0.5;
        e.px.stage.addChild(t);
      }
    };
    e.prototype.clearGraphics = function () {
      var e = this.text;
      e && e.parent && ((this.text = null), e.parent.removeChild(e), e.destroy());
      this.rendered = false;
    };
    e.prototype.render = function () {
      var e = this.renderer,
        t = this.text;
      if (t) {
        t.visible = !e.hidePowerTag;
        t.alpha = e.colors.text.a;
        var n = e.px.renderer;
        t.x = n.width / n.resolution;
        t.y = n.height / n.resolution;
        this.rendered || ((this.rendered = true), (this.text.style = this.getTextStyle()));
      }
    };
    e.prototype.getTextStyle = function () {
      return new PIXI.TextStyle({
        fontSize: 12,
        fill: this.renderer.colors.text.rgb,
        fontFamily:
          'ui-sans-serif, -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif',
        wordWrap: false,
        align: "right",
      });
    };
    return e;
  })(),
  h_ = (function () {
    function e(containerEl, t, hidePowerTag, worker) {
      var r = this;
      this.interactiveEl = null;
      this.onNodeClick = null;
      this.onNodeRightClick = null;
      this.onNodeHover = null;
      this.onNodeUnhover = null;
      this.workerResults = null;
      this.nodeLookup = {};
      this.nodes = [];
      this.links = [];
      this.dragNode = null;
      this.highlightNode = null;
      this.px = null;
      this.hanger = null;
      this.powerTag = null;
      this.scale = 1;
      this.nodeScale = 1;
      this.textAlpha = 1;
      this.targetScale = 1;
      this.panX = 0;
      this.panY = 0;
      this.panvX = 0;
      this.panvY = 0;
      this.keyboardActions = {};
      this.panning = false;
      this.width = 0;
      this.height = 0;
      this.viewport = null;
      this.zoomCenterX = 0;
      this.zoomCenterY = 0;
      this.hidePowerTag = false;
      this.fNodeSizeMult = 1;
      this.fLineSizeMult = 1;
      this.fTextShowMult = 1;
      this.fShowArrow = false;
      this.mouseX = null;
      this.mouseY = null;
      this.colors = {};
      this.renderTimer = null;
      this.hidePowerTag = hidePowerTag;
      this.containerEl = containerEl;
      this.testCSS();
      var o = (this.interactiveEl = containerEl.createEl("canvas"));
      if (
        ((containerEl.style.padding = "0"),
        (containerEl.style.overflow = "hidden"),
        (containerEl.style.position = "relative"),
        (o.style.position = "absolute"),
        (o.style.left = "0"),
        (o.style.top = "0"),
        t_(o),
        o.addEventListener("mousedown", function (e) {
          return e.preventDefault();
        }),
        o.addEventListener("wheel", this.onWheel.bind(this), {
          passive: false,
        }),
        o.addEventListener("mousemove", this.onMouseMove.bind(this), {
          passive: true,
        }),
        o.addEventListener("mouseout", this.onMouseMove.bind(this)),
        worker ||
          (worker = new Worker("/sim.js", {
            name: "Graph Worker",
          })),
        (this.worker = worker),
        (worker.onmessage = function (e) {
          if (!e.data.ignore) {
            r.workerResults = e.data;
            r.changed();
          }
        }),
        t)
      ) {
        var a = (this.iframeEl = containerEl.createEl("iframe"));
        t_(a);
        a.onload = this.onIframeLoad.bind(this);
        a.contentDocument && this.onIframeLoad();
      } else {
        var s = containerEl.createEl("canvas");
        t_(s);
        setTimeout(function () {
          try {
            r.initGraphics(s);
          } catch (e) {
            setTimeout(function () {
              r.initGraphics(s);
            }, 300);
          }
        }, 50);
      }
    }
    e.prototype.destroy = function () {
      this.worker.terminate();
      this.workerResults = null;
      this.destroyGraphics();
    };
    e.prototype.onIframeLoad = function () {
      var e = this.iframeEl;
      e.contentWindow.onbeforeunload = this.onIframeUnload.bind(this);
      var t = e.contentDocument.body;
      t_(t);
      t.innerHTML = "<canvas>";
      var n = t.firstChild;
      t_(n);
      this.destroyGraphics();
      this.initGraphics(n);
    };
    e.prototype.onIframeUnload = function () {
      this.destroyGraphics();
    };
    e.prototype.onWheel = function (e) {
      if ((e.preventDefault(), this.px)) {
        var t = e.deltaY;
        e.deltaMode === 1 ? (t *= 40) : e.deltaMode === 2 && (t *= 800);
        var targetScale = this.targetScale;
        if (((targetScale *= Math.pow(1.5, -t / 120)), (this.targetScale = targetScale), targetScale < this.scale)) {
          this.zoomCenterX = 0;
          this.zoomCenterY = 0;
        } else {
          var i = window.devicePixelRatio;
          this.zoomCenterX = e.offsetX * i;
          this.zoomCenterY = e.offsetY * i;
        }
        this.changed();
      }
    };
    e.prototype.onMouseMove = function (e) {
      e.type === "mouseout"
        ? (this.mouseX = this.mouseY = null)
        : ((this.mouseX = e.offsetX), (this.mouseY = e.offsetY));
    };
    e.prototype.initGraphics = function (view) {
      var t,
        n = this,
        i = this,
        r = i.iframeEl,
        o = i.interactiveEl,
        a = i.worker;
      PIXI.settings.RENDER_OPTIONS.hello = false;
      var WebGL2RenderingContext = window.WebGL2RenderingContext;
      try {
        r &&
          r.contentWindow.WebGL2RenderingContext &&
          (window.WebGL2RenderingContext = r.contentWindow.WebGL2RenderingContext);
        t = this.px = new PIXI.Application({
          view: view,
          antialias: true,
          backgroundAlpha: 0,
          autoStart: false,
        });
      } finally {
        window.WebGL2RenderingContext = WebGL2RenderingContext;
      }
      t.renderer.events.setTargetElement(o);
      var l = null;
      this.onPointerDown = function (dragNode, i) {
        if (i.nativeEvent.target === o) {
          v || ((n.dragNode = dragNode), (l = i.getLocalPosition(t.stage)));
        }
      };
      var c = function (e) {
        if (e.nativeEvent.instanceOf(TouchEvent)) {
          k(e.nativeEvent);
        }
        var t = n.dragNode;
        if (t) {
          var i = e.nativeEvent;
          l &&
            n.onNodeClick &&
            ((i.instanceOf(MouseEvent) && (i.button === 0 || i.button === 1) && !jl(i)) || i.instanceOf(TouchEvent)) &&
            n.onNodeClick(i, t.id, t.type);
          t.fx = null;
          t.fy = null;
          a.postMessage({
            alphaTarget: 0,
            forceNode: {
              id: t.id,
              x: null,
              y: null,
            },
          });
          l = null;
          n.dragNode = null;
          n.changed();
        }
      };
      t.stage
        .on("pointermove", function (e) {
          var i = n.dragNode;
          if (i) {
            if (y) {
              l = null;
              return void (n.dragNode = null);
            }
            if (l) {
              var r = e.getLocalPosition(t.stage),
                o = r.x - l.x,
                s = r.y - l.y;
              if (o * o + s * s > 25) {
                l = null;
              }
            }
            var c = e.getLocalPosition(n.hanger);
            i.fx = c.x;
            i.fy = c.y;
            a.postMessage({
              alpha: 0.3,
              alphaTarget: 0.3,
              run: true,
              forceNode: {
                id: i.id,
                x: c.x,
                y: c.y,
              },
            });
            n.changed();
          }
        })
        .on("pointerup", c)
        .on("pointerupoutside", c).eventMode = "static";
      this.onPointerOver = function (highlightNode, t) {
        if (t.pointerType !== "touch") {
          n.highlightNode = highlightNode;
          n.changed();
          var i = t.nativeEvent;
          i.instanceOf(MouseEvent) && ((n.mouseX = i.offsetX), (n.mouseY = i.offsetY));
          n.onNodeHover && n.onNodeHover(i, highlightNode.id, highlightNode.type);
        }
      };
      this.onPointerOut = function () {
        n.highlightNode = null;
        n.changed();
        n.onNodeUnhover && n.onNodeUnhover();
      };
      var u = (this.hanger = new PIXI.Container());
      u.eventMode = "static";
      var h = (this.powerTag = new u_(this));
      this.onResize();
      this.resetPan();
      var p = new PIXI.Graphics();
      p.eventMode = "static";
      p.beginFill(0);
      p.drawRect(0, 0, 1e4, 1e4);
      p.endFill();
      p.alpha = 0;
      var d = null,
        f = null,
        m = performance.now(),
        panvX = 0,
        v = null,
        y = null,
        b = 0,
        w = 0,
        k = function (e) {
          for (
            var t = performance.now(),
              i = t - m,
              r = Array.prototype.slice.call(e.touches),
              o = null,
              a = null,
              s = 0,
              c = r;
            s < c.length;
            s++
          ) {
            var u = c[s];
            v && u.identifier === v.identifier && (o = u);
            y && u.identifier === y.identifier && (a = u);
          }
          if (
            (a && !o && ((v = y), (o = a), (y = null), (a = null)),
            o ? r.remove(o) : r.length > 0 && ((o = r.first()), r.splice(0, 1)),
            a ? r.remove(a) : r.length > 0 && ((a = r.first()), r.splice(0, 1)),
            !l && !n.dragNode && v && o && v.identifier === o.identifier)
          ) {
            var h = window.devicePixelRatio;
            if (y && a && y.identifier === a.identifier) {
              var p = n.interactiveEl.getBoundingClientRect(),
                d = ((v.clientX + y.clientX) / 2 - p.x) * h,
                f = ((v.clientY + y.clientY) / 2 - p.y) * h,
                zoomCenterX = ((o.clientX + a.clientX) / 2 - p.x) * h,
                zoomCenterY = ((o.clientY + a.clientY) / 2 - p.y) * h,
                E = v.clientX - y.clientX,
                S = v.clientY - y.clientY,
                M = o.clientX - a.clientX,
                x = o.clientY - a.clientY,
                T = E * E + S * S,
                D = M * M + x * x;
              if (T !== 0 && D !== 0) {
                var A = Math.sqrt(D / T),
                  targetScale = n.targetScale * A,
                  L = n.panX + (zoomCenterX - d),
                  I = n.panY + (zoomCenterY - f);
                n.zoomCenterX = zoomCenterX;
                n.zoomCenterY = zoomCenterY;
                n.setPan(L, I);
                n.targetScale = targetScale;
                n.changed();
              }
              b = 0;
              w = 0;
            } else {
              var O = (o.clientX - v.clientX) * h,
                F = (o.clientY - v.clientY) * h;
              panvX = QU(panvX, i, 0.8);
              m = t;
              b = QU(b, O, 0.8);
              w = QU(w, F, 0.8);
              n.setPan(n.panX + O, n.panY + F);
              n.changed();
            }
          } else {
            panvX = QU(panvX, i, 0.8);
            i < 100 && ((n.panvX = b / panvX), (n.panvY = w / panvX));
            b = b = 0;
          }
          v = o;
          y = a;
        },
        C = function (e) {
          if (e.nativeEvent.instanceOf(TouchEvent)) k(e.nativeEvent);
          else {
            d = null;
            document.body.removeClass("is-grabbing");
            n.panning = false;
            var t = performance.now() - m;
            panvX = QU(panvX, t, 0.8);
            t > 100 ? (n.panvX = n.panvY = 0) : ((n.panvX /= panvX), (n.panvY /= panvX));
          }
        };
      p.on("pointerdown", function (e) {
        e.nativeEvent.instanceOf(TouchEvent)
          ? k(e.nativeEvent)
          : ((d = e.getLocalPosition(t.stage)),
            (f = {
              x: u.x,
              y: u.y,
            }),
            document.body.addClass("is-grabbing"),
            (n.panning = true));
      });
      t.stage
        .on("pointermove", function (e) {
          if (e.nativeEvent.instanceOf(TouchEvent)) k(e.nativeEvent);
          else if (d) {
            var i = e.getLocalPosition(t.stage),
              r = f.x + i.x - d.x,
              o = f.y + i.y - d.y,
              a = performance.now();
            panvX = QU(panvX, a - m, 0.8);
            m = a;
            n.panvX = QU(n.panvX, r - n.panX, 0.8);
            n.panvY = QU(n.panvY, o - n.panY, 0.8);
            n.setPan(r, o);
            n.changed();
          }
        })
        .on("pointerup", C)
        .on("pointerupoutside", C).eventMode = "static";
      t.stage.addChild(p);
      t.stage.addChild(u);
      h.initGraphics();
      this.updateZoom();
      this.renderCallback = function () {
        if (((n.renderTimer = null), n.px && !(n.idleFrames > 60))) {
          var e = n,
            i = e.nodes,
            r = e.links,
            o = n.workerResults;
          if (o) {
            var a = o.id,
              s = o.buffer,
              l = true;
            if (s instanceof ArrayBuffer) n.workerResults = null;
            else {
              var c = new Uint32Array(s, s.byteLength - 4, 1);
              c[0] === o.v ? (l = false) : (o.v = c[0]);
            }
            if (l)
              for (var p = new Float32Array(s), d = 0; d < a.length; d++) {
                if ((node = n.nodeLookup[a[d]])) {
                  node.x = p[2 * d];
                  node.y = p[2 * d + 1];
                  node.fx && (node.x = node.fx);
                  node.fy && (node.y = node.fy);
                }
              }
          }
          var f = n,
            m = f.panning,
            g = f.panvX,
            v = f.panvY,
            y = f.keyboardActions,
            b = y.shift;
          if (!m) {
            n.panX += (1e3 * g) / 60;
            n.panY += (1e3 * v) / 60;
            var w = 0,
              k = 0;
            y.up && (k += 1);
            y.down && (k -= 1);
            y.left && (w += 1);
            y.right && (w -= 1);
            (w === 0 && k === 0) || (n.idleFrames = 0);
            var C = b ? 3 : 1;
            n.panvX = QU(g, w * C, 0.9);
            n.panvY = QU(v, k * C, 0.9);
          }
          var targetScale = 1 + (b ? 0.1 : 0.03),
            S = false;
          if (
            (y.zoomin && ((n.targetScale *= targetScale), (S = true)),
            y.zoomout && ((n.targetScale /= targetScale), (S = true)),
            S)
          ) {
            n.idleFrames = 0;
            var M = window.devicePixelRatio;
            n.zoomCenterX = (n.width / 2) * M;
            n.zoomCenterY = (n.height / 2) * M;
          }
          n.updateZoom();
          var x = n.scale,
            left = -n.panX / x,
            D = -n.panY / x,
            right = left + (n.width / x) * window.devicePixelRatio,
            bottom = D + (n.height / x) * window.devicePixelRatio;
          n.viewport = {
            left: left,
            right: right,
            top: D,
            bottom: bottom,
          };
          for (
            var L = (left + right) / 2,
              I = (D + bottom) / 2,
              O = [],
              F = function (e, t) {
                return e.dist - t.dist;
              },
              N = 0,
              R = i;
            N < R.length;
            N++
          ) {
            if (!(node = R[N]).rendered) {
              var B = (J = node.x - L) * J + (ee = node.y - I) * ee;
              if (O.length < 50 || B < O.last().dist) {
                O.push({
                  node: node,
                  dist: J * J + ee * ee,
                });
                O.sort(F);
                O.length > 50 && O.pop();
              }
            }
          }
          if (O.length > 0) {
            for (var V = 0, H = O; V < H.length; V++) {
              H[V].node.initGraphics();
            }
            n.idleFrames = 0;
          }
          for (var z = 0, q = r; z < q.length; z++) {
            q[z].initGraphics();
          }
          for (var W = 0, U = i; W < U.length; W++) {
            var node;
            (node = U[W]).render();
          }
          for (var j = 0, G = r; j < G.length; j++) {
            G[j].render();
          }
          h.render();
          u.sortChildren();
          t.render();
          n.idleFrames++;
          n.queueRender();
          var K = n,
            Y = K.mouseX,
            Z = K.mouseY,
            X = K.highlightNode;
          if (Y !== null && Z !== null && X) {
            var Q = (Y * window.devicePixelRatio - n.panX) / x,
              $ = (Z * window.devicePixelRatio - n.panY) / x,
              J = X.x - Q,
              ee = X.y - $,
              te = X.getSize() * n.nodeScale + 2;
            if (J * J + ee * ee > te * te) {
              n.highlightNode = null;
              n.idleFrames = 0;
              n.onNodeUnhover && n.onNodeUnhover();
            }
          }
        }
      };
      this.queueRender();
    };
    e.prototype.destroyGraphics = function () {
      var e = this,
        t = e.iframeEl,
        n = e.px,
        i = e.links,
        r = e.nodes,
        o = e.powerTag;
      this.hanger = null;
      for (var a = 0, s = i; a < s.length; a++) {
        s[a].clearGraphics();
      }
      for (var l = 0, c = r; l < c.length; l++) {
        c[l].clearGraphics();
      }
      o && ((this.powerTag = null), o.clearGraphics());
      n &&
        (n.renderer.events.setTargetElement(null),
        t &&
          document.body.contains(t) &&
          t.contentDocument &&
          n.destroy(!0, {
            children: true,
            texture: true,
            baseTexture: true,
          }),
        (this.px = null));
      this.containerEl.win.cancelAnimationFrame(this.renderTimer);
      this.renderTimer = null;
      this.renderCallback = null;
      document.body.removeClass("is-grabbing");
    };
    e.prototype.zoomTo = function (targetScale, t) {
      this.targetScale = targetScale;
      t ? ((this.zoomCenterX = t.x), (this.zoomCenterY = t.y)) : (this.zoomCenterX = this.zoomCenterY = 0);
    };
    e.prototype.onResize = function () {
      var e = this,
        t = e.px,
        n = e.hanger,
        i = e.containerEl,
        r = e.interactiveEl,
        o = window.devicePixelRatio,
        width = i.clientWidth,
        height = i.clientHeight;
      if (((this.width = width), (this.height = height), t)) {
        var l = Math.round(width * o),
          c = Math.round(height * o),
          u = t.renderer,
          h = u.width,
          p = u.height;
        u.view.style.width = width + "px";
        u.view.style.height = height + "px";
        u.resize(l, c);
        r.width = width;
        r.height = height;
        t.renderer.events.resolutionChange(1 / o);
        n && this.setPan(this.panX + (l - h) / 2, this.panY + (c - p) / 2);
      }
      this.changed();
    };
    e.prototype.resetPan = function () {
      var e = window.devicePixelRatio;
      this.setPan((this.width / 2) * e, (this.height / 2) * e);
    };
    e.prototype.setData = function (e) {
      for (
        var t = this,
          n = t.nodes,
          i = t.nodeLookup,
          r = t.links,
          o = e.nodes,
          nodes = {},
          s = [],
          l = [],
          c = false,
          u = false,
          h = 0,
          p = 0,
          d = n;
        p < d.length;
        p++
      ) {
        var f = d[p];
        o.hasOwnProperty(f.id)
          ? ((h = Math.max(h, f.x * f.x + f.y * f.y)), (nodes[f.id] = false))
          : (s.push(f), (c = true));
      }
      var m = Math.sqrt(h),
        g = [];
      for (var v in o)
        if (o.hasOwnProperty(v)) {
          var y = o[v];
          if (i.hasOwnProperty(v)) {
            var color = y.color || null;
            (f = i[v]).color !== color && ((f.color = color), (u = true));
            f.type !== y.type && ((f.type = y.type), (u = true));
          } else {
            (f = new l_(this, v, y.type)).color = y.color || null;
            n.push(f);
            i[v] = f;
            c = true;
            g.push(f);
          }
        }
      for (var v in o)
        if (o.hasOwnProperty(v) && i.hasOwnProperty(v)) {
          f = i[v];
          var w = o[v].links;
          for (var k in f.forward)
            if (f.forward.hasOwnProperty(k)) {
              w.hasOwnProperty(k) || (l.push(f.forward[k]), (c = true));
            }
          for (var k in w)
            if (w.hasOwnProperty(k) && !f.forward.hasOwnProperty(k) && i.hasOwnProperty(k)) {
              var C = i[k],
                E = new c_(this, f, C);
              r.push(E);
              f.forward[C.id] = E;
              C.reverse[f.id] = E;
              c = true;
            }
        }
      for (
        var S = function (e) {
            e.clearGraphics();
            r.remove(e);
            delete e.source.forward[e.target.id];
            delete e.target.reverse[e.source.id];
          },
          M = 0,
          x = l;
        M < x.length;
        M++
      ) {
        S((E = x[M]));
      }
      for (var T = 0, D = s; T < D.length; T++) {
        (f = D[T]).clearGraphics();
        n.remove(f);
        delete i[f.id];
        var A = f.forward,
          P = f.reverse;
        for (var k in A)
          if (A.hasOwnProperty(k)) {
            S(A[k]);
          }
        for (var k in P)
          if (P.hasOwnProperty(k)) {
            S(P[k]);
          }
      }
      var L = g.length;
      if (L > 0)
        for (
          var I = 60 * L * 60, O = Math.sqrt(I / Math.PI + m * m) - m, F = Math.sqrt(I), N = 0, R = g;
          N < R.length;
          N++
        ) {
          for (var B = 0, V = 0, H = 0, z = 0, q = (f = R[N]).getRelated(); z < q.length; z++) {
            var W = q[z];
            if (i.hasOwnProperty(W)) {
              var U = i[W];
              if (U.x !== null && U.y !== null) {
                B += U.x;
                V += U.y;
                H++;
              }
            }
          }
          if (H > 0) {
            f.x = B / H + (Math.random() - 0.5) * F;
            f.y = V / H + (Math.random() - 0.5) * F;
          } else {
            var _ = 2 * Math.random() * Math.PI,
              j = m + Math.sqrt(Math.random()) * O;
            f.x = j * Math.cos(_);
            f.y = j * Math.sin(_);
          }
          nodes[f.id] = [f.x, f.y];
        }
      var G = e.weights;
      for (var v in i)
        if (i.hasOwnProperty(v)) {
          var weight = (f = i[v]).weight;
          weight = G ? (G.hasOwnProperty(v) ? G[v] : 0) : f.getRelated().length;
          f.weight !== weight && ((f.weight = weight), (c = true));
        }
      if (c) {
        for (var links = [], Z = 0, X = r; Z < X.length; Z++) {
          E = X[Z];
          links.push([E.source.id, E.target.id]);
        }
        this.worker.postMessage({
          nodes: nodes,
          links: links,
          alpha: 0.3,
          run: true,
        });
        this.changed();
      } else if (u) {
        this.changed();
      }
    };
    e.prototype.setRenderOptions = function (e) {
      var fNodeSizeMult = e.nodeSizeMultiplier,
        fLineSizeMult = e.lineSizeMultiplier,
        fShowArrow = e.showArrow,
        fTextShowMult = e.textFadeMultiplier;
      Number.isNumber(fNodeSizeMult) && (this.fNodeSizeMult = fNodeSizeMult);
      Number.isNumber(fLineSizeMult) && (this.fLineSizeMult = fLineSizeMult);
      Number.isNumber(fTextShowMult) && (this.fTextShowMult = fTextShowMult);
      isBoolean(fShowArrow) && (this.fShowArrow = fShowArrow);
      this.changed();
    };
    e.prototype.setForces = function (forces) {
      this.worker.postMessage({
        forces: forces,
        alpha: 0.3,
        run: !0,
      });
    };
    e.prototype.getHighlightNode = function () {
      return this.dragNode || this.highlightNode;
    };
    e.prototype.updateZoom = function () {
      var e = this,
        t = e.scale,
        n = e.targetScale,
        i = e.panX,
        r = e.panY;
      if ((t > (n = this.targetScale = Math.min(8, Math.max(1 / 128, n))) ? t / n : n / t) - 1 >= 0.01) {
        var o = this.zoomCenterX,
          a = this.zoomCenterY;
        if (o === 0 && a === 0) {
          var s = window.devicePixelRatio;
          o = (this.width / 2) * s;
          a = (this.height / 2) * s;
        }
        var l = {
          x: (o - i) / t,
          y: (a - r) / t,
        };
        t = QU(t, n, 0.85);
        i -= l.x * t + i - o;
        r -= l.y * t + r - a;
        this.changed();
      }
      this.setPan(i, r);
      this.setScale(t);
    };
    e.prototype.setPan = function (panX, panY) {
      var n = this.hanger;
      this.panX = panX;
      this.panY = panY;
      n && ((n.x = panX), (n.y = panY));
    };
    e.prototype.setScale = function (scale) {
      var t = this.hanger;
      this.scale = scale;
      this.nodeScale = Math.sqrt(1 / scale);
      var n = Math.log(scale) / Math.log(2);
      this.textAlpha = Math.clamp(n + 1 - this.fTextShowMult, 0, 1);
      t && (t.scale.x = t.scale.y = scale);
    };
    e.prototype.changed = function () {
      this.idleFrames = 0;
      this.queueRender();
    };
    e.prototype.queueRender = function () {
      if (!this.renderTimer && this.renderCallback) {
        this.renderTimer = this.containerEl.win.requestAnimationFrame(this.renderCallback);
      }
    };
    e.prototype.testCSS = function () {
      var e = function (e) {
        var t = document.body.createDiv({
            cls: "graph-view " + e,
          }),
          n = getComputedStyle(t),
          i = n.color,
          r = n.opacity;
        t.detach();
        var o = ET(i),
          a = parseFloat(r);
        isNaN(a) && (a = 1);
        return o
          ? {
              a: a * o.a,
              rgb: (o.r << 16) | (o.g << 8) | o.b,
            }
          : {
              a,
              rgb: 8947848,
            };
      };
      for (var t in a_)
        if (a_.hasOwnProperty(t)) {
          this.colors[t] = e(a_[t]);
        }
      for (var n = 0, i = this.nodes; n < i.length; n++) {
        i[n].fontDirty = true;
      }
      var r = this.powerTag;
      r && (r.rendered = false);
      this.changed();
    };
    e.prototype.getTransparentScreenshot = function () {
      var e = this.px;
      e.render();
      return e.view;
    };
    e.prototype.getBackgroundScreenshot = function () {
      var e = this.getTransparentScreenshot(),
        t = document.createElement("canvas");
      t.width = e.width;
      t.height = e.height;
      var n = t.getContext("2d");
      n.fillStyle = "#FFFFFF";
      n.fillRect(0, 0, e.width, e.height);
      n.drawImage(e, 0, 0);
      return t;
    };
    e.copyToClipboard = function (e, t) {
      return __awaiter(this, undefined, undefined, function () {
        return __generator(this, function (n) {
          switch (n.label) {
            case 0:
              return [4, canvasToBlob(e, t)];
            case 1:
              return [4, copyToClipboard(n.sent())];
            case 2:
              n.sent();
              return [2];
          }
        });
      });
    };
    return e;
  })();
function p_(e, t) {
  var n = e.nodes,
    nodes = {},
    weights = {},
    o = t.localFile,
    a = t.localJumps,
    s = t.localInterlinks,
    l = t.localForelinks,
    c = t.localBacklinks;
  if (((weights[o] = 30), !n.hasOwnProperty(o))) {
    nodes[o] = i_();
    return {
      nodes: nodes,
      weights: weights,
    };
  }
  nodes[o] = i_(n[o].type);
  for (
    var u = function (e) {
        var t = {};
        for (var o in n)
          if (n.hasOwnProperty(o)) {
            var a = n[o];
            if (a.type !== "tag") {
              var s = a.links;
              for (var u in s)
                if (s.hasOwnProperty(u)) {
                  var h = nodes[o];
                  l && nodes.hasOwnProperty(o) && !nodes.hasOwnProperty(u) && !o_.hasOwnProperty(h.type)
                    ? ((t[u] = t[u] || r_(n[u])), (h.links[u] = true))
                    : c &&
                      nodes.hasOwnProperty(u) &&
                      !nodes.hasOwnProperty(o) &&
                      !o_.hasOwnProperty(nodes[u].type) &&
                      ((t[o] = t[o] || r_(n[o])), (t[o].links[u] = true));
                }
            }
          }
        for (var p in t)
          if (t.hasOwnProperty(p)) {
            nodes[p] = t[p];
            weights[p] = e;
          }
      },
      h = 30 / a,
      p = 0;
    p < a;
    p++
  )
    u(30 - h * (p + 1));
  if (s)
    for (var d in nodes)
      if (nodes.hasOwnProperty(d) && n.hasOwnProperty(d)) {
        nodes[d] = n[d];
      }
  return {
    nodes: nodes,
    weights: weights,
  };
}
var d_ = lazyLoadScript("/lib/pixi.min.js?7.2.4"),
  f_ = (function () {
    function e(publish, t) {
      var n = this;
      this.expanded = false;
      this.global = false;
      this.publish = publish;
      var i = (this.outerContainerEl = t.createDiv("graph-view-outer"));
      i.createDiv("list-item published-section-header", function (e) {
        e.createSpan("published-section-header-icon", function (e) {
          setIcon(e, "lucide-git-fork");
        });
        e.createSpan({
          text: "Interactive graph",
        });
      });
      var r = (this.outerEl = i.createDiv("graph-view-container"));
      this.containerEl = r.createDiv("graph-view");
      var o = r.createDiv("graph-icon graph-expand");
      o.setAttr("role", "button");
      setIcon(o, "lucide-arrow-up-right");
      setTooltip(o, "Expand", {
        placement: "top",
      });
      o.addEventListener("click", this.onExpand.bind(this));
      var a = r.createDiv("graph-icon graph-global");
      a.setAttr("role", "button");
      setIcon(a, "lucide-git-fork");
      setTooltip(a, "Global Graph", {
        placement: "top",
      });
      a.addEventListener("click", this.onGlobalGraph.bind(this));
      var s = (this.modalEl = createDiv("modal-container")),
        l = s.createDiv("modal-bg");
      this.modalContainerEl = s.createDiv("graph-view-container mod-expanded");
      l.addEventListener("click", function (e) {
        return e.button === 0 && n.onExitExpand();
      });
      publish.on("options-updated", this.updateOptions.bind(this));
      publish.on("navigated", this.onNavigated.bind(this));
    }
    e.prototype.updateOptions = function () {
      var e = this,
        t = this.publish.site.getConfig(BU);
      Dc && (t = false);
      this.publish.containerEl.toggleClass("has-graph", t);
      this.containerEl.toggle(t);
      t &&
        !this.renderer &&
        executeWhenShown(this.containerEl, function () {
          var t = _N("/sim.js", {
            name: "Graph Worker",
          });
          d_.then(function () {
            return __awaiter(e, undefined, undefined, function () {
              var e, n;
              return __generator(this, function (i) {
                switch (i.label) {
                  case 0:
                    return this.renderer ? [2] : [4, t];
                  case 1:
                    e = i.sent();
                    return document.fonts ? [4, document.fonts.ready] : [3, 3];
                  case 2:
                    i.sent();
                    i.label = 3;
                  case 3:
                    (n = this.renderer = new h_(this.containerEl, !1, !1, e)).onNodeClick = this.onNodeClick.bind(this);
                    n.setScale(0.5);
                    n.targetScale = 0.5;
                    n.setRenderOptions({
                      textFadeMultiplier: -1,
                    });
                    this.onNavigated();
                    return [2];
                }
              });
            });
          });
        });
    };
    e.prototype.onNodeClick = function (e, t, n) {
      this.onExitExpand();
      this.publish.navigate(t, "", e instanceof MouseEvent || e instanceof PointerEvent ? e : null);
    };
    e.prototype.onResize = function () {
      if (this.renderer) {
        this.renderer.onResize();
      }
    };
    e.prototype.onExpand = function () {
      if (!this.expanded) {
        this.expanded = true;
        var e = this,
          t = e.containerEl,
          n = e.renderer,
          i = e.modalEl,
          r = e.modalContainerEl;
        document.body.appendChild(i);
        r.appendChild(t);
        n && (n.onResize(), n.zoomTo(2 * n.scale));
      }
    };
    e.prototype.onExitExpand = function () {
      if (this.expanded) {
        this.expanded = false;
        var e = this,
          t = e.outerEl,
          n = e.modalEl,
          i = e.containerEl,
          r = e.renderer,
          o = e.global;
        n.detach();
        t.insertBefore(i, t.firstChild);
        r && (r.onResize(), o || r.zoomTo(r.scale / 2));
        this.global = false;
        o && this.onNavigated();
      }
    };
    e.prototype.onGlobalGraph = function () {
      this.onExpand();
      this.global = true;
      var e = this.renderer;
      e && e.zoomTo(e.scale);
      this.onNavigated();
    };
    e.prototype.getGraphData = function (e) {
      var t = this;
      this._graphData ||
        (this._graphData = __awaiter(t, undefined, Promise, function () {
          return __generator(this, function (t) {
            return [
              2,
              m_(e, {
                showAttachments: false,
                hideUnresolved: true,
                showTags: false,
              }),
            ];
          });
        }));
      return this._graphData;
    };
    e.prototype.onNavigated = function () {
      var e = this,
        t = this,
        n = t.publish,
        i = t.renderer,
        localFile = t.currentFilepath;
      if (i) {
        var o = n.site;
        if (o.getConfig(BU)) {
          var currentFilepath = n.render.currentFilepath;
          localFile !== currentFilepath && (i.resetPan(), (localFile = this.currentFilepath = currentFilepath));
          i.highlightNode = null;
          __awaiter(e, undefined, undefined, function () {
            var e;
            return __generator(this, function (t) {
              switch (t.label) {
                case 0:
                  return localFile ? [4, this.getGraphData(o.cache)] : [3, 2];
                case 1:
                  e = t.sent();
                  this.global ||
                    (e = p_(e, {
                      localFile: localFile,
                      localJumps: 1,
                      localInterlinks: true,
                      localForelinks: true,
                      localBacklinks: true,
                    }));
                  return [3, 3];
                case 2:
                  e = {
                    nodes: {},
                  };
                  t.label = 3;
                case 3:
                  i.setData(e);
                  return [2];
              }
            });
          });
        }
      }
    };
    return e;
  })();
function m_(e, t) {
  return __awaiter(this, undefined, Promise, function () {
    var n, i, r, nodes, a, s, l, c, u, h, error, d, f, m, g;
    return __generator(this, function (v) {
      switch (v.label) {
        case 0:
          n = t.showAttachments;
          i = t.hideUnresolved;
          r = t.showTags;
          nodes = {};
          a = lx(Object.keys(e.cache));
          s = cx(a);
          v.label = 1;
        case 1:
          v.trys.push([1, 6, 7, 12]);
          l = function () {
            g = h.value;
            c = false;
            var t = g;
            if (!n && getExtension(t) !== "md") return "continue";
            var a = (nodes[t] = i_()).links,
              s = e.cache[t];
            if (
              (iterateCacheRefs(s, function (r) {
                var s = getLinkpath(r.link),
                  l = e.getLinktextDest(s, t);
                if (l) {
                  if (!n && getExtension(l) !== "md") return;
                  a[l] = true;
                } else if (i) {
                  a[s] = true;
                  nodes.hasOwnProperty(s) || (nodes[s] = i_("unresolved"));
                }
              }),
              r)
            ) {
              var l = getAllTags(s);
              if (l && l.length > 0)
                for (var u = 0, p = l; u < p.length; u++) {
                  var d = p[u];
                  a[d] = true;
                  nodes.hasOwnProperty(d) || (nodes[d] = i_("tag"));
                }
            }
          };
          c = true;
          u = __asyncValues(s);
          v.label = 2;
        case 2:
          return [4, u.next()];
        case 3:
          if (((h = v.sent()), (d = h.done))) return [3, 5];
          l();
          v.label = 4;
        case 4:
          c = true;
          return [3, 2];
        case 5:
          return [3, 12];
        case 6:
          error = v.sent();
          f = {
            error: error,
          };
          return [3, 12];
        case 7:
          v.trys.push([7, , 10, 11]);
          return c || d || !(m = u.return) ? [3, 9] : [4, m.call(u)];
        case 8:
          v.sent();
          v.label = 9;
        case 9:
          return [3, 11];
        case 10:
          if (f) throw f.error;
          return [7];
        case 11:
          return [7];
        case 12:
          return [
            2,
            {
              nodes: nodes,
            },
          ];
      }
    });
  });
}
function g_(e) {
  return decodeURIComponent(e.replace(/\+/g, "%20"));
}
function v_(e) {
  return encodeURIComponent(e).replace(/%20/g, "+");
}
function y_(e, t) {
  undefined === t && (t = "/");
  return e.split(t).map(v_).join(t);
}
function b_(e, t, n) {
  if (undefined === n) {
    n = true;
  }
  if (n)
    for (var i = 0, r = e; i < r.length; i++) {
      var o = r[i];
      if (o.type === "folder") {
        b_(o.children, t, n);
      }
    }
  e.sort(function (e, n) {
    var i = t.hasOwnProperty(e.path) ? t[e.path] : undefined,
      r = t.hasOwnProperty(n.path) ? t[n.path] : undefined;
    if (undefined !== i && undefined !== r) return i - r;
    if (undefined !== i) return -1;
    if (undefined !== r) return 1;
    var o = e.type === "folder",
      a = n.type === "folder";
    if (o || a) {
      if (o && !a) return -1;
      if (a && !o) return 1;
    }
    return Eb(e.name, n.name);
  });
}
var w_ = (function () {
  function e(e) {
    var t = this;
    if (e) {
      this.el = e;
      this.selfEl = this.el.firstChild;
      this.innerEl = this.selfEl.firstChild;
      return void (this.coverEl = this.selfEl);
    }
    this.el = e = createDiv("tree-item");
    var n = (this.selfEl = e.createDiv("tree-item-self"));
    n.addEventListener("click", function (e) {
      if (!(e.button !== 0 || e.defaultPrevented)) {
        t.onSelfClick(e);
      }
    });
    n.addEventListener("auxclick", function (e) {
      if (!(e.button !== 1 || e.defaultPrevented)) {
        t.onSelfClick(e);
      }
    });
    this.innerEl = n.createDiv("tree-item-inner");
    this.coverEl = this.selfEl;
  }
  e.prototype.onSelfClick = function (e) {};
  e.prototype.setClickable = function (e) {
    this.selfEl.toggleClass("is-clickable", e);
  };
  return e;
})();
function k_(e) {
  var t = (function (e) {
    function t() {
      for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
      var i = e.apply(this, t) || this;
      i.collapsible = false;
      i.collapsed = false;
      i.collapseEl = null;
      i.childrenEl = i.el.find(".tree-item-children") || i.el.createDiv("tree-item-children");
      return i;
    }
    __extends(t, e);
    t.prototype.onCollapseClick = function (e) {
      if (e.button === 0) {
        e.preventDefault();
        this.toggleCollapsed(!0);
      }
    };
    t.prototype.toggleCollapsed = function (e) {
      if (this.collapsible) return this.setCollapsed(!this.collapsed, e);
    };
    t.prototype.setCollapsed = function (collapsed, t) {
      if (this.collapsed !== collapsed) {
        this.collapsed = collapsed;
        return this.updateCollapsed(t);
      }
    };
    t.prototype.setCollapsible = function (collapsible) {
      if (this.collapsible !== collapsible) {
        var t = this.selfEl,
          n = this.collapseEl;
        this.collapsible = collapsible;
        collapsible
          ? (n ||
              (setIcon((n = this.collapseEl = createDiv("tree-item-icon collapse-icon")), "right-triangle"),
              n.addEventListener("click", this.onCollapseClick.bind(this))),
            t.prepend(n))
          : n && (n.detach(), (this.collapseEl = null), (this.collapsed = false));
        t.toggleClass("mod-collapsible", collapsible);
      }
    };
    t.prototype.updateCollapsed = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i, r;
        return __generator(this, function (o) {
          switch (o.label) {
            case 0:
              n = (t = this).el;
              i = t.childrenEl;
              r = t.collapsed;
              CO(n, r);
              return [4, toggleElementMount(i, n, r, e)];
            case 1:
              o.sent();
              return [2];
          }
        });
      });
    };
    return t;
  })(e);
  return t;
}
var C_ = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    return t;
  })(k_(w_)),
  E_ = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    t.prototype.render = function () {};
    return t;
  })(w_);
function S_(e) {
  var t = (function (e) {
    function t() {
      var t = (e !== null && e.apply(this, arguments)) || this;
      t.children = null;
      return t;
    }
    __extends(t, e);
    t.prototype.render = function () {
      var e = this.childrenEl,
        t = this.children;
      if (t !== null) {
        e.setChildrenInPlace(
          t.map(function (e) {
            return e.el;
          }),
        );
        for (var n = 0, i = t; n < i.length; n++) {
          i[n].render();
        }
      } else e.empty();
    };
    return t;
  })(k_(e));
  return t;
}
var M_ = (function (e) {
    function t() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    __extends(t, e);
    return t;
  })(S_(w_)),
  x_ = (function () {
    function e(childrenEl) {
      this.children = [];
      this.childrenEl = childrenEl;
    }
    e.prototype.render = function () {
      var e = this.childrenEl,
        t = this.children;
      e.setChildrenInPlace(
        t.map(function (e) {
          return e.el;
        }),
      );
      for (var n = 0, i = t; n < i.length; n++) {
        i[n].render();
      }
    };
    e.prototype.addRoot = function (e) {
      this.children.push(e);
    };
    e.prototype.clear = function () {
      this.children = [];
      this.render();
    };
    return e;
  })();
var PopoverState,
  D_ = (function () {
    function e(publish, t) {
      this.initialized = false;
      this.publish = publish;
      var n = (this.outerEl = t.createDiv("nav-view-outer"));
      this.containerEl = n.createDiv("nav-view");
      this.treeView = new I_(this.containerEl, this.publish, this.onItemClick.bind(this));
      publish.on("options-updated", this.updateOptions.bind(this));
      publish.on("navigated", this.onNavigated.bind(this));
    }
    e.prototype.getOuterEl = function () {
      return this.outerEl;
    };
    e.prototype.updateOptions = function () {
      var e = this,
        t = this.publish.site.getConfig(RU);
      if (
        (Dc && (t = false), this.containerEl.toggle(t), this.publish.containerEl.toggleClass("has-navigation", t), t)
      ) {
        this.init();
        try {
          window.matchMedia("(max-width: 750px)").addEventListener("change", function () {
            return e.init();
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
    e.prototype.init = function (e) {
      if ((undefined === e && (e = false), !this.initialized)) {
        var t = this.publish.site;
        if (t.getConfig(RU) && (e || !(this.containerEl.getBoundingClientRect().right <= 0))) {
          this.initialized = true;
          for (var n = t.getConfig(KU), i = new Set(t.getConfig(YU)), r = {}, o = 0; o < n.length; o++) {
            r[n[o]] = o;
          }
          var a = (function (e, t, n) {
            var i = {
                type: "folder",
                name: "",
                path: "",
                children: [],
                parent: null,
              },
              r = {};
            r[""] = i;
            for (var o = 0, a = e; o < a.length; o++)
              for (var s = a[o].split("/"), parent = i, c = "", u = 0; u < s.length; u++) {
                var name = s[u],
                  path = c + name;
                if (u === s.length - 1)
                  parent.children.push({
                    type: "file",
                    name: name,
                    path: path,
                    parent: parent,
                  });
                else {
                  var d = r[(c = path + "/")];
                  d ||
                    ((d = {
                      type: "folder",
                      path: path,
                      name: name,
                      children: [],
                      parent: parent,
                    }),
                    (r[c] = d),
                    parent.children.push(d));
                  parent = d;
                }
              }
            var f = function (e) {
              for (var children = [], i = 0, r = e.children; i < r.length; i++) {
                var o = r[i];
                n.has(o.path) || children.push(o);
                o.type === "folder" && f(o);
              }
              e.children = children;
            };
            f(i);
            b_(i.children, t);
            return i;
          })(Object.keys(t.cache.cache), r, i);
          this.treeView.renderTree(a);
          this.treeView.setActiveItem(this.publish.render.currentFilepath);
        }
      }
    };
    e.prototype.onNavigated = function () {
      this.treeView.setActiveItem(this.publish.render.currentFilepath);
    };
    e.prototype.onItemClick = function (e, t) {
      var n = this.publish;
      t.preventDefault();
      n.containerEl.removeClass("is-left-column-open");
      n.navigate(e.getItemPath(), "", t);
    };
    return e;
  })(),
  A_ = (function (e) {
    function t(owner, filen0) {
      var i = e.call(this) || this;
      i.owner = owner;
      i.file = filen0;
      var r = i,
        o = r.selfEl,
        a = r.innerEl,
        s = filen0.name;
      filen0.type === "file" && (s = Qc(s));
      a.setText(s);
      o.setAttr("data-path", filen0.path);
      return i;
    }
    __extends(t, e);
    t.prototype.setActive = function (e) {
      this.selfEl.toggleClass("mod-active", e);
    };
    t.prototype.getItemPath = function () {
      return this.file.path;
    };
    return t;
  })(E_),
  P_ = (function (e) {
    function t(t, n) {
      return e.call(this, t, n) || this;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      if (!e.defaultPrevented) {
        this.owner.onItemClick(this, e);
      }
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      this.selfEl.addClass("is-clickable");
      var t = this.innerEl,
        n = createEl("a");
      n.setText(t.getText());
      var i = this.owner.publish.site.getPublicHref(this.getItemPath());
      n.setAttr("href", i);
      t.setChildrenInPlace([n]);
    };
    return t;
  })(A_),
  L_ = (function (e) {
    function t(t, n) {
      var i = e.call(this, t, n) || this;
      i.children = [];
      i.setCollapsible(n.name !== "");
      i.setCollapsed(!0, !1);
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      if (!e.defaultPrevented) {
        this.toggleCollapsed(!0);
      }
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      this.selfEl.addClass("is-clickable");
    };
    return t;
  })(S_(A_)),
  I_ = (function (e) {
    function t(t, publish, onItemClick) {
      var r = e.call(this, t) || this;
      r.activeItem = null;
      r.rootFolder = null;
      r.publish = publish;
      r.onItemClick = onItemClick;
      return r;
    }
    __extends(t, e);
    t.prototype.setActiveItem = function (e) {
      var activeItem = this.activeItem;
      if ((activeItem == null || activeItem.setActive(!1), e)) {
        for (var n = [], i = e.split("/"), r = this.rootFolder, o = 0, a = i; o < a.length; o++) {
          var s = a[o];
          if (!(r instanceof L_)) return;
          for (var l = null, c = 0, u = r.children; c < u.length; c++) {
            var h = u[c];
            if (h.file.name === s) {
              l = h;
              break;
            }
          }
          if (!l) return;
          n.push(l);
          r = l;
        }
        for (var p = null, d = 0, f = n; d < f.length; d++) {
          var m = f[d];
          m instanceof L_ && m.collapsed && (p ? m.setCollapsed(!1, !1) : (p = m));
          activeItem = m;
        }
        p && p.setCollapsed(!1, !0);
        this.activeItem = activeItem;
        activeItem && activeItem.setActive(!0);
      }
    };
    t.prototype.renderTree = function (e) {
      var t = (this.rootFolder = this.renderFolder(null, e));
      for (t === null && (t = new L_(this, e)); t.children.length === 1; ) {
        var n = t.children[0];
        if (!(n instanceof L_)) break;
        t = n;
      }
      t.setCollapsed(!1, !1);
      t.setCollapsible(!1);
      t.selfEl.addClass("mod-root");
      this.addRoot(t);
      this.render();
    };
    t.prototype.renderFolder = function (e, t) {
      for (var n = new L_(this, t), i = 0, r = t.children; i < r.length; i++) {
        var o = r[i];
        o.type === "file" ? this.renderFile(n, o) : o.type === "folder" && this.renderFolder(n, o);
      }
      return n.children.length === 0 ? null : (e && e.children.push(n), n);
    };
    t.prototype.renderFile = function (e, t) {
      if (getExtension(t.path) !== "md") return null;
      var n = new P_(this, t);
      e.children.push(n);
    };
    return t;
  })(x_),
  O_ = (function (e) {
    function t(owner, heading) {
      var i = e.call(this) || this;
      i.owner = owner;
      i.heading = heading;
      i.innerEl.setText(getHeadingDisplayText(heading));
      return i;
    }
    __extends(t, e);
    t.prototype.onSelfClick = function (e) {
      if (!e.defaultPrevented) {
        var t = this.owner;
        if (t.onItemClick) {
          t.onItemClick(this.heading);
        }
      }
    };
    t.prototype.render = function () {
      e.prototype.render.call(this);
      var t = this.owner,
        n = this.children;
      this.setCollapsible(t.collapsible && n && n.length > 0);
      this.setClickable(!!t.onItemClick);
    };
    t.prototype.setActive = function (e) {
      this.selfEl.toggleClass("mod-active", e);
    };
    return t;
  })(M_),
  F_ = (function (e) {
    function t(t, onItemClick) {
      var i = e.call(this, t) || this;
      i.collapsible = true;
      i.highlighted = null;
      i.allItems = [];
      i.onItemClick = onItemClick;
      return i;
    }
    __extends(t, e);
    t.prototype.renderOutline = function (e) {
      for (var t = [], n = (this.allItems = []), i = 0, r = e; i < r.length; i++) {
        for (var o = r[i], a = o.level, s = new O_(this, o), l = t.last(); l && l.heading.level >= a; ) {
          t.pop();
          l = t.last();
        }
        t.push(s);
        l ? ((l.children = l.children || []), l.children.push(s)) : this.addRoot(s);
        n.push(s);
      }
      this.highlighted = null;
      this.render();
    };
    t.prototype.highlightLine = function (e) {
      for (var t = this.highlighted, highlighted = null, i = 0, r = this.allItems; i < r.length; i++) {
        var o = r[i];
        if (!(o.heading.position.start.line <= e)) break;
        highlighted = o;
      }
      if (highlighted !== t) {
        t && t.setActive(!1);
        this.highlighted = highlighted;
        highlighted && highlighted.setActive(!0);
      }
    };
    return t;
  })(x_),
  N_ = (function () {
    function e(publish, t) {
      this.publish = publish;
      var n = (this.containerEl = t.createDiv("outline-view-outer"));
      n.createDiv("list-item published-section-header", function (e) {
        e.createSpan("published-section-header-icon", function (e) {
          setIcon(e, "lucide-list");
        });
        e.createSpan({
          text: "On this page",
        });
      });
      var i = n.createDiv("outline-view");
      (this.treeView = new F_(i, this.onItemClick.bind(this))).collapsible = false;
      publish.on("options-updated", this.updateOptions.bind(this));
      publish.on("navigated", this.onNavigated.bind(this));
    }
    e.prototype.updateOptions = function () {
      var e = this.publish.site.getConfig(VU);
      Dc && (e = false);
      this.publish.containerEl.toggleClass("has-outline", e);
      this.containerEl.toggle(e);
      e && this.containerEl.onNodeInserted(this.onNavigated.bind(this));
    };
    e.prototype.onItemClick = function (e) {
      var t = this.publish;
      t.render.scrollToLoc(e.position.start);
      var n = t.site.getPublicHref(t.render.currentFilepath) + "#" + stripHeadingForLink(e.heading);
      history.replaceState(null, null, n);
    };
    e.prototype.onNavigated = function () {
      var e = this,
        t = e.publish,
        n = e.treeView,
        i = e.containerEl,
        r = t.site;
      if (r.getConfig(VU) && (n.clear(), i.isShown())) {
        var o = t.render.currentFilepath,
          a = r.cache.getCache(o);
        a && a.headings && a.headings.length !== 0
          ? (i.toggleVisibility(!0), n.renderOutline(a.headings), this.highlightLine(0))
          : i.toggleVisibility(!1);
      }
    };
    e.prototype.highlightLine = function (e) {
      this.treeView.highlightLine(e);
    };
    return e;
  })(),
  R_ = (function () {
    function e(publish) {
      this.publish = publish;
      this.scope = new Scope();
      this.scope.register([], "Escape", this.close.bind(this));
      this.containerEl = createDiv("modal-container");
      var t = this.containerEl.createDiv("modal-bg");
      this.modalEl = this.containerEl.createDiv("modal");
      var n = (this.closeButtonEl = this.modalEl.createDiv("modal-close-button"));
      this.titleEl = this.modalEl.createDiv("modal-title");
      this.contentEl = this.modalEl.createDiv("modal-content");
      n.addEventListener("click", this.close.bind(this));
      t.addEventListener("click", this.close.bind(this));
    }
    e.prototype.open = function () {
      this.publish.keymap.pushScope(this.scope);
      document.body.appendChild(this.containerEl);
      this.onOpen();
    };
    e.prototype.close = function () {
      this.publish.keymap.popScope(this.scope);
      this.containerEl.remove();
      this.onClose();
    };
    e.prototype.onOpen = function () {};
    e.prototype.onClose = function () {};
    return e;
  })(),
  B_ = (function (e) {
    function t(t, n) {
      var i = e.call(this, t) || this;
      i.done = false;
      i.cb = n;
      i.modalEl.addClass("mod-password-required");
      i.titleEl.setText("Protected site");
      i.closeButtonEl.hide();
      return i;
    }
    __extends(t, e);
    t.prototype.close = function () {
      if (this.done) {
        e.prototype.close.call(this);
      }
    };
    t.prototype.onOpen = function () {
      this.showPasswordRequired();
    };
    t.prototype.showPasswordRequired = function () {
      var e = this,
        t = this.contentEl;
      t.empty();
      this.passwordIncorrectMsg = t.createDiv("message-container", function (e) {
        e.createDiv({
          cls: "message mod-error",
          text: "Password is incorrect, please try again.",
        });
        e.hide();
      });
      t.createEl(
        "p",
        {
          cls: "",
        },
        function (t) {
          e.passwordEl = t.createEl(
            "input",
            {
              type: "password",
            },
            function (t) {
              t.setAttribute("placeholder", "Enter password...");
              t.addEventListener("keydown", function (t) {
                if (!(t.isComposing || t.key !== "Enter")) {
                  e.tryUnlockSite();
                }
              });
            },
          );
        },
      );
      t.createDiv("modal-button-container", function (t) {
        t.createEl("button", {
          text: "Confirm",
          cls: "mod-cta",
        }).addEventListener("click", e.tryUnlockSite.bind(e));
      });
    };
    t.prototype.tryUnlockSite = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              e = this.passwordEl.value;
              t = this.publish.site;
              r.label = 1;
            case 1:
              r.trys.push([1, 3, , 4]);
              return [
                4,
                ajaxPromise({
                  method: "POST",
                  url: t.host + "/pw",
                  data: {
                    id: t.id,
                    pw: e,
                  },
                }),
              ];
            case 2:
              if ((n = r.sent()))
                try {
                  i = JSON.parse(n);
                  this.publish.site.hpw = i.hpw;
                  localStorage[t.id] = i.hpw;
                } catch (e) {
                  console.error(e);
                }
              this.done = true;
              this.cb();
              this.showPasswordCorrect();
              return [3, 4];
            case 3:
              r.sent();
              this.passwordIncorrectMsg.show();
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    t.prototype.showPasswordCorrect = function () {
      var e = this,
        t = this.contentEl;
      t.empty();
      this.titleEl.setText("Site unlocked");
      t.createDiv("message-container", function (e) {
        e.createDiv({
          cls: "message mod-success",
          text: "Thank you, the password is correct.",
        });
      });
      t.createEl("p", {
        cls: "u-muted",
        text: "The password will be remembered during the following sessions for your convenience.",
      });
      t.createDiv("modal-button-container", function (t) {
        t.createEl("button", {
          text: "Enter",
          cls: "mod-cta",
        }).addEventListener("click", function () {
          e.close();
        });
      });
    };
    return t;
  })(R_),
  V_ = (function (e) {
    function t(t, tag) {
      var i = e.call(this, t) || this;
      i.tag = tag;
      i.titleEl.createSpan({
        text: "Pages with tag " + tag,
      });
      return i;
    }
    __extends(t, e);
    t.prototype.onOpen = function () {
      var e = this,
        t = this.publish,
        n = this.tag,
        i = t.site,
        r = i.cache.cache,
        o = new RegExp("^" + Jl(n) + "(\\/|$)", "i"),
        a = [];
      for (var s in r)
        if (r.hasOwnProperty(s)) {
          var l = getAllTags(r[s]);
          if (l)
            for (var c = 0, u = l; c < u.length; c++) {
              var h = u[c];
              if (o.test(h)) {
                a.push(s);
                break;
              }
            }
        }
      var p = this.contentEl.createEl("ol", "files-with-tag-container");
      if (a.length > 0)
        for (
          var d = function (n) {
              p.createEl("li", "files-with-tag-item", function (r) {
                return r
                  .createEl("a", {
                    cls: "internal-link",
                    href: i.getPublicHref(n),
                    text: ru(n),
                  })
                  .addEventListener("click", function (i) {
                    i.preventDefault();
                    e.close();
                    t.navigate(n, "");
                  });
              });
            },
            f = 0,
            m = a;
          f < m.length;
          f++
        ) {
          d(m[f]);
        }
      else
        p.createDiv({
          cls: "files-with-tag-item",
          text: "There are no pages that contain this tag.",
        });
    };
    return t;
  })(R_);
!(function (e) {
  e[(e.Showing = 0)] = "Showing";
  e[(e.Shown = 1)] = "Shown";
  e[(e.Hiding = 2)] = "Hiding";
  e[(e.Hidden = 3)] = "Hidden";
})(PopoverState || (PopoverState = {}));
var H_ = [],
  z_ = [],
  q_ = 0,
  staticPos = null,
  U_ = function (e) {
    for (var t = 0, n = H_; t < n.length; t++) {
      (s = n[t]).hide();
    }
    for (var i = e.targetNode, r = [], o = 0, a = z_; o < a.length; o++) {
      var s;
      if (
        !(
          (s = a[o]).isFocused ||
          s.hoverEl.contains(i) ||
          s.childHovers.some(function (e) {
            return e.hoverEl.contains(i);
          })
        )
      ) {
        r.push(s);
      }
    }
    e.win.setTimeout(function () {
      r.forEach(function (e) {
        return e.hide();
      });
    }, 5);
  },
  __ = function (e) {
    staticPos = {
      x: e.clientX,
      y: e.clientY,
      doc: e.doc,
    };
  },
  j_ = function () {
    if (z_.length === 0) {
      window.removeEventListener("click", U_, {
        capture: !0,
      });
      window.removeEventListener("contextmenu", U_, {
        capture: !0,
      });
      window.removeEventListener("mousemove", __);
      clearInterval(q_);
      q_ = 0;
      staticPos = null;
    } else {
      if (!staticPos) return;
      for (var e = staticPos.doc.elementFromPoint(staticPos.x, staticPos.y), t = 0, n = z_; t < n.length; t++) {
        n[t].detect(e);
      }
      for (var i = 0, r = z_; i < r.length; i++) {
        r[i].transition();
      }
    }
  },
  G_ = function () {
    if (!q_) {
      window.addEventListener("click", U_, {
        capture: !0,
      });
      window.addEventListener("contextmenu", U_, {
        capture: !0,
      });
      window.addEventListener("mousemove", __);
      q_ = window.setInterval(j_, 500);
    }
  },
  HoverPopover = (function (e) {
    function t(parent, targetEl, waitTime, staticPos) {
      undefined === waitTime && (waitTime = 300);
      undefined === staticPos && (staticPos = null);
      var o = e.call(this) || this;
      o.onTarget = true;
      o.onHover = false;
      o.isFocused = false;
      o.staticPos = null;
      o.parent = parent;
      o.targetEl = targetEl;
      o.waitTime = waitTime;
      o.state = PopoverState.Showing;
      o.staticPos = staticPos;
      var a = (o.hoverEl = createDiv("popover hover-popover")),
        s = (o.onMouseIn = o.onMouseIn.bind(o)),
        l = (o.onMouseOut = o.onMouseOut.bind(o));
      targetEl && (targetEl.addEventListener("mouseover", s), targetEl.addEventListener("mouseout", l));
      a.addEventListener("mouseover", function (e) {
        if (Mc(e, a)) {
          o.onHover = true;
          o.transition();
        }
      });
      a.addEventListener("mouseout", function (e) {
        if (Mc(e, a)) {
          o.onHover = false;
          o.transition();
        }
      });
      o.timer = activeWindow.setTimeout(o.show.bind(o), waitTime);
      H_.push(o);
      G_();
      return o;
    }
    __extends(t, e);
    t.prototype.onMouseIn = function (e) {
      if (!(this.targetEl && !Mc(e, this.targetEl))) {
        this.onTarget = true;
        this.transition();
      }
    };
    t.prototype.onMouseOut = function (e) {
      if (!(this.targetEl && !Mc(e, this.targetEl))) {
        this.onTarget = false;
        this.transition();
      }
    };
    t.prototype.detect = function (e) {
      var t = this.targetEl,
        n = this.hoverEl;
      t && (this.onTarget = e === t || t.contains(e));
      this.onHover = e === n || n.contains(e);
    };
    t.prototype.shouldShow = function () {
      return this.shouldShowSelf() || this.shouldShowChild();
    };
    t.prototype.shouldShowSelf = function () {
      var e = this.hoverEl;
      return this.onTarget || this.onHover || this.isFocused || e.contains(e.doc.activeElement);
    };
    Object.defineProperty(t.prototype, "childHovers", {
      get: function () {
        var e = this;
        return z_.filter(function (t) {
          return t !== e && t.targetEl && e.hoverEl.contains(t.targetEl);
        });
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.shouldShowChild = function () {
      return this.childHovers.some(function (e) {
        return e.shouldShow();
      });
    };
    t.prototype.setIsFocused = function (isFocused) {
      this.isFocused = isFocused;
    };
    t.prototype.transition = function () {
      var e = this,
        t = this.shouldShow(),
        n = this.state;
      t
        ? n === PopoverState.Hiding && ((this.state = PopoverState.Shown), clearTimeout(this.timer))
        : n === PopoverState.Showing
          ? this.hide()
          : n === PopoverState.Shown &&
            ((this.state = PopoverState.Hiding),
            (this.timer = activeWindow.setTimeout(function () {
              e.shouldShow() ? e.transition() : e.hide();
            }, this.waitTime)));
    };
    t.prototype.show = function () {
      var e = this.targetEl;
      !e || e.doc.body.contains(e)
        ? ((this.state = PopoverState.Shown),
          (this.timer = 0),
          this.position(),
          this.onShow(),
          H_.remove(this),
          z_.push(this),
          G_(),
          this.load(),
          fl(
            this.hoverEl,
            new cl({
              fn: "var(--anim-motion-swing)",
              duration: 80,
            }).addProp("opacity", "0", "1", ""),
          ))
        : this.hide();
    };
    t.prototype.hide = function () {
      var e = this,
        t = e.hoverEl,
        n = e.targetEl,
        i = e.timer;
      this.state = PopoverState.Hidden;
      H_.remove(this);
      z_.remove(this);
      clearTimeout(i);
      t.detach();
      n && (n.removeEventListener("mouseover", this.onMouseIn), n.removeEventListener("mouseout", this.onMouseOut));
      this.onTarget = false;
      this.onHover = false;
      for (var r = 0, o = z_; r < o.length; r++) {
        var a = o[r];
        if (!a.shouldShowSelf() && a.targetEl && this.hoverEl.contains(a.targetEl)) {
          a.hide();
        }
      }
      this.onHide();
      this.unload();
    };
    t.prototype.onShow = function () {
      var e = this.parent;
      e.hoverPopover && e.hoverPopover.hide();
      e.hoverPopover = this;
      hideTooltip();
    };
    t.prototype.onHide = function () {
      var e = this.parent;
      if (e.hoverPopover === this) {
        e.hoverPopover = null;
      }
    };
    t.prototype.position = function () {
      var e,
        t = this,
        n = t.hoverEl,
        i = t.targetEl,
        r = t.staticPos,
        staticPoso0 = r || staticPos;
      if (!r && i) {
        if (staticPos && i.offsetHeight > 300) {
          this.staticPos = staticPos;
          e = {
            top: staticPos.y - 10,
            bottom: staticPos.y + 10,
            left: staticPos.x,
            right: staticPos.x,
          };
        } else {
          var a = i.getBoundingClientRect();
          e = {
            top: a.top,
            bottom: a.top + i.offsetHeight,
            left: a.left,
            right: a.left + i.offsetWidth,
          };
        }
      } else
        staticPoso0
          ? ((e = {
              top: staticPoso0.y - 10,
              bottom: staticPoso0.y + 10,
              left: staticPoso0.x,
              right: staticPoso0.x,
            }),
            (this.staticPos = staticPoso0))
          : (e = {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            });
      var s = activeDocument,
        l = false;
      if (i) {
        l = getComputedStyle(i).direction === "rtl";
        var c = transformRectToTopWindow(e, i.win);
        e = c.rect;
        s = c.win.document;
      }
      n.parentElement !== s.body && s.body.appendChild(n);
      positionFloatingElement(e, n, {
        gap: 10,
        preventOverlap: true,
        horizontalAlignment: l ? "right" : "left",
      });
    };
    t.prototype.watchResize = function (e) {
      var t = this;
      if (!this.observer) {
        var n = 0;
        this.observer = new ResizeObserver(function () {
          var e;
          if (t.state === PopoverState.Shown) {
            if (++n >= 10) {
              (e = t.observer) === null || undefined === e || e.disconnect();
              return void (t.observer = null);
            }
            t.position();
          }
        });
      }
      this.observer.observe(e);
    };
    t.prototype.onunload = function () {
      var t;
      e.prototype.onunload.call(this);
      (t = this.observer) === null || undefined === t || t.disconnect();
      this.observer = null;
    };
    return t;
  })(Component);
function Y_(e, t, n) {
  if (n && !t.footnotes && n.match(/^#\[\^.*]$/)) {
    var i = parseDocumentMetadata(e);
    t.footnotes = i.footnotes;
  }
  return resolveSubpath(t, n);
}
var Z_ = (function (e) {
    function t(publish, n) {
      var i = e.call(this) || this;
      i.id = ic(16);
      i.hoverPopover = null;
      i.currentFilepath = null;
      i.embedDepth = 0;
      i.publish = publish;
      var r = (i.renderer = new MarkdownPreviewRenderer(i, i, n, "/worker.js"));
      r.addHeader();
      r.addFooter();
      return i;
    }
    __extends(t, e);
    t.prototype.renderContent = function (e, currentFilepath) {
      this.currentFilepath = currentFilepath;
      var n = this.renderer,
        i = this.hoverPopover;
      i && (i.hide(), (this.hoverPopover = null));
      n.clear();
      n.set(e);
    };
    t.prototype.onScroll = function () {};
    t.prototype.onFoldChange = function () {};
    t.prototype.onCheckboxClick = function (e, t, n) {};
    t.prototype.onExternalLinkClick = function (e, t, n) {};
    t.prototype.onInternalLinkClick = function (e, t, n) {
      e.preventDefault();
      this.publish.navigate(n, this.currentFilepath, e);
    };
    t.prototype.onInternalLinkDrag = function (e, t, n) {};
    t.prototype.onInternalLinkRightClick = function (e, t, n) {};
    t.prototype.onExternalLinkRightClick = function (e, t, n) {};
    t.prototype.onInternalLinkMouseover = function (e, t, n) {
      var i = this;
      if (this.publish.site.getConfig(_U)) {
        var r = this.hoverPopover;
        if (!(r && r.state !== PopoverState.Hidden && r.targetEl === t)) {
          r = new HoverPopover(this, t);
          setTimeout(function () {
            return __awaiter(i, undefined, undefined, function () {
              var e;
              return __generator(this, function (t) {
                switch (t.label) {
                  case 0:
                    return r.state === PopoverState.Hidden
                      ? [2]
                      : ((e = r.hoverEl.createDiv()), [4, this.loadEmbed(n, this.currentFilepath, e, !0)]);
                  case 1:
                    t.sent() ||
                      (e.createDiv({
                        cls: "markdown-embed",
                        text: "This page does not yet exist.",
                      }),
                      e.addClass("mod-empty"));
                    r.state === PopoverState.Shown && r.position();
                    return [2];
                }
              });
            });
          }, 100);
        }
      }
    };
    t.prototype.onTagClick = function (e, t, n) {
      new V_(this.publish, n).open();
    };
    t.prototype.onQueryClick = function (e, t, n) {};
    t.prototype.postProcess = function (e, promises, frontmatter) {
      var i = this,
        r = this._postProcess({
          docId: this.id,
          sourcePath: this.currentFilepath,
          frontmatter: frontmatter,
          promises: promises,
          addChild: function (e) {
            return i.addChild(e);
          },
          getSectionInfo: function (e) {
            return i.renderer.getSectionInfo(e);
          },
          replace: function () {
            return null;
          },
          containerEl: this.renderer.sizerEl,
          el: e.el,
        });
      e.usesFrontMatter = !!r.usesFrontMatter;
    };
    t.prototype.onRenderComplete = function () {};
    t.prototype._postProcess = function (e) {
      for (
        var t = this,
          n = this.publish.site,
          i = n.cache,
          r = e.sourcePath,
          o = e.promises,
          a = e.el,
          s = 0,
          l = MarkdownPreviewRenderer.postProcessors;
        s < l.length;
        s++
      ) {
        var c = (0, l[s])(a, e);
        if (c && c.then) {
          o.push(c);
        }
      }
      var u = a.findAll("a.internal-link");
      if (u.length > 0)
        for (var h = 0, p = u; h < p.length; h++) {
          var d = p[h];
          if ((T = d.getAttribute("data-href"))) {
            var f = parseLinktext(T),
              m = f.path,
              g = f.subpath,
              v = i.getLinkpathDest(m, r);
            d.toggleClass("is-unresolved", !v);
            v || (v = m || "");
            d.setAttr("href", n.getPublicHref(v) + g);
          }
        }
      var w = a.firstChild;
      if (w instanceof HTMLHeadingElement) {
        var k = w.getAttr("data-heading");
        if (k) {
          w.appendText(" ");
          w.addClass("publish-article-heading");
          var C = w.createSpan({
            cls: "clickable-icon",
          });
          C.addEventListener("click", function () {
            return __awaiter(t, undefined, undefined, function () {
              var e;
              return __generator(this, function (t) {
                e = n.getPublicHref(r) + "#" + v_(stripHeadingForLink(k));
                history.replaceState(null, null, e);
                vc(e);
                new Notice("Link copied to your clipboard");
                return [2];
              });
            });
          });
          setIcon(C, "lucide-link");
          setTooltip(C, "Copy link");
        }
      }
      var E = a.findAll(".internal-embed:not(.is-loaded)");
      if (E.length > 0)
        for (var S = 0, M = E; S < M.length; S++) {
          var x = M[S],
            T = x.getAttribute("src"),
            D = this.loadEmbed(T, r, x);
          o.push(D);
        }
      for (var A = 0, P = a.findAll("img:not([alt])"); A < P.length; A++) {
        var L = P[A];
        L.setAttr("alt", getFilename(L.getAttr("src")));
      }
      for (var I = 0, O = a.findAll('a:not([href]), a[href=""]'); I < O.length; I++) {
        O[I].setAttr("href", "#");
      }
      for (var F = 0, N = a.findAll('input[type="checkbox"]:not([aria-label])'); F < N.length; F++) {
        N[F].setAttr("aria-label", "Task");
      }
      for (var R = 0, B = a.findAll("img, audio, video"); R < B.length; R++) {
        var V = B[R];
        if (V) {
          var H = V.getAttr("src");
          if (isRelativePath(H)) {
            H = cleanString(safeDecodeURI(H));
            (v = n.cache.getLinkpathDest(H, e.sourcePath)) && (V.src = n.getInternalUrl(v));
          }
        }
      }
      return e;
    };
    t.prototype.loadEmbed = function (e, n, i) {
      return __awaiter(this, arguments, Promise, function (e, n, i, r) {
        var o, a, s, l, c, u, h, textp0, d, f, m, g, v, y, w, k, C;
        undefined === r && (r = false);
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              o = this.publish;
              a = o.site;
              s = a.cache;
              l = parseLinktext(e);
              c = l.path;
              u = l.subpath;
              h = s.getLinkpathDest(c, n);
              i.empty();
              return h
                ? ((textp0 = getFilename(h)),
                  (d = getExtension(h)),
                  (f = a.getInternalUrl(h)),
                  IMAGE_EXTENSIONS.contains(d) ? (i.addClass("image-embed"), [4, preloadImage(i, f)]) : [3, 2])
                : [2, !1];
            case 1:
              b.sent();
              return [3, 14];
            case 2:
              return AUDIO_EXTENSIONS.contains(d)
                ? (i.addClass("media-embed", "audio-embed"), [4, preloadAudio(i, f)])
                : [3, 4];
            case 3:
              b.sent();
              return [3, 14];
            case 4:
              return VIDEO_EXTENSIONS.contains(d)
                ? (i.addClass("media-embed", "video-embed"), [4, preloadVideo(i, f)])
                : [3, 6];
            case 5:
              b.sent();
              return [3, 14];
            case 6:
              return PDF_EXTENSIONS.contains(d)
                ? (i.addClass("pdf-embed"),
                  ((m = i.createEl("iframe")).src = f + (u || "")),
                  (m.style.width = "100%"),
                  (m.style.height = "100%"),
                  [3, 14])
                : [3, 7];
            case 7:
              return MARKDOWN_EXTENSIONS.contains(d) && this.embedDepth < 5
                ? ((g = s.getCache(h)),
                  (v = undefined),
                  h !== this.currentFilepath ? [3, 8] : ((v = this.renderer.text), [3, 11]))
                : [3, 13];
            case 8:
              b.trys.push([8, 10, , 11]);
              return [
                4,
                ajaxPromise({
                  withCredentials: true,
                  url: f,
                }),
              ];
            case 9:
              v = b.sent();
              return [3, 11];
            case 10:
              y = b.sent();
              v = y instanceof XMLHttpRequest && y.status === 404 ? "File not found" : "Failed to load";
              return [3, 11];
            case 11:
              w = Y_(v, g, u);
              textp0 = textp0.substr(0, textp0.length - getExtension(textp0).length - 1);
              i.addClass("markdown-embed");
              r ||
                w ||
                i.createDiv({
                  cls: "markdown-embed-title",
                  text: textp0,
                });
              k = i.createDiv("markdown-embed-content");
              i.createDiv("markdown-embed-link", function (t) {
                setIcon(t, "lucide-link");
                setTooltip(t, "Open link");
                t.setAttr("role", "button");
                t.onClickEvent(function (t) {
                  if (!(t.button !== 0 && t.button !== 1)) {
                    t.preventDefault();
                    t.stopPropagation();
                    o.navigate(e, n, t);
                  }
                });
              });
              w && (v = extractSubpathContent(v, g, w).content);
              (C = new t(o, k)).embedDepth = this.embedDepth + 1;
              C.renderContent(v, h);
              return [
                4,
                new Promise(function (e) {
                  C.renderer.onRendered(e);
                }),
              ];
            case 12:
              b.sent();
              return [3, 14];
            case 13:
              i.addClass("file-embed");
              i.createDiv({
                cls: "file-embed-title",
                text: textp0,
              });
              i.createDiv("file-embed-link", function (e) {
                e.addEventListener("click", function () {
                  window.open(f);
                });
                setIcon(e, "lucide-arrow-up-right");
                setTooltip(e, "Open in default app");
              });
              b.label = 14;
            case 14:
              i.addClass("is-loaded");
              return [2, !0];
          }
        });
      });
    };
    return t;
  })(Component),
  X_ = (function (e) {
    function t(t) {
      var n = this,
        renderContainerEl = createDiv("publish-renderer");
      n = e.call(this, t, renderContainerEl) || this;
      var r = renderContainerEl.createDiv("extra-title");
      n.renderContainerEl = renderContainerEl;
      n.extraTitle = r.createSpan("extra-title-text");
      var o = r.createSpan();
      setIcon(o, "lucide-x");
      setTooltip(o, "Close page");
      o.setAttr("role", "button");
      o.addEventListener("click", function () {
        return t.closeRenderer(n);
      });
      return n;
    }
    __extends(t, e);
    t.prototype.loadFile = function (currentFilepath, t) {
      return __awaiter(this, undefined, undefined, function () {
        var n, i, r, o, a, s, l, textc0, u, h, p, d, f, m, g, v, y, w, k;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              if (
                ((i = (n = this).publish),
                (r = n.renderer),
                (o = n.hoverPopover),
                (a = i.site),
                this.currentFilepath === currentFilepath)
              ) {
                this.navigateSubpath(t);
                return [2];
              }
              if (
                ((this.currentFilepath = currentFilepath),
                (s = getFilename(currentFilepath)),
                (l = getExtension(s)),
                (textc0 = ru(currentFilepath)),
                o && (o.hide(), (this.hoverPopover = o = null)),
                this.extraTitle.setText(textc0),
                (u = r.header),
                (h = u.el).empty(),
                a.getConfig(qU) ||
                  h.createEl("h1", {
                    cls: "page-header",
                    text: textc0,
                  }),
                r.updateHeader(),
                r.clear(),
                (p = r.footer),
                (d = p.el).empty(),
                r.updateFooter(),
                l !== "md")
              )
                return [3, 5];
              f = "";
              b.label = 1;
            case 1:
              b.trys.push([1, 3, , 4]);
              return [4, a.loadMarkdownFile(currentFilepath)];
            case 2:
              f = b.sent();
              return [3, 4];
            case 3:
              (m = b.sent()) instanceof XMLHttpRequest
                ? m.status === 404
                  ? new Notice('"'.concat(currentFilepath, '" does not exist'))
                  : (new Notice('An error occurred while loading "'.concat(currentFilepath, '"')),
                    console.error(m.response))
                : (new Notice('An error occurred while loading "'.concat(currentFilepath, '"')), console.error(m));
              return [3, 4];
            case 4:
              r.set(f || " ");
              this.navigateSubpath(t) || (t = "");
              return [3, 6];
            case 5:
              r.set("![[" + currentFilepath + "]]");
              b.label = 6;
            case 6:
              if (
                (i.trigger("navigated"),
                t && ((g = a.getPublicHref(currentFilepath) + y_(t, "#")), history.replaceState(null, null, g)),
                a.getConfig(jU))
              ) {
                for (k in ((v = a.cache.cache),
                (y = []),
                (w = function (dataHref) {
                  if (!v.hasOwnProperty(dataHref) || dataHref === currentFilepath) return "continue";
                  if (
                    iterateCacheRefs(v[dataHref], function (n) {
                      if (a.cache.getLinktextDest(n.link, dataHref) === currentFilepath) return !0;
                    })
                  ) {
                    var textn0 = ru(dataHref),
                      i = createDiv("backlink-item", function (e) {
                        return e.createEl("a", {
                          cls: "internal-link",
                          href: a.getPublicHref(dataHref),
                          attr: {
                            "data-href": dataHref,
                          },
                          text: textn0,
                        });
                      });
                    y.push({
                      el: i,
                      name: textn0,
                    });
                  }
                }),
                v))
                  w(k);
                if (y.length > 0) {
                  r.onRendered(function () {
                    d.empty();
                    var e = d.createDiv("backlinks");
                    e.createDiv("published-section-header", function (e) {
                      e.createSpan("published-section-header-icon", function (e) {
                        setIcon(e, "lucide-link");
                      });
                      e.createSpan({
                        text: "Links to this page",
                      });
                    });
                    var t = e.createDiv("backlink-items-container");
                    y.sort(function (e, t) {
                      return Eb(e.name, t.name);
                    });
                    t.setChildrenInPlace(
                      y.map(function (e) {
                        return e.el;
                      }),
                    );
                    r.updateFooter();
                  });
                }
              }
              return [2];
          }
        });
      });
    };
    t.prototype.onScroll = function () {
      var e = this.publish,
        t = this.renderer;
      if (e.site.getConfig(VU)) {
        var n = t.getScroll();
        e.outline.highlightLine(Math.round(n));
      }
    };
    t.prototype.onResize = function () {
      this.renderer.onResize();
    };
    t.prototype.navigateSubpath = function (e) {
      if (e) {
        var t = this.publish.site.cache.getCache(this.currentFilepath);
        if (t) {
          var n = Y_(this.renderer.text, t, e);
          if (n) {
            this.scrollToLoc(n.start);
            return !0;
          }
        }
      }
      return !1;
    };
    t.prototype.scrollToLoc = function (e) {
      this.renderer.applyScrollDelayed(e.line, {
        highlight: !0,
      });
      this.onScroll();
    };
    return t;
  })(Z_),
  Q_ = (function () {
    function e(publish) {
      var t = this;
      this.renderQueue = new sx();
      this.requestUpdateSearch = debounce(this.updateSearch.bind(this), 200, !0);
      this.query = "";
      this.queryWords = [];
      this.runFullSearch = debounce(function (e, query, i) {
        return __awaiter(t, undefined, undefined, function () {
          var t, r, o, a, s;
          return __generator(this, function (l) {
            switch (l.label) {
              case 0:
                t = this.inputEl;
                r = {
                  url: this.publish.site.host + "/search",
                  method: "POST",
                  withCredentials: true,
                  data: {
                    id: this.publish.site.id,
                    query: query,
                  },
                };
                a = 1;
                l.label = 1;
              case 1:
                if (!(a <= 3)) return [3, 7];
                if (t.value !== e) return [2];
                l.label = 2;
              case 2:
                l.trys.push([2, 4, , 6]);
                return [4, ajaxPromise(r)];
              case 3:
                o = l.sent();
                return [3, 7];
              case 4:
                s = l.sent();
                console.error(s);
                return [4, sleep(5e3 * a)];
              case 5:
                l.sent();
                return [3, 6];
              case 6:
                a++;
                return [3, 1];
              case 7:
                t.value !== e || i.resolve(o ? JSON.parse(o).results : null);
                return [2];
            }
          });
        });
      }, 500);
      this.publish = publish;
      var n = (this.outerContainerEl = createDiv("search-view-outer")),
        i = (this.containerEl = n.createDiv("search-view-container"));
      i.createSpan("published-search-icon", function (e) {
        setIcon(e, "lucide-search");
      });
      var r = (this.inputEl = i.createEl("input", {
        cls: "search-bar",
        type: "text",
        attr: {
          tabIndex: 0,
        },
      }));
      r.setAttribute("placeholder", "Search page or heading...");
      this.resultEl = createDiv("search-results");
      var o = (this.scope = new Scope());
      this.chooser = new Ax(this, this.resultEl, o);
      publish.on("options-updated", this.updateOptions.bind(this));
      r.addEventListener("input", function () {
        t.renderQueue.clear();
        t.runFullSearch.cancel();
        t.requestUpdateSearch();
      });
      r.addEventListener("keydown", this.onKeydown.bind(this));
      document.addEventListener("click", this.onDocumentClick.bind(this));
      __awaiter(t, undefined, undefined, function () {
        var e, t, n, i, r, error, a, s, l, c;
        return __generator(this, function (u) {
          switch (u.label) {
            case 0:
              u.trys.push([0, 8, 9, 14]);
              e = true;
              t = __asyncValues(cx(this.renderQueue.generator()));
              u.label = 1;
            case 1:
              return [4, t.next()];
            case 2:
              if (((n = u.sent()), (a = n.done))) return [3, 7];
              c = n.value;
              e = false;
              i = c;
              u.label = 3;
            case 3:
              u.trys.push([3, 5, , 6]);
              return [4, i()];
            case 4:
              u.sent();
              return [3, 6];
            case 5:
              r = u.sent();
              console.error(r);
              return [3, 6];
            case 6:
              e = true;
              return [3, 1];
            case 7:
              return [3, 14];
            case 8:
              error = u.sent();
              s = {
                error: error,
              };
              return [3, 14];
            case 9:
              u.trys.push([9, , 12, 13]);
              return e || a || !(l = t.return) ? [3, 11] : [4, l.call(t)];
            case 10:
              u.sent();
              u.label = 11;
            case 11:
              return [3, 13];
            case 12:
              if (s) throw s.error;
              return [7];
            case 13:
              return [7];
            case 14:
              return [2];
          }
        });
      });
    }
    e.prototype.onDocumentClick = function (e) {
      if (!e.defaultPrevented) {
        this.resultEl.remove();
        this.renderQueue.clear();
        this.runFullSearch.cancel();
      }
    };
    e.prototype.updateOptions = function () {
      var e = this.publish.site.getConfig(HU);
      Dc && (e = false);
      this.outerContainerEl.toggle(e);
    };
    e.prototype.updateSearch = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, query, o, queryWords, s, l, c, u, h, p, d, f, m, g, v, path, w, k;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              for (
                t = (e = this).resultEl,
                  n = e.inputEl,
                  i = e.chooser,
                  query = n.value,
                  t.empty(),
                  this.renderQueue.clear(),
                  this.query = query,
                  o = query.toLowerCase().split('"'),
                  queryWords = [],
                  s = 0;
                s < o.length;
                s++
              )
                s % 2 == 0 ? queryWords.push.apply(queryWords, o[s].split(" ")) : queryWords.push(o[s]);
              queryWords = queryWords
                .map(function (e) {
                  return e.trim();
                })
                .filter(function (e) {
                  return !!e;
                });
              this.queryWords = queryWords;
              return query
                ? (sortSearchResults((l = this.getCachedResults())),
                  (l = l.slice(0, 30)),
                  i.setSuggestions(l.slice()),
                  document.body.appendChild(t),
                  (c = getComputedStyle(n).direction === "rtl"),
                  (u = function () {
                    positionFloatingElement(n.getBoundingClientRect(), t, {
                      gap: 5,
                      horizontalAlignment: c ? "right" : "left",
                      preventOverlap: true,
                    });
                  })(),
                  (h = rx()),
                  (p = i.addMessage("Searching...")),
                  this.runFullSearch(query, queryWords, h),
                  [4, h.promise])
                : (this.inputEl.removeClass("has-no-results"), t.detach(), [2]);
            case 1:
              if ((d = b.sent()))
                for (
                  f = new Set(
                    l
                      .filter(function (e) {
                        return e.type === "file";
                      })
                      .map(function (e) {
                        return e.path;
                      }),
                  ),
                    m = 0,
                    g = d;
                  m < g.length && ((v = g[m]), !(l.length >= 30));
                  m++
                ) {
                  path = $c(v);
                  f.has(path) ||
                    ((w = {
                      type: "file",
                      path: path,
                      match: {
                        score: 0,
                        matches: [],
                      },
                    }),
                    l.push(w),
                    i.addSuggestion(w));
                }
              k = l.length === 0;
              n.toggleClass("has-no-results", k);
              k ? p.setText("No results found.") : p.detach();
              u();
              return [2];
          }
        });
      });
    };
    e.prototype.getCachedResults = function () {
      var e = this.query,
        t = this.queryWords,
        n = this.publish.site.cache,
        i = [];
      for (var r in n.cache)
        if (n.cache.hasOwnProperty(r) && getExtension(r) === "md") {
          var path = $c(r),
            a = getFilename(path),
            match = Kx(t, e, a),
            matchl0 = Kx(t, e, path);
          match
            ? ((match.score += 0.8),
              jx(match.matches, path.length - a.length),
              i.push({
                type: "file",
                path: path,
                match: match,
              }))
            : matchl0 &&
              ((matchl0.score += 0.5),
              i.push({
                type: "file",
                path: path,
                match: matchl0,
              }));
          var c = n.getCache(r);
          if (c) {
            var u = parseFrontMatterAliases(c.frontmatter);
            if (u)
              for (var h = 0, p = u; h < p.length; h++) {
                var alias = p[h];
                if ((matchg0 = Kx(t, e, alias))) {
                  i.push({
                    type: "alias",
                    alias: alias,
                    path: path,
                    match: matchg0,
                  });
                }
              }
            if (c.headings)
              for (var f = 0, m = c.headings; f < m.length; f++) {
                var matchg0,
                  heading = m[f];
                if ((matchg0 = Kx(t, e, heading.heading))) {
                  i.push({
                    type: "heading",
                    path: path,
                    heading: heading,
                    match: matchg0,
                  });
                }
              }
          }
        }
      return i;
    };
    e.prototype.onKeydown = function (e) {
      if (this.inputEl === document.activeElement) {
        var t = {
          modifiers: Keymap.getModifiers(e),
          key: getKeyName(e),
          vkey: getVirtualKey(e),
        };
        this.scope.handleKey(e, t);
      }
    };
    e.prototype.renderSuggestion = function (e, t) {
      var n = this;
      t.addClass("mod-complex");
      var i = t.createDiv("suggestion-content"),
        r = t.createDiv("suggestion-aux"),
        o = i.createDiv("suggestion-title"),
        a = i.createDiv("suggestion-note");
      if (e.type === "file") {
        var s = e.path,
          l = getFilename(s),
          c = s.substr(0, s.length - l.length - 1);
        if (
          (renderResults(a, c, e.match),
          renderResults(o, l, e.match, l.length - s.length),
          this.inputEl.value.length <= 2)
        )
          return;
        this.renderQueue.add(function () {
          return __awaiter(n, undefined, undefined, function () {
            var e, t, n, r, o, l, c, u, h, p, d, f, m, g;
            return __generator(this, function (v) {
              switch (v.label) {
                case 0:
                  return [4, this.publish.site.loadMarkdownFile(s + ".md")];
                case 1:
                  if (
                    ((e = v.sent()),
                    (t = e.substring(getFrontMatterInfo(e).contentStart)),
                    (n = nodeToPlainText(parseMetadata(t))),
                    (r = Gx(this.queryWords, n)))
                  )
                    for (
                      o = r.map(function (e) {
                        var t = Qx(n, e, 50);
                        return [t[0], t[1]];
                      }),
                        o = Nx(o),
                        l = 0,
                        c = 0,
                        u = o;
                      c < u.length;
                      c++
                    ) {
                      if (((h = u[c]), (p = h[0]), (d = h[1]), p > 0))
                        for (
                          f = 0;
                          f < 30 &&
                          p <= d &&
                          !((m = n.charAt(p - 1)) === "\n" || Bx.test(m) || Rx.test(m) || Vx.test(m));
                          f++
                        )
                          p++;
                      if (d < n.length - 1)
                        for (
                          f = 0;
                          f < 30 && p <= d && !((m = n.charAt(d)) === "\n" || Bx.test(m) || Rx.test(m) || Vx.test(m));
                          f++
                        )
                          d--;
                      if (
                        ((g = createDiv("suggestion-detail")),
                        p > 0 && n.charAt(p - 1) !== "\n" && g.appendText("..."),
                        renderMatches(g, n.substring(p, d), r, -p),
                        d < n.length - 1 && n.charAt(d) !== "\n" && g.appendText("..."),
                        i.insertBefore(g, a),
                        ++l >= 3)
                      )
                        break;
                    }
                  return [4, sleep(100)];
                case 2:
                  v.sent();
                  return [2];
              }
            });
          });
        });
      } else if (e.type === "alias") {
        var u = e.path;
        renderResults(o, e.alias, e.match);
        a.setText(u);
        r.createSpan(
          {
            cls: "suggestion-flair",
            prepend: !0,
          },
          function (e) {
            setIcon(e, "lucide-forward");
            setTooltip(e, "Alias");
          },
        );
      } else if (e.type === "heading") {
        renderResults(o, e.heading.heading, e.match);
        a.setText(e.path);
        r.createSpan({
          cls: "suggestion-flair",
          text: "H",
          prepend: true,
        });
      }
    };
    e.prototype.selectSuggestion = function (e, t) {
      e.type === "file" || e.type === "alias"
        ? this.publish.navigate(e.path, "", t instanceof MouseEvent ? t : null)
        : e.type === "heading" &&
          this.publish.navigate(
            e.path + "#" + stripHeadingForLink(e.heading.heading),
            "",
            t instanceof MouseEvent ? t : null,
          );
      this.inputEl.value = "";
      this.updateSearch();
      this.publish.containerEl.removeClass("is-left-column-open");
    };
    return e;
  })();
var $_ = 700,
  J_ = 36,
  ej = "obsidian.css",
  tj = "publish.css",
  nj = "publish.js",
  ij = /^favicon-([0-9]+)(x[0-9]+)?.png$/i;
function rj(e) {
  return (
    !e || (e.getAllResponseHeaders().toLowerCase().contains("obs-status") && e.getResponseHeader("obs-status") !== null)
  );
}
function oj(e) {
  return !e || (e.headers.has("obs-status") && e.headers.get("obs-status") !== null);
}
function aj() {
  for (var e = 0, t = Array.from(document.head.childNodes); e < t.length; e++) {
    var n = t[e];
    if (n instanceof HTMLLinkElement && n.rel === "preload" && n.as === "style") {
      n.onload = null;
      n.rel = "stylesheet";
    }
  }
  var i = fishAll(".preload");
  if (i)
    for (var r = 0, o = i; r < o.length; r++) {
      o[r].detach();
    }
}
var Publish = (function (e) {
    function t() {
      var publish = e.call(this) || this;
      publish.stack = [];
      publish.origin = location.origin;
      publish.slidingWindowMode = false;
      publish.keymap = new Keymap();
      publish.scope = publish.keymap.getRootScope();
      var n = {
        "allow-downloads": true,
        "allow-forms": true,
        "allow-modals": true,
        "allow-orientation-lock": true,
        "allow-pointer-lock": true,
        "allow-popups": true,
        "allow-presentation": true,
        "allow-same-origin": true,
        "allow-scripts": true,
      };
      DOMPurify.addHook("afterSanitizeAttributes", function (e) {
        if (
          (e.instanceOf(HTMLIFrameElement) &&
            (e.hasAttribute("sandbox")
              ? filterNodeAttributes(e, "sandbox", " ", n)
              : e.setAttribute(
                  "sandbox",
                  "allow-forms allow-modals allow-presentation allow-popups allow-same-origin allow-scripts",
                )),
          e.instanceOf(HTMLAnchorElement))
        ) {
          var i = e.getAttribute("rel") || "";
          i.split(" ").contains("nofollow") || (i += " nofollow");
          e.hasClass("internal-link") &&
            e.hasAttribute("data-href") &&
            e.href.startsWith(publish.site.pathprefix) &&
            (i = i.replace("nofollow", "").trim());
          e.setAttribute("rel", i);
        }
      });
      (function () {
        try {
          window.localStorage.setItem("obsidian", "obsidian");
          window.localStorage.removeItem("obsidian");
        } catch (t) {
          var value = Object.defineProperties(
            {},
            {
              length: {
                get: function () {
                  return Object.keys(this).length;
                },
              },
              clear: {
                value: function () {
                  for (var e in this)
                    if (Object.prototype.hasOwnProperty.call(this, e)) {
                      delete this[e];
                    }
                },
              },
              getItem: {
                value: function (e) {
                  return Object.prototype.hasOwnProperty.call(this, e) ? null : this[e];
                },
              },
              key: {
                value: function (e) {
                  var t = Object.keys(this);
                  return e < 0 || e >= t.length ? null : t[e];
                },
              },
              removeItem: {
                value: function (e) {
                  if (!Object.prototype.hasOwnProperty.call(this, e)) {
                    delete this[e];
                  }
                },
              },
              setItem: {
                value: function (e, t) {
                  this[e] = t;
                },
              },
            },
          );
          Object.defineProperty(window, "localStorage", {
            value: value,
          });
        }
      })();
      XN.progressiveRender = false;
      XN.listBullet = false;
      "isBot" in window && (XN.asyncParse = false);
      isMacOS || document.body.addClass("styled-scrollbars");
      var i = (publish.noindexEl = createEl("meta"));
      i.name = "robots";
      i.content = "noindex";
      var r = (publish.containerEl = document.body.createDiv("published-container print"));
      r.hide();
      var o = r.createDiv("site-body"),
        a = (publish.leftColumnEl = o.createDiv("site-body-left-column")),
        s = (publish.leftColumnInnerEl = a.createDiv("site-body-left-column-inner")),
        l = (publish.leftSiteHeaderLogoLinkEl = s.createEl("a", "site-body-left-column-site-logo")),
        c = (publish.leftSiteHeaderLogoEl = l.createEl("img"));
      c.setAttr("aria-hidden", !0);
      c.hide();
      publish.leftSiteHeaderEl = s.createEl("a", "site-body-left-column-site-name");
      (publish.leftSiteThemeToggleEl = s.createDiv("site-body-left-column-site-theme-toggle")).hide();
      var h = o.createDiv("site-body-center-column"),
        p = (publish.siteHeaderEl = h.createDiv("site-header"));
      p.createDiv("clickable-icon", function (e) {
        setIcon(e, "lucide-menu");
        e.addEventListener("click", function () {
          r.classList.toggle("is-left-column-open");
          publish.site.getConfig(RU) && publish.nav.init(!0);
        });
      });
      r.createDiv("nav-backdrop", function (e) {
        e.addEventListener("click", function () {
          r.removeClass("is-left-column-open");
        });
      });
      var d = (publish.siteLogoLinkEl = p.createEl("a", "site-header-logo"));
      d.setAttr("aria-hidden", !0);
      d.hide();
      publish.siteLogoEl = d.createEl("img");
      publish.siteHeaderTextEl = p.createEl("a", "site-header-text");
      publish.search = new Q_(publish);
      publish.nav = new D_(publish, s);
      var f = (publish.renderContainerEl = h.createDiv("render-container"));
      publish.renderContainerInnerEl = f.createDiv("render-container-inner");
      var m = (publish.render = new X_(publish)),
        g = (publish.footerEl = h.createDiv("site-footer"));
      publish.notFoundEl = f.createDiv("not-found-container", function (e) {
        e.createDiv("not-found-image");
        e.createDiv({
          cls: "not-found-title",
          text: "Not found",
        });
        e.createDiv({
          cls: "not-found-description",
          text: "This page does not exist",
        });
      });
      var v = (publish.rightColumnEl = f.createDiv("site-body-right-column")),
        w = (publish.rightColumnInnerEl = v.createDiv("site-body-right-column-inner"));
      publish.graph = new f_(publish, w);
      publish.outline = new N_(publish, w);
      g.createEl("a", {
        attr: {
          href: "https://publish.obsidian.md",
          target: "_blank",
        },
        text: "Powered by Obsidian Publish",
      });
      window.addEventListener("popstate", function () {
        return publish.loadFromUrl();
      });
      window.addEventListener(
        "resize",
        debounce(
          function () {
            return publish.onResize();
          },
          50,
          !0,
        ),
      );
      publish.on("navigated", publish.onNavigated.bind(publish));
      publish.stack.push(m);
      publish.toggleNotFound(!1);
      r.removeClass("has-not-found");
      window.siteInfo && (publish.site = new lj(publish, window.siteInfo));
      window.applyCss = function (e) {
        publish.applyCss(e);
      };
      window.applyCssByLink = function (e) {
        return __awaiter(publish, undefined, undefined, function () {
          var t, n;
          return __generator(this, function (i) {
            switch (i.label) {
              case 0:
                i.trys.push([0, 2, , 3]);
                return [
                  4,
                  ajaxPromise({
                    url: e,
                  }),
                ];
              case 1:
                t = i.sent();
                this.applyCss(t);
                return [3, 3];
              case 2:
                n = i.sent();
                console.error(n);
                return [3, 3];
              case 3:
                return [2];
            }
          });
        });
      };
      window.require = function () {
        return u;
      };
      window.publish = publish;
      publish.load();
      return publish;
    }
    __extends(t, e);
    t.prototype.load = function () {
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
          h,
          p,
          d,
          f,
          m,
          g,
          v,
          y,
          w,
          k,
          C,
          content,
          S,
          M,
          x,
          T,
          D,
          A,
          P,
          L,
          I,
          O,
          F,
          N,
          R,
          B,
          V,
          H,
          z,
          q,
          W,
          U,
          _,
          j,
          G,
          K,
          sizes,
          Z,
          X,
          Q = this;
        return __generator(this, function (b) {
          switch (b.label) {
            case 0:
              t = (e = this).containerEl;
              n = e.site;
              i = e.render;
              return n
                ? (n.status === "degraded" &&
                    ((r = document.body.createDiv("top-notice")).setText(
                      "This site is no longer active. If you are the owner of the site, please update your subscription ",
                    ),
                    r.createEl("a", {
                      attr: {
                        href: "https://obsidian.md/account",
                        target: "_blank",
                      },
                      text: "here",
                    }),
                    r.appendText(".")),
                  (o = n.loadOptions()),
                  (a = n.loadCache()),
                  [4, o])
                : (aj(), t.show(), i.renderContent("### Site not found."), [2]);
            case 1:
              b.sent();
              aj();
              t.show();
              l = (s = this).leftColumnInnerEl;
              c = s.rightColumnInnerEl;
              u = s.siteHeaderEl;
              h = s.siteHeaderTextEl;
              p = s.siteLogoEl;
              d = s.siteLogoLinkEl;
              f = s.leftSiteHeaderEl;
              m = s.leftSiteHeaderLogoEl;
              g = s.leftSiteHeaderLogoLinkEl;
              v = s.renderContainerEl;
              y = n.getConfig(RU);
              w = n.getConfig(BU);
              k = n.getConfig(VU);
              C = this.search.outerContainerEl;
              y ? l.insertBefore(C, this.leftSiteThemeToggleEl.nextSibling) : w || k ? c.prepend(C) : u.prepend(C);
              content = n.getSiteName();
              h.setText(content);
              f.setText(content);
              f.setAttr("aria-label", content);
              g.setAttr("aria-label", "".concat(content, " logo"));
              document.head.find('meta[property="og:site_name"]') ||
                ((S = document.head.find('meta[name="description"]')) &&
                  S.parentNode.insertBefore(
                    createEl("meta", {
                      attr: {
                        property: "og:site_name",
                        content: content,
                      },
                    }),
                    S,
                  ));
              (M = n.getConfig(FU)) === "system"
                ? ((x = window.matchMedia("(prefers-color-scheme: dark)")),
                  (T = function () {
                    x.matches ? Q.setTheme("dark") : Q.setTheme("light");
                  }),
                  x.addEventListener("change", T),
                  T())
                : this.setTheme(M);
              n.getConfig(NU) &&
                ((D = function (e) {
                  var t = Q.themeInEffect === "dark",
                    n = t ? "light" : "dark";
                  Q.setTheme(n);
                  Q.leftSiteThemeToggleEl.toggleClass("is-dark", !t);
                  e.toggleClass("is-enabled", !t);
                  localStorage.setItem("site-theme", n);
                  Q.graph.renderer && Q.graph.renderer.testCSS();
                }),
                (A = localStorage.getItem("site-theme")) && this.setTheme(A),
                this.leftSiteThemeToggleEl.createSpan(
                  {
                    cls: "option mod-dark",
                  },
                  function (e) {
                    setIcon(e, "lucide-moon");
                  },
                ),
                this.leftSiteThemeToggleEl.createDiv("checkbox-container", function (e) {
                  Q.leftSiteThemeToggleEl.toggleClass("is-dark", Q.themeInEffect === "dark");
                  e.toggleClass("is-enabled", Q.themeInEffect === "dark");
                  e.addEventListener("click", function () {
                    return D(e);
                  });
                }),
                this.leftSiteThemeToggleEl.createSpan(
                  {
                    cls: "option mod-light",
                  },
                  function (e) {
                    setIcon(e, "lucide-sun");
                  },
                ),
                this.leftSiteThemeToggleEl.show());
              (P = n.getConfig(GU)) &&
                (v.on("click", ".publish-renderer", this.onPublishRendererClick.bind(this)),
                v.addEventListener("scroll", this.onSlidingWindowScroll.bind(this)));
              L = !P && !!n.getConfig(WU);
              this.containerEl.toggleClass("is-readable-line-width", L);
              remarkParser.globalOptions.breaks = !n.getConfig(UU);
              i.renderContent("### Loading site...");
              b.label = 2;
            case 2:
              b.trys.push([2, 4, , 9]);
              return [4, a];
            case 3:
              b.sent();
              return [3, 9];
            case 4:
              return (I = b.sent()) instanceof XMLHttpRequest && I.status === 401
                ? (this.setNoIndex(!0),
                  [
                    4,
                    new Promise(function (e) {
                      new B_(Q, e).open();
                    }),
                  ])
                : [3, 7];
            case 5:
              b.sent();
              return [4, n.loadCache()];
            case 6:
              b.sent();
              return [3, 8];
            case 7:
              console.error(I);
              new Notice("Oh no! Seems like something went wrong!");
              return [2];
            case 8:
              return [3, 9];
            case 9:
              if (
                ((O = document.head),
                (F = n.getSiteLogoUrl()) &&
                  n.cache.has(F) &&
                  ((N = n.getInternalUrl(F)), d.show(), p.setAttribute("src", N), m.show(), m.setAttribute("src", N)),
                this.addLinkToSiteRoot(h),
                this.addLinkToSiteRoot(f),
                this.addLinkToSiteRoot(g),
                this.addLinkToSiteRoot(d),
                (R = n.getConfig(zU)),
                n.isCustomDomain() && R)
              )
                try {
                  R.startsWith("G-")
                    ? ((window.dataLayer = window.dataLayer || []),
                      (window.gtag = function () {
                        window.dataLayer.push(arguments);
                      }),
                      window.gtag("js", new Date()),
                      window.gtag("config", R),
                      ((X = O.createEl("script")).async = true),
                      (X.src = "https://www.googletagmanager.com/gtag/js?id=" + R))
                    : ((window.GoogleAnalyticsObject = "ga"),
                      (B = window.ga =
                        function () {
                          (B.q = B.q || []).push(arguments);
                        }),
                      (B.l = Date.now()),
                      ((X = O.createEl("script")).async = true),
                      (X.src = "https://www.google-analytics.com/analytics.js"),
                      B("create", R, "auto"),
                      B("send", "pageview"));
                } catch (e) {}
              for (V = false, H = false, z = 0, q = Array.from(O.childNodes); z < q.length; z++)
                if ((W = q[z]) instanceof HTMLLinkElement && W.rel === "stylesheet") {
                  W.href.contains(ej) && (V = true);
                  W.href.contains(tj) && (H = true);
                }
              for (j in (!V &&
                n.cache.has(ej) &&
                O.createEl("link", {
                  href: n.getInternalUrl(ej),
                  attr: {
                    rel: "stylesheet",
                  },
                }),
              !H &&
                n.cache.has(tj) &&
                O.createEl("link", {
                  href: n.getInternalUrl(tj),
                  attr: {
                    rel: "stylesheet",
                  },
                }),
              (U = n.cache.cache),
              (_ = O.find('link[rel="icon"]:not([sizes])')),
              U))
                if (U.hasOwnProperty(j)) {
                  if ((G = getFilename(j)) === "favicon.ico") {
                    O.createEl("link", {
                      href: n.getInternalUrl(j),
                      attr: {
                        rel: "icon",
                      },
                    });
                    _ && _.detach();
                    continue;
                  }
                  if ((K = G.match(ij))) {
                    sizes = K[1] + (K[2] || "x" + K[1]);
                    O.createEl("link", {
                      href: n.getInternalUrl(j),
                      attr: {
                        rel: "icon",
                        sizes: sizes,
                      },
                    });
                    _ && _.detach();
                  }
                }
              this.trigger("options-updated");
              this.updateSlidingWindow();
              return n.isCustomDomain() && n.cache.has(nj)
                ? (((Z = createEl("script")).async = true),
                  (Z.src = n.getInternalUrl(nj)),
                  [
                    4,
                    new Promise(function (e) {
                      Z.addEventListener("load", e);
                      Z.addEventListener("error", e);
                      O.appendChild(Z);
                    }),
                  ])
                : [3, 11];
            case 10:
              b.sent();
              b.label = 11;
            case 11:
              return [4, this.loadFromUrl()];
            case 12:
              b.sent();
              try {
                (X = i.renderer.previewEl).style.outline = "none";
                X.tabIndex = -1;
                X.focus();
              } catch (e) {
                console.error(e);
              }
              return [2];
          }
        });
      });
    };
    t.prototype.loadFromUrl = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o, a, s;
        return __generator(this, function (l) {
          switch (l.label) {
            case 0:
              t = (e = this).site;
              n = e.render;
              i = this.parseUrl();
              r = i.path;
              o = i.subpath;
              a = r;
              r === "" && ((a = t.getConfig(PU)), (o = ""));
              this.toggleNotFound(!1);
              return (s = t.cache.getLinktextDest(a, ""))
                ? [4, n.loadFile(s, o)]
                : ((n.currentFilepath = ""),
                  r === ""
                    ? (n.renderContent("### Welcome to " + t.getSiteName()), this.setNoIndex(!1), [2])
                    : (this.setNoIndex(!0),
                      history.replaceState(null, null, t.pathprefix + "404"),
                      n.renderContent(""),
                      this.toggleNotFound(!0),
                      [2]));
            case 1:
              l.sent();
              return [2];
          }
        });
      });
    };
    t.prototype.toggleNotFound = function (e) {
      this.containerEl.toggleClass("has-not-found", e);
      this.notFoundEl.toggle(e);
    };
    t.prototype.setTheme = function (themeInEffect) {
      ["light", "dark"].contains(themeInEffect)
        ? (document.body.removeClasses(["theme-light", "theme-dark"]),
          document.body.addClass("theme-".concat(themeInEffect)),
          (this.themeInEffect = themeInEffect))
        : console.error("Not a valid theme: ", themeInEffect);
    };
    t.prototype.addLinkToSiteRoot = function (e) {
      var t = this,
        n = this.site,
        i = n.getConfig(PU);
      e.setAttr("href", n.getPublicHref(i));
      e.addEventListener("click", function (e) {
        e.preventDefault();
        t.slidingWindowMode && (t.stack = []);
        t.navigate(i, "", e);
      });
    };
    t.prototype.onResize = function () {
      this.render.onResize();
      this.graph.onResize();
      this.updateSlidingWindow();
    };
    t.prototype.parseUrl = function () {
      var path,
        t = location.pathname,
        n = this.site.customurl,
        i = false;
      if (n) {
        var r = location.host + t;
        if (r.startsWith(n)) {
          t = r.substring(n.length);
          i = true;
        }
      }
      if ((t.startsWith("/") && (t = t.substring(1)), !i)) {
        var o = t.indexOf("/");
        t = o >= 0 ? t.substring(o + 1) : "";
      }
      var a = this.site.cache.permalinks;
      path =
        a.hasOwnProperty(t) && t
          ? a[t]
          : t
              .split("/")
              .filter(function (e) {
                return e;
              })
              .map(g_)
              .join("/");
      var s = location.hash || "";
      return {
        path: path,
        subpath: (s = s.split("#").map(g_).join("#")),
      };
    };
    t.prototype.navigate = function (e, t, n) {
      var i = this.site;
      if (i) {
        this.toggleNotFound(!1);
        var r = parseLinktext(e),
          o = r.path,
          a = r.subpath,
          s = i.cache.getLinkpathDest(o, t);
        if (s) {
          if (n && Keymap.isModEvent(n)) window.open(i.getPublicHref(s));
          else if (this.slidingWindowMode) {
            for (var l = this.stack, c = 0, u = l; c < u.length; c++) {
              var h = u[c];
              if (h.currentFilepath === s) {
                h.loadFile(s, a);
                return void this.scrollToWindow(h);
              }
            }
            if (n) {
              for (var p = n.currentTarget, d = null; p && p !== this.renderContainerInnerEl; ) {
                d = p;
                p = p.parentElement;
              }
              for (var f = 0; f < l.length - 1; f++) {
                if (l[f].renderContainerEl === d) {
                  l.splice(f + 1, l.length - f - 1);
                  break;
                }
              }
            }
            var render = new X_(this);
            l.push(render);
            render.loadFile(s, a);
            this.render = render;
            this.updateSlidingWindow();
            this.scrollToWindow(render);
          } else this.render.loadFile(s, a);
          if (i.isCustomDomain())
            try {
              window.ga && window.ga("send", "pageview");
              window.gtag && window.gtag("event", "page_view");
            } catch (e) {}
        } else new Notice('The link destination "'.concat(e, '" does not exist.'));
      }
    };
    t.prototype.closeRenderer = function (e) {
      if (this.slidingWindowMode) {
        var t = this.stack,
          n = t.indexOf(e);
        if (-1 !== n) {
          t.remove(e);
          e === this.render && ((n = Math.min(n, t.length - 1)), this.scrollToWindow(t[n]));
          this.updateSlidingWindow();
        }
      }
    };
    t.prototype.updateSlidingWindow = function () {
      var e = this.site,
        t = this.renderContainerInnerEl;
      if (e) {
        var n = document.body.clientWidth - this.leftColumnEl.clientWidth - this.rightColumnEl.clientWidth,
          slidingWindowMode = e.getConfig(GU) && n >= $_,
          r = this.slidingWindowMode !== slidingWindowMode;
        if (
          (r &&
            ((this.slidingWindowMode = slidingWindowMode),
            (this.stack = [this.render]),
            document.body.toggleClass("sliding-windows", slidingWindowMode)),
          slidingWindowMode || r)
        )
          for (var o = this.stack, a = 0; a < o.length; a++) {
            var s = o[a].renderContainerEl.style;
            slidingWindowMode
              ? ((s.minWidth = $_ + "px"), (s.left = a * J_ + "px"), (s.right = (o.length - a) * J_ - $_ + "px"))
              : ((s.minWidth = ""), (s.left = ""), (s.right = ""));
          }
        t.setChildrenInPlace(
          this.stack.map(function (e) {
            return e.renderContainerEl;
          }),
        );
      }
    };
    t.prototype.scrollToWindow = function (render) {
      var t = this.stack,
        n = this.renderContainerEl,
        i = t.indexOf(render);
      if (-1 !== i) {
        this.render = render;
        this.trigger("navigated");
        var r = i * $_;
        if (n.scrollLeft < r || n.scrollLeft + n.clientWidth > r + $_) {
          n.scrollTo({
            left: r - i * J_,
            top: 0,
            behavior: "smooth",
          });
        }
      }
    };
    t.prototype.onPublishRendererClick = function (e, t) {
      if (!e.defaultPrevented)
        for (var n = 0, i = this.stack; n < i.length; n++) {
          var r = i[n];
          if (r.renderContainerEl === t) {
            this.scrollToWindow(r);
            break;
          }
        }
    };
    t.prototype.onSlidingWindowScroll = function () {
      for (
        var e = this.stack, t = this.renderContainerEl, n = t.scrollLeft, i = n + t.clientWidth, r = 0;
        r < e.length;
        r++
      ) {
        var o = e[r];
        o.renderContainerEl.toggleClass(
          "mod-overlay",
          (r > 0 && n > 664 * (r - 1)) || r * $_ + (e.length - r - 1) * J_ > i,
        );
        o.renderContainerEl.toggleClass("mod-squished", n >= 664 * (r + 1) || r * $_ + (e.length - r) * J_ >= i);
      }
    };
    t.prototype.onNavigated = function () {
      var e = this.site,
        t = this.render.currentFilepath,
        n = e.isCustomDomain() ? "" : " - Obsidian Publish";
      if (t) {
        this.setNoIndex(!1);
        var i = ru(t);
        document.title = i + " - " + e.getSiteName() + n;
        var r = e.getPublicHref(t);
        if (location.href !== r) {
          history.pushState(null, null, r);
        }
      } else {
        this.setNoIndex(!0);
        document.title = e.getSiteName() + n;
      }
    };
    t.prototype.setNoIndex = function (e) {
      if (this.site.getConfig(OU)) {
        e = true;
      }
      var t = this.noindexEl;
      e && !t.parentNode ? document.head.appendChild(t) : !e && t.parentNode && t.detach();
    };
    t.prototype.applyCss = function (e) {
      this.styleEl ||
        ((this.styleEl = createEl("style", {
          type: "text/css",
        })),
        document.head.appendChild(this.styleEl));
      this.styleEl.setText(e);
    };
    Object.defineProperty(t.prototype, "currentFilepath", {
      get: function () {
        return this.render.currentFilepath;
      },
      enumerable: false,
      configurable: true,
    });
    t.prototype.registerMarkdownPostProcessor = function (e, t) {
      MarkdownPreviewRenderer.registerPostProcessor(e, t);
      return e;
    };
    t.prototype.registerMarkdownCodeBlockProcessor = function (e, t, n) {
      var i = MarkdownPreviewRenderer.createCodeBlockPostProcessor(e, t);
      MarkdownPreviewRenderer.registerPostProcessor(i, n);
      MarkdownPreviewRenderer.registerCodeBlockPostProcessor(e, t);
      return i;
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
  lj = (function () {
    function e(publish, t) {
      var n;
      this.pwts = 0;
      this.pwsig = "";
      this.options = {};
      this.publish = publish;
      this.id = t.uid;
      this.host = (n = t.host).startsWith("127.0.0.1") || n.startsWith("localhost") ? "http://" + n : "https://" + n;
      this.status = t.status;
      this.slug = t.slug;
      this.customurl = t.customurl;
      this.hpw = localStorage[t.uid];
      this.cache = new AU();
      this.customurl
        ? (this.pathprefix = "https://" + this.customurl + "/")
        : (this.pathprefix = this.publish.origin + "/" + encodeURIComponent(this.slug) + "/");
    }
    e.prototype.loadCache = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              if (!(e = window.preloadCache)) return [3, 7];
              a.label = 1;
            case 1:
              a.trys.push([1, 6, , 7]);
              delete window.preloadCache;
              return [4, e];
            case 2:
              return (t = a.sent()).ok && oj(t) ? ((i = (n = this.cache).load), [4, t.json()]) : [3, 5];
            case 3:
              return [4, i.apply(n, [a.sent()])];
            case 4:
              a.sent();
              return [2];
            case 5:
              return [3, 7];
            case 6:
              a.sent();
              return [3, 7];
            case 7:
              r = {
                withCredentials: true,
                url: this.host + "/cache/" + encodeURIComponent(this.id) + this.getPathSuffix(),
              };
              return [4, ajaxPromise(r)];
            case 8:
              o = a.sent();
              return rj(r.req) ? [4, this.cache.load(JSON.parse(o))] : [2];
            case 9:
              a.sent();
              return [2];
          }
        });
      });
    };
    e.prototype.loadOptions = function () {
      return __awaiter(this, undefined, undefined, function () {
        var e, t, n, i, r, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              if (!(e = window.preloadOptions)) return [3, 6];
              a.label = 1;
            case 1:
              a.trys.push([1, 5, , 6]);
              delete window.preloadOptions;
              return [4, e];
            case 2:
              return (t = a.sent()).ok && oj(t) ? ((n = this), [4, t.json()]) : [3, 4];
            case 3:
              n.options = a.sent();
              return [2];
            case 4:
              return [3, 6];
            case 5:
              a.sent();
              return [3, 6];
            case 6:
              a.trys.push([6, 8, , 9]);
              i = {
                withCredentials: true,
                url: this.host + "/options/" + encodeURIComponent(this.id),
              };
              return [4, ajaxPromise(i)];
            case 7:
              r = a.sent();
              return rj(i.req) ? ((this.options = JSON.parse(r)), [3, 9]) : [2];
            case 8:
              o = a.sent();
              console.error("Failed to load options", o);
              return [3, 9];
            case 9:
              return [2];
          }
        });
      });
    };
    e.prototype.getPathSuffix = function () {
      var e = this,
        t = e.hpw,
        n = e.pwts,
        i = e.pwsig;
      if (!t) return "";
      var r = Date.now(),
        o = 36e5;
      n + o < r && ((n = this.pwts = Math.floor(r / o + 6) * o), (i = this.pwsig = xU().stringify(DU()(String(n), t))));
      return "?ts=".concat(String(n), "&sig=").concat(i);
    };
    e.prototype.isCustomDomain = function () {
      return !!this.customurl;
    };
    e.prototype.getConfig = function (e) {
      var t = this.options[e];
      undefined === t && (t = ZU[e]);
      return t;
    };
    e.prototype.getSiteName = function () {
      return this.getConfig(LU) || this.slug || "";
    };
    e.prototype.getSiteLogoUrl = function () {
      return this.getConfig(IU) || "";
    };
    e.prototype.encodeFilepath = function (e, t) {
      return e
        .split("/")
        .map(t ? v_ : encodeURIComponent)
        .join("/");
    };
    e.prototype.getInternalUrl = function (e) {
      return (
        this.host + "/access/" + encodeURIComponent(this.id) + "/" + this.encodeFilepath(e, !1) + this.getPathSuffix()
      );
    };
    e.prototype.getPublicHref = function (e) {
      var t,
        n = this.cache.getCache(e);
      if (getExtension(getFilename(e)) === "md") {
        e = e.substr(0, e.length - 3);
      }
      var i = this.encodeFilepath(e, !0),
        r = (t = n == null ? undefined : n.frontmatter) === null || undefined === t ? undefined : t.permalink;
      r && typeof r == "string" && (r.startsWith("/") && (r = r.substring(1)), (i = r));
      return this.pathprefix + i;
    };
    e.prototype.loadMarkdownFile = function (e) {
      return __awaiter(this, undefined, Promise, function () {
        var t, n, i;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              if (((t = this.getInternalUrl(e)), !(n = window.preloadPage))) return [3, 4];
              delete window.preloadPage;
              r.label = 1;
            case 1:
              r.trys.push([1, 3, , 4]);
              return [4, n];
            case 2:
              return (i = r.sent()).ok && i.url === t ? [2, i.text()] : [3, 4];
            case 3:
              r.sent();
              return [3, 4];
            case 4:
              return [
                4,
                ajaxPromise({
                  withCredentials: true,
                  url: t,
                }),
              ];
            case 5:
              return [2, r.sent()];
          }
        });
      });
    };
    return e;
  })(),
  cj = i18nProxy.plugins.bases,
  uj = ["==", "!=", "<", ">", "<=", ">="],
  hj = ["<", ">", "<=", ">="];
var pj = (function () {
    function e(app, t, queryController) {
      this.app = app;
      this.queryController = queryController;
      this.plugin = app.internalPlugins.getEnabledPluginById("bases");
      this.innerContainerEl = t.createDiv("bases-query-container");
    }
    e.prototype.save = function () {
      var e,
        t = this.root.serialize();
      if (!((e = this.saveFn) === null || undefined === e)) {
        e.call(this, t);
      }
    };
    e.prototype.emptyTopLevelFilter = function () {
      this.innerContainerEl.empty();
      var e = new lq(null);
      this.root = new fj(e, this, null);
      this.innerContainerEl.appendChild(this.root.containerEl);
      this.save();
    };
    e.prototype.updateQuery = function (saveFn, viewConfig, n) {
      var i = this;
      this.saveFn = saveFn;
      this.viewConfig = viewConfig;
      (function () {
        if (!i.root) return !0;
        var e = i.root.serialize(),
          t = n == null ? undefined : n.serialize();
        return !(!e && !t) && JSON.stringify(e) !== JSON.stringify(t);
      })() &&
        (this.innerContainerEl.empty(),
        (this.root = dj.fromParsedQueryFilter(n, this)),
        this.innerContainerEl.appendChild(this.root.containerEl));
    };
    return e;
  })(),
  dj = (function () {
    function e(filterEditor, parent) {
      this.filterEditor = filterEditor;
      this.parent = parent;
    }
    e.fromParsedQueryFilter = function (e, t, n) {
      var i = e instanceof sq;
      if (!i && !n) {
        var r = new lq([e]);
        return new fj(r, t, n);
      }
      if (i) return new fj(e, t, n);
      if (e instanceof aq) return new mj(e, t, n);
      if (!e) return new mj(null, t, n);
      throw new Error("Invalid input filter");
    };
    return e;
  })(),
  fj = (function (e) {
    function t(n, i, r) {
      var o = e.call(this, i, r) || this;
      o.children = [];
      o.conjunction = "and";
      o.conjunction = n.conjunction;
      o.children =
        n.filters && n.filters.length > 0
          ? n.filters.map(function (e) {
              return dj.fromParsedQueryFilter(e, o.filterEditor, o);
            })
          : [new mj(null, o.filterEditor, o)];
      o.containerEl = createDiv("filter-group");
      o.containerEl.createDiv("filter-group-header", function (e) {
        var t = e.createEl("select", {
          cls: "conjunction dropdown",
        });
        t.createEl(
          "option",
          {
            text: cj.labelAllTheFollowing(),
            attr: {
              value: "and",
            },
          },
          function (e) {
            if (o.conjunction === "and") {
              e.selected = true;
            }
          },
        );
        t.createEl(
          "option",
          {
            text: cj.labelAnyOfTheFollowing(),
            attr: {
              value: "or",
            },
          },
          function (e) {
            if (o.conjunction === "or") {
              e.selected = true;
            }
          },
        );
        t.createEl(
          "option",
          {
            text: cj.labelNoneOfTheFollowing(),
            attr: {
              value: "not",
            },
          },
          function (e) {
            if (o.conjunction === "not") {
              e.selected = true;
            }
          },
        );
        t.addEventListener("change", function () {
          switch (t.value) {
            case "and":
              o.conjunction = "and";
              break;
            case "or":
              o.conjunction = "or";
              break;
            case "not":
              o.conjunction = "not";
              break;
            default:
              throw new Error("Invalid conjunction");
          }
          o.renderChildren();
          o.children.last().serialize() && o.filterEditor.save();
        });
        e.createDiv("filter-group-header-actions", function (e) {
          if (o.parent) {
            var t = e.createEl("button", {
              cls: "clickable-icon",
            });
            setIcon(t, "lucide-trash-2");
            t.addEventListener("click", function () {
              o.parent ? o.parent.removeChild(o) : o.filterEditor.emptyTopLevelFilter();
            });
          }
        });
      });
      o.listEl = o.containerEl.createDiv("filter-group-statements");
      o.renderChildren();
      o.containerEl.createDiv("filter-group-actions", function (e) {
        e.createDiv(
          {
            cls: "text-icon-button",
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
              text: cj.buttonAddFilter(),
            });
            e.addEventListener("click", function () {
              var e = new mj(null, o.filterEditor, o);
              o.children.push(e);
              o.renderChildren();
              e.focusLHS();
            });
          },
        );
        e.createDiv(
          {
            cls: "text-icon-button",
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
              text: cj.buttonAddFilterGroup(),
            });
            e.addEventListener("click", function () {
              var e = new lq([]);
              o.children.push(new t(e, o.filterEditor, o));
              o.renderChildren();
            });
          },
        );
      });
      return o;
    }
    __extends(t, e);
    t.prototype.renderChildren = function () {
      var e = this.children,
        n = this.listEl;
      n.empty();
      for (var i = 0; i < e.length; i++) {
        var r = n.createDiv("filter-row"),
          texto0 = this.conjunction === "and" ? cj.labelAnd() : cj.labelOr();
        i === 0 && (texto0 = cj.labelWhere());
        r.createEl("span", {
          cls: "conjunction",
          text: texto0,
        });
        var a = e[i];
        a instanceof t && r.addClass("mod-group");
        r.appendChild(a.containerEl);
      }
    };
    t.prototype.removeChild = function (e) {
      if ((this.children.remove(e), this.children.length > 0)) {
        this.renderChildren();
        return void this.filterEditor.save();
      }
      this.parent ? this.parent.removeChild(this) : this.filterEditor.emptyTopLevelFilter();
    };
    t.prototype.replaceChild = function (e, t) {
      var n = this.children.indexOf(e);
      this.children[n] = t;
      this.filterEditor.save();
    };
    t.prototype.serialize = function () {
      var e = this.children
        .map(function (e) {
          return e.serialize();
        })
        .filter(function (e) {
          return !!e;
        });
      if (e.length === 0) return null;
      switch (this.conjunction) {
        case "and":
          return {
            and: e,
          };
        case "or":
          return {
            or: e,
          };
        case "not":
          return {
            not: e,
          };
        default:
          throw new Error("Invalid conjunction");
      }
    };
    return t;
  })(dj);
var mj = (function (e) {
  function t(t, n, i) {
    var r = e.call(this, n, i) || this;
    r.rightInputValue = null;
    r.advancedInputMode = false;
    r.parsedQuery = t == null ? undefined : t.rule;
    var o = n.app,
      a = n.queryController,
      s = (r.containerEl = createDiv("filter-statement")),
      l = s.createDiv("filter-expression metadata-property"),
      c = (r.leftInputContainerEl = l.createDiv("filter-lhs-container")),
      u = 0,
      h = function () {
        u === 0 && l.addClass("has-focus");
        u++;
      },
      p = function () {
        if ((u = Math.max(0, u - 1)) === 0) {
          l.removeClass("has-focus");
        }
      },
      d = (r.leftInputEl = new CU(a, c)
        .setPlaceholder(cj.labelPropertyKey())
        .filterProperties(function (e) {
          return e !== "note.tags" && e !== "file.backlinks";
        })
        .onOpen(h)
        .onClose(p)
        .onSelect(function () {
          var e = r.updateOperators();
          (function (e, t) {
            for (var n = 0, i = e; n < i.length; n++) {
              var r = i[n];
              if (r.funcName && t.funcName === r.funcName && !!t.inverse == !!r.inverse) return r;
              if (t.value === r.value) return r;
            }
            return null;
          })(e, r.operatorComponent.value) || ((r.rightInputValue = null), r.operatorComponent.setValue(e[0]));
          r.renderRightInput();
          r.operatorComponent.focus();
          r.update();
        }));
    d.buttonEl.addClass("filter-property-select");
    r.leftInputWarningEl = c.createDiv({
      cls: "clickable-icon metadata-property-warning-icon",
    });
    r.leftInputWarningEl.hide();
    setTooltip(r.leftInputWarningEl, i18nProxy.properties.labelTypeMismatchWarningGeneric());
    setIcon(r.leftInputWarningEl, "lucide-alert-triangle");
    r.operatorComponent = new XT(o, l)
      .onOpen(h)
      .onClose(p)
      .onSelect(function () {
        r.renderRightInput();
        r.update();
        r.rightInputEl ? r.rightInputEl.focus() : clearFocusAndSelection();
      });
    r.operatorComponent.buttonEl.addClass("filter-operator");
    r.rightInputContainerEl = l.createDiv("filter-rhs-container metadata-property-value");
    r.advancedInputContainerEl = l.createDiv("formula-editor-container");
    r.advancedInputEditor = new EditorView({
      doc: "",
      parent: r.advancedInputContainerEl.createDiv("formula-editor"),
      extensions: __spreadArray(
        __spreadArray([], bU(), !0),
        [
          placeholder(i18nProxy.plugins.bases.placeholderFilterAdvancedMode()),
          a.getEditorLanguageSupport(),
          EditorView.domEventHandlers({
            blur: r.update.bind(r),
          }),
        ],
        !1,
      ),
    });
    r.advancedInputContainerEl.hide();
    var f = l.createDiv("filter-row-actions");
    r.errorMessageEl = s.createDiv("filter-row-error");
    r.errorMessageEl.hide();
    r.toggleAdvancedModeButton = f.createEl("button", {
      cls: "clickable-icon filer-expression-mode-toggle",
    });
    setTooltip(r.toggleAdvancedModeButton, cj.tooltipFilterAdvancedMode());
    r.toggleAdvancedModeButton.addEventListener("click", function () {
      if (r.advancedInputMode) {
        var e = r.serialize();
        if (!e) return void r.setFieldValuesFromInput(null);
        var t = new Dz(e);
        t.formula instanceof Nz
          ? (new Notice(cj.msgFilterCannotParse()), r.setErrorState(t.formula.getErrorMessage()))
          : (r.setFieldValuesFromInput(t), r.advancedInputMode && new Notice(cj.msgFilterSimpleUnavailable()));
      } else {
        var n = r.advancedInputEditor.state;
        r.advancedInputEditor.dispatch({
          changes: {
            from: 0,
            to: n.doc.length,
            insert: r.serialize(),
          },
        });
        r.advancedInputMode = true;
        r.leftInputWarningEl.hide();
        r.reconcileVisibleFields();
      }
    });
    var m = f.createEl("button", {
      cls: "clickable-icon",
    });
    setTooltip(m, cj.tooltipRemoveFilter());
    setIcon(m, "trash-2");
    m.addEventListener("click", function () {
      r.parent ? r.parent.removeChild(r) : r.filterEditor.emptyTopLevelFilter();
    });
    r.setFieldValuesFromInput(r.parsedQuery);
    return r;
  }
  __extends(t, e);
  t.prototype.setOperator = function (e, t) {
    e = e.toLowerCase();
    t = !!t;
    for (var n = this.operatorComponent.getItems(), i = 0, r = n; i < r.length; i++) {
      var o = r[i];
      if (o.funcName) {
        if (e === o.funcName && t === !!o.inverse) return void this.operatorComponent.setValue(o);
      } else if (e === o.value) return void this.operatorComponent.setValue(o);
    }
    this.operatorComponent.setValue(n[0]);
  };
  t.prototype.getSelectedFunction = function () {
    var e = this.operatorComponent.value;
    return e ? e.funcName || e.value : "";
  };
  t.prototype.updateOperators = function () {
    var e = this.filterEditor.app,
      t = this.getLHSValue(),
      n = this.getSelectedFunction(),
      i = [],
      r = QH.getAllForValue(t),
      o = r
        ? Object.values(r).filter(function (e) {
            return e instanceof XH;
          })
        : [];
    if (
      (t instanceof EH ||
        (o = o.filter(function (e) {
          return (
            !(!e.params || e.params.length === 0) &&
            e.params[0].type.some(function (e) {
              return t instanceof e;
            })
          );
        })),
      !(t instanceof HH))
    ) {
      var a = function (e, n) {
        return t instanceof TH && n.number
          ? n.number
          : t instanceof NH && n.date
            ? n.date
            : t instanceof AH && n.list
              ? n.list
              : e;
      };
      i.push({
        display: a("is", {
          number: "=",
          date: "on",
          list: "is exactly",
        }),
        value: "==",
      });
      i.push({
        display: a("is not", {
          number: "≠",
          date: "not on",
          list: "is not exactly",
        }),
        value: "!=",
      });
      (t instanceof TH || t instanceof NH || hj.contains(n)) &&
        (i.push({
          display: a("<", {
            number: "<",
            date: "before",
          }),
          value: "<",
        }),
        i.push({
          display: a("≤", {
            number: "≤",
            date: "on or before",
          }),
          value: "<=",
        }),
        i.push({
          display: a(">", {
            number: ">",
            date: "after",
          }),
          value: ">",
        }),
        i.push({
          display: a("≥", {
            number: "≥",
            date: "on or after",
          }),
          value: ">=",
        }));
    }
    for (
      var s = function (t, n) {
          for (var i = t.toLowerCase(), r = 0, o = Object.values(e.workspace.operatorFuncConfigs); r < o.length; r++)
            for (var a = 0, s = o[r]; a < s.length; a++) {
              var l = s[a];
              if (i === l.funcName.toLowerCase()) return n ? l.inverseDisplay : l.display;
            }
          return t;
        },
        l = 0,
        c = o;
      l < c.length;
      l++
    ) {
      var funcName = (d = c[l]).name.toLowerCase();
      i.push({
        display: s(d.name, !1),
        funcName: funcName,
        value: funcName,
        inverse: false,
      });
    }
    for (var h = 0, p = o; h < p.length; h++) {
      var d,
        funcNamef0 = (d = p[h]).name.toLowerCase();
      i.push({
        display: s(d.name, !0),
        funcName: funcNamef0,
        value: "!" + funcNamef0,
        inverse: true,
      });
    }
    this.operatorComponent.setItems(i);
    return i;
  };
  t.prototype.focusLHS = function () {
    this.advancedInputMode ? this.advancedInputEditor.focus() : this.leftInputEl.focus();
  };
  t.prototype.reconcileVisibleFields = function () {
    this.advancedInputMode
      ? (this.advancedInputContainerEl.show(),
        this.operatorComponent.buttonEl.hide(),
        this.leftInputContainerEl.hide(),
        this.rightInputContainerEl.hide(),
        this.advancedInputContainerEl.show(),
        setIcon(this.toggleAdvancedModeButton, "mouse-pointer-click"),
        setTooltip(this.toggleAdvancedModeButton, cj.tooltipFilterSimpleMode()))
      : (this.advancedInputContainerEl.hide(),
        this.leftInputContainerEl.show(),
        this.rightInputContainerEl.show(),
        this.operatorComponent.buttonEl.show(),
        setIcon(this.toggleAdvancedModeButton, "code-xml"));
  };
  t.prototype.getFunction = function (e) {
    if (e) {
      var t = QH.getAllForValue(this.getLHSValue());
      if (((e = KO(t, e)), Object.hasOwn(t, e))) {
        var n = t[e];
        if (n instanceof XH) return n;
      }
    }
    return null;
  };
  t.prototype.renderRightInput = function () {
    var e = this,
      t = this.filterEditor,
      n = t.app,
      i = t.queryController,
      r = this.rightInputValue,
      o = this.getSelectedFunction(),
      a = this.getLeftInputValue(),
      s = "text",
      l = true;
    if (uj.includes(o)) {
      var c = yU(a);
      s = i.getWidgetForIdent(c);
    } else {
      var u = this.getFunction(o);
      u && u.params.length > 1
        ? (s = (function (e) {
            if (e.customWidget) return e.customWidget;
            if (e.variadic) return "multitext";
            var t = wU(e.type[0]);
            t === "unknown" && (t = "text");
            return t;
          })(u.params[1]))
        : (l = false);
    }
    if (!l) {
      this.rightInputEl = this.rightInputValue = null;
      return void this.rightInputContainerEl.empty();
    }
    if (this.rightInputEl && this.rightInputValue != null && this.rightInputEl.type === s)
      this.rightInputEl.setValue(r);
    else {
      this.rightInputContainerEl.empty();
      var h = "";
      if (a !== "") {
        var p = Xz(a);
        h = p.type === "note" ? p.name : "";
      }
      var d = n.metadataTypeManager.getWidget(s);
      this.rightInputEl = d.render(this.rightInputContainerEl, r, {
        app: n,
        blur: function () {},
        key: h,
        hoverSource: "bases",
        onChange: function (rightInputValue) {
          e.rightInputValue = rightInputValue;
          e.update();
        },
        sourcePath: "",
      });
    }
  };
  t.prototype.getLeftInputValue = function () {
    var e;
    return ((e = this.leftInputEl.value) === null || undefined === e ? undefined : e.value) || "";
  };
  t.prototype.getLHSValue = function () {
    var e = yU(this.getLeftInputValue());
    return this.filterEditor.queryController.getMockValueForIdent(e);
  };
  t.prototype.setFieldValuesFromInput = function (e) {
    if (((this.advancedInputMode = false), !e)) {
      this.rightInputValue = null;
      this.operatorComponent.setValue(null);
      this.leftInputEl.setValueById("file.file");
      var t = this.updateOperators();
      this.operatorComponent.setValue(t[0]);
      this.renderRightInput();
      return void this.reconcileVisibleFields();
    }
    var n = e.formula,
      i = false;
    if (n instanceof zz) {
      i = true;
      n = n.expr;
    }
    var r = false;
    if (n instanceof Bz)
      try {
        this.leftInputEl.setValueById(gj(n.left));
        this.rightInputValue = vj([n.right]);
        this.updateOperators();
        this.setOperator(n.operator, i);
        this.renderRightInput();
        r = true;
      } catch (e) {}
    else if (n instanceof qz)
      try {
        this.leftInputEl.setValueById(gj(n.subject));
        this.rightInputValue = vj(n.args);
        this.updateOperators();
        this.setOperator(n.name, i);
        this.renderRightInput();
        r = true;
      } catch (e) {}
    else if (n instanceof Nz) {
      this.setErrorState(n.getErrorMessage());
    }
    if (!r) {
      this.advancedInputMode = true;
      var o = this.advancedInputEditor.state;
      this.advancedInputEditor.dispatch({
        changes: {
          from: 0,
          to: o.doc.length,
          insert: e.toString(),
        },
      });
    }
    this.reconcileVisibleFields();
  };
  t.prototype.setErrorState = function (e) {
    e
      ? (this.containerEl.addClass("mod-error"),
        setIcon(this.toggleAdvancedModeButton, "lucide-circle-alert"),
        this.errorMessageEl.setText(e),
        this.errorMessageEl.show())
      : (this.containerEl.removeClass("mod-error"),
        this.errorMessageEl.hide(),
        this.advancedInputMode && setIcon(this.toggleAdvancedModeButton, "mouse-pointer-click"));
  };
  t.prototype.update = function () {
    this.setErrorState("");
    var e = true;
    if (
      (this.advancedInputMode ||
        !this.rightInputEl ||
        (this.rightInputValue !== null && this.rightInputValue !== "") ||
        (e = false),
      e)
    ) {
      var t = (this.parsedQuery = new Dz(this.serialize()));
      if (t.formula instanceof Nz && this.advancedInputMode && this.advancedInputEditor.state.doc.length > 0) {
        this.setErrorState(t.formula.getErrorMessage());
      }
      try {
        this.filterEditor.save();
      } catch (e) {}
    }
  };
  t.prototype.serialize = function () {
    if (this.advancedInputMode) return this.advancedInputEditor.state.doc.toString();
    var e = this.getLeftInputValue();
    if (!e) return "";
    var t = this.operatorComponent.value,
      n = this.getFunction(t.funcName),
      i = yU(e);
    if (n) {
      var r = undefined;
      if (n.params.length > 1) {
        var o = this.rightInputValue;
        if (o == "" || o == null) return "";
        r = Array.isArray(o)
          ? n.serialize.apply(n, __spreadArray([i], o.map(this.quoteValueString), !1))
          : n.serialize(i, this.quoteValueString(o));
      } else r = n.serialize(i);
      return t.inverse ? "!" + r : r;
    }
    var a = t.value;
    return uj.includes(a) ? "".concat(i, " ").concat(a, " ").concat(this.quoteValueString(this.rightInputValue)) : "";
  };
  t.prototype.quoteValueString = function (e) {
    if (String.isString(e)) {
      if (e.startsWith("[[") && e.endsWith("]]")) {
        var t = e.indexOf("|");
        return -1 !== t
          ? 'link("'.concat(e.slice(2, t), '", "').concat(e.slice(t + 1, -2), '")')
          : 'link("'.concat(e.slice(2, -2), '")');
      }
      var n = e.split(".", 2);
      return n.length === 2 && ["note", "formula", "file", "this"].contains(n[1]) ? e : '"'.concat(e, '"');
    }
    return uc(e, !0) ? JSON.stringify(e) : String(e);
  };
  return t;
})(dj);
function gj(e) {
  if (e instanceof Uz) {
    if (e.object instanceof Yz && ["note", "formula", "file"].contains(e.object.id))
      return "".concat(e.object.id, ".").concat(e.index);
  } else if (e instanceof Wz) {
    if (e.array instanceof Yz) {
      var t = e.index;
      if (["file", "formula", "note"].contains(e.array.id) && t instanceof jz)
        return "".concat(e.array.id, ".").concat(t.value.toString());
    }
  } else if (e instanceof Yz) {
    if (["true", "false", "null", "this"].contains(e.id)) throw new Error("Unsupported left-hand side of formula");
    return bq(e.id);
  }
  throw new Error("Formula cannot be deserialized");
}
function vj(e) {
  if (e.length === 0) return "";
  if (e.length !== 1) {
    s = [];
    for (var t = 0, n = e; t < n.length; t++) {
      if ((r = n[t]) instanceof jz) s.push(r.value.toString());
      else {
        if (!(r instanceof qz && r.name === "link" && r.args.length === 1))
          throw new Error("Formula cannot be deserialized.");
        var i = r.args[0];
        if (i instanceof jz) {
          s.push("[[".concat(i.value.toString(), "]]"));
        }
      }
    }
    return s;
  }
  var r;
  if ((r = e[0]) instanceof qz && r.name === "link") {
    var o = r.args[0],
      a = r.args[1];
    if (o instanceof jz)
      return a && a instanceof jz ? "[[".concat(o.value, "|").concat(a.value, "]]") : "[[".concat(o.value, "]]");
  } else {
    if (r instanceof Kz) {
      for (var s = [], l = 0, c = r.elements; l < c.length; l++) {
        var u = c[l];
        if (!(u instanceof jz)) throw new Error("Formula cannot be deserialized");
        s.push(u.value.toString());
      }
      return s;
    }
    if (r instanceof jz) return r.value;
  }
  throw new Error("Formula cannot be deserialized");
}
var yj = (function () {
    function e(e, t) {
      var n = this,
        i = e.app,
        r = (this.toolbarItem = new EU(i, t, cj.labelFilter(), "lucide-list-filter"));
      r.addClass("mod-filters");
      this.toolbarFiltersFlairEl = r.buttonEl.createSpan({
        cls: "flair toolbar-badge",
      });
      this.toolbarFiltersFlairEl.hide();
      r.scrollEl.createDiv("query-toolbar-section", function (t) {
        var r = true,
          o = t.createDiv("query-toolbar-section-header", function (e) {
            e.createDiv(
              {
                cls: "tree-item-icon collapse-icon is-collapsed",
              },
              function (e) {
                return setIcon(e, "right-triangle");
              },
            );
            e.createSpan({
              text: cj.labelAllViews(),
            });
            n.globalFiltersFlairEl = e.createSpan({
              cls: "flair",
            });
          }),
          a = t.createDiv("query-toolbar-section-content");
        a.hide();
        n.globalFilterBuilder = new pj(i, a, e);
        o.addEventListener("click", function (e) {
          e.preventDefault();
          CO(o, (r = !r));
          toggleElementVisibility(a, r, !0);
        });
      });
      r.scrollEl.createDiv("query-toolbar-section", function (t) {
        var r = false,
          o = t.createDiv("query-toolbar-section-header", function (e) {
            e.createDiv(
              {
                cls: "tree-item-icon collapse-icon",
              },
              function (e) {
                return setIcon(e, "right-triangle");
              },
            );
            e.createSpan({
              text: cj.labelCurrentView(),
            });
            n.localFiltersFlairEl = e.createSpan({
              cls: "flair",
            });
          }),
          a = t.createDiv("query-toolbar-section-content");
        n.viewFilterBuilder = new pj(i, a, e);
        o.addEventListener("click", function (e) {
          e.preventDefault();
          CO(o, (r = !r));
          toggleElementVisibility(a, r, !0);
        });
      });
    }
    e.prototype.updateQuery = function (e, t) {
      this.globalFilterBuilder.updateQuery(
        function (t) {
          return e.setGlobalFilters(t);
        },
        t,
        e.filters,
      );
      this.viewFilterBuilder.updateQuery(
        function (n) {
          return e.setViewFilters(t.name, n);
        },
        t,
        t.filters,
      );
      var n = function (e) {
          return e ? (e instanceof sq ? e.filters.length : 1) : 0;
        },
        i = function (e, t) {
          e.setText(String(t));
          e.toggle(t > 0);
        },
        r = n(e.filters),
        o = n(t.filters);
      i(this.globalFiltersFlairEl, r);
      i(this.localFiltersFlairEl, o);
      i(this.toolbarFiltersFlairEl, o);
      var a = (e.filters && e.filters.hasError()) || ((t == null ? undefined : t.filters) && t.filters.hasError());
      this.toolbarItem.buttonEl.toggleClass("mod-error", a);
      this.toolbarItem.buttonEl.toggleClass("is-active", o > 0);
    };
    e.prototype.setEnabled = function (e) {
      this.toolbarItem.setEnabled(e);
    };
    return e;
  })(),
  bj = TV.define([
    {
      tag: tags.arithmeticOperator,
      class: "token operator",
    },
    {
      tag: tags.logicOperator,
      class: "token operator",
    },
    {
      tag: [tags.punctuation, tags.bracket, tags.squareBracket, tags.paren],
      class: "token punctuation",
    },
    {
      tag: tags.bool,
      class: "token boolean",
    },
    {
      tag: tags.number,
      class: "token number",
    },
    {
      tag: tags.string,
      class: "token string",
    },
    {
      tag: tags.propertyName,
      class: "token property",
    },
    {
      tag: tags.function(tags.propertyName),
      class: "token function",
    },
    {
      tag: tags.regexp,
      class: "token regex",
    },
  ]);
function wj(e, t, from, i, insert) {
  e.dispatch({
    changes: [
      {
        from: from,
        to: i,
        insert: insert,
      },
    ],
    selection: EditorSelection.single(from + insert.length),
    annotations: pickedCompletion.of(t),
  });
}
function kj(e) {
  return StateField.define({
    create: function () {
      return null;
    },
    update: function (t, n) {
      var i,
        r = n.docChanged,
        o = n.selection,
        a = n.state;
      if (!r && !o) return t;
      var s = Sj(a).parent;
      if (!s || s.name !== "Call") return null;
      var l = (i = a.selection.ranges.at(0)) === null || undefined === i ? undefined : i.head;
      if (l > s.lastChild.from) return null;
      for (var c, func, h, p = s.firstChild, d = [], f = p.nextSibling.nextSibling; f && f.name !== ")"; ) {
        f.name !== "," && d.push(f);
        f = f.nextSibling;
      }
      if (p.name === "ObjectAccess") {
        var m = p.firstChild,
          g = m.nextSibling.nextSibling,
          v = Ej(a, g).toLowerCase(),
          y = Mj(e, Ej(a, m)),
          b = QH.getAllForValue(y);
        func = Object.values(b).find(function (e) {
          return e.name.toLowerCase() === v;
        });
        h = func == null ? undefined : func.params.slice(1);
        c = g.from;
      } else if (p.name === "Identifier") {
        var w = Ej(a, p);
        func = QH.getAllGlobal().find(function (e) {
          return e.name === w;
        });
        h = func == null ? undefined : func.params;
        c = p.from;
      }
      if (!func) return null;
      var activeParamIdx = -1;
      if (h.length > 0)
        for (var C = 0; C < d.length; C++) {
          var E = d[C];
          if (!(E.to < l)) {
            if (E.from > l) {
              if (C > 0) {
                activeParamIdx = C;
              }
              break;
            }
            if (h.length <= C) {
              if (h[h.length - 1].variadic) {
                activeParamIdx = h.length - 1;
              }
              break;
            }
            activeParamIdx = C;
            break;
          }
        }
      return t && t.pos === c && t.func === func && t.activeParamIdx === activeParamIdx
        ? t
        : {
            func: func,
            activeParamIdx: activeParamIdx,
            pos: c,
            above: true,
            strictSide: true,
            arrow: true,
            create: function () {
              var e = createDiv("cm-tooltip-docstring");
              e.createSpan({
                text: "".concat(func.name, "("),
              });
              for (
                var t = function (t) {
                    var n = h[t];
                    t > 0 &&
                      e.createSpan({
                        text: ", ",
                      });
                    e.createSpan(t === activeParamIdx ? "active" : "", function (e) {
                      e.setText(
                        ""
                          .concat(n.name, ": ")
                          .concat(n.type.join(" | "))
                          .concat(n.optional ? "?" : "")
                          .concat(n.variadic ? "..." : ""),
                      );
                    });
                  },
                  n = 0;
                n < h.length;
                n++
              )
                t(n);
              e.createSpan({
                text: ")",
              });
              return {
                dom: e,
              };
            },
          };
    },
    provide: function (e) {
      return showTooltip.compute([e], function (t) {
        return t.field(e);
      });
    },
  });
}
var Cj = (function (e) {
  function t(ctx) {
    var i,
      r,
      o,
      a,
      s =
        e.call(this, Az, [
          autocompletion({
            icons: false,
            tooltipClass: function () {
              return "suggestion-container";
            },
            optionClass: function () {
              return "suggestion-item mod-complex";
            },
            addToOptions: [
              {
                render: t.renderIcon,
                position: 20,
              },
              {
                render: t.renderDetail,
                position: 80,
              },
            ],
          }),
          ((i = bj),
          (a = [IV]),
          i instanceof TV && (i.module && a.push(EditorView.styleModule.of(i.module)), (o = i.themeType)),
          (r == null ? undefined : r.fallback)
            ? a.push(AV.of(i))
            : o
              ? a.push(
                  DV.computeN([EditorView.darkTheme], function (e) {
                    return e.facet(EditorView.darkTheme) == (o == "dark") ? [i] : [];
                  }),
                )
              : a.push(DV.of(i)),
          a),
          Az.data.of({
            autocomplete: function (e) {
              return s.autocomplete(e);
            },
          }),
          kj(ctx),
        ]) || this;
    s.ctx = ctx;
    return s;
  }
  __extends(t, e);
  t.prototype.autocomplete = function (e) {
    if (Platform.isPhone) return null;
    var t = Sj(e.state),
      n = t.parent;
    if (n) {
      if (n.name === "ObjectAccess") {
        for (
          var from = t.name === "Identifier" ? t.from : e.pos,
            r = n.firstChild,
            o = Mj(this.ctx, Ej(e.state, r)),
            options = [],
            s = function (label) {
              var type = "lucide-file-question";
              try {
                type = o.objectAccess(label).icon;
              } catch (e) {}
              options.push({
                label: label,
                type: type,
                apply: function (t, n, i, r) {
                  Iz(label) ? wj(t, n, i - 1, r, "[".concat(JSON.stringify(label), "]")) : wj(t, n, i, r, label);
                },
              });
            },
            l = 0,
            c = o.keys();
          l < c.length;
          l++
        ) {
          s(c[l]);
        }
        for (var u = 0, h = Object.values(QH.getAllForValue(o)); u < h.length; u++) {
          var p = h[u];
          options.push(this.funcCompletion(p, !0));
        }
        return {
          from: from,
          options: options,
        };
      }
      if (n.name === "ArrayAccess") {
        for (
          var d = (r = n.firstChild).nextSibling.nextSibling,
            f =
              ((o = Mj(this.ctx, Ej(e.state, r))),
              (options = []),
              function (e) {
                var type = "lucide-file-question";
                try {
                  type = o.objectAccess(e).icon;
                } catch (e) {}
                options.push({
                  label: '"'.concat(e, '"'),
                  type: type,
                  boost: 99,
                  apply: function (t, n, i, r) {
                    wj(t, n, i, r, JSON.stringify(e));
                  },
                });
              }),
            m = 0,
            g = o.keys();
          m < g.length;
          m++
        ) {
          f(g[m]);
        }
        return {
          from: d.from,
          options: options.concat(this.expressionCompletions()),
        };
      }
      if (n.name === "Call")
        return t.name === "String"
          ? {
              from: e.pos,
              options: [],
            }
          : {
              from: (from = t.name === "Identifier" ? t.from : e.pos),
              options: this.expressionCompletions(),
            };
      var v = (function (e) {
        var t = [],
          n = e == null ? undefined : e.firstChild;
        for (; n; ) {
          t.push(n);
          n = n.nextSibling;
        }
        return t;
      })(n);
      if (v.length === 3 && n.name === "LogicalExpression" && v[1].from === v[1].to)
        return {
          from: v[0].from,
          options: this.expressionCompletions(),
        };
      if (
        v.length === 3 &&
        v[2].from <= e.pos &&
        [
          "LogicalExpression",
          "EqualityExpression",
          "RelationalExpression",
          "AdditiveExpression",
          "MultiplicativeExpression",
        ].includes(n.name)
      )
        return {
          from: v[2].from,
          options: this.expressionCompletions(),
        };
    }
    return t.name === "Identifier" || e.state.doc.length === 0
      ? {
          from: t.from,
          options: this.expressionCompletions(),
        }
      : null;
  };
  t.prototype.getEncodedIdentifier = function (e) {
    return e;
  };
  t.prototype.expressionCompletions = function () {
    for (
      var e = this,
        t = this.ctx.keys().map(function (label) {
          var n = e.ctx.getByIdentifier(label);
          return {
            label: label,
            type: n.icon,
            apply: function (n, i, r, o) {
              var a = label;
              Iz(label) && (a = e.getEncodedIdentifier(label));
              wj(n, i, r, o, a);
            },
          };
        }),
        n = 0,
        i = QH.getAllGlobal();
      n < i.length;
      n++
    ) {
      var r = i[n];
      t.push(this.funcCompletion(r, !1));
    }
    return t;
  };
  t.prototype.funcCompletion = function (e, t) {
    var n = e.params
        .slice(1)
        .map(function (e) {
          return ""
            .concat(e.name, ": ")
            .concat(e.type)
            .concat(e.optional ? "?" : "");
        })
        .join(", "),
      info = "".concat(e.name, "(").concat(n, ")");
    e.docString && (info += "\n" + (String.isString(e.docString) ? e.docString : e.docString()));
    return {
      label: e.name + "()",
      type: "square-function",
      info: info,
      apply: function (n, i, from, o) {
        var a = e.params.length > (t ? 1 : 0);
        n.dispatch({
          changes: [
            {
              from: from,
              to: o,
              insert: e.name + "()",
            },
          ],
          selection: EditorSelection.single(from + e.name.length + (a ? 1 : 2)),
          annotations: pickedCompletion.of(i),
        });
      },
    };
  };
  t.renderIcon = function (e, t, n) {
    if (e.type) {
      var i = createDiv("cm-custom-completionIcon suggestion-icon");
      setIcon(i.createSpan("suggestion-flair"), e.type);
      return i;
    }
    return null;
  };
  t.renderDetail = function (e, t, n) {
    return e.detail
      ? createDiv("cm-custom-completionDescription suggestion-aux", function (t) {
          t.createDiv({
            cls: "suggestion-flair u-small",
            text: e.detail,
          });
        })
      : null;
  };
  return t;
})(aV);
function Ej(e, t) {
  return e.sliceDoc(t.from, t.to);
}
function Sj(e) {
  for (
    var t, n = ((t = e.selection.ranges.at(0)) === null || undefined === t ? undefined : t.head) || 0, i = n;
    i > 0;
    i--
  ) {
    if (e.sliceDoc(i - 1, i) !== " ") return XB(e).resolveInner(i, -1);
  }
  return XB(e).resolveInner(n, -1);
}
function Mj(e, t) {
  var n = new Dz(t);
  if (!(n.formula instanceof Nz))
    try {
      return n.formula.getValue(e);
    } catch (e) {}
  return EH.value;
}
var xj = (function (e) {
  function t() {
    return (e !== null && e.apply(this, arguments)) || this;
  }
  __extends(t, e);
  t.prototype.getEncodedIdentifier = function (e) {
    return "note[".concat(JSON.stringify(e), "]");
  };
  t.prototype.expressionCompletions = function () {
    for (
      var t = e.prototype.expressionCompletions.call(this),
        n = Mj(this.ctx, "formula"),
        i = function (label) {
          var type = "lucide-file-question";
          try {
            type = n.objectAccess(label).icon;
          } catch (e) {}
          t.push({
            label: label,
            type: type,
            apply: function (t, n, i, r) {
              Iz(label)
                ? wj(t, n, i, r, "formula[".concat(JSON.stringify(label), "]"))
                : wj(t, n, i, r, "formula.".concat(label));
            },
          });
        },
        r = 0,
        o = n.keys();
      r < o.length;
      r++
    ) {
      i(o[r]);
    }
    return t;
  };
  return t;
})(Cj);
function Tj(e, t, n) {
  var i = this;
  return createEl("button", "clickable-icon", function (r) {
    r.ariaDisabled = "true";
    setTooltip(r, n === "backward" ? i18nProxy.commands.navigateBack() : i18nProxy.commands.navigateForward());
    r.onClickEvent(function (r) {
      return __awaiter(i, undefined, undefined, function () {
        var i, o;
        return __generator(this, function (a) {
          switch (a.label) {
            case 0:
              return r.button === 2
                ? [2]
                : ((i = Keymap.isModEvent(r)), (o = t()), i ? [4, e.workspace.duplicateLeaf(t(), i)] : [3, 2]);
            case 1:
              o = a.sent();
              a.label = 2;
            case 2:
              return [4, o.history.go(n === "backward" ? -1 : 1)];
            case 3:
              a.sent();
              return [2];
          }
        });
      });
    });
    var o = function (o) {
      for (
        var a = n === "backward" ? t().history.backHistory : t().history.forwardHistory,
          s = new Menu(),
          l = function (r) {
            s.addItem(function (o) {
              return o
                .setTitle(hc(a[r].title, 50))
                .setIcon(a[r].icon)
                .onClick(function (o) {
                  return __awaiter(i, undefined, undefined, function () {
                    var i, s, l;
                    return __generator(this, function (c) {
                      switch (c.label) {
                        case 0:
                          i = Keymap.isModEvent(o);
                          s = t();
                          return i ? [4, e.workspace.duplicateLeaf(t(), i)] : [3, 2];
                        case 1:
                          s = c.sent();
                          c.label = 2;
                        case 2:
                          l = a.length - r;
                          n === "backward" && (l = 0 - l);
                          return [4, s.history.go(l)];
                        case 3:
                          c.sent();
                          return [2];
                      }
                    });
                  });
                });
            });
          },
          c = a.length - 1;
        c >= 0;
        c--
      )
        l(c);
      hideTooltip();
      var u = r.getBoundingClientRect();
      s.showAtPosition({
        x: u.x,
        y: u.bottom,
        width: u.width,
        overlap: true,
      });
      o &&
        s.dom.addEventListener("mouseup", function (e) {
          var t = e.targetNode;
          setTimeout(function () {
            for (var n = 0, i = s.items; n < i.length; n++) {
              var r = i[n];
              if (r instanceof MenuItem && r.dom.contains(t)) return void r.handleEvent(e);
            }
          });
        });
    };
    r.addEventListener("contextmenu", function () {
      return o(!1);
    });
    (function (e, t) {
      e.addEventListener("mousedown", function (e) {
        var n = window.setTimeout(function () {
            i();
            t(e);
          }, 400),
          i = function () {
            window.removeEventListener("mouseup", r);
            window.removeEventListener("mousemove", o);
            window.clearTimeout(n);
          },
          r = function () {
            i();
          },
          o = function (n) {
            var r = n.clientX - e.clientX,
              o = n.clientY - e.clientY;
            if (r * r + o * o > 25) {
              i();
              o > 0 && o > Math.abs(r) && t(e);
            }
          };
        window.addEventListener("mouseup", r);
        window.addEventListener("mousemove", o);
      });
    })(r, function () {
      return o(!0);
    });
  });
}