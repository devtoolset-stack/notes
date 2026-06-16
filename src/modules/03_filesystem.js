const platform = window.process?.platform || "";
const darwinPlatform = platform === "darwin";
const win32Platform = platform === "win32";
const recursive = darwinPlatform || win32Platform;
class FileSystemAdapter {
  constructor(basePath) {
    this.thingsHappening = debounce(this.kill.bind(this), 60000, true);
    this.basePath = basePath;
    this.fs = window.require("original-fs");
    this.fsPromises = this.fs.promises;
    this.path = window.require("path");
    this.url = window.require("url");

    const electron = window.require("electron");
    this.ipcRenderer = electron.ipcRenderer;

    this.files = {};
    this.promise = Promise.resolve();
    this.watcher = null;
    this.watchers = {};
    this.handler = null;

    try {
      this.btime = window.require("btime");
    } catch (error) {}

    this.insensitive = darwinPlatform || win32Platform;

    try {
      this.testInsensitive();
    } catch (error) {
      console.error(error);
    }
  }

  async testInsensitive() {
    const { fs, path, basePath } = this;
    const testFile = path.join(basePath, ".OBSIDIANTEST");
    const testFileLower = path.join(basePath, ".OBSIDIANTEST".toLowerCase());
    fs.existsSync(testFile) || fs.writeFileSync(testFile, "", "utf8");
    this.insensitive = fs.existsSync(testFileLower);
    fs.unlinkSync(testFile);
  }

  getName() {
    return this.path.basename(this.basePath);
  }

  getBasePath() {
    return this.basePath;
  }

  async listAll() {
    this.files["/"] = { type: "folder", realpath: "/" };
    await this.listRecursive("");
  }

  async listRecursive(dirPath) {
    const fullPath = this.getFullRealPath(dirPath);
    const entries = await this.fsPromises.readdir(fullPath);
    this.thingsHappening();

    const promises = entries.map((entry) => this.listRecursiveChild(dirPath, entry));
    await Promise.all(promises);
  }

  async listRecursiveChild(parentPath, entryName) {
    const normalizedPath = iu(parentPath === "" ? entryName : `${parentPath}/${entryName}`);
    const cleanPath = normalizePath(normalizedPath);
    this.trigger("raw", cleanPath);

    if (Xc(cleanPath)) {
      await this.reconcileDeletion(normalizedPath, cleanPath);
      return;
    }

    try {
      await this.reconcileFileInternal(normalizedPath, cleanPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.reconcileDeletion(normalizedPath, cleanPath, true);
      } else {
        throw error;
      }
    }
  }

  mkdir(dirPath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(dirPath);
      await this.fsPromises.mkdir(fullPath, { recursive: true });
      await this.reconcileInternalFile(dirPath);
    });
  }

  trashSystem(filePath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      if (!this.ipcRenderer.sendSync("trash", fullPath)) {
        return false;
      }
      await this.reconcileInternalFile(filePath);
      return true;
    });
  }

  trashLocal(filePath) {
    return this.queue(async () => {
      const sourcePath = this.getFullPath(filePath);
      const trashPath = this.getFullPath(".trash");

      await this.fsPromises.mkdir(trashPath, { recursive: true });

      const ext = this.path.extname(sourcePath);
      const baseName = this.path.basename(sourcePath, ext);
      let destPath = this.path.join(trashPath, baseName + ext);
      let counter = 1;

      while (await this._exists(destPath)) {
        destPath = this.path.join(trashPath, `${baseName} ${counter}${ext}`);
        counter++;
      }

      await this.fsPromises.rename(sourcePath, destPath);
      await this.reconcileInternalFile(filePath);
    });
  }

  rmdir(dirPath, recursive = false) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(dirPath);

      if (recursive) {
        await this.fsPromises.rm(fullPath, {
          maxRetries: 5,
          recursive,
        });
      } else {
        await this.fsPromises.rmdir(fullPath, { maxRetries: 5 });
      }

      await this.reconcileInternalFile(dirPath);
    });
  }

  read(filePath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      try {
        return await this.fsPromises.readFile(fullPath, "utf8");
      } catch (error) {
        this.queue(() => this.reconcileInternalFile(filePath));
        throw error;
      }
    });
  }

  readBinary(filePath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      try {
        const buffer = await this.fsPromises.readFile(fullPath);
        return lu(buffer);
      } catch (error) {
        this.queue(() => this.reconcileInternalFile(filePath));
        throw error;
      }
    });
  }

  write(filePath, content, options = null) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      try {
        await this.fsPromises.writeFile(fullPath, content, "utf8");
        await this.applyWriteOptions(fullPath, options);
      } finally {
        await this.reconcileInternalFile(filePath);
      }
    });
  }

  writeBinary(filePath, content, options = null) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      const buffer = cu(content);
      try {
        await this.fsPromises.writeFile(fullPath, buffer);
        await this.applyWriteOptions(fullPath, options);
      } finally {
        await this.reconcileInternalFile(filePath);
      }
    });
  }

  append(filePath, content, options = null) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      try {
        await this.fsPromises.appendFile(fullPath, content, "utf8");
        await this.applyWriteOptions(fullPath, options);
      } finally {
        await this.reconcileInternalFile(filePath);
      }
    });
  }

  process(filePath, processor, options) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      const originalContent = await this.fsPromises.readFile(fullPath, "utf8");
      const newContent = processor(originalContent);

      if (newContent === originalContent) {
        return originalContent;
      }

      try {
        await this.fsPromises.writeFile(fullPath, newContent, "utf8");
        await this.applyWriteOptions(fullPath, options);
      } finally {
        await this.reconcileInternalFile(filePath);
      }

      return newContent;
    });
  }

  async applyWriteOptions(filePath, options) {
    if (!options) return;

    const { ctime, mtime, immediate } = options;

    if (ctime && this.btime) {
      this.btime.btime(filePath, ctime);
    }

    if (mtime) {
      const mtimeSec = mtime / 1000;
      await this.fsPromises.utimes(filePath, mtimeSec, mtimeSec);
    }

    if (immediate) {
      immediate();
    }
  }

  getResourcePath(filePath) {
    const fullPath = this.getFullPath(filePath);
    let timestamp = 0;
    const fileInfo = this.files[filePath];

    if (fileInfo?.type === "file") {
      timestamp = fileInfo.mtime;
    }
    if (!timestamp) {
      timestamp = Date.now();
    }

    let resourceUrl = this.url.pathToFileURL(fullPath).href;
    if (resourceUrl.startsWith("file:///")) {
      resourceUrl = resourceUrl.substring(8);
    } else if (resourceUrl.startsWith("file://")) {
      resourceUrl = "%5C%5C" + resourceUrl.substring(7);
    }

    return `${Platform.resourcePathPrefix}${resourceUrl}?${timestamp}`;
  }

  getFilePath(filePath) {
    const fullPath = this.getFullPath(filePath);
    return window.require("url").pathToFileURL(fullPath).toString();
  }

  remove(filePath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      await this.fsPromises.unlink(fullPath);
      await this.reconcileInternalFile(filePath);
    });
  }

  update(filePath) {
    return this.queue(async () => {
      await this.reconcileInternalFile(filePath);
    });
  }

  async rename(oldPath, newPath) {
    if (oldPath === newPath) return;

    await this.queue(async () => {
      const oldFullPath = this.getFullPath(oldPath);
      const newFullPath = this.getFullPath(newPath);

      if (await this._exists(newFullPath, false)) {
        if (!this.insensitive || oldPath.toLowerCase() !== newPath.toLowerCase()) {
          throw new Error("Destination file already exists!");
        }
      }

      const oldFile = this.files[oldPath];
      const oldRealPath = oldFile ? oldFile.realpath : null;

      await this.fsPromises.rename(oldFullPath, newFullPath);

      if (oldFile) {
        delete this.files[oldPath];
        const newRealPath = this.getRealPath(newPath);
        oldFile.realpath = newRealPath;
        this.files[newPath] = oldFile;
        this.trigger("renamed", newPath, oldPath);

        if (oldFile.type === "folder" && this.watchers.hasOwnProperty(oldPath)) {
          this.stopWatchPath(oldPath);
          await this.startWatchPath(newPath);
        }
      }

      // 更新子路径引用
      if (oldFile?.type === "folder") {
        for (const key in this.files) {
          if (this.files.hasOwnProperty(key) && key.startsWith(`${oldPath}/`)) {
            const relativePath = key.slice(oldPath.length);
            const newKey = newPath + relativePath;
            const fileEntry = this.files[key];

            delete this.files[key];
            const relativeRealPath = fileEntry.realpath.slice(oldRealPath.length);
            fileEntry.realpath = newRealPath + relativeRealPath;
            this.files[newKey] = fileEntry;
            this.trigger("renamed", newKey, key);
          }
        }
      }
    });
  }

  async copyRecursive(source, dest) {
    const stats = await this.fsPromises.stat(source);

    if (stats.isFile()) {
      await this.fsPromises.copyFile(source, dest, this.fs.constants.COPYFILE_EXCL);
    } else if (stats.isDirectory()) {
      await this.fsPromises.mkdir(dest, { recursive: true });
      const entries = await this.fsPromises.readdir(source);

      for (const entry of entries) {
        const srcPath = this.path.join(source, entry);
        const dstPath = this.path.join(dest, entry);
        await this.copyRecursive(srcPath, dstPath);
      }
    }
  }

  copy(srcPath, destPath) {
    return this.queue(async () => {
      const srcFullPath = this.getFullPath(srcPath);
      const destFullPath = this.getFullPath(destPath);

      await this.copyRecursive(srcFullPath, destFullPath);
      await this.reconcileInternalFile(destPath);
    });
  }

  exists(filePath, checkCaseSensitive) {
    return this.queue(() => {
      const fullPath = this.getFullPath(filePath);
      return this._exists(fullPath, checkCaseSensitive);
    });
  }

  async _exists(fullPath, checkCaseSensitive = false) {
    try {
      await this.fsPromises.access(fullPath);
    } catch {
      return false;
    }

    if (checkCaseSensitive && this.insensitive) {
      const dir = this.path.dirname(fullPath);
      const base = this.path.basename(fullPath);
      const entries = await this.fsPromises.readdir(dir);
      if (!entries.includes(base)) {
        return false;
      }
    }

    return true;
  }

  async stat(filePath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(filePath);
      try {
        const stats = await this.fsPromises.stat(fullPath);
        if (stats.isFile()) {
          return { type: "file", ...uu(stats) };
        } else if (stats.isDirectory()) {
          return { type: "folder", ...uu(stats) };
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      return null;
    });
  }

  list(dirPath) {
    return this.queue(async () => {
      const fullPath = this.getFullPath(dirPath);
      const entries = await this.fsPromises.readdir(fullPath);
      const result = { folders: [], files: [] };

      for (const entry of entries) {
        const normalizedPath = iu(dirPath === "" ? entry : `${dirPath}/${entry}`);
        const cleanPath = normalizePath(normalizedPath);
        const stats = await this.fsPromises.stat(this.getFullRealPath(normalizedPath));

        if (stats.isFile()) {
          result.files.push(cleanPath);
        } else if (stats.isDirectory()) {
          result.folders.push(cleanPath);
        }
      }

      return result;
    });
  }

  async watch(handler) {
    this.stopWatch();
    this.handler = handler;
    await this.startWatchPath("/");
    return this.queue(() => this.listAll());
  }

  async watchHiddenRecursive(dirPath) {
    // 如果已启用递归监听则跳过
    if (typeof recursive !== "undefined" && recursive) return;

    try {
      const realPath = this.getFullRealPath(dirPath);
      const entries = await this.fsPromises.readdir(realPath);
      await this.startWatchPath(dirPath);

      for (const entry of entries) {
        try {
          const normalizedPath = iu(dirPath === "" ? entry : `${dirPath}/${entry}`);
          const entryRealPath = this.getFullRealPath(normalizedPath);
          const stats = await this.fsPromises.lstat(entryRealPath);

          if (stats.isDirectory()) {
            await this.watchHiddenRecursive(normalizedPath);
          }
        } catch {
          // 忽略单个条目错误
        }
      }
    } catch {
      // 忽略目录级错误
    }
  }

  stopWatch() {
    for (const key in this.watchers) {
      if (this.watchers.hasOwnProperty(key)) {
        this.stopWatchPath(key);
      }
    }
    this.handler = null;
  }

  async startWatchPath(dirPath) {
    if (this.watchers[dirPath]) return;

    const logicalPath = this.getRealPath(dirPath);
    const fullPath = this.getFullPath(dirPath);
    let resolvedPath = fullPath;

    try {
      resolvedPath = await this.fsPromises.realpath(fullPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(error);
      }
    }

    const watcher = this.fs.watch(fullPath, {
      persistent: false,
      encoding: "utf8",
      recursive: typeof recursive !== "undefined" ? recursive : false,
    });

    watcher.on("change", (eventType, filename) => {
      const changedPath = logicalPath === "/" ? filename : `${logicalPath}/${filename}`;
      this.onFileChange(changedPath);
    });

    watcher.on("error", () => {
      this.onFileChange(logicalPath);
    });

    this.watchers[dirPath] = { watcher, resolvedPath };
  }

  stopWatchPath(dirPath) {
    const watcherInfo = this.watchers[dirPath];
    if (watcherInfo) {
      watcherInfo.watcher.close();
      delete this.watchers[dirPath];
    }
  }

  onFileChange(changedPath) {
    if (!changedPath) return;

    changedPath = iu(changedPath);
    setTimeout(() => {
      const normalizedPath = normalizePath(changedPath);
      this.queue(() => this.reconcileFile(changedPath, normalizedPath, false));
    }, 0);
  }

  async reconcileInternalFile(filePath) {
    return this.reconcileFile(this.getRealPath(filePath), filePath);
  }

  async reconcileFile(realPath, logicalPath, shouldDelete = true) {
    this.trigger("raw", logicalPath);

    if (Xc(logicalPath)) {
      await this.reconcileDeletion(realPath, logicalPath, shouldDelete);
      return;
    }

    const parentPath = Zc(logicalPath);
    if (parentPath && parentPath !== "/" && !this.files[logicalPath]) {
      await this.reconcileFile(Zc(realPath), parentPath, shouldDelete);
    }

    try {
      const fullPath = this.getFullRealPath(realPath);

      if (this.insensitive) {
        const dir = this.path.dirname(fullPath);
        const base = this.path.basename(logicalPath);
        const entries = await this.fsPromises.readdir(dir);
        const normalizedEntries = entries.map((e) => Kc(e).normalize("NFC"));

        if (!normalizedEntries.includes(base)) {
          await this.reconcileDeletion(realPath, logicalPath, shouldDelete);
          return;
        }
      }

      await this.reconcileFileInternal(realPath, logicalPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.reconcileDeletion(realPath, logicalPath, shouldDelete);
      } else {
        console.error(error);
      }
    }
  }

  async reconcileFileInternal(realPath, logicalPath) {
    const fullPath = this.getFullRealPath(realPath);
    const stats = await this.fsPromises.lstat(fullPath);

    if (stats.isFile()) {
      await this.reconcileFileCreation(realPath, logicalPath, stats);
    } else if (stats.isDirectory()) {
      await this.reconcileFolderCreation(realPath, logicalPath);
    } else if (stats.isSymbolicLink()) {
      await this.reconcileSymbolicLinkCreation(realPath, logicalPath);
    }
  }

  async reconcileFileCreation(realPath, logicalPath, stats) {
    const fileInfo = uu(stats);
    const existing = this.files[logicalPath];

    if (existing) {
      existing.realpath = realPath;
      if (existing.type === "file") {
        const isUnchanged = existing.mtime === Math.round(stats.mtimeMs) && existing.size === stats.size;

        if (!isUnchanged) {
          existing.mtime = Math.round(stats.mtimeMs);
          existing.size = stats.size;
          this.trigger("raw", logicalPath, logicalPath, fileInfo);
          this.trigger("modified", logicalPath, logicalPath, fileInfo);
        }
        return;
      }
      this.removeFile(logicalPath);
    }

    this.files[logicalPath] = {
      type: "file",
      realpath: realPath,
      ctime: Math.round(stats.birthtimeMs),
      mtime: Math.round(stats.mtimeMs),
      size: stats.size,
    };

    this.trigger("file-created", logicalPath, logicalPath, fileInfo);
  }

  async reconcileFolderCreation(realPath, logicalPath) {
    if (!this.files.hasOwnProperty(logicalPath)) {
      this.files[logicalPath] = { type: "folder", realpath: realPath };
      this.trigger("folder-created", logicalPath);

      if (typeof recursive === "undefined" || !recursive) {
        await this.startWatchPath(logicalPath);
      }
    }

    await this.listRecursive(realPath);
    this.files[logicalPath].realpath = realPath;
  }

  async reconcileSymbolicLinkCreation(realPath, logicalPath) {
    const fullPath = this.getFullRealPath(realPath);
    let resolvedPath;

    try {
      resolvedPath = await this.fsPromises.realpath(fullPath);
    } catch {
      return;
    }
    const sep = this.path.sep;
    const watchers = this.watchers;

    if (watchers.hasOwnProperty(logicalPath)) {
      watchers[logicalPath].resolvedPath = resolvedPath;
    } else {
      for (const key in watchers) {
        if (watchers.hasOwnProperty(key) && key !== logicalPath) {
          const watchedPath = watchers[key].resolvedPath;
          if (
            resolvedPath === watchedPath ||
            watchedPath.startsWith(resolvedPath + sep) ||
            resolvedPath.startsWith(watchedPath + sep)
          ) {
            return;
          }
        }
      }
    }

    const stats = await this.fsPromises.stat(fullPath);
    if (stats.isFile()) {
      await this.reconcileFileCreation(realPath, logicalPath, stats);
    } else if (stats.isDirectory()) {
      if (typeof recursive !== "undefined" && recursive) {
        await this.startWatchPath(logicalPath);
      }
      await this.reconcileFolderCreation(realPath, logicalPath);
    }
  }

  async reconcileDeletion(realPath, logicalPath, shouldDelete = true) {
    if (logicalPath === "/") {
      this.trigger("closed", logicalPath);
      return;
    }

    this.stopWatchPath(logicalPath);
    const fileEntry = this.files[logicalPath];

    if (!fileEntry) return;

    // 延迟重新检查，处理短暂的文件系统事件
    if (!shouldDelete) {
      setTimeout(() => {
        this.queue(() => this.reconcileFile(realPath, logicalPath));
      }, 100);
      return;
    }

    // 递归删除子项
    if (fileEntry.type === "folder") {
      for (const key in this.files) {
        if (this.files.hasOwnProperty(key) && key.startsWith(`${logicalPath}/`)) {
          this.removeFile(key);
        }
      }
    }

    this.removeFile(logicalPath);
  }

  trigger(eventType, ...args) {
    if (this.handler) {
      this.handler(eventType, ...args);
    }
  }

  getRealPath(logicalPath) {
    let current = logicalPath;
    while (current) {
      if (this.files.hasOwnProperty(current)) {
        const suffix = logicalPath.substr(current.length);
        return this.files[current].realpath + suffix;
      }
      current = Zc(current);
    }
    return logicalPath;
  }

  getFullPath(logicalPath) {
    const realPath = this.getRealPath(logicalPath);
    return this.getFullRealPath(realPath);
  }

  getFullRealPath(relativePath) {
    return this.path.join(this.basePath, relativePath);
  }

  kill() {
    if (this.killLastAction) {
      this.killLastAction(new Error("File system operation timed out."));
      this.killLastAction = null;
    }
  }

  queue(operation) {
    const timeoutPromise = new Promise((_, reject) => {
      this.killLastAction = reject;
    });

    this.thingsHappening();
    const promise = this.promise.then(
      () => Promise.race([timeoutPromise, operation()]),
      () => Promise.race([timeoutPromise, operation()]),
    );

    this.promise = promise;
    return promise;
  }

  removeFile(logicalPath) {
    const fileEntry = this.files[logicalPath];
    delete this.files[logicalPath];

    if (fileEntry) {
      if (fileEntry.type === "file") {
        this.trigger("file-removed", logicalPath);
      } else if (fileEntry.type === "folder") {
        this.trigger("folder-removed", logicalPath);
      }
    }
  }

  static async readLocalFile(filePath) {
    const requireFn = window.require;
    if (!requireFn) return null;

    const fs = requireFn("fs");
    const buffer = await fs.promises.readFile(filePath);
    return lu(buffer);
  }

  static async mkdir(dirPath) {
    const requireFn = window.require;
    if (!requireFn) return null;

    return requireFn("fs").promises.mkdir(dirPath, { recursive: true });
  }
}

var nf = {
  bold: {
    nodeType: "strong",
    surroundingChars: "**",
    altSurroundingChars: "__",
  },
  italic: {
    nodeType: "em",
    surroundingChars: "*",
    altSurroundingChars: "_",
  },
  code: {
    nodeType: "inline-code",
    surroundingChars: "`",
  },
  highlight: {
    nodeType: "highlight",
    surroundingChars: "==",
  },
  strikethrough: {
    nodeType: "strikethrough",
    surroundingChars: "~~",
  },
  comment: {
    nodeType: "comment",
    surroundingChars: "%%",
  },
  math: {
    nodeType: "math",
    surroundingChars: "$",
  },
};
function rf(e, t) {
  for (var from = t.from, i = t.to; from < i && /\s+/.test(e.sliceDoc(from, from + 1)); ) from++;
  for (; i > from && /\s+/.test(e.sliceDoc(i - 1, i)); ) i--;
  return {
    from: from,
    to: i,
  };
}
function of(e, t) {
  var n;
  e.moveTo(t, -1);
  (e.node.parent &&
    !((n = e.node.type.prop(lineClassNodeProp)) !== null && undefined !== n ? n : "").contains("table")) ||
    e.moveTo(t, 1);
}
function af(e, t) {
  for (
    var n = syntaxTree(e).cursor(IterMode.ExcludeBuffers),
      i = {
        italic: "em",
        code: "inline-code",
        comment: "comment",
        bold: "strong",
        highlight: "highlight",
        strikethrough: "strikethrough",
        math: "math",
      },
      r = false,
      uniformHeading = true,
      a = undefined,
      s = e.doc.lineAt(t.from),
      l = e.doc.lineAt(t.to),
      c = s.number !== l.number,
      u = s.number;
    u <= l.number;
    u++
  ) {
    var h = e.doc.line(u);
    if (!(t.from < h.from || t.to > h.to) || !sf(e, h)) {
      var p = lf(e, u);
      if (!c || p.from !== p.to) {
        var d = Math.max(p.from, t.from),
          f = Math.min(p.to, t.to);
        of(n, d);
        var m = n.from;
        for (n.node.parent || (i = {}); ; ) {
          var g = n.type.prop(tokenClassNodeProp) || "",
            v = new Set(g.split(" ")),
            y = undefined;
          for (y in i)
            if (i.hasOwnProperty(y)) {
              v.has("formatting") || ((r = true), v.has(i[y]) || delete i[y]);
            }
          if (uniformHeading) {
            var b = /\bheader-(\d)\b/.exec(g),
              w = b ? Number(b[1]) : 0;
            undefined !== a && a !== w && (uniformHeading = false);
            a = w;
          }
          if ((m < n.from && (i = {}), (m = n.to) >= f || !n.next())) break;
        }
        if (m < f) {
          i = {};
        }
      }
    }
  }
  if ((r || (i = {}), i.math))
    for (; n.prevSibling(); ) {
      g = n.type.prop(tokenClassNodeProp) || "";
      if ((v = new Set(g.split(" "))).has("format-math-begin")) {
        if (v.has("math-block")) {
          delete i.math;
        }
        break;
      }
    }
  return {
    headingLevel: a != null ? a : 0,
    uniformHeading: uniformHeading,
    bold: !!i.bold,
    italic: !!i.italic,
    code: !!i.code,
    comment: !!i.comment,
    highlight: !!i.highlight,
    strikethrough: !!i.strikethrough,
    math: !!i.math,
  };
}
function sf(e, t) {
  var n = false;
  syntaxTree(e).iterate({
    from: t.from,
    to: t.to,
    enter: function (e) {
      var t,
        i = new Set(((t = e.type.prop(lineClassNodeProp)) !== null && undefined !== t ? t : "").split(" "));
      if (i.has("HyperMD-table-2") || i.has("HyperMD-codeblock")) {
        n = true;
        return !1;
      }
    },
  });
  return n;
}
function lf(e, t) {
  var n = e.doc.line(t),
    from = n.from,
    r = n.to;
  syntaxTree(e).iterate({
    from: n.from,
    to: n.to,
    enter: function (e) {
      var t,
        r = new Set(((t = e.type.prop(tokenClassNodeProp)) !== null && undefined !== t ? t : "").split(" "));
      if (
        r.has("hmd-list-indent") ||
        r.has("formatting-quote") ||
        r.has("formatting-list") ||
        r.has("formatting-task") ||
        r.has("formatting-header")
      ) {
        from = Math.min(n.to, e.to);
      }
    },
  });
  return rf(e, {
    from: from,
    to: r,
  });
}
function cf(e, t, n) {
  var i = nf[n],
    r = [];
  syntaxTree(e).iterate({
    from: t.from,
    to: t.to,
    enter: function (t) {
      var n,
        o = ((n = t.type.prop(tokenClassNodeProp)) !== null && undefined !== n ? n : "").split(" "),
        a = new Set(o);
      if (a.has("formatting") && a.has(i.nodeType)) {
        var s = uf(e, t.from, i);
        if (s) {
          r.push(
            __assign(__assign({}, s), {
              insert: "",
            }),
          );
        }
      }
    },
  });
  return r;
}
function uf(e, t, n, i) {
  if (undefined === i) {
    i = 1;
  }
  var r = [n.surroundingChars];
  if (n.altSurroundingChars) {
    r.push(n.altSurroundingChars);
  }
  for (var o = 0, a = r; o < a.length; o++) {
    var s = a[o],
      from = t,
      c = t;
    if ((-1 === i ? (from -= s.length) : (c += s.length), e.sliceDoc(from, c) === s))
      return {
        from: from,
        to: c,
      };
  }
  return null;
}
function hf(e, t, n, i) {
  var r = function () {
      var e;
      return ((e = t.type.prop(tokenClassNodeProp)) !== null && undefined !== e ? e : "")
        .split(" ")
        .contains(o.nodeType);
    },
    o = nf[i],
    from = n.from,
    s = n.to,
    l = t.from;
  of(t, n.from);
  for (var c = true; c && !(t.to < l); ) {
    if ((uf(e, t.from, o) && (from = t.from), !r())) break;
    l = t.from;
    c = t.prevSibling();
  }
  of(t, n.to);
  s = t.to;
  l = t.to;
  for (var u = true; u && !(t.from > l); ) {
    if (t.from > from && uf(e, t.to, o, -1)) {
      s = t.to;
      break;
    }
    if (!r()) break;
    s = t.to;
    l = t.to;
    u = t.nextSibling();
  }
  return {
    from: from,
    to: s,
  };
}
function pf(e) {
  return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
function df(e) {
  return pf(new TextEncoder().encode(e));
}
function ff(e) {
  return new TextDecoder().decode(new Uint8Array(e));
}
function base64ToArrayBuffer(e) {
  for (var t = window.atob(e), n = t.length, i = new Uint8Array(n), r = 0; r < n; r++) i[r] = t.charCodeAt(r);
  return i.buffer;
}
function arrayBufferToBase64(buffer, ...args) {
  const arrayBuffer = new Uint8Array(buffer, ...args);
  const stringArray = [];
  const limit = arrayBuffer.byteLength;
  for (let i = 0; i < limit; i++) {
    stringArray.push(String.fromCharCode(arrayBuffer[i]));
  }
  return window.btoa(stringArray.join(""));
}
async function computeSha256Hex(e) {
  const digestBuffer = await sha256Digest(data);
  return arrayBufferToHex(digestBuffer);
}
async function sha256Digest(e) {
  return window.crypto.subtle.digest("SHA-256", new Uint8Array(data));
}
function hexToArrayBuffer(e) {
  for (var t = e.length / 2, n = new ArrayBuffer(t), i = new Uint8Array(n), r = 0; r < t; r++)
    i[r] = parseInt(e.substr(2 * r, 2), 16);
  return n;
}
function arrayBufferToHex(e) {
  for (var t = new Uint8Array(e), n = [], i = 0; i < t.length; i++) {
    var r = t[i];
    n.push((r >>> 4).toString(16));
    n.push((15 & r).toString(16));
  }
  return n.join("");
}
function Ef(e) {
  if (e <= 0) return "0 B";
  for (var t = ["B", "KB", "MB", "GB", "TB", "PB"], n = t.length - 1, i = 0; i < t.length; i++)
    if (e < Math.pow(1024, i + 1)) {
      n = i;
      break;
    }
  var r = e / Math.pow(1024, n);
  return ""
    .concat(
      (function (e, t, n, i) {
        if (undefined === t) {
          t = 2;
        }
        if (undefined === n) {
          n = ".";
        }
        if (undefined === i) {
          i = ",";
        }
        var r = e < 0 ? "-" : "";
        e = Math.abs(e);
        var o = parseInt(e.toFixed(t), 10) + "",
          a = o.length > 3 ? o.length % 3 : 0;
        return (
          r +
          (a ? o.substr(0, a) + i : "") +
          o.substr(a).replace(/(\d{3})(?=\d)/g, "$1" + i) +
          (t
            ? n +
              Math.abs(e - Math.floor(e))
                .toFixed(t)
                .slice(2)
            : "")
        );
      })(r, n === 0 ? 0 : 2),
      " ",
    )
    .concat(t[n]);
}
function loadModule(module) {
  return window.require && window.require(module);
}
function callbackWithElectron(callback) {
  const instance = loadModule("electron");
  if (instance) {
    callback(instance);
  }
}
async function readFileIfExists(filePath) {
  const fs = loadModule("fs");
  if (fs?.existsSync(filePath)) {
    return await fs.promises.readFile(filePath);
  }
  return null;
}
async function sendElectronIpcRequest(payload) {
  const electron = loadModule("electron");
  if (!electron) {
    throw new Error("Not electron");
  }
  const ipcRenderer = electron.ipcRenderer;
  return new Promise((resolve, reject) => {
    const requestId = ic(16);
    ipcRenderer.once(requestId, (event, response) => {
      if (response.body) {
        resolve(response);
      } else {
        reject(response.error);
      }
    });
    ipcRenderer.send("request-url", requestId, payload);
  });
}
let isDev = false;
let electronVersion = "0.0.0";
let electronMajorVersion = 0;
callbackWithElectron(function (electron) {
  isDev = electron.ipcRenderer.sendSync("is-dev");
  electronVersion = process.versions.electron;
  electronMajorVersion = parseInt(electronVersion.split(".")[0]);
  Platform.resourcePathPrefix = electron.ipcRenderer.sendSync("file-url");
});
function printToPdf(electron, printer) {
  return new Promise(function (n) {
    const ipcRenderer = electron.ipcRenderer;
    ipcRenderer.once("print-to-pdf", n);
    ipcRenderer.send("print-to-pdf", printer);
  });
}
function isDarwin() {
  return process.platform === "darwin";
}
function setSidebarForDarwin(instance, sidebar) {
  if (process.platform === "darwin") {
    instance.setBackgroundColor("#00000000");
    sidebar ? instance.setVibrancy("sidebar") : instance.setVibrancy(null);
  }
}
function isWebViewElement(element) {
  return element.constructor.name === "WebViewElement";
}
async function onContextMenuCallback(instance) {
  const win = instance.win;
  const electron = window.electron;
  if (!electron || !instance.isTrusted) {
    return null;
  }

  instance.stopPropagation();
  instance.stopImmediatePropagation();
  return await new Promise(function (resolve) {
    const timer = win.setTimeout(function () {
      resolve(null);
    }, 1000);
    const ipcRenderer = electron.ipcRenderer;
    ipcRenderer.once("context-menu", function (n, r) {
      win.clearTimeout(timer);
      resolve(r);
    });
    ipcRenderer.send("context-menu");
  });
}
function setSpellCheckerLanguages(locales) {
  if (isMacOS || !window.electron) {
    return;
  }
  const session = electron.remote.getCurrentWebContents().session;
  const availableSpellCheckers = session.availableSpellCheckerLanguages;
  if (!(locales && locales.length !== 0)) {
    locales = [electron.remote.app.getLocale()];
  }
  const spellCheckers = locales.filter(function (locale) {
    return availableSpellCheckers.contains(locale);
  });
  session.setSpellCheckerLanguages(spellCheckers);
}
function showItemInFolderSetup(item) {
  if (window.electron) {
    electron.remote.shell.showItemInFolder(item);
  }
}
if (!isDev) {
  callbackWithElectron((electron) => {
    try {
      electron.deprecate.setHandler(() => {});
    } catch (e) {}
  });
}
const languageLiteral = "language";
const fallbackLng = "en";
const languageSupported = {
  am: "አማርኛ",
  ar: "اَلْعَرَبِيَّةُ",
  be: "беларуская мова",
  ca: "català",
  cs: "čeština",
  da: "Dansk",
  de: "Deutsch",
  en: "English",
  "en-GB": "English (GB)",
  es: "Español",
  fa: "فارسی",
  fr: "Français",
  ga: "Gaeilge",
  he: "עברית",
  hu: "Magyar",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  kh: "ខ្មែរ",
  ko: "한국어",
  lv: "Latviešu",
  ms: "Bahasa Melayu",
  ne: "नेपाली",
  nl: "Nederlands",
  no: "Norsk",
  pl: "Polski",
  pt: "Português",
  "pt-BR": "Português do Brasil",
  ro: "Română",
  ru: "Pусский",
  sq: "Shqip",
  th: "ไทย",
  tr: "Türkçe",
  uk: "Українська",
  uz: "oʻzbekcha",
  vi: "Tiếng Việt",
  zh: "简体中文",
  "zh-TW": "繁體中文",
};
const languageSupportedKeys = Object.keys(languageSupported).sort();
const languageSpecialAlias = {
  zh: "zh-cn",
  cz: "cs",
  no: "nb",
};
const yamlInterpolation = {
  interpolation: {
    prefix: "{{{{",
    suffix: "}}}}",
  },
};
const defaultNS = "default";
function mergeConfig(source, overrides) {
  if (String.isString(source)) return overrides !== null && String.isString(overrides) ? overrides : source;
  const merged = {};
  for (const key in source)
    if (source.hasOwnProperty(key)) {
      merged[key] = mergeConfig(source[key], overrides?.[key] || null);
    }
  return merged;
}
function toKebabCase(str) {
  return str
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/_[0-9]/g, (match) => `-${match.substring(1)}`);
}
i18next.init({
  fallbackLng: fallbackLng,
  ns: [defaultNS],
  defaultNS: defaultNS,
  initImmediate: false,
  interpolation: {
    alwaysFormat: true,
    escapeValue: false,
    format: function (e, t) {
      return typeof e == "number" ? e.toLocaleString() : e;
    },
  },
});