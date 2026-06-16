class DOMManager {
  constructor(element) {
    this.appContainerEl = element.createDiv("app-container");
    this.horizontalMainContainerEl = this.appContainerEl.createDiv("horizontal-main-container");
    this.workspaceEl = this.horizontalMainContainerEl.createDiv("workspace");
    this.statusBarEl = this.appContainerEl.createDiv("status-bar");
  }
}
function C9(e) {
  var t = e.frameDom;
  if (t) {
    var n = e.document.createDocumentFragment();
    if (!Platform.isMacOS) {
      var i = n.createDiv("titlebar-button mod-logo");
      i.addEventListener("mousedown", function (e) {
        return e.preventDefault();
      });
      i.addEventListener("click", function () {
        return e.electron.ipcRenderer.send("render-menu");
      });
      i.addEventListener("contextmenu", function () {
        return e.electron.ipcRenderer.send("render-menu");
      });
      var r = (function (e) {
        var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        t.setAttrs({
          viewBox: "0 0 512 512",
          width: String(e),
          height: String(e),
        });
        t.innerHTML =
          '<radialGradient id="logo-bottom-left" cx="0" cy="0" gradientTransform="matrix(-59 -225 150 -39 161.4 470)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-opacity=".1"/></radialGradient><radialGradient id="logo-top-right" cx="0" cy="0" gradientTransform="matrix(50 -379 280 37 360 374.2)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></radialGradient><radialGradient id="logo-top-left" cx="0" cy="0" gradientTransform="matrix(69 -319 218 47 175.4 307)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></radialGradient><radialGradient id="logo-bottom-right" cx="0" cy="0" gradientTransform="matrix(-96 -163 187 -111 335.3 512.2)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-opacity=".3"/></radialGradient><radialGradient id="logo-top-edge" cx="0" cy="0" gradientTransform="matrix(-36 166 -112 -24 310 128.2)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></radialGradient><radialGradient id="logo-left-edge" cx="0" cy="0" gradientTransform="matrix(88 89 -190 187 111 220.2)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></radialGradient><radialGradient id="logo-bottom-edge" cx="0" cy="0" gradientTransform="matrix(9 130 -276 20 215 284)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></radialGradient><radialGradient id="logo-middle-edge" cx="0" cy="0" gradientTransform="matrix(-198 -104 327 -623 400 399.2)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></radialGradient><clipPath id="clip"><path d="M.2.2h512v512H.2z"/></clipPath><g clip-path="url(#clip)"><path d="M382.3 475.6c-3.1 23.4-26 41.6-48.7 35.3-32.4-8.9-69.9-22.8-103.6-25.4l-51.7-4a34 34 0 0 1-22-10.2l-89-91.7a34 34 0 0 1-6.7-37.7s55-121 57.1-127.3c2-6.3 9.6-61.2 14-90.6 1.2-7.9 5-15 11-20.3L248 8.9a34.1 34.1 0 0 1 49.6 4.3L386 125.6a37 37 0 0 1 7.6 22.4c0 21.3 1.8 65 13.6 93.2 11.5 27.3 32.5 57 43.5 71.5a17.3 17.3 0 0 1 1.3 19.2 1494 1494 0 0 1-44.8 70.6c-15 22.3-21.9 49.9-25 73.1z" fill="#6c31e3"/><path d="M165.9 478.3c41.4-84 40.2-144.2 22.6-187-16.2-39.6-46.3-64.5-70-80-.6 2.3-1.3 4.4-2.2 6.5L60.6 342a34 34 0 0 0 6.6 37.7l89.1 91.7a34 34 0 0 0 9.6 7z" fill="url(#logo-bottom-left)"/><path d="M278.4 307.8c11.2 1.2 22.2 3.6 32.8 7.6 34 12.7 65 41.2 90.5 96.3 1.8-3.1 3.6-6.2 5.6-9.2a1536 1536 0 0 0 44.8-70.6 17 17 0 0 0-1.3-19.2c-11-14.6-32-44.2-43.5-71.5-11.8-28.2-13.5-72-13.6-93.2 0-8.1-2.6-16-7.6-22.4L297.6 13.2a34 34 0 0 0-1.5-1.7 96 96 0 0 1 2 54 198.3 198.3 0 0 1-17.6 41.3l-7.2 14.2a171 171 0 0 0-19.4 71c-1.2 29.4 4.8 66.4 24.5 115.8z" fill="url(#logo-top-right)"/><path d="M278.4 307.8c-19.7-49.4-25.8-86.4-24.5-115.9a171 171 0 0 1 19.4-71c2.3-4.8 4.8-9.5 7.2-14.1 7.1-13.9 14-27 17.6-41.4a96 96 0 0 0-2-54A34.1 34.1 0 0 0 248 9l-105.4 94.8a34.1 34.1 0 0 0-10.9 20.3l-12.8 85-.5 2.3c23.8 15.5 54 40.4 70.1 80a147 147 0 0 1 7.8 24.8c28-6.8 55.7-11 82.1-8.3z" fill="url(#logo-top-left)"/><path d="M333.6 511c22.7 6.2 45.6-12 48.7-35.4a187 187 0 0 1 19.4-63.9c-25.6-55-56.5-83.6-90.4-96.3-36-13.4-75.2-9-115 .7 8.9 40.4 3.6 93.3-30.4 162.2 4 1.8 8.1 3 12.5 3.3 0 0 24.4 2 53.6 4.1 29 2 72.4 17.1 101.6 25.2z" fill="url(#logo-bottom-right)"/><g clip-rule="evenodd" fill-rule="evenodd"><path d="M254.1 190c-1.3 29.2 2.4 62.8 22.1 112.1l-6.2-.5c-17.7-51.5-21.5-78-20.2-107.6a174.7 174.7 0 0 1 20.4-72c2.4-4.9 8-14.1 10.5-18.8 7.1-13.7 11.9-21 16-33.6 5.7-17.5 4.5-25.9 3.8-34.1 4.6 29.9-12.7 56-25.7 82.4a177.1 177.1 0 0 0-20.7 72z" fill="url(#logo-top-edge)"/><path d="M194.3 293.4c2.4 5.4 4.6 9.8 6 16.5L195 311c-2.1-7.8-3.8-13.4-6.8-20-17.8-42-46.3-63.6-69.7-79.5 28.2 15.2 57.2 39 75.7 81.9z" fill="url(#logo-left-edge)"/><path d="M200.6 315.1c9.8 46-1.2 104.2-33.6 160.9 27.1-56.2 40.2-110.1 29.3-160z" fill="url(#logo-bottom-edge)"/><path d="M312.5 311c53.1 19.9 73.6 63.6 88.9 100-19-38.1-45.2-80.3-90.8-96-34.8-11.8-64.1-10.4-114.3 1l-1.1-5c53.2-12.1 81-13.5 117.3 0z" fill="url(#logo-middle-edge)"/></g></g>';
        return t;
      })(18);
      r.addClass("logo-full");
      var o = (function (e) {
        var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        t.setAttrs({
          viewBox: "0 0 512 512",
          width: String(e),
          height: String(e),
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "32",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        });
        t.innerHTML =
          '<path d="M172.7 461.6c73.6-149.1 2.1-217-43.7-246.9m72 96.7c71.6-17.3 141-16.3 189.8 88.5m-114-96.3c-69.6-174 44.6-181 16.3-273.6m97.7 370c1.6-3 3.3-5.8 5.1-8.6 20-29.9 34.2-53.2 41.4-65.3a16 16 0 0 0-1.2-17.7 342.1 342.1 0 0 1-40.2-66.1c-10.9-26-12.5-66.5-12.6-86.2 0-7.4-2.4-14.7-7-20.6l-81.8-104a32 32 0 0 0-1.4-1.5m97.7 370a172.8 172.8 0 0 0-18 59c-2.9 21.5-24 38.4-45 32.6-30-8.3-64.5-21.1-95.7-23.5l-47.8-3.6c-7.7-.6-15-4-20.3-9.5l-82.3-84.8c-9-9.2-11.4-23-6.2-34.8 0 0 51-111.8 52.8-117.7l.7-3M293.1 30a31.5 31.5 0 0 0-44.4-2.3l-97.4 87.5c-5.4 5-9 11.5-10 18.8-3.7 24.5-9.7 68-12.3 80.7"/>';
        return t;
      })(18);
      o.addClass("logo-wireframe");
      i.appendChild(r);
      i.appendChild(o);
    }
    t.leftButtonContainerEl.appendChild(n);
    t.updateStatus();
  }
}
var E9 = {
    "encrypted-media": true,
    fullscreen: true,
    gamepad: true,
    hid: true,
    "idle-detection": true,
    "oversized-images": true,
    "picture-in-picture": true,
    "sync-xhr": true,
  },
  S9 = {
    "allow-forms": true,
    "allow-modals": true,
    "allow-popups": true,
    "allow-presentation": true,
    "allow-same-origin": true,
    "allow-scripts": true,
  };
DOMPurify.addHook("afterSanitizeAttributes", function (element) {
  if (element.instanceOf(HTMLIFrameElement)) {
    element.hasAttribute("sandbox")
      ? filterNodeAttributes(element, "sandbox", " ", S9)
      : element.setAttribute("sandbox", "allow-forms allow-presentation allow-same-origin allow-scripts allow-modals");
    element.hasAttribute("allow") && filterNodeAttributes(element, "allow", ";", E9);
  }
});
try {
  document.fonts.load("italic 800 12px Inter");
  document.fonts.load("italic 400 12px Inter");
  document.fonts.load("italic 12px Inter");
  document.fonts.load("800 12px Inter");
  document.fonts.load("600 12px Inter");
  document.fonts.load("400 12px Inter");
  document.fonts.load("300 12px Inter");
  document.fonts.load("200 12px Inter");
} catch (e) {
  console.error(e);
}
!(function (document) {
  try {
    const type = isMacOS ? "mod-macos" : isWin ? "mod-windows" : isLinux ? "mod-linux" : null;
    type && document.body.addClass(type);
  } catch (e) {
    console.error(e);
  }
})(document);
sm(document);
initTooltipListeners();
window.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length === 1) {
      touchEventPosition.sx = event.changedTouches[0].clientX;
      touchEventPosition.sy = event.changedTouches[0].clientY;
      touchEventPosition.t = Date.now();
    }
  },
  !0,
);
window.addEventListener(
  "touchend",
  (event) => {
    if (event.touches.length === 0) {
      touchEventPosition.ex = event.changedTouches[0].clientX;
      touchEventPosition.ey = event.changedTouches[0].clientY;
      touchEventPosition.t = Date.now();
    }
  },
  true,
);
document.addEventListener("scroll", () => (document.documentElement.scrollTop = 0), { passive: false });