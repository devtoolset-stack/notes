class DragManager {
  constructor(app) {
    this.ghostEl = null;
    this.actionEl = null;
    this.draggable = null;
    this.sourceEls = null;
    this.sourceClass = "";
    this.hoverEl = null;
    this.hoverClass = "";
    this.overlayEl = createDiv("workspace-drop-overlay");
    this.shouldHideOverlay = false;
    this.isDragOverHandled = false;
    this.dragStart = null;
    this.onTouchEnd = (event) => {
      if (event.touches.length === 0) {
        this.onDragEnd();
      }
    };
    this.app = app;
    window.addEventListener("dragstart", this.onDragStartGlobal.bind(this));
    window.addEventListener("dragover", this.onDragOverFirst.bind(this), { capture: true });
    window.addEventListener("dragover", this.onDragOver.bind(this));
    window.addEventListener("dragleave", this.onDragLeave.bind(this));
    const handleDragEndOrDrop = (event) => {
      event.view === window ? this.onDragEnd() : setTimeout(() => this.onDragEnd());
    };
    window.addEventListener("dragend", handleDragEndOrDrop);
    window.addEventListener("drop", handleDragEndOrDrop);
  }
  onDragLeave(evt) {
    if (!evt.clientX && !evt.clientY && !evt.screenX && !evt.screenY && !evt.relatedTarget) {
      this.ghostEl?.detach();
      this.updateHover(null, "");
    }
  }
  onDragStartGlobal(evt) {
    if ((hideTooltip(), Platform.isIosApp && (Ac(), navigator.vibrate(200)), !this.draggable)) {
      var selection = window.getSelection();
      if (!(selection.rangeCount > 0) || selection.getRangeAt(0).collapsed) {
        var n = evt.target;
        if (n.nodeName === "IMG") {
          var i = n.src,
            r = this.app.vault.resolveFileUrl(i);
          if (r) {
            this.onDragStart(evt, this.dragFile(evt, r));
          }
        }
      }
    }
  }
  onDragOverFirst() {
    var e = this;
    this.isDragOverHandled = false;
    queueMicrotask(function () {
      if (!e.isDragOverHandled) {
        e.setAction(null);
        e.updateHover(null, "");
      }
    });
    this.shouldHideOverlay = true;
    setTimeout(function () {
      if (e.shouldHideOverlay) {
        e.hideOverlay();
      }
    });
  }
  onDragOver(e) {
    this.isDragOverHandled = true;
    Platform.isMobile &&
      (e.preventDefault(), e.dataTransfer.dropEffect === "none" && (e.dataTransfer.dropEffect = "move"));
    var t = e.clientX,
      n = e.clientY;
    if (t !== 0 || n !== 0) {
      var i = this.ghostEl,
        r = this.dragStart;
      if (i) {
        Platform.isMobile ? ((t -= i.offsetWidth / 2), (n -= i.offsetHeight + 20)) : ((t += 5), (n += 5));
        i.style.left = t + "px";
        i.style.top = n + "px";
        var o = e.doc;
        i.parentNode !== o.body && o.body.appendChild(i);
        i.show();
      }
      if (r && !r.moved && (Math.abs(r.evt.clientX - e.clientX) > 5 || Math.abs(r.evt.clientY - e.clientY) > 5)) {
        r.moved = true;
      }
    }
  }
  onDragEnd() {
    var e = this.ghostEl,
      t = this.dragStart;
    if (
      (e && (e.detach(), (this.ghostEl = null)),
      (this.dragStart = null),
      (this.draggable = null),
      this.updateSource(null, ""),
      this.updateHover(null, ""),
      document.body.removeClass("is-grabbing"),
      window.removeEventListener("touchend", this.onTouchEnd),
      this.removeOverlay(),
      t && !t.moved)
    ) {
      var n = t.evt;
      if (
        !n.target.dispatchEvent(
          new MouseEvent("contextmenu", {
            button: 0,
            buttons: 0,
            ctrlKey: n.ctrlKey,
            altKey: n.altKey,
            metaKey: n.metaKey,
            shiftKey: n.shiftKey,
            screenX: n.screenX,
            screenY: n.screenY,
            bubbles: true,
            cancelable: true,
            clientX: n.clientX,
            clientY: n.clientY,
          }),
        )
      ) {
        navigator.vibrate(200);
      }
    }
  }
  onDragStart(e, draggable) {
    var n = e.dataTransfer;
    this.draggable = draggable;
    Platform.isMobile &&
      ((this.dragStart = {
        evt: e,
        moved: !1,
      }),
      window.addEventListener("touchend", this.onTouchEnd),
      temporarilyPreventEvent(e.targetNode, "contextmenu"));
    document.body.addClass("is-grabbing");
    n.effectAllowed = "all";
    var i = this.ghostEl;
    if ((i && (i.detach(), (this.ghostEl = null)), draggable)) {
      var r = (this.ghostEl = e.doc.body.createDiv("drag-ghost")),
        o = r.createDiv("drag-ghost-self");
      draggable.icon && setIcon(o, draggable.icon);
      draggable.title &&
        o.createSpan({
          text: draggable.title,
        });
      this.actionEl = r.createDiv("drag-ghost-action");
    }
    setupTransparentDragImage(e);
    var a = true;
    if (n.items.length > 0)
      for (var s = 0, l = Array.from(n.items); s < l.length; s++) {
        var c = l[s];
        if (c.kind !== "string" || n.getData(c.type) !== "") {
          a = false;
          break;
        }
      }
    if (a) {
      n.setData("text/plain", (draggable && draggable.title) || "-");
    }
  }
  handleDrag(e, t) {
    var n = this;
    e.draggable = true;
    e.addEventListener("dragstart", function (e) {
      var i = t(e);
      if (i) {
        n.onDragStart(e, i);
      }
    });
  }
  dragFile(e, file, source) {
    setDragTextAndURL(e.dataTransfer, this.app.getObsidianUrl(file));
    return {
      source: source,
      type: "file",
      icon: "lucide-file",
      title: file.getShortName(),
      file: file,
    };
  }
  dragFolder(e, file, source) {
    setDragText(e.dataTransfer, file.name);
    return {
      source: source,
      type: "folder",
      icon: "lucide-folder-open",
      title: file.name,
      file: file,
    };
  }
  dragFiles(e, files, source) {
    if (files.length === 0) return null;
    for (var title, r = 0, o = 0, a = [], s = 0, l = files; s < l.length; s++) {
      var c = l[s];
      c instanceof TFile ? (r++, a.push(this.app.getObsidianUrl(c))) : c instanceof TFolder && o++;
    }
    o > 0 && r > 0
      ? (title = "".concat(r, " files and ").concat(o, " folders"))
      : o > 0
        ? (title = "".concat(o, " folders"))
        : r > 0 && (title = "".concat(r, " files"));
    setDragTextAndURL(e.dataTransfer, a.join("\n"));
    return {
      source: source,
      type: "files",
      icon: "lucide-files",
      title: title,
      files: files,
    };
  }
  dragLink(e, linktext, sourcePath, i, source) {
    var file = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(linktext), sourcePath),
      a = linktext,
      s = linktext;
    file && ((a = this.app.getObsidianUrl(file)), (s = file.getShortName()));
    setDragTextAndURL(e.dataTransfer, a);
    return {
      source: source,
      type: "link",
      icon: "lucide-link",
      title: i || s,
      linktext: linktext,
      sourcePath: sourcePath,
      file: file,
    };
  }
  handleDrop(e, t, n) {
    var i = this,
      r = function (e) {
        if ((n || i.draggable) && !e.defaultPrevented) {
          var r = t(e, i.draggable, !0);
          if (r) {
            e.preventDefault();
            var o = r.action,
              dropEffect = r.dropEffect,
              s = r.hoverEl,
              l = r.hoverClass;
            o && i.setAction(o);
            dropEffect && (e.dataTransfer.dropEffect = dropEffect);
            s && l && i.updateHover(s, l);
          }
        }
      };
    e.addEventListener("dragover", r);
    e.addEventListener("dragenter", r);
    e.addEventListener("drop", function (e) {
      if (n || i.draggable) {
        e.defaultPrevented || (t(e, i.draggable, !1) && e.preventDefault());
      }
    });
  }
  setAction(e) {
    var t = this.actionEl;
    if (t) {
      e ? (t.setText(e), t.show()) : t.hide();
    }
  }
  updateSource(sourceEls, sourceClass) {
    if (this.sourceEls)
      for (var n = 0, i = this.sourceEls; n < i.length; n++) {
        i[n].removeClass(this.sourceClass);
      }
    if (((this.sourceEls = sourceEls), (this.sourceClass = sourceClass), sourceEls))
      for (var r = 0, o = sourceEls; r < o.length; r++) {
        o[r].addClass(sourceClass);
      }
  }
  updateHover(hoverEl, hoverClass) {
    if (hoverEl !== this.hoverEl) {
      this.hoverEl && this.hoverEl.removeClass(this.hoverClass);
      this.hoverEl = hoverEl;
      this.hoverClass = hoverClass;
      hoverEl && hoverEl.addClass(hoverClass);
    }
  }
  showOverlay(e, t) {
    var n = this.overlayEl;
    n.parentNode !== e.body && e.body.appendChild(n);
    n.show();
    n.style.transform = "translate(".concat(t.x, "px, ").concat(t.y, "px)");
    n.style.width = t.width + "px";
    n.style.height = t.height + "px";
    this.shouldHideOverlay = false;
  }
  hideOverlay() {
    this.overlayEl.hide();
  }
  removeOverlay() {
    this.overlayEl.detach();
  }
}
function setupTransparentDragImage(event) {
  const img = new Image();
  img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
  event.doc.body.append(img);
  event.dataTransfer.setDragImage(img, 0, 0);
  setTimeout(() => img.detach(), 0);
}
const DOMPurify = require("dompurify");
function filterNodeAttributes(node, attrName, separator, allowed) {
  const attr = node.getAttribute(attrName);
  const parts = attr.split(separator);
  const filtered = [];
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim().toLowerCase();
    if (allowed.hasOwnProperty(trimmed) && allowed[trimmed]) {
      filtered.push(trimmed);
    }
  }
  const result = filtered.join(separator);
  result !== attr && node.setAttribute(attrName, result);
}
window.DOMPurify = DOMPurify;
DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  if (node.instanceOf(HTMLAnchorElement)) {
    node.setAttribute("target", "_blank");
    node.hasAttribute("rel") || node.setAttribute("rel", "noopener nofollow");
  }
});
const domPurifySanitizeOptions = {
  ALLOW_UNKNOWN_PROTOCOLS: true,
  RETURN_DOM_FRAGMENT: true,
  FORBID_TAGS: ["style"],
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["frameborder", "allowfullscreen", "allow", "data-tooltip-position"],
};
function sanitizeHTMLToDom(node) {
  return document.importNode(DOMPurify.sanitize(node, domPurifySanitizeOptions), true);
}
const IMAGE_EXTENSIONS = ["bmp", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif"];
const AUDIO_EXTENSIONS = ["mp3", "wav", "m4a", "3gp", "flac", "ogg", "oga", "opus"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogv", "mov", "mkv"];
const PDF_EXTENSIONS = ["pdf"];
const MARKDOWN_EXTENSIONS = ["md"];
const CANVAS_EXTENSIONS = ["canvas"];
const BASE_EXTENSIONS = ["base"];
const SCRIPT_STYLE_EXTENSIONS = ["json", "css", "js"];
const MEDIA_EXTENSIONS = MARKDOWN_EXTENSIONS.concat(CANVAS_EXTENSIONS, BASE_EXTENSIONS);
const ALL_SUPPORTED_EXTENSIONS = [].concat(
  IMAGE_EXTENSIONS,
  AUDIO_EXTENSIONS,
  VIDEO_EXTENSIONS,
  PDF_EXTENSIONS,
  MARKDOWN_EXTENSIONS,
  CANVAS_EXTENSIONS,
);
function isNotMediaExtension(extension) {
  return !MEDIA_EXTENSIONS.contains(extension);
}
function isNotSupportedExtension(filename) {
  return isNotMediaExtension(getExtension(filename));
}
function generateLinksFromData(app, data, options) {
  const { fileManager, vault } = app;
  if (data.type === "file") return [fileManager.generateMarkdownLink(data.file, options)];
  if (data.type === "files") {
    const links = [];
    for (let index = 0; index < files.length; index++) {
      const file = data.files[index];
      if (file instanceof TFile) {
        links.push(fileManager.generateMarkdownLink(file, options));
      }
    }
    return links;
  }
  if (data.type === "link") {
    if (data.file) {
      const subpath = parseLinktext(data.linktext).subpath;
      return [fileManager.generateMarkdownLink(data.file, options, subpath)];
    }
    return [data.linktext];
  }
  if (data.type === "heading") {
    const cleanHeading = stripHeadingForLink(data.heading.heading);
    return [fileManager.generateMarkdownLink(data.file, options, "#" + cleanHeading)];
  }
  if (data.type === "bookmarks") {
    const bookmarkLinks = [];
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i].item;
      if (item.type === "file") {
        const file = vault.getAbstractFileByPath(item.path);
        if (file instanceof TFile) {
          bookmarkLinks.push(fileManager.generateMarkdownLink(file, options, item.subpath, item.title));
        }
      }
    }
    return bookmarkLinks;
  }
  return [];
}
class ClipboardManager {
  constructor(info) {
    this.app = info.app;
    this.info = info;
  }
  getPath() {
    return this.info.file?.path || "";
  }
  handlePaste(event) {
    if (event.defaultPrevented) return true;

    this.app.workspace.trigger("editor-paste", event, this.info.editor, this.info);
    const data = this.handleDataTransfer(event.clipboardData);
    if (data) {
      this.info.editor.replaceSelection(data, "paste");
      event.preventDefault();
      return true;
    }
    if (event.clipboardData.getData("obsidian/properties") && this.info instanceof MarkdownView) {
      this.info.handlePaste(event);
    }
    const files = extractFilesFromDataTransfer(event.clipboardData, "clipboard", true);
    if (files.length > 0) {
      event.preventDefault();
      this.insertFiles(files);
    }
    return false;
  }
  handleDragOver(event) {
    const draggable = this.app.dragManager.draggable;
    if (draggable) {
      if (isMacOS ? event.shiftKey : event.altKey) return;
      switch (draggable.type) {
        case "file":
        case "link":
        case "heading": {
          normalizeDropEffect(event, "link");
          this.app.dragManager.setAction(i18nProxy.interface.dragAndDrop.insertLinkHere());
          break;
        }
        case "files": {
          normalizeDropEffect(event, "link");
          this.app.dragManager.setAction(i18nProxy.interface.dragAndDrop.insertLinksHere());
          break;
        }
        case "bookmarks": {
          const files = draggable.items.filter((element) => element.item.type === "file");
          if (files.length > 0) {
            normalizeDropEffect(event, "link");
            this.app.dragManager.setAction(i18nProxy.interface.dragAndDrop.insertLinkHere());
          }
          break;
        }
        default:
          break;
      }
    } else {
      normalizeDropEffect(event, event.ctrlKey ? "link" : "copy");
    }
  }
  handleDrop(event) {
    const { app, info } = this;
    let insertedContent = null;
    const draggable = app.dragManager.draggable;
    if (draggable) {
      if (info instanceof MarkdownView && (isMacOS ? event.shiftKey : event.altKey)) {
        event.preventDefault();
        info.handleDrop(event, draggable, false);
        return true;
      }
      insertedContent = generateLinksFromData(this.app, draggable, this.getPath()).join("\n");
    } else {
      if (event.defaultPrevented) return true;
      this.app.workspace.trigger("editor-drop", event, this.info.editor, this.info);
      if (!event.shiftKey) {
        insertedContent = this.handleDataTransfer(event.dataTransfer);
      }
      if (!insertedContent) {
        insertedContent = this.handleDropIntoEditor(event);
      }
    }
    const activeCM = this.info.editor.activeCM;
    activeCM.dispatch({
      selection: EditorSelection.single(
        activeCM.posAtCoords({
          x: event.clientX,
          y: event.clientY,
        }),
      ),
    });
    if (typeof insertedContent === "string") {
      activeCM.dispatch(activeCM.state.replaceSelection(insertedContent));
      activeCM.focus();
      event.preventDefault();
      return true;
    }
    return false;
  }
  handleDropIntoEditor(event) {
    if (isMacOS ? event.altKey : event.ctrlKey) {
      const links = [];
      const files = extractFilesFromDataTransfer(event.dataTransfer, "drop", false);

      for (let i = 0; i < files.length; i++) {
        const filepath = files[i].filepath;
        if (filepath) {
          const resolvedFile = this.app.vault.resolveFilePath(filepath);
          if (resolvedFile) links.push(this.app.fileManager.generateMarkdownLink(resolvedFile, this.getPath()));
          else {
            const filename = getFilename(iu(filepath));
            const ext = getExtension(filename);
            const displayName = ext === "md" ? Qc(filename) : filename;
            const encodedPath = encodeSpecialChars(filepath);
            encodedPath = encodedPath.startsWith("/") ? "file://" + encodedPath : "file:///" + encodedPath;
            let linkText = `[${displayName}](${url})`;
            IMAGE_EXTENSIONS.contains(ext) && (linkText = "!" + linkText);
            links.push(linkText);
          }
        }
      }
      return links.length === 0 ? null : links.join("\n");
    }
    const files = extractFilesFromDataTransfer(event.dataTransfer, "drop", !0);
    files.length > 0 && event.preventDefault();
    this.insertFiles(files);
    return null;
  }
  async handleDataTransfer(event) {
    var self = this;
    const markdownText = event.getData("text/markdown");
    if (markdownText) return markdownText;
    const htmlText = event.getData("text/html");
    if (htmlText) {
      if (!this.app.vault.getConfig("autoConvertHtml")) return null;
      const sanitizedDom = sanitizeHTMLToDom(htmlText);
      const container = createEl("div");
      container.appendChild(sanitizedDom);
      if ((event.files.length > 0 && /^<img [^>]+>$/.test(container.innerHTML.trim()))) return null;
      const base64Images = [];
      const mediaElements = sanitizedDom.findAll("img, audio, video");
      for (let index = 0; index < mediaElements.length; index++) {
        const element = mediaElements[index];
        if (element.instanceOf(HTMLImageElement) || element.instanceOf(HTMLMediaElement)) {
          if (Platform.isDesktopApp && element.src.startsWith(Platform.resourcePathPrefix)) {
            element.src = "file:///" + element.src.substring(Platform.resourcePathPrefix.length);
            const resolvedFile = this.app.vault.resolveFileUrl(element.src);
            if (resolvedFile instanceof TFile) {
              element.src = this.app.metadataCache.fileToLinktext(resolvedFile, this.getPath(), true);
            }
          }
          if (element.src.startsWith("data:") && element.src.length > 1e3) {
            base64Images.push(element.src);
            element.detach();
          }
        }
      }
      for (const dataUrl of base64Images) {
        try {
            const match = dataUrl.match(/^data:([\w/-.]+);base64,(.*)/);
            if (match) {
                const mimeType = match[1];
                const isJpeg = mimeType === "image/jpeg";
                const isPng = mimeType === "image/png";
                
                if (isPng || isJpeg) {
                    const arrayBuffer = base64ToArrayBuffer(match[2]);
                    await this.saveAttachment("Pasted image", isPng ? "png" : "jpg", arrayBuffer, true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
      return htmlToMarkdown(container.innerHTML.trim());
    }
    const uriList = event.getData("text/uri-list");
    if (uriList) {
      const plainText = event.getData("text/plain") || "";
      if (!plainText) {
        const droppedFiles = extractFilesFromDataTransfer(event, "drop", false);
        if (droppedFiles && droppedFiles.length > 0) {
          var ext = droppedFiles[0].extension.toLowerCase();
          if (ext === "webloc" || ext === "url") return droppedFiles[0].name;
        }
        return uriList;
      }
      if (uriList.toLowerCase() !== plainText.toLowerCase() && decodeURIComponent(uriList.toLowerCase()) !== plainText.toLowerCase()) {
        const ext = getExtension(getFilename(uriList));
        const linkText = `[${plainText}](${uriList})`;
        IMAGE_EXTENSIONS.contains(ext) && (linkText = "!" + linkText);
        return linkText;
      }
    }
    return null;
  }
  async insertFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const {name, extension, filepath, data} = files[i];
      const isNotLast = i < files.length - 1;

      if (filepath) {
        const resolvedFile = this.app.vault.resolveFilePath(filepath);
        if (resolvedFile) {
            this.insertAttachmentEmbed(resolvedFile, isNotLast);
            continue;
        }
      }

      if (data) {
        const arrayBuffer = await data;
        if (arrayBuffer) {
            await this.saveAttachment(name, extension, arrayBuffer, isNotLast);
        }
      }
    }
  }
  async saveAttachment(name, ext, arrayBuffer, isNotLast) {
    if (name === "Pasted image") {
        name += " " + window.moment().format("YYYYMMDDHHmmss");
    }
    
    const savedFile = await this.app.saveAttachment(name, ext, arrayBuffer);
    if (savedFile) {
        this.insertAttachmentEmbed(savedFile, isNotLast);
    }
  }
  insertAttachmentEmbed(file, flag) {
    let content = this.app.fileManager.generateMarkdownLink(file, this.getPath());
    flag && (content += "\n\n");
    this.info.editor.replaceSelection(content);
  }
}
const capacitorRateAppPlugin = CapacitorCore.registerPlugin("RateApp", {
  web: () => {
    const { RateApp } = require("capacitor-rate-app");
    return new RateApp.RateAppWeb();
  },
});
var isNotWeb = window.Capacitor && CapacitorCore.Capacitor.getPlatform() !== "web",
  isIOSPlatform = !!isNotWeb && CapacitorCore.Capacitor.getPlatform() === "ios",
  isAndroidPlatform = !!isNotWeb && CapacitorCore.Capacitor.getPlatform() === "android",
  capacitorAppPlugin = isNotWeb ? CapacitorCore.registerPlugin("App") : null,
  capacitorBrowserPlugin = isNotWeb ? CapacitorCore.registerPlugin("Browser") : null,
  filesystemPlugin =
    (isNotWeb && CapacitorCore.registerPlugin("Clipboard"),
    isNotWeb ? CapacitorCore.registerPlugin("Filesystem") : null),
  splashScreenPlugin = isNotWeb ? CapacitorCore.registerPlugin("SplashScreen") : null,
  statusBarPlugin = isNotWeb ? CapacitorCore.registerPlugin("StatusBar") : null,
  capacitorDevicePlugin = isNotWeb ? CapacitorCore.registerPlugin("Device") : null,
  keepAwakePlugin = isNotWeb ? CapacitorCore.registerPlugin("KeepAwake") : null,
  keyboardPlugin = isNotWeb ? CapacitorCore.registerPlugin("Keyboard") : null,
  rateAppPlugin = (isNotWeb && CapacitorCore.registerPlugin("Haptics"), isNotWeb ? capacitorRateAppPlugin : null),
  actionSheetPlugin = isNotWeb ? CapacitorCore.registerPlugin("ActionSheet") : null,
  keepAwakeInstances = [];
function requestKeepAwake() {
  if (keepAwakeInstances.length === 0)
    try {
      keepAwakePlugin.keepAwake().catch(console.error);
    } catch (error) {
      console.error(error);
    }
  const instance = {
    release: function () {
      const index = keepAwakeInstances.indexOf(instance);
      if (index > -1) {
          keepAwakeInstances.splice(index, 1);
      }
      if (keepAwakeInstances.length === 0) {
        try {
          keepAwakePlugin.allowSleep().catch(console.error);
        } catch (e) {
          console.error(e);
        }
      }
    },
  };
  keepAwakeInstances.push(instance);
  return instance;
}
class UrlHelper {
    static encodeUrlQuery (queryObj) {
      if (!queryObj) return "";
      var params = [];
      for (const key in queryObj) {
        if (queryObj.hasOwnProperty(key) && queryObj[key]) {
          queryObj[key] ? params.push(encodeURIComponent(key)) : params.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryObj[key]));
        }
      }
      return params.join("&");
    };
    static decodeUrlQuery (queryString) {
      const result = {};
      if (!queryString || queryString.trim() === "") return result;
      for (const pairs = queryString.split("&"), i = 0; i < pairs.length; i++) {
        const parts = pairs[i].split("=");
        if (parts.length >= 1 && parts[0]) {
          const decodedKey = decodeURIComponent(parts[0]);
          parts.length === 2 ? (result[decodedKey] = decodeURIComponent(parts[1])) : (result[decodedKey] = "");
        }
      }
      return result;
    };
    static decodeUrl (url = "") {
      const [pathAndQuery, hashString = ""] = url.split("#");
      const [path, queryString = ""] = pathAndQuery?.split("?")??["", ""];
      return {
        path,
        query: UrlHelper.decodeUrlQuery(queryString),
        hash: UrlHelper.decodeUrlQuery(hashString),
      };
    };
    static addQuery (url, query) {
      return url + (url.contains("?") ? "&" : "?") + UrlHelper.encodeUrlQuery(query);
    };
}
var DATA_URL_REGEX =
    /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i;
function parseDataUrl(dataUrlString) {
  var t = dataUrlString.trim().match(DATA_URL_REGEX);
  if (!t) return null;
  for (
    var n = (t[1] || "text/plain;charset=us-ascii").split(";").map(function (e) {
        return e.toLowerCase();
      }),
      contentType = n[0],
      properties = {},
      o = 0,
      a = n.slice(1);
    o < a.length;
    o++
  ) {
    var s = a[o].split("=");
    properties[s[0]] = s[1];
  }
  var isBase64 = !!t[t.length - 2],
    data = t[t.length - 1] || "";
  return {
    contentType: contentType,
    properties: properties,
    isBase64: isBase64,
    data: data,
    get arrayBuffer() {
      return isBase64 ? base64ToArrayBuffer(data) : df(data);
    },
  };
}
class HttpError {
  constructor(message, status, headers) {
    super(message);
    this.status = status;
    this.headers = headers;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
};
function handleResponse(requestConfig, status, headers, arrayBuffer) {
  var r;
  if (!!requestConfig?.throw && status >= 400) {
    throw new HttpError("Request failed, status " + status, status, headers);
  }
  return { status, headers, arrayBuffer,
    get json() {
      return JSON.parse(new TextDecoder().decode(arrayBuffer));
    },
    get text() {
      return new TextDecoder().decode(arrayBuffer);
    },
  };
}
async function fetchRequestCore(config) {
    if (typeof config === "string") {
        config = { url: config };
    }

    if (isNotWeb) {
        let body = config.body;
        let binary = false;
        
        if (config.body instanceof ArrayBuffer) {
            body = arrayBufferToBase64(config.body);
            binary = true;
        }

        const response = await capacitorAppPlugin.requestUrl({
            url: config.url,
            method: config.method,
            contentType: config.contentType,
            headers: config.headers,
            body,
            binary,
        });
        
        return handleResponse(config, response.status, response.headers, base64ToArrayBuffer(response.body));
    }

    if (typeof loadModule === "function" && loadModule("electron")) {
        const response = await sendElectronIpcRequest(config);
        return handleResponse(config, response.status, response.headers, response.body);
    }

    const headers = {};
    if (config.contentType) {
        headers["Content-Type"] = config.contentType;
    }
    if (config.headers) {
        Object.assign(headers, config.headers);
    }

    const fetchResponse = await fetch(config.url, {
        method: config.method || "GET",
        headers: headers,
        body: config.body,
    });

    const arrayBuffer = await fetchResponse.arrayBuffer();
    const responseHeaders = {};
    fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });

    return handleResponse(config, fetchResponse.status, responseHeaders, arrayBuffer);
}
function wrapResponse(response) {
  const wrapper = response;
  Object.defineProperty(wrapper, "arrayBuffer", {
    get: async function () {
      const res = await response;
      return res.arrayBuffer;
    },
  });
  Object.defineProperty(wrapper, "json", {
    get: async function () {
      const res = await response;
      return res.json;
    },
  });
  Object.defineProperty(wrapper, "text", {
    get: function () {
      const res = await response;
      return res.text;
    },
  });
  return wrapper;
}
function requestUrl(config) {
  return wrapResponse(fetchRequestCore(config));
}
async function request(e) {
  const response = await fetchRequestCore(config);
    return response.text;
}
function requestWithWrapper(config) {
  return wrapResponse(fetchRequestCore(config));
}
function getDownloadUrl() {
  var e = "https://obsidian.md/download";
  if (Platform.isDesktopApp) {
    var t = window.process.platform,
      n = t === "win32" ? "win" : t === "darwin" ? "mac" : "linux",
      arch = window.process.arch;
    return UrlHelper.addQuery(e, {
      os: n,
      arch: arch,
    });
  }
  if (Platform.isMobileApp) {
    n = isAndroidPlatform ? "android" : "ios";
    return UrlHelper.addQuery(e, {
      os: n,
    });
  }
  return e;
}
function getHeaderIgnoreCase(headers, targetKey) {
  var n = targetKey.toLowerCase();
  for (var i in headers) if (headers.hasOwnProperty(i) && i.toLowerCase() === n) return headers[i];
  return null;
}
window.request = request;
window.requestUrl = requestUrl;
var xM = Object.freeze({
    aliases: {
      name: "aliases",
      widget: "aliases",
    },
    cssclasses: {
      name: "cssclasses",
      widget: "multitext",
    },
    tags: {
      name: "tags",
      widget: "tags",
    },
  }),
  TM = ["YYYY-MM-DD"],
  DM = ["YYYY-MM-DD[T]HH:mm:ss", "YYYY-MM-DD[T]HH:mm", "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm"],
  AM = /^\d{4}-[01]\d-[0-3]\d$/,
  PM = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d$/;
function LM(e) {
  if (e == null || e === null) return "text";
  var t = typeof e;
  return t === "string"
    ? PM.test(e)
      ? "datetime"
      : AM.test(e)
        ? "date"
        : "text"
    : t === "number"
      ? "number"
      : t === "boolean"
        ? "checkbox"
        : uc(e, !0)
          ? "multitext"
          : "unknown";
}
var IM = (function (e) {
  function t(app) {
    var n = e.call(this) || this;
    n.assignedWidgets = {};
    n.lastSave = 0;
    n.properties = {};
    n._loaded = false;
    n.onConfigFileChange = debounce(function () {
      return __awaiter(n, undefined, undefined, function () {
        var e, t, lastSave;
        return __generator(this, function (i) {
          switch (i.label) {
            case 0:
              e = this.app.vault.getConfigFile("types");
              i.label = 1;
            case 1:
              i.trys.push([1, 5, , 6]);
              return [4, this.app.vault.adapter.stat(e)];
            case 2:
              t = i.sent();
              lastSave = t.mtime;
              return this.lastSave < lastSave ? [4, this.loadData()] : [3, 4];
            case 3:
              i.sent();
              i.label = 4;
            case 4:
              this.lastSave = lastSave;
              return [3, 6];
            case 5:
              i.sent();
              return [2];
            case 6:
              return [2];
          }
        });
      });
    }, 50);
    n.app = app;
    n.registeredTypeWidgets = {
      aliases: aliases,
      checkbox: checkbox,
      date: date,
      datetime: datetime,
      file: file,
      folder: folder,
      multitext: multitext,
      property: property,
      number: number,
      tags: tagsbD0,
      text: text,
    };
    return n;
  }
  __extends(t, e);
  t.prototype.load = function () {
    return __awaiter(this, undefined, undefined, function () {
      return __generator(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.loadData()];
          case 1:
            e.sent();
            this._loaded = true;
            return [2];
        }
      });
    });
  };
  t.prototype.registerListeners = function () {
    this.app.vault.on("raw", this.onRaw.bind(this));
    this.app.metadataCache.on("finished", this.updatePropertyInfoCache, this);
    this.on("changed", this.updatePropertyInfoCache, this);
  };
  t.prototype.onRaw = function (e) {
    if (e === this.app.vault.configDir + "/types.json") {
      this.onConfigFileChange();
    }
  };
  t.prototype.updatePropertyInfoCache = function () {
    this.properties = this.app.metadataCache.getAllPropertyInfos();
  };
  t.prototype.getAllProperties = function () {
    return this.properties;
  };
  t.prototype.getAssignedWidget = function (e) {
    var t = e.toLowerCase();
    return Object.hasOwn(this.assignedWidgets, t) ? this.assignedWidgets[t].widget : null;
  };
  t.prototype.getWidget = function (e) {
    var t = e.toLowerCase();
    return Object.hasOwn(this.registeredTypeWidgets, t) ? this.registeredTypeWidgets[t] : LD;
  };
  t.prototype.getTypeInfo = function (e, t) {
    var expected = undefined,
      i = this.getAssignedWidget(e);
    if (i && ((expected = this.getWidget(i)), t == null || expected.validate(t)))
      return {
        expected: expected,
        inferred: expected,
      };
    if (t == null) {
      var r = this.getPropertyInfo(e).widget,
        inferred = this.getWidget(r);
      if (inferred !== LD)
        return {
          inferred: inferred,
          expected: expected != null ? expected : inferred,
        };
    }
    var a = LM(t),
      inferreds0 = this.getWidget(a);
    return {
      inferred: inferreds0,
      expected: expected != null ? expected : inferreds0,
    };
  };
  t.prototype.getPropertyInfo = function (name) {
    var t = name.toLowerCase();
    return Object.hasOwn(this.properties, t)
      ? this.properties[t]
      : {
          name: name,
          widget: "text",
          occurrences: 0,
        };
  };
  t.prototype.loadData = function () {
    return __awaiter(this, undefined, undefined, function () {
      var e, t, n, name, widget, o;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            return [4, this.app.vault.readConfigJson("types")];
          case 1:
            if (
              ((e = a.sent()), (t = this.assignedWidgets), (this.assignedWidgets = {}), e && e.hasOwnProperty("types"))
            )
              for (name in (n = e.types))
                if (n.hasOwnProperty(name)) {
                  widget = n[name];
                  o = name.toLowerCase();
                  this.assignedWidgets.hasOwnProperty(o) ||
                    (this.assignedWidgets[o] = {
                      name: name,
                      widget: widget,
                    });
                  this._loaded && ((t.hasOwnProperty(o) && t[o].widget === widget) || this.trigger("changed", o));
                }
            Object.assign(this.assignedWidgets, xM);
            return [2];
        }
      });
    });
  };
  t.prototype.save = function () {
    return __awaiter(this, undefined, undefined, function () {
      var types, t, n, i, r, lastSave;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            for (t in ((types = {}), this.assignedWidgets))
              if (this.assignedWidgets.hasOwnProperty(t)) {
                n = this.assignedWidgets[t];
                i = n.name;
                r = n.widget;
                types[i] = r;
              }
            lastSave = Date.now();
            this.lastSave = lastSave;
            return [
              4,
              this.app.vault.writeConfigJson(
                "types",
                {
                  types: types,
                },
                {
                  mtime: lastSave,
                },
              ),
            ];
          case 1:
            a.sent();
            return [2];
        }
      });
    });
  };
  t.prototype.setType = function (name, widget) {
    return __awaiter(this, undefined, Promise, function () {
      var n, i;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            n = name.toLowerCase();
            (i = this.assignedWidgets[n])
              ? (i.widget = widget)
              : (this.assignedWidgets[n] = {
                  name: name,
                  widget: widget,
                });
            return [4, this.save()];
          case 1:
            r.sent();
            this.trigger("changed", n);
            return [2];
        }
      });
    });
  };
  t.prototype.unsetType = function (e) {
    return __awaiter(this, undefined, undefined, function () {
      var t;
      return __generator(this, function (n) {
        switch (n.label) {
          case 0:
            t = e.toLowerCase();
            delete this.assignedWidgets[t];
            return [4, this.save()];
          case 1:
            n.sent();
            this.trigger("changed", t);
            return [2];
        }
      });
    });
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
function OM(e, t) {
  if (Platform.isMobile) {
    var n = [];
    e.addEventListener(
      "touchstart",
      function (i) {
        if (!(i.touches.length > i.changedTouches.length)) {
          for (var r = i.targetNode; r; ) {
            if (r.instanceOf(HTMLAudioElement)) return;
            if (r.instanceOf(HTMLElement) && r.dataset.ignoreSwipe) return;
            r = r.parentNode;
          }
          var o = i.touches[0];
          if (o.touchType !== "stylus") {
            var startX = o.clientX,
              startY = o.clientY,
              targetEl = document.elementFromPoint(startX, startY);
            if (!(targetEl instanceof HTMLCanvasElement) && e.contains(targetEl)) {
              var c = o.identifier,
                u = Date.now(),
                h = false,
                direction = "x",
                d = o.clientX,
                f = o.clientY,
                m = u,
                g = 0,
                v = 0;
              if (n.length > 0)
                for (var y = 0, b = n; y < b.length; y++) {
                  b[y].cancel();
                }
              n = [];
              var w = function (e) {
                  for (var t = e.changedTouches, n = 0; n < t.length; n++) {
                    var i = t[n];
                    if (i.identifier === c) return i;
                  }
                  t = e.touches;
                  for (n = 0; n < t.length; n++) {
                    if (t[n].identifier === c) return null;
                  }
                  S();
                  return null;
                },
                k = function (e) {
                  if (w(e) && (S(), n.length !== 0)) {
                    var t, i;
                    direction === "x" ? ((t = d - startX), (i = g)) : ((t = f - startY), (i = v));
                    for (var r = (i = 800 * i * window.devicePixelRatio) + t, o = 0, l = n; o < l.length; o++) {
                      l[o].finish(d, f, r);
                    }
                    n = [];
                  }
                },
                C = function (e) {
                  if (w(e) && (S(), n.length !== 0)) {
                    for (var t = 0, i = n; t < i.length; t++) {
                      i[t].cancel();
                    }
                    n = [];
                  }
                },
                E = function (e) {
                  var touch = w(e);
                  if (touch) {
                    var r = touch.clientX,
                      o = touch.clientY;
                    if (!h) {
                      if (Date.now() - u > 200) return void S();
                      var c = Math.abs(r - startX),
                        y = Math.abs(o - startY),
                        b = Math.max(c, y);
                      if (b < 10) return;
                      h = true;
                      for (
                        var k = targetEl, C = (direction = c === b ? "x" : "y") === "x" ? r - startX : o - startY;
                        k;
                      ) {
                        var E = direction === "x" ? k.scrollWidth - k.clientWidth : k.scrollHeight - k.clientHeight;
                        if (E > 0) {
                          var M = getComputedStyle(k),
                            x = direction === "x" ? M.overflowX : M.overflowY;
                          if (x === "auto" || x === "scroll") {
                            var T = direction === "x" ? k.scrollLeft : k.scrollTop;
                            if ((C > 0 && T > 0) || (C < 0 && T < E - 1)) return void S();
                          }
                        }
                        k = k.parentElement;
                      }
                      if (window.getSelection().toString()) return void S();
                      t({
                        evt: e,
                        touch: touch,
                        points: e.touches.length,
                        targetEl: targetEl,
                        startX: startX,
                        startY: startY,
                        x: r,
                        y: o,
                        direction: direction,
                        registerCallback: function (e) {
                          return n.push(e);
                        },
                      });
                    }
                    if (n.length !== 0) {
                      e.preventDefault();
                      var D = Date.now(),
                        A = D - m,
                        P = 1 - 0.8;
                      g = 0.8 * g + ((r - d) / A) * P;
                      v = 0.8 * v + ((o - f) / A) * P;
                      d = r;
                      f = o;
                      m = D;
                      for (var L = 0, I = n; L < I.length; L++) {
                        I[L].move(r, o);
                      }
                    } else S();
                  }
                },
                S = function () {
                  window.removeEventListener("touchcancel", C);
                  window.removeEventListener("touchend", k);
                  window.removeEventListener("touchmove", E);
                };
              window.addEventListener("touchcancel", C);
              window.addEventListener("touchend", k);
              window.addEventListener("touchmove", E, {
                passive: !1,
              });
            }
          }
        }
      },
      {
        passive: !1,
      },
    );
  }
}
var FM = [];
function NM(e) {
  if (!FM.contains(e)) {
    FM.push(e);
  }
}
function RM(e) {
  if (FM.contains(e)) {
    FM.remove(e);
  }
}