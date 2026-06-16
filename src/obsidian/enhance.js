// 增强工具库 - 提供DOM操作、工具函数和浏览器兼容性增强
(() => {
  'use strict';

  function enhance() {
    // 属性定义辅助函数
    function updateSetter(object, key, setter) {
      Object.defineProperty(object, key, {
        value: setter,
        enumerable: false,
        configurable: true,
        writable: true
      });
    }

    function updateGetter(object, key, getter) {
      Object.defineProperty(object, key, { 
        get: getter, 
        enumerable: false, 
        configurable: true 
      });
    }

    // 浏览器兼容性处理
    const scope = window;
    const events = ['TouchEvent'];
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if (!scope[event]) scope[event] = function () {};
    }

    // matchMedia 兼容性处理
    try {
      const matchMedia = window.matchMedia;
      if (matchMedia && !matchMedia('(prefers-color-scheme: dark)').addEventListener) {
        window.matchMedia = function (query) {
          const mediaQueryList = matchMedia(query);
          
          if (!mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener = function (type, listener) {
              this.addListener(listener);
            };
          }
          
          if (!mediaQueryList.removeEventListener) {
            mediaQueryList.removeEventListener = function (type, listener) {
              this.removeListener(listener);
            };
          }
          
          return mediaQueryList;
        };
      }
    } catch (exception) {
      console.error(exception);
    }

    // ResizeObserver 兼容性处理
    if (!window.ResizeObserver) {
      window.ResizeObserver = (function () {
        function resizeObserver() {}
        resizeObserver.prototype.observe = function () {};
        resizeObserver.prototype.unobserve = function () {};
        resizeObserver.prototype.disconnect = function () {};
        return resizeObserver;
      })();
    }

    // 对象扩展
    if (!Object.isEmpty) {
      updateSetter(Object, 'isEmpty', function (value) {
        for (const key in value) if (value.hasOwnProperty(key)) return false;
        return true;
      });
    }

    if (!Object.each) {
      Object.each = function (data, callback, scope) {
        for (const key in data) {
          if (data.hasOwnProperty(key) && callback.call(scope, data[key], key) === false) return false;
        }
        return true;
      };
    }

    // 数组扩展
    if (!Array.combine) {
      Array.combine = function (arrays) {
        let totalLength = 0;
        for (let i = 0; i < arrays.length; i++) totalLength += arrays[i].length;
        
        const result = new Array(totalLength);
        let offset = 0;
        
        for (let i = 0; i < arrays.length; i++) {
          const array = arrays[i];
          for (let j = 0; j < array.length; j++) {
            result[offset] = array[j];
            offset++;
          }
        }
        
        return result;
      };
    }

    if (!Array.prototype.first) {
      updateSetter(Array.prototype, 'first', function () {
        if (this.length !== 0) return this[0];
      });
    }

    if (!Array.prototype.last) {
      updateSetter(Array.prototype, 'last', function () {
        if (this.length !== 0) return this[this.length - 1];
      });
    }

    if (!Array.prototype.contains) {
      updateSetter(Array.prototype, 'contains', Array.prototype.includes || function (value) {
        return this.indexOf(value) !== -1;
      });
    }

    if (!Array.prototype.remove) {
      updateSetter(Array.prototype, 'remove', function (value) {
        for (let i = this.length - 1; i >= 0; i--) {
          if (this[i] === value) this.splice(i, 1);
        }
      });
    }

    if (!Array.prototype.shuffle) {
      updateSetter(Array.prototype, 'shuffle', function () {
        let currentIndex = this.length;
        let temporaryValue, randomIndex;

        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = this[currentIndex];
          this[currentIndex] = this[randomIndex];
          this[randomIndex] = temporaryValue;
        }

        return this;
      });
    }

    if (!Array.prototype.findLastIndex) {
      updateSetter(Array.prototype, 'findLastIndex', function (predicate) {
        for (let i = this.length - 1; i >= 0; i--) {
          if (predicate(this[i], i)) return i;
        }
        return -1;
      });
    }

    if (!Array.prototype.unique) {
      updateSetter(Array.prototype, 'unique', function () {
        return Array.from(new Set(this).values());
      });
    }

    // 数学扩展
    if (!Math.clamp) {
      Math.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
      };
    }

    if (!Math.square) {
      Math.square = function (value) {
        return value * value;
      };
    }

    // 字符串扩展
    if (!String.isString) {
      String.isString = function (value) {
        return typeof value === 'string' || value instanceof String;
      };
    }

    if (!String.prototype.contains) {
      updateSetter(String.prototype, 'contains', String.prototype.includes || function (searchValue) {
        return this.indexOf(searchValue) !== -1;
      });
    }

    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function (searchString, position) {
        const pos = !position || position < 0 ? 0 : +position;
        return this.substr(pos, searchString.length) === searchString;
      };
    }

    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function (searchString, endPosition) {
        const actualEndPosition = endPosition === undefined || endPosition > this.length 
          ? this.length 
          : endPosition;
        return this.substring(actualEndPosition - searchString.length, actualEndPosition) === searchString;
      };
    }

    if (!String.prototype.format) {
      String.prototype.format = function () {
        const args = Array.prototype.slice.call(arguments);
        return this.replace(/{(\d+)}/g, function (match, index) {
          return args[index] !== undefined ? args[index] : match;
        });
      };
    }

    // 数值扩展
    if (!Number.isNumber) {
      updateSetter(Number, 'isNumber', function (value) {
        return typeof value === 'number';
      });
    }

    if (!window.isBoolean) {
      updateSetter(window, 'isBoolean', function (value) {
        return typeof value === 'boolean';
      });
    }

    // 获取元素文本内容
    const getTextContent = function (element) {
      const nodeType = element.nodeType;
      if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof element.textContent === 'string') return element.textContent;
        const textParts = [];
        let child = element.firstChild;
        while (child) {
          textParts.push(getTextContent(child));
          child = child.nextSibling;
        }
        return textParts.join('');
      }
      return ((nodeType === 3 || nodeType === 4) && element.nodeValue) || '';
    };

    // 设置样式属性
    function setStyleProperties(styleProperties) {
      const elementStyle = this.style;
      for (const property in styleProperties) {
        if (styleProperties.hasOwnProperty(property)) {
          elementStyle[property] = styleProperties[property];
        }
      }
    }

    // 设置CSS自定义属性
    function setStyleAttributes(styleAttributes) {
      const elementStyle = this.style;
      for (const attribute in styleAttributes) {
        if (styleAttributes.hasOwnProperty(attribute)) {
          elementStyle.setProperty(attribute, styleAttributes[attribute]);
        }
      }
    }

    // 元素原型扩展
    Element.prototype.getText = function () {
      return getTextContent(this);
    };

    Element.prototype.setText = function (textContent) {
      function setElementText(element, content) {
        if (content instanceof DocumentFragment || content instanceof Node) {
          element.empty();
          element.appendChild(content);
          return;
        }
        
        if (!String.isString(content)) content = String(content);
        
        const nodeType = element.nodeType;
        if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
          element.textContent = content;
        }
      }
      
      setElementText(this, textContent);
    };

    Element.prototype.addClass = function () {
      const classes = Array.prototype.slice.call(arguments);
      this.addClasses(classes);
    };

    Element.prototype.addClasses = function (classes) {
      if (classes) for (let i = 0; i < classes.length; i++) this.classList.add(classes[i]);
    };

    Element.prototype.removeClass = function () {
      const classes = Array.prototype.slice.call(arguments);
      this.removeClasses(classes);
    };

    Element.prototype.removeClasses = function (classes) {
      for (let i = 0; i < classes.length; i++) this.classList.remove(classes[i]);
    };

    Element.prototype.toggleClass = function (classes, shouldAdd) {
      if (!(classes instanceof Array)) classes = [classes];
      if (shouldAdd) this.addClasses(classes);
      else this.removeClasses(classes);
    };

    Element.prototype.hasClass = function (className) {
      return this.classList.contains(className);
    };

    // 为多个原型添加prepend方法
    [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (prototype) {
      updateSetter(prototype, 'prepend', function () {
        const nodes = Array.prototype.slice.call(arguments);
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          fragment.appendChild(
            node instanceof Node ? node : document.createTextNode(String(node))
          );
        }
        
        this.insertBefore(fragment, this.firstChild);
      });
    });

    // 节点原型扩展
    Node.prototype.detach = function () {
      if (this.parentNode) this.parentNode.removeChild(this);
    };

    Node.prototype.empty = function () {
      while (this.lastChild) this.removeChild(this.lastChild);
    };

    Node.prototype.insertAfter = function (newNode, referenceNode) {
      if (referenceNode) this.insertBefore(newNode, referenceNode.nextSibling);
      else this.insertBefore(newNode, this.firstChild);
      return newNode;
    };

    Node.prototype.indexOf = function (childNode) {
      return Array.prototype.indexOf.call(this.childNodes, childNode);
    };

    Node.prototype.setChildrenInPlace = function (newChildren) {
      let currentChild = this.firstChild;
      const childrenSet = new Set(newChildren);
      
      for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        
        while (currentChild && !childrenSet.has(currentChild)) {
          const removedChild = currentChild;
          currentChild = currentChild.nextSibling;
          this.removeChild(removedChild);
        }
        
        if (newChild !== currentChild) this.insertBefore(newChild, currentChild);
        else currentChild = currentChild.nextSibling;
      }
      
      while (currentChild) {
        const removedChild = currentChild;
        currentChild = currentChild.nextSibling;
        this.removeChild(removedChild);
      }
    };

    Node.prototype.appendText = function (text) {
      this.appendChild(document.createTextNode(text));
    };

    Node.prototype.instanceOf = function (constructor) {
      if (this instanceof constructor) return true;
      const windowConstructor = this.win[constructor.name];
      return !!(windowConstructor && this instanceof windowConstructor) ||
             !!((windowConstructor = this.constructorWin[constructor.name]) && this instanceof windowConstructor);
    };

    updateGetter(Node.prototype, 'doc', function () {
      return this.ownerDocument || document;
    });

    updateGetter(Node.prototype, 'win', function () {
      return this.doc.defaultView || window;
    });

    Node.prototype.constructorWin = window;

    // 属性操作方法
    Element.prototype.setAttr = function (attribute, value) {
      if (value === null) this.removeAttribute(attribute);
      else this.setAttribute(attribute, String(value));
    };

    Element.prototype.setAttrs = function (attributes) {
      for (const attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
          const value = attributes[attr];
          this.setAttr(attr, value);
        }
      }
    };

    Element.prototype.getAttr = Element.prototype.getAttribute;

    updateSetter(Element.prototype, 'matchParent', function (selector, stopAt) {
      if (this.matches(selector)) return this;
      if (this === stopAt) return null;
      const parent = this.parentElement;
      return parent ? parent.matchParent(selector, stopAt) : null;
    });

    Element.prototype.getCssPropertyValue = function (property, pseudoElement) {
      return getComputedStyle(this, pseudoElement).getPropertyValue(property).trim();
    };

    updateSetter(Element.prototype, 'isActiveElement', function () {
      let element = this;
      while (element) {
        if (element.doc.activeElement !== element) return false;
        const frameElement = element.win.frameElement;
        if (!frameElement) return element.win === activeWindow;
        element = frameElement;
      }
      return false;
    });

    // 显示/隐藏相关方法
    if (!HTMLElement.prototype.show) {
      HTMLElement.prototype.show = function () {
        if (this.style.display === 'none') {
          this.style.display = this.getAttribute('data-display') || '';
          this.removeAttribute('data-display');
        }
      };
    }

    if (!HTMLElement.prototype.hide) {
      HTMLElement.prototype.hide = function () {
        const currentDisplay = this.style.display;
        if (currentDisplay !== 'none') {
          this.style.display = 'none';
          if (currentDisplay) this.setAttribute('data-display', currentDisplay);
          else this.removeAttribute('data-display');
        }
      };
    }

    if (!HTMLElement.prototype.toggle) {
      HTMLElement.prototype.toggle = function (shouldShow) {
        if (shouldShow) this.show();
        else this.hide();
      };
    }

    if (!HTMLElement.prototype.toggleVisibility) {
      HTMLElement.prototype.toggleVisibility = function (isVisible) {
        this.style.visibility = isVisible ? '' : 'hidden';
      };
    }

    updateSetter(HTMLElement.prototype, 'isShown', function () {
      return !!this.offsetParent;
    });

    updateGetter(HTMLElement.prototype, 'innerWidth', function () {
      const computedStyle = getComputedStyle(this);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      return this.scrollWidth - paddingLeft - paddingRight;
    });

    updateGetter(HTMLElement.prototype, 'innerHeight', function () {
      const computedStyle = getComputedStyle(this);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      return this.scrollHeight - paddingTop - paddingBottom;
    });

    // 样式设置方法
    updateSetter(HTMLElement.prototype, 'setCssStyles', setStyleProperties);
    updateSetter(SVGElement.prototype, 'setCssStyles', setStyleProperties);
    updateSetter(HTMLElement.prototype, 'setCssProps', setStyleAttributes);
    updateSetter(SVGElement.prototype, 'setCssProps', setStyleAttributes);

    // 事件监听方法
    updateSetter(HTMLElement.prototype, 'addEventListeners', function (eventListeners) {
      for (const eventType in eventListeners) {
        if (eventListeners.hasOwnProperty(eventType)) {
          const listener = eventListeners[eventType];
          if (typeof listener === 'function') this.addEventListener(eventType, listener);
        }
      }
    });

    // 选择器函数
    window.fish = function (selector) {
      return document.querySelector(selector);
    };

    window.fishAll = function (selector) {
      return Array.prototype.slice.call(document.querySelectorAll(selector));
    };

    Element.prototype.find = function (selector) {
      return this.querySelector(selector);
    };

    Element.prototype.findAll = function (selector) {
      return Array.prototype.slice.call(this.querySelectorAll(selector));
    };

    Element.prototype.findAllSelf = function (selector) {
      const elements = Array.prototype.slice.call(this.querySelectorAll(selector));
      if (this.matches(selector)) elements.unshift(this);
      return elements;
    };

    DocumentFragment.prototype.find = function (selector) {
      return this.querySelector(selector);
    };

    DocumentFragment.prototype.findAll = function (selector) {
      return Array.prototype.slice.call(this.querySelectorAll(selector));
    };

    // 元素创建函数
    Node.prototype.createEl = function (tagName, options, initializer) {
      if (typeof options === 'string') options = { cls: options };
      options = options || {};
      options.parent = this;
      return createEl(tagName, options, initializer);
    };

    Node.prototype.createDiv = function (options, initializer) {
      return this.createEl('div', options, initializer);
    };

    Node.prototype.createSpan = function (options, initializer) {
      return this.createEl('span', options, initializer);
    };

    Node.prototype.createSvg = function (tagName, options, initializer) {
      if (typeof options === 'string') options = { cls: options };
      options = options || {};
      options.parent = this;
      return createSvg(tagName, options, initializer);
    };

    window.createEl = function (tagName, options, initializer) {
      const element = document.createElement(tagName);
      
      if (typeof options === 'string') options = { cls: options };
      const opts = options || {};
      const { cls: className, text: textContent, attr: attributes, title, value, placeholder, type, parent, prepend, href } = opts;
      
      // 应用类名
      if (className) {
        if (Array.isArray(className)) element.className = className.join(' ');
        else element.className = className;
      }
      
      // 应用文本内容
      if (textContent) element.setText(textContent);
      
      // 应用属性
      if (attributes) element.setAttrs(attributes);
      
      // 应用标题
      if (title !== undefined) element.title = title;
      
      // 应用值
      if (value !== undefined) {
        if (element instanceof HTMLInputElement || 
            element instanceof HTMLSelectElement || 
            element instanceof HTMLOptionElement) {
          element.value = value;
        }
      }
      
      // 应用类型
      if (type) {
        if (element instanceof HTMLInputElement) element.type = type;
        else if (element instanceof HTMLStyleElement) element.setAttribute('type', type);
      }
      
      // 应用占位符
      if (placeholder && element instanceof HTMLInputElement) element.placeholder = placeholder;
      
      // 应用链接地址
      if (href && 
         (element instanceof HTMLAnchorElement || 
          element instanceof HTMLLinkElement || 
          element instanceof HTMLBaseElement)) {
        element.href = href;
      }
      
      // 应用初始化函数
      if (initializer) initializer(element);
      
      // 添加到父元素
      if (parent) {
        if (prepend) parent.insertBefore(element, parent.firstChild);
        else parent.appendChild(element);
      }
      
      // 应用事件处理器
      for (const optionName in options) {
        if (options.hasOwnProperty(optionName) && optionName.startsWith('on')) {
          const eventName = optionName;
          const eventHandler = options[eventName];
          if (typeof eventHandler === 'function') {
            element.addEventListener(eventName.substring(2), eventHandler);
          }
        }
      }
      
      return element;
    };

    window.createDiv = function (options, initializer) {
      return createEl('div', options, initializer);
    };

    window.createSpan = function (options, initializer) {
      return createEl('span', options, initializer);
    };

    window.createSvg = function (tagName, options, initializer) {
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);
      
      if (typeof options === 'string') options = { cls: options };
      const opts = options || {};
      const { cls: className, attr: attributes, parent, prepend } = opts;
      
      // 应用类名
      if (className) {
        if (Array.isArray(className)) svgElement.classList.add(...className);
        else svgElement.classList.add(className);
      }
      
      // 应用属性
      if (attributes) svgElement.setAttrs(attributes);
      
      // 应用初始化函数
      if (initializer) initializer(svgElement);
      
      // 添加到父元素
      if (parent) {
        if (prepend) parent.insertBefore(svgElement, parent.firstChild);
        else parent.appendChild(svgElement);
      }
      
      return svgElement;
    };

    window.createFragment = function (initializer) {
      const fragment = document.createDocumentFragment();
      if (initializer) initializer(fragment);
      return fragment;
    };

    // 事件处理函数
    const ElementOn = function (eventType, selector, listener, options) {
      let events = this._EVENTS;
      if (!events) {
        events = {};
        this._EVENTS = events;
      }
      
      let listeners = events[eventType];
      if (!listeners) {
        listeners = [];
        events[eventType] = listeners;
      }
      
      const callback = function (event) {
        const target = event.target;
        if (target.matchParent) {
          const matchedElement = target.matchParent(selector, event.currentTarget);
          if (matchedElement) listener.call(this, event, matchedElement);
        }
      };
      
      listeners.push({ 
        selector: selector, 
        listener: listener, 
        options: options, 
        callback: callback 
      });
      
      this.addEventListener(eventType, callback, options);
    };

    const ElementOff = function (eventType, selector, listener, options) {
      const element = this;
      const events = this._EVENTS;
      
      if (events) {
        const listeners = events[eventType];
        if (listeners) {
          events[eventType] = listeners.filter(function (item) {
            if (item.selector === selector && item.listener === listener && item.options === options) {
              const callback = item.callback;
              element.removeEventListener(eventType, callback, options);
              return false;
            }
            return true;
          });
        }
      }
    };

    HTMLElement.prototype.on = ElementOn;
    HTMLElement.prototype.off = ElementOff;
    Document.prototype.on = ElementOn;
    Document.prototype.off = ElementOff;

    HTMLElement.prototype.onClickEvent = function (listener, options) {
      this.addEventListener('click', listener, options);
      this.addEventListener('auxclick', listener, options);
    };

    HTMLElement.prototype.trigger = function (type) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, false);
      this.dispatchEvent(event);
    };

    // 事件原型扩展
    updateGetter(UIEvent.prototype, 'targetNode', function () {
      return this.target;
    });

    updateGetter(UIEvent.prototype, 'win', function () {
      return this.view || window;
    });

    updateGetter(UIEvent.prototype, 'doc', function () {
      return this.win.document;
    });

    UIEvent.prototype.instanceOf = function (constructor) {
      if (this instanceof constructor) return true;
      const view = this.view;
      if (!view) return false;
      const namedConstructor = view[constructor.name];
      return namedConstructor && namedConstructor !== constructor && this instanceof namedConstructor;
    };

    // 节点插入事件
    const nodeInsertionCount = new WeakMap();

    HTMLElement.prototype.onNodeInserted = function (callback, cleanupCallback) {
      const element = this;
      
      const animationHandler = function (event) {
        if (element.isShown() && 
            event.animationName === 'node-inserted' && 
            event.target === element) {
          if (cleanupCallback) removeAnimationListeners();
          callback();
        }
      };
      
      const removeAnimationListeners = function () {
        element.removeEventListener('animationstart', animationHandler);
        let count = (nodeInsertionCount.get(element) || 0) - 1;
        
        if (count <= 0) {
          nodeInsertionCount.delete(element);
          element.removeClass('node-insert-event');
        } else {
          nodeInsertionCount.set(element, count);
        }
      };
      
      nodeInsertionCount.set(this, (nodeInsertionCount.get(this) || 0) + 1);
      this.addClass('node-insert-event');
      this.addEventListener('animationstart', animationHandler);
      
      return removeAnimationListeners;
    };

    HTMLElement.prototype.onWindowMigrated = function (callback) {
      const element = this;
      let currentWindow = this.win;
      
      return this.onNodeInserted(function () {
        const newWindow = element.win;
        if (newWindow !== currentWindow) callback(currentWindow = newWindow);
      });
    };

    // AJAX 函数
    window.ajax = function (request) {
      const method = request.method || 'GET';
      const url = request.url;
      const success = request.success;
      const error = request.error;
      const data = request.data;
      const headers = request.headers;
      const withCredentials = request.withCredentials;
      
      const xhr = new XMLHttpRequest();
      request.req = xhr;
      
      xhr.open(method, url, true);
      
      xhr.onload = function () {
        const status = xhr.status;
        const response = xhr.response;
        
        if (status >= 200 && status < 400) {
          if (success) success(response, xhr);
        } else {
          if (error) error(response, xhr);
        }
      };
      
      xhr.onerror = function (errorEvent) {
        if (error) error(errorEvent, xhr);
      };
      
      if (headers) {
        for (const header in headers) {
          if (headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, headers[header]);
          }
        }
      }
      
      xhr.withCredentials = withCredentials || false;
      
      if (data) {
        if (withCredentials === undefined) {
          xhr.withCredentials = true;
        }
        
        if (typeof data === 'string') {
          xhr.send(data);
        } else if (data instanceof ArrayBuffer) {
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.send(data);
        } else {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
          xhr.send(JSON.stringify(data));
        }
      } else {
        xhr.send();
      }
    };

    window.ajaxPromise = function (request) {
      return new Promise(function (resolve, reject) {
        request.success = resolve;
        request.error = function (errorResponse, xhr) {
          reject(xhr);
        };
        ajax(request);
      });
    };

    // 工具函数
    window.ready = function (listener) {
      if (document.readyState !== 'loading') {
        listener();
      } else {
        document.addEventListener('DOMContentLoaded', listener);
      }
    };

    window.sleep = function (timeout) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, timeout);
      });
    };

    window.nextFrame = function () {
      return new Promise(function (resolve) {
        window.requestAnimationFrame(function () {
          resolve();
        });
      });
    };

    window.activeWindow = window;
    window.activeDocument = document;
  }

  enhance();
  window.globalEnhance = enhance;
})();