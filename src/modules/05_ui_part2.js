var defaultAttributesLucide = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};
function createElementLucide(tag, attrs) {
  var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach(function (name) {
    element.setAttribute(name, attrs[name]);
  });
  return element;
}
function transformSVGData2Element(e) {
  var t = e[0];
  if (t === 0)
    return createElementLucide("line", {
      x1: e[1],
      y1: e[2],
      x2: e[3],
      y2: e[4],
    });
  if (t === 1)
    return createElementLucide("circle", {
      cx: e[1],
      cy: e[2],
      r: e[3],
    });
  if (t === 2)
    return createElementLucide("polyline", {
      points: e[1],
    });
  if (t === 3)
    return createElementLucide("polygon", {
      points: e[1],
    });
  if (t === 4)
    return createElementLucide("ellipse", {
      cx: e[1],
      cy: e[2],
      rx: e[3],
      ry: e[4],
    });
  if (t === 5) {
    var n = {
      x: e[1],
      y: e[2],
      width: e[3],
      height: e[4],
    };
    e[5] && (n.rx = e[5]);
    e[6] && (n.ry = e[6]);
    e[7] && (n.transform = e[7]);
    return createElementLucide("rect", n);
  }
  return t === 6
    ? createElementLucide("path", {
        d: e[1],
      })
    : undefined;
}
function iE(lucideIconData) {
  var root = createElementLucide("svg", defaultAttributesLucide);
  for (var i = 0; i < lucideIconData.length; i++) {
    var data = lucideIconData[i];
    root.appendChild(transformSVGData2Element(data));
  }
  return root;
}
var predefinedIconMaps = {
    "create-new": "edit",
    trash: "trash-2",
    search: "search",
    "right-triangle": "right-triangle",
    document: "file",
    folder: "folder-open",
    pencil: "edit-3",
    "left-arrow": "chevron-left",
    "right-arrow": "chevron-right",
    "three-horizontal-bars": "menu",
    "dot-network": "git-fork",
    "audio-file": "file-audio",
    "image-file": "image",
    "pdf-file": "file-text",
    gear: "settings",
    documents: "files",
    blocks: "layout-list",
    "go-to-file": "file-input",
    presentation: "monitor",
    "cross-in-box": "x-square",
    microphone: "mic",
    "microphone-filled": "mic",
    "two-columns": "columns",
    link: "link",
    "popup-open": "arrow-up-right",
    checkmark: "check",
    hashtag: "hash",
    "left-arrow-with-tail": "arrow-left",
    "right-arrow-with-tail": "arrow-right",
    "up-arrow-with-tail": "arrow-up",
    "down-arrow-with-tail": "arrow-down",
    "lines-of-text": "align-left",
    "vertical-three-dots": "more-vertical",
    pin: "pin",
    "magnifying-glass": "search",
    info: "info",
    "horizontal-split": "separator-horizontal",
    "vertical-split": "separator-vertical",
    "calendar-with-checkmark": "calendar-check",
    "folder-minus": "folder-minus",
    "sheets-in-box": "sheets-in-box",
    "up-and-down-arrows": "move-vertical",
    "broken-link": "unlink",
    cross: "x",
    "any-key": "plus-circle",
    reset: "rotate-ccw",
    star: "star",
    "crossed-star": "star-off",
    dice: "dice",
    "filled-pin": "pin",
    enter: "log-in",
    help: "help",
    vault: "vault",
    "open-vault": "open-vault",
    "paper-plane": "send",
    "bullet-list": "list",
    "uppercase-lowercase-a": "uppercase-lowercase-a",
    "star-list": "star-list",
    "expand-vertically": "move-vertical",
    languages: "languages",
    switch: "repeat",
    "pane-layout": "layout",
    install: "download-cloud",
    sync: "refresh-cw",
    "check-in-circle": "check-circle-2",
    "sync-small": "sync-small",
    "check-small": "check-small",
    paused: "paused",
    "forward-arrow": "forward",
    "stacked-levels": "folder-tree",
    "bracket-glyph": "bracket-glyph",
    "note-glyph": "sticky-note",
    "tag-glyph": "tag",
    "price-tag-glyph": "tag",
    "heading-glyph": "heading-glyph",
    "bold-glyph": "bold",
    "italic-glyph": "italic",
    "strikethrough-glyph": "strikethrough",
    "highlight-glyph": "highlighter",
    "code-glyph": "code-2",
    "quote-glyph": "quote",
    "link-glyph": "link",
    "bullet-list-glyph": "list",
    "number-list-glyph": "list-ordered",
    "checkbox-glyph": "check-square",
    "undo-glyph": "undo-2",
    "redo-glyph": "redo-2",
    "up-chevron-glyph": "chevron-up",
    "down-chevron-glyph": "chevron-down",
    "left-chevron-glyph": "chevron-left",
    "right-chevron-glyph": "chevron-right",
    "percent-sign-glyph": "percent",
    "keyboard-glyph": "keyboard",
    "double-up-arrow-glyph": "chevrons-up",
    "double-down-arrow-glyph": "chevrons-down",
    "image-glyph": "paperclip",
    "wrench-screwdriver-glyph": "wrench",
    clock: "clock",
    "plus-with-circle": "plus-circle",
    "minus-with-circle": "minus-circle",
    "indent-glyph": "indent",
    "unindent-glyph": "outdent",
    fullscreen: "maximize",
    "exit-fullscreen": "minimize",
    cloud: "cloud",
    "run-command": "terminal",
    "compress-glyph": "minimize-2",
    "enlarge-glyph": "maximize-2",
    "scissors-glyph": "scissors",
    "up-curly-arrow-glyph": "corner-right-up",
    "down-curly-arrow-glyph": "corner-right-down",
    "plus-minus-glyph": "diff",
    "links-going-out": "links-going-out",
    "links-coming-in": "links-coming-in",
    "add-note-glyph": "file-plus",
    "duplicate-glyph": "copy",
    "clock-glyph": "clock",
    "calendar-glyph": "calendar-days",
    "command-glyph": "terminal-square",
    "dice-glyph": "dice-glyph",
    "file-explorer-glyph": "files",
    "graph-glyph": "git-fork",
    "import-glyph": "download",
    "navigate-glyph": "navigation",
    "open-elsewhere-glyph": "arrow-up-right",
    "presentation-glyph": "monitor",
    "paper-plane-glyph": "send",
    "question-mark-glyph": "question-mark-glyph",
    "restore-file-glyph": "rotate-ccw",
    "search-glyph": "search",
    "star-glyph": "star",
    "play-audio-glyph": "play-circle",
    "stop-audio-glyph": "stop-circle",
    "tomorrow-glyph": "calendar-plus",
    "wand-glyph": "wand",
    "workspace-glyph": "layout",
    "yesterday-glyph": "calendar-minus",
    "box-glyph": "box-glyph",
    "merge-files-glyph": "git-merge",
    "merge-files": "git-merge",
    "two-blank-pages": "copy",
    scissors: "scissors",
    paste: "clipboard-check",
    "paste-text": "clipboard-type",
    split: "git-branch-plus",
    "select-all-text": "box-select",
    wand: "wand-2",
    "github-glyph": "file-code",
    "reading-glasses": "glasses",
    "user-manual-filled": "book-open",
    "discord-filled": "discord",
    "chat-bubbles-filled": "message-circle",
    "experiment-filled": "experiment",
  },
  predefinedIconData = {
    "refresh-cw-off":
      '<path d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47"/><path d="M8 16H3v5"/><path d="M3 12C3 9.51 4 7.26 5.64 5.64"/><path d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64"/><path d="M21 12c0 1-.16 1.97-.47 2.87"/><path d="M21 3v5h-5"/><path d="M22 22 2 2"/>',
    "bracket-glyph":
      '<path d="M9 21C7.89336 21 5 21 5 21C5 21 5 6.79076 5 3C5 3 8.21882 3.00004 9 3.00004"/><path d="M15 2.99996C16.1066 2.99996 19 2.99996 19 2.99996C19 2.99996 19 17.2092 19 21C19 21 15.7812 21 15 21"/>',
    "box-glyph":
      '<path d="M21 13V12.5714C21 11.8964 20.8189 11 19.7143 11L4.28571 11C3.18114 11 3 11.8964 3 12.5714V20.4286C3 21.1036 3.18114 22 4.28571 22H14"/><path d="M21 4.14286C21 3.65194 20.8189 3 19.7143 3L4.28571 3C3.18114 3 3 3.65194 3 4.14286"/><path d="M21 8.14286C21 7.65194 20.8189 7 19.7143 7L4.28571 7C3.18114 7 3 7.65194 3 8.14286"/><path d="M19 16V22"/><path d="M16 19H22"/>',
    "check-small":
      '<path d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21Z"/><path d="M7.5 12.5L10.5 15.5L16 10"/>',
    "dice-glyph":
      '<path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"/><path d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"/><path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"/><path d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"/>',
    dice: '<path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"/><path d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"/><path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"/><path d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"/>',
    discord:
      '<path d="M8.795 17.0865C8.34168 17.7478 7.8561 18.3864 7.34 19C3.65 18.895 2.25 16.5 2.25 16.5C2.30245 13.1065 3.12479 9.7693 4.655 6.74C6.00009 5.68771 7.63906 5.07965 9.345 5L9.845 6.155C10.5591 6.05585 11.279 6.00407 12 6C12.7242 6.00238 13.4474 6.05249 14.165 6.15L14.665 4.995C16.3726 5.07897 18.0117 5.69233 19.355 6.75C20.8803 9.7771 21.6991 13.1107 21.75 16.5C21.75 16.5 20.35 18.895 16.66 19C16.1517 18.3894 15.6744 17.7536 15.23 17.095M18.46 15.645C16.54 16.6175 14.682 17.59 12 17.59C9.318 17.59 7.46 16.6175 5.54 15.645" /><path d="M9.25 13.5C9.66421 13.5 10 12.9404 10 12.25C10 11.5596 9.66421 11 9.25 11C8.83579 11 8.5 11.5596 8.5 12.25C8.5 12.9404 8.83579 13.5 9.25 13.5Z" /><path d="M14.75 13.5C15.1642 13.5 15.5 12.9404 15.5 12.25C15.5 11.5596 15.1642 11 14.75 11C14.3358 11 14 11.5596 14 12.25C14 12.9404 14.3358 13.5 14.75 13.5Z" />',
    "right-triangle": '<path d="M3 8L12 17L21 8"/>',
    "heading-glyph":
      '<path d="M9 4H4"/><path d="M20 4H15"/><path d="M20 20H15"/><path d="M9 20H4"/><path d="M18 12L6 12"/><path d="M6 20L6 4"/><path d="M18 20L18 4"/>',
    help: '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M9.09009 9.00003C9.32519 8.33169 9.78924 7.76813 10.4 7.40916C11.0108 7.05019 12.079 6.94542 12.7773 7.06519C13.9093 7.25935 14.9767 8.25497 14.9748 9.49073C14.9748 11.9908 12 11.2974 12 14"/><path d="M12 17H12.01"/>',
    "keyboard-toggle":
      '<path d="M20 3H4C2.89543 3 2 3.89543 2 5V13C2 14.1046 2.89543 15 4 15H20C21.1046 15 22 14.1046 22 13V5C22 3.89543 21.1046 3 20 3Z"/><path d="M6 7H6.001"/><path d="M10 7H10.001"/><path d="M14 7H14.001"/><path d="M18 7H18.001"/><path d="M6 11H6.001"/><path d="M18 11H18.001"/><path d="M10 11H14"/><path d="M7 19L12 21L17 19"/>',
    "broken-link":
      '<path d="M12 18.26L10.4886 19.7786L10.4886 19.761C9.64543 20.5738 8.51382 21.0192 7.34221 20.9994C6.17061 20.9795 5.05478 20.496 4.23971 19.655C3.44441 18.8312 3 17.7313 3 16.5868C3 15.4423 3.44441 14.3425 4.23971 13.5186L5.75111 12"/><path d="M12 5.75153L13.5114 4.24023C14.3546 3.42658 15.4862 2.98075 16.6578 3.00064C17.8294 3.02052 18.9452 3.50449 19.7603 4.34629C20.5556 5.17092 21 6.27188 21 7.4175C21 8.56311 20.5556 9.66407 19.7603 10.4887L18.2489 12"/><path d="M3 8L6 8"/><path d="M8 3L8 6"/><path d="M18 16L21 16"/><path d="M16 18L16 21"/>',
    experiment:
      '<path d="M9.18747 9.75V3H14.8125V9.75L20.1485 15.5707C20.5733 16.0343 20.8542 16.6115 20.9567 17.2319C21.0592 17.8523 20.9789 18.4891 20.7257 19.0646C20.4725 19.6402 20.0573 20.1297 19.5307 20.4733C19.0041 20.817 18.3889 21 17.7601 21H6.23994C5.61113 21 4.99591 20.817 4.46931 20.4733C3.94271 20.1297 3.52749 19.6402 3.27428 19.0646C3.02108 18.4891 2.94084 17.8523 3.04334 17.2319C3.14584 16.6115 3.42666 16.0343 3.85154 15.5707L9.18747 9.75Z"/><path d="M8 3H16"/><path d="M5 14C9.08333 16.25 9.66667 14 12 14C14.3333 14 14.9167 16.25 19 14"/>',
    "left-arrow": '<path d="M16.5 3.5L7.5 12.5L16.5 21.5"/>',
    link: '<path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"/><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"/>',
    "link-glyph":
      '<path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"/><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"/>',
    "links-coming-in":
      '<path d="M8.70467 12C8.21657 11.6404 7.81269 11.1817 7.52044 10.6549C7.22819 10.1281 7.0544 9.54553 7.01086 8.94677C6.96732 8.348 7.05504 7.74701 7.26808 7.18456C7.48112 6.62212 7.81449 6.11138 8.24558 5.68697L10.7961 3.17516C11.5978 2.41258 12.6716 1.99062 13.7861 2.00016C14.9007 2.0097 15.9668 2.44997 16.755 3.22615C17.5431 4.00234 17.9902 5.05233 17.9998 6.14998C18.0095 7.24763 17.5811 8.30511 16.8067 9.09467L15.9014 10"/><path d="M11.2953 8C11.7834 8.35957 12.1873 8.81831 12.4796 9.34512C12.7718 9.87192 12.9456 10.4545 12.9891 11.0532C13.0327 11.652 12.945 12.253 12.7319 12.8154C12.5189 13.3779 12.1855 13.8886 11.7544 14.313L9.20392 16.8248C8.40221 17.5874 7.32844 18.0094 6.21389 17.9998C5.09933 17.9903 4.03318 17.55 3.24504 16.7738C2.4569 15.9977 2.00985 14.9477 2.00016 13.85C1.99047 12.7524 2.41893 11.6949 3.19326 10.9053L4.09859 10"/><path d="M17 21L14 18L17 15"/><path d="M21 18H14"/>',
    "links-going-out":
      '<path d="M8.70467 12C8.21657 11.6404 7.81269 11.1817 7.52044 10.6549C7.22819 10.1281 7.0544 9.54553 7.01086 8.94677C6.96732 8.348 7.05504 7.74701 7.26808 7.18456C7.48112 6.62212 7.81449 6.11138 8.24558 5.68697L10.7961 3.17516C11.5978 2.41258 12.6716 1.99062 13.7861 2.00016C14.9007 2.0097 15.9668 2.44997 16.755 3.22615C17.5431 4.00234 17.9902 5.05233 17.9998 6.14998C18.0095 7.24763 17.5811 8.30511 16.8067 9.09467L15.9014 10"/><path d="M11.2953 8C11.7834 8.35957 12.1873 8.81831 12.4796 9.34512C12.7718 9.87192 12.9456 10.4545 12.9891 11.0532C13.0327 11.652 12.945 12.253 12.7319 12.8154C12.5189 13.3779 12.1855 13.8886 11.7544 14.313L9.20392 16.8248C8.40221 17.5874 7.32844 18.0094 6.21389 17.9998C5.09933 17.9903 4.03318 17.55 3.24504 16.7738C2.4569 15.9977 2.00985 14.9477 2.00016 13.85C1.99047 12.7524 2.41893 11.6949 3.19326 10.9053L4.09859 10"/><path d="M18 21L21 18L18 15"/><path d="M14 18H21"/>',
    "open-vault":
      '<path d="M10 21L4.5 21C3.39543 21 3 20.5255 3 19.2L3 4.80001C3 3.47452 3.39543 3.00001 4.5 3.00001L10 3"/><path d="M21 7L22.5 7"/><path d="M21 16L22.5 16"/><path d="M21 18.9104L21 5.09381C21 5.09381 21 3.94236 19.5 3.36674L11.5 1.06397C11.5 1.06397 10 0.488257 10 2.79104L10 21.0928C10 23.5159 11.5 22.9403 11.5 22.9403L19.5 20.6375C21 20.0618 21 18.9104 21 18.9104Z"/><ellipse cx="16" cy="11" rx="1.5" ry="3"/><path d="M16 14L16 17"/>',
    paused:
      '<path d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21Z"/><path d="M10 15V9"/><path d="M14 15V9"/>',
    "question-mark-glyph":
      '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M9.09009 9.00003C9.32519 8.33169 9.78924 7.76813 10.4 7.40916C11.0108 7.05019 12.079 6.94542 12.7773 7.06519C13.9093 7.25935 14.9767 8.25497 14.9748 9.49073C14.9748 11.9908 12 11.2974 12 14"/><path d="M12 17H12.01"/>',
    "right-arrow": '<path d="M7.5 21.5L16.5 12.5L7.5 3.5"/>',
    "sidebar-left":
      '<path d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3Z"/><path d="M10 4V20"/><path d="M4 7H7"/><path d="M4 10H7"/><path d="M4 13H7"/>',
    "sidebar-right":
      '<path d="M3 3H21C22.1046 3 23 3.89543 23 5V19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V5C1 3.89543 1.89543 3 3 3Z"/><path d="M14 4V20"/><path d="M20 7H17"/><path d="M20 10H17"/><path d="M20 13H17"/>',
    "sheets-in-box":
      '<path d="M19 16V22"/><path d="M16 19H22"/><path d="M20.7297 13.0005C20.7297 12.4701 20.519 11.9613 20.1439 11.5863C19.7689 11.2112 19.2602 11.0005 18.7297 11.0005H4.72974C4.1993 11.0005 3.6906 11.2112 3.31552 11.5863C2.94045 11.9613 2.72974 12.4701 2.72974 13.0005L2.72974 19.9886C2.72974 20.519 2.94045 21.0277 3.31552 21.4028C3.6906 21.7779 4.1993 21.9886 4.72974 21.9886H13"/><path d="M21 8C21 8 21 7 20 7H4C3.00199 7 3 7.99347 3 7.99347"/><path d="M21 4C21 4 21.0066 3 20 3L4 3C3 3 3 4 3 4"/>',
    "star-list":
      '<path d="M10 12H3"/><path d="M16 6H3"/><path d="M10 18H3"/><path d="M17 11L18.236 13.3039L21 13.6756L19 15.4679L19.472 18L17 16.8039L14.528 18L15 15.4679L13 13.6756L15.764 13.3039L17 11Z"/>',
    "sync-small":
      '<path d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21Z"/><path d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21Z"/><path d="M7.6394 11.0114C8.08785 9.01426 9.87182 7.52222 12.0044 7.52222C14 7.52222 15 9 16.0121 10.0057M8.00579 14.0042C9 15 10 16.4695 12.0044 16.4695C14.1282 16.4695 15.9062 14.9897 16.3638 13.0049"/><path d="M16.5 8.5V10.5H14.5"/><path d="M8 16L8 14L10 14"/>',
    tabs: '<path d="M6 17V19.4444C6 20.3036 6.69645 21 7.55556 21H18.4444C19.3036 21 20 20.3036 20 19.4444V8.55556C20 7.69645 19.3036 7 18.4444 7H16"/><path d="M14.4444 3H3.55556C2.69645 3 2 3.69645 2 4.55556V15.4444C2 16.3036 2.69645 17 3.55556 17H14.4444C15.3036 17 16 16.3036 16 15.4444V4.55556C16 3.69645 15.3036 3 14.4444 3Z"/>',
    "uppercase-lowercase-a":
      '<path d="M10.5 14L4.5 14"/><path d="M12.5 18L7.5 6"/><path d="M3 18L7.5 6"/><path d="M15.9526 10.8322C15.9526 10.8322 16.6259 10 18.3832 10C20.1406 9.99999 20.9986 11.0587 20.9986 11.9682V16.7018C20.9986 17.1624 21.2815 17.7461 21.7151 18"/><path d="M20.7151 13.5C18.7151 13.5 15.7151 14.2837 15.7151 16C15.7151 17.7163 17.5908 18.2909 18.7151 18C19.5635 17.7804 20.5265 17.3116 20.889 16.6199"/>',
    vault:
      '<path d="M21 19.2L21 4.8C21 3.47452 20.6046 3 19.5 3L4.5 3C3.39543 3 3 3.47452 3 4.8L3 19.2C3 20.5255 3.39543 21 4.5 21L19.5 21C20.6046 21 21 20.5255 21 19.2Z"/><path d="M14.9675 10.56C15.0601 11.1841 14.9535 11.8216 14.6629 12.3817C14.3722 12.9418 13.9124 13.396 13.3488 13.6797C12.7851 13.9634 12.1464 14.0621 11.5234 13.9619C10.9004 13.8616 10.3249 13.5675 9.87868 13.1213C9.43249 12.6751 9.13835 12.0996 9.0381 11.4766C8.93786 10.8536 9.0366 10.2149 9.3203 9.65123C9.60399 9.08759 10.0582 8.62776 10.6183 8.33713C11.1784 8.04651 11.8159 7.93989 12.4401 8.03245C13.0767 8.12687 13.6662 8.42355 14.1213 8.87868C14.5765 9.33381 14.8731 9.92326 14.9675 10.56Z"/><path d="M12 14L12 17"/><path d="M21 7L22.5 7"/><path d="M21 16L22.5 16"/>',
    "stack-horizontal":
      '<path d="M10 5H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm10 0h-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM2 2v20"/>',
    "stack-vertical":
      '<path d="M19 10V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm0 10v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm3-18H2"/>',
    "stretch-horizontal":
      '<path d="M18 8V6c0-1.105-.767-2-1.714-2H7.714C6.768 4 6 4.895 6 6v2c0 1.105.768 2 1.714 2h8.572C17.233 10 18 9.105 18 8Zm0 10v-2c0-1.105-.767-2-1.714-2H7.714C6.768 14 6 14.895 6 16v2c0 1.105.768 2 1.714 2h8.572c.947 0 1.714-.895 1.714-2ZM2 2v20M22 2v20"/>',
    "stretch-vertical":
      '<path d="M16 18h2c1.105 0 2-.767 2-1.714V7.714C20 6.768 19.105 6 18 6h-2c-1.105 0-2 .768-2 1.714v8.572c0 .947.895 1.714 2 1.714ZM6 18h2c1.105 0 2-.767 2-1.714V7.714C10 6.768 9.105 6 8 6H6c-1.105 0-2 .768-2 1.714v8.572C4 17.233 4.895 18 6 18ZM22 2H2m20 20H2"/>',
    "distribute-space-horizontal":
      '<path d="M7 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm12 0h-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM3 2v20M21 2v20"/>',
    "distribute-space-vertical":
      '<path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm0 12v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm3-16H2m20 18H2"/>',
    "zoom-to-selection":
      '<path d="M2 6V4a2 2 0 0 1 2-2h2m12 0h2a2 2 0 0 1 2 2v2m0 12v2a2 2 0 0 1-2 2h-2M6 22H4a2 2 0 0 1-2-2v-2m9-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 2-3-3"/>',
    "create-group":
      '<path d="M2 6V4a2 2 0 0 1 2-2h2m12 0h2a2 2 0 0 1 2 2v2m0 12v2a2 2 0 0 1-2 2h-2M6 22H4a2 2 0 0 1-2-2v-2m9-12H6v5h5V6Zm7 7h-5v5h5v-5Z"/>',
    "snap-to-object":
      '<path d="M21 3H3m18 18H3"/><circle cx="3" cy="3" r="2"/><circle cx="3" cy="21" r="2"/><circle cx="21" cy="3" r="2"/><circle cx="21" cy="21" r="2"/><path d="M15.111 8H8.89a.889.889 0 0 0-.89.889v6.222c0 .491.398.889.889.889h6.222a.889.889 0 0 0 .889-.889V8.89a.889.889 0 0 0-.889-.89Z"/>',
    "line-horizontal": '<path d="M3 12h18"/>',
    "aspect-ratio":
      '<path d="M19 4H5c-1.105 0-2 .796-2 1.778v12.444C3 19.204 3.895 20 5 20h14c1.105 0 2-.796 2-1.778V5.778C21 4.796 20.105 4 19 4Z"/><path d="M14 8h3v2m-7 6H7v-2"/>',
    "rectangle-vertical-double":
      '<path d="M8 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm12 0h-4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/>',
    "tab-frame": '<rect x="1" y="3" width="22" height="18" rx="4"/>',
    "sidebar-toggle-button-icon":
      '<rect x="1" y="2" width="22" height="20" rx="4"/><rect x="4" y="5" width="2" height="14" rx="2" fill="currentColor" class="sidebar-toggle-icon-inner"/>',
  },
  customIcons = {},
  customIconSVGViewBox = {
    viewBox: "0 0 100 100",
  },
  iconBuildCaches = {};
function cE(name, t) {
  if (!iconBuildCaches.hasOwnProperty(name)) {
    var namen0 = t();
    if (!namen0) return null;
    namen0.classList.add("svg-icon", name);
    iconBuildCaches[name] = namen0;
  }
  return iconBuildCaches[name].cloneNode(true);
}
function getIcon(name) {
  return name.startsWith("lucide-")
    ? cE(name, function () {
        var index = name.substring(7);
        return lucideIconArray.hasOwnProperty(index) ? iE(lucideIconArray[index]) : null;
      })
    : customIcons.hasOwnProperty(name)
      ? cE(name, function () {
          var element = createElementLucide("svg", customIconSVGViewBox);
          element.innerHTML = customIcons[name];
          return element;
        })
      : predefinedIconData.hasOwnProperty(name)
        ? cE(name, function () {
            var t = createElementLucide("svg", defaultAttributesLucide);
            t.innerHTML = predefinedIconData[name];
            return t;
          })
        : (predefinedIconMaps.hasOwnProperty(name) && (name = predefinedIconMaps[name]),
          lucideIconArray.hasOwnProperty(name)
            ? cE("lucide-" + name, function () {
                return iE(lucideIconArray[name]);
              })
            : null);
}
function setIcon(e, t) {
  var n = e.firstChild;
  if (!(n && n.instanceOf(SVGSVGElement) && n.classList.contains(t))) {
    if (n) {
      e.removeChild(n);
    }
    var i = getIcon(t);
    if (i) {
      e.appendChild(i);
    }
  }
}
function addIcon(name, icon) {
  delete iconBuildCaches[name];
  customIcons[name] = icon;
}
function removeIcon(e) {
  delete iconBuildCaches[e];
  delete customIcons[e];
}
function getIconIds() {
  return []
    .concat(
      Object.keys(lucideIconArray).map(function (e) {
        return "lucide-" + e;
      }),
    )
    .concat(Object.keys(customIcons))
    .concat(Object.keys(predefinedIconData));
}
const DEFAULT_TOOLTIP_DELAY = 1000;
let currentTooltipEl = null;
let currentTooltipTarget = null;
function initTooltipListeners(doc = document) {
  const body = doc.body;
  body.on("mouseover", "[aria-label]", handleMouseOverForAriaLabel);
  body.on("mouseout", "[aria-label]", handleMouseOutForAriaLabel);
  body.addEventListener("mouseup", hideTooltip);
}
let tooltipTimeoutId = null;
function clearTooltipTimeout() {
  if (tooltipTimeoutId) {
    clearTimeout(tooltipTimeoutId);
    tooltipTimeoutId = null;
  }
}
function isTooltipDisabled(element) {
  return getComputedStyle(element).getPropertyValue("--no-tooltip").trim() === "true";
}
function handleMouseOverForAriaLabel(event, target) {
  if (Mc(event, target)) {
    Nc(event) || isTooltipDisabled(target) || renderTooltip(target);
  }
}
function handleMouseOutForAriaLabel(event, target) {
  if (Mc(event, target) && !Nc(event)) {
    hideTooltip();
    const related = event.relatedTarget;
    if (related?.matchParent) {
      const parentWithAria = related.matchParent("[aria-label]");
      if (parentWithAria && parentWithAria.instanceOf(HTMLElement)) {
        if (isTooltipDisabled(parentWithAria)) return;
        renderTooltip(parentWithAria);
      }
    }
  }
}
var dynamicTooltipMap = new WeakMap();
function renderTooltip(element) {
  clearTooltipTimeout();
  let text = element.getAttribute("aria-label") || "";
  if (dynamicTooltipMap.has(element)) {
    text = dynamicTooltipMap.get(element)(element);
  }
  let placement = "bottom";
  if (element.hasAttribute("data-tooltip-position")) {
    placement = element.getAttribute("data-tooltip-position");
  }
  let classes = [];
  if (element.hasAttribute("data-tooltip-classes")) {
    classes = (element.getAttribute("data-tooltip-classes") || "").split(" ");
  }
  let delay = DEFAULT_TOOLTIP_DELAY;
  element.hasAttribute("data-tooltip-delay") &&
    ((delay = parseInt(element.getAttribute("data-tooltip-delay") || "")), isNaN(delay) && (delay = delay));
  displayTooltip(element, text, { placement, classes, delay });
}
let lastTooltipHideTime = 0;
function displayTooltip(e, text, n) {
  if (text) {
    var i = (n = n || {}).placement,
      r = undefined === i ? "bottom" : i,
      o = n.classes,
      a = undefined === o ? [] : o,
      s = n.gap,
      l = undefined === s ? 8 : s,
      c = n.horizontalParent,
      u = n.delay,
      h = undefined === u ? 0 : u;
    if (h > 0 && (currentTooltipEl || Date.now() > lastTooltipHideTime + 100)) {
      clearTooltipTimeout();
      n.delay = 0;
      return void (tooltipTimeoutId = window.setTimeout(function () {
        return displayTooltip(e, text, n);
      }, h));
    }
    if (e.isShown()) {
      var p = e.doc,
        d = e.getBoundingClientRect(),
        f = d.top,
        m = d.left,
        g = d.width,
        v = d.height;
      if (c) {
        var y = c.getBoundingClientRect();
        m = y.left;
        g = y.width;
      }
      currentTooltipEl && currentTooltipTarget === e
        ? currentTooltipEl.setText(text)
        : (hideTooltip(),
          (currentTooltipEl = createDiv({
            cls: "tooltip",
            text: text,
          })));
      var b = currentTooltipEl.createDiv("tooltip-arrow"),
        w = 0,
        k = 0;
      r === "bottom"
        ? ((w = f + v + l), (k = m + g / 2))
        : r === "right"
          ? ((w = f + v / 2), (k = m + g + l), a.push("mod-right"))
          : r === "left"
            ? ((w = f + v / 2), (k = m - l), a.push("mod-left"))
            : r === "top" && ((w = f - l - 5), (k = m + g / 2), a.push("mod-top"));
      currentTooltipEl.addClasses(a);
      currentTooltipEl.style.top = "0px";
      currentTooltipEl.style.left = "0px";
      currentTooltipEl.style.width = "";
      currentTooltipEl.style.height = "";
      currentTooltipEl.parentNode || p.body.appendChild(currentTooltipEl);
      var C = currentTooltipEl.getBoundingClientRect(),
        E = ["bottom", "top"].contains(r) ? C.width / 2 : C.width,
        S = r === "right" || r === "left" ? C.height / 2 : C.height;
      r === "left" ? (k -= E) : r === "top" && (w -= S);
      var M = p.body.clientHeight,
        x = p.body.clientWidth;
      if ((w + S > M && (w = M - S - l), (w = Math.max(w, l)), r === "top" || r === "bottom")) {
        if (k + E > x) {
          k -= T = k + E + l - x;
          b.style.left = "initial";
          b.style.right = E - T - l / 2 + "px";
        } else if (k - l - E < 0) {
          var T;
          k += T = -(k - l - E);
          b.style.right = "initial";
          b.style.left = E - T - l / 2 + "px";
        }
        k = Math.max(k, l);
      }
      currentTooltipEl.style.top = w + "px";
      currentTooltipEl.style.left = k + "px";
      currentTooltipEl.style.width = C.width + "px";
      currentTooltipEl.style.height = C.height + "px";
      currentTooltipTarget = e;
    }
  }
}
function hideTooltip() {
  clearTooltipTimeout();
  currentTooltipEl &&
    ((lastTooltipHideTime = Date.now()),
    currentTooltipEl.detach(),
    (currentTooltipEl = null),
    (currentTooltipTarget = null));
}
function applyTooltipAttributes(element, options = {}) {
  const { placement, classes, delay } = options;
  placement && placement !== "bottom" && element.setAttribute("data-tooltip-position", placement);
  classes && element.setAttribute("data-tooltip-classes", classes.join(" "));
  delay && element.setAttribute("data-tooltip-delay", String(delay));
}
function setTooltip(element, text, options) {
  element.setAttribute("aria-label", text);
  applyTooltipAttributes(element, options);
  currentTooltipTarget === element && displayTooltip(element, text, options);
}
function setDynamicTooltip(element, textFn, options) {
  element.setAttribute("aria-label", "");
  dynamicTooltipMap.set(element, textFn);
  applyTooltipAttributes(element, options);
  currentTooltipTarget === element && displayTooltip(element, textFn(element), options);
}
const DROP_EFFECT_MAPPING = {
  none: [],
  copy: ["copy"],
  copyLink: ["copy", "link"],
  copyMove: ["copy", "move"],
  link: ["link"],
  linkMove: ["link", "move"],
  move: ["move"],
  all: ["copy", "link", "move"],
  uninitialized: [],
};
function normalizeDropEffect(event, dropEffect) {
  if (!dropEffect) return;
  if (dropEffect === "none") {
    event.dataTransfer.dropEffect = dropEffect;
    return;
  }
  const allowedEffects = DROP_EFFECT_MAPPING[event.dataTransfer.effectAllowed];
  if (allowedEffects?.contains(dropEffect)) {
    event.dataTransfer.dropEffect = dropEffect;
  }
}